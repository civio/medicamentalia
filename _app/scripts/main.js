/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Common setup
  var setup = function(){
      
    // Toogle Lang Menu
    $('#language-selector>a').click(function(e){
      e.preventDefault();
      $('#language-selector .submenu-languages').toggle();
    });

    // Add Selection Sharer (https://github.com/xdamman/selection-sharer)
    if (!Modernizr.touch) {
      $('.page-content-container p').selectionSharer();
    }

    // Smooth page scroll to an anchor on the same page.
    $('a[href*=\\#]').not('[href=\\#]').not('.carousel-control').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
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
      $navPage = $('.nav-page');

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
        
        if ($(this).scrollTop() > $('body > header').height()+50) {
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
  };


  // Infographics setup
  var setupInfographics = function(){

    $('[data-toggle="tooltip"]').tooltip(); // Init Tooltips
    $('.dropdown-toggle').dropdown();       // Init Dropdown
    $('#region-dropdown-menu, #drug-dropdown-menu').click(function(e){ e.stopPropagation(); });

    if ($('#prices-infographic').length > 0) {
      var prices_infographic = new Infographic('#prices-infographic', 'prices');
      $(window).scroll( prices_infographic.onScroll );
      $(window).resize( prices_infographic.onResize );
    }
    else if ($('#counterfeits-infographic').length > 0) {
      var fakes_infographic = new Infographic('#counterfeits-infographic', 'fakes');
      $(window).scroll( fakes_infographic.onScroll );
      $(window).resize( fakes_infographic.onResize );
    }
    else if ($('#patents-graph').length > 0) {
      var graph = patents_graph('#patents-graph').init();
      $(window).resize( graph.onResize );
    }
    else if ($('#patents-infographic').length > 0) {
      var patentes_infographic = new Infographic('#patents-infographic', 'patentes');
      var antimalaricos_infographic = new Infographic('#antimalaricos-infographic', 'antimalaricos');
      $(window).scroll( function(e){
        patentes_infographic.onScroll();
        antimalaricos_infographic.onScroll();
      });
      $(window).resize( function(){
        patentes_infographic.onResize();
        antimalaricos_infographic.onResize();
      });
    }
  };
   
  setup();

  // Code for Articles only !!!! 
  // ----------------------------

  if( $('body').hasClass('articles') ){
    setupInfographics();
  }
  

})(jQuery); // Fully reference jQuery after this point.
