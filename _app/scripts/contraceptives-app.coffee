class window.ContraceptivesApp


  filter_keys: 
    'contraceptives-filter-0': 'residence'
    'contraceptives-filter-1': 'age'
    'contraceptives-filter-2': 'education'


  constructor: (data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, reasons_names) ->

    @data = 
      use:        data_use
      unmetneeds: data_unmetneeds
      reasons:    data_reasons

    @methodsKeys  = methods_keys
    @methodsNames = methods_names
    @reasonsNames = reasons_names

    @$app = $('#contraceptives-app')

    @$app.find('.select-country')
      .change @onSelectCountry
      .val user_country.code
      .trigger 'change'

    @$app.find('.contraceptives-app-filters .btn').click @onSelectFilter


  onSelectCountry: (e) =>
    country_code = $(e.target).val()
    console.log country_code

    use           = null
    method        = null
    method_value  = null
    unmetneeds    = null
    reason        = null
    reason_value  = null

    # Use
    countryUse = @data.use.filter (d) -> d.code == country_code
    if countryUse and countryUse[0]
      country_methods = @methodsKeys.map (key, i) => {'name': @methodsNames[i], 'value': +countryUse[0][key]}
      country_methods = country_methods.sort (a,b) -> b.value-a.value
      use             = countryUse[0]['Any modern method']
      method          = country_methods[0].name
      method_value    = country_methods[0].value

    # Unmetneeds
    countryUnmetneeds = @data.unmetneeds.filter (d) -> d.code == country_code
    if countryUnmetneeds and countryUnmetneeds[0]
      # use survey data if available, use estimated if not
      unmetneeds = if countryUnmetneeds[0]['survey'] then countryUnmetneeds[0]['survey'] else countryUnmetneeds[0]['estimated']
      
    # Reasons
    countryReasons = @data.reasons.filter (d) -> d.code == country_code
    if countryReasons and countryReasons[0]
      reasons      = Object.keys(@reasonsNames).map (reason) => {'name': @reasonsNames[reason], 'value': +countryReasons[0][reason]}
      reasons      = reasons.sort (a,b) -> b.value-a.value
      reason       = reasons[0].name
      reason_value = reasons[0].value

    @setAppItemData @$app, use, method, method_value, unmetneeds, reason, reason_value


  onSelectFilter: (e) =>
    e.preventDefault()
    if @filter != $(e.target).attr('href').substring(1)
      @filter = $(e.target).attr('href').substring(1)
      $('.contraceptives-filter').hide()
      @filterEl = $('#'+@filter).show()
      console.log @filter
      # load csv file
      d3.csv $('body').data('baseurl')+'/data/contraceptives-reasons/UGIR52DT_'+@filter_keys[@filter]+'.csv', (error, data) =>
        console.log data
        if data
          data.forEach (d,i) =>
            @setAppItemData @filterEl.find('#'+@filter+'-'+i), 100*d.using_modern_method/d.n, d.most_popular_method, 100*d.most_popular_method_n/d.n, 100*d.with_unmet_needs/d.n, d.most_popular_reason, 100*d.most_popular_reason_n/d.n_reasons


  setAppItemData: ($el, use, method, method_value, unmetneeds, reason, reason_value) ->

    console.log 'setAppItemData', $el, use, method, method_value, unmetneeds, reason, reason_value

    if use
      $el.find('.contraceptives-app-data-use').html Math.round(+use)+'%'
      $el.find('.contraceptives-app-data-main-method').html method
      $el.find('.contraceptives-app-data-main-method-value').html Math.round(+method_value)+'%'
      $el.find('.contraceptives-app-use').show()
    else
      $el.find('.contraceptives-app-use').hide()

    if unmetneeds
      $el.find('.contraceptives-app-data-unmetneeds').html Math.round(+unmetneeds)+'%'
      $el.find('.contraceptives-app-unmetneeds').show()
    else
      $el.find('.contraceptives-app-unmetneeds').hide()

    if reason
      $el.find('.contraceptives-app-data-reason').html reason
      $el.find('.contraceptives-app-data-reason-value').html Math.round(+reason_value)+'%'
      $el.find('.contraceptives-app-reason').show()
    else
      $el.find('.contraceptives-app-reason').hide()
