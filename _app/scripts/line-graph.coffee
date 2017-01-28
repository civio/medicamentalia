class window.LineGraph extends window.BaseGraph

  activeLines: []

  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Line Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  setData: (data) ->
    @years = @getYears data
    super(data)
    return @

  getYears: (data) ->
    years = []
    d3.keys(data[0]).forEach (d) ->
      if +d
        years.push +d
    return years.sort()

  dataParser: (data) ->
    data.forEach (d) => 
      d.values = {}
      @years.forEach (year) =>
        if d[year]
          d.values[year] = +d[year]
        #else
        #  console.log('No hay datos de para', d[@options.key.x], 'en ', year);
        delete d[year]
    return data

  setScales: ->
    # set x scale
    @x = d3.scaleLinear()
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickFormat d3.format('')
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    # setup line
    @line = d3.line()
      .curve d3.curveCatmullRom
      .x (d) => @x(+d.key)
      .y (d) => @y(d.value)
    # setup area
    if @options.isArea
      @area = d3.area()
        .curve d3.curveCatmullRom
        .x  (d) => @x(+d.key)
        .y0 @height
        .y1 (d) => @y(d.value)
    return @

  getScaleXDomain: =>
    return [@years[0], @years[@years.length-1]]

  getScaleYDomain: ->
    return [0, d3.max @data, (d) -> d3.max(d3.values(d.values))]

  drawGraph: ->
    # clear graph before setup
    @container.select('.graph').remove()
    # draw graph container 
    graph = @container.append('g')
      .attr 'class', 'graph'
    # draw lines
    graph.selectAll('.line')
      .data(@data)
    .enter().append('path')
      .attr 'class', (d) => if @activeLines.indexOf(d[@options.key.x]) == -1 then 'line' else 'line active'
      .attr 'id',    (d) => 'line-' + d[@options.key.id]
      .datum (d) -> return d3.entries(d.values)
      .attr 'd', @line
    # draw area
    if @options.isArea
      graph.selectAll('.area')
        .data(@data)
      .enter().append('path')
        .attr  'class', (d) => if @activeLines.indexOf(d[@options.key.x]) == -1 then 'area' else 'area active'
        .attr  'id',    (d) => 'area-' + d[@options.key.id]
        .datum (d) -> d3.entries(d.values)
        .attr 'd', @area
    # draw labels
    if @options.label
      graph.selectAll('.line-label')
        .data(@data)
      .enter().append('text')
        .attr 'class', 'line-label'
        .attr 'id',    (d) => 'line-label-'+d[@options.key.id]
        .attr 'text-anchor', 'end'
        .attr 'dy', '-0.125em'
        .text (d) => d[@options.key.x]
        .call @setLabelDimensions
    return @

  updateGraphDimensions: ->
    super()
    # update area y0
    if @options.isArea
      @area.y0 @height
    # update y axis ticks width
    @yAxis.tickSize @width
    # update graph dimensions
    @container.selectAll('.line')
      .attr 'd', @line
    if @options.isArea
      @container.selectAll('.area')
        .attr 'd', @area
    if @options.label
      @container.selectAll('.line-label')
        .call @setLabelDimensions
    return @

  setLabelDimensions: (element) =>
    element
      .attr 'x', @width
      .attr 'y', (d) => @y(d.values[@years[@years.length-1]])
