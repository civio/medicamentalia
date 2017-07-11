class window.BarHorizontalGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Bar Horizontal Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.x] = +d[@options.key.x]
    return data

  setScales: ->
    # set x scale
    @y = d3.scaleBand()
      .range @getScaleYRange()
      .paddingInner(0.1)
      .paddingOuter(0)
    # set y scale
    @x = d3.scaleLinear()
      .range @getScaleXRange()
    return @

  getScaleYRange: ->
    return [0, @height]

  getScaleXDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.x])]

  getScaleYDomain: =>
    return @data.map (d) => d[@options.key.y]

  drawGraph: ->
    # draw bars
    @container.selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar active' else 'bar'
      #.attr 'id',    (d) => d[@options.key.id]
      .call @setBarDimensions
    # if @options.mouseEvents
    #   @container.selectAll('.bar')
    #     .on   'mouseover', @onMouseOver
    #     .on   'mouseout', @onMouseOut
    # if @options.label
    #   # draw labels x
    #   @container.selectAll('.bar-label-x')
    #     .data(@data)
    #   .enter().append('text')
    #     .attr 'class', (d) -> if d.active then 'bar-label-x active' else 'bar-label-x'
    #     .attr 'id',    (d) => 'bar-label-x-'+d[@options.key.id]
    #     .attr 'dy',    '1.25em'
    #     .attr 'text-anchor', 'middle'
    #     .text (d) => d[@options.key.x]
    #     .call @setBarLabelXDimensions
    #    # draw labels y
    #   @container.selectAll('.bar-label-y')
    #     .data(@data)
    #   .enter().append('text')
    #     .attr 'class', (d) -> if d.active then 'bar-label-y active' else 'bar-label-y'
    #     .attr 'id',    (d) => 'bar-label-y-'+d[@options.key.id]
    #     .attr 'dy',    '-0.5em'
    #     .attr 'text-anchor', 'middle'
    #     .text (d) => if @options.label.format then @options.label.format(d[@options.key.y]) else d[@options.key.y]
    #     .call @setBarLabelYDimensions
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
      .attr 'x',      0
      .attr 'y',      (d) => @y d[@options.key.y]
      .attr 'width',  (d) => @x d[@options.key.x]
      .attr 'height', @y.bandwidth()

  setBarLabelXDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @height

  setBarLabelYDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @y(d[@options.key.y])
