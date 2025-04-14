from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Teacher, TeacherProfile, TeacherProfileVerification
from django.utils import timezone

class TeacherRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        Teacher.objects.create(user=user)
        return user

class TeacherLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = User.objects.filter(username=username).first()
            
            if user and user.check_password(password):
                if not hasattr(user, 'teacher_profile'):
                    raise serializers.ValidationError("User is not a teacher")
                
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

class TeacherProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        max_length=254,
        error_messages={
            'invalid': 'Please enter a valid email address.',
            'blank': 'Email field cannot be blank.',
        }
    )
    
    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'full_name', 'email', 'department', 'designation',
            'photo', 'years_of_experience', 'linkedin_profile', 'resume',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email field is required.")
        return value.lower()  # Convert email to lowercase

    def validate_full_name(self, value):
        return value.strip('"')  # Remove any escaped quotes

    def validate_department(self, value):
        return value.strip('"')  # Remove any escaped quotes

    def validate_designation(self, value):
        return value.strip('"')  # Remove any escaped quotes

    def create(self, validated_data):
        teacher = self.context['request'].user.teacher_profile
        profile = TeacherProfile.objects.create(teacher=teacher, **validated_data)
        # Create verification record
        TeacherProfileVerification.objects.create(profile=profile)
        return profile

class TeacherProfileVerificationSerializer(serializers.ModelSerializer):
    profile = TeacherProfileSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfileVerification
        fields = ['id', 'profile', 'status', 'verified_by', 'verification_date', 'comments']
        read_only_fields = ['verified_by', 'verification_date']

    def update(self, instance, validated_data):
        if 'status' in validated_data:
            instance.status = validated_data['status']
            instance.verified_by = self.context['request'].user.management_profile
            instance.verification_date = timezone.now()
        if 'comments' in validated_data:
            instance.comments = validated_data['comments']
        instance.save()
        return instance 