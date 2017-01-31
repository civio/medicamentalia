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
        this.container.append('g').attr('class', 'x axis').attr('transform', 'translate(' + this.options.margin.left + ',' + (this.options.margin.top + this.height) + ')').call(this.xAxis);
      }
      if (this.yAxis) {
        this.container.append('g').attr('class', 'y axis').attr('transform', 'translate(' + this.width + ' ,' + this.options.margin.top + ')').call(this.yAxis);
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
      this.x.range(this.getScaleXRange());
      this.y.range(this.getScaleYRange());
      if (this.xAxis) {
        this.container.selectAll('.x.axis').attr('transform', 'translate(' + this.options.margin.left + ',' + (this.options.margin.top + this.height) + ')').call(this.xAxis);
      }
      if (this.yAxis) {
        this.container.selectAll('.y.axis').attr('transform', 'translate(' + this.width + ' ,' + this.options.margin.top + ')').call(this.yAxis);
      }
      this.container.select('.marker').call(this.setupMarkerLine);
      this.container.select('.marker-label').call(this.setupMarkerLabel);
      return this;
      return {
        getDataX: function() {
          return d[this.options.key.x];
        },
        getDataY: function() {
          return d[this.options.key.y];
        }
      };
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
          return d.value = +d.value;
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
      this.container.append('text').attr('class', 'tick-hover').attr('dy', '0.71em').attr('y', Math.round(this.height + this.options.margin.top + 9)).style('display', 'none');
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
      this.color = d3.scaleSequential(d3.interpolateOrRd);
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
  (function($) {
    var baseurl, getCountryName, lang, setVideoMapPolio, setupHeatMapGraph, setupImmunizationCoverageDynamicLineGraph, setupImmunizationCoverageLineGraph, setupImmunizationDiseaseBarGraph, setupVaccineDiseaseHeatmapGraph, setupWorldCasesMultipleSmallGraph;
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
    setupHeatMapGraph = function(id, data, countries, disease) {
      var graph;
      data = data.filter(function(d) {
        return countries.indexOf(d.code) !== -1 && d.disease === disease && d3.values(d.values).length > 0;
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
    setupVaccineDiseaseHeatmapGraph = function() {
      return d3.queue().defer(d3.csv, baseurl + '/assets/data/diseases-cases.csv').defer(d3.csv, baseurl + '/assets/data/population.csv').await(function(error, data_cases, data_population) {
        delete data_cases.columns;
        data_cases.forEach(function(d) {
          var population, populationItem, year;
          d.disease = d.disease.toLowerCase();
          if (d.year_introduction) {
            d.year_introduction = +d.year_introduction.replace('prior to', '');
          }
          d.cases = {};
          d.values = {};
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
        setupHeatMapGraph('vaccines-measles-graph-1', data_cases, ['FIN', 'HUN', 'PRT', 'URY', 'MEX', 'COL'], 'measles');
        return setupHeatMapGraph('vaccines-measles-graph-2', data_cases, ['IRQ', 'BGR', 'MNG', 'ZAF', 'FRA', 'GEO'], 'measles');
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
          top: 20
        }
      });
      graph.getScaleYDomain = function(d) {
        return [0, 100];
      };
      graph.yAxis.tickValues([0, 25, 50, 75, 100]);
      graph.xAxis.tickValues([2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015]);
      graph.addMarker({
        value: 95,
        label: 'Nivel de rebaño',
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
        excludedCountries = ['TUV', 'NRU', 'PLW', 'VGB', 'MAF', 'SMR', 'GIB', 'TCA', 'LIE', 'MCO', 'SXM', 'FRO', 'MHL', 'MNP', 'ASM', 'KNA', 'GRL', 'CY', 'BMU', 'AND', 'DMA', 'IMN', 'ATG', 'SYC', 'VIR', 'ABW', 'FSM', 'TON', 'GRD', 'VCT', 'KIR', 'CUW', 'CHI', 'GUM', 'LCA', 'STP', 'WSM', 'VUT', 'NCL', 'PYF', 'BRB'];
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
          var $el, disease, graph, graph_data, graph_value, vaccine;
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
              top: 20,
              bottom: 0
            }
          });
          graph.addMarker({
            value: herdImmunity[vaccine],
            label: vaccine !== 'DTP3' ? 'Nivel de rebaño' : 'Recomendación OMS'
          }).setData(graph_data);
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
      return setupImmunizationDiseaseBarGraph();
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYWluLXZhY2NpbmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLFdBQUEsRUFBYSxJQVBiO01BUUEsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVEY7OztJQWFGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLGNBQWYsRUFBK0IsT0FBL0I7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQVA7TUFDWixJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0FBQ1gsYUFBTztJQVJJOzt3QkFjYixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxHQUFELEdBQU8sRUFB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XG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0BvcHRpb25zLm1hcmdpbi5sZWZ0KycsJysoQG9wdGlvbnMubWFyZ2luLnRvcCtAaGVpZ2h0KSsnKSdcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycgLCcrQG9wdGlvbnMubWFyZ2luLnRvcCsnKSdcbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgQHN2Z1xuICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAb3B0aW9ucy5tYXJnaW4ubGVmdCsnLCcrKEBvcHRpb25zLm1hcmdpbi50b3ArQGhlaWdodCkrJyknXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnICwnK0BvcHRpb25zLm1hcmdpbi50b3ArJyknXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG5cbiAgICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldERhdGFYOiAtPlxuICAgICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgICBnZXREYXRhWTogLT5cbiAgICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0JhciBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IGQudmFsdWUgPSArZC52YWx1ZVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMC4xKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAZGF0YS5tYXAgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGFjdGl2ZScgZWxzZSAnYmFyJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgICMgZHJhdyBsYWJlbHMgeFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC14IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXgnXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJzEuMjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgICAgIyBkcmF3IGxhYmVscyB5XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXkgYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteSdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldEJhckRpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAaGVpZ2h0IC0gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKClcblxuICBzZXRCYXJMYWJlbFhEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQGhlaWdodFxuXG4gIHNldEJhckxhYmVsWURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5MaW5lR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICB5Rm9ybWF0OiBkMy5mb3JtYXQoJ2QnKSAgICMgc2V0IGxhYmVscyBob3ZlciBmb3JtYXRcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0xpbmUgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQHllYXJzID0gQGdldFllYXJzIGRhdGFcbiAgICBzdXBlcihkYXRhKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIHllYXJzID0gW11cbiAgICBkMy5rZXlzKGRhdGFbMF0pLmZvckVhY2ggKGQpIC0+XG4gICAgICBpZiArZFxuICAgICAgICB5ZWFycy5wdXNoICtkXG4gICAgcmV0dXJuIHllYXJzLnNvcnQoKVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZFtAb3B0aW9ucy5rZXkueF0sICdlbiAnLCB5ZWFyKTtcbiAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcnKVxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICMgc2V0dXAgbGluZVxuICAgIEBsaW5lID0gZDMubGluZSgpXG4gICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAueCAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgLnkgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgIyBzZXR1cCBhcmVhXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYSA9IGQzLmFyZWEoKVxuICAgICAgICAuY3VydmUgZDMuY3VydmVDYXRtdWxsUm9tXG4gICAgICAgIC54ICAoZCkgPT4gQHgoK2Qua2V5KVxuICAgICAgICAueTAgQGhlaWdodFxuICAgICAgICAueTEgKGQpID0+IEB5KGQudmFsdWUpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFtAeWVhcnNbMF0sIEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdXVxuXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gWzAsIGQzLm1heCBAZGF0YSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZC52YWx1ZXMpKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBjbGVhciBncmFwaCBiZWZvcmUgc2V0dXBcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmdyYXBoJykucmVtb3ZlKClcbiAgICAjIGRyYXcgZ3JhcGggY29udGFpbmVyIFxuICAgIEBncmFwaCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdncmFwaCdcbiAgICAjIGRyYXcgbGluZXNcbiAgICBAZHJhd0xpbmVzKClcbiAgICAjIGRyYXcgYXJlYXNcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBkcmF3QXJlYXMoKVxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGRyYXdMYWJlbHMoKVxuICAgICMgZHJhdyBtb3VzZSBldmVudHMgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBkcmF3TGluZUxhYmVsSG92ZXIoKVxuICAgICAgIyBlbHNlXG4gICAgICAjICAgQGRyYXdUb29sdGlwKClcbiAgICAgIEBkcmF3UmVjdE92ZXJsYXkoKVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBhcmVhIHkwXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAYXJlYS55MCBAaGVpZ2h0XG4gICAgIyB1cGRhdGUgeSBheGlzIHRpY2tzIHdpZHRoXG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5hcmVhJylcbiAgICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcub3ZlcmxheScpXG4gICAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgZHJhd0xpbmVzOiAtPlxuICAgIEBncmFwaC5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZSdcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IHJldHVybiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAbGluZVxuXG4gIGRyYXdBcmVhczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdhcmVhJ1xuICAgICAgLmF0dHIgICdpZCcsICAgIChkKSA9PiAnYXJlYS0nICsgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuZGF0dW0gKGQpIC0+IGQzLmVudHJpZXMoZC52YWx1ZXMpXG4gICAgICAuYXR0ciAnZCcsIEBhcmVhXG5cbiAgZHJhd0xhYmVsczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZS1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdlbmQnXG4gICAgICAuYXR0ciAnZHknLCAnLTAuMTI1ZW0nXG4gICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5jYWxsIEBzZXRMYWJlbERpbWVuc2lvbnNcblxuICBkcmF3TGluZUxhYmVsSG92ZXI6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnbGluZS1sYWJlbC1wb2ludC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtcG9pbnQnXG4gICAgICAuYXR0ciAncicsIDRcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd0aWNrLWhvdmVyJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuNzFlbSdcbiAgICAgIC5hdHRyICd5JywgTWF0aC5yb3VuZCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArOVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgaWYgQGRhdGEubGVuZ3RoID09IDFcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUtbGFiZWwtaG92ZXInXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC5hdHRyICdkeScsICctMC41ZW0nXG4gICAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIGRyYXdSZWN0T3ZlcmxheTogLT5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnb3ZlcmxheSdcbiAgICAgIC5jYWxsIEBzZXRPdmVybGF5RGltZW5zaW9uc1xuICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU1vdmVcbiAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcbiAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG5cbiAgc2V0TGFiZWxEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZC52YWx1ZXNbQHllYXJzW0B5ZWFycy5sZW5ndGgtMV1dKVxuXG4gIHNldE92ZXJsYXlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnd2lkdGgnLCBAd2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAaGVpZ2h0XG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCRlbC50cmlnZ2VyICdtb3VzZW91dCdcbiAgICBAaGlkZUxhYmVsKClcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgeWVhciA9IE1hdGgucm91bmQgQHguaW52ZXJ0KHBvc2l0aW9uWzBdKVxuICAgIGlmIHllYXIgIT0gQGN1cnJlbnRZZWFyXG4gICAgICBAJGVsLnRyaWdnZXIgJ2NoYW5nZS15ZWFyJywgeWVhclxuICAgICAgQHNldExhYmVsIHllYXJcblxuICBzZXRMYWJlbDogKHllYXIpIC0+XG4gICAgQGN1cnJlbnRZZWFyID0geWVhclxuICAgIEB4QXhpcy50aWNrVmFsdWVzIFt5ZWFyXVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5zZWxlY3RBbGwoJy50aWNrJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZWFjaCAoZCkgPT4gQHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb24gZFxuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgICAuYXR0ciAneCcsIE1hdGgucm91bmQgQHgoQGN1cnJlbnRZZWFyKVxuICAgICAgLnRleHQgQGN1cnJlbnRZZWFyXG5cbiAgaGlkZUxhYmVsOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwtaG92ZXInKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcudGljay1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcblxuICBzZXRMaW5lTGFiZWxIb3ZlclBvc2l0aW9uOiAoZGF0YSkgPT5cbiAgICAjIGdldCBjdXJyZW50IHllYXJcbiAgICB5ZWFyID0gQGN1cnJlbnRZZWFyXG4gICAgd2hpbGUgQHllYXJzLmluZGV4T2YoeWVhcikgPT0gLTEgJiYgQGN1cnJlbnRZZWFyID4gQHllYXJzWzBdXG4gICAgICB5ZWFyLS1cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgIyBnZXQgcG9pbnQgJiBsYWJlbFxuICAgIHBvaW50ID0gZDMuc2VsZWN0KCcjbGluZS1sYWJlbC1wb2ludC0nK2RhdGFbQG9wdGlvbnMua2V5LmlkXSlcbiAgICBsYWJlbCA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgIyBoaWRlIHBvaW50ICYgbGFiZWwgaXMgdGhlcmUgaXMgbm8gZGF0YVxuICAgIHVubGVzcyBkYXRhLnZhbHVlc1t5ZWFyXVxuICAgICAgcG9pbnQuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgICByZXR1cm5cbiAgICAjIHNob3cgcG9pbnQgJiBsYWJlbCBpZiB0aGVyZSdzIGRhdGFcbiAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICBsYWJlbC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIyBzZXQgbGluZSBsYWJlbCBwb2ludFxuICAgIHBvaW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIGRhdGEudmFsdWVzW3llYXJdIHRoZW4gQHkoZGF0YS52YWx1ZXNbeWVhcl0pIGVsc2UgMFxuICAgICMgc2V0IGxpbmUgbGFiZWwgaG92ZXJcbiAgICBsYWJlbFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHggeWVhclxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeUZvcm1hdChkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAnJ1xuICAgICAgIiwiY2xhc3Mgd2luZG93LkhlYXRtYXBHcmFwaCBleHRlbmRzIEJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0hlYXRtYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIEBsYW5nID0gJCgnYm9keScpLmRhdGEgJ2xhbmcnXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyAgICAgICA9IG51bGxcbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0ICcjJytAaWQrJyAuaGVhdG1hcC1jb250YWluZXInXG4gICAgQCR0b29sdGlwICA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgIyBHZXQgeWVhcnMgKHggc2NhbGUpXG4gICAgQHllYXJzID0gQGdldFllYXJzKGRhdGEpXG4gICAgIyBHZXQgY291bnRyaWVzICh5IHNjYWxlKVxuICAgIEBjb3VudHJpZXMgPSBkYXRhLm1hcCAoZCkgLT4gZC5jb2RlXG4gICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiAgICBAY2VsbHNEYXRhID0gQGdldENlbGxzRGF0YSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBnZXREaW1lbnNpb25zKCkgIyBmb3JjZSB1cGRhdGUgZGltZW5zaW9uc1xuICAgIEBkcmF3U2NhbGVzKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0WWVhcnM6IChkYXRhKSAtPlxuICAgIG1pblllYXIgPSBkMy5taW4gZGF0YSwgKGQpIC0+IGQzLm1pbihkMy5rZXlzKGQudmFsdWVzKSlcbiAgICBtYXhZZWFyID0gZDMubWF4IGRhdGEsIChkKSAtPiBkMy5tYXgoZDMua2V5cyhkLnZhbHVlcykpXG4gICAgeWVhcnMgPSBkMy5yYW5nZSBtaW5ZZWFyLCBtYXhZZWFyLCAxXG4gICAgeWVhcnMucHVzaCArbWF4WWVhclxuICAgIHJldHVybiB5ZWFyc1xuXG4gIGdldENlbGxzRGF0YTogKGRhdGEpIC0+XG4gICAgY2VsbHNEYXRhID0gW11cbiAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4gICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiAgICAgICAgY2VsbHNEYXRhLnB1c2hcbiAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiAgICAgICAgICBuYW1lOiAgICBkLm5hbWVcbiAgICAgICAgICB5ZWFyOiAgICB2YWx1ZVxuICAgICAgICAgIGNhc2VzOiAgIGQuY2FzZXNbdmFsdWVdXG4gICAgICAgICAgdmFsdWU6ICAgZC52YWx1ZXNbdmFsdWVdXG4gICAgcmV0dXJuIGNlbGxzRGF0YVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICBAeWVhcnMuZm9yRWFjaCAoeWVhcikgPT5cbiAgICAgICAgaWYgZFt5ZWFyXVxuICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgI2Vsc2VcbiAgICAgICAgIyAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhclxuICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnBhZGRpbmcoMClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMClcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAgIC5yb3VuZCh0cnVlKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPclJkXG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICBAY29sb3IuZG9tYWluIFswLCA0XSAgIyBUT0RPISEhIC0+IE1ha2UgdGhpcyBkeW5hbWljXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICBnZXRTY2FsZVlSYW5nZTogPT5cbiAgICByZXR1cm4gWzAsIEBoZWlnaHRdXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAeWVhcnMgXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBAY291bnRyaWVzIFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgQHdpZHRoID0gQCRlbC53aWR0aCgpIC0gMTAwICAjIHkgYXhpcyB3aWR0aCA9IDEwMFxuICAgIGlmIEB5ZWFycyBhbmQgQGNvdW50cmllc1xuICAgICAgY2VsbFNpemUgPSBNYXRoLmZsb29yIEB3aWR0aCAvIEB5ZWFycy5sZW5ndGhcbiAgICAgIEBoZWlnaHQgPSBpZiBjZWxsU2l6ZSA8IDIwIHRoZW4gY2VsbFNpemUgKiBAY291bnRyaWVzLmxlbmd0aCBlbHNlIDIwICogQGNvdW50cmllcy5sZW5ndGhcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIHNldHVwIHNjYWxlcyByYW5nZVxuICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldHVwIGNvbnRhaW5lciBoZWlnaHRcbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcbiAgICAjIGRyYXcgY2VsbHNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnY2VsbC1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIC5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5kYXRhKEBjZWxsc0RhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsJ1xuICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvcihkLnZhbHVlKVxuICAgICAgLm9uICAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgIC5vbiAgICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICAgLmNhbGwgIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgICMgZHJhdyB5ZWFycyB4IGF4aXNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICd4LWF4aXMgYXhpcydcbiAgICAuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5kYXRhKEB5ZWFycy5maWx0ZXIoKGQpIC0+IGQgJSA1ID09IDApKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXhpcy1pdGVtJ1xuICAgICAgLnN0eWxlICdsZWZ0JywgKGQpID0+IEB4KGQpKydweCdcbiAgICAgIC5odG1sICAoZCkgLT4gZFxuICAgICMgZHJhdyBjb3VudHJpZXMgeSBheGlzXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCAneS1heGlzIGF4aXMnKVxuICAgIC5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLmRhdGEoQGNvdW50cmllcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2F4aXMtaXRlbSdcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICAgIC5odG1sIChkKSA9PiBAZ2V0Q291bnRyeU5hbWUgZFxuICAgICMgZHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhIEBkYXRhLm1hcCgoZCkgLT4ge2NvZGU6IGQuY29kZSwgeWVhcjogZC55ZWFyX2ludHJvZHVjdGlvbn0pLmZpbHRlcigoZCkgLT4gIWlzTmFOIGQueWVhcilcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc2NhbGVzXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGNvbnRhaW5lcnNcbiAgICBAY29udGFpbmVyXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQgKyAncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpXG4gICAgICAuY2FsbCBAc2V0Q2VsbERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLngtYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueS1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAndG9wJywgKGQpID0+IEB5KGQpKydweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXRNYXJrZXJEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRDZWxsRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IEB4KGQueWVhcikrJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgPT4gQHkoZC5jb3VudHJ5KSsncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIHNldE1hcmtlckRpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiBAeShkLmNvZGUpKydweCdcbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpID0+IGlmIGQueWVhciA8IEB5ZWFyc1swXSB0aGVuIEB4KEB5ZWFyc1swXSktMSArICdweCcgZWxzZSBpZiBkLnllYXIgPCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXSB0aGVuIEB4KGQueWVhciktMSsncHgnIGVsc2UgQHguYmFuZHdpZHRoKCkrQHgoQHllYXJzW0B5ZWFycy5sZW5ndGgtMV0pKydweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQHkuYmFuZHdpZHRoKCkrJ3B4J1xuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBvZmZzZXQgICAgICAgICAgID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgY2FzZXNfc3RyICAgICAgICA9IGlmIEBsYW5nID09ICdlcycgdGhlbiAnY2Fzb3MnIGVsc2UgJ2Nhc2VzJ1xuICAgIGNhc2VzX3NpbmdsZV9zdHIgPSBpZiBAbGFuZyA9PSAnZXMnIHRoZW4gJ2Nhc28nIGVsc2UgJ2Nhc2UnXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNvdW50cnknXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAueWVhcidcbiAgICAgIC5odG1sIGQueWVhclxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXREZWNpbWFsKGQudmFsdWUsIEBsYW5nKVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgIC5odG1sIGlmIGQuY2FzZXMgIT0gMSB0aGVuIGQuY2FzZXMudG9Mb2NhbGVTdHJpbmcoQGxhbmcpICsgJyAnICsgY2FzZXNfc3RyIGVsc2UgZC5jYXNlcy50b0xvY2FsZVN0cmluZyhAbGFuZykgKyAnICcgKyBjYXNlc19zaW5nbGVfc3RyXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgb2Zmc2V0LmxlZnQgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgb2Zmc2V0LnRvcCAtIChAeS5iYW5kd2lkdGgoKSAqIDAuNSkgLSBAJHRvb2x0aXAuaGVpZ2h0KClcbiAgICAgICdvcGFjaXR5JzogJzEnXG4gICAgcmV0dXJuXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuICAgIHJldHVyblxuXG4gIGdldENvdW50cnlOYW1lOiAoY29kZSkgPT5cbiAgICBjb3VudHJ5ID0gQGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIHJldHVybiBpZiBjb3VudHJ5WzBdIHRoZW4gY291bnRyeVswXS5uYW1lIGVsc2UgJydcblxuICBmb3JtYXREZWNpbWFsOiAobnVtYmVyLCBsYW5nKSAtPlxuICAgIHJldHVybiBpZiBudW1iZXIgPCAwLjAwMSB0aGVuIDAgZWxzZSBpZiBudW1iZXIgPj0gMC4xIHRoZW4gbnVtYmVyLnRvRml4ZWQoMSkudG9Mb2NhbGVTdHJpbmcobGFuZykgZWxzZSBpZiBudW1iZXIgPj0gMC4wMSB0aGVuIG51bWJlci50b0ZpeGVkKDIpLnRvTG9jYWxlU3RyaW5nKGxhbmcpIGVsc2UgbnVtYmVyLnRvRml4ZWQoMykudG9Mb2NhbGVTdHJpbmcobGFuZylcblxuXG5cbiMgVmFjY2luZURpc2Vhc2VHcmFwaCA9IChfaWQpIC0+XG4jICAgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KClcbiMgICBZX0FYSVNfV0lEVEggPSAxMDBcbiMgICAjIE11c3QgYmUgdGhlIGFtZSB2YWx1ZSB0aGFuICN2YWNjaW5lLWRpc2Vhc2UtZ3JhcGggJHBhZGRpbmctbGVmdCBzY3NzIHZhcmlhYmxlXG4jICAgdGhhdCA9IHRoaXNcbiMgICBpZCA9IF9pZFxuIyAgIGRpc2Vhc2UgPSB1bmRlZmluZWRcbiMgICBzb3J0ID0gdW5kZWZpbmVkXG4jICAgbGFuZyA9IHVuZGVmaW5lZFxuIyAgIGRhdGEgPSB1bmRlZmluZWRcbiMgICBkYXRhUG9wdWxhdGlvbiA9IHVuZGVmaW5lZFxuIyAgIGN1cnJlbnREYXRhID0gdW5kZWZpbmVkXG4jICAgY2VsbERhdGEgPSB1bmRlZmluZWRcbiMgICBjb3VudHJpZXMgPSB1bmRlZmluZWRcbiMgICB5ZWFycyA9IHVuZGVmaW5lZFxuIyAgIGNlbGxTaXplID0gdW5kZWZpbmVkXG4jICAgY29udGFpbmVyID0gdW5kZWZpbmVkXG4jICAgeCA9IHVuZGVmaW5lZFxuIyAgIHkgPSB1bmRlZmluZWRcbiMgICB3aWR0aCA9IHVuZGVmaW5lZFxuIyAgIGhlaWdodCA9IHVuZGVmaW5lZFxuIyAgICRlbCA9IHVuZGVmaW5lZFxuIyAgICR0b29sdGlwID0gdW5kZWZpbmVkXG4jICAgIyBQdWJsaWMgTWV0aG9kc1xuXG4jICAgdGhhdC5pbml0ID0gKF9kaXNlYXNlLCBfc29ydCkgLT5cbiMgICAgIGRpc2Vhc2UgPSBfZGlzZWFzZVxuIyAgICAgc29ydCA9IF9zb3J0XG4jICAgICAjY29uc29sZS5sb2coJ1ZhY2NpbmUgR3JhcGggaW5pdCcsIGlkLCBkaXNlYXNlLCBzb3J0KTtcbiMgICAgICRlbCA9ICQoJyMnICsgaWQpXG4jICAgICAkdG9vbHRpcCA9ICRlbC5maW5kKCcudG9vbHRpcCcpXG4jICAgICBsYW5nID0gJGVsLmRhdGEoJ2xhbmcnKVxuIyAgICAgeCA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgeSA9IGQzLnNjYWxlQmFuZCgpLnBhZGRpbmcoMCkucGFkZGluZ0lubmVyKDApLnBhZGRpbmdPdXRlcigwKS5yb3VuZCh0cnVlKVxuIyAgICAgY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwoZDMuaW50ZXJwb2xhdGVPclJkKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICBjbGVhcigpXG4jICAgICAgIHNldHVwRGF0YSgpXG4jICAgICAgIHNldHVwR3JhcGgoKVxuIyAgICAgZWxzZVxuIyAgICAgICAjIExvYWQgQ1NWc1xuIyAgICAgICBkMy5xdWV1ZSgpLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSArICcvYXNzZXRzL2RhdGEvZGlzZWFzZXMtY2FzZXMuY3N2JykuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9hc3NldHMvZGF0YS9wb3B1bGF0aW9uLmNzdicpLmF3YWl0IG9uRGF0YVJlYWR5XG4jICAgICB0aGF0XG5cbiMgICB0aGF0Lm9uUmVzaXplID0gLT5cbiMgICAgIGdldERpbWVuc2lvbnMoKVxuIyAgICAgaWYgZGF0YVxuIyAgICAgICB1cGRhdGVHcmFwaCgpXG4jICAgICB0aGF0XG5cbiMgICBvbkRhdGFSZWFkeSA9IChlcnJvciwgZGF0YV9jc3YsIHBvcHVsYXRpb25fY3N2KSAtPlxuIyAgICAgZGF0YSA9IGRhdGFfY3N2XG4jICAgICBkYXRhUG9wdWxhdGlvbiA9IHBvcHVsYXRpb25fY3N2XG4jICAgICAjIHdlIGRvbid0IG5lZWQgdGhlIGNvbHVtbnMgYXR0cmlidXRlXG4jICAgICBkZWxldGUgZGF0YS5jb2x1bW5zXG4jICAgICAjIFdlIGNhbiBkZWZpbmUgYSBmaWx0ZXIgZnVuY3Rpb24gdG8gc2hvdyBvbmx5IHNvbWUgc2VsZWN0ZWQgY291bnRyaWVzXG4jICAgICBpZiB0aGF0LmZpbHRlclxuIyAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIodGhhdC5maWx0ZXIpXG4jICAgICBkYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9IGQuZGlzZWFzZS50b0xvd2VyQ2FzZSgpXG4jICAgICAgIGlmIGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiMgICAgICAgZC5jYXNlcyA9IHt9XG4jICAgICAgIGQudmFsdWVzID0ge31cbiMgICAgICAgIyBzZXQgdmFsdWUgZXMgY2FzZXMgLzEwMDAgaGFiaXRhbnRzXG4jICAgICAgIHBvcHVsYXRpb25JdGVtID0gcG9wdWxhdGlvbl9jc3YuZmlsdGVyKChjb3VudHJ5KSAtPlxuIyAgICAgICAgIGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiMgICAgICAgKVxuIyAgICAgICBpZiBwb3B1bGF0aW9uSXRlbS5sZW5ndGggPiAwXG4jICAgICAgICAgeWVhciA9IDE5ODBcbiMgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuIyAgICAgICAgICAgaWYgZFt5ZWFyXVxuIyAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4jICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuIyAgICAgICAgICAgICAgICNkW3llYXJdID0gMTAwMCAqICgrZFt5ZWFyXSAvIHBvcHVsYXRpb24pO1xuIyAgICAgICAgICAgICAgIGQuY2FzZXNbeWVhcl0gPSArZFt5ZWFyXVxuIyAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuIyAgICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSBudWxsO1xuIyAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZWxzZVxuIyAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiMgICAgICAgICAgIGRlbGV0ZSBkW3llYXJdXG4jICAgICAgICAgICB5ZWFyKytcbiMgICAgICAgZWxzZVxuIyAgICAgICAgIGNvbnNvbGUubG9nICdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lXG4jICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4jICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+XG4jICAgICAgICAgYSArIGJcbiMgICAgICAgKSwgMClcbiMgICAgICAgcmV0dXJuXG4jICAgICBzZXR1cERhdGEoKVxuIyAgICAgc2V0dXBHcmFwaCgpXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwRGF0YSA9IC0+XG4jICAgICAjIEZpbHRlciBkYXRhIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiMgICAgIGN1cnJlbnREYXRhID0gZGF0YS5maWx0ZXIoKGQpIC0+XG4jICAgICAgIGQuZGlzZWFzZSA9PSBkaXNlYXNlIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiMgICAgIClcbiMgICAgICMgU29ydCBkYXRhXG4jICAgICBpZiBzb3J0ID09ICd5ZWFyJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGlmIGlzTmFOKGEueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gMSBlbHNlIGlmIGlzTmFOKGIueWVhcl9pbnRyb2R1Y3Rpb24pIHRoZW4gLTEgZWxzZSBiLnllYXJfaW50cm9kdWN0aW9uIC0gKGEueWVhcl9pbnRyb2R1Y3Rpb24pXG4jICAgICBlbHNlIGlmIHNvcnQgPT0gJ2Nhc2VzJ1xuIyAgICAgICBjdXJyZW50RGF0YS5zb3J0IChhLCBiKSAtPlxuIyAgICAgICAgIGIudG90YWwgLSAoYS50b3RhbClcbiMgICAgICMgR2V0IGFycmF5IG9mIGNvdW50cnkgbmFtZXNcbiMgICAgIGNvdW50cmllcyA9IGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAgZC5jb2RlXG4jICAgICApXG4jICAgICAjIEdldCBhcnJheSBvZiB5ZWFyc1xuIyAgICAgbWluWWVhciA9IGQzLm1pbihjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1pbiBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgbWF4WWVhciA9IGQzLm1heChjdXJyZW50RGF0YSwgKGQpIC0+XG4jICAgICAgIGQzLm1heCBkMy5rZXlzKGQudmFsdWVzKVxuIyAgICAgKVxuIyAgICAgeWVhcnMgPSBkMy5yYW5nZShtaW5ZZWFyLCBtYXhZZWFyLCAxKVxuIyAgICAgeWVhcnMucHVzaCArbWF4WWVhclxuIyAgICAgI2NvbnNvbGUubG9nKG1pblllYXIsIG1heFllYXIsIHllYXJzKTtcbiMgICAgICNjb25zb2xlLmxvZyhjb3VudHJpZXMpO1xuIyAgICAgIyBHZXQgYXJyYXkgb2YgZGF0YSB2YWx1ZXNcbiMgICAgIGNlbGxzRGF0YSA9IFtdXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoIChkKSAtPlxuIyAgICAgICBmb3IgdmFsdWUgb2YgZC52YWx1ZXNcbiMgICAgICAgICBjZWxsc0RhdGEucHVzaFxuIyAgICAgICAgICAgY291bnRyeTogZC5jb2RlXG4jICAgICAgICAgICBuYW1lOiBkLm5hbWVcbiMgICAgICAgICAgIHllYXI6IHZhbHVlXG4jICAgICAgICAgICBjYXNlczogZC5jYXNlc1t2YWx1ZV1cbiMgICAgICAgICAgIHZhbHVlOiBkLnZhbHVlc1t2YWx1ZV1cbiMgICAgICAgcmV0dXJuXG5cbiMgICAgICMjI1xuIyAgICAgY3VycmVudERhdGEuZm9yRWFjaChmdW5jdGlvbihkKXtcbiMgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuIyAgICAgICB5ZWFycy5mb3JFYWNoKGZ1bmN0aW9uKHllYXIpe1xuIyAgICAgICAgIGlmIChkW3llYXJdKVxuIyAgICAgICAgICAgY291bnRlcisrO1xuIyAgICAgICB9KTtcbiMgICAgICAgaWYoY291bnRlciA8PSAyMCkgLy8geWVhcnMubGVuZ3RoLzIpXG4jICAgICAgICAgY29uc29sZS5sb2coZC5uYW1lICsgJyBoYXMgb25seSB2YWx1ZXMgZm9yICcgKyBjb3VudGVyICsgJyB5ZWFycycpO1xuIyAgICAgfSk7XG4jICAgICAjIyNcblxuIyAgICAgcmV0dXJuXG5cbiMgICBzZXR1cEdyYXBoID0gLT5cbiMgICAgICMgR2V0IGRpbWVuc2lvbnMgKGhlaWdodCBpcyBiYXNlZCBvbiBjb3VudHJpZXMgbGVuZ3RoKVxuIyAgICAgZ2V0RGltZW5zaW9ucygpXG4jICAgICB4LmRvbWFpbih5ZWFycykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIHdpZHRoXG4jICAgICBdXG4jICAgICB5LmRvbWFpbihjb3VudHJpZXMpLnJhbmdlIFtcbiMgICAgICAgMFxuIyAgICAgICBoZWlnaHRcbiMgICAgIF1cbiMgICAgICNjb2xvci5kb21haW4oW2QzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSksIDBdKTtcbiMgICAgIGNvbG9yLmRvbWFpbiBbXG4jICAgICAgIDBcbiMgICAgICAgNFxuIyAgICAgXVxuIyAgICAgI2NvbnNvbGUubG9nKCdNYXhpbXVtIGNhc2VzIHZhbHVlOiAnKyBkMy5tYXgoY2VsbHNEYXRhLCBmdW5jdGlvbihkKXsgcmV0dXJuIGQudmFsdWU7IH0pKTtcbiMgICAgICMgQWRkIHN2Z1xuIyAgICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJyArIGlkICsgJyAuZ3JhcGgtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpXG4jICAgICAjIERyYXcgY2VsbHNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwtY29udGFpbmVyJykuc3R5bGUoJ2hlaWdodCcsIGhlaWdodCArICdweCcpLnNlbGVjdEFsbCgnLmNlbGwnKS5kYXRhKGNlbGxzRGF0YSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2NlbGwnKS5zdHlsZSgnYmFja2dyb3VuZCcsIChkKSAtPlxuIyAgICAgICBjb2xvciBkLnZhbHVlXG4jICAgICApLmNhbGwoc2V0Q2VsbERpbWVuc2lvbnMpLm9uKCdtb3VzZW92ZXInLCBvbk1vdXNlT3Zlcikub24gJ21vdXNlb3V0Jywgb25Nb3VzZU91dFxuIyAgICAgIyBEcmF3IHllYXJzIHggYXhpc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAneC1heGlzIGF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKS5kYXRhKHllYXJzLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZCAlIDUgPT0gMFxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2F4aXMtaXRlbScpLnN0eWxlKCdsZWZ0JywgKGQpIC0+XG4jICAgICAgIHgoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGRcbiMgICAgICMgRHJhdyBjb3VudHJpZXMgeSBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd5LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoY291bnRyaWVzKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ3RvcCcsIChkKSAtPlxuIyAgICAgICB5KGQpICsgJ3B4J1xuIyAgICAgKS5odG1sIChkKSAtPlxuIyAgICAgICBnZXRDb3VudHJ5TmFtZSBkXG4jICAgICAjIERyYXcgeWVhciBpbnRyb2R1Y3Rpb24gbWFya1xuIyAgICAgY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJykuc2VsZWN0QWxsKCcubWFya2VyJykuZGF0YShjdXJyZW50RGF0YS5tYXAoKGQpIC0+XG4jICAgICAgIHtcbiMgICAgICAgICBjb2RlOiBkLmNvZGVcbiMgICAgICAgICB5ZWFyOiBkLnllYXJfaW50cm9kdWN0aW9uXG4jICAgICAgIH1cbiMgICAgICkuZmlsdGVyKChkKSAtPlxuIyAgICAgICAhaXNOYU4oZC55ZWFyKVxuIyAgICAgKSkuZW50ZXIoKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ21hcmtlcicpLmNhbGwgc2V0TWFya2VyRGltZW5zaW9uc1xuIyAgICAgcmV0dXJuXG5cbiMgICBjbGVhciA9IC0+XG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5yZW1vdmUoKVxuIyAgICAgY29udGFpbmVyLnNlbGVjdEFsbCgnLmF4aXMnKS5yZW1vdmUoKVxuIyAgICAgcmV0dXJuXG5cblxuXG4iLCIjIE1haW4gc2NyaXB0IGZvciB2YWNjaW5lcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG5cbiAgIyBJbml0IFRvb2x0aXBzXG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKClcblxuXG4gICMgZ2V0IGNvdW50cnkgbmFtZSBhdXhpbGlhciBtZXRob2RcbiAgZ2V0Q291bnRyeU5hbWUgPSAoY291bnRyaWVzLCBjb2RlLCBsYW5nKSAtPlxuICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY29kZVxuICAgIGlmIGl0ZW1cbiAgICAgIGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZXJyb3IgJ05vIGNvdW50cnkgbmFtZSBmb3IgY29kZScsIGNvZGVcblxuXG4gICMgVmlkZW8gb2YgbWFwIHBvbGlvIGNhc2VzXG4gIHNldFZpZGVvTWFwUG9saW8gPSAtPlxuICAgIHdyYXBwZXIgPSBQb3Bjb3JuLkhUTUxZb3VUdWJlVmlkZW9FbGVtZW50KCcjdmlkZW8tbWFwLXBvbGlvJylcbiAgICB3cmFwcGVyLnNyYyA9ICdodHRwOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL2wxRjJYZDVGRmxRP2NvbnRyb2xzPTAmc2hvd2luZm89MCZoZD0xJ1xuICAgIHBvcGNvcm4gPSBQb3Bjb3JuKHdyYXBwZXIpXG4gICAgbm90ZXMgPSAyMDE2IC0gMTk4MFxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8PSBub3Rlc1xuICAgICAgcG9wY29ybi5mb290bm90ZVxuICAgICAgICBzdGFydDogIDEuNjIyMiAqIGlcbiAgICAgICAgZW5kOiAgICAxLjYyMjIgKiAoaSArIDEpXG4gICAgICAgIHRleHQ6ICAgMTk4MCArIGlcbiAgICAgICAgdGFyZ2V0OiAndmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJ1xuICAgICAgaSsrXG4gICAgIyBTaG93IGNvdmVyIHdoZW4gdmlkZW8gZW5kZWRcbiAgICB3cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIgJ2VuZGVkJywgKGUpIC0+XG4gICAgICAkKCcudmlkZW8tbWFwLXBvbGlvLWNvdmVyJykuZmFkZUluKClcbiAgICAgICQoJyN2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nKS5mYWRlVG8gMzAwLCAwXG4gICAgICBwb3Bjb3JuLmN1cnJlbnRUaW1lIDBcbiAgICAjIFNob3cgdmlkZW8gd2hlbiBwbGF5IGJ0biBjbGlja2VkXG4gICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1wbGF5LWJ0bicpLmNsaWNrIChlKSAtPlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBwb3Bjb3JuLnBsYXkoKVxuICAgICAgJCgnLnZpZGVvLW1hcC1wb2xpby1jb3ZlcicpLmZhZGVPdXQoKVxuICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbicpLmZhZGVUbyAzMDAsIDFcblxuXG4gICMgTWVhc2xlcyBjYXNlcyBIZWF0bWFwIEdyYXBoXG4gIHNldHVwSGVhdE1hcEdyYXBoID0gKGlkLCBkYXRhLCBjb3VudHJpZXMsIGRpc2Vhc2UpIC0+XG4gICAgZGF0YSA9IGRhdGFcbiAgICAgIC5maWx0ZXIgKGQpIC0+IGNvdW50cmllcy5pbmRleE9mKGQuY29kZSkgIT0gLTEgYW5kIGQuZGlzZWFzZSA9PSBkaXNlYXNlIGFuZCBkMy52YWx1ZXMoZC52YWx1ZXMpLmxlbmd0aCA+IDBcbiAgICAgIC5zb3J0IChhLGIpIC0+IGEudG90YWwgLSBiLnRvdGFsXG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkhlYXRtYXBHcmFwaChpZCxcbiAgICAgIG1hcmdpbjogXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGxlZnQ6IDApXG4gICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuXG4gIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGggPSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvcG9wdWxhdGlvbi5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX2Nhc2VzLCBkYXRhX3BvcHVsYXRpb24pIC0+XG4gICAgICAgIGRlbGV0ZSBkYXRhX2Nhc2VzLmNvbHVtbnMgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiAgICAgICAgZGF0YV9jYXNlcy5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGQuZGlzZWFzZSA9IGQuZGlzZWFzZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgaWYgZC55ZWFyX2ludHJvZHVjdGlvblxuICAgICAgICAgICAgZC55ZWFyX2ludHJvZHVjdGlvbiA9ICtkLnllYXJfaW50cm9kdWN0aW9uLnJlcGxhY2UoJ3ByaW9yIHRvJywgJycpXG4gICAgICAgICAgZC5jYXNlcyA9IHt9XG4gICAgICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgICAgICMgc2V0IHZhbHVlcyBhcyBjYXNlcy8xMDAwIGhhYml0YW50c1xuICAgICAgICAgIHBvcHVsYXRpb25JdGVtID0gZGF0YV9wb3B1bGF0aW9uLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIHllYXIgPSAxOTgwXG4gICAgICAgICAgICB3aGlsZSB5ZWFyIDwgMjAxNlxuICAgICAgICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgICAgICAgcG9wdWxhdGlvbiA9ICtwb3B1bGF0aW9uSXRlbVswXVt5ZWFyXVxuICAgICAgICAgICAgICAgIGlmIHBvcHVsYXRpb24gIT0gMFxuICAgICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9IDEwMDAgKiArZFt5ZWFyXSAvIHBvcHVsYXRpb25cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAjY29uc29sZS5sb2coJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIGNhc29zIGRlICcgKyBkLmRpc2Vhc2UgKyAnIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyLCAnOicsIGRbeWVhcl0sIHR5cGVvZiBkW3llYXJdKTtcbiAgICAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiAgICAgICAgICAgICAgeWVhcisrXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiAgICAgICAgICAjIEdldCB0b3RhbCBjYXNlcyBieSBjb3VudHJ5ICYgZGlzZWFzZVxuICAgICAgICAgIGQudG90YWwgPSBkMy52YWx1ZXMoZC52YWx1ZXMpLnJlZHVjZSgoKGEsIGIpIC0+IGEgKyBiKSwgMClcbiAgICAgICAgIyBGaWx0ZXIgYnkgc2VsZWN0ZWQgY291bnRyaWVzICYgZGlzZWFzZVxuICAgICAgICBzZXR1cEhlYXRNYXBHcmFwaCAndmFjY2luZXMtbWVhc2xlcy1ncmFwaC0xJywgZGF0YV9jYXNlcywgWydGSU4nLCdIVU4nLCdQUlQnLCdVUlknLCdNRVgnLCdDT0wnXSwgJ21lYXNsZXMnXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTInLCBkYXRhX2Nhc2VzLCBbJ0lSUScsJ0JHUicsJ01ORycsJ1pBRicsJ0ZSQScsJ0dFTyddLCAnbWVhc2xlcydcblxuXG4gICMgSW1tdW5pemF0aW9uIENvdmVyYWdlIER5bmFtaWMgTGluZSBHcmFwaCAod2UgY2FuIHNlbGVjdCBkaWZlcmVudGUgZGlzZWFzZXMgJiBjb3VudHJpZXMpXG4gIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VEeW5hbWljTGluZUdyYXBoID0gLT5cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJyxcbiAgICAgIGtleTogXG4gICAgICAgIGlkOiAnY29kZSdcbiAgICAgICAgeDogJ25hbWUnXG4gICAgICBsYWJlbDogdHJ1ZVxuICAgICAgbWFyZ2luOiB0b3A6IDIwKVxuICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IChkKSAtPiBbMCwgMTAwXVxuICAgIGdyYXBoLnlBeGlzLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICBkMy5jc3YgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2ltbXVuaXphdGlvbi1jb3ZlcmFnZS5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAjIFVwZGF0ZSBkYXRhIGJhc2VkIG9uIHNlbGVjdGVkIHZhY2NpbmVcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09ICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtdmFjY2luZS1zZWxlY3RvcicpLnZhbCgpKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgICAjIFVwZGF0ZSBhY3RpdmUgY291bnRyaWVzXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvciwgI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJykuZmluZCgnLmxpbmUtbGFiZWwsIC5saW5lJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS1sYWJlbC0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoLWFsbCAjbGluZS1sYWJlbC0nKyQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0yLXNlbGVjdG9yJykudmFsKCkpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIEltbXVuaXphdGlvbiBDb3ZlcmFnZSBMaW5lIEdyYXBoICh3aWR0aCBzZWxlY3RlZCBjb3VudHJpZXMpXG4gIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VMaW5lR3JhcGggPSAtPlxuICAgIGNvdW50cmllcyA9IFsnRlJBJywnRE5LJywnRFpBJywnTEtBJ11cbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKCdpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgnLCBcbiAgICAgIGtleTogXG4gICAgICAgIGlkOiAnY29kZSdcbiAgICAgICAgeDogJ25hbWUnXG4gICAgICBsYWJlbDogdHJ1ZVxuICAgICAgbWFyZ2luOiB0b3A6IDIwKVxuICAgIGdyYXBoLmdldFNjYWxlWURvbWFpbiA9IChkKSAtPiBbMCwgMTAwXVxuICAgIGdyYXBoLnlBeGlzLnRpY2tWYWx1ZXMgWzAsMjUsNTAsNzUsMTAwXVxuICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzIwMDEsMjAwMywyMDA1LDIwMDcsMjAwOSwyMDExLDIwMTMsMjAxNV1cbiAgICBncmFwaC5hZGRNYXJrZXJcbiAgICAgIHZhbHVlOiA5NVxuICAgICAgbGFiZWw6ICdOaXZlbCBkZSByZWJhw7FvJ1xuICAgICAgYWxpZ246ICdsZWZ0J1xuICAgIGQzLmNzdiBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLW1jdjIuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhLmZpbHRlcigoZCkgLT4gY291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSAhPSAtMSlcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBXb3JsZCBDYXNlcyBNdWx0aXBsZSBTbWFsbFxuICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGggPSAtPlxuICAgIGRpc2Vhc2VzID0gWydkaXBodGVyaWEnLCAnbWVhc2xlcycsJ3BlcnR1c3NpcycsJ3BvbGlvJywndGV0YW51cyddXG4gICAgZ3JhcGhzID0gW11cbiAgICAjIExvYWQgZGF0YVxuICAgIGQzLmNzdiBiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtY2FzZXMtd29ybGQuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgIyBHZXQgbWF4IHZhbHVlIHRvIGNyZWF0ZSBhIGNvbW1vbiB5IHNjYWxlXG4gICAgICBtYXhWYWx1ZTEgPSBkMy5tYXggZGF0YSwgKGQpIC0+IGQzLm1heChkMy52YWx1ZXMoZCksIChlKSAtPiArZSlcbiAgICAgIG1heFZhbHVlMiA9IDEwMDAwMCAjZDMubWF4IGRhdGEuZmlsdGVyKChkKSAtPiBbJ2RpcGh0ZXJpYScsJ3BvbGlvJywndGV0YW51cyddLmluZGV4T2YoZC5kaXNlYXNlKSAhPSAtMSksIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQpLCAoZSkgLT4gK2UpXG4gICAgICAjIGNyZWF0ZSBhIGxpbmUgZ3JhcGggZm9yIGVhY2ggZGlzZWFzZVxuICAgICAgZGlzZWFzZXMuZm9yRWFjaCAoZGlzZWFzZSkgLT5cbiAgICAgICAgIyBnZXQgY3VycmVudCBkaXNlYXNlIGRhdGFcbiAgICAgICAgZGlzZWFzZV9kYXRhID0gZGF0YVxuICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQuZGlzZWFzZSA9PSBkaXNlYXNlXG4gICAgICAgICAgLm1hcCAgICAoZCkgLT4gJC5leHRlbmQoe30sIGQpXG4gICAgICAgICMgc2V0dXAgbGluZSBjaGFydFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKGRpc2Vhc2UrJy13b3JsZC1ncmFwaCcsXG4gICAgICAgICAgaXNBcmVhOiB0cnVlXG4gICAgICAgICAgbWFyZ2luOiBsZWZ0OiAyMFxuICAgICAgICAgIGtleTogXG4gICAgICAgICAgICB4OiAnZGlzZWFzZSdcbiAgICAgICAgICAgIGlkOiAnZGlzZWFzZScpXG4gICAgICAgIGdyYXBocy5wdXNoIGdyYXBoXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzE5ODAsIDIwMTVdXG4gICAgICAgIGdyYXBoLnlBeGlzLnRpY2tzKDIpLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcuMHMnKVxuICAgICAgICBncmFwaC55Rm9ybWF0ID0gZDMuZm9ybWF0KCcuMnMnKVxuICAgICAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAtPiByZXR1cm4gWzAsIGlmIGRpc2Vhc2UgPT0gJ21lYXNsZXMnIG9yIGRpc2Vhc2UgPT0gJ3BlcnR1c3NpcycgdGhlbiBtYXhWYWx1ZTEgZWxzZSBtYXhWYWx1ZTJdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGlzZWFzZV9kYXRhXG4gICAgICAgICMgbGlzdGVuIHRvIHllYXIgY2hhbmdlcyAmIHVwZGF0ZSBlYWNoIGdyYXBoIGxhYmVsXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICBncmFwaC4kZWwub24gJ21vdXNlb3V0JywgKGUpIC0+XG4gICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICBnLmhpZGVMYWJlbCgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cEltbXVuaXphdGlvbkRpc2Vhc2VCYXJHcmFwaCA9IC0+XG4gICAgIyBMb2FkIGRhdGFcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzKSAtPlxuICAgICAgICAjIFNldHVwIGN1cnJlbnQgY291bnRyeSAtPiBUT0RPISEhIHdlIGhhdmUgdG8gZ2V0IHVzZXIgY291bnRyeVxuICAgICAgICBjb3VudHJ5ID0gJ0VTUCdcbiAgICAgICAgIyBGaWx0ZXIgZGF0YVxuICAgICAgICBleGNsdWRlZENvdW50cmllcyA9IFsnVFVWJywnTlJVJywnUExXJywnVkdCJywnTUFGJywnU01SJywnR0lCJywnVENBJywnTElFJywnTUNPJywnU1hNJywnRlJPJywnTUhMJywnTU5QJywnQVNNJywnS05BJywnR1JMJywnQ1knLCdCTVUnLCdBTkQnLCdETUEnLCdJTU4nLCdBVEcnLCdTWUMnLCdWSVInLCdBQlcnLCdGU00nLCdUT04nLCdHUkQnLCdWQ1QnLCdLSVInLCdDVVcnLCdDSEknLCdHVU0nLCdMQ0EnLCdTVFAnLCdXU00nLCdWVVQnLCdOQ0wnLCdQWUYnLCdCUkInXVxuICAgICAgICBoZXJkSW1tdW5pdHkgPSBcbiAgICAgICAgICAnTUNWMSc6IDk1XG4gICAgICAgICAgJ1BvbDMnOiA4MFxuICAgICAgICAgICdEVFAzJzogODBcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBleGNsdWRlZENvdW50cmllcy5pbmRleE9mKGQuY29kZSkgPT0gLTFcbiAgICAgICAgIyBEYXRhIHBhcnNlICYgc29ydGluZyBmdW50aW9uc1xuICAgICAgICBkYXRhX3BhcnNlciA9IChkKSAtPlxuICAgICAgICAgIG9iaiA9IFxuICAgICAgICAgICAga2V5OiAgIGQuY29kZVxuICAgICAgICAgICAgbmFtZTogIGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5jb2RlLCBsYW5nKVxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE1J11cbiAgICAgICAgICBpZiBkLmNvZGUgPT0gY291bnRyeVxuICAgICAgICAgICAgb2JqLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgIGRhdGFfc29ydCA9IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAjIGxvb3AgdGhyb3VnaCBlYWNoIGdyYXBoXG4gICAgICAgICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmVhY2ggLT5cbiAgICAgICAgICAkZWwgICAgID0gJCh0aGlzKVxuICAgICAgICAgIGRpc2Vhc2UgPSAkZWwuZGF0YSgnZGlzZWFzZScpXG4gICAgICAgICAgdmFjY2luZSA9ICRlbC5kYXRhKCd2YWNjaW5lJylcbiAgICAgICAgICAjIEdldCBncmFwaCBkYXRhICYgdmFsdWVcbiAgICAgICAgICBncmFwaF9kYXRhID0gZGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09IHZhY2NpbmUgYW5kIGRbJzIwMTUnXSAhPSAnJylcbiAgICAgICAgICAgIC5tYXAoZGF0YV9wYXJzZXIpXG4gICAgICAgICAgICAuc29ydChkYXRhX3NvcnQpXG4gICAgICAgICAgZ3JhcGhfdmFsdWUgPSBncmFwaF9kYXRhLmZpbHRlcigoZCkgLT4gZC5rZXkgPT0gY291bnRyeSlcbiAgICAgICAgICAjIFNldHVwIGdyYXBoXG4gICAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKGRpc2Vhc2UrJy1pbW11bml6YXRpb24tYmFyLWdyYXBoJyxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjI1XG4gICAgICAgICAgICBsYWJlbDogdHJ1ZVxuICAgICAgICAgICAga2V5OiB4OiAnbmFtZSdcbiAgICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgICAgdG9wOiAyMFxuICAgICAgICAgICAgICBib3R0b206IDApICAgXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXJcbiAgICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgICBsYWJlbDogaWYgdmFjY2luZSAhPSAnRFRQMycgdGhlbiAnTml2ZWwgZGUgcmViYcOxbycgZWxzZSAnUmVjb21lbmRhY2nDs24gT01TJ1xuICAgICAgICAgICAgLnNldERhdGEgZ3JhcGhfZGF0YVxuICAgICAgICAgICMgU2V0dXAgZ3JhcGggdmFsdWVcbiAgICAgICAgICBpZiBncmFwaF92YWx1ZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAkZWwuZmluZCgnLmltbXVuaXphdGlvbi1kYXRhJykuaHRtbCAnPHN0cm9uZz4nICsgZ3JhcGhfdmFsdWVbMF0udmFsdWUgKyAnJTwvc3Ryb25nPidcbiAgICAgICAgICAjIE9uIHJlc2l6ZVxuICAgICAgICAgICQod2luZG93KS5yZXNpemUgLT4gZ3JhcGgub25SZXNpemUoKVxuICBcbiAgIyMjXG4gIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2d1YXRlbWFsYS1jb3ZlcmFnZS1tbXInLFxuICAgICAgI2lzQXJlYTogdHJ1ZVxuICAgICAgbWFyZ2luOiBcbiAgICAgICAgbGVmdDogMFxuICAgICAgICByaWdodDogMFxuICAgICAgICBib3R0b206IDIwKVxuICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzIwMDAsIDIwMDUsIDIwMTAsIDIwMTVdXG4gICAgZ3JhcGgueUF4aXNcbiAgICAgIC50aWNrVmFsdWVzIFswLCAyNSwgNTAsIDc1LCAxMDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICBncmFwaC5sb2FkRGF0YSBiYXNldXJsKycvYXNzZXRzL2RhdGEvZ3VhdGVtYWxhLWNvdmVyYWdlLW1tci5jc3YnXG4gICAgZ3JhcGguJGVsLm9uICdkcmF3LWNvbXBsZXRlJywgKGUpIC0+XG4gICAgICBsaW5lID0gZ3JhcGguY29udGFpbmVyLnNlbGVjdCgnLmxpbmUnKVxuICAgICAgY29uc29sZS5sb2cgbGluZS5ub2RlKClcbiAgICAgIGxlbmd0aCA9IGxpbmUubm9kZSgpLmdldFRvdGFsTGVuZ3RoKCk7XG4gICAgICBsaW5lXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaGFycmF5JywgbGVuZ3RoICsgJyAnICsgbGVuZ3RoKVxuICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCBsZW5ndGgpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZGVsYXkoNTAwMClcbiAgICAgICAgICAuZHVyYXRpb24oNTAwMClcbiAgICAgICAgICAuZWFzZShkMy5lYXNlU2luSW5PdXQpXG4gICAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0JywgMClcblxuICBpZiAkKCcjZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicpLmxlbmd0aCA+IDBcbiAgICBzZXR1cEd1YXRlbWFsYUNvdmVyYWdlTGluZUdyYXBoKClcbiAgIyMjXG5cbiAgaWYgJCgnI3ZpZGVvLW1hcC1wb2xpbycpLmxlbmd0aCA+IDBcbiAgICBzZXRWaWRlb01hcFBvbGlvKClcblxuICAjIyNcbiAgLy8gVmFjY2luZSBtYXBcbiAgaWYgKCQoJyN2YWNjaW5lLW1hcCcpLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgdmFjY2luZV9tYXAgPSBuZXcgVmFjY2luZU1hcCgndmFjY2luZS1tYXAnKTtcbiAgICAvL3ZhY2NpbmVfbWFwLmdldERhdGEgPSB0cnVlOyAvLyBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIHBvbGlvIGNhc2VzIGNzdlxuICAgIC8vdmFjY2luZV9tYXAuZ2V0UGljdHVyZVNlcXVlbmNlID0gdHJ1ZTsgLy8gU2V0IHRydWUgdG8gZG93bmxvYWQgYSBtYXAgcGljdHVyZSBzZXF1ZW5jZVxuICAgIHZhY2NpbmVfbWFwLmluaXQoYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2Rpc2Vhc2VzLXBvbGlvLWNhc2VzLmNzdicsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9tYXAtcG9saW8tY2FzZXMuY3N2Jyk7XG4gICAgJCh3aW5kb3cpLnJlc2l6ZSggdmFjY2luZV9tYXAub25SZXNpemUgKTtcbiAgfVxuICAjIyNcblxuICBpZiAkKCcudmFjY2luZXMtZGlzZWFzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFZhY2NpbmVEaXNlYXNlSGVhdG1hcEdyYXBoKClcblxuICAjIyNcbiAgIyBWYWNjaW5lIGFsbCBkaXNlYXNlcyBncmFwaFxuICBpZiAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzID0gbmV3IFZhY2NpbmVEaXNlYXNlR3JhcGgoJ3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCcpXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKCcjdmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoICNvcmRlci1zZWxlY3RvcicpLnZhbCgpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5vblJlc2l6ZVxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VkIG9uIHNlbGVjdGVkIGRpc2Vhc2VcbiAgICAkKCcjZGlzZWFzZS1zZWxlY3RvciBhJykuY2xpY2sgKGUpIC0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICQodGhpcykudGFiICdzaG93J1xuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAgIHJldHVyblxuICAgICMgVXBkYXRlIGdyYXBoIGJhc2VvbiBvbiBvcmRlciBzZWxlY3RvclxuICAgICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykuY2hhbmdlIChkKSAtPlxuICAgICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMuaW5pdCAkKCcjZGlzZWFzZS1zZWxlY3RvciAuYWN0aXZlIGEnKS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpLCAkKHRoaXMpLnZhbCgpXG4gICMjI1xuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VEeW5hbWljTGluZUdyYXBoKClcblxuICBpZiAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uQ292ZXJhZ2VMaW5lR3JhcGgoKVxuXG4gIGlmICQoJyN3b3JsZC1jYXNlcycpLmxlbmd0aCA+IDBcbiAgICBzZXR1cFdvcmxkQ2FzZXNNdWx0aXBsZVNtYWxsR3JhcGgoKVxuICBcbiAgaWYgJCgnLmltbXVuaXphdGlvbi1jb3ZlcmFnZS1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwSW1tdW5pemF0aW9uRGlzZWFzZUJhckdyYXBoKClcblxuKSBqUXVlcnkiXX0=
