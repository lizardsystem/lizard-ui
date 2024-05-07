from django.contrib import admin
from lizard_ui.models import ApplicationIcon
from lizard_ui.models import ApplicationScreen


class ApplicationIconInline(admin.TabularInline):
    model = ApplicationIcon
    fk_name = "application_screen"


@admin.register(ApplicationScreen)
class ApplicationScreenAdmin(admin.ModelAdmin):
    inlines = [
        ApplicationIconInline,
    ]


@admin.register(ApplicationIcon)
class ApplicationIconAdmin(admin.ModelAdmin):
    list_display = ["__str__", "name", "url"]
    list_editable = ["url", "name"]


