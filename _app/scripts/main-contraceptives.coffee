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
      "Esterilización femenina"
      "Esterilización masculina"
      "DIU"
      "Implante"
      "Inyectable"
      "Píldora"
      "Condón masculino"
      "Condón femenino"
      "Métodos de barrera vaginal"
      "Método de la amenorrea de la lactancia (MELA)"
      "Anticonceptivos de emergencia"
      "Otros métodos modernos"
      "Métodos tradicionales"
    ]
    'en': [
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
      "Traditional methods"
    ]

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
        console.log 'scrollama 0', step
        if useTreemap
          if step == 1
            useTreemap.updateData 'world', 'Mundo'
          else if step == 0 and e.direction == 'up'
            useTreemap.updateData userCountry.code, userCountry.name
      else if instance == 1 
        if useMap
          console.log 'scrollama 1', step
          useMap.setMapState step # update map based on step 
      else if instance == 2
        if useGraph and step > 0
          data = [63, 88, 100] # 63, 63+25, 63+25+12
          from = if step > 1 then data[step-2] else 0
          to = data[step-1]
          useGraph.selectAll('li')
            .filter (d) -> d >= from and d < to
            .classed 'fill-'+step, e.direction == 'down'
          console.log 'scrollama 2', step
      else if instance == 3
        if unmetneedsGraph and unmetneedsGraph.options.mode != step
          unmetneedsGraph.setMode step

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
        offset:     0.05                   # set the trigger to be 1/2 way down screen
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
    useGraph = d3.select('#contraceptives-use-graph')
    dataIndex = [0..99]
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

  setupUnmetNeedsGdpGraph = (data_unmetneeds, countries_gni, countries_population) ->

    # Setup Scrollama
    setupScrollama 'unmet-needs-gdp-container-graph'

    # parse data
    data = []
    data_unmetneeds.forEach (d) ->
      country_gni = countries_gni.filter (e) -> e.code == d.code
      country_pop = countries_population.filter (e) -> e.code == d.code
      if country_gni[0] and country_gni[0]['2016']
          data.push
            value: +d['2017']
            name: country_gni[0].name
            region: country_gni[0].region
            population: country_pop[0]['2015']
            gni: country_gni[0]['2016']
      else
        console.log 'No GNI or Population data for this country', d.code, country_gni[0]
    # clear items without unmet-needs values
    #data = data.filter (d) -> d.gdp and d['unmet-needs'] 
    ###
    unmetNeedsGdpGraph = new window.ScatterplotUnmetNeedsGraph 'unmet-needs-gdp-graph',
      aspectRatio: 0.5625
      margin:
        left:   0
        rigth:  0
        top:    0
        bottom: 0
      key:
        x: 'gni'
        y: 'value'
        id: 'name'
        color: 'gni' #'region'
        size: 'population'
    # set data
    ###
    # setup graph
    unmetneedsGraph = new window.BeeswarmScatterplotGraph 'unmet-needs-gdp-graph',
      margin:
        left:   0
        rigth:  0
        top:    5
        bottom: 0
      key:
        x: 'gni'
        y: 'value'
        id: 'name'
        size: 'population'
        color: 'gni'
      dotMinSize: 1
      dotMaxSize: 12
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
        top: 0
        bottom: 0
      legend: false
    useMap.setData data_use, map
    useMap.onResize()

    # setup resize
    $(window).resize useMap.onResize


  # Contraceptives Reasons Graphs
  # -----------------------------

  setupContraceptivesReasons = (data_reasons, countries) ->

    reasonHealth = []
    reasonNotSex = []
    reasonOpposed = []
    reasonOpposedRespondent = []
    reasonOpposedHusband = []
    reasonOpposedReligious = []

    reasonsKeys = Object.keys(reasons_names)

    # parse reasons data
    data_reasons.forEach (d) ->
      ###
      reasonsKeys.forEach (reason) ->
        d[reason] = +d[reason]
        if d[reason] > 100
          console.log 'Alert! Value greater than zero. ' + d.country + ', ' + reason + ': ' + d[reason]
      ###
      reasonHealth.push
        name: d.name
        value: d.o+d.p+d.t # health concerns + fear of side effects/health concerns + interferes with bodys processes
      reasonNotSex.push
        name: d.name
        value: d.b # not having sex
      reasonOpposed.push
        name: d.name
        value: d.i+d.j+d.k+d.l # respondent opposed + husband/partner opposed + others opposed + religious prohibition
      reasonOpposedRespondent.push
        name: d.name
        value: d.i # respondent opposed
      reasonOpposedHusband.push
        name: d.name
        value: d.j # rhusband/partner opposed
      reasonOpposedReligious.push
        name: d.name
        value: d.l # religious prohibition

    sortArray = (a,b) -> return b.value-a.value
    reasonHealth.sort sortArray
    reasonNotSex.sort sortArray
    reasonOpposed.sort sortArray
    reasonOpposedRespondent.sort sortArray
    reasonOpposedHusband.sort sortArray
    reasonOpposedReligious.sort sortArray

    new window.BarHorizontalGraph('contraceptives-reasons-health',
      key:
        id: 'name'
        x: 'value').setData reasonHealth.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-opposed',
      key:
        id: 'name'
        x: 'value').setData reasonOpposed.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-not-sex',
      key:
        id: 'name'
        x: 'value').setData reasonNotSex.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-respondent',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedRespondent.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-husband',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedHusband.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-religious',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedReligious.slice(0,5)


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
        console.log 'change', country_code
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


  # Setup
  # ---------------

  if $('#contraceptives-use-graph').length > 0
    setupConstraceptivesUseGraph()

  # Load csvs & setup maps
  # !!! TODO -> Use a single countries file with gni & population info 
  d3.queue()
    .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
    .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
    .defer d3.csv,  baseurl+'/data/contraceptives-reasons.csv'
    .defer d3.csv,  baseurl+'/data/countries.csv'
    .defer d3.csv,  baseurl+'/data/countries-gni-'+lang+'.csv'
    .defer d3.csv,  baseurl+'/data/countries-population-'+lang+'.csv'
    .defer d3.json, baseurl+'/data/map-world-110.json'
    .defer d3.json, 'https://freegeoip.net/json/'
    .await (error, data_use, data_unmetneeds, data_reasons, countries, countries_gni, countries_population, map, location) ->

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

      console.log userCountry

      if $('#treemap-contraceptives-use').length
        setupConstraceptivesUseTreemap data_use

      if $('#map-contraceptives-use').length
        setupConstraceptivesMaps data_use, countries, map

      if $('#unmet-needs-gdp-graph').length
        setupUnmetNeedsGdpGraph data_unmetneeds, countries_gni, countries_population

      if $('#contraceptives-reasons-opposed').length
        setupContraceptivesReasons data_reasons, countries

      if $('#contraceptives-app').length
        setupContraceptivesApp data_use, data_unmetneeds, data_reasons

) jQuery
