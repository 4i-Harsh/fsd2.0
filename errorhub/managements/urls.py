from django.urls import path
from .views import (
    ManagementRegistrationView, 
    ManagementLoginView,
    InternshipCreateView,
    InternshipListView,
    InternshipDetailView,
    AllVerificationsListView,
    PendingVerificationsListView,
    TeacherProfileVerificationView
)

urlpatterns = [
    path('register/', ManagementRegistrationView.as_view(), name='management-register'),
    path('login/', ManagementLoginView.as_view(), name='management-login'),
    path('internships/', InternshipListView.as_view(), name='internship-list'),
    path('internships/create/', InternshipCreateView.as_view(), name='internship-create'),
    path('internships/<int:pk>/', InternshipDetailView.as_view(), name='internship-detail'),
    path('verifications/', AllVerificationsListView.as_view(), name='all-verifications'),
    path('verifications/pending/', PendingVerificationsListView.as_view(), name='pending-verifications'),
    path('verifications/<int:pk>/', TeacherProfileVerificationView.as_view(), name='verification-detail'),
] 