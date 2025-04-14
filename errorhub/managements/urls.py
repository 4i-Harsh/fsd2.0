from django.urls import path
from .views import ManagementRegistrationView, ManagementLoginView

urlpatterns = [
    path('register/', ManagementRegistrationView.as_view(), name='management-register'),
    path('login/', ManagementLoginView.as_view(), name='management-login'),
] 