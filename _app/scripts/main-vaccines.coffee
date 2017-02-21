# Main script for vaccines articles

(($) ->

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')

  # list of excluded countries codes (countries with less than 300.000 inhabitants in 2015)
  excludedCountries = ['NIU','COK','TUV','NRU','PLW','VGB','MAF','SMR','GIB','TCA','LIE','MCO','SXM','FRO','MHL','MNP','ASM','KNA','GRL','CY','BMU','AND','DMA','IMN','ATG','SYC','VIR','ABW','FSM','TON','GRD','VCT','KIR','CUW','CHI','GUM','LCA','STP','WSM','VUT','NCL','PYF','BRB']      

  # setup format numbers
  if lang == 'es'
    d3.formatDefaultLocale {
      "currency": ["$",""]
      "decimal": ","
      "thousands": "."
      "grouping": [3]
    }

  formatFloat = d3.format(',.1f')
  formatInteger = d3.format(',d')

  # Init Tooltips
  $('[data-toggle="tooltip"]').tooltip()


  # get country name auxiliar method
  getCountryName = (countries, code, lang) ->
    item = countries.filter (d) -> d.code == code
    if item
      item[0]['name_'+lang]
    else
      console.error 'No country name for code', code

  # Video of map polio cases
  setVideoMapPolio = ->
    d3.csv baseurl+'/data/diseases-polio-cases-total.csv', (error, data) ->
      cases = {}
      casesStr = if lang == 'es' then 'casos' else 'cases'
      data.forEach (d) ->
        cases[d.year] = d.value
      # Add youtube video
      wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio')
      wrapper.src = 'http://www.youtube.com/embed/o-EzVOjnc6Q?controls=0&showinfo=0&hd=1'
      popcorn = Popcorn(wrapper)
      notes = 2017 - 1980
      yearDuration = 27/(notes+1) # video duration is 27seconds 
      i = 0
      while i < notes
        year = ''+(1980+i)
        popcorn.footnote
          start:  yearDuration * i
          end:    if i < notes-1 then yearDuration*(i+1) else (yearDuration*(i+1))+1
          text:   year + '<br><span class="value">' + formatInteger(cases[year]) + ' ' + casesStr + '</span>'
          target: 'video-map-polio-description'
        i++
      # Show cover when video ended
      wrapper.addEventListener 'ended', (e) ->
        $('.video-map-polio-cover').show()
        $('#video-map-polio-description, #video-map-polio iframe').fadeTo 0, 0
        popcorn.currentTime 0
      # Show video when play btn clicked
      $('#video-map-polio-play-btn').click (e) ->
        e.preventDefault()
        popcorn.play()
        $('.video-map-polio-cover').fadeOut()
        $('#video-map-polio-description, #video-map-polio iframe').fadeTo 300, 1


  # Measles World Map Graph
  setupMeaslesWorldMapGraph = ->
    d3.queue()
      .defer d3.csv,  baseurl+'/data/measles-cases-who-regions.csv'
      .defer d3.csv,  baseurl+'/data/countries-who-regions.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .await (error, data, countries, map) ->
        # add cases to each country
        countries.forEach (country) ->
          region = data.filter (d) -> d.region == country.region
          if region.length > 0
            country.value = region[0].cases*100000
            country.cases = region[0].cases_total
            country.name = region[0]['name_'+lang]
        # set graph
        graph = new window.MapGraph('measles-world-map-graph',
          aspectRatio: 0.5625
          margin: 
            top: 60
            bottom: 0
          legend: true)
        graph.setData countries, map
        $(window).resize graph.onResize

  # Measles cases Heatmap Graph
  setupHeatMapGraph = (id, data, countries, legend) ->
    data = data
      .filter (d) -> countries.indexOf(d.code) != -1 and d3.values(d.values).length > 0
      .sort (a,b) -> a.total - b.total
    graph = new window.HeatmapGraph(id,
      legend: legend
      margin: 
        right: 0
        left: 0)
    graph.setData data
    # Sort data
#     if sort == 'year'
#       currentData.sort (a, b) ->
#         if isNaN(a.year_introduction) then 1 else if isNaN(b.year_introduction) then -1 else b.year_introduction - (a.year_introduction)
#     else if sort == 'cases'
#       currentData.sort (a, b) ->
#         b.total - (a.total)
    $(window).resize graph.onResize


  setupVaccineConfidenceBarGraph = ->
    d3.queue()
      .defer d3.csv, baseurl+'/data/confidence.csv'
      .defer d3.json, 'http://freegeoip.net/json/'
      .await (error, data, location) ->
        data.forEach (d) =>
          d.value = +d.value
          d.name = d['name_'+lang]
          delete d.name_es
          delete d.name_en
          # set user country active
          if location and d.code2 == location.country_code
            d.active = true
        graph = new window.BarGraph('vaccine-confidence-graph',
          aspectRatio: 0.3
          label: 
            format: (d) ->  formatFloat(d)+'%'
          margin: top: 0
          key:
            x: 'name'
            y: 'value'
            id: 'code')
        graph.setData data
        $(window).resize graph.onResize

  setupVaccineBcgCasesMap = ->
    d3.queue()
      .defer d3.csv,  baseurl+'/data/tuberculosis-cases.csv'
      .defer d3.csv,  baseurl+'/data/countries.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .await (error, data, countries, map) ->
        # add cases to each country
        data.forEach (d) ->
          item = countries.filter (country) -> country.code == d.code
          d.value = +d.cases_population
          d.cases = +d.cases
          if item
            d.name = item[0]['name_'+lang]
            d.code_num = item[0]['code_num']
        # set graph
        graph = new window.MapGraph('vaccine-bcg-cases-graph',
          aspectRatio: 0.5625
          margin: 
            top: 60
            bottom: 0
          legend: true)
        graph.getLegendData = -> [0,200,400,600,800]
        graph.setData data, map
        $(window).resize graph.onResize


  setupVaccineBcgStockoutsMap = ->
    d3.queue()
      .defer d3.csv,  baseurl+'/data/bcg-stockouts.csv'
      .defer d3.csv,  baseurl+'/data/countries.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .await (error, data, countries, map) ->
        years = d3.range 2006, 2016   # set years array
        # add cases to each country
        data.forEach (d) ->
          item = countries.filter (country) -> country.code == d.code
          d.value = +d.value
          d.years = ''
          # get list of years with stockouts
          years.forEach (year) ->
            if d[year] == '2' || d[year] == '3'  # check values 2 or 3 (national stockouts code)
              d.years += year+','
            delete d[year]
          if item
            d.name = item[0]['name_'+lang]
            d.code_num = item[0]['code_num']
        # set graph
        graph = new window.MapGraph('vaccine-bcg-stockouts',
          aspectRatio: 0.5625
          margin: 
            top: 60
            bottom: 0
          legend: true)
        graph.formatFloat = graph.formatInteger
        graph.getLegendData = -> [0,2,4,6,8]
        graph.setTooltipData = (d) ->
          graph.$tooltip
            .find '.tooltip-inner .title'
            .html d.name
          graph.$tooltip
            .find '.description, .years-cells'
            .hide()
          if d.value == 0
            graph.$tooltip
              .find '.description-zero'
              .show()
          else if d.value == 1
            graph.$tooltip
              .find '.description-one .value'
              .html d.years.split(',')[0]
            graph.$tooltip
              .find '.description-one'
              .show()
          else
            graph.$tooltip 
              .find '.description-multiple .value'
              .html graph.formatInteger(d.value)
            graph.$tooltip
              .find '.years-cells li'
              .toggleClass 'active', false
            d.years.split(',').forEach (year) ->
              graph.$tooltip
                .find '.years-cells li[data-year="'+year+'"]'
                .toggleClass 'active', true
            graph.$tooltip
              .find '.description-multiple, .years-cells'
              .show()
        graph.setData data, map
        $(window).resize graph.onResize

  setupVaccineDiseaseHeatmapGraph = ->
    d3.queue()
      .defer d3.csv, baseurl+'/data/diseases-cases-measles.csv'
      .defer d3.csv, baseurl+'/data/population.csv'
      .await (error, data_cases, data_population) ->
        delete data_cases.columns  # we don't need the columns attribute
        data_cases.forEach (d) ->
          if d.year_introduction
            d.year_introduction = +d.year_introduction.replace('prior to', '')
          d.cases = {}
          d.values = {}
          d.name = getCountryName data_population, d.code, lang
          # set values as cases/1000 inhabitants
          populationItem = data_population.filter (country) -> country.code == d.code
          if populationItem.length > 0
            year = 1980
            while year < 2016
              if d[year]
                population = +populationItem[0][year]
                if population != 0
                  d.cases[year] = +d[year]
                  d.values[year] = 100000 * +d[year] / population
                else
                  #console.log('No hay datos de población para', d.name, 'en ', year, d[year]);
              else
                #console.log('No hay datos de casos de ' + d.disease + ' para', d.name, 'en ', year, ':', d[year], typeof d[year]);
              delete d[year]
              year++
          else
            console.log 'No hay datos de población para', d.name
          # Get total cases by country & disease
          d.total = d3.values(d.values).reduce(((a, b) -> a + b), 0)
        # Filter by selected countries & disease
        setupHeatMapGraph 'vaccines-measles-graph-1', data_cases, ['FIN','HUN','PRT','URY','MEX','COL'], true
        setupHeatMapGraph 'vaccines-measles-graph-2', data_cases, ['IRQ','BGR','MNG','ZAF','FRA','GEO'], false


  # Immunization Coverage Dynamic Line Graph (we can select diferente diseases & countries)
  setupImmunizationCoverageDynamicLineGraph = ->
    graph = new window.LineGraph('immunization-coverage-graph-all',
      key: 
        id: 'code'
        x: 'name'
      label: true
      margin: top: 20)
    graph.getScaleYDomain = (d) -> [0, 100]
    graph.yAxis.tickValues [0, 25, 50, 75, 100]
    d3.csv baseurl+'/data/immunization-coverage.csv', (error, data) ->
      graph.setData data.filter((d) -> d.vaccine == $('#immunization-coverage-vaccine-selector').val())
      # Update data based on selected vaccine
      $('#immunization-coverage-vaccine-selector').change (e) ->
        graph.setData data.filter((d) -> d.vaccine == $('#immunization-coverage-vaccine-selector').val())
        $('#immunization-coverage-country-1-selector').trigger('change')
      # Update active countries
      $('#immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector').change (e) ->
        $('#immunization-coverage-graph-all').find('.line-label, .line').removeClass('active');
        $('#immunization-coverage-graph-all #line-'+$('#immunization-coverage-country-1-selector').val()).addClass('active')
        $('#immunization-coverage-graph-all #line-'+$('#immunization-coverage-country-2-selector').val()).addClass('active')
        $('#immunization-coverage-graph-all #line-label-'+$('#immunization-coverage-country-1-selector').val()).addClass('active')
        $('#immunization-coverage-graph-all #line-label-'+$('#immunization-coverage-country-2-selector').val()).addClass('active')
      $('#immunization-coverage-country-1-selector').trigger('change')
    $(window).resize graph.onResize

  # Immunization Coverage Multiple Small Graph (width selected countries)
  setupImmunizationCoverageMultipleSmallGraph = ->
    current_countries = ['LKA','DZA','DEU','DNK','FRA']
    graphs = []
    d3.queue()
      .defer d3.csv, baseurl+'/data/immunization-coverage-mcv2.csv'
      .defer d3.csv, baseurl+'/data/countries.csv'
      .defer d3.json, 'http://freegeoip.net/json/'
      .await (error, data, countries, location) ->
        # Setup user country
        if location
          user_country = countries.filter (d) -> d.code2 == location.country_code
          if user_country and user_country.length > 0 and user_country[0].code
            if current_countries.indexOf(user_country[0].code) == -1
              current_countries[2] = user_country[0].code
              el = $('#immunization-coverage-graph .graph-container').eq(2)
              el.find('p').html user_country[0]['name_'+lang]
              el.find('.line-graph').attr 'id', 'immunization-coverage-'+user_country[0].code.toLowerCase()+'-graph'
        # loop through each selected country   
        current_countries.forEach (country,i) ->
          # get current disease data
          country_data = data
            .filter (d) -> d.code == country
            .map    (d) -> $.extend({}, d)
          country_data.forEach (d) ->
            delete d['2001']
            delete d['2002']
          # setup line chart
          graph = new window.LineGraph('immunization-coverage-'+country.toLowerCase()+'-graph',
            isArea: true
            key: 
              x: 'name'
              id: 'code')
          graphs.push graph
          graph.yFormat = (d) -> d+'%'
          graph.getScaleYDomain = (d) -> [0, 100]
          graph.yAxis.tickValues [50]
          graph.xAxis.tickValues [2003,2015]
          graph.addMarker
            value: 95
            label: if i%2 != 0 then '' else if lang == 'es' then 'Nivel de rebaño' else 'Herd immunity'
            align: 'left'
          # show last year label
          graph.$el.on 'draw-complete', (e) ->
            graph.setLabel 2015
            graph.container.select('.x.axis')
              .selectAll('.tick')
              .style 'display', 'block'
            graph.container.select('.tick-hover')
              .style 'display', 'none'
          graph.setData country_data
          # listen to year changes & update each graph label
          graph.$el.on 'change-year', (e, year) ->
            graphs.forEach (g) ->
              unless g == graph
                g.setLabel year
          graph.$el.on 'mouseout', (e) ->
            graphs.forEach (g) ->
              unless g == graph
                g.hideLabel()
          $(window).resize graph.onResize
       

  # World Cases Multiple Small
  setupWorldCasesMultipleSmallGraph = ->
    diseases = ['diphteria', 'measles','pertussis','polio','tetanus']
    graphs = []
    # Load data
    d3.csv baseurl+'/data/diseases-cases-world.csv', (error, data) ->
      # Get max value to create a common y scale
      maxValue1 = d3.max data, (d) -> d3.max(d3.values(d), (e) -> +e)
      maxValue2 = 100000 #d3.max data.filter((d) -> ['diphteria','polio','tetanus'].indexOf(d.disease) != -1), (d) -> d3.max(d3.values(d), (e) -> +e)
      # create a line graph for each disease
      diseases.forEach (disease) ->
        # get current disease data
        disease_data = data
          .filter (d) -> d.disease == disease
          .map    (d) -> $.extend({}, d)
        # setup line chart
        graph = new window.LineGraph(disease+'-world-graph',
          isArea: true
          margin: left: 20
          key: 
            x: 'disease'
            id: 'disease')
        graphs.push graph
        graph.xAxis.tickValues [1980, 2015]
        graph.yAxis.ticks(2).tickFormat d3.format('.0s')
        graph.yFormat = d3.format('.2s')
        graph.getScaleYDomain = -> return [0, if disease == 'measles' or disease == 'pertussis' then maxValue1 else maxValue2]
        graph.setData disease_data
        # listen to year changes & update each graph label
        graph.$el.on 'change-year', (e, year) ->
          graphs.forEach (g) ->
            unless g == graph
              g.setLabel year
        graph.$el.on 'mouseout', (e) ->
          graphs.forEach (g) ->
            unless g == graph
              g.hideLabel()
        $(window).resize graph.onResize

  setupImmunizationDiseaseBarGraph = ->
    # Load data
    d3.queue()
      .defer d3.csv, baseurl+'/data/immunization-coverage.csv'
      .defer d3.csv, baseurl+'/data/countries.csv'
      .defer d3.json, 'http://freegeoip.net/json/'
      .await (error, data, countries, location) ->
        # Setup user country
        if location
          user_country = countries.filter (d) -> d.code2 == location.country_code
          location.code = user_country[0].code
          location.name = user_country[0]['name_'+lang]
        # Filter data
        herdImmunity = 
          'MCV1': 95
          'Pol3': 80
          'DTP3': 80
        data = data.filter (d) -> excludedCountries.indexOf(d.code) == -1
        # Data parse & sorting funtions
        data_parser = (d) ->
          obj = 
            key:   d.code
            name:  getCountryName(countries, d.code, lang)
            value: +d['2015']
          if location and d.code == location.code
            obj.active = true
          return obj
        data_sort = (a,b) -> b.value-a.value
        # loop through each graph
        $('.immunization-coverage-disease-graph').each ->
          $el     = $(this)
          disease = $el.data('disease')
          vaccine = $el.data('vaccine')
          # Get graph data & value
          graph_data = data
            .filter((d) -> d.vaccine == vaccine and d['2015'] != '')
            .map(data_parser)
            .sort(data_sort)
          if location
            graph_value = graph_data.filter (d) -> d.key == location.code
          # Setup graph
          graph = new window.BarGraph(disease+'-immunization-bar-graph',
            aspectRatio: 0.25
            label:
              format: (d) -> +d+'%'
            key: x: 'name'
            margin:
              top: 20)
          marker = 
            value: herdImmunity[vaccine]
            label: if lang == 'es' then 'Nivel de rebaño' else 'Herd immunity'
          if vaccine == 'DTP3'
            marker.label = if lang == 'es' then 'Recomendación OMS' else 'WHO recommendation'
          graph
            .addMarker marker
            .setData graph_data
          # Setup graph value
          if graph_value and graph_value.length > 0
            $el.find('.immunization-country').html location.name
            $el.find('.immunization-data').html '<strong>' + graph_value[0].value + '%</strong>'
            $el.find('.immunization-description').show()
          # On resize
          $(window).resize -> graph.onResize()
  
  ###
  setupGuatemalaCoverageLineGraph = ->
    graph = new window.LineGraph('guatemala-coverage-mmr',
      #isArea: true
      margin: 
        left: 0
        right: 0
        bottom: 20)
    graph.xAxis.tickValues [2000, 2005, 2010, 2015]
    graph.yAxis
      .tickValues [0, 25, 50, 75, 100]
      .tickFormat (d) -> d+'%'
    graph.loadData baseurl+'/data/guatemala-coverage-mmr.csv'
    graph.$el.on 'draw-complete', (e) ->
      line = graph.container.select('.line')
      console.log line.node()
      length = line.node().getTotalLength();
      line
        .attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
          .delay(5000)
          .duration(5000)
          .ease(d3.easeSinInOut)
          .attr('stroke-dashoffset', 0)

  if $('#guatemala-coverage-mmr').length > 0
    setupGuatemalaCoverageLineGraph()
  ###

  if $('#video-map-polio').length > 0
    setVideoMapPolio()

  ###
  ## Vaccine map
  if $('#vaccine-map').length > 0
    vaccine_map = new VaccineMap 'vaccine-map'
    #vaccine_map.getData = true  #  Set true to download a polio cases csv
    vaccine_map.getPictureSequence = true   # Set true to download a map picture sequence
    vaccine_map.init baseurl+'/data/diseases-polio-cases.csv', baseurl+'/data/map-polio-cases.csv'
    $(window).resize vaccine_map.onResize
  ###

  if $('.vaccines-disease-graph').length > 0
    setupVaccineDiseaseHeatmapGraph()

  ###
  # Vaccine all diseases graph
  if $('#vaccines-all-diseases-graph').length > 0
    graph_vaccine_all_diseases = new VaccineDiseaseGraph('vaccines-all-diseases-graph')
    graph_vaccine_all_diseases.init $('#disease-selector .active a').attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val()
    $(window).resize graph_vaccine_all_diseases.onResize
    # Update graph based on selected disease
    $('#disease-selector a').click (e) ->
      e.preventDefault()
      $(this).tab 'show'
      graph_vaccine_all_diseases.init $(this).attr('href').substring(1), $('#vaccines-all-diseases-graph #order-selector').val()
      return
    # Update graph baseon on order selector
    $('#vaccines-all-diseases-graph #order-selector').change (d) ->
      graph_vaccine_all_diseases.init $('#disease-selector .active a').attr('href').substring(1), $(this).val()
  ###

  if $('#immunization-coverage-graph-all').length > 0
    setupImmunizationCoverageDynamicLineGraph()

  if $('#immunization-coverage-graph').length > 0
    setupImmunizationCoverageMultipleSmallGraph()

  if $('#world-cases').length > 0
    setupWorldCasesMultipleSmallGraph()
  
  if $('.immunization-coverage-disease-graph').length > 0
    setupImmunizationDiseaseBarGraph()

  if $('#measles-world-map-graph').length > 0
    setupMeaslesWorldMapGraph()

  if $('#vaccine-confidence-graph').length > 0
    setupVaccineConfidenceBarGraph()

  if $('#vaccine-bcg-cases-graph').length > 0
    setupVaccineBcgCasesMap()

  if $('#vaccine-bcg-stockouts').length > 0
    setupVaccineBcgStockoutsMap()

  if $('#vaccine-prices-graph').length > 0
    setupVaccinePricesGraph()

  # Setup vaccines prices
  if $('body').hasClass('prices') ||  $('body').hasClass('precios')
    new VaccinesPrices lang, baseurl

) jQuery