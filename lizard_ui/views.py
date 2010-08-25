from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.http import HttpResponse
import simplejson

def simple_login(request):
    """
    Logs a user in, replies success or failure in json success: 0 or
    1.
    """
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    success = False
    if user is not None:
        if user.is_active:
            login(request, user)
            success = True
    return HttpResponse(simplejson.dumps(success))
