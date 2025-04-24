from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .serializers import (
    ManagementRegistrationSerializer, 
    ManagementLoginSerializer,
    InternshipSerializer,
    InternshipDetailSerializer,
    ManagementStudentProfileSerializer,
    TeacherProfileSerializer,
    MentorAssignmentSerializer,
    ApplicationStatusUpdateSerializer,
    ApplicationDetailSerializer
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

class ApplicationListView(generics.ListAPIView):
    """
    List all applications for an internship with detailed information.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationDetailSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return InternshipApplication.objects.none()
        
        internship_id = self.kwargs.get('internship_id')
        return InternshipApplication.objects.filter(
            internship_id=internship_id
        ).order_by('-applied_at')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ApplicationDetailView(generics.RetrieveAPIView):
    """
    Retrieve detailed information about a specific application.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationDetailSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return InternshipApplication.objects.none()
        return InternshipApplication.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """
    Update the status of an application (shortlist or reject).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationStatusUpdateSerializer
    
    def get_queryset(self):
        if not hasattr(self.request.user, 'management_profile'):
            return InternshipApplication.objects.none()
        return InternshipApplication.objects.all()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return a more detailed response including student info
        return Response({
            "message": f"Application status updated to {instance.status}",
            "application_id": instance.id,
            "student_id": instance.student.student_id,
            "student_name": instance.student.full_name,
            "internship_title": instance.internship.title,
            "status": instance.status,
            "comments": instance.comments
        })
    
    def perform_update(self, serializer):
        # Check if the user is management before allowing update
        if not hasattr(self.request.user, 'management_profile'):
            raise serializers.ValidationError("Only management can update application status")
        serializer.save()

class BulkApplicationStatusUpdateView(generics.GenericAPIView):
    """
    Update the status of multiple applications at once.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationStatusUpdateSerializer
    
    def post(self, request, *args, **kwargs):
        if not hasattr(request.user, 'management_profile'):
            return Response(
                {"detail": "Only management can update application status"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application_ids = request.data.get('application_ids', [])
        new_status = request.data.get('status')
        comments = request.data.get('comments', '')
        
        if not application_ids or not new_status:
            return Response(
                {"detail": "application_ids and status are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate the status value
        valid_statuses = [status for status, _ in InternshipApplication.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get applications that belong to the management user
        applications = InternshipApplication.objects.filter(id__in=application_ids)
        
        if not applications.exists():
            return Response(
                {"detail": "No valid applications found with the provided IDs"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update the status of all applications
        updated_count = 0
        for application in applications:
            application.status = new_status
            if comments:
                application.comments = comments
            application.save()
            updated_count += 1
        
        return Response({
            "message": f"Successfully updated {updated_count} applications to status '{new_status}'",
            "updated_count": updated_count
        }, status=status.HTTP_200_OK)

class ApplicationStatsView(APIView):
    """
    Get application statistics for an internship or all internships combined.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, internship_id=None):
        if not hasattr(request.user, 'management_profile'):
            return Response({"detail": "Only management can access this resource"}, status=status.HTTP_403_FORBIDDEN)
        
        if internship_id:
            # Get stats for specific internship
            try:
                internship = Internship.objects.get(id=internship_id)
                stats = internship.get_applications_by_status()
                percentages = internship.get_applications_status_percentages()
                
                return Response({
                    "internship_id": internship_id,
                    "title": internship.title,
                    "company": internship.company_name,
                    "stats": stats,
                    "percentages": percentages
                })
            except Internship.DoesNotExist:
                return Response({"detail": f"Internship with ID {internship_id} not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Get aggregated stats for all internships
            total_applications = InternshipApplication.objects.count()
            pending_count = InternshipApplication.objects.filter(status='pending').count()
            shortlisted_count = InternshipApplication.objects.filter(status='shortlisted').count()
            rejected_count = InternshipApplication.objects.filter(status='rejected').count()
            
            stats = {
                'total': total_applications,
                'pending': pending_count,
                'shortlisted': shortlisted_count,
                'rejected': rejected_count
            }
            
            # Calculate percentages
            if total_applications > 0:
                percentages = {
                    'pending': round((pending_count / total_applications) * 100, 1),
                    'shortlisted': round((shortlisted_count / total_applications) * 100, 1),
                    'rejected': round((rejected_count / total_applications) * 100, 1)
                }
            else:
                percentages = {'pending': 0, 'shortlisted': 0, 'rejected': 0}
            
            # Get stats per internship
            internships_stats = []
            for internship in Internship.objects.all():
                internship_stats = internship.get_applications_by_status()
                if internship_stats['total'] > 0:
                    internships_stats.append({
                        'id': internship.id,
                        'title': internship.title,
                        'company': internship.company_name,
                        'stats': internship_stats,
                        'percentages': internship.get_applications_status_percentages()
                    })
            
            return Response({
                'overall_stats': stats,
                'overall_percentages': percentages,
                'internships': internships_stats
            })
