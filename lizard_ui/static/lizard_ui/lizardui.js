function setUpPopovers() {
  /* Everything with a matching class gets bootstrap's popover enabled.
   */
  $(".has_popover").popover();
  $(".has_popover_north").popover({placement: 'top'});
}


$(document).ready(function () {
  setUpPopovers();
});
