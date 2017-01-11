var VaccineDiseaseGraph = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var Y_AXIS_WIDTH = 100; // Must be the ame value than #vaccine-disease-graph $padding-left scss variable

  that.id = _id;


  // Public Methods

  that.init = function( _disease, _sort ) {

    that.disease = _disease;
    this.sort = _sort;

    //console.log('Vaccine Graph init', that.id, that.disease, that.sort);

    that.$el      = $('#'+that.id);
    that.$tooltip = that.$el.find('.tooltip');
    that.lang     = that.$el.data('lang');

    that.x = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    that.y = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    that.color = d3.scaleSequential(d3.interpolateOrRd);

    if (that.data) {
      clear();
      setupData();
      setupGraph();
    } else {
      // Load CSVs
      d3.queue()
        .defer(d3.csv, $('body').data('baseurl')+'/assets/csv/diseases-cases.csv')
        .defer(d3.csv, $('body').data('baseurl')+'/assets/csv/population.csv')
        .await( onDataReady );
    }

    return that;
  };

  that.onResize = function() {
    that.getDimensions();
    if (that.data) updateGraph();
    return that;
  };

  that.getDimensions = function(){
    that.width    = that.$el.width() - Y_AXIS_WIDTH;
    that.cellSize = Math.floor(that.width / that.years.length);
    that.height   = (that.cellSize < 20) ? that.cellSize*that.countries.length : 20*that.countries.length; // clip cellsize height to 20px
    return that;
  };

  var onDataReady = function(error, data_csv, population_csv) {

    that.data = data_csv;
    that.dataPopulation = population_csv;

    // we don't need the columns attribute
    delete that.data.columns;

    // We can define a filter function to show only some selected countries
    if (that.filter) {
      that.data = that.data.filter(that.filter);
    }

    that.data.forEach(function(d){
      d.disease = d.disease.toLowerCase();
      if (d.year_introduction) {
        d.year_introduction = +d.year_introduction.replace('prior to', '');
      }
     
      d.cases = {};
      d.values = {};

      // set value es cases /1000 habitants
      var populationItem = population_csv.filter(function(country){ return country.code === d.code; });
      if (populationItem.length > 0) {
        for(var year=1980; year<2016; year++){
          if (d[year]) {
            var population = +populationItem[0][year];
            if (population !== 0) {
              //d[year] = 1000 * (+d[year] / population);
              d.cases[year] = +d[year];
              d.values[year] = 1000 * (+d[year] / population);
            } else {
              //d[year] = null;
              //console.log('No hay datos de población para', d.name, 'en ', year, d[year]);
            }
          } else{
            //d[year] = null;
            //console.log('No hay datos de casos de ' + d.disease + ' para', d.name, 'en ', year, ':', d[year], typeof d[year]);
          }
          delete d[year];
        }
      } else {
        console.log('No hay datos de población para', d.name);
      }

      // Get total cases by country & disease
      d.total = d3.values(d.values).reduce(function(a,b){return a + b;}, 0);
    });

    setupData();
    setupGraph();
  };

  var setupData = function() {

    // Filter data based on selected disease
    that.current_data = that.data.filter(function(d){ return d.disease === that.disease && d3.values(d.values).length > 0; });

    // Sort data
    if (that.sort === 'year'){
      that.current_data.sort(function(a,b){ return (isNaN(a.year_introduction)) ? 1 : (isNaN(b.year_introduction)) ? -1 : b.year_introduction-a.year_introduction; });
    } else if (that.sort === 'cases'){
      that.current_data.sort(function(a,b){ return b.total-a.total; });
    }

    // Get array of country names
    that.countries = that.current_data.map(function(d){ return d.code; });

    // Get array of years
    var min_year = d3.min(that.current_data, function(d){ return d3.min(d3.keys(d.values)); });
    var max_year = d3.max(that.current_data, function(d){ return d3.max(d3.keys(d.values)); });
    that.years = d3.range(min_year, max_year, 1);
    that.years.push(+max_year);

    //console.log(min_year, max_year, that.years);
    //console.log(that.countries);

    // Get array of data values
    that.cells_data = [];
    that.current_data.forEach(function(d){
      for (var value in d.values){
        that.cells_data.push({
          country: d.code,
          name: d.name,
          year: value,
          cases: d.cases[value],
          value: d.values[value]
        });
      }
    });

    /*
    that.current_data.forEach(function(d){
      var counter = 0;
      that.years.forEach(function(year){
        if (d[year])
          counter++;
      });
      if(counter <= 20) // that.years.length/2)
        console.log(d.name + ' has only values for ' + counter + ' years');
    });
    */
  };

  var setupGraph = function() {

    // Get dimensions (height is based on countries length)
    that.getDimensions();

    that.x
      .domain(that.years)
      .range([0, that.width]);

    that.y
      .domain(that.countries)
      .range([0, that.height]);

    //that.color.domain([d3.max(that.cells_data, function(d){ return d.value; }), 0]);
    that.color.domain([0, 4]);

    //console.log('Maximum cases value: '+ d3.max(that.cells_data, function(d){ return d.value; }));

    // Add svg
    that.container = d3.select('#'+that.id+' .graph-container')
      .style('height', that.height+'px');

    // Draw cells
    that.container.append('div')
      .attr('class', 'cell-container')
      .style('height', that.height+'px')
      .selectAll('.cell')
      .data(that.cells_data)
    .enter().append('div')
      .attr('class', 'cell')
      .style('background', function(d){ return that.color(d.value); })
      .call(setCellDimensions)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    // Draw years x axis
    that.container.append('div')
      .attr('class', 'x-axis axis')
      .selectAll('.axis-item')
      .data(that.years.filter(function(d){ return d%5===0; }))
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('left', function(d){ return that.x(d)+'px'; })
      .html(function(d){ return d; });

    // Draw countries y axis
    that.container.append('div')
      .attr('class', 'y-axis axis')
      .selectAll('.axis-item')
      .data(that.countries)
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('top', function(d){ return that.y(d)+'px'; })
      .html(function(d){ return getCountryName(d); });

    // Draw year introduction mark
    that.container.select('.cell-container')
      .selectAll('.marker')
      .data(that.current_data
        .map(function(d){ return {code: d.code, year: d.year_introduction}; })
        .filter(function(d){ return !isNaN(d.year); }))
    .enter().append('div')
      .attr('class', 'marker')
      .call(setMarkerDimensions);
  };

  var updateGraph = function() {
    // Update scales
    that.x.range([0, that.width]);
    that.y.range([0, that.height]);

    that.container.style('height', that.height+'px');

    that.container.select('.cell-container')
      .style('height', that.height+'px');
      
    that.container.selectAll('.cell')
      .call(setCellDimensions);

    that.container.select('.x-axis').selectAll('.axis-item')
      .style('left', function(d){ return that.x(d)+'px'; });
    that.container.select('.y-axis').selectAll('.axis-item')
      .style('top', function(d){ return that.y(d)+'px'; });

    that.container.select('.cell-container').selectAll('.marker')
      .call(setMarkerDimensions);
  };

  var clear = function() {
    that.container.select('.cell-container').remove();
    that.container.selectAll('.axis').remove();
  };

  var setCellDimensions = function(selection) {
    selection
      .style('left', function(d){ return that.x(d.year)+'px'; })
      .style('top', function(d){ return that.y(d.country)+'px'; } )
      .style('width', that.x.bandwidth()+'px')
      .style('height', that.y.bandwidth()+'px');
  };

  var setMarkerDimensions = function(selection) {
    selection
      .style('top', function(d){ return that.y(d.code)+'px'; })
      .style('left', function(d){
        return (d.year < that.years[0]) ? (that.x(that.years[0])-1)+'px' : (d.year < that.years[that.years.length-1]) ? (that.x(d.year)-1)+'px' : (that.x.bandwidth()+that.x(that.years[that.years.length-1]))+'px';
      })
      .style('height', that.y.bandwidth()+'px');
  };

  var onMouseOver = function(d){
    var cases_str = (that.lang === 'es') ? 'casos' : 'cases';
    var cases_single_str = (that.lang === 'es') ? 'caso' : 'case';
    that.$tooltip.find('.tooltip-inner .country').html(d.name);
    that.$tooltip.find('.tooltip-inner .year').html(d.year);
    that.$tooltip.find('.tooltip-inner .value').html( formatDecimal(d.value, that.lang) );
    that.$tooltip.find('.tooltip-inner .cases').html( (d.cases !== 1) ? d.cases.toLocaleString(that.lang)+' '+cases_str : d.cases.toLocaleString(that.lang)+' '+cases_single_str );
    
    var xpos = $(this).offset().left + that.x.bandwidth()*0.5 - that.$tooltip.width()*0.5;

    //console.log($(this).offset().left, $(this).position().left);

    console.log( that.$el.width()-xpos );

    //if( xpos > )

    that.$tooltip.css({
      'left': xpos,
      'top': $(this).offset().top - that.y.bandwidth()*0.5 - that.$tooltip.height(),
      'opacity': '1'
    });
  };

  var onMouseOut = function(d){
    that.$tooltip.css('opacity', '0');
  };

  var getCountryName = function(code) {
    var country = that.current_data.filter(function(d){ return d.code === code; });
    return (country[0]) ? country[0].name : '';
  };

  var formatDecimal = function(number, lang){
    return (number < 0.001) ? 0 : (number >= 0.1) ? number.toFixed(1).toLocaleString(lang) : (number >= 0.01) ? number.toFixed(2).toLocaleString(lang) : number.toFixed(3).toLocaleString(lang);
  };

  return that;
};