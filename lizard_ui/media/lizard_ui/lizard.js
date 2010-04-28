/* Javascript functions for the lizard user interface */


function fillScreen() {
  /* Resize the main body elements (#sidebar, #content and #map) so that we
     fill the screen completely.

     Detect the height of the window and subtract the known vertical elements
     like header, footer and main content margin/border.

     The resulting height is available as "mainContentHeight".
   */
  var viewportHeight = $(window).height();
  var headerHeight = $("#hd").outerHeight();
  var footerHeight = $("#footer").outerHeight();
  var stuffAroundMainContent = $("#bd").outerHeight(true) -
    $("#bd").innerHeight();
  mainContentHeight = viewportHeight - headerHeight
    - footerHeight - stuffAroundMainContent;
  $("#sidebar").height(mainContentHeight);
  $("#content").height(mainContentHeight);
  $("#map").height(mainContentHeight);
  mainContentWidth = $("#content").innerWidth();
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
  verticalItemHeight = (mainContentHeight / numberOfItems) - 4;
  $('#evenly-spaced-vertical > .vertical-item').height(verticalItemHeight);
}


function setUpCollapsibleSidebar() {
    /* Headers with .collapsible are set up so jquery(ui) nicely collapses the
       headers when clicked.
    */
  $(".collapsible").each(function() {
    //$(this).addClass("ui-helper-reset");
    //$(this).addClass("ui-widget-header");
    //$(this).addClass("ui-corner-all");
    $(this).prepend("<span class='ui-icon ui-icon-triangle-1-s'></span>")
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
      })
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

$(document).ready(setUpCollapsibleSidebar);

$(document).ready(stretchOneSidebarBox);
$(window).resize(stretchOneSidebarBox);
