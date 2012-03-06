animationSpeed = 150

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
        left: -300
        opacity: 0
        ,animationSpeed
    $('div#content').animate
        left: 0
        ,animationSpeed
        , -> setUpMapDimensions()
    @


openSidebar = ->
    $('.icon-arrow-right')
        .removeClass('icon-arrow-right')
        .addClass('icon-arrow-left')
    $('div#sidebar').animate
        left: 0
        opacity: 100
        ,animationSpeed
    $('div#content').animate
        left: 300
        ,animationSpeed
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