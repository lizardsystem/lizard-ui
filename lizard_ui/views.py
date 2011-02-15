# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson as json


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


###### Views with complete screens ######

def application_screen(
    request,
    application_screen_slug=None,
    template="lizard_ui/lizardbase.html",
    crumbs_prepend=None):
    """
    Renders a screen with app icons. Not very useful, except for testing.
    """

    return render_to_response(
        template,
        {'application_screen_slug': application_screen_slug},
        context_instance=RequestContext(request))
