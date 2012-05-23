(function() {
  var animationSpeed, closeRightbar, closeSidebar, handleLogin, hideSecondarySidebar, openRightbar, openSidebar, setUpMapDimensions, setUpPopovers, showSecondarySidebar;
  animationSpeed = 300;
  setUpPopovers = function() {
    $(".has_popover").popover();
    $(".has_popover_north").popover({
      placement: 'top'
    });
    $(".has_popover_south").popover({
      placement: 'bottom'
    });
    return this;
  };
  closeSidebar = function() {
    if (window.secondarySidebarState === "opened") {
      hideSecondarySidebar();
    }
    $('#sidebar-actions .icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
    $('.secondary-sidebar-button').attr('disabled', '');
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
    $('#sidebar-actions .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
    $('div#sidebar').animate({
      left: 0,
      opacity: 100
    }, animationSpeed);
    $('div#content').animate({
      left: 300
    }, animationSpeed, function() {
      return setUpMapDimensions();
    });
    $('.secondary-sidebar-button').removeAttr('disabled');
    return this;
  };
  closeRightbar = function() {
    if (window.secondaryRightbarState === "opened") {
      hideSecondaryRightbar();
    }
    $('#rightbar-actions .icon-arrow-right').removeClass('icon-arrow-right').addClass('icon-arrow-left');
    $('div#rightbar').animate({
      right: -200,
      opacity: 0
    }, animationSpeed);
    $('div#content').animate({
      right: 0
    }, animationSpeed, function() {
      return setUpMapDimensions();
    });
    return this;
  };
  openRightbar = function() {
    $('#rightbar-actions .icon-arrow-left').removeClass('icon-arrow-left').addClass('icon-arrow-right');
    $('div#rightbar').show();
    $('div#rightbar').animate({
      right: 0,
      opacity: 100
    }, animationSpeed);
    $('div#content').animate({
      right: 200
    }, animationSpeed, function() {
      return setUpMapDimensions();
    });
    return this;
  };
  showSecondarySidebar = function() {
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
    return this;
  };
  hideSecondarySidebar = function() {
    var bottom, element;
    bottom = $("#footer").position().top;
    element = $("#secondary-sidebar");
    element.css("overflow-y", "hidden");
    $("#secondary-sidebar").animate({
      top: bottom
    }, animationSpeed);
    $('.secondary-sidebar-button').button('toggle');
    return this;
  };
  setUpMapDimensions = function() {
    var alreadySized, bottom, contentHeight, contentWidth, element, heightPerItem, items, remainingHeight;
    contentHeight = $("div#content").height();
    contentWidth = $("div#content").width();
    $(".sidebar-inner").height(contentHeight);
    alreadySized = $("#content .i-have-height");
    remainingHeight = contentHeight;
    alreadySized.each(function() {
      remainingHeight = remainingHeight - $(this).height();
      return $(this).width(contentWidth);
    });
    items = $("#content .give-me-height");
    heightPerItem = remainingHeight / items.length;
    items.each(function() {
      $(this).height(heightPerItem);
      return $(this).width(contentWidth);
    });
    if (window.secondarySidebarState === "closed") {
      bottom = $("#footer").position().top;
      element = $("#secondary-sidebar");
      element.css('top', bottom);
      element.show();
    }
    return this;
  };
  handleLogin = function() {
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
  $(document).ready(function() {
    window.sidebarState = "opened";
    window.secondarySidebarState = "closed";
    window.rightbarState = "closed";
    setUpPopovers();
    setUpMapDimensions();
    window.setUpMapDimensions = setUpMapDimensions;
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
      return $('#login-modal').modal('toggle');
    });
    $('#modal-login-form').click(function() {
      return handleLogin();
    });
    return this;
  });
  $(window).bind('orientationchange pageshow resize', setUpMapDimensions);
}).call(this);
