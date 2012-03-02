"""Layout helpers."""


class Action(object):
    """Small wrapper for actions, just to make the attributes explicit.

    A dictionary with keys instead of attributes is just as fine for the
    templates, but for documentation purposes this class is handier.

    - **name**: text of the link.

    - **icon**: icon class according to
      http://twitter.github.com/bootstrap/base-css.html#icons, optional.

    - **url**: where the link points at.

    - **description**: optional description for helpful popup.

    - **klass**: optional CSS class to give to the link. This allows you to
      tie custom javascript handling to the link.

    """
    def __init__(self, name=None, icon=None, url=None, description=None,
                 klass=None):
        self.name = name
        self.icon = icon
        self.url = url
        self.description = description
        self.klass = klass


def find_app_description(self, url):
    """An App doesn't generally know what it is called on the
    current site.  E.g., if the front page has an app called
    "Metingen" that links to "/fews/fewsjdbc/almere/", then the
    breadcrumb should show "home > metingen" instead of "home >
    fewsjdbc > almere", but the app doesn't know this.

    This function tries to help. It returns a tuple with three
    elements:
    - A list of breadcrumbs consisting of app screens (other than
      Home), the last item of which leads to this app
    - The part of the URL that led to this guess
    - The rest of the URL (that a view can use to build further
      parts of the breadcrumbs list)

    If there are multiple screens that appear to fit, we use the
    one that "uses up" most of the URL.
    """

    maxlength = None
    found = (None, None, None)

    if not url.startswith('/'):
        url = '/' + url

    for icon in ApplicationIcon.objects.all():
        iconurl = icon.url
        if iconurl.startswith('http://'):
            continue
        if not iconurl.startswith('/'):
            iconurl = '/' + iconurl

        if url.startswith(iconurl):
            if maxlength is not None and len(iconurl) < maxlength:
                continue

            crumb = {'url': icon.url,
                     'description': icon.name,
                     'title': icon.description or icon.name}

            maxlength = len(iconurl)
            found = (icon.application_screen.crumbs() + [crumb],
                     iconurl,
                     url[len(iconurl):])

    return found
