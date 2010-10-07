# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
import logging


logger = logging.getLogger(__name__)


class TracebackLoggingMiddleware(object):
    """Middleware that logs exceptions.

    See http://djangosnippets.org/snippets/421/.

    To enable it, add ``lizard_ui.middleware.TracebackLoggingMiddleware`` to
    your setting.py's MIDDLEWARE_CLASSES.

    """

    def process_exception(self, request, exception):
        logger.exception(repr(request))
