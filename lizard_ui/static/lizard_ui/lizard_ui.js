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
        if (re.exec(ua) !== null) {
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
    if (navigator && navigator.userAgent && navigator.userAgent !== null) {
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

// some class aliases for Bootstrap information popovers
var setUpPopovers = function() {
  var animation = false;
  $(".has_popover").popover({animation: animation,
                             trigger: 'hover',
                             html: true});
  $(".has_popover_north").popover({animation: animation,
                                   placement: 'top',
                                   trigger: 'hover',
                                   html: true});
  $(".has_popover_east").popover({animation: animation,
                                   placement: 'right',
                                  trigger: 'hover',
                                  html: true});
  $(".has_popover_south").popover({animation: animation,
                                   placement: 'bottom',
                                   trigger: 'hover',
                                   html: true});
  $(".has_popover_west").popover({animation: animation,
                                   placement: 'left',
                                  trigger: 'hover',
                                  html: true});
};

var defaultAnimationSpeed = 300;

// left bar, containing app icons etc.
var setSidebarAwesomeState = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    if (collapse) {
        // collapsing
        // update arrow icon on button
        $('#collapse-sidebar-awesome i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
        // slide the sidebar
        $('#sidebar-awesome').animate(
            {
                left: -300
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    else {
        // opening
        // update arrow icon on button
        $('#collapse-sidebar-awesome i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
        // slide the sidebar
        $('#sidebar-awesome').animate(
            {
                left: 0
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    // update the state
    $('#sidebar-awesome').data('collapsed', collapse);
};

// right bar, for legend
var setRightbarAwesomeState = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    if (collapse) {
        // collapsing
        $('.collapse-rightbar-awesome i').removeClass('icon-arrow-down').addClass('icon-arrow-up');
        $('#rightbar-awesome').animate(
            {
                bottom: -500
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    else {
        // opening
        $('.collapse-rightbar-awesome i').removeClass('icon-arrow-up').addClass('icon-arrow-down');
        $('#rightbar-awesome').animate(
            {
                bottom: 0
            },
            animationSpeed,
            'swing'
        );
    }
    // update the state
    $('#rightbar-awesome').data('collapsed', collapse);
};

// secondary left bar, for workspace and collage
var setSecondarySidebarState = function(collapse, preventAnim) {
    var top, bottom, element, animationSpeed;
    animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    if (collapse) {
        // collapsing
        bottom = $("#footer").position().top;
        element = $("#secondary-sidebar");
        element.css("overflow-y", "hidden");
        $("#secondary-sidebar").animate(
            {
                top: bottom
            },
            animationSpeed,
            'swing',
            function () {
                element.hide();
            }
        );
        $('.secondary-sidebar-button').removeClass('active');
    }
    else {
        // opening
        top = $("#sidebar").position().top;
        $('.secondary-sidebar-button').addClass('active');
        bottom = $("#footer").position().top;
        element = $("#secondary-sidebar");
        element.css('top', bottom);
        element.show();
        element.animate(
            {
                top: top
            },
            animationSpeed,
            'swing',
            function() {
                element.css('overflow-y', 'auto');
            }
        );
    }
    // update the state
    $('#secondary-sidebar').data('collapsed', collapse);
};


// backwards compatibility
var closeSidebar = function() {
    setSidebarState(true);
};
var openSidebar = function() {
    setSidebarState(false);
};
var closeRightbar = function() {
    setRightbarState(true);
};
var openRightbar = function() {
    setRightbarState(false);
};
var showSecondarySidebar = function() {
    setSecondarySidebarState(false);
};
var hideSecondarySidebar = function() {
    setSecondarySidebarState(true);
};

var setUpMapDimensions = function() {
  // not needed anymore since all sizing is handled in the css
};
window.setUpMapDimensions = setUpMapDimensions;

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

var handleChangeLanguage = function() {
    var language, url;
    language = $('select[name=language]').val();
    url = $('input[name=change-language-url]').val();
    return $.ajax({
        url: url,
        type: "POST",
        data: {
            language: language
        },
        success: function(data) {
            if (data.success) {
                return window.location.reload();
            } else {
                return $('#change-language-error').html(data.error_message).show();
            }
        },
        error: function(data) {
            return $('#change-language-error').html("An error occurred. Please try again later.").show();
        }
    });
};

$(window).bind('orientationchange pageshow resize', setUpMapDimensions);

/**
 * Resize the main window to get an image that is better suited for printing.
 * The image will be printed as soon as all graphs have reloaded.
 *
 * BTW, in Google Chrome too frequent calls to window.print() are ignored:
 * stackoverflow.com/questions/5282719/javascript-print-blocked-by-chrome
 */
function printPage() {
    window.print();
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
                            $(this).html($(data).find(ourId).html());
                            $(this).data("tree-initialized", false);
                        }
                    });
                    setUpTree();
                    setUpPopovers();
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

function setUpAwesomeBars() {
    // set initial states from data attributes, without animating
    if ($('#sidebar-awesome').exists()) {
        setSidebarAwesomeState($('#sidebar-awesome').data('collapsed'), true);
    }
    if ($('#rightbar-awesome').exists()) {
        setRightbarAwesomeState($('#rightbar-awesome').data('collapsed'), true);
    }

    // bind buttons
    $('#collapse-sidebar-awesome').click(function(e) {
        e.preventDefault();
        // keep the ternary operator, so we magically deal with undefined scenarios
        setSidebarAwesomeState($('#sidebar-awesome').data('collapsed') === true ? false : true);
    });
    $('#collapse-rightbar-awesome').click(function(e) {
        e.preventDefault();
        // keep the ternary operator, so we magically deal with undefined scenarios
        setRightbarAwesomeState($('#rightbar-awesome').data('collapsed') === true ? false : true);
    });


    // $('.collapse-rightbar').click(function(e) {
        // e.preventDefault();
        // // keep the ternary operator, so we magically deal with undefined scenarios
        // setRightbarState($('#rightbar').data('collapsed') === true ? false : true);
    // });
    // $('.secondary-sidebar-button').click(function(e) {
        // e.preventDefault();
        // // keep the ternary operator, so we magically deal with undefined scenarios
        // setSecondarySidebarState($('#secondary-sidebar').data('collapsed') === true ? false : true);
    // });
}

$(document).ready(function() {
  setUpAwesomeBars();
  setUpPopovers();
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
  $('.ui-change-language-link').click(function(e) {
    e.preventDefault();
    $('#change-language-modal').modal('toggle');
    if ($('#change-language-modal').is('.in')) {
        $(document).unbind('keyup');
        $(document).bind('keyup', function(event) {
            if ($("*:focus").parents('#change-language-modal').length === 0) {
                return $('#modal-change-language-form-language').focus();
            }
        });
        $('#modal-change-language-form-language').focus();
    }
    return false;
  });
  $('#modal-login-form').submit(function(e) {
    e.preventDefault();
    return handleLogin();
  });
  $('#modal-change-language-form').submit(function(e) {
    e.preventDefault();
    return handleChangeLanguage();
  });
});

$(document).ready(function () {
    // Do not change the order.
    setUpTree();
    setUpSortableTables();
    setUpAccordion();
});
