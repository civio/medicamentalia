var VaccineDiseaseGraph = function( _id ) {

  var $ = jQuery.noConflict();

  var Y_AXIS_WIDTH = 100; // Must be the ame value than #vaccine-disease-graph $padding-left scss variable

  var that = this,
      id = _id,
      disease,
      sort,
      lang,
      data,
      dataPopulation,
      currentData,
      cellData,
      countries,
      years,
      cellSize,
      container,
      x, y,
      width, height,
      $el,
      $tooltip;


  // Public Methods

  that.init = function( _disease, _sort ) {

    disease = _disease;
    sort = _sort;

    //console.log('Vaccine Graph init', id, disease, sort);

    $el      = $('#'+id);
    $tooltip = $el.find('.tooltip');
    lang     = $el.data('lang');

    x = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    y = d3.scaleBand()
      .padding(0)
      .paddingInner(0)
      .paddingOuter(0)
      .round(true);

    color = d3.scaleSequential(d3.interpolateOrRd);

    if (data) {
      clear();
      setupData();
      setupGraph();
    } else {
      // Load CSVs
      d3.queue()
        .defer(d3.csv, $('body').data('baseurl')+'/assets/data/diseases-cases.csv')
        .defer(d3.csv, $('body').data('baseurl')+'/assets/data/population.csv')
        .await( onDataReady );
    }

    return that;
  };

  that.onResize = function() {
    getDimensions();
    if (data) updateGraph();
    return that;
  };

  var onDataReady = function(error, data_csv, population_csv) {

    data = data_csv;
    dataPopulation = population_csv;

    // we don't need the columns attribute
    delete data.columns;

    // We can define a filter function to show only some selected countries
    if (that.filter) {
      data = data.filter(that.filter);
    }

    data.forEach(function(d){
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
    currentData = data.filter(function(d){ return d.disease === disease && d3.values(d.values).length > 0; });

    // Sort data
    if (sort === 'year'){
      currentData.sort(function(a,b){ return (isNaN(a.year_introduction)) ? 1 : (isNaN(b.year_introduction)) ? -1 : b.year_introduction-a.year_introduction; });
    } else if (sort === 'cases'){
      currentData.sort(function(a,b){ return b.total-a.total; });
    }

    // Get array of country names
    countries = currentData.map(function(d){ return d.code; });

    // Get array of years
    var minYear = d3.min(currentData, function(d){ return d3.min(d3.keys(d.values)); });
    var maxYear = d3.max(currentData, function(d){ return d3.max(d3.keys(d.values)); });
    years = d3.range(minYear, maxYear, 1);
    years.push(+maxYear);

    //console.log(minYear, maxYear, years);
    //console.log(countries);

    // Get array of data values
    cellsData = [];
    currentData.forEach(function(d){
      for (var value in d.values){
        cellsData.push({
          country: d.code,
          name: d.name,
          year: value,
          cases: d.cases[value],
          value: d.values[value]
        });
      }
    });

    /*
    currentData.forEach(function(d){
      var counter = 0;
      years.forEach(function(year){
        if (d[year])
          counter++;
      });
      if(counter <= 20) // years.length/2)
        console.log(d.name + ' has only values for ' + counter + ' years');
    });
    */
  };

  var setupGraph = function() {

    // Get dimensions (height is based on countries length)
    getDimensions();

    x.domain(years).range([0, width]);

    y.domain(countries).range([0, height]);

    //color.domain([d3.max(cellsData, function(d){ return d.value; }), 0]);
    color.domain([0, 4]);

    //console.log('Maximum cases value: '+ d3.max(cellsData, function(d){ return d.value; }));

    // Add svg
    container = d3.select('#'+id+' .graph-container')
      .style('height', height+'px');

    // Draw cells
    container.append('div')
      .attr('class', 'cell-container')
      .style('height', height+'px')
      .selectAll('.cell')
      .data(cellsData)
    .enter().append('div')
      .attr('class', 'cell')
      .style('background', function(d){ return color(d.value); })
      .call(setCellDimensions)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    // Draw years x axis
    container.append('div')
      .attr('class', 'x-axis axis')
      .selectAll('.axis-item')
      .data(years.filter(function(d){ return d%5===0; }))
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('left', function(d){ return x(d)+'px'; })
      .html(function(d){ return d; });

    // Draw countries y axis
    container.append('div')
      .attr('class', 'y-axis axis')
      .selectAll('.axis-item')
      .data(countries)
    .enter().append('div')
      .attr('class', 'axis-item')
      .style('top', function(d){ return y(d)+'px'; })
      .html(function(d){ return getCountryName(d); });

    // Draw year introduction mark
    container.select('.cell-container')
      .selectAll('.marker')
      .data(currentData
        .map(function(d){ return {code: d.code, year: d.year_introduction}; })
        .filter(function(d){ return !isNaN(d.year); }))
    .enter().append('div')
      .attr('class', 'marker')
      .call(setMarkerDimensions);
  };

  var updateGraph = function() {
    // Update scales
    x.range([0, width]);
    y.range([0, height]);

    container.style('height', height+'px');

    container.select('.cell-container')
      .style('height', height+'px');
      
    container.selectAll('.cell')
      .call(setCellDimensions);

    container.select('.x-axis').selectAll('.axis-item')
      .style('left', function(d){ return x(d)+'px'; });
    container.select('.y-axis').selectAll('.axis-item')
      .style('top', function(d){ return y(d)+'px'; });

    container.select('.cell-container').selectAll('.marker')
      .call(setMarkerDimensions);
  };

  var clear = function() {
    container.select('.cell-container').remove();
    container.selectAll('.axis').remove();
  };

  var setCellDimensions = function(selection) {
    selection
      .style('left', function(d){ return x(d.year)+'px'; })
      .style('top', function(d){ return y(d.country)+'px'; } )
      .style('width', x.bandwidth()+'px')
      .style('height', y.bandwidth()+'px');
  };

  var setMarkerDimensions = function(selection) {
    selection
      .style('top', function(d){ return y(d.code)+'px'; })
      .style('left', function(d){
        return (d.year < years[0]) ? (x(years[0])-1)+'px' : (d.year < years[years.length-1]) ? (x(d.year)-1)+'px' : (x.bandwidth()+x(years[years.length-1]))+'px';
      })
      .style('height', y.bandwidth()+'px');
  };

  var onMouseOver = function(d){
    // Set tooltip content
    var cases_str = (lang === 'es') ? 'casos' : 'cases';
    var cases_single_str = (lang === 'es') ? 'caso' : 'case';
    $tooltip.find('.tooltip-inner .country').html(d.name);
    $tooltip.find('.tooltip-inner .year').html(d.year);
    $tooltip.find('.tooltip-inner .value').html( formatDecimal(d.value, lang) );
    $tooltip.find('.tooltip-inner .cases').html( (d.cases !== 1) ? d.cases.toLocaleString(lang)+' '+cases_str : d.cases.toLocaleString(lang)+' '+cases_single_str );
    // Set tooltip position
    $tooltip.css({
      'left': $(this).offset().left + x.bandwidth()*0.5 - $tooltip.width()*0.5,
      'top': $(this).offset().top - y.bandwidth()*0.5 - $tooltip.height(),
      'opacity': '1'
    });
  };

  var onMouseOut = function(d){
    $tooltip.css('opacity', '0');
  };

  var getCountryName = function(code) {
    var country = currentData.filter(function(d){ return d.code === code; });
    return (country[0]) ? country[0].name : '';
  };

  var getDimensions = function(){
    width    = $el.width() - Y_AXIS_WIDTH;
    cellSize = Math.floor(width / years.length);
    height   = (cellSize < 20) ? cellSize*countries.length : 20*countries.length; // clip cellsize height to 20px
    return that;
  };

  var formatDecimal = function(number, lang){
    return (number < 0.001) ? 0 : (number >= 0.1) ? number.toFixed(1).toLocaleString(lang) : (number >= 0.01) ? number.toFixed(2).toLocaleString(lang) : number.toFixed(3).toLocaleString(lang);
  };

  return that;
};