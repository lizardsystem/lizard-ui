from django.core.urlresolvers import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _


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
        return reverse(
            'lizard_ui.application_screen',
            kwargs={'application_screen_slug': self.slug})

    # Lizard 3
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

    name = models.CharField(_('name'), max_length=40)
    icon = models.CharField(_('icon'), max_length=200)
    description = models.TextField(_('description'), blank=True, null=True)

    # If not filled in, the link gets class "notworking"
    url = models.CharField(_('url'), max_length=200, blank=True, null=True)

    application_screen = models.ForeignKey(ApplicationScreen)
    index = models.IntegerField(
        _('index'),
        default=1000,
        help_text=_('Number used for ordering icons relative to each other.'),
        )

    class Meta:
        ordering = ('index', )

    def __unicode__(self):
        return u'%s' % self.name
