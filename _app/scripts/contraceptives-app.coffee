class window.ContraceptivesApp


  constructor: (data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, reasons_names) ->

    @data = 
      use:        data_use
      unmetneeds: data_unmetneeds
      reasons:    data_reasons

    @methodsKeys  = methods_keys
    @methodsNames = methods_names
    @reasonsNames = reasons_names

    $('#contraceptives-app .select-country')
      .change @onSelectCountry
      .val user_country.code
      .trigger 'change'


  onSelectCountry: (e) =>
    country_code = $(e.target).val()
    console.log country_code

    # Use
    countryUse = @data.use.filter (d) -> d.code == country_code
    if countryUse and countryUse[0]
      country_methods = @methodsKeys.map (key, i) => {'name': @methodsNames[i], 'value': +countryUse[0][key]}
      country_methods = country_methods.sort (a,b) -> b.value-a.value
      $('#contraceptives-app-data-use').html Math.round(+countryUse[0]['Any modern method'])+'%'
      $('#contraceptives-app-data-main-method').html country_methods[0].name
      $('#contraceptives-app-data-main-method-value').html Math.round(country_methods[0].value)+'%'
      $('#contraceptives-app-use').show()
    else
      $('#contraceptives-app-use').hide()

    # Unmetneeds
    countryUnmetneeds = @data.unmetneeds.filter (d) -> d.code == country_code
    if countryUnmetneeds and countryUnmetneeds[0]
      # use survey data if available, use estimated if not
      val = if countryUnmetneeds[0]['survey'] then countryUnmetneeds[0]['survey'] else countryUnmetneeds[0]['estimated']
      $('#contraceptives-app-data-unmetneeds').html Math.round(+val)+'%'
      $('#contraceptives-app-unmetneeds').show()
    else
      $('#contraceptives-app-unmetneeds').hide()

    # Reasons
    countryReasons = @data.reasons.filter (d) -> d.code == country_code
    if countryReasons and countryReasons[0]
      reasons = Object.keys(@reasonsNames).map (reason) => {'name': @reasonsNames[reason], 'value': +countryReasons[0][reason]}
      reasons = reasons.sort (a,b) -> b.value-a.value
      $('#contraceptives-app-data-reason').html reasons[0].name
      $('#contraceptives-app-data-reason-value').html Math.round(reasons[0].value)+'%'
      $('#contraceptives-app-reason').show()
    else
      $('#contraceptives-app-reason').hide()
