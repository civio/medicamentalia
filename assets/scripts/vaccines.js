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
            if (_this.options.label.format) {
              return _this.options.label.format(d[_this.options.key.y]);
            } else {
              return d[_this.options.key.y];
            }
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
    var baseurl, getCountryName, lang, setVideoMapPolio, setupHeatMapGraph, setupImmunizationCoverageDynamicLineGraph, setupImmunizationCoverageMultipleSmallGraph, setupImmunizationDiseaseBarGraph, setupMeaslesWorldMapGraph, setupVaccineConfidenceBarGraph, setupVaccineDiseaseHeatmapGraph, setupWorldCasesMultipleSmallGraph;
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
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/confidence.csv').defer(d3.json, 'http://freegeoip.net/json/').await(function(error, data, location) {
        var graph;
        data.forEach((function(_this) {
          return function(d) {
            d.value = +d.value;
            d.name = d['name_' + lang];
            delete d.name_es;
            delete d.name_en;
            if (location && d.code2 === location.country_code) {
              return d.active = true;
            }
          };
        })(this));
        graph = new window.BarGraph('vaccine-confidence-graph', {
          aspectRatio: 0.3,
          label: {
            format: function(d) {
              return +d.toFixed(1) + '%';
            }
          },
          margin: {
            top: 0
          },
          key: {
            x: 'name',
            y: 'value',
            id: 'code'
          }
        });
        graph.setData(data);
        return $(window).resize(graph.onResize);
      });
    };

    /*
    setupVaccineConfidenceScatterplotGraph = ->
      d3.queue()
        .defer d3.csv, baseurl+'/assets/data/confidence.csv'
        .defer d3.csv, baseurl+'/assets/data/countries.csv'
        .await (error, data, countries) ->
          graph = new window.ScatterplotGraph('vaccine-confidence-graph',
            aspectRatio: 0.5
            margin:
              top: 0
              right: 0
              left: 50
              bottom: 20
            key:
              x: 'gdp'
              y: 'confidence'
              id: 'country')
          graph.xAxis.tickValues [5000, 20000, 40000, 60000]
          graph.setData data
          $(window).resize graph.onResize
     */
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
    setupImmunizationCoverageMultipleSmallGraph = function() {
      var countries, graphs;
      countries = ['LKA', 'DZA', 'DNK', 'FRA'];
      graphs = [];
      return d3.csv(baseurl + '/assets/data/immunization-coverage-mcv2.csv', function(error, data) {
        return countries.forEach(function(country, i) {
          var country_data, graph;
          country_data = data.filter(function(d) {
            return d.code === country;
          }).map(function(d) {
            return $.extend({}, d);
          });
          country_data.forEach(function(d) {
            delete d['2001'];
            return delete d['2002'];
          });
          graph = new window.LineGraph('immunization-coverage-' + country.toLowerCase() + '-graph', {
            isArea: true,
            key: {
              x: 'name',
              id: 'code'
            }
          });
          graphs.push(graph);
          graph.yFormat = function(d) {
            return d + '%';
          };
          graph.getScaleYDomain = function(d) {
            return [0, 100];
          };
          graph.yAxis.tickValues([50]);
          graph.xAxis.tickValues([2003, 2015]);
          graph.addMarker({
            value: 95,
            label: i < 3 ? '' : lang === 'es' ? 'Nivel de rebaño' : 'Herd immunity',
            align: 'right'
          });
          graph.setData(country_data);
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
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/immunization-coverage.csv').defer(d3.csv, baseurl + '/assets/data/countries.csv').defer(d3.json, 'http://freegeoip.net/json/').await(function(error, data, countries, location) {
        var data_parser, data_sort, excludedCountries, herdImmunity, user_country;
        if (location) {
          user_country = countries.filter(function(d) {
            return d.code2 === location.country_code;
          });
          location.code = user_country[0].code;
          location.name = user_country[0]['name_' + lang];
        }
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
          if (location && d.code === location.code) {
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
          if (location) {
            graph_value = graph_data.filter(function(d) {
              return d.key === location.code;
            });
          }
          graph = new window.BarGraph(disease + '-immunization-bar-graph', {
            aspectRatio: 0.25,
            label: {
              format: function(d) {
                return +d + '%';
              }
            },
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
          if (graph_value && graph_value.length > 0) {
            $el.find('.immunization-country').html(location.name);
            $el.find('.immunization-data').html('<strong>' + graph_value[0].value + '%</strong>');
            $el.find('.immunization-description').show();
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
      setupImmunizationCoverageMultipleSmallGraph();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwibWFpbi12YWNjaW5lcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsY0FBZixFQUErQixPQUEvQjtNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELEdB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Ozs7Ozs7Ozs7O0lBOEJBLElBQUcsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsTUFBdEIsR0FBK0IsQ0FBbEM7TUFDRSxnQkFBQSxDQUFBLEVBREY7OztBQUdBOzs7Ozs7Ozs7O0lBV0EsSUFBRyxDQUFBLENBQUUseUJBQUYsQ0FBNEIsQ0FBQyxNQUE3QixHQUFzQyxDQUF6QztNQUNFLCtCQUFBLENBQUEsRUFERjs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkEsSUFBRyxDQUFBLENBQUUsa0NBQUYsQ0FBcUMsQ0FBQyxNQUF0QyxHQUErQyxDQUFsRDtNQUNFLHlDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSw4QkFBRixDQUFpQyxDQUFDLE1BQWxDLEdBQTJDLENBQTlDO01BQ0UsMkNBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLGNBQUYsQ0FBaUIsQ0FBQyxNQUFsQixHQUEyQixDQUE5QjtNQUNFLGlDQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSxzQ0FBRixDQUF5QyxDQUFDLE1BQTFDLEdBQW1ELENBQXREO01BQ0UsZ0NBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsTUFBOUIsR0FBdUMsQ0FBMUM7TUFDRSx5QkFBQSxDQUFBLEVBREY7O0lBR0EsSUFBRyxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxNQUEvQixHQUF3QyxDQUEzQzthQUNFLDhCQUFBLENBQUEsRUFERjs7RUE1YUQsQ0FBRCxDQUFBLENBK2FFLE1BL2FGO0FBQUEiLCJmaWxlIjoidmFjY2luZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5hdHRyIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0JhciBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2JhciBhY3RpdmUnIGVsc2UgJ2JhcidcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLm9uICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC15IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJy0wLjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGlmIEBvcHRpb25zLmxhYmVsLmZvcm1hdCB0aGVuIEBvcHRpb25zLmxhYmVsLmZvcm1hdChkW0BvcHRpb25zLmtleS55XSkgZWxzZSBkW0BvcHRpb25zLmtleS55XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAgICAgIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSlcbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgKGQpID0+IEBoZWlnaHQgLSBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckxhYmVsWERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAaGVpZ2h0XG5cbiAgc2V0QmFyTGFiZWxZRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICB1bmxlc3MgZC5hY3RpdmVcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgIiwiY2xhc3Mgd2luZG93LkxpbmVHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIHlGb3JtYXQ6IGQzLmZvcm1hdCgnZCcpICAgIyBzZXQgbGFiZWxzIGhvdmVyIGZvcm1hdFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnTGluZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMgZGF0YVxuICAgIHN1cGVyKGRhdGEpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgeWVhcnMgPSBbXVxuICAgIGQzLmtleXMoZGF0YVswXSkuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGlmICtkXG4gICAgICAgIHllYXJzLnB1c2ggK2RcbiAgICByZXR1cm4geWVhcnMuc29ydCgpXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkW0BvcHRpb25zLmtleS54XSwgJ2VuICcsIHllYXIpO1xuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja0Zvcm1hdCBkMy5mb3JtYXQoJycpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgIyBzZXR1cCBsaW5lXG4gICAgQGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgIC54IChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAueSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICAjIHNldHVwIGFyZWFcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhID0gZDMuYXJlYSgpXG4gICAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgICAgLnggIChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAgIC55MCBAaGVpZ2h0XG4gICAgICAgIC55MSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gW0B5ZWFyc1swXSwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbMCwgZDMubWF4IEBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkLnZhbHVlcykpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGNsZWFyIGdyYXBoIGJlZm9yZSBzZXR1cFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuZ3JhcGgnKS5yZW1vdmUoKVxuICAgICMgZHJhdyBncmFwaCBjb250YWluZXIgXG4gICAgQGdyYXBoID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2dyYXBoJ1xuICAgICMgZHJhdyBsaW5lc1xuICAgIEBkcmF3TGluZXMoKVxuICAgICMgZHJhdyBhcmVhc1xuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGRyYXdBcmVhcygpXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAZHJhd0xhYmVscygpXG4gICAgIyBkcmF3IG1vdXNlIGV2ZW50cyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGRyYXdMaW5lTGFiZWxIb3ZlcigpXG4gICAgICAjIGVsc2VcbiAgICAgICMgICBAZHJhd1Rvb2x0aXAoKVxuICAgICAgQGRyYXdSZWN0T3ZlcmxheSgpXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGFyZWEgeTBcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhLnkwIEBoZWlnaHRcbiAgICAjIHVwZGF0ZSB5IGF4aXMgdGlja3Mgd2lkdGhcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuYXR0ciAnZCcsIEBhcmVhXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy5vdmVybGF5JylcbiAgICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMaW5lczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiByZXR1cm4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcblxuICBkcmF3QXJlYXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXJlYSdcbiAgICAgIC5hdHRyICAnaWQnLCAgICAoZCkgPT4gJ2FyZWEtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuXG4gIGRyYXdMYWJlbHM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnZW5kJ1xuICAgICAgLmF0dHIgJ2R5JywgJy0wLjEyNWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG5cbiAgZHJhd0xpbmVMYWJlbEhvdmVyOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtcG9pbnQtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLXBvaW50J1xuICAgICAgLmF0dHIgJ3InLCA0XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAndGljay1ob3ZlcidcbiAgICAgIC5hdHRyICdkeScsICcwLjcxZW0nICAgICAgXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIGlmIEBkYXRhLmxlbmd0aCA9PSAxXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLWhvdmVyJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAuYXR0ciAnZHknLCAnLTAuNWVtJ1xuICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBkcmF3UmVjdE92ZXJsYXk6IC0+XG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ292ZXJsYXknXG4gICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VNb3ZlXG4gICAgICAub24gJ21vdXNlb3V0JywgIEBvbk1vdXNlT3V0XG4gICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuXG4gIHNldExhYmVsRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCBAd2lkdGhcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGQudmFsdWVzW0B5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXSlcblxuICBzZXRPdmVybGF5RGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3dpZHRoJywgQHdpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGhlaWdodFxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkZWwudHJpZ2dlciAnbW91c2VvdXQnXG4gICAgQGhpZGVMYWJlbCgpXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIHllYXIgPSBNYXRoLnJvdW5kIEB4LmludmVydChwb3NpdGlvblswXSlcbiAgICBpZiB5ZWFyICE9IEBjdXJyZW50WWVhclxuICAgICAgQCRlbC50cmlnZ2VyICdjaGFuZ2UteWVhcicsIHllYXJcbiAgICAgIEBzZXRMYWJlbCB5ZWFyXG5cbiAgc2V0TGFiZWw6ICh5ZWFyKSAtPlxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICBAeEF4aXMudGlja1ZhbHVlcyBbeWVhcl1cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmVhY2ggKGQpID0+IEBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uIGRcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAgLmF0dHIgJ3gnLCBNYXRoLnJvdW5kIEB4KEBjdXJyZW50WWVhcilcbiAgICAgIC50ZXh0IEBjdXJyZW50WWVhclxuXG4gIGhpZGVMYWJlbDogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbjogKGRhdGEpID0+XG4gICAgIyBnZXQgY3VycmVudCB5ZWFyXG4gICAgeWVhciA9IEBjdXJyZW50WWVhclxuICAgIHdoaWxlIEB5ZWFycy5pbmRleE9mKHllYXIpID09IC0xICYmIEBjdXJyZW50WWVhciA+IEB5ZWFyc1swXVxuICAgICAgeWVhci0tXG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgICMgZ2V0IHBvaW50ICYgbGFiZWxcbiAgICBwb2ludCA9IGQzLnNlbGVjdCgnI2xpbmUtbGFiZWwtcG9pbnQtJytkYXRhW0BvcHRpb25zLmtleS5pZF0pXG4gICAgbGFiZWwgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICMgaGlkZSBwb2ludCAmIGxhYmVsIGlzIHRoZXJlIGlzIG5vIGRhdGFcbiAgICB1bmxlc3MgZGF0YS52YWx1ZXNbeWVhcl1cbiAgICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgcmV0dXJuXG4gICAgIyBzaG93IHBvaW50ICYgbGFiZWwgaWYgdGhlcmUncyBkYXRhXG4gICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICMgc2V0IGxpbmUgbGFiZWwgcG9pbnRcbiAgICBwb2ludFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAjIHNldCBsaW5lIGxhYmVsIGhvdmVyXG4gICAgbGFiZWxcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICAgLnRleHQgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHlGb3JtYXQoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgJydcbiAgICAgIFxuICBzZXRUaWNrSG92ZXJQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd5JywgTWF0aC5yb3VuZCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArOSIsImNsYXNzIHdpbmRvdy5IZWF0bWFwR3JhcGggZXh0ZW5kcyBCYXNlR3JhcGhcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdIZWF0bWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBAbGFuZyA9ICQoJ2JvZHknKS5kYXRhICdsYW5nJ1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgICAgICAgPSBudWxsXG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCAnIycrQGlkKycgLmhlYXRtYXAtY29udGFpbmVyJ1xuICAgIEAkdG9vbHRpcCAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgICMgR2V0IHllYXJzICh4IHNjYWxlKVxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyhkYXRhKVxuICAgICMgR2V0IGNvdW50cmllcyAoeSBzY2FsZSlcbiAgICBAY291bnRyaWVzID0gZGF0YS5tYXAgKGQpIC0+IGQuY29kZVxuICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4gICAgQGNlbGxzRGF0YSA9IEBnZXRDZWxsc0RhdGEgZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZ2V0RGltZW5zaW9ucygpICMgZm9yY2UgdXBkYXRlIGRpbWVuc2lvbnNcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICBtaW5ZZWFyID0gZDMubWluIGRhdGEsIChkKSAtPiBkMy5taW4oZDMua2V5cyhkLnZhbHVlcykpXG4gICAgbWF4WWVhciA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIHllYXJzID0gZDMucmFuZ2UgbWluWWVhciwgbWF4WWVhciwgMVxuICAgIHllYXJzLnB1c2ggK21heFllYXJcbiAgICByZXR1cm4geWVhcnNcblxuICBnZXRDZWxsc0RhdGE6IChkYXRhKSAtPlxuICAgIGNlbGxzRGF0YSA9IFtdXG4gICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4gICAgICAgIGNlbGxzRGF0YS5wdXNoXG4gICAgICAgICAgY291bnRyeTogZC5jb2RlXG4gICAgICAgICAgbmFtZTogICAgZC5uYW1lXG4gICAgICAgICAgeWVhcjogICAgdmFsdWVcbiAgICAgICAgICBjYXNlczogICBkLmNhc2VzW3ZhbHVlXVxuICAgICAgICAgIHZhbHVlOiAgIGQudmFsdWVzW3ZhbHVlXVxuICAgIHJldHVybiBjZWxsc0RhdGFcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXJcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBzdXBlcigpXG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgNF0gICMgVE9ETyEhISAtPiBNYWtlIHRoaXMgZHluYW1pY1xuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgZ2V0U2NhbGVZUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAaGVpZ2h0XVxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQHllYXJzIFxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gQGNvdW50cmllcyBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIEB3aWR0aCA9IEAkZWwud2lkdGgoKSAtIDEwMCAgIyB5IGF4aXMgd2lkdGggPSAxMDBcbiAgICBpZiBAeWVhcnMgYW5kIEBjb3VudHJpZXNcbiAgICAgIGNlbGxTaXplID0gTWF0aC5mbG9vciBAd2lkdGggLyBAeWVhcnMubGVuZ3RoXG4gICAgICBAaGVpZ2h0ID0gaWYgY2VsbFNpemUgPCAyMCB0aGVuIGNlbGxTaXplICogQGNvdW50cmllcy5sZW5ndGggZWxzZSAyMCAqIEBjb3VudHJpZXMubGVuZ3RoXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBzZXR1cCBzY2FsZXMgcmFuZ2VcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBjb250YWluZXIgaGVpZ2h0XG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgIyBkcmF3IGNlbGxzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuZGF0YShAY2VsbHNEYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbCdcbiAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IoZC52YWx1ZSlcbiAgICAgIC5vbiAgICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAub24gICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAgIC5jYWxsICBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICAjIGRyYXcgeWVhcnMgeCBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAneC1heGlzIGF4aXMnXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAeWVhcnMuZmlsdGVyKChkKSAtPiBkICUgNSA9PSAwKSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgICAuaHRtbCAgKGQpIC0+IGRcbiAgICAjIGRyYXcgY291bnRyaWVzIHkgYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJylcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEBjb3VudHJpZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgICAuaHRtbCAoZCkgPT4gQGdldENvdW50cnlOYW1lIGRcbiAgICAjIGRyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YSBAZGF0YS5tYXAoKGQpIC0+IHtjb2RlOiBkLmNvZGUsIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb259KS5maWx0ZXIoKGQpIC0+ICFpc05hTiBkLnllYXIpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHNjYWxlc1xuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBjb250YWluZXJzXG4gICAgQGNvbnRhaW5lclxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0ICsgJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNlbGwnKVxuICAgICAgLmNhbGwgQHNldENlbGxEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LWF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnktYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0TWFya2VyRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0Q2VsbERpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBAeChkLnllYXIpKydweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpID0+IEB5KGQuY291bnRyeSkrJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEB5LmJhbmR3aWR0aCgpKydweCdcblxuICBzZXRNYXJrZXJEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb2RlKSsncHgnXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBpZiBkLnllYXIgPCBAeWVhcnNbMF0gdGhlbiBAeChAeWVhcnNbMF0pLTEgKyAncHgnIGVsc2UgaWYgZC55ZWFyIDwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0gdGhlbiBAeChkLnllYXIpLTErJ3B4JyBlbHNlIEB4LmJhbmR3aWR0aCgpK0B4KEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEB5LmJhbmR3aWR0aCgpKydweCdcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgb2Zmc2V0ICAgICAgICAgICA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgIGNhc2VzX3N0ciAgICAgICAgPSBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc29zJyBlbHNlICdjYXNlcydcbiAgICBjYXNlc19zaW5nbGVfc3RyID0gaWYgQGxhbmcgPT0gJ2VzJyB0aGVuICdjYXNvJyBlbHNlICdjYXNlJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb3VudHJ5J1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnllYXInXG4gICAgICAuaHRtbCBkLnllYXJcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RGVjaW1hbChkLnZhbHVlLCBAbGFuZylcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAuaHRtbCBpZiBkLmNhc2VzICE9IDEgdGhlbiBkLmNhc2VzLnRvTG9jYWxlU3RyaW5nKEBsYW5nKSArICcgJyArIGNhc2VzX3N0ciBlbHNlIGQuY2FzZXMudG9Mb2NhbGVTdHJpbmcoQGxhbmcpICsgJyAnICsgY2FzZXNfc2luZ2xlX3N0clxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIG9mZnNldC5sZWZ0ICsgQHguYmFuZHdpZHRoKCkgKiAwLjUgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIG9mZnNldC50b3AgLSAoQHkuYmFuZHdpZHRoKCkgKiAwLjUpIC0gQCR0b29sdGlwLmhlaWdodCgpXG4gICAgICAnb3BhY2l0eSc6ICcxJ1xuICAgIHJldHVyblxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcbiAgICByZXR1cm5cblxuICBnZXRDb3VudHJ5TmFtZTogKGNvZGUpID0+XG4gICAgY291bnRyeSA9IEBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICByZXR1cm4gaWYgY291bnRyeVswXSB0aGVuIGNvdW50cnlbMF0ubmFtZSBlbHNlICcnXG5cbiAgZm9ybWF0RGVjaW1hbDogKG51bWJlciwgbGFuZykgLT5cbiAgICByZXR1cm4gaWYgbnVtYmVyIDwgMC4wMDEgdGhlbiAwIGVsc2UgaWYgbnVtYmVyID49IDAuMSB0aGVuIG51bWJlci50b0ZpeGVkKDEpLnRvTG9jYWxlU3RyaW5nKGxhbmcpIGVsc2UgaWYgbnVtYmVyID49IDAuMDEgdGhlbiBudW1iZXIudG9GaXhlZCgyKS50b0xvY2FsZVN0cmluZyhsYW5nKSBlbHNlIG51bWJlci50b0ZpeGVkKDMpLnRvTG9jYWxlU3RyaW5nKGxhbmcpXG5cblxuXG4jIFZhY2NpbmVEaXNlYXNlR3JhcGggPSAoX2lkKSAtPlxuIyAgICQgPSBqUXVlcnkubm9Db25mbGljdCgpXG4jICAgWV9BWElTX1dJRFRIID0gMTAwXG4jICAgIyBNdXN0IGJlIHRoZSBhbWUgdmFsdWUgdGhhbiAjdmFjY2luZS1kaXNlYXNlLWdyYXBoICRwYWRkaW5nLWxlZnQgc2NzcyB2YXJpYWJsZVxuIyAgIHRoYXQgPSB0aGlzXG4jICAgaWQgPSBfaWRcbiMgICBkaXNlYXNlID0gdW5kZWZpbmVkXG4jICAgc29ydCA9IHVuZGVmaW5lZFxuIyAgIGxhbmcgPSB1bmRlZmluZWRcbiMgICBkYXRhID0gdW5kZWZpbmVkXG4jICAgZGF0YVBvcHVsYXRpb24gPSB1bmRlZmluZWRcbiMgICBjdXJyZW50RGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNlbGxEYXRhID0gdW5kZWZpbmVkXG4jICAgY291bnRyaWVzID0gdW5kZWZpbmVkXG4jICAgeWVhcnMgPSB1bmRlZmluZWRcbiMgICBjZWxsU2l6ZSA9IHVuZGVmaW5lZFxuIyAgIGNvbnRhaW5lciA9IHVuZGVmaW5lZFxuIyAgIHggPSB1bmRlZmluZWRcbiMgICB5ID0gdW5kZWZpbmVkXG4jICAgd2lkdGggPSB1bmRlZmluZWRcbiMgICBoZWlnaHQgPSB1bmRlZmluZWRcbiMgICAkZWwgPSB1bmRlZmluZWRcbiMgICAkdG9vbHRpcCA9IHVuZGVmaW5lZFxuIyAgICMgUHVibGljIE1ldGhvZHNcblxuIyAgIHRoYXQuaW5pdCA9IChfZGlzZWFzZSwgX3NvcnQpIC0+XG4jICAgICBkaXNlYXNlID0gX2Rpc2Vhc2VcbiMgICAgIHNvcnQgPSBfc29ydFxuIyAgICAgI2NvbnNvbGUubG9nKCdWYWNjaW5lIEdyYXBoIGluaXQnLCBpZCwgZGlzZWFzZSwgc29ydCk7XG4jICAgICAkZWwgPSAkKCcjJyArIGlkKVxuIyAgICAgJHRvb2x0aXAgPSAkZWwuZmluZCgnLnRvb2x0aXAnKVxuIyAgICAgbGFuZyA9ICRlbC5kYXRhKCdsYW5nJylcbiMgICAgIHggPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIHkgPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsKGQzLmludGVycG9sYXRlT3JSZClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgY2xlYXIoKVxuIyAgICAgICBzZXR1cERhdGEoKVxuIyAgICAgICBzZXR1cEdyYXBoKClcbiMgICAgIGVsc2VcbiMgICAgICAgIyBMb2FkIENTVnNcbiMgICAgICAgZDMucXVldWUoKS5kZWZlcihkMy5jc3YsICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykgKyAnL2Fzc2V0cy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLmNzdicpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvYXNzZXRzL2RhdGEvcG9wdWxhdGlvbi5jc3YnKS5hd2FpdCBvbkRhdGFSZWFkeVxuIyAgICAgdGhhdFxuXG4jICAgdGhhdC5vblJlc2l6ZSA9IC0+XG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgdXBkYXRlR3JhcGgoKVxuIyAgICAgdGhhdFxuXG4jICAgb25EYXRhUmVhZHkgPSAoZXJyb3IsIGRhdGFfY3N2LCBwb3B1bGF0aW9uX2NzdikgLT5cbiMgICAgIGRhdGEgPSBkYXRhX2NzdlxuIyAgICAgZGF0YVBvcHVsYXRpb24gPSBwb3B1bGF0aW9uX2NzdlxuIyAgICAgIyB3ZSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGF0dHJpYnV0ZVxuIyAgICAgZGVsZXRlIGRhdGEuY29sdW1uc1xuIyAgICAgIyBXZSBjYW4gZGVmaW5lIGEgZmlsdGVyIGZ1bmN0aW9uIHRvIHNob3cgb25seSBzb21lIHNlbGVjdGVkIGNvdW50cmllc1xuIyAgICAgaWYgdGhhdC5maWx0ZXJcbiMgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHRoYXQuZmlsdGVyKVxuIyAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPSBkLmRpc2Vhc2UudG9Mb3dlckNhc2UoKVxuIyAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgICAgZC55ZWFyX2ludHJvZHVjdGlvbiA9ICtkLnllYXJfaW50cm9kdWN0aW9uLnJlcGxhY2UoJ3ByaW9yIHRvJywgJycpXG4jICAgICAgIGQuY2FzZXMgPSB7fVxuIyAgICAgICBkLnZhbHVlcyA9IHt9XG4jICAgICAgICMgc2V0IHZhbHVlIGVzIGNhc2VzIC8xMDAwIGhhYml0YW50c1xuIyAgICAgICBwb3B1bGF0aW9uSXRlbSA9IHBvcHVsYXRpb25fY3N2LmZpbHRlcigoY291bnRyeSkgLT5cbiMgICAgICAgICBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4jICAgICAgIClcbiMgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuIyAgICAgICAgIHllYXIgPSAxOTgwXG4jICAgICAgICAgd2hpbGUgeWVhciA8IDIwMTZcbiMgICAgICAgICAgIGlmIGRbeWVhcl1cbiMgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuIyAgICAgICAgICAgICBpZiBwb3B1bGF0aW9uICE9IDBcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IDEwMDAgKiAoK2RbeWVhcl0gLyBwb3B1bGF0aW9uKTtcbiMgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiMgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiMgICAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiMgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBjYXNvcyBkZSAnICsgZC5kaXNlYXNlICsgJyBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgJzonLCBkW3llYXJdLCB0eXBlb2YgZFt5ZWFyXSk7XG4jICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuIyAgICAgICAgICAgeWVhcisrXG4jICAgICAgIGVsc2VcbiMgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuIyAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuIyAgICAgICBkLnRvdGFsID0gZDMudmFsdWVzKGQudmFsdWVzKS5yZWR1Y2UoKChhLCBiKSAtPlxuIyAgICAgICAgIGEgKyBiXG4jICAgICAgICksIDApXG4jICAgICAgIHJldHVyblxuIyAgICAgc2V0dXBEYXRhKClcbiMgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cERhdGEgPSAtPlxuIyAgICAgIyBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCBkaXNlYXNlXG4jICAgICBjdXJyZW50RGF0YSA9IGRhdGEuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPT0gZGlzZWFzZSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4jICAgICApXG4jICAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4jICAgICAjIEdldCBhcnJheSBvZiBjb3VudHJ5IG5hbWVzXG4jICAgICBjb3VudHJpZXMgPSBjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIGQuY29kZVxuIyAgICAgKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgeWVhcnNcbiMgICAgIG1pblllYXIgPSBkMy5taW4oY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5taW4gZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIG1heFllYXIgPSBkMy5tYXgoY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5tYXggZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIHllYXJzID0gZDMucmFuZ2UobWluWWVhciwgbWF4WWVhciwgMSlcbiMgICAgIHllYXJzLnB1c2ggK21heFllYXJcbiMgICAgICNjb25zb2xlLmxvZyhtaW5ZZWFyLCBtYXhZZWFyLCB5ZWFycyk7XG4jICAgICAjY29uc29sZS5sb2coY291bnRyaWVzKTtcbiMgICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4jICAgICBjZWxsc0RhdGEgPSBbXVxuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaCAoZCkgLT5cbiMgICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4jICAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiMgICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuIyAgICAgICAgICAgbmFtZTogZC5uYW1lXG4jICAgICAgICAgICB5ZWFyOiB2YWx1ZVxuIyAgICAgICAgICAgY2FzZXM6IGQuY2FzZXNbdmFsdWVdXG4jICAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbdmFsdWVdXG4jICAgICAgIHJldHVyblxuXG4jICAgICAjIyNcbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2goZnVuY3Rpb24oZCl7XG4jICAgICAgIHZhciBjb3VudGVyID0gMDtcbiMgICAgICAgeWVhcnMuZm9yRWFjaChmdW5jdGlvbih5ZWFyKXtcbiMgICAgICAgICBpZiAoZFt5ZWFyXSlcbiMgICAgICAgICAgIGNvdW50ZXIrKztcbiMgICAgICAgfSk7XG4jICAgICAgIGlmKGNvdW50ZXIgPD0gMjApIC8vIHllYXJzLmxlbmd0aC8yKVxuIyAgICAgICAgIGNvbnNvbGUubG9nKGQubmFtZSArICcgaGFzIG9ubHkgdmFsdWVzIGZvciAnICsgY291bnRlciArICcgeWVhcnMnKTtcbiMgICAgIH0pO1xuIyAgICAgIyMjXG5cbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBHcmFwaCA9IC0+XG4jICAgICAjIEdldCBkaW1lbnNpb25zIChoZWlnaHQgaXMgYmFzZWQgb24gY291bnRyaWVzIGxlbmd0aClcbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgeC5kb21haW4oeWVhcnMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICB3aWR0aFxuIyAgICAgXVxuIyAgICAgeS5kb21haW4oY291bnRyaWVzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgaGVpZ2h0XG4jICAgICBdXG4jICAgICAjY29sb3IuZG9tYWluKFtkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pLCAwXSk7XG4jICAgICBjb2xvci5kb21haW4gW1xuIyAgICAgICAwXG4jICAgICAgIDRcbiMgICAgIF1cbiMgICAgICNjb25zb2xlLmxvZygnTWF4aW11bSBjYXNlcyB2YWx1ZTogJysgZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSk7XG4jICAgICAjIEFkZCBzdmdcbiMgICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycgKyBpZCArICcgLmdyYXBoLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKVxuIyAgICAgIyBEcmF3IGNlbGxzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKS5zZWxlY3RBbGwoJy5jZWxsJykuZGF0YShjZWxsc0RhdGEpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsJykuc3R5bGUoJ2JhY2tncm91bmQnLCAoZCkgLT5cbiMgICAgICAgY29sb3IgZC52YWx1ZVxuIyAgICAgKS5jYWxsKHNldENlbGxEaW1lbnNpb25zKS5vbignbW91c2VvdmVyJywgb25Nb3VzZU92ZXIpLm9uICdtb3VzZW91dCcsIG9uTW91c2VPdXRcbiMgICAgICMgRHJhdyB5ZWFycyB4IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3gtYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YSh5ZWFycy5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQgJSA1ID09IDBcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgnbGVmdCcsIChkKSAtPlxuIyAgICAgICB4KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBkXG4jICAgICAjIERyYXcgY291bnRyaWVzIHkgYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKGNvdW50cmllcykuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCd0b3AnLCAoZCkgLT5cbiMgICAgICAgeShkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZ2V0Q291bnRyeU5hbWUgZFxuIyAgICAgIyBEcmF3IHllYXIgaW50cm9kdWN0aW9uIG1hcmtcbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpLmRhdGEoY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICB7XG4jICAgICAgICAgY29kZTogZC5jb2RlXG4jICAgICAgICAgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvblxuIyAgICAgICB9XG4jICAgICApLmZpbHRlcigoZCkgLT5cbiMgICAgICAgIWlzTmFOKGQueWVhcilcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdtYXJrZXInKS5jYWxsIHNldE1hcmtlckRpbWVuc2lvbnNcbiMgICAgIHJldHVyblxuXG4jICAgY2xlYXIgPSAtPlxuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykucmVtb3ZlKClcbiMgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5heGlzJykucmVtb3ZlKClcbiMgICAgIHJldHVyblxuXG5cblxuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLTEtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IChkKSAtPiBkXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuIiwiY2xhc3Mgd2luZG93LlNjYXR0ZXJwbG90R3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgY29uc29sZS5sb2cgJ2dldFNjYWxlWERvbWFpbicsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdKVxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICBjb25zb2xlLmxvZyAnZ2V0U2NhbGVZRG9tYWluJywgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUubG9nIEBkYXRhXG4gICAgIyBkcmF3IHBvaW50c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ3InLCA2XG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90LWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAuYXR0ciAnZHknLCAnMC4zNzVlbSdcbiAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0RG90c0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgc2V0RG90TGFiZWxzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBvdmVycmlkIHggYXhpcyBwb3NpdGlvbmluZ1xuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG4gICAgIiwiIyBNYWluIHNjcmlwdCBmb3IgdmFjY2luZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuXG4gICMgSW5pdCBUb29sdGlwc1xuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpXG5cblxuICAjIGdldCBjb3VudHJ5IG5hbWUgYXV4aWxpYXIgbWV0aG9kXG4gIGdldENvdW50cnlOYW1lID0gKGNvdW50cmllcywgY29kZSwgbGFuZykgLT5cbiAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICBpZiBpdGVtXG4gICAgICBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBjb2RlXG5cblxuICAjIFZpZGVvIG9mIG1hcCBwb2xpbyBjYXNlc1xuICBzZXRWaWRlb01hcFBvbGlvID0gLT5cbiAgICB3cmFwcGVyID0gUG9wY29ybi5IVE1MWW91VHViZVZpZGVvRWxlbWVudCgnI3ZpZGVvLW1hcC1wb2xpbycpXG4gICAgd3JhcHBlci5zcmMgPSAnaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9sMUYyWGQ1RkZsUT9jb250cm9scz0wJnNob3dpbmZvPTAmaGQ9MSdcbiAgICBwb3Bjb3JuID0gUG9wY29ybih3cmFwcGVyKVxuICAgIG5vdGVzID0gMjAxNiAtIDE5ODBcbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPD0gbm90ZXNcbiAgICAgIHBvcGNvcm4uZm9vdG5vdGVcbiAgICAgICAgc3RhcnQ6ICAxLjYyMjIgKiBpXG4gICAgICAgIGVuZDogICAgMS42MjIyICogKGkgKyAxKVxuICAgICAgICB0ZXh0OiAgIDE5ODAgKyBpXG4gICAgICAgIHRhcmdldDogJ3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbidcbiAgICAgIGkrK1xuICAgICMgU2hvdyBjb3ZlciB3aGVuIHZpZGVvIGVuZGVkXG4gICAgd3JhcHBlci5hZGRFdmVudExpc3RlbmVyICdlbmRlZCcsIChlKSAtPlxuICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVJbigpXG4gICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJykuZmFkZVRvIDMwMCwgMFxuICAgICAgcG9wY29ybi5jdXJyZW50VGltZSAwXG4gICAgIyBTaG93IHZpZGVvIHdoZW4gcGxheSBidG4gY2xpY2tlZFxuICAgICQoJyN2aWRlby1tYXAtcG9saW8tcGxheS1idG4nKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgcG9wY29ybi5wbGF5KClcbiAgICAgICQoJy52aWRlby1tYXAtcG9saW8tY292ZXInKS5mYWRlT3V0KClcbiAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nKS5mYWRlVG8gMzAwLCAxXG5cblxuICAjIE1lYXNsZXMgV29ybGQgTWFwIEdyYXBoXG4gIHNldHVwTWVhc2xlc1dvcmxkTWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvYXNzZXRzL2RhdGEvbWVhc2xlcy1jYXNlcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGdldCBjYXNlcyBvYmplY3Qgd2l0aCByZWdpb24ga2V5XG4gICAgICAgIGNhc2VzID0ge31cbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGNhc2VzW2QucmVnaW9uXSA9ICtkLmNhc2VzKjEwMDAwMFxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgY291bnRyaWVzLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgZC52YWx1ZSA9IGNhc2VzW2QucmVnaW9uXVxuICAgICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytsYW5nXVxuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZXNcbiAgICAgICAgICBkZWxldGUgZC5uYW1lX2VuXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgnbWVhc2xlcy13b3JsZC1tYXAtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46IFxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5zZXREYXRhIGNvdW50cmllcywgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIE1lYXNsZXMgY2FzZXMgSGVhdG1hcCBHcmFwaFxuICBzZXR1cEhlYXRNYXBHcmFwaCA9IChpZCwgZGF0YSwgY291bnRyaWVzKSAtPlxuICAgIGRhdGEgPSBkYXRhXG4gICAgICAuZmlsdGVyIChkKSAtPiBjb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpICE9IC0xIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiAgICAgIC5zb3J0IChhLGIpIC0+IGEudG90YWwgLSBiLnRvdGFsXG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkhlYXRtYXBHcmFwaChpZCxcbiAgICAgIG1hcmdpbjogXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGxlZnQ6IDApXG4gICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvbmZpZGVuY2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sICdodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGxvY2F0aW9uKSAtPlxuICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gICAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgZGVsZXRlIGQubmFtZV9lc1xuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZW5cbiAgICAgICAgICAjIHNldCB1c2VyIGNvdW50cnkgYWN0aXZlXG4gICAgICAgICAgaWYgbG9jYXRpb24gYW5kIGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICAgICAgICBkLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjNcbiAgICAgICAgICBsYWJlbDogXG4gICAgICAgICAgICBmb3JtYXQ6IChkKSAtPiArZC50b0ZpeGVkKDEpKyclJ1xuICAgICAgICAgIG1hcmdpbjogdG9wOiAwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgICAgICBpZDogJ2NvZGUnKVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMjI1xuICBzZXR1cFZhY2NpbmVDb25maWRlbmNlU2NhdHRlcnBsb3RHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvbmZpZGVuY2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICBsZWZ0OiA1MFxuICAgICAgICAgICAgYm90dG9tOiAyMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIHg6ICdnZHAnXG4gICAgICAgICAgICB5OiAnY29uZmlkZW5jZSdcbiAgICAgICAgICAgIGlkOiAnY291bnRyeScpXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzUwMDAsIDIwMDAwLCA0MDAwMCwgNjAwMDBdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4gICMjI1xuXG4gIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy1tZWFzbGVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9wb3B1bGF0aW9uLmNzdidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfY2FzZXMsIGRhdGFfcG9wdWxhdGlvbikgLT5cbiAgICAgICAgZGVsZXRlIGRhdGFfY2FzZXMuY29sdW1ucyAgIyB3ZSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGF0dHJpYnV0ZVxuICAgICAgICBkYXRhX2Nhc2VzLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgaWYgZC55ZWFyX2ludHJvZHVjdGlvblxuICAgICAgICAgICAgZC55ZWFyX2ludHJvZHVjdGlvbiA9ICtkLnllYXJfaW50cm9kdWN0aW9uLnJlcGxhY2UoJ3ByaW9yIHRvJywgJycpXG4gICAgICAgICAgZC5jYXNlcyA9IHt9XG4gICAgICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgICAgIGQubmFtZSA9IGdldENvdW50cnlOYW1lIGRhdGFfcG9wdWxhdGlvbiwgZC5jb2RlLCBsYW5nXG4gICAgICAgICAgIyBzZXQgdmFsdWVzIGFzIGNhc2VzLzEwMDAgaGFiaXRhbnRzXG4gICAgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBkYXRhX3BvcHVsYXRpb24uZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuICAgICAgICAgICAgeWVhciA9IDE5ODBcbiAgICAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4gICAgICAgICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4gICAgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4gICAgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgICAgICB5ZWFyKytcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuICAgICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4gICAgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT4gYSArIGIpLCAwKVxuICAgICAgICAjIEZpbHRlciBieSBzZWxlY3RlZCBjb3VudHJpZXMgJiBkaXNlYXNlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTEnLCBkYXRhX2Nhc2VzLCBbJ0ZJTicsJ0hVTicsJ1BSVCcsJ1VSWScsJ01FWCcsJ0NPTCddXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTInLCBkYXRhX2Nhc2VzLCBbJ0lSUScsJ0JHUicsJ01ORycsJ1pBRicsJ0ZSQScsJ0dFTyddXG5cblxuICAjIEltbXVuaXphdGlvbiBDb3ZlcmFnZSBEeW5hbWljIExpbmUgR3JhcGggKHdlIGNhbiBzZWxlY3QgZGlmZXJlbnRlIGRpc2Vhc2VzICYgY291bnRyaWVzKVxuICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlRHluYW1pY0xpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcsXG4gICAgICBrZXk6IFxuICAgICAgICBpZDogJ2NvZGUnXG4gICAgICAgIHg6ICduYW1lJ1xuICAgICAgbGFiZWw6IHRydWVcbiAgICAgIG1hcmdpbjogdG9wOiAyMClcbiAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAoZCkgLT4gWzAsIDEwMF1cbiAgICBncmFwaC55QXhpcy50aWNrVmFsdWVzIFswLCAyNSwgNTAsIDc1LCAxMDBdXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLnZhbCgpKVxuICAgICAgIyBVcGRhdGUgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCB2YWNjaW5lXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgIyBVcGRhdGUgYWN0aXZlIGNvdW50cmllc1xuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3IsICNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcpLmZpbmQoJy5saW5lLWxhYmVsLCAubGluZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgTXVsdGlwbGUgU21hbGwgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZU11bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgY291bnRyaWVzID0gWydMS0EnLCdEWkEnLCdETksnLCdGUkEnXVxuICAgIGdyYXBocyA9IFtdXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBjb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSxpKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBjb3VudHJ5X2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgY291bnRyeV9kYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgZGVsZXRlIGRbJzIwMDEnXVxuICAgICAgICAgIGRlbGV0ZSBkWycyMDAyJ11cbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS0nK2NvdW50cnkudG9Mb3dlckNhc2UoKSsnLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBrZXk6IFxuICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICBpZDogJ2NvZGUnKVxuICAgICAgICBncmFwaHMucHVzaCBncmFwaFxuICAgICAgICBncmFwaC55Rm9ybWF0ID0gKGQpIC0+IGQrJyUnXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IChkKSAtPiBbMCwgMTAwXVxuICAgICAgICBncmFwaC55QXhpcy50aWNrVmFsdWVzIFs1MF1cbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMywyMDE1XVxuICAgICAgICBncmFwaC5hZGRNYXJrZXJcbiAgICAgICAgICB2YWx1ZTogOTVcbiAgICAgICAgICBsYWJlbDogaWYgaSA8IDMgdGhlbiAnJyBlbHNlIGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgIGFsaWduOiAncmlnaHQnXG4gICAgICAgIGdyYXBoLnNldERhdGEgY291bnRyeV9kYXRhXG4gICAgICAgICMgbGlzdGVuIHRvIHllYXIgY2hhbmdlcyAmIHVwZGF0ZSBlYWNoIGdyYXBoIGxhYmVsXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICBncmFwaC4kZWwub24gJ21vdXNlb3V0JywgKGUpIC0+XG4gICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICBnLmhpZGVMYWJlbCgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcbiAgICAgICBcblxuICAjIFdvcmxkIENhc2VzIE11bHRpcGxlIFNtYWxsXG4gIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgZGlzZWFzZXMgPSBbJ2RpcGh0ZXJpYScsICdtZWFzbGVzJywncGVydHVzc2lzJywncG9saW8nLCd0ZXRhbnVzJ11cbiAgICBncmFwaHMgPSBbXVxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OiBcbiAgICAgICAgICAgIHg6ICdkaXNlYXNlJ1xuICAgICAgICAgICAgaWQ6ICdkaXNlYXNlJylcbiAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk4MCwgMjAxNV1cbiAgICAgICAgZ3JhcGgueUF4aXMudGlja3MoMikudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgaWYgZGlzZWFzZSA9PSAnbWVhc2xlcycgb3IgZGlzZWFzZSA9PSAncGVydHVzc2lzJyB0aGVuIG1heFZhbHVlMSBlbHNlIG1heFZhbHVlMl1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkaXNlYXNlX2RhdGFcbiAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHA6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBsb2NhdGlvbikgLT5cbiAgICAgICAgIyBTZXR1cCB1c2VyIGNvdW50cnlcbiAgICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgIGxvY2F0aW9uLm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAjIEZpbHRlciBkYXRhXG4gICAgICAgIGV4Y2x1ZGVkQ291bnRyaWVzID0gWydOSVUnLCdDT0snLCdUVVYnLCdOUlUnLCdQTFcnLCdWR0InLCdNQUYnLCdTTVInLCdHSUInLCdUQ0EnLCdMSUUnLCdNQ08nLCdTWE0nLCdGUk8nLCdNSEwnLCdNTlAnLCdBU00nLCdLTkEnLCdHUkwnLCdDWScsJ0JNVScsJ0FORCcsJ0RNQScsJ0lNTicsJ0FURycsJ1NZQycsJ1ZJUicsJ0FCVycsJ0ZTTScsJ1RPTicsJ0dSRCcsJ1ZDVCcsJ0tJUicsJ0NVVycsJ0NISScsJ0dVTScsJ0xDQScsJ1NUUCcsJ1dTTScsJ1ZVVCcsJ05DTCcsJ1BZRicsJ0JSQiddXG4gICAgICAgIGhlcmRJbW11bml0eSA9IFxuICAgICAgICAgICdNQ1YxJzogOTVcbiAgICAgICAgICAnUG9sMyc6IDgwXG4gICAgICAgICAgJ0RUUDMnOiA4MFxuICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGV4Y2x1ZGVkQ291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSA9PSAtMVxuICAgICAgICAjIERhdGEgcGFyc2UgJiBzb3J0aW5nIGZ1bnRpb25zXG4gICAgICAgIGRhdGFfcGFyc2VyID0gKGQpIC0+XG4gICAgICAgICAgb2JqID0gXG4gICAgICAgICAgICBrZXk6ICAgZC5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgZ2V0Q291bnRyeU5hbWUoY291bnRyaWVzLCBkLmNvZGUsIGxhbmcpXG4gICAgICAgICAgICB2YWx1ZTogK2RbJzIwMTUnXVxuICAgICAgICAgIGlmIGxvY2F0aW9uIGFuZCBkLmNvZGUgPT0gbG9jYXRpb24uY29kZVxuICAgICAgICAgICAgb2JqLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgIGRhdGFfc29ydCA9IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAjIGxvb3AgdGhyb3VnaCBlYWNoIGdyYXBoXG4gICAgICAgICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmVhY2ggLT5cbiAgICAgICAgICAkZWwgICAgID0gJCh0aGlzKVxuICAgICAgICAgIGRpc2Vhc2UgPSAkZWwuZGF0YSgnZGlzZWFzZScpXG4gICAgICAgICAgdmFjY2luZSA9ICRlbC5kYXRhKCd2YWNjaW5lJylcbiAgICAgICAgICAjIEdldCBncmFwaCBkYXRhICYgdmFsdWVcbiAgICAgICAgICBncmFwaF9kYXRhID0gZGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09IHZhY2NpbmUgYW5kIGRbJzIwMTUnXSAhPSAnJylcbiAgICAgICAgICAgIC5tYXAoZGF0YV9wYXJzZXIpXG4gICAgICAgICAgICAuc29ydChkYXRhX3NvcnQpXG4gICAgICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgICAgIGdyYXBoX3ZhbHVlID0gZ3JhcGhfZGF0YS5maWx0ZXIgKGQpIC0+IGQua2V5ID09IGxvY2F0aW9uLmNvZGVcbiAgICAgICAgICAjIFNldHVwIGdyYXBoXG4gICAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKGRpc2Vhc2UrJy1pbW11bml6YXRpb24tYmFyLWdyYXBoJyxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjI1XG4gICAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgICAgZm9ybWF0OiAoZCkgLT4gK2QrJyUnXG4gICAgICAgICAgICBrZXk6IHg6ICduYW1lJ1xuICAgICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgICB0b3A6IDIwKVxuICAgICAgICAgIG1hcmtlciA9IFxuICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgbGFiZWw6IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgIGlmIHZhY2NpbmUgPT0gJ0RUUDMnXG4gICAgICAgICAgICBtYXJrZXIubGFiZWwgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnUmVjb21lbmRhY2nDs24gT01TJyBlbHNlICdXSE8gcmVjb21tZW5kYXRpb24nXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXIgbWFya2VyXG4gICAgICAgICAgICAuc2V0RGF0YSBncmFwaF9kYXRhXG4gICAgICAgICAgIyBTZXR1cCBncmFwaCB2YWx1ZVxuICAgICAgICAgIGlmIGdyYXBoX3ZhbHVlIGFuZCBncmFwaF92YWx1ZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1jb3VudHJ5JykuaHRtbCBsb2NhdGlvbi5uYW1lXG4gICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kYXRhJykuaHRtbCAnPHN0cm9uZz4nICsgZ3JhcGhfdmFsdWVbMF0udmFsdWUgKyAnJTwvc3Ryb25nPidcbiAgICAgICAgICAgICRlbC5maW5kKCcuaW1tdW5pemF0aW9uLWRlc2NyaXB0aW9uJykuc2hvdygpXG4gICAgICAgICAgIyBPbiByZXNpemVcbiAgICAgICAgICAkKHdpbmRvdykucmVzaXplIC0+IGdyYXBoLm9uUmVzaXplKClcbiAgXG4gICMjI1xuICBzZXR1cEd1YXRlbWFsYUNvdmVyYWdlTGluZUdyYXBoID0gLT5cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJyxcbiAgICAgICNpc0FyZWE6IHRydWVcbiAgICAgIG1hcmdpbjogXG4gICAgICAgIGxlZnQ6IDBcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgYm90dG9tOiAyMClcbiAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsyMDAwLCAyMDA1LCAyMDEwLCAyMDE1XVxuICAgIGdyYXBoLnlBeGlzXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJyUnXG4gICAgZ3JhcGgubG9hZERhdGEgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXIuY3N2J1xuICAgIGdyYXBoLiRlbC5vbiAnZHJhdy1jb21wbGV0ZScsIChlKSAtPlxuICAgICAgbGluZSA9IGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy5saW5lJylcbiAgICAgIGNvbnNvbGUubG9nIGxpbmUubm9kZSgpXG4gICAgICBsZW5ndGggPSBsaW5lLm5vZGUoKS5nZXRUb3RhbExlbmd0aCgpO1xuICAgICAgbGluZVxuICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsIGxlbmd0aCArICcgJyArIGxlbmd0aClcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0JywgbGVuZ3RoKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5KDUwMDApXG4gICAgICAgICAgLmR1cmF0aW9uKDUwMDApXG4gICAgICAgICAgLmVhc2UoZDMuZWFzZVNpbkluT3V0KVxuICAgICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIDApXG5cbiAgaWYgJCgnI2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXInKS5sZW5ndGggPiAwXG4gICAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCgpXG4gICMjI1xuXG4gIGlmICQoJyN2aWRlby1tYXAtcG9saW8nKS5sZW5ndGggPiAwXG4gICAgc2V0VmlkZW9NYXBQb2xpbygpXG5cbiAgIyMjXG4gIC8vIFZhY2NpbmUgbWFwXG4gIGlmICgkKCcjdmFjY2luZS1tYXAnKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHZhY2NpbmVfbWFwID0gbmV3IFZhY2NpbmVNYXAoJ3ZhY2NpbmUtbWFwJyk7XG4gICAgLy92YWNjaW5lX21hcC5nZXREYXRhID0gdHJ1ZTsgLy8gU2V0IHRydWUgdG8gZG93bmxvYWQgYSBwb2xpbyBjYXNlcyBjc3ZcbiAgICAvL3ZhY2NpbmVfbWFwLmdldFBpY3R1cmVTZXF1ZW5jZSA9IHRydWU7IC8vIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgbWFwIHBpY3R1cmUgc2VxdWVuY2VcbiAgICB2YWNjaW5lX21hcC5pbml0KGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1wb2xpby1jYXNlcy5jc3YnLCBiYXNldXJsKycvYXNzZXRzL2RhdGEvbWFwLXBvbGlvLWNhc2VzLmNzdicpO1xuICAgICQod2luZG93KS5yZXNpemUoIHZhY2NpbmVfbWFwLm9uUmVzaXplICk7XG4gIH1cbiAgIyMjXG5cbiAgaWYgJCgnLnZhY2NpbmVzLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lRGlzZWFzZUhlYXRtYXBHcmFwaCgpXG5cbiAgIyMjXG4gICMgVmFjY2luZSBhbGwgZGlzZWFzZXMgZ3JhcGhcbiAgaWYgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcyA9IG5ldyBWYWNjaW5lRGlzZWFzZUdyYXBoKCd2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKVxuICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgLmFjdGl2ZSBhJykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMub25SZXNpemVcbiAgICAjIFVwZGF0ZSBncmFwaCBiYXNlZCBvbiBzZWxlY3RlZCBkaXNlYXNlXG4gICAgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgYScpLmNsaWNrIChlKSAtPlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAkKHRoaXMpLnRhYiAnc2hvdydcbiAgICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCh0aGlzKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLnZhbCgpXG4gICAgICByZXR1cm5cbiAgICAjIFVwZGF0ZSBncmFwaCBiYXNlb24gb24gb3JkZXIgc2VsZWN0b3JcbiAgICAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLmNoYW5nZSAoZCkgLT5cbiAgICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgLmFjdGl2ZSBhJykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCh0aGlzKS52YWwoKVxuICAjIyNcblxuICBpZiAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlRHluYW1pY0xpbmVHcmFwaCgpXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlTXVsdGlwbGVTbWFsbEdyYXBoKClcblxuICBpZiAkKCcjd29ybGQtY2FzZXMnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBXb3JsZENhc2VzTXVsdGlwbGVTbWFsbEdyYXBoKClcbiAgXG4gIGlmICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkRpc2Vhc2VCYXJHcmFwaCgpXG5cbiAgaWYgJCgnI21lYXNsZXMtd29ybGQtbWFwLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwTWVhc2xlc1dvcmxkTWFwR3JhcGgoKVxuXG4gIGlmICQoJyN2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lQ29uZmlkZW5jZUJhckdyYXBoKClcblxuKSBqUXVlcnkiXX0=
