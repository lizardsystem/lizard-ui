from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(max_length=100,
                               required=True)
    password = forms.CharField(widget=forms.PasswordInput(),
                               max_length=100,
                               required=True)
    next = forms.CharField(max_length=100,
                           required=False,
                           widget=forms.HiddenInput())
