/* Javascript functions for the lizard user interface */

// jslint configuration.  Don't put spaces before 'jslint' and 'global'.
/*jslint browser: true */
/*global $, OpenLayers, window */

// Globals that we ourselves define.
var hiddenStuffHeight, mainContentHeight, sidebarHeight, mainContentWidth,
    verticalItemHeight, accordion, resizeTimer, cachedScrollbarWidth;


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
        $main_tag.after($(this));
        if (undefined !== callback) {
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
        if (undefined !== callback) {
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
 * Resize the main window to get an image that is better suited for printing.
 * The image will be printed as soon as all graphs have reloaded.
 *
 * BTW, in Google Chrome too frequent calls to window.print() are ignored:
 * stackoverflow.com/questions/5282719/javascript-print-blocked-by-chrome
 */
function printPage() {
    var max_image_width = 850, graphsToReload;
    if ($("#main").width() > max_image_width) {
        $("#main").width(max_image_width);
        graphsToReload = $('a.replace-with-image').length;
        if (graphsToReload > 0) {
            reloadGraphs(max_image_width, function () {
                graphsToReload -= 1;
                if (graphsToReload < 1) {
                    window.print();
                }
            });
        } else {
            // No graphs to reload.
            window.print();
        }
    } else {
        // Already proper size.
        window.print();
    }
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


// Initialize Tipsy
function setUpTipsy() {
    $('a[rel=tipsy]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 'w',
	live: true
    });

    $('[rel=tipsy-south]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's',
	live: true
    });

    $('a#logo-img').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 'n',
	live: true
    });
    $('span[rel=tipsy]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's',
	live: true
    });

    $('#summary-datepicker-a').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 's',
	live: true
    });
    $('[rel=tipsy-southwest]').tipsy({
        delayIn: 200,
        delayOut: 200,
        fade: false,
        gravity: 'sw',
	live: true
    });
}


function setUpSortableTables() {
    $(".sortable-table").each(function () {
        if (!$(this).data("table-initialized")) {
            $(this).data("table-initialized", true);
            $(this).dataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bSort": true,
                "bInfo": false,
                "bAutoWidth": false});
        }
    });
}




$(document).ready(function () {
    // Do not change the order.
    setUpTree();
    reloadGraphs();
    // setUpPrintButton();
    // setUpTipsy();
    setUpSortableTables();
    // Set up legend.
    //setUpTooltips(); // The edit function is on the tooltip.
});

