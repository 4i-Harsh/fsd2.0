from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Management, Internship, InternshipDetail
from students.models import Student, InternshipApplication, MentorAssignment
from teachers.models import Teacher

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('username', 'password')

class ManagementRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    position = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        position = validated_data.pop('position', None)
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        management = Management.objects.create(user=user, position=position)
        return management

class ManagementLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = User.objects.filter(username=username).first()
            
            if user and user.check_password(password):
                if not hasattr(user, 'management_profile'):
                    raise serializers.ValidationError("User is not a management user")
                
                refresh = RefreshToken.for_user(user)
                return {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'username': user.username
                }
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials")
        else:
            raise serializers.ValidationError("Must include username and password")

class InternshipDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipDetail
        fields = '__all__'
        read_only_fields = ('internship',)

class InternshipSerializer(serializers.ModelSerializer):
    details = InternshipDetailSerializer(required=False)
    application_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def get_application_stats(self, obj):
        return {
            'total': obj.total_applications,
            'pending': obj.pending_applications_count,
            'shortlisted': obj.shortlisted_applications_count,
            'rejected': obj.rejected_applications_count,
            'percentages': obj.get_applications_status_percentages()
        }
    
    def create(self, validated_data):
        details_data = validated_data.pop('details', None)
        management = self.context['request'].user.management_profile
        internship = Internship.objects.create(created_by=management, **validated_data)
        
        if details_data:
            InternshipDetail.objects.create(internship=internship, **details_data)
        
        return internship

    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', None)
        
        # Update main internship fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create details
        if details_data:
            details_instance = instance.details
            if details_instance:
                for attr, value in details_data.items():
                    setattr(details_instance, attr, value)
                details_instance.save()
            else:
                InternshipDetail.objects.create(internship=instance, **details_data)
        
        return instance

class ManagementStudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    username = serializers.CharField(source='user.username')
    
    class Meta:
        model = Student
        fields = [
            'student_id', 'department', 'year', 'username', 
            'full_name', 'roll_no', 'email', 'mobile_no',
            'dept_of_study', 'resume', 'linkedin_url', 'profile_pic'
        ]

class TeacherProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    
    class Meta:
        model = Teacher
        fields = ['id', 'username', 'email']

class MentorAssignmentSerializer(serializers.ModelSerializer):
    student_details = ManagementStudentProfileSerializer(source='student', read_only=True)
    student_id = serializers.CharField(write_only=True)
    teacher_details = TeacherProfileSerializer(source='teacher', read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(),
        source='teacher',
        write_only=True
    )
    
    class Meta:
        model = MentorAssignment
        fields = [
            'id', 'student_details', 'student_id', 'teacher_details', 'teacher_id',
            'assigned_by', 'assigned_at', 'notes'
        ]
        read_only_fields = ['assigned_by', 'assigned_at']
    
    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        try:
            student = Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            raise serializers.ValidationError({"student_id": f"Student with ID {student_id} not found"})
        
        management = self.context['request'].user.management_profile
        validated_data['student'] = student
        validated_data['assigned_by'] = management
        return super().create(validated_data)

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating the status of an internship application.
    """
    status = serializers.ChoiceField(choices=InternshipApplication.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = InternshipApplication
        fields = ['status', 'notes']
        
    def validate_status(self, value):
        valid_statuses = [status for status, _ in InternshipApplication.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        return value
        
    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        
        # Add notes as a comment if provided
        notes = validated_data.get('notes')
        if notes and hasattr(instance, 'comments'):
            instance.comments = notes
            
        instance.save()
        return instance

class ApplicationDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed view of an application, including student information.
    """
    student = ManagementStudentProfileSerializer(read_only=True)
    internship = InternshipSerializer(read_only=True)
    resume_url = serializers.SerializerMethodField()
    
    class Meta:
        model = InternshipApplication
        fields = ['id', 'student', 'internship', 'description', 
                  'status', 'applied_at', 'resume_url']
    
    def get_resume_url(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
        return None 