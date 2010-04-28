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

/* Fill the screen (again) when we open the page and when the window is
   resized.
*/
$(document).ready(fillScreen);
$(window).resize(fillScreen);
$(document).ready(divideVerticalSpaceEqually);
$(window).resize(divideVerticalSpaceEqually);
