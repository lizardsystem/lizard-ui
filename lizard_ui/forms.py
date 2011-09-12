from django import forms
from django.utils.translation import ugettext as _


class LoginForm(forms.Form):
    username = forms.CharField(_('Username'),
                               max_length=100,
                               required=True)
    password = forms.CharField(_('Password'),
                               widget=forms.PasswordInput(),
                               max_length=100,
                               required=True)
    next = forms.CharField(max_length=100,
                           required=False,
                           widget=forms.HiddenInput())
