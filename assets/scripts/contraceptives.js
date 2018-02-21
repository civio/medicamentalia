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
            cy_factor: 0.297,
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
            cy_factor: 0.34,
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
            cy_factor: 0.416,
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
            cy_factor: 0.345,
            r: 0,
            textOffset: [-12, 0],
            label: {
              es: 'Grecia',
              en: 'Greece'
            }
          }, {
            cx_factor: 0.564,
            cy_factor: 0.73,
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
            cy_factor: 0.56,
            r: 0,
            textOffset: [15, 5],
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
            cy_factor: 0.318,
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
            cy_factor: 0.332,
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
      console.log(data_country[0]);
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
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
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
    ContraceptivesApp.prototype.has_dhs = false;

    ContraceptivesApp.prototype.filter_keys = {
      'contraceptives-filter-0': 'residence',
      'contraceptives-filter-1': 'age',
      'contraceptives-filter-2': 'education',
      'contraceptives-filter-3': 'wealth'
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
      var countryReasons, countryUnmetneeds, countryUse, country_code, country_methods, method, method_value, reason, reason_value, reasons, unmetneeds, use;
      country_code = $(e.target).val();
      console.log(country_code);
      this.has_dhs = true;
      use = null;
      method = null;
      method_value = null;
      unmetneeds = null;
      reason = null;
      reason_value = null;
      this.$app.find('.contraceptives-app-filters').hide();
      if (this.has_dhs) {
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/UGIR52DT_all.csv', (function(_this) {
          return function(error, data) {
            var d;
            console.log(data);
            d = data[0];
            _this.setAppItemData(_this.$app, 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
            return _this.$app.find('.contraceptives-app-filters').show();
          };
        })(this));
      } else {
        countryUse = this.data.use.filter(function(d) {
          return d.code === country_code;
        });
        if (countryUse && countryUse[0]) {
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
          use = countryUse[0]['Any modern method'];
          method = country_methods[0].name;
          method_value = country_methods[0].value;
        }
        countryUnmetneeds = this.data.unmetneeds.filter(function(d) {
          return d.code === country_code;
        });
        if (countryUnmetneeds && countryUnmetneeds[0]) {
          unmetneeds = countryUnmetneeds[0]['survey'] ? countryUnmetneeds[0]['survey'] : countryUnmetneeds[0]['estimated'];
        }
        countryReasons = this.data.reasons.filter(function(d) {
          return d.code === country_code;
        });
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
        return this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value);
      }
    };

    ContraceptivesApp.prototype.onSelectFilter = function(e) {
      var $target;
      e.preventDefault();
      if (this.filter !== $(e.target).attr('href').substring(1)) {
        this.$app.find('.contraceptives-app-filters .btn').removeClass('active');
        $target = $(e.target).addClass('active');
        this.filter = $target.attr('href').substring(1);
        $('.contraceptives-filter').hide();
        this.filterEl = $('#' + this.filter).show();
        console.log(this.filter);
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/UGIR52DT_' + this.filter_keys[this.filter] + '.csv', (function(_this) {
          return function(error, data) {
            console.log(data);
            if (data) {
              return data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
              });
            }
          };
        })(this));
      }
    };

    ContraceptivesApp.prototype.setAppItemData = function($el, use, method, method_value, unmetneeds, reason, reason_value) {
      console.log('setAppItemData', $el, use, method, method_value, unmetneeds, reason, reason_value);
      if (use) {
        $el.find('.contraceptives-app-data-use').html(Math.round(+use) + '%');
        $el.find('.contraceptives-app-data-main-method').html(method);
        $el.find('.contraceptives-app-data-main-method-value').html(Math.round(+method_value) + '%');
        $el.find('.contraceptives-app-use').show();
      } else {
        $el.find('.contraceptives-app-use').hide();
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
        return $el.find('.contraceptives-app-reason').show();
      } else {
        return $el.find('.contraceptives-app-reason').hide();
      }
    };

    return ContraceptivesApp;

  })();

}).call(this);

(function() {
  (function($) {
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, onCarouselStep, reasons_dhs_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupDataArticle, setupMortalityLineGraph, setupReasonsOpposedGraph, setupUnmetNeedsGdpGraph, userCountry;
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
      'en': ["female sterilization", "male sterilization", "IUD", "implant", "injectable", "pill", "male condom", "female condom", "vaginal barrier methods", "lactational amenorrhea method (LAM)", "emergency contraception", "other modern methods", "traditional methods"]
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
        '6': "female sterilization",
        '7': "male sterilization",
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
          itemsWidth = (graphWidth / 20) - 10;
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
          data = [63, 88, 100];
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
        } else {
          return console.log('No GNI or Population data for this country', d.code, country[0]);
        }
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
        } else {
          return console.log('no country', d.code);
        }
      });
      useMap = new window.ContraceptivesUseMapGraph('map-contraceptives-use', {
        aspectRatio: 0.5625,
        margin: {
          top: 20,
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
    setupDataArticle = function(error, data_use, data_unmetneeds, data_reasons, countries, map, location) {
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
        userCountry.name = lang === 'es' ? 'España' : 'Spain';
      }
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
        } else {
          return console.warn('No country data for ' + d.code);
        }
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
    if ($('body').hasClass('datos-uso-barreras') || $('body').hasClass('data-use-barriers')) {
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').defer(d3.json, 'https://freegeoip.net/json/').await(setupDataArticle);
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
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwic2Nyb2xsLWdyYXBoLmNvZmZlZSIsIm1hcC1ncmFwaC5jb2ZmZWUiLCJsaW5lLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFE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Q00sSUFBQSxXQUFBLENBQVksZUFBWixFQUE2QixjQUE3QixFQUROOztNQUVBLElBQUcsQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsTUFBdkI7UUFDTSxJQUFBLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLGNBQTdCLEVBRE47O01BRUEsSUFBRyxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxNQUFsQztlQUNFLHVCQUFBLENBQUEsRUFERjtPQVBHOztFQWpnQk4sQ0FBRCxDQUFBLENBMmdCRSxNQTNnQkY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuU2Nyb2xsR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoX2lkLCBfc3RlcENhbGxiYWNrKSAtPlxuICAgIEBpZCA9IF9pZFxuICAgIEBzdGVwQ2FsbGJhY2sgPSBfc3RlcENhbGxiYWNrXG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKVxuICAgIEBncmFwaGljICAgPSBAY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBAc3RlcHMgICAgID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5zY3JvbGwtdGV4dCAuc3RlcCcpXG4gICAgQGNoYXJ0ICAgICA9IEBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIEBzY3JvbGxlciA9IHNjcm9sbGFtYSgpXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBAb25SZXNpemUoKVxuICAgICMgMi4gc2V0dXAgdGhlIHNjcm9sbGFtYSBpbnN0YW5jZVxuICAgICMgMy4gYmluZCBzY3JvbGxhbWEgZXZlbnQgaGFuZGxlcnMgKHRoaXMgY2FuIGJlIGNoYWluZWQgbGlrZSBiZWxvdylcbiAgICBAc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycrQGlkICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJyMnK0BpZCsnIC5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgc3RlcDogICAgICAgJyMnK0BpZCsnIC5zY3JvbGwtdGV4dCAuc3RlcCcgICMgdGhlIHN0ZXAgZWxlbWVudHNcbiAgICAgICAgb2Zmc2V0OiAgICAgMC4wNSAgICAgICAgICAgICAgICAgICMgc2V0IHRoZSB0cmlnZ2VyIHRvIGJlIDEvMiB3YXkgZG93biBzY3JlZW5cbiAgICAgICAgZGVidWc6ICAgICAgZmFsc2UgICAgICAgICAgICAgICAgICMgZGlzcGxheSB0aGUgdHJpZ2dlciBvZmZzZXQgZm9yIHRlc3RpbmdcbiAgICAgIC5vbkNvbnRhaW5lckVudGVyIEBvbkNvbnRhaW5lckVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRXhpdCAgQG9uQ29udGFpbmVyRXhpdFxuICAgICAgLm9uU3RlcEVudGVyICAgICAgQG9uU3RlcEVudGVyXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgQG9uUmVzaXplXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgd2lkdGggPSBAZ3JhcGhpYy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggI01hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICBoZWlnaHQgPSBNYXRoLmZsb29yIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgQHN0ZXBzLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgIEBncmFwaGljLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICBAY2hhcnRcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgIyA0LiB0ZWxsIHNjcm9sbGFtYSB0byB1cGRhdGUgbmV3IGVsZW1lbnQgZGltZW5zaW9uc1xuICAgIEBzY3JvbGxlci5yZXNpemUoKVxuXG4gICMgc3RpY2t5IHRoZSBncmFwaGljXG4gIG9uQ29udGFpbmVyRW50ZXI6IChlKSA9PlxuICAgIEBncmFwaGljXG4gICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCB0cnVlXG4gICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICBvbkNvbnRhaW5lckV4aXQ6IChlKSA9PlxuICAgIEBncmFwaGljXG4gICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICMgY2FsbCBzdGVwQ2FsbGJhY2sgb24gZW50ZXIgc3RlcFxuICBvblN0ZXBFbnRlcjogKGUpID0+XG4gICAgQHN0ZXBDYWxsYmFjayhlKVxuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgQGdldExlZ2VuZEZvcm1hdFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICAjIGdldCBjb3VudHJpZXMgZGF0YVxuICAgIEBjb3VudHJpZXMgPSB0b3BvanNvbi5mZWF0dXJlKG1hcCwgbWFwLm9iamVjdHMuY291bnRyaWVzKTtcbiAgICBAY291bnRyaWVzLmZlYXR1cmVzID0gQGNvdW50cmllcy5mZWF0dXJlcy5maWx0ZXIgKGQpIC0+IGQuaWQgIT0gJzAxMCcgICMgcmVtb3ZlIGFudGFyY3RpY2FcbiAgICAjIHNldCBwcm9qZWN0aW9uXG4gICAgQHByb2plY3Rpb24gPSBkMy5nZW9LYXZyYXlza2l5NygpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICAjIHNldCBwYXRoXG4gICAgQHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAgIC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgIyBhZGQgY291bnRyaWVzIHBhdGhzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAuZGF0YShAY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NvdW50cnktJytkLmlkXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2NvdW50cnknXG4gICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAxXG4gICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICMgdHJpZ2dlciBkcmF3LWNvbXBsZXRlIGV2ZW50XG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG5cbiAgZ2V0TGVnZW5kRGF0YTogPT5cbiAgICByZXR1cm4gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZFxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWUubGVuZ3RoID4gMFxuICAgICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICAgIEBzZXRUb29sdGlwRGF0YSB2YWx1ZVswXVxuICAgICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgb2Zmc2V0ID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuICAgICAgICAnb3BhY2l0eSc6ICcxJ1xuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBpZiBkLmNhc2VzXG4gICAgICBAJHRvb2x0aXBcbiAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcykgIiwiY2xhc3Mgd2luZG93LkxpbmVHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIHlGb3JtYXQ6IGQzLmZvcm1hdCgnZCcpICAgIyBzZXQgbGFiZWxzIGhvdmVyIGZvcm1hdFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0xpbmUgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQHllYXJzID0gQGdldFllYXJzIGRhdGFcbiAgICBzdXBlcihkYXRhKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIHllYXJzID0gW11cbiAgICBkMy5rZXlzKGRhdGFbMF0pLmZvckVhY2ggKGQpIC0+XG4gICAgICBpZiArZFxuICAgICAgICB5ZWFycy5wdXNoICtkXG4gICAgcmV0dXJuIHllYXJzLnNvcnQoKVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZFtAb3B0aW9ucy5rZXkueF0sICdlbiAnLCB5ZWFyKTtcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YSBcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbScgICAgICBcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgXG4gIHNldFRpY2tIb3ZlclBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCBNYXRoLnJvdW5kIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCs5IiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuTWFwR3JhcGhcblxuICBjdXJyZW50U3RhdGU6IDBcblxuICBzdGF0ZXM6IFtcbiAgICB7XG4gICAgICBpZDogJ0ZlbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hJ1xuICAgICAgICBlbjogJ2ZlbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40OFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTIwLCAzMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnSW5kaWEnXG4gICAgICAgICAgICBlbjogJ0luZGlhJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjI3XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ2NVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMjAsIC01XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdSZXDDumJsaWNhIERvbWluaWNhbmEnXG4gICAgICAgICAgICBlbjogJ0RvbWluaWNhbiBSZXB1YmxpYydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hJ1xuICAgICAgICBlbjogJ21hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjI2NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4yOTdcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzMwLCAyNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2FuYWTDoSdcbiAgICAgICAgICAgIGVuOiAnQ2FuYWRhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zNFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDb3JlYSBkZWwgTm9ydGUnXG4gICAgICAgICAgICBlbjogJ05vcnRoIEtvcmVhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDaGluYSdcbiAgICAgICAgICAgIGVuOiAnQ2hpbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnUGlsbCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3DDrWxkb3JhJ1xuICAgICAgICBlbjogJ3BpbGwnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC40NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDE2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMzUsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FyZ2VsaWEnXG4gICAgICAgICAgICBlbjogJ0FsZ2VyaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBjb25kb20nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdwcmVzZXJ2YXRpdm8gbWFzY3VsaW5vJ1xuICAgICAgICBlbjogJ21hbGUgY29uZG9tJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTQyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjM0NVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdHcmVjaWEnXG4gICAgICAgICAgICBlbjogJ0dyZWVjZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNzNcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzE1LCAtMTBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0JvdHN1YW5hJ1xuICAgICAgICAgICAgZW46ICdCb3Rzd2FuYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJbmplY3RhYmxlJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnaW55ZWN0YWJsZSdcbiAgICAgICAgZW46ICdpbmplY3RhYmxlJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNjJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNTZcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzE1LCA1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdFdGlvcMOtYSdcbiAgICAgICAgICAgIGVuOiAnRXRoaW9waWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMThcbiAgICAgICAgICByOiAxNlxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjYsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0JhbGNhbmVzJ1xuICAgICAgICAgICAgZW46ICdCYWxrYW5zJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzMyXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTAsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FsYmFuaWEnXG4gICAgICAgICAgICBlbjogJ0FsYmFuaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICBnZXRMZWdlbmREYXRhOiAtPlxuICAgIHJldHVybiBbMCwyMCw0MCw2MCw4MF1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkKyclJ1xuXG4gICMgb3ZlcnJpZGUgZ2V0RGltZW5zaW9uc1xuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIG9mZnNldCA9IDEwMFxuICAgIGlmIEAkZWxcbiAgICAgIGJvZHlIZWlnaHQgPSAkKCdib2R5JykuaGVpZ2h0KCktb2Zmc2V0XG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgICNAJGVsLmNzcyAndG9wJywgMFxuICAgICAgIyB2ZXJ0aWNhbCBjZW50ZXIgZ3JhcGhcbiAgICAgICNlbHNlXG4gICAgICAjICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG5cblxuICAjIG92ZXJyaWRlIGNvbG9yIGRvbWFpblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCA4MF1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICBzdXBlcihtYXApXG4gICAgQHJpbmdOb3RlID0gZDMucmluZ05vdGUoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIEBjdXJyZW50TWV0aG9kID0gQHN0YXRlc1tAY3VycmVudFN0YXRlLTFdXG4gICAgICBpZiBAY3VycmVudE1ldGhvZFxuICAgICAgICAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIEBjdXJyZW50TWV0aG9kLnRleHRbQG9wdGlvbnMubGFuZ11cbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT4gZC52YWx1ZSA9ICtkW0BjdXJyZW50TWV0aG9kLmlkXVxuICAgICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiAgICAgICAgQHNldEFubm90YXRpb25zKClcblxuICBzZXRBbm5vdGF0aW9uczogLT5cbiAgICBpZiBAY3VycmVudE1ldGhvZFxuICAgICAgQGN1cnJlbnRNZXRob2QubGFiZWxzLmZvckVhY2ggKGQpID0+IFxuICAgICAgICBkLmN4ID0gZC5jeF9mYWN0b3IqQHdpZHRoXG4gICAgICAgIGQuY3kgPSBkLmN5X2ZhY3RvcipAaGVpZ2h0XG4gICAgICAgIGQudGV4dCA9IGQubGFiZWxbQG9wdGlvbnMubGFuZ11cbiAgICAgIEBjb250YWluZXIuY2FsbCBAcmluZ05vdGUsIEBjdXJyZW50TWV0aG9kLmxhYmVsc1xuIiwiY2xhc3Mgd2luZG93LlRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgb3B0aW9ucy5taW5TaXplID0gb3B0aW9ucy5taW5TaXplIHx8IDYwXG4gICAgb3B0aW9ucy5ub2Rlc1BhZGRpbmcgPSBvcHRpb25zLm5vZGVzUGFkZGluZyB8fCA4XG4gICAgb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiB8fCA2MDBcbiAgICBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgPSBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgfHwgNjIwXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIGRyYXcgc2NhbGVzXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJyaWRlIHNldFNWRyB0byB1c2UgYSBkaXYgY29udGFpbmVyIChub2Rlcy1jb250YWluZXIpIGluc3RlYWQgb2YgYSBzdmcgZWxlbWVudFxuICBzZXRTVkc6IC0+XG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZXMtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgQHRyZWVtYXAgPSBkMy50cmVlbWFwKClcbiAgICAgIC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgICAucGFkZGluZyAwXG4gICAgICAucm91bmQgdHJ1ZVxuXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG5cbiAgICBAc3RyYXRpZnkgPSBkMy5zdHJhdGlmeSgpLnBhcmVudElkIChkKSAtPiBkLnBhcmVudFxuXG4gICAgQHVwZGF0ZUdyYXBoKClcblxuICAgIHJldHVybiBAXG5cblxuICB1cGRhdGVHcmFwaDogLT5cblxuICAgICMgdXBkYXRlIHRyZW1hcCBcbiAgICBAdHJlZW1hcFJvb3QgPSBAc3RyYXRpZnkoQGRhdGEpXG4gICAgICAuc3VtIChkKSA9PiBkW0BvcHRpb25zLmtleS52YWx1ZV1cbiAgICAgIC5zb3J0IChhLCBiKSAtPiBiLnZhbHVlIC0gYS52YWx1ZVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyB1cGRhdGUgbm9kZXNcbiAgICBub2RlcyA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICBcbiAgICBub2Rlcy5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2RlJ1xuICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbCdcbiAgICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsLWNvbnRlbnQnXG4gICAgICAgICAgLmFwcGVuZCAncCdcblxuICAgICMgc2V0dXAgbm9kZXNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmNhbGwgQHNldE5vZGVcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuXG4gICAgIyBhZGQgbGFiZWwgb25seSBpbiBub2RlcyB3aXRoIHNpemUgZ3JlYXRlciB0aGVuIG9wdGlvbnMubWluU2l6ZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuY2FsbCAgIEBzZXROb2RlTGFiZWxcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICBub2Rlcy5leGl0KCkucmVtb3ZlKClcblxuICAgIHJldHVybiBAXG5cblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcblxuICAgIEBjb250YWluZXIuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gICAgIyBVcGRhdGUgdHJlbWFwIHNpemVcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcbiAgICBlbHNlXG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTcXVhcmlmeVxuICAgIEB0cmVlbWFwLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgVXBkYXRlIG5vZGVzIGRhdGFcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcbiAgICAgIFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgcmV0dXJuIEBcblxuXG4gIHNldE5vZGU6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY2xhc3MnLCAgICAgICBAZ2V0Tm9kZUNsYXNzXG4gICAgICAuc3R5bGUgJ3BhZGRpbmcnLCAgICAoZCkgPT4gaWYgKGQueDEtZC54MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nICYmIGQueTEtZC55MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nKSB0aGVuIEBvcHRpb25zLm5vZGVzUGFkZGluZysncHgnIGVsc2UgMFxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgKGQpIC0+IGlmIChkLngxLWQueDAgPT0gMCkgfHwgKGQueTEtZC55MCA9PSAwKSB0aGVuICdoaWRkZW4nIGVsc2UgJydcblxuICBzZXROb2RlRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpIC0+IGQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSAtPiBkLnkwICsgJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgLT4gZC54MS1kLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCAoZCkgLT4gZC55MS1kLnkwICsgJ3B4J1xuXG4gIHNldE5vZGVMYWJlbDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uc2VsZWN0KCdwJylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiByZXR1cm4gaWYgZC52YWx1ZSA+IDI1IHRoZW4gJ3NpemUtbCcgZWxzZSBpZiBkLnZhbHVlIDwgMTAgdGhlbiAnc2l6ZS1zJyBlbHNlICcnXG4gICAgICAuaHRtbCAoZCkgPT4gZC5kYXRhW0BvcHRpb25zLmtleS5pZF1cblxuICBpc05vZGVMYWJlbFZpc2libGU6IChkKSA9PlxuICAgIHJldHVybiBkLngxLWQueDAgPiBAb3B0aW9ucy5taW5TaXplICYmIGQueTEtZC55MCA+IEBvcHRpb25zLm1pblNpemVcblxuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSdcbiAgICAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuVHJlZW1hcEdyYXBoXG5cbiAgIyBvdmVyZHJpdmUgZGF0YSBQYXJzZXJcbiAgZGF0YVBhcnNlcjogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgICAjIHNldCBwYXJzZWREYXRhIGFycmF5XG4gICAgcGFyc2VkRGF0YSA9IFt7aWQ6ICdyJ31dICMgYWRkIHRyZWVtYXAgcm9vdFxuICAgICMgVE9ETyEhISBHZXQgY3VycmVudCBjb3VudHJ5ICYgYWRkIHNlbGVjdCBpbiBvcmRlciB0byBjaGFuZ2UgaXRcbiAgICBkYXRhX2NvdW50cnkgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGNvbnNvbGUubG9nIGRhdGFfY291bnRyeVswXVxuICAgIGlmIGRhdGFfY291bnRyeVswXVxuICAgICAgIyBzZXQgbWV0aG9kcyBvYmplY3RcbiAgICAgIG1ldGhvZHMgPSB7fVxuICAgICAgQG9wdGlvbnMubWV0aG9kc0tleXMuZm9yRWFjaCAoa2V5LGkpID0+XG4gICAgICAgIGlmIGRhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgICAgbWV0aG9kc1trZXldID1cbiAgICAgICAgICAgIGlkOiBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csICctJykucmVwbGFjZSgnKScsICcnKS5yZXBsYWNlKCcoJywgJycpXG4gICAgICAgICAgICBuYW1lOiBAb3B0aW9ucy5tZXRob2RzTmFtZXNbaV1cbiAgICAgICAgICAgIHZhbHVlOiArZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiVGhlcmUncyBubyBkYXRhIGZvciBcIiArIGtleVxuICAgICAgIyBmaWx0ZXIgbWV0aG9kcyB3aXRoIHZhbHVlIDwgNSUgJiBhZGQgdG8gT3RoZXIgbW9kZXJuIG1ldGhvZHNcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgaWYga2V5ICE9ICdPdGhlciBtb2Rlcm4gbWV0aG9kcycgYW5kIGtleSAhPSAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCcgYW5kIG1ldGhvZC52YWx1ZSA8IDVcbiAgICAgICAgICBtZXRob2RzWydPdGhlciBtb2Rlcm4gbWV0aG9kcyddLnZhbHVlICs9IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIGRlbGV0ZSBtZXRob2RzW2tleV1cbiAgICAgXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIHBhcnNlZERhdGEucHVzaFxuICAgICAgICAgIGlkOiBtZXRob2QuaWRcbiAgICAgICAgICByYXdfbmFtZTogbWV0aG9kLm5hbWVcbiAgICAgICAgICBuYW1lOiAnPHN0cm9uZz4nICsgbWV0aG9kLm5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBtZXRob2QubmFtZS5zbGljZSgxKSArICc8L3N0cm9uZz48YnIvPicgKyBNYXRoLnJvdW5kKG1ldGhvZC52YWx1ZSkgKyAnJSdcbiAgICAgICAgICB2YWx1ZTogbWV0aG9kLnZhbHVlXG4gICAgICAgICAgcGFyZW50OiAncidcbiAgICAgIHBhcnNlZERhdGFTb3J0ZWQgPSBwYXJzZWREYXRhLnNvcnQgKGEsYikgLT4gaWYgYS52YWx1ZSBhbmQgYi52YWx1ZSB0aGVuIGIudmFsdWUtYS52YWx1ZSBlbHNlIDFcbiAgICAgICMgc2V0IGNhcHRpb24gY291bnRyeSBuYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY291bnRyeScpLmh0bWwgY291bnRyeV9uYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtYW55LW1ldGhvZCcpLmh0bWwgTWF0aC5yb3VuZChkYXRhX2NvdW50cnlbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBwYXJzZWREYXRhU29ydGVkWzBdLnJhd19uYW1lXG4gICAgZWxzZVxuICAgICAgY29uc29sZS53YXJuICdObyBkYXRhIGNvdW50cnkgZm9yICcrY291bnRyeV9jb2RlXG4gICAgICAjIFRPRE8hISEgV2hhdCB3ZSBkbyBpZiB0aGVyZSdzIG5vIGRhdGEgZm9yIHVzZXIncyBjb3VudHJ5XG4gICAgcmV0dXJuIHBhcnNlZERhdGFcblxuICAjIG92ZXJkcml2ZSBzZXQgZGF0YVxuICBzZXREYXRhOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQG9yaWdpbmFsRGF0YSA9IGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgICNAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVEYXRhOiAoY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAdXBkYXRlR3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVyZHJpdmUgbm9kZSBjbGFzc1xuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSBub2RlLScrZC5pZFxuXG4gICMjIyBvdmVyZHJpdmUgcmVzaXplXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbnRhaW5lck9mZnNldDogLT5cbiAgICBAJGVsLmNzcygndG9wJywgKCQod2luZG93KS5oZWlnaHQoKS1AJGVsLmhlaWdodCgpKSowLjUpXG4gICMjIyIsImNsYXNzIHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICBpbmNvbWVMZXZlbHM6IFsxMDA1LCAzOTU1LCAxMjIzNV1cblxuICBsYWJlbHM6IFtcbiAgICAnQUdPJyxcbiAgICAnQkdEJyxcbiAgICAnQlJBJyxcbiAgICAnQ0hOJyxcbiAgICAnREVVJyxcbiAgICAnRVNQJyxcbiAgICAnRVRIJyxcbiAgICAnSU5EJyxcbiAgICAnSUROJyxcbiAgICAnSlBOJyxcbiAgICAnTkdBJyxcbiAgICAnUEFLJyxcbiAgICAnUEhMJyxcbiAgICAnUlVTJyxcbiAgICAnU0FVJyxcbiAgICAnVFVSJyxcbiAgICAnVUdBJyxcbiAgICAnVVNBJyxcbiAgICAnVk5NJ1xuICBdXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JlZXN3YXJtR3JhcGgnLCBpZFxuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA1XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqAyXG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDE1XG4gICAgb3B0aW9ucy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IDAgIyBtb2RlIDA6IGJlZXN3YXJtLCBtb2RlIDE6IHNjYXR0ZXJwbG90XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgcmV0dXJuIGRhdGEuc29ydCAoYSxiKSA9PiBiW0BvcHRpb25zLmtleS5zaXplXS1hW0BvcHRpb25zLmtleS5zaXplXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBkYXRhXG5cbiAgZHJhd0dyYXBoOiAtPlxuXG4gICAgQHNldFNpemUoKVxuXG4gICAgIyBzZXQgJiBydW4gc2ltdWxhdGlvblxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG5cbiAgICAjIGRyYXcgZG90c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhIEBkYXRhXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0RG90XG4gICAgICAjLm9uICdtb3VzZW92ZXInLCAoZCkgPT4gY29uc29sZS5sb2cgZFxuXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAuZGF0YSBAZGF0YS5maWx0ZXIgKGQpID0+IEBsYWJlbHMuaW5kZXhPZihkW0BvcHRpb25zLmtleS5pZF0pICE9IC0xXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgPT4gcmV0dXJuIGlmIGRbQG9wdGlvbnMua2V5LnNpemVdID4gMTAwMDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1sJyBlbHNlIGlmIGRbQG9wdGlvbnMua2V5LnNpemVdID4gMTgwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLW0nIGVsc2UgJ2RvdC1sYWJlbCdcbiAgICAgICAgIy5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAgIC5hdHRyICdkeScsICcwLjI1ZW0nXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS5sYWJlbF1cbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cblxuXG4gIHNldFNpbXVsYXRpb246IC0+XG4gICAgIyBzZXR1cCBzaW11bGF0aW9uXG4gICAgZm9yY2VZID0gZDMuZm9yY2VZIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICBmb3JjZVkuc3RyZW5ndGgoMSlcbiAgICBAc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbihAZGF0YSlcbiAgICAgIC5mb3JjZSAneCcsIGZvcmNlWVxuICAgICAgLmZvcmNlICd5JywgZDMuZm9yY2VYKEB3aWR0aCouNSlcbiAgICAgIC5mb3JjZSAnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgoZCkgPT4gcmV0dXJuIGlmIEBzaXplIHRoZW4gZC5yYWRpdXMrMSBlbHNlIEBvcHRpb25zLmRvdFNpemUrMSlcbiAgICAgIC5zdG9wKClcblxuICBydW5TaW11bGF0aW9uOiAtPlxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IDM1MFxuICAgICAgQHNpbXVsYXRpb24udGljaygpXG4gICAgICArK2lcblxuICBzZXREb3Q6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAncicsICAoZCkgPT4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5hdHRyICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuXG4gIHNldERvdFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2N4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ2N5JywgQGdldFBvc2l0aW9uWVxuXG4gIHNldERvdExhYmVsUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAneCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICd5JywgQGdldFBvc2l0aW9uWVxuXG4gIGdldFBvc2l0aW9uWDogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnggZWxzZSBNYXRoLnJvdW5kIEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuXG4gIGdldFBvc2l0aW9uWTogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnkgZWxzZSBNYXRoLnJvdW5kIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIGdldERvdEZpbGw6IChkKSA9PlxuICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdICNpZiBAb3B0aW9ucy5rZXkuY29sb3IgYW5kIEBvcHRpb25zLm1vZGUgPT0gMSB0aGVuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gZWxzZSAnI2UyNzIzYidcblxuICBzZXRNb2RlOiAobW9kZSkgLT5cbiAgICBAb3B0aW9ucy5tb2RlID0gbW9kZVxuICAgIGlmIEBvcHRpb25zLm1vZGUgPCAyXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICAgaWYgQHhMZWdlbmRcbiAgICAgICAgQHhMZWdlbmQuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgICAjIHNob3cvaGlkZSBkb3QgbGFiZWxzXG4gICAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDBcbiAgICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZGVsYXkgNTAwXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMVxuICAgICAgIyBzaG93L2hpZGUgeCBheGlzIGxpbmVzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSAyXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSA8IEBpbmNvbWVMZXZlbHNbMl0gb3IgZFtAb3B0aW9ucy5rZXkueV0gPiAxNVxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSAzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSA+IEBpbmNvbWVMZXZlbHNbMV0gb3IgZFtAb3B0aW9ucy5rZXkueV0gPCAzMFxuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSA0XG4gICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZC5pZCAhPSAnU0FVJyBhbmQgZC5pZCAhPSAnSlBOJ1xuICAgIGVsc2UgaWYgQG9wdGlvbnMubW9kZSA9PSA1XG4gICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuXG4gIHNldFNpemU6IC0+XG4gICAgaWYgQHNpemVcbiAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgIGQucmFkaXVzID0gQHNpemUgZFtAb3B0aW9ucy5rZXkuc2l6ZV1cblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgc3VwZXIoKVxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgICNAeCA9IGQzLnNjYWxlUG93KClcbiAgICAjICAuZXhwb25lbnQoMC4xMjUpXG4gICAgIyAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHggPSBkMy5zY2FsZUxvZygpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICAjIEVxdWl2YWxlbnQgdG8gZDMuc2NhbGVTcXJ0KClcbiAgICAgICPCoGh0dHBzOi8vYmwub2Nrcy5vcmcvZDNpbmRlcHRoLzc3NWNmNDMxZTY0YjY3MTg0ODFjMDZmYzQ1ZGMzNGY5XG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVUaHJlc2hvbGQoKVxuICAgICAgICAucmFuZ2UgZDMuc2NoZW1lT3Jhbmdlc1s1XSAjLnJldmVyc2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgICAgLnRpY2tWYWx1ZXMgQGluY29tZUxldmVsc1xuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDEwLCAyMCwgMzAsIDQwXVxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJyUnXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC0xLDUpJ1xuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzI1MCwgODUwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDEwLCAyMCwgMzBdXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5hdHRyICd5MScsIEB5KDQwKS00XG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMgLnRpY2sgdGV4dCcpXG4gICAgICAgIC5hdHRyICdkeCcsIDNcbiAgICAgICAgLmF0dHIgJ2R5JywgLTRcbiAgICAjIHNldCB4IGxlbmdlZFxuICAgIGluY29tZXMgPSBAeEF4aXMudGlja1ZhbHVlcygpXG4gICAgaW5jb21lcy51bnNoaWZ0IDBcbiAgICBpbmNvbWVzTWF4ID0gQHggQGdldFNjYWxlWERvbWFpbigpWzFdXG4gICAgaW5jb21lcyA9IGluY29tZXMubWFwIChkKSA9PiBpZiBkID4gMCB0aGVuIDEwMCpAeChkKS9pbmNvbWVzTWF4IGVsc2UgMFxuICAgIGluY29tZXMucHVzaCAxMDBcbiAgICBAeExlZ2VuZCA9IGQzLnNlbGVjdChkMy5zZWxlY3QoJyMnK0BpZCkubm9kZSgpLnBhcmVudE5vZGUpLnNlbGVjdCgnLngtbGVnZW5kJylcbiAgICBAeExlZ2VuZC5zZWxlY3RBbGwoJ2xpJykuc3R5bGUgJ3dpZHRoJywgKGQsaSkgLT4gKGluY29tZXNbaSsxXS1pbmNvbWVzW2ldKSsnJSdcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzQXBwXG5cbiAgaGFzX2RoczogZmFsc2UgIFxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG5cbiAgY29uc3RydWN0b3I6IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJfY291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzLCBtZXRob2RzX2Roc19uYW1lcywgcmVhc29uc19uYW1lcywgcmVhc29uc19kaHNfbmFtZXMpIC0+XG5cbiAgICBAZGF0YSA9IFxuICAgICAgdXNlOiAgICAgICAgZGF0YV91c2VcbiAgICAgIHVubWV0bmVlZHM6IGRhdGFfdW5tZXRuZWVkc1xuICAgICAgcmVhc29uczogICAgZGF0YV9yZWFzb25zXG5cbiAgICBAbWV0aG9kc0tleXMgICAgICA9IG1ldGhvZHNfa2V5c1xuICAgIEBtZXRob2RzTmFtZXMgICAgID0gbWV0aG9kc19uYW1lc1xuICAgIEBtZXRob2RzREhTTmFtZXMgID0gbWV0aG9kc19kaHNfbmFtZXNcbiAgICBAcmVhc29uc05hbWVzICAgICA9IHJlYXNvbnNfbmFtZXNcbiAgICBAcmVhc29uc0RIU05hbWVzICA9IHJlYXNvbnNfZGhzX25hbWVzXG5cbiAgICBAJGFwcCA9ICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKVxuXG4gICAgQCRhcHAuZmluZCgnLnNlbGVjdC1jb3VudHJ5JylcbiAgICAgIC5zZWxlY3QyKClcbiAgICAgIC5jaGFuZ2UgQG9uU2VsZWN0Q291bnRyeVxuICAgICAgLnZhbCB1c2VyX2NvdW50cnkuY29kZVxuICAgICAgLnRyaWdnZXIgJ2NoYW5nZSdcblxuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykuY2xpY2sgQG9uU2VsZWN0RmlsdGVyXG5cbiAgICBAJGFwcC5jc3MoJ29wYWNpdHknLDEpXG5cblxuICBvblNlbGVjdENvdW50cnk6IChlKSA9PlxuICAgIGNvdW50cnlfY29kZSA9ICQoZS50YXJnZXQpLnZhbCgpXG4gICAgY29uc29sZS5sb2cgY291bnRyeV9jb2RlXG5cbiAgICAjIGNoZWNrIGRocyBkYXRhIGlzIGF2YWlsYWJsZVxuICAgIEBoYXNfZGhzID0gdHJ1ZVxuXG4gICAgdXNlICAgICAgICAgICA9IG51bGxcbiAgICBtZXRob2QgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZF92YWx1ZSAgPSBudWxsXG4gICAgdW5tZXRuZWVkcyAgICA9IG51bGxcbiAgICByZWFzb24gICAgICAgID0gbnVsbFxuICAgIHJlYXNvbl92YWx1ZSAgPSBudWxsXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5oaWRlKClcblxuICAgIGlmIEBoYXNfZGhzXG4gICAgICBkMy5jc3YgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy9VR0lSNTJEVF9hbGwuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyBkYXRhXG4gICAgICAgIGQgPSBkYXRhWzBdXG4gICAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIDEwMCpkLnVzaW5nX21vZGVybl9tZXRob2QvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29uc1xuICAgICAgICAjIHNob3cgZmlsdGVyc1xuICAgICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAjIFVzZVxuICAgICAgY291bnRyeVVzZSA9IEBkYXRhLnVzZS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gQG1ldGhvZHNLZXlzLm1hcCAoa2V5LCBpKSA9PiB7J25hbWUnOiBAbWV0aG9kc05hbWVzW2ldLCAndmFsdWUnOiArY291bnRyeVVzZVswXVtrZXldfVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBjb3VudHJ5X21ldGhvZHMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgdXNlICAgICAgICAgICAgID0gY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXVxuICAgICAgICBtZXRob2QgICAgICAgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICBtZXRob2RfdmFsdWUgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0udmFsdWVcbiAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVJlYXNvbnMgYW5kIGNvdW50cnlSZWFzb25zWzBdXG4gICAgICAgIHJlYXNvbnMgICAgICA9IE9iamVjdC5rZXlzKEByZWFzb25zTmFtZXMpLm1hcCAocmVhc29uKSA9PiB7J25hbWUnOiBAcmVhc29uc05hbWVzW3JlYXNvbl0sICd2YWx1ZSc6ICtjb3VudHJ5UmVhc29uc1swXVtyZWFzb25dfVxuICAgICAgICByZWFzb25zICAgICAgPSByZWFzb25zLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIHJlYXNvbiAgICAgICA9IHJlYXNvbnNbMF0ubmFtZVxuICAgICAgICByZWFzb25fdmFsdWUgPSByZWFzb25zWzBdLnZhbHVlXG4gICAgICAjIHNldHVwIGRhdGFcbiAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuXG4gIG9uU2VsZWN0RmlsdGVyOiAoZSkgPT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiBAZmlsdGVyICE9ICQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSlcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgIGNvbnNvbGUubG9nIEBmaWx0ZXJcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvVUdJUjUyRFRfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGNvbnNvbGUubG9nIGRhdGFcbiAgICAgICAgaWYgZGF0YVxuICAgICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAZmlsdGVyRWwuZmluZCgnIycrQGZpbHRlcisnLScrZC5pZCksIDEwMCpkLnVzaW5nX21vZGVybl9tZXRob2QvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29uc1xuXG5cbiAgc2V0QXBwSXRlbURhdGE6ICgkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlKSAtPlxuXG4gICAgY29uc29sZS5sb2cgJ3NldEFwcEl0ZW1EYXRhJywgJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG4gICAgaWYgdXNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrdXNlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZC12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrbWV0aG9kX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuXG4gICAgaWYgdW5tZXRuZWVkc1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11bm1ldG5lZWRzJykuaHRtbCBNYXRoLnJvdW5kKCt1bm1ldG5lZWRzKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG5cbiAgICBpZiByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCtyZWFzb25fdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuaGlkZSgpXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG4gIFxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAnMSc6IFwicMOtbGRvcmFcIlxuICAgICAgJzInOiBcIkRJVVwiXG4gICAgICAnMyc6IFwiaW55ZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZMOzblwiXG4gICAgICAnNic6IFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgICc3JzogXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgICc4JzogXCJhYnN0aW5lbmNpYSBwZXJpw7NkaWNhXCJcbiAgICAgICc5JzogXCJtYXJjaGEgYXRyw6FzXCJcbiAgICAgICcxMCc6IFwib3Ryb3NcIlxuICAgICAgJzExJzogXCJpbXBsYW50ZVwiXG4gICAgICAnMTMnOiBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgJzE3JzogXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICAnZW4nOlxuICAgICAgJzEnOiBcInBpbGxcIlxuICAgICAgJzInOiBcIklVRFwiXG4gICAgICAnMyc6IFwiaW5qZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZG9tXCJcbiAgICAgICc2JzogXCJmZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICAnNyc6IFwibWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgICc4JzogXCJwZXJpb2RpYyBhYnN0aW5lbmNlXCJcbiAgICAgICc5JzogXCJ3aXRoZHJhd2FsXCJcbiAgICAgICcxMCc6IFwib3RoZXJcIlxuICAgICAgJzExJzogXCJpbXBsYW50XCJcbiAgICAgICcxMyc6IFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgJzE3JzogXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcblxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgJ2VzJzpcbiAgICAgIFwiYVwiOiBcIm5vIGVzdMOhbiBjYXNhZGFzXCJcbiAgICAgIFwiYlwiOiBcIm5vIHRpZW5lbiBzZXhvXCJcbiAgICAgIFwiY1wiOiBcInRpZW5lbiBzZXhvIGluZnJlY3VlbnRlXCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs25cIlxuICAgICAgXCJlXCI6IFwic29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhc1wiXG4gICAgICBcImZcIjogXCJhbWVub3JyZWEgcG9zdHBhcnRvXCJcbiAgICAgIFwiZ1wiOiBcImVzdMOhbiBkYW5kbyBlbCBwZWNob1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGFcIlxuICAgICAgXCJpXCI6IFwibGEgbXVqZXIgc2Ugb3BvbmVcIlxuICAgICAgXCJqXCI6IFwiZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lXCJcbiAgICAgIFwia1wiOiBcIm90cm9zIHNlIG9wb25lblwiICAgICAgICBcbiAgICAgIFwibFwiOiBcInByb2hpYmljacOzbiByZWxpZ2lvc2FcIiAgXG4gICAgICBcIm1cIjogXCJubyBjb25vY2UgbG9zIG3DqXRvZG9zXCJcbiAgICAgIFwiblwiOiBcIm5vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvc1wiXG4gICAgICBcIm9cIjogXCJwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiICAgICAgICAgICAgICAgICAgICAgXG4gICAgICBcInBcIjogXCJtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zL3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgXG4gICAgICBcInFcIjogXCJmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zXCJcbiAgICAgIFwiclwiOiBcImN1ZXN0YW4gZGVtYXNpYWRvXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudGVzIHBhcmEgc3UgdXNvXCJcbiAgICAgIFwidFwiOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAgIFwidVwiOiBcImVsIG3DqXRvZG8gZWxlZ2lkbyBubyBlc3TDoSBkaXNwb25pYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIGhheSBtw6l0b2RvcyBkaXNwb25pYmxlc1wiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdHJvc1wiXG4gICAgICBcInpcIjogXCJubyBsbyBzw6lcIlxuICAgICdlbic6XG4gICAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgICBcImJcIjogXCJub3QgaGF2aW5nIHNleFwiXG4gICAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgICBcImVcIjogXCJzdWJmZWN1bmQvaW5mZWN1bmRcIlxuICAgICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0aWNcIlxuICAgICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCJcbiAgICAgIFwialwiOiBcImh1c2JhbmQvcGFydG5lciBvcHBvc2VkXCJcbiAgICAgIFwia1wiOiBcIm90aGVycyBvcHBvc2VkXCJcbiAgICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiXG4gICAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgICAgXCJuXCI6IFwia25vd3Mgbm8gc291cmNlXCJcbiAgICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnQgdG8gdXNlXCJcbiAgICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpIncyBwcm9jZXNzZXNcIlxuICAgICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgcmVhc29uc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICd2M2EwOGEnOiAnbm8gZXN0w6FuIGNhc2FkYXMnXG4gICAgICAndjNhMDhiJzogJ25vIHRpZW5lbiBzZXhvJ1xuICAgICAgJ3YzYTA4Yyc6ICd0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZSdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzbidcbiAgICAgICd2M2EwOGUnOiAnc29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhcydcbiAgICAgICd2M2EwOGYnOiAnYW1lbm9ycmVhIHBvc3RwYXJ0bydcbiAgICAgICd2M2EwOGcnOiAnZXN0w6FuIGRhbmRvIGVsIHBlY2hvJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGEnXG4gICAgICAndjNhMDhpJzogJ2xhIG11amVyIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4aic6ICdlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhrJzogJ290cm9zIHNlIG9wb25lbicgICAgICAgIFxuICAgICAgJ3YzYTA4bCc6ICdwcm9oaWJpY2nDs24gcmVsaWdpb3NhJ1xuICAgICAgJ3YzYTA4bSc6ICdubyBjb25vY2UgbG9zIG3DqXRvZG9zJ1xuICAgICAgJ3YzYTA4bic6ICdubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3MnXG4gICAgICAndjNhMDhvJzogJ3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkJ1xuICAgICAgJ3YzYTA4cCc6ICdtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zJ1xuICAgICAgJ3YzYTA4cSc6ICdmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zJ1xuICAgICAgJ3YzYTA4cic6ICdjdWVzdGFuIGRlbWFzaWFkbydcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c28nXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgJ2VuJzogXG4gICAgICAndjNhMDhhJzogJ25vdCBtYXJyaWVkJ1xuICAgICAgJ3YzYTA4Yic6ICdub3QgaGF2aW5nIHNleCdcbiAgICAgICd2M2EwOGMnOiAnaW5mcmVxdWVudCBzZXgnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzYWwvaHlzdGVyZWN0b215J1xuICAgICAgJ3YzYTA4ZSc6ICdzdWJmZWN1bmQvaW5mZWN1bmQnXG4gICAgICAndjNhMDhmJzogJ3Bvc3RwYXJ0dW0gYW1lbm9ycmhlaWMnXG4gICAgICAndjNhMDhnJzogJ2JyZWFzdGZlZWRpbmcnXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0aWMnXG4gICAgICAndjNhMDhpJzogJ3Jlc3BvbmRlbnQgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGonOiAnaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQnXG4gICAgICAndjNhMDhrJzogJ290aGVycyBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4bCc6ICdyZWxpZ2lvdXMgcHJvaGliaXRpb24nXG4gICAgICAndjNhMDhtJzogJ2tub3dzIG5vIG1ldGhvZCdcbiAgICAgICd2M2EwOG4nOiAna25vd3Mgbm8gc291cmNlJ1xuICAgICAgJ3YzYTA4byc6ICdoZWFsdGggY29uY2VybnMnXG4gICAgICAndjNhMDhwJzogJ2ZlYXIgb2Ygc2lkZSBlZmZlY3RzJ1xuICAgICAgJ3YzYTA4cSc6ICdsYWNrIG9mIGFjY2Vzcy90b28gZmFyJ1xuICAgICAgJ3YzYTA4cic6ICdjb3N0cyB0b28gbXVjaCdcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50IHRvIHVzZSdcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmVyZXMgd2l0aCB0aGUgYm9keSdzIHByb2Nlc3Nlc1wiXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG5cbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuXG4gICAgIyBSZXNpemUgaGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIgPSAtPlxuICAgICAgaWYgZ3JhcGhXaWR0aCAhPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgZ3JhcGhXaWR0aCA9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBpdGVtc1dpZHRoID0gKGdyYXBoV2lkdGggLyAyMCkgLSAxMFxuICAgICAgICBpdGVtc0hlaWdodCA9IDIuMzMqaXRlbXNXaWR0aFxuICAgICAgICAjaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiAnMTAlJyBlbHNlICc1JSdcbiAgICAgICAgI2l0ZW1zSGVpZ2h0ID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuIGdyYXBoV2lkdGggKiAwLjEgLyAwLjc1IGVsc2UgZ3JhcGhXaWR0aCAqIDAuMDUgLyAwLjc1XG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5zdHlsZSAnd2lkdGgnLCBpdGVtc1dpZHRoKydweCdcbiAgICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0KydweCdcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdzdmcnKVxuICAgICAgICAgIC5hdHRyICd3aWR0aCcsIGl0ZW1zV2lkdGhcbiAgICAgICAgICAuYXR0ciAnaGVpZ2h0JywgaXRlbXNIZWlnaHRcbiAgICAgIHVzZUdyYXBoLnN0eWxlICdtYXJnaW4tdG9wJywgKCgkKCdib2R5JykuaGVpZ2h0KCktdXNlR3JhcGgubm9kZSgpLm9mZnNldEhlaWdodCkqLjUpKydweCdcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcicsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIGlmIGN1cnJlbnRTdGVwID4gMFxuICAgICAgICBkYXRhID0gWzYzLCA4OCwgMTAwXSAjIDYzLCA2MysyNSwgNjMrMjUrMTJcbiAgICAgICAgZnJvbSA9IGlmIGN1cnJlbnRTdGVwID4gMSB0aGVuIGRhdGFbY3VycmVudFN0ZXAtMl0gZWxzZSAwXG4gICAgICAgIHRvID0gZGF0YVtjdXJyZW50U3RlcC0xXVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkID49IGZyb20gYW5kIGQgPCB0b1xuICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrY3VycmVudFN0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICAgcmVzaXplSGFuZGxlcigpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXMpIC0+XG5cbiAgICAjIHBhcnNlIGRhdGFcbiAgICBkYXRhID0gW11cbiAgICBkYXRhX3VubWV0bmVlZHMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGNvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBpZiBjb3VudHJ5WzBdIGFuZCBjb3VudHJ5WzBdWydnbmknXVxuICAgICAgICAgIGRhdGEucHVzaFxuICAgICAgICAgICAgdmFsdWU6ICAgICAgK2RbJ2VzdGltYXRlZCddXG4gICAgICAgICAgICBpZDogICAgICAgICBjb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICAgIG5hbWU6ICAgICAgIGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgcG9wdWxhdGlvbjogK2NvdW50cnlbMF1bJ3BvcHVsYXRpb24nXVxuICAgICAgICAgICAgZ25pOiAgICAgICAgK2NvdW50cnlbMF1bJ2duaSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdObyBHTkkgb3IgUG9wdWxhdGlvbiBkYXRhIGZvciB0aGlzIGNvdW50cnknLCBkLmNvZGUsIGNvdW50cnlbMF1cblxuICAgICMgc2V0dXAgZ3JhcGhcbiAgICB1bm1ldG5lZWRzR3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDVcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICAgICAgJ2duaSdcbiAgICAgICAgeTogICAgICAndmFsdWUnXG4gICAgICAgIGlkOiAgICAgJ2lkJ1xuICAgICAgICBsYWJlbDogICduYW1lJ1xuICAgICAgICBjb2xvcjogICd2YWx1ZSdcbiAgICAgICAgc2l6ZTogICAncG9wdWxhdGlvbidcbiAgICAgIGRvdE1pblNpemU6IDFcbiAgICAgIGRvdE1heFNpemU6IDMyXG4gICAgdW5tZXRuZWVkc0dyYXBoLnNldERhdGEgZGF0YVxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtY29udGFpbmVyLWdyYXBoJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgY3VycmVudFN0ZXBcblxuICAgICQod2luZG93KS5yZXNpemUgdW5tZXRuZWVkc0dyYXBoLm9uUmVzaXplXG5cblxuICAjIFVzZSAmIFJlYXNvbnMgbWFwc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgPSAoZGF0YV91c2UsIGNvdW50cmllcywgbWFwKSAtPlxuXG4gICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAjZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgIyBTZXQgdXNlIG1hcFxuICAgIHVzZU1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogMjBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IHRydWVcbiAgICAgIGxhbmc6IGxhbmdcbiAgICB1c2VNYXAuc2V0RGF0YSBkYXRhX3VzZSwgbWFwXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgY3VycmVudFN0ZXAgIyB1cGRhdGUgbWFwIGJhc2VkIG9uIHN0ZXAgXG5cbiAgICAjIHNldHVwIHJlc2l6ZVxuICAgIHVzZU1hcC5vblJlc2l6ZSgpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VNYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIFRyZWVuYXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCA9IChkYXRhX3VzZSkgLT5cblxuICAgICMgc2V0dXAgdHJlZW1hcFxuICAgIHVzZVRyZWVtYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICBtZXRob2RzS2V5czogbWV0aG9kc19rZXlzXG4gICAgICBtZXRob2RzTmFtZXM6IG1ldGhvZHNfbmFtZXNbbGFuZ11cbiAgICAjIHNldCBkYXRhXG4gICAgdXNlVHJlZW1hcC5zZXREYXRhIGRhdGFfdXNlLCB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcicsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIGlmIGN1cnJlbnRTdGVwID09IDFcbiAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgIGVsc2UgaWYgY3VycmVudFN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuXG4gICAgIyBzZXQgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VUcmVlbWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFJlYXNvbnMgT3Bwb3NpdGlvbiBHcmFwaHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoID0gLT5cbiAgICAkYmFycyA9ICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQgLmJhcicpXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1sZWdlbmQgbGknKVxuICAgICAgLm1vdXNlb3ZlciAtPlxuICAgICAgICAkYmFyc1xuICAgICAgICAgIC5hZGRDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgIC5maWx0ZXIoJy5iYXItJyskKHRoaXMpLmF0dHIoJ2NsYXNzJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgIC5tb3VzZW91dCAtPlxuICAgICAgICAkYmFycy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuXG5cbiAgb25DYXJvdXNlbFN0ZXAgPSAoZSkgLT5cbiAgICBjdXJyZW50U3RlcCA9IGQzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgI2NvbnNvbGUubG9nICdjYXJvdXNlbCcsIGN1cnJlbnRTdGVwXG4gICAgQGdyYXBoaWMuc2VsZWN0QWxsKCcuYWN0aXZlJykuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICBAZ3JhcGhpYy5zZWxlY3QoJy5zdGVwLScrY3VycmVudFN0ZXApLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuXG4gIHNldHVwRGF0YUFydGljbGUgPSAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXAsIGxvY2F0aW9uKSAtPlxuXG4gICAgaWYgbG9jYXRpb25cbiAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGxvY2F0aW9uID0ge31cblxuICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cbiAgICAjdGVzdCBvdGhlciBjb3VudHJpZXNcbiAgICAjdXNlckNvdW50cnkuY29kZSA9ICdSVVMnXG4gICAgI3VzZXJDb3VudHJ5Lm5hbWUgPSAnUnVzaWEnXG5cbiAgICAjIGFkZCBjb3VudHJ5IElTTyAzMTY2LTEgYWxwaGEtMyBjb2RlIHRvIGRhdGFfcmVhc29uc1xuICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZTIgPT0gZC5jb2RlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQuY29kZSA9IGl0ZW1bMF0uY29kZVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgT2JqZWN0LmtleXMocmVhc29uc19uYW1lc1tsYW5nXSkuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICAgIGRbcmVhc29uXSA9IDEwMCpkW3JlYXNvbl1cbiAgICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgICBkZWxldGUgZC5jb3VudHJ5XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiAnTm8gY291bnRyeSBkYXRhIGZvciAnK2QuY29kZVxuXG4gICAgaWYgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgZGF0YV91c2VcblxuICAgIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgZGF0YV91c2UsIGNvdW50cmllcywgbWFwXG5cbiAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgICBpZiAkKCcjdW5tZXQtbmVlZHMtZ2RwLWdyYXBoJykubGVuZ3RoXG4gICAgICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCBkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllc1xuXG4gICAgI2lmICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnKS5sZW5ndGhcbiAgICAjICBuZXcgQ29udHJhY2VwdGl2ZXNSZWFzb25zIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCByZWFzb25zX25hbWVzW2xhbmddXG5cbiAgICBpZiAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLW1hcmllLXN0b3BlcycsIG9uQ2Fyb3VzZWxTdGVwXG5cbiAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICBzZXR1cFJlYXNvbnNPcHBvc2VkR3JhcGgoKVxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddXG5cblxuXG4gICMgc2V0dXAgbGluZSBjaGFydFxuICBzZXR1cE1vcnRhbGl0eUxpbmVHcmFwaCA9ICAtPlxuICAgIGRhdGEgPSBbe1xuICAgICAgJzE5OTAnOiAzODVcbiAgICAgICcxOTk1JzogMzY5XG4gICAgICAnMjAwMCc6IDM0MVxuICAgICAgJzIwMDUnOiAyODhcbiAgICAgICcyMDEwJzogMjQ2XG4gICAgICAnMjAxNSc6IDIxNlxuICAgIH1dXG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnbWF0ZXJuYWwtbW9ydGFsaXR5LWdyYXBoJyxcbiAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgbWFyZ2luOiBsZWZ0OiAyMClcbiAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsxOTk1LCAyMDA1LCAyMDE1XVxuICAgIGdyYXBoLnlBeGlzXG4gICAgICAudGlja1ZhbHVlcyBbMTAwLCAyMDAsIDMwMF1cbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnLjBzJylcbiAgICBncmFwaC55Rm9ybWF0ID0gZDMuZm9ybWF0KCcuMnMnKVxuICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgMzg1XVxuICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgJCgnYm9keScpLmhhc0NsYXNzKCdkYXRvcy11c28tYmFycmVyYXMnKSBvciAkKCdib2R5JykuaGFzQ2xhc3MoJ2RhdGEtdXNlLWJhcnJpZXJzJylcbiAgICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktcG9wdWxhdGlvbi0yMDE2LmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCBzZXR1cERhdGFBcnRpY2xlXG5cbiAgZWxzZSBpZiAkKCdib2R5JykuaGFzQ2xhc3MgJ3JlbGlnaW9uJ1xuICAgIGlmICQoJyNjYXJvdXNlbC1yYWJpbm9zJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLXJhYmlub3MnLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNjYXJvdXNlbC1pbWFtJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLWltYW0nLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNjYXJvdXNlbC1wYXBhJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLXBhcGEnLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNtYXRlcm5hbC1tb3J0YWxpdHktZ3JhcGgnKS5sZW5ndGhcbiAgICAgIHNldHVwTW9ydGFsaXR5TGluZUdyYXBoKClcblxuKSBqUXVlcnlcbiJdfQ==
