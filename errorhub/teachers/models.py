from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile', null=True, blank=True)
    
    def __str__(self):
        return self.user.username if self.user else "No User"

class TeacherProfile(models.Model):
    teacher = models.OneToOneField(Teacher, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254, unique=True)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='teacher_photos/', null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(50)])
    linkedin_profile = models.URLField(max_length=200, null=True, blank=True)
    resume = models.FileField(upload_to='teacher_resumes/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.full_name}'s Profile"

class TeacherProfileVerification(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    
    profile = models.OneToOneField(TeacherProfile, on_delete=models.CASCADE, related_name='verification')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verified_by = models.ForeignKey('managements.Management', on_delete=models.SET_NULL, null=True, blank=True)
    verification_date = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Verification for {self.profile.full_name}"
