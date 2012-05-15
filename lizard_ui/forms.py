from django import forms
from django.utils.translation import ugettext as _

from django.contrib.auth.forms import AuthenticationForm


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        max_length=100,
        label=_('Username'),
        required=True)
    password = forms.CharField(
        max_length=100,
        label=_('Password'),
        widget=forms.PasswordInput(),
        required=True)
    next_url = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.HiddenInput())

