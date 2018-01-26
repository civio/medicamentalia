class window.ContraceptivesUseTreemapGraph extends window.TreemapGraph

  # overdrive data Parser
  dataParser: (data, country_code, country_name) ->
    ### merge Vaginal barrier methods, Lactational amenorrhea method & Emergency contraception in Other modern methods
    getKeyValue = (key, data) ->
      if key != 'other-modern-methods'
        return data[key]
      else
        return data[key]+merge_keys.reduce((sum, value) -> sum+data[value])
    ###
    # TODO!!! Get current country & add select in order to change it
    data_country = data.filter (d) -> d.code == country_code
    console.log data_country[0]
    # set caption country name
    $('#treemap-contraceptives-use-country').html country_name
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
    console.log methods
    # filter methods with value < 5% & add to Other modern methods
    for key,method of methods
      if key != 'Other modern methods' and key != 'Any traditional method' and method.value < 5
        methods['Other modern methods'].value += method.value
        delete methods[key]
    # set parsedData array
    parsedData = [{id: 'r'}] # add treemap root
    for key,method of methods
      parsedData.push
        id: method.id
        name: '<strong>' +  method.name + '</strong><br/>' + Math.round(method.value) + '%'
        value: method.value
        parent: 'r'
    console.log parsedData
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

  # overdrive node class
  getNodeClass: (d) ->
    return 'node node-'+d.id

  setContainerOffset: ->
    @$el.css('top', ($(window).height()-@$el.height())*0.5)