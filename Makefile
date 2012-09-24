all:
	@echo "note: if this fails at lines starting with \"&\" and \"@\" characters, update less to the latest version:"
	@echo "      npm install less"
	lessc lizard_ui/static/bootstrap/less/bootstrap.less lizard_ui/static/bootstrap/less/bootstrap.css
#	Not used anymore
#	coffee -c lizard_ui/static/lizard_ui/lizardui.coffee
