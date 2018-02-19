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
        "t": "interferes with bodys processes",
        "u": "preferred method not available",
        "v": "no method available",
        "w": "(no estándar)",
        "x": "other",
        "z": "don't know"
      }
    };
    reasons_dhs_names = {
      'es': {
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
        'v3a08p': 'fear of side effects'
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
        'v3a08p': 'fear of side effects'
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy1hcHAuY29mZmVlIiwibWFpbi1jb250cmFjZXB0aXZlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztBQUVYLFFBQUE7O0lBQUEsY0FBQSxHQUNFO01BQUEsTUFBQSxFQUNFO1FBQUEsR0FBQSxFQUFLLENBQUw7UUFDQSxLQUFBLEVBQU8sQ0FEUDtRQUVBLE1BQUEsRUFBUSxFQUZSO1FBR0EsSUFBQSxFQUFNLENBSE47T0FERjtNQUtBLFdBQUEsRUFBYSxNQUxiO01BTUEsS0FBQSxFQUFPLEtBTlA7TUFPQSxNQUFBLEVBQVEsS0FQUjtNQVFBLFdBQUEsRUFBYSxJQVJiO01BU0EsR0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxDQUFBLEVBQUksS0FESjtRQUVBLENBQUEsRUFBSSxPQUZKO09BVkY7OztJQWNGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFBTyxJQUFQO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFFQSxXQUFBLEVBQWEsWUFGYjtNQUdBLEtBQUEsRUFBTSxPQUhOOzs7SUFTVyxtQkFBQyxFQUFELEVBQUssT0FBTDs7Ozs7O01BQ1gsSUFBQyxDQUFBLEVBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixjQUFuQixFQUFtQyxPQUFuQztNQUNaLElBQUMsQ0FBQSxHQUFELEdBQVksQ0FBQSxDQUFFLEdBQUEsR0FBSSxJQUFDLENBQUEsRUFBUDtN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QUFBLElBQUEsQ0FBcEcsRUFBMkcsaUJBQWtCLENBQUEsSUFBQSxDQUE3SCxFQUFvSSxhQUFjLENBQUEsSUFBQSxDQUFsSixFQUF5SixpQkFBa0IsQ0FBQSxJQUFBLENBQTNLLEVBRE47O0lBckRLLENBUFQ7RUFwZUQsQ0FBRCxDQUFBLENBbWlCRSxNQW5pQkY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI5N1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjM0XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NvcmVhIGRlbCBOb3J0ZSdcbiAgICAgICAgICAgIGVuOiAnTm9ydGggS29yZWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NoaW5hJ1xuICAgICAgICAgICAgZW46ICdDaGluYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdQaWxsJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncMOtbGRvcmEnXG4gICAgICAgIGVuOiAncGlsbCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjQ2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MTZcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0zNSwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQXJnZWxpYSdcbiAgICAgICAgICAgIGVuOiAnQWxnZXJpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIGNvbmRvbSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3ByZXNlcnZhdGl2byBtYXNjdWxpbm8nXG4gICAgICAgIGVuOiAnbWFsZSBjb25kb20nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NDJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzQ1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0dyZWNpYSdcbiAgICAgICAgICAgIGVuOiAnR3JlZWNlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC43M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIC0xMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQm90c3VhbmEnXG4gICAgICAgICAgICBlbjogJ0JvdHN3YW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0luamVjdGFibGUnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdpbnllY3RhYmxlJ1xuICAgICAgICBlbjogJ2luamVjdGFibGUnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC42MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC41NlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIDVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0V0aW9ww61hJ1xuICAgICAgICAgICAgZW46ICdFdGhpb3BpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM2XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMxOFxuICAgICAgICAgIHI6IDE2XG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yNiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQmFsY2FuZXMnXG4gICAgICAgICAgICBlbjogJ0JhbGthbnMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMzJcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMCwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQWxiYW5pYSdcbiAgICAgICAgICAgIGVuOiAnQWxiYW5pYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gIGdldExlZ2VuZERhdGE6IC0+XG4gICAgcmV0dXJuIFswLDIwLDQwLDYwLDgwXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGQrJyUnXG5cbiAgIyBvdmVycmlkZSBnZXREaW1lbnNpb25zXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgb2Zmc2V0ID0gMTAwXG4gICAgaWYgQCRlbFxuICAgICAgYm9keUhlaWdodCA9ICQoJ2JvZHknKS5oZWlnaHQoKS1vZmZzZXRcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgI0AkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgI2Vsc2VcbiAgICAgICMgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cblxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgIHN1cGVyKG1hcClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgQGN1cnJlbnRNZXRob2QgPSBAc3RhdGVzW0BjdXJyZW50U3RhdGUtMV1cbiAgICAgICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgQGN1cnJlbnRNZXRob2QudGV4dFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT4gZC52YWx1ZSA9ICtkW0BjdXJyZW50TWV0aG9kLmlkXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4gICAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG4gIHNldEFubm90YXRpb25zOiAtPlxuICAgIGlmIEBjdXJyZW50TWV0aG9kXG4gICAgICBAY3VycmVudE1ldGhvZC5sYWJlbHMuZm9yRWFjaCAoZCkgPT4gXG4gICAgICAgIGQuY3ggPSBkLmN4X2ZhY3RvcipAd2lkdGhcbiAgICAgICAgZC5jeSA9IGQuY3lfZmFjdG9yKkBoZWlnaHRcbiAgICAgICAgZC50ZXh0ID0gZC5sYWJlbFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGNvbnRhaW5lci5jYWxsIEByaW5nTm90ZSwgQGN1cnJlbnRNZXRob2QubGFiZWxzXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgNjBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdXBkYXRlR3JhcGgoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIHVwZGF0ZUdyYXBoOiAtPlxuXG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHVwZGF0ZSBub2Rlc1xuICAgIG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgIFxuICAgIG5vZGVzLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUnXG4gICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsJ1xuICAgICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwtY29udGVudCdcbiAgICAgICAgICAuYXBwZW5kICdwJ1xuXG4gICAgIyBzZXR1cCBub2Rlc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG5cbiAgICAjIGFkZCBsYWJlbCBvbmx5IGluIG5vZGVzIHdpdGggc2l6ZSBncmVhdGVyIHRoZW4gb3B0aW9ucy5taW5TaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsICAgQHNldE5vZGVMYWJlbFxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIG5vZGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoXG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgICAjIFVwZGF0ZSB0cmVtYXAgc2l6ZVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuICAgIGVsc2VcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNxdWFyaWZ5XG4gICAgQHRyZWVtYXAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBVcGRhdGUgbm9kZXMgZGF0YVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuICAgICAgXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgc2V0Tm9kZTogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjbGFzcycsICAgICAgIEBnZXROb2RlQ2xhc3NcbiAgICAgIC5zdHlsZSAncGFkZGluZycsICAgIChkKSA9PiBpZiAoZC54MS1kLngwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcgJiYgZC55MS1kLnkwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcpIHRoZW4gQG9wdGlvbnMubm9kZXNQYWRkaW5nKydweCcgZWxzZSAwXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAoZCkgLT4gaWYgKGQueDEtZC54MCA9PSAwKSB8fCAoZC55MS1kLnkwID09IDApIHRoZW4gJ2hpZGRlbicgZWxzZSAnJ1xuXG4gIHNldE5vZGVEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgLT4gZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpIC0+IGQueTAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIChkKSAtPiBkLngxLWQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChkKSAtPiBkLnkxLWQueTAgKyAncHgnXG5cbiAgc2V0Tm9kZUxhYmVsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5zZWxlY3QoJ3AnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlJ1xuICAgICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5UcmVlbWFwR3JhcGhcblxuICAjIG92ZXJkcml2ZSBkYXRhIFBhcnNlclxuICBkYXRhUGFyc2VyOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgIyBUT0RPISEhIEdldCBjdXJyZW50IGNvdW50cnkgJiBhZGQgc2VsZWN0IGluIG9yZGVyIHRvIGNoYW5nZSBpdFxuICAgIGRhdGFfY291bnRyeSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgY29uc29sZS5sb2cgZGF0YV9jb3VudHJ5WzBdXG4gICAgaWYgZGF0YV9jb3VudHJ5WzBdXG4gICAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgICAgbWV0aG9kcyA9IHt9XG4gICAgICBAb3B0aW9ucy5tZXRob2RzS2V5cy5mb3JFYWNoIChrZXksaSkgPT5cbiAgICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgICBtZXRob2RzW2tleV0gPVxuICAgICAgICAgICAgaWQ6IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKS5yZXBsYWNlKCcpJywgJycpLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgICAgdmFsdWU6ICtkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgICAjIGZpbHRlciBtZXRob2RzIHdpdGggdmFsdWUgPCA1JSAmIGFkZCB0byBPdGhlciBtb2Rlcm4gbWV0aG9kc1xuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBpZiBrZXkgIT0gJ090aGVyIG1vZGVybiBtZXRob2RzJyBhbmQga2V5ICE9ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJyBhbmQgbWV0aG9kLnZhbHVlIDwgNVxuICAgICAgICAgIG1ldGhvZHNbJ090aGVyIG1vZGVybiBtZXRob2RzJ10udmFsdWUgKz0gbWV0aG9kLnZhbHVlXG4gICAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICBcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgICAgaWQ6IG1ldGhvZC5pZFxuICAgICAgICAgIHJhd19uYW1lOiBtZXRob2QubmFtZVxuICAgICAgICAgIG5hbWU6ICc8c3Ryb25nPicgKyBtZXRob2QubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1ldGhvZC5uYW1lLnNsaWNlKDEpICsgJzwvc3Ryb25nPjxici8+JyArIE1hdGgucm91bmQobWV0aG9kLnZhbHVlKSArICclJ1xuICAgICAgICAgIHZhbHVlOiBtZXRob2QudmFsdWVcbiAgICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgICAgcGFyc2VkRGF0YVNvcnRlZCA9IHBhcnNlZERhdGEuc29ydCAoYSxiKSAtPiBpZiBhLnZhbHVlIGFuZCBiLnZhbHVlIHRoZW4gYi52YWx1ZS1hLnZhbHVlIGVsc2UgMVxuICAgICAgIyBzZXQgY2FwdGlvbiBjb3VudHJ5IG5hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1hbnktbWV0aG9kJykuaHRtbCBNYXRoLnJvdW5kKGRhdGFfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSlcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIHBhcnNlZERhdGFTb3J0ZWRbMF0ucmF3X25hbWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gJ05vIGRhdGEgY291bnRyeSBmb3IgJytjb3VudHJ5X2NvZGVcbiAgICAgICMgVE9ETyEhISBXaGF0IHdlIGRvIGlmIHRoZXJlJ3Mgbm8gZGF0YSBmb3IgdXNlcidzIGNvdW50cnlcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgI0BzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZURhdGE6IChjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEB1cGRhdGVHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgIyMjIG92ZXJkcml2ZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSlcbiAgIyMjIiwiY2xhc3Mgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIGluY29tZUxldmVsczogWzEwMDUsIDM5NTUsIDEyMjM1XVxuXG4gIGxhYmVsczogW1xuICAgICdBR08nLFxuICAgICdCR0QnLFxuICAgICdCUkEnLFxuICAgICdDSE4nLFxuICAgICdERVUnLFxuICAgICdFU1AnLFxuICAgICdFVEgnLFxuICAgICdJTkQnLFxuICAgICdJRE4nLFxuICAgICdKUE4nLFxuICAgICdOR0EnLFxuICAgICdQQUsnLFxuICAgICdQSEwnLFxuICAgICdSVVMnLFxuICAgICdTQVUnLFxuICAgICdUVVInLFxuICAgICdVR0EnLFxuICAgICdVU0EnLFxuICAgICdWTk0nXG4gIF1cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgMCAjIG1vZGUgMDogYmVlc3dhcm0sIG1vZGUgMTogc2NhdHRlcnBsb3RcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICByZXR1cm4gZGF0YS5zb3J0IChhLGIpID0+IGJbQG9wdGlvbnMua2V5LnNpemVdLWFbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGRhdGFcblxuICBkcmF3R3JhcGg6IC0+XG5cbiAgICBAc2V0U2l6ZSgpXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgICMgZHJhdyBkb3RzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEgQGRhdGFcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RcbiAgICAgICMub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5kYXRhIEBkYXRhLmZpbHRlciAoZCkgPT4gQGxhYmVscy5pbmRleE9mKGRbQG9wdGlvbnMua2V5LmlkXSkgIT0gLTFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSA9PiByZXR1cm4gaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxMDAwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLWwnIGVsc2UgaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxODAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbScgZWxzZSAnZG90LWxhYmVsJ1xuICAgICAgICAjLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJzAuMjVlbSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LmxhYmVsXVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVkgPSBkMy5mb3JjZVkgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgIGZvcmNlWS5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VZXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVgoQHdpZHRoKi41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMzUwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIHNldERvdDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmF0dHIgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0RG90UG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAnY3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgc2V0RG90TGFiZWxQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICd4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgZ2V0UG9zaXRpb25YOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueCBlbHNlIE1hdGgucm91bmQgQHgoZFtAb3B0aW9ucy5rZXkueF0pXG5cbiAgZ2V0UG9zaXRpb25ZOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueSBlbHNlIE1hdGgucm91bmQgQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gI2lmIEBvcHRpb25zLmtleS5jb2xvciBhbmQgQG9wdGlvbnMubW9kZSA9PSAxIHRoZW4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSBlbHNlICcjZTI3MjNiJ1xuXG4gIHNldE1vZGU6IChtb2RlKSAtPlxuICAgIEBvcHRpb25zLm1vZGUgPSBtb2RlXG4gICAgaWYgQG9wdGlvbnMubW9kZSA8IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgICBpZiBAeExlZ2VuZFxuICAgICAgICBAeExlZ2VuZC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICAgICMgc2hvdy9oaWRlIGRvdCBsYWJlbHNcbiAgICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMFxuICAgICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSA1MDBcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAxXG4gICAgICAjIHNob3cvaGlkZSB4IGF4aXMgbGluZXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdIDwgQGluY29tZUxldmVsc1syXSBvciBkW0BvcHRpb25zLmtleS55XSA+IDE1XG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdID4gQGluY29tZUxldmVsc1sxXSBvciBkW0BvcHRpb25zLmtleS55XSA8IDMwXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDRcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkLmlkICE9ICdTQVUnIGFuZCBkLmlkICE9ICdKUE4nXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDVcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgI0B4ID0gZDMuc2NhbGVQb3coKVxuICAgICMgIC5leHBvbmVudCgwLjEyNSlcbiAgICAjICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeCA9IGQzLnNjYWxlTG9nKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdICMucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBAaW5jb21lTGV2ZWxzXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMTAsIDIwLCAzMCwgNDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTEsNSknXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCA4NTAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAsIDIwLCAzMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLmF0dHIgJ3kxJywgQHkoNDApLTRcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcyAudGljayB0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2R4JywgM1xuICAgICAgICAuYXR0ciAnZHknLCAtNFxuICAgICMgc2V0IHggbGVuZ2VkXG4gICAgaW5jb21lcyA9IEB4QXhpcy50aWNrVmFsdWVzKClcbiAgICBpbmNvbWVzLnVuc2hpZnQgMFxuICAgIGluY29tZXNNYXggPSBAeCBAZ2V0U2NhbGVYRG9tYWluKClbMV1cbiAgICBpbmNvbWVzID0gaW5jb21lcy5tYXAgKGQpID0+IGlmIGQgPiAwIHRoZW4gMTAwKkB4KGQpL2luY29tZXNNYXggZWxzZSAwXG4gICAgaW5jb21lcy5wdXNoIDEwMFxuICAgIEB4TGVnZW5kID0gZDMuc2VsZWN0KGQzLnNlbGVjdCgnIycrQGlkKS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KCcueC1sZWdlbmQnKVxuICAgIEB4TGVnZW5kLnNlbGVjdEFsbCgnbGknKS5zdHlsZSAnd2lkdGgnLCAoZCxpKSAtPiAoaW5jb21lc1tpKzFdLWluY29tZXNbaV0pKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG4iLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuICBoYXNfZGhzOiBmYWxzZSAgXG5cbiAgZmlsdGVyX2tleXM6IFxuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMCc6ICdyZXNpZGVuY2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0xJzogJ2FnZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTInOiAnZWR1Y2F0aW9uJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMyc6ICd3ZWFsdGgnXG5cblxuICBjb25zdHJ1Y3RvcjogKGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlcl9jb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXMsIG1ldGhvZHNfZGhzX25hbWVzLCByZWFzb25zX25hbWVzLCByZWFzb25zX2Roc19uYW1lcykgLT5cblxuICAgIEBkYXRhID0gXG4gICAgICB1c2U6ICAgICAgICBkYXRhX3VzZVxuICAgICAgdW5tZXRuZWVkczogZGF0YV91bm1ldG5lZWRzXG4gICAgICByZWFzb25zOiAgICBkYXRhX3JlYXNvbnNcblxuICAgIEBtZXRob2RzS2V5cyAgICAgID0gbWV0aG9kc19rZXlzXG4gICAgQG1ldGhvZHNOYW1lcyAgICAgPSBtZXRob2RzX25hbWVzXG4gICAgQG1ldGhvZHNESFNOYW1lcyAgPSBtZXRob2RzX2Roc19uYW1lc1xuICAgIEByZWFzb25zTmFtZXMgICAgID0gcmVhc29uc19uYW1lc1xuICAgIEByZWFzb25zREhTTmFtZXMgID0gcmVhc29uc19kaHNfbmFtZXNcblxuICAgIEAkYXBwID0gJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpXG5cbiAgICBAJGFwcC5maW5kKCcuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLnNlbGVjdDIoKVxuICAgICAgLmNoYW5nZSBAb25TZWxlY3RDb3VudHJ5XG4gICAgICAudmFsIHVzZXJfY291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5jbGljayBAb25TZWxlY3RGaWx0ZXJcblxuICAgIEAkYXBwLmNzcygnb3BhY2l0eScsMSlcblxuXG4gIG9uU2VsZWN0Q291bnRyeTogKGUpID0+XG4gICAgY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcbiAgICBjb25zb2xlLmxvZyBjb3VudHJ5X2NvZGVcblxuICAgICMgY2hlY2sgZGhzIGRhdGEgaXMgYXZhaWxhYmxlXG4gICAgQGhhc19kaHMgPSB0cnVlXG5cbiAgICB1c2UgICAgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZCAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kX3ZhbHVlICA9IG51bGxcbiAgICB1bm1ldG5lZWRzICAgID0gbnVsbFxuICAgIHJlYXNvbiAgICAgICAgPSBudWxsXG4gICAgcmVhc29uX3ZhbHVlICA9IG51bGxcblxuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKVxuXG4gICAgaWYgQGhhc19kaHNcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zL1VHSVI1MkRUX2FsbC5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGNvbnNvbGUubG9nIGRhdGFcbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICMgVXNlXG4gICAgICBjb3VudHJ5VXNlID0gQGRhdGEudXNlLmZpbHRlciAoZCkgLT4gZC5jb2RlID09IGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBAbWV0aG9kc0tleXMubWFwIChrZXksIGkpID0+IHsnbmFtZSc6IEBtZXRob2RzTmFtZXNbaV0sICd2YWx1ZSc6ICtjb3VudHJ5VXNlWzBdW2tleV19XG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICB1c2UgICAgICAgICAgICAgPSBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5VW5tZXRuZWVkcyBhbmQgY291bnRyeVVubWV0bmVlZHNbMF1cbiAgICAgICAgIyB1c2Ugc3VydmV5IGRhdGEgaWYgYXZhaWxhYmxlLCB1c2UgZXN0aW1hdGVkIGlmIG5vdFxuICAgICAgICB1bm1ldG5lZWRzID0gaWYgY291bnRyeVVubWV0bmVlZHNbMF1bJ3N1cnZleSddIHRoZW4gY291bnRyeVVubWV0bmVlZHNbMF1bJ3N1cnZleSddIGVsc2UgY291bnRyeVVubWV0bmVlZHNbMF1bJ2VzdGltYXRlZCddIFxuICAgICAgIyBSZWFzb25zXG4gICAgICBjb3VudHJ5UmVhc29ucyA9IEBkYXRhLnJlYXNvbnMuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5UmVhc29ucyBhbmQgY291bnRyeVJlYXNvbnNbMF1cbiAgICAgICAgcmVhc29ucyAgICAgID0gT2JqZWN0LmtleXMoQHJlYXNvbnNOYW1lcykubWFwIChyZWFzb24pID0+IHsnbmFtZSc6IEByZWFzb25zTmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2NvdW50cnlSZWFzb25zWzBdW3JlYXNvbl19XG4gICAgICAgIHJlYXNvbnMgICAgICA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgcmVhc29uICAgICAgID0gcmVhc29uc1swXS5uYW1lXG4gICAgICAgIHJlYXNvbl92YWx1ZSA9IHJlYXNvbnNbMF0udmFsdWVcbiAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG5cbiAgb25TZWxlY3RGaWx0ZXI6IChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIEBmaWx0ZXIgIT0gJChlLnRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICR0YXJnZXQgPSAkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIEBmaWx0ZXIgPSAkdGFyZ2V0LmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSlcbiAgICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcbiAgICAgIEBmaWx0ZXJFbCA9ICQoJyMnK0BmaWx0ZXIpLnNob3coKVxuICAgICAgY29uc29sZS5sb2cgQGZpbHRlclxuICAgICAgIyBsb2FkIGNzdiBmaWxlXG4gICAgICBkMy5jc3YgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy9VR0lSNTJEVF8nK0BmaWx0ZXJfa2V5c1tAZmlsdGVyXSsnLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgY29uc29sZS5sb2cgZGF0YVxuICAgICAgICBpZiBkYXRhXG4gICAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEBmaWx0ZXJFbC5maW5kKCcjJytAZmlsdGVyKyctJytkLmlkKSwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG5cblxuICBzZXRBcHBJdGVtRGF0YTogKCRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWUpIC0+XG5cbiAgICBjb25zb2xlLmxvZyAnc2V0QXBwSXRlbURhdGEnLCAkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cbiAgICBpZiB1c2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCt1c2UpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCttZXRob2RfdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG5cbiAgICBpZiB1bm1ldG5lZWRzXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK3VubWV0bmVlZHMpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcblxuICAgIGlmIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK3JlYXNvbl92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cblxuICB1c2VUcmVlbWFwID0gbnVsbFxuICB1c2VNYXAgPSBudWxsXG4gIHVzZUdyYXBoID0gbnVsbFxuICB1bm1ldG5lZWRzR3JhcGggPSBudWxsIFxuXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IGZhbHNlXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiaW1wbGFudGVcIlxuICAgICAgXCJpbnllY3RhYmxlXCJcbiAgICAgIFwicMOtbGRvcmFcIlxuICAgICAgXCJjb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcImNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJtw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiYW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJvdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcImZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwibWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiaW1wbGFudFwiXG4gICAgICBcImluamVjdGFibGVcIlxuICAgICAgXCJwaWxsXCJcbiAgICAgIFwibWFsZSBjb25kb21cIlxuICAgICAgXCJmZW1hbGUgY29uZG9tXCJcbiAgICAgIFwidmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcImVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwib3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgbWV0aG9kc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICcxJzogXCJww61sZG9yYVwiXG4gICAgICAnMic6IFwiRElVXCJcbiAgICAgICczJzogXCJpbnllY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kw7NuXCJcbiAgICAgICc2JzogXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgJzcnOiBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgJzgnOiBcImFic3RpbmVuY2lhIHBlcmnDs2RpY2FcIlxuICAgICAgJzknOiBcIm1hcmNoYSBhdHLDoXNcIlxuICAgICAgJzEwJzogXCJvdHJvc1wiXG4gICAgICAnMTEnOiBcImltcGxhbnRlXCJcbiAgICAgICcxMyc6IFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICAnMTcnOiBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgICdlbic6XG4gICAgICAnMSc6IFwicGlsbFwiXG4gICAgICAnMic6IFwiSVVEXCJcbiAgICAgICczJzogXCJpbmplY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kb21cIlxuICAgICAgJzYnOiBcImZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICAgICc3JzogXCJtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgICAgJzgnOiBcInBlcmlvZGljIGFic3RpbmVuY2VcIlxuICAgICAgJzknOiBcIndpdGhkcmF3YWxcIlxuICAgICAgJzEwJzogXCJvdGhlclwiXG4gICAgICAnMTEnOiBcImltcGxhbnRcIlxuICAgICAgJzEzJzogXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICAnMTcnOiBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuXG5cbiAgIyMjXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG4gICMjI1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICAnZXMnOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiICAgICAgICMgb3Bwb3NlZFxuICAgICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIiAgIyBvcHBvc2VkXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiICAgICAgICAgICAjIG9wcG9zZWRcbiAgICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiICAgICMgb3Bwb3NlZFxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIiAgICAgICAgICAgICAgICAgICAgICAjIHNhbHVkXG4gICAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIiAjIHNhbHVkXG4gICAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICAgIFwiclwiOiBcImNvc3RzIHRvbyBtdWNoXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCknMgcHJvY2Vzc2VzXCIgICAgICAjIHNhbHVkXG4gICAgICBcInVcIjogXCJwcmVmZXJyZWQgbWV0aG9kIG5vdCBhdmFpbGFibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdGhlclwiXG4gICAgICBcInpcIjogXCJkb24ndCBrbm93XCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKScyBwcm9jZXNzZXNcIlxuICAgICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgcmVhc29uc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICd2M2EwOGEnOiAnbm90IG1hcnJpZWQnXG4gICAgICAndjNhMDhiJzogJ25vdCBoYXZpbmcgc2V4J1xuICAgICAgJ3YzYTA4Yyc6ICdpbmZyZXF1ZW50IHNleCdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNhbC9oeXN0ZXJlY3RvbXknXG4gICAgICAndjNhMDhlJzogJ3N1YmZlY3VuZC9pbmZlY3VuZCdcbiAgICAgICd2M2EwOGYnOiAncG9zdHBhcnR1bSBhbWVub3JyaGVpYydcbiAgICAgICd2M2EwOGcnOiAnYnJlYXN0ZmVlZGluZydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RpYydcbiAgICAgICd2M2EwOGknOiAncmVzcG9uZGVudCBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4aic6ICdodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGsnOiAnb3RoZXJzIG9wcG9zZWQnXG4gICAgICAndjNhMDhsJzogJ3JlbGlnaW91cyBwcm9oaWJpdGlvbidcbiAgICAgICd2M2EwOG0nOiAna25vd3Mgbm8gbWV0aG9kJ1xuICAgICAgJ3YzYTA4bic6ICdrbm93cyBubyBzb3VyY2UnXG4gICAgICAndjNhMDhvJzogJ2hlYWx0aCBjb25jZXJucydcbiAgICAgICd2M2EwOHAnOiAnZmVhciBvZiBzaWRlIGVmZmVjdHMnXG4gICAgJ2VuJzogXG4gICAgICAndjNhMDhhJzogJ25vdCBtYXJyaWVkJ1xuICAgICAgJ3YzYTA4Yic6ICdub3QgaGF2aW5nIHNleCdcbiAgICAgICd2M2EwOGMnOiAnaW5mcmVxdWVudCBzZXgnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzYWwvaHlzdGVyZWN0b215J1xuICAgICAgJ3YzYTA4ZSc6ICdzdWJmZWN1bmQvaW5mZWN1bmQnXG4gICAgICAndjNhMDhmJzogJ3Bvc3RwYXJ0dW0gYW1lbm9ycmhlaWMnXG4gICAgICAndjNhMDhnJzogJ2JyZWFzdGZlZWRpbmcnXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0aWMnXG4gICAgICAndjNhMDhpJzogJ3Jlc3BvbmRlbnQgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGonOiAnaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQnXG4gICAgICAndjNhMDhrJzogJ290aGVycyBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4bCc6ICdyZWxpZ2lvdXMgcHJvaGliaXRpb24nXG4gICAgICAndjNhMDhtJzogJ2tub3dzIG5vIG1ldGhvZCdcbiAgICAgICd2M2EwOG4nOiAna25vd3Mgbm8gc291cmNlJ1xuICAgICAgJ3YzYTA4byc6ICdoZWFsdGggY29uY2VybnMnXG4gICAgICAndjNhMDhwJzogJ2ZlYXIgb2Ygc2lkZSBlZmZlY3RzJ1xuXG4gICMgU2Nyb2xsYW1hIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBTY3JvbGxhbWEgPSAoaWQpIC0+XG4gICAgY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytpZClcbiAgICBncmFwaGljICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLWdyYXBoaWMnKVxuICAgIGNoYXJ0ICAgICA9IGdyYXBoaWMuc2VsZWN0KCcuZ3JhcGgtY29udGFpbmVyJylcbiAgICB0ZXh0ICAgICAgPSBjb250YWluZXIuc2VsZWN0KCcuc2Nyb2xsLXRleHQnKVxuICAgIHN0ZXBzICAgICA9IHRleHQuc2VsZWN0QWxsKCcuc3RlcCcpXG5cbiAgICAjIGluaXRpYWxpemUgc2Nyb2xsYW1hXG4gICAgc2Nyb2xsZXIgPSBzY3JvbGxhbWEoKVxuXG4gICAgIyByZXNpemUgZnVuY3Rpb24gdG8gc2V0IGRpbWVuc2lvbnMgb24gbG9hZCBhbmQgb24gcGFnZSByZXNpemVcbiAgICBoYW5kbGVSZXNpemUgPSAtPlxuICAgICAgd2lkdGggPSBncmFwaGljLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAjTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICMgMS4gdXBkYXRlIGhlaWdodCBvZiBzdGVwIGVsZW1lbnRzIGZvciBicmVhdGhpbmcgcm9vbSBiZXR3ZWVuIHN0ZXBzXG4gICAgICBzdGVwcy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAyLiB1cGRhdGUgaGVpZ2h0IG9mIGdyYXBoaWMgZWxlbWVudFxuICAgICAgZ3JhcGhpYy5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0ICsgJ3B4J1xuICAgICAgIyAzLiB1cGRhdGUgd2lkdGggb2YgY2hhcnRcbiAgICAgIGNoYXJ0XG4gICAgICAgIC5zdHlsZSAnd2lkdGgnLCB3aWR0aCsncHgnXG4gICAgICAgIC5zdHlsZSAnaGVpZ2h0JywgaGVpZ2h0KydweCdcbiAgICAgICMgNC4gdGVsbCBzY3JvbGxhbWEgdG8gdXBkYXRlIG5ldyBlbGVtZW50IGRpbWVuc2lvbnNcbiAgICAgIHNjcm9sbGVyLnJlc2l6ZSgpXG5cbiAgICBoYW5kbGVDb250YWluZXJFbnRlciA9IChlKSAtPlxuICAgICAgIyBzdGlja3kgdGhlIGdyYXBoaWNcbiAgICAgIGdyYXBoaWNcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWZpeGVkJywgdHJ1ZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZmFsc2VcblxuICAgIGhhbmRsZUNvbnRhaW5lckV4aXQgPSAoZSkgLT5cbiAgICAgICMgdW4tc3RpY2t5IHRoZSBncmFwaGljLCBhbmQgcGluIHRvIHRvcC9ib3R0b20gb2YgY29udGFpbmVyXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIGZhbHNlXG4gICAgICAgIC5jbGFzc2VkICdpcy1ib3R0b20nLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcblxuICAgIGhhbmRsZVN0ZXBFbnRlciA9IChlKSAtPlxuICAgICAgI8KgY29uc29sZS5sb2cgZVxuICAgICAgJHN0ZXAgPSAkKGUuZWxlbWVudClcbiAgICAgIGluc3RhbmNlID0gJHN0ZXAuZGF0YSgnaW5zdGFuY2UnKVxuICAgICAgc3RlcCA9ICRzdGVwLmRhdGEoJ3N0ZXAnKVxuICAgICAgaWYgaW5zdGFuY2UgPT0gMCBcbiAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMCcsIHN0ZXBcbiAgICAgICAgaWYgdXNlVHJlZW1hcFxuICAgICAgICAgIGlmIHN0ZXAgPT0gMVxuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhICd3b3JsZCcsICdNdW5kbydcbiAgICAgICAgICBlbHNlIGlmIHN0ZXAgPT0gMCBhbmQgZS5kaXJlY3Rpb24gPT0gJ3VwJ1xuICAgICAgICAgICAgdXNlVHJlZW1hcC51cGRhdGVEYXRhIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMSBcbiAgICAgICAgaWYgdXNlTWFwXG4gICAgICAgICAgI2NvbnNvbGUubG9nICdzY3JvbGxhbWEgMScsIHN0ZXBcbiAgICAgICAgICB1c2VNYXAuc2V0TWFwU3RhdGUgc3RlcCAjIHVwZGF0ZSBtYXAgYmFzZWQgb24gc3RlcCBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gMlxuICAgICAgICBpZiB1c2VHcmFwaCBhbmQgc3RlcCA+IDBcbiAgICAgICAgICBkYXRhID0gWzYzLCA4OCwgMTAwXSAjIDYzLCA2MysyNSwgNjMrMjUrMTJcbiAgICAgICAgICBmcm9tID0gaWYgc3RlcCA+IDEgdGhlbiBkYXRhW3N0ZXAtMl0gZWxzZSAwXG4gICAgICAgICAgdG8gPSBkYXRhW3N0ZXAtMV1cbiAgICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAgIC5maWx0ZXIgKGQpIC0+IGQgPj0gZnJvbSBhbmQgZCA8IHRvXG4gICAgICAgICAgICAuY2xhc3NlZCAnZmlsbC0nK3N0ZXAsIGUuZGlyZWN0aW9uID09ICdkb3duJ1xuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDInLCBzdGVwXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDNcbiAgICAgICAgaWYgdW5tZXRuZWVkc0dyYXBoXG4gICAgICAgICAgdW5tZXRuZWVkc0dyYXBoLnNldE1vZGUgc3RlcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSA0XG4gICAgICAgICQoJyNjYXJvdXNlbC1tYXJpZS1zdG9wZXMgLnNjcm9sbC1ncmFwaGljIC5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcyAuc2Nyb2xsLWdyYXBoaWMgLnN0ZXAtJytzdGVwKS5hZGRDbGFzcygnYWN0aXZlJylcblxuICAgICMgc3RhcnQgaXQgdXBcbiAgICAjIDEuIGNhbGwgYSByZXNpemUgb24gbG9hZCB0byB1cGRhdGUgd2lkdGgvaGVpZ2h0L3Bvc2l0aW9uIG9mIGVsZW1lbnRzXG4gICAgaGFuZGxlUmVzaXplKClcblxuICAgICMgMi4gc2V0dXAgdGhlIHNjcm9sbGFtYSBpbnN0YW5jZVxuICAgICMgMy4gYmluZCBzY3JvbGxhbWEgZXZlbnQgaGFuZGxlcnMgKHRoaXMgY2FuIGJlIGNoYWluZWQgbGlrZSBiZWxvdylcbiAgICBzY3JvbGxlclxuICAgICAgLnNldHVwXG4gICAgICAgIGNvbnRhaW5lcjogICcjJytpZCAgICAgICAgICAgICAgICAjIG91ciBvdXRlcm1vc3Qgc2Nyb2xseXRlbGxpbmcgZWxlbWVudFxuICAgICAgICBncmFwaGljOiAgICAnLnNjcm9sbC1ncmFwaGljJyAgICAgIyB0aGUgZ3JhcGhpY1xuICAgICAgICB0ZXh0OiAgICAgICAnLnNjcm9sbC10ZXh0JyAgICAgICAgIyB0aGUgc3RlcCBjb250YWluZXJcbiAgICAgICAgc3RlcDogICAgICAgJy5zY3JvbGwtdGV4dCAuc3RlcCcgICMgdGhlIHN0ZXAgZWxlbWVudHNcbiAgICAgICAgb2Zmc2V0OiAgICAgMC4wNSAgICAgICAgICAgICAgICAgICMgc2V0IHRoZSB0cmlnZ2VyIHRvIGJlIDEvMiB3YXkgZG93biBzY3JlZW5cbiAgICAgICAgZGVidWc6ICAgICAgZmFsc2UgICAgICAgICAgICAgICAgICMgZGlzcGxheSB0aGUgdHJpZ2dlciBvZmZzZXQgZm9yIHRlc3RpbmdcbiAgICAgIC5vbkNvbnRhaW5lckVudGVyIGhhbmRsZUNvbnRhaW5lckVudGVyIFxuICAgICAgLm9uQ29udGFpbmVyRXhpdCAgaGFuZGxlQ29udGFpbmVyRXhpdCBcblxuICAgICMgRW5zdXJlIHRvIHNldHVwIG9uU3RlcEVudGVyIGhhbmRsZXIgb25seSBvbmNlXG4gICAgdW5sZXNzIHNjcm9sbGFtYUluaXRpYWxpemVkXG4gICAgICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IHRydWVcbiAgICAgIHNjcm9sbGVyLm9uU3RlcEVudGVyICBoYW5kbGVTdGVwRW50ZXIgXG4gICAgICBcbiAgICAjIHNldHVwIHJlc2l6ZSBldmVudFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCBoYW5kbGVSZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIEdyYXBoIFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cENvbnN0cmFjZXB0aXZlc1VzZUdyYXBoID0gLT5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgtY29udGFpbmVyJ1xuICAgICMgU2V0dXAgR3JhcGhcbiAgICBncmFwaFdpZHRoID0gMFxuICAgIGRhdGFJbmRleCA9IFswLi45OV1cbiAgICB1c2VHcmFwaCA9IGQzLnNlbGVjdCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpXG4gICAgdXNlR3JhcGguYXBwZW5kKCd1bCcpXG4gICAgICAuc2VsZWN0QWxsKCdsaScpXG4gICAgICAgIC5kYXRhKGRhdGFJbmRleClcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgnbGknKVxuICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgIC5hcHBlbmQoJ3VzZScpXG4gICAgICAgICAgICAuYXR0cigneGxpbms6aHJlZicsICcjaWNvbi13b21hbicpXG4gICAgICAgICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTkzIDQ1MCcpXG4gICAgIyBSZXNpemUgaGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIgPSAtPlxuICAgICAgaWYgZ3JhcGhXaWR0aCAhPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgZ3JhcGhXaWR0aCA9IHVzZUdyYXBoLm5vZGUoKS5vZmZzZXRXaWR0aFxuICAgICAgICBpdGVtc1dpZHRoID0gKGdyYXBoV2lkdGggLyAyMCkgLSAxMFxuICAgICAgICBpdGVtc0hlaWdodCA9IDIuMzMqaXRlbXNXaWR0aFxuICAgICAgICAjaXRlbXNXaWR0aCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiAnMTAlJyBlbHNlICc1JSdcbiAgICAgICAgI2l0ZW1zSGVpZ2h0ID0gaWYgZ3JhcGhXaWR0aCA8IDQ4MCB0aGVuIGdyYXBoV2lkdGggKiAwLjEgLyAwLjc1IGVsc2UgZ3JhcGhXaWR0aCAqIDAuMDUgLyAwLjc1XG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAgIC5zdHlsZSAnd2lkdGgnLCBpdGVtc1dpZHRoKydweCdcbiAgICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0KydweCdcbiAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdzdmcnKVxuICAgICAgICAgIC5hdHRyICd3aWR0aCcsIGl0ZW1zV2lkdGhcbiAgICAgICAgICAuYXR0ciAnaGVpZ2h0JywgaXRlbXNIZWlnaHRcbiAgICAgIHVzZUdyYXBoLnN0eWxlICdtYXJnaW4tdG9wJywgKCgkKCdib2R5JykuaGVpZ2h0KCktdXNlR3JhcGgubm9kZSgpLm9mZnNldEhlaWdodCkqLjUpKydweCdcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgcmVzaXplSGFuZGxlclxuICAgIHJlc2l6ZUhhbmRsZXIoKVxuXG5cbiAgIyBVbm1lZXQgTmVlZHMgdnMgR0RQIGdyYXBoXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFVubWV0TmVlZHNHZHBHcmFwaCA9IChkYXRhX3VubWV0bmVlZHMsIGNvdW50cmllcykgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ3VubWV0LW5lZWRzLWdkcC1jb250YWluZXItZ3JhcGgnXG5cbiAgICAjIHBhcnNlIGRhdGFcbiAgICBkYXRhID0gW11cbiAgICBkYXRhX3VubWV0bmVlZHMuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGNvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChlKSAtPiBlLmNvZGUgPT0gZC5jb2RlXG4gICAgICBpZiBjb3VudHJ5WzBdIGFuZCBjb3VudHJ5WzBdWydnbmknXVxuICAgICAgICAgIGRhdGEucHVzaFxuICAgICAgICAgICAgdmFsdWU6ICAgICAgK2RbJ2VzdGltYXRlZCddXG4gICAgICAgICAgICBpZDogICAgICAgICBjb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICAgIG5hbWU6ICAgICAgIGNvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgICAgcG9wdWxhdGlvbjogK2NvdW50cnlbMF1bJ3BvcHVsYXRpb24nXVxuICAgICAgICAgICAgZ25pOiAgICAgICAgK2NvdW50cnlbMF1bJ2duaSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdObyBHTkkgb3IgUG9wdWxhdGlvbiBkYXRhIGZvciB0aGlzIGNvdW50cnknLCBkLmNvZGUsIGNvdW50cnlbMF1cbiAgICAjIHNldHVwIGdyYXBoXG4gICAgdW5tZXRuZWVkc0dyYXBoID0gbmV3IHdpbmRvdy5CZWVzd2FybVNjYXR0ZXJwbG90R3JhcGggJ3VubWV0LW5lZWRzLWdkcC1ncmFwaCcsXG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICA1XG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB4OiAgICAgICdnbmknXG4gICAgICAgIHk6ICAgICAgJ3ZhbHVlJ1xuICAgICAgICBpZDogICAgICdpZCdcbiAgICAgICAgbGFiZWw6ICAnbmFtZSdcbiAgICAgICAgY29sb3I6ICAndmFsdWUnXG4gICAgICAgIHNpemU6ICAgJ3BvcHVsYXRpb24nXG4gICAgICBkb3RNaW5TaXplOiAxXG4gICAgICBkb3RNYXhTaXplOiAzMlxuICAgIHVubWV0bmVlZHNHcmFwaC5zZXREYXRhIGRhdGFcbiAgICAkKHdpbmRvdykucmVzaXplIHVubWV0bmVlZHNHcmFwaC5vblJlc2l6ZVxuXG5cbiAgIyBVc2UgJiBSZWFzb25zIG1hcHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNNYXBzID0gKGRhdGFfdXNlLCBjb3VudHJpZXMsIG1hcCkgLT5cblxuICAgICMgU2V0dXAgU2Nyb2xsYW1hXG4gICAgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG5cbiAgICAjIHBhcnNlIGRhdGEgdXNlXG4gICAgZGF0YV91c2UuZm9yRWFjaCAoZCkgLT5cbiAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUgPT0gZC5jb2RlXG4gICAgICAjIyNcbiAgICAgIGRbJ1JoeXRobSddICAgICAgICAgICAgICAgICAgICA9ICtkWydSaHl0aG0nXVxuICAgICAgZFsnV2l0aGRyYXdhbCddICAgICAgICAgICAgICAgID0gK2RbJ1dpdGhkcmF3YWwnXVxuICAgICAgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddID0gK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZFsnVHJhZGl0aW9uYWwgbWV0aG9kcyddID0gZFsnUmh5dGhtJ10rZFsnV2l0aGRyYXdhbCddK2RbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgY29uc29sZS5sb2cgZC5jb2RlLCBkWydSaHl0aG0nXSwgZFsnV2l0aGRyYXdhbCddLCBkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ10sIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgZGVsZXRlIGRbJ1JoeXRobSddXG4gICAgICBkZWxldGUgZFsnV2l0aGRyYXdhbCddXG4gICAgICBkZWxldGUgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddXG4gICAgICAjIyNcbiAgICAgIGQudmFsdWVzID0gW10gIyArZFsnQW55IG1ldGhvZCddXG4gICAgICBkLnZhbHVlID0gMCAgIyArZFsnTWFsZSBzdGVyaWxpemF0aW9uJ11cbiAgICAgICMgZ2V0IG1haW4gbWV0aG9kIGluIGVhY2ggY291bnRyeVxuICAgICAgbWV0aG9kc19rZXlzLmZvckVhY2ggKGtleSxpKSAtPlxuICAgICAgICBkLnZhbHVlcy5wdXNoXG4gICAgICAgICAgaWQ6IGlcbiAgICAgICAgICBuYW1lOiBtZXRob2RzX25hbWVzW2xhbmddW2ldXG4gICAgICAgICAgdmFsdWU6IGlmIGRba2V5XSAhPSAnJyB0aGVuICtkW2tleV0gZWxzZSBudWxsXG4gICAgICAgICNkZWxldGUgZFtrZXldXG4gICAgICAjIHNvcnQgZGVzY2VuZGluZyB2YWx1ZXNcbiAgICAgICNkLnZhbHVlcy5zb3J0IChhLGIpIC0+IGQzLmRlc2NlbmRpbmcoYS52YWx1ZSwgYi52YWx1ZSlcbiAgICAgICNkLnZhbHVlID0gZC52YWx1ZXNbMF0udmFsdWVcbiAgICAgIGlmIGl0ZW0gYW5kIGl0ZW1bMF1cbiAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgIGQuY29kZV9udW0gPSBpdGVtWzBdWydjb2RlX251bSddXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nICdubyBjb3VudHJ5JywgZC5jb2RlXG5cbiAgICAjIFNldCB1c2UgbWFwXG4gICAgdXNlTWFwID0gbmV3IHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZU1hcEdyYXBoICdtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgdG9wOiAyMFxuICAgICAgICBib3R0b206IDBcbiAgICAgIGxlZ2VuZDogdHJ1ZVxuICAgICAgbGFuZzogbGFuZ1xuICAgIHVzZU1hcC5zZXREYXRhIGRhdGFfdXNlLCBtYXBcbiAgICB1c2VNYXAub25SZXNpemUoKVxuXG4gICAgIyBzZXR1cCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZU1hcC5vblJlc2l6ZVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBVc2UgVHJlZW5hcFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwID0gKGRhdGFfdXNlKSAtPlxuICAgICMgc2V0IHNjcm9sbGFtYSBmb3IgdHJlZW1hcFxuICAgIHNldHVwU2Nyb2xsYW1hICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb250YWluZXInXG4gICAgIyBzZXR1cCB0cmVlbWFwXG4gICAgdXNlVHJlZW1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VUcmVlbWFwR3JhcGggJ3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJyxcbiAgICAgIGFzcGVjdFJhdGlvOiAwLjU2MjVcbiAgICAgIG1hcmdpbjpcbiAgICAgICAgbGVmdDogICAwXG4gICAgICAgIHJpZ3RoOiAgMFxuICAgICAgICB0b3A6ICAgIDBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBrZXk6XG4gICAgICAgIHZhbHVlOiAndmFsdWUnXG4gICAgICAgIGlkOiAnbmFtZSdcbiAgICAgIG1ldGhvZHNLZXlzOiBtZXRob2RzX2tleXNcbiAgICAgIG1ldGhvZHNOYW1lczogbWV0aG9kc19uYW1lc1tsYW5nXVxuICAgICMgc2V0IGRhdGFcbiAgICB1c2VUcmVlbWFwLnNldERhdGEgZGF0YV91c2UsIHVzZXJDb3VudHJ5LmNvZGUsIHVzZXJDb3VudHJ5Lm5hbWVcbiAgICAjIHNldCByZXNpemVcbiAgICAkKHdpbmRvdykucmVzaXplIHVzZVRyZWVtYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgUmVhc29ucyBPcHBvc2l0aW9uIEdyYXBoc1xuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzZXR1cFJlYXNvbnNPcHBvc2VkR3JhcGggPSAtPlxuICAgICRiYXJzID0gJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCAuYmFyJylcbiAgICAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkLWxlZ2VuZCBsaScpXG4gICAgICAubW91c2VvdmVyIC0+XG4gICAgICAgICRiYXJzXG4gICAgICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgLmZpbHRlcignLmJhci0nKyQodGhpcykuYXR0cignY2xhc3MnKSlcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgLm1vdXNlb3V0IC0+XG4gICAgICAgICRiYXJzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gIGQzLnF1ZXVlKClcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktcG9wdWxhdGlvbi0yMDE2LmNzdidcbiAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgIC5kZWZlciBkMy5qc29uLCAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJ1xuICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXAsIGxvY2F0aW9uKSAtPlxuXG4gICAgICBpZiBsb2NhdGlvblxuICAgICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgIGVsc2VcbiAgICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuICAgICAgI3Rlc3Qgb3RoZXIgY291bnRyaWVzXG4gICAgICAjdXNlckNvdW50cnkuY29kZSA9ICdSVVMnXG4gICAgICAjdXNlckNvdW50cnkubmFtZSA9ICdSdXNpYSdcblxuICAgICAgIyBhZGQgY291bnRyeSBJU08gMzE2Ni0xIGFscGhhLTMgY29kZSB0byBkYXRhX3JlYXNvbnNcbiAgICAgIGRhdGFfcmVhc29ucy5mb3JFYWNoIChkKSAtPlxuICAgICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlMiA9PSBkLmNvZGVcbiAgICAgICAgaWYgaXRlbSBhbmQgaXRlbVswXVxuICAgICAgICAgIGQuY29kZSA9IGl0ZW1bMF0uY29kZVxuICAgICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICAgIE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXNbbGFuZ10pLmZvckVhY2ggKHJlYXNvbikgLT5cbiAgICAgICAgICAgIGRbcmVhc29uXSA9IDEwMCpkW3JlYXNvbl1cbiAgICAgICAgICAgIGlmIGRbcmVhc29uXSA+IDEwMFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyAnQWxlcnQhIFZhbHVlIGdyZWF0ZXIgdGhhbiB6ZXJvLiAnICsgZC5jb3VudHJ5ICsgJywgJyArIHJlYXNvbiArICc6ICcgKyBkW3JlYXNvbl1cbiAgICAgICAgICBkZWxldGUgZC5jb3VudHJ5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLndhcm4gJ05vIGNvdW50cnkgZGF0YSBmb3IgJytkLmNvZGVcblxuICAgICAgaWYgJCgnI3RyZWVtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCBkYXRhX3VzZVxuXG4gICAgICBpZiAkKCcjbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScpLmxlbmd0aFxuICAgICAgICBzZXR1cENvbnN0cmFjZXB0aXZlc01hcHMgZGF0YV91c2UsIGNvdW50cmllcywgbWFwXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKS5sZW5ndGggPiAwXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlR3JhcGgoKVxuXG4gICAgICBpZiAkKCcjdW5tZXQtbmVlZHMtZ2RwLWdyYXBoJykubGVuZ3RoXG4gICAgICAgIHNldHVwVW5tZXROZWVkc0dkcEdyYXBoIGRhdGFfdW5tZXRuZWVkcywgY291bnRyaWVzXG5cbiAgICAgICNpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAjICBuZXcgQ29udHJhY2VwdGl2ZXNSZWFzb25zIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCByZWFzb25zX25hbWVzW2xhbmddXG5cbiAgICAgIGlmICQoJyNjYXJvdXNlbC1tYXJpZS1zdG9wZXMnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBTY3JvbGxhbWEgJ2Nhcm91c2VsLW1hcmllLXN0b3BlcydcblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZCcpLmxlbmd0aFxuICAgICAgICBzZXR1cFJlYXNvbnNPcHBvc2VkR3JhcGgoKVxuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXVxuXG4pIGpRdWVyeVxuIl19
