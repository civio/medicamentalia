# Main script for contraceptives articles

(($) ->

  useMap = null

  # Get current article lang & base url
  lang    = $('body').data('lang')
  baseurl = $('body').data('baseurl')

  #console.log 'contraceptives', lang, baseurl

  # setup format numbers
  if lang == 'es'
    d3.formatDefaultLocale {
      "currency": ["$",""]
      "decimal": ","
      "thousands": "."
      "grouping": [3]
    }

  keys = [
    "Female sterilization"
    "Male sterilization"
    "IUD"
    "Implant"
    "Injectable"
    "Pill"
    "Male condom"
    "Female condom"
    "Vaginal barrier methods"
    "Lactational amenorrhea method (LAM)"
    "Emergency contraception"
    "Other modern methods"
    "Any traditional method"
    #"Rhythm"
    #"Withdrawal"
    #"Other traditional methods"
  ]


  # Scrollama Setup
  # ---------------

  setupScrollama = ->
    container = d3.select('#contraceptives-use-container')
    graphic   = container.select('.scroll-graphic')
    chart     = graphic.select('.graph-container')
    text      = container.select('.scroll-text')
    steps     = text.selectAll('.step')

    # initialize scrollama
    scroller = scrollama()

    # resize function to set dimensions on load and on page resize
    handleResize = ->
      width = Math.floor window.innerWidth
      height = Math.floor window.innerHeight
      # 1. update height of step elements for breathing room between steps
      steps.style 'height', height + 'px'
      # 2. update height of graphic element
      graphic.style 'height', height + 'px'
      # 3. update width of chart
      chart
        .style 'width', width+'px'
        .style 'height', height+'px'
      # 4. tell scrollama to update new element dimensions
      scroller.resize()

    # scrollama event handlers
    handleStepEnter = (e) ->
      # update map based on step 
      useMap.setMapState e.index

    handleContainerEnter = (e) ->
      # sticky the graphic
      graphic
        .classed 'is-fixed', true
        .classed 'is-bottom', false

    handleContainerExit = (e) ->
      # un-sticky the graphic, and pin to top/bottom of container
      graphic
        .classed 'is-fixed', false
        .classed 'is-bottom', e.direction == 'down'

    # start it up
    # 1. call a resize on load to update width/height/position of elements
    handleResize()

    # 2. setup the scrollama instance
    # 3. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup
        container:  '#contraceptives-use-container' # our outermost scrollytelling element
        graphic:    '.scroll-graphic'               # the graphic
        text:       '.scroll-text'                  # the step container
        step:       '.scroll-text .step'            # the step elements
        offset:     0.8                             # set the trigger to be 1/2 way down screen
        #debug:      true                            # display the trigger offset for testing
      .onStepEnter      handleStepEnter 
      .onContainerEnter handleContainerEnter 
      .onContainerExit  handleContainerExit 

    # setup resize event
    window.addEventListener 'resize', handleResize


  # Contraceptives Map Setup
  # ------------------------

  setupConstraceptivesUseMap = ->
    d3.queue()
      .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
      .defer d3.csv,  baseurl+'/data/countries.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .await (error, _data, countries, map) ->
        #console.table data
        #console.table countries
        # add cases to each country
        data = _data
        data.forEach (d) ->
          item = countries.filter (country) -> country.code == d.code
          ###
          d['Rhythm']                    = +d['Rhythm']
          d['Withdrawal']                = +d['Withdrawal']
          d['Other traditional methods'] = +d['Other traditional methods']
          d['Traditional methods'] = d['Rhythm']+d['Withdrawal']+d['Other traditional methods']
          console.log d.code, d['Rhythm'], d['Withdrawal'], d['Other traditional methods'], d['Traditional methods']
          delete d['Rhythm']
          delete d['Withdrawal']
          delete d['Other traditional methods']
          ###
          d.values = [] # +d['Any method']
          #d.value = +d['Male sterilization']
          d.value = 0
          # get main method in each country
          keys.forEach (key,i) ->
            d.values.push
              id: i
              name: key
              value: if d[key] != '' then +d[key] else null
            #delete d[key]
          # sort descending values
          d.values.sort (a,b) -> d3.descending(a.value, b.value)
          #console.log d.values
          #d.value = d.values[0].value
          if item and item[0]
            d.name = item[0]['name_'+lang]
            d.code_num = item[0]['code_num']
          else
            console.log 'no country', d.code
        # set graph
        useMap = new window.ContraceptivesUseMapGraph 'map-contraceptives-use',
          aspectRatio: 0.5625
          margin:
            top: 0
            bottom: 0
          legend: false
        useMap.setData data, map
        useMap.onResize()
        $(window).resize useMap.onResize


  # Unmeet Needs vs GDP graph
  # --------------------------

  setupUnmetNeedsGdpGraph = ->
    d3.csv baseurl+'/data/unmet-needs-gdp-'+lang+'.csv', (error, data) ->
      console.log data
      # clear items without unmet-needs values
      data = data.filter (d) -> d.gdp and d['unmet-needs'] 
      unmetNeedsGdpGraph = new window.ScatterplotUnmetNeedsGraph 'unmet-needs-gdp-graph',
        aspectRatio: 0.5625
        margin:
          left:   0
          rigth:  0
          top:    0
          bottom: 0
        key:
          x: 'gdp'
          y: 'unmet-needs'
          id: 'name'
          size: 'population'
          color: 'region'
      # set data
      unmetNeedsGdpGraph.setData data
      $(window).resize unmetNeedsGdpGraph.onResize

  # Setup
  # ---------------

  if $('#map-contraceptives-use').length > 0
    setupConstraceptivesUseMap()

  setupScrollama()

  if $('#unmet-needs-gdp-graph').length > 0
    setupUnmetNeedsGdpGraph()

) jQuery