class window.BeeswarmScatterplotGraph extends window.BaseGraph

  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'BeeswarmGraph', id
    options.dotSize = options.dotSize || 5
    options.dotMinSize = options.dotMinSize || 2
    options.dotMaxSize = options.dotMaxSize || 15
    options.mode = options.mode || 0 # mode 0: beeswarm, mode 1: scatterplot
    super id, options
    return @


  # Main methods
  # ------------

  drawGraph: ->

    @setSize()

    # set & run simulation
    @setSimulation()
    @runSimulation()

    # draw dots
    @container.selectAll('.dot')
      .data @data
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', (d) => 'dot-'+d[@options.key.id]
      .call @setDot
      .on 'mouseover', (d) => console.log d

    # draw labels
    if @options.key.label
      @container.selectAll('.dot-label')
        .data @data.filter (d) => d[@options.key.size] > 78000000
      .enter().append('text')
        .attr 'class', 'dot-label'
        #.attr 'dx', '0.75em'
        .attr 'dy', '0.25em'
        .text (d) => d[@options.key.label]
        .call @setDotLabelPosition


  setSimulation: ->
    # setup simulation
    forceY = d3.forceY (d) => @y(d[@options.key.y])
    forceY.strength(1)
    @simulation = d3.forceSimulation(@data)
      .force 'x', forceY
      .force 'y', d3.forceX(@width*.5)
      .force 'collide', d3.forceCollide((d) => return if @size then d.radius+1 else @options.dotSize+1)
      .stop()

  runSimulation: ->
    i = 0
    while i < 350
      @simulation.tick()
      ++i

  setDot: (selection) =>
    selection
      .attr 'r',  (d) => if @size then d.radius else @options.dotSize
      .attr 'fill', @getDotFill
      .call @setDotPosition

  setDotPosition: (selection) =>
    selection
      .attr 'cx', @getPositionX
      .attr 'cy', @getPositionY

  setDotLabelPosition: (selection) =>
    selection
      .attr 'x', @getPositionX
      .attr 'y', @getPositionY

  getPositionX: (d) => 
    return if @options.mode == 0 then d.x else Math.round @x(d[@options.key.x])

  getPositionY: (d) => 
    return if @options.mode == 0 then d.y else Math.round @y(d[@options.key.y])

  getDotFill: (d) =>
    return @color d[@options.key.color] #if @options.key.color and @options.mode == 1 then @color d[@options.key.color] else '#e2723b'

  setMode: (mode) ->
    @options.mode = mode
    @container.selectAll('.dot')
      .attr 'fill', @getDotFill
      .call @setDotPosition
    if @options.key.label
      @container.selectAll('.dot-label')
        .style 'opacity', 0
        .call @setDotLabelPosition
        .transition()
        .delay 500
        .style 'opacity', 1

  setSize: ->
    if @size
      @data.forEach (d) =>
        d.radius = @size d[@options.key.size]

  updateGraphDimensions: ->
    # update axis size
    @xAxis.tickSize @height
    @yAxis.tickSize @width
    super()
    @setSimulation()
    @runSimulation()
    @container.selectAll('.dot')
      .call @setDotPosition
    # draw labels
    if @options.key.label
      @container.selectAll('.dot-label')
        .call @setDotLabelPosition
    return @


  # Scale methods
  # ------------

  setScales: ->
    # set x scale
    #@x = d3.scalePow()
    #  .exponent(0.125)
    #  .range @getScaleXRange()
    @x = d3.scaleLog()
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # set size scale if options.key.size is defined
    if @options.key.size
      # Equivalent to d3.scaleSqrt()
      # https://bl.ocks.org/d3indepth/775cf431e64b6718481c06fc45dc34f9
      @size = d3.scalePow()
        .exponent 0.5
        .range @getSizeRange()
    # set color scale if options.key.color is defined
    if @options.key.color
      @color = d3.scaleThreshold()
        .range d3.schemeOranges[5] #.reverse()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickSize @height
      .tickValues [500, 1000, 5000, 10000, 50000]
      .tickFormat (d) -> d+'$'
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
      .tickValues [0, 10, 20, 30, 40]
      .tickFormat (d) -> d+'%'
    return @

  setXAxisPosition: (selection) =>
    selection.attr 'transform', 'translate(0,5)'

  getScaleXDomain: =>
    return [250, 85000]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  getSizeRange: =>
    return [@options.dotMinSize, @options.dotMaxSize]

  getSizeDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.size])]

  getColorDomain: =>
    #return [1005, 3955, 12235, 100000]
    return [0, 10, 20, 30]

  drawScales: ->
    # set scales domains
    @x.domain @getScaleXDomain()
    @y.domain @getScaleYDomain()
    if @size
      @size.domain @getSizeDomain()
    if @color
      @color.domain @getColorDomain()
    # set x axis
    if @xAxis
      @container.append('g')
        .attr 'class', 'x axis'
        .call @setXAxisPosition
        .call @xAxis
    # set y axis
    if @yAxis
      @container.append('g')
        .attr 'class', 'y axis'
        .call @setYAxisPosition
        .call @yAxis
      @container.selectAll('.y.axis .tick text')
        .attr 'dx', 3
        .attr 'dy', -4
    return @

  getDimensions: ->
    if @$el
      @containerWidth  = @$el.width()
      @containerHeight = @containerWidth * @options.aspectRatio
      @width           = @containerWidth - @options.margin.left - @options.margin.right
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @
