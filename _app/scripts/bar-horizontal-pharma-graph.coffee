class window.BarHorizontalPharmaGraph

  # Constructor
  # -----------

  constructor: (id, data) ->
    console.log 'Bar Horizontal Pharma Graph', id
    @id       = id
    @setData data
    @drawGraph()
    return @


  # Main methods
  # ------------

  setData: (data) ->
    @data = @dataParser(data)
    maxDeclared = d3.max @data, (d) -> d.declared
    maxHidden   = d3.max @data, (d) -> d.hidden
    @maxValue   = d3.max [maxDeclared, maxHidden]
    console.log @maxValue
    return @

  dataParser: (data) ->
    data.forEach (d) => 
      d.hidden   = +d.hidden
      d.declared = +d.declared
    return data

  drawGraph: ->
    # draw bars
    d3.select('#'+@id).selectAll('div')
      .data(@data)
    .enter().append('div')
      .call @setBars
    return @

  setBars: (element) =>
    element.append('div')
      .attr 'class', 'bar-title'
      .html (d) -> d.category
    element.append('div')
      .attr 'class', 'bar bar-declared'
      .style 'width',  (d) => (100*d.declared/@maxValue)+'%'
      .append('span')
        .html (d) -> d.declared.toFixed(1)+' €'
    element.append('div')
      .attr 'class', 'bar bar-hidden'
      .style 'width',  (d) => (100*d.hidden/@maxValue)+'%'
      .append('span')
        .html (d) -> d.hidden.toFixed(1)+' €'
