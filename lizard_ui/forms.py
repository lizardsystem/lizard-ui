from django import forms
from django.utils.translation import ugettext as _


class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=100,
        label=_('Username'),
        required=True)
    password = forms.CharField(
        max_length=100,
        label=_('Password'),
        widget=forms.PasswordInput(),
        required=True)
    next = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.HiddenInput())
