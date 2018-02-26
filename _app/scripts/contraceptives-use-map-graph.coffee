class window.ContraceptivesUseMapGraph extends window.MapGraph

  currentState: 0

  states: [
    {
      id: 'Female sterilization'
      text: 
        es: 'esterilización femenina'
        en: 'female sterilization'
      labels: [
        {
          cx_factor: 0.7
          cy_factor: 0.48
          r: 0
          textOffset: [-20, 30]
          label:
            es: 'India'
            en: 'India'
        },
        {
          cx_factor: 0.27
          cy_factor: 0.465
          r: 0
          textOffset: [20, -5]
          label:
            es: 'República Dominicana'
            en: 'Dominican Republic'
        }
      ]
    },
    {
      id: 'Male sterilization'
      text: 
        es: 'esterilización masculina'
        en: 'male sterilization'
      labels: [
        {
          cx_factor: 0.265
          cy_factor: 0.28
          r: 0
          textOffset: [30, 25]
          label:
            es: 'Canadá'
            en: 'Canada'
        }
      ]
    },
    {
      id: 'IUD'
      text: 
        es: 'DIU'
        en: 'IUD'
      labels: [
        {
          cx_factor: 0.85
          cy_factor: 0.32
          r: 0
          textWidth: 80
          textOffset: [12, 0]
          label:
            es: 'Corea del Norte'
            en: 'North Korea'
        }
      ]
    },
    {
      id: 'IUD'
      text: 
        es: 'DIU'
        en: 'IUD'
      labels: [
        {
          cx_factor: 0.84
          cy_factor: 0.41
          r: 0
          textWidth: 80
          textOffset: [12, 0]
          label:
            es: 'China'
            en: 'China'
        }
      ]
    },
    {
      id: 'Pill'
      text: 
        es: 'píldora'
        en: 'pill'
      labels: [
        {
          cx_factor: 0.464
          cy_factor: 0.41
          r: 0
          textOffset: [-35, 0]
          label:
            es: 'Argelia'
            en: 'Algeria'
        }
      ]
    },
    {
      id: 'Male condom'
      text: 
        es: 'preservativo masculino'
        en: 'male condom'
      labels: [
        {
          cx_factor: 0.542
          cy_factor: 0.335
          r: 0
          textOffset: [-12, 0]
          label:
            es: 'Grecia'
            en: 'Greece'
        },
        {
          cx_factor: 0.564
          cy_factor: 0.74
          r: 0
          textOffset: [15, -10]
          label:
            es: 'Botsuana'
            en: 'Botswana'
        }
      ]
    },
    {
      id: 'Injectable'
      text: 
        es: 'inyectable'
        en: 'injectable'
      labels: [
        {
          cx_factor: 0.62
          cy_factor: 0.55
          r: 0
          textOffset: [15, 0]
          label:
            es: 'Etiopía'
            en: 'Ethiopia'
        }
      ]
    },
    {
      id: 'Any traditional method'
      text: 
        es: 'métodos tradicionales'
        en: 'traditional methods'
      labels: [
        {
          cx_factor: 0.536
          cy_factor: 0.3
          r: 16
          textOffset: [-26, 0]
          label:
            es: 'Balcanes'
            en: 'Balkans'
        }
      ]
    },
    {
      id: 'Any traditional method'
      text: 
        es: 'métodos tradicionales'
        en: 'traditional methods'
      labels: [
        {
          cx_factor: 0.534
          cy_factor: 0.31
          r: 0
          textOffset: [-10, 0]
          label:
            es: 'Albania'
            en: 'Albania'
        }
      ]
    }
  ]

  getLegendData: ->
    return [0,20,40,60,80]

  getLegendFormat: (d) =>
    return d+'%'

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
      if @currentMethod
        $('#map-contraceptives-use-method').html @currentMethod.text[@options.lang]
        @data.forEach (d) => d.value = +d[@currentMethod.id]
        @updateGraph @data
        @setAnnotations()

  setAnnotations: ->
    if @currentMethod
      @currentMethod.labels.forEach (d) => 
        d.cx = d.cx_factor*@width
        d.cy = d.cy_factor*@height
        d.text = d.label[@options.lang]
      @container.call @ringNote, @currentMethod.labels
