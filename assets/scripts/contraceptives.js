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
  (function($) {
    var baseurl, lang, methods_keys, methods_names, reasons_names, scrollamaInitialized, setupConstraceptivesMaps, setupConstraceptivesUseGraph, setupConstraceptivesUseTreemap, setupContraceptivesApp, setupReasonsOpposedGraph, setupScrollama, setupUnmetNeedsGdpGraph, unmetneedsGraph, useGraph, useMap, useTreemap, userCountry;
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
    setupContraceptivesApp = function(data_use, data_unmetneeds, data_reasons) {
      return $('#contraceptives-app .select-country').change(function() {
        var country_code, country_methods, data_reasons_country, data_unmetneeds_country, data_use_country, reasons;
        country_code = $(this).val();
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
        return setupContraceptivesApp(data_use, data_unmetneeds, data_reasons);
      }
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtZ3JhcGguY29mZmVlIiwibWFwLWdyYXBoLmNvZmZlZSIsImNvbnRyYWNlcHRpdmVzLXVzZS1tYXAtZ3JhcGguY29mZmVlIiwidHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJjb250cmFjZXB0aXZlcy11c2UtdHJlZW1hcC1ncmFwaC5jb2ZmZWUiLCJiZWVzd2FybS1zY2F0dGVycGxvdC1ncmFwaC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU0sTUFBTSxDQUFDO0FBRVgsUUFBQTs7SUFBQSxjQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssQ0FBTDtRQUNBLEtBQUEsRUFBTyxDQURQO1FBRUEsTUFBQSxFQUFRLEVBRlI7UUFHQSxJQUFBLEVBQU0sQ0FITjtPQURGO01BS0EsV0FBQSxFQUFhLE1BTGI7TUFNQSxLQUFBLEVBQU8sS0FOUDtNQU9BLE1BQUEsRUFBUSxLQVBSO01BUUEsV0FBQSxFQUFhLElBUmI7TUFTQSxHQUFBLEVBQ0U7UUFBQSxFQUFBLEVBQUksS0FBSjtRQUNBLENBQUEsRUFBSSxLQURKO1FBRUEsQ0FBQSxFQUFJLE9BRko7T0FWRjs7O0lBY0YsYUFBQSxHQUNFO01BQUEsS0FBQSxFQUFPLElBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLFdBQUEsRUFBYSxZQUZiO01BR0EsS0FBQSxFQUFNLE9BSE47OztJQVNXLG1CQUFDLEVBQUQsRUFBSyxPQUFMOzs7Ozs7TUFDWCxJQUFDLENBQUEsRUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLGNBQW5CLEVBQW1DLE9BQW5DO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBWSxDQUFBLENBQUUsR0FBQSxHQUFJLElBQUMsQ0FBQSxFQUFQO01BQ1osSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNB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QUYsQ0FBZ0MsQ0FBQyxNQUFwQztRQUNFLDhCQUFBLENBQStCLFFBQS9CLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUseUJBQUYsQ0FBNEIsQ0FBQyxNQUFoQztRQUNFLHdCQUFBLENBQXlCLFFBQXpCLEVBQW1DLFNBQW5DLEVBQThDLEdBQTlDLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxNQUEvQixHQUF3QyxDQUEzQztRQUNFLDRCQUFBLENBQUEsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSx3QkFBRixDQUEyQixDQUFDLE1BQS9CO1FBQ0UsdUJBQUEsQ0FBd0IsZUFBeEIsRUFBeUMsU0FBekMsRUFERjs7TUFNQSxJQUFHLENBQUEsQ0FBRSx3QkFBRixDQUEyQixDQUFDLE1BQS9CO1FBQ0UsY0FBQSxDQUFlLHVCQUFmLEVBREY7O01BR0EsSUFBRyxDQUFBLENBQUUsaUNBQUYsQ0FBb0MsQ0FBQyxNQUF4QztRQUNFLHdCQUFBLENBQUEsRUFERjs7TUFHQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2VBQ0Usc0JBQUEsQ0FBdUIsUUFBdkIsRUFBaUMsZUFBakMsRUFBa0QsWUFBbEQsRUFERjs7SUFyREssQ0FQVDtFQWhiRCxDQUFELENBQUEsQ0ErZUUsTUEvZUY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5CYXNlR3JhcGhcblxuICBvcHRpb25zRGVmYXVsdCA9IFxuICAgIG1hcmdpbjpcbiAgICAgIHRvcDogMFxuICAgICAgcmlnaHQ6IDBcbiAgICAgIGJvdHRvbTogMjBcbiAgICAgIGxlZnQ6IDBcbiAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgbGFiZWw6IGZhbHNlICAgICAgICAgICAjIHNob3cvaGlkZSBsYWJlbHNcbiAgICBsZWdlbmQ6IGZhbHNlICAgICAgICAgICMgc2hvdy9oaWRlIGxlZ2VuZFxuICAgIG1vdXNlRXZlbnRzOiB0cnVlICAgICAgIyBhZGQvcmVtb3ZlIG1vdXNlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGtleTpcbiAgICAgIGlkOiAna2V5J1xuICAgICAgeDogICdrZXknICAgICAgICAgICAgIyBuYW1lIGZvciB4IGNvbHVtblxuICAgICAgeTogICd2YWx1ZScgICAgICAgICAgIyBuYW1lIGZvciB5IGNvbHVtblxuXG4gIG1hcmtlckRlZmF1bHQgPVxuICAgIHZhbHVlOiBudWxsXG4gICAgbGFiZWw6ICcnXG4gICAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJ1xuICAgIGFsaWduOidyaWdodCdcbiBcblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgIEBpZCAgICAgICA9IGlkXG4gICAgQG9wdGlvbnMgID0gJC5leHRlbmQgdHJ1ZSwge30sIG9wdGlvbnNEZWZhdWx0LCBvcHRpb25zICAjIG1lcmdlIG9wdGlvbnNEZWZhdWx0ICYgb3B0aW9uc1xuICAgIEAkZWwgICAgICA9ICQoJyMnK0BpZClcbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHNldFNWRygpXG4gICAgQHNldFNjYWxlcygpXG4gICAgQG1hcmtlcnMgPSBbXVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBAc3ZnID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyICd3aWR0aCcsIEBjb250YWluZXJXaWR0aFxuICAgICAgLmF0dHIgJ2hlaWdodCcsIEBjb250YWluZXJIZWlnaHRcbiAgICBAY29udGFpbmVyID0gQHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIEBvcHRpb25zLm1hcmdpbi5sZWZ0ICsgJywnICsgQG9wdGlvbnMubWFyZ2luLnRvcCArICcpJ1xuXG4gIGxvYWREYXRhOiAodXJsKSAtPlxuICAgIGQzLmNzdiB1cmwsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgIEAkZWwudHJpZ2dlciAnZGF0YS1sb2FkZWQnXG4gICAgICBAc2V0RGF0YSBkYXRhXG4gICAgcmV0dXJuIEBcbiAgICBcbiAgc2V0RGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBkcmF3U2NhbGVzKClcbiAgICBpZiBAb3B0aW9ucy5sZWdlbmRcbiAgICAgIEBkcmF3TGVnZW5kKClcbiAgICBAZHJhd01hcmtlcnMoKVxuICAgIEBkcmF3R3JhcGgoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIHJldHVybiBkYXRhXG4gIFxuICAjIHRvIG92ZXJkcml2ZVxuICBzZXRHcmFwaDogLT5cbiAgICByZXR1cm4gQFxuXG5cbiAgIyBTY2FsZSBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgc2V0U2NhbGVzOiAtPlxuICAgIHJldHVybiBAXG5cbiAgZHJhd1NjYWxlczogLT5cbiAgICAjIHNldCBzY2FsZXMgZG9tYWluc1xuICAgIEB4LmRvbWFpbiBAZ2V0U2NhbGVYRG9tYWluKClcbiAgICBAeS5kb21haW4gQGdldFNjYWxlWURvbWFpbigpXG4gICAgIyBzZXQgeCBheGlzXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLmFwcGVuZCgnZycpXG4gICAgICAgIC5hdHRyICdjbGFzcycsICd4IGF4aXMnXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uIFxuICAgICAgICAuY2FsbCBAeEF4aXNcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVhSYW5nZTogLT5cbiAgICByZXR1cm4gWzAsIEB3aWR0aF1cblxuICAjIHRvIG92ZXJkcml2ZVxuICBnZXRTY2FsZVlSYW5nZTogLT5cbiAgICByZXR1cm4gW0BoZWlnaHQsIDBdXG5cbiAgIyB0byBvdmVyZHJpdmVcbiAgZ2V0U2NhbGVYRG9tYWluOiAtPlxuICAgIHJldHVybiBbXVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGdldFNjYWxlWURvbWFpbjogLT5cbiAgICByZXR1cm4gW11cblxuICAjIHRvIG92ZXJkcml2ZVxuICBkcmF3TGVnZW5kOiAtPlxuICAgIHJldHVybiBAXG5cblxuICAjIE1hcmtlciBtZXRob2RzXG4gICMgLS0tLS0tLS0tLS0tLVxuXG4gIGFkZE1hcmtlcjogKG1hcmtlcikgLT5cbiAgICBAbWFya2Vycy5wdXNoICQuZXh0ZW5kIHt9LCBtYXJrZXJEZWZhdWx0LCBtYXJrZXJcbiAgICByZXR1cm4gQFxuXG4gIGRyYXdNYXJrZXJzOiAtPiBcbiAgICAjIERyYXcgbWFya2VyIGxpbmVcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLm1hcmtlcicpXG4gICAgICAuZGF0YShAbWFya2VycylcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ21hcmtlcidcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxpbmVcbiAgICAjIERyYXcgbWFya2VyIGxhYmVsXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5tYXJrZXItbGFiZWwnKVxuICAgICAgLmRhdGEoQG1hcmtlcnMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdtYXJrZXItbGFiZWwnXG4gICAgICAuYXR0ciAndGV4dC1hbmNob3InLCAoZCkgLT4gaWYgZC5vcmllbnRhdGlvbiA9PSAndmVydGljYWwnIHRoZW4gJ21pZGRsZScgZWxzZSBpZiBkLmFsaWduID09ICdyaWdodCcgdGhlbiAnZW5kJyBlbHNlICdzdGFydCdcbiAgICAgIC5hdHRyICdkeScsIChkKSAtPiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuICctMC4yNWVtJyBlbHNlIDBcbiAgICAgIC50ZXh0IChkKSAtPiBkLmxhYmVsXG4gICAgICAuY2FsbCBAc2V0dXBNYXJrZXJMYWJlbFxuXG4gIHNldHVwTWFya2VyTGluZTogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudFxuICAgICAgLmF0dHIgJ3gxJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gMCBlbHNlIEB4KGQudmFsdWUpXG4gICAgICAuYXR0ciAneTEnLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIDBcbiAgICAgIC5hdHRyICd4MicsIChkKSA9PiBpZiBkLm9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyB0aGVuIEB3aWR0aCBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3kyJywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gQHkoZC52YWx1ZSkgZWxzZSBAaGVpZ2h0IFxuXG4gIHNldHVwTWFya2VyTGFiZWw6IChlbGVtZW50KSA9PlxuICAgIGVsZW1lbnRcbiAgICAgIC5hdHRyICd4JywgKGQpID0+IGlmIGQub3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnIHRoZW4gKGlmIGQuYWxpZ24gPT0gJ3JpZ2h0JyB0aGVuIEB3aWR0aCBlbHNlIDAgKSBlbHNlIEB4KGQudmFsdWUpIFxuICAgICAgLmF0dHIgJ3knLCAoZCkgPT4gaWYgZC5vcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgdGhlbiBAeShkLnZhbHVlKSBlbHNlIEBoZWlnaHQgICBcblxuXG4gICMgUmVzaXplIG1ldGhvZHNcbiAgIyAtLS0tLS0tLS0tLS1cblxuICBvblJlc2l6ZTogPT5cbiAgICBAZ2V0RGltZW5zaW9ucygpXG4gICAgQHVwZGF0ZUdyYXBoRGltZW5zaW9ucygpXG4gICAgcmV0dXJuIEBcblxuICBnZXREaW1lbnNpb25zOiAtPlxuICAgIGlmIEAkZWxcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgQHdpZHRoICAgICAgICAgICA9IEBjb250YWluZXJXaWR0aCAtIEBvcHRpb25zLm1hcmdpbi5sZWZ0IC0gQG9wdGlvbnMubWFyZ2luLnJpZ2h0XG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICAjIHRvIG92ZXJkcml2ZVxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgIyB1cGRhdGUgc3ZnIGRpbWVuc2lvblxuICAgIGlmIEBzdmdcbiAgICAgIEBzdmdcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgIEBjb250YWluZXJXaWR0aFxuICAgICAgICAuYXR0ciAnaGVpZ2h0JywgQGNvbnRhaW5lckhlaWdodFxuICAgICMgdXBkYXRlIHNjYWxlcyBkaW1lbnNpb25zXG4gICAgaWYgQHhcbiAgICAgIEB4LnJhbmdlIEBnZXRTY2FsZVhSYW5nZSgpXG4gICAgaWYgQHlcbiAgICAgIEB5LnJhbmdlIEBnZXRTY2FsZVlSYW5nZSgpXG4gICAgIyB1cGRhdGUgYXhpcyBkaW1lbnNpb25zXG4gICAgaWYgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcycpXG4gICAgICAgIC5jYWxsIEBzZXRYQXhpc1Bvc2l0aW9uXG4gICAgICAgIC5jYWxsIEB4QXhpc1xuICAgIGlmIEB5QXhpc1xuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy55LmF4aXMnKVxuICAgICAgICAuY2FsbCBAc2V0WUF4aXNQb3NpdGlvblxuICAgICAgICAuY2FsbCBAeUF4aXNcbiAgICAjIHVwZGF0ZSBtYXJrZXJzXG4gICAgQGNvbnRhaW5lci5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmNhbGwgQHNldHVwTWFya2VyTGluZVxuICAgIEBjb250YWluZXIuc2VsZWN0KCcubWFya2VyLWxhYmVsJylcbiAgICAgIC5jYWxsIEBzZXR1cE1hcmtlckxhYmVsXG4gICAgcmV0dXJuIEBcblxuICBzZXRYQXhpc1Bvc2l0aW9uOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJytAaGVpZ2h0KycpJ1xuXG4gIHNldFlBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJytAd2lkdGgrJywwKSdcblxuXG4gICMgQXV4aWxpYXIgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXREYXRhWDogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueF1cblxuICBnZXREYXRhWTogLT5cbiAgICByZXR1cm4gZFtAb3B0aW9ucy5rZXkueV0iLCJjbGFzcyB3aW5kb3cuTWFwR3JhcGggZXh0ZW5kcyB3aW5kb3cuQmFzZUdyYXBoXG5cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnTWFwIEdyYXBoJywgaWQsIG9wdGlvbnNcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIEBmb3JtYXRGbG9hdCAgID0gZDMuZm9ybWF0KCcsLjFmJylcbiAgICBAZm9ybWF0SW50ZWdlciA9IGQzLmZvcm1hdCgnLGQnKVxuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNWRzogLT5cbiAgICBzdXBlcigpXG4gICAgQCR0b29sdGlwID0gQCRlbC5maW5kICcudG9vbHRpcCdcblxuICBzZXRTY2FsZXM6IC0+XG4gICAgIyBzZXQgY29sb3Igc2NhbGVcbiAgICBAY29sb3IgPSBkMy5zY2FsZVNlcXVlbnRpYWwgZDMuaW50ZXJwb2xhdGVPcmFuZ2VzXG4gICAgcmV0dXJuIEBcblxuICBsb2FkRGF0YTogKHVybF9kYXRhLCB1cmxfbWFwKSAtPlxuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsIHVybF9kYXRhXG4gICAgICAuZGVmZXIgZDMuanNvbiwgdXJsX21hcFxuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YSwgbWFwKSAgPT5cbiAgICAgICAgQCRlbC50cmlnZ2VyICdkYXRhLWxvYWRlZCdcbiAgICAgICAgQHNldERhdGEgZGF0YSwgbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXREYXRhOiAoZGF0YSwgbWFwKSAtPlxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoZGF0YSlcbiAgICBAc2V0Q29sb3JEb21haW4oKVxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGRyYXdMZWdlbmQoKVxuICAgIEBkcmF3R3JhcGggbWFwXG4gICAgcmV0dXJuIEBcblxuICBzZXRDb2xvckRvbWFpbjogLT5cbiAgICBAY29sb3IuZG9tYWluIFswLCBkMy5tYXgoQGRhdGEsIChkKSAtPiBkLnZhbHVlKV1cbiAgICByZXR1cm4gQFxuXG4gIGRyYXdMZWdlbmQ6IC0+XG4gICAgbGVnZW5JdGVtV2lkdGggPSAzMFxuICAgIGxlZ2VuZERhdGEgPSBAZ2V0TGVnZW5kRGF0YSgpXG4gICAgQGxlZ2VuZCA9IEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyICdjbGFzcycsICdsZWdlbmQnXG4gICAgICAuY2FsbCBAc2V0TGVnZW5kUG9zaXRpb25cbiAgICAjIGRyYXcgbGVnZW5kIHJlY3RzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3JlY3QnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpLShsZWdlbmREYXRhLmxlbmd0aC8yKSlcbiAgICAgICAgLmF0dHIgJ3dpZHRoJywgbGVnZW5JdGVtV2lkdGhcbiAgICAgICAgLmF0dHIgJ2hlaWdodCcsIDhcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCAoZCkgPT4gQGNvbG9yIGRcbiAgICBsZWdlbmREYXRhLnNoaWZ0KClcbiAgICAjIGRyYXcgbGVnZW5kIHRleHRzXG4gICAgQGxlZ2VuZC5zZWxlY3RBbGwoJ3RleHQnKVxuICAgICAgLmRhdGEgbGVnZW5kRGF0YVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLmF0dHIgJ3gnLCAoZCxpKSAtPiBNYXRoLnJvdW5kIGxlZ2VuSXRlbVdpZHRoKihpKzAuNS0obGVnZW5kRGF0YS5sZW5ndGgvMikpXG4gICAgICAgIC5hdHRyICd5JywgMjBcbiAgICAgICAgLmF0dHIgJ3RleHQtYW5jaG9yJywgJ3N0YXJ0J1xuICAgICAgICAudGV4dCBAZ2V0TGVnZW5kRm9ybWF0XG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgICMgZ2V0IGNvdW50cmllcyBkYXRhXG4gICAgQGNvdW50cmllcyA9IHRvcG9qc29uLmZlYXR1cmUobWFwLCBtYXAub2JqZWN0cy5jb3VudHJpZXMpO1xuICAgIEBjb3VudHJpZXMuZmVhdHVyZXMgPSBAY291bnRyaWVzLmZlYXR1cmVzLmZpbHRlciAoZCkgLT4gZC5pZCAhPSAnMDEwJyAgIyByZW1vdmUgYW50YXJjdGljYVxuICAgICMgc2V0IHByb2plY3Rpb25cbiAgICBAcHJvamVjdGlvbiA9IGQzLmdlb0thdnJheXNraXk3KClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgICMgc2V0IHBhdGhcbiAgICBAcGF0aCA9IGQzLmdlb1BhdGgoKVxuICAgICAgLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICAjIGFkZCBjb3VudHJpZXMgcGF0aHNcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgIC5kYXRhKEBjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmVudGVyKCkuYXBwZW5kKCdwYXRoJylcbiAgICAgIC5hdHRyICdpZCcsIChkKSAtPiAnY291bnRyeS0nK2QuaWRcbiAgICAgIC5hdHRyICdjbGFzcycsIChkKSAtPiAnY291bnRyeSdcbiAgICAgIC5hdHRyICdmaWxsJywgQHNldENvdW50cnlDb2xvclxuICAgICAgLmF0dHIgJ3N0cm9rZS13aWR0aCcsIDFcbiAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAuYXR0ciAnZCcsIEBwYXRoXG4gICAgIyBhZGQgbW91c2UgZXZlbnRzIGxpc3RlbmVycyBpZiB0aGVyZSdzIGEgdG9vbHRpcFxuICAgIGlmIEAkdG9vbHRpcFxuICAgICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgICAgLm9uICdtb3VzZW92ZXInLCBAb25Nb3VzZU92ZXJcbiAgICAgICAgLm9uICdtb3VzZW1vdmUnLCBAb25Nb3VzZU1vdmVcbiAgICAgICAgLm9uICdtb3VzZW91dCcsIEBvbk1vdXNlT3V0XG4gICAgIyB0cmlnZ2VyIGRyYXctY29tcGxldGUgZXZlbnRcbiAgICBAJGVsLnRyaWdnZXIgJ2RyYXctY29tcGxldGUnXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaDogKGRhdGEpIC0+XG4gICAgQGRhdGEgPSBAZGF0YVBhcnNlcihkYXRhKVxuICAgIEBzZXRDb2xvckRvbWFpbigpXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5jb3VudHJ5JylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmF0dHIgJ2ZpbGwnLCBAc2V0Q291bnRyeUNvbG9yXG4gICAgICAgIC5hdHRyICdzdHJva2UnLCBAc2V0Q291bnRyeUNvbG9yXG5cbiAgdXBkYXRlR3JhcGhEaW1lbnNpb25zOiAtPlxuICAgIHN1cGVyKClcbiAgICBAcHJvamVjdGlvblNldFNpemUoKVxuICAgIEBwYXRoLnByb2plY3Rpb24gQHByb2plY3Rpb25cbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmNvdW50cnknKVxuICAgICAgLmF0dHIgJ2QnLCBAcGF0aFxuICAgIGlmIEBvcHRpb25zLmxlZ2VuZFxuICAgICAgQGxlZ2VuZC5jYWxsIEBzZXRMZWdlbmRQb3NpdGlvblxuICAgIHJldHVybiBAXG5cbiAgcHJvamVjdGlvblNldFNpemU6IC0+XG4gICAgQHByb2plY3Rpb25cbiAgICAgIC5maXRTaXplIFtAd2lkdGgsIEBoZWlnaHRdLCBAY291bnRyaWVzICAjIGZpdCBwcm9qZWN0aW9uIHNpemVcbiAgICAgIC5zY2FsZSAgICBAcHJvamVjdGlvbi5zY2FsZSgpICogMS4xICAgICAjIEFkanVzdCBwcm9qZWN0aW9uIHNpemUgJiB0cmFuc2xhdGlvblxuICAgICAgLnRyYW5zbGF0ZSBbQHdpZHRoKjAuNDgsIEBoZWlnaHQqMC42XVxuXG4gIHNldENvdW50cnlDb2xvcjogKGQpID0+XG4gICAgdmFsdWUgPSBAZGF0YS5maWx0ZXIgKGUpIC0+IGUuY29kZV9udW0gPT0gZC5pZFxuICAgIHJldHVybiBpZiB2YWx1ZVswXSB0aGVuIEBjb2xvcih2YWx1ZVswXS52YWx1ZSkgZWxzZSAnI2VlZSdcblxuICBzZXRMZWdlbmRQb3NpdGlvbjogKGVsZW1lbnQpID0+XG4gICAgZWxlbWVudC5hdHRyICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrTWF0aC5yb3VuZChAd2lkdGgqMC41KSsnLCcrKC1Ab3B0aW9ucy5tYXJnaW4udG9wKSsnKSdcblxuICBnZXRMZWdlbmREYXRhOiA9PlxuICAgIHJldHVybiBkMy5yYW5nZSAwLCBAY29sb3IuZG9tYWluKClbMV1cblxuICBnZXRMZWdlbmRGb3JtYXQ6IChkKSA9PlxuICAgIHJldHVybiBkXG5cbiAgb25Nb3VzZU92ZXI6IChkKSA9PlxuICAgIHZhbHVlID0gQGRhdGEuZmlsdGVyIChlKSAtPiBlLmNvZGVfbnVtID09IGQuaWRcbiAgICBpZiB2YWx1ZS5sZW5ndGggPiAwXG4gICAgICBwb3NpdGlvbiA9IGQzLm1vdXNlKGQzLmV2ZW50LnRhcmdldClcbiAgICAgICMgU2V0IHRvb2x0aXAgY29udGVudFxuICAgICAgQHNldFRvb2x0aXBEYXRhIHZhbHVlWzBdXG4gICAgICAjIFNldCB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBvZmZzZXQgPSAkKGQzLmV2ZW50LnRhcmdldCkub2Zmc2V0KClcbiAgICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICAgJ2xlZnQnOiAgICBwb3NpdGlvblswXSAtIChAJHRvb2x0aXAud2lkdGgoKSAqIDAuNSlcbiAgICAgICAgJ3RvcCc6ICAgICBwb3NpdGlvblsxXSAtIChAJHRvb2x0aXAuaGVpZ2h0KCkgKiAwLjUpXG4gICAgICAgICdvcGFjaXR5JzogJzEnXG5cbiAgb25Nb3VzZU1vdmU6IChkKSA9PlxuICAgIHBvc2l0aW9uID0gZDMubW91c2UoZDMuZXZlbnQudGFyZ2V0KVxuICAgIEAkdG9vbHRpcC5jc3NcbiAgICAgICdsZWZ0JzogICAgcG9zaXRpb25bMF0gLSAoQCR0b29sdGlwLndpZHRoKCkgKiAwLjUpXG4gICAgICAndG9wJzogICAgIHBvc2l0aW9uWzFdIC0gKEAkdG9vbHRpcC5oZWlnaHQoKSAqIDAuNSlcblxuICBvbk1vdXNlT3V0OiAoZCkgPT5cbiAgICBAJHRvb2x0aXAuY3NzICdvcGFjaXR5JywgJzAnXG5cbiAgc2V0VG9vbHRpcERhdGE6IChkKSA9PlxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC50aXRsZSdcbiAgICAgIC5odG1sIGQubmFtZVxuICAgIEAkdG9vbHRpcFxuICAgICAgLmZpbmQgJy50b29sdGlwLWlubmVyIC52YWx1ZSdcbiAgICAgIC5odG1sIEBmb3JtYXRGbG9hdChkLnZhbHVlKVxuICAgIGlmIGQuY2FzZXNcbiAgICAgIEAkdG9vbHRpcFxuICAgICAgICAuZmluZCAnLnRvb2x0aXAtaW5uZXIgLmNhc2VzJ1xuICAgICAgICAuaHRtbCBAZm9ybWF0SW50ZWdlcihkLmNhc2VzKSAiLCJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5NYXBHcmFwaFxuXG4gIGN1cnJlbnRTdGF0ZTogMFxuXG4gIHN0YXRlczogW1xuICAgIHtcbiAgICAgIGlkOiAnRmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdlc3RlcmlsaXphY2nDs24gZmVtZW5pbmEnXG4gICAgICAgIGVuOiAnZmVtYWxlIHN0ZXJpbGl6YXRpb24nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC43XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQ4XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMjAsIDMwXVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdJbmRpYSdcbiAgICAgICAgICAgIGVuOiAnSW5kaWEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjdcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuNDY1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFsyMCwgLTVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ1JlcMO6YmxpY2EgRG9taW5pY2FuYSdcbiAgICAgICAgICAgIGVuOiAnRG9taW5pY2FuIFJlcHVibGljJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ01hbGUgc3RlcmlsaXphdGlvbidcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ2VzdGVyaWxpemFjacOzbiBtYXNjdWxpbmEnXG4gICAgICAgIGVuOiAnbWFsZSBzdGVyaWxpemF0aW9uJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuMjY1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjI5N1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMzAsIDI1XVxuICAgICAgICAgIGxhYmVsOlxuICAgICAgICAgICAgZXM6ICdDYW5hZMOhJ1xuICAgICAgICAgICAgZW46ICdDYW5hZGEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg1XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjM0XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NvcmVhIGRlbCBOb3J0ZSdcbiAgICAgICAgICAgIGVuOiAnTm9ydGggS29yZWEnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnSVVEJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnRElVJ1xuICAgICAgICBlbjogJ0lVRCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjg0XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjQxXG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRXaWR0aDogODBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0NoaW5hJ1xuICAgICAgICAgICAgZW46ICdDaGluYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdQaWxsJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAncMOtbGRvcmEnXG4gICAgICAgIGVuOiAncGlsbCdcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjQ2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC40MTZcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0zNSwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQXJnZWxpYSdcbiAgICAgICAgICAgIGVuOiAnQWxnZXJpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdNYWxlIGNvbmRvbSdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ3ByZXNlcnZhdGl2byBtYXNjdWxpbm8nXG4gICAgICAgIGVuOiAnbWFsZSBjb25kb20nXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC41NDJcbiAgICAgICAgICBjeV9mYWN0b3I6IDAuMzQ1XG4gICAgICAgICAgcjogMFxuICAgICAgICAgIHRleHRPZmZzZXQ6IFstMTIsIDBdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0dyZWNpYSdcbiAgICAgICAgICAgIGVuOiAnR3JlZWNlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjU2NFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC43M1xuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIC0xMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQm90c3VhbmEnXG4gICAgICAgICAgICBlbjogJ0JvdHN3YW5hJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ0luamVjdGFibGUnXG4gICAgICB0ZXh0OiBcbiAgICAgICAgZXM6ICdpbnllY3RhYmxlJ1xuICAgICAgICBlbjogJ2luamVjdGFibGUnXG4gICAgICBsYWJlbHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGN4X2ZhY3RvcjogMC42MlxuICAgICAgICAgIGN5X2ZhY3RvcjogMC41NlxuICAgICAgICAgIHI6IDBcbiAgICAgICAgICB0ZXh0T2Zmc2V0OiBbMTUsIDVdXG4gICAgICAgICAgbGFiZWw6XG4gICAgICAgICAgICBlczogJ0V0aW9ww61hJ1xuICAgICAgICAgICAgZW46ICdFdGhpb3BpYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ1xuICAgICAgdGV4dDogXG4gICAgICAgIGVzOiAnbcOpdG9kb3MgdHJhZGljaW9uYWxlcydcbiAgICAgICAgZW46ICd0cmFkaXRpb25hbCBtZXRob2RzJ1xuICAgICAgbGFiZWxzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjeF9mYWN0b3I6IDAuNTM2XG4gICAgICAgICAgY3lfZmFjdG9yOiAwLjMxOFxuICAgICAgICAgIHI6IDE2XG4gICAgICAgICAgdGV4dE9mZnNldDogWy0yNiwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQmFsY2FuZXMnXG4gICAgICAgICAgICBlbjogJ0JhbGthbnMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCdcbiAgICAgIHRleHQ6IFxuICAgICAgICBlczogJ23DqXRvZG9zIHRyYWRpY2lvbmFsZXMnXG4gICAgICAgIGVuOiAndHJhZGl0aW9uYWwgbWV0aG9kcydcbiAgICAgIGxhYmVsczogW1xuICAgICAgICB7XG4gICAgICAgICAgY3hfZmFjdG9yOiAwLjUzNFxuICAgICAgICAgIGN5X2ZhY3RvcjogMC4zMzJcbiAgICAgICAgICByOiAwXG4gICAgICAgICAgdGV4dE9mZnNldDogWy0xMCwgMF1cbiAgICAgICAgICBsYWJlbDpcbiAgICAgICAgICAgIGVzOiAnQWxiYW5pYSdcbiAgICAgICAgICAgIGVuOiAnQWxiYW5pYSdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gIGdldExlZ2VuZERhdGE6IC0+XG4gICAgcmV0dXJuIFswLDIwLDQwLDYwLDgwXVxuXG4gIGdldExlZ2VuZEZvcm1hdDogKGQpID0+XG4gICAgcmV0dXJuIGQrJyUnXG5cbiAgIyBvdmVycmlkZSBnZXREaW1lbnNpb25zXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgb2Zmc2V0ID0gMTAwXG4gICAgaWYgQCRlbFxuICAgICAgYm9keUhlaWdodCA9ICQoJ2JvZHknKS5oZWlnaHQoKS1vZmZzZXRcbiAgICAgIEBjb250YWluZXJXaWR0aCAgPSBAJGVsLndpZHRoKClcbiAgICAgIEBjb250YWluZXJIZWlnaHQgPSBAY29udGFpbmVyV2lkdGggKiBAb3B0aW9ucy5hc3BlY3RSYXRpb1xuICAgICAgIyBhdm9pZCBncmFwaCBoZWlnaHQgb3ZlcmZsb3cgYnJvd3NlciBoZWlnaHQgXG4gICAgICBpZiBAY29udGFpbmVySGVpZ2h0ID4gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVySGVpZ2h0ID0gYm9keUhlaWdodFxuICAgICAgICBAY29udGFpbmVyV2lkdGggPSBAY29udGFpbmVySGVpZ2h0IC8gQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgICAgI0AkZWwuY3NzICd0b3AnLCAwXG4gICAgICAjIHZlcnRpY2FsIGNlbnRlciBncmFwaFxuICAgICAgI2Vsc2VcbiAgICAgICMgIEAkZWwuY3NzICd0b3AnLCAoYm9keUhlaWdodC1AY29udGFpbmVySGVpZ2h0KSAvIDJcbiAgICAgIEB3aWR0aCAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG5cbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRBbm5vdGF0aW9ucygpXG5cblxuXG4gICMgb3ZlcnJpZGUgY29sb3IgZG9tYWluXG4gIHNldENvbG9yRG9tYWluOiAtPlxuICAgIEBjb2xvci5kb21haW4gWzAsIDgwXVxuICAgIHJldHVybiBAXG5cbiAgZHJhd0dyYXBoOiAobWFwKSAtPlxuICAgIHN1cGVyKG1hcClcbiAgICBAcmluZ05vdGUgPSBkMy5yaW5nTm90ZSgpXG4gICAgcmV0dXJuIEBcblxuICBzZXRNYXBTdGF0ZTogKHN0YXRlKSAtPlxuICAgIGlmIHN0YXRlICE9IEBjdXJyZW50U3RhdGVcbiAgICAgICNjb25zb2xlLmxvZyAnc2V0IHN0YXRlICcrc3RhdGVcbiAgICAgIEBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgQGN1cnJlbnRNZXRob2QgPSBAc3RhdGVzW0BjdXJyZW50U3RhdGUtMV1cbiAgICAgICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlLW1ldGhvZCcpLmh0bWwgQGN1cnJlbnRNZXRob2QudGV4dFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT4gZC52YWx1ZSA9ICtkW0BjdXJyZW50TWV0aG9kLmlkXVxuICAgICAgQHVwZGF0ZUdyYXBoIEBkYXRhXG4gICAgICBAc2V0QW5ub3RhdGlvbnMoKVxuXG4gIHNldEFubm90YXRpb25zOiAtPlxuICAgIGlmIEBjdXJyZW50TWV0aG9kXG4gICAgICBAY3VycmVudE1ldGhvZC5sYWJlbHMuZm9yRWFjaCAoZCkgPT4gXG4gICAgICAgIGQuY3ggPSBkLmN4X2ZhY3RvcipAd2lkdGhcbiAgICAgICAgZC5jeSA9IGQuY3lfZmFjdG9yKkBoZWlnaHRcbiAgICAgICAgZC50ZXh0ID0gZC5sYWJlbFtAb3B0aW9ucy5sYW5nXVxuICAgICAgQGNvbnRhaW5lci5jYWxsIEByaW5nTm90ZSwgQGN1cnJlbnRNZXRob2QubGFiZWxzXG4iLCJjbGFzcyB3aW5kb3cuVHJlZW1hcEdyYXBoIGV4dGVuZHMgd2luZG93LkJhc2VHcmFwaFxuXG5cbiAgIyBDb25zdHJ1Y3RvclxuICAjIC0tLS0tLS0tLS0tXG5cbiAgY29uc3RydWN0b3I6IChpZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLm1pblNpemUgPSBvcHRpb25zLm1pblNpemUgfHwgNjBcbiAgICBvcHRpb25zLm5vZGVzUGFkZGluZyA9IG9wdGlvbnMubm9kZXNQYWRkaW5nIHx8IDhcbiAgICBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiA9IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIHx8IDYwMFxuICAgIG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCA9IG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludCB8fCA2MjBcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgb3ZlcnJpZGUgZHJhdyBzY2FsZXNcbiAgZHJhd1NjYWxlczogLT5cbiAgICByZXR1cm4gQFxuXG4gICMgb3ZlcnJpZGUgc2V0U1ZHIHRvIHVzZSBhIGRpdiBjb250YWluZXIgKG5vZGVzLWNvbnRhaW5lcikgaW5zdGVhZCBvZiBhIHN2ZyBlbGVtZW50XG4gIHNldFNWRzogLT5cbiAgICBAY29udGFpbmVyID0gZDMuc2VsZWN0KCcjJytAaWQpLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyICdjbGFzcycsICdub2Rlcy1jb250YWluZXInXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIEBoZWlnaHQrJ3B4J1xuXG4gIGRyYXdHcmFwaDogLT5cbiAgICBAdHJlZW1hcCA9IGQzLnRyZWVtYXAoKVxuICAgICAgLnNpemUgW0B3aWR0aCwgQGhlaWdodF1cbiAgICAgIC5wYWRkaW5nIDBcbiAgICAgIC5yb3VuZCB0cnVlXG5cbiAgICBpZiBAd2lkdGggPD0gQG9wdGlvbnMubW9iaWxlQnJlYWtwb2ludFxuICAgICAgQHRyZWVtYXAudGlsZSBkMy50cmVlbWFwU2xpY2VcblxuICAgIEBzdHJhdGlmeSA9IGQzLnN0cmF0aWZ5KCkucGFyZW50SWQgKGQpIC0+IGQucGFyZW50XG5cbiAgICBAdXBkYXRlR3JhcGgoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIHVwZGF0ZUdyYXBoOiAtPlxuXG4gICAgIyB1cGRhdGUgdHJlbWFwIFxuICAgIEB0cmVlbWFwUm9vdCA9IEBzdHJhdGlmeShAZGF0YSlcbiAgICAgIC5zdW0gKGQpID0+IGRbQG9wdGlvbnMua2V5LnZhbHVlXVxuICAgICAgLnNvcnQgKGEsIGIpIC0+IGIudmFsdWUgLSBhLnZhbHVlXG4gICAgQHRyZWVtYXAgQHRyZWVtYXBSb290XG5cbiAgICAjIHVwZGF0ZSBub2Rlc1xuICAgIG5vZGVzID0gQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5kYXRhIEB0cmVlbWFwUm9vdC5sZWF2ZXMoKVxuICAgIFxuICAgIG5vZGVzLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUnXG4gICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgIC5hdHRyICdjbGFzcycsICdub2RlLWxhYmVsJ1xuICAgICAgICAuYXBwZW5kICdkaXYnXG4gICAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ25vZGUtbGFiZWwtY29udGVudCdcbiAgICAgICAgICAuYXBwZW5kICdwJ1xuXG4gICAgIyBzZXR1cCBub2Rlc1xuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuY2FsbCBAc2V0Tm9kZVxuICAgICAgLmNhbGwgQHNldE5vZGVEaW1lbnNpb25zXG5cbiAgICAjIGFkZCBsYWJlbCBvbmx5IGluIG5vZGVzIHdpdGggc2l6ZSBncmVhdGVyIHRoZW4gb3B0aW9ucy5taW5TaXplXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5jYWxsICAgQHNldE5vZGVMYWJlbFxuICAgICAgLmZpbHRlciBAaXNOb2RlTGFiZWxWaXNpYmxlICAgICMgZmlsdGVyIG5vZGVzIHdpdGggbGFiZWxzIHZpc2libGVzIChiYXNlZCBvbiBvcHRpb25zLm1pblNpemUpXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAndmlzaWJsZSdcblxuICAgIG5vZGVzLmV4aXQoKS5yZW1vdmUoKVxuXG4gICAgcmV0dXJuIEBcblxuXG4gIGdldERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoXG4gICAgICBAaGVpZ2h0ICAgICAgICAgID0gQGNvbnRhaW5lckhlaWdodCAtIEBvcHRpb25zLm1hcmdpbi50b3AgLSBAb3B0aW9ucy5tYXJnaW4uYm90dG9tXG4gICAgcmV0dXJuIEBcblxuICB1cGRhdGVHcmFwaERpbWVuc2lvbnM6IC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQGNvbnRhaW5lci5zdHlsZSAnaGVpZ2h0JywgQGhlaWdodCsncHgnXG5cbiAgICAjIFVwZGF0ZSB0cmVtYXAgc2l6ZVxuICAgIGlmIEB3aWR0aCA8PSBAb3B0aW9ucy5tb2JpbGVCcmVha3BvaW50XG4gICAgICBAdHJlZW1hcC50aWxlIGQzLnRyZWVtYXBTbGljZVxuICAgIGVsc2VcbiAgICAgIEB0cmVlbWFwLnRpbGUgZDMudHJlZW1hcFNxdWFyaWZ5XG4gICAgQHRyZWVtYXAuc2l6ZSBbQHdpZHRoLCBAaGVpZ2h0XVxuICAgIEB0cmVlbWFwIEB0cmVlbWFwUm9vdFxuXG4gICAgIyBVcGRhdGUgbm9kZXMgZGF0YVxuICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAuZGF0YSBAdHJlZW1hcFJvb3QubGVhdmVzKClcbiAgICAgIC5jYWxsIEBzZXROb2RlRGltZW5zaW9uc1xuICAgICAgXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5ub2RlLWxhYmVsJylcbiAgICAgIC5zdHlsZSAndmlzaWJpbGl0eScsICdoaWRkZW4nICAjIEhpZGUgbGFiZWxzIGJ5IGRlZmF1bHQgKHNldE5vZGVMYWJlbCB3aWxsIHNob3cgaWYgbm9kZSBpcyBiaWdnZXIgZW5vdWdodClcbiAgICAgIC5maWx0ZXIgQGlzTm9kZUxhYmVsVmlzaWJsZSAgICAjIGZpbHRlciBub2RlcyB3aXRoIGxhYmVscyB2aXNpYmxlcyAoYmFzZWQgb24gb3B0aW9ucy5taW5TaXplKVxuICAgICAgLnN0eWxlICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnXG5cbiAgICByZXR1cm4gQFxuXG5cbiAgc2V0Tm9kZTogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdjbGFzcycsICAgICAgIEBnZXROb2RlQ2xhc3NcbiAgICAgIC5zdHlsZSAncGFkZGluZycsICAgIChkKSA9PiBpZiAoZC54MS1kLngwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcgJiYgZC55MS1kLnkwID4gMipAb3B0aW9ucy5ub2Rlc1BhZGRpbmcpIHRoZW4gQG9wdGlvbnMubm9kZXNQYWRkaW5nKydweCcgZWxzZSAwXG4gICAgICAuc3R5bGUgJ3Zpc2liaWxpdHknLCAoZCkgLT4gaWYgKGQueDEtZC54MCA9PSAwKSB8fCAoZC55MS1kLnkwID09IDApIHRoZW4gJ2hpZGRlbicgZWxzZSAnJ1xuXG4gIHNldE5vZGVEaW1lbnNpb25zOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvblxuICAgICAgLnN0eWxlICdsZWZ0JywgICAoZCkgLT4gZC54MCArICdweCdcbiAgICAgIC5zdHlsZSAndG9wJywgICAgKGQpIC0+IGQueTAgKyAncHgnXG4gICAgICAuc3R5bGUgJ3dpZHRoJywgIChkKSAtPiBkLngxLWQueDAgKyAncHgnXG4gICAgICAuc3R5bGUgJ2hlaWdodCcsIChkKSAtPiBkLnkxLWQueTAgKyAncHgnXG5cbiAgc2V0Tm9kZUxhYmVsOiAoc2VsZWN0aW9uKSA9PlxuICAgIHNlbGVjdGlvbi5zZWxlY3QoJ3AnKVxuICAgICAgLmF0dHIgJ2NsYXNzJywgKGQpIC0+IHJldHVybiBpZiBkLnZhbHVlID4gMjUgdGhlbiAnc2l6ZS1sJyBlbHNlIGlmIGQudmFsdWUgPCAxMCB0aGVuICdzaXplLXMnIGVsc2UgJydcbiAgICAgIC5odG1sIChkKSA9PiBkLmRhdGFbQG9wdGlvbnMua2V5LmlkXVxuXG4gIGlzTm9kZUxhYmVsVmlzaWJsZTogKGQpID0+XG4gICAgcmV0dXJuIGQueDEtZC54MCA+IEBvcHRpb25zLm1pblNpemUgJiYgZC55MS1kLnkwID4gQG9wdGlvbnMubWluU2l6ZVxuXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlJ1xuICAgICIsImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc1VzZVRyZWVtYXBHcmFwaCBleHRlbmRzIHdpbmRvdy5UcmVlbWFwR3JhcGhcblxuICAjIG92ZXJkcml2ZSBkYXRhIFBhcnNlclxuICBkYXRhUGFyc2VyOiAoZGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpIC0+XG4gICAgICMgc2V0IHBhcnNlZERhdGEgYXJyYXlcbiAgICBwYXJzZWREYXRhID0gW3tpZDogJ3InfV0gIyBhZGQgdHJlZW1hcCByb290XG4gICAgIyBUT0RPISEhIEdldCBjdXJyZW50IGNvdW50cnkgJiBhZGQgc2VsZWN0IGluIG9yZGVyIHRvIGNoYW5nZSBpdFxuICAgIGRhdGFfY291bnRyeSA9IGRhdGEuZmlsdGVyIChkKSAtPiBkLmNvZGUgPT0gY291bnRyeV9jb2RlXG4gICAgY29uc29sZS5sb2cgZGF0YV9jb3VudHJ5WzBdXG4gICAgaWYgZGF0YV9jb3VudHJ5WzBdXG4gICAgICAjIHNldCBtZXRob2RzIG9iamVjdFxuICAgICAgbWV0aG9kcyA9IHt9XG4gICAgICBAb3B0aW9ucy5tZXRob2RzS2V5cy5mb3JFYWNoIChrZXksaSkgPT5cbiAgICAgICAgaWYgZGF0YV9jb3VudHJ5WzBdW2tleV1cbiAgICAgICAgICBtZXRob2RzW2tleV0gPVxuICAgICAgICAgICAgaWQ6IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgJy0nKS5yZXBsYWNlKCcpJywgJycpLnJlcGxhY2UoJygnLCAnJylcbiAgICAgICAgICAgIG5hbWU6IEBvcHRpb25zLm1ldGhvZHNOYW1lc1tpXVxuICAgICAgICAgICAgdmFsdWU6ICtkYXRhX2NvdW50cnlbMF1ba2V5XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJUaGVyZSdzIG5vIGRhdGEgZm9yIFwiICsga2V5XG4gICAgICAjIGZpbHRlciBtZXRob2RzIHdpdGggdmFsdWUgPCA1JSAmIGFkZCB0byBPdGhlciBtb2Rlcm4gbWV0aG9kc1xuICAgICAgZm9yIGtleSxtZXRob2Qgb2YgbWV0aG9kc1xuICAgICAgICBpZiBrZXkgIT0gJ090aGVyIG1vZGVybiBtZXRob2RzJyBhbmQga2V5ICE9ICdBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJyBhbmQgbWV0aG9kLnZhbHVlIDwgNVxuICAgICAgICAgIG1ldGhvZHNbJ090aGVyIG1vZGVybiBtZXRob2RzJ10udmFsdWUgKz0gbWV0aG9kLnZhbHVlXG4gICAgICAgICAgZGVsZXRlIG1ldGhvZHNba2V5XVxuICAgICBcbiAgICAgIGZvciBrZXksbWV0aG9kIG9mIG1ldGhvZHNcbiAgICAgICAgcGFyc2VkRGF0YS5wdXNoXG4gICAgICAgICAgaWQ6IG1ldGhvZC5pZFxuICAgICAgICAgIHJhd19uYW1lOiBtZXRob2QubmFtZVxuICAgICAgICAgIG5hbWU6ICc8c3Ryb25nPicgKyBtZXRob2QubmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1ldGhvZC5uYW1lLnNsaWNlKDEpICsgJzwvc3Ryb25nPjxici8+JyArIE1hdGgucm91bmQobWV0aG9kLnZhbHVlKSArICclJ1xuICAgICAgICAgIHZhbHVlOiBtZXRob2QudmFsdWVcbiAgICAgICAgICBwYXJlbnQ6ICdyJ1xuICAgICAgcGFyc2VkRGF0YVNvcnRlZCA9IHBhcnNlZERhdGEuc29ydCAoYSxiKSAtPiBpZiBhLnZhbHVlIGFuZCBiLnZhbHVlIHRoZW4gYi52YWx1ZS1hLnZhbHVlIGVsc2UgMVxuICAgICAgIyBzZXQgY2FwdGlvbiBjb3VudHJ5IG5hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJ5JykuaHRtbCBjb3VudHJ5X25hbWVcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1hbnktbWV0aG9kJykuaHRtbCBNYXRoLnJvdW5kKGRhdGFfY291bnRyeVswXVsnQW55IG1vZGVybiBtZXRob2QnXSlcbiAgICAgICQoJyN0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZS1tZXRob2QnKS5odG1sIHBhcnNlZERhdGFTb3J0ZWRbMF0ucmF3X25hbWVcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLndhcm4gJ05vIGRhdGEgY291bnRyeSBmb3IgJytjb3VudHJ5X2NvZGVcbiAgICAgICMgVE9ETyEhISBXaGF0IHdlIGRvIGlmIHRoZXJlJ3Mgbm8gZGF0YSBmb3IgdXNlcidzIGNvdW50cnlcbiAgICByZXR1cm4gcGFyc2VkRGF0YVxuXG4gICMgb3ZlcmRyaXZlIHNldCBkYXRhXG4gIHNldERhdGE6IChkYXRhLCBjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAb3JpZ2luYWxEYXRhID0gZGF0YVxuICAgIEBkYXRhID0gQGRhdGFQYXJzZXIoQG9yaWdpbmFsRGF0YSwgY291bnRyeV9jb2RlLCBjb3VudHJ5X25hbWUpXG4gICAgQGRyYXdHcmFwaCgpXG4gICAgI0BzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIEAkZWwudHJpZ2dlciAnZHJhdy1jb21wbGV0ZSdcbiAgICByZXR1cm4gQFxuXG4gIHVwZGF0ZURhdGE6IChjb3VudHJ5X2NvZGUsIGNvdW50cnlfbmFtZSkgLT5cbiAgICBAZGF0YSA9IEBkYXRhUGFyc2VyKEBvcmlnaW5hbERhdGEsIGNvdW50cnlfY29kZSwgY291bnRyeV9uYW1lKVxuICAgIEB1cGRhdGVHcmFwaCgpXG4gICAgcmV0dXJuIEBcblxuICAjIG92ZXJkcml2ZSBub2RlIGNsYXNzXG4gIGdldE5vZGVDbGFzczogKGQpIC0+XG4gICAgcmV0dXJuICdub2RlIG5vZGUtJytkLmlkXG5cbiAgIyMjIG92ZXJkcml2ZSByZXNpemVcbiAgb25SZXNpemU6ID0+XG4gICAgc3VwZXIoKVxuICAgIEBzZXRDb250YWluZXJPZmZzZXQoKVxuICAgIHJldHVybiBAXG5cbiAgc2V0Q29udGFpbmVyT2Zmc2V0OiAtPlxuICAgIEAkZWwuY3NzKCd0b3AnLCAoJCh3aW5kb3cpLmhlaWdodCgpLUAkZWwuaGVpZ2h0KCkpKjAuNSlcbiAgIyMjIiwiY2xhc3Mgd2luZG93LkJlZXN3YXJtU2NhdHRlcnBsb3RHcmFwaCBleHRlbmRzIHdpbmRvdy5CYXNlR3JhcGhcblxuXG4gIGluY29tZUxldmVsczogWzEwMDUsIDM5NTUsIDEyMjM1XVxuXG4gIGxhYmVsczogW1xuICAgICdBR08nLFxuICAgICdCR0QnLFxuICAgICdCUkEnLFxuICAgICdDSE4nLFxuICAgICdERVUnLFxuICAgICdFU1AnLFxuICAgICdFVEgnLFxuICAgICdJTkQnLFxuICAgICdJRE4nLFxuICAgICdKUE4nLFxuICAgICdOR0EnLFxuICAgICdQQUsnLFxuICAgICdQSEwnLFxuICAgICdSVVMnLFxuICAgICdTQVUnLFxuICAgICdUVVInLFxuICAgICdVR0EnLFxuICAgICdVU0EnLFxuICAgICdWTk0nXG4gIF1cblxuICAjIENvbnN0cnVjdG9yXG4gICMgLS0tLS0tLS0tLS1cblxuICBjb25zdHJ1Y3RvcjogKGlkLCBvcHRpb25zKSAtPlxuICAgICNjb25zb2xlLmxvZyAnQmVlc3dhcm1HcmFwaCcsIGlkXG4gICAgb3B0aW9ucy5kb3RTaXplID0gb3B0aW9ucy5kb3RTaXplIHx8IDVcbiAgICBvcHRpb25zLmRvdE1pblNpemUgPSBvcHRpb25zLmRvdE1pblNpemUgfHzCoDJcbiAgICBvcHRpb25zLmRvdE1heFNpemUgPSBvcHRpb25zLmRvdE1heFNpemUgfHwgMTVcbiAgICBvcHRpb25zLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgMCAjIG1vZGUgMDogYmVlc3dhcm0sIG1vZGUgMTogc2NhdHRlcnBsb3RcbiAgICBzdXBlciBpZCwgb3B0aW9uc1xuICAgIHJldHVybiBAXG5cblxuICAjIE1haW4gbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gICMgdG8gb3ZlcmRyaXZlXG4gIGRhdGFQYXJzZXI6IChkYXRhKSAtPlxuICAgIGlmIEBvcHRpb25zLmtleS5zaXplXG4gICAgICByZXR1cm4gZGF0YS5zb3J0IChhLGIpID0+IGJbQG9wdGlvbnMua2V5LnNpemVdLWFbQG9wdGlvbnMua2V5LnNpemVdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGRhdGFcblxuICBkcmF3R3JhcGg6IC0+XG5cbiAgICBAc2V0U2l6ZSgpXG5cbiAgICAjIHNldCAmIHJ1biBzaW11bGF0aW9uXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcblxuICAgICMgZHJhdyBkb3RzXG4gICAgQGNvbnRhaW5lci5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmRhdGEgQGRhdGFcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0ciAnY2xhc3MnLCAnZG90J1xuICAgICAgLmF0dHIgJ2lkJywgKGQpID0+ICdkb3QtJytkW0BvcHRpb25zLmtleS5pZF1cbiAgICAgIC5jYWxsIEBzZXREb3RcbiAgICAgICMub24gJ21vdXNlb3ZlcicsIChkKSA9PiBjb25zb2xlLmxvZyBkXG5cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5kYXRhIEBkYXRhLmZpbHRlciAoZCkgPT4gQGxhYmVscy5pbmRleE9mKGRbQG9wdGlvbnMua2V5LmlkXSkgIT0gLTFcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyICdjbGFzcycsIChkKSA9PiByZXR1cm4gaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxMDAwMDAwMDAwIHRoZW4gJ2RvdC1sYWJlbCBzaXplLWwnIGVsc2UgaWYgZFtAb3B0aW9ucy5rZXkuc2l6ZV0gPiAxODAwMDAwMDAgdGhlbiAnZG90LWxhYmVsIHNpemUtbScgZWxzZSAnZG90LWxhYmVsJ1xuICAgICAgICAjLmF0dHIgJ2R4JywgJzAuNzVlbSdcbiAgICAgICAgLmF0dHIgJ2R5JywgJzAuMjVlbSdcbiAgICAgICAgLnRleHQgKGQpID0+IGRbQG9wdGlvbnMua2V5LmxhYmVsXVxuICAgICAgICAuY2FsbCBAc2V0RG90TGFiZWxQb3NpdGlvblxuXG5cbiAgc2V0U2ltdWxhdGlvbjogLT5cbiAgICAjIHNldHVwIHNpbXVsYXRpb25cbiAgICBmb3JjZVkgPSBkMy5mb3JjZVkgKGQpID0+IEB5KGRbQG9wdGlvbnMua2V5LnldKVxuICAgIGZvcmNlWS5zdHJlbmd0aCgxKVxuICAgIEBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKEBkYXRhKVxuICAgICAgLmZvcmNlICd4JywgZm9yY2VZXG4gICAgICAuZm9yY2UgJ3knLCBkMy5mb3JjZVgoQHdpZHRoKi41KVxuICAgICAgLmZvcmNlICdjb2xsaWRlJywgZDMuZm9yY2VDb2xsaWRlKChkKSA9PiByZXR1cm4gaWYgQHNpemUgdGhlbiBkLnJhZGl1cysxIGVsc2UgQG9wdGlvbnMuZG90U2l6ZSsxKVxuICAgICAgLnN0b3AoKVxuXG4gIHJ1blNpbXVsYXRpb246IC0+XG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgMzUwXG4gICAgICBAc2ltdWxhdGlvbi50aWNrKClcbiAgICAgICsraVxuXG4gIHNldERvdDogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICdyJywgIChkKSA9PiBpZiBAc2l6ZSB0aGVuIGQucmFkaXVzIGVsc2UgQG9wdGlvbnMuZG90U2l6ZVxuICAgICAgLmF0dHIgJ2ZpbGwnLCBAZ2V0RG90RmlsbFxuICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG5cbiAgc2V0RG90UG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uXG4gICAgICAuYXR0ciAnY3gnLCBAZ2V0UG9zaXRpb25YXG4gICAgICAuYXR0ciAnY3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgc2V0RG90TGFiZWxQb3NpdGlvbjogKHNlbGVjdGlvbikgPT5cbiAgICBzZWxlY3Rpb25cbiAgICAgIC5hdHRyICd4JywgQGdldFBvc2l0aW9uWFxuICAgICAgLmF0dHIgJ3knLCBAZ2V0UG9zaXRpb25ZXG5cbiAgZ2V0UG9zaXRpb25YOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueCBlbHNlIE1hdGgucm91bmQgQHgoZFtAb3B0aW9ucy5rZXkueF0pXG5cbiAgZ2V0UG9zaXRpb25ZOiAoZCkgPT4gXG4gICAgcmV0dXJuIGlmIEBvcHRpb25zLm1vZGUgPT0gMCB0aGVuIGQueSBlbHNlIE1hdGgucm91bmQgQHkoZFtAb3B0aW9ucy5rZXkueV0pXG5cbiAgZ2V0RG90RmlsbDogKGQpID0+XG4gICAgcmV0dXJuIEBjb2xvciBkW0BvcHRpb25zLmtleS5jb2xvcl0gI2lmIEBvcHRpb25zLmtleS5jb2xvciBhbmQgQG9wdGlvbnMubW9kZSA9PSAxIHRoZW4gQGNvbG9yIGRbQG9wdGlvbnMua2V5LmNvbG9yXSBlbHNlICcjZTI3MjNiJ1xuXG4gIHNldE1vZGU6IChtb2RlKSAtPlxuICAgIEBvcHRpb25zLm1vZGUgPSBtb2RlXG4gICAgaWYgQG9wdGlvbnMubW9kZSA8IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgZmFsc2VcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgICAgLmNhbGwgQHNldERvdFBvc2l0aW9uXG4gICAgICBpZiBAeExlZ2VuZFxuICAgICAgICBAeExlZ2VuZC5zdHlsZSAnb3BhY2l0eScsIEBvcHRpb25zLm1vZGVcbiAgICAgICMgc2hvdy9oaWRlIGRvdCBsYWJlbHNcbiAgICAgIGlmIEBvcHRpb25zLmtleS5sYWJlbFxuICAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgICAgLnN0eWxlICdvcGFjaXR5JywgMFxuICAgICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kZWxheSA1MDBcbiAgICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCAxXG4gICAgICAjIHNob3cvaGlkZSB4IGF4aXMgbGluZXNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcueC5heGlzIC50aWNrIGxpbmUnKVxuICAgICAgICAuc3R5bGUgJ29wYWNpdHknLCBAb3B0aW9ucy5tb2RlXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDJcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdIDwgQGluY29tZUxldmVsc1syXSBvciBkW0BvcHRpb25zLmtleS55XSA+IDE1XG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDNcbiAgICAgIEBjb250YWluZXIuc2VsZWN0QWxsKCcuZG90LCAuZG90LWxhYmVsJylcbiAgICAgICAgLmNsYXNzZWQgJ2luYWN0aXZlJywgKGQpID0+IGRbQG9wdGlvbnMua2V5LnhdID4gQGluY29tZUxldmVsc1sxXSBvciBkW0BvcHRpb25zLmtleS55XSA8IDMwXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDRcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIChkKSA9PiBkLmlkICE9ICdTQVUnIGFuZCBkLmlkICE9ICdKUE4nXG4gICAgZWxzZSBpZiBAb3B0aW9ucy5tb2RlID09IDVcbiAgICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCwgLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jbGFzc2VkICdpbmFjdGl2ZScsIGZhbHNlXG5cbiAgc2V0U2l6ZTogLT5cbiAgICBpZiBAc2l6ZVxuICAgICAgQGRhdGEuZm9yRWFjaCAoZCkgPT5cbiAgICAgICAgZC5yYWRpdXMgPSBAc2l6ZSBkW0BvcHRpb25zLmtleS5zaXplXVxuXG4gIHVwZGF0ZUdyYXBoRGltZW5zaW9uczogLT5cbiAgICAjIHVwZGF0ZSBheGlzIHNpemVcbiAgICBAeEF4aXMudGlja1NpemUgQGhlaWdodFxuICAgIEB5QXhpcy50aWNrU2l6ZSBAd2lkdGhcbiAgICBzdXBlcigpXG4gICAgQHNldFNpbXVsYXRpb24oKVxuICAgIEBydW5TaW11bGF0aW9uKClcbiAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdCcpXG4gICAgICAuY2FsbCBAc2V0RG90UG9zaXRpb25cbiAgICAjIGRyYXcgbGFiZWxzXG4gICAgaWYgQG9wdGlvbnMua2V5LmxhYmVsXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLmRvdC1sYWJlbCcpXG4gICAgICAgIC5jYWxsIEBzZXREb3RMYWJlbFBvc2l0aW9uXG4gICAgcmV0dXJuIEBcblxuXG4gICMgU2NhbGUgbWV0aG9kc1xuICAjIC0tLS0tLS0tLS0tLVxuXG4gIHNldFNjYWxlczogLT5cbiAgICAjIHNldCB4IHNjYWxlXG4gICAgI0B4ID0gZDMuc2NhbGVQb3coKVxuICAgICMgIC5leHBvbmVudCgwLjEyNSlcbiAgICAjICAucmFuZ2UgQGdldFNjYWxlWFJhbmdlKClcbiAgICBAeCA9IGQzLnNjYWxlTG9nKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVYUmFuZ2UoKVxuICAgICMgc2V0IHkgc2NhbGVcbiAgICBAeSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgIC5yYW5nZSBAZ2V0U2NhbGVZUmFuZ2UoKVxuICAgICMgc2V0IHNpemUgc2NhbGUgaWYgb3B0aW9ucy5rZXkuc2l6ZSBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LnNpemVcbiAgICAgICMgRXF1aXZhbGVudCB0byBkMy5zY2FsZVNxcnQoKVxuICAgICAgI8KgaHR0cHM6Ly9ibC5vY2tzLm9yZy9kM2luZGVwdGgvNzc1Y2Y0MzFlNjRiNjcxODQ4MWMwNmZjNDVkYzM0ZjlcbiAgICAgIEBzaXplID0gZDMuc2NhbGVQb3coKVxuICAgICAgICAuZXhwb25lbnQgMC41XG4gICAgICAgIC5yYW5nZSBAZ2V0U2l6ZVJhbmdlKClcbiAgICAjIHNldCBjb2xvciBzY2FsZSBpZiBvcHRpb25zLmtleS5jb2xvciBpcyBkZWZpbmVkXG4gICAgaWYgQG9wdGlvbnMua2V5LmNvbG9yXG4gICAgICBAY29sb3IgPSBkMy5zY2FsZVRocmVzaG9sZCgpXG4gICAgICAgIC5yYW5nZSBkMy5zY2hlbWVPcmFuZ2VzWzVdICMucmV2ZXJzZSgpXG4gICAgIyBzZXR1cCBheGlzXG4gICAgQHhBeGlzID0gZDMuYXhpc0JvdHRvbShAeClcbiAgICAgIC50aWNrU2l6ZSBAaGVpZ2h0XG4gICAgICAudGlja1ZhbHVlcyBAaW5jb21lTGV2ZWxzXG4gICAgQHlBeGlzID0gZDMuYXhpc0xlZnQoQHkpXG4gICAgICAudGlja1NpemUgQHdpZHRoXG4gICAgICAudGlja1ZhbHVlcyBbMCwgMTAsIDIwLCAzMCwgNDBdXG4gICAgICAudGlja0Zvcm1hdCAoZCkgLT4gZCsnJSdcbiAgICByZXR1cm4gQFxuXG4gIHNldFhBeGlzUG9zaXRpb246IChzZWxlY3Rpb24pID0+XG4gICAgc2VsZWN0aW9uLmF0dHIgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoLTEsNSknXG5cbiAgZ2V0U2NhbGVYRG9tYWluOiA9PlxuICAgIHJldHVybiBbMjUwLCA4NTAwMF1cblxuICBnZXRTY2FsZVlEb21haW46ID0+XG4gICAgcmV0dXJuIFswLCBkMy5tYXgoQGRhdGEsIChkKSA9PiBkW0BvcHRpb25zLmtleS55XSldXG5cbiAgZ2V0U2l6ZVJhbmdlOiA9PlxuICAgIHJldHVybiBbQG9wdGlvbnMuZG90TWluU2l6ZSwgQG9wdGlvbnMuZG90TWF4U2l6ZV1cblxuICBnZXRTaXplRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgZDMubWF4KEBkYXRhLCAoZCkgPT4gZFtAb3B0aW9ucy5rZXkuc2l6ZV0pXVxuXG4gIGdldENvbG9yRG9tYWluOiA9PlxuICAgIHJldHVybiBbMCwgMTAsIDIwLCAzMF1cblxuICBkcmF3U2NhbGVzOiAtPlxuICAgICMgc2V0IHNjYWxlcyBkb21haW5zXG4gICAgQHguZG9tYWluIEBnZXRTY2FsZVhEb21haW4oKVxuICAgIEB5LmRvbWFpbiBAZ2V0U2NhbGVZRG9tYWluKClcbiAgICBpZiBAc2l6ZVxuICAgICAgQHNpemUuZG9tYWluIEBnZXRTaXplRG9tYWluKClcbiAgICBpZiBAY29sb3JcbiAgICAgIEBjb2xvci5kb21haW4gQGdldENvbG9yRG9tYWluKClcbiAgICAjIHNldCB4IGF4aXNcbiAgICBpZiBAeEF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3ggYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFhBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHhBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayBsaW5lJylcbiAgICAgICAgLmF0dHIgJ3kxJywgQHkoNDApLTRcbiAgICAjIHNldCB5IGF4aXNcbiAgICBpZiBAeUF4aXNcbiAgICAgIEBjb250YWluZXIuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIgJ2NsYXNzJywgJ3kgYXhpcydcbiAgICAgICAgLmNhbGwgQHNldFlBeGlzUG9zaXRpb25cbiAgICAgICAgLmNhbGwgQHlBeGlzXG4gICAgICBAY29udGFpbmVyLnNlbGVjdEFsbCgnLnkuYXhpcyAudGljayB0ZXh0JylcbiAgICAgICAgLmF0dHIgJ2R4JywgM1xuICAgICAgICAuYXR0ciAnZHknLCAtNFxuICAgICMgc2V0IHggbGVuZ2VkXG4gICAgaW5jb21lcyA9IEB4QXhpcy50aWNrVmFsdWVzKClcbiAgICBpbmNvbWVzLnVuc2hpZnQgMFxuICAgIGluY29tZXNNYXggPSBAeCBAZ2V0U2NhbGVYRG9tYWluKClbMV1cbiAgICBpbmNvbWVzID0gaW5jb21lcy5tYXAgKGQpID0+IGlmIGQgPiAwIHRoZW4gMTAwKkB4KGQpL2luY29tZXNNYXggZWxzZSAwXG4gICAgaW5jb21lcy5wdXNoIDEwMFxuICAgIEB4TGVnZW5kID0gZDMuc2VsZWN0KGQzLnNlbGVjdCgnIycrQGlkKS5ub2RlKCkucGFyZW50Tm9kZSkuc2VsZWN0KCcueC1sZWdlbmQnKVxuICAgIEB4TGVnZW5kLnNlbGVjdEFsbCgnbGknKS5zdHlsZSAnd2lkdGgnLCAoZCxpKSAtPiAoaW5jb21lc1tpKzFdLWluY29tZXNbaV0pKyclJ1xuICAgIHJldHVybiBAXG5cbiAgZ2V0RGltZW5zaW9uczogLT5cbiAgICBpZiBAJGVsXG4gICAgICBAY29udGFpbmVyV2lkdGggID0gQCRlbC53aWR0aCgpXG4gICAgICBAY29udGFpbmVySGVpZ2h0ID0gQGNvbnRhaW5lcldpZHRoICogQG9wdGlvbnMuYXNwZWN0UmF0aW9cbiAgICAgIEB3aWR0aCAgICAgICAgICAgPSBAY29udGFpbmVyV2lkdGggLSBAb3B0aW9ucy5tYXJnaW4ubGVmdCAtIEBvcHRpb25zLm1hcmdpbi5yaWdodFxuICAgICAgQGhlaWdodCAgICAgICAgICA9IEBjb250YWluZXJIZWlnaHQgLSBAb3B0aW9ucy5tYXJnaW4udG9wIC0gQG9wdGlvbnMubWFyZ2luLmJvdHRvbVxuICAgIHJldHVybiBAXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG5cbiAgdXNlVHJlZW1hcCA9IG51bGxcbiAgdXNlTWFwID0gbnVsbFxuICB1c2VHcmFwaCA9IG51bGxcbiAgdW5tZXRuZWVkc0dyYXBoID0gbnVsbCBcblxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCIgICAgICAgIyBvcHBvc2VkXG4gICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIiAgIyBvcHBvc2VkXG4gICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIiAgICAgICAgICAgIyBvcHBvc2VkXG4gICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCIgICAgIyBvcHBvc2VkXG4gICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiICAgICAgICAgICAgICAgICAgICAgICMgc2FsdWRcbiAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIiAjIHNhbHVkXG4gICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpJzIHByb2Nlc3Nlc1wiICAgICAgIyBzYWx1ZFxuICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICAjIFNjcm9sbGFtYSBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwU2Nyb2xsYW1hID0gKGlkKSAtPlxuICAgIGNvbnRhaW5lciA9IGQzLnNlbGVjdCgnIycraWQpXG4gICAgZ3JhcGhpYyAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC1ncmFwaGljJylcbiAgICBjaGFydCAgICAgPSBncmFwaGljLnNlbGVjdCgnLmdyYXBoLWNvbnRhaW5lcicpXG4gICAgdGV4dCAgICAgID0gY29udGFpbmVyLnNlbGVjdCgnLnNjcm9sbC10ZXh0JylcbiAgICBzdGVwcyAgICAgPSB0ZXh0LnNlbGVjdEFsbCgnLnN0ZXAnKVxuXG4gICAgIyBpbml0aWFsaXplIHNjcm9sbGFtYVxuICAgIHNjcm9sbGVyID0gc2Nyb2xsYW1hKClcblxuICAgICMgcmVzaXplIGZ1bmN0aW9uIHRvIHNldCBkaW1lbnNpb25zIG9uIGxvYWQgYW5kIG9uIHBhZ2UgcmVzaXplXG4gICAgaGFuZGxlUmVzaXplID0gLT5cbiAgICAgIHdpZHRoID0gZ3JhcGhpYy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggI01hdGguZmxvb3Igd2luZG93LmlubmVyV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3Igd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAjIDEuIHVwZGF0ZSBoZWlnaHQgb2Ygc3RlcCBlbGVtZW50cyBmb3IgYnJlYXRoaW5nIHJvb20gYmV0d2VlbiBzdGVwc1xuICAgICAgc3RlcHMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMi4gdXBkYXRlIGhlaWdodCBvZiBncmFwaGljIGVsZW1lbnRcbiAgICAgIGdyYXBoaWMuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCArICdweCdcbiAgICAgICMgMy4gdXBkYXRlIHdpZHRoIG9mIGNoYXJ0XG4gICAgICBjaGFydFxuICAgICAgICAuc3R5bGUgJ3dpZHRoJywgd2lkdGgrJ3B4J1xuICAgICAgICAuc3R5bGUgJ2hlaWdodCcsIGhlaWdodCsncHgnXG4gICAgICAjIDQuIHRlbGwgc2Nyb2xsYW1hIHRvIHVwZGF0ZSBuZXcgZWxlbWVudCBkaW1lbnNpb25zXG4gICAgICBzY3JvbGxlci5yZXNpemUoKVxuXG4gICAgaGFuZGxlQ29udGFpbmVyRW50ZXIgPSAoZSkgLT5cbiAgICAgICMgc3RpY2t5IHRoZSBncmFwaGljXG4gICAgICBncmFwaGljXG4gICAgICAgIC5jbGFzc2VkICdpcy1maXhlZCcsIHRydWVcbiAgICAgICAgLmNsYXNzZWQgJ2lzLWJvdHRvbScsIGZhbHNlXG5cbiAgICBoYW5kbGVDb250YWluZXJFeGl0ID0gKGUpIC0+XG4gICAgICAjIHVuLXN0aWNreSB0aGUgZ3JhcGhpYywgYW5kIHBpbiB0byB0b3AvYm90dG9tIG9mIGNvbnRhaW5lclxuICAgICAgZ3JhcGhpY1xuICAgICAgICAuY2xhc3NlZCAnaXMtZml4ZWQnLCBmYWxzZVxuICAgICAgICAuY2xhc3NlZCAnaXMtYm90dG9tJywgZS5kaXJlY3Rpb24gPT0gJ2Rvd24nXG5cbiAgICBoYW5kbGVTdGVwRW50ZXIgPSAoZSkgLT5cbiAgICAgICPCoGNvbnNvbGUubG9nIGVcbiAgICAgICRzdGVwID0gJChlLmVsZW1lbnQpXG4gICAgICBpbnN0YW5jZSA9ICRzdGVwLmRhdGEoJ2luc3RhbmNlJylcbiAgICAgIHN0ZXAgPSAkc3RlcC5kYXRhKCdzdGVwJylcbiAgICAgIGlmIGluc3RhbmNlID09IDAgXG4gICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDAnLCBzdGVwXG4gICAgICAgIGlmIHVzZVRyZWVtYXBcbiAgICAgICAgICBpZiBzdGVwID09IDFcbiAgICAgICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSAnd29ybGQnLCAnTXVuZG8nXG4gICAgICAgICAgZWxzZSBpZiBzdGVwID09IDAgYW5kIGUuZGlyZWN0aW9uID09ICd1cCdcbiAgICAgICAgICAgIHVzZVRyZWVtYXAudXBkYXRlRGF0YSB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDEgXG4gICAgICAgIGlmIHVzZU1hcFxuICAgICAgICAgICNjb25zb2xlLmxvZyAnc2Nyb2xsYW1hIDEnLCBzdGVwXG4gICAgICAgICAgdXNlTWFwLnNldE1hcFN0YXRlIHN0ZXAgIyB1cGRhdGUgbWFwIGJhc2VkIG9uIHN0ZXAgXG4gICAgICBlbHNlIGlmIGluc3RhbmNlID09IDJcbiAgICAgICAgaWYgdXNlR3JhcGggYW5kIHN0ZXAgPiAwXG4gICAgICAgICAgZGF0YSA9IFs2MywgODgsIDEwMF0gIyA2MywgNjMrMjUsIDYzKzI1KzEyXG4gICAgICAgICAgZnJvbSA9IGlmIHN0ZXAgPiAxIHRoZW4gZGF0YVtzdGVwLTJdIGVsc2UgMFxuICAgICAgICAgIHRvID0gZGF0YVtzdGVwLTFdXG4gICAgICAgICAgdXNlR3JhcGguc2VsZWN0QWxsKCdsaScpXG4gICAgICAgICAgICAuZmlsdGVyIChkKSAtPiBkID49IGZyb20gYW5kIGQgPCB0b1xuICAgICAgICAgICAgLmNsYXNzZWQgJ2ZpbGwtJytzdGVwLCBlLmRpcmVjdGlvbiA9PSAnZG93bidcbiAgICAgICAgICAjY29uc29sZS5sb2cgJ3Njcm9sbGFtYSAyJywgc3RlcFxuICAgICAgZWxzZSBpZiBpbnN0YW5jZSA9PSAzXG4gICAgICAgIGlmIHVubWV0bmVlZHNHcmFwaFxuICAgICAgICAgIHVubWV0bmVlZHNHcmFwaC5zZXRNb2RlIHN0ZXBcbiAgICAgIGVsc2UgaWYgaW5zdGFuY2UgPT0gNFxuICAgICAgICAkKCcjY2Fyb3VzZWwtbWFyaWUtc3RvcGVzIC5zY3JvbGwtZ3JhcGhpYyAuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICQoJyNjYXJvdXNlbC1tYXJpZS1zdG9wZXMgLnNjcm9sbC1ncmFwaGljIC5zdGVwLScrc3RlcCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAjIHN0YXJ0IGl0IHVwXG4gICAgIyAxLiBjYWxsIGEgcmVzaXplIG9uIGxvYWQgdG8gdXBkYXRlIHdpZHRoL2hlaWdodC9wb3NpdGlvbiBvZiBlbGVtZW50c1xuICAgIGhhbmRsZVJlc2l6ZSgpXG5cbiAgICAjIDIuIHNldHVwIHRoZSBzY3JvbGxhbWEgaW5zdGFuY2VcbiAgICAjIDMuIGJpbmQgc2Nyb2xsYW1hIGV2ZW50IGhhbmRsZXJzICh0aGlzIGNhbiBiZSBjaGFpbmVkIGxpa2UgYmVsb3cpXG4gICAgc2Nyb2xsZXJcbiAgICAgIC5zZXR1cFxuICAgICAgICBjb250YWluZXI6ICAnIycraWQgICAgICAgICAgICAgICAgIyBvdXIgb3V0ZXJtb3N0IHNjcm9sbHl0ZWxsaW5nIGVsZW1lbnRcbiAgICAgICAgZ3JhcGhpYzogICAgJy5zY3JvbGwtZ3JhcGhpYycgICAgICMgdGhlIGdyYXBoaWNcbiAgICAgICAgdGV4dDogICAgICAgJy5zY3JvbGwtdGV4dCcgICAgICAgICMgdGhlIHN0ZXAgY29udGFpbmVyXG4gICAgICAgIHN0ZXA6ICAgICAgICcuc2Nyb2xsLXRleHQgLnN0ZXAnICAjIHRoZSBzdGVwIGVsZW1lbnRzXG4gICAgICAgIG9mZnNldDogICAgIDAuMDUgICAgICAgICAgICAgICAgICAjIHNldCB0aGUgdHJpZ2dlciB0byBiZSAxLzIgd2F5IGRvd24gc2NyZWVuXG4gICAgICAgIGRlYnVnOiAgICAgIGZhbHNlICAgICAgICAgICAgICAgICAjIGRpc3BsYXkgdGhlIHRyaWdnZXIgb2Zmc2V0IGZvciB0ZXN0aW5nXG4gICAgICAub25Db250YWluZXJFbnRlciBoYW5kbGVDb250YWluZXJFbnRlciBcbiAgICAgIC5vbkNvbnRhaW5lckV4aXQgIGhhbmRsZUNvbnRhaW5lckV4aXQgXG5cbiAgICAjIEVuc3VyZSB0byBzZXR1cCBvblN0ZXBFbnRlciBoYW5kbGVyIG9ubHkgb25jZVxuICAgIHVubGVzcyBzY3JvbGxhbWFJbml0aWFsaXplZFxuICAgICAgc2Nyb2xsYW1hSW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBzY3JvbGxlci5vblN0ZXBFbnRlciAgaGFuZGxlU3RlcEVudGVyIFxuICAgICAgXG4gICAgIyBzZXR1cCByZXNpemUgZXZlbnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgaGFuZGxlUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFVzZSBHcmFwaCBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCA9IC0+XG4gICAgIyBTZXR1cCBTY3JvbGxhbWFcbiAgICBzZXR1cFNjcm9sbGFtYSAnY29udHJhY2VwdGl2ZXMtdXNlLWdyYXBoLWNvbnRhaW5lcidcbiAgICAjIFNldHVwIEdyYXBoXG4gICAgZ3JhcGhXaWR0aCA9IDBcbiAgICBkYXRhSW5kZXggPSBbMC4uOTldXG4gICAgdXNlR3JhcGggPSBkMy5zZWxlY3QoJyNjb250cmFjZXB0aXZlcy11c2UtZ3JhcGgnKVxuICAgIHVzZUdyYXBoLmFwcGVuZCgndWwnKVxuICAgICAgLnNlbGVjdEFsbCgnbGknKVxuICAgICAgICAuZGF0YShkYXRhSW5kZXgpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpJylcbiAgICAgICAgLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAuYXBwZW5kKCd1c2UnKVxuICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2ljb24td29tYW4nKVxuICAgICAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCAnMCAwIDE5MyA0NTAnKVxuICAgICMgUmVzaXplIGhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyID0gLT5cbiAgICAgIGlmIGdyYXBoV2lkdGggIT0gdXNlR3JhcGgubm9kZSgpLm9mZnNldFdpZHRoXG4gICAgICAgIGdyYXBoV2lkdGggPSB1c2VHcmFwaC5ub2RlKCkub2Zmc2V0V2lkdGhcbiAgICAgICAgaXRlbXNXaWR0aCA9IChncmFwaFdpZHRoIC8gMjApIC0gMTBcbiAgICAgICAgaXRlbXNIZWlnaHQgPSAyLjMzKml0ZW1zV2lkdGhcbiAgICAgICAgI2l0ZW1zV2lkdGggPSBpZiBncmFwaFdpZHRoIDwgNDgwIHRoZW4gJzEwJScgZWxzZSAnNSUnXG4gICAgICAgICNpdGVtc0hlaWdodCA9IGlmIGdyYXBoV2lkdGggPCA0ODAgdGhlbiBncmFwaFdpZHRoICogMC4xIC8gMC43NSBlbHNlIGdyYXBoV2lkdGggKiAwLjA1IC8gMC43NVxuICAgICAgICB1c2VHcmFwaC5zZWxlY3RBbGwoJ2xpJylcbiAgICAgICAgICAuc3R5bGUgJ3dpZHRoJywgaXRlbXNXaWR0aCsncHgnXG4gICAgICAgICAgLnN0eWxlICdoZWlnaHQnLCBpdGVtc0hlaWdodCsncHgnXG4gICAgICAgIHVzZUdyYXBoLnNlbGVjdEFsbCgnc3ZnJylcbiAgICAgICAgICAuYXR0ciAnd2lkdGgnLCBpdGVtc1dpZHRoXG4gICAgICAgICAgLmF0dHIgJ2hlaWdodCcsIGl0ZW1zSGVpZ2h0XG4gICAgICB1c2VHcmFwaC5zdHlsZSAnbWFyZ2luLXRvcCcsICgoJCgnYm9keScpLmhlaWdodCgpLXVzZUdyYXBoLm5vZGUoKS5vZmZzZXRIZWlnaHQpKi41KSsncHgnXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXJcbiAgICByZXNpemVIYW5kbGVyKClcblxuXG4gICMgVW5tZWV0IE5lZWRzIHZzIEdEUCBncmFwaFxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggPSAoZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXMpIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICd1bm1ldC1uZWVkcy1nZHAtY29udGFpbmVyLWdyYXBoJ1xuXG4gICAgIyBwYXJzZSBkYXRhXG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YV91bm1ldG5lZWRzLmZvckVhY2ggKGQpIC0+XG4gICAgICBjb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZSkgLT4gZS5jb2RlID09IGQuY29kZVxuICAgICAgaWYgY291bnRyeVswXSBhbmQgY291bnRyeVswXVsnZ25pJ11cbiAgICAgICAgICBkYXRhLnB1c2hcbiAgICAgICAgICAgIHZhbHVlOiAgICAgICtkWydlc3RpbWF0ZWQnXVxuICAgICAgICAgICAgaWQ6ICAgICAgICAgY291bnRyeVswXS5jb2RlXG4gICAgICAgICAgICBuYW1lOiAgICAgICBjb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICAgICAgICAgIHBvcHVsYXRpb246ICtjb3VudHJ5WzBdWydwb3B1bGF0aW9uJ11cbiAgICAgICAgICAgIGduaTogICAgICAgICtjb3VudHJ5WzBdWydnbmknXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnTm8gR05JIG9yIFBvcHVsYXRpb24gZGF0YSBmb3IgdGhpcyBjb3VudHJ5JywgZC5jb2RlLCBjb3VudHJ5WzBdXG4gICAgIyBzZXR1cCBncmFwaFxuICAgIHVubWV0bmVlZHNHcmFwaCA9IG5ldyB3aW5kb3cuQmVlc3dhcm1TY2F0dGVycGxvdEdyYXBoICd1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnLFxuICAgICAgbWFyZ2luOlxuICAgICAgICBsZWZ0OiAgIDBcbiAgICAgICAgcmlndGg6ICAwXG4gICAgICAgIHRvcDogICAgNVxuICAgICAgICBib3R0b206IDBcbiAgICAgIGtleTpcbiAgICAgICAgeDogICAgICAnZ25pJ1xuICAgICAgICB5OiAgICAgICd2YWx1ZSdcbiAgICAgICAgaWQ6ICAgICAnaWQnXG4gICAgICAgIGxhYmVsOiAgJ25hbWUnXG4gICAgICAgIGNvbG9yOiAgJ3ZhbHVlJ1xuICAgICAgICBzaXplOiAgICdwb3B1bGF0aW9uJ1xuICAgICAgZG90TWluU2l6ZTogMVxuICAgICAgZG90TWF4U2l6ZTogMzJcbiAgICB1bm1ldG5lZWRzR3JhcGguc2V0RGF0YSBkYXRhXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1bm1ldG5lZWRzR3JhcGgub25SZXNpemVcblxuXG4gICMgVXNlICYgUmVhc29ucyBtYXBzXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyA9IChkYXRhX3VzZSwgY291bnRyaWVzLCBtYXApIC0+XG5cbiAgICAjIFNldHVwIFNjcm9sbGFtYVxuICAgIHNldHVwU2Nyb2xsYW1hICdjb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuXG4gICAgIyBwYXJzZSBkYXRhIHVzZVxuICAgIGRhdGFfdXNlLmZvckVhY2ggKGQpIC0+XG4gICAgICBpdGVtID0gY291bnRyaWVzLmZpbHRlciAoY291bnRyeSkgLT4gY291bnRyeS5jb2RlID09IGQuY29kZVxuICAgICAgIyMjXG4gICAgICBkWydSaHl0aG0nXSAgICAgICAgICAgICAgICAgICAgPSArZFsnUmh5dGhtJ11cbiAgICAgIGRbJ1dpdGhkcmF3YWwnXSAgICAgICAgICAgICAgICA9ICtkWydXaXRoZHJhd2FsJ11cbiAgICAgIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXSA9ICtkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRbJ1RyYWRpdGlvbmFsIG1ldGhvZHMnXSA9IGRbJ1JoeXRobSddK2RbJ1dpdGhkcmF3YWwnXStkWydPdGhlciB0cmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGNvbnNvbGUubG9nIGQuY29kZSwgZFsnUmh5dGhtJ10sIGRbJ1dpdGhkcmF3YWwnXSwgZFsnT3RoZXIgdHJhZGl0aW9uYWwgbWV0aG9kcyddLCBkWydUcmFkaXRpb25hbCBtZXRob2RzJ11cbiAgICAgIGRlbGV0ZSBkWydSaHl0aG0nXVxuICAgICAgZGVsZXRlIGRbJ1dpdGhkcmF3YWwnXVxuICAgICAgZGVsZXRlIGRbJ090aGVyIHRyYWRpdGlvbmFsIG1ldGhvZHMnXVxuICAgICAgIyMjXG4gICAgICBkLnZhbHVlcyA9IFtdICMgK2RbJ0FueSBtZXRob2QnXVxuICAgICAgZC52YWx1ZSA9IDAgICMgK2RbJ01hbGUgc3RlcmlsaXphdGlvbiddXG4gICAgICAjIGdldCBtYWluIG1ldGhvZCBpbiBlYWNoIGNvdW50cnlcbiAgICAgIG1ldGhvZHNfa2V5cy5mb3JFYWNoIChrZXksaSkgLT5cbiAgICAgICAgZC52YWx1ZXMucHVzaFxuICAgICAgICAgIGlkOiBpXG4gICAgICAgICAgbmFtZTogbWV0aG9kc19uYW1lc1tsYW5nXVtpXVxuICAgICAgICAgIHZhbHVlOiBpZiBkW2tleV0gIT0gJycgdGhlbiArZFtrZXldIGVsc2UgbnVsbFxuICAgICAgICAjZGVsZXRlIGRba2V5XVxuICAgICAgIyBzb3J0IGRlc2NlbmRpbmcgdmFsdWVzXG4gICAgICAjZC52YWx1ZXMuc29ydCAoYSxiKSAtPiBkMy5kZXNjZW5kaW5nKGEudmFsdWUsIGIudmFsdWUpXG4gICAgICAjZC52YWx1ZSA9IGQudmFsdWVzWzBdLnZhbHVlXG4gICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgIGQubmFtZSA9IGl0ZW1bMF1bJ25hbWVfJytsYW5nXVxuICAgICAgICBkLmNvZGVfbnVtID0gaXRlbVswXVsnY29kZV9udW0nXVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyAnbm8gY291bnRyeScsIGQuY29kZVxuXG4gICAgIyBTZXQgdXNlIG1hcFxuICAgIHVzZU1hcCA9IG5ldyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNVc2VNYXBHcmFwaCAnbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIHRvcDogMjBcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICBsZWdlbmQ6IHRydWVcbiAgICAgIGxhbmc6IGxhbmdcbiAgICB1c2VNYXAuc2V0RGF0YSBkYXRhX3VzZSwgbWFwXG4gICAgdXNlTWFwLm9uUmVzaXplKClcblxuICAgICMgc2V0dXAgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VNYXAub25SZXNpemVcblxuXG4gICMgQ29udHJhY2VwdGl2ZXMgVXNlIFRyZWVuYXBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldHVwQ29uc3RyYWNlcHRpdmVzVXNlVHJlZW1hcCA9IChkYXRhX3VzZSkgLT5cbiAgICAjIHNldCBzY3JvbGxhbWEgZm9yIHRyZWVtYXBcbiAgICBzZXR1cFNjcm9sbGFtYSAndHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UtY29udGFpbmVyJ1xuICAgICMgc2V0dXAgdHJlZW1hcFxuICAgIHVzZVRyZWVtYXAgPSBuZXcgd2luZG93LkNvbnRyYWNlcHRpdmVzVXNlVHJlZW1hcEdyYXBoICd0cmVlbWFwLWNvbnRyYWNlcHRpdmVzLXVzZScsXG4gICAgICBhc3BlY3RSYXRpbzogMC41NjI1XG4gICAgICBtYXJnaW46XG4gICAgICAgIGxlZnQ6ICAgMFxuICAgICAgICByaWd0aDogIDBcbiAgICAgICAgdG9wOiAgICAwXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAga2V5OlxuICAgICAgICB2YWx1ZTogJ3ZhbHVlJ1xuICAgICAgICBpZDogJ25hbWUnXG4gICAgICBtZXRob2RzS2V5czogbWV0aG9kc19rZXlzXG4gICAgICBtZXRob2RzTmFtZXM6IG1ldGhvZHNfbmFtZXNbbGFuZ11cbiAgICAjIHNldCBkYXRhXG4gICAgdXNlVHJlZW1hcC5zZXREYXRhIGRhdGFfdXNlLCB1c2VyQ291bnRyeS5jb2RlLCB1c2VyQ291bnRyeS5uYW1lXG4gICAgIyBzZXQgcmVzaXplXG4gICAgJCh3aW5kb3cpLnJlc2l6ZSB1c2VUcmVlbWFwLm9uUmVzaXplXG5cblxuICAjIENvbnRyYWNlcHRpdmVzIFJlYXNvbnMgT3Bwb3NpdGlvbiBHcmFwaHNcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBSZWFzb25zT3Bwb3NlZEdyYXBoID0gLT5cbiAgICAkYmFycyA9ICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQgLmJhcicpXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMtb3Bwb3NlZC1sZWdlbmQgbGknKVxuICAgICAgLm1vdXNlb3ZlciAtPlxuICAgICAgICAkYmFyc1xuICAgICAgICAgIC5hZGRDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgIC5maWx0ZXIoJy5iYXItJyskKHRoaXMpLmF0dHIoJ2NsYXNzJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcbiAgICAgIC5tb3VzZW91dCAtPlxuICAgICAgICAkYmFycy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuXG5cbiAgIyBDb250cmFjZXB0aXZlcyBBcHBcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCA9IChkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMpIC0+XG4gICAgI8Kgc2V0dXBTY3JvbGxhbWEgJ2NvbnRyYWNlcHRpdmVzLWFwcC1jb250YWluZXInXG4gICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCAuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLmNoYW5nZSAtPlxuICAgICAgICBjb3VudHJ5X2NvZGUgPSAkKHRoaXMpLnZhbCgpXG4gICAgICAgICMgVXNlXG4gICAgICAgIGRhdGFfdXNlX2NvdW50cnkgPSBkYXRhX3VzZS5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91c2VfY291bnRyeSBhbmQgZGF0YV91c2VfY291bnRyeVswXVxuICAgICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IG1ldGhvZHNfa2V5cy5tYXAgKGtleSwgaSkgLT4geyduYW1lJzogbWV0aG9kc19uYW1lc1tsYW5nXVtpXSwgJ3ZhbHVlJzogK2RhdGFfdXNlX2NvdW50cnlbMF1ba2V5XX1cbiAgICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBjb3VudHJ5X21ldGhvZHMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCtkYXRhX3VzZV9jb3VudHJ5WzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZSkrJyUnXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG4gICAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgICBkYXRhX3VubWV0bmVlZHNfY291bnRyeSA9IGRhdGFfdW5tZXRuZWVkcy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV91bm1ldG5lZWRzX2NvdW50cnkgYW5kIGRhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK2RhdGFfdW5tZXRuZWVkc19jb3VudHJ5WzBdWycyMDE3J10pKyclJ1xuICAgICAgICAgICQoJyNjb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG4gICAgICAgICMgUmVhc29uc1xuICAgICAgICBkYXRhX3JlYXNvbnNfY291bnRyeSA9IGRhdGFfcmVhc29ucy5maWx0ZXIgKGQpIC0+IGQuY29kZSA9PSBjb3VudHJ5X2NvZGVcbiAgICAgICAgaWYgZGF0YV9yZWFzb25zX2NvdW50cnkgYW5kIGRhdGFfcmVhc29uc19jb3VudHJ5WzBdXG4gICAgICAgICAgcmVhc29ucyA9IE9iamVjdC5rZXlzKHJlYXNvbnNfbmFtZXMpLm1hcCAocmVhc29uKSAtPiB7J25hbWUnOiByZWFzb25zX25hbWVzW3JlYXNvbl0sICd2YWx1ZSc6ICtkYXRhX3JlYXNvbnNfY291bnRyeVswXVtyZWFzb25dfVxuICAgICAgICAgIHJlYXNvbnMgPSByZWFzb25zLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uc1swXS5uYW1lXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZChyZWFzb25zWzBdLnZhbHVlKSsnJSdcbiAgICAgICAgICAkKCcjY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcbiAgICAgIC52YWwgdXNlckNvdW50cnkuY29kZVxuICAgICAgLnRyaWdnZXIgJ2NoYW5nZSdcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgZDMucXVldWUoKVxuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgLmRlZmVyIGQzLmpzb24sICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nXG4gICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCwgbG9jYXRpb24pIC0+XG5cbiAgICAgIGlmIGxvY2F0aW9uXG4gICAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgICAgZWxzZVxuICAgICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG4gICAgICAjdGVzdCBvdGhlciBjb3VudHJpZXNcbiAgICAgICN1c2VyQ291bnRyeS5jb2RlID0gJ1JVUydcbiAgICAgICN1c2VyQ291bnRyeS5uYW1lID0gJ1J1c2lhJ1xuXG4gICAgICAjIGFkZCBjb3VudHJ5IElTTyAzMTY2LTEgYWxwaGEtMyBjb2RlIHRvIGRhdGFfcmVhc29uc1xuICAgICAgZGF0YV9yZWFzb25zLmZvckVhY2ggKGQpIC0+XG4gICAgICAgIGl0ZW0gPSBjb3VudHJpZXMuZmlsdGVyIChjb3VudHJ5KSAtPiBjb3VudHJ5LmNvZGUyID09IGQuY29kZVxuICAgICAgICBpZiBpdGVtIGFuZCBpdGVtWzBdXG4gICAgICAgICAgZC5jb2RlID0gaXRlbVswXS5jb2RlXG4gICAgICAgICAgZC5uYW1lID0gaXRlbVswXVsnbmFtZV8nK2xhbmddXG4gICAgICAgICAgT2JqZWN0LmtleXMocmVhc29uc19uYW1lcykuZm9yRWFjaCAocmVhc29uKSAtPlxuICAgICAgICAgICAgZFtyZWFzb25dID0gMTAwKmRbcmVhc29uXVxuICAgICAgICAgICAgaWYgZFtyZWFzb25dID4gMTAwXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nICdBbGVydCEgVmFsdWUgZ3JlYXRlciB0aGFuIHplcm8uICcgKyBkLmNvdW50cnkgKyAnLCAnICsgcmVhc29uICsgJzogJyArIGRbcmVhc29uXVxuICAgICAgICAgIGRlbGV0ZSBkLmNvdW50cnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUud2FybiAnTm8gY291bnRyeSBkYXRhIGZvciAnK2QuY29kZVxuXG4gICAgICBpZiAkKCcjdHJlZW1hcC1jb250cmFjZXB0aXZlcy11c2UnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VUcmVlbWFwIGRhdGFfdXNlXG5cbiAgICAgIGlmICQoJyNtYXAtY29udHJhY2VwdGl2ZXMtdXNlJykubGVuZ3RoXG4gICAgICAgIHNldHVwQ29uc3RyYWNlcHRpdmVzTWFwcyBkYXRhX3VzZSwgY291bnRyaWVzLCBtYXBcblxuICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLXVzZS1ncmFwaCcpLmxlbmd0aCA+IDBcbiAgICAgICAgc2V0dXBDb25zdHJhY2VwdGl2ZXNVc2VHcmFwaCgpXG5cbiAgICAgIGlmICQoJyN1bm1ldC1uZWVkcy1nZHAtZ3JhcGgnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBVbm1ldE5lZWRzR2RwR3JhcGggZGF0YV91bm1ldG5lZWRzLCBjb3VudHJpZXNcblxuICAgICAgI2lmICQoJyNjb250cmFjZXB0aXZlcy1yZWFzb25zLW9wcG9zZWQnKS5sZW5ndGhcbiAgICAgICMgIG5ldyBDb250cmFjZXB0aXZlc1JlYXNvbnMgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIHJlYXNvbnNfbmFtZXNcblxuICAgICAgaWYgJCgnI2Nhcm91c2VsLW1hcmllLXN0b3BlcycpLmxlbmd0aFxuICAgICAgICBzZXR1cFNjcm9sbGFtYSAnY2Fyb3VzZWwtbWFyaWUtc3RvcGVzJ1xuXG4gICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtcmVhc29ucy1vcHBvc2VkJykubGVuZ3RoXG4gICAgICAgIHNldHVwUmVhc29uc09wcG9zZWRHcmFwaCgpXG5cbiAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgc2V0dXBDb250cmFjZXB0aXZlc0FwcCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnNcblxuKSBqUXVlcnlcbiJdfQ==
