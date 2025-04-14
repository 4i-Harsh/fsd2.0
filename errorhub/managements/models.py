from django.db import models
from django.contrib.auth.models import User

class Management(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='management_profile', null=True, blank=True)
    position = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.user.username if self.user else "No User"
