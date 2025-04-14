from django.urls import path
from .views import (
    TeacherRegistrationView,
    TeacherLoginView,
    TeacherProfileCreateView,
    TeacherProfileDetailView,
)

urlpatterns = [
    path('register/', TeacherRegistrationView.as_view(), name='teacher-register'),
    path('login/', TeacherLoginView.as_view(), name='teacher-login'),
    path('profile/create/', TeacherProfileCreateView.as_view(), name='teacher-profile-create'),
    path('profile/', TeacherProfileDetailView.as_view(), name='teacher-profile-detail'),
] 