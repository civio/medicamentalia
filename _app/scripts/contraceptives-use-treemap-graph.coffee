class window.ContraceptivesUseTreemapGraph extends window.TreemapGraph

  # overdrive data Parser
  dataParser: (data, country_code, country_name) ->
     # set parsedData array
    parsedData = [{id: 'r'}] # add treemap root
    # TODO!!! Get current country & add select in order to change it
    data_country = data.filter (d) -> d.code == country_code
    console.log data_country[0]
    if data_country[0]
      # set methods object
      methods = {}
      @options.methodsKeys.forEach (key,i) =>
        if data_country[0][key]
          methods[key] =
            id: key.toLowerCase().replace(/ /g, '-').replace(')', '').replace('(', '')
            name: @options.methodsNames[i]
            value: +data_country[0][key]
        else
          console.log "There's no data for " + key
      # filter methods with value < 5% & add to Other modern methods
      for key,method of methods
        if key != 'Other modern methods' and key != 'Any traditional method' and method.value < 5
          methods['Other modern methods'].value += method.value
          delete methods[key]
     
      for key,method of methods
        parsedData.push
          id: method.id
          raw_name: method.name
          name: '<strong>' + method.name + '</strong><br/>' + Math.round(method.value) + '%'
          value: method.value
          parent: 'r'
      parsedDataSorted = parsedData.sort (a,b) -> if a.value and b.value then b.value-a.value else 1
      # set caption country name
      $('#treemap-contraceptives-use-country').html country_name
      $('#treemap-contraceptives-use-any-method').html Math.round(data_country[0]['Any modern method'])
      $('#treemap-contraceptives-use-method').html parsedDataSorted[0].raw_name
    else
      console.warn 'No data country for '+country_code
      # TODO!!! What we do if there's no data for user's country
    return parsedData

  # overdrive set data
  setData: (data, country_code, country_name) ->
    @originalData = data
    @data = @dataParser(@originalData, country_code, country_name)
    @drawGraph()
    #@setContainerOffset()
    @$el.trigger 'draw-complete'
    return @

  updateData: (country_code, country_name) ->
    @data = @dataParser(@originalData, country_code, country_name)
    @updateGraph()
    return @

  # overdrive node class
  getNodeClass: (d) ->
    return 'node node-'+d.id

  ### overdrive resize
  onResize: =>
    super()
    @setContainerOffset()
    return @

  setContainerOffset: ->
    @$el.css('top', ($(window).height()-@$el.height())*0.5)
  ###