import logging

from django.conf import settings
from django.conf.urls import include
from django.conf.urls import patterns
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import lizard_ui.configchecker
import lizard_ui.views

logger = logging.getLogger(__name__)
lizard_ui.configchecker  # Pyflakes...


def debugmode_urlpatterns():
    # Staticfiles url patterns.
    patterns = staticfiles_urlpatterns()
    # User-uploaded media patterns. Used to be arranged by django-staticfiles.
    prefix = settings.MEDIA_URL
    root = settings.MEDIA_ROOT
    if prefix and root:
        patterns += static(prefix, document_root=root)
    else:
        logger.warn("Can't find MEDIA_URL (%s) and/or MEDIA_ROOT (%s).",
                    prefix, root)
    return patterns


urlpatterns = patterns(
    '',
    url(r'^accounts/login/$',
        lizard_ui.views.LoginView.as_view(),
        name='lizard_ui.login'),
    url(r'^accounts/logout/$',
        lizard_ui.views.LogoutView.as_view(),
        name='lizard_ui.logout'),
    url(r'^screen/(?P<slug>.*)/$',
        lizard_ui.views.IconView.as_view(),
        name='lizard_ui.icons'),
    url(r'^$',
        lizard_ui.views.IconView.as_view(),
        name='lizard_ui.icons'),
    url(r'^accounts/change_language/$',
        lizard_ui.views.ChangeLanguageView.as_view(),
        name='lizard_ui.change_language'),
)

if getattr(settings, 'LIZARD_UI_STANDALONE', False):
    admin.autodiscover()
    urlpatterns += patterns(
        '',
        (r'^admin/', include(admin.site.urls)),
    )
    urlpatterns += debugmode_urlpatterns()
    # Online documentation, mount it for example in the settings.DEBUG section
    # to get the documentation in your project while developing.
    urlpatterns += patterns(
        '',
        url(r'^examples/$',
            lizard_ui.views.UiView.as_view(
                template_name='lizard_ui/examples/lizard-ui-introduction.html'
                )),
        url(r'^examples/blocks_via_view/$',
            lizard_ui.views.ExampleBlockView.as_view()),
        )

    from django.views.generic.base import TemplateView
    urlpatterns += patterns(
        (r'^examples/$', TemplateView.as_view(
            template_name='lizard_ui/examples/lizard-ui-introduction.html')),
        (r'^examples/blocks/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-blocks.html')),
        (r'^examples/textual/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-textual.html')),
        (r'^examples/table/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-table.html')),
        (r'^examples/cms/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-cms-layout.html')),
        (r'^examples/images/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-images.html')),
        (r'^examples/tree/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_tree.html')),
        (r'^examples/vertical/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_vertical.html')),
        (r'^examples/jqueryui/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_jqueryui.html')),
        (r'^examples/collapsible/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_collapsible.html')),
        (r'^examples/sidebarstretch/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_sidebarstretch.html')),
        (r'^examples/printbutton/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-printbutton.html')),
        (r'^examples/accordion/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_accordion1.html')),
        (r'^examples/accordion2/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_accordion2.html')),
        (r'^examples/accordion3/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_accordion3.html')),
        (r'^examples/icons/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example_icons.html')),
        (r'^examples/portaltabs/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-portaltabs.html')),
        (r'^examples/appscreens/$', TemplateView.as_view(
            template_name='lizard_ui/examples/example-appscreens.html')),
        )
    urlpatterns += patterns(
        '',
        url(r'^examples/breadcrumbs/$',
            'lizard_ui.views.example_breadcrumbs',
            {},
            name='lizard_ui.example_breadcrumbs'),
        (r'^jsi18n/$', 'django.views.i18n.javascript_catalog', {
            'packages': ('lizard_fewsjdbc',)})
        )
