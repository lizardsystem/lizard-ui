from django.conf import settings
from django.urls import include, path
from django.urls import re_path
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import lizard_ui.forms
import lizard_ui.views
import logging


logger = logging.getLogger(__name__)


def debugmode_urlpatterns():
    # Staticfiles url patterns.
    patterns = staticfiles_urlpatterns()
    # User-uploaded media patterns. Used to be arranged by django-staticfiles.
    prefix = settings.MEDIA_URL
    root = settings.MEDIA_ROOT
    if prefix and root:
        patterns += static(prefix, document_root=root)
    else:
        logger.warn("Can't find MEDIA_URL (%s) and/or MEDIA_ROOT (%s).", prefix, root)
    return patterns


urlpatterns = [
    path(
        "accounts/login/",
        auth_views.LoginView.as_view(
            template_name="lizard_ui/login.html",
            authentication_form=lizard_ui.forms.LoginForm,
        ),
        name="lizard_ui.login",
    ),
    path(
        "accounts/logout/", auth_views.LogoutView.as_view(), name="lizard_ui.logout"
    ),
    re_path(
        r"^screen/(?P<slug>.*)/$",
        lizard_ui.views.IconView.as_view(),
        name="lizard_ui.icons",
    ),
    path("", lizard_ui.views.IconView.as_view(), name="lizard_ui.icons"),
    path(
        "accounts/change_language/",
        lizard_ui.views.ChangeLanguageView.as_view(),
        name="lizard_ui.change_language",
    ),
]

if settings.DEBUG:
    urlpatterns += debugmode_urlpatterns()

if getattr(settings, "LIZARD_UI_STANDALONE", False):
    admin.autodiscover()
    urlpatterns += [
        (r"^admin/", include(admin.site.urls)),
    ]
    urlpatterns += debugmode_urlpatterns()
    # Online documentation, mount it for example in the settings.DEBUG section
    # to get the documentation in your project while developing.
    urlpatterns += [
        "",
        path(
            "examples/",
            lizard_ui.views.UiView.as_view(
                template_name="lizard_ui/examples/lizard-ui-introduction.html"
            ),
        ),
        path("examples/blocks_via_view/", lizard_ui.views.ExampleBlockView.as_view()),
    ]
    urlpatterns += [
        "django.views.generic.base",
        (
            r"^examples/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/lizard-ui-introduction.html"},
        ),
        (
            r"^examples/blocks/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-blocks.html"},
        ),
        (
            r"^examples/textual/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-textual.html"},
        ),
        (
            r"^examples/table/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-table.html"},
        ),
        (
            r"^examples/cms/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-cms-layout.html"},
        ),
        (
            r"^examples/images/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-images.html"},
        ),
        (
            r"^examples/tree/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_tree.html"},
        ),
        (
            r"^examples/vertical/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_vertical.html"},
        ),
        (
            r"^examples/jqueryui/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_jqueryui.html"},
        ),
        (
            r"^examples/collapsible/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_collapsible.html"},
        ),
        (
            r"^examples/sidebarstretch/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_sidebarstretch.html"},
        ),
        (
            r"^examples/printbutton/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-printbutton.html"},
        ),
        (
            r"^examples/accordion/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_accordion1.html"},
        ),
        (
            r"^examples/accordion2/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_accordion2.html"},
        ),
        (
            r"^examples/accordion3/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_accordion3.html"},
        ),
        (
            r"^examples/icons/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example_icons.html"},
        ),
        (
            r"^examples/portaltabs/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-portaltabs.html"},
        ),
        (
            r"^examples/appscreens/$",
            "TemplateView",
            {"template_name": "lizard_ui/examples/example-appscreens.html"},
        ),
    ]
    urlpatterns += [
        path(
            "examples/breadcrumbs/",
            "lizard_ui.views.example_breadcrumbs",
            {},
            name="lizard_ui.example_breadcrumbs",
        ),
    ]
