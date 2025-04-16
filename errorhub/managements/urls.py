from django.urls import path
from .views import (
    ManagementRegistrationView, 
    ManagementLoginView,
    InternshipCreateView,
    InternshipListView,
    InternshipDetailView,
    AllVerificationsListView,
    PendingVerificationsListView,
    TeacherProfileVerificationView,
    StudentApplicationsListView,
    InternshipApplicationsView,
    StudentProfileView,
    TeacherListView,
    MentorAssignmentCreateView,
    MentorAssignmentListView
)

urlpatterns = [
    path('register/', ManagementRegistrationView.as_view(), name='management-register'),
    path('login/', ManagementLoginView.as_view(), name='management-login'),
    path('internships/', InternshipListView.as_view(), name='internship-list'),
    path('internships/create/', InternshipCreateView.as_view(), name='internship-create'),
    path('internships/<int:pk>/', InternshipDetailView.as_view(), name='internship-detail'),
    path('applications/', StudentApplicationsListView.as_view(), name='all-applications'),
    path('internships/<int:internship_id>/applications/', InternshipApplicationsView.as_view(), name='internship-applications'),
    path('students/<str:student_id>/', StudentProfileView.as_view(), name='student-profile'),
    path('teachers/', TeacherListView.as_view(), name='teacher-list'),
    path('mentor-assignments/', MentorAssignmentCreateView.as_view(), name='mentor-assignments'),
    path('mentor-assignments/list/', MentorAssignmentListView.as_view(), name='mentor-assignments-list'),
    path('verifications/', AllVerificationsListView.as_view(), name='all-verifications'),
    path('verifications/pending/', PendingVerificationsListView.as_view(), name='pending-verifications'),
    path('verifications/<int:pk>/', TeacherProfileVerificationView.as_view(), name='verification-detail'),
] 