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
    console = window.console || {};

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
 * Detect mobile browsers. More generic than above.
 */
var isMobileBrowser = false;
(function () {
    var a = navigator.userAgent||navigator.vendor||window.opera;
    isMobileBrowser = (/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)));
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
var toggleSidebarAwesomeState = function(ignored, preventAnim, subpanel) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    var $bar = $('#sidebar-awesome');

    // var $icons = $bar.find('.btn-collapse-bar').find('i');
    // var $icon = null;
    var isCollapsed = $bar.data('collapsed', collapse) === true ? true : false;

    if (subpanel && $bar.data('subpanel') != subpanel) {
        // hide other subpanels
        $bar.find('.subpanel').hide();
        // show selected panel
        $bar.find('.subpanel' + '.' + subpanel).show();
    }

    // if (subpanel) {
        // $icon = $bar.find('.btn-collapse-bar' + '.' + subpanel).find('i');
    // }
    // else {
        // $icon = $bar.find('.btn-collapse-bar').find('i');
    // }
    if ($bar.data('collapsed') != collapse) {
        if (collapse) {
            // collapsing
            // update arrow icon on button
            //$icon.removeClass('icon-arrow-left').addClass('icon-arrow-right');
            // slide the sidebar
            $bar.animate(
                {
                    left: -300 - 4 // deal with 2px border
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
            //$icon.removeClass('icon-arrow-right').addClass('icon-arrow-left');
            // slide the sidebar
            $bar.animate(
                {
                    left: 0
                },
                animationSpeed,
                'swing',
                function () {
                }
            );
        }
    }
    // update the state
    $bar.data('collapsed', collapse);
    $bar.data('subpanel', subpanel);
};

// right bar, for legend
var setSidebarAwesomeState = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    // var $icon = $('#collapse-sidebar-awesome i');
    var $bar = $('#sidebar-awesome');
    if (collapse) {
        // collapsing
        // $icon.removeClass('icon-arrow-left').addClass('icon-arrow-right');
        $bar.animate(
            {
                left: -300 - 4 // deal with 2px border
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    else {
        // opening
        // $icon.removeClass('icon-arrow-right').addClass('icon-arrow-left');
        $bar.animate(
            {
                left: 0
            },
            animationSpeed,
            'swing'
        );
    }
    // update the state
    $bar.data('collapsed', collapse);
};


// right bar, for legend
var setSidebarAwesome2State = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    // var $icon = $('#collapse-sidebar-awesome2 i');
    var $bar = $('#sidebar-awesome2');
    if (collapse) {
        // collapsing
        // $icon.removeClass('icon-arrow-left').addClass('icon-arrow-right');
        $bar.animate(
            {
                left: -300 - 4 // deal with 2px border
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    else {
        // opening
        // $icon.removeClass('icon-arrow-right').addClass('icon-arrow-left');
        $bar.animate(
            {
                left: 0
            },
            animationSpeed,
            'swing'
        );
    }
    // update the state
    $bar.data('collapsed', collapse);
};

// right bar, for legend
var setRightbarAwesomeState = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    // var $icon = $('#collapse-rightbar-awesome i');
    var $bar = $('#rightbar-awesome');
    if (collapse) {
        // collapsing
        // $icon.removeClass('icon-arrow-down').addClass('icon-arrow-up');
        $bar.animate(
            {
                bottom: -500 - 4 // deal with 2px border
            },
            animationSpeed,
            'swing',
            function () {
            }
        );
    }
    else {
        // opening
        // $icon.removeClass('icon-arrow-up').addClass('icon-arrow-down');
        $bar.animate(
            {
                bottom: 0
            },
            animationSpeed,
            'swing'
        );
    }
    // update the state
    $bar.data('collapsed', collapse);
};

// secondary left bar, for workspace and collage
var setSecondarySidebarAwesomeState = function(collapse, preventAnim) {
    var animationSpeed = preventAnim === true ? 0 : defaultAnimationSpeed;
    if (collapse) {
        // collapsing
        // update arrow icon on button
        // $('#collapse-secondary-sidebar-awesome i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
        // slide the sidebar
        $('#secondary-sidebar-awesome').animate(
            {
                left: -300 - 4 // deal with 2px border
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
        // $('#collapse-secondary-sidebar-awesome i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
        // slide the sidebar
        $('#secondary-sidebar-awesome').animate(
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
    $('#secondary-sidebar-awesome').data('collapsed', collapse);
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
            return $('#change-language-error').html(gettext("An error occurred. Please try again later.")).show();
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
                                       gettext('Error on loading page parts.'));
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

var setUpAwesomeBox = function() {
	$("#box-awesome-tabs ul").tabs();
}

$(document).ready(function() {
//  setUpAwesomeBox();
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
