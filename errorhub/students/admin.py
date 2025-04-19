from django.contrib import admin
from .models import Student, MentorAssignment

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('get_email', 'get_username', 'student_id', 'department', 'year')
    list_filter = ('department', 'year')
    search_fields = ('student_id', 'user__email', 'user__username')
    ordering = ('user__email',)

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

@admin.register(MentorAssignment)
class MentorAssignmentAdmin(admin.ModelAdmin):
    list_display = ('student_info', 'teacher_info', 'assigned_by_info', 'assigned_at')
    list_filter = ('assigned_at',)
    search_fields = ('student__student_id', 'teacher__user__username', 'assigned_by__user__username')
    ordering = ('-assigned_at',)
    
    def student_info(self, obj):
        return f"{obj.student.student_id} - {obj.student.user.username}"
    student_info.short_description = 'Student'
    
    def teacher_info(self, obj):
        return f"{obj.teacher.user.username}"
    teacher_info.short_description = 'Teacher'
    
    def assigned_by_info(self, obj):
        return f"{obj.assigned_by.user.username}"
    assigned_by_info.short_description = 'Assigned By'
