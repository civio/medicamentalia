class window.BarHorizontalStackedGraph extends window.BarHorizontalGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    super id, options
    return @


  # Main methods
  # ------------

  # override svg & use html div instead
  setSVG: ->
    @container = d3.select('#'+@id)
      .attr 'class', 'bar-horizontal-graph bar-horizontal-stacked-graph'

  dataParser: (data) ->
    return data
  
  setBars: (element) =>
    element.append('div')
      .attr 'class', 'bar-title'
      .html (d) -> d.name
    element.selectAll('bar')
      .data (d) -> return d.values
    .enter().append('div')
      .attr 'class', (d) -> 'bar bar-'+d.name.replace(/ |\//g,'-')
      .style 'width', (d) -> d.value+'%'
    element.append('span')
      .html (d) => Math.round(d.total)+'%'
