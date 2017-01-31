class window.BaseGraph

  optionsDefault = 
    margin:
      top: 0
      right: 0
      bottom: 20
      left: 0
    aspectRatio: 0.5625
    label: false           # show/hide labels
    legend: false          # show/hide legend
    mouseEvents: true      # add/remove mouse event listeners
    key:
      id: 'key'
      x:  'key'            # name for x column
      y:  'value'          # name for y column

  markerDefault =
    value: null
    label: ''
    orientation: 'horizontal'
    align:'right'
 

  # Constructor
  # -----------

  constructor: (id, options) ->
    @id       = id
    @options  = $.extend true, optionsDefault, options  # merge optionsDefault & options
    @$el      = $('#'+@id)
    @getDimensions()
    @setSVG()
    @setScales()
    @markers = []
    return @


  # Main methods
  # ------------

  setSVG: ->
    @svg = d3.select('#'+@id).append('svg')
      .attr 'width', @containerWidth
      .attr 'height', @containerHeight
    @container = @svg.append('g')
      .attr 'transform', 'translate(' + @options.margin.left + ',' + @options.margin.top + ')'

  loadData: (url) ->
    d3.csv url, (error, data) =>
      @$el.trigger 'data-loaded'
      @setData data
    return @
    
  setData: (data) ->
    @data = @dataParser(data)
    @drawScales()
    if @options.legend
      @drawLegend()
    @drawMarkers()
    @drawGraph()
    @$el.trigger 'draw-complete'
    return @

  # to overdrive
  dataParser: (data) ->
    return data
  
  # to overdrive
  setGraph: ->
    return @


  # Scale methods
  # ------------

  # to overdrive
  setScales: ->
    return @

  drawScales: ->
    # set scales domains
    @x.domain @getScaleXDomain()
    @y.domain @getScaleYDomain()
    # set x axis
    if @xAxis
      @container.append('g')
        .attr 'class', 'x axis'
        .attr 'transform', 'translate('+@options.margin.left+','+(@options.margin.top+@height)+')'
        .call @xAxis
    # set y axis
    if @yAxis
      @container.append('g')
        .attr 'class', 'y axis'
        .attr 'transform', 'translate('+@width+' ,'+@options.margin.top+')'
        .call @yAxis
    return @

  # to overdrive
  getScaleXRange: ->
    return [0, @width]

  # to overdrive
  getScaleYRange: ->
    return [@height, 0]

  # to overdrive
  getScaleXDomain: ->
    return []

  # to overdrive
  getScaleYDomain: ->
    return []

  # to overdrive
  drawLegend: ->
    return @


  # Marker methods
  # -------------

  addMarker: (marker) ->
    @markers.push $.extend {}, markerDefault, marker
    return @

  drawMarkers: -> 
    # Draw marker line
    @container.selectAll('.marker')
      .data(@markers)
    .enter().append('line')
      .attr 'class', 'marker'
      .call @setupMarkerLine
    # Draw marker label
    @container.selectAll('.marker-label')
      .data(@markers)
    .enter().append('text')
      .attr 'class', 'marker-label'
      .attr 'text-anchor', (d) -> if d.orientation == 'vertical' then 'middle' else if d.align == 'right' then 'end' else 'start'
      .attr 'dy', (d) -> if d.orientation == 'horizontal' then '-0.25em' else 0
      .text (d) -> d.label
      .call @setupMarkerLabel

  setupMarkerLine: (element) =>
    element
      .attr 'x1', (d) => if d.orientation == 'horizontal' then 0 else @x(d.value)
      .attr 'y1', (d) => if d.orientation == 'horizontal' then @y(d.value) else 0
      .attr 'x2', (d) => if d.orientation == 'horizontal' then @width else @x(d.value) 
      .attr 'y2', (d) => if d.orientation == 'horizontal' then @y(d.value) else @height 

  setupMarkerLabel: (element) =>
    element
      .attr 'x', (d) => if d.orientation == 'horizontal' then (if d.align == 'right' then @width else 0 ) else @x(d.value) 
      .attr 'y', (d) => if d.orientation == 'horizontal' then @y(d.value) else @height   


  # Resize methods
  # ------------

  onResize: =>
    @getDimensions()
    @updateGraphDimensions()
    return @

  getDimensions: ->
    if @$el
      @containerWidth  = @$el.width()
      @containerHeight = @containerWidth * @options.aspectRatio
      @width           = @containerWidth - @options.margin.left - @options.margin.right
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  # to overdrive
  updateGraphDimensions: ->
    # update svg dimension
    @svg
      .attr 'width',  @containerWidth
      .attr 'height', @containerHeight
    # update scales dimensions
    if @x
      @x.range @getScaleXRange()
    if @y
      @y.range @getScaleYRange()
    # update axis dimensions
    if @xAxis
      @container.selectAll('.x.axis')
        .attr 'transform', 'translate('+@options.margin.left+','+(@options.margin.top+@height)+')'
        .call @xAxis
    if @yAxis
      @container.selectAll('.y.axis')
        .attr 'transform', 'translate('+@width+' ,'+@options.margin.top+')'
        .call @yAxis
    # update markers
    @container.select('.marker')
      .call @setupMarkerLine
    @container.select('.marker-label')
      .call @setupMarkerLabel
    return @


    # Auxiliar methods
    # ----------------

    getDataX: ->
      return d[@options.key.x]

    getDataY: ->
      return d[@options.key.y]