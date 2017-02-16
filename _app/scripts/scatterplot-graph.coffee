class window.ScatterplotGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Graph', id, options
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
    @x = d3.scaleLinear()
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # set color scale if options.key.color is defined
    if @options.key.color
      @color = d3.scaleOrdinal()
        .range @getColorRange()
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

  getColorRange: =>
    return ['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']

  getColorDomain: =>
    return d3.extent @data, (d) => d[@options.key.color]

  drawScales: ->
    super()
    # set color domain
    if @color
      @color.domain @getColorDomain()
    return @

  drawGraph: ->
    # draw points
    @container.selectAll('.dot')
      .data(@data)
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', @getDotId
      .attr 'r', 6
      .style 'fill', @getDotFill
      .call @setDotsDimensions
    # draw labels
    @container.selectAll('.dot-label')
      .data(@data)
    .enter().append('text')
      .attr 'class', 'dot-label'
      .attr 'id', @getDotLabelId
      .attr 'dx', '0.75em'
      .attr 'dy', '0.375em'
      .text @getDotLabelText
      .call @setDotLabelsDimensions
    return @

  updateGraphDimensions: ->
    super()
    @container.selectAll('.dot')
      .call @setDotsDimensions
    return @

  getDotId: (d) =>
    return 'dot-'+d[@options.key.id]

  getDotLabelId: (d) =>
    return 'dot-label-'+d[@options.key.id]

  getDotLabelText: (d) =>
    return d[@options.key.id]

  getDotFill: (d) =>
    if @color
      return @color d[@options.key.color]
    else
      return null

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
    