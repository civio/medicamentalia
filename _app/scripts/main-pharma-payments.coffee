# Other articles site setup (superbugs, ...)

(($) ->

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')

  # Setup iceberg graph
  if $('#pharma-categories-amounts').length > 0
    d3.csv baseurl+'/data/pharma-categories-amounts.csv', (error, data) ->
      # setup graph
      graph = new window.IcebergGraph('pharma-categories-amounts',
        aspectRatio: 0.6
        margin: 
          top: 20
          bottom: 0
          left: 100
          right: 20
        label:
          y: ['Declarado', 'Oculto']
        key:
          x: 'category'
          up: 'declared'
          down: 'hidden')
      graph.setData data
      $(window).resize graph.onResize

  # Setup doctors average
  if $('#pharma-doctors-average').length > 0
    d3.csv baseurl+'/data/pharma-doctors-average.csv', (error, data) ->
      # setup graph
      graph = new window.BarHorizontalPharmaGraph('pharma-doctors-average', data)
      

  # Setup beeswarm graph
  if $('.pharma-transfers').length > 0
    d3.csv baseurl+'/data/pharma-transfers.csv', (error, data) ->
      categories = ['charges', 'travels', 'fees', 'relateds']
      # get maximum number of doctors per pharma
      totals = []
      categories.forEach (category) ->
        totals.push d3.max(data, (d) -> +d[category+'_doctors_total'])
      totalsMax = d3.max(totals)
      # populate select
      data.forEach (d, i) ->
        d.id = i
        $('#pharma-selector select').append '<option value="'+d.id+'">'+d.laboratory+'</option>'
      # setup a beeswarm chart for each category
      categories.forEach (category, i) ->
        data_category = data
          # filter lines without values or with 0 doctors
          .filter (d) -> d[category+'_doctors_percent'] != '' and d[category+'_doctors_total'] != ''
          .map (d) ->
            id: d.id
            laboratory: d.laboratory
            subsidiaries: d.subsidiaries
            value: d[category+'_doctors_percent']*100
            size: +d[category+'_doctors_total']
            import: Math.round(+d[category+'_value'])
        # setup graph
        graph = new window.BeeswarmGraph('pharma-transfers-'+category,
          margin:
            top: 0
            bottom: 0
            left: 0
            right: 20
          key:
            id: 'laboratory'
            size: 'size'
            color: 'value'
          legend: i == 0)
        graph.$tooltip = $('#pharma-transfers-tooltip')
        graph.getSizeDomain = -> return [0, totalsMax]
        graph.setData data_category
        $(window).resize graph.onResize
      # filter pharma
      $('#pharma-selector select').change (e) ->
        value = $(e.target).val()
        if value == '-1'
          categories.forEach (category) ->
            $('#pharma-transfers-'+category+' .cell').removeClass('desactive').removeClass('active');
        else
          categories.forEach (category) ->
            $('#pharma-transfers-'+category+' .cell').removeClass('active').addClass('desactive');
            $('#pharma-transfers-'+category+' #cell-'+value).removeClass('desactive').addClass('active')

) jQuery
