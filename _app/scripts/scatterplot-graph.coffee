class window.ScatterplotGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Scatterplot Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.x] = +d[@options.key.x]
      d[@options.key.y] = +d[@options.key.y]
    return data

  setScales: ->
    # set x scale
    @x = d3.scalePow()
      .exponent 0.5
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickSize @height
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    return @

  getScaleXDomain: =>
    console.log 'getScaleXDomain', d3.max(@data, (d) => d[@options.key.x])
    return [0, d3.max(@data, (d) => d[@options.key.x])]

  getScaleYDomain: =>
    console.log 'getScaleYDomain', d3.max(@data, (d) => d[@options.key.y])
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  drawGraph: ->
    console.log @data
    # draw points
    @container.selectAll('.dot')
      .data(@data)
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', (d) => 'dot-'+d[@options.key.id]
      .attr 'r', 6
      .call @setDotsDimensions

    @container.selectAll('.dot-label')
      .data(@data)
    .enter().append('text')
      .attr 'class', 'dot-label'
      .attr 'id', (d) => 'dot-'+d[@options.key.id]
      .attr 'dx', '0.75em'
      .attr 'dy', '0.375em'
      .text (d) => d[@options.key.id]
      .call @setDotLabelsDimensions
    return @

  updateGraphDimensions: ->
    super()
    @container.selectAll('.dot')
      .call @setDotsDimensions
    return @

  setDotsDimensions: (element) =>
    element
      .attr 'cx', (d) => @x d[@options.key.x]
      .attr 'cy', (d) => @y d[@options.key.y]

  setDotLabelsDimensions: (element) =>
    element
      .attr 'x', (d) => @x d[@options.key.x]
      .attr 'y', (d) => @y d[@options.key.y]

  # overrid x axis positioning
  setXAxisPosition: (selection) =>
    selection.attr 'transform', 'translate(0,0)'
    