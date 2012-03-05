setUpPopovers = ->
    # Everything with a matching class gets bootstrap's popover enabled.
    $(".has_popover").popover()
    $(".has_popover_north").popover({placement: 'top'})
    @


setUpMapDimensions = ->
    console.log "setUpMapDimensions"
    contentHeight = $("div#content").height()
    $("#map").height contentHeight
    @

$(document).ready ->
    setUpPopovers()
    setUpMapDimensions()
    @

 
$(window).bind('orientationchange pageshow resize', setUpMapDimensions)