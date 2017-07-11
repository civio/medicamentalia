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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWdyYXBoLmNvZmZlZSIsImJhci1ob3Jpem9udGFsLXBoYXJtYS1ncmFwaC5jb2ZmZWUiLCJpY2ViZXJnLWdyYXBoLmNvZmZlZSIsImJlZXN3YXJtLWdyYXBoLmNvZmZlZSIsIm1haW4tcGhhcm1hLXBheW1lbnRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BQ0EsSUFB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TyxDQUFDLENBQUQsRUFBSSxTQUFKO1VBQVY7VUFDdEIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxhQUFkO2lCQUNBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQWlCLEtBQUssQ0FBQyxRQUF2QjtRQTFCaUIsQ0FBbkI7ZUE0QkEsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsTUFBN0IsQ0FBb0MsU0FBQyxDQUFEO0FBQ2xDLGNBQUE7VUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQVcsQ0FBQyxHQUFaLENBQUE7VUFDUixJQUFHLEtBQUEsS0FBUyxJQUFaO21CQUNFLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFNBQUMsUUFBRDtxQkFDakIsQ0FBQSxDQUFFLG9CQUFBLEdBQXFCLFFBQXJCLEdBQThCLFFBQWhDLENBQXlDLENBQUMsV0FBMUMsQ0FBc0QsV0FBdEQsQ0FBa0UsQ0FBQyxXQUFuRSxDQUErRSxRQUEvRTtZQURpQixDQUFuQixFQURGO1dBQUEsTUFBQTttQkFJRSxVQUFVLENBQUMsT0FBWCxDQUFtQixTQUFDLFFBQUQ7Y0FDakIsQ0FBQSxDQUFFLG9CQUFBLEdBQXFCLFFBQXJCLEdBQThCLFFBQWhDLENBQXlDLENBQUMsV0FBMUMsQ0FBc0QsUUFBdEQsQ0FBK0QsQ0FBQyxRQUFoRSxDQUF5RSxXQUF6RTtxQkFDQSxDQUFBLENBQUUsb0JBQUEsR0FBcUIsUUFBckIsR0FBOEIsU0FBOUIsR0FBd0MsS0FBMUMsQ0FBZ0QsQ0FBQyxXQUFqRCxDQUE2RCxXQUE3RCxDQUF5RSxDQUFDLFFBQTFFLENBQW1GLFFBQW5GO1lBRmlCLENBQW5CLEVBSkY7O1FBRmtDLENBQXBDO01BeEMyQyxDQUE3QyxFQURGOztFQWxDRCxDQUFELENBQUEsQ0FxRkUsTUFyRkY7QUFBQSIsImZpbGUiOiJwaGFybWEtcGF5bWVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBAc3ZnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFyR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmFyIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAgIC5wYWRkaW5nSW5uZXIoMC4xKVxuICAgICAgLnBhZGRpbmdPdXRlcigwKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBAZGF0YS5tYXAgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGFjdGl2ZScgZWxzZSAnYmFyJ1xuICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhckRpbWVuc2lvbnNcbiAgICBpZiBAb3B0aW9ucy5tb3VzZUV2ZW50c1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAub24gICAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAgICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgICMgZHJhdyBsYWJlbHMgeFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteCcpXG4gICAgICAgIC5kYXRhKEBkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IGlmIGQuYWN0aXZlIHRoZW4gJ2Jhci1sYWJlbC14IGFjdGl2ZScgZWxzZSAnYmFyLWxhYmVsLXgnXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkKSA9PiAnYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgICAgLmF0dHIgJ2R5JywgICAgJzEuMjVlbSdcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ21pZGRsZSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFhEaW1lbnNpb25zXG4gICAgICAgIyBkcmF3IGxhYmVscyB5XG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgICAgLmRhdGEoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyLWxhYmVsLXkgYWN0aXZlJyBlbHNlICdiYXItbGFiZWwteSdcbiAgICAgICAgLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteS0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnbWlkZGxlJ1xuICAgICAgICAudGV4dCAoZCkgPT4gaWYgQG9wdGlvbnMubGFiZWwuZm9ybWF0IHRoZW4gQG9wdGlvbnMubGFiZWwuZm9ybWF0KGRbQG9wdGlvbnMua2V5LnldKSBlbHNlIGRbQG9wdGlvbnMua2V5LnldXG4gICAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgICMgdXBkYXRlIGdyYXBoIGRpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuY2FsbCBAc2V0QmFyRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhci1sYWJlbC15JylcbiAgICAgIC5jYWxsIEBzZXRCYXJMYWJlbFlEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICAgIC5hdHRyICdoZWlnaHQnLCAoZCkgPT4gQGhlaWdodCAtIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEBoZWlnaHRcblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeChkW0BvcHRpb25zLmtleS54XSkgKyBAeC5iYW5kd2lkdGgoKSAqIDAuNVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXgtJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcjYmFyLWxhYmVsLXktJytkW0BvcHRpb25zLmtleS5pZF0pXG4gICAgICAuY2xhc3NlZCAnYWN0aXZlJywgdHJ1ZVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIHVubGVzcyBkLmFjdGl2ZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3QoJyNiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXSlcbiAgICAgICAgLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgICBAY29udGFpbmVyLnNlbGVjdCgnI2Jhci1sYWJlbC15LScrZFtAb3B0aW9ucy5rZXkuaWRdKVxuICAgICAgICAuY2xhc3NlZCAnYWN0aXZlJywgZmFsc2VcbiAgICAiLCJjbGFzcyB3aW5kb3cuQmFySG9yaXpvbnRhbFBoYXJtYUdyYXBoXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgZGF0YSkgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBIb3Jpem9udGFsIFBoYXJtYSBHcmFwaCcsIGlkXG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAc2V0RGF0YSBkYXRhXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIG1heERlY2xhcmVkID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5kZWNsYXJlZFxuICAgIG1heEhpZGRlbiAgID0gZDMubWF4IEBkYXRhLCAoZCkgLT4gZC5oaWRkZW5cbiAgICBAbWF4VmFsdWUgICA9IGQzLm1heCBbbWF4RGVjbGFyZWQsIG1heEhpZGRlbl1cbiAgICByZXR1cm4gQFxuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkLmhpZGRlbiAgID0gK2QuaGlkZGVuXG4gICAgICBkLmRlY2xhcmVkID0gK2QuZGVjbGFyZWRcbiAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIGQzLnNlbGVjdCgnIycrQGlkKS5zZWxlY3RBbGwoJ2RpdicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuY2FsbCBAc2V0QmFyc1xuICAgIHJldHVybiBAXG5cbiAgc2V0QmFyczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLXRpdGxlJ1xuICAgICAgLmh0bWwgKGQpIC0+IGQuY2F0ZWdvcnlcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWRlY2xhcmVkJ1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgPT4gKDEwMCpkLmRlY2xhcmVkL0BtYXhWYWx1ZSkrJyUnXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmh0bWwgKGQpIC0+IGQuZGVjbGFyZWQudG9GaXhlZCgxKSsnIOKCrCdcbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXIgYmFyLWhpZGRlbidcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpID0+ICgxMDAqZC5oaWRkZW4vQG1heFZhbHVlKSsnJSdcbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuaHRtbCAoZCkgLT4gZC5oaWRkZW4udG9GaXhlZCgxKSsnIOKCrCdcbiIsImNsYXNzIHdpbmRvdy5JY2ViZXJnR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFyR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdJY2ViZXJnIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkudXBdID0gK2RbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgZFtAb3B0aW9ucy5rZXkuZG93bl0gPSArZFtAb3B0aW9ucy5rZXkuZG93bl1cbiAgICAgIGQudG90YWwgPSBkW0BvcHRpb25zLmtleS51cF0gKyBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgIHJldHVybiBkYXRhXG5cbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAaGVpZ2h0XVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGQudG90YWwpXVxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIEdldCBtYXggdXAgdmFsdWVcbiAgICBAdXBNYXggPSBkMy5tYXggQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS51cF1cblxuICAgICMgYWRkIGNvbnRhaW5lcnMgdXAgJiBkb3duXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcnMtdXAnXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcnMtZG93bidcblxuICAgICMgZHJhdyBiYXJzIHVwXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5iYXJzLXVwJykuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGJhci11cCBhY3RpdmUnIGVsc2UgJ2JhciBiYXItdXAnXG4gICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuXG4gICAgIyBkcmF3IGJhcnMgZG93blxuICAgIEBjb250YWluZXIuc2VsZWN0KCcuYmFycy1kb3duJykuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gaWYgZC5hY3RpdmUgdGhlbiAnYmFyIGJhci1kb3duIGFjdGl2ZScgZWxzZSAnYmFyIGJhci1kb3duJ1xuICAgICAgIy5hdHRyICdpZCcsICAgIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXRCYXJEb3duRGltZW5zaW9uc1xuXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCAgQG9uTW91c2VPdXRcblxuICAgIGlmIEBvcHRpb25zLmxhYmVsXG4gICAgICAjIGRyYXcgbGFiZWxzIHhcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWxhYmVsLXgnKVxuICAgICAgICAuZGF0YShAZGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiBpZiBkLmFjdGl2ZSB0aGVuICdiYXItbGFiZWwteCBhY3RpdmUnIGVsc2UgJ2Jhci1sYWJlbC14J1xuICAgICAgICAjLmF0dHIgJ2lkJywgICAgKGQpID0+ICdiYXItbGFiZWwteC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgICAuYXR0ciAnZHknLCAgICAnLTAuNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgICAgLmNhbGwgQHNldEJhckxhYmVsWERpbWVuc2lvbnNcbiAgICAgICMgZHJhdyBsYWJlbHMgeVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItbGFiZWwteScpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLmxhYmVsLnkpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWxhYmVsLXknXG4gICAgICAgIC5hdHRyICdpZCcsICAgIChkLGkpIC0+IGlmIGkgPT0gMCB0aGVuICdiYXItbGFiZWwteS11cCcgZWxzZSAnYmFyLWxhYmVsLXktZG93bidcbiAgICAgICAgLmF0dHIgJ2R5JywgICAgKGQsaSkgLT4gaWYgaSA9PSAwIHRoZW4gJy0uNWVtJyBlbHNlICcxLjI1ZW0nXG4gICAgICAgIC5hdHRyICd4JywgICAgIC1Ab3B0aW9ucy5tYXJnaW4ubGVmdFxuICAgICAgICAudGV4dCAoZCkgPT4gZFxuICAgICAgICAuY2FsbCBAc2V0QmFyTGFiZWxZRGltZW5zaW9uc1xuICAgICAgIyBkcmF3IG1pZGRsZSBsaW5lXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICAnbWlkZGxlLWxpbmUnXG4gICAgICAgIC5hdHRyICd4JywgICAgICAtQG9wdGlvbnMubWFyZ2luLmxlZnRcbiAgICAgICAgLmF0dHIgJ3knLCAgICAgIChkKSA9PiBAeSBAdXBNYXhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDFcbiAgICAgICAgLmNhbGwgQHNldE1pZGRsZUxpbmVQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBncmFwaCBkaW1lbnNpb25zXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXItdXAnKVxuICAgICAgLmNhbGwgQHNldEJhclVwRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyLWRvd24nKVxuICAgICAgLmNhbGwgQHNldEJhckRvd25EaW1lbnNpb25zXG4gICAgaWYgQG9wdGlvbnMubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0KCcubWlkZGxlLWxpbmUnKVxuICAgICAgICAuY2FsbCBAc2V0TWlkZGxlTGluZVBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBzZXRCYXJEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICByZXR1cm5cblxuICBzZXRCYXJVcERpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgICAgICAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICd5JywgICAgICAoZCkgPT4gQHkgQHVwTWF4LWRbQG9wdGlvbnMua2V5LnVwXVxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS51cF1cbiAgICAgIC5hdHRyICd3aWR0aCcsICBAeC5iYW5kd2lkdGgoKVxuXG4gIHNldEJhckRvd25EaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsICAgICAgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS5kb3duXVxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB4LmJhbmR3aWR0aCgpXG5cbiAgc2V0QmFyTGFiZWxYRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gQHgoZFtAb3B0aW9ucy5rZXkueF0pICsgQHguYmFuZHdpZHRoKCkgKiAwLjVcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IEB5IEB1cE1heC1kW0BvcHRpb25zLmtleS51cF1cblxuICBzZXRCYXJMYWJlbFlEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3knLCAoZCkgPT4gQHkgQHVwTWF4XG5cbiAgc2V0TWlkZGxlTGluZVBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneScsICAgICAgKGQpID0+IEB5IEB1cE1heFxuICAgICAgLmF0dHIgJ3dpZHRoJywgIEB3aWR0aCtAb3B0aW9ucy5tYXJnaW4ubGVmdCtAb3B0aW9ucy5tYXJnaW4ucmlnaHRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQG9uTW91c2VNb3ZlKGQpXG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsIDFcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgQCRlbC5vZmZzZXQoKS5sZWZ0ICsgcG9zaXRpb25bMF0gKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEAkdG9vbHRpcC53aWR0aCgpKjAuNVxuICAgICAgdG9wOiAgICAgQCRlbC5vZmZzZXQoKS50b3AgKyBwb3NpdGlvblsxXSAtIEAkdG9vbHRpcC5oZWlnaHQoKVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAwXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQuY2F0ZWdvcnlcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuZGVjbGFyZWQnXG4gICAgICAuaHRtbCAoZC5kZWNsYXJlZCouMDAwMDAxKS50b0ZpeGVkKDEpXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmhpZGRlbidcbiAgICAgIC5odG1sIChkLmhpZGRlbiouMDAwMDAxKS50b0ZpeGVkKDEpXG4iLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1HcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgIyBjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgQHZvcm9ub2kgPSBkMy52b3Jvbm9pKClcbiAgICAgIC5leHRlbnQgQGdldFZvcm9ub2lFeHRlbnQoKVxuICAgICAgLnggKGQpIC0+IGQueFxuICAgICAgLnkgKGQpIC0+IGQueVxuXG4gICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2NlbGxzJ1xuXG4gICAgQGRyYXdDZWxscygpXG5cblxuICBkcmF3Q2VsbHM6IC0+XG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5jZWxscycpXG4gICAgICAuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLmRhdGEgQHZvcm9ub2kucG9seWdvbnMoQGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnY2VsbCdcbiAgICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjZWxsLScrZC5kYXRhLmlkXG4gICAgICAgIC5jYWxsIEBzZXRDZWxsXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jZWxsJykuc2VsZWN0KCdwYXRoJylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG5cbiAgc2V0Q2VsbDogKGNlbGwpID0+XG4gICAgY2VsbC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAncicsICAoZCkgPT4gaWYgQHNpemUgdGhlbiBkLmRhdGEucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIEBjb2xvck1hcChkLmRhdGFbQG9wdGlvbnMua2V5LmNvbG9yXSlcbiAgICAgIC5jYWxsIEBzZXRDZWxsUG9zaXRpb25cbiAgICBjZWxsLmFwcGVuZCgncGF0aCcpLmNhbGwgQHNldENlbGxWb3Jvbm9pUGF0aFxuXG4gIHNldFNpbXVsYXRpb246IC0+XG4gICAgIyBzZXR1cCBzaW11bGF0aW9uXG4gICAgZm9yY2VYID0gZDMuZm9yY2VYIChkKSA9PiByZXR1cm4gQHgoZC52YWx1ZSlcbiAgICBmb3JjZVguc3RyZW5ndGgoMSlcbiAgICBAc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbihAZGF0YSlcbiAgICAgIC5mb3JjZSAneCcsIGZvcmNlWFxuICAgICAgLmZvcmNlICd5JywgZDMuZm9yY2VZKEBoZWlnaHQqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAxMjBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgZ2V0Vm9yb25vaUV4dGVudDogLT5cbiAgICByZXR1cm4gW1stQG9wdGlvbnMubWFyZ2luLmxlZnQtMSwgLUBvcHRpb25zLm1hcmdpbi50b3AtMV0sIFtAd2lkdGgrQG9wdGlvbnMubWFyZ2luLnJpZ2h0KzEsIEBoZWlnaHQrQG9wdGlvbnMubWFyZ2luLnRvcCsxXV1cblxuICBzZXRDZWxsUG9zaXRpb246IChjZWxsKSAtPlxuICAgIGNlbGxcbiAgICAgIC5hdHRyICdjeCcsIChkKSAtPiBkLmRhdGEueFxuICAgICAgLmF0dHIgJ2N5JywgKGQpIC0+IGQuZGF0YS55XG5cbiAgc2V0Q2VsbFZvcm9ub2lQYXRoOiAoY2VsbCkgLT5cbiAgICBjZWxsLmF0dHIgJ2QnLCAoZCkgLT4gJ00nK2Quam9pbignTCcpKydaJ1xuXG4gIHNldFNpemU6IC0+XG4gICAgaWYgQHNpemVcbiAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgIGQucmFkaXVzID0gQHNpemUgZFtAb3B0aW9ucy5rZXkuc2l6ZV1cblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG4gICAgQHZvcm9ub2kuZXh0ZW50IEBnZXRWb3Jvbm9pRXh0ZW50KClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNlbGwnKS5yZW1vdmUoKVxuICAgIEBkcmF3Q2VsbHMoKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBkMy5zZWxlY3QoJy5waGFybWEtdHJhbnNmZXJzLWNvbnRhaW5lcicpLnNlbGVjdCgnLmxlZ2VuZCcpLnNlbGVjdEFsbCgnbGknKVxuICAgICAgLmRhdGEgWzI1LDUwLDc1LCAxMDBdXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLnN0eWxlICdiYWNrZ3JvdW5kJywgKGQpID0+IEBjb2xvciBkXG4gICAgICAgIC5odG1sIChkKSAtPiBkKyclJ1xuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICAjIEVxdWl2YWxlbnQgdG8gZDMuc2NhbGVTcXJ0KClcbiAgICAgICPCoGh0dHBzOi8vYmwub2Nrcy5vcmcvZDNpbmRlcHRoLzc3NWNmNDMxZTY0YjY3MTg0ODFjMDZmYzQ1ZGMzNGY5XG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yTWFwID0gZDMuc2NhbGVRdWFudGl6ZSgpXG4gICAgICAgIC5kb21haW4gWzAsIDEwMF1cbiAgICAgICAgLnJhbmdlIFsyNSwgNTAsIDc1LCAxMDBdXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVSZFlsR25cbiAgICAgICNAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwgZDMuc2NoZW1lUmRZbEduXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSAwXG4gICAgICAudGlja1ZhbHVlcyBbXVxuICAgIHJldHVybiBAXG4gICAgXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIDEwMF1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFsxMDAsIDBdXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCouNSsnKSdcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSAxNDBcbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyBtb3VzZSBldmVudHNcbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIGVsZW1lbnQgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLnNlbGVjdCgnY2lyY2xlJylcbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBAc2V0VG9vbHRpcERhdGEgZFxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICBsZWZ0OiAgICArZWxlbWVudC5hdHRyKCdjeCcpICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyBAJGVsLm9mZnNldCgpLmxlZnQgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICB0b3A6ICAgICArZWxlbWVudC5hdHRyKCdjeScpICsgQG9wdGlvbnMubWFyZ2luLnRvcCArIEAkZWwub2Zmc2V0KCkudG9wIC0gQCR0b29sdGlwLmhlaWdodCgpIC0gZWxlbWVudC5hdHRyKCdyJykgLSA1XG4gICAgICBvcGFjaXR5OiAxXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIE1hdGgucm91bmQoZC5kYXRhLnZhbHVlKSsnJSdcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudG90YWwnXG4gICAgICAuaHRtbCBkLmRhdGEuc2l6ZVxuICAgIGlmIGQuZGF0YS5zdWJzaWRpYXJpZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnN1YnNpZGlhcmllcydcbiAgICAgICAgLmh0bWwgZC5kYXRhLnN1YnNpZGlhcmllc1xuICAgICAgQCR0b29sdGlwLmZpbmQoJy50b29sdGlwLWlubmVyIC5zdWJzaWRpYXJpZXMtY29udCcpLnNob3coKVxuICAgIGVsc2VcbiAgICAgIEAkdG9vbHRpcC5maW5kKCcudG9vbHRpcC1pbm5lciAuc3Vic2lkaWFyaWVzLWNvbnQnKS5oaWRlKClcbiIsIiMgT3RoZXIgYXJ0aWNsZXMgc2l0ZSBzZXR1cCAoc3VwZXJidWdzLCAuLi4pXG5cbigoJCkgLT5cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgIyBTZXR1cCBpY2ViZXJnIGdyYXBoXG4gIGlmICQoJyNwaGFybWEtY2F0ZWdvcmllcy1hbW91bnRzJykubGVuZ3RoID4gMFxuICAgIGQzLmNzdiBiYXNldXJsKycvZGF0YS9waGFybWEtY2F0ZWdvcmllcy1hbW91bnRzLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgICMgc2V0dXAgZ3JhcGhcbiAgICAgIGdyYXBoID0gbmV3IHdpbmRvdy5JY2ViZXJnR3JhcGgoJ3BoYXJtYS1jYXRlZ29yaWVzLWFtb3VudHMnLFxuICAgICAgICBhc3BlY3RSYXRpbzogMC42XG4gICAgICAgIG1hcmdpbjogXG4gICAgICAgICAgdG9wOiAyMFxuICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgIGxlZnQ6IDEwMFxuICAgICAgICAgIHJpZ2h0OiAyMFxuICAgICAgICBsYWJlbDpcbiAgICAgICAgICB5OiBbJ0RlY2xhcmFkbycsICdPY3VsdG8nXVxuICAgICAgICBrZXk6XG4gICAgICAgICAgeDogJ2NhdGVnb3J5J1xuICAgICAgICAgIHVwOiAnZGVjbGFyZWQnXG4gICAgICAgICAgZG93bjogJ2hpZGRlbicpXG4gICAgICBncmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICQod2luZG93KS5yZXNpemUgZ3JhcGgub25SZXNpemVcblxuICAjIFNldHVwIGRvY3RvcnMgYXZlcmFnZVxuICBpZiAkKCcjcGhhcm1hLWRvY3RvcnMtYXZlcmFnZScpLmxlbmd0aCA+IDBcbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvcGhhcm1hLWRvY3RvcnMtYXZlcmFnZS5jc3YnLCAoZXJyb3IsIGRhdGEpIC0+XG4gICAgICAjIHNldHVwIGdyYXBoXG4gICAgICBncmFwaCA9IG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbFBoYXJtYUdyYXBoKCdwaGFybWEtZG9jdG9ycy1hdmVyYWdlJywgZGF0YSlcbiAgICAgIFxuXG4gICMgU2V0dXAgYmVlc3dhcm0gZ3JhcGhcbiAgaWYgJCgnLnBoYXJtYS10cmFuc2ZlcnMnKS5sZW5ndGggPiAwXG4gICAgZDMuY3N2IGJhc2V1cmwrJy9kYXRhL3BoYXJtYS10cmFuc2ZlcnMuY3N2JywgKGVycm9yLCBkYXRhKSAtPlxuICAgICAgY2F0ZWdvcmllcyA9IFsnY2hhcmdlcycsICd0cmF2ZWxzJywgJ2ZlZXMnLCAncmVsYXRlZHMnXVxuICAgICAgIyBnZXQgbWF4aW11bSBudW1iZXIgb2YgZG9jdG9ycyBwZXIgcGhhcm1hXG4gICAgICB0b3RhbHMgPSBbXVxuICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSkgLT5cbiAgICAgICAgdG90YWxzLnB1c2ggZDMubWF4KGRhdGEsIChkKSAtPiArZFtjYXRlZ29yeSsnX2RvY3RvcnNfdG90YWwnXSlcbiAgICAgIHRvdGFsc01heCA9IGQzLm1heCh0b3RhbHMpXG4gICAgICAjIHBvcHVsYXRlIHNlbGVjdFxuICAgICAgZGF0YS5mb3JFYWNoIChkLCBpKSAtPlxuICAgICAgICBkLmlkID0gaVxuICAgICAgICAkKCcjcGhhcm1hLXNlbGVjdG9yIHNlbGVjdCcpLmFwcGVuZCAnPG9wdGlvbiB2YWx1ZT1cIicrZC5pZCsnXCI+JytkLmxhYm9yYXRvcnkrJzwvb3B0aW9uPidcbiAgICAgICMgc2V0dXAgYSBiZWVzd2FybSBjaGFydCBmb3IgZWFjaCBjYXRlZ29yeVxuICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoIChjYXRlZ29yeSwgaSkgLT5cbiAgICAgICAgZGF0YV9jYXRlZ29yeSA9IGRhdGFcbiAgICAgICAgICAjIGZpbHRlciBsaW5lcyB3aXRob3V0IHZhbHVlcyBvciB3aXRoIDAgZG9jdG9yc1xuICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGRbY2F0ZWdvcnkrJ19kb2N0b3JzX3BlcmNlbnQnXSAhPSAnJyBhbmQgZFtjYXRlZ29yeSsnX2RvY3RvcnNfdG90YWwnXSAhPSAnJ1xuICAgICAgICAgIC5tYXAgKGQpIC0+XG4gICAgICAgICAgICBpZDogZC5pZFxuICAgICAgICAgICAgbGFib3JhdG9yeTogZC5sYWJvcmF0b3J5XG4gICAgICAgICAgICBzdWJzaWRpYXJpZXM6IGQuc3Vic2lkaWFyaWVzXG4gICAgICAgICAgICB2YWx1ZTogZFtjYXRlZ29yeSsnX2RvY3RvcnNfcGVyY2VudCddKjEwMFxuICAgICAgICAgICAgc2l6ZTogK2RbY2F0ZWdvcnkrJ19kb2N0b3JzX3RvdGFsJ11cbiAgICAgICAgICAgIGltcG9ydDogTWF0aC5yb3VuZCgrZFtjYXRlZ29yeSsnX3ZhbHVlJ10pXG4gICAgICAgICMgc2V0dXAgZ3JhcGhcbiAgICAgICAgZ3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtR3JhcGgoJ3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSxcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgcmlnaHQ6IDIwXG4gICAgICAgICAga2V5OlxuICAgICAgICAgICAgaWQ6ICdsYWJvcmF0b3J5J1xuICAgICAgICAgICAgc2l6ZTogJ3NpemUnXG4gICAgICAgICAgICBjb2xvcjogJ3ZhbHVlJ1xuICAgICAgICAgIGxlZ2VuZDogaSA9PSAwKVxuICAgICAgICBncmFwaC4kdG9vbHRpcCA9ICQoJyNwaGFybWEtdHJhbnNmZXJzLXRvb2x0aXAnKVxuICAgICAgICBncmFwaC5nZXRTaXplRG9tYWluID0gLT4gcmV0dXJuIFswLCB0b3RhbHNNYXhdXG4gICAgICAgIGdyYXBoLnNldERhdGEgZGF0YV9jYXRlZ29yeVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIGdyYXBoLm9uUmVzaXplXG4gICAgICAjIGZpbHRlciBwaGFybWFcbiAgICAgICQoJyNwaGFybWEtc2VsZWN0b3Igc2VsZWN0JykuY2hhbmdlIChlKSAtPlxuICAgICAgICB2YWx1ZSA9ICQoZS50YXJnZXQpLnZhbCgpXG4gICAgICAgIGlmIHZhbHVlID09ICctMSdcbiAgICAgICAgICBjYXRlZ29yaWVzLmZvckVhY2ggKGNhdGVnb3J5KSAtPlxuICAgICAgICAgICAgJCgnI3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSsnIC5jZWxsJykucmVtb3ZlQ2xhc3MoJ2Rlc2FjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCAoY2F0ZWdvcnkpIC0+XG4gICAgICAgICAgICAkKCcjcGhhcm1hLXRyYW5zZmVycy0nK2NhdGVnb3J5KycgLmNlbGwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJykuYWRkQ2xhc3MoJ2Rlc2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnI3BoYXJtYS10cmFuc2ZlcnMtJytjYXRlZ29yeSsnICNjZWxsLScrdmFsdWUpLnJlbW92ZUNsYXNzKCdkZXNhY3RpdmUnKS5hZGRDbGFzcygnYWN0aXZlJylcblxuKSBqUXVlcnlcbiJdfQ==
