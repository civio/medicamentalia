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
        label: if $('body').data('lang') == 'es' then 'Media EU28' else 'EU28 Average'
      'antibiotics-animals-graph':
        value: 107.8
        label: if $('body').data('lang') == 'es' then 'Media' else 'Average'

    d3.queue()
      .defer d3.csv, baseurl+'/assets/data/antibiotics.csv'
      .defer d3.csv, baseurl+'/assets/data/antibiotics-animals.csv'
      .defer d3.csv, baseurl+'/assets/data/countries.csv'
      .await (error, data_antibiotics, data_antibiotics_animals, countries) ->
        # add country names to data
        data_antibiotics.forEach (d) ->
          d.name = getCountryName(countries, d.label, lang)
        data_antibiotics_animals.forEach (d) ->
          d.name = getCountryName(countries, d.label, lang)
        console.table data_antibiotics
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
) jQuery
