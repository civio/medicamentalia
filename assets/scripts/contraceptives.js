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
            _this.setAppItemData(_this.$app, 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
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
        return this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value);
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

    ContraceptivesApp.prototype.setAppItemData = function($el, use, method, method_value, unmetneeds, reason, reason_value) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwic2Nyb2xsLWdyYXBoLmNvZmZlZSIsIm1hcC1ncmFwaC5jb2ZmZWUiLCJsaW5lLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFE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USx3Q0FEMUIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxFQUFFLENBQUMsR0FGWixFQUVrQixPQUFBLEdBQVEsdUJBRjFCLENBR0UsQ0FBQyxLQUhILENBR1MsRUFBRSxDQUFDLEdBSFosRUFHa0IsT0FBQSxHQUFRLGtDQUgxQixDQUlFLENBQUMsS0FKSCxDQUlTLEVBQUUsQ0FBQyxHQUpaLEVBSWtCLE9BQUEsR0FBUSx5Q0FKMUIsQ0FLRSxDQUFDLEtBTEgsQ0FLUyxFQUFFLENBQUMsSUFMWixFQUtrQixPQUFBLEdBQVEsMEJBTDFCLENBTUUsQ0FBQyxLQU5ILENBTVMsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixlQUFsQixFQUFtQyxZQUFuQyxFQUFpRCxTQUFqRCxFQUE0RCxHQUE1RDtVQUNMLFdBQUEsQ0FBWSxRQUFaLEVBQXNCLFNBQXRCO1VBQ0EsSUFBRyxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxNQUE1QjttQkFDTSxJQUFBLGlCQUFBLENBQWtCLFFBQWxCLEVBQTRCLGVBQTVCLEVBQTZDLFlBQTdDLEVBQTJELFdBQTNELEVBQXdFLFlBQXhFLEVBQXNGLGFBQWMsQ0FBQSxJQUFBLENBQXBHLEVBQTJHLGlCQUFrQixDQUFBLElBQUEsQ0FBN0gsRUFBb0ksYUFBYyxDQUFBLElBQUEsQ0FBbEosRUFBeUosaUJBQWtCLENBQUEsSUFBQSxDQUEzSyxFQUROOztRQUZLLENBTlQ7TUFGcUMsQ0FBdkMsRUFGRzs7RUFsaEJOLENBQUQsQ0FBQSxDQWlpQkUsTUFqaUJGO0FBQUEiLCJmaWxlIjoiY29udHJhY2VwdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBpZiBAc3ZnXG4gICAgICBAc3ZnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LlNjcm9sbEdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKF9pZCwgX3N0ZXBDYWxsYmFjaykgLT5cbiAgICBAaWQgPSBfaWRcbiAgICBAc3RlcENhbGxiYWNrID0gX3N0ZXBDYWxsYmFja1xuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZClcbiAgICBAZ3JhcGhpYyAgID0gQGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtZ3JhcGhpYycpXG4gICAgQHN0ZXBzICAgICA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcuc2Nyb2xsLXRleHQgLnN0ZXAnKVxuICAgIEBjaGFydCAgICAgPSBAZ3JhcGhpYy5zZWxlY3QoJy5ncmFwaC1jb250YWluZXInKVxuICAgICMgaW5pdGlhbGl6ZSBzY3JvbGxhbWFcbiAgICBAc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuICAgICMgc3RhcnQgaXQgdXBcbiAgICAjIDEuIGNhbGwgYSByZXNpemUgb24gbG9hZCB0byB1cGRhdGUgd2lkdGgvaGVpZ2h0L3Bvc2l0aW9uIG9mIGVsZW1lbnRzXG4gICAgQG9uUmVzaXplKClcbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgQHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK0BpZCAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcjJytAaWQrJyAuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHN0ZXA6ICAgICAgICcjJytAaWQrJyAuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBAb25Db250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIEBvbkNvbnRhaW5lckV4aXRcbiAgICAgIC5vblN0ZXBFbnRlciAgICAgIEBvblN0ZXBFbnRlclxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEBvblJlc2l6ZVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gIG9uUmVzaXplOiA9PlxuICAgIHdpZHRoID0gQGdyYXBoaWMubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICNNYXRoLmZsb29yIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgIEBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICBAZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgQGNoYXJ0XG4gICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQrJ3B4J1xuICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICBAc2Nyb2xsZXIucmVzaXplKClcblxuICAjIHN0aWNreSB0aGUgZ3JhcGhpY1xuICBvbkNvbnRhaW5lckVudGVyOiAoZSkgPT5cbiAgICBAZ3JhcGhpY1xuICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgIyB1bi1zdGlja3kgdGhlIGdyYXBoaWMsIGFuZCBwaW4gdG8gdG9wL2JvdHRvbSBvZiBjb250YWluZXJcbiAgb25Db250YWluZXJFeGl0OiAoZSkgPT5cbiAgICBAZ3JhcGhpY1xuICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAjIGNhbGwgc3RlcENhbGxiYWNrIG9uIGVudGVyIHN0ZXBcbiAgb25TdGVwRW50ZXI6IChlKSA9PlxuICAgIEBzdGVwQ2FsbGJhY2soZSlcbiIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbkl0ZW1XaWR0aCA9IDMwXG4gICAgbGVnZW5kRGF0YSA9IEBnZXRMZWdlbmREYXRhKClcbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGkrMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IEBnZXRMZWdlbmRGb3JtYXRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5MaW5lR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICB5Rm9ybWF0OiBkMy5mb3JtYXQoJ2QnKSAgICMgc2V0IGxhYmVscyBob3ZlciBmb3JtYXRcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdMaW5lIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyBkYXRhXG4gICAgc3VwZXIoZGF0YSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICB5ZWFycyA9IFtdXG4gICAgZDMua2V5cyhkYXRhWzBdKS5mb3JFYWNoIChkKSAtPlxuICAgICAgaWYgK2RcbiAgICAgICAgeWVhcnMucHVzaCArZFxuICAgIHJldHVybiB5ZWFycy5zb3J0KClcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGRbQG9wdGlvbnMua2V5LnhdLCAnZW4gJywgeWVhcik7XG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGEgXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja0Zvcm1hdCBkMy5mb3JtYXQoJycpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgIyBzZXR1cCBsaW5lXG4gICAgQGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgIC54IChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAueSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICAjIHNldHVwIGFyZWFcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhID0gZDMuYXJlYSgpXG4gICAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgICAgLnggIChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAgIC55MCBAaGVpZ2h0XG4gICAgICAgIC55MSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gW0B5ZWFyc1swXSwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbMCwgZDMubWF4IEBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkLnZhbHVlcykpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGNsZWFyIGdyYXBoIGJlZm9yZSBzZXR1cFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuZ3JhcGgnKS5yZW1vdmUoKVxuICAgICMgZHJhdyBncmFwaCBjb250YWluZXIgXG4gICAgQGdyYXBoID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2dyYXBoJ1xuICAgICMgZHJhdyBsaW5lc1xuICAgIEBkcmF3TGluZXMoKVxuICAgICMgZHJhdyBhcmVhc1xuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGRyYXdBcmVhcygpXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAZHJhd0xhYmVscygpXG4gICAgIyBkcmF3IG1vdXNlIGV2ZW50cyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGRyYXdMaW5lTGFiZWxIb3ZlcigpXG4gICAgICAjIGVsc2VcbiAgICAgICMgICBAZHJhd1Rvb2x0aXAoKVxuICAgICAgQGRyYXdSZWN0T3ZlcmxheSgpXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGFyZWEgeTBcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhLnkwIEBoZWlnaHRcbiAgICAjIHVwZGF0ZSB5IGF4aXMgdGlja3Mgd2lkdGhcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuYXR0ciAnZCcsIEBhcmVhXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy5vdmVybGF5JylcbiAgICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMaW5lczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiByZXR1cm4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcblxuICBkcmF3QXJlYXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXJlYSdcbiAgICAgIC5hdHRyICAnaWQnLCAgICAoZCkgPT4gJ2FyZWEtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuXG4gIGRyYXdMYWJlbHM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnZW5kJ1xuICAgICAgLmF0dHIgJ2R5JywgJy0wLjEyNWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG5cbiAgZHJhd0xpbmVMYWJlbEhvdmVyOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtcG9pbnQtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLXBvaW50J1xuICAgICAgLmF0dHIgJ3InLCA0XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAndGljay1ob3ZlcidcbiAgICAgIC5hdHRyICdkeScsICcwLjcxZW0nICAgICAgXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIGlmIEBkYXRhLmxlbmd0aCA9PSAxXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLWhvdmVyJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAuYXR0ciAnZHknLCAnLTAuNWVtJ1xuICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBkcmF3UmVjdE92ZXJsYXk6IC0+XG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ292ZXJsYXknXG4gICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VNb3ZlXG4gICAgICAub24gJ21vdXNlb3V0JywgIEBvbk1vdXNlT3V0XG4gICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuXG4gIHNldExhYmVsRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCBAd2lkdGhcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGQudmFsdWVzW0B5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXSlcblxuICBzZXRPdmVybGF5RGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3dpZHRoJywgQHdpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGhlaWdodFxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkZWwudHJpZ2dlciAnbW91c2VvdXQnXG4gICAgQGhpZGVMYWJlbCgpXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIHllYXIgPSBNYXRoLnJvdW5kIEB4LmludmVydChwb3NpdGlvblswXSlcbiAgICBpZiB5ZWFyICE9IEBjdXJyZW50WWVhclxuICAgICAgQCRlbC50cmlnZ2VyICdjaGFuZ2UteWVhcicsIHllYXJcbiAgICAgIEBzZXRMYWJlbCB5ZWFyXG5cbiAgc2V0TGFiZWw6ICh5ZWFyKSAtPlxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmVhY2ggKGQpID0+IEBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uIGRcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAgLmF0dHIgJ3gnLCBNYXRoLnJvdW5kIEB4KEBjdXJyZW50WWVhcilcbiAgICAgIC50ZXh0IEBjdXJyZW50WWVhclxuXG4gIGhpZGVMYWJlbDogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbjogKGRhdGEpID0+XG4gICAgIyBnZXQgY3VycmVudCB5ZWFyXG4gICAgeWVhciA9IEBjdXJyZW50WWVhclxuICAgIHdoaWxlIEB5ZWFycy5pbmRleE9mKHllYXIpID09IC0xICYmIEBjdXJyZW50WWVhciA+IEB5ZWFyc1swXVxuICAgICAgeWVhci0tXG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgICMgZ2V0IHBvaW50ICYgbGFiZWxcbiAgICBwb2ludCA9IGQzLnNlbGVjdCgnI2xpbmUtbGFiZWwtcG9pbnQtJytkYXRhW0BvcHRpb25zLmtleS5pZF0pXG4gICAgbGFiZWwgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICMgaGlkZSBwb2ludCAmIGxhYmVsIGlzIHRoZXJlIGlzIG5vIGRhdGFcbiAgICB1bmxlc3MgZGF0YS52YWx1ZXNbeWVhcl1cbiAgICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgcmV0dXJuXG4gICAgIyBzaG93IHBvaW50ICYgbGFiZWwgaWYgdGhlcmUncyBkYXRhXG4gICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICMgc2V0IGxpbmUgbGFiZWwgcG9pbnRcbiAgICBwb2ludFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAjIHNldCBsaW5lIGxhYmVsIGhvdmVyXG4gICAgbGFiZWxcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICAgLnRleHQgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHlGb3JtYXQoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgJydcbiAgICAgIFxuICBzZXRUaWNrSG92ZXJQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd5JywgTWF0aC5yb3VuZCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArOSIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoIGV4dGVuZHMgd2luZG93Lk1hcEdyYXBoXG5cbiAgY3VycmVudFN0YXRlOiAwXG5cbiAgc3RhdGVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdGZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBmZW1lbmluYSdcbiAgICAgICAgZW46ICdmZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDhcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yMCwgMzBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0luZGlhJ1xuICAgICAgICAgICAgZW46ICdJbmRpYSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40NjVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzIwLCAtNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVww7pibGljYSBEb21pbmljYW5hJ1xuICAgICAgICAgICAgZW46ICdEb21pbmljYW4gUmVwdWJsaWMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYSdcbiAgICAgICAgZW46ICdtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yNjVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMjhcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzMwLCAyNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2FuYWTDoSdcbiAgICAgICAgICAgIGVuOiAnQ2FuYWRhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDb3JlYSBkZWwgTm9ydGUnXG4gICAgICAgICAgICBlbjogJ05vcnRoIEtvcmVhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDaGluYSdcbiAgICAgICAgICAgIGVuOiAnQ2hpbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnUGlsbCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3DDrWxkb3JhJ1xuICAgICAgICBlbjogJ3BpbGwnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC40NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0zNSwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQXJnZWxpYSdcbiAgICAgICAgICAgIGVuOiAnQWxnZXJpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIGNvbmRvbSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3ByZXNlcnZhdGl2byBtYXNjdWxpbm8nXG4gICAgICAgIGVuOiAnbWFsZSBjb25kb20nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NDJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzM1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0dyZWNpYSdcbiAgICAgICAgICAgIGVuOiAnR3JlZWNlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC43NFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIC0xMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQm90c3VhbmEnXG4gICAgICAgICAgICBlbjogJ0JvdHN3YW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0luamVjdGFibGUnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdpbnllY3RhYmxlJ1xuICAgICAgICBlbjogJ2luamVjdGFibGUnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC42MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC41NVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0V0aW9ww61hJ1xuICAgICAgICAgICAgZW46ICdFdGhpb3BpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM2XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjNcbiAgICAgICAgICByOiAxNlxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjYsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0JhbGNhbmVzJ1xuICAgICAgICAgICAgZW46ICdCYWxrYW5zJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMCwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQWxiYW5pYSdcbiAgICAgICAgICAgIGVuOiAnQWxiYW5pYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gIGdldExlZ2VuZERhdGE6IC0+XG4gICAgcmV0dXJuIFswLDIwLDQwLDYwLDgwXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGQrJyUnXG5cbiAgIyBvdmVycmlkZSBnZXREaW1lbnNpb25zXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgb2Zmc2V0ID0gMTAwXG4gICAgaWYgQCRlbFxuICAgICAgYm9keUhlaWdodCA9ICQoJ2JvZHknKS5oZWlnaHQoKS1vZmZzZXRcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgI0AkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgI2Vsc2VcbiAgICAgICMgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cblxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgIHN1cGVyKG1hcClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgQGN1cnJlbnRNZXRob2QgPSBAc3RhdGVzW0BjdXJyZW50U3RhdGUtMV1cbiAgICAgIGlmIEBjdXJyZW50TWV0aG9kXG4gICAgICAgICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgQGN1cnJlbnRNZXRob2QudGV4dFtAb3B0aW9ucy5sYW5nXVxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PiBkLnZhbHVlID0gK2RbQGN1cnJlbnRNZXRob2QuaWRdXG4gICAgICAgIEB1cGRhdGVHcmFwaCBAZGF0YVxuICAgICAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG4gIHNldEFubm90YXRpb25zOiAtPlxuICAgIGlmIEBjdXJyZW50TWV0aG9kXG4gICAgICBAY3VycmVudE1ldGhvZC5sYWJlbHMuZm9yRWFjaCAoZCkgPT4gXG4gICAgICAgIGQuY3ggPSBkLmN4X2ZhY3RvcipAd2lkdGhcbiAgICAgICAgZC5jeSA9IGQuY3lfZmFjdG9yKkBoZWlnaHRcbiAgICAgICAgZC50ZXh0ID0gZC5sYWJlbFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGNvbnRhaW5lci5jYWxsIEByaW5nTm90ZSwgQGN1cnJlbnRNZXRob2QubGFiZWxzXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgNjBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdXBkYXRlR3JhcGgoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIHVwZGF0ZUdyYXBoOiAtPlxuXG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHVwZGF0ZSBub2Rlc1xuICAgIG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgIFxuICAgIG5vZGVzLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUnXG4gICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsJ1xuICAgICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwtY29udGVudCdcbiAgICAgICAgICAuYXBwZW5kICdwJ1xuXG4gICAgIyBzZXR1cCBub2Rlc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG5cbiAgICAjIGFkZCBsYWJlbCBvbmx5IGluIG5vZGVzIHdpdGggc2l6ZSBncmVhdGVyIHRoZW4gb3B0aW9ucy5taW5TaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsICAgQHNldE5vZGVMYWJlbFxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIG5vZGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoXG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgICAjIFVwZGF0ZSB0cmVtYXAgc2l6ZVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuICAgIGVsc2VcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNxdWFyaWZ5XG4gICAgQHRyZWVtYXAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBVcGRhdGUgbm9kZXMgZGF0YVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuICAgICAgXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgc2V0Tm9kZTogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjbGFzcycsICAgICAgIEBnZXROb2RlQ2xhc3NcbiAgICAgIC5zdHlsZSAncGFkZGluZycsICAgIChkKSA9PiBpZiAoZC54MS1kLngwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcgJiYgZC55MS1kLnkwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcpIHRoZW4gQG9wdGlvbnMubm9kZXNQYWRkaW5nKydweCcgZWxzZSAwXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAoZCkgLT4gaWYgKGQueDEtZC54MCA9PSAwKSB8fCAoZC55MS1kLnkwID09IDApIHRoZW4gJ2hpZGRlbicgZWxzZSAnJ1xuXG4gIHNldE5vZGVEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgLT4gZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpIC0+IGQueTAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIChkKSAtPiBkLngxLWQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChkKSAtPiBkLnkxLWQueTAgKyAncHgnXG5cbiAgc2V0Tm9kZUxhYmVsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5zZWxlY3QoJ3AnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlJ1xuICAgICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5UcmVlbWFwR3JhcGhcblxuICAjIG92ZXJkcml2ZSBkYXRhIFBhcnNlclxuICBkYXRhUGFyc2VyOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgIyBUT0RPISEhIEdldCBjdXJyZW50IGNvdW50cnkgJiBhZGQgc2VsZWN0IGluIG9yZGVyIHRvIGNoYW5nZSBpdFxuICAgIGRhdGFfY291bnRyeSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgaWYgZGF0YV9jb3VudHJ5WzBdXG4gICAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgICAgbWV0aG9kcyA9IHt9XG4gICAgICBAb3B0aW9ucy5tZXRob2RzS2V5cy5mb3JFYWNoIChrZXksaSkgPT5cbiAgICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgICBtZXRob2RzW2tleV0gPVxuICAgICAgICAgICAgaWQ6IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKS5yZXBsYWNlKCcpJywgJycpLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgICAgdmFsdWU6ICtkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgICAjIGZpbHRlciBtZXRob2RzIHdpdGggdmFsdWUgPCA1JSAmIGFkZCB0byBPdGhlciBtb2Rlcm4gbWV0aG9kc1xuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBpZiBrZXkgIT0gJ090aGVyIG1vZGVybiBtZXRob2RzJyBhbmQga2V5ICE9ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJyBhbmQgbWV0aG9kLnZhbHVlIDwgNVxuICAgICAgICAgIG1ldGhvZHNbJ090aGVyIG1vZGVybiBtZXRob2RzJ10udmFsdWUgKz0gbWV0aG9kLnZhbHVlXG4gICAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICBcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgICAgaWQ6IG1ldGhvZC5pZFxuICAgICAgICAgIHJhd19uYW1lOiBtZXRob2QubmFtZVxuICAgICAgICAgIG5hbWU6ICc8c3Ryb25nPicgKyBtZXRob2QubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1ldGhvZC5uYW1lLnNsaWNlKDEpICsgJzwvc3Ryb25nPjxici8+JyArIE1hdGgucm91bmQobWV0aG9kLnZhbHVlKSArICclJ1xuICAgICAgICAgIHZhbHVlOiBtZXRob2QudmFsdWVcbiAgICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgICAgcGFyc2VkRGF0YVNvcnRlZCA9IHBhcnNlZERhdGEuc29ydCAoYSxiKSAtPiBpZiBhLnZhbHVlIGFuZCBiLnZhbHVlIHRoZW4gYi52YWx1ZS1hLnZhbHVlIGVsc2UgMVxuICAgICAgIyBzZXQgY2FwdGlvbiBjb3VudHJ5IG5hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1hbnktbWV0aG9kJykuaHRtbCBNYXRoLnJvdW5kKGRhdGFfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSlcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIHBhcnNlZERhdGFTb3J0ZWRbMF0ucmF3X25hbWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gJ05vIGRhdGEgY291bnRyeSBmb3IgJytjb3VudHJ5X2NvZGVcbiAgICAgICMgVE9ETyEhISBXaGF0IHdlIGRvIGlmIHRoZXJlJ3Mgbm8gZGF0YSBmb3IgdXNlcidzIGNvdW50cnlcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgI0BzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZURhdGE6IChjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEB1cGRhdGVHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgIyMjIG92ZXJkcml2ZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSlcbiAgIyMjIiwiY2xhc3Mgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIGluY29tZUxldmVsczogWzEwMDUsIDM5NTUsIDEyMjM1XVxuXG4gIGxhYmVsczogW1xuICAgICdBR08nLFxuICAgICdCR0QnLFxuICAgICdCUkEnLFxuICAgICdDSE4nLFxuICAgICdERVUnLFxuICAgICdFU1AnLFxuICAgICdFVEgnLFxuICAgICdJTkQnLFxuICAgICdJRE4nLFxuICAgICdKUE4nLFxuICAgICdOR0EnLFxuICAgICdQQUsnLFxuICAgICdQSEwnLFxuICAgICdSVVMnLFxuICAgICdTQVUnLFxuICAgICdUVVInLFxuICAgICdVR0EnLFxuICAgICdVU0EnLFxuICAgICdWTk0nXG4gIF1cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgMCAjIG1vZGUgMDogYmVlc3dhcm0sIG1vZGUgMTogc2NhdHRlcnBsb3RcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICByZXR1cm4gZGF0YS5zb3J0IChhLGIpID0+IGJbQG9wdGlvbnMua2V5LnNpemVdLWFbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGRhdGFcblxuICBkcmF3R3JhcGg6IC0+XG5cbiAgICBAc2V0U2l6ZSgpXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgICMgZHJhdyBkb3RzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEgQGRhdGFcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RcbiAgICAgICMub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5kYXRhIEBkYXRhLmZpbHRlciAoZCkgPT4gQGxhYmVscy5pbmRleE9mKGRbQG9wdGlvbnMua2V5LmlkXSkgIT0gLTFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSA9PiByZXR1cm4gaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxMDAwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLWwnIGVsc2UgaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxODAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbScgZWxzZSAnZG90LWxhYmVsJ1xuICAgICAgICAjLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJzAuMjVlbSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LmxhYmVsXVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVkgPSBkMy5mb3JjZVkgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgIGZvcmNlWS5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VZXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVgoQHdpZHRoKi41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMzUwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIHNldERvdDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmF0dHIgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0RG90UG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAnY3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgc2V0RG90TGFiZWxQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICd4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgZ2V0UG9zaXRpb25YOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueCBlbHNlIE1hdGgucm91bmQgQHgoZFtAb3B0aW9ucy5rZXkueF0pXG5cbiAgZ2V0UG9zaXRpb25ZOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueSBlbHNlIE1hdGgucm91bmQgQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gI2lmIEBvcHRpb25zLmtleS5jb2xvciBhbmQgQG9wdGlvbnMubW9kZSA9PSAxIHRoZW4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSBlbHNlICcjZTI3MjNiJ1xuXG4gIHNldE1vZGU6IChtb2RlKSAtPlxuICAgIEBvcHRpb25zLm1vZGUgPSBtb2RlXG4gICAgaWYgQG9wdGlvbnMubW9kZSA8IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgICBpZiBAeExlZ2VuZFxuICAgICAgICBAeExlZ2VuZC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICAgICMgc2hvdy9oaWRlIGRvdCBsYWJlbHNcbiAgICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMFxuICAgICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSA1MDBcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAxXG4gICAgICAjIHNob3cvaGlkZSB4IGF4aXMgbGluZXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdIDwgQGluY29tZUxldmVsc1syXSBvciBkW0BvcHRpb25zLmtleS55XSA+IDE1XG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdID4gQGluY29tZUxldmVsc1sxXSBvciBkW0BvcHRpb25zLmtleS55XSA8IDMwXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDRcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkLmlkICE9ICdTQVUnIGFuZCBkLmlkICE9ICdKUE4nXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDVcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgI0B4ID0gZDMuc2NhbGVQb3coKVxuICAgICMgIC5leHBvbmVudCgwLjEyNSlcbiAgICAjICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeCA9IGQzLnNjYWxlTG9nKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdICMucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBAaW5jb21lTGV2ZWxzXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMTAsIDIwLCAzMCwgNDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTEsNSknXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCA4NTAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAsIDIwLCAzMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLmF0dHIgJ3kxJywgQHkoNDApLTRcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcyAudGljayB0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2R4JywgM1xuICAgICAgICAuYXR0ciAnZHknLCAtNFxuICAgICMgc2V0IHggbGVuZ2VkXG4gICAgaW5jb21lcyA9IEB4QXhpcy50aWNrVmFsdWVzKClcbiAgICBpbmNvbWVzLnVuc2hpZnQgMFxuICAgIGluY29tZXNNYXggPSBAeCBAZ2V0U2NhbGVYRG9tYWluKClbMV1cbiAgICBpbmNvbWVzID0gaW5jb21lcy5tYXAgKGQpID0+IGlmIGQgPiAwIHRoZW4gMTAwKkB4KGQpL2luY29tZXNNYXggZWxzZSAwXG4gICAgaW5jb21lcy5wdXNoIDEwMFxuICAgIEB4TGVnZW5kID0gZDMuc2VsZWN0KGQzLnNlbGVjdCgnIycrQGlkKS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KCcueC1sZWdlbmQnKVxuICAgIEB4TGVnZW5kLnNlbGVjdEFsbCgnbGknKS5zdHlsZSAnd2lkdGgnLCAoZCxpKSAtPiAoaW5jb21lc1tpKzFdLWluY29tZXNbaV0pKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gaWYgQGNvbnRhaW5lcldpZHRoID4gNjgwIHRoZW4gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW8gZWxzZSBpZiBAY29udGFpbmVyV2lkdGggPiA1MjAgdGhlbiBAY29udGFpbmVyV2lkdGggKiAuNzUgZWxzZSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG4iLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuICBkaHNfY291bnRyaWVzOlxuICAgICdBRkcnOlxuICAgICAgJ25hbWUnOiAnQUZJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE3J1xuICAgICdBTEInOlxuICAgICAgJ25hbWUnOiAnQUxJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdBUk0nOlxuICAgICAgJ25hbWUnOiAnQU1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdBR08nOlxuICAgICAgJ25hbWUnOiAnQU9JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdBWkUnOlxuICAgICAgJ25hbWUnOiAnQVpJUjUyRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCR0QnOlxuICAgICAgJ25hbWUnOiAnQkRJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdCRU4nOlxuICAgICAgJ25hbWUnOiAnQkpJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCT0wnOlxuICAgICAgJ25hbWUnOiAnQk9JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdCREknOlxuICAgICAgJ25hbWUnOiAnQlVJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdDT0QnOlxuICAgICAgJ25hbWUnOiAnQ0RJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdDT0cnOlxuICAgICAgJ25hbWUnOiAnQ0dJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDSVYnOlxuICAgICAgJ25hbWUnOiAnQ0lJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDTVInOlxuICAgICAgJ25hbWUnOiAnQ01JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdDT0wnOlxuICAgICAgJ25hbWUnOiAnQ09JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdET00nOlxuICAgICAgJ25hbWUnOiAnRFJJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdFR1knOlxuICAgICAgJ25hbWUnOiAnRUdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdFVEgnOlxuICAgICAgJ25hbWUnOiAnRVRJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdHSEEnOlxuICAgICAgJ25hbWUnOiAnR0hJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdHTUInOlxuICAgICAgJ25hbWUnOiAnR01JUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdHSU4nOlxuICAgICAgJ25hbWUnOiAnR05JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdHVE0nOlxuICAgICAgJ25hbWUnOiAnR1VJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdHVVknOlxuICAgICAgJ25hbWUnOiAnR1lJUjVJRFQnXG4gICAgICAneWVhcic6ICcyMDA5J1xuICAgICdITkQnOlxuICAgICAgJ25hbWUnOiAnSE5JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdIVEknOlxuICAgICAgJ25hbWUnOiAnSFRJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdJTkQnOlxuICAgICAgJ25hbWUnOiAnSUFJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdJRE4nOlxuICAgICAgJ25hbWUnOiAnSURJUjYzRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdKT1InOlxuICAgICAgJ25hbWUnOiAnSk9JUjZDRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdLRU4nOlxuICAgICAgJ25hbWUnOiAnS0VJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdLSE0nOlxuICAgICAgJ25hbWUnOiAnS0hJUjczRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdMQlInOlxuICAgICAgJ25hbWUnOiAnTEJJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdMU08nOlxuICAgICAgJ25hbWUnOiAnTFNJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdNQVInOlxuICAgICAgJ25hbWUnOiAnTUFJUjQzRFQnXG4gICAgICAneWVhcic6ICcyMDAzLTA0J1xuICAgICdNREcnOlxuICAgICAgJ25hbWUnOiAnTURJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdNTEknOlxuICAgICAgJ25hbWUnOiAnTUxJUjUzRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdNTVInOlxuICAgICAgJ25hbWUnOiAnTU1JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdNV0knOlxuICAgICAgJ25hbWUnOiAnTVdJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdNT1onOlxuICAgICAgJ25hbWUnOiAnTVpJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdOR0EnOlxuICAgICAgJ25hbWUnOiAnTkdJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdORVInOlxuICAgICAgJ25hbWUnOiAnTklJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdOQU0nOlxuICAgICAgJ25hbWUnOiAnTk1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdOUEwnOlxuICAgICAgJ25hbWUnOiAnTlBJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdQRVInOlxuICAgICAgJ25hbWUnOiAnUEVJUjZJRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdQSEwnOlxuICAgICAgJ25hbWUnOiAnUEhJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdQQUsnOlxuICAgICAgJ25hbWUnOiAnUEtJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdSV0EnOlxuICAgICAgJ25hbWUnOiAnUldJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdTTEUnOlxuICAgICAgJ25hbWUnOiAnU0xJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdTRU4nOlxuICAgICAgJ25hbWUnOiAnU05JUjZERFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdTVFAnOlxuICAgICAgJ25hbWUnOiAnU1RJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdTV1onOlxuICAgICAgJ25hbWUnOiAnU1pJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdUQ0QnOlxuICAgICAgJ25hbWUnOiAnVERJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdUR08nOlxuICAgICAgJ25hbWUnOiAnVEdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdUSksnOlxuICAgICAgJ25hbWUnOiAnVEpJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdUTFMnOlxuICAgICAgJ25hbWUnOiAnVExJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDA5LTEwJ1xuICAgICdUWkEnOlxuICAgICAgJ25hbWUnOiAnVFpJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdVR0EnOlxuICAgICAgJ25hbWUnOiAnVUdJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdaTUInOlxuICAgICAgJ25hbWUnOiAnWk1JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA3J1xuICAgICdaV0UnOlxuICAgICAgJ25hbWUnOiAnWldJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuXG4gIHNlbnRlbmNlczogXG4gICAgJ0FMQic6ICdMYSBtYXJjaGEgYXRyw6FzIGVzIGVsIHByaW1lciBtw6l0b2RvIGFudGljb25jZXB0aXZvIGRlIEFsYmFuaWEuIEFkZW3DoXMsIHNlIHRyYXRhIGRlbCBzZWd1bmRvIHBhw61zIGRvbmRlIGV4aXN0ZSBtYXlvciBvcG9zaWNpw7NuIGRlIGxhIHByb3BpYSBtdWplciwgbGEgcGFyZWphIG8gbGEgcmVsaWdpw7NuIGEgdG9tYXIgYW50aWNvbmNlcHRpdm9zLidcbiAgICAnQVJHJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jbGFyaW4uY29tL3NvY2llZGFkL2NhbXBhbmEtbGV5LWFib3J0by1jb21lbnpvLTIwMDUtcHJveWVjdG8tcHJlc2VudG8tdmVjZXNfMF9CSnZkaTBuUHouaHRtbFwiPlVuYXMgY2luY28gbWlsIG11amVyZXMgbWFyY2hhcm9uIGVuIGZlYnJlcm8gZGUgMjAxOCBmcmVudGUgYWwgQ29uZ3Jlc28gYXJnZW50aW5vIHBhcmEgcGVkaXIgbGEgbGVnYWxpemFjacOzbiBkZWwgYWJvcnRvLjwvYT4nXG4gICAgJ0FVUyc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5hYmMubmV0LmF1L25ld3MvaGVhbHRoLzIwMTctMDctMjIvbmF0dXJhbC1tZXRob2RzLW9mLWNvbnRyYWNlcHRpb24tb24tdGhlLXJpc2UtaW4tYXVzdHJhbGlhLzg2ODMzNDZcIj5NdWNob3MgYXVzdHJhbGlhbm9zIGVzdMOhbiB2b2x2aWVuZG8gYSB1dGlsaXphciBtw6l0b2RvcyB0cmFkaWNpb25hbGVzIGRlIGFudGljb25jZXBjacOzbiwgc2Vnw7puIHVuIGVzdHVkaW8gZGUgTW9uYXNoIFVuaXZlcnNpdHkuPC9hPidcbiAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5Cw6lsZ2ljYSBkb27DsyAxMCBtaWxsb25lcyBkZSBldXJvcyBwYXJhIGxhIGNhbXBhw7FhIDxpPlNoZSBEZWNpZGVzPC9pPiwgbGFuemFkYSBwb3IgZWwgR29iaWVybm8gaG9sYW5kw6lzIHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCI+RmFybWFjaWFzIGRlIEJvbGl2aWEgaW1wbGVtZW50YXJvbiBjw7NkaWdvcyBzZWNyZXRvcyBwYXJhIHBlZGlyIHByZXNlcnZhdGl2b3MgeSBldml0YXIgZWwgZXN0aWdtYSBkZSBjb21wcmFyIGVzdG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICdDT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTcvMDEvMDcvd29ybGQvYXNpYS9hZnRlci1vbmUtY2hpbGQtcG9saWN5LW91dHJhZ2UtYXQtY2hpbmFzLW9mZmVyLXRvLXJlbW92ZS1pdWRzLmh0bWxcIj5FbCBHb2JpZXJubyBjaGlubyBvZnJlY2UgbGEgcmV0aXJhZGEgZ3JhdHVpdGEgZGUgRElVcyBkZXNwdcOpcyBkZSBsYSBwb2zDrXRpY2EgZGVsIGhpam8gw7puaWNvLjwvYT4nXG4gICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIj5FbCBTYWx2YWRvciBlcyBlbCDDum5pY28gcGHDrXMgZGVsIG11bmRvIGRvbmRlIGFib3J0YXIgZXN0w6EgcGVuYWRvIGNvbiBjw6FyY2VsLjwvYT4nXG4gICAgJ0ZJTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5oZWxzaW5raXRpbWVzLmZpL2ZpbmxhbmQvZmlubGFuZC9uZXdzL2RvbWVzdGljLzE1MjcxLWhlbHNpbmtpLXRvLW9mZmVyLXllYXItcy13b3J0aC1vZi1jb250cmFjZXB0aXZlLXBpbGxzLXRvLXVuZGVyLTI1LXllYXItb2xkcy5odG1sXCI+RWwgYXl1bnRhbWllbnRvIGRlIEhlbHNpbmtpIHByb3BvcmNpb25hIGFudGljb25jZXB0aXZvcyBkZSBtYW5lcmEgZ3JhdHVpdGEgYSBsb3MgasOzdmVuZXMgbWVub3JlcyBkZSAyNSBhw7Fvcy48L2E+J1xuICAgICdGUkEnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNvbm5leGlvbmZyYW5jZS5jb20vRnJlbmNoLW5ld3MvRnJlbmNoLXdvbWVuLW9wdC1mb3ItYWx0ZXJuYXRpdmVzLWFzLVBpbGwtdXNlLWRyb3BzXCI+RWwgdXNvIGRlIGxhcyBwYXN0aWxsYXMgYW50aWNvbmNlcHRpdmFzIHNlIGhhIHJlZHVjaWRvIGVuIEZyYW5jaWEgZGVzZGUgMjAxMC48L2E+J1xuICAgICdHTUInOiAnRW4gR2FtYmlhLCBtdWNoYXMgbXVqZXJlcyB1dGlsaXphbiB1biBtw6l0b2RvIHRyYWRpY2lvbmFsIHF1ZSBjb25zaXN0ZSBlbiBhdGFyIGEgbGEgY2ludHVyYSB1bmEgY3VlcmRhLCB1bmEgcmFtYSwgbyB1biBwYXBlbGl0byBjb24gbyBzaW4gZnJhc2VzIGRlbCBDb3LDoW4uJ1xuICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCI+VW4gcHJveWVjdG8gYWxlbcOhbiBmYWNpbGl0YSBhbnRpY29uY2VwdGl2b3MgZGUgZm9ybWEgZ3JhdHVpdGEgYSBtdWplcmVzIGRlIG3DoXMgZGUgMjAgYcOxb3MgY29uIGluZ3Jlc29zIGJham9zLjwvYT4nXG4gICAgJ0dUTSc6ICc8YSBocmVmPVwiaHR0cDovL2J1ZmYubHkvMnRhWXdjb1wiPkxhIHJlbGlnacOzbiBpbmZsdXllIGVuIGxhIGVkdWNhY2nDs24gc2V4dWFsIGRlIGxvcyBqw7N2ZW5lcyBndWF0ZW1hbHRlY29zLjwvYT4nXG4gICAgJ0lTUic6ICdFbiBsb3Mgc2VjdG9yZXMganVkw61vcyBtw6FzIG9ydG9kb3hvcywgc29sbyBwdWVkZW4gdXNhcnNlIGxvcyBhbnRpY29uY2VwdGl2b3Mgc2kgZWwgcmFiaW5vIGRhIHN1IHBlcm1pc28gYSBsYSBtdWplci4nXG4gICAgJ0pQTic6ICdKYXDDs24sIGF1bnF1ZSBzZSBlbmN1ZW50cmEgZW4gZWwgZ3J1cG8gZGUgcGHDrXNlcyBjb24gcmVudGEgYWx0YSwgZXMgbGEgZXhjZXBjacOzbjogbGFzIG5lY2VzaWRhZGVzIG5vIGN1YmllcnRhcyBjb24gYW50aWNvbmNlcHRpdm9zIGVzdMOhIGFsIG5pdmVsIGRlIHBhw61zZXMgY29uIHJlbnRhcyBiYWphcy4nXG4gICAgJ1BSSyc6ICdFbCA5NSUgZGUgbXVqZXJlcyBxdWUgdXRpbGl6YW4gYW50aWNvbmNlcHRpdm9zIGVuIENvcmVhIGRlbCBOb3J0ZSBoYW4gZWxlZ2lkbyBlbCBESVUuIFNlIHRyYXRhIGRlbCBtYXlvciBwb3JjZW50YWplIGRlIHVzbyBhIG5pdmVsIG11bmRpYWwuJ1xuICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiPkVsIGdvYmllcm5vIGhvbGFuZMOpcyBsYW56YSBlbCBwcm95ZWN0byA8aT5TaGUgRGVjaWRlczwvaT4gcGFyYSBjb250cmFycmVzdGFyIGxhIHJldGlyYWRhIGRlIGZvbmRvcyBwYXJhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIGRlIFRydW1wLjwvYT4nXG4gICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCI+RW4gbGEgw6lwb2NhIGRlIGxvcyA5MCwgZHVyYW50ZSBlbCBnb2JpZXJubyBkZSBGdWppbW9yaSwgbcOhcyBkZSAyNTAuMDAwIG11amVyZXMgZnVlcm9uIGVzdGVyaWxpemFkYXMgc2luIHN1IGNvbnNlbnRpbWllbnRvLjwvYT4nXG4gICAgJ1BITCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L2p1bC8xMC9ob3ctYml0dGVyLWhlcmJzLWFuZC1ib3RjaGVkLWFib3J0aW9ucy1raWxsLXRocmVlLXdvbWVuLWEtZGF5LWluLXRoZS1waGlsaXBwaW5lc1wiPiBFbiB1biBwYcOtcyBkb25kZSBlbCBhYm9ydG8gZGVsIGVzdMOhIHByb2hpYmlkbywgdHJlcyBtdWplcmVzIG11ZXJlbiBhbCBkw61hIHBvciBjb21wbGljYWNpb25lcyBkZXJpdmFkYXMgZGUgaW50ZXJ2ZW5jaW9uZXMgaWxlZ2FsZXMuPC9hPidcbiAgICAnUE9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5hbW5lc3R5Lm9yZy9lbi9sYXRlc3QvbmV3cy8yMDE3LzA2L3BvbGFuZC1lbWVyZ2VuY3ktY29udHJhY2VwdGlvbi1yZXN0cmljdGlvbnMtY2F0YXN0cm9waGljLWZvci13b21lbi1hbmQtZ2lybHMvXCI+RWwgR29iaWVybm8gcG9sYWNvIGRhIHVuIHBhc28gYXRyw6FzIHkgc2UgY29udmllcnRlIGVuIGVsIMO6bmljbyBwYcOtcyBkZSBsYSBVbmnDs24gRXVyb3BlYSBkb25kZSBsYSBwYXN0aWxsYSBkZWwgZMOtYSBkZXNwdcOpcyBlc3TDoSBzdWpldGEgYSBwcmVzY3JpcGNpw7NuLjwvYT4nXG4gICAgJ1NTRCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L21heS8yNS9ldmVyeS15ZWFyLWktZ2l2ZS1iaXJ0aC13YXItZHJpdmluZy1jb250cmFjZXB0aW9uLWNyaXNpcy1zdWRhbi1udWJhLW1vdW50YWluc1wiPkxhIGd1ZXJyYSBlbiBTdWTDoW4gZXN0w6EgY3JlYW5kbyB1bmEgY3Jpc2lzIGVuIGVsIGFjY2VzbyBhIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICdFU1AnOiAnPGEgaHJlZj1cImh0dHA6Ly9jYWRlbmFzZXIuY29tL2VtaXNvcmEvMjAxNy8wOS8xOS9yYWRpb19tYWRyaWQvMTUwNTg0MjkzMl8xMzEwMzEuaHRtbFwiPk1hZHJpZCBlcyBsYSDDum5pY2EgY29tdW5pZGFkIHF1ZSBubyBmaW5hbmNpYSBhbnRpY29uY2VwdGl2b3MgY29uIHN1cyBmb25kb3MuPC9hPidcbiAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIj5FcmRvZ2FuIGRlY2xhcmEgcXVlIGxhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIG5vIGVzIHBhcmEgbG9zIG11c3VsbWFuZXMuPC9hPidcbiAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCI+RW4gMjAxNywgZWwgTWluaXN0ZXJpbyBkZSBTYWx1ZCBkZSBVZ2FuZGEgZGVjbGFyYWJhIHVuIGRlc2FiYXN0ZWNpbWllbnRvIGRlIDE1MCBtaWxsb25lcyBkZSBwcmVzZXJ2YXRpdm9zIG1hc2N1bGlub3MuPC9hPidcbiAgICAnR0JSJzogJzxhIGhyZWY9aHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL3dvcmxkLzIwMTgvamFuLzI5L2lyZWxhbmQtdG8tZ3JlZW5saWdodC1yZWZlcmVuZHVtLW9uLWFib3J0aW9uLWxhdy1yZWZvcm1cIj5FbiBJcmxhbmRhIGVzIGlsZWdhbCBhYm9ydGFyIGEgbm8gc2VyIHF1ZSBoYXlhIHVuIHJpZXNnbyByZWFsIGRlIHNhbHVkIHBhcmEgbGEgbWFkcmUuPC9hPidcbiAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIj5UcnVtcCBkYSBhIGxvcyBtw6lkaWNvcyBsaWJlcnRhZCBwYXJhIG5lZ2Fyc2UgYSByZWFsaXphciBwcm9jZWRpbWllbnRvcyBlbiBjb250cmEgZGUgc3VzIGNyZWVuY2lhcyByZWxpZ2lvc2FzLCBjb21vIGVsIGFib3J0by48L2E+J1xuICAgICdWRU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9tdW5kby9ub3RpY2lhcy1hbWVyaWNhLWxhdGluYS00MjYzNTQxMlwiPkxhIGVzY2FzZXogeSBlbCBwcmVjaW8gZWxldmFkbyBkZSBsb3MgYW50aWNvbmNlcHRpdm9zIGVuIFZlbmV6dWVsYSBpbmZsdXllIGVuIGVsIGF1bWVudG8gZGUgZW1iYXJhem9zIG5vIGRlc2VhZG9zLjwvYT4nXG4gICAgJ1pNQic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuaWRlby5vcmcvcHJvamVjdC9kaXZhLWNlbnRyZXNcIj5VbiBwcm95ZWN0byBlbiBaYW1iaWEgIHVuZSBsYSBtYW5pY3VyYSB5IGxvcyBhbnRpY29uY2VwdGl2b3MuPC9hPidcblxuXG4gIGNvbnN0cnVjdG9yOiAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzKSAtPlxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBAY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBoaWRlIGZpbHRlcnMgJiBjbGVhciBhY3RpdmUgYnRuc1xuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKS5maW5kKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgIyBoaWRlIGZpbHRlcnMgcmVzdWx0c1xuICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcblxuICAgIGlmIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS55ZWFyXG4gICAgICAjIGxvYWQgY291bnRyeSBkaHMgZGF0YVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sICcyMDE1LTE2J1xuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBpZiBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddICE9ICcwJ1xuICAgICAgICAgIHVzZSAgICAgICAgICAgPSBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSkgLT5cblxuICAgICNjb25zb2xlLmxvZyAnc2V0QXBwSXRlbURhdGEnLCAkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cbiAgICBpZiB1c2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCt1c2UpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG5cbiAgICBpZiBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZC12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrbWV0aG9kX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLW1ldGhvZCcpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLW1ldGhvZCcpLmhpZGUoKVxuXG4gICAgaWYgdW5tZXRuZWVkc1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11bm1ldG5lZWRzJykuaHRtbCBNYXRoLnJvdW5kKCt1bm1ldG5lZWRzKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG5cbiAgICBpZiByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCtyZWFzb25fdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuaGlkZSgpXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG4gIFxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAnMSc6IFwicMOtbGRvcmFcIlxuICAgICAgJzInOiBcIkRJVVwiXG4gICAgICAnMyc6IFwiaW55ZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZMOzblwiXG4gICAgICAnNic6IFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgICc3JzogXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgICc4JzogXCJhYnN0aW5lbmNpYSBwZXJpw7NkaWNhXCJcbiAgICAgICc5JzogXCJtYXJjaGEgYXRyw6FzXCJcbiAgICAgICcxMCc6IFwib3Ryb3NcIlxuICAgICAgJzExJzogXCJpbXBsYW50ZVwiXG4gICAgICAnMTMnOiBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgJzE3JzogXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICAnZW4nOlxuICAgICAgJzEnOiBcInBpbGxcIlxuICAgICAgJzInOiBcIklVRFwiXG4gICAgICAnMyc6IFwiaW5qZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZG9tXCJcbiAgICAgICc2JzogXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnNyc6IFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc4JzogXCJwZXJpb2RpYyBhYnN0aW5lbmNlXCJcbiAgICAgICc5JzogXCJ3aXRoZHJhd2FsXCJcbiAgICAgICcxMCc6IFwib3RoZXJcIlxuICAgICAgJzExJzogXCJpbXBsYW50XCJcbiAgICAgICcxMyc6IFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgJzE3JzogXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcblxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgJ2VzJzpcbiAgICAgIFwiYVwiOiBcIm5vIGVzdMOhbiBjYXNhZGFzXCJcbiAgICAgIFwiYlwiOiBcIm5vIHRpZW5lbiBzZXhvXCJcbiAgICAgIFwiY1wiOiBcInRpZW5lbiBzZXhvIGluZnJlY3VlbnRlXCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs25cIlxuICAgICAgXCJlXCI6IFwic29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhc1wiXG4gICAgICBcImZcIjogXCJhbWVub3JyZWEgcG9zdHBhcnRvXCJcbiAgICAgIFwiZ1wiOiBcImVzdMOhbiBkYW5kbyBlbCBwZWNob1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGFcIlxuICAgICAgXCJpXCI6IFwibGEgbXVqZXIgc2Ugb3BvbmVcIlxuICAgICAgXCJqXCI6IFwiZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lXCJcbiAgICAgIFwia1wiOiBcIm90cm9zIHNlIG9wb25lblwiICAgICAgICBcbiAgICAgIFwibFwiOiBcInByb2hpYmljacOzbiByZWxpZ2lvc2FcIiAgXG4gICAgICBcIm1cIjogXCJubyBjb25vY2UgbG9zIG3DqXRvZG9zXCJcbiAgICAgIFwiblwiOiBcIm5vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvc1wiXG4gICAgICBcIm9cIjogXCJwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiICAgICAgICAgICAgICAgICAgICAgXG4gICAgICBcInBcIjogXCJtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zL3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgXG4gICAgICBcInFcIjogXCJmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zXCJcbiAgICAgIFwiclwiOiBcImN1ZXN0YW4gZGVtYXNpYWRvXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudGVzIHBhcmEgc3UgdXNvXCJcbiAgICAgIFwidFwiOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAgIFwidVwiOiBcImVsIG3DqXRvZG8gZWxlZ2lkbyBubyBlc3TDoSBkaXNwb25pYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIGhheSBtw6l0b2RvcyBkaXNwb25pYmxlc1wiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdHJvc1wiXG4gICAgICBcInpcIjogXCJubyBsbyBzw6lcIlxuICAgICdlbic6XG4gICAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgICBcImJcIjogXCJub3QgaGF2aW5nIHNleFwiXG4gICAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgICBcImVcIjogXCJzdWJmZWN1bmQvaW5mZWN1bmRcIlxuICAgICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0aWNcIlxuICAgICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCJcbiAgICAgIFwialwiOiBcImh1c2JhbmQvcGFydG5lciBvcHBvc2VkXCJcbiAgICAgIFwia1wiOiBcIm90aGVycyBvcHBvc2VkXCJcbiAgICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiXG4gICAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgICAgXCJuXCI6IFwia25vd3Mgbm8gc291cmNlXCJcbiAgICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnQgdG8gdXNlXCJcbiAgICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpIncyBwcm9jZXNzZXNcIlxuICAgICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgcmVhc29uc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICd2M2EwOGEnOiAnbm8gZXN0w6FuIGNhc2FkYXMnXG4gICAgICAndjNhMDhiJzogJ25vIHRpZW5lbiBzZXhvJ1xuICAgICAgJ3YzYTA4Yyc6ICd0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZSdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzbidcbiAgICAgICd2M2EwOGUnOiAnc29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhcydcbiAgICAgICd2M2EwOGYnOiAnYW1lbm9ycmVhIHBvc3RwYXJ0bydcbiAgICAgICd2M2EwOGcnOiAnZXN0w6FuIGRhbmRvIGVsIHBlY2hvJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGEnXG4gICAgICAndjNhMDhpJzogJ2xhIG11amVyIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4aic6ICdlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhrJzogJ290cm9zIHNlIG9wb25lbicgICAgICAgIFxuICAgICAgJ3YzYTA4bCc6ICdwcm9oaWJpY2nDs24gcmVsaWdpb3NhJ1xuICAgICAgJ3YzYTA4bSc6ICdubyBjb25vY2UgbG9zIG3DqXRvZG9zJ1xuICAgICAgJ3YzYTA4bic6ICdubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3MnXG4gICAgICAndjNhMDhvJzogJ3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkJ1xuICAgICAgJ3YzYTA4cCc6ICdtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zJ1xuICAgICAgJ3YzYTA4cSc6ICdmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zJ1xuICAgICAgJ3YzYTA4cic6ICdjdWVzdGFuIGRlbWFzaWFkbydcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c28nXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgJ2VuJzogXG4gICAgICAndjNhMDhhJzogJ25vdCBtYXJyaWVkJ1xuICAgICAgJ3YzYTA4Yic6ICdub3QgaGF2aW5nIHNleCdcbiAgICAgICd2M2EwOGMnOiAnaW5mcmVxdWVudCBzZXgnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzYWwvaHlzdGVyZWN0b215J1xuICAgICAgJ3YzYTA4ZSc6ICdzdWJmZWN1bmQvaW5mZWN1bmQnXG4gICAgICAndjNhMDhmJzogJ3Bvc3RwYXJ0dW0gYW1lbm9ycmhlaWMnXG4gICAgICAndjNhMDhnJzogJ2JyZWFzdGZlZWRpbmcnXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0aWMnXG4gICAgICAndjNhMDhpJzogJ3Jlc3BvbmRlbnQgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGonOiAnaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQnXG4gICAgICAndjNhMDhrJzogJ290aGVycyBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4bCc6ICdyZWxpZ2lvdXMgcHJvaGliaXRpb24nXG4gICAgICAndjNhMDhtJzogJ2tub3dzIG5vIG1ldGhvZCdcbiAgICAgICd2M2EwOG4nOiAna25vd3Mgbm8gc291cmNlJ1xuICAgICAgJ3YzYTA4byc6ICdoZWFsdGggY29uY2VybnMnXG4gICAgICAndjNhMDhwJzogJ2ZlYXIgb2Ygc2lkZSBlZmZlY3RzJ1xuICAgICAgJ3YzYTA4cSc6ICdsYWNrIG9mIGFjY2Vzcy90b28gZmFyJ1xuICAgICAgJ3YzYTA4cic6ICdjb3N0cyB0b28gbXVjaCdcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50IHRvIHVzZSdcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmVyZXMgd2l0aCB0aGUgYm9keSdzIHByb2Nlc3Nlc1wiXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG5cbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuXG4gICAgIyBSZXNpemUgaGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIgPSAtPlxuICAgICAgaWYgZ3JhcGhXaWR0aCAhPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgZ3JhcGhXaWR0aCA9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA+IDQ4MCB0aGVuIChncmFwaFdpZHRoIC8gMjApIC0gMTAgZWxzZSAoZ3JhcGhXaWR0aCAvIDIwKSAtIDRcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICBpZiBjdXJyZW50U3RlcCA+IDBcbiAgICAgICAgZGF0YSA9IFs2NCwgODgsIDEwMF0gIyA2NCwgNjQrMjQsIDY0KzI0KzEyXG4gICAgICAgIGZyb20gPSBpZiBjdXJyZW50U3RlcCA+IDEgdGhlbiBkYXRhW2N1cnJlbnRTdGVwLTJdIGVsc2UgMFxuICAgICAgICB0byA9IGRhdGFbY3VycmVudFN0ZXAtMV1cbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK2N1cnJlbnRTdGVwLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIHJlc2l6ZUhhbmRsZXIoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzKSAtPlxuXG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeVswXSBhbmQgY291bnRyeVswXVsnZ25pJ11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiAgICAgICtkWydlc3RpbWF0ZWQnXVxuICAgICAgICAgICAgaWQ6ICAgICAgICAgY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgICAgICBjb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIHBvcHVsYXRpb246ICtjb3VudHJ5WzBdWydwb3B1bGF0aW9uJ11cbiAgICAgICAgICAgIGduaTogICAgICAgICtjb3VudHJ5WzBdWydnbmknXVxuICAgICAgIyMjXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdObyBHTkkgb3IgUG9wdWxhdGlvbiBkYXRhIGZvciB0aGlzIGNvdW50cnknLCBkLmNvZGUsIGNvdW50cnlbMF1cbiAgICAgICMjI1xuXG4gICAgIyBzZXR1cCBncmFwaFxuICAgIHVubWV0bmVlZHNHcmFwaCA9IG5ldyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgNVxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgeDogICAgICAnZ25pJ1xuICAgICAgICB5OiAgICAgICd2YWx1ZSdcbiAgICAgICAgaWQ6ICAgICAnaWQnXG4gICAgICAgIGxhYmVsOiAgJ25hbWUnXG4gICAgICAgIGNvbG9yOiAgJ3ZhbHVlJ1xuICAgICAgICBzaXplOiAgICdwb3B1bGF0aW9uJ1xuICAgICAgZG90TWluU2l6ZTogMVxuICAgICAgZG90TWF4U2l6ZTogMzJcbiAgICB1bm1ldG5lZWRzR3JhcGguc2V0RGF0YSBkYXRhXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ3VubWV0LW5lZWRzLWdkcC1jb250YWluZXItZ3JhcGgnLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICB1bm1ldG5lZWRzR3JhcGguc2V0TW9kZSBjdXJyZW50U3RlcFxuXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1bm1ldG5lZWRzR3JhcGgub25SZXNpemVcblxuXG4gICMgVXNlICYgUmVhc29ucyBtYXBzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyA9IChkYXRhX3VzZSwgY291bnRyaWVzLCBtYXApIC0+XG5cbiAgICAjIHBhcnNlIGRhdGEgdXNlXG4gICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgbWV0aG9kc19rZXlzLmZvckVhY2ggKGtleSxpKSAtPlxuICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgaWQ6IGlcbiAgICAgICAgICBuYW1lOiBtZXRob2RzX25hbWVzW2xhbmddW2ldXG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgICNkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICAjIyNcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ25vIGNvdW50cnknLCBkLmNvZGVcbiAgICAgICMjI1xuICAgIFxuICAgICMgU2V0IHVzZSBtYXBcbiAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICB0b3A6IDYwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgbGVnZW5kOiB0cnVlXG4gICAgICBsYW5nOiBsYW5nXG4gICAgdXNlTWFwLnNldERhdGEgZGF0YV91c2UsIG1hcFxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgdXNlTWFwLnNldE1hcFN0YXRlIGN1cnJlbnRTdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICB1c2VNYXAub25SZXNpemUoKVxuICAgICQod2luZG93KS5yZXNpemUgdXNlTWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBUcmVlbmFwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG5cbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICBpZiBjdXJyZW50U3RlcCA9PSAxXG4gICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSAnd29ybGQnLCAnTXVuZG8nXG4gICAgICBlbHNlIGlmIGN1cnJlbnRTdGVwID09IDAgYW5kIGUuZGlyZWN0aW9uID09ICd1cCdcbiAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcblxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIE9wcG9zaXRpb24gR3JhcGhzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCA9IC0+XG4gICAgJGJhcnMgPSAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkIC5iYXInKVxuICAgICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtbGVnZW5kIGxpJylcbiAgICAgIC5tb3VzZW92ZXIgLT5cbiAgICAgICAgJGJhcnNcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgICAgICAuZmlsdGVyKCcuYmFyLScrJCh0aGlzKS5hdHRyKCdjbGFzcycpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAubW91c2VvdXQgLT5cbiAgICAgICAgJGJhcnMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcblxuXG4gIG9uQ2Fyb3VzZWxTdGVwID0gKGUpIC0+XG4gICAgY3VycmVudFN0ZXAgPSBkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICNjb25zb2xlLmxvZyAnY2Fyb3VzZWwnLCBjdXJyZW50U3RlcFxuICAgIEBncmFwaGljLnNlbGVjdEFsbCgnLmFjdGl2ZScpLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgQGdyYXBoaWMuc2VsZWN0KCcuc3RlcC0nK2N1cnJlbnRTdGVwKS5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cblxuICAjIHNldHVwIGxpbmUgY2hhcnRcbiAgc2V0dXBNb3J0YWxpdHlMaW5lR3JhcGggPSAgLT5cbiAgICBkYXRhID0gW3tcbiAgICAgICcxOTkwJzogMzg1XG4gICAgICAnMTk5NSc6IDM2OVxuICAgICAgJzIwMDAnOiAzNDFcbiAgICAgICcyMDA1JzogMjg4XG4gICAgICAnMjAxMCc6IDI0NlxuICAgICAgJzIwMTUnOiAyMTZcbiAgICB9XVxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ21hdGVybmFsLW1vcnRhbGl0eS1ncmFwaCcsXG4gICAgICBpc0FyZWE6IHRydWVcbiAgICAgIG1hcmdpbjogbGVmdDogMjApXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk5NSwgMjAwNSwgMjAxNV1cbiAgICBncmFwaC55QXhpc1xuICAgICAgLnRpY2tWYWx1ZXMgWzEwMCwgMjAwLCAzMDBdXG4gICAgICAudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgZ3JhcGgueUZvcm1hdCA9IGQzLmZvcm1hdCgnLjJzJylcbiAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAtPiByZXR1cm4gWzAsIDM4NV1cbiAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXRMb2NhdGlvbiA9IChsb2NhdGlvbiwgY291bnRyaWVzKSAtPlxuICAgIGlmIGxvY2F0aW9uXG4gICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG5cbiAgc2V0dXBEYXRhQXJ0aWNsZSA9IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwKSAtPlxuXG4gICAgIyBhZGQgY291bnRyeSBJU08gMzE2Ni0xIGFscGhhLTMgY29kZSB0byBkYXRhX3JlYXNvbnNcbiAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUyID09IGQuY29kZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLmNvZGUgPSBpdGVtWzBdLmNvZGVcbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXNbbGFuZ10pLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgICBkW3JlYXNvbl0gPSAxMDAqZFtyZWFzb25dXG4gICAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICAgZGVsZXRlIGQuY291bnRyeVxuICAgICAgIyMjXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiAnTm8gY291bnRyeSBkYXRhIGZvciAnK2QuY29kZVxuICAgICAgIyMjXG5cbiAgICBpZiAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCBkYXRhX3VzZVxuXG4gICAgaWYgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyBkYXRhX3VzZSwgY291bnRyaWVzLCBtYXBcblxuICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoKClcblxuICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGhcbiAgICAgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoIGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzXG5cbiAgICBpZiAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLW1hcmllLXN0b3BlcycsIG9uQ2Fyb3VzZWxTdGVwXG5cbiAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICBzZXR1cFJlYXNvbnNPcHBvc2VkR3JhcGgoKVxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgIyBkYXRhIGFydGljbGVcbiAgaWYgJCgnYm9keScpLmhhc0NsYXNzKCdkYXRvcy11c28tYmFycmVyYXMnKSBvciAkKCdib2R5JykuaGFzQ2xhc3MoJ2RhdGEtdXNlLWJhcnJpZXJzJylcbiAgICAjIExvYWQgbG9jYXRpb25cbiAgICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICAgICBkMy5xdWV1ZSgpXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAgIHNldExvY2F0aW9uIGxvY2F0aW9uLCBjb3VudHJpZXNcbiAgICAgICAgICBzZXR1cERhdGFBcnRpY2xlIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXBcblxuICAjIHJlbGlnaW9uIGFydGljbGVcbiAgZWxzZSBpZiAkKCdib2R5JykuaGFzQ2xhc3MgJ3JlbGlnaW9uJ1xuICAgIGlmICQoJyNjYXJvdXNlbC1yYWJpbm9zJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLXJhYmlub3MnLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNjYXJvdXNlbC1pbWFtJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLWltYW0nLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNjYXJvdXNlbC1wYXBhJykubGVuZ3RoXG4gICAgICBuZXcgU2Nyb2xsR3JhcGggJ2Nhcm91c2VsLXBhcGEnLCBvbkNhcm91c2VsU3RlcFxuICAgIGlmICQoJyNtYXRlcm5hbC1tb3J0YWxpdHktZ3JhcGgnKS5sZW5ndGhcbiAgICAgIHNldHVwTW9ydGFsaXR5TGluZUdyYXBoKClcblxuICAgIyBkYXRhIHN0YXRpYyBhcnRpY2xlXG4gIGVsc2UgaWYgJCgnYm9keScpLmhhc0NsYXNzICdkYXRvcy11c28tYmFycmVyYXMtc3RhdGljJ1xuICAgICMgTG9hZCBsb2NhdGlvblxuICAgIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgICAgIGQzLnF1ZXVlKClcbiAgICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgICAgc2V0TG9jYXRpb24gbG9jYXRpb24sIGNvdW50cmllc1xuICAgICAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXVxuXG4pIGpRdWVyeVxuIl19
