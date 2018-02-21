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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ScrollGraph = (function() {
    function ScrollGraph(_id, _stepCallback) {
      this.onStepEnter = bind(this.onStepEnter, this);
      this.onContainerExit = bind(this.onContainerExit, this);
      this.onContainerEnter = bind(this.onContainerEnter, this);
      this.onResize = bind(this.onResize, this);
      this.id = _id;
      this.stepCallback = _stepCallback;
      this.container = d3.select('#' + this.id);
      this.graphic = this.container.select('.scroll-graphic');
      this.steps = this.container.selectAll('.scroll-text .step');
      this.chart = this.graphic.select('.graph-container');
      this.scroller = scrollama();
      this.onResize();
      this.scroller.setup({
        container: '#' + this.id,
        graphic: '#' + this.id + ' .scroll-graphic',
        step: '#' + this.id + ' .scroll-text .step',
        offset: 0.05,
        debug: false
      }).onContainerEnter(this.onContainerEnter).onContainerExit(this.onContainerExit).onStepEnter(this.onStepEnter);
      window.addEventListener('resize', this.onResize);
      return this;
    }

    ScrollGraph.prototype.onResize = function() {
      var height, width;
      width = this.graphic.node().getBoundingClientRect().width;
      height = Math.floor(window.innerHeight);
      this.steps.style('height', height + 'px');
      this.graphic.style('height', height + 'px');
      this.chart.style('width', width + 'px').style('height', height + 'px');
      return this.scroller.resize();
    };

    ScrollGraph.prototype.onContainerEnter = function(e) {
      return this.graphic.classed('is-fixed', true).classed('is-bottom', false);
    };

    ScrollGraph.prototype.onContainerExit = function(e) {
      return this.graphic.classed('is-fixed', false).classed('is-bottom', e.direction === 'down');
    };

    ScrollGraph.prototype.onStepEnter = function(e) {
      return this.stepCallback(e);
    };

    return ScrollGraph;

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
            cx_factor: 0.265,
            cy_factor: 0.297,
            r: 0,
            textOffset: [30, 25],
            label: {
              es: 'Canadá',
              en: 'Canada'
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
            cx_factor: 0.542,
            cy_factor: 0.345,
            r: 0,
            textOffset: [-12, 0],
            label: {
              es: 'Grecia',
              en: 'Greece'
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
        if (this.currentMethod) {
          $('#map-contraceptives-use-method').html(this.currentMethod.text[this.options.lang]);
          this.data.forEach((function(_this) {
            return function(d) {
              return d.value = +d[_this.currentMethod.id];
            };
          })(this));
          this.updateGraph(this.data);
          return this.setAnnotations();
        }
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

    BeeswarmScatterplotGraph.prototype.labels = ['AGO', 'BGD', 'BRA', 'CHN', 'DEU', 'ESP', 'ETH', 'IND', 'IDN', 'JPN', 'NGA', 'PAK', 'PHL', 'RUS', 'SAU', 'TUR', 'UGA', 'USA', 'VNM'];

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
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ContraceptivesApp = (function() {
    ContraceptivesApp.prototype.has_dhs = false;

    ContraceptivesApp.prototype.filter_keys = {
      'contraceptives-filter-0': 'residence',
      'contraceptives-filter-1': 'age',
      'contraceptives-filter-2': 'education',
      'contraceptives-filter-3': 'wealth'
    };

    function ContraceptivesApp(data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names) {
      this.onSelectFilter = bind(this.onSelectFilter, this);
      this.onSelectCountry = bind(this.onSelectCountry, this);
      this.data = {
        use: data_use,
        unmetneeds: data_unmetneeds,
        reasons: data_reasons
      };
      this.methodsKeys = methods_keys;
      this.methodsNames = methods_names;
      this.methodsDHSNames = methods_dhs_names;
      this.reasonsNames = reasons_names;
      this.reasonsDHSNames = reasons_dhs_names;
      this.$app = $('#contraceptives-app');
      this.$app.find('.select-country').select2().change(this.onSelectCountry).val(user_country.code).trigger('change');
      this.$app.find('.contraceptives-app-filters .btn').click(this.onSelectFilter);
      this.$app.css('opacity', 1);
    }

    ContraceptivesApp.prototype.onSelectCountry = function(e) {
      var countryReasons, countryUnmetneeds, countryUse, country_code, country_methods, method, method_value, reason, reason_value, reasons, unmetneeds, use;
      country_code = $(e.target).val();
      console.log(country_code);
      this.has_dhs = true;
      use = null;
      method = null;
      method_value = null;
      unmetneeds = null;
      reason = null;
      reason_value = null;
      this.$app.find('.contraceptives-app-filters').hide();
      if (this.has_dhs) {
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/UGIR52DT_all.csv', (function(_this) {
          return function(error, data) {
            var d;
            console.log(data);
            d = data[0];
            _this.setAppItemData(_this.$app, 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
            return _this.$app.find('.contraceptives-app-filters').show();
          };
        })(this));
      } else {
        countryUse = this.data.use.filter(function(d) {
          return d.code === country_code;
        });
        if (countryUse && countryUse[0]) {
          country_methods = this.methodsKeys.map((function(_this) {
            return function(key, i) {
              return {
                'name': _this.methodsNames[i],
                'value': +countryUse[0][key]
              };
            };
          })(this));
          country_methods = country_methods.sort(function(a, b) {
            return b.value - a.value;
          });
          use = countryUse[0]['Any modern method'];
          method = country_methods[0].name;
          method_value = country_methods[0].value;
        }
        countryUnmetneeds = this.data.unmetneeds.filter(function(d) {
          return d.code === country_code;
        });
        if (countryUnmetneeds && countryUnmetneeds[0]) {
          unmetneeds = countryUnmetneeds[0]['survey'] ? countryUnmetneeds[0]['survey'] : countryUnmetneeds[0]['estimated'];
        }
        countryReasons = this.data.reasons.filter(function(d) {
          return d.code === country_code;
        });
        if (countryReasons && countryReasons[0]) {
          reasons = Object.keys(this.reasonsNames).map((function(_this) {
            return function(reason) {
              return {
                'name': _this.reasonsNames[reason],
                'value': +countryReasons[0][reason]
              };
            };
          })(this));
          reasons = reasons.sort(function(a, b) {
            return b.value - a.value;
          });
          reason = reasons[0].name;
          reason_value = reasons[0].value;
        }
        return this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value);
      }
    };

    ContraceptivesApp.prototype.onSelectFilter = function(e) {
      var $target;
      e.preventDefault();
      if (this.filter !== $(e.target).attr('href').substring(1)) {
        this.$app.find('.contraceptives-app-filters .btn').removeClass('active');
        $target = $(e.target).addClass('active');
        this.filter = $target.attr('href').substring(1);
        $('.contraceptives-filter').hide();
        this.filterEl = $('#' + this.filter).show();
        console.log(this.filter);
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/UGIR52DT_' + this.filter_keys[this.filter] + '.csv', (function(_this) {
          return function(error, data) {
            console.log(data);
            if (data) {
              return data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
              });
            }
          };
        })(this));
      }
    };

    ContraceptivesApp.prototype.setAppItemData = function($el, use, method, method_value, unmetneeds, reason, reason_value) {
      console.log('setAppItemData', $el, use, method, method_value, unmetneeds, reason, reason_value);
      if (use) {
        $el.find('.contraceptives-app-data-use').html(Math.round(+use) + '%');
        $el.find('.contraceptives-app-data-main-method').html(method);
        $el.find('.contraceptives-app-data-main-method-value').html(Math.round(+method_value) + '%');
        $el.find('.contraceptives-app-use').show();
      } else {
        $el.find('.contraceptives-app-use').hide();
      }
      if (unmetneeds) {
        $el.find('.contraceptives-app-data-unmetneeds').html(Math.round(+unmetneeds) + '%');
        $el.find('.contraceptives-app-unmetneeds').show();
      } else {
        $el.find('.contraceptives-app-unmetneeds').hide();
      }
      if (reason) {
        $el.find('.contraceptives-app-data-reason').html(reason);
        $el.find('.contraceptives-app-data-reason-value').html(Math.round(+reason_value) + '%');
        return $el.find('.contraceptives-app-reason').show();
      } else {
        return $el.find('.contraceptives-app-reason').hide();
      }
    };

    return ContraceptivesApp;

  })();

}).call(this);

(function() {
  (function($) {
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, onCarouselStep, reasons_dhs_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupDataArticle, setupReasonsOpposedGraph, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
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
    methods_dhs_names = {
      'es': {
        '1': "píldora",
        '2': "DIU",
        '3': "inyectable",
        '5': "condón",
        '6': "esterilización femenina",
        '7': "esterilización masculina",
        '8': "abstinencia periódica",
        '9': "marcha atrás",
        '10': "otros",
        '11': "implante",
        '13': "método de la amenorrea de la lactancia (MELA)",
        '17': "métodos tradicionales"
      },
      'en': {
        '1': "pill",
        '2': "IUD",
        '3': "injectable",
        '5': "condom",
        '6': "female sterilization",
        '7': "male sterilization",
        '8': "periodic abstinence",
        '9': "withdrawal",
        '10': "other",
        '11': "implant",
        '13': "lactational amenorrhea method (LAM)",
        '17': "traditional methods"
      }
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
      'es': {
        "a": "no están casadas",
        "b": "no tienen sexo",
        "c": "tienen sexo infrecuente",
        "d": "menopausia o esterilización",
        "e": "son subfecundas o infecundas",
        "f": "amenorrea postparto",
        "g": "están dando el pecho",
        "h": "fatalista",
        "i": "la mujer se opone",
        "j": "el marido o la pareja se opone",
        "k": "otros se oponen",
        "l": "prohibición religiosa",
        "m": "no conoce los métodos",
        "n": "no conoce ninguna fuente donde adquirirlos",
        "o": "preocupaciones de salud",
        "p": "miedo a los efectos secundarios/preocupaciones de salud",
        "q": "falta de acceso/muy lejos",
        "r": "cuestan demasiado",
        "s": "inconvenientes para su uso",
        "t": "interfiere con los procesos del cuerpo",
        "u": "el método elegido no está disponible",
        "v": "no hay métodos disponibles",
        "w": "(no estándar)",
        "x": "otros",
        "z": "no lo sé"
      },
      'en': {
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
        "t": "interferes with body's processes",
        "u": "preferred method not available",
        "v": "no method available",
        "w": "(no estándar)",
        "x": "other",
        "z": "don't know"
      }
    };
    reasons_dhs_names = {
      'es': {
        'v3a08a': 'no están casadas',
        'v3a08b': 'no tienen sexo',
        'v3a08c': 'tienen sexo infrecuente',
        'v3a08d': 'menopausia o esterilización',
        'v3a08e': 'son subfecundas o infecundas',
        'v3a08f': 'amenorrea postparto',
        'v3a08g': 'están dando el pecho',
        'v3a08h': 'fatalista',
        'v3a08i': 'la mujer se opone',
        'v3a08j': 'el marido o la pareja se opone',
        'v3a08k': 'otros se oponen',
        'v3a08l': 'prohibición religiosa',
        'v3a08m': 'no conoce los métodos',
        'v3a08n': 'no conoce ninguna fuente donde adquirirlos',
        'v3a08o': 'preocupaciones de salud',
        'v3a08p': 'miedo a los efectos secundarios',
        'v3a08q': 'falta de acceso/muy lejos',
        'v3a08r': 'cuestan demasiado',
        'v3a08s': 'inconvenientes para su uso',
        'v3a08t': "interfiere con los procesos del cuerpo"
      },
      'en': {
        'v3a08a': 'not married',
        'v3a08b': 'not having sex',
        'v3a08c': 'infrequent sex',
        'v3a08d': 'menopausal/hysterectomy',
        'v3a08e': 'subfecund/infecund',
        'v3a08f': 'postpartum amenorrheic',
        'v3a08g': 'breastfeeding',
        'v3a08h': 'fatalistic',
        'v3a08i': 'respondent opposed',
        'v3a08j': 'husband/partner opposed',
        'v3a08k': 'others opposed',
        'v3a08l': 'religious prohibition',
        'v3a08m': 'knows no method',
        'v3a08n': 'knows no source',
        'v3a08o': 'health concerns',
        'v3a08p': 'fear of side effects',
        'v3a08q': 'lack of access/too far',
        'v3a08r': 'costs too much',
        'v3a08s': 'inconvenient to use',
        'v3a08t': "interferes with the body's processes"
      }
    };
    setupConstraceptivesUseGraph = function() {
      var dataIndex, graphWidth, j, resizeHandler, results;
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
      new ScrollGraph('contraceptives-use-graph-container', function(e) {
        var currentStep, data, from, to;
        currentStep = +d3.select(e.element).attr('data-step');
        if (currentStep > 0) {
          data = [63, 88, 100];
          from = currentStep > 1 ? data[currentStep - 2] : 0;
          to = data[currentStep - 1];
          return useGraph.selectAll('li').filter(function(d) {
            return d >= from && d < to;
          }).classed('fill-' + currentStep, e.direction === 'down');
        }
      });
      resizeHandler();
      return window.addEventListener('resize', resizeHandler);
    };
    setupUnmetNeedsGdpGraph = function(data_unmetneeds, countries) {
      var data;
      data = [];
      data_unmetneeds.forEach(function(d) {
        var country;
        country = countries.filter(function(e) {
          return e.code === d.code;
        });
        if (country[0] && country[0]['gni']) {
          return data.push({
            value: +d['estimated'],
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
      new ScrollGraph('unmet-needs-gdp-container-graph', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        return unmetneedsGraph.setMode(currentStep);
      });
      return $(window).resize(unmetneedsGraph.onResize);
    };
    setupConstraceptivesMaps = function(data_use, countries, map) {
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
      new ScrollGraph('contraceptives-use-container', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        return useMap.setMapState(currentStep);
      });
      useMap.onResize();
      return $(window).resize(useMap.onResize);
    };
    setupConstraceptivesUseTreemap = function(data_use) {
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
      new ScrollGraph('treemap-contraceptives-use-container', function(e) {
        var currentStep;
        currentStep = +d3.select(e.element).attr('data-step');
        if (currentStep === 1) {
          return useTreemap.updateData('world', 'Mundo');
        } else if (currentStep === 0 && e.direction === 'up') {
          return useTreemap.updateData(userCountry.code, userCountry.name);
        }
      });
      return $(window).resize(useTreemap.onResize);
    };
    setupReasonsOpposedGraph = function() {
      var $bars;
      $bars = $('#contraceptives-reasons-opposed .bar');
      return $('#contraceptives-reasons-opposed-legend li').mouseover(function() {
        return $bars.addClass('disabled').filter('.bar-' + $(this).attr('class')).removeClass('disabled');
      }).mouseout(function() {
        return $bars.removeClass('disabled');
      });
    };
    onCarouselStep = function(e) {
      var currentStep;
      currentStep = d3.select(e.element).attr('data-step');
      this.graphic.selectAll('.active').classed('active', false);
      return this.graphic.select('.step-' + currentStep).classed('active', true);
    };
    setupDataArticle = function(error, data_use, data_unmetneeds, data_reasons, countries, map, location) {
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
          Object.keys(reasons_names[lang]).forEach(function(reason) {
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
      if ($('#carousel-marie-stopes').length) {
        new ScrollGraph('carousel-marie-stopes', onCarouselStep);
      }
      if ($('#contraceptives-reasons-opposed').length) {
        setupReasonsOpposedGraph();
      }
      if ($('#contraceptives-app').length) {
        return new ContraceptivesApp(data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
      }
    };
    if ($('body').hasClass('data') || $('body').hasClass('datos')) {
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').defer(d3.json, 'https://freegeoip.net/json/').await(setupDataArticle);
    } else if ($('body').hasClass('religion')) {
      if ($('#carousel-rabinos').length) {
        new ScrollGraph('carousel-rabinos', onCarouselStep);
      }
      if ($('#carousel-imam').length) {
        new ScrollGraph('carousel-imam', onCarouselStep);
      }
      if ($('#carousel-papa').length) {
        return new ScrollGraph('carousel-papa', onCarouselStep);
      }
    }
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwic2Nyb2xsLWdyYXBoLmNvZmZlZSIsIm1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtbWFwLWdyYXBoLmNvZmZlZSIsInRyZWVtYXAtZ3JhcGguY29mZmVlIiwiY29udHJhY2VwdGl2ZXMtdXNlLXRyZWVtYXAtZ3JhcGguY29mZmVlIiwiYmVlc3dhcm0tc2NhdHRlcnBsb3QtZ3JhcGguY29mZmVlIiwiY29udHJhY2VwdGl2ZXMtYXBwLmNvZmZlZSIsIm1haW4tY29udHJhY2VwdGl2ZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBTSxNQUFNLENBQUM7QUFFWCxRQUFBOztJQUFBLGNBQUEsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLEdBQUEsRUFBSyxDQUFMO1FBQ0EsS0FBQSxFQUFPLENBRFA7UUFFQSxNQUFBLEVBQVEsRUFGUjtRQUdBLElBQUEsRUFBTSxDQUhOO09BREY7TUFLQSxXQUFBLEVBQWEsTUFMYjtNQU1BLEtBQUEsRUFBTyxLQU5QO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxXQUFBLEVBQWEsSUFSYjtNQVNBLEdBQUEsRUFDRTtRQUFBLEVBQUEsRUFBSSxLQUFKO1FBQ0EsQ0FBQSxFQUFJLEtBREo7UUFFQSxDQUFBLEVBQUksT0FGSjtPQVZGOzs7SUFjRixhQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsV0FBQSxFQUFhLFlBRmI7TUFHQSxLQUFBLEVBQU0sT0FITjs7O0lBU1csbUJBQUMsRUFBRCxFQUFLLE9BQUw7Ozs7OztNQUNYLElBQUMsQ0FBQSxFQUFELEdBQVk7TUFDWixJQUFDLENBQUEsT0FBRCxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsY0FBbkIsRUFBbUMsT0FBbkM7TUFDWixJQUFDLENBQUEsR0FBRCxHQUFZLENBQUEsQ0FBRSxHQUFB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Q0FHRSxDQUFDLEtBSEgsQ0FHUyxFQUFFLENBQUMsR0FIWixFQUdrQixPQUFBLEdBQVEsa0NBSDFCLENBSUUsQ0FBQyxLQUpILENBSVMsRUFBRSxDQUFDLEdBSlosRUFJa0IsT0FBQSxHQUFRLHlDQUoxQixDQUtFLENBQUMsS0FMSCxDQUtTLEVBQUUsQ0FBQyxJQUxaLEVBS2tCLE9BQUEsR0FBUSwwQkFMMUIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxFQUFFLENBQUMsSUFOWixFQU1rQiw2QkFObEIsQ0FPRSxDQUFDLEtBUEgsQ0FPUyxnQkFQVCxFQUZGO0tBQUEsTUFXSyxJQUFHLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLFVBQW5CLENBQUg7TUFDSCxJQUFHLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLE1BQTFCO1FBQ00sSUFBQSxXQUFBLENBQVksa0JBQVosRUFBZ0MsY0FBaEMsRUFETjs7TUFFQSxJQUFHLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLE1BQXZCO1FBQ00sSUFBQSxXQUFBLENBQVksZUFBWixFQUE2QixjQUE3QixFQUROOztNQUVBLElBQUcsQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsTUFBdkI7ZUFDTSxJQUFBLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLGNBQTdCLEVBRE47T0FMRzs7RUEvZU4sQ0FBRCxDQUFBLENBdWZFLE1BdmZGO0FBQUEiLCJmaWxlIjoiY29udHJhY2VwdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQmFzZUdyYXBoXG5cbiAgb3B0aW9uc0RlZmF1bHQgPSBcbiAgICBtYXJnaW46XG4gICAgICB0b3A6IDBcbiAgICAgIHJpZ2h0OiAwXG4gICAgICBib3R0b206IDIwXG4gICAgICBsZWZ0OiAwXG4gICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgIGxhYmVsOiBmYWxzZSAgICAgICAgICAgIyBzaG93L2hpZGUgbGFiZWxzXG4gICAgbGVnZW5kOiBmYWxzZSAgICAgICAgICAjIHNob3cvaGlkZSBsZWdlbmRcbiAgICBtb3VzZUV2ZW50czogdHJ1ZSAgICAgICMgYWRkL3JlbW92ZSBtb3VzZSBldmVudCBsaXN0ZW5lcnNcbiAgICBrZXk6XG4gICAgICBpZDogJ2tleSdcbiAgICAgIHg6ICAna2V5JyAgICAgICAgICAgICMgbmFtZSBmb3IgeCBjb2x1bW5cbiAgICAgIHk6ICAndmFsdWUnICAgICAgICAgICMgbmFtZSBmb3IgeSBjb2x1bW5cblxuICBtYXJrZXJEZWZhdWx0ID1cbiAgICB2YWx1ZTogbnVsbFxuICAgIGxhYmVsOiAnJ1xuICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCdcbiAgICBhbGlnbjoncmlnaHQnXG4gXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBAaWQgICAgICAgPSBpZFxuICAgIEBvcHRpb25zICA9ICQuZXh0ZW5kIHRydWUsIHt9LCBvcHRpb25zRGVmYXVsdCwgb3B0aW9ucyAgIyBtZXJnZSBvcHRpb25zRGVmYXVsdCAmIG9wdGlvbnNcbiAgICBAJGVsICAgICAgPSAkKCcjJytAaWQpXG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEBzZXRTVkcoKVxuICAgIEBzZXRTY2FsZXMoKVxuICAgIEBtYXJrZXJzID0gW11cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYWluIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBzZXRTVkc6IC0+XG4gICAgQHN2ZyA9IGQzLnNlbGVjdCgnIycrQGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0ciAnd2lkdGgnLCBAY29udGFpbmVyV2lkdGhcbiAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgQGNvbnRhaW5lciA9IEBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBAb3B0aW9ucy5tYXJnaW4ubGVmdCArICcsJyArIEBvcHRpb25zLm1hcmdpbi50b3AgKyAnKSdcblxuICBsb2FkRGF0YTogKHVybCkgLT5cbiAgICBkMy5jc3YgdXJsLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgQHNldERhdGEgZGF0YVxuICAgIHJldHVybiBAXG4gICAgXG4gIHNldERhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAZHJhd1NjYWxlcygpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdNYXJrZXJzKClcbiAgICBAZHJhd0dyYXBoKClcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBkYXRhUGFyc2VyOiAoZGF0YSkgLT5cbiAgICByZXR1cm4gZGF0YVxuICBcbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0R3JhcGg6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldFNjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvbiBcbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgIyBzZXQgeSBheGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd5IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFswLCBAd2lkdGhdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZUmFuZ2U6IC0+XG4gICAgcmV0dXJuIFtAaGVpZ2h0LCAwXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWERvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZHJhd0xlZ2VuZDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBNYXJrZXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS1cblxuICBhZGRNYXJrZXI6IChtYXJrZXIpIC0+XG4gICAgQG1hcmtlcnMucHVzaCAkLmV4dGVuZCB7fSwgbWFya2VyRGVmYXVsdCwgbWFya2VyXG4gICAgcmV0dXJuIEBcblxuICBkcmF3TWFya2VyczogLT4gXG4gICAgIyBEcmF3IG1hcmtlciBsaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXInKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXInXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgIyBEcmF3IG1hcmtlciBsYWJlbFxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyLWxhYmVsJ1xuICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJyB0aGVuICdtaWRkbGUnIGVsc2UgaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gJ2VuZCcgZWxzZSAnc3RhcnQnXG4gICAgICAuYXR0ciAnZHknLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAnLTAuMjVlbScgZWxzZSAwXG4gICAgICAudGV4dCAoZCkgLT4gZC5sYWJlbFxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcblxuICBzZXR1cE1hcmtlckxpbmU6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIDAgZWxzZSBAeChkLnZhbHVlKVxuICAgICAgLmF0dHIgJ3kxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSAwXG4gICAgICAuYXR0ciAneDInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAd2lkdGggZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCBcblxuICBzZXR1cE1hcmtlckxhYmVsOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneCcsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIChpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiBAd2lkdGggZWxzZSAwICkgZWxzZSBAeChkLnZhbHVlKSBcbiAgICAgIC5hdHRyICd5JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0ICAgXG5cblxuICAjIFJlc2l6ZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgb25SZXNpemU6ID0+XG4gICAgQGdldERpbWVuc2lvbnMoKVxuICAgIEB1cGRhdGVHcmFwaERpbWVuc2lvbnMoKVxuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIHN2ZyBkaW1lbnNpb25cbiAgICBpZiBAc3ZnXG4gICAgICBAc3ZnXG4gICAgICAgIC5hdHRyICd3aWR0aCcsICBAY29udGFpbmVyV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICAjIHVwZGF0ZSBzY2FsZXMgZGltZW5zaW9uc1xuICAgIGlmIEB4XG4gICAgICBAeC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIGlmIEB5XG4gICAgICBAeS5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgdXBkYXRlIGF4aXMgZGltZW5zaW9uc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgIyB1cGRhdGUgbWFya2Vyc1xuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcrQGhlaWdodCsnKSdcblxuICBzZXRZQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrQHdpZHRoKycsMCknXG5cblxuICAjIEF1eGlsaWFyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0RGF0YVg6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnhdXG5cbiAgZ2V0RGF0YVk6IC0+XG4gICAgcmV0dXJuIGRbQG9wdGlvbnMua2V5LnldIiwiY2xhc3Mgd2luZG93LlNjcm9sbEdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKF9pZCwgX3N0ZXBDYWxsYmFjaykgLT5cbiAgICBAaWQgPSBfaWRcbiAgICBAc3RlcENhbGxiYWNrID0gX3N0ZXBDYWxsYmFja1xuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZClcbiAgICBAZ3JhcGhpYyAgID0gQGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtZ3JhcGhpYycpXG4gICAgQHN0ZXBzICAgICA9IEBjb250YWluZXIuc2VsZWN0QWxsKCcuc2Nyb2xsLXRleHQgLnN0ZXAnKVxuICAgIEBjaGFydCAgICAgPSBAZ3JhcGhpYy5zZWxlY3QoJy5ncmFwaC1jb250YWluZXInKVxuICAgICMgaW5pdGlhbGl6ZSBzY3JvbGxhbWFcbiAgICBAc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuICAgICMgc3RhcnQgaXQgdXBcbiAgICAjIDEuIGNhbGwgYSByZXNpemUgb24gbG9hZCB0byB1cGRhdGUgd2lkdGgvaGVpZ2h0L3Bvc2l0aW9uIG9mIGVsZW1lbnRzXG4gICAgQG9uUmVzaXplKClcbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgQHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK0BpZCAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcjJytAaWQrJyAuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHN0ZXA6ICAgICAgICcjJytAaWQrJyAuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBAb25Db250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIEBvbkNvbnRhaW5lckV4aXRcbiAgICAgIC5vblN0ZXBFbnRlciAgICAgIEBvblN0ZXBFbnRlclxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIEBvblJlc2l6ZVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gIG9uUmVzaXplOiA9PlxuICAgIHdpZHRoID0gQGdyYXBoaWMubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICNNYXRoLmZsb29yIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgIEBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICBAZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgQGNoYXJ0XG4gICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQrJ3B4J1xuICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICBAc2Nyb2xsZXIucmVzaXplKClcblxuICAjIHN0aWNreSB0aGUgZ3JhcGhpY1xuICBvbkNvbnRhaW5lckVudGVyOiAoZSkgPT5cbiAgICBAZ3JhcGhpY1xuICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgIyB1bi1zdGlja3kgdGhlIGdyYXBoaWMsIGFuZCBwaW4gdG8gdG9wL2JvdHRvbSBvZiBjb250YWluZXJcbiAgb25Db250YWluZXJFeGl0OiAoZSkgPT5cbiAgICBAZ3JhcGhpY1xuICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgZmFsc2VcbiAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAjIGNhbGwgc3RlcENhbGxiYWNrIG9uIGVudGVyIHN0ZXBcbiAgb25TdGVwRW50ZXI6IChlKSA9PlxuICAgIEBzdGVwQ2FsbGJhY2soZSlcbiIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbkl0ZW1XaWR0aCA9IDMwXG4gICAgbGVnZW5kRGF0YSA9IEBnZXRMZWdlbmREYXRhKClcbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGkrMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IEBnZXRMZWdlbmRGb3JtYXRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoIGV4dGVuZHMgd2luZG93Lk1hcEdyYXBoXG5cbiAgY3VycmVudFN0YXRlOiAwXG5cbiAgc3RhdGVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdGZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBmZW1lbmluYSdcbiAgICAgICAgZW46ICdmZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDhcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yMCwgMzBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0luZGlhJ1xuICAgICAgICAgICAgZW46ICdJbmRpYSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40NjVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzIwLCAtNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVww7pibGljYSBEb21pbmljYW5hJ1xuICAgICAgICAgICAgZW46ICdEb21pbmljYW4gUmVwdWJsaWMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYSdcbiAgICAgICAgZW46ICdtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yNjVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMjk3XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFszMCwgMjVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NhbmFkw6EnXG4gICAgICAgICAgICBlbjogJ0NhbmFkYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzRcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ29yZWEgZGVsIE5vcnRlJ1xuICAgICAgICAgICAgZW46ICdOb3J0aCBLb3JlYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2hpbmEnXG4gICAgICAgICAgICBlbjogJ0NoaW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ1BpbGwnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdww61sZG9yYSdcbiAgICAgICAgZW46ICdwaWxsJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxNlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTM1LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBcmdlbGlhJ1xuICAgICAgICAgICAgZW46ICdBbGdlcmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgY29uZG9tJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncHJlc2VydmF0aXZvIG1hc2N1bGlubydcbiAgICAgICAgZW46ICdtYWxlIGNvbmRvbSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU0MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zNDVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnR3JlY2lhJ1xuICAgICAgICAgICAgZW46ICdHcmVlY2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjczXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgLTEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCb3RzdWFuYSdcbiAgICAgICAgICAgIGVuOiAnQm90c3dhbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSW5qZWN0YWJsZSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2lueWVjdGFibGUnXG4gICAgICAgIGVuOiAnaW5qZWN0YWJsZSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjYyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjU2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnRXRpb3DDrWEnXG4gICAgICAgICAgICBlbjogJ0V0aGlvcGlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzE4XG4gICAgICAgICAgcjogMTZcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTI2LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCYWxjYW5lcydcbiAgICAgICAgICAgIGVuOiAnQmFsa2FucydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMzMlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEwLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBbGJhbmlhJ1xuICAgICAgICAgICAgZW46ICdBbGJhbmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgZ2V0TGVnZW5kRGF0YTogLT5cbiAgICByZXR1cm4gWzAsMjAsNDAsNjAsODBdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZCsnJSdcblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBvZmZzZXQgPSAxMDBcbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLW9mZnNldFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAjIGF2b2lkIGdyYXBoIGhlaWdodCBvdmVyZmxvdyBicm93c2VyIGhlaWdodCBcbiAgICAgIGlmIEBjb250YWluZXJIZWlnaHQgPiBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJXaWR0aCA9IEBjb250YWluZXJIZWlnaHQgLyBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgICAjQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICAjZWxzZVxuICAgICAgIyAgQCRlbC5jc3MgJ3RvcCcsIChib2R5SGVpZ2h0LUBjb250YWluZXJIZWlnaHQpIC8gMlxuICAgICAgQHdpZHRoICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcblxuXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgc3VwZXIobWFwKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICByZXR1cm4gQFxuXG4gIHNldE1hcFN0YXRlOiAoc3RhdGUpIC0+XG4gICAgaWYgc3RhdGUgIT0gQGN1cnJlbnRTdGF0ZVxuICAgICAgI2NvbnNvbGUubG9nICdzZXQgc3RhdGUgJytzdGF0ZVxuICAgICAgQGN1cnJlbnRTdGF0ZSA9IHN0YXRlXG4gICAgICBAY3VycmVudE1ldGhvZCA9IEBzdGF0ZXNbQGN1cnJlbnRTdGF0ZS0xXVxuICAgICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgICAgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBAY3VycmVudE1ldGhvZC50ZXh0W0BvcHRpb25zLmxhbmddXG4gICAgICAgIEBkYXRhLmZvckVhY2ggKGQpID0+IGQudmFsdWUgPSArZFtAY3VycmVudE1ldGhvZC5pZF1cbiAgICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4gICAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgIEBjdXJyZW50TWV0aG9kLmxhYmVscy5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC5jeCA9IGQuY3hfZmFjdG9yKkB3aWR0aFxuICAgICAgICBkLmN5ID0gZC5jeV9mYWN0b3IqQGhlaWdodFxuICAgICAgICBkLnRleHQgPSBkLmxhYmVsW0BvcHRpb25zLmxhbmddXG4gICAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBAY3VycmVudE1ldGhvZC5sYWJlbHNcbiIsImNsYXNzIHdpbmRvdy5UcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMubWluU2l6ZSA9IG9wdGlvbnMubWluU2l6ZSB8fCA2MFxuICAgIG9wdGlvbnMubm9kZXNQYWRkaW5nID0gb3B0aW9ucy5ub2Rlc1BhZGRpbmcgfHwgOFxuICAgIG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gfHwgNjAwXG4gICAgb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID0gb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IHx8IDYyMFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBkcmF3IHNjYWxlc1xuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBzZXRTVkcgdG8gdXNlIGEgZGl2IGNvbnRhaW5lciAobm9kZXMtY29udGFpbmVyKSBpbnN0ZWFkIG9mIGEgc3ZnIGVsZW1lbnRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGVzLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIEB0cmVlbWFwID0gZDMudHJlZW1hcCgpXG4gICAgICAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgICAgLnBhZGRpbmcgMFxuICAgICAgLnJvdW5kIHRydWVcblxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuXG4gICAgQHN0cmF0aWZ5ID0gZDMuc3RyYXRpZnkoKS5wYXJlbnRJZCAoZCkgLT4gZC5wYXJlbnRcblxuICAgIEB1cGRhdGVHcmFwaCgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG5cbiAgICAjIHVwZGF0ZSB0cmVtYXAgXG4gICAgQHRyZWVtYXBSb290ID0gQHN0cmF0aWZ5KEBkYXRhKVxuICAgICAgLnN1bSAoZCkgPT4gZFtAb3B0aW9ucy5rZXkudmFsdWVdXG4gICAgICAuc29ydCAoYSwgYikgLT4gYi52YWx1ZSAtIGEudmFsdWVcbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgbm9kZXMgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgXG4gICAgbm9kZXMuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZSdcbiAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwnXG4gICAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbC1jb250ZW50J1xuICAgICAgICAgIC5hcHBlbmQgJ3AnXG5cbiAgICAjIHNldHVwIG5vZGVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcblxuICAgICMgYWRkIGxhYmVsIG9ubHkgaW4gbm9kZXMgd2l0aCBzaXplIGdyZWF0ZXIgdGhlbiBvcHRpb25zLm1pblNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmNhbGwgICBAc2V0Tm9kZUxhYmVsXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgbm9kZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG4gICAgICBcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG5cbiAgc2V0Tm9kZURpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuICBzZXROb2RlTGFiZWw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLnNlbGVjdCgncCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gcmV0dXJuIGlmIGQudmFsdWUgPiAyNSB0aGVuICdzaXplLWwnIGVsc2UgaWYgZC52YWx1ZSA8IDEwIHRoZW4gJ3NpemUtcycgZWxzZSAnJ1xuICAgICAgLmh0bWwgKGQpID0+IGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgaXNOb2RlTGFiZWxWaXNpYmxlOiAoZCkgPT5cbiAgICByZXR1cm4gZC54MS1kLngwID4gQG9wdGlvbnMubWluU2l6ZSAmJiBkLnkxLWQueTAgPiBAb3B0aW9ucy5taW5TaXplXG5cbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUnXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAgIyBzZXQgcGFyc2VkRGF0YSBhcnJheVxuICAgIHBhcnNlZERhdGEgPSBbe2lkOiAncid9XSAjIGFkZCB0cmVlbWFwIHJvb3RcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICBpZiBkYXRhX2NvdW50cnlbMF1cbiAgICAgICMgc2V0IG1ldGhvZHMgb2JqZWN0XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgICBpZiBkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICAgIG1ldGhvZHNba2V5XSA9XG4gICAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgICAgbmFtZTogQG9wdGlvbnMubWV0aG9kc05hbWVzW2ldXG4gICAgICAgICAgICB2YWx1ZTogK2RhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIlRoZXJlJ3Mgbm8gZGF0YSBmb3IgXCIgKyBrZXlcbiAgICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIGlmIGtleSAhPSAnT3RoZXIgbW9kZXJuIG1ldGhvZHMnIGFuZCBrZXkgIT0gJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnIGFuZCBtZXRob2QudmFsdWUgPCA1XG4gICAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgICBkZWxldGUgbWV0aG9kc1trZXldXG4gICAgIFxuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBwYXJzZWREYXRhLnB1c2hcbiAgICAgICAgICBpZDogbWV0aG9kLmlkXG4gICAgICAgICAgcmF3X25hbWU6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArIG1ldGhvZC5uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLm5hbWUuc2xpY2UoMSkgKyAnPC9zdHJvbmc+PGJyLz4nICsgTWF0aC5yb3VuZChtZXRob2QudmFsdWUpICsgJyUnXG4gICAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIHBhcmVudDogJ3InXG4gICAgICBwYXJzZWREYXRhU29ydGVkID0gcGFyc2VkRGF0YS5zb3J0IChhLGIpIC0+IGlmIGEudmFsdWUgYW5kIGIudmFsdWUgdGhlbiBiLnZhbHVlLWEudmFsdWUgZWxzZSAxXG4gICAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cnknKS5odG1sIGNvdW50cnlfbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWFueS1tZXRob2QnKS5odG1sIE1hdGgucm91bmQoZGF0YV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgcGFyc2VkRGF0YVNvcnRlZFswXS5yYXdfbmFtZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnTm8gZGF0YSBjb3VudHJ5IGZvciAnK2NvdW50cnlfY29kZVxuICAgICAgIyBUT0RPISEhIFdoYXQgd2UgZG8gaWYgdGhlcmUncyBubyBkYXRhIGZvciB1c2VyJ3MgY291bnRyeVxuICAgIHJldHVybiBwYXJzZWREYXRhXG5cbiAgIyBvdmVyZHJpdmUgc2V0IGRhdGFcbiAgc2V0RGF0YTogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBvcmlnaW5hbERhdGEgPSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAZHJhd0dyYXBoKClcbiAgICAjQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIG5vZGUgY2xhc3NcbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUgbm9kZS0nK2QuaWRcblxuICAjIyMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb250YWluZXJPZmZzZXQ6IC0+XG4gICAgQCRlbC5jc3MoJ3RvcCcsICgkKHdpbmRvdykuaGVpZ2h0KCktQCRlbC5oZWlnaHQoKSkqMC41KVxuICAjIyMiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgaW5jb21lTGV2ZWxzOiBbMTAwNSwgMzk1NSwgMTIyMzVdXG5cbiAgbGFiZWxzOiBbXG4gICAgJ0FHTycsXG4gICAgJ0JHRCcsXG4gICAgJ0JSQScsXG4gICAgJ0NITicsXG4gICAgJ0RFVScsXG4gICAgJ0VTUCcsXG4gICAgJ0VUSCcsXG4gICAgJ0lORCcsXG4gICAgJ0lETicsXG4gICAgJ0pQTicsXG4gICAgJ05HQScsXG4gICAgJ1BBSycsXG4gICAgJ1BITCcsXG4gICAgJ1JVUycsXG4gICAgJ1NBVScsXG4gICAgJ1RVUicsXG4gICAgJ1VHQScsXG4gICAgJ1VTQScsXG4gICAgJ1ZOTSdcbiAgXVxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIHJldHVybiBkYXRhLnNvcnQgKGEsYikgPT4gYltAb3B0aW9ucy5rZXkuc2l6ZV0tYVtAb3B0aW9ucy5rZXkuc2l6ZV1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgIyBkcmF3IGRvdHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YSBAZGF0YVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdFxuICAgICAgIy5vbiAnbW91c2VvdmVyJywgKGQpID0+IGNvbnNvbGUubG9nIGRcblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmRhdGEgQGRhdGEuZmlsdGVyIChkKSA9PiBAbGFiZWxzLmluZGV4T2YoZFtAb3B0aW9ucy5rZXkuaWRdKSAhPSAtMVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpID0+IHJldHVybiBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDEwMDAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDE4MDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1tJyBlbHNlICdkb3QtbGFiZWwnXG4gICAgICAgICMuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgICAuYXR0ciAnZHknLCAnMC4yNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkubGFiZWxdXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG5cblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWSA9IGQzLmZvcmNlWSAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgZm9yY2VZLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVlcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWChAd2lkdGgqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAzNTBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgc2V0RG90OiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuYXR0ciAnZmlsbCcsIEBnZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXREb3RQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjeCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICdjeScsIEBnZXRQb3NpdGlvbllcblxuICBzZXREb3RMYWJlbFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAneScsIEBnZXRQb3NpdGlvbllcblxuICBnZXRQb3NpdGlvblg6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC54IGVsc2UgTWF0aC5yb3VuZCBAeChkW0BvcHRpb25zLmtleS54XSlcblxuICBnZXRQb3NpdGlvblk6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC55IGVsc2UgTWF0aC5yb3VuZCBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSAjaWYgQG9wdGlvbnMua2V5LmNvbG9yIGFuZCBAb3B0aW9ucy5tb2RlID09IDEgdGhlbiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdIGVsc2UgJyNlMjcyM2InXG5cbiAgc2V0TW9kZTogKG1vZGUpIC0+XG4gICAgQG9wdGlvbnMubW9kZSA9IG1vZGVcbiAgICBpZiBAb3B0aW9ucy5tb2RlIDwgMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAgIGlmIEB4TGVnZW5kXG4gICAgICAgIEB4TGVnZW5kLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgICAgIyBzaG93L2hpZGUgZG90IGxhYmVsc1xuICAgICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAwXG4gICAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDFcbiAgICAgICMgc2hvdy9oaWRlIHggYXhpcyBsaW5lc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPCBAaW5jb21lTGV2ZWxzWzJdIG9yIGRbQG9wdGlvbnMua2V5LnldID4gMTVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gM1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPiBAaW5jb21lTGV2ZWxzWzFdIG9yIGRbQG9wdGlvbnMua2V5LnldIDwgMzBcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNFxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGQuaWQgIT0gJ1NBVScgYW5kIGQuaWQgIT0gJ0pQTidcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNVxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICAjQHggPSBkMy5zY2FsZVBvdygpXG4gICAgIyAgLmV4cG9uZW50KDAuMTI1KVxuICAgICMgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB4ID0gZDMuc2NhbGVMb2coKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgIyBFcXVpdmFsZW50IHRvIGQzLnNjYWxlU3FydCgpXG4gICAgICAjwqBodHRwczovL2JsLm9ja3Mub3JnL2QzaW5kZXB0aC83NzVjZjQzMWU2NGI2NzE4NDgxYzA2ZmM0NWRjMzRmOVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0gIy5yZXZlcnNlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIEBpbmNvbWVMZXZlbHNcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtMSw1KSdcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyNTAsIDg1MDAwXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCAxMCwgMjAsIDMwXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuYXR0ciAneTEnLCBAeSg0MCktNFxuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzIC50aWNrIHRleHQnKVxuICAgICAgICAuYXR0ciAnZHgnLCAzXG4gICAgICAgIC5hdHRyICdkeScsIC00XG4gICAgIyBzZXQgeCBsZW5nZWRcbiAgICBpbmNvbWVzID0gQHhBeGlzLnRpY2tWYWx1ZXMoKVxuICAgIGluY29tZXMudW5zaGlmdCAwXG4gICAgaW5jb21lc01heCA9IEB4IEBnZXRTY2FsZVhEb21haW4oKVsxXVxuICAgIGluY29tZXMgPSBpbmNvbWVzLm1hcCAoZCkgPT4gaWYgZCA+IDAgdGhlbiAxMDAqQHgoZCkvaW5jb21lc01heCBlbHNlIDBcbiAgICBpbmNvbWVzLnB1c2ggMTAwXG4gICAgQHhMZWdlbmQgPSBkMy5zZWxlY3QoZDMuc2VsZWN0KCcjJytAaWQpLm5vZGUoKS5wYXJlbnROb2RlKS5zZWxlY3QoJy54LWxlZ2VuZCcpXG4gICAgQHhMZWdlbmQuc2VsZWN0QWxsKCdsaScpLnN0eWxlICd3aWR0aCcsIChkLGkpIC0+IChpbmNvbWVzW2krMV0taW5jb21lc1tpXSkrJyUnXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcbiIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGhhc19kaHM6IGZhbHNlICBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuXG4gIGNvbnN0cnVjdG9yOiAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzKSAtPlxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBjb3VudHJ5X2NvZGUgPSAkKGUudGFyZ2V0KS52YWwoKVxuICAgIGNvbnNvbGUubG9nIGNvdW50cnlfY29kZVxuXG4gICAgIyBjaGVjayBkaHMgZGF0YSBpcyBhdmFpbGFibGVcbiAgICBAaGFzX2RocyA9IHRydWVcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuaGlkZSgpXG5cbiAgICBpZiBAaGFzX2Roc1xuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvVUdJUjUyRFRfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgY29uc29sZS5sb2cgZGF0YVxuICAgICAgICBkID0gZGF0YVswXVxuICAgICAgICAjIHNldHVwIGRhdGFcbiAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcbiAgICAgICAgIyBzaG93IGZpbHRlcnNcbiAgICAgICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5VXNlIGFuZCBjb3VudHJ5VXNlWzBdXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIHVzZSAgICAgICAgICAgICA9IGNvdW50cnlVc2VbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ11cbiAgICAgICAgbWV0aG9kICAgICAgICAgID0gY291bnRyeV9tZXRob2RzWzBdLm5hbWVcbiAgICAgICAgbWV0aG9kX3ZhbHVlICAgID0gY291bnRyeV9tZXRob2RzWzBdLnZhbHVlXG4gICAgICAjIFVubWV0bmVlZHNcbiAgICAgIGNvdW50cnlVbm1ldG5lZWRzID0gQGRhdGEudW5tZXRuZWVkcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ10gXG4gICAgICAjIFJlYXNvbnNcbiAgICAgIGNvdW50cnlSZWFzb25zID0gQGRhdGEucmVhc29ucy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgQGZpbHRlciA9ICR0YXJnZXQuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuICAgICAgQGZpbHRlckVsID0gJCgnIycrQGZpbHRlcikuc2hvdygpXG4gICAgICBjb25zb2xlLmxvZyBAZmlsdGVyXG4gICAgICAjIGxvYWQgY3N2IGZpbGVcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zL1VHSVI1MkRUXycrQGZpbHRlcl9rZXlzW0BmaWx0ZXJdKycuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyBkYXRhXG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSkgLT5cblxuICAgIGNvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK21ldGhvZF92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIHVubWV0bmVlZHNcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrdW5tZXRuZWVkcykrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuXG4gICAgaWYgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrcmVhc29uX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gIHVzZVRyZWVtYXAgPSBudWxsXG4gIHVzZU1hcCA9IG51bGxcbiAgdXNlR3JhcGggPSBudWxsXG4gIHVubWV0bmVlZHNHcmFwaCA9IG51bGwgXG5cbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gIHNjcm9sbGFtYUluaXRpYWxpemVkID0gZmFsc2VcblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJpbXBsYW50ZVwiXG4gICAgICBcImlueWVjdGFibGVcIlxuICAgICAgXCJww61sZG9yYVwiXG4gICAgICBcImNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiY29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIm3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJhbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIm90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiZmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJpbXBsYW50XCJcbiAgICAgIFwiaW5qZWN0YWJsZVwiXG4gICAgICBcInBpbGxcIlxuICAgICAgXCJtYWxlIGNvbmRvbVwiXG4gICAgICBcImZlbWFsZSBjb25kb21cIlxuICAgICAgXCJ2YWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiZW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJvdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJzEnOiBcInDDrWxkb3JhXCJcbiAgICAgICcyJzogXCJESVVcIlxuICAgICAgJzMnOiBcImlueWVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmTDs25cIlxuICAgICAgJzYnOiBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICAnNyc6IFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICAnOCc6IFwiYWJzdGluZW5jaWEgcGVyacOzZGljYVwiXG4gICAgICAnOSc6IFwibWFyY2hhIGF0csOhc1wiXG4gICAgICAnMTAnOiBcIm90cm9zXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudGVcIlxuICAgICAgJzEzJzogXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgICcxNyc6IFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgJ2VuJzpcbiAgICAgICcxJzogXCJwaWxsXCJcbiAgICAgICcyJzogXCJJVURcIlxuICAgICAgJzMnOiBcImluamVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmRvbVwiXG4gICAgICAnNic6IFwiZmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgJzcnOiBcIm1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICAnOCc6IFwicGVyaW9kaWMgYWJzdGluZW5jZVwiXG4gICAgICAnOSc6IFwid2l0aGRyYXdhbFwiXG4gICAgICAnMTAnOiBcIm90aGVyXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudFwiXG4gICAgICAnMTMnOiBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgICcxNyc6IFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG5cblxuICAjIyNcbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcbiAgIyMjXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgICdlcyc6XG4gICAgICBcImFcIjogXCJubyBlc3TDoW4gY2FzYWRhc1wiXG4gICAgICBcImJcIjogXCJubyB0aWVuZW4gc2V4b1wiXG4gICAgICBcImNcIjogXCJ0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZVwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuXCJcbiAgICAgIFwiZVwiOiBcInNvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXNcIlxuICAgICAgXCJmXCI6IFwiYW1lbm9ycmVhIHBvc3RwYXJ0b1wiXG4gICAgICBcImdcIjogXCJlc3TDoW4gZGFuZG8gZWwgcGVjaG9cIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RhXCJcbiAgICAgIFwiaVwiOiBcImxhIG11amVyIHNlIG9wb25lXCJcbiAgICAgIFwialwiOiBcImVsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZVwiXG4gICAgICBcImtcIjogXCJvdHJvcyBzZSBvcG9uZW5cIiAgICAgICAgXG4gICAgICBcImxcIjogXCJwcm9oaWJpY2nDs24gcmVsaWdpb3NhXCIgIFxuICAgICAgXCJtXCI6IFwibm8gY29ub2NlIGxvcyBtw6l0b2Rvc1wiXG4gICAgICBcIm5cIjogXCJubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3NcIlxuICAgICAgXCJvXCI6IFwicHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgXCJwXCI6IFwibWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcy9wcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiIFxuICAgICAgXCJxXCI6IFwiZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvc1wiXG4gICAgICBcInJcIjogXCJjdWVzdGFuIGRlbWFzaWFkb1wiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzb1wiXG4gICAgICBcInRcIjogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgICBcInVcIjogXCJlbCBtw6l0b2RvIGVsZWdpZG8gbm8gZXN0w6EgZGlzcG9uaWJsZVwiXG4gICAgICBcInZcIjogXCJubyBoYXkgbcOpdG9kb3MgZGlzcG9uaWJsZXNcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3Ryb3NcIlxuICAgICAgXCJ6XCI6IFwibm8gbG8gc8OpXCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKSJ3MgcHJvY2Vzc2VzXCJcbiAgICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gIHJlYXNvbnNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAndjNhMDhhJzogJ25vIGVzdMOhbiBjYXNhZGFzJ1xuICAgICAgJ3YzYTA4Yic6ICdubyB0aWVuZW4gc2V4bydcbiAgICAgICd2M2EwOGMnOiAndGllbmVuIHNleG8gaW5mcmVjdWVudGUnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs24nXG4gICAgICAndjNhMDhlJzogJ3NvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXMnXG4gICAgICAndjNhMDhmJzogJ2FtZW5vcnJlYSBwb3N0cGFydG8nXG4gICAgICAndjNhMDhnJzogJ2VzdMOhbiBkYW5kbyBlbCBwZWNobydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RhJ1xuICAgICAgJ3YzYTA4aSc6ICdsYSBtdWplciBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGonOiAnZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4ayc6ICdvdHJvcyBzZSBvcG9uZW4nICAgICAgICBcbiAgICAgICd2M2EwOGwnOiAncHJvaGliaWNpw7NuIHJlbGlnaW9zYSdcbiAgICAgICd2M2EwOG0nOiAnbm8gY29ub2NlIGxvcyBtw6l0b2RvcydcbiAgICAgICd2M2EwOG4nOiAnbm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zJ1xuICAgICAgJ3YzYTA4byc6ICdwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZCdcbiAgICAgICd2M2EwOHAnOiAnbWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcydcbiAgICAgICd2M2EwOHEnOiAnZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvcydcbiAgICAgICd2M2EwOHInOiAnY3Vlc3RhbiBkZW1hc2lhZG8nXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudGVzIHBhcmEgc3UgdXNvJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICdlbic6IFxuICAgICAgJ3YzYTA4YSc6ICdub3QgbWFycmllZCdcbiAgICAgICd2M2EwOGInOiAnbm90IGhhdmluZyBzZXgnXG4gICAgICAndjNhMDhjJzogJ2luZnJlcXVlbnQgc2V4J1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2FsL2h5c3RlcmVjdG9teSdcbiAgICAgICd2M2EwOGUnOiAnc3ViZmVjdW5kL2luZmVjdW5kJ1xuICAgICAgJ3YzYTA4Zic6ICdwb3N0cGFydHVtIGFtZW5vcnJoZWljJ1xuICAgICAgJ3YzYTA4Zyc6ICdicmVhc3RmZWVkaW5nJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGljJ1xuICAgICAgJ3YzYTA4aSc6ICdyZXNwb25kZW50IG9wcG9zZWQnXG4gICAgICAndjNhMDhqJzogJ2h1c2JhbmQvcGFydG5lciBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4ayc6ICdvdGhlcnMgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGwnOiAncmVsaWdpb3VzIHByb2hpYml0aW9uJ1xuICAgICAgJ3YzYTA4bSc6ICdrbm93cyBubyBtZXRob2QnXG4gICAgICAndjNhMDhuJzogJ2tub3dzIG5vIHNvdXJjZSdcbiAgICAgICd2M2EwOG8nOiAnaGVhbHRoIGNvbmNlcm5zJ1xuICAgICAgJ3YzYTA4cCc6ICdmZWFyIG9mIHNpZGUgZWZmZWN0cydcbiAgICAgICd2M2EwOHEnOiAnbGFjayBvZiBhY2Nlc3MvdG9vIGZhcidcbiAgICAgICd2M2EwOHInOiAnY29zdHMgdG9vIG11Y2gnXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudCB0byB1c2UnXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZlcmVzIHdpdGggdGhlIGJvZHkncyBwcm9jZXNzZXNcIlxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgZGF0YUluZGV4ID0gWzAuLjk5XVxuICAgIHVzZUdyYXBoID0gZDMuc2VsZWN0KCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJylcbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcblxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IChncmFwaFdpZHRoIC8gMjApIC0gMTBcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBuZXcgU2Nyb2xsR3JhcGggJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICBpZiBjdXJyZW50U3RlcCA+IDBcbiAgICAgICAgZGF0YSA9IFs2MywgODgsIDEwMF0gIyA2MywgNjMrMjUsIDYzKzI1KzEyXG4gICAgICAgIGZyb20gPSBpZiBjdXJyZW50U3RlcCA+IDEgdGhlbiBkYXRhW2N1cnJlbnRTdGVwLTJdIGVsc2UgMFxuICAgICAgICB0byA9IGRhdGFbY3VycmVudFN0ZXAtMV1cbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK2N1cnJlbnRTdGVwLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIHJlc2l6ZUhhbmRsZXIoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzKSAtPlxuXG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeVswXSBhbmQgY291bnRyeVswXVsnZ25pJ11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiAgICAgICtkWydlc3RpbWF0ZWQnXVxuICAgICAgICAgICAgaWQ6ICAgICAgICAgY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgICAgICBjb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIHBvcHVsYXRpb246ICtjb3VudHJ5WzBdWydwb3B1bGF0aW9uJ11cbiAgICAgICAgICAgIGduaTogICAgICAgICtjb3VudHJ5WzBdWydnbmknXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnTm8gR05JIG9yIFBvcHVsYXRpb24gZGF0YSBmb3IgdGhpcyBjb3VudHJ5JywgZC5jb2RlLCBjb3VudHJ5WzBdXG5cbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAgICAgICdnbmknXG4gICAgICAgIHk6ICAgICAgJ3ZhbHVlJ1xuICAgICAgICBpZDogICAgICdpZCdcbiAgICAgICAgbGFiZWw6ICAnbmFtZSdcbiAgICAgICAgY29sb3I6ICAndmFsdWUnXG4gICAgICAgIHNpemU6ICAgJ3BvcHVsYXRpb24nXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAzMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcblxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIG5ldyBTY3JvbGxHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWNvbnRhaW5lci1ncmFwaCcsIChlKSAtPlxuICAgICAgY3VycmVudFN0ZXAgPSArZDMuc2VsZWN0KGUuZWxlbWVudCkuYXR0cignZGF0YS1zdGVwJylcbiAgICAgIHVubWV0bmVlZHNHcmFwaC5zZXRNb2RlIGN1cnJlbnRTdGVwXG5cbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgcGFyc2UgZGF0YSB1c2VcbiAgICBkYXRhX3VzZS5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiAgICAgICMjI1xuICAgICAgZFsnUmh5dGhtJ10gICAgICAgICAgICAgICAgICAgID0gK2RbJ1JoeXRobSddXG4gICAgICBkWydXaXRoZHJhd2FsJ10gICAgICAgICAgICAgICAgPSArZFsnV2l0aGRyYXdhbCddXG4gICAgICBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10gPSArZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkWydUcmFkaXRpb25hbCBtZXRob2RzJ10gPSBkWydSaHl0aG0nXStkWydXaXRoZHJhd2FsJ10rZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBjb25zb2xlLmxvZyBkLmNvZGUsIGRbJ1JoeXRobSddLCBkWydXaXRoZHJhd2FsJ10sIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSwgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkZWxldGUgZFsnUmh5dGhtJ11cbiAgICAgIGRlbGV0ZSBkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRlbGV0ZSBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgICMjI1xuICAgICAgZC52YWx1ZXMgPSBbXSAjICtkWydBbnkgbWV0aG9kJ11cbiAgICAgIGQudmFsdWUgPSAwICAjICtkWydNYWxlIHN0ZXJpbGl6YXRpb24nXVxuICAgICAgIyBnZXQgbWFpbiBtZXRob2QgaW4gZWFjaCBjb3VudHJ5XG4gICAgICBtZXRob2RzX2tleXMuZm9yRWFjaCAoa2V5LGkpIC0+XG4gICAgICAgIGQudmFsdWVzLnB1c2hcbiAgICAgICAgICBpZDogaVxuICAgICAgICAgIG5hbWU6IG1ldGhvZHNfbmFtZXNbbGFuZ11baV1cbiAgICAgICAgICB2YWx1ZTogaWYgZFtrZXldICE9ICcnIHRoZW4gK2Rba2V5XSBlbHNlIG51bGxcbiAgICAgICAgI2RlbGV0ZSBkW2tleV1cbiAgICAgICMgc29ydCBkZXNjZW5kaW5nIHZhbHVlc1xuICAgICAgI2QudmFsdWVzLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlLCBiLnZhbHVlKVxuICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ25vIGNvdW50cnknLCBkLmNvZGVcblxuICAgICMgU2V0IHVzZSBtYXBcbiAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICB0b3A6IDIwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgbGVnZW5kOiB0cnVlXG4gICAgICBsYW5nOiBsYW5nXG4gICAgdXNlTWFwLnNldERhdGEgZGF0YV91c2UsIG1hcFxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJywgKGUpIC0+XG4gICAgICBjdXJyZW50U3RlcCA9ICtkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICAgdXNlTWFwLnNldE1hcFN0YXRlIGN1cnJlbnRTdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICB1c2VNYXAub25SZXNpemUoKVxuICAgICQod2luZG93KS5yZXNpemUgdXNlTWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBUcmVlbmFwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG5cbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuXG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgbmV3IFNjcm9sbEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInLCAoZSkgLT5cbiAgICAgIGN1cnJlbnRTdGVwID0gK2QzLnNlbGVjdChlLmVsZW1lbnQpLmF0dHIoJ2RhdGEtc3RlcCcpXG4gICAgICBpZiBjdXJyZW50U3RlcCA9PSAxXG4gICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSAnd29ybGQnLCAnTXVuZG8nXG4gICAgICBlbHNlIGlmIGN1cnJlbnRTdGVwID09IDAgYW5kIGUuZGlyZWN0aW9uID09ICd1cCdcbiAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcblxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIE9wcG9zaXRpb24gR3JhcGhzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCA9IC0+XG4gICAgJGJhcnMgPSAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkIC5iYXInKVxuICAgICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtbGVnZW5kIGxpJylcbiAgICAgIC5tb3VzZW92ZXIgLT5cbiAgICAgICAgJGJhcnNcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgICAgICAuZmlsdGVyKCcuYmFyLScrJCh0aGlzKS5hdHRyKCdjbGFzcycpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAubW91c2VvdXQgLT5cbiAgICAgICAgJGJhcnMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcblxuXG4gIG9uQ2Fyb3VzZWxTdGVwID0gKGUpIC0+XG4gICAgY3VycmVudFN0ZXAgPSBkMy5zZWxlY3QoZS5lbGVtZW50KS5hdHRyKCdkYXRhLXN0ZXAnKVxuICAgICNjb25zb2xlLmxvZyAnY2Fyb3VzZWwnLCBjdXJyZW50U3RlcFxuICAgIEBncmFwaGljLnNlbGVjdEFsbCgnLmFjdGl2ZScpLmNsYXNzZWQgJ2FjdGl2ZScsIGZhbHNlXG4gICAgQGdyYXBoaWMuc2VsZWN0KCcuc3RlcC0nK2N1cnJlbnRTdGVwKS5jbGFzc2VkICdhY3RpdmUnLCB0cnVlXG5cblxuICBzZXR1cERhdGFBcnRpY2xlID0gKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwLCBsb2NhdGlvbikgLT5cblxuICAgIGlmIGxvY2F0aW9uXG4gICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG4gICAgI3Rlc3Qgb3RoZXIgY291bnRyaWVzXG4gICAgI3VzZXJDb3VudHJ5LmNvZGUgPSAnUlVTJ1xuICAgICN1c2VyQ291bnRyeS5uYW1lID0gJ1J1c2lhJ1xuXG4gICAgIyBhZGQgY291bnRyeSBJU08gMzE2Ni0xIGFscGhhLTMgY29kZSB0byBkYXRhX3JlYXNvbnNcbiAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUyID09IGQuY29kZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLmNvZGUgPSBpdGVtWzBdLmNvZGVcbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXNbbGFuZ10pLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgICBkW3JlYXNvbl0gPSAxMDAqZFtyZWFzb25dXG4gICAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICAgZGVsZXRlIGQuY291bnRyeVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gJ05vIGNvdW50cnkgZGF0YSBmb3IgJytkLmNvZGVcblxuICAgIGlmICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwIGRhdGFfdXNlXG5cbiAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcFxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGgoKVxuXG4gICAgaWYgJCgnI3VubWV0LW5lZWRzLWdkcC1ncmFwaCcpLmxlbmd0aFxuICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNcblxuICAgICNpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgIyAgbmV3IENvbnRyYWNlcHRpdmVzUmVhc29ucyBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgcmVhc29uc19uYW1lc1tsYW5nXVxuXG4gICAgaWYgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcycpLmxlbmd0aFxuICAgICAgbmV3IFNjcm9sbEdyYXBoICdjYXJvdXNlbC1tYXJpZS1zdG9wZXMnLCBvbkNhcm91c2VsU3RlcFxuXG4gICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoKClcblxuICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXVxuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIGlmICQoJ2JvZHknKS5oYXNDbGFzcygnZGF0YScpIG9yICQoJ2JvZHknKS5oYXNDbGFzcygnZGF0b3MnKVxuICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5kZWZlciBkMy5qc29uLCAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJ1xuICAgICAgLmF3YWl0IHNldHVwRGF0YUFydGljbGVcblxuICBlbHNlIGlmICQoJ2JvZHknKS5oYXNDbGFzcyAncmVsaWdpb24nXG4gICAgaWYgJCgnI2Nhcm91c2VsLXJhYmlub3MnKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtcmFiaW5vcycsIG9uQ2Fyb3VzZWxTdGVwXG4gICAgaWYgJCgnI2Nhcm91c2VsLWltYW0nKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtaW1hbScsIG9uQ2Fyb3VzZWxTdGVwXG4gICAgaWYgJCgnI2Nhcm91c2VsLXBhcGEnKS5sZW5ndGhcbiAgICAgIG5ldyBTY3JvbGxHcmFwaCAnY2Fyb3VzZWwtcGFwYScsIG9uQ2Fyb3VzZWxTdGVwXG5cbikgalF1ZXJ5XG4iXX0=
