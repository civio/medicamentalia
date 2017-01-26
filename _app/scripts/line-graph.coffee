class window.LineGraph extends window.BaseGraph

  activeLines: []

  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Line Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  setData: (data) ->
    @years = @getYears data
    super(data)
    return @

  getYears: (data) ->
    years = []
    d3.keys(data[0]).forEach (d) ->
      if +d
        years.push +d
    return years.sort()

  dataParser: (data) ->
    data.forEach (d) => 
      d.values = {}
      @years.forEach (year) =>
        if d[year]
          d.values[year] = +d[year]
        #else
        #  console.log('No hay datos de para', d[@options.key.x], 'en ', year);
        delete d[year]
    return data

  setScales: ->
    # set x scale
    @x = d3.scaleLinear()
      .range @getScaleXRange()
    # set y scale
    @y = d3.scaleLinear()
      .range @getScaleYRange()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickFormat d3.format('')
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    # setup line
    @line = d3.line()
      .curve d3.curveCatmullRom
      .x (d) => @x(+d.key)
      .y (d) => @y(d.value)
    # setup area
    if @options.isArea
      @area = d3.area()
        .curve d3.curveCatmullRom
        .x  (d) => @x(+d.key)
        .y0 @height
        .y1 (d) => @y(d.value)
    return @

  getScaleXDomain: =>
    return [@years[0], @years[@years.length-1]]

  getScaleYDomain: ->
    return [0, d3.max @data, (d) -> d3.max(d3.values(d.values))]

  setGraph: ->
    # clear graph before setup
    @container.select('.graph').remove()
    # draw graph container 
    graph = @container.append('g')
      .attr 'class', 'graph'
    # draw lines
    graph.selectAll('.line')
      .data(@data)
    .enter().append('path')
      .attr 'class', (d) => if @activeLines.indexOf(d[@options.key.x]) == -1 then 'line' else 'line active'
      .attr 'id',    (d) => 'line-' + d[@options.key.id]
      .datum (d) -> return d3.entries(d.values)
      .attr 'd', @line
    # draw area
    if @options.isArea
      graph.selectAll('.area')
        .data(@data)
      .enter().append('path')
        .attr  'class', (d) => if @activeLines.indexOf(d[@options.key.x]) == -1 then 'area' else 'area active'
        .attr  'id',    (d) => 'area-' + d[@options.key.id]
        .datum (d) -> d3.entries(d.values)
        .attr 'd', @area
    # draw labels
    if @options.label
      graph.selectAll('.line-label')
        .data(@data)
      .enter().append('text')
        .attr 'class', 'line-label'
        .attr 'id',    (d) => 'line-label-'+d[@options.key.id]
        .attr 'text-anchor', 'end'
        .attr 'dy', '-0.125em'
        .text (d) => d[@options.key.x]
        .call @setLabelDimensions
    return @

  setLabelDimensions: (element) =>
    element
      .attr 'x', @width
      .attr 'y', (d) => @y(d.values[@years[@years.length-1]])


# LineGraph = ->
#   $ = jQuery.noConflict()
#   that = this
#   data = undefined
#   currentData = undefined
#   that.margin =
#     top: 0
#     right: 0
#     bottom: 20
#     left: 0
#   that.aspectRatio = 0.5625
#   that.markers = []
#   that.activeLines = []

#   that.setup = (_id) ->
#     that.id = _id
#     that.$el = $('#' + that.id)
#     that.lang = that.$el.data('lang')
#     that.getDimensions()
#     # Setup scales
#     that.x = d3.scaleLinear().range([
#       0
#       that.width
#     ])
#     that.y = d3.scaleLinear().range([
#       that.height
#       0
#     ])
#     # Setup axis
#     that.xAxis = d3.axisBottom(that.x).tickFormat(d3.format(''))
#     that.yAxis = d3.axisLeft(that.y).tickSize(that.width)
#     # Setup line
#     that.line = d3.line().curve(d3.curveCatmullRom).x((d) ->
#       that.x +d.key
#     ).y((d) ->
#       that.y d.value
#     )
#     # Setup area
#     if that.isArea
#       that.area = d3.area().curve(d3.curveCatmullRom).x((d) ->
#         that.x +d.key
#       ).y0(that.height).y1((d) ->
#         that.y d.value
#       )
#     # Create svg
#     that.svg = d3.select('#' + that.id).append('svg').attr('id', that.id + '-svg').attr('width', that.widthCont).attr('height', that.heightCont)
#     that.container = that.svg.append('g').attr('transform', 'translate(' + that.margin.left + ',' + that.margin.top + ')')
#     return

#   # Load CSV data

#   that.loadData = (_source) ->
#     d3.csv _source, (error, _data) ->
#       that.setData _data
#       return
#     that

#   # Set data

#   that.setData = (_data) ->
#     that.years = that.getYears(_data)
#     data = that.dataParser(_data)
#     that.updateData()
#     that.setGraph()
#     that

#   that.updateData = ->
#     # Filter data (that.dataFilter function must be defined outside)
#     currentData = if that.dataFilter then data.filter(that.dataFilter) else data
#     # Sort data (that.dataSort function must be defined outside)
#     if that.dataSort
#       currentData = currentData.sort(that.dataSort)
#     that

#   that.update = ->
#     that.updateData()
#     that.updateGraph()
#     that

#   that.getYears = (_data) ->
#     years = []
#     d3.keys(_data[0]).forEach (d) ->
#       if +d
#         years.push +d
#       return
#     years.sort()

#   that.dataParser = (_data) ->
#     _data.forEach (d) ->
#       d.values = {}
#       that.years.forEach (year) ->
#         if d[year]
#           d.values[year] = +d[year]
#         else
#           #console.log('No hay datos de para', d.name, 'en ', year);
#         delete d[year]
#         return
#       return
#     _data

#   that.setGraph = ->
#     # Set scales domain
#     that.x.domain that.getScaleXDomain()
#     that.y.domain that.getScaleYDomain()
#     # Draw axis
#     that.container.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + that.height + ')').call that.xAxis
#     that.container.append('g').attr('class', 'y axis').attr('transform', 'translate(' + that.width + ', 0)').call that.yAxis
#     # Draw lines & labels
#     drawMarkers()
#     drawLines()
#     drawLabels()
#     that

#   that.updateGraph = ->
#     that.svg.select('.lines').remove()
#     drawMarkers()
#     drawLines()
#     drawLabels()
#     that

#   that.onResize = ->
#     that.getDimensions()
#     updateGraphDimensions()
#     that

#   that.addMarker = (marker) ->
#     that.markers.push
#       value: marker.value
#       label: marker.label or ''
#       orientation: marker.orientation or 'horizontal'
#       align: marker.align or 'right'
#     return

#   that.getScaleXDomain = ->
#     [
#       that.years[0]
#       that.years[that.years.length - 1]
#     ]

#   that.getScaleYDomain = ->
#     [
#       0
#       d3.max(currentData, (d) ->
#         d3.max d3.values(d.values)
#       )
#     ]

#   that.getDimensions = ->
#     that.widthCont = that.$el.width()
#     that.heightCont = that.widthCont * that.aspectRatio
#     that.width = that.widthCont - (that.margin.left) - (that.margin.right)
#     that.height = that.heightCont - (that.margin.top) - (that.margin.bottom)
#     return

#   updateGraphDimensions = ->
#     # Setup scales
#     that.x.range [
#       0
#       that.width
#     ]
#     that.y.range [
#       that.height
#       0
#     ]
#     that.yAxis.tickSize that.width
#     # Setup axis
#     that.container.selectAll('.axis.x').attr('transform', 'translate(0,' + that.height + ')').call that.xAxis
#     that.container.selectAll('.axis.y').attr('transform', 'translate(' + that.width + ', 0)').call that.yAxis
#     # Setup graph
#     that.svg.attr('width', that.widthCont).attr 'height', that.heightCont
#     that.container.selectAll('.line').attr 'd', that.line
#     that.container.selectAll('.area').attr 'd', that.area
#     that.container.selectAll('.line-label').call setLabel
#     updateMarker()
#     return

#   drawMarkers = ->
#     # Draw marker line
#     that.container.selectAll('.marker').data(that.markers).enter().append('line').attr('class', 'marker').call setupMarkerLine
#     # Draw marker label
#     that.container.selectAll('.marker-label').data(that.markers).enter().append('text').attr('class', 'marker-label').style('text-anchor', (d) ->
#       if d.orientation == 'vertical' then 'middle' else if d.alignment == 'right' then 'end' else 'start'
#     ).text((d) ->
#       d.label
#     ).call setupMarkerLabel
#     return

#   drawLines = ->
#     # Draw lines
#     that.container.append('g').attr('class', 'lines').selectAll('.line').data(currentData).enter().append('path').attr('class', (d) ->
#       if that.activeLines.indexOf(d.code) == -1 then 'line' else 'line active'
#     ).attr('id', (d) ->
#       'line-' + d.code
#     ).datum((d) ->
#       d3.entries d.values
#     ).attr 'd', that.line
#     # Draw area
#     if that.isArea
#       that.container.append('g').attr('class', 'ares').selectAll('.area').data(currentData).enter().append('path').attr('class', (d) ->
#         if that.activeLines.indexOf(d.code) == -1 then 'area' else 'area active'
#       ).attr('id', (d) ->
#         'area-' + d.code
#       ).datum((d) ->
#         d3.entries d.values
#       ).attr 'd', that.area
#     return

#   drawLabels = ->
#     that.container.selectAll('.line-label').data(currentData).enter().append('text').attr('class', 'line-label').attr('id', (d) ->
#       'line-label-' + d.code
#     ).attr('text-anchor', 'end').attr('dy', '-0.125em').text((d) ->
#       d.name
#     ).call setLabel
#     return

#   updateMarker = (marker) ->
#     # Update marker line
#     that.container.select('.marker').call setupMarkerLine
#     # Update marker label
#     that.container.select('.marker-label').call setupMarkerLabel
#     return

#   setupMarkerLine = (element) ->
#     element.attr('x1', (d) ->
#       if d.orientation == 'horizontal' then 0 else that.x(d.value)
#     ).attr('y1', (d) ->
#       if d.orientation == 'horizontal' then that.y(d.value) else 0
#     ).attr('x2', (d) ->
#       if d.orientation == 'horizontal' then that.width else that.x(d.value)
#     ).attr 'y2', (d) ->
#       if d.orientation == 'horizontal' then that.y(d.value) else that.height
#     return

#   setupMarkerLabel = (element) ->
#     element.attr('x', (d) ->
#       if d.orientation == 'vertical' then that.x(d.value) else if d.alignment == 'right' then that.width else 0
#     ).attr 'y', (d) ->
#       if d.orientation == 'horizontal' then that.y(d.value) else that.height
#     return

#   setLabel = (selection) ->
#     selection.attr('x', that.width).attr 'y', (d) ->
#       that.y d.values['2015']
#     return
