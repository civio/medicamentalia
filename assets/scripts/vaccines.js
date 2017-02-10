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
      if (this.$tooltip) {
        this.container.selectAll('.country').on('mouseover', this.onMouseOver).on('mousemove', this.onMouseMove).on('mouseout', this.onMouseOut);
      }
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

    MapGraph.prototype.getLegendData = function() {
      return d3.range(0, this.color.domain()[1]);
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
    var baseurl, excludedCountries, formatFloat, formatInteger, getCountryName, lang, setVideoMapPolio, setupHeatMapGraph, setupImmunizationCoverageDynamicLineGraph, setupImmunizationCoverageMultipleSmallGraph, setupImmunizationDiseaseBarGraph, setupMeaslesWorldMapGraph, setupVaccineBcgCasesMap, setupVaccineBcgStockoutsMap, setupVaccineConfidenceBarGraph, setupVaccineDiseaseHeatmapGraph, setupWorldCasesMultipleSmallGraph;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    excludedCountries = ['NIU', 'COK', 'TUV', 'NRU', 'PLW', 'VGB', 'MAF', 'SMR', 'GIB', 'TCA', 'LIE', 'MCO', 'SXM', 'FRO', 'MHL', 'MNP', 'ASM', 'KNA', 'GRL', 'CY', 'BMU', 'AND', 'DMA', 'IMN', 'ATG', 'SYC', 'VIR', 'ABW', 'FSM', 'TON', 'GRD', 'VCT', 'KIR', 'CUW', 'CHI', 'GUM', 'LCA', 'STP', 'WSM', 'VUT', 'NCL', 'PYF', 'BRB'];
    if (lang === 'es') {
      d3.formatDefaultLocale({
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
        return item[0]['name_' + lang];
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
        wrapper.src = 'http://www.youtube.com/embed/o-EzVOjnc6Q?controls=0&showinfo=0&hd=1';
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
      return d3.queue().defer(d3.csv, baseurl + '/data/confidence.csv').defer(d3.json, 'http://freegeoip.net/json/').await(function(error, data, location) {
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
        var graph;
        data.forEach(function(d) {
          var item;
          item = countries.filter(function(country) {
            return country.code === d.code;
          });
          d.value = +d.value;
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
          graph.$tooltip.find('.description').hide();
          if (d.value === 0) {
            return graph.$tooltip.find('.description-zero').show();
          } else if (d.value === 1) {
            return graph.$tooltip.find('.description-one').show();
          } else {
            graph.$tooltip.find('.description-multiple .value').html(graph.formatInteger(d.value));
            return graph.$tooltip.find('.description-multiple').show();
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
      return d3.queue().defer(d3.csv, baseurl + '/data/immunization-coverage-mcv2.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, 'http://freegeoip.net/json/').await(function(error, data, countries, location) {
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
            label: i % 2 !== 0 ? '' : lang === 'es' ? 'Nivel de rebaño' : 'Herd immunity',
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
      return d3.queue().defer(d3.csv, baseurl + '/data/immunization-coverage.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, 'http://freegeoip.net/json/').await(function(error, data, countries, location) {
        var data_parser, data_sort, herdImmunity, user_country;
        if (location) {
          user_country = countries.filter(function(d) {
            return d.code2 === location.country_code;
          });
          location.code = user_country[0].code;
          location.name = user_country[0]['name_' + lang];
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
      return setupVaccineBcgStockoutsMap();
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwibWFpbi12YWNjaW5lcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMs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QUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxNQUEvQixHQUF3QyxDQUEzQztNQUNFLDhCQUFBLENBQUEsRUFERjs7SUFHQSxJQUFHLENBQUEsQ0FBRSwwQkFBRixDQUE2QixDQUFDLE1BQTlCLEdBQXVDLENBQTFDO01BQ0UsdUJBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLHdCQUFGLENBQTJCLENBQUMsTUFBNUIsR0FBcUMsQ0FBeEM7YUFDRSwyQkFBQSxDQUFBLEVBREY7O0VBM2dCRCxDQUFELENBQUEsQ0E4Z0JFLE1BOWdCRjtBQUFBIiwiZmlsZSI6InZhY2NpbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgQHN2Z1xuICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LkJhckdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2JhciBhY3RpdmUnIGVsc2UgJ2JhcidcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLm9uICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC15IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJy0wLjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGlmIEBvcHRpb25zLmxhYmVsLmZvcm1hdCB0aGVuIEBvcHRpb25zLmxhYmVsLmZvcm1hdChkW0BvcHRpb25zLmtleS55XSkgZWxzZSBkW0BvcHRpb25zLmtleS55XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAgICAgIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSlcbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgKGQpID0+IEBoZWlnaHQgLSBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckxhYmVsWERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAaGVpZ2h0XG5cbiAgc2V0QmFyTGFiZWxZRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICB1bmxlc3MgZC5hY3RpdmVcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgIiwiY2xhc3Mgd2luZG93LkxpbmVHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIHlGb3JtYXQ6IGQzLmZvcm1hdCgnZCcpICAgIyBzZXQgbGFiZWxzIGhvdmVyIGZvcm1hdFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0xpbmUgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQHllYXJzID0gQGdldFllYXJzIGRhdGFcbiAgICBzdXBlcihkYXRhKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIHllYXJzID0gW11cbiAgICBkMy5rZXlzKGRhdGFbMF0pLmZvckVhY2ggKGQpIC0+XG4gICAgICBpZiArZFxuICAgICAgICB5ZWFycy5wdXNoICtkXG4gICAgcmV0dXJuIHllYXJzLnNvcnQoKVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZFtAb3B0aW9ucy5rZXkueF0sICdlbiAnLCB5ZWFyKTtcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcnKVxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICMgc2V0dXAgbGluZVxuICAgIEBsaW5lID0gZDMubGluZSgpXG4gICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAueCAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgLnkgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgIyBzZXR1cCBhcmVhXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYSA9IGQzLmFyZWEoKVxuICAgICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAgIC54ICAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgICAueTAgQGhlaWdodFxuICAgICAgICAueTEgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFtAeWVhcnNbMF0sIEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXVxuXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gWzAsIGQzLm1heCBAZGF0YSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZC52YWx1ZXMpKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBjbGVhciBncmFwaCBiZWZvcmUgc2V0dXBcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmdyYXBoJykucmVtb3ZlKClcbiAgICAjIGRyYXcgZ3JhcGggY29udGFpbmVyIFxuICAgIEBncmFwaCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdncmFwaCdcbiAgICAjIGRyYXcgbGluZXNcbiAgICBAZHJhd0xpbmVzKClcbiAgICAjIGRyYXcgYXJlYXNcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBkcmF3QXJlYXMoKVxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGRyYXdMYWJlbHMoKVxuICAgICMgZHJhdyBtb3VzZSBldmVudHMgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBkcmF3TGluZUxhYmVsSG92ZXIoKVxuICAgICAgIyBlbHNlXG4gICAgICAjICAgQGRyYXdUb29sdGlwKClcbiAgICAgIEBkcmF3UmVjdE92ZXJsYXkoKVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBhcmVhIHkwXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYS55MCBAaGVpZ2h0XG4gICAgIyB1cGRhdGUgeSBheGlzIHRpY2tzIHdpZHRoXG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcub3ZlcmxheScpXG4gICAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGluZXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLScgKyBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5kYXR1bSAoZCkgLT4gcmV0dXJuIGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBsaW5lXG5cbiAgZHJhd0FyZWFzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2FyZWEnXG4gICAgICAuYXR0ciAgJ2lkJywgICAgKGQpID0+ICdhcmVhLScgKyBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5kYXR1bSAoZCkgLT4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGFyZWFcblxuICBkcmF3TGFiZWxzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbCdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ2VuZCdcbiAgICAgIC5hdHRyICdkeScsICctMC4xMjVlbSdcbiAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuXG4gIGRyYXdMaW5lTGFiZWxIb3ZlcjogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtcG9pbnQnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLXBvaW50LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbC1wb2ludCdcbiAgICAgIC5hdHRyICdyJywgNFxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ3RpY2staG92ZXInXG4gICAgICAuYXR0ciAnZHknLCAnMC43MWVtJyAgICAgIFxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICAuY2FsbCBAc2V0VGlja0hvdmVyUG9zaXRpb25cbiAgICBpZiBAZGF0YS5sZW5ndGggPT0gMVxuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbC1ob3ZlcidcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJy0wLjVlbSdcbiAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgZHJhd1JlY3RPdmVybGF5OiAtPlxuICAgIEBjb250YWluZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdvdmVybGF5J1xuICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlTW92ZVxuICAgICAgLm9uICdtb3VzZW91dCcsICBAb25Nb3VzZU91dFxuICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcblxuICBzZXRMYWJlbERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgQHdpZHRoXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkLnZhbHVlc1tAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV0pXG5cbiAgc2V0T3ZlcmxheURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd3aWR0aCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBoZWlnaHRcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJGVsLnRyaWdnZXIgJ21vdXNlb3V0J1xuICAgIEBoaWRlTGFiZWwoKVxuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICB5ZWFyID0gTWF0aC5yb3VuZCBAeC5pbnZlcnQocG9zaXRpb25bMF0pXG4gICAgaWYgeWVhciAhPSBAY3VycmVudFllYXJcbiAgICAgIEAkZWwudHJpZ2dlciAnY2hhbmdlLXllYXInLCB5ZWFyXG4gICAgICBAc2V0TGFiZWwgeWVhclxuXG4gIHNldExhYmVsOiAoeWVhcikgLT5cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5lYWNoIChkKSA9PiBAc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbiBkXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIC5hdHRyICd4JywgTWF0aC5yb3VuZCBAeChAY3VycmVudFllYXIpXG4gICAgICAudGV4dCBAY3VycmVudFllYXJcblxuICBoaWRlTGFiZWw6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb246IChkYXRhKSA9PlxuICAgICMgZ2V0IGN1cnJlbnQgeWVhclxuICAgIHllYXIgPSBAY3VycmVudFllYXJcbiAgICB3aGlsZSBAeWVhcnMuaW5kZXhPZih5ZWFyKSA9PSAtMSAmJiBAY3VycmVudFllYXIgPiBAeWVhcnNbMF1cbiAgICAgIHllYXItLVxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICAjIGdldCBwb2ludCAmIGxhYmVsXG4gICAgcG9pbnQgPSBkMy5zZWxlY3QoJyNsaW5lLWxhYmVsLXBvaW50LScrZGF0YVtAb3B0aW9ucy5rZXkuaWRdKVxuICAgIGxhYmVsID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAjIGhpZGUgcG9pbnQgJiBsYWJlbCBpcyB0aGVyZSBpcyBubyBkYXRhXG4gICAgdW5sZXNzIGRhdGEudmFsdWVzW3llYXJdXG4gICAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIHJldHVyblxuICAgICMgc2hvdyBwb2ludCAmIGxhYmVsIGlmIHRoZXJlJ3MgZGF0YVxuICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAjIHNldCBsaW5lIGxhYmVsIHBvaW50XG4gICAgcG9pbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgIyBzZXQgbGluZSBsYWJlbCBob3ZlclxuICAgIGxhYmVsXG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5Rm9ybWF0KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlICcnXG4gICAgICBcbiAgc2V0VGlja0hvdmVyUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAneScsIE1hdGgucm91bmQgQGhlaWdodCtAb3B0aW9ucy5tYXJnaW4udG9wKzkiLCJjbGFzcyB3aW5kb3cuSGVhdG1hcEdyYXBoIGV4dGVuZHMgQmFzZUdyYXBoXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnICAgICAgID0gbnVsbFxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QgJyMnK0BpZCsnIC5oZWF0bWFwLWdyYXBoJ1xuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGNvbnRhaW5lci5jbGFzc2VkICdoYXMtbGVnZW5kJywgdHJ1ZVxuICAgIEAkdG9vbHRpcCAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgICMgR2V0IHllYXJzICh4IHNjYWxlKVxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyhkYXRhKVxuICAgICMgR2V0IGNvdW50cmllcyAoeSBzY2FsZSlcbiAgICBAY291bnRyaWVzID0gZGF0YS5tYXAgKGQpIC0+IGQuY29kZVxuICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4gICAgQGNlbGxzRGF0YSA9IEBnZXRDZWxsc0RhdGEgZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZ2V0RGltZW5zaW9ucygpICMgZm9yY2UgdXBkYXRlIGRpbWVuc2lvbnNcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICBtaW5ZZWFyID0gZDMubWluIGRhdGEsIChkKSAtPiBkMy5taW4oZDMua2V5cyhkLnZhbHVlcykpXG4gICAgbWF4WWVhciA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIHllYXJzID0gZDMucmFuZ2UgbWluWWVhciwgbWF4WWVhciwgMVxuICAgIHllYXJzLnB1c2ggK21heFllYXJcbiAgICByZXR1cm4geWVhcnNcblxuICBnZXRDZWxsc0RhdGE6IChkYXRhKSAtPlxuICAgIGNlbGxzRGF0YSA9IFtdXG4gICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4gICAgICAgIGNlbGxzRGF0YS5wdXNoXG4gICAgICAgICAgY291bnRyeTogZC5jb2RlXG4gICAgICAgICAgbmFtZTogICAgZC5uYW1lXG4gICAgICAgICAgeWVhcjogICAgdmFsdWVcbiAgICAgICAgICBjYXNlczogICBkLmNhc2VzW3ZhbHVlXVxuICAgICAgICAgIHZhbHVlOiAgIGQudmFsdWVzW3ZhbHVlXVxuICAgIHJldHVybiBjZWxsc0RhdGFcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXJcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBzdXBlcigpXG4gICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgZ2V0U2NhbGVZUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFswLCBAaGVpZ2h0XVxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQHllYXJzIFxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gQGNvdW50cmllc1xuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgNDAwXVxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgQHdpZHRoID0gQCRlbC53aWR0aCgpIC0gNzAgICMgeSBheGlzIHdpZHRoID0gMTAwXG4gICAgaWYgQHllYXJzIGFuZCBAY291bnRyaWVzXG4gICAgICBjZWxsU2l6ZSA9IE1hdGguZmxvb3IgQHdpZHRoIC8gQHllYXJzLmxlbmd0aFxuICAgICAgIyBzZXQgbWluaW11bSBjZWxsIGRpbWVuc2lvbnNcbiAgICAgIGlmIGNlbGxTaXplIDwgMTVcbiAgICAgICAgY2VsbFNpemUgPSAxNVxuICAgICAgICBAd2lkdGggPSAoY2VsbFNpemUgKiBAeWVhcnMubGVuZ3RoKSArIDcwXG4gICAgICBAaGVpZ2h0ID0gaWYgY2VsbFNpemUgPCAyMCB0aGVuIGNlbGxTaXplICogQGNvdW50cmllcy5sZW5ndGggZWxzZSAyMCAqIEBjb3VudHJpZXMubGVuZ3RoXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBzZXR1cCBzY2FsZXMgcmFuZ2VcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBjb250YWluZXIgaGVpZ2h0XG4gICAgI0Bjb250YWluZXIuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgICMgZHJhdyB5ZWFycyB4IGF4aXNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd4LWF4aXMgYXhpcydcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEB5ZWFycy5maWx0ZXIoKGQpIC0+IGQgJSA1ID09IDApKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXhpcy1pdGVtJ1xuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICAgIC5odG1sICAoZCkgLT4gZFxuICAgICMgZHJhdyBjb3VudHJpZXMgeSBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKVxuICAgIC5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLmRhdGEoQGNvdW50cmllcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICAgIC5odG1sIChkKSA9PiBAZ2V0Q291bnRyeU5hbWUgZFxuICAgICMgZHJhdyBjZWxsc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgLnNlbGVjdEFsbCgnLmNlbGwnKVxuICAgICAgLmRhdGEoQGNlbGxzRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2NlbGwnXG4gICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgPT4gQGNvbG9yKGQudmFsdWUpXG4gICAgICAub24gICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgLm9uICAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgICAuY2FsbCAgQHNldENlbGxEaW1lbnNpb25zXG4gICAgIyBkcmF3IHllYXIgaW50cm9kdWN0aW9uIG1hcmtcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJylcbiAgICAgIC5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEgQGRhdGEubWFwKChkKSAtPiB7Y29kZTogZC5jb2RlLCB5ZWFyOiBkLnllYXJfaW50cm9kdWN0aW9ufSkuZmlsdGVyKChkKSAtPiAhaXNOYU4gZC55ZWFyKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0TWFya2VyRGltZW5zaW9uc1xuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzY2FsZXNcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgY29udGFpbmVyc1xuICAgIEBjb250YWluZXJcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCArICdweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJylcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5jYWxsIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy55LWF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLnN0eWxlICd0b3AnLCAoZCkgPT4gQHkoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldENlbGxEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgPT4gQHgoZC55ZWFyKSsncHgnXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiBAeShkLmNvdW50cnkpKydweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKCkrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAeS5iYW5kd2lkdGgoKSsncHgnXG5cbiAgc2V0TWFya2VyRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpID0+IChAeShkLmNvZGUpLTEpKydweCdcbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IGlmIGQueWVhciA8IEB5ZWFyc1swXSB0aGVuIEB4KEB5ZWFyc1swXSktMSArICdweCcgZWxzZSBpZiBkLnllYXIgPCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXSB0aGVuIEB4KGQueWVhciktMSsncHgnIGVsc2UgQHguYmFuZHdpZHRoKCkrQHgoQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0pKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKEB5LmJhbmR3aWR0aCgpKzEpKydweCdcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgb2Zmc2V0ICAgICAgICAgICA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNvdW50cnknXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAueWVhcidcbiAgICAgIC5odG1sIGQueWVhclxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIGlmIGQudmFsdWUgPT0gMCB0aGVuIDAgZWxzZSBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKVxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIG9mZnNldC5sZWZ0ICsgQHguYmFuZHdpZHRoKCkgKiAwLjUgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIG9mZnNldC50b3AgLSAoQHkuYmFuZHdpZHRoKCkgKiAwLjUpIC0gQCR0b29sdGlwLmhlaWdodCgpXG4gICAgICAnb3BhY2l0eSc6ICcxJ1xuICAgIHJldHVyblxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcbiAgICByZXR1cm5cblxuICBnZXRDb3VudHJ5TmFtZTogKGNvZGUpID0+XG4gICAgY291bnRyeSA9IEBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICByZXR1cm4gaWYgY291bnRyeVswXSB0aGVuIGNvdW50cnlbMF0ubmFtZSBlbHNlICcnXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbmREYXRhID0gWzAsMTAwLDIwMCwzMDAsNDAwXVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgndWwnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5zdHlsZSAnbWFyZ2luLWxlZnQnLCAtKDE1KmxlZ2VuZERhdGEubGVuZ3RoKSsncHgnXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdsaScpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvciBkXG4gICAgICAgIC5odG1sIChkLGkpIC0+IGlmIGkgIT0gMCB0aGVuIGQgZWxzZSAnJm5ic3AnXG5cbiAgICAjIyNcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLTAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCAoZCkgLT4gZFxuICAgICMjI1xuXG4jIFZhY2NpbmVEaXNlYXNlR3JhcGggPSAoX2lkKSAtPlxuIyAgICQgPSBqUXVlcnkubm9Db25mbGljdCgpXG4jICAgWV9BWElTX1dJRFRIID0gMTAwXG4jICAgIyBNdXN0IGJlIHRoZSBhbWUgdmFsdWUgdGhhbiAjdmFjY2luZS1kaXNlYXNlLWdyYXBoICRwYWRkaW5nLWxlZnQgc2NzcyB2YXJpYWJsZVxuIyAgIHRoYXQgPSB0aGlzXG4jICAgaWQgPSBfaWRcbiMgICBkaXNlYXNlID0gdW5kZWZpbmVkXG4jICAgc29ydCA9IHVuZGVmaW5lZFxuIyAgIGxhbmcgPSB1bmRlZmluZWRcbiMgICBkYXRhID0gdW5kZWZpbmVkXG4jICAgZGF0YVBvcHVsYXRpb24gPSB1bmRlZmluZWRcbiMgICBjdXJyZW50RGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNlbGxEYXRhID0gdW5kZWZpbmVkXG4jICAgY291bnRyaWVzID0gdW5kZWZpbmVkXG4jICAgeWVhcnMgPSB1bmRlZmluZWRcbiMgICBjZWxsU2l6ZSA9IHVuZGVmaW5lZFxuIyAgIGNvbnRhaW5lciA9IHVuZGVmaW5lZFxuIyAgIHggPSB1bmRlZmluZWRcbiMgICB5ID0gdW5kZWZpbmVkXG4jICAgd2lkdGggPSB1bmRlZmluZWRcbiMgICBoZWlnaHQgPSB1bmRlZmluZWRcbiMgICAkZWwgPSB1bmRlZmluZWRcbiMgICAkdG9vbHRpcCA9IHVuZGVmaW5lZFxuIyAgICMgUHVibGljIE1ldGhvZHNcblxuIyAgIHRoYXQuaW5pdCA9IChfZGlzZWFzZSwgX3NvcnQpIC0+XG4jICAgICBkaXNlYXNlID0gX2Rpc2Vhc2VcbiMgICAgIHNvcnQgPSBfc29ydFxuIyAgICAgI2NvbnNvbGUubG9nKCdWYWNjaW5lIEdyYXBoIGluaXQnLCBpZCwgZGlzZWFzZSwgc29ydCk7XG4jICAgICAkZWwgPSAkKCcjJyArIGlkKVxuIyAgICAgJHRvb2x0aXAgPSAkZWwuZmluZCgnLnRvb2x0aXAnKVxuIyAgICAgbGFuZyA9ICRlbC5kYXRhKCdsYW5nJylcbiMgICAgIHggPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIHkgPSBkMy5zY2FsZUJhbmQoKS5wYWRkaW5nKDApLnBhZGRpbmdJbm5lcigwKS5wYWRkaW5nT3V0ZXIoMCkucm91bmQodHJ1ZSlcbiMgICAgIGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsKGQzLmludGVycG9sYXRlT3JSZClcbiMgICAgIGlmIGRhdGFcbiMgICAgICAgY2xlYXIoKVxuIyAgICAgICBzZXR1cERhdGEoKVxuIyAgICAgICBzZXR1cEdyYXBoKClcbiMgICAgIGVsc2VcbiMgICAgICAgIyBMb2FkIENTVnNcbiMgICAgICAgZDMucXVldWUoKS5kZWZlcihkMy5jc3YsICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykgKyAnL2RhdGEvZGlzZWFzZXMtY2FzZXMuY3N2JykuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9kYXRhL3BvcHVsYXRpb24uY3N2JykuYXdhaXQgb25EYXRhUmVhZHlcbiMgICAgIHRoYXRcblxuIyAgIHRoYXQub25SZXNpemUgPSAtPlxuIyAgICAgZ2V0RGltZW5zaW9ucygpXG4jICAgICBpZiBkYXRhXG4jICAgICAgIHVwZGF0ZUdyYXBoKClcbiMgICAgIHRoYXRcblxuIyAgIG9uRGF0YVJlYWR5ID0gKGVycm9yLCBkYXRhX2NzdiwgcG9wdWxhdGlvbl9jc3YpIC0+XG4jICAgICBkYXRhID0gZGF0YV9jc3ZcbiMgICAgIGRhdGFQb3B1bGF0aW9uID0gcG9wdWxhdGlvbl9jc3ZcbiMgICAgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiMgICAgIGRlbGV0ZSBkYXRhLmNvbHVtbnNcbiMgICAgICMgV2UgY2FuIGRlZmluZSBhIGZpbHRlciBmdW5jdGlvbiB0byBzaG93IG9ubHkgc29tZSBzZWxlY3RlZCBjb3VudHJpZXNcbiMgICAgIGlmIHRoYXQuZmlsdGVyXG4jICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcih0aGF0LmZpbHRlcilcbiMgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiMgICAgICAgZC5kaXNlYXNlID0gZC5kaXNlYXNlLnRvTG93ZXJDYXNlKClcbiMgICAgICAgaWYgZC55ZWFyX2ludHJvZHVjdGlvblxuIyAgICAgICAgIGQueWVhcl9pbnRyb2R1Y3Rpb24gPSArZC55ZWFyX2ludHJvZHVjdGlvbi5yZXBsYWNlKCdwcmlvciB0bycsICcnKVxuIyAgICAgICBkLmNhc2VzID0ge31cbiMgICAgICAgZC52YWx1ZXMgPSB7fVxuIyAgICAgICAjIHNldCB2YWx1ZSBlcyBjYXNlcyAvMTAwMCBpbmhhYml0YW50c1xuIyAgICAgICBwb3B1bGF0aW9uSXRlbSA9IHBvcHVsYXRpb25fY3N2LmZpbHRlcigoY291bnRyeSkgLT5cbiMgICAgICAgICBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4jICAgICAgIClcbiMgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuIyAgICAgICAgIHllYXIgPSAxOTgwXG4jICAgICAgICAgd2hpbGUgeWVhciA8IDIwMTZcbiMgICAgICAgICAgIGlmIGRbeWVhcl1cbiMgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuIyAgICAgICAgICAgICBpZiBwb3B1bGF0aW9uICE9IDBcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IDEwMDAgKiAoK2RbeWVhcl0gLyBwb3B1bGF0aW9uKTtcbiMgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiMgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiMgICAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiMgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBjYXNvcyBkZSAnICsgZC5kaXNlYXNlICsgJyBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgJzonLCBkW3llYXJdLCB0eXBlb2YgZFt5ZWFyXSk7XG4jICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuIyAgICAgICAgICAgeWVhcisrXG4jICAgICAgIGVsc2VcbiMgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuIyAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuIyAgICAgICBkLnRvdGFsID0gZDMudmFsdWVzKGQudmFsdWVzKS5yZWR1Y2UoKChhLCBiKSAtPlxuIyAgICAgICAgIGEgKyBiXG4jICAgICAgICksIDApXG4jICAgICAgIHJldHVyblxuIyAgICAgc2V0dXBEYXRhKClcbiMgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cERhdGEgPSAtPlxuIyAgICAgIyBGaWx0ZXIgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCBkaXNlYXNlXG4jICAgICBjdXJyZW50RGF0YSA9IGRhdGEuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkLmRpc2Vhc2UgPT0gZGlzZWFzZSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4jICAgICApXG4jICAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4jICAgICAjIEdldCBhcnJheSBvZiBjb3VudHJ5IG5hbWVzXG4jICAgICBjb3VudHJpZXMgPSBjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIGQuY29kZVxuIyAgICAgKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgeWVhcnNcbiMgICAgIG1pblllYXIgPSBkMy5taW4oY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5taW4gZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIG1heFllYXIgPSBkMy5tYXgoY3VycmVudERhdGEsIChkKSAtPlxuIyAgICAgICBkMy5tYXggZDMua2V5cyhkLnZhbHVlcylcbiMgICAgIClcbiMgICAgIHllYXJzID0gZDMucmFuZ2UobWluWWVhciwgbWF4WWVhciwgMSlcbiMgICAgIHllYXJzLnB1c2ggK21heFllYXJcbiMgICAgICNjb25zb2xlLmxvZyhtaW5ZZWFyLCBtYXhZZWFyLCB5ZWFycyk7XG4jICAgICAjY29uc29sZS5sb2coY291bnRyaWVzKTtcbiMgICAgICMgR2V0IGFycmF5IG9mIGRhdGEgdmFsdWVzXG4jICAgICBjZWxsc0RhdGEgPSBbXVxuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaCAoZCkgLT5cbiMgICAgICAgZm9yIHZhbHVlIG9mIGQudmFsdWVzXG4jICAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiMgICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuIyAgICAgICAgICAgbmFtZTogZC5uYW1lXG4jICAgICAgICAgICB5ZWFyOiB2YWx1ZVxuIyAgICAgICAgICAgY2FzZXM6IGQuY2FzZXNbdmFsdWVdXG4jICAgICAgICAgICB2YWx1ZTogZC52YWx1ZXNbdmFsdWVdXG4jICAgICAgIHJldHVyblxuXG4jICAgICAjIyNcbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2goZnVuY3Rpb24oZCl7XG4jICAgICAgIHZhciBjb3VudGVyID0gMDtcbiMgICAgICAgeWVhcnMuZm9yRWFjaChmdW5jdGlvbih5ZWFyKXtcbiMgICAgICAgICBpZiAoZFt5ZWFyXSlcbiMgICAgICAgICAgIGNvdW50ZXIrKztcbiMgICAgICAgfSk7XG4jICAgICAgIGlmKGNvdW50ZXIgPD0gMjApIC8vIHllYXJzLmxlbmd0aC8yKVxuIyAgICAgICAgIGNvbnNvbGUubG9nKGQubmFtZSArICcgaGFzIG9ubHkgdmFsdWVzIGZvciAnICsgY291bnRlciArICcgeWVhcnMnKTtcbiMgICAgIH0pO1xuIyAgICAgIyMjXG5cbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBHcmFwaCA9IC0+XG4jICAgICAjIEdldCBkaW1lbnNpb25zIChoZWlnaHQgaXMgYmFzZWQgb24gY291bnRyaWVzIGxlbmd0aClcbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgeC5kb21haW4oeWVhcnMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICB3aWR0aFxuIyAgICAgXVxuIyAgICAgeS5kb21haW4oY291bnRyaWVzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgaGVpZ2h0XG4jICAgICBdXG4jICAgICAjY29sb3IuZG9tYWluKFtkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pLCAwXSk7XG4jICAgICBjb2xvci5kb21haW4gW1xuIyAgICAgICAwXG4jICAgICAgIDRcbiMgICAgIF1cbiMgICAgICNjb25zb2xlLmxvZygnTWF4aW11bSBjYXNlcyB2YWx1ZTogJysgZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSk7XG4jICAgICAjIEFkZCBzdmdcbiMgICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycgKyBpZCArICcgLmdyYXBoLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKVxuIyAgICAgIyBEcmF3IGNlbGxzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsLWNvbnRhaW5lcicpLnN0eWxlKCdoZWlnaHQnLCBoZWlnaHQgKyAncHgnKS5zZWxlY3RBbGwoJy5jZWxsJykuZGF0YShjZWxsc0RhdGEpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdjZWxsJykuc3R5bGUoJ2JhY2tncm91bmQnLCAoZCkgLT5cbiMgICAgICAgY29sb3IgZC52YWx1ZVxuIyAgICAgKS5jYWxsKHNldENlbGxEaW1lbnNpb25zKS5vbignbW91c2VvdmVyJywgb25Nb3VzZU92ZXIpLm9uICdtb3VzZW91dCcsIG9uTW91c2VPdXRcbiMgICAgICMgRHJhdyB5ZWFycyB4IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3gtYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YSh5ZWFycy5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQgJSA1ID09IDBcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgnbGVmdCcsIChkKSAtPlxuIyAgICAgICB4KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBkXG4jICAgICAjIERyYXcgY291bnRyaWVzIHkgYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKGNvdW50cmllcykuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCd0b3AnLCAoZCkgLT5cbiMgICAgICAgeShkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZ2V0Q291bnRyeU5hbWUgZFxuIyAgICAgIyBEcmF3IHllYXIgaW50cm9kdWN0aW9uIG1hcmtcbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnNlbGVjdEFsbCgnLm1hcmtlcicpLmRhdGEoY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICB7XG4jICAgICAgICAgY29kZTogZC5jb2RlXG4jICAgICAgICAgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvblxuIyAgICAgICB9XG4jICAgICApLmZpbHRlcigoZCkgLT5cbiMgICAgICAgIWlzTmFOKGQueWVhcilcbiMgICAgICkpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdtYXJrZXInKS5jYWxsIHNldE1hcmtlckRpbWVuc2lvbnNcbiMgICAgIHJldHVyblxuXG4jICAgY2xlYXIgPSAtPlxuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykucmVtb3ZlKClcbiMgICAgIGNvbnRhaW5lci5zZWxlY3RBbGwoJy5heGlzJykucmVtb3ZlKClcbiMgICAgIHJldHVyblxuXG5cblxuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCAoZCkgLT4gZFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICAjIGdldCBjb3VudHJpZXMgZGF0YVxuICAgIEBjb3VudHJpZXMgPSB0b3BvanNvbi5mZWF0dXJlKG1hcCwgbWFwLm9iamVjdHMuY291bnRyaWVzKTtcbiAgICBAY291bnRyaWVzLmZlYXR1cmVzID0gQGNvdW50cmllcy5mZWF0dXJlcy5maWx0ZXIgKGQpIC0+IGQuaWQgIT0gJzAxMCcgICMgcmVtb3ZlIGFudGFyY3RpY2FcbiAgICAjIHNldCBwcm9qZWN0aW9uXG4gICAgQHByb2plY3Rpb24gPSBkMy5nZW9LYXZyYXlza2l5NygpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICAjIHNldCBwYXRoXG4gICAgQHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAgIC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgIyBhZGQgY291bnRyaWVzIHBhdGhzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAuZGF0YShAY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NvdW50cnktJytkLmlkXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2NvdW50cnknXG4gICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAxXG4gICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICMgdHJpZ2dlciBkcmF3LWNvbXBsZXRlIGV2ZW50XG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnU2NhdHRlcnBsb3QgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnhdID0gK2RbQG9wdGlvbnMua2V5LnhdXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIGNvbnNvbGUubG9nICdnZXRTY2FsZVhEb21haW4nLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS54XSlcbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdKV1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgY29uc29sZS5sb2cgJ2dldFNjYWxlWURvbWFpbicsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKVxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBjb25zb2xlLmxvZyBAZGF0YVxuICAgICMgZHJhdyBwb2ludHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdyJywgNlxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdC1sYWJlbCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuMzc1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldERvdHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS55XVxuXG4gIHNldERvdExhYmVsc0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS55XVxuXG4gICMgb3ZlcnJpZCB4IGF4aXMgcG9zaXRpb25pbmdcbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJ1xuICAgICIsIiMgTWFpbiBzY3JpcHQgZm9yIHZhY2NpbmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgIyBsaXN0IG9mIGV4Y2x1ZGVkIGNvdW50cmllcyBjb2RlcyAoY291bnRyaWVzIHdpdGggbGVzcyB0aGFuIDMwMC4wMDAgaW5oYWJpdGFudHMgaW4gMjAxNSlcbiAgZXhjbHVkZWRDb3VudHJpZXMgPSBbJ05JVScsJ0NPSycsJ1RVVicsJ05SVScsJ1BMVycsJ1ZHQicsJ01BRicsJ1NNUicsJ0dJQicsJ1RDQScsJ0xJRScsJ01DTycsJ1NYTScsJ0ZSTycsJ01ITCcsJ01OUCcsJ0FTTScsJ0tOQScsJ0dSTCcsJ0NZJywnQk1VJywnQU5EJywnRE1BJywnSU1OJywnQVRHJywnU1lDJywnVklSJywnQUJXJywnRlNNJywnVE9OJywnR1JEJywnVkNUJywnS0lSJywnQ1VXJywnQ0hJJywnR1VNJywnTENBJywnU1RQJywnV1NNJywnVlVUJywnTkNMJywnUFlGJywnQlJCJ10gICAgICBcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgZm9ybWF0RmxvYXQgPSBkMy5mb3JtYXQoJywuMWYnKVxuICBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG5cbiAgIyBJbml0IFRvb2x0aXBzXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcblxuXG4gICMgZ2V0IGNvdW50cnkgbmFtZSBhdXhpbGlhciBtZXRob2RcbiAgZ2V0Q291bnRyeU5hbWUgPSAoY291bnRyaWVzLCBjb2RlLCBsYW5nKSAtPlxuICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIGlmIGl0ZW1cbiAgICAgIGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZXJyb3IgJ05vIGNvdW50cnkgbmFtZSBmb3IgY29kZScsIGNvZGVcblxuICAjIFZpZGVvIG9mIG1hcCBwb2xpbyBjYXNlc1xuICBzZXRWaWRlb01hcFBvbGlvID0gLT5cbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvZGlzZWFzZXMtcG9saW8tY2FzZXMtdG90YWwuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgY2FzZXMgPSB7fVxuICAgICAgY2FzZXNTdHIgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnY2Fzb3MnIGVsc2UgJ2Nhc2VzJ1xuICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICBjYXNlc1tkLnllYXJdID0gZC52YWx1ZVxuICAgICAgIyBBZGQgeW91dHViZSB2aWRlb1xuICAgICAgd3JhcHBlciA9IFBvcGNvcm4uSFRNTFlvdVR1YmVWaWRlb0VsZW1lbnQoJyN2aWRlby1tYXAtcG9saW8nKVxuICAgICAgd3JhcHBlci5zcmMgPSAnaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9vLUV6Vk9qbmM2UT9jb250cm9scz0wJnNob3dpbmZvPTAmaGQ9MSdcbiAgICAgIHBvcGNvcm4gPSBQb3Bjb3JuKHdyYXBwZXIpXG4gICAgICBub3RlcyA9IDIwMTcgLSAxOTgwXG4gICAgICB5ZWFyRHVyYXRpb24gPSAyNy8obm90ZXMrMSkgIyB2aWRlbyBkdXJhdGlvbiBpcyAyN3NlY29uZHMgXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IG5vdGVzXG4gICAgICAgIHllYXIgPSAnJysoMTk4MCtpKVxuICAgICAgICBwb3Bjb3JuLmZvb3Rub3RlXG4gICAgICAgICAgc3RhcnQ6ICB5ZWFyRHVyYXRpb24gKiBpXG4gICAgICAgICAgZW5kOiAgICBpZiBpIDwgbm90ZXMtMSB0aGVuIHllYXJEdXJhdGlvbiooaSsxKSBlbHNlICh5ZWFyRHVyYXRpb24qKGkrMSkpKzFcbiAgICAgICAgICB0ZXh0OiAgIHllYXIgKyAnPGJyPjxzcGFuIGNsYXNzPVwidmFsdWVcIj4nICsgZm9ybWF0SW50ZWdlcihjYXNlc1t5ZWFyXSkgKyAnICcgKyBjYXNlc1N0ciArICc8L3NwYW4+J1xuICAgICAgICAgIHRhcmdldDogJ3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbidcbiAgICAgICAgaSsrXG4gICAgICAjIFNob3cgY292ZXIgd2hlbiB2aWRlbyBlbmRlZFxuICAgICAgd3JhcHBlci5hZGRFdmVudExpc3RlbmVyICdlbmRlZCcsIChlKSAtPlxuICAgICAgICAkKCcudmlkZW8tbWFwLXBvbGlvLWNvdmVyJykuc2hvdygpXG4gICAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24sICN2aWRlby1tYXAtcG9saW8gaWZyYW1lJykuZmFkZVRvIDAsIDBcbiAgICAgICAgcG9wY29ybi5jdXJyZW50VGltZSAwXG4gICAgICAjIFNob3cgdmlkZW8gd2hlbiBwbGF5IGJ0biBjbGlja2VkXG4gICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLXBsYXktYnRuJykuY2xpY2sgKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBwb3Bjb3JuLnBsYXkoKVxuICAgICAgICAkKCcudmlkZW8tbWFwLXBvbGlvLWNvdmVyJykuZmFkZU91dCgpXG4gICAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24sICN2aWRlby1tYXAtcG9saW8gaWZyYW1lJykuZmFkZVRvIDMwMCwgMVxuXG5cbiAgIyBNZWFzbGVzIFdvcmxkIE1hcCBHcmFwaFxuICBzZXR1cE1lYXNsZXNXb3JsZE1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvbWVhc2xlcy1jYXNlcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLXdoby1yZWdpb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgIyBhZGQgY2FzZXMgdG8gZWFjaCBjb3VudHJ5XG4gICAgICAgIGNvdW50cmllcy5mb3JFYWNoIChjb3VudHJ5KSAtPlxuICAgICAgICAgIHJlZ2lvbiA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLnJlZ2lvbiA9PSBjb3VudHJ5LnJlZ2lvblxuICAgICAgICAgIGlmIHJlZ2lvbi5sZW5ndGggPiAwXG4gICAgICAgICAgICBjb3VudHJ5LnZhbHVlID0gcmVnaW9uWzBdLmNhc2VzKjEwMDAwMFxuICAgICAgICAgICAgY291bnRyeS5jYXNlcyA9IHJlZ2lvblswXS5jYXNlc190b3RhbFxuICAgICAgICAgICAgY291bnRyeS5uYW1lID0gcmVnaW9uWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgIyBzZXQgZ3JhcGhcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93Lk1hcEdyYXBoKCdtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgICAgIG1hcmdpbjogXG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLnNldERhdGEgY291bnRyaWVzLCBtYXBcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgTWVhc2xlcyBjYXNlcyBIZWF0bWFwIEdyYXBoXG4gIHNldHVwSGVhdE1hcEdyYXBoID0gKGlkLCBkYXRhLCBjb3VudHJpZXMsIGxlZ2VuZCkgLT5cbiAgICBkYXRhID0gZGF0YVxuICAgICAgLmZpbHRlciAoZCkgLT4gY291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSAhPSAtMSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4gICAgICAuc29ydCAoYSxiKSAtPiBhLnRvdGFsIC0gYi50b3RhbFxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5IZWF0bWFwR3JhcGgoaWQsXG4gICAgICBsZWdlbmQ6IGxlZ2VuZFxuICAgICAgbWFyZ2luOiBcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgbGVmdDogMClcbiAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgc2V0dXBWYWNjaW5lQ29uZmlkZW5jZUJhckdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9jb25maWRlbmNlLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCAnaHR0cDovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBsb2NhdGlvbikgLT5cbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgIGQudmFsdWUgPSArZC52YWx1ZVxuICAgICAgICAgIGQubmFtZSA9IGRbJ25hbWVfJytsYW5nXVxuICAgICAgICAgIGRlbGV0ZSBkLm5hbWVfZXNcbiAgICAgICAgICBkZWxldGUgZC5uYW1lX2VuXG4gICAgICAgICAgIyBzZXQgdXNlciBjb3VudHJ5IGFjdGl2ZVxuICAgICAgICAgIGlmIGxvY2F0aW9uIGFuZCBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICAgICAgZC5hY3RpdmUgPSB0cnVlXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaCgndmFjY2luZS1jb25maWRlbmNlLWdyYXBoJyxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogMC4zXG4gICAgICAgICAgbGFiZWw6IFxuICAgICAgICAgICAgZm9ybWF0OiAoZCkgLT4gIGZvcm1hdEZsb2F0KGQpKyclJ1xuICAgICAgICAgIG1hcmdpbjogdG9wOiAwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgICAgICBpZDogJ2NvZGUnKVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwVmFjY2luZUJjZ0Nhc2VzTWFwID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdHViZXJjdWxvc2lzLWNhc2VzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgZC52YWx1ZSA9ICtkLmNhc2VzX3BvcHVsYXRpb25cbiAgICAgICAgICBkLmNhc2VzID0gK2QuY2FzZXNcbiAgICAgICAgICBpZiBpdGVtXG4gICAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgndmFjY2luZS1iY2ctY2FzZXMtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46IFxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5nZXRMZWdlbmREYXRhID0gLT4gWzAsMjAwLDQwMCw2MDAsODAwXVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEsIG1hcFxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVCY2dTdG9ja291dHNNYXAgPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9iY2ctc3RvY2tvdXRzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gICAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTWFwR3JhcGgoJ3ZhY2NpbmUtYmNnLXN0b2Nrb3V0cycsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgICAgIG1hcmdpbjogXG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLmZvcm1hdEZsb2F0ID0gZ3JhcGguZm9ybWF0SW50ZWdlclxuICAgICAgICBncmFwaC5nZXRMZWdlbmREYXRhID0gLT4gWzAsMiw0LDYsOF1cbiAgICAgICAgZ3JhcGguc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgICAgICAgIC5odG1sIGQubmFtZVxuICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uJ1xuICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgIGlmIGQudmFsdWUgPT0gMFxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi16ZXJvJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgZWxzZSBpZiBkLnZhbHVlID09IDFcbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tb25lJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXAgXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tbXVsdGlwbGUgLnZhbHVlJ1xuICAgICAgICAgICAgICAuaHRtbCBncmFwaC5mb3JtYXRJbnRlZ2VyKGQudmFsdWUpXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLW11bHRpcGxlJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YSwgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy1tZWFzbGVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL3BvcHVsYXRpb24uY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV9jYXNlcywgZGF0YV9wb3B1bGF0aW9uKSAtPlxuICAgICAgICBkZWxldGUgZGF0YV9jYXNlcy5jb2x1bW5zICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4gICAgICAgIGRhdGFfY2FzZXMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4gICAgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiAgICAgICAgICBkLmNhc2VzID0ge31cbiAgICAgICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICAgICAgZC5uYW1lID0gZ2V0Q291bnRyeU5hbWUgZGF0YV9wb3B1bGF0aW9uLCBkLmNvZGUsIGxhbmdcbiAgICAgICAgICAjIHNldCB2YWx1ZXMgYXMgY2FzZXMvMTAwMCBpbmhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgICAgICB5ZWFyKytcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuICAgICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4gICAgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT4gYSArIGIpLCAwKVxuICAgICAgICAjIEZpbHRlciBieSBzZWxlY3RlZCBjb3VudHJpZXMgJiBkaXNlYXNlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTEnLCBkYXRhX2Nhc2VzLCBbJ0ZJTicsJ0hVTicsJ1BSVCcsJ1VSWScsJ01FWCcsJ0NPTCddLCB0cnVlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTInLCBkYXRhX2Nhc2VzLCBbJ0lSUScsJ0JHUicsJ01ORycsJ1pBRicsJ0ZSQScsJ0dFTyddLCBmYWxzZVxuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLnZhbCgpKVxuICAgICAgIyBVcGRhdGUgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCB2YWNjaW5lXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgIyBVcGRhdGUgYWN0aXZlIGNvdW50cmllc1xuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3IsICNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcpLmZpbmQoJy5saW5lLWxhYmVsLCAubGluZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgTXVsdGlwbGUgU21hbGwgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZU11bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgY3VycmVudF9jb3VudHJpZXMgPSBbJ0xLQScsJ0RaQScsJ0RFVScsJ0ROSycsJ0ZSQSddXG4gICAgZ3JhcGhzID0gW11cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sICdodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbG9jYXRpb24pIC0+XG4gICAgICAgICMgU2V0dXAgdXNlciBjb3VudHJ5XG4gICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICBpZiB1c2VyX2NvdW50cnkgYW5kIHVzZXJfY291bnRyeS5sZW5ndGggPiAwIGFuZCB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgaWYgY3VycmVudF9jb3VudHJpZXMuaW5kZXhPZih1c2VyX2NvdW50cnlbMF0uY29kZSkgPT0gLTFcbiAgICAgICAgICAgICAgY3VycmVudF9jb3VudHJpZXNbMl0gPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgICBlbCA9ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGggLmdyYXBoLWNvbnRhaW5lcicpLmVxKDIpXG4gICAgICAgICAgICAgIGVsLmZpbmQoJ3AnKS5odG1sIHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICAgIGVsLmZpbmQoJy5saW5lLWdyYXBoJykuYXR0ciAnaWQnLCAnaW1tdW5pemF0aW9uLWNvdmVyYWdlLScrdXNlcl9jb3VudHJ5WzBdLmNvZGUudG9Mb3dlckNhc2UoKSsnLWdyYXBoJ1xuICAgICAgICAjIGxvb3AgdGhyb3VnaCBlYWNoIHNlbGVjdGVkIGNvdW50cnkgICBcbiAgICAgICAgY3VycmVudF9jb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSxpKSAtPlxuICAgICAgICAgICMgZ2V0IGN1cnJlbnQgZGlzZWFzZSBkYXRhXG4gICAgICAgICAgY291bnRyeV9kYXRhID0gZGF0YVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlcbiAgICAgICAgICAgIC5tYXAgICAgKGQpIC0+ICQuZXh0ZW5kKHt9LCBkKVxuICAgICAgICAgIGNvdW50cnlfZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDEnXVxuICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDInXVxuICAgICAgICAgICMgc2V0dXAgbGluZSBjaGFydFxuICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS0nK2NvdW50cnkudG9Mb3dlckNhc2UoKSsnLWdyYXBoJyxcbiAgICAgICAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgICAgICAga2V5OiBcbiAgICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICAgIGlkOiAnY29kZScpXG4gICAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgICBncmFwaC55Rm9ybWF0ID0gKGQpIC0+IGQrJyUnXG4gICAgICAgICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgICAgICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbNTBdXG4gICAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMywyMDE1XVxuICAgICAgICAgIGdyYXBoLmFkZE1hcmtlclxuICAgICAgICAgICAgdmFsdWU6IDk1XG4gICAgICAgICAgICBsYWJlbDogaWYgaSUyICE9IDAgdGhlbiAnJyBlbHNlIGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgICAgYWxpZ246ICdsZWZ0J1xuICAgICAgICAgICMgc2hvdyBsYXN0IHllYXIgbGFiZWxcbiAgICAgICAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgICAgICAgIGdyYXBoLnNldExhYmVsIDIwMTVcbiAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgICAgICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAgICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgICAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICAgICAgZ3JhcGguc2V0RGF0YSBjb3VudHJ5X2RhdGFcbiAgICAgICAgICAjIGxpc3RlbiB0byB5ZWFyIGNoYW5nZXMgJiB1cGRhdGUgZWFjaCBncmFwaCBsYWJlbFxuICAgICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4gICAgICAgXG5cbiAgIyBXb3JsZCBDYXNlcyBNdWx0aXBsZSBTbWFsbFxuICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGggPSAtPlxuICAgIGRpc2Vhc2VzID0gWydkaXBodGVyaWEnLCAnbWVhc2xlcycsJ3BlcnR1c3NpcycsJ3BvbGlvJywndGV0YW51cyddXG4gICAgZ3JhcGhzID0gW11cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OiBcbiAgICAgICAgICAgIHg6ICdkaXNlYXNlJ1xuICAgICAgICAgICAgaWQ6ICdkaXNlYXNlJylcbiAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk4MCwgMjAxNV1cbiAgICAgICAgZ3JhcGgueUF4aXMudGlja3MoMikudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgaWYgZGlzZWFzZSA9PSAnbWVhc2xlcycgb3IgZGlzZWFzZSA9PSAncGVydHVzc2lzJyB0aGVuIG1heFZhbHVlMSBlbHNlIG1heFZhbHVlMl1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkaXNlYXNlX2RhdGFcbiAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2ltbXVuaXphdGlvbi1jb3ZlcmFnZS5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sICdodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbG9jYXRpb24pIC0+XG4gICAgICAgICMgU2V0dXAgdXNlciBjb3VudHJ5XG4gICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICBsb2NhdGlvbi5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgIyBGaWx0ZXIgZGF0YVxuICAgICAgICBoZXJkSW1tdW5pdHkgPSBcbiAgICAgICAgICAnTUNWMSc6IDk1XG4gICAgICAgICAgJ1BvbDMnOiA4MFxuICAgICAgICAgICdEVFAzJzogODBcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBleGNsdWRlZENvdW50cmllcy5pbmRleE9mKGQuY29kZSkgPT0gLTFcbiAgICAgICAgIyBEYXRhIHBhcnNlICYgc29ydGluZyBmdW50aW9uc1xuICAgICAgICBkYXRhX3BhcnNlciA9IChkKSAtPlxuICAgICAgICAgIG9iaiA9IFxuICAgICAgICAgICAga2V5OiAgIGQuY29kZVxuICAgICAgICAgICAgbmFtZTogIGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5jb2RlLCBsYW5nKVxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE1J11cbiAgICAgICAgICBpZiBsb2NhdGlvbiBhbmQgZC5jb2RlID09IGxvY2F0aW9uLmNvZGVcbiAgICAgICAgICAgIG9iai5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICBkYXRhX3NvcnQgPSAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgIyBsb29wIHRocm91Z2ggZWFjaCBncmFwaFxuICAgICAgICAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5lYWNoIC0+XG4gICAgICAgICAgJGVsICAgICA9ICQodGhpcylcbiAgICAgICAgICBkaXNlYXNlID0gJGVsLmRhdGEoJ2Rpc2Vhc2UnKVxuICAgICAgICAgIHZhY2NpbmUgPSAkZWwuZGF0YSgndmFjY2luZScpXG4gICAgICAgICAgIyBHZXQgZ3JhcGggZGF0YSAmIHZhbHVlXG4gICAgICAgICAgZ3JhcGhfZGF0YSA9IGRhdGFcbiAgICAgICAgICAgIC5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSB2YWNjaW5lIGFuZCBkWycyMDE1J10gIT0gJycpXG4gICAgICAgICAgICAubWFwKGRhdGFfcGFyc2VyKVxuICAgICAgICAgICAgLnNvcnQoZGF0YV9zb3J0KVxuICAgICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgICBncmFwaF92YWx1ZSA9IGdyYXBoX2RhdGEuZmlsdGVyIChkKSAtPiBkLmtleSA9PSBsb2NhdGlvbi5jb2RlXG4gICAgICAgICAgIyBTZXR1cCBncmFwaFxuICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaChkaXNlYXNlKyctaW1tdW5pemF0aW9uLWJhci1ncmFwaCcsXG4gICAgICAgICAgICBhc3BlY3RSYXRpbzogMC4yNVxuICAgICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICAgIGZvcm1hdDogKGQpIC0+ICtkKyclJ1xuICAgICAgICAgICAga2V5OiB4OiAnbmFtZSdcbiAgICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgICAgdG9wOiAyMClcbiAgICAgICAgICBtYXJrZXIgPSBcbiAgICAgICAgICAgIHZhbHVlOiBoZXJkSW1tdW5pdHlbdmFjY2luZV1cbiAgICAgICAgICAgIGxhYmVsOiBpZiBsYW5nID09ICdlcycgdGhlbiAnTml2ZWwgZGUgcmViYcOxbycgZWxzZSAnSGVyZCBpbW11bml0eSdcbiAgICAgICAgICBpZiB2YWNjaW5lID09ICdEVFAzJ1xuICAgICAgICAgICAgbWFya2VyLmxhYmVsID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ1JlY29tZW5kYWNpw7NuIE9NUycgZWxzZSAnV0hPIHJlY29tbWVuZGF0aW9uJ1xuICAgICAgICAgIGdyYXBoXG4gICAgICAgICAgICAuYWRkTWFya2VyIG1hcmtlclxuICAgICAgICAgICAgLnNldERhdGEgZ3JhcGhfZGF0YVxuICAgICAgICAgICMgU2V0dXAgZ3JhcGggdmFsdWVcbiAgICAgICAgICBpZiBncmFwaF92YWx1ZSBhbmQgZ3JhcGhfdmFsdWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tY291bnRyeScpLmh0bWwgbG9jYXRpb24ubmFtZVxuICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tZGF0YScpLmh0bWwgJzxzdHJvbmc+JyArIGdyYXBoX3ZhbHVlWzBdLnZhbHVlICsgJyU8L3N0cm9uZz4nXG4gICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kZXNjcmlwdGlvbicpLnNob3coKVxuICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPiBncmFwaC5vblJlc2l6ZSgpXG4gIFxuICAjIyNcbiAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicsXG4gICAgICAjaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46IFxuICAgICAgICBsZWZ0OiAwXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGJvdHRvbTogMjApXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMCwgMjAwNSwgMjAxMCwgMjAxNV1cbiAgICBncmFwaC55QXhpc1xuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIGdyYXBoLmxvYWREYXRhIGJhc2V1cmwrJy9kYXRhL2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXIuY3N2J1xuICAgIGdyYXBoLiRlbC5vbiAnZHJhdy1jb21wbGV0ZScsIChlKSAtPlxuICAgICAgbGluZSA9IGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy5saW5lJylcbiAgICAgIGNvbnNvbGUubG9nIGxpbmUubm9kZSgpXG4gICAgICBsZW5ndGggPSBsaW5lLm5vZGUoKS5nZXRUb3RhbExlbmd0aCgpO1xuICAgICAgbGluZVxuICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsIGxlbmd0aCArICcgJyArIGxlbmd0aClcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0JywgbGVuZ3RoKVxuICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5KDUwMDApXG4gICAgICAgICAgLmR1cmF0aW9uKDUwMDApXG4gICAgICAgICAgLmVhc2UoZDMuZWFzZVNpbkluT3V0KVxuICAgICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIDApXG5cbiAgaWYgJCgnI2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXInKS5sZW5ndGggPiAwXG4gICAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCgpXG4gICMjI1xuXG4gIGlmICQoJyN2aWRlby1tYXAtcG9saW8nKS5sZW5ndGggPiAwXG4gICAgc2V0VmlkZW9NYXBQb2xpbygpXG5cbiAgIyMjXG4gICMjIFZhY2NpbmUgbWFwXG4gIGlmICQoJyN2YWNjaW5lLW1hcCcpLmxlbmd0aCA+IDBcbiAgICB2YWNjaW5lX21hcCA9IG5ldyBWYWNjaW5lTWFwICd2YWNjaW5lLW1hcCdcbiAgICAjdmFjY2luZV9tYXAuZ2V0RGF0YSA9IHRydWUgICMgIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgcG9saW8gY2FzZXMgY3N2XG4gICAgdmFjY2luZV9tYXAuZ2V0UGljdHVyZVNlcXVlbmNlID0gdHJ1ZSAgICMgU2V0IHRydWUgdG8gZG93bmxvYWQgYSBtYXAgcGljdHVyZSBzZXF1ZW5jZVxuICAgIHZhY2NpbmVfbWFwLmluaXQgYmFzZXVybCsnL2RhdGEvZGlzZWFzZXMtcG9saW8tY2FzZXMuY3N2JywgYmFzZXVybCsnL2RhdGEvbWFwLXBvbGlvLWNhc2VzLmNzdidcbiAgICAkKHdpbmRvdykucmVzaXplIHZhY2NpbmVfbWFwLm9uUmVzaXplXG4gICMjI1xuXG4gIGlmICQoJy52YWNjaW5lcy1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGgoKVxuXG4gICMjI1xuICAjIFZhY2NpbmUgYWxsIGRpc2Vhc2VzIGdyYXBoXG4gIGlmICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMgPSBuZXcgVmFjY2luZURpc2Vhc2VHcmFwaCgndmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJylcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLm9uUmVzaXplXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuICAgICQoJyNkaXNlYXNlLXNlbGVjdG9yIGEnKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgJCh0aGlzKS50YWIgJ3Nob3cnXG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQodGhpcykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICAgcmV0dXJuXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZW9uIG9uIG9yZGVyIHNlbGVjdG9yXG4gICAgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS5jaGFuZ2UgKGQpIC0+XG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQodGhpcykudmFsKClcbiAgIyMjXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGgoKVxuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZU11bHRpcGxlU21hbGxHcmFwaCgpXG5cbiAgaWYgJCgnI3dvcmxkLWNhc2VzJykubGVuZ3RoID4gMFxuICAgIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCgpXG4gIFxuICBpZiAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGgoKVxuXG4gIGlmICQoJyNtZWFzbGVzLXdvcmxkLW1hcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cE1lYXNsZXNXb3JsZE1hcEdyYXBoKClcblxuICBpZiAkKCcjdmFjY2luZS1jb25maWRlbmNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCgpXG5cbiAgaWYgJCgnI3ZhY2NpbmUtYmNnLWNhc2VzLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUJjZ0Nhc2VzTWFwKClcblxuICBpZiAkKCcjdmFjY2luZS1iY2ctc3RvY2tvdXRzJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZUJjZ1N0b2Nrb3V0c01hcCgpXG5cbikgalF1ZXJ5Il19
