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
          aspectRatio: 0.5625,
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
      graph.$el.on('draw-complete', function(e) {
        console.log('bar graph draw complete');
        return graph.container.selectAll('.bar').attr('class', function(d) {
          return 'bar bar-' + d.region.toLowerCase();
        });
      });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwibWFpbi12YWNjaW5lcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsY0FBZixFQUErQixPQUEvQjtNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFDWCxhQUFPO0lBUkk7O3dCQWNiLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBQyxDQUFBLEdBQUQsR0FBTyxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBZixDQUFrQixDQUFDLE1BQW5CLENBQTBCLEtBQTFCLENBQ0wsQ0FBQyxJQURJLENBQ0MsT0FERCxFQUNVLElBQUMsQ0FBQSxjQURYLENBRUwsQ0FBQyxJQUZJLENBRUMsUUFGRCxFQUVXLElBQUMsQ0FBQSxlQUZaO2FBR1AsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBWSxHQUFaLENBQ1gsQ0FBQyxJQURVLENBQ0wsV0FESyxFQUNRLFlBQUEsR0FBZSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUEvQixHQUFzQyxHQUF0QyxHQUE0QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUE1RCxHQUFrRSxHQUQxRTtJQUpQOzt3QkFPUixRQUFBLEdBQVUsU0FBQyxHQUFEO01BQ1IsRUFBRSxDQUFDLEdBQUgsQ0FBTyxHQUFQLEVBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxJQUFSO1VBQ1YsS0FBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsYUFBYjtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7UUFGVTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWjtBQUdBLGFBQU87SUFKQzs7d0JBTVYsT0FBQSxHQUFTLFNBQUMsSUFBRDtNQUNQLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO01BQ1IsSUFBQyxDQUFBLFVBQUQsQ0FBQTtNQUNBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFaO1FBQ0UsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQURGOztNQUVBLElBQUMsQ0FBQSxXQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsZUFBYjtBQUNBLGFBQU87SUFSQTs7d0JBV1QsVUFBQSxHQUFZLFNBQUMsSUFBRDtBQUNWLGFBQU87SUFERzs7d0JBSVosUUFBQSxHQUFVLFNBQUE7QUFDUixhQUFPO0lBREM7O3dCQVFWLFNBQUEsR0FBVyxTQUFBO0FBQ1QsYUFBTztJQURFOzt3QkFHWCxVQUFBLEdBQVksU0FBQTtNQUVWLElBQUMsQ0FBQSxDQUFDLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBVjtNQUNBLElBQUMsQ0FBQSxDQUFDLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBVjtNQUVBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFFBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLGdCQUZULENBR0UsQ0FBQyxJQUhILENBR1EsSUFBQyxDQUFBLEtBSFQsRUFERjs7TUFNQSxJQUFHLElBQUMsQ0FBQSxLQUFKO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLEdBQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixRQURqQixDQUVFLENBQUMsSUFGSCxDQUVRLElBQUMsQ0FBQSxnQkFGVCxDQUdFLENBQUMsSUFISCxDQUdRLElBQUMsQ0FBQSxLQUhULEVBREY7O0FBS0EsYUFBTztJQWhCRzs7d0JBbUJaLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLGFBQU8sQ0FBQyxDQUFELEVBQUksSUFBQyxDQUFBLEtBQUw7SUFETzs7d0JBSWhCLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLGFBQU8sQ0FBQyxJQUFDLENBQUEsTUFBRixFQUFVLENBQVY7SUFETzs7d0JBSWhCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU87SUFEUTs7d0JBSWpCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU87SUFEUTs7d0JBSWpCLFVBQUEsR0FBWSxTQUFBO0FBQ1YsYUFBTztJQURHOzt3QkFPWixTQUFBLEdBQVcsU0FBQyxNQUFEO01BQ1QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsYUFBYixFQUE0QixNQUE1QixDQUFkO0FBQ0EsYUFBTztJQUZFOzt3QkFJWCxXQUFBLEdBQWEsU0FBQTtNQUVYLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixTQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxPQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLFFBSGpCLENBSUUsQ0FBQyxJQUpILENBSVEsSUFBQyxDQUFBLGVBSlQ7YUFNQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsZUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsT0FEVCxDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLE1BRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsT0FIUixFQUdpQixjQUhqQixDQUlFLENBQUMsSUFKSCxDQUlRLGFBSlIsRUFJdUIsU0FBQyxDQUFEO1FBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixVQUFwQjtpQkFBb0MsU0FBcEM7U0FBQSxNQUFrRCxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsT0FBZDtpQkFBMkIsTUFBM0I7U0FBQSxNQUFBO2lCQUFzQyxRQUF0Qzs7TUFBekQsQ0FKdkIsQ0FLRSxDQUFDLElBTEgsQ0FLUSxJQUxSLEVBS2MsU0FBQyxDQUFEO1FBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjtpQkFBc0MsVUFBdEM7U0FBQSxNQUFBO2lCQUFxRCxFQUFyRDs7TUFBUCxDQUxkLENBTUUsQ0FBQyxJQU5ILENBTVEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDO01BQVQsQ0FOUixDQU9FLENBQUMsSUFQSCxDQU9RLElBQUMsQ0FBQSxnQkFQVDtJQVJXOzt3QkFpQmIsZUFBQSxHQUFpQixTQUFDLE9BQUQ7YUFDZixPQUNFLENBQUMsSUFESCxDQUNRLElBRFIsRUFDYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEVBQXRDO1dBQUEsTUFBQTttQkFBNkMsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUE3Qzs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZCxDQUVFLENBQUMsSUFGSCxDQUVRLElBRlIsRUFFYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdEM7V0FBQSxNQUFBO21CQUF1RCxFQUF2RDs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGZCxDQUdFLENBQUMsSUFISCxDQUdRLElBSFIsRUFHYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxNQUF2QztXQUFBLE1BQUE7bUJBQWtELEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBbEQ7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSGQsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUpSLEVBSWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFlBQXBCO21CQUFzQyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxLQUFMLEVBQXRDO1dBQUEsTUFBQTttQkFBdUQsS0FBQyxDQUFBLE9BQXhEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpkO0lBRGU7O3dCQU9qQixnQkFBQSxHQUFrQixTQUFDLE9BQUQ7YUFDaEIsT0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFlBQXBCO1lBQXVDLElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxPQUFkO3FCQUEyQixLQUFDLENBQUEsTUFBNUI7YUFBQSxNQUFBO3FCQUF1QyxFQUF2QzthQUF2QztXQUFBLE1BQUE7bUJBQXVGLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdkY7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxHQUZSLEVBRWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFlBQXBCO21CQUFzQyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxLQUFMLEVBQXRDO1dBQUEsTUFBQTttQkFBdUQsS0FBQyxDQUFBLE9BQXhEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZiO0lBRGdCOzt3QkFTbEIsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLHFCQUFELENBQUE7QUFDQSxhQUFPO0lBSEM7O3dCQUtWLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBRyxJQUFDLENBQUEsR0FBSjtRQUNFLElBQUMsQ0FBQSxjQUFELEdBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBO1FBQ25CLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUM7UUFDOUMsSUFBQyxDQUFBLEtBQUQsR0FBbUIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBbEMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDNUUsSUFBQyxDQUFBLE1BQUQsR0FBbUIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbkMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FKOUU7O0FBS0EsYUFBTztJQU5NOzt3QkFTZixxQkFBQSxHQUF1QixTQUFBO01BRXJCLElBQUMsQ0FBQSxHQUNDLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDa0IsSUFBQyxDQUFBLGNBRG5CLENBRUUsQ0FBQyxJQUZILENBRVEsUUFGUixFQUVrQixJQUFDLENBQUEsZUFGbkI7TUFJQSxJQUFHLElBQUMsQ0FBQSxDQUFKO1FBQ0UsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILENBQVMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFULEVBREY7O01BRUEsSUFBRyxJQUFDLENBQUEsQ0FBSjtRQUNFLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxDQUFTLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBVCxFQURGOztNQUdBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUlBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxlQURUO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGVBQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGdCQURUO0FBRUEsYUFBTztJQXhCYzs7d0JBMEJ2QixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLGNBQUEsR0FBZSxJQUFDLENBQUEsTUFBaEIsR0FBdUIsR0FBbkQ7SUFEZ0I7O3dCQUdsQixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLFlBQUEsR0FBYSxJQUFDLENBQUEsS0FBZCxHQUFvQixLQUFoRDtJQURnQjs7d0JBT2xCLFFBQUEsR0FBVSxTQUFBO0FBQ1IsYUFBTyxDQUFFLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtJQUREOzt3QkFHVixRQUFBLEdBQVUsU0FBQTtBQUNSLGFBQU8sQ0FBRSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7SUFERDs7Ozs7QUFwTlo7OztBQ0FBO0FBQUEsTUFBQTs7OztFQUFNLE1BQU0sQ0FBQzs7O0lBTUUsa0JBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7Ozs7O01BQ1gsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEVBQXpCLEVBQTZCLE9BQTdCO01BQ0EsMENBQU0sRUFBTixFQUFVLE9BQVY7QUFDQSxhQUFPO0lBSEk7O3VCQVNiLFVBQUEsR0FBWSxTQUFDLElBQUQ7TUFDVixJQUFJLENBQUMsT0FBTCxDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUNYLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUYsR0FBb0IsQ0FBQyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtRQURaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO0FBRUEsYUFBTztJQUhHOzt1QkFLWixTQUFBLEdBQVcsU0FBQTtNQUVULElBQUMsQ0FBQSxDQUFELEdBQUssRUFBRSxDQUFDLFNBQUgsQ0FBQSxDQUNILENBQUMsS0FERSxDQUNJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FESixDQUVILENBQUMsWUFGRSxDQUVXLEdBRlgsQ0FHSCxDQUFDLFlBSEUsQ0FHVyxDQUhYO01BS0wsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsV0FBSCxDQUFBLENBQ0gsQ0FBQyxLQURFLENBQ0ksSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQURKO0FBRUwsYUFBTztJQVRFOzt1QkFXWCxlQUFBLEdBQWlCLFNBQUE7QUFDZixhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVY7SUFEUTs7dUJBR2pCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU87UUFBQyxDQUFELEVBQUksRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFDLENBQUEsSUFBUixFQUFjLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBQUo7O0lBRFE7O3VCQUdqQixTQUFBLEdBQVcsU0FBQTtNQUVULElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixNQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxJQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLFNBQUMsQ0FBRDtRQUFPLElBQUcsQ0FBQyxDQUFDLE1BQUw7aUJBQWlCLGFBQWpCO1NBQUEsTUFBQTtpQkFBbUMsTUFBbkM7O01BQVAsQ0FIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUpSLEVBSWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmpCLENBS0UsQ0FBQyxJQUxILENBS1EsSUFBQyxDQUFBLGdCQUxUO01BTUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLEVBREgsQ0FDUSxXQURSLEVBQ3FCLElBQUMsQ0FBQSxXQUR0QixDQUVFLENBQUMsRUFGSCxDQUVRLFVBRlIsRUFFb0IsSUFBQyxDQUFBLFVBRnJCLEVBREY7O01BSUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVo7UUFFRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsY0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsSUFEVCxDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLE1BRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsT0FIUixFQUdpQixTQUFDLENBQUQ7VUFBTyxJQUFHLENBQUMsQ0FBQyxNQUFMO21CQUFpQixxQkFBakI7V0FBQSxNQUFBO21CQUEyQyxjQUEzQzs7UUFBUCxDQUhqQixDQUlFLENBQUMsSUFKSCxDQUlRLElBSlIsRUFJaUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFPLGNBQUEsR0FBZSxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtVQUF4QjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKakIsQ0FLRSxDQUFDLElBTEgsQ0FLUSxJQUxSLEVBS2lCLFFBTGpCLENBTUUsQ0FBQyxJQU5ILENBTVEsYUFOUixFQU11QixRQU52QixDQU9FLENBQUMsSUFQSCxDQU9RLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVBSLENBUUUsQ0FBQyxJQVJILENBUVEsSUFBQyxDQUFBLHNCQVJUO1FBVUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLGNBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsTUFBTDttQkFBaUIscUJBQWpCO1dBQUEsTUFBQTttQkFBMkMsY0FBM0M7O1FBQVAsQ0FIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUpSLEVBSWlCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxjQUFBLEdBQWUsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7VUFBeEI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmpCLENBS0UsQ0FBQyxJQUxILENBS1EsSUFMUixFQUtpQixRQUxqQixDQU1FLENBQUMsSUFOSCxDQU1RLGFBTlIsRUFNdUIsUUFOdkIsQ0FPRSxDQUFDLElBUEgsQ0FPUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FQUixDQVFFLENBQUMsSUFSSCxDQVFRLElBQUMsQ0FBQSxzQkFSVCxFQVpGOztBQXFCQSxhQUFPO0lBakNFOzt1QkFtQ1gscUJBQUEsR0FBdUIsU0FBQTtNQUNyQixrREFBQTtNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixNQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxnQkFEVDtNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixjQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxzQkFEVDtNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixjQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxzQkFEVDtBQUVBLGFBQU87SUFUYzs7dUJBV3ZCLGdCQUFBLEdBQWtCLFNBQUMsT0FBRDthQUNoQixPQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGxCLENBRUUsQ0FBQyxJQUZILENBRVEsR0FGUixFQUVrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUw7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGbEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxRQUhSLEVBR2tCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxNQUFELEdBQVUsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQWpCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhsQixDQUlFLENBQUMsSUFKSCxDQUlRLE9BSlIsRUFJa0IsSUFBQyxDQUFBLENBQUMsQ0FBQyxTQUFILENBQUEsQ0FKbEI7SUFEZ0I7O3VCQU9sQixzQkFBQSxHQUF3QixTQUFDLE9BQUQ7YUFDdEIsT0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMLENBQUEsR0FBd0IsS0FBQyxDQUFBLENBQUMsQ0FBQyxTQUFILENBQUEsQ0FBQSxHQUFpQjtRQUFoRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEYixDQUVFLENBQUMsSUFGSCxDQUVRLEdBRlIsRUFFYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUE7UUFBUjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGYjtJQURzQjs7dUJBS3hCLHNCQUFBLEdBQXdCLFNBQUMsT0FBRDthQUN0QixPQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUwsQ0FBQSxHQUF3QixLQUFDLENBQUEsQ0FBQyxDQUFDLFNBQUgsQ0FBQSxDQUFBLEdBQWlCO1FBQWhEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURiLENBRUUsQ0FBQyxJQUZILENBRVEsR0FGUixFQUVhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBTDtRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZiO0lBRHNCOzt1QkFLeEIsV0FBQSxHQUFhLFNBQUMsQ0FBRDtNQUNYLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixlQUFBLEdBQWdCLENBQUUsQ0FBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiLENBQXBDLENBQ0UsQ0FBQyxPQURILENBQ1csUUFEWCxFQUNxQixJQURyQjthQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixlQUFBLEdBQWdCLENBQUUsQ0FBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiLENBQXBDLENBQ0UsQ0FBQyxPQURILENBQ1csUUFEWCxFQUNxQixJQURyQjtJQUhXOzt1QkFNYixVQUFBLEdBQVksU0FBQyxDQUFEO01BQ1YsSUFBQSxDQUFPLENBQUMsQ0FBQyxNQUFUO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGVBQUEsR0FBZ0IsQ0FBRSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWIsQ0FBcEMsQ0FDRSxDQUFDLE9BREgsQ0FDVyxRQURYLEVBQ3FCLEtBRHJCO2VBRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGVBQUEsR0FBZ0IsQ0FBRSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWIsQ0FBcEMsQ0FDRSxDQUFDLE9BREgsQ0FDVyxRQURYLEVBQ3FCLEtBRHJCLEVBSEY7O0lBRFU7Ozs7S0ExR2dCLE1BQU0sQ0FBQztBQUFyQzs7O0FDQUE7QUFBQSxNQUFBOzs7O0VBQU0sTUFBTSxDQUFDOzs7d0JBR1gsT0FBQSxHQUFTLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBVjs7SUFNSSxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7Ozs7TUFDWCxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosRUFBMEIsRUFBMUIsRUFBOEIsT0FBOUI7TUFDQSwyQ0FBTSxFQUFOLEVBQVUsT0FBVjtBQUNBLGFBQU87SUFISTs7d0JBU2IsT0FBQSxHQUFTLFNBQUMsSUFBRDtNQUNQLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWO01BQ1QsdUNBQU0sSUFBTjtBQUNBLGFBQU87SUFIQTs7d0JBS1QsUUFBQSxHQUFVLFNBQUMsSUFBRDtBQUNSLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixFQUFFLENBQUMsSUFBSCxDQUFRLElBQUssQ0FBQSxDQUFBLENBQWIsQ0FBZ0IsQ0FBQyxPQUFqQixDQUF5QixTQUFDLENBQUQ7UUFDdkIsSUFBRyxDQUFDLENBQUo7aUJBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFDLENBQVosRUFERjs7TUFEdUIsQ0FBekI7QUFHQSxhQUFPLEtBQUssQ0FBQyxJQUFOLENBQUE7SUFMQzs7d0JBT1YsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFDWCxDQUFDLENBQUMsTUFBRixHQUFXO2lCQUNYLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLFNBQUMsSUFBRDtZQUNiLElBQUcsQ0FBRSxDQUFBLElBQUEsQ0FBTDtjQUNFLENBQUMsQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFULEdBQWlCLENBQUMsQ0FBRSxDQUFBLElBQUEsRUFEdEI7O21CQUlBLE9BQU8sQ0FBRSxDQUFBLElBQUE7VUFMSSxDQUFmO1FBRlc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7QUFRQSxhQUFPO0lBVEc7O3dCQVdaLFNBQUEsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsV0FBSCxDQUFBLENBQ0gsQ0FBQyxLQURFLENBQ0ksSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQURKO01BR0wsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsV0FBSCxDQUFBLENBQ0gsQ0FBQyxLQURFLENBQ0ksSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQURKO01BR0wsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxDQUFmLENBQ1AsQ0FBQyxVQURNLENBQ0ssRUFBRSxDQUFDLE1BQUgsQ0FBVSxFQUFWLENBREw7TUFFVCxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBQyxDQUFBLENBQWIsQ0FDUCxDQUFDLFFBRE0sQ0FDRyxJQUFDLENBQUEsS0FESjtNQUdULElBQUMsQ0FBQSxJQUFELEdBQVEsRUFBRSxDQUFDLElBQUgsQ0FBQSxDQUNOLENBQUMsS0FESyxDQUNDLEVBQUUsQ0FBQyxlQURKLENBRU4sQ0FBQyxDQUZLLENBRUgsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFOO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRkcsQ0FHTixDQUFDLENBSEssQ0FHSCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxLQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSEc7TUFLUixJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBWjtRQUNFLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFBRSxDQUFDLElBQUgsQ0FBQSxDQUNOLENBQUMsS0FESyxDQUNDLEVBQUUsQ0FBQyxlQURKLENBRU4sQ0FBQyxDQUZLLENBRUYsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLENBQUMsR0FBTjtVQUFQO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZFLENBR04sQ0FBQyxFQUhLLENBR0YsSUFBQyxDQUFBLE1BSEMsQ0FJTixDQUFDLEVBSkssQ0FJRixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTDtVQUFQO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpFLEVBRFY7O0FBTUEsYUFBTztJQXhCRTs7d0JBMEJYLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU8sQ0FBQyxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUixFQUFZLElBQUMsQ0FBQSxLQUFNLENBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWMsQ0FBZCxDQUFuQjtJQURROzt3QkFHakIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTztRQUFDLENBQUQsRUFBSSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQUMsQ0FBQSxJQUFSLEVBQWMsU0FBQyxDQUFEO2lCQUFPLEVBQUUsQ0FBQyxHQUFILENBQU8sRUFBRSxDQUFDLE1BQUgsQ0FBVSxDQUFDLENBQUMsTUFBWixDQUFQO1FBQVAsQ0FBZCxDQUFKOztJQURROzt3QkFHakIsU0FBQSxHQUFXLFNBQUE7TUFFVCxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsUUFBbEIsQ0FBMkIsQ0FBQyxNQUE1QixDQUFBO01BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FDUCxDQUFDLElBRE0sQ0FDRCxPQURDLEVBQ1EsT0FEUjtNQUdULElBQUMsQ0FBQSxTQUFELENBQUE7TUFFQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBWjtRQUNFLElBQUMsQ0FBQSxTQUFELENBQUEsRUFERjs7TUFHQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBWjtRQUNFLElBQUMsQ0FBQSxVQUFELENBQUEsRUFERjs7TUFHQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBWjtRQUNFLElBQUMsQ0FBQSxrQkFBRCxDQUFBO1FBR0EsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQUpGOztBQUtBLGFBQU87SUFwQkU7O3dCQXNCWCxxQkFBQSxHQUF1QixTQUFBO01BQ3JCLG1EQUFBO01BRUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyxJQUFDLENBQUEsTUFBVixFQURGOztNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFnQixJQUFDLENBQUEsS0FBakI7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsT0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsSUFBQyxDQUFBLElBRGQ7TUFFQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBWjtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixPQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDYSxJQUFDLENBQUEsSUFEZCxFQURGOztNQUdBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFaO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLGFBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGtCQURULEVBREY7O01BR0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsVUFBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsb0JBRFQ7UUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsYUFBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsb0JBRFQsRUFIRjs7QUFLQSxhQUFPO0lBckJjOzt3QkF1QnZCLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQWlCLE9BQWpCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsTUFIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUpSLEVBSWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLE9BQUEsR0FBVSxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUFuQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKakIsQ0FLRSxDQUFDLEtBTEgsQ0FLUyxTQUFDLENBQUQ7QUFBTyxlQUFPLEVBQUUsQ0FBQyxPQUFILENBQVcsQ0FBQyxDQUFDLE1BQWI7TUFBZCxDQUxULENBTUUsQ0FBQyxJQU5ILENBTVEsR0FOUixFQU1hLElBQUMsQ0FBQSxJQU5kO0lBRFM7O3dCQVNYLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQWlCLE9BQWpCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdTLE9BSFQsRUFHa0IsTUFIbEIsQ0FJRSxDQUFDLElBSkgsQ0FJUyxJQUpULEVBSWtCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLE9BQUEsR0FBVSxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUFuQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKbEIsQ0FLRSxDQUFDLEtBTEgsQ0FLUyxTQUFDLENBQUQ7ZUFBTyxFQUFFLENBQUMsT0FBSCxDQUFXLENBQUMsQ0FBQyxNQUFiO01BQVAsQ0FMVCxDQU1FLENBQUMsSUFOSCxDQU1RLEdBTlIsRUFNYSxJQUFDLENBQUEsSUFOZDtJQURTOzt3QkFTWCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFpQixhQUFqQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxJQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLFlBSGpCLENBSUUsQ0FBQyxJQUpILENBSVEsSUFKUixFQUlpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxhQUFBLEdBQWMsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7UUFBdkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmpCLENBS0UsQ0FBQyxJQUxILENBS1EsYUFMUixFQUt1QixLQUx2QixDQU1FLENBQUMsSUFOSCxDQU1RLElBTlIsRUFNYyxVQU5kLENBT0UsQ0FBQyxJQVBILENBT1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7UUFBVDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FQUixDQVFFLENBQUMsSUFSSCxDQVFRLElBQUMsQ0FBQSxrQkFSVDtJQURVOzt3QkFXWixrQkFBQSxHQUFvQixTQUFBO01BQ2xCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixtQkFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsSUFEVCxDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLFFBRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsSUFIUixFQUdpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxtQkFBQSxHQUFvQixDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUE3QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxPQUpSLEVBSWlCLGtCQUpqQixDQUtFLENBQUMsSUFMSCxDQUtRLEdBTFIsRUFLYSxDQUxiLENBTUUsQ0FBQyxLQU5ILENBTVMsU0FOVCxFQU1vQixNQU5wQjtNQU9BLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixNQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsWUFEakIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUZSLEVBRWMsUUFGZCxDQUdFLENBQUMsS0FISCxDQUdTLFNBSFQsRUFHb0IsTUFIcEIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUFDLENBQUEsb0JBSlQ7TUFLQSxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixLQUFnQixDQUFuQjtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixNQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsa0JBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsYUFGUixFQUV1QixRQUZ2QixDQUdFLENBQUMsSUFISCxDQUdRLElBSFIsRUFHYyxRQUhkLENBSUUsQ0FBQyxLQUpILENBSVMsU0FKVCxFQUlvQixNQUpwQixFQURGOztJQWJrQjs7d0JBb0JwQixlQUFBLEdBQWlCLFNBQUE7YUFDZixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsTUFBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFNBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLG9CQUZULENBR0UsQ0FBQyxFQUhILENBR00sV0FITixFQUdtQixJQUFDLENBQUEsV0FIcEIsQ0FJRSxDQUFDLEVBSkgsQ0FJTSxVQUpOLEVBSW1CLElBQUMsQ0FBQSxVQUpwQixDQUtFLENBQUMsRUFMSCxDQUtNLFdBTE4sRUFLbUIsSUFBQyxDQUFBLFdBTHBCO0lBRGU7O3dCQVFqQixrQkFBQSxHQUFvQixTQUFDLE9BQUQ7YUFDbEIsT0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsSUFBQyxDQUFBLEtBRGQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxHQUZSLEVBRWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsTUFBTyxDQUFBLEtBQUMsQ0FBQSxLQUFNLENBQUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWMsQ0FBZCxDQUFQLENBQVo7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGYjtJQURrQjs7d0JBS3BCLG9CQUFBLEdBQXNCLFNBQUMsT0FBRDthQUNwQixPQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsSUFBQyxDQUFBLEtBRGxCLENBRUUsQ0FBQyxJQUZILENBRVEsUUFGUixFQUVrQixJQUFDLENBQUEsTUFGbkI7SUFEb0I7O3dCQUt0QixVQUFBLEdBQVksU0FBQyxDQUFEO01BQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsVUFBYjthQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFGVTs7d0JBSVosV0FBQSxHQUFhLFNBQUMsQ0FBRDtBQUNYLFVBQUE7TUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQWxCO01BQ1gsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsUUFBUyxDQUFBLENBQUEsQ0FBbkIsQ0FBWDtNQUNQLElBQUcsSUFBQSxLQUFRLElBQUMsQ0FBQSxXQUFaO1FBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsYUFBYixFQUE0QixJQUE1QjtlQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUZGOztJQUhXOzt3QkFPYixRQUFBLEdBQVUsU0FBQyxJQUFEO01BQ1IsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFrQixDQUFDLElBQUQsQ0FBbEI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsU0FBbEIsQ0FDRSxDQUFDLFNBREgsQ0FDYSxPQURiLENBRUUsQ0FBQyxLQUZILENBRVMsU0FGVCxFQUVvQixNQUZwQjtNQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixtQkFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEseUJBQUQsQ0FBMkIsQ0FBM0I7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUjthQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixhQUFsQixDQUNFLENBQUMsS0FESCxDQUNTLFNBRFQsRUFDb0IsT0FEcEIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxHQUZSLEVBRWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxXQUFKLENBQVgsQ0FGYixDQUdFLENBQUMsSUFISCxDQUdRLElBQUMsQ0FBQSxXQUhUO0lBUlE7O3dCQWFWLFNBQUEsR0FBVyxTQUFBO01BQ1QsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLG1CQUFyQixDQUNFLENBQUMsS0FESCxDQUNTLFNBRFQsRUFDb0IsTUFEcEI7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsbUJBQXJCLENBQ0UsQ0FBQyxLQURILENBQ1MsU0FEVCxFQUNvQixNQURwQjtNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFsQixDQUNFLENBQUMsU0FESCxDQUNhLE9BRGIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxTQUZULEVBRW9CLE9BRnBCO2FBR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGFBQWxCLENBQ0UsQ0FBQyxLQURILENBQ1MsU0FEVCxFQUNvQixNQURwQjtJQVJTOzt3QkFXWCx5QkFBQSxHQUEyQixTQUFDLElBQUQ7QUFFekIsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUE7QUFDUixhQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLElBQWYsQ0FBQSxLQUF3QixDQUFDLENBQXpCLElBQThCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQTFEO1FBQ0UsSUFBQTtNQURGO01BRUEsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUVmLEtBQUEsR0FBUSxFQUFFLENBQUMsTUFBSCxDQUFVLG9CQUFBLEdBQXFCLElBQUssQ0FBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiLENBQXBDO01BQ1IsS0FBQSxHQUFRLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixtQkFBckI7TUFFUixJQUFBLENBQU8sSUFBSSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQW5CO1FBQ0UsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLE1BQXZCO1FBQ0EsS0FBSyxDQUFDLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLE1BQXZCO0FBQ0EsZUFIRjs7TUFLQSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQVosRUFBdUIsT0FBdkI7TUFDQSxLQUFLLENBQUMsS0FBTixDQUFZLFNBQVosRUFBdUIsT0FBdkI7TUFFQSxLQUNFLENBQUMsSUFESCxDQUNRLElBRFIsRUFDYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLElBQUg7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZCxDQUVFLENBQUMsSUFGSCxDQUVRLElBRlIsRUFFYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQWY7bUJBQTBCLEtBQUMsQ0FBQSxDQUFELENBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQWYsRUFBMUI7V0FBQSxNQUFBO21CQUFxRCxFQUFyRDs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGZDthQUlBLEtBQ0UsQ0FBQyxJQURILENBQ1EsR0FEUixFQUNhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsSUFBSDtRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURiLENBRUUsQ0FBQyxJQUZILENBRVEsR0FGUixFQUVhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxJQUFJLENBQUMsTUFBTyxDQUFBLElBQUEsQ0FBZjttQkFBMEIsS0FBQyxDQUFBLENBQUQsQ0FBRyxJQUFJLENBQUMsTUFBTyxDQUFBLElBQUEsQ0FBZixFQUExQjtXQUFBLE1BQUE7bUJBQXFELEVBQXJEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZiLENBR0UsQ0FBQyxJQUhILENBR1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLElBQUksQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFmO21CQUEwQixLQUFDLENBQUEsT0FBRCxDQUFTLElBQUksQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFyQixFQUExQjtXQUFBLE1BQUE7bUJBQTJELEdBQTNEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhSO0lBdEJ5Qjs7d0JBMkIzQixvQkFBQSxHQUFzQixTQUFDLE9BQUQ7YUFDcEIsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiLEVBQWtCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQUQsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUF4QixHQUE0QixDQUF2QyxDQUFsQjtJQURvQjs7OztLQXZQTyxNQUFNLENBQUM7QUFBdEM7OztBQ0FBO0FBQUEsTUFBQTs7OztFQUFNLE1BQU0sQ0FBQzs7O0lBS0Usc0JBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7Ozs7Ozs7TUFDWCxPQUFPLENBQUMsR0FBUixDQUFZLGVBQVosRUFBNkIsRUFBN0IsRUFBaUMsT0FBakM7TUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZjtNQUNSLDhDQUFNLEVBQU4sRUFBVSxPQUFWO0FBQ0EsYUFBTztJQUpJOzsyQkFVYixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxHQUFELEdBQWE7TUFDYixJQUFDLENBQUEsU0FBRCxHQUFhLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFMLEdBQVEscUJBQWxCO2FBQ2IsSUFBQyxDQUFBLFFBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxVQUFWO0lBSFA7OzJCQUtSLE9BQUEsR0FBUyxTQUFDLElBQUQ7TUFFUCxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtNQUVULElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUM7TUFBVCxDQUFUO01BRWIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQWQ7TUFDYixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtNQUNSLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7QUFDQSxhQUFPO0lBWkE7OzJCQWNULFFBQUEsR0FBVSxTQUFDLElBQUQ7QUFDUixVQUFBO01BQUEsT0FBQSxHQUFVLEVBQUUsQ0FBQyxHQUFILENBQU8sSUFBUCxFQUFhLFNBQUMsQ0FBRDtlQUFPLEVBQUUsQ0FBQyxHQUFILENBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxDQUFDLENBQUMsTUFBVixDQUFQO01BQVAsQ0FBYjtNQUNWLE9BQUEsR0FBVSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQVAsRUFBYSxTQUFDLENBQUQ7ZUFBTyxFQUFFLENBQUMsR0FBSCxDQUFPLEVBQUUsQ0FBQyxJQUFILENBQVEsQ0FBQyxDQUFDLE1BQVYsQ0FBUDtNQUFQLENBQWI7TUFDVixLQUFBLEdBQVEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxPQUFULEVBQWtCLE9BQWxCLEVBQTJCLENBQTNCO01BQ1IsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFDLE9BQVo7QUFDQSxhQUFPO0lBTEM7OzJCQU9WLFlBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixVQUFBO01BQUEsU0FBQSxHQUFZO01BQ1osSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLENBQUQ7QUFDWCxZQUFBO0FBQUE7YUFBQSxpQkFBQTt1QkFDRSxTQUFTLENBQUMsSUFBVixDQUNFO1lBQUEsT0FBQSxFQUFTLENBQUMsQ0FBQyxJQUFYO1lBQ0EsSUFBQSxFQUFTLENBQUMsQ0FBQyxJQURYO1lBRUEsSUFBQSxFQUFTLEtBRlQ7WUFHQSxLQUFBLEVBQVMsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxLQUFBLENBSGpCO1lBSUEsS0FBQSxFQUFTLENBQUMsQ0FBQyxNQUFPLENBQUEsS0FBQSxDQUpsQjtXQURGO0FBREY7O01BRFcsQ0FBYjtBQVFBLGFBQU87SUFWSzs7MkJBWWQsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFDWCxDQUFDLENBQUMsTUFBRixHQUFXO2lCQUNYLEtBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFlLFNBQUMsSUFBRDtZQUNiLElBQUcsQ0FBRSxDQUFBLElBQUEsQ0FBTDtjQUNFLENBQUMsQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFULEdBQWlCLENBQUMsQ0FBRSxDQUFBLElBQUEsRUFEdEI7O21CQUlBLE9BQU8sQ0FBRSxDQUFBLElBQUE7VUFMSSxDQUFmO1FBRlc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7QUFRQSxhQUFPO0lBVEc7OzJCQVdaLFNBQUEsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsU0FBSCxDQUFBLENBQ0gsQ0FBQyxPQURFLENBQ00sQ0FETixDQUVILENBQUMsWUFGRSxDQUVXLENBRlgsQ0FHSCxDQUFDLFlBSEUsQ0FHVyxDQUhYLENBSUgsQ0FBQyxLQUpFLENBSUksSUFKSixDQUtILENBQUMsS0FMRSxDQUtJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FMSjtNQU9MLElBQUMsQ0FBQSxDQUFELEdBQUssRUFBRSxDQUFDLFNBQUgsQ0FBQSxDQUNILENBQUMsT0FERSxDQUNNLENBRE4sQ0FFSCxDQUFDLFlBRkUsQ0FFVyxDQUZYLENBR0gsQ0FBQyxZQUhFLENBR1csQ0FIWCxDQUlILENBQUMsS0FKRSxDQUlJLElBSkosQ0FLSCxDQUFDLEtBTEUsQ0FLSSxJQUFDLENBQUEsY0FBRCxDQUFBLENBTEo7TUFPTCxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLEVBQUUsQ0FBQyxrQkFBdEI7QUFDVCxhQUFPO0lBakJFOzsyQkFtQlgsVUFBQSxHQUFZLFNBQUE7TUFDViwyQ0FBQTtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBZDtBQUNBLGFBQU87SUFIRzs7MkJBS1osY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLENBQUQsRUFBSSxJQUFDLENBQUEsS0FBTDtJQURPOzsyQkFHaEIsY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLENBQUQsRUFBSSxJQUFDLENBQUEsTUFBTDtJQURPOzsyQkFHaEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTyxJQUFDLENBQUE7SUFETzs7MkJBR2pCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU8sSUFBQyxDQUFBO0lBRE87OzJCQUdqQixhQUFBLEdBQWUsU0FBQTtBQUNiLFVBQUE7TUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBLENBQUEsR0FBZTtNQUN4QixJQUFHLElBQUMsQ0FBQSxLQUFELElBQVcsSUFBQyxDQUFBLFNBQWY7UUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBM0I7UUFDWCxJQUFDLENBQUEsTUFBRCxHQUFhLFFBQUEsR0FBVyxFQUFkLEdBQXNCLFFBQUEsR0FBVyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQTVDLEdBQXdELEVBQUEsR0FBSyxJQUFDLENBQUEsU0FBUyxDQUFDLE9BRnBGOztBQUdBLGFBQU87SUFMTTs7MkJBT2YsU0FBQSxHQUFXLFNBQUE7TUFFVCxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQVQ7TUFDQSxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQVQ7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsSUFBQyxDQUFBLE1BQUQsR0FBUSxJQUFuQztNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixLQUFsQixDQUNFLENBQUMsSUFESCxDQUNTLE9BRFQsRUFDa0IsZ0JBRGxCLENBRUUsQ0FBQyxLQUZILENBRVMsUUFGVCxFQUVtQixJQUFDLENBQUEsTUFBRCxHQUFRLElBRjNCLENBR0EsQ0FBQyxTQUhELENBR1csT0FIWCxDQUlFLENBQUMsSUFKSCxDQUlRLElBQUMsQ0FBQSxTQUpULENBS0EsQ0FBQyxLQUxELENBQUEsQ0FLUSxDQUFDLE1BTFQsQ0FLZ0IsS0FMaEIsQ0FNRSxDQUFDLElBTkgsQ0FNUyxPQU5ULEVBTWtCLE1BTmxCLENBT0UsQ0FBQyxLQVBILENBT1MsWUFQVCxFQU91QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsS0FBRCxDQUFPLENBQUMsQ0FBQyxLQUFUO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBUHZCLENBUUUsQ0FBQyxFQVJILENBUVMsV0FSVCxFQVFzQixJQUFDLENBQUEsV0FSdkIsQ0FTRSxDQUFDLEVBVEgsQ0FTUyxVQVRULEVBU3FCLElBQUMsQ0FBQSxVQVR0QixDQVVFLENBQUMsSUFWSCxDQVVTLElBQUMsQ0FBQSxpQkFWVjtNQVlBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixLQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsYUFEakIsQ0FFQSxDQUFDLFNBRkQsQ0FFVyxZQUZYLENBR0UsQ0FBQyxJQUhILENBR1EsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsU0FBQyxDQUFEO2VBQU8sQ0FBQSxHQUFJLENBQUosS0FBUztNQUFoQixDQUFkLENBSFIsQ0FJQSxDQUFDLEtBSkQsQ0FBQSxDQUlRLENBQUMsTUFKVCxDQUlnQixLQUpoQixDQUtFLENBQUMsSUFMSCxDQUtTLE9BTFQsRUFLa0IsV0FMbEIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxNQU5ULEVBTWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBSCxDQUFBLEdBQU07UUFBYjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOakIsQ0FPRSxDQUFDLElBUEgsQ0FPUyxTQUFDLENBQUQ7ZUFBTztNQUFQLENBUFQ7TUFTQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsS0FBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLGFBRGpCLENBRUEsQ0FBQyxTQUZELENBRVcsWUFGWCxDQUdFLENBQUMsSUFISCxDQUdRLElBQUMsQ0FBQSxTQUhULENBSUEsQ0FBQyxLQUpELENBQUEsQ0FJUSxDQUFDLE1BSlQsQ0FJZ0IsS0FKaEIsQ0FLRSxDQUFDLElBTEgsQ0FLUyxPQUxULEVBS2tCLFdBTGxCLENBTUUsQ0FBQyxLQU5ILENBTVMsS0FOVCxFQU1nQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUgsQ0FBQSxHQUFNO1FBQWI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTmhCLENBT0UsQ0FBQyxJQVBILENBT1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBaEI7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FQUjthQVNBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixpQkFBbEIsQ0FDRSxDQUFDLFNBREgsQ0FDYSxTQURiLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsU0FBQyxDQUFEO2VBQU87VUFBQyxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBQVQ7VUFBZSxJQUFBLEVBQU0sQ0FBQyxDQUFDLGlCQUF2Qjs7TUFBUCxDQUFWLENBQTJELENBQUMsTUFBNUQsQ0FBbUUsU0FBQyxDQUFEO2VBQU8sQ0FBQyxLQUFBLENBQU0sQ0FBQyxDQUFDLElBQVI7TUFBUixDQUFuRSxDQUZSLENBR0EsQ0FBQyxLQUhELENBQUEsQ0FHUSxDQUFDLE1BSFQsQ0FHZ0IsS0FIaEIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxPQUpSLEVBSWlCLFFBSmpCLENBS0UsQ0FBQyxJQUxILENBS1EsSUFBQyxDQUFBLG1CQUxUO0lBckNTOzsyQkE0Q1gscUJBQUEsR0FBdUIsU0FBQTtNQUVyQixJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQVQ7TUFDQSxJQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUgsQ0FBUyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQVQ7TUFFQSxJQUFDLENBQUEsU0FDQyxDQUFDLEtBREgsQ0FDUyxRQURULEVBQ21CLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFEN0I7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsaUJBQWxCLENBQ0UsQ0FBQyxLQURILENBQ1MsUUFEVCxFQUNtQixJQUFDLENBQUEsTUFBRCxHQUFRLElBRDNCO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE9BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGlCQURUO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFNBQWxCLENBQTRCLENBQUMsU0FBN0IsQ0FBdUMsWUFBdkMsQ0FDRSxDQUFDLEtBREgsQ0FDUyxNQURULEVBQ2lCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBSCxDQUFBLEdBQU07UUFBYjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEakI7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsU0FBbEIsQ0FBNEIsQ0FBQyxTQUE3QixDQUF1QyxZQUF2QyxDQUNFLENBQUMsS0FESCxDQUNTLEtBRFQsRUFDZ0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFILENBQUEsR0FBTTtRQUFiO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURoQjtNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixpQkFBbEIsQ0FBb0MsQ0FBQyxTQUFyQyxDQUErQyxTQUEvQyxDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxtQkFEVDtBQUVBLGFBQU87SUFqQmM7OzJCQW1CdkIsaUJBQUEsR0FBbUIsU0FBQyxTQUFEO2FBQ2pCLFNBQ0UsQ0FBQyxLQURILENBQ1MsTUFEVCxFQUNtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxJQUFMLENBQUEsR0FBVztRQUFsQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEbkIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxLQUZULEVBRW1CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLE9BQUwsQ0FBQSxHQUFjO1FBQXJCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZuQixDQUdFLENBQUMsS0FISCxDQUdTLE9BSFQsRUFHbUIsSUFBQyxDQUFBLENBQUMsQ0FBQyxTQUFILENBQUEsQ0FBQSxHQUFlLElBSGxDLENBSUUsQ0FBQyxLQUpILENBSVMsUUFKVCxFQUltQixJQUFDLENBQUEsQ0FBQyxDQUFDLFNBQUgsQ0FBQSxDQUFBLEdBQWUsSUFKbEM7SUFEaUI7OzJCQU9uQixtQkFBQSxHQUFxQixTQUFDLFNBQUQ7YUFDbkIsU0FDRSxDQUFDLEtBREgsQ0FDUyxLQURULEVBQ21CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLElBQUwsQ0FBQSxHQUFXO1FBQWxCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURuQixDQUVFLENBQUMsS0FGSCxDQUVTLE1BRlQsRUFFbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLENBQUMsQ0FBQyxJQUFGLEdBQVMsS0FBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQW5CO21CQUEyQixLQUFDLENBQUEsQ0FBRCxDQUFHLEtBQUMsQ0FBQSxLQUFNLENBQUEsQ0FBQSxDQUFWLENBQUEsR0FBYyxDQUFkLEdBQWtCLEtBQTdDO1dBQUEsTUFBdUQsSUFBRyxDQUFDLENBQUMsSUFBRixHQUFTLEtBQUMsQ0FBQSxLQUFNLENBQUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWMsQ0FBZCxDQUFuQjttQkFBeUMsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsSUFBTCxDQUFBLEdBQVcsQ0FBWCxHQUFhLEtBQXREO1dBQUEsTUFBQTttQkFBZ0UsS0FBQyxDQUFBLENBQUMsQ0FBQyxTQUFILENBQUEsQ0FBQSxHQUFlLEtBQUMsQ0FBQSxDQUFELENBQUcsS0FBQyxDQUFBLEtBQU0sQ0FBQSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBYyxDQUFkLENBQVYsQ0FBZixHQUEyQyxLQUEzRzs7UUFBOUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRm5CLENBR0UsQ0FBQyxLQUhILENBR1MsUUFIVCxFQUdtQixJQUFDLENBQUEsQ0FBQyxDQUFDLFNBQUgsQ0FBQSxDQUFBLEdBQWUsSUFIbEM7SUFEbUI7OzJCQU1yQixXQUFBLEdBQWEsU0FBQyxDQUFEO0FBRVgsVUFBQTtNQUFBLE1BQUEsR0FBbUIsQ0FBQSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBWCxDQUFrQixDQUFDLE1BQW5CLENBQUE7TUFDbkIsU0FBQSxHQUFzQixJQUFDLENBQUEsSUFBRCxLQUFTLElBQVosR0FBc0IsT0FBdEIsR0FBbUM7TUFDdEQsZ0JBQUEsR0FBc0IsSUFBQyxDQUFBLElBQUQsS0FBUyxJQUFaLEdBQXNCLE1BQXRCLEdBQWtDO01BQ3JELElBQUMsQ0FBQSxRQUNDLENBQUMsSUFESCxDQUNRLHlCQURSLENBRUUsQ0FBQyxJQUZILENBRVEsQ0FBQyxDQUFDLElBRlY7TUFHQSxJQUFDLENBQUEsUUFDQyxDQUFDLElBREgsQ0FDUSxzQkFEUixDQUVFLENBQUMsSUFGSCxDQUVRLENBQUMsQ0FBQyxJQUZWO01BR0EsSUFBQyxDQUFBLFFBQ0MsQ0FBQyxJQURILENBQ1EsdUJBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUMsQ0FBQyxLQUFqQixFQUF3QixJQUFDLENBQUEsSUFBekIsQ0FGUjtNQUdBLElBQUMsQ0FBQSxRQUNDLENBQUMsSUFESCxDQUNRLHVCQURSLENBRUUsQ0FBQyxJQUZILENBRVcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxDQUFkLEdBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBUixDQUF1QixJQUFDLENBQUEsSUFBeEIsQ0FBQSxHQUFnQyxHQUFoQyxHQUFzQyxTQUEzRCxHQUEwRSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLElBQXhCLENBQUEsR0FBZ0MsR0FBaEMsR0FBc0MsZ0JBRnhIO01BSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQ0U7UUFBQSxNQUFBLEVBQVcsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFDLENBQUEsQ0FBQyxDQUFDLFNBQUgsQ0FBQSxDQUFBLEdBQWlCLEdBQS9CLEdBQXFDLENBQUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBQSxHQUFvQixHQUFyQixDQUFoRDtRQUNBLEtBQUEsRUFBVyxNQUFNLENBQUMsR0FBUCxHQUFhLENBQUMsSUFBQyxDQUFBLENBQUMsQ0FBQyxTQUFILENBQUEsQ0FBQSxHQUFpQixHQUFsQixDQUFiLEdBQXNDLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBLENBRGpEO1FBRUEsU0FBQSxFQUFXLEdBRlg7T0FERjtJQWxCVzs7MkJBd0JiLFVBQUEsR0FBWSxTQUFDLENBQUQ7TUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxTQUFkLEVBQXlCLEdBQXpCO0lBRFU7OzJCQUlaLGNBQUEsR0FBZ0IsU0FBQyxJQUFEO0FBQ2QsVUFBQTtNQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsSUFBRixLQUFVO01BQWpCLENBQWI7TUFDSCxJQUFHLE9BQVEsQ0FBQSxDQUFBLENBQVg7ZUFBbUIsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQTlCO09BQUEsTUFBQTtlQUF3QyxHQUF4Qzs7SUFGTzs7MkJBSWhCLGFBQUEsR0FBZSxTQUFDLE1BQUQsRUFBUyxJQUFUO01BQ04sSUFBRyxNQUFBLEdBQVMsS0FBWjtlQUF1QixFQUF2QjtPQUFBLE1BQThCLElBQUcsTUFBQSxJQUFVLEdBQWI7ZUFBc0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxDQUFmLENBQWlCLENBQUMsY0FBbEIsQ0FBaUMsSUFBakMsRUFBdEI7T0FBQSxNQUFrRSxJQUFHLE1BQUEsSUFBVSxJQUFiO2VBQXVCLE1BQU0sQ0FBQyxPQUFQLENBQWUsQ0FBZixDQUFpQixDQUFDLGNBQWxCLENBQWlDLElBQWpDLEVBQXZCO09BQUEsTUFBQTtlQUFtRSxNQUFNLENBQUMsT0FBUCxDQUFlLENBQWYsQ0FBaUIsQ0FBQyxjQUFsQixDQUFpQyxJQUFqQyxFQUFuRTs7SUFEMUY7Ozs7S0F2TmlCO0FBQWxDOzs7QUNBQTtBQUFBLE1BQUE7Ozs7RUFBTSxNQUFNLENBQUM7OztJQU1FLGtCQUFDLEVBQUQsRUFBSyxPQUFMOzs7TUFDWCxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVosRUFBeUIsRUFBekIsRUFBNkIsT0FBN0I7TUFDQSwwQ0FBTSxFQUFOLEVBQVUsT0FBVjtBQUNBLGFBQU87SUFISTs7dUJBU2IsU0FBQSxHQUFXLFNBQUE7TUFFVCxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLEVBQUUsQ0FBQyxrQkFBdEI7QUFDVCxhQUFPO0lBSEU7O3VCQUtYLFFBQUEsR0FBVSxTQUFDLFFBQUQsRUFBVyxPQUFYO01BQ1IsRUFBRSxDQUFDLEtBQUgsQ0FBQSxDQUNFLENBQUMsS0FESCxDQUNTLEVBQUUsQ0FBQyxHQURaLEVBQ2lCLFFBRGpCLENBRUUsQ0FBQyxLQUZILENBRVMsRUFBRSxDQUFDLElBRlosRUFFa0IsT0FGbEIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxHQUFkO1VBQ0wsS0FBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsYUFBYjtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBZSxHQUFmO1FBRks7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFQ7QUFNQSxhQUFPO0lBUEM7O3VCQVNWLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxHQUFQO01BQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYztRQUFDLENBQUQsRUFBSSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQUMsQ0FBQSxJQUFSLEVBQWMsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQztRQUFULENBQWQsQ0FBSjtPQUFkO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYO0FBQ0EsYUFBTztJQU5BOzt1QkFRVCxVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxjQUFBLEdBQWlCO01BQ2pCLFVBQUEsR0FBYSxFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsRUFBWSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBNUI7TUFDYixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixHQUFsQixDQUNSLENBQUMsSUFETyxDQUNGLE9BREUsRUFDTyxRQURQLENBRVIsQ0FBQyxJQUZPLENBRUYsSUFBQyxDQUFBLGlCQUZDO01BSVYsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsVUFEUixDQUVFLENBQUMsS0FGSCxDQUFBLENBRVUsQ0FBQyxNQUZYLENBRWtCLE1BRmxCLENBR0ksQ0FBQyxJQUhMLENBR1UsR0FIVixFQUdlLFNBQUMsQ0FBRCxFQUFHLENBQUg7ZUFBUyxJQUFJLENBQUMsS0FBTCxDQUFXLGNBQUEsR0FBZSxDQUFDLENBQUEsR0FBRSxDQUFGLEdBQUksQ0FBQyxVQUFVLENBQUMsTUFBWCxHQUFrQixDQUFuQixDQUFMLENBQTFCO01BQVQsQ0FIZixDQUlJLENBQUMsSUFKTCxDQUlVLE9BSlYsRUFJbUIsY0FKbkIsQ0FLSSxDQUFDLElBTEwsQ0FLVSxRQUxWLEVBS29CLENBTHBCLENBTUksQ0FBQyxJQU5MLENBTVUsTUFOVixFQU1rQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsS0FBRCxDQUFPLENBQVA7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FObEI7TUFPQSxVQUFVLENBQUMsS0FBWCxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsVUFEUixDQUVFLENBQUMsS0FGSCxDQUFBLENBRVUsQ0FBQyxNQUZYLENBRWtCLE1BRmxCLENBR0ksQ0FBQyxJQUhMLENBR1UsR0FIVixFQUdlLFNBQUMsQ0FBRCxFQUFHLENBQUg7ZUFBUyxJQUFJLENBQUMsS0FBTCxDQUFXLGNBQUEsR0FBZSxDQUFDLENBQUEsR0FBRSxHQUFGLEdBQU0sQ0FBQyxVQUFVLENBQUMsTUFBWCxHQUFrQixDQUFuQixDQUFQLENBQTFCO01BQVQsQ0FIZixDQUlJLENBQUMsSUFKTCxDQUlVLEdBSlYsRUFJZSxFQUpmLENBS0ksQ0FBQyxJQUxMLENBS1UsYUFMVixFQUt5QixPQUx6QixDQU1JLENBQUMsSUFOTCxDQU1VLFNBQUMsQ0FBRDtlQUFPO01BQVAsQ0FOVjtJQWhCVTs7dUJBd0JaLFNBQUEsR0FBVyxTQUFDLEdBQUQ7TUFFVCxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBbEM7TUFDYixJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVgsR0FBc0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBcEIsQ0FBMkIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEVBQUYsS0FBUTtNQUFmLENBQTNCO01BRXRCLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFBRSxDQUFDLGNBQUgsQ0FBQTtNQUNkLElBQUMsQ0FBQSxpQkFBRCxDQUFBO01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUSxFQUFFLENBQUMsT0FBSCxDQUFBLENBQ04sQ0FBQyxVQURLLENBQ00sSUFBQyxDQUFBLFVBRFA7TUFHUixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsVUFBckIsQ0FDQSxDQUFDLElBREQsQ0FDTSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBRGpCLENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxJQUhSLEVBR2MsU0FBQyxDQUFEO2VBQU8sVUFBQSxHQUFXLENBQUMsQ0FBQztNQUFwQixDQUhkLENBSUUsQ0FBQyxJQUpILENBSVEsT0FKUixFQUlpQixTQUFDLENBQUQ7ZUFBTztNQUFQLENBSmpCLENBS0UsQ0FBQyxJQUxILENBS1EsTUFMUixFQUtnQixJQUFDLENBQUEsZUFMakIsQ0FNRSxDQUFDLElBTkgsQ0FNUSxjQU5SLEVBTXdCLENBTnhCLENBT0UsQ0FBQyxJQVBILENBT1EsUUFQUixFQU9rQixJQUFDLENBQUEsZUFQbkIsQ0FRRSxDQUFDLElBUkgsQ0FRUSxHQVJSLEVBUWEsSUFBQyxDQUFBLElBUmQ7TUFVQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxlQUFiO0FBQ0EsYUFBTztJQXRCRTs7dUJBd0JYLHFCQUFBLEdBQXVCLFNBQUE7TUFDckIsa0RBQUE7TUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBTixDQUFpQixJQUFDLENBQUEsVUFBbEI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsVUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsSUFBQyxDQUFBLElBRGQ7TUFFQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBWjtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxpQkFBZCxFQURGOztBQUVBLGFBQU87SUFSYzs7dUJBVXZCLGlCQUFBLEdBQW1CLFNBQUE7YUFDakIsSUFBQyxDQUFBLFVBQ0MsQ0FBQyxPQURILENBQ1csQ0FBQyxJQUFDLENBQUEsS0FBRixFQUFTLElBQUMsQ0FBQSxNQUFWLENBRFgsRUFDOEIsSUFBQyxDQUFBLFNBRC9CLENBRUUsQ0FBQyxLQUZILENBRVksSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLENBQUEsQ0FBQSxHQUFzQixHQUZsQyxDQUdFLENBQUMsU0FISCxDQUdhLENBQUMsSUFBQyxDQUFBLEtBQUQsR0FBTyxJQUFSLEVBQWMsSUFBQyxDQUFBLE1BQUQsR0FBUSxHQUF0QixDQUhiO0lBRGlCOzt1QkFNbkIsZUFBQSxHQUFpQixTQUFDLENBQUQ7QUFDZixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxRQUFGLEtBQWMsQ0FBQyxDQUFDO01BQXZCLENBQWI7TUFDRCxJQUFHLEtBQU0sQ0FBQSxDQUFBLENBQVQ7ZUFBaUIsSUFBQyxDQUFBLEtBQUQsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBaEIsRUFBakI7T0FBQSxNQUFBO2VBQTZDLE9BQTdDOztJQUZROzt1QkFJakIsaUJBQUEsR0FBbUIsU0FBQyxPQUFEO2FBQ2pCLE9BQU8sQ0FBQyxJQUFSLENBQWEsV0FBYixFQUEwQixZQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsS0FBRCxHQUFPLEdBQWxCLENBQWIsR0FBb0MsR0FBcEMsR0FBd0MsQ0FBQyxDQUFDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQWxCLENBQXhDLEdBQStELEdBQXpGO0lBRGlCOzs7O0tBekdTLE1BQU0sQ0FBQztBQUFyQzs7O0FDQUE7QUFBQSxNQUFBOzs7O0VBQU0sTUFBTSxDQUFDOzs7SUFNRSwwQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxFQUFqQyxFQUFxQyxPQUFyQztNQUNBLGtEQUFNLEVBQU4sRUFBVSxPQUFWO0FBQ0EsYUFBTztJQUhJOzsrQkFTYixVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUNYLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUYsR0FBb0IsQ0FBQyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtpQkFDdkIsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBRixHQUFvQixDQUFDLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiO1FBRlo7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7QUFHQSxhQUFPO0lBSkc7OytCQU1aLFNBQUEsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQ0gsQ0FBQyxRQURFLENBQ08sR0FEUCxDQUVILENBQUMsS0FGRSxDQUVJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FGSjtNQUlMLElBQUMsQ0FBQSxDQUFELEdBQUssRUFBRSxDQUFDLFdBQUgsQ0FBQSxDQUNILENBQUMsS0FERSxDQUNJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FESjtNQUdMLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsQ0FBZixDQUNQLENBQUMsUUFETSxDQUNHLElBQUMsQ0FBQSxNQURKO01BRVQsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFFLENBQUMsUUFBSCxDQUFZLElBQUMsQ0FBQSxDQUFiLENBQ1AsQ0FBQyxRQURNLENBQ0csSUFBQyxDQUFBLEtBREo7QUFFVCxhQUFPO0lBYkU7OytCQWVYLGVBQUEsR0FBaUIsU0FBQTtNQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQVosRUFBK0IsRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFDLENBQUEsSUFBUixFQUFjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsQ0FBL0I7QUFDQSxhQUFPO1FBQUMsQ0FBRCxFQUFJLEVBQUUsQ0FBQyxHQUFILENBQU8sSUFBQyxDQUFBLElBQVIsRUFBYyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUFKOztJQUZROzsrQkFJakIsZUFBQSxHQUFpQixTQUFBO01BQ2YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWixFQUErQixFQUFFLENBQUMsR0FBSCxDQUFPLElBQUMsQ0FBQSxJQUFSLEVBQWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7UUFBVDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUEvQjtBQUNBLGFBQU87UUFBQyxDQUFELEVBQUksRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFDLENBQUEsSUFBUixFQUFjLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBQUo7O0lBRlE7OytCQUlqQixTQUFBLEdBQVcsU0FBQTtNQUNULE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBQyxDQUFBLElBQWI7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsSUFEVCxDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLFFBRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsT0FIUixFQUdpQixLQUhqQixDQUlFLENBQUMsSUFKSCxDQUlRLElBSlIsRUFJYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxNQUFBLEdBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7UUFBaEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmQsQ0FLRSxDQUFDLElBTEgsQ0FLUSxHQUxSLEVBS2EsQ0FMYixDQU1FLENBQUMsSUFOSCxDQU1RLElBQUMsQ0FBQSxpQkFOVDtNQVFBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixZQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxJQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLFdBSGpCLENBSUUsQ0FBQyxJQUpILENBSVEsSUFKUixFQUljLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLE1BQUEsR0FBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUFoQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKZCxDQUtFLENBQUMsSUFMSCxDQUtRLElBTFIsRUFLYyxRQUxkLENBTUUsQ0FBQyxJQU5ILENBTVEsSUFOUixFQU1jLFNBTmQsQ0FPRSxDQUFDLElBUEgsQ0FPUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVBSLENBUUUsQ0FBQyxJQVJILENBUVEsSUFBQyxDQUFBLHNCQVJUO0FBU0EsYUFBTztJQXBCRTs7K0JBc0JYLHFCQUFBLEdBQXVCLFNBQUE7TUFDckIsMERBQUE7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsaUJBRFQ7QUFFQSxhQUFPO0lBSmM7OytCQU12QixpQkFBQSxHQUFtQixTQUFDLE9BQUQ7YUFDakIsT0FDRSxDQUFDLElBREgsQ0FDUSxJQURSLEVBQ2MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUZSLEVBRWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmQ7SUFEaUI7OytCQUtuQixzQkFBQSxHQUF3QixTQUFDLE9BQUQ7YUFDdEIsT0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxHQUZSLEVBRWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmI7SUFEc0I7OytCQU14QixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLGdCQUE1QjtJQURnQjs7OztLQW5Ga0IsTUFBTSxDQUFDO0FBQTdDOzs7QUNFQTtFQUFBLENBQUMsU0FBQyxDQUFEO0FBR0MsUUFBQTtJQUFBLElBQUEsR0FBVSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLE1BQWY7SUFDVixPQUFBLEdBQVUsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFmO0lBSVYsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsT0FBN0IsQ0FBQTtJQUlBLGNBQUEsR0FBaUIsU0FBQyxTQUFELEVBQVksSUFBWixFQUFrQixJQUFsQjtBQUNmLFVBQUE7TUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVTtNQUFqQixDQUFqQjtNQUNQLElBQUcsSUFBSDtlQUNFLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxPQUFBLEdBQVEsSUFBUixFQURWO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxLQUFSLENBQWMsMEJBQWQsRUFBMEMsSUFBMUMsRUFIRjs7SUFGZTtJQVNqQixnQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLHVCQUFSLENBQWdDLGtCQUFoQztNQUNWLE9BQU8sQ0FBQyxHQUFSLEdBQWM7TUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLE9BQVI7TUFDVixLQUFBLEdBQVEsSUFBQSxHQUFPO01BQ2YsQ0FBQSxHQUFJO0FBQ0osYUFBTSxDQUFBLElBQUssS0FBWDtRQUNFLE9BQU8sQ0FBQyxRQUFSLENBQ0U7VUFBQSxLQUFBLEVBQVEsTUFBQSxHQUFTLENBQWpCO1VBQ0EsR0FBQSxFQUFRLE1BQUEsR0FBUyxDQUFDLENBQUEsR0FBSSxDQUFMLENBRGpCO1VBRUEsSUFBQSxFQUFRLElBQUEsR0FBTyxDQUZmO1VBR0EsTUFBQSxFQUFRLDZCQUhSO1NBREY7UUFLQSxDQUFBO01BTkY7TUFRQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsU0FBQyxDQUFEO1FBQ2hDLENBQUEsQ0FBRSx3QkFBRixDQUEyQixDQUFDLE1BQTVCLENBQUE7UUFDQSxDQUFBLENBQUUsOEJBQUYsQ0FBaUMsQ0FBQyxNQUFsQyxDQUF5QyxHQUF6QyxFQUE4QyxDQUE5QztlQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLENBQXBCO01BSGdDLENBQWxDO2FBS0EsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsS0FBL0IsQ0FBcUMsU0FBQyxDQUFEO1FBQ25DLENBQUMsQ0FBQyxjQUFGLENBQUE7UUFDQSxPQUFPLENBQUMsSUFBUixDQUFBO1FBQ0EsQ0FBQSxDQUFFLHdCQUFGLENBQTJCLENBQUMsT0FBNUIsQ0FBQTtlQUNBLENBQUEsQ0FBRSw4QkFBRixDQUFpQyxDQUFDLE1BQWxDLENBQXlDLEdBQXpDLEVBQThDLENBQTlDO01BSm1DLENBQXJDO0lBbkJpQjtJQTJCbkIseUJBQUEsR0FBNEIsU0FBQTthQUMxQixFQUFFLENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDa0IsT0FBQSxHQUFRLDRDQUQxQixDQUVFLENBQUMsS0FGSCxDQUVTLEVBQUUsQ0FBQyxHQUZaLEVBRWtCLE9BQUEsR0FBUSx3Q0FGMUIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxFQUFFLENBQUMsSUFIWixFQUdrQixPQUFBLEdBQVEsaUNBSDFCLENBSUUsQ0FBQyxLQUpILENBSVMsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLFNBQWQsRUFBeUIsR0FBekI7QUFFTCxZQUFBO1FBQUEsS0FBQSxHQUFRO1FBQ1IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLENBQUQ7aUJBQ1gsS0FBTSxDQUFBLENBQUMsQ0FBQyxNQUFGLENBQU4sR0FBa0IsQ0FBQyxDQUFDLENBQUMsS0FBSCxHQUFTO1FBRGhCLENBQWI7UUFHQSxTQUFTLENBQUMsT0FBVixDQUFrQixTQUFDLENBQUQ7VUFDaEIsQ0FBQyxDQUFDLEtBQUYsR0FBVSxLQUFNLENBQUEsQ0FBQyxDQUFDLE1BQUY7VUFDaEIsQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFFLENBQUEsT0FBQSxHQUFRLElBQVI7VUFDWCxPQUFPLENBQUMsQ0FBQztpQkFDVCxPQUFPLENBQUMsQ0FBQztRQUpPLENBQWxCO1FBTUEsS0FBQSxHQUFZLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IseUJBQWhCLEVBQ1Y7VUFBQSxXQUFBLEVBQWEsTUFBYjtVQUNBLE1BQUEsRUFDRTtZQUFBLEdBQUEsRUFBSyxFQUFMO1lBQ0EsTUFBQSxFQUFRLENBRFI7V0FGRjtVQUlBLE1BQUEsRUFBUSxJQUpSO1NBRFU7UUFNWixLQUFLLENBQUMsT0FBTixDQUFjLFNBQWQsRUFBeUIsR0FBekI7ZUFDQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixLQUFLLENBQUMsUUFBdkI7TUFuQkssQ0FKVDtJQUQwQjtJQTJCNUIsaUJBQUEsR0FBb0IsU0FBQyxFQUFELEVBQUssSUFBTCxFQUFXLFNBQVg7QUFDbEIsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUNMLENBQUMsTUFESSxDQUNHLFNBQUMsQ0FBRDtlQUFPLFNBQVMsQ0FBQyxPQUFWLENBQWtCLENBQUMsQ0FBQyxJQUFwQixDQUFBLEtBQTZCLENBQUMsQ0FBOUIsSUFBb0MsRUFBRSxDQUFDLE1BQUgsQ0FBVSxDQUFDLENBQUMsTUFBWixDQUFtQixDQUFDLE1BQXBCLEdBQTZCO01BQXhFLENBREgsQ0FFTCxDQUFDLElBRkksQ0FFQyxTQUFDLENBQUQsRUFBRyxDQUFIO2VBQVMsQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUM7TUFBckIsQ0FGRDtNQUdQLEtBQUEsR0FBWSxJQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEVBQXBCLEVBQ1Y7UUFBQSxNQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLElBQUEsRUFBTSxDQUROO1NBREY7T0FEVTtNQUlaLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZDthQVFBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQWlCLEtBQUssQ0FBQyxRQUF2QjtJQWhCa0I7SUFtQnBCLDhCQUFBLEdBQWlDLFNBQUE7QUFDL0IsVUFBQTtNQUFBLEtBQUEsR0FBWSxJQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLDBCQUFoQixFQUNWO1FBQUEsV0FBQSxFQUFhLEdBQWI7UUFDQSxLQUFBLEVBQU8sSUFEUDtRQUVBLEdBQUEsRUFDRTtVQUFBLENBQUEsRUFBRyxNQUFIO1VBQ0EsQ0FBQSxFQUFHLE9BREg7VUFFQSxFQUFBLEVBQUksTUFGSjtTQUhGO09BRFU7TUFPWixLQUFLLENBQUMsVUFBTixHQUFtQixTQUFDLElBQUQ7UUFDakIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7WUFDWCxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFFLENBQUEsT0FBQSxHQUFRLElBQVI7WUFDWCxPQUFPLENBQUMsQ0FBQzttQkFDVCxPQUFPLENBQUMsQ0FBQztVQUpFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiO0FBS0EsZUFBTztNQU5VO01BT25CLEtBQUssQ0FBQyxRQUFOLENBQWUsT0FBQSxHQUFRLDZCQUF2QjtNQUNBLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVixDQUFhLGVBQWIsRUFBOEIsU0FBQyxDQUFEO1FBQzVCLE9BQU8sQ0FBQyxHQUFSLENBQVkseUJBQVo7ZUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQWhCLENBQTBCLE1BQTFCLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixTQUFDLENBQUQ7aUJBQU8sVUFBQSxHQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVCxDQUFBO1FBQWxCLENBRGpCO01BRjRCLENBQTlCO2FBSUEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsS0FBSyxDQUFDLFFBQXZCO0lBcEIrQjtJQXNCakMsc0NBQUEsR0FBeUMsU0FBQTthQUN2QyxFQUFFLENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDaUIsT0FBQSxHQUFRLDZCQUR6QixDQUVFLENBQUMsS0FGSCxDQUVTLEVBQUUsQ0FBQyxHQUZaLEVBRWlCLE9BQUEsR0FBUSw0QkFGekIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsU0FBZDtBQUNMLFlBQUE7UUFBQSxLQUFBLEdBQVksSUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsMEJBQXhCLEVBQ1Y7VUFBQSxXQUFBLEVBQWEsR0FBYjtVQUNBLE1BQUEsRUFDRTtZQUFBLEdBQUEsRUFBSyxDQUFMO1lBQ0EsS0FBQSxFQUFPLENBRFA7WUFFQSxJQUFBLEVBQU0sRUFGTjtZQUdBLE1BQUEsRUFBUSxFQUhSO1dBRkY7VUFNQSxHQUFBLEVBQ0U7WUFBQSxDQUFBLEVBQUcsS0FBSDtZQUNBLENBQUEsRUFBRyxZQURIO1lBRUEsRUFBQSxFQUFJLFNBRko7V0FQRjtTQURVO1FBV1osS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFaLENBQXVCLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkLEVBQXFCLEtBQXJCLENBQXZCO1FBQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkO2VBQ0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsS0FBSyxDQUFDLFFBQXZCO01BZEssQ0FIVDtJQUR1QztJQXFCekMsK0JBQUEsR0FBa0MsU0FBQTthQUNoQyxFQUFFLENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDaUIsT0FBQSxHQUFRLHlDQUR6QixDQUVFLENBQUMsS0FGSCxDQUVTLEVBQUUsQ0FBQyxHQUZaLEVBRWlCLE9BQUEsR0FBUSw2QkFGekIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLGVBQXBCO1FBQ0wsT0FBTyxVQUFVLENBQUM7UUFDbEIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsU0FBQyxDQUFEO0FBQ2pCLGNBQUE7VUFBQSxJQUFHLENBQUMsQ0FBQyxpQkFBTDtZQUNFLENBQUMsQ0FBQyxpQkFBRixHQUFzQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFwQixDQUE0QixVQUE1QixFQUF3QyxFQUF4QyxFQUR6Qjs7VUFFQSxDQUFDLENBQUMsS0FBRixHQUFVO1VBQ1YsQ0FBQyxDQUFDLE1BQUYsR0FBVztVQUNYLENBQUMsQ0FBQyxJQUFGLEdBQVMsY0FBQSxDQUFlLGVBQWYsRUFBZ0MsQ0FBQyxDQUFDLElBQWxDLEVBQXdDLElBQXhDO1VBRVQsY0FBQSxHQUFpQixlQUFlLENBQUMsTUFBaEIsQ0FBdUIsU0FBQyxPQUFEO21CQUFhLE9BQU8sQ0FBQyxJQUFSLEtBQWdCLENBQUMsQ0FBQztVQUEvQixDQUF2QjtVQUNqQixJQUFHLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQTNCO1lBQ0UsSUFBQSxHQUFPO0FBQ1AsbUJBQU0sSUFBQSxHQUFPLElBQWI7Y0FDRSxJQUFHLENBQUUsQ0FBQSxJQUFBLENBQUw7Z0JBQ0UsVUFBQSxHQUFhLENBQUMsY0FBZSxDQUFBLENBQUEsQ0FBRyxDQUFBLElBQUE7Z0JBQ2hDLElBQUcsVUFBQSxLQUFjLENBQWpCO2tCQUNFLENBQUMsQ0FBQyxLQUFNLENBQUEsSUFBQSxDQUFSLEdBQWdCLENBQUMsQ0FBRSxDQUFBLElBQUE7a0JBQ25CLENBQUMsQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFULEdBQWlCLElBQUEsR0FBTyxDQUFDLENBQUUsQ0FBQSxJQUFBLENBQVYsR0FBa0IsV0FGckM7aUJBQUEsTUFBQTtBQUFBO2lCQUZGO2VBQUEsTUFBQTtBQUFBOztjQVNBLE9BQU8sQ0FBRSxDQUFBLElBQUE7Y0FDVCxJQUFBO1lBWEYsQ0FGRjtXQUFBLE1BQUE7WUFlRSxPQUFPLENBQUMsR0FBUixDQUFZLGdDQUFaLEVBQThDLENBQUMsQ0FBQyxJQUFoRCxFQWZGOztpQkFpQkEsQ0FBQyxDQUFDLEtBQUYsR0FBVSxFQUFFLENBQUMsTUFBSCxDQUFVLENBQUMsQ0FBQyxNQUFaLENBQW1CLENBQUMsTUFBcEIsQ0FBMkIsQ0FBQyxTQUFDLENBQUQsRUFBSSxDQUFKO21CQUFVLENBQUEsR0FBSTtVQUFkLENBQUQsQ0FBM0IsRUFBOEMsQ0FBOUM7UUF6Qk8sQ0FBbkI7UUEyQkEsaUJBQUEsQ0FBa0IsMEJBQWxCLEVBQThDLFVBQTlDLEVBQTBELENBQUMsS0FBRCxFQUFPLEtBQVAsRUFBYSxLQUFiLEVBQW1CLEtBQW5CLEVBQXlCLEtBQXpCLEVBQStCLEtBQS9CLENBQTFEO2VBQ0EsaUJBQUEsQ0FBa0IsMEJBQWxCLEVBQThDLFVBQTlDLEVBQTBELENBQUMsS0FBRCxFQUFPLEtBQVAsRUFBYSxLQUFiLEVBQW1CLEtBQW5CLEVBQXlCLEtBQXpCLEVBQStCLEtBQS9CLENBQTFEO01BOUJLLENBSFQ7SUFEZ0M7SUFzQ2xDLHlDQUFBLEdBQTRDLFNBQUE7QUFDMUMsVUFBQTtNQUFBLEtBQUEsR0FBWSxJQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGlDQUFqQixFQUNWO1FBQUEsR0FBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLE1BQUo7VUFDQSxDQUFBLEVBQUcsTUFESDtTQURGO1FBR0EsS0FBQSxFQUFPLElBSFA7UUFJQSxNQUFBLEVBQVE7VUFBQSxHQUFBLEVBQUssRUFBTDtTQUpSO09BRFU7TUFNWixLQUFLLENBQUMsZUFBTixHQUF3QixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUQsRUFBSSxHQUFKO01BQVA7TUFDeEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFaLENBQXVCLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixHQUFoQixDQUF2QjtNQUNBLEVBQUUsQ0FBQyxHQUFILENBQU8sT0FBQSxHQUFRLHdDQUFmLEVBQXlELFNBQUMsS0FBRCxFQUFRLElBQVI7UUFDdkQsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsT0FBRixLQUFhLENBQUEsQ0FBRSx5Q0FBRixDQUE0QyxDQUFDLEdBQTdDLENBQUE7UUFBcEIsQ0FBWixDQUFkO1FBRUEsQ0FBQSxDQUFFLHlDQUFGLENBQTRDLENBQUMsTUFBN0MsQ0FBb0QsU0FBQyxDQUFEO1VBQ2xELEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLE9BQUYsS0FBYSxDQUFBLENBQUUseUNBQUYsQ0FBNEMsQ0FBQyxHQUE3QyxDQUFBO1VBQXBCLENBQVosQ0FBZDtpQkFDQSxDQUFBLENBQUUsMkNBQUYsQ0FBOEMsQ0FBQyxPQUEvQyxDQUF1RCxRQUF2RDtRQUZrRCxDQUFwRDtRQUlBLENBQUEsQ0FBRSxzRkFBRixDQUF5RixDQUFDLE1BQTFGLENBQWlHLFNBQUMsQ0FBRDtVQUMvRixDQUFBLENBQUUsa0NBQUYsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxvQkFBM0MsQ0FBZ0UsQ0FBQyxXQUFqRSxDQUE2RSxRQUE3RTtVQUNBLENBQUEsQ0FBRSx5Q0FBQSxHQUEwQyxDQUFBLENBQUUsMkNBQUYsQ0FBOEMsQ0FBQyxHQUEvQyxDQUFBLENBQTVDLENBQWlHLENBQUMsUUFBbEcsQ0FBMkcsUUFBM0c7VUFDQSxDQUFBLENBQUUseUNBQUEsR0FBMEMsQ0FBQSxDQUFFLDJDQUFGLENBQThDLENBQUMsR0FBL0MsQ0FBQSxDQUE1QyxDQUFpRyxDQUFDLFFBQWxHLENBQTJHLFFBQTNHO1VBQ0EsQ0FBQSxDQUFFLCtDQUFBLEdBQWdELENBQUEsQ0FBRSwyQ0FBRixDQUE4QyxDQUFDLEdBQS9DLENBQUEsQ0FBbEQsQ0FBdUcsQ0FBQyxRQUF4RyxDQUFpSCxRQUFqSDtpQkFDQSxDQUFBLENBQUUsK0NBQUEsR0FBZ0QsQ0FBQSxDQUFFLDJDQUFGLENBQThDLENBQUMsR0FBL0MsQ0FBQSxDQUFsRCxDQUF1RyxDQUFDLFFBQXhHLENBQWlILFFBQWpIO1FBTCtGLENBQWpHO2VBTUEsQ0FBQSxDQUFFLDJDQUFGLENBQThDLENBQUMsT0FBL0MsQ0FBdUQsUUFBdkQ7TUFidUQsQ0FBekQ7YUFjQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixLQUFLLENBQUMsUUFBdkI7SUF2QjBDO0lBMEI1QyxrQ0FBQSxHQUFxQyxTQUFBO0FBQ25DLFVBQUE7TUFBQSxTQUFBLEdBQVksQ0FBQyxLQUFELEVBQU8sS0FBUCxFQUFhLEtBQWIsRUFBbUIsS0FBbkI7TUFDWixLQUFBLEdBQVksSUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQiw2QkFBakIsRUFDVjtRQUFBLEdBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxNQUFKO1VBQ0EsQ0FBQSxFQUFHLE1BREg7U0FERjtRQUdBLEtBQUEsRUFBTyxJQUhQO1FBSUEsTUFBQSxFQUFRO1VBQUEsTUFBQSxFQUFRLEVBQVI7U0FKUjtPQURVO01BTVosS0FBSyxDQUFDLGVBQU4sR0FBd0IsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFELEVBQUksR0FBSjtNQUFQO01BQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBWixDQUF1QixDQUFDLENBQUQsRUFBRyxFQUFILEVBQU0sRUFBTixFQUFTLEVBQVQsRUFBWSxHQUFaLENBQXZCO01BQ0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFaLENBQXVCLENBQUMsSUFBRCxFQUFNLElBQU4sRUFBVyxJQUFYLEVBQWdCLElBQWhCLEVBQXFCLElBQXJCLEVBQTBCLElBQTFCLEVBQStCLElBQS9CLEVBQW9DLElBQXBDLENBQXZCO01BQ0EsS0FBSyxDQUFDLFNBQU4sQ0FDRTtRQUFBLEtBQUEsRUFBTyxFQUFQO1FBQ0EsS0FBQSxFQUFVLElBQUEsS0FBUSxJQUFYLEdBQXFCLGlCQUFyQixHQUE0QyxlQURuRDtRQUVBLEtBQUEsRUFBTyxNQUZQO09BREY7TUFJQSxFQUFFLENBQUMsR0FBSCxDQUFPLE9BQUEsR0FBUSw2Q0FBZixFQUE4RCxTQUFDLEtBQUQsRUFBUSxJQUFSO2VBQzVELEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFDLENBQUQ7aUJBQU8sU0FBUyxDQUFDLE9BQVYsQ0FBa0IsQ0FBQyxDQUFDLElBQXBCLENBQUEsS0FBNkIsQ0FBQztRQUFyQyxDQUFaLENBQWQ7TUFENEQsQ0FBOUQ7YUFFQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixLQUFLLENBQUMsUUFBdkI7SUFqQm1DO0lBb0JyQyxpQ0FBQSxHQUFvQyxTQUFBO0FBQ2xDLFVBQUE7TUFBQSxRQUFBLEdBQVcsQ0FBQyxXQUFELEVBQWMsU0FBZCxFQUF3QixXQUF4QixFQUFvQyxPQUFwQyxFQUE0QyxTQUE1QztNQUNYLE1BQUEsR0FBUzthQUVULEVBQUUsQ0FBQyxHQUFILENBQU8sT0FBQSxHQUFRLHVDQUFmLEVBQXdELFNBQUMsS0FBRCxFQUFRLElBQVI7QUFFdEQsWUFBQTtRQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQVAsRUFBYSxTQUFDLENBQUQ7aUJBQU8sRUFBRSxDQUFDLEdBQUgsQ0FBTyxFQUFFLENBQUMsTUFBSCxDQUFVLENBQVYsQ0FBUCxFQUFxQixTQUFDLENBQUQ7bUJBQU8sQ0FBQztVQUFSLENBQXJCO1FBQVAsQ0FBYjtRQUNaLFNBQUEsR0FBWTtlQUVaLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQUMsT0FBRDtBQUVmLGNBQUE7VUFBQSxZQUFBLEdBQWUsSUFDYixDQUFDLE1BRFksQ0FDTCxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLE9BQUYsS0FBYTtVQUFwQixDQURLLENBRWIsQ0FBQyxHQUZZLENBRUwsU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQUFhLENBQWI7VUFBUCxDQUZLO1VBSWYsS0FBQSxHQUFZLElBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsT0FBQSxHQUFRLGNBQXpCLEVBQ1Y7WUFBQSxNQUFBLEVBQVEsSUFBUjtZQUNBLE1BQUEsRUFBUTtjQUFBLElBQUEsRUFBTSxFQUFOO2FBRFI7WUFFQSxHQUFBLEVBQ0U7Y0FBQSxDQUFBLEVBQUcsU0FBSDtjQUNBLEVBQUEsRUFBSSxTQURKO2FBSEY7V0FEVTtVQU1aLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWjtVQUNBLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBWixDQUF1QixDQUFDLElBQUQsRUFBTyxJQUFQLENBQXZCO1VBQ0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFaLENBQWtCLENBQWxCLENBQW9CLENBQUMsVUFBckIsQ0FBZ0MsRUFBRSxDQUFDLE1BQUgsQ0FBVSxLQUFWLENBQWhDO1VBQ0EsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsRUFBRSxDQUFDLE1BQUgsQ0FBVSxLQUFWO1VBQ2hCLEtBQUssQ0FBQyxlQUFOLEdBQXdCLFNBQUE7QUFBRyxtQkFBTyxDQUFDLENBQUQsRUFBTyxPQUFBLEtBQVcsU0FBWCxJQUF3QixPQUFBLEtBQVcsV0FBdEMsR0FBdUQsU0FBdkQsR0FBc0UsU0FBMUU7VUFBVjtVQUN4QixLQUFLLENBQUMsT0FBTixDQUFjLFlBQWQ7VUFFQSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVYsQ0FBYSxhQUFiLEVBQTRCLFNBQUMsQ0FBRCxFQUFJLElBQUo7bUJBQzFCLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBQyxDQUFEO2NBQ2IsSUFBTyxDQUFBLEtBQUssS0FBWjt1QkFDRSxDQUFDLENBQUMsUUFBRixDQUFXLElBQVgsRUFERjs7WUFEYSxDQUFmO1VBRDBCLENBQTVCO1VBSUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFWLENBQWEsVUFBYixFQUF5QixTQUFDLENBQUQ7bUJBQ3ZCLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBQyxDQUFEO2NBQ2IsSUFBTyxDQUFBLEtBQUssS0FBWjt1QkFDRSxDQUFDLENBQUMsU0FBRixDQUFBLEVBREY7O1lBRGEsQ0FBZjtVQUR1QixDQUF6QjtpQkFJQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixLQUFLLENBQUMsUUFBdkI7UUEzQmUsQ0FBakI7TUFMc0QsQ0FBeEQ7SUFKa0M7SUFzQ3BDLGdDQUFBLEdBQW1DLFNBQUE7YUFFakMsRUFBRSxDQUFDLEtBQUgsQ0FBQSxDQUNFLENBQUMsS0FESCxDQUNTLEVBQUUsQ0FBQyxHQURaLEVBQ2lCLE9BQUEsR0FBUSx3Q0FEekIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxFQUFFLENBQUMsR0FGWixFQUVpQixPQUFBLEdBQVEsNEJBRnpCLENBR0UsQ0FBQyxLQUhILENBR1MsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLFNBQWQ7QUFFTCxZQUFBO1FBQUEsT0FBQSxHQUFVO1FBRVYsaUJBQUEsR0FBb0IsQ0FBQyxLQUFELEVBQU8sS0FBUCxFQUFhLEtBQWIsRUFBbUIsS0FBbkIsRUFBeUIsS0FBekIsRUFBK0IsS0FBL0IsRUFBcUMsS0FBckMsRUFBMkMsS0FBM0MsRUFBaUQsS0FBakQsRUFBdUQsS0FBdkQsRUFBNkQsS0FBN0QsRUFBbUUsS0FBbkUsRUFBeUUsS0FBekUsRUFBK0UsS0FBL0UsRUFBcUYsS0FBckYsRUFBMkYsS0FBM0YsRUFBaUcsS0FBakcsRUFBdUcsS0FBdkcsRUFBNkcsS0FBN0csRUFBbUgsSUFBbkgsRUFBd0gsS0FBeEgsRUFBOEgsS0FBOUgsRUFBb0ksS0FBcEksRUFBMEksS0FBMUksRUFBZ0osS0FBaEosRUFBc0osS0FBdEosRUFBNEosS0FBNUosRUFBa0ssS0FBbEssRUFBd0ssS0FBeEssRUFBOEssS0FBOUssRUFBb0wsS0FBcEwsRUFBMEwsS0FBMUwsRUFBZ00sS0FBaE0sRUFBc00sS0FBdE0sRUFBNE0sS0FBNU0sRUFBa04sS0FBbE4sRUFBd04sS0FBeE4sRUFBOE4sS0FBOU4sRUFBb08sS0FBcE8sRUFBME8sS0FBMU8sRUFBZ1AsS0FBaFAsRUFBc1AsS0FBdFAsRUFBNFAsS0FBNVA7UUFDcEIsWUFBQSxHQUNFO1VBQUEsTUFBQSxFQUFRLEVBQVI7VUFDQSxNQUFBLEVBQVEsRUFEUjtVQUVBLE1BQUEsRUFBUSxFQUZSOztRQUdGLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQUMsQ0FBRDtpQkFBTyxpQkFBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFDLENBQUMsSUFBNUIsQ0FBQSxLQUFxQyxDQUFDO1FBQTdDLENBQVo7UUFFUCxXQUFBLEdBQWMsU0FBQyxDQUFEO0FBQ1osY0FBQTtVQUFBLEdBQUEsR0FDRTtZQUFBLEdBQUEsRUFBTyxDQUFDLENBQUMsSUFBVDtZQUNBLElBQUEsRUFBTyxjQUFBLENBQWUsU0FBZixFQUEwQixDQUFDLENBQUMsSUFBNUIsRUFBa0MsSUFBbEMsQ0FEUDtZQUVBLEtBQUEsRUFBTyxDQUFDLENBQUUsQ0FBQSxNQUFBLENBRlY7O1VBR0YsSUFBRyxDQUFDLENBQUMsSUFBRixLQUFVLE9BQWI7WUFDRSxHQUFHLENBQUMsTUFBSixHQUFhLEtBRGY7O0FBRUEsaUJBQU87UUFQSztRQVFkLFNBQUEsR0FBWSxTQUFDLENBQUQsRUFBRyxDQUFIO2lCQUFTLENBQUMsQ0FBQyxLQUFGLEdBQVEsQ0FBQyxDQUFDO1FBQW5CO2VBRVosQ0FBQSxDQUFFLHNDQUFGLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQTtBQUM3QyxjQUFBO1VBQUEsR0FBQSxHQUFVLENBQUEsQ0FBRSxJQUFGO1VBQ1YsT0FBQSxHQUFVLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVDtVQUNWLE9BQUEsR0FBVSxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQ7VUFFVixVQUFBLEdBQWEsSUFDWCxDQUFDLE1BRFUsQ0FDSCxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLE9BQUYsS0FBYSxPQUFiLElBQXlCLENBQUUsQ0FBQSxNQUFBLENBQUYsS0FBYTtVQUE3QyxDQURHLENBRVgsQ0FBQyxHQUZVLENBRU4sV0FGTSxDQUdYLENBQUMsSUFIVSxDQUdMLFNBSEs7VUFJYixXQUFBLEdBQWMsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQyxHQUFGLEtBQVM7VUFBaEIsQ0FBbEI7VUFFZCxLQUFBLEdBQVksSUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixPQUFBLEdBQVEseUJBQXhCLEVBQ1Y7WUFBQSxXQUFBLEVBQWEsSUFBYjtZQUNBLEtBQUEsRUFBTyxJQURQO1lBRUEsR0FBQSxFQUFLO2NBQUEsQ0FBQSxFQUFHLE1BQUg7YUFGTDtZQUdBLE1BQUEsRUFDRTtjQUFBLEdBQUEsRUFBSyxFQUFMO2FBSkY7V0FEVTtVQU1aLE1BQUEsR0FDRTtZQUFBLEtBQUEsRUFBTyxZQUFhLENBQUEsT0FBQSxDQUFwQjtZQUNBLEtBQUEsRUFBVSxJQUFBLEtBQVEsSUFBWCxHQUFxQixpQkFBckIsR0FBNEMsZUFEbkQ7O1VBRUYsSUFBRyxPQUFBLEtBQVcsTUFBZDtZQUNFLE1BQU0sQ0FBQyxLQUFQLEdBQWtCLElBQUEsS0FBUSxJQUFYLEdBQXFCLG1CQUFyQixHQUE4QyxxQkFEL0Q7O1VBRUEsS0FDRSxDQUFDLFNBREgsQ0FDYSxNQURiLENBRUUsQ0FBQyxPQUZILENBRVcsVUFGWDtVQUlBLElBQUcsV0FBVyxDQUFDLE1BQVosR0FBcUIsQ0FBeEI7WUFDRSxHQUFHLENBQUMsSUFBSixDQUFTLG9CQUFULENBQThCLENBQUMsSUFBL0IsQ0FBb0MsVUFBQSxHQUFhLFdBQVksQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUE1QixHQUFvQyxZQUF4RSxFQURGOztpQkFHQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixTQUFBO21CQUFHLEtBQUssQ0FBQyxRQUFOLENBQUE7VUFBSCxDQUFqQjtRQTdCNkMsQ0FBL0M7TUFyQkssQ0FIVDtJQUZpQzs7QUF5RG5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQThCQSxJQUFHLENBQUEsQ0FBRSxrQkFBRixDQUFxQixDQUFDLE1BQXRCLEdBQStCLENBQWxDO01BQ0UsZ0JBQUEsQ0FBQSxFQURGOzs7QUFHQTs7Ozs7Ozs7OztJQVdBLElBQUcsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsTUFBN0IsR0FBc0MsQ0FBekM7TUFDRSwrQkFBQSxDQUFBLEVBREY7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7O0lBaUJBLElBQUcsQ0FBQSxDQUFFLGtDQUFGLENBQXFDLENBQUMsTUFBdEMsR0FBK0MsQ0FBbEQ7TUFDRSx5Q0FBQSxDQUFBLEVBREY7O0lBR0EsSUFBRyxDQUFBLENBQUUsOEJBQUYsQ0FBaUMsQ0FBQyxNQUFsQyxHQUEyQyxDQUE5QztNQUNFLGtDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSxjQUFGLENBQWlCLENBQUMsTUFBbEIsR0FBMkIsQ0FBOUI7TUFDRSxpQ0FBQSxDQUFBLEVBREY7O0lBR0EsSUFBRyxDQUFBLENBQUUsc0NBQUYsQ0FBeUMsQ0FBQyxNQUExQyxHQUFtRCxDQUF0RDtNQUNFLGdDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSwwQkFBRixDQUE2QixDQUFDLE1BQTlCLEdBQXVDLENBQTFDO01BQ0UseUJBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBM0M7YUFDRSw4QkFBQSxDQUFBLEVBREY7O0VBM1lELENBQUQsQ0FBQSxDQThZRSxNQTlZRjtBQUFBIiwiZmlsZSI6InZhY2NpbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBAc3ZnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuYXR0ciBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFyR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdCYXIgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICAgLnBhZGRpbmdJbm5lcigwLjEpXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBiYXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYWN0aXZlJyBlbHNlICdiYXInXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgIyBkcmF3IGxhYmVscyB4XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXggYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteCdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnMS4yNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICAjIGRyYXcgbGFiZWxzIHlcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteSBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC15J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICctMC41ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS55XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAgICAgIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSlcbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgKGQpID0+IEBoZWlnaHQgLSBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckxhYmVsWERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAaGVpZ2h0XG5cbiAgc2V0QmFyTGFiZWxZRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICB1bmxlc3MgZC5hY3RpdmVcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgIiwiY2xhc3Mgd2luZG93LkxpbmVHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIHlGb3JtYXQ6IGQzLmZvcm1hdCgnZCcpICAgIyBzZXQgbGFiZWxzIGhvdmVyIGZvcm1hdFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnTGluZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMgZGF0YVxuICAgIHN1cGVyKGRhdGEpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgeWVhcnMgPSBbXVxuICAgIGQzLmtleXMoZGF0YVswXSkuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGlmICtkXG4gICAgICAgIHllYXJzLnB1c2ggK2RcbiAgICByZXR1cm4geWVhcnMuc29ydCgpXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkW0BvcHRpb25zLmtleS54XSwgJ2VuICcsIHllYXIpO1xuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja0Zvcm1hdCBkMy5mb3JtYXQoJycpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgIyBzZXR1cCBsaW5lXG4gICAgQGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgIC54IChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAueSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICAjIHNldHVwIGFyZWFcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhID0gZDMuYXJlYSgpXG4gICAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgICAgLnggIChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAgIC55MCBAaGVpZ2h0XG4gICAgICAgIC55MSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gW0B5ZWFyc1swXSwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbMCwgZDMubWF4IEBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkLnZhbHVlcykpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGNsZWFyIGdyYXBoIGJlZm9yZSBzZXR1cFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuZ3JhcGgnKS5yZW1vdmUoKVxuICAgICMgZHJhdyBncmFwaCBjb250YWluZXIgXG4gICAgQGdyYXBoID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2dyYXBoJ1xuICAgICMgZHJhdyBsaW5lc1xuICAgIEBkcmF3TGluZXMoKVxuICAgICMgZHJhdyBhcmVhc1xuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGRyYXdBcmVhcygpXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAZHJhd0xhYmVscygpXG4gICAgIyBkcmF3IG1vdXNlIGV2ZW50cyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGRyYXdMaW5lTGFiZWxIb3ZlcigpXG4gICAgICAjIGVsc2VcbiAgICAgICMgICBAZHJhd1Rvb2x0aXAoKVxuICAgICAgQGRyYXdSZWN0T3ZlcmxheSgpXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGFyZWEgeTBcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhLnkwIEBoZWlnaHRcbiAgICAjIHVwZGF0ZSB5IGF4aXMgdGlja3Mgd2lkdGhcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuYXR0ciAnZCcsIEBhcmVhXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy5vdmVybGF5JylcbiAgICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMaW5lczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiByZXR1cm4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcblxuICBkcmF3QXJlYXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXJlYSdcbiAgICAgIC5hdHRyICAnaWQnLCAgICAoZCkgPT4gJ2FyZWEtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuXG4gIGRyYXdMYWJlbHM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnZW5kJ1xuICAgICAgLmF0dHIgJ2R5JywgJy0wLjEyNWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG5cbiAgZHJhd0xpbmVMYWJlbEhvdmVyOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtcG9pbnQtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLXBvaW50J1xuICAgICAgLmF0dHIgJ3InLCA0XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAndGljay1ob3ZlcidcbiAgICAgIC5hdHRyICdkeScsICcwLjcxZW0nICAgICAgXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIGlmIEBkYXRhLmxlbmd0aCA9PSAxXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLWhvdmVyJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAuYXR0ciAnZHknLCAnLTAuNWVtJ1xuICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBkcmF3UmVjdE92ZXJsYXk6IC0+XG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ292ZXJsYXknXG4gICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VNb3ZlXG4gICAgICAub24gJ21vdXNlb3V0JywgIEBvbk1vdXNlT3V0XG4gICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuXG4gIHNldExhYmVsRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCBAd2lkdGhcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGQudmFsdWVzW0B5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXSlcblxuICBzZXRPdmVybGF5RGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3dpZHRoJywgQHdpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGhlaWdodFxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkZWwudHJpZ2dlciAnbW91c2VvdXQnXG4gICAgQGhpZGVMYWJlbCgpXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIHllYXIgPSBNYXRoLnJvdW5kIEB4LmludmVydChwb3NpdGlvblswXSlcbiAgICBpZiB5ZWFyICE9IEBjdXJyZW50WWVhclxuICAgICAgQCRlbC50cmlnZ2VyICdjaGFuZ2UteWVhcicsIHllYXJcbiAgICAgIEBzZXRMYWJlbCB5ZWFyXG5cbiAgc2V0TGFiZWw6ICh5ZWFyKSAtPlxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICBAeEF4aXMudGlja1ZhbHVlcyBbeWVhcl1cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmVhY2ggKGQpID0+IEBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uIGRcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAgLmF0dHIgJ3gnLCBNYXRoLnJvdW5kIEB4KEBjdXJyZW50WWVhcilcbiAgICAgIC50ZXh0IEBjdXJyZW50WWVhclxuXG4gIGhpZGVMYWJlbDogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbjogKGRhdGEpID0+XG4gICAgIyBnZXQgY3VycmVudCB5ZWFyXG4gICAgeWVhciA9IEBjdXJyZW50WWVhclxuICAgIHdoaWxlIEB5ZWFycy5pbmRleE9mKHllYXIpID09IC0xICYmIEBjdXJyZW50WWVhciA+IEB5ZWFyc1swXVxuICAgICAgeWVhci0tXG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgICMgZ2V0IHBvaW50ICYgbGFiZWxcbiAgICBwb2ludCA9IGQzLnNlbGVjdCgnI2xpbmUtbGFiZWwtcG9pbnQtJytkYXRhW0BvcHRpb25zLmtleS5pZF0pXG4gICAgbGFiZWwgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICMgaGlkZSBwb2ludCAmIGxhYmVsIGlzIHRoZXJlIGlzIG5vIGRhdGFcbiAgICB1bmxlc3MgZGF0YS52YWx1ZXNbeWVhcl1cbiAgICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgcmV0dXJuXG4gICAgIyBzaG93IHBvaW50ICYgbGFiZWwgaWYgdGhlcmUncyBkYXRhXG4gICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICMgc2V0IGxpbmUgbGFiZWwgcG9pbnRcbiAgICBwb2ludFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAjIHNldCBsaW5lIGxhYmVsIGhvdmVyXG4gICAgbGFiZWxcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICAgLnRleHQgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHlGb3JtYXQoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgJydcbiAgICAgIFxuICBzZXRUaWNrSG92ZXJQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd5JywgTWF0aC5yb3VuZCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArOSIsImNsYXNzIHdpbmRvdy5IZWF0bWFwR3JhcGggZXh0ZW5kcyBCYXNlR3JhcGhcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdIZWF0bWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBAbGFuZyA9ICQoJ2JvZHknKS5kYXRhICdsYW5nJ1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgICAgICAgPSBudWxsXG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCAnIycrQGlkKycgLmhlYXRtYXAtY29udGFpbmVyJ1xuICAgIEAkdG9vbHRpcCAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgICMgR2V0IHllYXJzICh4IHNjYWxlKVxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyhkYXRhKVxuICAgICMgR2V0IGNvdW50cmllcyAoeSBzY2FsZSlcbiAgICBAY291bnRyaWVzID0gZGF0YS5tYXAgKGQpIC0+IGQuY29kZVxuICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4gICAgQGNlbGxzRGF0YSA9IEBnZXRDZWxsc0RhdGEgZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZ2V0RGltZW5zaW9ucygpICMgZm9yY2UgdXBkYXRlIGRpbWVuc2lvbnNcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICBtaW5ZZWFyID0gZDMubWluIGRhdGEsIChkKSAtPiBkMy5taW4oZDMua2V5cyhkLnZhbHVlcykpXG4gICAgbWF4WWVhciA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIHllYXJzID0gZDMucmFuZ2UgbWluWWVhciwgbWF4WWVhciwgMVxuICAgIHllYXJzLnB1c2ggK21heFllYXJcbiAgICByZXR1cm4geWVhcnNcblxuICBnZXRDZWxsc0RhdGE6IChkYXRhKSAtPlxuICAgIGNlbGxzRGF0YSA9IFtdXG4gICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4gICAgICAgIGNlbGxzRGF0YS5wdXNoXG4gICAgICAgICAgY291bnRyeTogZC5jb2RlXG4gICAgICAgICAgbmFtZTogICAgZC5uYW1lXG4gICAgICAgICAgeWVhcjogICAgdmFsdWVcbiAgICAgICAgICBjYXNlczogICBkLmNhc2VzW3ZhbHVlXVxuICAgICAgICAgIHZhbHVlOiAgIGQudmFsdWVzW3ZhbHVlXVxuICAgIHJldHVybiBjZWxsc0RhdGFcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXJcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBzdXBlcigpXG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgNF0gICMgVE9ETyEhISAtPiBNYWtlIHRoaXMgZHluYW1pY1xuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgZ2V0U2NhbGVZUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAaGVpZ2h0XVxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQHllYXJzIFxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gQGNvdW50cmllcyBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIEB3aWR0aCA9IEAkZWwud2lkdGgoKSAtIDEwMCAgIyB5IGF4aXMgd2lkdGggPSAxMDBcbiAgICBpZiBAeWVhcnMgYW5kIEBjb3VudHJpZXNcbiAgICAgIGNlbGxTaXplID0gTWF0aC5mbG9vciBAd2lkdGggLyBAeWVhcnMubGVuZ3RoXG4gICAgICBAaGVpZ2h0ID0gaWYgY2VsbFNpemUgPCAyMCB0aGVuIGNlbGxTaXplICogQGNvdW50cmllcy5sZW5ndGggZWxzZSAyMCAqIEBjb3VudHJpZXMubGVuZ3RoXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBzZXR1cCBzY2FsZXMgcmFuZ2VcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBjb250YWluZXIgaGVpZ2h0XG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgIyBkcmF3IGNlbGxzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuZGF0YShAY2VsbHNEYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbCdcbiAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IoZC52YWx1ZSlcbiAgICAgIC5vbiAgICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAub24gICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAgIC5jYWxsICBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICAjIGRyYXcgeWVhcnMgeCBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAneC1heGlzIGF4aXMnXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAeWVhcnMuZmlsdGVyKChkKSAtPiBkICUgNSA9PSAwKSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgICAuaHRtbCAgKGQpIC0+IGRcbiAgICAjIGRyYXcgY291bnRyaWVzIHkgYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJylcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEBjb3VudHJpZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgICAuaHRtbCAoZCkgPT4gQGdldENvdW50cnlOYW1lIGRcbiAgICAjIGRyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YSBAZGF0YS5tYXAoKGQpIC0+IHtjb2RlOiBkLmNvZGUsIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb259KS5maWx0ZXIoKGQpIC0+ICFpc05hTiBkLnllYXIpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHNjYWxlc1xuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBjb250YWluZXJzXG4gICAgQGNvbnRhaW5lclxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0ICsgJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNlbGwnKVxuICAgICAgLmNhbGwgQHNldENlbGxEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LWF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnktYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0TWFya2VyRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0Q2VsbERpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBAeChkLnllYXIpKydweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpID0+IEB5KGQuY291bnRyeSkrJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEB5LmJhbmR3aWR0aCgpKydweCdcblxuICBzZXRNYXJrZXJEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb2RlKSsncHgnXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBpZiBkLnllYXIgPCBAeWVhcnNbMF0gdGhlbiBAeChAeWVhcnNbMF0pLTEgKyAncHgnIGVsc2UgaWYgZC55ZWFyIDwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0gdGhlbiBAeChkLnllYXIpLTErJ3B4JyBlbHNlIEB4LmJhbmR3aWR0aCgpK0B4KEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEB5LmJhbmR3aWR0aCgpKydweCdcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgb2Zmc2V0ICAgICAgICAgICA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgIGNhc2VzX3N0ciAgICAgICAgPSBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc29zJyBlbHNlICdjYXNlcydcbiAgICBjYXNlc19zaW5nbGVfc3RyID0gaWYgQGxhbmcgPT0gJ2VzJyB0aGVuICdjYXNvJyBlbHNlICdjYXNlJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb3VudHJ5J1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnllYXInXG4gICAgICAuaHRtbCBkLnllYXJcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RGVjaW1hbChkLnZhbHVlLCBAbGFuZylcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAuaHRtbCBpZiBkLmNhc2VzICE9IDEgdGhlbiBkLmNhc2VzLnRvTG9jYWxlU3RyaW5nKEBsYW5nKSArICcgJyArIGNhc2VzX3N0ciBlbHNlIGQuY2FzZXMudG9Mb2NhbGVTdHJpbmcoQGxhbmcpICsgJyAnICsgY2FzZXNfc2luZ2xlX3N0clxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIG9mZnNldC5sZWZ0ICsgQHguYmFuZHdpZHRoKCkgKiAwLjUgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIG9mZnNldC50b3AgLSAoQHkuYmFuZHdpZHRoKCkgKiAwLjUpIC0gQCR0b29sdGlwLmhlaWdodCgpXG4gICAgICAnb3BhY2l0eSc6ICcxJ1xuICAgIHJldHVyblxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcbiAgICByZXR1cm5cblxuICBnZXRDb3VudHJ5TmFtZTogKGNvZGUpID0+XG4gICAgY291bnRyeSA9IEBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICByZXR1cm4gaWYgY291bnRyeVswXSB0aGVuIGNvdW50cnlbMF0ubmFtZSBlbHNlICcnXG5cbiAgZm9ybWF0RGVjaW1hbDogKG51bWJlciwgbGFuZykgLT5cbiAgICByZXR1cm4gaWYgbnVtYmVyIDwgMC4wMDEgdGhlbiAwIGVsc2UgaWYgbnVtYmVyID49IDAuMSB0aGVuIG51bWJlci50b0ZpeGVkKDEpLnRvTG9jYWxlU3RyaW5nKGxhbmcpIGVsc2UgaWYgbnVtYmVyID49IDAuMDEgdGhlbiBudW1iZXIudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZyhsYW5nKSBlbHNlIG51bWJlci50b0ZpeGVkKDMpLnRvTG9jYWxlU3RyaW5nKGxhbmcpXG5cblxuXG4jIFZhY2NpbmVEaXNlYXNlR3JhcGggPSAoX2lkKSAtPlxuIyAgICQgPSBqUXVlcnkubm9Db25mbGljdCgpXG4jICAgWV9BWElTX1dJRFRIID0gMTAwXG4jICAgIyBNdXN0IGJlIHRoZSBhbWUgdmFsdWUgdGhhbiAjdmFjY2luZS1kaXNlYXNlLWdyYXBoICRwYWRkaW5nLWxlZnQgc2NzcyB2YXJpYWJsZVxuIyAgIHRoYXQgPSB0aGlzXG4jICAgaWQgPSBfaWRcbiMgICBkaXNlYXNlID0gdW5kZWZpbmVkXG4jICAgc29ydCA9IHVuZGVmaW5lZFxuIyAgIGxhbmcgPSB1bmRlZmluZWRcbiMgICBkYXRhID0gdW5kZWZpbmVkXG4jICAgZGF0YVBvcHVsYXRpb24gPSB1bmRlZmluZWRcbiMgICBjdXJyZW50RGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNlbGxEYXRhID0gdW5kZWZpbmVkXG4jICAgY291bnRyaWVzID0gdW5kZWZpbmVkXG4jICAgeWVhcnMgPSB1bmRlZmluZWRcbiMgICBjZWxsU2l6ZSA9IHVuZGVmaW5lZFxuIyAgIGNvbnRhaW5lciA9IHVuZGVmaW5lZFxuIyAgIHggPSB1bmRlZmluZWRcbiMgICB5ID0gdW5kZWZpbmVkXG4jICAgd2lkdGggPSB1bmRlZmluZWRcbiMgICBoZWlnaHQgPSB1bmRlZmluZWRcbiMgICAkZWwgPSB1bmRlZmluZWRcbiMgICAkdG9vbHRpcCA9IHVuZGVmaW5lZFxuIyAgICMgUHVibGljIE1ldGhvZHNcblxuIyAgIHRoYXQuaW5pdCA9IChfZGlzZWFzZSwgX3NvcnQpIC0+XG4jICAgICBkaXNlYXNlID0gX2Rpc2Vhc2VcbiMgICAgIHNvcnQgPSBfc29ydFxuIyAgICAgI2NvbnNvbGUubG9nKCdWYWNjaW5lIEdyYXBoIGluaXQnLCBpZCwgZGlzZWFzZSwgc29ydCk7XG4jICAgICAkZWwgPSAkKCcjJyArIGlkKVxuIyAgICAgJHRvb2x0aXAgPSAkZWwuZmluZCgnLnRvb2x0aXAnKVxuIyAgICAgbGFuZyA9ICRlbC5kYXRhKCdsYW5nJylcbiMgICAgIHggPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIHkgPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsKGQzLmludGVycG9sYXRlT3JSZClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgY2xlYXIoKVxuIyAgICAgICBzZXR1cERhdGEoKVxuIyAgICAgICBzZXR1cEdyYXBoKClcbiMgICAgIGVsc2VcbiMgICAgICAgIyBMb2FkIENTVnNcbiMgICAgICAgZDMucXVldWUoKS5kZWZlcihkMy5jc3YsICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykgKyAnL2Fzc2V0cy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLmNzdicpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvYXNzZXRzL2RhdGEvcG9wdWxhdGlvbi5jc3YnKS5hd2FpdCBvbkRhdGFSZWFkeVxuIyAgICAgdGhhdFxuXG4jICAgdGhhdC5vblJlc2l6ZSA9IC0+XG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgdXBkYXRlR3JhcGgoKVxuIyAgICAgdGhhdFxuXG4jICAgb25EYXRhUmVhZHkgPSAoZXJyb3IsIGRhdGFfY3N2LCBwb3B1bGF0aW9uX2NzdikgLT5cbiMgICAgIGRhdGEgPSBkYXRhX2NzdlxuIyAgICAgZGF0YVBvcHVsYXRpb24gPSBwb3B1bGF0aW9uX2NzdlxuIyAgICAgIyB3ZSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGF0dHJpYnV0ZVxuIyAgICAgZGVsZXRlIGRhdGEuY29sdW1uc1xuIyAgICAgIyBXZSBjYW4gZGVmaW5lIGEgZmlsdGVyIGZ1bmN0aW9uIHRvIHNob3cgb25seSBzb21lIHNlbGVjdGVkIGNvdW50cmllc1xuIyAgICAgaWYgdGhhdC5maWx0ZXJcbiMgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHRoYXQuZmlsdGVyKVxuIyAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPSBkLmRpc2Vhc2UudG9Mb3dlckNhc2UoKVxuIyAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgICAgZC55ZWFyX2ludHJvZHVjdGlvbiA9ICtkLnllYXJfaW50cm9kdWN0aW9uLnJlcGxhY2UoJ3ByaW9yIHRvJywgJycpXG4jICAgICAgIGQuY2FzZXMgPSB7fVxuIyAgICAgICBkLnZhbHVlcyA9IHt9XG4jICAgICAgICMgc2V0IHZhbHVlIGVzIGNhc2VzIC8xMDAwIGhhYml0YW50c1xuIyAgICAgICBwb3B1bGF0aW9uSXRlbSA9IHBvcHVsYXRpb25fY3N2LmZpbHRlcigoY291bnRyeSkgLT5cbiMgICAgICAgICBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4jICAgICAgIClcbiMgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuIyAgICAgICAgIHllYXIgPSAxOTgwXG4jICAgICAgICAgd2hpbGUgeWVhciA8IDIwMTZcbiMgICAgICAgICAgIGlmIGRbeWVhcl1cbiMgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuIyAgICAgICAgICAgICBpZiBwb3B1bGF0aW9uICE9IDBcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IDEwMDAgKiAoK2RbeWVhcl0gLyBwb3B1bGF0aW9uKTtcbiMgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiMgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiMgICAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiMgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBjYXNvcyBkZSAnICsgZC5kaXNlYXNlICsgJyBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgJzonLCBkW3llYXJdLCB0eXBlb2YgZFt5ZWFyXSk7XG4jICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuIyAgICAgICAgICAgeWVhcisrXG4jICAgICAgIGVsc2VcbiMgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuIyAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuIyAgICAgICBkLnRvdGFsID0gZDMudmFsdWVzKGQudmFsdWVzKS5yZWR1Y2UoKChhLCBiKSAtPlxuIyAgICAgICAgIGEgKyBiXG4jICAgICAgICksIDApXG4jICAgICAgIHJldHVyblxuIyAgICAgc2V0dXBEYXRhKClcbiMgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cERhdGEgPSAtPlxuIyAgICAgIyBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCBkaXNlYXNlXG4jICAgICBjdXJyZW50RGF0YSA9IGRhdGEuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPT0gZGlzZWFzZSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4jICAgICApXG4jICAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4jICAgICAjIEdldCBhcnJheSBvZiBjb3VudHJ5IG5hbWVzXG4jICAgICBjb3VudHJpZXMgPSBjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIGQuY29kZVxuIyAgICAgKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgeWVhcnNcbiMgICAgIG1pblllYXIgPSBkMy5taW4oY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5taW4gZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIG1heFllYXIgPSBkMy5tYXgoY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5tYXggZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIHllYXJzID0gZDMucmFuZ2UobWluWWVhciwgbWF4WWVhciwgMSlcbiMgICAgIHllYXJzLnB1c2ggK21heFllYXJcbiMgICAgICNjb25zb2xlLmxvZyhtaW5ZZWFyLCBtYXhZZWFyLCB5ZWFycyk7XG4jICAgICAjY29uc29sZS5sb2coY291bnRyaWVzKTtcbiMgICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4jICAgICBjZWxsc0RhdGEgPSBbXVxuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaCAoZCkgLT5cbiMgICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4jICAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiMgICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuIyAgICAgICAgICAgbmFtZTogZC5uYW1lXG4jICAgICAgICAgICB5ZWFyOiB2YWx1ZVxuIyAgICAgICAgICAgY2FzZXM6IGQuY2FzZXNbdmFsdWVdXG4jICAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbdmFsdWVdXG4jICAgICAgIHJldHVyblxuXG4jICAgICAjIyNcbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2goZnVuY3Rpb24oZCl7XG4jICAgICAgIHZhciBjb3VudGVyID0gMDtcbiMgICAgICAgeWVhcnMuZm9yRWFjaChmdW5jdGlvbih5ZWFyKXtcbiMgICAgICAgICBpZiAoZFt5ZWFyXSlcbiMgICAgICAgICAgIGNvdW50ZXIrKztcbiMgICAgICAgfSk7XG4jICAgICAgIGlmKGNvdW50ZXIgPD0gMjApIC8vIHllYXJzLmxlbmd0aC8yKVxuIyAgICAgICAgIGNvbnNvbGUubG9nKGQubmFtZSArICcgaGFzIG9ubHkgdmFsdWVzIGZvciAnICsgY291bnRlciArICcgeWVhcnMnKTtcbiMgICAgIH0pO1xuIyAgICAgIyMjXG5cbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBHcmFwaCA9IC0+XG4jICAgICAjIEdldCBkaW1lbnNpb25zIChoZWlnaHQgaXMgYmFzZWQgb24gY291bnRyaWVzIGxlbmd0aClcbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgeC5kb21haW4oeWVhcnMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICB3aWR0aFxuIyAgICAgXVxuIyAgICAgeS5kb21haW4oY291bnRyaWVzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgaGVpZ2h0XG4jICAgICBdXG4jICAgICAjY29sb3IuZG9tYWluKFtkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pLCAwXSk7XG4jICAgICBjb2xvci5kb21haW4gW1xuIyAgICAgICAwXG4jICAgICAgIDRcbiMgICAgIF1cbiMgICAgICNjb25zb2xlLmxvZygnTWF4aW11bSBjYXNlcyB2YWx1ZTogJysgZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSk7XG4jICAgICAjIEFkZCBzdmdcbiMgICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycgKyBpZCArICcgLmdyYXBoLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKVxuIyAgICAgIyBEcmF3IGNlbGxzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKS5zZWxlY3RBbGwoJy5jZWxsJykuZGF0YShjZWxsc0RhdGEpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsJykuc3R5bGUoJ2JhY2tncm91bmQnLCAoZCkgLT5cbiMgICAgICAgY29sb3IgZC52YWx1ZVxuIyAgICAgKS5jYWxsKHNldENlbGxEaW1lbnNpb25zKS5vbignbW91c2VvdmVyJywgb25Nb3VzZU92ZXIpLm9uICdtb3VzZW91dCcsIG9uTW91c2VPdXRcbiMgICAgICMgRHJhdyB5ZWFycyB4IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3gtYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YSh5ZWFycy5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQgJSA1ID09IDBcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgnbGVmdCcsIChkKSAtPlxuIyAgICAgICB4KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBkXG4jICAgICAjIERyYXcgY291bnRyaWVzIHkgYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKGNvdW50cmllcykuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCd0b3AnLCAoZCkgLT5cbiMgICAgICAgeShkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZ2V0Q291bnRyeU5hbWUgZFxuIyAgICAgIyBEcmF3IHllYXIgaW50cm9kdWN0aW9uIG1hcmtcbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpLmRhdGEoY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICB7XG4jICAgICAgICAgY29kZTogZC5jb2RlXG4jICAgICAgICAgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvblxuIyAgICAgICB9XG4jICAgICApLmZpbHRlcigoZCkgLT5cbiMgICAgICAgIWlzTmFOKGQueWVhcilcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdtYXJrZXInKS5jYWxsIHNldE1hcmtlckRpbWVuc2lvbnNcbiMgICAgIHJldHVyblxuXG4jICAgY2xlYXIgPSAtPlxuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykucmVtb3ZlKClcbiMgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5heGlzJykucmVtb3ZlKClcbiMgICAgIHJldHVyblxuXG5cblxuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLTEtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IChkKSAtPiBkXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuIiwiY2xhc3Mgd2luZG93LlNjYXR0ZXJwbG90R3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgY29uc29sZS5sb2cgJ2dldFNjYWxlWERvbWFpbicsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdKVxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICBjb25zb2xlLmxvZyAnZ2V0U2NhbGVZRG9tYWluJywgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUubG9nIEBkYXRhXG4gICAgIyBkcmF3IHBvaW50c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ3InLCA2XG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90LWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAuYXR0ciAnZHknLCAnMC4zNzVlbSdcbiAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0RG90c0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgc2V0RG90TGFiZWxzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBvdmVycmlkIHggYXhpcyBwb3NpdGlvbmluZ1xuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG4gICAgIiwiIyBNYWluIHNjcmlwdCBmb3IgdmFjY2luZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuXG4gICMgSW5pdCBUb29sdGlwc1xuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpXG5cblxuICAjIGdldCBjb3VudHJ5IG5hbWUgYXV4aWxpYXIgbWV0aG9kXG4gIGdldENvdW50cnlOYW1lID0gKGNvdW50cmllcywgY29kZSwgbGFuZykgLT5cbiAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICBpZiBpdGVtXG4gICAgICBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBjb2RlXG5cblxuICAjIFZpZGVvIG9mIG1hcCBwb2xpbyBjYXNlc1xuICBzZXRWaWRlb01hcFBvbGlvID0gLT5cbiAgICB3cmFwcGVyID0gUG9wY29ybi5IVE1MWW91VHViZVZpZGVvRWxlbWVudCgnI3ZpZGVvLW1hcC1wb2xpbycpXG4gICAgd3JhcHBlci5zcmMgPSAnaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9sMUYyWGQ1RkZsUT9jb250cm9scz0wJnNob3dpbmZvPTAmaGQ9MSdcbiAgICBwb3Bjb3JuID0gUG9wY29ybih3cmFwcGVyKVxuICAgIG5vdGVzID0gMjAxNiAtIDE5ODBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPD0gbm90ZXNcbiAgICAgIHBvcGNvcm4uZm9vdG5vdGVcbiAgICAgICAgc3RhcnQ6ICAxLjYyMjIgKiBpXG4gICAgICAgIGVuZDogICAgMS42MjIyICogKGkgKyAxKVxuICAgICAgICB0ZXh0OiAgIDE5ODAgKyBpXG4gICAgICAgIHRhcmdldDogJ3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbidcbiAgICAgIGkrK1xuICAgICMgU2hvdyBjb3ZlciB3aGVuIHZpZGVvIGVuZGVkXG4gICAgd3JhcHBlci5hZGRFdmVudExpc3RlbmVyICdlbmRlZCcsIChlKSAtPlxuICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVJbigpXG4gICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJykuZmFkZVRvIDMwMCwgMFxuICAgICAgcG9wY29ybi5jdXJyZW50VGltZSAwXG4gICAgIyBTaG93IHZpZGVvIHdoZW4gcGxheSBidG4gY2xpY2tlZFxuICAgICQoJyN2aWRlby1tYXAtcG9saW8tcGxheS1idG4nKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgcG9wY29ybi5wbGF5KClcbiAgICAgICQoJy52aWRlby1tYXAtcG9saW8tY292ZXInKS5mYWRlT3V0KClcbiAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nKS5mYWRlVG8gMzAwLCAxXG5cblxuICAjIE1lYXNsZXMgV29ybGQgTWFwIEdyYXBoXG4gIHNldHVwTWVhc2xlc1dvcmxkTWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvYXNzZXRzL2RhdGEvbWVhc2xlcy1jYXNlcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGdldCBjYXNlcyBvYmplY3Qgd2l0aCByZWdpb24ga2V5XG4gICAgICAgIGNhc2VzID0ge31cbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGNhc2VzW2QucmVnaW9uXSA9ICtkLmNhc2VzKjEwMDAwMFxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgY291bnRyaWVzLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgZC52YWx1ZSA9IGNhc2VzW2QucmVnaW9uXVxuICAgICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytsYW5nXVxuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZXNcbiAgICAgICAgICBkZWxldGUgZC5uYW1lX2VuXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgnbWVhc2xlcy13b3JsZC1tYXAtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46IFxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5zZXREYXRhIGNvdW50cmllcywgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIE1lYXNsZXMgY2FzZXMgSGVhdG1hcCBHcmFwaFxuICBzZXR1cEhlYXRNYXBHcmFwaCA9IChpZCwgZGF0YSwgY291bnRyaWVzKSAtPlxuICAgIGRhdGEgPSBkYXRhXG4gICAgICAuZmlsdGVyIChkKSAtPiBjb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpICE9IC0xIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiAgICAgIC5zb3J0IChhLGIpIC0+IGEudG90YWwgLSBiLnRvdGFsXG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkhlYXRtYXBHcmFwaChpZCxcbiAgICAgIG1hcmdpbjogXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGxlZnQ6IDApXG4gICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuM1xuICAgICAgbGFiZWw6IHRydWVcbiAgICAgIGtleTpcbiAgICAgICAgeDogJ25hbWUnXG4gICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICdjb2RlJylcbiAgICBncmFwaC5kYXRhUGFyc2VyID0gKGRhdGEpIC0+XG4gICAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgICBkLnZhbHVlID0gK2QudmFsdWVcbiAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK2xhbmddXG4gICAgICAgIGRlbGV0ZSBkLm5hbWVfZXNcbiAgICAgICAgZGVsZXRlIGQubmFtZV9lblxuICAgICAgcmV0dXJuIGRhdGFcbiAgICBncmFwaC5sb2FkRGF0YSBiYXNldXJsKycvYXNzZXRzL2RhdGEvY29uZmlkZW5jZS5jc3YnXG4gICAgZ3JhcGguJGVsLm9uICdkcmF3LWNvbXBsZXRlJywgKGUpIC0+XG4gICAgICBjb25zb2xlLmxvZyAnYmFyIGdyYXBoIGRyYXcgY29tcGxldGUnXG4gICAgICBncmFwaC5jb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdiYXIgYmFyLScrZC5yZWdpb24udG9Mb3dlckNhc2UoKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVDb25maWRlbmNlU2NhdHRlcnBsb3RHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvbmZpZGVuY2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICBsZWZ0OiA1MFxuICAgICAgICAgICAgYm90dG9tOiAyMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIHg6ICdnZHAnXG4gICAgICAgICAgICB5OiAnY29uZmlkZW5jZSdcbiAgICAgICAgICAgIGlkOiAnY291bnRyeScpXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzUwMDAsIDIwMDAwLCA0MDAwMCwgNjAwMDBdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtY2FzZXMtbWVhc2xlcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvcG9wdWxhdGlvbi5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX2Nhc2VzLCBkYXRhX3BvcHVsYXRpb24pIC0+XG4gICAgICAgIGRlbGV0ZSBkYXRhX2Nhc2VzLmNvbHVtbnMgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiAgICAgICAgZGF0YV9jYXNlcy5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiAgICAgICAgICAgIGQueWVhcl9pbnRyb2R1Y3Rpb24gPSArZC55ZWFyX2ludHJvZHVjdGlvbi5yZXBsYWNlKCdwcmlvciB0bycsICcnKVxuICAgICAgICAgIGQuY2FzZXMgPSB7fVxuICAgICAgICAgIGQudmFsdWVzID0ge31cbiAgICAgICAgICBkLm5hbWUgPSBnZXRDb3VudHJ5TmFtZSBkYXRhX3BvcHVsYXRpb24sIGQuY29kZSwgbGFuZ1xuICAgICAgICAgICMgc2V0IHZhbHVlcyBhcyBjYXNlcy8xMDAwIGhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICAgICAgICAgICAgeWVhcisrXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiAgICAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuICAgICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+IGEgKyBiKSwgMClcbiAgICAgICAgIyBGaWx0ZXIgYnkgc2VsZWN0ZWQgY291bnRyaWVzICYgZGlzZWFzZVxuICAgICAgICBzZXR1cEhlYXRNYXBHcmFwaCAndmFjY2luZXMtbWVhc2xlcy1ncmFwaC0xJywgZGF0YV9jYXNlcywgWydGSU4nLCdIVU4nLCdQUlQnLCdVUlknLCdNRVgnLCdDT0wnXVxuICAgICAgICBzZXR1cEhlYXRNYXBHcmFwaCAndmFjY2luZXMtbWVhc2xlcy1ncmFwaC0yJywgZGF0YV9jYXNlcywgWydJUlEnLCdCR1InLCdNTkcnLCdaQUYnLCdGUkEnLCdHRU8nXVxuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgIGQzLmNzdiBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICMgVXBkYXRlIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgdmFjY2luZVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICMgVXBkYXRlIGFjdGl2ZSBjb3VudHJpZXNcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yLCAjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5maW5kKCcubGluZS1sYWJlbCwgLmxpbmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgSW1tdW5pemF0aW9uIENvdmVyYWdlIExpbmUgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgY291bnRyaWVzID0gWydGUkEnLCdETksnLCdEWkEnLCdMS0EnXVxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCcsIFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IGJvdHRvbTogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwyNSw1MCw3NSwxMDBdXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMSwyMDAzLDIwMDUsMjAwNywyMDA5LDIwMTEsMjAxMywyMDE1XVxuICAgIGdyYXBoLmFkZE1hcmtlclxuICAgICAgdmFsdWU6IDk1XG4gICAgICBsYWJlbDogaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ05pdmVsIGRlIHJlYmHDsW8nIGVsc2UgJ0hlcmQgaW1tdW5pdHknXG4gICAgICBhbGlnbjogJ2xlZnQnXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBjb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpICE9IC0xKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFdvcmxkIENhc2VzIE11bHRpcGxlIFNtYWxsXG4gIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgZGlzZWFzZXMgPSBbJ2RpcGh0ZXJpYScsICdtZWFzbGVzJywncGVydHVzc2lzJywncG9saW8nLCd0ZXRhbnVzJ11cbiAgICBncmFwaHMgPSBbXVxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OiBcbiAgICAgICAgICAgIHg6ICdkaXNlYXNlJ1xuICAgICAgICAgICAgaWQ6ICdkaXNlYXNlJylcbiAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk4MCwgMjAxNV1cbiAgICAgICAgZ3JhcGgueUF4aXMudGlja3MoMikudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgaWYgZGlzZWFzZSA9PSAnbWVhc2xlcycgb3IgZGlzZWFzZSA9PSAncGVydHVzc2lzJyB0aGVuIG1heFZhbHVlMSBlbHNlIG1heFZhbHVlMl1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkaXNlYXNlX2RhdGFcbiAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgICMgU2V0dXAgY3VycmVudCBjb3VudHJ5IC0+IFRPRE8hISEgd2UgaGF2ZSB0byBnZXQgdXNlciBjb3VudHJ5XG4gICAgICAgIGNvdW50cnkgPSAnRVNQJ1xuICAgICAgICAjIEZpbHRlciBkYXRhXG4gICAgICAgIGV4Y2x1ZGVkQ291bnRyaWVzID0gWydOSVUnLCdDT0snLCdUVVYnLCdOUlUnLCdQTFcnLCdWR0InLCdNQUYnLCdTTVInLCdHSUInLCdUQ0EnLCdMSUUnLCdNQ08nLCdTWE0nLCdGUk8nLCdNSEwnLCdNTlAnLCdBU00nLCdLTkEnLCdHUkwnLCdDWScsJ0JNVScsJ0FORCcsJ0RNQScsJ0lNTicsJ0FURycsJ1NZQycsJ1ZJUicsJ0FCVycsJ0ZTTScsJ1RPTicsJ0dSRCcsJ1ZDVCcsJ0tJUicsJ0NVVycsJ0NISScsJ0dVTScsJ0xDQScsJ1NUUCcsJ1dTTScsJ1ZVVCcsJ05DTCcsJ1BZRicsJ0JSQiddXG4gICAgICAgIGhlcmRJbW11bml0eSA9IFxuICAgICAgICAgICdNQ1YxJzogOTVcbiAgICAgICAgICAnUG9sMyc6IDgwXG4gICAgICAgICAgJ0RUUDMnOiA4MFxuICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGV4Y2x1ZGVkQ291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSA9PSAtMVxuICAgICAgICAjIERhdGEgcGFyc2UgJiBzb3J0aW5nIGZ1bnRpb25zXG4gICAgICAgIGRhdGFfcGFyc2VyID0gKGQpIC0+XG4gICAgICAgICAgb2JqID0gXG4gICAgICAgICAgICBrZXk6ICAgZC5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgZ2V0Q291bnRyeU5hbWUoY291bnRyaWVzLCBkLmNvZGUsIGxhbmcpXG4gICAgICAgICAgICB2YWx1ZTogK2RbJzIwMTUnXVxuICAgICAgICAgIGlmIGQuY29kZSA9PSBjb3VudHJ5XG4gICAgICAgICAgICBvYmouYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgZGF0YV9zb3J0ID0gKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICMgbG9vcCB0aHJvdWdoIGVhY2ggZ3JhcGhcbiAgICAgICAgJCgnLmltbXVuaXphdGlvbi1jb3ZlcmFnZS1kaXNlYXNlLWdyYXBoJykuZWFjaCAtPlxuICAgICAgICAgICRlbCAgICAgPSAkKHRoaXMpXG4gICAgICAgICAgZGlzZWFzZSA9ICRlbC5kYXRhKCdkaXNlYXNlJylcbiAgICAgICAgICB2YWNjaW5lID0gJGVsLmRhdGEoJ3ZhY2NpbmUnKVxuICAgICAgICAgICMgR2V0IGdyYXBoIGRhdGEgJiB2YWx1ZVxuICAgICAgICAgIGdyYXBoX2RhdGEgPSBkYXRhXG4gICAgICAgICAgICAuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gdmFjY2luZSBhbmQgZFsnMjAxNSddICE9ICcnKVxuICAgICAgICAgICAgLm1hcChkYXRhX3BhcnNlcilcbiAgICAgICAgICAgIC5zb3J0KGRhdGFfc29ydClcbiAgICAgICAgICBncmFwaF92YWx1ZSA9IGdyYXBoX2RhdGEuZmlsdGVyKChkKSAtPiBkLmtleSA9PSBjb3VudHJ5KVxuICAgICAgICAgICMgU2V0dXAgZ3JhcGhcbiAgICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFyR3JhcGgoZGlzZWFzZSsnLWltbXVuaXphdGlvbi1iYXItZ3JhcGgnLFxuICAgICAgICAgICAgYXNwZWN0UmF0aW86IDAuMjVcbiAgICAgICAgICAgIGxhYmVsOiB0cnVlXG4gICAgICAgICAgICBrZXk6IHg6ICduYW1lJ1xuICAgICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgICB0b3A6IDIwKVxuICAgICAgICAgIG1hcmtlciA9IFxuICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgbGFiZWw6IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgIGlmIHZhY2NpbmUgPT0gJ0RUUDMnXG4gICAgICAgICAgICBtYXJrZXIubGFiZWwgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnUmVjb21lbmRhY2nDs24gT01TJyBlbHNlICdXSE8gcmVjb21tZW5kYXRpb24nXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXIgbWFya2VyXG4gICAgICAgICAgICAuc2V0RGF0YSBncmFwaF9kYXRhXG4gICAgICAgICAgIyBTZXR1cCBncmFwaCB2YWx1ZVxuICAgICAgICAgIGlmIGdyYXBoX3ZhbHVlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICRlbC5maW5kKCcuaW1tdW5pemF0aW9uLWRhdGEnKS5odG1sICc8c3Ryb25nPicgKyBncmFwaF92YWx1ZVswXS52YWx1ZSArICclPC9zdHJvbmc+J1xuICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPiBncmFwaC5vblJlc2l6ZSgpXG4gIFxuICAjIyNcbiAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicsXG4gICAgICAjaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46IFxuICAgICAgICBsZWZ0OiAwXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGJvdHRvbTogMjApXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMCwgMjAwNSwgMjAxMCwgMjAxNV1cbiAgICBncmFwaC55QXhpc1xuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIGdyYXBoLmxvYWREYXRhIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9ndWF0ZW1hbGEtY292ZXJhZ2UtbW1yLmNzdidcbiAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgIGxpbmUgPSBncmFwaC5jb250YWluZXIuc2VsZWN0KCcubGluZScpXG4gICAgICBjb25zb2xlLmxvZyBsaW5lLm5vZGUoKVxuICAgICAgbGVuZ3RoID0gbGluZS5ub2RlKCkuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIGxpbmVcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCBsZW5ndGggKyAnICcgKyBsZW5ndGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIGxlbmd0aClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSg1MDAwKVxuICAgICAgICAgIC5kdXJhdGlvbig1MDAwKVxuICAgICAgICAgIC5lYXNlKGQzLmVhc2VTaW5Jbk91dClcbiAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAwKVxuXG4gIGlmICQoJyNndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJykubGVuZ3RoID4gMFxuICAgIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGgoKVxuICAjIyNcblxuICBpZiAkKCcjdmlkZW8tbWFwLXBvbGlvJykubGVuZ3RoID4gMFxuICAgIHNldFZpZGVvTWFwUG9saW8oKVxuXG4gICMjI1xuICAvLyBWYWNjaW5lIG1hcFxuICBpZiAoJCgnI3ZhY2NpbmUtbWFwJykubGVuZ3RoID4gMCkge1xuICAgIHZhciB2YWNjaW5lX21hcCA9IG5ldyBWYWNjaW5lTWFwKCd2YWNjaW5lLW1hcCcpO1xuICAgIC8vdmFjY2luZV9tYXAuZ2V0RGF0YSA9IHRydWU7IC8vIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgcG9saW8gY2FzZXMgY3N2XG4gICAgLy92YWNjaW5lX21hcC5nZXRQaWN0dXJlU2VxdWVuY2UgPSB0cnVlOyAvLyBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIG1hcCBwaWN0dXJlIHNlcXVlbmNlXG4gICAgdmFjY2luZV9tYXAuaW5pdChiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtcG9saW8tY2FzZXMuY3N2JywgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL21hcC1wb2xpby1jYXNlcy5jc3YnKTtcbiAgICAkKHdpbmRvdykucmVzaXplKCB2YWNjaW5lX21hcC5vblJlc2l6ZSApO1xuICB9XG4gICMjI1xuXG4gIGlmICQoJy52YWNjaW5lcy1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGgoKVxuXG4gICMjI1xuICAjIFZhY2NpbmUgYWxsIGRpc2Vhc2VzIGdyYXBoXG4gIGlmICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMgPSBuZXcgVmFjY2luZURpc2Vhc2VHcmFwaCgndmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJylcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLm9uUmVzaXplXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuICAgICQoJyNkaXNlYXNlLXNlbGVjdG9yIGEnKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgJCh0aGlzKS50YWIgJ3Nob3cnXG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQodGhpcykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICAgcmV0dXJuXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZW9uIG9uIG9yZGVyIHNlbGVjdG9yXG4gICAgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS5jaGFuZ2UgKGQpIC0+XG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQodGhpcykudmFsKClcbiAgIyMjXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGgoKVxuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCgpXG5cbiAgaWYgJCgnI3dvcmxkLWNhc2VzJykubGVuZ3RoID4gMFxuICAgIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCgpXG4gIFxuICBpZiAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGgoKVxuXG4gIGlmICQoJyNtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cE1lYXNsZXNXb3JsZE1hcEdyYXBoKClcblxuICBpZiAkKCcjdmFjY2luZS1jb25maWRlbmNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCgpXG5cbikgalF1ZXJ5Il19
