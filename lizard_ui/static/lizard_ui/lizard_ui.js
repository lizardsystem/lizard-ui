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
(function () {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        isIE = true;
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat(RegExp.$1);
            ieVersion = rv;
        }
    }
}());

/**
 * Detect Apple appliances.
 */
var isAppleMobile = false;
(function () {
    if (navigator && navigator.userAgent && navigator.userAgent != null) {
        var strUserAgent = navigator.userAgent.toLowerCase();
        var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
        if (arrMatches)
            isAppleMobile = true;
    }
}());

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
    if (map) map.updateSize();
    return setUpMapDimensions();
  });
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
    if (map) map.updateSize();
    return setUpMapDimensions();
  });
  $('.secondary-sidebar-button').removeAttr('disabled');
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

/**
 * Resize the graphs to the given maximum width and reload them.
 *
 * @param {number} max_image_width maximum width to resize each graph to
 * @param {function} callback function to call when a graph has been reloaded
 */
function reloadGraphs(max_image_width, callback, force) {
    // New Flot graphs
    $('.dynamic-graph').each(function () {
        reloadDynamicGraph($(this), callback, force);
    });
}

function reloadDynamicGraph($graph, callback, force) {
    // check if graph is already loaded
    if (force !== true && $graph.attr('data-graph-loaded')) return;

    // the wonders of asynchronous programming
    if ($graph.attr('data-graph-loading')) return;

    // check if element is visible (again):
    // flot can't draw on an invisible surface
    if ($graph.is(':hidden')) return;

    // determine whether to use flot or the image graph
    var flot_graph_data_url = $graph.attr('data-flot-graph-data-url');
    var image_graph_url = $graph.attr('data-image-graph-url');
    var graph_type;
    if (isIE && ieVersion < 9) {
        graph_type = 'image';
    }
    else {
        graph_type = (flot_graph_data_url) ? 'flot' : 'image';
    }
    var url = (graph_type == 'flot') ? flot_graph_data_url : image_graph_url;

    // add currently selected date range to url
    // HACK: viewstate is currently only in lizard_map,
    // but graphs are here, in lizard_ui, for some reason
    var view_state = get_view_state();
    view_state = to_date_strings(view_state);
    if (view_state !== undefined) {
        if (view_state.dt_start && view_state.dt_end) {
            url += '&' + $.param({
                dt_start: view_state.dt_start,
                dt_end: view_state.dt_end
            });
        }
    }

    if (url) {
        // add a spinner
        var $loading = $('<img src="/static_media/lizard_ui/ajax-loader.gif" class="graph-loading-animation" />');
        $graph.empty().append($loading);
        $graph.attr('data-graph-loading', 'true');

        // remove spinner when loading has finished (either with or without an error)
        var on_loaded = function () {
            $graph.removeAttr('data-graph-loading');
            $loading.remove();
        };

        // set attribute and call callback when drawing has finished
        var on_drawn = function () {
            $graph.attr('data-graph-loaded', 'true');
            if (callback !== undefined) {
                callback();
            }
        };

        // show a message when loading has failed
        var on_error = function () {
            on_loaded();
            $graph.html('Fout bij het laden van de gegevens.');
        };

        // for flot graphs, grab the JSON data and call Flot
        if (graph_type == 'flot') {
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (response) {
                    on_loaded();

                    // tab might have been hidden in the meantime
                    // so check if element is visible again:
                    // we can't draw on an invisible surface
                    if ($graph.is(':hidden')) return;

                    var plot = flotGraphLoadData($graph, response);
                    on_drawn();
                },
                timeout: 20000,
                error: on_error
            });
        }
        // for static image graphs, just load the image as <img> element
        else if (graph_type == 'image') {
            var get_url_with_size = function () {
                // add available width and height to url
                var url_with_size = url + '&' + $.param({
                    width: $graph.width(),
                    height: $graph.height()
                });
                return url_with_size;
            };

            var update_size = function () {
                var $img = $(this);
                $img.data('current-loaded-width', $img.width());
                $img.data('current-loaded-height', $img.height());
            };

            var on_load_once = function () {
                on_loaded();

                // tab might have been hidden in the meantime
                // so check if element is visible again:
                // we can't draw on an invisible surface
                if ($graph.is(':hidden')) return;

                $graph.append($(this));
                on_drawn();
            };

            var $img = $('<img/>')
                .one('load', on_load_once) // ensure this is only called once
                .load(update_size)
                .error(on_error)
                .attr('src', get_url_with_size());

            var update_src = function () {
                if ($img.data('current-loaded-width') != $img.width() || $img.data('current-loaded-height') != $img.height()) {
                    $img.attr('src', get_url_with_size());
                }
            };

            var timeout = null;
            $graph.resize(function () {
                if (timeout) {
                    // clear old timeout first
                    clearTimeout(timeout);
                }
                timeout = setTimeout(update_src, 1500);
            });
        }
    }
}

var MS_SECOND = 1000;
var MS_MINUTE = 60 * MS_SECOND;
var MS_HOUR = 60 * MS_MINUTE;
var MS_DAY = 24 * MS_HOUR;
var MS_MONTH = 30 * MS_DAY;
var MS_YEAR = 365 * MS_DAY;

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
            points: { show: true, hoverable: true, radius: 1 },
            shadowSize: 0
        },
        yaxis: {
            zoomRange: [false, false]
        },
        xaxis: {
            mode: "time",
            zoomRange: [1 * MS_MINUTE, 400 * MS_YEAR]
        },
        grid: { hoverable: true, labelMargin: 15 },
        pan: { interactive: true },
        zoom: { interactive: true }
    };
    if (isAppleMobile) {
        // enable touch
        defaultOpts.touch = { pan: 'xy', scale: 'x', autoWidth: false, autoHeight: false };
        // disable flot.navigate pan & zoom
        defaultOpts.pan.interactive = false;
        defaultOpts.zoom.interactive = false;
    }

    // set up elements nested in our assigned parent div
    $container.css('position', 'relative');
    // first row
    var $graph_row = $('<div class="flot-graph-row" />')
        .css({
            position: 'absolute',
            left: 0, top: 0, bottom: 48, right: 0
        });
    var $y_label_text_wrapper = $('<div/>')
        .css({
            position: 'absolute',
            bottom: 25,
            width: 20
        });
    var $y_label_text = $('<div class="flot-graph-y-label-text" />')
        .css({
            'white-space': 'nowrap',
            'background-color': '#fff'
        })
        .transform({rotate: '-90deg'})
        .html(response.y_label);
    $y_label_text_wrapper.append($y_label_text);
    var $y_label = $('<span class="flot-graph-y-label" />')
        .css({
            position: 'absolute',
            left: 0, top: 0, bottom: 0, width: 20
        });
    $y_label.append($y_label_text_wrapper);
    $graph_row.append($y_label);
    var $graph = $('<span class="flot-graph-canvas" />')
        .css({
            position: 'absolute',
            left: 20, top: 0, bottom: 0, right: 0
        });
    $graph_row.append($graph);
    $container.append($graph_row);

    // second row
    // just a spacer for now, have jquery.flot.axislabels.js draw the actual label
    var $x_label = $('<div class="flot-graph-x-label" />')
        .css({
            position: 'absolute',
            left: 60, bottom: 30, right: 0,
            height: 18
        })
        .html(response.x_label);
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

    if (!isAppleMobile) {
        function showChartTooltip(x, y, datapoint) {
            var formatted = moment.utc(datapoint[0]).format('LL h:mm');
            $('<div id="charttooltip">' + formatted + ': '+ datapoint[1] + '</div>').css({
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
            if (item) {
                $("#charttooltip").remove();
                showChartTooltip(item.pageX, item.pageY, item.datapoint);
            } else {
                $("#charttooltip").remove();
            }
        });
    }

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

var accordion;

function setUpAccordion() {
    if ($("#accordion").exists()) {
        $("#accordion").tabs("#accordion .pane", { tabs: "h2, h3", effect: "slide"});
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
}

$(document).ready(function() {
  window.sidebarState = "opened";
  window.secondarySidebarState = "closed";
  window.rightbarState = "closed";
  setUpPopovers();
  setUpMapDimensions();
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
    setUpSortableTables();
    setUpAccordion();
});
