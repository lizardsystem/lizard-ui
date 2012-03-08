# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.txt
from copy import copy

from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.utils import simplejson as json
from django.utils.translation import ugettext as _
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView

from lizard_ui.forms import LoginForm
from lizard_ui.layout import Action
from lizard_ui.models import ApplicationScreen
from lizard_ui.models import ApplicationIcon
from lizard_ui import uisettings


DEFAULT_APPLICATION_SCREEN = 'home'


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

    """
    template_name = 'lizard_ui/lizardbase.html'
    page_title = ''
    edit_link = None
    icon_url_name = 'lizard_ui.icons'
    # ^^^ So that we can subclass this view and still get proper urls.
    show_secondary_sidebar_title = None
    show_secondary_sidebar_icon = None

    @property
    def title(self):
        """Return title for use in 'head' tag.

        By default it uses the ``page_title`` attribute, followed by
        ``UI_SITE_TITLE`` (which is 'lizard' by default).

        """
        first_title_part = self.page_title or self.last_breadcrumb_title
        return ' - '.join([first_title_part, uisettings.SITE_TITLE])

    @property
    def site_actions(self):
        """Return site actions.

        ``UI_SITE_ACTIONS`` are on the left, a login link (if
        ``UI_SHOW_LOGIN`` is True) on the right.

        """
        actions = copy(uisettings.SITE_ACTIONS)
        if uisettings.SHOW_LOGIN:
            action = Action(icon='icon-user')
            if self.request.user.is_authenticated():
                action.url = reverse('lizard_ui.logout')
                action.name = self.request.user
                action.klass = 'ui-logout-link'
            else:
                action.url = reverse('lizard_ui.login')
                action.name = _('Login')
                action.klass = 'ui-login-link'
            actions.append(action)
        return actions

    def _best_matching_application_icon(self):
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
            if icon_url.startswith('http://'):
                # External url, so it cannot match.
                continue
            if not icon_url.startswith('/'):
                icon_url = '/' + icon_url
            if page_url.startswith(icon_url):
                if best_url and len(icon_url) < len(best_url):
                    # It matches, but it is shorter than what we already have.
                    continue
                icon_found = icon
                best_url = icon_url
        return icon_found

    @property
    def breadcrumbs(self):
        """Return breadcrumbs (as a list of actions).

        Overwrite it if you want something really different. Otherwise it
        tries to make a best guess effort by looking at what lizard-ui itself
        knows regarding icons and screens that point at it.

        """
        icon = self._best_matching_application_icon()
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
    def last_breadcrumb_title(self):
        """Return name of latest breadcrumb for page title fallback."""
        if not len(self.breadcrumbs):
            return
        return self.breadcrumbs[-1].name

    @property
    def edit_link(self):
        """Return link to edit ourselves. (Just the link, not an action.)"""
        return None

    @property
    def edit_action(self):
        """Return edit link as an action, ready for content_actions."""
        return Action(name=_('edit'),
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
        else:
            return []

    @property
    def sidebar_actions(self):
        """Return sidebar actions.

        If ``UI_SHOW_SIDEBAR_COLLAPSE`` is True, it is shown on the
        left. There's very limited place for actions here, so restrict
        yourself regarding adding new ones.

        """
        collapse_action = Action(icon='icon-arrow-left',
                                 name=_('Collapse'),
                                 klass='collapse-sidebar')
        actions = [collapse_action]
        if self.show_secondary_sidebar_title:
            # Having a title means we want to show it.
            actions.append(
                Action(name=self.show_secondary_sidebar_title,
                       icon=self.show_secondary_sidebar_icon,
                       klass='secondary-sidebar-button'))
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
        home = self.application_screen
        result = [Action(name=home.name,
                         url=home.get_absolute_url(),
                         description=home.description)]
        return result

    @property
    def icons(self):
        return self.application_screen.icons.all()
