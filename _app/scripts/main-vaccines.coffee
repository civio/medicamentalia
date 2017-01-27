# Main script for vaccines articles

(($) ->

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')


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
    wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio')
    wrapper.src = 'http://www.youtube.com/embed/l1F2Xd5FFlQ?controls=0&showinfo=0&hd=1'
    popcorn = Popcorn(wrapper)
    notes = 2016 - 1980
    i = 0
    while i <= notes
      popcorn.footnote
        start:  1.6222 * i
        end:    1.6222 * (i + 1)
        text:   1980 + i
        target: 'video-map-polio-description'
      i++
    # Show cover when video ended
    wrapper.addEventListener 'ended', (e) ->
      $('.video-map-polio-cover').fadeIn()
      $('#video-map-polio-description').fadeTo 300, 0
      popcorn.currentTime 0
    # Show video when play btn clicked
    $('#video-map-polio-play-btn').click (e) ->
      e.preventDefault()
      popcorn.play()
      $('.video-map-polio-cover').fadeOut()
      $('#video-map-polio-description').fadeTo 300, 1


  # Measles cases Heatmap Graph
  setupHeatMapGraph = (id, data, countries, disease) ->
    data = data
      .filter (d) -> countries.indexOf(d.code) != -1 and d.disease == disease and d3.values(d.values).length > 0
      .sort (a,b) -> a.total - b.total
    graph = new window.HeatmapGraph(id,
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


  setupVaccineDiseaseHeatmapGraph = ->
    d3.queue()
      .defer d3.csv, baseurl+'/assets/data/diseases-cases.csv'
      .defer d3.csv, baseurl+'/assets/data/population.csv'
      .await (error, data_cases, data_population) ->
        delete data_cases.columns  # we don't need the columns attribute
        data_cases.forEach (d) ->
          d.disease = d.disease.toLowerCase()
          if d.year_introduction
            d.year_introduction = +d.year_introduction.replace('prior to', '')
          d.cases = {}
          d.values = {}
          # set values as cases/1000 habitants
          populationItem = data_population.filter (country) -> country.code == d.code
          if populationItem.length > 0
            year = 1980
            while year < 2016
              if d[year]
                population = +populationItem[0][year]
                if population != 0
                  d.cases[year] = +d[year]
                  d.values[year] = 1000 * +d[year] / population
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
        setupHeatMapGraph 'vaccines-measles-graph-1', data_cases, ['FIN','HUN','PRT','URY','MEX','COL'], 'measles'
        setupHeatMapGraph 'vaccines-measles-graph-2', data_cases, ['IRQ','BGR','MNG','ZAF','FRA','GEO'], 'measles'


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
    d3.csv baseurl+'/assets/data/immunization-coverage.csv', (error, data) ->
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

  # Immunization Coverage Line Graph (width selected countries)
  setupImmunizationCoverageLineGraph = ->
    countries = ['FRA','DNK','DZA','LKA']
    graph = new window.LineGraph('immunization-coverage-graph', 
      key: 
        id: 'code'
        x: 'name'
      label: true
      margin: top: 20)
    graph.getScaleYDomain = (d) -> [0, 100]
    graph.yAxis.tickValues [0,25,50,75,100]
    graph.xAxis.tickValues [2001,2003,2005,2007,2009,2011,2013,2015]
    graph.addMarker
      value: 95
      label: 'Nivel de rebaño'
      align: 'left'
    d3.csv baseurl+'/assets/data/immunization-coverage-mcv2.csv', (error, data) ->
      graph.setData data.filter((d) -> countries.indexOf(d.code) != -1)
    $(window).resize graph.onResize

  # World Cases Multiple Small
  setupWorldCasesMultipleSmallGraph = ->
    console.log 'setupWorldCasesMultipleSmallGraph'
    diseases = ['diphteria', 'measles','pertussis','polio','tetanus']
    # Load data
    d3.csv baseurl+'/assets/data/diseases-cases-world.csv', (error, data) ->
      # Get max value to create a common y scale
      maxValue1 = d3.max data, (d) -> d3.max(d3.values(d), (e) -> +e)
      maxValue2 = d3.max data.filter((d) -> ['diphteria','polio','tetanus'].indexOf(d.disease) != -1), (d) -> d3.max(d3.values(d), (e) -> +e)
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
          key: x: 'disease')
        graph.xAxis.tickValues [1980, 2015]
        graph.yAxis.ticks(2).tickFormat d3.format('.0s')
        graph.getScaleYDomain = -> return [0, if disease == 'measles' or disease == 'pertussis' then maxValue1 else maxValue2]
        graph.setData disease_data
        $(window).resize graph.onResize

  setupImmunizationDiseaseBarGraph = ->
    # Load data
    d3.queue()
      .defer d3.csv, baseurl+'/assets/data/immunization-coverage.csv'
      .defer d3.csv, baseurl+'/assets/data/countries.csv'
      .await (error, data, countries) ->
        # Setup current country -> TODO!!! we have to get user country
        country = 'ESP'
        # Filter data
        excludedCountries = ['TUV','NRU','PLW','VGB','MAF','SMR','GIB','TCA','LIE','MCO','SXM','FRO','MHL','MNP','ASM','KNA','GRL','CY','BMU','AND','DMA','IMN','ATG','SYC','VIR','ABW','FSM','TON','GRD','VCT','KIR','CUW','CHI','GUM','LCA','STP','WSM','VUT','NCL','PYF','BRB']
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
          if d.code == country
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
          console.table graph_data
          graph_value = graph_data.filter((d) -> d.key == country)
          # Setup graph
          graph = new window.BarGraph(disease+'-immunization-bar-graph',
            aspectRatio: 0.25
            label: true
            key: x: 'name'
            margin:
              top: 20
              bottom: 0)   
          graph
            .addMarker
              value: herdImmunity[vaccine]
              label: 'Nivel de rebaño'
            .setData graph_data
          # Setup graph value
          if graph_value.length > 0
            $el.find('.immunization-data').html '<strong>' + graph_value[0].value + '%</strong>'
          # On resize
          $(window).resize -> graph.onResize()
  
  
  if $('#video-map-polio').length > 0
    setVideoMapPolio()

  ###
  // Vaccine map
  if ($('#vaccine-map').length > 0) {
    var vaccine_map = new VaccineMap('vaccine-map');
    //vaccine_map.getData = true; // Set true to download a polio cases csv
    //vaccine_map.getPictureSequence = true; // Set true to download a map picture sequence
    vaccine_map.init(baseurl+'/assets/data/diseases-polio-cases.csv', baseurl+'/assets/data/map-polio-cases.csv');
    $(window).resize( vaccine_map.onResize );
  }
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
    setupImmunizationCoverageLineGraph()

  if $('#world-cases').length > 0
    setupWorldCasesMultipleSmallGraph()
  
  if $('.immunization-coverage-disease-graph').length > 0
    setupImmunizationDiseaseBarGraph()

) jQuery