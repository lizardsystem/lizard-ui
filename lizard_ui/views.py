# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import simplejson as json
#from django.utils.translation import ugettext as _
from django.views.generic.edit import FormView

from lizard_ui.forms import LoginForm


class ViewContextMixin(object):
    """View mixin that adds the view object to the context.

    Make sure this is near the front of the inheritance list: it should come
    before other mixins that (re-)define ``get_context_data()``.

    When you use this mixin in your view, you can do ``{{ view.some_method
    }}`` or ``{{ view.some_attribute }}`` in your class and it will call those
    methods or attributes on your view object: no more need to pass in
    anything in a context dictionary, just stick it on ``self``!

    """
    def get_context_data(self, **kwargs):
        """Return context with view object available as 'view'."""
        try:
            context = super(ViewContextMixin, self).get_context_data(**kwargs)
        except AttributeError:
            context = {}
        context.update({'view': self})
        return context


class LoginView(ViewContextMixin, FormView):
    template_name = 'lizard_ui/login.html'
    form_class = LoginForm

    def next(self):
        # Used to fill the hidden field in the LoginForm
        return self.request.GET.get('next', None)

    def post(self, request, *args, **kwargs):
        """Return json with 'success' and 'next' parameters."""
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        success = False
        post = request.POST
        next = post.get('next')
        if form.is_valid():
            username = post['username']
            password = post['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    success = True
        return HttpResponse(json.dumps({'success': success,
                                        'next': next}))


def simple_logout(request):
    """
    The simplest logout script possible, call this from a javascript using GET
    or POST.
    """
    logout(request)
    return HttpResponse("")


def example_breadcrumbs(request,
                        template='lizard_ui/example-breadcrumbs.html'):
    crumbs = [{'name': 'name', 'url': 'url'},
              {'name': 'name2', 'url': 'url2'}]
    return render(request, template, {'crumbs': crumbs})


def application_screen(
    request,
    application_screen_slug=None,
    template="lizard_ui/lizardbase.html",
    crumbs_prepend=None):
    """
    Render a screen with app icons. Not very useful, except for testing.
    """
    return render(request,
                  template,
                  {'application_screen_slug': application_screen_slug})
