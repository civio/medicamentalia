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
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
      ScatterplotGraph.__super__.updateGraphDimensions.call(this);
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

  window.ScatterplotUnmetNeedsGraph = (function(superClass) {
    var gni_values;

    extend(ScatterplotUnmetNeedsGraph, superClass);

    gni_values = [1005, 3955, 12235];

    function ScatterplotUnmetNeedsGraph(id, options) {
      this.getDotFill = bind(this.getDotFill, this);
      this.getDotLabelText = bind(this.getDotLabelText, this);
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      options.dotSize = 7;
      options.dotMinSize = 1;
      options.dotMaxSize = 12;
      ScatterplotUnmetNeedsGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    ScatterplotUnmetNeedsGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(.125).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.color) {
        this.color = d3.scaleThreshold().range(d3.schemeOranges[5].reverse());
      }
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues(gni_values);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([0, 10, 20, 30, 40]).tickFormat(function(d) {
        return d + '%';
      });
      return this;
    };

    ScatterplotUnmetNeedsGraph.prototype.getScaleXDomain = function() {
      return [200, 85000];
    };

    ScatterplotUnmetNeedsGraph.prototype.getColorDomain = function() {
      return [1005, 3955, 12235, 100000];
    };

    ScatterplotUnmetNeedsGraph.prototype.getDotLabelText = function(d) {
      if (d.population > 10000000) {
        return d[this.options.key.id];
      } else {
        return '';
      }
    };

    ScatterplotUnmetNeedsGraph.prototype.getDotFill = function(d) {
      return this.color(d[this.options.key.color]);
    };


    /*
    drawGraph: ->
       * draw points
      super()
      @ringNote = d3.ringNote()
      @setAnnotations()
      @setXLegend()
      return @
    
    setXLegend: ->
      incomeGroups = [@x.domain()[0], 1026, 4036, 12476, @x.domain()[1]]
      @$el.find('.x-legend li').each (i, el) =>
        val = 100 * (@x(incomeGroups[i+1]) - @x(incomeGroups[i])) / @width
        $(el).width val+'%'
    
    updateGraphDimensions: ->
      super()
      @setAnnotations()
      return @
     */

    return ScatterplotUnmetNeedsGraph;

  })(window.ScatterplotGraph);

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
  (function($) {
    var baseurl, lang, methods_icons, methods_keys, methods_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupContraceptivesApp, setupScrollama, setupUnmetNeedsGdpGraph, useGraph, useMap, useTreemap, userCountry;
    useTreemap = null;
    useMap = null;
    useGraph = null;
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
              useTreemap.updateData('world', 'Mundo');
            } else if (step === 0 && e.direction === 'up') {
              useTreemap.updateData(userCountry.code, userCountry.name);
            }
          }
        }
        if (instance === 1) {
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
      var data, unmetNeedsGdpGraph;
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
            value: d['2016'],
            name: country_gni[0].name,
            region: country_gni[0].region,
            population: country_pop[0]['2015'],
            gni: country_gni[0]['2016']
          });
        } else {
          return console.log('No GNI or Population data for this country', d.code, country_gni[0]);
        }
      });
      unmetNeedsGdpGraph = new window.ScatterplotUnmetNeedsGraph('unmet-needs-gdp-graph', {
        aspectRatio: 0.5625,
        margin: {
          left: 0,
          rigth: 0,
          top: 0,
          bottom: 0
        },
        key: {
          x: 'gni',
          y: 'value',
          id: 'name',
          color: 'gni',
          size: 'population'
        }
      });
      unmetNeedsGdpGraph.setData(data);
      return $(window).resize(unmetNeedsGdpGraph.onResize);
    };
    setupConstraceptivesMaps = function(data_use, data_reasons, countries, map) {
      var parseDataReasons, parseDataUse, setupMaps;
      parseDataUse = function(d, countries) {
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
        d.values.sort(function(a, b) {
          return d3.descending(a.value, b.value);
        });
        if (item && item[0]) {
          d.name = item[0]['name_' + lang];
          return d.code_num = item[0]['code_num'];
        } else {
          return console.log('no country', d.code);
        }
      };
      parseDataReasons = function(d, countries) {
        var entries, item;
        delete d['survey-year'];
        delete d['Reason 6: Wants more children'];
        d.code_num = d.code;
        if (d.code_num.length < 3) {
          d.code_num = ('00' + d.code_num).slice(-3);
        }
        d.values = [];
        entries = d3.entries(d).filter(function(entry) {
          return entry.key.indexOf('Reason') !== -1;
        });
        entries.forEach(function(entry) {
          delete d[entry.key];
          entry.key = entry.key.replace(/Reason \d+: /g, '');
          entry.value = +entry.value;
          return d.values.push(entry);
        });
        d.values.sort(function(a, b) {
          return d3.descending(a.value, b.value);
        });
        d.value = d.values[0].key;
        item = countries.filter(function(country) {
          return country.code_num === d.code_num;
        });
        if (item && item[0]) {
          d.name = item[0]['name_' + lang];
          return d.code = item[0]['code'];
        } else {
          return console.log('no country', d.code);
        }
      };
      setupMaps = function() {
        var legend, reasons;
        data_use.forEach(function(d) {
          return parseDataUse(d, countries);
        });
        data_reasons.forEach(function(d) {
          return parseDataReasons(d, countries);
        });
        reasons = d3.nest().key(function(d) {
          return d.value;
        }).entries(data_reasons).sort(function(a, b) {
          return d3.descending(a.values.length, b.values.length);
        });
        console.log(reasons);
        reasons = reasons.map(function(d) {
          return d.key;
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
        legend = d3.select('#map-contraceptives-reasons').append('ul').attr('id', 'map-contraceptives-reasons-legend').selectAll('li').data(reasons).enter().append('li').style('list-style', 'none').style('display', 'inline-block').style('font-size', '1.25rem').style('margin', '0 .5rem');
        legend.append('span').attr('class', 'legend-item');
        legend.append('span').html(function(d) {
          return d;
        });

        /*
         * Set reasons map
        reasonsMap = new window.MapGraph 'map-contraceptives-reasons',
          aspectRatio: 0.5625
          margin:
            top: 0
            bottom: 0
          legend: false
        reasonsMap.color = d3.scaleOrdinal d3.schemeCategory20
        reasonsMap.setColorDomain = ->
          reasonsMap.color.domain reasons
        console.log data_reasons
        reasonsMap.setData data_reasons, map
        reasonsMap.onResize()
        
         * Set legend color
        legend.selectAll('.legend-item')
          .style 'display', 'inline-block'
          .style 'width', '10px'
          .style 'height', '10px'
          .style 'margin-right', '5px'
          .style 'background', (d) -> reasonsMap.color d
         */
        return $(window).resize(function() {
          return useMap.onResize();
        });
      };
      setupScrollama('contraceptives-use-container');
      return setupMaps(data_use, data_reasons, countries, map);
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
    setupContraceptivesApp = function() {
      return setupScrollama('contraceptives-app-container');
    };
    if ($('#contraceptives-use-graph').length > 0) {
      setupConstraceptivesUseGraph();
    }
    return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-barriers-reasons.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.csv, baseurl + '/data/countries-gni-' + lang + '.csv').defer(d3.csv, baseurl + '/data/countries-population-' + lang + '.csv').defer(d3.json, baseurl + '/data/map-world-110.json').defer(d3.json, 'https://freegeoip.net/json/').await(function(error, data_use, data_unmetneeds, data_reasons, countries, countries_gni, countries_population, map, location) {
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
      console.log(userCountry);
      if ($('#treemap-contraceptives-use').length > 0) {
        setupConstraceptivesUseTreemap(data_use);
      }
      if ($('#map-contraceptives-use').length > 0) {
        setupConstraceptivesMaps(data_use, data_reasons, countries, map);
      }
      if ($('#unmet-needs-gdp-graph').length > 0) {
        setupUnmetNeedsGdpGraph(data_unmetneeds, countries_gni, countries_population);
      }
      if ($('#contraceptives-app').length > 0) {
        return setupContraceptivesApp();
      }
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtdW5tZXQtbmVlZHMtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQ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R0EsSUFBRyxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxNQUF6QixHQUFrQyxDQUFyQztlQUNFLHNCQUFBLENBQUEsRUFERjs7SUF6QkssQ0FUVDtFQXZiRCxDQUFELENBQUEsQ0E0ZEUsTUE1ZEY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICBjb25zb2xlLmxvZyBAY29sb3IuZG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCAoZCkgLT4gZFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICAjIGdldCBjb3VudHJpZXMgZGF0YVxuICAgIEBjb3VudHJpZXMgPSB0b3BvanNvbi5mZWF0dXJlKG1hcCwgbWFwLm9iamVjdHMuY291bnRyaWVzKTtcbiAgICBAY291bnRyaWVzLmZlYXR1cmVzID0gQGNvdW50cmllcy5mZWF0dXJlcy5maWx0ZXIgKGQpIC0+IGQuaWQgIT0gJzAxMCcgICMgcmVtb3ZlIGFudGFyY3RpY2FcbiAgICAjIHNldCBwcm9qZWN0aW9uXG4gICAgQHByb2plY3Rpb24gPSBkMy5nZW9LYXZyYXlza2l5NygpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICAjIHNldCBwYXRoXG4gICAgQHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAgIC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgIyBhZGQgY291bnRyaWVzIHBhdGhzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAuZGF0YShAY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NvdW50cnktJytkLmlkXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2NvdW50cnknXG4gICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAxXG4gICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICMgdHJpZ2dlciBkcmF3LWNvbXBsZXRlIGV2ZW50XG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG5cbiAgZ2V0TGVnZW5kRGF0YTogPT5cbiAgICByZXR1cm4gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZSA9IDBcblxuXG4gICMgb3ZlcnJpZGUgZ2V0RGltZW5zaW9uc1xuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIGJvZHlIZWlnaHQgPSAkKCdib2R5JykuaGVpZ2h0KClcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICBlbHNlXG4gICAgICAgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuXG4gICMjI1xuICAjIG92ZXJyaWRlIGNvbG9yIHNjYWxlXG4gIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCBkMy5zY2hlbWVDYXRlZ29yeTIwXG4gICMgb3ZlcnJpZGUgc2V0Q291bnRyeUNvbG9yXG4gIEBzZXRDb3VudHJ5Q29sb3IgPSAoZCkgLT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWVbMF1cbiAgICAgICNjb25zb2xlLmxvZyBAY29sb3JcbiAgICAgIGNvbnNvbGUubG9nIHZhbHVlWzBdLnZhbHVlc1swXS5pZCwgdmFsdWVbMF0udmFsdWVzWzBdLm5hbWUsIEBjb2xvcih2YWx1ZVswXS52YWx1ZXNbMF0uaWQpXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlc1swXS5pZCkgZWxzZSAnI2VlZSdcbiAgI0Bmb3JtYXRGbG9hdCA9IEBmb3JtYXRJbnRlZ2VyXG4gICNAZ2V0TGVnZW5kRGF0YSA9IC0+IFswLDIsNCw2LDhdXG4gIEBzZXRUb29sdGlwRGF0YSA9IChkKSAtPlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbidcbiAgICAgICMuaHRtbCBkLnZhbHVlc1swXS5uYW1lKycgKCcrZC52YWx1ZXNbMF0udmFsdWUrJyUpJ1xuICAgICAgLmh0bWwgZC52YWx1ZSsnJSdcbiAgIyMjXG5cblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgaWYgc3RhdGUgPT0gMVxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0ZlbWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gMlxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0lVRCddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDNcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydQaWxsJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNFxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ01hbGUgY29uZG9tJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNVxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0luamVjdGFibGUnXVxuICAgICAgZWxzZSBpZiBzdGF0ZSA9PSA2XG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpIC0+IGQudmFsdWUgPSArZFsnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCddXG4gICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnU2NhdHRlcnBsb3QgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA3XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqA3XG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDEyXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjI1KVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50KDAuNSlcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRDb2xvclJhbmdlOiA9PlxuICAgIHJldHVybiBbJyNDOUFENEInLCAnI0JCRDY0NicsICcjNjNCQTJEJywgJyMzNEE4OTMnLCAnIzNEOTFBRCcsICcjNUI4QUNCJywgJyNCQTdEQUYnLCAnI0JGNkI4MCcsICcjRjQ5RDlEJywgJyNFMjU0NTMnLCAnI0I1NjYzMScsICcjRTI3NzNCJywgJyNGRkE5NTEnLCAnI0Y0Q0EwMCddXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIGQzLmV4dGVudCBAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHNldCBjb2xvciBkb21haW5cbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCBzaXplIGRvbWFpblxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBwb2ludHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdElkXG4gICAgICAuYXR0ciAncicsIEBnZXREb3RTaXplXG4gICAgICAuc3R5bGUgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90LWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdExhYmVsSWRcbiAgICAgIC5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAuYXR0ciAnZHknLCAnMC4zNzVlbSdcbiAgICAgIC50ZXh0IEBnZXREb3RMYWJlbFRleHRcbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICAjIGNhbGwgQmFzZWdyYXBoLnVwZGF0ZUdyYXBoRGltZW5zaW9uc1xuICAgIHN1cGVyKClcbiAgICAjIHVwZGF0ZSBkb3RzIHBvc2l0aW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgcmV0dXJuIEBcblxuICBnZXREb3RJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbElkOiAoZCkgPT5cbiAgICByZXR1cm4gJ2RvdC1sYWJlbC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGdldERvdExhYmVsVGV4dDogKGQpID0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGdldERvdFNpemU6IChkKSA9PlxuICAgIGlmIEBzaXplXG4gICAgICByZXR1cm4gQHNpemUgZFtAb3B0aW9ucy5rZXkuc2l6ZV1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gQG9wdGlvbnMuZG90U2l6ZVxuXG4gIGdldERvdEZpbGw6IChkKSA9PlxuICAgIGlmIEBjb2xvclxuICAgICAgcmV0dXJuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbFxuXG4gIHNldERvdHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gQHggZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS55XVxuXG4gIHNldERvdExhYmVsc0RpbWVuc2lvbnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBAeSBkW0BvcHRpb25zLmtleS55XVxuXG4gICMgb3ZlcnJpZCB4IGF4aXMgcG9zaXRpb25pbmdcbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJ1xuXG4gIG9uUmVzaXplOiA9PlxuICAgIGlmIEAkZWwgYW5kIEBjb250YWluZXJXaWR0aCAhPSBAJGVsLndpZHRoKClcbiAgICAgIHN1cGVyKClcbiAgICByZXR1cm4gQFxuXG4gICMgbW91c2UgZXZlbnRzXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICBlbGVtZW50ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldClcbiAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICBAc2V0VG9vbHRpcERhdGEgZFxuICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICBsZWZ0OiAgICArZWxlbWVudC5hdHRyKCdjeCcpICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICB0b3A6ICAgICArZWxlbWVudC5hdHRyKCdjeScpICsgQG9wdGlvbnMubWFyZ2luLnRvcCAtIEAkdG9vbHRpcC5oZWlnaHQoKSAtIDE1XG4gICAgICBvcGFjaXR5OiAxXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS5pZF1cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUteCdcbiAgICAgIC5odG1sIGRbQG9wdGlvbnMua2V5LnhdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlLXknXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS55XVxuXG4gICAgIiwiY2xhc3Mgd2luZG93LlNjYXR0ZXJwbG90VW5tZXROZWVkc0dyYXBoIGV4dGVuZHMgd2luZG93LlNjYXR0ZXJwbG90R3JhcGhcblxuICBnbmlfdmFsdWVzID0gWzEwMDUsIDM5NTUsIDEyMjM1XVxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdTY2F0dGVycGxvdCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgb3B0aW9ucy5kb3RTaXplID0gN1xuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IDFcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSAxMlxuICAgICNAbGFuZyA9IGxhbmdcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZVBvdygpXG4gICAgICAuZXhwb25lbnQoLjEyNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0ucmV2ZXJzZSgpXG4gICAgICAjQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICMgIC5yYW5nZSBAZ2V0Q29sb3JSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIGduaV92YWx1ZXNcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjAwLCA4NTAwMF1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICByZXR1cm4gWzEwMDUsIDM5NTUsIDEyMjM1LCAxMDAwMDBdXG4gIFxuICBnZXREb3RMYWJlbFRleHQ6IChkKSA9PlxuICAgIHJldHVybiBpZiBkLnBvcHVsYXRpb24gPiAxMDAwMDAwMCB0aGVuIGRbQG9wdGlvbnMua2V5LmlkXSBlbHNlICcnXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgXG4gICAgI2NvbnNvbGUubG9nIHZhbHVlLCBAY29sb3IgdmFsdWVcbiAgICAjIHJldHVybiBpZiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gJzEnIHRoZW4gJyMwMDc5N2QnIGVsc2UgaWYgZFtAb3B0aW9ucy5rZXkuY29sb3JdID09ICcwJyB0aGVuICcjRDY0QjA1JyBlbHNlICcjYWFhJyAgICAgICBcbiAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gICMjI1xuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IHBvaW50c1xuICAgIHN1cGVyKClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgQHNldEFubm90YXRpb25zKClcbiAgICBAc2V0WExlZ2VuZCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRYTGVnZW5kOiAtPlxuICAgIGluY29tZUdyb3VwcyA9IFtAeC5kb21haW4oKVswXSwgMTAyNiwgNDAzNiwgMTI0NzYsIEB4LmRvbWFpbigpWzFdXVxuICAgIEAkZWwuZmluZCgnLngtbGVnZW5kIGxpJykuZWFjaCAoaSwgZWwpID0+XG4gICAgICB2YWwgPSAxMDAgKiAoQHgoaW5jb21lR3JvdXBzW2krMV0pIC0gQHgoaW5jb21lR3JvdXBzW2ldKSkgLyBAd2lkdGhcbiAgICAgICQoZWwpLndpZHRoIHZhbCsnJSdcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG4gICAgcmV0dXJuIEBcbiAgIyMjXG5cbiAgICAiLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgODBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdHJlZW1hcFJvb3QgPSBAc3RyYXRpZnkoQGRhdGEpXG4gICAgICAuc3VtIChkKSA9PiBkW0BvcHRpb25zLmtleS52YWx1ZV1cbiAgICAgIC5zb3J0IChhLCBiKSAtPiBiLnZhbHVlIC0gYS52YWx1ZVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBkcmF3IG5vZGVzXG4gICAgQG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICMgICAgLm9uICdtb3VzZW92ZXInLCBvbk5vZGVPdmVyXG4gICAgIyAgICAub24gJ21vdXNlbW92ZScsIG9uTm9kZU1vdmVcbiAgICAjICAgIC5vbiAnbW91c2VvdXQnLCAgb25Ob2RlT3V0XG4gICAgIyAgICAub24gJ2NsaWNrJywgICAgIG9uTm9kZUNsaWNrXG4gICAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uXG5cbiAgICBAZHJhd0dyYXBoTGFiZWxzKClcblxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHJlbW92ZSBub2RlIGxhYmVsc1xuICAgIEBub2Rlcy5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJykucmVtb3ZlKClcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgQG5vZGVzLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uIEBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvblxuICAgICAgLm9uICdlbmQnLCAoZCxpKSA9PlxuICAgICAgICBpZiAoaSA9PSBAbm9kZXMuc2l6ZSgpLTEpXG4gICAgICAgICAgQGRyYXdHcmFwaExhYmVscygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvblxuXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGhMYWJlbHM6IC0+XG4gICAgIyBhZGQgbGFiZWwgb25seSBpbiBub2RlcyB3aXRoIHNpemUgZ3JlYXRlciB0aGVuIG9wdGlvbnMubWluU2l6ZVxuICAgIEBub2Rlcy5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbCdcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsIEBzZXROb2RlTGFiZWxcblxuICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgQG5vZGVzLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlXG4gICAgICAuc2VsZWN0QWxsICcubm9kZS1sYWJlbCdcbiAgICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVE9ETyEhISBDaGFuZ2UgYXNwZWN0IHJhdGlvIGJhc2VkIG9uIG1vYmlsZUJyZWFrcG9pbnRcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQG5vZGVzLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICAjIFVwZGF0ZSBub2RlcyBhdHRyaWJ1dGVzICYgaXRzIGxhYmVsc1xuICAgIEBub2Rlc1xuICAgICAgLmNhbGwgQHNldE5vZGVcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGVcbiAgICAgIC5zZWxlY3RBbGwgJy5ub2RlLWxhYmVsJ1xuICAgICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSdcblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgICMuc3R5bGUgJ2JhY2tncm91bmQnLCAoZCkgLT4gd2hpbGUgKGQuZGVwdGggPiAxKSBkID0gZC5wYXJlbnQ7IHJldHVybiBjb2xvclNjYWxlKGdldFBhcmVudElkKGQpKTsgfSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG4gICAgICAjLnNlbGVjdCAnLm5vZGUtbGFiZWwnXG4gICAgICAjICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJ1xuXG4gIHNldE5vZGVMYWJlbDogKHNlbGVjdGlvbikgPT5cbiAgICBsYWJlbCA9IHNlbGVjdGlvbi5hcHBlbmQgJ2RpdidcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsLWNvbnRlbnQnXG4gICAgIyMjXG4gICAgbGFiZWwuYXBwZW5kICdzdmcnXG4gICAgICAuYXR0ciAndmlld0JveCcsICcwIDAgMjQgMjQnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAyNFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIDI0XG4gICAgICAuYXBwZW5kICd1c2UnXG4gICAgICAgIC5hdHRyICd4bGluazpocmVmJywgKGQpIC0+ICcjaWNvbi0nK2QuZGF0YS5pY29uXG4gICAgIyMjXG4gICAgbGFiZWwuYXBwZW5kICdwJ1xuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIHNldE5vZGVEaW1lbnNpb246IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAjIyMgbWVyZ2UgVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHMsIExhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kICYgRW1lcmdlbmN5IGNvbnRyYWNlcHRpb24gaW4gT3RoZXIgbW9kZXJuIG1ldGhvZHNcbiAgICBnZXRLZXlWYWx1ZSA9IChrZXksIGRhdGEpIC0+XG4gICAgICBpZiBrZXkgIT0gJ290aGVyLW1vZGVybi1tZXRob2RzJ1xuICAgICAgICByZXR1cm4gZGF0YVtrZXldXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBkYXRhW2tleV0rbWVyZ2Vfa2V5cy5yZWR1Y2UoKHN1bSwgdmFsdWUpIC0+IHN1bStkYXRhW3ZhbHVlXSlcbiAgICAjIyNcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgIG1ldGhvZHMgPSB7fVxuICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgbWV0aG9kc1trZXldID1cbiAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgIHZhbHVlOiArZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgY29uc29sZS5sb2cgbWV0aG9kc1xuICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgaWYga2V5ICE9ICdPdGhlciBtb2Rlcm4gbWV0aG9kcycgYW5kIGtleSAhPSAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCcgYW5kIG1ldGhvZC52YWx1ZSA8IDVcbiAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgIGlkOiBtZXRob2QuaWRcbiAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArICBtZXRob2QubmFtZSArICc8L3N0cm9uZz48YnIvPicgKyBNYXRoLnJvdW5kKG1ldGhvZC52YWx1ZSkgKyAnJSdcbiAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgIGNvbnNvbGUubG9nIHBhcnNlZERhdGFcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSkiLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgdXNlVHJlZW1hcCA9IG51bGxcbiAgdXNlTWFwID0gbnVsbFxuICB1c2VHcmFwaCA9IG51bGxcblxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiRXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiRXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcIkltcGxhbnRlXCJcbiAgICAgIFwiSW55ZWN0YWJsZVwiXG4gICAgICBcIlDDrWxkb3JhXCJcbiAgICAgIFwiQ29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJDb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwiTcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwiTcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcIkFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwiT3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJNw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcIkltcGxhbnRcIlxuICAgICAgXCJJbmplY3RhYmxlXCJcbiAgICAgIFwiUGlsbFwiXG4gICAgICBcIk1hbGUgY29uZG9tXCJcbiAgICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwiVHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG5cblxuICAjIFNjcm9sbGFtYSBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwU2Nyb2xsYW1hID0gKGlkKSAtPlxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycraWQpXG4gICAgZ3JhcGhpYyAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBjaGFydCAgICAgPSBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgdGV4dCAgICAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC10ZXh0JylcbiAgICBzdGVwcyAgICAgPSB0ZXh0LnNlbGVjdEFsbCgnLnN0ZXAnKVxuXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIHNjcm9sbGVyID0gc2Nyb2xsYW1hKClcblxuICAgICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gICAgaGFuZGxlUmVzaXplID0gLT5cbiAgICAgIHdpZHRoID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgICBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgICAgZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICAgIGNoYXJ0XG4gICAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICAgIHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgICBoYW5kbGVDb250YWluZXJFbnRlciA9IChlKSAtPlxuICAgICAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAgIGhhbmRsZUNvbnRhaW5lckV4aXQgPSAoZSkgLT5cbiAgICAgICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIGhhbmRsZVN0ZXBFbnRlciA9IChlKSAtPlxuICAgICAgI8KgY29uc29sZS5sb2cgZVxuICAgICAgJHN0ZXAgPSAkKGUuZWxlbWVudClcbiAgICAgIGluc3RhbmNlID0gJHN0ZXAuZGF0YSgnaW5zdGFuY2UnKVxuICAgICAgc3RlcCA9ICRzdGVwLmRhdGEoJ3N0ZXAnKVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMCBcbiAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAwJywgc3RlcFxuICAgICAgICBpZiB1c2VUcmVlbWFwXG4gICAgICAgICAgaWYgc3RlcCA9PSAxXG4gICAgICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgJ3dvcmxkJywgJ011bmRvJ1xuICAgICAgICAgIGVsc2UgaWYgc3RlcCA9PSAwIGFuZCBlLmRpcmVjdGlvbiA9PSAndXAnXG4gICAgICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAxJywgc3RlcFxuICAgICAgICAgIHVzZU1hcC5zZXRNYXBTdGF0ZSBzdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAyXG4gICAgICAgIGlmIHVzZUdyYXBoIGFuZCBzdGVwID4gMFxuICAgICAgICAgIGRhdGEgPSBbNjMsIDg4LCAxMDBdICMgNjMsIDYzKzI1LCA2MysyNSsxMlxuICAgICAgICAgIGZyb20gPSBpZiBzdGVwID4gMSB0aGVuIGRhdGFbc3RlcC0yXSBlbHNlIDBcbiAgICAgICAgICB0byA9IGRhdGFbc3RlcC0xXVxuICAgICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrc3RlcCwgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG4gICAgICAgICAgY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAyJywgc3RlcFxuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK2lkICAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHRleHQ6ICAgICAgICcuc2Nyb2xsLXRleHQnICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjggICAgICAgICAgICAgICAgICAgIyBzZXQgdGhlIHRyaWdnZXIgdG8gYmUgMS8yIHdheSBkb3duIHNjcmVlblxuICAgICAgICAjZGVidWc6ICAgICAgdHJ1ZSAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgaGFuZGxlQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBoYW5kbGVDb250YWluZXJFeGl0IFxuXG4gICAgIyBFbnN1cmUgdG8gc2V0dXAgb25TdGVwRW50ZXIgaGFuZGxlciBvbmx5IG9uY2VcbiAgICB1bmxlc3Mgc2Nyb2xsYW1hSW5pdGlhbGl6ZWRcbiAgICAgIHNjcm9sbGFtYUluaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgc2Nyb2xsZXIub25TdGVwRW50ZXIgIGhhbmRsZVN0ZXBFbnRlciBcbiAgICAgIFxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIGRhdGFJbmRleCA9IFswLi45OV1cbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcbiAgICAjIFJlc2l6ZSBoYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlciA9IC0+XG4gICAgICBpZiBncmFwaFdpZHRoICE9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBncmFwaFdpZHRoID0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGl0ZW1zV2lkdGggPSAoZ3JhcGhXaWR0aCAvIDIwKSAtIDEwXG4gICAgICAgIGl0ZW1zSGVpZ2h0ID0gMi4zMyppdGVtc1dpZHRoXG4gICAgICAgICNpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuICcxMCUnIGVsc2UgJzUlJ1xuICAgICAgICAjaXRlbXNIZWlnaHQgPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gZ3JhcGhXaWR0aCAqIDAuMSAvIDAuNzUgZWxzZSBncmFwaFdpZHRoICogMC4wNSAvIDAuNzVcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLnN0eWxlICd3aWR0aCcsIGl0ZW1zV2lkdGgrJ3B4J1xuICAgICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaXRlbXNIZWlnaHQrJ3B4J1xuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgICAgICAgLmF0dHIgJ3dpZHRoJywgaXRlbXNXaWR0aFxuICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCBpdGVtc0hlaWdodFxuICAgICAgdXNlR3JhcGguc3R5bGUgJ21hcmdpbi10b3AnLCAoKCQoJ2JvZHknKS5oZWlnaHQoKS11c2VHcmFwaC5ub2RlKCkub2Zmc2V0SGVpZ2h0KSouNSkrJ3B4J1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlcigpXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb24pIC0+XG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5X2duaSA9IGNvdW50cmllc19nbmkuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBjb3VudHJ5X3BvcCA9IGNvdW50cmllc19wb3B1bGF0aW9uLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeV9nbmlbMF0gYW5kIGNvdW50cnlfZ25pWzBdWycyMDE2J11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiBkWycyMDE2J11cbiAgICAgICAgICAgIG5hbWU6IGNvdW50cnlfZ25pWzBdLm5hbWVcbiAgICAgICAgICAgIHJlZ2lvbjogY291bnRyeV9nbmlbMF0ucmVnaW9uXG4gICAgICAgICAgICBwb3B1bGF0aW9uOiBjb3VudHJ5X3BvcFswXVsnMjAxNSddXG4gICAgICAgICAgICBnbmk6IGNvdW50cnlfZ25pWzBdWycyMDE2J11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ05vIEdOSSBvciBQb3B1bGF0aW9uIGRhdGEgZm9yIHRoaXMgY291bnRyeScsIGQuY29kZSwgY291bnRyeV9nbmlbMF1cbiAgICAjIGNsZWFyIGl0ZW1zIHdpdGhvdXQgdW5tZXQtbmVlZHMgdmFsdWVzXG4gICAgI2RhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5nZHAgYW5kIGRbJ3VubWV0LW5lZWRzJ10gXG4gICAgdW5tZXROZWVkc0dkcEdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdFVubWV0TmVlZHNHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICdnbmknXG4gICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICBjb2xvcjogJ2duaScgIydyZWdpb24nXG4gICAgICAgIHNpemU6ICdwb3B1bGF0aW9uJ1xuICAgICMgc2V0IGRhdGFcbiAgICB1bm1ldE5lZWRzR2RwR3JhcGguc2V0RGF0YSBkYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1bm1ldE5lZWRzR2RwR3JhcGgub25SZXNpemVcblxuXG4gICMgVXNlICYgUmVhc29ucyBtYXBzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyA9IChkYXRhX3VzZSwgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgIHBhcnNlRGF0YVVzZSA9IChkLCBjb3VudHJpZXMpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICBkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNjb25zb2xlLmxvZyBkLnZhbHVlc1xuICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ25vIGNvdW50cnknLCBkLmNvZGVcblxuICAgIHBhcnNlRGF0YVJlYXNvbnMgPSAoZCwgY291bnRyaWVzKSAtPlxuICAgICAgZGVsZXRlIGRbJ3N1cnZleS15ZWFyJ11cbiAgICAgIGRlbGV0ZSBkWydSZWFzb24gNjogV2FudHMgbW9yZSBjaGlsZHJlbiddXG4gICAgICBkLmNvZGVfbnVtID0gZC5jb2RlXG4gICAgICAjIHByZXBlbmQgemVyb3MgdG8gY29kZXMgbGVzcyB0aGFuIDEwMFxuICAgICAgaWYgZC5jb2RlX251bS5sZW5ndGggPCAzXG4gICAgICAgIGQuY29kZV9udW0gPSAoJzAwJytkLmNvZGVfbnVtKS5zbGljZSgtMylcbiAgICAgICMgcG9wdWxhdGUgdmFsdWVzIGFycmF5IHdpdGggcmVhc29uc1xuICAgICAgZC52YWx1ZXMgPSBbXVxuXG4gICAgICBlbnRyaWVzID0gZDMuZW50cmllcyhkKS5maWx0ZXIgKGVudHJ5KSAtPiBlbnRyeS5rZXkuaW5kZXhPZignUmVhc29uJykgIT0gLTFcbiAgICAgIGVudHJpZXMuZm9yRWFjaCAoZW50cnkpIC0+XG4gICAgICAgIGRlbGV0ZSBkW2VudHJ5LmtleV1cbiAgICAgICAgZW50cnkua2V5ID0gZW50cnkua2V5LnJlcGxhY2UoL1JlYXNvbiBcXGQrOiAvZywgJycpXG4gICAgICAgIGVudHJ5LnZhbHVlID0gK2VudHJ5LnZhbHVlXG4gICAgICAgIGQudmFsdWVzLnB1c2ggZW50cnlcbiAgICAgICMgc29ydCBkZXNjZW5kaW5nIHZhbHVlc1xuICAgICAgZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBkLnZhbHVlID0gZC52YWx1ZXNbMF0ua2V5XG4gICAgICAjIHNldHVwIGNvdW50cnkgbmFtZSAmIGlzby0zIGNvZGVcbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGVfbnVtID09IGQuY29kZV9udW1cbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZSA9IGl0ZW1bMF1bJ2NvZGUnXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgc2V0dXBNYXBzID0gLT5cbiAgICAgICMgcGFyc2UgZGF0YSB1c2VcbiAgICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+IHBhcnNlRGF0YVVzZShkLCBjb3VudHJpZXMpXG5cbiAgICAgICMgcGFyc2UgZGF0YSByZWFzb25zXG4gICAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT4gcGFyc2VEYXRhUmVhc29ucyhkLCBjb3VudHJpZXMpXG5cbiAgICAgICMgR2V0IGRhdGEgcmVhc29ucyBrZXlzXG4gICAgICByZWFzb25zID0gZDMubmVzdCgpXG4gICAgICAgIC5rZXkgKGQpIC0+IGQudmFsdWVcbiAgICAgICAgLmVudHJpZXMgZGF0YV9yZWFzb25zXG4gICAgICAgIC5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZXMubGVuZ3RoLCBiLnZhbHVlcy5sZW5ndGgpXG5cbiAgICAgIGNvbnNvbGUubG9nIHJlYXNvbnNcblxuICAgICAgcmVhc29ucyA9IHJlYXNvbnMubWFwIChkKSAtPiBkLmtleVxuICAgICAgIFxuICAgICAgIyBTZXQgdXNlIG1hcFxuICAgICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgICBtYXJnaW46XG4gICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgYm90dG9tOiAwXG4gICAgICAgIGxlZ2VuZDogZmFsc2VcbiAgICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcbiAgICAgIHVzZU1hcC5vblJlc2l6ZSgpXG5cbiAgICAgICMgU2V0dXAgcmVhc29ucyBtYXAgbGVnZW5kXG4gICAgICBsZWdlbmQgPSBkMy5zZWxlY3QoJyNtYXAtY29udHJhY2VwdGl2ZXMtcmVhc29ucycpLmFwcGVuZCgndWwnKVxuICAgICAgICAuYXR0ciAnaWQnLCAnbWFwLWNvbnRyYWNlcHRpdmVzLXJlYXNvbnMtbGVnZW5kJ1xuICAgICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgIC5kYXRhIHJlYXNvbnNcbiAgICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgICAgLnN0eWxlICdsaXN0LXN0eWxlJywgJ25vbmUnXG4gICAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2lubGluZS1ibG9jaydcbiAgICAgICAgICAuc3R5bGUgJ2ZvbnQtc2l6ZScsICcxLjI1cmVtJ1xuICAgICAgICAgIC5zdHlsZSAnbWFyZ2luJywgJzAgLjVyZW0nXG5cbiAgICAgIGxlZ2VuZC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kLWl0ZW0nXG5cbiAgICAgIGxlZ2VuZC5hcHBlbmQoJ3NwYW4nKS5odG1sIChkKSAtPiBkXG5cbiAgICAgICMjI1xuICAgICAgIyBTZXQgcmVhc29ucyBtYXBcbiAgICAgIHJlYXNvbnNNYXAgPSBuZXcgd2luZG93Lk1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtcmVhc29ucycsXG4gICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgbWFyZ2luOlxuICAgICAgICAgIHRvcDogMFxuICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICBsZWdlbmQ6IGZhbHNlXG4gICAgICByZWFzb25zTWFwLmNvbG9yID0gZDMuc2NhbGVPcmRpbmFsIGQzLnNjaGVtZUNhdGVnb3J5MjBcbiAgICAgIHJlYXNvbnNNYXAuc2V0Q29sb3JEb21haW4gPSAtPlxuICAgICAgICByZWFzb25zTWFwLmNvbG9yLmRvbWFpbiByZWFzb25zXG4gICAgICBjb25zb2xlLmxvZyBkYXRhX3JlYXNvbnNcbiAgICAgIHJlYXNvbnNNYXAuc2V0RGF0YSBkYXRhX3JlYXNvbnMsIG1hcFxuICAgICAgcmVhc29uc01hcC5vblJlc2l6ZSgpXG5cbiAgICAgICMgU2V0IGxlZ2VuZCBjb2xvclxuICAgICAgbGVnZW5kLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2lubGluZS1ibG9jaydcbiAgICAgICAgLnN0eWxlICd3aWR0aCcsICcxMHB4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsICcxMHB4J1xuICAgICAgICAuc3R5bGUgJ21hcmdpbi1yaWdodCcsICc1cHgnXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSAtPiByZWFzb25zTWFwLmNvbG9yIGRcbiAgICAgICMjI1xuXG4gICAgICAjIHNldHVwIHJlc2l6ZVxuICAgICAgJCh3aW5kb3cpLnJlc2l6ZSAtPlxuICAgICAgICB1c2VNYXAub25SZXNpemUoKVxuICAgICAgICAjcmVhc29uc01hcC5vblJlc2l6ZSgpXG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuXG4gICAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICAgc2V0dXBNYXBzIGRhdGFfdXNlLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIEFwcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBBcHBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCA9IC0+XG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLWFwcC1jb250YWluZXInXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoKClcblxuICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgIyAhISEgVE9ETyAtPiBVc2UgYSBzaW5nbGUgY291bnRyaWVzIGZpbGUgd2l0aCBnbmkgJiBwb3B1bGF0aW9uIGluZm8gXG4gIGQzLnF1ZXVlKClcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtYmFycmllcnMtcmVhc29ucy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktJytsYW5nKycuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtcG9wdWxhdGlvbi0nK2xhbmcrJy5jc3YnXG4gICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb24sIG1hcCwgbG9jYXRpb24pIC0+XG5cbiAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgZWxzZVxuICAgICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG4gICAgICBjb25zb2xlLmxvZyB1c2VyQ291bnRyeVxuXG4gICAgICBpZiAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGggPiAwXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCBkYXRhX3VzZVxuXG4gICAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aCA+IDBcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwXG5cbiAgICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICAgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoIGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb25cblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aCA+IDBcbiAgICAgICAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCgpXG5cbikgalF1ZXJ5XG4iXX0=
