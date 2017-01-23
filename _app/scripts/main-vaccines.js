// Main script for vaccines articles

(function($) {

  $('[data-toggle="tooltip"]').tooltip(); // Init Tooltips
 
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
  /*
  // Vaccine map
  if ($('#vaccine-map').length > 0) {
    var vaccine_map = new VaccineMap('vaccine-map');
    //vaccine_map.getData = true; // Set true to download a polio cases csv
    //vaccine_map.getPictureSequence = true; // Set true to download a map picture sequence
    vaccine_map.init($('body').data('baseurl')+'/assets/data/diseases-polio-cases.csv', $('body').data('baseurl')+'/assets/data/map-polio-cases.csv');
    $(window).resize( vaccine_map.onResize );
  }
  */
  // Video of polio map cases
  if ($('#video-map-polio').length > 0) {
    var wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio');
    wrapper.src = 'http://www.youtube.com/embed/l1F2Xd5FFlQ?controls=0&showinfo=0&hd=1';
    var popcorn = Popcorn(wrapper);
    var i, notes = 2016-1980;
    for(i=0; i<=notes; i++){
      popcorn.footnote({
        start:  1.6222*i,
        end:    1.6222*(i+1),
        text:   1980+i,
        target: 'video-map-polio-description'
      });
    }
    // Show cover when video ended
    wrapper.addEventListener('ended', function(e){
      $('.video-map-polio-cover').fadeIn();
      $('#video-map-polio-description').fadeTo(300, 0);
      popcorn.currentTime(0);
    }, false );
    // Show video when play btn clicked
    $('#video-map-polio-play-btn').click(function(e){
      e.preventDefault();
      popcorn.play();
      $('.video-map-polio-cover').fadeOut();
      $('#video-map-polio-description').fadeTo(300, 1);
    });
  }
  // Immunization coverage line grah
  if ($('#immunization-coverage-graph').length > 0) {
    var graph_immunization = new LineGraph();
    graph_immunization.getScaleYDomain = function(d){ return [0,100]; };
    graph_immunization.dataFilter = function(d){ return d.vaccine === $('#immunization-coverage-vaccine-selector').val(); };
    graph_immunization.dataSort = function(a,b){ return (a.code === $('#immunization-coverage-country-1-selector').val() || a.code === $('#immunization-coverage-country-2-selector').val()) ? 1 : -1; };
    graph_immunization.activeLines = [$('#immunization-coverage-country-1-selector').val(), $('#immunization-coverage-country-2-selector').val()];
    graph_immunization.setup('immunization-coverage-graph');
    graph_immunization.yAxis.tickValues([0, 25, 50, 75, 100]);
    graph_immunization.loadData($('body').data('baseurl')+'/assets/data/immunization-coverage.csv');
    
    // Update data based on selected vaccine
    $('#immunization-coverage-vaccine-selector, #immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector').change(function(e){
      graph_immunization.activeLines = [$('#immunization-coverage-country-1-selector').val(), $('#immunization-coverage-country-2-selector').val()];
      graph_immunization.update();
    });
    $(window).resize( graph_immunization.onResize );
  }
  // Multiple small world cases area graph
  if ($('#world-cases').length > 0) {
    var diseases = ['diphteria', 'measles', 'pertussis', 'polio', 'tetanus'];
    d3.csv( $('body').data('baseurl')+'/assets/data/diseases-cases-world.csv', function(error, data) {
      // Get max value to create a common y scale
      var maxValue1 = d3.max(data, function(d){ return d3.max(d3.values(d), function(e){ return +e; }); });
      var maxValue2 = d3.max(data.filter(function(d){ return ['diphteria', 'polio', 'tetanus'].indexOf(d.disease) !== -1; }),
        function(d){ return d3.max(d3.values(d), function(e){ return +e; }); });
      // Create a line graph for each disease
      diseases.forEach(function(disease){
        // get current disease data
        var disease_data = data
          .filter(function(d){ return d.disease === disease; })
          .map(function(d){ return $.extend({}, d); });
        // setup line chart
        var graph_world = new LineGraph();
        graph_world.getScaleYDomain = function(){ return [0, (disease === 'measles' || disease === 'pertussis') ? maxValue1 : maxValue2]; };
        graph_world.isArea = true;
        graph_world.margin.left = 20;
        graph_world.setup(disease+'-world-graph');
        graph_world.xAxis.tickValues([1980, 2015]);
        graph_world.yAxis.ticks(2).tickFormat(d3.format('.0s'));
        graph_world.setData(disease_data);
      });
    });
  }
  // Immunization coverage by disease bar graph
  if ($('.immunization-coverage-disease-graph').length > 0) {
    // Load data
    d3.csv( $('body').data('baseurl')+'/assets/data/immunization-coverage.csv', function(error, data) {
      // Setup current country -> TODO!!! we have to get user country
      var country = 'ESP';
      // setup data
      var data_parser = function(d){
        var obj = {label: d.code, value: +d['2015']};
        if (d.code === country ) obj.active = true;
        return obj;
      };
      var data_sort = function(a,b){ return b.value-a.value; };
      // loop through each graph
      $('.immunization-coverage-disease-graph').each(function(){
        var $el = $(this),
            disease = $el.data('disease'),
            vaccine = $el.data('vaccine');
        // Get graph data & value
        var graph_data = data
          .filter(function(d){ return d.vaccine === vaccine && d['2015'] !== ''; })
          .map(data_parser)
          .sort(data_sort);
        console.log(disease, vaccine, graph_data);
        var graph_value = graph_data.filter(function(d){ return d.label === country; });
        // Setup graph
        var graph = new BarGraph(disease+'-immunization-bar-graph', null);
        // Setup graph aspect ratio
        graph.aspectRatio = 0.25;
        // Init graph
        graph.init();
        // Set data graph
        graph.onDataReady(error, graph_data);
        // Setup graph value
        if (graph_value.length > 0)
          $el.find('.immunization-data').html('<strong>'+graph_value[0].value+'%</strong>');
        // On resize
        $(window).resize(function(){ graph.onResize(); });
      });
    });
  }

})(jQuery); // Fully reference jQuery after this point.
