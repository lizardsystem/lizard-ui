from django import forms
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext as _


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


class ChangeLanguageForm(forms.Form):
    language = forms.ChoiceField(
        choices=settings.LANGUAGES
    )
