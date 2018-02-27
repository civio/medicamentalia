# Main script for contraceptives articles

(($) ->
  
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
      "female sterilisation"
      "male sterilisation"
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
      '6': "female sterilisation"
      '7': "male sterilisation"
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


  # Contraceptives Use Graph 
  # -------------------------

  setupConstraceptivesUseGraph = ->

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
        itemsWidth = if graphWidth > 480 then (graphWidth / 20) - 10 else (graphWidth / 20) - 4
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

    # set scrollama for treemap
    new ScrollGraph 'contraceptives-use-graph-container', (e) ->
      currentStep = +d3.select(e.element).attr('data-step')
      if currentStep > 0
        data = [64, 88, 100] # 64, 64+24, 64+24+12
        from = if currentStep > 1 then data[currentStep-2] else 0
        to = data[currentStep-1]
        useGraph.selectAll('li')
          .filter (d) -> d >= from and d < to
          .classed 'fill-'+currentStep, e.direction == 'down'

    resizeHandler()
    window.addEventListener 'resize', resizeHandler


  # Unmeet Needs vs GDP graph
  # --------------------------

  setupUnmetNeedsGdpGraph = (data_unmetneeds, countries) ->

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
      ###
      else
        console.log 'No GNI or Population data for this country', d.code, country[0]
      ###

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

    # set scrollama for treemap
    new ScrollGraph 'unmet-needs-gdp-container-graph', (e) ->
      currentStep = +d3.select(e.element).attr('data-step')
      unmetneedsGraph.setMode currentStep

    $(window).resize unmetneedsGraph.onResize


  # Use & Reasons maps
  # -------------------

  setupConstraceptivesMaps = (data_use, countries, map) ->

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
      ###
      else
        console.log 'no country', d.code
      ###
    
    # Set use map
    useMap = new window.ContraceptivesUseMapGraph 'map-contraceptives-use',
      aspectRatio: 0.5625
      margin:
        top: 60
        bottom: 0
      legend: true
      lang: lang
    useMap.setData data_use, map

    # set scrollama for treemap
    new ScrollGraph 'contraceptives-use-container', (e) ->
      currentStep = +d3.select(e.element).attr('data-step')
      useMap.setMapState currentStep # update map based on step 

    # setup resize
    useMap.onResize()
    $(window).resize useMap.onResize


  # Contraceptives Use Treenap
  # --------------------------

  setupConstraceptivesUseTreemap = (data_use) ->

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

    # set scrollama for treemap
    new ScrollGraph 'treemap-contraceptives-use-container', (e) ->
      currentStep = +d3.select(e.element).attr('data-step')
      if currentStep == 1
        useTreemap.updateData 'world', 'Mundo'
      else if currentStep == 0 and e.direction == 'up'
        useTreemap.updateData userCountry.code, userCountry.name

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


  onCarouselStep = (e) ->
    currentStep = d3.select(e.element).attr('data-step')
    #console.log 'carousel', currentStep
    @graphic.selectAll('.active').classed 'active', false
    @graphic.select('.step-'+currentStep).classed 'active', true


  setLocation = (countries) ->
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


  setupDataArticle = (error, data_use, data_unmetneeds, data_reasons, countries, map, location) ->

    setLocation countries

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
      ###
      else
        console.warn 'No country data for '+d.code
      ###

    if $('#treemap-contraceptives-use').length
      setupConstraceptivesUseTreemap data_use

    if $('#map-contraceptives-use').length
      setupConstraceptivesMaps data_use, countries, map

    if $('#contraceptives-use-graph').length > 0
      setupConstraceptivesUseGraph()

    if $('#unmet-needs-gdp-graph').length
      setupUnmetNeedsGdpGraph data_unmetneeds, countries

    if $('#carousel-marie-stopes').length
      new ScrollGraph 'carousel-marie-stopes', onCarouselStep

    if $('#contraceptives-reasons-opposed').length
      setupReasonsOpposedGraph()

    if $('#contraceptives-app').length
      new ContraceptivesApp data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]


  # setup line chart
  setupMortalityLineGraph =  ->
    data = [{
      '1990': 385
      '1995': 369
      '2000': 341
      '2005': 288
      '2010': 246
      '2015': 216
    }]
    graph = new window.LineGraph('maternal-mortality-graph',
      isArea: true
      margin: left: 20)
    graph.xAxis.tickValues [1995, 2005, 2015]
    graph.yAxis
      .tickValues [100, 200, 300]
      .tickFormat d3.format('.0s')
    graph.yFormat = d3.format('.2s')
    graph.getScaleYDomain = -> return [0, 385]
    graph.setData data
    $(window).resize graph.onResize


  # Setup
  # ---------------

  console.log baseurl

  if $('body').hasClass('datos-uso-barreras') or $('body').hasClass('data-use-barriers')
    ###
    # Load csvs & setup maps
    d3.queue()
      .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
      .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
      .defer d3.csv,  baseurl+'/data/contraceptives-reasons.csv'
      .defer d3.csv,  baseurl+'/data/countries-gni-population-2016.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .defer d3.json, 'https://freegeoip.net/json/'
      .await setupDataArticle
    ###
    # Load csvs & setup maps
    d3.queue()
      .defer d3.csv,  'https://pre.medicamentalia.org/assets/data/contraceptives-use-countries.csv'
      .defer d3.csv,  'https://pre.medicamentalia.org/assets/data/unmet-needs.csv'
      .defer d3.csv,  'https://pre.medicamentalia.org/assets/data/contraceptives-reasons.csv'
      .defer d3.csv,  'https://pre.medicamentalia.org/assets/data/countries-gni-population-2016.csv'
      .defer d3.json, 'https://pre.medicamentalia.org/assets/data/map-world-110.json'
      .defer d3.json, 'https://freegeoip.net/json/'
      .await setupDataArticle

  else if $('body').hasClass 'religion'
    if $('#carousel-rabinos').length
      new ScrollGraph 'carousel-rabinos', onCarouselStep
    if $('#carousel-imam').length
      new ScrollGraph 'carousel-imam', onCarouselStep
    if $('#carousel-papa').length
      new ScrollGraph 'carousel-papa', onCarouselStep
    if $('#maternal-mortality-graph').length
      setupMortalityLineGraph()

  else if $('body').hasClass 'datos-uso-barreras-static'
    # Load csvs & setup maps
    d3.queue()
      .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
      .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
      .defer d3.csv,  baseurl+'/data/contraceptives-reasons.csv'
      .defer d3.csv,  baseurl+'/data/countries-gni-population-2016.csv'
      .defer d3.json, 'https://freegeoip.net/json/'
      .await (error, data_use, data_unmetneeds, data_reasons, countries, location) ->
        setLocation countries
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
          ###
          else
            console.warn 'No country data for '+d.code
          ###  
        if $('#contraceptives-app').length
          new ContraceptivesApp data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]

) jQuery
