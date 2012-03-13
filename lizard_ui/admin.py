from django.contrib import admin
from lizard_security.admin import SecurityFilteredAdmin

from lizard_ui.models import ApplicationIcon
from lizard_ui.models import ApplicationScreen


class ApplicationIconInline(admin.TabularInline):
    model = ApplicationIcon
    fk_name = 'application_screen'


class ApplicationScreenAdmin(admin.ModelAdmin):
    inlines = [ApplicationIconInline, ]


admin.site.register(ApplicationIcon, SecurityFilteredAdmin)
admin.site.register(ApplicationScreen, ApplicationScreenAdmin)
