class window.BeeswarmScatterplotGraph extends window.BaseGraph

  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'BeeswarmGraph', id
    options.dotSize = options.dotSize || 5
    options.dotMinSize = options.dotMinSize || 2
    options.dotMaxSize = options.dotMaxSize || 15
    super id, options
    return @


  # Main methods
  # ------------

  drawGraph: ->

    @setSize()

    # set & run simulation
    @setSimulation()
    @runSimulation()

    @container.selectAll('.dot')
      .data @data
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', (d) => 'dot-'+d[@options.key.id]
      .call @setDot
      .on 'mouseover', (d) => console.log d

  setDot: (selection) =>
    selection
      .attr 'r',  (d) => if @size then d.radius else @options.dotSize
      #.attr 'fill', (d) => @color @colorMap(d[@options.key.color])
      .call @setDotPosition

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

  setDotPosition: (selection) =>
    selection
      .attr 'cx', (d) -> d.x
      .attr 'cy', (d) -> d.y

  setScatterplotDotPosition: (selection) =>
    selection
      .attr 'cx', (d) => @x(d[@options.key.x])
      .attr 'cy', (d) => @y(d[@options.key.y])

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
    return @

  setScatterplot: =>
    console.log 'x scale', @x.domain(), @x.range()
    @container.selectAll('.dot')
      .call @setScatterplotDotPosition

  # Scale methods
  # ------------

  setScales: ->
    # set x scale
    @x = d3.scalePow()
      .exponent(0.125)
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
      @colorMap = d3.scaleQuantize()
        .domain [0, 100]
        .range [25, 50, 75, 100]
      @color = d3.scaleSequential d3.interpolateRdYlGn
      #@color = d3.scaleOrdinal d3.schemeRdYlGn
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickSize @height
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    return @

  getScaleXDomain: =>
    return [200, 85000]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  getSizeRange: =>
    return [@options.dotMinSize, @options.dotMaxSize]

  getSizeDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.size])]

  getColorDomain: =>
    return [100, 0]

  drawScales: ->
    # set scales domains
    @x.domain @getScaleXDomain()
    @y.domain @getScaleYDomain()
    if @size
      @size.domain @getSizeDomain()
    if @color
      @color.domain @getColorDomain()
    return @

  getDimensions: ->
    if @$el
      @containerWidth  = @$el.width()
      @containerHeight = @containerWidth * @options.aspectRatio
      @width           = @containerWidth - @options.margin.left - @options.margin.right
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @
