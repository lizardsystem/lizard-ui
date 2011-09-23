import logging
import os
import sys

from django.conf import settings

import lizard_ui.testsettings as example_settings

_checkers = []
logger = logging.getLogger(__name__)


def register(checker):
    """Register the checker function for the configchecker management command.

    Use this as a decorator:

        >>> from lizard_ui import configchecker
        >>> configchecker._checkers = []  # Only for Test initialization!
        >>> @configchecker.register
        ... def my_checker():
        ...     print "I'm checkin'"

    Warning: if you put the checker in a separate file, make sure that the
    file is actually imported, otherwise it isn't registered.

    The decorator registers the function so that the management command can
    run all those checker functions.

        >>> len(configchecker.checkers())
        1
        >>> configchecker.checkers()[0]()
        I'm checkin'

    """
    _checkers.append(checker)
    return checker


def checkers():
    """Return registered checker functions."""
    return _checkers


@register
def checker():  # Pragma: nocover
    """Verify lizard_ui's demands on settings.py."""
    if not '' in settings.LOGGING['loggers'].keys():
        print "Setting LOGGING is missing a root ('') log handler."
        print "Can't log other errors. Suggestion:"
        print "from lizard_ui.settingshelper import setup_logging"
        print "LOGGING = setup_logging(BUILDOUT_DIR)"

    for setting in ['MEDIA_URL',
                    'STATIC_URL',
                    'ADMIN_MEDIA_PREFIX',
                    'MEDIA_ROOT',
                    'STATIC_ROOT',
                    'LOGGING',
                    'STATICFILES_FINDERS']:
        if ((not hasattr(settings, setting)) or
            (not getattr(settings, setting))):
            # Not available or empty.
            logger.error("Setting %s is missing. Example value: %s",
                         setting, getattr(example_settings, setting))

    if not ('compressor.finders.CompressorFinder'
            in settings.STATICFILES_FINDERS):
        logger.error(
            "'compressor.finders.CompressorFinder' is missing "
            "from STATICFILES_FINDERS. Suggestion:\n"
            "from lizard_ui.settingshelper import STATICFILES_FINDERS\n"
            "STATICFILES_FINDERS = STATICFILES_FINDERS")

    for old_setting in ['COMPRESS_STORAGE', 'COMPRESS_URL', 'COMPRESS_ROOT']:
        if hasattr(settings, old_setting):
            logger.error("Old django_compressor setting %s found: remove it.",
                         old_setting)
    # TODO: compressor settings.
    for app in ['lizard_ui',
                'compressor',
                'staticfiles',
                'django.contrib.admin',
                'django.contrib.auth',
                'django.contrib.contenttypes',
                'django.contrib.sessions',
                'django.contrib.sites']:
        if app not in settings.INSTALLED_APPS:
            logger.error("%s is missing from INSTALLED_APPS.", app)
    if ('lizard_ui.middleware.TracebackLoggingMiddleware' in
        settings.MIDDLEWARE_CLASSES):
        logger.warn("You can remove "
                    "'lizard_ui.middleware.TracebackLoggingMiddleware' "
                    "from MIDDLEWARE_CLASSES, the new logging setup handles "
                    "that automatically.")

    if hasattr(settings, 'SENTRY_REMOTE_URL'):
        if not hasattr(settings, 'SENTRY_KEY'):
            logger.error("You have a SENTRY_REMOTE_URL, but no SENTRY_KEY.")
        production_settings_file = os.path.join(settings.SETTINGS_DIR,
                                                'settings.py')
        if os.path.exists(production_settings_file):
            if not 'sentry_level' in open(production_settings_file,
                                          'r').read():
                logger.warn("You're missing a sentry log handler. Pass "
                            "sentry_level='WARN' to setup_logging().")
        if not 'sentry.client' in settings.INSTALLED_APPS:
            logger.warn("You're missing 'sentry.client' in your ",
                        "INSTALLED_APPS list.")
    else:
        logger.info(
            "You haven't set up sentry yet. Do it, if this is a site. "
            "Add SENTRY_REMOTE_URL for that.")

    if not getattr(settings, 'USE_I18N', False):
        logger.error("Set USE_I18N to True: we're using translations now.")
    if settings.LANGUAGE_CODE == 'en-us':
        logger.warn("LANGUAGE_CODE is set to the default 'en-us', is that "
                    "what you want as default fallback language?")
    if len(settings.LANGUAGES) > 40:
        logger.warn("You haven't restricted 'LANGUAGES'. You probably want "
                    "something like:\n"
                    "LANGUAGES = (\n"
                    "    ('nl', 'Nederlands'),\n"
                    "    ('en', 'English'),\n)")

    __import__(settings.ROOT_URLCONF)
    urlconf = sys.modules[settings.ROOT_URLCONF]
    if not hasattr(urlconf, 'debugmode_urlpatterns'):
        logger.warn(
            "You didn't import the debug url patterns. Suggested usage:\n"
            "from lizard_ui.urls import debugmode_urlpatterns\n"
            "...\n"
            "urlpatterns += debugmode_urlpatterns()")
