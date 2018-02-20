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
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, reasons_dhs_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupReasonsOpposedGraph, setupScrollama, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
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
        setupScrollama('carousel-marie-stopes');
      }
      if ($('#contraceptives-reasons-opposed').length) {
        setupReasonsOpposedGraph();
      }
      if ($('#contraceptives-app').length) {
        return new ContraceptivesApp(data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
      }
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtN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RyxDQUFBLENBQUUsaUNBQUYsQ0FBb0MsQ0FBQyxNQUF4QztRQUNFLHdCQUFBLENBQUEsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2VBQ00sSUFBQSxpQkFBQSxDQUFrQixRQUFsQixFQUE0QixlQUE1QixFQUE2QyxZQUE3QyxFQUEyRCxXQUEzRCxFQUF3RSxZQUF4RSxFQUFzRixhQUFjLENBQUEsSUFBQSxDQUFwRyxFQUEyRyxpQkFBa0IsQ0FBQSxJQUFBLENBQTdILEVBQW9JLGFBQWMsQ0FBQSxJQUFBLENBQWxKLEVBQXlKLGlCQUFrQixDQUFBLElBQUEsQ0FBM0ssRUFETjs7SUFyREssQ0FQVDtFQTdlRCxDQUFELENBQUEsQ0E0aUJFLE1BNWlCRjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3Mgd2luZG93LkJhc2VHcmFwaFxuXG4gIG9wdGlvbnNEZWZhdWx0ID0gXG4gICAgbWFyZ2luOlxuICAgICAgdG9wOiAwXG4gICAgICByaWdodDogMFxuICAgICAgYm90dG9tOiAyMFxuICAgICAgbGVmdDogMFxuICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICBsYWJlbDogZmFsc2UgICAgICAgICAgICMgc2hvdy9oaWRlIGxhYmVsc1xuICAgIGxlZ2VuZDogZmFsc2UgICAgICAgICAgIyBzaG93L2hpZGUgbGVnZW5kXG4gICAgbW91c2VFdmVudHM6IHRydWUgICAgICAjIGFkZC9yZW1vdmUgbW91c2UgZXZlbnQgbGlzdGVuZXJzXG4gICAga2V5OlxuICAgICAgaWQ6ICdrZXknXG4gICAgICB4OiAgJ2tleScgICAgICAgICAgICAjIG5hbWUgZm9yIHggY29sdW1uXG4gICAgICB5OiAgJ3ZhbHVlJyAgICAgICAgICAjIG5hbWUgZm9yIHkgY29sdW1uXG5cbiAgbWFya2VyRGVmYXVsdCA9XG4gICAgdmFsdWU6IG51bGxcbiAgICBsYWJlbDogJydcbiAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnXG4gICAgYWxpZ246J3JpZ2h0J1xuIFxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgQGlkICAgICAgID0gaWRcbiAgICBAb3B0aW9ucyAgPSAkLmV4dGVuZCB0cnVlLCB7fSwgb3B0aW9uc0RlZmF1bHQsIG9wdGlvbnMgICMgbWVyZ2Ugb3B0aW9uc0RlZmF1bHQgJiBvcHRpb25zXG4gICAgQCRlbCAgICAgID0gJCgnIycrQGlkKVxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAc2V0U1ZHKClcbiAgICBAc2V0U2NhbGVzKClcbiAgICBAbWFya2VycyA9IFtdXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIEBzdmcgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIgJ3dpZHRoJywgQGNvbnRhaW5lcldpZHRoXG4gICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgIEBjb250YWluZXIgPSBAc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgQG9wdGlvbnMubWFyZ2luLmxlZnQgKyAnLCcgKyBAb3B0aW9ucy5tYXJnaW4udG9wICsgJyknXG5cbiAgbG9hZERhdGE6ICh1cmwpIC0+XG4gICAgZDMuY3N2IHVybCwgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgIEBzZXREYXRhIGRhdGFcbiAgICByZXR1cm4gQFxuICAgIFxuICBzZXREYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQGRyYXdTY2FsZXMoKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3TWFya2VycygpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgcmV0dXJuIGRhdGFcbiAgXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHNldEdyYXBoOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIFNjYWxlIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRTY2FsZXM6IC0+XG4gICAgcmV0dXJuIEBcblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb24gXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWFJhbmdlOiAtPlxuICAgIHJldHVybiBbMCwgQHdpZHRoXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWVJhbmdlOiAtPlxuICAgIHJldHVybiBbQGhlaWdodCwgMF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhEb21haW46IC0+XG4gICAgcmV0dXJuIFtdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVZRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFya2VyIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS0tXG5cbiAgYWRkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIEBtYXJrZXJzLnB1c2ggJC5leHRlbmQge30sIG1hcmtlckRlZmF1bHQsIG1hcmtlclxuICAgIHJldHVybiBAXG5cbiAgZHJhd01hcmtlcnM6IC0+IFxuICAgICMgRHJhdyBtYXJrZXIgbGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubWFya2VyJylcbiAgICAgIC5kYXRhKEBtYXJrZXJzKVxuICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbWFya2VyJ1xuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgICMgRHJhdyBtYXJrZXIgbGFiZWxcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlci1sYWJlbCcpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlci1sYWJlbCdcbiAgICAgIC5hdHRyICd0ZXh0LWFuY2hvcicsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgdGhlbiAnbWlkZGxlJyBlbHNlIGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuICdlbmQnIGVsc2UgJ3N0YXJ0J1xuICAgICAgLmF0dHIgJ2R5JywgKGQpIC0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gJy0wLjI1ZW0nIGVsc2UgMFxuICAgICAgLnRleHQgKGQpIC0+IGQubGFiZWxcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG5cbiAgc2V0dXBNYXJrZXJMaW5lOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50XG4gICAgICAuYXR0ciAneDEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAwIGVsc2UgQHgoZC52YWx1ZSlcbiAgICAgIC5hdHRyICd5MScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgMFxuICAgICAgLmF0dHIgJ3gyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHdpZHRoIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneTInLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgXG5cbiAgc2V0dXBNYXJrZXJMYWJlbDogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiAoaWYgZC5hbGlnbiA9PSAncmlnaHQnIHRoZW4gQHdpZHRoIGVsc2UgMCApIGVsc2UgQHgoZC52YWx1ZSkgXG4gICAgICAuYXR0ciAneScsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB5KGQudmFsdWUpIGVsc2UgQGhlaWdodCAgIFxuXG5cbiAgIyBSZXNpemUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIG9uUmVzaXplOiA9PlxuICAgIEBnZXREaW1lbnNpb25zKClcbiAgICBAdXBkYXRlR3JhcGhEaW1lbnNpb25zKClcbiAgICByZXR1cm4gQFxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgaWYgQCRlbFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICBAd2lkdGggICAgICAgICAgID0gQGNvbnRhaW5lcldpZHRoIC0gQG9wdGlvbnMubWFyZ2luLmxlZnQgLSBAb3B0aW9ucy5tYXJnaW4ucmlnaHRcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBzdmcgZGltZW5zaW9uXG4gICAgaWYgQHN2Z1xuICAgICAgQHN2Z1xuICAgICAgICAuYXR0ciAnd2lkdGgnLCAgQGNvbnRhaW5lcldpZHRoXG4gICAgICAgIC5hdHRyICdoZWlnaHQnLCBAY29udGFpbmVySGVpZ2h0XG4gICAgIyB1cGRhdGUgc2NhbGVzIGRpbWVuc2lvbnNcbiAgICBpZiBAeFxuICAgICAgQHgucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBpZiBAeVxuICAgICAgQHkucmFuZ2UgQGdldFNjYWxlWVJhbmdlKClcbiAgICAjIHVwZGF0ZSBheGlzIGRpbWVuc2lvbnNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzJylcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgaWYgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRZQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB5QXhpc1xuICAgICMgdXBkYXRlIG1hcmtlcnNcbiAgICBAY29udGFpbmVyLnNlbGVjdCgnLm1hcmtlcicpXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMaW5lXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGFiZWxcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnK0BoZWlnaHQrJyknXG5cbiAgc2V0WUF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnK0B3aWR0aCsnLDApJ1xuXG5cbiAgIyBBdXhpbGlhciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldERhdGFYOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS54XVxuXG4gIGdldERhdGFZOiAtPlxuICAgIHJldHVybiBkW0BvcHRpb25zLmtleS55XSIsImNsYXNzIHdpbmRvdy5NYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdNYXAgR3JhcGgnLCBpZCwgb3B0aW9uc1xuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgQGZvcm1hdEZsb2F0ICAgPSBkMy5mb3JtYXQoJywuMWYnKVxuICAgIEBmb3JtYXRJbnRlZ2VyID0gZDMuZm9ybWF0KCcsZCcpXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U1ZHOiAtPlxuICAgIHN1cGVyKClcbiAgICBAJHRvb2x0aXAgPSBAJGVsLmZpbmQgJy50b29sdGlwJ1xuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCBjb2xvciBzY2FsZVxuICAgIEBjb2xvciA9IGQzLnNjYWxlU2VxdWVudGlhbCBkMy5pbnRlcnBvbGF0ZU9yYW5nZXNcbiAgICByZXR1cm4gQFxuXG4gIGxvYWREYXRhOiAodXJsX2RhdGEsIHVybF9tYXApIC0+XG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgdXJsX2RhdGFcbiAgICAgIC5kZWZlciBkMy5qc29uLCB1cmxfbWFwXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhLCBtYXApICA9PlxuICAgICAgICBAJGVsLnRyaWdnZXIgJ2RhdGEtbG9hZGVkJ1xuICAgICAgICBAc2V0RGF0YSBkYXRhLCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldERhdGE6IChkYXRhLCBtYXApIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAZHJhd0xlZ2VuZCgpXG4gICAgQGRyYXdHcmFwaCBtYXBcbiAgICByZXR1cm4gQFxuXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIGQzLm1heChAZGF0YSwgKGQpIC0+IGQudmFsdWUpXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0xlZ2VuZDogLT5cbiAgICBsZWdlbkl0ZW1XaWR0aCA9IDMwXG4gICAgbGVnZW5kRGF0YSA9IEBnZXRMZWdlbmREYXRhKClcbiAgICBAbGVnZW5kID0gQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ2xlZ2VuZCdcbiAgICAgIC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgICMgZHJhdyBsZWdlbmQgcmVjdHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgncmVjdCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGktKGxlZ2VuZERhdGEubGVuZ3RoLzIpKVxuICAgICAgICAuYXR0ciAnd2lkdGgnLCBsZWdlbkl0ZW1XaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgOFxuICAgICAgICAuYXR0ciAnZmlsbCcsIChkKSA9PiBAY29sb3IgZFxuICAgIGxlZ2VuZERhdGEuc2hpZnQoKVxuICAgICMgZHJhdyBsZWdlbmQgdGV4dHNcbiAgICBAbGVnZW5kLnNlbGVjdEFsbCgndGV4dCcpXG4gICAgICAuZGF0YSBsZWdlbmREYXRhXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0ciAneCcsIChkLGkpIC0+IE1hdGgucm91bmQgbGVnZW5JdGVtV2lkdGgqKGkrMC41LShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3knLCAyMFxuICAgICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAnc3RhcnQnXG4gICAgICAgIC50ZXh0IEBnZXRMZWdlbmRGb3JtYXRcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgIyBnZXQgY291bnRyaWVzIGRhdGFcbiAgICBAY291bnRyaWVzID0gdG9wb2pzb24uZmVhdHVyZShtYXAsIG1hcC5vYmplY3RzLmNvdW50cmllcyk7XG4gICAgQGNvdW50cmllcy5mZWF0dXJlcyA9IEBjb3VudHJpZXMuZmVhdHVyZXMuZmlsdGVyIChkKSAtPiBkLmlkICE9ICcwMTAnICAjIHJlbW92ZSBhbnRhcmN0aWNhXG4gICAgIyBzZXQgcHJvamVjdGlvblxuICAgIEBwcm9qZWN0aW9uID0gZDMuZ2VvS2F2cmF5c2tpeTcoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgIyBzZXQgcGF0aFxuICAgIEBwYXRoID0gZDMuZ2VvUGF0aCgpXG4gICAgICAucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgICMgYWRkIGNvdW50cmllcyBwYXRoc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgLmRhdGEoQGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLmF0dHIgJ2lkJywgKGQpIC0+ICdjb3VudHJ5LScrZC5pZFxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+ICdjb3VudHJ5J1xuICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnc3Ryb2tlLXdpZHRoJywgMVxuICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgIC5hdHRyICdkJywgQHBhdGhcbiAgICAjIGFkZCBtb3VzZSBldmVudHMgbGlzdGVuZXJzIGlmIHRoZXJlJ3MgYSB0b29sdGlwXG4gICAgaWYgQCR0b29sdGlwXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgICAub24gJ21vdXNlb3ZlcicsIEBvbk1vdXNlT3ZlclxuICAgICAgICAub24gJ21vdXNlbW92ZScsIEBvbk1vdXNlTW92ZVxuICAgICAgICAub24gJ21vdXNlb3V0JywgQG9uTW91c2VPdXRcbiAgICAjIHRyaWdnZXIgZHJhdy1jb21wbGV0ZSBldmVudFxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoOiAoZGF0YSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKGRhdGEpXG4gICAgQHNldENvbG9yRG9tYWluKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuYXR0ciAnZmlsbCcsIEBzZXRDb3VudHJ5Q29sb3JcbiAgICAgICAgLmF0dHIgJ3N0cm9rZScsIEBzZXRDb3VudHJ5Q29sb3JcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBwcm9qZWN0aW9uU2V0U2l6ZSgpXG4gICAgQHBhdGgucHJvamVjdGlvbiBAcHJvamVjdGlvblxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuY291bnRyeScpXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgaWYgQG9wdGlvbnMubGVnZW5kXG4gICAgICBAbGVnZW5kLmNhbGwgQHNldExlZ2VuZFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuICBwcm9qZWN0aW9uU2V0U2l6ZTogLT5cbiAgICBAcHJvamVjdGlvblxuICAgICAgLmZpdFNpemUgW0B3aWR0aCwgQGhlaWdodF0sIEBjb3VudHJpZXMgICMgZml0IHByb2plY3Rpb24gc2l6ZVxuICAgICAgLnNjYWxlICAgIEBwcm9qZWN0aW9uLnNjYWxlKCkgKiAxLjEgICAgICMgQWRqdXN0IHByb2plY3Rpb24gc2l6ZSAmIHRyYW5zbGF0aW9uXG4gICAgICAudHJhbnNsYXRlIFtAd2lkdGgqMC40OCwgQGhlaWdodCowLjZdXG5cbiAgc2V0Q291bnRyeUNvbG9yOiAoZCkgPT5cbiAgICB2YWx1ZSA9IEBkYXRhLmZpbHRlciAoZSkgLT4gZS5jb2RlX251bSA9PSBkLmlkXG4gICAgcmV0dXJuIGlmIHZhbHVlWzBdIHRoZW4gQGNvbG9yKHZhbHVlWzBdLnZhbHVlKSBlbHNlICcjZWVlJ1xuXG4gIHNldExlZ2VuZFBvc2l0aW9uOiAoZWxlbWVudCkgPT5cbiAgICBlbGVtZW50LmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytNYXRoLnJvdW5kKEB3aWR0aCowLjUpKycsJysoLUBvcHRpb25zLm1hcmdpbi50b3ApKycpJ1xuXG4gIGdldExlZ2VuZERhdGE6ID0+XG4gICAgcmV0dXJuIGQzLnJhbmdlIDAsIEBjb2xvci5kb21haW4oKVsxXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGRcblxuICBvbk1vdXNlT3ZlcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIGlmIHZhbHVlLmxlbmd0aCA+IDBcbiAgICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgICAgIyBTZXQgdG9vbHRpcCBjb250ZW50XG4gICAgICBAc2V0VG9vbHRpcERhdGEgdmFsdWVbMF1cbiAgICAgICMgU2V0IHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIG9mZnNldCA9ICQoZDMuZXZlbnQudGFyZ2V0KS5vZmZzZXQoKVxuICAgICAgQCR0b29sdGlwLmNzc1xuICAgICAgICAnbGVmdCc6ICAgIHBvc2l0aW9uWzBdIC0gKEAkdG9vbHRpcC53aWR0aCgpICogMC41KVxuICAgICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcbiAgICAgICAgJ29wYWNpdHknOiAnMSdcblxuICBvbk1vdXNlTW92ZTogKGQpID0+XG4gICAgcG9zaXRpb24gPSBkMy5tb3VzZShkMy5ldmVudC50YXJnZXQpXG4gICAgQCR0b29sdGlwLmNzc1xuICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICd0b3AnOiAgICAgcG9zaXRpb25bMV0gLSAoQCR0b29sdGlwLmhlaWdodCgpICogMC41KVxuXG4gIG9uTW91c2VPdXQ6IChkKSA9PlxuICAgIEAkdG9vbHRpcC5jc3MgJ29wYWNpdHknLCAnMCdcblxuICBzZXRUb29sdGlwRGF0YTogKGQpID0+XG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnRpdGxlJ1xuICAgICAgLmh0bWwgZC5uYW1lXG4gICAgQCR0b29sdGlwXG4gICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLnZhbHVlJ1xuICAgICAgLmh0bWwgQGZvcm1hdEZsb2F0KGQudmFsdWUpXG4gICAgaWYgZC5jYXNlc1xuICAgICAgQCR0b29sdGlwXG4gICAgICAgIC5maW5kICcudG9vbHRpcC1pbm5lciAuY2FzZXMnXG4gICAgICAgIC5odG1sIEBmb3JtYXRJbnRlZ2VyKGQuY2FzZXMpICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoIGV4dGVuZHMgd2luZG93Lk1hcEdyYXBoXG5cbiAgY3VycmVudFN0YXRlOiAwXG5cbiAgc3RhdGVzOiBbXG4gICAge1xuICAgICAgaWQ6ICdGZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBmZW1lbmluYSdcbiAgICAgICAgZW46ICdmZW1hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDhcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yMCwgMzBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0luZGlhJ1xuICAgICAgICAgICAgZW46ICdJbmRpYSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yN1xuICAgICAgICAgIGN5X2ZhY3RvcjogMC40NjVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWzIwLCAtNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnUmVww7pibGljYSBEb21pbmljYW5hJ1xuICAgICAgICAgICAgZW46ICdEb21pbmljYW4gUmVwdWJsaWMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnTWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYSdcbiAgICAgICAgZW46ICdtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC4yNjVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMjk3XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFszMCwgMjVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NhbmFkw6EnXG4gICAgICAgICAgICBlbjogJ0NhbmFkYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODVcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzRcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ29yZWEgZGVsIE5vcnRlJ1xuICAgICAgICAgICAgZW46ICdOb3J0aCBLb3JlYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdJVUQnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdESVUnXG4gICAgICAgIGVuOiAnSVVEJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuODRcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDFcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dFdpZHRoOiA4MFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQ2hpbmEnXG4gICAgICAgICAgICBlbjogJ0NoaW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ1BpbGwnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdww61sZG9yYSdcbiAgICAgICAgZW46ICdwaWxsJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNDY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxNlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTM1LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBcmdlbGlhJ1xuICAgICAgICAgICAgZW46ICdBbGdlcmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgY29uZG9tJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncHJlc2VydmF0aXZvIG1hc2N1bGlubydcbiAgICAgICAgZW46ICdtYWxlIGNvbmRvbSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU0MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zNDVcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnR3JlY2lhJ1xuICAgICAgICAgICAgZW46ICdHcmVlY2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTY0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjczXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgLTEwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCb3RzdWFuYSdcbiAgICAgICAgICAgIGVuOiAnQm90c3dhbmEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSW5qZWN0YWJsZSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2lueWVjdGFibGUnXG4gICAgICAgIGVuOiAnaW5qZWN0YWJsZSdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjYyXG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjU2XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsxNSwgNV1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnRXRpb3DDrWEnXG4gICAgICAgICAgICBlbjogJ0V0aGlvcGlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdtw6l0b2RvcyB0cmFkaWNpb25hbGVzJ1xuICAgICAgICBlbjogJ3RyYWRpdGlvbmFsIG1ldGhvZHMnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41MzZcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzE4XG4gICAgICAgICAgcjogMTZcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTI2LCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdCYWxjYW5lcydcbiAgICAgICAgICAgIGVuOiAnQmFsa2FucydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMzMlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbLTEwLCAwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdBbGJhbmlhJ1xuICAgICAgICAgICAgZW46ICdBbGJhbmlhJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgZ2V0TGVnZW5kRGF0YTogLT5cbiAgICByZXR1cm4gWzAsMjAsNDAsNjAsODBdXG5cbiAgZ2V0TGVnZW5kRm9ybWF0OiAoZCkgPT5cbiAgICByZXR1cm4gZCsnJSdcblxuICAjIG92ZXJyaWRlIGdldERpbWVuc2lvbnNcbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBvZmZzZXQgPSAxMDBcbiAgICBpZiBAJGVsXG4gICAgICBib2R5SGVpZ2h0ID0gJCgnYm9keScpLmhlaWdodCgpLW9mZnNldFxuICAgICAgQGNvbnRhaW5lcldpZHRoICA9IEAkZWwud2lkdGgoKVxuICAgICAgQGNvbnRhaW5lckhlaWdodCA9IEBjb250YWluZXJXaWR0aCAqIEBvcHRpb25zLmFzcGVjdFJhdGlvXG4gICAgICAjIGF2b2lkIGdyYXBoIGhlaWdodCBvdmVyZmxvdyBicm93c2VyIGhlaWdodCBcbiAgICAgIGlmIEBjb250YWluZXJIZWlnaHQgPiBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJIZWlnaHQgPSBib2R5SGVpZ2h0XG4gICAgICAgIEBjb250YWluZXJXaWR0aCA9IEBjb250YWluZXJIZWlnaHQgLyBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgICAjQCRlbC5jc3MgJ3RvcCcsIDBcbiAgICAgICMgdmVydGljYWwgY2VudGVyIGdyYXBoXG4gICAgICAjZWxzZVxuICAgICAgIyAgQCRlbC5jc3MgJ3RvcCcsIChib2R5SGVpZ2h0LUBjb250YWluZXJIZWlnaHQpIC8gMlxuICAgICAgQHdpZHRoICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldEFubm90YXRpb25zKClcblxuXG5cbiAgIyBvdmVycmlkZSBjb2xvciBkb21haW5cbiAgc2V0Q29sb3JEb21haW46IC0+XG4gICAgQGNvbG9yLmRvbWFpbiBbMCwgODBdXG4gICAgcmV0dXJuIEBcblxuICBkcmF3R3JhcGg6IChtYXApIC0+XG4gICAgc3VwZXIobWFwKVxuICAgIEByaW5nTm90ZSA9IGQzLnJpbmdOb3RlKClcbiAgICByZXR1cm4gQFxuXG4gIHNldE1hcFN0YXRlOiAoc3RhdGUpIC0+XG4gICAgaWYgc3RhdGUgIT0gQGN1cnJlbnRTdGF0ZVxuICAgICAgI2NvbnNvbGUubG9nICdzZXQgc3RhdGUgJytzdGF0ZVxuICAgICAgQGN1cnJlbnRTdGF0ZSA9IHN0YXRlXG4gICAgICBAY3VycmVudE1ldGhvZCA9IEBzdGF0ZXNbQGN1cnJlbnRTdGF0ZS0xXVxuICAgICAgJCgnI21hcC1jb250cmFjZXB0aXZlcy11c2UtbWV0aG9kJykuaHRtbCBAY3VycmVudE1ldGhvZC50ZXh0W0BvcHRpb25zLmxhbmddXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PiBkLnZhbHVlID0gK2RbQGN1cnJlbnRNZXRob2QuaWRdXG4gICAgICBAdXBkYXRlR3JhcGggQGRhdGFcbiAgICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cbiAgc2V0QW5ub3RhdGlvbnM6IC0+XG4gICAgaWYgQGN1cnJlbnRNZXRob2RcbiAgICAgIEBjdXJyZW50TWV0aG9kLmxhYmVscy5mb3JFYWNoIChkKSA9PiBcbiAgICAgICAgZC5jeCA9IGQuY3hfZmFjdG9yKkB3aWR0aFxuICAgICAgICBkLmN5ID0gZC5jeV9mYWN0b3IqQGhlaWdodFxuICAgICAgICBkLnRleHQgPSBkLmxhYmVsW0BvcHRpb25zLmxhbmddXG4gICAgICBAY29udGFpbmVyLmNhbGwgQHJpbmdOb3RlLCBAY3VycmVudE1ldGhvZC5sYWJlbHNcbiIsImNsYXNzIHdpbmRvdy5UcmVlbWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIG9wdGlvbnMubWluU2l6ZSA9IG9wdGlvbnMubWluU2l6ZSB8fCA2MFxuICAgIG9wdGlvbnMubm9kZXNQYWRkaW5nID0gb3B0aW9ucy5ub2Rlc1BhZGRpbmcgfHwgOFxuICAgIG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gfHwgNjAwXG4gICAgb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50ID0gb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50IHx8IDYyMFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyBvdmVycmlkZSBkcmF3IHNjYWxlc1xuICBkcmF3U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgIyBvdmVycmlkZSBzZXRTVkcgdG8gdXNlIGEgZGl2IGNvbnRhaW5lciAobm9kZXMtY29udGFpbmVyKSBpbnN0ZWFkIG9mIGEgc3ZnIGVsZW1lbnRcbiAgc2V0U1ZHOiAtPlxuICAgIEBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK0BpZCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGVzLWNvbnRhaW5lcidcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgZHJhd0dyYXBoOiAtPlxuICAgIEB0cmVlbWFwID0gZDMudHJlZW1hcCgpXG4gICAgICAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgICAgLnBhZGRpbmcgMFxuICAgICAgLnJvdW5kIHRydWVcblxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuXG4gICAgQHN0cmF0aWZ5ID0gZDMuc3RyYXRpZnkoKS5wYXJlbnRJZCAoZCkgLT4gZC5wYXJlbnRcblxuICAgIEB1cGRhdGVHcmFwaCgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgdXBkYXRlR3JhcGg6IC0+XG5cbiAgICAjIHVwZGF0ZSB0cmVtYXAgXG4gICAgQHRyZWVtYXBSb290ID0gQHN0cmF0aWZ5KEBkYXRhKVxuICAgICAgLnN1bSAoZCkgPT4gZFtAb3B0aW9ucy5rZXkudmFsdWVdXG4gICAgICAuc29ydCAoYSwgYikgLT4gYi52YWx1ZSAtIGEudmFsdWVcbiAgICBAdHJlZW1hcCBAdHJlZW1hcFJvb3RcblxuICAgICMgdXBkYXRlIG5vZGVzXG4gICAgbm9kZXMgPSBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG5cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLmRhdGEgQHRyZWVtYXBSb290LmxlYXZlcygpXG4gICAgXG4gICAgbm9kZXMuZW50ZXIoKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZSdcbiAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwnXG4gICAgICAgIC5hcHBlbmQgJ2RpdidcbiAgICAgICAgICAuYXR0ciAnY2xhc3MnLCAnbm9kZS1sYWJlbC1jb250ZW50J1xuICAgICAgICAgIC5hcHBlbmQgJ3AnXG5cbiAgICAjIHNldHVwIG5vZGVzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5jYWxsIEBzZXROb2RlXG4gICAgICAuY2FsbCBAc2V0Tm9kZURpbWVuc2lvbnNcblxuICAgICMgYWRkIGxhYmVsIG9ubHkgaW4gbm9kZXMgd2l0aCBzaXplIGdyZWF0ZXIgdGhlbiBvcHRpb25zLm1pblNpemVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmNhbGwgICBAc2V0Tm9kZUxhYmVsXG4gICAgICAuZmlsdGVyIEBpc05vZGVMYWJlbFZpc2libGUgICAgIyBmaWx0ZXIgbm9kZXMgd2l0aCBsYWJlbHMgdmlzaWJsZXMgKGJhc2VkIG9uIG9wdGlvbnMubWluU2l6ZSlcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICd2aXNpYmxlJ1xuXG4gICAgbm9kZXMuZXhpdCgpLnJlbW92ZSgpXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGhcbiAgICAgIEBoZWlnaHQgICAgICAgICAgPSBAY29udGFpbmVySGVpZ2h0IC0gQG9wdGlvbnMubWFyZ2luLnRvcCAtIEBvcHRpb25zLm1hcmdpbi5ib3R0b21cbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICBzdXBlcigpXG5cbiAgICBAY29udGFpbmVyLnN0eWxlICdoZWlnaHQnLCBAaGVpZ2h0KydweCdcblxuICAgICMgVXBkYXRlIHRyZW1hcCBzaXplXG4gICAgaWYgQHdpZHRoIDw9IEBvcHRpb25zLm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNsaWNlXG4gICAgZWxzZVxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU3F1YXJpZnlcbiAgICBAdHJlZW1hcC5zaXplIFtAd2lkdGgsIEBoZWlnaHRdXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIFVwZGF0ZSBub2RlcyBkYXRhXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG4gICAgICBcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm5vZGUtbGFiZWwnKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ2hpZGRlbicgICMgSGlkZSBsYWJlbHMgYnkgZGVmYXVsdCAoc2V0Tm9kZUxhYmVsIHdpbGwgc2hvdyBpZiBub2RlIGlzIGJpZ2dlciBlbm91Z2h0KVxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIHJldHVybiBAXG5cblxuICBzZXROb2RlOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ2NsYXNzJywgICAgICAgQGdldE5vZGVDbGFzc1xuICAgICAgLnN0eWxlICdwYWRkaW5nJywgICAgKGQpID0+IGlmIChkLngxLWQueDAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZyAmJiBkLnkxLWQueTAgPiAyKkBvcHRpb25zLm5vZGVzUGFkZGluZykgdGhlbiBAb3B0aW9ucy5ub2Rlc1BhZGRpbmcrJ3B4JyBlbHNlIDBcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsIChkKSAtPiBpZiAoZC54MS1kLngwID09IDApIHx8IChkLnkxLWQueTAgPT0gMCkgdGhlbiAnaGlkZGVuJyBlbHNlICcnXG5cbiAgc2V0Tm9kZURpbWVuc2lvbnM6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc3R5bGUgJ2xlZnQnLCAgIChkKSAtPiBkLngwICsgJ3B4J1xuICAgICAgLnN0eWxlICd0b3AnLCAgICAoZCkgLT4gZC55MCArICdweCdcbiAgICAgIC5zdHlsZSAnd2lkdGgnLCAgKGQpIC0+IGQueDEtZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAnaGVpZ2h0JywgKGQpIC0+IGQueTEtZC55MCArICdweCdcblxuICBzZXROb2RlTGFiZWw6IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLnNlbGVjdCgncCcpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAoZCkgLT4gcmV0dXJuIGlmIGQudmFsdWUgPiAyNSB0aGVuICdzaXplLWwnIGVsc2UgaWYgZC52YWx1ZSA8IDEwIHRoZW4gJ3NpemUtcycgZWxzZSAnJ1xuICAgICAgLmh0bWwgKGQpID0+IGQuZGF0YVtAb3B0aW9ucy5rZXkuaWRdXG5cbiAgaXNOb2RlTGFiZWxWaXNpYmxlOiAoZCkgPT5cbiAgICByZXR1cm4gZC54MS1kLngwID4gQG9wdGlvbnMubWluU2l6ZSAmJiBkLnkxLWQueTAgPiBAb3B0aW9ucy5taW5TaXplXG5cbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUnXG4gICAgIiwiY2xhc3Mgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LlRyZWVtYXBHcmFwaFxuXG4gICMgb3ZlcmRyaXZlIGRhdGEgUGFyc2VyXG4gIGRhdGFQYXJzZXI6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICAgIyBzZXQgcGFyc2VkRGF0YSBhcnJheVxuICAgIHBhcnNlZERhdGEgPSBbe2lkOiAncid9XSAjIGFkZCB0cmVlbWFwIHJvb3RcbiAgICAjIFRPRE8hISEgR2V0IGN1cnJlbnQgY291bnRyeSAmIGFkZCBzZWxlY3QgaW4gb3JkZXIgdG8gY2hhbmdlIGl0XG4gICAgZGF0YV9jb3VudHJ5ID0gZGF0YS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICBjb25zb2xlLmxvZyBkYXRhX2NvdW50cnlbMF1cbiAgICBpZiBkYXRhX2NvdW50cnlbMF1cbiAgICAgICMgc2V0IG1ldGhvZHMgb2JqZWN0XG4gICAgICBtZXRob2RzID0ge31cbiAgICAgIEBvcHRpb25zLm1ldGhvZHNLZXlzLmZvckVhY2ggKGtleSxpKSA9PlxuICAgICAgICBpZiBkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICAgIG1ldGhvZHNba2V5XSA9XG4gICAgICAgICAgICBpZDoga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvIC9nLCAnLScpLnJlcGxhY2UoJyknLCAnJykucmVwbGFjZSgnKCcsICcnKVxuICAgICAgICAgICAgbmFtZTogQG9wdGlvbnMubWV0aG9kc05hbWVzW2ldXG4gICAgICAgICAgICB2YWx1ZTogK2RhdGFfY291bnRyeVswXVtrZXldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmxvZyBcIlRoZXJlJ3Mgbm8gZGF0YSBmb3IgXCIgKyBrZXlcbiAgICAgICMgZmlsdGVyIG1ldGhvZHMgd2l0aCB2YWx1ZSA8IDUlICYgYWRkIHRvIE90aGVyIG1vZGVybiBtZXRob2RzXG4gICAgICBmb3Iga2V5LG1ldGhvZCBvZiBtZXRob2RzXG4gICAgICAgIGlmIGtleSAhPSAnT3RoZXIgbW9kZXJuIG1ldGhvZHMnIGFuZCBrZXkgIT0gJ0FueSB0cmFkaXRpb25hbCBtZXRob2QnIGFuZCBtZXRob2QudmFsdWUgPCA1XG4gICAgICAgICAgbWV0aG9kc1snT3RoZXIgbW9kZXJuIG1ldGhvZHMnXS52YWx1ZSArPSBtZXRob2QudmFsdWVcbiAgICAgICAgICBkZWxldGUgbWV0aG9kc1trZXldXG4gICAgIFxuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBwYXJzZWREYXRhLnB1c2hcbiAgICAgICAgICBpZDogbWV0aG9kLmlkXG4gICAgICAgICAgcmF3X25hbWU6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgbmFtZTogJzxzdHJvbmc+JyArIG1ldGhvZC5uYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLm5hbWUuc2xpY2UoMSkgKyAnPC9zdHJvbmc+PGJyLz4nICsgTWF0aC5yb3VuZChtZXRob2QudmFsdWUpICsgJyUnXG4gICAgICAgICAgdmFsdWU6IG1ldGhvZC52YWx1ZVxuICAgICAgICAgIHBhcmVudDogJ3InXG4gICAgICBwYXJzZWREYXRhU29ydGVkID0gcGFyc2VkRGF0YS5zb3J0IChhLGIpIC0+IGlmIGEudmFsdWUgYW5kIGIudmFsdWUgdGhlbiBiLnZhbHVlLWEudmFsdWUgZWxzZSAxXG4gICAgICAjIHNldCBjYXB0aW9uIGNvdW50cnkgbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cnknKS5odG1sIGNvdW50cnlfbmFtZVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWFueS1tZXRob2QnKS5odG1sIE1hdGgucm91bmQoZGF0YV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKVxuICAgICAgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgcGFyc2VkRGF0YVNvcnRlZFswXS5yYXdfbmFtZVxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUud2FybiAnTm8gZGF0YSBjb3VudHJ5IGZvciAnK2NvdW50cnlfY29kZVxuICAgICAgIyBUT0RPISEhIFdoYXQgd2UgZG8gaWYgdGhlcmUncyBubyBkYXRhIGZvciB1c2VyJ3MgY291bnRyeVxuICAgIHJldHVybiBwYXJzZWREYXRhXG5cbiAgIyBvdmVyZHJpdmUgc2V0IGRhdGFcbiAgc2V0RGF0YTogKGRhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBvcmlnaW5hbERhdGEgPSBkYXRhXG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihAb3JpZ2luYWxEYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSlcbiAgICBAZHJhd0dyYXBoKClcbiAgICAjQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgQCRlbC50cmlnZ2VyICdkcmF3LWNvbXBsZXRlJ1xuICAgIHJldHVybiBAXG5cbiAgdXBkYXRlRGF0YTogKGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQHVwZGF0ZUdyYXBoKClcbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcmRyaXZlIG5vZGUgY2xhc3NcbiAgZ2V0Tm9kZUNsYXNzOiAoZCkgLT5cbiAgICByZXR1cm4gJ25vZGUgbm9kZS0nK2QuaWRcblxuICAjIyMgb3ZlcmRyaXZlIHJlc2l6ZVxuICBvblJlc2l6ZTogPT5cbiAgICBzdXBlcigpXG4gICAgQHNldENvbnRhaW5lck9mZnNldCgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb250YWluZXJPZmZzZXQ6IC0+XG4gICAgQCRlbC5jc3MoJ3RvcCcsICgkKHdpbmRvdykuaGVpZ2h0KCktQCRlbC5oZWlnaHQoKSkqMC41KVxuICAjIyMiLCJjbGFzcyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgaW5jb21lTGV2ZWxzOiBbMTAwNSwgMzk1NSwgMTIyMzVdXG5cbiAgbGFiZWxzOiBbXG4gICAgJ0FHTycsXG4gICAgJ0JHRCcsXG4gICAgJ0JSQScsXG4gICAgJ0NITicsXG4gICAgJ0RFVScsXG4gICAgJ0VTUCcsXG4gICAgJ0VUSCcsXG4gICAgJ0lORCcsXG4gICAgJ0lETicsXG4gICAgJ0pQTicsXG4gICAgJ05HQScsXG4gICAgJ1BBSycsXG4gICAgJ1BITCcsXG4gICAgJ1JVUycsXG4gICAgJ1NBVScsXG4gICAgJ1RVUicsXG4gICAgJ1VHQScsXG4gICAgJ1VTQScsXG4gICAgJ1ZOTSdcbiAgXVxuXG4gICMgQ29uc3RydWN0b3JcbiAgIyAtLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yOiAoaWQsIG9wdGlvbnMpIC0+XG4gICAgI2NvbnNvbGUubG9nICdCZWVzd2FybUdyYXBoJywgaWRcbiAgICBvcHRpb25zLmRvdFNpemUgPSBvcHRpb25zLmRvdFNpemUgfHwgNVxuICAgIG9wdGlvbnMuZG90TWluU2l6ZSA9IG9wdGlvbnMuZG90TWluU2l6ZSB8fMKgMlxuICAgIG9wdGlvbnMuZG90TWF4U2l6ZSA9IG9wdGlvbnMuZG90TWF4U2l6ZSB8fCAxNVxuICAgIG9wdGlvbnMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCAwICMgbW9kZSAwOiBiZWVzd2FybSwgbW9kZSAxOiBzY2F0dGVycGxvdFxuICAgIHN1cGVyIGlkLCBvcHRpb25zXG4gICAgcmV0dXJuIEBcblxuXG4gICMgTWFpbiBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZGF0YVBhcnNlcjogKGRhdGEpIC0+XG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgIHJldHVybiBkYXRhLnNvcnQgKGEsYikgPT4gYltAb3B0aW9ucy5rZXkuc2l6ZV0tYVtAb3B0aW9ucy5rZXkuc2l6ZV1cbiAgICBlbHNlXG4gICAgICByZXR1cm4gZGF0YVxuXG4gIGRyYXdHcmFwaDogLT5cblxuICAgIEBzZXRTaXplKClcblxuICAgICMgc2V0ICYgcnVuIHNpbXVsYXRpb25cbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuXG4gICAgIyBkcmF3IGRvdHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuZGF0YSBAZGF0YVxuICAgIC5lbnRlcigpLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdkb3QnXG4gICAgICAuYXR0ciAnaWQnLCAoZCkgPT4gJ2RvdC0nK2RbQG9wdGlvbnMua2V5LmlkXVxuICAgICAgLmNhbGwgQHNldERvdFxuICAgICAgIy5vbiAnbW91c2VvdmVyJywgKGQpID0+IGNvbnNvbGUubG9nIGRcblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmRhdGEgQGRhdGEuZmlsdGVyIChkKSA9PiBAbGFiZWxzLmluZGV4T2YoZFtAb3B0aW9ucy5rZXkuaWRdKSAhPSAtMVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpID0+IHJldHVybiBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDEwMDAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbCcgZWxzZSBpZiBkW0BvcHRpb25zLmtleS5zaXplXSA+IDE4MDAwMDAwMCB0aGVuICdkb3QtbGFiZWwgc2l6ZS1tJyBlbHNlICdkb3QtbGFiZWwnXG4gICAgICAgICMuYXR0ciAnZHgnLCAnMC43NWVtJ1xuICAgICAgICAuYXR0ciAnZHknLCAnMC4yNWVtJ1xuICAgICAgICAudGV4dCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkubGFiZWxdXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG5cblxuICBzZXRTaW11bGF0aW9uOiAtPlxuICAgICMgc2V0dXAgc2ltdWxhdGlvblxuICAgIGZvcmNlWSA9IGQzLmZvcmNlWSAoZCkgPT4gQHkoZFtAb3B0aW9ucy5rZXkueV0pXG4gICAgZm9yY2VZLnN0cmVuZ3RoKDEpXG4gICAgQHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oQGRhdGEpXG4gICAgICAuZm9yY2UgJ3gnLCBmb3JjZVlcbiAgICAgIC5mb3JjZSAneScsIGQzLmZvcmNlWChAd2lkdGgqLjUpXG4gICAgICAuZm9yY2UgJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKGQpID0+IHJldHVybiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzKzEgZWxzZSBAb3B0aW9ucy5kb3RTaXplKzEpXG4gICAgICAuc3RvcCgpXG5cbiAgcnVuU2ltdWxhdGlvbjogLT5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCAzNTBcbiAgICAgIEBzaW11bGF0aW9uLnRpY2soKVxuICAgICAgKytpXG5cbiAgc2V0RG90OiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3InLCAgKGQpID0+IGlmIEBzaXplIHRoZW4gZC5yYWRpdXMgZWxzZSBAb3B0aW9ucy5kb3RTaXplXG4gICAgICAuYXR0ciAnZmlsbCcsIEBnZXREb3RGaWxsXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cblxuICBzZXREb3RQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjeCcsIEBnZXRQb3NpdGlvblhcbiAgICAgIC5hdHRyICdjeScsIEBnZXRQb3NpdGlvbllcblxuICBzZXREb3RMYWJlbFBvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLmF0dHIgJ3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAneScsIEBnZXRQb3NpdGlvbllcblxuICBnZXRQb3NpdGlvblg6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC54IGVsc2UgTWF0aC5yb3VuZCBAeChkW0BvcHRpb25zLmtleS54XSlcblxuICBnZXRQb3NpdGlvblk6IChkKSA9PiBcbiAgICByZXR1cm4gaWYgQG9wdGlvbnMubW9kZSA9PSAwIHRoZW4gZC55IGVsc2UgTWF0aC5yb3VuZCBAeShkW0BvcHRpb25zLmtleS55XSlcblxuICBnZXREb3RGaWxsOiAoZCkgPT5cbiAgICByZXR1cm4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSAjaWYgQG9wdGlvbnMua2V5LmNvbG9yIGFuZCBAb3B0aW9ucy5tb2RlID09IDEgdGhlbiBAY29sb3IgZFtAb3B0aW9ucy5rZXkuY29sb3JdIGVsc2UgJyNlMjcyM2InXG5cbiAgc2V0TW9kZTogKG1vZGUpIC0+XG4gICAgQG9wdGlvbnMubW9kZSA9IG1vZGVcbiAgICBpZiBAb3B0aW9ucy5tb2RlIDwgMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCBmYWxzZVxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAgIGlmIEB4TGVnZW5kXG4gICAgICAgIEB4TGVnZW5kLnN0eWxlICdvcGFjaXR5JywgQG9wdGlvbnMubW9kZVxuICAgICAgIyBzaG93L2hpZGUgZG90IGxhYmVsc1xuICAgICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAwXG4gICAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmRlbGF5IDUwMFxuICAgICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIDFcbiAgICAgICMgc2hvdy9oaWRlIHggYXhpcyBsaW5lc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy54LmF4aXMgLnRpY2sgbGluZScpXG4gICAgICAgIC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gMlxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPCBAaW5jb21lTGV2ZWxzWzJdIG9yIGRbQG9wdGlvbnMua2V5LnldID4gMTVcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gM1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QsIC5kb3QtbGFiZWwnKVxuICAgICAgICAuY2xhc3NlZCAnaW5hY3RpdmUnLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkueF0gPiBAaW5jb21lTGV2ZWxzWzFdIG9yIGRbQG9wdGlvbnMua2V5LnldIDwgMzBcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNFxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGQuaWQgIT0gJ1NBVScgYW5kIGQuaWQgIT0gJ0pQTidcbiAgICBlbHNlIGlmIEBvcHRpb25zLm1vZGUgPT0gNVxuICAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcblxuICBzZXRTaXplOiAtPlxuICAgIGlmIEBzaXplXG4gICAgICBAZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICBkLnJhZGl1cyA9IEBzaXplIGRbQG9wdGlvbnMua2V5LnNpemVdXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgICMgdXBkYXRlIGF4aXMgc2l6ZVxuICAgIEB4QXhpcy50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgQHlBeGlzLnRpY2tTaXplIEB3aWR0aFxuICAgIHN1cGVyKClcbiAgICBAc2V0U2ltdWxhdGlvbigpXG4gICAgQHJ1blNpbXVsYXRpb24oKVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5jYWxsIEBzZXREb3RQb3NpdGlvblxuICAgICMgZHJhdyBsYWJlbHNcbiAgICBpZiBAb3B0aW9ucy5rZXkubGFiZWxcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LWxhYmVsJylcbiAgICAgICAgLmNhbGwgQHNldERvdExhYmVsUG9zaXRpb25cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgc2V0U2NhbGVzOiAtPlxuICAgICMgc2V0IHggc2NhbGVcbiAgICAjQHggPSBkMy5zY2FsZVBvdygpXG4gICAgIyAgLmV4cG9uZW50KDAuMTI1KVxuICAgICMgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgIEB4ID0gZDMuc2NhbGVMb2coKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgIyBzZXQgeSBzY2FsZVxuICAgIEB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyBzZXQgc2l6ZSBzY2FsZSBpZiBvcHRpb25zLmtleS5zaXplIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuc2l6ZVxuICAgICAgIyBFcXVpdmFsZW50IHRvIGQzLnNjYWxlU3FydCgpXG4gICAgICAjwqBodHRwczovL2JsLm9ja3Mub3JnL2QzaW5kZXB0aC83NzVjZjQzMWU2NGI2NzE4NDgxYzA2ZmM0NWRjMzRmOVxuICAgICAgQHNpemUgPSBkMy5zY2FsZVBvdygpXG4gICAgICAgIC5leHBvbmVudCAwLjVcbiAgICAgICAgLnJhbmdlIEBnZXRTaXplUmFuZ2UoKVxuICAgICMgc2V0IGNvbG9yIHNjYWxlIGlmIG9wdGlvbnMua2V5LmNvbG9yIGlzIGRlZmluZWRcbiAgICBpZiBAb3B0aW9ucy5rZXkuY29sb3JcbiAgICAgIEBjb2xvciA9IGQzLnNjYWxlVGhyZXNob2xkKClcbiAgICAgICAgLnJhbmdlIGQzLnNjaGVtZU9yYW5nZXNbNV0gIy5yZXZlcnNlKClcbiAgICAjIHNldHVwIGF4aXNcbiAgICBAeEF4aXMgPSBkMy5heGlzQm90dG9tKEB4KVxuICAgICAgLnRpY2tTaXplIEBoZWlnaHRcbiAgICAgIC50aWNrVmFsdWVzIEBpbmNvbWVMZXZlbHNcbiAgICBAeUF4aXMgPSBkMy5heGlzTGVmdChAeSlcbiAgICAgIC50aWNrU2l6ZSBAd2lkdGhcbiAgICAgIC50aWNrVmFsdWVzIFswLCAxMCwgMjAsIDMwLCA0MF1cbiAgICAgIC50aWNrRm9ybWF0IChkKSAtPiBkKyclJ1xuICAgIHJldHVybiBAXG5cbiAgc2V0WEF4aXNQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb24uYXR0ciAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgtMSw1KSdcblxuICBnZXRTY2FsZVhEb21haW46ID0+XG4gICAgcmV0dXJuIFsyNTAsIDg1MDAwXVxuXG4gIGdldFNjYWxlWURvbWFpbjogPT5cbiAgICByZXR1cm4gWzAsIGQzLm1heChAZGF0YSwgKGQpID0+IGRbQG9wdGlvbnMua2V5LnldKV1cblxuICBnZXRTaXplUmFuZ2U6ID0+XG4gICAgcmV0dXJuIFtAb3B0aW9ucy5kb3RNaW5TaXplLCBAb3B0aW9ucy5kb3RNYXhTaXplXVxuXG4gIGdldFNpemVEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS5zaXplXSldXG5cbiAgZ2V0Q29sb3JEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCAxMCwgMjAsIDMwXVxuXG4gIGRyYXdTY2FsZXM6IC0+XG4gICAgIyBzZXQgc2NhbGVzIGRvbWFpbnNcbiAgICBAeC5kb21haW4gQGdldFNjYWxlWERvbWFpbigpXG4gICAgQHkuZG9tYWluIEBnZXRTY2FsZVlEb21haW4oKVxuICAgIGlmIEBzaXplXG4gICAgICBAc2l6ZS5kb21haW4gQGdldFNpemVEb21haW4oKVxuICAgIGlmIEBjb2xvclxuICAgICAgQGNvbG9yLmRvbWFpbiBAZ2V0Q29sb3JEb21haW4oKVxuICAgICMgc2V0IHggYXhpc1xuICAgIGlmIEB4QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneCBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WEF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuYXR0ciAneTEnLCBAeSg0MCktNFxuICAgICMgc2V0IHkgYXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0ciAnY2xhc3MnLCAneSBheGlzJ1xuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueS5heGlzIC50aWNrIHRleHQnKVxuICAgICAgICAuYXR0ciAnZHgnLCAzXG4gICAgICAgIC5hdHRyICdkeScsIC00XG4gICAgIyBzZXQgeCBsZW5nZWRcbiAgICBpbmNvbWVzID0gQHhBeGlzLnRpY2tWYWx1ZXMoKVxuICAgIGluY29tZXMudW5zaGlmdCAwXG4gICAgaW5jb21lc01heCA9IEB4IEBnZXRTY2FsZVhEb21haW4oKVsxXVxuICAgIGluY29tZXMgPSBpbmNvbWVzLm1hcCAoZCkgPT4gaWYgZCA+IDAgdGhlbiAxMDAqQHgoZCkvaW5jb21lc01heCBlbHNlIDBcbiAgICBpbmNvbWVzLnB1c2ggMTAwXG4gICAgQHhMZWdlbmQgPSBkMy5zZWxlY3QoZDMuc2VsZWN0KCcjJytAaWQpLm5vZGUoKS5wYXJlbnROb2RlKS5zZWxlY3QoJy54LWxlZ2VuZCcpXG4gICAgQHhMZWdlbmQuc2VsZWN0QWxsKCdsaScpLnN0eWxlICd3aWR0aCcsIChkLGkpIC0+IChpbmNvbWVzW2krMV0taW5jb21lc1tpXSkrJyUnXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcbiIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGhhc19kaHM6IGZhbHNlICBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuXG4gIGNvbnN0cnVjdG9yOiAoZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzKSAtPlxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBjb3VudHJ5X2NvZGUgPSAkKGUudGFyZ2V0KS52YWwoKVxuICAgIGNvbnNvbGUubG9nIGNvdW50cnlfY29kZVxuXG4gICAgIyBjaGVjayBkaHMgZGF0YSBpcyBhdmFpbGFibGVcbiAgICBAaGFzX2RocyA9IHRydWVcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuaGlkZSgpXG5cbiAgICBpZiBAaGFzX2Roc1xuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvVUdJUjUyRFRfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgY29uc29sZS5sb2cgZGF0YVxuICAgICAgICBkID0gZGF0YVswXVxuICAgICAgICAjIHNldHVwIGRhdGFcbiAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcbiAgICAgICAgIyBzaG93IGZpbHRlcnNcbiAgICAgICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5VXNlIGFuZCBjb3VudHJ5VXNlWzBdXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIHVzZSAgICAgICAgICAgICA9IGNvdW50cnlVc2VbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ11cbiAgICAgICAgbWV0aG9kICAgICAgICAgID0gY291bnRyeV9tZXRob2RzWzBdLm5hbWVcbiAgICAgICAgbWV0aG9kX3ZhbHVlICAgID0gY291bnRyeV9tZXRob2RzWzBdLnZhbHVlXG4gICAgICAjIFVubWV0bmVlZHNcbiAgICAgIGNvdW50cnlVbm1ldG5lZWRzID0gQGRhdGEudW5tZXRuZWVkcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ10gXG4gICAgICAjIFJlYXNvbnNcbiAgICAgIGNvdW50cnlSZWFzb25zID0gQGRhdGEucmVhc29ucy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgQGZpbHRlciA9ICR0YXJnZXQuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuICAgICAgQGZpbHRlckVsID0gJCgnIycrQGZpbHRlcikuc2hvdygpXG4gICAgICBjb25zb2xlLmxvZyBAZmlsdGVyXG4gICAgICAjIGxvYWQgY3N2IGZpbGVcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zL1VHSVI1MkRUXycrQGZpbHRlcl9rZXlzW0BmaWx0ZXJdKycuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyBkYXRhXG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSkgLT5cblxuICAgIGNvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK21ldGhvZF92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIHVubWV0bmVlZHNcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrdW5tZXRuZWVkcykrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuXG4gICAgaWYgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrcmVhc29uX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuXG4gIHVzZVRyZWVtYXAgPSBudWxsXG4gIHVzZU1hcCA9IG51bGxcbiAgdXNlR3JhcGggPSBudWxsXG4gIHVubWV0bmVlZHNHcmFwaCA9IG51bGwgXG5cbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gIHNjcm9sbGFtYUluaXRpYWxpemVkID0gZmFsc2VcblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJpbXBsYW50ZVwiXG4gICAgICBcImlueWVjdGFibGVcIlxuICAgICAgXCJww61sZG9yYVwiXG4gICAgICBcImNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiY29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIm3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJhbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIm90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiZmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJpbXBsYW50XCJcbiAgICAgIFwiaW5qZWN0YWJsZVwiXG4gICAgICBcInBpbGxcIlxuICAgICAgXCJtYWxlIGNvbmRvbVwiXG4gICAgICBcImZlbWFsZSBjb25kb21cIlxuICAgICAgXCJ2YWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiZW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJvdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJzEnOiBcInDDrWxkb3JhXCJcbiAgICAgICcyJzogXCJESVVcIlxuICAgICAgJzMnOiBcImlueWVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmTDs25cIlxuICAgICAgJzYnOiBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICAnNyc6IFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICAnOCc6IFwiYWJzdGluZW5jaWEgcGVyacOzZGljYVwiXG4gICAgICAnOSc6IFwibWFyY2hhIGF0csOhc1wiXG4gICAgICAnMTAnOiBcIm90cm9zXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudGVcIlxuICAgICAgJzEzJzogXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgICcxNyc6IFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgJ2VuJzpcbiAgICAgICcxJzogXCJwaWxsXCJcbiAgICAgICcyJzogXCJJVURcIlxuICAgICAgJzMnOiBcImluamVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmRvbVwiXG4gICAgICAnNic6IFwiZmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgJzcnOiBcIm1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICAnOCc6IFwicGVyaW9kaWMgYWJzdGluZW5jZVwiXG4gICAgICAnOSc6IFwid2l0aGRyYXdhbFwiXG4gICAgICAnMTAnOiBcIm90aGVyXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudFwiXG4gICAgICAnMTMnOiBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgICcxNyc6IFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG5cblxuICAjIyNcbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcbiAgIyMjXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgICdlcyc6XG4gICAgICBcImFcIjogXCJubyBlc3TDoW4gY2FzYWRhc1wiXG4gICAgICBcImJcIjogXCJubyB0aWVuZW4gc2V4b1wiXG4gICAgICBcImNcIjogXCJ0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZVwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuXCJcbiAgICAgIFwiZVwiOiBcInNvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXNcIlxuICAgICAgXCJmXCI6IFwiYW1lbm9ycmVhIHBvc3RwYXJ0b1wiXG4gICAgICBcImdcIjogXCJlc3TDoW4gZGFuZG8gZWwgcGVjaG9cIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RhXCJcbiAgICAgIFwiaVwiOiBcImxhIG11amVyIHNlIG9wb25lXCJcbiAgICAgIFwialwiOiBcImVsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZVwiXG4gICAgICBcImtcIjogXCJvdHJvcyBzZSBvcG9uZW5cIiAgICAgICAgXG4gICAgICBcImxcIjogXCJwcm9oaWJpY2nDs24gcmVsaWdpb3NhXCIgIFxuICAgICAgXCJtXCI6IFwibm8gY29ub2NlIGxvcyBtw6l0b2Rvc1wiXG4gICAgICBcIm5cIjogXCJubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3NcIlxuICAgICAgXCJvXCI6IFwicHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgXCJwXCI6IFwibWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcy9wcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiIFxuICAgICAgXCJxXCI6IFwiZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvc1wiXG4gICAgICBcInJcIjogXCJjdWVzdGFuIGRlbWFzaWFkb1wiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzb1wiXG4gICAgICBcInRcIjogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgICBcInVcIjogXCJlbCBtw6l0b2RvIGVsZWdpZG8gbm8gZXN0w6EgZGlzcG9uaWJsZVwiXG4gICAgICBcInZcIjogXCJubyBoYXkgbcOpdG9kb3MgZGlzcG9uaWJsZXNcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3Ryb3NcIlxuICAgICAgXCJ6XCI6IFwibm8gbG8gc8OpXCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKSJ3MgcHJvY2Vzc2VzXCJcbiAgICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gIHJlYXNvbnNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAndjNhMDhhJzogJ25vIGVzdMOhbiBjYXNhZGFzJ1xuICAgICAgJ3YzYTA4Yic6ICdubyB0aWVuZW4gc2V4bydcbiAgICAgICd2M2EwOGMnOiAndGllbmVuIHNleG8gaW5mcmVjdWVudGUnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs24nXG4gICAgICAndjNhMDhlJzogJ3NvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXMnXG4gICAgICAndjNhMDhmJzogJ2FtZW5vcnJlYSBwb3N0cGFydG8nXG4gICAgICAndjNhMDhnJzogJ2VzdMOhbiBkYW5kbyBlbCBwZWNobydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RhJ1xuICAgICAgJ3YzYTA4aSc6ICdsYSBtdWplciBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGonOiAnZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4ayc6ICdvdHJvcyBzZSBvcG9uZW4nICAgICAgICBcbiAgICAgICd2M2EwOGwnOiAncHJvaGliaWNpw7NuIHJlbGlnaW9zYSdcbiAgICAgICd2M2EwOG0nOiAnbm8gY29ub2NlIGxvcyBtw6l0b2RvcydcbiAgICAgICd2M2EwOG4nOiAnbm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zJ1xuICAgICAgJ3YzYTA4byc6ICdwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZCdcbiAgICAgICd2M2EwOHAnOiAnbWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcydcbiAgICAgICd2M2EwOHEnOiAnZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvcydcbiAgICAgICd2M2EwOHInOiAnY3Vlc3RhbiBkZW1hc2lhZG8nXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudGVzIHBhcmEgc3UgdXNvJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICdlbic6IFxuICAgICAgJ3YzYTA4YSc6ICdub3QgbWFycmllZCdcbiAgICAgICd2M2EwOGInOiAnbm90IGhhdmluZyBzZXgnXG4gICAgICAndjNhMDhjJzogJ2luZnJlcXVlbnQgc2V4J1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2FsL2h5c3RlcmVjdG9teSdcbiAgICAgICd2M2EwOGUnOiAnc3ViZmVjdW5kL2luZmVjdW5kJ1xuICAgICAgJ3YzYTA4Zic6ICdwb3N0cGFydHVtIGFtZW5vcnJoZWljJ1xuICAgICAgJ3YzYTA4Zyc6ICdicmVhc3RmZWVkaW5nJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGljJ1xuICAgICAgJ3YzYTA4aSc6ICdyZXNwb25kZW50IG9wcG9zZWQnXG4gICAgICAndjNhMDhqJzogJ2h1c2JhbmQvcGFydG5lciBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4ayc6ICdvdGhlcnMgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGwnOiAncmVsaWdpb3VzIHByb2hpYml0aW9uJ1xuICAgICAgJ3YzYTA4bSc6ICdrbm93cyBubyBtZXRob2QnXG4gICAgICAndjNhMDhuJzogJ2tub3dzIG5vIHNvdXJjZSdcbiAgICAgICd2M2EwOG8nOiAnaGVhbHRoIGNvbmNlcm5zJ1xuICAgICAgJ3YzYTA4cCc6ICdmZWFyIG9mIHNpZGUgZWZmZWN0cydcbiAgICAgICd2M2EwOHEnOiAnbGFjayBvZiBhY2Nlc3MvdG9vIGZhcidcbiAgICAgICd2M2EwOHInOiAnY29zdHMgdG9vIG11Y2gnXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudCB0byB1c2UnXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZlcmVzIHdpdGggdGhlIGJvZHkncyBwcm9jZXNzZXNcIlxuXG5cbiAgIyBTY3JvbGxhbWEgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFNjcm9sbGFtYSA9IChpZCkgLT5cbiAgICBjb250YWluZXIgPSBkMy5zZWxlY3QoJyMnK2lkKVxuICAgIGdyYXBoaWMgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtZ3JhcGhpYycpXG4gICAgY2hhcnQgICAgID0gZ3JhcGhpYy5zZWxlY3QoJy5ncmFwaC1jb250YWluZXInKVxuICAgIHRleHQgICAgICA9IGNvbnRhaW5lci5zZWxlY3QoJy5zY3JvbGwtdGV4dCcpXG4gICAgc3RlcHMgICAgID0gdGV4dC5zZWxlY3RBbGwoJy5zdGVwJylcblxuICAgICMgaW5pdGlhbGl6ZSBzY3JvbGxhbWFcbiAgICBzY3JvbGxlciA9IHNjcm9sbGFtYSgpXG5cbiAgICAjIHJlc2l6ZSBmdW5jdGlvbiB0byBzZXQgZGltZW5zaW9ucyBvbiBsb2FkIGFuZCBvbiBwYWdlIHJlc2l6ZVxuICAgIGhhbmRsZVJlc2l6ZSA9IC0+XG4gICAgICB3aWR0aCA9IGdyYXBoaWMubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICNNYXRoLmZsb29yIHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICBoZWlnaHQgPSBNYXRoLmZsb29yIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgIyAxLiB1cGRhdGUgaGVpZ2h0IG9mIHN0ZXAgZWxlbWVudHMgZm9yIGJyZWF0aGluZyByb29tIGJldHdlZW4gc3RlcHNcbiAgICAgIHN0ZXBzLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgICAjIDIuIHVwZGF0ZSBoZWlnaHQgb2YgZ3JhcGhpYyBlbGVtZW50XG4gICAgICBncmFwaGljLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQgKyAncHgnXG4gICAgICAjIDMuIHVwZGF0ZSB3aWR0aCBvZiBjaGFydFxuICAgICAgY2hhcnRcbiAgICAgICAgLnN0eWxlICd3aWR0aCcsIHdpZHRoKydweCdcbiAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBoZWlnaHQrJ3B4J1xuICAgICAgIyA0LiB0ZWxsIHNjcm9sbGFtYSB0byB1cGRhdGUgbmV3IGVsZW1lbnQgZGltZW5zaW9uc1xuICAgICAgc2Nyb2xsZXIucmVzaXplKClcblxuICAgIGhhbmRsZUNvbnRhaW5lckVudGVyID0gKGUpIC0+XG4gICAgICAjIHN0aWNreSB0aGUgZ3JhcGhpY1xuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCB0cnVlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBmYWxzZVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRXhpdCA9IChlKSAtPlxuICAgICAgIyB1bi1zdGlja3kgdGhlIGdyYXBoaWMsIGFuZCBwaW4gdG8gdG9wL2JvdHRvbSBvZiBjb250YWluZXJcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgZmFsc2VcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuXG4gICAgaGFuZGxlU3RlcEVudGVyID0gKGUpIC0+XG4gICAgICAjwqBjb25zb2xlLmxvZyBlXG4gICAgICAkc3RlcCA9ICQoZS5lbGVtZW50KVxuICAgICAgaW5zdGFuY2UgPSAkc3RlcC5kYXRhKCdpbnN0YW5jZScpXG4gICAgICBzdGVwID0gJHN0ZXAuZGF0YSgnc3RlcCcpXG4gICAgICBpZiBpbnN0YW5jZSA9PSAwIFxuICAgICAgICAjY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAwJywgc3RlcFxuICAgICAgICBpZiB1c2VUcmVlbWFwXG4gICAgICAgICAgaWYgc3RlcCA9PSAxXG4gICAgICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgJ3dvcmxkJywgJ011bmRvJ1xuICAgICAgICAgIGVsc2UgaWYgc3RlcCA9PSAwIGFuZCBlLmRpcmVjdGlvbiA9PSAndXAnXG4gICAgICAgICAgICB1c2VUcmVlbWFwLnVwZGF0ZURhdGEgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAxIFxuICAgICAgICBpZiB1c2VNYXBcbiAgICAgICAgICAjY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAxJywgc3RlcFxuICAgICAgICAgIHVzZU1hcC5zZXRNYXBTdGF0ZSBzdGVwICMgdXBkYXRlIG1hcCBiYXNlZCBvbiBzdGVwIFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAyXG4gICAgICAgIGlmIHVzZUdyYXBoIGFuZCBzdGVwID4gMFxuICAgICAgICAgIGRhdGEgPSBbNjMsIDg4LCAxMDBdICMgNjMsIDYzKzI1LCA2MysyNSsxMlxuICAgICAgICAgIGZyb20gPSBpZiBzdGVwID4gMSB0aGVuIGRhdGFbc3RlcC0yXSBlbHNlIDBcbiAgICAgICAgICB0byA9IGRhdGFbc3RlcC0xXVxuICAgICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgICAgLmZpbHRlciAoZCkgLT4gZCA+PSBmcm9tIGFuZCBkIDwgdG9cbiAgICAgICAgICAgIC5jbGFzc2VkICdmaWxsLScrc3RlcCwgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG4gICAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMicsIHN0ZXBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gM1xuICAgICAgICBpZiB1bm1ldG5lZWRzR3JhcGhcbiAgICAgICAgICB1bm1ldG5lZWRzR3JhcGguc2V0TW9kZSBzdGVwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDRcbiAgICAgICAgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcyAuc2Nyb2xsLWdyYXBoaWMgLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzIC5zY3JvbGwtZ3JhcGhpYyAuc3RlcC0nK3N0ZXApLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgIyBzdGFydCBpdCB1cFxuICAgICMgMS4gY2FsbCBhIHJlc2l6ZSBvbiBsb2FkIHRvIHVwZGF0ZSB3aWR0aC9oZWlnaHQvcG9zaXRpb24gb2YgZWxlbWVudHNcbiAgICBoYW5kbGVSZXNpemUoKVxuXG4gICAgIyAyLiBzZXR1cCB0aGUgc2Nyb2xsYW1hIGluc3RhbmNlXG4gICAgIyAzLiBiaW5kIHNjcm9sbGFtYSBldmVudCBoYW5kbGVycyAodGhpcyBjYW4gYmUgY2hhaW5lZCBsaWtlIGJlbG93KVxuICAgIHNjcm9sbGVyXG4gICAgICAuc2V0dXBcbiAgICAgICAgY29udGFpbmVyOiAgJyMnK2lkICAgICAgICAgICAgICAgICMgb3VyIG91dGVybW9zdCBzY3JvbGx5dGVsbGluZyBlbGVtZW50XG4gICAgICAgIGdyYXBoaWM6ICAgICcuc2Nyb2xsLWdyYXBoaWMnICAgICAjIHRoZSBncmFwaGljXG4gICAgICAgIHRleHQ6ICAgICAgICcuc2Nyb2xsLXRleHQnICAgICAgICAjIHRoZSBzdGVwIGNvbnRhaW5lclxuICAgICAgICBzdGVwOiAgICAgICAnLnNjcm9sbC10ZXh0IC5zdGVwJyAgIyB0aGUgc3RlcCBlbGVtZW50c1xuICAgICAgICBvZmZzZXQ6ICAgICAwLjA1ICAgICAgICAgICAgICAgICAgIyBzZXQgdGhlIHRyaWdnZXIgdG8gYmUgMS8yIHdheSBkb3duIHNjcmVlblxuICAgICAgICBkZWJ1ZzogICAgICBmYWxzZSAgICAgICAgICAgICAgICAgIyBkaXNwbGF5IHRoZSB0cmlnZ2VyIG9mZnNldCBmb3IgdGVzdGluZ1xuICAgICAgLm9uQ29udGFpbmVyRW50ZXIgaGFuZGxlQ29udGFpbmVyRW50ZXIgXG4gICAgICAub25Db250YWluZXJFeGl0ICBoYW5kbGVDb250YWluZXJFeGl0IFxuXG4gICAgIyBFbnN1cmUgdG8gc2V0dXAgb25TdGVwRW50ZXIgaGFuZGxlciBvbmx5IG9uY2VcbiAgICB1bmxlc3Mgc2Nyb2xsYW1hSW5pdGlhbGl6ZWRcbiAgICAgIHNjcm9sbGFtYUluaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgc2Nyb2xsZXIub25TdGVwRW50ZXIgIGhhbmRsZVN0ZXBFbnRlciBcbiAgICAgIFxuICAgICMgc2V0dXAgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgR3JhcGggXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGggPSAtPlxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaC1jb250YWluZXInXG4gICAgIyBTZXR1cCBHcmFwaFxuICAgIGdyYXBoV2lkdGggPSAwXG4gICAgZGF0YUluZGV4ID0gWzAuLjk5XVxuICAgIHVzZUdyYXBoID0gZDMuc2VsZWN0KCcjY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoJylcbiAgICB1c2VHcmFwaC5hcHBlbmQoJ3VsJylcbiAgICAgIC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgLmRhdGEoZGF0YUluZGV4KVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaScpXG4gICAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgICAgLmFwcGVuZCgndXNlJylcbiAgICAgICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgJyNpY29uLXdvbWFuJylcbiAgICAgICAgICAgIC5hdHRyKCd2aWV3Qm94JywgJzAgMCAxOTMgNDUwJylcbiAgICAjIFJlc2l6ZSBoYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlciA9IC0+XG4gICAgICBpZiBncmFwaFdpZHRoICE9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBncmFwaFdpZHRoID0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGl0ZW1zV2lkdGggPSAoZ3JhcGhXaWR0aCAvIDIwKSAtIDEwXG4gICAgICAgIGl0ZW1zSGVpZ2h0ID0gMi4zMyppdGVtc1dpZHRoXG4gICAgICAgICNpdGVtc1dpZHRoID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuICcxMCUnIGVsc2UgJzUlJ1xuICAgICAgICAjaXRlbXNIZWlnaHQgPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gZ3JhcGhXaWR0aCAqIDAuMSAvIDAuNzUgZWxzZSBncmFwaFdpZHRoICogMC4wNSAvIDAuNzVcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgLnN0eWxlICd3aWR0aCcsIGl0ZW1zV2lkdGgrJ3B4J1xuICAgICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaXRlbXNIZWlnaHQrJ3B4J1xuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgICAgICAgLmF0dHIgJ3dpZHRoJywgaXRlbXNXaWR0aFxuICAgICAgICAgIC5hdHRyICdoZWlnaHQnLCBpdGVtc0hlaWdodFxuICAgICAgdXNlR3JhcGguc3R5bGUgJ21hcmdpbi10b3AnLCAoKCQoJ2JvZHknKS5oZWlnaHQoKS11c2VHcmFwaC5ub2RlKCkub2Zmc2V0SGVpZ2h0KSouNSkrJ3B4J1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCByZXNpemVIYW5kbGVyXG4gICAgcmVzaXplSGFuZGxlcigpXG5cblxuICAjIFVubWVldCBOZWVkcyB2cyBHRFAgZ3JhcGhcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoID0gKGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzKSAtPlxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAndW5tZXQtbmVlZHMtZ2RwLWNvbnRhaW5lci1ncmFwaCdcblxuICAgICMgcGFyc2UgZGF0YVxuICAgIGRhdGEgPSBbXVxuICAgIGRhdGFfdW5tZXRuZWVkcy5mb3JFYWNoIChkKSAtPlxuICAgICAgY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGUpIC0+IGUuY29kZSA9PSBkLmNvZGVcbiAgICAgIGlmIGNvdW50cnlbMF0gYW5kIGNvdW50cnlbMF1bJ2duaSddXG4gICAgICAgICAgZGF0YS5wdXNoXG4gICAgICAgICAgICB2YWx1ZTogICAgICArZFsnZXN0aW1hdGVkJ11cbiAgICAgICAgICAgIGlkOiAgICAgICAgIGNvdW50cnlbMF0uY29kZVxuICAgICAgICAgICAgbmFtZTogICAgICAgY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgICBwb3B1bGF0aW9uOiArY291bnRyeVswXVsncG9wdWxhdGlvbiddXG4gICAgICAgICAgICBnbmk6ICAgICAgICArY291bnRyeVswXVsnZ25pJ11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ05vIEdOSSBvciBQb3B1bGF0aW9uIGRhdGEgZm9yIHRoaXMgY291bnRyeScsIGQuY29kZSwgY291bnRyeVswXVxuICAgICMgc2V0dXAgZ3JhcGhcbiAgICB1bm1ldG5lZWRzR3JhcGggPSBuZXcgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCAndW5tZXQtbmVlZHMtZ2RwLWdyYXBoJyxcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDVcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHg6ICAgICAgJ2duaSdcbiAgICAgICAgeTogICAgICAndmFsdWUnXG4gICAgICAgIGlkOiAgICAgJ2lkJ1xuICAgICAgICBsYWJlbDogICduYW1lJ1xuICAgICAgICBjb2xvcjogICd2YWx1ZSdcbiAgICAgICAgc2l6ZTogICAncG9wdWxhdGlvbidcbiAgICAgIGRvdE1pblNpemU6IDFcbiAgICAgIGRvdE1heFNpemU6IDMyXG4gICAgdW5tZXRuZWVkc0dyYXBoLnNldERhdGEgZGF0YVxuICAgICQod2luZG93KS5yZXNpemUgdW5tZXRuZWVkc0dyYXBoLm9uUmVzaXplXG5cblxuICAjIFVzZSAmIFJlYXNvbnMgbWFwc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgPSAoZGF0YV91c2UsIGNvdW50cmllcywgbWFwKSAtPlxuXG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcblxuICAgICMgcGFyc2UgZGF0YSB1c2VcbiAgICBkYXRhX3VzZS5mb3JFYWNoIChkKSAtPlxuICAgICAgaXRlbSA9IGNvdW50cmllcy5maWx0ZXIgKGNvdW50cnkpIC0+IGNvdW50cnkuY29kZSA9PSBkLmNvZGVcbiAgICAgICMjI1xuICAgICAgZFsnUmh5dGhtJ10gICAgICAgICAgICAgICAgICAgID0gK2RbJ1JoeXRobSddXG4gICAgICBkWydXaXRoZHJhd2FsJ10gICAgICAgICAgICAgICAgPSArZFsnV2l0aGRyYXdhbCddXG4gICAgICBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10gPSArZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkWydUcmFkaXRpb25hbCBtZXRob2RzJ10gPSBkWydSaHl0aG0nXStkWydXaXRoZHJhd2FsJ10rZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBjb25zb2xlLmxvZyBkLmNvZGUsIGRbJ1JoeXRobSddLCBkWydXaXRoZHJhd2FsJ10sIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSwgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICBkZWxldGUgZFsnUmh5dGhtJ11cbiAgICAgIGRlbGV0ZSBkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRlbGV0ZSBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgICMjI1xuICAgICAgZC52YWx1ZXMgPSBbXSAjICtkWydBbnkgbWV0aG9kJ11cbiAgICAgIGQudmFsdWUgPSAwICAjICtkWydNYWxlIHN0ZXJpbGl6YXRpb24nXVxuICAgICAgIyBnZXQgbWFpbiBtZXRob2QgaW4gZWFjaCBjb3VudHJ5XG4gICAgICBtZXRob2RzX2tleXMuZm9yRWFjaCAoa2V5LGkpIC0+XG4gICAgICAgIGQudmFsdWVzLnB1c2hcbiAgICAgICAgICBpZDogaVxuICAgICAgICAgIG5hbWU6IG1ldGhvZHNfbmFtZXNbbGFuZ11baV1cbiAgICAgICAgICB2YWx1ZTogaWYgZFtrZXldICE9ICcnIHRoZW4gK2Rba2V5XSBlbHNlIG51bGxcbiAgICAgICAgI2RlbGV0ZSBkW2tleV1cbiAgICAgICMgc29ydCBkZXNjZW5kaW5nIHZhbHVlc1xuICAgICAgI2QudmFsdWVzLnNvcnQgKGEsYikgLT4gZDMuZGVzY2VuZGluZyhhLnZhbHVlLCBiLnZhbHVlKVxuICAgICAgI2QudmFsdWUgPSBkLnZhbHVlc1swXS52YWx1ZVxuICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICBkLm5hbWUgPSBpdGVtWzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgZC5jb2RlX251bSA9IGl0ZW1bMF1bJ2NvZGVfbnVtJ11cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgJ25vIGNvdW50cnknLCBkLmNvZGVcblxuICAgICMgU2V0IHVzZSBtYXBcbiAgICB1c2VNYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlTWFwR3JhcGggJ21hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICB0b3A6IDIwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgbGVnZW5kOiB0cnVlXG4gICAgICBsYW5nOiBsYW5nXG4gICAgdXNlTWFwLnNldERhdGEgZGF0YV91c2UsIG1hcFxuICAgIHVzZU1hcC5vblJlc2l6ZSgpXG5cbiAgICAjIHNldHVwIHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlTWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBUcmVlbmFwXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZVRyZWVtYXAgPSAoZGF0YV91c2UpIC0+XG4gICAgIyBzZXQgc2Nyb2xsYW1hIGZvciB0cmVlbWFwXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlLWNvbnRhaW5lcidcbiAgICAjIHNldHVwIHRyZWVtYXBcbiAgICB1c2VUcmVlbWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnLFxuICAgICAgYXNwZWN0UmF0aW86IDAuNTYyNVxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgdmFsdWU6ICd2YWx1ZSdcbiAgICAgICAgaWQ6ICduYW1lJ1xuICAgICAgbWV0aG9kc0tleXM6IG1ldGhvZHNfa2V5c1xuICAgICAgbWV0aG9kc05hbWVzOiBtZXRob2RzX25hbWVzW2xhbmddXG4gICAgIyBzZXQgZGF0YVxuICAgIHVzZVRyZWVtYXAuc2V0RGF0YSBkYXRhX3VzZSwgdXNlckNvdW50cnkuY29kZSwgdXNlckNvdW50cnkubmFtZVxuICAgICMgc2V0IHJlc2l6ZVxuICAgICQod2luZG93KS5yZXNpemUgdXNlVHJlZW1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBSZWFzb25zIE9wcG9zaXRpb24gR3JhcGhzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCA9IC0+XG4gICAgJGJhcnMgPSAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkIC5iYXInKVxuICAgICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQtbGVnZW5kIGxpJylcbiAgICAgIC5tb3VzZW92ZXIgLT5cbiAgICAgICAgJGJhcnNcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgICAgICAuZmlsdGVyKCcuYmFyLScrJCh0aGlzKS5hdHRyKCdjbGFzcycpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAubW91c2VvdXQgLT5cbiAgICAgICAgJGJhcnMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgZDMucXVldWUoKVxuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgLmRlZmVyIGQzLmpzb24sICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCwgbG9jYXRpb24pIC0+XG5cbiAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgZWxzZVxuICAgICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG4gICAgICAjdGVzdCBvdGhlciBjb3VudHJpZXNcbiAgICAgICN1c2VyQ291bnRyeS5jb2RlID0gJ1JVUydcbiAgICAgICN1c2VyQ291bnRyeS5uYW1lID0gJ1J1c2lhJ1xuXG4gICAgICAjIGFkZCBjb3VudHJ5IElTTyAzMTY2LTEgYWxwaGEtMyBjb2RlIHRvIGRhdGFfcmVhc29uc1xuICAgICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUyID09IGQuY29kZVxuICAgICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgICAgZC5jb2RlID0gaXRlbVswXS5jb2RlXG4gICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgT2JqZWN0LmtleXMocmVhc29uc19uYW1lc1tsYW5nXSkuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICAgICAgZFtyZWFzb25dID0gMTAwKmRbcmVhc29uXVxuICAgICAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgICAgIGRlbGV0ZSBkLmNvdW50cnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUud2FybiAnTm8gY291bnRyeSBkYXRhIGZvciAnK2QuY29kZVxuXG4gICAgICBpZiAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwIGRhdGFfdXNlXG5cbiAgICAgIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyBkYXRhX3VzZSwgY291bnRyaWVzLCBtYXBcblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNcblxuICAgICAgI2lmICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnKS5sZW5ndGhcbiAgICAgICMgIG5ldyBDb250cmFjZXB0aXZlc1JlYXNvbnMgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIHJlYXNvbnNfbmFtZXNbbGFuZ11cblxuICAgICAgaWYgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcycpLmxlbmd0aFxuICAgICAgICBzZXR1cFNjcm9sbGFtYSAnY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJ1xuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAgIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCgpXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddXG5cbikgalF1ZXJ5XG4iXX0=
