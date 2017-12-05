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
      ScatterplotGraph.__super__.updateGraphDimensions.call(this);
      this.xAxis.tickSize(this.height);
      this.yAxis.tickSize(this.width);
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
  (function($) {
    var baseurl, keys, lang, setupConstraceptivesUseMap, setupScrollama, setupUnmetNeedsGdpGraph, useMap;
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
        return useMap.setMapState(e.index);
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
    setupConstraceptivesUseMap = function() {
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/countries.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, _data, countries, map) {
        var data;
        data = _data;
        data.forEach(function(d) {
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
        });
        useMap = new window.ContraceptivesUseMapGraph('map-contraceptives-use', {
          aspectRatio: 0.5625,
          margin: {
            top: 0,
            bottom: 0
          },
          legend: false
        });
        useMap.setData(data, map);
        useMap.onResize();
        return $(window).resize(useMap.onResize);
      });
    };
    setupUnmetNeedsGdpGraph = function() {
      return d3.csv(baseurl + '/data/unmet-needs-gdp-' + lang + '.csv', function(error, data) {
        var graph2;
        console.log(data);
        return graph2 = new window.ScatterplotGraph('map-contraceptives-use', {
          aspectRatio: 0.5625,
          margin: {
            top: 0,
            bottom: 0
          },
          legend: false
        });
      });
    };
    if ($('#map-contraceptives-use').length > 0) {
      setupConstraceptivesUseMap();
    }
    return setupScrollama();
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwic2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtNQUNaLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFD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QUEsR0FBYSxJQUFBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyx3QkFBakMsRUFDWDtVQUFBLFdBQUEsRUFBYSxNQUFiO1VBQ0EsTUFBQSxFQUNFO1lBQUEsR0FBQSxFQUFLLENBQUw7WUFDQSxNQUFBLEVBQVEsQ0FEUjtXQUZGO1VBSUEsTUFBQSxFQUFRLEtBSlI7U0FEVztRQU1iLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQixHQUFyQjtRQUNBLE1BQU0sQ0FBQyxRQUFQLENBQUE7ZUFDQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixNQUFNLENBQUMsUUFBeEI7TUE3Q0ssQ0FKVDtJQUQyQjtJQXdEN0IsdUJBQUEsR0FBMEIsU0FBQTthQUN4QixFQUFFLENBQUMsR0FBSCxDQUFPLE9BQUEsR0FBUSx3QkFBUixHQUFpQyxJQUFqQyxHQUFzQyxNQUE3QyxFQUFxRCxTQUFDLEtBQUQsRUFBUSxJQUFSO0FBQ25ELFlBQUE7UUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7ZUFDQSxNQUFBLEdBQWEsSUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0Isd0JBQXhCLEVBQ1g7VUFBQSxXQUFBLEVBQWEsTUFBYjtVQUNBLE1BQUEsRUFDRTtZQUFBLEdBQUEsRUFBSyxDQUFMO1lBQ0EsTUFBQSxFQUFRLENBRFI7V0FGRjtVQUlBLE1BQUEsRUFBUSxLQUpSO1NBRFc7TUFGc0MsQ0FBckQ7SUFEd0I7SUFhMUIsSUFBRyxDQUFBLENBQUUseUJBQUYsQ0FBNEIsQ0FBQyxNQUE3QixHQUFzQyxDQUF6QztNQUNFLDBCQUFBLENBQUEsRUFERjs7V0FHQSxjQUFBLENBQUE7RUFyTEQsQ0FBRCxDQUFBLENBMExFLE1BMUxGO0FBQUEiLCJmaWxlIjoiY29udHJhY2VwdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBAc3ZnXG4gICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCAoZCkgLT4gZFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICAjIGdldCBjb3VudHJpZXMgZGF0YVxuICAgIEBjb3VudHJpZXMgPSB0b3BvanNvbi5mZWF0dXJlKG1hcCwgbWFwLm9iamVjdHMuY291bnRyaWVzKTtcbiAgICBAY291bnRyaWVzLmZlYXR1cmVzID0gQGNvdW50cmllcy5mZWF0dXJlcy5maWx0ZXIgKGQpIC0+IGQuaWQgIT0gJzAxMCcgICMgcmVtb3ZlIGFudGFyY3RpY2FcbiAgICAjIHNldCBwcm9qZWN0aW9uXG4gICAgQHByb2plY3Rpb24gPSBkMy5nZW9LYXZyYXlza2l5NygpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICAjIHNldCBwYXRoXG4gICAgQHBhdGggPSBkMy5nZW9QYXRoKClcbiAgICAgIC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgIyBhZGQgY291bnRyaWVzIHBhdGhzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAuZGF0YShAY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgLT4gJ2NvdW50cnktJytkLmlkXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2NvdW50cnknXG4gICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdzdHJva2Utd2lkdGgnLCAxXG4gICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgICMgYWRkIG1vdXNlIGV2ZW50cyBsaXN0ZW5lcnMgaWYgdGhlcmUncyBhIHRvb2x0aXBcbiAgICBpZiBAJHRvb2x0aXBcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAgIC5vbiAnbW91c2VvdmVyJywgQG9uTW91c2VPdmVyXG4gICAgICAgIC5vbiAnbW91c2Vtb3ZlJywgQG9uTW91c2VNb3ZlXG4gICAgICAgIC5vbiAnbW91c2VvdXQnLCBAb25Nb3VzZU91dFxuICAgICMgdHJpZ2dlciBkcmF3LWNvbXBsZXRlIGV2ZW50XG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGg6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgICAuYXR0ciAnc3Ryb2tlJywgQHNldENvdW50cnlDb2xvclxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgQHByb2plY3Rpb25TZXRTaXplKClcbiAgICBAcGF0aC5wcm9qZWN0aW9uIEBwcm9qZWN0aW9uXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBsZWdlbmQuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG4gIHByb2plY3Rpb25TZXRTaXplOiAtPlxuICAgIEBwcm9qZWN0aW9uXG4gICAgICAuZml0U2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XSwgQGNvdW50cmllcyAgIyBmaXQgcHJvamVjdGlvbiBzaXplXG4gICAgICAuc2NhbGUgICAgQHByb2plY3Rpb24uc2NhbGUoKSAqIDEuMSAgICAgIyBBZGp1c3QgcHJvamVjdGlvbiBzaXplICYgdHJhbnNsYXRpb25cbiAgICAgIC50cmFuc2xhdGUgW0B3aWR0aCowLjQ4LCBAaGVpZ2h0KjAuNl1cblxuICBzZXRDb3VudHJ5Q29sb3I6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICByZXR1cm4gaWYgdmFsdWVbMF0gdGhlbiBAY29sb3IodmFsdWVbMF0udmFsdWUpIGVsc2UgJyNlZWUnXG5cbiAgc2V0TGVnZW5kUG9zaXRpb246IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK01hdGgucm91bmQoQHdpZHRoKjAuNSkrJywnKygtQG9wdGlvbnMubWFyZ2luLnRvcCkrJyknXG5cbiAgZ2V0TGVnZW5kRGF0YTogPT5cbiAgICByZXR1cm4gZDMucmFuZ2UgMCwgQGNvbG9yLmRvbWFpbigpWzFdXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZSA9IDBcblxuXG4gICMgb3ZlcnJpZGUgZ2V0RGltZW5zaW9uc1xuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIGJvZHlIZWlnaHQgPSAkKCdib2R5JykuaGVpZ2h0KClcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICBlbHNlXG4gICAgICAgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuXG4gICMjI1xuICAjIG92ZXJyaWRlIGNvbG9yIHNjYWxlXG4gIEBjb2xvciA9IGQzLnNjYWxlT3JkaW5hbCBkMy5zY2hlbWVDYXRlZ29yeTIwXG4gICMgb3ZlcnJpZGUgc2V0Q291bnRyeUNvbG9yXG4gIEBzZXRDb3VudHJ5Q29sb3IgPSAoZCkgLT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgaWYgdmFsdWVbMF1cbiAgICAgICNjb25zb2xlLmxvZyBAY29sb3JcbiAgICAgIGNvbnNvbGUubG9nIHZhbHVlWzBdLnZhbHVlc1swXS5pZCwgdmFsdWVbMF0udmFsdWVzWzBdLm5hbWUsIEBjb2xvcih2YWx1ZVswXS52YWx1ZXNbMF0uaWQpXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlc1swXS5pZCkgZWxzZSAnI2VlZSdcbiAgI0Bmb3JtYXRGbG9hdCA9IEBmb3JtYXRJbnRlZ2VyXG4gICNAZ2V0TGVnZW5kRGF0YSA9IC0+IFswLDIsNCw2LDhdXG4gIEBzZXRUb29sdGlwRGF0YSA9IChkKSAtPlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy5kZXNjcmlwdGlvbidcbiAgICAgICMuaHRtbCBkLnZhbHVlc1swXS5uYW1lKycgKCcrZC52YWx1ZXNbMF0udmFsdWUrJyUpJ1xuICAgICAgLmh0bWwgZC52YWx1ZSsnJSdcbiAgIyMjXG5cblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgaWYgc3RhdGUgPT0gMVxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0ZlbWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gMlxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0lVRCddXG4gICAgICBlbHNlIGlmIHN0YXRlID09IDNcbiAgICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgLT4gZC52YWx1ZSA9ICtkWydQaWxsJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNFxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ01hbGUgY29uZG9tJ11cbiAgICAgIGVsc2UgaWYgc3RhdGUgPT0gNVxuICAgICAgICBAZGF0YS5mb3JFYWNoIChkKSAtPiBkLnZhbHVlID0gK2RbJ0luamVjdGFibGUnXVxuICAgICAgZWxzZSBpZiBzdGF0ZSA9PSA2XG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpIC0+IGQudmFsdWUgPSArZFsnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCddXG4gICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiIsImNsYXNzIHdpbmRvdy5TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnU2NhdHRlcnBsb3QgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIG9wdGlvbnMuZG90U2l6ZSA9IG9wdGlvbnMuZG90U2l6ZSB8fCA3XG4gICAgb3B0aW9ucy5kb3RNaW5TaXplID0gb3B0aW9ucy5kb3RNaW5TaXplIHx8wqA3XG4gICAgb3B0aW9ucy5kb3RNYXhTaXplID0gb3B0aW9ucy5kb3RNYXhTaXplIHx8IDEyXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICAgIGRbQG9wdGlvbnMua2V5LnldID0gK2RbQG9wdGlvbnMua2V5LnldXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTVkc6IC0+XG4gICAgc3VwZXIoKVxuICAgIEAkdG9vbHRpcCA9IEAkZWwuZmluZCAnLnRvb2x0aXAnXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjI1KVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgY29sb3Igc2NhbGUgaWYgb3B0aW9ucy5rZXkuY29sb3IgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5jb2xvclxuICAgICAgQGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgICAgLnJhbmdlIEBnZXRDb2xvclJhbmdlKClcbiAgICAjIHNldCBzaXplIHNjYWxlIGlmIG9wdGlvbnMua2V5LnNpemUgaXMgZGVmaW5lZFxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICBAc2l6ZSA9IGQzLnNjYWxlUG93KClcbiAgICAgICAgLmV4cG9uZW50KDAuNSlcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0pXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRDb2xvclJhbmdlOiA9PlxuICAgIHJldHVybiBbJyNDOUFENEInLCAnI0JCRDY0NicsICcjNjNCQTJEJywgJyMzNEE4OTMnLCAnIzNEOTFBRCcsICcjNUI4QUNCJywgJyNCQTdEQUYnLCAnI0JGNkI4MCcsICcjRjQ5RDlEJywgJyNFMjU0NTMnLCAnI0I1NjYzMScsICcjRTI3NzNCJywgJyNGRkE5NTEnLCAnI0Y0Q0EwMCddXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIGQzLmV4dGVudCBAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LmNvbG9yXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIHN1cGVyKClcbiAgICAjIHNldCBjb2xvciBkb21haW5cbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCBzaXplIGRvbWFpblxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgICMgZHJhdyBwb2ludHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdElkXG4gICAgICAuYXR0ciAncicsIEBnZXREb3RTaXplXG4gICAgICAuc3R5bGUgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdHNEaW1lbnNpb25zXG4gICAgIyBkcmF3IGxhYmVsc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90LWxhYmVsJ1xuICAgICAgLmF0dHIgJ2lkJywgQGdldERvdExhYmVsSWRcbiAgICAgIC5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAuYXR0ciAnZHknLCAnMC4zNzVlbSdcbiAgICAgIC50ZXh0IEBnZXREb3RMYWJlbFRleHRcbiAgICAgIC5jYWxsIEBzZXREb3RMYWJlbHNEaW1lbnNpb25zXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgIyB1cGRhdGUgYXhpcyBzaXplXG4gICAgQHhBeGlzLnRpY2tTaXplIEBoZWlnaHRcbiAgICBAeUF4aXMudGlja1NpemUgQHdpZHRoXG4gICAgIyB1cGRhdGUgZG90cyBwb3NpdGlvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90c0RpbWVuc2lvbnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0RG90TGFiZWxzRGltZW5zaW9uc1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RG90SWQ6IChkKSA9PlxuICAgIHJldHVybiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgZ2V0RG90TGFiZWxJZDogKGQpID0+XG4gICAgcmV0dXJuICdkb3QtbGFiZWwtJytkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RMYWJlbFRleHQ6IChkKSA9PlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS5pZF1cblxuICBnZXREb3RTaXplOiAoZCkgPT5cbiAgICBpZiBAc2l6ZVxuICAgICAgcmV0dXJuIEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBvcHRpb25zLmRvdFNpemVcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICBpZiBAY29sb3JcbiAgICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG51bGxcblxuICBzZXREb3RzRGltZW5zaW9uczogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ2N4JywgKGQpID0+IEB4IGRbQG9wdGlvbnMua2V5LnhdXG4gICAgICAuYXR0ciAnY3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICBzZXREb3RMYWJlbHNEaW1lbnNpb25zOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBAeCBkW0BvcHRpb25zLmtleS54XVxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gQHkgZFtAb3B0aW9ucy5rZXkueV1cblxuICAjIG92ZXJyaWQgeCBheGlzIHBvc2l0aW9uaW5nXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKSdcblxuICAjIG1vdXNlIGV2ZW50c1xuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgZWxlbWVudCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpXG4gICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgQHNldFRvb2x0aXBEYXRhIGRcbiAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgbGVmdDogICAgK2VsZW1lbnQuYXR0cignY3gnKSArIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgdG9wOiAgICAgK2VsZW1lbnQuYXR0cignY3knKSArIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAJHRvb2x0aXAuaGVpZ2h0KCkgLSAxNVxuICAgICAgb3BhY2l0eTogMVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlLXgnXG4gICAgICAuaHRtbCBkW0BvcHRpb25zLmtleS54XVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZS15J1xuICAgICAgLmh0bWwgZFtAb3B0aW9ucy5rZXkueV1cblxuICAgICIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICB1c2VNYXAgPSBudWxsXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBrZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICAgICNcIlJoeXRobVwiXG4gICAgI1wiV2l0aGRyYXdhbFwiXG4gICAgI1wiT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gIF1cblxuXG4gICMgU2Nyb2xsYW1hIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBTY3JvbGxhbWEgPSAtPlxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInKVxuICAgIGdyYXBoaWMgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtZ3JhcGhpYycpXG4gICAgY2hhcnQgICAgID0gZ3JhcGhpYy5zZWxlY3QoJy5ncmFwaC1jb250YWluZXInKVxuICAgIHRleHQgICAgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtdGV4dCcpXG4gICAgc3RlcHMgICAgID0gdGV4dC5zZWxlY3RBbGwoJy5zdGVwJylcblxuICAgICMgaW5pdGlhbGl6ZSBzY3JvbGxhbWFcbiAgICBzY3JvbGxlciA9IHNjcm9sbGFtYSgpXG5cbiAgICAjIHJlc2l6ZSBmdW5jdGlvbiB0byBzZXQgZGltZW5zaW9ucyBvbiBsb2FkIGFuZCBvbiBwYWdlIHJlc2l6ZVxuICAgIGhhbmRsZVJlc2l6ZSA9IC0+XG4gICAgICB3aWR0aCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgICAgc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICAgIGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgICBjaGFydFxuICAgICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgICBzY3JvbGxlci5yZXNpemUoKVxuXG4gICAgIyBzY3JvbGxhbWEgZXZlbnQgaGFuZGxlcnNcbiAgICBoYW5kbGVTdGVwRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuICAgICAgdXNlTWFwLnNldE1hcFN0YXRlIGUuaW5kZXhcblxuICAgIGhhbmRsZUNvbnRhaW5lckVudGVyID0gKGUpIC0+XG4gICAgICAjIHN0aWNreSB0aGUgZ3JhcGhpY1xuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCB0cnVlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBmYWxzZVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRXhpdCA9IChlKSAtPlxuICAgICAgIyB1bi1zdGlja3kgdGhlIGdyYXBoaWMsIGFuZCBwaW4gdG8gdG9wL2JvdHRvbSBvZiBjb250YWluZXJcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgZmFsc2VcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyNjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJyAjIG91ciBvdXRlcm1vc3Qgc2Nyb2xseXRlbGxpbmcgZWxlbWVudFxuICAgICAgICBncmFwaGljOiAgICAnLnNjcm9sbC1ncmFwaGljJyAgICAgICAgICAgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgdGV4dDogICAgICAgJy5zY3JvbGwtdGV4dCcgICAgICAgICAgICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgICAgICAgICAgICMgdGhlIHN0ZXAgZWxlbWVudHNcbiAgICAgICAgb2Zmc2V0OiAgICAgMC44ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgICNkZWJ1ZzogICAgICB0cnVlICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZGlzcGxheSB0aGUgdHJpZ2dlciBvZmZzZXQgZm9yIHRlc3RpbmdcbiAgICAgIC5vblN0ZXBFbnRlciAgICAgIGhhbmRsZVN0ZXBFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckVudGVyIGhhbmRsZUNvbnRhaW5lckVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRXhpdCAgaGFuZGxlQ29udGFpbmVyRXhpdCBcblxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBNYXAgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZU1hcCA9IC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgX2RhdGEsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICAjY29uc29sZS50YWJsZSBkYXRhXG4gICAgICAgICNjb25zb2xlLnRhYmxlIGNvdW50cmllc1xuICAgICAgICAjIGFkZCBjYXNlcyB0byBlYWNoIGNvdW50cnlcbiAgICAgICAgZGF0YSA9IF9kYXRhXG4gICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgICAgICMjI1xuICAgICAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgICAgICBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10gPSArZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgICAgICBkZWxldGUgZFsnUmh5dGhtJ11cbiAgICAgICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgICAgICMjI1xuICAgICAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICAgICAgI2QudmFsdWUgPSArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICAgICBkLnZhbHVlID0gMFxuICAgICAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgICAgIGtleXMuZm9yRWFjaCAoa2V5LGkpIC0+XG4gICAgICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgICAgIG5hbWU6IGtleVxuICAgICAgICAgICAgICB2YWx1ZTogaWYgZFtrZXldICE9ICcnIHRoZW4gK2Rba2V5XSBlbHNlIG51bGxcbiAgICAgICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAgICAgZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAgICAgI2NvbnNvbGUubG9nIGQudmFsdWVzXG4gICAgICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuICAgICAgICAjIHNldCBncmFwaFxuICAgICAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgICBtYXJnaW46XG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICAgIGxlZ2VuZDogZmFsc2VcbiAgICAgICAgdXNlTWFwLnNldERhdGEgZGF0YSwgbWFwXG4gICAgICAgIHVzZU1hcC5vblJlc2l6ZSgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgdXNlTWFwLm9uUmVzaXplXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gLT5cbiAgICBkMy5jc3YgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMtZ2RwLScrbGFuZysnLmNzdicsIChlcnJvciwgZGF0YSkgLT5cbiAgICAgIGNvbnNvbGUubG9nIGRhdGFcbiAgICAgIGdyYXBoMiA9IG5ldyB3aW5kb3cuU2NhdHRlcnBsb3RHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgICAgbWFyZ2luOlxuICAgICAgICAgIHRvcDogMFxuICAgICAgICAgIGJvdHRvbTogMFxuICAgICAgICBsZWdlbmQ6IGZhbHNlXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoID4gMFxuICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlTWFwKClcblxuICBzZXR1cFNjcm9sbGFtYSgpXG5cbiAgI2lmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICMgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoKClcblxuKSBqUXVlcnlcbiJdfQ==
