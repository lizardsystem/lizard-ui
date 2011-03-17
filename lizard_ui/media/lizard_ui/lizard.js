/* Javascript functions for the lizard user interface */

// jslint configuration.  Don't put spaces before 'jslint' and 'global'.
/*jslint browser: true */
/*global $, OpenLayers, window */

// Globals that we ourselves define.
var hiddenStuffHeight, mainContentHeight, sidebarHeight, mainContentWidth,
    verticalItemHeight, accordion, resizeTimer;


function scrollbarWidth() {
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
    return (w1 - w2);
}


function reloadGraphs(max_image_width) {
    $('a.replace-with-image').each(
        function (index) {
            var url, url_click, timestamp, width, height, amp_or_questionmark, 
            html_img, image, $main_tag, html_src, html_url, errormsg;
            $main_tag = $(this);
            width = $(this).parent('.img-use-my-size').innerWidth();
            height = $(this).parent('.img-use-my-size').innerHeight();
            if ($(this).attr('data-errormsg')) {
                errormsg = $(this).attr('data-errormsg');
            } else {
                errormsg = 'An error occurred';
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
            $(this).hide();
            url = $(this).attr('href');
            if (url.indexOf('?') === -1) {
                amp_or_questionmark = '?';
            } else {
                amp_or_questionmark = '&';
            }
            url_click = $(this).attr('data-href-click');
            // Remove a previous image that's already there.
            $('~ img', this).remove();
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
            $(this).after('<div class="auto-inserted"><img src="/static_media/lizard_ui/ajax-loader.gif" class="progress-animation" data-src="' + html_url + '" /></div>');

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
            });
            image.error(function () {
                // After preloading.
                // Remove progress animation and possibly old images.
                $main_tag.parent().find(".auto-inserted").remove();
                $main_tag.after(
                    '<p class="auto-inserted">' +
                        errormsg +
                        '</p>');
            });
        }
    );
}


function printPage() {
    var max_image_width;
    max_image_width = 850;
    // Resize the main window to get a smaller map.
    if ($("#main").width() > max_image_width) {
        $("#main").width(max_image_width);
    }
    // Make images smaller
    reloadGraphs(max_image_width);
    setTimeout(function () {
        window.print();
    }, 500);
}


function calculateHiddenStuffHeight() {
    // Calculate once.  If opened, the height isn't 5 but 208 or so...
    hiddenStuffHeight = $("#ui-datepicker-div").outerHeight(true);
}


function stretchOneSidebarBox() {
    /* Stretch out one sidebarbox so that the sidebar is completely filled. */
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
    accordion = $("#accordion").tabs();
    $(".accordion-load-next a").live('click', function (event) {
        var pane, nextPaneId, url, newTitle;
        event.preventDefault();
        pane = $(this).parents(".accordion-load-next");
        nextPaneId = pane.attr("data-next-pane-id");
        url = $(this).attr("href");
        $(nextPaneId).html('<div class="loading" />');
        $.get(url, {}, function (data) {
            // Update all panes. Data is the whole (new) html page.
            $(".pane").each(function () {
                // Title of current pane.
                newTitle = $(data).find("#" + $(this).attr("id")).prev().html();
                $(this).prev().html(newTitle);
                // Content of current pane.
                $(this).html($(data).find("#" + $(this).attr("id")).html());
            });
            setUpTooltips();
            setUpTree(true);
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

    //setUpWorkspaceAcceptableButtons();
    // Light up the selected tab, if available.
    setUpPortalTabs();

    // Set up legend.
    setUpTooltips(); // The edit function is on the tooltip.
});
