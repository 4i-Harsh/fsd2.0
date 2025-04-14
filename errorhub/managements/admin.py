from django.contrib import admin
from .models import Management

@admin.register(Management)
class ManagementAdmin(admin.ModelAdmin):
    list_display = ('user', 'position')
    search_fields = ('user__username', 'position')
    list_filter = ('position',)
