from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^admin/', include(admin.site.urls)),
    (r'^$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example.html'}),
    (r'^openlayers/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_openlayers.html'}),
    (r'^vertical/$', 'django.views.generic.simple.direct_to_template',
     {'template': 'lizard_ui/example_vertical.html'}),
    )


if settings.DEBUG:
    # Add this also to the projects that use lizard-ui
    urlpatterns += patterns('',
        (r'', include('staticfiles.urls')),
    )
