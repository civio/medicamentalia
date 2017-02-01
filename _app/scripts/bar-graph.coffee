class window.BarGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Bar Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.y] = +d[@options.key.y]
    return data

  setScales: ->
    # set x scale
    @x = d3.scaleBand()
      .range @getScaleXRange()
      .paddingInner(0.1)
      .paddingOuter(0)
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    return @

  getScaleXDomain: =>
    return @data.map (d) => d[@options.key.x]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  drawGraph: ->
    # draw bars
    @container.selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar active' else 'bar'
      .attr 'id',    (d) => d[@options.key.id]
      .call @setBarDimensions
    if @options.mouseEvents
      @container.selectAll('.bar')
        .on   'mouseover', @onMouseOver
        .on   'mouseout', @onMouseOut
    if @options.label
      # draw labels x
      @container.selectAll('.bar-label-x')
        .data(@data)
      .enter().append('text')
        .attr 'class', (d) -> if d.active then 'bar-label-x active' else 'bar-label-x'
        .attr 'id',    (d) => 'bar-label-x-'+d[@options.key.id]
        .attr 'dy',    '1.25em'
        .attr 'text-anchor', 'middle'
        .text (d) => d[@options.key.x]
        .call @setBarLabelXDimensions
       # draw labels y
      @container.selectAll('.bar-label-y')
        .data(@data)
      .enter().append('text')
        .attr 'class', (d) -> if d.active then 'bar-label-y active' else 'bar-label-y'
        .attr 'id',    (d) => 'bar-label-y-'+d[@options.key.id]
        .attr 'dy',    '-0.5em'
        .attr 'text-anchor', 'middle'
        .text (d) => if @options.label.format then @options.label.format(d[@options.key.y]) else d[@options.key.y]
        .call @setBarLabelYDimensions
    return @

  updateGraphDimensions: ->
    super()
    # update graph dimensions
    @container.selectAll('.bar')
      .call @setBarDimensions
    @container.selectAll('.bar-label-x')
      .call @setBarLabelXDimensions
    @container.selectAll('.bar-label-y')
      .call @setBarLabelYDimensions
    return @

  setBarDimensions: (element) =>
    element
      .attr 'x',      (d) => @x(d[@options.key.x])
      .attr 'y',      (d) => @y(d[@options.key.y])
      .attr 'height', (d) => @height - @y(d[@options.key.y])
      .attr 'width',  @x.bandwidth()

  setBarLabelXDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @height

  setBarLabelYDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @y(d[@options.key.y])

  onMouseOver: (d) =>
    @container.select('#bar-label-x-'+d[@options.key.id])
      .classed 'active', true
    @container.select('#bar-label-y-'+d[@options.key.id])
      .classed 'active', true

  onMouseOut: (d) =>
    unless d.active
      @container.select('#bar-label-x-'+d[@options.key.id])
        .classed 'active', false
      @container.select('#bar-label-y-'+d[@options.key.id])
        .classed 'active', false
    