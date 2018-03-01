(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.BaseGraph = (function() {
    var markerDefault, optionsDefault;

    optionsDefault = {
      margin: {
        top: 0,
        right: 0,
        bottom: 20,
        left: 0
      },
      aspectRatio: 0.5625,
      label: false,
      legend: false,
      mouseEvents: true,
      key: {
        id: 'key',
        x: 'key',
        y: 'value'
      }
    };

    markerDefault = {
      value: null,
      label: '',
      orientation: 'horizontal',
      align: 'right'
    };

    function BaseGraph(id, options) {
      this.setYAxisPosition = bind(this.setYAxisPosition, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.onResize = bind(this.onResize, this);
      this.setupMarkerLabel = bind(this.setupMarkerLabel, this);
      this.setupMarkerLine = bind(this.setupMarkerLine, this);
      this.id = id;
      this.options = $.extend(true, {}, optionsDefault, options);
      this.$el = $('#' + this.id);
      this.getDimensions();
      this.setSVG();
      this.setScales();
      this.markers = [];
      return this;
    }

    BaseGraph.prototype.setSVG = function() {
      this.svg = d3.select('#' + this.id).append('svg').attr('width', this.containerWidth).attr('height', this.containerHeight);
      return this.container = this.svg.append('g').attr('transform', 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')');
    };

    BaseGraph.prototype.loadData = function(url) {
      d3.csv(url, (function(_this) {
        return function(error, data) {
          _this.$el.trigger('data-loaded');
          return _this.setData(data);
        };
      })(this));
      return this;
    };

    BaseGraph.prototype.setData = function(data) {
      this.data = this.dataParser(data);
      this.drawScales();
      if (this.options.legend) {
        this.drawLegend();
      }
      this.drawMarkers();
      this.drawGraph();
      this.$el.trigger('draw-complete');
      return this;
    };

    BaseGraph.prototype.dataParser = function(data) {
      return data;
    };

    BaseGraph.prototype.setGraph = function() {
      return this;
    };

    BaseGraph.prototype.setScales = function() {
      return this;
    };

    BaseGraph.prototype.drawScales = function() {
      this.x.domain(this.getScaleXDomain());
      this.y.domain(this.getScaleYDomain());
      if (this.xAxis) {
        this.container.append('g').attr('class', 'x axis').call(this.setXAxisPosition).call(this.xAxis);
      }
      if (this.yAxis) {
        this.container.append('g').attr('class', 'y axis').call(this.setYAxisPosition).call(this.yAxis);
      }
      return this;
    };

    BaseGraph.prototype.getScaleXRange = function() {
      return [0, this.width];
    };

    BaseGraph.prototype.getScaleYRange = function() {
      return [this.height, 0];
    };

    BaseGraph.prototype.getScaleXDomain = function() {
      return [];
    };

    BaseGraph.prototype.getScaleYDomain = function() {
      return [];
    };

    BaseGraph.prototype.drawLegend = function() {
      return this;
    };

    BaseGraph.prototype.addMarker = function(marker) {
      this.markers.push($.extend({}, markerDefault, marker));
      return this;
    };

    BaseGraph.prototype.drawMarkers = function() {
      this.container.selectAll('.marker').data(this.markers).enter().append('line').attr('class', 'marker').call(this.setupMarkerLine);
      return this.container.selectAll('.marker-label').data(this.markers).enter().append('text').attr('class', 'marker-label').attr('text-anchor', function(d) {
        if (d.orientation === 'vertical') {
          return 'middle';
        } else if (d.align === 'right') {
          return 'end';
        } else {
          return 'start';
        }
      }).attr('dy', function(d) {
        if (d.orientation === 'horizontal') {
          return '-0.25em';
        } else {
          return 0;
        }
      }).text(function(d) {
        return d.label;
      }).call(this.setupMarkerLabel);
    };

    BaseGraph.prototype.setupMarkerLine = function(element) {
      return element.attr('x1', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            return 0;
          } else {
            return _this.x(d.value);
          }
        };
      })(this)).attr('y1', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            return _this.y(d.value);
          } else {
            return 0;
          }
        };
      })(this)).attr('x2', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            return _this.width;
          } else {
            return _this.x(d.value);
          }
        };
      })(this)).attr('y2', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            return _this.y(d.value);
          } else {
            return _this.height;
          }
        };
      })(this));
    };

    BaseGraph.prototype.setupMarkerLabel = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            if (d.align === 'right') {
              return _this.width;
            } else {
              return 0;
            }
          } else {
            return _this.x(d.value);
          }
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          if (d.orientation === 'horizontal') {
            return _this.y(d.value);
          } else {
            return _this.height;
          }
        };
      })(this));
    };

    BaseGraph.prototype.onResize = function() {
      this.getDimensions();
      this.updateGraphDimensions();
      return this;
    };

    BaseGraph.prototype.getDimensions = function() {
      if (this.$el) {
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    BaseGraph.prototype.updateGraphDimensions = function() {
      if (this.svg) {
        this.svg.attr('width', this.containerWidth).attr('height', this.containerHeight);
      }
      if (this.x) {
        this.x.range(this.getScaleXRange());
      }
      if (this.y) {
        this.y.range(this.getScaleYRange());
      }
      if (this.xAxis) {
        this.container.selectAll('.x.axis').call(this.setXAxisPosition).call(this.xAxis);
      }
      if (this.yAxis) {
        this.container.selectAll('.y.axis').call(this.setYAxisPosition).call(this.yAxis);
      }
      this.container.select('.marker').call(this.setupMarkerLine);
      this.container.select('.marker-label').call(this.setupMarkerLabel);
      return this;
    };

    BaseGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(0,' + this.height + ')');
    };

    BaseGraph.prototype.setYAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(' + this.width + ',0)');
    };

    BaseGraph.prototype.getDataX = function() {
      return d[this.options.key.x];
    };

    BaseGraph.prototype.getDataY = function() {
      return d[this.options.key.y];
    };

    return BaseGraph;

  })();

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ScrollGraph = (function() {
    function ScrollGraph(_id, _stepCallback) {
      this.onStepEnter = bind(this.onStepEnter, this);
      this.onContainerExit = bind(this.onContainerExit, this);
      this.onContainerEnter = bind(this.onContainerEnter, this);
      this.onResize = bind(this.onResize, this);
      this.id = _id;
      this.stepCallback = _stepCallback;
      this.container = d3.select('#' + this.id);
      this.graphic = this.container.select('.scroll-graphic');
      this.steps = this.container.selectAll('.scroll-text .step');
      this.chart = this.graphic.select('.graph-container');
      this.scroller = scrollama();
      this.onResize();
      this.scroller.setup({
        container: '#' + this.id,
        graphic: '#' + this.id + ' .scroll-graphic',
        step: '#' + this.id + ' .scroll-text .step',
        offset: 0.05,
        debug: false
      }).onContainerEnter(this.onContainerEnter).onContainerExit(this.onContainerExit).onStepEnter(this.onStepEnter);
      window.addEventListener('resize', this.onResize);
      return this;
    }

    ScrollGraph.prototype.onResize = function() {
      var height, width;
      width = this.graphic.node().getBoundingClientRect().width;
      height = Math.floor(window.innerHeight);
      this.steps.style('height', height + 'px');
      this.graphic.style('height', height + 'px');
      this.chart.style('width', width + 'px').style('height', height + 'px');
      return this.scroller.resize();
    };

    ScrollGraph.prototype.onContainerEnter = function(e) {
      return this.graphic.classed('is-fixed', true).classed('is-bottom', false);
    };

    ScrollGraph.prototype.onContainerExit = function(e) {
      return this.graphic.classed('is-fixed', false).classed('is-bottom', e.direction === 'down');
    };

    ScrollGraph.prototype.onStepEnter = function(e) {
      return this.stepCallback(e);
    };

    return ScrollGraph;

  })();

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.MapGraph = (function(superClass) {
    extend(MapGraph, superClass);

    function MapGraph(id, options) {
      this.setTooltipData = bind(this.setTooltipData, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.getLegendFormat = bind(this.getLegendFormat, this);
      this.getLegendData = bind(this.getLegendData, this);
      this.setLegendPosition = bind(this.setLegendPosition, this);
      this.setCountryColor = bind(this.setCountryColor, this);
      MapGraph.__super__.constructor.call(this, id, options);
      this.formatFloat = d3.format(',.1f');
      this.formatInteger = d3.format(',d');
      return this;
    }

    MapGraph.prototype.setSVG = function() {
      MapGraph.__super__.setSVG.call(this);
      return this.$tooltip = this.$el.find('.tooltip');
    };

    MapGraph.prototype.setScales = function() {
      this.color = d3.scaleSequential(d3.interpolateOranges);
      return this;
    };

    MapGraph.prototype.loadData = function(url_data, url_map) {
      d3.queue().defer(d3.csv, url_data).defer(d3.json, url_map).await((function(_this) {
        return function(error, data, map) {
          _this.$el.trigger('data-loaded');
          return _this.setData(data, map);
        };
      })(this));
      return this;
    };

    MapGraph.prototype.setData = function(data, map) {
      this.data = this.dataParser(data);
      this.setColorDomain();
      if (this.options.legend) {
        this.drawLegend();
      }
      this.drawGraph(map);
      return this;
    };

    MapGraph.prototype.setColorDomain = function() {
      this.color.domain([
        0, d3.max(this.data, function(d) {
          return d.value;
        })
      ]);
      return this;
    };

    MapGraph.prototype.drawLegend = function() {
      var legenItemWidth, legendData;
      legenItemWidth = 30;
      legendData = this.getLegendData();
      this.legend = this.container.append('g').attr('class', 'legend').call(this.setLegendPosition);
      this.legend.selectAll('rect').data(legendData).enter().append('rect').attr('x', function(d, i) {
        return Math.round(legenItemWidth * (i - (legendData.length / 2)));
      }).attr('width', legenItemWidth).attr('height', 8).attr('fill', (function(_this) {
        return function(d) {
          return _this.color(d);
        };
      })(this));
      legendData.shift();
      return this.legend.selectAll('text').data(legendData).enter().append('text').attr('x', function(d, i) {
        return Math.round(legenItemWidth * (i + 0.5 - (legendData.length / 2)));
      }).attr('y', 20).attr('text-anchor', 'start').text(this.getLegendFormat);
    };

    MapGraph.prototype.drawGraph = function(map) {
      this.countries = topojson.feature(map, map.objects.countries);
      this.countries.features = this.countries.features.filter(function(d) {
        return d.id !== '010';
      });
      this.projection = d3.geoKavrayskiy7();
      this.projectionSetSize();
      this.path = d3.geoPath().projection(this.projection);
      this.container.selectAll('.country').data(this.countries.features).enter().append('path').attr('id', function(d) {
        return 'country-' + d.id;
      }).attr('class', function(d) {
        return 'country';
      }).attr('fill', this.setCountryColor).attr('stroke-width', 1).attr('stroke', this.setCountryColor).attr('d', this.path);
      if (this.$tooltip) {
        this.container.selectAll('.country').on('mouseover', this.onMouseOver).on('mousemove', this.onMouseMove).on('mouseout', this.onMouseOut);
      }
      this.$el.trigger('draw-complete');
      return this;
    };

    MapGraph.prototype.updateGraph = function(data) {
      this.data = this.dataParser(data);
      this.setColorDomain();
      return this.container.selectAll('.country').transition().attr('fill', this.setCountryColor).attr('stroke', this.setCountryColor);
    };

    MapGraph.prototype.updateGraphDimensions = function() {
      MapGraph.__super__.updateGraphDimensions.call(this);
      this.projectionSetSize();
      this.path.projection(this.projection);
      this.container.selectAll('.country').attr('d', this.path);
      if (this.options.legend) {
        this.legend.call(this.setLegendPosition);
      }
      return this;
    };

    MapGraph.prototype.projectionSetSize = function() {
      return this.projection.fitSize([this.width, this.height], this.countries).scale(this.projection.scale() * 1.1).translate([this.width * 0.48, this.height * 0.6]);
    };

    MapGraph.prototype.setCountryColor = function(d) {
      var value;
      value = this.data.filter(function(e) {
        return e.code_num === d.id;
      });
      if (value[0]) {
        return this.color(value[0].value);
      } else {
        return '#eee';
      }
    };

    MapGraph.prototype.setLegendPosition = function(element) {
      return element.attr('transform', 'translate(' + Math.round(this.width * 0.5) + ',' + (-this.options.margin.top) + ')');
    };

    MapGraph.prototype.getLegendData = function() {
      return d3.range(0, this.color.domain()[1]);
    };

    MapGraph.prototype.getLegendFormat = function(d) {
      return d;
    };

    MapGraph.prototype.onMouseOver = function(d) {
      var offset, position, value;
      value = this.data.filter(function(e) {
        return e.code_num === d.id;
      });
      if (value.length > 0) {
        position = d3.mouse(d3.event.target);
        this.setTooltipData(value[0]);
        offset = $(d3.event.target).offset();
        return this.$tooltip.css({
          'left': position[0] - (this.$tooltip.width() * 0.5),
          'top': position[1] - (this.$tooltip.height() * 0.5),
          'opacity': '1'
        });
      }
    };

    MapGraph.prototype.onMouseMove = function(d) {
      var position;
      position = d3.mouse(d3.event.target);
      return this.$tooltip.css({
        'left': position[0] - (this.$tooltip.width() * 0.5),
        'top': position[1] - (this.$tooltip.height() * 0.5)
      });
    };

    MapGraph.prototype.onMouseOut = function(d) {
      return this.$tooltip.css('opacity', '0');
    };

    MapGraph.prototype.setTooltipData = function(d) {
      this.$tooltip.find('.tooltip-inner .title').html(d.name);
      this.$tooltip.find('.tooltip-inner .value').html(this.formatFloat(d.value));
      if (d.cases) {
        return this.$tooltip.find('.tooltip-inner .cases').html(this.formatInteger(d.cases));
      }
    };

    return MapGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.LineGraph = (function(superClass) {
    extend(LineGraph, superClass);

    LineGraph.prototype.yFormat = d3.format('d');

    function LineGraph(id, options) {
      this.setTickHoverPosition = bind(this.setTickHoverPosition, this);
      this.setLineLabelHoverPosition = bind(this.setLineLabelHoverPosition, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.setOverlayDimensions = bind(this.setOverlayDimensions, this);
      this.setLabelDimensions = bind(this.setLabelDimensions, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      LineGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    LineGraph.prototype.setData = function(data) {
      this.years = this.getYears(data);
      LineGraph.__super__.setData.call(this, data);
      return this;
    };

    LineGraph.prototype.getYears = function(data) {
      var years;
      years = [];
      d3.keys(data[0]).forEach(function(d) {
        if (+d) {
          return years.push(+d);
        }
      });
      return years.sort();
    };

    LineGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          d.values = {};
          return _this.years.forEach(function(year) {
            if (d[year]) {
              d.values[year] = +d[year];
            }
            return delete d[year];
          });
        };
      })(this));
      return data;
    };

    LineGraph.prototype.setScales = function() {
      this.x = d3.scaleLinear().range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      this.xAxis = d3.axisBottom(this.x).tickFormat(d3.format(''));
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width);
      this.line = d3.line().curve(d3.curveCatmullRom).x((function(_this) {
        return function(d) {
          return _this.x(+d.key);
        };
      })(this)).y((function(_this) {
        return function(d) {
          return _this.y(d.value);
        };
      })(this));
      if (this.options.isArea) {
        this.area = d3.area().curve(d3.curveCatmullRom).x((function(_this) {
          return function(d) {
            return _this.x(+d.key);
          };
        })(this)).y0(this.height).y1((function(_this) {
          return function(d) {
            return _this.y(d.value);
          };
        })(this));
      }
      return this;
    };

    LineGraph.prototype.getScaleXDomain = function() {
      return [this.years[0], this.years[this.years.length - 1]];
    };

    LineGraph.prototype.getScaleYDomain = function() {
      return [
        0, d3.max(this.data, function(d) {
          return d3.max(d3.values(d.values));
        })
      ];
    };

    LineGraph.prototype.drawGraph = function() {
      this.container.select('.graph').remove();
      this.graph = this.container.append('g').attr('class', 'graph');
      this.drawLines();
      if (this.options.isArea) {
        this.drawAreas();
      }
      if (this.options.label) {
        this.drawLabels();
      }
      if (this.options.mouseEvents) {
        this.drawLineLabelHover();
        this.drawRectOverlay();
      }
      return this;
    };

    LineGraph.prototype.updateGraphDimensions = function() {
      LineGraph.__super__.updateGraphDimensions.call(this);
      if (this.options.isArea) {
        this.area.y0(this.height);
      }
      this.yAxis.tickSize(this.width);
      this.container.selectAll('.line').attr('d', this.line);
      if (this.options.isArea) {
        this.container.selectAll('.area').attr('d', this.area);
      }
      if (this.options.label) {
        this.container.selectAll('.line-label').call(this.setLabelDimensions);
      }
      if (this.options.mouseEvents) {
        this.container.select('.overlay').call(this.setOverlayDimensions);
        this.container.select('.tick-hover').call(this.setTickHoverPosition);
      }
      return this;
    };

    LineGraph.prototype.drawLines = function() {
      return this.graph.selectAll('.line').data(this.data).enter().append('path').attr('class', 'line').attr('id', (function(_this) {
        return function(d) {
          return 'line-' + d[_this.options.key.id];
        };
      })(this)).datum(function(d) {
        return d3.entries(d.values);
      }).attr('d', this.line);
    };

    LineGraph.prototype.drawAreas = function() {
      return this.graph.selectAll('.area').data(this.data).enter().append('path').attr('class', 'area').attr('id', (function(_this) {
        return function(d) {
          return 'area-' + d[_this.options.key.id];
        };
      })(this)).datum(function(d) {
        return d3.entries(d.values);
      }).attr('d', this.area);
    };

    LineGraph.prototype.drawLabels = function() {
      return this.graph.selectAll('.line-label').data(this.data).enter().append('text').attr('class', 'line-label').attr('id', (function(_this) {
        return function(d) {
          return 'line-label-' + d[_this.options.key.id];
        };
      })(this)).attr('text-anchor', 'end').attr('dy', '-0.125em').text((function(_this) {
        return function(d) {
          return d[_this.options.key.x];
        };
      })(this)).call(this.setLabelDimensions);
    };

    LineGraph.prototype.drawLineLabelHover = function() {
      this.container.selectAll('.line-label-point').data(this.data).enter().append('circle').attr('id', (function(_this) {
        return function(d) {
          return 'line-label-point-' + d[_this.options.key.id];
        };
      })(this)).attr('class', 'line-label-point').attr('r', 4).style('display', 'none');
      this.container.append('text').attr('class', 'tick-hover').attr('dy', '0.71em').style('display', 'none').call(this.setTickHoverPosition);
      if (this.data.length === 1) {
        return this.container.append('text').attr('class', 'line-label-hover').attr('text-anchor', 'middle').attr('dy', '-0.5em').style('display', 'none');
      }
    };

    LineGraph.prototype.drawRectOverlay = function() {
      return this.container.append('rect').attr('class', 'overlay').call(this.setOverlayDimensions).on('mouseover', this.onMouseMove).on('mouseout', this.onMouseOut).on('mousemove', this.onMouseMove);
    };

    LineGraph.prototype.setLabelDimensions = function(element) {
      return element.attr('x', this.width).attr('y', (function(_this) {
        return function(d) {
          return _this.y(d.values[_this.years[_this.years.length - 1]]);
        };
      })(this));
    };

    LineGraph.prototype.setOverlayDimensions = function(element) {
      return element.attr('width', this.width).attr('height', this.height);
    };

    LineGraph.prototype.onMouseOut = function(d) {
      this.$el.trigger('mouseout');
      return this.hideLabel();
    };

    LineGraph.prototype.onMouseMove = function(d) {
      var position, year;
      position = d3.mouse(d3.event.target);
      year = Math.round(this.x.invert(position[0]));
      if (year !== this.currentYear) {
        this.$el.trigger('change-year', year);
        return this.setLabel(year);
      }
    };

    LineGraph.prototype.setLabel = function(year) {
      this.currentYear = year;
      this.container.select('.x.axis').selectAll('.tick').style('display', 'none');
      this.container.selectAll('.line-label-point').each((function(_this) {
        return function(d) {
          return _this.setLineLabelHoverPosition(d);
        };
      })(this));
      return this.container.select('.tick-hover').style('display', 'block').attr('x', Math.round(this.x(this.currentYear))).text(this.currentYear);
    };

    LineGraph.prototype.hideLabel = function() {
      this.container.selectAll('.line-label-point').style('display', 'none');
      this.container.selectAll('.line-label-hover').style('display', 'none');
      this.container.select('.x.axis').selectAll('.tick').style('display', 'block');
      return this.container.select('.tick-hover').style('display', 'none');
    };

    LineGraph.prototype.setLineLabelHoverPosition = function(data) {
      var label, point, year;
      year = this.currentYear;
      while (this.years.indexOf(year) === -1 && this.currentYear > this.years[0]) {
        year--;
      }
      this.currentYear = year;
      point = d3.select('#line-label-point-' + data[this.options.key.id]);
      label = this.container.selectAll('.line-label-hover');
      if (!data.values[year]) {
        point.style('display', 'none');
        label.style('display', 'none');
        return;
      }
      point.style('display', 'block');
      label.style('display', 'block');
      point.attr('cx', (function(_this) {
        return function(d) {
          return _this.x(year);
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          if (data.values[year]) {
            return _this.y(data.values[year]);
          } else {
            return 0;
          }
        };
      })(this));
      return label.attr('x', (function(_this) {
        return function(d) {
          return _this.x(year);
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          if (data.values[year]) {
            return _this.y(data.values[year]);
          } else {
            return 0;
          }
        };
      })(this)).text((function(_this) {
        return function(d) {
          if (data.values[year]) {
            return _this.yFormat(data.values[year]);
          } else {
            return '';
          }
        };
      })(this));
    };

    LineGraph.prototype.setTickHoverPosition = function(element) {
      return element.attr('y', Math.round(this.height + this.options.margin.top + 9));
    };

    return LineGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseMapGraph = (function(superClass) {
    extend(ContraceptivesUseMapGraph, superClass);

    function ContraceptivesUseMapGraph() {
      this.onResize = bind(this.onResize, this);
      this.getLegendFormat = bind(this.getLegendFormat, this);
      return ContraceptivesUseMapGraph.__super__.constructor.apply(this, arguments);
    }

    ContraceptivesUseMapGraph.prototype.currentState = 0;

    ContraceptivesUseMapGraph.prototype.states = [
      {
        id: 'Female sterilization',
        text: {
          es: 'esterilización femenina',
          en: 'female sterilization'
        },
        labels: [
          {
            cx_factor: 0.7,
            cy_factor: 0.48,
            r: 0,
            textOffset: [-20, 30],
            label: {
              es: 'India',
              en: 'India'
            }
          }, {
            cx_factor: 0.27,
            cy_factor: 0.465,
            r: 0,
            textOffset: [20, -5],
            label: {
              es: 'República Dominicana',
              en: 'Dominican Republic'
            }
          }
        ]
      }, {
        id: 'Male sterilization',
        text: {
          es: 'esterilización masculina',
          en: 'male sterilization'
        },
        labels: [
          {
            cx_factor: 0.265,
            cy_factor: 0.28,
            r: 0,
            textOffset: [30, 25],
            label: {
              es: 'Canadá',
              en: 'Canada'
            }
          }
        ]
      }, {
        id: 'IUD',
        text: {
          es: 'DIU',
          en: 'IUD'
        },
        labels: [
          {
            cx_factor: 0.85,
            cy_factor: 0.32,
            r: 0,
            textWidth: 80,
            textOffset: [12, 0],
            label: {
              es: 'Corea del Norte',
              en: 'North Korea'
            }
          }
        ]
      }, {
        id: 'IUD',
        text: {
          es: 'DIU',
          en: 'IUD'
        },
        labels: [
          {
            cx_factor: 0.84,
            cy_factor: 0.41,
            r: 0,
            textWidth: 80,
            textOffset: [12, 0],
            label: {
              es: 'China',
              en: 'China'
            }
          }
        ]
      }, {
        id: 'Pill',
        text: {
          es: 'píldora',
          en: 'pill'
        },
        labels: [
          {
            cx_factor: 0.464,
            cy_factor: 0.41,
            r: 0,
            textOffset: [-35, 0],
            label: {
              es: 'Argelia',
              en: 'Algeria'
            }
          }
        ]
      }, {
        id: 'Male condom',
        text: {
          es: 'preservativo masculino',
          en: 'male condom'
        },
        labels: [
          {
            cx_factor: 0.542,
            cy_factor: 0.335,
            r: 0,
            textOffset: [-12, 0],
            label: {
              es: 'Grecia',
              en: 'Greece'
            }
          }, {
            cx_factor: 0.564,
            cy_factor: 0.74,
            r: 0,
            textOffset: [15, -10],
            label: {
              es: 'Botsuana',
              en: 'Botswana'
            }
          }
        ]
      }, {
        id: 'Injectable',
        text: {
          es: 'inyectable',
          en: 'injectable'
        },
        labels: [
          {
            cx_factor: 0.62,
            cy_factor: 0.55,
            r: 0,
            textOffset: [15, 0],
            label: {
              es: 'Etiopía',
              en: 'Ethiopia'
            }
          }
        ]
      }, {
        id: 'Any traditional method',
        text: {
          es: 'métodos tradicionales',
          en: 'traditional methods'
        },
        labels: [
          {
            cx_factor: 0.536,
            cy_factor: 0.3,
            r: 16,
            textOffset: [-26, 0],
            label: {
              es: 'Balcanes',
              en: 'Balkans'
            }
          }
        ]
      }, {
        id: 'Any traditional method',
        text: {
          es: 'métodos tradicionales',
          en: 'traditional methods'
        },
        labels: [
          {
            cx_factor: 0.534,
            cy_factor: 0.31,
            r: 0,
            textOffset: [-10, 0],
            label: {
              es: 'Albania',
              en: 'Albania'
            }
          }
        ]
      }
    ];

    ContraceptivesUseMapGraph.prototype.getLegendData = function() {
      return [0, 20, 40, 60, 80];
    };

    ContraceptivesUseMapGraph.prototype.getLegendFormat = function(d) {
      return d + '%';
    };

    ContraceptivesUseMapGraph.prototype.getDimensions = function() {
      var bodyHeight, offset;
      offset = 100;
      if (this.$el) {
        bodyHeight = $('body').height() - offset;
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
        if (this.containerHeight > bodyHeight) {
          this.containerHeight = bodyHeight;
          this.containerWidth = this.containerHeight / this.options.aspectRatio;
        }
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    ContraceptivesUseMapGraph.prototype.onResize = function() {
      ContraceptivesUseMapGraph.__super__.onResize.call(this);
      return this.setAnnotations();
    };

    ContraceptivesUseMapGraph.prototype.setColorDomain = function() {
      this.color.domain([0, 80]);
      return this;
    };

    ContraceptivesUseMapGraph.prototype.drawGraph = function(map) {
      ContraceptivesUseMapGraph.__super__.drawGraph.call(this, map);
      this.ringNote = d3.ringNote();
      return this;
    };

    ContraceptivesUseMapGraph.prototype.setMapState = function(state) {
      if (state !== this.currentState) {
        this.currentState = state;
        this.currentMethod = this.states[this.currentState - 1];
        if (this.currentMethod) {
          $('#map-contraceptives-use-method').html(this.currentMethod.text[this.options.lang]);
          this.data.forEach((function(_this) {
            return function(d) {
              return d.value = +d[_this.currentMethod.id];
            };
          })(this));
          this.updateGraph(this.data);
          return this.setAnnotations();
        }
      }
    };

    ContraceptivesUseMapGraph.prototype.setAnnotations = function() {
      if (this.currentMethod) {
        this.currentMethod.labels.forEach((function(_this) {
          return function(d) {
            d.cx = d.cx_factor * _this.width;
            d.cy = d.cy_factor * _this.height;
            return d.text = d.label[_this.options.lang];
          };
        })(this));
        return this.container.call(this.ringNote, this.currentMethod.labels);
      }
    };

    return ContraceptivesUseMapGraph;

  })(window.MapGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.TreemapGraph = (function(superClass) {
    extend(TreemapGraph, superClass);

    function TreemapGraph(id, options) {
      this.isNodeLabelVisible = bind(this.isNodeLabelVisible, this);
      this.setNodeLabel = bind(this.setNodeLabel, this);
      this.setNodeDimensions = bind(this.setNodeDimensions, this);
      this.setNode = bind(this.setNode, this);
      options.minSize = options.minSize || 60;
      options.nodesPadding = options.nodesPadding || 8;
      options.transitionDuration = options.transitionDuration || 600;
      options.mobileBreakpoint = options.mobileBreakpoint || 620;
      TreemapGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    TreemapGraph.prototype.drawScales = function() {
      return this;
    };

    TreemapGraph.prototype.setSVG = function() {
      return this.container = d3.select('#' + this.id).append('div').attr('class', 'nodes-container').style('height', this.height + 'px');
    };

    TreemapGraph.prototype.drawGraph = function() {
      this.treemap = d3.treemap().size([this.width, this.height]).padding(0).round(true);
      if (this.width <= this.options.mobileBreakpoint) {
        this.treemap.tile(d3.treemapSlice);
      }
      this.stratify = d3.stratify().parentId(function(d) {
        return d.parent;
      });
      this.updateGraph();
      return this;
    };

    TreemapGraph.prototype.updateGraph = function() {
      var nodes;
      this.treemapRoot = this.stratify(this.data).sum((function(_this) {
        return function(d) {
          return d[_this.options.key.value];
        };
      })(this)).sort(function(a, b) {
        return b.value - a.value;
      });
      this.treemap(this.treemapRoot);
      nodes = this.container.selectAll('.node').data(this.treemapRoot.leaves());
      this.container.selectAll('.node-label').data(this.treemapRoot.leaves());
      nodes.enter().append('div').attr('class', 'node').append('div').attr('class', 'node-label').append('div').attr('class', 'node-label-content').append('p');
      this.container.selectAll('.node').call(this.setNode).call(this.setNodeDimensions);
      this.container.selectAll('.node-label').style('visibility', 'hidden').call(this.setNodeLabel).filter(this.isNodeLabelVisible).style('visibility', 'visible');
      nodes.exit().remove();
      return this;
    };

    TreemapGraph.prototype.getDimensions = function() {
      TreemapGraph.__super__.getDimensions.call(this);
      if (this.width <= this.options.mobileBreakpoint) {
        this.containerHeight = this.containerWidth;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    TreemapGraph.prototype.updateGraphDimensions = function() {
      TreemapGraph.__super__.updateGraphDimensions.call(this);
      this.container.style('height', this.height + 'px');
      if (this.width <= this.options.mobileBreakpoint) {
        this.treemap.tile(d3.treemapSlice);
      } else {
        this.treemap.tile(d3.treemapSquarify);
      }
      this.treemap.size([this.width, this.height]);
      this.treemap(this.treemapRoot);
      this.container.selectAll('.node').data(this.treemapRoot.leaves()).call(this.setNodeDimensions);
      this.container.selectAll('.node-label').style('visibility', 'hidden').filter(this.isNodeLabelVisible).style('visibility', 'visible');
      return this;
    };

    TreemapGraph.prototype.setNode = function(selection) {
      return selection.attr('class', this.getNodeClass).style('padding', (function(_this) {
        return function(d) {
          if (d.x1 - d.x0 > 2 * _this.options.nodesPadding && d.y1 - d.y0 > 2 * _this.options.nodesPadding) {
            return _this.options.nodesPadding + 'px';
          } else {
            return 0;
          }
        };
      })(this)).style('visibility', function(d) {
        if ((d.x1 - d.x0 === 0) || (d.y1 - d.y0 === 0)) {
          return 'hidden';
        } else {
          return '';
        }
      });
    };

    TreemapGraph.prototype.setNodeDimensions = function(selection) {
      return selection.style('left', function(d) {
        return d.x0 + 'px';
      }).style('top', function(d) {
        return d.y0 + 'px';
      }).style('width', function(d) {
        return d.x1 - d.x0 + 'px';
      }).style('height', function(d) {
        return d.y1 - d.y0 + 'px';
      });
    };

    TreemapGraph.prototype.setNodeLabel = function(selection) {
      return selection.select('p').attr('class', function(d) {
        if (d.value > 25) {
          return 'size-l';
        } else if (d.value < 10) {
          return 'size-s';
        } else {
          return '';
        }
      }).html((function(_this) {
        return function(d) {
          return d.data[_this.options.key.id];
        };
      })(this));
    };

    TreemapGraph.prototype.isNodeLabelVisible = function(d) {
      return d.x1 - d.x0 > this.options.minSize && d.y1 - d.y0 > this.options.minSize;
    };

    TreemapGraph.prototype.getNodeClass = function(d) {
      return 'node';
    };

    return TreemapGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseTreemapGraph = (function(superClass) {
    extend(ContraceptivesUseTreemapGraph, superClass);

    function ContraceptivesUseTreemapGraph() {
      return ContraceptivesUseTreemapGraph.__super__.constructor.apply(this, arguments);
    }

    ContraceptivesUseTreemapGraph.prototype.dataParser = function(data, country_code, country_name) {
      var data_country, key, method, methods, parsedData, parsedDataSorted;
      parsedData = [
        {
          id: 'r'
        }
      ];
      data_country = data.filter(function(d) {
        return d.code === country_code;
      });
      if (data_country[0]) {
        methods = {};
        this.options.methodsKeys.forEach((function(_this) {
          return function(key, i) {
            if (data_country[0][key]) {
              return methods[key] = {
                id: key.toLowerCase().replace(/ /g, '-').replace(')', '').replace('(', ''),
                name: _this.options.methodsNames[i],
                value: +data_country[0][key]
              };
            } else {
              return console.log("There's no data for " + key);
            }
          };
        })(this));
        for (key in methods) {
          method = methods[key];
          if (key !== 'Other modern methods' && key !== 'Any traditional method' && method.value < 5) {
            methods['Other modern methods'].value += method.value;
            delete methods[key];
          }
        }
        for (key in methods) {
          method = methods[key];
          parsedData.push({
            id: method.id,
            raw_name: method.name,
            name: '<strong>' + method.name.charAt(0).toUpperCase() + method.name.slice(1) + '</strong><br/>' + Math.round(method.value) + '%',
            value: method.value,
            parent: 'r'
          });
        }
        parsedDataSorted = parsedData.sort(function(a, b) {
          if (a.value && b.value) {
            return b.value - a.value;
          } else {
            return 1;
          }
        });
        $('#treemap-contraceptives-use-country').html(country_name);
        $('#treemap-contraceptives-use-any-method').html(Math.round(data_country[0]['Any modern method']));
        $('#treemap-contraceptives-use-method').html(parsedDataSorted[0].raw_name);
      } else {
        console.warn('No data country for ' + country_code);
      }
      return parsedData;
    };

    ContraceptivesUseTreemapGraph.prototype.setData = function(data, country_code, country_name) {
      this.originalData = data;
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.drawGraph();
      this.$el.trigger('draw-complete');
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.updateData = function(country_code, country_name) {
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.updateGraph();
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.getNodeClass = function(d) {
      return 'node node-' + d.id;
    };


    /* overdrive resize
    onResize: =>
      super()
      @setContainerOffset()
      return @
    
    setContainerOffset: ->
      @$el.css('top', ($(window).height()-@$el.height())*0.5)
     */

    return ContraceptivesUseTreemapGraph;

  })(window.TreemapGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.BeeswarmScatterplotGraph = (function(superClass) {
    extend(BeeswarmScatterplotGraph, superClass);

    BeeswarmScatterplotGraph.prototype.incomeLevels = [1005, 3955, 12235];

    BeeswarmScatterplotGraph.prototype.labels = ['AGO', 'BGD', 'BRA', 'CHN', 'DEU', 'ESP', 'ETH', 'IND', 'IDN', 'JPN', 'NGA', 'PAK', 'PHL', 'RUS', 'SAU', 'TUR', 'UGA', 'USA', 'VNM'];

    function BeeswarmScatterplotGraph(id, options) {
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getSizeDomain = bind(this.getSizeDomain, this);
      this.getSizeRange = bind(this.getSizeRange, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.getDotFill = bind(this.getDotFill, this);
      this.getPositionY = bind(this.getPositionY, this);
      this.getPositionX = bind(this.getPositionX, this);
      this.setDotLabelPosition = bind(this.setDotLabelPosition, this);
      this.setDotPosition = bind(this.setDotPosition, this);
      this.setDot = bind(this.setDot, this);
      options.dotSize = options.dotSize || 5;
      options.dotMinSize = options.dotMinSize || 2;
      options.dotMaxSize = options.dotMaxSize || 15;
      options.mode = options.mode || 0;
      BeeswarmScatterplotGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BeeswarmScatterplotGraph.prototype.dataParser = function(data) {
      if (this.options.key.size) {
        return data.sort((function(_this) {
          return function(a, b) {
            return b[_this.options.key.size] - a[_this.options.key.size];
          };
        })(this));
      } else {
        return data;
      }
    };

    BeeswarmScatterplotGraph.prototype.drawGraph = function() {
      this.setSize();
      this.setSimulation();
      this.runSimulation();
      this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).call(this.setDot);
      if (this.options.key.label) {
        return this.container.selectAll('.dot-label').data(this.data.filter((function(_this) {
          return function(d) {
            return _this.labels.indexOf(d[_this.options.key.id]) !== -1;
          };
        })(this))).enter().append('text').attr('class', (function(_this) {
          return function(d) {
            if (d[_this.options.key.size] > 1000000000) {
              return 'dot-label size-l';
            } else if (d[_this.options.key.size] > 180000000) {
              return 'dot-label size-m';
            } else {
              return 'dot-label';
            }
          };
        })(this)).attr('dy', '0.25em').text((function(_this) {
          return function(d) {
            return d[_this.options.key.label];
          };
        })(this)).call(this.setDotLabelPosition);
      }
    };

    BeeswarmScatterplotGraph.prototype.setSimulation = function() {
      var forceY;
      forceY = d3.forceY((function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
      forceY.strength(1);
      return this.simulation = d3.forceSimulation(this.data).force('x', forceY).force('y', d3.forceX(this.width * .5)).force('collide', d3.forceCollide((function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius + 1;
          } else {
            return _this.options.dotSize + 1;
          }
        };
      })(this))).stop();
    };

    BeeswarmScatterplotGraph.prototype.runSimulation = function() {
      var i, results;
      i = 0;
      results = [];
      while (i < 350) {
        this.simulation.tick();
        results.push(++i);
      }
      return results;
    };

    BeeswarmScatterplotGraph.prototype.setDot = function(selection) {
      return selection.attr('r', (function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius;
          } else {
            return _this.options.dotSize;
          }
        };
      })(this)).attr('fill', this.getDotFill).call(this.setDotPosition);
    };

    BeeswarmScatterplotGraph.prototype.setDotPosition = function(selection) {
      return selection.attr('cx', this.getPositionX).attr('cy', this.getPositionY);
    };

    BeeswarmScatterplotGraph.prototype.setDotLabelPosition = function(selection) {
      return selection.attr('x', this.getPositionX).attr('y', this.getPositionY);
    };

    BeeswarmScatterplotGraph.prototype.getPositionX = function(d) {
      if (this.options.mode === 0) {
        return d.x;
      } else {
        return Math.round(this.x(d[this.options.key.x]));
      }
    };

    BeeswarmScatterplotGraph.prototype.getPositionY = function(d) {
      if (this.options.mode === 0) {
        return d.y;
      } else {
        return Math.round(this.y(d[this.options.key.y]));
      }
    };

    BeeswarmScatterplotGraph.prototype.getDotFill = function(d) {
      return this.color(d[this.options.key.color]);
    };

    BeeswarmScatterplotGraph.prototype.setMode = function(mode) {
      this.options.mode = mode;
      if (this.options.mode < 2) {
        this.container.selectAll('.dot, .dot-label').classed('inactive', false);
        this.container.selectAll('.dot').call(this.setDotPosition);
        if (this.xLegend) {
          this.xLegend.style('opacity', this.options.mode);
        }
        if (this.options.key.label) {
          this.container.selectAll('.dot-label').style('opacity', 0).call(this.setDotLabelPosition).transition().delay(500).style('opacity', 1);
        }
        return this.container.selectAll('.x.axis .tick line').style('opacity', this.options.mode);
      } else if (this.options.mode === 2) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d[_this.options.key.x] < _this.incomeLevels[2] || d[_this.options.key.y] > 15;
          };
        })(this));
      } else if (this.options.mode === 3) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d[_this.options.key.x] > _this.incomeLevels[1] || d[_this.options.key.y] < 30;
          };
        })(this));
      } else if (this.options.mode === 4) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d.id !== 'SAU' && d.id !== 'JPN';
          };
        })(this));
      } else if (this.options.mode === 5) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', false);
      }
    };

    BeeswarmScatterplotGraph.prototype.setSize = function() {
      if (this.size) {
        return this.data.forEach((function(_this) {
          return function(d) {
            return d.radius = _this.size(d[_this.options.key.size]);
          };
        })(this));
      }
    };

    BeeswarmScatterplotGraph.prototype.updateGraphDimensions = function() {
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
      BeeswarmScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.setSimulation();
      this.runSimulation();
      this.container.selectAll('.dot').call(this.setDotPosition);
      if (this.options.key.label) {
        this.container.selectAll('.dot-label').call(this.setDotLabelPosition);
      }
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setScales = function() {
      this.x = d3.scaleLog().range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      if (this.options.key.color) {
        this.color = d3.scaleThreshold().range(d3.schemeOranges[5]);
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues(this.incomeLevels);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([0, 10, 20, 30, 40]).tickFormat(function(d) {
        return d + '%';
      });
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(-1,5)');
    };

    BeeswarmScatterplotGraph.prototype.getScaleXDomain = function() {
      return [250, 85000];
    };

    BeeswarmScatterplotGraph.prototype.getScaleYDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this))
      ];
    };

    BeeswarmScatterplotGraph.prototype.getSizeRange = function() {
      return [this.options.dotMinSize, this.options.dotMaxSize];
    };

    BeeswarmScatterplotGraph.prototype.getSizeDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.size];
          };
        })(this))
      ];
    };

    BeeswarmScatterplotGraph.prototype.getColorDomain = function() {
      return [0, 10, 20, 30];
    };

    BeeswarmScatterplotGraph.prototype.drawScales = function() {
      var incomes, incomesMax;
      this.x.domain(this.getScaleXDomain());
      this.y.domain(this.getScaleYDomain());
      if (this.size) {
        this.size.domain(this.getSizeDomain());
      }
      if (this.color) {
        this.color.domain(this.getColorDomain());
      }
      if (this.xAxis) {
        this.container.append('g').attr('class', 'x axis').call(this.setXAxisPosition).call(this.xAxis);
        this.container.selectAll('.x.axis .tick line').attr('y1', this.y(40) - 4);
      }
      if (this.yAxis) {
        this.container.append('g').attr('class', 'y axis').call(this.setYAxisPosition).call(this.yAxis);
        this.container.selectAll('.y.axis .tick text').attr('dx', 3).attr('dy', -4);
      }
      incomes = this.xAxis.tickValues();
      incomes.unshift(0);
      incomesMax = this.x(this.getScaleXDomain()[1]);
      incomes = incomes.map((function(_this) {
        return function(d) {
          if (d > 0) {
            return 100 * _this.x(d) / incomesMax;
          } else {
            return 0;
          }
        };
      })(this));
      incomes.push(100);
      this.xLegend = d3.select(d3.select('#' + this.id).node().parentNode).select('.x-legend');
      this.xLegend.selectAll('li').style('width', function(d, i) {
        return (incomes[i + 1] - incomes[i]) + '%';
      });
      return this;
    };

    BeeswarmScatterplotGraph.prototype.getDimensions = function() {
      if (this.$el) {
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth > 680 ? this.containerWidth * this.options.aspectRatio : this.containerWidth > 520 ? this.containerWidth * .75 : this.containerWidth;
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    return BeeswarmScatterplotGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ContraceptivesApp = (function() {
    ContraceptivesApp.prototype.filter_keys = {
      'contraceptives-filter-0': 'residence',
      'contraceptives-filter-1': 'age',
      'contraceptives-filter-2': 'education',
      'contraceptives-filter-3': 'wealth'
    };

    ContraceptivesApp.prototype.dhs_countries = {
      'AFG': {
        'name': 'AFIR70DT',
        'year': '2017'
      },
      'ALB': {
        'name': 'ALIR50DT',
        'year': '2008-09'
      },
      'ARM': {
        'name': 'AMIR61DT',
        'year': '2010'
      },
      'AGO': {
        'name': 'AOIR71DT',
        'year': '2015-16'
      },
      'AZE': {
        'name': 'AZIR52DT',
        'year': '2006'
      },
      'BGD': {
        'name': 'BDIR72DT',
        'year': '2014'
      },
      'BEN': {
        'name': 'BJIR51DT',
        'year': '2006'
      },
      'BOL': {
        'name': 'BOIR51DT',
        'year': '2008'
      },
      'BDI': {
        'name': 'BUIR61DT',
        'year': '2010'
      },
      'COD': {
        'name': 'CDIR61DT',
        'year': '2013-14'
      },
      'COG': {
        'name': 'CGIR60DT',
        'year': '2011-12'
      },
      'CIV': {
        'name': 'CIIR62DT',
        'year': '2011-12'
      },
      'CMR': {
        'name': 'CMIR61DT',
        'year': '2011'
      },
      'COL': {
        'name': 'COIR71DT',
        'year': '2015-16'
      },
      'DOM': {
        'name': 'DRIR61DT',
        'year': '2013'
      },
      'EGY': {
        'name': 'EGIR61DT',
        'year': '2014'
      },
      'ETH': {
        'name': 'ETIR70DT',
        'year': '2016'
      },
      'GHA': {
        'name': 'GHIR72DT',
        'year': '2014'
      },
      'GMB': {
        'name': 'GMIR60DT',
        'year': '2013'
      },
      'GIN': {
        'name': 'GNIR62DT',
        'year': '2012'
      },
      'GTM': {
        'name': 'GUIR71DT',
        'year': '2014-15'
      },
      'GUY': {
        'name': 'GYIR5IDT',
        'year': '2009'
      },
      'HND': {
        'name': 'HNIR62DT',
        'year': '2011-12'
      },
      'HTI': {
        'name': 'HTIR61DT',
        'year': '2012'
      },
      'IND': {
        'name': 'IAIR71DT',
        'year': '2015'
      },
      'IDN': {
        'name': 'IDIR63DT',
        'year': '2012'
      },
      'JOR': {
        'name': 'JOIR6CDT',
        'year': '2012'
      },
      'KEN': {
        'name': 'KEIR70DT',
        'year': '2014'
      },
      'KHM': {
        'name': 'KHIR73DT',
        'year': '2014'
      },
      'LBR': {
        'name': 'LBIR6ADT',
        'year': '2013'
      },
      'LSO': {
        'name': 'LSIR71DT',
        'year': '2014'
      },
      'MAR': {
        'name': 'MAIR43DT',
        'year': '2003-04'
      },
      'MDG': {
        'name': 'MDIR51DT',
        'year': '2008-09'
      },
      'MLI': {
        'name': 'MLIR53DT',
        'year': '2006'
      },
      'MMR': {
        'name': 'MMIR71DT',
        'year': '2016'
      },
      'MWI': {
        'name': 'MWIR7HDT',
        'year': '2015-16'
      },
      'MOZ': {
        'name': 'MZIR62DT',
        'year': '2011'
      },
      'NGA': {
        'name': 'NGIR6ADT',
        'year': '2013'
      },
      'NER': {
        'name': 'NIIR51DT',
        'year': '2006'
      },
      'NAM': {
        'name': 'NMIR61DT',
        'year': '2013'
      },
      'NPL': {
        'name': 'NPIR7HDT',
        'year': '2016'
      },
      'PER': {
        'name': 'PEIR6IDT',
        'year': '2012'
      },
      'PHL': {
        'name': 'PHIR61DT',
        'year': '2013'
      },
      'PAK': {
        'name': 'PKIR61DT',
        'year': '2012-13'
      },
      'RWA': {
        'name': 'RWIR70DT',
        'year': '2015'
      },
      'SLE': {
        'name': 'SLIR61DT',
        'year': '2013'
      },
      'SEN': {
        'name': 'SNIR6DDT',
        'year': '2012-13'
      },
      'STP': {
        'name': 'STIR50DT',
        'year': '2008'
      },
      'SWZ': {
        'name': 'SZIR51DT',
        'year': '2006'
      },
      'TCD': {
        'name': 'TDIR71DT',
        'year': '2014-15'
      },
      'TGO': {
        'name': 'TGIR61DT',
        'year': '2013-14'
      },
      'TJK': {
        'name': 'TJIR61DT',
        'year': '2012'
      },
      'TLS': {
        'name': 'TLIR61DT',
        'year': '2009-10'
      },
      'TZA': {
        'name': 'TZIR7HDT',
        'year': '2015-16'
      },
      'UGA': {
        'name': 'UGIR60DT',
        'year': '2011'
      },
      'ZMB': {
        'name': 'ZMIR51DT',
        'year': '2007'
      },
      'ZWE': {
        'name': 'ZWIR71DT',
        'year': '2015'
      }
    };

    ContraceptivesApp.prototype.sentences = {
      'es': {
        'ALB': 'La marcha atrás es el primer método anticonceptivo de Albania. Además, se trata del segundo país donde existe mayor oposición de la propia mujer, la pareja o la religión a tomar anticonceptivos.',
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html">Unas cinco mil mujeres marcharon en febrero de 2018 frente al Congreso argentino para pedir la legalización del aborto.</a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346">Muchos australianos están volviendo a utilizar métodos tradicionales de anticoncepción, según un estudio de Monash University.</a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Bélgica donó 10 millones de euros para la campaña <i>She Decides</i>, lanzada por el Gobierno holandés para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652">Farmacias de Bolivia implementaron códigos secretos para pedir preservativos y evitar el estigma de comprar estos anticonceptivos.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html">El Gobierno chino ofrece la retirada gratuita de DIUs después de la política del hijo único.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures">El Salvador es el único país del mundo donde abortar está penado con cárcel.</a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html">El ayuntamiento de Helsinki proporciona anticonceptivos de manera gratuita a los jóvenes menores de 25 años.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops">El uso de las pastillas anticonceptivas se ha reducido en Francia desde 2010.</a>',
        'GMB': 'En Gambia, muchas mujeres utilizan un método tradicional que consiste en atar a la cintura una cuerda, una rama, o un papelito con o sin frases del Corán.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577">Un proyecto alemán facilita anticonceptivos de forma gratuita a mujeres de más de 20 años con ingresos bajos.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco">La religión influye en la educación sexual de los jóvenes guatemaltecos.</a>',
        'ISR': 'En los sectores judíos más ortodoxos, solo pueden usarse los anticonceptivos si el rabino da su permiso a la mujer.',
        'JPN': 'Japón, aunque se encuentra en el grupo de países con renta alta, es la excepción: las necesidades no cubiertas con anticonceptivos está al nivel de países con rentas bajas.',
        'PRK': 'El 95% de mujeres que utilizan anticonceptivos en Corea del Norte han elegido el DIU. Se trata del mayor porcentaje de uso a nivel mundial.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">El gobierno holandés lanza el proyecto <i>She Decides</i> para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro">En la época de los 90, durante el gobierno de Fujimori, más de 250.000 mujeres fueron esterilizadas sin su consentimiento.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines"> En un país donde el aborto del está prohibido, tres mujeres mueren al día por complicaciones derivadas de intervenciones ilegales.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/">El Gobierno polaco da un paso atrás y se convierte en el único país de la Unión Europea donde la pastilla del día después está sujeta a prescripción.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains">La guerra en Sudán está creando una crisis en el acceso a anticonceptivos.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html">Madrid es la única comunidad que no financia anticonceptivos con sus fondos.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097">Erdogan declara que la planificación familiar no es para los musulmanes.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall">En 2017, el Ministerio de Salud de Uganda declaraba un desabastecimiento de 150 millones de preservativos masculinos.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform">En Irlanda es ilegal abortar a no ser que haya un riesgo real de salud para la madre.</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html">Trump da a los médicos libertad para negarse a realizar procedimientos en contra de sus creencias religiosas, como el aborto.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412">La escasez y el precio elevado de los anticonceptivos en Venezuela influye en el aumento de embarazos no deseados.</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres">Un proyecto en Zambia  une la manicura y los anticonceptivos.</a>'
      },
      'en': {
        'ALB': 'Withdrawn is the most used contraceptive method by Albanian women. Furthermore, it is the second country where the opposition of the respondent, the partner or the religion to use contraceptive methods is the main barrier for using them when they are needed.',
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html">Approximately five thousand women marched in February 2018 in front of the Argentine Congress to demand the legalization of abortion. </a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346">Natural methods of contraception on the rise in Australia, according to an investigation of Monash University. </a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Belgium have donated 10 million euros to the <i>She Decides</i> proyect, launched by the Dutch government to boost contraception in developing countries. </a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652">Bolivia\'s pharmacies have developed a secret code to ask for condoms and therefore, to avoid stigma about buying them.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html">After one child policiy, outrage at China\'s offer to remove IUDs.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures">El Salvador is one of six countries where abortion is banned under any circumstances, and women who undergo it could face prison </a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html">Helsinki to offer year’s worth of contraceptive pills to under 25-year-olds.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops">French women opt for alternatives as Pill use drops.</a>',
        'GMB': 'In The Gambia, many women use a traditional method that involves tying a rope, a branch or a piece of paper around the waist with -or without- phrases from the Koran in it.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577">A trial scheme in Germany is helping women on low incomes to avoid sacrificing their contraception.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco">Religion has a major influence in sexual education of Guatemala young people.</a>',
        'ISR': 'In ultra orthodox judaism, contraceptive use is only permitted if the rabbi gives previous permission to the woman.',
        'JPN': 'Japan, even if it is part of the group of countries with high income, has unmet needs for contraception at the level of countries with low income.',
        'PRK': '95% of women who use contraceptive methods in North Korea have chosen to use IUDs. It is the highest percentage of use of this method worldwide.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Dutch initiative brings in €181m for family planning campaign.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro">In the 1990s, Alberto Fujimori, former president of Peru, launched a new family planning programme that resulted in the sterilisation of 272,028 women and 22,004 men in only 4 years.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines"> How bitter herbs and botched abortions kill three women a day in the Philippines.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/">Polish Government takes a step back in the access to the "morning-after" pill and it becomes the only European country where women need a prescription for the use of this contraceptive method.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains">\'Every year, I give birth\': why war is driving a contraception crisis in Sudan.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html">Madrid is the only regional government that does not finance contraceptive methods with its funds.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097">Turkey\'s Erdogan warns Muslims against birth control.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall">In 2017, Uganda faced a 150 millions male condoms shortfall.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform">Irish referendum on abortion reform to be held by end of May 2018</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html">Trump gives health workers new religious liberty protections.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412">The shortage and high price of contraceptives in Venezuela influences the increase in unwanted pregnancies</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres">In Zambia, a radical new approach to contraception is giving adolescent girls the information and services of contraception while doing the manicure.</a>'
      }
    };

    function ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names) {
      this.onSelectFilter = bind(this.onSelectFilter, this);
      this.onSelectCountry = bind(this.onSelectCountry, this);
      this.sentences = this.sentences[lang];
      this.data = {
        use: data_use,
        unmetneeds: data_unmetneeds,
        reasons: data_reasons
      };
      this.methodsKeys = methods_keys;
      this.methodsNames = methods_names;
      this.methodsDHSNames = methods_dhs_names;
      this.reasonsNames = reasons_names;
      this.reasonsDHSNames = reasons_dhs_names;
      this.$app = $('#contraceptives-app');
      this.$app.find('.select-country').select2().change(this.onSelectCountry).val(user_country.code).trigger('change');
      this.$app.find('.contraceptives-app-filters .btn').click(this.onSelectFilter);
      this.$app.css('opacity', 1);
    }

    ContraceptivesApp.prototype.onSelectCountry = function(e) {
      var countryReasons, countryUnmetneeds, countryUse, country_methods, method, method_value, reason, reason_value, reasons, unmetneeds, use;
      this.country_code = $(e.target).val();
      use = null;
      method = null;
      method_value = null;
      unmetneeds = null;
      reason = null;
      reason_value = null;
      this.$app.find('.contraceptives-app-filters').hide().find('.btn').removeClass('active');
      $('.contraceptives-filter').hide();
      if (this.dhs_countries[this.country_code]) {
        this.$app.find('#contraceptives-app-data-year').html(this.dhs_countries[this.country_code].year);
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/' + this.dhs_countries[this.country_code].name + '_all.csv', (function(_this) {
          return function(error, data) {
            var d;
            d = data[0];
            _this.setAppItemData(_this.$app, 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons, _this.sentences[_this.country_code]);
            return _this.$app.find('.contraceptives-app-filters').show();
          };
        })(this));
      } else {
        this.$app.find('#contraceptives-app-data-year').html('2015-16');
        countryUse = this.data.use.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryUse && countryUse[0]) {
          if (countryUse[0]['Any modern method'] !== '0') {
            use = countryUse[0]['Any modern method'];
          }
          country_methods = this.methodsKeys.map((function(_this) {
            return function(key, i) {
              return {
                'name': _this.methodsNames[i],
                'value': +countryUse[0][key]
              };
            };
          })(this));
          country_methods = country_methods.sort(function(a, b) {
            return b.value - a.value;
          });
          method = country_methods[0].name;
          method_value = country_methods[0].value;
        }
        countryUnmetneeds = this.data.unmetneeds.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryUnmetneeds && countryUnmetneeds[0]) {
          unmetneeds = countryUnmetneeds[0]['survey'] ? countryUnmetneeds[0]['survey'] : countryUnmetneeds[0]['estimated'];
        }
        countryReasons = this.data.reasons.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryReasons && countryReasons[0]) {
          reasons = Object.keys(this.reasonsNames).map((function(_this) {
            return function(reason) {
              return {
                'name': _this.reasonsNames[reason],
                'value': +countryReasons[0][reason]
              };
            };
          })(this));
          reasons = reasons.sort(function(a, b) {
            return b.value - a.value;
          });
          reason = reasons[0].name;
          reason_value = reasons[0].value;
        }
        return this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value, this.sentences[this.country_code]);
      }
    };

    ContraceptivesApp.prototype.onSelectFilter = function(e) {
      var $target;
      e.preventDefault();
      if (this.filter !== $(e.target).attr('href').substring(1)) {
        $('html, body').animate({
          scrollTop: this.$app.find('.contraceptives-app-filters').offset().top - 15
        }, 400);
        this.$app.find('.contraceptives-app-filters .btn').removeClass('active');
        $target = $(e.target).addClass('active');
        this.filter = $target.attr('href').substring(1);
        $('.contraceptives-filter').hide();
        this.filterEl = $('#' + this.filter).show();
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/' + this.dhs_countries[this.country_code].name + '_' + this.filter_keys[this.filter] + '.csv', (function(_this) {
          return function(error, data) {
            if (data) {
              return data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
              });
            }
          };
        })(this));
      }
    };

    ContraceptivesApp.prototype.setAppItemData = function($el, use, method, method_value, unmetneeds, reason, reason_value, sentence) {
      if (use) {
        $el.find('.contraceptives-app-data-use').html(Math.round(+use) + '%');
        $el.find('.contraceptives-app-use').show();
      } else {
        $el.find('.contraceptives-app-use').hide();
      }
      if (method) {
        $el.find('.contraceptives-app-data-main-method').html(method);
        $el.find('.contraceptives-app-data-main-method-value').html(Math.round(+method_value) + '%');
        $el.find('.contraceptives-app-method').show();
      } else {
        $el.find('.contraceptives-app-method').hide();
      }
      if (unmetneeds) {
        $el.find('.contraceptives-app-data-unmetneeds').html(Math.round(+unmetneeds) + '%');
        $el.find('.contraceptives-app-unmetneeds').show();
      } else {
        $el.find('.contraceptives-app-unmetneeds').hide();
      }
      if (reason) {
        $el.find('.contraceptives-app-data-reason').html(reason);
        $el.find('.contraceptives-app-data-reason-value').html(Math.round(+reason_value) + '%');
        $el.find('.contraceptives-app-reason').show();
      } else {
        $el.find('.contraceptives-app-reason').hide();
      }
      if (sentence) {
        return $el.find('.contraceptives-app-sentence').html(sentence).show();
      } else {
        return $el.find('.contraceptives-app-sentence').hide();
      }
    };

    return ContraceptivesApp;

  })();

}).call(this);

(function() {
  (function($) {
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, onCarouselStep, reasons_dhs_names, reasons_names, scrollamaInitialized, setLocation, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupDataArticle, setupMortalityLineGraph, setupReasonsOpposedGraph, setupUnmetNeedsGdpGraph, userCountry;
    userCountry = {};
    scrollamaInitialized = false;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    if (lang === 'es') {
      d3.formatDefaultLocale({
        "currency": ["$", ""],
        "decimal": ",",
        "thousands": ".",
        "grouping": [3]
      });
    }
    methods_keys = ["Female sterilization", "Male sterilization", "IUD", "Implant", "Injectable", "Pill", "Male condom", "Female condom", "Vaginal barrier methods", "Lactational amenorrhea method (LAM)", "Emergency contraception", "Other modern methods", "Any traditional method"];
    methods_names = {
      'es': ["esterilización femenina", "esterilización masculina", "DIU", "implante", "inyectable", "píldora", "condón masculino", "condón femenino", "métodos de barrera vaginal", "método de la amenorrea de la lactancia (MELA)", "anticonceptivos de emergencia", "otros métodos modernos", "métodos tradicionales"],
      'en': ["female sterilisation", "male sterilisation", "IUD", "implant", "injectable", "pill", "male condom", "female condom", "vaginal barrier methods", "lactational amenorrhea method (LAM)", "emergency contraception", "other modern methods", "traditional methods"]
    };
    methods_dhs_names = {
      'es': {
        '1': "píldora",
        '2': "DIU",
        '3': "inyectable",
        '5': "condón",
        '6': "esterilización femenina",
        '7': "esterilización masculina",
        '8': "abstinencia periódica",
        '9': "marcha atrás",
        '10': "otros",
        '11': "implante",
        '13': "método de la amenorrea de la lactancia (MELA)",
        '17': "métodos tradicionales"
      },
      'en': {
        '1': "pill",
        '2': "IUD",
        '3': "injectable",
        '5': "condom",
        '6': "female sterilisation",
        '7': "male sterilisation",
        '8': "periodic abstinence",
        '9': "withdrawal",
        '10': "other",
        '11': "implant",
        '13': "lactational amenorrhea method (LAM)",
        '17': "traditional methods"
      }
    };

    /*
    methods_icons = 
      "Female sterilization": 'sterilization'
      "Male sterilization": 'sterilization'
      "IUD": 'diu'
      "Implant": null
      "Injectable": 'injectable'
      "Pill": 'pill'
      "Male condom": 'condom'
      "Female condom": null
      "Vaginal barrier methods": null
      "Lactational amenorrhea method (LAM)": null
      "Emergency contraception": null
      "Other modern methods": null
      "Any traditional method": 'traditional'
     */
    reasons_names = {
      'es': {
        "a": "no están casadas",
        "b": "no tienen sexo",
        "c": "tienen sexo infrecuente",
        "d": "menopausia o esterilización",
        "e": "son subfecundas o infecundas",
        "f": "amenorrea postparto",
        "g": "están dando el pecho",
        "h": "fatalista",
        "i": "la mujer se opone",
        "j": "el marido o la pareja se opone",
        "k": "otros se oponen",
        "l": "prohibición religiosa",
        "m": "no conoce los métodos",
        "n": "no conoce ninguna fuente donde adquirirlos",
        "o": "preocupaciones de salud",
        "p": "miedo a los efectos secundarios/preocupaciones de salud",
        "q": "falta de acceso/muy lejos",
        "r": "cuestan demasiado",
        "s": "inconvenientes para su uso",
        "t": "interfiere con los procesos del cuerpo",
        "u": "el método elegido no está disponible",
        "v": "no hay métodos disponibles",
        "w": "(no estándar)",
        "x": "otros",
        "z": "no lo sé"
      },
      'en': {
        "a": "not married",
        "b": "not having sex",
        "c": "infrequent sex",
        "d": "menopausal/hysterectomy",
        "e": "subfecund/infecund",
        "f": "postpartum amenorrheic",
        "g": "breastfeeding",
        "h": "fatalistic",
        "i": "respondent opposed",
        "j": "husband/partner opposed",
        "k": "others opposed",
        "l": "religious prohibition",
        "m": "knows no method",
        "n": "knows no source",
        "o": "health concerns",
        "p": "fear of side effects/health concerns",
        "q": "lack of access/too far",
        "r": "costs too much",
        "s": "inconvenient to use",
        "t": "interferes with body's processes",
        "u": "preferred method not available",
        "v": "no method available",
        "w": "(no estándar)",
        "x": "other",
        "z": "don't know"
      }
    };
    reasons_dhs_names = {
      'es': {
        'v3a08a': 'no están casadas',
        'v3a08b': 'no tienen sexo',
        'v3a08c': 'tienen sexo infrecuente',
        'v3a08d': 'menopausia o esterilización',
        'v3a08e': 'son subfecundas o infecundas',
        'v3a08f': 'amenorrea postparto',
        'v3a08g': 'están dando el pecho',
        'v3a08h': 'fatalista',
        'v3a08i': 'la mujer se opone',
        'v3a08j': 'el marido o la pareja se opone',
        'v3a08k': 'otros se oponen',
        'v3a08l': 'prohibición religiosa',
        'v3a08m': 'no conoce los métodos',
        'v3a08n': 'no conoce ninguna fuente donde adquirirlos',
        'v3a08o': 'preocupaciones de salud',
        'v3a08p': 'miedo a los efectos secundarios',
        'v3a08q': 'falta de acceso/muy lejos',
        'v3a08r': 'cuestan demasiado',
        'v3a08s': 'inconvenientes para su uso',
        'v3a08t': "interfiere con los procesos del cuerpo"
      },
      'en': {
        'v3a08a': 'not married',
        'v3a08b': 'not having sex',
        'v3a08c': 'infrequent sex',
        'v3a08d': 'menopausal/hysterectomy',
        'v3a08e': 'subfecund/infecund',
        'v3a08f': 'postpartum amenorrheic',
        'v3a08g': 'breastfeeding',
        'v3a08h': 'fatalistic',
        'v3a08i': 'respondent opposed',
        'v3a08j': 'husband/partner opposed',
        'v3a08k': 'others opposed',
        'v3a08l': 'religious prohibition',
        'v3a08m': 'knows no method',
        'v3a08n': 'knows no source',
        'v3a08o': 'health concerns',
        'v3a08p': 'fear of side effects',
        'v3a08q': 'lack of access/too far',
        'v3a08r': 'costs too much',
        'v3a08s': 'inconvenient to use',
        'v3a08t': "interferes with the body's processes"
      }
    };
    setupConstraceptivesUseGraph = function() {
      var dataIndex, graphWidth, j, resizeHandler, results, useGraph;
      graphWidth = 0;
      dataIndex = (function() {
        results = [];
        for (j = 0; j <= 99; j++){ results.push(j); }
        return results;
      }).apply(this);
      useGraph = d3.select('#contraceptives-use-graph');
      useGraph.append('ul').selectAll('li').data(dataIndex).enter().append('li').append('svg').append('use').attr('xlink:href', '#icon-woman').attr('viewBox', '0 0 193 450');
      resizeHandler = function() {
        var itemsHeight, itemsWidth;
        if (graphWidth !== useGraph.node().offsetWidth) {
          graphWidth = useGraph.node().offsetWidth;
          itemsWidth = graphWidth > 480 ? (graphWidth / 20) - 10 : (graphWidth / 20) - 4;
          itemsHeight = 2.33 * itemsWidth;
          useGraph.selectAll('li').style('width', itemsWidth + 'px').style('height', itemsHeight + 'px');
          useGraph.selectAll('svg').attr('width', itemsWidth).attr('height', itemsHeight);
        }
        return useGraph.style('margin-top', (($('body').height() - useGraph.node().offsetHeight) * .5) + 'px');
      };
      new ScrollGraph('contraceptives-use-graph-container', function(e) {
        var currentStep, data, from, to;
        currentStep = +d3.select(e.element).attr('data-step');
        if (currentStep > 0) {
          data = [64, 88, 100];
          from = currentStep > 1 ? data[currentStep - 2] : 0;
          to = data[currentStep - 1];
          return useGraph.selectAll('li').filter(function(d) {
            return d >= from && d < to;
          }).classed('fill-' + currentStep, e.direction === 'down');
        }
      });
      resizeHandler();
      return window.addEventListener('resize', resizeHandler);
    };
    setupUnmetNeedsGdpGraph = function(data_unmetneeds, countries) {
      var data, unmetneedsGraph;
      data = [];
      data_unmetneeds.forEach(function(d) {
        var country;
        country = countries.filter(function(e) {
          return e.code === d.code;
        });
        if (country[0] && country[0]['gni']) {
          return data.push({
            value: +d['estimated'],
            id: country[0].code,
            name: country[0]['name_' + lang],
            population: +country[0]['population'],
            gni: +country[0]['gni']
          });
        }

        /*
        else
          console.log 'No GNI or Population data for this country', d.code, country[0]
         */
      });
      unmetneedsGraph = new window.BeeswarmScatterplotGraph('unmet-needs-gdp-graph', {
        margin: {
          left: 0,
          rigth: 0,
          top: 5,
          bottom: 0
        },
        key: {
          x: 'gni',
          y: 'value',
          id: 'id',
          label: 'name',
          color: 'value',
          size: 'population'
        },
        dotMinSize: 1,
        dotMaxSize: 32
      });
      unmetneedsGraph.setData(data);
      new ScrollGraph('unmet-needs-gdp-container-graph', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        return unmetneedsGraph.setMode(currentStep);
      });
      return $(window).resize(unmetneedsGraph.onResize);
    };
    setupConstraceptivesMaps = function(data_use, countries, map) {
      var useMap;
      data_use.forEach(function(d) {
        var item;
        item = countries.filter(function(country) {
          return country.code === d.code;
        });

        /*
        d['Rhythm']                    = +d['Rhythm']
        d['Withdrawal']                = +d['Withdrawal']
        d['Other traditional methods'] = +d['Other traditional methods']
        d['Traditional methods'] = d['Rhythm']+d['Withdrawal']+d['Other traditional methods']
        console.log d.code, d['Rhythm'], d['Withdrawal'], d['Other traditional methods'], d['Traditional methods']
        delete d['Rhythm']
        delete d['Withdrawal']
        delete d['Other traditional methods']
         */
        d.values = [];
        d.value = 0;
        methods_keys.forEach(function(key, i) {
          return d.values.push({
            id: i,
            name: methods_names[lang][i],
            value: d[key] !== '' ? +d[key] : null
          });
        });
        if (item && item[0]) {
          d.name = item[0]['name_' + lang];
          return d.code_num = item[0]['code_num'];
        }

        /*
        else
          console.log 'no country', d.code
         */
      });
      useMap = new window.ContraceptivesUseMapGraph('map-contraceptives-use', {
        aspectRatio: 0.5625,
        margin: {
          top: 60,
          bottom: 0
        },
        legend: true,
        lang: lang
      });
      useMap.setData(data_use, map);
      new ScrollGraph('contraceptives-use-container', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        return useMap.setMapState(currentStep);
      });
      useMap.onResize();
      return $(window).resize(useMap.onResize);
    };
    setupConstraceptivesUseTreemap = function(data_use) {
      var useTreemap;
      useTreemap = new window.ContraceptivesUseTreemapGraph('treemap-contraceptives-use', {
        aspectRatio: 0.5625,
        margin: {
          left: 0,
          rigth: 0,
          top: 0,
          bottom: 0
        },
        key: {
          value: 'value',
          id: 'name'
        },
        methodsKeys: methods_keys,
        methodsNames: methods_names[lang]
      });
      useTreemap.setData(data_use, userCountry.code, userCountry.name);
      new ScrollGraph('treemap-contraceptives-use-container', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        if (currentStep === 1) {
          return useTreemap.updateData('world', 'Mundo');
        } else if (currentStep === 0 && e.direction === 'up') {
          return useTreemap.updateData(userCountry.code, userCountry.name);
        }
      });
      return $(window).resize(useTreemap.onResize);
    };
    setupReasonsOpposedGraph = function() {
      var $bars;
      $bars = $('#contraceptives-reasons-opposed .bar');
      return $('#contraceptives-reasons-opposed-legend li').mouseover(function() {
        return $bars.addClass('disabled').filter('.bar-' + $(this).attr('class')).removeClass('disabled');
      }).mouseout(function() {
        return $bars.removeClass('disabled');
      });
    };
    onCarouselStep = function(e) {
      var currentStep;
      currentStep = d3.select(e.element).attr('data-step');
      this.graphic.selectAll('.active').classed('active', false);
      return this.graphic.select('.step-' + currentStep).classed('active', true);
    };
    setupMortalityLineGraph = function() {
      var data, graph;
      data = [
        {
          '1990': 385,
          '1995': 369,
          '2000': 341,
          '2005': 288,
          '2010': 246,
          '2015': 216
        }
      ];
      graph = new window.LineGraph('maternal-mortality-graph', {
        isArea: true,
        margin: {
          left: 20
        }
      });
      graph.xAxis.tickValues([1995, 2005, 2015]);
      graph.yAxis.tickValues([100, 200, 300]).tickFormat(d3.format('.0s'));
      graph.yFormat = d3.format('.2s');
      graph.getScaleYDomain = function() {
        return [0, 385];
      };
      graph.setData(data);
      return $(window).resize(graph.onResize);
    };
    setLocation = function(location, countries) {
      var user_country;
      if (location) {
        user_country = countries.filter(function(d) {
          return d.code2 === location.country_code;
        });
        if (user_country[0]) {
          userCountry.code = user_country[0].code;
          userCountry.name = user_country[0]['name_' + lang];
        }
      } else {
        location = {};
      }
      if (!location.code) {
        userCountry.code = 'ESP';
        return userCountry.name = lang === 'es' ? 'España' : 'Spain';
      }
    };
    setupDataArticle = function(data_use, data_unmetneeds, data_reasons, countries, map) {
      data_reasons.forEach(function(d) {
        var item;
        item = countries.filter(function(country) {
          return country.code2 === d.code;
        });
        if (item && item[0]) {
          d.code = item[0].code;
          d.name = item[0]['name_' + lang];
          Object.keys(reasons_names[lang]).forEach(function(reason) {
            d[reason] = 100 * d[reason];
            if (d[reason] > 100) {
              return console.log('Alert! Value greater than zero. ' + d.country + ', ' + reason + ': ' + d[reason]);
            }
          });
          return delete d.country;
        }

        /*
        else
          console.warn 'No country data for '+d.code
         */
      });
      if ($('#treemap-contraceptives-use').length) {
        setupConstraceptivesUseTreemap(data_use);
      }
      if ($('#map-contraceptives-use').length) {
        setupConstraceptivesMaps(data_use, countries, map);
      }
      if ($('#contraceptives-use-graph').length > 0) {
        setupConstraceptivesUseGraph();
      }
      if ($('#unmet-needs-gdp-graph').length) {
        setupUnmetNeedsGdpGraph(data_unmetneeds, countries);
      }
      if ($('#carousel-marie-stopes').length) {
        new ScrollGraph('carousel-marie-stopes', onCarouselStep);
      }
      if ($('#contraceptives-reasons-opposed').length) {
        setupReasonsOpposedGraph();
      }
      if ($('#contraceptives-app').length) {
        return new ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
      }
    };
    if ($('body').hasClass('datos-uso-barreras') || $('body').hasClass('data-use-barriers')) {
      return d3.json('https://freegeoip.net/json/', function(error, location) {
        return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data_use, data_unmetneeds, data_reasons, countries, map) {
          setLocation(location, countries);
          return setupDataArticle(data_use, data_unmetneeds, data_reasons, countries, map);
        });
      });
    } else if ($('body').hasClass('religion')) {
      if ($('#carousel-rabinos').length) {
        new ScrollGraph('carousel-rabinos', onCarouselStep);
      }
      if ($('#carousel-imam').length) {
        new ScrollGraph('carousel-imam', onCarouselStep);
      }
      if ($('#carousel-papa').length) {
        new ScrollGraph('carousel-papa', onCarouselStep);
      }
      if ($('#maternal-mortality-graph').length) {
        return setupMortalityLineGraph();
      }
    } else if ($('body').hasClass('datos-uso-barreras-static')) {
      return d3.json('https://freegeoip.net/json/', function(error, location) {
        return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data_use, data_unmetneeds, data_reasons, countries, map) {
          setLocation(location, countries);
          if ($('#contraceptives-app').length) {
            return new ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
          }
        });
      });
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwic2Nyb2xsLWdyYXBoLmNvZmZlZSIsIm1hcC1ncmFwaC5jb2ZmZWUiLCJsaW5lLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFE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QVEsUUFBUjtlQUVyQyxFQUFFLENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDa0IsT0FBQSxHQUFRLHdDQUQxQixDQUVFLENBQUMsS0FGSCxDQUVTLEVBQUUsQ0FBQyxHQUZaLEVBRWtCLE9BQUEsR0FBUSx1QkFGMUIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxFQUFFLENBQUMsR0FIWixFQUdrQixPQUFBLEdBQVEsa0NBSDFCLENBSUUsQ0FBQyxLQUpILENBSVMsRUFBRSxDQUFDLEdBSlosRUFJa0IsT0FBQSxHQUFRLHlDQUoxQixDQUtFLENBQUMsS0FMSCxDQUtTLEVBQUUsQ0FBQyxJQUxaLEVBS2tCLE9BQUEsR0FBUSwwQkFMMUIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLGVBQWxCLEVBQW1DLFlBQW5DLEVBQWlELFNBQWpELEVBQTRELEdBQTVEO1VBQ0wsV0FBQSxDQUFZLFFBQVosRUFBc0IsU0FBdEI7VUFDQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO21CQUNNLElBQUEsaUJBQUEsQ0FBa0IsSUFBbEIsRUFBd0IsUUFBeEIsRUFBa0MsZUFBbEMsRUFBbUQsWUFBbkQsRUFBaUUsV0FBakUsRUFBOEUsWUFBOUUsRUFBNEYsYUFBYyxDQUFBLElBQUEsQ0FBMUcsRUFBaUgsaUJBQWtCLENBQUEsSUFBQSxDQUFuSSxFQUEwSSxhQUFjLENBQUEsSUFBQSxDQUF4SixFQUErSixpQkFBa0IsQ0FBQSxJQUFBLENBQWpMLEVBRE47O1FBRkssQ0FOVDtNQUZxQyxDQUF2QyxFQUZHOztFQWxoQk4sQ0FBRCxDQUFBLENBaWlCRSxNQWppQkY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuU2Nyb2xsR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoX2lkLCBfc3RlcENhbGxiYWNrKSAtPlxuICAgIEBpZCA9IF9pZFxuICAgIEBzdGVwQ2FsbGJhY2sgPSBfc3RlcENhbGxiYWNrXG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKVxuICAgIEBncmFwaGljICAgPSBAY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBAc3RlcHMgICAgID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5zY3JvbGwtdGV4dCAuc3RlcCcpXG4gICAgQGNoYXJ0ICAgICA9IEBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIEBzY3JvbGxlciA9IHNjcm9sbGFtYSgpXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBAb25SZXNpemUoKVxuICAgICMgMi4gc2V0dXAgdGhlIHNjcm9sbGFtYSBpbnN0YW5jZVxuICAgICMgMy4gYmluZCBzY3JvbGxhbWEgZXZlbnQgaGFuZGxlcnMgKHRoaXMgY2FuIGJlIGNoYWluZWQgbGlrZSBiZWxvdylcbiAgICBAc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycrQGlkICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJyMnK0BpZCsnIC5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgc3RlcDogICAgICAgJyMnK0BpZCsnIC5zY3JvbGwtdGV4dCAuc3RlcCcgICMgdGhlIHN0ZXAgZWxlbWVudHNcbiAgICAgICAgb2Zmc2V0OiAgICAgMC4wNSAgICAgICAgICAgICAgICAgICMgc2V0IHRoZSB0cmlnZ2VyIHRvIGJlIDEvMiB3YXkgZG93biBzY3JlZW5cbiAgICAgICAgZGVidWc6ICAgICAgZmFsc2UgICAgICAgICAgICAgICAgICMgZGlzcGxheSB0aGUgdHJpZ2dlciBvZmZzZXQgZm9yIHRlc3RpbmdcbiAgICAgIC5vbkNvbnRhaW5lckVudGVyIEBvbkNvbnRhaW5lckVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRXhpdCAgQG9uQ29udGFpbmVyRXhpdFxuICAgICAgLm9uU3RlcEVudGVyICAgICAgQG9uU3RlcEVudGVyXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgQG9uUmVzaXplXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgd2lkdGggPSBAZ3JhcGhpYy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggI01hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICBoZWlnaHQgPSBNYXRoLmZsb29yIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgQHN0ZXBzLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgIEBncmFwaGljLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICBAY2hhcnRcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgIyA0LiB0ZWxsIHNjcm9sbGFtYSB0byB1cGRhdGUgbmV3IGVsZW1lbnQgZGltZW5zaW9uc1xuICAgIEBzY3JvbGxlci5yZXNpemUoKVxuXG4gICMgc3RpY2t5IHRoZSBncmFwaGljXG4gIG9uQ29udGFpbmVyRW50ZXI6IChlKSA9PlxuICAgIEBncmFwaGljXG4gICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCB0cnVlXG4gICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICBvbkNvbnRhaW5lckV4aXQ6IChlKSA9PlxuICAgIEBncmFwaGljXG4gICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICMgY2FsbCBzdGVwQ2FsbGJhY2sgb24gZW50ZXIgc3RlcFxuICBvblN0ZXBFbnRlcjogKGUpID0+XG4gICAgQHN0ZXBDYWxsYmFjayhlKVxuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgQGdldExlZ2VuZEZvcm1hdFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICAjIGdldCBjb3VudHJpZXMgZGF0YVxuICAgIEBjb3VudHJpZXMgPSB0b3BvanNvbi5mZWF0dXJlKG1hcCwgbWFwLm9iamVjdHMuY291bnRyaWVzKTtcbiAgICBAY291bnRyaWVzLmZlYXR1cmVzID0gQGNvdW50cmllcy5mZWF0dXJlcy5maWx0ZXIgKGQpIC0+IGQuaWQgIT0gJzAxMCcgICMgcmVtb3ZlIGFudGFyY3RpY2FcbiAgICAjIHNldCBwcm9qZWN0aW9uXG4gICAgQHByb2plY3Rpb24gPSBkMy5nZW9LYXZyYXlza2l5NygpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICAjIHNldCBwYXRoXG4gICAgQHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAgIC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgIyBhZGQgY291bnRyaWVzIHBhdGhzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAuZGF0YShAY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NvdW50cnktJytkLmlkXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2NvdW50cnknXG4gICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAxXG4gICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICMgdHJpZ2dlciBkcmF3LWNvbXBsZXRlIGV2ZW50XG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG5cbiAgZ2V0TGVnZW5kRGF0YTogPT5cbiAgICByZXR1cm4gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZFxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWUubGVuZ3RoID4gMFxuICAgICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICAgIEBzZXRUb29sdGlwRGF0YSB2YWx1ZVswXVxuICAgICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgb2Zmc2V0ID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuICAgICAgICAnb3BhY2l0eSc6ICcxJ1xuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBpZiBkLmNhc2VzXG4gICAgICBAJHRvb2x0aXBcbiAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcykgIiwiY2xhc3Mgd2luZG93LkxpbmVHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIHlGb3JtYXQ6IGQzLmZvcm1hdCgnZCcpICAgIyBzZXQgbGFiZWxzIGhvdmVyIGZvcm1hdFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0xpbmUgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQHllYXJzID0gQGdldFllYXJzIGRhdGFcbiAgICBzdXBlcihkYXRhKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIHllYXJzID0gW11cbiAgICBkMy5rZXlzKGRhdGFbMF0pLmZvckVhY2ggKGQpIC0+XG4gICAgICBpZiArZFxuICAgICAgICB5ZWFycy5wdXNoICtkXG4gICAgcmV0dXJuIHllYXJzLnNvcnQoKVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZFtAb3B0aW9ucy5rZXkueF0sICdlbiAnLCB5ZWFyKTtcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YSBcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbScgICAgICBcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgXG4gIHNldFRpY2tIb3ZlclBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCBNYXRoLnJvdW5kIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCs5IiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuTWFwR3JhcGhcblxuICBjdXJyZW50U3RhdGU6IDBcblxuICBzdGF0ZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ0ZlbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hJ1xuICAgICAgICBlbjogJ2ZlbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40OFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTIwLCAzMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnSW5kaWEnXG4gICAgICAgICAgICBlbjogJ0luZGlhJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjI3XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ2NVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMjAsIC01XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdSZXDDumJsaWNhIERvbWluaWNhbmEnXG4gICAgICAgICAgICBlbjogJ0RvbWluaWNhbiBSZXB1YmxpYydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hJ1xuICAgICAgICBlbjogJ21hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjI2NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4yOFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMyXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NvcmVhIGRlbCBOb3J0ZSdcbiAgICAgICAgICAgIGVuOiAnTm9ydGggS29yZWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NoaW5hJ1xuICAgICAgICAgICAgZW46ICdDaGluYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdQaWxsJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncMOtbGRvcmEnXG4gICAgICAgIGVuOiAncGlsbCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjQ2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTM1LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBcmdlbGlhJ1xuICAgICAgICAgICAgZW46ICdBbGdlcmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgY29uZG9tJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncHJlc2VydmF0aXZvIG1hc2N1bGlubydcbiAgICAgICAgZW46ICdtYWxlIGNvbmRvbSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU0MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMzVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnR3JlY2lhJ1xuICAgICAgICAgICAgZW46ICdHcmVlY2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjc0XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgLTEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCb3RzdWFuYSdcbiAgICAgICAgICAgIGVuOiAnQm90c3dhbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSW5qZWN0YWJsZSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2lueWVjdGFibGUnXG4gICAgICAgIGVuOiAnaW5qZWN0YWJsZSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjYyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjU1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnRXRpb3DDrWEnXG4gICAgICAgICAgICBlbjogJ0V0aGlvcGlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuM1xuICAgICAgICAgIHI6IDE2XG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yNiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQmFsY2FuZXMnXG4gICAgICAgICAgICBlbjogJ0JhbGthbnMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEwLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBbGJhbmlhJ1xuICAgICAgICAgICAgZW46ICdBbGJhbmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgZ2V0TGVnZW5kRGF0YTogLT5cbiAgICByZXR1cm4gWzAsMjAsNDAsNjAsODBdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZCsnJSdcblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBvZmZzZXQgPSAxMDBcbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLW9mZnNldFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAjIGF2b2lkIGdyYXBoIGhlaWdodCBvdmVyZmxvdyBicm93c2VyIGhlaWdodCBcbiAgICAgIGlmIEBjb250YWluZXJIZWlnaHQgPiBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJXaWR0aCA9IEBjb250YWluZXJIZWlnaHQgLyBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgICAjQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICAjZWxzZVxuICAgICAgIyAgQCRlbC5jc3MgJ3RvcCcsIChib2R5SGVpZ2h0LUBjb250YWluZXJIZWlnaHQpIC8gMlxuICAgICAgQHdpZHRoICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcblxuXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgc3VwZXIobWFwKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICByZXR1cm4gQFxuXG4gIHNldE1hcFN0YXRlOiAoc3RhdGUpIC0+XG4gICAgaWYgc3RhdGUgIT0gQGN1cnJlbnRTdGF0ZVxuICAgICAgI2NvbnNvbGUubG9nICdzZXQgc3RhdGUgJytzdGF0ZVxuICAgICAgQGN1cnJlbnRTdGF0ZSA9IHN0YXRlXG4gICAgICBAY3VycmVudE1ldGhvZCA9IEBzdGF0ZXNbQGN1cnJlbnRTdGF0ZS0xXVxuICAgICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgICAgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBAY3VycmVudE1ldGhvZC50ZXh0W0BvcHRpb25zLmxhbmddXG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+IGQudmFsdWUgPSArZFtAY3VycmVudE1ldGhvZC5pZF1cbiAgICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4gICAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgIEBjdXJyZW50TWV0aG9kLmxhYmVscy5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC5jeCA9IGQuY3hfZmFjdG9yKkB3aWR0aFxuICAgICAgICBkLmN5ID0gZC5jeV9mYWN0b3IqQGhlaWdodFxuICAgICAgICBkLnRleHQgPSBkLmxhYmVsW0BvcHRpb25zLmxhbmddXG4gICAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBAY3VycmVudE1ldGhvZC5sYWJlbHNcbiIsImNsYXNzIHdpbmRvdy5UcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMubWluU2l6ZSA9IG9wdGlvbnMubWluU2l6ZSB8fCA2MFxuICAgIG9wdGlvbnMubm9kZXNQYWRkaW5nID0gb3B0aW9ucy5ub2Rlc1BhZGRpbmcgfHwgOFxuICAgIG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gfHwgNjAwXG4gICAgb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID0gb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IHx8IDYyMFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBkcmF3IHNjYWxlc1xuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBzZXRTVkcgdG8gdXNlIGEgZGl2IGNvbnRhaW5lciAobm9kZXMtY29udGFpbmVyKSBpbnN0ZWFkIG9mIGEgc3ZnIGVsZW1lbnRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGVzLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIEB0cmVlbWFwID0gZDMudHJlZW1hcCgpXG4gICAgICAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgICAgLnBhZGRpbmcgMFxuICAgICAgLnJvdW5kIHRydWVcblxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuXG4gICAgQHN0cmF0aWZ5ID0gZDMuc3RyYXRpZnkoKS5wYXJlbnRJZCAoZCkgLT4gZC5wYXJlbnRcblxuICAgIEB1cGRhdGVHcmFwaCgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG5cbiAgICAjIHVwZGF0ZSB0cmVtYXAgXG4gICAgQHRyZWVtYXBSb290ID0gQHN0cmF0aWZ5KEBkYXRhKVxuICAgICAgLnN1bSAoZCkgPT4gZFtAb3B0aW9ucy5rZXkudmFsdWVdXG4gICAgICAuc29ydCAoYSwgYikgLT4gYi52YWx1ZSAtIGEudmFsdWVcbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgbm9kZXMgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgXG4gICAgbm9kZXMuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZSdcbiAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwnXG4gICAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbC1jb250ZW50J1xuICAgICAgICAgIC5hcHBlbmQgJ3AnXG5cbiAgICAjIHNldHVwIG5vZGVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcblxuICAgICMgYWRkIGxhYmVsIG9ubHkgaW4gbm9kZXMgd2l0aCBzaXplIGdyZWF0ZXIgdGhlbiBvcHRpb25zLm1pblNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmNhbGwgICBAc2V0Tm9kZUxhYmVsXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgbm9kZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG4gICAgICBcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG5cbiAgc2V0Tm9kZURpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuICBzZXROb2RlTGFiZWw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLnNlbGVjdCgncCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gcmV0dXJuIGlmIGQudmFsdWUgPiAyNSB0aGVuICdzaXplLWwnIGVsc2UgaWYgZC52YWx1ZSA8IDEwIHRoZW4gJ3NpemUtcycgZWxzZSAnJ1xuICAgICAgLmh0bWwgKGQpID0+IGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgaXNOb2RlTGFiZWxWaXNpYmxlOiAoZCkgPT5cbiAgICByZXR1cm4gZC54MS1kLngwID4gQG9wdGlvbnMubWluU2l6ZSAmJiBkLnkxLWQueTAgPiBAb3B0aW9ucy5taW5TaXplXG5cbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUnXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAgIyBzZXQgcGFyc2VkRGF0YSBhcnJheVxuICAgIHBhcnNlZERhdGEgPSBbe2lkOiAncid9XSAjIGFkZCB0cmVlbWFwIHJvb3RcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBpZiBkYXRhX2NvdW50cnlbMF1cbiAgICAgICMgc2V0IG1ldGhvZHMgb2JqZWN0XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgICBpZiBkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICAgIG1ldGhvZHNba2V5XSA9XG4gICAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgICAgbmFtZTogQG9wdGlvbnMubWV0aG9kc05hbWVzW2ldXG4gICAgICAgICAgICB2YWx1ZTogK2RhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIlRoZXJlJ3Mgbm8gZGF0YSBmb3IgXCIgKyBrZXlcbiAgICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIGlmIGtleSAhPSAnT3RoZXIgbW9kZXJuIG1ldGhvZHMnIGFuZCBrZXkgIT0gJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnIGFuZCBtZXRob2QudmFsdWUgPCA1XG4gICAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgICBkZWxldGUgbWV0aG9kc1trZXldXG4gICAgIFxuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBwYXJzZWREYXRhLnB1c2hcbiAgICAgICAgICBpZDogbWV0aG9kLmlkXG4gICAgICAgICAgcmF3X25hbWU6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArIG1ldGhvZC5uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLm5hbWUuc2xpY2UoMSkgKyAnPC9zdHJvbmc+PGJyLz4nICsgTWF0aC5yb3VuZChtZXRob2QudmFsdWUpICsgJyUnXG4gICAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIHBhcmVudDogJ3InXG4gICAgICBwYXJzZWREYXRhU29ydGVkID0gcGFyc2VkRGF0YS5zb3J0IChhLGIpIC0+IGlmIGEudmFsdWUgYW5kIGIudmFsdWUgdGhlbiBiLnZhbHVlLWEudmFsdWUgZWxzZSAxXG4gICAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cnknKS5odG1sIGNvdW50cnlfbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWFueS1tZXRob2QnKS5odG1sIE1hdGgucm91bmQoZGF0YV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgcGFyc2VkRGF0YVNvcnRlZFswXS5yYXdfbmFtZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnTm8gZGF0YSBjb3VudHJ5IGZvciAnK2NvdW50cnlfY29kZVxuICAgICAgIyBUT0RPISEhIFdoYXQgd2UgZG8gaWYgdGhlcmUncyBubyBkYXRhIGZvciB1c2VyJ3MgY291bnRyeVxuICAgIHJldHVybiBwYXJzZWREYXRhXG5cbiAgIyBvdmVyZHJpdmUgc2V0IGRhdGFcbiAgc2V0RGF0YTogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBvcmlnaW5hbERhdGEgPSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAZHJhd0dyYXBoKClcbiAgICAjQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIG5vZGUgY2xhc3NcbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUgbm9kZS0nK2QuaWRcblxuICAjIyMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb250YWluZXJPZmZzZXQ6IC0+XG4gICAgQCRlbC5jc3MoJ3RvcCcsICgkKHdpbmRvdykuaGVpZ2h0KCktQCRlbC5oZWlnaHQoKSkqMC41KVxuICAjIyMiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgaW5jb21lTGV2ZWxzOiBbMTAwNSwgMzk1NSwgMTIyMzVdXG5cbiAgbGFiZWxzOiBbXG4gICAgJ0FHTycsXG4gICAgJ0JHRCcsXG4gICAgJ0JSQScsXG4gICAgJ0NITicsXG4gICAgJ0RFVScsXG4gICAgJ0VTUCcsXG4gICAgJ0VUSCcsXG4gICAgJ0lORCcsXG4gICAgJ0lETicsXG4gICAgJ0pQTicsXG4gICAgJ05HQScsXG4gICAgJ1BBSycsXG4gICAgJ1BITCcsXG4gICAgJ1JVUycsXG4gICAgJ1NBVScsXG4gICAgJ1RVUicsXG4gICAgJ1VHQScsXG4gICAgJ1VTQScsXG4gICAgJ1ZOTSdcbiAgXVxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIHJldHVybiBkYXRhLnNvcnQgKGEsYikgPT4gYltAb3B0aW9ucy5rZXkuc2l6ZV0tYVtAb3B0aW9ucy5rZXkuc2l6ZV1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgIyBkcmF3IGRvdHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YSBAZGF0YVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdFxuICAgICAgIy5vbiAnbW91c2VvdmVyJywgKGQpID0+IGNvbnNvbGUubG9nIGRcblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmRhdGEgQGRhdGEuZmlsdGVyIChkKSA9PiBAbGFiZWxzLmluZGV4T2YoZFtAb3B0aW9ucy5rZXkuaWRdKSAhPSAtMVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpID0+IHJldHVybiBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDEwMDAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDE4MDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1tJyBlbHNlICdkb3QtbGFiZWwnXG4gICAgICAgICMuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgICAuYXR0ciAnZHknLCAnMC4yNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkubGFiZWxdXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG5cblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWSA9IGQzLmZvcmNlWSAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgZm9yY2VZLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVlcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWChAd2lkdGgqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAzNTBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgc2V0RG90OiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuYXR0ciAnZmlsbCcsIEBnZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXREb3RQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjeCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICdjeScsIEBnZXRQb3NpdGlvbllcblxuICBzZXREb3RMYWJlbFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAneScsIEBnZXRQb3NpdGlvbllcblxuICBnZXRQb3NpdGlvblg6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC54IGVsc2UgTWF0aC5yb3VuZCBAeChkW0BvcHRpb25zLmtleS54XSlcblxuICBnZXRQb3NpdGlvblk6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC55IGVsc2UgTWF0aC5yb3VuZCBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSAjaWYgQG9wdGlvbnMua2V5LmNvbG9yIGFuZCBAb3B0aW9ucy5tb2RlID09IDEgdGhlbiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdIGVsc2UgJyNlMjcyM2InXG5cbiAgc2V0TW9kZTogKG1vZGUpIC0+XG4gICAgQG9wdGlvbnMubW9kZSA9IG1vZGVcbiAgICBpZiBAb3B0aW9ucy5tb2RlIDwgMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAgIGlmIEB4TGVnZW5kXG4gICAgICAgIEB4TGVnZW5kLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgICAgIyBzaG93L2hpZGUgZG90IGxhYmVsc1xuICAgICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAwXG4gICAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDFcbiAgICAgICMgc2hvdy9oaWRlIHggYXhpcyBsaW5lc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPCBAaW5jb21lTGV2ZWxzWzJdIG9yIGRbQG9wdGlvbnMua2V5LnldID4gMTVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gM1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPiBAaW5jb21lTGV2ZWxzWzFdIG9yIGRbQG9wdGlvbnMua2V5LnldIDwgMzBcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNFxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGQuaWQgIT0gJ1NBVScgYW5kIGQuaWQgIT0gJ0pQTidcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNVxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICAjQHggPSBkMy5zY2FsZVBvdygpXG4gICAgIyAgLmV4cG9uZW50KDAuMTI1KVxuICAgICMgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB4ID0gZDMuc2NhbGVMb2coKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgIyBFcXVpdmFsZW50IHRvIGQzLnNjYWxlU3FydCgpXG4gICAgICAjwqBodHRwczovL2JsLm9ja3Mub3JnL2QzaW5kZXB0aC83NzVjZjQzMWU2NGI2NzE4NDgxYzA2ZmM0NWRjMzRmOVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0gIy5yZXZlcnNlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIEBpbmNvbWVMZXZlbHNcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtMSw1KSdcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyNTAsIDg1MDAwXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCAxMCwgMjAsIDMwXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuYXR0ciAneTEnLCBAeSg0MCktNFxuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzIC50aWNrIHRleHQnKVxuICAgICAgICAuYXR0ciAnZHgnLCAzXG4gICAgICAgIC5hdHRyICdkeScsIC00XG4gICAgIyBzZXQgeCBsZW5nZWRcbiAgICBpbmNvbWVzID0gQHhBeGlzLnRpY2tWYWx1ZXMoKVxuICAgIGluY29tZXMudW5zaGlmdCAwXG4gICAgaW5jb21lc01heCA9IEB4IEBnZXRTY2FsZVhEb21haW4oKVsxXVxuICAgIGluY29tZXMgPSBpbmNvbWVzLm1hcCAoZCkgPT4gaWYgZCA+IDAgdGhlbiAxMDAqQHgoZCkvaW5jb21lc01heCBlbHNlIDBcbiAgICBpbmNvbWVzLnB1c2ggMTAwXG4gICAgQHhMZWdlbmQgPSBkMy5zZWxlY3QoZDMuc2VsZWN0KCcjJytAaWQpLm5vZGUoKS5wYXJlbnROb2RlKS5zZWxlY3QoJy54LWxlZ2VuZCcpXG4gICAgQHhMZWdlbmQuc2VsZWN0QWxsKCdsaScpLnN0eWxlICd3aWR0aCcsIChkLGkpIC0+IChpbmNvbWVzW2krMV0taW5jb21lc1tpXSkrJyUnXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBpZiBAY29udGFpbmVyV2lkdGggPiA2ODAgdGhlbiBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpbyBlbHNlIGlmIEBjb250YWluZXJXaWR0aCA+IDUyMCB0aGVuIEBjb250YWluZXJXaWR0aCAqIC43NSBlbHNlIEBjb250YWluZXJXaWR0aFxuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcbiIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG4gIGRoc19jb3VudHJpZXM6XG4gICAgJ0FGRyc6XG4gICAgICAnbmFtZSc6ICdBRklSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTcnXG4gICAgJ0FMQic6XG4gICAgICAnbmFtZSc6ICdBTElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ0FSTSc6XG4gICAgICAnbmFtZSc6ICdBTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0FHTyc6XG4gICAgICAnbmFtZSc6ICdBT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0FaRSc6XG4gICAgICAnbmFtZSc6ICdBWklSNTJEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JHRCc6XG4gICAgICAnbmFtZSc6ICdCRElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0JFTic6XG4gICAgICAnbmFtZSc6ICdCSklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JPTCc6XG4gICAgICAnbmFtZSc6ICdCT0lSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ0JESSc6XG4gICAgICAnbmFtZSc6ICdCVUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0NPRCc6XG4gICAgICAnbmFtZSc6ICdDRElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ0NPRyc6XG4gICAgICAnbmFtZSc6ICdDR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NJVic6XG4gICAgICAnbmFtZSc6ICdDSUlSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NNUic6XG4gICAgICAnbmFtZSc6ICdDTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ0NPTCc6XG4gICAgICAnbmFtZSc6ICdDT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0RPTSc6XG4gICAgICAnbmFtZSc6ICdEUklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0VHWSc6XG4gICAgICAnbmFtZSc6ICdFR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0VUSCc6XG4gICAgICAnbmFtZSc6ICdFVElSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ0dIQSc6XG4gICAgICAnbmFtZSc6ICdHSElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0dNQic6XG4gICAgICAnbmFtZSc6ICdHTUlSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0dJTic6XG4gICAgICAnbmFtZSc6ICdHTklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0dUTSc6XG4gICAgICAnbmFtZSc6ICdHVUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ0dVWSc6XG4gICAgICAnbmFtZSc6ICdHWUlSNUlEVCdcbiAgICAgICd5ZWFyJzogJzIwMDknXG4gICAgJ0hORCc6XG4gICAgICAnbmFtZSc6ICdITklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0hUSSc6XG4gICAgICAnbmFtZSc6ICdIVElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0lORCc6XG4gICAgICAnbmFtZSc6ICdJQUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ0lETic6XG4gICAgICAnbmFtZSc6ICdJRElSNjNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0pPUic6XG4gICAgICAnbmFtZSc6ICdKT0lSNkNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0tFTic6XG4gICAgICAnbmFtZSc6ICdLRUlSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0tITSc6XG4gICAgICAnbmFtZSc6ICdLSElSNzNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0xCUic6XG4gICAgICAnbmFtZSc6ICdMQklSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0xTTyc6XG4gICAgICAnbmFtZSc6ICdMU0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ01BUic6XG4gICAgICAnbmFtZSc6ICdNQUlSNDNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDMtMDQnXG4gICAgJ01ERyc6XG4gICAgICAnbmFtZSc6ICdNRElSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ01MSSc6XG4gICAgICAnbmFtZSc6ICdNTElSNTNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ01NUic6XG4gICAgICAnbmFtZSc6ICdNTUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ01XSSc6XG4gICAgICAnbmFtZSc6ICdNV0lSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ01PWic6XG4gICAgICAnbmFtZSc6ICdNWklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ05HQSc6XG4gICAgICAnbmFtZSc6ICdOR0lSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05FUic6XG4gICAgICAnbmFtZSc6ICdOSUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ05BTSc6XG4gICAgICAnbmFtZSc6ICdOTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05QTCc6XG4gICAgICAnbmFtZSc6ICdOUElSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ1BFUic6XG4gICAgICAnbmFtZSc6ICdQRUlSNklEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1BITCc6XG4gICAgICAnbmFtZSc6ICdQSElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1BBSyc6XG4gICAgICAnbmFtZSc6ICdQS0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1JXQSc6XG4gICAgICAnbmFtZSc6ICdSV0lSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ1NMRSc6XG4gICAgICAnbmFtZSc6ICdTTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1NFTic6XG4gICAgICAnbmFtZSc6ICdTTklSNkREVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1NUUCc6XG4gICAgICAnbmFtZSc6ICdTVElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ1NXWic6XG4gICAgICAnbmFtZSc6ICdTWklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ1RDRCc6XG4gICAgICAnbmFtZSc6ICdURElSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ1RHTyc6XG4gICAgICAnbmFtZSc6ICdUR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ1RKSyc6XG4gICAgICAnbmFtZSc6ICdUSklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1RMUyc6XG4gICAgICAnbmFtZSc6ICdUTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDktMTAnXG4gICAgJ1RaQSc6XG4gICAgICAnbmFtZSc6ICdUWklSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ1VHQSc6XG4gICAgICAnbmFtZSc6ICdVR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ1pNQic6XG4gICAgICAnbmFtZSc6ICdaTUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDcnXG4gICAgJ1pXRSc6XG4gICAgICAnbmFtZSc6ICdaV0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG5cbiAgc2VudGVuY2VzOiBcbiAgICAnZXMnOlxuICAgICAgJ0FMQic6ICdMYSBtYXJjaGEgYXRyw6FzIGVzIGVsIHByaW1lciBtw6l0b2RvIGFudGljb25jZXB0aXZvIGRlIEFsYmFuaWEuIEFkZW3DoXMsIHNlIHRyYXRhIGRlbCBzZWd1bmRvIHBhw61zIGRvbmRlIGV4aXN0ZSBtYXlvciBvcG9zaWNpw7NuIGRlIGxhIHByb3BpYSBtdWplciwgbGEgcGFyZWphIG8gbGEgcmVsaWdpw7NuIGEgdG9tYXIgYW50aWNvbmNlcHRpdm9zLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCI+VW5hcyBjaW5jbyBtaWwgbXVqZXJlcyBtYXJjaGFyb24gZW4gZmVicmVybyBkZSAyMDE4IGZyZW50ZSBhbCBDb25ncmVzbyBhcmdlbnRpbm8gcGFyYSBwZWRpciBsYSBsZWdhbGl6YWNpw7NuIGRlbCBhYm9ydG8uPC9hPidcbiAgICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCI+TXVjaG9zIGF1c3RyYWxpYW5vcyBlc3TDoW4gdm9sdmllbmRvIGEgdXRpbGl6YXIgbcOpdG9kb3MgdHJhZGljaW9uYWxlcyBkZSBhbnRpY29uY2VwY2nDs24sIHNlZ8O6biB1biBlc3R1ZGlvIGRlIE1vbmFzaCBVbml2ZXJzaXR5LjwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5Cw6lsZ2ljYSBkb27DsyAxMCBtaWxsb25lcyBkZSBldXJvcyBwYXJhIGxhIGNhbXBhw7FhIDxpPlNoZSBEZWNpZGVzPC9pPiwgbGFuemFkYSBwb3IgZWwgR29iaWVybm8gaG9sYW5kw6lzIHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ0JPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZWZlLmNvbS9lZmUvYW1lcmljYS9zb2NpZWRhZC9sYS12ZXJnw7xlbnphLXktZWwtZXN0aWdtYS1kZS1wZWRpci1wcmVzZXJ2YXRpdm9zLWVuLWJvbGl2aWEvLzIwMDAwMDEzLTMyNjU2NTJcIj5GYXJtYWNpYXMgZGUgQm9saXZpYSBpbXBsZW1lbnRhcm9uIGPDs2RpZ29zIHNlY3JldG9zIHBhcmEgcGVkaXIgcHJlc2VydmF0aXZvcyB5IGV2aXRhciBlbCBlc3RpZ21hIGRlIGNvbXByYXIgZXN0b3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnQ09MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCI+RWwgR29iaWVybm8gY2hpbm8gb2ZyZWNlIGxhIHJldGlyYWRhIGdyYXR1aXRhIGRlIERJVXMgZGVzcHXDqXMgZGUgbGEgcG9sw610aWNhIGRlbCBoaWpvIMO6bmljby48L2E+J1xuICAgICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIj5FbCBTYWx2YWRvciBlcyBlbCDDum5pY28gcGHDrXMgZGVsIG11bmRvIGRvbmRlIGFib3J0YXIgZXN0w6EgcGVuYWRvIGNvbiBjw6FyY2VsLjwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIj5FbCBheXVudGFtaWVudG8gZGUgSGVsc2lua2kgcHJvcG9yY2lvbmEgYW50aWNvbmNlcHRpdm9zIGRlIG1hbmVyYSBncmF0dWl0YSBhIGxvcyBqw7N2ZW5lcyBtZW5vcmVzIGRlIDI1IGHDsW9zLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiPkVsIHVzbyBkZSBsYXMgcGFzdGlsbGFzIGFudGljb25jZXB0aXZhcyBzZSBoYSByZWR1Y2lkbyBlbiBGcmFuY2lhIGRlc2RlIDIwMTAuPC9hPidcbiAgICAgICdHTUInOiAnRW4gR2FtYmlhLCBtdWNoYXMgbXVqZXJlcyB1dGlsaXphbiB1biBtw6l0b2RvIHRyYWRpY2lvbmFsIHF1ZSBjb25zaXN0ZSBlbiBhdGFyIGEgbGEgY2ludHVyYSB1bmEgY3VlcmRhLCB1bmEgcmFtYSwgbyB1biBwYXBlbGl0byBjb24gbyBzaW4gZnJhc2VzIGRlbCBDb3LDoW4uJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIj5VbiBwcm95ZWN0byBhbGVtw6FuIGZhY2lsaXRhIGFudGljb25jZXB0aXZvcyBkZSBmb3JtYSBncmF0dWl0YSBhIG11amVyZXMgZGUgbcOhcyBkZSAyMCBhw7FvcyBjb24gaW5ncmVzb3MgYmFqb3MuPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIj5MYSByZWxpZ2nDs24gaW5mbHV5ZSBlbiBsYSBlZHVjYWNpw7NuIHNleHVhbCBkZSBsb3MgasOzdmVuZXMgZ3VhdGVtYWx0ZWNvcy48L2E+J1xuICAgICAgJ0lTUic6ICdFbiBsb3Mgc2VjdG9yZXMganVkw61vcyBtw6FzIG9ydG9kb3hvcywgc29sbyBwdWVkZW4gdXNhcnNlIGxvcyBhbnRpY29uY2VwdGl2b3Mgc2kgZWwgcmFiaW5vIGRhIHN1IHBlcm1pc28gYSBsYSBtdWplci4nXG4gICAgICAnSlBOJzogJ0phcMOzbiwgYXVucXVlIHNlIGVuY3VlbnRyYSBlbiBlbCBncnVwbyBkZSBwYcOtc2VzIGNvbiByZW50YSBhbHRhLCBlcyBsYSBleGNlcGNpw7NuOiBsYXMgbmVjZXNpZGFkZXMgbm8gY3ViaWVydGFzIGNvbiBhbnRpY29uY2VwdGl2b3MgZXN0w6EgYWwgbml2ZWwgZGUgcGHDrXNlcyBjb24gcmVudGFzIGJhamFzLidcbiAgICAgICdQUksnOiAnRWwgOTUlIGRlIG11amVyZXMgcXVlIHV0aWxpemFuIGFudGljb25jZXB0aXZvcyBlbiBDb3JlYSBkZWwgTm9ydGUgaGFuIGVsZWdpZG8gZWwgRElVLiBTZSB0cmF0YSBkZWwgbWF5b3IgcG9yY2VudGFqZSBkZSB1c28gYSBuaXZlbCBtdW5kaWFsLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiPkVsIGdvYmllcm5vIGhvbGFuZMOpcyBsYW56YSBlbCBwcm95ZWN0byA8aT5TaGUgRGVjaWRlczwvaT4gcGFyYSBjb250cmFycmVzdGFyIGxhIHJldGlyYWRhIGRlIGZvbmRvcyBwYXJhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIGRlIFRydW1wLjwvYT4nXG4gICAgICAnUEVSJzogJzxhIGhyZWY9XCJodHRwczovL2ludGVyYWN0aXZlLnF1aXB1LXByb2plY3QuY29tLyMvZXMvcXVpcHUvaW50cm9cIj5FbiBsYSDDqXBvY2EgZGUgbG9zIDkwLCBkdXJhbnRlIGVsIGdvYmllcm5vIGRlIEZ1amltb3JpLCBtw6FzIGRlIDI1MC4wMDAgbXVqZXJlcyBmdWVyb24gZXN0ZXJpbGl6YWRhcyBzaW4gc3UgY29uc2VudGltaWVudG8uPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIj4gRW4gdW4gcGHDrXMgZG9uZGUgZWwgYWJvcnRvIGRlbCBlc3TDoSBwcm9oaWJpZG8sIHRyZXMgbXVqZXJlcyBtdWVyZW4gYWwgZMOtYSBwb3IgY29tcGxpY2FjaW9uZXMgZGVyaXZhZGFzIGRlIGludGVydmVuY2lvbmVzIGlsZWdhbGVzLjwvYT4nXG4gICAgICAnUE9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5hbW5lc3R5Lm9yZy9lbi9sYXRlc3QvbmV3cy8yMDE3LzA2L3BvbGFuZC1lbWVyZ2VuY3ktY29udHJhY2VwdGlvbi1yZXN0cmljdGlvbnMtY2F0YXN0cm9waGljLWZvci13b21lbi1hbmQtZ2lybHMvXCI+RWwgR29iaWVybm8gcG9sYWNvIGRhIHVuIHBhc28gYXRyw6FzIHkgc2UgY29udmllcnRlIGVuIGVsIMO6bmljbyBwYcOtcyBkZSBsYSBVbmnDs24gRXVyb3BlYSBkb25kZSBsYSBwYXN0aWxsYSBkZWwgZMOtYSBkZXNwdcOpcyBlc3TDoSBzdWpldGEgYSBwcmVzY3JpcGNpw7NuLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCI+TGEgZ3VlcnJhIGVuIFN1ZMOhbiBlc3TDoSBjcmVhbmRvIHVuYSBjcmlzaXMgZW4gZWwgYWNjZXNvIGEgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIj5NYWRyaWQgZXMgbGEgw7puaWNhIGNvbXVuaWRhZCBxdWUgbm8gZmluYW5jaWEgYW50aWNvbmNlcHRpdm9zIGNvbiBzdXMgZm9uZG9zLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIj5FcmRvZ2FuIGRlY2xhcmEgcXVlIGxhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIG5vIGVzIHBhcmEgbG9zIG11c3VsbWFuZXMuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIj5FbiAyMDE3LCBlbCBNaW5pc3RlcmlvIGRlIFNhbHVkIGRlIFVnYW5kYSBkZWNsYXJhYmEgdW4gZGVzYWJhc3RlY2ltaWVudG8gZGUgMTUwIG1pbGxvbmVzIGRlIHByZXNlcnZhdGl2b3MgbWFzY3VsaW5vcy48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCI+RW4gSXJsYW5kYSBlcyBpbGVnYWwgYWJvcnRhciBhIG5vIHNlciBxdWUgaGF5YSB1biByaWVzZ28gcmVhbCBkZSBzYWx1ZCBwYXJhIGxhIG1hZHJlLjwvYT4nXG4gICAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIj5UcnVtcCBkYSBhIGxvcyBtw6lkaWNvcyBsaWJlcnRhZCBwYXJhIG5lZ2Fyc2UgYSByZWFsaXphciBwcm9jZWRpbWllbnRvcyBlbiBjb250cmEgZGUgc3VzIGNyZWVuY2lhcyByZWxpZ2lvc2FzLCBjb21vIGVsIGFib3J0by48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCI+TGEgZXNjYXNleiB5IGVsIHByZWNpbyBlbGV2YWRvIGRlIGxvcyBhbnRpY29uY2VwdGl2b3MgZW4gVmVuZXp1ZWxhIGluZmx1eWUgZW4gZWwgYXVtZW50byBkZSBlbWJhcmF6b3Mgbm8gZGVzZWFkb3MuPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCI+VW4gcHJveWVjdG8gZW4gWmFtYmlhICB1bmUgbGEgbWFuaWN1cmEgeSBsb3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgJ2VuJzpcbiAgICAgICdBTEInOiAnV2l0aGRyYXduIGlzIHRoZSBtb3N0IHVzZWQgY29udHJhY2VwdGl2ZSBtZXRob2QgYnkgQWxiYW5pYW4gd29tZW4uIEZ1cnRoZXJtb3JlLCBpdCBpcyB0aGUgc2Vjb25kIGNvdW50cnkgd2hlcmUgdGhlIG9wcG9zaXRpb24gb2YgdGhlIHJlc3BvbmRlbnQsIHRoZSBwYXJ0bmVyIG9yIHRoZSByZWxpZ2lvbiB0byB1c2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIGlzIHRoZSBtYWluIGJhcnJpZXIgZm9yIHVzaW5nIHRoZW0gd2hlbiB0aGV5IGFyZSBuZWVkZWQuJ1xuICAgICAgJ0FSRyc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY2xhcmluLmNvbS9zb2NpZWRhZC9jYW1wYW5hLWxleS1hYm9ydG8tY29tZW56by0yMDA1LXByb3llY3RvLXByZXNlbnRvLXZlY2VzXzBfQkp2ZGkwblB6Lmh0bWxcIj5BcHByb3hpbWF0ZWx5IGZpdmUgdGhvdXNhbmQgd29tZW4gbWFyY2hlZCBpbiBGZWJydWFyeSAyMDE4IGluIGZyb250IG9mIHRoZSBBcmdlbnRpbmUgQ29uZ3Jlc3MgdG8gZGVtYW5kIHRoZSBsZWdhbGl6YXRpb24gb2YgYWJvcnRpb24uIDwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiPk5hdHVyYWwgbWV0aG9kcyBvZiBjb250cmFjZXB0aW9uIG9uIHRoZSByaXNlIGluIEF1c3RyYWxpYSwgYWNjb3JkaW5nIHRvIGFuIGludmVzdGlnYXRpb24gb2YgTW9uYXNoIFVuaXZlcnNpdHkuIDwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5CZWxnaXVtIGhhdmUgZG9uYXRlZCAxMCBtaWxsaW9uIGV1cm9zIHRvIHRoZSA8aT5TaGUgRGVjaWRlczwvaT4gcHJveWVjdCwgbGF1bmNoZWQgYnkgdGhlIER1dGNoIGdvdmVybm1lbnQgdG8gYm9vc3QgY29udHJhY2VwdGlvbiBpbiBkZXZlbG9waW5nIGNvdW50cmllcy4gPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCI+Qm9saXZpYVxcJ3MgcGhhcm1hY2llcyBoYXZlIGRldmVsb3BlZCBhIHNlY3JldCBjb2RlIHRvIGFzayBmb3IgY29uZG9tcyBhbmQgdGhlcmVmb3JlLCB0byBhdm9pZCBzdGlnbWEgYWJvdXQgYnV5aW5nIHRoZW0uPC9hPidcbiAgICAgICdDT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTcvMDEvMDcvd29ybGQvYXNpYS9hZnRlci1vbmUtY2hpbGQtcG9saWN5LW91dHJhZ2UtYXQtY2hpbmFzLW9mZmVyLXRvLXJlbW92ZS1pdWRzLmh0bWxcIj5BZnRlciBvbmUgY2hpbGQgcG9saWNpeSwgb3V0cmFnZSBhdCBDaGluYVxcJ3Mgb2ZmZXIgdG8gcmVtb3ZlIElVRHMuPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCI+RWwgU2FsdmFkb3IgaXMgb25lIG9mIHNpeCBjb3VudHJpZXMgd2hlcmUgYWJvcnRpb24gaXMgYmFubmVkIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLCBhbmQgd29tZW4gd2hvIHVuZGVyZ28gaXQgY291bGQgZmFjZSBwcmlzb24gPC9hPidcbiAgICAgICdGSU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVsc2lua2l0aW1lcy5maS9maW5sYW5kL2ZpbmxhbmQvbmV3cy9kb21lc3RpYy8xNTI3MS1oZWxzaW5raS10by1vZmZlci15ZWFyLXMtd29ydGgtb2YtY29udHJhY2VwdGl2ZS1waWxscy10by11bmRlci0yNS15ZWFyLW9sZHMuaHRtbFwiPkhlbHNpbmtpIHRvIG9mZmVyIHllYXLigJlzIHdvcnRoIG9mIGNvbnRyYWNlcHRpdmUgcGlsbHMgdG8gdW5kZXIgMjUteWVhci1vbGRzLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiPkZyZW5jaCB3b21lbiBvcHQgZm9yIGFsdGVybmF0aXZlcyBhcyBQaWxsIHVzZSBkcm9wcy48L2E+J1xuICAgICAgJ0dNQic6ICdJbiBUaGUgR2FtYmlhLCBtYW55IHdvbWVuIHVzZSBhIHRyYWRpdGlvbmFsIG1ldGhvZCB0aGF0IGludm9sdmVzIHR5aW5nIGEgcm9wZSwgYSBicmFuY2ggb3IgYSBwaWVjZSBvZiBwYXBlciBhcm91bmQgdGhlIHdhaXN0IHdpdGggLW9yIHdpdGhvdXQtIHBocmFzZXMgZnJvbSB0aGUgS29yYW4gaW4gaXQuJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIj5BIHRyaWFsIHNjaGVtZSBpbiBHZXJtYW55IGlzIGhlbHBpbmcgd29tZW4gb24gbG93IGluY29tZXMgdG8gYXZvaWQgc2FjcmlmaWNpbmcgdGhlaXIgY29udHJhY2VwdGlvbi48L2E+J1xuICAgICAgJ0dUTSc6ICc8YSBocmVmPVwiaHR0cDovL2J1ZmYubHkvMnRhWXdjb1wiPlJlbGlnaW9uIGhhcyBhIG1ham9yIGluZmx1ZW5jZSBpbiBzZXh1YWwgZWR1Y2F0aW9uIG9mIEd1YXRlbWFsYSB5b3VuZyBwZW9wbGUuPC9hPidcbiAgICAgICdJU1InOiAnSW4gdWx0cmEgb3J0aG9kb3gganVkYWlzbSwgY29udHJhY2VwdGl2ZSB1c2UgaXMgb25seSBwZXJtaXR0ZWQgaWYgdGhlIHJhYmJpIGdpdmVzIHByZXZpb3VzIHBlcm1pc3Npb24gdG8gdGhlIHdvbWFuLidcbiAgICAgICdKUE4nOiAnSmFwYW4sIGV2ZW4gaWYgaXQgaXMgcGFydCBvZiB0aGUgZ3JvdXAgb2YgY291bnRyaWVzIHdpdGggaGlnaCBpbmNvbWUsIGhhcyB1bm1ldCBuZWVkcyBmb3IgY29udHJhY2VwdGlvbiBhdCB0aGUgbGV2ZWwgb2YgY291bnRyaWVzIHdpdGggbG93IGluY29tZS4nXG4gICAgICAnUFJLJzogJzk1JSBvZiB3b21lbiB3aG8gdXNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyBpbiBOb3J0aCBLb3JlYSBoYXZlIGNob3NlbiB0byB1c2UgSVVEcy4gSXQgaXMgdGhlIGhpZ2hlc3QgcGVyY2VudGFnZSBvZiB1c2Ugb2YgdGhpcyBtZXRob2Qgd29ybGR3aWRlLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiPkR1dGNoIGluaXRpYXRpdmUgYnJpbmdzIGluIOKCrDE4MW0gZm9yIGZhbWlseSBwbGFubmluZyBjYW1wYWlnbi48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCI+SW4gdGhlIDE5OTBzLCBBbGJlcnRvIEZ1amltb3JpLCBmb3JtZXIgcHJlc2lkZW50IG9mIFBlcnUsIGxhdW5jaGVkIGEgbmV3IGZhbWlseSBwbGFubmluZyBwcm9ncmFtbWUgdGhhdCByZXN1bHRlZCBpbiB0aGUgc3RlcmlsaXNhdGlvbiBvZiAyNzIsMDI4IHdvbWVuIGFuZCAyMiwwMDQgbWVuIGluIG9ubHkgNCB5ZWFycy48L2E+J1xuICAgICAgJ1BITCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L2p1bC8xMC9ob3ctYml0dGVyLWhlcmJzLWFuZC1ib3RjaGVkLWFib3J0aW9ucy1raWxsLXRocmVlLXdvbWVuLWEtZGF5LWluLXRoZS1waGlsaXBwaW5lc1wiPiBIb3cgYml0dGVyIGhlcmJzIGFuZCBib3RjaGVkIGFib3J0aW9ucyBraWxsIHRocmVlIHdvbWVuIGEgZGF5IGluIHRoZSBQaGlsaXBwaW5lcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiPlBvbGlzaCBHb3Zlcm5tZW50IHRha2VzIGEgc3RlcCBiYWNrIGluIHRoZSBhY2Nlc3MgdG8gdGhlIFwibW9ybmluZy1hZnRlclwiIHBpbGwgYW5kIGl0IGJlY29tZXMgdGhlIG9ubHkgRXVyb3BlYW4gY291bnRyeSB3aGVyZSB3b21lbiBuZWVkIGEgcHJlc2NyaXB0aW9uIGZvciB0aGUgdXNlIG9mIHRoaXMgY29udHJhY2VwdGl2ZSBtZXRob2QuPC9hPidcbiAgICAgICdTU0QnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9tYXkvMjUvZXZlcnkteWVhci1pLWdpdmUtYmlydGgtd2FyLWRyaXZpbmctY29udHJhY2VwdGlvbi1jcmlzaXMtc3VkYW4tbnViYS1tb3VudGFpbnNcIj5cXCdFdmVyeSB5ZWFyLCBJIGdpdmUgYmlydGhcXCc6IHdoeSB3YXIgaXMgZHJpdmluZyBhIGNvbnRyYWNlcHRpb24gY3Jpc2lzIGluIFN1ZGFuLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIj5NYWRyaWQgaXMgdGhlIG9ubHkgcmVnaW9uYWwgZ292ZXJubWVudCB0aGF0IGRvZXMgbm90IGZpbmFuY2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIHdpdGggaXRzIGZ1bmRzLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIj5UdXJrZXlcXCdzIEVyZG9nYW4gd2FybnMgTXVzbGltcyBhZ2FpbnN0IGJpcnRoIGNvbnRyb2wuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIj5JbiAyMDE3LCBVZ2FuZGEgZmFjZWQgYSAxNTAgbWlsbGlvbnMgbWFsZSBjb25kb21zIHNob3J0ZmFsbC48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCI+SXJpc2ggcmVmZXJlbmR1bSBvbiBhYm9ydGlvbiByZWZvcm0gdG8gYmUgaGVsZCBieSBlbmQgb2YgTWF5IDIwMTg8L2E+J1xuICAgICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCI+VHJ1bXAgZ2l2ZXMgaGVhbHRoIHdvcmtlcnMgbmV3IHJlbGlnaW91cyBsaWJlcnR5IHByb3RlY3Rpb25zLjwvYT4nXG4gICAgICAnVkVOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbXVuZG8vbm90aWNpYXMtYW1lcmljYS1sYXRpbmEtNDI2MzU0MTJcIj5UaGUgc2hvcnRhZ2UgYW5kIGhpZ2ggcHJpY2Ugb2YgY29udHJhY2VwdGl2ZXMgaW4gVmVuZXp1ZWxhIGluZmx1ZW5jZXMgdGhlIGluY3JlYXNlIGluIHVud2FudGVkIHByZWduYW5jaWVzPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCI+SW4gWmFtYmlhLCBhIHJhZGljYWwgbmV3IGFwcHJvYWNoIHRvIGNvbnRyYWNlcHRpb24gaXMgZ2l2aW5nIGFkb2xlc2NlbnQgZ2lybHMgdGhlIGluZm9ybWF0aW9uIGFuZCBzZXJ2aWNlcyBvZiBjb250cmFjZXB0aW9uIHdoaWxlIGRvaW5nIHRoZSBtYW5pY3VyZS48L2E+J1xuXG5cbiAgY29uc3RydWN0b3I6IChsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJfY291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzLCBtZXRob2RzX2Roc19uYW1lcywgcmVhc29uc19uYW1lcywgcmVhc29uc19kaHNfbmFtZXMpIC0+XG5cbiAgICBAc2VudGVuY2VzID0gQHNlbnRlbmNlc1tsYW5nXVxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBAY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBoaWRlIGZpbHRlcnMgJiBjbGVhciBhY3RpdmUgYnRuc1xuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKS5maW5kKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgIyBoaWRlIGZpbHRlcnMgcmVzdWx0c1xuICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcblxuICAgIGlmIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS55ZWFyXG4gICAgICAjIGxvYWQgY291bnRyeSBkaHMgZGF0YVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sICcyMDE1LTE2J1xuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBpZiBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddICE9ICcwJ1xuICAgICAgICAgIHVzZSAgICAgICAgICAgPSBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgc2VudGVuY2UpIC0+XG5cbiAgICAjY29uc29sZS5sb2cgJ3NldEFwcEl0ZW1EYXRhJywgJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG4gICAgaWYgdXNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrdXNlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuXG4gICAgaWYgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK21ldGhvZF92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5oaWRlKClcblxuICAgIGlmIHVubWV0bmVlZHNcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrdW5tZXRuZWVkcykrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuXG4gICAgaWYgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrcmVhc29uX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuXG4gICAgaWYgc2VudGVuY2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaHRtbChzZW50ZW5jZSkuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtc2VudGVuY2UnKS5oaWRlKClcblxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuICBcbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gIHNjcm9sbGFtYUluaXRpYWxpemVkID0gZmFsc2VcblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJpbXBsYW50ZVwiXG4gICAgICBcImlueWVjdGFibGVcIlxuICAgICAgXCJww61sZG9yYVwiXG4gICAgICBcImNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiY29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIm3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJhbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIm90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJpbXBsYW50XCJcbiAgICAgIFwiaW5qZWN0YWJsZVwiXG4gICAgICBcInBpbGxcIlxuICAgICAgXCJtYWxlIGNvbmRvbVwiXG4gICAgICBcImZlbWFsZSBjb25kb21cIlxuICAgICAgXCJ2YWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiZW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJvdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJzEnOiBcInDDrWxkb3JhXCJcbiAgICAgICcyJzogXCJESVVcIlxuICAgICAgJzMnOiBcImlueWVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmTDs25cIlxuICAgICAgJzYnOiBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICAnNyc6IFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICAnOCc6IFwiYWJzdGluZW5jaWEgcGVyacOzZGljYVwiXG4gICAgICAnOSc6IFwibWFyY2hhIGF0csOhc1wiXG4gICAgICAnMTAnOiBcIm90cm9zXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudGVcIlxuICAgICAgJzEzJzogXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgICcxNyc6IFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgJ2VuJzpcbiAgICAgICcxJzogXCJwaWxsXCJcbiAgICAgICcyJzogXCJJVURcIlxuICAgICAgJzMnOiBcImluamVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmRvbVwiXG4gICAgICAnNic6IFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzcnOiBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnOCc6IFwicGVyaW9kaWMgYWJzdGluZW5jZVwiXG4gICAgICAnOSc6IFwid2l0aGRyYXdhbFwiXG4gICAgICAnMTAnOiBcIm90aGVyXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudFwiXG4gICAgICAnMTMnOiBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgICcxNyc6IFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG5cblxuICAjIyNcbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcbiAgIyMjXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgICdlcyc6XG4gICAgICBcImFcIjogXCJubyBlc3TDoW4gY2FzYWRhc1wiXG4gICAgICBcImJcIjogXCJubyB0aWVuZW4gc2V4b1wiXG4gICAgICBcImNcIjogXCJ0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZVwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuXCJcbiAgICAgIFwiZVwiOiBcInNvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXNcIlxuICAgICAgXCJmXCI6IFwiYW1lbm9ycmVhIHBvc3RwYXJ0b1wiXG4gICAgICBcImdcIjogXCJlc3TDoW4gZGFuZG8gZWwgcGVjaG9cIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RhXCJcbiAgICAgIFwiaVwiOiBcImxhIG11amVyIHNlIG9wb25lXCJcbiAgICAgIFwialwiOiBcImVsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZVwiXG4gICAgICBcImtcIjogXCJvdHJvcyBzZSBvcG9uZW5cIiAgICAgICAgXG4gICAgICBcImxcIjogXCJwcm9oaWJpY2nDs24gcmVsaWdpb3NhXCIgIFxuICAgICAgXCJtXCI6IFwibm8gY29ub2NlIGxvcyBtw6l0b2Rvc1wiXG4gICAgICBcIm5cIjogXCJubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3NcIlxuICAgICAgXCJvXCI6IFwicHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgXCJwXCI6IFwibWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcy9wcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiIFxuICAgICAgXCJxXCI6IFwiZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvc1wiXG4gICAgICBcInJcIjogXCJjdWVzdGFuIGRlbWFzaWFkb1wiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzb1wiXG4gICAgICBcInRcIjogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgICBcInVcIjogXCJlbCBtw6l0b2RvIGVsZWdpZG8gbm8gZXN0w6EgZGlzcG9uaWJsZVwiXG4gICAgICBcInZcIjogXCJubyBoYXkgbcOpdG9kb3MgZGlzcG9uaWJsZXNcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3Ryb3NcIlxuICAgICAgXCJ6XCI6IFwibm8gbG8gc8OpXCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKSJ3MgcHJvY2Vzc2VzXCJcbiAgICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gIHJlYXNvbnNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAndjNhMDhhJzogJ25vIGVzdMOhbiBjYXNhZGFzJ1xuICAgICAgJ3YzYTA4Yic6ICdubyB0aWVuZW4gc2V4bydcbiAgICAgICd2M2EwOGMnOiAndGllbmVuIHNleG8gaW5mcmVjdWVudGUnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs24nXG4gICAgICAndjNhMDhlJzogJ3NvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXMnXG4gICAgICAndjNhMDhmJzogJ2FtZW5vcnJlYSBwb3N0cGFydG8nXG4gICAgICAndjNhMDhnJzogJ2VzdMOhbiBkYW5kbyBlbCBwZWNobydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RhJ1xuICAgICAgJ3YzYTA4aSc6ICdsYSBtdWplciBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGonOiAnZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4ayc6ICdvdHJvcyBzZSBvcG9uZW4nICAgICAgICBcbiAgICAgICd2M2EwOGwnOiAncHJvaGliaWNpw7NuIHJlbGlnaW9zYSdcbiAgICAgICd2M2EwOG0nOiAnbm8gY29ub2NlIGxvcyBtw6l0b2RvcydcbiAgICAgICd2M2EwOG4nOiAnbm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zJ1xuICAgICAgJ3YzYTA4byc6ICdwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZCdcbiAgICAgICd2M2EwOHAnOiAnbWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcydcbiAgICAgICd2M2EwOHEnOiAnZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvcydcbiAgICAgICd2M2EwOHInOiAnY3Vlc3RhbiBkZW1hc2lhZG8nXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudGVzIHBhcmEgc3UgdXNvJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICdlbic6IFxuICAgICAgJ3YzYTA4YSc6ICdub3QgbWFycmllZCdcbiAgICAgICd2M2EwOGInOiAnbm90IGhhdmluZyBzZXgnXG4gICAgICAndjNhMDhjJzogJ2luZnJlcXVlbnQgc2V4J1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2FsL2h5c3RlcmVjdG9teSdcbiAgICAgICd2M2EwOGUnOiAnc3ViZmVjdW5kL2luZmVjdW5kJ1xuICAgICAgJ3YzYTA4Zic6ICdwb3N0cGFydHVtIGFtZW5vcnJoZWljJ1xuICAgICAgJ3YzYTA4Zyc6ICdicmVhc3RmZWVkaW5nJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGljJ1xuICAgICAgJ3YzYTA4aSc6ICdyZXNwb25kZW50IG9wcG9zZWQnXG4gICAgICAndjNhMDhqJzogJ2h1c2JhbmQvcGFydG5lciBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4ayc6ICdvdGhlcnMgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGwnOiAncmVsaWdpb3VzIHByb2hpYml0aW9uJ1xuICAgICAgJ3YzYTA4bSc6ICdrbm93cyBubyBtZXRob2QnXG4gICAgICAndjNhMDhuJzogJ2tub3dzIG5vIHNvdXJjZSdcbiAgICAgICd2M2EwOG8nOiAnaGVhbHRoIGNvbmNlcm5zJ1xuICAgICAgJ3YzYTA4cCc6ICdmZWFyIG9mIHNpZGUgZWZmZWN0cydcbiAgICAgICd2M2EwOHEnOiAnbGFjayBvZiBhY2Nlc3MvdG9vIGZhcidcbiAgICAgICd2M2EwOHInOiAnY29zdHMgdG9vIG11Y2gnXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudCB0byB1c2UnXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZlcmVzIHdpdGggdGhlIGJvZHkncyBwcm9jZXNzZXNcIlxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgZGF0YUluZGV4ID0gWzAuLjk5XVxuICAgIHVzZUdyYXBoID0gZDMuc2VsZWN0KCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJylcbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcblxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPiA0ODAgdGhlbiAoZ3JhcGhXaWR0aCAvIDIwKSAtIDEwIGVsc2UgKGdyYXBoV2lkdGggLyAyMCkgLSA0XG4gICAgICAgIGl0ZW1zSGVpZ2h0ID0gMi4zMyppdGVtc1dpZHRoXG4gICAgICAgICNpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuICcxMCUnIGVsc2UgJzUlJ1xuICAgICAgICAjaXRlbXNIZWlnaHQgPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gZ3JhcGhXaWR0aCAqIDAuMSAvIDAuNzUgZWxzZSBncmFwaFdpZHRoICogMC4wNSAvIDAuNzVcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLnN0eWxlICd3aWR0aCcsIGl0ZW1zV2lkdGgrJ3B4J1xuICAgICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaXRlbXNIZWlnaHQrJ3B4J1xuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgICAgICAgLmF0dHIgJ3dpZHRoJywgaXRlbXNXaWR0aFxuICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCBpdGVtc0hlaWdodFxuICAgICAgdXNlR3JhcGguc3R5bGUgJ21hcmdpbi10b3AnLCAoKCQoJ2JvZHknKS5oZWlnaHQoKS11c2VHcmFwaC5ub2RlKCkub2Zmc2V0SGVpZ2h0KSouNSkrJ3B4J1xuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICdjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgtY29udGFpbmVyJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgaWYgY3VycmVudFN0ZXAgPiAwXG4gICAgICAgIGRhdGEgPSBbNjQsIDg4LCAxMDBdICMgNjQsIDY0KzI0LCA2NCsyNCsxMlxuICAgICAgICBmcm9tID0gaWYgY3VycmVudFN0ZXAgPiAxIHRoZW4gZGF0YVtjdXJyZW50U3RlcC0yXSBlbHNlIDBcbiAgICAgICAgdG8gPSBkYXRhW2N1cnJlbnRTdGVwLTFdXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQgPj0gZnJvbSBhbmQgZCA8IHRvXG4gICAgICAgICAgLmNsYXNzZWQgJ2ZpbGwtJytjdXJyZW50U3RlcCwgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICByZXNpemVIYW5kbGVyKClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgcmVzaXplSGFuZGxlclxuXG5cbiAgIyBVbm1lZXQgTmVlZHMgdnMgR0RQIGdyYXBoXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCA9IChkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllcykgLT5cblxuICAgICMgcGFyc2UgZGF0YVxuICAgIGRhdGEgPSBbXVxuICAgIGRhdGFfdW5tZXRuZWVkcy5mb3JFYWNoIChkKSAtPlxuICAgICAgY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGlmIGNvdW50cnlbMF0gYW5kIGNvdW50cnlbMF1bJ2duaSddXG4gICAgICAgICAgZGF0YS5wdXNoXG4gICAgICAgICAgICB2YWx1ZTogICAgICArZFsnZXN0aW1hdGVkJ11cbiAgICAgICAgICAgIGlkOiAgICAgICAgIGNvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgbmFtZTogICAgICAgY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBwb3B1bGF0aW9uOiArY291bnRyeVswXVsncG9wdWxhdGlvbiddXG4gICAgICAgICAgICBnbmk6ICAgICAgICArY291bnRyeVswXVsnZ25pJ11cbiAgICAgICMjI1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnTm8gR05JIG9yIFBvcHVsYXRpb24gZGF0YSBmb3IgdGhpcyBjb3VudHJ5JywgZC5jb2RlLCBjb3VudHJ5WzBdXG4gICAgICAjIyNcblxuICAgICMgc2V0dXAgZ3JhcGhcbiAgICB1bm1ldG5lZWRzR3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDVcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICAgICAgJ2duaSdcbiAgICAgICAgeTogICAgICAndmFsdWUnXG4gICAgICAgIGlkOiAgICAgJ2lkJ1xuICAgICAgICBsYWJlbDogICduYW1lJ1xuICAgICAgICBjb2xvcjogICd2YWx1ZSdcbiAgICAgICAgc2l6ZTogICAncG9wdWxhdGlvbidcbiAgICAgIGRvdE1pblNpemU6IDFcbiAgICAgIGRvdE1heFNpemU6IDMyXG4gICAgdW5tZXRuZWVkc0dyYXBoLnNldERhdGEgZGF0YVxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtY29udGFpbmVyLWdyYXBoJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgY3VycmVudFN0ZXBcblxuICAgICQod2luZG93KS5yZXNpemUgdW5tZXRuZWVkc0dyYXBoLm9uUmVzaXplXG5cblxuICAjIFVzZSAmIFJlYXNvbnMgbWFwc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgPSAoZGF0YV91c2UsIGNvdW50cmllcywgbWFwKSAtPlxuXG4gICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAjZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgIyMjXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG4gICAgICAjIyNcbiAgICBcbiAgICAjIFNldCB1c2UgbWFwXG4gICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiA2MFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGxlZ2VuZDogdHJ1ZVxuICAgICAgbGFuZzogbGFuZ1xuICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAnY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcicsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIHVzZU1hcC5zZXRNYXBTdGF0ZSBjdXJyZW50U3RlcCAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcblxuICAgICMgc2V0dXAgcmVzaXplXG4gICAgdXNlTWFwLm9uUmVzaXplKClcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZU1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgVHJlZW5hcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwID0gKGRhdGFfdXNlKSAtPlxuXG4gICAgIyBzZXR1cCB0cmVlbWFwXG4gICAgdXNlVHJlZW1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHZhbHVlOiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgIG1ldGhvZHNLZXlzOiBtZXRob2RzX2tleXNcbiAgICAgIG1ldGhvZHNOYW1lczogbWV0aG9kc19uYW1lc1tsYW5nXVxuICAgICMgc2V0IGRhdGFcbiAgICB1c2VUcmVlbWFwLnNldERhdGEgZGF0YV91c2UsIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgaWYgY3VycmVudFN0ZXAgPT0gMVxuICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgJ3dvcmxkJywgJ011bmRvJ1xuICAgICAgZWxzZSBpZiBjdXJyZW50U3RlcCA9PSAwIGFuZCBlLmRpcmVjdGlvbiA9PSAndXAnXG4gICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG5cbiAgICAjIHNldCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZVRyZWVtYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgUmVhc29ucyBPcHBvc2l0aW9uIEdyYXBoc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFJlYXNvbnNPcHBvc2VkR3JhcGggPSAtPlxuICAgICRiYXJzID0gJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCAuYmFyJylcbiAgICAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLWxlZ2VuZCBsaScpXG4gICAgICAubW91c2VvdmVyIC0+XG4gICAgICAgICRiYXJzXG4gICAgICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgLmZpbHRlcignLmJhci0nKyQodGhpcykuYXR0cignY2xhc3MnKSlcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgLm1vdXNlb3V0IC0+XG4gICAgICAgICRiYXJzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG5cblxuICBvbkNhcm91c2VsU3RlcCA9IChlKSAtPlxuICAgIGN1cnJlbnRTdGVwID0gZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAjY29uc29sZS5sb2cgJ2Nhcm91c2VsJywgY3VycmVudFN0ZXBcbiAgICBAZ3JhcGhpYy5zZWxlY3RBbGwoJy5hY3RpdmUnKS5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgIEBncmFwaGljLnNlbGVjdCgnLnN0ZXAtJytjdXJyZW50U3RlcCkuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG5cbiAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gIHNldHVwTW9ydGFsaXR5TGluZUdyYXBoID0gIC0+XG4gICAgZGF0YSA9IFt7XG4gICAgICAnMTk5MCc6IDM4NVxuICAgICAgJzE5OTUnOiAzNjlcbiAgICAgICcyMDAwJzogMzQxXG4gICAgICAnMjAwNSc6IDI4OFxuICAgICAgJzIwMTAnOiAyNDZcbiAgICAgICcyMDE1JzogMjE2XG4gICAgfV1cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdtYXRlcm5hbC1tb3J0YWxpdHktZ3JhcGgnLFxuICAgICAgaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46IGxlZnQ6IDIwKVxuICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzE5OTUsIDIwMDUsIDIwMTVdXG4gICAgZ3JhcGgueUF4aXNcbiAgICAgIC50aWNrVmFsdWVzIFsxMDAsIDIwMCwgMzAwXVxuICAgICAgLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcuMHMnKVxuICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gLT4gcmV0dXJuIFswLCAzODVdXG4gICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgc2V0TG9jYXRpb24gPSAobG9jYXRpb24sIGNvdW50cmllcykgLT5cbiAgICBpZiBsb2NhdGlvblxuICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgZWxzZVxuICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuXG4gIHNldHVwRGF0YUFydGljbGUgPSAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgYWRkIGNvdW50cnkgSVNPIDMxNjYtMSBhbHBoYS0zIGNvZGUgdG8gZGF0YV9yZWFzb25zXG4gICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlMiA9PSBkLmNvZGVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5jb2RlID0gaXRlbVswXS5jb2RlXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzW2xhbmddKS5mb3JFYWNoIChyZWFzb24pIC0+XG4gICAgICAgICAgZFtyZWFzb25dID0gMTAwKmRbcmVhc29uXVxuICAgICAgICAgIGlmIGRbcmVhc29uXSA+IDEwMFxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ0FsZXJ0ISBWYWx1ZSBncmVhdGVyIHRoYW4gemVyby4gJyArIGQuY291bnRyeSArICcsICcgKyByZWFzb24gKyAnOiAnICsgZFtyZWFzb25dXG4gICAgICAgIGRlbGV0ZSBkLmNvdW50cnlcbiAgICAgICMjI1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gJ05vIGNvdW50cnkgZGF0YSBmb3IgJytkLmNvZGVcbiAgICAgICMjI1xuXG4gICAgaWYgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgZGF0YV91c2VcblxuICAgIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgZGF0YV91c2UsIGNvdW50cmllcywgbWFwXG5cbiAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgICBpZiAkKCcjdW5tZXQtbmVlZHMtZ2RwLWdyYXBoJykubGVuZ3RoXG4gICAgICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCBkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllc1xuXG4gICAgaWYgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcycpLmxlbmd0aFxuICAgICAgbmV3IFNjcm9sbEdyYXBoICdjYXJvdXNlbC1tYXJpZS1zdG9wZXMnLCBvbkNhcm91c2VsU3RlcFxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoKClcblxuICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXVxuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gICMgZGF0YSBhcnRpY2xlXG4gIGlmICQoJ2JvZHknKS5oYXNDbGFzcygnZGF0b3MtdXNvLWJhcnJlcmFzJykgb3IgJCgnYm9keScpLmhhc0NsYXNzKCdkYXRhLXVzZS1iYXJyaWVycycpXG4gICAgIyBMb2FkIGxvY2F0aW9uXG4gICAgZDMuanNvbiAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJywgKGVycm9yLCBsb2NhdGlvbikgLT5cbiAgICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgICAgZDMucXVldWUoKVxuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktcG9wdWxhdGlvbi0yMDE2LmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgICBzZXRMb2NhdGlvbiBsb2NhdGlvbiwgY291bnRyaWVzXG4gICAgICAgICAgc2V0dXBEYXRhQXJ0aWNsZSBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwXG5cbiAgIyByZWxpZ2lvbiBhcnRpY2xlXG4gIGVsc2UgaWYgJCgnYm9keScpLmhhc0NsYXNzICdyZWxpZ2lvbidcbiAgICBpZiAkKCcjY2Fyb3VzZWwtcmFiaW5vcycpLmxlbmd0aFxuICAgICAgbmV3IFNjcm9sbEdyYXBoICdjYXJvdXNlbC1yYWJpbm9zJywgb25DYXJvdXNlbFN0ZXBcbiAgICBpZiAkKCcjY2Fyb3VzZWwtaW1hbScpLmxlbmd0aFxuICAgICAgbmV3IFNjcm9sbEdyYXBoICdjYXJvdXNlbC1pbWFtJywgb25DYXJvdXNlbFN0ZXBcbiAgICBpZiAkKCcjY2Fyb3VzZWwtcGFwYScpLmxlbmd0aFxuICAgICAgbmV3IFNjcm9sbEdyYXBoICdjYXJvdXNlbC1wYXBhJywgb25DYXJvdXNlbFN0ZXBcbiAgICBpZiAkKCcjbWF0ZXJuYWwtbW9ydGFsaXR5LWdyYXBoJykubGVuZ3RoXG4gICAgICBzZXR1cE1vcnRhbGl0eUxpbmVHcmFwaCgpXG5cbiAgICMgZGF0YSBzdGF0aWMgYXJ0aWNsZVxuICBlbHNlIGlmICQoJ2JvZHknKS5oYXNDbGFzcyAnZGF0b3MtdXNvLWJhcnJlcmFzLXN0YXRpYydcbiAgICAjIExvYWQgbG9jYXRpb25cbiAgICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICAgICBkMy5xdWV1ZSgpXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAgIHNldExvY2F0aW9uIGxvY2F0aW9uLCBjb3VudHJpZXNcbiAgICAgICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgICAgICBuZXcgQ29udHJhY2VwdGl2ZXNBcHAgbGFuZywgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyQ291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzW2xhbmddLCBtZXRob2RzX2Roc19uYW1lc1tsYW5nXSwgcmVhc29uc19uYW1lc1tsYW5nXSwgcmVhc29uc19kaHNfbmFtZXNbbGFuZ11cblxuKSBqUXVlcnlcbiJdfQ==
