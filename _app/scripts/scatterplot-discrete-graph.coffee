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
    return data

  setScales: ->
    # set scales
    @x = d3.scaleLinear()
    @y = d3.scalePoint()
    # setup axis
    @xAxis = d3.axisBottom(@x)
    @yAxis = d3.axisLeft(@y)
    return @

  drawScales: ->
    # set y scale domain
    @y.domain @getScaleYDomain()
    # get dimensions
    @getDimensions()
    @svg.attr 'height', @containerHeight
    # set x scale
    @x.range @getScaleXRange()
    # set y scale range
    @y.range @getScaleYRange()
    # set color scale if options.key.color is defined
    if @options.key.color
      @color = d3.scaleOrdinal()
        .range @getColorRange()
    # set size scale if options.key.size is defined
    if @options.key.size
      @size = d3.scaleLinear()
        .range @getSizeRange()
    # setup axis
    @xAxis.tickSize @height
    @yAxis.tickSize @width
    super()
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
    @drawLegend()
    return @

  drawLegend: ->
    vaccines = d3.nest()
      .key (d) -> d.vaccine
      .entries @data
    d3.select('#vaccine-prices-graph-legend ul').selectAll('li')
      .data(vaccines)
    .enter().append('li')
      .attr 'id', (d) -> 'legend-item-'+d.key
      .style 'background', (d) => @color d.key
      .html (d) -> d.key
      .on 'mouseover', (d) => @highlightVaccines d.key
      .on 'mouseout', @onMouseOut

  getDimensions: ->
    if @$el
      @containerWidth  = @$el.width()
      @width           = @containerWidth - @options.margin.left - @options.margin.right
      if @y
        @containerHeight = @y.domain().length * 30
        @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  updateGraphDimensions: ->
    super()
    # update lines size
    @container.selectAll('.dot-line')
      .call @setDotLinesDimensions
    return @

  setXAxisPosition: (selection) =>
    selection.attr 'transform', 'translate(0,0)'

  getDotId: (d) =>
    return 'dot-'+d[@options.key.id]+'-'+d[@options.key.color]
  
  getDotLabelId: (d) =>
    return 'dot-label-'+d[@options.key.id]+'-'+d[@options.key.color]

  getDotLineId: (d) =>
    return 'dot-line-'+d[@options.key.id]

  getDotLabelText: (d) -> 
    return ''

  getScaleYDomain: =>
    return @data.map (d) => d[@options.key.y]

  setDotLinesDimensions: (element) =>
    element
      .attr 'x1', (d) => 0
      .attr 'y1', (d) => @y d[@options.key.y]
      .attr 'x2', (d) => @x d[@options.key.x]
      .attr 'y2', (d) => @y d[@options.key.y]

  # mouse events
  onMouseOver: (d) =>
    super(d)
    @highlightVaccines d3.select(d3.event.target).data()[0][@options.key.color]

  onMouseOut: (d) =>
    super(d)
    @container.selectAll('.dot')
      .classed 'inactive', false
      .classed 'active', false
    @container.selectAll('.dot-line')
      .style 'opacity', 0
    d3.selectAll('#vaccine-prices-graph-legend li')
      .classed 'inactive', false

  highlightVaccines: (vaccine) ->
    @container.selectAll('.dot')
      .classed 'inactive', true
    @container.selectAll('.dot')
      .filter (d) => return d[@options.key.color] == vaccine
      .classed 'inactive', false
      .classed 'active', true
    @container.selectAll('.dot-line')
      .filter (d) => return d[@options.key.color] == vaccine
      .style 'opacity', 1
    # set selected dots on top
    @container.selectAll('.dot')
      .sort (a,b) => if a[@options.key.color] == vaccine then 1 else -1
    # set legend
    d3.selectAll('#vaccine-prices-graph-legend li')
      .classed 'inactive', true
    d3.select('#vaccine-prices-graph-legend #legend-item-'+vaccine)
      .classed 'inactive', false


  setTooltipData: (d) ->
    dosesFormat = d3.format('.0s')
    @$tooltip
      .find '.tooltip-inner .title'
      .html d.name
    @$tooltip
      .find '.tooltip-inner .vaccine'
      .html d.vaccine
    @$tooltip
      .find '.tooltip-inner .price'
      .html d.price
    company = ''
    if d.company
      company = '('+d.company
      if d.company2
        company += ','+d.company2
      if d.company3
        company += ','+d.company3
      company += ')'
    @$tooltip
      .find '.tooltip-inner .company'
      .html company
    