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

})(jQuery); // Fully reference jQuery after this point.
