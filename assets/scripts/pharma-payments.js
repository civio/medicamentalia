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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.BarHorizontalPharmaGraph = (function() {
    function BarHorizontalPharmaGraph(id, data) {
      this.setBars = bind(this.setBars, this);
      console.log('Bar Horizontal Pharma Graph', id);
      this.id = id;
      this.setData(data);
      this.drawGraph();
      return this;
    }

    BarHorizontalPharmaGraph.prototype.setData = function(data) {
      var maxDeclared, maxHidden;
      this.data = this.dataParser(data);
      maxDeclared = d3.max(this.data, function(d) {
        return d.declared;
      });
      maxHidden = d3.max(this.data, function(d) {
        return d.hidden;
      });
      this.maxValue = d3.max([maxDeclared, maxHidden]);
      console.log(this.maxValue);
      return this;
    };

    BarHorizontalPharmaGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          d.hidden = +d.hidden;
          return d.declared = +d.declared;
        };
      })(this));
      return data;
    };

    BarHorizontalPharmaGraph.prototype.drawGraph = function() {
      d3.select('#' + this.id).selectAll('div').data(this.data).enter().append('div').call(this.setBars);
      return this;
    };

    BarHorizontalPharmaGraph.prototype.setBars = function(element) {
      element.append('div').attr('class', 'bar-title').html(function(d) {
        return d.category;
      });
      element.append('div').attr('class', 'bar bar-declared').style('width', (function(_this) {
        return function(d) {
          return (100 * d.declared / _this.maxValue) + '%';
        };
      })(this)).append('span').html(function(d) {
        return d.declared.toFixed(1) + ' €';
      });
      return element.append('div').attr('class', 'bar bar-hidden').style('width', (function(_this) {
        return function(d) {
          return (100 * d.hidden / _this.maxValue) + '%';
        };
      })(this)).append('span').html(function(d) {
        return d.hidden.toFixed(1) + ' €';
      });
    };

    return BarHorizontalPharmaGraph;

  })();

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
    var baseurl, lang;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    if ($('#pharma-categories-amounts').length > 0) {
      d3.csv(baseurl + '/data/pharma-categories-amounts.csv', function(error, data) {
        var graph;
        graph = new window.IcebergGraph('pharma-categories-amounts', {
          aspectRatio: 0.6,
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
        var graph;
        console.table(data);
        return graph = new window.BarHorizontalPharmaGraph('pharma-doctors-average', data);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImJhci1ob3Jpem9udGFsLXBoYXJtYS1ncmFwaC5jb2ZmZWUiLCJpY2ViZXJnLWdyYXBoLmNvZmZlZSIsImJlZXN3YXJtLWdyYXBoLmNvZmZlZSIsIm1haW4tcGhhcm1hLXBheW1lbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BQ0EsSUFB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T0FBWCxDQUFtQixTQUFDLFFBQUQ7cUJBQ2pCLENBQUEsQ0FBRSxvQkFBQSxHQUFxQixRQUFyQixHQUE4QixRQUFoQyxDQUF5QyxDQUFDLFdBQTFDLENBQXNELFdBQXRELENBQWtFLENBQUMsV0FBbkUsQ0FBK0UsUUFBL0U7WUFEaUIsQ0FBbkIsRUFERjtXQUFBLE1BQUE7bUJBSUUsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsU0FBQyxRQUFEO2NBQ2pCLENBQUEsQ0FBRSxvQkFBQSxHQUFxQixRQUFyQixHQUE4QixRQUFoQyxDQUF5QyxDQUFDLFdBQTFDLENBQXNELFFBQXRELENBQStELENBQUMsUUFBaEUsQ0FBeUUsV0FBekU7cUJBQ0EsQ0FBQSxDQUFFLG9CQUFBLEdBQXFCLFFBQXJCLEdBQThCLFNBQTlCLEdBQXdDLEtBQTFDLENBQWdELENBQUMsV0FBakQsQ0FBNkQsV0FBN0QsQ0FBeUUsQ0FBQyxRQUExRSxDQUFtRixRQUFuRjtZQUZpQixDQUFuQixFQUpGOztRQUZrQyxDQUFwQztNQXhDMkMsQ0FBN0MsRUFERjs7RUFuQ0QsQ0FBRCxDQUFBLENBc0ZFLE1BdEZGO0FBQUEiLCJmaWxlIjoicGhhcm1hLXBheW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgQHN2Z1xuICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LkJhckdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueV0gPSArZFtAb3B0aW9ucy5rZXkueV1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gQGRhdGEubWFwIChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2JhciBhY3RpdmUnIGVsc2UgJ2JhcidcbiAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubW91c2VFdmVudHNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgICAgLm9uICAgJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gICAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAuYXR0ciAnaWQnLCAgICAoZCkgPT4gJ2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAgIC5hdHRyICdkeScsICAgICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdtaWRkbGUnXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS54XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxYRGltZW5zaW9uc1xuICAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC15IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJy0wLjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGlmIEBvcHRpb25zLmxhYmVsLmZvcm1hdCB0aGVuIEBvcHRpb25zLmxhYmVsLmZvcm1hdChkW0BvcHRpb25zLmtleS55XSkgZWxzZSBkW0BvcHRpb25zLmtleS55XVxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC14JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAgICAgIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSlcbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgKGQpID0+IEBoZWlnaHQgLSBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckxhYmVsWERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKSArIEB4LmJhbmR3aWR0aCgpICogMC41XG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAaGVpZ2h0XG5cbiAgc2V0QmFyTGFiZWxZRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIHRydWVcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICB1bmxlc3MgZC5hY3RpdmVcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgIiwiY2xhc3Mgd2luZG93LkJhckhvcml6b250YWxQaGFybWFHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIGRhdGEpIC0+XG4gICAgY29uc29sZS5sb2cgJ0JhciBIb3Jpem9udGFsIFBoYXJtYSBHcmFwaCcsIGlkXG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAc2V0RGF0YSBkYXRhXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIG1heERlY2xhcmVkID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5kZWNsYXJlZFxuICAgIG1heEhpZGRlbiAgID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5oaWRkZW5cbiAgICBAbWF4VmFsdWUgICA9IGQzLm1heCBbbWF4RGVjbGFyZWQsIG1heEhpZGRlbl1cbiAgICBjb25zb2xlLmxvZyBAbWF4VmFsdWVcbiAgICByZXR1cm4gQFxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLmhpZGRlbiAgID0gK2QuaGlkZGVuXG4gICAgICBkLmRlY2xhcmVkID0gK2QuZGVjbGFyZWRcbiAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIGQzLnNlbGVjdCgnIycrQGlkKS5zZWxlY3RBbGwoJ2RpdicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuY2FsbCBAc2V0QmFyc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLXRpdGxlJ1xuICAgICAgLmh0bWwgKGQpIC0+IGQuY2F0ZWdvcnlcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWRlY2xhcmVkJ1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgPT4gKDEwMCpkLmRlY2xhcmVkL0BtYXhWYWx1ZSkrJyUnXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmh0bWwgKGQpIC0+IGQuZGVjbGFyZWQudG9GaXhlZCgxKSsnIOKCrCdcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWhpZGRlbidcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpID0+ICgxMDAqZC5oaWRkZW4vQG1heFZhbHVlKSsnJSdcbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuaHRtbCAoZCkgLT4gZC5oaWRkZW4udG9GaXhlZCgxKSsnIOKCrCdcbiIsImNsYXNzIHdpbmRvdy5JY2ViZXJnR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFyR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgY29uc29sZS5sb2cgJ0ljZWJlcmcgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnVwXSA9ICtkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LmRvd25dID0gK2RbQG9wdGlvbnMua2V5LmRvd25dXG4gICAgICBkLnRvdGFsID0gZFtAb3B0aW9ucy5rZXkudXBdICsgZFtAb3B0aW9ucy5rZXkuZG93bl1cbiAgICByZXR1cm4gZGF0YVxuXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQGhlaWdodF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgY29uc29sZS5sb2cgWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGQudG90YWwpXVxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZC50b3RhbCldXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUudGFibGUgQGRhdGFcblxuICAgIEB1cE1heCA9IGQzLm1heCBAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnVwXVxuXG4gICAgIyBhZGQgY29udGFpbmVycyB1cCAmIGRvd25cbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFycy11cCdcbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFycy1kb3duJ1xuXG4gICAgIyBkcmF3IGJhcnMgdXBcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmJhcnMtdXAnKS5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYmFyLXVwIGFjdGl2ZScgZWxzZSAnYmFyIGJhci11cCdcbiAgICAgICMuYXR0ciAnaWQnLCAgICAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0QmFyVXBEaW1lbnNpb25zXG5cbiAgICAjIGRyYXcgYmFycyBkb3duXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5iYXJzLWRvd24nKS5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXIgYmFyLWRvd24gYWN0aXZlJyBlbHNlICdiYXIgYmFyLWRvd24nXG4gICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG5cbiAgICAjIGlmIEBvcHRpb25zLm1vdXNlRXZlbnRzXG4gICAgIyAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAjICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgIyAgICAgLm9uICAgJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcblxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLmxhYmVsLnkpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkLGkpIC0+IGlmIGkgPT0gMCB0aGVuICdiYXItbGFiZWwteS11cCcgZWxzZSAnYmFyLWxhYmVsLXktZG93bidcbiAgICAgICAgLmF0dHIgJ2R5JywgICAgKGQsaSkgLT4gaWYgaSA9PSAwIHRoZW4gJy0uNWVtJyBlbHNlICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd4JywgICAgIC1Ab3B0aW9ucy5tYXJnaW4ubGVmdFxuICAgICAgICAudGV4dCAoZCkgPT4gZFxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgICAgIyBkcmF3IG1pZGRsZSBsaW5lXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICAnbWlkZGxlLWxpbmUnXG4gICAgICAgIC5hdHRyICd4JywgICAgICAtQG9wdGlvbnMubWFyZ2luLmxlZnRcbiAgICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeSBAdXBNYXhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDFcbiAgICAgICAgLmNhbGwgQHNldE1pZGRsZUxpbmVQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItdXAnKVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWRvd24nKVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcubWlkZGxlLWxpbmUnKVxuICAgICAgICAuY2FsbCBAc2V0TWlkZGxlTGluZVBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICByZXR1cm5cblxuICBzZXRCYXJVcERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkgQHVwTWF4LWRbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckRvd25EaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IEB1cE1heC1kW0BvcHRpb25zLmtleS51cF1cblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCAoZCkgPT4gQHkgQHVwTWF4XG5cbiAgc2V0TWlkZGxlTGluZVBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB3aWR0aCtAb3B0aW9ucy5tYXJnaW4ubGVmdCtAb3B0aW9ucy5tYXJnaW4ucmlnaHRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgdW5sZXNzIGQuYWN0aXZlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC14LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAgIC5jbGFzc2VkICdhY3RpdmUnLCBmYWxzZVxuICAgICIsImNsYXNzIHdpbmRvdy5CZWVzd2FybUdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICNjb25zb2xlLnRhYmxlIEBkYXRhXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgIEB2b3Jvbm9pID0gZDMudm9yb25vaSgpXG4gICAgICAuZXh0ZW50IEBnZXRWb3Jvbm9pRXh0ZW50KClcbiAgICAgIC54IChkKSAtPiBkLnhcbiAgICAgIC55IChkKSAtPiBkLnlcblxuICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdjZWxscydcblxuICAgIEBkcmF3Q2VsbHMoKVxuXG5cbiAgZHJhd0NlbGxzOiAtPlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuY2VsbHMnKVxuICAgICAgLnNlbGVjdEFsbCgnZycpXG4gICAgICAgIC5kYXRhIEB2b3Jvbm9pLnBvbHlnb25zKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2NlbGwnXG4gICAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY2VsbC0nK2QuZGF0YS5pZFxuICAgICAgICAuY2FsbCBAc2V0Q2VsbFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpLnNlbGVjdCgncGF0aCcpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuXG4gIHNldENlbGw6IChjZWxsKSA9PlxuICAgIGNlbGwuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5kYXRhLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBAY29sb3JNYXAoZC5kYXRhW0BvcHRpb25zLmtleS5jb2xvcl0pXG4gICAgICAuY2FsbCBAc2V0Q2VsbFBvc2l0aW9uXG4gICAgY2VsbC5hcHBlbmQoJ3BhdGgnKS5jYWxsIEBzZXRDZWxsVm9yb25vaVBhdGhcblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWCA9IGQzLmZvcmNlWCAoZCkgPT4gcmV0dXJuIEB4KGQudmFsdWUpXG4gICAgZm9yY2VYLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVhcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWShAaGVpZ2h0Ki41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMTIwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIGdldFZvcm9ub2lFeHRlbnQ6IC0+XG4gICAgcmV0dXJuIFtbLUBvcHRpb25zLm1hcmdpbi5sZWZ0LTEsIC1Ab3B0aW9ucy5tYXJnaW4udG9wLTFdLCBbQHdpZHRoK0BvcHRpb25zLm1hcmdpbi5yaWdodCsxLCBAaGVpZ2h0K0BvcHRpb25zLm1hcmdpbi50b3ArMV1dXG5cbiAgc2V0Q2VsbFBvc2l0aW9uOiAoY2VsbCkgLT5cbiAgICBjZWxsXG4gICAgICAuYXR0ciAnY3gnLCAoZCkgLT4gZC5kYXRhLnhcbiAgICAgIC5hdHRyICdjeScsIChkKSAtPiBkLmRhdGEueVxuXG4gIHNldENlbGxWb3Jvbm9pUGF0aDogKGNlbGwpIC0+XG4gICAgY2VsbC5hdHRyICdkJywgKGQpIC0+ICdNJytkLmpvaW4oJ0wnKSsnWidcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEB2b3Jvbm9pLmV4dGVudCBAZ2V0Vm9yb25vaUV4dGVudCgpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jZWxsJykucmVtb3ZlKClcbiAgICBAZHJhd0NlbGxzKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgZDMuc2VsZWN0KCcucGhhcm1hLXRyYW5zZmVycy1jb250YWluZXInKS5zZWxlY3QoJy5sZWdlbmQnKS5zZWxlY3RBbGwoJ2xpJylcbiAgICAgIC5kYXRhIFsyNSw1MCw3NSwgMTAwXVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSA9PiBAY29sb3IgZFxuICAgICAgICAuaHRtbCAoZCkgLT4gZCsnJSdcblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3JNYXAgPSBkMy5zY2FsZVF1YW50aXplKClcbiAgICAgICAgLmRvbWFpbiBbMCwgMTAwXVxuICAgICAgICAucmFuZ2UgWzI1LCA1MCwgNzUsIDEwMF1cbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZVJkWWxHblxuICAgICAgI0Bjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCBkMy5zY2hlbWVSZFlsR25cbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIDBcbiAgICAgIC50aWNrVmFsdWVzIFtdXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAwXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzEwMCwgMF1cblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0Ki41KycpJ1xuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IDE0MFxuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQucGFyZW50Tm9kZSkuc2VsZWN0KCdjaXJjbGUnKVxuICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgIEBzZXRUb29sdGlwRGF0YSBkXG4gICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgIGxlZnQ6ICAgICtlbGVtZW50LmF0dHIoJ2N4JykgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArIEAkZWwub2Zmc2V0KCkubGVmdCAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgIHRvcDogICAgICtlbGVtZW50LmF0dHIoJ2N5JykgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgQCRlbC5vZmZzZXQoKS50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSBlbGVtZW50LmF0dHIoJ3InKSAtIDVcbiAgICAgIG9wYWNpdHk6IDFcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgTWF0aC5yb3VuZChkLmRhdGEudmFsdWUpKyclJ1xuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50b3RhbCdcbiAgICAgIC5odG1sIGQuZGF0YS5zaXplXG4gICAgaWYgZC5kYXRhLnN1YnNpZGlhcmllc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuc3Vic2lkaWFyaWVzJ1xuICAgICAgICAuaHRtbCBkLmRhdGEuc3Vic2lkaWFyaWVzXG4gICAgICBAJHRvb2x0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXIgLnN1YnNpZGlhcmllcy1jb250Jykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgQCR0b29sdGlwLmZpbmQoJy50b29sdGlwLWlubmVyIC5zdWJzaWRpYXJpZXMtY29udCcpLmhpZGUoKVxuIiwiIyBPdGhlciBhcnRpY2xlcyBzaXRlIHNldHVwIChzdXBlcmJ1Z3MsIC4uLilcblxuKCgkKSAtPlxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjIFNldHVwIGljZWJlcmcgZ3JhcGhcbiAgaWYgJCgnI3BoYXJtYS1jYXRlZ29yaWVzLWFtb3VudHMnKS5sZW5ndGggPiAwXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL3BoYXJtYS1jYXRlZ29yaWVzLWFtb3VudHMuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgIyBzZXR1cCBncmFwaFxuICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkljZWJlcmdHcmFwaCgncGhhcm1hLWNhdGVnb3JpZXMtYW1vdW50cycsXG4gICAgICAgIGFzcGVjdFJhdGlvOiAwLjZcbiAgICAgICAgbWFyZ2luOiBcbiAgICAgICAgICB0b3A6IDIwXG4gICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgICAgbGVmdDogMTAwXG4gICAgICAgICAgcmlnaHQ6IDIwXG4gICAgICAgIGxhYmVsOlxuICAgICAgICAgIHk6IFsnRGVjbGFyYWRvJywgJ09jdWx0byddXG4gICAgICAgIGtleTpcbiAgICAgICAgICB4OiAnY2F0ZWdvcnknXG4gICAgICAgICAgdXA6ICdkZWNsYXJlZCdcbiAgICAgICAgICBkb3duOiAnaGlkZGVuJylcbiAgICAgIGdyYXBoLnNldERhdGEgZGF0YVxuICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuXG4gICMgU2V0dXAgZG9jdG9ycyBhdmVyYWdlXG4gIGlmICQoJyNwaGFybWEtZG9jdG9ycy1hdmVyYWdlJykubGVuZ3RoID4gMFxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9waGFybWEtZG9jdG9ycy1hdmVyYWdlLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNvbnNvbGUudGFibGUgZGF0YVxuICAgICAgIyBzZXR1cCBncmFwaFxuICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJhckhvcml6b250YWxQaGFybWFHcmFwaCgncGhhcm1hLWRvY3RvcnMtYXZlcmFnZScsIGRhdGEpXG4gICAgICBcblxuICAjIFNldHVwIGJlZXN3YXJtIGdyYXBoXG4gIGlmICQoJy5waGFybWEtdHJhbnNmZXJzJykubGVuZ3RoID4gMFxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9waGFybWEtdHJhbnNmZXJzLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNhdGVnb3JpZXMgPSBbJ2NoYXJnZXMnLCAndHJhdmVscycsICdmZWVzJywgJ3JlbGF0ZWRzJ11cbiAgICAgICMgZ2V0IG1heGltdW0gbnVtYmVyIG9mIGRvY3RvcnMgcGVyIHBoYXJtYVxuICAgICAgdG90YWxzID0gW11cbiAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCAoY2F0ZWdvcnkpIC0+XG4gICAgICAgIHRvdGFscy5wdXNoIGQzLm1heChkYXRhLCAoZCkgLT4gK2RbY2F0ZWdvcnkrJ19kb2N0b3JzX3RvdGFsJ10pXG4gICAgICB0b3RhbHNNYXggPSBkMy5tYXgodG90YWxzKVxuICAgICAgIyBwb3B1bGF0ZSBzZWxlY3RcbiAgICAgIGRhdGEuZm9yRWFjaCAoZCwgaSkgLT5cbiAgICAgICAgZC5pZCA9IGlcbiAgICAgICAgJCgnI3BoYXJtYS1zZWxlY3RvciBzZWxlY3QnKS5hcHBlbmQgJzxvcHRpb24gdmFsdWU9XCInK2QuaWQrJ1wiPicrZC5sYWJvcmF0b3J5Kyc8L29wdGlvbj4nXG4gICAgICAjIHNldHVwIGEgYmVlc3dhcm0gY2hhcnQgZm9yIGVhY2ggY2F0ZWdvcnlcbiAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCAoY2F0ZWdvcnksIGkpIC0+XG4gICAgICAgIGRhdGFfY2F0ZWdvcnkgPSBkYXRhXG4gICAgICAgICAgIyBmaWx0ZXIgbGluZXMgd2l0aG91dCB2YWx1ZXMgb3Igd2l0aCAwIGRvY3RvcnNcbiAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkW2NhdGVnb3J5KydfZG9jdG9yc19wZXJjZW50J10gIT0gJycgYW5kIGRbY2F0ZWdvcnkrJ19kb2N0b3JzX3RvdGFsJ10gIT0gJydcbiAgICAgICAgICAubWFwIChkKSAtPlxuICAgICAgICAgICAgaWQ6IGQuaWRcbiAgICAgICAgICAgIGxhYm9yYXRvcnk6IGQubGFib3JhdG9yeVxuICAgICAgICAgICAgc3Vic2lkaWFyaWVzOiBkLnN1YnNpZGlhcmllc1xuICAgICAgICAgICAgdmFsdWU6IGRbY2F0ZWdvcnkrJ19kb2N0b3JzX3BlcmNlbnQnXSoxMDBcbiAgICAgICAgICAgIHNpemU6ICtkW2NhdGVnb3J5KydfZG9jdG9yc190b3RhbCddXG4gICAgICAgICAgICBpbXBvcnQ6IE1hdGgucm91bmQoK2RbY2F0ZWdvcnkrJ192YWx1ZSddKVxuICAgICAgICAjIHNldHVwIGdyYXBoXG4gICAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybUdyYXBoKCdwaGFybWEtdHJhbnNmZXJzLScrY2F0ZWdvcnksXG4gICAgICAgICAgbWFyZ2luOlxuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIHJpZ2h0OiAyMFxuICAgICAgICAgIGtleTpcbiAgICAgICAgICAgIGlkOiAnbGFib3JhdG9yeSdcbiAgICAgICAgICAgIHNpemU6ICdzaXplJ1xuICAgICAgICAgICAgY29sb3I6ICd2YWx1ZSdcbiAgICAgICAgICBsZWdlbmQ6IGkgPT0gMClcbiAgICAgICAgZ3JhcGguJHRvb2x0aXAgPSAkKCcjcGhhcm1hLXRyYW5zZmVycy10b29sdGlwJylcbiAgICAgICAgZ3JhcGguZ2V0U2l6ZURvbWFpbiA9IC0+IHJldHVybiBbMCwgdG90YWxzTWF4XVxuICAgICAgICBncmFwaC5zZXREYXRhIGRhdGFfY2F0ZWdvcnlcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSBncmFwaC5vblJlc2l6ZVxuICAgICAgIyBmaWx0ZXIgcGhhcm1hXG4gICAgICAkKCcjcGhhcm1hLXNlbGVjdG9yIHNlbGVjdCcpLmNoYW5nZSAoZSkgLT5cbiAgICAgICAgdmFsdWUgPSAkKGUudGFyZ2V0KS52YWwoKVxuICAgICAgICBpZiB2YWx1ZSA9PSAnLTEnXG4gICAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSkgLT5cbiAgICAgICAgICAgICQoJyNwaGFybWEtdHJhbnNmZXJzLScrY2F0ZWdvcnkrJyAuY2VsbCcpLnJlbW92ZUNsYXNzKCdkZXNhY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2ggKGNhdGVnb3J5KSAtPlxuICAgICAgICAgICAgJCgnI3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSsnIC5jZWxsJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmFkZENsYXNzKCdkZXNhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJyNwaGFybWEtdHJhbnNmZXJzLScrY2F0ZWdvcnkrJyAjY2VsbC0nK3ZhbHVlKS5yZW1vdmVDbGFzcygnZGVzYWN0aXZlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbikgalF1ZXJ5XG4iXX0=
