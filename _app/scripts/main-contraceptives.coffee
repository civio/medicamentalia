# Main script for contraceptives articles

(($) ->

  useTreemap = null
  useMap = null
  useGraph = null

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
      width = Math.floor window.innerWidth
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
      if instance == 1 
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
        offset:     0.8                   # set the trigger to be 1/2 way down screen
        #debug:      true                 # display the trigger offset for testing
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
    # parse data
    data = []
    data_unmetneeds.forEach (d) ->
      country_gni = countries_gni.filter (e) -> e.code == d.code
      country_pop = countries_population.filter (e) -> e.code == d.code
      if country_gni[0] and country_gni[0]['2016']
          data.push
            value: d['2016']
            name: country_gni[0].name
            region: country_gni[0].region
            population: country_pop[0]['2015']
            gni: country_gni[0]['2016']
      else
        console.log 'No GNI or Population data for this country', d.code, country_gni[0]
    # clear items without unmet-needs values
    #data = data.filter (d) -> d.gdp and d['unmet-needs'] 
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
    unmetNeedsGdpGraph.setData data
    $(window).resize unmetNeedsGdpGraph.onResize


  # Use & Reasons maps
  # -------------------

  setupConstraceptivesMaps = (data_use, data_reasons, countries, map) ->

    parseDataUse = (d, countries) ->
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
      d.values.sort (a,b) -> d3.descending(a.value, b.value)
      #console.log d.values
      #d.value = d.values[0].value
      if item and item[0]
        d.name = item[0]['name_'+lang]
        d.code_num = item[0]['code_num']
      else
        console.log 'no country', d.code

    parseDataReasons = (d, countries) ->
      delete d['survey-year']
      delete d['Reason 6: Wants more children']
      d.code_num = d.code
      # prepend zeros to codes less than 100
      if d.code_num.length < 3
        d.code_num = ('00'+d.code_num).slice(-3)
      # populate values array with reasons
      d.values = []

      entries = d3.entries(d).filter (entry) -> entry.key.indexOf('Reason') != -1
      entries.forEach (entry) ->
        delete d[entry.key]
        entry.key = entry.key.replace(/Reason \d+: /g, '')
        entry.value = +entry.value
        d.values.push entry
      # sort descending values
      d.values.sort (a,b) -> d3.descending(a.value, b.value)
      #d.value = d.values[0].value
      d.value = d.values[0].key
      # setup country name & iso-3 code
      item = countries.filter (country) -> country.code_num == d.code_num
      if item and item[0]
        d.name = item[0]['name_'+lang]
        d.code = item[0]['code']
      else
        console.log 'no country', d.code

    setupMaps = ->
      # parse data use
      data_use.forEach (d) -> parseDataUse(d, countries)

      # parse data reasons
      data_reasons.forEach (d) -> parseDataReasons(d, countries)

      # Get data reasons keys
      reasons = d3.nest()
        .key (d) -> d.value
        .entries data_reasons
        .sort (a,b) -> d3.descending(a.values.length, b.values.length)

      console.log reasons

      reasons = reasons.map (d) -> d.key
       
      # Set use map
      useMap = new window.ContraceptivesUseMapGraph 'map-contraceptives-use',
        aspectRatio: 0.5625
        margin:
          top: 0
          bottom: 0
        legend: false
      useMap.setData data_use, map
      useMap.onResize()

      # Setup reasons map legend
      legend = d3.select('#map-contraceptives-reasons').append('ul')
        .attr 'id', 'map-contraceptives-reasons-legend'
        .selectAll('li')
        .data reasons
        .enter().append('li')
          .style 'list-style', 'none'
          .style 'display', 'inline-block'
          .style 'font-size', '1.25rem'
          .style 'margin', '0 .5rem'

      legend.append('span')
        .attr 'class', 'legend-item'

      legend.append('span').html (d) -> d

      ###
      # Set reasons map
      reasonsMap = new window.MapGraph 'map-contraceptives-reasons',
        aspectRatio: 0.5625
        margin:
          top: 0
          bottom: 0
        legend: false
      reasonsMap.color = d3.scaleOrdinal d3.schemeCategory20
      reasonsMap.setColorDomain = ->
        reasonsMap.color.domain reasons
      console.log data_reasons
      reasonsMap.setData data_reasons, map
      reasonsMap.onResize()

      # Set legend color
      legend.selectAll('.legend-item')
        .style 'display', 'inline-block'
        .style 'width', '10px'
        .style 'height', '10px'
        .style 'margin-right', '5px'
        .style 'background', (d) -> reasonsMap.color d
      ###

      # setup resize
      $(window).resize ->
        useMap.onResize()
        #reasonsMap.onResize()

    # Setup Scrollama
    setupScrollama 'contraceptives-use-container'

    # Load csvs & setup maps
    setupMaps data_use, data_reasons, countries, map


  # Contraceptives App
  # -------------------

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

  setupContraceptivesApp = ->
    setupScrollama 'contraceptives-app-container'


  # Setup
  # ---------------

  if $('#contraceptives-use-graph').length > 0
    setupConstraceptivesUseGraph()

  # Load csvs & setup maps
  # !!! TODO -> Use a single countries file with gni & population info 
  d3.queue()
    .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
    .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
    .defer d3.csv,  baseurl+'/data/contraceptives-barriers-reasons.csv'
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

      console.log userCountry

      if $('#treemap-contraceptives-use').length > 0
        setupConstraceptivesUseTreemap data_use

      if $('#map-contraceptives-use').length > 0
        setupConstraceptivesMaps data_use, data_reasons, countries, map

      if $('#unmet-needs-gdp-graph').length > 0
        setupUnmetNeedsGdpGraph data_unmetneeds, countries_gni, countries_population

      if $('#contraceptives-app').length > 0
        setupContraceptivesApp()

) jQuery
