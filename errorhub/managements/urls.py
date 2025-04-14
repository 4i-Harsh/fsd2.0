from django.urls import path
from .views import (
    ManagementRegistrationView, 
    ManagementLoginView,
    AllVerificationsListView,
    PendingVerificationsListView,
    TeacherProfileVerificationView
)

urlpatterns = [
    path('register/', ManagementRegistrationView.as_view(), name='management-register'),
    path('login/', ManagementLoginView.as_view(), name='management-login'),
    path('verifications/all/', AllVerificationsListView.as_view(), name='all-verifications'),
    path('verifications/pending/', PendingVerificationsListView.as_view(), name='pending-verifications'),
    path('verifications/<int:pk>/', TeacherProfileVerificationView.as_view(), name='profile-verification'),
] 