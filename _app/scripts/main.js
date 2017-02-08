// Common site setup
(function($) {

  // Toogle Lang Menu
  $('#language-selector>a').click(function(e){
    e.preventDefault();
    $('#language-selector .submenu-languages').toggle();
  });

  // Add Selection Sharer (https://github.com/xdamman/selection-sharer)
  if (!Modernizr.touch) {
    $('.page-content-container p').selectionSharer();
  }

  // Smooth page scroll to an article section
  $('.nav-page a[href^="#"]').click(function() {
    animateLink( $($(this).attr('href')), 1 );
  });
  // Smooth page scroll to a notes anchor
  $('a[href^="#notes-anchor"]').click(function() {
    animateLink( $($(this).attr('href')), 0 );
  });
  // Smooth page scroll to a notes ref
  $('a[href^="#notes-ref"]').click(function() {
    animateLink( $($(this).attr('href')), -50 );
  });

  // Set Suscribe Input Text
  var suscribe = null;
  $('#mc-embedded-subscribe-form .email').focus(function(){
    suscribe = ( !suscribe ) ? $(this).val() : suscribe;
    $(this).val('');
  }).focusout(function(){
    if( $(this).val() === '' ){
      $(this).val(suscribe);
    }
  });

  var lastId,
    $navPage = $('.nav-page-container');

  var menuItems = $navPage.find('.navbar-nav li a');

  if( menuItems.length > 0 ){

    menuItems.click(function(e){
      menuItems.parent().removeClass('active');
      $(this).parent().addClass('active');
      $('#page-menu').removeClass('in');
    });

    // Anchors corresponding to menu items
    var scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

    // Fix Nav Page & activate items when scroll down
    $(window).scroll(function(e) {

      var footerOffset = $('.page-footer').length > 0 ? $('.page-footer').offset().top : $('.partners').offset().top;

      if ($(this).scrollTop() > $('#article-content > header').height()+50 && $(this).scrollTop() < footerOffset-44) {
        $navPage.addClass("fixed");
      } else {
        $navPage.removeClass("fixed");
      }

      // Get container scroll position
      var fromTop = $(this).scrollTop();
     
      // Get id of current scroll item
      var cur = scrollItems.map(function(){
       if ($(this).offset().top <= fromTop){
         return this;
       }
      });
      // Get the id of the current element
      cur = cur[cur.length-1];
      var id = cur && cur.length ? cur[0].id : "";

      if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        menuItems
          .parent().removeClass("active")
          .end().filter("[href=\\#"+id+"]").parent().addClass("active");
      }
    });
  }

  $('[data-toggle="tooltip"]').tooltip(); // Init Tooltips
  $('.dropdown-toggle').dropdown();       // Init Dropdown

  // Animate link
  var animateLink = function( target, offsetTop ){
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top + offsetTop
      }, 1000);
      return false;
    }
  };
   
})(jQuery); // Fully reference jQuery after this point.
