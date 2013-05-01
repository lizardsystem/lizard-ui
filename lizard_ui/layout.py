"""Layout helpers."""


class Action(object):
    """Small wrapper for actions, just to make the attributes explicit.

    A dictionary with keys instead of attributes is just as fine for the
    templates, but for documentation purposes this class is handier.

    - **name**: text of the link.

    - **element_id**: id the element will get in the HTML. The id is prepended
      with 'action-'.

    - **icon**: icon class according to
      http://twitter.github.com/bootstrap/base-css.html#icons, optional.

    - **url**: where the link points at.

    - **description**: optional description for helpful popup.

    - **klass**: optional CSS class to give to the link. This allows you to
      tie custom javascript handling to the link.

    - **data_attributes**: optional dictionary to set data-xyz attributes on
      the action that can be used by css that reacts on the actions.

    """
    def __init__(self, name=None, element_id=None, icon=None, url='#',
                 description=None, klass=None, data_attributes=None):
        self.name = name
        if element_id is not None:
            self.element_id = 'action-%s' % element_id
        self.icon = icon
        self.url = url
        self.description = description
        self.klass = klass
        self.data_attributes = data_attributes
