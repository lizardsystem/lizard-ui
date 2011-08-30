# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson as json


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


def simple_login(request, next=None, template='lizard_ui/login.html'):
    """
    Logs a user in, replies success or failure in json success:
    {'success': success, 'next': next}

    If no username and password provided, you'll get a login screen.
    """
    post = request.POST
    if 'next' in post and post['next']:
        next = post['next']
        # print 'post next: %s' % next
    if 'next' in request.GET and request.GET['next']:
        next = request.GET['next']
        # print 'get next: %s' % next
    if 'username' not in post or 'password' not in post:
        return render_to_response(
            template,
            {'next': next},
            context_instance=RequestContext(request))
    username = post['username']
    password = post['password']
    user = authenticate(username=username, password=password)
    success = False
    if user is not None:
        if user.is_active:
            login(request, user)
            success = True
    return HttpResponse(json.dumps({'success': success, 'next': next}))


def simple_logout(request):
    """
    The simplest logout script possible, call this from a javascript using GET
    or POST.
    """
    logout(request)
    return HttpResponse("")


def example_breadcrumbs(request, template=None):
    crumbs = [{'name': 'name', 'url': 'url'},
              {'name': 'name2', 'url': 'url2'}]
    return render_to_response(
        template, {'crumbs': crumbs},
        context_instance=RequestContext(request))


def application_screen(
    request,
    application_screen_slug=None,
    template="lizard_ui/lizardbase.html",
    crumbs_prepend=None):
    """
    Render a screen with app icons. Not very useful, except for testing.
    """
    return render_to_response(
        template,
        {'application_screen_slug': application_screen_slug},
        context_instance=RequestContext(request))
