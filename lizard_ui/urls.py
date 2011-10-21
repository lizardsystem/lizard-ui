import logging

from django.conf import settings
from django.conf.urls.defaults import include
from django.conf.urls.defaults import patterns
from django.conf.urls.defaults import url
from django.conf.urls.static import static
from django.contrib import admin
from staticfiles.urls import staticfiles_urlpatterns

import lizard_ui.configchecker
import lizard_ui.views

logger = logging.getLogger(__name__)
lizard_ui.configchecker  # Pyflakes...
admin.autodiscover()


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
    (r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$',
        lizard_ui.views.LoginView.as_view(),
        name='lizard_ui.login'),
    url(r'^accounts/logout/$',
        'lizard_ui.views.simple_logout',
        name='lizard_ui.logout'),
    url(r'^screen/(?P<application_screen_slug>.*)/$',
        'lizard_ui.views.application_screen',
        name='lizard_ui.application_screen'),
    )

urlpatterns += debugmode_urlpatterns()

if settings.DEBUG:  # Pragma: nocover
    # Online documentation, mount it for example in the settings.DEBUG section
    # to get the documentation in your project while developing.
    urlpatterns += patterns(
        'django.views.generic.simple',
        (r'^examples/$', 'direct_to_template',
         {'template': 'lizard_ui/lizard-ui-introduction.html'}),
        (r'^examples/id-locations/$', 'direct_to_template',
         {'template': 'lizard_ui/example.html'}),
        (r'^examples/textual/$', 'direct_to_template',
         {'template': 'lizard_ui/example-textual.html'}),
        (r'^examples/table/$', 'direct_to_template',
         {'template': 'lizard_ui/example-table.html'}),
        (r'^examples/images/$', 'direct_to_template',
         {'template': 'lizard_ui/example-images.html'}),
        (r'^examples/tree/$', 'direct_to_template',
         {'template': 'lizard_ui/example_tree.html'}),
        (r'^examples/vertical/$', 'direct_to_template',
         {'template': 'lizard_ui/example_vertical.html'}),
        (r'^examples/jqueryui/$', 'direct_to_template',
         {'template': 'lizard_ui/example_jqueryui.html'}),
        (r'^examples/collapsible/$', 'direct_to_template',
         {'template': 'lizard_ui/example_collapsible.html'}),
        (r'^examples/sidebarstretch/$', 'direct_to_template',
         {'template': 'lizard_ui/example_sidebarstretch.html'}),
        (r'^examples/printbutton/$', 'direct_to_template',
         {'template': 'lizard_ui/example-printbutton.html'}),
        (r'^examples/accordion/$', 'direct_to_template',
         {'template': 'lizard_ui/example_accordion1.html'}),
        (r'^examples/accordion2/$', 'direct_to_template',
         {'template': 'lizard_ui/example_accordion2.html'}),
        (r'^examples/accordion3/$', 'direct_to_template',
         {'template': 'lizard_ui/example_accordion3.html'}),
        (r'^examples/icons/$', 'direct_to_template',
         {'template': 'lizard_ui/example_icons.html'}),
        (r'^examples/portaltabs/$', 'direct_to_template',
         {'template': 'lizard_ui/example-portaltabs.html'}),
        (r'^examples/appscreens/$', 'direct_to_template',
         {'template': 'lizard_ui/example-appscreens.html'}),
        )
    urlpatterns += patterns(
        '',
        url(r'^examples/breadcrumbs/$',
            'lizard_ui.views.example_breadcrumbs',
            {},
            name='lizard_ui.example_breadcrumbs'),
        )
