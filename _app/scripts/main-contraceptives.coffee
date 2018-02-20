# Main script for contraceptives articles

(($) ->

  useTreemap = null
  useMap = null
  useGraph = null
  unmetneedsGraph = null 

  userCountry = {}

  scrollamaInitialized = false

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')

  #console.log 'contraceptives', lang, baseurl

  # setup format numbers
  if lang == 'es'
    d3.formatDefaultLocale {
      "currency": ["$",""]
      "decimal": ","
      "thousands": "."
      "grouping": [3]
    }

  methods_keys = [
    "Female sterilization"
    "Male sterilization"
    "IUD"
    "Implant"
    "Injectable"
    "Pill"
    "Male condom"
    "Female condom"
    "Vaginal barrier methods"
    "Lactational amenorrhea method (LAM)"
    "Emergency contraception"
    "Other modern methods"
    "Any traditional method"
  ]

  methods_names = 
    'es': [
      "esterilización femenina"
      "esterilización masculina"
      "DIU"
      "implante"
      "inyectable"
      "píldora"
      "condón masculino"
      "condón femenino"
      "métodos de barrera vaginal"
      "método de la amenorrea de la lactancia (MELA)"
      "anticonceptivos de emergencia"
      "otros métodos modernos"
      "métodos tradicionales"
    ]
    'en': [
      "female sterilization"
      "male sterilization"
      "IUD"
      "implant"
      "injectable"
      "pill"
      "male condom"
      "female condom"
      "vaginal barrier methods"
      "lactational amenorrhea method (LAM)"
      "emergency contraception"
      "other modern methods"
      "traditional methods"
    ]

  methods_dhs_names = 
    'es': 
      '1': "píldora"
      '2': "DIU"
      '3': "inyectable"
      '5': "condón"
      '6': "esterilización femenina"
      '7': "esterilización masculina"
      '8': "abstinencia periódica"
      '9': "marcha atrás"
      '10': "otros"
      '11': "implante"
      '13': "método de la amenorrea de la lactancia (MELA)"
      '17': "métodos tradicionales"
    'en':
      '1': "pill"
      '2': "IUD"
      '3': "injectable"
      '5': "condom"
      '6': "female sterilization"
      '7': "male sterilization"
      '8': "periodic abstinence"
      '9': "withdrawal"
      '10': "other"
      '11': "implant"
      '13': "lactational amenorrhea method (LAM)"
      '17': "traditional methods"


  ###
  methods_icons = 
    "Female sterilization": 'sterilization'
    "Male sterilization": 'sterilization'
    "IUD": 'diu'
    "Implant": null
    "Injectable": 'injectable'
    "Pill": 'pill'
    "Male condom": 'condom'
    "Female condom": null
    "Vaginal barrier methods": null
    "Lactational amenorrhea method (LAM)": null
    "Emergency contraception": null
    "Other modern methods": null
    "Any traditional method": 'traditional'
  ###

  reasons_names = 
    'es':
      "a": "no están casadas"
      "b": "no tienen sexo"
      "c": "tienen sexo infrecuente"
      "d": "menopausia o esterilización"
      "e": "son subfecundas o infecundas"
      "f": "amenorrea postparto"
      "g": "están dando el pecho"
      "h": "fatalista"
      "i": "la mujer se opone"
      "j": "el marido o la pareja se opone"
      "k": "otros se oponen"        
      "l": "prohibición religiosa"  
      "m": "no conoce los métodos"
      "n": "no conoce ninguna fuente donde adquirirlos"
      "o": "preocupaciones de salud"                     
      "p": "miedo a los efectos secundarios/preocupaciones de salud" 
      "q": "falta de acceso/muy lejos"
      "r": "cuestan demasiado"
      "s": "inconvenientes para su uso"
      "t": "interfiere con los procesos del cuerpo"
      "u": "el método elegido no está disponible"
      "v": "no hay métodos disponibles"
      "w": "(no estándar)"
      "x": "otros"
      "z": "no lo sé"
    'en':
      "a": "not married"
      "b": "not having sex"
      "c": "infrequent sex"
      "d": "menopausal/hysterectomy"
      "e": "subfecund/infecund"
      "f": "postpartum amenorrheic"
      "g": "breastfeeding"
      "h": "fatalistic"
      "i": "respondent opposed"
      "j": "husband/partner opposed"
      "k": "others opposed"
      "l": "religious prohibition"
      "m": "knows no method"
      "n": "knows no source"
      "o": "health concerns"
      "p": "fear of side effects/health concerns"
      "q": "lack of access/too far"
      "r": "costs too much"
      "s": "inconvenient to use"
      "t": "interferes with body's processes"
      "u": "preferred method not available"
      "v": "no method available"
      "w": "(no estándar)"
      "x": "other"
      "z": "don't know"

  reasons_dhs_names = 
    'es': 
      'v3a08a': 'no están casadas'
      'v3a08b': 'no tienen sexo'
      'v3a08c': 'tienen sexo infrecuente'
      'v3a08d': 'menopausia o esterilización'
      'v3a08e': 'son subfecundas o infecundas'
      'v3a08f': 'amenorrea postparto'
      'v3a08g': 'están dando el pecho'
      'v3a08h': 'fatalista'
      'v3a08i': 'la mujer se opone'
      'v3a08j': 'el marido o la pareja se opone'
      'v3a08k': 'otros se oponen'        
      'v3a08l': 'prohibición religiosa'
      'v3a08m': 'no conoce los métodos'
      'v3a08n': 'no conoce ninguna fuente donde adquirirlos'
      'v3a08o': 'preocupaciones de salud'
      'v3a08p': 'miedo a los efectos secundarios'
      'v3a08q': 'falta de acceso/muy lejos'
      'v3a08r': 'cuestan demasiado'
      'v3a08s': 'inconvenientes para su uso'
      'v3a08t': "interfiere con los procesos del cuerpo"
    'en': 
      'v3a08a': 'not married'
      'v3a08b': 'not having sex'
      'v3a08c': 'infrequent sex'
      'v3a08d': 'menopausal/hysterectomy'
      'v3a08e': 'subfecund/infecund'
      'v3a08f': 'postpartum amenorrheic'
      'v3a08g': 'breastfeeding'
      'v3a08h': 'fatalistic'
      'v3a08i': 'respondent opposed'
      'v3a08j': 'husband/partner opposed'
      'v3a08k': 'others opposed'
      'v3a08l': 'religious prohibition'
      'v3a08m': 'knows no method'
      'v3a08n': 'knows no source'
      'v3a08o': 'health concerns'
      'v3a08p': 'fear of side effects'
      'v3a08q': 'lack of access/too far'
      'v3a08r': 'costs too much'
      'v3a08s': 'inconvenient to use'
      'v3a08t': "interferes with the body's processes"


  # Scrollama Setup
  # ---------------

  setupScrollama = (id) ->
    container = d3.select('#'+id)
    graphic   = container.select('.scroll-graphic')
    chart     = graphic.select('.graph-container')
    text      = container.select('.scroll-text')
    steps     = text.selectAll('.step')

    # initialize scrollama
    scroller = scrollama()

    # resize function to set dimensions on load and on page resize
    handleResize = ->
      width = graphic.node().getBoundingClientRect().width #Math.floor window.innerWidth
      height = Math.floor window.innerHeight
      # 1. update height of step elements for breathing room between steps
      steps.style 'height', height + 'px'
      # 2. update height of graphic element
      graphic.style 'height', height + 'px'
      # 3. update width of chart
      chart
        .style 'width', width+'px'
        .style 'height', height+'px'
      # 4. tell scrollama to update new element dimensions
      scroller.resize()

    handleContainerEnter = (e) ->
      # sticky the graphic
      graphic
        .classed 'is-fixed', true
        .classed 'is-bottom', false

    handleContainerExit = (e) ->
      # un-sticky the graphic, and pin to top/bottom of container
      graphic
        .classed 'is-fixed', false
        .classed 'is-bottom', e.direction == 'down'

    handleStepEnter = (e) ->
      # console.log e
      $step = $(e.element)
      instance = $step.data('instance')
      step = $step.data('step')
      if instance == 0 
        #console.log 'scrollama 0', step
        if useTreemap
          if step == 1
            useTreemap.updateData 'world', 'Mundo'
          else if step == 0 and e.direction == 'up'
            useTreemap.updateData userCountry.code, userCountry.name
      else if instance == 1 
        if useMap
          #console.log 'scrollama 1', step
          useMap.setMapState step # update map based on step 
      else if instance == 2
        if useGraph and step > 0
          data = [63, 88, 100] # 63, 63+25, 63+25+12
          from = if step > 1 then data[step-2] else 0
          to = data[step-1]
          useGraph.selectAll('li')
            .filter (d) -> d >= from and d < to
            .classed 'fill-'+step, e.direction == 'down'
          #console.log 'scrollama 2', step
      else if instance == 3
        if unmetneedsGraph
          unmetneedsGraph.setMode step
      else if instance == 4
        $('#carousel-marie-stopes .scroll-graphic .active').removeClass('active')
        $('#carousel-marie-stopes .scroll-graphic .step-'+step).addClass('active')

    # start it up
    # 1. call a resize on load to update width/height/position of elements
    handleResize()

    # 2. setup the scrollama instance
    # 3. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup
        container:  '#'+id                # our outermost scrollytelling element
        graphic:    '.scroll-graphic'     # the graphic
        text:       '.scroll-text'        # the step container
        step:       '.scroll-text .step'  # the step elements
        offset:     0.05                  # set the trigger to be 1/2 way down screen
        debug:      false                 # display the trigger offset for testing
      .onContainerEnter handleContainerEnter 
      .onContainerExit  handleContainerExit 

    # Ensure to setup onStepEnter handler only once
    unless scrollamaInitialized
      scrollamaInitialized = true
      scroller.onStepEnter  handleStepEnter 
      
    # setup resize event
    window.addEventListener 'resize', handleResize


  # Contraceptives Use Graph 
  # -------------------------

  setupConstraceptivesUseGraph = ->
    # Setup Scrollama
    setupScrollama 'contraceptives-use-graph-container'
    # Setup Graph
    graphWidth = 0
    dataIndex = [0..99]
    useGraph = d3.select('#contraceptives-use-graph')
    useGraph.append('ul')
      .selectAll('li')
        .data(dataIndex)
      .enter().append('li')
        .append('svg')
          .append('use')
            .attr('xlink:href', '#icon-woman')
            .attr('viewBox', '0 0 193 450')
    # Resize handler
    resizeHandler = ->
      if graphWidth != useGraph.node().offsetWidth
        graphWidth = useGraph.node().offsetWidth
        itemsWidth = (graphWidth / 20) - 10
        itemsHeight = 2.33*itemsWidth
        #itemsWidth = if graphWidth < 480 then '10%' else '5%'
        #itemsHeight = if graphWidth < 480 then graphWidth * 0.1 / 0.75 else graphWidth * 0.05 / 0.75
        useGraph.selectAll('li')
          .style 'width', itemsWidth+'px'
          .style 'height', itemsHeight+'px'
        useGraph.selectAll('svg')
          .attr 'width', itemsWidth
          .attr 'height', itemsHeight
      useGraph.style 'margin-top', (($('body').height()-useGraph.node().offsetHeight)*.5)+'px'
    window.addEventListener 'resize', resizeHandler
    resizeHandler()


  # Unmeet Needs vs GDP graph
  # --------------------------

  setupUnmetNeedsGdpGraph = (data_unmetneeds, countries) ->

    # Setup Scrollama
    setupScrollama 'unmet-needs-gdp-container-graph'

    # parse data
    data = []
    data_unmetneeds.forEach (d) ->
      country = countries.filter (e) -> e.code == d.code
      if country[0] and country[0]['gni']
          data.push
            value:      +d['estimated']
            id:         country[0].code
            name:       country[0]['name_'+lang]
            population: +country[0]['population']
            gni:        +country[0]['gni']
      else
        console.log 'No GNI or Population data for this country', d.code, country[0]
    # setup graph
    unmetneedsGraph = new window.BeeswarmScatterplotGraph 'unmet-needs-gdp-graph',
      margin:
        left:   0
        rigth:  0
        top:    5
        bottom: 0
      key:
        x:      'gni'
        y:      'value'
        id:     'id'
        label:  'name'
        color:  'value'
        size:   'population'
      dotMinSize: 1
      dotMaxSize: 32
    unmetneedsGraph.setData data
    $(window).resize unmetneedsGraph.onResize


  # Use & Reasons maps
  # -------------------

  setupConstraceptivesMaps = (data_use, countries, map) ->

    # Setup Scrollama
    setupScrollama 'contraceptives-use-container'

    # parse data use
    data_use.forEach (d) ->
      item = countries.filter (country) -> country.code == d.code
      ###
      d['Rhythm']                    = +d['Rhythm']
      d['Withdrawal']                = +d['Withdrawal']
      d['Other traditional methods'] = +d['Other traditional methods']
      d['Traditional methods'] = d['Rhythm']+d['Withdrawal']+d['Other traditional methods']
      console.log d.code, d['Rhythm'], d['Withdrawal'], d['Other traditional methods'], d['Traditional methods']
      delete d['Rhythm']
      delete d['Withdrawal']
      delete d['Other traditional methods']
      ###
      d.values = [] # +d['Any method']
      d.value = 0  # +d['Male sterilization']
      # get main method in each country
      methods_keys.forEach (key,i) ->
        d.values.push
          id: i
          name: methods_names[lang][i]
          value: if d[key] != '' then +d[key] else null
        #delete d[key]
      # sort descending values
      #d.values.sort (a,b) -> d3.descending(a.value, b.value)
      #d.value = d.values[0].value
      if item and item[0]
        d.name = item[0]['name_'+lang]
        d.code_num = item[0]['code_num']
      else
        console.log 'no country', d.code

    # Set use map
    useMap = new window.ContraceptivesUseMapGraph 'map-contraceptives-use',
      aspectRatio: 0.5625
      margin:
        top: 20
        bottom: 0
      legend: true
      lang: lang
    useMap.setData data_use, map
    useMap.onResize()

    # setup resize
    $(window).resize useMap.onResize


  # Contraceptives Use Treenap
  # --------------------------

  setupConstraceptivesUseTreemap = (data_use) ->
    # set scrollama for treemap
    setupScrollama 'treemap-contraceptives-use-container'
    # setup treemap
    useTreemap = new window.ContraceptivesUseTreemapGraph 'treemap-contraceptives-use',
      aspectRatio: 0.5625
      margin:
        left:   0
        rigth:  0
        top:    0
        bottom: 0
      key:
        value: 'value'
        id: 'name'
      methodsKeys: methods_keys
      methodsNames: methods_names[lang]
    # set data
    useTreemap.setData data_use, userCountry.code, userCountry.name
    # set resize
    $(window).resize useTreemap.onResize


  # Contraceptives Reasons Opposition Graphs
  # ----------------------------------------

  setupReasonsOpposedGraph = ->
    $bars = $('#contraceptives-reasons-opposed .bar')
    $('#contraceptives-reasons-opposed-legend li')
      .mouseover ->
        $bars
          .addClass('disabled')
          .filter('.bar-'+$(this).attr('class'))
            .removeClass('disabled')
      .mouseout ->
        $bars.removeClass('disabled')


  # Setup
  # ---------------

  # Load csvs & setup maps
  d3.queue()
    .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
    .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
    .defer d3.csv,  baseurl+'/data/contraceptives-reasons.csv'
    .defer d3.csv,  baseurl+'/data/countries-gni-population-2016.csv'
    .defer d3.json, baseurl+'/data/map-world-110.json'
    .defer d3.json, 'https://freegeoip.net/json/'
    .await (error, data_use, data_unmetneeds, data_reasons, countries, map, location) ->

      if location
        user_country = countries.filter (d) -> d.code2 == location.country_code
        if user_country[0]
          userCountry.code = user_country[0].code
          userCountry.name = user_country[0]['name_'+lang]
      else
        location = {}

      unless location.code
        userCountry.code = 'ESP'
        userCountry.name = if lang == 'es' then 'España' else 'Spain'

      #test other countries
      #userCountry.code = 'RUS'
      #userCountry.name = 'Rusia'

      # add country ISO 3166-1 alpha-3 code to data_reasons
      data_reasons.forEach (d) ->
        item = countries.filter (country) -> country.code2 == d.code
        if item and item[0]
          d.code = item[0].code
          d.name = item[0]['name_'+lang]
          Object.keys(reasons_names[lang]).forEach (reason) ->
            d[reason] = 100*d[reason]
            if d[reason] > 100
              console.log 'Alert! Value greater than zero. ' + d.country + ', ' + reason + ': ' + d[reason]
          delete d.country
        else
          console.warn 'No country data for '+d.code

      if $('#treemap-contraceptives-use').length
        setupConstraceptivesUseTreemap data_use

      if $('#map-contraceptives-use').length
        setupConstraceptivesMaps data_use, countries, map

      if $('#contraceptives-use-graph').length > 0
        setupConstraceptivesUseGraph()

      if $('#unmet-needs-gdp-graph').length
        setupUnmetNeedsGdpGraph data_unmetneeds, countries

      #if $('#contraceptives-reasons-opposed').length
      #  new ContraceptivesReasons data_reasons, countries, reasons_names[lang]

      if $('#carousel-marie-stopes').length
        setupScrollama 'carousel-marie-stopes'

      if $('#contraceptives-reasons-opposed').length
        setupReasonsOpposedGraph()

      if $('#contraceptives-app').length
        new ContraceptivesApp data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]

) jQuery
