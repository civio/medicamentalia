class window.BarHorizontalGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Bar Horizontal Graph', id, options
    super id, options
    return @


  # Main methods
  # ------------

  # override svg & use html div instead
  setSVG: ->
    @container = d3.select('#'+@id)
      .attr 'class', 'bar-horizontal-graph'

  dataParser: (data) ->
    data.forEach (d) => 
      d[@options.key.x] = +d[@options.key.x]
    return data

  setScales: ->
    return @

  drawScales: ->
    return @

  drawGraph: ->
    console.log 'bar horizontal data', @data
    # draw bars
    @container.selectAll('.bar')
      .data(@data)
    .enter().append('div')
      .call @setBars
    return @

  
  setBars: (element) =>
    if @options.key.id
      element.attr 'id', (d) => d[@options.key.id]
      element.append('div')
        .attr 'class', 'bar-title'
        .html (d) => d[@options.key.id]
    element.append('div')
      .attr 'class', 'bar'
      .style 'width', (d) => 
        return d[@options.key.x]+'%'
      .append('span')
        .html (d) => Math.round(d[@options.key.x])+'%'
