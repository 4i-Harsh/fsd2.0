from django.urls import path
from .views import (
    StudentRegistrationView,
    StudentLoginView,
    StudentProfileView,
    InternshipListView
)

urlpatterns = [
    path('register/', StudentRegistrationView.as_view(), name='student-register'),
    path('login/', StudentLoginView.as_view(), name='student-login'),
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    path('view_internships/', InternshipListView.as_view(), name='view-internships'),
] 