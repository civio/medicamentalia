class window.ContraceptivesUseMapGraph extends window.MapGraph

  currentState = 0


  # override getDimensions
  getDimensions: ->
    offset = 100
    if @$el
      bodyHeight = $('body').height()-offset
      @containerWidth  = @$el.width()
      @containerHeight = @containerWidth * @options.aspectRatio
      # avoid graph height overflow browser height 
      if @containerHeight > bodyHeight
        @containerHeight = bodyHeight
        @containerWidth = @containerHeight / @options.aspectRatio
        #@$el.css 'top', 0
      # vertical center graph
      #else
      #  @$el.css 'top', (bodyHeight-@containerHeight) / 2
      @width  = @containerWidth - @options.margin.left - @options.margin.right
      @height = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  # override color domain
  setColorDomain: ->
    @color.domain [0, 80]
    return @


  ###
  # override color scale
  @color = d3.scaleOrdinal d3.schemeCategory20
  # override setCountryColor
  @setCountryColor = (d) ->
    value = @data.filter (e) -> e.code_num == d.id
    if value[0]
      #console.log @color
      console.log value[0].values[0].id, value[0].values[0].name, @color(value[0].values[0].id)
    return if value[0] then @color(value[0].values[0].id) else '#eee'
  #@formatFloat = @formatInteger
  #@getLegendData = -> [0,2,4,6,8]
  @setTooltipData = (d) ->
    @$tooltip
      .find '.tooltip-inner .title'
      .html d.name
    @$tooltip
      .find '.description'
      #.html d.values[0].name+' ('+d.values[0].value+'%)'
      .html d.value+'%'
  ###


  setMapState: (state) ->
    if state != @currentState
      #console.log 'set state '+state
      @currentState = state
      if state == 1
        @data.forEach (d) -> d.value = +d['Female sterilization']
      else if state == 2
        @data.forEach (d) -> d.value = +d['IUD']
      else if state == 3
        @data.forEach (d) -> d.value = +d['Pill']
      else if state == 4
        @data.forEach (d) -> d.value = +d['Male condom']
      else if state == 5
        @data.forEach (d) -> d.value = +d['Injectable']
      else if state == 6
        @data.forEach (d) -> d.value = +d['Any traditional method']
      @updateGraph @data
