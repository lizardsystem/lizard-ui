from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^admin/', include(admin.site.urls)),
    (r'^$', 'django.views.generic.simple.direct_to_template', {'template': 'example.html'}),
    )


if settings.DEBUG:
    # Add this also to the projects that use lizard-ui
    urlpatterns += patterns('',
        (r'', include('staticfiles.urls')),
    )
