class window.IcebergGraph extends window.BarGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    console.log 'Iceberg Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.up] = +d[@options.key.up]
      d[@options.key.down] = +d[@options.key.down]
      d.total = d[@options.key.up] + d[@options.key.down]
    return data

  getScaleYRange: ->
    return [0, @height]

  getScaleYDomain: =>
    console.log [0, d3.max(@data, (d) => d.total)]
    return [0, d3.max(@data, (d) => d.total)]

  drawGraph: ->
    console.table @data

    @upMax = d3.max @data, (d) => d[@options.key.up]

    # add containers up & down
    @container.append('g')
      .attr 'class', 'bars-up'
    @container.append('g')
      .attr 'class', 'bars-down'

    # draw bars up
    @container.select('.bars-up').selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar bar-up active' else 'bar bar-up'
      #.attr 'id',    (d) => d[@options.key.id]
      .call @setBarUpDimensions

    # draw bars down
    @container.select('.bars-down').selectAll('.bar')
      .data(@data)
    .enter().append('rect')
      .attr 'class', (d) -> if d.active then 'bar bar-down active' else 'bar bar-down'
      #.attr 'id',    (d) => d[@options.key.id]
      .call @setBarDownDimensions

    # if @options.mouseEvents
    #   @container.selectAll('.bar')
    #     .on   'mouseover', @onMouseOver
    #     .on   'mouseout', @onMouseOut

    if @options.label
      # draw labels x
      @container.selectAll('.bar-label-x')
        .data(@data)
      .enter().append('text')
        .attr 'class', (d) -> if d.active then 'bar-label-x active' else 'bar-label-x'
        #.attr 'id',    (d) => 'bar-label-x-'+d[@options.key.id]
        .attr 'dy',    '-0.5em'
        .text (d) => d[@options.key.x]
        .call @setBarLabelXDimensions
      # draw labels y
      @container.selectAll('.bar-label-y')
        .data(@options.label.y)
      .enter().append('text')
        .attr 'class', 'bar-label-y'
        .attr 'id',    (d,i) -> if i == 0 then 'bar-label-y-up' else 'bar-label-y-down'
        .attr 'dy',    (d,i) -> if i == 0 then '-.5em' else '1.25em'
        .attr 'x',     -@options.margin.left
        .text (d) => d
        .call @setBarLabelYDimensions
      # draw middle line
      @container.append('rect')
        .attr 'class',  'middle-line'
        .attr 'x',      -@options.margin.left
        .attr 'y',      (d) => @y @upMax
        .attr 'height', 1
        .call @setMiddleLinePosition
    return @

  updateGraphDimensions: ->
    super()
    # update graph dimensions
    @container.selectAll('.bar-up')
      .call @setBarUpDimensions
    @container.selectAll('.bar-down')
      .call @setBarDownDimensions
    if @options.label
      @container.select('.middle-line')
        .call @setMiddleLinePosition
    return @

  setBarDimensions: (element) =>
    return

  setBarUpDimensions: (element) =>
    element
      .attr 'x',      (d) => @x d[@options.key.x]
      .attr 'y',      (d) => @y @upMax-d[@options.key.up]
      .attr 'height', (d) => @y d[@options.key.up]
      .attr 'width',  @x.bandwidth()

  setBarDownDimensions: (element) =>
    element
      .attr 'x',      (d) => @x d[@options.key.x]
      .attr 'y',      (d) => @y @upMax
      .attr 'height', (d) => @y d[@options.key.down]
      .attr 'width',  @x.bandwidth()

  setBarLabelXDimensions: (element) =>
    element
      .attr 'x', (d) => @x(d[@options.key.x]) + @x.bandwidth() * 0.5
      .attr 'y', (d) => @y @upMax-d[@options.key.up]

  setBarLabelYDimensions: (element) =>
    element.attr 'y', (d) => @y @upMax

  setMiddleLinePosition: (element) =>
    element
      .attr 'y',      (d) => @y @upMax
      .attr 'width',  @width+@options.margin.left+@options.margin.right

  onMouseOver: (d) =>
    @container.select('#bar-label-x-'+d[@options.key.id])
      .classed 'active', true
    @container.select('#bar-label-y-'+d[@options.key.id])
      .classed 'active', true

  onMouseOut: (d) =>
    unless d.active
      @container.select('#bar-label-x-'+d[@options.key.id])
        .classed 'active', false
      @container.select('#bar-label-y-'+d[@options.key.id])
        .classed 'active', false
    