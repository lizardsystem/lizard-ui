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
        //width = width - scrollbarWidth();
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
    $('div.flot-graph').each(function () {
        reloadFlotGraph($(this), max_image_width, callback);
    });
}


function reloadLocalizedGraphs($location, max_image_width) {
    $('a.replace-with-image', $location).each(function () {
        reloadGraph($(this), max_image_width);
    });
    $('div.flot-graph', $location).each(function () {
        reloadFlotGraph($(this), max_image_width);
    });
}


function reloadFlotGraph($graph, max_image_width, callback) {
    var url = $graph.attr('data-flot-graph-data-url');
    if (url !== undefined) {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                flotGraphLoadData($graph, max_image_width, response);
                if (callback !== undefined) {
                    callback();
                }
            },
            timeout: 20000
        });
    }
}


/**
 * Draw the response data to a canvas in DOM element $graph using Flot.
 *
 * @param {$graph} DOM element which will be replaced by the graph
 * @param {response} a dictionary containing graph data such as x/y values and labels
 */
function flotGraphLoadData($graph, max_image_width, response) {
    var plot;
    var data = response.data;
    
    var options = {
        series: {
            points: { show: true, hoverable: true }
        },
        // disabled, flot seems to be able to determine these
        //yaxis: {
        //    min: response.y_min,
        //    max: response.y_max
        //},
        yaxis: {
            axisLabel: response.y_label, // plugin jquery.flot.axislabels.js
            axisLabelUseCanvas: true,
            axisLabelFontFamily: 'Verdana,Arial,sans-serif',
            axisLabelFontSizePixels: 12
        },
        xaxis: {
            mode: "time",
            tickSize: [2, "day"],
            axisLabel: response.x_label, // plugin jquery.flot.axislabels.js
            axisLabelUseCanvas: true,
            axisLabelFontFamily: 'Verdana,Arial,sans-serif',
            axisLabelFontSizePixels: 12
        },
        selection: { mode: "x" },
        grid: { hoverable: true }
    };

    $graph.bind("plotselected", function (event, ranges) {
        //$("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));
        var zoom = true;
        if (zoom) {
            var x_min_zoom, x_max_zoom, tick_size, diff_time, diff_seconds;
            x_min_zoom = ranges.xaxis.from;
            x_max_zoom = ranges.xaxis.to; 
            tick_size = [];
            diff_time = x_max_zoom - x_min_zoom;
            diff_seconds = diff_time/1000;
            diff_minutes = diff_time/1000/60;
            diff_hours = diff_time/1000/60/60;
            //TODO get min time stap from timeseries
            if (diff_hours > 24*30) {
                $.merge(tick_size, [1, "month"]); 
            } else if (diff_hours > 24) {
                $.merge(tick_size, [1, "day"]); 
            } else if (diff_hours > 1) {
                $.merge(tick_size, [1, "hour"]);
            } else if (diff_minutes > 45) {
                $.merge(tick_size, [15, "minute"]);
            } else if (diff_minutes > 10) {
                $.merge(tick_size, [10, "minute"]);
            } else if (diff_minutes > 5) {
                $.merge(tick_size, [5, "minute"]);
            } else if (diff_minutes > 1) {
                $.merge(tick_size, [1, "minute"]);
            } else if (diff_seconds > 45 ) {
                $.merge(tick_size, [15, "second"]);
            } else if (diff_seconds > 10) {
                $.merge(tick_size, [10, "second"]);
            } else {
                $.merge(tick_size, [1, "second"]);
            }
            plot = $.plot(
                $graph,
                data,
                $.extend(true, {}, options, {
                    xaxis: {
                        min: ranges.xaxis.from,
                        max: ranges.xaxis.to,
                        tickSize: tick_size
                    }
                })
            );
        }
    });

    //$graph.bind("plotunselected", function (event) {
    //    $("#selection").text("");
    //});

    function showChartTooltip(x, y, contents) {
        $('<div id="charttooltip">'+ contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 25,
            left: x + 5,
            border: '1px solid #bfbfbf',
            padding: '2px',
            'background-color': '#ffffff',
            opacity: 1,
            'z-index':11000
        }).appendTo("body").fadeIn(200);
    }

    $graph.bind("plothover", function (event, pos, item) {
        //$("#x").text(pos.x.toFixed(2));
        //$("#y").text(pos.y.toFixed(2));
        if (item) {
            $("#charttooltip").remove();
            var x = item.datapoint[0].toFixed(2),
                y = item.datapoint[1].toFixed(2);
            showChartTooltip(item.pageX, item.pageY, item.datapoint[1]);
        } else {
            $("#charttooltip").remove();
        }
    });

    plot = $.plot($graph, data, options);

    //$("#clearSelection").click(function () {
    //    plot.clearSelection();
    //});

    //$("#setSelection").click(function () {
    //    plot.setSelection({ xaxis: { from: x_min, to: x_max } });
    //});

    $(".flot-graph-reload").click(function () {
        plot = $.plot($graph, data, options);
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
                //setUpTooltips();
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


$(document).ready(function () {
    // Do not change the order.
    setUpTree();
    reloadGraphs();
    // setUpPrintButton();
    // setUpTipsy();
    setUpSortableTables();
    // Set up legend.
    //setUpTooltips(); // The edit function is on the tooltip.
    setUpAccordion();
});
