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
    if (typeof map !== 'undefined') {
        map.updateSize();
    }
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
    if (typeof map !== 'undefined') {
        map.updateSize();
    }
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

function setup_appscreen_instant_load() {
    $('.ui-icon-list a').each(function () {
        var href = $(this).attr('href');
        if (href) {
            // ensure icon link is relative and contains '/screen/', so we know it points
            // to another appscreen
            if (href.length > 1 && href[0] == '/' && href.indexOf('/screen/') != -1) {
                $(this).click(function (e) {
                    // ensure click event is cancelled
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    // define an error handler that just does a location.replace, in case
                    // of an error
                    var redirect = function () {
                        window.location.href = href;
                    };
                    // retrieve the page asynchronously
                    $.get(href)
                    .success(function (data) {
                        try {
                            // replace sidebar and crumb elements with the new content
                            var $old_sidebar = $('#sidebar');
                            var $old_breadcrumbs = $('#breadcrumbs');
                            var $data = $(data);
                            $old_sidebar.replaceWith($data.find('#sidebar'));
                            $old_breadcrumbs.replaceWith($data.find('#breadcrumbs'));
                            // hide popovers which might still be active
                            $('div.popover').remove();
                            // initialize any new popovers
                            setUpPopovers();
                        }
                        catch (err) {
                            redirect();
                        }
                    })
                    .error(function () {
                        redirect();
                    });
                });
            }
        }
    });
}

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
    setup_appscreen_instant_load();
});
