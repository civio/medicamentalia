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
    "a": "not married"
    "b": "not having sex"
    "c": "infrequent sex"
    "d": "menopausal/hysterectomy"
    "e": "subfecund/infecund"
    "f": "postpartum amenorrheic"
    "g": "breastfeeding"
    "h": "fatalistic"
    "i": "respondent opposed"       # opposed
    "j": "husband/partner opposed"  # opposed
    "k": "others opposed"           # opposed
    "l": "religious prohibition"    # opposed
    "m": "knows no method"
    "n": "knows no source"
    "o": "health concerns"                      # salud
    "p": "fear of side effects/health concerns" # salud
    "q": "lack of access/too far"
    "r": "costs too much"
    "s": "inconvenient to use"
    "t": "interferes with bodys processes"      # salud
    "u": "preferred method not available"
    "v": "no method available"
    "w": "(no estándar)"
    "x": "other"
    "z": "don't know"

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


  # Contraceptives Reasons Graphs
  # -----------------------------


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


  # Contraceptives App
  # -------------------

  setupContraceptivesApp = (data_use, data_unmetneeds, data_reasons) ->
    # setupScrollama 'contraceptives-app-container'
    $('#contraceptives-app .select-country')
      .change ->
        country_code = $(this).val()
        # Use
        data_use_country = data_use.filter (d) -> d.code == country_code
        if data_use_country and data_use_country[0]
          country_methods = methods_keys.map (key, i) -> {'name': methods_names[lang][i], 'value': +data_use_country[0][key]}
          country_methods = country_methods.sort (a,b) -> b.value-a.value
          $('#contraceptives-app-data-use').html Math.round(+data_use_country[0]['Any modern method'])+'%'
          $('#contraceptives-app-data-main-method').html country_methods[0].name
          $('#contraceptives-app-data-main-method-value').html Math.round(country_methods[0].value)+'%'
          $('#contraceptives-app-use').show()
        else
          $('#contraceptives-app-use').hide()
        # Unmetneeds
        data_unmetneeds_country = data_unmetneeds.filter (d) -> d.code == country_code
        if data_unmetneeds_country and data_unmetneeds_country[0]
          $('#contraceptives-app-data-unmetneeds').html Math.round(+data_unmetneeds_country[0]['2017'])+'%'
          $('#contraceptives-app-unmetneeds').show()
        else
          $('#contraceptives-app-unmetneeds').hide()
        # Reasons
        data_reasons_country = data_reasons.filter (d) -> d.code == country_code
        if data_reasons_country and data_reasons_country[0]
          reasons = Object.keys(reasons_names).map (reason) -> {'name': reasons_names[reason], 'value': +data_reasons_country[0][reason]}
          reasons = reasons.sort (a,b) -> b.value-a.value
          $('#contraceptives-app-data-reason').html reasons[0].name
          $('#contraceptives-app-data-reason-value').html Math.round(reasons[0].value)+'%'
          $('#contraceptives-app-reason').show()
        else
          $('#contraceptives-app-reason').hide()
      .val userCountry.code
      .trigger 'change'


  # Contraceptives App
  # -------------------

  ###
  setupMaternalMortality = ->
    dataIndex = [0..4999]
    mortalityGraph = d3.select('#maternal-mortality-developed')
    mortalityGraph.append('ul')
      .selectAll('li')
        .data(dataIndex)
      .enter().append('li')
        .append('svg')
          .append('use')
            .attr('xlink:href', '#icon-woman')
            .attr('viewBox', '0 0 193 450')
    # Resize handler
    resizeHandler = ->
      if graphWidth != mortalityGraph.node().offsetWidth
        graphWidth = mortalityGraph.node().offsetWidth
        itemsWidth = (graphWidth / 100) - 2
        itemsHeight = 2.33*itemsWidth
        #itemsWidth = if graphWidth < 480 then '10%' else '5%'
        #itemsHeight = if graphWidth < 480 then graphWidth * 0.1 / 0.75 else graphWidth * 0.05 / 0.75
        mortalityGraph.selectAll('li')
          .style 'width', itemsWidth+'px'
          .style 'height', itemsHeight+'px'
        mortalityGraph.selectAll('svg')
          .attr 'width', itemsWidth
          .attr 'height', itemsHeight
      #mortalityGraph.style 'margin-top', (($('body').height()-mortalityGraph.node().offsetHeight)*.5)+'px'
    window.addEventListener 'resize', resizeHandler
    resizeHandler()
  ###

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
          Object.keys(reasons_names).forEach (reason) ->
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
      #  new ContraceptivesReasons data_reasons, countries, reasons_names

      if $('#carousel-marie-stopes').length
        setupScrollama 'carousel-marie-stopes'

      if $('#contraceptives-app').length
        setupContraceptivesApp data_use, data_unmetneeds, data_reasons

      #if $('#maternal-mortality-developed').length
      #  setupMaternalMortality()

) jQuery
