class window.ContraceptivesUseMapGraph extends window.MapGraph

  currentState: 0

  states: [
    {
      id: 'Female sterilization'
      labels: [
        {
          cx_factor: 0.7
          cy_factor: 0.48
          r: 0
          textOffset: [-20, 30]
          text: 'India'
        },
        {
          cx_factor: 0.27
          cy_factor: 0.465
          r: 0
          textOffset: [20, -5]
          text: 'República Dominicana'
        }
      ]
    },
    {
      id: 'Male sterilization'
      labels: [
        {
          cx_factor: 0.463
          cy_factor: 0.263
          r: 0
          textOffset: [-20, 10]
          text: 'Reino Unido'
        }
      ]
    },
    {
      id: 'IUD'
      labels: ['Corea del Norte']
    },
    {
      id: 'Pill'
      labels: ['Argelia']
    },
    {
      id: 'Male condom'
      labels: ['Canada', 'Botswana']
    },
    {
      id: 'Injectable'
      labels: ['Etiopía']
    },
    {
      id: 'Any traditional method'
      labels: []
    },
    {
      id: 'Any traditional method'
      labels: ['Albania']
    }
  ]


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

  onResize: =>
    super()
    @setAnnotations()

  # override color domain
  setColorDomain: ->
    @color.domain [0, 80]
    return @

  drawGraph: (map) ->
    super(map)
    @ringNote = d3.ringNote()
    return @

  setMapState: (state) ->
    if state != @currentState
      #console.log 'set state '+state
      @currentState = state
      @currentMethod = @states[@currentState-1]
      @data.forEach (d) => d.value = +d[@currentMethod.id]
      @updateGraph @data
      @setAnnotations()

  setAnnotations: ->
    if @currentMethod
      @currentMethod.labels.forEach (d) => 
        d.cx = d.cx_factor*@width
        d.cy = d.cy_factor*@height
      @container.call @ringNote, @currentMethod.labels
