class window.ScatterplotVPHGraph extends window.ScatterplotGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Graph', id, options
    options.dotSize = 7
    options.dotMinSize = 3
    options.dotMaxSize = 18
    super id, options
    return @


  # Main methods
  # ------------

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
      .tickValues [1025, 4035, 12475]
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
      .tickValues [0, 15, 30, 45, 60, 75, 90]
    return @

  getScaleXDomain: =>
    return [200, 101000]

  getScaleYDomain: =>
    return [0, 100]

  getDotFill: (d) =>
    return if d[@options.key.color] == '1' then '#00797D' else if d[@options.key.color] == '0' then '#D64B05' else '#aaa'       

  drawGraph: ->
    # draw points
    super()
    @ringNote = d3.ringNote()
    @setAnnotations()
    @setXLegend()
    return @

  setXLegend: ->
    incomeGroups = [
      {
        min: @x.domain()[0]
        max: 1025
        label: 'Low income'
      },
      {
        min: 1026
        max: 4035
        label: 'Lower-middle income'
      },
      {
        min: 4036
        max: 12475
        label: 'Upper-middle income'
      },
      {
        min: 12476
        max: @x.domain()[1]
        label: 'High income'
      },
    ]
    ###
    @container.selectAll('.lenged-x')

    @container.selectAll('.dot-label')
      .data incomeGroups
    .enter().append('text')
      .attr 'class', 'dot-label'
      .attr 'id', @getDotLabelId
      .attr 'dx', '0.75em'
      .attr 'dy', '0.375em'
      .text @getDotLabelText
      .call @setDotLabelsDimensions
    ###

  setAnnotations: ->
    annotations = [
      {
        "cx": 0.2*@height
        "cy": 0.25*@height
        "r": 0.2*@height
        "text": "Los países con más muertes por VPH son también los más pobres y no disponen de vacuna"
        "textWidth": 0.35*@width
        "textOffset": [0.25*@height, 0]
      },
      {
        "cx": @width - 0.4*@height
        "cy": @height - 0.1*@height
        "r": 0.16*@height
        "text": "Gran parte de los países que disponen de vacuna son países ricos con una baja incidencia de VPH"
        "textWidth": 0.35*@width
        "textOffset": [0, -0.2*@height]
      }
    ]
    @container.call @ringNote, annotations

  updateGraphDimensions: ->
    super()
    @setAnnotations()
    return @

  setTooltipData: (d) =>
    formatFloat = d3.format(',.1f')
    @$tooltip
      .find '.vaccine span'
      .css 'display', 'none'
    @$tooltip
      .find '.vaccine-'+d[@options.key.color]
      .css 'display', 'block'
    @$tooltip
      .find '.tooltip-inner .title'
      .html d[@options.key.id]
    @$tooltip
      .find '.tooltip-inner .value-y'
      .html formatFloat(d[@options.key.y])
    