var VaccineDiseaseGraph = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var Y_AXIS_WIDTH = 100; // Must be the ame value than #vaccine-disease-graph $padding-left scss variable

  that.id = _id;


  // Public Methods

  that.init = function( _disease ) {

    that.disease = _disease;

    console.log('Vaccine Graph init', that.id, that.disease);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.x = d3.scaleBand()
      .round(true);

    that.y = d3.scaleBand()
      .round(true);

    that.color = d3.scaleSequential(d3.interpolateInferno);

    if (that.data) {
      clear();
      setupData();
      setupGraph();
    } else {
      // Load CSVs
      d3.queue()
        .defer(d3.csv, $('body').data('baseurl')+'assets/csv/diseases-cases.csv')
        .defer(d3.csv, $('body').data('baseurl')+'assets/csv/population.csv')
        .await( onDataReady );
    }

    return that;
  };

  that.onResize = function() {
    that.getDimensions();
    //that.updateData();
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
    that.data.forEach(function(d){
      d.disease = d.disease.toLowerCase();
      if (d.year_introduction) {
        d.year_introduction = +d.year_introduction.replace('prior to', '');
      }
    });

    setupData();
    setupGraph();
  };

  var setupData = function() {

    // Filter data based on selected disease
    that.current_data = that.data.filter(function(d){ return d.disease === that.disease; });

    // Sort data by year of introduction
    that.current_data.sort(function(a,b){ return (isNaN(a.year_introduction)) ? 1 : (isNaN(b.year_introduction)) ? -1 : b.year_introduction-a.year_introduction; });

    // Get array of country names
    that.countries = that.current_data.map(function(d){ return d.code; });

    // Get array of years
    that.years = d3.keys(that.current_data[0])
      .map(function(d){ return +d; })
      .filter(function(d){ return !isNaN(d); });
    removeEmptyYears();

    //console.log(that.countries);
    //console.log(that.years);

    // Get array of data values
    that.cells_data = [];
    that.current_data.forEach(function(d){
      var populationItem = that.dataPopulation.filter(function(country){ return country.code === d.code; });
      if (populationItem.length > 0) {
        that.years.forEach(function(year){
          if (d[year]) {
            var population = +populationItem[0][year];
            if (population !== 0) {
              that.cells_data.push({
                country: d.code,
                name: d.name,
                year: year,
                value: 1000 * (+d[year] / population)
              });
            } else {
              console.log('No hay datos de población para', d.name, 'en ', year);
            }
          }
        });
      } else {
        console.log('No hay datos de población para', d.name);
      }
    });

    that.current_data.forEach(function(d){
      var counter = 0;
      that.years.forEach(function(year){
        if (d[year])
          counter++;
      });
      if(counter <= 20) // that.years.length/2)
        console.log(d.name + ' has only values for ' + counter + ' years');
    });
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
    that.color.domain([10, 0]);

    console.log('Maximum cases value: '+ d3.max(that.cells_data, function(d){ return d.value; }));

    // Add svg
    that.container = d3.select('#'+that.id+' .graph-container')
      .style('height', that.height+'px');

    // Draw cells
    that.container.append('div')
      .attr('class', 'cell-container')
      .selectAll('.cell')
      .data(that.cells_data)
    .enter().append('div')
      .attr('class', 'cell')
      .style('left', function(d){ return that.x(d.year)+'px'; })
      .style('top', function(d){ return that.y(d.country)+'px'; } )
      .style('width', that.x.bandwidth()+'px')
      .style('height', that.y.bandwidth()+'px')
      .style('background', function(d){ return that.color(d.value); })
      .on('mouseover', function(d){
        console.log(d.name, d.year, d.value);
      });

    // Draw countries x axis
    that.container.append('div')
      .attr('class', 'x-axis axis')
      .selectAll('.axis-item')
      .data(that.years.filter(function(d){ return d%5===0; }))
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('left', function(d){ return that.x(d)+'px'; })
      .html(function(d){ return d; });

    // Draw years y axis
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
      .selectAll('.introduction')
      .data(that.current_data
        .map(function(d){ return {code: d.code, year: d.year_introduction}; })
        .filter(function(d){ return !isNaN(d.year); }))
    .enter().append('div')
      .attr('class', 'introduction')
      .style('top', function(d){ return that.y(d.code)+'px'; })
      .style('left', function(d){
        return (d.year < that.years[0]) ? that.x(that.years[0])+'px' : (d.year < that.years[that.years.length-1]) ? that.x(d.year)+'px' : (that.x.bandwidth()+that.x(that.years[that.years.length-1]))+'px';
      })
      .style('height', that.y.bandwidth()+'px');
  };

  var clear = function() {
    that.container.select('.cell-container').remove();
    that.container.selectAll('.axis').remove();
  };

  var removeEmptyYears = function(){
    var c = that.years.length-1;
    while( c >= 0) {
      var year = that.years[c];
      var empties = that.current_data
        .map(function(d){ return d[year]; })
        .filter(function(d){ return d === ''; })
        .length;
      // Delete years with all values empty
      if(empties === that.countries.length){
        that.years.splice(c, 1);
      }
      c--;
    }
  };

  var getCountryName = function(code) {
    var country = that.cells_data.filter(function(d){ return d.country === code; });
    return (country[0]) ? country[0].name : '';
  };

  return that;
};