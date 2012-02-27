function setUpPopovers() {
  /* Everything with a matching class gets bootstrap's popover enabled.
   */
  $(".has_popover").popover();
}


$(document).ready(function () {
  setUpPopovers();
});
