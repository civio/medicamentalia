class window.ScatterplotVaccinesPricesGraph extends window.ScatterplotGraph

  # Constructor
  # -----------

  constructor: (id, options) ->
    #console.log 'Scatterplot Discrete Graph', id, options
    super id, options
    @vaccines = ['IPV','MMR','HepB-pediátrica','DTaP','Tdap']
    return @


  # Main methods
  # ------------

  dataParser: (data) -> 
    return data

  drawScales: ->
    super() 
    @line = d3.line()
      #.curve d3.curveCatmullRom
      .x (d) => @x d[@options.key.x]
      .y (d) => @y d[@options.key.y]
    return @

  drawGraph: ->
    # draw lines
    lineData = d3.nest()
      .key (d) -> d.vaccine
      .entries @data.filter (d) => @vaccines.indexOf(d.vaccine) != -1
    console.log lineData
    @container.selectAll('.dot-line')
      .data lineData
    .enter().append('path')
      .attr 'class', 'dot-line'
      .style 'stroke', (d) => @color d.key
      .style 'fill', 'none'
      .datum (d) -> d.values
      .attr 'd', @line
    super()
    return @

   updateGraphDimensions: ->
    super()
    @container.selectAll('.dot-line')
      .attr 'd', @line
    return @

  getDotId: (d) ->
    return 'dot-'+d.country+'-'+d.vaccine

  getDotLabelId: (d) ->
    return 'dot-label-'+d.country+'-'+d.vaccine

  getDotLabelText: (d) -> 
    return ''

  getDotFill: (d) ->
    if @vaccines.indexOf(d.vaccine) != -1
      return @color d[@options.key.color]
    else
      return '#ddd'
  
  setTooltipData: (d) ->
    dosesFormat = d3.format('.0s')
    @$tooltip
      .find '.tooltip-inner .title'
      .html d.country
    @$tooltip
      .find '.tooltip-inner .vaccine'
      .html d.vaccine
    @$tooltip
      .find '.tooltip-inner .price'
      .html d.price
    company = ''
    if d.company
      company = '('+d.company
      if d.company2
        company += ','+d.company2
      if d.company3
        company += ','+d.company3
      company += ')'
    @$tooltip
      .find '.tooltip-inner .company'
      .html company
