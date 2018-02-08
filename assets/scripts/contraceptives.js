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
            cx_factor: 0.616,
            cy_factor: 0.571,
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

    BeeswarmScatterplotGraph.prototype.drawGraph = function() {
      this.setSize();
      this.setSimulation();
      this.runSimulation();
      this.container.selectAll('.dot').data(this.data).enter().append('circle').attr('class', 'dot').attr('id', (function(_this) {
        return function(d) {
          return 'dot-' + d[_this.options.key.id];
        };
      })(this)).call(this.setDot).on('mouseover', (function(_this) {
        return function(d) {
          return console.log(d);
        };
      })(this));
      if (this.options.key.label) {
        return this.container.selectAll('.dot-label').data(this.data.filter((function(_this) {
          return function(d) {
            return d[_this.options.key.size] > 78000000;
          };
        })(this))).enter().append('text').attr('class', 'dot-label').attr('dy', '0.25em').text((function(_this) {
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
      this.container.selectAll('.dot').attr('fill', this.getDotFill).call(this.setDotPosition);
      if (this.options.key.label) {
        return this.container.selectAll('.dot-label').style('opacity', 0).call(this.setDotLabelPosition).transition().delay(500).style('opacity', 1);
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
      this.xAxis = d3.axisBottom(this.x).tickSize(this.height).tickValues([500, 1000, 5000, 10000, 50000]).tickFormat(function(d) {
        return d + '$';
      });
      this.yAxis = d3.axisLeft(this.y).tickSize(this.width).tickValues([0, 10, 20, 30, 40]).tickFormat(function(d) {
        return d + '%';
      });
      return this;
    };

    BeeswarmScatterplotGraph.prototype.setXAxisPosition = function(selection) {
      return selection.attr('transform', 'translate(0,5)');
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
      }
      if (this.yAxis) {
        this.container.append('g').attr('class', 'y axis').call(this.setYAxisPosition).call(this.yAxis);
        this.container.selectAll('.y.axis .tick text').attr('dx', 3).attr('dy', -4);
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
          label: 'name',
          size: 'population',
          color: 'value'
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
      if ($('#contraceptives-use-graph').length > 0) {
        setupConstraceptivesUseGraph();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQ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QyxTQUF6QyxFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsTUFBNUI7ZUFDRSxzQkFBQSxDQUF1QixRQUF2QixFQUFpQyxlQUFqQyxFQUFrRCxZQUFsRCxFQURGOztJQWpESyxDQVRUO0VBL2ZELENBQUQsQ0FBQSxDQTRqQkUsTUE1akJGO0FBQUEiLCJmaWxlIjoiY29udHJhY2VwdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBpZiBAc3ZnXG4gICAgICBAc3ZnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LkJhckhvcml6b250YWxHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCYXIgSG9yaXpvbnRhbCBHcmFwaCcsIGlkLCBvcHRpb25zXG4gICAgb3B0aW9ucy54QXhpcyA9IG9wdGlvbnMueEF4aXMgfHwgWzI1LCA1MCwgNzUsIDEwMF1cbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgc3ZnICYgdXNlIGh0bWwgZGl2IGluc3RlYWRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZClcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXItaG9yaXpvbnRhbC1ncmFwaCdcblxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICBkYXRhLmZvckVhY2ggKGQpID0+IFxuICAgICAgZFtAb3B0aW9ucy5rZXkueF0gPSArZFtAb3B0aW9ucy5rZXkueF1cbiAgICByZXR1cm4gZGF0YVxuXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgaWYgQG9wdGlvbnMueEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYXhpcycpXG4gICAgICAgIC5kYXRhKEBvcHRpb25zLnhBeGlzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYXhpcydcbiAgICAgICAgLnN0eWxlICdsZWZ0JywgKGQpIC0+IGQrJyUnXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgY29uc29sZS5sb2cgJ2JhciBob3Jpem9udGFsIGRhdGEnLCBAZGF0YVxuICAgICMgZHJhdyBiYXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgLmRhdGEoQGRhdGEpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci1jb250YWluZXInXG4gICAgICAuY2FsbCBAc2V0QmFyc1xuICAgIHJldHVybiBAXG5cbiAgXG4gIHNldEJhcnM6IChlbGVtZW50KSA9PlxuICAgIGlmIEBvcHRpb25zLmtleS5pZFxuICAgICAgZWxlbWVudC5hdHRyICdpZCcsIChkKSA9PiBkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIGVsZW1lbnQuYXBwZW5kKCdkaXYnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLXRpdGxlJ1xuICAgICAgICAuaHRtbCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgZWxlbWVudC5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyJ1xuICAgICAgLnN0eWxlICd3aWR0aCcsIChkKSA9PiBcbiAgICAgICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdKyclJ1xuICAgICAgLmFwcGVuZCgnc3BhbicpXG4gICAgICAgIC5odG1sIChkKSA9PiBNYXRoLnJvdW5kKGRbQG9wdGlvbnMua2V5LnhdKSsnJSdcbiIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbkl0ZW1XaWR0aCA9IDMwXG4gICAgbGVnZW5kRGF0YSA9IEBnZXRMZWdlbmREYXRhKClcbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGkrMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IEBnZXRMZWdlbmRGb3JtYXRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoIGV4dGVuZHMgd2luZG93Lk1hcEdyYXBoXG5cbiAgY3VycmVudFN0YXRlOiAwXG5cbiAgc3RhdGVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdGZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBmZW1lbmluYSdcbiAgICAgICAgZW46ICdmZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDhcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yMCwgMzBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0luZGlhJ1xuICAgICAgICAgICAgZW46ICdJbmRpYSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40NjVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzIwLCAtNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVww7pibGljYSBEb21pbmljYW5hJ1xuICAgICAgICAgICAgZW46ICdEb21pbmljYW4gUmVwdWJsaWMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYSdcbiAgICAgICAgZW46ICdtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC40NjNcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMjYzXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdSZWlubyBVbmlkbydcbiAgICAgICAgICAgIGVuOiAnVW5pdGVkIEtpbmdkb20nXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjM0XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NvcmVhIGRlbCBOb3J0ZSdcbiAgICAgICAgICAgIGVuOiAnTm9ydGggS29yZWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnUGlsbCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3DDrWxkb3JhJ1xuICAgICAgICBlbjogJ3BpbGwnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC40NjRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDE2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMzUsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FyZ2VsaWEnXG4gICAgICAgICAgICBlbjogJ0FsZ2VyaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBjb25kb20nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdwcmVzZXJ2YXRpdm8gbWFzY3VsaW5vJ1xuICAgICAgICBlbjogJ21hbGUgY29uZG9tJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI5N1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjczXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgLTEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCb3RzdWFuYSdcbiAgICAgICAgICAgIGVuOiAnQm90c3dhbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSW5qZWN0YWJsZSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2lueWVjdGFibGUnXG4gICAgICAgIGVuOiAnaW5qZWN0YWJsZSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjYxNlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC41NzFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzE1LCA1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdFdGlvcMOtYSdcbiAgICAgICAgICAgIGVuOiAnRXRoaW9waWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMThcbiAgICAgICAgICByOiAxNlxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjYsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0JhbGNhbmVzJ1xuICAgICAgICAgICAgZW46ICdCYWxrYW5zJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzMyXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTAsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0FsYmFuaWEnXG4gICAgICAgICAgICBlbjogJ0FsYmFuaWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICBnZXRMZWdlbmREYXRhOiAtPlxuICAgIHJldHVybiBbMCwyMCw0MCw2MCw4MF1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkKyclJ1xuXG4gICMgb3ZlcnJpZGUgZ2V0RGltZW5zaW9uc1xuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIG9mZnNldCA9IDEwMFxuICAgIGlmIEAkZWxcbiAgICAgIGJvZHlIZWlnaHQgPSAkKCdib2R5JykuaGVpZ2h0KCktb2Zmc2V0XG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICMgYXZvaWQgZ3JhcGggaGVpZ2h0IG92ZXJmbG93IGJyb3dzZXIgaGVpZ2h0IFxuICAgICAgaWYgQGNvbnRhaW5lckhlaWdodCA+IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lckhlaWdodCA9IGJvZHlIZWlnaHRcbiAgICAgICAgQGNvbnRhaW5lcldpZHRoID0gQGNvbnRhaW5lckhlaWdodCAvIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAgICNAJGVsLmNzcyAndG9wJywgMFxuICAgICAgIyB2ZXJ0aWNhbCBjZW50ZXIgZ3JhcGhcbiAgICAgICNlbHNlXG4gICAgICAjICBAJGVsLmNzcyAndG9wJywgKGJvZHlIZWlnaHQtQGNvbnRhaW5lckhlaWdodCkgLyAyXG4gICAgICBAd2lkdGggID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIG9uUmVzaXplOiA9PlxuICAgIHN1cGVyKClcbiAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG5cblxuICAjIG92ZXJyaWRlIGNvbG9yIGRvbWFpblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCA4MF1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdHcmFwaDogKG1hcCkgLT5cbiAgICBzdXBlcihtYXApXG4gICAgQHJpbmdOb3RlID0gZDMucmluZ05vdGUoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0TWFwU3RhdGU6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSAhPSBAY3VycmVudFN0YXRlXG4gICAgICAjY29uc29sZS5sb2cgJ3NldCBzdGF0ZSAnK3N0YXRlXG4gICAgICBAY3VycmVudFN0YXRlID0gc3RhdGVcbiAgICAgIEBjdXJyZW50TWV0aG9kID0gQHN0YXRlc1tAY3VycmVudFN0YXRlLTFdXG4gICAgICAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIEBjdXJyZW50TWV0aG9kLnRleHRbQG9wdGlvbnMubGFuZ11cbiAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+IGQudmFsdWUgPSArZFtAY3VycmVudE1ldGhvZC5pZF1cbiAgICAgIEB1cGRhdGVHcmFwaCBAZGF0YVxuICAgICAgQHNldEFubm90YXRpb25zKClcblxuICBzZXRBbm5vdGF0aW9uczogLT5cbiAgICBpZiBAY3VycmVudE1ldGhvZFxuICAgICAgQGN1cnJlbnRNZXRob2QubGFiZWxzLmZvckVhY2ggKGQpID0+IFxuICAgICAgICBkLmN4ID0gZC5jeF9mYWN0b3IqQHdpZHRoXG4gICAgICAgIGQuY3kgPSBkLmN5X2ZhY3RvcipAaGVpZ2h0XG4gICAgICAgIGQudGV4dCA9IGQubGFiZWxbQG9wdGlvbnMubGFuZ11cbiAgICAgIEBjb250YWluZXIuY2FsbCBAcmluZ05vdGUsIEBjdXJyZW50TWV0aG9kLmxhYmVsc1xuIiwiY2xhc3Mgd2luZG93LlRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgb3B0aW9ucy5taW5TaXplID0gb3B0aW9ucy5taW5TaXplIHx8IDYwXG4gICAgb3B0aW9ucy5ub2Rlc1BhZGRpbmcgPSBvcHRpb25zLm5vZGVzUGFkZGluZyB8fCA4XG4gICAgb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiB8fCA2MDBcbiAgICBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgPSBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnQgfHwgNjIwXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIGRyYXcgc2NhbGVzXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJyaWRlIHNldFNWRyB0byB1c2UgYSBkaXYgY29udGFpbmVyIChub2Rlcy1jb250YWluZXIpIGluc3RlYWQgb2YgYSBzdmcgZWxlbWVudFxuICBzZXRTVkc6IC0+XG4gICAgQGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZXMtY29udGFpbmVyJ1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICBkcmF3R3JhcGg6IC0+XG4gICAgQHRyZWVtYXAgPSBkMy50cmVlbWFwKClcbiAgICAgIC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgICAucGFkZGluZyAwXG4gICAgICAucm91bmQgdHJ1ZVxuXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG5cbiAgICBAc3RyYXRpZnkgPSBkMy5zdHJhdGlmeSgpLnBhcmVudElkIChkKSAtPiBkLnBhcmVudFxuXG4gICAgQHVwZGF0ZUdyYXBoKClcblxuICAgIHJldHVybiBAXG5cblxuICB1cGRhdGVHcmFwaDogLT5cblxuICAgICMgdXBkYXRlIHRyZW1hcCBcbiAgICBAdHJlZW1hcFJvb3QgPSBAc3RyYXRpZnkoQGRhdGEpXG4gICAgICAuc3VtIChkKSA9PiBkW0BvcHRpb25zLmtleS52YWx1ZV1cbiAgICAgIC5zb3J0IChhLCBiKSAtPiBiLnZhbHVlIC0gYS52YWx1ZVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyB1cGRhdGUgbm9kZXNcbiAgICBub2RlcyA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICBcbiAgICBub2Rlcy5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2RlJ1xuICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbCdcbiAgICAgICAgLmFwcGVuZCAnZGl2J1xuICAgICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsLWNvbnRlbnQnXG4gICAgICAgICAgLmFwcGVuZCAncCdcblxuICAgICMgc2V0dXAgbm9kZXNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmNhbGwgQHNldE5vZGVcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuXG4gICAgIyBhZGQgbGFiZWwgb25seSBpbiBub2RlcyB3aXRoIHNpemUgZ3JlYXRlciB0aGVuIG9wdGlvbnMubWluU2l6ZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuY2FsbCAgIEBzZXROb2RlTGFiZWxcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICBub2Rlcy5leGl0KCkucmVtb3ZlKClcblxuICAgIHJldHVybiBAXG5cblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcblxuICAgIEBjb250YWluZXIuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gICAgIyBVcGRhdGUgdHJlbWFwIHNpemVcbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcbiAgICBlbHNlXG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTcXVhcmlmeVxuICAgIEB0cmVlbWFwLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgVXBkYXRlIG5vZGVzIGRhdGFcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcbiAgICAgIFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZS1sYWJlbCcpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyAgIyBIaWRlIGxhYmVscyBieSBkZWZhdWx0IChzZXROb2RlTGFiZWwgd2lsbCBzaG93IGlmIG5vZGUgaXMgYmlnZ2VyIGVub3VnaHQpXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgcmV0dXJuIEBcblxuXG4gIHNldE5vZGU6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY2xhc3MnLCAgICAgICBAZ2V0Tm9kZUNsYXNzXG4gICAgICAuc3R5bGUgJ3BhZGRpbmcnLCAgICAoZCkgPT4gaWYgKGQueDEtZC54MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nICYmIGQueTEtZC55MCA+IDIqQG9wdGlvbnMubm9kZXNQYWRkaW5nKSB0aGVuIEBvcHRpb25zLm5vZGVzUGFkZGluZysncHgnIGVsc2UgMFxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgKGQpIC0+IGlmIChkLngxLWQueDAgPT0gMCkgfHwgKGQueTEtZC55MCA9PSAwKSB0aGVuICdoaWRkZW4nIGVsc2UgJydcblxuICBzZXROb2RlRGltZW5zaW9uczogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5zdHlsZSAnbGVmdCcsICAgKGQpIC0+IGQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3RvcCcsICAgIChkKSAtPiBkLnkwICsgJ3B4J1xuICAgICAgLnN0eWxlICd3aWR0aCcsICAoZCkgLT4gZC54MS1kLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCAoZCkgLT4gZC55MS1kLnkwICsgJ3B4J1xuXG4gIHNldE5vZGVMYWJlbDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uc2VsZWN0KCdwJylcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiByZXR1cm4gaWYgZC52YWx1ZSA+IDI1IHRoZW4gJ3NpemUtbCcgZWxzZSBpZiBkLnZhbHVlIDwgMTAgdGhlbiAnc2l6ZS1zJyBlbHNlICcnXG4gICAgICAuaHRtbCAoZCkgPT4gZC5kYXRhW0BvcHRpb25zLmtleS5pZF1cblxuICBpc05vZGVMYWJlbFZpc2libGU6IChkKSA9PlxuICAgIHJldHVybiBkLngxLWQueDAgPiBAb3B0aW9ucy5taW5TaXplICYmIGQueTEtZC55MCA+IEBvcHRpb25zLm1pblNpemVcblxuICBnZXROb2RlQ2xhc3M6IChkKSAtPlxuICAgIHJldHVybiAnbm9kZSdcbiAgICAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuVHJlZW1hcEdyYXBoXG5cbiAgIyBvdmVyZHJpdmUgZGF0YSBQYXJzZXJcbiAgZGF0YVBhcnNlcjogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgICAjIHNldCBwYXJzZWREYXRhIGFycmF5XG4gICAgcGFyc2VkRGF0YSA9IFt7aWQ6ICdyJ31dICMgYWRkIHRyZWVtYXAgcm9vdFxuICAgICMgVE9ETyEhISBHZXQgY3VycmVudCBjb3VudHJ5ICYgYWRkIHNlbGVjdCBpbiBvcmRlciB0byBjaGFuZ2UgaXRcbiAgICBkYXRhX2NvdW50cnkgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGNvbnNvbGUubG9nIGRhdGFfY291bnRyeVswXVxuICAgIGlmIGRhdGFfY291bnRyeVswXVxuICAgICAgIyBzZXQgbWV0aG9kcyBvYmplY3RcbiAgICAgIG1ldGhvZHMgPSB7fVxuICAgICAgQG9wdGlvbnMubWV0aG9kc0tleXMuZm9yRWFjaCAoa2V5LGkpID0+XG4gICAgICAgIGlmIGRhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgICAgbWV0aG9kc1trZXldID1cbiAgICAgICAgICAgIGlkOiBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csICctJykucmVwbGFjZSgnKScsICcnKS5yZXBsYWNlKCcoJywgJycpXG4gICAgICAgICAgICBuYW1lOiBAb3B0aW9ucy5tZXRob2RzTmFtZXNbaV1cbiAgICAgICAgICAgIHZhbHVlOiArZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiVGhlcmUncyBubyBkYXRhIGZvciBcIiArIGtleVxuICAgICAgIyBmaWx0ZXIgbWV0aG9kcyB3aXRoIHZhbHVlIDwgNSUgJiBhZGQgdG8gT3RoZXIgbW9kZXJuIG1ldGhvZHNcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgaWYga2V5ICE9ICdPdGhlciBtb2Rlcm4gbWV0aG9kcycgYW5kIGtleSAhPSAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCcgYW5kIG1ldGhvZC52YWx1ZSA8IDVcbiAgICAgICAgICBtZXRob2RzWydPdGhlciBtb2Rlcm4gbWV0aG9kcyddLnZhbHVlICs9IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIGRlbGV0ZSBtZXRob2RzW2tleV1cbiAgICAgXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIHBhcnNlZERhdGEucHVzaFxuICAgICAgICAgIGlkOiBtZXRob2QuaWRcbiAgICAgICAgICByYXdfbmFtZTogbWV0aG9kLm5hbWVcbiAgICAgICAgICBuYW1lOiAnPHN0cm9uZz4nICsgbWV0aG9kLm5hbWUgKyAnPC9zdHJvbmc+PGJyLz4nICsgTWF0aC5yb3VuZChtZXRob2QudmFsdWUpICsgJyUnXG4gICAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIHBhcmVudDogJ3InXG4gICAgICBwYXJzZWREYXRhU29ydGVkID0gcGFyc2VkRGF0YS5zb3J0IChhLGIpIC0+IGlmIGEudmFsdWUgYW5kIGIudmFsdWUgdGhlbiBiLnZhbHVlLWEudmFsdWUgZWxzZSAxXG4gICAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cnknKS5odG1sIGNvdW50cnlfbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWFueS1tZXRob2QnKS5odG1sIE1hdGgucm91bmQoZGF0YV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgcGFyc2VkRGF0YVNvcnRlZFswXS5yYXdfbmFtZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnTm8gZGF0YSBjb3VudHJ5IGZvciAnK2NvdW50cnlfY29kZVxuICAgICAgIyBUT0RPISEhIFdoYXQgd2UgZG8gaWYgdGhlcmUncyBubyBkYXRhIGZvciB1c2VyJ3MgY291bnRyeVxuICAgIHJldHVybiBwYXJzZWREYXRhXG5cbiAgIyBvdmVyZHJpdmUgc2V0IGRhdGFcbiAgc2V0RGF0YTogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBvcmlnaW5hbERhdGEgPSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAZHJhd0dyYXBoKClcbiAgICAjQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIG5vZGUgY2xhc3NcbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUgbm9kZS0nK2QuaWRcblxuICAjIyMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb250YWluZXJPZmZzZXQ6IC0+XG4gICAgQCRlbC5jc3MoJ3RvcCcsICgkKHdpbmRvdykuaGVpZ2h0KCktQCRlbC5oZWlnaHQoKSkqMC41KVxuICAjIyMiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgZHJhd0dyYXBoOiAtPlxuXG4gICAgQHNldFNpemUoKVxuXG4gICAgIyBzZXQgJiBydW4gc2ltdWxhdGlvblxuICAgIEBzZXRTaW11bGF0aW9uKClcbiAgICBAcnVuU2ltdWxhdGlvbigpXG5cbiAgICAjIGRyYXcgZG90c1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhIEBkYXRhXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdCdcbiAgICAgIC5hdHRyICdpZCcsIChkKSA9PiAnZG90LScrZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICAuY2FsbCBAc2V0RG90XG4gICAgICAub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5kYXRhIEBkYXRhLmZpbHRlciAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiA3ODAwMDAwMFxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2RvdC1sYWJlbCdcbiAgICAgICAgIy5hdHRyICdkeCcsICcwLjc1ZW0nXG4gICAgICAgIC5hdHRyICdkeScsICcwLjI1ZW0nXG4gICAgICAgIC50ZXh0IChkKSA9PiBkW0BvcHRpb25zLmtleS5sYWJlbF1cbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cblxuXG4gIHNldFNpbXVsYXRpb246IC0+XG4gICAgIyBzZXR1cCBzaW11bGF0aW9uXG4gICAgZm9yY2VZID0gZDMuZm9yY2VZIChkKSA9PiBAeShkW0BvcHRpb25zLmtleS55XSlcbiAgICBmb3JjZVkuc3RyZW5ndGgoMSlcbiAgICBAc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbihAZGF0YSlcbiAgICAgIC5mb3JjZSAneCcsIGZvcmNlWVxuICAgICAgLmZvcmNlICd5JywgZDMuZm9yY2VYKEB3aWR0aCouNSlcbiAgICAgIC5mb3JjZSAnY29sbGlkZScsIGQzLmZvcmNlQ29sbGlkZSgoZCkgPT4gcmV0dXJuIGlmIEBzaXplIHRoZW4gZC5yYWRpdXMrMSBlbHNlIEBvcHRpb25zLmRvdFNpemUrMSlcbiAgICAgIC5zdG9wKClcblxuICBydW5TaW11bGF0aW9uOiAtPlxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IDM1MFxuICAgICAgQHNpbXVsYXRpb24udGljaygpXG4gICAgICArK2lcblxuICBzZXREb3Q6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAncicsICAoZCkgPT4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5hdHRyICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuXG4gIHNldERvdFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2N4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ2N5JywgQGdldFBvc2l0aW9uWVxuXG4gIHNldERvdExhYmVsUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAneCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICd5JywgQGdldFBvc2l0aW9uWVxuXG4gIGdldFBvc2l0aW9uWDogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnggZWxzZSBNYXRoLnJvdW5kIEB4KGRbQG9wdGlvbnMua2V5LnhdKVxuXG4gIGdldFBvc2l0aW9uWTogKGQpID0+IFxuICAgIHJldHVybiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnkgZWxzZSBNYXRoLnJvdW5kIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIGdldERvdEZpbGw6IChkKSA9PlxuICAgIHJldHVybiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdICNpZiBAb3B0aW9ucy5rZXkuY29sb3IgYW5kIEBvcHRpb25zLm1vZGUgPT0gMSB0aGVuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gZWxzZSAnI2UyNzIzYidcblxuICBzZXRNb2RlOiAobW9kZSkgLT5cbiAgICBAb3B0aW9ucy5tb2RlID0gbW9kZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5hdHRyICdmaWxsJywgQGdldERvdEZpbGxcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QtbGFiZWwnKVxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAwXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAxXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgI0B4ID0gZDMuc2NhbGVQb3coKVxuICAgICMgIC5leHBvbmVudCgwLjEyNSlcbiAgICAjICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeCA9IGQzLnNjYWxlTG9nKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdICMucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBbNTAwLCAxMDAwLCA1MDAwLCAxMDAwMCwgNTAwMDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJCdcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDUpJ1xuXG4gIGdldFNjYWxlWERvbWFpbjogPT5cbiAgICByZXR1cm4gWzI1MCwgODUwMDBdXG5cbiAgZ2V0U2NhbGVZRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueV0pXVxuXG4gIGdldFNpemVSYW5nZTogPT5cbiAgICByZXR1cm4gW0BvcHRpb25zLmRvdE1pblNpemUsIEBvcHRpb25zLmRvdE1heFNpemVdXG5cbiAgZ2V0U2l6ZURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnNpemVdKV1cblxuICBnZXRDb2xvckRvbWFpbjogPT5cbiAgICAjcmV0dXJuIFsxMDA1LCAzOTU1LCAxMjIzNSwgMTAwMDAwXVxuICAgIHJldHVybiBbMCwgMTAsIDIwLCAzMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMgLnRpY2sgdGV4dCcpXG4gICAgICAgIC5hdHRyICdkeCcsIDNcbiAgICAgICAgLmF0dHIgJ2R5JywgLTRcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gIHVzZVRyZWVtYXAgPSBudWxsXG4gIHVzZU1hcCA9IG51bGxcbiAgdXNlR3JhcGggPSBudWxsXG4gIHVubWV0bmVlZHNHcmFwaCA9IG51bGwgXG5cbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gIHNjcm9sbGFtYUluaXRpYWxpemVkID0gZmFsc2VcblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcIkVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcIkVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJJbXBsYW50ZVwiXG4gICAgICBcIklueWVjdGFibGVcIlxuICAgICAgXCJQw61sZG9yYVwiXG4gICAgICBcIkNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiQ29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIk3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIk3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJBbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIk90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwiTcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJJbXBsYW50XCJcbiAgICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgICBcIlBpbGxcIlxuICAgICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcIlRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIiAgICAgICAjIG9wcG9zZWRcbiAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiICAjIG9wcG9zZWRcbiAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiICAgICAgICAgICAjIG9wcG9zZWRcbiAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIiAgICAjIG9wcG9zZWRcbiAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCIgICAgICAgICAgICAgICAgICAgICAgIyBzYWx1ZFxuICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiICMgc2FsdWRcbiAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCknMgcHJvY2Vzc2VzXCIgICAgICAjIHNhbHVkXG4gICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gICMgU2Nyb2xsYW1hIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBTY3JvbGxhbWEgPSAoaWQpIC0+XG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytpZClcbiAgICBncmFwaGljICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIGNoYXJ0ICAgICA9IGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICB0ZXh0ICAgICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLXRleHQnKVxuICAgIHN0ZXBzICAgICA9IHRleHQuc2VsZWN0QWxsKCcuc3RlcCcpXG5cbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuXG4gICAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgICBoYW5kbGVSZXNpemUgPSAtPlxuICAgICAgd2lkdGggPSBncmFwaGljLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAjTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgICBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgICAgZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICAgIGNoYXJ0XG4gICAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICAgIHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgICBoYW5kbGVDb250YWluZXJFbnRlciA9IChlKSAtPlxuICAgICAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAgIGhhbmRsZUNvbnRhaW5lckV4aXQgPSAoZSkgLT5cbiAgICAgICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIGhhbmRsZVN0ZXBFbnRlciA9IChlKSAtPlxuICAgICAgI8KgY29uc29sZS5sb2cgZVxuICAgICAgJHN0ZXAgPSAkKGUuZWxlbWVudClcbiAgICAgIGluc3RhbmNlID0gJHN0ZXAuZGF0YSgnaW5zdGFuY2UnKVxuICAgICAgc3RlcCA9ICRzdGVwLmRhdGEoJ3N0ZXAnKVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMCBcbiAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMScsIHN0ZXBcbiAgICAgICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgc3RlcCAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMlxuICAgICAgICBpZiB1c2VHcmFwaCBhbmQgc3RlcCA+IDBcbiAgICAgICAgICBkYXRhID0gWzYzLCA4OCwgMTAwXSAjIDYzLCA2MysyNSwgNjMrMjUrMTJcbiAgICAgICAgICBmcm9tID0gaWYgc3RlcCA+IDEgdGhlbiBkYXRhW3N0ZXAtMl0gZWxzZSAwXG4gICAgICAgICAgdG8gPSBkYXRhW3N0ZXAtMV1cbiAgICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQgPj0gZnJvbSBhbmQgZCA8IHRvXG4gICAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK3N0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDInLCBzdGVwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDNcbiAgICAgICAgaWYgdW5tZXRuZWVkc0dyYXBoIGFuZCB1bm1ldG5lZWRzR3JhcGgub3B0aW9ucy5tb2RlICE9IHN0ZXBcbiAgICAgICAgICB1bm1ldG5lZWRzR3JhcGguc2V0TW9kZSBzdGVwXG5cbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIGhhbmRsZVJlc2l6ZSgpXG5cbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycraWQgICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJy5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgdGV4dDogICAgICAgJy5zY3JvbGwtdGV4dCcgICAgICAgICMgdGhlIHN0ZXAgY29udGFpbmVyXG4gICAgICAgIHN0ZXA6ICAgICAgICcuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBoYW5kbGVDb250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIGhhbmRsZUNvbnRhaW5lckV4aXQgXG5cbiAgICAjIEVuc3VyZSB0byBzZXR1cCBvblN0ZXBFbnRlciBoYW5kbGVyIG9ubHkgb25jZVxuICAgIHVubGVzcyBzY3JvbGxhbWFJbml0aWFsaXplZFxuICAgICAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBzY3JvbGxlci5vblN0ZXBFbnRlciAgaGFuZGxlU3RlcEVudGVyIFxuICAgICAgXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgaGFuZGxlUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcidcbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IChncmFwaFdpZHRoIC8gMjApIC0gMTBcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyKClcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNfZ25pLCBjb3VudHJpZXNfcG9wdWxhdGlvbikgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3VubWV0LW5lZWRzLWdkcC1jb250YWluZXItZ3JhcGgnXG5cbiAgICAjIHBhcnNlIGRhdGFcbiAgICBkYXRhID0gW11cbiAgICBkYXRhX3VubWV0bmVlZHMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGNvdW50cnlfZ25pID0gY291bnRyaWVzX2duaS5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGNvdW50cnlfcG9wID0gY291bnRyaWVzX3BvcHVsYXRpb24uZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBpZiBjb3VudHJ5X2duaVswXSBhbmQgY291bnRyeV9nbmlbMF1bJzIwMTYnXVxuICAgICAgICAgIGRhdGEucHVzaFxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE3J11cbiAgICAgICAgICAgIG5hbWU6IGNvdW50cnlfZ25pWzBdLm5hbWVcbiAgICAgICAgICAgIHJlZ2lvbjogY291bnRyeV9nbmlbMF0ucmVnaW9uXG4gICAgICAgICAgICBwb3B1bGF0aW9uOiBjb3VudHJ5X3BvcFswXVsnMjAxNSddXG4gICAgICAgICAgICBnbmk6IGNvdW50cnlfZ25pWzBdWycyMDE2J11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ05vIEdOSSBvciBQb3B1bGF0aW9uIGRhdGEgZm9yIHRoaXMgY291bnRyeScsIGQuY29kZSwgY291bnRyeV9nbmlbMF1cbiAgICAjIGNsZWFyIGl0ZW1zIHdpdGhvdXQgdW5tZXQtbmVlZHMgdmFsdWVzXG4gICAgI2RhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5nZHAgYW5kIGRbJ3VubWV0LW5lZWRzJ10gXG4gICAgIyMjXG4gICAgdW5tZXROZWVkc0dkcEdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdFVubWV0TmVlZHNHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICdnbmknXG4gICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICBjb2xvcjogJ2duaScgIydyZWdpb24nXG4gICAgICAgIHNpemU6ICdwb3B1bGF0aW9uJ1xuICAgICMgc2V0IGRhdGFcbiAgICAjIyNcbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAnZ25pJ1xuICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgbGFiZWw6ICduYW1lJ1xuICAgICAgICBzaXplOiAncG9wdWxhdGlvbidcbiAgICAgICAgY29sb3I6ICd2YWx1ZScgIydnbmknXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAxMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG5cbiAgICAjIHBhcnNlIGRhdGEgdXNlXG4gICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgbWV0aG9kc19rZXlzLmZvckVhY2ggKGtleSxpKSAtPlxuICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgaWQ6IGlcbiAgICAgICAgICBuYW1lOiBtZXRob2RzX25hbWVzW2xhbmddW2ldXG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgICNkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG5cbiAgICAjIFNldCB1c2UgbWFwXG4gICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiAyMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGxlZ2VuZDogdHJ1ZVxuICAgICAgbGFuZzogbGFuZ1xuICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcbiAgICB1c2VNYXAub25SZXNpemUoKVxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZU1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIEdyYXBoc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc1JlYXNvbnMgPSAoZGF0YV9yZWFzb25zLCBjb3VudHJpZXMpIC0+XG5cbiAgICByZWFzb25IZWFsdGggPSBbXVxuICAgIHJlYXNvbk5vdFNleCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kID0gW11cbiAgICByZWFzb25PcHBvc2VkUmVsaWdpb3VzID0gW11cblxuICAgIHJlYXNvbnNLZXlzID0gT2JqZWN0LmtleXMocmVhc29uc19uYW1lcylcblxuICAgICMgcGFyc2UgcmVhc29ucyBkYXRhXG4gICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICAjIyNcbiAgICAgIHJlYXNvbnNLZXlzLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgZFtyZWFzb25dID0gK2RbcmVhc29uXVxuICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICMjI1xuICAgICAgcmVhc29uSGVhbHRoLnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLm8rZC5wK2QudCAjIGhlYWx0aCBjb25jZXJucyArIGZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJucyArIGludGVyZmVyZXMgd2l0aCBib2R5wpJzIHByb2Nlc3Nlc1xuICAgICAgcmVhc29uTm90U2V4LnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmIgIyBub3QgaGF2aW5nIHNleFxuICAgICAgcmVhc29uT3Bwb3NlZC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5pK2QuaitkLmsrZC5sICPCoHJlc3BvbmRlbnQgb3Bwb3NlZCArIGh1c2JhbmQvcGFydG5lciBvcHBvc2VkICsgb3RoZXJzIG9wcG9zZWQgKyByZWxpZ2lvdXMgcHJvaGliaXRpb25cbiAgICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnB1c2hcbiAgICAgICAgbmFtZTogZC5uYW1lXG4gICAgICAgIHZhbHVlOiBkLmkgI8KgcmVzcG9uZGVudCBvcHBvc2VkXG4gICAgICByZWFzb25PcHBvc2VkSHVzYmFuZC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5qICPCoHJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFxuICAgICAgcmVhc29uT3Bwb3NlZFJlbGlnaW91cy5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5sICPCoHJlbGlnaW91cyBwcm9oaWJpdGlvblxuXG4gICAgc29ydEFycmF5ID0gKGEsYikgLT4gcmV0dXJuIGIudmFsdWUtYS52YWx1ZVxuICAgIHJlYXNvbkhlYWx0aC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk5vdFNleC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWQuc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkUmVzcG9uZGVudC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWRIdXNiYW5kLnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZFJlbGlnaW91cy5zb3J0IHNvcnRBcnJheVxuXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtaGVhbHRoJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbkhlYWx0aC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJykuc2V0RGF0YSByZWFzb25PcHBvc2VkLnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1ub3Qtc2V4JyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnKS5zZXREYXRhIHJlYXNvbk5vdFNleC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1yZXNwb25kZW50JyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50LnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLWh1c2JhbmQnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZSdcbiAgICAgIHhBeGlzOiBbNTAsIDEwMF0pLnNldERhdGEgcmVhc29uT3Bwb3NlZEh1c2JhbmQuc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtcmVsaWdpb3VzJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMuc2xpY2UoMCw1KVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgVHJlZW5hcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwID0gKGRhdGFfdXNlKSAtPlxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIHNldHVwU2Nyb2xsYW1hICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG4gICAgIyBzZXR1cCB0cmVlbWFwXG4gICAgdXNlVHJlZW1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHZhbHVlOiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgIG1ldGhvZHNLZXlzOiBtZXRob2RzX2tleXNcbiAgICAgIG1ldGhvZHNOYW1lczogbWV0aG9kc19uYW1lc1tsYW5nXVxuICAgICMgc2V0IGRhdGFcbiAgICB1c2VUcmVlbWFwLnNldERhdGEgZGF0YV91c2UsIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAjIHNldCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZVRyZWVtYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgQXBwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29udHJhY2VwdGl2ZXNBcHAgPSAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zKSAtPlxuICAgICPCoHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy1hcHAtY29udGFpbmVyJ1xuICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAgLnNlbGVjdC1jb3VudHJ5JylcbiAgICAgIC5jaGFuZ2UgLT5cbiAgICAgICAgY291bnRyeV9jb2RlID0gJCh0aGlzKS52YWwoKVxuICAgICAgICBjb25zb2xlLmxvZyAnY2hhbmdlJywgY291bnRyeV9jb2RlXG4gICAgICAgICMgVXNlXG4gICAgICAgIGRhdGFfdXNlX2NvdW50cnkgPSBkYXRhX3VzZS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91c2VfY291bnRyeSBhbmQgZGF0YV91c2VfY291bnRyeVswXVxuICAgICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IG1ldGhvZHNfa2V5cy5tYXAgKGtleSwgaSkgLT4geyduYW1lJzogbWV0aG9kc19uYW1lc1tsYW5nXVtpXSwgJ3ZhbHVlJzogK2RhdGFfdXNlX2NvdW50cnlbMF1ba2V5XX1cbiAgICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBjb3VudHJ5X21ldGhvZHMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCtkYXRhX3VzZV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG4gICAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgICBkYXRhX3VubWV0bmVlZHNfY291bnRyeSA9IGRhdGFfdW5tZXRuZWVkcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91bm1ldG5lZWRzX2NvdW50cnkgYW5kIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK2RhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdWycyMDE3J10pKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG4gICAgICAgICMgUmVhc29uc1xuICAgICAgICBkYXRhX3JlYXNvbnNfY291bnRyeSA9IGRhdGFfcmVhc29ucy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV9yZWFzb25zX2NvdW50cnkgYW5kIGRhdGFfcmVhc29uc19jb3VudHJ5WzBdXG4gICAgICAgICAgcmVhc29ucyA9IE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpLm1hcCAocmVhc29uKSAtPiB7J25hbWUnOiByZWFzb25zX25hbWVzW3JlYXNvbl0sICd2YWx1ZSc6ICtkYXRhX3JlYXNvbnNfY291bnRyeVswXVtyZWFzb25dfVxuICAgICAgICAgIHJlYXNvbnMgPSByZWFzb25zLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZChyZWFzb25zWzBdLnZhbHVlKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcbiAgICAgIC52YWwgdXNlckNvdW50cnkuY29kZVxuICAgICAgLnRyaWdnZXIgJ2NoYW5nZSdcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgIyAhISEgVE9ETyAtPiBVc2UgYSBzaW5nbGUgY291bnRyaWVzIGZpbGUgd2l0aCBnbmkgJiBwb3B1bGF0aW9uIGluZm8gXG4gIGQzLnF1ZXVlKClcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktJytsYW5nKycuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtcG9wdWxhdGlvbi0nK2xhbmcrJy5jc3YnXG4gICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb24sIG1hcCwgbG9jYXRpb24pIC0+XG5cbiAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgZWxzZVxuICAgICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG4gICAgICAjdGVzdCBvdGhlciBjb3VudHJpZXNcbiAgICAgICN1c2VyQ291bnRyeS5jb2RlID0gJ1JVUydcbiAgICAgICN1c2VyQ291bnRyeS5uYW1lID0gJ1J1c2lhJ1xuXG4gICAgICAjIGFkZCBjb3VudHJ5IElTTyAzMTY2LTEgYWxwaGEtMyBjb2RlIHRvIGRhdGFfcmVhc29uc1xuICAgICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUyID09IGQuY29kZVxuICAgICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgICAgZC5jb2RlID0gaXRlbVswXS5jb2RlXG4gICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgT2JqZWN0LmtleXMocmVhc29uc19uYW1lcykuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICAgICAgZFtyZWFzb25dID0gMTAwKmRbcmVhc29uXVxuICAgICAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgICAgIGRlbGV0ZSBkLmNvdW50cnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUud2FybiAnTm8gY291bnRyeSBkYXRhIGZvciAnK2QuY29kZVxuXG4gICAgICBjb25zb2xlLmxvZyB1c2VyQ291bnRyeVxuXG4gICAgICBpZiAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwIGRhdGFfdXNlXG5cbiAgICAgIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyBkYXRhX3VzZSwgY291bnRyaWVzLCBtYXBcblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNfZ25pLCBjb3VudHJpZXNfcG9wdWxhdGlvblxuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29udHJhY2VwdGl2ZXNSZWFzb25zIGRhdGFfcmVhc29ucywgY291bnRyaWVzXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnNcblxuKSBqUXVlcnlcbiJdfQ==
