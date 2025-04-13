from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Student

@admin.register(Student)
class StudentAdmin(UserAdmin):
    list_display = ('email', 'username', 'student_id', 'department', 'year', 'is_active')
    list_filter = ('department', 'year', 'is_active')
    search_fields = ('email', 'username', 'student_id')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'student_id', 'department', 'year')}),
        ('Profile info', {'fields': ('cgpa', 'phone_number', 'address', 'date_of_birth', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'student_id', 'department', 'year', 'password1', 'password2'),
        }),
    )
