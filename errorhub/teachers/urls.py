from django.urls import path
from .views import (
    TeacherRegistrationView,
    TeacherLoginView,
    TeacherLogoutView,
    TeachersWithProfilesView,
    TeacherProfileByUsernameView,
    TeacherProfileCreateView,
    TeacherProfileDetailView,
)

urlpatterns = [
    path('register/', TeacherRegistrationView.as_view(), name='teacher-register'),
    path('login/', TeacherLoginView.as_view(), name='teacher-login'),
    path('logout/', TeacherLogoutView.as_view(), name='teacher-logout'),
    path('profile/create/', TeacherProfileCreateView.as_view(), name='teacher-profile-create'),
    path('profile/', TeacherProfileDetailView.as_view(), name='teacher-profile-detail'),
    path('with-profiles/', TeachersWithProfilesView.as_view(), name='teachers-with-profiles'),
    path('profile/by-username/<str:username>/', TeacherProfileByUsernameView.as_view(), name='teacher-profile-by-username'),
] 