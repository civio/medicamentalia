class window.MapGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Map Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

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
        .attr 'x', (d,i) -> Math.round legenItemWidth*(i-(legendData.length/2))
        .attr 'y', 5
        .attr 'width', legenItemWidth
        .attr 'height', 8
        .attr 'fill', (d) => @color d
    # draw legend texts
    @legend.selectAll('text')
      .data legendData
      .enter().append('text')
        .attr 'x', (d,i) -> Math.round( legenItemWidth*(i-(legendData.length/2)) + (legenItemWidth/2) )
        .attr 'text-anchor', 'middle'
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
