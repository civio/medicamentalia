class window.ScatterplotVPHGraph extends window.ScatterplotGraph


  # Constructor
  # -----------

  constructor: (id, lang, options) ->
    #console.log 'Scatterplot Graph', id, options
    options.dotSize = 7
    options.dotMinSize = 3
    options.dotMaxSize = 18
    @lang = lang
    super id, options
    return @


  # Main methods
  # ------------

  setScales: ->
    # set x scale
    @x = d3.scalePow()
      .exponent(0.125)
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
      .tickValues [1024, 4034, 12474]
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
      .tickValues [15, 30, 45, 60, 75, 90]
    return @

  getScaleXDomain: =>
    return [250, 102000]

  getScaleYDomain: =>
    return [0, 90]

  getDotFill: (d) =>
    return if d[@options.key.color] == '1' then '#00797d' else if d[@options.key.color] == '0' then '#D64B05' else '#aaa'       

  drawGraph: ->
    # draw points
    super()
    @ringNote = d3.ringNote()
    @setAnnotations()
    @setXLegend()
    return @

  setXLegend: ->
    incomeGroups = [@x.domain()[0], 1026, 4036, 12476, @x.domain()[1]]
    @$el.find('.x-legend li').each (i, el) =>
      val = 100 * (@x(incomeGroups[i+1]) - @x(incomeGroups[i])) / @width
      $(el).width val+'%'


  setAnnotations: ->
    annotations = [
      {
        'cx': 0.23*@height
        'cy': 0.17*@height
        'r': 0.22*@height
        'textWidth': 0.38*@width
        'textOffset': [0.25*@height, 0]
      },
      {
        'cx': 0.28*@height
        'cy': 0.46*@height
        'r': 0.072*@height
        'textWidth': 0.36*@width
        'textOffset': [0.18*@height, 0]
      },
      {
        'cx': @width - 0.35*@height
        'cy': @height - 0.12*@height
        'r': 0.15*@height
        'textWidth': 0.38*@width
        'textOffset': [0, -0.2*@height]
      }
    ]
    # get annotations texts from html
    $('#vaccine-vph-container-graph .mobile-pictures p').each (i, el) ->
      annotations[i].text = $(el).html()
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
      .css 'display', 'inline'
    @$tooltip
      .find '.tooltip-inner .title'
      .html d[@options.key.id]
    @$tooltip
      .find '.tooltip-inner .value-y'
      .html formatFloat(d[@options.key.y])
    