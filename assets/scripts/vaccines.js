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
      this.container.append('text').attr('class', 'tick-hover').attr('dy', '0.71em').attr('y', Math.round(this.height + 9)).style('display', 'none');
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
        maxValue2 = d3.max(data.filter(function(d) {
          return ['diphteria', 'polio', 'tetanus'].indexOf(d.disease) !== -1;
        }), function(d) {
          return d3.max(d3.values(d), function(e) {
            return +e;
          });
        });
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
            label: 'Nivel de rebaño'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImxpbmUtZ3JhcGguY29mZmVlIiwiaGVhdG1hcC1ncmFwaC5jb2ZmZWUiLCJtYWluLXZhY2NpbmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLFdBQUEsRUFBYSxJQVBiO01BUUEsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVEY7OztJQWFGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLGNBQWYsRUFBK0IsT0FBL0I7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQVA7TUFDWixJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0FBQ1gsYUFBTztJQVJJOzt3QkFjYixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxHQUFELEdBQU8sRUFB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QWdVRSxNQWhVRjtBQUFBIiwiZmlsZSI6InZhY2NpbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAb3B0aW9ucy5tYXJnaW4ubGVmdCsnLCcrKEBvcHRpb25zLm1hcmdpbi50b3ArQGhlaWdodCkrJyknXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnICwnK0BvcHRpb25zLm1hcmdpbi50b3ArJyknXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQG9wdGlvbnMubWFyZ2luLmxlZnQrJywnKyhAb3B0aW9ucy5tYXJnaW4udG9wK0BoZWlnaHQpKycpJ1xuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJyAsJytAb3B0aW9ucy5tYXJnaW4udG9wKycpJ1xuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuXG4gICAgIyBBdXhpbGlhciBtZXRob2RzXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXREYXRhWDogLT5cbiAgICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gICAgZ2V0RGF0YVk6IC0+XG4gICAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFyR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdCYXIgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBkLnZhbHVlID0gK2QudmFsdWVcbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2JhciBhY3RpdmUnIGVsc2UgJ2JhcidcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLm9uICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC15IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJy0wLjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgPT4gQGhlaWdodCAtIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEBoZWlnaHRcblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHVubGVzcyBkLmFjdGl2ZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAiLCJjbGFzcyB3aW5kb3cuTGluZUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgeUZvcm1hdDogZDMuZm9ybWF0KCdkJykgICAjIHNldCBsYWJlbHMgaG92ZXIgZm9ybWF0XG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIGNvbnNvbGUubG9nICdMaW5lIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEB5ZWFycyA9IEBnZXRZZWFycyBkYXRhXG4gICAgc3VwZXIoZGF0YSlcbiAgICByZXR1cm4gQFxuXG4gIGdldFllYXJzOiAoZGF0YSkgLT5cbiAgICB5ZWFycyA9IFtdXG4gICAgZDMua2V5cyhkYXRhWzBdKS5mb3JFYWNoIChkKSAtPlxuICAgICAgaWYgK2RcbiAgICAgICAgeWVhcnMucHVzaCArZFxuICAgIHJldHVybiB5ZWFycy5zb3J0KClcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZC52YWx1ZXMgPSB7fVxuICAgICAgQHllYXJzLmZvckVhY2ggKHllYXIpID0+XG4gICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICBkLnZhbHVlc1t5ZWFyXSA9ICtkW3llYXJdXG4gICAgICAgICNlbHNlXG4gICAgICAgICMgIGNvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcGFyYScsIGRbQG9wdGlvbnMua2V5LnhdLCAnZW4gJywgeWVhcik7XG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrRm9ybWF0IGQzLmZvcm1hdCgnJylcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHNldHVwIGxpbmVcbiAgICBAbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgLnggKGQpID0+IEB4KCtkLmtleSlcbiAgICAgIC55IChkKSA9PiBAeShkLnZhbHVlKVxuICAgICMgc2V0dXAgYXJlYVxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEgPSBkMy5hcmVhKClcbiAgICAgICAgLmN1cnZlIGQzLmN1cnZlQ2F0bXVsbFJvbVxuICAgICAgICAueCAgKGQpID0+IEB4KCtkLmtleSlcbiAgICAgICAgLnkwIEBoZWlnaHRcbiAgICAgICAgLnkxIChkKSA9PiBAeShkLnZhbHVlKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbQHllYXJzWzBdLCBAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV1cblxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXggQGRhdGEsIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQudmFsdWVzKSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgY2xlYXIgZ3JhcGggYmVmb3JlIHNldHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5ncmFwaCcpLnJlbW92ZSgpXG4gICAgIyBkcmF3IGdyYXBoIGNvbnRhaW5lciBcbiAgICBAZ3JhcGggPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZ3JhcGgnXG4gICAgIyBkcmF3IGxpbmVzXG4gICAgQGRyYXdMaW5lcygpXG4gICAgIyBkcmF3IGFyZWFzXG4gICAgaWYgQG9wdGlvbnMuaXNBcmVhXG4gICAgICBAZHJhd0FyZWFzKClcbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBkcmF3TGFiZWxzKClcbiAgICAjIGRyYXcgbW91c2UgZXZlbnRzIGxhYmVsc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAZHJhd0xpbmVMYWJlbEhvdmVyKClcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIEBkcmF3VG9vbHRpcCgpXG4gICAgICBAZHJhd1JlY3RPdmVybGF5KClcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXJlYSB5MFxuICAgIGlmIEBvcHRpb25zLmlzQXJlYVxuICAgICAgQGFyZWEueTAgQGhlaWdodFxuICAgICMgdXBkYXRlIHkgYXhpcyB0aWNrcyB3aWR0aFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lJylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcbiAgICBpZiBAb3B0aW9ucy5pc0FyZWFcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXJlYScpXG4gICAgICAgIC5hdHRyICdkJywgQGFyZWFcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldExhYmVsRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnLm92ZXJsYXknKVxuICAgICAgICAuY2FsbCBAc2V0T3ZlcmxheURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMaW5lczogLT5cbiAgICBAZ3JhcGguc2VsZWN0QWxsKCcubGluZScpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xpbmUnXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiByZXR1cm4gZDMuZW50cmllcyhkLnZhbHVlcylcbiAgICAgIC5hdHRyICdkJywgQGxpbmVcblxuICBkcmF3QXJlYXM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmFyZWEnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXJlYSdcbiAgICAgIC5hdHRyICAnaWQnLCAgICAoZCkgPT4gJ2FyZWEtJyArIGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmRhdHVtIChkKSAtPiBkMy5lbnRyaWVzKGQudmFsdWVzKVxuICAgICAgLmF0dHIgJ2QnLCBAYXJlYVxuXG4gIGRyYXdMYWJlbHM6IC0+XG4gICAgQGdyYXBoLnNlbGVjdEFsbCgnLmxpbmUtbGFiZWwnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdsaW5lLWxhYmVsLScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnZW5kJ1xuICAgICAgLmF0dHIgJ2R5JywgJy0wLjEyNWVtJ1xuICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuY2FsbCBAc2V0TGFiZWxEaW1lbnNpb25zXG5cbiAgZHJhd0xpbmVMYWJlbEhvdmVyOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1wb2ludCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2xpbmUtbGFiZWwtcG9pbnQtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5hdHRyICdjbGFzcycsICdsaW5lLWxhYmVsLXBvaW50J1xuICAgICAgLmF0dHIgJ3InLCA0XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAndGljay1ob3ZlcidcbiAgICAgIC5hdHRyICdkeScsICcwLjcxZW0nXG4gICAgICAuYXR0ciAneScsIE1hdGgucm91bmQgQGhlaWdodCs5XG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBpZiBAZGF0YS5sZW5ndGggPT0gMVxuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbGluZS1sYWJlbC1ob3ZlcidcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJy0wLjVlbSdcbiAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG5cbiAgZHJhd1JlY3RPdmVybGF5OiAtPlxuICAgIEBjb250YWluZXIuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdvdmVybGF5J1xuICAgICAgLmNhbGwgQHNldE92ZXJsYXlEaW1lbnNpb25zXG4gICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlTW92ZVxuICAgICAgLm9uICdtb3VzZW91dCcsICBAb25Nb3VzZU91dFxuICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcblxuICBzZXRMYWJlbERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgQHdpZHRoXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkLnZhbHVlc1tAeWVhcnNbQHllYXJzLmxlbmd0aC0xXV0pXG5cbiAgc2V0T3ZlcmxheURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd3aWR0aCcsIEB3aWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBoZWlnaHRcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJGVsLnRyaWdnZXIgJ21vdXNlb3V0J1xuICAgIEBoaWRlTGFiZWwoKVxuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICB5ZWFyID0gTWF0aC5yb3VuZCBAeC5pbnZlcnQocG9zaXRpb25bMF0pXG4gICAgaWYgeWVhciAhPSBAY3VycmVudFllYXJcbiAgICAgIEAkZWwudHJpZ2dlciAnY2hhbmdlLXllYXInLCB5ZWFyXG4gICAgICBAc2V0TGFiZWwgeWVhclxuXG4gIHNldExhYmVsOiAoeWVhcikgLT5cbiAgICBAY3VycmVudFllYXIgPSB5ZWFyXG4gICAgQHhBeGlzLnRpY2tWYWx1ZXMgW3llYXJdXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy54LmF4aXMnKVxuICAgICAgLnNlbGVjdEFsbCgnLnRpY2snKVxuICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ25vbmUnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5lYWNoIChkKSA9PiBAc2V0TGluZUxhYmVsSG92ZXJQb3NpdGlvbiBkXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdibG9jaydcbiAgICAgIC5hdHRyICd4JywgTWF0aC5yb3VuZCBAeChAY3VycmVudFllYXIpXG4gICAgICAudGV4dCBAY3VycmVudFllYXJcblxuICBoaWRlTGFiZWw6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLXBvaW50JylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubGluZS1sYWJlbC1ob3ZlcicpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuc2VsZWN0QWxsKCcudGljaycpXG4gICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnYmxvY2snXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy50aWNrLWhvdmVyJylcbiAgICAgIC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuXG4gIHNldExpbmVMYWJlbEhvdmVyUG9zaXRpb246IChkYXRhKSA9PlxuICAgICMgZ2V0IGN1cnJlbnQgeWVhclxuICAgIHllYXIgPSBAY3VycmVudFllYXJcbiAgICB3aGlsZSBAeWVhcnMuaW5kZXhPZih5ZWFyKSA9PSAtMSAmJiBAY3VycmVudFllYXIgPiBAeWVhcnNbMF1cbiAgICAgIHllYXItLVxuICAgIEBjdXJyZW50WWVhciA9IHllYXJcbiAgICAjIGdldCBwb2ludCAmIGxhYmVsXG4gICAgcG9pbnQgPSBkMy5zZWxlY3QoJyNsaW5lLWxhYmVsLXBvaW50LScrZGF0YVtAb3B0aW9ucy5rZXkuaWRdKVxuICAgIGxhYmVsID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5saW5lLWxhYmVsLWhvdmVyJylcbiAgICAjIGhpZGUgcG9pbnQgJiBsYWJlbCBpcyB0aGVyZSBpcyBubyBkYXRhXG4gICAgdW5sZXNzIGRhdGEudmFsdWVzW3llYXJdXG4gICAgICBwb2ludC5zdHlsZSAnZGlzcGxheScsICdub25lJ1xuICAgICAgbGFiZWwuc3R5bGUgJ2Rpc3BsYXknLCAnbm9uZSdcbiAgICAgIHJldHVyblxuICAgICMgc2hvdyBwb2ludCAmIGxhYmVsIGlmIHRoZXJlJ3MgZGF0YVxuICAgIHBvaW50LnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgIGxhYmVsLnN0eWxlICdkaXNwbGF5JywgJ2Jsb2NrJ1xuICAgICAjIHNldCBsaW5lIGxhYmVsIHBvaW50XG4gICAgcG9pbnRcbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gaWYgZGF0YS52YWx1ZXNbeWVhcl0gdGhlbiBAeShkYXRhLnZhbHVlc1t5ZWFyXSkgZWxzZSAwXG4gICAgIyBzZXQgbGluZSBsYWJlbCBob3ZlclxuICAgIGxhYmVsXG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCB5ZWFyXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSA9PiBpZiBkYXRhLnZhbHVlc1t5ZWFyXSB0aGVuIEB5Rm9ybWF0KGRhdGEudmFsdWVzW3llYXJdKSBlbHNlICcnXG4gICAgICAiLCJjbGFzcyB3aW5kb3cuSGVhdG1hcEdyYXBoIGV4dGVuZHMgQmFzZUdyYXBoXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnSGVhdG1hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgQGxhbmcgPSAkKCdib2R5JykuZGF0YSAnbGFuZydcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnICAgICAgID0gbnVsbFxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QgJyMnK0BpZCsnIC5oZWF0bWFwLWNvbnRhaW5lcidcbiAgICBAJHRvb2x0aXAgID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICAjIEdldCB5ZWFycyAoeCBzY2FsZSlcbiAgICBAeWVhcnMgPSBAZ2V0WWVhcnMoZGF0YSlcbiAgICAjIEdldCBjb3VudHJpZXMgKHkgc2NhbGUpXG4gICAgQGNvdW50cmllcyA9IGRhdGEubWFwIChkKSAtPiBkLmNvZGVcbiAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuICAgIEBjZWxsc0RhdGEgPSBAZ2V0Q2VsbHNEYXRhIGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGdldERpbWVuc2lvbnMoKSAjIGZvcmNlIHVwZGF0ZSBkaW1lbnNpb25zXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRZZWFyczogKGRhdGEpIC0+XG4gICAgbWluWWVhciA9IGQzLm1pbiBkYXRhLCAoZCkgLT4gZDMubWluKGQzLmtleXMoZC52YWx1ZXMpKVxuICAgIG1heFllYXIgPSBkMy5tYXggZGF0YSwgKGQpIC0+IGQzLm1heChkMy5rZXlzKGQudmFsdWVzKSlcbiAgICB5ZWFycyA9IGQzLnJhbmdlIG1pblllYXIsIG1heFllYXIsIDFcbiAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4gICAgcmV0dXJuIHllYXJzXG5cbiAgZ2V0Q2VsbHNEYXRhOiAoZGF0YSkgLT5cbiAgICBjZWxsc0RhdGEgPSBbXVxuICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuICAgICAgICBjZWxsc0RhdGEucHVzaFxuICAgICAgICAgIGNvdW50cnk6IGQuY29kZVxuICAgICAgICAgIG5hbWU6ICAgIGQubmFtZVxuICAgICAgICAgIHllYXI6ICAgIHZhbHVlXG4gICAgICAgICAgY2FzZXM6ICAgZC5jYXNlc1t2YWx1ZV1cbiAgICAgICAgICB2YWx1ZTogICBkLnZhbHVlc1t2YWx1ZV1cbiAgICByZXR1cm4gY2VsbHNEYXRhXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGQudmFsdWVzID0ge31cbiAgICAgIEB5ZWFycy5mb3JFYWNoICh5ZWFyKSA9PlxuICAgICAgICBpZiBkW3llYXJdXG4gICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSArZFt5ZWFyXVxuICAgICAgICAjZWxzZVxuICAgICAgICAjICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBhcmEnLCBkLm5hbWUsICdlbiAnLCB5ZWFyXG4gICAgICAgIGRlbGV0ZSBkW3llYXJdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5wYWRkaW5nKDApXG4gICAgICAucGFkZGluZ0lubmVyKDApXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgICAucm91bmQodHJ1ZSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucGFkZGluZygwKVxuICAgICAgLnBhZGRpbmdJbm5lcigwKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yUmRcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb2xvci5kb21haW4gWzAsIDRdICAjIFRPRE8hISEgLT4gTWFrZSB0aGlzIGR5bmFtaWNcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWFJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gIGdldFNjYWxlWVJhbmdlOiA9PlxuICAgIHJldHVybiBbMCwgQGhlaWdodF1cblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEB5ZWFycyBcblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIEBjb3VudHJpZXMgXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBAd2lkdGggPSBAJGVsLndpZHRoKCkgLSAxMDAgICMgeSBheGlzIHdpZHRoID0gMTAwXG4gICAgaWYgQHllYXJzIGFuZCBAY291bnRyaWVzXG4gICAgICBjZWxsU2l6ZSA9IE1hdGguZmxvb3IgQHdpZHRoIC8gQHllYXJzLmxlbmd0aFxuICAgICAgQGhlaWdodCA9IGlmIGNlbGxTaXplIDwgMjAgdGhlbiBjZWxsU2l6ZSAqIEBjb3VudHJpZXMubGVuZ3RoIGVsc2UgMjAgKiBAY291bnRyaWVzLmxlbmd0aFxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgc2V0dXAgc2NhbGVzIHJhbmdlXG4gICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0dXAgY29udGFpbmVyIGhlaWdodFxuICAgIEBjb250YWluZXIuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuICAgICMgZHJhdyBjZWxsc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdjZWxsLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgLnNlbGVjdEFsbCgnLmNlbGwnKVxuICAgICAgLmRhdGEoQGNlbGxzRGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAgJ2NsYXNzJywgJ2NlbGwnXG4gICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgPT4gQGNvbG9yKGQudmFsdWUpXG4gICAgICAub24gICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgLm9uICAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgICAuY2FsbCAgQHNldENlbGxEaW1lbnNpb25zXG4gICAgIyBkcmF3IHllYXJzIHggYXhpc1xuICAgIEBjb250YWluZXIuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ3gtYXhpcyBheGlzJ1xuICAgIC5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLmRhdGEoQHllYXJzLmZpbHRlcigoZCkgLT4gZCAlIDUgPT0gMCkpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgICdjbGFzcycsICdheGlzLWl0ZW0nXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgPT4gQHgoZCkrJ3B4J1xuICAgICAgLmh0bWwgIChkKSAtPiBkXG4gICAgIyBkcmF3IGNvdW50cmllcyB5IGF4aXNcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd5LWF4aXMgYXhpcycpXG4gICAgLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpXG4gICAgICAuZGF0YShAY291bnRyaWVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICAnY2xhc3MnLCAnYXhpcy1pdGVtJ1xuICAgICAgLnN0eWxlICd0b3AnLCAoZCkgPT4gQHkoZCkrJ3B4J1xuICAgICAgLmh0bWwgKGQpID0+IEBnZXRDb3VudHJ5TmFtZSBkXG4gICAgIyBkcmF3IHllYXIgaW50cm9kdWN0aW9uIG1hcmtcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJylcbiAgICAgIC5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEgQGRhdGEubWFwKChkKSAtPiB7Y29kZTogZC5jb2RlLCB5ZWFyOiBkLnllYXJfaW50cm9kdWN0aW9ufSkuZmlsdGVyKChkKSAtPiAhaXNOYU4gZC55ZWFyKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0TWFya2VyRGltZW5zaW9uc1xuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzY2FsZXNcbiAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgY29udGFpbmVyc1xuICAgIEBjb250YWluZXJcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCArICdweCdcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGwtY29udGFpbmVyJylcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jZWxsJylcbiAgICAgIC5jYWxsIEBzZXRDZWxsRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcueC1heGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJylcbiAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSA9PiBAeChkKSsncHgnXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy55LWF4aXMnKS5zZWxlY3RBbGwoJy5heGlzLWl0ZW0nKVxuICAgICAgLnN0eWxlICd0b3AnLCAoZCkgPT4gQHkoZCkrJ3B4J1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldE1hcmtlckRpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldENlbGxEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgPT4gQHgoZC55ZWFyKSsncHgnXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSA9PiBAeShkLmNvdW50cnkpKydweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKCkrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAeS5iYW5kd2lkdGgoKSsncHgnXG5cbiAgc2V0TWFya2VyRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpID0+IEB5KGQuY29kZSkrJ3B4J1xuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgPT4gaWYgZC55ZWFyIDwgQHllYXJzWzBdIHRoZW4gQHgoQHllYXJzWzBdKS0xICsgJ3B4JyBlbHNlIGlmIGQueWVhciA8IEB5ZWFyc1tAeWVhcnMubGVuZ3RoLTFdIHRoZW4gQHgoZC55ZWFyKS0xKydweCcgZWxzZSBAeC5iYW5kd2lkdGgoKStAeChAeWVhcnNbQHllYXJzLmxlbmd0aC0xXSkrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAeS5iYW5kd2lkdGgoKSsncHgnXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIG9mZnNldCAgICAgICAgICAgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICBjYXNlc19zdHIgICAgICAgID0gaWYgQGxhbmcgPT0gJ2VzJyB0aGVuICdjYXNvcycgZWxzZSAnY2FzZXMnXG4gICAgY2FzZXNfc2luZ2xlX3N0ciA9IGlmIEBsYW5nID09ICdlcycgdGhlbiAnY2FzbycgZWxzZSAnY2FzZSdcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY291bnRyeSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC55ZWFyJ1xuICAgICAgLmh0bWwgZC55ZWFyXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdERlY2ltYWwoZC52YWx1ZSwgQGxhbmcpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgLmh0bWwgaWYgZC5jYXNlcyAhPSAxIHRoZW4gZC5jYXNlcy50b0xvY2FsZVN0cmluZyhAbGFuZykgKyAnICcgKyBjYXNlc19zdHIgZWxzZSBkLmNhc2VzLnRvTG9jYWxlU3RyaW5nKEBsYW5nKSArICcgJyArIGNhc2VzX3NpbmdsZV9zdHJcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBvZmZzZXQubGVmdCArIEB4LmJhbmR3aWR0aCgpICogMC41IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBvZmZzZXQudG9wIC0gKEB5LmJhbmR3aWR0aCgpICogMC41KSAtIEAkdG9vbHRpcC5oZWlnaHQoKVxuICAgICAgJ29wYWNpdHknOiAnMSdcbiAgICByZXR1cm5cblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG4gICAgcmV0dXJuXG5cbiAgZ2V0Q291bnRyeU5hbWU6IChjb2RlKSA9PlxuICAgIGNvdW50cnkgPSBAZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb2RlXG4gICAgcmV0dXJuIGlmIGNvdW50cnlbMF0gdGhlbiBjb3VudHJ5WzBdLm5hbWUgZWxzZSAnJ1xuXG4gIGZvcm1hdERlY2ltYWw6IChudW1iZXIsIGxhbmcpIC0+XG4gICAgcmV0dXJuIGlmIG51bWJlciA8IDAuMDAxIHRoZW4gMCBlbHNlIGlmIG51bWJlciA+PSAwLjEgdGhlbiBudW1iZXIudG9GaXhlZCgxKS50b0xvY2FsZVN0cmluZyhsYW5nKSBlbHNlIGlmIG51bWJlciA+PSAwLjAxIHRoZW4gbnVtYmVyLnRvRml4ZWQoMikudG9Mb2NhbGVTdHJpbmcobGFuZykgZWxzZSBudW1iZXIudG9GaXhlZCgzKS50b0xvY2FsZVN0cmluZyhsYW5nKVxuXG5cblxuIyBWYWNjaW5lRGlzZWFzZUdyYXBoID0gKF9pZCkgLT5cbiMgICAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKVxuIyAgIFlfQVhJU19XSURUSCA9IDEwMFxuIyAgICMgTXVzdCBiZSB0aGUgYW1lIHZhbHVlIHRoYW4gI3ZhY2NpbmUtZGlzZWFzZS1ncmFwaCAkcGFkZGluZy1sZWZ0IHNjc3MgdmFyaWFibGVcbiMgICB0aGF0ID0gdGhpc1xuIyAgIGlkID0gX2lkXG4jICAgZGlzZWFzZSA9IHVuZGVmaW5lZFxuIyAgIHNvcnQgPSB1bmRlZmluZWRcbiMgICBsYW5nID0gdW5kZWZpbmVkXG4jICAgZGF0YSA9IHVuZGVmaW5lZFxuIyAgIGRhdGFQb3B1bGF0aW9uID0gdW5kZWZpbmVkXG4jICAgY3VycmVudERhdGEgPSB1bmRlZmluZWRcbiMgICBjZWxsRGF0YSA9IHVuZGVmaW5lZFxuIyAgIGNvdW50cmllcyA9IHVuZGVmaW5lZFxuIyAgIHllYXJzID0gdW5kZWZpbmVkXG4jICAgY2VsbFNpemUgPSB1bmRlZmluZWRcbiMgICBjb250YWluZXIgPSB1bmRlZmluZWRcbiMgICB4ID0gdW5kZWZpbmVkXG4jICAgeSA9IHVuZGVmaW5lZFxuIyAgIHdpZHRoID0gdW5kZWZpbmVkXG4jICAgaGVpZ2h0ID0gdW5kZWZpbmVkXG4jICAgJGVsID0gdW5kZWZpbmVkXG4jICAgJHRvb2x0aXAgPSB1bmRlZmluZWRcbiMgICAjIFB1YmxpYyBNZXRob2RzXG5cbiMgICB0aGF0LmluaXQgPSAoX2Rpc2Vhc2UsIF9zb3J0KSAtPlxuIyAgICAgZGlzZWFzZSA9IF9kaXNlYXNlXG4jICAgICBzb3J0ID0gX3NvcnRcbiMgICAgICNjb25zb2xlLmxvZygnVmFjY2luZSBHcmFwaCBpbml0JywgaWQsIGRpc2Vhc2UsIHNvcnQpO1xuIyAgICAgJGVsID0gJCgnIycgKyBpZClcbiMgICAgICR0b29sdGlwID0gJGVsLmZpbmQoJy50b29sdGlwJylcbiMgICAgIGxhbmcgPSAkZWwuZGF0YSgnbGFuZycpXG4jICAgICB4ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICB5ID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwKS5wYWRkaW5nSW5uZXIoMCkucGFkZGluZ091dGVyKDApLnJvdW5kKHRydWUpXG4jICAgICBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbChkMy5pbnRlcnBvbGF0ZU9yUmQpXG4jICAgICBpZiBkYXRhXG4jICAgICAgIGNsZWFyKClcbiMgICAgICAgc2V0dXBEYXRhKClcbiMgICAgICAgc2V0dXBHcmFwaCgpXG4jICAgICBlbHNlXG4jICAgICAgICMgTG9hZCBDU1ZzXG4jICAgICAgIGQzLnF1ZXVlKCkuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpICsgJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy5jc3YnKS5kZWZlcihkMy5jc3YsICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykgKyAnL2Fzc2V0cy9kYXRhL3BvcHVsYXRpb24uY3N2JykuYXdhaXQgb25EYXRhUmVhZHlcbiMgICAgIHRoYXRcblxuIyAgIHRoYXQub25SZXNpemUgPSAtPlxuIyAgICAgZ2V0RGltZW5zaW9ucygpXG4jICAgICBpZiBkYXRhXG4jICAgICAgIHVwZGF0ZUdyYXBoKClcbiMgICAgIHRoYXRcblxuIyAgIG9uRGF0YVJlYWR5ID0gKGVycm9yLCBkYXRhX2NzdiwgcG9wdWxhdGlvbl9jc3YpIC0+XG4jICAgICBkYXRhID0gZGF0YV9jc3ZcbiMgICAgIGRhdGFQb3B1bGF0aW9uID0gcG9wdWxhdGlvbl9jc3ZcbiMgICAgICMgd2UgZG9uJ3QgbmVlZCB0aGUgY29sdW1ucyBhdHRyaWJ1dGVcbiMgICAgIGRlbGV0ZSBkYXRhLmNvbHVtbnNcbiMgICAgICMgV2UgY2FuIGRlZmluZSBhIGZpbHRlciBmdW5jdGlvbiB0byBzaG93IG9ubHkgc29tZSBzZWxlY3RlZCBjb3VudHJpZXNcbiMgICAgIGlmIHRoYXQuZmlsdGVyXG4jICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcih0aGF0LmZpbHRlcilcbiMgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiMgICAgICAgZC5kaXNlYXNlID0gZC5kaXNlYXNlLnRvTG93ZXJDYXNlKClcbiMgICAgICAgaWYgZC55ZWFyX2ludHJvZHVjdGlvblxuIyAgICAgICAgIGQueWVhcl9pbnRyb2R1Y3Rpb24gPSArZC55ZWFyX2ludHJvZHVjdGlvbi5yZXBsYWNlKCdwcmlvciB0bycsICcnKVxuIyAgICAgICBkLmNhc2VzID0ge31cbiMgICAgICAgZC52YWx1ZXMgPSB7fVxuIyAgICAgICAjIHNldCB2YWx1ZSBlcyBjYXNlcyAvMTAwMCBoYWJpdGFudHNcbiMgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBwb3B1bGF0aW9uX2Nzdi5maWx0ZXIoKGNvdW50cnkpIC0+XG4jICAgICAgICAgY291bnRyeS5jb2RlID09IGQuY29kZVxuIyAgICAgICApXG4jICAgICAgIGlmIHBvcHVsYXRpb25JdGVtLmxlbmd0aCA+IDBcbiMgICAgICAgICB5ZWFyID0gMTk4MFxuIyAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4jICAgICAgICAgICBpZiBkW3llYXJdXG4jICAgICAgICAgICAgIHBvcHVsYXRpb24gPSArcG9wdWxhdGlvbkl0ZW1bMF1beWVhcl1cbiMgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4jICAgICAgICAgICAgICAgI2RbeWVhcl0gPSAxMDAwICogKCtkW3llYXJdIC8gcG9wdWxhdGlvbik7XG4jICAgICAgICAgICAgICAgZC5jYXNlc1t5ZWFyXSA9ICtkW3llYXJdXG4jICAgICAgICAgICAgICAgZC52YWx1ZXNbeWVhcl0gPSAxMDAwICogK2RbeWVhcl0gLyBwb3B1bGF0aW9uXG4jICAgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgICAjZFt5ZWFyXSA9IG51bGw7XG4jICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgcG9ibGFjacOzbiBwYXJhJywgZC5uYW1lLCAnZW4gJywgeWVhciwgZFt5ZWFyXSk7XG4jICAgICAgICAgICBlbHNlXG4jICAgICAgICAgICAgICNkW3llYXJdID0gbnVsbDtcbiMgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuIyAgICAgICAgICAgZGVsZXRlIGRbeWVhcl1cbiMgICAgICAgICAgIHllYXIrK1xuIyAgICAgICBlbHNlXG4jICAgICAgICAgY29uc29sZS5sb2cgJ05vIGhheSBkYXRvcyBkZSBwb2JsYWNpw7NuIHBhcmEnLCBkLm5hbWVcbiMgICAgICAgIyBHZXQgdG90YWwgY2FzZXMgYnkgY291bnRyeSAmIGRpc2Vhc2VcbiMgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT5cbiMgICAgICAgICBhICsgYlxuIyAgICAgICApLCAwKVxuIyAgICAgICByZXR1cm5cbiMgICAgIHNldHVwRGF0YSgpXG4jICAgICBzZXR1cEdyYXBoKClcbiMgICAgIHJldHVyblxuXG4jICAgc2V0dXBEYXRhID0gLT5cbiMgICAgICMgRmlsdGVyIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuIyAgICAgY3VycmVudERhdGEgPSBkYXRhLmZpbHRlcigoZCkgLT5cbiMgICAgICAgZC5kaXNlYXNlID09IGRpc2Vhc2UgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuIyAgICAgKVxuIyAgICAgIyBTb3J0IGRhdGFcbiMgICAgIGlmIHNvcnQgPT0gJ3llYXInXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgaWYgaXNOYU4oYS55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAxIGVsc2UgaWYgaXNOYU4oYi55ZWFyX2ludHJvZHVjdGlvbikgdGhlbiAtMSBlbHNlIGIueWVhcl9pbnRyb2R1Y3Rpb24gLSAoYS55ZWFyX2ludHJvZHVjdGlvbilcbiMgICAgIGVsc2UgaWYgc29ydCA9PSAnY2FzZXMnXG4jICAgICAgIGN1cnJlbnREYXRhLnNvcnQgKGEsIGIpIC0+XG4jICAgICAgICAgYi50b3RhbCAtIChhLnRvdGFsKVxuIyAgICAgIyBHZXQgYXJyYXkgb2YgY291bnRyeSBuYW1lc1xuIyAgICAgY291bnRyaWVzID0gY3VycmVudERhdGEubWFwKChkKSAtPlxuIyAgICAgICBkLmNvZGVcbiMgICAgIClcbiMgICAgICMgR2V0IGFycmF5IG9mIHllYXJzXG4jICAgICBtaW5ZZWFyID0gZDMubWluKGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWluIGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICBtYXhZZWFyID0gZDMubWF4KGN1cnJlbnREYXRhLCAoZCkgLT5cbiMgICAgICAgZDMubWF4IGQzLmtleXMoZC52YWx1ZXMpXG4jICAgICApXG4jICAgICB5ZWFycyA9IGQzLnJhbmdlKG1pblllYXIsIG1heFllYXIsIDEpXG4jICAgICB5ZWFycy5wdXNoICttYXhZZWFyXG4jICAgICAjY29uc29sZS5sb2cobWluWWVhciwgbWF4WWVhciwgeWVhcnMpO1xuIyAgICAgI2NvbnNvbGUubG9nKGNvdW50cmllcyk7XG4jICAgICAjIEdldCBhcnJheSBvZiBkYXRhIHZhbHVlc1xuIyAgICAgY2VsbHNEYXRhID0gW11cbiMgICAgIGN1cnJlbnREYXRhLmZvckVhY2ggKGQpIC0+XG4jICAgICAgIGZvciB2YWx1ZSBvZiBkLnZhbHVlc1xuIyAgICAgICAgIGNlbGxzRGF0YS5wdXNoXG4jICAgICAgICAgICBjb3VudHJ5OiBkLmNvZGVcbiMgICAgICAgICAgIG5hbWU6IGQubmFtZVxuIyAgICAgICAgICAgeWVhcjogdmFsdWVcbiMgICAgICAgICAgIGNhc2VzOiBkLmNhc2VzW3ZhbHVlXVxuIyAgICAgICAgICAgdmFsdWU6IGQudmFsdWVzW3ZhbHVlXVxuIyAgICAgICByZXR1cm5cblxuIyAgICAgIyMjXG4jICAgICBjdXJyZW50RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuIyAgICAgICB2YXIgY291bnRlciA9IDA7XG4jICAgICAgIHllYXJzLmZvckVhY2goZnVuY3Rpb24oeWVhcil7XG4jICAgICAgICAgaWYgKGRbeWVhcl0pXG4jICAgICAgICAgICBjb3VudGVyKys7XG4jICAgICAgIH0pO1xuIyAgICAgICBpZihjb3VudGVyIDw9IDIwKSAvLyB5ZWFycy5sZW5ndGgvMilcbiMgICAgICAgICBjb25zb2xlLmxvZyhkLm5hbWUgKyAnIGhhcyBvbmx5IHZhbHVlcyBmb3IgJyArIGNvdW50ZXIgKyAnIHllYXJzJyk7XG4jICAgICB9KTtcbiMgICAgICMjI1xuXG4jICAgICByZXR1cm5cblxuIyAgIHNldHVwR3JhcGggPSAtPlxuIyAgICAgIyBHZXQgZGltZW5zaW9ucyAoaGVpZ2h0IGlzIGJhc2VkIG9uIGNvdW50cmllcyBsZW5ndGgpXG4jICAgICBnZXREaW1lbnNpb25zKClcbiMgICAgIHguZG9tYWluKHllYXJzKS5yYW5nZSBbXG4jICAgICAgIDBcbiMgICAgICAgd2lkdGhcbiMgICAgIF1cbiMgICAgIHkuZG9tYWluKGNvdW50cmllcykucmFuZ2UgW1xuIyAgICAgICAwXG4jICAgICAgIGhlaWdodFxuIyAgICAgXVxuIyAgICAgI2NvbG9yLmRvbWFpbihbZDMubWF4KGNlbGxzRGF0YSwgZnVuY3Rpb24oZCl7IHJldHVybiBkLnZhbHVlOyB9KSwgMF0pO1xuIyAgICAgY29sb3IuZG9tYWluIFtcbiMgICAgICAgMFxuIyAgICAgICA0XG4jICAgICBdXG4jICAgICAjY29uc29sZS5sb2coJ01heGltdW0gY2FzZXMgdmFsdWU6ICcrIGQzLm1heChjZWxsc0RhdGEsIGZ1bmN0aW9uKGQpeyByZXR1cm4gZC52YWx1ZTsgfSkpO1xuIyAgICAgIyBBZGQgc3ZnXG4jICAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnICsgaWQgKyAnIC5ncmFwaC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4JylcbiMgICAgICMgRHJhdyBjZWxsc1xuIyAgICAgY29udGFpbmVyLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbC1jb250YWluZXInKS5zdHlsZSgnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4Jykuc2VsZWN0QWxsKCcuY2VsbCcpLmRhdGEoY2VsbHNEYXRhKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnY2VsbCcpLnN0eWxlKCdiYWNrZ3JvdW5kJywgKGQpIC0+XG4jICAgICAgIGNvbG9yIGQudmFsdWVcbiMgICAgICkuY2FsbChzZXRDZWxsRGltZW5zaW9ucykub24oJ21vdXNlb3ZlcicsIG9uTW91c2VPdmVyKS5vbiAnbW91c2VvdXQnLCBvbk1vdXNlT3V0XG4jICAgICAjIERyYXcgeWVhcnMgeCBheGlzXG4jICAgICBjb250YWluZXIuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICd4LWF4aXMgYXhpcycpLnNlbGVjdEFsbCgnLmF4aXMtaXRlbScpLmRhdGEoeWVhcnMuZmlsdGVyKChkKSAtPlxuIyAgICAgICBkICUgNSA9PSAwXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnYXhpcy1pdGVtJykuc3R5bGUoJ2xlZnQnLCAoZCkgLT5cbiMgICAgICAgeChkKSArICdweCdcbiMgICAgICkuaHRtbCAoZCkgLT5cbiMgICAgICAgZFxuIyAgICAgIyBEcmF3IGNvdW50cmllcyB5IGF4aXNcbiMgICAgIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3ktYXhpcyBheGlzJykuc2VsZWN0QWxsKCcuYXhpcy1pdGVtJykuZGF0YShjb3VudHJpZXMpLmVudGVyKCkuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdheGlzLWl0ZW0nKS5zdHlsZSgndG9wJywgKGQpIC0+XG4jICAgICAgIHkoZCkgKyAncHgnXG4jICAgICApLmh0bWwgKGQpIC0+XG4jICAgICAgIGdldENvdW50cnlOYW1lIGRcbiMgICAgICMgRHJhdyB5ZWFyIGludHJvZHVjdGlvbiBtYXJrXG4jICAgICBjb250YWluZXIuc2VsZWN0KCcuY2VsbC1jb250YWluZXInKS5zZWxlY3RBbGwoJy5tYXJrZXInKS5kYXRhKGN1cnJlbnREYXRhLm1hcCgoZCkgLT5cbiMgICAgICAge1xuIyAgICAgICAgIGNvZGU6IGQuY29kZVxuIyAgICAgICAgIHllYXI6IGQueWVhcl9pbnRyb2R1Y3Rpb25cbiMgICAgICAgfVxuIyAgICAgKS5maWx0ZXIoKGQpIC0+XG4jICAgICAgICFpc05hTihkLnllYXIpXG4jICAgICApKS5lbnRlcigpLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnbWFya2VyJykuY2FsbCBzZXRNYXJrZXJEaW1lbnNpb25zXG4jICAgICByZXR1cm5cblxuIyAgIGNsZWFyID0gLT5cbiMgICAgIGNvbnRhaW5lci5zZWxlY3QoJy5jZWxsLWNvbnRhaW5lcicpLnJlbW92ZSgpXG4jICAgICBjb250YWluZXIuc2VsZWN0QWxsKCcuYXhpcycpLnJlbW92ZSgpXG4jICAgICByZXR1cm5cblxuXG5cbiIsIiMgTWFpbiBzY3JpcHQgZm9yIHZhY2NpbmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cblxuICAjIEluaXQgVG9vbHRpcHNcbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKVxuXG5cbiAgIyBnZXQgY291bnRyeSBuYW1lIGF1eGlsaWFyIG1ldGhvZFxuICBnZXRDb3VudHJ5TmFtZSA9IChjb3VudHJpZXMsIGNvZGUsIGxhbmcpIC0+XG4gICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb2RlXG4gICAgaWYgaXRlbVxuICAgICAgaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgZWxzZVxuICAgICAgY29uc29sZS5lcnJvciAnTm8gY291bnRyeSBuYW1lIGZvciBjb2RlJywgY29kZVxuXG5cbiAgIyBWaWRlbyBvZiBtYXAgcG9saW8gY2FzZXNcbiAgc2V0VmlkZW9NYXBQb2xpbyA9IC0+XG4gICAgd3JhcHBlciA9IFBvcGNvcm4uSFRNTFlvdVR1YmVWaWRlb0VsZW1lbnQoJyN2aWRlby1tYXAtcG9saW8nKVxuICAgIHdyYXBwZXIuc3JjID0gJ2h0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvbDFGMlhkNUZGbFE/Y29udHJvbHM9MCZzaG93aW5mbz0wJmhkPTEnXG4gICAgcG9wY29ybiA9IFBvcGNvcm4od3JhcHBlcilcbiAgICBub3RlcyA9IDIwMTYgLSAxOTgwXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDw9IG5vdGVzXG4gICAgICBwb3Bjb3JuLmZvb3Rub3RlXG4gICAgICAgIHN0YXJ0OiAgMS42MjIyICogaVxuICAgICAgICBlbmQ6ICAgIDEuNjIyMiAqIChpICsgMSlcbiAgICAgICAgdGV4dDogICAxOTgwICsgaVxuICAgICAgICB0YXJnZXQ6ICd2aWRlby1tYXAtcG9saW8tZGVzY3JpcHRpb24nXG4gICAgICBpKytcbiAgICAjIFNob3cgY292ZXIgd2hlbiB2aWRlbyBlbmRlZFxuICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciAnZW5kZWQnLCAoZSkgLT5cbiAgICAgICQoJy52aWRlby1tYXAtcG9saW8tY292ZXInKS5mYWRlSW4oKVxuICAgICAgJCgnI3ZpZGVvLW1hcC1wb2xpby1kZXNjcmlwdGlvbicpLmZhZGVUbyAzMDAsIDBcbiAgICAgIHBvcGNvcm4uY3VycmVudFRpbWUgMFxuICAgICMgU2hvdyB2aWRlbyB3aGVuIHBsYXkgYnRuIGNsaWNrZWRcbiAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLXBsYXktYnRuJykuY2xpY2sgKGUpIC0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHBvcGNvcm4ucGxheSgpXG4gICAgICAkKCcudmlkZW8tbWFwLXBvbGlvLWNvdmVyJykuZmFkZU91dCgpXG4gICAgICAkKCcjdmlkZW8tbWFwLXBvbGlvLWRlc2NyaXB0aW9uJykuZmFkZVRvIDMwMCwgMVxuXG5cbiAgIyBNZWFzbGVzIGNhc2VzIEhlYXRtYXAgR3JhcGhcbiAgc2V0dXBIZWF0TWFwR3JhcGggPSAoaWQsIGRhdGEsIGNvdW50cmllcywgZGlzZWFzZSkgLT5cbiAgICBkYXRhID0gZGF0YVxuICAgICAgLmZpbHRlciAoZCkgLT4gY291bnRyaWVzLmluZGV4T2YoZC5jb2RlKSAhPSAtMSBhbmQgZC5kaXNlYXNlID09IGRpc2Vhc2UgYW5kIGQzLnZhbHVlcyhkLnZhbHVlcykubGVuZ3RoID4gMFxuICAgICAgLnNvcnQgKGEsYikgLT4gYS50b3RhbCAtIGIudG90YWxcbiAgICBncmFwaCA9IG5ldyB3aW5kb3cuSGVhdG1hcEdyYXBoKGlkLFxuICAgICAgbWFyZ2luOiBcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgbGVmdDogMClcbiAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAjIFNvcnQgZGF0YVxuIyAgICAgaWYgc29ydCA9PSAneWVhcidcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBpZiBpc05hTihhLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIDEgZWxzZSBpZiBpc05hTihiLnllYXJfaW50cm9kdWN0aW9uKSB0aGVuIC0xIGVsc2UgYi55ZWFyX2ludHJvZHVjdGlvbiAtIChhLnllYXJfaW50cm9kdWN0aW9uKVxuIyAgICAgZWxzZSBpZiBzb3J0ID09ICdjYXNlcydcbiMgICAgICAgY3VycmVudERhdGEuc29ydCAoYSwgYikgLT5cbiMgICAgICAgICBiLnRvdGFsIC0gKGEudG90YWwpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG5cbiAgc2V0dXBWYWNjaW5lRGlzZWFzZUhlYXRtYXBHcmFwaCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL2Rpc2Vhc2VzLWNhc2VzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9wb3B1bGF0aW9uLmNzdidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfY2FzZXMsIGRhdGFfcG9wdWxhdGlvbikgLT5cbiAgICAgICAgZGVsZXRlIGRhdGFfY2FzZXMuY29sdW1ucyAgIyB3ZSBkb24ndCBuZWVkIHRoZSBjb2x1bW5zIGF0dHJpYnV0ZVxuICAgICAgICBkYXRhX2Nhc2VzLmZvckVhY2ggKGQpIC0+XG4gICAgICAgICAgZC5kaXNlYXNlID0gZC5kaXNlYXNlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICBpZiBkLnllYXJfaW50cm9kdWN0aW9uXG4gICAgICAgICAgICBkLnllYXJfaW50cm9kdWN0aW9uID0gK2QueWVhcl9pbnRyb2R1Y3Rpb24ucmVwbGFjZSgncHJpb3IgdG8nLCAnJylcbiAgICAgICAgICBkLmNhc2VzID0ge31cbiAgICAgICAgICBkLnZhbHVlcyA9IHt9XG4gICAgICAgICAgIyBzZXQgdmFsdWVzIGFzIGNhc2VzLzEwMDAgaGFiaXRhbnRzXG4gICAgICAgICAgcG9wdWxhdGlvbkl0ZW0gPSBkYXRhX3BvcHVsYXRpb24uZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAgICAgaWYgcG9wdWxhdGlvbkl0ZW0ubGVuZ3RoID4gMFxuICAgICAgICAgICAgeWVhciA9IDE5ODBcbiAgICAgICAgICAgIHdoaWxlIHllYXIgPCAyMDE2XG4gICAgICAgICAgICAgIGlmIGRbeWVhcl1cbiAgICAgICAgICAgICAgICBwb3B1bGF0aW9uID0gK3BvcHVsYXRpb25JdGVtWzBdW3llYXJdXG4gICAgICAgICAgICAgICAgaWYgcG9wdWxhdGlvbiAhPSAwXG4gICAgICAgICAgICAgICAgICBkLmNhc2VzW3llYXJdID0gK2RbeWVhcl1cbiAgICAgICAgICAgICAgICAgIGQudmFsdWVzW3llYXJdID0gMTAwMCAqICtkW3llYXJdIC8gcG9wdWxhdGlvblxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICNjb25zb2xlLmxvZygnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgI2NvbnNvbGUubG9nKCdObyBoYXkgZGF0b3MgZGUgY2Fzb3MgZGUgJyArIGQuZGlzZWFzZSArICcgcGFyYScsIGQubmFtZSwgJ2VuICcsIHllYXIsICc6JywgZFt5ZWFyXSwgdHlwZW9mIGRbeWVhcl0pO1xuICAgICAgICAgICAgICBkZWxldGUgZFt5ZWFyXVxuICAgICAgICAgICAgICB5ZWFyKytcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnTm8gaGF5IGRhdG9zIGRlIHBvYmxhY2nDs24gcGFyYScsIGQubmFtZVxuICAgICAgICAgICMgR2V0IHRvdGFsIGNhc2VzIGJ5IGNvdW50cnkgJiBkaXNlYXNlXG4gICAgICAgICAgZC50b3RhbCA9IGQzLnZhbHVlcyhkLnZhbHVlcykucmVkdWNlKCgoYSwgYikgLT4gYSArIGIpLCAwKVxuICAgICAgICAjIEZpbHRlciBieSBzZWxlY3RlZCBjb3VudHJpZXMgJiBkaXNlYXNlXG4gICAgICAgIHNldHVwSGVhdE1hcEdyYXBoICd2YWNjaW5lcy1tZWFzbGVzLWdyYXBoLTEnLCBkYXRhX2Nhc2VzLCBbJ0ZJTicsJ0hVTicsJ1BSVCcsJ1VSWScsJ01FWCcsJ0NPTCddLCAnbWVhc2xlcydcbiAgICAgICAgc2V0dXBIZWF0TWFwR3JhcGggJ3ZhY2NpbmVzLW1lYXNsZXMtZ3JhcGgtMicsIGRhdGFfY2FzZXMsIFsnSVJRJywnQkdSJywnTU5HJywnWkFGJywnRlJBJywnR0VPJ10sICdtZWFzbGVzJ1xuXG5cbiAgIyBJbW11bml6YXRpb24gQ292ZXJhZ2UgRHluYW1pYyBMaW5lIEdyYXBoICh3ZSBjYW4gc2VsZWN0IGRpZmVyZW50ZSBkaXNlYXNlcyAmIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGggPSAtPlxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnLFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwgMjUsIDUwLCA3NSwgMTAwXVxuICAgIGQzLmNzdiBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGdyYXBoLnNldERhdGEgZGF0YS5maWx0ZXIoKGQpIC0+IGQudmFjY2luZSA9PSAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLXZhY2NpbmUtc2VsZWN0b3InKS52YWwoKSlcbiAgICAgICMgVXBkYXRlIGRhdGEgYmFzZWQgb24gc2VsZWN0ZWQgdmFjY2luZVxuICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykuY2hhbmdlIChlKSAtPlxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBkLnZhY2NpbmUgPT0gJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS12YWNjaW5lLXNlbGVjdG9yJykudmFsKCkpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yJykudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICMgVXBkYXRlIGFjdGl2ZSBjb3VudHJpZXNcbiAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtY291bnRyeS0xLXNlbGVjdG9yLCAjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMi1zZWxlY3RvcicpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5maW5kKCcubGluZS1sYWJlbCwgLmxpbmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTEtc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgtYWxsICNsaW5lLWxhYmVsLScrJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1jb3VudHJ5LTItc2VsZWN0b3InKS52YWwoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkKCcjaW1tdW5pemF0aW9uLWNvdmVyYWdlLWNvdW50cnktMS1zZWxlY3RvcicpLnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgSW1tdW5pemF0aW9uIENvdmVyYWdlIExpbmUgR3JhcGggKHdpZHRoIHNlbGVjdGVkIGNvdW50cmllcylcbiAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgY291bnRyaWVzID0gWydGUkEnLCdETksnLCdEWkEnLCdMS0EnXVxuICAgIGdyYXBoID0gbmV3IHdpbmRvdy5MaW5lR3JhcGgoJ2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaCcsIFxuICAgICAga2V5OiBcbiAgICAgICAgaWQ6ICdjb2RlJ1xuICAgICAgICB4OiAnbmFtZSdcbiAgICAgIGxhYmVsOiB0cnVlXG4gICAgICBtYXJnaW46IHRvcDogMjApXG4gICAgZ3JhcGguZ2V0U2NhbGVZRG9tYWluID0gKGQpIC0+IFswLCAxMDBdXG4gICAgZ3JhcGgueUF4aXMudGlja1ZhbHVlcyBbMCwyNSw1MCw3NSwxMDBdXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMSwyMDAzLDIwMDUsMjAwNywyMDA5LDIwMTEsMjAxMywyMDE1XVxuICAgIGdyYXBoLmFkZE1hcmtlclxuICAgICAgdmFsdWU6IDk1XG4gICAgICBsYWJlbDogJ05pdmVsIGRlIHJlYmHDsW8nXG4gICAgICBhbGlnbjogJ2xlZnQnXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9pbW11bml6YXRpb24tY292ZXJhZ2UtbWN2Mi5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBncmFwaC5zZXREYXRhIGRhdGEuZmlsdGVyKChkKSAtPiBjb3VudHJpZXMuaW5kZXhPZihkLmNvZGUpICE9IC0xKVxuICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFdvcmxkIENhc2VzIE11bHRpcGxlIFNtYWxsXG4gIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCA9IC0+XG4gICAgZGlzZWFzZXMgPSBbJ2RpcGh0ZXJpYScsICdtZWFzbGVzJywncGVydHVzc2lzJywncG9saW8nLCd0ZXRhbnVzJ11cbiAgICBncmFwaHMgPSBbXVxuICAgICMgTG9hZCBkYXRhXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9hc3NldHMvZGF0YS9kaXNlYXNlcy1jYXNlcy13b3JsZC5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIEdldCBtYXggdmFsdWUgdG8gY3JlYXRlIGEgY29tbW9uIHkgc2NhbGVcbiAgICAgIG1heFZhbHVlMSA9IGQzLm1heCBkYXRhLCAoZCkgLT4gZDMubWF4KGQzLnZhbHVlcyhkKSwgKGUpIC0+ICtlKVxuICAgICAgbWF4VmFsdWUyID0gZDMubWF4IGRhdGEuZmlsdGVyKChkKSAtPiBbJ2RpcGh0ZXJpYScsJ3BvbGlvJywndGV0YW51cyddLmluZGV4T2YoZC5kaXNlYXNlKSAhPSAtMSksIChkKSAtPiBkMy5tYXgoZDMudmFsdWVzKGQpLCAoZSkgLT4gK2UpXG4gICAgICAjIGNyZWF0ZSBhIGxpbmUgZ3JhcGggZm9yIGVhY2ggZGlzZWFzZVxuICAgICAgZGlzZWFzZXMuZm9yRWFjaCAoZGlzZWFzZSkgLT5cbiAgICAgICAgIyBnZXQgY3VycmVudCBkaXNlYXNlIGRhdGFcbiAgICAgICAgZGlzZWFzZV9kYXRhID0gZGF0YVxuICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQuZGlzZWFzZSA9PSBkaXNlYXNlXG4gICAgICAgICAgLm1hcCAgICAoZCkgLT4gJC5leHRlbmQoe30sIGQpXG4gICAgICAgICMgc2V0dXAgbGluZSBjaGFydFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuTGluZUdyYXBoKGRpc2Vhc2UrJy13b3JsZC1ncmFwaCcsXG4gICAgICAgICAgaXNBcmVhOiB0cnVlXG4gICAgICAgICAgbWFyZ2luOiBsZWZ0OiAyMFxuICAgICAgICAgIGtleTogXG4gICAgICAgICAgICB4OiAnZGlzZWFzZSdcbiAgICAgICAgICAgIGlkOiAnZGlzZWFzZScpXG4gICAgICAgIGdyYXBocy5wdXNoIGdyYXBoXG4gICAgICAgIGdyYXBoLnhBeGlzLnRpY2tWYWx1ZXMgWzE5ODAsIDIwMTVdXG4gICAgICAgIGdyYXBoLnlBeGlzLnRpY2tzKDIpLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcuMHMnKVxuICAgICAgICBncmFwaC55Rm9ybWF0ID0gZDMuZm9ybWF0KCcuMnMnKVxuICAgICAgICBncmFwaC5nZXRTY2FsZVlEb21haW4gPSAtPiByZXR1cm4gWzAsIGlmIGRpc2Vhc2UgPT0gJ21lYXNsZXMnIG9yIGRpc2Vhc2UgPT0gJ3BlcnR1c3NpcycgdGhlbiBtYXhWYWx1ZTEgZWxzZSBtYXhWYWx1ZTJdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGlzZWFzZV9kYXRhXG4gICAgICAgICMgbGlzdGVuIHRvIHllYXIgY2hhbmdlcyAmIHVwZGF0ZSBlYWNoIGdyYXBoIGxhYmVsXG4gICAgICAgIGdyYXBoLiRlbC5vbiAnY2hhbmdlLXllYXInLCAoZSwgeWVhcikgLT5cbiAgICAgICAgICBncmFwaHMuZm9yRWFjaCAoZykgLT5cbiAgICAgICAgICAgIHVubGVzcyBnID09IGdyYXBoXG4gICAgICAgICAgICAgIGcuc2V0TGFiZWwgeWVhclxuICAgICAgICBncmFwaC4kZWwub24gJ21vdXNlb3V0JywgKGUpIC0+XG4gICAgICAgICAgZ3JhcGhzLmZvckVhY2ggKGcpIC0+XG4gICAgICAgICAgICB1bmxlc3MgZyA9PSBncmFwaFxuICAgICAgICAgICAgICBnLmhpZGVMYWJlbCgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICBzZXR1cEltbXVuaXphdGlvbkRpc2Vhc2VCYXJHcmFwaCA9IC0+XG4gICAgIyBMb2FkIGRhdGFcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvYXNzZXRzL2RhdGEvaW1tdW5pemF0aW9uLWNvdmVyYWdlLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgY291bnRyaWVzKSAtPlxuICAgICAgICAjIFNldHVwIGN1cnJlbnQgY291bnRyeSAtPiBUT0RPISEhIHdlIGhhdmUgdG8gZ2V0IHVzZXIgY291bnRyeVxuICAgICAgICBjb3VudHJ5ID0gJ0VTUCdcbiAgICAgICAgIyBGaWx0ZXIgZGF0YVxuICAgICAgICBleGNsdWRlZENvdW50cmllcyA9IFsnVFVWJywnTlJVJywnUExXJywnVkdCJywnTUFGJywnU01SJywnR0lCJywnVENBJywnTElFJywnTUNPJywnU1hNJywnRlJPJywnTUhMJywnTU5QJywnQVNNJywnS05BJywnR1JMJywnQ1knLCdCTVUnLCdBTkQnLCdETUEnLCdJTU4nLCdBVEcnLCdTWUMnLCdWSVInLCdBQlcnLCdGU00nLCdUT04nLCdHUkQnLCdWQ1QnLCdLSVInLCdDVVcnLCdDSEknLCdHVU0nLCdMQ0EnLCdTVFAnLCdXU00nLCdWVVQnLCdOQ0wnLCdQWUYnLCdCUkInXVxuICAgICAgICBoZXJkSW1tdW5pdHkgPSBcbiAgICAgICAgICAnTUNWMSc6IDk1XG4gICAgICAgICAgJ1BvbDMnOiA4MFxuICAgICAgICAgICdEVFAzJzogODBcbiAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBleGNsdWRlZENvdW50cmllcy5pbmRleE9mKGQuY29kZSkgPT0gLTFcbiAgICAgICAgIyBEYXRhIHBhcnNlICYgc29ydGluZyBmdW50aW9uc1xuICAgICAgICBkYXRhX3BhcnNlciA9IChkKSAtPlxuICAgICAgICAgIG9iaiA9IFxuICAgICAgICAgICAga2V5OiAgIGQuY29kZVxuICAgICAgICAgICAgbmFtZTogIGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5jb2RlLCBsYW5nKVxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE1J11cbiAgICAgICAgICBpZiBkLmNvZGUgPT0gY291bnRyeVxuICAgICAgICAgICAgb2JqLmFjdGl2ZSA9IHRydWVcbiAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgIGRhdGFfc29ydCA9IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAjIGxvb3AgdGhyb3VnaCBlYWNoIGdyYXBoXG4gICAgICAgICQoJy5pbW11bml6YXRpb24tY292ZXJhZ2UtZGlzZWFzZS1ncmFwaCcpLmVhY2ggLT5cbiAgICAgICAgICAkZWwgICAgID0gJCh0aGlzKVxuICAgICAgICAgIGRpc2Vhc2UgPSAkZWwuZGF0YSgnZGlzZWFzZScpXG4gICAgICAgICAgdmFjY2luZSA9ICRlbC5kYXRhKCd2YWNjaW5lJylcbiAgICAgICAgICAjIEdldCBncmFwaCBkYXRhICYgdmFsdWVcbiAgICAgICAgICBncmFwaF9kYXRhID0gZGF0YVxuICAgICAgICAgICAgLmZpbHRlcigoZCkgLT4gZC52YWNjaW5lID09IHZhY2NpbmUgYW5kIGRbJzIwMTUnXSAhPSAnJylcbiAgICAgICAgICAgIC5tYXAoZGF0YV9wYXJzZXIpXG4gICAgICAgICAgICAuc29ydChkYXRhX3NvcnQpXG4gICAgICAgICAgZ3JhcGhfdmFsdWUgPSBncmFwaF9kYXRhLmZpbHRlcigoZCkgLT4gZC5rZXkgPT0gY291bnRyeSlcbiAgICAgICAgICAjIFNldHVwIGdyYXBoXG4gICAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckdyYXBoKGRpc2Vhc2UrJy1pbW11bml6YXRpb24tYmFyLWdyYXBoJyxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjI1XG4gICAgICAgICAgICBsYWJlbDogdHJ1ZVxuICAgICAgICAgICAga2V5OiB4OiAnbmFtZSdcbiAgICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgICAgdG9wOiAyMFxuICAgICAgICAgICAgICBib3R0b206IDApICAgXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXJcbiAgICAgICAgICAgICAgdmFsdWU6IGhlcmRJbW11bml0eVt2YWNjaW5lXVxuICAgICAgICAgICAgICBsYWJlbDogJ05pdmVsIGRlIHJlYmHDsW8nXG4gICAgICAgICAgICAuc2V0RGF0YSBncmFwaF9kYXRhXG4gICAgICAgICAgIyBTZXR1cCBncmFwaCB2YWx1ZVxuICAgICAgICAgIGlmIGdyYXBoX3ZhbHVlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICRlbC5maW5kKCcuaW1tdW5pemF0aW9uLWRhdGEnKS5odG1sICc8c3Ryb25nPicgKyBncmFwaF92YWx1ZVswXS52YWx1ZSArICclPC9zdHJvbmc+J1xuICAgICAgICAgICMgT24gcmVzaXplXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPiBncmFwaC5vblJlc2l6ZSgpXG4gIFxuICAjIyNcbiAgc2V0dXBHdWF0ZW1hbGFDb3ZlcmFnZUxpbmVHcmFwaCA9IC0+XG4gICAgZ3JhcGggPSBuZXcgd2luZG93LkxpbmVHcmFwaCgnZ3VhdGVtYWxhLWNvdmVyYWdlLW1tcicsXG4gICAgICAjaXNBcmVhOiB0cnVlXG4gICAgICBtYXJnaW46IFxuICAgICAgICBsZWZ0OiAwXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICAgIGJvdHRvbTogMjApXG4gICAgZ3JhcGgueEF4aXMudGlja1ZhbHVlcyBbMjAwMCwgMjAwNSwgMjAxMCwgMjAxNV1cbiAgICBncmFwaC55QXhpc1xuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIGdyYXBoLmxvYWREYXRhIGJhc2V1cmwrJy9hc3NldHMvZGF0YS9ndWF0ZW1hbGEtY292ZXJhZ2UtbW1yLmNzdidcbiAgICBncmFwaC4kZWwub24gJ2RyYXctY29tcGxldGUnLCAoZSkgLT5cbiAgICAgIGxpbmUgPSBncmFwaC5jb250YWluZXIuc2VsZWN0KCcubGluZScpXG4gICAgICBjb25zb2xlLmxvZyBsaW5lLm5vZGUoKVxuICAgICAgbGVuZ3RoID0gbGluZS5ub2RlKCkuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICAgIGxpbmVcbiAgICAgICAgLmF0dHIoJ3N0cm9rZS1kYXNoYXJyYXknLCBsZW5ndGggKyAnICcgKyBsZW5ndGgpXG4gICAgICAgIC5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsIGxlbmd0aClcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSg1MDAwKVxuICAgICAgICAgIC5kdXJhdGlvbig1MDAwKVxuICAgICAgICAgIC5lYXNlKGQzLmVhc2VTaW5Jbk91dClcbiAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAwKVxuXG4gIGlmICQoJyNndWF0ZW1hbGEtY292ZXJhZ2UtbW1yJykubGVuZ3RoID4gMFxuICAgIHNldHVwR3VhdGVtYWxhQ292ZXJhZ2VMaW5lR3JhcGgoKVxuICAjIyNcblxuICBpZiAkKCcjdmlkZW8tbWFwLXBvbGlvJykubGVuZ3RoID4gMFxuICAgIHNldFZpZGVvTWFwUG9saW8oKVxuXG4gICMjI1xuICAvLyBWYWNjaW5lIG1hcFxuICBpZiAoJCgnI3ZhY2NpbmUtbWFwJykubGVuZ3RoID4gMCkge1xuICAgIHZhciB2YWNjaW5lX21hcCA9IG5ldyBWYWNjaW5lTWFwKCd2YWNjaW5lLW1hcCcpO1xuICAgIC8vdmFjY2luZV9tYXAuZ2V0RGF0YSA9IHRydWU7IC8vIFNldCB0cnVlIHRvIGRvd25sb2FkIGEgcG9saW8gY2FzZXMgY3N2XG4gICAgLy92YWNjaW5lX21hcC5nZXRQaWN0dXJlU2VxdWVuY2UgPSB0cnVlOyAvLyBTZXQgdHJ1ZSB0byBkb3dubG9hZCBhIG1hcCBwaWN0dXJlIHNlcXVlbmNlXG4gICAgdmFjY2luZV9tYXAuaW5pdChiYXNldXJsKycvYXNzZXRzL2RhdGEvZGlzZWFzZXMtcG9saW8tY2FzZXMuY3N2JywgYmFzZXVybCsnL2Fzc2V0cy9kYXRhL21hcC1wb2xpby1jYXNlcy5jc3YnKTtcbiAgICAkKHdpbmRvdykucmVzaXplKCB2YWNjaW5lX21hcC5vblJlc2l6ZSApO1xuICB9XG4gICMjI1xuXG4gIGlmICQoJy52YWNjaW5lcy1kaXNlYXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwVmFjY2luZURpc2Vhc2VIZWF0bWFwR3JhcGgoKVxuXG4gICMjI1xuICAjIFZhY2NpbmUgYWxsIGRpc2Vhc2VzIGdyYXBoXG4gIGlmICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgZ3JhcGhfdmFjY2luZV9hbGxfZGlzZWFzZXMgPSBuZXcgVmFjY2luZURpc2Vhc2VHcmFwaCgndmFjY2luZXMtYWxsLWRpc2Vhc2VzLWdyYXBoJylcbiAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQoJyN2YWNjaW5lcy1hbGwtZGlzZWFzZXMtZ3JhcGggI29yZGVyLXNlbGVjdG9yJykudmFsKClcbiAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoX3ZhY2NpbmVfYWxsX2Rpc2Vhc2VzLm9uUmVzaXplXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZWQgb24gc2VsZWN0ZWQgZGlzZWFzZVxuICAgICQoJyNkaXNlYXNlLXNlbGVjdG9yIGEnKS5jbGljayAoZSkgLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgJCh0aGlzKS50YWIgJ3Nob3cnXG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQodGhpcykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSwgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS52YWwoKVxuICAgICAgcmV0dXJuXG4gICAgIyBVcGRhdGUgZ3JhcGggYmFzZW9uIG9uIG9yZGVyIHNlbGVjdG9yXG4gICAgJCgnI3ZhY2NpbmVzLWFsbC1kaXNlYXNlcy1ncmFwaCAjb3JkZXItc2VsZWN0b3InKS5jaGFuZ2UgKGQpIC0+XG4gICAgICBncmFwaF92YWNjaW5lX2FsbF9kaXNlYXNlcy5pbml0ICQoJyNkaXNlYXNlLXNlbGVjdG9yIC5hY3RpdmUgYScpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSksICQodGhpcykudmFsKClcbiAgIyMjXG5cbiAgaWYgJCgnI2ltbXVuaXphdGlvbi1jb3ZlcmFnZS1ncmFwaC1hbGwnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUR5bmFtaWNMaW5lR3JhcGgoKVxuXG4gIGlmICQoJyNpbW11bml6YXRpb24tY292ZXJhZ2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25Db3ZlcmFnZUxpbmVHcmFwaCgpXG5cbiAgaWYgJCgnI3dvcmxkLWNhc2VzJykubGVuZ3RoID4gMFxuICAgIHNldHVwV29ybGRDYXNlc011bHRpcGxlU21hbGxHcmFwaCgpXG4gIFxuICBpZiAkKCcuaW1tdW5pemF0aW9uLWNvdmVyYWdlLWRpc2Vhc2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBJbW11bml6YXRpb25EaXNlYXNlQmFyR3JhcGgoKVxuXG4pIGpRdWVyeSJdfQ==
