from django.core.urlresolvers import reverse
from django.db import models


class ApplicationScreen(models.Model):
    """
    Definition of an application screen. The screen has application
    icons in it.
    """

    name = models.CharField(max_length=40)
    slug = models.SlugField(max_length=40)
    description = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.slug)

    def get_absolute_url(self):
        return reverse(
            'lizard_ui.application_screen',
            kwargs={'application_screen_slug': self.slug})

    def crumb(self, url_base=""):
        """
        Return self in crumb format: dict with keys name, title, url.

        Uses custom url, because self.get_absolute_url() will not give
        the wanted url.
        """
        return {
            'name': self.name,
            'title': self.description,
            'url': '%s?screen=%s' % (url_base, self.slug)}


class ApplicationIcon(models.Model):
    """
    Definition of an application icon. Essentially they consist of a
    name, an icon and an url.
    """

    name = models.CharField(max_length=40)
    icon = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    # If not filled in, the link gets class "notworking"
    url = models.CharField(max_length=200, blank=True, null=True)

    application_screen = models.ForeignKey(ApplicationScreen)
    index = models.IntegerField(default=1000)

    class Meta:
        ordering = ('index', )

    def __unicode__(self):
        return '%s' % self.name
