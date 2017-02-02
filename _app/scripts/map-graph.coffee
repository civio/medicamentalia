class window.MapGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Map Graph', id, options
    super id, options
    @formatFloat   = d3.format(',.1f')
    @formatInteger = d3.format(',d')
    return @


  # Main methods
  # ------------

  setSVG: ->
    super()
    @$tooltip = @$el.find '.tooltip'

  setScales: ->
    # set color scale
    @color = d3.scaleSequential d3.interpolateOranges
    return @

  loadData: (url_data, url_map) ->
    d3.queue()
      .defer d3.csv, url_data
      .defer d3.json, url_map
      .await (error, data, map)  =>
        @$el.trigger 'data-loaded'
        @setData data, map
    return @

  setData: (data, map) ->
    @data = @dataParser(data)
    @color.domain [0, d3.max(@data, (d) -> d.value)]
    if @options.legend
      @drawLegend()
    @drawGraph map
    return @

  drawLegend: ->
    legenItemWidth = 30
    legendData = d3.range 0, @color.domain()[1]
    @legend = @container.append('g')
      .attr 'class', 'legend'
      .call @setLegendPosition
    # draw legend rects
    @legend.selectAll('rect')
      .data legendData
      .enter().append('rect')
        .attr 'x', (d,i) -> Math.round legenItemWidth*(i-1-(legendData.length/2))
        .attr 'width', legenItemWidth
        .attr 'height', 8
        .attr 'fill', (d) => @color d
    legendData.shift()
    # draw legend texts
    @legend.selectAll('text')
      .data legendData
      .enter().append('text')
        .attr 'x', (d,i) -> Math.round legenItemWidth*(i-0.5-(legendData.length/2))
        .attr 'y', 20
        .attr 'text-anchor', 'start'
        .text (d) -> d

  drawGraph: (map) ->
    # get countries data
    @countries = topojson.feature(map, map.objects.countries);
    @countries.features = @countries.features.filter (d) -> d.id != '010'  # remove antarctica
    # set projection
    @projection = d3.geoKavrayskiy7()
    @projectionSetSize()
    # set path
    @path = d3.geoPath()
      .projection @projection
    # add countries paths
    @container.selectAll('.country')
    .data(@countries.features)
    .enter().append('path')
      .attr 'id', (d) -> 'country-'+d.id
      .attr 'class', (d) -> 'country'
      .attr 'fill', @setCountryColor
      .attr 'stroke-width', 1
      .attr 'stroke', @setCountryColor
      .attr 'd', @path
      .on   'mouseover', @onMouseOver
      .on   'mousemove', @onMouseMove
      .on   'mouseout', @onMouseOut
    # trigger draw-complete event
    @$el.trigger 'draw-complete'
    return @

  updateGraphDimensions: ->
    super()
    @projectionSetSize()
    @path.projection @projection
    @container.selectAll('.country')
      .attr 'd', @path
    if @options.legend
      @legend.call @setLegendPosition
    return @

  projectionSetSize: ->
    @projection
      .fitSize [@width, @height], @countries  # fit projection size
      .scale    @projection.scale() * 1.1     # Adjust projection size & translation
      .translate [@width*0.48, @height*0.6]

  setCountryColor: (d) =>
    value = @data.filter (e) -> e.code_num == d.id
    return if value[0] then @color(value[0].value) else '#eee'

  setLegendPosition: (element) =>
    element.attr 'transform', 'translate('+Math.round(@width*0.5)+','+(-@options.margin.top)+')'

  onMouseOver: (d) =>
    value = @data.filter (e) -> e.code_num == d.id
    if value.length > 0
      position = d3.mouse(d3.event.target)
      # Set tooltip content
      offset = $(d3.event.target).offset()
      @$tooltip
        .find '.tooltip-inner .title'
        .html value[0].name
      @$tooltip
        .find '.tooltip-inner .value'
        .html @formatFloat(value[0].value)
      @$tooltip
        .find '.tooltip-inner .cases'
        .html @formatInteger(value[0].cases)
      # Set tooltip position
      @$tooltip.css
        'left':    position[0] - (@$tooltip.width() * 0.5)
        'top':     position[1] - (@$tooltip.height() * 0.5)
        'opacity': '1'

  onMouseMove: (d) =>
    position = d3.mouse(d3.event.target)
    @$tooltip.css
      'left':    position[0] - (@$tooltip.width() * 0.5)
      'top':     position[1] - (@$tooltip.height() * 0.5)

  onMouseOut: (d) =>
    @$tooltip.css 'opacity', '0'
