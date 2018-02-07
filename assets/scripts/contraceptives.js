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

  window.BarHorizontalGraph = (function(superClass) {
    extend(BarHorizontalGraph, superClass);

    function BarHorizontalGraph(id, options) {
      this.setBars = bind(this.setBars, this);
      options.xAxis = options.xAxis || [25, 50, 75, 100];
      BarHorizontalGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BarHorizontalGraph.prototype.setSVG = function() {
      return this.container = d3.select('#' + this.id).attr('class', 'bar-horizontal-graph');
    };

    BarHorizontalGraph.prototype.dataParser = function(data) {
      data.forEach((function(_this) {
        return function(d) {
          return d[_this.options.key.x] = +d[_this.options.key.x];
        };
      })(this));
      return data;
    };

    BarHorizontalGraph.prototype.setScales = function() {
      return this;
    };

    BarHorizontalGraph.prototype.drawScales = function() {
      if (this.options.xAxis) {
        this.container.selectAll('.axis').data(this.options.xAxis).enter().append('div').attr('class', 'axis').style('left', function(d) {
          return d + '%';
        });
      }
      return this;
    };

    BarHorizontalGraph.prototype.drawGraph = function() {
      console.log('bar horizontal data', this.data);
      this.container.selectAll('.bar').data(this.data).enter().append('div').attr('class', 'bar-container').call(this.setBars);
      return this;
    };

    BarHorizontalGraph.prototype.setBars = function(element) {
      if (this.options.key.id) {
        element.attr('id', (function(_this) {
          return function(d) {
            return d[_this.options.key.id];
          };
        })(this));
        element.append('div').attr('class', 'bar-title').html((function(_this) {
          return function(d) {
            return d[_this.options.key.id];
          };
        })(this));
      }
      return element.append('div').attr('class', 'bar').style('width', (function(_this) {
        return function(d) {
          return d[_this.options.key.x] + '%';
        };
      })(this)).append('span').html((function(_this) {
        return function(d) {
          return Math.round(d[_this.options.key.x]) + '%';
        };
      })(this));
    };

    return BarHorizontalGraph;

  })(window.BaseGraph);

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
      console.log(this.color.domain());
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
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseMapGraph = (function(superClass) {
    var currentState;

    extend(ContraceptivesUseMapGraph, superClass);

    function ContraceptivesUseMapGraph() {
      return ContraceptivesUseMapGraph.__super__.constructor.apply(this, arguments);
    }

    currentState = 0;

    ContraceptivesUseMapGraph.prototype.getDimensions = function() {
      var bodyHeight;
      if (this.$el) {
        bodyHeight = $('body').height();
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
        if (this.containerHeight > bodyHeight) {
          this.containerHeight = bodyHeight;
          this.containerWidth = this.containerHeight / this.options.aspectRatio;
          this.$el.css('top', 0);
        } else {
          this.$el.css('top', (bodyHeight - this.containerHeight) / 2);
        }
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    ContraceptivesUseMapGraph.prototype.setColorDomain = function() {
      this.color.domain([0, 80]);
      return this;
    };


    /*
     * override color scale
    @color = d3.scaleOrdinal d3.schemeCategory20
     * override setCountryColor
    @setCountryColor = (d) ->
      value = @data.filter (e) -> e.code_num == d.id
      if value[0]
        #console.log @color
        console.log value[0].values[0].id, value[0].values[0].name, @color(value[0].values[0].id)
      return if value[0] then @color(value[0].values[0].id) else '#eee'
    #@formatFloat = @formatInteger
    #@getLegendData = -> [0,2,4,6,8]
    @setTooltipData = (d) ->
      @$tooltip
        .find '.tooltip-inner .title'
        .html d.name
      @$tooltip
        .find '.description'
        #.html d.values[0].name+' ('+d.values[0].value+'%)'
        .html d.value+'%'
     */

    ContraceptivesUseMapGraph.prototype.setMapState = function(state) {
      if (state !== this.currentState) {
        this.currentState = state;
        if (state === 1) {
          this.data.forEach(function(d) {
            return d.value = +d['Female sterilization'];
          });
        } else if (state === 2) {
          this.data.forEach(function(d) {
            return d.value = +d['IUD'];
          });
        } else if (state === 3) {
          this.data.forEach(function(d) {
            return d.value = +d['Pill'];
          });
        } else if (state === 4) {
          this.data.forEach(function(d) {
            return d.value = +d['Male condom'];
          });
        } else if (state === 5) {
          this.data.forEach(function(d) {
            return d.value = +d['Injectable'];
          });
        } else if (state === 6) {
          this.data.forEach(function(d) {
            return d.value = +d['Any traditional method'];
          });
        }
        return this.updateGraph(this.data);
      }
    };

    return ContraceptivesUseMapGraph;

  })(window.MapGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.TreemapGraph = (function(superClass) {
    extend(TreemapGraph, superClass);

    function TreemapGraph(id, options) {
      this.isNodeLabelVisible = bind(this.isNodeLabelVisible, this);
      this.setNodeLabel = bind(this.setNodeLabel, this);
      this.setNodeDimensions = bind(this.setNodeDimensions, this);
      this.setNode = bind(this.setNode, this);
      options.minSize = options.minSize || 60;
      options.nodesPadding = options.nodesPadding || 8;
      options.transitionDuration = options.transitionDuration || 600;
      options.mobileBreakpoint = options.mobileBreakpoint || 620;
      TreemapGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    TreemapGraph.prototype.drawScales = function() {
      return this;
    };

    TreemapGraph.prototype.setSVG = function() {
      return this.container = d3.select('#' + this.id).append('div').attr('class', 'nodes-container').style('height', this.height + 'px');
    };

    TreemapGraph.prototype.drawGraph = function() {
      this.treemap = d3.treemap().size([this.width, this.height]).padding(0).round(true);
      if (this.width <= this.options.mobileBreakpoint) {
        this.treemap.tile(d3.treemapSlice);
      }
      this.stratify = d3.stratify().parentId(function(d) {
        return d.parent;
      });
      this.updateGraph();
      return this;
    };

    TreemapGraph.prototype.updateGraph = function() {
      var nodes;
      this.treemapRoot = this.stratify(this.data).sum((function(_this) {
        return function(d) {
          return d[_this.options.key.value];
        };
      })(this)).sort(function(a, b) {
        return b.value - a.value;
      });
      this.treemap(this.treemapRoot);
      nodes = this.container.selectAll('.node').data(this.treemapRoot.leaves());
      this.container.selectAll('.node-label').data(this.treemapRoot.leaves());
      nodes.enter().append('div').attr('class', 'node').append('div').attr('class', 'node-label').append('div').attr('class', 'node-label-content').append('p');
      this.container.selectAll('.node').call(this.setNode).call(this.setNodeDimensions);
      this.container.selectAll('.node-label').style('visibility', 'hidden').call(this.setNodeLabel).filter(this.isNodeLabelVisible).style('visibility', 'visible');
      nodes.exit().remove();
      return this;
    };

    TreemapGraph.prototype.getDimensions = function() {
      TreemapGraph.__super__.getDimensions.call(this);
      if (this.width <= this.options.mobileBreakpoint) {
        this.containerHeight = this.containerWidth;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    TreemapGraph.prototype.updateGraphDimensions = function() {
      TreemapGraph.__super__.updateGraphDimensions.call(this);
      this.container.style('height', this.height + 'px');
      if (this.width <= this.options.mobileBreakpoint) {
        this.treemap.tile(d3.treemapSlice);
      } else {
        this.treemap.tile(d3.treemapSquarify);
      }
      this.treemap.size([this.width, this.height]);
      this.treemap(this.treemapRoot);
      this.container.selectAll('.node').data(this.treemapRoot.leaves()).call(this.setNodeDimensions);
      this.container.selectAll('.node-label').style('visibility', 'hidden').filter(this.isNodeLabelVisible).style('visibility', 'visible');
      return this;
    };

    TreemapGraph.prototype.setNode = function(selection) {
      return selection.attr('class', this.getNodeClass).style('padding', (function(_this) {
        return function(d) {
          if (d.x1 - d.x0 > 2 * _this.options.nodesPadding && d.y1 - d.y0 > 2 * _this.options.nodesPadding) {
            return _this.options.nodesPadding + 'px';
          } else {
            return 0;
          }
        };
      })(this)).style('visibility', function(d) {
        if ((d.x1 - d.x0 === 0) || (d.y1 - d.y0 === 0)) {
          return 'hidden';
        } else {
          return '';
        }
      });
    };

    TreemapGraph.prototype.setNodeDimensions = function(selection) {
      return selection.style('left', function(d) {
        return d.x0 + 'px';
      }).style('top', function(d) {
        return d.y0 + 'px';
      }).style('width', function(d) {
        return d.x1 - d.x0 + 'px';
      }).style('height', function(d) {
        return d.y1 - d.y0 + 'px';
      });
    };

    TreemapGraph.prototype.setNodeLabel = function(selection) {
      return selection.select('p').attr('class', function(d) {
        if (d.value > 25) {
          return 'size-l';
        } else if (d.value < 10) {
          return 'size-s';
        } else {
          return '';
        }
      }).html((function(_this) {
        return function(d) {
          return d.data[_this.options.key.id];
        };
      })(this));
    };

    TreemapGraph.prototype.isNodeLabelVisible = function(d) {
      return d.x1 - d.x0 > this.options.minSize && d.y1 - d.y0 > this.options.minSize;
    };

    TreemapGraph.prototype.getNodeClass = function(d) {
      return 'node';
    };

    return TreemapGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseTreemapGraph = (function(superClass) {
    extend(ContraceptivesUseTreemapGraph, superClass);

    function ContraceptivesUseTreemapGraph() {
      return ContraceptivesUseTreemapGraph.__super__.constructor.apply(this, arguments);
    }

    ContraceptivesUseTreemapGraph.prototype.dataParser = function(data, country_code, country_name) {
      var data_country, key, method, methods, parsedData, parsedDataSorted;
      parsedData = [
        {
          id: 'r'
        }
      ];

      /* merge Vaginal barrier methods, Lactational amenorrhea method & Emergency contraception in Other modern methods
      getKeyValue = (key, data) ->
        if key != 'other-modern-methods'
          return data[key]
        else
          return data[key]+merge_keys.reduce((sum, value) -> sum+data[value])
       */
      data_country = data.filter(function(d) {
        return d.code === country_code;
      });
      console.log(data_country[0]);
      if (data_country[0]) {
        methods = {};
        this.options.methodsKeys.forEach((function(_this) {
          return function(key, i) {
            if (data_country[0][key]) {
              return methods[key] = {
                id: key.toLowerCase().replace(/ /g, '-').replace(')', '').replace('(', ''),
                name: _this.options.methodsNames[i],
                value: +data_country[0][key]
              };
            } else {
              return console.log("There's no data for " + key);
            }
          };
        })(this));
        console.log(methods);
        for (key in methods) {
          method = methods[key];
          if (key !== 'Other modern methods' && key !== 'Any traditional method' && method.value < 5) {
            methods['Other modern methods'].value += method.value;
            delete methods[key];
          }
        }
        for (key in methods) {
          method = methods[key];
          parsedData.push({
            id: method.id,
            raw_name: method.name,
            name: '<strong>' + method.name + '</strong><br/>' + Math.round(method.value) + '%',
            value: method.value,
            parent: 'r'
          });
        }
        parsedDataSorted = parsedData.sort(function(a, b) {
          if (a.value && b.value) {
            return b.value - a.value;
          } else {
            return 1;
          }
        });
        $('#treemap-contraceptives-use-country').html(country_name);
        $('#treemap-contraceptives-use-any-method').html(Math.round(data_country[0]['Any modern method']));
        $('#treemap-contraceptives-use-method').html(parsedDataSorted[0].raw_name);
      }
      return parsedData;
    };

    ContraceptivesUseTreemapGraph.prototype.setData = function(data, country_code, country_name) {
      this.originalData = data;
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.drawGraph();
      this.$el.trigger('draw-complete');
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.updateData = function(country_code, country_name) {
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.updateGraph();
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.getNodeClass = function(d) {
      return 'node node-' + d.id;
    };


    /* overdrive resize
    onResize: =>
      super()
      @setContainerOffset()
      return @
    
    setContainerOffset: ->
      @$el.css('top', ($(window).height()-@$el.height())*0.5)
     */

    return ContraceptivesUseTreemapGraph;

  })(window.TreemapGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.BeeswarmScatterplotGraph = (function(superClass) {
    extend(BeeswarmScatterplotGraph, superClass);

    function BeeswarmScatterplotGraph(id, options) {
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getSizeDomain = bind(this.getSizeDomain, this);
      this.getSizeRange = bind(this.getSizeRange, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.setDotFill = bind(this.setDotFill, this);
      this.setDotPosition = bind(this.setDotPosition, this);
      this.setDot = bind(this.setDot, this);
      options.dotSize = options.dotSize || 5;
      options.dotMinSize = options.dotMinSize || 2;
      options.dotMaxSize = options.dotMaxSize || 15;
      options.mode = options.mode || 0;
      BeeswarmScatterplotGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BeeswarmScatterplotGraph.prototype.drawGraph = function() {
      this.setSize();
      this.setSimulation();
      this.runSimulation();
      return this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).call(this.setDot).on('mouseover', (function(_this) {
        return function(d) {
          return console.log(d);
        };
      })(this));
    };

    BeeswarmScatterplotGraph.prototype.setDot = function(selection) {
      return selection.attr('r', (function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius;
          } else {
            return _this.options.dotSize;
          }
        };
      })(this)).call(this.setDotFill).call(this.setDotPosition);
    };

    BeeswarmScatterplotGraph.prototype.setSimulation = function() {
      var forceY;
      forceY = d3.forceY((function(_this) {
        return function(d) {
          return _this.y(d[_this.options.key.y]);
        };
      })(this));
      forceY.strength(1);
      return this.simulation = d3.forceSimulation(this.data).force('x', forceY).force('y', d3.forceX(this.width * .5)).force('collide', d3.forceCollide((function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius + 1;
          } else {
            return _this.options.dotSize + 1;
          }
        };
      })(this))).stop();
    };

    BeeswarmScatterplotGraph.prototype.runSimulation = function() {
      var i, results;
      i = 0;
      results = [];
      while (i < 350) {
        this.simulation.tick();
        results.push(++i);
      }
      return results;
    };

    BeeswarmScatterplotGraph.prototype.setDotPosition = function(selection) {
      return selection.attr('cx', (function(_this) {
        return function(d) {
          if (_this.options.mode === 0) {
            return d.x;
          } else {
            return Math.round(_this.x(d[_this.options.key.x]));
          }
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          if (_this.options.mode === 0) {
            return d.y;
          } else {
            return Math.round(_this.y(d[_this.options.key.y]));
          }
        };
      })(this));
    };

    BeeswarmScatterplotGraph.prototype.setDotFill = function(selection) {
      return selection.attr('fill', (function(_this) {
        return function(d) {
          if (_this.options.key.color && _this.options.mode === 1) {
            return _this.color(d[_this.options.key.color]);
          } else {
            return '#e2723b';
          }
        };
      })(this));
    };

    BeeswarmScatterplotGraph.prototype.setMode = function(mode) {
      this.options.mode = mode;
      return this.container.selectAll('.dot').call(this.setDotFill).call(this.setDotPosition);
    };

    BeeswarmScatterplotGraph.prototype.setSize = function() {
      if (this.size) {
        return this.data.forEach((function(_this) {
          return function(d) {
            return d.radius = _this.size(d[_this.options.key.size]);
          };
        })(this));
      }
    };

    BeeswarmScatterplotGraph.prototype.updateGraphDimensions = function() {
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
      BeeswarmScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.setSimulation();
      this.runSimulation();
      this.container.selectAll('.dot').call(this.setDotPosition);
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(0.125).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      if (this.options.key.color) {
        this.color = d3.scaleThreshold().range(d3.schemeOranges[5].reverse());
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width);
      return this;
    };

    BeeswarmScatterplotGraph.prototype.getScaleXDomain = function() {
      return [200, 85000];
    };

    BeeswarmScatterplotGraph.prototype.getScaleYDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.y];
          };
        })(this))
      ];
    };

    BeeswarmScatterplotGraph.prototype.getSizeRange = function() {
      return [this.options.dotMinSize, this.options.dotMaxSize];
    };

    BeeswarmScatterplotGraph.prototype.getSizeDomain = function() {
      return [
        0, d3.max(this.data, (function(_this) {
          return function(d) {
            return d[_this.options.key.size];
          };
        })(this))
      ];
    };

    BeeswarmScatterplotGraph.prototype.getColorDomain = function() {
      return [1005, 3955, 12235, 100000];
    };

    BeeswarmScatterplotGraph.prototype.drawScales = function() {
      this.x.domain(this.getScaleXDomain());
      this.y.domain(this.getScaleYDomain());
      if (this.size) {
        this.size.domain(this.getSizeDomain());
      }
      if (this.color) {
        this.color.domain(this.getColorDomain());
      }
      return this;
    };

    BeeswarmScatterplotGraph.prototype.getDimensions = function() {
      if (this.$el) {
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    return BeeswarmScatterplotGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  (function($) {
    var baseurl, lang, methods_icons, methods_keys, methods_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupContraceptivesApp, setupContraceptivesReasons, setupScrollama, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
    useTreemap = null;
    useMap = null;
    useGraph = null;
    unmetneedsGraph = null;
    userCountry = {};
    scrollamaInitialized = false;
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
    if (lang === 'es') {
      d3.formatDefaultLocale({
        "currency": ["$", ""],
        "decimal": ",",
        "thousands": ".",
        "grouping": [3]
      });
    }
    methods_keys = ["Female sterilization", "Male sterilization", "IUD", "Implant", "Injectable", "Pill", "Male condom", "Female condom", "Vaginal barrier methods", "Lactational amenorrhea method (LAM)", "Emergency contraception", "Other modern methods", "Any traditional method"];
    methods_names = {
      'es': ["Esterilización femenina", "Esterilización masculina", "DIU", "Implante", "Inyectable", "Píldora", "Condón masculino", "Condón femenino", "Métodos de barrera vaginal", "Método de la amenorrea de la lactancia (MELA)", "Anticonceptivos de emergencia", "Otros métodos modernos", "Métodos tradicionales"],
      'en': ["Female sterilization", "Male sterilization", "IUD", "Implant", "Injectable", "Pill", "Male condom", "Female condom", "Vaginal barrier methods", "Lactational amenorrhea method (LAM)", "Emergency contraception", "Other modern methods", "Traditional methods"]
    };
    methods_icons = {
      "Female sterilization": 'sterilization',
      "Male sterilization": 'sterilization',
      "IUD": 'diu',
      "Implant": null,
      "Injectable": 'injectable',
      "Pill": 'pill',
      "Male condom": 'condom',
      "Female condom": null,
      "Vaginal barrier methods": null,
      "Lactational amenorrhea method (LAM)": null,
      "Emergency contraception": null,
      "Other modern methods": null,
      "Any traditional method": 'traditional'
    };
    reasons_names = {
      "a": "not married",
      "b": "not having sex",
      "c": "infrequent sex",
      "d": "menopausal/hysterectomy",
      "e": "subfecund/infecund",
      "f": "postpartum amenorrheic",
      "g": "breastfeeding",
      "h": "fatalistic",
      "i": "respondent opposed",
      "j": "husband/partner opposed",
      "k": "others opposed",
      "l": "religious prohibition",
      "m": "knows no method",
      "n": "knows no source",
      "o": "health concerns",
      "p": "fear of side effects/health concerns",
      "q": "lack of access/too far",
      "r": "costs too much",
      "s": "inconvenient to use",
      "t": "interferes with bodys processes",
      "u": "preferred method not available",
      "v": "no method available",
      "w": "(no estándar)",
      "x": "other",
      "z": "don't know"
    };
    setupScrollama = function(id) {
      var chart, container, graphic, handleContainerEnter, handleContainerExit, handleResize, handleStepEnter, scroller, steps, text;
      container = d3.select('#' + id);
      graphic = container.select('.scroll-graphic');
      chart = graphic.select('.graph-container');
      text = container.select('.scroll-text');
      steps = text.selectAll('.step');
      scroller = scrollama();
      handleResize = function() {
        var height, width;
        width = graphic.node().getBoundingClientRect().width;
        height = Math.floor(window.innerHeight);
        steps.style('height', height + 'px');
        graphic.style('height', height + 'px');
        chart.style('width', width + 'px').style('height', height + 'px');
        return scroller.resize();
      };
      handleContainerEnter = function(e) {
        return graphic.classed('is-fixed', true).classed('is-bottom', false);
      };
      handleContainerExit = function(e) {
        return graphic.classed('is-fixed', false).classed('is-bottom', e.direction === 'down');
      };
      handleStepEnter = function(e) {
        var $step, data, from, instance, step, to;
        $step = $(e.element);
        instance = $step.data('instance');
        step = $step.data('step');
        if (instance === 0) {
          console.log('scrollama 0', step);
          if (useTreemap) {
            if (step === 1) {
              return useTreemap.updateData('world', 'Mundo');
            } else if (step === 0 && e.direction === 'up') {
              return useTreemap.updateData(userCountry.code, userCountry.name);
            }
          }
        } else if (instance === 1) {
          if (useMap) {
            console.log('scrollama 1', step);
            return useMap.setMapState(step);
          }
        } else if (instance === 2) {
          if (useGraph && step > 0) {
            data = [63, 88, 100];
            from = step > 1 ? data[step - 2] : 0;
            to = data[step - 1];
            useGraph.selectAll('li').filter(function(d) {
              return d >= from && d < to;
            }).classed('fill-' + step, e.direction === 'down');
            return console.log('scrollama 2', step);
          }
        } else if (instance === 3) {
          if (unmetneedsGraph && unmetneedsGraph.options.mode !== step) {
            return unmetneedsGraph.setMode(step);
          }
        }
      };
      handleResize();
      scroller.setup({
        container: '#' + id,
        graphic: '.scroll-graphic',
        text: '.scroll-text',
        step: '.scroll-text .step',
        offset: 0.05,
        debug: false
      }).onContainerEnter(handleContainerEnter).onContainerExit(handleContainerExit);
      if (!scrollamaInitialized) {
        scrollamaInitialized = true;
        scroller.onStepEnter(handleStepEnter);
      }
      return window.addEventListener('resize', handleResize);
    };
    setupConstraceptivesUseGraph = function() {
      var dataIndex, graphWidth, j, resizeHandler, results;
      setupScrollama('contraceptives-use-graph-container');
      graphWidth = 0;
      useGraph = d3.select('#contraceptives-use-graph');
      dataIndex = (function() {
        results = [];
        for (j = 0; j <= 99; j++){ results.push(j); }
        return results;
      }).apply(this);
      useGraph.append('ul').selectAll('li').data(dataIndex).enter().append('li').append('svg').append('use').attr('xlink:href', '#icon-woman').attr('viewBox', '0 0 193 450');
      resizeHandler = function() {
        var itemsHeight, itemsWidth;
        if (graphWidth !== useGraph.node().offsetWidth) {
          graphWidth = useGraph.node().offsetWidth;
          itemsWidth = (graphWidth / 20) - 10;
          itemsHeight = 2.33 * itemsWidth;
          useGraph.selectAll('li').style('width', itemsWidth + 'px').style('height', itemsHeight + 'px');
          useGraph.selectAll('svg').attr('width', itemsWidth).attr('height', itemsHeight);
        }
        return useGraph.style('margin-top', (($('body').height() - useGraph.node().offsetHeight) * .5) + 'px');
      };
      window.addEventListener('resize', resizeHandler);
      return resizeHandler();
    };
    setupUnmetNeedsGdpGraph = function(data_unmetneeds, countries_gni, countries_population) {
      var data;
      setupScrollama('unmet-needs-gdp-container-graph');
      data = [];
      data_unmetneeds.forEach(function(d) {
        var country_gni, country_pop;
        country_gni = countries_gni.filter(function(e) {
          return e.code === d.code;
        });
        country_pop = countries_population.filter(function(e) {
          return e.code === d.code;
        });
        if (country_gni[0] && country_gni[0]['2016']) {
          return data.push({
            value: +d['2017'],
            name: country_gni[0].name,
            region: country_gni[0].region,
            population: country_pop[0]['2015'],
            gni: country_gni[0]['2016']
          });
        } else {
          return console.log('No GNI or Population data for this country', d.code, country_gni[0]);
        }
      });

      /*
      unmetNeedsGdpGraph = new window.ScatterplotUnmetNeedsGraph 'unmet-needs-gdp-graph',
        aspectRatio: 0.5625
        margin:
          left:   0
          rigth:  0
          top:    0
          bottom: 0
        key:
          x: 'gni'
          y: 'value'
          id: 'name'
          color: 'gni' #'region'
          size: 'population'
       * set data
       */
      unmetneedsGraph = new window.BeeswarmScatterplotGraph('unmet-needs-gdp-graph', {
        margin: {
          left: 0,
          rigth: 0,
          top: 5,
          bottom: 0
        },
        key: {
          x: 'gni',
          y: 'value',
          id: 'name',
          size: 'population',
          color: 'gni'
        },
        dotMinSize: 1,
        dotMaxSize: 12
      });
      unmetneedsGraph.setData(data);
      return $(window).resize(unmetneedsGraph.onResize);
    };
    setupConstraceptivesMaps = function(data_use, countries, map) {
      setupScrollama('contraceptives-use-container');
      data_use.forEach(function(d) {
        var item;
        item = countries.filter(function(country) {
          return country.code === d.code;
        });

        /*
        d['Rhythm']                    = +d['Rhythm']
        d['Withdrawal']                = +d['Withdrawal']
        d['Other traditional methods'] = +d['Other traditional methods']
        d['Traditional methods'] = d['Rhythm']+d['Withdrawal']+d['Other traditional methods']
        console.log d.code, d['Rhythm'], d['Withdrawal'], d['Other traditional methods'], d['Traditional methods']
        delete d['Rhythm']
        delete d['Withdrawal']
        delete d['Other traditional methods']
         */
        d.values = [];
        d.value = 0;
        methods_keys.forEach(function(key, i) {
          return d.values.push({
            id: i,
            name: methods_names[lang][i],
            value: d[key] !== '' ? +d[key] : null
          });
        });
        if (item && item[0]) {
          d.name = item[0]['name_' + lang];
          return d.code_num = item[0]['code_num'];
        } else {
          return console.log('no country', d.code);
        }
      });
      useMap = new window.ContraceptivesUseMapGraph('map-contraceptives-use', {
        aspectRatio: 0.5625,
        margin: {
          top: 0,
          bottom: 0
        },
        legend: false
      });
      useMap.setData(data_use, map);
      useMap.onResize();
      return $(window).resize(useMap.onResize);
    };
    setupContraceptivesReasons = function(data_reasons, countries) {
      var reasonHealth, reasonNotSex, reasonOpposed, reasonOpposedHusband, reasonOpposedReligious, reasonOpposedRespondent, reasonsKeys, sortArray;
      reasonHealth = [];
      reasonNotSex = [];
      reasonOpposed = [];
      reasonOpposedRespondent = [];
      reasonOpposedHusband = [];
      reasonOpposedReligious = [];
      reasonsKeys = Object.keys(reasons_names);
      data_reasons.forEach(function(d) {

        /*
        reasonsKeys.forEach (reason) ->
          d[reason] = +d[reason]
          if d[reason] > 100
            console.log 'Alert! Value greater than zero. ' + d.country + ', ' + reason + ': ' + d[reason]
         */
        reasonHealth.push({
          name: d.name,
          value: d.o + d.p + d.t
        });
        reasonNotSex.push({
          name: d.name,
          value: d.b
        });
        reasonOpposed.push({
          name: d.name,
          value: d.i + d.j + d.k + d.l
        });
        reasonOpposedRespondent.push({
          name: d.name,
          value: d.i
        });
        reasonOpposedHusband.push({
          name: d.name,
          value: d.j
        });
        return reasonOpposedReligious.push({
          name: d.name,
          value: d.l
        });
      });
      sortArray = function(a, b) {
        return b.value - a.value;
      };
      reasonHealth.sort(sortArray);
      reasonNotSex.sort(sortArray);
      reasonOpposed.sort(sortArray);
      reasonOpposedRespondent.sort(sortArray);
      reasonOpposedHusband.sort(sortArray);
      reasonOpposedReligious.sort(sortArray);
      new window.BarHorizontalGraph('contraceptives-reasons-health', {
        key: {
          id: 'name',
          x: 'value'
        }
      }).setData(reasonHealth.slice(0, 5));
      new window.BarHorizontalGraph('contraceptives-reasons-opposed', {
        key: {
          id: 'name',
          x: 'value'
        }
      }).setData(reasonOpposed.slice(0, 5));
      new window.BarHorizontalGraph('contraceptives-reasons-not-sex', {
        key: {
          id: 'name',
          x: 'value'
        }
      }).setData(reasonNotSex.slice(0, 5));
      new window.BarHorizontalGraph('contraceptives-reasons-opposed-respondent', {
        key: {
          id: 'name',
          x: 'value'
        },
        xAxis: [50, 100]
      }).setData(reasonOpposedRespondent.slice(0, 5));
      new window.BarHorizontalGraph('contraceptives-reasons-opposed-husband', {
        key: {
          id: 'name',
          x: 'value'
        },
        xAxis: [50, 100]
      }).setData(reasonOpposedHusband.slice(0, 5));
      return new window.BarHorizontalGraph('contraceptives-reasons-opposed-religious', {
        key: {
          id: 'name',
          x: 'value'
        },
        xAxis: [50, 100]
      }).setData(reasonOpposedReligious.slice(0, 5));
    };
    setupConstraceptivesUseTreemap = function(data_use) {
      setupScrollama('treemap-contraceptives-use-container');
      useTreemap = new window.ContraceptivesUseTreemapGraph('treemap-contraceptives-use', {
        aspectRatio: 0.5625,
        margin: {
          left: 0,
          rigth: 0,
          top: 0,
          bottom: 0
        },
        key: {
          value: 'value',
          id: 'name'
        },
        methodsKeys: methods_keys,
        methodsNames: methods_names[lang]
      });
      useTreemap.setData(data_use, userCountry.code, userCountry.name);
      return $(window).resize(useTreemap.onResize);
    };
    setupContraceptivesApp = function(data_use, data_unmetneeds, data_reasons) {
      return $('#contraceptives-app .select-country').change(function() {
        var country_code, country_methods, data_reasons_country, data_unmetneeds_country, data_use_country, reasons;
        country_code = $(this).val();
        console.log('change', country_code);
        data_use_country = data_use.filter(function(d) {
          return d.code === country_code;
        });
        if (data_use_country && data_use_country[0]) {
          country_methods = methods_keys.map(function(key, i) {
            return {
              'name': methods_names[lang][i],
              'value': +data_use_country[0][key]
            };
          });
          country_methods = country_methods.sort(function(a, b) {
            return b.value - a.value;
          });
          $('#contraceptives-app-data-use').html(Math.round(+data_use_country[0]['Any modern method']) + '%');
          $('#contraceptives-app-data-main-method').html(country_methods[0].name);
          $('#contraceptives-app-data-main-method-value').html(Math.round(country_methods[0].value) + '%');
          $('#contraceptives-app-use').show();
        } else {
          $('#contraceptives-app-use').hide();
        }
        data_unmetneeds_country = data_unmetneeds.filter(function(d) {
          return d.code === country_code;
        });
        if (data_unmetneeds_country && data_unmetneeds_country[0]) {
          $('#contraceptives-app-data-unmetneeds').html(Math.round(+data_unmetneeds_country[0]['2017']) + '%');
          $('#contraceptives-app-unmetneeds').show();
        } else {
          $('#contraceptives-app-unmetneeds').hide();
        }
        data_reasons_country = data_reasons.filter(function(d) {
          return d.code === country_code;
        });
        if (data_reasons_country && data_reasons_country[0]) {
          reasons = Object.keys(reasons_names).map(function(reason) {
            return {
              'name': reasons_names[reason],
              'value': +data_reasons_country[0][reason]
            };
          });
          reasons = reasons.sort(function(a, b) {
            return b.value - a.value;
          });
          $('#contraceptives-app-data-reason').html(reasons[0].name);
          $('#contraceptives-app-data-reason-value').html(Math.round(reasons[0].value) + '%');
          return $('#contraceptives-app-reason').show();
        } else {
          return $('#contraceptives-app-reason').hide();
        }
      }).val(userCountry.code).trigger('change');
    };
    if ($('#contraceptives-use-graph').length > 0) {
      setupConstraceptivesUseGraph();
    }
    return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.csv, baseurl + '/data/countries-gni-' + lang + '.csv').defer(d3.csv, baseurl + '/data/countries-population-' + lang + '.csv').defer(d3.json, baseurl + '/data/map-world-110.json').defer(d3.json, 'https://freegeoip.net/json/').await(function(error, data_use, data_unmetneeds, data_reasons, countries, countries_gni, countries_population, map, location) {
      var user_country;
      if (location) {
        user_country = countries.filter(function(d) {
          return d.code2 === location.country_code;
        });
        if (user_country[0]) {
          userCountry.code = user_country[0].code;
          userCountry.name = user_country[0]['name_' + lang];
        }
      } else {
        location = {};
      }
      if (!location.code) {
        userCountry.code = 'ESP';
        userCountry.name = lang === 'es' ? 'España' : 'Spain';
      }
      data_reasons.forEach(function(d) {
        var item;
        item = countries.filter(function(country) {
          return country.code2 === d.code;
        });
        if (item && item[0]) {
          d.code = item[0].code;
          d.name = item[0]['name_' + lang];
          Object.keys(reasons_names).forEach(function(reason) {
            d[reason] = 100 * d[reason];
            if (d[reason] > 100) {
              return console.log('Alert! Value greater than zero. ' + d.country + ', ' + reason + ': ' + d[reason]);
            }
          });
          return delete d.country;
        } else {
          return console.warn('No country data for ' + d.code);
        }
      });
      console.log(userCountry);
      if ($('#treemap-contraceptives-use').length) {
        setupConstraceptivesUseTreemap(data_use);
      }
      if ($('#map-contraceptives-use').length) {
        setupConstraceptivesMaps(data_use, countries, map);
      }
      if ($('#unmet-needs-gdp-graph').length) {
        setupUnmetNeedsGdpGraph(data_unmetneeds, countries_gni, countries_population);
      }
      if ($('#contraceptives-reasons-opposed').length) {
        setupContraceptivesReasons(data_reasons, countries);
      }
      if ($('#contraceptives-app').length) {
        return setupContraceptivesApp(data_use, data_unmetneeds, data_reasons);
      }
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQ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LENBQTJCLENBQUMsTUFBL0I7UUFDRSx1QkFBQSxDQUF3QixlQUF4QixFQUF5QyxhQUF6QyxFQUF3RCxvQkFBeEQsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxpQ0FBRixDQUFvQyxDQUFDLE1BQXhDO1FBQ0UsMEJBQUEsQ0FBMkIsWUFBM0IsRUFBeUMsU0FBekMsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2VBQ0Usc0JBQUEsQ0FBdUIsUUFBdkIsRUFBaUMsZUFBakMsRUFBa0QsWUFBbEQsRUFERjs7SUE5Q0ssQ0FUVDtFQWhnQkQsQ0FBRCxDQUFBLENBMGpCRSxNQTFqQkY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBIb3Jpem9udGFsIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBvcHRpb25zLnhBeGlzID0gb3B0aW9ucy54QXhpcyB8fCBbMjUsIDUwLCA3NSwgMTAwXVxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBzdmcgJiB1c2UgaHRtbCBkaXYgaW5zdGVhZFxuICBzZXRTVkc6IC0+XG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci1ob3Jpem9udGFsLWdyYXBoJ1xuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS54XSA9ICtkW0BvcHRpb25zLmtleS54XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBpZiBAb3B0aW9ucy54QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5heGlzJylcbiAgICAgICAgLmRhdGEoQG9wdGlvbnMueEF4aXMpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdheGlzJ1xuICAgICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBjb25zb2xlLmxvZyAnYmFyIGhvcml6b250YWwgZGF0YScsIEBkYXRhXG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWNvbnRhaW5lcidcbiAgICAgIC5jYWxsIEBzZXRCYXJzXG4gICAgcmV0dXJuIEBcblxuICBcbiAgc2V0QmFyczogKGVsZW1lbnQpID0+XG4gICAgaWYgQG9wdGlvbnMua2V5LmlkXG4gICAgICBlbGVtZW50LmF0dHIgJ2lkJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdiYXItdGl0bGUnXG4gICAgICAgIC5odG1sIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXInXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgKGQpID0+IFxuICAgICAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF0rJyUnXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmh0bWwgKGQpID0+IE1hdGgucm91bmQoZFtAb3B0aW9ucy5rZXkueF0pKyclJ1xuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgY29uc29sZS5sb2cgQGNvbG9yLmRvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWUubGVuZ3RoID4gMFxuICAgICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICAgIEBzZXRUb29sdGlwRGF0YSB2YWx1ZVswXVxuICAgICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgb2Zmc2V0ID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuICAgICAgICAnb3BhY2l0eSc6ICcxJ1xuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBpZiBkLmNhc2VzXG4gICAgICBAJHRvb2x0aXBcbiAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcykgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuTWFwR3JhcGhcblxuICBjdXJyZW50U3RhdGUgPSAwXG5cblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgIEAkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgZWxzZVxuICAgICAgICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cblxuICAjIyNcbiAgIyBvdmVycmlkZSBjb2xvciBzY2FsZVxuICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwgZDMuc2NoZW1lQ2F0ZWdvcnkyMFxuICAjIG92ZXJyaWRlIHNldENvdW50cnlDb2xvclxuICBAc2V0Q291bnRyeUNvbG9yID0gKGQpIC0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlWzBdXG4gICAgICAjY29uc29sZS5sb2cgQGNvbG9yXG4gICAgICBjb25zb2xlLmxvZyB2YWx1ZVswXS52YWx1ZXNbMF0uaWQsIHZhbHVlWzBdLnZhbHVlc1swXS5uYW1lLCBAY29sb3IodmFsdWVbMF0udmFsdWVzWzBdLmlkKVxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZXNbMF0uaWQpIGVsc2UgJyNlZWUnXG4gICNAZm9ybWF0RmxvYXQgPSBAZm9ybWF0SW50ZWdlclxuICAjQGdldExlZ2VuZERhdGEgPSAtPiBbMCwyLDQsNiw4XVxuICBAc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcuZGVzY3JpcHRpb24nXG4gICAgICAjLmh0bWwgZC52YWx1ZXNbMF0ubmFtZSsnICgnK2QudmFsdWVzWzBdLnZhbHVlKyclKSdcbiAgICAgIC5odG1sIGQudmFsdWUrJyUnXG4gICMjI1xuXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIGlmIHN0YXRlID09IDFcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydGZW1hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDJcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJVUQnXVxuICAgICAgZWxzZSBpZiBzdGF0ZSA9PSAzXG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpIC0+IGQudmFsdWUgPSArZFsnUGlsbCddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDRcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydNYWxlIGNvbmRvbSddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDVcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJbmplY3RhYmxlJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNlxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgNjBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdXBkYXRlR3JhcGgoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIHVwZGF0ZUdyYXBoOiAtPlxuXG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHVwZGF0ZSBub2Rlc1xuICAgIG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgIFxuICAgIG5vZGVzLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUnXG4gICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsJ1xuICAgICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwtY29udGVudCdcbiAgICAgICAgICAuYXBwZW5kICdwJ1xuXG4gICAgIyBzZXR1cCBub2Rlc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG5cbiAgICAjIGFkZCBsYWJlbCBvbmx5IGluIG5vZGVzIHdpdGggc2l6ZSBncmVhdGVyIHRoZW4gb3B0aW9ucy5taW5TaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsICAgQHNldE5vZGVMYWJlbFxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIG5vZGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoXG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgICAjIFVwZGF0ZSB0cmVtYXAgc2l6ZVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuICAgIGVsc2VcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNxdWFyaWZ5XG4gICAgQHRyZWVtYXAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBVcGRhdGUgbm9kZXMgZGF0YVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuICAgICAgXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgc2V0Tm9kZTogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjbGFzcycsICAgICAgIEBnZXROb2RlQ2xhc3NcbiAgICAgIC5zdHlsZSAncGFkZGluZycsICAgIChkKSA9PiBpZiAoZC54MS1kLngwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcgJiYgZC55MS1kLnkwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcpIHRoZW4gQG9wdGlvbnMubm9kZXNQYWRkaW5nKydweCcgZWxzZSAwXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAoZCkgLT4gaWYgKGQueDEtZC54MCA9PSAwKSB8fCAoZC55MS1kLnkwID09IDApIHRoZW4gJ2hpZGRlbicgZWxzZSAnJ1xuXG4gIHNldE5vZGVEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgLT4gZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpIC0+IGQueTAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIChkKSAtPiBkLngxLWQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChkKSAtPiBkLnkxLWQueTAgKyAncHgnXG5cbiAgc2V0Tm9kZUxhYmVsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5zZWxlY3QoJ3AnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlJ1xuICAgICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5UcmVlbWFwR3JhcGhcblxuICAjIG92ZXJkcml2ZSBkYXRhIFBhcnNlclxuICBkYXRhUGFyc2VyOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgIyMjIG1lcmdlIFZhZ2luYWwgYmFycmllciBtZXRob2RzLCBMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAmIEVtZXJnZW5jeSBjb250cmFjZXB0aW9uIGluIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgZ2V0S2V5VmFsdWUgPSAoa2V5LCBkYXRhKSAtPlxuICAgICAgaWYga2V5ICE9ICdvdGhlci1tb2Rlcm4tbWV0aG9kcydcbiAgICAgICAgcmV0dXJuIGRhdGFba2V5XVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZGF0YVtrZXldK21lcmdlX2tleXMucmVkdWNlKChzdW0sIHZhbHVlKSAtPiBzdW0rZGF0YVt2YWx1ZV0pXG4gICAgIyMjXG4gICAgIyBUT0RPISEhIEdldCBjdXJyZW50IGNvdW50cnkgJiBhZGQgc2VsZWN0IGluIG9yZGVyIHRvIGNoYW5nZSBpdFxuICAgIGRhdGFfY291bnRyeSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgY29uc29sZS5sb2cgZGF0YV9jb3VudHJ5WzBdXG4gICAgaWYgZGF0YV9jb3VudHJ5WzBdXG4gICAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgICAgbWV0aG9kcyA9IHt9XG4gICAgICBAb3B0aW9ucy5tZXRob2RzS2V5cy5mb3JFYWNoIChrZXksaSkgPT5cbiAgICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgICBtZXRob2RzW2tleV0gPVxuICAgICAgICAgICAgaWQ6IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKS5yZXBsYWNlKCcpJywgJycpLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgICAgdmFsdWU6ICtkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgICBjb25zb2xlLmxvZyBtZXRob2RzXG4gICAgICAjIGZpbHRlciBtZXRob2RzIHdpdGggdmFsdWUgPCA1JSAmIGFkZCB0byBPdGhlciBtb2Rlcm4gbWV0aG9kc1xuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBpZiBrZXkgIT0gJ090aGVyIG1vZGVybiBtZXRob2RzJyBhbmQga2V5ICE9ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJyBhbmQgbWV0aG9kLnZhbHVlIDwgNVxuICAgICAgICAgIG1ldGhvZHNbJ090aGVyIG1vZGVybiBtZXRob2RzJ10udmFsdWUgKz0gbWV0aG9kLnZhbHVlXG4gICAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICBcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgICAgaWQ6IG1ldGhvZC5pZFxuICAgICAgICAgIHJhd19uYW1lOiBtZXRob2QubmFtZVxuICAgICAgICAgIG5hbWU6ICc8c3Ryb25nPicgKyBtZXRob2QubmFtZSArICc8L3N0cm9uZz48YnIvPicgKyBNYXRoLnJvdW5kKG1ldGhvZC52YWx1ZSkgKyAnJSdcbiAgICAgICAgICB2YWx1ZTogbWV0aG9kLnZhbHVlXG4gICAgICAgICAgcGFyZW50OiAncidcbiAgICAgIHBhcnNlZERhdGFTb3J0ZWQgPSBwYXJzZWREYXRhLnNvcnQgKGEsYikgLT4gaWYgYS52YWx1ZSBhbmQgYi52YWx1ZSB0aGVuIGIudmFsdWUtYS52YWx1ZSBlbHNlIDFcbiAgICAgICMgc2V0IGNhcHRpb24gY291bnRyeSBuYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY291bnRyeScpLmh0bWwgY291bnRyeV9uYW1lXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtYW55LW1ldGhvZCcpLmh0bWwgTWF0aC5yb3VuZChkYXRhX2NvdW50cnlbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pXG4gICAgICAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBwYXJzZWREYXRhU29ydGVkWzBdLnJhd19uYW1lXG4gICAgcmV0dXJuIHBhcnNlZERhdGFcblxuICAjIG92ZXJkcml2ZSBzZXQgZGF0YVxuICBzZXREYXRhOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQG9yaWdpbmFsRGF0YSA9IGRhdGFcbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgICNAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVEYXRhOiAoY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAdXBkYXRlR3JhcGgoKVxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVyZHJpdmUgbm9kZSBjbGFzc1xuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSBub2RlLScrZC5pZFxuXG4gICMjIyBvdmVyZHJpdmUgcmVzaXplXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0Q29udGFpbmVyT2Zmc2V0KClcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbnRhaW5lck9mZnNldDogLT5cbiAgICBAJGVsLmNzcygndG9wJywgKCQod2luZG93KS5oZWlnaHQoKS1AJGVsLmhlaWdodCgpKSowLjUpXG4gICMjIyIsImNsYXNzIHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JlZXN3YXJtR3JhcGgnLCBpZFxuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA1XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqAyXG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDE1XG4gICAgb3B0aW9ucy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IDAgIyBtb2RlIDA6IGJlZXN3YXJtLCBtb2RlIDE6IHNjYXR0ZXJwbG90XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkcmF3R3JhcGg6IC0+XG5cbiAgICBAc2V0U2l6ZSgpXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhIEBkYXRhXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0RG90XG4gICAgICAub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgc2V0RG90OiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuY2FsbCBAc2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVkgPSBkMy5mb3JjZVkgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgIGZvcmNlWS5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VZXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVgoQHdpZHRoKi41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMzUwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIHNldERvdFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueCBlbHNlIE1hdGgucm91bmQgQHgoZFtAb3B0aW9ucy5rZXkueF0pXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC55IGVsc2UgTWF0aC5yb3VuZCBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBzZXREb3RGaWxsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICdmaWxsJywgKGQpID0+IGlmIEBvcHRpb25zLmtleS5jb2xvciBhbmQgQG9wdGlvbnMubW9kZSA9PSAxIHRoZW4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSBlbHNlICcjZTI3MjNiJ1xuXG4gIHNldE1vZGU6IChtb2RlKSAtPlxuICAgIEBvcHRpb25zLm1vZGUgPSBtb2RlXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuXG4gIHNldFNpemU6IC0+XG4gICAgaWYgQHNpemVcbiAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgIGQucmFkaXVzID0gQHNpemUgZFtAb3B0aW9ucy5rZXkuc2l6ZV1cblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgc3VwZXIoKVxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZVBvdygpXG4gICAgICAuZXhwb25lbnQoMC4xMjUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICAjIEVxdWl2YWxlbnQgdG8gZDMuc2NhbGVTcXJ0KClcbiAgICAgICPCoGh0dHBzOi8vYmwub2Nrcy5vcmcvZDNpbmRlcHRoLzc3NWNmNDMxZTY0YjY3MTg0ODFjMDZmYzQ1ZGMzNGY5XG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50IDAuNVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVUaHJlc2hvbGQoKVxuICAgICAgICAucmFuZ2UgZDMuc2NoZW1lT3Jhbmdlc1s1XS5yZXZlcnNlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzIwMCwgODUwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzEwMDUsIDM5NTUsIDEyMjM1LCAxMDAwMDBdXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgaWYgQHNpemVcbiAgICAgIEBzaXplLmRvbWFpbiBAZ2V0U2l6ZURvbWFpbigpXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICB1c2VUcmVlbWFwID0gbnVsbFxuICB1c2VNYXAgPSBudWxsXG4gIHVzZUdyYXBoID0gbnVsbFxuICB1bm1ldG5lZWRzR3JhcGggPSBudWxsIFxuXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IGZhbHNlXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJFc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJFc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiSW1wbGFudGVcIlxuICAgICAgXCJJbnllY3RhYmxlXCJcbiAgICAgIFwiUMOtbGRvcmFcIlxuICAgICAgXCJDb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcIkNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJNw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJNw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiQW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJPdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIk3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiSW1wbGFudFwiXG4gICAgICBcIkluamVjdGFibGVcIlxuICAgICAgXCJQaWxsXCJcbiAgICAgIFwiTWFsZSBjb25kb21cIlxuICAgICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJUcmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCIgICAgICAgIyBvcHBvc2VkXG4gICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIiAgIyBvcHBvc2VkXG4gICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIiAgICAgICAgICAgIyBvcHBvc2VkXG4gICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCIgICAgIyBvcHBvc2VkXG4gICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiICAgICAgICAgICAgICAgICAgICAgICMgc2FsdWRcbiAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIiAjIHNhbHVkXG4gICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpJzIHByb2Nlc3Nlc1wiICAgICAgIyBzYWx1ZFxuICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICAjIFNjcm9sbGFtYSBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwU2Nyb2xsYW1hID0gKGlkKSAtPlxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycraWQpXG4gICAgZ3JhcGhpYyAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBjaGFydCAgICAgPSBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgdGV4dCAgICAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC10ZXh0JylcbiAgICBzdGVwcyAgICAgPSB0ZXh0LnNlbGVjdEFsbCgnLnN0ZXAnKVxuXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIHNjcm9sbGVyID0gc2Nyb2xsYW1hKClcblxuICAgICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gICAgaGFuZGxlUmVzaXplID0gLT5cbiAgICAgIHdpZHRoID0gZ3JhcGhpYy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggI01hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgICAgc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICAgIGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgICBjaGFydFxuICAgICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgICBzY3JvbGxlci5yZXNpemUoKVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgc3RpY2t5IHRoZSBncmFwaGljXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgICBoYW5kbGVDb250YWluZXJFeGl0ID0gKGUpIC0+XG4gICAgICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICBoYW5kbGVTdGVwRW50ZXIgPSAoZSkgLT5cbiAgICAgICPCoGNvbnNvbGUubG9nIGVcbiAgICAgICRzdGVwID0gJChlLmVsZW1lbnQpXG4gICAgICBpbnN0YW5jZSA9ICRzdGVwLmRhdGEoJ2luc3RhbmNlJylcbiAgICAgIHN0ZXAgPSAkc3RlcC5kYXRhKCdzdGVwJylcbiAgICAgIGlmIGluc3RhbmNlID09IDAgXG4gICAgICAgIGNvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAxJywgc3RlcFxuICAgICAgICAgIHVzZU1hcC5zZXRNYXBTdGF0ZSBzdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAyXG4gICAgICAgIGlmIHVzZUdyYXBoIGFuZCBzdGVwID4gMFxuICAgICAgICAgIGRhdGEgPSBbNjMsIDg4LCAxMDBdICMgNjMsIDYzKzI1LCA2MysyNSsxMlxuICAgICAgICAgIGZyb20gPSBpZiBzdGVwID4gMSB0aGVuIGRhdGFbc3RlcC0yXSBlbHNlIDBcbiAgICAgICAgICB0byA9IGRhdGFbc3RlcC0xXVxuICAgICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrc3RlcCwgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAyJywgc3RlcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAzXG4gICAgICAgIGlmIHVubWV0bmVlZHNHcmFwaCBhbmQgdW5tZXRuZWVkc0dyYXBoLm9wdGlvbnMubW9kZSAhPSBzdGVwXG4gICAgICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgc3RlcFxuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK2lkICAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHRleHQ6ICAgICAgICcuc2Nyb2xsLXRleHQnICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjA1ICAgICAgICAgICAgICAgICAgICMgc2V0IHRoZSB0cmlnZ2VyIHRvIGJlIDEvMiB3YXkgZG93biBzY3JlZW5cbiAgICAgICAgZGVidWc6ICAgICAgZmFsc2UgICAgICAgICAgICAgICAgICMgZGlzcGxheSB0aGUgdHJpZ2dlciBvZmZzZXQgZm9yIHRlc3RpbmdcbiAgICAgIC5vbkNvbnRhaW5lckVudGVyIGhhbmRsZUNvbnRhaW5lckVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRXhpdCAgaGFuZGxlQ29udGFpbmVyRXhpdCBcblxuICAgICMgRW5zdXJlIHRvIHNldHVwIG9uU3RlcEVudGVyIGhhbmRsZXIgb25seSBvbmNlXG4gICAgdW5sZXNzIHNjcm9sbGFtYUluaXRpYWxpemVkXG4gICAgICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IHRydWVcbiAgICAgIHNjcm9sbGVyLm9uU3RlcEVudGVyICBoYW5kbGVTdGVwRW50ZXIgXG4gICAgICBcbiAgICAjIHNldHVwIHJlc2l6ZSBldmVudFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCBoYW5kbGVSZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIEdyYXBoIFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoID0gLT5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgtY29udGFpbmVyJ1xuICAgICMgU2V0dXAgR3JhcGhcbiAgICBncmFwaFdpZHRoID0gMFxuICAgIHVzZUdyYXBoID0gZDMuc2VsZWN0KCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJylcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGguYXBwZW5kKCd1bCcpXG4gICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgIC5kYXRhKGRhdGFJbmRleClcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgIC5hcHBlbmQoJ3VzZScpXG4gICAgICAgICAgICAuYXR0cigneGxpbms6aHJlZicsICcjaWNvbi13b21hbicpXG4gICAgICAgICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTkzIDQ1MCcpXG4gICAgIyBSZXNpemUgaGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIgPSAtPlxuICAgICAgaWYgZ3JhcGhXaWR0aCAhPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgZ3JhcGhXaWR0aCA9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBpdGVtc1dpZHRoID0gKGdyYXBoV2lkdGggLyAyMCkgLSAxMFxuICAgICAgICBpdGVtc0hlaWdodCA9IDIuMzMqaXRlbXNXaWR0aFxuICAgICAgICAjaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiAnMTAlJyBlbHNlICc1JSdcbiAgICAgICAgI2l0ZW1zSGVpZ2h0ID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuIGdyYXBoV2lkdGggKiAwLjEgLyAwLjc1IGVsc2UgZ3JhcGhXaWR0aCAqIDAuMDUgLyAwLjc1XG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5zdHlsZSAnd2lkdGgnLCBpdGVtc1dpZHRoKydweCdcbiAgICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0KydweCdcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdzdmcnKVxuICAgICAgICAgIC5hdHRyICd3aWR0aCcsIGl0ZW1zV2lkdGhcbiAgICAgICAgICAuYXR0ciAnaGVpZ2h0JywgaXRlbXNIZWlnaHRcbiAgICAgIHVzZUdyYXBoLnN0eWxlICdtYXJnaW4tdG9wJywgKCgkKCdib2R5JykuaGVpZ2h0KCktdXNlR3JhcGgubm9kZSgpLm9mZnNldEhlaWdodCkqLjUpKydweCdcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgcmVzaXplSGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIoKVxuXG5cbiAgIyBVbm1lZXQgTmVlZHMgdnMgR0RQIGdyYXBoXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCA9IChkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllc19nbmksIGNvdW50cmllc19wb3B1bGF0aW9uKSAtPlxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAndW5tZXQtbmVlZHMtZ2RwLWNvbnRhaW5lci1ncmFwaCdcblxuICAgICMgcGFyc2UgZGF0YVxuICAgIGRhdGEgPSBbXVxuICAgIGRhdGFfdW5tZXRuZWVkcy5mb3JFYWNoIChkKSAtPlxuICAgICAgY291bnRyeV9nbmkgPSBjb3VudHJpZXNfZ25pLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgY291bnRyeV9wb3AgPSBjb3VudHJpZXNfcG9wdWxhdGlvbi5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGlmIGNvdW50cnlfZ25pWzBdIGFuZCBjb3VudHJ5X2duaVswXVsnMjAxNiddXG4gICAgICAgICAgZGF0YS5wdXNoXG4gICAgICAgICAgICB2YWx1ZTogK2RbJzIwMTcnXVxuICAgICAgICAgICAgbmFtZTogY291bnRyeV9nbmlbMF0ubmFtZVxuICAgICAgICAgICAgcmVnaW9uOiBjb3VudHJ5X2duaVswXS5yZWdpb25cbiAgICAgICAgICAgIHBvcHVsYXRpb246IGNvdW50cnlfcG9wWzBdWycyMDE1J11cbiAgICAgICAgICAgIGduaTogY291bnRyeV9nbmlbMF1bJzIwMTYnXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnTm8gR05JIG9yIFBvcHVsYXRpb24gZGF0YSBmb3IgdGhpcyBjb3VudHJ5JywgZC5jb2RlLCBjb3VudHJ5X2duaVswXVxuICAgICMgY2xlYXIgaXRlbXMgd2l0aG91dCB1bm1ldC1uZWVkcyB2YWx1ZXNcbiAgICAjZGF0YSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmdkcCBhbmQgZFsndW5tZXQtbmVlZHMnXSBcbiAgICAjIyNcbiAgICB1bm1ldE5lZWRzR2RwR3JhcGggPSBuZXcgd2luZG93LlNjYXR0ZXJwbG90VW5tZXROZWVkc0dyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgeDogJ2duaSdcbiAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIGNvbG9yOiAnZ25pJyAjJ3JlZ2lvbidcbiAgICAgICAgc2l6ZTogJ3BvcHVsYXRpb24nXG4gICAgIyBzZXQgZGF0YVxuICAgICMjI1xuICAgICMgc2V0dXAgZ3JhcGhcbiAgICB1bm1ldG5lZWRzR3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDVcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICdnbmknXG4gICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICBzaXplOiAncG9wdWxhdGlvbidcbiAgICAgICAgY29sb3I6ICdnbmknXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAxMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG5cbiAgICAjIHBhcnNlIGRhdGEgdXNlXG4gICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgbWV0aG9kc19rZXlzLmZvckVhY2ggKGtleSxpKSAtPlxuICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgaWQ6IGlcbiAgICAgICAgICBuYW1lOiBtZXRob2RzX25hbWVzW2xhbmddW2ldXG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgICNkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG5cbiAgICAjIFNldCB1c2UgbWFwXG4gICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgbGVnZW5kOiBmYWxzZVxuICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcbiAgICB1c2VNYXAub25SZXNpemUoKVxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZU1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIEdyYXBoc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc1JlYXNvbnMgPSAoZGF0YV9yZWFzb25zLCBjb3VudHJpZXMpIC0+XG5cbiAgICByZWFzb25IZWFsdGggPSBbXVxuICAgIHJlYXNvbk5vdFNleCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kID0gW11cbiAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzID0gW11cblxuICAgIHJlYXNvbnNLZXlzID0gT2JqZWN0LmtleXMocmVhc29uc19uYW1lcylcblxuICAgICMgcGFyc2UgcmVhc29ucyBkYXRhXG4gICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICAjIyNcbiAgICAgIHJlYXNvbnNLZXlzLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgZFtyZWFzb25dID0gK2RbcmVhc29uXVxuICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICMjI1xuICAgICAgcmVhc29uSGVhbHRoLnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLm8rZC5wK2QudCAjIGhlYWx0aCBjb25jZXJucyArIGZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJucyArIGludGVyZmVyZXMgd2l0aCBib2R5wpJzIHByb2Nlc3Nlc1xuICAgICAgcmVhc29uTm90U2V4LnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmIgIyBub3QgaGF2aW5nIHNleFxuICAgICAgcmVhc29uT3Bwb3NlZC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5pK2QuaitkLmsrZC5sICPCoHJlc3BvbmRlbnQgb3Bwb3NlZCArIGh1c2JhbmQvcGFydG5lciBvcHBvc2VkICsgb3RoZXJzIG9wcG9zZWQgKyByZWxpZ2lvdXMgcHJvaGliaXRpb25cbiAgICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmkgI8KgcmVzcG9uZGVudCBvcHBvc2VkXG4gICAgICByZWFzb25PcHBvc2VkSHVzYmFuZC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5qICPCoHJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFxuICAgICAgcmVhc29uT3Bwb3NlZFJlbGlnaW91cy5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5sICPCoHJlbGlnaW91cyBwcm9oaWJpdGlvblxuXG4gICAgc29ydEFycmF5ID0gKGEsYikgLT4gcmV0dXJuIGIudmFsdWUtYS52YWx1ZVxuICAgIHJlYXNvbkhlYWx0aC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk5vdFNleC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWQuc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkUmVzcG9uZGVudC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kLnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZFJlbGlnaW91cy5zb3J0IHNvcnRBcnJheVxuXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtaGVhbHRoJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbkhlYWx0aC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJykuc2V0RGF0YSByZWFzb25PcHBvc2VkLnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1ub3Qtc2V4JyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbk5vdFNleC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1yZXNwb25kZW50JyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLWh1c2JhbmQnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZSdcbiAgICAgIHhBeGlzOiBbNTAsIDEwMF0pLnNldERhdGEgcmVhc29uT3Bwb3NlZEh1c2JhbmQuc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtcmVsaWdpb3VzJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMuc2xpY2UoMCw1KVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgVHJlZW5hcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwID0gKGRhdGFfdXNlKSAtPlxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIHNldHVwU2Nyb2xsYW1hICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG4gICAgIyBzZXR1cCB0cmVlbWFwXG4gICAgdXNlVHJlZW1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHZhbHVlOiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgIG1ldGhvZHNLZXlzOiBtZXRob2RzX2tleXNcbiAgICAgIG1ldGhvZHNOYW1lczogbWV0aG9kc19uYW1lc1tsYW5nXVxuICAgICMgc2V0IGRhdGFcbiAgICB1c2VUcmVlbWFwLnNldERhdGEgZGF0YV91c2UsIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAjIHNldCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZVRyZWVtYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgQXBwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29udHJhY2VwdGl2ZXNBcHAgPSAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zKSAtPlxuICAgICPCoHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy1hcHAtY29udGFpbmVyJ1xuICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAgLnNlbGVjdC1jb3VudHJ5JylcbiAgICAgIC5jaGFuZ2UgLT5cbiAgICAgICAgY291bnRyeV9jb2RlID0gJCh0aGlzKS52YWwoKVxuICAgICAgICBjb25zb2xlLmxvZyAnY2hhbmdlJywgY291bnRyeV9jb2RlXG4gICAgICAgICMgVXNlXG4gICAgICAgIGRhdGFfdXNlX2NvdW50cnkgPSBkYXRhX3VzZS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91c2VfY291bnRyeSBhbmQgZGF0YV91c2VfY291bnRyeVswXVxuICAgICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IG1ldGhvZHNfa2V5cy5tYXAgKGtleSwgaSkgLT4geyduYW1lJzogbWV0aG9kc19uYW1lc1tsYW5nXVtpXSwgJ3ZhbHVlJzogK2RhdGFfdXNlX2NvdW50cnlbMF1ba2V5XX1cbiAgICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBjb3VudHJ5X21ldGhvZHMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCtkYXRhX3VzZV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG4gICAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgICBkYXRhX3VubWV0bmVlZHNfY291bnRyeSA9IGRhdGFfdW5tZXRuZWVkcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91bm1ldG5lZWRzX2NvdW50cnkgYW5kIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK2RhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdWycyMDE3J10pKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG4gICAgICAgICMgUmVhc29uc1xuICAgICAgICBkYXRhX3JlYXNvbnNfY291bnRyeSA9IGRhdGFfcmVhc29ucy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV9yZWFzb25zX2NvdW50cnkgYW5kIGRhdGFfcmVhc29uc19jb3VudHJ5WzBdXG4gICAgICAgICAgcmVhc29ucyA9IE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpLm1hcCAocmVhc29uKSAtPiB7J25hbWUnOiByZWFzb25zX25hbWVzW3JlYXNvbl0sICd2YWx1ZSc6ICtkYXRhX3JlYXNvbnNfY291bnRyeVswXVtyZWFzb25dfVxuICAgICAgICAgIHJlYXNvbnMgPSByZWFzb25zLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZChyZWFzb25zWzBdLnZhbHVlKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcbiAgICAgIC52YWwgdXNlckNvdW50cnkuY29kZVxuICAgICAgLnRyaWdnZXIgJ2NoYW5nZSdcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGgoKVxuXG4gICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAjICEhISBUT0RPIC0+IFVzZSBhIHNpbmdsZSBjb3VudHJpZXMgZmlsZSB3aXRoIGduaSAmIHBvcHVsYXRpb24gaW5mbyBcbiAgZDMucXVldWUoKVxuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS0nK2xhbmcrJy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1wb3B1bGF0aW9uLScrbGFuZysnLmNzdidcbiAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgIC5kZWZlciBkMy5qc29uLCAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJ1xuICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBjb3VudHJpZXNfZ25pLCBjb3VudHJpZXNfcG9wdWxhdGlvbiwgbWFwLCBsb2NhdGlvbikgLT5cblxuICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICBlbHNlXG4gICAgICAgIGxvY2F0aW9uID0ge31cblxuICAgICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cbiAgICAgICN0ZXN0IG90aGVyIGNvdW50cmllc1xuICAgICAgI3VzZXJDb3VudHJ5LmNvZGUgPSAnUlVTJ1xuICAgICAgI3VzZXJDb3VudHJ5Lm5hbWUgPSAnUnVzaWEnXG5cbiAgICAgICMgYWRkIGNvdW50cnkgSVNPIDMxNjYtMSBhbHBoYS0zIGNvZGUgdG8gZGF0YV9yZWFzb25zXG4gICAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZTIgPT0gZC5jb2RlXG4gICAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgICBkLmNvZGUgPSBpdGVtWzBdLmNvZGVcbiAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzKS5mb3JFYWNoIChyZWFzb24pIC0+XG4gICAgICAgICAgICBkW3JlYXNvbl0gPSAxMDAqZFtyZWFzb25dXG4gICAgICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgJ0FsZXJ0ISBWYWx1ZSBncmVhdGVyIHRoYW4gemVyby4gJyArIGQuY291bnRyeSArICcsICcgKyByZWFzb24gKyAnOiAnICsgZFtyZWFzb25dXG4gICAgICAgICAgZGVsZXRlIGQuY291bnRyeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS53YXJuICdObyBjb3VudHJ5IGRhdGEgZm9yICcrZC5jb2RlXG5cbiAgICAgIGNvbnNvbGUubG9nIHVzZXJDb3VudHJ5XG5cbiAgICAgIGlmICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgZGF0YV91c2VcblxuICAgICAgaWYgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcFxuXG4gICAgICBpZiAkKCcjdW5tZXQtbmVlZHMtZ2RwLWdyYXBoJykubGVuZ3RoXG4gICAgICAgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoIGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb25cblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnRyYWNlcHRpdmVzUmVhc29ucyBkYXRhX3JlYXNvbnMsIGNvdW50cmllc1xuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29udHJhY2VwdGl2ZXNBcHAgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zXG5cbikgalF1ZXJ5XG4iXX0=
