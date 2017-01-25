var BarGraph = function( _id, _source ) {

  var $ = jQuery.noConflict();

  var that = this;

  that.id      = _id;
  that.source  = _source;

  that.margin      = {top: 0, right: 0, bottom: 20, left: 0};
  that.aspectRatio = 0.5625;
  that.markers     = [];

  // Public Methods

  that.init = function() {

    console.log('Bar Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    that.x = d3.scaleBand()
      .range([0, that.width])
      //.round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);

    that.container = that.svg.append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');

    // Load CSV
    if (that.source) {
      d3.csv( that.source, that.onDataReady);
    }

    return that;
  };

  that.onDataReady = function(error, data) {

    data.forEach(function(d) {
      d.value = +d.value;
    });

    that.x.domain(data.map(function(d) { return d.label; }));
    that.y.domain([0, d3.max(data, function(d) { return d.value; })]);

    that.container.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(d3.axisBottom(that.x));

    drawMarkers();
    drawBars(data);
    drawLabels(data);
  };

  that.onResize = function() {

    that.getDimensions();
    that.updateData();

    return that;
  };

  that.updateData = function(){

    that.svg
      .attr('width', that.widthCont)
      .attr('height', that.heightCont);

    that.x.range([0, that.width]);
    that.y.range([that.height, 0]);

    that.container.select('g.x.axis')
      .attr('transform', 'translate(0,' + that.height + ')')
      .call(d3.axisBottom(that.x));

    that.container.selectAll('.bar')
      .attr('x', function(d) { return that.x(d.label); })
      .attr('y', function(d) { return that.y(d.value); })
      .attr('width', that.x.bandwidth())
      .attr('height', function(d) { return that.height - that.y(d.value); });

    that.container.selectAll('.bar-label')
      .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
      .attr('y', function(d) { return that.y(d.value); });

    // Update each marker register with addMarker
    that.markers.forEach(updateMarker);
  };

  that.addMarker = function(marker) {
    that.markers.push({
      value: marker.value,
      label: marker.label || '',
      orientation: marker.orientation || 'horizontal',
      align: marker.align || 'right'
    });
  };

  that.getDimensions = function(){

    that.widthCont = that.$el.width();
    that.heightCont = that.widthCont * that.aspectRatio;

    that.width = that.widthCont - that.margin.left - that.margin.right;
    that.height = that.heightCont - that.margin.top - that.margin.bottom;
  };

  // that.updateBar = function(selection){
  //   selection
  //     .attr('x', function(d) { return that.x(d.label); })
  //     .attr('y', function(d) { return that.y(d.value); })
  //     .attr('width', that.x.bandwidth())
  //     .attr('height', function(d) { return height - that.y(d.value); });

  //   return that;
  // };

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
    .enter().append('g')
      .attr('class', 'marker-label')
      .append('text')
      .style('text-anchor', function(d){ return (d.orientation === 'vertical') ? 'middle' : (d.alignment === 'right') ? 'end' : 'start'; })
      .text( function(d){ return d.label; })
      .call(setupMarkerLabel);
  };

  var drawBars = function(data) {
    that.container.selectAll('.bar')
      .data(data)
    .enter().append('rect')
      .attr('class', function(d) { return (d.active) ? 'bar active' : 'bar'; })
      .attr('id', function(d) { return d.label; })
      .attr('x', function(d) { return that.x(d.label); })
      .attr('y', function(d) { return that.y(d.value); } )
      .attr('height', function(d) { return that.height - that.y(d.value); })
      .attr('width', that.x.bandwidth());
  };

  var drawLabels = function(data) {
    that.container.selectAll('.bar-label')
      .data(data)
    .enter().append('text')
      .attr('class', 'bar-label')
      .attr('id', function(d) { return d.label; })
      .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
      .attr('y', function(d) { return that.y(d.value); })
      .attr('dy', '1.5em')
      .text( function(d){ return parseInt(d.value); });
  };

  var updateMarker = function(marker) {
    // Update marker line
    that.container.select('.marker')
      .call(setupMarkerLine);
    // Update marker label
    that.container.select('.marker-label text')
      .call(setupMarkerLabel);
  };

  var setupMarkerLine = function(element){
    element
      .attr("x1", function(d){ return (d.orientation === 'horizontal') ? that.x(d.value) : 0; })
      .attr("y1", function(d){ return (d.orientation === 'horizontal') ? 0 : that.y(d.value); })
      .attr("x2", function(d){ return (d.orientation === 'horizontal') ? that.x(d.value) : that.width; })
      .attr("y2", function(d){ return (d.orientation === 'horizontal') ? that.height : that.y(d.value); });
  };

  var setupMarkerLabel = function(element){
    element
      .attr('x', function(d){ return (d.orientation === 'horizontal') ? that.x(d.value) : that.width ; })
      .attr('y', function(d){ return (d.orientation === 'horizontal') ? that.height : that.y(d.value); });
  };

  return that;
};