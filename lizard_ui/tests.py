import datetime

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test.client import RequestFactory
from django.utils import simplejson as json

# from lizard_ui.models import ApplicationScreen
from lizard_ui.configchecker import checker
from lizard_ui.middleware import TracebackLoggingMiddleware
from lizard_ui.templatetags.utility import dutch_timedelta
from lizard_ui.templatetags.utility import euro
from lizard_ui.templatetags.utility import short_timedelta
import lizard_ui.views


class TestViewContextMixin(TestCase):

    def test_alone(self):
        """ViewContextMixin should work on its own."""
        view = lizard_ui.views.ViewContextMixin()
        self.assertEquals(view.get_context_data(),
                          {'view': view})

    def test_with_inheritance(self):
        """ViewContextMixin should work with a parent."""
        class Parent(object):
            def get_context_data(self, **kwargs):
                return {'parent': 'daddy'}

        class Child(lizard_ui.views.ViewContextMixin, Parent):
            pass
        view = Child()
        self.assertEquals(view.get_context_data(),
                          {'view': view,
                           'parent': 'daddy'})


class TestLoginLogoutIntegration(TestCase):

    def setUp(self):
        """Create sample user."""
        User.objects.create_user('atilla',
                                 'atilla@thehun.mn',
                                 password='horses')

    def test_smoke(self):
        """Login page must just display a proper html form."""
        response = self.client.get(reverse('lizard_ui.login'), {})
        self.assertEquals(response.status_code, 200)
        self.assertTrue("form" in response.content)
        self.assertTrue('name="password"' in response.content)

    # def test_invalid_user(self):
    #     response = self.client.post(reverse('lizard_ui.login'),
    #                                 {'username': 'rianne',
    #                                  'password': 'pony'})
    #     # The response is always 200.
    #     self.assertEquals(response.status_code, 200)
    #     # But the value is the json dump of False.
    #     self.assertEquals(json.loads(response.content),
    #                       {u'success': False, u'next': None})

    def test_valid_user(self):
        response = self.client.post(reverse('lizard_ui.login'),
                                    {'username': 'atilla',
                                     'password': 'horses'})
        # The response is always a redirect to where we came from.
        self.assertEquals(response.status_code, 302)

    def test_logout(self):
        self.client.login(username='atilla', password='horses')
        response = self.client.get(reverse('lizard_ui.logout'))
        # The response redirects us to where we came from.
        self.assertEquals(response.status_code, 302)


class TestUtility(TestCase):

    def test_euro(self):
        self.assertEquals(u'&euro; 10,-', euro(10.0))
        self.assertEquals(u'&euro; 10,-', euro(10))
        self.assertEquals(u'&euro; 10.000,-', euro(10000))
        self.assertEquals(u'&euro; 1.234.567,-', euro(1234567))
        self.assertEquals(u'&euro; 1.234.567,-', euro(1234567.0))
        euro(None)  # Should not crash

    def test_dutch_timedelta(self):
        self.assertEquals(u'0 seconde', dutch_timedelta(0))
        self.assertEquals(u'-', dutch_timedelta(None))
        self.assertEquals(u'1 minuut', dutch_timedelta(60))
        self.assertEquals(u'1 minuut, 5 seconden', dutch_timedelta(65))
        self.assertEquals(u'2 minuten, 5 seconden', dutch_timedelta(125))
        self.assertEquals(u'1 uur', dutch_timedelta(3600))
        # Rounded off
        self.assertEquals(u'1 uur, 1 minuut', dutch_timedelta(3700))
        # Rounded off
        self.assertEquals(u'1 dag, 1 minuut', dutch_timedelta(86500))
        dutch_timedelta(None)  # Should not crash

    def test_short_timedelta(self):
        self.assertEquals(u'4 dagen', short_timedelta(
                datetime.timedelta(days=4)))
        self.assertEquals(u'1 dag', short_timedelta(
                datetime.timedelta(days=1, seconds=5)))
        self.assertEquals(u'1 dag', short_timedelta(
                datetime.timedelta(days=1)))
        self.assertEquals(u'5 uur', short_timedelta(
                datetime.timedelta(seconds=3600 * 5 + 300)))
        self.assertEquals(u'5 uur', short_timedelta(
                datetime.timedelta(seconds=3600 * 5)))
        self.assertEquals(u'5 minuten', short_timedelta(
                datetime.timedelta(seconds=60 * 5 + 4)))
        self.assertEquals(u'5 minuten', short_timedelta(
                datetime.timedelta(seconds=60 * 5)))
        self.assertEquals(u'36 seconde', short_timedelta(
                datetime.timedelta(seconds=36)))
        short_timedelta(None)  # Should not crash


class TestTracebackLoggingMiddleware(TestCase):

    def test_smoke(self):
        """Just test that it doesn't crash."""
        exception = Exception('Mock exception')
        request = RequestFactory().get('/')
        middleware = TracebackLoggingMiddleware()
        middleware.process_exception(request, exception)


class TestConfigChecker(TestCase):

    def test_smoke(self):
        """Just test that it doesn't crash and burn."""
        checker()


class TestExampleApplicationScreen(TestCase):

    def test_smoke(self):
        """Just test that it doesn't crash and burn."""
        request = RequestFactory().get('/example/')
        response = lizard_ui.views.application_screen(request)
        self.assertEquals(response.status_code, 200)
