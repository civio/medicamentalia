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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwiYmFyLWhvcml6b250YWwtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztBQUNYLGFBQU87SUFSSTs7d0JBY2IsTUFBQSxHQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsR0FBRCxHQUFPLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFmLENBQWtCLENBQUMsTUFBbkIsQ0FBMEIsS0FBMUIsQ0FDTCxDQUFDLElBREksQ0FDQyxPQURELEVBQ1UsSUFBQyxDQUFBLGNBRFgsQ0FFTCxDQUFDLElBRkksQ0FFQyxRQUZELEVBRVcsSUFBQyxDQUFBLGVBRlo7YUFHUCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFZLEdBQVosQ0FDWCxDQUFDLElBRFUsQ0FDTCxXQURLLEVBQ1EsWUFBQSxHQUFlLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQS9CLEdBQXNDLEdBQXRDLEdBQTRDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQTVELEdBQWtFLEdBRDFFO0lBSlA7O3dCQU9SLFFBQUEsR0FBVSxTQUFDLEdBQUQ7TUFDUixFQUFFLENBQUMsR0FBSCxDQUFPLEdBQVAsRUFBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLElBQVI7VUFDVixLQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxhQUFiO2lCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDtRQUZVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0FBR0EsYUFBTztJQUpDOzt3QkFNVixPQUFBLEdBQVMsU0FBQyxJQUFEO01BQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFDUixJQUFDLENBQUEsVUFBRCxDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVo7UUFDRSxJQUFDLENBQUEsVUFBRCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLFdBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7TUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxlQUFiO0FBQ0EsYUFBTztJQVJBOzt3QkFXVCxVQUFBLEdBQVksU0FBQyxJQUFEO0FBQ1YsYUFBTztJQURHOzt3QkFJWixRQUFBLEdBQVUsU0FBQTtBQUNSLGFBQU87SUFEQzs7d0JBUVYsU0FBQSxHQUFXLFNBQUE7QUFDVCxhQUFPO0lBREU7O3dCQUdYLFVBQUEsR0FBWSxTQUFBO01BRVYsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BQ0EsSUFBQyxDQUFBLENBQUMsQ0FBQyxNQUFILENBQVUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFWO01BRUEsSUFBRyxJQUFDLENBQUEsS0FBSjtRQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixHQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDaUIsUUFEakIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsZ0JBRlQsQ0FHRSxDQUFDLElBSEgsQ0FHUSxJQUFDLENBQUEsS0FIVCxFQURGOztNQU1BLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLFFBRGpCLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLGdCQUZULENBR0UsQ0FBQyxJQUhILENBR1EsSUFBQyxDQUFBLEtBSFQsRUFERjs7QUFLQSxhQUFPO0lBaEJHOzt3QkFtQlosY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLENBQUQsRUFBSSxJQUFDLENBQUEsS0FBTDtJQURPOzt3QkFJaEIsY0FBQSxHQUFnQixTQUFBO0FBQ2QsYUFBTyxDQUFDLElBQUMsQ0FBQSxNQUFGLEVBQVUsQ0FBVjtJQURPOzt3QkFJaEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTztJQURROzt3QkFJakIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTztJQURROzt3QkFJakIsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPO0lBREc7O3dCQU9aLFNBQUEsR0FBVyxTQUFDLE1BQUQ7TUFDVCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxhQUFiLEVBQTRCLE1BQTVCLENBQWQ7QUFDQSxhQUFPO0lBRkU7O3dCQUlYLFdBQUEsR0FBYSxTQUFBO01BRVgsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLFNBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLE9BRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsUUFIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUFDLENBQUEsZUFKVDthQU1BLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixlQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxPQURULENBRUEsQ0FBQyxLQUZELENBQUEsQ0FFUSxDQUFDLE1BRlQsQ0FFZ0IsTUFGaEIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxPQUhSLEVBR2lCLGNBSGpCLENBSUUsQ0FBQyxJQUpILENBSVEsYUFKUixFQUl1QixTQUFDLENBQUQ7UUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFVBQXBCO2lCQUFvQyxTQUFwQztTQUFBLE1BQWtELElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxPQUFkO2lCQUEyQixNQUEzQjtTQUFBLE1BQUE7aUJBQXNDLFFBQXRDOztNQUF6RCxDQUp2QixDQUtFLENBQUMsSUFMSCxDQUtRLElBTFIsRUFLYyxTQUFDLENBQUQ7UUFBTyxJQUFHLENBQUMsQ0FBQyxXQUFGLEtBQWlCLFlBQXBCO2lCQUFzQyxVQUF0QztTQUFBLE1BQUE7aUJBQXFELEVBQXJEOztNQUFQLENBTGQsQ0FNRSxDQUFDLElBTkgsQ0FNUSxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUM7TUFBVCxDQU5SLENBT0UsQ0FBQyxJQVBILENBT1EsSUFBQyxDQUFBLGdCQVBUO0lBUlc7O3dCQWlCYixlQUFBLEdBQWlCLFNBQUMsT0FBRDthQUNmLE9BQ0UsQ0FBQyxJQURILENBQ1EsSUFEUixFQUNjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsRUFBdEM7V0FBQSxNQUFBO21CQUE2QyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUMsQ0FBQyxLQUFMLEVBQTdDOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURkLENBRUUsQ0FBQyxJQUZILENBRVEsSUFGUixFQUVjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUF0QztXQUFBLE1BQUE7bUJBQXVELEVBQXZEOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZkLENBR0UsQ0FBQyxJQUhILENBR1EsSUFIUixFQUdjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxDQUFDLENBQUMsV0FBRixLQUFpQixZQUFwQjttQkFBc0MsS0FBQyxDQUFBLE1BQXZDO1dBQUEsTUFBQTttQkFBa0QsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUFsRDs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIZCxDQUlFLENBQUMsSUFKSCxDQUlRLElBSlIsRUFJYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdEM7V0FBQSxNQUFBO21CQUF1RCxLQUFDLENBQUEsT0FBeEQ7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmQ7SUFEZTs7d0JBT2pCLGdCQUFBLEdBQWtCLFNBQUMsT0FBRDthQUNoQixPQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7WUFBdUMsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLE9BQWQ7cUJBQTJCLEtBQUMsQ0FBQSxNQUE1QjthQUFBLE1BQUE7cUJBQXVDLEVBQXZDO2FBQXZDO1dBQUEsTUFBQTttQkFBdUYsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFDLENBQUMsS0FBTCxFQUF2Rjs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEYixDQUVFLENBQUMsSUFGSCxDQUVRLEdBRlIsRUFFYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsQ0FBQyxDQUFDLFdBQUYsS0FBaUIsWUFBcEI7bUJBQXNDLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBQyxDQUFDLEtBQUwsRUFBdEM7V0FBQSxNQUFBO21CQUF1RCxLQUFDLENBQUEsT0FBeEQ7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmI7SUFEZ0I7O3dCQVNsQixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEscUJBQUQsQ0FBQTtBQUNBLGFBQU87SUFIQzs7d0JBS1YsYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFHLElBQUMsQ0FBQSxHQUFKO1FBQ0UsSUFBQyxDQUFBLGNBQUQsR0FBbUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQUE7UUFDbkIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLE9BQU8sQ0FBQztRQUM5QyxJQUFDLENBQUEsS0FBRCxHQUFtQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFsQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM1RSxJQUFDLENBQUEsTUFBRCxHQUFtQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFuQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUo5RTs7QUFLQSxhQUFPO0lBTk07O3dCQVNmLHFCQUFBLEdBQXVCLFNBQUE7TUFFckIsSUFBRyxJQUFDLENBQUEsR0FBSjtRQUNFLElBQUMsQ0FBQSxHQUNDLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDa0IsSUFBQyxDQUFBLGNBRG5CLENBRUUsQ0FBQyxJQUZILENBRVEsUUFGUixFQUVrQixJQUFDLENBQUEsZUFGbkIsRUFERjs7TUFLQSxJQUFHLElBQUMsQ0FBQSxDQUFKO1FBQ0UsSUFBQyxDQUFBLENBQUMsQ0FBQyxLQUFILENBQVMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFULEVBREY7O01BRUEsSUFBRyxJQUFDLENBQUEsQ0FBSjtRQUNFLElBQUMsQ0FBQSxDQUFDLENBQUMsS0FBSCxDQUFTLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBVCxFQURGOztNQUdBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUlBLElBQUcsSUFBQyxDQUFBLEtBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsU0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsZ0JBRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsS0FGVCxFQURGOztNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLElBQUMsQ0FBQSxlQURUO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGVBQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGdCQURUO0FBRUEsYUFBTztJQXpCYzs7d0JBMkJ2QixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLGNBQUEsR0FBZSxJQUFDLENBQUEsTUFBaEIsR0FBdUIsR0FBbkQ7SUFEZ0I7O3dCQUdsQixnQkFBQSxHQUFrQixTQUFDLFNBQUQ7YUFDaEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmLEVBQTRCLFlBQUEsR0FBYSxJQUFDLENBQUEsS0FBZCxHQUFvQixLQUFoRDtJQURnQjs7d0JBT2xCLFFBQUEsR0FBVSxTQUFBO0FBQ1IsYUFBTyxDQUFFLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYjtJQUREOzt3QkFHVixRQUFBLEdBQVUsU0FBQTtBQUNSLGFBQU8sQ0FBRSxDQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7SUFERDs7Ozs7QUFyTlo7OztBQ0FBO0FBQUEsTUFBQTs7OztFQUFNLE1BQU0sQ0FBQzs7O0lBTUUsNEJBQUMsRUFBRCxFQUFLLE9BQUw7O01BRVgsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsT0FBTyxDQUFDLEtBQVIsSUFBaUIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxHQUFiO01BQ2pDLG9EQUFNLEVBQU4sRUFBVSxPQUFWO0FBQ0EsYUFBTztJQUpJOztpQ0FXYixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQWYsQ0FDWCxDQUFDLElBRFUsQ0FDTCxPQURLLEVBQ0ksc0JBREo7SUFEUDs7aUNBSVIsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQ1gsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBRixHQUFvQixDQUFDLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiO1FBRFo7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7QUFFQSxhQUFPO0lBSEc7O2lDQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsYUFBTztJQURFOztpQ0FHWCxVQUFBLEdBQVksU0FBQTtNQUNWLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFaO1FBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE9BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQURqQixDQUVBLENBQUMsS0FGRCxDQUFBLENBRVEsQ0FBQyxNQUZULENBRWdCLEtBRmhCLENBR0UsQ0FBQyxJQUhILENBR1EsT0FIUixFQUdpQixNQUhqQixDQUlFLENBQUMsS0FKSCxDQUlTLE1BSlQsRUFJaUIsU0FBQyxDQUFEO2lCQUFPLENBQUEsR0FBRTtRQUFULENBSmpCLEVBREY7O0FBTUEsYUFBTztJQVBHOztpQ0FTWixTQUFBLEdBQVcsU0FBQTtNQUNULE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosRUFBbUMsSUFBQyxDQUFBLElBQXBDO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE1BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixLQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsZUFIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUFDLENBQUEsT0FKVDtBQUtBLGFBQU87SUFSRTs7aUNBV1gsT0FBQSxHQUFTLFNBQUMsT0FBRDtNQUNQLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBaEI7UUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiO1VBQVQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO1FBQ0EsT0FBTyxDQUFDLE1BQVIsQ0FBZSxLQUFmLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixXQURqQixDQUVFLENBQUMsSUFGSCxDQUVRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBYjtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSLEVBRkY7O2FBS0EsT0FBTyxDQUFDLE1BQVIsQ0FBZSxLQUFmLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixLQURqQixDQUVFLENBQUMsS0FGSCxDQUVTLE9BRlQsRUFFa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDZCxpQkFBTyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFGLEdBQWtCO1FBRFg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmxCLENBSUUsQ0FBQyxNQUpILENBSVUsTUFKVixDQUtJLENBQUMsSUFMTCxDQUtVLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBYixDQUFBLEdBQThCO1FBQXJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxWO0lBTk87Ozs7S0FqRDZCLE1BQU0sQ0FBQztBQUEvQzs7O0FDQUE7QUFBQSxNQUFBOzs7O0VBQU0sTUFBTSxDQUFDOzs7SUFNRSxrQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7Ozs7O01BRVgsMENBQU0sRUFBTixFQUFVLE9BQVY7TUFDQSxJQUFDLENBQUEsV0FBRCxHQUFpQixFQUFFLENBQUMsTUFBSCxDQUFVLE1BQVY7TUFDakIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWO0FBQ2pCLGFBQU87SUFMSTs7dUJBV2IsTUFBQSxHQUFRLFNBQUE7TUFDTixtQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsVUFBVjtJQUZOOzt1QkFJUixTQUFBLEdBQVcsU0FBQTtNQUVULElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBRSxDQUFDLGVBQUgsQ0FBbUIsRUFBRSxDQUFDLGtCQUF0QjtBQUNULGFBQU87SUFIRTs7dUJBS1gsUUFBQSxHQUFVLFNBQUMsUUFBRCxFQUFXLE9BQVg7TUFDUixFQUFFLENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDaUIsUUFEakIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxFQUFFLENBQUMsSUFGWixFQUVrQixPQUZsQixDQUdFLENBQUMsS0FISCxDQUdTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEdBQWQ7VUFDTCxLQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxhQUFiO2lCQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLEdBQWY7UUFGSztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIVDtBQU1BLGFBQU87SUFQQzs7dUJBU1YsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLEdBQVA7TUFDUCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtNQUNSLElBQUMsQ0FBQSxjQUFELENBQUE7TUFDQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBWjtRQUNFLElBQUMsQ0FBQSxVQUFELENBQUEsRUFERjs7TUFFQSxJQUFDLENBQUEsU0FBRCxDQUFXLEdBQVg7QUFDQSxhQUFPO0lBTkE7O3VCQVFULGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjO1FBQUMsQ0FBRCxFQUFJLEVBQUUsQ0FBQyxHQUFILENBQU8sSUFBQyxDQUFBLElBQVIsRUFBYyxTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDO1FBQVQsQ0FBZCxDQUFKO09BQWQ7QUFDQSxhQUFPO0lBRk87O3VCQUloQixVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxjQUFBLEdBQWlCO01BQ2pCLFVBQUEsR0FBYSxJQUFDLENBQUEsYUFBRCxDQUFBO01BQ2IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FDUixDQUFDLElBRE8sQ0FDRixPQURFLEVBQ08sUUFEUCxDQUVSLENBQUMsSUFGTyxDQUVGLElBQUMsQ0FBQSxpQkFGQztNQUlWLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUNFLENBQUMsSUFESCxDQUNRLFVBRFIsQ0FFRSxDQUFDLEtBRkgsQ0FBQSxDQUVVLENBQUMsTUFGWCxDQUVrQixNQUZsQixDQUdJLENBQUMsSUFITCxDQUdVLEdBSFYsRUFHZSxTQUFDLENBQUQsRUFBRyxDQUFIO2VBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxjQUFBLEdBQWUsQ0FBQyxDQUFBLEdBQUUsQ0FBQyxVQUFVLENBQUMsTUFBWCxHQUFrQixDQUFuQixDQUFILENBQTFCO01BQVQsQ0FIZixDQUlJLENBQUMsSUFKTCxDQUlVLE9BSlYsRUFJbUIsY0FKbkIsQ0FLSSxDQUFDLElBTEwsQ0FLVSxRQUxWLEVBS29CLENBTHBCLENBTUksQ0FBQyxJQU5MLENBTVUsTUFOVixFQU1rQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsS0FBRCxDQUFPLENBQVA7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FObEI7TUFPQSxVQUFVLENBQUMsS0FBWCxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLENBQ0UsQ0FBQyxJQURILENBQ1EsVUFEUixDQUVFLENBQUMsS0FGSCxDQUFBLENBRVUsQ0FBQyxNQUZYLENBRWtCLE1BRmxCLENBR0ksQ0FBQyxJQUhMLENBR1UsR0FIVixFQUdlLFNBQUMsQ0FBRCxFQUFHLENBQUg7ZUFBUyxJQUFJLENBQUMsS0FBTCxDQUFXLGNBQUEsR0FBZSxDQUFDLENBQUEsR0FBRSxHQUFGLEdBQU0sQ0FBQyxVQUFVLENBQUMsTUFBWCxHQUFrQixDQUFuQixDQUFQLENBQTFCO01BQVQsQ0FIZixDQUlJLENBQUMsSUFKTCxDQUlVLEdBSlYsRUFJZSxFQUpmLENBS0ksQ0FBQyxJQUxMLENBS1UsYUFMVixFQUt5QixPQUx6QixDQU1JLENBQUMsSUFOTCxDQU1VLElBQUMsQ0FBQSxlQU5YO0lBaEJVOzt1QkF3QlosU0FBQSxHQUFXLFNBQUMsR0FBRDtNQUVULElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFsQztNQUNiLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBWCxHQUFzQixJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFwQixDQUEyQixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsRUFBRixLQUFRO01BQWYsQ0FBM0I7TUFFdEIsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUFFLENBQUMsY0FBSCxDQUFBO01BQ2QsSUFBQyxDQUFBLGlCQUFELENBQUE7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FDTixDQUFDLFVBREssQ0FDTSxJQUFDLENBQUEsVUFEUDtNQUdSLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixVQUFyQixDQUNBLENBQUMsSUFERCxDQUNNLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFEakIsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixNQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLElBSFIsRUFHYyxTQUFDLENBQUQ7ZUFBTyxVQUFBLEdBQVcsQ0FBQyxDQUFDO01BQXBCLENBSGQsQ0FJRSxDQUFDLElBSkgsQ0FJUSxPQUpSLEVBSWlCLFNBQUMsQ0FBRDtlQUFPO01BQVAsQ0FKakIsQ0FLRSxDQUFDLElBTEgsQ0FLUSxNQUxSLEVBS2dCLElBQUMsQ0FBQSxlQUxqQixDQU1FLENBQUMsSUFOSCxDQU1RLGNBTlIsRUFNd0IsQ0FOeEIsQ0FPRSxDQUFDLElBUEgsQ0FPUSxRQVBSLEVBT2tCLElBQUMsQ0FBQSxlQVBuQixDQVFFLENBQUMsSUFSSCxDQVFRLEdBUlIsRUFRYSxJQUFDLENBQUEsSUFSZDtNQVVBLElBQUcsSUFBQyxDQUFBLFFBQUo7UUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsVUFBckIsQ0FDRSxDQUFDLEVBREgsQ0FDTSxXQUROLEVBQ21CLElBQUMsQ0FBQSxXQURwQixDQUVFLENBQUMsRUFGSCxDQUVNLFdBRk4sRUFFbUIsSUFBQyxDQUFBLFdBRnBCLENBR0UsQ0FBQyxFQUhILENBR00sVUFITixFQUdrQixJQUFDLENBQUEsVUFIbkIsRUFERjs7TUFNQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxlQUFiO0FBQ0EsYUFBTztJQTVCRTs7dUJBOEJYLFdBQUEsR0FBYSxTQUFDLElBQUQ7TUFDWCxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtNQUNSLElBQUMsQ0FBQSxjQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsVUFBckIsQ0FDRSxDQUFDLFVBREgsQ0FBQSxDQUVJLENBQUMsSUFGTCxDQUVVLE1BRlYsRUFFa0IsSUFBQyxDQUFBLGVBRm5CLENBR0ksQ0FBQyxJQUhMLENBR1UsUUFIVixFQUdvQixJQUFDLENBQUEsZUFIckI7SUFIVzs7dUJBUWIscUJBQUEsR0FBdUIsU0FBQTtNQUNyQixrREFBQTtNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLElBQUMsQ0FBQSxVQUFsQjtNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixVQUFyQixDQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFDYSxJQUFDLENBQUEsSUFEZDtNQUVBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFaO1FBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLGlCQUFkLEVBREY7O0FBRUEsYUFBTztJQVJjOzt1QkFVdkIsaUJBQUEsR0FBbUIsU0FBQTthQUNqQixJQUFDLENBQUEsVUFDQyxDQUFDLE9BREgsQ0FDVyxDQUFDLElBQUMsQ0FBQSxLQUFGLEVBQVMsSUFBQyxDQUFBLE1BQVYsQ0FEWCxFQUM4QixJQUFDLENBQUEsU0FEL0IsQ0FFRSxDQUFDLEtBRkgsQ0FFWSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxDQUFBLEdBQXNCLEdBRmxDLENBR0UsQ0FBQyxTQUhILENBR2EsQ0FBQyxJQUFDLENBQUEsS0FBRCxHQUFPLElBQVIsRUFBYyxJQUFDLENBQUEsTUFBRCxHQUFRLEdBQXRCLENBSGI7SUFEaUI7O3VCQU1uQixlQUFBLEdBQWlCLFNBQUMsQ0FBRDtBQUNmLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLFFBQUYsS0FBYyxDQUFDLENBQUM7TUFBdkIsQ0FBYjtNQUNELElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBVDtlQUFpQixJQUFDLENBQUEsS0FBRCxDQUFPLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFoQixFQUFqQjtPQUFBLE1BQUE7ZUFBNkMsT0FBN0M7O0lBRlE7O3VCQUlqQixpQkFBQSxHQUFtQixTQUFDLE9BQUQ7YUFDakIsT0FBTyxDQUFDLElBQVIsQ0FBYSxXQUFiLEVBQTBCLFlBQUEsR0FBYSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxLQUFELEdBQU8sR0FBbEIsQ0FBYixHQUFvQyxHQUFwQyxHQUF3QyxDQUFDLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbEIsQ0FBeEMsR0FBK0QsR0FBekY7SUFEaUI7O3VCQUduQixhQUFBLEdBQWUsU0FBQTtBQUNiLGFBQU8sRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQTVCO0lBRE07O3VCQUdmLGVBQUEsR0FBaUIsU0FBQyxDQUFEO0FBQ2YsYUFBTztJQURROzt1QkFHakIsV0FBQSxHQUFhLFNBQUMsQ0FBRDtBQUNYLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLFFBQUYsS0FBYyxDQUFDLENBQUM7TUFBdkIsQ0FBYjtNQUNSLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtRQUNFLFFBQUEsR0FBVyxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBbEI7UUFFWCxJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFNLENBQUEsQ0FBQSxDQUF0QjtRQUVBLE1BQUEsR0FBUyxDQUFBLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFYLENBQWtCLENBQUMsTUFBbkIsQ0FBQTtlQUNULElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUNFO1VBQUEsTUFBQSxFQUFXLFFBQVMsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQUFDLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBLENBQUEsR0FBb0IsR0FBckIsQ0FBekI7VUFDQSxLQUFBLEVBQVcsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLENBQUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQUEsQ0FBQSxHQUFxQixHQUF0QixDQUR6QjtVQUVBLFNBQUEsRUFBVyxHQUZYO1NBREYsRUFORjs7SUFGVzs7dUJBYWIsV0FBQSxHQUFhLFNBQUMsQ0FBRDtBQUNYLFVBQUE7TUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQWxCO2FBQ1gsSUFBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQ0U7UUFBQSxNQUFBLEVBQVcsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLENBQUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBQSxHQUFvQixHQUFyQixDQUF6QjtRQUNBLEtBQUEsRUFBVyxRQUFTLENBQUEsQ0FBQSxDQUFULEdBQWMsQ0FBQyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBQSxDQUFBLEdBQXFCLEdBQXRCLENBRHpCO09BREY7SUFGVzs7dUJBTWIsVUFBQSxHQUFZLFNBQUMsQ0FBRDthQUNWLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLFNBQWQsRUFBeUIsR0FBekI7SUFEVTs7dUJBR1osY0FBQSxHQUFnQixTQUFDLENBQUQ7TUFDZCxJQUFDLENBQUEsUUFDQyxDQUFDLElBREgsQ0FDUSx1QkFEUixDQUVFLENBQUMsSUFGSCxDQUVRLENBQUMsQ0FBQyxJQUZWO01BR0EsSUFBQyxDQUFBLFFBQ0MsQ0FBQyxJQURILENBQ1EsdUJBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsV0FBRCxDQUFhLENBQUMsQ0FBQyxLQUFmLENBRlI7TUFHQSxJQUFHLENBQUMsQ0FBQyxLQUFMO2VBQ0UsSUFBQyxDQUFBLFFBQ0MsQ0FBQyxJQURILENBQ1EsdUJBRFIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUMsQ0FBQyxLQUFqQixDQUZSLEVBREY7O0lBUGM7Ozs7S0FoS1ksTUFBTSxDQUFDO0FBQXJDOzs7QUNBQTtBQUFBLE1BQUE7Ozs7RUFBTSxNQUFNLENBQUM7Ozs7Ozs7Ozt3Q0FFWCxZQUFBLEdBQWM7O3dDQUVkLE1BQUEsR0FBUTtNQUNOO1FBQ0UsRUFBQSxFQUFJLHNCQUROO1FBRUUsSUFBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLHlCQUFKO1VBQ0EsRUFBQSxFQUFJLHNCQURKO1NBSEo7UUFLRSxNQUFBLEVBQVE7VUFDTjtZQUNFLFNBQUEsRUFBVyxHQURiO1lBRUUsU0FBQSxFQUFXLElBRmI7WUFHRSxDQUFBLEVBQUcsQ0FITDtZQUlFLFVBQUEsRUFBWSxDQUFDLENBQUMsRUFBRixFQUFNLEVBQU4sQ0FKZDtZQUtFLEtBQUEsRUFDRTtjQUFBLEVBQUEsRUFBSSxPQUFKO2NBQ0EsRUFBQSxFQUFJLE9BREo7YUFOSjtXQURNLEVBVU47WUFDRSxTQUFBLEVBQVcsSUFEYjtZQUVFLFNBQUEsRUFBVyxLQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxVQUFBLEVBQVksQ0FBQyxFQUFELEVBQUssQ0FBQyxDQUFOLENBSmQ7WUFLRSxLQUFBLEVBQ0U7Y0FBQSxFQUFBLEVBQUksc0JBQUo7Y0FDQSxFQUFBLEVBQUksb0JBREo7YUFOSjtXQVZNO1NBTFY7T0FETSxFQTJCTjtRQUNFLEVBQUEsRUFBSSxvQkFETjtRQUVFLElBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSwwQkFBSjtVQUNBLEVBQUEsRUFBSSxvQkFESjtTQUhKO1FBS0UsTUFBQSxFQUFRO1VBQ047WUFDRSxTQUFBLEVBQVcsS0FEYjtZQUVFLFNBQUEsRUFBVyxLQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxVQUFBLEVBQVksQ0FBQyxDQUFDLEVBQUYsRUFBTSxFQUFOLENBSmQ7WUFLRSxLQUFBLEVBQ0U7Y0FBQSxFQUFBLEVBQUksYUFBSjtjQUNBLEVBQUEsRUFBSSxnQkFESjthQU5KO1dBRE07U0FMVjtPQTNCTSxFQTRDTjtRQUNFLEVBQUEsRUFBSSxLQUROO1FBRUUsSUFBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLEtBQUo7VUFDQSxFQUFBLEVBQUksS0FESjtTQUhKO1FBS0UsTUFBQSxFQUFRO1VBQ047WUFDRSxTQUFBLEVBQVcsSUFEYjtZQUVFLFNBQUEsRUFBVyxJQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxTQUFBLEVBQVcsRUFKYjtZQUtFLFVBQUEsRUFBWSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBTGQ7WUFNRSxLQUFBLEVBQ0U7Y0FBQSxFQUFBLEVBQUksaUJBQUo7Y0FDQSxFQUFBLEVBQUksYUFESjthQVBKO1dBRE07U0FMVjtPQTVDTSxFQThETjtRQUNFLEVBQUEsRUFBSSxNQUROO1FBRUUsSUFBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLFNBQUo7VUFDQSxFQUFBLEVBQUksTUFESjtTQUhKO1FBS0UsTUFBQSxFQUFRO1VBQ047WUFDRSxTQUFBLEVBQVcsS0FEYjtZQUVFLFNBQUEsRUFBVyxLQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxVQUFBLEVBQVksQ0FBQyxDQUFDLEVBQUYsRUFBTSxDQUFOLENBSmQ7WUFLRSxLQUFBLEVBQ0U7Y0FBQSxFQUFBLEVBQUksU0FBSjtjQUNBLEVBQUEsRUFBSSxTQURKO2FBTko7V0FETTtTQUxWO09BOURNLEVBK0VOO1FBQ0UsRUFBQSxFQUFJLGFBRE47UUFFRSxJQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksd0JBQUo7VUFDQSxFQUFBLEVBQUksYUFESjtTQUhKO1FBS0UsTUFBQSxFQUFRO1VBQ047WUFDRSxTQUFBLEVBQVcsS0FEYjtZQUVFLFNBQUEsRUFBVyxLQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxVQUFBLEVBQVksQ0FBQyxFQUFELEVBQUssRUFBTCxDQUpkO1lBS0UsS0FBQSxFQUNFO2NBQUEsRUFBQSxFQUFJLFFBQUo7Y0FDQSxFQUFBLEVBQUksUUFESjthQU5KO1dBRE0sRUFVTjtZQUNFLFNBQUEsRUFBVyxLQURiO1lBRUUsU0FBQSxFQUFXLElBRmI7WUFHRSxDQUFBLEVBQUcsQ0FITDtZQUlFLFVBQUEsRUFBWSxDQUFDLEVBQUQsRUFBSyxDQUFDLEVBQU4sQ0FKZDtZQUtFLEtBQUEsRUFDRTtjQUFBLEVBQUEsRUFBSSxVQUFKO2NBQ0EsRUFBQSxFQUFJLFVBREo7YUFOSjtXQVZNO1NBTFY7T0EvRU0sRUF5R047UUFDRSxFQUFBLEVBQUksWUFETjtRQUVFLElBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxZQUFKO1VBQ0EsRUFBQSxFQUFJLFlBREo7U0FISjtRQUtFLE1BQUEsRUFBUTtVQUNOO1lBQ0UsU0FBQSxFQUFXLEtBRGI7WUFFRSxTQUFBLEVBQVcsS0FGYjtZQUdFLENBQUEsRUFBRyxDQUhMO1lBSUUsVUFBQSxFQUFZLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FKZDtZQUtFLEtBQUEsRUFDRTtjQUFBLEVBQUEsRUFBSSxTQUFKO2NBQ0EsRUFBQSxFQUFJLFVBREo7YUFOSjtXQURNO1NBTFY7T0F6R00sRUEwSE47UUFDRSxFQUFBLEVBQUksd0JBRE47UUFFRSxJQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksdUJBQUo7VUFDQSxFQUFBLEVBQUkscUJBREo7U0FISjtRQUtFLE1BQUEsRUFBUTtVQUNOO1lBQ0UsU0FBQSxFQUFXLEtBRGI7WUFFRSxTQUFBLEVBQVcsS0FGYjtZQUdFLENBQUEsRUFBRyxFQUhMO1lBSUUsVUFBQSxFQUFZLENBQUMsQ0FBQyxFQUFGLEVBQU0sQ0FBTixDQUpkO1lBS0UsS0FBQSxFQUNFO2NBQUEsRUFBQSxFQUFJLFVBQUo7Y0FDQSxFQUFBLEVBQUksU0FESjthQU5KO1dBRE07U0FMVjtPQTFITSxFQTJJTjtRQUNFLEVBQUEsRUFBSSx3QkFETjtRQUVFLElBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSx1QkFBSjtVQUNBLEVBQUEsRUFBSSxxQkFESjtTQUhKO1FBS0UsTUFBQSxFQUFRO1VBQ047WUFDRSxTQUFBLEVBQVcsS0FEYjtZQUVFLFNBQUEsRUFBVyxLQUZiO1lBR0UsQ0FBQSxFQUFHLENBSEw7WUFJRSxVQUFBLEVBQVksQ0FBQyxDQUFDLEVBQUYsRUFBTSxDQUFOLENBSmQ7WUFLRSxLQUFBLEVBQ0U7Y0FBQSxFQUFBLEVBQUksU0FBSjtjQUNBLEVBQUEsRUFBSSxTQURKO2FBTko7V0FETTtTQUxWO09BM0lNOzs7d0NBOEpSLGFBQUEsR0FBZSxTQUFBO0FBQ2IsYUFBTyxDQUFDLENBQUQsRUFBRyxFQUFILEVBQU0sRUFBTixFQUFTLEVBQVQsRUFBWSxFQUFaO0lBRE07O3dDQUdmLGVBQUEsR0FBaUIsU0FBQyxDQUFEO0FBQ2YsYUFBTyxDQUFBLEdBQUU7SUFETTs7d0NBSWpCLGFBQUEsR0FBZSxTQUFBO0FBQ2IsVUFBQTtNQUFBLE1BQUEsR0FBUztNQUNULElBQUcsSUFBQyxDQUFBLEdBQUo7UUFDRSxVQUFBLEdBQWEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBQSxDQUFBLEdBQW1CO1FBQ2hDLElBQUMsQ0FBQSxjQUFELEdBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBO1FBQ25CLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUM7UUFFOUMsSUFBRyxJQUFDLENBQUEsZUFBRCxHQUFtQixVQUF0QjtVQUNFLElBQUMsQ0FBQSxlQUFELEdBQW1CO1VBQ25CLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFGaEQ7O1FBT0EsSUFBQyxDQUFBLEtBQUQsR0FBVSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFsQyxHQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNuRSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQW5DLEdBQXlDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BYnJFOztBQWNBLGFBQU87SUFoQk07O3dDQWtCZixRQUFBLEdBQVUsU0FBQTtNQUNSLHNEQUFBO2FBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQTtJQUZROzt3Q0FPVixjQUFBLEdBQWdCLFNBQUE7TUFDZCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWQ7QUFDQSxhQUFPO0lBRk87O3dDQUloQixTQUFBLEdBQVcsU0FBQyxHQUFEO01BQ1QseURBQU0sR0FBTjtNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBRSxDQUFDLFFBQUgsQ0FBQTtBQUNaLGFBQU87SUFIRTs7d0NBS1gsV0FBQSxHQUFhLFNBQUMsS0FBRDtNQUNYLElBQUcsS0FBQSxLQUFTLElBQUMsQ0FBQSxZQUFiO1FBRUUsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7UUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFDLENBQUEsWUFBRCxHQUFjLENBQWQ7UUFDekIsQ0FBQSxDQUFFLGdDQUFGLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFLLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQTdEO1FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFPLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFFLENBQUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxFQUFmO1VBQXBCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkO1FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsSUFBZDtlQUNBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFQRjs7SUFEVzs7d0NBVWIsY0FBQSxHQUFnQixTQUFBO01BQ2QsSUFBRyxJQUFDLENBQUEsYUFBSjtRQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQXRCLENBQThCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDtZQUM1QixDQUFDLENBQUMsRUFBRixHQUFPLENBQUMsQ0FBQyxTQUFGLEdBQVksS0FBQyxDQUFBO1lBQ3BCLENBQUMsQ0FBQyxFQUFGLEdBQU8sQ0FBQyxDQUFDLFNBQUYsR0FBWSxLQUFDLENBQUE7bUJBQ3BCLENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQ7VUFIVztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7ZUFJQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLFFBQWpCLEVBQTJCLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBMUMsRUFMRjs7SUFEYzs7OztLQXJONkIsTUFBTSxDQUFDO0FBQXREOzs7QUNBQTtBQUFBLE1BQUE7Ozs7RUFBTSxNQUFNLENBQUM7OztJQU1FLHNCQUFDLEVBQUQsRUFBSyxPQUFMOzs7OztNQUNYLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQU8sQ0FBQyxPQUFSLElBQW1CO01BQ3JDLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLE9BQU8sQ0FBQyxZQUFSLElBQXdCO01BQy9DLE9BQU8sQ0FBQyxrQkFBUixHQUE2QixPQUFPLENBQUMsa0JBQVIsSUFBOEI7TUFDM0QsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLE9BQU8sQ0FBQyxnQkFBUixJQUE0QjtNQUN2RCw4Q0FBTSxFQUFOLEVBQVUsT0FBVjtBQUNBLGFBQU87SUFOSTs7MkJBYWIsVUFBQSxHQUFZLFNBQUE7QUFDVixhQUFPO0lBREc7OzJCQUlaLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBZixDQUFrQixDQUFDLE1BQW5CLENBQTBCLEtBQTFCLENBQ1gsQ0FBQyxJQURVLENBQ0wsT0FESyxFQUNJLGlCQURKLENBRVgsQ0FBQyxLQUZVLENBRUosUUFGSSxFQUVNLElBQUMsQ0FBQSxNQUFELEdBQVEsSUFGZDtJQURQOzsyQkFLUixTQUFBLEdBQVcsU0FBQTtNQUNULElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUNULENBQUMsSUFEUSxDQUNILENBQUMsSUFBQyxDQUFBLEtBQUYsRUFBUyxJQUFDLENBQUEsTUFBVixDQURHLENBRVQsQ0FBQyxPQUZRLENBRUEsQ0FGQSxDQUdULENBQUMsS0FIUSxDQUdGLElBSEU7TUFLWCxJQUFHLElBQUMsQ0FBQSxLQUFELElBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBdEI7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFFLENBQUMsWUFBakIsRUFERjs7TUFHQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBYSxDQUFDLFFBQWQsQ0FBdUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDO01BQVQsQ0FBdkI7TUFFWixJQUFDLENBQUEsV0FBRCxDQUFBO0FBRUEsYUFBTztJQWJFOzsyQkFnQlgsV0FBQSxHQUFhLFNBQUE7QUFHWCxVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxJQUFYLENBQ2IsQ0FBQyxHQURZLENBQ1IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQWI7UUFBVDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUSxDQUViLENBQUMsSUFGWSxDQUVQLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQztNQUF0QixDQUZPO01BR2YsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsV0FBVjtNQUdBLEtBQUEsR0FBUSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsT0FBckIsQ0FDTixDQUFDLElBREssQ0FDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBQSxDQURBO01BR1IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLGFBQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQUEsQ0FEUjtNQUdBLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBYSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxPQURSLEVBQ2lCLE1BRGpCLENBRUUsQ0FBQyxNQUZILENBRVUsS0FGVixDQUdJLENBQUMsSUFITCxDQUdVLE9BSFYsRUFHbUIsWUFIbkIsQ0FJSSxDQUFDLE1BSkwsQ0FJWSxLQUpaLENBS00sQ0FBQyxJQUxQLENBS1ksT0FMWixFQUtxQixvQkFMckIsQ0FNTSxDQUFDLE1BTlAsQ0FNYyxHQU5kO01BU0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE9BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLE9BRFQsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUFDLENBQUEsaUJBRlQ7TUFLQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsYUFBckIsQ0FDRSxDQUFDLEtBREgsQ0FDUyxZQURULEVBQ3VCLFFBRHZCLENBRUUsQ0FBQyxJQUZILENBRVUsSUFBQyxDQUFBLFlBRlgsQ0FHRSxDQUFDLE1BSEgsQ0FHVSxJQUFDLENBQUEsa0JBSFgsQ0FJRSxDQUFDLEtBSkgsQ0FJUyxZQUpULEVBSXVCLFNBSnZCO01BTUEsS0FBSyxDQUFDLElBQU4sQ0FBQSxDQUFZLENBQUMsTUFBYixDQUFBO0FBRUEsYUFBTztJQXJDSTs7MkJBd0NiLGFBQUEsR0FBZSxTQUFBO01BQ2IsOENBQUE7TUFDQSxJQUFHLElBQUMsQ0FBQSxLQUFELElBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBdEI7UUFDRSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUE7UUFDcEIsSUFBQyxDQUFBLE1BQUQsR0FBbUIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbkMsR0FBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FGOUU7O0FBR0EsYUFBTztJQUxNOzsyQkFPZixxQkFBQSxHQUF1QixTQUFBO01BQ3JCLHNEQUFBO01BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLElBQUMsQ0FBQSxNQUFELEdBQVEsSUFBbkM7TUFHQSxJQUFHLElBQUMsQ0FBQSxLQUFELElBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBdEI7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFFLENBQUMsWUFBakIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFFLENBQUMsZUFBakIsRUFIRjs7TUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxDQUFDLElBQUMsQ0FBQSxLQUFGLEVBQVMsSUFBQyxDQUFBLE1BQVYsQ0FBZDtNQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLFdBQVY7TUFHQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsT0FBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsQ0FBQSxDQURSLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLGlCQUZUO01BSUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLGFBQXJCLENBQ0UsQ0FBQyxLQURILENBQ1MsWUFEVCxFQUN1QixRQUR2QixDQUVFLENBQUMsTUFGSCxDQUVVLElBQUMsQ0FBQSxrQkFGWCxDQUdFLENBQUMsS0FISCxDQUdTLFlBSFQsRUFHdUIsU0FIdkI7QUFLQSxhQUFPO0lBdkJjOzsyQkEwQnZCLE9BQUEsR0FBUyxTQUFDLFNBQUQ7YUFDUCxTQUNFLENBQUMsSUFESCxDQUNRLE9BRFIsRUFDdUIsSUFBQyxDQUFBLFlBRHhCLENBRUUsQ0FBQyxLQUZILENBRVMsU0FGVCxFQUV1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUksQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxHQUFZLENBQUEsR0FBRSxLQUFDLENBQUEsT0FBTyxDQUFDLFlBQXZCLElBQXVDLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsR0FBWSxDQUFBLEdBQUUsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFsRTttQkFBcUYsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULEdBQXNCLEtBQTNHO1dBQUEsTUFBQTttQkFBcUgsRUFBckg7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRnZCLENBR0UsQ0FBQyxLQUhILENBR1MsWUFIVCxFQUd1QixTQUFDLENBQUQ7UUFBTyxJQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxLQUFhLENBQWQsQ0FBQSxJQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsS0FBYSxDQUFkLENBQXZCO2lCQUE2QyxTQUE3QztTQUFBLE1BQUE7aUJBQTJELEdBQTNEOztNQUFQLENBSHZCO0lBRE87OzJCQU1ULGlCQUFBLEdBQW1CLFNBQUMsU0FBRDthQUNqQixTQUNFLENBQUMsS0FESCxDQUNTLE1BRFQsRUFDbUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEVBQUYsR0FBTztNQUFkLENBRG5CLENBRUUsQ0FBQyxLQUZILENBRVMsS0FGVCxFQUVtQixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsRUFBRixHQUFPO01BQWQsQ0FGbkIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxPQUhULEVBR21CLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxFQUFGLEdBQUssQ0FBQyxDQUFDLEVBQVAsR0FBWTtNQUFuQixDQUhuQixDQUlFLENBQUMsS0FKSCxDQUlTLFFBSlQsRUFJbUIsU0FBQyxDQUFEO2VBQU8sQ0FBQyxDQUFDLEVBQUYsR0FBSyxDQUFDLENBQUMsRUFBUCxHQUFZO01BQW5CLENBSm5CO0lBRGlCOzsyQkFPbkIsWUFBQSxHQUFjLFNBQUMsU0FBRDthQUNaLFNBQVMsQ0FBQyxNQUFWLENBQWlCLEdBQWpCLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixTQUFDLENBQUQ7UUFBYyxJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsRUFBYjtpQkFBcUIsU0FBckI7U0FBQSxNQUFtQyxJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsRUFBYjtpQkFBcUIsU0FBckI7U0FBQSxNQUFBO2lCQUFtQyxHQUFuQzs7TUFBakQsQ0FEakIsQ0FFRSxDQUFDLElBRkgsQ0FFUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsSUFBSyxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQWI7UUFBZDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGUjtJQURZOzsyQkFLZCxrQkFBQSxHQUFvQixTQUFDLENBQUQ7QUFDbEIsYUFBTyxDQUFDLENBQUMsRUFBRixHQUFLLENBQUMsQ0FBQyxFQUFQLEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFyQixJQUFnQyxDQUFDLENBQUMsRUFBRixHQUFLLENBQUMsQ0FBQyxFQUFQLEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQztJQUQxQzs7MkJBR3BCLFlBQUEsR0FBYyxTQUFDLENBQUQ7QUFDWixhQUFPO0lBREs7Ozs7S0ExSWtCLE1BQU0sQ0FBQztBQUF6Qzs7O0FDQUE7QUFBQSxNQUFBOzs7RUFBTSxNQUFNLENBQUM7Ozs7Ozs7NENBR1gsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLFlBQVAsRUFBcUIsWUFBckI7QUFFVixVQUFBO01BQUEsVUFBQSxHQUFhO1FBQUM7VUFBQyxFQUFBLEVBQUksR0FBTDtTQUFEOztNQUViLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVU7TUFBakIsQ0FBWjtNQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBYSxDQUFBLENBQUEsQ0FBekI7TUFDQSxJQUFHLFlBQWEsQ0FBQSxDQUFBLENBQWhCO1FBRUUsT0FBQSxHQUFVO1FBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBckIsQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxHQUFELEVBQUssQ0FBTDtZQUMzQixJQUFHLFlBQWEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxHQUFBLENBQW5CO3FCQUNFLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FDRTtnQkFBQSxFQUFBLEVBQUksR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFpQixDQUFDLE9BQWxCLENBQTBCLElBQTFCLEVBQWdDLEdBQWhDLENBQW9DLENBQUMsT0FBckMsQ0FBNkMsR0FBN0MsRUFBa0QsRUFBbEQsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxHQUE5RCxFQUFtRSxFQUFuRSxDQUFKO2dCQUNBLElBQUEsRUFBTSxLQUFDLENBQUEsT0FBTyxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBRDVCO2dCQUVBLEtBQUEsRUFBTyxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxHQUFBLENBRnhCO2dCQUZKO2FBQUEsTUFBQTtxQkFNRSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFBLEdBQXlCLEdBQXJDLEVBTkY7O1VBRDJCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtBQVNBLGFBQUEsY0FBQTs7VUFDRSxJQUFHLEdBQUEsS0FBTyxzQkFBUCxJQUFrQyxHQUFBLEtBQU8sd0JBQXpDLElBQXNFLE1BQU0sQ0FBQyxLQUFQLEdBQWUsQ0FBeEY7WUFDRSxPQUFRLENBQUEsc0JBQUEsQ0FBdUIsQ0FBQyxLQUFoQyxJQUF5QyxNQUFNLENBQUM7WUFDaEQsT0FBTyxPQUFRLENBQUEsR0FBQSxFQUZqQjs7QUFERjtBQUtBLGFBQUEsY0FBQTs7VUFDRSxVQUFVLENBQUMsSUFBWCxDQUNFO1lBQUEsRUFBQSxFQUFJLE1BQU0sQ0FBQyxFQUFYO1lBQ0EsUUFBQSxFQUFVLE1BQU0sQ0FBQyxJQURqQjtZQUVBLElBQUEsRUFBTSxVQUFBLEdBQWEsTUFBTSxDQUFDLElBQXBCLEdBQTJCLGdCQUEzQixHQUE4QyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxLQUFsQixDQUE5QyxHQUF5RSxHQUYvRTtZQUdBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FIZDtZQUlBLE1BQUEsRUFBUSxHQUpSO1dBREY7QUFERjtRQU9BLGdCQUFBLEdBQW1CLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQUMsQ0FBRCxFQUFHLENBQUg7VUFBUyxJQUFHLENBQUMsQ0FBQyxLQUFGLElBQVksQ0FBQyxDQUFDLEtBQWpCO21CQUE0QixDQUFDLENBQUMsS0FBRixHQUFRLENBQUMsQ0FBQyxNQUF0QztXQUFBLE1BQUE7bUJBQWlELEVBQWpEOztRQUFULENBQWhCO1FBRW5CLENBQUEsQ0FBRSxxQ0FBRixDQUF3QyxDQUFDLElBQXpDLENBQThDLFlBQTlDO1FBQ0EsQ0FBQSxDQUFFLHdDQUFGLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFhLENBQUEsQ0FBQSxDQUFHLENBQUEsbUJBQUEsQ0FBM0IsQ0FBakQ7UUFDQSxDQUFBLENBQUUsb0NBQUYsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxnQkFBaUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFqRSxFQTVCRjtPQUFBLE1BQUE7UUE4QkUsT0FBTyxDQUFDLElBQVIsQ0FBYSxzQkFBQSxHQUF1QixZQUFwQyxFQTlCRjs7QUFnQ0EsYUFBTztJQXRDRzs7NENBeUNaLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBTyxZQUFQLEVBQXFCLFlBQXJCO01BQ1AsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxZQUFiLEVBQTJCLFlBQTNCLEVBQXlDLFlBQXpDO01BQ1IsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLGVBQWI7QUFDQSxhQUFPO0lBTkE7OzRDQVFULFVBQUEsR0FBWSxTQUFDLFlBQUQsRUFBZSxZQUFmO01BQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxZQUFiLEVBQTJCLFlBQTNCLEVBQXlDLFlBQXpDO01BQ1IsSUFBQyxDQUFBLFdBQUQsQ0FBQTtBQUNBLGFBQU87SUFIRzs7NENBTVosWUFBQSxHQUFjLFNBQUMsQ0FBRDtBQUNaLGFBQU8sWUFBQSxHQUFhLENBQUMsQ0FBQztJQURWOzs7QUFHZDs7Ozs7Ozs7Ozs7O0tBN0RpRCxNQUFNLENBQUM7QUFBMUQ7OztBQ0FBO0FBQUEsTUFBQTs7OztFQUFNLE1BQU0sQ0FBQzs7O0lBS0Usa0NBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7Ozs7OztNQUVYLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQU8sQ0FBQyxPQUFSLElBQW1CO01BQ3JDLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQU8sQ0FBQyxVQUFSLElBQXNCO01BQzNDLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQU8sQ0FBQyxVQUFSLElBQXNCO01BQzNDLE9BQU8sQ0FBQyxJQUFSLEdBQWUsT0FBTyxDQUFDLElBQVIsSUFBZ0I7TUFDL0IsMERBQU0sRUFBTixFQUFVLE9BQVY7QUFDQSxhQUFPO0lBUEk7O3VDQWFiLFNBQUEsR0FBVyxTQUFBO01BRVQsSUFBQyxDQUFBLE9BQUQsQ0FBQTtNQUdBLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE1BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLElBRFQsQ0FFQSxDQUFDLEtBRkQsQ0FBQSxDQUVRLENBQUMsTUFGVCxDQUVnQixRQUZoQixDQUdFLENBQUMsSUFISCxDQUdRLE9BSFIsRUFHaUIsS0FIakIsQ0FJRSxDQUFDLElBSkgsQ0FJUSxJQUpSLEVBSWMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7aUJBQU8sTUFBQSxHQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFiO1FBQWhCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpkLENBS0UsQ0FBQyxJQUxILENBS1EsSUFBQyxDQUFBLE1BTFQsQ0FNRSxDQUFDLEVBTkgsQ0FNTSxXQU5OLEVBTW1CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO2lCQUFPLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBWjtRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5uQjtJQVJTOzt1Q0FnQlgsTUFBQSxHQUFRLFNBQUMsU0FBRDthQUNOLFNBQ0UsQ0FBQyxJQURILENBQ1EsR0FEUixFQUNjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxLQUFDLENBQUEsSUFBSjttQkFBYyxDQUFDLENBQUMsT0FBaEI7V0FBQSxNQUFBO21CQUE0QixLQUFDLENBQUEsT0FBTyxDQUFDLFFBQXJDOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURkLENBRUUsQ0FBQyxJQUZILENBRVEsSUFBQyxDQUFBLFVBRlQsQ0FHRSxDQUFDLElBSEgsQ0FHUSxJQUFDLENBQUEsY0FIVDtJQURNOzt1Q0FNUixhQUFBLEdBQWUsU0FBQTtBQUViLFVBQUE7TUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLE1BQUgsQ0FBVSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFBTyxLQUFDLENBQUEsQ0FBRCxDQUFHLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFiLENBQUw7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVjtNQUNULE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQWhCO2FBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUFFLENBQUMsZUFBSCxDQUFtQixJQUFDLENBQUEsSUFBcEIsQ0FDWixDQUFDLEtBRFcsQ0FDTCxHQURLLEVBQ0EsTUFEQSxDQUVaLENBQUMsS0FGVyxDQUVMLEdBRkssRUFFQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxLQUFELEdBQU8sRUFBakIsQ0FGQSxDQUdaLENBQUMsS0FIVyxDQUdMLFNBSEssRUFHTSxFQUFFLENBQUMsWUFBSCxDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFjLElBQUcsS0FBQyxDQUFBLElBQUo7bUJBQWMsQ0FBQyxDQUFDLE1BQUYsR0FBUyxFQUF2QjtXQUFBLE1BQUE7bUJBQThCLEtBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxHQUFpQixFQUEvQzs7UUFBZDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsQ0FITixDQUlaLENBQUMsSUFKVyxDQUFBO0lBSkQ7O3VDQVVmLGFBQUEsR0FBZSxTQUFBO0FBQ2IsVUFBQTtNQUFBLENBQUEsR0FBSTtBQUNKO2FBQU0sQ0FBQSxHQUFJLEdBQVY7UUFDRSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQTtxQkFDQSxFQUFFO01BRkosQ0FBQTs7SUFGYTs7dUNBTWYsY0FBQSxHQUFnQixTQUFDLFNBQUQ7YUFDZCxTQUNFLENBQUMsSUFESCxDQUNRLElBRFIsRUFDYyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULEtBQWlCLENBQXBCO21CQUEyQixDQUFDLENBQUMsRUFBN0I7V0FBQSxNQUFBO21CQUFvQyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUMsQ0FBQSxDQUFELENBQUcsQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWIsQ0FBTCxDQUFYLEVBQXBDOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURkLENBRUUsQ0FBQyxJQUZILENBRVEsSUFGUixFQUVjLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQU8sSUFBRyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsS0FBaUIsQ0FBcEI7bUJBQTJCLENBQUMsQ0FBQyxFQUE3QjtXQUFBLE1BQUE7bUJBQW9DLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQyxDQUFBLENBQUQsQ0FBRyxDQUFFLENBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBYixDQUFMLENBQVgsRUFBcEM7O1FBQVA7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmQ7SUFEYzs7dUNBS2hCLFVBQUEsR0FBWSxTQUFDLFNBQUQ7YUFDVixTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQWIsSUFBdUIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULEtBQWlCLENBQTNDO21CQUFrRCxLQUFDLENBQUEsS0FBRCxDQUFPLENBQUUsQ0FBQSxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFiLENBQVQsRUFBbEQ7V0FBQSxNQUFBO21CQUFvRixVQUFwRjs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7SUFEVTs7dUNBR1osT0FBQSxHQUFTLFNBQUMsSUFBRDtNQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQjthQUNoQixJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsQ0FDRSxDQUFDLElBREgsQ0FDUSxJQUFDLENBQUEsVUFEVCxDQUVFLENBQUMsSUFGSCxDQUVRLElBQUMsQ0FBQSxjQUZUO0lBRk87O3VDQU1ULE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyxJQUFDLENBQUEsSUFBSjtlQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsQ0FBRDttQkFDWixDQUFDLENBQUMsTUFBRixHQUFXLEtBQUMsQ0FBQSxJQUFELENBQU0sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWIsQ0FBUjtVQURDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLEVBREY7O0lBRE87O3VDQUtULHFCQUFBLEdBQXVCLFNBQUE7TUFFckIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQWdCLElBQUMsQ0FBQSxNQUFqQjtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFnQixJQUFDLENBQUEsS0FBakI7TUFDQSxrRUFBQTtNQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQXFCLE1BQXJCLENBQ0UsQ0FBQyxJQURILENBQ1EsSUFBQyxDQUFBLGNBRFQ7QUFFQSxhQUFPO0lBVGM7O3VDQWV2QixTQUFBLEdBQVcsU0FBQTtNQUVULElBQUMsQ0FBQSxDQUFELEdBQUssRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUNILENBQUMsUUFERSxDQUNPLEtBRFAsQ0FFSCxDQUFDLEtBRkUsQ0FFSSxJQUFDLENBQUEsY0FBRCxDQUFBLENBRko7TUFJTCxJQUFDLENBQUEsQ0FBRCxHQUFLLEVBQUUsQ0FBQyxXQUFILENBQUEsQ0FDSCxDQUFDLEtBREUsQ0FDSSxJQUFDLENBQUEsY0FBRCxDQUFBLENBREo7TUFHTCxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWhCO1FBR0UsSUFBQyxDQUFBLElBQUQsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFBLENBQ04sQ0FBQyxRQURLLENBQ0ksR0FESixDQUVOLENBQUMsS0FGSyxDQUVDLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FGRCxFQUhWOztNQU9BLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBaEI7UUFDRSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQUUsQ0FBQyxjQUFILENBQUEsQ0FDUCxDQUFDLEtBRE0sQ0FDQSxFQUFFLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQXBCLENBQUEsQ0FEQSxFQURYOztNQUlBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFDLENBQUEsQ0FBZixDQUNQLENBQUMsUUFETSxDQUNHLElBQUMsQ0FBQSxNQURKO01BRVQsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFFLENBQUMsUUFBSCxDQUFZLElBQUMsQ0FBQSxDQUFiLENBQ1AsQ0FBQyxRQURNLENBQ0csSUFBQyxDQUFBLEtBREo7QUFFVCxhQUFPO0lBeEJFOzt1Q0EwQlgsZUFBQSxHQUFpQixTQUFBO0FBQ2YsYUFBTyxDQUFDLEdBQUQsRUFBTSxLQUFOO0lBRFE7O3VDQUdqQixlQUFBLEdBQWlCLFNBQUE7QUFDZixhQUFPO1FBQUMsQ0FBRCxFQUFJLEVBQUUsQ0FBQyxHQUFILENBQU8sSUFBQyxDQUFBLElBQVIsRUFBYyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQWI7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUFKOztJQURROzt1Q0FHakIsWUFBQSxHQUFjLFNBQUE7QUFDWixhQUFPLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUFWLEVBQXNCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBL0I7SUFESzs7dUNBR2QsYUFBQSxHQUFlLFNBQUE7QUFDYixhQUFPO1FBQUMsQ0FBRCxFQUFJLEVBQUUsQ0FBQyxHQUFILENBQU8sSUFBQyxDQUFBLElBQVIsRUFBYyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7bUJBQU8sQ0FBRSxDQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWI7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUFKOztJQURNOzt1Q0FHZixjQUFBLEdBQWdCLFNBQUE7QUFDZCxhQUFPLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxLQUFiLEVBQW9CLE1BQXBCO0lBRE87O3VDQUdoQixVQUFBLEdBQVksU0FBQTtNQUVWLElBQUMsQ0FBQSxDQUFDLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBVjtNQUNBLElBQUMsQ0FBQSxDQUFDLENBQUMsTUFBSCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBVjtNQUNBLElBQUcsSUFBQyxDQUFBLElBQUo7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQWIsRUFERjs7TUFFQSxJQUFHLElBQUMsQ0FBQSxLQUFKO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFkLEVBREY7O0FBRUEsYUFBTztJQVJHOzt1Q0FVWixhQUFBLEdBQWUsU0FBQTtNQUNiLElBQUcsSUFBQyxDQUFBLEdBQUo7UUFDRSxJQUFDLENBQUEsY0FBRCxHQUFtQixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQTtRQUNuQixJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDO1FBQzlDLElBQUMsQ0FBQSxLQUFELEdBQW1CLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQWxDLEdBQXlDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzVFLElBQUMsQ0FBQSxNQUFELEdBQW1CLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQW5DLEdBQXlDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BSjlFOztBQUtBLGFBQU87SUFOTTs7OztLQTdJNkIsTUFBTSxDQUFDO0FBQXJEOzs7QUNFQTtFQUFBLENBQUMsU0FBQyxDQUFEO0FBRUMsUUFBQTtJQUFBLFVBQUEsR0FBYTtJQUNiLE1BQUEsR0FBUztJQUNULFFBQUEsR0FBVztJQUNYLGVBQUEsR0FBa0I7SUFFbEIsV0FBQSxHQUFjO0lBRWQsb0JBQUEsR0FBdUI7SUFHdkIsSUFBQSxHQUFVLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZjtJQUNWLE9BQUEsR0FBVSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFNBQWY7SUFLVixJQUFHLElBQUEsS0FBUSxJQUFYO01BQ0UsRUFBRSxDQUFDLG1CQUFILENBQXVCO1FBQ3JCLFVBQUEsRUFBWSxDQUFDLEdBQUQsRUFBSyxFQUFMLENBRFM7UUFFckIsU0FBQSxFQUFXLEdBRlU7UUFHckIsV0FBQSxFQUFhLEdBSFE7UUFJckIsVUFBQSxFQUFZLENBQUMsQ0FBRCxDQUpTO09BQXZCLEVBREY7O0lBUUEsWUFBQSxHQUFlLENBQ2Isc0JBRGEsRUFFYixvQkFGYSxFQUdiLEtBSGEsRUFJYixTQUphLEVBS2IsWUFMYSxFQU1iLE1BTmEsRUFPYixhQVBhLEVBUWIsZUFSYSxFQVNiLHlCQVRhLEVBVWIscUNBVmEsRUFXYix5QkFYYSxFQVliLHNCQVphLEVBYWIsd0JBYmE7SUFnQmYsYUFBQSxHQUNFO01BQUEsSUFBQSxFQUFNLENBQ0oseUJBREksRUFFSiwwQkFGSSxFQUdKLEtBSEksRUFJSixVQUpJLEVBS0osWUFMSSxFQU1KLFNBTkksRUFPSixrQkFQSSxFQVFKLGlCQVJJLEVBU0osNEJBVEksRUFVSiwrQ0FWSSxFQVdKLCtCQVhJLEVBWUosd0JBWkksRUFhSix1QkFiSSxDQUFOO01BZUEsSUFBQSxFQUFNLENBQ0osc0JBREksRUFFSixvQkFGSSxFQUdKLEtBSEksRUFJSixTQUpJLEVBS0osWUFMSSxFQU1KLE1BTkksRUFPSixhQVBJLEVBUUosZUFSSSxFQVNKLHlCQVRJLEVBVUoscUNBVkksRUFXSix5QkFYSSxFQVlKLHNCQVpJLEVBYUoscUJBYkksQ0FmTjs7SUErQkYsYUFBQSxHQUNFO01BQUEsc0JBQUEsRUFBd0IsZUFBeEI7TUFDQSxvQkFBQSxFQUFzQixlQUR0QjtNQUVBLEtBQUEsRUFBTyxLQUZQO01BR0EsU0FBQSxFQUFXLElBSFg7TUFJQSxZQUFBLEVBQWMsWUFKZDtNQUtBLE1BQUEsRUFBUSxNQUxSO01BTUEsYUFBQSxFQUFlLFFBTmY7TUFPQSxlQUFBLEVBQWlCLElBUGpCO01BUUEseUJBQUEsRUFBMkIsSUFSM0I7TUFTQSxxQ0FBQSxFQUF1QyxJQVR2QztNQVVBLHlCQUFBLEVBQTJCLElBVjNCO01BV0Esc0JBQUEsRUFBd0IsSUFYeEI7TUFZQSx3QkFBQSxFQUEwQixhQVoxQjs7SUFjRixhQUFBLEdBQ0U7TUFBQSxHQUFBLEVBQUssYUFBTDtNQUNBLEdBQUEsRUFBSyxnQkFETDtNQUVBLEdBQUEsRUFBSyxnQkFGTDtNQUdBLEdBQUEsRUFBSyx5QkFITDtNQUlBLEdBQUEsRUFBSyxvQkFKTDtNQUtBLEdBQUEsRUFBSyx3QkFMTDtNQU1BLEdBQUEsRUFBSyxlQU5MO01BT0EsR0FBQSxFQUFLLFlBUEw7TUFRQSxHQUFBLEVBQUssb0JBUkw7TUFTQSxHQUFBLEVBQUsseUJBVEw7TUFVQSxHQUFBLEVBQUssZ0JBVkw7TUFXQSxHQUFBLEVBQUssdUJBWEw7TUFZQSxHQUFBLEVBQUssaUJBWkw7TUFhQSxHQUFBLEVBQUssaUJBYkw7TUFjQSxHQUFBLEVBQUssaUJBZEw7TUFlQSxHQUFBLEVBQUssc0NBZkw7TUFnQkEsR0FBQSxFQUFLLHdCQWhCTDtNQWlCQSxHQUFBLEVBQUssZ0JBakJMO01Ba0JBLEdBQUEsRUFBSyxxQkFsQkw7TUFtQkEsR0FBQSxFQUFLLGtDQW5CTDtNQW9CQSxHQUFBLEVBQUssZ0NBcEJMO01BcUJBLEdBQUEsRUFBSyxxQkFyQkw7TUFzQkEsR0FBQSxFQUFLLGVBdEJMO01BdUJBLEdBQUEsRUFBSyxPQXZCTDtNQXdCQSxHQUFBLEVBQUssWUF4Qkw7O0lBNkJGLGNBQUEsR0FBaUIsU0FBQyxFQUFEO0FBQ2YsVUFBQTtNQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQUEsR0FBSSxFQUFkO01BQ1osT0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLGlCQUFqQjtNQUNaLEtBQUEsR0FBWSxPQUFPLENBQUMsTUFBUixDQUFlLGtCQUFmO01BQ1osSUFBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLGNBQWpCO01BQ1osS0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZjtNQUdaLFFBQUEsR0FBVyxTQUFBLENBQUE7TUFHWCxZQUFBLEdBQWUsU0FBQTtBQUNiLFlBQUE7UUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBQSxDQUFjLENBQUMscUJBQWYsQ0FBQSxDQUFzQyxDQUFDO1FBQy9DLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxXQUFsQjtRQUVULEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixFQUFzQixNQUFBLEdBQVMsSUFBL0I7UUFFQSxPQUFPLENBQUMsS0FBUixDQUFjLFFBQWQsRUFBd0IsTUFBQSxHQUFTLElBQWpDO1FBRUEsS0FDRSxDQUFDLEtBREgsQ0FDUyxPQURULEVBQ2tCLEtBQUEsR0FBTSxJQUR4QixDQUVFLENBQUMsS0FGSCxDQUVTLFFBRlQsRUFFbUIsTUFBQSxHQUFPLElBRjFCO2VBSUEsUUFBUSxDQUFDLE1BQVQsQ0FBQTtNQVphO01BY2Ysb0JBQUEsR0FBdUIsU0FBQyxDQUFEO2VBRXJCLE9BQ0UsQ0FBQyxPQURILENBQ1csVUFEWCxFQUN1QixJQUR2QixDQUVFLENBQUMsT0FGSCxDQUVXLFdBRlgsRUFFd0IsS0FGeEI7TUFGcUI7TUFNdkIsbUJBQUEsR0FBc0IsU0FBQyxDQUFEO2VBRXBCLE9BQ0UsQ0FBQyxPQURILENBQ1csVUFEWCxFQUN1QixLQUR2QixDQUVFLENBQUMsT0FGSCxDQUVXLFdBRlgsRUFFd0IsQ0FBQyxDQUFDLFNBQUYsS0FBZSxNQUZ2QztNQUZvQjtNQU10QixlQUFBLEdBQWtCLFNBQUMsQ0FBRDtBQUVoQixZQUFBO1FBQUEsS0FBQSxHQUFRLENBQUEsQ0FBRSxDQUFDLENBQUMsT0FBSjtRQUNSLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVg7UUFDWCxJQUFBLEdBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxNQUFYO1FBQ1AsSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUVFLElBQUcsVUFBSDtZQUNFLElBQUcsSUFBQSxLQUFRLENBQVg7cUJBQ0UsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsT0FBdEIsRUFBK0IsT0FBL0IsRUFERjthQUFBLE1BRUssSUFBRyxJQUFBLEtBQVEsQ0FBUixJQUFjLENBQUMsQ0FBQyxTQUFGLEtBQWUsSUFBaEM7cUJBQ0gsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsV0FBVyxDQUFDLElBQWxDLEVBQXdDLFdBQVcsQ0FBQyxJQUFwRCxFQURHO2FBSFA7V0FGRjtTQUFBLE1BT0ssSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUNILElBQUcsTUFBSDttQkFFRSxNQUFNLENBQUMsV0FBUCxDQUFtQixJQUFuQixFQUZGO1dBREc7U0FBQSxNQUlBLElBQUcsUUFBQSxLQUFZLENBQWY7VUFDSCxJQUFHLFFBQUEsSUFBYSxJQUFBLEdBQU8sQ0FBdkI7WUFDRSxJQUFBLEdBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEdBQVQ7WUFDUCxJQUFBLEdBQVUsSUFBQSxHQUFPLENBQVYsR0FBaUIsSUFBSyxDQUFBLElBQUEsR0FBSyxDQUFMLENBQXRCLEdBQW1DO1lBQzFDLEVBQUEsR0FBSyxJQUFLLENBQUEsSUFBQSxHQUFLLENBQUw7bUJBQ1YsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsSUFBbkIsQ0FDRSxDQUFDLE1BREgsQ0FDVSxTQUFDLENBQUQ7cUJBQU8sQ0FBQSxJQUFLLElBQUwsSUFBYyxDQUFBLEdBQUk7WUFBekIsQ0FEVixDQUVFLENBQUMsT0FGSCxDQUVXLE9BQUEsR0FBUSxJQUZuQixFQUV5QixDQUFDLENBQUMsU0FBRixLQUFlLE1BRnhDLEVBSkY7V0FERztTQUFBLE1BU0EsSUFBRyxRQUFBLEtBQVksQ0FBZjtVQUNILElBQUcsZUFBQSxJQUFvQixlQUFlLENBQUMsT0FBTyxDQUFDLElBQXhCLEtBQWdDLElBQXZEO21CQUNFLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixJQUF4QixFQURGO1dBREc7O01BekJXO01BK0JsQixZQUFBLENBQUE7TUFJQSxRQUNFLENBQUMsS0FESCxDQUVJO1FBQUEsU0FBQSxFQUFZLEdBQUEsR0FBSSxFQUFoQjtRQUNBLE9BQUEsRUFBWSxpQkFEWjtRQUVBLElBQUEsRUFBWSxjQUZaO1FBR0EsSUFBQSxFQUFZLG9CQUhaO1FBSUEsTUFBQSxFQUFZLElBSlo7UUFLQSxLQUFBLEVBQVksS0FMWjtPQUZKLENBUUUsQ0FBQyxnQkFSSCxDQVFvQixvQkFScEIsQ0FTRSxDQUFDLGVBVEgsQ0FTb0IsbUJBVHBCO01BWUEsSUFBQSxDQUFPLG9CQUFQO1FBQ0Usb0JBQUEsR0FBdUI7UUFDdkIsUUFBUSxDQUFDLFdBQVQsQ0FBc0IsZUFBdEIsRUFGRjs7YUFLQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBbEM7SUF6RmU7SUErRmpCLDRCQUFBLEdBQStCLFNBQUE7QUFFN0IsVUFBQTtNQUFBLGNBQUEsQ0FBZSxvQ0FBZjtNQUVBLFVBQUEsR0FBYTtNQUNiLFNBQUEsR0FBWTs7Ozs7TUFDWixRQUFBLEdBQVcsRUFBRSxDQUFDLE1BQUgsQ0FBVSwyQkFBVjtNQUNYLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLENBQ0UsQ0FBQyxTQURILENBQ2EsSUFEYixDQUVJLENBQUMsSUFGTCxDQUVVLFNBRlYsQ0FHRSxDQUFDLEtBSEgsQ0FBQSxDQUdVLENBQUMsTUFIWCxDQUdrQixJQUhsQixDQUlJLENBQUMsTUFKTCxDQUlZLEtBSlosQ0FLTSxDQUFDLE1BTFAsQ0FLYyxLQUxkLENBTVEsQ0FBQyxJQU5ULENBTWMsWUFOZCxFQU00QixhQU41QixDQU9RLENBQUMsSUFQVCxDQU9jLFNBUGQsRUFPeUIsYUFQekI7TUFTQSxhQUFBLEdBQWdCLFNBQUE7QUFDZCxZQUFBO1FBQUEsSUFBRyxVQUFBLEtBQWMsUUFBUSxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsV0FBakM7VUFDRSxVQUFBLEdBQWEsUUFBUSxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUM7VUFDN0IsVUFBQSxHQUFhLENBQUMsVUFBQSxHQUFhLEVBQWQsQ0FBQSxHQUFvQjtVQUNqQyxXQUFBLEdBQWMsSUFBQSxHQUFLO1VBR25CLFFBQVEsQ0FBQyxTQUFULENBQW1CLElBQW5CLENBQ0UsQ0FBQyxLQURILENBQ1MsT0FEVCxFQUNrQixVQUFBLEdBQVcsSUFEN0IsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxRQUZULEVBRW1CLFdBQUEsR0FBWSxJQUYvQjtVQUdBLFFBQVEsQ0FBQyxTQUFULENBQW1CLEtBQW5CLENBQ0UsQ0FBQyxJQURILENBQ1EsT0FEUixFQUNpQixVQURqQixDQUVFLENBQUMsSUFGSCxDQUVRLFFBRlIsRUFFa0IsV0FGbEIsRUFURjs7ZUFZQSxRQUFRLENBQUMsS0FBVCxDQUFlLFlBQWYsRUFBNkIsQ0FBQyxDQUFDLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQUEsQ0FBQSxHQUFtQixRQUFRLENBQUMsSUFBVCxDQUFBLENBQWUsQ0FBQyxZQUFwQyxDQUFBLEdBQWtELEVBQW5ELENBQUEsR0FBdUQsSUFBcEY7TUFiYztNQWNoQixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsYUFBbEM7YUFDQSxhQUFBLENBQUE7SUEvQjZCO0lBcUMvQix1QkFBQSxHQUEwQixTQUFDLGVBQUQsRUFBa0IsYUFBbEIsRUFBaUMsb0JBQWpDO0FBR3hCLFVBQUE7TUFBQSxjQUFBLENBQWUsaUNBQWY7TUFHQSxJQUFBLEdBQU87TUFDUCxlQUFlLENBQUMsT0FBaEIsQ0FBd0IsU0FBQyxDQUFEO0FBQ3RCLFlBQUE7UUFBQSxXQUFBLEdBQWMsYUFBYSxDQUFDLE1BQWQsQ0FBcUIsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVUsQ0FBQyxDQUFDO1FBQW5CLENBQXJCO1FBQ2QsV0FBQSxHQUFjLG9CQUFvQixDQUFDLE1BQXJCLENBQTRCLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsSUFBRixLQUFVLENBQUMsQ0FBQztRQUFuQixDQUE1QjtRQUNkLElBQUcsV0FBWSxDQUFBLENBQUEsQ0FBWixJQUFtQixXQUFZLENBQUEsQ0FBQSxDQUFHLENBQUEsTUFBQSxDQUFyQztpQkFDSSxJQUFJLENBQUMsSUFBTCxDQUNFO1lBQUEsS0FBQSxFQUFPLENBQUMsQ0FBRSxDQUFBLE1BQUEsQ0FBVjtZQUNBLElBQUEsRUFBTSxXQUFZLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFEckI7WUFFQSxNQUFBLEVBQVEsV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BRnZCO1lBR0EsVUFBQSxFQUFZLFdBQVksQ0FBQSxDQUFBLENBQUcsQ0FBQSxNQUFBLENBSDNCO1lBSUEsR0FBQSxFQUFLLFdBQVksQ0FBQSxDQUFBLENBQUcsQ0FBQSxNQUFBLENBSnBCO1dBREYsRUFESjtTQUFBLE1BQUE7aUJBUUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSw0Q0FBWixFQUEwRCxDQUFDLENBQUMsSUFBNUQsRUFBa0UsV0FBWSxDQUFBLENBQUEsQ0FBOUUsRUFSRjs7TUFIc0IsQ0FBeEI7O0FBY0E7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQkEsZUFBQSxHQUFzQixJQUFBLE1BQU0sQ0FBQyx3QkFBUCxDQUFnQyx1QkFBaEMsRUFDcEI7UUFBQSxNQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQVEsQ0FBUjtVQUNBLEtBQUEsRUFBUSxDQURSO1VBRUEsR0FBQSxFQUFRLENBRlI7VUFHQSxNQUFBLEVBQVEsQ0FIUjtTQURGO1FBS0EsR0FBQSxFQUNFO1VBQUEsQ0FBQSxFQUFHLEtBQUg7VUFDQSxDQUFBLEVBQUcsT0FESDtVQUVBLEVBQUEsRUFBSSxNQUZKO1VBR0EsSUFBQSxFQUFNLFlBSE47VUFJQSxLQUFBLEVBQU8sS0FKUDtTQU5GO1FBV0EsVUFBQSxFQUFZLENBWFo7UUFZQSxVQUFBLEVBQVksRUFaWjtPQURvQjtNQWN0QixlQUFlLENBQUMsT0FBaEIsQ0FBd0IsSUFBeEI7YUFDQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixlQUFlLENBQUMsUUFBakM7SUFyRHdCO0lBMkQxQix3QkFBQSxHQUEyQixTQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLEdBQXRCO01BR3pCLGNBQUEsQ0FBZSw4QkFBZjtNQUdBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQUMsQ0FBRDtBQUNmLFlBQUE7UUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQyxPQUFEO2lCQUFhLE9BQU8sQ0FBQyxJQUFSLEtBQWdCLENBQUMsQ0FBQztRQUEvQixDQUFqQjs7QUFDUDs7Ozs7Ozs7OztRQVVBLENBQUMsQ0FBQyxNQUFGLEdBQVc7UUFDWCxDQUFDLENBQUMsS0FBRixHQUFVO1FBRVYsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsU0FBQyxHQUFELEVBQUssQ0FBTDtpQkFDbkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFULENBQ0U7WUFBQSxFQUFBLEVBQUksQ0FBSjtZQUNBLElBQUEsRUFBTSxhQUFjLENBQUEsSUFBQSxDQUFNLENBQUEsQ0FBQSxDQUQxQjtZQUVBLEtBQUEsRUFBVSxDQUFFLENBQUEsR0FBQSxDQUFGLEtBQVUsRUFBYixHQUFxQixDQUFDLENBQUUsQ0FBQSxHQUFBLENBQXhCLEdBQWtDLElBRnpDO1dBREY7UUFEbUIsQ0FBckI7UUFTQSxJQUFHLElBQUEsSUFBUyxJQUFLLENBQUEsQ0FBQSxDQUFqQjtVQUNFLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLE9BQUEsR0FBUSxJQUFSO2lCQUNqQixDQUFDLENBQUMsUUFBRixHQUFhLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxVQUFBLEVBRnZCO1NBQUEsTUFBQTtpQkFJRSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosRUFBMEIsQ0FBQyxDQUFDLElBQTVCLEVBSkY7O01BeEJlLENBQWpCO01BK0JBLE1BQUEsR0FBYSxJQUFBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyx3QkFBakMsRUFDWDtRQUFBLFdBQUEsRUFBYSxNQUFiO1FBQ0EsTUFBQSxFQUNFO1VBQUEsR0FBQSxFQUFLLEVBQUw7VUFDQSxNQUFBLEVBQVEsQ0FEUjtTQUZGO1FBSUEsTUFBQSxFQUFRLElBSlI7UUFLQSxJQUFBLEVBQU0sSUFMTjtPQURXO01BT2IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmLEVBQXlCLEdBQXpCO01BQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBQTthQUdBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQWlCLE1BQU0sQ0FBQyxRQUF4QjtJQWhEeUI7SUFzRDNCLDBCQUFBLEdBQTZCLFNBQUMsWUFBRCxFQUFlLFNBQWY7QUFFM0IsVUFBQTtNQUFBLFlBQUEsR0FBZTtNQUNmLFlBQUEsR0FBZTtNQUNmLGFBQUEsR0FBZ0I7TUFDaEIsdUJBQUEsR0FBMEI7TUFDMUIsb0JBQUEsR0FBdUI7TUFDdkIsc0JBQUEsR0FBeUI7TUFFekIsV0FBQSxHQUFjLE1BQU0sQ0FBQyxJQUFQLENBQVksYUFBWjtNQUdkLFlBQVksQ0FBQyxPQUFiLENBQXFCLFNBQUMsQ0FBRDs7QUFDbkI7Ozs7OztRQU1BLFlBQVksQ0FBQyxJQUFiLENBQ0U7VUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBQVI7VUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBQUYsR0FBSSxDQUFDLENBQUMsQ0FBTixHQUFRLENBQUMsQ0FBQyxDQURqQjtTQURGO1FBR0EsWUFBWSxDQUFDLElBQWIsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FEVDtTQURGO1FBR0EsYUFBYSxDQUFDLElBQWQsQ0FDRTtVQUFBLElBQUEsRUFBTSxDQUFDLENBQUMsSUFBUjtVQUNBLEtBQUEsRUFBTyxDQUFDLENBQUMsQ0FBRixHQUFJLENBQUMsQ0FBQyxDQUFOLEdBQVEsQ0FBQyxDQUFDLENBQVYsR0FBWSxDQUFDLENBQUMsQ0FEckI7U0FERjtRQUdBLHVCQUF1QixDQUFDLElBQXhCLENBQ0U7VUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBQVI7VUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBRFQ7U0FERjtRQUdBLG9CQUFvQixDQUFDLElBQXJCLENBQ0U7VUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBQVI7VUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBRFQ7U0FERjtlQUdBLHNCQUFzQixDQUFDLElBQXZCLENBQ0U7VUFBQSxJQUFBLEVBQU0sQ0FBQyxDQUFDLElBQVI7VUFDQSxLQUFBLEVBQU8sQ0FBQyxDQUFDLENBRFQ7U0FERjtNQXRCbUIsQ0FBckI7TUEwQkEsU0FBQSxHQUFZLFNBQUMsQ0FBRCxFQUFHLENBQUg7QUFBUyxlQUFPLENBQUMsQ0FBQyxLQUFGLEdBQVEsQ0FBQyxDQUFDO01BQTFCO01BQ1osWUFBWSxDQUFDLElBQWIsQ0FBa0IsU0FBbEI7TUFDQSxZQUFZLENBQUMsSUFBYixDQUFrQixTQUFsQjtNQUNBLGFBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQW5CO01BQ0EsdUJBQXVCLENBQUMsSUFBeEIsQ0FBNkIsU0FBN0I7TUFDQSxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixTQUExQjtNQUNBLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLFNBQTVCO01BRUksSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsK0JBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7T0FERSxDQUdXLENBQUMsT0FIWixDQUdvQixZQUFZLENBQUMsS0FBYixDQUFtQixDQUFuQixFQUFxQixDQUFyQixDQUhwQjtNQUlBLElBQUEsTUFBTSxDQUFDLGtCQUFQLENBQTBCLGdDQUExQixFQUNGO1FBQUEsR0FBQSxFQUNFO1VBQUEsRUFBQSxFQUFJLE1BQUo7VUFDQSxDQUFBLEVBQUcsT0FESDtTQURGO09BREUsQ0FHVyxDQUFDLE9BSFosQ0FHb0IsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBc0IsQ0FBdEIsQ0FIcEI7TUFJQSxJQUFBLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixnQ0FBMUIsRUFDRjtRQUFBLEdBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxNQUFKO1VBQ0EsQ0FBQSxFQUFHLE9BREg7U0FERjtPQURFLENBR1csQ0FBQyxPQUhaLENBR29CLFlBQVksQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBQXFCLENBQXJCLENBSHBCO01BSUEsSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsMkNBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7UUFHQSxLQUFBLEVBQU8sQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhQO09BREUsQ0FJZSxDQUFDLE9BSmhCLENBSXdCLHVCQUF1QixDQUFDLEtBQXhCLENBQThCLENBQTlCLEVBQWdDLENBQWhDLENBSnhCO01BS0EsSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsd0NBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7UUFHQSxLQUFBLEVBQU8sQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhQO09BREUsQ0FJZSxDQUFDLE9BSmhCLENBSXdCLG9CQUFvQixDQUFDLEtBQXJCLENBQTJCLENBQTNCLEVBQTZCLENBQTdCLENBSnhCO2FBS0EsSUFBQSxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsMENBQTFCLEVBQ0Y7UUFBQSxHQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksTUFBSjtVQUNBLENBQUEsRUFBRyxPQURIO1NBREY7UUFHQSxLQUFBLEVBQU8sQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhQO09BREUsQ0FJZSxDQUFDLE9BSmhCLENBSXdCLHNCQUFzQixDQUFDLEtBQXZCLENBQTZCLENBQTdCLEVBQStCLENBQS9CLENBSnhCO0lBcEV1QjtJQThFN0IsOEJBQUEsR0FBaUMsU0FBQyxRQUFEO01BRS9CLGNBQUEsQ0FBZSxzQ0FBZjtNQUVBLFVBQUEsR0FBaUIsSUFBQSxNQUFNLENBQUMsNkJBQVAsQ0FBcUMsNEJBQXJDLEVBQ2Y7UUFBQSxXQUFBLEVBQWEsTUFBYjtRQUNBLE1BQUEsRUFDRTtVQUFBLElBQUEsRUFBUSxDQUFSO1VBQ0EsS0FBQSxFQUFRLENBRFI7VUFFQSxHQUFBLEVBQVEsQ0FGUjtVQUdBLE1BQUEsRUFBUSxDQUhSO1NBRkY7UUFNQSxHQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sT0FBUDtVQUNBLEVBQUEsRUFBSSxNQURKO1NBUEY7UUFTQSxXQUFBLEVBQWEsWUFUYjtRQVVBLFlBQUEsRUFBYyxhQUFjLENBQUEsSUFBQSxDQVY1QjtPQURlO01BYWpCLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFFBQW5CLEVBQTZCLFdBQVcsQ0FBQyxJQUF6QyxFQUErQyxXQUFXLENBQUMsSUFBM0Q7YUFFQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixVQUFVLENBQUMsUUFBNUI7SUFuQitCO0lBeUJqQyxzQkFBQSxHQUF5QixTQUFDLFFBQUQsRUFBVyxlQUFYLEVBQTRCLFlBQTVCO2FBRXZCLENBQUEsQ0FBRSxxQ0FBRixDQUNFLENBQUMsTUFESCxDQUNVLFNBQUE7QUFDTixZQUFBO1FBQUEsWUFBQSxHQUFlLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxHQUFSLENBQUE7UUFDZixPQUFPLENBQUMsR0FBUixDQUFZLFFBQVosRUFBc0IsWUFBdEI7UUFFQSxnQkFBQSxHQUFtQixRQUFRLENBQUMsTUFBVCxDQUFnQixTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVTtRQUFqQixDQUFoQjtRQUNuQixJQUFHLGdCQUFBLElBQXFCLGdCQUFpQixDQUFBLENBQUEsQ0FBekM7VUFDRSxlQUFBLEdBQWtCLFlBQVksQ0FBQyxHQUFiLENBQWlCLFNBQUMsR0FBRCxFQUFNLENBQU47bUJBQVk7Y0FBQyxNQUFBLEVBQVEsYUFBYyxDQUFBLElBQUEsQ0FBTSxDQUFBLENBQUEsQ0FBN0I7Y0FBaUMsT0FBQSxFQUFTLENBQUMsZ0JBQWlCLENBQUEsQ0FBQSxDQUFHLENBQUEsR0FBQSxDQUEvRDs7VUFBWixDQUFqQjtVQUNsQixlQUFBLEdBQWtCLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFDLENBQUQsRUFBRyxDQUFIO21CQUFTLENBQUMsQ0FBQyxLQUFGLEdBQVEsQ0FBQyxDQUFDO1VBQW5CLENBQXJCO1VBQ2xCLENBQUEsQ0FBRSw4QkFBRixDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxnQkFBaUIsQ0FBQSxDQUFBLENBQUcsQ0FBQSxtQkFBQSxDQUFoQyxDQUFBLEdBQXNELEdBQTdGO1VBQ0EsQ0FBQSxDQUFFLHNDQUFGLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFsRTtVQUNBLENBQUEsQ0FBRSw0Q0FBRixDQUErQyxDQUFDLElBQWhELENBQXFELElBQUksQ0FBQyxLQUFMLENBQVcsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUE5QixDQUFBLEdBQXFDLEdBQTFGO1VBQ0EsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsSUFBN0IsQ0FBQSxFQU5GO1NBQUEsTUFBQTtVQVFFLENBQUEsQ0FBRSx5QkFBRixDQUE0QixDQUFDLElBQTdCLENBQUEsRUFSRjs7UUFVQSx1QkFBQSxHQUEwQixlQUFlLENBQUMsTUFBaEIsQ0FBdUIsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVU7UUFBakIsQ0FBdkI7UUFDMUIsSUFBRyx1QkFBQSxJQUE0Qix1QkFBd0IsQ0FBQSxDQUFBLENBQXZEO1VBQ0UsQ0FBQSxDQUFFLHFDQUFGLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLHVCQUF3QixDQUFBLENBQUEsQ0FBRyxDQUFBLE1BQUEsQ0FBdkMsQ0FBQSxHQUFnRCxHQUE5RjtVQUNBLENBQUEsQ0FBRSxnQ0FBRixDQUFtQyxDQUFDLElBQXBDLENBQUEsRUFGRjtTQUFBLE1BQUE7VUFJRSxDQUFBLENBQUUsZ0NBQUYsQ0FBbUMsQ0FBQyxJQUFwQyxDQUFBLEVBSkY7O1FBTUEsb0JBQUEsR0FBdUIsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsU0FBQyxDQUFEO2lCQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVU7UUFBakIsQ0FBcEI7UUFDdkIsSUFBRyxvQkFBQSxJQUF5QixvQkFBcUIsQ0FBQSxDQUFBLENBQWpEO1VBQ0UsT0FBQSxHQUFVLE1BQU0sQ0FBQyxJQUFQLENBQVksYUFBWixDQUEwQixDQUFDLEdBQTNCLENBQStCLFNBQUMsTUFBRDttQkFBWTtjQUFDLE1BQUEsRUFBUSxhQUFjLENBQUEsTUFBQSxDQUF2QjtjQUFnQyxPQUFBLEVBQVMsQ0FBQyxvQkFBcUIsQ0FBQSxDQUFBLENBQUcsQ0FBQSxNQUFBLENBQWxFOztVQUFaLENBQS9CO1VBQ1YsT0FBQSxHQUFVLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQyxDQUFELEVBQUcsQ0FBSDttQkFBUyxDQUFDLENBQUMsS0FBRixHQUFRLENBQUMsQ0FBQztVQUFuQixDQUFiO1VBQ1YsQ0FBQSxDQUFFLGlDQUFGLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQXJEO1VBQ0EsQ0FBQSxDQUFFLHVDQUFGLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBdEIsQ0FBQSxHQUE2QixHQUE3RTtpQkFDQSxDQUFBLENBQUUsNEJBQUYsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFBLEVBTEY7U0FBQSxNQUFBO2lCQU9FLENBQUEsQ0FBRSw0QkFBRixDQUErQixDQUFDLElBQWhDLENBQUEsRUFQRjs7TUF2Qk0sQ0FEVixDQWdDRSxDQUFDLEdBaENILENBZ0NPLFdBQVcsQ0FBQyxJQWhDbkIsQ0FpQ0UsQ0FBQyxPQWpDSCxDQWlDVyxRQWpDWDtJQUZ1QjtXQTJDekIsRUFBRSxDQUFDLEtBQUgsQ0FBQSxDQUNFLENBQUMsS0FESCxDQUNTLEVBQUUsQ0FBQyxHQURaLEVBQ2tCLE9BQUEsR0FBUSx3Q0FEMUIsQ0FFRSxDQUFDLEtBRkgsQ0FFUyxFQUFFLENBQUMsR0FGWixFQUVrQixPQUFBLEdBQVEsdUJBRjFCLENBR0UsQ0FBQyxLQUhILENBR1MsRUFBRSxDQUFDLEdBSFosRUFHa0IsT0FBQSxHQUFRLGtDQUgxQixDQUlFLENBQUMsS0FKSCxDQUlTLEVBQUUsQ0FBQyxHQUpaLEVBSWtCLE9BQUEsR0FBUSxxQkFKMUIsQ0FLRSxDQUFDLEtBTEgsQ0FLUyxFQUFFLENBQUMsR0FMWixFQUtrQixPQUFBLEdBQVEsc0JBQVIsR0FBK0IsSUFBL0IsR0FBb0MsTUFMdEQsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxFQUFFLENBQUMsR0FOWixFQU1rQixPQUFBLEdBQVEsNkJBQVIsR0FBc0MsSUFBdEMsR0FBMkMsTUFON0QsQ0FPRSxDQUFDLEtBUEgsQ0FPUyxFQUFFLENBQUMsSUFQWixFQU9rQixPQUFBLEdBQVEsMEJBUDFCLENBUUUsQ0FBQyxLQVJILENBUVMsRUFBRSxDQUFDLElBUlosRUFRa0IsNkJBUmxCLENBU0UsQ0FBQyxLQVRILENBU1MsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixlQUFsQixFQUFtQyxZQUFuQyxFQUFpRCxTQUFqRCxFQUE0RCxhQUE1RCxFQUEyRSxvQkFBM0UsRUFBaUcsR0FBakcsRUFBc0csUUFBdEc7QUFFTCxVQUFBO01BQUEsSUFBRyxRQUFIO1FBQ0UsWUFBQSxHQUFlLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUMsS0FBRixLQUFXLFFBQVEsQ0FBQztRQUEzQixDQUFqQjtRQUNmLElBQUcsWUFBYSxDQUFBLENBQUEsQ0FBaEI7VUFDRSxXQUFXLENBQUMsSUFBWixHQUFtQixZQUFhLENBQUEsQ0FBQSxDQUFFLENBQUM7VUFDbkMsV0FBVyxDQUFDLElBQVosR0FBbUIsWUFBYSxDQUFBLENBQUEsQ0FBRyxDQUFBLE9BQUEsR0FBUSxJQUFSLEVBRnJDO1NBRkY7T0FBQSxNQUFBO1FBTUUsUUFBQSxHQUFXLEdBTmI7O01BUUEsSUFBQSxDQUFPLFFBQVEsQ0FBQyxJQUFoQjtRQUNFLFdBQVcsQ0FBQyxJQUFaLEdBQW1CO1FBQ25CLFdBQVcsQ0FBQyxJQUFaLEdBQXNCLElBQUEsS0FBUSxJQUFYLEdBQXFCLFFBQXJCLEdBQW1DLFFBRnhEOztNQVNBLFlBQVksQ0FBQyxPQUFiLENBQXFCLFNBQUMsQ0FBRDtBQUNuQixZQUFBO1FBQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsT0FBRDtpQkFBYSxPQUFPLENBQUMsS0FBUixLQUFpQixDQUFDLENBQUM7UUFBaEMsQ0FBakI7UUFDUCxJQUFHLElBQUEsSUFBUyxJQUFLLENBQUEsQ0FBQSxDQUFqQjtVQUNFLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDO1VBQ2pCLENBQUMsQ0FBQyxJQUFGLEdBQVMsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLE9BQUEsR0FBUSxJQUFSO1VBQ2pCLE1BQU0sQ0FBQyxJQUFQLENBQVksYUFBWixDQUEwQixDQUFDLE9BQTNCLENBQW1DLFNBQUMsTUFBRDtZQUNqQyxDQUFFLENBQUEsTUFBQSxDQUFGLEdBQVksR0FBQSxHQUFJLENBQUUsQ0FBQSxNQUFBO1lBQ2xCLElBQUcsQ0FBRSxDQUFBLE1BQUEsQ0FBRixHQUFZLEdBQWY7cUJBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQ0FBQSxHQUFxQyxDQUFDLENBQUMsT0FBdkMsR0FBaUQsSUFBakQsR0FBd0QsTUFBeEQsR0FBaUUsSUFBakUsR0FBd0UsQ0FBRSxDQUFBLE1BQUEsQ0FBdEYsRUFERjs7VUFGaUMsQ0FBbkM7aUJBSUEsT0FBTyxDQUFDLENBQUMsUUFQWDtTQUFBLE1BQUE7aUJBU0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxzQkFBQSxHQUF1QixDQUFDLENBQUMsSUFBdEMsRUFURjs7TUFGbUIsQ0FBckI7TUFhQSxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVo7TUFFQSxJQUFHLENBQUEsQ0FBRSw2QkFBRixDQUFnQyxDQUFDLE1BQXBDO1FBQ0UsOEJBQUEsQ0FBK0IsUUFBL0IsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSx5QkFBRixDQUE0QixDQUFDLE1BQWhDO1FBQ0Usd0JBQUEsQ0FBeUIsUUFBekIsRUFBbUMsU0FBbkMsRUFBOEMsR0FBOUMsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSwyQkFBRixDQUE4QixDQUFDLE1BQS9CLEdBQXdDLENBQTNDO1FBQ0UsNEJBQUEsQ0FBQSxFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLHdCQUFGLENBQTJCLENBQUMsTUFBL0I7UUFDRSx1QkFBQSxDQUF3QixlQUF4QixFQUF5QyxhQUF6QyxFQUF3RCxvQkFBeEQsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxpQ0FBRixDQUFvQyxDQUFDLE1BQXhDO1FBQ0UsMEJBQUEsQ0FBMkIsWUFBM0IsRUFBeUMsU0FBekMsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2VBQ0Usc0JBQUEsQ0FBdUIsUUFBdkIsRUFBaUMsZUFBakMsRUFBa0QsWUFBbEQsRUFERjs7SUFqREssQ0FUVDtFQTlmRCxDQUFELENBQUEsQ0EyakJFLE1BM2pCRjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgaWYgQHN2Z1xuICAgICAgQHN2Z1xuICAgICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmFyIEhvcml6b250YWwgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIG9wdGlvbnMueEF4aXMgPSBvcHRpb25zLnhBeGlzIHx8IFsyNSwgNTAsIDc1LCAxMDBdXG4gICAgc3VwZXIgaWQsIG9wdGlvbnNcbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIG92ZXJyaWRlIHN2ZyAmIHVzZSBodG1sIGRpdiBpbnN0ZWFkXG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnYmFyLWhvcml6b250YWwtZ3JhcGgnXG5cbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgZGF0YS5mb3JFYWNoIChkKSA9PiBcbiAgICAgIGRbQG9wdGlvbnMua2V5LnhdID0gK2RbQG9wdGlvbnMua2V5LnhdXG4gICAgcmV0dXJuIGRhdGFcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgIGlmIEBvcHRpb25zLnhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmF4aXMnKVxuICAgICAgICAuZGF0YShAb3B0aW9ucy54QXhpcylcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2F4aXMnXG4gICAgICAgIC5zdHlsZSAnbGVmdCcsIChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIGNvbnNvbGUubG9nICdiYXIgaG9yaXpvbnRhbCBkYXRhJywgQGRhdGFcbiAgICAjIGRyYXcgYmFyc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuYmFyJylcbiAgICAgIC5kYXRhKEBkYXRhKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdiYXItY29udGFpbmVyJ1xuICAgICAgLmNhbGwgQHNldEJhcnNcbiAgICByZXR1cm4gQFxuXG4gIFxuICBzZXRCYXJzOiAoZWxlbWVudCkgPT5cbiAgICBpZiBAb3B0aW9ucy5rZXkuaWRcbiAgICAgIGVsZW1lbnQuYXR0ciAnaWQnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuaWRdXG4gICAgICBlbGVtZW50LmFwcGVuZCgnZGl2JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ2Jhci10aXRsZSdcbiAgICAgICAgLmh0bWwgKGQpID0+IGRbQG9wdGlvbnMua2V5LmlkXVxuICAgIGVsZW1lbnQuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2JhcidcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAoZCkgPT4gXG4gICAgICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XSsnJSdcbiAgICAgIC5hcHBlbmQoJ3NwYW4nKVxuICAgICAgICAuaHRtbCAoZCkgPT4gTWF0aC5yb3VuZChkW0BvcHRpb25zLmtleS54XSkrJyUnXG4iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDYzXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI2M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTIwLCAxMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVpbm8gVW5pZG8nXG4gICAgICAgICAgICBlbjogJ1VuaXRlZCBLaW5nZG9tJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0lVRCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ0RJVSdcbiAgICAgICAgZW46ICdJVUQnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC44NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zNFxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0V2lkdGg6IDgwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzEyLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDb3JlYSBkZWwgTm9ydGUnXG4gICAgICAgICAgICBlbjogJ05vcnRoIEtvcmVhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ1BpbGwnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdww61sZG9yYSdcbiAgICAgICAgZW46ICdwaWxsJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxNlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTM1LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBcmdlbGlhJ1xuICAgICAgICAgICAgZW46ICdBbGdlcmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgY29uZG9tJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncHJlc2VydmF0aXZvIG1hc2N1bGlubydcbiAgICAgICAgZW46ICdtYWxlIGNvbmRvbSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjI2NVxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4yOTdcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzMwLCAyNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2FuYWTDoSdcbiAgICAgICAgICAgIGVuOiAnQ2FuYWRhJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC43M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIC0xMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQm90c3VhbmEnXG4gICAgICAgICAgICBlbjogJ0JvdHN3YW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0luamVjdGFibGUnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdpbnllY3RhYmxlJ1xuICAgICAgICBlbjogJ2luamVjdGFibGUnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC42MTZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNTcxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnRXRpb3DDrWEnXG4gICAgICAgICAgICBlbjogJ0V0aGlvcGlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzE4XG4gICAgICAgICAgcjogMTZcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTI2LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCYWxjYW5lcydcbiAgICAgICAgICAgIGVuOiAnQmFsa2FucydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMzMlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEwLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBbGJhbmlhJ1xuICAgICAgICAgICAgZW46ICdBbGJhbmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgZ2V0TGVnZW5kRGF0YTogLT5cbiAgICByZXR1cm4gWzAsMjAsNDAsNjAsODBdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZCsnJSdcblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBvZmZzZXQgPSAxMDBcbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLW9mZnNldFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAjIGF2b2lkIGdyYXBoIGhlaWdodCBvdmVyZmxvdyBicm93c2VyIGhlaWdodCBcbiAgICAgIGlmIEBjb250YWluZXJIZWlnaHQgPiBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJXaWR0aCA9IEBjb250YWluZXJIZWlnaHQgLyBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgICAjQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICAjZWxzZVxuICAgICAgIyAgQCRlbC5jc3MgJ3RvcCcsIChib2R5SGVpZ2h0LUBjb250YWluZXJIZWlnaHQpIC8gMlxuICAgICAgQHdpZHRoICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcblxuXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgc3VwZXIobWFwKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICByZXR1cm4gQFxuXG4gIHNldE1hcFN0YXRlOiAoc3RhdGUpIC0+XG4gICAgaWYgc3RhdGUgIT0gQGN1cnJlbnRTdGF0ZVxuICAgICAgI2NvbnNvbGUubG9nICdzZXQgc3RhdGUgJytzdGF0ZVxuICAgICAgQGN1cnJlbnRTdGF0ZSA9IHN0YXRlXG4gICAgICBAY3VycmVudE1ldGhvZCA9IEBzdGF0ZXNbQGN1cnJlbnRTdGF0ZS0xXVxuICAgICAgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBAY3VycmVudE1ldGhvZC50ZXh0W0BvcHRpb25zLmxhbmddXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PiBkLnZhbHVlID0gK2RbQGN1cnJlbnRNZXRob2QuaWRdXG4gICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgIEBjdXJyZW50TWV0aG9kLmxhYmVscy5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC5jeCA9IGQuY3hfZmFjdG9yKkB3aWR0aFxuICAgICAgICBkLmN5ID0gZC5jeV9mYWN0b3IqQGhlaWdodFxuICAgICAgICBkLnRleHQgPSBkLmxhYmVsW0BvcHRpb25zLmxhbmddXG4gICAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBAY3VycmVudE1ldGhvZC5sYWJlbHNcbiIsImNsYXNzIHdpbmRvdy5UcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMubWluU2l6ZSA9IG9wdGlvbnMubWluU2l6ZSB8fCA2MFxuICAgIG9wdGlvbnMubm9kZXNQYWRkaW5nID0gb3B0aW9ucy5ub2Rlc1BhZGRpbmcgfHwgOFxuICAgIG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gfHwgNjAwXG4gICAgb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID0gb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IHx8IDYyMFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBkcmF3IHNjYWxlc1xuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBzZXRTVkcgdG8gdXNlIGEgZGl2IGNvbnRhaW5lciAobm9kZXMtY29udGFpbmVyKSBpbnN0ZWFkIG9mIGEgc3ZnIGVsZW1lbnRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGVzLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIEB0cmVlbWFwID0gZDMudHJlZW1hcCgpXG4gICAgICAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgICAgLnBhZGRpbmcgMFxuICAgICAgLnJvdW5kIHRydWVcblxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuXG4gICAgQHN0cmF0aWZ5ID0gZDMuc3RyYXRpZnkoKS5wYXJlbnRJZCAoZCkgLT4gZC5wYXJlbnRcblxuICAgIEB1cGRhdGVHcmFwaCgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG5cbiAgICAjIHVwZGF0ZSB0cmVtYXAgXG4gICAgQHRyZWVtYXBSb290ID0gQHN0cmF0aWZ5KEBkYXRhKVxuICAgICAgLnN1bSAoZCkgPT4gZFtAb3B0aW9ucy5rZXkudmFsdWVdXG4gICAgICAuc29ydCAoYSwgYikgLT4gYi52YWx1ZSAtIGEudmFsdWVcbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgbm9kZXMgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgXG4gICAgbm9kZXMuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZSdcbiAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwnXG4gICAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbC1jb250ZW50J1xuICAgICAgICAgIC5hcHBlbmQgJ3AnXG5cbiAgICAjIHNldHVwIG5vZGVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcblxuICAgICMgYWRkIGxhYmVsIG9ubHkgaW4gbm9kZXMgd2l0aCBzaXplIGdyZWF0ZXIgdGhlbiBvcHRpb25zLm1pblNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmNhbGwgICBAc2V0Tm9kZUxhYmVsXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgbm9kZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG4gICAgICBcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG5cbiAgc2V0Tm9kZURpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuICBzZXROb2RlTGFiZWw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLnNlbGVjdCgncCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gcmV0dXJuIGlmIGQudmFsdWUgPiAyNSB0aGVuICdzaXplLWwnIGVsc2UgaWYgZC52YWx1ZSA8IDEwIHRoZW4gJ3NpemUtcycgZWxzZSAnJ1xuICAgICAgLmh0bWwgKGQpID0+IGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgaXNOb2RlTGFiZWxWaXNpYmxlOiAoZCkgPT5cbiAgICByZXR1cm4gZC54MS1kLngwID4gQG9wdGlvbnMubWluU2l6ZSAmJiBkLnkxLWQueTAgPiBAb3B0aW9ucy5taW5TaXplXG5cbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUnXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAgIyBzZXQgcGFyc2VkRGF0YSBhcnJheVxuICAgIHBhcnNlZERhdGEgPSBbe2lkOiAncid9XSAjIGFkZCB0cmVlbWFwIHJvb3RcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICBpZiBkYXRhX2NvdW50cnlbMF1cbiAgICAgICMgc2V0IG1ldGhvZHMgb2JqZWN0XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgICBpZiBkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICAgIG1ldGhvZHNba2V5XSA9XG4gICAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgICAgbmFtZTogQG9wdGlvbnMubWV0aG9kc05hbWVzW2ldXG4gICAgICAgICAgICB2YWx1ZTogK2RhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIlRoZXJlJ3Mgbm8gZGF0YSBmb3IgXCIgKyBrZXlcbiAgICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIGlmIGtleSAhPSAnT3RoZXIgbW9kZXJuIG1ldGhvZHMnIGFuZCBrZXkgIT0gJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnIGFuZCBtZXRob2QudmFsdWUgPCA1XG4gICAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgICBkZWxldGUgbWV0aG9kc1trZXldXG4gICAgIFxuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBwYXJzZWREYXRhLnB1c2hcbiAgICAgICAgICBpZDogbWV0aG9kLmlkXG4gICAgICAgICAgcmF3X25hbWU6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArIG1ldGhvZC5uYW1lICsgJzwvc3Ryb25nPjxici8+JyArIE1hdGgucm91bmQobWV0aG9kLnZhbHVlKSArICclJ1xuICAgICAgICAgIHZhbHVlOiBtZXRob2QudmFsdWVcbiAgICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgICAgcGFyc2VkRGF0YVNvcnRlZCA9IHBhcnNlZERhdGEuc29ydCAoYSxiKSAtPiBpZiBhLnZhbHVlIGFuZCBiLnZhbHVlIHRoZW4gYi52YWx1ZS1hLnZhbHVlIGVsc2UgMVxuICAgICAgIyBzZXQgY2FwdGlvbiBjb3VudHJ5IG5hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1hbnktbWV0aG9kJykuaHRtbCBNYXRoLnJvdW5kKGRhdGFfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSlcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIHBhcnNlZERhdGFTb3J0ZWRbMF0ucmF3X25hbWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gJ05vIGRhdGEgY291bnRyeSBmb3IgJytjb3VudHJ5X2NvZGVcbiAgICAgICMgVE9ETyEhISBXaGF0IHdlIGRvIGlmIHRoZXJlJ3Mgbm8gZGF0YSBmb3IgdXNlcidzIGNvdW50cnlcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgI0BzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZURhdGE6IChjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEB1cGRhdGVHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgIyMjIG92ZXJkcml2ZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSlcbiAgIyMjIiwiY2xhc3Mgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgMCAjIG1vZGUgMDogYmVlc3dhcm0sIG1vZGUgMTogc2NhdHRlcnBsb3RcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEgQGRhdGFcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RcbiAgICAgIC5vbiAnbW91c2VvdmVyJywgKGQpID0+IGNvbnNvbGUubG9nIGRcblxuICBzZXREb3Q6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAncicsICAoZCkgPT4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cyBlbHNlIEBvcHRpb25zLmRvdFNpemVcbiAgICAgIC5jYWxsIEBzZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWSA9IGQzLmZvcmNlWSAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgZm9yY2VZLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVlcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWChAd2lkdGgqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAzNTBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgc2V0RG90UG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY3gnLCAoZCkgPT4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC54IGVsc2UgTWF0aC5yb3VuZCBAeChkW0BvcHRpb25zLmtleS54XSlcbiAgICAgIC5hdHRyICdjeScsIChkKSA9PiBpZiBAb3B0aW9ucy5tb2RlID09IDAgdGhlbiBkLnkgZWxzZSBNYXRoLnJvdW5kIEB5KGRbQG9wdGlvbnMua2V5LnldKVxuXG4gIHNldERvdEZpbGw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gaWYgQG9wdGlvbnMua2V5LmNvbG9yIGFuZCBAb3B0aW9ucy5tb2RlID09IDEgdGhlbiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdIGVsc2UgJyNlMjcyM2InXG5cbiAgc2V0TW9kZTogKG1vZGUpIC0+XG4gICAgQG9wdGlvbnMubW9kZSA9IG1vZGVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICBAeCA9IGQzLnNjYWxlUG93KClcbiAgICAgIC5leHBvbmVudCgwLjEyNSlcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdLnJldmVyc2UoKVxuICAgICMgc2V0dXAgYXhpc1xuICAgIEB4QXhpcyA9IGQzLmF4aXNCb3R0b20oQHgpXG4gICAgICAudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcyA9IGQzLmF4aXNMZWZ0KEB5KVxuICAgICAgLnRpY2tTaXplIEB3aWR0aFxuICAgIHJldHVybiBAXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjAwLCA4NTAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMTAwNSwgMzk1NSwgMTIyMzUsIDEwMDAwMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gIHVzZVRyZWVtYXAgPSBudWxsXG4gIHVzZU1hcCA9IG51bGxcbiAgdXNlR3JhcGggPSBudWxsXG4gIHVubWV0bmVlZHNHcmFwaCA9IG51bGwgXG5cbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gIHNjcm9sbGFtYUluaXRpYWxpemVkID0gZmFsc2VcblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcIkVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcIkVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJJbXBsYW50ZVwiXG4gICAgICBcIklueWVjdGFibGVcIlxuICAgICAgXCJQw61sZG9yYVwiXG4gICAgICBcIkNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiQ29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIk3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIk3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJBbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIk90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwiTcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJJbXBsYW50XCJcbiAgICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgICBcIlBpbGxcIlxuICAgICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcIlRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIiAgICAgICAjIG9wcG9zZWRcbiAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiICAjIG9wcG9zZWRcbiAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiICAgICAgICAgICAjIG9wcG9zZWRcbiAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIiAgICAjIG9wcG9zZWRcbiAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCIgICAgICAgICAgICAgICAgICAgICAgIyBzYWx1ZFxuICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiICMgc2FsdWRcbiAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCknMgcHJvY2Vzc2VzXCIgICAgICAjIHNhbHVkXG4gICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gICMgU2Nyb2xsYW1hIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBTY3JvbGxhbWEgPSAoaWQpIC0+XG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytpZClcbiAgICBncmFwaGljICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIGNoYXJ0ICAgICA9IGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICB0ZXh0ICAgICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLXRleHQnKVxuICAgIHN0ZXBzICAgICA9IHRleHQuc2VsZWN0QWxsKCcuc3RlcCcpXG5cbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuXG4gICAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgICBoYW5kbGVSZXNpemUgPSAtPlxuICAgICAgd2lkdGggPSBncmFwaGljLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAjTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgICBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgICAgZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICAgIGNoYXJ0XG4gICAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICAgIHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgICBoYW5kbGVDb250YWluZXJFbnRlciA9IChlKSAtPlxuICAgICAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAgIGhhbmRsZUNvbnRhaW5lckV4aXQgPSAoZSkgLT5cbiAgICAgICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIGhhbmRsZVN0ZXBFbnRlciA9IChlKSAtPlxuICAgICAgI8KgY29uc29sZS5sb2cgZVxuICAgICAgJHN0ZXAgPSAkKGUuZWxlbWVudClcbiAgICAgIGluc3RhbmNlID0gJHN0ZXAuZGF0YSgnaW5zdGFuY2UnKVxuICAgICAgc3RlcCA9ICRzdGVwLmRhdGEoJ3N0ZXAnKVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMCBcbiAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMScsIHN0ZXBcbiAgICAgICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgc3RlcCAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMlxuICAgICAgICBpZiB1c2VHcmFwaCBhbmQgc3RlcCA+IDBcbiAgICAgICAgICBkYXRhID0gWzYzLCA4OCwgMTAwXSAjIDYzLCA2MysyNSwgNjMrMjUrMTJcbiAgICAgICAgICBmcm9tID0gaWYgc3RlcCA+IDEgdGhlbiBkYXRhW3N0ZXAtMl0gZWxzZSAwXG4gICAgICAgICAgdG8gPSBkYXRhW3N0ZXAtMV1cbiAgICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQgPj0gZnJvbSBhbmQgZCA8IHRvXG4gICAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK3N0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDInLCBzdGVwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDNcbiAgICAgICAgaWYgdW5tZXRuZWVkc0dyYXBoIGFuZCB1bm1ldG5lZWRzR3JhcGgub3B0aW9ucy5tb2RlICE9IHN0ZXBcbiAgICAgICAgICB1bm1ldG5lZWRzR3JhcGguc2V0TW9kZSBzdGVwXG5cbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIGhhbmRsZVJlc2l6ZSgpXG5cbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycraWQgICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJy5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgdGV4dDogICAgICAgJy5zY3JvbGwtdGV4dCcgICAgICAgICMgdGhlIHN0ZXAgY29udGFpbmVyXG4gICAgICAgIHN0ZXA6ICAgICAgICcuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBoYW5kbGVDb250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIGhhbmRsZUNvbnRhaW5lckV4aXQgXG5cbiAgICAjIEVuc3VyZSB0byBzZXR1cCBvblN0ZXBFbnRlciBoYW5kbGVyIG9ubHkgb25jZVxuICAgIHVubGVzcyBzY3JvbGxhbWFJbml0aWFsaXplZFxuICAgICAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBzY3JvbGxlci5vblN0ZXBFbnRlciAgaGFuZGxlU3RlcEVudGVyIFxuICAgICAgXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgaGFuZGxlUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcidcbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IChncmFwaFdpZHRoIC8gMjApIC0gMTBcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyKClcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNfZ25pLCBjb3VudHJpZXNfcG9wdWxhdGlvbikgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3VubWV0LW5lZWRzLWdkcC1jb250YWluZXItZ3JhcGgnXG5cbiAgICAjIHBhcnNlIGRhdGFcbiAgICBkYXRhID0gW11cbiAgICBkYXRhX3VubWV0bmVlZHMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGNvdW50cnlfZ25pID0gY291bnRyaWVzX2duaS5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGNvdW50cnlfcG9wID0gY291bnRyaWVzX3BvcHVsYXRpb24uZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBpZiBjb3VudHJ5X2duaVswXSBhbmQgY291bnRyeV9nbmlbMF1bJzIwMTYnXVxuICAgICAgICAgIGRhdGEucHVzaFxuICAgICAgICAgICAgdmFsdWU6ICtkWycyMDE3J11cbiAgICAgICAgICAgIG5hbWU6IGNvdW50cnlfZ25pWzBdLm5hbWVcbiAgICAgICAgICAgIHJlZ2lvbjogY291bnRyeV9nbmlbMF0ucmVnaW9uXG4gICAgICAgICAgICBwb3B1bGF0aW9uOiBjb3VudHJ5X3BvcFswXVsnMjAxNSddXG4gICAgICAgICAgICBnbmk6IGNvdW50cnlfZ25pWzBdWycyMDE2J11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ05vIEdOSSBvciBQb3B1bGF0aW9uIGRhdGEgZm9yIHRoaXMgY291bnRyeScsIGQuY29kZSwgY291bnRyeV9nbmlbMF1cbiAgICAjIGNsZWFyIGl0ZW1zIHdpdGhvdXQgdW5tZXQtbmVlZHMgdmFsdWVzXG4gICAgI2RhdGEgPSBkYXRhLmZpbHRlciAoZCkgLT4gZC5nZHAgYW5kIGRbJ3VubWV0LW5lZWRzJ10gXG4gICAgIyMjXG4gICAgdW5tZXROZWVkc0dkcEdyYXBoID0gbmV3IHdpbmRvdy5TY2F0dGVycGxvdFVubWV0TmVlZHNHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICdnbmknXG4gICAgICAgIHk6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICBjb2xvcjogJ2duaScgIydyZWdpb24nXG4gICAgICAgIHNpemU6ICdwb3B1bGF0aW9uJ1xuICAgICMgc2V0IGRhdGFcbiAgICAjIyNcbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAnZ25pJ1xuICAgICAgICB5OiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgc2l6ZTogJ3BvcHVsYXRpb24nXG4gICAgICAgIGNvbG9yOiAnZ25pJ1xuICAgICAgZG90TWluU2l6ZTogMVxuICAgICAgZG90TWF4U2l6ZTogMTJcbiAgICB1bm1ldG5lZWRzR3JhcGguc2V0RGF0YSBkYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1bm1ldG5lZWRzR3JhcGgub25SZXNpemVcblxuXG4gICMgVXNlICYgUmVhc29ucyBtYXBzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyA9IChkYXRhX3VzZSwgY291bnRyaWVzLCBtYXApIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuXG4gICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAjZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgIyBTZXQgdXNlIG1hcFxuICAgIHVzZU1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogMjBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IHRydWVcbiAgICAgIGxhbmc6IGxhbmdcbiAgICB1c2VNYXAuc2V0RGF0YSBkYXRhX3VzZSwgbWFwXG4gICAgdXNlTWFwLm9uUmVzaXplKClcblxuICAgICMgc2V0dXAgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VNYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgUmVhc29ucyBHcmFwaHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29udHJhY2VwdGl2ZXNSZWFzb25zID0gKGRhdGFfcmVhc29ucywgY291bnRyaWVzKSAtPlxuXG4gICAgcmVhc29uSGVhbHRoID0gW11cbiAgICByZWFzb25Ob3RTZXggPSBbXVxuICAgIHJlYXNvbk9wcG9zZWQgPSBbXVxuICAgIHJlYXNvbk9wcG9zZWRSZXNwb25kZW50ID0gW11cbiAgICByZWFzb25PcHBvc2VkSHVzYmFuZCA9IFtdXG4gICAgcmVhc29uT3Bwb3NlZFJlbGlnaW91cyA9IFtdXG5cbiAgICByZWFzb25zS2V5cyA9IE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpXG5cbiAgICAjIHBhcnNlIHJlYXNvbnMgZGF0YVxuICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgIyMjXG4gICAgICByZWFzb25zS2V5cy5mb3JFYWNoIChyZWFzb24pIC0+XG4gICAgICAgIGRbcmVhc29uXSA9ICtkW3JlYXNvbl1cbiAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgY29uc29sZS5sb2cgJ0FsZXJ0ISBWYWx1ZSBncmVhdGVyIHRoYW4gemVyby4gJyArIGQuY291bnRyeSArICcsICcgKyByZWFzb24gKyAnOiAnICsgZFtyZWFzb25dXG4gICAgICAjIyNcbiAgICAgIHJlYXNvbkhlYWx0aC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5vK2QucCtkLnQgIyBoZWFsdGggY29uY2VybnMgKyBmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnMgKyBpbnRlcmZlcmVzIHdpdGggYm9kecKScyBwcm9jZXNzZXNcbiAgICAgIHJlYXNvbk5vdFNleC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5iICMgbm90IGhhdmluZyBzZXhcbiAgICAgIHJlYXNvbk9wcG9zZWQucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQuaStkLmorZC5rK2QubCAjwqByZXNwb25kZW50IG9wcG9zZWQgKyBodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZCArIG90aGVycyBvcHBvc2VkICsgcmVsaWdpb3VzIHByb2hpYml0aW9uXG4gICAgICByZWFzb25PcHBvc2VkUmVzcG9uZGVudC5wdXNoXG4gICAgICAgIG5hbWU6IGQubmFtZVxuICAgICAgICB2YWx1ZTogZC5pICPCoHJlc3BvbmRlbnQgb3Bwb3NlZFxuICAgICAgcmVhc29uT3Bwb3NlZEh1c2JhbmQucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQuaiAjwqByaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcbiAgICAgIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMucHVzaFxuICAgICAgICBuYW1lOiBkLm5hbWVcbiAgICAgICAgdmFsdWU6IGQubCAjwqByZWxpZ2lvdXMgcHJvaGliaXRpb25cblxuICAgIHNvcnRBcnJheSA9IChhLGIpIC0+IHJldHVybiBiLnZhbHVlLWEudmFsdWVcbiAgICByZWFzb25IZWFsdGguc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25Ob3RTZXguc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkLnNvcnQgc29ydEFycmF5XG4gICAgcmVhc29uT3Bwb3NlZFJlc3BvbmRlbnQuc29ydCBzb3J0QXJyYXlcbiAgICByZWFzb25PcHBvc2VkSHVzYmFuZC5zb3J0IHNvcnRBcnJheVxuICAgIHJlYXNvbk9wcG9zZWRSZWxpZ2lvdXMuc29ydCBzb3J0QXJyYXlcblxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLWhlYWx0aCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJykuc2V0RGF0YSByZWFzb25IZWFsdGguc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnLFxuICAgICAga2V5OlxuICAgICAgICBpZDogJ25hbWUnXG4gICAgICAgIHg6ICd2YWx1ZScpLnNldERhdGEgcmVhc29uT3Bwb3NlZC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtbm90LXNleCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJykuc2V0RGF0YSByZWFzb25Ob3RTZXguc2xpY2UoMCw1KVxuICAgIG5ldyB3aW5kb3cuQmFySG9yaXpvbnRhbEdyYXBoKCdjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtcmVzcG9uZGVudCcsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJ1xuICAgICAgeEF4aXM6IFs1MCwgMTAwXSkuc2V0RGF0YSByZWFzb25PcHBvc2VkUmVzcG9uZGVudC5zbGljZSgwLDUpXG4gICAgbmV3IHdpbmRvdy5CYXJIb3Jpem9udGFsR3JhcGgoJ2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1odXNiYW5kJyxcbiAgICAgIGtleTpcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgICB4OiAndmFsdWUnXG4gICAgICB4QXhpczogWzUwLCAxMDBdKS5zZXREYXRhIHJlYXNvbk9wcG9zZWRIdXNiYW5kLnNsaWNlKDAsNSlcbiAgICBuZXcgd2luZG93LkJhckhvcml6b250YWxHcmFwaCgnY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLXJlbGlnaW91cycsXG4gICAgICBrZXk6XG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgICAgeDogJ3ZhbHVlJ1xuICAgICAgeEF4aXM6IFs1MCwgMTAwXSkuc2V0RGF0YSByZWFzb25PcHBvc2VkUmVsaWdpb3VzLnNsaWNlKDAsNSlcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIFRyZWVuYXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCA9IChkYXRhX3VzZSkgLT5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBzZXR1cFNjcm9sbGFtYSAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuICAgICMgc2V0dXAgdHJlZW1hcFxuICAgIHVzZVRyZWVtYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICBtZXRob2RzS2V5czogbWV0aG9kc19rZXlzXG4gICAgICBtZXRob2RzTmFtZXM6IG1ldGhvZHNfbmFtZXNbbGFuZ11cbiAgICAjIHNldCBkYXRhXG4gICAgdXNlVHJlZW1hcC5zZXREYXRhIGRhdGFfdXNlLCB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG4gICAgIyBzZXQgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VUcmVlbWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIEFwcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnRyYWNlcHRpdmVzQXBwID0gKGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucykgLT5cbiAgICAjwqBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtYXBwLWNvbnRhaW5lcidcbiAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwIC5zZWxlY3QtY291bnRyeScpXG4gICAgICAuY2hhbmdlIC0+XG4gICAgICAgIGNvdW50cnlfY29kZSA9ICQodGhpcykudmFsKClcbiAgICAgICAgY29uc29sZS5sb2cgJ2NoYW5nZScsIGNvdW50cnlfY29kZVxuICAgICAgICAjIFVzZVxuICAgICAgICBkYXRhX3VzZV9jb3VudHJ5ID0gZGF0YV91c2UuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICAgIGlmIGRhdGFfdXNlX2NvdW50cnkgYW5kIGRhdGFfdXNlX2NvdW50cnlbMF1cbiAgICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBtZXRob2RzX2tleXMubWFwIChrZXksIGkpIC0+IHsnbmFtZSc6IG1ldGhvZHNfbmFtZXNbbGFuZ11baV0sICd2YWx1ZSc6ICtkYXRhX3VzZV9jb3VudHJ5WzBdW2tleV19XG4gICAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrZGF0YV91c2VfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZC12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZChjb3VudHJ5X21ldGhvZHNbMF0udmFsdWUpKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdXNlJykuc2hvdygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuICAgICAgICAjIFVubWV0bmVlZHNcbiAgICAgICAgZGF0YV91bm1ldG5lZWRzX2NvdW50cnkgPSBkYXRhX3VubWV0bmVlZHMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICAgIGlmIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5IGFuZCBkYXRhX3VubWV0bmVlZHNfY291bnRyeVswXVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS11bm1ldG5lZWRzJykuaHRtbCBNYXRoLnJvdW5kKCtkYXRhX3VubWV0bmVlZHNfY291bnRyeVswXVsnMjAxNyddKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuICAgICAgICAjIFJlYXNvbnNcbiAgICAgICAgZGF0YV9yZWFzb25zX2NvdW50cnkgPSBkYXRhX3JlYXNvbnMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICAgIGlmIGRhdGFfcmVhc29uc19jb3VudHJ5IGFuZCBkYXRhX3JlYXNvbnNfY291bnRyeVswXVxuICAgICAgICAgIHJlYXNvbnMgPSBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzKS5tYXAgKHJlYXNvbikgLT4geyduYW1lJzogcmVhc29uc19uYW1lc1tyZWFzb25dLCAndmFsdWUnOiArZGF0YV9yZWFzb25zX2NvdW50cnlbMF1bcmVhc29uXX1cbiAgICAgICAgICByZWFzb25zID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvbnNbMF0ubmFtZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQocmVhc29uc1swXS52YWx1ZSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuaGlkZSgpXG4gICAgICAudmFsIHVzZXJDb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICMgISEhIFRPRE8gLT4gVXNlIGEgc2luZ2xlIGNvdW50cmllcyBmaWxlIHdpdGggZ25pICYgcG9wdWxhdGlvbiBpbmZvIFxuICBkMy5xdWV1ZSgpXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLScrbGFuZysnLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLXBvcHVsYXRpb24tJytsYW5nKycuY3N2J1xuICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgLmRlZmVyIGQzLmpzb24sICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIGNvdW50cmllc19nbmksIGNvdW50cmllc19wb3B1bGF0aW9uLCBtYXAsIGxvY2F0aW9uKSAtPlxuXG4gICAgICBpZiBsb2NhdGlvblxuICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgIGVsc2VcbiAgICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuICAgICAgI3Rlc3Qgb3RoZXIgY291bnRyaWVzXG4gICAgICAjdXNlckNvdW50cnkuY29kZSA9ICdSVVMnXG4gICAgICAjdXNlckNvdW50cnkubmFtZSA9ICdSdXNpYSdcblxuICAgICAgIyBhZGQgY291bnRyeSBJU08gMzE2Ni0xIGFscGhhLTMgY29kZSB0byBkYXRhX3JlYXNvbnNcbiAgICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlMiA9PSBkLmNvZGVcbiAgICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICAgIGQuY29kZSA9IGl0ZW1bMF0uY29kZVxuICAgICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgIE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgICAgIGRbcmVhc29uXSA9IDEwMCpkW3JlYXNvbl1cbiAgICAgICAgICAgIGlmIGRbcmVhc29uXSA+IDEwMFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICAgICBkZWxldGUgZC5jb3VudHJ5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLndhcm4gJ05vIGNvdW50cnkgZGF0YSBmb3IgJytkLmNvZGVcblxuICAgICAgY29uc29sZS5sb2cgdXNlckNvdW50cnlcblxuICAgICAgaWYgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCBkYXRhX3VzZVxuXG4gICAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgZGF0YV91c2UsIGNvdW50cmllcywgbWFwXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGgoKVxuXG4gICAgICBpZiAkKCcjdW5tZXQtbmVlZHMtZ2RwLWdyYXBoJykubGVuZ3RoXG4gICAgICAgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoIGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzX2duaSwgY291bnRyaWVzX3BvcHVsYXRpb25cblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnRyYWNlcHRpdmVzUmVhc29ucyBkYXRhX3JlYXNvbnMsIGNvdW50cmllc1xuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29udHJhY2VwdGl2ZXNBcHAgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zXG5cbikgalF1ZXJ5XG4iXX0=
