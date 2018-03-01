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
    };

    function ContraceptivesApp(data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names) {
      this.onSelectFilter = bind(this.onSelectFilter, this);
      this.onSelectCountry = bind(this.onSelectCountry, this);
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
        return new ContraceptivesApp(data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
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
            return new ContraceptivesApp(data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
          }
        });
      });
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwic2Nyb2xsLWdyYXBoLmNvZmZlZSIsIm1hcC1ncmFwaC5jb2ZmZWUiLCJsaW5lLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFE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Rkc7O0VBbGhCTixDQUFELENBQUEsQ0FpaUJFLE1BamlCRjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgaWYgQHN2Z1xuICAgICAgQHN2Z1xuICAgICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5TY3JvbGxHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChfaWQsIF9zdGVwQ2FsbGJhY2spIC0+XG4gICAgQGlkID0gX2lkXG4gICAgQHN0ZXBDYWxsYmFjayA9IF9zdGVwQ2FsbGJhY2tcbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpXG4gICAgQGdyYXBoaWMgICA9IEBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIEBzdGVwcyAgICAgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnNjcm9sbC10ZXh0IC5zdGVwJylcbiAgICBAY2hhcnQgICAgID0gQGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgQHNjcm9sbGVyID0gc2Nyb2xsYW1hKClcbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIEBvblJlc2l6ZSgpXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIEBzY3JvbGxlclxuICAgICAgLnNldHVwXG4gICAgICAgIGNvbnRhaW5lcjogICcjJytAaWQgICAgICAgICAgICAgICAjIG91ciBvdXRlcm1vc3Qgc2Nyb2xseXRlbGxpbmcgZWxlbWVudFxuICAgICAgICBncmFwaGljOiAgICAnIycrQGlkKycgLnNjcm9sbC1ncmFwaGljJyAgICAgIyB0aGUgZ3JhcGhpY1xuICAgICAgICBzdGVwOiAgICAgICAnIycrQGlkKycgLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjA1ICAgICAgICAgICAgICAgICAgIyBzZXQgdGhlIHRyaWdnZXIgdG8gYmUgMS8yIHdheSBkb3duIHNjcmVlblxuICAgICAgICBkZWJ1ZzogICAgICBmYWxzZSAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgQG9uQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBAb25Db250YWluZXJFeGl0XG4gICAgICAub25TdGVwRW50ZXIgICAgICBAb25TdGVwRW50ZXJcbiAgICAjIHNldHVwIHJlc2l6ZSBldmVudFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCBAb25SZXNpemVcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHJlc2l6ZSBmdW5jdGlvbiB0byBzZXQgZGltZW5zaW9ucyBvbiBsb2FkIGFuZCBvbiBwYWdlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICB3aWR0aCA9IEBncmFwaGljLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAjTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgIyAxLiB1cGRhdGUgaGVpZ2h0IG9mIHN0ZXAgZWxlbWVudHMgZm9yIGJyZWF0aGluZyByb29tIGJldHdlZW4gc3RlcHNcbiAgICBAc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAjIDIuIHVwZGF0ZSBoZWlnaHQgb2YgZ3JhcGhpYyBlbGVtZW50XG4gICAgQGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAjIDMuIHVwZGF0ZSB3aWR0aCBvZiBjaGFydFxuICAgIEBjaGFydFxuICAgICAgLnN0eWxlICd3aWR0aCcsIHdpZHRoKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgQHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgb25Db250YWluZXJFbnRlcjogKGUpID0+XG4gICAgQGdyYXBoaWNcbiAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBmYWxzZVxuXG4gICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gIG9uQ29udGFpbmVyRXhpdDogKGUpID0+XG4gICAgQGdyYXBoaWNcbiAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgIyBjYWxsIHN0ZXBDYWxsYmFjayBvbiBlbnRlciBzdGVwXG4gIG9uU3RlcEVudGVyOiAoZSkgPT5cbiAgICBAc3RlcENhbGxiYWNrKGUpXG4iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuTGluZUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgeUZvcm1hdDogZDMuZm9ybWF0KCdkJykgICAjIHNldCBsYWJlbHMgaG92ZXIgZm9ybWF0XG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTGluZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMgZGF0YVxuICAgIHN1cGVyKGRhdGEpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgeWVhcnMgPSBbXVxuICAgIGQzLmtleXMoZGF0YVswXSkuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGlmICtkXG4gICAgICAgIHllYXJzLnB1c2ggK2RcbiAgICByZXR1cm4geWVhcnMuc29ydCgpXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkW0BvcHRpb25zLmtleS54XSwgJ2VuICcsIHllYXIpO1xuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhIFxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcnKVxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICMgc2V0dXAgbGluZVxuICAgIEBsaW5lID0gZDMubGluZSgpXG4gICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAueCAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgLnkgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgIyBzZXR1cCBhcmVhXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYSA9IGQzLmFyZWEoKVxuICAgICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAgIC54ICAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgICAueTAgQGhlaWdodFxuICAgICAgICAueTEgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFtAeWVhcnNbMF0sIEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXVxuXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gWzAsIGQzLm1heCBAZGF0YSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZC52YWx1ZXMpKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBjbGVhciBncmFwaCBiZWZvcmUgc2V0dXBcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmdyYXBoJykucmVtb3ZlKClcbiAgICAjIGRyYXcgZ3JhcGggY29udGFpbmVyIFxuICAgIEBncmFwaCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdncmFwaCdcbiAgICAjIGRyYXcgbGluZXNcbiAgICBAZHJhd0xpbmVzKClcbiAgICAjIGRyYXcgYXJlYXNcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBkcmF3QXJlYXMoKVxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGRyYXdMYWJlbHMoKVxuICAgICMgZHJhdyBtb3VzZSBldmVudHMgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBkcmF3TGluZUxhYmVsSG92ZXIoKVxuICAgICAgIyBlbHNlXG4gICAgICAjICAgQGRyYXdUb29sdGlwKClcbiAgICAgIEBkcmF3UmVjdE92ZXJsYXkoKVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBhcmVhIHkwXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYS55MCBAaGVpZ2h0XG4gICAgIyB1cGRhdGUgeSBheGlzIHRpY2tzIHdpZHRoXG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcub3ZlcmxheScpXG4gICAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGluZXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLScgKyBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5kYXR1bSAoZCkgLT4gcmV0dXJuIGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG5cbiAgZHJhd0FyZWFzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2FyZWEnXG4gICAgICAuYXR0ciAgJ2lkJywgICAgKGQpID0+ICdhcmVhLScgKyBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5kYXR1bSAoZCkgLT4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGFyZWFcblxuICBkcmF3TGFiZWxzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbCdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ2VuZCdcbiAgICAgIC5hdHRyICdkeScsICctMC4xMjVlbSdcbiAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuXG4gIGRyYXdMaW5lTGFiZWxIb3ZlcjogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLXBvaW50LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbC1wb2ludCdcbiAgICAgIC5hdHRyICdyJywgNFxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ3RpY2staG92ZXInXG4gICAgICAuYXR0ciAnZHknLCAnMC43MWVtJyAgICAgIFxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICBpZiBAZGF0YS5sZW5ndGggPT0gMVxuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbC1ob3ZlcidcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJy0wLjVlbSdcbiAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgZHJhd1JlY3RPdmVybGF5OiAtPlxuICAgIEBjb250YWluZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdvdmVybGF5J1xuICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlTW92ZVxuICAgICAgLm9uICdtb3VzZW91dCcsICBAb25Nb3VzZU91dFxuICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcblxuICBzZXRMYWJlbERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgQHdpZHRoXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkLnZhbHVlc1tAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV0pXG5cbiAgc2V0T3ZlcmxheURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd3aWR0aCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBoZWlnaHRcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJGVsLnRyaWdnZXIgJ21vdXNlb3V0J1xuICAgIEBoaWRlTGFiZWwoKVxuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICB5ZWFyID0gTWF0aC5yb3VuZCBAeC5pbnZlcnQocG9zaXRpb25bMF0pXG4gICAgaWYgeWVhciAhPSBAY3VycmVudFllYXJcbiAgICAgIEAkZWwudHJpZ2dlciAnY2hhbmdlLXllYXInLCB5ZWFyXG4gICAgICBAc2V0TGFiZWwgeWVhclxuXG4gIHNldExhYmVsOiAoeWVhcikgLT5cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5lYWNoIChkKSA9PiBAc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbiBkXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIC5hdHRyICd4JywgTWF0aC5yb3VuZCBAeChAY3VycmVudFllYXIpXG4gICAgICAudGV4dCBAY3VycmVudFllYXJcblxuICBoaWRlTGFiZWw6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb246IChkYXRhKSA9PlxuICAgICMgZ2V0IGN1cnJlbnQgeWVhclxuICAgIHllYXIgPSBAY3VycmVudFllYXJcbiAgICB3aGlsZSBAeWVhcnMuaW5kZXhPZih5ZWFyKSA9PSAtMSAmJiBAY3VycmVudFllYXIgPiBAeWVhcnNbMF1cbiAgICAgIHllYXItLVxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICAjIGdldCBwb2ludCAmIGxhYmVsXG4gICAgcG9pbnQgPSBkMy5zZWxlY3QoJyNsaW5lLWxhYmVsLXBvaW50LScrZGF0YVtAb3B0aW9ucy5rZXkuaWRdKVxuICAgIGxhYmVsID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAjIGhpZGUgcG9pbnQgJiBsYWJlbCBpcyB0aGVyZSBpcyBubyBkYXRhXG4gICAgdW5sZXNzIGRhdGEudmFsdWVzW3llYXJdXG4gICAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIHJldHVyblxuICAgICMgc2hvdyBwb2ludCAmIGxhYmVsIGlmIHRoZXJlJ3MgZGF0YVxuICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAjIHNldCBsaW5lIGxhYmVsIHBvaW50XG4gICAgcG9pbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgIyBzZXQgbGluZSBsYWJlbCBob3ZlclxuICAgIGxhYmVsXG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5Rm9ybWF0KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlICcnXG4gICAgICBcbiAgc2V0VGlja0hvdmVyUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAneScsIE1hdGgucm91bmQgQGhlaWdodCtAb3B0aW9ucy5tYXJnaW4udG9wKzkiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFszMCwgMjVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NhbmFkw6EnXG4gICAgICAgICAgICBlbjogJ0NhbmFkYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzJcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ29yZWEgZGVsIE5vcnRlJ1xuICAgICAgICAgICAgZW46ICdOb3J0aCBLb3JlYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2hpbmEnXG4gICAgICAgICAgICBlbjogJ0NoaW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ1BpbGwnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdww61sZG9yYSdcbiAgICAgICAgZW46ICdwaWxsJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMzUsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FyZ2VsaWEnXG4gICAgICAgICAgICBlbjogJ0FsZ2VyaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBjb25kb20nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdwcmVzZXJ2YXRpdm8gbWFzY3VsaW5vJ1xuICAgICAgICBlbjogJ21hbGUgY29uZG9tJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTQyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMzNVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdHcmVjaWEnXG4gICAgICAgICAgICBlbjogJ0dyZWVjZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNzRcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzE1LCAtMTBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0JvdHN1YW5hJ1xuICAgICAgICAgICAgZW46ICdCb3Rzd2FuYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJbmplY3RhYmxlJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnaW55ZWN0YWJsZSdcbiAgICAgICAgZW46ICdpbmplY3RhYmxlJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNjJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNTVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzE1LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdFdGlvcMOtYSdcbiAgICAgICAgICAgIGVuOiAnRXRoaW9waWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zXG4gICAgICAgICAgcjogMTZcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTI2LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCYWxjYW5lcydcbiAgICAgICAgICAgIGVuOiAnQmFsa2FucydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTAsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FsYmFuaWEnXG4gICAgICAgICAgICBlbjogJ0FsYmFuaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICBnZXRMZWdlbmREYXRhOiAtPlxuICAgIHJldHVybiBbMCwyMCw0MCw2MCw4MF1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkKyclJ1xuXG4gICMgb3ZlcnJpZGUgZ2V0RGltZW5zaW9uc1xuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIG9mZnNldCA9IDEwMFxuICAgIGlmIEAkZWxcbiAgICAgIGJvZHlIZWlnaHQgPSAkKCdib2R5JykuaGVpZ2h0KCktb2Zmc2V0XG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgICNAJGVsLmNzcyAndG9wJywgMFxuICAgICAgIyB2ZXJ0aWNhbCBjZW50ZXIgZ3JhcGhcbiAgICAgICNlbHNlXG4gICAgICAjICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG5cblxuICAjIG92ZXJyaWRlIGNvbG9yIGRvbWFpblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCA4MF1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICBzdXBlcihtYXApXG4gICAgQHJpbmdOb3RlID0gZDMucmluZ05vdGUoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIEBjdXJyZW50TWV0aG9kID0gQHN0YXRlc1tAY3VycmVudFN0YXRlLTFdXG4gICAgICBpZiBAY3VycmVudE1ldGhvZFxuICAgICAgICAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIEBjdXJyZW50TWV0aG9kLnRleHRbQG9wdGlvbnMubGFuZ11cbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT4gZC52YWx1ZSA9ICtkW0BjdXJyZW50TWV0aG9kLmlkXVxuICAgICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiAgICAgICAgQHNldEFubm90YXRpb25zKClcblxuICBzZXRBbm5vdGF0aW9uczogLT5cbiAgICBpZiBAY3VycmVudE1ldGhvZFxuICAgICAgQGN1cnJlbnRNZXRob2QubGFiZWxzLmZvckVhY2ggKGQpID0+IFxuICAgICAgICBkLmN4ID0gZC5jeF9mYWN0b3IqQHdpZHRoXG4gICAgICAgIGQuY3kgPSBkLmN5X2ZhY3RvcipAaGVpZ2h0XG4gICAgICAgIGQudGV4dCA9IGQubGFiZWxbQG9wdGlvbnMubGFuZ11cbiAgICAgIEBjb250YWluZXIuY2FsbCBAcmluZ05vdGUsIEBjdXJyZW50TWV0aG9kLmxhYmVsc1xuIiwiY2xhc3Mgd2luZG93LlRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgb3B0aW9ucy5taW5TaXplID0gb3B0aW9ucy5taW5TaXplIHx8IDYwXG4gICAgb3B0aW9ucy5ub2Rlc1BhZGRpbmcgPSBvcHRpb25zLm5vZGVzUGFkZGluZyB8fCA4XG4gICAgb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiB8fCA2MDBcbiAgICBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgPSBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgfHwgNjIwXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIGRyYXcgc2NhbGVzXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJyaWRlIHNldFNWRyB0byB1c2UgYSBkaXYgY29udGFpbmVyIChub2Rlcy1jb250YWluZXIpIGluc3RlYWQgb2YgYSBzdmcgZWxlbWVudFxuICBzZXRTVkc6IC0+XG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZXMtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgQHRyZWVtYXAgPSBkMy50cmVlbWFwKClcbiAgICAgIC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgICAucGFkZGluZyAwXG4gICAgICAucm91bmQgdHJ1ZVxuXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG5cbiAgICBAc3RyYXRpZnkgPSBkMy5zdHJhdGlmeSgpLnBhcmVudElkIChkKSAtPiBkLnBhcmVudFxuXG4gICAgQHVwZGF0ZUdyYXBoKClcblxuICAgIHJldHVybiBAXG5cblxuICB1cGRhdGVHcmFwaDogLT5cblxuICAgICMgdXBkYXRlIHRyZW1hcCBcbiAgICBAdHJlZW1hcFJvb3QgPSBAc3RyYXRpZnkoQGRhdGEpXG4gICAgICAuc3VtIChkKSA9PiBkW0BvcHRpb25zLmtleS52YWx1ZV1cbiAgICAgIC5zb3J0IChhLCBiKSAtPiBiLnZhbHVlIC0gYS52YWx1ZVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyB1cGRhdGUgbm9kZXNcbiAgICBub2RlcyA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICBcbiAgICBub2Rlcy5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2RlJ1xuICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbCdcbiAgICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsLWNvbnRlbnQnXG4gICAgICAgICAgLmFwcGVuZCAncCdcblxuICAgICMgc2V0dXAgbm9kZXNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmNhbGwgQHNldE5vZGVcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuXG4gICAgIyBhZGQgbGFiZWwgb25seSBpbiBub2RlcyB3aXRoIHNpemUgZ3JlYXRlciB0aGVuIG9wdGlvbnMubWluU2l6ZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuY2FsbCAgIEBzZXROb2RlTGFiZWxcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICBub2Rlcy5leGl0KCkucmVtb3ZlKClcblxuICAgIHJldHVybiBAXG5cblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcblxuICAgIEBjb250YWluZXIuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gICAgIyBVcGRhdGUgdHJlbWFwIHNpemVcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcbiAgICBlbHNlXG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTcXVhcmlmeVxuICAgIEB0cmVlbWFwLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgVXBkYXRlIG5vZGVzIGRhdGFcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcbiAgICAgIFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgcmV0dXJuIEBcblxuXG4gIHNldE5vZGU6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY2xhc3MnLCAgICAgICBAZ2V0Tm9kZUNsYXNzXG4gICAgICAuc3R5bGUgJ3BhZGRpbmcnLCAgICAoZCkgPT4gaWYgKGQueDEtZC54MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nICYmIGQueTEtZC55MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nKSB0aGVuIEBvcHRpb25zLm5vZGVzUGFkZGluZysncHgnIGVsc2UgMFxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgKGQpIC0+IGlmIChkLngxLWQueDAgPT0gMCkgfHwgKGQueTEtZC55MCA9PSAwKSB0aGVuICdoaWRkZW4nIGVsc2UgJydcblxuICBzZXROb2RlRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpIC0+IGQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSAtPiBkLnkwICsgJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgLT4gZC54MS1kLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCAoZCkgLT4gZC55MS1kLnkwICsgJ3B4J1xuXG4gIHNldE5vZGVMYWJlbDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uc2VsZWN0KCdwJylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiByZXR1cm4gaWYgZC52YWx1ZSA+IDI1IHRoZW4gJ3NpemUtbCcgZWxzZSBpZiBkLnZhbHVlIDwgMTAgdGhlbiAnc2l6ZS1zJyBlbHNlICcnXG4gICAgICAuaHRtbCAoZCkgPT4gZC5kYXRhW0BvcHRpb25zLmtleS5pZF1cblxuICBpc05vZGVMYWJlbFZpc2libGU6IChkKSA9PlxuICAgIHJldHVybiBkLngxLWQueDAgPiBAb3B0aW9ucy5taW5TaXplICYmIGQueTEtZC55MCA+IEBvcHRpb25zLm1pblNpemVcblxuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSdcbiAgICAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuVHJlZW1hcEdyYXBoXG5cbiAgIyBvdmVyZHJpdmUgZGF0YSBQYXJzZXJcbiAgZGF0YVBhcnNlcjogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgICAjIHNldCBwYXJzZWREYXRhIGFycmF5XG4gICAgcGFyc2VkRGF0YSA9IFt7aWQ6ICdyJ31dICMgYWRkIHRyZWVtYXAgcm9vdFxuICAgICMgVE9ETyEhISBHZXQgY3VycmVudCBjb3VudHJ5ICYgYWRkIHNlbGVjdCBpbiBvcmRlciB0byBjaGFuZ2UgaXRcbiAgICBkYXRhX2NvdW50cnkgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGlmIGRhdGFfY291bnRyeVswXVxuICAgICAgIyBzZXQgbWV0aG9kcyBvYmplY3RcbiAgICAgIG1ldGhvZHMgPSB7fVxuICAgICAgQG9wdGlvbnMubWV0aG9kc0tleXMuZm9yRWFjaCAoa2V5LGkpID0+XG4gICAgICAgIGlmIGRhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgICAgbWV0aG9kc1trZXldID1cbiAgICAgICAgICAgIGlkOiBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csICctJykucmVwbGFjZSgnKScsICcnKS5yZXBsYWNlKCcoJywgJycpXG4gICAgICAgICAgICBuYW1lOiBAb3B0aW9ucy5tZXRob2RzTmFtZXNbaV1cbiAgICAgICAgICAgIHZhbHVlOiArZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiVGhlcmUncyBubyBkYXRhIGZvciBcIiArIGtleVxuICAgICAgIyBmaWx0ZXIgbWV0aG9kcyB3aXRoIHZhbHVlIDwgNSUgJiBhZGQgdG8gT3RoZXIgbW9kZXJuIG1ldGhvZHNcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgaWYga2V5ICE9ICdPdGhlciBtb2Rlcm4gbWV0aG9kcycgYW5kIGtleSAhPSAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCcgYW5kIG1ldGhvZC52YWx1ZSA8IDVcbiAgICAgICAgICBtZXRob2RzWydPdGhlciBtb2Rlcm4gbWV0aG9kcyddLnZhbHVlICs9IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIGRlbGV0ZSBtZXRob2RzW2tleV1cbiAgICAgXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIHBhcnNlZERhdGEucHVzaFxuICAgICAgICAgIGlkOiBtZXRob2QuaWRcbiAgICAgICAgICByYXdfbmFtZTogbWV0aG9kLm5hbWVcbiAgICAgICAgICBuYW1lOiAnPHN0cm9uZz4nICsgbWV0aG9kLm5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBtZXRob2QubmFtZS5zbGljZSgxKSArICc8L3N0cm9uZz48YnIvPicgKyBNYXRoLnJvdW5kKG1ldGhvZC52YWx1ZSkgKyAnJSdcbiAgICAgICAgICB2YWx1ZTogbWV0aG9kLnZhbHVlXG4gICAgICAgICAgcGFyZW50OiAncidcbiAgICAgIHBhcnNlZERhdGFTb3J0ZWQgPSBwYXJzZWREYXRhLnNvcnQgKGEsYikgLT4gaWYgYS52YWx1ZSBhbmQgYi52YWx1ZSB0aGVuIGIudmFsdWUtYS52YWx1ZSBlbHNlIDFcbiAgICAgICMgc2V0IGNhcHRpb24gY291bnRyeSBuYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY291bnRyeScpLmh0bWwgY291bnRyeV9uYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtYW55LW1ldGhvZCcpLmh0bWwgTWF0aC5yb3VuZChkYXRhX2NvdW50cnlbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBwYXJzZWREYXRhU29ydGVkWzBdLnJhd19uYW1lXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuICdObyBkYXRhIGNvdW50cnkgZm9yICcrY291bnRyeV9jb2RlXG4gICAgICAjIFRPRE8hISEgV2hhdCB3ZSBkbyBpZiB0aGVyZSdzIG5vIGRhdGEgZm9yIHVzZXIncyBjb3VudHJ5XG4gICAgcmV0dXJuIHBhcnNlZERhdGFcblxuICAjIG92ZXJkcml2ZSBzZXQgZGF0YVxuICBzZXREYXRhOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQG9yaWdpbmFsRGF0YSA9IGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgICNAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVEYXRhOiAoY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAdXBkYXRlR3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVyZHJpdmUgbm9kZSBjbGFzc1xuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSBub2RlLScrZC5pZFxuXG4gICMjIyBvdmVyZHJpdmUgcmVzaXplXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbnRhaW5lck9mZnNldDogLT5cbiAgICBAJGVsLmNzcygndG9wJywgKCQod2luZG93KS5oZWlnaHQoKS1AJGVsLmhlaWdodCgpKSowLjUpXG4gICMjIyIsImNsYXNzIHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICBpbmNvbWVMZXZlbHM6IFsxMDA1LCAzOTU1LCAxMjIzNV1cblxuICBsYWJlbHM6IFtcbiAgICAnQUdPJyxcbiAgICAnQkdEJyxcbiAgICAnQlJBJyxcbiAgICAnQ0hOJyxcbiAgICAnREVVJyxcbiAgICAnRVNQJyxcbiAgICAnRVRIJyxcbiAgICAnSU5EJyxcbiAgICAnSUROJyxcbiAgICAnSlBOJyxcbiAgICAnTkdBJyxcbiAgICAnUEFLJyxcbiAgICAnUEhMJyxcbiAgICAnUlVTJyxcbiAgICAnU0FVJyxcbiAgICAnVFVSJyxcbiAgICAnVUdBJyxcbiAgICAnVVNBJyxcbiAgICAnVk5NJ1xuICBdXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JlZXN3YXJtR3JhcGgnLCBpZFxuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA1XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqAyXG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDE1XG4gICAgb3B0aW9ucy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IDAgIyBtb2RlIDA6IGJlZXN3YXJtLCBtb2RlIDE6IHNjYXR0ZXJwbG90XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgcmV0dXJuIGRhdGEuc29ydCAoYSxiKSA9PiBiW0BvcHRpb25zLmtleS5zaXplXS1hW0BvcHRpb25zLmtleS5zaXplXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBkYXRhXG5cbiAgZHJhd0dyYXBoOiAtPlxuXG4gICAgQHNldFNpemUoKVxuXG4gICAgIyBzZXQgJiBydW4gc2ltdWxhdGlvblxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG5cbiAgICAjIGRyYXcgZG90c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhIEBkYXRhXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0RG90XG4gICAgICAjLm9uICdtb3VzZW92ZXInLCAoZCkgPT4gY29uc29sZS5sb2cgZFxuXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAuZGF0YSBAZGF0YS5maWx0ZXIgKGQpID0+IEBsYWJlbHMuaW5kZXhPZihkW0BvcHRpb25zLmtleS5pZF0pICE9IC0xXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgPT4gcmV0dXJuIGlmIGRbQG9wdGlvbnMua2V5LnNpemVdID4gMTAwMDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1sJyBlbHNlIGlmIGRbQG9wdGlvbnMua2V5LnNpemVdID4gMTgwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLW0nIGVsc2UgJ2RvdC1sYWJlbCdcbiAgICAgICAgIy5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAgIC5hdHRyICdkeScsICcwLjI1ZW0nXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS5sYWJlbF1cbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cblxuXG4gIHNldFNpbXVsYXRpb246IC0+XG4gICAgIyBzZXR1cCBzaW11bGF0aW9uXG4gICAgZm9yY2VZID0gZDMuZm9yY2VZIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICBmb3JjZVkuc3RyZW5ndGgoMSlcbiAgICBAc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbihAZGF0YSlcbiAgICAgIC5mb3JjZSAneCcsIGZvcmNlWVxuICAgICAgLmZvcmNlICd5JywgZDMuZm9yY2VYKEB3aWR0aCouNSlcbiAgICAgIC5mb3JjZSAnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgoZCkgPT4gcmV0dXJuIGlmIEBzaXplIHRoZW4gZC5yYWRpdXMrMSBlbHNlIEBvcHRpb25zLmRvdFNpemUrMSlcbiAgICAgIC5zdG9wKClcblxuICBydW5TaW11bGF0aW9uOiAtPlxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IDM1MFxuICAgICAgQHNpbXVsYXRpb24udGljaygpXG4gICAgICArK2lcblxuICBzZXREb3Q6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAncicsICAoZCkgPT4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5hdHRyICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuXG4gIHNldERvdFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2N4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ2N5JywgQGdldFBvc2l0aW9uWVxuXG4gIHNldERvdExhYmVsUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAneCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICd5JywgQGdldFBvc2l0aW9uWVxuXG4gIGdldFBvc2l0aW9uWDogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnggZWxzZSBNYXRoLnJvdW5kIEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuXG4gIGdldFBvc2l0aW9uWTogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnkgZWxzZSBNYXRoLnJvdW5kIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIGdldERvdEZpbGw6IChkKSA9PlxuICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdICNpZiBAb3B0aW9ucy5rZXkuY29sb3IgYW5kIEBvcHRpb25zLm1vZGUgPT0gMSB0aGVuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gZWxzZSAnI2UyNzIzYidcblxuICBzZXRNb2RlOiAobW9kZSkgLT5cbiAgICBAb3B0aW9ucy5tb2RlID0gbW9kZVxuICAgIGlmIEBvcHRpb25zLm1vZGUgPCAyXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICAgaWYgQHhMZWdlbmRcbiAgICAgICAgQHhMZWdlbmQuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgICAjIHNob3cvaGlkZSBkb3QgbGFiZWxzXG4gICAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDBcbiAgICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZGVsYXkgNTAwXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMVxuICAgICAgIyBzaG93L2hpZGUgeCBheGlzIGxpbmVzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSAyXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSA8IEBpbmNvbWVMZXZlbHNbMl0gb3IgZFtAb3B0aW9ucy5rZXkueV0gPiAxNVxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSAzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSA+IEBpbmNvbWVMZXZlbHNbMV0gb3IgZFtAb3B0aW9ucy5rZXkueV0gPCAzMFxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSA0XG4gICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZC5pZCAhPSAnU0FVJyBhbmQgZC5pZCAhPSAnSlBOJ1xuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSA1XG4gICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuXG4gIHNldFNpemU6IC0+XG4gICAgaWYgQHNpemVcbiAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgIGQucmFkaXVzID0gQHNpemUgZFtAb3B0aW9ucy5rZXkuc2l6ZV1cblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgc3VwZXIoKVxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgICNAeCA9IGQzLnNjYWxlUG93KClcbiAgICAjICAuZXhwb25lbnQoMC4xMjUpXG4gICAgIyAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHggPSBkMy5zY2FsZUxvZygpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICAjIEVxdWl2YWxlbnQgdG8gZDMuc2NhbGVTcXJ0KClcbiAgICAgICPCoGh0dHBzOi8vYmwub2Nrcy5vcmcvZDNpbmRlcHRoLzc3NWNmNDMxZTY0YjY3MTg0ODFjMDZmYzQ1ZGMzNGY5XG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVUaHJlc2hvbGQoKVxuICAgICAgICAucmFuZ2UgZDMuc2NoZW1lT3Jhbmdlc1s1XSAjLnJldmVyc2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgICAgLnRpY2tWYWx1ZXMgQGluY29tZUxldmVsc1xuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDEwLCAyMCwgMzAsIDQwXVxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJyUnXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC0xLDUpJ1xuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzI1MCwgODUwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDEwLCAyMCwgMzBdXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5hdHRyICd5MScsIEB5KDQwKS00XG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMgLnRpY2sgdGV4dCcpXG4gICAgICAgIC5hdHRyICdkeCcsIDNcbiAgICAgICAgLmF0dHIgJ2R5JywgLTRcbiAgICAjIHNldCB4IGxlbmdlZFxuICAgIGluY29tZXMgPSBAeEF4aXMudGlja1ZhbHVlcygpXG4gICAgaW5jb21lcy51bnNoaWZ0IDBcbiAgICBpbmNvbWVzTWF4ID0gQHggQGdldFNjYWxlWERvbWFpbigpWzFdXG4gICAgaW5jb21lcyA9IGluY29tZXMubWFwIChkKSA9PiBpZiBkID4gMCB0aGVuIDEwMCpAeChkKS9pbmNvbWVzTWF4IGVsc2UgMFxuICAgIGluY29tZXMucHVzaCAxMDBcbiAgICBAeExlZ2VuZCA9IGQzLnNlbGVjdChkMy5zZWxlY3QoJyMnK0BpZCkubm9kZSgpLnBhcmVudE5vZGUpLnNlbGVjdCgnLngtbGVnZW5kJylcbiAgICBAeExlZ2VuZC5zZWxlY3RBbGwoJ2xpJykuc3R5bGUgJ3dpZHRoJywgKGQsaSkgLT4gKGluY29tZXNbaSsxXS1pbmNvbWVzW2ldKSsnJSdcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGlmIEBjb250YWluZXJXaWR0aCA+IDY4MCB0aGVuIEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvIGVsc2UgaWYgQGNvbnRhaW5lcldpZHRoID4gNTIwIHRoZW4gQGNvbnRhaW5lcldpZHRoICogLjc1IGVsc2UgQGNvbnRhaW5lcldpZHRoXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzQXBwXG5cbiAgZmlsdGVyX2tleXM6IFxuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMCc6ICdyZXNpZGVuY2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0xJzogJ2FnZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTInOiAnZWR1Y2F0aW9uJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMyc6ICd3ZWFsdGgnXG5cbiAgZGhzX2NvdW50cmllczpcbiAgICAnQUZHJzpcbiAgICAgICduYW1lJzogJ0FGSVI3MERUJ1xuICAgICAgJ3llYXInOiAnMjAxNydcbiAgICAnQUxCJzpcbiAgICAgICduYW1lJzogJ0FMSVI1MERUJ1xuICAgICAgJ3llYXInOiAnMjAwOC0wOSdcbiAgICAnQVJNJzpcbiAgICAgICduYW1lJzogJ0FNSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMCdcbiAgICAnQUdPJzpcbiAgICAgICduYW1lJzogJ0FPSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNS0xNidcbiAgICAnQVpFJzpcbiAgICAgICduYW1lJzogJ0FaSVI1MkRUJ1xuICAgICAgJ3llYXInOiAnMjAwNidcbiAgICAnQkdEJzpcbiAgICAgICduYW1lJzogJ0JESVI3MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnQkVOJzpcbiAgICAgICduYW1lJzogJ0JKSVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwNidcbiAgICAnQk9MJzpcbiAgICAgICduYW1lJzogJ0JPSVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwOCdcbiAgICAnQkRJJzpcbiAgICAgICduYW1lJzogJ0JVSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMCdcbiAgICAnQ09EJzpcbiAgICAgICduYW1lJzogJ0NESVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMy0xNCdcbiAgICAnQ09HJzpcbiAgICAgICduYW1lJzogJ0NHSVI2MERUJ1xuICAgICAgJ3llYXInOiAnMjAxMS0xMidcbiAgICAnQ0lWJzpcbiAgICAgICduYW1lJzogJ0NJSVI2MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxMS0xMidcbiAgICAnQ01SJzpcbiAgICAgICduYW1lJzogJ0NNSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMSdcbiAgICAnQ09MJzpcbiAgICAgICduYW1lJzogJ0NPSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNS0xNidcbiAgICAnRE9NJzpcbiAgICAgICduYW1lJzogJ0RSSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnRUdZJzpcbiAgICAgICduYW1lJzogJ0VHSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnRVRIJzpcbiAgICAgICduYW1lJzogJ0VUSVI3MERUJ1xuICAgICAgJ3llYXInOiAnMjAxNidcbiAgICAnR0hBJzpcbiAgICAgICduYW1lJzogJ0dISVI3MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnR01CJzpcbiAgICAgICduYW1lJzogJ0dNSVI2MERUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnR0lOJzpcbiAgICAgICduYW1lJzogJ0dOSVI2MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnR1RNJzpcbiAgICAgICduYW1lJzogJ0dVSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNC0xNSdcbiAgICAnR1VZJzpcbiAgICAgICduYW1lJzogJ0dZSVI1SURUJ1xuICAgICAgJ3llYXInOiAnMjAwOSdcbiAgICAnSE5EJzpcbiAgICAgICduYW1lJzogJ0hOSVI2MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxMS0xMidcbiAgICAnSFRJJzpcbiAgICAgICduYW1lJzogJ0hUSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnSU5EJzpcbiAgICAgICduYW1lJzogJ0lBSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNSdcbiAgICAnSUROJzpcbiAgICAgICduYW1lJzogJ0lESVI2M0RUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnSk9SJzpcbiAgICAgICduYW1lJzogJ0pPSVI2Q0RUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnS0VOJzpcbiAgICAgICduYW1lJzogJ0tFSVI3MERUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnS0hNJzpcbiAgICAgICduYW1lJzogJ0tISVI3M0RUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnTEJSJzpcbiAgICAgICduYW1lJzogJ0xCSVI2QURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnTFNPJzpcbiAgICAgICduYW1lJzogJ0xTSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNCdcbiAgICAnTUFSJzpcbiAgICAgICduYW1lJzogJ01BSVI0M0RUJ1xuICAgICAgJ3llYXInOiAnMjAwMy0wNCdcbiAgICAnTURHJzpcbiAgICAgICduYW1lJzogJ01ESVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwOC0wOSdcbiAgICAnTUxJJzpcbiAgICAgICduYW1lJzogJ01MSVI1M0RUJ1xuICAgICAgJ3llYXInOiAnMjAwNidcbiAgICAnTU1SJzpcbiAgICAgICduYW1lJzogJ01NSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNidcbiAgICAnTVdJJzpcbiAgICAgICduYW1lJzogJ01XSVI3SERUJ1xuICAgICAgJ3llYXInOiAnMjAxNS0xNidcbiAgICAnTU9aJzpcbiAgICAgICduYW1lJzogJ01aSVI2MkRUJ1xuICAgICAgJ3llYXInOiAnMjAxMSdcbiAgICAnTkdBJzpcbiAgICAgICduYW1lJzogJ05HSVI2QURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnTkVSJzpcbiAgICAgICduYW1lJzogJ05JSVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwNidcbiAgICAnTkFNJzpcbiAgICAgICduYW1lJzogJ05NSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnTlBMJzpcbiAgICAgICduYW1lJzogJ05QSVI3SERUJ1xuICAgICAgJ3llYXInOiAnMjAxNidcbiAgICAnUEVSJzpcbiAgICAgICduYW1lJzogJ1BFSVI2SURUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnUEhMJzpcbiAgICAgICduYW1lJzogJ1BISVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnUEFLJzpcbiAgICAgICduYW1lJzogJ1BLSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMi0xMydcbiAgICAnUldBJzpcbiAgICAgICduYW1lJzogJ1JXSVI3MERUJ1xuICAgICAgJ3llYXInOiAnMjAxNSdcbiAgICAnU0xFJzpcbiAgICAgICduYW1lJzogJ1NMSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMydcbiAgICAnU0VOJzpcbiAgICAgICduYW1lJzogJ1NOSVI2RERUJ1xuICAgICAgJ3llYXInOiAnMjAxMi0xMydcbiAgICAnU1RQJzpcbiAgICAgICduYW1lJzogJ1NUSVI1MERUJ1xuICAgICAgJ3llYXInOiAnMjAwOCdcbiAgICAnU1daJzpcbiAgICAgICduYW1lJzogJ1NaSVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwNidcbiAgICAnVENEJzpcbiAgICAgICduYW1lJzogJ1RESVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNC0xNSdcbiAgICAnVEdPJzpcbiAgICAgICduYW1lJzogJ1RHSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMy0xNCdcbiAgICAnVEpLJzpcbiAgICAgICduYW1lJzogJ1RKSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAxMidcbiAgICAnVExTJzpcbiAgICAgICduYW1lJzogJ1RMSVI2MURUJ1xuICAgICAgJ3llYXInOiAnMjAwOS0xMCdcbiAgICAnVFpBJzpcbiAgICAgICduYW1lJzogJ1RaSVI3SERUJ1xuICAgICAgJ3llYXInOiAnMjAxNS0xNidcbiAgICAnVUdBJzpcbiAgICAgICduYW1lJzogJ1VHSVI2MERUJ1xuICAgICAgJ3llYXInOiAnMjAxMSdcbiAgICAnWk1CJzpcbiAgICAgICduYW1lJzogJ1pNSVI1MURUJ1xuICAgICAgJ3llYXInOiAnMjAwNydcbiAgICAnWldFJzpcbiAgICAgICduYW1lJzogJ1pXSVI3MURUJ1xuICAgICAgJ3llYXInOiAnMjAxNSdcblxuICBzZW50ZW5jZXM6IFxuICAgICdBTEInOiAnTGEgbWFyY2hhIGF0csOhcyBlcyBlbCBwcmltZXIgbcOpdG9kbyBhbnRpY29uY2VwdGl2byBkZSBBbGJhbmlhLiBBZGVtw6FzLCBzZSB0cmF0YSBkZWwgc2VndW5kbyBwYcOtcyBkb25kZSBleGlzdGUgbWF5b3Igb3Bvc2ljacOzbiBkZSBsYSBwcm9waWEgbXVqZXIsIGxhIHBhcmVqYSBvIGxhIHJlbGlnacOzbiBhIHRvbWFyIGFudGljb25jZXB0aXZvcy4nXG4gICAgJ0FSRyc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY2xhcmluLmNvbS9zb2NpZWRhZC9jYW1wYW5hLWxleS1hYm9ydG8tY29tZW56by0yMDA1LXByb3llY3RvLXByZXNlbnRvLXZlY2VzXzBfQkp2ZGkwblB6Lmh0bWxcIj5VbmFzIGNpbmNvIG1pbCBtdWplcmVzIG1hcmNoYXJvbiBlbiBmZWJyZXJvIGRlIDIwMTggZnJlbnRlIGFsIENvbmdyZXNvIGFyZ2VudGlubyBwYXJhIHBlZGlyIGxhIGxlZ2FsaXphY2nDs24gZGVsIGFib3J0by48L2E+J1xuICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCI+TXVjaG9zIGF1c3RyYWxpYW5vcyBlc3TDoW4gdm9sdmllbmRvIGEgdXRpbGl6YXIgbcOpdG9kb3MgdHJhZGljaW9uYWxlcyBkZSBhbnRpY29uY2VwY2nDs24sIHNlZ8O6biB1biBlc3R1ZGlvIGRlIE1vbmFzaCBVbml2ZXJzaXR5LjwvYT4nXG4gICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCI+QsOpbGdpY2EgZG9uw7MgMTAgbWlsbG9uZXMgZGUgZXVyb3MgcGFyYSBsYSBjYW1wYcOxYSA8aT5TaGUgRGVjaWRlczwvaT4sIGxhbnphZGEgcG9yIGVsIEdvYmllcm5vIGhvbGFuZMOpcyBwYXJhIGNvbnRyYXJyZXN0YXIgbGEgcmV0aXJhZGEgZGUgZm9uZG9zIHBhcmEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgZGUgVHJ1bXAuPC9hPidcbiAgICAnQk9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5lZmUuY29tL2VmZS9hbWVyaWNhL3NvY2llZGFkL2xhLXZlcmfDvGVuemEteS1lbC1lc3RpZ21hLWRlLXBlZGlyLXByZXNlcnZhdGl2b3MtZW4tYm9saXZpYS8vMjAwMDAwMTMtMzI2NTY1MlwiPkZhcm1hY2lhcyBkZSBCb2xpdmlhIGltcGxlbWVudGFyb24gY8OzZGlnb3Mgc2VjcmV0b3MgcGFyYSBwZWRpciBwcmVzZXJ2YXRpdm9zIHkgZXZpdGFyIGVsIGVzdGlnbWEgZGUgY29tcHJhciBlc3RvcyBhbnRpY29uY2VwdGl2b3MuPC9hPidcbiAgICAnQ09MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCI+RWwgR29iaWVybm8gY2hpbm8gb2ZyZWNlIGxhIHJldGlyYWRhIGdyYXR1aXRhIGRlIERJVXMgZGVzcHXDqXMgZGUgbGEgcG9sw610aWNhIGRlbCBoaWpvIMO6bmljby48L2E+J1xuICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCI+RWwgU2FsdmFkb3IgZXMgZWwgw7puaWNvIHBhw61zIGRlbCBtdW5kbyBkb25kZSBhYm9ydGFyIGVzdMOhIHBlbmFkbyBjb24gY8OhcmNlbC48L2E+J1xuICAgICdGSU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVsc2lua2l0aW1lcy5maS9maW5sYW5kL2ZpbmxhbmQvbmV3cy9kb21lc3RpYy8xNTI3MS1oZWxzaW5raS10by1vZmZlci15ZWFyLXMtd29ydGgtb2YtY29udHJhY2VwdGl2ZS1waWxscy10by11bmRlci0yNS15ZWFyLW9sZHMuaHRtbFwiPkVsIGF5dW50YW1pZW50byBkZSBIZWxzaW5raSBwcm9wb3JjaW9uYSBhbnRpY29uY2VwdGl2b3MgZGUgbWFuZXJhIGdyYXR1aXRhIGEgbG9zIGrDs3ZlbmVzIG1lbm9yZXMgZGUgMjUgYcOxb3MuPC9hPidcbiAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiPkVsIHVzbyBkZSBsYXMgcGFzdGlsbGFzIGFudGljb25jZXB0aXZhcyBzZSBoYSByZWR1Y2lkbyBlbiBGcmFuY2lhIGRlc2RlIDIwMTAuPC9hPidcbiAgICAnR01CJzogJ0VuIEdhbWJpYSwgbXVjaGFzIG11amVyZXMgdXRpbGl6YW4gdW4gbcOpdG9kbyB0cmFkaWNpb25hbCBxdWUgY29uc2lzdGUgZW4gYXRhciBhIGxhIGNpbnR1cmEgdW5hIGN1ZXJkYSwgdW5hIHJhbWEsIG8gdW4gcGFwZWxpdG8gY29uIG8gc2luIGZyYXNlcyBkZWwgQ29yw6FuLidcbiAgICAnREVVJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR3LmNvbS9lbi9mcmVlLXByZXNjcmliZWQtY29udHJhY2VwdGlvbi1mb3ItbG93LWVhcm5lcnMvYS0zODE2MTU3N1wiPlVuIHByb3llY3RvIGFsZW3DoW4gZmFjaWxpdGEgYW50aWNvbmNlcHRpdm9zIGRlIGZvcm1hIGdyYXR1aXRhIGEgbXVqZXJlcyBkZSBtw6FzIGRlIDIwIGHDsW9zIGNvbiBpbmdyZXNvcyBiYWpvcy48L2E+J1xuICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIj5MYSByZWxpZ2nDs24gaW5mbHV5ZSBlbiBsYSBlZHVjYWNpw7NuIHNleHVhbCBkZSBsb3MgasOzdmVuZXMgZ3VhdGVtYWx0ZWNvcy48L2E+J1xuICAgICdJU1InOiAnRW4gbG9zIHNlY3RvcmVzIGp1ZMOtb3MgbcOhcyBvcnRvZG94b3MsIHNvbG8gcHVlZGVuIHVzYXJzZSBsb3MgYW50aWNvbmNlcHRpdm9zIHNpIGVsIHJhYmlubyBkYSBzdSBwZXJtaXNvIGEgbGEgbXVqZXIuJ1xuICAgICdKUE4nOiAnSmFww7NuLCBhdW5xdWUgc2UgZW5jdWVudHJhIGVuIGVsIGdydXBvIGRlIHBhw61zZXMgY29uIHJlbnRhIGFsdGEsIGVzIGxhIGV4Y2VwY2nDs246IGxhcyBuZWNlc2lkYWRlcyBubyBjdWJpZXJ0YXMgY29uIGFudGljb25jZXB0aXZvcyBlc3TDoSBhbCBuaXZlbCBkZSBwYcOtc2VzIGNvbiByZW50YXMgYmFqYXMuJ1xuICAgICdQUksnOiAnRWwgOTUlIGRlIG11amVyZXMgcXVlIHV0aWxpemFuIGFudGljb25jZXB0aXZvcyBlbiBDb3JlYSBkZWwgTm9ydGUgaGFuIGVsZWdpZG8gZWwgRElVLiBTZSB0cmF0YSBkZWwgbWF5b3IgcG9yY2VudGFqZSBkZSB1c28gYSBuaXZlbCBtdW5kaWFsLidcbiAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5FbCBnb2JpZXJubyBob2xhbmTDqXMgbGFuemEgZWwgcHJveWVjdG8gPGk+U2hlIERlY2lkZXM8L2k+IHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICdQRVInOiAnPGEgaHJlZj1cImh0dHBzOi8vaW50ZXJhY3RpdmUucXVpcHUtcHJvamVjdC5jb20vIy9lcy9xdWlwdS9pbnRyb1wiPkVuIGxhIMOpcG9jYSBkZSBsb3MgOTAsIGR1cmFudGUgZWwgZ29iaWVybm8gZGUgRnVqaW1vcmksIG3DoXMgZGUgMjUwLjAwMCBtdWplcmVzIGZ1ZXJvbiBlc3RlcmlsaXphZGFzIHNpbiBzdSBjb25zZW50aW1pZW50by48L2E+J1xuICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIj4gRW4gdW4gcGHDrXMgZG9uZGUgZWwgYWJvcnRvIGRlbCBlc3TDoSBwcm9oaWJpZG8sIHRyZXMgbXVqZXJlcyBtdWVyZW4gYWwgZMOtYSBwb3IgY29tcGxpY2FjaW9uZXMgZGVyaXZhZGFzIGRlIGludGVydmVuY2lvbmVzIGlsZWdhbGVzLjwvYT4nXG4gICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiPkVsIEdvYmllcm5vIHBvbGFjbyBkYSB1biBwYXNvIGF0csOhcyB5IHNlIGNvbnZpZXJ0ZSBlbiBlbCDDum5pY28gcGHDrXMgZGUgbGEgVW5pw7NuIEV1cm9wZWEgZG9uZGUgbGEgcGFzdGlsbGEgZGVsIGTDrWEgZGVzcHXDqXMgZXN0w6Egc3VqZXRhIGEgcHJlc2NyaXBjacOzbi48L2E+J1xuICAgICdTU0QnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9tYXkvMjUvZXZlcnkteWVhci1pLWdpdmUtYmlydGgtd2FyLWRyaXZpbmctY29udHJhY2VwdGlvbi1jcmlzaXMtc3VkYW4tbnViYS1tb3VudGFpbnNcIj5MYSBndWVycmEgZW4gU3Vkw6FuIGVzdMOhIGNyZWFuZG8gdW5hIGNyaXNpcyBlbiBlbCBhY2Nlc28gYSBhbnRpY29uY2VwdGl2b3MuPC9hPidcbiAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIj5NYWRyaWQgZXMgbGEgw7puaWNhIGNvbXVuaWRhZCBxdWUgbm8gZmluYW5jaWEgYW50aWNvbmNlcHRpdm9zIGNvbiBzdXMgZm9uZG9zLjwvYT4nXG4gICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCI+RXJkb2dhbiBkZWNsYXJhIHF1ZSBsYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBubyBlcyBwYXJhIGxvcyBtdXN1bG1hbmVzLjwvYT4nXG4gICAgJ1VHQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubmV3dmlzaW9uLmNvLnVnL25ld192aXNpb24vbmV3cy8xNDU4ODgyL3VnYW5kYS1mYWNpbmctMTUwLW1pbGxpb24tY29uZG9tLXNob3J0ZmFsbFwiPkVuIDIwMTcsIGVsIE1pbmlzdGVyaW8gZGUgU2FsdWQgZGUgVWdhbmRhIGRlY2xhcmFiYSB1biBkZXNhYmFzdGVjaW1pZW50byBkZSAxNTAgbWlsbG9uZXMgZGUgcHJlc2VydmF0aXZvcyBtYXNjdWxpbm9zLjwvYT4nXG4gICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCI+RW4gSXJsYW5kYSBlcyBpbGVnYWwgYWJvcnRhciBhIG5vIHNlciBxdWUgaGF5YSB1biByaWVzZ28gcmVhbCBkZSBzYWx1ZCBwYXJhIGxhIG1hZHJlLjwvYT4nXG4gICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCI+VHJ1bXAgZGEgYSBsb3MgbcOpZGljb3MgbGliZXJ0YWQgcGFyYSBuZWdhcnNlIGEgcmVhbGl6YXIgcHJvY2VkaW1pZW50b3MgZW4gY29udHJhIGRlIHN1cyBjcmVlbmNpYXMgcmVsaWdpb3NhcywgY29tbyBlbCBhYm9ydG8uPC9hPidcbiAgICAnVkVOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbXVuZG8vbm90aWNpYXMtYW1lcmljYS1sYXRpbmEtNDI2MzU0MTJcIj5MYSBlc2Nhc2V6IHkgZWwgcHJlY2lvIGVsZXZhZG8gZGUgbG9zIGFudGljb25jZXB0aXZvcyBlbiBWZW5lenVlbGEgaW5mbHV5ZSBlbiBlbCBhdW1lbnRvIGRlIGVtYmFyYXpvcyBubyBkZXNlYWRvcy48L2E+J1xuICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCI+VW4gcHJveWVjdG8gZW4gWmFtYmlhICB1bmUgbGEgbWFuaWN1cmEgeSBsb3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG5cblxuICBjb25zdHJ1Y3RvcjogKGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlcl9jb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXMsIG1ldGhvZHNfZGhzX25hbWVzLCByZWFzb25zX25hbWVzLCByZWFzb25zX2Roc19uYW1lcykgLT5cblxuICAgIEBkYXRhID0gXG4gICAgICB1c2U6ICAgICAgICBkYXRhX3VzZVxuICAgICAgdW5tZXRuZWVkczogZGF0YV91bm1ldG5lZWRzXG4gICAgICByZWFzb25zOiAgICBkYXRhX3JlYXNvbnNcblxuICAgIEBtZXRob2RzS2V5cyAgICAgID0gbWV0aG9kc19rZXlzXG4gICAgQG1ldGhvZHNOYW1lcyAgICAgPSBtZXRob2RzX25hbWVzXG4gICAgQG1ldGhvZHNESFNOYW1lcyAgPSBtZXRob2RzX2Roc19uYW1lc1xuICAgIEByZWFzb25zTmFtZXMgICAgID0gcmVhc29uc19uYW1lc1xuICAgIEByZWFzb25zREhTTmFtZXMgID0gcmVhc29uc19kaHNfbmFtZXNcblxuICAgIEAkYXBwID0gJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpXG5cbiAgICBAJGFwcC5maW5kKCcuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLnNlbGVjdDIoKVxuICAgICAgLmNoYW5nZSBAb25TZWxlY3RDb3VudHJ5XG4gICAgICAudmFsIHVzZXJfY291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5jbGljayBAb25TZWxlY3RGaWx0ZXJcblxuICAgIEAkYXBwLmNzcygnb3BhY2l0eScsMSlcblxuXG4gIG9uU2VsZWN0Q291bnRyeTogKGUpID0+XG4gICAgQGNvdW50cnlfY29kZSA9ICQoZS50YXJnZXQpLnZhbCgpXG5cbiAgICB1c2UgICAgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZCAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kX3ZhbHVlICA9IG51bGxcbiAgICB1bm1ldG5lZWRzICAgID0gbnVsbFxuICAgIHJlYXNvbiAgICAgICAgPSBudWxsXG4gICAgcmVhc29uX3ZhbHVlICA9IG51bGxcblxuICAgICMgaGlkZSBmaWx0ZXJzICYgY2xlYXIgYWN0aXZlIGJ0bnNcbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5oaWRlKCkuZmluZCgnLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICMgaGlkZSBmaWx0ZXJzIHJlc3VsdHNcbiAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG5cbiAgICBpZiBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXVxuICAgICAgIyBzZXQgZGF0YSB5ZWFyXG4gICAgICBAJGFwcC5maW5kKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEteWVhcicpLmh0bWwgQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ueWVhclxuICAgICAgIyBsb2FkIGNvdW50cnkgZGhzIGRhdGFcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnX2FsbC5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGQgPSBkYXRhWzBdXG4gICAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIDEwMCpkLnVzaW5nX21vZGVybl9tZXRob2QvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29ucywgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuICAgICAgICAjIHNob3cgZmlsdGVyc1xuICAgICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCAnMjAxNS0xNidcbiAgICAgICMgVXNlXG4gICAgICBjb3VudHJ5VXNlID0gQGRhdGEudXNlLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgICAgaWYgY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXSAhPSAnMCdcbiAgICAgICAgICB1c2UgICAgICAgICAgID0gY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBAbWV0aG9kc0tleXMubWFwIChrZXksIGkpID0+IHsnbmFtZSc6IEBtZXRob2RzTmFtZXNbaV0sICd2YWx1ZSc6ICtjb3VudHJ5VXNlWzBdW2tleV19XG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICBtZXRob2QgICAgICAgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICBtZXRob2RfdmFsdWUgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0udmFsdWVcbiAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ10gXG4gICAgICAjIFJlYXNvbnNcbiAgICAgIGNvdW50cnlSZWFzb25zID0gQGRhdGEucmVhc29ucy5maWx0ZXIgKGQpID0+IGQuY29kZSA9PSBAY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5UmVhc29ucyBhbmQgY291bnRyeVJlYXNvbnNbMF1cbiAgICAgICAgcmVhc29ucyAgICAgID0gT2JqZWN0LmtleXMoQHJlYXNvbnNOYW1lcykubWFwIChyZWFzb24pID0+IHsnbmFtZSc6IEByZWFzb25zTmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2NvdW50cnlSZWFzb25zWzBdW3JlYXNvbl19XG4gICAgICAgIHJlYXNvbnMgICAgICA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgcmVhc29uICAgICAgID0gcmVhc29uc1swXS5uYW1lXG4gICAgICAgIHJlYXNvbl92YWx1ZSA9IHJlYXNvbnNbMF0udmFsdWVcbiAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuXG5cbiAgb25TZWxlY3RGaWx0ZXI6IChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIEBmaWx0ZXIgIT0gJChlLnRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUge3Njcm9sbFRvcDogQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykub2Zmc2V0KCkudG9wLTE1fSwgNDAwXG4gICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgQGZpbHRlciA9ICR0YXJnZXQuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuICAgICAgQGZpbHRlckVsID0gJCgnIycrQGZpbHRlcikuc2hvdygpXG4gICAgICAjIGxvYWQgY3N2IGZpbGVcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnXycrQGZpbHRlcl9rZXlzW0BmaWx0ZXJdKycuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhXG4gICAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEBmaWx0ZXJFbC5maW5kKCcjJytAZmlsdGVyKyctJytkLmlkKSwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG5cblxuICBzZXRBcHBJdGVtRGF0YTogKCRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWUsIHNlbnRlbmNlKSAtPlxuXG4gICAgI2NvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCttZXRob2RfdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuaGlkZSgpXG5cbiAgICBpZiB1bm1ldG5lZWRzXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK3VubWV0bmVlZHMpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcblxuICAgIGlmIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK3JlYXNvbl92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcblxuICAgIGlmIHNlbnRlbmNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1zZW50ZW5jZScpLmh0bWwoc2VudGVuY2UpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaGlkZSgpXG5cbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cbiAgXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IGZhbHNlXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiaW1wbGFudGVcIlxuICAgICAgXCJpbnllY3RhYmxlXCJcbiAgICAgIFwicMOtbGRvcmFcIlxuICAgICAgXCJjb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcImNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJtw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiYW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJvdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiaW1wbGFudFwiXG4gICAgICBcImluamVjdGFibGVcIlxuICAgICAgXCJwaWxsXCJcbiAgICAgIFwibWFsZSBjb25kb21cIlxuICAgICAgXCJmZW1hbGUgY29uZG9tXCJcbiAgICAgIFwidmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcImVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwib3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgbWV0aG9kc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICcxJzogXCJww61sZG9yYVwiXG4gICAgICAnMic6IFwiRElVXCJcbiAgICAgICczJzogXCJpbnllY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kw7NuXCJcbiAgICAgICc2JzogXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgJzcnOiBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgJzgnOiBcImFic3RpbmVuY2lhIHBlcmnDs2RpY2FcIlxuICAgICAgJzknOiBcIm1hcmNoYSBhdHLDoXNcIlxuICAgICAgJzEwJzogXCJvdHJvc1wiXG4gICAgICAnMTEnOiBcImltcGxhbnRlXCJcbiAgICAgICcxMyc6IFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICAnMTcnOiBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgICdlbic6XG4gICAgICAnMSc6IFwicGlsbFwiXG4gICAgICAnMic6IFwiSVVEXCJcbiAgICAgICczJzogXCJpbmplY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kb21cIlxuICAgICAgJzYnOiBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc3JzogXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzgnOiBcInBlcmlvZGljIGFic3RpbmVuY2VcIlxuICAgICAgJzknOiBcIndpdGhkcmF3YWxcIlxuICAgICAgJzEwJzogXCJvdGhlclwiXG4gICAgICAnMTEnOiBcImltcGxhbnRcIlxuICAgICAgJzEzJzogXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICAnMTcnOiBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuXG5cbiAgIyMjXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG4gICMjI1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICAnZXMnOlxuICAgICAgXCJhXCI6IFwibm8gZXN0w6FuIGNhc2FkYXNcIlxuICAgICAgXCJiXCI6IFwibm8gdGllbmVuIHNleG9cIlxuICAgICAgXCJjXCI6IFwidGllbmVuIHNleG8gaW5mcmVjdWVudGVcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzblwiXG4gICAgICBcImVcIjogXCJzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzXCJcbiAgICAgIFwiZlwiOiBcImFtZW5vcnJlYSBwb3N0cGFydG9cIlxuICAgICAgXCJnXCI6IFwiZXN0w6FuIGRhbmRvIGVsIHBlY2hvXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0YVwiXG4gICAgICBcImlcIjogXCJsYSBtdWplciBzZSBvcG9uZVwiXG4gICAgICBcImpcIjogXCJlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmVcIlxuICAgICAgXCJrXCI6IFwib3Ryb3Mgc2Ugb3BvbmVuXCIgICAgICAgIFxuICAgICAgXCJsXCI6IFwicHJvaGliaWNpw7NuIHJlbGlnaW9zYVwiICBcbiAgICAgIFwibVwiOiBcIm5vIGNvbm9jZSBsb3MgbcOpdG9kb3NcIlxuICAgICAgXCJuXCI6IFwibm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zXCJcbiAgICAgIFwib1wiOiBcInByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIFwicFwiOiBcIm1pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MvcHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiBcbiAgICAgIFwicVwiOiBcImZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3NcIlxuICAgICAgXCJyXCI6IFwiY3Vlc3RhbiBkZW1hc2lhZG9cIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c29cIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICAgXCJ1XCI6IFwiZWwgbcOpdG9kbyBlbGVnaWRvIG5vIGVzdMOhIGRpc3BvbmlibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gaGF5IG3DqXRvZG9zIGRpc3BvbmlibGVzXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90cm9zXCJcbiAgICAgIFwielwiOiBcIm5vIGxvIHPDqVwiXG4gICAgJ2VuJzpcbiAgICAgIFwiYVwiOiBcIm5vdCBtYXJyaWVkXCJcbiAgICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzYWwvaHlzdGVyZWN0b215XCJcbiAgICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICAgIFwiZ1wiOiBcImJyZWFzdGZlZWRpbmdcIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIlxuICAgICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIlxuICAgICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIlxuICAgICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCJcbiAgICAgIFwibVwiOiBcImtub3dzIG5vIG1ldGhvZFwiXG4gICAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICAgIFwiclwiOiBcImNvc3RzIHRvbyBtdWNoXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCkidzIHByb2Nlc3Nlc1wiXG4gICAgICBcInVcIjogXCJwcmVmZXJyZWQgbWV0aG9kIG5vdCBhdmFpbGFibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdGhlclwiXG4gICAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICByZWFzb25zX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJ3YzYTA4YSc6ICdubyBlc3TDoW4gY2FzYWRhcydcbiAgICAgICd2M2EwOGInOiAnbm8gdGllbmVuIHNleG8nXG4gICAgICAndjNhMDhjJzogJ3RpZW5lbiBzZXhvIGluZnJlY3VlbnRlJ1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuJ1xuICAgICAgJ3YzYTA4ZSc6ICdzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzJ1xuICAgICAgJ3YzYTA4Zic6ICdhbWVub3JyZWEgcG9zdHBhcnRvJ1xuICAgICAgJ3YzYTA4Zyc6ICdlc3TDoW4gZGFuZG8gZWwgcGVjaG8nXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0YSdcbiAgICAgICd2M2EwOGknOiAnbGEgbXVqZXIgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhqJzogJ2VsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGsnOiAnb3Ryb3Mgc2Ugb3BvbmVuJyAgICAgICAgXG4gICAgICAndjNhMDhsJzogJ3Byb2hpYmljacOzbiByZWxpZ2lvc2EnXG4gICAgICAndjNhMDhtJzogJ25vIGNvbm9jZSBsb3MgbcOpdG9kb3MnXG4gICAgICAndjNhMDhuJzogJ25vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvcydcbiAgICAgICd2M2EwOG8nOiAncHJlb2N1cGFjaW9uZXMgZGUgc2FsdWQnXG4gICAgICAndjNhMDhwJzogJ21pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MnXG4gICAgICAndjNhMDhxJzogJ2ZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3MnXG4gICAgICAndjNhMDhyJzogJ2N1ZXN0YW4gZGVtYXNpYWRvJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzbydcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAnZW4nOiBcbiAgICAgICd2M2EwOGEnOiAnbm90IG1hcnJpZWQnXG4gICAgICAndjNhMDhiJzogJ25vdCBoYXZpbmcgc2V4J1xuICAgICAgJ3YzYTA4Yyc6ICdpbmZyZXF1ZW50IHNleCdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNhbC9oeXN0ZXJlY3RvbXknXG4gICAgICAndjNhMDhlJzogJ3N1YmZlY3VuZC9pbmZlY3VuZCdcbiAgICAgICd2M2EwOGYnOiAncG9zdHBhcnR1bSBhbWVub3JyaGVpYydcbiAgICAgICd2M2EwOGcnOiAnYnJlYXN0ZmVlZGluZydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RpYydcbiAgICAgICd2M2EwOGknOiAncmVzcG9uZGVudCBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4aic6ICdodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGsnOiAnb3RoZXJzIG9wcG9zZWQnXG4gICAgICAndjNhMDhsJzogJ3JlbGlnaW91cyBwcm9oaWJpdGlvbidcbiAgICAgICd2M2EwOG0nOiAna25vd3Mgbm8gbWV0aG9kJ1xuICAgICAgJ3YzYTA4bic6ICdrbm93cyBubyBzb3VyY2UnXG4gICAgICAndjNhMDhvJzogJ2hlYWx0aCBjb25jZXJucydcbiAgICAgICd2M2EwOHAnOiAnZmVhciBvZiBzaWRlIGVmZmVjdHMnXG4gICAgICAndjNhMDhxJzogJ2xhY2sgb2YgYWNjZXNzL3RvbyBmYXInXG4gICAgICAndjNhMDhyJzogJ2Nvc3RzIHRvbyBtdWNoJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnQgdG8gdXNlJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmZXJlcyB3aXRoIHRoZSBib2R5J3MgcHJvY2Vzc2VzXCJcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIEdyYXBoIFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoID0gLT5cblxuICAgICMgU2V0dXAgR3JhcGhcbiAgICBncmFwaFdpZHRoID0gMFxuICAgIGRhdGFJbmRleCA9IFswLi45OV1cbiAgICB1c2VHcmFwaCA9IGQzLnNlbGVjdCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpXG4gICAgdXNlR3JhcGguYXBwZW5kKCd1bCcpXG4gICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgIC5kYXRhKGRhdGFJbmRleClcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgIC5hcHBlbmQoJ3VzZScpXG4gICAgICAgICAgICAuYXR0cigneGxpbms6aHJlZicsICcjaWNvbi13b21hbicpXG4gICAgICAgICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTkzIDQ1MCcpXG5cbiAgICAjIFJlc2l6ZSBoYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlciA9IC0+XG4gICAgICBpZiBncmFwaFdpZHRoICE9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBncmFwaFdpZHRoID0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGl0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoID4gNDgwIHRoZW4gKGdyYXBoV2lkdGggLyAyMCkgLSAxMCBlbHNlIChncmFwaFdpZHRoIC8gMjApIC0gNFxuICAgICAgICBpdGVtc0hlaWdodCA9IDIuMzMqaXRlbXNXaWR0aFxuICAgICAgICAjaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiAnMTAlJyBlbHNlICc1JSdcbiAgICAgICAgI2l0ZW1zSGVpZ2h0ID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuIGdyYXBoV2lkdGggKiAwLjEgLyAwLjc1IGVsc2UgZ3JhcGhXaWR0aCAqIDAuMDUgLyAwLjc1XG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5zdHlsZSAnd2lkdGgnLCBpdGVtc1dpZHRoKydweCdcbiAgICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0KydweCdcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdzdmcnKVxuICAgICAgICAgIC5hdHRyICd3aWR0aCcsIGl0ZW1zV2lkdGhcbiAgICAgICAgICAuYXR0ciAnaGVpZ2h0JywgaXRlbXNIZWlnaHRcbiAgICAgIHVzZUdyYXBoLnN0eWxlICdtYXJnaW4tdG9wJywgKCgkKCdib2R5JykuaGVpZ2h0KCktdXNlR3JhcGgubm9kZSgpLm9mZnNldEhlaWdodCkqLjUpKydweCdcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcicsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIGlmIGN1cnJlbnRTdGVwID4gMFxuICAgICAgICBkYXRhID0gWzY0LCA4OCwgMTAwXSAjIDY0LCA2NCsyNCwgNjQrMjQrMTJcbiAgICAgICAgZnJvbSA9IGlmIGN1cnJlbnRTdGVwID4gMSB0aGVuIGRhdGFbY3VycmVudFN0ZXAtMl0gZWxzZSAwXG4gICAgICAgIHRvID0gZGF0YVtjdXJyZW50U3RlcC0xXVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkID49IGZyb20gYW5kIGQgPCB0b1xuICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrY3VycmVudFN0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICAgcmVzaXplSGFuZGxlcigpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXMpIC0+XG5cbiAgICAjIHBhcnNlIGRhdGFcbiAgICBkYXRhID0gW11cbiAgICBkYXRhX3VubWV0bmVlZHMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGNvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBpZiBjb3VudHJ5WzBdIGFuZCBjb3VudHJ5WzBdWydnbmknXVxuICAgICAgICAgIGRhdGEucHVzaFxuICAgICAgICAgICAgdmFsdWU6ICAgICAgK2RbJ2VzdGltYXRlZCddXG4gICAgICAgICAgICBpZDogICAgICAgICBjb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICAgIG5hbWU6ICAgICAgIGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgcG9wdWxhdGlvbjogK2NvdW50cnlbMF1bJ3BvcHVsYXRpb24nXVxuICAgICAgICAgICAgZ25pOiAgICAgICAgK2NvdW50cnlbMF1bJ2duaSddXG4gICAgICAjIyNcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ05vIEdOSSBvciBQb3B1bGF0aW9uIGRhdGEgZm9yIHRoaXMgY291bnRyeScsIGQuY29kZSwgY291bnRyeVswXVxuICAgICAgIyMjXG5cbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAgICAgICdnbmknXG4gICAgICAgIHk6ICAgICAgJ3ZhbHVlJ1xuICAgICAgICBpZDogICAgICdpZCdcbiAgICAgICAgbGFiZWw6ICAnbmFtZSdcbiAgICAgICAgY29sb3I6ICAndmFsdWUnXG4gICAgICAgIHNpemU6ICAgJ3BvcHVsYXRpb24nXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAzMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWNvbnRhaW5lci1ncmFwaCcsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIHVubWV0bmVlZHNHcmFwaC5zZXRNb2RlIGN1cnJlbnRTdGVwXG5cbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgcGFyc2UgZGF0YSB1c2VcbiAgICBkYXRhX3VzZS5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiAgICAgICMjI1xuICAgICAgZFsnUmh5dGhtJ10gICAgICAgICAgICAgICAgICAgID0gK2RbJ1JoeXRobSddXG4gICAgICBkWydXaXRoZHJhd2FsJ10gICAgICAgICAgICAgICAgPSArZFsnV2l0aGRyYXdhbCddXG4gICAgICBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10gPSArZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkWydUcmFkaXRpb25hbCBtZXRob2RzJ10gPSBkWydSaHl0aG0nXStkWydXaXRoZHJhd2FsJ10rZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBjb25zb2xlLmxvZyBkLmNvZGUsIGRbJ1JoeXRobSddLCBkWydXaXRoZHJhd2FsJ10sIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSwgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkZWxldGUgZFsnUmh5dGhtJ11cbiAgICAgIGRlbGV0ZSBkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRlbGV0ZSBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgICMjI1xuICAgICAgZC52YWx1ZXMgPSBbXSAjICtkWydBbnkgbWV0aG9kJ11cbiAgICAgIGQudmFsdWUgPSAwICAjICtkWydNYWxlIHN0ZXJpbGl6YXRpb24nXVxuICAgICAgIyBnZXQgbWFpbiBtZXRob2QgaW4gZWFjaCBjb3VudHJ5XG4gICAgICBtZXRob2RzX2tleXMuZm9yRWFjaCAoa2V5LGkpIC0+XG4gICAgICAgIGQudmFsdWVzLnB1c2hcbiAgICAgICAgICBpZDogaVxuICAgICAgICAgIG5hbWU6IG1ldGhvZHNfbmFtZXNbbGFuZ11baV1cbiAgICAgICAgICB2YWx1ZTogaWYgZFtrZXldICE9ICcnIHRoZW4gK2Rba2V5XSBlbHNlIG51bGxcbiAgICAgICAgI2RlbGV0ZSBkW2tleV1cbiAgICAgICMgc29ydCBkZXNjZW5kaW5nIHZhbHVlc1xuICAgICAgI2QudmFsdWVzLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlLCBiLnZhbHVlKVxuICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgICMjI1xuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuICAgICAgIyMjXG4gICAgXG4gICAgIyBTZXQgdXNlIG1hcFxuICAgIHVzZU1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogNjBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IHRydWVcbiAgICAgIGxhbmc6IGxhbmdcbiAgICB1c2VNYXAuc2V0RGF0YSBkYXRhX3VzZSwgbWFwXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgY3VycmVudFN0ZXAgIyB1cGRhdGUgbWFwIGJhc2VkIG9uIHN0ZXAgXG5cbiAgICAjIHNldHVwIHJlc2l6ZVxuICAgIHVzZU1hcC5vblJlc2l6ZSgpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VNYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIFRyZWVuYXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCA9IChkYXRhX3VzZSkgLT5cblxuICAgICMgc2V0dXAgdHJlZW1hcFxuICAgIHVzZVRyZWVtYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICBtZXRob2RzS2V5czogbWV0aG9kc19rZXlzXG4gICAgICBtZXRob2RzTmFtZXM6IG1ldGhvZHNfbmFtZXNbbGFuZ11cbiAgICAjIHNldCBkYXRhXG4gICAgdXNlVHJlZW1hcC5zZXREYXRhIGRhdGFfdXNlLCB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcicsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIGlmIGN1cnJlbnRTdGVwID09IDFcbiAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgIGVsc2UgaWYgY3VycmVudFN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuXG4gICAgIyBzZXQgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VUcmVlbWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFJlYXNvbnMgT3Bwb3NpdGlvbiBHcmFwaHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoID0gLT5cbiAgICAkYmFycyA9ICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQgLmJhcicpXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1sZWdlbmQgbGknKVxuICAgICAgLm1vdXNlb3ZlciAtPlxuICAgICAgICAkYmFyc1xuICAgICAgICAgIC5hZGRDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgIC5maWx0ZXIoJy5iYXItJyskKHRoaXMpLmF0dHIoJ2NsYXNzJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgIC5tb3VzZW91dCAtPlxuICAgICAgICAkYmFycy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuXG5cbiAgb25DYXJvdXNlbFN0ZXAgPSAoZSkgLT5cbiAgICBjdXJyZW50U3RlcCA9IGQzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgI2NvbnNvbGUubG9nICdjYXJvdXNlbCcsIGN1cnJlbnRTdGVwXG4gICAgQGdyYXBoaWMuc2VsZWN0QWxsKCcuYWN0aXZlJykuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICBAZ3JhcGhpYy5zZWxlY3QoJy5zdGVwLScrY3VycmVudFN0ZXApLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuXG4gICMgc2V0dXAgbGluZSBjaGFydFxuICBzZXR1cE1vcnRhbGl0eUxpbmVHcmFwaCA9ICAtPlxuICAgIGRhdGEgPSBbe1xuICAgICAgJzE5OTAnOiAzODVcbiAgICAgICcxOTk1JzogMzY5XG4gICAgICAnMjAwMCc6IDM0MVxuICAgICAgJzIwMDUnOiAyODhcbiAgICAgICcyMDEwJzogMjQ2XG4gICAgICAnMjAxNSc6IDIxNlxuICAgIH1dXG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnbWF0ZXJuYWwtbW9ydGFsaXR5LWdyYXBoJyxcbiAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgbWFyZ2luOiBsZWZ0OiAyMClcbiAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsxOTk1LCAyMDA1LCAyMDE1XVxuICAgIGdyYXBoLnlBeGlzXG4gICAgICAudGlja1ZhbHVlcyBbMTAwLCAyMDAsIDMwMF1cbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnLjBzJylcbiAgICBncmFwaC55Rm9ybWF0ID0gZDMuZm9ybWF0KCcuMnMnKVxuICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgMzg1XVxuICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldExvY2F0aW9uID0gKGxvY2F0aW9uLCBjb3VudHJpZXMpIC0+XG4gICAgaWYgbG9jYXRpb25cbiAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGxvY2F0aW9uID0ge31cblxuICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cblxuICBzZXR1cERhdGFBcnRpY2xlID0gKGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG5cbiAgICAjIGFkZCBjb3VudHJ5IElTTyAzMTY2LTEgYWxwaGEtMyBjb2RlIHRvIGRhdGFfcmVhc29uc1xuICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZTIgPT0gZC5jb2RlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQuY29kZSA9IGl0ZW1bMF0uY29kZVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgT2JqZWN0LmtleXMocmVhc29uc19uYW1lc1tsYW5nXSkuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICAgIGRbcmVhc29uXSA9IDEwMCpkW3JlYXNvbl1cbiAgICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgICBkZWxldGUgZC5jb3VudHJ5XG4gICAgICAjIyNcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuICdObyBjb3VudHJ5IGRhdGEgZm9yICcrZC5jb2RlXG4gICAgICAjIyNcblxuICAgIGlmICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwIGRhdGFfdXNlXG5cbiAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcFxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGgoKVxuXG4gICAgaWYgJCgnI3VubWV0LW5lZWRzLWdkcC1ncmFwaCcpLmxlbmd0aFxuICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNcblxuICAgIGlmICQoJyNjYXJvdXNlbC1tYXJpZS1zdG9wZXMnKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJywgb25DYXJvdXNlbFN0ZXBcblxuICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnKS5sZW5ndGhcbiAgICAgIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCgpXG5cbiAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICBuZXcgQ29udHJhY2VwdGl2ZXNBcHAgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyQ291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzW2xhbmddLCBtZXRob2RzX2Roc19uYW1lc1tsYW5nXSwgcmVhc29uc19uYW1lc1tsYW5nXSwgcmVhc29uc19kaHNfbmFtZXNbbGFuZ11cblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICAjIGRhdGEgYXJ0aWNsZVxuICBpZiAkKCdib2R5JykuaGFzQ2xhc3MoJ2RhdG9zLXVzby1iYXJyZXJhcycpIG9yICQoJ2JvZHknKS5oYXNDbGFzcygnZGF0YS11c2UtYmFycmllcnMnKVxuICAgICMgTG9hZCBsb2NhdGlvblxuICAgIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgICAgIGQzLnF1ZXVlKClcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgICAgc2V0TG9jYXRpb24gbG9jYXRpb24sIGNvdW50cmllc1xuICAgICAgICAgIHNldHVwRGF0YUFydGljbGUgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcFxuXG4gICMgcmVsaWdpb24gYXJ0aWNsZVxuICBlbHNlIGlmICQoJ2JvZHknKS5oYXNDbGFzcyAncmVsaWdpb24nXG4gICAgaWYgJCgnI2Nhcm91c2VsLXJhYmlub3MnKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtcmFiaW5vcycsIG9uQ2Fyb3VzZWxTdGVwXG4gICAgaWYgJCgnI2Nhcm91c2VsLWltYW0nKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtaW1hbScsIG9uQ2Fyb3VzZWxTdGVwXG4gICAgaWYgJCgnI2Nhcm91c2VsLXBhcGEnKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtcGFwYScsIG9uQ2Fyb3VzZWxTdGVwXG4gICAgaWYgJCgnI21hdGVybmFsLW1vcnRhbGl0eS1ncmFwaCcpLmxlbmd0aFxuICAgICAgc2V0dXBNb3J0YWxpdHlMaW5lR3JhcGgoKVxuXG4gICAjIGRhdGEgc3RhdGljIGFydGljbGVcbiAgZWxzZSBpZiAkKCdib2R5JykuaGFzQ2xhc3MgJ2RhdG9zLXVzby1iYXJyZXJhcy1zdGF0aWMnXG4gICAgIyBMb2FkIGxvY2F0aW9uXG4gICAgZDMuanNvbiAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJywgKGVycm9yLCBsb2NhdGlvbikgLT5cbiAgICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgICAgZDMucXVldWUoKVxuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktcG9wdWxhdGlvbi0yMDE2LmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgICBzZXRMb2NhdGlvbiBsb2NhdGlvbiwgY291bnRyaWVzXG4gICAgICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddXG5cbikgalF1ZXJ5XG4iXX0=
