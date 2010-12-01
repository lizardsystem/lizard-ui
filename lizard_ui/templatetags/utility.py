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


@register.filter
def dutch_timedelta(seconds):
    """
    Make friendly looking duration in dutch.

    60 -> "1 minuut"
    65 -> "1 minuut, 5 seconden"
    125 -> "2 minuten, 5 seconden"
    3600 -> "1 uur"
    3700 -> "1 uur, 1 minuut" (rounded off)
    86400 -> "1 dag"
    """
    if not seconds:  # Either seconds is None, or 0, or 0.0..
        return "0"

    seconds = int(seconds)  # Make sure input is int
    days, hours, minutes = None, None, None
    result = []

    if seconds >= 86400:
        days = seconds / 86400
        seconds = seconds - days * 86400
        if days == 1:
            result.append("%d dag" % days)
        else:
            result.append("%d dagen" % days)
    if seconds >= 3600:
        hours = seconds / 3600
        seconds = seconds - hours * 3600
        result.append("%d uur" % hours)
    if seconds >= 60:
        minutes = seconds / 60
        seconds = seconds - minutes * 60
        if minutes == 1:
            result.append("%d minuut" % minutes)
        else:
            result.append("%d minuten" % minutes)
    if seconds == 1:
        result.append("%d seconde" % seconds)
    elif seconds > 1:
        result.append("%d seconden" % seconds)

    return ', '.join(result[:2])
