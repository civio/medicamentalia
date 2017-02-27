class window.ScatterplotGraph extends window.BaseGraph



  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Graph', id, options
    options.dotSize = options.dotSize || 7
    options.dotMinSize = options.dotMinSize || 7
    options.dotMaxSize = options.dotMaxSize || 12
    super id, options
    console.log @options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.x] = +d[@options.key.x]
      d[@options.key.y] = +d[@options.key.y]
    return data

  setSVG: ->
    super()
    @$tooltip = @$el.find '.tooltip'

  setScales: ->
    # set x scale
    @x = d3.scalePow()
      .exponent(0.25)
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
      @size = d3.scalePow()
        .exponent(0.5)
        .range @getSizeRange()
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

  getSizeRange: =>
    return [@options.dotMinSize, @options.dotMaxSize]

  getSizeDomain: =>
    console.log 'size domain', 0, d3.max(@data, (d) => d[@options.key.size])
    return [0, d3.max(@data, (d) => d[@options.key.size])]

  drawScales: ->
    super()
    # set color domain
    if @color
      @color.domain @getColorDomain()
    # set size domain
    if @size
      @size.domain @getSizeDomain()
    return @

  drawGraph: ->
    # draw points
    @container.selectAll('.dot')
      .data(@data)
    .enter().append('circle')
      .attr 'class', 'dot'
      .attr 'id', @getDotId
      .attr 'r', @getDotSize
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
    # add mouse events listeners if there's a tooltip
    if @$tooltip
      @container.selectAll('.dot')
        .on 'mouseover', @onMouseOver
        .on 'mouseout', @onMouseOut
    return @

  updateGraphDimensions: ->
    super()
    # update axis size
    @xAxis.tickSize @height
    @yAxis.tickSize @width
    # update dots positions
    @container.selectAll('.dot')
      .call @setDotsDimensions
    @container.selectAll('.dot-label')
      .call @setDotLabelsDimensions
    return @

  getDotId: (d) =>
    return 'dot-'+d[@options.key.id]

  getDotLabelId: (d) =>
    return 'dot-label-'+d[@options.key.id]

  getDotLabelText: (d) =>
    return d[@options.key.id]

  getDotSize: (d) =>
    if @size
      console.log d, d[@options.key.size], @options, @size.range(), @size.domain(), @size(d[@options.key.size])
      return @size d[@options.key.size]
    else
      return @options.dotSize

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

  # mouse events
  onMouseOver: (d) =>
    element = d3.select(d3.event.target)
    # Set tooltip content
    @setTooltipData d
    # Set tooltip position
    @$tooltip.css
      left:    +element.attr('cx') + @options.margin.left - (@$tooltip.width() * 0.5)
      top:     +element.attr('cy') + @options.margin.top - @$tooltip.height() - 15
      opacity: 1

  onMouseOut: (d) =>
    @$tooltip.css 'opacity', '0'

  setTooltipData: (d) =>
    @$tooltip
      .find '.tooltip-inner .title'
      .html d[@options.key.id]
    @$tooltip
      .find '.tooltip-inner .value-x'
      .html d[@options.key.x]
    @$tooltip
      .find '.tooltip-inner .value-y'
      .html d[@options.key.y]

    