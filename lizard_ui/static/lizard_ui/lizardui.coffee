animationSpeed = 300


setUpPopovers = ->
    $(".has_popover").popover()
    $(".has_popover_north").popover
        placement: 'top'
    @


closeSidebar = ->
    if window.secondarySidebarState is "opened"
        # First close the secondary one.
        hideSecondarySidebar()
    $('.icon-arrow-left')
        .removeClass('icon-arrow-left')
        .addClass('icon-arrow-right')
    $('.secondary-sidebar-button').attr('disabled', '')
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
    $('.secondary-sidebar-button').removeAttr('disabled')
    @


showSecondarySidebar = ->
    top = $("#sidebar").position().top
    $('.secondary-sidebar-button').button('toggle')
    bottom = $("#footer").position().top
    element = $("#secondary-sidebar")
    element.css('top', bottom)
    element.show()
    element.animate
        top: top
        ,animationSpeed
    element.css('overflow-y', 'auto')
    @


hideSecondarySidebar = ->
    bottom = $("#footer").position().top
    element = $("#secondary-sidebar")
    element.css("overflow-y", "hidden")
    $("#secondary-sidebar").animate
        top: bottom
        ,animationSpeed
    $('.secondary-sidebar-button').button('toggle')
    @


setUpMapDimensions = ->
    contentHeight = $("div#content").height()
    contentWidth = $("div#content").width()
    $("#map").height contentHeight
    $("#map").width contentWidth
    # And also adjust the secondary sidebar top.
    if window.secondarySidebarState is "closed"
        bottom = $("#footer").position().top
        element = $("#secondary-sidebar")
        element.css('top', bottom)
        element.show()  # Initially it is invisible.
    @

handleLogin = ->
    username = $('input[name=username]').val()
    password = $('input[name=password]').val()
    url = $('input[name=login-url]').val()

    $.ajax(
        url: url
        type: "POST"
        data:
            username: username
            password: password
        success: (data) ->
            if data.success
                window.location.reload()
            else
                $('#login-error').html(data.error_message).show()
    )


$(document).ready ->
    window.sidebarState = "opened"
    window.secondarySidebarState = "closed"

    setUpPopovers()
    setUpMapDimensions()
    window.setUpMapDimensions = setUpMapDimensions

    $('.secondary-sidebar-button').click (e) ->
        e.preventDefault()
        if window.secondarySidebarState is "closed"
            showSecondarySidebar()
            window.secondarySidebarState = "opened"
        else
            hideSecondarySidebar()
            window.secondarySidebarState = "closed"

    $('.btn.collapse-sidebar').click (e) ->
        e.preventDefault()
        if window.sidebarState is "opened"
            closeSidebar()
            window.sidebarState = "closed"
        else
            openSidebar()
            window.sidebarState = "opened"

    $('.ui-login-link').click (e) ->
        e.preventDefault()
        $('#login-modal').modal('toggle');

    $('#modal-login-form').click ->
        handleLogin()
    @


$(window).bind('orientationchange pageshow resize', setUpMapDimensions)
