setUpPopovers = ->
    # Everything with a matching class gets bootstrap's popover enabled.
    $(".has_popover").popover()
    $(".has_popover_north").popover
        placement: 'top'
    @

closeSidebar = ->
    $('.icon-arrow-left')
        .removeClass('icon-arrow-left')
        .addClass('icon-arrow-right')
    $('div#sidebar').width(0)
    $('div#content').css("left", "0px")
    setUpMapDimensions()

openSidebar = ->
    $('.icon-arrow-right')
        .removeClass('icon-arrow-right')
        .addClass('icon-arrow-left')
    $('div#sidebar').width(300)
    $('div#content').css("left", "300px")
    setUpMapDimensions()

setUpMapDimensions = ->
    contentHeight = $("div#content").height()
    contentWidth = $("div#content").width()
    $("#map").height contentHeight
    $("#map").width contentWidth
    @

$(document).ready ->
    window.sidebarState = "opened"
    setUpPopovers()
    setUpMapDimensions()
    
    $('.collapse-sidebar').click (e) ->
        e.preventDefault()
        if window.sidebarState is "opened"
            closeSidebar()
            window.sidebarState = "closed"
        else
            openSidebar()
            window.sidebarState = "opened"
    @

 
$(window).bind('orientationchange pageshow resize', setUpMapDimensions)