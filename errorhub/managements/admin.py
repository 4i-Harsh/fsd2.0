from django.contrib import admin
from .models import Management, Internship, InternshipDetail

@admin.register(Management)
class ManagementAdmin(admin.ModelAdmin):
    list_display = ('user', 'position')
    search_fields = ('user__username', 'position')
    list_filter = ('position',)

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'location', 'start_date', 'end_date', 'application_deadline', 'created_by')
    search_fields = ('title', 'company_name', 'location')
    list_filter = ('start_date', 'end_date', 'application_deadline')
    date_hierarchy = 'created_at'

@admin.register(InternshipDetail)
class InternshipDetailAdmin(admin.ModelAdmin):
    list_display = ('internship', 'duration', 'stipend')
    search_fields = ('internship__title', 'internship__company_name')
    list_filter = ('duration',)
