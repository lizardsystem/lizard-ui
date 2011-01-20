# login tools for lizard_ui

from django import template

register = template.Library()


@register.inclusion_tag("lizard_ui/tag_login.html",
                        takes_context=True)
def display_login(context):
    result = {'user': context['user']}
    if 'next' in context:
        result.update({'next': context['next']})
    return result
