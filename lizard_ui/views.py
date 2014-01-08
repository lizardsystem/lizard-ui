# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
from copy import copy
import logging
import urlparse
import urllib
import json

from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth import logout
from django.core.urlresolvers import reverse

from django.http import Http404
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import HttpResponseServerError

from django.shortcuts import get_object_or_404
from django.shortcuts import render

from django.template import Context, loader

from django.utils.translation import check_for_language
from django.utils.translation import get_language
from django.utils.translation import ugettext as _

from django.views.generic.base import TemplateView, View
from django.views.generic.edit import FormView

from lizard_ui.forms import LoginForm, ChangeLanguageForm
from lizard_ui.layout import Action
from lizard_ui.models import ApplicationScreen
from lizard_ui.models import ApplicationIcon
from lizard_ui.models import CustomerLogo

from lizard_ui import uisettings


DEFAULT_APPLICATION_SCREEN = 'home'

logger = logging.getLogger(__name__)


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


class ViewNextURLMixin(object):
    """View mixin that adds next url redirect parsing.

    This can be used for login or logout functionality.
    """

    default_redirect = '/'

    def next_url(self):
        # Used to fill the hidden field in the LoginForm
        return self.request.GET.get('next', self.default_redirect)

    def check_url(self, next_url=None):
        """Check if the next url is valid."""

        if next_url is None:
            next_url = self.default_redirect

        netloc = urlparse.urlparse(next_url)[1]
        # Security check -- don't allow redirection to a different
        # host.
        if netloc and netloc != self.request.get_host():
            return self.default_redirect

        return next_url


class LoginView(ViewContextMixin, FormView, ViewNextURLMixin):
    """Logs in the user."""

    template_name = 'lizard_ui/login.html'
    form_class = LoginForm
    default_redirect = '/'

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            login(self.request, form.get_user())
            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()
            if request.is_ajax():
                return HttpResponse(json.dumps({'success': True}),
                                    mimetype='application/json')

            next_url = form.cleaned_data['next_url']
            redirect_to = self.check_url(next_url)
            return HttpResponseRedirect(redirect_to)

        if request.is_ajax():
            errors = ' '.join(form.non_field_errors())
            for fieldname, errorlist in form.errors.items():
                if fieldname in form.fields:
                    errors += ' ' + form.fields[fieldname].label + ': '
                    errors += ' '.join(errorlist)
                else:
                    errors += ' '.join(errorlist)
            return HttpResponse(json.dumps({'success': False,
                                            'error_message': errors}),
                                mimetype='application/json')
        return self.form_invalid(form)


class LogoutView(View, ViewNextURLMixin):
    """
    Logout for ajax and regualar GET/POSTS.

    This View does a logout for the user,
    redirects to the next url when it's given.
    When the request is done via Ajax an empty response is returned.
    """

    def get(self, request, *args, **kwargs):
        logout(request)
        if request.is_ajax():
            return HttpResponse("")

        redirect_to = self.check_url(self.next_url())
        return HttpResponseRedirect(redirect_to)

    def post(self, *args, **kwargs):
        return self.get(*args, **kwargs)


class ChangeLanguageView(ViewContextMixin, FormView, ViewNextURLMixin):
    """Shows a change language modal form."""

    template_name = 'lizard_ui/change_language.html'
    form_class = ChangeLanguageForm
    default_redirect = '/'

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            lang_code = request.POST.get('language', None)
            next = request.REQUEST.get('next', None)
            if request.is_ajax():
                response = HttpResponse(json.dumps({'success': True}),
                                        mimetype='application/json')
            else:
                response = HttpResponseRedirect(next)
            if lang_code and check_for_language(lang_code):
                if hasattr(request, 'session'):
                    request.session[settings.LANGUAGE_COOKIE_NAME] = lang_code
                else:
                    response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang_code)
            return response

        if request.is_ajax():
            errors = ' '.join(form.non_field_errors())
            for fieldname, errorlist in form.errors.items():
                if fieldname in form.fields:
                    errors += ' ' + form.fields[fieldname].label + ': '
                    errors += ' '.join(errorlist)
                else:
                    errors += ' '.join(errorlist)
            return HttpResponse(json.dumps({'success': False,
                                            'error_message': errors}),
                                mimetype='application/json')
        return self.form_invalid(form)


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


class UiView(ViewContextMixin, TemplateView):
    """Base view for a lizard-ui-using view+template.

    This view feeds all necessary blocks with nicely structured data. The
    effect is that we don't need to muck around with lots of template tags
    anymore.

    There are two basic ways in which to customize it:

    - Apps can subclass ``UiView`` and overwrite methods to add or change UI
      elements.

    - Sites can use a subclass, but that doesn't change anything for apps that
      already subclassed themselves or that use UiView directly. So they can
      best customize the ``lizard_ui/lizardbase.html`` template.

    You can specify ``required_permission``. If set, the permission is checked
    (and the user is redirected to the login page if needed).

    """
    template_name = 'lizard_ui/lizardbase.html'
    icon_url_name = 'lizard_ui.icons'
    # ^^^ So that we can subclass this view and still get proper urls.
    show_secondary_sidebar_title = None
    show_secondary_sidebar_icon = None
    show_rightbar_title = None
    require_application_icon_with_permission = False
    # ^^^ If there's no visible application icon, we don't have the necessary
    # permission. At least, that's what this is intended for.
    required_permission = None
    sidebar_is_collapsed = True
    rightbar_is_collapsed = True
    secondary_sidebar_is_collapsed = True

    def get_context_data(self, **kwargs):
        if self.require_application_icon_with_permission:
            if not self.best_matching_application_icon:
                logger.warn(
                    "Accessing view without required application icon.")
                # TODO: change to 403 (forbidden) with Django 1.4.
                raise Http404
        return super(UiView, self).get_context_data(**kwargs)

    def dispatch(self, request, *args, **kwargs):
        if self.required_permission:
            if not request.user.has_perm(self.required_permission):
                return HttpResponseRedirect(
                    settings.LOGIN_URL + '?next=%s' % request.path)

        # open / close sidebar when requested
        def str2bool(something):
            if something is None: return None
            if something.lower() == 'true': return True
            elif something.lower() == 'false': return False
            else: return None
        sidebar_is_collapsed = str2bool(request.GET.get('sidebar_is_collapsed'))
        if sidebar_is_collapsed is not None:
            self.sidebar_is_collapsed = sidebar_is_collapsed
        rightbar_is_collapsed = str2bool(request.GET.get('rightbar_is_collapsed'))
        if rightbar_is_collapsed is not None:
            self.rightbar_is_collapsed = rightbar_is_collapsed
        secondary_sidebar_is_collapsed = str2bool(request.GET.get('secondary_sidebar_is_collapsed'))
        if secondary_sidebar_is_collapsed is not None:
            self.secondary_sidebar_is_collapsed = secondary_sidebar_is_collapsed

        return super(UiView, self).dispatch(request, *args, **kwargs)

    @property
    def gauges_site_id(self):
        """Return gaug.es tracking code (unless we're in debug mode)."""
        if settings.DEBUG:
            return
        return uisettings.GAUGES_SITE_ID

    @property
    def title(self):
        """Return title for use in 'head' tag.

        By default it uses the ``page_title`` attribute, followed by
        ``UI_SITE_TITLE`` (which is 'lizard' by default).

        """
        return ' - '.join([self.page_title, uisettings.SITE_TITLE])

    @property
    def site_actions(self):
        """Return site actions.

        ``UI_SITE_ACTIONS`` are on the left, a login link (if
        ``UI_SHOW_LOGIN`` is True) on the right.

        """
        actions = copy(uisettings.SITE_ACTIONS)

        if uisettings.SHOW_LANGUAGE_PICKER:
            languages = settings.LANGUAGES
            if len(languages) > 1:
                language_code = get_language()  # current language code
                language_name = _('Language')  # sort of default
                try:
                    language_name = dict(settings.LANGUAGES)[language_code.lower()]
                except KeyError:
                    for code, name in languages:
                        if language_code.lower().startswith(code):
                            language_name = name
                            break
                query_string = urllib.urlencode(
                    {'next': self.request.path_info})
                lang_action = Action(icon='icon-flag')
                lang_action.url = '%s?%s' % (
                    reverse('lizard_ui.change_language'), query_string)
                lang_action.name = language_name
                lang_action.description = _('Pick a language')
                lang_action.klass = 'ui-change-language-link'
                actions.append(lang_action)

        if uisettings.SHOW_LOGIN:
            query_string = urllib.urlencode({'next': self.request.path_info})
            if self.request.user.is_authenticated():
                # Name of the user. TODO: link to profile page.
                # The action is just text-with-an-icon right now.
                action = Action(icon='icon-user')
                action.name = self.request.user
                action.description = _('Your current username')
                actions.append(action)
                # Separate logout action.
                action = Action()
                if getattr(settings, 'SSO_ENABLED', False):
                    # point to the SSO logout page (which redirects
                    # to another server)
                    action.url = '%s?%s' % (reverse('logout'),
                                            query_string)
                else:
                    # fall back to the old (local) logout page
                    action.url = '%s?%s' % (reverse('lizard_ui.logout'),
                                            query_string)
                action.name = _('logout')
                action.description = _('Click here to logout')
                action.klass = 'ui-logout-link'
                actions.append(action)
            else:
                action = Action(icon='icon-user')
                if getattr(settings, 'SSO_ENABLED', False):
                    # point to the SSO login page (which redirects
                    # to another server)
                    action.url = '%s?%s' % (reverse('login'),
                                            query_string)
                else:
                    # fall back to the old (local) login form
                    action.url = '%s?%s' % (reverse('lizard_ui.login'),
                                            query_string)
                action.name = _('Login')
                action.description = _('Click here to login')
                if getattr(settings, 'SSO_ENABLED', False):
                    action.klass = 'ui-sso-login-link'
                else:
                    # fall back to the javascript login modal
                    action.klass = 'ui-login-link'
                actions.append(action)
        return actions

    @property
    def best_matching_application_icon(self):
        """Return application icon that best matches our url."""
        page_url = self.request.path
        icon_found = None
        best_url = None
        for icon in ApplicationIcon.objects.all():
            icon_url = icon.get_absolute_url()
            if not icon_url:
                continue
            if icon_url == '/':
                # Pointer at a CMS page above us, probably.
                continue
            if (icon_url.startswith('http://') or
                icon_url.startswith('https://')):
                # External url, so it cannot match.
                continue
            if not icon_url.startswith('/'):
                icon_url = '/' + icon_url
            if not icon_url.endswith('/'):
                icon_url = icon_url + '/'
            if page_url.startswith(icon_url):
                if best_url and len(icon_url) < len(best_url):
                    # It matches, but it is shorter than what we already have.
                    continue
                icon_found = icon
                best_url = icon_url
        return icon_found

    @property
    def home_breadcrumb_element(self):
        """Return action that points at the homepage.

        Useful in cases we don't have a proper breadcrumb path.
        """
        app_screen = get_object_or_404(ApplicationScreen,
                                       slug=DEFAULT_APPLICATION_SCREEN)
        return Action(name=app_screen.name,
                      url=app_screen.get_absolute_url(),
                      description=app_screen.description)

    @property
    def our_own_breadcrumb_element(self):
        """Return action that points at the current page.

        Useful in cases we don't have a proper breadcrumb path or if we are a
        sub-page of an app for which we found a breadcrumb path.
        """
        return Action(name=self.page_title,
                      url=self.request.path)

    @property
    def breadcrumbs(self):
        """Return breadcrumbs (as a list of actions).

        Overwrite it if you want something really different. Otherwise it
        tries to make a best guess effort by looking at what lizard-ui itself
        knows regarding icons and screens that point at it.

        """
        icon = self.best_matching_application_icon
        if not icon:
            return
        breadcrumb_elements = icon.parents()
        breadcrumb_elements.append(icon)
        result = [Action(name=element.name,
                         url=element.get_absolute_url(),
                         description=element.description)
                  for element in breadcrumb_elements]
        return result

    @property
    def breadcrumbs_with_fallback(self):
        """Return breadcrumbs (as a list of actions) even if we have none.

        Sometimes we cannot find breadcrumbs because a page isn't configured
        with ApplicationIcons pointing at it. We provide a fallback: just the
        homepage link and ourselves.

        But, for 'ourselves' we need a page title. If that's not available
        we're not going to return only the 'home' url.

        """
        if self.breadcrumbs:
            return self.breadcrumbs
        if not self.page_title:
            # We cannot point at ourselves without a title to use.
            return
        result = [self.home_breadcrumb_element,
                  self.our_own_breadcrumb_element]
        return result

    @property
    def page_title(self):
        """Return name of latest breadcrumb for page title fallback."""
        if not self.breadcrumbs:
            return
        return self.breadcrumbs[-1].name

    @property
    def edit_link(self):
        """Return link to edit ourselves. (Just the link, not an action.)"""
        return None

    @property
    def edit_action(self):
        """Return edit link as an action, ready for content_actions."""
        return Action(name=_('Edit'),
                      description=_('Edit this page.'),
                      url=self.edit_link,
                      icon='icon-edit')

    @property
    def content_actions(self):
        """Return content actions.

        Content actions are different for every kind of object, so by default
        is is just empty. Customization should happen in a subclass,
        logically.

        There's one exception: if there's an edit link, display its action.

        """
        if self.edit_link and self.request.user.is_staff:
            return [self.edit_action]
        return []

    @property
    def sidebar_actions(self):
        """Return sidebar actions.

        If ``UI_SHOW_SIDEBAR_COLLAPSE`` is True, it is shown on the
        left. There's very limited place for actions here, so restrict
        yourself regarding adding new ones.

        """
        collapse_action = Action(
            icon='icon-arrow-left',
            name=_('Apps'),
            description=_('Collapse or expand this panel'),
            klass='collapse-sidebar')
        actions = [collapse_action]
        if self.show_secondary_sidebar_title:
            # Having a title means we want to show it.
            actions.append(
                Action(name=self.show_secondary_sidebar_title,
                       description=_('Collapse or expand this panel'),
                       icon=self.show_secondary_sidebar_icon,
                       klass='secondary-sidebar-button'))
        return actions

    @property
    def rightbar_actions(self):
        """Return rightbar actions.

        By default, the only action is a open/collapse one if its title is
        specified.

        """
        actions = []
        if self.show_rightbar_title:
            # Having a title means we want to show it.
            actions.append(
                Action(name=self.show_rightbar_title,
                       description=_('Collapse or expand this panel'),
                       icon='icon-arrow-left',
                       klass='collapse-rightbar'))
        return actions

    @property
    def orthogonal_action_groups(self):
        """Return groups of orthogonal actions.

        In the bar below the content, the actions are grouped. This is a
        difference with the other action methods: the list(s) of actions are
        themselves inside a list.

        """
        actions = []
        groups = [actions]
        return groups


class ExampleBlockView(UiView):
    """Example view that shows which attributes go where."""
    template_name = 'lizard_ui/examples/example-blocks-view.html'
    page_title = 'view.page_title'
    show_secondary_sidebar_title = 'Show 2nd'
    site_actions = [Action(name='view.site_actions')]
    breadcrumbs = [Action(name='view.breadcrumbs'), Action(name='tadaah')]
    content_actions = [Action(name='view.content_actions')]

    @property
    def sidebar_actions(self):
        actions = super(ExampleBlockView, self).sidebar_actions
        actions[0].name = 'view.sidebar_actions'
        return actions

    orthogonal_action_groups = [
        [Action(name='view.orthogonal_action_groups')]]


class IconView(UiView):
    """View that shows an application screen plus icons."""
    template_name = 'lizard_ui/icons.html'

    @property
    def application_screen(self):
        slug = self.kwargs.get('slug', DEFAULT_APPLICATION_SCREEN)
        return get_object_or_404(ApplicationScreen, slug=slug)

    @property
    def page_title(self):
        return self.application_screen.name

    @property
    def edit_link(self):
        pk = self.application_screen.id
        return '/admin/lizard_ui/applicationscreen/%s/' % pk

    @property
    def breadcrumbs(self):
        """Return breadcrumbs.

        If nothing can be found, it is because we're on the homepage. So we'll
        just return ourselves as an action, then.

        """
        result = super(IconView, self).breadcrumbs
        if result:
            return result
        return [self.home_breadcrumb_element]

    @property
    def icons(self):
        return self.application_screen.icons.all()

    @property
    def customer_logo(self):
        logo = CustomerLogo.objects.filter(used=True)
        if logo:
            return logo[0].logo.name
        return False


def handler500(request):
    """
    500 error handler which includes ``request`` in the context.

    Templates: `500.html`
    Context: None
    """

    t = loader.get_template('500.html')
    return HttpResponseServerError(t.render(Context({
        'request': request,
    })))
