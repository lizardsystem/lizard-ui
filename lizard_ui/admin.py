from django.contrib import admin
from lizard_security.admin import SecurityFilteredAdmin

from lizard_ui.models import ApplicationIcon
from lizard_ui.models import ApplicationScreen
from lizard_ui.models import CustomerLogo


class ApplicationIconInline(admin.TabularInline):
    model = ApplicationIcon
    fk_name = 'application_screen'


class ApplicationScreenAdmin(admin.ModelAdmin):
    inlines = [ApplicationIconInline, ]


class ApplicationIconAdmin(SecurityFilteredAdmin):
    list_display = ['__str__', 'name', 'url']
    list_editable = ['url', 'name']


class CustomerLogoAdmin(admin.ModelAdmin):
    list_display = ['name', 'used']


admin.site.register(ApplicationIcon, ApplicationIconAdmin)
admin.site.register(ApplicationScreen, ApplicationScreenAdmin)
admin.site.register(CustomerLogo, CustomerLogoAdmin)
