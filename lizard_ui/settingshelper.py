import os

STATICFILES_FINDERS = (
    'staticfiles.finders.FileSystemFinder',
    'staticfiles.finders.AppDirectoriesFinder',
    # Enable 'old' /media directories in addition to /static.
    'staticfiles.finders.LegacyAppDirectoriesFinder',
    # Enable support for django-compressor.
    'compressor.finders.CompressorFinder',
    )


def setup_logging(buildout_dir,
                  console_level='DEBUG',
                  file_level='WARN',
                  sentry_level=None,
                  sql=False):
    """Return configuration dict for logging.

    Some keyword arguments can be used to configure the logging.

    - ``console_level='DEBUG'`` sets the console level. None means quiet.

    - ``file_level='WARN'`` sets the var/log/django.log level. None means
      quiet.

    - ``sentry_level=None`` sets the sentry level. None means quiet.

    - ``sql=False`` switches sql statement logging on or off.

    """
    result = {
        'version': 1,
        'disable_existing_loggers': True,
        'formatters': {
            'verbose': {
                'format': '%(asctime)s %(name)s %(levelname)s\n%(message)s',
                },
            'simple': {
                'format': '%(levelname)s %(message)s'
                },
            },
        'handlers': {
            'null': {
                'level': 'DEBUG',
                'class': 'django.utils.log.NullHandler',
                },
            'console': {
                'level': console_level,
                'class': 'logging.StreamHandler',
                'formatter': 'simple'
                },
            'logfile': {
                'level': file_level,
                'class': 'logging.FileHandler',
                'formatter': 'verbose',
                'filename': os.path.join(buildout_dir,
                                         'var', 'log', 'django.log'),
                },
            'sentry': {
                'level': sentry_level,
                'class': 'sentry.client.handlers.SentryHandler',
                'formatter': 'verbose'
                },
            },
        'loggers': {
            '': {
                'handlers': [],
                'propagate': True,
                'level': 'DEBUG',
                },
            'django.db.backends': {
                'handlers': ['null'],  # Quiet by default!
                'propagate': False,
                'level': 'DEBUG',
                },
            },
        }
    if console_level is not None:
        result['loggers']['']['handlers'].append('console')
    if file_level is not None:
        result['loggers']['']['handlers'].append('logfile')
    if sentry_level is not None:
        result['loggers']['']['handlers'].append('sentry')
    if sql:
        result['loggers']['django.db.backends']['handlers'] = [
            'console', 'logfile']
    return result
