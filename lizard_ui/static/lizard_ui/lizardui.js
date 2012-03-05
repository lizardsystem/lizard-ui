(function() {
  var setUpMapDimensions, setUpPopovers;

  setUpPopovers = function() {
    $(".has_popover").popover();
    $(".has_popover_north").popover({
      placement: 'top'
    });
    return this;
  };

  setUpMapDimensions = function() {
    var contentHeight;
    console.log("setUpMapDimensions");
    contentHeight = $("div#content").height();
    $("#map").height(contentHeight);
    return this;
  };

  $(document).ready(function() {
    setUpPopovers();
    setUpMapDimensions();
    return this;
  });

  $(window).bind('orientationchange pageshow resize', setUpMapDimensions);

}).call(this);
