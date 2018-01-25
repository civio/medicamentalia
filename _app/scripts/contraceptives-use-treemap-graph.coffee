class window.ContraceptivesUseTreemapGraph extends window.TreemapGraph

  # overdrive data Parser
  dataParser: (data, country_code, country_name) ->
    # TODO!!! Get current country & add select in order to change it
    data_country = data.filter (d) -> d.code == country_code
    # set caption country name
    $('#treemap-contraceptives-use-country').html country_name
    # parse data
    parsedData = [{id: 'r'}] # add treemap root
    @options.methodsKeys.forEach (key,i) =>
      if data_country[0][key]
        parsedData.push
          id: key.toLowerCase().replace(' ', '-')
          name: '<strong>' + @options.methodsNames[i] + '</strong><br/>' + Math.round(data_country[0][key]) + '%'
          value: data_country[0][key]
          parent: 'r'
      else
        console.log "There's no data for " + key
    return parsedData

  # overdrive set data
  setData: (data, country_code, country_name) ->
    @originalData = data
    @data = @dataParser(@originalData, country_code, country_name)
    @drawGraph()
    @setContainerOffset()
    @$el.trigger 'draw-complete'
    return @

  updateData: (country_code, country_name) ->
    @data = @dataParser(@originalData, country_code, country_name)
    @updateGraph()
    return @

  # overdrive resize
  onResize: =>
    super()
    @setContainerOffset()
    return @

  setContainerOffset: ->
    @$el.css('top', ($(window).height()-@$el.height())*0.5)