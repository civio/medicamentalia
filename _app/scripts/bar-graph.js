var BarGraph = function( _id, _source ) {

  var $ = jQuery.noConflict();

  var that = this;

  that.id      = _id;
  that.source  = _source;

  that.margin = {top: 0, right: 0, bottom: 20, left: 0};
  that.aspectRatio = 0.5625;
  that.markerValue = null;

  // Public Methods

  that.init = function() {

    console.log('Bar Graph init', that.id, that.source);

    that.$el  = $('#'+that.id);
    that.lang = that.$el.data('lang');

    that.getDimensions();

    that.x = d3.scaleBand()
      .range([0, that.width])
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    that.y = d3.scaleLinear()
      .range([that.height, 0]);

    that.svg = d3.select('#'+that.id).append('svg')
      .attr('id', that.id+'-svg')
      .attr('width', that.widthCont)
      .attr('height', that.heightCont)
    .append('g')
      .attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')');

    // Load CSV
    d3.csv( that.source, function(error, data) {

      data.forEach(function(d) {
        d.value = +d.value;
      });

      that.x.domain(data.map(function(d) { return d.label; }));
      that.y.domain([0, d3.max(data, function(d) { return d.value; })]);

      that.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + that.height + ')')
        .call(d3.axisBottom(that.x));

      if (that.markerValue) {

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

      that.svg.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('id', function(d) { return d.label; })
        .attr('x', function(d) { return that.x(d.label); })
        .attr('y', function(d) { return that.y(d.value); } )
        .attr('height', function(d) { return that.height - that.y(d.value); })
        .attr('width', that.x.bandwidth());

      that.svg.selectAll('.bar-label')
        .data(data)
      .enter().append('text')
        .attr('class', 'bar-label')
        .attr('id', function(d) { return d.label; })
        .attr('x', function(d) { return that.x(d.label)+(that.x.bandwidth()*0.5); })
        .attr('y', function(d) { return that.y(d.value); })
        .attr('dy', '1.5em')
        .text( function(d){ return parseInt(d.value); });

       // d3.selectAll('.bar')
       //  .transition().duration(800).delay( function(d,i){ return 100*i; })
       //  .attr('id', function(d) { return d.label; })
       //  .attr('y', function(d) { return that.y(d.value); })
       //  .attr('height', function(d) { return height - that.y(d.value); });

      // d3.select('.marker')
      //   .transition().duration(600).delay(1500)
      //   .attr('x2', width );
    });

    return that;
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

    if (that.markerValue) {

      that.svg.select('.marker-label text')
        .attr('x', that.width )
        .attr('y', function(d) { return that.y(that.markerValue); });

      that.svg.select('.marker')
        .attr("y1", function(d) { return that.y(that.markerValue); })
        .attr("y2", function(d) { return that.y(that.markerValue); })
        .attr('x2', that.width );
    }
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

  return that;
};