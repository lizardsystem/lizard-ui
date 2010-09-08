from django.test import TestCase
from django.contrib.auth.models import User


class TestLoginLogout(TestCase):

    def setUp(self):
        """Create sample user."""
        User.objects.create_user('atilla',
                                 'atilla@thehun.mn',
                                 password='horses')

    def test_smoke(self):
        # No parameters.
        self.assertRaises(
            KeyError,  # MultiValueDictKeyError
            self.client.get,
            '/accounts/login/')

    def test_invalid_user(self):
        response = self.client.post('/accounts/login/',
                                    {'username': 'rianne',
                                     'password': 'pony'})
        # The response is always 200.
        self.assertEquals(response.status_code, 200)
        # But the value is the json dump of False.
        self.assertEquals(response.content, 'false')

    def test_valid_user(self):
        response = self.client.post('/accounts/login/',
                                    {'username': 'atilla',
                                     'password': 'horses'})
        # The response is always 200.
        self.assertEquals(response.status_code, 200)
        # But the value is the json dump of False.
        self.assertEquals(response.content, 'true')

    def test_logout(self):
        self.client.login(username='atilla', password='horses')
        response = self.client.get('/accounts/logout/')
        # The response is always 200.
        self.assertEquals(response.status_code, 200)
        # And empty.
        self.assertEquals(response.content, '')


class TestUtility(TestCase):

    def test_euro(self):
        from lizard_ui.templatetags.utility import euro
        self.assertEquals(u'&euro; 10,-', euro(10.0))
        self.assertEquals(u'&euro; 10,-', euro(10))
        self.assertEquals(u'&euro; 10.000,-', euro(10000))
        self.assertEquals(u'&euro; 1.234.567,-', euro(1234567))
        self.assertEquals(u'&euro; 1.234.567,-', euro(1234567.0))
        euro(None)  # Should not crash
