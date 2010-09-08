# utilities for making life easier

from django import template
from django.utils.safestring import mark_safe

register = template.Library()


def split_len(seq, length):
    """
    Takes a string and returns a list containing the n-sized pieces of
    the string, starting at the end. """

    # Nice... stride backwards using step length of one reverses the string.
    seq_rev = seq[::-1]
    result = [seq_rev[i:i + length][::-1] for i in range(0, len(seq), length)]
    result.reverse()
    return result


@register.filter
def euro(price):
    """
    Make friendly looking euro price

    10000.0 -> &euro; 10.000,- (which will show as a euro sign in your
    web browser)
    """

    if isinstance(price, float) or isinstance(price, int):
        price_string = '%.0f' % price
        price_list = split_len(price_string, 3)
        price_with_points = '.'.join(price_list)

        # Mark the output as safe
        return mark_safe(u'&euro; %s,-' % price_with_points)
    else:
        return '(geen bedrag)'
