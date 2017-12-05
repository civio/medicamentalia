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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZGlzY3JldGUtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtdnBoLWdyYXBoLmNvZmZlZSIsIm1haW4tdmFjY2luZXMtcHJpY2VzLmNvZmZlZSIsIm1haW4tdmFjY2luZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFB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UyxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBcEM7TUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLDJCQUE5QixFQUROOztJQUlBLElBQUcsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBM0M7YUFDTSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCLCtCQUE5QixFQUROOztFQTFsQkQsQ0FBRCxDQUFBLENBNmxCRSxNQTdsQkY7QUFBQSIsImZpbGUiOiJ2YWNjaW5lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCYXIgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICAgLnBhZGRpbmdJbm5lcigwLjEpXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBiYXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYWN0aXZlJyBlbHNlICdiYXInXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgIyBkcmF3IGxhYmVscyB4XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXggYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteCdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnMS4yNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICAjIGRyYXcgbGFiZWxzIHlcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteSBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC15J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICctMC41ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBpZiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQgdGhlbiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQoZFtAb3B0aW9ucy5rZXkueV0pIGVsc2UgZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldEJhckRpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAaGVpZ2h0IC0gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKClcblxuICBzZXRCYXJMYWJlbFhEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQGhlaWdodFxuXG4gIHNldEJhckxhYmVsWURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5MaW5lR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICB5Rm9ybWF0OiBkMy5mb3JtYXQoJ2QnKSAgICMgc2V0IGxhYmVscyBob3ZlciBmb3JtYXRcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdMaW5lIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyBkYXRhXG4gICAgc3VwZXIoZGF0YSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICB5ZWFycyA9IFtdXG4gICAgZDMua2V5cyhkYXRhWzBdKS5mb3JFYWNoIChkKSAtPlxuICAgICAgaWYgK2RcbiAgICAgICAgeWVhcnMucHVzaCArZFxuICAgIHJldHVybiB5ZWFycy5zb3J0KClcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGRbQG9wdGlvbnMua2V5LnhdLCAnZW4gJywgeWVhcik7XG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAgIC5jYWxsIEBzZXRUaWNrSG92ZXJQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbScgICAgICBcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgLmNhbGwgQHNldFRpY2tIb3ZlclBvc2l0aW9uXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgXG4gIHNldFRpY2tIb3ZlclBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCBNYXRoLnJvdW5kIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCs5IiwiY2xhc3Mgd2luZG93LkhlYXRtYXBHcmFwaCBleHRlbmRzIEJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyAgICAgICA9IG51bGxcbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0ICcjJytAaWQrJyAuaGVhdG1hcC1ncmFwaCdcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBjb250YWluZXIuY2xhc3NlZCAnaGFzLWxlZ2VuZCcsIHRydWVcbiAgICBAJHRvb2x0aXAgID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICAjIEdldCB5ZWFycyAoeCBzY2FsZSlcbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMoZGF0YSlcbiAgICAjIEdldCBjb3VudHJpZXMgKHkgc2NhbGUpXG4gICAgQGNvdW50cmllcyA9IGRhdGEubWFwIChkKSAtPiBkLmNvZGVcbiAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuICAgIEBjZWxsc0RhdGEgPSBAZ2V0Q2VsbHNEYXRhIGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGdldERpbWVuc2lvbnMoKSAjIGZvcmNlIHVwZGF0ZSBkaW1lbnNpb25zXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgbWluWWVhciA9IGQzLm1pbiBkYXRhLCAoZCkgLT4gZDMubWluKGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIG1heFllYXIgPSBkMy5tYXggZGF0YSwgKGQpIC0+IGQzLm1heChkMy5rZXlzKGQudmFsdWVzKSlcbiAgICB5ZWFycyA9IGQzLnJhbmdlIG1pblllYXIsIG1heFllYXIsIDFcbiAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4gICAgcmV0dXJuIHllYXJzXG5cbiAgZ2V0Q2VsbHNEYXRhOiAoZGF0YSkgLT5cbiAgICBjZWxsc0RhdGEgPSBbXVxuICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuICAgICAgICBjZWxsc0RhdGEucHVzaFxuICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuICAgICAgICAgIG5hbWU6ICAgIGQubmFtZVxuICAgICAgICAgIHllYXI6ICAgIHZhbHVlXG4gICAgICAgICAgY2FzZXM6ICAgZC5jYXNlc1t2YWx1ZV1cbiAgICAgICAgICB2YWx1ZTogICBkLnZhbHVlc1t2YWx1ZV1cbiAgICByZXR1cm4gY2VsbHNEYXRhXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyXG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWFJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gIGdldFNjYWxlWVJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQGhlaWdodF1cblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEB5ZWFycyBcblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIEBjb3VudHJpZXNcblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDQwMF1cblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIEB3aWR0aCA9IEAkZWwud2lkdGgoKSAtIDcwICAjIHkgYXhpcyB3aWR0aCA9IDEwMFxuICAgIGlmIEB5ZWFycyBhbmQgQGNvdW50cmllc1xuICAgICAgY2VsbFNpemUgPSBNYXRoLmZsb29yIEB3aWR0aCAvIEB5ZWFycy5sZW5ndGhcbiAgICAgICMgc2V0IG1pbmltdW0gY2VsbCBkaW1lbnNpb25zXG4gICAgICBpZiBjZWxsU2l6ZSA8IDE1XG4gICAgICAgIGNlbGxTaXplID0gMTVcbiAgICAgICAgQHdpZHRoID0gKGNlbGxTaXplICogQHllYXJzLmxlbmd0aCkgKyA3MFxuICAgICAgQGhlaWdodCA9IGlmIGNlbGxTaXplIDwgMjAgdGhlbiBjZWxsU2l6ZSAqIEBjb3VudHJpZXMubGVuZ3RoIGVsc2UgMjAgKiBAY291bnRyaWVzLmxlbmd0aFxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgc2V0dXAgc2NhbGVzIHJhbmdlXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgY29udGFpbmVyIGhlaWdodFxuICAgICNAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAjIGRyYXcgeWVhcnMgeCBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAneC1heGlzIGF4aXMnXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAeWVhcnMuZmlsdGVyKChkKSAtPiBkICUgNSA9PSAwKSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgICAuaHRtbCAgKGQpIC0+IGRcbiAgICAjIGRyYXcgY291bnRyaWVzIHkgYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJylcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEBjb3VudHJpZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ3RvcCcsIChkKSA9PiBAeShkKSsncHgnXG4gICAgICAuaHRtbCAoZCkgPT4gQGdldENvdW50cnlOYW1lIGRcbiAgICAjIGRyYXcgY2VsbHNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbC1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIC5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5kYXRhKEBjZWxsc0RhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsJ1xuICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvcihkLnZhbHVlKVxuICAgICAgLm9uICAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgIC5vbiAgICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICAgLmNhbGwgIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgICMgZHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhIEBkYXRhLm1hcCgoZCkgLT4ge2NvZGU6IGQuY29kZSwgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvbn0pLmZpbHRlcigoZCkgLT4gIWlzTmFOIGQueWVhcilcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc2NhbGVzXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGNvbnRhaW5lcnNcbiAgICBAY29udGFpbmVyXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQgKyAncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuY2FsbCBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLngtYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueS1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRDZWxsRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IEB4KGQueWVhcikrJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb3VudHJ5KSsncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIHNldE1hcmtlckRpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiAoQHkoZC5jb2RlKS0xKSsncHgnXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSA9PiBpZiBkLnllYXIgPCBAeWVhcnNbMF0gdGhlbiBAeChAeWVhcnNbMF0pLTEgKyAncHgnIGVsc2UgaWYgZC55ZWFyIDwgQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0gdGhlbiBAeChkLnllYXIpLTErJ3B4JyBlbHNlIEB4LmJhbmR3aWR0aCgpK0B4KEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdKSsncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChAeS5iYW5kd2lkdGgoKSsxKSsncHgnXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIG9mZnNldCAgICAgICAgICAgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcblxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jb3VudHJ5J1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnllYXInXG4gICAgICAuaHRtbCBkLnllYXJcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBpZiBkLnZhbHVlID09IDAgdGhlbiAwIGVsc2UgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcylcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBvZmZzZXQubGVmdCArIEB4LmJhbmR3aWR0aCgpICogMC41IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBvZmZzZXQudG9wIC0gKEB5LmJhbmR3aWR0aCgpICogMC41KSAtIEAkdG9vbHRpcC5oZWlnaHQoKVxuICAgICAgJ29wYWNpdHknOiAnMSdcbiAgICByZXR1cm5cblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG4gICAgcmV0dXJuXG5cbiAgZ2V0Q291bnRyeU5hbWU6IChjb2RlKSA9PlxuICAgIGNvdW50cnkgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb2RlXG4gICAgcmV0dXJuIGlmIGNvdW50cnlbMF0gdGhlbiBjb3VudHJ5WzBdLm5hbWUgZWxzZSAnJ1xuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5kRGF0YSA9IFswLDEwMCwyMDAsMzAwLDQwMF1cbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ3VsJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuc3R5bGUgJ21hcmdpbi1sZWZ0JywgLSgxNSpsZWdlbmREYXRhLmxlbmd0aCkrJ3B4J1xuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgnbGknKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IgZFxuICAgICAgICAuaHRtbCAoZCxpKSAtPiBpZiBpICE9IDAgdGhlbiBkIGVsc2UgJyZuYnNwJ1xuXG4gICAgIyMjXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0wLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcbiAgICAjIyNcblxuIyBWYWNjaW5lRGlzZWFzZUdyYXBoID0gKF9pZCkgLT5cbiMgICAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKVxuIyAgIFlfQVhJU19XSURUSCA9IDEwMFxuIyAgICMgTXVzdCBiZSB0aGUgYW1lIHZhbHVlIHRoYW4gI3ZhY2NpbmUtZGlzZWFzZS1ncmFwaCAkcGFkZGluZy1sZWZ0IHNjc3MgdmFyaWFibGVcbiMgICB0aGF0ID0gdGhpc1xuIyAgIGlkID0gX2lkXG4jICAgZGlzZWFzZSA9IHVuZGVmaW5lZFxuIyAgIHNvcnQgPSB1bmRlZmluZWRcbiMgICBsYW5nID0gdW5kZWZpbmVkXG4jICAgZGF0YSA9IHVuZGVmaW5lZFxuIyAgIGRhdGFQb3B1bGF0aW9uID0gdW5kZWZpbmVkXG4jICAgY3VycmVudERhdGEgPSB1bmRlZmluZWRcbiMgICBjZWxsRGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNvdW50cmllcyA9IHVuZGVmaW5lZFxuIyAgIHllYXJzID0gdW5kZWZpbmVkXG4jICAgY2VsbFNpemUgPSB1bmRlZmluZWRcbiMgICBjb250YWluZXIgPSB1bmRlZmluZWRcbiMgICB4ID0gdW5kZWZpbmVkXG4jICAgeSA9IHVuZGVmaW5lZFxuIyAgIHdpZHRoID0gdW5kZWZpbmVkXG4jICAgaGVpZ2h0ID0gdW5kZWZpbmVkXG4jICAgJGVsID0gdW5kZWZpbmVkXG4jICAgJHRvb2x0aXAgPSB1bmRlZmluZWRcbiMgICAjIFB1YmxpYyBNZXRob2RzXG5cbiMgICB0aGF0LmluaXQgPSAoX2Rpc2Vhc2UsIF9zb3J0KSAtPlxuIyAgICAgZGlzZWFzZSA9IF9kaXNlYXNlXG4jICAgICBzb3J0ID0gX3NvcnRcbiMgICAgICNjb25zb2xlLmxvZygnVmFjY2luZSBHcmFwaCBpbml0JywgaWQsIGRpc2Vhc2UsIHNvcnQpO1xuIyAgICAgJGVsID0gJCgnIycgKyBpZClcbiMgICAgICR0b29sdGlwID0gJGVsLmZpbmQoJy50b29sdGlwJylcbiMgICAgIGxhbmcgPSAkZWwuZGF0YSgnbGFuZycpXG4jICAgICB4ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICB5ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbChkMy5pbnRlcnBvbGF0ZU9yUmQpXG4jICAgICBpZiBkYXRhXG4jICAgICAgIGNsZWFyKClcbiMgICAgICAgc2V0dXBEYXRhKClcbiMgICAgICAgc2V0dXBHcmFwaCgpXG4jICAgICBlbHNlXG4jICAgICAgICMgTG9hZCBDU1ZzXG4jICAgICAgIGQzLnF1ZXVlKCkuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLmNzdicpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvZGF0YS9wb3B1bGF0aW9uLmNzdicpLmF3YWl0IG9uRGF0YVJlYWR5XG4jICAgICB0aGF0XG5cbiMgICB0aGF0Lm9uUmVzaXplID0gLT5cbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICB1cGRhdGVHcmFwaCgpXG4jICAgICB0aGF0XG5cbiMgICBvbkRhdGFSZWFkeSA9IChlcnJvciwgZGF0YV9jc3YsIHBvcHVsYXRpb25fY3N2KSAtPlxuIyAgICAgZGF0YSA9IGRhdGFfY3N2XG4jICAgICBkYXRhUG9wdWxhdGlvbiA9IHBvcHVsYXRpb25fY3N2XG4jICAgICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4jICAgICBkZWxldGUgZGF0YS5jb2x1bW5zXG4jICAgICAjIFdlIGNhbiBkZWZpbmUgYSBmaWx0ZXIgZnVuY3Rpb24gdG8gc2hvdyBvbmx5IHNvbWUgc2VsZWN0ZWQgY291bnRyaWVzXG4jICAgICBpZiB0aGF0LmZpbHRlclxuIyAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIodGhhdC5maWx0ZXIpXG4jICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9IGQuZGlzZWFzZS50b0xvd2VyQ2FzZSgpXG4jICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiMgICAgICAgZC5jYXNlcyA9IHt9XG4jICAgICAgIGQudmFsdWVzID0ge31cbiMgICAgICAgIyBzZXQgdmFsdWUgZXMgY2FzZXMgLzEwMDAgaW5oYWJpdGFudHNcbiMgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBwb3B1bGF0aW9uX2Nzdi5maWx0ZXIoKGNvdW50cnkpIC0+XG4jICAgICAgICAgY291bnRyeS5jb2RlID09IGQuY29kZVxuIyAgICAgICApXG4jICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiMgICAgICAgICB5ZWFyID0gMTk4MFxuIyAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4jICAgICAgICAgICBpZiBkW3llYXJdXG4jICAgICAgICAgICAgIHBvcHVsYXRpb24gPSArcG9wdWxhdGlvbkl0ZW1bMF1beWVhcl1cbiMgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSAxMDAwICogKCtkW3llYXJdIC8gcG9wdWxhdGlvbik7XG4jICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4jICAgICAgICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSAxMDAwICogK2RbeWVhcl0gLyBwb3B1bGF0aW9uXG4jICAgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgZFt5ZWFyXSk7XG4jICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiMgICAgICAgICAgIHllYXIrK1xuIyAgICAgICBlbHNlXG4jICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiMgICAgICAgIyBHZXQgdG90YWwgY2FzZXMgYnkgY291bnRyeSAmIGRpc2Vhc2VcbiMgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT5cbiMgICAgICAgICBhICsgYlxuIyAgICAgICApLCAwKVxuIyAgICAgICByZXR1cm5cbiMgICAgIHNldHVwRGF0YSgpXG4jICAgICBzZXR1cEdyYXBoKClcbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBEYXRhID0gLT5cbiMgICAgICMgRmlsdGVyIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuIyAgICAgY3VycmVudERhdGEgPSBkYXRhLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZC5kaXNlYXNlID09IGRpc2Vhc2UgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuIyAgICAgKVxuIyAgICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgY291bnRyeSBuYW1lc1xuIyAgICAgY291bnRyaWVzID0gY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICBkLmNvZGVcbiMgICAgIClcbiMgICAgICMgR2V0IGFycmF5IG9mIHllYXJzXG4jICAgICBtaW5ZZWFyID0gZDMubWluKGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWluIGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICBtYXhZZWFyID0gZDMubWF4KGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWF4IGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICB5ZWFycyA9IGQzLnJhbmdlKG1pblllYXIsIG1heFllYXIsIDEpXG4jICAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4jICAgICAjY29uc29sZS5sb2cobWluWWVhciwgbWF4WWVhciwgeWVhcnMpO1xuIyAgICAgI2NvbnNvbGUubG9nKGNvdW50cmllcyk7XG4jICAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuIyAgICAgY2VsbHNEYXRhID0gW11cbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuIyAgICAgICAgIGNlbGxzRGF0YS5wdXNoXG4jICAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiMgICAgICAgICAgIG5hbWU6IGQubmFtZVxuIyAgICAgICAgICAgeWVhcjogdmFsdWVcbiMgICAgICAgICAgIGNhc2VzOiBkLmNhc2VzW3ZhbHVlXVxuIyAgICAgICAgICAgdmFsdWU6IGQudmFsdWVzW3ZhbHVlXVxuIyAgICAgICByZXR1cm5cblxuIyAgICAgIyMjXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuIyAgICAgICB2YXIgY291bnRlciA9IDA7XG4jICAgICAgIHllYXJzLmZvckVhY2goZnVuY3Rpb24oeWVhcil7XG4jICAgICAgICAgaWYgKGRbeWVhcl0pXG4jICAgICAgICAgICBjb3VudGVyKys7XG4jICAgICAgIH0pO1xuIyAgICAgICBpZihjb3VudGVyIDw9IDIwKSAvLyB5ZWFycy5sZW5ndGgvMilcbiMgICAgICAgICBjb25zb2xlLmxvZyhkLm5hbWUgKyAnIGhhcyBvbmx5IHZhbHVlcyBmb3IgJyArIGNvdW50ZXIgKyAnIHllYXJzJyk7XG4jICAgICB9KTtcbiMgICAgICMjI1xuXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwR3JhcGggPSAtPlxuIyAgICAgIyBHZXQgZGltZW5zaW9ucyAoaGVpZ2h0IGlzIGJhc2VkIG9uIGNvdW50cmllcyBsZW5ndGgpXG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIHguZG9tYWluKHllYXJzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgd2lkdGhcbiMgICAgIF1cbiMgICAgIHkuZG9tYWluKGNvdW50cmllcykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIGhlaWdodFxuIyAgICAgXVxuIyAgICAgI2NvbG9yLmRvbWFpbihbZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSwgMF0pO1xuIyAgICAgY29sb3IuZG9tYWluIFtcbiMgICAgICAgMFxuIyAgICAgICA0XG4jICAgICBdXG4jICAgICAjY29uc29sZS5sb2coJ01heGltdW0gY2FzZXMgdmFsdWU6ICcrIGQzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSkpO1xuIyAgICAgIyBBZGQgc3ZnXG4jICAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnICsgaWQgKyAnIC5ncmFwaC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4JylcbiMgICAgICMgRHJhdyBjZWxsc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4Jykuc2VsZWN0QWxsKCcuY2VsbCcpLmRhdGEoY2VsbHNEYXRhKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbCcpLnN0eWxlKCdiYWNrZ3JvdW5kJywgKGQpIC0+XG4jICAgICAgIGNvbG9yIGQudmFsdWVcbiMgICAgICkuY2FsbChzZXRDZWxsRGltZW5zaW9ucykub24oJ21vdXNlb3ZlcicsIG9uTW91c2VPdmVyKS5vbiAnbW91c2VvdXQnLCBvbk1vdXNlT3V0XG4jICAgICAjIERyYXcgeWVhcnMgeCBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd4LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoeWVhcnMuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkICUgNSA9PSAwXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ2xlZnQnLCAoZCkgLT5cbiMgICAgICAgeChkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZFxuIyAgICAgIyBEcmF3IGNvdW50cmllcyB5IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YShjb3VudHJpZXMpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgndG9wJywgKGQpIC0+XG4jICAgICAgIHkoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGdldENvdW50cnlOYW1lIGRcbiMgICAgICMgRHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5zZWxlY3RBbGwoJy5tYXJrZXInKS5kYXRhKGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAge1xuIyAgICAgICAgIGNvZGU6IGQuY29kZVxuIyAgICAgICAgIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgfVxuIyAgICAgKS5maWx0ZXIoKGQpIC0+XG4jICAgICAgICFpc05hTihkLnllYXIpXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnbWFya2VyJykuY2FsbCBzZXRNYXJrZXJEaW1lbnNpb25zXG4jICAgICByZXR1cm5cblxuIyAgIGNsZWFyID0gLT5cbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnJlbW92ZSgpXG4jICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcuYXhpcycpLnJlbW92ZSgpXG4jICAgICByZXR1cm5cblxuXG5cbiIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbkl0ZW1XaWR0aCA9IDMwXG4gICAgbGVnZW5kRGF0YSA9IEBnZXRMZWdlbmREYXRhKClcbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGkrMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IChkKSAtPiBkXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnU2NhdHRlcnBsb3QgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA3XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqA3XG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDEyXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjI1KVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50KDAuNSlcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRDb2xvclJhbmdlOiA9PlxuICAgIHJldHVybiBbJyNDOUFENEInLCAnI0JCRDY0NicsICcjNjNCQTJEJywgJyMzNEE4OTMnLCAnIzNEOTFBRCcsICcjNUI4QUNCJywgJyNCQTdEQUYnLCAnI0JGNkI4MCcsICcjRjQ5RDlEJywgJyNFMjU0NTMnLCAnI0I1NjYzMScsICcjRTI3NzNCJywgJyNGRkE5NTEnLCAnI0Y0Q0EwMCddXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIGQzLmV4dGVudCBAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHNldCBjb2xvciBkb21haW5cbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCBzaXplIGRvbWFpblxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBwb2ludHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdElkXG4gICAgICAuYXR0ciAncicsIEBnZXREb3RTaXplXG4gICAgICAuc3R5bGUgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90LWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdExhYmVsSWRcbiAgICAgIC5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAuYXR0ciAnZHknLCAnMC4zNzVlbSdcbiAgICAgIC50ZXh0IEBnZXREb3RMYWJlbFRleHRcbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZG90cyBwb3NpdGlvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RG90SWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90TGFiZWxJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbFRleHQ6IChkKSA9PlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RTaXplOiAoZCkgPT5cbiAgICBpZiBAc2l6ZVxuICAgICAgcmV0dXJuIEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcHRpb25zLmRvdFNpemVcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICBpZiBAY29sb3JcbiAgICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcblxuICBzZXREb3RzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMYWJlbHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICAjIG92ZXJyaWQgeCBheGlzIHBvc2l0aW9uaW5nXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKSdcblxuICBvblJlc2l6ZTogPT5cbiAgICBpZiBAJGVsIGFuZCBAY29udGFpbmVyV2lkdGggIT0gQCRlbC53aWR0aCgpXG4gICAgICBzdXBlcigpXG4gICAgcmV0dXJuIEBcblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpXG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgK2VsZW1lbnQuYXR0cignY3gnKSArIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgdG9wOiAgICAgK2VsZW1lbnQuYXR0cignY3knKSArIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSAxNVxuICAgICAgb3BhY2l0eTogMVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlLXgnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS54XVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS15J1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkueV1cblxuICAgICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdERpc2NyZXRlR3JhcGggZXh0ZW5kcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ1NjYXR0ZXJwbG90IERpc2NyZXRlIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlc1xuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIEB5ID0gZDMuc2NhbGVQb2ludCgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgeSBzY2FsZSBkb21haW5cbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBnZXQgZGltZW5zaW9uc1xuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc3ZnLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlIHJhbmdlXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoKVxuICAgICAgICAucmFuZ2UgQGdldENvbG9yUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIEBzaXplID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgc3VwZXIoKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIGRyYXcgZG90IGxpbmVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdC1saW5lJ1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdExpbmVJZFxuICAgICAgLnN0eWxlICdzdHJva2UnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdExpbmVzRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICB2YWNjaW5lcyA9IGQzLm5lc3QoKVxuICAgICAgLmtleSAoZCkgLT4gZC52YWNjaW5lXG4gICAgICAuZW50cmllcyBAZGF0YVxuICAgIHZhY2NpbmVzLnNvcnQgKGEsYikgLT4gaWYgYS5rZXkgPiBiLmtleSB0aGVuIDEgZWxzZSAtMVxuICAgIGQzLnNlbGVjdCgnIycrQGlkKycgLmdyYXBoLWxlZ2VuZCB1bCcpLnNlbGVjdEFsbCgnbGknKVxuICAgICAgLmRhdGEodmFjY2luZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2xlZ2VuZC1pdGVtLScrZC5rZXlcbiAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSAtPiBkLnZhbHVlc1swXS52YWNjaW5lX2NvbG9yICNAY29sb3IgZC5rZXlcbiAgICAgIC5odG1sIChkKSAtPiBkLnZhbHVlc1swXS52YWNjaW5lX25hbWVcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgKGQpID0+IEBoaWdobGlnaHRWYWNjaW5lcyBkLmtleVxuICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIGlmIEB5XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAeS5kb21haW4oKS5sZW5ndGggKiAzMFxuICAgICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGxpbmVzIHNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1saW5lJylcbiAgICAgIC5jYWxsIEBzZXREb3RMaW5lc0RpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKSdcblxuICBnZXREb3RJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF0rJy0nK2RbQG9wdGlvbnMua2V5LmNvbG9yXVxuICBcbiAgZ2V0RG90TGFiZWxJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF0rJy0nK2RbQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIGdldERvdExpbmVJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtbGluZS0nK2RbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGdldERvdExhYmVsVGV4dDogKGQpIC0+IFxuICAgIHJldHVybiAnJ1xuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS55XVxuXG4gIHNldERvdExpbmVzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IDBcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS55XVxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpXG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uIChhZGQgbGVnZW5kIGhlaWdodClcbiAgICBvZmZzZXRUb3AgPSBpZiBAb3B0aW9ucy5sZWdlbmQgdGhlbiAkKCcjJytAaWQrJyAuZ3JhcGgtbGVnZW5kJykuaGVpZ2h0KCkgZWxzZSAwXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgK2VsZW1lbnQuYXR0cignY3gnKSArIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgdG9wOiAgICAgK2VsZW1lbnQuYXR0cignY3knKSArIG9mZnNldFRvcCArIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSAxNVxuICAgICAgb3BhY2l0eTogMVxuICAgICMgaGlnaHRsaWdodCBzZWxlY3RlZCB2YWNjaW5lXG4gICAgQGhpZ2hsaWdodFZhY2NpbmVzIGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpLmRhdGEoKVswXVtAb3B0aW9ucy5rZXkuY29sb3JdXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgc3VwZXIoZClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGluZScpXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIGQzLnNlbGVjdEFsbCgnIycrQGlkKycgLmdyYXBoLWxlZ2VuZCBsaScpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuXG4gIGhpZ2hsaWdodFZhY2NpbmVzOiAodmFjY2luZSkgLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmZpbHRlciAoZCkgPT4gcmV0dXJuIGRbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSB2YWNjaW5lXG4gICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1saW5lJylcbiAgICAgIC5maWx0ZXIgKGQpID0+IHJldHVybiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gdmFjY2luZVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICAjIHNldCBzZWxlY3RlZCBkb3RzIG9uIHRvcFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5zb3J0IChhLGIpID0+IGlmIGFbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSB2YWNjaW5lIHRoZW4gMSBlbHNlIC0xXG4gICAgIyBzZXQgbGVnZW5kXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBkMy5zZWxlY3RBbGwoJyMnK0BpZCsnIC5ncmFwaC1sZWdlbmQgbGknKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCB0cnVlXG4gICAgICBkMy5zZWxlY3RBbGwoJyMnK0BpZCsnICNsZWdlbmQtaXRlbS0nK3ZhY2NpbmUpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cblxuICBzZXRUb29sdGlwRGF0YTogKGQpIC0+XG4gICAgZG9zZXNGb3JtYXQgPSBkMy5mb3JtYXQoJy4wcycpXG4gICAgcHJpY2VzRm9ybWF0ID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFjY2luZSdcbiAgICAgIC5odG1sIGQudmFjY2luZV9uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnByaWNlJ1xuICAgICAgLmh0bWwgcHJpY2VzRm9ybWF0KGQucHJpY2UpXG4gICAgY29tcGFueSA9ICcnXG4gICAgaWYgZC5jb21wYW55XG4gICAgICBjb21wYW55ID0gZC5jb21wYW55XG4gICAgICBpZiBkLmNvbXBhbnkyXG4gICAgICAgIGNvbXBhbnkgKz0gJywgJytkLmNvbXBhbnkyXG4gICAgICBpZiBkLmNvbXBhbnkzXG4gICAgICAgIGNvbXBhbnkgKz0gJywgJytkLmNvbXBhbnkzXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNvbXBhbnknXG4gICAgICAuaHRtbCBjb21wYW55XG4gICAgIiwiY2xhc3Mgd2luZG93LlNjYXR0ZXJwbG90VlBIR3JhcGggZXh0ZW5kcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgbGFuZywgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ1NjYXR0ZXJwbG90IEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBvcHRpb25zLmRvdFNpemUgPSA3XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gM1xuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IDE4XG4gICAgQGxhbmcgPSBsYW5nXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50KDAuMTI1KVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50KDAuNSlcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgICAgLnRpY2tWYWx1ZXMgWzEwMjQsIDQwMzQsIDEyNDc0XVxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICAgLnRpY2tWYWx1ZXMgWzE1LCAzMCwgNDUsIDYwLCA3NSwgOTBdXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyNTAsIDEwMjAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCA5MF1cblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICByZXR1cm4gaWYgZFtAb3B0aW9ucy5rZXkuY29sb3JdID09ICcxJyB0aGVuICcjMDA3OTdkJyBlbHNlIGlmIGRbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSAnMCcgdGhlbiAnI0Q2NEIwNScgZWxzZSAnI2FhYScgICAgICAgXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBwb2ludHNcbiAgICBzdXBlcigpXG4gICAgQHJpbmdOb3RlID0gZDMucmluZ05vdGUoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG4gICAgQHNldFhMZWdlbmQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0WExlZ2VuZDogLT5cbiAgICBpbmNvbWVHcm91cHMgPSBbQHguZG9tYWluKClbMF0sIDEwMjYsIDQwMzYsIDEyNDc2LCBAeC5kb21haW4oKVsxXV1cbiAgICBAJGVsLmZpbmQoJy54LWxlZ2VuZCBsaScpLmVhY2ggKGksIGVsKSA9PlxuICAgICAgdmFsID0gMTAwICogKEB4KGluY29tZUdyb3Vwc1tpKzFdKSAtIEB4KGluY29tZUdyb3Vwc1tpXSkpIC8gQHdpZHRoXG4gICAgICAkKGVsKS53aWR0aCB2YWwrJyUnXG5cblxuICBzZXRBbm5vdGF0aW9uczogLT5cbiAgICBhbm5vdGF0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgJ2N4JzogMC4yMypAaGVpZ2h0XG4gICAgICAgICdjeSc6IDAuMTcqQGhlaWdodFxuICAgICAgICAncic6IDAuMjIqQGhlaWdodFxuICAgICAgICAndGV4dFdpZHRoJzogMC4zOCpAd2lkdGhcbiAgICAgICAgJ3RleHRPZmZzZXQnOiBbMC4yNSpAaGVpZ2h0LCAwXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ2N4JzogMC4yOCpAaGVpZ2h0XG4gICAgICAgICdjeSc6IDAuNDYqQGhlaWdodFxuICAgICAgICAncic6IDAuMDcyKkBoZWlnaHRcbiAgICAgICAgJ3RleHRXaWR0aCc6IDAuMzYqQHdpZHRoXG4gICAgICAgICd0ZXh0T2Zmc2V0JzogWzAuMTgqQGhlaWdodCwgMF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdjeCc6IEB3aWR0aCAtIDAuMzUqQGhlaWdodFxuICAgICAgICAnY3knOiBAaGVpZ2h0IC0gMC4xMipAaGVpZ2h0XG4gICAgICAgICdyJzogMC4xNSpAaGVpZ2h0XG4gICAgICAgICd0ZXh0V2lkdGgnOiAwLjM4KkB3aWR0aFxuICAgICAgICAndGV4dE9mZnNldCc6IFswLCAtMC4yKkBoZWlnaHRdXG4gICAgICB9XG4gICAgXVxuICAgICMgZ2V0IGFubm90YXRpb25zIHRleHRzIGZyb20gaHRtbFxuICAgICQoJyN2YWNjaW5lLXZwaC1jb250YWluZXItZ3JhcGggLm1vYmlsZS1waWN0dXJlcyBwJykuZWFjaCAoaSwgZWwpIC0+XG4gICAgICBhbm5vdGF0aW9uc1tpXS50ZXh0ID0gJChlbCkuaHRtbCgpXG4gICAgQGNvbnRhaW5lci5jYWxsIEByaW5nTm90ZSwgYW5ub3RhdGlvbnNcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgZm9ybWF0RmxvYXQgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy52YWNjaW5lIHNwYW4nXG4gICAgICAuY3NzICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnZhY2NpbmUtJytkW0BvcHRpb25zLmtleS5jb2xvcl1cbiAgICAgIC5jc3MgJ2Rpc3BsYXknLCAnaW5saW5lJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS15J1xuICAgICAgLmh0bWwgZm9ybWF0RmxvYXQoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgIiwiIyBNYWluIHNjcmlwdCBmb3IgdmFjY2luZXMgcHJpY2VzIGFydGljbGVcbmNsYXNzIHdpbmRvdy5WYWNjaW5lc1ByaWNlc1xuXG4gIHZhY2NpbmVzX25hbWVzOlxuICAgIGVzOlxuICAgICAgJ0JDRyc6ICdUdWJlcmN1bG9zaXMgKEJDRyknXG4gICAgICAnRFRhUCc6ICdEaWZ0ZXJpYSwgdMOpdGFub3MgeSB0b3MgZmVyaW5hIGFjZWx1bGFyIChEVGFQKSdcbiAgICAgICdEVFAnOiAnRGlmdGVyaWEsIHTDqXRhbm9zIHkgdG9zIGZlcmluYSAoRFRQKSdcbiAgICAgICdEVFBhLUlQVi1IaWInOiAnUGVudGF2YWxlbnRlIChEVFAsIHBvbGlvIGUgSGliKSdcbiAgICAgICdIZXBCLXBlZGnDoXRyaWNhJzogJ0hlcGF0aXRpcyBCIHBlZGnDoXRyaWNhJ1xuICAgICAgJ0lQVic6ICdQb2xpbyAoSVBWKSdcbiAgICAgICdNTVInOiAnU2FyYW1wacOzbiwgcGFwZXJhcyB5IHJ1YmVvbGEnXG4gICAgICAncG5ldW1vMTMnOiAnTmV1bW9jb2NvICgxMyknXG4gICAgICAnVGRhcCc6ICdUw6l0YW5vcywgZGlmdGVyaWEgeSB0b3MgZmVyaW5hIGFjZWx1bGFyIHJlZHVjaWRhIChUZGFwKSdcbiAgICAgICdWUEgnOiAnVmlydXMgZGVsIHBhcGlsb21hIGh1bWFubyAoVlBIKSdcbiAgICAgICdWUEgtQ2VydmFyaXgyJzogJ1ZQSCBDZXJ2YXJpeDInXG4gICAgICAnVlBILUdhcmRhc2lsNCc6ICdWUEggR2FyZGFzaWw0J1xuICAgICAgJ1ZQSC1HYXJkYXNpbDknOiAnVlBIIEdhcmRhc2lsOSdcbiAgICBlbjpcbiAgICAgICdCQ0cnOiAnVHViZXJjdWxvc2lzIChCQ0cpJ1xuICAgICAgJ0RUYVAnOiAnRGlwaHRlcmlhLCB0ZXRhbnVzIGFuZCBhY2VsbHVsYXIgcGVydHVzc2lzIChEVGFQKSdcbiAgICAgICdEVFAnOiAnRGlwaHRlcmlhLCB0ZXRhbnVzIGFuZCBwZXJ0dXNzaXMgKERUUCknXG4gICAgICAnRFRQYS1JUFYtSGliJzogJ1BlbnRhdmFsZW50IChEVFAsIHBvbGlvIGFuZCBIaWIpJ1xuICAgICAgJ0hlcEItcGVkacOhdHJpY2EnOiAnSGVwYXRpdGlzIEIgcGVkaWF0cmljJ1xuICAgICAgJ0lQVic6ICdQb2xpbyAoSVBWKSdcbiAgICAgICdNTVInOiAnTWVhc2xlcywgbXVtcHMgYW5kIHJ1YmVsbGEnXG4gICAgICAncG5ldW1vMTMnOiAnUG5ldW1vY29jY3VzICgxMyknXG4gICAgICAnVGRhcCc6ICdUZXRhbnVzLCByZWR1Y2VkIGRpcGh0aGVyaWEgYW5kIHJlZHVjZWQgYWNlbGx1bGFyIHBlcnR1c3NpcyAoVGRhcCknXG4gICAgICAnVlBIJzogJ0h1bWFuIHBhcGlsb21hdmlydXMgKEhQViknXG4gICAgICAnVlBILUNlcnZhcml4Mic6ICdWUEggQ2VydmFyaXgyJ1xuICAgICAgJ1ZQSC1HYXJkYXNpbDQnOiAnVlBIIEdhcmRhc2lsNCdcbiAgICAgICdWUEgtR2FyZGFzaWw5JzogJ1ZQSCBHYXJkYXNpbDknXG5cbiAgdmFjY2luZXNfY29sb3JzOlxuICAgICdCQ0cnOiAnI0M5QUQ0QidcbiAgICAnRFRhUCc6ICcjNjNCQTJEJ1xuICAgICdEVFAnOiAnIzM0QTg5MydcbiAgICAnRFRQYS1JUFYtSGliJzogJyNCQkQ2NDYnXG4gICAgJ0hlcEItcGVkacOhdHJpY2EnOiAnIzNEOTFBRCdcbiAgICAnSVBWJzogJyM1QjhBQ0InXG4gICAgJ01NUic6ICcjRTI3NzNCJ1xuICAgICdwbmV1bW8xMyc6ICcjQkE3REFGJ1xuICAgICdUZGFwJzogJyNGNDlEOUQnXG4gICAgJ1ZQSC1DZXJ2YXJpeDInOiAnI0ZGQTk1MSdcbiAgICAnVlBILUdhcmRhc2lsNCc6ICcjQjU2NjMxJ1xuICAgICdWUEgtR2FyZGFzaWw5JzogJyNFMjU0NTMnXG5cbiAgY29uc3RydWN0b3I6IChfbGFuZywgX2Jhc2V1cmwsIF9kYXRhdXJsKSAtPlxuICAgIEBsYW5nID0gX2xhbmdcbiAgICAjIGxvYWQgZGF0YVxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIF9iYXNldXJsK19kYXRhdXJsXG4gICAgICAuZGVmZXIgZDMuY3N2LCBfYmFzZXVybCsnL2RhdGEvZ2RwLmNzdidcbiAgICAgICMuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAgIC5hd2FpdCBAb25EYXRhTG9hZGVkXG5cbiAgb25EYXRhTG9hZGVkOiAoZXJyb3IsIF9kYXRhLCBfY291bnRyaWVzKSA9PlxuICAgIEBkYXRhID0gX2RhdGFcbiAgICBAY291bnRyaWVzID0gX2NvdW50cmllc1xuICAgIEBwYXJzZURhdGEoKVxuICAgICMgYWxsIHZhY2NpbmVzIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy1hbGwtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtYWxsLWdyYXBoJywgQGRhdGEsIHRydWVcbiAgICAjIG9yZ2FuaXphdGlvbnMgcHJpY2VzXG4gICAgaWYgJCgnI3ZhY2NpbmUtcHJpY2VzLW9yZ2FuaXphdGlvbnMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBkYXRhT3JnYW5pemF0aW9ucyA9IEBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb3VudHJ5ID09ICdNU0YnIHx8IGQuY291bnRyeSA9PSAnUEFITycgfHwgZC5jb3VudHJ5ID09ICdVTklDRUYnXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtb3JnYW5pemF0aW9ucy1ncmFwaCcsIGRhdGFPcmdhbml6YXRpb25zLCB0cnVlXG4gICAgIyBUZGFwIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy10ZGFwLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgZGF0YVRkYXAgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQudmFjY2luZSA9PSAnVGRhcCdcbiAgICAgIEBzZXR1cFNjYXR0ZXJwbG90ICd2YWNjaW5lLXByaWNlcy10ZGFwLWdyYXBoJywgZGF0YVRkYXAsIGZhbHNlXG4gICAgIyBJUFYgcHJpY2VzXG4gICAgaWYgJCgnI3ZhY2NpbmUtcHJpY2VzLWlwdi1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIGRhdGFJUFYgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQudmFjY2luZSA9PSAnSVBWJyBhbmQgZC5jb3VudHJ5ICE9ICdNU0YnIGFuZCBkLmNvdW50cnkgIT0gJ1BBSE8nIGFuZCBkLmNvdW50cnkgIT0gJ1VOSUNFRidcbiAgICAgIEBzZXR1cFNjYXR0ZXJwbG90ICd2YWNjaW5lLXByaWNlcy1pcHYtZ3JhcGgnLCBkYXRhSVBWLCBmYWxzZVxuICAgICMgVlBIIHByaWNlc1xuICAgIGlmICQoJyN2YWNjaW5lLXByaWNlcy12cGgtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICBAc2V0dXBTY2F0dGVycGxvdCAndmFjY2luZS1wcmljZXMtdnBoLWdyYXBoJywgQGRhdGEsIHRydWVcbiAgICAjIFBJQiBjb3VudHJpZXNcbiAgICBpZiAkKCcjcGliLWNvdW50cmllcy1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIHBpYkRhdGEgPSBkMy5uZXN0KClcbiAgICAgICAgLmtleSAoZCkgLT4gZC5jb3VudHJ5XG4gICAgICAgIC5lbnRyaWVzIEBkYXRhXG4gICAgICBwaWJEYXRhID0gcGliRGF0YS5tYXAgKGQpIC0+XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGQua2V5XG4gICAgICAgICAgbmFtZTogZC52YWx1ZXNbMF0ubmFtZVxuICAgICAgICAgIGdkcDogZC52YWx1ZXNbMF0uZ2RwKjAuOTM3XG4gICAgICAgIH1cbiAgICAgIHBpYkRhdGEgPSBwaWJEYXRhXG4gICAgICAgIC5maWx0ZXIgKGQpIC0+IGQuZ2RwID4gMFxuICAgICAgICAuc29ydCAoYSxiKSAtPiBiLmdkcCAtIGEuZ2RwXG4gICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFyR3JhcGgoJ3BpYi1jb3VudHJpZXMtZ3JhcGgnLFxuICAgICAgICBsYWJlbDpcbiAgICAgICAgICBmb3JtYXQ6IChkKSAtPlxuICAgICAgICAgICAgZiA9IGQzLmZvcm1hdCgnLGQnKVxuICAgICAgICAgICAgcmV0dXJuIGYoZCkrJ+KCrCdcbiAgICAgICAgbWFyZ2luOlxuICAgICAgICAgIHJpZ2h0OiAxMFxuICAgICAgICAgIGxlZnQ6IDEwXG4gICAgICAgIGtleTpcbiAgICAgICAgICB4OiAnbmFtZSdcbiAgICAgICAgICB5OiAnZ2RwJ1xuICAgICAgICAgIGlkOiAnaWQnKVxuICAgICAgZ3JhcGguc2V0RGF0YSBwaWJEYXRhXG4gICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIHZhY2NpbmVzID0gWydwbmV1bW8xMycsJ0JDRycsJ0lQVicsJ01NUicsJ0hlcEItcGVkacOhdHJpY2EnLCdWUEgtQ2VydmFyaXgyJywnVlBILUdhcmRhc2lsNCcsJ1ZQSC1HYXJkYXNpbDknLCdEVFBhLUlQVi1IaWInLCdEVGFQJywnVGRhcCcsJ0RUUCddXG4gICAgIyBmaWx0ZXIgZGF0YSB0byBnZXQgb25seSBzZWxlY3RlZCB2YWNjaW5lc1xuICAgIEBkYXRhID0gQGRhdGEuZmlsdGVyIChkKSAtPiB2YWNjaW5lcy5pbmRleE9mKGQudmFjY2luZSkgIT0gLTFcbiAgICAjIGpvaW4gZGF0YSAmIGNvdW50cmllcyBnZHBcbiAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgY291bnRyeSA9IEBjb3VudHJpZXMuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb3VudHJ5XG4gICAgICBkLnByaWNlID0gK2QucHJpY2VcbiAgICAgIGQudmFjY2luZV9uYW1lID0gaWYgQHZhY2NpbmVzX25hbWVzW0BsYW5nXVtkLnZhY2NpbmVdIHRoZW4gQHZhY2NpbmVzX25hbWVzW0BsYW5nXVtkLnZhY2NpbmVdIGVsc2UgZC52YWNjaW5lXG4gICAgICBkLnZhY2NpbmVfY29sb3IgPSBAdmFjY2luZXNfY29sb3JzW2QudmFjY2luZV1cbiAgICAgIGlmIGNvdW50cnlbMF1cbiAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK0BsYW5nXVxuICAgICAgICBkLmdkcCA9IGNvdW50cnlbMF0udmFsdWVcbiAgICAgIGVsc2VcbiAgICAgICAgZC5uYW1lID0gZFsnbmFtZV8nK0BsYW5nXVxuICAgICAgICBkLmdkcCA9IDBcbiAgICAjIHNvcnQgZGF0YSBieSBnZHBcbiAgICBAZGF0YS5zb3J0IChhLGIpIC0+IGEuZ2RwIC0gYi5nZHBcblxuICBzZXR1cFNjYXR0ZXJwbG90OiAoX2lkLCBfZGF0YSwgX2xlZ2VuZCkgLT5cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuU2NhdHRlcnBsb3REaXNjcmV0ZUdyYXBoKF9pZCxcbiAgICAgIGxlZ2VuZDogX2xlZ2VuZFxuICAgICAgbWFyZ2luOlxuICAgICAgICB0b3A6IDVcbiAgICAgICAgcmlnaHQ6IDVcbiAgICAgICAgbGVmdDogNjBcbiAgICAgICAgYm90dG9tOiAyMFxuICAgICAga2V5OlxuICAgICAgICB4OiAncHJpY2UnXG4gICAgICAgIHk6ICduYW1lJ1xuICAgICAgICBpZDogJ2NvdW50cnknXG4gICAgICAgIGNvbG9yOiAndmFjY2luZScpXG4gICAgZ3JhcGgueUF4aXMudGlja1BhZGRpbmcgMTJcbiAgICBncmFwaC54QXhpc1xuICAgICAgLnRpY2tzIDVcbiAgICAgIC50aWNrUGFkZGluZyAxMFxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJ+KCrCdcbiAgICAjIG92ZXJkcml2ZSBjb2xvciBmaWxsIG1ldGhvZFxuICAgIGdyYXBoLmdldERvdEZpbGwgPSAoZCkgLT4gZC52YWNjaW5lX2NvbG9yXG4gICAgIyBzZXQgZGF0YVxuICAgIGdyYXBoLnNldERhdGEgX2RhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4iLCIjIE1haW4gc2NyaXB0IGZvciB2YWNjaW5lcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICMgbGlzdCBvZiBleGNsdWRlZCBjb3VudHJpZXMgY29kZXMgKGNvdW50cmllcyB3aXRoIGxlc3MgdGhhbiAzMDAuMDAwIGluaGFiaXRhbnRzIGluIDIwMTUpXG4gIGV4Y2x1ZGVkQ291bnRyaWVzID0gWydOSVUnLCdDT0snLCdUVVYnLCdOUlUnLCdQTFcnLCdWR0InLCdNQUYnLCdTTVInLCdHSUInLCdUQ0EnLCdMSUUnLCdNQ08nLCdTWE0nLCdGUk8nLCdNSEwnLCdNTlAnLCdBU00nLCdLTkEnLCdHUkwnLCdDWScsJ0JNVScsJ0FORCcsJ0RNQScsJ0lNTicsJ0FURycsJ1NZQycsJ1ZJUicsJ0FCVycsJ0ZTTScsJ1RPTicsJ0dSRCcsJ1ZDVCcsJ0tJUicsJ0NVVycsJ0NISScsJ0dVTScsJ0xDQScsJ1NUUCcsJ1dTTScsJ1ZVVCcsJ05DTCcsJ1BZRicsJ0JSQiddXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBmb3JtYXRGbG9hdCA9IGQzLmZvcm1hdCgnLC4xZicpXG4gIGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcblxuICAjIEluaXQgVG9vbHRpcHNcbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKVxuXG5cbiAgIyBnZXQgY291bnRyeSBuYW1lIGF1eGlsaWFyIG1ldGhvZFxuICBnZXRDb3VudHJ5TmFtZSA9IChjb3VudHJpZXMsIGNvZGUsIGxhbmcpIC0+XG4gICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb2RlXG4gICAgaWYgaXRlbVxuICAgICAgaWYgbGFuZyA9PSAnZXMnXG4gICAgICAgIGl0ZW1bMF1bJ25hbWVfZXMnXVxuICAgICAgZWxzZVxuICAgICAgICBpdGVtWzBdWyduYW1lX2VuJ11cbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBjb2RlXG5cbiAgIyBWaWRlbyBvZiBtYXAgcG9saW8gY2FzZXNcbiAgc2V0VmlkZW9NYXBQb2xpbyA9IC0+XG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLXBvbGlvLWNhc2VzLXRvdGFsLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNhc2VzID0ge31cbiAgICAgIGNhc2VzU3RyID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc29zJyBlbHNlICdjYXNlcydcbiAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgY2FzZXNbZC55ZWFyXSA9IGQudmFsdWVcbiAgICAgICMgQWRkIHlvdXR1YmUgdmlkZW9cbiAgICAgIHdyYXBwZXIgPSBQb3Bjb3JuLkhUTUxZb3VUdWJlVmlkZW9FbGVtZW50KCcjdmlkZW8tbWFwLXBvbGlvJylcbiAgICAgIHdyYXBwZXIuc3JjID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL28tRXpWT2puYzZRP2NvbnRyb2xzPTAmc2hvd2luZm89MCZoZD0xJ1xuICAgICAgcG9wY29ybiA9IFBvcGNvcm4od3JhcHBlcilcbiAgICAgIG5vdGVzID0gMjAxNyAtIDE5ODBcbiAgICAgIHllYXJEdXJhdGlvbiA9IDI3Lyhub3RlcysxKSAjIHZpZGVvIGR1cmF0aW9uIGlzIDI3c2Vjb25kc1xuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBub3Rlc1xuICAgICAgICB5ZWFyID0gJycrKDE5ODAraSlcbiAgICAgICAgcG9wY29ybi5mb290bm90ZVxuICAgICAgICAgIHN0YXJ0OiAgeWVhckR1cmF0aW9uICogaVxuICAgICAgICAgIGVuZDogICAgaWYgaSA8IG5vdGVzLTEgdGhlbiB5ZWFyRHVyYXRpb24qKGkrMSkgZWxzZSAoeWVhckR1cmF0aW9uKihpKzEpKSsxXG4gICAgICAgICAgdGV4dDogICB5ZWFyICsgJzxicj48c3BhbiBjbGFzcz1cInZhbHVlXCI+JyArIGZvcm1hdEludGVnZXIoY2FzZXNbeWVhcl0pICsgJyAnICsgY2FzZXNTdHIgKyAnPC9zcGFuPidcbiAgICAgICAgICB0YXJnZXQ6ICd2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nXG4gICAgICAgIGkrK1xuICAgICAgIyBTaG93IGNvdmVyIHdoZW4gdmlkZW8gZW5kZWRcbiAgICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciAnZW5kZWQnLCAoZSkgLT5cbiAgICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLnNob3coKVxuICAgICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uLCAjdmlkZW8tbWFwLXBvbGlvIGlmcmFtZScpLmZhZGVUbyAwLCAwXG4gICAgICAgIHBvcGNvcm4uY3VycmVudFRpbWUgMFxuICAgICAgIyBTaG93IHZpZGVvIHdoZW4gcGxheSBidG4gY2xpY2tlZFxuICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1wbGF5LWJ0bicpLmNsaWNrIChlKSAtPlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcG9wY29ybi5wbGF5KClcbiAgICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVPdXQoKVxuICAgICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uLCAjdmlkZW8tbWFwLXBvbGlvIGlmcmFtZScpLmZhZGVUbyAzMDAsIDFcblxuXG4gICMgTWVhc2xlcyBXb3JsZCBNYXAgR3JhcGhcbiAgc2V0dXBNZWFzbGVzV29ybGRNYXBHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL21lYXNsZXMtY2FzZXMtd2hvLXJlZ2lvbnMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy13aG8tcmVnaW9ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgICMgYWRkIGNhc2VzIHRvIGVhY2ggY291bnRyeVxuICAgICAgICBjb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSkgLT5cbiAgICAgICAgICByZWdpb24gPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5yZWdpb24gPT0gY291bnRyeS5yZWdpb25cbiAgICAgICAgICBpZiByZWdpb24ubGVuZ3RoID4gMFxuICAgICAgICAgICAgY291bnRyeS52YWx1ZSA9IHJlZ2lvblswXS5jYXNlcyoxMDAwMDBcbiAgICAgICAgICAgIGNvdW50cnkuY2FzZXMgPSByZWdpb25bMF0uY2FzZXNfdG90YWxcbiAgICAgICAgICAgIGNvdW50cnkubmFtZSA9IHJlZ2lvblswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgnbWVhc2xlcy13b3JsZC1tYXAtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLnNldERhdGEgY291bnRyaWVzLCBtYXBcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgTWVhc2xlcyBjYXNlcyBIZWF0bWFwIEdyYXBoXG4gIHNldHVwSGVhdE1hcEdyYXBoID0gKGlkLCBkYXRhLCBjb3VudHJpZXMsIGxlZ2VuZCkgLT5cbiAgICBkYXRhID0gZGF0YVxuICAgICAgLmZpbHRlciAoZCkgLT4gY291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSAhPSAtMSBhbmQgZDMudmFsdWVzKGQudmFsdWVzKS5sZW5ndGggPiAwXG4gICAgICAuc29ydCAoYSxiKSAtPiBhLnRvdGFsIC0gYi50b3RhbFxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5IZWF0bWFwR3JhcGgoaWQsXG4gICAgICBsZWdlbmQ6IGxlZ2VuZFxuICAgICAgbWFyZ2luOlxuICAgICAgICByaWdodDogMFxuICAgICAgICBsZWZ0OiAwKVxuICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICMgU29ydCBkYXRhXG4jICAgICBpZiBzb3J0ID09ICd5ZWFyJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGlmIGlzTmFOKGEueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gMSBlbHNlIGlmIGlzTmFOKGIueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gLTEgZWxzZSBiLnllYXJfaW50cm9kdWN0aW9uIC0gKGEueWVhcl9pbnRyb2R1Y3Rpb24pXG4jICAgICBlbHNlIGlmIHNvcnQgPT0gJ2Nhc2VzJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGIudG90YWwgLSAoYS50b3RhbClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICBzZXR1cFZhY2NpbmVDb25maWRlbmNlQmFyR3JhcGggPSAtPlxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9jb25maWRlbmNlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgICAgIHVubGVzcyBsb2NhdGlvblxuICAgICAgICAgIGxvY2F0aW9uID0ge31cbiAgICAgICAgICBpZiBsYW5nID09ICdkZSdcbiAgICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSAnREVVJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxvY2F0aW9uLmNvZGUgPSAnRVNQJ1xuICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgZC52YWx1ZSA9ICtkLnZhbHVlXG4gICAgICAgICAgaWYgbGFuZyA9PSAnZGUnXG4gICAgICAgICAgICBkLm5hbWUgPSBkWyduYW1lX2VuJ11cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkLm5hbWUgPSBkWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBkZWxldGUgZC5uYW1lX2VzXG4gICAgICAgICAgZGVsZXRlIGQubmFtZV9lblxuICAgICAgICAgICMgc2V0IHVzZXIgY291bnRyeSBhY3RpdmVcbiAgICAgICAgICBpZiBsb2NhdGlvbiBhbmQgZC5jb2RlID09IGxvY2F0aW9uLmNvZGVcbiAgICAgICAgICAgIGQuYWN0aXZlID0gdHJ1ZVxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFyR3JhcGgoJ3ZhY2NpbmUtY29uZmlkZW5jZS1ncmFwaCcsXG4gICAgICAgICAgYXNwZWN0UmF0aW86IDAuM1xuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZm9ybWF0OiAoZCkgLT4gIGZvcm1hdEZsb2F0KGQpKyclJ1xuICAgICAgICAgIG1hcmdpbjogdG9wOiAwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgeDogJ25hbWUnXG4gICAgICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgICAgICBpZDogJ2NvZGUnKVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwVmFjY2luZUJjZ0Nhc2VzTWFwID0gLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdHViZXJjdWxvc2lzLWNhc2VzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgZGF0YS5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgZC52YWx1ZSA9ICtkLmNhc2VzX3BvcHVsYXRpb25cbiAgICAgICAgICBkLmNhc2VzID0gK2QuY2FzZXNcbiAgICAgICAgICBpZiBpdGVtXG4gICAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICAgICMgc2V0IGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5NYXBHcmFwaCgndmFjY2luZS1iY2ctY2FzZXMtZ3JhcGgnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLmdldExlZ2VuZERhdGEgPSAtPiBbMCwyMDAsNDAwLDYwMCw4MDBdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YSwgbWFwXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldHVwVmFjY2luZUJjZ1N0b2Nrb3V0c01hcCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2JjZy1zdG9ja291dHMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgIHllYXJzID0gZDMucmFuZ2UgMjAwNiwgMjAxNiAgICMgc2V0IHllYXJzIGFycmF5XG4gICAgICAgICMgYWRkIGNhc2VzIHRvIGVhY2ggY291bnRyeVxuICAgICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiAgICAgICAgICBkLnZhbHVlID0gK2QudmFsdWVcbiAgICAgICAgICBkLnllYXJzID0gJydcbiAgICAgICAgICAjIGdldCBsaXN0IG9mIHllYXJzIHdpdGggc3RvY2tvdXRzXG4gICAgICAgICAgeWVhcnMuZm9yRWFjaCAoeWVhcikgLT5cbiAgICAgICAgICAgIGlmIGRbeWVhcl0gPT0gJzInIHx8IGRbeWVhcl0gPT0gJzMnICAjIGNoZWNrIHZhbHVlcyAyIG9yIDMgKG5hdGlvbmFsIHN0b2Nrb3V0cyBjb2RlKVxuICAgICAgICAgICAgICBkLnllYXJzICs9IHllYXIrJywnXG4gICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgIGlmIGl0ZW1cbiAgICAgICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgICAgIyBzZXQgZ3JhcGhcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93Lk1hcEdyYXBoKCd2YWNjaW5lLWJjZy1zdG9ja291dHMnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDYwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWdlbmQ6IHRydWUpXG4gICAgICAgIGdyYXBoLmZvcm1hdEZsb2F0ID0gZ3JhcGguZm9ybWF0SW50ZWdlclxuICAgICAgICBncmFwaC5nZXRMZWdlbmREYXRhID0gLT4gWzAsMiw0LDYsOF1cbiAgICAgICAgZ3JhcGguc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgICAgICAgIC5odG1sIGQubmFtZVxuICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLCAueWVhcnMtY2VsbHMnXG4gICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgaWYgZC52YWx1ZSA9PSAwXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLXplcm8nXG4gICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgICBlbHNlIGlmIGQudmFsdWUgPT0gMVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi1vbmUgLnZhbHVlJ1xuICAgICAgICAgICAgICAuaHRtbCBkLnllYXJzLnNwbGl0KCcsJylbMF1cbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcuZGVzY3JpcHRpb24tb25lJ1xuICAgICAgICAgICAgICAuc2hvdygpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZ3JhcGguJHRvb2x0aXBcbiAgICAgICAgICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbi1tdWx0aXBsZSAudmFsdWUnXG4gICAgICAgICAgICAgIC5odG1sIGdyYXBoLmZvcm1hdEludGVnZXIoZC52YWx1ZSlcbiAgICAgICAgICAgIGdyYXBoLiR0b29sdGlwXG4gICAgICAgICAgICAgIC5maW5kICcueWVhcnMtY2VsbHMgbGknXG4gICAgICAgICAgICAgIC50b2dnbGVDbGFzcyAnYWN0aXZlJywgZmFsc2VcbiAgICAgICAgICAgIGQueWVhcnMuc3BsaXQoJywnKS5mb3JFYWNoICh5ZWFyKSAtPlxuICAgICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAgIC5maW5kICcueWVhcnMtY2VsbHMgbGlbZGF0YS15ZWFyPVwiJyt5ZWFyKydcIl0nXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzICdhY3RpdmUnLCB0cnVlXG4gICAgICAgICAgICBncmFwaC4kdG9vbHRpcFxuICAgICAgICAgICAgICAuZmluZCAnLmRlc2NyaXB0aW9uLW11bHRpcGxlLCAueWVhcnMtY2VsbHMnXG4gICAgICAgICAgICAgIC5zaG93KClcbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLCBtYXBcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLW1lYXNsZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvcG9wdWxhdGlvbi5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX2Nhc2VzLCBkYXRhX3BvcHVsYXRpb24pIC0+XG4gICAgICAgIGRlbGV0ZSBkYXRhX2Nhc2VzLmNvbHVtbnMgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiAgICAgICAgZGF0YV9jYXNlcy5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiAgICAgICAgICAgIGQueWVhcl9pbnRyb2R1Y3Rpb24gPSArZC55ZWFyX2ludHJvZHVjdGlvbi5yZXBsYWNlKCdwcmlvciB0bycsICcnKVxuICAgICAgICAgIGQuY2FzZXMgPSB7fVxuICAgICAgICAgIGQudmFsdWVzID0ge31cbiAgICAgICAgICBkLm5hbWUgPSBnZXRDb3VudHJ5TmFtZSBkYXRhX3BvcHVsYXRpb24sIGQuY29kZSwgbGFuZ1xuICAgICAgICAgICMgc2V0IHZhbHVlcyBhcyBjYXNlcy8xMDAwIGluaGFiaXRhbnRzXG4gICAgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBkYXRhX3BvcHVsYXRpb24uZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuICAgICAgICAgICAgeWVhciA9IDE5ODBcbiAgICAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4gICAgICAgICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4gICAgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4gICAgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMDAwICogK2RbeWVhcl0gLyBwb3B1bGF0aW9uXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgZFt5ZWFyXSk7XG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBjYXNvcyBkZSAnICsgZC5kaXNlYXNlICsgJyBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgJzonLCBkW3llYXJdLCB0eXBlb2YgZFt5ZWFyXSk7XG4gICAgICAgICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgICAgICAgICAgIHllYXIrK1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lXG4gICAgICAgICAgIyBHZXQgdG90YWwgY2FzZXMgYnkgY291bnRyeSAmIGRpc2Vhc2VcbiAgICAgICAgICBkLnRvdGFsID0gZDMudmFsdWVzKGQudmFsdWVzKS5yZWR1Y2UoKChhLCBiKSAtPiBhICsgYiksIDApXG4gICAgICAgICMgRmlsdGVyIGJ5IHNlbGVjdGVkIGNvdW50cmllcyAmIGRpc2Vhc2VcbiAgICAgICAgc2V0dXBIZWF0TWFwR3JhcGggJ3ZhY2NpbmVzLW1lYXNsZXMtZ3JhcGgtMScsIGRhdGFfY2FzZXMsIFsnRklOJywnSFVOJywnUFJUJywnVVJZJywnTUVYJywnQ09MJ10sIHRydWVcbiAgICAgICAgc2V0dXBIZWF0TWFwR3JhcGggJ3ZhY2NpbmVzLW1lYXNsZXMtZ3JhcGgtMicsIGRhdGFfY2FzZXMsIFsnSVJRJywnQkdSJywnTU5HJywnWkFGJywnRlJBJywnR0VPJ10sIGZhbHNlXG5cblxuICAjIEltbXVuaXphdGlvbiBDb3ZlcmFnZSBEeW5hbWljIExpbmUgR3JhcGggKHdlIGNhbiBzZWxlY3QgZGlmZXJlbnRlIGRpc2Vhc2VzICYgY291bnRyaWVzKVxuICBzZXR1cEltbXVuaXphdGlvbkNvdmVyYWdlRHluYW1pY0xpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnY29kZSdcbiAgICAgICAgeDogJ25hbWUnXG4gICAgICBsYWJlbDogdHJ1ZVxuICAgICAgbWFyZ2luOiB0b3A6IDIwKVxuICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IChkKSAtPiBbMCwgMTAwXVxuICAgIGdyYXBoLnlBeGlzLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICMgVXBkYXRlIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgdmFjY2luZVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICMgVXBkYXRlIGFjdGl2ZSBjb3VudHJpZXNcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yLCAjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5maW5kKCcubGluZS1sYWJlbCwgLmxpbmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgSW1tdW5pemF0aW9uIENvdmVyYWdlIE11bHRpcGxlIFNtYWxsIEdyYXBoICh3aWR0aCBzZWxlY3RlZCBjb3VudHJpZXMpXG4gIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VNdWx0aXBsZVNtYWxsR3JhcGggPSAtPlxuICAgIGN1cnJlbnRfY291bnRyaWVzID0gWydMS0EnLCdEWkEnLCdERVUnLCdETksnLCdGUkEnXVxuICAgIGdyYXBocyA9IFtdXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLW1jdjIuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcykgLT5cbiAgICAgICAgZDMuanNvbiAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJywgKGVycm9yLCBsb2NhdGlvbikgLT5cbiAgICAgICAgICAjIFNldHVwIHVzZXIgY291bnRyeVxuICAgICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICAgICAgaWYgdXNlcl9jb3VudHJ5IGFuZCB1c2VyX2NvdW50cnkubGVuZ3RoID4gMCBhbmQgdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICAgICAgaWYgY3VycmVudF9jb3VudHJpZXMuaW5kZXhPZih1c2VyX2NvdW50cnlbMF0uY29kZSkgPT0gLTFcbiAgICAgICAgICAgICAgICBjdXJyZW50X2NvdW50cmllc1syXSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICAgICAgZWwgPSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoIC5ncmFwaC1jb250YWluZXInKS5lcSgyKVxuICAgICAgICAgICAgICAgIGVsLmZpbmQoJ3AnKS5odG1sIHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICAgICAgZWwuZmluZCgnLmxpbmUtZ3JhcGgnKS5hdHRyICdpZCcsICdpbW11bml6YXRpb24tY292ZXJhZ2UtJyt1c2VyX2NvdW50cnlbMF0uY29kZS50b0xvd2VyQ2FzZSgpKyctZ3JhcGgnXG4gICAgICAgICAgIyBsb29wIHRocm91Z2ggZWFjaCBzZWxlY3RlZCBjb3VudHJ5XG4gICAgICAgICAgY3VycmVudF9jb3VudHJpZXMuZm9yRWFjaCAoY291bnRyeSxpKSAtPlxuICAgICAgICAgICAgIyBnZXQgY3VycmVudCBkaXNlYXNlIGRhdGFcbiAgICAgICAgICAgIGNvdW50cnlfZGF0YSA9IGRhdGFcbiAgICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlcbiAgICAgICAgICAgICAgLm1hcCAgICAoZCkgLT4gJC5leHRlbmQoe30sIGQpXG4gICAgICAgICAgICBjb3VudHJ5X2RhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICAgICAgZGVsZXRlIGRbJzIwMDEnXVxuICAgICAgICAgICAgICBkZWxldGUgZFsnMjAwMiddXG4gICAgICAgICAgICAjIHNldHVwIGxpbmUgY2hhcnRcbiAgICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS0nK2NvdW50cnkudG9Mb3dlckNhc2UoKSsnLWdyYXBoJyxcbiAgICAgICAgICAgICAgaXNBcmVhOiB0cnVlXG4gICAgICAgICAgICAgIGtleTpcbiAgICAgICAgICAgICAgICB4OiAnbmFtZSdcbiAgICAgICAgICAgICAgICBpZDogJ2NvZGUnKVxuICAgICAgICAgICAgZ3JhcGhzLnB1c2ggZ3JhcGhcbiAgICAgICAgICAgIGdyYXBoLnlGb3JtYXQgPSAoZCkgLT4gZCsnJSdcbiAgICAgICAgICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IChkKSAtPiBbMCwgMTAwXVxuICAgICAgICAgICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbNTBdXG4gICAgICAgICAgICBncmFwaC54QXhpcy50aWNrVmFsdWVzIFsyMDAzLDIwMTVdXG4gICAgICAgICAgICBncmFwaC5hZGRNYXJrZXJcbiAgICAgICAgICAgICAgdmFsdWU6IDk1XG4gICAgICAgICAgICAgIGxhYmVsOiBpZiBpJTIgIT0gMCB0aGVuICcnIGVsc2UgaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ05pdmVsIGRlIHJlYmHDsW8nIGVsc2UgaWYgbGFuZyA9PSAnZGUnIHRoZW4gJ0hlcmRlbmltbXVuaXTDpHQnIGVsc2UgJ0hlcmQgaW1tdW5pdHknXG4gICAgICAgICAgICAgIGFsaWduOiAnbGVmdCdcbiAgICAgICAgICAgICMgc2hvdyBsYXN0IHllYXIgbGFiZWxcbiAgICAgICAgICAgIGdyYXBoLiRlbC5vbiAnZHJhdy1jb21wbGV0ZScsIChlKSAtPlxuICAgICAgICAgICAgICBncmFwaC5zZXRMYWJlbCAyMDE1XG4gICAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgICAgICAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgICAgICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAgICAgICAgIGdyYXBoLmNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgICAgICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgICAgICAgIGdyYXBoLnNldERhdGEgY291bnRyeV9kYXRhXG4gICAgICAgICAgICAjIGxpc3RlbiB0byB5ZWFyIGNoYW5nZXMgJiB1cGRhdGUgZWFjaCBncmFwaCBsYWJlbFxuICAgICAgICAgICAgZ3JhcGguJGVsLm9uICdjaGFuZ2UteWVhcicsIChlLCB5ZWFyKSAtPlxuICAgICAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICAgICAgZy5zZXRMYWJlbCB5ZWFyXG4gICAgICAgICAgICBncmFwaC4kZWwub24gJ21vdXNlb3V0JywgKGUpIC0+XG4gICAgICAgICAgICAgIGdyYXBocy5mb3JFYWNoIChnKSAtPlxuICAgICAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgICAgICBnLmhpZGVMYWJlbCgpXG4gICAgICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cblxuICAjIFdvcmxkIENhc2VzIE11bHRpcGxlIFNtYWxsXG4gIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgZGlzZWFzZXMgPSBbJ2RpcGh0ZXJpYScsICdtZWFzbGVzJywncGVydHVzc2lzJywncG9saW8nLCd0ZXRhbnVzJ11cbiAgICBncmFwaHMgPSBbXVxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLXdvcmxkLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgICMgR2V0IG1heCB2YWx1ZSB0byBjcmVhdGUgYSBjb21tb24geSBzY2FsZVxuICAgICAgbWF4VmFsdWUxID0gZDMubWF4IGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQpLCAoZSkgLT4gK2UpXG4gICAgICBtYXhWYWx1ZTIgPSAxMDAwMDAgI2QzLm1heCBkYXRhLmZpbHRlcigoZCkgLT4gWydkaXBodGVyaWEnLCdwb2xpbycsJ3RldGFudXMnXS5pbmRleE9mKGQuZGlzZWFzZSkgIT0gLTEpLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgIyBjcmVhdGUgYSBsaW5lIGdyYXBoIGZvciBlYWNoIGRpc2Vhc2VcbiAgICAgIGRpc2Vhc2VzLmZvckVhY2ggKGRpc2Vhc2UpIC0+XG4gICAgICAgICMgZ2V0IGN1cnJlbnQgZGlzZWFzZSBkYXRhXG4gICAgICAgIGRpc2Vhc2VfZGF0YSA9IGRhdGFcbiAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkLmRpc2Vhc2UgPT0gZGlzZWFzZVxuICAgICAgICAgIC5tYXAgICAgKGQpIC0+ICQuZXh0ZW5kKHt9LCBkKVxuICAgICAgICAjIHNldHVwIGxpbmUgY2hhcnRcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaChkaXNlYXNlKyctd29ybGQtZ3JhcGgnLFxuICAgICAgICAgIGlzQXJlYTogdHJ1ZVxuICAgICAgICAgIG1hcmdpbjogbGVmdDogMjBcbiAgICAgICAgICBrZXk6XG4gICAgICAgICAgICB4OiAnZGlzZWFzZSdcbiAgICAgICAgICAgIGlkOiAnZGlzZWFzZScpXG4gICAgICAgIGdyYXBocy5wdXNoIGdyYXBoXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzE5ODAsIDIwMTVdXG4gICAgICAgIGdyYXBoLnlBeGlzLnRpY2tzKDIpLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcuMHMnKVxuICAgICAgICBncmFwaC55Rm9ybWF0ID0gZDMuZm9ybWF0KCcuMnMnKVxuICAgICAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAtPiByZXR1cm4gWzAsIGlmIGRpc2Vhc2UgPT0gJ21lYXNsZXMnIG9yIGRpc2Vhc2UgPT0gJ3BlcnR1c3NpcycgdGhlbiBtYXhWYWx1ZTEgZWxzZSBtYXhWYWx1ZTJdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGlzZWFzZV9kYXRhXG4gICAgICAgICMgbGlzdGVuIHRvIHllYXIgY2hhbmdlcyAmIHVwZGF0ZSBlYWNoIGdyYXBoIGxhYmVsXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICBncmFwaC4kZWwub24gJ21vdXNlb3V0JywgKGUpIC0+XG4gICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICBnLmhpZGVMYWJlbCgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cEltbXVuaXphdGlvbkRpc2Vhc2VCYXJHcmFwaCA9IC0+XG4gICAgIyBMb2FkIGRhdGFcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIGNvdW50cmllcykgLT5cbiAgICAgICAgZDMuanNvbiAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJywgKGVycm9yLCBsb2NhdGlvbikgLT5cbiAgICAgICAgICAjIFNldHVwIHVzZXIgY291bnRyeVxuICAgICAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICAgICAgbG9jYXRpb24uY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICBsb2NhdGlvbi5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsb2NhdGlvbiA9IHt9XG4gICAgICAgICAgICBpZiBsYW5nID09ICdkZSdcbiAgICAgICAgICAgICAgbG9jYXRpb24uY29kZSA9ICdERVUnXG4gICAgICAgICAgICAgIGxvY2F0aW9uLm5hbWUgPSAnR2VybWFueSdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbG9jYXRpb24uY29kZSA9ICdFU1AnXG4gICAgICAgICAgICAgIGxvY2F0aW9uLm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG4gICAgICAgICAgIyBGaWx0ZXIgZGF0YVxuICAgICAgICAgIGhlcmRJbW11bml0eSA9XG4gICAgICAgICAgICAnTUNWMSc6IDk1XG4gICAgICAgICAgICAnUG9sMyc6IDgwXG4gICAgICAgICAgICAnRFRQMyc6IDgwXG4gICAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBleGNsdWRlZENvdW50cmllcy5pbmRleE9mKGQuY29kZSkgPT0gLTFcbiAgICAgICAgICAjIERhdGEgcGFyc2UgJiBzb3J0aW5nIGZ1bnRpb25zXG4gICAgICAgICAgZGF0YV9wYXJzZXIgPSAoZCkgLT5cbiAgICAgICAgICAgIG9iaiA9XG4gICAgICAgICAgICAgIGtleTogICBkLmNvZGVcbiAgICAgICAgICAgICAgbmFtZTogIGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5jb2RlLCBsYW5nKVxuICAgICAgICAgICAgICB2YWx1ZTogK2RbJzIwMTUnXVxuICAgICAgICAgICAgaWYgbG9jYXRpb24gYW5kIGQuY29kZSA9PSBsb2NhdGlvbi5jb2RlXG4gICAgICAgICAgICAgIG9iai5hY3RpdmUgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgZGF0YV9zb3J0ID0gKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICAgIyBsb29wIHRocm91Z2ggZWFjaCBncmFwaFxuICAgICAgICAgICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmVhY2ggLT5cbiAgICAgICAgICAgICRlbCAgICAgPSAkKHRoaXMpXG4gICAgICAgICAgICBkaXNlYXNlID0gJGVsLmRhdGEoJ2Rpc2Vhc2UnKVxuICAgICAgICAgICAgdmFjY2luZSA9ICRlbC5kYXRhKCd2YWNjaW5lJylcbiAgICAgICAgICAgICMgR2V0IGdyYXBoIGRhdGEgJiB2YWx1ZVxuICAgICAgICAgICAgZ3JhcGhfZGF0YSA9IGRhdGFcbiAgICAgICAgICAgICAgLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09IHZhY2NpbmUgYW5kIGRbJzIwMTUnXSAhPSAnJylcbiAgICAgICAgICAgICAgLm1hcChkYXRhX3BhcnNlcilcbiAgICAgICAgICAgICAgLnNvcnQoZGF0YV9zb3J0KVxuICAgICAgICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgICAgICAgZ3JhcGhfdmFsdWUgPSBncmFwaF9kYXRhLmZpbHRlciAoZCkgLT4gZC5rZXkgPT0gbG9jYXRpb24uY29kZVxuICAgICAgICAgICAgIyBTZXR1cCBncmFwaFxuICAgICAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKGRpc2Vhc2UrJy1pbW11bml6YXRpb24tYmFyLWdyYXBoJyxcbiAgICAgICAgICAgICAgYXNwZWN0UmF0aW86IDAuMjVcbiAgICAgICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICAgICAgZm9ybWF0OiAoZCkgLT4gK2QrJyUnXG4gICAgICAgICAgICAgIGtleTogeDogJ25hbWUnXG4gICAgICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgICAgICB0b3A6IDIwKVxuICAgICAgICAgICAgbWFya2VyID1cbiAgICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgICBsYWJlbDogaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ05pdmVsIGRlIHJlYmHDsW8nIGVsc2UgaWYgbGFuZyA9PSAnZGUnIHRoZW4gJ0hlcmRlbmltbXVuaXTDpHQnIGVsc2UgJ0hlcmQgaW1tdW5pdHknXG4gICAgICAgICAgICBpZiB2YWNjaW5lID09ICdEVFAzJ1xuICAgICAgICAgICAgICBtYXJrZXIubGFiZWwgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnUmVjb21lbmRhY2nDs24gT01TJyBlbHNlICdXSE8gcmVjb21tZW5kYXRpb24nXG4gICAgICAgICAgICBncmFwaFxuICAgICAgICAgICAgICAuYWRkTWFya2VyIG1hcmtlclxuICAgICAgICAgICAgICAuc2V0RGF0YSBncmFwaF9kYXRhXG4gICAgICAgICAgICAjIFNldHVwIGdyYXBoIHZhbHVlXG4gICAgICAgICAgICBpZiBncmFwaF92YWx1ZSBhbmQgZ3JhcGhfdmFsdWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1jb3VudHJ5JykuaHRtbCBsb2NhdGlvbi5uYW1lXG4gICAgICAgICAgICAgICRlbC5maW5kKCcuaW1tdW5pemF0aW9uLWRhdGEnKS5odG1sICc8c3Ryb25nPicgKyBncmFwaF92YWx1ZVswXS52YWx1ZSArICclPC9zdHJvbmc+J1xuICAgICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kZXNjcmlwdGlvbicpLnNob3coKVxuICAgICAgICAgICAgIyBPbiByZXNpemVcbiAgICAgICAgICAgICQod2luZG93KS5yZXNpemUgLT4gZ3JhcGgub25SZXNpemUoKVxuXG5cbiAgc2V0dXBWYWNjaW5lVlBIR3JhcGggPSAtPlxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2RhdGEvdnBoLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2dkcC5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBjb3VudHJpZXMpIC0+XG4gICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZXhjbHVkZWRDb3VudHJpZXMuaW5kZXhPZihkLmNvdW50cnkpID09IC0xXG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBjb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY291bnRyeVxuICAgICAgICAgIGlmIGNvdW50cnlbMF1cbiAgICAgICAgICAgIGQubmFtZSA9IGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgZC5nZHAgPSArY291bnRyeVswXS52YWx1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICNjb25zb2xlLmVycm9yICdObyBjb3VudHJ5IG5hbWUgZm9yIGNvZGUnLCBkLmNvdW50cnlcbiAgICAgICAgICBkLnZhbHVlID0gK2QuZGVhdGhzXG4gICAgICAgICMgc2tpcCBkYXRhIGxpbmVzIHdpdGhvdXQgZ2RwIGRhdGFcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmdkcFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuU2NhdHRlcnBsb3RWUEhHcmFwaCgndmFjY2luZS12cGgtZ3JhcGgnLCBsYW5nLFxuICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgIGxlZnQ6IDIwXG4gICAgICAgICAgICB0b3A6IDMwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBrZXk6XG4gICAgICAgICAgICB4OiAnZ2RwJ1xuICAgICAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICAgICAgY29sb3I6ICd2YWNjaW5lJylcbiAgICAgICAgIyBzZXQgZGF0YVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMjI1xuICBzZXR1cEd1YXRlbWFsYUNvdmVyYWdlTGluZUdyYXBoID0gLT5cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJyxcbiAgICAgICNpc0FyZWE6IHRydWVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogMFxuICAgICAgICByaWdodDogMFxuICAgICAgICBib3R0b206IDIwKVxuICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzIwMDAsIDIwMDUsIDIwMTAsIDIwMTVdXG4gICAgZ3JhcGgueUF4aXNcbiAgICAgIC50aWNrVmFsdWVzIFswLCAyNSwgNTAsIDc1LCAxMDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICBncmFwaC5sb2FkRGF0YSBiYXNldXJsKycvZGF0YS9ndWF0ZW1hbGEtY292ZXJhZ2UtbW1yLmNzdidcbiAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgIGxpbmUgPSBncmFwaC5jb250YWluZXIuc2VsZWN0KCcubGluZScpXG4gICAgICBjb25zb2xlLmxvZyBsaW5lLm5vZGUoKVxuICAgICAgbGVuZ3RoID0gbGluZS5ub2RlKCkuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIGxpbmVcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCBsZW5ndGggKyAnICcgKyBsZW5ndGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIGxlbmd0aClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSg1MDAwKVxuICAgICAgICAgIC5kdXJhdGlvbig1MDAwKVxuICAgICAgICAgIC5lYXNlKGQzLmVhc2VTaW5Jbk91dClcbiAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAwKVxuXG4gIGlmICQoJyNndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJykubGVuZ3RoID4gMFxuICAgIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGgoKVxuICAjIyNcblxuICBpZiAkKCcjdmlkZW8tbWFwLXBvbGlvJykubGVuZ3RoID4gMFxuICAgIHNldFZpZGVvTWFwUG9saW8oKVxuXG4gICMjI1xuICAjIyBWYWNjaW5lIG1hcFxuICBpZiAkKCcjdmFjY2luZS1tYXAnKS5sZW5ndGggPiAwXG4gICAgdmFjY2luZV9tYXAgPSBuZXcgVmFjY2luZU1hcCAndmFjY2luZS1tYXAnXG4gICAgI3ZhY2NpbmVfbWFwLmdldERhdGEgPSB0cnVlICAjICBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIHBvbGlvIGNhc2VzIGNzdlxuICAgIHZhY2NpbmVfbWFwLmdldFBpY3R1cmVTZXF1ZW5jZSA9IHRydWUgICAjIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgbWFwIHBpY3R1cmUgc2VxdWVuY2VcbiAgICB2YWNjaW5lX21hcC5pbml0IGJhc2V1cmwrJy9kYXRhL2Rpc2Vhc2VzLXBvbGlvLWNhc2VzLmNzdicsIGJhc2V1cmwrJy9kYXRhL21hcC1wb2xpby1jYXNlcy5jc3YnXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB2YWNjaW5lX21hcC5vblJlc2l6ZVxuICAjIyNcblxuICBpZiAkKCcudmFjY2luZXMtZGlzZWFzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoKClcblxuICAjIyNcbiAgIyBWYWNjaW5lIGFsbCBkaXNlYXNlcyBncmFwaFxuICBpZiAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzID0gbmV3IFZhY2NpbmVEaXNlYXNlR3JhcGgoJ3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCcpXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLnZhbCgpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5vblJlc2l6ZVxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiAgICAkKCcjZGlzZWFzZS1zZWxlY3RvciBhJykuY2xpY2sgKGUpIC0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICQodGhpcykudGFiICdzaG93J1xuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAgIHJldHVyblxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VvbiBvbiBvcmRlciBzZWxlY3RvclxuICAgICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykuY2hhbmdlIChkKSAtPlxuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKHRoaXMpLnZhbCgpXG4gICMjI1xuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VEeW5hbWljTGluZUdyYXBoKClcblxuICBpZiAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VNdWx0aXBsZVNtYWxsR3JhcGgoKVxuXG4gIGlmICQoJyN3b3JsZC1jYXNlcycpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGgoKVxuXG4gIGlmICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEltbXVuaXphdGlvbkRpc2Vhc2VCYXJHcmFwaCgpXG5cbiAgaWYgJCgnI21lYXNsZXMtd29ybGQtbWFwLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwTWVhc2xlc1dvcmxkTWFwR3JhcGgoKVxuXG4gIGlmICQoJyN2YWNjaW5lLWNvbmZpZGVuY2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lQ29uZmlkZW5jZUJhckdyYXBoKClcblxuICBpZiAkKCcjdmFjY2luZS1iY2ctY2FzZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lQmNnQ2FzZXNNYXAoKVxuXG4gIGlmICQoJyN2YWNjaW5lLWJjZy1zdG9ja291dHMnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lQmNnU3RvY2tvdXRzTWFwKClcblxuICBpZiAkKCcjdmFjY2luZS12cGgtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBWYWNjaW5lVlBIR3JhcGgoKVxuXG4gICMgU2V0dXAgdmFjY2luZXMgcHJpY2VzXG4gIGlmICQoJ2JvZHknKS5oYXNDbGFzcygncHJpY2VzJykgfHwgICQoJ2JvZHknKS5oYXNDbGFzcygncHJlY2lvcycpXG4gICAgbmV3IFZhY2NpbmVzUHJpY2VzIGxhbmcsIGJhc2V1cmwsICcvZGF0YS9wcmljZXMtdmFjY2luZXMuY3N2J1xuXG4gICMgU2V0dXAgdmFjY2luZSB2cGggcHJpY2VzXG4gIGlmICQoJyN2YWNjaW5lLXByaWNlcy12cGgtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgbmV3IFZhY2NpbmVzUHJpY2VzIGxhbmcsIGJhc2V1cmwsICcvZGF0YS9wcmljZXMtdmFjY2luZXMtdnBoLmNzdidcblxuKSBqUXVlcnlcbiJdfQ==
