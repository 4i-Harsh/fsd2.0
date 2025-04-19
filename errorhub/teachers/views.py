from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TeacherRegistrationSerializer, TeacherLoginSerializer, TeacherProfileSerializer
from .models import Teacher, TeacherProfile, TeacherProfileVerification
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

class TeacherRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeacherRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            teacher = serializer.save()
            return Response({
                "message": "Teacher registered successfully",
                "username": teacher.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeacherLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeacherLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            response_data = serializer.validated_data
            user = response_data.pop('user')  # Remove user object from response
            
            # Get teacher profile and verification status
            try:
                teacher = Teacher.objects.get(user=user)
                has_profile = hasattr(teacher, 'profile')
                if has_profile:
                    verification = TeacherProfileVerification.objects.get(profile=teacher.profile)
                    response_data['profile_status'] = {
                        'has_profile': True,
                        'verification_status': verification.status
                    }
                else:
                    response_data['profile_status'] = {
                        'has_profile': False,
                        'verification_status': None
                    }
            except (Teacher.DoesNotExist, TeacherProfileVerification.DoesNotExist):
                response_data['profile_status'] = {
                    'has_profile': False,
                    'verification_status': None
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeacherLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherProfileCreateView(generics.CreateAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Get or create Teacher instance
        teacher, created = Teacher.objects.get_or_create(user=request.user)
        
        # Check if teacher already has a profile
        if hasattr(teacher, 'profile'):
            return Response(
                {"detail": "Profile already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = self.perform_create(serializer)
        
        # Create verification request
        TeacherProfileVerification.objects.create(
            profile=profile,
            status='pending'
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        teacher = Teacher.objects.get(user=self.request.user)
        profile = serializer.save(teacher=teacher)
        return profile

class TeacherProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        teacher = Teacher.objects.get(user=self.request.user)
        return teacher.profile

class TeachersWithProfilesView(APIView):
    """
    API view to fetch all teachers with their profiles joined
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        try:
            # Get all teachers
            teachers = Teacher.objects.all()
            
            # Prepare the response data with both teacher and profile info
            result = []
            for teacher in teachers:
                teacher_data = {
                    'id': teacher.id,
                    'user': {
                        'id': teacher.user.id,
                        'username': teacher.user.username,
                        'email': teacher.user.email
                    } if teacher.user else None
                }
                
                # Try to get the profile
                try:
                    profile = TeacherProfile.objects.get(teacher=teacher)
                    profile_serializer = TeacherProfileSerializer(profile)
                    teacher_data['profile'] = profile_serializer.data
                except TeacherProfile.DoesNotExist:
                    teacher_data['profile'] = {}
                
                result.append(teacher_data)
            
            return Response(result)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TeacherProfileByUsernameView(APIView):
    """
    API view to fetch a specific teacher profile by username
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username, format=None):
        try:
            # Get the teacher by username
            user = User.objects.get(username=username)
            teacher = Teacher.objects.get(user=user)
            
            # Get the profile
            try:
                profile = TeacherProfile.objects.get(teacher=teacher)
                serializer = TeacherProfileSerializer(profile)
                return Response(serializer.data)
            except TeacherProfile.DoesNotExist:
                return Response(
                    {'error': 'Teacher profile not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Teacher.DoesNotExist:
            return Response(
                {'error': 'Teacher not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
