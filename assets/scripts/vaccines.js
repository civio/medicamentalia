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
      this.options = $.extend(true, optionsDefault, options);
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
      this.svg.attr('width', this.containerWidth).attr('height', this.containerHeight);
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
        this.container.selectAll('.y.axis').attr(this.setYAxisPosition).call(this.yAxis);
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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.BarGraph = (function(superClass) {
    extend(BarGraph, superClass);

    function BarGraph(id, options) {
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setBarLabelYDimensions = bind(this.setBarLabelYDimensions, this);
      this.setBarLabelXDimensions = bind(this.setBarLabelXDimensions, this);
      this.setBarDimensions = bind(this.setBarDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      console.log('Bar Graph', id, options);
      BarGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BarGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          return d[_this.options.key.y] = +d[_this.options.key.y];
        };
      })(this));
      return data;
    };

    BarGraph.prototype.setScales = function() {
      this.x = d3.scaleBand().range(this.getScaleXRange()).paddingInner(0.1).paddingOuter(0);
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      return this;
    };

    BarGraph.prototype.getScaleXDomain = function() {
      return this.data.map((function(_this) {
        return function(d) {
          return d[_this.options.key.x];
        };
      })(this));
    };

    BarGraph.prototype.getScaleYDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this))
      ];
    };

    BarGraph.prototype.drawGraph = function() {
      this.container.selectAll('.bar').data(this.data).enter().append('rect').attr('class', function(d) {
        if (d.active) {
          return 'bar active';
        } else {
          return 'bar';
        }
      }).attr('id', (function(_this) {
        return function(d) {
          return d[_this.options.key.id];
        };
      })(this)).call(this.setBarDimensions);
      if (this.options.mouseEvents) {
        this.container.selectAll('.bar').on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut);
      }
      if (this.options.label) {
        this.container.selectAll('.bar-label-x').data(this.data).enter().append('text').attr('class', function(d) {
          if (d.active) {
            return 'bar-label-x active';
          } else {
            return 'bar-label-x';
          }
        }).attr('id', (function(_this) {
          return function(d) {
            return 'bar-label-x-' + d[_this.options.key.id];
          };
        })(this)).attr('dy', '1.25em').attr('text-anchor', 'middle').text((function(_this) {
          return function(d) {
            return d[_this.options.key.x];
          };
        })(this)).call(this.setBarLabelXDimensions);
        this.container.selectAll('.bar-label-y').data(this.data).enter().append('text').attr('class', function(d) {
          if (d.active) {
            return 'bar-label-y active';
          } else {
            return 'bar-label-y';
          }
        }).attr('id', (function(_this) {
          return function(d) {
            return 'bar-label-y-' + d[_this.options.key.id];
          };
        })(this)).attr('dy', '-0.5em').attr('text-anchor', 'middle').text((function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this)).call(this.setBarLabelYDimensions);
      }
      return this;
    };

    BarGraph.prototype.updateGraphDimensions = function() {
      BarGraph.__super__.updateGraphDimensions.call(this);
      this.container.selectAll('.bar').call(this.setBarDimensions);
      this.container.selectAll('.bar-label-x').call(this.setBarLabelXDimensions);
      this.container.selectAll('.bar-label-y').call(this.setBarLabelYDimensions);
      return this;
    };

    BarGraph.prototype.setBarDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this)).attr('height', (function(_this) {
        return function(d) {
          return _this.height - _this.y(d[_this.options.key.y]);
        };
      })(this)).attr('width', this.x.bandwidth());
    };

    BarGraph.prototype.setBarLabelXDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]) + _this.x.bandwidth() * 0.5;
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.height;
        };
      })(this));
    };

    BarGraph.prototype.setBarLabelYDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]) + _this.x.bandwidth() * 0.5;
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
    };

    BarGraph.prototype.onMouseOver = function(d) {
      this.container.select('#bar-label-x-' + d[this.options.key.id]).classed('active', true);
      return this.container.select('#bar-label-y-' + d[this.options.key.id]).classed('active', true);
    };

    BarGraph.prototype.onMouseOut = function(d) {
      if (!d.active) {
        this.container.select('#bar-label-x-' + d[this.options.key.id]).classed('active', false);
        return this.container.select('#bar-label-y-' + d[this.options.key.id]).classed('active', false);
      }
    };

    return BarGraph;

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
      console.log('Line Graph', id, options);
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
      this.xAxis.tickValues([year]);
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

  window.HeatmapGraph = (function(superClass) {
    extend(HeatmapGraph, superClass);

    function HeatmapGraph(id, options) {
      this.getCountryName = bind(this.getCountryName, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setMarkerDimensions = bind(this.setMarkerDimensions, this);
      this.setCellDimensions = bind(this.setCellDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.getScaleYRange = bind(this.getScaleYRange, this);
      this.getScaleXRange = bind(this.getScaleXRange, this);
      console.log('Heatmap Graph', id, options);
      this.lang = $('body').data('lang');
      HeatmapGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    HeatmapGraph.prototype.setSVG = function() {
      this.svg = null;
      this.container = d3.select('#' + this.id + ' .heatmap-container');
      return this.$tooltip = this.$el.find('.tooltip');
    };

    HeatmapGraph.prototype.setData = function(data) {
      this.years = this.getYears(data);
      this.countries = data.map(function(d) {
        return d.code;
      });
      this.cellsData = this.getCellsData(data);
      this.data = this.dataParser(data);
      this.getDimensions();
      this.drawScales();
      this.drawMarkers();
      this.drawGraph();
      return this;
    };

    HeatmapGraph.prototype.getYears = function(data) {
      var maxYear, minYear, years;
      minYear = d3.min(data, function(d) {
        return d3.min(d3.keys(d.values));
      });
      maxYear = d3.max(data, function(d) {
        return d3.max(d3.keys(d.values));
      });
      years = d3.range(minYear, maxYear, 1);
      years.push(+maxYear);
      return years;
    };

    HeatmapGraph.prototype.getCellsData = function(data) {
      var cellsData;
      cellsData = [];
      data.forEach(function(d) {
        var results, value;
        results = [];
        for (value in d.values) {
          results.push(cellsData.push({
            country: d.code,
            name: d.name,
            year: value,
            cases: d.cases[value],
            value: d.values[value]
          }));
        }
        return results;
      });
      return cellsData;
    };

    HeatmapGraph.prototype.dataParser = function(data) {
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

    HeatmapGraph.prototype.setScales = function() {
      this.x = d3.scaleBand().padding(0).paddingInner(0).paddingOuter(0).round(true).range(this.getScaleXRange());
      this.y = d3.scaleBand().padding(0).paddingInner(0).paddingOuter(0).round(true).range(this.getScaleYRange());
      this.color = d3.scaleSequential(d3.interpolateOranges);
      return this;
    };

    HeatmapGraph.prototype.drawScales = function() {
      HeatmapGraph.__super__.drawScales.call(this);
      this.color.domain([0, 4]);
      return this;
    };

    HeatmapGraph.prototype.getScaleXRange = function() {
      return [0, this.width];
    };

    HeatmapGraph.prototype.getScaleYRange = function() {
      return [0, this.height];
    };

    HeatmapGraph.prototype.getScaleXDomain = function() {
      return this.years;
    };

    HeatmapGraph.prototype.getScaleYDomain = function() {
      return this.countries;
    };

    HeatmapGraph.prototype.getDimensions = function() {
      var cellSize;
      this.width = this.$el.width() - 100;
      if (this.years && this.countries) {
        cellSize = Math.floor(this.width / this.years.length);
        this.height = cellSize < 20 ? cellSize * this.countries.length : 20 * this.countries.length;
      }
      return this;
    };

    HeatmapGraph.prototype.drawGraph = function() {
      this.x.range(this.getScaleXRange());
      this.y.range(this.getScaleYRange());
      this.container.style('height', this.height + 'px');
      this.container.append('div').attr('class', 'cell-container').style('height', this.height + 'px').selectAll('.cell').data(this.cellsData).enter().append('div').attr('class', 'cell').style('background', (function(_this) {
        return function(d) {
          return _this.color(d.value);
        };
      })(this)).on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut).call(this.setCellDimensions);
      this.container.append('div').attr('class', 'x-axis axis').selectAll('.axis-item').data(this.years.filter(function(d) {
        return d % 5 === 0;
      })).enter().append('div').attr('class', 'axis-item').style('left', (function(_this) {
        return function(d) {
          return _this.x(d) + 'px';
        };
      })(this)).html(function(d) {
        return d;
      });
      this.container.append('div').attr('class', 'y-axis axis').selectAll('.axis-item').data(this.countries).enter().append('div').attr('class', 'axis-item').style('top', (function(_this) {
        return function(d) {
          return _this.y(d) + 'px';
        };
      })(this)).html((function(_this) {
        return function(d) {
          return _this.getCountryName(d);
        };
      })(this));
      return this.container.select('.cell-container').selectAll('.marker').data(this.data.map(function(d) {
        return {
          code: d.code,
          year: d.year_introduction
        };
      }).filter(function(d) {
        return !isNaN(d.year);
      })).enter().append('div').attr('class', 'marker').call(this.setMarkerDimensions);
    };

    HeatmapGraph.prototype.updateGraphDimensions = function() {
      this.x.range(this.getScaleXRange());
      this.y.range(this.getScaleYRange());
      this.container.style('height', this.height + 'px');
      this.container.select('.cell-container').style('height', this.height + 'px');
      this.container.selectAll('.cell').call(this.setCellDimensions);
      this.container.select('.x-axis').selectAll('.axis-item').style('left', (function(_this) {
        return function(d) {
          return _this.x(d) + 'px';
        };
      })(this));
      this.container.select('.y-axis').selectAll('.axis-item').style('top', (function(_this) {
        return function(d) {
          return _this.y(d) + 'px';
        };
      })(this));
      this.container.select('.cell-container').selectAll('.marker').call(this.setMarkerDimensions);
      return this;
    };

    HeatmapGraph.prototype.setCellDimensions = function(selection) {
      return selection.style('left', (function(_this) {
        return function(d) {
          return _this.x(d.year) + 'px';
        };
      })(this)).style('top', (function(_this) {
        return function(d) {
          return _this.y(d.country) + 'px';
        };
      })(this)).style('width', this.x.bandwidth() + 'px').style('height', this.y.bandwidth() + 'px');
    };

    HeatmapGraph.prototype.setMarkerDimensions = function(selection) {
      return selection.style('top', (function(_this) {
        return function(d) {
          return _this.y(d.code) + 'px';
        };
      })(this)).style('left', (function(_this) {
        return function(d) {
          if (d.year < _this.years[0]) {
            return _this.x(_this.years[0]) - 1 + 'px';
          } else if (d.year < _this.years[_this.years.length - 1]) {
            return _this.x(d.year) - 1 + 'px';
          } else {
            return _this.x.bandwidth() + _this.x(_this.years[_this.years.length - 1]) + 'px';
          }
        };
      })(this)).style('height', this.y.bandwidth() + 'px');
    };

    HeatmapGraph.prototype.onMouseOver = function(d) {
      var cases_single_str, cases_str, offset;
      offset = $(d3.event.target).offset();
      cases_str = this.lang === 'es' ? 'casos' : 'cases';
      cases_single_str = this.lang === 'es' ? 'caso' : 'case';
      this.$tooltip.find('.tooltip-inner .country').html(d.name);
      this.$tooltip.find('.tooltip-inner .year').html(d.year);
      this.$tooltip.find('.tooltip-inner .value').html(this.formatDecimal(d.value, this.lang));
      this.$tooltip.find('.tooltip-inner .cases').html(d.cases !== 1 ? d.cases.toLocaleString(this.lang) + ' ' + cases_str : d.cases.toLocaleString(this.lang) + ' ' + cases_single_str);
      this.$tooltip.css({
        'left': offset.left + this.x.bandwidth() * 0.5 - (this.$tooltip.width() * 0.5),
        'top': offset.top - (this.y.bandwidth() * 0.5) - this.$tooltip.height(),
        'opacity': '1'
      });
    };

    HeatmapGraph.prototype.onMouseOut = function(d) {
      this.$tooltip.css('opacity', '0');
    };

    HeatmapGraph.prototype.getCountryName = function(code) {
      var country;
      country = this.data.filter(function(d) {
        return d.code === code;
      });
      if (country[0]) {
        return country[0].name;
      } else {
        return '';
      }
    };

    HeatmapGraph.prototype.formatDecimal = function(number, lang) {
      if (number < 0.001) {
        return 0;
      } else if (number >= 0.1) {
        return number.toFixed(1).toLocaleString(lang);
      } else if (number >= 0.01) {
        return number.toFixed(2).toLocaleString(lang);
      } else {
        return number.toFixed(3).toLocaleString(lang);
      }
    };

    return HeatmapGraph;

  })(BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.MapGraph = (function(superClass) {
    extend(MapGraph, superClass);

    function MapGraph(id, options) {
      this.setLegendPosition = bind(this.setLegendPosition, this);
      this.setCountryColor = bind(this.setCountryColor, this);
      console.log('Map Graph', id, options);
      MapGraph.__super__.constructor.call(this, id, options);
      return this;
    }

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
      this.color.domain([
        0, d3.max(this.data, function(d) {
          return d.value;
        })
      ]);
      if (this.options.legend) {
        this.drawLegend();
      }
      this.drawGraph(map);
      return this;
    };

    MapGraph.prototype.drawLegend = function() {
      var legenItemWidth, legendData;
      legenItemWidth = 30;
      legendData = d3.range(0, this.color.domain()[1]);
      this.legend = this.container.append('g').attr('class', 'legend').call(this.setLegendPosition);
      this.legend.selectAll('rect').data(legendData).enter().append('rect').attr('x', function(d, i) {
        return Math.round(legenItemWidth * (i - 1 - (legendData.length / 2)));
      }).attr('width', legenItemWidth).attr('height', 8).attr('fill', (function(_this) {
        return function(d) {
          return _this.color(d);
        };
      })(this));
      legendData.shift();
      return this.legend.selectAll('text').data(legendData).enter().append('text').attr('x', function(d, i) {
        return Math.round(legenItemWidth * (i - 0.5 - (legendData.length / 2)));
      }).attr('y', 20).attr('text-anchor', 'start').text(function(d) {
        return d;
      });
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
      this.$el.trigger('draw-complete');
      return this;
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

    return MapGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ScatterplotGraph = (function(superClass) {
    extend(ScatterplotGraph, superClass);

    function ScatterplotGraph(id, options) {
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.setDotLabelsDimensions = bind(this.setDotLabelsDimensions, this);
      this.setDotsDimensions = bind(this.setDotsDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      console.log('Scatterplot Graph', id, options);
      ScatterplotGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    ScatterplotGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          d[_this.options.key.x] = +d[_this.options.key.x];
          return d[_this.options.key.y] = +d[_this.options.key.y];
        };
      })(this));
      return data;
    };

    ScatterplotGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(0.5).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width);
      return this;
    };

    ScatterplotGraph.prototype.getScaleXDomain = function() {
      console.log('getScaleXDomain', d3.max(this.data, (function(_this) {
        return function(d) {
          return d[_this.options.key.x];
        };
      })(this)));
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.x];
          };
        })(this))
      ];
    };

    ScatterplotGraph.prototype.getScaleYDomain = function() {
      console.log('getScaleYDomain', d3.max(this.data, (function(_this) {
        return function(d) {
          return d[_this.options.key.y];
        };
      })(this)));
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this))
      ];
    };

    ScatterplotGraph.prototype.drawGraph = function() {
      console.log(this.data);
      this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).attr('r', 6).call(this.setDotsDimensions);
      this.container.selectAll('.dot-label').data(this.data).enter().append('text').attr('class', 'dot-label').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).attr('dx', '0.75em').attr('dy', '0.375em').text((function(_this) {
        return function(d) {
          return d[_this.options.key.id];
        };
      })(this)).call(this.setDotLabelsDimensions);
      return this;
    };

    ScatterplotGraph.prototype.updateGraphDimensions = function() {
      ScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.container.selectAll('.dot').call(this.setDotsDimensions);
      return this;
    };

    ScatterplotGraph.prototype.setDotsDimensions = function(element) {
      return element.attr('cx', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
    };

    ScatterplotGraph.prototype.setDotLabelsDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
    };

    ScatterplotGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(0,0)');
    };

    return ScatterplotGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  (function($) {
    var baseurl, getCountryName, lang, setVideoMapPolio, setupHeatMapGraph, setupImmunizationCoverageDynamicLineGraph, setupImmunizationCoverageLineGraph, setupImmunizationDiseaseBarGraph, setupMeaslesWorldMapGraph, setupVaccineConfidenceBarGraph, setupVaccineConfidenceScatterplotGraph, setupVaccineDiseaseHeatmapGraph, setupWorldCasesMultipleSmallGraph;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    $('[data-toggle="tooltip"]').tooltip();
    getCountryName = function(countries, code, lang) {
      var item;
      item = countries.filter(function(d) {
        return d.code === code;
      });
      if (item) {
        return item[0]['name_' + lang];
      } else {
        return console.error('No country name for code', code);
      }
    };
    setVideoMapPolio = function() {
      var i, notes, popcorn, wrapper;
      wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio');
      wrapper.src = 'http://www.youtube.com/embed/l1F2Xd5FFlQ?controls=0&showinfo=0&hd=1';
      popcorn = Popcorn(wrapper);
      notes = 2016 - 1980;
      i = 0;
      while (i <= notes) {
        popcorn.footnote({
          start: 1.6222 * i,
          end: 1.6222 * (i + 1),
          text: 1980 + i,
          target: 'video-map-polio-description'
        });
        i++;
      }
      wrapper.addEventListener('ended', function(e) {
        $('.video-map-polio-cover').fadeIn();
        $('#video-map-polio-description').fadeTo(300, 0);
        return popcorn.currentTime(0);
      });
      return $('#video-map-polio-play-btn').click(function(e) {
        e.preventDefault();
        popcorn.play();
        $('.video-map-polio-cover').fadeOut();
        return $('#video-map-polio-description').fadeTo(300, 1);
      });
    };
    setupMeaslesWorldMapGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/measles-cases-who-regions.csv').defer(d3.csv, baseurl + '/assets/data/countries-who-regions.csv').defer(d3.json, baseurl + '/assets/data/map-world-110.json').await(function(error, data, countries, map) {
        var cases, graph;
        cases = {};
        data.forEach(function(d) {
          return cases[d.region] = +d.cases * 100000;
        });
        countries.forEach(function(d) {
          d.value = cases[d.region];
          d.name = d['name_' + lang];
          delete d.name_es;
          return delete d.name_en;
        });
        graph = new window.MapGraph('measles-world-map-graph', {
          margin: {
            top: 60,
            bottom: 0
          },
          legend: true
        });
        graph.setData(countries, map);
        return $(window).resize(graph.onResize);
      });
    };
    setupHeatMapGraph = function(id, data, countries) {
      var graph;
      data = data.filter(function(d) {
        return countries.indexOf(d.code) !== -1 && d3.values(d.values).length > 0;
      }).sort(function(a, b) {
        return a.total - b.total;
      });
      graph = new window.HeatmapGraph(id, {
        margin: {
          right: 0,
          left: 0
        }
      });
      graph.setData(data);
      return $(window).resize(graph.onResize);
    };
    setupVaccineConfidenceBarGraph = function() {
      var graph;
      graph = new window.BarGraph('vaccine-confidence-graph', {
        aspectRatio: 0.3,
        label: true,
        key: {
          x: 'name',
          y: 'value',
          id: 'code'
        }
      });
      graph.dataParser = function(data) {
        data.forEach((function(_this) {
          return function(d) {
            d.value = +d.value;
            d.name = d['name_' + lang];
            delete d.name_es;
            return delete d.name_en;
          };
        })(this));
        return data;
      };
      graph.loadData(baseurl + '/assets/data/confidence.csv');
      return $(window).resize(graph.onResize);
    };
    setupVaccineConfidenceScatterplotGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/confidence.csv').defer(d3.csv, baseurl + '/assets/data/countries.csv').await(function(error, data, countries) {
        var graph;
        graph = new window.ScatterplotGraph('vaccine-confidence-graph', {
          aspectRatio: 0.5,
          margin: {
            top: 0,
            right: 0,
            left: 50,
            bottom: 20
          },
          key: {
            x: 'gdp',
            y: 'confidence',
            id: 'country'
          }
        });
        graph.xAxis.tickValues([5000, 20000, 40000, 60000]);
        graph.setData(data);
        return $(window).resize(graph.onResize);
      });
    };
    setupVaccineDiseaseHeatmapGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/diseases-cases-measles.csv').defer(d3.csv, baseurl + '/assets/data/population.csv').await(function(error, data_cases, data_population) {
        delete data_cases.columns;
        data_cases.forEach(function(d) {
          var population, populationItem, year;
          if (d.year_introduction) {
            d.year_introduction = +d.year_introduction.replace('prior to', '');
          }
          d.cases = {};
          d.values = {};
          d.name = getCountryName(data_population, d.code, lang);
          populationItem = data_population.filter(function(country) {
            return country.code === d.code;
          });
          if (populationItem.length > 0) {
            year = 1980;
            while (year < 2016) {
              if (d[year]) {
                population = +populationItem[0][year];
                if (population !== 0) {
                  d.cases[year] = +d[year];
                  d.values[year] = 1000 * +d[year] / population;
                } else {

                }
              } else {

              }
              delete d[year];
              year++;
            }
          } else {
            console.log('No hay datos de población para', d.name);
          }
          return d.total = d3.values(d.values).reduce((function(a, b) {
            return a + b;
          }), 0);
        });
        setupHeatMapGraph('vaccines-measles-graph-1', data_cases, ['FIN', 'HUN', 'PRT', 'URY', 'MEX', 'COL']);
        return setupHeatMapGraph('vaccines-measles-graph-2', data_cases, ['IRQ', 'BGR', 'MNG', 'ZAF', 'FRA', 'GEO']);
      });
    };
    setupImmunizationCoverageDynamicLineGraph = function() {
      var graph;
      graph = new window.LineGraph('immunization-coverage-graph-all', {
        key: {
          id: 'code',
          x: 'name'
        },
        label: true,
        margin: {
          top: 20
        }
      });
      graph.getScaleYDomain = function(d) {
        return [0, 100];
      };
      graph.yAxis.tickValues([0, 25, 50, 75, 100]);
      d3.csv(baseurl + '/assets/data/immunization-coverage.csv', function(error, data) {
        graph.setData(data.filter(function(d) {
          return d.vaccine === $('#immunization-coverage-vaccine-selector').val();
        }));
        $('#immunization-coverage-vaccine-selector').change(function(e) {
          graph.setData(data.filter(function(d) {
            return d.vaccine === $('#immunization-coverage-vaccine-selector').val();
          }));
          return $('#immunization-coverage-country-1-selector').trigger('change');
        });
        $('#immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector').change(function(e) {
          $('#immunization-coverage-graph-all').find('.line-label, .line').removeClass('active');
          $('#immunization-coverage-graph-all #line-' + $('#immunization-coverage-country-1-selector').val()).addClass('active');
          $('#immunization-coverage-graph-all #line-' + $('#immunization-coverage-country-2-selector').val()).addClass('active');
          $('#immunization-coverage-graph-all #line-label-' + $('#immunization-coverage-country-1-selector').val()).addClass('active');
          return $('#immunization-coverage-graph-all #line-label-' + $('#immunization-coverage-country-2-selector').val()).addClass('active');
        });
        return $('#immunization-coverage-country-1-selector').trigger('change');
      });
      return $(window).resize(graph.onResize);
    };
    setupImmunizationCoverageLineGraph = function() {
      var countries, graph;
      countries = ['FRA', 'DNK', 'DZA', 'LKA'];
      graph = new window.LineGraph('immunization-coverage-graph', {
        key: {
          id: 'code',
          x: 'name'
        },
        label: true,
        margin: {
          bottom: 20
        }
      });
      graph.getScaleYDomain = function(d) {
        return [0, 100];
      };
      graph.yAxis.tickValues([0, 25, 50, 75, 100]);
      graph.xAxis.tickValues([2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015]);
      graph.addMarker({
        value: 95,
        label: lang === 'es' ? 'Nivel de rebaño' : 'Herd immunity',
        align: 'left'
      });
      d3.csv(baseurl + '/assets/data/immunization-coverage-mcv2.csv', function(error, data) {
        return graph.setData(data.filter(function(d) {
          return countries.indexOf(d.code) !== -1;
        }));
      });
      return $(window).resize(graph.onResize);
    };
    setupWorldCasesMultipleSmallGraph = function() {
      var diseases, graphs;
      diseases = ['diphteria', 'measles', 'pertussis', 'polio', 'tetanus'];
      graphs = [];
      return d3.csv(baseurl + '/assets/data/diseases-cases-world.csv', function(error, data) {
        var maxValue1, maxValue2;
        maxValue1 = d3.max(data, function(d) {
          return d3.max(d3.values(d), function(e) {
            return +e;
          });
        });
        maxValue2 = 100000;
        return diseases.forEach(function(disease) {
          var disease_data, graph;
          disease_data = data.filter(function(d) {
            return d.disease === disease;
          }).map(function(d) {
            return $.extend({}, d);
          });
          graph = new window.LineGraph(disease + '-world-graph', {
            isArea: true,
            margin: {
              left: 20
            },
            key: {
              x: 'disease',
              id: 'disease'
            }
          });
          graphs.push(graph);
          graph.xAxis.tickValues([1980, 2015]);
          graph.yAxis.ticks(2).tickFormat(d3.format('.0s'));
          graph.yFormat = d3.format('.2s');
          graph.getScaleYDomain = function() {
            return [0, disease === 'measles' || disease === 'pertussis' ? maxValue1 : maxValue2];
          };
          graph.setData(disease_data);
          graph.$el.on('change-year', function(e, year) {
            return graphs.forEach(function(g) {
              if (g !== graph) {
                return g.setLabel(year);
              }
            });
          });
          graph.$el.on('mouseout', function(e) {
            return graphs.forEach(function(g) {
              if (g !== graph) {
                return g.hideLabel();
              }
            });
          });
          return $(window).resize(graph.onResize);
        });
      });
    };
    setupImmunizationDiseaseBarGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/immunization-coverage.csv').defer(d3.csv, baseurl + '/assets/data/countries.csv').await(function(error, data, countries) {
        var country, data_parser, data_sort, excludedCountries, herdImmunity;
        country = 'ESP';
        excludedCountries = ['NIU', 'COK', 'TUV', 'NRU', 'PLW', 'VGB', 'MAF', 'SMR', 'GIB', 'TCA', 'LIE', 'MCO', 'SXM', 'FRO', 'MHL', 'MNP', 'ASM', 'KNA', 'GRL', 'CY', 'BMU', 'AND', 'DMA', 'IMN', 'ATG', 'SYC', 'VIR', 'ABW', 'FSM', 'TON', 'GRD', 'VCT', 'KIR', 'CUW', 'CHI', 'GUM', 'LCA', 'STP', 'WSM', 'VUT', 'NCL', 'PYF', 'BRB'];
        herdImmunity = {
          'MCV1': 95,
          'Pol3': 80,
          'DTP3': 80
        };
        data = data.filter(function(d) {
          return excludedCountries.indexOf(d.code) === -1;
        });
        data_parser = function(d) {
          var obj;
          obj = {
            key: d.code,
            name: getCountryName(countries, d.code, lang),
            value: +d['2015']
          };
          if (d.code === country) {
            obj.active = true;
          }
          return obj;
        };
        data_sort = function(a, b) {
          return b.value - a.value;
        };
        return $('.immunization-coverage-disease-graph').each(function() {
          var $el, disease, graph, graph_data, graph_value, marker, vaccine;
          $el = $(this);
          disease = $el.data('disease');
          vaccine = $el.data('vaccine');
          graph_data = data.filter(function(d) {
            return d.vaccine === vaccine && d['2015'] !== '';
          }).map(data_parser).sort(data_sort);
          graph_value = graph_data.filter(function(d) {
            return d.key === country;
          });
          graph = new window.BarGraph(disease + '-immunization-bar-graph', {
            aspectRatio: 0.25,
            label: true,
            key: {
              x: 'name'
            },
            margin: {
              top: 20
            }
          });
          marker = {
            value: herdImmunity[vaccine],
            label: lang === 'es' ? 'Nivel de rebaño' : 'Herd immunity'
          };
          if (vaccine === 'DTP3') {
            marker.label = lang === 'es' ? 'Recomendación OMS' : 'WHO recommendation';
          }
          graph.addMarker(marker).setData(graph_data);
          if (graph_value.length > 0) {
            $el.find('.immunization-data').html('<strong>' + graph_value[0].value + '%</strong>');
          }
          return $(window).resize(function() {
            return graph.onResize();
          });
        });
      });
    };

    /*
    setupGuatemalaCoverageLineGraph = ->
      graph = new window.LineGraph('guatemala-coverage-mmr',
        #isArea: true
        margin: 
          left: 0
          right: 0
          bottom: 20)
      graph.xAxis.tickValues [2000, 2005, 2010, 2015]
      graph.yAxis
        .tickValues [0, 25, 50, 75, 100]
        .tickFormat (d) -> d+'%'
      graph.loadData baseurl+'/assets/data/guatemala-coverage-mmr.csv'
      graph.$el.on 'draw-complete', (e) ->
        line = graph.container.select('.line')
        console.log line.node()
        length = line.node().getTotalLength();
        line
          .attr('stroke-dasharray', length + ' ' + length)
          .attr('stroke-dashoffset', length)
          .transition()
            .delay(5000)
            .duration(5000)
            .ease(d3.easeSinInOut)
            .attr('stroke-dashoffset', 0)
    
    if $('#guatemala-coverage-mmr').length > 0
      setupGuatemalaCoverageLineGraph()
     */
    if ($('#video-map-polio').length > 0) {
      setVideoMapPolio();
    }

    /*
    // Vaccine map
    if ($('#vaccine-map').length > 0) {
      var vaccine_map = new VaccineMap('vaccine-map');
      //vaccine_map.getData = true; // Set true to download a polio cases csv
      //vaccine_map.getPictureSequence = true; // Set true to download a map picture sequence
      vaccine_map.init(baseurl+'/assets/data/diseases-polio-cases.csv', baseurl+'/assets/data/map-polio-cases.csv');
      $(window).resize( vaccine_map.onResize );
    }
     */
    if ($('.vaccines-disease-graph').length > 0) {
      setupVaccineDiseaseHeatmapGraph();
    }

    /*
     * Vaccine all diseases graph
    if $('#vaccines-all-diseases-graph').length > 0
      graph_vaccine_all_diseases = new VaccineDiseaseGraph('vaccines-all-diseases-graph')
      graph_vaccine_all_diseases.init $('#disease-selector .active a').attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val()
      $(window).resize graph_vaccine_all_diseases.onResize
       * Update graph based on selected disease
      $('#disease-selector a').click (e) ->
        e.preventDefault()
        $(this).tab 'show'
        graph_vaccine_all_diseases.init $(this).attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val()
        return
       * Update graph baseon on order selector
      $('#vaccines-all-diseases-graph #order-selector').change (d) ->
        graph_vaccine_all_diseases.init $('#disease-selector .active a').attr('href').substring(1), $(this).val()
     */
    if ($('#immunization-coverage-graph-all').length > 0) {
      setupImmunizationCoverageDynamicLineGraph();
    }
    if ($('#immunization-coverage-graph').length > 0) {
      setupImmunizationCoverageLineGraph();
    }
    if ($('#world-cases').length > 0) {
      setupWorldCasesMultipleSmallGraph();
    }
    if ($('.immunization-coverage-disease-graph').length > 0) {
      setupImmunizationDiseaseBarGraph();
    }
    if ($('#measles-world-map-graph').length > 0) {
      setupMeaslesWorldMapGraph();
    }
    if ($('#vaccine-confidence-graph').length > 0) {
      return setupVaccineConfidenceBarGraph();
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwibWFpbi12YWNjaW5lcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsY0FBZixFQUErQixPQUEvQjtNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELEdB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QUUseUJBQUYsQ0FBNEIsQ0FBQyxNQUE3QixHQUFzQyxDQUF6QztNQUNFLCtCQUFBLENBQUEsRUFERjs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkEsSUFBRyxDQUFBLENBQUUsa0NBQUYsQ0FBcUMsQ0FBQyxNQUF0QyxHQUErQyxDQUFsRDtNQUNFLHlDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSw4QkFBRixDQUFpQyxDQUFDLE1BQWxDLEdBQTJDLENBQTlDO01BQ0Usa0NBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLGNBQUYsQ0FBaUIsQ0FBQyxNQUFsQixHQUEyQixDQUE5QjtNQUNFLGlDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSxzQ0FBRixDQUF5QyxDQUFDLE1BQTFDLEdBQW1ELENBQXREO01BQ0UsZ0NBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsTUFBOUIsR0FBdUMsQ0FBMUM7TUFDRSx5QkFBQSxDQUFBLEVBREY7O0lBR0EsSUFBRyxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxNQUEvQixHQUF3QyxDQUEzQzthQUNFLDhCQUFBLENBQUEsRUFERjs7RUF0WUQsQ0FBRCxDQUFBLENBeVlFLE1BellGO0FBQUEiLCJmaWxlIjoidmFjY2luZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5hdHRyIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0JhciBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2JhciBhY3RpdmUnIGVsc2UgJ2JhcidcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLm9uICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC15IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJy0wLjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgPT4gQGhlaWdodCAtIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEBoZWlnaHRcblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHVubGVzcyBkLmFjdGl2ZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAiLCJjbGFzcyB3aW5kb3cuTGluZUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgeUZvcm1hdDogZDMuZm9ybWF0KCdkJykgICAjIHNldCBsYWJlbHMgaG92ZXIgZm9ybWF0XG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdMaW5lIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyBkYXRhXG4gICAgc3VwZXIoZGF0YSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICB5ZWFycyA9IFtdXG4gICAgZDMua2V5cyhkYXRhWzBdKS5mb3JFYWNoIChkKSAtPlxuICAgICAgaWYgK2RcbiAgICAgICAgeWVhcnMucHVzaCArZFxuICAgIHJldHVybiB5ZWFycy5zb3J0KClcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGRbQG9wdGlvbnMua2V5LnhdLCAnZW4gJywgeWVhcik7XG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbScgICAgICBcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEB4QXhpcy50aWNrVmFsdWVzIFt5ZWFyXVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgXG4gIHNldFRpY2tIb3ZlclBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCBNYXRoLnJvdW5kIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCs5IiwiY2xhc3Mgd2luZG93LkhlYXRtYXBHcmFwaCBleHRlbmRzIEJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0hlYXRtYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIEBsYW5nID0gJCgnYm9keScpLmRhdGEgJ2xhbmcnXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyAgICAgICA9IG51bGxcbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0ICcjJytAaWQrJyAuaGVhdG1hcC1jb250YWluZXInXG4gICAgQCR0b29sdGlwICA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgIyBHZXQgeWVhcnMgKHggc2NhbGUpXG4gICAgQHllYXJzID0gQGdldFllYXJzKGRhdGEpXG4gICAgIyBHZXQgY291bnRyaWVzICh5IHNjYWxlKVxuICAgIEBjb3VudHJpZXMgPSBkYXRhLm1hcCAoZCkgLT4gZC5jb2RlXG4gICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiAgICBAY2VsbHNEYXRhID0gQGdldENlbGxzRGF0YSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBnZXREaW1lbnNpb25zKCkgIyBmb3JjZSB1cGRhdGUgZGltZW5zaW9uc1xuICAgIEBkcmF3U2NhbGVzKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIG1pblllYXIgPSBkMy5taW4gZGF0YSwgKGQpIC0+IGQzLm1pbihkMy5rZXlzKGQudmFsdWVzKSlcbiAgICBtYXhZZWFyID0gZDMubWF4IGRhdGEsIChkKSAtPiBkMy5tYXgoZDMua2V5cyhkLnZhbHVlcykpXG4gICAgeWVhcnMgPSBkMy5yYW5nZSBtaW5ZZWFyLCBtYXhZZWFyLCAxXG4gICAgeWVhcnMucHVzaCArbWF4WWVhclxuICAgIHJldHVybiB5ZWFyc1xuXG4gIGdldENlbGxzRGF0YTogKGRhdGEpIC0+XG4gICAgY2VsbHNEYXRhID0gW11cbiAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiAgICAgICAgICBuYW1lOiAgICBkLm5hbWVcbiAgICAgICAgICB5ZWFyOiAgICB2YWx1ZVxuICAgICAgICAgIGNhc2VzOiAgIGQuY2FzZXNbdmFsdWVdXG4gICAgICAgICAgdmFsdWU6ICAgZC52YWx1ZXNbdmFsdWVdXG4gICAgcmV0dXJuIGNlbGxzRGF0YVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhclxuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICBAY29sb3IuZG9tYWluIFswLCA0XSAgIyBUT0RPISEhIC0+IE1ha2UgdGhpcyBkeW5hbWljXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICBnZXRTY2FsZVlSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEBoZWlnaHRdXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAeWVhcnMgXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBAY291bnRyaWVzIFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgQHdpZHRoID0gQCRlbC53aWR0aCgpIC0gMTAwICAjIHkgYXhpcyB3aWR0aCA9IDEwMFxuICAgIGlmIEB5ZWFycyBhbmQgQGNvdW50cmllc1xuICAgICAgY2VsbFNpemUgPSBNYXRoLmZsb29yIEB3aWR0aCAvIEB5ZWFycy5sZW5ndGhcbiAgICAgIEBoZWlnaHQgPSBpZiBjZWxsU2l6ZSA8IDIwIHRoZW4gY2VsbFNpemUgKiBAY291bnRyaWVzLmxlbmd0aCBlbHNlIDIwICogQGNvdW50cmllcy5sZW5ndGhcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIHNldHVwIHNjYWxlcyByYW5nZVxuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGNvbnRhaW5lciBoZWlnaHRcbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAjIGRyYXcgY2VsbHNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbC1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIC5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5kYXRhKEBjZWxsc0RhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsJ1xuICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvcihkLnZhbHVlKVxuICAgICAgLm9uICAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgIC5vbiAgICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICAgLmNhbGwgIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgICMgZHJhdyB5ZWFycyB4IGF4aXNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd4LWF4aXMgYXhpcydcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEB5ZWFycy5maWx0ZXIoKGQpIC0+IGQgJSA1ID09IDApKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXhpcy1pdGVtJ1xuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICAgIC5odG1sICAoZCkgLT4gZFxuICAgICMgZHJhdyBjb3VudHJpZXMgeSBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKVxuICAgIC5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLmRhdGEoQGNvdW50cmllcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICAgIC5odG1sIChkKSA9PiBAZ2V0Q291bnRyeU5hbWUgZFxuICAgICMgZHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhIEBkYXRhLm1hcCgoZCkgLT4ge2NvZGU6IGQuY29kZSwgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvbn0pLmZpbHRlcigoZCkgLT4gIWlzTmFOIGQueWVhcilcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc2NhbGVzXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGNvbnRhaW5lcnNcbiAgICBAY29udGFpbmVyXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQgKyAncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuY2FsbCBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLngtYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueS1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRDZWxsRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IEB4KGQueWVhcikrJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb3VudHJ5KSsncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIHNldE1hcmtlckRpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiBAeShkLmNvZGUpKydweCdcbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IGlmIGQueWVhciA8IEB5ZWFyc1swXSB0aGVuIEB4KEB5ZWFyc1swXSktMSArICdweCcgZWxzZSBpZiBkLnllYXIgPCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXSB0aGVuIEB4KGQueWVhciktMSsncHgnIGVsc2UgQHguYmFuZHdpZHRoKCkrQHgoQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0pKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBvZmZzZXQgICAgICAgICAgID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgY2FzZXNfc3RyICAgICAgICA9IGlmIEBsYW5nID09ICdlcycgdGhlbiAnY2Fzb3MnIGVsc2UgJ2Nhc2VzJ1xuICAgIGNhc2VzX3NpbmdsZV9zdHIgPSBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc28nIGVsc2UgJ2Nhc2UnXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNvdW50cnknXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAueWVhcidcbiAgICAgIC5odG1sIGQueWVhclxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXREZWNpbWFsKGQudmFsdWUsIEBsYW5nKVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgIC5odG1sIGlmIGQuY2FzZXMgIT0gMSB0aGVuIGQuY2FzZXMudG9Mb2NhbGVTdHJpbmcoQGxhbmcpICsgJyAnICsgY2FzZXNfc3RyIGVsc2UgZC5jYXNlcy50b0xvY2FsZVN0cmluZyhAbGFuZykgKyAnICcgKyBjYXNlc19zaW5nbGVfc3RyXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgb2Zmc2V0LmxlZnQgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgb2Zmc2V0LnRvcCAtIChAeS5iYW5kd2lkdGgoKSAqIDAuNSkgLSBAJHRvb2x0aXAuaGVpZ2h0KClcbiAgICAgICdvcGFjaXR5JzogJzEnXG4gICAgcmV0dXJuXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuICAgIHJldHVyblxuXG4gIGdldENvdW50cnlOYW1lOiAoY29kZSkgPT5cbiAgICBjb3VudHJ5ID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIHJldHVybiBpZiBjb3VudHJ5WzBdIHRoZW4gY291bnRyeVswXS5uYW1lIGVsc2UgJydcblxuICBmb3JtYXREZWNpbWFsOiAobnVtYmVyLCBsYW5nKSAtPlxuICAgIHJldHVybiBpZiBudW1iZXIgPCAwLjAwMSB0aGVuIDAgZWxzZSBpZiBudW1iZXIgPj0gMC4xIHRoZW4gbnVtYmVyLnRvRml4ZWQoMSkudG9Mb2NhbGVTdHJpbmcobGFuZykgZWxzZSBpZiBudW1iZXIgPj0gMC4wMSB0aGVuIG51bWJlci50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKGxhbmcpIGVsc2UgbnVtYmVyLnRvRml4ZWQoMykudG9Mb2NhbGVTdHJpbmcobGFuZylcblxuXG5cbiMgVmFjY2luZURpc2Vhc2VHcmFwaCA9IChfaWQpIC0+XG4jICAgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KClcbiMgICBZX0FYSVNfV0lEVEggPSAxMDBcbiMgICAjIE11c3QgYmUgdGhlIGFtZSB2YWx1ZSB0aGFuICN2YWNjaW5lLWRpc2Vhc2UtZ3JhcGggJHBhZGRpbmctbGVmdCBzY3NzIHZhcmlhYmxlXG4jICAgdGhhdCA9IHRoaXNcbiMgICBpZCA9IF9pZFxuIyAgIGRpc2Vhc2UgPSB1bmRlZmluZWRcbiMgICBzb3J0ID0gdW5kZWZpbmVkXG4jICAgbGFuZyA9IHVuZGVmaW5lZFxuIyAgIGRhdGEgPSB1bmRlZmluZWRcbiMgICBkYXRhUG9wdWxhdGlvbiA9IHVuZGVmaW5lZFxuIyAgIGN1cnJlbnREYXRhID0gdW5kZWZpbmVkXG4jICAgY2VsbERhdGEgPSB1bmRlZmluZWRcbiMgICBjb3VudHJpZXMgPSB1bmRlZmluZWRcbiMgICB5ZWFycyA9IHVuZGVmaW5lZFxuIyAgIGNlbGxTaXplID0gdW5kZWZpbmVkXG4jICAgY29udGFpbmVyID0gdW5kZWZpbmVkXG4jICAgeCA9IHVuZGVmaW5lZFxuIyAgIHkgPSB1bmRlZmluZWRcbiMgICB3aWR0aCA9IHVuZGVmaW5lZFxuIyAgIGhlaWdodCA9IHVuZGVmaW5lZFxuIyAgICRlbCA9IHVuZGVmaW5lZFxuIyAgICR0b29sdGlwID0gdW5kZWZpbmVkXG4jICAgIyBQdWJsaWMgTWV0aG9kc1xuXG4jICAgdGhhdC5pbml0ID0gKF9kaXNlYXNlLCBfc29ydCkgLT5cbiMgICAgIGRpc2Vhc2UgPSBfZGlzZWFzZVxuIyAgICAgc29ydCA9IF9zb3J0XG4jICAgICAjY29uc29sZS5sb2coJ1ZhY2NpbmUgR3JhcGggaW5pdCcsIGlkLCBkaXNlYXNlLCBzb3J0KTtcbiMgICAgICRlbCA9ICQoJyMnICsgaWQpXG4jICAgICAkdG9vbHRpcCA9ICRlbC5maW5kKCcudG9vbHRpcCcpXG4jICAgICBsYW5nID0gJGVsLmRhdGEoJ2xhbmcnKVxuIyAgICAgeCA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgeSA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwoZDMuaW50ZXJwb2xhdGVPclJkKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICBjbGVhcigpXG4jICAgICAgIHNldHVwRGF0YSgpXG4jICAgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgZWxzZVxuIyAgICAgICAjIExvYWQgQ1NWc1xuIyAgICAgICBkMy5xdWV1ZSgpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvYXNzZXRzL2RhdGEvZGlzZWFzZXMtY2FzZXMuY3N2JykuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9hc3NldHMvZGF0YS9wb3B1bGF0aW9uLmNzdicpLmF3YWl0IG9uRGF0YVJlYWR5XG4jICAgICB0aGF0XG5cbiMgICB0aGF0Lm9uUmVzaXplID0gLT5cbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICB1cGRhdGVHcmFwaCgpXG4jICAgICB0aGF0XG5cbiMgICBvbkRhdGFSZWFkeSA9IChlcnJvciwgZGF0YV9jc3YsIHBvcHVsYXRpb25fY3N2KSAtPlxuIyAgICAgZGF0YSA9IGRhdGFfY3N2XG4jICAgICBkYXRhUG9wdWxhdGlvbiA9IHBvcHVsYXRpb25fY3N2XG4jICAgICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4jICAgICBkZWxldGUgZGF0YS5jb2x1bW5zXG4jICAgICAjIFdlIGNhbiBkZWZpbmUgYSBmaWx0ZXIgZnVuY3Rpb24gdG8gc2hvdyBvbmx5IHNvbWUgc2VsZWN0ZWQgY291bnRyaWVzXG4jICAgICBpZiB0aGF0LmZpbHRlclxuIyAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIodGhhdC5maWx0ZXIpXG4jICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9IGQuZGlzZWFzZS50b0xvd2VyQ2FzZSgpXG4jICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiMgICAgICAgZC5jYXNlcyA9IHt9XG4jICAgICAgIGQudmFsdWVzID0ge31cbiMgICAgICAgIyBzZXQgdmFsdWUgZXMgY2FzZXMgLzEwMDAgaGFiaXRhbnRzXG4jICAgICAgIHBvcHVsYXRpb25JdGVtID0gcG9wdWxhdGlvbl9jc3YuZmlsdGVyKChjb3VudHJ5KSAtPlxuIyAgICAgICAgIGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiMgICAgICAgKVxuIyAgICAgICBpZiBwb3B1bGF0aW9uSXRlbS5sZW5ndGggPiAwXG4jICAgICAgICAgeWVhciA9IDE5ODBcbiMgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuIyAgICAgICAgICAgaWYgZFt5ZWFyXVxuIyAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4jICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gMTAwMCAqICgrZFt5ZWFyXSAvIHBvcHVsYXRpb24pO1xuIyAgICAgICAgICAgICAgIGQuY2FzZXNbeWVhcl0gPSArZFt5ZWFyXVxuIyAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuIyAgICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiMgICAgICAgICAgIGRlbGV0ZSBkW3llYXJdXG4jICAgICAgICAgICB5ZWFyKytcbiMgICAgICAgZWxzZVxuIyAgICAgICAgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lXG4jICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4jICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+XG4jICAgICAgICAgYSArIGJcbiMgICAgICAgKSwgMClcbiMgICAgICAgcmV0dXJuXG4jICAgICBzZXR1cERhdGEoKVxuIyAgICAgc2V0dXBHcmFwaCgpXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwRGF0YSA9IC0+XG4jICAgICAjIEZpbHRlciBkYXRhIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiMgICAgIGN1cnJlbnREYXRhID0gZGF0YS5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9PSBkaXNlYXNlIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiMgICAgIClcbiMgICAgICMgU29ydCBkYXRhXG4jICAgICBpZiBzb3J0ID09ICd5ZWFyJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGlmIGlzTmFOKGEueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gMSBlbHNlIGlmIGlzTmFOKGIueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gLTEgZWxzZSBiLnllYXJfaW50cm9kdWN0aW9uIC0gKGEueWVhcl9pbnRyb2R1Y3Rpb24pXG4jICAgICBlbHNlIGlmIHNvcnQgPT0gJ2Nhc2VzJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGIudG90YWwgLSAoYS50b3RhbClcbiMgICAgICMgR2V0IGFycmF5IG9mIGNvdW50cnkgbmFtZXNcbiMgICAgIGNvdW50cmllcyA9IGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAgZC5jb2RlXG4jICAgICApXG4jICAgICAjIEdldCBhcnJheSBvZiB5ZWFyc1xuIyAgICAgbWluWWVhciA9IGQzLm1pbihjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1pbiBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgbWF4WWVhciA9IGQzLm1heChjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1heCBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgeWVhcnMgPSBkMy5yYW5nZShtaW5ZZWFyLCBtYXhZZWFyLCAxKVxuIyAgICAgeWVhcnMucHVzaCArbWF4WWVhclxuIyAgICAgI2NvbnNvbGUubG9nKG1pblllYXIsIG1heFllYXIsIHllYXJzKTtcbiMgICAgICNjb25zb2xlLmxvZyhjb3VudHJpZXMpO1xuIyAgICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiMgICAgIGNlbGxzRGF0YSA9IFtdXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiMgICAgICAgICBjZWxsc0RhdGEucHVzaFxuIyAgICAgICAgICAgY291bnRyeTogZC5jb2RlXG4jICAgICAgICAgICBuYW1lOiBkLm5hbWVcbiMgICAgICAgICAgIHllYXI6IHZhbHVlXG4jICAgICAgICAgICBjYXNlczogZC5jYXNlc1t2YWx1ZV1cbiMgICAgICAgICAgIHZhbHVlOiBkLnZhbHVlc1t2YWx1ZV1cbiMgICAgICAgcmV0dXJuXG5cbiMgICAgICMjI1xuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaChmdW5jdGlvbihkKXtcbiMgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuIyAgICAgICB5ZWFycy5mb3JFYWNoKGZ1bmN0aW9uKHllYXIpe1xuIyAgICAgICAgIGlmIChkW3llYXJdKVxuIyAgICAgICAgICAgY291bnRlcisrO1xuIyAgICAgICB9KTtcbiMgICAgICAgaWYoY291bnRlciA8PSAyMCkgLy8geWVhcnMubGVuZ3RoLzIpXG4jICAgICAgICAgY29uc29sZS5sb2coZC5uYW1lICsgJyBoYXMgb25seSB2YWx1ZXMgZm9yICcgKyBjb3VudGVyICsgJyB5ZWFycycpO1xuIyAgICAgfSk7XG4jICAgICAjIyNcblxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cEdyYXBoID0gLT5cbiMgICAgICMgR2V0IGRpbWVuc2lvbnMgKGhlaWdodCBpcyBiYXNlZCBvbiBjb3VudHJpZXMgbGVuZ3RoKVxuIyAgICAgZ2V0RGltZW5zaW9ucygpXG4jICAgICB4LmRvbWFpbih5ZWFycykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIHdpZHRoXG4jICAgICBdXG4jICAgICB5LmRvbWFpbihjb3VudHJpZXMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICBoZWlnaHRcbiMgICAgIF1cbiMgICAgICNjb2xvci5kb21haW4oW2QzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSksIDBdKTtcbiMgICAgIGNvbG9yLmRvbWFpbiBbXG4jICAgICAgIDBcbiMgICAgICAgNFxuIyAgICAgXVxuIyAgICAgI2NvbnNvbGUubG9nKCdNYXhpbXVtIGNhc2VzIHZhbHVlOiAnKyBkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pKTtcbiMgICAgICMgQWRkIHN2Z1xuIyAgICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJyArIGlkICsgJyAuZ3JhcGgtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpXG4jICAgICAjIERyYXcgY2VsbHNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpLnNlbGVjdEFsbCgnLmNlbGwnKS5kYXRhKGNlbGxzRGF0YSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwnKS5zdHlsZSgnYmFja2dyb3VuZCcsIChkKSAtPlxuIyAgICAgICBjb2xvciBkLnZhbHVlXG4jICAgICApLmNhbGwoc2V0Q2VsbERpbWVuc2lvbnMpLm9uKCdtb3VzZW92ZXInLCBvbk1vdXNlT3Zlcikub24gJ21vdXNlb3V0Jywgb25Nb3VzZU91dFxuIyAgICAgIyBEcmF3IHllYXJzIHggYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneC1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKHllYXJzLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZCAlIDUgPT0gMFxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCdsZWZ0JywgKGQpIC0+XG4jICAgICAgIHgoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGRcbiMgICAgICMgRHJhdyBjb3VudHJpZXMgeSBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd5LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoY291bnRyaWVzKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ3RvcCcsIChkKSAtPlxuIyAgICAgICB5KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBnZXRDb3VudHJ5TmFtZSBkXG4jICAgICAjIERyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJykuZGF0YShjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIHtcbiMgICAgICAgICBjb2RlOiBkLmNvZGVcbiMgICAgICAgICB5ZWFyOiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgIH1cbiMgICAgICkuZmlsdGVyKChkKSAtPlxuIyAgICAgICAhaXNOYU4oZC55ZWFyKVxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ21hcmtlcicpLmNhbGwgc2V0TWFya2VyRGltZW5zaW9uc1xuIyAgICAgcmV0dXJuXG5cbiMgICBjbGVhciA9IC0+XG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5yZW1vdmUoKVxuIyAgICAgY29udGFpbmVyLnNlbGVjdEFsbCgnLmF4aXMnKS5yZW1vdmUoKVxuIyAgICAgcmV0dXJuXG5cblxuXG4iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktMS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0wLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG4iLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ1NjYXR0ZXJwbG90IEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS54XSA9ICtkW0BvcHRpb25zLmtleS54XVxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZVBvdygpXG4gICAgICAuZXhwb25lbnQgMC41XG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICBjb25zb2xlLmxvZyAnZ2V0U2NhbGVYRG9tYWluJywgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSldXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIGNvbnNvbGUubG9nICdnZXRTY2FsZVlEb21haW4nLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSlcbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgY29uc29sZS5sb2cgQGRhdGFcbiAgICAjIGRyYXcgcG9pbnRzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAncicsIDZcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgIC5hdHRyICdkeScsICcwLjM3NWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdExhYmVsc0RpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXREb3RzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMYWJlbHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICAjIG92ZXJyaWQgeCBheGlzIHBvc2l0aW9uaW5nXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKSdcbiAgICAiLCIjIE1haW4gc2NyaXB0IGZvciB2YWNjaW5lcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG5cbiAgIyBJbml0IFRvb2x0aXBzXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcblxuXG4gICMgZ2V0IGNvdW50cnkgbmFtZSBhdXhpbGlhciBtZXRob2RcbiAgZ2V0Q291bnRyeU5hbWUgPSAoY291bnRyaWVzLCBjb2RlLCBsYW5nKSAtPlxuICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIGlmIGl0ZW1cbiAgICAgIGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZXJyb3IgJ05vIGNvdW50cnkgbmFtZSBmb3IgY29kZScsIGNvZGVcblxuXG4gICMgVmlkZW8gb2YgbWFwIHBvbGlvIGNhc2VzXG4gIHNldFZpZGVvTWFwUG9saW8gPSAtPlxuICAgIHdyYXBwZXIgPSBQb3Bjb3JuLkhUTUxZb3VUdWJlVmlkZW9FbGVtZW50KCcjdmlkZW8tbWFwLXBvbGlvJylcbiAgICB3cmFwcGVyLnNyYyA9ICdodHRwOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL2wxRjJYZDVGRmxRP2NvbnRyb2xzPTAmc2hvd2luZm89MCZoZD0xJ1xuICAgIHBvcGNvcm4gPSBQb3Bjb3JuKHdyYXBwZXIpXG4gICAgbm90ZXMgPSAyMDE2IC0gMTk4MFxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8PSBub3Rlc1xuICAgICAgcG9wY29ybi5mb290bm90ZVxuICAgICAgICBzdGFydDogIDEuNjIyMiAqIGlcbiAgICAgICAgZW5kOiAgICAxLjYyMjIgKiAoaSArIDEpXG4gICAgICAgIHRleHQ6ICAgMTk4MCArIGlcbiAgICAgICAgdGFyZ2V0OiAndmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJ1xuICAgICAgaSsrXG4gICAgIyBTaG93IGNvdmVyIHdoZW4gdmlkZW8gZW5kZWRcbiAgICB3cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIgJ2VuZGVkJywgKGUpIC0+XG4gICAgICAkKCcudmlkZW8tbWFwLXBvbGlvLWNvdmVyJykuZmFkZUluKClcbiAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nKS5mYWRlVG8gMzAwLCAwXG4gICAgICBwb3Bjb3JuLmN1cnJlbnRUaW1lIDBcbiAgICAjIFNob3cgdmlkZW8gd2hlbiBwbGF5IGJ0biBjbGlja2VkXG4gICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1wbGF5LWJ0bicpLmNsaWNrIChlKSAtPlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBwb3Bjb3JuLnBsYXkoKVxuICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVPdXQoKVxuICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbicpLmZhZGVUbyAzMDAsIDFcblxuXG4gICMgTWVhc2xlcyBXb3JsZCBNYXAgR3JhcGhcbiAgc2V0dXBNZWFzbGVzV29ybGRNYXBHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9tZWFzbGVzLWNhc2VzLXdoby1yZWdpb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvYXNzZXRzL2RhdGEvY291bnRyaWVzLXdoby1yZWdpb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvYXNzZXRzL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgICMgZ2V0IGNhc2VzIG9iamVjdCB3aXRoIHJlZ2lvbiBrZXlcbiAgICAgICAgY2FzZXMgPSB7fVxuICAgICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgY2FzZXNbZC5yZWdpb25dID0gK2QuY2FzZXMqMTAwMDAwXG4gICAgICAgICMgYWRkIGNhc2VzIHRvIGVhY2ggY291bnRyeVxuICAgICAgICBjb3VudHJpZXMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBkLnZhbHVlID0gY2FzZXNbZC5yZWdpb25dXG4gICAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgZGVsZXRlIGQubmFtZV9lc1xuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZW5cbiAgICAgICAgIyBzZXQgZ3JhcGhcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93Lk1hcEdyYXBoKCdtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcsXG4gICAgICAgICAgbWFyZ2luOiBcbiAgICAgICAgICAgIHRvcDogNjBcbiAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgIGxlZ2VuZDogdHJ1ZSlcbiAgICAgICAgZ3JhcGguc2V0RGF0YSBjb3VudHJpZXMsIG1hcFxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBNZWFzbGVzIGNhc2VzIEhlYXRtYXAgR3JhcGhcbiAgc2V0dXBIZWF0TWFwR3JhcGggPSAoaWQsIGRhdGEsIGNvdW50cmllcykgLT5cbiAgICBkYXRhID0gZGF0YVxuICAgICAgLmZpbHRlciAoZCkgLT4gY291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSAhPSAtMSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4gICAgICAuc29ydCAoYSxiKSAtPiBhLnRvdGFsIC0gYi50b3RhbFxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5IZWF0bWFwR3JhcGgoaWQsXG4gICAgICBtYXJnaW46IFxuICAgICAgICByaWdodDogMFxuICAgICAgICBsZWZ0OiAwKVxuICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICMgU29ydCBkYXRhXG4jICAgICBpZiBzb3J0ID09ICd5ZWFyJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGlmIGlzTmFOKGEueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gMSBlbHNlIGlmIGlzTmFOKGIueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gLTEgZWxzZSBiLnllYXJfaW50cm9kdWN0aW9uIC0gKGEueWVhcl9pbnRyb2R1Y3Rpb24pXG4jICAgICBlbHNlIGlmIHNvcnQgPT0gJ2Nhc2VzJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGIudG90YWwgLSAoYS50b3RhbClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVDb25maWRlbmNlQmFyR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaCgndmFjY2luZS1jb25maWRlbmNlLWdyYXBoJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjNcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICduYW1lJ1xuICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgIGlkOiAnY29kZScpXG4gICAgZ3JhcGguZGF0YVBhcnNlciA9IChkYXRhKSAtPlxuICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytsYW5nXVxuICAgICAgICBkZWxldGUgZC5uYW1lX2VzXG4gICAgICAgIGRlbGV0ZSBkLm5hbWVfZW5cbiAgICAgIHJldHVybiBkYXRhXG4gICAgZ3JhcGgubG9hZERhdGEgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvbmZpZGVuY2UuY3N2J1xuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVDb25maWRlbmNlU2NhdHRlcnBsb3RHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvbmZpZGVuY2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICBsZWZ0OiA1MFxuICAgICAgICAgICAgYm90dG9tOiAyMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIHg6ICdnZHAnXG4gICAgICAgICAgICB5OiAnY29uZmlkZW5jZSdcbiAgICAgICAgICAgIGlkOiAnY291bnRyeScpXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzUwMDAsIDIwMDAwLCA0MDAwMCwgNjAwMDBdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtY2FzZXMtbWVhc2xlcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvcG9wdWxhdGlvbi5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX2Nhc2VzLCBkYXRhX3BvcHVsYXRpb24pIC0+XG4gICAgICAgIGRlbGV0ZSBkYXRhX2Nhc2VzLmNvbHVtbnMgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiAgICAgICAgZGF0YV9jYXNlcy5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiAgICAgICAgICAgIGQueWVhcl9pbnRyb2R1Y3Rpb24gPSArZC55ZWFyX2ludHJvZHVjdGlvbi5yZXBsYWNlKCdwcmlvciB0bycsICcnKVxuICAgICAgICAgIGQuY2FzZXMgPSB7fVxuICAgICAgICAgIGQudmFsdWVzID0ge31cbiAgICAgICAgICBkLm5hbWUgPSBnZXRDb3VudHJ5TmFtZSBkYXRhX3BvcHVsYXRpb24sIGQuY29kZSwgbGFuZ1xuICAgICAgICAgICMgc2V0IHZhbHVlcyBhcyBjYXNlcy8xMDAwIGhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICAgICAgICAgICAgeWVhcisrXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiAgICAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuICAgICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+IGEgKyBiKSwgMClcbiAgICAgICAgIyBGaWx0ZXIgYnkgc2VsZWN0ZWQgY291bnRyaWVzICYgZGlzZWFzZVxuICAgICAgICBzZXR1cEhlYXRNYXBHcmFwaCAndmFjY2luZXMtbWVhc2xlcy1ncmFwaC0xJywgZGF0YV9jYXNlcywgWydGSU4nLCdIVU4nLCdQUlQnLCdVUlknLCdNRVgnLCdDT0wnXVxuICAgICAgICBzZXR1cEhlYXRNYXBHcmFwaCAndmFjY2luZXMtbWVhc2xlcy1ncmFwaC0yJywgZGF0YV9jYXNlcywgWydJUlEnLCdCR1InLCdNTkcnLCdaQUYnLCdGUkEnLCdHRU8nXVxuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgIGQzLmNzdiBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICMgVXBkYXRlIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgdmFjY2luZVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICMgVXBkYXRlIGFjdGl2ZSBjb3VudHJpZXNcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yLCAjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5maW5kKCcubGluZS1sYWJlbCwgLmxpbmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgSW1tdW5pemF0aW9uIENvdmVyYWdlIExpbmUgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgY291bnRyaWVzID0gWydGUkEnLCdETksnLCdEWkEnLCdMS0EnXVxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCcsIFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IGJvdHRvbTogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwyNSw1MCw3NSwxMDBdXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMSwyMDAzLDIwMDUsMjAwNywyMDA5LDIwMTEsMjAxMywyMDE1XVxuICAgIGdyYXBoLmFkZE1hcmtlclxuICAgICAgdmFsdWU6IDk1XG4gICAgICBsYWJlbDogaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ05pdmVsIGRlIHJlYmHDsW8nIGVsc2UgJ0hlcmQgaW1tdW5pdHknXG4gICAgICBhbGlnbjogJ2xlZnQnXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBjb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpICE9IC0xKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFdvcmxkIENhc2VzIE11bHRpcGxlIFNtYWxsXG4gIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgZGlzZWFzZXMgPSBbJ2RpcGh0ZXJpYScsICdtZWFzbGVzJywncGVydHVzc2lzJywncG9saW8nLCd0ZXRhbnVzJ11cbiAgICBncmFwaHMgPSBbXVxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OiBcbiAgICAgICAgICAgIHg6ICdkaXNlYXNlJ1xuICAgICAgICAgICAgaWQ6ICdkaXNlYXNlJylcbiAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk4MCwgMjAxNV1cbiAgICAgICAgZ3JhcGgueUF4aXMudGlja3MoMikudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgaWYgZGlzZWFzZSA9PSAnbWVhc2xlcycgb3IgZGlzZWFzZSA9PSAncGVydHVzc2lzJyB0aGVuIG1heFZhbHVlMSBlbHNlIG1heFZhbHVlMl1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkaXNlYXNlX2RhdGFcbiAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgICMgU2V0dXAgY3VycmVudCBjb3VudHJ5IC0+IFRPRE8hISEgd2UgaGF2ZSB0byBnZXQgdXNlciBjb3VudHJ5XG4gICAgICAgIGNvdW50cnkgPSAnRVNQJ1xuICAgICAgICAjIEZpbHRlciBkYXRhXG4gICAgICAgIGV4Y2x1ZGVkQ291bnRyaWVzID0gWydOSVUnLCdDT0snLCdUVVYnLCdOUlUnLCdQTFcnLCdWR0InLCdNQUYnLCdTTVInLCdHSUInLCdUQ0EnLCdMSUUnLCdNQ08nLCdTWE0nLCdGUk8nLCdNSEwnLCdNTlAnLCdBU00nLCdLTkEnLCdHUkwnLCdDWScsJ0JNVScsJ0FORCcsJ0RNQScsJ0lNTicsJ0FURycsJ1NZQycsJ1ZJUicsJ0FCVycsJ0ZTTScsJ1RPTicsJ0dSRCcsJ1ZDVCcsJ0tJUicsJ0NVVycsJ0NISScsJ0dVTScsJ0xDQScsJ1NUUCcsJ1dTTScsJ1ZVVCcsJ05DTCcsJ1BZRicsJ0JSQiddXG4gICAgICAgIGhlcmRJbW11bml0eSA9IFxuICAgICAgICAgICdNQ1YxJzogOTVcbiAgICAgICAgICAnUG9sMyc6IDgwXG4gICAgICAgICAgJ0RUUDMnOiA4MFxuICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGV4Y2x1ZGVkQ291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSA9PSAtMVxuICAgICAgICAjIERhdGEgcGFyc2UgJiBzb3J0aW5nIGZ1bnRpb25zXG4gICAgICAgIGRhdGFfcGFyc2VyID0gKGQpIC0+XG4gICAgICAgICAgb2JqID0gXG4gICAgICAgICAgICBrZXk6ICAgZC5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgZ2V0Q291bnRyeU5hbWUoY291bnRyaWVzLCBkLmNvZGUsIGxhbmcpXG4gICAgICAgICAgICB2YWx1ZTogK2RbJzIwMTUnXVxuICAgICAgICAgIGlmIGQuY29kZSA9PSBjb3VudHJ5XG4gICAgICAgICAgICBvYmouYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgZGF0YV9zb3J0ID0gKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICMgbG9vcCB0aHJvdWdoIGVhY2ggZ3JhcGhcbiAgICAgICAgJCgnLmltbXVuaXphdGlvbi1jb3ZlcmFnZS1kaXNlYXNlLWdyYXBoJykuZWFjaCAtPlxuICAgICAgICAgICRlbCAgICAgPSAkKHRoaXMpXG4gICAgICAgICAgZGlzZWFzZSA9ICRlbC5kYXRhKCdkaXNlYXNlJylcbiAgICAgICAgICB2YWNjaW5lID0gJGVsLmRhdGEoJ3ZhY2NpbmUnKVxuICAgICAgICAgICMgR2V0IGdyYXBoIGRhdGEgJiB2YWx1ZVxuICAgICAgICAgIGdyYXBoX2RhdGEgPSBkYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gdmFjY2luZSBhbmQgZFsnMjAxNSddICE9ICcnKVxuICAgICAgICAgICAgLm1hcChkYXRhX3BhcnNlcilcbiAgICAgICAgICAgIC5zb3J0KGRhdGFfc29ydClcbiAgICAgICAgICBncmFwaF92YWx1ZSA9IGdyYXBoX2RhdGEuZmlsdGVyKChkKSAtPiBkLmtleSA9PSBjb3VudHJ5KVxuICAgICAgICAgICMgU2V0dXAgZ3JhcGhcbiAgICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFyR3JhcGgoZGlzZWFzZSsnLWltbXVuaXphdGlvbi1iYXItZ3JhcGgnLFxuICAgICAgICAgICAgYXNwZWN0UmF0aW86IDAuMjVcbiAgICAgICAgICAgIGxhYmVsOiB0cnVlXG4gICAgICAgICAgICBrZXk6IHg6ICduYW1lJ1xuICAgICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgICB0b3A6IDIwKVxuICAgICAgICAgIG1hcmtlciA9IFxuICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgbGFiZWw6IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgIGlmIHZhY2NpbmUgPT0gJ0RUUDMnXG4gICAgICAgICAgICBtYXJrZXIubGFiZWwgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnUmVjb21lbmRhY2nDs24gT01TJyBlbHNlICdXSE8gcmVjb21tZW5kYXRpb24nXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXIgbWFya2VyXG4gICAgICAgICAgICAuc2V0RGF0YSBncmFwaF9kYXRhXG4gICAgICAgICAgIyBTZXR1cCBncmFwaCB2YWx1ZVxuICAgICAgICAgIGlmIGdyYXBoX3ZhbHVlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICRlbC5maW5kKCcuaW1tdW5pemF0aW9uLWRhdGEnKS5odG1sICc8c3Ryb25nPicgKyBncmFwaF92YWx1ZVswXS52YWx1ZSArICclPC9zdHJvbmc+J1xuICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPiBncmFwaC5vblJlc2l6ZSgpXG4gIFxuICAjIyNcbiAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicsXG4gICAgICAjaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46IFxuICAgICAgICBsZWZ0OiAwXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGJvdHRvbTogMjApXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMCwgMjAwNSwgMjAxMCwgMjAxNV1cbiAgICBncmFwaC55QXhpc1xuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIGdyYXBoLmxvYWREYXRhIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9ndWF0ZW1hbGEtY292ZXJhZ2UtbW1yLmNzdidcbiAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgIGxpbmUgPSBncmFwaC5jb250YWluZXIuc2VsZWN0KCcubGluZScpXG4gICAgICBjb25zb2xlLmxvZyBsaW5lLm5vZGUoKVxuICAgICAgbGVuZ3RoID0gbGluZS5ub2RlKCkuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIGxpbmVcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCBsZW5ndGggKyAnICcgKyBsZW5ndGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIGxlbmd0aClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSg1MDAwKVxuICAgICAgICAgIC5kdXJhdGlvbig1MDAwKVxuICAgICAgICAgIC5lYXNlKGQzLmVhc2VTaW5Jbk91dClcbiAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAwKVxuXG4gIGlmICQoJyNndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJykubGVuZ3RoID4gMFxuICAgIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGgoKVxuICAjIyNcblxuICBpZiAkKCcjdmlkZW8tbWFwLXBvbGlvJykubGVuZ3RoID4gMFxuICAgIHNldFZpZGVvTWFwUG9saW8oKVxuXG4gICMjI1xuICAvLyBWYWNjaW5lIG1hcFxuICBpZiAoJCgnI3ZhY2NpbmUtbWFwJykubGVuZ3RoID4gMCkge1xuICAgIHZhciB2YWNjaW5lX21hcCA9IG5ldyBWYWNjaW5lTWFwKCd2YWNjaW5lLW1hcCcpO1xuICAgIC8vdmFjY2luZV9tYXAuZ2V0RGF0YSA9IHRydWU7IC8vIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgcG9saW8gY2FzZXMgY3N2XG4gICAgLy92YWNjaW5lX21hcC5nZXRQaWN0dXJlU2VxdWVuY2UgPSB0cnVlOyAvLyBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIG1hcCBwaWN0dXJlIHNlcXVlbmNlXG4gICAgdmFjY2luZV9tYXAuaW5pdChiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtcG9saW8tY2FzZXMuY3N2JywgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL21hcC1wb2xpby1jYXNlcy5jc3YnKTtcbiAgICAkKHdpbmRvdykucmVzaXplKCB2YWNjaW5lX21hcC5vblJlc2l6ZSApO1xuICB9XG4gICMjI1xuXG4gIGlmICQoJy52YWNjaW5lcy1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGgoKVxuXG4gICMjI1xuICAjIFZhY2NpbmUgYWxsIGRpc2Vhc2VzIGdyYXBoXG4gIGlmICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMgPSBuZXcgVmFjY2luZURpc2Vhc2VHcmFwaCgndmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJylcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLm9uUmVzaXplXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuICAgICQoJyNkaXNlYXNlLXNlbGVjdG9yIGEnKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgJCh0aGlzKS50YWIgJ3Nob3cnXG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQodGhpcykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICAgcmV0dXJuXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZW9uIG9uIG9yZGVyIHNlbGVjdG9yXG4gICAgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS5jaGFuZ2UgKGQpIC0+XG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQodGhpcykudmFsKClcbiAgIyMjXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGgoKVxuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCgpXG5cbiAgaWYgJCgnI3dvcmxkLWNhc2VzJykubGVuZ3RoID4gMFxuICAgIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCgpXG4gIFxuICBpZiAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGgoKVxuXG4gIGlmICQoJyNtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cE1lYXNsZXNXb3JsZE1hcEdyYXBoKClcblxuICBpZiAkKCcjdmFjY2luZS1jb25maWRlbmNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCgpXG5cbikgalF1ZXJ5Il19
