from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TeacherRegistrationSerializer, TeacherLoginSerializer, TeacherProfileSerializer
from .models import Teacher, TeacherProfile

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
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)

class TeacherProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        teacher = Teacher.objects.get(user=self.request.user)
        return teacher.profile
