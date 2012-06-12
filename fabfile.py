from fabric.api import local

def transifex():
    """Push and pull the language set."""

    local('tx push -s -t')
    local('tx pull')
