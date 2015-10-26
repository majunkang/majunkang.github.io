/** Auto Reset <body> padding-top so that navbar-fixed-top will not overlay your other content in <body> **/
function resetPadding() {
    var scrolltop = $(this).scrollTop();
 
    var fixedbarHeight = $('#fixedbar').height();

    var expectedBodyPadding = fixedbarHeight + 7;

    var currentBodyPadding = parseInt($('body').css('padding-top'));

    if (currentBodyPadding != expectedBodyPadding)
    {
      $('body').css('padding-top', expectedBodyPadding+'px');
    }
}

$(document).ready(function(){
     
  resetPadding();

  $(window).on('resize', resetPadding); // navbar height may change, when window size resized

});
/** End Auto Rest <body> padding-top **/