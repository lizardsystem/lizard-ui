"""Default settings for lizard-ui that can be changed in your settings.py.

The setting names here should be prefixed with ``UI_`` in settings.py, if you
override them.

"""
from django.conf import settings


SITE_TITLE = getattr(settings, 'UI_SITE_TITLE', 'Lizard')
SHOW_LOGIN = getattr(settings, 'UI_SHOW_LOGIN', True)
SITE_ACTIONS = getattr(settings, 'UI_SITE_ACTIONS', [])
SHOW_SIDEBAR_COLLAPSE = getattr(settings, 'UI_SHOW_SIDEBAR_COLLAPSE', True)
