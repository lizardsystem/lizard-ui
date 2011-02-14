from django.contrib import admin

from lizard_ui.models import ApplicationIcon
from lizard_ui.models import ApplicationScreen


class ApplicationIconInline(admin.TabularInline):
    model = ApplicationIcon


class ApplicationScreenAdmin(admin.ModelAdmin):
    inlines = [ApplicationIconInline, ]


admin.site.register(ApplicationIcon)
admin.site.register(ApplicationScreen, ApplicationScreenAdmin)
