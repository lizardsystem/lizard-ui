"""Dummy implementation of lizard5_site multitenancy.

This way the lizard5 multitenancy implementation can stay the same.
"""


def set_host(*args, **kwargs):
    pass


try:
    from lizard5_site.router import set_host
except ImportError:
    pass
