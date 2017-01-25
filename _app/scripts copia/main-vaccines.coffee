# Main script for vaccines articles

(($) ->

  # Init Tooltips
  $('[data-toggle="tooltip"]').tooltip()

  console.log 'main vaccines coffee'

  base = new window.BaseGraph('myId',
      margin: top: 20
      aspectRatio: 1)
  
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
      return
  # Vaccine measles graph 1
  if $('#vaccines-measles-graph-1').length > 0
    countries_1 = [
      'FIN'
      'HUN'
      'PRT'
      'URY'
      'MEX'
      'COL'
    ]
    graph_vaccine_measles_1 = new VaccineDiseaseGraph('vaccines-measles-graph-1')

    graph_vaccine_measles_1.filter = (d) ->
      countries_1.indexOf(d.code) != -1

    graph_vaccine_measles_1.init 'measles', 'year'
    $(window).resize graph_vaccine_measles_1.onResize
  # Vaccine measles graph 2
  if $('#vaccines-measles-graph-2').length > 0
    countries_2 = [
      'IRQ'
      'BGR'
      'MNG'
      'ZAF'
      'FRA'
      'GEO'
    ]
    graph_vaccine_measles_2 = new VaccineDiseaseGraph('vaccines-measles-graph-2')

    graph_vaccine_measles_2.filter = (d) ->
      countries_2.indexOf(d.code) != -1

    graph_vaccine_measles_2.init 'measles', 'year'
    $(window).resize graph_vaccine_measles_2.onResize
  ###

  ###
  // Vaccine map
  if ($('#vaccine-map').length > 0) {
    var vaccine_map = new VaccineMap('vaccine-map');
    //vaccine_map.getData = true; // Set true to download a polio cases csv
    //vaccine_map.getPictureSequence = true; // Set true to download a map picture sequence
    vaccine_map.init($('body').data('baseurl')+'/assets/data/diseases-polio-cases.csv', $('body').data('baseurl')+'/assets/data/map-polio-cases.csv');
    $(window).resize( vaccine_map.onResize );
  }
  ###

  ###
  # Video of polio map cases
  if $('#video-map-polio').length > 0
    wrapper = Popcorn.HTMLYouTubeVideoElement('#video-map-polio')
    wrapper.src = 'http://www.youtube.com/embed/l1F2Xd5FFlQ?controls=0&showinfo=0&hd=1'
    popcorn = Popcorn(wrapper)
    i = undefined
    notes = 2016 - 1980
    i = 0
    while i <= notes
      popcorn.footnote
        start: 1.6222 * i
        end: 1.6222 * (i + 1)
        text: 1980 + i
        target: 'video-map-polio-description'
      i++
    # Show cover when video ended
    wrapper.addEventListener 'ended', ((e) ->
      $('.video-map-polio-cover').fadeIn()
      $('#video-map-polio-description').fadeTo 300, 0
      popcorn.currentTime 0
      return
    ), false
    # Show video when play btn clicked
    $('#video-map-polio-play-btn').click (e) ->
      e.preventDefault()
      popcorn.play()
      $('.video-map-polio-cover').fadeOut()
      $('#video-map-polio-description').fadeTo 300, 1
      return
  # Immunization coverage line grah (all countries)
  if $('#immunization-coverage-graph-all').length > 0
    graph_immunization = new LineGraph

    graph_immunization.getScaleYDomain = (d) ->
      [
        0
        100
      ]

    graph_immunization.dataFilter = (d) ->
      d.vaccine == $('#immunization-coverage-vaccine-selector').val()

    graph_immunization.dataSort = (a, b) ->
      if a.code == $('#immunization-coverage-country-1-selector').val() or a.code == $('#immunization-coverage-country-2-selector').val() then 1 else -1

    graph_immunization.activeLines = [
      $('#immunization-coverage-country-1-selector').val()
      $('#immunization-coverage-country-2-selector').val()
    ]
    graph_immunization.setup 'immunization-coverage-graph-all'
    graph_immunization.yAxis.tickValues [
      0
      25
      50
      75
      100
    ]
    graph_immunization.loadData $('body').data('baseurl') + '/assets/data/immunization-coverage.csv'
    # Update data based on selected vaccine
    $('#immunization-coverage-vaccine-selector, #immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector').change (e) ->
      graph_immunization.activeLines = [
        $('#immunization-coverage-country-1-selector').val()
        $('#immunization-coverage-country-2-selector').val()
      ]
      graph_immunization.update()
      return
    $(window).resize graph_immunization.onResize
  # Immunization coverage line grah
  if $('#immunization-coverage-graph').length > 0
    base = new BaseGraph('myId',
      margin: top: 20
      aspectRatio: 1)
    $el = $('#immunization-coverage-graph')
    graph_immunization = new LineGraph

    graph_immunization.getScaleYDomain = (d) ->
      [
        0
        100
      ]

    graph_immunization.dataFilter = (d) ->
      $el.data('countries').indexOf(d.code) != -1

    graph_immunization.margin.top = 20
    graph_immunization.setup 'immunization-coverage-graph'
    graph_immunization.yAxis.tickValues [
      0
      25
      50
      75
      100
    ]
    graph_immunization.xAxis.tickValues [
      2001
      2003
      2005
      2007
      2009
      2011
      2013
      2015
    ]
    graph_immunization.addMarker
      value: 95
      label: 'Nivel de rebaño'
      alignment: 'left'
    graph_immunization.loadData $('body').data('baseurl') + '/assets/data/immunization-coverage-mcv2.csv'
    $(window).resize graph_immunization.onResize
  # Multiple small world cases area graph
  if $('#world-cases').length > 0
    diseases = [
      'diphteria'
      'measles'
      'pertussis'
      'polio'
      'tetanus'
    ]
    d3.csv $('body').data('baseurl') + '/assets/data/diseases-cases-world.csv', (error, data) ->
      # Get max value to create a common y scale
      maxValue1 = d3.max(data, (d) ->
        d3.max d3.values(d), (e) ->
          +e
      )
      maxValue2 = d3.max(data.filter((d) ->
        [
          'diphteria'
          'polio'
          'tetanus'
        ].indexOf(d.disease) != -1
      ), (d) ->
        d3.max d3.values(d), (e) ->
          +e
      )
      # Create a line graph for each disease
      diseases.forEach (disease) ->
        # get current disease data
        disease_data = data.filter((d) ->
          d.disease == disease
        ).map((d) ->
          $.extend {}, d
        )
        # setup line chart
        graph_world = new LineGraph

        graph_world.getScaleYDomain = ->
          [
            0
            if disease == 'measles' or disease == 'pertussis' then maxValue1 else maxValue2
          ]

        graph_world.isArea = true
        graph_world.margin.left = 20
        graph_world.setup disease + '-world-graph'
        graph_world.xAxis.tickValues [
          1980
          2015
        ]
        graph_world.yAxis.ticks(2).tickFormat d3.format('.0s')
        graph_world.setData disease_data
        return
      return
  # Immunization coverage by disease bar graph
  if $('.immunization-coverage-disease-graph').length > 0
    # Load data
    d3.csv $('body').data('baseurl') + '/assets/data/immunization-coverage.csv', (error, data) ->
      # Setup current country -> TODO!!! we have to get user country
      country = 'ESP'
      # Filter data
      excludedCountries = [
        'TUV'
        'NRU'
        'PLW'
        'VGB'
        'MAF'
        'SMR'
        'GIB'
        'TCA'
        'LIE'
        'MCO'
        'SXM'
        'FRO'
        'MHL'
        'MNP'
        'ASM'
        'KNA'
        'GRL'
        'CY'
        'BMU'
        'AND'
        'DMA'
        'IMN'
        'ATG'
        'SYC'
        'VIR'
        'ABW'
        'FSM'
        'TON'
        'GRD'
        'VCT'
        'KIR'
        'CUW'
        'CHI'
        'GUM'
        'LCA'
        'STP'
        'WSM'
        'VUT'
        'NCL'
        'PYF'
        'BRB'
      ]
      herdImmunity = 
        'MCV1': 95
        'Pol3': 80
        'DTP3': 80
      data = data.filter((d) ->
        excludedCountries.indexOf(d.code) == -1
      )
      # Data parse & sorting funtions

      data_parser = (d) ->
        obj = 
          label: d.code
          value: +d['2015']
        if d.code == country
          obj.active = true
        obj

      data_sort = (a, b) ->
        b.value - (a.value)

      # loop through each graph
      $('.immunization-coverage-disease-graph').each ->
        `var $el`
        $el = $(this)
        disease = $el.data('disease')
        vaccine = $el.data('vaccine')
        # Get graph data & value
        graph_data = data.filter((d) ->
          d.vaccine == vaccine and d['2015'] != ''
        ).map(data_parser).sort(data_sort)
        graph_value = graph_data.filter((d) ->
          d.label == country
        )
        # Setup graph
        graph = new BarGraph(disease + '-immunization-bar-graph', null)
        # Setup graph aspect ratio
        graph.aspectRatio = 0.25
        graph.margin.top = 20
        graph.margin.bottom = 0
        graph.addMarker
          value: herdImmunity[vaccine]
          label: 'Nivel de rebaño'
        # Init graph
        graph.init()
        # Set data graph
        graph.onDataReady error, graph_data
        # Setup graph value
        if graph_value.length > 0
          $el.find('.immunization-data').html '<strong>' + graph_value[0].value + '%</strong>'
        # On resize
        $(window).resize ->
          graph.onResize()
          return
        return
      return
      ###
) jQuery