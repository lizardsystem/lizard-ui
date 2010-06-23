/* Javascript functions for the lizard user interface */

// jslint configuration
/*jslint browser: true */
/*global $, OpenLayers, window */

// Globals that we define
var mainContentHeight, sidebarHeight, mainContentWidth, verticalItemHeight,
    accordion;


function reloadGraphs() {
    // Overridden in krw-waternet...
    //loadCorrectlySizedImages();
}


function stretchOneSidebarBox() {
    /* Stretch out one sidebarbox so that the sidebar is completely filled */
    var stillAvailable, includeMargin;
    $("#sidebar .sidebarbox-stretched").height('0');
    stillAvailable = $("#sidebar").innerHeight();
    $("#sidebar > *").each(function () {
        stillAvailable -= $(this).outerHeight(includeMargin = true);
    });
    $("#sidebar .sidebarbox-stretched").height(stillAvailable);
}


function fillSidebar() {
    /* Basically only an alias to have a simpler name: fill up the sidebar by
    streching  the appropriate box. */
    stretchOneSidebarBox();
}


function fillScreen() {
    /* Resize the main body elements (#sidebar, #content and #map) so that we
    fill the screen completely.

    Detect the height of the window and subtract the known vertical elements
    like header, footer and main content margin/border.

    The resulting height is available as "mainContentHeight".  */

    var jqueryBug, viewportHeight, bottomMargin, headerHeight,
        stuffAroundSidebar, footerHeight, menubarHeight,
        stuffAroundMainContent, mainAreaWidth, sidebarWidth, collapserWidth,
        mainDivWidth, viewportWidth;
    // Width.
    viewportWidth = $("body").innerWidth();
    mainAreaWidth = viewportWidth - $("#page").outerWidth(true) +
        $("#page").innerWidth();
    sidebarWidth = $("#sidebar").outerWidth(true);
    collapserWidth = $("#collapser").outerWidth(true);
    mainDivWidth = mainAreaWidth - sidebarWidth - collapserWidth - 2;
    // ^^^ 2px border for the content.
    $("#main").width(mainDivWidth);
    mainContentWidth = $("#content").innerWidth();
    // Height.
    jqueryBug = $("#ui-datepicker-div").outerHeight(true);
    viewportHeight = $(window).height() - jqueryBug;
    bottomMargin = $("#page").outerHeight(true) - $("#page").innerHeight();
    headerHeight = $("#header").outerHeight(true);
    stuffAroundSidebar = $("#sidebar").outerHeight(true) -
        $("#sidebar").innerHeight();
    sidebarHeight = viewportHeight - headerHeight - bottomMargin -
        stuffAroundSidebar;
    footerHeight = $("#footer").outerHeight(true);
    menubarHeight = $("#menubar").outerHeight(true);
    stuffAroundMainContent = $("#content").outerHeight(true) -
        $("#content").innerHeight();
    mainContentHeight = viewportHeight - headerHeight - bottomMargin -
        footerHeight - menubarHeight -
        stuffAroundMainContent;
    $("#sidebar").height(sidebarHeight);
    $("#collapser").height(sidebarHeight);
    $("#content").height(mainContentHeight);
    $("#map").height(mainContentHeight);
}


function showExampleMap() {
    /* Show an example map.  For use with the lizardgis.html template.  */
    var map, wms;
    map = new OpenLayers.Map('map');
    wms = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
        "http://labs.metacarta.com/wms/vmap0", {layers: 'basic'});
    map.addLayer(wms);
    map.zoomToMaxExtent();
}


function divideVerticalSpaceEqually() {
    /* For #evenly-spaced-vertical, divide the vertical space evenly between
    the .vertical-item elements.  Take note of the 4px border between them.
    */
    var numberOfItems = $('#evenly-spaced-vertical > .vertical-item').length;
    verticalItemHeight = Math.floor(mainContentHeight / numberOfItems) - 1;
    $('#evenly-spaced-vertical > .vertical-item').height(verticalItemHeight);
}


function setUpCollapsibleSidebarBoxes() {
    /* Headers with .collapsible are set up so jquery(ui) nicely collapses the
       headers when clicked.
    */
    $(".collapsible").each(function () {
        $(this).prepend("<span class='ui-icon ui-icon-triangle-1-s'></span>");
    });
    $(".collapsible").toggle(
        function () {
            $('.ui-icon', this).removeClass('ui-icon-triangle-1-s');
            $('.ui-icon', this).addClass('ui-icon-triangle-1-e');
            $(this).next().slideUp(stretchOneSidebarBox);
        },
        function () {
            $('.ui-icon', this).addClass('ui-icon-triangle-1-s');
            $('.ui-icon', this).removeClass('ui-icon-triangle-1-e');
            $(this).next().slideDown(stretchOneSidebarBox);
        });
}


function setUpCollapsibleSidebar() {
    /* Set up the sidebar to be opened/closed completely */
    $("#collapser").toggle(
        function () {
            $("#sidebar").fadeOut(function () {
                $("#page").removeClass("sidebar-open").addClass("sidebar-closed");
                fillScreen();
                reloadGraphs();
            });
        },
        function () {
            $("#page").removeClass("sidebar-closed").addClass("sidebar-open");
            $("#main").width($("#main").width() - 310);
            $("#sidebar").fadeIn('slow', function () {
                fillScreen();
                fillSidebar();
                reloadGraphs();
            });
        });
}


function setUpAccordion() {
    $("#accordion").tabs(
        "#accordion .pane",
        {tabs: "h2, h3",
         effect: "slide"});
    /* Set up a global 'accordion' variable to later steer the animation. */
    accordion = $("#accordion").tabs();
    $(".accordion-load-next a").live('click', function (event) {
        var pane, nextPaneId, url;
        event.preventDefault();
        pane = $(this).parents(".accordion-load-next");
        nextPaneId = pane.attr("data-next-pane-id");
        url = $(this).attr("href");
        $(nextPaneId).html('<div class="loading" />');
        $(nextPaneId).load(url + " " + nextPaneId);
        $("li.selected", pane).removeClass("selected");
        $(this).parent("li").addClass("selected");
        accordion.click(accordion.getIndex() + 1);
    });
}


function setUpTree() {
    $(".automatic-tree").each(function () {
        if (!$(this).data("tree-initialized")) {
            $(this).data("tree-initialized", true);
            $(this).treeview({
                collapsed: true
            });
        }
    });
}


/* sets up the auto resize sidebar and screen

   use this function when altering sidebar without reloading the page
*/
function setUpScreen() {
    fillScreen();
    divideVerticalSpaceEqually();
    setUpCollapsibleSidebarBoxes();
    setUpCollapsibleSidebar();
    stretchOneSidebarBox();
}


/* Fill the screen (again) when we open the page and when the window is
   resized.
*/
$(window).resize(function () {
    // Don't re-calculate 50 times while resizing, only when finished.
    var resizeTimer;
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(
        function () {
            fillScreen();
            divideVerticalSpaceEqually();
            stretchOneSidebarBox();
        },
        600);
});


$(document).ready(fillScreen);
$(document).ready(divideVerticalSpaceEqually);
$(document).ready(setUpCollapsibleSidebarBoxes);
$(document).ready(setUpCollapsibleSidebar);
$(document).ready(setUpAccordion);
$(document).ready(setUpTree);
$(document).ready(stretchOneSidebarBox);
