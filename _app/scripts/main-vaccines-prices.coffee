# Main script for vaccines prices article
class window.VaccinesPrices

  constructor: (_lang, _baseurl) ->
    @lang = _lang
    # load data
    d3.queue()
      .defer d3.csv, _baseurl+'/data/prices-vaccines.csv'
      .defer d3.csv, _baseurl+'/data/gdp.csv'
      #.defer d3.json, 'http://freegeoip.net/json/'
      .await @onDataLoaded

  onDataLoaded: (error, _data, _countries) =>
    @data = _data
    @countries = _countries
    @parseData()
    # all vaccines prices
    if $('#vaccine-prices-all-graph').length > 0
      @setupScatterplot 'vaccine-prices-all-graph', @data, true
    # organizations prices
    if $('#vaccine-prices-organizations-graph').length > 0
      dataOrganizations = @data.filter (d) -> d.country == 'MSF' || d.country == 'PAHO' || d.country == 'UNICEF'
      @setupScatterplot 'vaccine-prices-organizations-graph', dataOrganizations, true
    # Tdap prices
    if $('#vaccine-prices-tdap-graph').length > 0
      dataTdap = @data.filter (d) -> d.vaccine == 'Tdap'
      @setupScatterplot 'vaccine-prices-tdap-graph', dataTdap, false
    # IPV prices
    if $('#vaccine-prices-ipv-graph').length > 0
      dataIPV = @data.filter (d) -> d.vaccine == 'IPV' and d.country != 'MSF' and d.country != 'PAHO' and d.country != 'UNICEF'
      @setupScatterplot 'vaccine-prices-ipv-graph', dataIPV, false

  parseData: ->
    vaccines = ['pneumo13','BCG','IPV','MMR','HepB-pediátrica','VPH','DTPa-IPV-HIB','DTaP','Tdap','DTP']
    # filter data to get only selected vaccines
    @data = @data.filter (d) -> vaccines.indexOf(d.vaccine) != -1
    console.table @data
    # join data & countries gdp 
    @data.forEach (d) =>
      country = @countries.filter (e) -> e.code == d.country
      d.price = +d.price
      if country[0]
        d.name = country[0]['name_'+@lang]
        d.gdp = country[0].value
      else
        d.name = d.country
        d.gdp = 0
    # sort data by gdp
    @data.sort (a,b) -> a.gdp - b.gdp

  setupScatterplot: (_id, _data, _legend) ->
    graph = new window.ScatterplotDiscreteGraph(_id,
      legend: _legend
      margin:
        top: 5
        right: 5
        left: 60
        bottom: 20
      key:
        x: 'price'
        y: 'name'
        id: 'country'
        color: 'vaccine')
    graph.yAxis.tickPadding 12
    graph.xAxis
      .ticks 5
      .tickPadding 10
      .tickFormat (d) -> d+'€'
    # set data
    graph.setData _data
    $(window).resize graph.onResize
