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
      this.setTooltipData = bind(this.setTooltipData, this);
      this.onMouseOut = bind(this.onMouseOut, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.onMouseOver = bind(this.onMouseOver, this);
      this.setMiddleLinePosition = bind(this.setMiddleLinePosition, this);
      this.setBarLabelYDimensions = bind(this.setBarLabelYDimensions, this);
      this.setBarLabelXDimensions = bind(this.setBarLabelXDimensions, this);
      this.setBarDownDimensions = bind(this.setBarDownDimensions, this);
      this.setBarUpDimensions = bind(this.setBarUpDimensions, this);
      this.setBarDimensions = bind(this.setBarDimensions, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      IcebergGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    IcebergGraph.prototype.setSVG = function() {
      IcebergGraph.__super__.setSVG.call(this);
      return this.$tooltip = this.$el.find('.tooltip');
    };

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
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d.total;
          };
        })(this))
      ];
    };

    IcebergGraph.prototype.drawGraph = function() {
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
      if (this.$tooltip) {
        this.container.selectAll('.bar').on('mouseover', this.onMouseOver).on('mousemove', this.onMouseMove).on('mouseout', this.onMouseOut);
      }
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
      this.setTooltipData(d);
      this.onMouseMove(d);
      return this.$tooltip.css('opacity', 1);
    };

    IcebergGraph.prototype.onMouseMove = function(d) {
      var position;
      position = d3.mouse(d3.event.target);
      return this.$tooltip.css({
        left: this.$el.offset().left + position[0] + this.options.margin.left - this.$tooltip.width() * 0.5,
        top: this.$el.offset().top + position[1] - this.$tooltip.height()
      });
    };

    IcebergGraph.prototype.onMouseOut = function(d) {
      return this.$tooltip.css('opacity', 0);
    };

    IcebergGraph.prototype.setTooltipData = function(d) {
      this.$tooltip.find('.tooltip-inner .title').html(d.category);
      this.$tooltip.find('.tooltip-inner .declared').html((d.declared * .000001).toFixed(1));
      return this.$tooltip.find('.tooltip-inner .hidden').html((d.hidden * .000001).toFixed(1));
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
      options.dotSize = options.dotSize || 5;
      options.dotMinSize = options.dotMinSize || 2;
      options.dotMaxSize = options.dotMaxSize || 15;
      this.annotations = [];
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
      this.drawCells();
      if (this.annotations.length > 0) {
        return this.setAnnotations();
      }
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
      if (this.annotations.length > 0) {
        this.setAnnotations();
      }
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

    BeeswarmGraph.prototype.addAnnotation = function(annotation) {
      return this.annotations.push(annotation);
    };

    BeeswarmGraph.prototype.setAnnotations = function() {
      var ringNote;
      this.annotations.forEach((function(_this) {
        return function(d) {
          return d.cx = d.cx_ratio * _this.width;
        };
      })(this));
      ringNote = d3.ringNote();
      return this.container.call(ringNote, this.annotations);
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
        return graph = new window.BarHorizontalPharmaGraph('pharma-doctors-average', data);
      });
    }
    if ($('.pharma-transfers').length > 0) {
      return d3.csv(baseurl + '/data/pharma-transfers.csv', function(error, data) {
        var annotations, categories, totals, totalsMax;
        categories = ['charges', 'travels', 'fees', 'relateds'];
        annotations = {
          travels: {
            cx_ratio: 0.88,
            cy: 70,
            r: 80,
            textWidth: 220,
            textOffset: [-85, -80],
            text: 'Las principales firmas se encuentran en la zona de mayor opacidad'
          },
          fees: {
            cx_ratio: 0.032,
            cy: 70,
            r: 22,
            textWidth: 200,
            textOffset: [60, 55],
            text: 'GSK es el laboratorio que más nombres de médicos publica'
          }
        };
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
          if (annotations[category]) {
            graph.addAnnotation(annotations[category]);
          }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImJhci1ob3Jpem9udGFsLXBoYXJtYS1ncmFwaC5jb2ZmZWUiLCJpY2ViZXJnLWdyYXBoLmNvZmZlZSIsImJlZXN3YXJtLWdyYXBoLmNvZmZlZSIsIm1haW4tZmFybWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQVA7TUFDWixJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsT0FB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bGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBAc3ZnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFyR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmFyIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMC4xKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAZGF0YS5tYXAgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGFjdGl2ZScgZWxzZSAnYmFyJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgICMgZHJhdyBsYWJlbHMgeFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC14IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXgnXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJzEuMjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgICAgIyBkcmF3IGxhYmVscyB5XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXkgYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteSdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gaWYgQG9wdGlvbnMubGFiZWwuZm9ybWF0IHRoZW4gQG9wdGlvbnMubGFiZWwuZm9ybWF0KGRbQG9wdGlvbnMua2V5LnldKSBlbHNlIGRbQG9wdGlvbnMua2V5LnldXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgPT4gQGhlaWdodCAtIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEBoZWlnaHRcblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHVubGVzcyBkLmFjdGl2ZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAiLCJjbGFzcyB3aW5kb3cuQmFySG9yaXpvbnRhbFBoYXJtYUdyYXBoXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgZGF0YSkgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBIb3Jpem9udGFsIFBoYXJtYSBHcmFwaCcsIGlkXG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAc2V0RGF0YSBkYXRhXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIG1heERlY2xhcmVkID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5kZWNsYXJlZFxuICAgIG1heEhpZGRlbiAgID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5oaWRkZW5cbiAgICBAbWF4VmFsdWUgICA9IGQzLm1heCBbbWF4RGVjbGFyZWQsIG1heEhpZGRlbl1cbiAgICByZXR1cm4gQFxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLmhpZGRlbiAgID0gK2QuaGlkZGVuXG4gICAgICBkLmRlY2xhcmVkID0gK2QuZGVjbGFyZWRcbiAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIGQzLnNlbGVjdCgnIycrQGlkKS5zZWxlY3RBbGwoJ2RpdicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuY2FsbCBAc2V0QmFyc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLXRpdGxlJ1xuICAgICAgLmh0bWwgKGQpIC0+IGQuY2F0ZWdvcnlcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWRlY2xhcmVkJ1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgPT4gKDEwMCpkLmRlY2xhcmVkL0BtYXhWYWx1ZSkrJyUnXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmh0bWwgKGQpIC0+IGQuZGVjbGFyZWQudG9GaXhlZCgxKSsnIOKCrCdcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWhpZGRlbidcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpID0+ICgxMDAqZC5oaWRkZW4vQG1heFZhbHVlKSsnJSdcbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuaHRtbCAoZCkgLT4gZC5oaWRkZW4udG9GaXhlZCgxKSsnIOKCrCdcbiIsImNsYXNzIHdpbmRvdy5JY2ViZXJnR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFyR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdJY2ViZXJnIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkudXBdID0gK2RbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgZFtAb3B0aW9ucy5rZXkuZG93bl0gPSArZFtAb3B0aW9ucy5rZXkuZG93bl1cbiAgICAgIGQudG90YWwgPSBkW0BvcHRpb25zLmtleS51cF0gKyBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgIHJldHVybiBkYXRhXG5cbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAaGVpZ2h0XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGQudG90YWwpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIEdldCBtYXggdXAgdmFsdWVcbiAgICBAdXBNYXggPSBkMy5tYXggQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS51cF1cblxuICAgICMgYWRkIGNvbnRhaW5lcnMgdXAgJiBkb3duXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcnMtdXAnXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcnMtZG93bidcblxuICAgICMgZHJhdyBiYXJzIHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5iYXJzLXVwJykuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGJhci11cCBhY3RpdmUnIGVsc2UgJ2JhciBiYXItdXAnXG4gICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuXG4gICAgIyBkcmF3IGJhcnMgZG93blxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuYmFycy1kb3duJykuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGJhci1kb3duIGFjdGl2ZScgZWxzZSAnYmFyIGJhci1kb3duJ1xuICAgICAgIy5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEb3duRGltZW5zaW9uc1xuXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcblxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLmxhYmVsLnkpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkLGkpIC0+IGlmIGkgPT0gMCB0aGVuICdiYXItbGFiZWwteS11cCcgZWxzZSAnYmFyLWxhYmVsLXktZG93bidcbiAgICAgICAgLmF0dHIgJ2R5JywgICAgKGQsaSkgLT4gaWYgaSA9PSAwIHRoZW4gJy0uNWVtJyBlbHNlICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd4JywgICAgIC1Ab3B0aW9ucy5tYXJnaW4ubGVmdFxuICAgICAgICAudGV4dCAoZCkgPT4gZFxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgICAgIyBkcmF3IG1pZGRsZSBsaW5lXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICAnbWlkZGxlLWxpbmUnXG4gICAgICAgIC5hdHRyICd4JywgICAgICAtQG9wdGlvbnMubWFyZ2luLmxlZnRcbiAgICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeSBAdXBNYXhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDFcbiAgICAgICAgLmNhbGwgQHNldE1pZGRsZUxpbmVQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItdXAnKVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWRvd24nKVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcubWlkZGxlLWxpbmUnKVxuICAgICAgICAuY2FsbCBAc2V0TWlkZGxlTGluZVBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICByZXR1cm5cblxuICBzZXRCYXJVcERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkgQHVwTWF4LWRbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckRvd25EaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IEB1cE1heC1kW0BvcHRpb25zLmtleS51cF1cblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCAoZCkgPT4gQHkgQHVwTWF4XG5cbiAgc2V0TWlkZGxlTGluZVBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB3aWR0aCtAb3B0aW9ucy5tYXJnaW4ubGVmdCtAb3B0aW9ucy5tYXJnaW4ucmlnaHRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQG9uTW91c2VNb3ZlKGQpXG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsIDFcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgQCRlbC5vZmZzZXQoKS5sZWZ0ICsgcG9zaXRpb25bMF0gKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEAkdG9vbHRpcC53aWR0aCgpKjAuNVxuICAgICAgdG9wOiAgICAgQCRlbC5vZmZzZXQoKS50b3AgKyBwb3NpdGlvblsxXSAtIEAkdG9vbHRpcC5oZWlnaHQoKVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAwXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQuY2F0ZWdvcnlcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuZGVjbGFyZWQnXG4gICAgICAuaHRtbCAoZC5kZWNsYXJlZCouMDAwMDAxKS50b0ZpeGVkKDEpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmhpZGRlbidcbiAgICAgIC5odG1sIChkLmhpZGRlbiouMDAwMDAxKS50b0ZpeGVkKDEpXG4iLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1HcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBAYW5ub3RhdGlvbnMgPSBbXVxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZHJhd0dyYXBoOiAtPlxuXG4gICAgQHNldFNpemUoKVxuXG4gICAgIyBzZXQgJiBydW4gc2ltdWxhdGlvblxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG5cbiAgICBAdm9yb25vaSA9IGQzLnZvcm9ub2koKVxuICAgICAgLmV4dGVudCBAZ2V0Vm9yb25vaUV4dGVudCgpXG4gICAgICAueCAoZCkgLT4gZC54XG4gICAgICAueSAoZCkgLT4gZC55XG5cbiAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnY2VsbHMnXG5cbiAgICBAZHJhd0NlbGxzKClcblxuICAgIGlmIEBhbm5vdGF0aW9ucy5sZW5ndGggPiAwXG4gICAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG4gIGRyYXdDZWxsczogLT5cbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLmNlbGxzJylcbiAgICAgIC5zZWxlY3RBbGwoJ2cnKVxuICAgICAgICAuZGF0YSBAdm9yb25vaS5wb2x5Z29ucyhAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdjZWxsJ1xuICAgICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NlbGwtJytkLmRhdGEuaWRcbiAgICAgICAgLmNhbGwgQHNldENlbGxcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNlbGwnKS5zZWxlY3QoJ3BhdGgnKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcblxuICBzZXRDZWxsOiAoY2VsbCkgPT5cbiAgICBjZWxsLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQuZGF0YS5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgQGNvbG9yTWFwKGQuZGF0YVtAb3B0aW9ucy5rZXkuY29sb3JdKVxuICAgICAgLmNhbGwgQHNldENlbGxQb3NpdGlvblxuICAgIGNlbGwuYXBwZW5kKCdwYXRoJykuY2FsbCBAc2V0Q2VsbFZvcm9ub2lQYXRoXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVggPSBkMy5mb3JjZVggKGQpID0+IHJldHVybiBAeChkLnZhbHVlKVxuICAgIGZvcmNlWC5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VYXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVkoQGhlaWdodCouNSlcbiAgICAgIC5mb3JjZSAnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgoZCkgPT4gcmV0dXJuIGlmIEBzaXplIHRoZW4gZC5yYWRpdXMrMSBlbHNlIEBvcHRpb25zLmRvdFNpemUrMSlcbiAgICAgIC5zdG9wKClcblxuICBydW5TaW11bGF0aW9uOiAtPlxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IDEyMFxuICAgICAgQHNpbXVsYXRpb24udGljaygpXG4gICAgICArK2lcblxuICBnZXRWb3Jvbm9pRXh0ZW50OiAtPlxuICAgIHJldHVybiBbWy1Ab3B0aW9ucy5tYXJnaW4ubGVmdC0xLCAtQG9wdGlvbnMubWFyZ2luLnRvcC0xXSwgW0B3aWR0aCtAb3B0aW9ucy5tYXJnaW4ucmlnaHQrMSwgQGhlaWdodCtAb3B0aW9ucy5tYXJnaW4udG9wKzFdXVxuXG4gIHNldENlbGxQb3NpdGlvbjogKGNlbGwpIC0+XG4gICAgY2VsbFxuICAgICAgLmF0dHIgJ2N4JywgKGQpIC0+IGQuZGF0YS54XG4gICAgICAuYXR0ciAnY3knLCAoZCkgLT4gZC5kYXRhLnlcblxuICBzZXRDZWxsVm9yb25vaVBhdGg6IChjZWxsKSAtPlxuICAgIGNlbGwuYXR0ciAnZCcsIChkKSAtPiAnTScrZC5qb2luKCdMJykrJ1onXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAdm9yb25vaS5leHRlbnQgQGdldFZvcm9ub2lFeHRlbnQoKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY2VsbCcpLnJlbW92ZSgpXG4gICAgQGRyYXdDZWxscygpXG4gICAgaWYgQGFubm90YXRpb25zLmxlbmd0aCA+IDBcbiAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGQzLnNlbGVjdCgnLnBoYXJtYS10cmFuc2ZlcnMtY29udGFpbmVyJykuc2VsZWN0KCcubGVnZW5kJykuc2VsZWN0QWxsKCdsaScpXG4gICAgICAuZGF0YSBbMjUsNTAsNzUsIDEwMF1cbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICAgICAgLmh0bWwgKGQpIC0+IGQrJyUnXG5cbiAgYWRkQW5ub3RhdGlvbjogKGFubm90YXRpb24pIC0+XG4gICAgQGFubm90YXRpb25zLnB1c2ggYW5ub3RhdGlvblxuXG4gIHNldEFubm90YXRpb25zOiAtPlxuICAgIEBhbm5vdGF0aW9ucy5mb3JFYWNoIChkKSA9PlxuICAgICAgZC5jeCA9IGQuY3hfcmF0aW8gKiBAd2lkdGhcbiAgICByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICBAY29udGFpbmVyLmNhbGwgcmluZ05vdGUsIEBhbm5vdGF0aW9uc1xuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICAjIEVxdWl2YWxlbnQgdG8gZDMuc2NhbGVTcXJ0KClcbiAgICAgICPCoGh0dHBzOi8vYmwub2Nrcy5vcmcvZDNpbmRlcHRoLzc3NWNmNDMxZTY0YjY3MTg0ODFjMDZmYzQ1ZGMzNGY5XG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yTWFwID0gZDMuc2NhbGVRdWFudGl6ZSgpXG4gICAgICAgIC5kb21haW4gWzAsIDEwMF1cbiAgICAgICAgLnJhbmdlIFsyNSwgNTAsIDc1LCAxMDBdXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVSZFlsR25cbiAgICAgICNAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwgZDMuc2NoZW1lUmRZbEduXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSAwXG4gICAgICAudGlja1ZhbHVlcyBbXVxuICAgIHJldHVybiBAXG4gICAgXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDEwMF1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFsxMDAsIDBdXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCouNSsnKSdcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSAxNDBcbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLnNlbGVjdCgnY2lyY2xlJylcbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBAc2V0VG9vbHRpcERhdGEgZFxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICBsZWZ0OiAgICArZWxlbWVudC5hdHRyKCdjeCcpICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyBAJGVsLm9mZnNldCgpLmxlZnQgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICB0b3A6ICAgICArZWxlbWVudC5hdHRyKCdjeScpICsgQG9wdGlvbnMubWFyZ2luLnRvcCArIEAkZWwub2Zmc2V0KCkudG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gZWxlbWVudC5hdHRyKCdyJykgLSA1XG4gICAgICBvcGFjaXR5OiAxXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIE1hdGgucm91bmQoZC5kYXRhLnZhbHVlKSsnJSdcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudG90YWwnXG4gICAgICAuaHRtbCBkLmRhdGEuc2l6ZVxuICAgIGlmIGQuZGF0YS5zdWJzaWRpYXJpZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnN1YnNpZGlhcmllcydcbiAgICAgICAgLmh0bWwgZC5kYXRhLnN1YnNpZGlhcmllc1xuICAgICAgQCR0b29sdGlwLmZpbmQoJy50b29sdGlwLWlubmVyIC5zdWJzaWRpYXJpZXMtY29udCcpLnNob3coKVxuICAgIGVsc2VcbiAgICAgIEAkdG9vbHRpcC5maW5kKCcudG9vbHRpcC1pbm5lciAuc3Vic2lkaWFyaWVzLWNvbnQnKS5oaWRlKClcbiIsIiMgT3RoZXIgYXJ0aWNsZXMgc2l0ZSBzZXR1cCAoc3VwZXJidWdzLCAuLi4pXG5cbigoJCkgLT5cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgIyBTZXR1cCBpY2ViZXJnIGdyYXBoXG4gIGlmICQoJyNwaGFybWEtY2F0ZWdvcmllcy1hbW91bnRzJykubGVuZ3RoID4gMFxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9waGFybWEtY2F0ZWdvcmllcy1hbW91bnRzLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgICMgc2V0dXAgZ3JhcGhcbiAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5JY2ViZXJnR3JhcGgoJ3BoYXJtYS1jYXRlZ29yaWVzLWFtb3VudHMnLFxuICAgICAgICBhc3BlY3RSYXRpbzogMC42XG4gICAgICAgIG1hcmdpbjogXG4gICAgICAgICAgdG9wOiAyMFxuICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgIGxlZnQ6IDEwMFxuICAgICAgICAgIHJpZ2h0OiAyMFxuICAgICAgICBsYWJlbDpcbiAgICAgICAgICB5OiBbJ0RlY2xhcmFkbycsICdPY3VsdG8nXVxuICAgICAgICBrZXk6XG4gICAgICAgICAgeDogJ2NhdGVnb3J5J1xuICAgICAgICAgIHVwOiAnZGVjbGFyZWQnXG4gICAgICAgICAgZG93bjogJ2hpZGRlbicpXG4gICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFNldHVwIGRvY3RvcnMgYXZlcmFnZVxuICBpZiAkKCcjcGhhcm1hLWRvY3RvcnMtYXZlcmFnZScpLmxlbmd0aCA+IDBcbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvcGhhcm1hLWRvY3RvcnMtYXZlcmFnZS5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIHNldHVwIGdyYXBoXG4gICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbFBoYXJtYUdyYXBoKCdwaGFybWEtZG9jdG9ycy1hdmVyYWdlJywgZGF0YSlcbiAgICAgIFxuXG4gICMgU2V0dXAgYmVlc3dhcm0gZ3JhcGhcbiAgaWYgJCgnLnBoYXJtYS10cmFuc2ZlcnMnKS5sZW5ndGggPiAwXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL3BoYXJtYS10cmFuc2ZlcnMuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgY2F0ZWdvcmllcyA9IFsnY2hhcmdlcycsICd0cmF2ZWxzJywgJ2ZlZXMnLCAncmVsYXRlZHMnXVxuICAgICAgIyBzZXQgYW5ub3RhdGlvbnNcbiAgICAgIGFubm90YXRpb25zID1cbiAgICAgICAgdHJhdmVsczpcbiAgICAgICAgICBjeF9yYXRpbzogMC44OFxuICAgICAgICAgIGN5OiA3MFxuICAgICAgICAgIHI6IDgwXG4gICAgICAgICAgdGV4dFdpZHRoOiAyMjBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTg1LCAtODBdXG4gICAgICAgICAgdGV4dDogJ0xhcyBwcmluY2lwYWxlcyBmaXJtYXMgc2UgZW5jdWVudHJhbiBlbiBsYSB6b25hIGRlIG1heW9yIG9wYWNpZGFkJ1xuICAgICAgICBmZWVzOlxuICAgICAgICAgIGN4X3JhdGlvOiAwLjAzMlxuICAgICAgICAgIGN5OiA3MFxuICAgICAgICAgIHI6IDIyXG4gICAgICAgICAgdGV4dFdpZHRoOiAyMDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbNjAsIDU1XVxuICAgICAgICAgIHRleHQ6ICdHU0sgZXMgZWwgbGFib3JhdG9yaW8gcXVlIG3DoXMgbm9tYnJlcyBkZSBtw6lkaWNvcyBwdWJsaWNhJ1xuICAgICAgIyBnZXQgbWF4aW11bSBudW1iZXIgb2YgZG9jdG9ycyBwZXIgcGhhcm1hXG4gICAgICB0b3RhbHMgPSBbXVxuICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSkgLT5cbiAgICAgICAgdG90YWxzLnB1c2ggZDMubWF4KGRhdGEsIChkKSAtPiArZFtjYXRlZ29yeSsnX2RvY3RvcnNfdG90YWwnXSlcbiAgICAgIHRvdGFsc01heCA9IGQzLm1heCh0b3RhbHMpXG4gICAgICAjIHBvcHVsYXRlIHNlbGVjdFxuICAgICAgZGF0YS5mb3JFYWNoIChkLCBpKSAtPlxuICAgICAgICBkLmlkID0gaVxuICAgICAgICAkKCcjcGhhcm1hLXNlbGVjdG9yIHNlbGVjdCcpLmFwcGVuZCAnPG9wdGlvbiB2YWx1ZT1cIicrZC5pZCsnXCI+JytkLmxhYm9yYXRvcnkrJzwvb3B0aW9uPidcbiAgICAgICMgc2V0dXAgYSBiZWVzd2FybSBjaGFydCBmb3IgZWFjaCBjYXRlZ29yeVxuICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSwgaSkgLT5cbiAgICAgICAgZGF0YV9jYXRlZ29yeSA9IGRhdGFcbiAgICAgICAgICAjIGZpbHRlciBsaW5lcyB3aXRob3V0IHZhbHVlcyBvciB3aXRoIDAgZG9jdG9yc1xuICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGRbY2F0ZWdvcnkrJ19kb2N0b3JzX3BlcmNlbnQnXSAhPSAnJyBhbmQgZFtjYXRlZ29yeSsnX2RvY3RvcnNfdG90YWwnXSAhPSAnJ1xuICAgICAgICAgIC5tYXAgKGQpIC0+XG4gICAgICAgICAgICBpZDogZC5pZFxuICAgICAgICAgICAgbGFib3JhdG9yeTogZC5sYWJvcmF0b3J5XG4gICAgICAgICAgICBzdWJzaWRpYXJpZXM6IGQuc3Vic2lkaWFyaWVzXG4gICAgICAgICAgICB2YWx1ZTogZFtjYXRlZ29yeSsnX2RvY3RvcnNfcGVyY2VudCddKjEwMFxuICAgICAgICAgICAgc2l6ZTogK2RbY2F0ZWdvcnkrJ19kb2N0b3JzX3RvdGFsJ11cbiAgICAgICAgICAgIGltcG9ydDogTWF0aC5yb3VuZCgrZFtjYXRlZ29yeSsnX3ZhbHVlJ10pXG4gICAgICAgICMgc2V0dXAgZ3JhcGhcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtR3JhcGgoJ3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSxcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgcmlnaHQ6IDIwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgaWQ6ICdsYWJvcmF0b3J5J1xuICAgICAgICAgICAgc2l6ZTogJ3NpemUnXG4gICAgICAgICAgICBjb2xvcjogJ3ZhbHVlJ1xuICAgICAgICAgIGxlZ2VuZDogaSA9PSAwKVxuICAgICAgICBncmFwaC4kdG9vbHRpcCA9ICQoJyNwaGFybWEtdHJhbnNmZXJzLXRvb2x0aXAnKVxuICAgICAgICBncmFwaC5nZXRTaXplRG9tYWluID0gLT4gcmV0dXJuIFswLCB0b3RhbHNNYXhdXG4gICAgICAgIGlmIGFubm90YXRpb25zW2NhdGVnb3J5XVxuICAgICAgICAgIGdyYXBoLmFkZEFubm90YXRpb24gYW5ub3RhdGlvbnNbY2F0ZWdvcnldXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YV9jYXRlZ29yeVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4gICAgICAjIGZpbHRlciBwaGFybWFcbiAgICAgICQoJyNwaGFybWEtc2VsZWN0b3Igc2VsZWN0JykuY2hhbmdlIChlKSAtPlxuICAgICAgICB2YWx1ZSA9ICQoZS50YXJnZXQpLnZhbCgpXG4gICAgICAgIGlmIHZhbHVlID09ICctMSdcbiAgICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2ggKGNhdGVnb3J5KSAtPlxuICAgICAgICAgICAgJCgnI3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSsnIC5jZWxsJykucmVtb3ZlQ2xhc3MoJ2Rlc2FjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCAoY2F0ZWdvcnkpIC0+XG4gICAgICAgICAgICAkKCcjcGhhcm1hLXRyYW5zZmVycy0nK2NhdGVnb3J5KycgLmNlbGwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJykuYWRkQ2xhc3MoJ2Rlc2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnI3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSsnICNjZWxsLScrdmFsdWUpLnJlbW92ZUNsYXNzKCdkZXNhY3RpdmUnKS5hZGRDbGFzcygnYWN0aXZlJylcblxuKSBqUXVlcnlcbiJdfQ==
