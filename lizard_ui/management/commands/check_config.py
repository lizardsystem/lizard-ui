# -*- coding: utf-8 -*-
# Copyright 2011 Nelen & Schuurmans
import logging

from django.core.management.base import BaseCommand

from lizard_ui import configchecker

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    args = ""
    help = "Run the lizard settings.py checkers."

    def handle(self, *args, **options):
        for checker in configchecker.checkers():
            logger.info('Running checker "%s"', checker.__doc__)
            checker()
