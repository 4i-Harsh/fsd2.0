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
        fields = ('username', 'email', 'password')

class StudentRegistrationSerializer(serializers.Serializer):
    user = UserSerializer()
    student_id = serializers.CharField(max_length=20)
    department = serializers.CharField(max_length=100)
    year = serializers.IntegerField()
    password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['user']['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password2 = validated_data.pop('password2')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password']
        )
        student = Student.objects.create(user=user, **validated_data)
        return student

class StudentLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Get the user by email instead of username
        try:
            user = User.objects.get(email=attrs['username'])
            attrs['username'] = user.username
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "No active account found with the given credentials"})
        
        data = super().validate(attrs)
        student = Student.objects.get(user=user)
        data['email'] = user.email
        data['student_id'] = student.student_id
        return data

class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'student_id', 'department', 'year',
            'full_name', 'roll_no', 'mobile_no', 'dept_of_study',
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
