/* Javascript functions for the lizard user interface */


function fillScreen() {
  /* Resize the main body elements (#sidebar, #content and #map) so that we
     fill the screen completely.

     Detect the height of the window and subtract the known vertical elements
     like header, footer and main content margin/border.

     The resulting height is available as "mainContentHeight".
   */
  var jqueryBug = $("#ui-datepicker-div").outerHeight(true);
  var viewportHeight = $(window).height() - jqueryBug;
  var bottomMargin = $("#page").outerHeight(true) - $("#page").innerHeight();
  var headerHeight = $("#header").outerHeight(true);
  var stuffAroundSidebar = $("#sidebar").outerHeight(true) -
    $("#sidebar").innerHeight();
  sidebarHeight = viewportHeight - headerHeight - bottomMargin - stuffAroundSidebar;
  var footerHeight = $("#footer").outerHeight(true);
  var menubarHeight = $("#menubar").outerHeight(true);
  var stuffAroundMainContent = $("#content").outerHeight(true) -
    $("#content").innerHeight();
  mainContentHeight = viewportHeight - headerHeight - bottomMargin
        - footerHeight - menubarHeight - stuffAroundMainContent;
  $("#sidebar").height(sidebarHeight);
  $("#collapser").height(sidebarHeight);
  $("#content").height(mainContentHeight);
  $("#map").height(mainContentHeight);
  mainContentWidth = $("#content").innerWidth() - 100;
}


function showExampleMap() {
  /* Show an example map.  For use with the lizardgis.html template.  */
  var map = new OpenLayers.Map('map');
  var wms = new OpenLayers.Layer.WMS(
    "OpenLayers WMS",
    "http://labs.metacarta.com/wms/vmap0", {layers: 'basic'});
  map.addLayer(wms);
  map.zoomToMaxExtent();
}


function divideVerticalSpaceEqually() {
    /* For #evenly-spaced-vertical, divide the vertical space evenly between
       the .vertical-item elements.
       Take note of the 4px border between them.
     */
  var numberOfItems = $('#evenly-spaced-vertical > .vertical-item').length;
  verticalItemHeight = Math.floor(mainContentHeight / numberOfItems) - 1;
  $('#evenly-spaced-vertical > .vertical-item').height(verticalItemHeight);
}


function setUpCollapsibleSidebarBoxes() {
    /* Headers with .collapsible are set up so jquery(ui) nicely collapses the
       headers when clicked.
    */
    $(".collapsible").each(function() {
        $(this).prepend("<span class='ui-icon ui-icon-triangle-1-s'></span>")
    });
    $(".collapsible").toggle(
        function() {
            $('.ui-icon', this).removeClass('ui-icon-triangle-1-s');
            $('.ui-icon', this).addClass('ui-icon-triangle-1-e');
            $(this).next().slideUp(stretchOneSidebarBox);
        },
        function() {
            $('.ui-icon', this).addClass('ui-icon-triangle-1-s');
            $('.ui-icon', this).removeClass('ui-icon-triangle-1-e');
            $(this).next().slideDown(stretchOneSidebarBox);
        });
}


function setUpCollapsibleSidebar() {
    /* Set up the sidebar to be opened/closed completely */
    $("#collapser").toggle(
        function(){
            $("#sidebar").fadeOut(function() {
                $("#page").removeClass("sidebar-open").addClass("sidebar-closed");
                fillScreen()
            });
        },
        function(){
            $("#page").removeClass("sidebar-closed").addClass("sidebar-open");
            $("#sidebar").fadeIn('slow', function() {
                fillScreen()
            });
        });
}


function stretchOneSidebarBox() {
  /* Stretch out one sidebarbox so that the sidebar is completely filled */
  $("#sidebar .sidebarbox-stretched").height('0');
  var stillAvailable = $("#sidebar").innerHeight();
  $("#sidebar > *").each(function() {
    stillAvailable -= $(this).outerHeight(includeMargin=true);
  });
  $("#sidebar .sidebarbox-stretched").height(stillAvailable);
}


/* Fill the screen (again) when we open the page and when the window is
   resized.
*/
$(document).ready(fillScreen);
$(window).resize(fillScreen);

$(document).ready(divideVerticalSpaceEqually);
$(window).resize(divideVerticalSpaceEqually);

$(document).ready(setUpCollapsibleSidebarBoxes);
$(document).ready(setUpCollapsibleSidebar);

$(document).ready(stretchOneSidebarBox);
$(window).resize(stretchOneSidebarBox);
