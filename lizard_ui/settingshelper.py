import os

STATICFILES_FINDERS = (
    'staticfiles.finders.FileSystemFinder',
    'staticfiles.finders.AppDirectoriesFinder',
    # Enable 'old' /media directories in addition to /static.
    'staticfiles.finders.LegacyAppDirectoriesFinder',
    # Enable support for django-compressor.
    'compressor.finders.CompressorFinder',
    )


def setup_logging(buildout_dir, console_level='DEBUG', file_level='WARN'):
    """Return configuration dict for logging."""
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
            'console':{
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
            },
        'loggers': {
            '': {
                'handlers': [],
                'propagate': True,
                'level':'DEBUG',
                },
            },
        }
    if console_level is not None:
        result['loggers']['']['handlers'].append('console')
    if file_level is not None:
        result['loggers']['']['handlers'].append('logfile')
    return result
