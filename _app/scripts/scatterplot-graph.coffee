class window.ScatterplotGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Scatterplot Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  setScales: ->
    # set x scale
    @x = d3.scaleLinear()
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
    return [0, d3.max(@data, (d) => d[@options.key.x])]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  drawGraph: ->
    # draw points
    @container.selectAll('.dot')
      .data(@data)
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', (d) => 'dot-'+d[@options.key.id]
      .attr 'r', 6
      .call @setDotsDimensions
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

  # overrid x axis positioning
  setXAxisPosition: (selection) =>
    selection.attr 'transform', 'translate(0,0)'
    