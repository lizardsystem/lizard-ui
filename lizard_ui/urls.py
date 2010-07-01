from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns(
    '',
    #(r'^admin/', include(admin.site.urls)),
    # Online documentation, mount it for example in the settings.DEBUG section
    # to get the documentation in your project while developing.
    (r'^$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/lizard-ui-introduction.html'}),
    (r'^id-locations/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example.html'}),
    (r'^textual/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example-textual.html'}),
    (r'^images/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example-images.html'}),
    (r'^tree/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_tree.html'}),
    (r'^vertical/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_vertical.html'}),
    (r'^jqueryui/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_jqueryui.html'}),
    (r'^collapsible/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_collapsible.html'}),
    (r'^sidebarstretch/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_sidebarstretch.html'}),
    (r'^accordion/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_accordion1.html'}),
    (r'^accordion2/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_accordion2.html'}),
    (r'^accordion3/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_accordion3.html'}),
    (r'^icons/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_icons.html'}),
    )


if settings.DEBUG:
    # Add this also to the projects that use lizard-ui
    urlpatterns += patterns('',
        (r'', include('staticfiles.urls')),
    )
