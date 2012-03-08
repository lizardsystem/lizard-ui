"""Layout helpers."""

from django.utils.safestring import mark_safe
from django.template import Context, loader


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
    def __init__(self, name=None, icon=None, url='', description=None,
                 klass=None):
        self.name = name
        self.icon = icon
        self.url = url
        self.description = description
        self.klass = klass


class WorkspaceAcceptable(object):
    """Wrapper/Interface for WorkspaceAcceptable items and html generation.

       A dictionary with keys instead of attributes is just as fine for the
    templates, but for documentation purposes this class is handier.

    - **name**: text of the link.

    """
    template = 'lizard_ui/workspace_acceptable.html'

    def __init__(self, name, description, adapter_layer_json, url=None,
                 workspace_type=None, adapter_name=None):
        self.name = name
        self.description = description
        self.adapter_layer_json = adapter_layer_json
        self.url = url
        if workspace_type is None:
            self.workspace_type = 'workspace-acceptable'
        else:
            self.workspace_type = workspace_type
        self.adapter_name = None
        if adapter_name is not None:
            self.adapter_name = adapter_name

    def to_html(self):
        template = loader.get_template(self.template)
        context = Context({'acceptable': self})
        return mark_safe(template.render(context))
