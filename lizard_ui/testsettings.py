DEBUG = True
TEMPLATE_DEBUG = True
DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = 'test.db'
SITE_ID = 1
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'lizard_ui']
ROOT_URLCONF = 'lizard_ui.urls'


# Copy this into settings files where you use lizard-ui.
TEMPLATE_CONTEXT_PROCESSORS = (
    # Django default ones:
    "django.core.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    # Extra one to handle static files:
    'staticfiles.context_processors.static_url',
    )
# URL that handles the files served by django-staticfiles
STATIC_URL = '/site-media/'
