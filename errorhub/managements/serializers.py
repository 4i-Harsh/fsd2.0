from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Management, Internship, InternshipDetail

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
    
    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
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