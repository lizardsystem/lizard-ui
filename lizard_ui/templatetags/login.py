# login tools for lizard_ui

from django import template

register = template.Library()

@register.inclusion_tag("lizard_ui/tag_login.html",
                        takes_context=True)
def display_login(context, redirect_path=None):
    if redirect_path is None:
        redirect_path = "./"
    return {'user': context['user'], 'redirect_path': redirect_path}
