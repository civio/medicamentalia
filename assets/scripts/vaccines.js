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

  window.HeatmapGraph = (function(superClass) {
    extend(HeatmapGraph, superClass);

    function HeatmapGraph(id, options) {
      this.getCountryName = bind(this.getCountryName, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setMarkerDimensions = bind(this.setMarkerDimensions, this);
      this.setCellDimensions = bind(this.setCellDimensions, this);
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.getScaleYRange = bind(this.getScaleYRange, this);
      this.getScaleXRange = bind(this.getScaleXRange, this);
      HeatmapGraph.__super__.constructor.call(this, id, options);
      this.formatFloat = d3.format(',.1f');
      this.formatInteger = d3.format(',d');
      return this;
    }

    HeatmapGraph.prototype.setSVG = function() {
      this.svg = null;
      this.container = d3.select('#' + this.id + ' .heatmap-graph');
      if (this.options.legend) {
        this.container.classed('has-legend', true);
      }
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
      if (this.options.legend) {
        this.drawLegend();
      }
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
      this.color.domain(this.getColorDomain());
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

    HeatmapGraph.prototype.getColorDomain = function() {
      return [0, 400];
    };

    HeatmapGraph.prototype.getDimensions = function() {
      var cellSize;
      this.width = this.$el.width() - 70;
      if (this.years && this.countries) {
        cellSize = Math.floor(this.width / this.years.length);
        if (cellSize < 15) {
          cellSize = 15;
          this.width = (cellSize * this.years.length) + 70;
        }
        this.height = cellSize < 20 ? cellSize * this.countries.length : 20 * this.countries.length;
      }
      return this;
    };

    HeatmapGraph.prototype.drawGraph = function() {
      this.x.range(this.getScaleXRange());
      this.y.range(this.getScaleYRange());
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
      this.container.append('div').attr('class', 'cell-container').style('height', this.height + 'px').selectAll('.cell').data(this.cellsData).enter().append('div').attr('class', 'cell').style('background', (function(_this) {
        return function(d) {
          return _this.color(d.value);
        };
      })(this)).on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut).call(this.setCellDimensions);
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
          return (_this.y(d.code) - 1) + 'px';
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
      })(this)).style('height', (this.y.bandwidth() + 1) + 'px');
    };

    HeatmapGraph.prototype.onMouseOver = function(d) {
      var offset;
      offset = $(d3.event.target).offset();
      this.$tooltip.find('.tooltip-inner .country').html(d.name);
      this.$tooltip.find('.tooltip-inner .year').html(d.year);
      this.$tooltip.find('.tooltip-inner .value').html(d.value === 0 ? 0 : this.formatFloat(d.value));
      this.$tooltip.find('.tooltip-inner .cases').html(this.formatInteger(d.cases));
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

    HeatmapGraph.prototype.drawLegend = function() {
      var legendData;
      legendData = [0, 100, 200, 300, 400];
      this.legend = this.container.append('ul').attr('class', 'legend').style('margin-left', -(15 * legendData.length) + 'px');
      return this.legend.selectAll('li').data(legendData).enter().append('li').style('background', (function(_this) {
        return function(d) {
          return _this.color(d);
        };
      })(this)).html(function(d, i) {
        if (i !== 0) {
          return d;
        } else {
          return '&nbsp';
        }
      });

      /*
      legendData.shift()
       * draw legend texts
      @legend.selectAll('text')
        .data legendData
        .enter().append('text')
          .attr 'x', (d,i) -> Math.round legenItemWidth*(i-0.5-(legendData.length/2))
          .attr 'y', 20
          .attr 'text-anchor', 'start'
          .text (d) -> d
       */
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

  window.ScatterplotGraph = (function(superClass) {
    extend(ScatterplotGraph, superClass);

    function ScatterplotGraph(id, options) {
      this.setTooltipData = bind(this.setTooltipData, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.onResize = bind(this.onResize, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.setDotLabelsDimensions = bind(this.setDotLabelsDimensions, this);
      this.setDotsDimensions = bind(this.setDotsDimensions, this);
      this.getDotFill = bind(this.getDotFill, this);
      this.getDotSize = bind(this.getDotSize, this);
      this.getDotLabelText = bind(this.getDotLabelText, this);
      this.getDotLabelId = bind(this.getDotLabelId, this);
      this.getDotId = bind(this.getDotId, this);
      this.getSizeDomain = bind(this.getSizeDomain, this);
      this.getSizeRange = bind(this.getSizeRange, this);
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getColorRange = bind(this.getColorRange, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      options.dotSize = options.dotSize || 7;
      options.dotMinSize = options.dotMinSize || 7;
      options.dotMaxSize = options.dotMaxSize || 12;
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

    ScatterplotGraph.prototype.setSVG = function() {
      ScatterplotGraph.__super__.setSVG.call(this);
      return this.$tooltip = this.$el.find('.tooltip');
    };

    ScatterplotGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(0.25).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.color) {
        this.color = d3.scaleOrdinal().range(this.getColorRange());
      }
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width);
      return this;
    };

    ScatterplotGraph.prototype.getScaleXDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.x];
          };
        })(this))
      ];
    };

    ScatterplotGraph.prototype.getScaleYDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this))
      ];
    };

    ScatterplotGraph.prototype.getColorRange = function() {
      return ['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00'];
    };

    ScatterplotGraph.prototype.getColorDomain = function() {
      return d3.extent(this.data, (function(_this) {
        return function(d) {
          return d[_this.options.key.color];
        };
      })(this));
    };

    ScatterplotGraph.prototype.getSizeRange = function() {
      return [this.options.dotMinSize, this.options.dotMaxSize];
    };

    ScatterplotGraph.prototype.getSizeDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.size];
          };
        })(this))
      ];
    };

    ScatterplotGraph.prototype.drawScales = function() {
      ScatterplotGraph.__super__.drawScales.call(this);
      if (this.color) {
        this.color.domain(this.getColorDomain());
      }
      if (this.size) {
        this.size.domain(this.getSizeDomain());
      }
      return this;
    };

    ScatterplotGraph.prototype.drawGraph = function() {
      this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', this.getDotId).attr('r', this.getDotSize).style('fill', this.getDotFill).call(this.setDotsDimensions);
      this.container.selectAll('.dot-label').data(this.data).enter().append('text').attr('class', 'dot-label').attr('id', this.getDotLabelId).attr('dx', '0.75em').attr('dy', '0.375em').text(this.getDotLabelText).call(this.setDotLabelsDimensions);
      if (this.$tooltip) {
        this.container.selectAll('.dot').on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut);
      }
      return this;
    };

    ScatterplotGraph.prototype.updateGraphDimensions = function() {
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
      ScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.container.selectAll('.dot').call(this.setDotsDimensions);
      this.container.selectAll('.dot-label').call(this.setDotLabelsDimensions);
      return this;
    };

    ScatterplotGraph.prototype.getDotId = function(d) {
      return 'dot-' + d[this.options.key.id];
    };

    ScatterplotGraph.prototype.getDotLabelId = function(d) {
      return 'dot-label-' + d[this.options.key.id];
    };

    ScatterplotGraph.prototype.getDotLabelText = function(d) {
      return d[this.options.key.id];
    };

    ScatterplotGraph.prototype.getDotSize = function(d) {
      if (this.size) {
        return this.size(d[this.options.key.size]);
      } else {
        return this.options.dotSize;
      }
    };

    ScatterplotGraph.prototype.getDotFill = function(d) {
      if (this.color) {
        return this.color(d[this.options.key.color]);
      } else {
        return null;
      }
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

    ScatterplotGraph.prototype.onResize = function() {
      if (this.$el && this.containerWidth !== this.$el.width()) {
        ScatterplotGraph.__super__.onResize.call(this);
      }
      return this;
    };

    ScatterplotGraph.prototype.onMouseOver = function(d) {
      var element;
      element = d3.select(d3.event.target);
      this.setTooltipData(d);
      return this.$tooltip.css({
        left: +element.attr('cx') + this.options.margin.left - (this.$tooltip.width() * 0.5),
        top: +element.attr('cy') + this.options.margin.top - this.$tooltip.height() - 15,
        opacity: 1
      });
    };

    ScatterplotGraph.prototype.onMouseOut = function(d) {
      return this.$tooltip.css('opacity', '0');
    };

    ScatterplotGraph.prototype.setTooltipData = function(d) {
      this.$tooltip.find('.tooltip-inner .title').html(d[this.options.key.id]);
      this.$tooltip.find('.tooltip-inner .value-x').html(d[this.options.key.x]);
      return this.$tooltip.find('.tooltip-inner .value-y').html(d[this.options.key.y]);
    };

    return ScatterplotGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ScatterplotDiscreteGraph = (function(superClass) {
    extend(ScatterplotDiscreteGraph, superClass);

    function ScatterplotDiscreteGraph(id, options) {
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setDotLinesDimensions = bind(this.setDotLinesDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getDotLineId = bind(this.getDotLineId, this);
      this.getDotLabelId = bind(this.getDotLabelId, this);
      this.getDotId = bind(this.getDotId, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      ScatterplotDiscreteGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    ScatterplotDiscreteGraph.prototype.dataParser = function(data) {
      return data;
    };

    ScatterplotDiscreteGraph.prototype.setScales = function() {
      this.x = d3.scaleLinear();
      this.y = d3.scalePoint();
      this.xAxis = d3.axisBottom(this.x);
      this.yAxis = d3.axisLeft(this.y);
      return this;
    };

    ScatterplotDiscreteGraph.prototype.drawScales = function() {
      this.y.domain(this.getScaleYDomain());
      this.getDimensions();
      this.svg.attr('height', this.containerHeight);
      this.x.range(this.getScaleXRange());
      this.y.range(this.getScaleYRange());
      if (this.options.key.color) {
        this.color = d3.scaleOrdinal().range(this.getColorRange());
      }
      if (this.options.key.size) {
        this.size = d3.scaleLinear().range(this.getSizeRange());
      }
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
      ScatterplotDiscreteGraph.__super__.drawScales.call(this);
      return this;
    };

    ScatterplotDiscreteGraph.prototype.drawGraph = function() {
      ScatterplotDiscreteGraph.__super__.drawGraph.call(this);
      this.container.selectAll('.dot-line').data(this.data).enter().append('line').attr('class', 'dot-line').attr('id', this.getDotLineId).style('stroke', this.getDotFill).call(this.setDotLinesDimensions);
      if (this.options.legend) {
        this.drawLegend();
      }
      return this;
    };

    ScatterplotDiscreteGraph.prototype.drawLegend = function() {
      var vaccines;
      vaccines = d3.nest().key(function(d) {
        return d.vaccine;
      }).entries(this.data);
      vaccines.sort(function(a, b) {
        if (a.key > b.key) {
          return 1;
        } else {
          return -1;
        }
      });
      return d3.select('#' + this.id + ' .graph-legend ul').selectAll('li').data(vaccines).enter().append('li').attr('id', function(d) {
        return 'legend-item-' + d.key;
      }).style('background', function(d) {
        return d.values[0].vaccine_color;
      }).html(function(d) {
        return d.values[0].vaccine_name;
      }).on('mouseover', (function(_this) {
        return function(d) {
          return _this.highlightVaccines(d.key);
        };
      })(this)).on('mouseout', this.onMouseOut);
    };

    ScatterplotDiscreteGraph.prototype.getDimensions = function() {
      if (this.$el) {
        this.containerWidth = this.$el.width();
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        if (this.y) {
          this.containerHeight = this.y.domain().length * 30;
          this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
        }
      }
      return this;
    };

    ScatterplotDiscreteGraph.prototype.updateGraphDimensions = function() {
      ScatterplotDiscreteGraph.__super__.updateGraphDimensions.call(this);
      this.container.selectAll('.dot-line').call(this.setDotLinesDimensions);
      return this;
    };

    ScatterplotDiscreteGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(0,0)');
    };

    ScatterplotDiscreteGraph.prototype.getDotId = function(d) {
      return 'dot-' + d[this.options.key.id] + '-' + d[this.options.key.color];
    };

    ScatterplotDiscreteGraph.prototype.getDotLabelId = function(d) {
      return 'dot-label-' + d[this.options.key.id] + '-' + d[this.options.key.color];
    };

    ScatterplotDiscreteGraph.prototype.getDotLineId = function(d) {
      return 'dot-line-' + d[this.options.key.id];
    };

    ScatterplotDiscreteGraph.prototype.getDotLabelText = function(d) {
      return '';
    };

    ScatterplotDiscreteGraph.prototype.getScaleYDomain = function() {
      return this.data.map((function(_this) {
        return function(d) {
          return d[_this.options.key.y];
        };
      })(this));
    };

    ScatterplotDiscreteGraph.prototype.setDotLinesDimensions = function(element) {
      return element.attr('x1', (function(_this) {
        return function(d) {
          return 0;
        };
      })(this)).attr('y1', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this)).attr('x2', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('y2', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
    };

    ScatterplotDiscreteGraph.prototype.onMouseOver = function(d) {
      var element, offsetTop;
      element = d3.select(d3.event.target);
      this.setTooltipData(d);
      offsetTop = this.options.legend ? $('#' + this.id + ' .graph-legend').height() : 0;
      this.$tooltip.css({
        left: +element.attr('cx') + this.options.margin.left - (this.$tooltip.width() * 0.5),
        top: +element.attr('cy') + offsetTop + this.options.margin.top - this.$tooltip.height() - 15,
        opacity: 1
      });
      return this.highlightVaccines(d3.select(d3.event.target).data()[0][this.options.key.color]);
    };

    ScatterplotDiscreteGraph.prototype.onMouseOut = function(d) {
      ScatterplotDiscreteGraph.__super__.onMouseOut.call(this, d);
      this.container.selectAll('.dot').classed('inactive', false).classed('active', false);
      this.container.selectAll('.dot-line').classed('active', false);
      if (this.options.legend) {
        return d3.selectAll('#' + this.id + ' .graph-legend li').classed('inactive', false).classed('active', false);
      }
    };

    ScatterplotDiscreteGraph.prototype.highlightVaccines = function(vaccine) {
      this.container.selectAll('.dot').classed('inactive', true);
      this.container.selectAll('.dot').filter((function(_this) {
        return function(d) {
          return d[_this.options.key.color] === vaccine;
        };
      })(this)).classed('inactive', false).classed('active', true);
      this.container.selectAll('.dot-line').filter((function(_this) {
        return function(d) {
          return d[_this.options.key.color] === vaccine;
        };
      })(this)).classed('active', true);
      this.container.selectAll('.dot').sort((function(_this) {
        return function(a, b) {
          if (a[_this.options.key.color] === vaccine) {
            return 1;
          } else {
            return -1;
          }
        };
      })(this));
      if (this.options.legend) {
        d3.selectAll('#' + this.id + ' .graph-legend li').classed('inactive', true);
        return d3.selectAll('#' + this.id + ' #legend-item-' + vaccine).classed('inactive', false).classed('active', true);
      }
    };

    ScatterplotDiscreteGraph.prototype.setTooltipData = function(d) {
      var company, dosesFormat, pricesFormat;
      dosesFormat = d3.format('.0s');
      pricesFormat = d3.format(',.1f');
      this.$tooltip.find('.tooltip-inner .title').html(d.name);
      this.$tooltip.find('.tooltip-inner .vaccine').html(d.vaccine_name);
      this.$tooltip.find('.tooltip-inner .price').html(pricesFormat(d.price));
      company = '';
      if (d.company) {
        company = d.company;
        if (d.company2) {
          company += ', ' + d.company2;
        }
        if (d.company3) {
          company += ', ' + d.company3;
        }
      }
      return this.$tooltip.find('.tooltip-inner .company').html(company);
    };

    return ScatterplotDiscreteGraph;

  })(window.ScatterplotGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ScatterplotVPHGraph = (function(superClass) {
    extend(ScatterplotVPHGraph, superClass);

    function ScatterplotVPHGraph(id, lang, options) {
      this.setTooltipData = bind(this.setTooltipData, this);
      this.getDotFill = bind(this.getDotFill, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      options.dotSize = 7;
      options.dotMinSize = 3;
      options.dotMaxSize = 18;
      this.lang = lang;
      ScatterplotVPHGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    ScatterplotVPHGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(0.125).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.color) {
        this.color = d3.scaleOrdinal().range(this.getColorRange());
      }
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues([1024, 4034, 12474]);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([15, 30, 45, 60, 75, 90]);
      return this;
    };

    ScatterplotVPHGraph.prototype.getScaleXDomain = function() {
      return [250, 102000];
    };

    ScatterplotVPHGraph.prototype.getScaleYDomain = function() {
      return [0, 90];
    };

    ScatterplotVPHGraph.prototype.getDotFill = function(d) {
      if (d[this.options.key.color] === '1') {
        return '#00797d';
      } else if (d[this.options.key.color] === '0') {
        return '#D64B05';
      } else {
        return '#aaa';
      }
    };

    ScatterplotVPHGraph.prototype.drawGraph = function() {
      ScatterplotVPHGraph.__super__.drawGraph.call(this);
      this.ringNote = d3.ringNote();
      this.setAnnotations();
      this.setXLegend();
      return this;
    };

    ScatterplotVPHGraph.prototype.setXLegend = function() {
      var incomeGroups;
      incomeGroups = [this.x.domain()[0], 1026, 4036, 12476, this.x.domain()[1]];
      return this.$el.find('.x-legend li').each((function(_this) {
        return function(i, el) {
          var val;
          val = 100 * (_this.x(incomeGroups[i + 1]) - _this.x(incomeGroups[i])) / _this.width;
          return $(el).width(val + '%');
        };
      })(this));
    };

    ScatterplotVPHGraph.prototype.setAnnotations = function() {
      var annotations;
      annotations = [
        {
          'cx': 0.23 * this.height,
          'cy': 0.17 * this.height,
          'r': 0.22 * this.height,
          'textWidth': 0.38 * this.width,
          'textOffset': [0.25 * this.height, 0]
        }, {
          'cx': 0.28 * this.height,
          'cy': 0.46 * this.height,
          'r': 0.072 * this.height,
          'textWidth': 0.36 * this.width,
          'textOffset': [0.18 * this.height, 0]
        }, {
          'cx': this.width - 0.35 * this.height,
          'cy': this.height - 0.12 * this.height,
          'r': 0.15 * this.height,
          'textWidth': 0.38 * this.width,
          'textOffset': [0, -0.2 * this.height]
        }
      ];
      $('#vaccine-vph-container-graph .mobile-pictures p').each(function(i, el) {
        return annotations[i].text = $(el).html();
      });
      return this.container.call(this.ringNote, annotations);
    };

    ScatterplotVPHGraph.prototype.updateGraphDimensions = function() {
      ScatterplotVPHGraph.__super__.updateGraphDimensions.call(this);
      this.setAnnotations();
      return this;
    };

    ScatterplotVPHGraph.prototype.setTooltipData = function(d) {
      var formatFloat;
      formatFloat = d3.format(',.1f');
      this.$tooltip.find('.vaccine span').css('display', 'none');
      this.$tooltip.find('.vaccine-' + d[this.options.key.color]).css('display', 'inline');
      this.$tooltip.find('.tooltip-inner .title').html(d[this.options.key.id]);
      return this.$tooltip.find('.tooltip-inner .value-y').html(formatFloat(d[this.options.key.y]));
    };

    return ScatterplotVPHGraph;

  })(window.ScatterplotGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.VaccinesPrices = (function() {
    VaccinesPrices.prototype.vaccines_names = {
      es: {
        'BCG': 'Tuberculosis (BCG)',
        'DTaP': 'Difteria, tétanos y tos ferina acelular (DTaP)',
        'DTP': 'Difteria, tétanos y tos ferina (DTP)',
        'DTPa-IPV-Hib': 'Pentavalente (DTP, polio e Hib)',
        'HepB-pediátrica': 'Hepatitis B pediátrica',
        'IPV': 'Polio (IPV)',
        'MMR': 'Sarampión, paperas y rubeola',
        'pneumo13': 'Neumococo (13)',
        'Tdap': 'Tétanos, difteria y tos ferina acelular reducida (Tdap)',
        'VPH': 'Virus del papiloma humano (VPH)',
        'VPH-Cervarix2': 'VPH Cervarix2',
        'VPH-Gardasil4': 'VPH Gardasil4',
        'VPH-Gardasil9': 'VPH Gardasil9'
      },
      en: {
        'BCG': 'Tuberculosis (BCG)',
        'DTaP': 'Diphteria, tetanus and acellular pertussis (DTaP)',
        'DTP': 'Diphteria, tetanus and pertussis (DTP)',
        'DTPa-IPV-Hib': 'Pentavalent (DTP, polio and Hib)',
        'HepB-pediátrica': 'Hepatitis B pediatric',
        'IPV': 'Polio (IPV)',
        'MMR': 'Measles, mumps and rubella',
        'pneumo13': 'Pneumococcus (13)',
        'Tdap': 'Tetanus, reduced diphtheria and reduced acellular pertussis (Tdap)',
        'VPH': 'Human papilomavirus (HPV)',
        'VPH-Cervarix2': 'VPH Cervarix2',
        'VPH-Gardasil4': 'VPH Gardasil4',
        'VPH-Gardasil9': 'VPH Gardasil9'
      }
    };

    VaccinesPrices.prototype.vaccines_colors = {
      'BCG': '#C9AD4B',
      'DTaP': '#63BA2D',
      'DTP': '#34A893',
      'DTPa-IPV-Hib': '#BBD646',
      'HepB-pediátrica': '#3D91AD',
      'IPV': '#5B8ACB',
      'MMR': '#E2773B',
      'pneumo13': '#BA7DAF',
      'Tdap': '#F49D9D',
      'VPH-Cervarix2': '#FFA951',
      'VPH-Gardasil4': '#B56631',
      'VPH-Gardasil9': '#E25453'
    };

    function VaccinesPrices(_lang, _baseurl, _dataurl) {
      this.onDataLoaded = bind(this.onDataLoaded, this);
      this.lang = _lang;
      d3.queue().defer(d3.csv, _baseurl + _dataurl).defer(d3.csv, _baseurl + '/data/gdp.csv').await(this.onDataLoaded);
    }

    VaccinesPrices.prototype.onDataLoaded = function(error, _data, _countries) {
      var dataIPV, dataOrganizations, dataTdap, graph, pibData;
      this.data = _data;
      this.countries = _countries;
      this.parseData();
      if ($('#vaccine-prices-all-graph').length > 0) {
        this.setupScatterplot('vaccine-prices-all-graph', this.data, true);
      }
      if ($('#vaccine-prices-organizations-graph').length > 0) {
        dataOrganizations = this.data.filter(function(d) {
          return d.country === 'MSF' || d.country === 'PAHO' || d.country === 'UNICEF';
        });
        this.setupScatterplot('vaccine-prices-organizations-graph', dataOrganizations, true);
      }
      if ($('#vaccine-prices-tdap-graph').length > 0) {
        dataTdap = this.data.filter(function(d) {
          return d.vaccine === 'Tdap';
        });
        this.setupScatterplot('vaccine-prices-tdap-graph', dataTdap, false);
      }
      if ($('#vaccine-prices-ipv-graph').length > 0) {
        dataIPV = this.data.filter(function(d) {
          return d.vaccine === 'IPV' && d.country !== 'MSF' && d.country !== 'PAHO' && d.country !== 'UNICEF';
        });
        this.setupScatterplot('vaccine-prices-ipv-graph', dataIPV, false);
      }
      if ($('#vaccine-prices-vph-graph').length > 0) {
        this.setupScatterplot('vaccine-prices-vph-graph', this.data, true);
      }
      if ($('#pib-countries-graph').length > 0) {
        pibData = d3.nest().key(function(d) {
          return d.country;
        }).entries(this.data);
        pibData = pibData.map(function(d) {
          return {
            id: d.key,
            name: d.values[0].name,
            gdp: d.values[0].gdp * 0.937
          };
        });
        pibData = pibData.filter(function(d) {
          return d.gdp > 0;
        }).sort(function(a, b) {
          return b.gdp - a.gdp;
        });
        graph = new window.BarGraph('pib-countries-graph', {
          label: {
            format: function(d) {
              var f;
              f = d3.format(',d');
              return f(d) + '€';
            }
          },
          margin: {
            right: 10,
            left: 10
          },
          key: {
            x: 'name',
            y: 'gdp',
            id: 'id'
          }
        });
        graph.setData(pibData);
        return $(window).resize(graph.onResize);
      }
    };

    VaccinesPrices.prototype.parseData = function() {
      var vaccines;
      vaccines = ['pneumo13', 'BCG', 'IPV', 'MMR', 'HepB-pediátrica', 'VPH-Cervarix2', 'VPH-Gardasil4', 'VPH-Gardasil9', 'DTPa-IPV-Hib', 'DTaP', 'Tdap', 'DTP'];
      this.data = this.data.filter(function(d) {
        return vaccines.indexOf(d.vaccine) !== -1;
      });
      this.data.forEach((function(_this) {
        return function(d) {
          var country;
          country = _this.countries.filter(function(e) {
            return e.code === d.country;
          });
          d.price = +d.price;
          d.vaccine_name = _this.vaccines_names[_this.lang][d.vaccine] ? _this.vaccines_names[_this.lang][d.vaccine] : d.vaccine;
          d.vaccine_color = _this.vaccines_colors[d.vaccine];
          if (country[0]) {
            d.name = d['name_' + _this.lang];
            return d.gdp = country[0].value;
          } else {
            d.name = d['name_' + _this.lang];
            return d.gdp = 0;
          }
        };
      })(this));
      return this.data.sort(function(a, b) {
        return a.gdp - b.gdp;
      });
    };

    VaccinesPrices.prototype.setupScatterplot = function(_id, _data, _legend) {
      var graph;
      graph = new window.ScatterplotDiscreteGraph(_id, {
        legend: _legend,
        margin: {
          top: 5,
          right: 5,
          left: 60,
          bottom: 20
        },
        key: {
          x: 'price',
          y: 'name',
          id: 'country',
          color: 'vaccine'
        }
      });
      graph.yAxis.tickPadding(12);
      graph.xAxis.ticks(5).tickPadding(10).tickFormat(function(d) {
        return d + '€';
      });
      graph.getDotFill = function(d) {
        return d.vaccine_color;
      };
      graph.setData(_data);
      return $(window).resize(graph.onResize);
    };

    return VaccinesPrices;

  })();

}).call(this);

(function() {
  (function($) {
    var baseurl, excludedCountries, formatFloat, formatInteger, getCountryName, lang, setVideoMapPolio, setupHeatMapGraph, setupImmunizationCoverageDynamicLineGraph, setupImmunizationCoverageMultipleSmallGraph, setupImmunizationDiseaseBarGraph, setupMeaslesWorldMapGraph, setupVaccineBcgCasesMap, setupVaccineBcgStockoutsMap, setupVaccineConfidenceBarGraph, setupVaccineDiseaseHeatmapGraph, setupVaccineVPHGraph, setupWorldCasesMultipleSmallGraph;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    excludedCountries = ['NIU', 'COK', 'TUV', 'NRU', 'PLW', 'VGB', 'MAF', 'SMR', 'GIB', 'TCA', 'LIE', 'MCO', 'SXM', 'FRO', 'MHL', 'MNP', 'ASM', 'KNA', 'GRL', 'CY', 'BMU', 'AND', 'DMA', 'IMN', 'ATG', 'SYC', 'VIR', 'ABW', 'FSM', 'TON', 'GRD', 'VCT', 'KIR', 'CUW', 'CHI', 'GUM', 'LCA', 'STP', 'WSM', 'VUT', 'NCL', 'PYF', 'BRB'];
    if (lang === 'es') {
      d3.formatDefaultLocale({
        "currency": ["$", ""],
        "decimal": ",",
        "thousands": ".",
        "grouping": [3]
      });
    }
    formatFloat = d3.format(',.1f');
    formatInteger = d3.format(',d');
    $('[data-toggle="tooltip"]').tooltip();
    getCountryName = function(countries, code, lang) {
      var item;
      item = countries.filter(function(d) {
        return d.code === code;
      });
      if (item) {
        if (lang === 'es') {
          return item[0]['name_es'];
        } else {
          return item[0]['name_en'];
        }
      } else {
        return console.error('No country name for code', code);
      }
    };
    setVideoMapPolio = function() {
      return d3.csv(baseurl + '/data/diseases-polio-cases-total.csv', function(error, data) {
        var cases, casesStr, i, notes, popcorn, wrapper, year, yearDuration;
        cases = {};
        casesStr = lang === 'es' ? 'casos' : 'cases';
        data.forEach(function(d) {
          return cases[d.year] = d.value;
        });
        wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio');
        wrapper.src = 'https://www.youtube.com/embed/o-EzVOjnc6Q?controls=0&showinfo=0&hd=1';
        popcorn = Popcorn(wrapper);
        notes = 2017 - 1980;
        yearDuration = 27 / (notes + 1);
        i = 0;
        while (i < notes) {
          year = '' + (1980 + i);
          popcorn.footnote({
            start: yearDuration * i,
            end: i < notes - 1 ? yearDuration * (i + 1) : (yearDuration * (i + 1)) + 1,
            text: year + '<br><span class="value">' + formatInteger(cases[year]) + ' ' + casesStr + '</span>',
            target: 'video-map-polio-description'
          });
          i++;
        }
        wrapper.addEventListener('ended', function(e) {
          $('.video-map-polio-cover').show();
          $('#video-map-polio-description, #video-map-polio iframe').fadeTo(0, 0);
          return popcorn.currentTime(0);
        });
        return $('#video-map-polio-play-btn').click(function(e) {
          e.preventDefault();
          popcorn.play();
          $('.video-map-polio-cover').fadeOut();
          return $('#video-map-polio-description, #video-map-polio iframe').fadeTo(300, 1);
        });
      });
    };
    setupMeaslesWorldMapGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/measles-cases-who-regions.csv').defer(d3.csv, baseurl + '/data/countries-who-regions.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data, countries, map) {
        var graph;
        countries.forEach(function(country) {
          var region;
          region = data.filter(function(d) {
            return d.region === country.region;
          });
          if (region.length > 0) {
            country.value = region[0].cases * 100000;
            country.cases = region[0].cases_total;
            return country.name = region[0]['name_' + lang];
          }
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
    setupHeatMapGraph = function(id, data, countries, legend) {
      var graph;
      data = data.filter(function(d) {
        return countries.indexOf(d.code) !== -1 && d3.values(d.values).length > 0;
      }).sort(function(a, b) {
        return a.total - b.total;
      });
      graph = new window.HeatmapGraph(id, {
        legend: legend,
        margin: {
          right: 0,
          left: 0
        }
      });
      graph.setData(data);
      return $(window).resize(graph.onResize);
    };
    setupVaccineConfidenceBarGraph = function() {
      return d3.csv(baseurl + '/data/confidence.csv', function(error, data) {
        return d3.json('https://freegeoip.net/json/', function(error, location) {
          var graph;
          if (!location) {
            location = {};
            if (lang === 'de') {
              location.code = 'DEU';
            } else {
              location.code = 'ESP';
            }
          }
          data.forEach((function(_this) {
            return function(d) {
              d.value = +d.value;
              if (lang === 'de') {
                d.name = d['name_en'];
              } else {
                d.name = d['name_' + lang];
              }
              delete d.name_es;
              delete d.name_en;
              if (location && d.code === location.code) {
                return d.active = true;
              }
            };
          })(this));
          graph = new window.BarGraph('vaccine-confidence-graph', {
            aspectRatio: 0.3,
            label: {
              format: function(d) {
                return formatFloat(d) + '%';
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
      });
    };
    setupVaccineBcgCasesMap = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/tuberculosis-cases.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data, countries, map) {
        var graph;
        data.forEach(function(d) {
          var item;
          item = countries.filter(function(country) {
            return country.code === d.code;
          });
          d.value = +d.cases_population;
          d.cases = +d.cases;
          if (item) {
            d.name = item[0]['name_' + lang];
            return d.code_num = item[0]['code_num'];
          }
        });
        graph = new window.MapGraph('vaccine-bcg-cases-graph', {
          aspectRatio: 0.5625,
          margin: {
            top: 60,
            bottom: 0
          },
          legend: true
        });
        graph.getLegendData = function() {
          return [0, 200, 400, 600, 800];
        };
        graph.setData(data, map);
        return $(window).resize(graph.onResize);
      });
    };
    setupVaccineBcgStockoutsMap = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/bcg-stockouts.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data, countries, map) {
        var graph, years;
        years = d3.range(2006, 2016);
        data.forEach(function(d) {
          var item;
          item = countries.filter(function(country) {
            return country.code === d.code;
          });
          d.value = +d.value;
          d.years = '';
          years.forEach(function(year) {
            if (d[year] === '2' || d[year] === '3') {
              d.years += year + ',';
            }
            return delete d[year];
          });
          if (item) {
            d.name = item[0]['name_' + lang];
            return d.code_num = item[0]['code_num'];
          }
        });
        graph = new window.MapGraph('vaccine-bcg-stockouts', {
          aspectRatio: 0.5625,
          margin: {
            top: 60,
            bottom: 0
          },
          legend: true
        });
        graph.formatFloat = graph.formatInteger;
        graph.getLegendData = function() {
          return [0, 2, 4, 6, 8];
        };
        graph.setTooltipData = function(d) {
          graph.$tooltip.find('.tooltip-inner .title').html(d.name);
          graph.$tooltip.find('.description, .years-cells').hide();
          if (d.value === 0) {
            return graph.$tooltip.find('.description-zero').show();
          } else if (d.value === 1) {
            graph.$tooltip.find('.description-one .value').html(d.years.split(',')[0]);
            return graph.$tooltip.find('.description-one').show();
          } else {
            graph.$tooltip.find('.description-multiple .value').html(graph.formatInteger(d.value));
            graph.$tooltip.find('.years-cells li').toggleClass('active', false);
            d.years.split(',').forEach(function(year) {
              return graph.$tooltip.find('.years-cells li[data-year="' + year + '"]').toggleClass('active', true);
            });
            return graph.$tooltip.find('.description-multiple, .years-cells').show();
          }
        };
        graph.setData(data, map);
        return $(window).resize(graph.onResize);
      });
    };
    setupVaccineDiseaseHeatmapGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/diseases-cases-measles.csv').defer(d3.csv, baseurl + '/data/population.csv').await(function(error, data_cases, data_population) {
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
                  d.values[year] = 100000 * +d[year] / population;
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
        setupHeatMapGraph('vaccines-measles-graph-1', data_cases, ['FIN', 'HUN', 'PRT', 'URY', 'MEX', 'COL'], true);
        return setupHeatMapGraph('vaccines-measles-graph-2', data_cases, ['IRQ', 'BGR', 'MNG', 'ZAF', 'FRA', 'GEO'], false);
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
      d3.csv(baseurl + '/data/immunization-coverage.csv', function(error, data) {
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
      var current_countries, graphs;
      current_countries = ['LKA', 'DZA', 'DEU', 'DNK', 'FRA'];
      graphs = [];
      return d3.queue().defer(d3.csv, baseurl + '/data/immunization-coverage-mcv2.csv').defer(d3.csv, baseurl + '/data/countries.csv').await(function(error, data, countries) {
        return d3.json('https://freegeoip.net/json/', function(error, location) {
          var el, user_country;
          if (location) {
            user_country = countries.filter(function(d) {
              return d.code2 === location.country_code;
            });
            if (user_country && user_country.length > 0 && user_country[0].code) {
              if (current_countries.indexOf(user_country[0].code) === -1) {
                current_countries[2] = user_country[0].code;
                el = $('#immunization-coverage-graph .graph-container').eq(2);
                el.find('p').html(user_country[0]['name_' + lang]);
                el.find('.line-graph').attr('id', 'immunization-coverage-' + user_country[0].code.toLowerCase() + '-graph');
              }
            }
          }
          return current_countries.forEach(function(country, i) {
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
              label: i % 2 !== 0 ? '' : lang === 'es' ? 'Nivel de rebaño' : lang === 'de' ? 'Herdenimmunität' : 'Herd immunity',
              align: 'left'
            });
            graph.$el.on('draw-complete', function(e) {
              graph.setLabel(2015);
              graph.container.select('.x.axis').selectAll('.tick').style('display', 'block');
              return graph.container.select('.tick-hover').style('display', 'none');
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
      });
    };
    setupWorldCasesMultipleSmallGraph = function() {
      var diseases, graphs;
      diseases = ['diphteria', 'measles', 'pertussis', 'polio', 'tetanus'];
      graphs = [];
      return d3.csv(baseurl + '/data/diseases-cases-world.csv', function(error, data) {
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
      return d3.queue().defer(d3.csv, baseurl + '/data/immunization-coverage.csv').defer(d3.csv, baseurl + '/data/countries.csv').await(function(error, data, countries) {
        return d3.json('https://freegeoip.net/json/', function(error, location) {
          var data_parser, data_sort, herdImmunity, user_country;
          if (location) {
            user_country = countries.filter(function(d) {
              return d.code2 === location.country_code;
            });
            location.code = user_country[0].code;
            location.name = user_country[0]['name_' + lang];
          } else {
            location = {};
            if (lang === 'de') {
              location.code = 'DEU';
              location.name = 'Germany';
            } else {
              location.code = 'ESP';
              location.name = lang === 'es' ? 'España' : 'Spain';
            }
          }
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
              label: lang === 'es' ? 'Nivel de rebaño' : lang === 'de' ? 'Herdenimmunität' : 'Herd immunity'
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
      });
    };
    setupVaccineVPHGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/vph.csv').defer(d3.csv, baseurl + '/data/gdp.csv').await(function(error, data, countries) {
        var graph;
        data = data.filter(function(d) {
          return excludedCountries.indexOf(d.country) === -1;
        });
        data.forEach(function(d) {
          var country;
          country = countries.filter(function(e) {
            return e.code === d.country;
          });
          if (country[0]) {
            d.name = country[0]['name_' + lang];
            d.gdp = +country[0].value;
          } else {

          }
          return d.value = +d.deaths;
        });
        data = data.filter(function(d) {
          return d.gdp;
        });
        graph = new window.ScatterplotVPHGraph('vaccine-vph-graph', lang, {
          margin: {
            left: 20,
            top: 30,
            bottom: 0
          },
          key: {
            x: 'gdp',
            y: 'value',
            id: 'name',
            color: 'vaccine'
          }
        });
        graph.setData(data);
        return $(window).resize(graph.onResize);
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
      graph.loadData baseurl+'/data/guatemala-coverage-mmr.csv'
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
    ## Vaccine map
    if $('#vaccine-map').length > 0
      vaccine_map = new VaccineMap 'vaccine-map'
      #vaccine_map.getData = true  #  Set true to download a polio cases csv
      vaccine_map.getPictureSequence = true   # Set true to download a map picture sequence
      vaccine_map.init baseurl+'/data/diseases-polio-cases.csv', baseurl+'/data/map-polio-cases.csv'
      $(window).resize vaccine_map.onResize
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
      setupVaccineConfidenceBarGraph();
    }
    if ($('#vaccine-bcg-cases-graph').length > 0) {
      setupVaccineBcgCasesMap();
    }
    if ($('#vaccine-bcg-stockouts').length > 0) {
      setupVaccineBcgStockoutsMap();
    }
    if ($('#vaccine-vph-graph').length > 0) {
      setupVaccineVPHGraph();
    }
    if ($('body').hasClass('prices') || $('body').hasClass('precios')) {
      new VaccinesPrices(lang, baseurl, '/data/prices-vaccines.csv');
    }
    if ($('#vaccine-prices-vph-graph').length > 0) {
      return new VaccinesPrices(lang, baseurl, '/data/prices-vaccines-vph.csv');
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZGlzY3JldGUtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtdnBoLWdyYXBoLmNvZmZlZSIsIm1haW4tdmFjY2luZXMtcHJpY2VzLmNvZmZlZSIsIm1haW4tdmFjY2luZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFB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Q0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLFFBQW5CLENBQUEsSUFBaUMsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBcEM7TUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLDJCQUE5QixFQUROOztJQUlBLElBQUcsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBM0M7YUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLCtCQUE5QixFQUROOztFQTFsQkQsQ0FBRCxDQUFBLENBNmxCRSxNQTdsQkY7QUFBQSIsImZpbGUiOiJ2YWNjaW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFyR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmFyIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMC4xKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAZGF0YS5tYXAgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGFjdGl2ZScgZWxzZSAnYmFyJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgICMgZHJhdyBsYWJlbHMgeFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC14IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXgnXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJzEuMjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgICAgIyBkcmF3IGxhYmVscyB5XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXkgYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteSdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gaWYgQG9wdGlvbnMubGFiZWwuZm9ybWF0IHRoZW4gQG9wdGlvbnMubGFiZWwuZm9ybWF0KGRbQG9wdGlvbnMua2V5LnldKSBlbHNlIGRbQG9wdGlvbnMua2V5LnldXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgPT4gQGhlaWdodCAtIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEBoZWlnaHRcblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHVubGVzcyBkLmFjdGl2ZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAiLCJjbGFzcyB3aW5kb3cuTGluZUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgeUZvcm1hdDogZDMuZm9ybWF0KCdkJykgICAjIHNldCBsYWJlbHMgaG92ZXIgZm9ybWF0XG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTGluZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMgZGF0YVxuICAgIHN1cGVyKGRhdGEpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgeWVhcnMgPSBbXVxuICAgIGQzLmtleXMoZGF0YVswXSkuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGlmICtkXG4gICAgICAgIHllYXJzLnB1c2ggK2RcbiAgICByZXR1cm4geWVhcnMuc29ydCgpXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkW0BvcHRpb25zLmtleS54XSwgJ2VuICcsIHllYXIpO1xuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja0Zvcm1hdCBkMy5mb3JtYXQoJycpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgIyBzZXR1cCBsaW5lXG4gICAgQGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgIC54IChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAueSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICAjIHNldHVwIGFyZWFcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhID0gZDMuYXJlYSgpXG4gICAgICAgIC5jdXJ2ZSBkMy5jdXJ2ZUNhdG11bGxSb21cbiAgICAgICAgLnggIChkKSA9PiBAeCgrZC5rZXkpXG4gICAgICAgIC55MCBAaGVpZ2h0XG4gICAgICAgIC55MSAoZCkgPT4gQHkoZC52YWx1ZSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gW0B5ZWFyc1swXSwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbMCwgZDMubWF4IEBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkLnZhbHVlcykpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGNsZWFyIGdyYXBoIGJlZm9yZSBzZXR1cFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuZ3JhcGgnKS5yZW1vdmUoKVxuICAgICMgZHJhdyBncmFwaCBjb250YWluZXIgXG4gICAgQGdyYXBoID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2dyYXBoJ1xuICAgICMgZHJhdyBsaW5lc1xuICAgIEBkcmF3TGluZXMoKVxuICAgICMgZHJhdyBhcmVhc1xuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGRyYXdBcmVhcygpXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAZHJhd0xhYmVscygpXG4gICAgIyBkcmF3IG1vdXNlIGV2ZW50cyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGRyYXdMaW5lTGFiZWxIb3ZlcigpXG4gICAgICAjIGVsc2VcbiAgICAgICMgICBAZHJhd1Rvb2x0aXAoKVxuICAgICAgQGRyYXdSZWN0T3ZlcmxheSgpXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGFyZWEgeTBcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBhcmVhLnkwIEBoZWlnaHRcbiAgICAjIHVwZGF0ZSB5IGF4aXMgdGlja3Mgd2lkdGhcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgICAuYXR0ciAnZCcsIEBhcmVhXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy5vdmVybGF5JylcbiAgICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMaW5lczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiByZXR1cm4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcblxuICBkcmF3QXJlYXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXJlYSdcbiAgICAgIC5hdHRyICAnaWQnLCAgICAoZCkgPT4gJ2FyZWEtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuXG4gIGRyYXdMYWJlbHM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnZW5kJ1xuICAgICAgLmF0dHIgJ2R5JywgJy0wLjEyNWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG5cbiAgZHJhd0xpbmVMYWJlbEhvdmVyOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtcG9pbnQtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLXBvaW50J1xuICAgICAgLmF0dHIgJ3InLCA0XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAndGljay1ob3ZlcidcbiAgICAgIC5hdHRyICdkeScsICcwLjcxZW0nICAgICAgXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIGlmIEBkYXRhLmxlbmd0aCA9PSAxXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLWhvdmVyJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAuYXR0ciAnZHknLCAnLTAuNWVtJ1xuICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBkcmF3UmVjdE92ZXJsYXk6IC0+XG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ292ZXJsYXknXG4gICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VNb3ZlXG4gICAgICAub24gJ21vdXNlb3V0JywgIEBvbk1vdXNlT3V0XG4gICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuXG4gIHNldExhYmVsRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCBAd2lkdGhcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGQudmFsdWVzW0B5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXSlcblxuICBzZXRPdmVybGF5RGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3dpZHRoJywgQHdpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGhlaWdodFxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkZWwudHJpZ2dlciAnbW91c2VvdXQnXG4gICAgQGhpZGVMYWJlbCgpXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIHllYXIgPSBNYXRoLnJvdW5kIEB4LmludmVydChwb3NpdGlvblswXSlcbiAgICBpZiB5ZWFyICE9IEBjdXJyZW50WWVhclxuICAgICAgQCRlbC50cmlnZ2VyICdjaGFuZ2UteWVhcicsIHllYXJcbiAgICAgIEBzZXRMYWJlbCB5ZWFyXG5cbiAgc2V0TGFiZWw6ICh5ZWFyKSAtPlxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmVhY2ggKGQpID0+IEBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uIGRcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAgLmF0dHIgJ3gnLCBNYXRoLnJvdW5kIEB4KEBjdXJyZW50WWVhcilcbiAgICAgIC50ZXh0IEBjdXJyZW50WWVhclxuXG4gIGhpZGVMYWJlbDogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnRpY2staG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbjogKGRhdGEpID0+XG4gICAgIyBnZXQgY3VycmVudCB5ZWFyXG4gICAgeWVhciA9IEBjdXJyZW50WWVhclxuICAgIHdoaWxlIEB5ZWFycy5pbmRleE9mKHllYXIpID09IC0xICYmIEBjdXJyZW50WWVhciA+IEB5ZWFyc1swXVxuICAgICAgeWVhci0tXG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgICMgZ2V0IHBvaW50ICYgbGFiZWxcbiAgICBwb2ludCA9IGQzLnNlbGVjdCgnI2xpbmUtbGFiZWwtcG9pbnQtJytkYXRhW0BvcHRpb25zLmtleS5pZF0pXG4gICAgbGFiZWwgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICMgaGlkZSBwb2ludCAmIGxhYmVsIGlzIHRoZXJlIGlzIG5vIGRhdGFcbiAgICB1bmxlc3MgZGF0YS52YWx1ZXNbeWVhcl1cbiAgICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgcmV0dXJuXG4gICAgIyBzaG93IHBvaW50ICYgbGFiZWwgaWYgdGhlcmUncyBkYXRhXG4gICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICMgc2V0IGxpbmUgbGFiZWwgcG9pbnRcbiAgICBwb2ludFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAjIHNldCBsaW5lIGxhYmVsIGhvdmVyXG4gICAgbGFiZWxcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IHllYXJcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICAgLnRleHQgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHlGb3JtYXQoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgJydcbiAgICAgIFxuICBzZXRUaWNrSG92ZXJQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd5JywgTWF0aC5yb3VuZCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArOSIsImNsYXNzIHdpbmRvdy5IZWF0bWFwR3JhcGggZXh0ZW5kcyBCYXNlR3JhcGhcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgICAgICAgPSBudWxsXG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCAnIycrQGlkKycgLmhlYXRtYXAtZ3JhcGgnXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAY29udGFpbmVyLmNsYXNzZWQgJ2hhcy1sZWdlbmQnLCB0cnVlXG4gICAgQCR0b29sdGlwICA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgIyBHZXQgeWVhcnMgKHggc2NhbGUpXG4gICAgQHllYXJzID0gQGdldFllYXJzKGRhdGEpXG4gICAgIyBHZXQgY291bnRyaWVzICh5IHNjYWxlKVxuICAgIEBjb3VudHJpZXMgPSBkYXRhLm1hcCAoZCkgLT4gZC5jb2RlXG4gICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiAgICBAY2VsbHNEYXRhID0gQGdldENlbGxzRGF0YSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBnZXREaW1lbnNpb25zKCkgIyBmb3JjZSB1cGRhdGUgZGltZW5zaW9uc1xuICAgIEBkcmF3U2NhbGVzKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIG1pblllYXIgPSBkMy5taW4gZGF0YSwgKGQpIC0+IGQzLm1pbihkMy5rZXlzKGQudmFsdWVzKSlcbiAgICBtYXhZZWFyID0gZDMubWF4IGRhdGEsIChkKSAtPiBkMy5tYXgoZDMua2V5cyhkLnZhbHVlcykpXG4gICAgeWVhcnMgPSBkMy5yYW5nZSBtaW5ZZWFyLCBtYXhZZWFyLCAxXG4gICAgeWVhcnMucHVzaCArbWF4WWVhclxuICAgIHJldHVybiB5ZWFyc1xuXG4gIGdldENlbGxzRGF0YTogKGRhdGEpIC0+XG4gICAgY2VsbHNEYXRhID0gW11cbiAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiAgICAgICAgICBuYW1lOiAgICBkLm5hbWVcbiAgICAgICAgICB5ZWFyOiAgICB2YWx1ZVxuICAgICAgICAgIGNhc2VzOiAgIGQuY2FzZXNbdmFsdWVdXG4gICAgICAgICAgdmFsdWU6ICAgZC52YWx1ZXNbdmFsdWVdXG4gICAgcmV0dXJuIGNlbGxzRGF0YVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhclxuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICBnZXRTY2FsZVlSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEBoZWlnaHRdXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAeWVhcnMgXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBAY291bnRyaWVzXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCA0MDBdXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBAd2lkdGggPSBAJGVsLndpZHRoKCkgLSA3MCAgIyB5IGF4aXMgd2lkdGggPSAxMDBcbiAgICBpZiBAeWVhcnMgYW5kIEBjb3VudHJpZXNcbiAgICAgIGNlbGxTaXplID0gTWF0aC5mbG9vciBAd2lkdGggLyBAeWVhcnMubGVuZ3RoXG4gICAgICAjIHNldCBtaW5pbXVtIGNlbGwgZGltZW5zaW9uc1xuICAgICAgaWYgY2VsbFNpemUgPCAxNVxuICAgICAgICBjZWxsU2l6ZSA9IDE1XG4gICAgICAgIEB3aWR0aCA9IChjZWxsU2l6ZSAqIEB5ZWFycy5sZW5ndGgpICsgNzBcbiAgICAgIEBoZWlnaHQgPSBpZiBjZWxsU2l6ZSA8IDIwIHRoZW4gY2VsbFNpemUgKiBAY291bnRyaWVzLmxlbmd0aCBlbHNlIDIwICogQGNvdW50cmllcy5sZW5ndGhcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIHNldHVwIHNjYWxlcyByYW5nZVxuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGNvbnRhaW5lciBoZWlnaHRcbiAgICAjQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgIyBkcmF3IHllYXJzIHggYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ3gtYXhpcyBheGlzJ1xuICAgIC5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLmRhdGEoQHllYXJzLmZpbHRlcigoZCkgLT4gZCAlIDUgPT0gMCkpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgICAgLmh0bWwgIChkKSAtPiBkXG4gICAgIyBkcmF3IGNvdW50cmllcyB5IGF4aXNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd5LWF4aXMgYXhpcycpXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAY291bnRyaWVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXhpcy1pdGVtJ1xuICAgICAgLnN0eWxlICd0b3AnLCAoZCkgPT4gQHkoZCkrJ3B4J1xuICAgICAgLmh0bWwgKGQpID0+IEBnZXRDb3VudHJ5TmFtZSBkXG4gICAgIyBkcmF3IGNlbGxzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuZGF0YShAY2VsbHNEYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbCdcbiAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IoZC52YWx1ZSlcbiAgICAgIC5vbiAgICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAub24gICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAgIC5jYWxsICBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICAjIGRyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YSBAZGF0YS5tYXAoKGQpIC0+IHtjb2RlOiBkLmNvZGUsIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb259KS5maWx0ZXIoKGQpIC0+ICFpc05hTiBkLnllYXIpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHNjYWxlc1xuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBjb250YWluZXJzXG4gICAgQGNvbnRhaW5lclxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0ICsgJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKVxuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNlbGwnKVxuICAgICAgLmNhbGwgQHNldENlbGxEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LWF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnktYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0TWFya2VyRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0Q2VsbERpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBAeChkLnllYXIpKydweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpID0+IEB5KGQuY291bnRyeSkrJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEB5LmJhbmR3aWR0aCgpKydweCdcblxuICBzZXRNYXJrZXJEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gKEB5KGQuY29kZSktMSkrJ3B4J1xuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgPT4gaWYgZC55ZWFyIDwgQHllYXJzWzBdIHRoZW4gQHgoQHllYXJzWzBdKS0xICsgJ3B4JyBlbHNlIGlmIGQueWVhciA8IEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdIHRoZW4gQHgoZC55ZWFyKS0xKydweCcgZWxzZSBAeC5iYW5kd2lkdGgoKStAeChAeWVhcnNbQHllYXJzLmxlbmd0aC0xXSkrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCAoQHkuYmFuZHdpZHRoKCkrMSkrJ3B4J1xuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBvZmZzZXQgICAgICAgICAgID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY291bnRyeSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC55ZWFyJ1xuICAgICAgLmh0bWwgZC55ZWFyXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgaWYgZC52YWx1ZSA9PSAwIHRoZW4gMCBlbHNlIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgb2Zmc2V0LmxlZnQgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgb2Zmc2V0LnRvcCAtIChAeS5iYW5kd2lkdGgoKSAqIDAuNSkgLSBAJHRvb2x0aXAuaGVpZ2h0KClcbiAgICAgICdvcGFjaXR5JzogJzEnXG4gICAgcmV0dXJuXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuICAgIHJldHVyblxuXG4gIGdldENvdW50cnlOYW1lOiAoY29kZSkgPT5cbiAgICBjb3VudHJ5ID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIHJldHVybiBpZiBjb3VudHJ5WzBdIHRoZW4gY291bnRyeVswXS5uYW1lIGVsc2UgJydcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuZERhdGEgPSBbMCwxMDAsMjAwLDMwMCw0MDBdXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCd1bCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLnN0eWxlICdtYXJnaW4tbGVmdCcsIC0oMTUqbGVnZW5kRGF0YS5sZW5ndGgpKydweCdcbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICAgICAgLmh0bWwgKGQsaSkgLT4gaWYgaSAhPSAwIHRoZW4gZCBlbHNlICcmbmJzcCdcblxuICAgICMjI1xuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IChkKSAtPiBkXG4gICAgIyMjXG5cbiMgVmFjY2luZURpc2Vhc2VHcmFwaCA9IChfaWQpIC0+XG4jICAgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KClcbiMgICBZX0FYSVNfV0lEVEggPSAxMDBcbiMgICAjIE11c3QgYmUgdGhlIGFtZSB2YWx1ZSB0aGFuICN2YWNjaW5lLWRpc2Vhc2UtZ3JhcGggJHBhZGRpbmctbGVmdCBzY3NzIHZhcmlhYmxlXG4jICAgdGhhdCA9IHRoaXNcbiMgICBpZCA9IF9pZFxuIyAgIGRpc2Vhc2UgPSB1bmRlZmluZWRcbiMgICBzb3J0ID0gdW5kZWZpbmVkXG4jICAgbGFuZyA9IHVuZGVmaW5lZFxuIyAgIGRhdGEgPSB1bmRlZmluZWRcbiMgICBkYXRhUG9wdWxhdGlvbiA9IHVuZGVmaW5lZFxuIyAgIGN1cnJlbnREYXRhID0gdW5kZWZpbmVkXG4jICAgY2VsbERhdGEgPSB1bmRlZmluZWRcbiMgICBjb3VudHJpZXMgPSB1bmRlZmluZWRcbiMgICB5ZWFycyA9IHVuZGVmaW5lZFxuIyAgIGNlbGxTaXplID0gdW5kZWZpbmVkXG4jICAgY29udGFpbmVyID0gdW5kZWZpbmVkXG4jICAgeCA9IHVuZGVmaW5lZFxuIyAgIHkgPSB1bmRlZmluZWRcbiMgICB3aWR0aCA9IHVuZGVmaW5lZFxuIyAgIGhlaWdodCA9IHVuZGVmaW5lZFxuIyAgICRlbCA9IHVuZGVmaW5lZFxuIyAgICR0b29sdGlwID0gdW5kZWZpbmVkXG4jICAgIyBQdWJsaWMgTWV0aG9kc1xuXG4jICAgdGhhdC5pbml0ID0gKF9kaXNlYXNlLCBfc29ydCkgLT5cbiMgICAgIGRpc2Vhc2UgPSBfZGlzZWFzZVxuIyAgICAgc29ydCA9IF9zb3J0XG4jICAgICAjY29uc29sZS5sb2coJ1ZhY2NpbmUgR3JhcGggaW5pdCcsIGlkLCBkaXNlYXNlLCBzb3J0KTtcbiMgICAgICRlbCA9ICQoJyMnICsgaWQpXG4jICAgICAkdG9vbHRpcCA9ICRlbC5maW5kKCcudG9vbHRpcCcpXG4jICAgICBsYW5nID0gJGVsLmRhdGEoJ2xhbmcnKVxuIyAgICAgeCA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgeSA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwoZDMuaW50ZXJwb2xhdGVPclJkKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICBjbGVhcigpXG4jICAgICAgIHNldHVwRGF0YSgpXG4jICAgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgZWxzZVxuIyAgICAgICAjIExvYWQgQ1NWc1xuIyAgICAgICBkMy5xdWV1ZSgpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvZGF0YS9kaXNlYXNlcy1jYXNlcy5jc3YnKS5kZWZlcihkMy5jc3YsICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykgKyAnL2RhdGEvcG9wdWxhdGlvbi5jc3YnKS5hd2FpdCBvbkRhdGFSZWFkeVxuIyAgICAgdGhhdFxuXG4jICAgdGhhdC5vblJlc2l6ZSA9IC0+XG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgdXBkYXRlR3JhcGgoKVxuIyAgICAgdGhhdFxuXG4jICAgb25EYXRhUmVhZHkgPSAoZXJyb3IsIGRhdGFfY3N2LCBwb3B1bGF0aW9uX2NzdikgLT5cbiMgICAgIGRhdGEgPSBkYXRhX2NzdlxuIyAgICAgZGF0YVBvcHVsYXRpb24gPSBwb3B1bGF0aW9uX2NzdlxuIyAgICAgIyB3ZSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGF0dHJpYnV0ZVxuIyAgICAgZGVsZXRlIGRhdGEuY29sdW1uc1xuIyAgICAgIyBXZSBjYW4gZGVmaW5lIGEgZmlsdGVyIGZ1bmN0aW9uIHRvIHNob3cgb25seSBzb21lIHNlbGVjdGVkIGNvdW50cmllc1xuIyAgICAgaWYgdGhhdC5maWx0ZXJcbiMgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHRoYXQuZmlsdGVyKVxuIyAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPSBkLmRpc2Vhc2UudG9Mb3dlckNhc2UoKVxuIyAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgICAgZC55ZWFyX2ludHJvZHVjdGlvbiA9ICtkLnllYXJfaW50cm9kdWN0aW9uLnJlcGxhY2UoJ3ByaW9yIHRvJywgJycpXG4jICAgICAgIGQuY2FzZXMgPSB7fVxuIyAgICAgICBkLnZhbHVlcyA9IHt9XG4jICAgICAgICMgc2V0IHZhbHVlIGVzIGNhc2VzIC8xMDAwIGluaGFiaXRhbnRzXG4jICAgICAgIHBvcHVsYXRpb25JdGVtID0gcG9wdWxhdGlvbl9jc3YuZmlsdGVyKChjb3VudHJ5KSAtPlxuIyAgICAgICAgIGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiMgICAgICAgKVxuIyAgICAgICBpZiBwb3B1bGF0aW9uSXRlbS5sZW5ndGggPiAwXG4jICAgICAgICAgeWVhciA9IDE5ODBcbiMgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuIyAgICAgICAgICAgaWYgZFt5ZWFyXVxuIyAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4jICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gMTAwMCAqICgrZFt5ZWFyXSAvIHBvcHVsYXRpb24pO1xuIyAgICAgICAgICAgICAgIGQuY2FzZXNbeWVhcl0gPSArZFt5ZWFyXVxuIyAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuIyAgICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiMgICAgICAgICAgIGRlbGV0ZSBkW3llYXJdXG4jICAgICAgICAgICB5ZWFyKytcbiMgICAgICAgZWxzZVxuIyAgICAgICAgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lXG4jICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4jICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+XG4jICAgICAgICAgYSArIGJcbiMgICAgICAgKSwgMClcbiMgICAgICAgcmV0dXJuXG4jICAgICBzZXR1cERhdGEoKVxuIyAgICAgc2V0dXBHcmFwaCgpXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwRGF0YSA9IC0+XG4jICAgICAjIEZpbHRlciBkYXRhIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiMgICAgIGN1cnJlbnREYXRhID0gZGF0YS5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9PSBkaXNlYXNlIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiMgICAgIClcbiMgICAgICMgU29ydCBkYXRhXG4jICAgICBpZiBzb3J0ID09ICd5ZWFyJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGlmIGlzTmFOKGEueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gMSBlbHNlIGlmIGlzTmFOKGIueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gLTEgZWxzZSBiLnllYXJfaW50cm9kdWN0aW9uIC0gKGEueWVhcl9pbnRyb2R1Y3Rpb24pXG4jICAgICBlbHNlIGlmIHNvcnQgPT0gJ2Nhc2VzJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGIudG90YWwgLSAoYS50b3RhbClcbiMgICAgICMgR2V0IGFycmF5IG9mIGNvdW50cnkgbmFtZXNcbiMgICAgIGNvdW50cmllcyA9IGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAgZC5jb2RlXG4jICAgICApXG4jICAgICAjIEdldCBhcnJheSBvZiB5ZWFyc1xuIyAgICAgbWluWWVhciA9IGQzLm1pbihjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1pbiBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgbWF4WWVhciA9IGQzLm1heChjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1heCBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgeWVhcnMgPSBkMy5yYW5nZShtaW5ZZWFyLCBtYXhZZWFyLCAxKVxuIyAgICAgeWVhcnMucHVzaCArbWF4WWVhclxuIyAgICAgI2NvbnNvbGUubG9nKG1pblllYXIsIG1heFllYXIsIHllYXJzKTtcbiMgICAgICNjb25zb2xlLmxvZyhjb3VudHJpZXMpO1xuIyAgICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiMgICAgIGNlbGxzRGF0YSA9IFtdXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiMgICAgICAgICBjZWxsc0RhdGEucHVzaFxuIyAgICAgICAgICAgY291bnRyeTogZC5jb2RlXG4jICAgICAgICAgICBuYW1lOiBkLm5hbWVcbiMgICAgICAgICAgIHllYXI6IHZhbHVlXG4jICAgICAgICAgICBjYXNlczogZC5jYXNlc1t2YWx1ZV1cbiMgICAgICAgICAgIHZhbHVlOiBkLnZhbHVlc1t2YWx1ZV1cbiMgICAgICAgcmV0dXJuXG5cbiMgICAgICMjI1xuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaChmdW5jdGlvbihkKXtcbiMgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuIyAgICAgICB5ZWFycy5mb3JFYWNoKGZ1bmN0aW9uKHllYXIpe1xuIyAgICAgICAgIGlmIChkW3llYXJdKVxuIyAgICAgICAgICAgY291bnRlcisrO1xuIyAgICAgICB9KTtcbiMgICAgICAgaWYoY291bnRlciA8PSAyMCkgLy8geWVhcnMubGVuZ3RoLzIpXG4jICAgICAgICAgY29uc29sZS5sb2coZC5uYW1lICsgJyBoYXMgb25seSB2YWx1ZXMgZm9yICcgKyBjb3VudGVyICsgJyB5ZWFycycpO1xuIyAgICAgfSk7XG4jICAgICAjIyNcblxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cEdyYXBoID0gLT5cbiMgICAgICMgR2V0IGRpbWVuc2lvbnMgKGhlaWdodCBpcyBiYXNlZCBvbiBjb3VudHJpZXMgbGVuZ3RoKVxuIyAgICAgZ2V0RGltZW5zaW9ucygpXG4jICAgICB4LmRvbWFpbih5ZWFycykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIHdpZHRoXG4jICAgICBdXG4jICAgICB5LmRvbWFpbihjb3VudHJpZXMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICBoZWlnaHRcbiMgICAgIF1cbiMgICAgICNjb2xvci5kb21haW4oW2QzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSksIDBdKTtcbiMgICAgIGNvbG9yLmRvbWFpbiBbXG4jICAgICAgIDBcbiMgICAgICAgNFxuIyAgICAgXVxuIyAgICAgI2NvbnNvbGUubG9nKCdNYXhpbXVtIGNhc2VzIHZhbHVlOiAnKyBkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pKTtcbiMgICAgICMgQWRkIHN2Z1xuIyAgICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJyArIGlkICsgJyAuZ3JhcGgtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpXG4jICAgICAjIERyYXcgY2VsbHNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpLnNlbGVjdEFsbCgnLmNlbGwnKS5kYXRhKGNlbGxzRGF0YSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwnKS5zdHlsZSgnYmFja2dyb3VuZCcsIChkKSAtPlxuIyAgICAgICBjb2xvciBkLnZhbHVlXG4jICAgICApLmNhbGwoc2V0Q2VsbERpbWVuc2lvbnMpLm9uKCdtb3VzZW92ZXInLCBvbk1vdXNlT3Zlcikub24gJ21vdXNlb3V0Jywgb25Nb3VzZU91dFxuIyAgICAgIyBEcmF3IHllYXJzIHggYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneC1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKHllYXJzLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZCAlIDUgPT0gMFxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCdsZWZ0JywgKGQpIC0+XG4jICAgICAgIHgoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGRcbiMgICAgICMgRHJhdyBjb3VudHJpZXMgeSBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd5LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoY291bnRyaWVzKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ3RvcCcsIChkKSAtPlxuIyAgICAgICB5KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBnZXRDb3VudHJ5TmFtZSBkXG4jICAgICAjIERyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJykuZGF0YShjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIHtcbiMgICAgICAgICBjb2RlOiBkLmNvZGVcbiMgICAgICAgICB5ZWFyOiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgIH1cbiMgICAgICkuZmlsdGVyKChkKSAtPlxuIyAgICAgICAhaXNOYU4oZC55ZWFyKVxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ21hcmtlcicpLmNhbGwgc2V0TWFya2VyRGltZW5zaW9uc1xuIyAgICAgcmV0dXJuXG5cbiMgICBjbGVhciA9IC0+XG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5yZW1vdmUoKVxuIyAgICAgY29udGFpbmVyLnNlbGVjdEFsbCgnLmF4aXMnKS5yZW1vdmUoKVxuIyAgICAgcmV0dXJuXG5cblxuXG4iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDdcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDdcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTJcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS54XSA9ICtkW0BvcHRpb25zLmtleS54XVxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50KDAuMjUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoKVxuICAgICAgICAucmFuZ2UgQGdldENvbG9yUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQoMC41KVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSldXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGdldENvbG9yUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFsnI0M5QUQ0QicsICcjQkJENjQ2JywgJyM2M0JBMkQnLCAnIzM0QTg5MycsICcjM0Q5MUFEJywgJyM1QjhBQ0InLCAnI0JBN0RBRicsICcjQkY2QjgwJywgJyNGNDlEOUQnLCAnI0UyNTQ1MycsICcjQjU2NjMxJywgJyNFMjc3M0InLCAnI0ZGQTk1MScsICcjRjRDQTAwJ11cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gZDMuZXh0ZW50IEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuY29sb3JdXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgc2V0IGNvbG9yIGRvbWFpblxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHNpemUgZG9tYWluXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IHBvaW50c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCBAZ2V0RG90SWRcbiAgICAgIC5hdHRyICdyJywgQGdldERvdFNpemVcbiAgICAgIC5zdHlsZSAnZmlsbCcsIEBnZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCBAZ2V0RG90TGFiZWxJZFxuICAgICAgLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgIC5hdHRyICdkeScsICcwLjM3NWVtJ1xuICAgICAgLnRleHQgQGdldERvdExhYmVsVGV4dFxuICAgICAgLmNhbGwgQHNldERvdExhYmVsc0RpbWVuc2lvbnNcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgICMgY2FsbCBCYXNlZ3JhcGgudXBkYXRlR3JhcGhEaW1lbnNpb25zXG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGRvdHMgcG9zaXRpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldERvdExhYmVsc0RpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIGdldERvdElkOiAoZCkgPT5cbiAgICByZXR1cm4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGdldERvdExhYmVsSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90TGFiZWxUZXh0OiAoZCkgPT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90U2l6ZTogKGQpID0+XG4gICAgaWYgQHNpemVcbiAgICAgIHJldHVybiBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAb3B0aW9ucy5kb3RTaXplXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgaWYgQGNvbG9yXG4gICAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsXG5cbiAgc2V0RG90c0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgc2V0RG90TGFiZWxzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBvdmVycmlkIHggYXhpcyBwb3NpdGlvbmluZ1xuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG5cbiAgb25SZXNpemU6ID0+XG4gICAgaWYgQCRlbCBhbmQgQGNvbnRhaW5lcldpZHRoICE9IEAkZWwud2lkdGgoKVxuICAgICAgc3VwZXIoKVxuICAgIHJldHVybiBAXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gMTVcbiAgICAgIG9wYWNpdHk6IDFcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS14J1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkueF1cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUteSdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LnldXG5cbiAgICAiLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3REaXNjcmV0ZUdyYXBoIGV4dGVuZHMgd2luZG93LlNjYXR0ZXJwbG90R3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBEaXNjcmV0ZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXNcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICBAeSA9IGQzLnNjYWxlUG9pbnQoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHkgc2NhbGUgZG9tYWluXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgZ2V0IGRpbWVuc2lvbnNcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHN2Zy5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZSByYW5nZVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBzdXBlcigpXG4gICAgIyBkcmF3IGRvdCBsaW5lc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxpbmUnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QtbGluZSdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RMaW5lSWRcbiAgICAgIC5zdHlsZSAnc3Ryb2tlJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RMaW5lc0RpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgdmFjY2luZXMgPSBkMy5uZXN0KClcbiAgICAgIC5rZXkgKGQpIC0+IGQudmFjY2luZVxuICAgICAgLmVudHJpZXMgQGRhdGFcbiAgICB2YWNjaW5lcy5zb3J0IChhLGIpIC0+IGlmIGEua2V5ID4gYi5rZXkgdGhlbiAxIGVsc2UgLTFcbiAgICBkMy5zZWxlY3QoJyMnK0BpZCsnIC5ncmFwaC1sZWdlbmQgdWwnKS5zZWxlY3RBbGwoJ2xpJylcbiAgICAgIC5kYXRhKHZhY2NpbmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdsZWdlbmQtaXRlbS0nK2Qua2V5XG4gICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgLT4gZC52YWx1ZXNbMF0udmFjY2luZV9jb2xvciAjQGNvbG9yIGQua2V5XG4gICAgICAuaHRtbCAoZCkgLT4gZC52YWx1ZXNbMF0udmFjY2luZV9uYW1lXG4gICAgICAub24gJ21vdXNlb3ZlcicsIChkKSA9PiBAaGlnaGxpZ2h0VmFjY2luZXMgZC5rZXlcbiAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBpZiBAeVxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gQHkuZG9tYWluKCkubGVuZ3RoICogMzBcbiAgICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBsaW5lcyBzaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuY2FsbCBAc2V0RG90TGluZXNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG5cbiAgZ2V0RG90SWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdKyctJytkW0BvcHRpb25zLmtleS5jb2xvcl1cbiAgXG4gIGdldERvdExhYmVsSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdKyctJytkW0BvcHRpb25zLmtleS5jb2xvcl1cblxuICBnZXREb3RMaW5lSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxpbmUtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbFRleHQ6IChkKSAtPiBcbiAgICByZXR1cm4gJydcblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMaW5lc0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiAwXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvbiAoYWRkIGxlZ2VuZCBoZWlnaHQpXG4gICAgb2Zmc2V0VG9wID0gaWYgQG9wdGlvbnMubGVnZW5kIHRoZW4gJCgnIycrQGlkKycgLmdyYXBoLWxlZ2VuZCcpLmhlaWdodCgpIGVsc2UgMFxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBvZmZzZXRUb3AgKyBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gMTVcbiAgICAgIG9wYWNpdHk6IDFcbiAgICAjIGhpZ2h0bGlnaHQgc2VsZWN0ZWQgdmFjY2luZVxuICAgIEBoaWdobGlnaHRWYWNjaW5lcyBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXRhKClbMF1bQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHN1cGVyKGQpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxpbmUnKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBkMy5zZWxlY3RBbGwoJyMnK0BpZCsnIC5ncmFwaC1sZWdlbmQgbGknKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcblxuICBoaWdobGlnaHRWYWNjaW5lczogKHZhY2NpbmUpIC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5maWx0ZXIgKGQpID0+IHJldHVybiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gdmFjY2luZVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuZmlsdGVyIChkKSA9PiByZXR1cm4gZFtAb3B0aW9ucy5rZXkuY29sb3JdID09IHZhY2NpbmVcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgIyBzZXQgc2VsZWN0ZWQgZG90cyBvbiB0b3BcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuc29ydCAoYSxiKSA9PiBpZiBhW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gdmFjY2luZSB0aGVuIDEgZWxzZSAtMVxuICAgICMgc2V0IGxlZ2VuZFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgZDMuc2VsZWN0QWxsKCcjJytAaWQrJyAuZ3JhcGgtbGVnZW5kIGxpJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgdHJ1ZVxuICAgICAgZDMuc2VsZWN0QWxsKCcjJytAaWQrJyAjbGVnZW5kLWl0ZW0tJyt2YWNjaW5lKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSAtPlxuICAgIGRvc2VzRm9ybWF0ID0gZDMuZm9ybWF0KCcuMHMnKVxuICAgIHByaWNlc0Zvcm1hdCA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhY2NpbmUnXG4gICAgICAuaHRtbCBkLnZhY2NpbmVfbmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5wcmljZSdcbiAgICAgIC5odG1sIHByaWNlc0Zvcm1hdChkLnByaWNlKVxuICAgIGNvbXBhbnkgPSAnJ1xuICAgIGlmIGQuY29tcGFueVxuICAgICAgY29tcGFueSA9IGQuY29tcGFueVxuICAgICAgaWYgZC5jb21wYW55MlxuICAgICAgICBjb21wYW55ICs9ICcsICcrZC5jb21wYW55MlxuICAgICAgaWYgZC5jb21wYW55M1xuICAgICAgICBjb21wYW55ICs9ICcsICcrZC5jb21wYW55M1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb21wYW55J1xuICAgICAgLmh0bWwgY29tcGFueVxuICAgICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdFZQSEdyYXBoIGV4dGVuZHMgd2luZG93LlNjYXR0ZXJwbG90R3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIGxhbmcsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgb3B0aW9ucy5kb3RTaXplID0gN1xuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IDNcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSAxOFxuICAgIEBsYW5nID0gbGFuZ1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjEyNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCgpXG4gICAgICAgIC5yYW5nZSBAZ2V0Q29sb3JSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIFsxMDI0LCA0MDM0LCAxMjQ3NF1cbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFsxNSwgMzAsIDQ1LCA2MCwgNzUsIDkwXVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCAxMDIwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgOTBdXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIGlmIGRbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSAnMScgdGhlbiAnIzAwNzk3ZCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gJzAnIHRoZW4gJyNENjRCMDUnIGVsc2UgJyNhYWEnICAgICAgIFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgcG9pbnRzXG4gICAgc3VwZXIoKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuICAgIEBzZXRYTGVnZW5kKClcbiAgICByZXR1cm4gQFxuXG4gIHNldFhMZWdlbmQ6IC0+XG4gICAgaW5jb21lR3JvdXBzID0gW0B4LmRvbWFpbigpWzBdLCAxMDI2LCA0MDM2LCAxMjQ3NiwgQHguZG9tYWluKClbMV1dXG4gICAgQCRlbC5maW5kKCcueC1sZWdlbmQgbGknKS5lYWNoIChpLCBlbCkgPT5cbiAgICAgIHZhbCA9IDEwMCAqIChAeChpbmNvbWVHcm91cHNbaSsxXSkgLSBAeChpbmNvbWVHcm91cHNbaV0pKSAvIEB3aWR0aFxuICAgICAgJChlbCkud2lkdGggdmFsKyclJ1xuXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgYW5ub3RhdGlvbnMgPSBbXG4gICAgICB7XG4gICAgICAgICdjeCc6IDAuMjMqQGhlaWdodFxuICAgICAgICAnY3knOiAwLjE3KkBoZWlnaHRcbiAgICAgICAgJ3InOiAwLjIyKkBoZWlnaHRcbiAgICAgICAgJ3RleHRXaWR0aCc6IDAuMzgqQHdpZHRoXG4gICAgICAgICd0ZXh0T2Zmc2V0JzogWzAuMjUqQGhlaWdodCwgMF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdjeCc6IDAuMjgqQGhlaWdodFxuICAgICAgICAnY3knOiAwLjQ2KkBoZWlnaHRcbiAgICAgICAgJ3InOiAwLjA3MipAaGVpZ2h0XG4gICAgICAgICd0ZXh0V2lkdGgnOiAwLjM2KkB3aWR0aFxuICAgICAgICAndGV4dE9mZnNldCc6IFswLjE4KkBoZWlnaHQsIDBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnY3gnOiBAd2lkdGggLSAwLjM1KkBoZWlnaHRcbiAgICAgICAgJ2N5JzogQGhlaWdodCAtIDAuMTIqQGhlaWdodFxuICAgICAgICAncic6IDAuMTUqQGhlaWdodFxuICAgICAgICAndGV4dFdpZHRoJzogMC4zOCpAd2lkdGhcbiAgICAgICAgJ3RleHRPZmZzZXQnOiBbMCwgLTAuMipAaGVpZ2h0XVxuICAgICAgfVxuICAgIF1cbiAgICAjIGdldCBhbm5vdGF0aW9ucyB0ZXh0cyBmcm9tIGh0bWxcbiAgICAkKCcjdmFjY2luZS12cGgtY29udGFpbmVyLWdyYXBoIC5tb2JpbGUtcGljdHVyZXMgcCcpLmVhY2ggKGksIGVsKSAtPlxuICAgICAgYW5ub3RhdGlvbnNbaV0udGV4dCA9ICQoZWwpLmh0bWwoKVxuICAgIEBjb250YWluZXIuY2FsbCBAcmluZ05vdGUsIGFubm90YXRpb25zXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIGZvcm1hdEZsb2F0ID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudmFjY2luZSBzcGFuJ1xuICAgICAgLmNzcyAnZGlzcGxheScsICdub25lJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy52YWNjaW5lLScrZFtAb3B0aW9ucy5rZXkuY29sb3JdXG4gICAgICAuY3NzICdkaXNwbGF5JywgJ2lubGluZSdcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS5pZF1cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUteSdcbiAgICAgIC5odG1sIGZvcm1hdEZsb2F0KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICIsIiMgTWFpbiBzY3JpcHQgZm9yIHZhY2NpbmVzIHByaWNlcyBhcnRpY2xlXG5jbGFzcyB3aW5kb3cuVmFjY2luZXNQcmljZXNcblxuICB2YWNjaW5lc19uYW1lczpcbiAgICBlczpcbiAgICAgICdCQ0cnOiAnVHViZXJjdWxvc2lzIChCQ0cpJ1xuICAgICAgJ0RUYVAnOiAnRGlmdGVyaWEsIHTDqXRhbm9zIHkgdG9zIGZlcmluYSBhY2VsdWxhciAoRFRhUCknXG4gICAgICAnRFRQJzogJ0RpZnRlcmlhLCB0w6l0YW5vcyB5IHRvcyBmZXJpbmEgKERUUCknXG4gICAgICAnRFRQYS1JUFYtSGliJzogJ1BlbnRhdmFsZW50ZSAoRFRQLCBwb2xpbyBlIEhpYiknXG4gICAgICAnSGVwQi1wZWRpw6F0cmljYSc6ICdIZXBhdGl0aXMgQiBwZWRpw6F0cmljYSdcbiAgICAgICdJUFYnOiAnUG9saW8gKElQViknXG4gICAgICAnTU1SJzogJ1NhcmFtcGnDs24sIHBhcGVyYXMgeSBydWJlb2xhJ1xuICAgICAgJ3BuZXVtbzEzJzogJ05ldW1vY29jbyAoMTMpJ1xuICAgICAgJ1RkYXAnOiAnVMOpdGFub3MsIGRpZnRlcmlhIHkgdG9zIGZlcmluYSBhY2VsdWxhciByZWR1Y2lkYSAoVGRhcCknXG4gICAgICAnVlBIJzogJ1ZpcnVzIGRlbCBwYXBpbG9tYSBodW1hbm8gKFZQSCknXG4gICAgICAnVlBILUNlcnZhcml4Mic6ICdWUEggQ2VydmFyaXgyJ1xuICAgICAgJ1ZQSC1HYXJkYXNpbDQnOiAnVlBIIEdhcmRhc2lsNCdcbiAgICAgICdWUEgtR2FyZGFzaWw5JzogJ1ZQSCBHYXJkYXNpbDknXG4gICAgZW46XG4gICAgICAnQkNHJzogJ1R1YmVyY3Vsb3NpcyAoQkNHKSdcbiAgICAgICdEVGFQJzogJ0RpcGh0ZXJpYSwgdGV0YW51cyBhbmQgYWNlbGx1bGFyIHBlcnR1c3NpcyAoRFRhUCknXG4gICAgICAnRFRQJzogJ0RpcGh0ZXJpYSwgdGV0YW51cyBhbmQgcGVydHVzc2lzIChEVFApJ1xuICAgICAgJ0RUUGEtSVBWLUhpYic6ICdQZW50YXZhbGVudCAoRFRQLCBwb2xpbyBhbmQgSGliKSdcbiAgICAgICdIZXBCLXBlZGnDoXRyaWNhJzogJ0hlcGF0aXRpcyBCIHBlZGlhdHJpYydcbiAgICAgICdJUFYnOiAnUG9saW8gKElQViknXG4gICAgICAnTU1SJzogJ01lYXNsZXMsIG11bXBzIGFuZCBydWJlbGxhJ1xuICAgICAgJ3BuZXVtbzEzJzogJ1BuZXVtb2NvY2N1cyAoMTMpJ1xuICAgICAgJ1RkYXAnOiAnVGV0YW51cywgcmVkdWNlZCBkaXBodGhlcmlhIGFuZCByZWR1Y2VkIGFjZWxsdWxhciBwZXJ0dXNzaXMgKFRkYXApJ1xuICAgICAgJ1ZQSCc6ICdIdW1hbiBwYXBpbG9tYXZpcnVzIChIUFYpJ1xuICAgICAgJ1ZQSC1DZXJ2YXJpeDInOiAnVlBIIENlcnZhcml4MidcbiAgICAgICdWUEgtR2FyZGFzaWw0JzogJ1ZQSCBHYXJkYXNpbDQnXG4gICAgICAnVlBILUdhcmRhc2lsOSc6ICdWUEggR2FyZGFzaWw5J1xuXG4gIHZhY2NpbmVzX2NvbG9yczpcbiAgICAnQkNHJzogJyNDOUFENEInXG4gICAgJ0RUYVAnOiAnIzYzQkEyRCdcbiAgICAnRFRQJzogJyMzNEE4OTMnXG4gICAgJ0RUUGEtSVBWLUhpYic6ICcjQkJENjQ2J1xuICAgICdIZXBCLXBlZGnDoXRyaWNhJzogJyMzRDkxQUQnXG4gICAgJ0lQVic6ICcjNUI4QUNCJ1xuICAgICdNTVInOiAnI0UyNzczQidcbiAgICAncG5ldW1vMTMnOiAnI0JBN0RBRidcbiAgICAnVGRhcCc6ICcjRjQ5RDlEJ1xuICAgICdWUEgtQ2VydmFyaXgyJzogJyNGRkE5NTEnXG4gICAgJ1ZQSC1HYXJkYXNpbDQnOiAnI0I1NjYzMSdcbiAgICAnVlBILUdhcmRhc2lsOSc6ICcjRTI1NDUzJ1xuXG4gIGNvbnN0cnVjdG9yOiAoX2xhbmcsIF9iYXNldXJsLCBfZGF0YXVybCkgLT5cbiAgICBAbGFuZyA9IF9sYW5nXG4gICAgIyBsb2FkIGRhdGFcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBfYmFzZXVybCtfZGF0YXVybFxuICAgICAgLmRlZmVyIGQzLmNzdiwgX2Jhc2V1cmwrJy9kYXRhL2dkcC5jc3YnXG4gICAgICAjLmRlZmVyIGQzLmpzb24sICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgICAuYXdhaXQgQG9uRGF0YUxvYWRlZFxuXG4gIG9uRGF0YUxvYWRlZDogKGVycm9yLCBfZGF0YSwgX2NvdW50cmllcykgPT5cbiAgICBAZGF0YSA9IF9kYXRhXG4gICAgQGNvdW50cmllcyA9IF9jb3VudHJpZXNcbiAgICBAcGFyc2VEYXRhKClcbiAgICAjIGFsbCB2YWNjaW5lcyBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtYWxsLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLWFsbC1ncmFwaCcsIEBkYXRhLCB0cnVlXG4gICAgIyBvcmdhbml6YXRpb25zIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy1vcmdhbml6YXRpb25zLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgZGF0YU9yZ2FuaXphdGlvbnMgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQuY291bnRyeSA9PSAnTVNGJyB8fCBkLmNvdW50cnkgPT0gJ1BBSE8nIHx8IGQuY291bnRyeSA9PSAnVU5JQ0VGJ1xuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLW9yZ2FuaXphdGlvbnMtZ3JhcGgnLCBkYXRhT3JnYW5pemF0aW9ucywgdHJ1ZVxuICAgICMgVGRhcCBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtdGRhcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIGRhdGFUZGFwID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLnZhY2NpbmUgPT0gJ1RkYXAnXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtdGRhcC1ncmFwaCcsIGRhdGFUZGFwLCBmYWxzZVxuICAgICMgSVBWIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy1pcHYtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBkYXRhSVBWID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLnZhY2NpbmUgPT0gJ0lQVicgYW5kIGQuY291bnRyeSAhPSAnTVNGJyBhbmQgZC5jb3VudHJ5ICE9ICdQQUhPJyBhbmQgZC5jb3VudHJ5ICE9ICdVTklDRUYnXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtaXB2LWdyYXBoJywgZGF0YUlQViwgZmFsc2VcbiAgICAjIFZQSCBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtdnBoLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLXZwaC1ncmFwaCcsIEBkYXRhLCB0cnVlXG4gICAgIyBQSUIgY291bnRyaWVzXG4gICAgaWYgJCgnI3BpYi1jb3VudHJpZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBwaWJEYXRhID0gZDMubmVzdCgpXG4gICAgICAgIC5rZXkgKGQpIC0+IGQuY291bnRyeVxuICAgICAgICAuZW50cmllcyBAZGF0YVxuICAgICAgcGliRGF0YSA9IHBpYkRhdGEubWFwIChkKSAtPlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBkLmtleVxuICAgICAgICAgIG5hbWU6IGQudmFsdWVzWzBdLm5hbWVcbiAgICAgICAgICBnZHA6IGQudmFsdWVzWzBdLmdkcCowLjkzN1xuICAgICAgICB9XG4gICAgICBwaWJEYXRhID0gcGliRGF0YVxuICAgICAgICAuZmlsdGVyIChkKSAtPiBkLmdkcCA+IDBcbiAgICAgICAgLnNvcnQgKGEsYikgLT4gYi5nZHAgLSBhLmdkcFxuICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKCdwaWItY291bnRyaWVzLWdyYXBoJyxcbiAgICAgICAgbGFiZWw6XG4gICAgICAgICAgZm9ybWF0OiAoZCkgLT5cbiAgICAgICAgICAgIGYgPSBkMy5mb3JtYXQoJyxkJylcbiAgICAgICAgICAgIHJldHVybiBmKGQpKyfigqwnXG4gICAgICAgIG1hcmdpbjpcbiAgICAgICAgICByaWdodDogMTBcbiAgICAgICAgICBsZWZ0OiAxMFxuICAgICAgICBrZXk6XG4gICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgeTogJ2dkcCdcbiAgICAgICAgICBpZDogJ2lkJylcbiAgICAgIGdyYXBoLnNldERhdGEgcGliRGF0YVxuICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICB2YWNjaW5lcyA9IFsncG5ldW1vMTMnLCdCQ0cnLCdJUFYnLCdNTVInLCdIZXBCLXBlZGnDoXRyaWNhJywnVlBILUNlcnZhcml4MicsJ1ZQSC1HYXJkYXNpbDQnLCdWUEgtR2FyZGFzaWw5JywnRFRQYS1JUFYtSGliJywnRFRhUCcsJ1RkYXAnLCdEVFAnXVxuICAgICMgZmlsdGVyIGRhdGEgdG8gZ2V0IG9ubHkgc2VsZWN0ZWQgdmFjY2luZXNcbiAgICBAZGF0YSA9IEBkYXRhLmZpbHRlciAoZCkgLT4gdmFjY2luZXMuaW5kZXhPZihkLnZhY2NpbmUpICE9IC0xXG4gICAgIyBqb2luIGRhdGEgJiBjb3VudHJpZXMgZ2RwXG4gICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgIGNvdW50cnkgPSBAY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY291bnRyeVxuICAgICAgZC5wcmljZSA9ICtkLnByaWNlXG4gICAgICBkLnZhY2NpbmVfbmFtZSA9IGlmIEB2YWNjaW5lc19uYW1lc1tAbGFuZ11bZC52YWNjaW5lXSB0aGVuIEB2YWNjaW5lc19uYW1lc1tAbGFuZ11bZC52YWNjaW5lXSBlbHNlIGQudmFjY2luZVxuICAgICAgZC52YWNjaW5lX2NvbG9yID0gQHZhY2NpbmVzX2NvbG9yc1tkLnZhY2NpbmVdXG4gICAgICBpZiBjb3VudHJ5WzBdXG4gICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytAbGFuZ11cbiAgICAgICAgZC5nZHAgPSBjb3VudHJ5WzBdLnZhbHVlXG4gICAgICBlbHNlXG4gICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytAbGFuZ11cbiAgICAgICAgZC5nZHAgPSAwXG4gICAgIyBzb3J0IGRhdGEgYnkgZ2RwXG4gICAgQGRhdGEuc29ydCAoYSxiKSAtPiBhLmdkcCAtIGIuZ2RwXG5cbiAgc2V0dXBTY2F0dGVycGxvdDogKF9pZCwgX2RhdGEsIF9sZWdlbmQpIC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LlNjYXR0ZXJwbG90RGlzY3JldGVHcmFwaChfaWQsXG4gICAgICBsZWdlbmQ6IF9sZWdlbmRcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiA1XG4gICAgICAgIHJpZ2h0OiA1XG4gICAgICAgIGxlZnQ6IDYwXG4gICAgICAgIGJvdHRvbTogMjBcbiAgICAgIGtleTpcbiAgICAgICAgeDogJ3ByaWNlJ1xuICAgICAgICB5OiAnbmFtZSdcbiAgICAgICAgaWQ6ICdjb3VudHJ5J1xuICAgICAgICBjb2xvcjogJ3ZhY2NpbmUnKVxuICAgIGdyYXBoLnlBeGlzLnRpY2tQYWRkaW5nIDEyXG4gICAgZ3JhcGgueEF4aXNcbiAgICAgIC50aWNrcyA1XG4gICAgICAudGlja1BhZGRpbmcgMTBcbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyfigqwnXG4gICAgIyBvdmVyZHJpdmUgY29sb3IgZmlsbCBtZXRob2RcbiAgICBncmFwaC5nZXREb3RGaWxsID0gKGQpIC0+IGQudmFjY2luZV9jb2xvclxuICAgICMgc2V0IGRhdGFcbiAgICBncmFwaC5zZXREYXRhIF9kYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuIiwiIyBNYWluIHNjcmlwdCBmb3IgdmFjY2luZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjIGxpc3Qgb2YgZXhjbHVkZWQgY291bnRyaWVzIGNvZGVzIChjb3VudHJpZXMgd2l0aCBsZXNzIHRoYW4gMzAwLjAwMCBpbmhhYml0YW50cyBpbiAyMDE1KVxuICBleGNsdWRlZENvdW50cmllcyA9IFsnTklVJywnQ09LJywnVFVWJywnTlJVJywnUExXJywnVkdCJywnTUFGJywnU01SJywnR0lCJywnVENBJywnTElFJywnTUNPJywnU1hNJywnRlJPJywnTUhMJywnTU5QJywnQVNNJywnS05BJywnR1JMJywnQ1knLCdCTVUnLCdBTkQnLCdETUEnLCdJTU4nLCdBVEcnLCdTWUMnLCdWSVInLCdBQlcnLCdGU00nLCdUT04nLCdHUkQnLCdWQ1QnLCdLSVInLCdDVVcnLCdDSEknLCdHVU0nLCdMQ0EnLCdTVFAnLCdXU00nLCdWVVQnLCdOQ0wnLCdQWUYnLCdCUkInXVxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgZm9ybWF0RmxvYXQgPSBkMy5mb3JtYXQoJywuMWYnKVxuICBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG5cbiAgIyBJbml0IFRvb2x0aXBzXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcblxuXG4gICMgZ2V0IGNvdW50cnkgbmFtZSBhdXhpbGlhciBtZXRob2RcbiAgZ2V0Q291bnRyeU5hbWUgPSAoY291bnRyaWVzLCBjb2RlLCBsYW5nKSAtPlxuICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIGlmIGl0ZW1cbiAgICAgIGlmIGxhbmcgPT0gJ2VzJ1xuICAgICAgICBpdGVtWzBdWyduYW1lX2VzJ11cbiAgICAgIGVsc2VcbiAgICAgICAgaXRlbVswXVsnbmFtZV9lbiddXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5lcnJvciAnTm8gY291bnRyeSBuYW1lIGZvciBjb2RlJywgY29kZVxuXG4gICMgVmlkZW8gb2YgbWFwIHBvbGlvIGNhc2VzXG4gIHNldFZpZGVvTWFwUG9saW8gPSAtPlxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1wb2xpby1jYXNlcy10b3RhbC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBjYXNlcyA9IHt9XG4gICAgICBjYXNlc1N0ciA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdjYXNvcycgZWxzZSAnY2FzZXMnXG4gICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgIGNhc2VzW2QueWVhcl0gPSBkLnZhbHVlXG4gICAgICAjIEFkZCB5b3V0dWJlIHZpZGVvXG4gICAgICB3cmFwcGVyID0gUG9wY29ybi5IVE1MWW91VHViZVZpZGVvRWxlbWVudCgnI3ZpZGVvLW1hcC1wb2xpbycpXG4gICAgICB3cmFwcGVyLnNyYyA9ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9vLUV6Vk9qbmM2UT9jb250cm9scz0wJnNob3dpbmZvPTAmaGQ9MSdcbiAgICAgIHBvcGNvcm4gPSBQb3Bjb3JuKHdyYXBwZXIpXG4gICAgICBub3RlcyA9IDIwMTcgLSAxOTgwXG4gICAgICB5ZWFyRHVyYXRpb24gPSAyNy8obm90ZXMrMSkgIyB2aWRlbyBkdXJhdGlvbiBpcyAyN3NlY29uZHNcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgbm90ZXNcbiAgICAgICAgeWVhciA9ICcnKygxOTgwK2kpXG4gICAgICAgIHBvcGNvcm4uZm9vdG5vdGVcbiAgICAgICAgICBzdGFydDogIHllYXJEdXJhdGlvbiAqIGlcbiAgICAgICAgICBlbmQ6ICAgIGlmIGkgPCBub3Rlcy0xIHRoZW4geWVhckR1cmF0aW9uKihpKzEpIGVsc2UgKHllYXJEdXJhdGlvbiooaSsxKSkrMVxuICAgICAgICAgIHRleHQ6ICAgeWVhciArICc8YnI+PHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPicgKyBmb3JtYXRJbnRlZ2VyKGNhc2VzW3llYXJdKSArICcgJyArIGNhc2VzU3RyICsgJzwvc3Bhbj4nXG4gICAgICAgICAgdGFyZ2V0OiAndmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJ1xuICAgICAgICBpKytcbiAgICAgICMgU2hvdyBjb3ZlciB3aGVuIHZpZGVvIGVuZGVkXG4gICAgICB3cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIgJ2VuZGVkJywgKGUpIC0+XG4gICAgICAgICQoJy52aWRlby1tYXAtcG9saW8tY292ZXInKS5zaG93KClcbiAgICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbiwgI3ZpZGVvLW1hcC1wb2xpbyBpZnJhbWUnKS5mYWRlVG8gMCwgMFxuICAgICAgICBwb3Bjb3JuLmN1cnJlbnRUaW1lIDBcbiAgICAgICMgU2hvdyB2aWRlbyB3aGVuIHBsYXkgYnRuIGNsaWNrZWRcbiAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tcGxheS1idG4nKS5jbGljayAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHBvcGNvcm4ucGxheSgpXG4gICAgICAgICQoJy52aWRlby1tYXAtcG9saW8tY292ZXInKS5mYWRlT3V0KClcbiAgICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbiwgI3ZpZGVvLW1hcC1wb2xpbyBpZnJhbWUnKS5mYWRlVG8gMzAwLCAxXG5cblxuICAjIE1lYXNsZXMgV29ybGQgTWFwIEdyYXBoXG4gIHNldHVwTWVhc2xlc1dvcmxkTWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9tZWFzbGVzLWNhc2VzLXdoby1yZWdpb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtd2hvLXJlZ2lvbnMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgY291bnRyaWVzLmZvckVhY2ggKGNvdW50cnkpIC0+XG4gICAgICAgICAgcmVnaW9uID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQucmVnaW9uID09IGNvdW50cnkucmVnaW9uXG4gICAgICAgICAgaWYgcmVnaW9uLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGNvdW50cnkudmFsdWUgPSByZWdpb25bMF0uY2FzZXMqMTAwMDAwXG4gICAgICAgICAgICBjb3VudHJ5LmNhc2VzID0gcmVnaW9uWzBdLmNhc2VzX3RvdGFsXG4gICAgICAgICAgICBjb3VudHJ5Lm5hbWUgPSByZWdpb25bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTWFwR3JhcGgoJ21lYXNsZXMtd29ybGQtbWFwLWdyYXBoJyxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5zZXREYXRhIGNvdW50cmllcywgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIE1lYXNsZXMgY2FzZXMgSGVhdG1hcCBHcmFwaFxuICBzZXR1cEhlYXRNYXBHcmFwaCA9IChpZCwgZGF0YSwgY291bnRyaWVzLCBsZWdlbmQpIC0+XG4gICAgZGF0YSA9IGRhdGFcbiAgICAgIC5maWx0ZXIgKGQpIC0+IGNvdW50cmllcy5pbmRleE9mKGQuY29kZSkgIT0gLTEgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuICAgICAgLnNvcnQgKGEsYikgLT4gYS50b3RhbCAtIGIudG90YWxcbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuSGVhdG1hcEdyYXBoKGlkLFxuICAgICAgbGVnZW5kOiBsZWdlbmRcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgbGVmdDogMClcbiAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgc2V0dXBWYWNjaW5lQ29uZmlkZW5jZUJhckdyYXBoID0gLT5cbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvY29uZmlkZW5jZS5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICAgICB1bmxlc3MgbG9jYXRpb25cbiAgICAgICAgICBsb2NhdGlvbiA9IHt9XG4gICAgICAgICAgaWYgbGFuZyA9PSAnZGUnXG4gICAgICAgICAgICBsb2NhdGlvbi5jb2RlID0gJ0RFVSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2NhdGlvbi5jb2RlID0gJ0VTUCdcbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgIGQudmFsdWUgPSArZC52YWx1ZVxuICAgICAgICAgIGlmIGxhbmcgPT0gJ2RlJ1xuICAgICAgICAgICAgZC5uYW1lID0gZFsnbmFtZV9lbiddXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgZGVsZXRlIGQubmFtZV9lc1xuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZW5cbiAgICAgICAgICAjIHNldCB1c2VyIGNvdW50cnkgYWN0aXZlXG4gICAgICAgICAgaWYgbG9jYXRpb24gYW5kIGQuY29kZSA9PSBsb2NhdGlvbi5jb2RlXG4gICAgICAgICAgICBkLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKCd2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjNcbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGZvcm1hdDogKGQpIC0+ICBmb3JtYXRGbG9hdChkKSsnJSdcbiAgICAgICAgICBtYXJnaW46IHRvcDogMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIHg6ICduYW1lJ1xuICAgICAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICAgICAgaWQ6ICdjb2RlJylcbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVCY2dDYXNlc01hcCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3R1YmVyY3Vsb3Npcy1jYXNlcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgIyBhZGQgY2FzZXMgdG8gZWFjaCBjb3VudHJ5XG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGQudmFsdWUgPSArZC5jYXNlc19wb3B1bGF0aW9uXG4gICAgICAgICAgZC5jYXNlcyA9ICtkLmNhc2VzXG4gICAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTWFwR3JhcGgoJ3ZhY2NpbmUtYmNnLWNhc2VzLWdyYXBoJyxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5nZXRMZWdlbmREYXRhID0gLT4gWzAsMjAwLDQwMCw2MDAsODAwXVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEsIG1hcFxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVCY2dTdG9ja291dHNNYXAgPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9iY2ctc3RvY2tvdXRzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICB5ZWFycyA9IGQzLnJhbmdlIDIwMDYsIDIwMTYgICAjIHNldCB5ZWFycyBhcnJheVxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gICAgICAgICAgZC55ZWFycyA9ICcnXG4gICAgICAgICAgIyBnZXQgbGlzdCBvZiB5ZWFycyB3aXRoIHN0b2Nrb3V0c1xuICAgICAgICAgIHllYXJzLmZvckVhY2ggKHllYXIpIC0+XG4gICAgICAgICAgICBpZiBkW3llYXJdID09ICcyJyB8fCBkW3llYXJdID09ICczJyAgIyBjaGVjayB2YWx1ZXMgMiBvciAzIChuYXRpb25hbCBzdG9ja291dHMgY29kZSlcbiAgICAgICAgICAgICAgZC55ZWFycyArPSB5ZWFyKycsJ1xuICAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICAgICAgICBpZiBpdGVtXG4gICAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgndmFjY2luZS1iY2ctc3RvY2tvdXRzJyxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5mb3JtYXRGbG9hdCA9IGdyYXBoLmZvcm1hdEludGVnZXJcbiAgICAgICAgZ3JhcGguZ2V0TGVnZW5kRGF0YSA9IC0+IFswLDIsNCw2LDhdXG4gICAgICAgIGdyYXBoLnNldFRvb2x0aXBEYXRhID0gKGQpIC0+XG4gICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAgICAgICAuaHRtbCBkLm5hbWVcbiAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbiwgLnllYXJzLWNlbGxzJ1xuICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgIGlmIGQudmFsdWUgPT0gMFxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi16ZXJvJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgZWxzZSBpZiBkLnZhbHVlID09IDFcbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tb25lIC52YWx1ZSdcbiAgICAgICAgICAgICAgLmh0bWwgZC55ZWFycy5zcGxpdCgnLCcpWzBdXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLW9uZSdcbiAgICAgICAgICAgICAgLnNob3coKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tbXVsdGlwbGUgLnZhbHVlJ1xuICAgICAgICAgICAgICAuaHRtbCBncmFwaC5mb3JtYXRJbnRlZ2VyKGQudmFsdWUpXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLnllYXJzLWNlbGxzIGxpJ1xuICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICAgICAgICBkLnllYXJzLnNwbGl0KCcsJykuZm9yRWFjaCAoeWVhcikgLT5cbiAgICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgICAuZmluZCAnLnllYXJzLWNlbGxzIGxpW2RhdGEteWVhcj1cIicreWVhcisnXCJdJ1xuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcyAnYWN0aXZlJywgdHJ1ZVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi1tdWx0aXBsZSwgLnllYXJzLWNlbGxzJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YSwgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy1tZWFzbGVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL3BvcHVsYXRpb24uY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV9jYXNlcywgZGF0YV9wb3B1bGF0aW9uKSAtPlxuICAgICAgICBkZWxldGUgZGF0YV9jYXNlcy5jb2x1bW5zICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4gICAgICAgIGRhdGFfY2FzZXMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4gICAgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiAgICAgICAgICBkLmNhc2VzID0ge31cbiAgICAgICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICAgICAgZC5uYW1lID0gZ2V0Q291bnRyeU5hbWUgZGF0YV9wb3B1bGF0aW9uLCBkLmNvZGUsIGxhbmdcbiAgICAgICAgICAjIHNldCB2YWx1ZXMgYXMgY2FzZXMvMTAwMCBpbmhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgICAgICB5ZWFyKytcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuICAgICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4gICAgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT4gYSArIGIpLCAwKVxuICAgICAgICAjIEZpbHRlciBieSBzZWxlY3RlZCBjb3VudHJpZXMgJiBkaXNlYXNlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTEnLCBkYXRhX2Nhc2VzLCBbJ0ZJTicsJ0hVTicsJ1BSVCcsJ1VSWScsJ01FWCcsJ0NPTCddLCB0cnVlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTInLCBkYXRhX2Nhc2VzLCBbJ0lSUScsJ0JHUicsJ01ORycsJ1pBRicsJ0ZSQScsJ0dFTyddLCBmYWxzZVxuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ2NvZGUnXG4gICAgICAgIHg6ICduYW1lJ1xuICAgICAgbGFiZWw6IHRydWVcbiAgICAgIG1hcmdpbjogdG9wOiAyMClcbiAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAoZCkgLT4gWzAsIDEwMF1cbiAgICBncmFwaC55QXhpcy50aWNrVmFsdWVzIFswLCAyNSwgNTAsIDc1LCAxMDBdXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL2ltbXVuaXphdGlvbi1jb3ZlcmFnZS5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAjIFVwZGF0ZSBkYXRhIGJhc2VkIG9uIHNlbGVjdGVkIHZhY2NpbmVcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLnZhbCgpKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgICAjIFVwZGF0ZSBhY3RpdmUgY291bnRyaWVzXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvciwgI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJykuZmluZCgnLmxpbmUtbGFiZWwsIC5saW5lJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS1sYWJlbC0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS1sYWJlbC0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIEltbXVuaXphdGlvbiBDb3ZlcmFnZSBNdWx0aXBsZSBTbWFsbCBHcmFwaCAod2lkdGggc2VsZWN0ZWQgY291bnRyaWVzKVxuICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlTXVsdGlwbGVTbWFsbEdyYXBoID0gLT5cbiAgICBjdXJyZW50X2NvdW50cmllcyA9IFsnTEtBJywnRFpBJywnREVVJywnRE5LJywnRlJBJ11cbiAgICBncmFwaHMgPSBbXVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1tY3YyLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgICAgICAgIyBTZXR1cCB1c2VyIGNvdW50cnlcbiAgICAgICAgICBpZiBsb2NhdGlvblxuICAgICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICAgIGlmIHVzZXJfY291bnRyeSBhbmQgdXNlcl9jb3VudHJ5Lmxlbmd0aCA+IDAgYW5kIHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICAgIGlmIGN1cnJlbnRfY291bnRyaWVzLmluZGV4T2YodXNlcl9jb3VudHJ5WzBdLmNvZGUpID09IC0xXG4gICAgICAgICAgICAgICAgY3VycmVudF9jb3VudHJpZXNbMl0gPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgICAgIGVsID0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCAuZ3JhcGgtY29udGFpbmVyJykuZXEoMilcbiAgICAgICAgICAgICAgICBlbC5maW5kKCdwJykuaHRtbCB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgICAgIGVsLmZpbmQoJy5saW5lLWdyYXBoJykuYXR0ciAnaWQnLCAnaW1tdW5pemF0aW9uLWNvdmVyYWdlLScrdXNlcl9jb3VudHJ5WzBdLmNvZGUudG9Mb3dlckNhc2UoKSsnLWdyYXBoJ1xuICAgICAgICAgICMgbG9vcCB0aHJvdWdoIGVhY2ggc2VsZWN0ZWQgY291bnRyeVxuICAgICAgICAgIGN1cnJlbnRfY291bnRyaWVzLmZvckVhY2ggKGNvdW50cnksaSkgLT5cbiAgICAgICAgICAgICMgZ2V0IGN1cnJlbnQgZGlzZWFzZSBkYXRhXG4gICAgICAgICAgICBjb3VudHJ5X2RhdGEgPSBkYXRhXG4gICAgICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5XG4gICAgICAgICAgICAgIC5tYXAgICAgKGQpIC0+ICQuZXh0ZW5kKHt9LCBkKVxuICAgICAgICAgICAgY291bnRyeV9kYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgICAgIGRlbGV0ZSBkWycyMDAxJ11cbiAgICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDInXVxuICAgICAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdpbW11bml6YXRpb24tY292ZXJhZ2UtJytjb3VudHJ5LnRvTG93ZXJDYXNlKCkrJy1ncmFwaCcsXG4gICAgICAgICAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgICAgICAgICBrZXk6XG4gICAgICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICAgICAgaWQ6ICdjb2RlJylcbiAgICAgICAgICAgIGdyYXBocy5wdXNoIGdyYXBoXG4gICAgICAgICAgICBncmFwaC55Rm9ybWF0ID0gKGQpIC0+IGQrJyUnXG4gICAgICAgICAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAoZCkgLT4gWzAsIDEwMF1cbiAgICAgICAgICAgIGdyYXBoLnlBeGlzLnRpY2tWYWx1ZXMgWzUwXVxuICAgICAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMywyMDE1XVxuICAgICAgICAgICAgZ3JhcGguYWRkTWFya2VyXG4gICAgICAgICAgICAgIHZhbHVlOiA5NVxuICAgICAgICAgICAgICBsYWJlbDogaWYgaSUyICE9IDAgdGhlbiAnJyBlbHNlIGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlIGlmIGxhbmcgPT0gJ2RlJyB0aGVuICdIZXJkZW5pbW11bml0w6R0JyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgICAgICBhbGlnbjogJ2xlZnQnXG4gICAgICAgICAgICAjIHNob3cgbGFzdCB5ZWFyIGxhYmVsXG4gICAgICAgICAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgICAgICAgICAgZ3JhcGguc2V0TGFiZWwgMjAxNVxuICAgICAgICAgICAgICBncmFwaC5jb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAgICAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAgICAgICAgICBncmFwaC5jb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgICAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICAgICAgICBncmFwaC5zZXREYXRhIGNvdW50cnlfZGF0YVxuICAgICAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICAgICAgZ3JhcGguJGVsLm9uICdtb3VzZW91dCcsIChlKSAtPlxuICAgICAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgICAgZy5oaWRlTGFiZWwoKVxuICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBXb3JsZCBDYXNlcyBNdWx0aXBsZSBTbWFsbFxuICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGggPSAtPlxuICAgIGRpc2Vhc2VzID0gWydkaXBodGVyaWEnLCAnbWVhc2xlcycsJ3BlcnR1c3NpcycsJ3BvbGlvJywndGV0YW51cyddXG4gICAgZ3JhcGhzID0gW11cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgeDogJ2Rpc2Vhc2UnXG4gICAgICAgICAgICBpZDogJ2Rpc2Vhc2UnKVxuICAgICAgICBncmFwaHMucHVzaCBncmFwaFxuICAgICAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsxOTgwLCAyMDE1XVxuICAgICAgICBncmFwaC55QXhpcy50aWNrcygyKS50aWNrRm9ybWF0IGQzLmZvcm1hdCgnLjBzJylcbiAgICAgICAgZ3JhcGgueUZvcm1hdCA9IGQzLmZvcm1hdCgnLjJzJylcbiAgICAgICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gLT4gcmV0dXJuIFswLCBpZiBkaXNlYXNlID09ICdtZWFzbGVzJyBvciBkaXNlYXNlID09ICdwZXJ0dXNzaXMnIHRoZW4gbWF4VmFsdWUxIGVsc2UgbWF4VmFsdWUyXVxuICAgICAgICBncmFwaC5zZXREYXRhIGRpc2Vhc2VfZGF0YVxuICAgICAgICAjIGxpc3RlbiB0byB5ZWFyIGNoYW5nZXMgJiB1cGRhdGUgZWFjaCBncmFwaCBsYWJlbFxuICAgICAgICBncmFwaC4kZWwub24gJ2NoYW5nZS15ZWFyJywgKGUsIHllYXIpIC0+XG4gICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICBnLnNldExhYmVsIHllYXJcbiAgICAgICAgZ3JhcGguJGVsLm9uICdtb3VzZW91dCcsIChlKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5oaWRlTGFiZWwoKVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGggPSAtPlxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgICAgICAgIyBTZXR1cCB1c2VyIGNvdW50cnlcbiAgICAgICAgICBpZiBsb2NhdGlvblxuICAgICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgbG9jYXRpb24ubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG9jYXRpb24gPSB7fVxuICAgICAgICAgICAgaWYgbGFuZyA9PSAnZGUnXG4gICAgICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSAnREVVJ1xuICAgICAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gJ0dlcm1hbnknXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSAnRVNQJ1xuICAgICAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuICAgICAgICAgICMgRmlsdGVyIGRhdGFcbiAgICAgICAgICBoZXJkSW1tdW5pdHkgPVxuICAgICAgICAgICAgJ01DVjEnOiA5NVxuICAgICAgICAgICAgJ1BvbDMnOiA4MFxuICAgICAgICAgICAgJ0RUUDMnOiA4MFxuICAgICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZXhjbHVkZWRDb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpID09IC0xXG4gICAgICAgICAgIyBEYXRhIHBhcnNlICYgc29ydGluZyBmdW50aW9uc1xuICAgICAgICAgIGRhdGFfcGFyc2VyID0gKGQpIC0+XG4gICAgICAgICAgICBvYmogPVxuICAgICAgICAgICAgICBrZXk6ICAgZC5jb2RlXG4gICAgICAgICAgICAgIG5hbWU6ICBnZXRDb3VudHJ5TmFtZShjb3VudHJpZXMsIGQuY29kZSwgbGFuZylcbiAgICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE1J11cbiAgICAgICAgICAgIGlmIGxvY2F0aW9uIGFuZCBkLmNvZGUgPT0gbG9jYXRpb24uY29kZVxuICAgICAgICAgICAgICBvYmouYWN0aXZlID0gdHJ1ZVxuICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgIGRhdGFfc29ydCA9IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAgICMgbG9vcCB0aHJvdWdoIGVhY2ggZ3JhcGhcbiAgICAgICAgICAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5lYWNoIC0+XG4gICAgICAgICAgICAkZWwgICAgID0gJCh0aGlzKVxuICAgICAgICAgICAgZGlzZWFzZSA9ICRlbC5kYXRhKCdkaXNlYXNlJylcbiAgICAgICAgICAgIHZhY2NpbmUgPSAkZWwuZGF0YSgndmFjY2luZScpXG4gICAgICAgICAgICAjIEdldCBncmFwaCBkYXRhICYgdmFsdWVcbiAgICAgICAgICAgIGdyYXBoX2RhdGEgPSBkYXRhXG4gICAgICAgICAgICAgIC5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSB2YWNjaW5lIGFuZCBkWycyMDE1J10gIT0gJycpXG4gICAgICAgICAgICAgIC5tYXAoZGF0YV9wYXJzZXIpXG4gICAgICAgICAgICAgIC5zb3J0KGRhdGFfc29ydClcbiAgICAgICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgICAgIGdyYXBoX3ZhbHVlID0gZ3JhcGhfZGF0YS5maWx0ZXIgKGQpIC0+IGQua2V5ID09IGxvY2F0aW9uLmNvZGVcbiAgICAgICAgICAgICMgU2V0dXAgZ3JhcGhcbiAgICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaChkaXNlYXNlKyctaW1tdW5pemF0aW9uLWJhci1ncmFwaCcsXG4gICAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjI1XG4gICAgICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgICAgIGZvcm1hdDogKGQpIC0+ICtkKyclJ1xuICAgICAgICAgICAgICBrZXk6IHg6ICduYW1lJ1xuICAgICAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICAgICAgdG9wOiAyMClcbiAgICAgICAgICAgIG1hcmtlciA9XG4gICAgICAgICAgICAgIHZhbHVlOiBoZXJkSW1tdW5pdHlbdmFjY2luZV1cbiAgICAgICAgICAgICAgbGFiZWw6IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlIGlmIGxhbmcgPT0gJ2RlJyB0aGVuICdIZXJkZW5pbW11bml0w6R0JyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgICAgaWYgdmFjY2luZSA9PSAnRFRQMydcbiAgICAgICAgICAgICAgbWFya2VyLmxhYmVsID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ1JlY29tZW5kYWNpw7NuIE9NUycgZWxzZSAnV0hPIHJlY29tbWVuZGF0aW9uJ1xuICAgICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgICAgLmFkZE1hcmtlciBtYXJrZXJcbiAgICAgICAgICAgICAgLnNldERhdGEgZ3JhcGhfZGF0YVxuICAgICAgICAgICAgIyBTZXR1cCBncmFwaCB2YWx1ZVxuICAgICAgICAgICAgaWYgZ3JhcGhfdmFsdWUgYW5kIGdyYXBoX3ZhbHVlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tY291bnRyeScpLmh0bWwgbG9jYXRpb24ubmFtZVxuICAgICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kYXRhJykuaHRtbCAnPHN0cm9uZz4nICsgZ3JhcGhfdmFsdWVbMF0udmFsdWUgKyAnJTwvc3Ryb25nPidcbiAgICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tZGVzY3JpcHRpb24nKS5zaG93KClcbiAgICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplIC0+IGdyYXBoLm9uUmVzaXplKClcblxuXG4gIHNldHVwVmFjY2luZVZQSEdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL3ZwaC5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9nZHAuY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzKSAtPlxuICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGV4Y2x1ZGVkQ291bnRyaWVzLmluZGV4T2YoZC5jb3VudHJ5KSA9PSAtMVxuICAgICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvdW50cnlcbiAgICAgICAgICBpZiBjb3VudHJ5WzBdXG4gICAgICAgICAgICBkLm5hbWUgPSBjb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIGQuZ2RwID0gK2NvdW50cnlbMF0udmFsdWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAjY29uc29sZS5lcnJvciAnTm8gY291bnRyeSBuYW1lIGZvciBjb2RlJywgZC5jb3VudHJ5XG4gICAgICAgICAgZC52YWx1ZSA9ICtkLmRlYXRoc1xuICAgICAgICAjIHNraXAgZGF0YSBsaW5lcyB3aXRob3V0IGdkcCBkYXRhXG4gICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5nZHBcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LlNjYXR0ZXJwbG90VlBIR3JhcGgoJ3ZhY2NpbmUtdnBoLWdyYXBoJywgbGFuZyxcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICBsZWZ0OiAyMFxuICAgICAgICAgICAgdG9wOiAzMFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgeDogJ2dkcCdcbiAgICAgICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgICAgIGNvbG9yOiAndmFjY2luZScpXG4gICAgICAgICMgc2V0IGRhdGFcbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIyNcbiAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicsXG4gICAgICAjaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6IDBcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgYm90dG9tOiAyMClcbiAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsyMDAwLCAyMDA1LCAyMDEwLCAyMDE1XVxuICAgIGdyYXBoLnlBeGlzXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJyUnXG4gICAgZ3JhcGgubG9hZERhdGEgYmFzZXVybCsnL2RhdGEvZ3VhdGVtYWxhLWNvdmVyYWdlLW1tci5jc3YnXG4gICAgZ3JhcGguJGVsLm9uICdkcmF3LWNvbXBsZXRlJywgKGUpIC0+XG4gICAgICBsaW5lID0gZ3JhcGguY29udGFpbmVyLnNlbGVjdCgnLmxpbmUnKVxuICAgICAgY29uc29sZS5sb2cgbGluZS5ub2RlKClcbiAgICAgIGxlbmd0aCA9IGxpbmUubm9kZSgpLmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgICBsaW5lXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgbGVuZ3RoICsgJyAnICsgbGVuZ3RoKVxuICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCBsZW5ndGgpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZGVsYXkoNTAwMClcbiAgICAgICAgICAuZHVyYXRpb24oNTAwMClcbiAgICAgICAgICAuZWFzZShkMy5lYXNlU2luSW5PdXQpXG4gICAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0JywgMClcblxuICBpZiAkKCcjZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEd1YXRlbWFsYUNvdmVyYWdlTGluZUdyYXBoKClcbiAgIyMjXG5cbiAgaWYgJCgnI3ZpZGVvLW1hcC1wb2xpbycpLmxlbmd0aCA+IDBcbiAgICBzZXRWaWRlb01hcFBvbGlvKClcblxuICAjIyNcbiAgIyMgVmFjY2luZSBtYXBcbiAgaWYgJCgnI3ZhY2NpbmUtbWFwJykubGVuZ3RoID4gMFxuICAgIHZhY2NpbmVfbWFwID0gbmV3IFZhY2NpbmVNYXAgJ3ZhY2NpbmUtbWFwJ1xuICAgICN2YWNjaW5lX21hcC5nZXREYXRhID0gdHJ1ZSAgIyAgU2V0IHRydWUgdG8gZG93bmxvYWQgYSBwb2xpbyBjYXNlcyBjc3ZcbiAgICB2YWNjaW5lX21hcC5nZXRQaWN0dXJlU2VxdWVuY2UgPSB0cnVlICAgIyBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIG1hcCBwaWN0dXJlIHNlcXVlbmNlXG4gICAgdmFjY2luZV9tYXAuaW5pdCBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1wb2xpby1jYXNlcy5jc3YnLCBiYXNldXJsKycvZGF0YS9tYXAtcG9saW8tY2FzZXMuY3N2J1xuICAgICQod2luZG93KS5yZXNpemUgdmFjY2luZV9tYXAub25SZXNpemVcbiAgIyMjXG5cbiAgaWYgJCgnLnZhY2NpbmVzLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lRGlzZWFzZUhlYXRtYXBHcmFwaCgpXG5cbiAgIyMjXG4gICMgVmFjY2luZSBhbGwgZGlzZWFzZXMgZ3JhcGhcbiAgaWYgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcyA9IG5ldyBWYWNjaW5lRGlzZWFzZUdyYXBoKCd2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKVxuICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgLmFjdGl2ZSBhJykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMub25SZXNpemVcbiAgICAjIFVwZGF0ZSBncmFwaCBiYXNlZCBvbiBzZWxlY3RlZCBkaXNlYXNlXG4gICAgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgYScpLmNsaWNrIChlKSAtPlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAkKHRoaXMpLnRhYiAnc2hvdydcbiAgICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCh0aGlzKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLnZhbCgpXG4gICAgICByZXR1cm5cbiAgICAjIFVwZGF0ZSBncmFwaCBiYXNlb24gb24gb3JkZXIgc2VsZWN0b3JcbiAgICAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLmNoYW5nZSAoZCkgLT5cbiAgICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLmluaXQgJCgnI2Rpc2Vhc2Utc2VsZWN0b3IgLmFjdGl2ZSBhJykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCh0aGlzKS52YWwoKVxuICAjIyNcblxuICBpZiAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlRHluYW1pY0xpbmVHcmFwaCgpXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlTXVsdGlwbGVTbWFsbEdyYXBoKClcblxuICBpZiAkKCcjd29ybGQtY2FzZXMnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBXb3JsZENhc2VzTXVsdGlwbGVTbWFsbEdyYXBoKClcblxuICBpZiAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGgoKVxuXG4gIGlmICQoJyNtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cE1lYXNsZXNXb3JsZE1hcEdyYXBoKClcblxuICBpZiAkKCcjdmFjY2luZS1jb25maWRlbmNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCgpXG5cbiAgaWYgJCgnI3ZhY2NpbmUtYmNnLWNhc2VzLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUJjZ0Nhc2VzTWFwKClcblxuICBpZiAkKCcjdmFjY2luZS1iY2ctc3RvY2tvdXRzJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUJjZ1N0b2Nrb3V0c01hcCgpXG5cbiAgaWYgJCgnI3ZhY2NpbmUtdnBoLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZVZQSEdyYXBoKClcblxuICAjIFNldHVwIHZhY2NpbmVzIHByaWNlc1xuICBpZiAkKCdib2R5JykuaGFzQ2xhc3MoJ3ByaWNlcycpIHx8ICAkKCdib2R5JykuaGFzQ2xhc3MoJ3ByZWNpb3MnKVxuICAgIG5ldyBWYWNjaW5lc1ByaWNlcyBsYW5nLCBiYXNldXJsLCAnL2RhdGEvcHJpY2VzLXZhY2NpbmVzLmNzdidcblxuICAjIFNldHVwIHZhY2NpbmUgdnBoIHByaWNlc1xuICBpZiAkKCcjdmFjY2luZS1wcmljZXMtdnBoLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIG5ldyBWYWNjaW5lc1ByaWNlcyBsYW5nLCBiYXNldXJsLCAnL2RhdGEvcHJpY2VzLXZhY2NpbmVzLXZwaC5jc3YnXG5cbikgalF1ZXJ5XG4iXX0=
