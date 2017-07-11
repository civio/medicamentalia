# Other articles site setup (superbugs, ...)

(($) ->

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')

  # get country name auxiliar method
  getCountryName = (countries, code, lang) ->
    item = countries.filter (d) -> d.code2 == code
    if item.length
      item[0]['name_'+lang]
    else
      console.error 'No country name for code', code
  
  # Setup bar graphs
  if $('.bar-graph').length > 0
    # markers object
    markers =
      'antibiotics-graph':
        value: 36
        label: if lang == 'es' then 'Media EU28' else 'EU28 Average'
      'antibiotics-animals-graph':
        value: 107.8
        label: if lang == 'es' then 'Media' else 'Average'

    d3.queue()
      .defer d3.csv, baseurl+'/data/antibiotics.csv'
      .defer d3.csv, baseurl+'/data/antibiotics-animals.csv'
      .defer d3.csv, baseurl+'/data/countries.csv'
      .await (error, data_antibiotics, data_antibiotics_animals, countries) ->
        # add country names to data
        data_antibiotics.forEach (d) ->
          d.name = getCountryName(countries, d.label, lang)
        data_antibiotics_animals.forEach (d) ->
          d.name = getCountryName(countries, d.label, lang)
        # loop through each bar graph
        $('.bar-graph').each ->
          id = $(this).attr('id')
          graph = new window.BarGraph(id,
            aspectRatio: 0.4
            label: true
            key: 
              id: 'label'
              x: 'name')
          graph
            .addMarker markers[id]
            .setData if id == 'antibiotics-graph' then data_antibiotics else data_antibiotics_animals
          $(window).resize graph.onResize

  # Setup iceberg graph
  if $('#pharma-categories-amounts').length > 0
    d3.csv baseurl+'/data/pharma-categories-amounts.csv', (error, data) ->
      # setup graph
      graph = new window.IcebergGraph('pharma-categories-amounts',
        aspectRatio: 0.5
        margin: 
          top: 20
          bottom: 0
          left: 100
          right: 20
        label:
          y: ['Declarado', 'Oculto']
        key:
          x: 'category'
          up: 'declared'
          down: 'hidden')
      graph.setData data
      $(window).resize graph.onResize

  # Setup doctors average
  if $('#pharma-doctors-average').length > 0
    d3.csv baseurl+'/data/pharma-doctors-average.csv', (error, data) ->
      console.table data

  # Setup beeswarm graph
  if $('.pharma-transfers').length > 0
    d3.csv baseurl+'/data/pharma-transfers.csv', (error, data) ->
      categories = ['charges', 'travels', 'fees', 'relateds']
      # get maximum number of doctors per pharma
      totals = []
      categories.forEach (category) ->
        totals.push d3.max(data, (d) -> +d[category+'_doctors_total'])
      totalsMax = d3.max(totals)
      # populate select
      data.forEach (d, i) ->
        d.id = i
        $('#pharma-selector select').append '<option value="'+d.id+'">'+d.laboratory+'</option>'
      # setup a beeswarm chart for each category
      categories.forEach (category, i) ->
        data_category = data
          # filter lines without values or with 0 doctors
          .filter (d) -> d[category+'_doctors_percent'] != '' and d[category+'_doctors_total'] != ''
          .map (d) ->
            id: d.id
            laboratory: d.laboratory
            subsidiaries: d.subsidiaries
            value: d[category+'_doctors_percent']*100
            size: +d[category+'_doctors_total']
            import: Math.round(+d[category+'_value'])
        # setup graph
        graph = new window.BeeswarmGraph('pharma-transfers-'+category,
          margin:
            top: 0
            bottom: 0
            left: 0
            right: 20
          key:
            id: 'laboratory'
            size: 'size'
            color: 'value'
          legend: i == 0)
        graph.$tooltip = $('#pharma-transfers-tooltip')
        graph.getSizeDomain = -> return [0, totalsMax]
        graph.setData data_category
        $(window).resize graph.onResize
      # filter pharma
      $('#pharma-selector select').change (e) ->
        value = $(e.target).val()
        if value == '-1'
          categories.forEach (category) ->
            $('#pharma-transfers-'+category+' .cell').removeClass('desactive').removeClass('active');
        else
          categories.forEach (category) ->
            $('#pharma-transfers-'+category+' .cell').removeClass('active').addClass('desactive');
            $('#pharma-transfers-'+category+' #cell-'+value).removeClass('desactive').addClass('active')

) jQuery
