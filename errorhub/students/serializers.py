from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Student, InternshipApplication
from managements.models import Internship, InternshipDetail

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('username', 'password')

class StudentRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        password2 = validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        student = Student.objects.create(user=user)
        return student

class StudentLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        try:
            user = self.user
            student = Student.objects.get(user=user)
            data['has_profile'] = bool(student.student_id and student.department and student.year)
            return data
        except Student.DoesNotExist:
            raise serializers.ValidationError({"detail": "No active account found with the given credentials"})

class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    email = serializers.EmailField(required=False)

    class Meta:
        model = Student
        fields = [
            'student_id', 'department', 'year',
            'full_name', 'roll_no', 'email', 'mobile_no', 'dept_of_study',
            'resume', 'linkedin_url', 'profile_pic', 'user'
        ]
        read_only_fields = ('student_id', 'department', 'year')

    def get_user(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email
            }
        return None

class InternshipDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipDetail
        fields = '__all__'

class InternshipSerializer(serializers.ModelSerializer):
    details = InternshipDetailSerializer(read_only=True)
    
    class Meta:
        model = Internship
        fields = '__all__' 
        read_only_fields = ('student_id', 'department', 'year')

class InternshipApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipApplication
        fields = ['internship', 'resume', 'description', 'status', 'applied_at']
        read_only_fields = ['status', 'applied_at']
    
    def validate(self, attrs):
        student = Student.objects.get(user=self.context['request'].user)
        attrs['student'] = student
        
        # Check if student has already applied
        if InternshipApplication.objects.filter(student=student, internship=attrs['internship']).exists():
            raise serializers.ValidationError("You have already applied for this internship.")
        
        return attrs
