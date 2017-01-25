var LineGraph = function() {

  var $ = jQuery.noConflict();

  var that = this,
      data, currentData;

  that.margin      = {top: 0, right: 0, bottom: 20, left: 0};
  that.aspectRatio = 0.5625;
  that.markers     = [];
  that.activeLines = [];

  that.setup = function( _id ) {

    that.id   = _id;
    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    // Setup scales
    that.x = d3.scaleLinear()
      .range([0, that.width]);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    // Setup axis
    that.xAxis = d3.axisBottom(that.x)
      .tickFormat(d3.format(''));

    that.yAxis = d3.axisLeft(that.y)
      .tickSize(that.width);
      
    // Setup line
    that.line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(function(d){ return that.x(+d.key); })
      .y(function(d){ return that.y(d.value); });

    // Setup area
    if (that.isArea) {
      that.area = d3.area()
        .curve(d3.curveCatmullRom)
        .x(function(d){ return that.x(+d.key); })
        .y0(that.height)
        .y1(function(d){ return that.y(d.value); });
    }
    
    // Create svg
    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)

    that.container = that.svg.append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');
  };

  // Load CSV data
  that.loadData = function(_source) {
    d3.csv(_source, function(error, _data) {
      that.setData(_data);
    });

    return that;
  };

  // Set data
  that.setData = function(_data) {

    that.years = that.getYears(_data);

    data = that.dataParser(_data);

    that.updateData();
    that.setGraph();

    return that;
  };

  that.updateData = function() {

    // Filter data (that.dataFilter function must be defined outside)
    currentData = (that.dataFilter) ? data.filter(that.dataFilter) : data;

    // Sort data (that.dataSort function must be defined outside)
    if (that.dataSort) {
      currentData = currentData.sort(that.dataSort);
    }

    return that;
  };

  that.update = function() {
    that.updateData();
    that.updateGraph();

    return that;
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
          //console.log('No hay datos de para', d.name, 'en ', year);
        }
        delete d[year];
      });
    });
    return _data;
  };

  that.setGraph = function() {

    // Set scales domain
    that.x.domain( that.getScaleXDomain() );
    that.y.domain( that.getScaleYDomain() );

    // Draw axis
    that.container.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(that.xAxis);

    that.container.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + that.width + ', 0)')
      .call(that.yAxis);

    // Draw lines & labels
    drawMarkers();
    drawLines();
    drawLabels();

    return that;
  };

  that.updateGraph = function() {
    that.svg.select('.lines').remove();
    drawMarkers();
    drawLines();
    drawLabels();

    return that;
  };

  that.onResize = function() {

    that.getDimensions();
    updateGraphDimensions();

    return that;
  };

  that.addMarker = function(marker) {
    that.markers.push({
      value: marker.value,
      label: marker.label || '',
      orientation: marker.orientation || 'horizontal',
      align: marker.align || 'right'
    });
  };

  that.getScaleXDomain = function(){
    return [that.years[0], that.years[that.years.length-1]];
  };

  that.getScaleYDomain = function(){
    return [0, d3.max(currentData, function(d){ return d3.max(d3.values(d.values)); })];
  };

  that.getDimensions = function(){

    that.widthCont = that.$el.width();
    that.heightCont = that.widthCont * that.aspectRatio;

    that.width = that.widthCont - that.margin.left - that.margin.right;
    that.height = that.heightCont - that.margin.top - that.margin.bottom;
  };

  var updateGraphDimensions = function() {

    // Setup scales
    that.x.range([0, that.width]);
    that.y .range([that.height, 0]);
    that.yAxis.tickSize(that.width);

    // Setup axis
    that.container.selectAll('.axis.x')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(that.xAxis);

    that.container.selectAll('.axis.y')
      .attr('transform', 'translate(' + that.width + ', 0)')
      .call(that.yAxis);

    // Setup graph
    that.svg
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);
    
    that.container.selectAll('.line')
      .attr('d', that.line);

    that.container.selectAll('.area')
      .attr('d', that.area);

    that.container.selectAll('.line-label')
      .call(setLabel);

    updateMarker();
  };

  var drawMarkers = function() {
    // Draw marker line
    that.container.selectAll('.marker')
      .data(that.markers)
    .enter().append('line')
      .attr('class', 'marker')
      .call(setupMarkerLine);
      
    // Draw marker label
    that.container.selectAll('.marker-label')
      .data(that.markers)
    .enter().append('text')
      .attr('class', 'marker-label')
      .style('text-anchor', function(d){ return (d.orientation === 'vertical') ? 'middle' : (d.alignment === 'right') ? 'end' : 'start'; })
      .text( function(d){ return d.label; })
      .call(setupMarkerLabel);
  };

  var drawLines = function() {
    // Draw lines
    that.container.append('g')
      .attr('class', 'lines')
    .selectAll('.line')
      .data(currentData)
    .enter().append('path')
      .attr('class', function(d){ return (that.activeLines.indexOf(d.code) === -1) ? 'line' : 'line active'; })
      .attr('id', function(d){ return 'line-'+d.code; }) 
      .datum(function(d){ return d3.entries(d.values); })
      .attr('d', that.line);

    // Draw area
    if (that.isArea) {
      that.container.append('g')
      .attr('class', 'ares')
      .selectAll('.area')
        .data(currentData)
      .enter().append('path')
        .attr('class', function(d){ return (that.activeLines.indexOf(d.code) === -1) ? 'area' : 'area active'; })
        .attr('id', function(d){ return 'area-'+d.code; })
        .datum(function(d){ return d3.entries(d.values); })
        .attr('d', that.area);
    }
  };

  var drawLabels = function() {
    that.container.selectAll('.line-label')
      .data(currentData)
    .enter().append('text')
      .attr('class', 'line-label')
      .attr('id', function(d){ return 'line-label-'+d.code; })
      .attr('text-anchor', 'end')
      .attr('dy', '-0.125em')
      .text(function(d){ return d.name; })
      .call(setLabel);
  };

  var updateMarker = function(marker) {
    // Update marker line
    that.container.select('.marker')
      .call(setupMarkerLine);
    // Update marker label
    that.container.select('.marker-label')
      .call(setupMarkerLabel);
  };

  var setupMarkerLine = function(element){
    element
      .attr("x1", function(d){ return (d.orientation === 'horizontal') ? 0 : that.x(d.value); })
      .attr("y1", function(d){ return (d.orientation === 'horizontal') ? that.y(d.value) : 0; })
      .attr("x2", function(d){ return (d.orientation === 'horizontal') ? that.width : that.x(d.value); })
      .attr("y2", function(d){ return (d.orientation === 'horizontal') ? that.y(d.value) : that.height; });
  };

  var setupMarkerLabel = function(element){
    element
      .attr('x', function(d){ return (d.orientation === 'vertical') ? that.x(d.value) : (d.alignment === 'right') ? that.width : 0; })
      .attr('y', function(d){ return (d.orientation === 'horizontal') ? that.y(d.value) : that.height; });
  };

  var setLabel = function(selection) {
    selection
      .attr('x', that.width)
      .attr('y', function(d){ return that.y(d.values['2015']); });
  };

  return that;
};