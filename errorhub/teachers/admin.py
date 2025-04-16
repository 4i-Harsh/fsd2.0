from django.contrib import admin
from .models import Teacher, TeacherProfile, TeacherProfileVerification

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_email')
    search_fields = ('user__username', 'user__email')
    
    def get_email(self, obj):
        return obj.user.email if obj.user else '-'
    get_email.short_description = 'Email'

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'department', 'designation', 'years_of_experience', 'created_at')
    search_fields = ('full_name', 'email', 'department')
    list_filter = ('department', 'designation')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'

@admin.register(TeacherProfileVerification)
class TeacherProfileVerificationAdmin(admin.ModelAdmin):
    list_display = ('get_teacher_name', 'status', 'verified_by', 'verification_date')
    list_filter = ('status',)
    search_fields = ('profile__full_name', 'profile__email')
    readonly_fields = ('verification_date',)
    
    def get_teacher_name(self, obj):
        return obj.profile.full_name
    get_teacher_name.short_description = 'Teacher Name'
    get_teacher_name.admin_order_field = 'profile__full_name'
