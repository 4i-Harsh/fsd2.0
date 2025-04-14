from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    StudentRegistrationSerializer, 
    StudentLoginSerializer, 
    StudentProfileSerializer,
    InternshipSerializer,
    InternshipApplicationSerializer
)
from .models import Student, InternshipApplication
from managements.models import Internship

# Create your views here.

class StudentRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = StudentRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response({
                "message": "Student registered successfully",
                "email": student.user.email,
                "student_id": student.student_id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = StudentLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return Student.objects.get(user=self.request.user)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InternshipListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipSerializer
    
    def get_queryset(self):
        return Internship.objects.all().order_by('-created_at')

class InternshipApplicationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipApplicationSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            application = serializer.save()
            return Response({
                "message": "Application submitted successfully",
                "application_id": application.id,
                "status": application.status
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentApplicationsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipApplicationSerializer
    
    def get_queryset(self):
        student = Student.objects.get(user=self.request.user)
        return InternshipApplication.objects.filter(student=student).order_by('-applied_at')
