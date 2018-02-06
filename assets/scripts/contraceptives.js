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
      return this;
    };

    BarHorizontalGraph.prototype.drawGraph = function() {
      console.log('bar horizontal data', this.data);
      this.container.selectAll('.bar').data(this.data).enter().append('div').call(this.setBars);
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
      this.setNode = bind(this.setNode, this);
      options.minSize = options.minSize || 80;
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
      this.treemapRoot = this.stratify(this.data).sum((function(_this) {
        return function(d) {
          return d[_this.options.key.value];
        };
      })(this)).sort(function(a, b) {
        return b.value - a.value;
      });
      this.treemap(this.treemapRoot);
      this.nodes = this.container.selectAll('.node').data(this.treemapRoot.leaves()).enter().append('div').call(this.setNode).call(this.setNodeDimension);
      this.drawGraphLabels();
      return this;
    };

    TreemapGraph.prototype.updateGraph = function() {
      this.treemapRoot = this.stratify(this.data).sum((function(_this) {
        return function(d) {
          return d[_this.options.key.value];
        };
      })(this)).sort(function(a, b) {
        return b.value - a.value;
      });
      this.treemap(this.treemapRoot);
      this.nodes.selectAll('.node-label').remove();
      this.nodes.data(this.treemapRoot.leaves()).call(this.setNode).transition().duration(this.options.transitionDuration).on('end', (function(_this) {
        return function(d, i) {
          if (i === _this.nodes.size() - 1) {
            return _this.drawGraphLabels();
          }
        };
      })(this)).call(this.setNodeDimension);
      return this;
    };

    TreemapGraph.prototype.drawGraphLabels = function() {
      this.nodes.append('div').attr('class', 'node-label').style('visibility', 'hidden').call(this.setNodeLabel);
      return this.nodes.filter(this.isNodeLabelVisible).selectAll('.node-label').style('visibility', 'visible');
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
      this.nodes.data(this.treemapRoot.leaves());
      this.nodes.call(this.setNode).call(this.setNodeDimension).filter(this.isNodeLabelVisible).selectAll('.node-label').style('visibility', 'visible');
      return this;
    };

    TreemapGraph.prototype.getNodeClass = function(d) {
      return 'node';
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

    TreemapGraph.prototype.setNodeLabel = function(selection) {
      var label;
      label = selection.append('div').attr('class', 'node-label-content');

      /*
      label.append 'svg'
        .attr 'viewBox', '0 0 24 24'
        .attr 'width', 24
        .attr 'height', 24
        .append 'use'
          .attr 'xlink:href', (d) -> '#icon-'+d.data.icon
       */
      return label.append('p').attr('class', function(d) {
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

    TreemapGraph.prototype.setNodeDimension = function(selection) {
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

    TreemapGraph.prototype.isNodeLabelVisible = function(d) {
      return d.x1 - d.x0 > this.options.minSize && d.y1 - d.y0 > this.options.minSize;
    };

    return TreemapGraph;

  })(window.BaseGraph);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseTreemapGraph = (function(superClass) {
    extend(ContraceptivesUseTreemapGraph, superClass);

    function ContraceptivesUseTreemapGraph() {
      this.onResize = bind(this.onResize, this);
      return ContraceptivesUseTreemapGraph.__super__.constructor.apply(this, arguments);
    }

    ContraceptivesUseTreemapGraph.prototype.dataParser = function(data, country_code, country_name) {

      /* merge Vaginal barrier methods, Lactational amenorrhea method & Emergency contraception in Other modern methods
      getKeyValue = (key, data) ->
        if key != 'other-modern-methods'
          return data[key]
        else
          return data[key]+merge_keys.reduce((sum, value) -> sum+data[value])
       */
      var data_country, key, method, methods, parsedData;
      data_country = data.filter(function(d) {
        return d.code === country_code;
      });
      console.log(data_country[0]);
      $('#treemap-contraceptives-use-country').html(country_name);
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
      parsedData = [
        {
          id: 'r'
        }
      ];
      for (key in methods) {
        method = methods[key];
        parsedData.push({
          id: method.id,
          name: '<strong>' + method.name + '</strong><br/>' + Math.round(method.value) + '%',
          value: method.value,
          parent: 'r'
        });
      }
      console.log(parsedData);
      return parsedData;
    };

    ContraceptivesUseTreemapGraph.prototype.setData = function(data, country_code, country_name) {
      this.originalData = data;
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.drawGraph();
      this.setContainerOffset();
      this.$el.trigger('draw-complete');
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.updateData = function(country_code, country_name) {
      this.data = this.dataParser(this.originalData, country_code, country_name);
      this.updateGraph();
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.onResize = function() {
      ContraceptivesUseTreemapGraph.__super__.onResize.call(this);
      this.setContainerOffset();
      return this;
    };

    ContraceptivesUseTreemapGraph.prototype.getNodeClass = function(d) {
      return 'node node-' + d.id;
    };

    ContraceptivesUseTreemapGraph.prototype.setContainerOffset = function() {
      return this.$el.css('top', ($(window).height() - this.$el.height()) * 0.5);
    };

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
        width = Math.floor(window.innerWidth);
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
        offset: 0.8
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
        }
      }).setData(reasonOpposedRespondent.slice(0, 5));
      new window.BarHorizontalGraph('contraceptives-reasons-opposed-husband', {
        key: {
          id: 'name',
          x: 'value'
        }
      }).setData(reasonOpposedHusband.slice(0, 5));
      return new window.BarHorizontalGraph('contraceptives-reasons-opposed-religious', {
        key: {
          id: 'name',
          x: 'value'
        }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYLGFBQU87SUFSSTs7d0JBY2IsTUFBQSxHQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsR0FBRCxHQUFPLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFmLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsS0FBMUIsQ0FDTCxDQUFDLElBREksQ0FDQyxPQURELEVBQ1UsSUFBQyxDQUFBLGNBRFgsQ0FFTCxDQUFDLElBRkksQ0FFQyxRQUZELEVBRVcsSUFBQyxDQUFBLGVBRlo7YUFHUCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFZLEdBQVosQ0FDWCxDQUFDLElBRFUsQ0FDTCxXQURLLEVBQ1EsWUFBQSxHQUFlLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQS9CLEdBQXNDLEdBQXRDLEdBQTRDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQTVELEdBQWtFLEdBRDFFO0lBSlA7O3dCQU9SLFFBQUEsR0FBVSxTQUFDLEdBQUQ7TUFDUixFQUFFLENBQUMsR0FBSCxDQUFPLEdBQVAsRUFBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLElBQVI7VUFDVixLQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxhQUFiO2lCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDtRQUZVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0FBR0EsYUFBTztJQUpDOzt3QkFNVixPQUFBLEdBQVMsU0FBQyxJQUFEO01BQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDUixJQUFDLENBQUEsVUFBRCxDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxlQUFiO0FBQ0EsYUFBTztJQVJBOzt3QkFXVCxVQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsYUFBTztJQURHOzt3QkFJWixRQUFBLEdBQVUsU0FBQTtBQUNSLGFBQU87SUFEQzs7d0JBUVYsU0FBQSxHQUFXLFNBQUE7QUFDVCxhQUFPO0lBREU7O3dCQUdYLFVBQUEsR0FBWSxTQUFBO01BRVYsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BQ0EsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BRUEsSUFBRyxJQUFDLENBQUEsS0FBSjtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixHQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsUUFEakIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsZ0JBRlQsQ0FHRSxDQUFDLElBSEgsQ0FHUSxJQUFDLENBQUEsS0FIVCxFQURGOztNQU1BLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFFBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLGdCQUZULENBR0UsQ0FBQyxJQUhILENBR1EsSUFBQyxDQUFBLEtBSFQsRUFERjs7QUFLQSxhQUFPO0lBaEJHOzt3QkFtQlosY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLENBQUQsRUFBSSxJQUFDLENBQUEsS0FBTDtJQURPOzt3QkFJaEIsY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLElBQUMsQ0FBQSxNQUFGLEVBQVUsQ0FBVjtJQURPOzt3QkFJaEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTztJQURROzt3QkFJakIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTztJQURROzt3QkFJakIsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPO0lBREc7O3dCQU9aLFNBQUEsR0FBVyxTQUFDLE1BQUQ7TUFDVCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxhQUFiLEVBQTRCLE1BQTVCLENBQWQ7QUFDQSxhQUFPO0lBRkU7O3dCQUlYLFdBQUEsR0FBYSxTQUFBO01BRVgsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLFNBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLE9BRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsUUFIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUFDLENBQUEsZUFKVDthQU1BLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixlQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxPQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLGNBSGpCLENBSUUsQ0FBQyxJQUpILENBSVEsYUFKUixFQUl1QixTQUFDLENBQUQ7UUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFVBQXBCO2lCQUFvQyxTQUFwQztTQUFBLE1BQWtELElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxPQUFkO2lCQUEyQixNQUEzQjtTQUFBLE1BQUE7aUJBQXNDLFFBQXRDOztNQUF6RCxDQUp2QixDQUtFLENBQUMsSUFMSCxDQUtRLElBTFIsRUFLYyxTQUFDLENBQUQ7UUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFlBQXBCO2lCQUFzQyxVQUF0QztTQUFBLE1BQUE7aUJBQXFELEVBQXJEOztNQUFQLENBTGQsQ0FNRSxDQUFDLElBTkgsQ0FNUSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUM7TUFBVCxDQU5SLENBT0UsQ0FBQyxJQVBILENBT1EsSUFBQyxDQUFBLGdCQVBUO0lBUlc7O3dCQWlCYixlQUFBLEdBQWlCLFNBQUMsT0FBRDthQUNmLE9BQ0UsQ0FBQyxJQURILENBQ1EsSUFEUixFQUNjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsRUFBdEM7V0FBQSxNQUFBO21CQUE2QyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxLQUFMLEVBQTdDOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURkLENBRUUsQ0FBQyxJQUZILENBRVEsSUFGUixFQUVjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUF0QztXQUFBLE1BQUE7bUJBQXVELEVBQXZEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZkLENBR0UsQ0FBQyxJQUhILENBR1EsSUFIUixFQUdjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsS0FBQyxDQUFBLE1BQXZDO1dBQUEsTUFBQTttQkFBa0QsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUFsRDs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIZCxDQUlFLENBQUMsSUFKSCxDQUlRLElBSlIsRUFJYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdEM7V0FBQSxNQUFBO21CQUF1RCxLQUFDLENBQUEsT0FBeEQ7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmQ7SUFEZTs7d0JBT2pCLGdCQUFBLEdBQWtCLFNBQUMsT0FBRDthQUNoQixPQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7WUFBdUMsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLE9BQWQ7cUJBQTJCLEtBQUMsQ0FBQSxNQUE1QjthQUFBLE1BQUE7cUJBQXVDLEVBQXZDO2FBQXZDO1dBQUEsTUFBQTttQkFBdUYsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUF2Rjs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEYixDQUVFLENBQUMsSUFGSCxDQUVRLEdBRlIsRUFFYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdEM7V0FBQSxNQUFBO21CQUF1RCxLQUFDLENBQUEsT0FBeEQ7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmI7SUFEZ0I7O3dCQVNsQixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEscUJBQUQsQ0FBQTtBQUNBLGFBQU87SUFIQzs7d0JBS1YsYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFHLElBQUMsQ0FBQSxHQUFKO1FBQ0UsSUFBQyxDQUFBLGNBQUQsR0FBbUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQUE7UUFDbkIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQztRQUM5QyxJQUFDLENBQUEsS0FBRCxHQUFtQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFsQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM1RSxJQUFDLENBQUEsTUFBRCxHQUFtQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFuQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUo5RTs7QUFLQSxhQUFPO0lBTk07O3dCQVNmLHFCQUFBLEdBQXVCLFNBQUE7TUFFckIsSUFBRyxJQUFDLENBQUEsR0FBSjtRQUNFLElBQUMsQ0FBQSxHQUNDLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDa0IsSUFBQyxDQUFBLGNBRG5CLENBRUUsQ0FBQyxJQUZILENBRVEsUUFGUixFQUVrQixJQUFDLENBQUEsZUFGbkIsRUFERjs7TUFLQSxJQUFHLElBQUMsQ0FBQSxDQUFKO1FBQ0UsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILENBQVMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFULEVBREY7O01BRUEsSUFBRyxJQUFDLENBQUEsQ0FBSjtRQUNFLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxDQUFTLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBVCxFQURGOztNQUdBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUlBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxlQURUO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGVBQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGdCQURUO0FBRUEsYUFBTztJQXpCYzs7d0JBMkJ2QixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLGNBQUEsR0FBZSxJQUFDLENBQUEsTUFBaEIsR0FBdUIsR0FBbkQ7SUFEZ0I7O3dCQUdsQixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLFlBQUEsR0FBYSxJQUFDLENBQUEsS0FBZCxHQUFvQixLQUFoRDtJQURnQjs7d0JBT2xCLFFBQUEsR0FBVSxTQUFBO0FBQ1IsYUFBTyxDQUFFLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtJQUREOzt3QkFHVixRQUFBLEdBQVUsU0FBQTtBQUNSLGFBQU8sQ0FBRSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7SUFERDs7Ozs7QUFyTlo7OztBQ0FBO0FBQUEsTUFBQTs7OztFQUFNLE1BQU0sQ0FBQzs7O0lBTUUsNEJBQUMsRUFBRCxFQUFLLE9BQUw7O01BRVgsb0RBQU0sRUFBTixFQUFVLE9BQVY7QUFDQSxhQUFPO0lBSEk7O2lDQVViLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBZixDQUNYLENBQUMsSUFEVSxDQUNMLE9BREssRUFDSSxzQkFESjtJQURQOztpQ0FJUixVQUFBLEdBQVksU0FBQyxJQUFEO01BQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFDWCxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFGLEdBQW9CLENBQUMsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7UUFEWjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtBQUVBLGFBQU87SUFIRzs7aUNBS1osU0FBQSxHQUFXLFNBQUE7QUFDVCxhQUFPO0lBREU7O2lDQUdYLFVBQUEsR0FBWSxTQUFBO0FBQ1YsYUFBTztJQURHOztpQ0FHWixTQUFBLEdBQVcsU0FBQTtNQUNULE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosRUFBbUMsSUFBQyxDQUFBLElBQXBDO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE1BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixLQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLElBQUMsQ0FBQSxPQUhUO0FBSUEsYUFBTztJQVBFOztpQ0FVWCxPQUFBLEdBQVMsU0FBQyxPQUFEO01BQ1AsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFoQjtRQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYixFQUFtQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7UUFDQSxPQUFPLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFdBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiO1VBQVQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRlIsRUFGRjs7YUFLQSxPQUFPLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLEtBRGpCLENBRUUsQ0FBQyxLQUZILENBRVMsT0FGVCxFQUVrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUNkLGlCQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUYsR0FBa0I7UUFEWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGbEIsQ0FJRSxDQUFDLE1BSkgsQ0FJVSxNQUpWLENBS0ksQ0FBQyxJQUxMLENBS1UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFiLENBQUEsR0FBOEI7UUFBckM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFY7SUFOTzs7OztLQXpDNkIsTUFBTSxDQUFDO0FBQS9DOzs7QUNBQTtBQUFBLE1BQUE7Ozs7RUFBTSxNQUFNLENBQUM7OztJQU1FLGtCQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7OztNQUVYLDBDQUFNLEVBQU4sRUFBVSxPQUFWO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBaUIsRUFBRSxDQUFDLE1BQUgsQ0FBVSxNQUFWO01BQ2pCLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVjtBQUNqQixhQUFPO0lBTEk7O3VCQVdiLE1BQUEsR0FBUSxTQUFBO01BQ04sbUNBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLFVBQVY7SUFGTjs7dUJBSVIsU0FBQSxHQUFXLFNBQUE7TUFFVCxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLEVBQUUsQ0FBQyxrQkFBdEI7QUFDVCxhQUFPO0lBSEU7O3VCQUtYLFFBQUEsR0FBVSxTQUFDLFFBQUQsRUFBVyxPQUFYO01BQ1IsRUFBRSxDQUFDLEtBQUgsQ0FBQSxDQUNFLENBQUMsS0FESCxDQUNTLEVBQUUsQ0FBQyxHQURaLEVBQ2lCLFFBRGpCLENBRUUsQ0FBQyxLQUZILENBRVMsRUFBRSxDQUFDLElBRlosRUFFa0IsT0FGbEIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxHQUFkO1VBQ0wsS0FBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsYUFBYjtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBZSxHQUFmO1FBRks7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSFQ7QUFNQSxhQUFPO0lBUEM7O3VCQVNWLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxHQUFQO01BQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDUixJQUFDLENBQUEsY0FBRCxDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYO0FBQ0EsYUFBTztJQU5BOzt1QkFRVCxjQUFBLEdBQWdCLFNBQUE7TUFDZCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYztRQUFDLENBQUQsRUFBSSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQUMsQ0FBQSxJQUFSLEVBQWMsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQztRQUFULENBQWQsQ0FBSjtPQUFkO01BQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxDQUFaO0FBQ0EsYUFBTztJQUhPOzt1QkFLaEIsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsY0FBQSxHQUFpQjtNQUNqQixVQUFBLEdBQWEsSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNiLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLEdBQWxCLENBQ1IsQ0FBQyxJQURPLENBQ0YsT0FERSxFQUNPLFFBRFAsQ0FFUixDQUFDLElBRk8sQ0FFRixJQUFDLENBQUEsaUJBRkM7TUFJVixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxVQURSLENBRUUsQ0FBQyxLQUZILENBQUEsQ0FFVSxDQUFDLE1BRlgsQ0FFa0IsTUFGbEIsQ0FHSSxDQUFDLElBSEwsQ0FHVSxHQUhWLEVBR2UsU0FBQyxDQUFELEVBQUcsQ0FBSDtlQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsY0FBQSxHQUFlLENBQUMsQ0FBQSxHQUFFLENBQUMsVUFBVSxDQUFDLE1BQVgsR0FBa0IsQ0FBbkIsQ0FBSCxDQUExQjtNQUFULENBSGYsQ0FJSSxDQUFDLElBSkwsQ0FJVSxPQUpWLEVBSW1CLGNBSm5CLENBS0ksQ0FBQyxJQUxMLENBS1UsUUFMVixFQUtvQixDQUxwQixDQU1JLENBQUMsSUFOTCxDQU1VLE1BTlYsRUFNa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sS0FBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTmxCO01BT0EsVUFBVSxDQUFDLEtBQVgsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLFVBRFIsQ0FFRSxDQUFDLEtBRkgsQ0FBQSxDQUVVLENBQUMsTUFGWCxDQUVrQixNQUZsQixDQUdJLENBQUMsSUFITCxDQUdVLEdBSFYsRUFHZSxTQUFDLENBQUQsRUFBRyxDQUFIO2VBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxjQUFBLEdBQWUsQ0FBQyxDQUFBLEdBQUUsR0FBRixHQUFNLENBQUMsVUFBVSxDQUFDLE1BQVgsR0FBa0IsQ0FBbkIsQ0FBUCxDQUExQjtNQUFULENBSGYsQ0FJSSxDQUFDLElBSkwsQ0FJVSxHQUpWLEVBSWUsRUFKZixDQUtJLENBQUMsSUFMTCxDQUtVLGFBTFYsRUFLeUIsT0FMekIsQ0FNSSxDQUFDLElBTkwsQ0FNVSxTQUFDLENBQUQ7ZUFBTztNQUFQLENBTlY7SUFoQlU7O3VCQXdCWixTQUFBLEdBQVcsU0FBQyxHQUFEO01BRVQsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQWxDO01BQ2IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQUFYLEdBQXNCLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQXBCLENBQTJCLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxFQUFGLEtBQVE7TUFBZixDQUEzQjtNQUV0QixJQUFDLENBQUEsVUFBRCxHQUFjLEVBQUUsQ0FBQyxjQUFILENBQUE7TUFDZCxJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUNOLENBQUMsVUFESyxDQUNNLElBQUMsQ0FBQSxVQURQO01BR1IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLFVBQXJCLENBQ0EsQ0FBQyxJQURELENBQ00sSUFBQyxDQUFBLFNBQVMsQ0FBQyxRQURqQixDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLE1BRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsSUFIUixFQUdjLFNBQUMsQ0FBRDtlQUFPLFVBQUEsR0FBVyxDQUFDLENBQUM7TUFBcEIsQ0FIZCxDQUlFLENBQUMsSUFKSCxDQUlRLE9BSlIsRUFJaUIsU0FBQyxDQUFEO2VBQU87TUFBUCxDQUpqQixDQUtFLENBQUMsSUFMSCxDQUtRLE1BTFIsRUFLZ0IsSUFBQyxDQUFBLGVBTGpCLENBTUUsQ0FBQyxJQU5ILENBTVEsY0FOUixFQU13QixDQU54QixDQU9FLENBQUMsSUFQSCxDQU9RLFFBUFIsRUFPa0IsSUFBQyxDQUFBLGVBUG5CLENBUUUsQ0FBQyxJQVJILENBUVEsR0FSUixFQVFhLElBQUMsQ0FBQSxJQVJkO01BVUEsSUFBRyxJQUFDLENBQUEsUUFBSjtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixVQUFyQixDQUNFLENBQUMsRUFESCxDQUNNLFdBRE4sRUFDbUIsSUFBQyxDQUFBLFdBRHBCLENBRUUsQ0FBQyxFQUZILENBRU0sV0FGTixFQUVtQixJQUFDLENBQUEsV0FGcEIsQ0FHRSxDQUFDLEVBSEgsQ0FHTSxVQUhOLEVBR2tCLElBQUMsQ0FBQSxVQUhuQixFQURGOztNQU1BLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLGVBQWI7QUFDQSxhQUFPO0lBNUJFOzt1QkE4QlgsV0FBQSxHQUFhLFNBQUMsSUFBRDtNQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO01BQ1IsSUFBQyxDQUFBLGNBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixVQUFyQixDQUNFLENBQUMsVUFESCxDQUFBLENBRUksQ0FBQyxJQUZMLENBRVUsTUFGVixFQUVrQixJQUFDLENBQUEsZUFGbkIsQ0FHSSxDQUFDLElBSEwsQ0FHVSxRQUhWLEVBR29CLElBQUMsQ0FBQSxlQUhyQjtJQUhXOzt1QkFRYixxQkFBQSxHQUF1QixTQUFBO01BQ3JCLGtEQUFBO01BQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsSUFBQyxDQUFBLFVBQWxCO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLFVBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsR0FEUixFQUNhLElBQUMsQ0FBQSxJQURkO01BRUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsaUJBQWQsRUFERjs7QUFFQSxhQUFPO0lBUmM7O3VCQVV2QixpQkFBQSxHQUFtQixTQUFBO2FBQ2pCLElBQUMsQ0FBQSxVQUNDLENBQUMsT0FESCxDQUNXLENBQUMsSUFBQyxDQUFBLEtBQUYsRUFBUyxJQUFDLENBQUEsTUFBVixDQURYLEVBQzhCLElBQUMsQ0FBQSxTQUQvQixDQUVFLENBQUMsS0FGSCxDQUVZLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBLENBQUEsR0FBc0IsR0FGbEMsQ0FHRSxDQUFDLFNBSEgsQ0FHYSxDQUFDLElBQUMsQ0FBQSxLQUFELEdBQU8sSUFBUixFQUFjLElBQUMsQ0FBQSxNQUFELEdBQVEsR0FBdEIsQ0FIYjtJQURpQjs7dUJBTW5CLGVBQUEsR0FBaUIsU0FBQyxDQUFEO0FBQ2YsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsUUFBRixLQUFjLENBQUMsQ0FBQztNQUF2QixDQUFiO01BQ0QsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFUO2VBQWlCLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWhCLEVBQWpCO09BQUEsTUFBQTtlQUE2QyxPQUE3Qzs7SUFGUTs7dUJBSWpCLGlCQUFBLEdBQW1CLFNBQUMsT0FBRDthQUNqQixPQUFPLENBQUMsSUFBUixDQUFhLFdBQWIsRUFBMEIsWUFBQSxHQUFhLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQUQsR0FBTyxHQUFsQixDQUFiLEdBQW9DLEdBQXBDLEdBQXdDLENBQUMsQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFsQixDQUF4QyxHQUErRCxHQUF6RjtJQURpQjs7dUJBR25CLGFBQUEsR0FBZSxTQUFBO0FBQ2IsYUFBTyxFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsRUFBWSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBNUI7SUFETTs7dUJBR2YsV0FBQSxHQUFhLFNBQUMsQ0FBRDtBQUNYLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLFFBQUYsS0FBYyxDQUFDLENBQUM7TUFBdkIsQ0FBYjtNQUNSLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtRQUNFLFFBQUEsR0FBVyxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBbEI7UUFFWCxJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFNLENBQUEsQ0FBQSxDQUF0QjtRQUVBLE1BQUEsR0FBUyxDQUFBLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFYLENBQWtCLENBQUMsTUFBbkIsQ0FBQTtlQUNULElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUNFO1VBQUEsTUFBQSxFQUFXLFFBQVMsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFDLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBLENBQUEsR0FBb0IsR0FBckIsQ0FBekI7VUFDQSxLQUFBLEVBQVcsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLENBQUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQUEsQ0FBQSxHQUFxQixHQUF0QixDQUR6QjtVQUVBLFNBQUEsRUFBVyxHQUZYO1NBREYsRUFORjs7SUFGVzs7dUJBYWIsV0FBQSxHQUFhLFNBQUMsQ0FBRDtBQUNYLFVBQUE7TUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQWxCO2FBQ1gsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQ0U7UUFBQSxNQUFBLEVBQVcsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLENBQUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBQSxHQUFvQixHQUFyQixDQUF6QjtRQUNBLEtBQUEsRUFBVyxRQUFTLENBQUEsQ0FBQSxDQUFULEdBQWMsQ0FBQyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBQSxDQUFBLEdBQXFCLEdBQXRCLENBRHpCO09BREY7SUFGVzs7dUJBTWIsVUFBQSxHQUFZLFNBQUMsQ0FBRDthQUNWLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLFNBQWQsRUFBeUIsR0FBekI7SUFEVTs7dUJBR1osY0FBQSxHQUFnQixTQUFDLENBQUQ7TUFDZCxJQUFDLENBQUEsUUFDQyxDQUFDLElBREgsQ0FDUSx1QkFEUixDQUVFLENBQUMsSUFGSCxDQUVRLENBQUMsQ0FBQyxJQUZWO01BR0EsSUFBQyxDQUFBLFFBQ0MsQ0FBQyxJQURILENBQ1EsdUJBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsV0FBRCxDQUFhLENBQUMsQ0FBQyxLQUFmLENBRlI7TUFHQSxJQUFHLENBQUMsQ0FBQyxLQUFMO2VBQ0UsSUFBQyxDQUFBLFFBQ0MsQ0FBQyxJQURILENBQ1EsdUJBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUMsQ0FBQyxLQUFqQixDQUZSLEVBREY7O0lBUGM7Ozs7S0E5SlksTUFBTSxDQUFDO0FBQXJDOzs7QUNBQTtBQUFBLE1BQUE7OztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7Ozs7Ozs7O0lBQUEsWUFBQSxHQUFlOzt3Q0FJZixhQUFBLEdBQWUsU0FBQTtBQUNiLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxHQUFKO1FBQ0UsVUFBQSxHQUFhLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQUE7UUFDYixJQUFDLENBQUEsY0FBRCxHQUFtQixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQTtRQUNuQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDO1FBRTlDLElBQUcsSUFBQyxDQUFBLGVBQUQsR0FBbUIsVUFBdEI7VUFDRSxJQUFDLENBQUEsZUFBRCxHQUFtQjtVQUNuQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDO1VBQzlDLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLEtBQVQsRUFBZ0IsQ0FBaEIsRUFIRjtTQUFBLE1BQUE7VUFNRSxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLENBQUMsVUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFiLENBQUEsR0FBZ0MsQ0FBaEQsRUFORjs7UUFPQSxJQUFDLENBQUEsS0FBRCxHQUFVLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQWxDLEdBQXlDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ25FLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbkMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FickU7O0FBY0EsYUFBTztJQWZNOzt3Q0FrQmYsY0FBQSxHQUFnQixTQUFBO01BQ2QsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFkO0FBQ0EsYUFBTztJQUZPOzs7QUFLaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0NBdUJBLFdBQUEsR0FBYSxTQUFDLEtBQUQ7TUFDWCxJQUFHLEtBQUEsS0FBUyxJQUFDLENBQUEsWUFBYjtRQUVFLElBQUMsQ0FBQSxZQUFELEdBQWdCO1FBQ2hCLElBQUcsS0FBQSxLQUFTLENBQVo7VUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBYyxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUUsQ0FBQSxzQkFBQTtVQUFwQixDQUFkLEVBREY7U0FBQSxNQUVLLElBQUcsS0FBQSxLQUFTLENBQVo7VUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBYyxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUUsQ0FBQSxLQUFBO1VBQXBCLENBQWQsRUFERztTQUFBLE1BRUEsSUFBRyxLQUFBLEtBQVMsQ0FBWjtVQUNILElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBRSxDQUFBLE1BQUE7VUFBcEIsQ0FBZCxFQURHO1NBQUEsTUFFQSxJQUFHLEtBQUEsS0FBUyxDQUFaO1VBQ0gsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFFLENBQUEsYUFBQTtVQUFwQixDQUFkLEVBREc7U0FBQSxNQUVBLElBQUcsS0FBQSxLQUFTLENBQVo7VUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBYyxTQUFDLENBQUQ7bUJBQU8sQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUUsQ0FBQSxZQUFBO1VBQXBCLENBQWQsRUFERztTQUFBLE1BRUEsSUFBRyxLQUFBLEtBQVMsQ0FBWjtVQUNILElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFNBQUMsQ0FBRDttQkFBTyxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBRSxDQUFBLHdCQUFBO1VBQXBCLENBQWQsRUFERzs7ZUFFTCxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkLEVBZkY7O0lBRFc7Ozs7S0FwRGdDLE1BQU0sQ0FBQztBQUF0RDs7O0FDQUE7QUFBQSxNQUFBOzs7O0VBQU0sTUFBTSxDQUFDOzs7SUFNRSxzQkFBQyxFQUFELEVBQUssT0FBTDs7OztNQUNYLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQU8sQ0FBQyxPQUFSLElBQW1CO01BQ3JDLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLE9BQU8sQ0FBQyxZQUFSLElBQXdCO01BQy9DLE9BQU8sQ0FBQyxrQkFBUixHQUE2QixPQUFPLENBQUMsa0JBQVIsSUFBOEI7TUFDM0QsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLE9BQU8sQ0FBQyxnQkFBUixJQUE0QjtNQUN2RCw4Q0FBTSxFQUFOLEVBQVUsT0FBVjtBQUNBLGFBQU87SUFOSTs7MkJBYWIsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPO0lBREc7OzJCQUlaLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBZixDQUFrQixDQUFDLE1BQW5CLENBQTBCLEtBQTFCLENBQ1gsQ0FBQyxJQURVLENBQ0wsT0FESyxFQUNJLGlCQURKLENBRVgsQ0FBQyxLQUZVLENBRUosUUFGSSxFQUVNLElBQUMsQ0FBQSxNQUFELEdBQVEsSUFGZDtJQURQOzsyQkFLUixTQUFBLEdBQVcsU0FBQTtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUNULENBQUMsSUFEUSxDQUNILENBQUMsSUFBQyxDQUFBLEtBQUYsRUFBUyxJQUFDLENBQUEsTUFBVixDQURHLENBRVQsQ0FBQyxPQUZRLENBRUEsQ0FGQSxDQUdULENBQUMsS0FIUSxDQUdGLElBSEU7TUFLWCxJQUFHLElBQUMsQ0FBQSxLQUFELElBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBdEI7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFFLENBQUMsWUFBakIsRUFERjs7TUFHQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDO01BQVQsQ0FBdkI7TUFFWixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLElBQVgsQ0FDYixDQUFDLEdBRFksQ0FDUixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBYjtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURRLENBRWIsQ0FBQyxJQUZZLENBRVAsU0FBQyxDQUFELEVBQUksQ0FBSjtlQUFVLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDO01BQXRCLENBRk87TUFHZixJQUFDLENBQUEsT0FBRCxDQUFTLElBQUMsQ0FBQSxXQUFWO01BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsT0FBckIsQ0FDUCxDQUFDLElBRE0sQ0FDRCxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBQSxDQURDLENBRVAsQ0FBQyxLQUZNLENBQUEsQ0FFQyxDQUFDLE1BRkYsQ0FFUyxLQUZULENBT0wsQ0FBQyxJQVBJLENBT0MsSUFBQyxDQUFBLE9BUEYsQ0FRTCxDQUFDLElBUkksQ0FRQyxJQUFDLENBQUEsZ0JBUkY7TUFVVCxJQUFDLENBQUEsZUFBRCxDQUFBO0FBRUEsYUFBTztJQTdCRTs7MkJBK0JYLFdBQUEsR0FBYSxTQUFBO01BRVgsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxJQUFYLENBQ2IsQ0FBQyxHQURZLENBQ1IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQWI7UUFBVDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUSxDQUViLENBQUMsSUFGWSxDQUVQLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQztNQUF0QixDQUZPO01BR2YsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsV0FBVjtNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFpQixhQUFqQixDQUErQixDQUFDLE1BQWhDLENBQUE7TUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBQSxDQUFaLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLE9BRFQsQ0FFRSxDQUFDLFVBRkgsQ0FBQSxDQUdFLENBQUMsUUFISCxDQUdZLElBQUMsQ0FBQSxPQUFPLENBQUMsa0JBSHJCLENBSUUsQ0FBQyxFQUpILENBSU0sS0FKTixFQUlhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFELEVBQUcsQ0FBSDtVQUNULElBQUksQ0FBQSxLQUFLLEtBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBQUEsR0FBYyxDQUF2QjttQkFDRSxLQUFDLENBQUEsZUFBRCxDQUFBLEVBREY7O1FBRFM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmIsQ0FPRSxDQUFDLElBUEgsQ0FPUSxJQUFDLENBQUEsZ0JBUFQ7QUFTQSxhQUFPO0lBcEJJOzsyQkFzQmIsZUFBQSxHQUFpQixTQUFBO01BRWYsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsS0FBZCxDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsWUFEakIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxZQUZULEVBRXVCLFFBRnZCLENBR0UsQ0FBQyxJQUhILENBR1EsSUFBQyxDQUFBLFlBSFQ7YUFNQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsa0JBQWYsQ0FDRSxDQUFDLFNBREgsQ0FDYSxhQURiLENBRUksQ0FBQyxLQUZMLENBRVcsWUFGWCxFQUV5QixTQUZ6QjtJQVJlOzsyQkFZakIsYUFBQSxHQUFlLFNBQUE7TUFDYiw4Q0FBQTtNQUNBLElBQUcsSUFBQyxDQUFBLEtBQUQsSUFBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUF0QjtRQUNFLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQTtRQUNwQixJQUFDLENBQUEsTUFBRCxHQUFtQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFuQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUY5RTs7QUFHQSxhQUFPO0lBTE07OzJCQU9mLHFCQUFBLEdBQXVCLFNBQUE7TUFDckIsc0RBQUE7TUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsSUFBQyxDQUFBLE1BQUQsR0FBUSxJQUFuQztNQUtBLElBQUcsSUFBQyxDQUFBLEtBQUQsSUFBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUF0QjtRQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEVBQUUsQ0FBQyxZQUFqQixFQURGO09BQUEsTUFBQTtRQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEVBQUUsQ0FBQyxlQUFqQixFQUhGOztNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLENBQUMsSUFBQyxDQUFBLEtBQUYsRUFBUyxJQUFDLENBQUEsTUFBVixDQUFkO01BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsV0FBVjtNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFBLENBQVo7TUFHQSxJQUFDLENBQUEsS0FDQyxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsT0FEVCxDQUVFLENBQUMsSUFGSCxDQUVRLElBQUMsQ0FBQSxnQkFGVCxDQUdFLENBQUMsTUFISCxDQUdVLElBQUMsQ0FBQSxrQkFIWCxDQUlFLENBQUMsU0FKSCxDQUlhLGFBSmIsQ0FLSSxDQUFDLEtBTEwsQ0FLVyxZQUxYLEVBS3lCLFNBTHpCO0FBT0EsYUFBTztJQTFCYzs7MkJBNkJ2QixZQUFBLEdBQWMsU0FBQyxDQUFEO0FBQ1osYUFBTztJQURLOzsyQkFHZCxPQUFBLEdBQVMsU0FBQyxTQUFEO2FBQ1AsU0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLElBQUMsQ0FBQSxZQURsQixDQUVFLENBQUMsS0FGSCxDQUVTLFNBRlQsRUFFdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFJLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsR0FBWSxDQUFBLEdBQUUsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUF2QixJQUF1QyxDQUFDLENBQUMsRUFBRixHQUFLLENBQUMsQ0FBQyxFQUFQLEdBQVksQ0FBQSxHQUFFLEtBQUMsQ0FBQSxPQUFPLENBQUMsWUFBbEU7bUJBQXFGLEtBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxHQUFzQixLQUEzRztXQUFBLE1BQUE7bUJBQXFILEVBQXJIOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZ2QixDQUlFLENBQUMsS0FKSCxDQUlTLFlBSlQsRUFJdUIsU0FBQyxDQUFEO1FBQU8sSUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsS0FBYSxDQUFkLENBQUEsSUFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRixHQUFLLENBQUMsQ0FBQyxFQUFQLEtBQWEsQ0FBZCxDQUF2QjtpQkFBNkMsU0FBN0M7U0FBQSxNQUFBO2lCQUEyRCxHQUEzRDs7TUFBUCxDQUp2QjtJQURPOzsyQkFTVCxZQUFBLEdBQWMsU0FBQyxTQUFEO0FBQ1osVUFBQTtNQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixLQUFqQixDQUNOLENBQUMsSUFESyxDQUNBLE9BREEsRUFDUyxvQkFEVDs7QUFFUjs7Ozs7Ozs7YUFRQSxLQUFLLENBQUMsTUFBTixDQUFhLEdBQWIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFNBQUMsQ0FBRDtRQUFjLElBQUcsQ0FBQyxDQUFDLEtBQUYsR0FBVSxFQUFiO2lCQUFxQixTQUFyQjtTQUFBLE1BQW1DLElBQUcsQ0FBQyxDQUFDLEtBQUYsR0FBVSxFQUFiO2lCQUFxQixTQUFyQjtTQUFBLE1BQUE7aUJBQW1DLEdBQW5DOztNQUFqRCxDQURqQixDQUVFLENBQUMsSUFGSCxDQUVRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQyxJQUFLLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtRQUFkO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSO0lBWFk7OzJCQWVkLGdCQUFBLEdBQWtCLFNBQUMsU0FBRDthQUNoQixTQUNFLENBQUMsS0FESCxDQUNTLE1BRFQsRUFDbUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEVBQUYsR0FBTztNQUFkLENBRG5CLENBRUUsQ0FBQyxLQUZILENBRVMsS0FGVCxFQUVtQixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsRUFBRixHQUFPO01BQWQsQ0FGbkIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxPQUhULEVBR21CLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsR0FBWTtNQUFuQixDQUhuQixDQUlFLENBQUMsS0FKSCxDQUlTLFFBSlQsRUFJbUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxHQUFZO01BQW5CLENBSm5CO0lBRGdCOzsyQkFRbEIsa0JBQUEsR0FBb0IsU0FBQyxDQUFEO0FBQ2xCLGFBQU8sQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxHQUFZLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBckIsSUFBZ0MsQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxHQUFZLElBQUMsQ0FBQSxPQUFPLENBQUM7SUFEMUM7Ozs7S0FwS1ksTUFBTSxDQUFDO0FBQXpDOzs7QUNBQTtBQUFBLE1BQUE7Ozs7RUFBTSxNQUFNLENBQUM7Ozs7Ozs7OzRDQUdYLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxZQUFQLEVBQXFCLFlBQXJCOztBQUNWOzs7Ozs7O0FBQUEsVUFBQTtNQVFBLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVU7TUFBakIsQ0FBWjtNQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBYSxDQUFBLENBQUEsQ0FBekI7TUFFQSxDQUFBLENBQUUscUNBQUYsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxZQUE5QztNQUVBLE9BQUEsR0FBVTtNQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQXJCLENBQTZCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFELEVBQUssQ0FBTDtVQUMzQixJQUFHLFlBQWEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxHQUFBLENBQW5CO21CQUNFLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FDRTtjQUFBLEVBQUEsRUFBSSxHQUFHLENBQUMsV0FBSixDQUFBLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsSUFBMUIsRUFBZ0MsR0FBaEMsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QyxHQUE3QyxFQUFrRCxFQUFsRCxDQUFxRCxDQUFDLE9BQXRELENBQThELEdBQTlELEVBQW1FLEVBQW5FLENBQUo7Y0FDQSxJQUFBLEVBQU0sS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFhLENBQUEsQ0FBQSxDQUQ1QjtjQUVBLEtBQUEsRUFBTyxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxHQUFBLENBRnhCO2NBRko7V0FBQSxNQUFBO21CQU1FLE9BQU8sQ0FBQyxHQUFSLENBQVksc0JBQUEsR0FBeUIsR0FBckMsRUFORjs7UUFEMkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO01BUUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaO0FBRUEsV0FBQSxjQUFBOztRQUNFLElBQUcsR0FBQSxLQUFPLHNCQUFQLElBQWtDLEdBQUEsS0FBTyx3QkFBekMsSUFBc0UsTUFBTSxDQUFDLEtBQVAsR0FBZSxDQUF4RjtVQUNFLE9BQVEsQ0FBQSxzQkFBQSxDQUF1QixDQUFDLEtBQWhDLElBQXlDLE1BQU0sQ0FBQztVQUNoRCxPQUFPLE9BQVEsQ0FBQSxHQUFBLEVBRmpCOztBQURGO01BS0EsVUFBQSxHQUFhO1FBQUM7VUFBQyxFQUFBLEVBQUksR0FBTDtTQUFEOztBQUNiLFdBQUEsY0FBQTs7UUFDRSxVQUFVLENBQUMsSUFBWCxDQUNFO1VBQUEsRUFBQSxFQUFJLE1BQU0sQ0FBQyxFQUFYO1VBQ0EsSUFBQSxFQUFNLFVBQUEsR0FBYyxNQUFNLENBQUMsSUFBckIsR0FBNEIsZ0JBQTVCLEdBQStDLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBTSxDQUFDLEtBQWxCLENBQS9DLEdBQTBFLEdBRGhGO1VBRUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUZkO1VBR0EsTUFBQSxFQUFRLEdBSFI7U0FERjtBQURGO01BTUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFaO0FBQ0EsYUFBTztJQXRDRzs7NENBeUNaLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxZQUFQLEVBQXFCLFlBQXJCO01BQ1AsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxZQUFiLEVBQTJCLFlBQTNCLEVBQXlDLFlBQXpDO01BQ1IsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsZUFBYjtBQUNBLGFBQU87SUFOQTs7NENBUVQsVUFBQSxHQUFZLFNBQUMsWUFBRCxFQUFlLFlBQWY7TUFDVixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLFlBQWIsRUFBMkIsWUFBM0IsRUFBeUMsWUFBekM7TUFDUixJQUFDLENBQUEsV0FBRCxDQUFBO0FBQ0EsYUFBTztJQUhHOzs0Q0FNWixRQUFBLEdBQVUsU0FBQTtNQUNSLDBEQUFBO01BQ0EsSUFBQyxDQUFBLGtCQUFELENBQUE7QUFDQSxhQUFPO0lBSEM7OzRDQU1WLFlBQUEsR0FBYyxTQUFDLENBQUQ7QUFDWixhQUFPLFlBQUEsR0FBYSxDQUFDLENBQUM7SUFEVjs7NENBR2Qsa0JBQUEsR0FBb0IsU0FBQTthQUNsQixJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLENBQUMsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBQSxDQUFBLEdBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFBLENBQXBCLENBQUEsR0FBbUMsR0FBbkQ7SUFEa0I7Ozs7S0FuRTZCLE1BQU0sQ0FBQztBQUExRDs7O0FDQUE7QUFBQSxNQUFBOzs7O0VBQU0sTUFBTSxDQUFDOzs7SUFLRSxrQ0FBQyxFQUFELEVBQUssT0FBTDs7Ozs7Ozs7O01BRVgsT0FBTyxDQUFDLE9BQVIsR0FBa0IsT0FBTyxDQUFDLE9BQVIsSUFBbUI7TUFDckMsT0FBTyxDQUFDLFVBQVIsR0FBcUIsT0FBTyxDQUFDLFVBQVIsSUFBc0I7TUFDM0MsT0FBTyxDQUFDLFVBQVIsR0FBcUIsT0FBTyxDQUFDLFVBQVIsSUFBc0I7TUFDM0MsT0FBTyxDQUFDLElBQVIsR0FBZSxPQUFPLENBQUMsSUFBUixJQUFnQjtNQUMvQiwwREFBTSxFQUFOLEVBQVUsT0FBVjtBQUNBLGFBQU87SUFQSTs7dUNBYWIsU0FBQSxHQUFXLFNBQUE7TUFFVCxJQUFDLENBQUEsT0FBRCxDQUFBO01BR0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7YUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsSUFEVCxDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLFFBRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsT0FIUixFQUdpQixLQUhqQixDQUlFLENBQUMsSUFKSCxDQUlRLElBSlIsRUFJYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxNQUFBLEdBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7UUFBaEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmQsQ0FLRSxDQUFDLElBTEgsQ0FLUSxJQUFDLENBQUEsTUFMVCxDQU1FLENBQUMsRUFOSCxDQU1NLFdBTk4sRUFNbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaO1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTm5CO0lBUlM7O3VDQWdCWCxNQUFBLEdBQVEsU0FBQyxTQUFEO2FBQ04sU0FDRSxDQUFDLElBREgsQ0FDUSxHQURSLEVBQ2MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLEtBQUMsQ0FBQSxJQUFKO21CQUFjLENBQUMsQ0FBQyxPQUFoQjtXQUFBLE1BQUE7bUJBQTRCLEtBQUMsQ0FBQSxPQUFPLENBQUMsUUFBckM7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsVUFGVCxDQUdFLENBQUMsSUFISCxDQUdRLElBQUMsQ0FBQSxjQUhUO0lBRE07O3VDQU1SLGFBQUEsR0FBZSxTQUFBO0FBRWIsVUFBQTtNQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsTUFBSCxDQUFVLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBTDtRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWO01BQ1QsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEI7YUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQUMsQ0FBQSxJQUFwQixDQUNaLENBQUMsS0FEVyxDQUNMLEdBREssRUFDQSxNQURBLENBRVosQ0FBQyxLQUZXLENBRUwsR0FGSyxFQUVBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLEtBQUQsR0FBTyxFQUFqQixDQUZBLENBR1osQ0FBQyxLQUhXLENBR0wsU0FISyxFQUdNLEVBQUUsQ0FBQyxZQUFILENBQWdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQWMsSUFBRyxLQUFDLENBQUEsSUFBSjttQkFBYyxDQUFDLENBQUMsTUFBRixHQUFTLEVBQXZCO1dBQUEsTUFBQTttQkFBOEIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULEdBQWlCLEVBQS9DOztRQUFkO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQUhOLENBSVosQ0FBQyxJQUpXLENBQUE7SUFKRDs7dUNBVWYsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsQ0FBQSxHQUFJO0FBQ0o7YUFBTSxDQUFBLEdBQUksR0FBVjtRQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBO3FCQUNBLEVBQUU7TUFGSixDQUFBOztJQUZhOzt1Q0FNZixjQUFBLEdBQWdCLFNBQUMsU0FBRDthQUNkLFNBQ0UsQ0FBQyxJQURILENBQ1EsSUFEUixFQUNjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsS0FBaUIsQ0FBcEI7bUJBQTJCLENBQUMsQ0FBQyxFQUE3QjtXQUFBLE1BQUE7bUJBQW9DLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMLENBQVgsRUFBcEM7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUZSLEVBRWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxLQUFpQixDQUFwQjttQkFBMkIsQ0FBQyxDQUFDLEVBQTdCO1dBQUEsTUFBQTttQkFBb0MsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUwsQ0FBWCxFQUFwQzs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGZDtJQURjOzt1Q0FLaEIsVUFBQSxHQUFZLFNBQUMsU0FBRDthQUNWLFNBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixFQUF1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBYixJQUF1QixLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsS0FBaUIsQ0FBM0M7bUJBQWtELEtBQUMsQ0FBQSxLQUFELENBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQWIsQ0FBVCxFQUFsRDtXQUFBLE1BQUE7bUJBQW9GLFVBQXBGOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtJQURVOzt1Q0FHWixPQUFBLEdBQVMsU0FBQyxJQUFEO01BQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULEdBQWdCO2FBQ2hCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixNQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxVQURULENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLGNBRlQ7SUFGTzs7dUNBTVQsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxJQUFKO2VBQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUNaLENBQUMsQ0FBQyxNQUFGLEdBQVcsS0FBQyxDQUFBLElBQUQsQ0FBTSxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBYixDQUFSO1VBREM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsRUFERjs7SUFETzs7dUNBS1QscUJBQUEsR0FBdUIsU0FBQTtNQUVyQixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCO01BQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQWdCLElBQUMsQ0FBQSxLQUFqQjtNQUNBLGtFQUFBO01BQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsY0FEVDtBQUVBLGFBQU87SUFUYzs7dUNBZXZCLFNBQUEsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLENBQUQsR0FBSyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQ0gsQ0FBQyxRQURFLENBQ08sS0FEUCxDQUVILENBQUMsS0FGRSxDQUVJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FGSjtNQUlMLElBQUMsQ0FBQSxDQUFELEdBQUssRUFBRSxDQUFDLFdBQUgsQ0FBQSxDQUNILENBQUMsS0FERSxDQUNJLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FESjtNQUdMLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBaEI7UUFHRSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FDTixDQUFDLFFBREssQ0FDSSxHQURKLENBRU4sQ0FBQyxLQUZLLENBRUMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZELEVBSFY7O01BT0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFoQjtRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBRSxDQUFDLGNBQUgsQ0FBQSxDQUNQLENBQUMsS0FETSxDQUNBLEVBQUUsQ0FBQyxhQUFjLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBcEIsQ0FBQSxDQURBLEVBRFg7O01BSUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxDQUFmLENBQ1AsQ0FBQyxRQURNLENBQ0csSUFBQyxDQUFBLE1BREo7TUFFVCxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBQyxDQUFBLENBQWIsQ0FDUCxDQUFDLFFBRE0sQ0FDRyxJQUFDLENBQUEsS0FESjtBQUVULGFBQU87SUF4QkU7O3VDQTBCWCxlQUFBLEdBQWlCLFNBQUE7QUFDZixhQUFPLENBQUMsR0FBRCxFQUFNLEtBQU47SUFEUTs7dUNBR2pCLGVBQUEsR0FBaUIsU0FBQTtBQUNmLGFBQU87UUFBQyxDQUFELEVBQUksRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFDLENBQUEsSUFBUixFQUFjLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBQUo7O0lBRFE7O3VDQUdqQixZQUFBLEdBQWMsU0FBQTtBQUNaLGFBQU8sQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLFVBQVYsRUFBc0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUEvQjtJQURLOzt1Q0FHZCxhQUFBLEdBQWUsU0FBQTtBQUNiLGFBQU87UUFBQyxDQUFELEVBQUksRUFBRSxDQUFDLEdBQUgsQ0FBTyxJQUFDLENBQUEsSUFBUixFQUFjLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBQUo7O0lBRE07O3VDQUdmLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLGFBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWIsRUFBb0IsTUFBcEI7SUFETzs7dUNBR2hCLFVBQUEsR0FBWSxTQUFBO01BRVYsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BQ0EsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BQ0EsSUFBRyxJQUFDLENBQUEsSUFBSjtRQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBYixFQURGOztNQUVBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWQsRUFERjs7QUFFQSxhQUFPO0lBUkc7O3VDQVVaLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBRyxJQUFDLENBQUEsR0FBSjtRQUNFLElBQUMsQ0FBQSxjQUFELEdBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBO1FBQ25CLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUM7UUFDOUMsSUFBQyxDQUFBLEtBQUQsR0FBbUIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBbEMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDNUUsSUFBQyxDQUFBLE1BQUQsR0FBbUIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbkMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FKOUU7O0FBS0EsYUFBTztJQU5NOzs7O0tBN0k2QixNQUFNLENBQUM7QUFBckQ7OztBQ0VBO0VBQUEsQ0FBQyxTQUFDLENBQUQ7QUFFQyxRQUFBO0lBQUEsVUFBQSxHQUFhO0lBQ2IsTUFBQSxHQUFTO0lBQ1QsUUFBQSxHQUFXO0lBQ1gsZUFBQSxHQUFrQjtJQUVsQixXQUFBLEdBQWM7SUFFZCxvQkFBQSxHQUF1QjtJQUd2QixJQUFBLEdBQVUsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmO0lBQ1YsT0FBQSxHQUFVLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsU0FBZjtJQUtWLElBQUcsSUFBQSxLQUFRLElBQVg7TUFDRSxFQUFFLENBQUMsbUJBQUgsQ0FBdUI7UUFDckIsVUFBQSxFQUFZLENBQUMsR0FBRCxFQUFLLEVBQUwsQ0FEUztRQUVyQixTQUFBLEVBQVcsR0FGVTtRQUdyQixXQUFBLEVBQWEsR0FIUTtRQUlyQixVQUFBLEVBQVksQ0FBQyxDQUFELENBSlM7T0FBdkIsRUFERjs7SUFRQSxZQUFBLEdBQWUsQ0FDYixzQkFEYSxFQUViLG9CQUZhLEVBR2IsS0FIYSxFQUliLFNBSmEsRUFLYixZQUxhLEVBTWIsTUFOYSxFQU9iLGFBUGEsRUFRYixlQVJhLEVBU2IseUJBVGEsRUFVYixxQ0FWYSxFQVdiLHlCQVhhLEVBWWIsc0JBWmEsRUFhYix3QkFiYTtJQWdCZixhQUFBLEdBQ0U7TUFBQSxJQUFBLEVBQU0sQ0FDSix5QkFESSxFQUVKLDBCQUZJLEVBR0osS0FISSxFQUlKLFVBSkksRUFLSixZQUxJLEVBTUosU0FOSSxFQU9KLGtCQVBJLEVBUUosaUJBUkksRUFTSiw0QkFUSSxFQVVKLCtDQVZJLEVBV0osK0JBWEksRUFZSix3QkFaSSxFQWFKLHVCQWJJLENBQU47TUFlQSxJQUFBLEVBQU0sQ0FDSixzQkFESSxFQUVKLG9CQUZJLEVBR0osS0FISSxFQUlKLFNBSkksRUFLSixZQUxJLEVBTUosTUFOSSxFQU9KLGFBUEksRUFRSixlQVJJLEVBU0oseUJBVEksRUFVSixxQ0FWSSxFQVdKLHlCQVhJLEVBWUosc0JBWkksRUFhSixxQkFiSSxDQWZOOztJQStCRixhQUFBLEdBQ0U7TUFBQSxzQkFBQSxFQUF3QixlQUF4QjtNQUNBLG9CQUFBLEVBQXNCLGVBRHRCO01BRUEsS0FBQSxFQUFPLEtBRlA7TUFHQSxTQUFBLEVBQVcsSUFIWDtNQUlBLFlBQUEsRUFBYyxZQUpkO01BS0EsTUFBQSxFQUFRLE1BTFI7TUFNQSxhQUFBLEVBQWUsUUFOZjtNQU9BLGVBQUEsRUFBaUIsSUFQakI7TUFRQSx5QkFBQSxFQUEyQixJQVIzQjtNQVNBLHFDQUFBLEVBQXVDLElBVHZDO01BVUEseUJBQUEsRUFBMkIsSUFWM0I7TUFXQSxzQkFBQSxFQUF3QixJQVh4QjtNQVlBLHdCQUFBLEVBQTBCLGFBWjFCOztJQWNGLGFBQUEsR0FDRTtNQUFBLEdBQUEsRUFBSyxhQUFMO01BQ0EsR0FBQSxFQUFLLGdCQURMO01BRUEsR0FBQSxFQUFLLGdCQUZMO01BR0EsR0FBQSxFQUFLLHlCQUhMO01BSUEsR0FBQSxFQUFLLG9CQUpMO01BS0EsR0FBQSxFQUFLLHdCQUxMO01BTUEsR0FBQSxFQUFLLGVBTkw7TUFPQSxHQUFBLEVBQUssWUFQTDtNQVFBLEdBQUEsRUFBSyxvQkFSTDtNQVNBLEdBQUEsRUFBSyx5QkFUTDtNQVVBLEdBQUEsRUFBSyxnQkFWTDtNQVdBLEdBQUEsRUFBSyx1QkFYTDtNQVlBLEdBQUEsRUFBSyxpQkFaTDtNQWFBLEdBQUEsRUFBSyxpQkFiTDtNQWNBLEdBQUEsRUFBSyxpQkFkTDtNQWVBLEdBQUEsRUFBSyxzQ0FmTDtNQWdCQSxHQUFBLEVBQUssd0JBaEJMO01BaUJBLEdBQUEsRUFBSyxnQkFqQkw7TUFrQkEsR0FBQSxFQUFLLHFCQWxCTDtNQW1CQSxHQUFBLEVBQUssa0NBbkJMO01Bb0JBLEdBQUEsRUFBSyxnQ0FwQkw7TUFxQkEsR0FBQSxFQUFLLHFCQXJCTDtNQXNCQSxHQUFBLEVBQUssZUF0Qkw7TUF1QkEsR0FBQSxFQUFLLE9BdkJMO01Bd0JBLEdBQUEsRUFBSyxZQXhCTDs7SUE2QkYsY0FBQSxHQUFpQixTQUFDLEVBQUQ7QUFDZixVQUFBO01BQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBQSxHQUFJLEVBQWQ7TUFDWixPQUFBLEdBQVksU0FBUyxDQUFDLE1BQVYsQ0FBaUIsaUJBQWpCO01BQ1osS0FBQSxHQUFZLE9BQU8sQ0FBQyxNQUFSLENBQWUsa0JBQWY7TUFDWixJQUFBLEdBQVksU0FBUyxDQUFDLE1BQVYsQ0FBaUIsY0FBakI7TUFDWixLQUFBLEdBQVksSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmO01BR1osUUFBQSxHQUFXLFNBQUEsQ0FBQTtNQUdYLFlBQUEsR0FBZSxTQUFBO0FBQ2IsWUFBQTtRQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxVQUFsQjtRQUNSLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxXQUFsQjtRQUVULEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixFQUFzQixNQUFBLEdBQVMsSUFBL0I7UUFFQSxPQUFPLENBQUMsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBQSxHQUFTLElBQWpDO1FBRUEsS0FDRSxDQUFDLEtBREgsQ0FDUyxPQURULEVBQ2tCLEtBQUEsR0FBTSxJQUR4QixDQUVFLENBQUMsS0FGSCxDQUVTLFFBRlQsRUFFbUIsTUFBQSxHQUFPLElBRjFCO2VBSUEsUUFBUSxDQUFDLE1BQVQsQ0FBQTtNQVphO01BY2Ysb0JBQUEsR0FBdUIsU0FBQyxDQUFEO2VBRXJCLE9BQ0UsQ0FBQyxPQURILENBQ1csVUFEWCxFQUN1QixJQUR2QixDQUVFLENBQUMsT0FGSCxDQUVXLFdBRlgsRUFFd0IsS0FGeEI7TUFGcUI7TUFNdkIsbUJBQUEsR0FBc0IsU0FBQyxDQUFEO2VBRXBCLE9BQ0UsQ0FBQyxPQURILENBQ1csVUFEWCxFQUN1QixLQUR2QixDQUVFLENBQUMsT0FGSCxDQUVXLFdBRlgsRUFFd0IsQ0FBQyxDQUFDLFNBQUYsS0FBZSxNQUZ2QztNQUZvQjtNQU10QixlQUFBLEdBQWtCLFNBQUMsQ0FBRDtBQUVoQixZQUFBO1FBQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxDQUFDLENBQUMsT0FBSjtRQUNSLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVg7UUFDWCxJQUFBLEdBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYO1FBQ1AsSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWixFQUEyQixJQUEzQjtVQUNBLElBQUcsVUFBSDtZQUNFLElBQUcsSUFBQSxLQUFRLENBQVg7cUJBQ0UsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsRUFERjthQUFBLE1BRUssSUFBRyxJQUFBLEtBQVEsQ0FBUixJQUFjLENBQUMsQ0FBQyxTQUFGLEtBQWUsSUFBaEM7cUJBQ0gsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsV0FBVyxDQUFDLElBQWxDLEVBQXdDLFdBQVcsQ0FBQyxJQUFwRCxFQURHO2FBSFA7V0FGRjtTQUFBLE1BT0ssSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUNILElBQUcsTUFBSDtZQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWixFQUEyQixJQUEzQjttQkFDQSxNQUFNLENBQUMsV0FBUCxDQUFtQixJQUFuQixFQUZGO1dBREc7U0FBQSxNQUlBLElBQUcsUUFBQSxLQUFZLENBQWY7VUFDSCxJQUFHLFFBQUEsSUFBYSxJQUFBLEdBQU8sQ0FBdkI7WUFDRSxJQUFBLEdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEdBQVQ7WUFDUCxJQUFBLEdBQVUsSUFBQSxHQUFPLENBQVYsR0FBaUIsSUFBSyxDQUFBLElBQUEsR0FBSyxDQUFMLENBQXRCLEdBQW1DO1lBQzFDLEVBQUEsR0FBSyxJQUFLLENBQUEsSUFBQSxHQUFLLENBQUw7WUFDVixRQUFRLENBQUMsU0FBVCxDQUFtQixJQUFuQixDQUNFLENBQUMsTUFESCxDQUNVLFNBQUMsQ0FBRDtxQkFBTyxDQUFBLElBQUssSUFBTCxJQUFjLENBQUEsR0FBSTtZQUF6QixDQURWLENBRUUsQ0FBQyxPQUZILENBRVcsT0FBQSxHQUFRLElBRm5CLEVBRXlCLENBQUMsQ0FBQyxTQUFGLEtBQWUsTUFGeEM7bUJBR0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCLElBQTNCLEVBUEY7V0FERztTQUFBLE1BU0EsSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUNILElBQUcsZUFBQSxJQUFvQixlQUFlLENBQUMsT0FBTyxDQUFDLElBQXhCLEtBQWdDLElBQXZEO21CQUNFLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixFQURGO1dBREc7O01BekJXO01BK0JsQixZQUFBLENBQUE7TUFJQSxRQUNFLENBQUMsS0FESCxDQUVJO1FBQUEsU0FBQSxFQUFZLEdBQUEsR0FBSSxFQUFoQjtRQUNBLE9BQUEsRUFBWSxpQkFEWjtRQUVBLElBQUEsRUFBWSxjQUZaO1FBR0EsSUFBQSxFQUFZLG9CQUhaO1FBSUEsTUFBQSxFQUFZLEdBSlo7T0FGSixDQVFFLENBQUMsZ0JBUkgsQ0FRb0Isb0JBUnBCLENBU0UsQ0FBQyxlQVRILENBU29CLG1CQVRwQjtNQVlBLElBQUEsQ0FBTyxvQkFBUDtRQUNFLG9CQUFBLEdBQXVCO1FBQ3ZCLFFBQVEsQ0FBQyxXQUFULENBQXNCLGVBQXRCLEVBRkY7O2FBS0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFlBQWxDO0lBekZlO0lBK0ZqQiw0QkFBQSxHQUErQixTQUFBO0FBRTdCLFVBQUE7TUFBQSxjQUFBLENBQWUsb0NBQWY7TUFFQSxVQUFBLEdBQWE7TUFDYixRQUFBLEdBQVcsRUFBRSxDQUFDLE1BQUgsQ0FBVSwyQkFBVjtNQUNYLFNBQUEsR0FBWTs7Ozs7TUFDWixRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixDQUNFLENBQUMsU0FESCxDQUNhLElBRGIsQ0FFSSxDQUFDLElBRkwsQ0FFVSxTQUZWLENBR0UsQ0FBQyxLQUhILENBQUEsQ0FHVSxDQUFDLE1BSFgsQ0FHa0IsSUFIbEIsQ0FJSSxDQUFDLE1BSkwsQ0FJWSxLQUpaLENBS00sQ0FBQyxNQUxQLENBS2MsS0FMZCxDQU1RLENBQUMsSUFOVCxDQU1jLFlBTmQsRUFNNEIsYUFONUIsQ0FPUSxDQUFDLElBUFQsQ0FPYyxTQVBkLEVBT3lCLGFBUHpCO01BU0EsYUFBQSxHQUFnQixTQUFBO0FBQ2QsWUFBQTtRQUFBLElBQUcsVUFBQSxLQUFjLFFBQVEsQ0FBQyxJQUFULENBQUEsQ0FBZSxDQUFDLFdBQWpDO1VBQ0UsVUFBQSxHQUFhLFFBQVEsQ0FBQyxJQUFULENBQUEsQ0FBZSxDQUFDO1VBQzdCLFVBQUEsR0FBYSxDQUFDLFVBQUEsR0FBYSxFQUFkLENBQUEsR0FBb0I7VUFDakMsV0FBQSxHQUFjLElBQUEsR0FBSztVQUduQixRQUFRLENBQUMsU0FBVCxDQUFtQixJQUFuQixDQUNFLENBQUMsS0FESCxDQUNTLE9BRFQsRUFDa0IsVUFBQSxHQUFXLElBRDdCLENBRUUsQ0FBQyxLQUZILENBRVMsUUFGVCxFQUVtQixXQUFBLEdBQVksSUFGL0I7VUFHQSxRQUFRLENBQUMsU0FBVCxDQUFtQixLQUFuQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsVUFEakIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxRQUZSLEVBRWtCLFdBRmxCLEVBVEY7O2VBWUEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxZQUFmLEVBQTZCLENBQUMsQ0FBQyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFBLENBQUEsR0FBbUIsUUFBUSxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsWUFBcEMsQ0FBQSxHQUFrRCxFQUFuRCxDQUFBLEdBQXVELElBQXBGO01BYmM7TUFjaEIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLGFBQWxDO2FBQ0EsYUFBQSxDQUFBO0lBL0I2QjtJQXFDL0IsdUJBQUEsR0FBMEIsU0FBQyxlQUFELEVBQWtCLGFBQWxCLEVBQWlDLG9CQUFqQztBQUd4QixVQUFBO01BQUEsY0FBQSxDQUFlLGlDQUFmO01BR0EsSUFBQSxHQUFPO01BQ1AsZUFBZSxDQUFDLE9BQWhCLENBQXdCLFNBQUMsQ0FBRDtBQUN0QixZQUFBO1FBQUEsV0FBQSxHQUFjLGFBQWEsQ0FBQyxNQUFkLENBQXFCLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsSUFBRixLQUFVLENBQUMsQ0FBQztRQUFuQixDQUFyQjtRQUNkLFdBQUEsR0FBYyxvQkFBb0IsQ0FBQyxNQUFyQixDQUE0QixTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVSxDQUFDLENBQUM7UUFBbkIsQ0FBNUI7UUFDZCxJQUFHLFdBQVksQ0FBQSxDQUFBLENBQVosSUFBbUIsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLE1BQUEsQ0FBckM7aUJBQ0ksSUFBSSxDQUFDLElBQUwsQ0FDRTtZQUFBLEtBQUEsRUFBTyxDQUFDLENBQUUsQ0FBQSxNQUFBLENBQVY7WUFDQSxJQUFBLEVBQU0sV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBRHJCO1lBRUEsTUFBQSxFQUFRLFdBQVksQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUZ2QjtZQUdBLFVBQUEsRUFBWSxXQUFZLENBQUEsQ0FBQSxDQUFHLENBQUEsTUFBQSxDQUgzQjtZQUlBLEdBQUEsRUFBSyxXQUFZLENBQUEsQ0FBQSxDQUFHLENBQUEsTUFBQSxDQUpwQjtXQURGLEVBREo7U0FBQSxNQUFBO2lCQVFFLE9BQU8sQ0FBQyxHQUFSLENBQVksNENBQVosRUFBMEQsQ0FBQyxDQUFDLElBQTVELEVBQWtFLFdBQVksQ0FBQSxDQUFBLENBQTlFLEVBUkY7O01BSHNCLENBQXhCOztBQWNBOzs7Ozs7Ozs7Ozs7Ozs7O01BaUJBLGVBQUEsR0FBc0IsSUFBQSxNQUFNLENBQUMsd0JBQVAsQ0FBZ0MsdUJBQWhDLEVBQ3BCO1FBQUEsTUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFRLENBQVI7VUFDQSxLQUFBLEVBQVEsQ0FEUjtVQUVBLEdBQUEsRUFBUSxDQUZSO1VBR0EsTUFBQSxFQUFRLENBSFI7U0FERjtRQUtBLEdBQUEsRUFDRTtVQUFBLENBQUEsRUFBRyxLQUFIO1VBQ0EsQ0FBQSxFQUFHLE9BREg7VUFFQSxFQUFBLEVBQUksTUFGSjtVQUdBLElBQUEsRUFBTSxZQUhOO1VBSUEsS0FBQSxFQUFPLEtBSlA7U0FORjtRQVdBLFVBQUEsRUFBWSxDQVhaO1FBWUEsVUFBQSxFQUFZLEVBWlo7T0FEb0I7TUFjdEIsZUFBZSxDQUFDLE9BQWhCLENBQXdCLElBQXhCO2FBQ0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsZUFBZSxDQUFDLFFBQWpDO0lBckR3QjtJQTJEMUIsd0JBQUEsR0FBMkIsU0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixHQUF0QjtNQUd6QixjQUFBLENBQWUsOEJBQWY7TUFHQSxRQUFRLENBQUMsT0FBVCxDQUFpQixTQUFDLENBQUQ7QUFDZixZQUFBO1FBQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsT0FBRDtpQkFBYSxPQUFPLENBQUMsSUFBUixLQUFnQixDQUFDLENBQUM7UUFBL0IsQ0FBakI7O0FBQ1A7Ozs7Ozs7Ozs7UUFVQSxDQUFDLENBQUMsTUFBRixHQUFXO1FBQ1gsQ0FBQyxDQUFDLEtBQUYsR0FBVTtRQUVWLFlBQVksQ0FBQyxPQUFiLENBQXFCLFNBQUMsR0FBRCxFQUFLLENBQUw7aUJBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBVCxDQUNFO1lBQUEsRUFBQSxFQUFJLENBQUo7WUFDQSxJQUFBLEVBQU0sYUFBYyxDQUFBLElBQUEsQ0FBTSxDQUFBLENBQUEsQ0FEMUI7WUFFQSxLQUFBLEVBQVUsQ0FBRSxDQUFBLEdBQUEsQ0FBRixLQUFVLEVBQWIsR0FBcUIsQ0FBQyxDQUFFLENBQUEsR0FBQSxDQUF4QixHQUFrQyxJQUZ6QztXQURGO1FBRG1CLENBQXJCO1FBU0EsSUFBRyxJQUFBLElBQVMsSUFBSyxDQUFBLENBQUEsQ0FBakI7VUFDRSxDQUFDLENBQUMsSUFBRixHQUFTLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxPQUFBLEdBQVEsSUFBUjtpQkFDakIsQ0FBQyxDQUFDLFFBQUYsR0FBYSxJQUFLLENBQUEsQ0FBQSxDQUFHLENBQUEsVUFBQSxFQUZ2QjtTQUFBLE1BQUE7aUJBSUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLENBQUMsQ0FBQyxJQUE1QixFQUpGOztNQXhCZSxDQUFqQjtNQStCQSxNQUFBLEdBQWEsSUFBQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsd0JBQWpDLEVBQ1g7UUFBQSxXQUFBLEVBQWEsTUFBYjtRQUNBLE1BQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxDQUFMO1VBQ0EsTUFBQSxFQUFRLENBRFI7U0FGRjtRQUlBLE1BQUEsRUFBUSxLQUpSO09BRFc7TUFNYixNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWYsRUFBeUIsR0FBekI7TUFDQSxNQUFNLENBQUMsUUFBUCxDQUFBO2FBR0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsTUFBTSxDQUFDLFFBQXhCO0lBL0N5QjtJQXFEM0IsMEJBQUEsR0FBNkIsU0FBQyxZQUFELEVBQWUsU0FBZjtBQUUzQixVQUFBO01BQUEsWUFBQSxHQUFlO01BQ2YsWUFBQSxHQUFlO01BQ2YsYUFBQSxHQUFnQjtNQUNoQix1QkFBQSxHQUEwQjtNQUMxQixvQkFBQSxHQUF1QjtNQUN2QixzQkFBQSxHQUF5QjtNQUV6QixXQUFBLEdBQWMsTUFBTSxDQUFDLElBQVAsQ0FBWSxhQUFaO01BR2QsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsU0FBQyxDQUFEOztBQUNuQjs7Ozs7O1FBTUEsWUFBWSxDQUFDLElBQWIsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUMsQ0FBQyxDQUFOLEdBQVEsQ0FBQyxDQUFDLENBRGpCO1NBREY7UUFHQSxZQUFZLENBQUMsSUFBYixDQUNFO1VBQUEsSUFBQSxFQUFNLENBQUMsQ0FBQyxJQUFSO1VBQ0EsS0FBQSxFQUFPLENBQUMsQ0FBQyxDQURUO1NBREY7UUFHQSxhQUFhLENBQUMsSUFBZCxDQUNFO1VBQUEsSUFBQSxFQUFNLENBQUMsQ0FBQyxJQUFSO1VBQ0EsS0FBQSxFQUFPLENBQUMsQ0FBQyxDQUFGLEdBQUksQ0FBQyxDQUFDLENBQU4sR0FBUSxDQUFDLENBQUMsQ0FBVixHQUFZLENBQUMsQ0FBQyxDQURyQjtTQURGO1FBR0EsdUJBQXVCLENBQUMsSUFBeEIsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FEVDtTQURGO1FBR0Esb0JBQW9CLENBQUMsSUFBckIsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FEVDtTQURGO2VBR0Esc0JBQXNCLENBQUMsSUFBdkIsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FEVDtTQURGO01BdEJtQixDQUFyQjtNQTBCQSxTQUFBLEdBQVksU0FBQyxDQUFELEVBQUcsQ0FBSDtBQUFTLGVBQU8sQ0FBQyxDQUFDLEtBQUYsR0FBUSxDQUFDLENBQUM7TUFBMUI7TUFDWixZQUFZLENBQUMsSUFBYixDQUFrQixTQUFsQjtNQUNBLFlBQVksQ0FBQyxJQUFiLENBQWtCLFNBQWxCO01BQ0EsYUFBYSxDQUFDLElBQWQsQ0FBbUIsU0FBbkI7TUFDQSx1QkFBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUE3QjtNQUNBLG9CQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCO01BQ0Esc0JBQXNCLENBQUMsSUFBdkIsQ0FBNEIsU0FBNUI7TUFFSSxJQUFBLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQiwrQkFBMUIsRUFDRjtRQUFBLEdBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxNQUFKO1VBQ0EsQ0FBQSxFQUFHLE9BREg7U0FERjtPQURFLENBR1csQ0FBQyxPQUhaLENBR29CLFlBQVksQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBQXFCLENBQXJCLENBSHBCO01BSUEsSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsZ0NBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7T0FERSxDQUdXLENBQUMsT0FIWixDQUdvQixhQUFhLENBQUMsS0FBZCxDQUFvQixDQUFwQixFQUFzQixDQUF0QixDQUhwQjtNQUlBLElBQUEsTUFBTSxDQUFDLGtCQUFQLENBQTBCLGdDQUExQixFQUNGO1FBQUEsR0FBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLE1BQUo7VUFDQSxDQUFBLEVBQUcsT0FESDtTQURGO09BREUsQ0FHVyxDQUFDLE9BSFosQ0FHb0IsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBcUIsQ0FBckIsQ0FIcEI7TUFJQSxJQUFBLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQiwyQ0FBMUIsRUFDRjtRQUFBLEdBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxNQUFKO1VBQ0EsQ0FBQSxFQUFHLE9BREg7U0FERjtPQURFLENBR1csQ0FBQyxPQUhaLENBR29CLHVCQUF1QixDQUFDLEtBQXhCLENBQThCLENBQTlCLEVBQWdDLENBQWhDLENBSHBCO01BSUEsSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsd0NBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7T0FERSxDQUdXLENBQUMsT0FIWixDQUdvQixvQkFBb0IsQ0FBQyxLQUFyQixDQUEyQixDQUEzQixFQUE2QixDQUE3QixDQUhwQjthQUlBLElBQUEsTUFBTSxDQUFDLGtCQUFQLENBQTBCLDBDQUExQixFQUNGO1FBQUEsR0FBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLE1BQUo7VUFDQSxDQUFBLEVBQUcsT0FESDtTQURGO09BREUsQ0FHVyxDQUFDLE9BSFosQ0FHb0Isc0JBQXNCLENBQUMsS0FBdkIsQ0FBNkIsQ0FBN0IsRUFBK0IsQ0FBL0IsQ0FIcEI7SUFsRXVCO0lBMkU3Qiw4QkFBQSxHQUFpQyxTQUFDLFFBQUQ7TUFFL0IsY0FBQSxDQUFlLHNDQUFmO01BRUEsVUFBQSxHQUFpQixJQUFBLE1BQU0sQ0FBQyw2QkFBUCxDQUFxQyw0QkFBckMsRUFDZjtRQUFBLFdBQUEsRUFBYSxNQUFiO1FBQ0EsTUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFRLENBQVI7VUFDQSxLQUFBLEVBQVEsQ0FEUjtVQUVBLEdBQUEsRUFBUSxDQUZSO1VBR0EsTUFBQSxFQUFRLENBSFI7U0FGRjtRQU1BLEdBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxPQUFQO1VBQ0EsRUFBQSxFQUFJLE1BREo7U0FQRjtRQVNBLFdBQUEsRUFBYSxZQVRiO1FBVUEsWUFBQSxFQUFjLGFBQWMsQ0FBQSxJQUFBLENBVjVCO09BRGU7TUFhakIsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsUUFBbkIsRUFBNkIsV0FBVyxDQUFDLElBQXpDLEVBQStDLFdBQVcsQ0FBQyxJQUEzRDthQUVBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQWlCLFVBQVUsQ0FBQyxRQUE1QjtJQW5CK0I7SUF5QmpDLHNCQUFBLEdBQXlCLFNBQUMsUUFBRCxFQUFXLGVBQVgsRUFBNEIsWUFBNUI7YUFFdkIsQ0FBQSxDQUFFLHFDQUFGLENBQ0UsQ0FBQyxNQURILENBQ1UsU0FBQTtBQUNOLFlBQUE7UUFBQSxZQUFBLEdBQWUsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEdBQVIsQ0FBQTtRQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixFQUFzQixZQUF0QjtRQUVBLGdCQUFBLEdBQW1CLFFBQVEsQ0FBQyxNQUFULENBQWdCLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsSUFBRixLQUFVO1FBQWpCLENBQWhCO1FBQ25CLElBQUcsZ0JBQUEsSUFBcUIsZ0JBQWlCLENBQUEsQ0FBQSxDQUF6QztVQUNFLGVBQUEsR0FBa0IsWUFBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBQyxHQUFELEVBQU0sQ0FBTjttQkFBWTtjQUFDLE1BQUEsRUFBUSxhQUFjLENBQUEsSUFBQSxDQUFNLENBQUEsQ0FBQSxDQUE3QjtjQUFpQyxPQUFBLEVBQVMsQ0FBQyxnQkFBaUIsQ0FBQSxDQUFBLENBQUcsQ0FBQSxHQUFBLENBQS9EOztVQUFaLENBQWpCO1VBQ2xCLGVBQUEsR0FBa0IsZUFBZSxDQUFDLElBQWhCLENBQXFCLFNBQUMsQ0FBRCxFQUFHLENBQUg7bUJBQVMsQ0FBQyxDQUFDLEtBQUYsR0FBUSxDQUFDLENBQUM7VUFBbkIsQ0FBckI7VUFDbEIsQ0FBQSxDQUFFLDhCQUFGLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLGdCQUFpQixDQUFBLENBQUEsQ0FBRyxDQUFBLG1CQUFBLENBQWhDLENBQUEsR0FBc0QsR0FBN0Y7VUFDQSxDQUFBLENBQUUsc0NBQUYsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxlQUFnQixDQUFBLENBQUEsQ0FBRSxDQUFDLElBQWxFO1VBQ0EsQ0FBQSxDQUFFLDRDQUFGLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsSUFBSSxDQUFDLEtBQUwsQ0FBVyxlQUFnQixDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQTlCLENBQUEsR0FBcUMsR0FBMUY7VUFDQSxDQUFBLENBQUUseUJBQUYsQ0FBNEIsQ0FBQyxJQUE3QixDQUFBLEVBTkY7U0FBQSxNQUFBO1VBUUUsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsSUFBN0IsQ0FBQSxFQVJGOztRQVVBLHVCQUFBLEdBQTBCLGVBQWUsQ0FBQyxNQUFoQixDQUF1QixTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVTtRQUFqQixDQUF2QjtRQUMxQixJQUFHLHVCQUFBLElBQTRCLHVCQUF3QixDQUFBLENBQUEsQ0FBdkQ7VUFDRSxDQUFBLENBQUUscUNBQUYsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsdUJBQXdCLENBQUEsQ0FBQSxDQUFHLENBQUEsTUFBQSxDQUF2QyxDQUFBLEdBQWdELEdBQTlGO1VBQ0EsQ0FBQSxDQUFFLGdDQUFGLENBQW1DLENBQUMsSUFBcEMsQ0FBQSxFQUZGO1NBQUEsTUFBQTtVQUlFLENBQUEsQ0FBRSxnQ0FBRixDQUFtQyxDQUFDLElBQXBDLENBQUEsRUFKRjs7UUFNQSxvQkFBQSxHQUF1QixZQUFZLENBQUMsTUFBYixDQUFvQixTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVTtRQUFqQixDQUFwQjtRQUN2QixJQUFHLG9CQUFBLElBQXlCLG9CQUFxQixDQUFBLENBQUEsQ0FBakQ7VUFDRSxPQUFBLEdBQVUsTUFBTSxDQUFDLElBQVAsQ0FBWSxhQUFaLENBQTBCLENBQUMsR0FBM0IsQ0FBK0IsU0FBQyxNQUFEO21CQUFZO2NBQUMsTUFBQSxFQUFRLGFBQWMsQ0FBQSxNQUFBLENBQXZCO2NBQWdDLE9BQUEsRUFBUyxDQUFDLG9CQUFxQixDQUFBLENBQUEsQ0FBRyxDQUFBLE1BQUEsQ0FBbEU7O1VBQVosQ0FBL0I7VUFDVixPQUFBLEdBQVUsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFDLENBQUQsRUFBRyxDQUFIO21CQUFTLENBQUMsQ0FBQyxLQUFGLEdBQVEsQ0FBQyxDQUFDO1VBQW5CLENBQWI7VUFDVixDQUFBLENBQUUsaUNBQUYsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBckQ7VUFDQSxDQUFBLENBQUUsdUNBQUYsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUF0QixDQUFBLEdBQTZCLEdBQTdFO2lCQUNBLENBQUEsQ0FBRSw0QkFBRixDQUErQixDQUFDLElBQWhDLENBQUEsRUFMRjtTQUFBLE1BQUE7aUJBT0UsQ0FBQSxDQUFFLDRCQUFGLENBQStCLENBQUMsSUFBaEMsQ0FBQSxFQVBGOztNQXZCTSxDQURWLENBZ0NFLENBQUMsR0FoQ0gsQ0FnQ08sV0FBVyxDQUFDLElBaENuQixDQWlDRSxDQUFDLE9BakNILENBaUNXLFFBakNYO0lBRnVCO0lBeUN6QixJQUFHLENBQUEsQ0FBRSwyQkFBRixDQUE4QixDQUFDLE1BQS9CLEdBQXdDLENBQTNDO01BQ0UsNEJBQUEsQ0FBQSxFQURGOztXQUtBLEVBQUUsQ0FBQyxLQUFILENBQUEsQ0FDRSxDQUFDLEtBREgsQ0FDUyxFQUFFLENBQUMsR0FEWixFQUNrQixPQUFBLEdBQVEsd0NBRDFCLENBRUUsQ0FBQyxLQUZILENBRVMsRUFBRSxDQUFDLEdBRlosRUFFa0IsT0FBQSxHQUFRLHVCQUYxQixDQUdFLENBQUMsS0FISCxDQUdTLEVBQUUsQ0FBQyxHQUhaLEVBR2tCLE9BQUEsR0FBUSxrQ0FIMUIsQ0FJRSxDQUFDLEtBSkgsQ0FJUyxFQUFFLENBQUMsR0FKWixFQUlrQixPQUFBLEdBQVEscUJBSjFCLENBS0UsQ0FBQyxLQUxILENBS1MsRUFBRSxDQUFDLEdBTFosRUFLa0IsT0FBQSxHQUFRLHNCQUFSLEdBQStCLElBQS9CLEdBQW9DLE1BTHRELENBTUUsQ0FBQyxLQU5ILENBTVMsRUFBRSxDQUFDLEdBTlosRUFNa0IsT0FBQSxHQUFRLDZCQUFSLEdBQXNDLElBQXRDLEdBQTJDLE1BTjdELENBT0UsQ0FBQyxLQVBILENBT1MsRUFBRSxDQUFDLElBUFosRUFPa0IsT0FBQSxHQUFRLDBCQVAxQixDQVFFLENBQUMsS0FSSCxDQVFTLEVBQUUsQ0FBQyxJQVJaLEVBUWtCLDZCQVJsQixDQVNFLENBQUMsS0FUSCxDQVNTLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsZUFBbEIsRUFBbUMsWUFBbkMsRUFBaUQsU0FBakQsRUFBNEQsYUFBNUQsRUFBMkUsb0JBQTNFLEVBQWlHLEdBQWpHLEVBQXNHLFFBQXRHO0FBRUwsVUFBQTtNQUFBLElBQUcsUUFBSDtRQUNFLFlBQUEsR0FBZSxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLEtBQUYsS0FBVyxRQUFRLENBQUM7UUFBM0IsQ0FBakI7UUFDZixJQUFHLFlBQWEsQ0FBQSxDQUFBLENBQWhCO1VBQ0UsV0FBVyxDQUFDLElBQVosR0FBbUIsWUFBYSxDQUFBLENBQUEsQ0FBRSxDQUFDO1VBQ25DLFdBQVcsQ0FBQyxJQUFaLEdBQW1CLFlBQWEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxPQUFBLEdBQVEsSUFBUixFQUZyQztTQUZGO09BQUEsTUFBQTtRQU1FLFFBQUEsR0FBVyxHQU5iOztNQVFBLElBQUEsQ0FBTyxRQUFRLENBQUMsSUFBaEI7UUFDRSxXQUFXLENBQUMsSUFBWixHQUFtQjtRQUNuQixXQUFXLENBQUMsSUFBWixHQUFzQixJQUFBLEtBQVEsSUFBWCxHQUFxQixRQUFyQixHQUFtQyxRQUZ4RDs7TUFLQSxZQUFZLENBQUMsT0FBYixDQUFxQixTQUFDLENBQUQ7QUFDbkIsWUFBQTtRQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLE9BQUQ7aUJBQWEsT0FBTyxDQUFDLEtBQVIsS0FBaUIsQ0FBQyxDQUFDO1FBQWhDLENBQWpCO1FBQ1AsSUFBRyxJQUFBLElBQVMsSUFBSyxDQUFBLENBQUEsQ0FBakI7VUFDRSxDQUFDLENBQUMsSUFBRixHQUFTLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQztVQUNqQixDQUFDLENBQUMsSUFBRixHQUFTLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxPQUFBLEdBQVEsSUFBUjtVQUNqQixNQUFNLENBQUMsSUFBUCxDQUFZLGFBQVosQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxTQUFDLE1BQUQ7WUFDakMsQ0FBRSxDQUFBLE1BQUEsQ0FBRixHQUFZLEdBQUEsR0FBSSxDQUFFLENBQUEsTUFBQTtZQUNsQixJQUFHLENBQUUsQ0FBQSxNQUFBLENBQUYsR0FBWSxHQUFmO3FCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksa0NBQUEsR0FBcUMsQ0FBQyxDQUFDLE9BQXZDLEdBQWlELElBQWpELEdBQXdELE1BQXhELEdBQWlFLElBQWpFLEdBQXdFLENBQUUsQ0FBQSxNQUFBLENBQXRGLEVBREY7O1VBRmlDLENBQW5DO2lCQUlBLE9BQU8sQ0FBQyxDQUFDLFFBUFg7U0FBQSxNQUFBO2lCQVNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsc0JBQUEsR0FBdUIsQ0FBQyxDQUFDLElBQXRDLEVBVEY7O01BRm1CLENBQXJCO01BYUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaO01BRUEsSUFBRyxDQUFBLENBQUUsNkJBQUYsQ0FBZ0MsQ0FBQyxNQUFwQztRQUNFLDhCQUFBLENBQStCLFFBQS9CLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUseUJBQUYsQ0FBNEIsQ0FBQyxNQUFoQztRQUNFLHdCQUFBLENBQXlCLFFBQXpCLEVBQW1DLFNBQW5DLEVBQThDLEdBQTlDLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUsd0JBQUYsQ0FBMkIsQ0FBQyxNQUEvQjtRQUNFLHVCQUFBLENBQXdCLGVBQXhCLEVBQXlDLGFBQXpDLEVBQXdELG9CQUF4RCxFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLGlDQUFGLENBQW9DLENBQUMsTUFBeEM7UUFDRSwwQkFBQSxDQUEyQixZQUEzQixFQUF5QyxTQUF6QyxFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsTUFBNUI7ZUFDRSxzQkFBQSxDQUF1QixRQUF2QixFQUFpQyxlQUFqQyxFQUFrRCxZQUFsRCxFQURGOztJQTFDSyxDQVRUO0VBN2ZELENBQUQsQ0FBQSxDQW1qQkUsTUFuakJGO0FBQUEiLCJmaWxlIjoiY29udHJhY2VwdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBpZiBAc3ZnXG4gICAgICBAc3ZnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LkJhckhvcml6b250YWxHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCYXIgSG9yaXpvbnRhbCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIHN2ZyAmIHVzZSBodG1sIGRpdiBpbnN0ZWFkXG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWhvcml6b250YWwtZ3JhcGgnXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnhdID0gK2RbQG9wdGlvbnMua2V5LnhdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUubG9nICdiYXIgaG9yaXpvbnRhbCBkYXRhJywgQGRhdGFcbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5jYWxsIEBzZXRCYXJzXG4gICAgcmV0dXJuIEBcblxuICBcbiAgc2V0QmFyczogKGVsZW1lbnQpID0+XG4gICAgaWYgQG9wdGlvbnMua2V5LmlkXG4gICAgICBlbGVtZW50LmF0dHIgJ2lkJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdiYXItdGl0bGUnXG4gICAgICAgIC5odG1sIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXInXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgKGQpID0+IFxuICAgICAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF0rJyUnXG4gICAgICAuYXBwZW5kKCdzcGFuJylcbiAgICAgICAgLmh0bWwgKGQpID0+IE1hdGgucm91bmQoZFtAb3B0aW9ucy5rZXkueF0pKyclJ1xuIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgY29uc29sZS5sb2cgQGNvbG9yLmRvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWUubGVuZ3RoID4gMFxuICAgICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICAgIEBzZXRUb29sdGlwRGF0YSB2YWx1ZVswXVxuICAgICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgb2Zmc2V0ID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuICAgICAgICAnb3BhY2l0eSc6ICcxJ1xuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBpZiBkLmNhc2VzXG4gICAgICBAJHRvb2x0aXBcbiAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcykgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuTWFwR3JhcGhcblxuICBjdXJyZW50U3RhdGUgPSAwXG5cblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgIEAkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgZWxzZVxuICAgICAgICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cblxuICAjIyNcbiAgIyBvdmVycmlkZSBjb2xvciBzY2FsZVxuICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwgZDMuc2NoZW1lQ2F0ZWdvcnkyMFxuICAjIG92ZXJyaWRlIHNldENvdW50cnlDb2xvclxuICBAc2V0Q291bnRyeUNvbG9yID0gKGQpIC0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlWzBdXG4gICAgICAjY29uc29sZS5sb2cgQGNvbG9yXG4gICAgICBjb25zb2xlLmxvZyB2YWx1ZVswXS52YWx1ZXNbMF0uaWQsIHZhbHVlWzBdLnZhbHVlc1swXS5uYW1lLCBAY29sb3IodmFsdWVbMF0udmFsdWVzWzBdLmlkKVxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZXNbMF0uaWQpIGVsc2UgJyNlZWUnXG4gICNAZm9ybWF0RmxvYXQgPSBAZm9ybWF0SW50ZWdlclxuICAjQGdldExlZ2VuZERhdGEgPSAtPiBbMCwyLDQsNiw4XVxuICBAc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcuZGVzY3JpcHRpb24nXG4gICAgICAjLmh0bWwgZC52YWx1ZXNbMF0ubmFtZSsnICgnK2QudmFsdWVzWzBdLnZhbHVlKyclKSdcbiAgICAgIC5odG1sIGQudmFsdWUrJyUnXG4gICMjI1xuXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIGlmIHN0YXRlID09IDFcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydGZW1hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDJcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJVUQnXVxuICAgICAgZWxzZSBpZiBzdGF0ZSA9PSAzXG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpIC0+IGQudmFsdWUgPSArZFsnUGlsbCddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDRcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydNYWxlIGNvbmRvbSddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDVcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJbmplY3RhYmxlJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNlxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgODBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdHJlZW1hcFJvb3QgPSBAc3RyYXRpZnkoQGRhdGEpXG4gICAgICAuc3VtIChkKSA9PiBkW0BvcHRpb25zLmtleS52YWx1ZV1cbiAgICAgIC5zb3J0IChhLCBiKSAtPiBiLnZhbHVlIC0gYS52YWx1ZVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBkcmF3IG5vZGVzXG4gICAgQG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICMgICAgLm9uICdtb3VzZW92ZXInLCBvbk5vZGVPdmVyXG4gICAgIyAgICAub24gJ21vdXNlbW92ZScsIG9uTm9kZU1vdmVcbiAgICAjICAgIC5vbiAnbW91c2VvdXQnLCAgb25Ob2RlT3V0XG4gICAgIyAgICAub24gJ2NsaWNrJywgICAgIG9uTm9kZUNsaWNrXG4gICAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uXG5cbiAgICBAZHJhd0dyYXBoTGFiZWxzKClcblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHJlbW92ZSBub2RlIGxhYmVsc1xuICAgIEBub2Rlcy5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJykucmVtb3ZlKClcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgQG5vZGVzLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uIEBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvblxuICAgICAgLm9uICdlbmQnLCAoZCxpKSA9PlxuICAgICAgICBpZiAoaSA9PSBAbm9kZXMuc2l6ZSgpLTEpXG4gICAgICAgICAgQGRyYXdHcmFwaExhYmVscygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvblxuXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGhMYWJlbHM6IC0+XG4gICAgIyBhZGQgbGFiZWwgb25seSBpbiBub2RlcyB3aXRoIHNpemUgZ3JlYXRlciB0aGVuIG9wdGlvbnMubWluU2l6ZVxuICAgIEBub2Rlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbCdcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsIEBzZXROb2RlTGFiZWxcblxuICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgQG5vZGVzLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlXG4gICAgICAuc2VsZWN0QWxsICcubm9kZS1sYWJlbCdcbiAgICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVE9ETyEhISBDaGFuZ2UgYXNwZWN0IHJhdGlvIGJhc2VkIG9uIG1vYmlsZUJyZWFrcG9pbnRcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQG5vZGVzLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICAjIFVwZGF0ZSBub2RlcyBhdHRyaWJ1dGVzICYgaXRzIGxhYmVsc1xuICAgIEBub2Rlc1xuICAgICAgLmNhbGwgQHNldE5vZGVcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGVcbiAgICAgIC5zZWxlY3RBbGwgJy5ub2RlLWxhYmVsJ1xuICAgICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSdcblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgICMuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgLT4gd2hpbGUgKGQuZGVwdGggPiAxKSBkID0gZC5wYXJlbnQ7IHJldHVybiBjb2xvclNjYWxlKGdldFBhcmVudElkKGQpKTsgfSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG4gICAgICAjLnNlbGVjdCAnLm5vZGUtbGFiZWwnXG4gICAgICAjICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJ1xuXG4gIHNldE5vZGVMYWJlbDogKHNlbGVjdGlvbikgPT5cbiAgICBsYWJlbCA9IHNlbGVjdGlvbi5hcHBlbmQgJ2RpdidcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsLWNvbnRlbnQnXG4gICAgIyMjXG4gICAgbGFiZWwuYXBwZW5kICdzdmcnXG4gICAgICAuYXR0ciAndmlld0JveCcsICcwIDAgMjQgMjQnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAyNFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIDI0XG4gICAgICAuYXBwZW5kICd1c2UnXG4gICAgICAgIC5hdHRyICd4bGluazpocmVmJywgKGQpIC0+ICcjaWNvbi0nK2QuZGF0YS5pY29uXG4gICAgIyMjXG4gICAgbGFiZWwuYXBwZW5kICdwJ1xuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIHNldE5vZGVEaW1lbnNpb246IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAjIyMgbWVyZ2UgVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHMsIExhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kICYgRW1lcmdlbmN5IGNvbnRyYWNlcHRpb24gaW4gT3RoZXIgbW9kZXJuIG1ldGhvZHNcbiAgICBnZXRLZXlWYWx1ZSA9IChrZXksIGRhdGEpIC0+XG4gICAgICBpZiBrZXkgIT0gJ290aGVyLW1vZGVybi1tZXRob2RzJ1xuICAgICAgICByZXR1cm4gZGF0YVtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBkYXRhW2tleV0rbWVyZ2Vfa2V5cy5yZWR1Y2UoKHN1bSwgdmFsdWUpIC0+IHN1bStkYXRhW3ZhbHVlXSlcbiAgICAjIyNcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgIG1ldGhvZHMgPSB7fVxuICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgbWV0aG9kc1trZXldID1cbiAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgIHZhbHVlOiArZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgY29uc29sZS5sb2cgbWV0aG9kc1xuICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgaWYga2V5ICE9ICdPdGhlciBtb2Rlcm4gbWV0aG9kcycgYW5kIGtleSAhPSAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCcgYW5kIG1ldGhvZC52YWx1ZSA8IDVcbiAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgIGlkOiBtZXRob2QuaWRcbiAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArICBtZXRob2QubmFtZSArICc8L3N0cm9uZz48YnIvPicgKyBNYXRoLnJvdW5kKG1ldGhvZC52YWx1ZSkgKyAnJSdcbiAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgIGNvbnNvbGUubG9nIHBhcnNlZERhdGFcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSkiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZHJhd0dyYXBoOiAtPlxuXG4gICAgQHNldFNpemUoKVxuXG4gICAgIyBzZXQgJiBydW4gc2ltdWxhdGlvblxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YSBAZGF0YVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdFxuICAgICAgLm9uICdtb3VzZW92ZXInLCAoZCkgPT4gY29uc29sZS5sb2cgZFxuXG4gIHNldERvdDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmNhbGwgQHNldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuXG4gIHNldFNpbXVsYXRpb246IC0+XG4gICAgIyBzZXR1cCBzaW11bGF0aW9uXG4gICAgZm9yY2VZID0gZDMuZm9yY2VZIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICBmb3JjZVkuc3RyZW5ndGgoMSlcbiAgICBAc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbihAZGF0YSlcbiAgICAgIC5mb3JjZSAneCcsIGZvcmNlWVxuICAgICAgLmZvcmNlICd5JywgZDMuZm9yY2VYKEB3aWR0aCouNSlcbiAgICAgIC5mb3JjZSAnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgoZCkgPT4gcmV0dXJuIGlmIEBzaXplIHRoZW4gZC5yYWRpdXMrMSBlbHNlIEBvcHRpb25zLmRvdFNpemUrMSlcbiAgICAgIC5zdG9wKClcblxuICBydW5TaW11bGF0aW9uOiAtPlxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IDM1MFxuICAgICAgQHNpbXVsYXRpb24udGljaygpXG4gICAgICArK2lcblxuICBzZXREb3RQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjeCcsIChkKSA9PiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnggZWxzZSBNYXRoLnJvdW5kIEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuICAgICAgLmF0dHIgJ2N5JywgKGQpID0+IGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueSBlbHNlIE1hdGgucm91bmQgQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgc2V0RG90RmlsbDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAnZmlsbCcsIChkKSA9PiBpZiBAb3B0aW9ucy5rZXkuY29sb3IgYW5kIEBvcHRpb25zLm1vZGUgPT0gMSB0aGVuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gZWxzZSAnI2UyNzIzYidcblxuICBzZXRNb2RlOiAobW9kZSkgLT5cbiAgICBAb3B0aW9ucy5tb2RlID0gbW9kZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50KDAuMTI1KVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgIyBFcXVpdmFsZW50IHRvIGQzLnNjYWxlU3FydCgpXG4gICAgICAjwqBodHRwczovL2JsLm9ja3Mub3JnL2QzaW5kZXB0aC83NzVjZjQzMWU2NGI2NzE4NDgxYzA2ZmM0NWRjMzRmOVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0ucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyMDAsIDg1MDAwXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFsxMDA1LCAzOTU1LCAxMjIzNSwgMTAwMDAwXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgdXNlVHJlZW1hcCA9IG51bGxcbiAgdXNlTWFwID0gbnVsbFxuICB1c2VHcmFwaCA9IG51bGxcbiAgdW5tZXRuZWVkc0dyYXBoID0gbnVsbCBcblxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiRXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiRXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcIkltcGxhbnRlXCJcbiAgICAgIFwiSW55ZWN0YWJsZVwiXG4gICAgICBcIlDDrWxkb3JhXCJcbiAgICAgIFwiQ29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJDb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwiTcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwiTcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcIkFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwiT3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJNw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcIkltcGxhbnRcIlxuICAgICAgXCJJbmplY3RhYmxlXCJcbiAgICAgIFwiUGlsbFwiXG4gICAgICBcIk1hbGUgY29uZG9tXCJcbiAgICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwiVHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgIFwiYVwiOiBcIm5vdCBtYXJyaWVkXCJcbiAgICBcImJcIjogXCJub3QgaGF2aW5nIHNleFwiXG4gICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgIFwiZFwiOiBcIm1lbm9wYXVzYWwvaHlzdGVyZWN0b215XCJcbiAgICBcImVcIjogXCJzdWJmZWN1bmQvaW5mZWN1bmRcIlxuICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgIFwiZ1wiOiBcImJyZWFzdGZlZWRpbmdcIlxuICAgIFwiaFwiOiBcImZhdGFsaXN0aWNcIlxuICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiICAgICAgICMgb3Bwb3NlZFxuICAgIFwialwiOiBcImh1c2JhbmQvcGFydG5lciBvcHBvc2VkXCIgICMgb3Bwb3NlZFxuICAgIFwia1wiOiBcIm90aGVycyBvcHBvc2VkXCIgICAgICAgICAgICMgb3Bwb3NlZFxuICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiICAgICMgb3Bwb3NlZFxuICAgIFwibVwiOiBcImtub3dzIG5vIG1ldGhvZFwiXG4gICAgXCJuXCI6IFwia25vd3Mgbm8gc291cmNlXCJcbiAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIiAgICAgICAgICAgICAgICAgICAgICAjIHNhbHVkXG4gICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCIgIyBzYWx1ZFxuICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgIFwiclwiOiBcImNvc3RzIHRvbyBtdWNoXCJcbiAgICBcInNcIjogXCJpbmNvbnZlbmllbnQgdG8gdXNlXCJcbiAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKScyBwcm9jZXNzZXNcIiAgICAgICMgc2FsdWRcbiAgICBcInVcIjogXCJwcmVmZXJyZWQgbWV0aG9kIG5vdCBhdmFpbGFibGVcIlxuICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICBcInhcIjogXCJvdGhlclwiXG4gICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgIyBTY3JvbGxhbWEgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFNjcm9sbGFtYSA9IChpZCkgLT5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK2lkKVxuICAgIGdyYXBoaWMgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtZ3JhcGhpYycpXG4gICAgY2hhcnQgICAgID0gZ3JhcGhpYy5zZWxlY3QoJy5ncmFwaC1jb250YWluZXInKVxuICAgIHRleHQgICAgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtdGV4dCcpXG4gICAgc3RlcHMgICAgID0gdGV4dC5zZWxlY3RBbGwoJy5zdGVwJylcblxuICAgICMgaW5pdGlhbGl6ZSBzY3JvbGxhbWFcbiAgICBzY3JvbGxlciA9IHNjcm9sbGFtYSgpXG5cbiAgICAjIHJlc2l6ZSBmdW5jdGlvbiB0byBzZXQgZGltZW5zaW9ucyBvbiBsb2FkIGFuZCBvbiBwYWdlIHJlc2l6ZVxuICAgIGhhbmRsZVJlc2l6ZSA9IC0+XG4gICAgICB3aWR0aCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgICAgc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICAgIGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgICBjaGFydFxuICAgICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgICBzY3JvbGxlci5yZXNpemUoKVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgc3RpY2t5IHRoZSBncmFwaGljXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgICBoYW5kbGVDb250YWluZXJFeGl0ID0gKGUpIC0+XG4gICAgICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICBoYW5kbGVTdGVwRW50ZXIgPSAoZSkgLT5cbiAgICAgICPCoGNvbnNvbGUubG9nIGVcbiAgICAgICRzdGVwID0gJChlLmVsZW1lbnQpXG4gICAgICBpbnN0YW5jZSA9ICRzdGVwLmRhdGEoJ2luc3RhbmNlJylcbiAgICAgIHN0ZXAgPSAkc3RlcC5kYXRhKCdzdGVwJylcbiAgICAgIGlmIGluc3RhbmNlID09IDAgXG4gICAgICAgIGNvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAxJywgc3RlcFxuICAgICAgICAgIHVzZU1hcC5zZXRNYXBTdGF0ZSBzdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAyXG4gICAgICAgIGlmIHVzZUdyYXBoIGFuZCBzdGVwID4gMFxuICAgICAgICAgIGRhdGEgPSBbNjMsIDg4LCAxMDBdICMgNjMsIDYzKzI1LCA2MysyNSsxMlxuICAgICAgICAgIGZyb20gPSBpZiBzdGVwID4gMSB0aGVuIGRhdGFbc3RlcC0yXSBlbHNlIDBcbiAgICAgICAgICB0byA9IGRhdGFbc3RlcC0xXVxuICAgICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrc3RlcCwgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAyJywgc3RlcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAzXG4gICAgICAgIGlmIHVubWV0bmVlZHNHcmFwaCBhbmQgdW5tZXRuZWVkc0dyYXBoLm9wdGlvbnMubW9kZSAhPSBzdGVwXG4gICAgICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgc3RlcFxuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK2lkICAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHRleHQ6ICAgICAgICcuc2Nyb2xsLXRleHQnICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjggICAgICAgICAgICAgICAgICAgIyBzZXQgdGhlIHRyaWdnZXIgdG8gYmUgMS8yIHdheSBkb3duIHNjcmVlblxuICAgICAgICAjZGVidWc6ICAgICAgdHJ1ZSAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgaGFuZGxlQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBoYW5kbGVDb250YWluZXJFeGl0IFxuXG4gICAgIyBFbnN1cmUgdG8gc2V0dXAgb25TdGVwRW50ZXIgaGFuZGxlciBvbmx5IG9uY2VcbiAgICB1bmxlc3Mgc2Nyb2xsYW1hSW5pdGlhbGl6ZWRcbiAgICAgIHNjcm9sbGFtYUluaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgc2Nyb2xsZXIub25TdGVwRW50ZXIgIGhhbmRsZVN0ZXBFbnRlciBcbiAgICAgIFxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIGRhdGFJbmRleCA9IFswLi45OV1cbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcbiAgICAjIFJlc2l6ZSBoYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlciA9IC0+XG4gICAgICBpZiBncmFwaFdpZHRoICE9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBncmFwaFdpZHRoID0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGl0ZW1zV2lkdGggPSAoZ3JhcGhXaWR0aCAvIDIwKSAtIDEwXG4gICAgICAgIGl0ZW1zSGVpZ2h0ID0gMi4zMyppdGVtc1dpZHRoXG4gICAgICAgICNpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuICcxMCUnIGVsc2UgJzUlJ1xuICAgICAgICAjaXRlbXNIZWlnaHQgPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gZ3JhcGhXaWR0aCAqIDAuMSAvIDAuNzUgZWxzZSBncmFwaFdpZHRoICogMC4wNSAvIDAuNzVcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLnN0eWxlICd3aWR0aCcsIGl0ZW1zV2lkdGgrJ3B4J1xuICAgICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaXRlbXNIZWlnaHQrJ3B4J1xuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgICAgICAgLmF0dHIgJ3dpZHRoJywgaXRlbXNXaWR0aFxuICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCBpdGVtc0hlaWdodFxuICAgICAgdXNlR3JhcGguc3R5bGUgJ21hcmdpbi10b3AnLCAoKCQoJ2JvZHknKS5oZWlnaHQoKS11c2VHcmFwaC5ub2RlKCkub2Zmc2V0SGVpZ2h0KSouNSkrJ3B4J1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlcigpXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb24pIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICd1bm1ldC1uZWVkcy1nZHAtY29udGFpbmVyLWdyYXBoJ1xuXG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5X2duaSA9IGNvdW50cmllc19nbmkuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBjb3VudHJ5X3BvcCA9IGNvdW50cmllc19wb3B1bGF0aW9uLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeV9nbmlbMF0gYW5kIGNvdW50cnlfZ25pWzBdWycyMDE2J11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiArZFsnMjAxNyddXG4gICAgICAgICAgICBuYW1lOiBjb3VudHJ5X2duaVswXS5uYW1lXG4gICAgICAgICAgICByZWdpb246IGNvdW50cnlfZ25pWzBdLnJlZ2lvblxuICAgICAgICAgICAgcG9wdWxhdGlvbjogY291bnRyeV9wb3BbMF1bJzIwMTUnXVxuICAgICAgICAgICAgZ25pOiBjb3VudHJ5X2duaVswXVsnMjAxNiddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdObyBHTkkgb3IgUG9wdWxhdGlvbiBkYXRhIGZvciB0aGlzIGNvdW50cnknLCBkLmNvZGUsIGNvdW50cnlfZ25pWzBdXG4gICAgIyBjbGVhciBpdGVtcyB3aXRob3V0IHVubWV0LW5lZWRzIHZhbHVlc1xuICAgICNkYXRhID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuZ2RwIGFuZCBkWyd1bm1ldC1uZWVkcyddIFxuICAgICMjI1xuICAgIHVubWV0TmVlZHNHZHBHcmFwaCA9IG5ldyB3aW5kb3cuU2NhdHRlcnBsb3RVbm1ldE5lZWRzR3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAnZ25pJ1xuICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgY29sb3I6ICdnbmknICMncmVnaW9uJ1xuICAgICAgICBzaXplOiAncG9wdWxhdGlvbidcbiAgICAjIHNldCBkYXRhXG4gICAgIyMjXG4gICAgIyBzZXR1cCBncmFwaFxuICAgIHVubWV0bmVlZHNHcmFwaCA9IG5ldyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgNVxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgeDogJ2duaSdcbiAgICAgICAgeTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHNpemU6ICdwb3B1bGF0aW9uJ1xuICAgICAgICBjb2xvcjogJ2duaSdcbiAgICAgIGRvdE1pblNpemU6IDFcbiAgICAgIGRvdE1heFNpemU6IDEyXG4gICAgdW5tZXRuZWVkc0dyYXBoLnNldERhdGEgZGF0YVxuICAgICQod2luZG93KS5yZXNpemUgdW5tZXRuZWVkc0dyYXBoLm9uUmVzaXplXG5cblxuICAjIFVzZSAmIFJlYXNvbnMgbWFwc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgPSAoZGF0YV91c2UsIGNvdW50cmllcywgbWFwKSAtPlxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcblxuICAgICMgcGFyc2UgZGF0YSB1c2VcbiAgICBkYXRhX3VzZS5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiAgICAgICMjI1xuICAgICAgZFsnUmh5dGhtJ10gICAgICAgICAgICAgICAgICAgID0gK2RbJ1JoeXRobSddXG4gICAgICBkWydXaXRoZHJhd2FsJ10gICAgICAgICAgICAgICAgPSArZFsnV2l0aGRyYXdhbCddXG4gICAgICBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10gPSArZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkWydUcmFkaXRpb25hbCBtZXRob2RzJ10gPSBkWydSaHl0aG0nXStkWydXaXRoZHJhd2FsJ10rZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBjb25zb2xlLmxvZyBkLmNvZGUsIGRbJ1JoeXRobSddLCBkWydXaXRoZHJhd2FsJ10sIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSwgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkZWxldGUgZFsnUmh5dGhtJ11cbiAgICAgIGRlbGV0ZSBkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRlbGV0ZSBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgICMjI1xuICAgICAgZC52YWx1ZXMgPSBbXSAjICtkWydBbnkgbWV0aG9kJ11cbiAgICAgIGQudmFsdWUgPSAwICAjICtkWydNYWxlIHN0ZXJpbGl6YXRpb24nXVxuICAgICAgIyBnZXQgbWFpbiBtZXRob2QgaW4gZWFjaCBjb3VudHJ5XG4gICAgICBtZXRob2RzX2tleXMuZm9yRWFjaCAoa2V5LGkpIC0+XG4gICAgICAgIGQudmFsdWVzLnB1c2hcbiAgICAgICAgICBpZDogaVxuICAgICAgICAgIG5hbWU6IG1ldGhvZHNfbmFtZXNbbGFuZ11baV1cbiAgICAgICAgICB2YWx1ZTogaWYgZFtrZXldICE9ICcnIHRoZW4gK2Rba2V5XSBlbHNlIG51bGxcbiAgICAgICAgI2RlbGV0ZSBkW2tleV1cbiAgICAgICMgc29ydCBkZXNjZW5kaW5nIHZhbHVlc1xuICAgICAgI2QudmFsdWVzLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlLCBiLnZhbHVlKVxuICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ25vIGNvdW50cnknLCBkLmNvZGVcblxuICAgICMgU2V0IHVzZSBtYXBcbiAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICB0b3A6IDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IGZhbHNlXG4gICAgdXNlTWFwLnNldERhdGEgZGF0YV91c2UsIG1hcFxuICAgIHVzZU1hcC5vblJlc2l6ZSgpXG5cbiAgICAjIHNldHVwIHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlTWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFJlYXNvbnMgR3JhcGhzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnRyYWNlcHRpdmVzUmVhc29ucyA9IChkYXRhX3JlYXNvbnMsIGNvdW50cmllcykgLT5cblxuICAgIHJlYXNvbkhlYWx0aCA9IFtdXG4gICAgcmVhc29uTm90U2V4ID0gW11cbiAgICByZWFzb25PcHBvc2VkID0gW11cbiAgICByZWFzb25PcHBvc2VkUmVzcG9uZGVudCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZEh1c2JhbmQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMgPSBbXVxuXG4gICAgcmVhc29uc0tleXMgPSBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzKVxuXG4gICAgIyBwYXJzZSByZWFzb25zIGRhdGFcbiAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICMjI1xuICAgICAgcmVhc29uc0tleXMuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICBkW3JlYXNvbl0gPSArZFtyZWFzb25dXG4gICAgICAgIGlmIGRbcmVhc29uXSA+IDEwMFxuICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgIyMjXG4gICAgICByZWFzb25IZWFsdGgucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQubytkLnArZC50ICMgaGVhbHRoIGNvbmNlcm5zICsgZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zICsgaW50ZXJmZXJlcyB3aXRoIGJvZHnCknMgcHJvY2Vzc2VzXG4gICAgICByZWFzb25Ob3RTZXgucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQuYiAjIG5vdCBoYXZpbmcgc2V4XG4gICAgICByZWFzb25PcHBvc2VkLnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmkrZC5qK2QuaytkLmwgI8KgcmVzcG9uZGVudCBvcHBvc2VkICsgaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQgKyBvdGhlcnMgb3Bwb3NlZCArIHJlbGlnaW91cyBwcm9oaWJpdGlvblxuICAgICAgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQuaSAjwqByZXNwb25kZW50IG9wcG9zZWRcbiAgICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kLnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmogI8Kgcmh1c2JhbmQvcGFydG5lciBvcHBvc2VkXG4gICAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzLnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmwgI8KgcmVsaWdpb3VzIHByb2hpYml0aW9uXG5cbiAgICBzb3J0QXJyYXkgPSAoYSxiKSAtPiByZXR1cm4gYi52YWx1ZS1hLnZhbHVlXG4gICAgcmVhc29uSGVhbHRoLnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uTm90U2V4LnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZEh1c2JhbmQuc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzLnNvcnQgc29ydEFycmF5XG5cbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1oZWFsdGgnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uSGVhbHRoLnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbk9wcG9zZWQuc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW5vdC1zZXgnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uTm90U2V4LnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLXJlc3BvbmRlbnQnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQuc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtaHVzYmFuZCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJykuc2V0RGF0YSByZWFzb25PcHBvc2VkSHVzYmFuZC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1yZWxpZ2lvdXMnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uT3Bwb3NlZFJlbGlnaW91cy5zbGljZSgwLDUpXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBUcmVlbmFwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBBcHBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCA9IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMpIC0+XG4gICAgI8Kgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLWFwcC1jb250YWluZXInXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCAuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLmNoYW5nZSAtPlxuICAgICAgICBjb3VudHJ5X2NvZGUgPSAkKHRoaXMpLnZhbCgpXG4gICAgICAgIGNvbnNvbGUubG9nICdjaGFuZ2UnLCBjb3VudHJ5X2NvZGVcbiAgICAgICAgIyBVc2VcbiAgICAgICAgZGF0YV91c2VfY291bnRyeSA9IGRhdGFfdXNlLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3VzZV9jb3VudHJ5IGFuZCBkYXRhX3VzZV9jb3VudHJ5WzBdXG4gICAgICAgICAgY291bnRyeV9tZXRob2RzID0gbWV0aG9kc19rZXlzLm1hcCAoa2V5LCBpKSAtPiB7J25hbWUnOiBtZXRob2RzX25hbWVzW2xhbmddW2ldLCAndmFsdWUnOiArZGF0YV91c2VfY291bnRyeVswXVtrZXldfVxuICAgICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK2RhdGFfdXNlX2NvdW50cnlbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgY291bnRyeV9tZXRob2RzWzBdLm5hbWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoY291bnRyeV9tZXRob2RzWzBdLnZhbHVlKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcbiAgICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICAgIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5ID0gZGF0YV91bm1ldG5lZWRzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3VubWV0bmVlZHNfY291bnRyeSBhbmQgZGF0YV91bm1ldG5lZWRzX2NvdW50cnlbMF1cbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrZGF0YV91bm1ldG5lZWRzX2NvdW50cnlbMF1bJzIwMTcnXSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcbiAgICAgICAgIyBSZWFzb25zXG4gICAgICAgIGRhdGFfcmVhc29uc19jb3VudHJ5ID0gZGF0YV9yZWFzb25zLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3JlYXNvbnNfY291bnRyeSBhbmQgZGF0YV9yZWFzb25zX2NvdW50cnlbMF1cbiAgICAgICAgICByZWFzb25zID0gT2JqZWN0LmtleXMocmVhc29uc19uYW1lcykubWFwIChyZWFzb24pIC0+IHsnbmFtZSc6IHJlYXNvbnNfbmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2RhdGFfcmVhc29uc19jb3VudHJ5WzBdW3JlYXNvbl19XG4gICAgICAgICAgcmVhc29ucyA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKHJlYXNvbnNbMF0udmFsdWUpKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuICAgICAgLnZhbCB1c2VyQ291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIGlmICQoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICMgISEhIFRPRE8gLT4gVXNlIGEgc2luZ2xlIGNvdW50cmllcyBmaWxlIHdpdGggZ25pICYgcG9wdWxhdGlvbiBpbmZvIFxuICBkMy5xdWV1ZSgpXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLScrbGFuZysnLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLXBvcHVsYXRpb24tJytsYW5nKycuY3N2J1xuICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgLmRlZmVyIGQzLmpzb24sICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIGNvdW50cmllc19nbmksIGNvdW50cmllc19wb3B1bGF0aW9uLCBtYXAsIGxvY2F0aW9uKSAtPlxuXG4gICAgICBpZiBsb2NhdGlvblxuICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgIGVsc2VcbiAgICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuICAgICAgIyBhZGQgY291bnRyeSBJU08gMzE2Ni0xIGFscGhhLTMgY29kZSB0byBkYXRhX3JlYXNvbnNcbiAgICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlMiA9PSBkLmNvZGVcbiAgICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICAgIGQuY29kZSA9IGl0ZW1bMF0uY29kZVxuICAgICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgIE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgICAgIGRbcmVhc29uXSA9IDEwMCpkW3JlYXNvbl1cbiAgICAgICAgICAgIGlmIGRbcmVhc29uXSA+IDEwMFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICAgICBkZWxldGUgZC5jb3VudHJ5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLndhcm4gJ05vIGNvdW50cnkgZGF0YSBmb3IgJytkLmNvZGVcblxuICAgICAgY29uc29sZS5sb2cgdXNlckNvdW50cnlcblxuICAgICAgaWYgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCBkYXRhX3VzZVxuXG4gICAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgZGF0YV91c2UsIGNvdW50cmllcywgbWFwXG5cbiAgICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNfZ25pLCBjb3VudHJpZXNfcG9wdWxhdGlvblxuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29udHJhY2VwdGl2ZXNSZWFzb25zIGRhdGFfcmVhc29ucywgY291bnRyaWVzXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnNcblxuKSBqUXVlcnlcbiJdfQ==
