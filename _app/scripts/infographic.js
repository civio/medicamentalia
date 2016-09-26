var Infographic = function( _id, _type ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var type = _type;

  var vis,
      scrollTop,
      endPosition,
      currentItem = -1,
      $el, $frame, $nav, $fixedEl, $contentList;


  // Private Methods

  var setItems = function(){

    $frame = $('<ul class="infographic-frame"></ul>');
    $nav = $('<ul class="infographic-nav"></ul>');

    var i = 1;

    $contentList.each(function(){
      $frame.append('<li class="frame-'+i+'"><div class="scroller"></div></li>');
      $nav.append('<li><a href="#'+i+'"></a></li>');
      i++;
    });

    $frame.append('<li class="frame-'+i+'"><div class="scroller"></div></li>');   // Add last frame item

    if( type === 'main'){
      $frame.append('<li class="frame-'+(i+1)+'"><div class="scroller"></div></li>');   // Add extra frame item for Main Infographic
      if( $el.find('.infographic-content').hasClass('iframe') ){
        $nav.append('<li><a href="#'+i+'"></a></li>');   // Add extra nav item for Main Infographic in iframe mode
      }
    }

    $el.append( $frame );
    $el.append( $nav );
  };

  var setIframeBtns = function(){
    $contentList.each(function(i){
      $(this).append('<div class="btn-next"><a href="#'+(i+2)+'" class="btn btn-default btn-sm">Siguiente <i class="glyphicon glyphicon-chevron-right"></i></a></div>');
    });
    $contentList.find('.btn-next a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
    $('html, body').animate({ scrollTop: $('.infographic-frame li.frame-1').offset().top + 2}, '200');
  };

  // Get url params
  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  };

  // Public Methods

  that.init = function(){

    //console.log('infographic', id, type);

    $el = $( id );
    $contentList = $el.find('.infographic-content li');

    setItems();   // Setup Frame & Navigation Items

    $fixedEl = $el.find('.infographic-content, .infographic-nav, .infographic-graph');

    // Setup Infographic by Type
    if( type === 'main'){
      vis = new Main_Infographic( id+' .infographic-graph' ); 
    }
    else if( type === 'antimalaricos'){
      vis = new Antimalaricos_Infographic( id+' .infographic-graph' ).init(); 
    }
    else if( type === 'patentes'){
      vis = new Patents_Infographic( id+' .infographic-graph' ).init(); 
    }
    else if( type === 'fakes'){
      vis = new Fakes_Infographic( id+' .infographic-graph' ).init(); 
    }

    that.onResize();

    if( type === 'main'){ 
      vis.init( urlParam('skip') === 'true' );  // Setup skip value to Main Infographic
      if( $el.find('.infographic-content').hasClass('iframe') ){
        if( vis.skip ){
          $('#main-infographic .infographic-frame').hide();
          $('#main-infographic-menu').addClass('active');
          $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }
        else{
          setIframeBtns();
        }
      }
    }
    
    $contentList.first().addClass('active');    // Setup firs content item as active

    // Nav Buttons Click Interaction
    $nav.find('li a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
  };


  that.onScroll = function(e) {

    scrollTop = $(window).scrollTop();

    if ( scrollTop >= $el.offset().top && scrollTop < endPosition ) {
      $fixedEl.addClass('fixed');
      if( type === 'main'){ $('#main-infographic-tooltip').addClass('fixed'); }
    } else {
      $fixedEl.removeClass('fixed');
      if( type === 'main'){ $('#main-infographic-tooltip').removeClass('fixed'); }
    }

    if ( scrollTop >= endPosition ) {
      $fixedEl.addClass('bottom');
    }
    else {
      $fixedEl.removeClass('bottom');
    }

    var lastItem = currentItem,
        temp = Math.floor((scrollTop-$el.offset().top) / $(window).height());

    if (currentItem !== temp) {

      currentItem = temp;

      if (currentItem >= 0) {

        //console.log('state', type, currentItem, $contentList.size() );

        // Show/hide Main Infographic Menu
        if (type === 'main') {
          if (currentItem !== $contentList.size()) {
            $('#main-infographic-menu').removeClass('active');
            $el.find('.infographic-nav, .infographic-content').removeClass('invisible');
          }
          else {
            $('#main-infographic-menu').addClass('active');
            $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          }
        }

        vis.setState( currentItem );

        if( lastItem < currentItem ){
          $contentList.not('.active').css('top', '40px');
          $contentList.filter('.active').css('top', '-40px').removeClass('active');
        }
        else{
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }

        $contentList.eq(currentItem).css('top', '0px').addClass('active');

        $nav.find('li').removeClass('active');
        $nav.find('li').eq(currentItem).addClass('active');
      }
    }
  };

  that.onResize = function() {

    $el.find('.infographic-content, .infographic-nav, .infographic-frame li').height( $(window).height() );
    $el.find('.infographic-graph').height( $(window).height() - $('.infographic-graph').position().top - 30 );

    endPosition = $el.offset().top + $el.height() - $(window).height();

    //if ($(window).width() <= 992) {
    if ($(window).width() < 860) {
      $el.find('.infographic-content').css('height','auto'); 
    }

    if (type === 'main' && vis.isInitialized()) { 
      vis.resize(); 
    }
  };

  // Init
  that.init();
};