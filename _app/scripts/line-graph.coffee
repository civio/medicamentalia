class window.LineGraph extends window.BaseGraph


  yFormat: d3.format('d')   # set labels hover format


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Line Graph', id, options
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
    @graph = @container.append('g')
      .attr 'class', 'graph'
    # draw lines
    @drawLines()
    # draw areas
    if @options.isArea
      @drawAreas()
    # draw labels
    if @options.label
      @drawLabels()
    # draw mouse events labels
    if @options.mouseEvents
      @drawLineLabelHover()
      # else
      #   @drawTooltip()
      @drawRectOverlay()
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
    if @options.mouseEvents
      @container.select('.overlay')
        .call @setOverlayDimensions
      @container.select('.tick-hover')
        .call @setTickHoverPosition
    return @

  drawLines: ->
    @graph.selectAll('.line')
      .data(@data)
    .enter().append('path')
      .attr 'class', 'line'
      .attr 'id',    (d) => 'line-' + d[@options.key.id]
      .datum (d) -> return d3.entries(d.values)
      .attr 'd', @line

  drawAreas: ->
    @graph.selectAll('.area')
      .data(@data)
    .enter().append('path')
      .attr  'class', 'area'
      .attr  'id',    (d) => 'area-' + d[@options.key.id]
      .datum (d) -> d3.entries(d.values)
      .attr 'd', @area

  drawLabels: ->
    @graph.selectAll('.line-label')
      .data(@data)
    .enter().append('text')
      .attr 'class', 'line-label'
      .attr 'id',    (d) => 'line-label-'+d[@options.key.id]
      .attr 'text-anchor', 'end'
      .attr 'dy', '-0.125em'
      .text (d) => d[@options.key.x]
      .call @setLabelDimensions

  drawLineLabelHover: ->
    @container.selectAll('.line-label-point')
      .data(@data)
    .enter().append('circle')
      .attr 'id',    (d) => 'line-label-point-'+d[@options.key.id]
      .attr 'class', 'line-label-point'
      .attr 'r', 4
      .style 'display', 'none'
    @container.append('text')
      .attr 'class', 'tick-hover'
      .attr 'dy', '0.71em'      
      .style 'display', 'none'
      .call @setTickHoverPosition
    if @data.length == 1
      @container.append('text')
        .attr 'class', 'line-label-hover'
        .attr 'text-anchor', 'middle'
        .attr 'dy', '-0.5em'
        .style 'display', 'none'

  drawRectOverlay: ->
    @container.append('rect')
      .attr 'class', 'overlay'
      .call @setOverlayDimensions
      .on 'mouseover', @onMouseMove
      .on 'mouseout',  @onMouseOut
      .on 'mousemove', @onMouseMove

  setLabelDimensions: (element) =>
    element
      .attr 'x', @width
      .attr 'y', (d) => @y(d.values[@years[@years.length-1]])

  setOverlayDimensions: (element) =>
    element
      .attr 'width', @width
      .attr 'height', @height

  onMouseOut: (d) =>
    @$el.trigger 'mouseout'
    @hideLabel()

  onMouseMove: (d) =>
    position = d3.mouse(d3.event.target)
    year = Math.round @x.invert(position[0])
    if year != @currentYear
      @$el.trigger 'change-year', year
      @setLabel year

  setLabel: (year) ->
    @currentYear = year
    @container.select('.x.axis')
      .selectAll('.tick')
      .style 'display', 'none'
    @container.selectAll('.line-label-point')
      .each (d) => @setLineLabelHoverPosition d
    @container.select('.tick-hover')
      .style 'display', 'block'
      .attr 'x', Math.round @x(@currentYear)
      .text @currentYear

  hideLabel: ->
    @container.selectAll('.line-label-point')
      .style 'display', 'none'
    @container.selectAll('.line-label-hover')
      .style 'display', 'none'
    @container.select('.x.axis')
      .selectAll('.tick')
      .style 'display', 'block'
    @container.select('.tick-hover')
      .style 'display', 'none'

  setLineLabelHoverPosition: (data) =>
    # get current year
    year = @currentYear
    while @years.indexOf(year) == -1 && @currentYear > @years[0]
      year--
    @currentYear = year
    # get point & label
    point = d3.select('#line-label-point-'+data[@options.key.id])
    label = @container.selectAll('.line-label-hover')
    # hide point & label is there is no data
    unless data.values[year]
      point.style 'display', 'none'
      label.style 'display', 'none'
      return
    # show point & label if there's data
    point.style 'display', 'block'
    label.style 'display', 'block'
     # set line label point
    point
      .attr 'cx', (d) => @x year
      .attr 'cy', (d) => if data.values[year] then @y(data.values[year]) else 0
    # set line label hover
    label
      .attr 'x', (d) => @x year
      .attr 'y', (d) => if data.values[year] then @y(data.values[year]) else 0
      .text (d) => if data.values[year] then @yFormat(data.values[year]) else ''
      
  setTickHoverPosition: (element) =>
    element.attr 'y', Math.round @height+@options.margin.top+9