(function() {
  var animationSpeed, closeLayersPane, closeSidebar, openLayersPane, openSidebar, setUpMapDimensions, setUpPopovers;

  animationSpeed = 150;

  setUpPopovers = function() {
    $(".has_popover").popover();
    $(".has_popover_north").popover({
      placement: 'top'
    });
    return this;
  };

  closeSidebar = function() {
    $('.icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
    $('div#sidebar').animate({
      left: -300,
      opacity: 0
    }, animationSpeed);
    $('div#content').animate({
      left: 0
    }, animationSpeed, function() {
      return setUpMapDimensions();
    });
    return this;
  };

  openSidebar = function() {
    $('.icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
    $('div#sidebar').animate({
      left: 0,
      opacity: 100
    }, animationSpeed);
    $('div#content').animate({
      left: 300
    }, animationSpeed, function() {
      return setUpMapDimensions();
    });
    return this;
  };

  openLayersPane = function() {
    $("div#sidebar div#layers").animate({
      bottom: 0
    }, animationSpeed);
    return this;
  };

  closeLayersPane = function() {
    $("div#sidebar div#layers").animate({
      bottom: 0 - $("div#sidebar div#layers").height() + 35
    }, animationSpeed);
    return this;
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
    window.layersPaneState = "closed";
    closeLayersPane();
    setUpPopovers();
    setUpMapDimensions();
    $('.btn.None').click(function(e) {
      e.preventDefault();
      if (window.layersPaneState === "closed") {
        openLayersPane();
        return window.layersPaneState = "opened";
      } else {
        closeLayersPane();
        return window.layersPaneState = "closed";
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
    return this;
  });

  $(window).bind('orientationchange pageshow resize', setUpMapDimensions);

}).call(this);
