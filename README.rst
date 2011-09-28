lizard-ui
=========

Lizard-ui provides a basic `Django <http://djangoproject.com>`_ user
interface, so a **base Django template** and some **css + javascript**.  We
designed it at `Nelen & Schuurmans <http://www.nelen-schuurmans.nl>`_ for our
geographical information websites (with water management information).


Choices, requirements, assumptions
----------------------------------

Lizard-ui is opinionated: it makes choices and prescribes (good!)
technologies.

- Included: the `blueprint css framework <http://www.blueprintcss.org/>`_.  It
  resets css styles so that we've got a common base.  It fixes common IE
  layout bugs.  It gives a basic typography that's quite pleasing.

- Required: `django-staticfiles
  <http://pypi.python.org/pypi/django-staticfiles>`_.  For a more verbose
  description, see `Reinout's blog entry
  <http://reinout.vanrees.org/weblog/2010/05/19/django-css-javascript-files.html>`_
  (written with lizard-ui in mind).

- Required: `django_compressor
  <http://pypi.python.org/pypi/django_compressor>`_ for combining css/javascript
  files in production.

- Assumption: one screen, using the full width/height of the browser, without
  scrolling.  Our main goal is showing a nice big map with a small header and
  a sidebar.  You don't want to scroll a map.  It is of course possible to
  have a scrollbar inside that main content area itself.

- Assumption: javascript is available.  Hey, we're showing a map so you need
  javascript.  So we liberally use javascript to get the UI right, for
  instance by detecting and setting the main content area's width and height.

- Included: jquery.  Yeah, it is pretty much the standard nowadays.  So we use
  jquery where jquery can be used instead of doing it with generic javascript.

- Included: both jqueryui and jquerytools.  Visual goodies.  Jquerytools for
  the overlay and tabs, jqueryui for the rest (drag/drop and so).

- Included: openlayers as map javascript library.  (Lizard-map, sooooon to be
  released, contains our basic map interaction javascript and python code).


License + licenses
------------------

Our own license is GPLv3.

Lizard-ui ships with a couple of external css/javascript libraries.

Blueprint
  Modified MIT

Jquery and jqueryui
  Dual licensed under the MIT or GPL Version 2 licenses.  Includes Sizzle.js,
  released under the MIT, BSD, and GPL Licenses.

Jquerytools
  No copyrights or licenses. Do what you like.

Openlayers
  Clear BSD license.

Famfamfam icon set
  CC attribution license.

Treeview jquery plugin
  MIT/GPL


Django settings
---------------

Here's an excerpt of a ``settings.py`` you can use.  The media and static root
directory setup assumes the use of buildout, but you can translate it to your
own filesystem setup::

  INSTALLED_APPS = [
      'lizard_ui',
      'compressor',
      'staticfiles',
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.sites',
      ]

  # Note: the below settings are more elaborate than needed,
  # but we want to test django_compressor's compressing which
  # needs a media url and root and so.

  # SETTINGS_DIR allows media paths and so to be relative to
  # this settings file instead of hardcoded to
  # c:\only\on\my\computer.
  SETTINGS_DIR = os.path.dirname(os.path.realpath(__file__))

  # BUILDOUT_DIR is for access to the "surrounding" buildout,
  # for instance for BUILDOUT_DIR/var/static files to give
  # django-staticfiles a proper place to place all collected
  # static files.
  BUILDOUT_DIR = os.path.abspath(os.path.join(SETTINGS_DIR, '..'))

  # Absolute path to the directory that holds user-uploaded
  # media.
  MEDIA_ROOT = os.path.join(BUILDOUT_DIR, 'var', 'media')
  # Absolute path to the directory where django-staticfiles'
  # "bin/django build_static" places all collected static
  # files from all applications' /media directory.
  STATIC_ROOT = os.path.join(BUILDOUT_DIR, 'var', 'static')

  # URL that handles the media served from MEDIA_ROOT. Make
  # sure to use a trailing slash if there is a path component
  # (optional in other cases).
  MEDIA_URL = '/media/'
  # URL for the per-application /media static files collected
  # by django-staticfiles.  Use it in templates like "{{
  # MEDIA_URL }}mypackage/my.css".
  STATIC_URL = '/static_media/'
  # URL prefix for admin media -- CSS, JavaScript and
  # images. Make sure to use a trailing slash.  Uses
  # STATIC_URL as django-staticfiles nicely collects admin's
  # static media into STATIC_ROOT/admin.
  ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'


And a suitable apache config hint::

  <Location /static_media/>
    # The css/javascript/image staticfiles are cached in the
    # browser for a day.
    ExpiresActive On
    ExpiresDefault "access plus 1 day"
  </Location>

  <Location /static_media/CACHE/>
    # django_compress's generated timestamp'ed files:
    # cache forever
    ExpiresActive On
    ExpiresDefault "access plus 10 years"
  </Location>

  # Static files are hosted by apache itself.
  # User-uploaded media: MEDIA_URL = '/media/'
  Alias /media/ ${buildout:directory}/var/media/
  # django-staticfiles: STATIC_URL = '/static_media/'
  Alias /static_media/ ${buildout:directory}/var/static/


Upgrading to Django 1.3
-----------------------

Lizard-ui 3.0 requires Django 1.3 as we want to start using class based views
and some of the other 1.3 goodies. For that, you need to make some changes.

- Add ``LOGGING``, for instance with::

        from lizard_ui.settingshelper import setup_logging
        LOGGING = setup_logging(BUILDOUT_DIR)
        # For production, use for instance:
        # LOGGING = setup_logging(BUILDOUT_DIR, console_level=None)

- And remove any by-hand logging setup, for instance with
  ``logging.basicConfig()``.

- Import ``STATICFILES_FINDERS`` from lizard_ui, this adds a finder that also
  finds static media in /media in addition to the new /static::

        from lizard_ui.settingshelper import STATICFILES_FINDERS

- ``COMPRESS_STORAGE``, ``COMPRESS_URL`` and ``COMPRESS_ROOT`` can now be
  removed from your settings as the defaults are now fine.

- Switch from using ``bin/django build_static`` to ``bin/django
  collectstatic``.


Usage
-----

You can mount lizard-ui's urls, but it contains only live examples.  So
perhaps you should only mount it in debug mode under ``/ui``.  Handy, as it
contains reasonably full documentation on how to use it, including available
blocks and classes/IDs that you can use.

The base layout is defined in ``realbase.html``.  You should however extend
``lizard_ui/lizardbase.html`` and then override the blocks that you want.

CSS and javascript should be added to the relevant blocks, but don't forget to
call "block.super".  An example::

  {% extends "lizard_ui/lizardbase.html" %}

  {% block css %}
  {{ block.super }}
  <link type="text/css"
        href="{{ STATIC_URL }}lizard_map/lizard_map.css"
        media="screen, projection"
        rel="stylesheet" />
  {% endblock css %}

  {% block javascript %}
  {{ block.super }}
  <script type="text/javascript"
          src="{{ STATIC_URL }}openlayers/OpenLayers.js"></script>
  <script type="text/javascript"
          src="{{ STATIC_URL }}lizard_map/jquery.workspace.js"></script>
  <script type="text/javascript"
          src="{{ STATIC_URL }}lizard_map/lizard_map.js"></script>
  {% endblock javascript %}

  {% block content %}
  <div id="map"></div>
  {% endblock content %}

A example of a common task: change the logo.  For that, make a
``media/lizard_ui`` directory in your django application (or site) and place a
``logo.png`` in it.  Django-staticfiles' mechanism will take your logo.png in
preference to lizard-ui's.


Development installation
------------------------

The first time, you'll have to run the "bootstrap" script to set up setuptools
and buildout::

    $> python bootstrap.py

And then run buildout to set everything up::

    $> bin/buildout

(On windows it is called ``bin\buildout.exe``).

You'll have to re-run buildout when you or someone else made a change in
``setup.py`` or ``buildout.cfg``.

The current package is installed as a "development package", so
changes in .py files are automatically available (just like with ``python
setup.py develop``).

If you want to use trunk checkouts of other packages (instead of released
versions), add them as an "svn external" in the ``local_checkouts/`` directory
and add them to the ``develop =`` list in buildout.cfg.

Tests can always be run with ``bin/test`` or ``bin\test.exe``.
