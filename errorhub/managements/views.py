from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    ManagementRegistrationSerializer, 
    ManagementLoginSerializer,
    InternshipSerializer,
    InternshipDetailSerializer,
    ManagementStudentProfileSerializer,
    TeacherProfileSerializer,
    MentorAssignmentSerializer
)
from students.models import InternshipApplication, MentorAssignment, Student
from teachers.models import Teacher, TeacherProfileVerification
from teachers.serializers import TeacherProfileVerificationSerializer
from .models import Internship, InternshipDetail

# Create your views here.

class ManagementRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ManagementRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            management = serializer.save()
            return Response({
                "message": "Management user registered successfully",
                "username": management.user.username,
                "position": management.position
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagementLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ManagementLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllVerificationsListView(generics.ListAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return TeacherProfileVerification.objects.none()
        return TeacherProfileVerification.objects.all().order_by('-verification_date')

class PendingVerificationsListView(generics.ListAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return TeacherProfileVerification.objects.none()
        return TeacherProfileVerification.objects.filter(status='pending')

class TeacherProfileVerificationView(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherProfileVerificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        verification_id = self.kwargs.get('pk')
        return TeacherProfileVerification.objects.get(id=verification_id)

    def update(self, request, *args, **kwargs):
        if not hasattr(request.user, 'management_profile'):
            return Response(
                {"detail": "Only management can verify profiles"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

class InternshipCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipSerializer

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'management_profile'):
            raise serializers.ValidationError("Only management can create internships")
        serializer.save()

class InternshipListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipSerializer
    
    def get_queryset(self):
        return Internship.objects.all().order_by('-created_at')

class InternshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InternshipSerializer
    queryset = Internship.objects.all()

    def perform_update(self, serializer):
        if not hasattr(self.request.user, 'management_profile'):
            raise serializers.ValidationError("Only management can update internships")
        serializer.save()

    def perform_destroy(self, instance):
        if not hasattr(self.request.user, 'management_profile'):
            raise serializers.ValidationError("Only management can delete internships")
        instance.delete()

class StudentProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagementStudentProfileSerializer
    lookup_field = 'student_id'
    queryset = Student.objects.all()
    
    def get_object(self):
        student_id = self.kwargs.get('student_id')
        try:
            return Student.objects.get(student_id=student_id)
        except Student.DoesNotExist:
            raise serializers.ValidationError(f"Student with ID {student_id} not found")

class TeacherListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherProfileSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return Teacher.objects.none()
        return Teacher.objects.all()

class MentorAssignmentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MentorAssignmentSerializer
    
    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'management_profile'):
            return Response(
                {"detail": "Only management can assign mentors"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

class MentorAssignmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MentorAssignmentSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return MentorAssignment.objects.none()
        return MentorAssignment.objects.all().order_by('-assigned_at')

class StudentApplicationsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagementStudentProfileSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return Student.objects.none()
        return Student.objects.all().order_by('-user__date_joined')

class InternshipApplicationsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagementStudentProfileSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return Student.objects.none()
        internship_id = self.kwargs.get('internship_id')
        return Student.objects.filter(applications__internship_id=internship_id).order_by('-user__date_joined')
