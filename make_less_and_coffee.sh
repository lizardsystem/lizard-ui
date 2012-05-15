#!/bin/sh
lessc lizard_ui/static/bootstrap/less/bootstrap.less lizard_ui/static/bootstrap/less/bootstrap.css
coffee -c lizard_ui/static/lizard_ui/lizardui.coffee
