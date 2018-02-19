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
    ContraceptivesApp.prototype.filter_keys = {
      'contraceptives-filter-0': 'residence',
      'contraceptives-filter-1': 'age',
      'contraceptives-filter-2': 'education',
      'contraceptives-filter-3': 'wealth'
    };

    function ContraceptivesApp(data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, reasons_names) {
      this.onSelectFilter = bind(this.onSelectFilter, this);
      this.onSelectCountry = bind(this.onSelectCountry, this);
      this.data = {
        use: data_use,
        unmetneeds: data_unmetneeds,
        reasons: data_reasons
      };
      this.methodsKeys = methods_keys;
      this.methodsNames = methods_names;
      this.reasonsNames = reasons_names;
      this.$app = $('#contraceptives-app');
      this.$app.find('.select-country').select2().change(this.onSelectCountry).val(user_country.code).trigger('change');
      this.$app.find('.contraceptives-app-filters .btn').click(this.onSelectFilter);
      this.$app.css('opacity', 1);
    }

    ContraceptivesApp.prototype.onSelectCountry = function(e) {
      var countryReasons, countryUnmetneeds, countryUse, country_code, country_methods, method, method_value, reason, reason_value, reasons, unmetneeds, use;
      country_code = $(e.target).val();
      console.log(country_code);
      use = null;
      method = null;
      method_value = null;
      unmetneeds = null;
      reason = null;
      reason_value = null;
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
    };

    ContraceptivesApp.prototype.onSelectFilter = function(e) {
      e.preventDefault();
      if (this.filter !== $(e.target).attr('href').substring(1)) {
        this.filter = $(e.target).attr('href').substring(1);
        $('.contraceptives-filter').hide();
        this.filterEl = $('#' + this.filter).show();
        console.log(this.filter);
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/UGIR52DT_' + this.filter_keys[this.filter] + '.csv', (function(_this) {
          return function(error, data) {
            console.log(data);
            if (data) {
              return data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, d.most_popular_method, 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, d.most_popular_reason, 100 * d.most_popular_reason_n / d.n_reasons);
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
    var baseurl, lang, methods_keys, methods_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupReasonsOpposedGraph, setupScrollama, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
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
        } else if (instance === 4) {
          $('#carousel-marie-stopes .scroll-graphic .active').removeClass('active');
          return $('#carousel-marie-stopes .scroll-graphic .step-' + step).addClass('active');
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
    setupReasonsOpposedGraph = function() {
      var $bars;
      $bars = $('#contraceptives-reasons-opposed .bar');
      return $('#contraceptives-reasons-opposed-legend li').mouseover(function() {
        return $bars.addClass('disabled').filter('.bar-' + $(this).attr('class')).removeClass('disabled');
      }).mouseout(function() {
        return $bars.removeClass('disabled');
      });
    };
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
        setupScrollama('carousel-marie-stopes');
      }
      if ($('#contraceptives-reasons-opposed').length) {
        setupReasonsOpposedGraph();
      }
      if ($('#contraceptives-app').length) {
        return new ContraceptivesApp(data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], reasons_names);
      }
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtN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QUFPLENBQUMsSUFBUixDQUFhLHNCQUFBLEdBQXVCLENBQUMsQ0FBQyxJQUF0QyxFQVRGOztNQUZtQixDQUFyQjtNQWFBLElBQUcsQ0FBQSxDQUFFLDZCQUFGLENBQWdDLENBQUMsTUFBcEM7UUFDRSw4QkFBQSxDQUErQixRQUEvQixFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLHlCQUFGLENBQTRCLENBQUMsTUFBaEM7UUFDRSx3QkFBQSxDQUF5QixRQUF6QixFQUFtQyxTQUFuQyxFQUE4QyxHQUE5QyxFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsTUFBL0IsR0FBd0MsQ0FBM0M7UUFDRSw0QkFBQSxDQUFBLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUsd0JBQUYsQ0FBMkIsQ0FBQyxNQUEvQjtRQUNFLHVCQUFBLENBQXdCLGVBQXhCLEVBQXlDLFNBQXpDLEVBREY7O01BTUEsSUFBRyxDQUFBLENBQUUsd0JBQUYsQ0FBMkIsQ0FBQyxNQUEvQjtRQUNFLGNBQUEsQ0FBZSx1QkFBZixFQURGOztNQUdBLElBQUcsQ0FBQSxDQUFFLGlDQUFGLENBQW9DLENBQUMsTUFBeEM7UUFDRSx3QkFBQSxDQUFBLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxNQUE1QjtlQUNNLElBQUEsaUJBQUEsQ0FBa0IsUUFBbEIsRUFBNEIsZUFBNUIsRUFBNkMsWUFBN0MsRUFBMkQsV0FBM0QsRUFBd0UsWUFBeEUsRUFBc0YsYUFBYyxDQUFBLElBQUEsQ0FBcEcsRUFBMkcsYUFBM0csRUFETjs7SUFyREssQ0FQVDtFQXhZRCxDQUFELENBQUEsQ0F1Y0UsTUF2Y0Y7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI5N1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjM0XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NvcmVhIGRlbCBOb3J0ZSdcbiAgICAgICAgICAgIGVuOiAnTm9ydGggS29yZWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NoaW5hJ1xuICAgICAgICAgICAgZW46ICdDaGluYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdQaWxsJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncMOtbGRvcmEnXG4gICAgICAgIGVuOiAncGlsbCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjQ2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MTZcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0zNSwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQXJnZWxpYSdcbiAgICAgICAgICAgIGVuOiAnQWxnZXJpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIGNvbmRvbSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3ByZXNlcnZhdGl2byBtYXNjdWxpbm8nXG4gICAgICAgIGVuOiAnbWFsZSBjb25kb20nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NDJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzQ1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0dyZWNpYSdcbiAgICAgICAgICAgIGVuOiAnR3JlZWNlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC43M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIC0xMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQm90c3VhbmEnXG4gICAgICAgICAgICBlbjogJ0JvdHN3YW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0luamVjdGFibGUnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdpbnllY3RhYmxlJ1xuICAgICAgICBlbjogJ2luamVjdGFibGUnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC42MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC41NlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIDVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0V0aW9ww61hJ1xuICAgICAgICAgICAgZW46ICdFdGhpb3BpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM2XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMxOFxuICAgICAgICAgIHI6IDE2XG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yNiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQmFsY2FuZXMnXG4gICAgICAgICAgICBlbjogJ0JhbGthbnMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMzJcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMCwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQWxiYW5pYSdcbiAgICAgICAgICAgIGVuOiAnQWxiYW5pYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gIGdldExlZ2VuZERhdGE6IC0+XG4gICAgcmV0dXJuIFswLDIwLDQwLDYwLDgwXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGQrJyUnXG5cbiAgIyBvdmVycmlkZSBnZXREaW1lbnNpb25zXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgb2Zmc2V0ID0gMTAwXG4gICAgaWYgQCRlbFxuICAgICAgYm9keUhlaWdodCA9ICQoJ2JvZHknKS5oZWlnaHQoKS1vZmZzZXRcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgI0AkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgI2Vsc2VcbiAgICAgICMgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cblxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgIHN1cGVyKG1hcClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgQGN1cnJlbnRNZXRob2QgPSBAc3RhdGVzW0BjdXJyZW50U3RhdGUtMV1cbiAgICAgICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgQGN1cnJlbnRNZXRob2QudGV4dFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT4gZC52YWx1ZSA9ICtkW0BjdXJyZW50TWV0aG9kLmlkXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4gICAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG4gIHNldEFubm90YXRpb25zOiAtPlxuICAgIGlmIEBjdXJyZW50TWV0aG9kXG4gICAgICBAY3VycmVudE1ldGhvZC5sYWJlbHMuZm9yRWFjaCAoZCkgPT4gXG4gICAgICAgIGQuY3ggPSBkLmN4X2ZhY3RvcipAd2lkdGhcbiAgICAgICAgZC5jeSA9IGQuY3lfZmFjdG9yKkBoZWlnaHRcbiAgICAgICAgZC50ZXh0ID0gZC5sYWJlbFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGNvbnRhaW5lci5jYWxsIEByaW5nTm90ZSwgQGN1cnJlbnRNZXRob2QubGFiZWxzXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgNjBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdXBkYXRlR3JhcGgoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIHVwZGF0ZUdyYXBoOiAtPlxuXG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHVwZGF0ZSBub2Rlc1xuICAgIG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgIFxuICAgIG5vZGVzLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUnXG4gICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsJ1xuICAgICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwtY29udGVudCdcbiAgICAgICAgICAuYXBwZW5kICdwJ1xuXG4gICAgIyBzZXR1cCBub2Rlc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG5cbiAgICAjIGFkZCBsYWJlbCBvbmx5IGluIG5vZGVzIHdpdGggc2l6ZSBncmVhdGVyIHRoZW4gb3B0aW9ucy5taW5TaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsICAgQHNldE5vZGVMYWJlbFxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIG5vZGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoXG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgICAjIFVwZGF0ZSB0cmVtYXAgc2l6ZVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuICAgIGVsc2VcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNxdWFyaWZ5XG4gICAgQHRyZWVtYXAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBVcGRhdGUgbm9kZXMgZGF0YVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuICAgICAgXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgc2V0Tm9kZTogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjbGFzcycsICAgICAgIEBnZXROb2RlQ2xhc3NcbiAgICAgIC5zdHlsZSAncGFkZGluZycsICAgIChkKSA9PiBpZiAoZC54MS1kLngwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcgJiYgZC55MS1kLnkwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcpIHRoZW4gQG9wdGlvbnMubm9kZXNQYWRkaW5nKydweCcgZWxzZSAwXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAoZCkgLT4gaWYgKGQueDEtZC54MCA9PSAwKSB8fCAoZC55MS1kLnkwID09IDApIHRoZW4gJ2hpZGRlbicgZWxzZSAnJ1xuXG4gIHNldE5vZGVEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgLT4gZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpIC0+IGQueTAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIChkKSAtPiBkLngxLWQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChkKSAtPiBkLnkxLWQueTAgKyAncHgnXG5cbiAgc2V0Tm9kZUxhYmVsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5zZWxlY3QoJ3AnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlJ1xuICAgICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5UcmVlbWFwR3JhcGhcblxuICAjIG92ZXJkcml2ZSBkYXRhIFBhcnNlclxuICBkYXRhUGFyc2VyOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgIyBUT0RPISEhIEdldCBjdXJyZW50IGNvdW50cnkgJiBhZGQgc2VsZWN0IGluIG9yZGVyIHRvIGNoYW5nZSBpdFxuICAgIGRhdGFfY291bnRyeSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgY29uc29sZS5sb2cgZGF0YV9jb3VudHJ5WzBdXG4gICAgaWYgZGF0YV9jb3VudHJ5WzBdXG4gICAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgICAgbWV0aG9kcyA9IHt9XG4gICAgICBAb3B0aW9ucy5tZXRob2RzS2V5cy5mb3JFYWNoIChrZXksaSkgPT5cbiAgICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgICBtZXRob2RzW2tleV0gPVxuICAgICAgICAgICAgaWQ6IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKS5yZXBsYWNlKCcpJywgJycpLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgICAgdmFsdWU6ICtkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgICAjIGZpbHRlciBtZXRob2RzIHdpdGggdmFsdWUgPCA1JSAmIGFkZCB0byBPdGhlciBtb2Rlcm4gbWV0aG9kc1xuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBpZiBrZXkgIT0gJ090aGVyIG1vZGVybiBtZXRob2RzJyBhbmQga2V5ICE9ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJyBhbmQgbWV0aG9kLnZhbHVlIDwgNVxuICAgICAgICAgIG1ldGhvZHNbJ090aGVyIG1vZGVybiBtZXRob2RzJ10udmFsdWUgKz0gbWV0aG9kLnZhbHVlXG4gICAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICBcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgICAgaWQ6IG1ldGhvZC5pZFxuICAgICAgICAgIHJhd19uYW1lOiBtZXRob2QubmFtZVxuICAgICAgICAgIG5hbWU6ICc8c3Ryb25nPicgKyBtZXRob2QubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1ldGhvZC5uYW1lLnNsaWNlKDEpICsgJzwvc3Ryb25nPjxici8+JyArIE1hdGgucm91bmQobWV0aG9kLnZhbHVlKSArICclJ1xuICAgICAgICAgIHZhbHVlOiBtZXRob2QudmFsdWVcbiAgICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgICAgcGFyc2VkRGF0YVNvcnRlZCA9IHBhcnNlZERhdGEuc29ydCAoYSxiKSAtPiBpZiBhLnZhbHVlIGFuZCBiLnZhbHVlIHRoZW4gYi52YWx1ZS1hLnZhbHVlIGVsc2UgMVxuICAgICAgIyBzZXQgY2FwdGlvbiBjb3VudHJ5IG5hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1hbnktbWV0aG9kJykuaHRtbCBNYXRoLnJvdW5kKGRhdGFfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSlcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIHBhcnNlZERhdGFTb3J0ZWRbMF0ucmF3X25hbWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gJ05vIGRhdGEgY291bnRyeSBmb3IgJytjb3VudHJ5X2NvZGVcbiAgICAgICMgVE9ETyEhISBXaGF0IHdlIGRvIGlmIHRoZXJlJ3Mgbm8gZGF0YSBmb3IgdXNlcidzIGNvdW50cnlcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgI0BzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZURhdGE6IChjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEB1cGRhdGVHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgIyMjIG92ZXJkcml2ZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSlcbiAgIyMjIiwiY2xhc3Mgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIGluY29tZUxldmVsczogWzEwMDUsIDM5NTUsIDEyMjM1XVxuXG4gIGxhYmVsczogW1xuICAgICdBR08nLFxuICAgICdCR0QnLFxuICAgICdCUkEnLFxuICAgICdDSE4nLFxuICAgICdERVUnLFxuICAgICdFU1AnLFxuICAgICdFVEgnLFxuICAgICdJTkQnLFxuICAgICdJRE4nLFxuICAgICdKUE4nLFxuICAgICdOR0EnLFxuICAgICdQQUsnLFxuICAgICdQSEwnLFxuICAgICdSVVMnLFxuICAgICdTQVUnLFxuICAgICdUVVInLFxuICAgICdVR0EnLFxuICAgICdVU0EnLFxuICAgICdWTk0nXG4gIF1cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgMCAjIG1vZGUgMDogYmVlc3dhcm0sIG1vZGUgMTogc2NhdHRlcnBsb3RcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICByZXR1cm4gZGF0YS5zb3J0IChhLGIpID0+IGJbQG9wdGlvbnMua2V5LnNpemVdLWFbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGRhdGFcblxuICBkcmF3R3JhcGg6IC0+XG5cbiAgICBAc2V0U2l6ZSgpXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgICMgZHJhdyBkb3RzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEgQGRhdGFcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RcbiAgICAgICMub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5kYXRhIEBkYXRhLmZpbHRlciAoZCkgPT4gQGxhYmVscy5pbmRleE9mKGRbQG9wdGlvbnMua2V5LmlkXSkgIT0gLTFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSA9PiByZXR1cm4gaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxMDAwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLWwnIGVsc2UgaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxODAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbScgZWxzZSAnZG90LWxhYmVsJ1xuICAgICAgICAjLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJzAuMjVlbSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LmxhYmVsXVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVkgPSBkMy5mb3JjZVkgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgIGZvcmNlWS5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VZXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVgoQHdpZHRoKi41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMzUwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIHNldERvdDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmF0dHIgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0RG90UG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAnY3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgc2V0RG90TGFiZWxQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICd4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgZ2V0UG9zaXRpb25YOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueCBlbHNlIE1hdGgucm91bmQgQHgoZFtAb3B0aW9ucy5rZXkueF0pXG5cbiAgZ2V0UG9zaXRpb25ZOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueSBlbHNlIE1hdGgucm91bmQgQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gI2lmIEBvcHRpb25zLmtleS5jb2xvciBhbmQgQG9wdGlvbnMubW9kZSA9PSAxIHRoZW4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSBlbHNlICcjZTI3MjNiJ1xuXG4gIHNldE1vZGU6IChtb2RlKSAtPlxuICAgIEBvcHRpb25zLm1vZGUgPSBtb2RlXG4gICAgaWYgQG9wdGlvbnMubW9kZSA8IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgICBpZiBAeExlZ2VuZFxuICAgICAgICBAeExlZ2VuZC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICAgICMgc2hvdy9oaWRlIGRvdCBsYWJlbHNcbiAgICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMFxuICAgICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSA1MDBcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAxXG4gICAgICAjIHNob3cvaGlkZSB4IGF4aXMgbGluZXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdIDwgQGluY29tZUxldmVsc1syXSBvciBkW0BvcHRpb25zLmtleS55XSA+IDE1XG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdID4gQGluY29tZUxldmVsc1sxXSBvciBkW0BvcHRpb25zLmtleS55XSA8IDMwXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDRcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkLmlkICE9ICdTQVUnIGFuZCBkLmlkICE9ICdKUE4nXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDVcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgI0B4ID0gZDMuc2NhbGVQb3coKVxuICAgICMgIC5leHBvbmVudCgwLjEyNSlcbiAgICAjICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeCA9IGQzLnNjYWxlTG9nKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdICMucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBAaW5jb21lTGV2ZWxzXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMTAsIDIwLCAzMCwgNDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTEsNSknXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCA4NTAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAsIDIwLCAzMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLmF0dHIgJ3kxJywgQHkoNDApLTRcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcyAudGljayB0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2R4JywgM1xuICAgICAgICAuYXR0ciAnZHknLCAtNFxuICAgICMgc2V0IHggbGVuZ2VkXG4gICAgaW5jb21lcyA9IEB4QXhpcy50aWNrVmFsdWVzKClcbiAgICBpbmNvbWVzLnVuc2hpZnQgMFxuICAgIGluY29tZXNNYXggPSBAeCBAZ2V0U2NhbGVYRG9tYWluKClbMV1cbiAgICBpbmNvbWVzID0gaW5jb21lcy5tYXAgKGQpID0+IGlmIGQgPiAwIHRoZW4gMTAwKkB4KGQpL2luY29tZXNNYXggZWxzZSAwXG4gICAgaW5jb21lcy5wdXNoIDEwMFxuICAgIEB4TGVnZW5kID0gZDMuc2VsZWN0KGQzLnNlbGVjdCgnIycrQGlkKS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KCcueC1sZWdlbmQnKVxuICAgIEB4TGVnZW5kLnNlbGVjdEFsbCgnbGknKS5zdHlsZSAnd2lkdGgnLCAoZCxpKSAtPiAoaW5jb21lc1tpKzFdLWluY29tZXNbaV0pKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG4iLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG5cbiAgY29uc3RydWN0b3I6IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJfY291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzLCByZWFzb25zX25hbWVzKSAtPlxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICA9IG1ldGhvZHNfa2V5c1xuICAgIEBtZXRob2RzTmFtZXMgPSBtZXRob2RzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyA9IHJlYXNvbnNfbmFtZXNcblxuICAgIEAkYXBwID0gJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpXG5cbiAgICBAJGFwcC5maW5kKCcuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLnNlbGVjdDIoKVxuICAgICAgLmNoYW5nZSBAb25TZWxlY3RDb3VudHJ5XG4gICAgICAudmFsIHVzZXJfY291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5jbGljayBAb25TZWxlY3RGaWx0ZXJcblxuICAgIEAkYXBwLmNzcygnb3BhY2l0eScsMSlcblxuXG4gIG9uU2VsZWN0Q291bnRyeTogKGUpID0+XG4gICAgY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcbiAgICBjb25zb2xlLmxvZyBjb3VudHJ5X2NvZGVcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBVc2VcbiAgICBjb3VudHJ5VXNlID0gQGRhdGEudXNlLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgdXNlICAgICAgICAgICAgID0gY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXVxuICAgICAgbWV0aG9kICAgICAgICAgID0gY291bnRyeV9tZXRob2RzWzBdLm5hbWVcbiAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuXG4gICAgIyBVbm1ldG5lZWRzXG4gICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgIyB1c2Ugc3VydmV5IGRhdGEgaWYgYXZhaWxhYmxlLCB1c2UgZXN0aW1hdGVkIGlmIG5vdFxuICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXVxuICAgICAgXG4gICAgIyBSZWFzb25zXG4gICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgcmVhc29ucyAgICAgID0gT2JqZWN0LmtleXMoQHJlYXNvbnNOYW1lcykubWFwIChyZWFzb24pID0+IHsnbmFtZSc6IEByZWFzb25zTmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2NvdW50cnlSZWFzb25zWzBdW3JlYXNvbl19XG4gICAgICByZWFzb25zICAgICAgPSByZWFzb25zLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgIHJlYXNvbl92YWx1ZSA9IHJlYXNvbnNbMF0udmFsdWVcblxuICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgICMgY2hlY2sgZmlsdGVycyBhdmFpbGFiaWxpdHlcblxuXG4gIG9uU2VsZWN0RmlsdGVyOiAoZSkgPT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiBAZmlsdGVyICE9ICQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSlcbiAgICAgIEBmaWx0ZXIgPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgIGNvbnNvbGUubG9nIEBmaWx0ZXJcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvVUdJUjUyRFRfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGNvbnNvbGUubG9nIGRhdGFcbiAgICAgICAgaWYgZGF0YVxuICAgICAgICAgIGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAZmlsdGVyRWwuZmluZCgnIycrQGZpbHRlcisnLScrZC5pZCksIDEwMCpkLnVzaW5nX21vZGVybl9tZXRob2QvZC5uLCBkLm1vc3RfcG9wdWxhcl9tZXRob2QsIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBkLm1vc3RfcG9wdWxhcl9yZWFzb24sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29uc1xuXG5cbiAgc2V0QXBwSXRlbURhdGE6ICgkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlKSAtPlxuXG4gICAgY29uc29sZS5sb2cgJ3NldEFwcEl0ZW1EYXRhJywgJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG4gICAgaWYgdXNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrdXNlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZC12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrbWV0aG9kX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuXG4gICAgaWYgdW5tZXRuZWVkc1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11bm1ldG5lZWRzJykuaHRtbCBNYXRoLnJvdW5kKCt1bm1ldG5lZWRzKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG5cbiAgICBpZiByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCtyZWFzb25fdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuaGlkZSgpXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgdXNlVHJlZW1hcCA9IG51bGxcbiAgdXNlTWFwID0gbnVsbFxuICB1c2VHcmFwaCA9IG51bGxcbiAgdW5tZXRuZWVkc0dyYXBoID0gbnVsbCBcblxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCIgICAgICAgIyBvcHBvc2VkXG4gICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIiAgIyBvcHBvc2VkXG4gICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIiAgICAgICAgICAgIyBvcHBvc2VkXG4gICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCIgICAgIyBvcHBvc2VkXG4gICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiICAgICAgICAgICAgICAgICAgICAgICMgc2FsdWRcbiAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIiAjIHNhbHVkXG4gICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpJzIHByb2Nlc3Nlc1wiICAgICAgIyBzYWx1ZFxuICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICAjIFNjcm9sbGFtYSBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwU2Nyb2xsYW1hID0gKGlkKSAtPlxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycraWQpXG4gICAgZ3JhcGhpYyAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBjaGFydCAgICAgPSBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgdGV4dCAgICAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC10ZXh0JylcbiAgICBzdGVwcyAgICAgPSB0ZXh0LnNlbGVjdEFsbCgnLnN0ZXAnKVxuXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIHNjcm9sbGVyID0gc2Nyb2xsYW1hKClcblxuICAgICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gICAgaGFuZGxlUmVzaXplID0gLT5cbiAgICAgIHdpZHRoID0gZ3JhcGhpYy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggI01hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgICAgc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICAgIGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgICBjaGFydFxuICAgICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgICBzY3JvbGxlci5yZXNpemUoKVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgc3RpY2t5IHRoZSBncmFwaGljXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgICBoYW5kbGVDb250YWluZXJFeGl0ID0gKGUpIC0+XG4gICAgICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICBoYW5kbGVTdGVwRW50ZXIgPSAoZSkgLT5cbiAgICAgICPCoGNvbnNvbGUubG9nIGVcbiAgICAgICRzdGVwID0gJChlLmVsZW1lbnQpXG4gICAgICBpbnN0YW5jZSA9ICRzdGVwLmRhdGEoJ2luc3RhbmNlJylcbiAgICAgIHN0ZXAgPSAkc3RlcC5kYXRhKCdzdGVwJylcbiAgICAgIGlmIGluc3RhbmNlID09IDAgXG4gICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDAnLCBzdGVwXG4gICAgICAgIGlmIHVzZVRyZWVtYXBcbiAgICAgICAgICBpZiBzdGVwID09IDFcbiAgICAgICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSAnd29ybGQnLCAnTXVuZG8nXG4gICAgICAgICAgZWxzZSBpZiBzdGVwID09IDAgYW5kIGUuZGlyZWN0aW9uID09ICd1cCdcbiAgICAgICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDEgXG4gICAgICAgIGlmIHVzZU1hcFxuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDEnLCBzdGVwXG4gICAgICAgICAgdXNlTWFwLnNldE1hcFN0YXRlIHN0ZXAgIyB1cGRhdGUgbWFwIGJhc2VkIG9uIHN0ZXAgXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDJcbiAgICAgICAgaWYgdXNlR3JhcGggYW5kIHN0ZXAgPiAwXG4gICAgICAgICAgZGF0YSA9IFs2MywgODgsIDEwMF0gIyA2MywgNjMrMjUsIDYzKzI1KzEyXG4gICAgICAgICAgZnJvbSA9IGlmIHN0ZXAgPiAxIHRoZW4gZGF0YVtzdGVwLTJdIGVsc2UgMFxuICAgICAgICAgIHRvID0gZGF0YVtzdGVwLTFdXG4gICAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkID49IGZyb20gYW5kIGQgPCB0b1xuICAgICAgICAgICAgLmNsYXNzZWQgJ2ZpbGwtJytzdGVwLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcbiAgICAgICAgICAjY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAyJywgc3RlcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAzXG4gICAgICAgIGlmIHVubWV0bmVlZHNHcmFwaFxuICAgICAgICAgIHVubWV0bmVlZHNHcmFwaC5zZXRNb2RlIHN0ZXBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gNFxuICAgICAgICAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzIC5zY3JvbGwtZ3JhcGhpYyAuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNjYXJvdXNlbC1tYXJpZS1zdG9wZXMgLnNjcm9sbC1ncmFwaGljIC5zdGVwLScrc3RlcCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIGhhbmRsZVJlc2l6ZSgpXG5cbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycraWQgICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJy5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgdGV4dDogICAgICAgJy5zY3JvbGwtdGV4dCcgICAgICAgICMgdGhlIHN0ZXAgY29udGFpbmVyXG4gICAgICAgIHN0ZXA6ICAgICAgICcuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBoYW5kbGVDb250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIGhhbmRsZUNvbnRhaW5lckV4aXQgXG5cbiAgICAjIEVuc3VyZSB0byBzZXR1cCBvblN0ZXBFbnRlciBoYW5kbGVyIG9ubHkgb25jZVxuICAgIHVubGVzcyBzY3JvbGxhbWFJbml0aWFsaXplZFxuICAgICAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBzY3JvbGxlci5vblN0ZXBFbnRlciAgaGFuZGxlU3RlcEVudGVyIFxuICAgICAgXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgaGFuZGxlUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcidcbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IChncmFwaFdpZHRoIC8gMjApIC0gMTBcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyKClcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXMpIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICd1bm1ldC1uZWVkcy1nZHAtY29udGFpbmVyLWdyYXBoJ1xuXG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeVswXSBhbmQgY291bnRyeVswXVsnZ25pJ11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiAgICAgICtkWydlc3RpbWF0ZWQnXVxuICAgICAgICAgICAgaWQ6ICAgICAgICAgY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgICAgICBjb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIHBvcHVsYXRpb246ICtjb3VudHJ5WzBdWydwb3B1bGF0aW9uJ11cbiAgICAgICAgICAgIGduaTogICAgICAgICtjb3VudHJ5WzBdWydnbmknXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnTm8gR05JIG9yIFBvcHVsYXRpb24gZGF0YSBmb3IgdGhpcyBjb3VudHJ5JywgZC5jb2RlLCBjb3VudHJ5WzBdXG4gICAgIyBzZXR1cCBncmFwaFxuICAgIHVubWV0bmVlZHNHcmFwaCA9IG5ldyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgNVxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgeDogICAgICAnZ25pJ1xuICAgICAgICB5OiAgICAgICd2YWx1ZSdcbiAgICAgICAgaWQ6ICAgICAnaWQnXG4gICAgICAgIGxhYmVsOiAgJ25hbWUnXG4gICAgICAgIGNvbG9yOiAgJ3ZhbHVlJ1xuICAgICAgICBzaXplOiAgICdwb3B1bGF0aW9uJ1xuICAgICAgZG90TWluU2l6ZTogMVxuICAgICAgZG90TWF4U2l6ZTogMzJcbiAgICB1bm1ldG5lZWRzR3JhcGguc2V0RGF0YSBkYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1bm1ldG5lZWRzR3JhcGgub25SZXNpemVcblxuXG4gICMgVXNlICYgUmVhc29ucyBtYXBzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyA9IChkYXRhX3VzZSwgY291bnRyaWVzLCBtYXApIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuXG4gICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAjZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgIyBTZXQgdXNlIG1hcFxuICAgIHVzZU1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogMjBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IHRydWVcbiAgICAgIGxhbmc6IGxhbmdcbiAgICB1c2VNYXAuc2V0RGF0YSBkYXRhX3VzZSwgbWFwXG4gICAgdXNlTWFwLm9uUmVzaXplKClcblxuICAgICMgc2V0dXAgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VNYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIFRyZWVuYXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCA9IChkYXRhX3VzZSkgLT5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBzZXR1cFNjcm9sbGFtYSAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuICAgICMgc2V0dXAgdHJlZW1hcFxuICAgIHVzZVRyZWVtYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICBtZXRob2RzS2V5czogbWV0aG9kc19rZXlzXG4gICAgICBtZXRob2RzTmFtZXM6IG1ldGhvZHNfbmFtZXNbbGFuZ11cbiAgICAjIHNldCBkYXRhXG4gICAgdXNlVHJlZW1hcC5zZXREYXRhIGRhdGFfdXNlLCB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG4gICAgIyBzZXQgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VUcmVlbWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFJlYXNvbnMgT3Bwb3NpdGlvbiBHcmFwaHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoID0gLT5cbiAgICAkYmFycyA9ICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQgLmJhcicpXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1sZWdlbmQgbGknKVxuICAgICAgLm1vdXNlb3ZlciAtPlxuICAgICAgICAkYmFyc1xuICAgICAgICAgIC5hZGRDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgIC5maWx0ZXIoJy5iYXItJyskKHRoaXMpLmF0dHIoJ2NsYXNzJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgIC5tb3VzZW91dCAtPlxuICAgICAgICAkYmFycy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICBkMy5xdWV1ZSgpXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAuZGVmZXIgZDMuanNvbiwgJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLydcbiAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwLCBsb2NhdGlvbikgLT5cblxuICAgICAgaWYgbG9jYXRpb25cbiAgICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICBlbHNlXG4gICAgICAgIGxvY2F0aW9uID0ge31cblxuICAgICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cbiAgICAgICN0ZXN0IG90aGVyIGNvdW50cmllc1xuICAgICAgI3VzZXJDb3VudHJ5LmNvZGUgPSAnUlVTJ1xuICAgICAgI3VzZXJDb3VudHJ5Lm5hbWUgPSAnUnVzaWEnXG5cbiAgICAgICMgYWRkIGNvdW50cnkgSVNPIDMxNjYtMSBhbHBoYS0zIGNvZGUgdG8gZGF0YV9yZWFzb25zXG4gICAgICBkYXRhX3JlYXNvbnMuZm9yRWFjaCAoZCkgLT5cbiAgICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZTIgPT0gZC5jb2RlXG4gICAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgICBkLmNvZGUgPSBpdGVtWzBdLmNvZGVcbiAgICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICBPYmplY3Qua2V5cyhyZWFzb25zX25hbWVzKS5mb3JFYWNoIChyZWFzb24pIC0+XG4gICAgICAgICAgICBkW3JlYXNvbl0gPSAxMDAqZFtyZWFzb25dXG4gICAgICAgICAgICBpZiBkW3JlYXNvbl0gPiAxMDBcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgJ0FsZXJ0ISBWYWx1ZSBncmVhdGVyIHRoYW4gemVyby4gJyArIGQuY291bnRyeSArICcsICcgKyByZWFzb24gKyAnOiAnICsgZFtyZWFzb25dXG4gICAgICAgICAgZGVsZXRlIGQuY291bnRyeVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS53YXJuICdObyBjb3VudHJ5IGRhdGEgZm9yICcrZC5jb2RlXG5cbiAgICAgIGlmICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgZGF0YV91c2VcblxuICAgICAgaWYgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzIGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcFxuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJykubGVuZ3RoID4gMFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoKClcblxuICAgICAgaWYgJCgnI3VubWV0LW5lZWRzLWdkcC1ncmFwaCcpLmxlbmd0aFxuICAgICAgICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCBkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllc1xuXG4gICAgICAjaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgIyAgbmV3IENvbnRyYWNlcHRpdmVzUmVhc29ucyBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgcmVhc29uc19uYW1lc1xuXG4gICAgICBpZiAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJykubGVuZ3RoXG4gICAgICAgIHNldHVwU2Nyb2xsYW1hICdjYXJvdXNlbC1tYXJpZS1zdG9wZXMnXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoKClcblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgICBuZXcgQ29udHJhY2VwdGl2ZXNBcHAgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyQ291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzXG5cbikgalF1ZXJ5XG4iXX0=
