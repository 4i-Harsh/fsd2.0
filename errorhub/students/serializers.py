from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Student

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
    class Meta:
        model = Student
        fields = ('student_id', 'department', 'year', 
                 'cgpa', 'phone_number', 'address', 'date_of_birth', 'profile_picture')
        read_only_fields = ('student_id', 'department', 'year')