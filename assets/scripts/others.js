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

  window.IcebergGraph = (function(superClass) {
    extend(IcebergGraph, superClass);

    function IcebergGraph(id, options) {
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setMiddleLinePosition = bind(this.setMiddleLinePosition, this);
      this.setBarLabelYDimensions = bind(this.setBarLabelYDimensions, this);
      this.setBarLabelXDimensions = bind(this.setBarLabelXDimensions, this);
      this.setBarDownDimensions = bind(this.setBarDownDimensions, this);
      this.setBarUpDimensions = bind(this.setBarUpDimensions, this);
      this.setBarDimensions = bind(this.setBarDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      console.log('Iceberg Graph', id, options);
      IcebergGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    IcebergGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          d[_this.options.key.up] = +d[_this.options.key.up];
          d[_this.options.key.down] = +d[_this.options.key.down];
          return d.total = d[_this.options.key.up] + d[_this.options.key.down];
        };
      })(this));
      return data;
    };

    IcebergGraph.prototype.getScaleYRange = function() {
      return [0, this.height];
    };

    IcebergGraph.prototype.getScaleYDomain = function() {
      console.log([
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d.total;
          };
        })(this))
      ]);
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d.total;
          };
        })(this))
      ];
    };

    IcebergGraph.prototype.drawGraph = function() {
      console.table(this.data);
      this.upMax = d3.max(this.data, (function(_this) {
        return function(d) {
          return d[_this.options.key.up];
        };
      })(this));
      this.container.append('g').attr('class', 'bars-up');
      this.container.append('g').attr('class', 'bars-down');
      this.container.select('.bars-up').selectAll('.bar').data(this.data).enter().append('rect').attr('class', function(d) {
        if (d.active) {
          return 'bar bar-up active';
        } else {
          return 'bar bar-up';
        }
      }).call(this.setBarUpDimensions);
      this.container.select('.bars-down').selectAll('.bar').data(this.data).enter().append('rect').attr('class', function(d) {
        if (d.active) {
          return 'bar bar-down active';
        } else {
          return 'bar bar-down';
        }
      }).call(this.setBarDownDimensions);
      if (this.options.label) {
        this.container.selectAll('.bar-label-x').data(this.data).enter().append('text').attr('class', function(d) {
          if (d.active) {
            return 'bar-label-x active';
          } else {
            return 'bar-label-x';
          }
        }).attr('dy', '-0.5em').text((function(_this) {
          return function(d) {
            return d[_this.options.key.x];
          };
        })(this)).call(this.setBarLabelXDimensions);
        this.container.selectAll('.bar-label-y').data(this.options.label.y).enter().append('text').attr('class', 'bar-label-y').attr('id', function(d, i) {
          if (i === 0) {
            return 'bar-label-y-up';
          } else {
            return 'bar-label-y-down';
          }
        }).attr('dy', function(d, i) {
          if (i === 0) {
            return '-.5em';
          } else {
            return '1.25em';
          }
        }).attr('x', -this.options.margin.left).text((function(_this) {
          return function(d) {
            return d;
          };
        })(this)).call(this.setBarLabelYDimensions);
        this.container.append('rect').attr('class', 'middle-line').attr('x', -this.options.margin.left).attr('y', (function(_this) {
          return function(d) {
            return _this.y(_this.upMax);
          };
        })(this)).attr('height', 1).call(this.setMiddleLinePosition);
      }
      return this;
    };

    IcebergGraph.prototype.updateGraphDimensions = function() {
      IcebergGraph.__super__.updateGraphDimensions.call(this);
      this.container.selectAll('.bar-up').call(this.setBarUpDimensions);
      this.container.selectAll('.bar-down').call(this.setBarDownDimensions);
      if (this.options.label) {
        this.container.select('.middle-line').call(this.setMiddleLinePosition);
      }
      return this;
    };

    IcebergGraph.prototype.setBarDimensions = function(element) {};

    IcebergGraph.prototype.setBarUpDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(_this.upMax - d[_this.options.key.up]);
        };
      })(this)).attr('height', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.up]);
        };
      })(this)).attr('width', this.x.bandwidth());
    };

    IcebergGraph.prototype.setBarDownDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]);
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(_this.upMax);
        };
      })(this)).attr('height', (function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.down]);
        };
      })(this)).attr('width', this.x.bandwidth());
    };

    IcebergGraph.prototype.setBarLabelXDimensions = function(element) {
      return element.attr('x', (function(_this) {
        return function(d) {
          return _this.x(d[_this.options.key.x]) + _this.x.bandwidth() * 0.5;
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y(_this.upMax - d[_this.options.key.up]);
        };
      })(this));
    };

    IcebergGraph.prototype.setBarLabelYDimensions = function(element) {
      return element.attr('y', (function(_this) {
        return function(d) {
          return _this.y(_this.upMax);
        };
      })(this));
    };

    IcebergGraph.prototype.setMiddleLinePosition = function(element) {
      return element.attr('y', (function(_this) {
        return function(d) {
          return _this.y(_this.upMax);
        };
      })(this)).attr('width', this.width + this.options.margin.left + this.options.margin.right);
    };

    IcebergGraph.prototype.onMouseOver = function(d) {
      this.container.select('#bar-label-x-' + d[this.options.key.id]).classed('active', true);
      return this.container.select('#bar-label-y-' + d[this.options.key.id]).classed('active', true);
    };

    IcebergGraph.prototype.onMouseOut = function(d) {
      if (!d.active) {
        this.container.select('#bar-label-x-' + d[this.options.key.id]).classed('active', false);
        return this.container.select('#bar-label-y-' + d[this.options.key.id]).classed('active', false);
      }
    };

    return IcebergGraph;

  })(window.BarGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.BeeswarmGraph = (function(superClass) {
    extend(BeeswarmGraph, superClass);

    function BeeswarmGraph(id, options) {
      this.setTooltipData = bind(this.setTooltipData, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getSizeDomain = bind(this.getSizeDomain, this);
      this.getSizeRange = bind(this.getSizeRange, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.setCell = bind(this.setCell, this);
      console.log('BeeswarmGraph', id);
      options.dotSize = options.dotSize || 5;
      options.dotMinSize = options.dotMinSize || 2;
      options.dotMaxSize = options.dotMaxSize || 15;
      BeeswarmGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BeeswarmGraph.prototype.drawGraph = function() {
      this.setSize();
      this.setSimulation();
      this.runSimulation();
      this.voronoi = d3.voronoi().extent(this.getVoronoiExtent()).x(function(d) {
        return d.x;
      }).y(function(d) {
        return d.y;
      });
      this.container.append('g').attr('class', 'cells');
      return this.drawCells();
    };

    BeeswarmGraph.prototype.drawCells = function() {
      this.container.select('.cells').selectAll('g').data(this.voronoi.polygons(this.data)).enter().append('g').attr('class', 'cell').attr('id', function(d) {
        return 'cell-' + d.data.id;
      }).call(this.setCell);
      if (this.$tooltip) {
        return this.container.selectAll('.cell').select('path').on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut);
      }
    };

    BeeswarmGraph.prototype.setCell = function(cell) {
      cell.append('circle').attr('r', (function(_this) {
        return function(d) {
          if (_this.size) {
            return d.data.radius;
          } else {
            return _this.options.dotSize;
          }
        };
      })(this)).attr('fill', (function(_this) {
        return function(d) {
          return _this.color(_this.colorMap(d.data[_this.options.key.color]));
        };
      })(this)).call(this.setCellPosition);
      return cell.append('path').call(this.setCellVoronoiPath);
    };

    BeeswarmGraph.prototype.setSimulation = function() {
      var forceX;
      forceX = d3.forceX((function(_this) {
        return function(d) {
          return _this.x(d.value);
        };
      })(this));
      forceX.strength(1);
      return this.simulation = d3.forceSimulation(this.data).force('x', forceX).force('y', d3.forceY(this.height * .5)).force('collide', d3.forceCollide((function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius + 1;
          } else {
            return _this.options.dotSize + 1;
          }
        };
      })(this))).stop();
    };

    BeeswarmGraph.prototype.runSimulation = function() {
      var i, results;
      i = 0;
      results = [];
      while (i < 120) {
        this.simulation.tick();
        results.push(++i);
      }
      return results;
    };

    BeeswarmGraph.prototype.getVoronoiExtent = function() {
      return [[-this.options.margin.left - 1, -this.options.margin.top - 1], [this.width + this.options.margin.right + 1, this.height + this.options.margin.top + 1]];
    };

    BeeswarmGraph.prototype.setCellPosition = function(cell) {
      return cell.attr('cx', function(d) {
        return d.data.x;
      }).attr('cy', function(d) {
        return d.data.y;
      });
    };

    BeeswarmGraph.prototype.setCellVoronoiPath = function(cell) {
      return cell.attr('d', function(d) {
        return 'M' + d.join('L') + 'Z';
      });
    };

    BeeswarmGraph.prototype.setSize = function() {
      if (this.size) {
        return this.data.forEach((function(_this) {
          return function(d) {
            return d.radius = _this.size(d[_this.options.key.size]);
          };
        })(this));
      }
    };

    BeeswarmGraph.prototype.updateGraphDimensions = function() {
      BeeswarmGraph.__super__.updateGraphDimensions.call(this);
      this.setSimulation();
      this.runSimulation();
      this.voronoi.extent(this.getVoronoiExtent());
      this.container.selectAll('.cell').remove();
      this.drawCells();
      return this;
    };

    BeeswarmGraph.prototype.drawLegend = function() {
      return d3.select('.pharma-transfers-container').select('.legend').selectAll('li').data([25, 50, 75, 100]).enter().append('li').style('background', (function(_this) {
        return function(d) {
          return _this.color(d);
        };
      })(this)).html(function(d) {
        return d + '%';
      });
    };

    BeeswarmGraph.prototype.setScales = function() {
      this.x = d3.scaleLinear().range(this.getScaleXRange());
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      if (this.options.key.color) {
        this.colorMap = d3.scaleQuantize().domain([0, 100]).range([25, 50, 75, 100]);
        this.color = d3.scaleSequential(d3.interpolateRdYlGn);
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(0).tickValues([]);
      return this;
    };

    BeeswarmGraph.prototype.getScaleXDomain = function() {
      return [0, 100];
    };

    BeeswarmGraph.prototype.getSizeRange = function() {
      return [this.options.dotMinSize, this.options.dotMaxSize];
    };

    BeeswarmGraph.prototype.getSizeDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.size];
          };
        })(this))
      ];
    };

    BeeswarmGraph.prototype.getColorDomain = function() {
      return [100, 0];
    };

    BeeswarmGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(0,' + this.height * .5 + ')');
    };

    BeeswarmGraph.prototype.drawScales = function() {
      this.x.domain(this.getScaleXDomain());
      if (this.size) {
        this.size.domain(this.getSizeDomain());
      }
      if (this.color) {
        this.color.domain(this.getColorDomain());
      }
      if (this.xAxis) {
        this.container.append('g').attr('class', 'x axis').call(this.setXAxisPosition).call(this.xAxis);
      }
      return this;
    };

    BeeswarmGraph.prototype.getDimensions = function() {
      if (this.$el) {
        this.containerWidth = this.$el.width();
        this.containerHeight = 140;
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    BeeswarmGraph.prototype.onMouseOver = function(d) {
      var element;
      element = d3.select(d3.event.target.parentNode).select('circle');
      this.setTooltipData(d);
      return this.$tooltip.css({
        left: +element.attr('cx') + this.options.margin.left + this.$el.offset().left - (this.$tooltip.width() * 0.5),
        top: +element.attr('cy') + this.options.margin.top + this.$el.offset().top - this.$tooltip.height() - element.attr('r') - 5,
        opacity: 1
      });
    };

    BeeswarmGraph.prototype.onMouseOut = function(d) {
      return this.$tooltip.css('opacity', '0');
    };

    BeeswarmGraph.prototype.setTooltipData = function(d) {
      this.$tooltip.find('.tooltip-inner .title').html(d.data[this.options.key.id]);
      this.$tooltip.find('.tooltip-inner .value').html(Math.round(d.data.value) + '%');
      this.$tooltip.find('.tooltip-inner .total').html(d.data.size);
      if (d.data.subsidiaries) {
        this.$tooltip.find('.tooltip-inner .subsidiaries').html(d.data.subsidiaries);
        return this.$tooltip.find('.tooltip-inner .subsidiaries-cont').show();
      } else {
        return this.$tooltip.find('.tooltip-inner .subsidiaries-cont').hide();
      }
    };

    return BeeswarmGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  (function($) {
    var baseurl, getCountryName, lang, markers;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    getCountryName = function(countries, code, lang) {
      var item;
      item = countries.filter(function(d) {
        return d.code2 === code;
      });
      if (item.length) {
        return item[0]['name_' + lang];
      } else {
        return console.error('No country name for code', code);
      }
    };
    if ($('.bar-graph').length > 0) {
      markers = {
        'antibiotics-graph': {
          value: 36,
          label: lang === 'es' ? 'Media EU28' : 'EU28 Average'
        },
        'antibiotics-animals-graph': {
          value: 107.8,
          label: lang === 'es' ? 'Media' : 'Average'
        }
      };
      d3.queue().defer(d3.csv, baseurl + '/data/antibiotics.csv').defer(d3.csv, baseurl + '/data/antibiotics-animals.csv').defer(d3.csv, baseurl + '/data/countries.csv').await(function(error, data_antibiotics, data_antibiotics_animals, countries) {
        data_antibiotics.forEach(function(d) {
          return d.name = getCountryName(countries, d.label, lang);
        });
        data_antibiotics_animals.forEach(function(d) {
          return d.name = getCountryName(countries, d.label, lang);
        });
        return $('.bar-graph').each(function() {
          var graph, id;
          id = $(this).attr('id');
          graph = new window.BarGraph(id, {
            aspectRatio: 0.4,
            label: true,
            key: {
              id: 'label',
              x: 'name'
            }
          });
          graph.addMarker(markers[id]).setData(id === 'antibiotics-graph' ? data_antibiotics : data_antibiotics_animals);
          return $(window).resize(graph.onResize);
        });
      });
    }
    if ($('#pharma-categories-amounts').length > 0) {
      d3.csv(baseurl + '/data/pharma-categories-amounts.csv', function(error, data) {
        var graph;
        graph = new window.IcebergGraph('pharma-categories-amounts', {
          aspectRatio: 0.5,
          margin: {
            top: 20,
            bottom: 0,
            left: 100,
            right: 20
          },
          label: {
            y: ['Declarado', 'Oculto']
          },
          key: {
            x: 'category',
            up: 'declared',
            down: 'hidden'
          }
        });
        graph.setData(data);
        return $(window).resize(graph.onResize);
      });
    }
    if ($('#pharma-doctors-average').length > 0) {
      d3.csv(baseurl + '/data/pharma-doctors-average.csv', function(error, data) {
        return console.table(data);
      });
    }
    if ($('.pharma-transfers').length > 0) {
      return d3.csv(baseurl + '/data/pharma-transfers.csv', function(error, data) {
        var categories, totals, totalsMax;
        categories = ['charges', 'travels', 'fees', 'relateds'];
        totals = [];
        categories.forEach(function(category) {
          return totals.push(d3.max(data, function(d) {
            return +d[category + '_doctors_total'];
          }));
        });
        totalsMax = d3.max(totals);
        data.forEach(function(d, i) {
          d.id = i;
          return $('#pharma-selector select').append('<option value="' + d.id + '">' + d.laboratory + '</option>');
        });
        categories.forEach(function(category, i) {
          var data_category, graph;
          data_category = data.filter(function(d) {
            return d[category + '_doctors_percent'] !== '' && d[category + '_doctors_total'] !== '';
          }).map(function(d) {
            return {
              id: d.id,
              laboratory: d.laboratory,
              subsidiaries: d.subsidiaries,
              value: d[category + '_doctors_percent'] * 100,
              size: +d[category + '_doctors_total'],
              "import": Math.round(+d[category + '_value'])
            };
          });
          graph = new window.BeeswarmGraph('pharma-transfers-' + category, {
            margin: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 20
            },
            key: {
              id: 'laboratory',
              size: 'size',
              color: 'value'
            },
            legend: i === 0
          });
          graph.$tooltip = $('#pharma-transfers-tooltip');
          graph.getSizeDomain = function() {
            return [0, totalsMax];
          };
          graph.setData(data_category);
          return $(window).resize(graph.onResize);
        });
        return $('#pharma-selector select').change(function(e) {
          var value;
          value = $(e.target).val();
          if (value === '-1') {
            return categories.forEach(function(category) {
              return $('#pharma-transfers-' + category + ' .cell').removeClass('desactive').removeClass('active');
            });
          } else {
            return categories.forEach(function(category) {
              $('#pharma-transfers-' + category + ' .cell').removeClass('active').addClass('desactive');
              return $('#pharma-transfers-' + category + ' #cell-' + value).removeClass('desactive').addClass('active');
            });
          }
        });
      });
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImljZWJlcmctZ3JhcGguY29mZmVlIiwiYmVlc3dhcm0tZ3JhcGguY29mZmVlIiwibWFpbi1vdGhlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQVA7TUFDWixJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0FBQ1gsYUFBTztJQVJJOzt3QkFjYixNQUFBLEdB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Im90aGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIEBzdmdcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCYXIgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICAgLnBhZGRpbmdJbm5lcigwLjEpXG4gICAgICAucGFkZGluZ091dGVyKDApXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIEBkYXRhLm1hcCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBiYXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYWN0aXZlJyBlbHNlICdiYXInXG4gICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAgICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICBpZiBAb3B0aW9ucy5sYWJlbFxuICAgICAgIyBkcmF3IGxhYmVscyB4XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXggYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteCdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnMS4yNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICAjIGRyYXcgbGFiZWxzIHlcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteSBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC15J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICctMC41ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBpZiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQgdGhlbiBAb3B0aW9ucy5sYWJlbC5mb3JtYXQoZFtAb3B0aW9ucy5rZXkueV0pIGVsc2UgZFtAb3B0aW9ucy5rZXkueV1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgZ3JhcGggZGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXknKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWURpbWVuc2lvbnNcbiAgICByZXR1cm4gQFxuXG4gIHNldEJhckRpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAaGVpZ2h0IC0gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQHguYmFuZHdpZHRoKClcblxuICBzZXRCYXJMYWJlbFhEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQGhlaWdodFxuXG4gIHNldEJhckxhYmVsWURpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5JY2ViZXJnR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFyR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0ljZWJlcmcgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnVwXSA9ICtkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LmRvd25dID0gK2RbQG9wdGlvbnMua2V5LmRvd25dXG4gICAgICBkLnRvdGFsID0gZFtAb3B0aW9ucy5rZXkudXBdICsgZFtAb3B0aW9ucy5rZXkuZG93bl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQGhlaWdodF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgY29uc29sZS5sb2cgWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGQudG90YWwpXVxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZC50b3RhbCldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUudGFibGUgQGRhdGFcblxuICAgIEB1cE1heCA9IGQzLm1heCBAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnVwXVxuXG4gICAgIyBhZGQgY29udGFpbmVycyB1cCAmIGRvd25cbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFycy11cCdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFycy1kb3duJ1xuXG4gICAgIyBkcmF3IGJhcnMgdXBcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmJhcnMtdXAnKS5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYmFyLXVwIGFjdGl2ZScgZWxzZSAnYmFyIGJhci11cCdcbiAgICAgICMuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyVXBEaW1lbnNpb25zXG5cbiAgICAjIGRyYXcgYmFycyBkb3duXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5iYXJzLWRvd24nKS5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYmFyLWRvd24gYWN0aXZlJyBlbHNlICdiYXIgYmFyLWRvd24nXG4gICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG5cbiAgICAjIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgIyAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAjICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgIyAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcblxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLmxhYmVsLnkpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkLGkpIC0+IGlmIGkgPT0gMCB0aGVuICdiYXItbGFiZWwteS11cCcgZWxzZSAnYmFyLWxhYmVsLXktZG93bidcbiAgICAgICAgLmF0dHIgJ2R5JywgICAgKGQsaSkgLT4gaWYgaSA9PSAwIHRoZW4gJy0uNWVtJyBlbHNlICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd4JywgICAgIC1Ab3B0aW9ucy5tYXJnaW4ubGVmdFxuICAgICAgICAudGV4dCAoZCkgPT4gZFxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgICAgIyBkcmF3IG1pZGRsZSBsaW5lXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICAnbWlkZGxlLWxpbmUnXG4gICAgICAgIC5hdHRyICd4JywgICAgICAtQG9wdGlvbnMubWFyZ2luLmxlZnRcbiAgICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeSBAdXBNYXhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDFcbiAgICAgICAgLmNhbGwgQHNldE1pZGRsZUxpbmVQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItdXAnKVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWRvd24nKVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcubWlkZGxlLWxpbmUnKVxuICAgICAgICAuY2FsbCBAc2V0TWlkZGxlTGluZVBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICByZXR1cm5cblxuICBzZXRCYXJVcERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkgQHVwTWF4LWRbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckRvd25EaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IEB1cE1heC1kW0BvcHRpb25zLmtleS51cF1cblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCAoZCkgPT4gQHkgQHVwTWF4XG5cbiAgc2V0TWlkZGxlTGluZVBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB3aWR0aCtAb3B0aW9ucy5tYXJnaW4ubGVmdCtAb3B0aW9ucy5tYXJnaW4ucmlnaHRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5CZWVzd2FybUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICNjb25zb2xlLnRhYmxlIEBkYXRhXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgIEB2b3Jvbm9pID0gZDMudm9yb25vaSgpXG4gICAgICAuZXh0ZW50IEBnZXRWb3Jvbm9pRXh0ZW50KClcbiAgICAgIC54IChkKSAtPiBkLnhcbiAgICAgIC55IChkKSAtPiBkLnlcblxuICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdjZWxscydcblxuICAgIEBkcmF3Q2VsbHMoKVxuXG5cbiAgZHJhd0NlbGxzOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbHMnKVxuICAgICAgLnNlbGVjdEFsbCgnZycpXG4gICAgICAgIC5kYXRhIEB2b3Jvbm9pLnBvbHlnb25zKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2NlbGwnXG4gICAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY2VsbC0nK2QuZGF0YS5pZFxuICAgICAgICAuY2FsbCBAc2V0Q2VsbFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpLnNlbGVjdCgncGF0aCcpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuXG4gIHNldENlbGw6IChjZWxsKSA9PlxuICAgIGNlbGwuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5kYXRhLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBAY29sb3JNYXAoZC5kYXRhW0BvcHRpb25zLmtleS5jb2xvcl0pXG4gICAgICAuY2FsbCBAc2V0Q2VsbFBvc2l0aW9uXG4gICAgY2VsbC5hcHBlbmQoJ3BhdGgnKS5jYWxsIEBzZXRDZWxsVm9yb25vaVBhdGhcblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWCA9IGQzLmZvcmNlWCAoZCkgPT4gcmV0dXJuIEB4KGQudmFsdWUpXG4gICAgZm9yY2VYLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVhcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWShAaGVpZ2h0Ki41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMTIwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIGdldFZvcm9ub2lFeHRlbnQ6IC0+XG4gICAgcmV0dXJuIFtbLUBvcHRpb25zLm1hcmdpbi5sZWZ0LTEsIC1Ab3B0aW9ucy5tYXJnaW4udG9wLTFdLCBbQHdpZHRoK0BvcHRpb25zLm1hcmdpbi5yaWdodCsxLCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArMV1dXG5cbiAgc2V0Q2VsbFBvc2l0aW9uOiAoY2VsbCkgLT5cbiAgICBjZWxsXG4gICAgICAuYXR0ciAnY3gnLCAoZCkgLT4gZC5kYXRhLnhcbiAgICAgIC5hdHRyICdjeScsIChkKSAtPiBkLmRhdGEueVxuXG4gIHNldENlbGxWb3Jvbm9pUGF0aDogKGNlbGwpIC0+XG4gICAgY2VsbC5hdHRyICdkJywgKGQpIC0+ICdNJytkLmpvaW4oJ0wnKSsnWidcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEB2b3Jvbm9pLmV4dGVudCBAZ2V0Vm9yb25vaUV4dGVudCgpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jZWxsJykucmVtb3ZlKClcbiAgICBAZHJhd0NlbGxzKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgZDMuc2VsZWN0KCcucGhhcm1hLXRyYW5zZmVycy1jb250YWluZXInKS5zZWxlY3QoJy5sZWdlbmQnKS5zZWxlY3RBbGwoJ2xpJylcbiAgICAgIC5kYXRhIFsyNSw1MCw3NSwgMTAwXVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IgZFxuICAgICAgICAuaHRtbCAoZCkgLT4gZCsnJSdcblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3JNYXAgPSBkMy5zY2FsZVF1YW50aXplKClcbiAgICAgICAgLmRvbWFpbiBbMCwgMTAwXVxuICAgICAgICAucmFuZ2UgWzI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZVJkWWxHblxuICAgICAgI0Bjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCBkMy5zY2hlbWVSZFlsR25cbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIDBcbiAgICAgIC50aWNrVmFsdWVzIFtdXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAwXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzEwMCwgMF1cblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0Ki41KycpJ1xuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IDE0MFxuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQucGFyZW50Tm9kZSkuc2VsZWN0KCdjaXJjbGUnKVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArIEAkZWwub2Zmc2V0KCkubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgQCRlbC5vZmZzZXQoKS50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSBlbGVtZW50LmF0dHIoJ3InKSAtIDVcbiAgICAgIG9wYWNpdHk6IDFcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgTWF0aC5yb3VuZChkLmRhdGEudmFsdWUpKyclJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50b3RhbCdcbiAgICAgIC5odG1sIGQuZGF0YS5zaXplXG4gICAgaWYgZC5kYXRhLnN1YnNpZGlhcmllc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuc3Vic2lkaWFyaWVzJ1xuICAgICAgICAuaHRtbCBkLmRhdGEuc3Vic2lkaWFyaWVzXG4gICAgICBAJHRvb2x0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXIgLnN1YnNpZGlhcmllcy1jb250Jykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgQCR0b29sdGlwLmZpbmQoJy50b29sdGlwLWlubmVyIC5zdWJzaWRpYXJpZXMtY29udCcpLmhpZGUoKVxuIiwiIyBPdGhlciBhcnRpY2xlcyBzaXRlIHNldHVwIChzdXBlcmJ1Z3MsIC4uLilcblxuKCgkKSAtPlxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjIGdldCBjb3VudHJ5IG5hbWUgYXV4aWxpYXIgbWV0aG9kXG4gIGdldENvdW50cnlOYW1lID0gKGNvdW50cmllcywgY29kZSwgbGFuZykgLT5cbiAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBjb2RlXG4gICAgaWYgaXRlbS5sZW5ndGhcbiAgICAgIGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZXJyb3IgJ05vIGNvdW50cnkgbmFtZSBmb3IgY29kZScsIGNvZGVcbiAgXG4gICMgU2V0dXAgYmFyIGdyYXBoc1xuICBpZiAkKCcuYmFyLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICMgbWFya2VycyBvYmplY3RcbiAgICBtYXJrZXJzID1cbiAgICAgICdhbnRpYmlvdGljcy1ncmFwaCc6XG4gICAgICAgIHZhbHVlOiAzNlxuICAgICAgICBsYWJlbDogaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ01lZGlhIEVVMjgnIGVsc2UgJ0VVMjggQXZlcmFnZSdcbiAgICAgICdhbnRpYmlvdGljcy1hbmltYWxzLWdyYXBoJzpcbiAgICAgICAgdmFsdWU6IDEwNy44XG4gICAgICAgIGxhYmVsOiBpZiBsYW5nID09ICdlcycgdGhlbiAnTWVkaWEnIGVsc2UgJ0F2ZXJhZ2UnXG5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9hbnRpYmlvdGljcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCBiYXNldXJsKycvZGF0YS9hbnRpYmlvdGljcy1hbmltYWxzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX2FudGliaW90aWNzLCBkYXRhX2FudGliaW90aWNzX2FuaW1hbHMsIGNvdW50cmllcykgLT5cbiAgICAgICAgIyBhZGQgY291bnRyeSBuYW1lcyB0byBkYXRhXG4gICAgICAgIGRhdGFfYW50aWJpb3RpY3MuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBkLm5hbWUgPSBnZXRDb3VudHJ5TmFtZShjb3VudHJpZXMsIGQubGFiZWwsIGxhbmcpXG4gICAgICAgIGRhdGFfYW50aWJpb3RpY3NfYW5pbWFscy5mb3JFYWNoIChkKSAtPlxuICAgICAgICAgIGQubmFtZSA9IGdldENvdW50cnlOYW1lKGNvdW50cmllcywgZC5sYWJlbCwgbGFuZylcbiAgICAgICAgIyBsb29wIHRocm91Z2ggZWFjaCBiYXIgZ3JhcGhcbiAgICAgICAgJCgnLmJhci1ncmFwaCcpLmVhY2ggLT5cbiAgICAgICAgICBpZCA9ICQodGhpcykuYXR0cignaWQnKVxuICAgICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CYXJHcmFwaChpZCxcbiAgICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjRcbiAgICAgICAgICAgIGxhYmVsOiB0cnVlXG4gICAgICAgICAgICBrZXk6IFxuICAgICAgICAgICAgICBpZDogJ2xhYmVsJ1xuICAgICAgICAgICAgICB4OiAnbmFtZScpXG4gICAgICAgICAgZ3JhcGhcbiAgICAgICAgICAgIC5hZGRNYXJrZXIgbWFya2Vyc1tpZF1cbiAgICAgICAgICAgIC5zZXREYXRhIGlmIGlkID09ICdhbnRpYmlvdGljcy1ncmFwaCcgdGhlbiBkYXRhX2FudGliaW90aWNzIGVsc2UgZGF0YV9hbnRpYmlvdGljc19hbmltYWxzXG4gICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgU2V0dXAgaWNlYmVyZyBncmFwaFxuICBpZiAkKCcjcGhhcm1hLWNhdGVnb3JpZXMtYW1vdW50cycpLmxlbmd0aCA+IDBcbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvcGhhcm1hLWNhdGVnb3JpZXMtYW1vdW50cy5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIHNldHVwIGdyYXBoXG4gICAgICBncmFwaCA9IG5ldyB3aW5kb3cuSWNlYmVyZ0dyYXBoKCdwaGFybWEtY2F0ZWdvcmllcy1hbW91bnRzJyxcbiAgICAgICAgYXNwZWN0UmF0aW86IDAuNVxuICAgICAgICBtYXJnaW46IFxuICAgICAgICAgIHRvcDogMjBcbiAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICBsZWZ0OiAxMDBcbiAgICAgICAgICByaWdodDogMjBcbiAgICAgICAgbGFiZWw6XG4gICAgICAgICAgeTogWydEZWNsYXJhZG8nLCAnT2N1bHRvJ11cbiAgICAgICAga2V5OlxuICAgICAgICAgIHg6ICdjYXRlZ29yeSdcbiAgICAgICAgICB1cDogJ2RlY2xhcmVkJ1xuICAgICAgICAgIGRvd246ICdoaWRkZW4nKVxuICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhXG4gICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG5cbiAgIyBTZXR1cCBkb2N0b3JzIGF2ZXJhZ2VcbiAgaWYgJCgnI3BoYXJtYS1kb2N0b3JzLWF2ZXJhZ2UnKS5sZW5ndGggPiAwXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL3BoYXJtYS1kb2N0b3JzLWF2ZXJhZ2UuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgY29uc29sZS50YWJsZSBkYXRhXG5cbiAgIyBTZXR1cCBiZWVzd2FybSBncmFwaFxuICBpZiAkKCcucGhhcm1hLXRyYW5zZmVycycpLmxlbmd0aCA+IDBcbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvcGhhcm1hLXRyYW5zZmVycy5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICBjYXRlZ29yaWVzID0gWydjaGFyZ2VzJywgJ3RyYXZlbHMnLCAnZmVlcycsICdyZWxhdGVkcyddXG4gICAgICAjIGdldCBtYXhpbXVtIG51bWJlciBvZiBkb2N0b3JzIHBlciBwaGFybWFcbiAgICAgIHRvdGFscyA9IFtdXG4gICAgICBjYXRlZ29yaWVzLmZvckVhY2ggKGNhdGVnb3J5KSAtPlxuICAgICAgICB0b3RhbHMucHVzaCBkMy5tYXgoZGF0YSwgKGQpIC0+ICtkW2NhdGVnb3J5KydfZG9jdG9yc190b3RhbCddKVxuICAgICAgdG90YWxzTWF4ID0gZDMubWF4KHRvdGFscylcbiAgICAgICMgcG9wdWxhdGUgc2VsZWN0XG4gICAgICBkYXRhLmZvckVhY2ggKGQsIGkpIC0+XG4gICAgICAgIGQuaWQgPSBpXG4gICAgICAgICQoJyNwaGFybWEtc2VsZWN0b3Igc2VsZWN0JykuYXBwZW5kICc8b3B0aW9uIHZhbHVlPVwiJytkLmlkKydcIj4nK2QubGFib3JhdG9yeSsnPC9vcHRpb24+J1xuICAgICAgIyBzZXR1cCBhIGJlZXN3YXJtIGNoYXJ0IGZvciBlYWNoIGNhdGVnb3J5XG4gICAgICBjYXRlZ29yaWVzLmZvckVhY2ggKGNhdGVnb3J5LCBpKSAtPlxuICAgICAgICBkYXRhX2NhdGVnb3J5ID0gZGF0YVxuICAgICAgICAgICMgZmlsdGVyIGxpbmVzIHdpdGhvdXQgdmFsdWVzIG9yIHdpdGggMCBkb2N0b3JzXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZFtjYXRlZ29yeSsnX2RvY3RvcnNfcGVyY2VudCddICE9ICcnIGFuZCBkW2NhdGVnb3J5KydfZG9jdG9yc190b3RhbCddICE9ICcnXG4gICAgICAgICAgLm1hcCAoZCkgLT5cbiAgICAgICAgICAgIGlkOiBkLmlkXG4gICAgICAgICAgICBsYWJvcmF0b3J5OiBkLmxhYm9yYXRvcnlcbiAgICAgICAgICAgIHN1YnNpZGlhcmllczogZC5zdWJzaWRpYXJpZXNcbiAgICAgICAgICAgIHZhbHVlOiBkW2NhdGVnb3J5KydfZG9jdG9yc19wZXJjZW50J10qMTAwXG4gICAgICAgICAgICBzaXplOiArZFtjYXRlZ29yeSsnX2RvY3RvcnNfdG90YWwnXVxuICAgICAgICAgICAgaW1wb3J0OiBNYXRoLnJvdW5kKCtkW2NhdGVnb3J5KydfdmFsdWUnXSlcbiAgICAgICAgIyBzZXR1cCBncmFwaFxuICAgICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmVlc3dhcm1HcmFwaCgncGhhcm1hLXRyYW5zZmVycy0nK2NhdGVnb3J5LFxuICAgICAgICAgIG1hcmdpbjpcbiAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICByaWdodDogMjBcbiAgICAgICAgICBrZXk6XG4gICAgICAgICAgICBpZDogJ2xhYm9yYXRvcnknXG4gICAgICAgICAgICBzaXplOiAnc2l6ZSdcbiAgICAgICAgICAgIGNvbG9yOiAndmFsdWUnXG4gICAgICAgICAgbGVnZW5kOiBpID09IDApXG4gICAgICAgIGdyYXBoLiR0b29sdGlwID0gJCgnI3BoYXJtYS10cmFuc2ZlcnMtdG9vbHRpcCcpXG4gICAgICAgIGdyYXBoLmdldFNpemVEb21haW4gPSAtPiByZXR1cm4gWzAsIHRvdGFsc01heF1cbiAgICAgICAgZ3JhcGguc2V0RGF0YSBkYXRhX2NhdGVnb3J5XG4gICAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcbiAgICAgICMgZmlsdGVyIHBoYXJtYVxuICAgICAgJCgnI3BoYXJtYS1zZWxlY3RvciBzZWxlY3QnKS5jaGFuZ2UgKGUpIC0+XG4gICAgICAgIHZhbHVlID0gJChlLnRhcmdldCkudmFsKClcbiAgICAgICAgaWYgdmFsdWUgPT0gJy0xJ1xuICAgICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCAoY2F0ZWdvcnkpIC0+XG4gICAgICAgICAgICAkKCcjcGhhcm1hLXRyYW5zZmVycy0nK2NhdGVnb3J5KycgLmNlbGwnKS5yZW1vdmVDbGFzcygnZGVzYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSkgLT5cbiAgICAgICAgICAgICQoJyNwaGFybWEtdHJhbnNmZXJzLScrY2F0ZWdvcnkrJyAuY2VsbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKS5hZGRDbGFzcygnZGVzYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcjcGhhcm1hLXRyYW5zZmVycy0nK2NhdGVnb3J5KycgI2NlbGwtJyt2YWx1ZSkucmVtb3ZlQ2xhc3MoJ2Rlc2FjdGl2ZScpLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4pIGpRdWVyeVxuIl19
