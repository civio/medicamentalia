class window.ScatterplotUnmetNeedsGraph extends window.ScatterplotGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Graph', id, options
    options.dotSize = 7
    options.dotMinSize = 2
    options.dotMaxSize = 18
    #@lang = lang
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
      .tickValues [1000, 2000, 4000, 8000, 16000, 32000]
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
      .tickValues [0, 10, 20, 30, 40]
      .tickFormat (d) -> d+'%'
    return @

  getScaleXDomain: =>
    return [600, 35000]

  #getDotLabelText: (d) =>
  #  return if d.population > 10000000 then d[@options.key.id] else ''

  #getDotFill: (d) =>
  #  return if d[@options.key.color] == '1' then '#00797d' else if d[@options.key.color] == '0' then '#D64B05' else '#aaa'       

  ###
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

  updateGraphDimensions: ->
    super()
    @setAnnotations()
    return @
  ###

    