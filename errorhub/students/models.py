from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.db.models import Count

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile', null=True, blank=True)
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    
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
    comments = models.TextField(null=True, blank=True, help_text='Management feedback or notes about the application')
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'internship')
    
    def __str__(self):
        return f"{self.student.student_id} - {self.internship.title}"
    
    @classmethod
    def get_status_counts(cls, internship_id=None):
        """
        Get counts of applications by status.
        If internship_id is provided, counts are filtered for that internship.
        """
        queryset = cls.objects
        if internship_id:
            queryset = queryset.filter(internship_id=internship_id)
        
        status_counts = queryset.values('status').annotate(count=Count('id'))
        
        # Convert to a dictionary format for easier use
        result = {
            'pending': 0,
            'shortlisted': 0,
            'rejected': 0,
            'total': queryset.count()
        }
        
        for item in status_counts:
            result[item['status']] = item['count']
            
        return result
    
    @classmethod
    def get_pending_applications(cls, internship_id=None):
        """Get all pending applications, optionally filtered by internship"""
        queryset = cls.objects.filter(status='pending')
        if internship_id:
            queryset = queryset.filter(internship_id=internship_id)
        return queryset
    
    @classmethod
    def get_shortlisted_applications(cls, internship_id=None):
        """Get all shortlisted applications, optionally filtered by internship"""
        queryset = cls.objects.filter(status='shortlisted')
        if internship_id:
            queryset = queryset.filter(internship_id=internship_id)
        return queryset
    
    @classmethod
    def get_rejected_applications(cls, internship_id=None):
        """Get all rejected applications, optionally filtered by internship"""
        queryset = cls.objects.filter(status='rejected')
        if internship_id:
            queryset = queryset.filter(internship_id=internship_id)
        return queryset

class MentorAssignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='mentor_assignments')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='mentor_assignments')
    assigned_by = models.ForeignKey('managements.Management', on_delete=models.CASCADE, related_name='mentor_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.student_id} - {self.teacher.user.username}"
