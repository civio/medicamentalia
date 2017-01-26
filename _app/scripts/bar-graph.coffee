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
    data.forEach (d) => d.value = +d.value
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
    # set x axis
    @xAxis = d3.axisBottom(@x)
    return @

  getScaleXDomain: =>
    return @data.map (d) => d[@options.key.x]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  setGraph: ->
    # draw bars
    @container.selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar active' else 'bar'
      .attr 'id',    (d) => d[@options.key.id]
      .call @setBarDimensions
    # draw labels
    if @options.label
      @container.selectAll('.bar-label')
        .data(@data)
      .enter().append('text')
        .attr 'class', 'bar-label'
        .attr 'id',    (d) => d[@options.key.id]
        .attr 'dy',    '1.5em'
        .text (d) => parseInt d[@options.key.y]
        .call @setBarLabelDimensions
    return @

  updateGraphDimensions: ->
    super()
    # update graph dimensions
    @container.selectAll('.bar')
      .call @setBarDimensions
    @container.selectAll('.bar-label')
      .call @setBarLabelDimensions
    return @

  setBarDimensions: (element) =>
    element
      .attr 'x',      (d) => @x(d[@options.key.x])
      .attr 'y',      (d) => @y(d[@options.key.y])
      .attr 'height', (d) => @height - @y(d[@options.key.y])
      .attr 'width',  @x.bandwidth()

  setBarLabelDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @y(d[@options.key.y])
