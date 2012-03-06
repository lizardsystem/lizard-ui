(function() {
  var closeSidebar, openSidebar, setUpMapDimensions, setUpPopovers;

  setUpPopovers = function() {
    $(".has_popover").popover();
    $(".has_popover_north").popover({
      placement: 'top'
    });
    return this;
  };

  closeSidebar = function() {
    $('.icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
    $('div#sidebar').width(0);
    $('div#content').css("left", "0px");
    return setUpMapDimensions();
  };

  openSidebar = function() {
    $('.icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
    $('div#sidebar').width(300);
    $('div#content').css("left", "300px");
    return setUpMapDimensions();
  };

  setUpMapDimensions = function() {
    var contentHeight, contentWidth;
    contentHeight = $("div#content").height();
    contentWidth = $("div#content").width();
    $("#map").height(contentHeight);
    $("#map").width(contentWidth);
    return this;
  };

  $(document).ready(function() {
    window.sidebarState = "opened";
    setUpPopovers();
    setUpMapDimensions();
    $('.collapse-sidebar').click(function(e) {
      e.preventDefault();
      if (window.sidebarState === "opened") {
        closeSidebar();
        return window.sidebarState = "closed";
      } else {
        openSidebar();
        return window.sidebarState = "opened";
      }
    });
    return this;
  });

  $(window).bind('orientationchange pageshow resize', setUpMapDimensions);

}).call(this);
