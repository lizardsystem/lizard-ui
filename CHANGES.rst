Changelog of lizard-ui
======================


3.11 (2012-01-17)
-----------------

- Made breadcrumbs configurable

- Added helper functions for breadcrumbs to application screens


3.10 (2012-01-04)
-----------------

- Changed confusing breadcrumbs into a simple "home" link.


3.9 (2011-12-12)
----------------

- Fix bug where Ajax calls failed because they didn't have a CSRF cookie.


3.8.1 (2011-12-08)
------------------

- Fix bug where loginform didn't redirect.

3.8 (2011-12-07)
----------------

- Added narrowcasting.png icon as on heerhugowaard sites.


3.7.1 (2011-11-28)
------------------

- Fix incorrect syntax in lizard.js.


3.7 (2011-11-08)
----------------

- Added ``live: true`` to tipsy tooltips so that elements created later can also get tooltips


3.6 (2011-10-28)
----------------

- Swapped order of datatable and colorpicker in the js list as
  django-compressor chokes on them a bit.

- Made debugmode_urlpatterns() more robust. It crashed without MEDIA_URL and
  MEDIA_ROOT settings in the settings.py

- Improved i18n and tipsy tooltips.


3.5 (2011-10-19)
----------------

- Using django-staticfiles' urls instead of django's build-in
  contrib.staticfiles'. This works with "runserver" but fails with
  "run_gunicorn" (if you enabled gunicorn in your project).

- Added experimental table sorter javascript.

- Print improvements (hiding openlayers controls, for instance).

- Moved from company-internal svn to github:
  https://github.com/lizardsystem/lizard-ui .


3.4 (2011-09-23)
----------------

- Renamed ``media/`` directory into ``static/`` as that's django-staticfiles'
  sane default now.

- Added 'i18n' management command for easier translation.

- Added config checks for i18n settings now that default strings slowly become
  English instead of the Dutch we've been implicitly expecting...

- Added translation markers + Dutch translations for several strings.


3.3 (2011-09-05)
----------------

- Added optional sentry setup.

- Re-did login view as a class based view.

- Fixed the problem that the print of the web page showed a progress icon
  instead of a graphs (ticket 3180).


3.2 (2011-08-30)
----------------

- Added short_timedelta template filter.

- Added ViewContextMixin mixin class for class based views that adds {'view':
  self} to your view's context dict. This should be all you need to have in
  your context.


3.1.2 (2011-08-29)
------------------

- Fixed debugmode_urlpatterns checker.


3.1.1 (2011-08-29)
------------------

- Adding checker that warns if the debugmode_urlpatterns isn't being imported.


3.1 (2011-08-29)
----------------

- TracebackLoggingMiddleware isn't needed anymore, so the config checker now
  tells you that if you still have it in your MIDDLEWARE_CLASSES.

- Switched off sql statement logging by default.

- Added url patterns for showing static/ and media/ files in debug mode. Use
  it by importing ``debugmode_urlpatterns`` from ``lizard_ui.urls`` and
  calling ``urlpatterns += debugmode_urlpatterns()``.


3.0 (2011-08-19)
----------------

- Added javascript-based csrf-for-ajax fix suggested in
  https://docs.djangoproject.com/en/1.3/ref/contrib/csrf/#ajax

- Adjusted for Django 1.3. Note that this is now also a dependency! Upgrading
  will be slightly harder. Run ``bin/django check_config`` to check your
  config afterwards. See the README for more how-to-change information.


2.1.6 (2011-08-10)
------------------

- Added projecten.png, oppervlaktewater.png, grondwater.png,
  riolering.png.


2.1.5 (2011-08-01)
------------------

- Added ApplicationScreen.crumb.

- Added oevers.png.


2.1.4 (2011-07-28)
------------------

- Removed tipsy code specific for lizard-map (reference to
  #transparency-slider).

- Moved tipsy code into setUpTipsy().


2.1.3 (2011-07-12)
------------------

- Removed console.log.


2.1.2 (2011-07-12)
------------------

- Rewritten stretchOneSidebarbox: the old one used to stretch big
  first and then shrink to the correct size. The problem was that the
  scroll focus for large lists would change. #3030.


2.1.1 (2011-06-30)
------------------

- Added option google_tracking_code in realbase.


2.1 (2011-06-29)
----------------

- Updated favicon.ico to lizard.

- Added 'play' icon.


2.0 (2011-06-22)
----------------

- Fixed logo (it was slightly to high).


1.70 (2011-06-22)
-----------------

- Newer lizard logo (without the gray background as that conflicts with our
  own gray gradient), but that's ok for now.

- More app icons with shadows.


1.69 (2011-06-21)
-----------------

- Made popups more consistent (shadow color and size).


1.68 (2011-06-17)
-----------------

- Fixed .gif image that was a wrong file type.


1.67 (2011-06-16)
-----------------

- Fixed #2882: changed css to make some parts overflow: auto.


1.66 (2011-06-16)
-----------------

- Added error message when next accordion pane fails to load.


1.65 (2011-06-10)
-----------------

- Added reloadLocalizedGraphs() in addition to reloadGraphs() to reload only
  graphs inside a certain div. (Used in lizard-map popups with tabs).

- Added Tipsy (Facebook/Github-style tooltips https://github.com/jaz303/tipsy)

- Added buttons.css (from https://github.com/ubuwaits/css3-buttons)

- Some repeatable backgrounds. (from http://subtlepatterns.com/)

- Some icons from http://glyphicons.com/, added/implemented seperately.
  (TODO: integrate properly in sprite.png and the stylesheet of silk)

- OpenLayers 'Dark' theme.

- Re-exported several icon PNG's (meldingen, kaarten) with an alphachannel
  drop-shadow.

- Added extra field to ApplicationScreen model. (description, for display in
  tipsy tooltips)

- Centered the icons in the 'iphonesque' app-screen.

- Added inset drop-shadows to the app-screen.

- Changed the app-screen font to helvetica-light. (TODO: Try out Google
  Webfonts instead)

- Changed gray H2 bars' bevel to a higher contrast, expressing more depth.

- Aligned lizard logo to the outmost left.
.
- Added tooltips to several interface elements.

- Improved appearance of the breadcrumb. (TODO: position is still a bit
  awkward?)

- Changed OpenLayers javascript + css so that the layer chooser's
  background color matches the rest of the dark theme.


1.64 (2011-06-01)
-----------------

- Changed accordion behaviour. All titles are refreshed, but we don't refresh
  all pane contents anymore: only the new one. This makes sure trees stay
  expanded. And it reduces re-rendering time for big trees. And we
  theoretically don't need to send over all the panes' data in case that's
  prohibitive for performance.


1.63 (2011-05-30)
-----------------

- Removed relative positioning on #portal-tabs. See ticket #2827.
- Reverted my changes made to .sidebarbox-action-icon in changeset:21174. Even
  added 1px extra to better vertically align workspace items. See ticket #2750
  for screenshots.
- Added a extra class name for save_form.
- Bigger portal-tabs with rounded corners.
- Corrected text-align of wrong-login.
- "Log in" and "Log uit" links have the same cursor: they were different and
  "Log uit" had an illogical one, viz. cursor:text.


1.62 (2011-05-18)
-----------------

- Fixed vertical location of workspaceitem icons that aren't part of a header.


1.61 (2011-05-17)
-----------------

- Fixing menubar at 2em height to keep longer content from overflowing the
  bar.

- Added favicon image in ``media/lizard_ui/favicon.ico``. So if you want a
  different favicon in your project, place an updated icon in your site's
  ``media/lizardui/`` folder.


1.60 (2011-05-06)
-----------------

- Changed CSS of .workspace (#2659).

- Added five custom icons. (Gijs, req. by Dave)

- Downgraded to jQuery 1.5.1 due to IE8 bug in 1.5.2.
  See https://office.nelen-schuurmans.nl/trac/ticket/2656#comment:5
  See http://bugs.jquery.com/ticket/8755


1.59 (2011-04-28)
-----------------

- Deleted 'Copyright @ Nelen ...' text.


1.58 (2011-04-27)
-----------------

- Added dacom icon.

- Updated tabs css (needed for lizard-map >= 1.71).


1.57 (2011-04-20)
-----------------

- Added new flooding icon flooding2.png.

- Updated OpenLayers from 2.8 to 2.10.

- Jslint lizard.js.


1.56 (2011-04-14)
-----------------

- Updated Lizard logo.

- Added lizard_ui/tabs.css.

- Updated jQuery from 1.4.2 to 1.5.2, jQuery UI from 1.8.2 to 1.8.11,
  jQueryTools from 1.2.2 to 1.2.5. Treeview from 1.4 to 1.4.1.

- Added css class for progress animation image


1.55 (2011-04-05)
-----------------

- Added 3di icon.

- Added Waterbalance icon.


1.54 (2011-03-18)
-----------------

- Removed width: 100% css for .auto-inserted. It works fine without
  it. Before the image was slightly scaled horizontally.

- Added possibility for a double-height item in the
  divideVerticalSpaceEqually() method.  Just add a
  "double-vertical-item" class instead of "vertical-item" to the item
  you want to give double the height.


1.53 (2011-03-09)
-----------------

- Removed setUpWorkspaceAcceptableButtons. The button is now added
  when a workspace-acceptable is clicked (lizard-map 1.58 and higher).

- Adding error message when a "replace-with-image" image is loaded and
  there's an error. Instead of an ever-spinning "loading..." icon.


1.52 (2011-02-23)
-----------------

- Centered the progress animation.

- Added data-src to progress animation (for debugging purposes).


1.51 (2011-02-15)
-----------------

- Added progress animation to vertical-item / img-use-my-size /
  replace-with-image.


1.50 (2011-02-15)
-----------------

- Added icons dike and controlnext.


1.36 (2011-02-15)
-----------------

- Added application screens and icons support: added models and views.


1.35 (2011-02-02)
-----------------

- Refactored the window.resize function in lizard.js [Gijs].


1.34 (2011-02-01)
-----------------

- Added breadcrumbs example.

- Added new breadcrumbs method. See examples.

- Added protovis library.

- Added support for portal-tabs, see also the examples page.


1.33 (2011-01-24)
-----------------

- Removed preventDefault in logout function.


1.32 (2011-01-20)
-----------------

- Still trying to fix logout bug.


1.31 (2011-01-20)
-----------------

- Fixed logout bug.


1.30 (2011-01-20)
-----------------

- Added turtle app icon.

- After logging out one goes back to "/".

- Improved login function.

- Added (empty) login screen with redirect option.


1.29 (2011-01-13)
-----------------

- Added &nbsp; to workspace acceptable button.


1.28 (2011-01-12)
-----------------

- Added setUpWorkspaceAcceptableButtons in lizard.js. The function is
  in lizard-ui because setUpAccordion needs the function as well.


1.27 (2010-12-08)
-----------------

- Loading accordions re-initializes tree structures.


1.26 (2010-12-06)
-----------------

- Added default 500 and 404 pages.


1.25 (2010-12-01)
-----------------

- Added custom templatetag dutch_timedelta.

- Moved tooltip css from lizard_map to here.

- Add optional description to tree snippet.


1.24 (2010-11-24)
-----------------

- Added css class action-icon.


1.23 (2010-11-11)
-----------------

- (Re-)initializes tooltips when loading accordion.

- Added setUpTooltips() in lizard.js.


1.22 (2010-11-09)
-----------------

- Updated accordion: when an item is clicked, all panes and headers
  are updated.


1.21 (2010-10-15)
-----------------

- Fix "apple" icon height to 80px.


1.20 (2010-10-15)
-----------------

- Fixed IE7 print problem.

- Added exception-logging middleware.

- Added app_icons.

- Added sidebar and sidebarbox css entries.

- Added tree_snippet.html template for creating trees.


1.19 (2010-09-27)
-----------------

- Fixed float problem for IE in login popup.

- Fixing visibility of "restore from print view" icon in IE.


1.18 (2010-09-27)
-----------------

- Added automatic print button that also allows you to expand the
  collapsed-for-printing view again.

- Tables now print with a grid and proper left/center/right alignment.

- Links don't print anymore (at least, their url isn't appended anymore to the
  link text when printing).


1.17 (2010-09-22)
-----------------

- Add colorpicker js library.

- Added createcoverage command.



1.16 (2010-09-08)
-----------------

- Added more tests.

- Small layout tweak for popup box.


1.15 (2010-09-03)
-----------------

- Added utility templatetags.


1.14 (2010-08-30)
-----------------

- Importing json via django now.


1.13 (2010-08-30)
-----------------

- Bugfix simplejson.


1.12 (2010-08-27)
-----------------

- Small adjustments to support lizard-map's new graph popup.  (A better
  separation of lizard-ui and lizard-map is needed later on: after the
  deadlines :-) ).


1.11 (2010-08-26)
-----------------

- Styled the login form including proper "enter" behaviour and
  first-field-gets-focus handling.


1.10 (2010-08-26)
-----------------

- Moved some css styling from lizard-map to lizard-ui.

- Added initial login support + forms.  You need to add lizard-ui's urls.py to
  yours if you want to use it.

- Better drag/drop visual feedback.


1.8 (2010-08-18)
----------------

- Javascript syntax fix: added two semicolons and removed another.


1.7 (2010-07-15)
----------------

- Make "replace-with-image" clickable by using "data-href-click"
  property.

- Add ol.forms css.


1.6 (2010-07-06)
----------------

- Image replacement looks at "use-my-size" class instead of
  use-my-width/height.

- Added javascript "printPage()" function that prints a webpage that at least
  doesn't flow over the right hand side of the physical paper page.  Printing
  uses a combination of a custom print stylesheet and blueprint's print
  stylesheet.  Printing definitively isn't perfect yet, but at least usable.
  Note: you should refresh or resize the page after printing to get the full
  width again.


1.5 (2010-07-01)
----------------

- Added generic automatic image resizing (replacing a generic "a href" with an
  image with the same src as the href and then figuring out the height/width
  and passing that along as a GET parameter and as attributes on the img tag.

- Fixed resize timer by having a global variable for it.

- Calculating hiddenStuffHeight (currently: only the date popup hidden div)
  only once: before the date popup has been opened..  Fixes the bug that you'd
  get a large empty space at the bottom of the screen.


1.4.1 (2010-06-25)
------------------

- Updated TODO list.


1.4 (2010-06-25)
----------------

- We're now on the python package index, hurray!
  http://pypi.python.org/pypi/lizard-ui

- Updated package metadata.

- Big README documentation update.


1.3 (2010-06-23)
----------------

- Added graph reloading on sidebar collapse/expand.

- UI css fixes (overflow:hidden in a couple of places to prevent scrollbars in
  corner cases, for instance).


1.2 (2010-06-22)
----------------

- Floating the main content area now and giving it the proper width with
  javascript.  This makes the layout in IE more reliable.

- The main body has "overflow: hidden" to get rid of scrollbars once and for
  all: scrollbars sometimes occur when there's a small layout bug.  A
  scrollbar takes up space, so the main content float is pushed down.  We have
  an assumption of a single page without scrolling, so hiding scrollbars is
  perfectly fine.  (The main area itself *can* have scrollbars for textual
  content).


1.1 (2010-06-18)
----------------

- IE tweaks.


1.0 (2010-06-17)
----------------

- Fixed javascript code with jslint.

- Added django-compressor for javascript and css compression and combination.
  You'll need to add the configuration in http://dpaste.de/xLDU/ to your
  settings and add "compressor" to your installed apps.

- Switched to a separate "javascript" and "css" block instead of the
  site-head-extras, head-extras and so.  Be sure to add {{super.block}} when
  you override the blocks.


0.12 (2010-06-11)
-----------------

- Upgraded to jqueryui 1.8.2 (from 1.8.1).

- Removed jqueryui's tab component as it conflicts with jquerytools'
  implementation.  Jquerytools' implementation is way friendlier to our
  existing sidebar css.


0.11 (2010-06-08)
-----------------

- Added direct support for a jquery tree.  We already contained the base
  treeview javascript, so lizard-ui was a logical place for setting it up.


0.10 (2010-06-07)
-----------------

- Added fillSidebar() alias for stretchOneSidebarBox().

- Splitted title block in sitetitle/subtitle as that's a common occurrence.


0.9 (2010-06-03)
----------------

- Using jquery's live() for "late binding" of events to elements added later
  through javascript.  Saves some couple of lines.


0.8 (2010-06-01)
----------------

- Added generic accordion handling for the sidebar.  Including ajaxy loading.


0.7 (2010-05-18)
----------------

- Added jquerytools for accordeon behaviour in sidebar.

- Layout fixes, mostly for the sidebar.  Also fix for the datepicker-placed
  div at the bottom.

- Update to jquery-ui 1.8.1.


0.6 (2010-04-28)
----------------

- Added collapsible sidebar.

- Changed css framework from yui to blueprint: more understandable.  The
  reason for yui was that it had a 100%-width layout.  We're now building up
  the layout (grid-wise) ourselves due to the collapsible sidebar, so
  switching back to blueprint is now possible.

- Changed layout to match Dirk-Jan's latest screenshots.


0.5 (2010-04-13)
----------------

- Layout improvements.

- Added documentation (just mount our urls!).

- Removed separate icons, leaving only the sprite'd icons.

- Added jqueryui.  Including it automatically.  It also means extjs isn't
  included automatically anymore.

- Sidebar width is 300px instead of 180px.


0.4 (2010-03-16)
----------------

- Added extjs javascript library.

- Added javascript and css for dividing the vertical space equally.


0.3.1 (2010-03-05)
------------------

- Bugfix: removed sample breadcrumb content from the template.


0.3 (2010-03-05)
----------------

- Added openlayers 2.8.

- Added famfamfam silk icon set.

- Added background to menubar, footer and body.

- Removed blueprint and added the YUI css framework.


0.2 (2010-02-12)
----------------

- Nested our templates in templates/lizard_ui instead of directly in
  templates.  We're well-behaved now!


0.1 (2010-02-12)
----------------

- Added lizardbase.html template as base for a lizard user interface.

- Added django-staticfiles as a dependency for managing css and javascript
  resources.

- Added blueprint css framework.

- Initial structure created by nensskel.
