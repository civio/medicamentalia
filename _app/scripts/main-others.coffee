# Other articles site setup (superbugs, ...)

###
setBarGraph = (id, url, marker) ->
  console.log 'setBarGraph', marker
  graph = new window.BarGraph(id, 
    aspectRatio: 0.4
    label: true
    key: 
      id: 'label'
      x: 'label')
  graph
    .addMarker marker
    .loadData url
  $(window).resize graph.onResize
###

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
      console.log id
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

###
  # Antibiotics bar graph
  if $('#antibiotics-animals-graph').length > 0
    #setBarGraph 'antibiotics-animals-graph', $('body').data('baseurl')+'/assets/data/antibiotics-animals.csv', 
    #  value: 107.8
    #  label: if $('body').data('lang') == 'es' then 'Media' else 'Average'
    graph_animals = new window.BarGraph('antibiotics-animals-graph',
      aspectRatio: 0.4
      label: true
      key: 
        id: 'label'
        x: 'label')
    # graph_animals.addMarker
    #   value: 107.8
    #   label: if $('body').data('lang') == 'es' then 'Media' else 'Average'
    graph_animals.loadData $('body').data('baseurl')+'/assets/data/antibiotics-animals.csv'
    $(window).resize graph_animals.onResize


  # Antibiotics bar graph
  if $('#antibiotics-graph').length > 0
###

) jQuery
