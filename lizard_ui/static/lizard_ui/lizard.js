/* Javascript functions for the lizard user interface */

// jslint configuration.  Don't put spaces before 'jslint' and 'global'.
/*jslint browser: true */
/*global $, OpenLayers, window */

// Globals that we ourselves define.
var hiddenStuffHeight, mainContentHeight, sidebarHeight, mainContentWidth,
    verticalItemHeight, accordion, resizeTimer, cachedScrollbarWidth;

/* Set to the number of graphs to reload. This variable is used to be able to
 * detect when he last graph is reloaded. */
 var graphsToReload = 0;

// Csrf-for-ajax fix suggested in
// https://docs.djangoproject.com/en/1.3/ref/contrib/csrf/#ajax
$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});


function scrollbarWidth() {
    return cachedScrollbarWidth;
}

function calculateScrollbarWidth() {
    // Copied from http://jdsharp.us/jQuery/minute/calculate-scrollbar-width.php
    var div, w1, w2;
    div = $('<div style="width:50px;height:50px;overflow:hidden;' +
            'position:absolute;top:-200px;left:-200px;">' +
            '<div style="height:100px;"></div>');
    // Append our div, do our calculation and then remove it
    $('body').append(div);
    w1 = $('div', div).innerWidth();
    div.css('overflow-y', 'scroll');
    w2 = $('div', div).innerWidth();
    $(div).remove();
    cachedScrollbarWidth = (w1 - w2);
}

function reloadGraph($graph, max_image_width, callback) {
    var url, url_click, timestamp, width, height, amp_or_questionmark,
    html_img, image, $main_tag, html_src, html_url, errormsg;
    $main_tag = $graph;
    width = $graph.parent('.img-use-my-size').innerWidth();
    height = $graph.parent('.img-use-my-size').innerHeight();
    if ($graph.attr('data-errormsg')) {
        errormsg = $graph.attr('data-errormsg');
    } else {
        errormsg = 'De data is niet beschikbaar';
    }
    if (width === null) {
        width = '';
        height = '';
    } else {
        if (width > max_image_width) {
            width = max_image_width;
        }
        if (width < 10) {
            width = 0.5 * height;
        }
        if (height < 10) {
            height = 0.5 * width;
        }
        // Prevent a horizontal scrollbar in any case.
        width = width - scrollbarWidth();
    }
    $graph.hide();
    url = $graph.attr('href');
    if (url.indexOf('?') === -1) {
        amp_or_questionmark = '?';
    } else {
        amp_or_questionmark = '&';
    }
    url_click = $graph.attr('data-href-click');
    // Remove a previous image that's already there.
    // PROBABLY NOT NEEDED $('~ img', this).remove();
    timestamp = new Date().getTime();  // No cached images.
    html_url = url +
        amp_or_questionmark + 'width=' + width +
        '&height=' + height +
        '&random=' + timestamp;
    html_img = '<img src="' + html_url + '" class="auto-inserted" ' +
        '/>';
    // Remove progress animation and possibly old images.
    $main_tag.parent().find(".auto-inserted").remove();

    // Add progress animation.
    $graph.after('<div class="auto-inserted"><img src="/static_media/lizard_ui/ajax-loader.gif" class="progress-animation" data-src="' + html_url + '" /></div>');

    // Preload image.
    image = $(html_img);

    // Place <a href></a> around image tag.
    if (url_click !== undefined) {
        html_img = '<a href="' + url_click + '" class="auto-inserted">' + html_img + '</a>';
    }

    image.load(function () {
        // After preloading.
        // Remove progress animation and possibly old images.
        $main_tag.parent().find(".auto-inserted").remove();
        $main_tag.after(html_img);
	if (undefined != callback) {
	    callback();
	}
    });
    image.error(function () {
        // After preloading.
        // Remove progress animation and possibly old images.
        $main_tag.parent().find(".auto-inserted").remove();
        $main_tag.after(
            '<p class="auto-inserted">' +
                errormsg +
                '</p>');
	if (undefined != callback) {
	    callback();
	}
    });
}

/**
 * Resize the graphs to the given maximum width and reload them.
 *
 * @param {number} max_image_width maximum width to resize each graph to
 * @param {function} callback function to call when a graph has been reloaded
 */
function reloadGraphs(max_image_width, callback) {
    graphsToReload = $('a.replace-with-image').length
    $('a.replace-with-image').each(function () {
        reloadGraph($(this), max_image_width, callback);
    });
}


function reloadLocalizedGraphs($location, max_image_width) {
    $('a.replace-with-image', $location).each(function () {
        reloadGraph($(this, max_image_width));
    });
}


/**
 * Prints the current window when all graphs have been reloaded.
 */
function actualPrint() {
    graphsToReload -= 1;
    if (0 == graphsToReload) {
	window.print();
	/* We hid the Print link as soon as the user clicked it. Now it is safe
	 * to be clicked again. */
	$("a.ss_printer").show();
    }
}


function printPage() {
    /* Hide the print link to avoid multiple clicks on it while the first click
     * is still being handled. */
    $("a.ss_printer").hide();
    /* Resize the main window to get an image that is better suited for
     * printing. The image will be printed as soon as all graphs have
     * reloaded.*/
    var max_image_width = 850;
    if ($("#main").width() > max_image_width) {
        $("#main").width(max_image_width);
    }
    reloadGraphs(max_image_width, actualPrint);
}


function calculateHiddenStuffHeight() {
    // Calculate once.  If opened, the height isn't 5 but 208 or so...
    hiddenStuffHeight = $("#ui-datepicker-div").outerHeight(true);
}


function stretchOneSidebarBox() {
    /* Stretch out one sidebarbox so that the sidebar is completely filled. */
    var minHeight, stillAvailable, newHeight, sidebarboxStretched,
        includeMargin;
    minHeight = 100; // not smaller than this
    newHeight = $("#sidebar").height();  // Start with total available
    // Subtract other box sizes.
    $("#sidebar > *").not(".sidebarbox-stretched").each(function () {
        newHeight -= $(this).outerHeight(includeMargin = true);
    });
    // Now remove margin from sidebarbox-stretched, 1px
    sidebarboxStretched = $("#sidebar .sidebarbox-stretched");
    newHeight -= ($(sidebarboxStretched).outerHeight(includeMargin = true) -
                  $(sidebarboxStretched).height());
    newHeight = newHeight < minHeight ? minHeight : newHeight;
    $("#sidebar .sidebarbox-stretched").height(newHeight);
}


function fillSidebar() {
    /* Basically only an alias to have a simpler name: fill up the sidebar by
    stretching the appropriate box. */
    stretchOneSidebarBox();
}


function fillScreen() {
    /* Resize the main body elements (#sidebar, #content and #map) so that we
    fill the screen completely.

    Detect the height of the window and subtract the known vertical elements
    like header, footer and main content margin/border.

    The resulting height is available as "mainContentHeight".  */

    var viewportHeight, bottomMargin, headerHeight,
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
    viewportHeight = $(window).height() - hiddenStuffHeight;
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
    $("#textual").height(mainContentHeight);
    $("#map").height(mainContentHeight);
    // The next one ought to be in lizard-map.  For that we'd need a proper
    // set of events that other code can listen to.  So for the time being...
    $('#graph-popup-content').css(
        'max-height',
        mainContentHeight - 30);
    $('.popup-content').css(
        'max-height',
        mainContentHeight - 30);
}


function setUpPrintButton() {
    $('#print-button').addClass('ss_sprite');
    $('#print-button').addClass('ss_printer');
    $('#print-button').toggle(
        function () {
            printPage();
            $('#print-button').removeClass('ss_printer');
            $('#print-button').addClass('ss_arrow_right');
            $('#print-button').data("text", $('#print-button').text());
            $('#print-button').html('&nbsp;&nbsp;');
            return false;
        },
        function () {
            $('#print-button').removeClass('ss_arrow_right');
            $('#print-button').addClass('ss_printer');
            $('#print-button').text($('#print-button').data("text"));
            fillScreen();
            reloadGraphs();
            return false;
        });
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
    the .vertical-item elements.  Take note of the 4px border between
    them.
    Note that a "not-evenly-spaced" element will be given half the
    space.
    Handy for forms underneath the graphs.
    */
    var numberOfItems, numberOfDoubleItems;
    numberOfItems = $('#evenly-spaced-vertical > .vertical-item').length;
    numberOfDoubleItems = $('#evenly-spaced-vertical > .double-vertical-item').length;
    verticalItemHeight = Math.floor(
        (mainContentHeight / (numberOfItems + 2 * numberOfDoubleItems))) - 1;
    $('#evenly-spaced-vertical > .vertical-item').height(verticalItemHeight);
    $('#evenly-spaced-vertical > .double-vertical-item').height(2 * verticalItemHeight);
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


/* Initializes and shows (legend) tooltip. Must be re-initialized
after lizard-map workspace update.  */
function setUpTooltips() {
    $(".legend-tooltip").each(function () {
        if (!$(this).data("popup-initialized")) {
            $(this).data("popup-initialized", true);
            $(this).tooltip({
                position: 'center right',
                effect: 'fade',
                onShow: function () {
                    var offset, pixels_below_screen;
                    // Too high?
                    offset = this.getTip().offset();
                    if (offset.top < 0) {
                        offset.top = 0;
                        this.getTip().offset(offset);
                    }
                    // Too low?
                    pixels_below_screen = offset.top +
                        this.getTip().height() -
                        $(window).height();
                    if (pixels_below_screen > 0) {
                        offset.top = offset.top - pixels_below_screen;
                        this.getTip().offset(offset);
                    }
                    // Repositioning beforehand would be visually nicer.
                }
            });
        }
    });
}


/*
Sets up treestructures with an interactive interface. Use force_initialize.
*/
function setUpTree(force_initialize) {
    $(".automatic-tree").each(function () {
        if (!$(this).data("tree-initialized") || (force_initialize)) {
            $(this).data("tree-initialized", true);
            $(this).treeview({
                collapsed: true
            });
        }
    });
}


function setUpAccordion() {
    $("#accordion").tabs(
        "#accordion .pane",
        {tabs: "h2, h3",
         effect: "slide"});
    /* Set up a global 'accordion' variable to later steer the animation. */
    accordion = $("#accordion").data("tabs");
    $(".accordion-load-next a").live('click', function (event) {
        var pane, nextPaneId, url, newTitle, ourId;
        event.preventDefault();
        pane = $(this).parents(".accordion-load-next");
        nextPaneId = pane.attr("data-next-pane-id");
        url = $(this).attr("href");
        $(nextPaneId).html('<div class="loading" />');
        $.ajax({
            type: "GET",
            url: url,
            success: function (data) {
                // Update all pane titles and the new pane. Data is the whole
                // (new) html page.
                $(".pane").each(function () {
                    // Title of current pane.
                    newTitle = $(data).find("#" + $(this).attr("id")).prev().html();
                    $(this).prev().html(newTitle);
                    // Refresh target pane contents only.
                    ourId = "#" + $(this).attr("id");
                    if (ourId === nextPaneId) {
                        $(this).html($(data).find(ourId));
                    }
                });
                setUpTooltips();
                setUpTree();
            },
            error: function (e) {
                $(nextPaneId).html('<div class="ss_error ss_sprite" />' +
                                   'Fout bij laden paginaonderdeel.');
            }
        });
        $("li.selected", pane).removeClass("selected");
        $(this).parent("li").addClass("selected");
        accordion.click(accordion.getIndex() + 1);
    });
}


/* Turn all objects with class "popup-trigger" into jquery overlay triggers. */
function setUpOverlays() {
    $(".popup-trigger").each(function () {
        $(this).overlay({
            onLoad: function (event) {
                var first_field;
                first_field = $("input:visible:enabled:first", this.getOverlay()).get(0);
                if (first_field) {
                    first_field.focus();
                }
            }
        });
    });
}

/* Make the "login" button post the login request and react on response */
function setUpLogin() {
    $("#popup-login-form").submit(function () {
        var url, $form;
        $form = $(this);
        url = $form.attr("data-url");
        $.post(
            url,
            $form.serialize(),
            function (data) {
                if (data.success === true) {
                    // Login successful.
                    if ((data.next === "") || (data.next === null)) {
                        window.location.reload();
                    } else {
                        window.location = data.next;
                    }
                } else {
                    // Login unsuccessful.
                    $("#login-form").find(".close").click();
                    $("#wrong-login").overlay({load: true });
                }
            },
            'json');
        return false;  // Prevents propagation to original form submit.
    });
    $("#logout-button").click(function () {
        var url;
        url = $(this).attr("data-url");
        $.post(
            url,
            {},
            function (event) {
                window.location = "/";
                return false;
            }
        );
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


function setUpPortalTabs() {
    var selected_tab;
    selected_tab = $("#portal-tab-selected").attr("data-selected");
    if (selected_tab === undefined) {
        selected_tab = $("#portal-tab-selected-default")
            .attr("data-selected");
    }
    $(selected_tab).addClass("selected");
}


// Initialize Tipsy
function setUpTipsy() {
    $('a[rel=tipsy]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 'w'
    });
    $('a#logo-img').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 'n'
    });
    $('span[rel=tipsy]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's'
    });
    $('#summary-datepicker-a').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's'
    });
    $('[rel=tipsy-south]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's'
    });
}


function restretchExistingElements() {
    fillScreen();
    divideVerticalSpaceEqually();
    stretchOneSidebarBox();
    reloadGraphs();
}


/* Fill the screen (again) when we open the page and when the window is
   resized.
*/
$(window).resize(function () {
    // Don't re-calculate 50 times while resizing, only when finished.
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(
            restretchExistingElements, 300
    );
});

$(document).ready(function () {
    // Do not change the order.
    calculateScrollbarWidth();
    calculateHiddenStuffHeight();
    fillScreen();
    divideVerticalSpaceEqually();
    setUpCollapsibleSidebarBoxes();
    setUpCollapsibleSidebar();
    setUpAccordion();
    setUpTree();
    stretchOneSidebarBox();
    reloadGraphs();
    setUpOverlays();
    setUpLogin();
    setUpPrintButton();
    setUpTipsy();

    //setUpWorkspaceAcceptableButtons();
    // Light up the selected tab, if available.
    setUpPortalTabs();

    // Set up legend.
    setUpTooltips(); // The edit function is on the tooltip.
});
