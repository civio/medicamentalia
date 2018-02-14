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

  window.BarHorizontalStackedGraph = (function(superClass) {
    extend(BarHorizontalStackedGraph, superClass);

    function BarHorizontalStackedGraph(id, options) {
      this.setBars = bind(this.setBars, this);
      BarHorizontalStackedGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BarHorizontalStackedGraph.prototype.setSVG = function() {
      return this.container = d3.select('#' + this.id).attr('class', 'bar-horizontal-graph bar-horizontal-stacked-graph');
    };

    BarHorizontalStackedGraph.prototype.dataParser = function(data) {
      return data;
    };

    BarHorizontalStackedGraph.prototype.drawScales = function() {
      if (this.options.xAxis) {
        this.container.selectAll('.axis').data(this.options.xAxis).enter().append('div').attr('class', 'axis').style('left', function(d) {
          return d + '%';
        });
      }
      return this;
    };

    BarHorizontalStackedGraph.prototype.drawGraph = function() {
      this.container.selectAll('.bar').data(this.data).enter().append('div').attr('class', 'bar-container').call(this.setBars);
      return this;
    };

    BarHorizontalStackedGraph.prototype.setBars = function(element) {
      element.append('div').attr('class', 'bar-title').html(function(d) {
        return d.name;
      });
      element.selectAll('bar').data(function(d) {
        return d.values;
      }).enter().append('div').attr('class', function(d) {
        return 'bar bar-' + d.name.replace(/ |\//g, '-');
      }).style('width', function(d) {
        return d.value + '%';
      });
      return element.append('span').html((function(_this) {
        return function(d) {
          return Math.round(d.total) + '%';
        };
      })(this));
    };

    return BarHorizontalStackedGraph;

  })(window.BarHorizontalGraph);

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
      this.getLegendFormat = bind(this.getLegendFormat, this);
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
      }).attr('y', 20).attr('text-anchor', 'start').text(this.getLegendFormat);
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

    MapGraph.prototype.getLegendFormat = function(d) {
      return d;
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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ContraceptivesUseMapGraph = (function(superClass) {
    extend(ContraceptivesUseMapGraph, superClass);

    function ContraceptivesUseMapGraph() {
      this.onResize = bind(this.onResize, this);
      this.getLegendFormat = bind(this.getLegendFormat, this);
      return ContraceptivesUseMapGraph.__super__.constructor.apply(this, arguments);
    }

    ContraceptivesUseMapGraph.prototype.currentState = 0;

    ContraceptivesUseMapGraph.prototype.states = [
      {
        id: 'Female sterilization',
        text: {
          es: 'esterilización femenina',
          en: 'female sterilization'
        },
        labels: [
          {
            cx_factor: 0.7,
            cy_factor: 0.48,
            r: 0,
            textOffset: [-20, 30],
            label: {
              es: 'India',
              en: 'India'
            }
          }, {
            cx_factor: 0.27,
            cy_factor: 0.465,
            r: 0,
            textOffset: [20, -5],
            label: {
              es: 'República Dominicana',
              en: 'Dominican Republic'
            }
          }
        ]
      }, {
        id: 'Male sterilization',
        text: {
          es: 'esterilización masculina',
          en: 'male sterilization'
        },
        labels: [
          {
            cx_factor: 0.463,
            cy_factor: 0.263,
            r: 0,
            textOffset: [-20, 10],
            label: {
              es: 'Reino Unido',
              en: 'United Kingdom'
            }
          }
        ]
      }, {
        id: 'IUD',
        text: {
          es: 'DIU',
          en: 'IUD'
        },
        labels: [
          {
            cx_factor: 0.85,
            cy_factor: 0.34,
            r: 0,
            textWidth: 80,
            textOffset: [12, 0],
            label: {
              es: 'Corea del Norte',
              en: 'North Korea'
            }
          }
        ]
      }, {
        id: 'IUD',
        text: {
          es: 'DIU',
          en: 'IUD'
        },
        labels: [
          {
            cx_factor: 0.84,
            cy_factor: 0.41,
            r: 0,
            textWidth: 80,
            textOffset: [12, 0],
            label: {
              es: 'China',
              en: 'China'
            }
          }
        ]
      }, {
        id: 'Pill',
        text: {
          es: 'píldora',
          en: 'pill'
        },
        labels: [
          {
            cx_factor: 0.464,
            cy_factor: 0.416,
            r: 0,
            textOffset: [-35, 0],
            label: {
              es: 'Argelia',
              en: 'Algeria'
            }
          }
        ]
      }, {
        id: 'Male condom',
        text: {
          es: 'preservativo masculino',
          en: 'male condom'
        },
        labels: [
          {
            cx_factor: 0.265,
            cy_factor: 0.297,
            r: 0,
            textOffset: [30, 25],
            label: {
              es: 'Canadá',
              en: 'Canada'
            }
          }, {
            cx_factor: 0.564,
            cy_factor: 0.73,
            r: 0,
            textOffset: [15, -10],
            label: {
              es: 'Botsuana',
              en: 'Botswana'
            }
          }
        ]
      }, {
        id: 'Injectable',
        text: {
          es: 'inyectable',
          en: 'injectable'
        },
        labels: [
          {
            cx_factor: 0.62,
            cy_factor: 0.56,
            r: 0,
            textOffset: [15, 5],
            label: {
              es: 'Etiopía',
              en: 'Ethiopia'
            }
          }
        ]
      }, {
        id: 'Any traditional method',
        text: {
          es: 'métodos tradicionales',
          en: 'traditional methods'
        },
        labels: [
          {
            cx_factor: 0.536,
            cy_factor: 0.318,
            r: 16,
            textOffset: [-26, 0],
            label: {
              es: 'Balcanes',
              en: 'Balkans'
            }
          }
        ]
      }, {
        id: 'Any traditional method',
        text: {
          es: 'métodos tradicionales',
          en: 'traditional methods'
        },
        labels: [
          {
            cx_factor: 0.534,
            cy_factor: 0.332,
            r: 0,
            textOffset: [-10, 0],
            label: {
              es: 'Albania',
              en: 'Albania'
            }
          }
        ]
      }
    ];

    ContraceptivesUseMapGraph.prototype.getLegendData = function() {
      return [0, 20, 40, 60, 80];
    };

    ContraceptivesUseMapGraph.prototype.getLegendFormat = function(d) {
      return d + '%';
    };

    ContraceptivesUseMapGraph.prototype.getDimensions = function() {
      var bodyHeight, offset;
      offset = 100;
      if (this.$el) {
        bodyHeight = $('body').height() - offset;
        this.containerWidth = this.$el.width();
        this.containerHeight = this.containerWidth * this.options.aspectRatio;
        if (this.containerHeight > bodyHeight) {
          this.containerHeight = bodyHeight;
          this.containerWidth = this.containerHeight / this.options.aspectRatio;
        }
        this.width = this.containerWidth - this.options.margin.left - this.options.margin.right;
        this.height = this.containerHeight - this.options.margin.top - this.options.margin.bottom;
      }
      return this;
    };

    ContraceptivesUseMapGraph.prototype.onResize = function() {
      ContraceptivesUseMapGraph.__super__.onResize.call(this);
      return this.setAnnotations();
    };

    ContraceptivesUseMapGraph.prototype.setColorDomain = function() {
      this.color.domain([0, 80]);
      return this;
    };

    ContraceptivesUseMapGraph.prototype.drawGraph = function(map) {
      ContraceptivesUseMapGraph.__super__.drawGraph.call(this, map);
      this.ringNote = d3.ringNote();
      return this;
    };

    ContraceptivesUseMapGraph.prototype.setMapState = function(state) {
      if (state !== this.currentState) {
        this.currentState = state;
        this.currentMethod = this.states[this.currentState - 1];
        $('#map-contraceptives-use-method').html(this.currentMethod.text[this.options.lang]);
        this.data.forEach((function(_this) {
          return function(d) {
            return d.value = +d[_this.currentMethod.id];
          };
        })(this));
        this.updateGraph(this.data);
        return this.setAnnotations();
      }
    };

    ContraceptivesUseMapGraph.prototype.setAnnotations = function() {
      if (this.currentMethod) {
        this.currentMethod.labels.forEach((function(_this) {
          return function(d) {
            d.cx = d.cx_factor * _this.width;
            d.cy = d.cy_factor * _this.height;
            return d.text = d.label[_this.options.lang];
          };
        })(this));
        return this.container.call(this.ringNote, this.currentMethod.labels);
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
            name: '<strong>' + method.name.charAt(0).toUpperCase() + method.name.slice(1) + '</strong><br/>' + Math.round(method.value) + '%',
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
      } else {
        console.warn('No data country for ' + country_code);
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

    BeeswarmScatterplotGraph.prototype.incomeLevels = [1005, 3955, 12235];

    BeeswarmScatterplotGraph.prototype.labels = ['AGO', 'BGD', 'BEL', 'BRA', 'DEU', 'ESP', 'ETH', 'FIN', 'IND', 'IDN', 'JPN', 'NGA', 'PAK', 'PHL', 'RUS', 'SAU', 'TUR', 'UGA', 'USA', 'VNM'];

    function BeeswarmScatterplotGraph(id, options) {
      this.getColorDomain = bind(this.getColorDomain, this);
      this.getSizeDomain = bind(this.getSizeDomain, this);
      this.getSizeRange = bind(this.getSizeRange, this);
      this.getScaleYDomain = bind(this.getScaleYDomain, this);
      this.getScaleXDomain = bind(this.getScaleXDomain, this);
      this.setXAxisPosition = bind(this.setXAxisPosition, this);
      this.getDotFill = bind(this.getDotFill, this);
      this.getPositionY = bind(this.getPositionY, this);
      this.getPositionX = bind(this.getPositionX, this);
      this.setDotLabelPosition = bind(this.setDotLabelPosition, this);
      this.setDotPosition = bind(this.setDotPosition, this);
      this.setDot = bind(this.setDot, this);
      options.dotSize = options.dotSize || 5;
      options.dotMinSize = options.dotMinSize || 2;
      options.dotMaxSize = options.dotMaxSize || 15;
      options.mode = options.mode || 0;
      BeeswarmScatterplotGraph.__super__.constructor.call(this, id, options);
      return this;
    }

    BeeswarmScatterplotGraph.prototype.dataParser = function(data) {
      if (this.options.key.size) {
        return data.sort((function(_this) {
          return function(a, b) {
            return b[_this.options.key.size] - a[_this.options.key.size];
          };
        })(this));
      } else {
        return data;
      }
    };

    BeeswarmScatterplotGraph.prototype.drawGraph = function() {
      this.setSize();
      this.setSimulation();
      this.runSimulation();
      this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).call(this.setDot);
      if (this.options.key.label) {
        return this.container.selectAll('.dot-label').data(this.data.filter((function(_this) {
          return function(d) {
            return _this.labels.indexOf(d[_this.options.key.id]) !== -1;
          };
        })(this))).enter().append('text').attr('class', (function(_this) {
          return function(d) {
            if (d[_this.options.key.size] > 1000000000) {
              return 'dot-label size-l';
            } else if (d[_this.options.key.size] > 180000000) {
              return 'dot-label size-m';
            } else {
              return 'dot-label';
            }
          };
        })(this)).attr('dy', '0.25em').text((function(_this) {
          return function(d) {
            return d[_this.options.key.label];
          };
        })(this)).call(this.setDotLabelPosition);
      }
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

    BeeswarmScatterplotGraph.prototype.setDot = function(selection) {
      return selection.attr('r', (function(_this) {
        return function(d) {
          if (_this.size) {
            return d.radius;
          } else {
            return _this.options.dotSize;
          }
        };
      })(this)).attr('fill', this.getDotFill).call(this.setDotPosition);
    };

    BeeswarmScatterplotGraph.prototype.setDotPosition = function(selection) {
      return selection.attr('cx', this.getPositionX).attr('cy', this.getPositionY);
    };

    BeeswarmScatterplotGraph.prototype.setDotLabelPosition = function(selection) {
      return selection.attr('x', this.getPositionX).attr('y', this.getPositionY);
    };

    BeeswarmScatterplotGraph.prototype.getPositionX = function(d) {
      if (this.options.mode === 0) {
        return d.x;
      } else {
        return Math.round(this.x(d[this.options.key.x]));
      }
    };

    BeeswarmScatterplotGraph.prototype.getPositionY = function(d) {
      if (this.options.mode === 0) {
        return d.y;
      } else {
        return Math.round(this.y(d[this.options.key.y]));
      }
    };

    BeeswarmScatterplotGraph.prototype.getDotFill = function(d) {
      return this.color(d[this.options.key.color]);
    };

    BeeswarmScatterplotGraph.prototype.setMode = function(mode) {
      this.options.mode = mode;
      if (this.options.mode < 2) {
        this.container.selectAll('.dot, .dot-label').classed('inactive', false);
        this.container.selectAll('.dot').call(this.setDotPosition);
        if (this.xLegend) {
          this.xLegend.style('opacity', this.options.mode);
        }
        if (this.options.key.label) {
          this.container.selectAll('.dot-label').style('opacity', 0).call(this.setDotLabelPosition).transition().delay(500).style('opacity', 1);
        }
        return this.container.selectAll('.x.axis .tick line').style('opacity', this.options.mode);
      } else if (this.options.mode === 2) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d[_this.options.key.x] < _this.incomeLevels[2] || d[_this.options.key.y] > 15;
          };
        })(this));
      } else if (this.options.mode === 3) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d[_this.options.key.x] > _this.incomeLevels[1] || d[_this.options.key.y] < 30;
          };
        })(this));
      } else if (this.options.mode === 4) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', (function(_this) {
          return function(d) {
            return d.id !== 'SAU' && d.id !== 'JPN';
          };
        })(this));
      } else if (this.options.mode === 5) {
        return this.container.selectAll('.dot, .dot-label').classed('inactive', false);
      }
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
      if (this.options.key.label) {
        this.container.selectAll('.dot-label').call(this.setDotLabelPosition);
      }
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setScales = function() {
      this.x = d3.scaleLog().range(this.getScaleXRange());
      this.y = d3.scaleLinear().range(this.getScaleYRange());
      if (this.options.key.size) {
        this.size = d3.scalePow().exponent(0.5).range(this.getSizeRange());
      }
      if (this.options.key.color) {
        this.color = d3.scaleThreshold().range(d3.schemeOranges[5]);
      }
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues(this.incomeLevels);
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([0, 10, 20, 30, 40]).tickFormat(function(d) {
        return d + '%';
      });
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(-1,5)');
    };

    BeeswarmScatterplotGraph.prototype.getScaleXDomain = function() {
      return [250, 85000];
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
      return [0, 10, 20, 30];
    };

    BeeswarmScatterplotGraph.prototype.drawScales = function() {
      var incomes, incomesMax;
      this.x.domain(this.getScaleXDomain());
      this.y.domain(this.getScaleYDomain());
      if (this.size) {
        this.size.domain(this.getSizeDomain());
      }
      if (this.color) {
        this.color.domain(this.getColorDomain());
      }
      if (this.xAxis) {
        this.container.append('g').attr('class', 'x axis').call(this.setXAxisPosition).call(this.xAxis);
        this.container.selectAll('.x.axis .tick line').attr('y1', this.y(40) - 4);
      }
      if (this.yAxis) {
        this.container.append('g').attr('class', 'y axis').call(this.setYAxisPosition).call(this.yAxis);
        this.container.selectAll('.y.axis .tick text').attr('dx', 3).attr('dy', -4);
      }
      incomes = this.xAxis.tickValues();
      incomes.unshift(0);
      incomesMax = this.x(this.getScaleXDomain()[1]);
      incomes = incomes.map((function(_this) {
        return function(d) {
          if (d > 0) {
            return 100 * _this.x(d) / incomesMax;
          } else {
            return 0;
          }
        };
      })(this));
      incomes.push(100);
      this.xLegend = d3.select(d3.select('#' + this.id).node().parentNode).select('.x-legend');
      this.xLegend.selectAll('li').style('width', function(d, i) {
        return (incomes[i + 1] - incomes[i]) + '%';
      });
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
    var baseurl, lang, methods_keys, methods_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupContraceptivesApp, setupContraceptivesReasons, setupScrollama, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
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
      'es': ["esterilización femenina", "esterilización masculina", "DIU", "implante", "inyectable", "píldora", "condón masculino", "condón femenino", "métodos de barrera vaginal", "método de la amenorrea de la lactancia (MELA)", "anticonceptivos de emergencia", "otros métodos modernos", "métodos tradicionales"],
      'en': ["female sterilization", "male sterilization", "IUD", "implant", "injectable", "pill", "male condom", "female condom", "vaginal barrier methods", "lactational amenorrhea method (LAM)", "emergency contraception", "other modern methods", "traditional methods"]
    };

    /*
    methods_icons = 
      "Female sterilization": 'sterilization'
      "Male sterilization": 'sterilization'
      "IUD": 'diu'
      "Implant": null
      "Injectable": 'injectable'
      "Pill": 'pill'
      "Male condom": 'condom'
      "Female condom": null
      "Vaginal barrier methods": null
      "Lactational amenorrhea method (LAM)": null
      "Emergency contraception": null
      "Other modern methods": null
      "Any traditional method": 'traditional'
     */
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
          if (useTreemap) {
            if (step === 1) {
              return useTreemap.updateData('world', 'Mundo');
            } else if (step === 0 && e.direction === 'up') {
              return useTreemap.updateData(userCountry.code, userCountry.name);
            }
          }
        } else if (instance === 1) {
          if (useMap) {
            return useMap.setMapState(step);
          }
        } else if (instance === 2) {
          if (useGraph && step > 0) {
            data = [63, 88, 100];
            from = step > 1 ? data[step - 2] : 0;
            to = data[step - 1];
            return useGraph.selectAll('li').filter(function(d) {
              return d >= from && d < to;
            }).classed('fill-' + step, e.direction === 'down');
          }
        } else if (instance === 3) {
          if (unmetneedsGraph) {
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
      dataIndex = (function() {
        results = [];
        for (j = 0; j <= 99; j++){ results.push(j); }
        return results;
      }).apply(this);
      useGraph = d3.select('#contraceptives-use-graph');
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
    setupUnmetNeedsGdpGraph = function(data_unmetneeds, countries) {
      var data;
      setupScrollama('unmet-needs-gdp-container-graph');
      data = [];
      data_unmetneeds.forEach(function(d) {
        var country;
        country = countries.filter(function(e) {
          return e.code === d.code;
        });
        if (country[0] && country[0]['gni']) {
          return data.push({
            value: +d['2017'],
            id: country[0].code,
            name: country[0]['name_' + lang],
            population: +country[0]['population'],
            gni: +country[0]['gni']
          });
        } else {
          return console.log('No GNI or Population data for this country', d.code, country[0]);
        }
      });
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
          id: 'id',
          label: 'name',
          color: 'value',
          size: 'population'
        },
        dotMinSize: 1,
        dotMaxSize: 32
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
          top: 20,
          bottom: 0
        },
        legend: true,
        lang: lang
      });
      useMap.setData(data_use, map);
      useMap.onResize();
      return $(window).resize(useMap.onResize);
    };
    setupContraceptivesReasons = function(data_reasons, countries) {
      var reasonHealth, reasonOpposed, reasonOpposedHusband;
      reasonHealth = [];
      reasonOpposed = [];
      reasonOpposedHusband = [];

      /*
      reasonNotSex = []
      reasonOpposed = []
      reasonOpposedRespondent = []
      reasonOpposedReligious = []
       */
      data_reasons.forEach(function(d) {
        if (d.name) {
          reasonHealth.push({
            name: d.name,
            value: d.o + d.p + d.t
          });
          reasonOpposedHusband.push({
            name: d.name,
            value: d.j
          });

          /*
          reasonNotSex.push
            name: d.name
            value: d.b # not having sex
          reasonOpposedRespondent.push
            name: d.name
            value: d.i # respondent opposed
          reasonOpposedReligious.push
            name: d.name
            value: d.l # religious prohibition
           */
          return reasonOpposed.push({
            name: d.name,
            total: d.i + d.j + d.k + d.l,
            values: [
              {
                name: reasons_names.i,
                value: d.i
              }, {
                name: reasons_names.j,
                value: d.j
              }, {
                name: reasons_names.l,
                value: d.l
              }, {
                name: reasons_names.k,
                value: d.k
              }
            ]
          });
        }
      });
      reasonHealth.sort(function(a, b) {
        return b.value - a.value;
      });
      reasonOpposedHusband.sort(function(a, b) {
        return b.value - a.value;
      });
      reasonOpposed.sort(function(a, b) {
        return b.total - a.total;
      });
      console.log(reasonOpposed);

      /*
      reasonNotSex.sort sortArray
      reasonOpposed.sort sortArray
      reasonOpposedRespondent.sort sortArray
      reasonOpposedHusband.sort sortArray
      reasonOpposedReligious.sort sortArray
       */
      new window.BarHorizontalGraph('contraceptives-reasons-health', {
        key: {
          id: 'name',
          x: 'value'
        }
      }).setData(reasonHealth.slice(0, 5));
      new window.BarHorizontalStackedGraph('contraceptives-reasons-opposed', {}).setData(reasonOpposed.slice(0, 10));

      /*
      new window.BarHorizontalGraph('contraceptives-reasons-not-sex',
        key:
          id: 'name'
          x: 'value').setData reasonNotSex.slice(0,5)
      new window.BarHorizontalGraph('contraceptives-reasons-opposed-respondent',
        key:
          id: 'name'
          x: 'value'
        xAxis: [50, 100]).setData reasonOpposedRespondent.slice(0,5)
      
      new window.BarHorizontalGraph('contraceptives-reasons-opposed-religious',
        key:
          id: 'name'
          x: 'value'
        xAxis: [50, 100]).setData reasonOpposedReligious.slice(0,5)
       */
      return new window.BarHorizontalGraph('contraceptives-reasons-opposed-husband', {
        key: {
          id: 'name',
          x: 'value'
        },
        xAxis: [50, 100]
      }).setData(reasonOpposedHusband.slice(0, 5));
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

    /*
    setupMaternalMortality = ->
      dataIndex = [0..4999]
      mortalityGraph = d3.select('#maternal-mortality-developed')
      mortalityGraph.append('ul')
        .selectAll('li')
          .data(dataIndex)
        .enter().append('li')
          .append('svg')
            .append('use')
              .attr('xlink:href', '#icon-woman')
              .attr('viewBox', '0 0 193 450')
       * Resize handler
      resizeHandler = ->
        if graphWidth != mortalityGraph.node().offsetWidth
          graphWidth = mortalityGraph.node().offsetWidth
          itemsWidth = (graphWidth / 100) - 2
          itemsHeight = 2.33*itemsWidth
          #itemsWidth = if graphWidth < 480 then '10%' else '5%'
          #itemsHeight = if graphWidth < 480 then graphWidth * 0.1 / 0.75 else graphWidth * 0.05 / 0.75
          mortalityGraph.selectAll('li')
            .style 'width', itemsWidth+'px'
            .style 'height', itemsHeight+'px'
          mortalityGraph.selectAll('svg')
            .attr 'width', itemsWidth
            .attr 'height', itemsHeight
        #mortalityGraph.style 'margin-top', (($('body').height()-mortalityGraph.node().offsetHeight)*.5)+'px'
      window.addEventListener 'resize', resizeHandler
      resizeHandler()
     */
    return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').defer(d3.json, 'https://freegeoip.net/json/').await(function(error, data_use, data_unmetneeds, data_reasons, countries, map, location) {
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
      if ($('#contraceptives-use-graph').length > 0) {
        setupConstraceptivesUseGraph();
      }
      if ($('#unmet-needs-gdp-graph').length) {
        setupUnmetNeedsGdpGraph(data_unmetneeds, countries);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtc3RhY2tlZC1ncmFwaC5jb2ZmZWUiLCJtYXAtZ3JhcGguY29mZmVlIiwiY29udHJhY2VwdGl2ZXMtdXNlLW1hcC1ncmFwaC5jb2ZmZWUiLCJ0cmVlbWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS10cmVlbWFwLWdyYXBoLmNvZmZlZSIsImJlZXN3YXJtLXNjYXR0ZXJwbG90LWdyYXBoLmNvZmZlZSIsIm1haW4tY29udHJhY2VwdGl2ZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxH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QUFvQyxDQUFDLE1BQXhDO1FBQ0UsMEJBQUEsQ0FBMkIsWUFBM0IsRUFBeUMsU0FBekMsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2VBQ0Usc0JBQUEsQ0FBdUIsUUFBdkIsRUFBaUMsZUFBakMsRUFBa0QsWUFBbEQsRUFERjs7SUFqREssQ0FQVDtFQXZoQkQsQ0FBRCxDQUFBLENBcWxCRSxNQXJsQkY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICAjY29uc29sZS5sb2cgJ0JhciBIb3Jpem9udGFsIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBvcHRpb25zLnhBeGlzID0gb3B0aW9ucy54QXhpcyB8fCBbMjUsIDUwLCA3NSwgMTAwXVxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBzdmcgJiB1c2UgaHRtbCBkaXYgaW5zdGVhZFxuICBzZXRTVkc6IC0+XG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci1ob3Jpem9udGFsLWdyYXBoJ1xuXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGRhdGEuZm9yRWFjaCAoZCkgPT4gXG4gICAgICBkW0BvcHRpb25zLmtleS54XSA9ICtkW0BvcHRpb25zLmtleS54XVxuICAgIHJldHVybiBkYXRhXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICBpZiBAb3B0aW9ucy54QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5heGlzJylcbiAgICAgICAgLmRhdGEoQG9wdGlvbnMueEF4aXMpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdheGlzJ1xuICAgICAgICAuc3R5bGUgJ2xlZnQnLCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogLT5cbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXItY29udGFpbmVyJ1xuICAgICAgLmNhbGwgQHNldEJhcnNcbiAgICByZXR1cm4gQFxuXG4gIFxuICBzZXRCYXJzOiAoZWxlbWVudCkgPT5cbiAgICBpZiBAb3B0aW9ucy5rZXkuaWRcbiAgICAgIGVsZW1lbnQuYXR0ciAnaWQnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci10aXRsZSdcbiAgICAgICAgLmh0bWwgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgIGVsZW1lbnQuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcidcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAoZCkgPT4gXG4gICAgICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XSsnJSdcbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuaHRtbCAoZCkgPT4gTWF0aC5yb3VuZChkW0BvcHRpb25zLmtleS54XSkrJyUnXG4iLCJjbGFzcyB3aW5kb3cuQmFySG9yaXpvbnRhbFN0YWNrZWRHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIHN2ZyAmIHVzZSBodG1sIGRpdiBpbnN0ZWFkXG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWhvcml6b250YWwtZ3JhcGggYmFyLWhvcml6b250YWwtc3RhY2tlZC1ncmFwaCdcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgaWYgQG9wdGlvbnMueEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXhpcycpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLnhBeGlzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYXhpcydcbiAgICAgICAgLnN0eWxlICdsZWZ0JywgKGQpIC0+IGQrJyUnXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgIyBkcmF3IGJhcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuZGF0YShAZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWNvbnRhaW5lcidcbiAgICAgIC5jYWxsIEBzZXRCYXJzXG4gICAgcmV0dXJuIEBcbiAgXG4gIHNldEJhcnM6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnQuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci10aXRsZSdcbiAgICAgIC5odG1sIChkKSAtPiBkLm5hbWVcbiAgICBlbGVtZW50LnNlbGVjdEFsbCgnYmFyJylcbiAgICAgIC5kYXRhIChkKSAtPiByZXR1cm4gZC52YWx1ZXNcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gJ2JhciBiYXItJytkLm5hbWUucmVwbGFjZSgvIHxcXC8vZywnLScpXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgKGQpIC0+IGQudmFsdWUrJyUnXG4gICAgZWxlbWVudC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgLmh0bWwgKGQpID0+IE1hdGgucm91bmQoZC50b3RhbCkrJyUnXG4iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDYzXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI2M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTIwLCAxMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVpbm8gVW5pZG8nXG4gICAgICAgICAgICBlbjogJ1VuaXRlZCBLaW5nZG9tJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zNFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDb3JlYSBkZWwgTm9ydGUnXG4gICAgICAgICAgICBlbjogJ05vcnRoIEtvcmVhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MVxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDaGluYSdcbiAgICAgICAgICAgIGVuOiAnQ2hpbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnUGlsbCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3DDrWxkb3JhJ1xuICAgICAgICBlbjogJ3BpbGwnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC40NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDE2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMzUsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FyZ2VsaWEnXG4gICAgICAgICAgICBlbjogJ0FsZ2VyaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBjb25kb20nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdwcmVzZXJ2YXRpdm8gbWFzY3VsaW5vJ1xuICAgICAgICBlbjogJ21hbGUgY29uZG9tJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI5N1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjczXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgLTEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCb3RzdWFuYSdcbiAgICAgICAgICAgIGVuOiAnQm90c3dhbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSW5qZWN0YWJsZSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2lueWVjdGFibGUnXG4gICAgICAgIGVuOiAnaW5qZWN0YWJsZSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjYyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjU2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnRXRpb3DDrWEnXG4gICAgICAgICAgICBlbjogJ0V0aGlvcGlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzE4XG4gICAgICAgICAgcjogMTZcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTI2LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCYWxjYW5lcydcbiAgICAgICAgICAgIGVuOiAnQmFsa2FucydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMzMlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEwLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBbGJhbmlhJ1xuICAgICAgICAgICAgZW46ICdBbGJhbmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgZ2V0TGVnZW5kRGF0YTogLT5cbiAgICByZXR1cm4gWzAsMjAsNDAsNjAsODBdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZCsnJSdcblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBvZmZzZXQgPSAxMDBcbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLW9mZnNldFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAjIGF2b2lkIGdyYXBoIGhlaWdodCBvdmVyZmxvdyBicm93c2VyIGhlaWdodCBcbiAgICAgIGlmIEBjb250YWluZXJIZWlnaHQgPiBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJXaWR0aCA9IEBjb250YWluZXJIZWlnaHQgLyBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgICAjQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICAjZWxzZVxuICAgICAgIyAgQCRlbC5jc3MgJ3RvcCcsIChib2R5SGVpZ2h0LUBjb250YWluZXJIZWlnaHQpIC8gMlxuICAgICAgQHdpZHRoICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcblxuXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgc3VwZXIobWFwKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICByZXR1cm4gQFxuXG4gIHNldE1hcFN0YXRlOiAoc3RhdGUpIC0+XG4gICAgaWYgc3RhdGUgIT0gQGN1cnJlbnRTdGF0ZVxuICAgICAgI2NvbnNvbGUubG9nICdzZXQgc3RhdGUgJytzdGF0ZVxuICAgICAgQGN1cnJlbnRTdGF0ZSA9IHN0YXRlXG4gICAgICBAY3VycmVudE1ldGhvZCA9IEBzdGF0ZXNbQGN1cnJlbnRTdGF0ZS0xXVxuICAgICAgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBAY3VycmVudE1ldGhvZC50ZXh0W0BvcHRpb25zLmxhbmddXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PiBkLnZhbHVlID0gK2RbQGN1cnJlbnRNZXRob2QuaWRdXG4gICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgIEBjdXJyZW50TWV0aG9kLmxhYmVscy5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC5jeCA9IGQuY3hfZmFjdG9yKkB3aWR0aFxuICAgICAgICBkLmN5ID0gZC5jeV9mYWN0b3IqQGhlaWdodFxuICAgICAgICBkLnRleHQgPSBkLmxhYmVsW0BvcHRpb25zLmxhbmddXG4gICAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBAY3VycmVudE1ldGhvZC5sYWJlbHNcbiIsImNsYXNzIHdpbmRvdy5UcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMubWluU2l6ZSA9IG9wdGlvbnMubWluU2l6ZSB8fCA2MFxuICAgIG9wdGlvbnMubm9kZXNQYWRkaW5nID0gb3B0aW9ucy5ub2Rlc1BhZGRpbmcgfHwgOFxuICAgIG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gfHwgNjAwXG4gICAgb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID0gb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IHx8IDYyMFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBkcmF3IHNjYWxlc1xuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBzZXRTVkcgdG8gdXNlIGEgZGl2IGNvbnRhaW5lciAobm9kZXMtY29udGFpbmVyKSBpbnN0ZWFkIG9mIGEgc3ZnIGVsZW1lbnRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGVzLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIEB0cmVlbWFwID0gZDMudHJlZW1hcCgpXG4gICAgICAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgICAgLnBhZGRpbmcgMFxuICAgICAgLnJvdW5kIHRydWVcblxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuXG4gICAgQHN0cmF0aWZ5ID0gZDMuc3RyYXRpZnkoKS5wYXJlbnRJZCAoZCkgLT4gZC5wYXJlbnRcblxuICAgIEB1cGRhdGVHcmFwaCgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG5cbiAgICAjIHVwZGF0ZSB0cmVtYXAgXG4gICAgQHRyZWVtYXBSb290ID0gQHN0cmF0aWZ5KEBkYXRhKVxuICAgICAgLnN1bSAoZCkgPT4gZFtAb3B0aW9ucy5rZXkudmFsdWVdXG4gICAgICAuc29ydCAoYSwgYikgLT4gYi52YWx1ZSAtIGEudmFsdWVcbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgbm9kZXMgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgXG4gICAgbm9kZXMuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZSdcbiAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwnXG4gICAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbC1jb250ZW50J1xuICAgICAgICAgIC5hcHBlbmQgJ3AnXG5cbiAgICAjIHNldHVwIG5vZGVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcblxuICAgICMgYWRkIGxhYmVsIG9ubHkgaW4gbm9kZXMgd2l0aCBzaXplIGdyZWF0ZXIgdGhlbiBvcHRpb25zLm1pblNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmNhbGwgICBAc2V0Tm9kZUxhYmVsXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgbm9kZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG4gICAgICBcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG5cbiAgc2V0Tm9kZURpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuICBzZXROb2RlTGFiZWw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLnNlbGVjdCgncCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gcmV0dXJuIGlmIGQudmFsdWUgPiAyNSB0aGVuICdzaXplLWwnIGVsc2UgaWYgZC52YWx1ZSA8IDEwIHRoZW4gJ3NpemUtcycgZWxzZSAnJ1xuICAgICAgLmh0bWwgKGQpID0+IGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgaXNOb2RlTGFiZWxWaXNpYmxlOiAoZCkgPT5cbiAgICByZXR1cm4gZC54MS1kLngwID4gQG9wdGlvbnMubWluU2l6ZSAmJiBkLnkxLWQueTAgPiBAb3B0aW9ucy5taW5TaXplXG5cbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUnXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAgIyBzZXQgcGFyc2VkRGF0YSBhcnJheVxuICAgIHBhcnNlZERhdGEgPSBbe2lkOiAncid9XSAjIGFkZCB0cmVlbWFwIHJvb3RcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICBpZiBkYXRhX2NvdW50cnlbMF1cbiAgICAgICMgc2V0IG1ldGhvZHMgb2JqZWN0XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgICBpZiBkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICAgIG1ldGhvZHNba2V5XSA9XG4gICAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgICAgbmFtZTogQG9wdGlvbnMubWV0aG9kc05hbWVzW2ldXG4gICAgICAgICAgICB2YWx1ZTogK2RhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIlRoZXJlJ3Mgbm8gZGF0YSBmb3IgXCIgKyBrZXlcbiAgICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIGlmIGtleSAhPSAnT3RoZXIgbW9kZXJuIG1ldGhvZHMnIGFuZCBrZXkgIT0gJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnIGFuZCBtZXRob2QudmFsdWUgPCA1XG4gICAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgICBkZWxldGUgbWV0aG9kc1trZXldXG4gICAgIFxuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBwYXJzZWREYXRhLnB1c2hcbiAgICAgICAgICBpZDogbWV0aG9kLmlkXG4gICAgICAgICAgcmF3X25hbWU6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArIG1ldGhvZC5uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLm5hbWUuc2xpY2UoMSkgKyAnPC9zdHJvbmc+PGJyLz4nICsgTWF0aC5yb3VuZChtZXRob2QudmFsdWUpICsgJyUnXG4gICAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIHBhcmVudDogJ3InXG4gICAgICBwYXJzZWREYXRhU29ydGVkID0gcGFyc2VkRGF0YS5zb3J0IChhLGIpIC0+IGlmIGEudmFsdWUgYW5kIGIudmFsdWUgdGhlbiBiLnZhbHVlLWEudmFsdWUgZWxzZSAxXG4gICAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cnknKS5odG1sIGNvdW50cnlfbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWFueS1tZXRob2QnKS5odG1sIE1hdGgucm91bmQoZGF0YV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgcGFyc2VkRGF0YVNvcnRlZFswXS5yYXdfbmFtZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnTm8gZGF0YSBjb3VudHJ5IGZvciAnK2NvdW50cnlfY29kZVxuICAgICAgIyBUT0RPISEhIFdoYXQgd2UgZG8gaWYgdGhlcmUncyBubyBkYXRhIGZvciB1c2VyJ3MgY291bnRyeVxuICAgIHJldHVybiBwYXJzZWREYXRhXG5cbiAgIyBvdmVyZHJpdmUgc2V0IGRhdGFcbiAgc2V0RGF0YTogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBvcmlnaW5hbERhdGEgPSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAZHJhd0dyYXBoKClcbiAgICAjQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIG5vZGUgY2xhc3NcbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUgbm9kZS0nK2QuaWRcblxuICAjIyMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb250YWluZXJPZmZzZXQ6IC0+XG4gICAgQCRlbC5jc3MoJ3RvcCcsICgkKHdpbmRvdykuaGVpZ2h0KCktQCRlbC5oZWlnaHQoKSkqMC41KVxuICAjIyMiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgaW5jb21lTGV2ZWxzOiBbMTAwNSwgMzk1NSwgMTIyMzVdXG5cbiAgbGFiZWxzOiBbXG4gICAgJ0FHTycsXG4gICAgJ0JHRCcsXG4gICAgJ0JFTCcsXG4gICAgJ0JSQScsXG4gICAgJ0RFVScsXG4gICAgJ0VTUCcsXG4gICAgJ0VUSCcsXG4gICAgJ0ZJTicsXG4gICAgJ0lORCcsXG4gICAgJ0lETicsXG4gICAgJ0pQTicsXG4gICAgJ05HQScsXG4gICAgJ1BBSycsXG4gICAgJ1BITCcsXG4gICAgJ1JVUycsXG4gICAgJ1NBVScsXG4gICAgJ1RVUicsXG4gICAgJ1VHQScsXG4gICAgJ1VTQScsXG4gICAgJ1ZOTSdcbiAgXVxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIHJldHVybiBkYXRhLnNvcnQgKGEsYikgPT4gYltAb3B0aW9ucy5rZXkuc2l6ZV0tYVtAb3B0aW9ucy5rZXkuc2l6ZV1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgIyBkcmF3IGRvdHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YSBAZGF0YVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdFxuICAgICAgIy5vbiAnbW91c2VvdmVyJywgKGQpID0+IGNvbnNvbGUubG9nIGRcblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmRhdGEgQGRhdGEuZmlsdGVyIChkKSA9PiBAbGFiZWxzLmluZGV4T2YoZFtAb3B0aW9ucy5rZXkuaWRdKSAhPSAtMVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpID0+IHJldHVybiBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDEwMDAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDE4MDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1tJyBlbHNlICdkb3QtbGFiZWwnXG4gICAgICAgICMuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgICAuYXR0ciAnZHknLCAnMC4yNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkubGFiZWxdXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG5cblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWSA9IGQzLmZvcmNlWSAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgZm9yY2VZLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVlcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWChAd2lkdGgqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAzNTBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgc2V0RG90OiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuYXR0ciAnZmlsbCcsIEBnZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXREb3RQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjeCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICdjeScsIEBnZXRQb3NpdGlvbllcblxuICBzZXREb3RMYWJlbFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAneScsIEBnZXRQb3NpdGlvbllcblxuICBnZXRQb3NpdGlvblg6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC54IGVsc2UgTWF0aC5yb3VuZCBAeChkW0BvcHRpb25zLmtleS54XSlcblxuICBnZXRQb3NpdGlvblk6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC55IGVsc2UgTWF0aC5yb3VuZCBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSAjaWYgQG9wdGlvbnMua2V5LmNvbG9yIGFuZCBAb3B0aW9ucy5tb2RlID09IDEgdGhlbiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdIGVsc2UgJyNlMjcyM2InXG5cbiAgc2V0TW9kZTogKG1vZGUpIC0+XG4gICAgQG9wdGlvbnMubW9kZSA9IG1vZGVcbiAgICBpZiBAb3B0aW9ucy5tb2RlIDwgMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAgIGlmIEB4TGVnZW5kXG4gICAgICAgIEB4TGVnZW5kLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgICAgIyBzaG93L2hpZGUgZG90IGxhYmVsc1xuICAgICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAwXG4gICAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDFcbiAgICAgICMgc2hvdy9oaWRlIHggYXhpcyBsaW5lc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPCBAaW5jb21lTGV2ZWxzWzJdIG9yIGRbQG9wdGlvbnMua2V5LnldID4gMTVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gM1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPiBAaW5jb21lTGV2ZWxzWzFdIG9yIGRbQG9wdGlvbnMua2V5LnldIDwgMzBcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNFxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGQuaWQgIT0gJ1NBVScgYW5kIGQuaWQgIT0gJ0pQTidcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNVxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICAjQHggPSBkMy5zY2FsZVBvdygpXG4gICAgIyAgLmV4cG9uZW50KDAuMTI1KVxuICAgICMgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB4ID0gZDMuc2NhbGVMb2coKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgIyBFcXVpdmFsZW50IHRvIGQzLnNjYWxlU3FydCgpXG4gICAgICAjwqBodHRwczovL2JsLm9ja3Mub3JnL2QzaW5kZXB0aC83NzVjZjQzMWU2NGI2NzE4NDgxYzA2ZmM0NWRjMzRmOVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0gIy5yZXZlcnNlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIEBpbmNvbWVMZXZlbHNcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtMSw1KSdcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyNTAsIDg1MDAwXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCAxMCwgMjAsIDMwXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuYXR0ciAneTEnLCBAeSg0MCktNFxuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzIC50aWNrIHRleHQnKVxuICAgICAgICAuYXR0ciAnZHgnLCAzXG4gICAgICAgIC5hdHRyICdkeScsIC00XG4gICAgIyBzZXQgeCBsZW5nZWRcbiAgICBpbmNvbWVzID0gQHhBeGlzLnRpY2tWYWx1ZXMoKVxuICAgIGluY29tZXMudW5zaGlmdCAwXG4gICAgaW5jb21lc01heCA9IEB4IEBnZXRTY2FsZVhEb21haW4oKVsxXVxuICAgIGluY29tZXMgPSBpbmNvbWVzLm1hcCAoZCkgPT4gaWYgZCA+IDAgdGhlbiAxMDAqQHgoZCkvaW5jb21lc01heCBlbHNlIDBcbiAgICBpbmNvbWVzLnB1c2ggMTAwXG4gICAgQHhMZWdlbmQgPSBkMy5zZWxlY3QoZDMuc2VsZWN0KCcjJytAaWQpLm5vZGUoKS5wYXJlbnROb2RlKS5zZWxlY3QoJy54LWxlZ2VuZCcpXG4gICAgQHhMZWdlbmQuc2VsZWN0QWxsKCdsaScpLnN0eWxlICd3aWR0aCcsIChkLGkpIC0+IChpbmNvbWVzW2krMV0taW5jb21lc1tpXSkrJyUnXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICB1c2VUcmVlbWFwID0gbnVsbFxuICB1c2VNYXAgPSBudWxsXG4gIHVzZUdyYXBoID0gbnVsbFxuICB1bm1ldG5lZWRzR3JhcGggPSBudWxsIFxuXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IGZhbHNlXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiaW1wbGFudGVcIlxuICAgICAgXCJpbnllY3RhYmxlXCJcbiAgICAgIFwicMOtbGRvcmFcIlxuICAgICAgXCJjb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcImNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJtw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiYW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJvdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcImZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwibWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiaW1wbGFudFwiXG4gICAgICBcImluamVjdGFibGVcIlxuICAgICAgXCJwaWxsXCJcbiAgICAgIFwibWFsZSBjb25kb21cIlxuICAgICAgXCJmZW1hbGUgY29uZG9tXCJcbiAgICAgIFwidmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcImVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwib3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgIyMjXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG4gICMjI1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIiAgICAgICAjIG9wcG9zZWRcbiAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiICAjIG9wcG9zZWRcbiAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiICAgICAgICAgICAjIG9wcG9zZWRcbiAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIiAgICAjIG9wcG9zZWRcbiAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCIgICAgICAgICAgICAgICAgICAgICAgIyBzYWx1ZFxuICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiICMgc2FsdWRcbiAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCknMgcHJvY2Vzc2VzXCIgICAgICAjIHNhbHVkXG4gICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gICMgU2Nyb2xsYW1hIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBTY3JvbGxhbWEgPSAoaWQpIC0+XG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytpZClcbiAgICBncmFwaGljICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIGNoYXJ0ICAgICA9IGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICB0ZXh0ICAgICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLXRleHQnKVxuICAgIHN0ZXBzICAgICA9IHRleHQuc2VsZWN0QWxsKCcuc3RlcCcpXG5cbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuXG4gICAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgICBoYW5kbGVSZXNpemUgPSAtPlxuICAgICAgd2lkdGggPSBncmFwaGljLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAjTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgICBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgICAgZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICAgIGNoYXJ0XG4gICAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICAgIHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgICBoYW5kbGVDb250YWluZXJFbnRlciA9IChlKSAtPlxuICAgICAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAgIGhhbmRsZUNvbnRhaW5lckV4aXQgPSAoZSkgLT5cbiAgICAgICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIGhhbmRsZVN0ZXBFbnRlciA9IChlKSAtPlxuICAgICAgI8KgY29uc29sZS5sb2cgZVxuICAgICAgJHN0ZXAgPSAkKGUuZWxlbWVudClcbiAgICAgIGluc3RhbmNlID0gJHN0ZXAuZGF0YSgnaW5zdGFuY2UnKVxuICAgICAgc3RlcCA9ICRzdGVwLmRhdGEoJ3N0ZXAnKVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMCBcbiAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMScsIHN0ZXBcbiAgICAgICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgc3RlcCAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMlxuICAgICAgICBpZiB1c2VHcmFwaCBhbmQgc3RlcCA+IDBcbiAgICAgICAgICBkYXRhID0gWzYzLCA4OCwgMTAwXSAjIDYzLCA2MysyNSwgNjMrMjUrMTJcbiAgICAgICAgICBmcm9tID0gaWYgc3RlcCA+IDEgdGhlbiBkYXRhW3N0ZXAtMl0gZWxzZSAwXG4gICAgICAgICAgdG8gPSBkYXRhW3N0ZXAtMV1cbiAgICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQgPj0gZnJvbSBhbmQgZCA8IHRvXG4gICAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK3N0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDInLCBzdGVwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDNcbiAgICAgICAgaWYgdW5tZXRuZWVkc0dyYXBoXG4gICAgICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgc3RlcFxuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK2lkICAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHRleHQ6ICAgICAgICcuc2Nyb2xsLXRleHQnICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjA1ICAgICAgICAgICAgICAgICAgIyBzZXQgdGhlIHRyaWdnZXIgdG8gYmUgMS8yIHdheSBkb3duIHNjcmVlblxuICAgICAgICBkZWJ1ZzogICAgICBmYWxzZSAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgaGFuZGxlQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBoYW5kbGVDb250YWluZXJFeGl0IFxuXG4gICAgIyBFbnN1cmUgdG8gc2V0dXAgb25TdGVwRW50ZXIgaGFuZGxlciBvbmx5IG9uY2VcbiAgICB1bmxlc3Mgc2Nyb2xsYW1hSW5pdGlhbGl6ZWRcbiAgICAgIHNjcm9sbGFtYUluaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgc2Nyb2xsZXIub25TdGVwRW50ZXIgIGhhbmRsZVN0ZXBFbnRlciBcbiAgICAgIFxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgZGF0YUluZGV4ID0gWzAuLjk5XVxuICAgIHVzZUdyYXBoID0gZDMuc2VsZWN0KCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJylcbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcbiAgICAjIFJlc2l6ZSBoYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlciA9IC0+XG4gICAgICBpZiBncmFwaFdpZHRoICE9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBncmFwaFdpZHRoID0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGl0ZW1zV2lkdGggPSAoZ3JhcGhXaWR0aCAvIDIwKSAtIDEwXG4gICAgICAgIGl0ZW1zSGVpZ2h0ID0gMi4zMyppdGVtc1dpZHRoXG4gICAgICAgICNpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuICcxMCUnIGVsc2UgJzUlJ1xuICAgICAgICAjaXRlbXNIZWlnaHQgPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gZ3JhcGhXaWR0aCAqIDAuMSAvIDAuNzUgZWxzZSBncmFwaFdpZHRoICogMC4wNSAvIDAuNzVcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLnN0eWxlICd3aWR0aCcsIGl0ZW1zV2lkdGgrJ3B4J1xuICAgICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaXRlbXNIZWlnaHQrJ3B4J1xuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgICAgICAgLmF0dHIgJ3dpZHRoJywgaXRlbXNXaWR0aFxuICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCBpdGVtc0hlaWdodFxuICAgICAgdXNlR3JhcGguc3R5bGUgJ21hcmdpbi10b3AnLCAoKCQoJ2JvZHknKS5oZWlnaHQoKS11c2VHcmFwaC5ub2RlKCkub2Zmc2V0SGVpZ2h0KSouNSkrJ3B4J1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlcigpXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzKSAtPlxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAndW5tZXQtbmVlZHMtZ2RwLWNvbnRhaW5lci1ncmFwaCdcblxuICAgICMgcGFyc2UgZGF0YVxuICAgIGRhdGEgPSBbXVxuICAgIGRhdGFfdW5tZXRuZWVkcy5mb3JFYWNoIChkKSAtPlxuICAgICAgY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGlmIGNvdW50cnlbMF0gYW5kIGNvdW50cnlbMF1bJ2duaSddXG4gICAgICAgICAgZGF0YS5wdXNoXG4gICAgICAgICAgICB2YWx1ZTogICAgICArZFsnMjAxNyddXG4gICAgICAgICAgICBpZDogICAgICAgICBjb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICAgIG5hbWU6ICAgICAgIGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgcG9wdWxhdGlvbjogK2NvdW50cnlbMF1bJ3BvcHVsYXRpb24nXVxuICAgICAgICAgICAgZ25pOiAgICAgICAgK2NvdW50cnlbMF1bJ2duaSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdObyBHTkkgb3IgUG9wdWxhdGlvbiBkYXRhIGZvciB0aGlzIGNvdW50cnknLCBkLmNvZGUsIGNvdW50cnlbMF1cbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAgICAgICdnbmknXG4gICAgICAgIHk6ICAgICAgJ3ZhbHVlJ1xuICAgICAgICBpZDogICAgICdpZCdcbiAgICAgICAgbGFiZWw6ICAnbmFtZSdcbiAgICAgICAgY29sb3I6ICAndmFsdWUnXG4gICAgICAgIHNpemU6ICAgJ3BvcHVsYXRpb24nXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAzMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG5cbiAgICAjIHBhcnNlIGRhdGEgdXNlXG4gICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgbWV0aG9kc19rZXlzLmZvckVhY2ggKGtleSxpKSAtPlxuICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgaWQ6IGlcbiAgICAgICAgICBuYW1lOiBtZXRob2RzX25hbWVzW2xhbmddW2ldXG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgICNkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG5cbiAgICAjIFNldCB1c2UgbWFwXG4gICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiAyMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGxlZ2VuZDogdHJ1ZVxuICAgICAgbGFuZzogbGFuZ1xuICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcbiAgICB1c2VNYXAub25SZXNpemUoKVxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZU1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIEdyYXBoc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc1JlYXNvbnMgPSAoZGF0YV9yZWFzb25zLCBjb3VudHJpZXMpIC0+XG5cbiAgICByZWFzb25IZWFsdGggPSBbXVxuICAgIHJlYXNvbk9wcG9zZWQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kID0gW11cbiAgICAjIyNcbiAgICByZWFzb25Ob3RTZXggPSBbXVxuICAgIHJlYXNvbk9wcG9zZWQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50ID0gW11cbiAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzID0gW11cbiAgICAjIyNcblxuICAgICMgcGFyc2UgcmVhc29ucyBkYXRhXG4gICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICBpZiBkLm5hbWVcbiAgICAgICAgcmVhc29uSGVhbHRoLnB1c2hcbiAgICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgICB2YWx1ZTogZC5vK2QucCtkLnQgIyBoZWFsdGggY29uY2VybnMgKyBmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnMgKyBpbnRlcmZlcmVzIHdpdGggYm9kecKScyBwcm9jZXNzZXNcbiAgICAgICAgcmVhc29uT3Bwb3NlZEh1c2JhbmQucHVzaFxuICAgICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICAgIHZhbHVlOiBkLmogI8KgaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcbiAgICAgICAgIyMjXG4gICAgICAgIHJlYXNvbk5vdFNleC5wdXNoXG4gICAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgICAgdmFsdWU6IGQuYiAjIG5vdCBoYXZpbmcgc2V4XG4gICAgICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnB1c2hcbiAgICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgICB2YWx1ZTogZC5pICPCoHJlc3BvbmRlbnQgb3Bwb3NlZFxuICAgICAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzLnB1c2hcbiAgICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgICB2YWx1ZTogZC5sICPCoHJlbGlnaW91cyBwcm9oaWJpdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgcmVhc29uT3Bwb3NlZC5wdXNoXG4gICAgICAgICAgbmFtZTogICBkLm5hbWVcbiAgICAgICAgICB0b3RhbDogIGQuaStkLmorZC5rK2QubCAgI8KgcmVzcG9uZGVudCBvcHBvc2VkICsgaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQgKyBvdGhlcnMgb3Bwb3NlZCArIHJlbGlnaW91cyBwcm9oaWJpdGlvblxuICAgICAgICAgIHZhbHVlczogW1xuICAgICAgICAgICAge25hbWU6IHJlYXNvbnNfbmFtZXMuaSwgdmFsdWU6IGQuaX1cbiAgICAgICAgICAgIHtuYW1lOiByZWFzb25zX25hbWVzLmosIHZhbHVlOiBkLmp9XG4gICAgICAgICAgICB7bmFtZTogcmVhc29uc19uYW1lcy5sLCB2YWx1ZTogZC5sfVxuICAgICAgICAgICAge25hbWU6IHJlYXNvbnNfbmFtZXMuaywgdmFsdWU6IGQua31cbiAgICAgICAgICBdXG5cbiAgICByZWFzb25IZWFsdGguc29ydCAgICAgICAgIChhLGIpIC0+IHJldHVybiBiLnZhbHVlLWEudmFsdWVcbiAgICByZWFzb25PcHBvc2VkSHVzYmFuZC5zb3J0IChhLGIpIC0+IHJldHVybiBiLnZhbHVlLWEudmFsdWVcbiAgICByZWFzb25PcHBvc2VkLnNvcnQgICAgICAgIChhLGIpIC0+IHJldHVybiBiLnRvdGFsLWEudG90YWxcbiAgICBjb25zb2xlLmxvZyByZWFzb25PcHBvc2VkXG4gICAgIyMjXG4gICAgcmVhc29uTm90U2V4LnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZEh1c2JhbmQuc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzLnNvcnQgc29ydEFycmF5XG4gICAgIyMjXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtaGVhbHRoJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbkhlYWx0aC5zbGljZSgwLDUpXG4gICBcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxTdGFja2VkR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcse30pLnNldERhdGEgcmVhc29uT3Bwb3NlZC5zbGljZSgwLDEwKVxuICAgICMjI1xuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW5vdC1zZXgnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uTm90U2V4LnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLXJlc3BvbmRlbnQnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZSdcbiAgICAgIHhBeGlzOiBbNTAsIDEwMF0pLnNldERhdGEgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQuc2xpY2UoMCw1KVxuICAgIFxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtcmVsaWdpb3VzJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMuc2xpY2UoMCw1KVxuICAgICMjI1xuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtaHVzYmFuZCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJ1xuICAgICAgeEF4aXM6IFs1MCwgMTAwXSkuc2V0RGF0YSByZWFzb25PcHBvc2VkSHVzYmFuZC5zbGljZSgwLDUpXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBUcmVlbmFwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBBcHBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCA9IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMpIC0+XG4gICAgI8Kgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLWFwcC1jb250YWluZXInXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCAuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLmNoYW5nZSAtPlxuICAgICAgICBjb3VudHJ5X2NvZGUgPSAkKHRoaXMpLnZhbCgpXG4gICAgICAgIGNvbnNvbGUubG9nICdjaGFuZ2UnLCBjb3VudHJ5X2NvZGVcbiAgICAgICAgIyBVc2VcbiAgICAgICAgZGF0YV91c2VfY291bnRyeSA9IGRhdGFfdXNlLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3VzZV9jb3VudHJ5IGFuZCBkYXRhX3VzZV9jb3VudHJ5WzBdXG4gICAgICAgICAgY291bnRyeV9tZXRob2RzID0gbWV0aG9kc19rZXlzLm1hcCAoa2V5LCBpKSAtPiB7J25hbWUnOiBtZXRob2RzX25hbWVzW2xhbmddW2ldLCAndmFsdWUnOiArZGF0YV91c2VfY291bnRyeVswXVtrZXldfVxuICAgICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK2RhdGFfdXNlX2NvdW50cnlbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgY291bnRyeV9tZXRob2RzWzBdLm5hbWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoY291bnRyeV9tZXRob2RzWzBdLnZhbHVlKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcbiAgICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICAgIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5ID0gZGF0YV91bm1ldG5lZWRzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3VubWV0bmVlZHNfY291bnRyeSBhbmQgZGF0YV91bm1ldG5lZWRzX2NvdW50cnlbMF1cbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrZGF0YV91bm1ldG5lZWRzX2NvdW50cnlbMF1bJzIwMTcnXSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcbiAgICAgICAgIyBSZWFzb25zXG4gICAgICAgIGRhdGFfcmVhc29uc19jb3VudHJ5ID0gZGF0YV9yZWFzb25zLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgICBpZiBkYXRhX3JlYXNvbnNfY291bnRyeSBhbmQgZGF0YV9yZWFzb25zX2NvdW50cnlbMF1cbiAgICAgICAgICByZWFzb25zID0gT2JqZWN0LmtleXMocmVhc29uc19uYW1lcykubWFwIChyZWFzb24pIC0+IHsnbmFtZSc6IHJlYXNvbnNfbmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2RhdGFfcmVhc29uc19jb3VudHJ5WzBdW3JlYXNvbl19XG4gICAgICAgICAgcmVhc29ucyA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKHJlYXNvbnNbMF0udmFsdWUpKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuICAgICAgLnZhbCB1c2VyQ291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBBcHBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgIyMjXG4gIHNldHVwTWF0ZXJuYWxNb3J0YWxpdHkgPSAtPlxuICAgIGRhdGFJbmRleCA9IFswLi40OTk5XVxuICAgIG1vcnRhbGl0eUdyYXBoID0gZDMuc2VsZWN0KCcjbWF0ZXJuYWwtbW9ydGFsaXR5LWRldmVsb3BlZCcpXG4gICAgbW9ydGFsaXR5R3JhcGguYXBwZW5kKCd1bCcpXG4gICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgIC5kYXRhKGRhdGFJbmRleClcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgIC5hcHBlbmQoJ3VzZScpXG4gICAgICAgICAgICAuYXR0cigneGxpbms6aHJlZicsICcjaWNvbi13b21hbicpXG4gICAgICAgICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTkzIDQ1MCcpXG4gICAgIyBSZXNpemUgaGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIgPSAtPlxuICAgICAgaWYgZ3JhcGhXaWR0aCAhPSBtb3J0YWxpdHlHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgZ3JhcGhXaWR0aCA9IG1vcnRhbGl0eUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBpdGVtc1dpZHRoID0gKGdyYXBoV2lkdGggLyAxMDApIC0gMlxuICAgICAgICBpdGVtc0hlaWdodCA9IDIuMzMqaXRlbXNXaWR0aFxuICAgICAgICAjaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiAnMTAlJyBlbHNlICc1JSdcbiAgICAgICAgI2l0ZW1zSGVpZ2h0ID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuIGdyYXBoV2lkdGggKiAwLjEgLyAwLjc1IGVsc2UgZ3JhcGhXaWR0aCAqIDAuMDUgLyAwLjc1XG4gICAgICAgIG1vcnRhbGl0eUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5zdHlsZSAnd2lkdGgnLCBpdGVtc1dpZHRoKydweCdcbiAgICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0KydweCdcbiAgICAgICAgbW9ydGFsaXR5R3JhcGguc2VsZWN0QWxsKCdzdmcnKVxuICAgICAgICAgIC5hdHRyICd3aWR0aCcsIGl0ZW1zV2lkdGhcbiAgICAgICAgICAuYXR0ciAnaGVpZ2h0JywgaXRlbXNIZWlnaHRcbiAgICAgICNtb3J0YWxpdHlHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLW1vcnRhbGl0eUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyKClcbiAgIyMjXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICBkMy5xdWV1ZSgpXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwLCBsb2NhdGlvbikgLT5cblxuICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICBlbHNlXG4gICAgICAgIGxvY2F0aW9uID0ge31cblxuICAgICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cbiAgICAgICN0ZXN0IG90aGVyIGNvdW50cmllc1xuICAgICAgI3VzZXJDb3VudHJ5LmNvZGUgPSAnUlVTJ1xuICAgICAgI3VzZXJDb3VudHJ5Lm5hbWUgPSAnUnVzaWEnXG5cbiAgICAgICMgYWRkIGNvdW50cnkgSVNPIDMxNjYtMSBhbHBoYS0zIGNvZGUgdG8gZGF0YV9yZWFzb25zXG4gICAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZTIgPT0gZC5jb2RlXG4gICAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgICBkLmNvZGUgPSBpdGVtWzBdLmNvZGVcbiAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzKS5mb3JFYWNoIChyZWFzb24pIC0+XG4gICAgICAgICAgICBkW3JlYXNvbl0gPSAxMDAqZFtyZWFzb25dXG4gICAgICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgJ0FsZXJ0ISBWYWx1ZSBncmVhdGVyIHRoYW4gemVyby4gJyArIGQuY291bnRyeSArICcsICcgKyByZWFzb24gKyAnOiAnICsgZFtyZWFzb25dXG4gICAgICAgICAgZGVsZXRlIGQuY291bnRyeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS53YXJuICdObyBjb3VudHJ5IGRhdGEgZm9yICcrZC5jb2RlXG5cbiAgICAgIGNvbnNvbGUubG9nIHVzZXJDb3VudHJ5XG5cbiAgICAgIGlmICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgZGF0YV91c2VcblxuICAgICAgaWYgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcFxuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoKClcblxuICAgICAgaWYgJCgnI3VubWV0LW5lZWRzLWdkcC1ncmFwaCcpLmxlbmd0aFxuICAgICAgICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCBkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllc1xuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29udHJhY2VwdGl2ZXNSZWFzb25zIGRhdGFfcmVhc29ucywgY291bnRyaWVzXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnNcblxuICAgICAgI2lmICQoJyNtYXRlcm5hbC1tb3J0YWxpdHktZGV2ZWxvcGVkJykubGVuZ3RoXG4gICAgICAjICBzZXR1cE1hdGVybmFsTW9ydGFsaXR5KClcblxuKSBqUXVlcnlcbiJdfQ==
