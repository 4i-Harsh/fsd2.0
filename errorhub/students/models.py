from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile', null=True, blank=True)
    student_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    year = models.IntegerField()
    
    # Profile fields
    full_name = models.CharField(max_length=100, null=True, blank=True)
    roll_no = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    dept_of_study = models.CharField(max_length=100, null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='student_profiles/', null=True, blank=True)
    
    def __str__(self):
        return self.user.email if self.user else self.student_id

class InternshipApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='applications')
    internship = models.ForeignKey('managements.Internship', on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'internship')
    
    def __str__(self):
        return f"{self.student.student_id} - {self.internship.title}"
