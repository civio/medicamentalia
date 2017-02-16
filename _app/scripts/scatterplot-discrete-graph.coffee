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
    data.forEach (d) =>
      d[@options.key.y] = +d[@options.key.y]
    return data

  setScales: ->
    # set x scale
    @x = d3.scalePoint()
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
      @size = d3.scaleLinear()
        .range @getSizeRange()
    # setup axis
    @xAxis = d3.axisBottom(@x)
      .tickSize @height
    @yAxis = d3.axisLeft(@y)
      .tickSize @width
    return @

  getScaleXDomain: =>
    return @data.map (d) => d[@options.key.x]
    