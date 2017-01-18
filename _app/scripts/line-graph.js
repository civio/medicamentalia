var LineGraph = function( _id, _source ) {

  var $ = jQuery.noConflict();

  var that = this,
      data, currentData;

  that.id      = _id;
  that.source  = _source;

  that.margin = {top: 0, right: 15, bottom: 20, left: 15};
  that.aspectRatio = 0.5625;
  that.markerValue = null;
  that.activeLines = [];

  // Public Methods

  that.init = function() {

    console.log('Line Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    // Setup scales
    that.x = d3.scaleLinear()
      .range([0, that.width]);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    // Setup axis
    that.xAxis = d3.axisBottom(that.x);

    that.yAxis = d3.axisLeft(that.y)
      .tickSize(that.width)
      .tickValues([0, 25, 50, 75, 100]);

    // Setup line
    that.line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(function(d){ return that.x(+d.key); })
      .y(function(d){ return that.y(d.value); });

    // Create svg
    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)
    .append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');

    // Load CSV
    d3.csv(that.source, that.onDataReady);

    return that;
  };

  that.update = function() {
    that.setData();
    that.updateGraph();

    return that;
  };

  that.onDataReady = function(error, _data) {

    that.years = that.getYears(_data);

    data = that.dataParser(_data);

    that.setData();
    that.setGraph();

    return that;
  };

  that.setData = function() {

    // Filter data (that.dataFilter function must be defined outside)
    currentData = (that.dataFilter) ? data.filter(that.dataFilter) : data;

    // Sort data (that.dataSort function must be defined outside)
    if (that.dataSort) {
      currentData = currentData.sort(that.dataSort);
    }
  };

  that.getYears = function(_data) {
    var years = [];
    d3.keys(_data[0]).forEach(function(d){
      if (+d) {
        years.push(+d);
      }
    });
    return years.sort();
  };

  that.dataParser = function(_data) {
    _data.forEach(function(d){
      d.values = {};
      that.years.forEach(function(year){
        if (d[year]) {
          d.values[year] = +d[year];
        } else {
          console.log('No hay datos de para', d.name, 'en ', year);
        }
        delete d[year];
      });
    });
    return _data;
  };

  that.setGraph = function() {
    // Set scales domain
    that.x.domain([that.years[0], that.years[that.years.length-1]]);
    that.y.domain([0, 100]);  // TODO!!! Make this dynamic

    // Draw axis
    that.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(that.xAxis);

    that.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + that.width + ', 0)')
      .call(that.yAxis);

    // Draw lines
    setLines();

    that.svg.append('text')
      .attr('class', 'country-label')
      .attr('x', that.width-10)
      .attr('y', that.height-10)
      .attr('text-anchor', 'end');

    return that;
  };

  that.updateGraph = function() {
    that.svg.select('.lines').remove();
    setLines();

    return that;
  };

  that.onResize = function() {

    that.getDimensions();
    that.updateData();

    return that;
  };

  that.updateData = function(){

    /*
    that.svg
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);

    that.x.range([0, that.width]);
    that.y.range([that.height, 0]);

    that.svg.select('g.x.axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(d3.axisBottom(that.x));

    that.svg.selectAll('.bar')
      .attr('x', function(d) { return that.x(d.label); })
      .attr('y', function(d) { return that.y(d.value); })
      .attr('width', that.x.bandwidth())
      .attr('height', function(d) { return that.height - that.y(d.value); });

    that.svg.selectAll('.bar-label')
      .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
      .attr('y', function(d) { return that.y(d.value); });
    */
  };

  that.getDimensions = function(){

    that.widthCont = that.$el.width();
    that.heightCont = that.widthCont * that.aspectRatio;

    that.width = that.widthCont - that.margin.left - that.margin.right;
    that.height = that.heightCont - that.margin.top - that.margin.bottom;
  };

  /*
  that.addMarker = function() {

    that.svg.append('line')
      .attr('class', 'marker')
      .attr("x1", 0)
      .attr("y1", function(d) { return that.y(that.markerValue); })
      .attr("x2", that.width)
      .attr("y2", function(d) { return that.y(that.markerValue); });

    that.svg.append('g')
      .attr('class', 'marker-label')
      .append('text')
      .attr('x', that.width )
      .attr('y', function(d) { return that.y(that.markerValue); })
      .attr('dy', '1em' )
      .style('text-anchor', 'end')
      .text( that.txt[that.lang] );
  }
  */

  var setLines = function() {
    // Draw lines
    that.svg.append('g')
      .attr('class', 'lines')
    .selectAll('.line')
      .data(currentData)
    .enter().append('g')
      .attr('class', function(d){ return (that.activeLines.indexOf(d.code) === -1) ? 'line' : 'line active'; })
      .attr('id', function(d){ return 'line-'+d.code; })
      .on('mouseover', onLineOver)
      .on('mouseout', onLineOut)
    .append('path')
      .datum(function(d){ return d3.entries(d.values); })
      .attr('d', that.line);
  };

  var onLineOver = function(d){
    d3.select(this).classed('active', true);
    that.svg.select('.country-label').text( d3.select(this).datum().name );
  };

  var onLineOut = function(d){
    d3.select(this).classed('active', function(d){ return (that.activeLines.indexOf(d.code) !== -1); });
    that.svg.select('.country-label').text('');
  };

  return that;
};