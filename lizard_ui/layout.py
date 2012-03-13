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
    def __init__(self, name=None, icon=None, url='#', description=None,
                 klass=None):
        self.name = name
        self.icon = icon
        self.url = url
        self.description = description
        self.klass = klass
