# Other articles site setup (superbugs, ...)

(($) ->
  
  if $('.bar-graph').length > 0
    # markers object
    markers =
      'antibiotics-graph':
        value: 36
        label: if $('body').data('lang') == 'es' then 'Media EU28' else 'EU28 Average'
      'antibiotics-animals-graph':
        value: 107.8
        label: if $('body').data('lang') == 'es' then 'Media' else 'Average'
    # loop through each bar graph
    $('.bar-graph').each ->
      id = $(this).attr('id')
      url = if id == 'antibiotics-animals-graph' then 'antibiotics-animals.csv' else 'antibiotics.csv'
      graph = new window.BarGraph(id,
        aspectRatio: 0.4
        label: true
        key: 
          id: 'label'
          x: 'label')
      graph
        .addMarker markers[id]
        .loadData $('body').data('baseurl')+'/assets/data/'+url
      $(window).resize graph.onResize

) jQuery
