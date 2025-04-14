from django.contrib import admin
from .models import Student

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
