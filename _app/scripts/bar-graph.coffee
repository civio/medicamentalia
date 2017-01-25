class window.BarGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Bar Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => d.value = +d.value
    return data

  setScales: ->
    # set x scale
    @x = d3.scaleBand()
      .range @getScaleXRange()
      .paddingInner(0.1)
      .paddingOuter(0)
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # set x axis
    @xAxis = d3.axisBottom(@x)
    return @

  getScaleXDomain: =>
    return @data.map (d) => d[@options.key.x]

  getScaleYDomain: =>
    return [0, d3.max(@data, (d) => d[@options.key.y])]

  setGraph: ->
    # draw bars
    @container.selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar active' else 'bar'
      .attr 'id',    (d) => d[@options.key.id]
      .call @setBarDimensions
    # draw labels
    if @options.label
      @container.selectAll('.bar-label')
        .data(@data)
      .enter().append('text')
        .attr 'class', 'bar-label'
        .attr 'id',    (d) => d[@options.key.id]
        .attr 'dy',    '1.5em'
        .text (d) => parseInt d[@options.key.y]
        .call @setBarLabelDimensions
    return @

  updateGraphDimensions: ->
    super()
    # update graph dimensions
    @container.selectAll('.bar')
      .call @setBarDimensions
    @container.selectAll('.bar-label')
      .call @setBarLabelDimensions
    return @

  setBarDimensions: (element) =>
    element
      .attr 'x',      (d) => @x(d[@options.key.x])
      .attr 'y',      (d) => @y(d[@options.key.y])
      .attr 'height', (d) => @height - @y(d[@options.key.y])
      .attr 'width',  @x.bandwidth()

  setBarLabelDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @y(d[@options.key.y])

# BarGraph = (_id, _source) ->
#   $ = jQuery.noConflict()
#   that = this
#   that.id = _id
#   that.source = _source
#   that.margin =
#     top: 0
#     right: 0
#     bottom: 20
#     left: 0
#   that.aspectRatio = 0.5625
#   that.markers = []
#   # Public Methods

#   that.init = ->
#     console.log 'Bar Graph init', that.id, that.source
#     that.$el = $('#' + that.id)
#     that.lang = that.$el.data('lang')
#     that.getDimensions()
#     that.x = d3.scaleBand().range([
#       0
#       that.width
#     ]).paddingInner(0.1).paddingOuter(0)
#     that.y = d3.scaleLinear().range([
#       that.height
#       0
#     ])
#     that.svg = d3.select('#' + that.id).append('svg').attr('id', that.id + '-svg').attr('width', that.widthCont).attr('height', that.heightCont)
#     that.container = that.svg.append('g').attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')')
#     # Load CSV
#     if that.source
#       d3.csv that.source, that.onDataReady
#     that

#   that.onDataReady = (error, data) ->
#     data.forEach (d) ->
#       d.value = +d.value
#       return
#     that.x.domain data.map((d) ->
#       d.label
#     )
#     that.y.domain [
#       0
#       d3.max(data, (d) ->
#         d.value
#       )
#     ]
#     that.container.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + that.height + ')').call d3.axisBottom(that.x)
#     drawMarkers()
#     drawBars data
#     drawLabels data
#     return

#   that.onResize = ->
#     that.getDimensions()
#     that.updateData()
#     that

#   that.updateData = ->
#     that.svg.attr('width', that.widthCont).attr 'height', that.heightCont
#     that.x.range [
#       0
#       that.width
#     ]
#     that.y.range [
#       that.height
#       0
#     ]
#     that.container.select('g.x.axis').attr('transform', 'translate(0,' + that.height + ')').call d3.axisBottom(that.x)
#     that.container.selectAll('.bar').attr('x', (d) ->
#       that.x d.label
#     ).attr('y', (d) ->
#       that.y d.value
#     ).attr('width', that.x.bandwidth()).attr 'height', (d) ->
#       that.height - that.y(d.value)
#     that.container.selectAll('.bar-label').attr('x', (d) ->
#       that.x(d.label) + that.x.bandwidth() * 0.5
#     ).attr 'y', (d) ->
#       that.y d.value
#     # Update each marker register with addMarker
#     that.markers.forEach updateMarker
#     return

#   that.addMarker = (marker) ->
#     that.markers.push
#       value: marker.value
#       label: marker.label or ''
#       orientation: marker.orientation or 'horizontal'
#       align: marker.align or 'right'
#     return

#   that.getDimensions = ->
#     that.widthCont = that.$el.width()
#     that.heightCont = that.widthCont * that.aspectRatio
#     that.width = that.widthCont - (that.margin.left) - (that.margin.right)
#     that.height = that.heightCont - (that.margin.top) - (that.margin.bottom)
#   #   return

  # drawMarkers = ->
  #   # Draw marker line
  #   that.container.selectAll('.marker').data(that.markers).enter().append('line').attr('class', 'marker').call setupMarkerLine
  #   # Draw marker label
  #   that.container.selectAll('.marker-label').data(that.markers).enter().append('g').attr('class', 'marker-label').append('text').style('text-anchor', (d) ->
  #     if d.orientation == 'vertical' then 'middle' else if d.alignment == 'right' then 'end' else 'start'
  #   ).text((d) ->
  #     d.label
  #   ).call setupMarkerLabel
  #   return

  # drawBars = (data) ->
  #   that.container.selectAll('.bar').data(data).enter().append('rect').attr('class', (d) ->
  #     if d.active then 'bar active' else 'bar'
  #   ).attr('id', (d) ->
  #     d.label
  #   ).attr('x', (d) ->
  #     that.x d.label
  #   ).attr('y', (d) ->
  #     that.y d.value
  #   ).attr('height', (d) ->
  #     that.height - that.y(d.value)
  #   ).attr 'width', that.x.bandwidth()
  #   return

  # drawLabels = (data) ->
  #   that.container.selectAll('.bar-label').data(data).enter().append('text').attr('class', 'bar-label').attr('id', (d) ->
  #     d.label
  #   ).attr('x', (d) ->
  #     that.x(d.label) + that.x.bandwidth() * 0.5
  #   ).attr('y', (d) ->
  #     that.y d.value
  #   ).attr('dy', '1.5em').text (d) ->
  #     parseInt d.value
  #   return

  # updateMarker = (marker) ->
  #   # Update marker line
  #   that.container.select('.marker').call setupMarkerLine
  #   # Update marker label
  #   that.container.select('.marker-label text').call setupMarkerLabel
  #   return

  # setupMarkerLine = (element) ->
  #   element.attr('x1', (d) ->
  #     if d.orientation == 'horizontal' then that.x(d.value) else 0
  #   ).attr('y1', (d) ->
  #     if d.orientation == 'horizontal' then 0 else that.y(d.value)
  #   ).attr('x2', (d) ->
  #     if d.orientation == 'horizontal' then that.x(d.value) else that.width
  #   ).attr 'y2', (d) ->
  #     if d.orientation == 'horizontal' then that.height else that.y(d.value)
  #   return

  # setupMarkerLabel = (element) ->
  #   element.attr('x', (d) ->
  #     if d.orientation == 'horizontal' then that.x(d.value) else that.width
  #   ).attr 'y', (d) ->
  #     if d.orientation == 'horizontal' then that.height else that.y(d.value)
  #   return

  # that
