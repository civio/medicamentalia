class window.ScatterplotDiscreteGraph extends window.ScatterplotGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Discrete Graph', id, options
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
    @x = d3.scalePoint()
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # set color scale if options.key.color is defined
    if @options.key.color
      @color = d3.scaleOrdinal()
        .range @getColorRange()
    # set size scale if options.key.size is defined
    if @options.key.size
      @size = d3.scaleLinear()
        .range @getSizeRange()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickSize @height
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    return @

  drawGraph: ->
    super()
    # draw dot lines
    @container.selectAll('.dot-line')
      .data(@data)
    .enter().append('line')
      .attr 'class', 'dot-line'
      .attr 'id', @getDotLineId
      .style 'stroke', @getDotFill
      .style 'opacity', 0
      .call @setDotLinesDimensions
    return @

  updateGraphDimensions: ->
    super()
    # update lines size
    @container.selectAll('.dot-line')
      .call @setDotLinesDimensions
    return @

  getDotLineId: (d) =>
    return 'dot-line-'+d[@options.key.id]

  getScaleXDomain: =>
    return @data.map (d) => d[@options.key.x]

  setDotLinesDimensions: (element) =>
    element
      .attr 'x1', (d) => @x d[@options.key.x]
      .attr 'y1', (d) => @height
      .attr 'x2', (d) => @x d[@options.key.x]
      .attr 'y2', (d) => @y d[@options.key.y]

  # mouse events
  onMouseOver: (d) =>
    super(d)
    key = d3.select(d3.event.target).data()[0][@options.key.color]
    @container.selectAll('.dot')
      .classed 'inactive', true
    @container.selectAll('.dot')
      .filter (d) => return d[@options.key.color] == key
      .classed 'inactive', false
      .classed 'active', true
    @container.selectAll('.dot-line')
      .filter (d) => return d[@options.key.color] == key
      .style 'opacity', 1
    # set selected dots on top
    @container.selectAll('.dot')
      .sort (a,b) => if a[@options.key.color] == key then 1 else -1

  onMouseOut: (d) =>
    super(d)
    @container.selectAll('.dot')
      .classed 'inactive', false
      .classed 'active', false
    @container.selectAll('.dot-line')
      .style 'opacity', 0
    