from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

Student = get_user_model()

class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Student
        fields = ('email', 'username', 'password', 'password2', 'student_id', 'department', 'year')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        student = Student.objects.create_user(**validated_data)
        return student

class StudentLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['student_id'] = user.student_id
        return token

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('email', 'username', 'student_id', 'department', 'year', 
                 'cgpa', 'phone_number', 'address', 'date_of_birth', 'profile_picture')
        read_only_fields = ('email', 'username', 'student_id', 'department', 'year') 