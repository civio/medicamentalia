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

  /*
  // Infographics setup
  var setupInfographics = function(){

    $('#region-dropdown-menu, #drug-dropdown-menu').click(function(e){ e.stopPropagation(); });

    // Prices graph
    if ($('#prices-infographic').length > 0) {
      var prices_infographic = new Infographic('#prices-infographic', 'prices');
      $(window).scroll( prices_infographic.onScroll );
      $(window).resize( prices_infographic.onResize );
    }
    // Counterfaits infographic
    else if ($('#counterfeits-infographic').length > 0) {
      var fakes_infographic = new Infographic('#counterfeits-infographic', 'fakes');
      $(window).scroll( fakes_infographic.onScroll );
      $(window).resize( fakes_infographic.onResize );
    }
    // Patent graph
    else if ($('#patents-graph').length > 0) {
      var graph_patents = patents_graph('#patents-graph').init();
      $(window).resize( graph_patents.onResize );
    }
    // Patents infographic
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
    // Antibiotics bar graph
    if ($('#antibiotics-graph').length > 0) {
      var graph_antibiotics = new BarGraph('antibiotics-graph', $('body').data('baseurl')+'/assets/data/antibiotics.csv');
      graph_antibiotics.txt = {
        'es': 'Media EU28',
        'en': 'EU28 Average'
      };
      graph_antibiotics.markerValue = 36;
      graph_antibiotics.aspectRatio = 0.5;
      graph_antibiotics.init();
      $(window).resize( graph_antibiotics.onResize );
    }
    // Antibiotics bar graph
    if ($('#antibiotics-animals-graph').length > 0) {
      var graph_antibiotics_animals = new BarGraph('antibiotics-animals-graph', $('body').data('baseurl')+'/assets/data/antibiotics-animals.csv');
      graph_antibiotics_animals.txt = {
        'es': 'Media',
        'en': 'Average'
      };
      graph_antibiotics_animals.markerValue = 107.8;
      graph_antibiotics_animals.aspectRatio = 0.5;
      graph_antibiotics_animals.init();
      $(window).resize( graph_antibiotics_animals.onResize );
    }
    // Vaccine all diseases graph
    if ($('#vaccines-all-diseases-graph').length > 0) {
      var graph_vaccine_all_diseases = new VaccineDiseaseGraph('vaccines-all-diseases-graph');
      graph_vaccine_all_diseases.init( $('#disease-selector .active a').attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val() );
      $(window).resize( graph_vaccine_all_diseases.onResize );
      // Update graph based on selected disease
      $('#disease-selector a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
        graph_vaccine_all_diseases.init( $(this).attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val() );
      });
      // Update graph baseon on order selector
      $('#vaccines-all-diseases-graph #order-selector').change(function(d){
        graph_vaccine_all_diseases.init( $('#disease-selector .active a').attr('href').substring(1), $(this).val() );
      });
    }
    // Vaccine measles graph 1
    if ($('#vaccines-measles-graph-1').length > 0) {
      var countries_1 = ['AFG', 'ARG', 'AUS', 'AUT', 'BEL', 'BOL'];
      var graph_vaccine_measles_1 = new VaccineDiseaseGraph('vaccines-measles-graph-1');
      graph_vaccine_measles_1.filter = function(d){ return countries_1.indexOf(d.code) !== -1; };
      graph_vaccine_measles_1.init( 'measles', 'cases' );
      $(window).resize( graph_vaccine_measles_1.onResize );
    }
    // Vaccine measles graph 2
    if ($('#vaccines-measles-graph-2').length > 0) {
      var countries_2 = ['ESP', 'ROU', 'RUS', 'RWA', 'SYR', 'USA', 'VEN'];
      var graph_vaccine_measles_2 = new VaccineDiseaseGraph('vaccines-measles-graph-2');
      graph_vaccine_measles_2.filter = function(d){ return countries_2.indexOf(d.code) !== -1; };
      graph_vaccine_measles_2.init( 'measles', 'cases' );
      $(window).resize( graph_vaccine_measles_2.onResize );
    }
    // Vaccine map
    if ($('#vaccine-map').length > 0) {
      var vaccine_map = new VaccineMap('vaccine-map');
      //vaccine_map.getData = true; // Set true to download a polio cases csv
      //vaccine_map.getPictureSequence = true; // Set true to download a map picture sequence
      vaccine_map.init($('body').data('baseurl')+'/assets/data/diseases-polio-cases.csv', $('body').data('baseurl')+'/assets/data/map-polio-cases.csv');
      $(window).resize( vaccine_map.onResize );
    }
    if ($('#video-map-polio').length > 0) {
      var wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio');
      wrapper.src = 'http://www.youtube.com/embed/l1F2Xd5FFlQ?controls=0&showinfo=0';
      var popcorn = Popcorn(wrapper);
      popcorn.footnote({
        start: 1,
        end: 5,
        text: 'Works with YouTube!',
        target: 'video-map-polio-description'
      });
      //popcorn.play();
    }
    if ($('#immunization-coverage-graph').length > 0) {
      var graph_immunization = new LineGraph('immunization-coverage-graph', $('body').data('baseurl')+'/assets/data/immunization-coverage.csv');
      graph_immunization.dataFilter = function(d){ return d.vaccine === $('#immunization-coverage-vaccine-selector').val(); };
      graph_immunization.dataSort = function(a,b){ return (a.code === $('#immunization-coverage-country-1-selector').val() || a.code === $('#immunization-coverage-country-2-selector').val()) ? 1 : -1; };
      graph_immunization.activeLines = [$('#immunization-coverage-country-1-selector').val(), $('#immunization-coverage-country-2-selector').val()];
      graph_immunization.init();
      
      // Update data based on selected vaccine
      $('#immunization-coverage-vaccine-selector, #immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector').change(function(e){
        graph_immunization.activeLines = [$('#immunization-coverage-country-1-selector').val(), $('#immunization-coverage-country-2-selector').val()];
        graph_immunization.update();
      });
      $(window).resize( graph_immunization.onResize );
    }
    if ($('#immunization-coverage-country-graphs').length > 0) {
      var graph_measles_immunization   = new BarGraph('measles-bar-graph', null);
      var graph_polio_immunization     = new BarGraph('polio-bar-graph', null);
      var graph_pertussis_immunization = new BarGraph('pertussis-bar-graph', null);
      // Setup graphs aspect ratio
      graph_measles_immunization.aspectRatio = graph_polio_immunization.aspectRatio = graph_pertussis_immunization.aspectRatio = 0.25;
      // Init graphs
      graph_measles_immunization.init();
      graph_polio_immunization.init();
      graph_pertussis_immunization.init();
      // On resize
      $(window).resize(function(){
        graph_measles_immunization.onResize();
        graph_polio_immunization.onResize();
        graph_pertussis_immunization.onResize();
      });
      // Load data
      d3.csv( $('body').data('baseurl')+'/assets/data/immunization-coverage.csv', function(error, data) {
        var country = 'ESP';
        var data_parser = function(d){
          var obj = {label: d.code, value: +d['2015']};
          if (d.code === country ) obj.active = true;
          return obj;
        };
        var data_sort = function(a,b){ return b.value-a.value; };
        var measels_data = data
          .filter(function(d){ return d.vaccine === 'MCV1' && d['2015'] !== ''; })
          .map(data_parser)
          .sort(data_sort);
        var polio_data = data
          .filter(function(d){ return d.vaccine === 'Pol3' && d['2015'] !== ''; })
          .map(data_parser)
          .sort(data_sort);
        var pertussis_data = data
          .filter(function(d){ return d.vaccine === 'DTP3' && d['2015'] !== ''; })
          .map(data_parser)
          .sort(data_sort);

        var country_measles = measels_data.filter(function(d){ return d.label === country; });
        var country_polio = polio_data.filter(function(d){ return d.label === country; });
        var country_pertussis = pertussis_data.filter(function(d){ return d.label === country; });
        if (country_measles.length > 0)
          $('#measles-immunization-data').html('<strong>'+country_measles[0].value+'%</strong>');
        if (country_polio.length > 0)
          $('#polio-immunization-data').html('<strong>'+country_polio[0].value+'%</strong>');
        if (country_pertussis.length > 0)
          $('#pertussis-immunization-data').html('<strong>'+country_pertussis[0].value+'%</strong>');

        graph_measles_immunization.onDataReady(error, measels_data);
        graph_polio_immunization.onDataReady(error, polio_data);
        graph_pertussis_immunization.onDataReady(error, pertussis_data);
      });
    }
  };
  */
   
})(jQuery); // Fully reference jQuery after this point.
