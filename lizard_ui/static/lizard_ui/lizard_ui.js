/* Javascript functions for the lizard user interface */

// jslint configuration.  Don't put spaces before 'jslint' and 'global'.
/*jslint browser: true */

/**
 * Avoid `console` errors in browsers that lack a console.
 */
(function() {
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }
}());

/**
 * Detect IE version, so we can make some exceptions,
 * due to this browsers general crappiness.
 */
var isIE = false;
var ieVersion = 0;
var determine_ie_version = function () {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        isIE = true;
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat(RegExp.$1);
            ieVersion = rv;
        }
    }
};
determine_ie_version();

/**
 * Check if selector returns any elements.
 *
 * Usage: $('#notAnElement').exists();
 */
jQuery.fn.exists = function () {
    return this.length !== 0;
};

// jQuery Deparam - v0.1.0 - 6/14/2011
// http://benalman.com/
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL
(function($){var a,b=decodeURIComponent,c=$.deparam=function(a,d){var e={};$.each(a.replace(/\+/g," ").split("&"),function(a,f){var g=f.split("="),h=b(g[0]);if(!!h){var i=b(g[1]||""),j=h.split("]["),k=j.length-1,l=0,m=e;j[0].indexOf("[")>=0&&/\]$/.test(j[k])?(j[k]=j[k].replace(/\]$/,""),j=j.shift().split("[").concat(j),k++):k=0,$.isFunction(d)?i=d(h,i):d&&(i=c.reviver(h,i));if(k)for(;l<=k;l++)h=j[l]!==""?j[l]:m.length,l<k?m=m[h]=m[h]||(isNaN(j[l+1])?{}:[]):m[h]=i;else $.isArray(e[h])?e[h].push(i):h in e?e[h]=[e[h],i]:e[h]=i}});return e};c.reviver=function(b,c){var d={"true":!0,"false":!1,"null":null,"undefined":a};return+c+""===c?+c:c in d?d[c]:c}})(jQuery);

// Fix Date.parse for Firefox, IE8, et cetera.
/** https://github.com/csnover/js-iso8601 */
/**
* Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
* © 2011 Colin Snover <http://zetafleet.com>
* Released under MIT license.
*/
(function (Date, undefined) {
    var origParse = Date.parse, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];
    Date.parseISO8601 = function (date) {
        var timestamp, struct, minutesOffset = 0;

        // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
        // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
        // implementations could be faster
        // 1 YYYY 2 MM 3 DD 4 HH 5 mm 6 ss 7 msec 8 Z 9 ± 10 tzHH 11 tzmm
        if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
            // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
            for (var i = 0, k; (k = numericKeys[i]); ++i) {
                struct[k] = +struct[k] || 0;
            }

            // allow undefined days and months
            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;

            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
        }
        else {
            timestamp = origParse ? origParse(date) : NaN;
        }

        return new Date(timestamp);
    };
}(Date));

// some class aliases for Bootstrap information popovers
var setUpPopovers = function() {
  var animation = false;
  $(".has_popover").popover({animation: animation});
  $(".has_popover_north").popover({placement: 'top', animation: animation});
  $(".has_popover_east").popover({placement: 'right', animation: animation});
  $(".has_popover_south").popover({placement: 'bottom', animation: animation});
  $(".has_popover_west").popover({placement: 'left', animation: animation});
};

var animationSpeed = 300;

// left bar, containing icons etc.
var closeSidebar = function() {
  if (window.secondarySidebarState === "opened") {
    hideSecondarySidebar();
    window.secondarySidebarState = "closed";
  }
  $('#sidebar-actions .icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
  $('.secondary-sidebar-button').attr('disabled', '');
  $('div#sidebar').animate({
    left: -300
  }, animationSpeed);
  $('div#content').animate({
    left: 0
  }, animationSpeed, function() {
    return setUpMapDimensions();
  });
  return this;
};

// left bar, containing icons
var openSidebar = function() {
  $('#sidebar-actions .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
  $('div#sidebar').animate({
    left: 0
  }, animationSpeed);
  $('div#content').animate({
    left: 300
  }, animationSpeed, function() {
    return setUpMapDimensions();
  });
  $('.secondary-sidebar-button').removeAttr('disabled');
  return this;
};

// right bar, containing legend
var closeRightbar = function() {
  if (window.secondaryRightbarState === "opened") hideSecondaryRightbar();
  $('#rightbar-actions .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
  $('div#rightbar').animate({
    right: -251
  }, animationSpeed);
  $('div#content').animate({
    right: 0
  }, animationSpeed, function() {
    return setUpMapDimensions();
  });
  return this;
};

// right bar, containing legend
var openRightbar = function() {
  $('#rightbar-actions .icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
  $('div#rightbar').show();
  $('div#rightbar').animate({
    right: 0
  }, animationSpeed);
  $('div#content').animate({
    right: 251
  }, animationSpeed, function() {
    return setUpMapDimensions();
  });
  return this;
};

// secondary left bar, for workspace and collage 
var showSecondarySidebar = function() {
  var bottom, element, top;
  top = $("#sidebar").position().top;
  $('.secondary-sidebar-button').button('toggle');
  bottom = $("#footer").position().top;
  element = $("#secondary-sidebar");
  element.css('top', bottom);
  element.show();
  element.animate({
    top: top
  }, animationSpeed);
  element.css('overflow-y', 'auto');
  return this;
};

// secondary left bar, for workspace and collage 
var hideSecondarySidebar = function() {
  var bottom, element;
  bottom = $("#footer").position().top;
  element = $("#secondary-sidebar");
  element.css("overflow-y", "hidden");
  $("#secondary-sidebar").animate({
    top: bottom
  }, animationSpeed);
  $('.secondary-sidebar-button').button('toggle');
  return this;
};

var setUpMapDimensions = function() {
  // not needed anymore since all sizing is handled in the css
};

var handleLogin = function() {
  var password, url, username;
  username = $('input[name=username]').val();
  password = $('input[name=password]').val();
  url = $('input[name=login-url]').val();
  return $.ajax({
    url: url,
    type: "POST",
    data: {
      username: username,
      password: password
    },
    success: function(data) {
      if (data.success) {
        return window.location.reload();
      } else {
        return $('#login-error').html(data.error_message).show();
      }
    }
  });
};

$(window).bind('orientationchange pageshow resize', setUpMapDimensions);


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
    // Old matplotlib graphs, probably needs some work
    $('a.replace-with-image').each(function () {
        reloadGraph($(this), max_image_width, callback);
    });
    // New Flot graphs
    $('div.flot-graph').each(function () {
        reloadFlotGraph($(this), callback);
    });
}


function fixIE8DrawBug(plot) {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat(RegExp.$1);
            if (rv == 8) {
                setTimeout(function () {
                    plot.resize();
                    plot.setupGrid();
                    plot.draw();
                }, 100);
            }
        }
    }
}

function reloadFlotGraph($graph, callback) {
    // check if graph is already loaded
    if ($graph.attr('data-graph-loaded')) return;

    var url = $graph.attr('data-flot-graph-data-url');
    // HACK: viewstate is currently only in lizard_map,
    // but graphs are here, in lizard_ui
    var view_state = get_view_state();
    if (view_state !== undefined) {
        if (view_state.start && view_state.end) {
            url += '&' + $.param({
                dt_start: view_state.start.toJSON(),
                dt_end: view_state.end.toJSON()
            });
        }
    }
    if (url !== undefined) {
        var $loading = $('<img src="/static_media/lizard_ui/ajax-loader.gif" class="flot-loading-animation" />');
        $graph.append($loading);
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                var plot = flotGraphLoadData($graph, response);
                $graph.attr('data-graph-loaded', 'true');
                // fix for IE8...; IE7 is fine
                if (plot) {
                    fixIE8DrawBug(plot);
                }
                if (callback !== undefined) {
                    callback();
                }
            },
            timeout: 20000,
            error: function () {
                $graph.html('Fout bij het laden van de gegevens.');
            },
            complete: function () {
                $loading.remove();
            }
        });
    }
}


var MS_SECOND = 1000;
var MS_MINUTE = 60 * MS_SECOND;
var MS_HOUR = 60 * MS_MINUTE;
var MS_DAY = 24 * MS_HOUR;
var MS_MONTH = 30 * MS_DAY;
var MS_YEAR = 365 * MS_DAY;

function flotFixHeight(placeholder) {
    placeholder.css('width', '100%');
    var placeholderParent = placeholder.parent();
    var height = 0;
    placeholderParent.siblings().each(function() {
        height -= $(this).outerHeight();
    });
    height -= parseInt(placeholderParent.css('padding-top'), 10);
    height -= parseInt(placeholderParent.css('padding-bottom'), 10);
    height += window.innerHeight;
    placeholder.css('height', (height <= 0) ? 100 : height + 'px');
}

/**
 * Draw the response data to a canvas in DOM element $graph using Flot.
 *
 * @param {$graph} DOM element which will be replaced by the graph
 * @param {response} a dictionary containing graph data such as x/y values and labels
 */
function flotGraphLoadData($container, response) {
    var data = response.data;
    if (data.length === 0) {
        $container.html('Geen gegevens beschikbaar.');
        return;
    }
    var defaultOpts = {
        series: {
            points: { show: true, hoverable: true }
        },
        yaxis: {
            axisLabel: response.y_label, // plugin jquery.flot.axislabels.js
            axisLabelTryRotate: true, // note: IE is notoriously bad in handling vertical text
            axisLabelFontFamily: 'Verdana,Arial,sans-serif',
            axisLabelFontSizePixels: 11,
            zoomRange: [false, false]
        },
        xaxis: {
            mode: "time",
            axisLabel: response.x_label, // plugin jquery.flot.axislabels.js
            axisLabelTryRotate: true,
            axisLabelFontFamily: 'Verdana,Arial,sans-serif',
            axisLabelFontSizePixels: 11,
            zoomRange: [1 * MS_MINUTE, 400 * MS_YEAR]
        },
        grid: { hoverable: true, labelMargin: 15 },
        pan: { interactive: true },
        zoom: { interactive: true }
        // touch: { pan: 'xy', scale: 'x', autoWidth: false, autoHeight: false }
    };

    // set up elements nested in our assigned parent div
    $container.css('position', 'relative');
    // first row
    var $graph_row = $('<div class="flot-graph-row" />')
                  .css({
                        position: 'absolute',
                        left: 0, top: 0, bottom: 42, right: 0
                  });
    // just a spacer for now, have jquery.flot.axislabels.js draw the actual label
    var $y_label = $('<span class="flot-graph-y-label" />')
                  .css({
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0, width: 12
                  });
    $graph_row.append($y_label);
    var $graph = $('<span class="flot-graph-canvas" />')
                  .css({
                        position: 'absolute',
                        left: 12, top: 0, bottom: 0, right: 0
                  });
    $graph_row.append($graph);
    $container.append($graph_row);

    // second row
    // just a spacer for now, have jquery.flot.axislabels.js draw the actual label
    var $x_label = $('<div class="flot-graph-x-label" />')
                    .css({
                        position: 'absolute',
                        left: 0, bottom: 30, right: 0,
                        height: 12
                    });
    $container.append($x_label);

    // third row
    var $control_row = $('<div class="flot-graph-control-row" />')
                       .css({
                           position: 'absolute',
                           left: 0, bottom: 0, right: 0,
                           height: 30
                       });
    // controls
    // TODO should implement JavaScript gettext / i18n
    var $c_reset = $('<button title="Reset zoom" class="btn" type="button"><i class="icon-refresh"></i></button>');
    $control_row.append($c_reset);

    var $c_plus = $('<button title="Zoom in" class="btn" type="button"><i class="icon-zoom-in"></i></button>');
    $control_row.append($c_plus);

    var $c_min = $('<button title="Zoom uit" class="btn" type="button"><i class="icon-zoom-out"></i></button>');
    $control_row.append($c_min);

    var $c_bwd = $('<button title="Schuif naar links" class="btn" type="button"><i class="icon-backward"></i></button>');
    $control_row.append($c_bwd);

    var $c_fwd = $('<button title="Schuif naar rechts" class="btn" type="button"><i class="icon-forward"></i></button>');
    $control_row.append($c_fwd);

    $container.append($control_row);

    // initial plot
    var plot = $.plot($graph, data, defaultOpts);

    // var redraw = function () {
        // plot.setupGrid();
        // plot.draw();
    // };

    // $graph.bind("plotselected", function (event, ranges) {
        // var x_min = ranges.xaxis.from;
        // var x_max = ranges.xaxis.to;
        // var opts = plot.getOptions();
        // var axis = opts.xaxes[0];
        // axis.min = x_min;
        // axis.max = x_max;
        // redraw();
    // });

    //$graph.bind("plotunselected", function (event) {
    //    $("#selection").text("");
    //});

    function showChartTooltip(x, y, contents) {
        $('<div id="charttooltip">'+ contents + '</div>').css({
            'position': 'absolute',
            'top': y - 25,
            'left': x + 5,
            'padding': '0.4em 0.6em',
            'border-radius': '0.5em',
            'border': '1px solid #111',
            'background-color': '#fff',
            'z-index': 11000
        }).appendTo("body");
    }

    $graph.bind("plothover", function (event, pos, item) {
        //$("#x").text(pos.x.toFixed(2));
        //$("#y").text(pos.y.toFixed(2));
        if (item) {
            $("#charttooltip").remove();
            //var x = item.datapoint[0].toFixed(2);
            //var y = item.datapoint[1].toFixed(2);
            showChartTooltip(item.pageX, item.pageY, item.datapoint[1]);
        } else {
            $("#charttooltip").remove();
        }
    });

    // add axis labels
    // var $x_label = $('<div/>').html(response.x_label);
    // $x_label.insertAfter($graph);
    // var $y_label = $('<div/>').html(response.y_label);
    // $y_label.insertBefore($graph);

    //$("#clearSelection").click(function () {
    //    plot.clearSelection();
    //});

    //$("#setSelection").click(function () {
    //    plot.setSelection({ xaxis: { from: x_min, to: x_max } });
    //});

    $c_reset.click(function () {
        $.each(plot.getXAxes(), function (idx, axis) {
            axis.options.min = null;
            axis.options.max = null;
        });
        $.each(plot.getYAxes(), function (idx, axis) {
            axis.options.min = null;
            axis.options.max = null;
        });
        plot.setupGrid();
        plot.draw();
    });
    $c_plus.click(function () {
        plot.zoom({ amount: 2 });
    });
    $c_min.click(function () {
        plot.zoom({ amount: 0.5 });
    });
    $c_bwd.click(function () {
        plot.pan({ left: -500 });
    });
    $c_fwd.click(function () {
        plot.pan({ left: 500 });
    });

    return plot;
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
        if (accordion) {
            accordion.click(accordion.getIndex() + 1);
        }
    });
}

$(document).ready(function() {
  window.sidebarState = "opened";
  window.secondarySidebarState = "closed";
  window.rightbarState = "closed";
  setUpPopovers();
  setUpMapDimensions();
  window.setUpMapDimensions = setUpMapDimensions;
  $('.secondary-sidebar-button').click(function(e) {
    e.preventDefault();
    if (window.secondarySidebarState === "closed") {
      showSecondarySidebar();
      return window.secondarySidebarState = "opened";
    } else {
      hideSecondarySidebar();
      return window.secondarySidebarState = "closed";
    }
  });
  $('.btn.collapse-sidebar').click(function(e) {
    e.preventDefault();
    if (window.sidebarState === "opened") {
      closeSidebar();
      return window.sidebarState = "closed";
    } else {
      openSidebar();
      return window.sidebarState = "opened";
    }
  });
  $('.btn.collapse-rightbar').click(function(e) {
    e.preventDefault();
    if (window.rightbarState === "opened") {
      closeRightbar();
      return window.rightbarState = "closed";
    } else {
      openRightbar();
      return window.rightbarState = "opened";
    }
  });
  $('.ui-login-link').click(function(e) {
    e.preventDefault();
    $('#login-modal').modal('toggle');
    if ($('#login-modal').is('.in')) {
      $(document).unbind('keyup');
      $(document).bind('keyup', function(event) {
        if ($("*:focus").parents('#login-modal').length === 0) {
          return $('#modal-login-form-username').focus();
        }
      });
      $('#modal-login-form-username').focus();
    }
    return false;
  });
  return $('#modal-login-form').submit(function(e) {
    e.preventDefault();
    return handleLogin();
  });
});


$(document).ready(function () {
    // fix div heights for IE7
    // we don't support IE7 though
    if (isIE && ieVersion == 7) {
        $('#content').height('100%');
        $('#sidebar').height('100%');
        $('#secondary-sidebar').height('100%');
        $('#rightbar').height('100%');
    }

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
