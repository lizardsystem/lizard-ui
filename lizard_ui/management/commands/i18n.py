# -*- coding: utf-8 -*-
# Copyright 2011 Nelen & Schuurmans
import logging
import os

from django.core.management.commands import makemessages
from django.core.management.commands import compilemessages

logger = logging.getLogger(__name__)


class Command(makemessages.Command):
    args = ""
    help = "Run 'makemessages' command for current app/site."

    def handle_noargs(self, *args, **options):
        """Call makemessages' one with better defaults.

        Three big changes:

        - No need to chdir to the app/site's directory, we guess that.

        - By default, all existing locales are updated instead of requiring
          you to specify that.

        - All .po files are ALSO compiled.

        """
        app = os.path.basename(os.getcwd())
        app = app.replace('-', '_')
        logger.info("Guessing app module: %s.", app)
        module = __import__(app)
        app_dir = os.path.dirname(os.path.abspath(module.__file__))
        logger.info("App directory: %s.", app_dir)
        os.chdir(app_dir)
        if not options.get('locale'):
            logger.info("No locale specified, updating all existing ones.")
            options['all'] = True
        makemessages.Command.handle_noargs(self, *args, **options)
        logger.info("Also compiling all .po files into .mo.")
        compilemessages.compile_messages(self.stderr)
