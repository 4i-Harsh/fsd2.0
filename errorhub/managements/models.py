from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count, Q

class Management(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='management_profile', null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.user.username if self.user else "No User"

class Internship(models.Model):
    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    application_deadline = models.DateField()
    created_by = models.ForeignKey(Management, on_delete=models.CASCADE, related_name='internships')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} at {self.company_name}"
    
    @property
    def total_applications(self):
        """Get the total number of applications for this internship"""
        return self.applications.count()
    
    @property
    def pending_applications_count(self):
        """Get the number of pending applications for this internship"""
        return self.applications.filter(status='pending').count()
    
    @property
    def shortlisted_applications_count(self):
        """Get the number of shortlisted applications for this internship"""
        return self.applications.filter(status='shortlisted').count()
    
    @property
    def rejected_applications_count(self):
        """Get the number of rejected applications for this internship"""
        return self.applications.filter(status='rejected').count()
    
    def get_applications_by_status(self):
        """Get a breakdown of applications by status"""
        return {
            'total': self.total_applications,
            'pending': self.pending_applications_count,
            'shortlisted': self.shortlisted_applications_count,
            'rejected': self.rejected_applications_count
        }
    
    def get_applications_status_percentages(self):
        """Get percentages of applications by status"""
        total = self.total_applications
        if total == 0:
            return {
                'pending': 0,
                'shortlisted': 0,
                'rejected': 0
            }
        
        return {
            'pending': round((self.pending_applications_count / total) * 100, 1),
            'shortlisted': round((self.shortlisted_applications_count / total) * 100, 1),
            'rejected': round((self.rejected_applications_count / total) * 100, 1)
        }

class InternshipDetail(models.Model):
    internship = models.OneToOneField(Internship, on_delete=models.CASCADE, related_name='details')
    requirements = models.TextField(null=True, blank=True)
    responsibilities = models.TextField(null=True, blank=True)
    benefits = models.TextField(null=True, blank=True)
    stipend = models.CharField(max_length=100, blank=True, null=True)
    duration = models.CharField(max_length=100, null=True, blank=True)
    skills_required = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Details for {self.internship.title}"
