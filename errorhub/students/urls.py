from django.urls import path
from .views import (
    StudentRegistrationView,
    StudentLoginView,
    StudentProfileView,
    InternshipListView,
    InternshipApplicationView,
    StudentApplicationsView
)

urlpatterns = [
    path('register/', StudentRegistrationView.as_view(), name='student-register'),
    path('login/', StudentLoginView.as_view(), name='student-login'),
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    path('internships/', InternshipListView.as_view(), name='internship-list'),
    path('internships/apply/', InternshipApplicationView.as_view(), name='internship-apply'),
    path('applications/', StudentApplicationsView.as_view(), name='student-applications'),
] 