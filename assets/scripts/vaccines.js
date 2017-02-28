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
      this.setTooltipData = bind(this.setTooltipData, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
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
      ScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
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
          'text': this.lang === 'es' ? 'Los países con más muertes por cáncer de cérvix son también los más pobres y no habían incluido la vacuna en 2015' : 'Countries with highest mortality from cervical cancer are also the poorest and had not introduced the vaccine by 2015',
          'textWidth': 0.38 * this.width,
          'textOffset': [0.25 * this.height, 0]
        }, {
          'cx': 0.28 * this.height,
          'cy': 0.46 * this.height,
          'r': 0.072 * this.height,
          'text': this.lang === 'es' ? 'Sólo unos pocos países de rentas bajas incluyeron la vacuna en sus programas, gracias a la ayuda externa de GAVI' : 'Only a few low-income countries had introduced the vaccine in their programmes, thanks to GAVI\'s external assistance',
          'textWidth': 0.36 * this.width,
          'textOffset': [0.18 * this.height, 0]
        }, {
          'cx': this.width - 0.36 * this.height,
          'cy': this.height - 0.11 * this.height,
          'r': 0.16 * this.height,
          'text': this.lang === 'es' ? 'Gran parte de los países que cuentan con la vacuna en sus programas son países ricos con una baja mortalidad por cáncer de cérvix' : 'Most countries that have the vaccine in their programmes are rich countries with low mortality from cervical cancer',
          'textWidth': 0.38 * this.width,
          'textOffset': [0, -0.2 * this.height]
        }
      ];
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
      this.$tooltip.find('.vaccine-' + d[this.options.key.color]).css('display', 'block');
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
    setupVaccineVPHGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/vph.csv').defer(d3.csv, baseurl + '/data/gdp.csv').defer(d3.csv, baseurl + '/data/population.csv').await(function(error, data, countries, population) {
        var graph;
        data = data.filter(function(d) {
          return excludedCountries.indexOf(d.country) === -1;
        });
        data.forEach(function(d) {
          var country, country_population;
          country = countries.filter(function(e) {
            return e.code === d.country;
          });
          country_population = population.filter(function(e) {
            return e.code === d.country;
          });
          if (country[0]) {
            d.name = country[0]['name_' + lang];
            d.gdp = +country[0].value;
          } else {

          }
          if (country_population[0]) {
            d.population = +country_population[0]['2015'];
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
            size: 'population',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZGlzY3JldGUtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtdnBoLWdyYXBoLmNvZmZlZSIsIm1haW4tdmFjY2luZXMtcHJpY2VzLmNvZmZlZSIsIm1haW4tdmFjY2luZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFB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QUMsTUFBNUIsR0FBcUMsQ0FBeEM7TUFDRSwyQkFBQSxDQUFBLEVBREY7O0lBR0EsSUFBRyxDQUFBLENBQUUsb0JBQUYsQ0FBdUIsQ0FBQyxNQUF4QixHQUFpQyxDQUFwQztNQUNFLG9CQUFBLENBQUEsRUFERjs7SUFJQSxJQUFHLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLFFBQW5CLENBQUEsSUFBaUMsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBcEM7TUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLDJCQUE5QixFQUROOztJQUlBLElBQUcsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBM0M7YUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLCtCQUE5QixFQUROOztFQS9rQkQsQ0FBRCxDQUFBLENBa2xCRSxNQWxsQkY7QUFBQSIsImZpbGUiOiJ2YWNjaW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCYXIgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICAgLnBhZGRpbmdJbm5lcigwLjEpXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBiYXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYWN0aXZlJyBlbHNlICdiYXInXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgIyBkcmF3IGxhYmVscyB4XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXggYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteCdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnMS4yNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICAjIGRyYXcgbGFiZWxzIHlcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteSBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC15J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICctMC41ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBpZiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQgdGhlbiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQoZFtAb3B0aW9ucy5rZXkueV0pIGVsc2UgZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldEJhckRpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAaGVpZ2h0IC0gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKClcblxuICBzZXRCYXJMYWJlbFhEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQGhlaWdodFxuXG4gIHNldEJhckxhYmVsWURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5MaW5lR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICB5Rm9ybWF0OiBkMy5mb3JtYXQoJ2QnKSAgICMgc2V0IGxhYmVscyBob3ZlciBmb3JtYXRcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdMaW5lIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyBkYXRhXG4gICAgc3VwZXIoZGF0YSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICB5ZWFycyA9IFtdXG4gICAgZDMua2V5cyhkYXRhWzBdKS5mb3JFYWNoIChkKSAtPlxuICAgICAgaWYgK2RcbiAgICAgICAgeWVhcnMucHVzaCArZFxuICAgIHJldHVybiB5ZWFycy5zb3J0KClcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGRbQG9wdGlvbnMua2V5LnhdLCAnZW4gJywgeWVhcik7XG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbScgICAgICBcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgXG4gIHNldFRpY2tIb3ZlclBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCBNYXRoLnJvdW5kIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCs5IiwiY2xhc3Mgd2luZG93LkhlYXRtYXBHcmFwaCBleHRlbmRzIEJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyAgICAgICA9IG51bGxcbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0ICcjJytAaWQrJyAuaGVhdG1hcC1ncmFwaCdcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBjb250YWluZXIuY2xhc3NlZCAnaGFzLWxlZ2VuZCcsIHRydWVcbiAgICBAJHRvb2x0aXAgID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICAjIEdldCB5ZWFycyAoeCBzY2FsZSlcbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMoZGF0YSlcbiAgICAjIEdldCBjb3VudHJpZXMgKHkgc2NhbGUpXG4gICAgQGNvdW50cmllcyA9IGRhdGEubWFwIChkKSAtPiBkLmNvZGVcbiAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuICAgIEBjZWxsc0RhdGEgPSBAZ2V0Q2VsbHNEYXRhIGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGdldERpbWVuc2lvbnMoKSAjIGZvcmNlIHVwZGF0ZSBkaW1lbnNpb25zXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgbWluWWVhciA9IGQzLm1pbiBkYXRhLCAoZCkgLT4gZDMubWluKGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIG1heFllYXIgPSBkMy5tYXggZGF0YSwgKGQpIC0+IGQzLm1heChkMy5rZXlzKGQudmFsdWVzKSlcbiAgICB5ZWFycyA9IGQzLnJhbmdlIG1pblllYXIsIG1heFllYXIsIDFcbiAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4gICAgcmV0dXJuIHllYXJzXG5cbiAgZ2V0Q2VsbHNEYXRhOiAoZGF0YSkgLT5cbiAgICBjZWxsc0RhdGEgPSBbXVxuICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuICAgICAgICBjZWxsc0RhdGEucHVzaFxuICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuICAgICAgICAgIG5hbWU6ICAgIGQubmFtZVxuICAgICAgICAgIHllYXI6ICAgIHZhbHVlXG4gICAgICAgICAgY2FzZXM6ICAgZC5jYXNlc1t2YWx1ZV1cbiAgICAgICAgICB2YWx1ZTogICBkLnZhbHVlc1t2YWx1ZV1cbiAgICByZXR1cm4gY2VsbHNEYXRhXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyXG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWFJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gIGdldFNjYWxlWVJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQGhlaWdodF1cblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEB5ZWFycyBcblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIEBjb3VudHJpZXNcblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDQwMF1cblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIEB3aWR0aCA9IEAkZWwud2lkdGgoKSAtIDcwICAjIHkgYXhpcyB3aWR0aCA9IDEwMFxuICAgIGlmIEB5ZWFycyBhbmQgQGNvdW50cmllc1xuICAgICAgY2VsbFNpemUgPSBNYXRoLmZsb29yIEB3aWR0aCAvIEB5ZWFycy5sZW5ndGhcbiAgICAgICMgc2V0IG1pbmltdW0gY2VsbCBkaW1lbnNpb25zXG4gICAgICBpZiBjZWxsU2l6ZSA8IDE1XG4gICAgICAgIGNlbGxTaXplID0gMTVcbiAgICAgICAgQHdpZHRoID0gKGNlbGxTaXplICogQHllYXJzLmxlbmd0aCkgKyA3MFxuICAgICAgQGhlaWdodCA9IGlmIGNlbGxTaXplIDwgMjAgdGhlbiBjZWxsU2l6ZSAqIEBjb3VudHJpZXMubGVuZ3RoIGVsc2UgMjAgKiBAY291bnRyaWVzLmxlbmd0aFxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgc2V0dXAgc2NhbGVzIHJhbmdlXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgY29udGFpbmVyIGhlaWdodFxuICAgICNAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAjIGRyYXcgeWVhcnMgeCBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAneC1heGlzIGF4aXMnXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAeWVhcnMuZmlsdGVyKChkKSAtPiBkICUgNSA9PSAwKSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgICAuaHRtbCAgKGQpIC0+IGRcbiAgICAjIGRyYXcgY291bnRyaWVzIHkgYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJylcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEBjb3VudHJpZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgICAuaHRtbCAoZCkgPT4gQGdldENvdW50cnlOYW1lIGRcbiAgICAjIGRyYXcgY2VsbHNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbC1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIC5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5kYXRhKEBjZWxsc0RhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsJ1xuICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvcihkLnZhbHVlKVxuICAgICAgLm9uICAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgIC5vbiAgICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICAgLmNhbGwgIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgICMgZHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhIEBkYXRhLm1hcCgoZCkgLT4ge2NvZGU6IGQuY29kZSwgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvbn0pLmZpbHRlcigoZCkgLT4gIWlzTmFOIGQueWVhcilcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc2NhbGVzXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGNvbnRhaW5lcnNcbiAgICBAY29udGFpbmVyXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQgKyAncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuY2FsbCBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLngtYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueS1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRDZWxsRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IEB4KGQueWVhcikrJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb3VudHJ5KSsncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIHNldE1hcmtlckRpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiAoQHkoZC5jb2RlKS0xKSsncHgnXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBpZiBkLnllYXIgPCBAeWVhcnNbMF0gdGhlbiBAeChAeWVhcnNbMF0pLTEgKyAncHgnIGVsc2UgaWYgZC55ZWFyIDwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0gdGhlbiBAeChkLnllYXIpLTErJ3B4JyBlbHNlIEB4LmJhbmR3aWR0aCgpK0B4KEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChAeS5iYW5kd2lkdGgoKSsxKSsncHgnXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIG9mZnNldCAgICAgICAgICAgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcblxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb3VudHJ5J1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnllYXInXG4gICAgICAuaHRtbCBkLnllYXJcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBpZiBkLnZhbHVlID09IDAgdGhlbiAwIGVsc2UgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcylcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBvZmZzZXQubGVmdCArIEB4LmJhbmR3aWR0aCgpICogMC41IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBvZmZzZXQudG9wIC0gKEB5LmJhbmR3aWR0aCgpICogMC41KSAtIEAkdG9vbHRpcC5oZWlnaHQoKVxuICAgICAgJ29wYWNpdHknOiAnMSdcbiAgICByZXR1cm5cblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG4gICAgcmV0dXJuXG5cbiAgZ2V0Q291bnRyeU5hbWU6IChjb2RlKSA9PlxuICAgIGNvdW50cnkgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb2RlXG4gICAgcmV0dXJuIGlmIGNvdW50cnlbMF0gdGhlbiBjb3VudHJ5WzBdLm5hbWUgZWxzZSAnJ1xuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5kRGF0YSA9IFswLDEwMCwyMDAsMzAwLDQwMF1cbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ3VsJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuc3R5bGUgJ21hcmdpbi1sZWZ0JywgLSgxNSpsZWdlbmREYXRhLmxlbmd0aCkrJ3B4J1xuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgnbGknKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IgZFxuICAgICAgICAuaHRtbCAoZCxpKSAtPiBpZiBpICE9IDAgdGhlbiBkIGVsc2UgJyZuYnNwJ1xuXG4gICAgIyMjXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0wLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcbiAgICAjIyNcblxuIyBWYWNjaW5lRGlzZWFzZUdyYXBoID0gKF9pZCkgLT5cbiMgICAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKVxuIyAgIFlfQVhJU19XSURUSCA9IDEwMFxuIyAgICMgTXVzdCBiZSB0aGUgYW1lIHZhbHVlIHRoYW4gI3ZhY2NpbmUtZGlzZWFzZS1ncmFwaCAkcGFkZGluZy1sZWZ0IHNjc3MgdmFyaWFibGVcbiMgICB0aGF0ID0gdGhpc1xuIyAgIGlkID0gX2lkXG4jICAgZGlzZWFzZSA9IHVuZGVmaW5lZFxuIyAgIHNvcnQgPSB1bmRlZmluZWRcbiMgICBsYW5nID0gdW5kZWZpbmVkXG4jICAgZGF0YSA9IHVuZGVmaW5lZFxuIyAgIGRhdGFQb3B1bGF0aW9uID0gdW5kZWZpbmVkXG4jICAgY3VycmVudERhdGEgPSB1bmRlZmluZWRcbiMgICBjZWxsRGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNvdW50cmllcyA9IHVuZGVmaW5lZFxuIyAgIHllYXJzID0gdW5kZWZpbmVkXG4jICAgY2VsbFNpemUgPSB1bmRlZmluZWRcbiMgICBjb250YWluZXIgPSB1bmRlZmluZWRcbiMgICB4ID0gdW5kZWZpbmVkXG4jICAgeSA9IHVuZGVmaW5lZFxuIyAgIHdpZHRoID0gdW5kZWZpbmVkXG4jICAgaGVpZ2h0ID0gdW5kZWZpbmVkXG4jICAgJGVsID0gdW5kZWZpbmVkXG4jICAgJHRvb2x0aXAgPSB1bmRlZmluZWRcbiMgICAjIFB1YmxpYyBNZXRob2RzXG5cbiMgICB0aGF0LmluaXQgPSAoX2Rpc2Vhc2UsIF9zb3J0KSAtPlxuIyAgICAgZGlzZWFzZSA9IF9kaXNlYXNlXG4jICAgICBzb3J0ID0gX3NvcnRcbiMgICAgICNjb25zb2xlLmxvZygnVmFjY2luZSBHcmFwaCBpbml0JywgaWQsIGRpc2Vhc2UsIHNvcnQpO1xuIyAgICAgJGVsID0gJCgnIycgKyBpZClcbiMgICAgICR0b29sdGlwID0gJGVsLmZpbmQoJy50b29sdGlwJylcbiMgICAgIGxhbmcgPSAkZWwuZGF0YSgnbGFuZycpXG4jICAgICB4ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICB5ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbChkMy5pbnRlcnBvbGF0ZU9yUmQpXG4jICAgICBpZiBkYXRhXG4jICAgICAgIGNsZWFyKClcbiMgICAgICAgc2V0dXBEYXRhKClcbiMgICAgICAgc2V0dXBHcmFwaCgpXG4jICAgICBlbHNlXG4jICAgICAgICMgTG9hZCBDU1ZzXG4jICAgICAgIGQzLnF1ZXVlKCkuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLmNzdicpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvZGF0YS9wb3B1bGF0aW9uLmNzdicpLmF3YWl0IG9uRGF0YVJlYWR5XG4jICAgICB0aGF0XG5cbiMgICB0aGF0Lm9uUmVzaXplID0gLT5cbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICB1cGRhdGVHcmFwaCgpXG4jICAgICB0aGF0XG5cbiMgICBvbkRhdGFSZWFkeSA9IChlcnJvciwgZGF0YV9jc3YsIHBvcHVsYXRpb25fY3N2KSAtPlxuIyAgICAgZGF0YSA9IGRhdGFfY3N2XG4jICAgICBkYXRhUG9wdWxhdGlvbiA9IHBvcHVsYXRpb25fY3N2XG4jICAgICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4jICAgICBkZWxldGUgZGF0YS5jb2x1bW5zXG4jICAgICAjIFdlIGNhbiBkZWZpbmUgYSBmaWx0ZXIgZnVuY3Rpb24gdG8gc2hvdyBvbmx5IHNvbWUgc2VsZWN0ZWQgY291bnRyaWVzXG4jICAgICBpZiB0aGF0LmZpbHRlclxuIyAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIodGhhdC5maWx0ZXIpXG4jICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9IGQuZGlzZWFzZS50b0xvd2VyQ2FzZSgpXG4jICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiMgICAgICAgZC5jYXNlcyA9IHt9XG4jICAgICAgIGQudmFsdWVzID0ge31cbiMgICAgICAgIyBzZXQgdmFsdWUgZXMgY2FzZXMgLzEwMDAgaW5oYWJpdGFudHNcbiMgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBwb3B1bGF0aW9uX2Nzdi5maWx0ZXIoKGNvdW50cnkpIC0+XG4jICAgICAgICAgY291bnRyeS5jb2RlID09IGQuY29kZVxuIyAgICAgICApXG4jICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiMgICAgICAgICB5ZWFyID0gMTk4MFxuIyAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4jICAgICAgICAgICBpZiBkW3llYXJdXG4jICAgICAgICAgICAgIHBvcHVsYXRpb24gPSArcG9wdWxhdGlvbkl0ZW1bMF1beWVhcl1cbiMgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSAxMDAwICogKCtkW3llYXJdIC8gcG9wdWxhdGlvbik7XG4jICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4jICAgICAgICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSAxMDAwICogK2RbeWVhcl0gLyBwb3B1bGF0aW9uXG4jICAgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgZFt5ZWFyXSk7XG4jICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiMgICAgICAgICAgIHllYXIrK1xuIyAgICAgICBlbHNlXG4jICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiMgICAgICAgIyBHZXQgdG90YWwgY2FzZXMgYnkgY291bnRyeSAmIGRpc2Vhc2VcbiMgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT5cbiMgICAgICAgICBhICsgYlxuIyAgICAgICApLCAwKVxuIyAgICAgICByZXR1cm5cbiMgICAgIHNldHVwRGF0YSgpXG4jICAgICBzZXR1cEdyYXBoKClcbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBEYXRhID0gLT5cbiMgICAgICMgRmlsdGVyIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuIyAgICAgY3VycmVudERhdGEgPSBkYXRhLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZC5kaXNlYXNlID09IGRpc2Vhc2UgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuIyAgICAgKVxuIyAgICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgY291bnRyeSBuYW1lc1xuIyAgICAgY291bnRyaWVzID0gY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICBkLmNvZGVcbiMgICAgIClcbiMgICAgICMgR2V0IGFycmF5IG9mIHllYXJzXG4jICAgICBtaW5ZZWFyID0gZDMubWluKGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWluIGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICBtYXhZZWFyID0gZDMubWF4KGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWF4IGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICB5ZWFycyA9IGQzLnJhbmdlKG1pblllYXIsIG1heFllYXIsIDEpXG4jICAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4jICAgICAjY29uc29sZS5sb2cobWluWWVhciwgbWF4WWVhciwgeWVhcnMpO1xuIyAgICAgI2NvbnNvbGUubG9nKGNvdW50cmllcyk7XG4jICAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuIyAgICAgY2VsbHNEYXRhID0gW11cbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuIyAgICAgICAgIGNlbGxzRGF0YS5wdXNoXG4jICAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiMgICAgICAgICAgIG5hbWU6IGQubmFtZVxuIyAgICAgICAgICAgeWVhcjogdmFsdWVcbiMgICAgICAgICAgIGNhc2VzOiBkLmNhc2VzW3ZhbHVlXVxuIyAgICAgICAgICAgdmFsdWU6IGQudmFsdWVzW3ZhbHVlXVxuIyAgICAgICByZXR1cm5cblxuIyAgICAgIyMjXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuIyAgICAgICB2YXIgY291bnRlciA9IDA7XG4jICAgICAgIHllYXJzLmZvckVhY2goZnVuY3Rpb24oeWVhcil7XG4jICAgICAgICAgaWYgKGRbeWVhcl0pXG4jICAgICAgICAgICBjb3VudGVyKys7XG4jICAgICAgIH0pO1xuIyAgICAgICBpZihjb3VudGVyIDw9IDIwKSAvLyB5ZWFycy5sZW5ndGgvMilcbiMgICAgICAgICBjb25zb2xlLmxvZyhkLm5hbWUgKyAnIGhhcyBvbmx5IHZhbHVlcyBmb3IgJyArIGNvdW50ZXIgKyAnIHllYXJzJyk7XG4jICAgICB9KTtcbiMgICAgICMjI1xuXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwR3JhcGggPSAtPlxuIyAgICAgIyBHZXQgZGltZW5zaW9ucyAoaGVpZ2h0IGlzIGJhc2VkIG9uIGNvdW50cmllcyBsZW5ndGgpXG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIHguZG9tYWluKHllYXJzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgd2lkdGhcbiMgICAgIF1cbiMgICAgIHkuZG9tYWluKGNvdW50cmllcykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIGhlaWdodFxuIyAgICAgXVxuIyAgICAgI2NvbG9yLmRvbWFpbihbZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSwgMF0pO1xuIyAgICAgY29sb3IuZG9tYWluIFtcbiMgICAgICAgMFxuIyAgICAgICA0XG4jICAgICBdXG4jICAgICAjY29uc29sZS5sb2coJ01heGltdW0gY2FzZXMgdmFsdWU6ICcrIGQzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSkpO1xuIyAgICAgIyBBZGQgc3ZnXG4jICAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnICsgaWQgKyAnIC5ncmFwaC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4JylcbiMgICAgICMgRHJhdyBjZWxsc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4Jykuc2VsZWN0QWxsKCcuY2VsbCcpLmRhdGEoY2VsbHNEYXRhKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbCcpLnN0eWxlKCdiYWNrZ3JvdW5kJywgKGQpIC0+XG4jICAgICAgIGNvbG9yIGQudmFsdWVcbiMgICAgICkuY2FsbChzZXRDZWxsRGltZW5zaW9ucykub24oJ21vdXNlb3ZlcicsIG9uTW91c2VPdmVyKS5vbiAnbW91c2VvdXQnLCBvbk1vdXNlT3V0XG4jICAgICAjIERyYXcgeWVhcnMgeCBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd4LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoeWVhcnMuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkICUgNSA9PSAwXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ2xlZnQnLCAoZCkgLT5cbiMgICAgICAgeChkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZFxuIyAgICAgIyBEcmF3IGNvdW50cmllcyB5IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YShjb3VudHJpZXMpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgndG9wJywgKGQpIC0+XG4jICAgICAgIHkoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGdldENvdW50cnlOYW1lIGRcbiMgICAgICMgRHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5zZWxlY3RBbGwoJy5tYXJrZXInKS5kYXRhKGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAge1xuIyAgICAgICAgIGNvZGU6IGQuY29kZVxuIyAgICAgICAgIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgfVxuIyAgICAgKS5maWx0ZXIoKGQpIC0+XG4jICAgICAgICFpc05hTihkLnllYXIpXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnbWFya2VyJykuY2FsbCBzZXRNYXJrZXJEaW1lbnNpb25zXG4jICAgICByZXR1cm5cblxuIyAgIGNsZWFyID0gLT5cbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnJlbW92ZSgpXG4jICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcuYXhpcycpLnJlbW92ZSgpXG4jICAgICByZXR1cm5cblxuXG5cbiIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG5cbiAgZ2V0TGVnZW5kRGF0YTogPT5cbiAgICByZXR1cm4gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ1NjYXR0ZXJwbG90IEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgN1xuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgN1xuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxMlxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnhdID0gK2RbQG9wdGlvbnMua2V5LnhdXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZVBvdygpXG4gICAgICAuZXhwb25lbnQoMC4yNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCgpXG4gICAgICAgIC5yYW5nZSBAZ2V0Q29sb3JSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdKV1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0Q29sb3JSYW5nZTogPT5cbiAgICByZXR1cm4gWycjQzlBRDRCJywgJyNCQkQ2NDYnLCAnIzYzQkEyRCcsICcjMzRBODkzJywgJyMzRDkxQUQnLCAnIzVCOEFDQicsICcjQkE3REFGJywgJyNCRjZCODAnLCAnI0Y0OUQ5RCcsICcjRTI1NDUzJywgJyNCNTY2MzEnLCAnI0UyNzczQicsICcjRkZBOTUxJywgJyNGNENBMDAnXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBkMy5leHRlbnQgQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5jb2xvcl1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBzdXBlcigpXG4gICAgIyBzZXQgY29sb3IgZG9tYWluXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgc2l6ZSBkb21haW5cbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgcG9pbnRzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RJZFxuICAgICAgLmF0dHIgJ3InLCBAZ2V0RG90U2l6ZVxuICAgICAgLnN0eWxlICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuICAgICMgZHJhdyBsYWJlbHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdC1sYWJlbCdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RMYWJlbElkXG4gICAgICAuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuMzc1ZW0nXG4gICAgICAudGV4dCBAZ2V0RG90TGFiZWxUZXh0XG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgICMgdXBkYXRlIGRvdHMgcG9zaXRpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldERvdExhYmVsc0RpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIGdldERvdElkOiAoZCkgPT5cbiAgICByZXR1cm4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGdldERvdExhYmVsSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90TGFiZWxUZXh0OiAoZCkgPT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90U2l6ZTogKGQpID0+XG4gICAgaWYgQHNpemVcbiAgICAgIHJldHVybiBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAb3B0aW9ucy5kb3RTaXplXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgaWYgQGNvbG9yXG4gICAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsXG5cbiAgc2V0RG90c0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgc2V0RG90TGFiZWxzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBvdmVycmlkIHggYXhpcyBwb3NpdGlvbmluZ1xuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gMTVcbiAgICAgIG9wYWNpdHk6IDFcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS14J1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkueF1cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUteSdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LnldXG5cbiAgICAiLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3REaXNjcmV0ZUdyYXBoIGV4dGVuZHMgd2luZG93LlNjYXR0ZXJwbG90R3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBEaXNjcmV0ZSBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXNcbiAgICBAeCA9IGQzLnNjYWxlTGluZWFyKClcbiAgICBAeSA9IGQzLnNjYWxlUG9pbnQoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHkgc2NhbGUgZG9tYWluXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgZ2V0IGRpbWVuc2lvbnNcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHN2Zy5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZSByYW5nZVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBzdXBlcigpXG4gICAgIyBkcmF3IGRvdCBsaW5lc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxpbmUnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QtbGluZSdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RMaW5lSWRcbiAgICAgIC5zdHlsZSAnc3Ryb2tlJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RMaW5lc0RpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgdmFjY2luZXMgPSBkMy5uZXN0KClcbiAgICAgIC5rZXkgKGQpIC0+IGQudmFjY2luZVxuICAgICAgLmVudHJpZXMgQGRhdGFcbiAgICB2YWNjaW5lcy5zb3J0IChhLGIpIC0+IGlmIGEua2V5ID4gYi5rZXkgdGhlbiAxIGVsc2UgLTFcbiAgICBkMy5zZWxlY3QoJyMnK0BpZCsnIC5ncmFwaC1sZWdlbmQgdWwnKS5zZWxlY3RBbGwoJ2xpJylcbiAgICAgIC5kYXRhKHZhY2NpbmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdsZWdlbmQtaXRlbS0nK2Qua2V5XG4gICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgLT4gZC52YWx1ZXNbMF0udmFjY2luZV9jb2xvciAjQGNvbG9yIGQua2V5XG4gICAgICAuaHRtbCAoZCkgLT4gZC52YWx1ZXNbMF0udmFjY2luZV9uYW1lXG4gICAgICAub24gJ21vdXNlb3ZlcicsIChkKSA9PiBAaGlnaGxpZ2h0VmFjY2luZXMgZC5rZXlcbiAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBpZiBAeVxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gQHkuZG9tYWluKCkubGVuZ3RoICogMzBcbiAgICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBsaW5lcyBzaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuY2FsbCBAc2V0RG90TGluZXNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknXG5cbiAgZ2V0RG90SWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdKyctJytkW0BvcHRpb25zLmtleS5jb2xvcl1cbiAgXG4gIGdldERvdExhYmVsSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdKyctJytkW0BvcHRpb25zLmtleS5jb2xvcl1cblxuICBnZXREb3RMaW5lSWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LWxpbmUtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbFRleHQ6IChkKSAtPiBcbiAgICByZXR1cm4gJydcblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMaW5lc0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiAwXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IEB5IGRbQG9wdGlvbnMua2V5LnldXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvbiAoYWRkIGxlZ2VuZCBoZWlnaHQpXG4gICAgb2Zmc2V0VG9wID0gaWYgQG9wdGlvbnMubGVnZW5kIHRoZW4gJCgnIycrQGlkKycgLmdyYXBoLWxlZ2VuZCcpLmhlaWdodCgpIGVsc2UgMFxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBvZmZzZXRUb3AgKyBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gMTVcbiAgICAgIG9wYWNpdHk6IDFcbiAgICAjIGhpZ2h0bGlnaHQgc2VsZWN0ZWQgdmFjY2luZVxuICAgIEBoaWdobGlnaHRWYWNjaW5lcyBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KS5kYXRhKClbMF1bQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHN1cGVyKGQpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxpbmUnKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBkMy5zZWxlY3RBbGwoJyMnK0BpZCsnIC5ncmFwaC1sZWdlbmQgbGknKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcblxuICBoaWdobGlnaHRWYWNjaW5lczogKHZhY2NpbmUpIC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5maWx0ZXIgKGQpID0+IHJldHVybiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gdmFjY2luZVxuICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuZmlsdGVyIChkKSA9PiByZXR1cm4gZFtAb3B0aW9ucy5rZXkuY29sb3JdID09IHZhY2NpbmVcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgIyBzZXQgc2VsZWN0ZWQgZG90cyBvbiB0b3BcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuc29ydCAoYSxiKSA9PiBpZiBhW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gdmFjY2luZSB0aGVuIDEgZWxzZSAtMVxuICAgICMgc2V0IGxlZ2VuZFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgZDMuc2VsZWN0QWxsKCcjJytAaWQrJyAuZ3JhcGgtbGVnZW5kIGxpJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgdHJ1ZVxuICAgICAgZDMuc2VsZWN0QWxsKCcjJytAaWQrJyAjbGVnZW5kLWl0ZW0tJyt2YWNjaW5lKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSAtPlxuICAgIGRvc2VzRm9ybWF0ID0gZDMuZm9ybWF0KCcuMHMnKVxuICAgIHByaWNlc0Zvcm1hdCA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhY2NpbmUnXG4gICAgICAuaHRtbCBkLnZhY2NpbmVfbmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5wcmljZSdcbiAgICAgIC5odG1sIHByaWNlc0Zvcm1hdChkLnByaWNlKVxuICAgIGNvbXBhbnkgPSAnJ1xuICAgIGlmIGQuY29tcGFueVxuICAgICAgY29tcGFueSA9IGQuY29tcGFueVxuICAgICAgaWYgZC5jb21wYW55MlxuICAgICAgICBjb21wYW55ICs9ICcsICcrZC5jb21wYW55MlxuICAgICAgaWYgZC5jb21wYW55M1xuICAgICAgICBjb21wYW55ICs9ICcsICcrZC5jb21wYW55M1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb21wYW55J1xuICAgICAgLmh0bWwgY29tcGFueVxuICAgICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdFZQSEdyYXBoIGV4dGVuZHMgd2luZG93LlNjYXR0ZXJwbG90R3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIGxhbmcsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgb3B0aW9ucy5kb3RTaXplID0gN1xuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IDNcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSAxOFxuICAgIEBsYW5nID0gbGFuZ1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjEyNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCgpXG4gICAgICAgIC5yYW5nZSBAZ2V0Q29sb3JSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIFsxMDI0LCA0MDM0LCAxMjQ3NF1cbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFsxNSwgMzAsIDQ1LCA2MCwgNzUsIDkwXVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCAxMDIwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgOTBdXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIGlmIGRbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSAnMScgdGhlbiAnIzAwNzk3ZCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gJzAnIHRoZW4gJyNENjRCMDUnIGVsc2UgJyNhYWEnICAgICAgIFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgcG9pbnRzXG4gICAgc3VwZXIoKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuICAgIEBzZXRYTGVnZW5kKClcbiAgICByZXR1cm4gQFxuXG4gIHNldFhMZWdlbmQ6IC0+XG4gICAgaW5jb21lR3JvdXBzID0gW0B4LmRvbWFpbigpWzBdLCAxMDI2LCA0MDM2LCAxMjQ3NiwgQHguZG9tYWluKClbMV1dXG4gICAgQCRlbC5maW5kKCcueC1sZWdlbmQgbGknKS5lYWNoIChpLCBlbCkgPT5cbiAgICAgIHZhbCA9IDEwMCAqIChAeChpbmNvbWVHcm91cHNbaSsxXSkgLSBAeChpbmNvbWVHcm91cHNbaV0pKSAvIEB3aWR0aFxuICAgICAgJChlbCkud2lkdGggdmFsKyclJ1xuXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgYW5ub3RhdGlvbnMgPSBbXG4gICAgICB7XG4gICAgICAgICdjeCc6IDAuMjMqQGhlaWdodFxuICAgICAgICAnY3knOiAwLjE3KkBoZWlnaHRcbiAgICAgICAgJ3InOiAwLjIyKkBoZWlnaHRcbiAgICAgICAgJ3RleHQnOiBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ0xvcyBwYcOtc2VzIGNvbiBtw6FzIG11ZXJ0ZXMgcG9yIGPDoW5jZXIgZGUgY8OpcnZpeCBzb24gdGFtYmnDqW4gbG9zIG3DoXMgcG9icmVzIHkgbm8gaGFiw61hbiBpbmNsdWlkbyBsYSB2YWN1bmEgZW4gMjAxNScgZWxzZSAnQ291bnRyaWVzIHdpdGggaGlnaGVzdCBtb3J0YWxpdHkgZnJvbSBjZXJ2aWNhbCBjYW5jZXIgYXJlIGFsc28gdGhlIHBvb3Jlc3QgYW5kIGhhZCBub3QgaW50cm9kdWNlZCB0aGUgdmFjY2luZSBieSAyMDE1J1xuICAgICAgICAndGV4dFdpZHRoJzogMC4zOCpAd2lkdGhcbiAgICAgICAgJ3RleHRPZmZzZXQnOiBbMC4yNSpAaGVpZ2h0LCAwXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ2N4JzogMC4yOCpAaGVpZ2h0XG4gICAgICAgICdjeSc6IDAuNDYqQGhlaWdodFxuICAgICAgICAncic6IDAuMDcyKkBoZWlnaHRcbiAgICAgICAgJ3RleHQnOiBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ1PDs2xvIHVub3MgcG9jb3MgcGHDrXNlcyBkZSByZW50YXMgYmFqYXMgaW5jbHV5ZXJvbiBsYSB2YWN1bmEgZW4gc3VzIHByb2dyYW1hcywgZ3JhY2lhcyBhIGxhIGF5dWRhIGV4dGVybmEgZGUgR0FWSScgZWxzZSAnT25seSBhIGZldyBsb3ctaW5jb21lIGNvdW50cmllcyBoYWQgaW50cm9kdWNlZCB0aGUgdmFjY2luZSBpbiB0aGVpciBwcm9ncmFtbWVzLCB0aGFua3MgdG8gR0FWSVxcJ3MgZXh0ZXJuYWwgYXNzaXN0YW5jZSdcbiAgICAgICAgJ3RleHRXaWR0aCc6IDAuMzYqQHdpZHRoXG4gICAgICAgICd0ZXh0T2Zmc2V0JzogWzAuMTgqQGhlaWdodCwgMF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdjeCc6IEB3aWR0aCAtIDAuMzYqQGhlaWdodFxuICAgICAgICAnY3knOiBAaGVpZ2h0IC0gMC4xMSpAaGVpZ2h0XG4gICAgICAgICdyJzogMC4xNipAaGVpZ2h0XG4gICAgICAgICd0ZXh0JzogaWYgQGxhbmcgPT0gJ2VzJyB0aGVuICdHcmFuIHBhcnRlIGRlIGxvcyBwYcOtc2VzIHF1ZSBjdWVudGFuIGNvbiBsYSB2YWN1bmEgZW4gc3VzIHByb2dyYW1hcyBzb24gcGHDrXNlcyByaWNvcyBjb24gdW5hIGJhamEgbW9ydGFsaWRhZCBwb3IgY8OhbmNlciBkZSBjw6lydml4JyBlbHNlICdNb3N0IGNvdW50cmllcyB0aGF0IGhhdmUgdGhlIHZhY2NpbmUgaW4gdGhlaXIgcHJvZ3JhbW1lcyBhcmUgcmljaCBjb3VudHJpZXMgd2l0aCBsb3cgbW9ydGFsaXR5IGZyb20gY2VydmljYWwgY2FuY2VyJ1xuICAgICAgICAndGV4dFdpZHRoJzogMC4zOCpAd2lkdGhcbiAgICAgICAgJ3RleHRPZmZzZXQnOiBbMCwgLTAuMipAaGVpZ2h0XVxuICAgICAgfVxuICAgIF1cbiAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBhbm5vdGF0aW9uc1xuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBmb3JtYXRGbG9hdCA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnZhY2NpbmUgc3BhbidcbiAgICAgIC5jc3MgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudmFjY2luZS0nK2RbQG9wdGlvbnMua2V5LmNvbG9yXVxuICAgICAgLmNzcyAnZGlzcGxheScsICdibG9jaydcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS5pZF1cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUteSdcbiAgICAgIC5odG1sIGZvcm1hdEZsb2F0KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICIsIiMgTWFpbiBzY3JpcHQgZm9yIHZhY2NpbmVzIHByaWNlcyBhcnRpY2xlXG5jbGFzcyB3aW5kb3cuVmFjY2luZXNQcmljZXNcblxuICB2YWNjaW5lc19uYW1lczogXG4gICAgZXM6XG4gICAgICAnQkNHJzogJ1R1YmVyY3Vsb3NpcyAoQkNHKSdcbiAgICAgICdEVGFQJzogJ0RpZnRlcmlhLCB0w6l0YW5vcyB5IHRvcyBmZXJpbmEgYWNlbHVsYXIgKERUYVApJ1xuICAgICAgJ0RUUCc6ICdEaWZ0ZXJpYSwgdMOpdGFub3MgeSB0b3MgZmVyaW5hIChEVFApJ1xuICAgICAgJ0RUUGEtSVBWLUhpYic6ICdQZW50YXZhbGVudGUgKERUUCwgcG9saW8gZSBIaWIpJ1xuICAgICAgJ0hlcEItcGVkacOhdHJpY2EnOiAnSGVwYXRpdGlzIEIgcGVkacOhdHJpY2EnXG4gICAgICAnSVBWJzogJ1BvbGlvIChJUFYpJ1xuICAgICAgJ01NUic6ICdTYXJhbXBpw7NuLCBwYXBlcmFzIHkgcnViZW9sYSdcbiAgICAgICdwbmV1bW8xMyc6ICdOZXVtb2NvY28gKDEzKSdcbiAgICAgICdUZGFwJzogJ1TDqXRhbm9zLCBkaWZ0ZXJpYSB5IHRvcyBmZXJpbmEgYWNlbHVsYXIgcmVkdWNpZGEgKFRkYXApJ1xuICAgICAgJ1ZQSCc6ICdWaXJ1cyBkZWwgcGFwaWxvbWEgaHVtYW5vIChWUEgpJ1xuICAgICAgJ1ZQSC1DZXJ2YXJpeDInOiAnVlBIIENlcnZhcml4MidcbiAgICAgICdWUEgtR2FyZGFzaWw0JzogJ1ZQSCBHYXJkYXNpbDQnXG4gICAgICAnVlBILUdhcmRhc2lsOSc6ICdWUEggR2FyZGFzaWw5J1xuICAgIGVuOlxuICAgICAgJ0JDRyc6ICdUdWJlcmN1bG9zaXMgKEJDRyknXG4gICAgICAnRFRhUCc6ICdEaXBodGVyaWEsIHRldGFudXMgYW5kIGFjZWxsdWxhciBwZXJ0dXNzaXMgKERUYVApJ1xuICAgICAgJ0RUUCc6ICdEaXBodGVyaWEsIHRldGFudXMgYW5kIHBlcnR1c3NpcyAoRFRQKSdcbiAgICAgICdEVFBhLUlQVi1IaWInOiAnUGVudGF2YWxlbnQgKERUUCwgcG9saW8gYW5kIEhpYiknXG4gICAgICAnSGVwQi1wZWRpw6F0cmljYSc6ICdIZXBhdGl0aXMgQiBwZWRpYXRyaWMnXG4gICAgICAnSVBWJzogJ1BvbGlvIChJUFYpJ1xuICAgICAgJ01NUic6ICdNZWFzbGVzLCBtdW1wcyBhbmQgcnViZWxsYSdcbiAgICAgICdwbmV1bW8xMyc6ICdQbmV1bW9jb2NjdXMgKDEzKSdcbiAgICAgICdUZGFwJzogJ1RldGFudXMsIHJlZHVjZWQgZGlwaHRoZXJpYSBhbmQgcmVkdWNlZCBhY2VsbHVsYXIgcGVydHVzc2lzIChUZGFwKSdcbiAgICAgICdWUEgnOiAnSHVtYW4gcGFwaWxvbWF2aXJ1cyAoSFBWKSdcbiAgICAgICdWUEgtQ2VydmFyaXgyJzogJ1ZQSCBDZXJ2YXJpeDInXG4gICAgICAnVlBILUdhcmRhc2lsNCc6ICdWUEggR2FyZGFzaWw0J1xuICAgICAgJ1ZQSC1HYXJkYXNpbDknOiAnVlBIIEdhcmRhc2lsOSdcblxuICB2YWNjaW5lc19jb2xvcnM6XG4gICAgJ0JDRyc6ICcjQzlBRDRCJ1xuICAgICdEVGFQJzogJyM2M0JBMkQnXG4gICAgJ0RUUCc6ICcjMzRBODkzJ1xuICAgICdEVFBhLUlQVi1IaWInOiAnI0JCRDY0NidcbiAgICAnSGVwQi1wZWRpw6F0cmljYSc6ICcjM0Q5MUFEJ1xuICAgICdJUFYnOiAnIzVCOEFDQidcbiAgICAnTU1SJzogJyNFMjc3M0InXG4gICAgJ3BuZXVtbzEzJzogJyNCQTdEQUYnXG4gICAgJ1RkYXAnOiAnI0Y0OUQ5RCdcbiAgICAnVlBILUNlcnZhcml4Mic6ICcjRkZBOTUxJ1xuICAgICdWUEgtR2FyZGFzaWw0JzogJyNCNTY2MzEnXG4gICAgJ1ZQSC1HYXJkYXNpbDknOiAnI0UyNTQ1MydcblxuICBjb25zdHJ1Y3RvcjogKF9sYW5nLCBfYmFzZXVybCwgX2RhdGF1cmwpIC0+XG4gICAgQGxhbmcgPSBfbGFuZ1xuICAgICMgbG9hZCBkYXRhXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgX2Jhc2V1cmwrX2RhdGF1cmxcbiAgICAgIC5kZWZlciBkMy5jc3YsIF9iYXNldXJsKycvZGF0YS9nZHAuY3N2J1xuICAgICAgIy5kZWZlciBkMy5qc29uLCAnaHR0cDovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgICAuYXdhaXQgQG9uRGF0YUxvYWRlZFxuXG4gIG9uRGF0YUxvYWRlZDogKGVycm9yLCBfZGF0YSwgX2NvdW50cmllcykgPT5cbiAgICBAZGF0YSA9IF9kYXRhXG4gICAgQGNvdW50cmllcyA9IF9jb3VudHJpZXNcbiAgICBAcGFyc2VEYXRhKClcbiAgICAjIGFsbCB2YWNjaW5lcyBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtYWxsLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLWFsbC1ncmFwaCcsIEBkYXRhLCB0cnVlXG4gICAgIyBvcmdhbml6YXRpb25zIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy1vcmdhbml6YXRpb25zLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgZGF0YU9yZ2FuaXphdGlvbnMgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQuY291bnRyeSA9PSAnTVNGJyB8fCBkLmNvdW50cnkgPT0gJ1BBSE8nIHx8IGQuY291bnRyeSA9PSAnVU5JQ0VGJ1xuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLW9yZ2FuaXphdGlvbnMtZ3JhcGgnLCBkYXRhT3JnYW5pemF0aW9ucywgdHJ1ZVxuICAgICMgVGRhcCBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtdGRhcC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIGRhdGFUZGFwID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLnZhY2NpbmUgPT0gJ1RkYXAnXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtdGRhcC1ncmFwaCcsIGRhdGFUZGFwLCBmYWxzZVxuICAgICMgSVBWIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy1pcHYtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBkYXRhSVBWID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLnZhY2NpbmUgPT0gJ0lQVicgYW5kIGQuY291bnRyeSAhPSAnTVNGJyBhbmQgZC5jb3VudHJ5ICE9ICdQQUhPJyBhbmQgZC5jb3VudHJ5ICE9ICdVTklDRUYnXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtaXB2LWdyYXBoJywgZGF0YUlQViwgZmFsc2VcbiAgICAjIFZQSCBwcmljZXNcbiAgICBpZiAkKCcjdmFjY2luZS1wcmljZXMtdnBoLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgQHNldHVwU2NhdHRlcnBsb3QgJ3ZhY2NpbmUtcHJpY2VzLXZwaC1ncmFwaCcsIEBkYXRhLCB0cnVlXG4gICAgIyBQSUIgY291bnRyaWVzXG4gICAgaWYgJCgnI3BpYi1jb3VudHJpZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBwaWJEYXRhID0gZDMubmVzdCgpXG4gICAgICAgIC5rZXkgKGQpIC0+IGQuY291bnRyeVxuICAgICAgICAuZW50cmllcyBAZGF0YVxuICAgICAgcGliRGF0YSA9IHBpYkRhdGEubWFwIChkKSAtPlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBkLmtleVxuICAgICAgICAgIG5hbWU6IGQudmFsdWVzWzBdLm5hbWVcbiAgICAgICAgICBnZHA6IGQudmFsdWVzWzBdLmdkcCowLjkzN1xuICAgICAgICB9XG4gICAgICBwaWJEYXRhID0gcGliRGF0YVxuICAgICAgICAuZmlsdGVyIChkKSAtPiBkLmdkcCA+IDBcbiAgICAgICAgLnNvcnQgKGEsYikgLT4gYi5nZHAgLSBhLmdkcFxuICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKCdwaWItY291bnRyaWVzLWdyYXBoJyxcbiAgICAgICAgbGFiZWw6XG4gICAgICAgICAgZm9ybWF0OiAoZCkgLT5cbiAgICAgICAgICAgIGYgPSBkMy5mb3JtYXQoJyxkJylcbiAgICAgICAgICAgIHJldHVybiBmKGQpKyfigqwnXG4gICAgICAgIG1hcmdpbjpcbiAgICAgICAgICByaWdodDogMTBcbiAgICAgICAgICBsZWZ0OiAxMFxuICAgICAgICBrZXk6XG4gICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgeTogJ2dkcCdcbiAgICAgICAgICBpZDogJ2lkJylcbiAgICAgIGdyYXBoLnNldERhdGEgcGliRGF0YVxuICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICB2YWNjaW5lcyA9IFsncG5ldW1vMTMnLCdCQ0cnLCdJUFYnLCdNTVInLCdIZXBCLXBlZGnDoXRyaWNhJywnVlBILUNlcnZhcml4MicsJ1ZQSC1HYXJkYXNpbDQnLCdWUEgtR2FyZGFzaWw5JywnRFRQYS1JUFYtSGliJywnRFRhUCcsJ1RkYXAnLCdEVFAnXVxuICAgICMgZmlsdGVyIGRhdGEgdG8gZ2V0IG9ubHkgc2VsZWN0ZWQgdmFjY2luZXNcbiAgICBAZGF0YSA9IEBkYXRhLmZpbHRlciAoZCkgLT4gdmFjY2luZXMuaW5kZXhPZihkLnZhY2NpbmUpICE9IC0xXG4gICAgIyBqb2luIGRhdGEgJiBjb3VudHJpZXMgZ2RwIFxuICAgIEBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICBjb3VudHJ5ID0gQGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvdW50cnlcbiAgICAgIGQucHJpY2UgPSArZC5wcmljZVxuICAgICAgZC52YWNjaW5lX25hbWUgPSBpZiBAdmFjY2luZXNfbmFtZXNbQGxhbmddW2QudmFjY2luZV0gdGhlbiBAdmFjY2luZXNfbmFtZXNbQGxhbmddW2QudmFjY2luZV0gZWxzZSBkLnZhY2NpbmVcbiAgICAgIGQudmFjY2luZV9jb2xvciA9IEB2YWNjaW5lc19jb2xvcnNbZC52YWNjaW5lXVxuICAgICAgaWYgY291bnRyeVswXVxuICAgICAgICBkLm5hbWUgPSBkWyduYW1lXycrQGxhbmddXG4gICAgICAgIGQuZ2RwID0gY291bnRyeVswXS52YWx1ZVxuICAgICAgZWxzZVxuICAgICAgICBkLm5hbWUgPSBkWyduYW1lXycrQGxhbmddXG4gICAgICAgIGQuZ2RwID0gMFxuICAgICMgc29ydCBkYXRhIGJ5IGdkcFxuICAgIEBkYXRhLnNvcnQgKGEsYikgLT4gYS5nZHAgLSBiLmdkcFxuXG4gIHNldHVwU2NhdHRlcnBsb3Q6IChfaWQsIF9kYXRhLCBfbGVnZW5kKSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdERpc2NyZXRlR3JhcGgoX2lkLFxuICAgICAgbGVnZW5kOiBfbGVnZW5kXG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogNVxuICAgICAgICByaWdodDogNVxuICAgICAgICBsZWZ0OiA2MFxuICAgICAgICBib3R0b206IDIwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICdwcmljZSdcbiAgICAgICAgeTogJ25hbWUnXG4gICAgICAgIGlkOiAnY291bnRyeSdcbiAgICAgICAgY29sb3I6ICd2YWNjaW5lJylcbiAgICBncmFwaC55QXhpcy50aWNrUGFkZGluZyAxMlxuICAgIGdyYXBoLnhBeGlzXG4gICAgICAudGlja3MgNVxuICAgICAgLnRpY2tQYWRkaW5nIDEwXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsn4oKsJ1xuICAgICMgb3ZlcmRyaXZlIGNvbG9yIGZpbGwgbWV0aG9kXG4gICAgZ3JhcGguZ2V0RG90RmlsbCA9IChkKSAtPiBkLnZhY2NpbmVfY29sb3JcbiAgICAjIHNldCBkYXRhXG4gICAgZ3JhcGguc2V0RGF0YSBfZGF0YVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcbiIsIiMgTWFpbiBzY3JpcHQgZm9yIHZhY2NpbmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgIyBsaXN0IG9mIGV4Y2x1ZGVkIGNvdW50cmllcyBjb2RlcyAoY291bnRyaWVzIHdpdGggbGVzcyB0aGFuIDMwMC4wMDAgaW5oYWJpdGFudHMgaW4gMjAxNSlcbiAgZXhjbHVkZWRDb3VudHJpZXMgPSBbJ05JVScsJ0NPSycsJ1RVVicsJ05SVScsJ1BMVycsJ1ZHQicsJ01BRicsJ1NNUicsJ0dJQicsJ1RDQScsJ0xJRScsJ01DTycsJ1NYTScsJ0ZSTycsJ01ITCcsJ01OUCcsJ0FTTScsJ0tOQScsJ0dSTCcsJ0NZJywnQk1VJywnQU5EJywnRE1BJywnSU1OJywnQVRHJywnU1lDJywnVklSJywnQUJXJywnRlNNJywnVE9OJywnR1JEJywnVkNUJywnS0lSJywnQ1VXJywnQ0hJJywnR1VNJywnTENBJywnU1RQJywnV1NNJywnVlVUJywnTkNMJywnUFlGJywnQlJCJ10gICAgICBcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIGZvcm1hdEZsb2F0ID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuXG4gICMgSW5pdCBUb29sdGlwc1xuICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpXG5cblxuICAjIGdldCBjb3VudHJ5IG5hbWUgYXV4aWxpYXIgbWV0aG9kXG4gIGdldENvdW50cnlOYW1lID0gKGNvdW50cmllcywgY29kZSwgbGFuZykgLT5cbiAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvZGVcbiAgICBpZiBpdGVtXG4gICAgICBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBjb2RlXG5cbiAgIyBWaWRlbyBvZiBtYXAgcG9saW8gY2FzZXNcbiAgc2V0VmlkZW9NYXBQb2xpbyA9IC0+XG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLXBvbGlvLWNhc2VzLXRvdGFsLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNhc2VzID0ge31cbiAgICAgIGNhc2VzU3RyID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc29zJyBlbHNlICdjYXNlcydcbiAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgY2FzZXNbZC55ZWFyXSA9IGQudmFsdWVcbiAgICAgICMgQWRkIHlvdXR1YmUgdmlkZW9cbiAgICAgIHdyYXBwZXIgPSBQb3Bjb3JuLkhUTUxZb3VUdWJlVmlkZW9FbGVtZW50KCcjdmlkZW8tbWFwLXBvbGlvJylcbiAgICAgIHdyYXBwZXIuc3JjID0gJ2h0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvby1FelZPam5jNlE/Y29udHJvbHM9MCZzaG93aW5mbz0wJmhkPTEnXG4gICAgICBwb3Bjb3JuID0gUG9wY29ybih3cmFwcGVyKVxuICAgICAgbm90ZXMgPSAyMDE3IC0gMTk4MFxuICAgICAgeWVhckR1cmF0aW9uID0gMjcvKG5vdGVzKzEpICMgdmlkZW8gZHVyYXRpb24gaXMgMjdzZWNvbmRzIFxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBub3Rlc1xuICAgICAgICB5ZWFyID0gJycrKDE5ODAraSlcbiAgICAgICAgcG9wY29ybi5mb290bm90ZVxuICAgICAgICAgIHN0YXJ0OiAgeWVhckR1cmF0aW9uICogaVxuICAgICAgICAgIGVuZDogICAgaWYgaSA8IG5vdGVzLTEgdGhlbiB5ZWFyRHVyYXRpb24qKGkrMSkgZWxzZSAoeWVhckR1cmF0aW9uKihpKzEpKSsxXG4gICAgICAgICAgdGV4dDogICB5ZWFyICsgJzxicj48c3BhbiBjbGFzcz1cInZhbHVlXCI+JyArIGZvcm1hdEludGVnZXIoY2FzZXNbeWVhcl0pICsgJyAnICsgY2FzZXNTdHIgKyAnPC9zcGFuPidcbiAgICAgICAgICB0YXJnZXQ6ICd2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nXG4gICAgICAgIGkrK1xuICAgICAgIyBTaG93IGNvdmVyIHdoZW4gdmlkZW8gZW5kZWRcbiAgICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciAnZW5kZWQnLCAoZSkgLT5cbiAgICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLnNob3coKVxuICAgICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uLCAjdmlkZW8tbWFwLXBvbGlvIGlmcmFtZScpLmZhZGVUbyAwLCAwXG4gICAgICAgIHBvcGNvcm4uY3VycmVudFRpbWUgMFxuICAgICAgIyBTaG93IHZpZGVvIHdoZW4gcGxheSBidG4gY2xpY2tlZFxuICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1wbGF5LWJ0bicpLmNsaWNrIChlKSAtPlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcG9wY29ybi5wbGF5KClcbiAgICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVPdXQoKVxuICAgICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uLCAjdmlkZW8tbWFwLXBvbGlvIGlmcmFtZScpLmZhZGVUbyAzMDAsIDFcblxuXG4gICMgTWVhc2xlcyBXb3JsZCBNYXAgR3JhcGhcbiAgc2V0dXBNZWFzbGVzV29ybGRNYXBHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL21lYXNsZXMtY2FzZXMtd2hvLXJlZ2lvbnMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgICMgYWRkIGNhc2VzIHRvIGVhY2ggY291bnRyeVxuICAgICAgICBjb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSkgLT5cbiAgICAgICAgICByZWdpb24gPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5yZWdpb24gPT0gY291bnRyeS5yZWdpb25cbiAgICAgICAgICBpZiByZWdpb24ubGVuZ3RoID4gMFxuICAgICAgICAgICAgY291bnRyeS52YWx1ZSA9IHJlZ2lvblswXS5jYXNlcyoxMDAwMDBcbiAgICAgICAgICAgIGNvdW50cnkuY2FzZXMgPSByZWdpb25bMF0uY2FzZXNfdG90YWxcbiAgICAgICAgICAgIGNvdW50cnkubmFtZSA9IHJlZ2lvblswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgnbWVhc2xlcy13b3JsZC1tYXAtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46IFxuICAgICAgICAgICAgdG9wOiA2MFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVnZW5kOiB0cnVlKVxuICAgICAgICBncmFwaC5zZXREYXRhIGNvdW50cmllcywgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIE1lYXNsZXMgY2FzZXMgSGVhdG1hcCBHcmFwaFxuICBzZXR1cEhlYXRNYXBHcmFwaCA9IChpZCwgZGF0YSwgY291bnRyaWVzLCBsZWdlbmQpIC0+XG4gICAgZGF0YSA9IGRhdGFcbiAgICAgIC5maWx0ZXIgKGQpIC0+IGNvdW50cmllcy5pbmRleE9mKGQuY29kZSkgIT0gLTEgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuICAgICAgLnNvcnQgKGEsYikgLT4gYS50b3RhbCAtIGIudG90YWxcbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuSGVhdG1hcEdyYXBoKGlkLFxuICAgICAgbGVnZW5kOiBsZWdlbmRcbiAgICAgIG1hcmdpbjogXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGxlZnQ6IDApXG4gICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldHVwVmFjY2luZUNvbmZpZGVuY2VCYXJHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvY29uZmlkZW5jZS5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHA6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbG9jYXRpb24pIC0+XG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgICBkLnZhbHVlID0gK2QudmFsdWVcbiAgICAgICAgICBkLm5hbWUgPSBkWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBkZWxldGUgZC5uYW1lX2VzXG4gICAgICAgICAgZGVsZXRlIGQubmFtZV9lblxuICAgICAgICAgICMgc2V0IHVzZXIgY291bnRyeSBhY3RpdmVcbiAgICAgICAgICBpZiBsb2NhdGlvbiBhbmQgZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICAgIGQuYWN0aXZlID0gdHJ1ZVxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFyR3JhcGgoJ3ZhY2NpbmUtY29uZmlkZW5jZS1ncmFwaCcsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IDAuM1xuICAgICAgICAgIGxhYmVsOiBcbiAgICAgICAgICAgIGZvcm1hdDogKGQpIC0+ICBmb3JtYXRGbG9hdChkKSsnJSdcbiAgICAgICAgICBtYXJnaW46IHRvcDogMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIHg6ICduYW1lJ1xuICAgICAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICAgICAgaWQ6ICdjb2RlJylcbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVCY2dDYXNlc01hcCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3R1YmVyY3Vsb3Npcy1jYXNlcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgIyBhZGQgY2FzZXMgdG8gZWFjaCBjb3VudHJ5XG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGQudmFsdWUgPSArZC5jYXNlc19wb3B1bGF0aW9uXG4gICAgICAgICAgZC5jYXNlcyA9ICtkLmNhc2VzXG4gICAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTWFwR3JhcGgoJ3ZhY2NpbmUtYmNnLWNhc2VzLWdyYXBoJyxcbiAgICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgICAgbWFyZ2luOiBcbiAgICAgICAgICAgIHRvcDogNjBcbiAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgIGxlZ2VuZDogdHJ1ZSlcbiAgICAgICAgZ3JhcGguZ2V0TGVnZW5kRGF0YSA9IC0+IFswLDIwMCw0MDAsNjAwLDgwMF1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLCBtYXBcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgc2V0dXBWYWNjaW5lQmNnU3RvY2tvdXRzTWFwID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvYmNnLXN0b2Nrb3V0cy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgeWVhcnMgPSBkMy5yYW5nZSAyMDA2LCAyMDE2ICAgIyBzZXQgeWVhcnMgYXJyYXlcbiAgICAgICAgIyBhZGQgY2FzZXMgdG8gZWFjaCBjb3VudHJ5XG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGQudmFsdWUgPSArZC52YWx1ZVxuICAgICAgICAgIGQueWVhcnMgPSAnJ1xuICAgICAgICAgICMgZ2V0IGxpc3Qgb2YgeWVhcnMgd2l0aCBzdG9ja291dHNcbiAgICAgICAgICB5ZWFycy5mb3JFYWNoICh5ZWFyKSAtPlxuICAgICAgICAgICAgaWYgZFt5ZWFyXSA9PSAnMicgfHwgZFt5ZWFyXSA9PSAnMycgICMgY2hlY2sgdmFsdWVzIDIgb3IgMyAobmF0aW9uYWwgc3RvY2tvdXRzIGNvZGUpXG4gICAgICAgICAgICAgIGQueWVhcnMgKz0geWVhcisnLCdcbiAgICAgICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgICAgICAgaWYgaXRlbVxuICAgICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTWFwR3JhcGgoJ3ZhY2NpbmUtYmNnLXN0b2Nrb3V0cycsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgICAgIG1hcmdpbjogXG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLmZvcm1hdEZsb2F0ID0gZ3JhcGguZm9ybWF0SW50ZWdlclxuICAgICAgICBncmFwaC5nZXRMZWdlbmREYXRhID0gLT4gWzAsMiw0LDYsOF1cbiAgICAgICAgZ3JhcGguc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgICAgICAgIC5odG1sIGQubmFtZVxuICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLCAueWVhcnMtY2VsbHMnXG4gICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgaWYgZC52YWx1ZSA9PSAwXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLXplcm8nXG4gICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgICBlbHNlIGlmIGQudmFsdWUgPT0gMVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi1vbmUgLnZhbHVlJ1xuICAgICAgICAgICAgICAuaHRtbCBkLnllYXJzLnNwbGl0KCcsJylbMF1cbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tb25lJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXAgXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tbXVsdGlwbGUgLnZhbHVlJ1xuICAgICAgICAgICAgICAuaHRtbCBncmFwaC5mb3JtYXRJbnRlZ2VyKGQudmFsdWUpXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLnllYXJzLWNlbGxzIGxpJ1xuICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICAgICAgICBkLnllYXJzLnNwbGl0KCcsJykuZm9yRWFjaCAoeWVhcikgLT5cbiAgICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgICAuZmluZCAnLnllYXJzLWNlbGxzIGxpW2RhdGEteWVhcj1cIicreWVhcisnXCJdJ1xuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcyAnYWN0aXZlJywgdHJ1ZVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi1tdWx0aXBsZSwgLnllYXJzLWNlbGxzJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YSwgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy1tZWFzbGVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL3BvcHVsYXRpb24uY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV9jYXNlcywgZGF0YV9wb3B1bGF0aW9uKSAtPlxuICAgICAgICBkZWxldGUgZGF0YV9jYXNlcy5jb2x1bW5zICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4gICAgICAgIGRhdGFfY2FzZXMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4gICAgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiAgICAgICAgICBkLmNhc2VzID0ge31cbiAgICAgICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICAgICAgZC5uYW1lID0gZ2V0Q291bnRyeU5hbWUgZGF0YV9wb3B1bGF0aW9uLCBkLmNvZGUsIGxhbmdcbiAgICAgICAgICAjIHNldCB2YWx1ZXMgYXMgY2FzZXMvMTAwMCBpbmhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgICAgICB5ZWFyKytcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuICAgICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4gICAgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT4gYSArIGIpLCAwKVxuICAgICAgICAjIEZpbHRlciBieSBzZWxlY3RlZCBjb3VudHJpZXMgJiBkaXNlYXNlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTEnLCBkYXRhX2Nhc2VzLCBbJ0ZJTicsJ0hVTicsJ1BSVCcsJ1VSWScsJ01FWCcsJ0NPTCddLCB0cnVlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTInLCBkYXRhX2Nhc2VzLCBbJ0lSUScsJ0JHUicsJ01ORycsJ1pBRicsJ0ZSQScsJ0dFTyddLCBmYWxzZVxuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLnZhbCgpKVxuICAgICAgIyBVcGRhdGUgZGF0YSBiYXNlZCBvbiBzZWxlY3RlZCB2YWNjaW5lXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICAgIyBVcGRhdGUgYWN0aXZlIGNvdW50cmllc1xuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3IsICNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcpLmZpbmQoJy5saW5lLWxhYmVsLCAubGluZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwgI2xpbmUtbGFiZWwtJyskKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLnZhbCgpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgTXVsdGlwbGUgU21hbGwgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZU11bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgY3VycmVudF9jb3VudHJpZXMgPSBbJ0xLQScsJ0RaQScsJ0RFVScsJ0ROSycsJ0ZSQSddXG4gICAgZ3JhcGhzID0gW11cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sICdodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbG9jYXRpb24pIC0+XG4gICAgICAgICMgU2V0dXAgdXNlciBjb3VudHJ5XG4gICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICBpZiB1c2VyX2NvdW50cnkgYW5kIHVzZXJfY291bnRyeS5sZW5ndGggPiAwIGFuZCB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgaWYgY3VycmVudF9jb3VudHJpZXMuaW5kZXhPZih1c2VyX2NvdW50cnlbMF0uY29kZSkgPT0gLTFcbiAgICAgICAgICAgICAgY3VycmVudF9jb3VudHJpZXNbMl0gPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgICBlbCA9ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGggLmdyYXBoLWNvbnRhaW5lcicpLmVxKDIpXG4gICAgICAgICAgICAgIGVsLmZpbmQoJ3AnKS5odG1sIHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICAgIGVsLmZpbmQoJy5saW5lLWdyYXBoJykuYXR0ciAnaWQnLCAnaW1tdW5pemF0aW9uLWNvdmVyYWdlLScrdXNlcl9jb3VudHJ5WzBdLmNvZGUudG9Mb3dlckNhc2UoKSsnLWdyYXBoJ1xuICAgICAgICAjIGxvb3AgdGhyb3VnaCBlYWNoIHNlbGVjdGVkIGNvdW50cnkgICBcbiAgICAgICAgY3VycmVudF9jb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSxpKSAtPlxuICAgICAgICAgICMgZ2V0IGN1cnJlbnQgZGlzZWFzZSBkYXRhXG4gICAgICAgICAgY291bnRyeV9kYXRhID0gZGF0YVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlcbiAgICAgICAgICAgIC5tYXAgICAgKGQpIC0+ICQuZXh0ZW5kKHt9LCBkKVxuICAgICAgICAgIGNvdW50cnlfZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDEnXVxuICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDInXVxuICAgICAgICAgICMgc2V0dXAgbGluZSBjaGFydFxuICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS0nK2NvdW50cnkudG9Mb3dlckNhc2UoKSsnLWdyYXBoJyxcbiAgICAgICAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgICAgICAga2V5OiBcbiAgICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICAgIGlkOiAnY29kZScpXG4gICAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgICBncmFwaC55Rm9ybWF0ID0gKGQpIC0+IGQrJyUnXG4gICAgICAgICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgICAgICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbNTBdXG4gICAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMywyMDE1XVxuICAgICAgICAgIGdyYXBoLmFkZE1hcmtlclxuICAgICAgICAgICAgdmFsdWU6IDk1XG4gICAgICAgICAgICBsYWJlbDogaWYgaSUyICE9IDAgdGhlbiAnJyBlbHNlIGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdOaXZlbCBkZSByZWJhw7FvJyBlbHNlICdIZXJkIGltbXVuaXR5J1xuICAgICAgICAgICAgYWxpZ246ICdsZWZ0J1xuICAgICAgICAgICMgc2hvdyBsYXN0IHllYXIgbGFiZWxcbiAgICAgICAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgICAgICAgIGdyYXBoLnNldExhYmVsIDIwMTVcbiAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgICAgICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAgICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgICAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICAgICAgZ3JhcGguc2V0RGF0YSBjb3VudHJ5X2RhdGFcbiAgICAgICAgICAjIGxpc3RlbiB0byB5ZWFyIGNoYW5nZXMgJiB1cGRhdGUgZWFjaCBncmFwaCBsYWJlbFxuICAgICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4gICAgICAgXG5cbiAgIyBXb3JsZCBDYXNlcyBNdWx0aXBsZSBTbWFsbFxuICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGggPSAtPlxuICAgIGRpc2Vhc2VzID0gWydkaXBodGVyaWEnLCAnbWVhc2xlcycsJ3BlcnR1c3NpcycsJ3BvbGlvJywndGV0YW51cyddXG4gICAgZ3JhcGhzID0gW11cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gMTAwMDAwICNkMy5tYXggZGF0YS5maWx0ZXIoKGQpIC0+IFsnZGlwaHRlcmlhJywncG9saW8nLCd0ZXRhbnVzJ10uaW5kZXhPZihkLmRpc2Vhc2UpICE9IC0xKSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgICMgY3JlYXRlIGEgbGluZSBncmFwaCBmb3IgZWFjaCBkaXNlYXNlXG4gICAgICBkaXNlYXNlcy5mb3JFYWNoIChkaXNlYXNlKSAtPlxuICAgICAgICAjIGdldCBjdXJyZW50IGRpc2Vhc2UgZGF0YVxuICAgICAgICBkaXNlYXNlX2RhdGEgPSBkYXRhXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5kaXNlYXNlID09IGRpc2Vhc2VcbiAgICAgICAgICAubWFwICAgIChkKSAtPiAkLmV4dGVuZCh7fSwgZClcbiAgICAgICAgIyBzZXR1cCBsaW5lIGNoYXJ0XG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoZGlzZWFzZSsnLXdvcmxkLWdyYXBoJyxcbiAgICAgICAgICBpc0FyZWE6IHRydWVcbiAgICAgICAgICBtYXJnaW46IGxlZnQ6IDIwXG4gICAgICAgICAga2V5OiBcbiAgICAgICAgICAgIHg6ICdkaXNlYXNlJ1xuICAgICAgICAgICAgaWQ6ICdkaXNlYXNlJylcbiAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMTk4MCwgMjAxNV1cbiAgICAgICAgZ3JhcGgueUF4aXMudGlja3MoMikudGlja0Zvcm1hdCBkMy5mb3JtYXQoJy4wcycpXG4gICAgICAgIGdyYXBoLnlGb3JtYXQgPSBkMy5mb3JtYXQoJy4ycycpXG4gICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IC0+IHJldHVybiBbMCwgaWYgZGlzZWFzZSA9PSAnbWVhc2xlcycgb3IgZGlzZWFzZSA9PSAncGVydHVzc2lzJyB0aGVuIG1heFZhbHVlMSBlbHNlIG1heFZhbHVlMl1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkaXNlYXNlX2RhdGFcbiAgICAgICAgIyBsaXN0ZW4gdG8geWVhciBjaGFuZ2VzICYgdXBkYXRlIGVhY2ggZ3JhcGggbGFiZWxcbiAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgdW5sZXNzIGcgPT0gZ3JhcGhcbiAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnbW91c2VvdXQnLCAoZSkgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuaGlkZUxhYmVsKClcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoID0gLT5cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2ltbXVuaXphdGlvbi1jb3ZlcmFnZS5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sICdodHRwOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbG9jYXRpb24pIC0+XG4gICAgICAgICMgU2V0dXAgdXNlciBjb3VudHJ5XG4gICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgICBsb2NhdGlvbi5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgIyBGaWx0ZXIgZGF0YVxuICAgICAgICBoZXJkSW1tdW5pdHkgPSBcbiAgICAgICAgICAnTUNWMSc6IDk1XG4gICAgICAgICAgJ1BvbDMnOiA4MFxuICAgICAgICAgICdEVFAzJzogODBcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBleGNsdWRlZENvdW50cmllcy5pbmRleE9mKGQuY29kZSkgPT0gLTFcbiAgICAgICAgIyBEYXRhIHBhcnNlICYgc29ydGluZyBmdW50aW9uc1xuICAgICAgICBkYXRhX3BhcnNlciA9IChkKSAtPlxuICAgICAgICAgIG9iaiA9IFxuICAgICAgICAgICAga2V5OiAgIGQuY29kZVxuICAgICAgICAgICAgbmFtZTogIGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5jb2RlLCBsYW5nKVxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE1J11cbiAgICAgICAgICBpZiBsb2NhdGlvbiBhbmQgZC5jb2RlID09IGxvY2F0aW9uLmNvZGVcbiAgICAgICAgICAgIG9iai5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICBkYXRhX3NvcnQgPSAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgIyBsb29wIHRocm91Z2ggZWFjaCBncmFwaFxuICAgICAgICAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5lYWNoIC0+XG4gICAgICAgICAgJGVsICAgICA9ICQodGhpcylcbiAgICAgICAgICBkaXNlYXNlID0gJGVsLmRhdGEoJ2Rpc2Vhc2UnKVxuICAgICAgICAgIHZhY2NpbmUgPSAkZWwuZGF0YSgndmFjY2luZScpXG4gICAgICAgICAgIyBHZXQgZ3JhcGggZGF0YSAmIHZhbHVlXG4gICAgICAgICAgZ3JhcGhfZGF0YSA9IGRhdGFcbiAgICAgICAgICAgIC5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSB2YWNjaW5lIGFuZCBkWycyMDE1J10gIT0gJycpXG4gICAgICAgICAgICAubWFwKGRhdGFfcGFyc2VyKVxuICAgICAgICAgICAgLnNvcnQoZGF0YV9zb3J0KVxuICAgICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgICBncmFwaF92YWx1ZSA9IGdyYXBoX2RhdGEuZmlsdGVyIChkKSAtPiBkLmtleSA9PSBsb2NhdGlvbi5jb2RlXG4gICAgICAgICAgIyBTZXR1cCBncmFwaFxuICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaChkaXNlYXNlKyctaW1tdW5pemF0aW9uLWJhci1ncmFwaCcsXG4gICAgICAgICAgICBhc3BlY3RSYXRpbzogMC4yNVxuICAgICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICAgIGZvcm1hdDogKGQpIC0+ICtkKyclJ1xuICAgICAgICAgICAga2V5OiB4OiAnbmFtZSdcbiAgICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgICAgdG9wOiAyMClcbiAgICAgICAgICBtYXJrZXIgPSBcbiAgICAgICAgICAgIHZhbHVlOiBoZXJkSW1tdW5pdHlbdmFjY2luZV1cbiAgICAgICAgICAgIGxhYmVsOiBpZiBsYW5nID09ICdlcycgdGhlbiAnTml2ZWwgZGUgcmViYcOxbycgZWxzZSAnSGVyZCBpbW11bml0eSdcbiAgICAgICAgICBpZiB2YWNjaW5lID09ICdEVFAzJ1xuICAgICAgICAgICAgbWFya2VyLmxhYmVsID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ1JlY29tZW5kYWNpw7NuIE9NUycgZWxzZSAnV0hPIHJlY29tbWVuZGF0aW9uJ1xuICAgICAgICAgIGdyYXBoXG4gICAgICAgICAgICAuYWRkTWFya2VyIG1hcmtlclxuICAgICAgICAgICAgLnNldERhdGEgZ3JhcGhfZGF0YVxuICAgICAgICAgICMgU2V0dXAgZ3JhcGggdmFsdWVcbiAgICAgICAgICBpZiBncmFwaF92YWx1ZSBhbmQgZ3JhcGhfdmFsdWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tY291bnRyeScpLmh0bWwgbG9jYXRpb24ubmFtZVxuICAgICAgICAgICAgJGVsLmZpbmQoJy5pbW11bml6YXRpb24tZGF0YScpLmh0bWwgJzxzdHJvbmc+JyArIGdyYXBoX3ZhbHVlWzBdLnZhbHVlICsgJyU8L3N0cm9uZz4nXG4gICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kZXNjcmlwdGlvbicpLnNob3coKVxuICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPiBncmFwaC5vblJlc2l6ZSgpXG5cblxuICBzZXR1cFZhY2NpbmVWUEhHcmFwaCA9IC0+XG4gICAgIyBMb2FkIGRhdGFcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS92cGguY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvZ2RwLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL3BvcHVsYXRpb24uY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBwb3B1bGF0aW9uKSAtPlxuICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGV4Y2x1ZGVkQ291bnRyaWVzLmluZGV4T2YoZC5jb3VudHJ5KSA9PSAtMVxuICAgICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvdW50cnlcbiAgICAgICAgICBjb3VudHJ5X3BvcHVsYXRpb24gPSBwb3B1bGF0aW9uLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY291bnRyeVxuICAgICAgICAgIGlmIGNvdW50cnlbMF1cbiAgICAgICAgICAgIGQubmFtZSA9IGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgZC5nZHAgPSArY291bnRyeVswXS52YWx1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICNjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBkLmNvdW50cnlcbiAgICAgICAgICBpZiBjb3VudHJ5X3BvcHVsYXRpb25bMF1cbiAgICAgICAgICAgIGQucG9wdWxhdGlvbiA9ICtjb3VudHJ5X3BvcHVsYXRpb25bMF1bJzIwMTUnXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICNjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IHBvcHVsYXRpb24gZm9yIGNvZGUnLCBkLmNvdW50cnlcbiAgICAgICAgICBkLnZhbHVlID0gK2QuZGVhdGhzXG4gICAgICAgICMgc2tpcCBkYXRhIGxpbmVzIHdpdGhvdXQgZ2RwIGRhdGFcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmdkcFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuU2NhdHRlcnBsb3RWUEhHcmFwaCgndmFjY2luZS12cGgtZ3JhcGgnLCBsYW5nLFxuICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgIGxlZnQ6IDIwXG4gICAgICAgICAgICB0b3A6IDMwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBrZXk6XG4gICAgICAgICAgICB4OiAnZ2RwJ1xuICAgICAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICAgICAgc2l6ZTogJ3BvcHVsYXRpb24nXG4gICAgICAgICAgICBjb2xvcjogJ3ZhY2NpbmUnKVxuICAgICAgICAjIHNldCBkYXRhXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyMjXG4gIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXInLFxuICAgICAgI2lzQXJlYTogdHJ1ZVxuICAgICAgbWFyZ2luOiBcbiAgICAgICAgbGVmdDogMFxuICAgICAgICByaWdodDogMFxuICAgICAgICBib3R0b206IDIwKVxuICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzIwMDAsIDIwMDUsIDIwMTAsIDIwMTVdXG4gICAgZ3JhcGgueUF4aXNcbiAgICAgIC50aWNrVmFsdWVzIFswLCAyNSwgNTAsIDc1LCAxMDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICBncmFwaC5sb2FkRGF0YSBiYXNldXJsKycvZGF0YS9ndWF0ZW1hbGEtY292ZXJhZ2UtbW1yLmNzdidcbiAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgIGxpbmUgPSBncmFwaC5jb250YWluZXIuc2VsZWN0KCcubGluZScpXG4gICAgICBjb25zb2xlLmxvZyBsaW5lLm5vZGUoKVxuICAgICAgbGVuZ3RoID0gbGluZS5ub2RlKCkuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIGxpbmVcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCBsZW5ndGggKyAnICcgKyBsZW5ndGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIGxlbmd0aClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSg1MDAwKVxuICAgICAgICAgIC5kdXJhdGlvbig1MDAwKVxuICAgICAgICAgIC5lYXNlKGQzLmVhc2VTaW5Jbk91dClcbiAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAwKVxuXG4gIGlmICQoJyNndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJykubGVuZ3RoID4gMFxuICAgIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGgoKVxuICAjIyNcblxuICBpZiAkKCcjdmlkZW8tbWFwLXBvbGlvJykubGVuZ3RoID4gMFxuICAgIHNldFZpZGVvTWFwUG9saW8oKVxuXG4gICMjI1xuICAjIyBWYWNjaW5lIG1hcFxuICBpZiAkKCcjdmFjY2luZS1tYXAnKS5sZW5ndGggPiAwXG4gICAgdmFjY2luZV9tYXAgPSBuZXcgVmFjY2luZU1hcCAndmFjY2luZS1tYXAnXG4gICAgI3ZhY2NpbmVfbWFwLmdldERhdGEgPSB0cnVlICAjICBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIHBvbGlvIGNhc2VzIGNzdlxuICAgIHZhY2NpbmVfbWFwLmdldFBpY3R1cmVTZXF1ZW5jZSA9IHRydWUgICAjIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgbWFwIHBpY3R1cmUgc2VxdWVuY2VcbiAgICB2YWNjaW5lX21hcC5pbml0IGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLXBvbGlvLWNhc2VzLmNzdicsIGJhc2V1cmwrJy9kYXRhL21hcC1wb2xpby1jYXNlcy5jc3YnXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB2YWNjaW5lX21hcC5vblJlc2l6ZVxuICAjIyNcblxuICBpZiAkKCcudmFjY2luZXMtZGlzZWFzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoKClcblxuICAjIyNcbiAgIyBWYWNjaW5lIGFsbCBkaXNlYXNlcyBncmFwaFxuICBpZiAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzID0gbmV3IFZhY2NpbmVEaXNlYXNlR3JhcGgoJ3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCcpXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLnZhbCgpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5vblJlc2l6ZVxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiAgICAkKCcjZGlzZWFzZS1zZWxlY3RvciBhJykuY2xpY2sgKGUpIC0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICQodGhpcykudGFiICdzaG93J1xuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAgIHJldHVyblxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VvbiBvbiBvcmRlciBzZWxlY3RvclxuICAgICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykuY2hhbmdlIChkKSAtPlxuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKHRoaXMpLnZhbCgpXG4gICMjI1xuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VEeW5hbWljTGluZUdyYXBoKClcblxuICBpZiAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VNdWx0aXBsZVNtYWxsR3JhcGgoKVxuXG4gIGlmICQoJyN3b3JsZC1jYXNlcycpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGgoKVxuICBcbiAgaWYgJCgnLmltbXVuaXphdGlvbi1jb3ZlcmFnZS1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoKClcblxuICBpZiAkKCcjbWVhc2xlcy13b3JsZC1tYXAtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBNZWFzbGVzV29ybGRNYXBHcmFwaCgpXG5cbiAgaWYgJCgnI3ZhY2NpbmUtY29uZmlkZW5jZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVDb25maWRlbmNlQmFyR3JhcGgoKVxuXG4gIGlmICQoJyN2YWNjaW5lLWJjZy1jYXNlcy1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVCY2dDYXNlc01hcCgpXG5cbiAgaWYgJCgnI3ZhY2NpbmUtYmNnLXN0b2Nrb3V0cycpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVCY2dTdG9ja291dHNNYXAoKVxuXG4gIGlmICQoJyN2YWNjaW5lLXZwaC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVWUEhHcmFwaCgpXG5cbiAgIyBTZXR1cCB2YWNjaW5lcyBwcmljZXNcbiAgaWYgJCgnYm9keScpLmhhc0NsYXNzKCdwcmljZXMnKSB8fCAgJCgnYm9keScpLmhhc0NsYXNzKCdwcmVjaW9zJylcbiAgICBuZXcgVmFjY2luZXNQcmljZXMgbGFuZywgYmFzZXVybCwgJy9kYXRhL3ByaWNlcy12YWNjaW5lcy5jc3YnXG5cbiAgIyBTZXR1cCB2YWNjaW5lIHZwaCBwcmljZXNcbiAgaWYgJCgnI3ZhY2NpbmUtcHJpY2VzLXZwaC1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBuZXcgVmFjY2luZXNQcmljZXMgbGFuZywgYmFzZXVybCwgJy9kYXRhL3ByaWNlcy12YWNjaW5lcy12cGguY3N2J1xuXG4pIGpRdWVyeSJdfQ==
