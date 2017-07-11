class window.BeeswarmGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'BeeswarmGraph', id
    options.dotSize = options.dotSize || 5
    options.dotMinSize = options.dotMinSize || 2
    options.dotMaxSize = options.dotMaxSize || 15
    super id, options
    return @


  # Main methods
  # ------------

  drawGraph: ->

    @setSize()

    #console.table @data

    # set & run simulation
    @setSimulation()
    @runSimulation()

    @voronoi = d3.voronoi()
      .extent @getVoronoiExtent()
      .x (d) -> d.x
      .y (d) -> d.y

    @container.append('g')
      .attr 'class', 'cells'

    @drawCells()


  drawCells: ->
    @container.select('.cells')
      .selectAll('g')
        .data @voronoi.polygons(@data)
      .enter().append('g')
        .attr 'class', 'cell'
        .attr 'id', (d) -> 'cell-'+d.data.id
        .call @setCell
    # add mouse events listeners if there's a tooltip
    if @$tooltip
      @container.selectAll('.cell').select('path')
        .on 'mouseover', @onMouseOver
        .on 'mouseout', @onMouseOut

  setCell: (cell) =>
    cell.append('circle')
      .attr 'r',  (d) => if @size then d.data.radius else @options.dotSize
      .attr 'fill', (d) => @color @colorMap(d.data[@options.key.color])
      .call @setCellPosition
    cell.append('path').call @setCellVoronoiPath

  setSimulation: ->
    # setup simulation
    forceX = d3.forceX (d) => return @x(d.value)
    forceX.strength(1)
    @simulation = d3.forceSimulation(@data)
      .force 'x', forceX
      .force 'y', d3.forceY(@height*.5)
      .force 'collide', d3.forceCollide((d) => return if @size then d.radius+1 else @options.dotSize+1)
      .stop()

  runSimulation: ->
    i = 0
    while i < 120
      @simulation.tick()
      ++i

  getVoronoiExtent: ->
    return [[-@options.margin.left-1, -@options.margin.top-1], [@width+@options.margin.right+1, @height+@options.margin.top+1]]

  setCellPosition: (cell) ->
    cell
      .attr 'cx', (d) -> d.data.x
      .attr 'cy', (d) -> d.data.y

  setCellVoronoiPath: (cell) ->
    cell.attr 'd', (d) -> 'M'+d.join('L')+'Z'

  setSize: ->
    if @size
      @data.forEach (d) =>
        d.radius = @size d[@options.key.size]

  updateGraphDimensions: ->
    super()
    @setSimulation()
    @runSimulation()
    @voronoi.extent @getVoronoiExtent()
    @container.selectAll('.cell').remove()
    @drawCells()
    return @

  drawLegend: ->
    d3.select('.pharma-transfers-container').select('.legend').selectAll('li')
      .data [25,50,75, 100]
      .enter().append('li')
        .style 'background', (d) => @color d
        .html (d) -> d+'%'

  # Scale methods
  # ------------

  setScales: ->
    # set x scale
    @x = d3.scaleLinear()
      .range @getScaleXRange()
    # set size scale if options.key.size is defined
    if @options.key.size
      @size = d3.scalePow()
        .exponent(0.5)
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
      .tickSize 0
      .tickValues []
    return @
    
  getScaleXDomain: =>
    return [0, 100]

  getSizeRange: =>
    return [@options.dotMinSize, @options.dotMaxSize]

  getSizeDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.size])]

  getColorDomain: =>
    return [100, 0]

  setXAxisPosition: (selection) =>
    selection.attr 'transform', 'translate(0,'+@height*.5+')'

  drawScales: ->
    # set scales domains
    @x.domain @getScaleXDomain()
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
    return @

  getDimensions: ->
    if @$el
      @containerWidth  = @$el.width()
      @containerHeight = 140
      @width           = @containerWidth - @options.margin.left - @options.margin.right
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  # mouse events
  onMouseOver: (d) =>
    element = d3.select(d3.event.target.parentNode).select('circle')
    # Set tooltip content
    @setTooltipData d
    # Set tooltip position
    @$tooltip.css
      left:    +element.attr('cx') + @options.margin.left + @$el.offset().left - (@$tooltip.width() * 0.5)
      top:     +element.attr('cy') + @options.margin.top + @$el.offset().top - @$tooltip.height() - element.attr('r') - 5
      opacity: 1

  onMouseOut: (d) =>
    @$tooltip.css 'opacity', '0'

  setTooltipData: (d) =>
    @$tooltip
      .find '.tooltip-inner .title'
      .html d.data[@options.key.id]
    @$tooltip
      .find '.tooltip-inner .value'
      .html Math.round(d.data.value)+'%'
    @$tooltip
      .find '.tooltip-inner .total'
      .html d.data.size
    if d.data.subsidiaries
      @$tooltip
        .find '.tooltip-inner .subsidiaries'
        .html d.data.subsidiaries
      @$tooltip.find('.tooltip-inner .subsidiaries-cont').show()
    else
      @$tooltip.find('.tooltip-inner .subsidiaries-cont').hide()
