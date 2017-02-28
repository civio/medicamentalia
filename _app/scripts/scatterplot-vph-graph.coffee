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
        'text': if @lang == 'es' then 'Los países con más muertes por cáncer de cérvix son también los más pobres y no habían incluido la vacuna en 2015' else 'Countries with highest mortality from cervical cancer are also the poorest and had not introduced the vaccine by 2015'
        'textWidth': 0.38*@width
        'textOffset': [0.25*@height, 0]
      },
      {
        'cx': 0.28*@height
        'cy': 0.46*@height
        'r': 0.072*@height
        'text': if @lang == 'es' then 'Sólo unos pocos países de rentas bajas incluyeron la vacuna en sus programas, gracias a la ayuda externa de GAVI' else 'Only a few low-income countries had introduced the vaccine in their programmes, thanks to GAVI\'s external assistance'
        'textWidth': 0.36*@width
        'textOffset': [0.18*@height, 0]
      },
      {
        'cx': @width - 0.35*@height
        'cy': @height - 0.12*@height
        'r': 0.15*@height
        'text': if @lang == 'es' then 'Gran parte de los países que cuentan con la vacuna en sus programas son países ricos con una baja mortalidad por cáncer de cérvix' else 'Most countries that have the vaccine in their programmes are rich countries with low mortality from cervical cancer'
        'textWidth': 0.38*@width
        'textOffset': [0, -0.2*@height]
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
      .css 'display', 'inline'
    @$tooltip
      .find '.tooltip-inner .title'
      .html d[@options.key.id]
    @$tooltip
      .find '.tooltip-inner .value-y'
      .html formatFloat(d[@options.key.y])
    