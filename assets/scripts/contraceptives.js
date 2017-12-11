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
    extend(ScatterplotUnmetNeedsGraph, superClass);

    function ScatterplotUnmetNeedsGraph(id, options) {
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      options.dotSize = 7;
      options.dotMinSize = 2;
      options.dotMaxSize = 18;
      ScatterplotUnmetNeedsGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    ScatterplotUnmetNeedsGraph.prototype.setScales = function() {
      this.x = d3.scalePow().exponent(0.25).range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.color) {
        this.color = d3.scaleOrdinal().range(this.getColorRange());
      }
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues([1000, 2000, 4000, 8000, 16000, 32000]);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([0, 10, 20, 30, 40]).tickFormat(function(d) {
        return d + '%';
      });
      return this;
    };

    ScatterplotUnmetNeedsGraph.prototype.getScaleXDomain = function() {
      return [600, 35000];
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
  (function($) {
    var baseurl, keys, lang, setupConstraceptivesMaps, setupScrollama, setupUnmetNeedsGdpGraph, useMap;
    useMap = null;
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
    keys = ["Female sterilization", "Male sterilization", "IUD", "Implant", "Injectable", "Pill", "Male condom", "Female condom", "Vaginal barrier methods", "Lactational amenorrhea method (LAM)", "Emergency contraception", "Other modern methods", "Any traditional method"];
    setupScrollama = function() {
      var chart, container, graphic, handleContainerEnter, handleContainerExit, handleResize, handleStepEnter, scroller, steps, text;
      container = d3.select('#contraceptives-use-container');
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
      handleStepEnter = function(e) {
        if (useMap) {
          return useMap.setMapState(e.index);
        }
      };
      handleContainerEnter = function(e) {
        return graphic.classed('is-fixed', true).classed('is-bottom', false);
      };
      handleContainerExit = function(e) {
        return graphic.classed('is-fixed', false).classed('is-bottom', e.direction === 'down');
      };
      handleResize();
      scroller.setup({
        container: '#contraceptives-use-container',
        graphic: '.scroll-graphic',
        text: '.scroll-text',
        step: '.scroll-text .step',
        offset: 0.8
      }).onStepEnter(handleStepEnter).onContainerEnter(handleContainerEnter).onContainerExit(handleContainerExit);
      return window.addEventListener('resize', handleResize);
    };
    setupUnmetNeedsGdpGraph = function() {
      return d3.csv(baseurl + '/data/unmet-needs-gdp-' + lang + '.csv', function(error, data) {
        var unmetNeedsGdpGraph;
        console.log(data);
        data = data.filter(function(d) {
          return d.gdp && d['unmet-needs'];
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
            x: 'gdp',
            y: 'unmet-needs',
            id: 'name',
            size: 'population',
            color: 'region'
          }
        });
        unmetNeedsGdpGraph.setData(data);
        return $(window).resize(unmetNeedsGdpGraph.onResize);
      });
    };
    setupConstraceptivesMaps = function() {
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
        keys.forEach(function(key, i) {
          return d.values.push({
            id: i,
            name: key,
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
      setupMaps = function(error, data_use, data_reasons, countries, map) {
        var legend, reasons, reasonsMap;
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
        reasonsMap = new window.MapGraph('map-contraceptives-reasons', {
          aspectRatio: 0.5625,
          margin: {
            top: 0,
            bottom: 0
          },
          legend: false
        });
        reasonsMap.color = d3.scaleOrdinal(d3.schemeCategory20);
        reasonsMap.setColorDomain = function() {
          return reasonsMap.color.domain(reasons);
        };
        console.log(data_reasons);
        reasonsMap.setData(data_reasons, map);
        reasonsMap.onResize();
        legend.selectAll('.legend-item').style('display', 'inline-block').style('width', '10px').style('height', '10px').style('margin-right', '5px').style('background', function(d) {
          return reasonsMap.color(d);
        });
        return $(window).resize(function() {
          useMap.onResize();
          return reasonsMap.onResize();
        });
      };
      setupScrollama();
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/contraceptives-barriers-reasons.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(setupMaps);
    };
    if ($('#map-contraceptives-use').length > 0 || $('#map-contraceptives-reasons').length > 0) {
      setupConstraceptivesMaps();
    }
    if ($('#unmet-needs-gdp-graph').length > 0) {
      return setupUnmetNeedsGdpGraph();
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtdW5tZXQtbmVlZHMtZ3JhcGguY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFB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LENBQUMsR0FIWixFQUdrQixPQUFBLEdBQVEscUJBSDFCLENBSUUsQ0FBQyxLQUpILENBSVMsRUFBRSxDQUFDLElBSlosRUFJa0IsT0FBQSxHQUFRLDBCQUoxQixDQUtFLENBQUMsS0FMSCxDQUtTLFNBTFQ7SUF4SXlCO0lBbUozQixJQUFHLENBQUEsQ0FBRSx5QkFBRixDQUE0QixDQUFDLE1BQTdCLEdBQXNDLENBQXRDLElBQTJDLENBQUEsQ0FBRSw2QkFBRixDQUFnQyxDQUFDLE1BQWpDLEdBQTBDLENBQXhGO01BQ0Usd0JBQUEsQ0FBQSxFQURGOztJQUdBLElBQUcsQ0FBQSxDQUFFLHdCQUFGLENBQTJCLENBQUMsTUFBNUIsR0FBcUMsQ0FBeEM7YUFDRSx1QkFBQSxDQUFBLEVBREY7O0VBOVJELENBQUQsQ0FBQSxDQWlTRSxNQWpTRjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgQHN2Z1xuICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93Lk1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ01hcCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICBAZm9ybWF0RmxvYXQgICA9IGQzLmZvcm1hdCgnLC4xZicpXG4gICAgQGZvcm1hdEludGVnZXIgPSBkMy5mb3JtYXQoJyxkJylcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IGNvbG9yIHNjYWxlXG4gICAgQGNvbG9yID0gZDMuc2NhbGVTZXF1ZW50aWFsIGQzLmludGVycG9sYXRlT3Jhbmdlc1xuICAgIHJldHVybiBAXG5cbiAgbG9hZERhdGE6ICh1cmxfZGF0YSwgdXJsX21hcCkgLT5cbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCB1cmxfZGF0YVxuICAgICAgLmRlZmVyIGQzLmpzb24sIHVybF9tYXBcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGEsIG1hcCkgID0+XG4gICAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICAgIEBzZXREYXRhIGRhdGEsIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0RGF0YTogKGRhdGEsIG1hcCkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd0dyYXBoIG1hcFxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgLT4gZC52YWx1ZSldXG4gICAgY29uc29sZS5sb2cgQGNvbG9yLmRvbWFpbigpXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TGVnZW5kOiAtPlxuICAgIGxlZ2VuSXRlbVdpZHRoID0gMzBcbiAgICBsZWdlbmREYXRhID0gQGdldExlZ2VuZERhdGEoKVxuICAgIEBsZWdlbmQgPSBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbGVnZW5kJ1xuICAgICAgLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgIyBkcmF3IGxlZ2VuZCByZWN0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd3aWR0aCcsIGxlZ2VuSXRlbVdpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCA4XG4gICAgICAgIC5hdHRyICdmaWxsJywgKGQpID0+IEBjb2xvciBkXG4gICAgbGVnZW5kRGF0YS5zaGlmdCgpXG4gICAgIyBkcmF3IGxlZ2VuZCB0ZXh0c1xuICAgIEBsZWdlbmQuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgIC5kYXRhIGxlZ2VuZERhdGFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICd4JywgKGQsaSkgLT4gTWF0aC5yb3VuZCBsZWdlbkl0ZW1XaWR0aCooaSswLjUtKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAneScsIDIwXG4gICAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsICdzdGFydCdcbiAgICAgICAgLnRleHQgKGQpIC0+IGRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIG9uTW91c2VPdmVyOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWUubGVuZ3RoID4gMFxuICAgICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgICAjIFNldCB0b29sdGlwIGNvbnRlbnRcbiAgICAgIEBzZXRUb29sdGlwRGF0YSB2YWx1ZVswXVxuICAgICAgIyBTZXQgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgb2Zmc2V0ID0gJChkMy5ldmVudC50YXJnZXQpLm9mZnNldCgpXG4gICAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuICAgICAgICAnb3BhY2l0eSc6ICcxJ1xuXG4gIG9uTW91c2VNb3ZlOiAoZCkgPT5cbiAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICBAJHRvb2x0aXAuY3NzXG4gICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG5cbiAgb25Nb3VzZU91dDogKGQpID0+XG4gICAgQCR0b29sdGlwLmNzcyAnb3BhY2l0eScsICcwJ1xuXG4gIHNldFRvb2x0aXBEYXRhOiAoZCkgPT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudmFsdWUnXG4gICAgICAuaHRtbCBAZm9ybWF0RmxvYXQoZC52YWx1ZSlcbiAgICBpZiBkLmNhc2VzXG4gICAgICBAJHRvb2x0aXBcbiAgICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC5jYXNlcydcbiAgICAgICAgLmh0bWwgQGZvcm1hdEludGVnZXIoZC5jYXNlcykgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuTWFwR3JhcGhcblxuICBjdXJyZW50U3RhdGUgPSAwXG5cblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgIEAkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgZWxzZVxuICAgICAgICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cblxuICAjIyNcbiAgIyBvdmVycmlkZSBjb2xvciBzY2FsZVxuICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwgZDMuc2NoZW1lQ2F0ZWdvcnkyMFxuICAjIG92ZXJyaWRlIHNldENvdW50cnlDb2xvclxuICBAc2V0Q291bnRyeUNvbG9yID0gKGQpIC0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlWzBdXG4gICAgICAjY29uc29sZS5sb2cgQGNvbG9yXG4gICAgICBjb25zb2xlLmxvZyB2YWx1ZVswXS52YWx1ZXNbMF0uaWQsIHZhbHVlWzBdLnZhbHVlc1swXS5uYW1lLCBAY29sb3IodmFsdWVbMF0udmFsdWVzWzBdLmlkKVxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZXNbMF0uaWQpIGVsc2UgJyNlZWUnXG4gICNAZm9ybWF0RmxvYXQgPSBAZm9ybWF0SW50ZWdlclxuICAjQGdldExlZ2VuZERhdGEgPSAtPiBbMCwyLDQsNiw4XVxuICBAc2V0VG9vbHRpcERhdGEgPSAoZCkgLT5cbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAudGl0bGUnXG4gICAgICAuaHRtbCBkLm5hbWVcbiAgICBAJHRvb2x0aXBcbiAgICAgIC5maW5kICcuZGVzY3JpcHRpb24nXG4gICAgICAjLmh0bWwgZC52YWx1ZXNbMF0ubmFtZSsnICgnK2QudmFsdWVzWzBdLnZhbHVlKyclKSdcbiAgICAgIC5odG1sIGQudmFsdWUrJyUnXG4gICMjI1xuXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIGlmIHN0YXRlID09IDFcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydGZW1hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDJcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJVUQnXVxuICAgICAgZWxzZSBpZiBzdGF0ZSA9PSAzXG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpIC0+IGQudmFsdWUgPSArZFsnUGlsbCddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDRcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydNYWxlIGNvbmRvbSddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDVcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydJbmplY3RhYmxlJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNlxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4iLCJjbGFzcyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ1NjYXR0ZXJwbG90IEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgN1xuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgN1xuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxMlxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnhdID0gK2RbQG9wdGlvbnMua2V5LnhdXG4gICAgICBkW0BvcHRpb25zLmtleS55XSA9ICtkW0BvcHRpb25zLmtleS55XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgQHggPSBkMy5zY2FsZVBvdygpXG4gICAgICAuZXhwb25lbnQoMC4yNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCgpXG4gICAgICAgIC5yYW5nZSBAZ2V0Q29sb3JSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCgwLjUpXG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICByZXR1cm4gQFxuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdKV1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0Q29sb3JSYW5nZTogPT5cbiAgICByZXR1cm4gWycjQzlBRDRCJywgJyNCQkQ2NDYnLCAnIzYzQkEyRCcsICcjMzRBODkzJywgJyMzRDkxQUQnLCAnIzVCOEFDQicsICcjQkE3REFGJywgJyNCRjZCODAnLCAnI0Y0OUQ5RCcsICcjRTI1NDUzJywgJyNCNTY2MzEnLCAnI0UyNzczQicsICcjRkZBOTUxJywgJyNGNENBMDAnXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBkMy5leHRlbnQgQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5jb2xvcl1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBzdXBlcigpXG4gICAgIyBzZXQgY29sb3IgZG9tYWluXG4gICAgaWYgQGNvbG9yXG4gICAgICBAY29sb3IuZG9tYWluIEBnZXRDb2xvckRvbWFpbigpXG4gICAgIyBzZXQgc2l6ZSBkb21haW5cbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgcG9pbnRzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RJZFxuICAgICAgLmF0dHIgJ3InLCBAZ2V0RG90U2l6ZVxuICAgICAgLnN0eWxlICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RzRGltZW5zaW9uc1xuICAgICMgZHJhdyBsYWJlbHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdC1sYWJlbCdcbiAgICAgIC5hdHRyICdpZCcsIEBnZXREb3RMYWJlbElkXG4gICAgICAuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgLmF0dHIgJ2R5JywgJzAuMzc1ZW0nXG4gICAgICAudGV4dCBAZ2V0RG90TGFiZWxUZXh0XG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyBjYWxsIEJhc2VncmFwaC51cGRhdGVHcmFwaERpbWVuc2lvbnNcbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgZG90cyBwb3NpdGlvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RG90SWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90TGFiZWxJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbFRleHQ6IChkKSA9PlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RTaXplOiAoZCkgPT5cbiAgICBpZiBAc2l6ZVxuICAgICAgcmV0dXJuIEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcHRpb25zLmRvdFNpemVcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICBpZiBAY29sb3JcbiAgICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcblxuICBzZXREb3RzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMYWJlbHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICAjIG92ZXJyaWQgeCBheGlzIHBvc2l0aW9uaW5nXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKSdcblxuICBvblJlc2l6ZTogPT5cbiAgICBpZiBAJGVsIGFuZCBAY29udGFpbmVyV2lkdGggIT0gQCRlbC53aWR0aCgpXG4gICAgICBzdXBlcigpXG4gICAgcmV0dXJuIEBcblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpXG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgK2VsZW1lbnQuYXR0cignY3gnKSArIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgdG9wOiAgICAgK2VsZW1lbnQuYXR0cignY3knKSArIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSAxNVxuICAgICAgb3BhY2l0eTogMVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlLXgnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS54XVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS15J1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkueV1cblxuICAgICIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdFVubWV0TmVlZHNHcmFwaCBleHRlbmRzIHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnU2NhdHRlcnBsb3QgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIG9wdGlvbnMuZG90U2l6ZSA9IDdcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSAyXG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gMThcbiAgICAjQGxhbmcgPSBsYW5nXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgeCBzY2FsZVxuICAgIEB4ID0gZDMuc2NhbGVQb3coKVxuICAgICAgLmV4cG9uZW50KDAuMjUpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICAjIHNldCB5IHNjYWxlXG4gICAgQHkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoKVxuICAgICAgICAucmFuZ2UgQGdldENvbG9yUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQoMC41KVxuICAgICAgICAucmFuZ2UgQGdldFNpemVSYW5nZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBbMTAwMCwgMjAwMCwgNDAwMCwgODAwMCwgMTYwMDAsIDMyMDAwXVxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgICAgLnRpY2tWYWx1ZXMgWzAsIDEwLCAyMCwgMzAsIDQwXVxuICAgICAgLnRpY2tGb3JtYXQgKGQpIC0+IGQrJyUnXG4gICAgcmV0dXJuIEBcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFs2MDAsIDM1MDAwXVxuXG4gICNnZXREb3RMYWJlbFRleHQ6IChkKSA9PlxuICAjICByZXR1cm4gaWYgZC5wb3B1bGF0aW9uID4gMTAwMDAwMDAgdGhlbiBkW0BvcHRpb25zLmtleS5pZF0gZWxzZSAnJ1xuXG4gICNnZXREb3RGaWxsOiAoZCkgPT5cbiAgIyAgcmV0dXJuIGlmIGRbQG9wdGlvbnMua2V5LmNvbG9yXSA9PSAnMScgdGhlbiAnIzAwNzk3ZCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5jb2xvcl0gPT0gJzAnIHRoZW4gJyNENjRCMDUnIGVsc2UgJyNhYWEnICAgICAgIFxuXG4gICMjI1xuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IHBvaW50c1xuICAgIHN1cGVyKClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgQHNldEFubm90YXRpb25zKClcbiAgICBAc2V0WExlZ2VuZCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRYTGVnZW5kOiAtPlxuICAgIGluY29tZUdyb3VwcyA9IFtAeC5kb21haW4oKVswXSwgMTAyNiwgNDAzNiwgMTI0NzYsIEB4LmRvbWFpbigpWzFdXVxuICAgIEAkZWwuZmluZCgnLngtbGVnZW5kIGxpJykuZWFjaCAoaSwgZWwpID0+XG4gICAgICB2YWwgPSAxMDAgKiAoQHgoaW5jb21lR3JvdXBzW2krMV0pIC0gQHgoaW5jb21lR3JvdXBzW2ldKSkgLyBAd2lkdGhcbiAgICAgICQoZWwpLndpZHRoIHZhbCsnJSdcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG4gICAgcmV0dXJuIEBcbiAgIyMjXG5cbiAgICAiLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgdXNlTWFwID0gbnVsbFxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAga2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgICAjXCJSaHl0aG1cIlxuICAgICNcIldpdGhkcmF3YWxcIlxuICAgICNcIk90aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICBdXG5cblxuICAjIFNjcm9sbGFtYSBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwU2Nyb2xsYW1hID0gLT5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJylcbiAgICBncmFwaGljICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIGNoYXJ0ICAgICA9IGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICB0ZXh0ICAgICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLXRleHQnKVxuICAgIHN0ZXBzICAgICA9IHRleHQuc2VsZWN0QWxsKCcuc3RlcCcpXG5cbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuXG4gICAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgICBoYW5kbGVSZXNpemUgPSAtPlxuICAgICAgd2lkdGggPSBNYXRoLmZsb29yIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICBoZWlnaHQgPSBNYXRoLmZsb29yIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgIyAxLiB1cGRhdGUgaGVpZ2h0IG9mIHN0ZXAgZWxlbWVudHMgZm9yIGJyZWF0aGluZyByb29tIGJldHdlZW4gc3RlcHNcbiAgICAgIHN0ZXBzLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgICAjIDIuIHVwZGF0ZSBoZWlnaHQgb2YgZ3JhcGhpYyBlbGVtZW50XG4gICAgICBncmFwaGljLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgICAjIDMuIHVwZGF0ZSB3aWR0aCBvZiBjaGFydFxuICAgICAgY2hhcnRcbiAgICAgICAgLnN0eWxlICd3aWR0aCcsIHdpZHRoKydweCdcbiAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQrJ3B4J1xuICAgICAgIyA0LiB0ZWxsIHNjcm9sbGFtYSB0byB1cGRhdGUgbmV3IGVsZW1lbnQgZGltZW5zaW9uc1xuICAgICAgc2Nyb2xsZXIucmVzaXplKClcblxuICAgICMgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzXG4gICAgaGFuZGxlU3RlcEVudGVyID0gKGUpIC0+XG4gICAgICAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcbiAgICAgIGlmIHVzZU1hcFxuICAgICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgZS5pbmRleFxuXG4gICAgaGFuZGxlQ29udGFpbmVyRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgc3RpY2t5IHRoZSBncmFwaGljXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgICBoYW5kbGVDb250YWluZXJFeGl0ID0gKGUpIC0+XG4gICAgICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIGhhbmRsZVJlc2l6ZSgpXG5cbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnI2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAgICAgICAgICAgIyB0aGUgZ3JhcGhpY1xuICAgICAgICB0ZXh0OiAgICAgICAnLnNjcm9sbC10ZXh0JyAgICAgICAgICAgICAgICAgICMgdGhlIHN0ZXAgY29udGFpbmVyXG4gICAgICAgIHN0ZXA6ICAgICAgICcuc2Nyb2xsLXRleHQgLnN0ZXAnICAgICAgICAgICAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjggICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgc2V0IHRoZSB0cmlnZ2VyIHRvIGJlIDEvMiB3YXkgZG93biBzY3JlZW5cbiAgICAgICAgI2RlYnVnOiAgICAgIHRydWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uU3RlcEVudGVyICAgICAgaGFuZGxlU3RlcEVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgaGFuZGxlQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBoYW5kbGVDb250YWluZXJFeGl0IFxuXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgaGFuZGxlUmVzaXplXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gLT5cbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMtZ2RwLScrbGFuZysnLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNvbnNvbGUubG9nIGRhdGFcbiAgICAgICMgY2xlYXIgaXRlbXMgd2l0aG91dCB1bm1ldC1uZWVkcyB2YWx1ZXNcbiAgICAgIGRhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5nZHAgYW5kIGRbJ3VubWV0LW5lZWRzJ10gXG4gICAgICB1bm1ldE5lZWRzR2RwR3JhcGggPSBuZXcgd2luZG93LlNjYXR0ZXJwbG90VW5tZXROZWVkc0dyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgIG1hcmdpbjpcbiAgICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgICByaWd0aDogIDBcbiAgICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgICBib3R0b206IDBcbiAgICAgICAga2V5OlxuICAgICAgICAgIHg6ICdnZHAnXG4gICAgICAgICAgeTogJ3VubWV0LW5lZWRzJ1xuICAgICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgICBzaXplOiAncG9wdWxhdGlvbidcbiAgICAgICAgICBjb2xvcjogJ3JlZ2lvbidcbiAgICAgICMgc2V0IGRhdGFcbiAgICAgIHVubWV0TmVlZHNHZHBHcmFwaC5zZXREYXRhIGRhdGFcbiAgICAgICQod2luZG93KS5yZXNpemUgdW5tZXROZWVkc0dkcEdyYXBoLm9uUmVzaXplXG5cblxuICAjIFVzZSAmIFJlYXNvbnMgbWFwc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgPSAtPlxuXG4gICAgcGFyc2VEYXRhVXNlID0gKGQsIGNvdW50cmllcykgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAga2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZToga2V5XG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgIGQudmFsdWVzLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlLCBiLnZhbHVlKVxuICAgICAgI2NvbnNvbGUubG9nIGQudmFsdWVzXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgcGFyc2VEYXRhUmVhc29ucyA9IChkLCBjb3VudHJpZXMpIC0+XG4gICAgICBkZWxldGUgZFsnc3VydmV5LXllYXInXVxuICAgICAgZGVsZXRlIGRbJ1JlYXNvbiA2OiBXYW50cyBtb3JlIGNoaWxkcmVuJ11cbiAgICAgIGQuY29kZV9udW0gPSBkLmNvZGVcbiAgICAgICMgcHJlcGVuZCB6ZXJvcyB0byBjb2RlcyBsZXNzIHRoYW4gMTAwXG4gICAgICBpZiBkLmNvZGVfbnVtLmxlbmd0aCA8IDNcbiAgICAgICAgZC5jb2RlX251bSA9ICgnMDAnK2QuY29kZV9udW0pLnNsaWNlKC0zKVxuICAgICAgIyBwb3B1bGF0ZSB2YWx1ZXMgYXJyYXkgd2l0aCByZWFzb25zXG4gICAgICBkLnZhbHVlcyA9IFtdXG5cbiAgICAgIGVudHJpZXMgPSBkMy5lbnRyaWVzKGQpLmZpbHRlciAoZW50cnkpIC0+IGVudHJ5LmtleS5pbmRleE9mKCdSZWFzb24nKSAhPSAtMVxuICAgICAgZW50cmllcy5mb3JFYWNoIChlbnRyeSkgLT5cbiAgICAgICAgZGVsZXRlIGRbZW50cnkua2V5XVxuICAgICAgICBlbnRyeS5rZXkgPSBlbnRyeS5rZXkucmVwbGFjZSgvUmVhc29uIFxcZCs6IC9nLCAnJylcbiAgICAgICAgZW50cnkudmFsdWUgPSArZW50cnkudmFsdWVcbiAgICAgICAgZC52YWx1ZXMucHVzaCBlbnRyeVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICBkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGQudmFsdWUgPSBkLnZhbHVlc1swXS5rZXlcbiAgICAgICMgc2V0dXAgY291bnRyeSBuYW1lICYgaXNvLTMgY29kZVxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZV9udW0gPT0gZC5jb2RlX251bVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlID0gaXRlbVswXVsnY29kZSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG5cbiAgICBzZXR1cE1hcHMgPSAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT4gcGFyc2VEYXRhVXNlKGQsIGNvdW50cmllcylcblxuICAgICAgIyBwYXJzZSBkYXRhIHJlYXNvbnNcbiAgICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPiBwYXJzZURhdGFSZWFzb25zKGQsIGNvdW50cmllcylcblxuICAgICAgIyBHZXQgZGF0YSByZWFzb25zIGtleXNcbiAgICAgIHJlYXNvbnMgPSBkMy5uZXN0KClcbiAgICAgICAgLmtleSAoZCkgLT4gZC52YWx1ZVxuICAgICAgICAuZW50cmllcyBkYXRhX3JlYXNvbnNcbiAgICAgICAgLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlcy5sZW5ndGgsIGIudmFsdWVzLmxlbmd0aClcblxuICAgICAgY29uc29sZS5sb2cgcmVhc29uc1xuXG4gICAgICByZWFzb25zID0gcmVhc29ucy5tYXAgKGQpIC0+IGQua2V5XG4gICAgICAgXG4gICAgICAjIFNldCB1c2UgbWFwXG4gICAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICAgIG1hcmdpbjpcbiAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICBib3R0b206IDBcbiAgICAgICAgbGVnZW5kOiBmYWxzZVxuICAgICAgdXNlTWFwLnNldERhdGEgZGF0YV91c2UsIG1hcFxuICAgICAgdXNlTWFwLm9uUmVzaXplKClcblxuICAgICAgIyBTZXR1cCByZWFzb25zIG1hcCBsZWdlbmRcbiAgICAgIGxlZ2VuZCA9IGQzLnNlbGVjdCgnI21hcC1jb250cmFjZXB0aXZlcy1yZWFzb25zJykuYXBwZW5kKCd1bCcpXG4gICAgICAgIC5hdHRyICdpZCcsICdtYXAtY29udHJhY2VwdGl2ZXMtcmVhc29ucy1sZWdlbmQnXG4gICAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEgcmVhc29uc1xuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ2xpc3Qtc3R5bGUnLCAnbm9uZSdcbiAgICAgICAgICAuc3R5bGUgJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJ1xuICAgICAgICAgIC5zdHlsZSAnZm9udC1zaXplJywgJzEuMjVyZW0nXG4gICAgICAgICAgLnN0eWxlICdtYXJnaW4nLCAnMCAuNXJlbSdcblxuICAgICAgbGVnZW5kLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQtaXRlbSdcblxuICAgICAgbGVnZW5kLmFwcGVuZCgnc3BhbicpLmh0bWwgKGQpIC0+IGRcblxuICAgICAgIyBTZXQgcmVhc29ucyBtYXBcbiAgICAgIHJlYXNvbnNNYXAgPSBuZXcgd2luZG93Lk1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtcmVhc29ucycsXG4gICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgbWFyZ2luOlxuICAgICAgICAgIHRvcDogMFxuICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICBsZWdlbmQ6IGZhbHNlXG4gICAgICByZWFzb25zTWFwLmNvbG9yID0gZDMuc2NhbGVPcmRpbmFsIGQzLnNjaGVtZUNhdGVnb3J5MjBcbiAgICAgIHJlYXNvbnNNYXAuc2V0Q29sb3JEb21haW4gPSAtPlxuICAgICAgICByZWFzb25zTWFwLmNvbG9yLmRvbWFpbiByZWFzb25zXG4gICAgICBjb25zb2xlLmxvZyBkYXRhX3JlYXNvbnNcbiAgICAgIHJlYXNvbnNNYXAuc2V0RGF0YSBkYXRhX3JlYXNvbnMsIG1hcFxuICAgICAgcmVhc29uc01hcC5vblJlc2l6ZSgpXG5cbiAgICAgICMgU2V0IGxlZ2VuZCBjb2xvclxuICAgICAgbGVnZW5kLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAgICAgLnN0eWxlICdkaXNwbGF5JywgJ2lubGluZS1ibG9jaydcbiAgICAgICAgLnN0eWxlICd3aWR0aCcsICcxMHB4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsICcxMHB4J1xuICAgICAgICAuc3R5bGUgJ21hcmdpbi1yaWdodCcsICc1cHgnXG4gICAgICAgIC5zdHlsZSAnYmFja2dyb3VuZCcsIChkKSAtPiByZWFzb25zTWFwLmNvbG9yIGRcblxuICAgICAgIyBzZXR1cCByZXNpemVcbiAgICAgICQod2luZG93KS5yZXNpemUgLT5cbiAgICAgICAgdXNlTWFwLm9uUmVzaXplKClcbiAgICAgICAgcmVhc29uc01hcC5vblJlc2l6ZSgpXG4gIFxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSgpXG5cbiAgICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtYmFycmllcnMtcmVhc29ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgc2V0dXBNYXBzXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGggPiAwIG9yICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtcmVhc29ucycpLmxlbmd0aCA+IDBcbiAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMoKVxuXG4gIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGgoKVxuXG4pIGpRdWVyeVxuIl19
