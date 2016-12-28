var VaccineGraph = function( _id, _data_url ) {

  var $ = jQuery.noConflict();

  var that = this;

  that.id       = _id;
  that.data_url = _data_url;

  // Public Methods

  that.init = function() {

    console.log('Vaccine Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.x = d3.scaleBand()
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    that.y = d3.scaleBand()
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    that.color = d3.scaleSequential(d3.interpolateInferno);

    // Load CSVs
    d3.queue()
      .defer(d3.csv, that.data_url)
      .defer(d3.csv, $('body').data('baseurl')+'/assets/csv/countries.csv')
      .await( onDataReady );

    return that;
  };

  that.onResize = function() {
    that.getDimensions();
    //that.updateData();
    return that;
  };

  that.getDimensions = function(){
    that.width    = that.$el.width();
    that.cellSize = Math.floor(that.width / that.years.length);
    that.height   = (that.countries.length * that.cellSize);
    return that;
  };

  var onDataReady = function(error, data_csv, countries_csv) {

    console.log(countries_csv);

    // Get array of country names
    that.countries = d3.nest()
      .key(function(d){ return d.ISO_code_2; })
      .entries(data_csv)
      .map(function(d){ return d.key; });

    // Get array of years
    that.years = d3.keys(data_csv[0])
      .map(function(d){ return +d; })
      .filter(function(d){ return !isNaN(d); });

    console.log(that.countries);
    console.log(that.years);

    // Get array of data values
    that.data = [];
    data_csv.forEach(function(d){
      that.years.forEach(function(year){
        if (d[year]) {
          that.data.push({
            country: d.ISO_code_2,
            year: year,
            value: +d[year]
          });
        }
      });
    });

    setup();
  };

  var setup = function() {

    // Get dimensions (height is based on countries length)
    that.getDimensions();

    that.x
      .domain(that.years)
      .range([0, that.width]);

    that.y
      .domain(that.countries)
      .range([0, that.height]);

    that.color.domain([d3.max(that.data, function(d){ return d.value; }), 0]);

    console.log('color domain', that.color.domain());

    // Add svg
    that.container = d3.select('#'+that.id)
      .style('height', that.height+'px');

    /*
    .append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)
    .append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
    */

    console.log(+that.container.style('padding-left').slice(0,-2));

    // Draw cells
    that.container.append('div')
      .attr('class', 'cell-container')
      .selectAll('.cell')
      .data(that.data)
    .enter().append('div')
      .attr('class', 'cell')
      .style('left', function(d){ return that.x(d.year)+'px'; })
      .style('top', function(d){ return that.y(d.country)+'px'; } )
      .style('width', that.x.bandwidth()+'px')
      .style('height', that.y.bandwidth()+'px')
      .style('background', function(d){ return that.color(d.value); })
      .on('mouseover', function(d){
        console.log(d.country, d.year, d.value);
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
      .html(function(d){ return d; });
  };

  return that;
};