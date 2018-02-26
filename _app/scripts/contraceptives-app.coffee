class window.ContraceptivesApp

  filter_keys: 
    'contraceptives-filter-0': 'residence'
    'contraceptives-filter-1': 'age'
    'contraceptives-filter-2': 'education'
    'contraceptives-filter-3': 'wealth'

  dhs_countries:
    'AFG':
      'name': 'AFIR70DT'
      'year': '2017'
    'ALB':
      'name': 'ALIR50DT'
      'year': '2008-09'
    'ARM':
      'name': 'AMIR61DT'
      'year': '2010'
    'AGO':
      'name': 'AOIR71DT'
      'year': '2015-16'
    'AZE':
      'name': 'AZIR52DT'
      'year': '2006'
    'BGD':
      'name': 'BDIR72DT'
      'year': '2014'
    'BEN':
      'name': 'BJIR51DT'
      'year': '2006'
    'BOL':
      'name': 'BOIR51DT'
      'year': '2008'
    'BDI':
      'name': 'BUIR61DT'
      'year': '2010'
    'COD':
      'name': 'CDIR61DT'
      'year': '2013-14'
    'COG':
      'name': 'CGIR60DT'
      'year': '2011-12'
    'CIV':
      'name': 'CIIR62DT'
      'year': '2011-12'
    'CMR':
      'name': 'CMIR61DT'
      'year': '2011'
    'COL':
      'name': 'COIR71DT'
      'year': '2015-16'
    'DOM':
      'name': 'DRIR61DT'
      'year': '2013'
    'EGY':
      'name': 'EGIR61DT'
      'year': '2014'
    'ETH':
      'name': 'ETIR70DT'
      'year': '2016'
    'GHA':
      'name': 'GHIR72DT'
      'year': '2014'
    'GMB':
      'name': 'GMIR60DT'
      'year': '2013'
    'GIN':
      'name': 'GNIR62DT'
      'year': '2012'
    'GTM':
      'name': 'GUIR71DT'
      'year': '2014-15'
    'GUY':
      'name': 'GYIR5IDT'
      'year': '2009'
    'HND':
      'name': 'HNIR62DT'
      'year': '2011-12'
    'HTI':
      'name': 'HTIR61DT'
      'year': '2012'
    'IND':
      'name': 'IAIR71DT'
      'year': '2015'
    'IDN':
      'name': 'IDIR63DT'
      'year': '2012'
    'JOR':
      'name': 'JOIR6CDT'
      'year': '2012'
    'KEN':
      'name': 'KEIR70DT'
      'year': '2014'
    'KHM':
      'name': 'KHIR73DT'
      'year': '2014'
    'LBR':
      'name': 'LBIR6ADT'
      'year': '2013'
    'LSO':
      'name': 'LSIR71DT'
      'year': '2014'
    'MAR':
      'name': 'MAIR43DT'
      'year': '2003-04'
    'MDG':
      'name': 'MDIR51DT'
      'year': '2008-09'
    'MLI':
      'name': 'MLIR53DT'
      'year': '2006'
    'MMR':
      'name': 'MMIR71DT'
      'year': '2016'
    'MWI':
      'name': 'MWIR7HDT'
      'year': '2015-16'
    'MOZ':
      'name': 'MZIR62DT'
      'year': '2011'
    'NGA':
      'name': 'NGIR6ADT'
      'year': '2013'
    'NER':
      'name': 'NIIR51DT'
      'year': '2006'
    'NAM':
      'name': 'NMIR61DT'
      'year': '2013'
    'NPL':
      'name': 'NPIR7HDT'
      'year': '2016'
    'PER':
      'name': 'PEIR6IDT'
      'year': '2012'
    'PHL':
      'name': 'PHIR61DT'
      'year': '2013'
    'PAK':
      'name': 'PKIR61DT'
      'year': '2012-13'
    'RWA':
      'name': 'RWIR70DT'
      'year': '2015'
    'SLE':
      'name': 'SLIR61DT'
      'year': '2013'
    'SEN':
      'name': 'SNIR6DDT'
      'year': '2012-13'
    'STP':
      'name': 'STIR50DT'
      'year': '2008'
    'SWZ':
      'name': 'SZIR51DT'
      'year': '2006'
    'TCD':
      'name': 'TDIR71DT'
      'year': '2014-15'
    'TGO':
      'name': 'TGIR61DT'
      'year': '2013-14'
    'TJK':
      'name': 'TJIR61DT'
      'year': '2012'
    'TLS':
      'name': 'TLIR61DT'
      'year': '2009-10'
    'TZA':
      'name': 'TZIR7HDT'
      'year': '2015-16'
    'UGA':
      'name': 'UGIR60DT'
      'year': '2011'
    'ZMB':
      'name': 'ZMIR51DT'
      'year': '2007'
    'ZWE':
      'name': 'ZWIR71DT'
      'year': '2015'


  constructor: (data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names) ->

    @data = 
      use:        data_use
      unmetneeds: data_unmetneeds
      reasons:    data_reasons

    @methodsKeys      = methods_keys
    @methodsNames     = methods_names
    @methodsDHSNames  = methods_dhs_names
    @reasonsNames     = reasons_names
    @reasonsDHSNames  = reasons_dhs_names

    @$app = $('#contraceptives-app')

    @$app.find('.select-country')
      .select2()
      .change @onSelectCountry
      .val user_country.code
      .trigger 'change'

    @$app.find('.contraceptives-app-filters .btn').click @onSelectFilter

    @$app.css('opacity',1)


  onSelectCountry: (e) =>
    @country_code = $(e.target).val()

    use           = null
    method        = null
    method_value  = null
    unmetneeds    = null
    reason        = null
    reason_value  = null

    # hide filters & clear active btns
    @$app.find('.contraceptives-app-filters').hide().find('.btn').removeClass('active')
    # hide filters results
    $('.contraceptives-filter').hide()

    if @dhs_countries[@country_code]
      # set data year
      @$app.find('#contraceptives-app-data-year').html @dhs_countries[@country_code].year
      # load country dhs data
      d3.csv $('body').data('baseurl')+'/data/contraceptives-reasons/'+@dhs_countries[@country_code].name+'_all.csv', (error, data) =>
        d = data[0]
        # setup data
        @setAppItemData @$app, 100*d.using_modern_method/d.n, @methodsDHSNames[d.most_popular_method], 100*d.most_popular_method_n/d.n, 100*d.with_unmet_needs/d.n, @reasonsDHSNames[d.most_popular_reason], 100*d.most_popular_reason_n/d.n_reasons
        # show filters
        @$app.find('.contraceptives-app-filters').show()
    else
      # set data year
      @$app.find('#contraceptives-app-data-year').html '2015-16'
      # Use
      countryUse = @data.use.filter (d) => d.code == @country_code
      if countryUse and countryUse[0]
        if countryUse[0]['Any modern method'] != '0'
          use           = countryUse[0]['Any modern method']
        country_methods = @methodsKeys.map (key, i) => {'name': @methodsNames[i], 'value': +countryUse[0][key]}
        country_methods = country_methods.sort (a,b) -> b.value-a.value
        method          = country_methods[0].name
        method_value    = country_methods[0].value
      # Unmetneeds
      countryUnmetneeds = @data.unmetneeds.filter (d) => d.code == @country_code
      if countryUnmetneeds and countryUnmetneeds[0]
        # use survey data if available, use estimated if not
        unmetneeds = if countryUnmetneeds[0]['survey'] then countryUnmetneeds[0]['survey'] else countryUnmetneeds[0]['estimated'] 
      # Reasons
      countryReasons = @data.reasons.filter (d) => d.code == @country_code
      if countryReasons and countryReasons[0]
        reasons      = Object.keys(@reasonsNames).map (reason) => {'name': @reasonsNames[reason], 'value': +countryReasons[0][reason]}
        reasons      = reasons.sort (a,b) -> b.value-a.value
        reason       = reasons[0].name
        reason_value = reasons[0].value
      # setup data
      @setAppItemData @$app, use, method, method_value, unmetneeds, reason, reason_value


  onSelectFilter: (e) =>
    e.preventDefault()
    if @filter != $(e.target).attr('href').substring(1)
      $('html, body').animate {scrollTop: @$app.find('.contraceptives-app-filters').offset().top-15}, 400
      @$app.find('.contraceptives-app-filters .btn').removeClass('active')
      $target = $(e.target).addClass('active')
      @filter = $target.attr('href').substring(1)
      $('.contraceptives-filter').hide()
      @filterEl = $('#'+@filter).show()
      # load csv file
      d3.csv $('body').data('baseurl')+'/data/contraceptives-reasons/'+@dhs_countries[@country_code].name+'_'+@filter_keys[@filter]+'.csv', (error, data) =>
        if data
          data.forEach (d) =>
            @setAppItemData @filterEl.find('#'+@filter+'-'+d.id), 100*d.using_modern_method/d.n, @methodsDHSNames[d.most_popular_method], 100*d.most_popular_method_n/d.n, 100*d.with_unmet_needs/d.n, @reasonsDHSNames[d.most_popular_reason], 100*d.most_popular_reason_n/d.n_reasons


  setAppItemData: ($el, use, method, method_value, unmetneeds, reason, reason_value) ->

    #console.log 'setAppItemData', $el, use, method, method_value, unmetneeds, reason, reason_value

    if use
      $el.find('.contraceptives-app-data-use').html Math.round(+use)+'%'
      $el.find('.contraceptives-app-use').show()
    else
      $el.find('.contraceptives-app-use').hide()

    if method
      $el.find('.contraceptives-app-data-main-method').html method
      $el.find('.contraceptives-app-data-main-method-value').html Math.round(+method_value)+'%'
      $el.find('.contraceptives-app-method').show()
    else
      $el.find('.contraceptives-app-method').hide()

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
