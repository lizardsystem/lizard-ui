from django.test import TestCase


class TestHomepage(TestCase):

    def test_loginpage(self):
        # No parameters.
        self.assertRaises(
            KeyError,  #MultiValueDictKeyError
            self.client.get,
            '/accounts/login/')

