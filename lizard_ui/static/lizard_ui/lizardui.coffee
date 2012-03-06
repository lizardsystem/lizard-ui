setUpPopovers = ->
    $(".has_popover").popover()
    $(".has_popover_north").popover
        placement: 'top'
    @


closeSidebar = ->
    $('.icon-arrow-left')
        .removeClass('icon-arrow-left')
        .addClass('icon-arrow-right')
    $('div#sidebar').animate
        width: 0
        opacity: 0
        ,300
    $('div#content').animate
        left: 0
        ,300
        , -> setUpMapDimensions()
    @


openSidebar = ->
    $('.icon-arrow-right')
        .removeClass('icon-arrow-right')
        .addClass('icon-arrow-left')
    $('div#sidebar').animate
        width: 300
        opacity: 100
        ,300
    $('div#content').animate
        left: 300
        ,300
        , -> setUpMapDimensions()
    @


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