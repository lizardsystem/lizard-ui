from django.core.urlresolvers import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _

from lizard_security.manager import FilteredManager
from lizard_security.models import DataSet

SCREEN_DEFAULT_SLUG = 'home'


class ApplicationScreen(models.Model):
    """
    Definition of an application screen. The screen has application
    icons in it.
    """

    name = models.CharField(_('name'), max_length=40)
    slug = models.SlugField(max_length=40)
    description = models.TextField(_('description'), blank=True, null=True)

    def __unicode__(self):
        return u'%s (%s)' % (self.name, self.slug)

    def get_absolute_url(self):
        if self.slug == SCREEN_DEFAULT_SLUG:
            return reverse('lizard_ui.icons')
        return reverse('lizard_ui.icons',
                       kwargs={'slug': self.slug})

    def crumbs(self, seen_slugs=()):
        if self.slug == 'home':
            # Home is already handled elsewhere, nothing we need to
            # show
            return []

        # Otherwise, if we find that this screen is reachable from the
        # home screen, we need an entry in the crumbs for this screen,
        # and possibly for screens before it.
        crumb_here = [{
                'url': '/?screen=%s' % (self.slug,),
                'description': self.name,
                'title': self.description or self.name}]

        minlength = None
        prepend = None

        for icon in (ApplicationIcon.objects.
                     filter(url__endswith=('?screen=%s' % (self.slug,)))):
            # This screen has a link to us on it!
            screen = icon.application_screen

            # If we've already seen it, skip it to avoid infinite
            # recursion
            if screen.slug in seen_slugs:
                continue

            # Else, get its proposed list of crumbs
            proposed = screen.crumbs(seen_slugs + (self.slug,))

            # Keep it if it's not None, and the shortest so far.
            # It is most likely that the user got to this page using
            # the shortest route through the app screens.
            if (proposed is not None and
                (minlength is None or len(proposed) < minlength)):
                minlength = len(proposed)
                prepend = proposed

        if prepend is not None:
            # We found a way to the homepage.
            # Combine and return
            return prepend + crumb_here
        else:
            # We didn't.
            return None


class ApplicationIcon(models.Model):
    """
    Definition of an application icon. Essentially they consist of a
    name, an icon and an url.
    """
    supports_object_permissions = True

    name = models.CharField(_('name'), max_length=40)
    icon = models.CharField(_('icon'), max_length=200)
    description = models.TextField(_('description'), blank=True, null=True)
    url = models.CharField(_('url'), max_length=200, blank=True, null=True)
    application_screen = models.ForeignKey(
        ApplicationScreen,
        help_text=_("Application screen we're a part of"),
        related_name='icons')
    sub_screen = models.OneToOneField(
        ApplicationScreen,
        help_text=_("Application screen we point at (this disables the url)"),
        null=True,
        blank=True,
        related_name='parent_icon')
    index = models.IntegerField(
        _('index'),
        default=1000,
        help_text=_('Number used for ordering icons relative to each other.'),
        )
    data_set = models.ForeignKey(DataSet,
                                 null=True,
                                 blank=True)
    objects = FilteredManager()

    class Meta:
        ordering = ('index', )

    def __unicode__(self):
        return u'%s' % self.name

    def get_absolute_url(self):
        """Return url or sub screen's url; the latter takes preference.

        The url is not really ourselves, but what we point at. But that's
        close enough. We don't really exist on our own.

        """
        if self.sub_screen:
            return self.sub_screen.get_absolute_url()
        return self.url

    def parents(self):
        """Return list of application screens that are our parents.

        The order is that the top level item should come first.

        """
        parent = self.application_screen
        try:
            result = parent.parent_icon.parents()
        except ApplicationIcon.DoesNotExist:
            result = []
        result.append(parent)
        return result
