# Main script for vaccines prices article
class window.VaccinesPrices

  vaccines_names: 
    es:
      'BCG': 'Tuberculosis (BCG)'
      'DTaP': 'Difteria, tétanos y tos ferina acelular (DTaP)'
      'DTP': 'Difteria, tétanos y tos ferina (DTP)'
      'DTPa-IPV-Hib': 'Pentavalente (DTP, polio e Hib)'
      'HepB-pediátrica': 'Hepatitis B pediátrica'
      'IPV': 'Polio (IPV)'
      'MMR': 'Sarampión, paperas y rubeola'
      'pneumo13': 'Neumococo (13)'
      'Tdap': 'Tétanos, difteria y tos ferina acelular reducida (Tdap)'
      'VPH': 'Virus del papiloma humano (VPH)'
    en:
      'BCG': 'Tuberculosis (BCG)'
      'DTaP': 'Diphteria, tetanus and acellular pertussis (DTaP)'
      'DTP': 'Diphteria, tetanus and pertussis (DTP)'
      'DTPa-IPV-Hib': 'Pentavalent (DTP, polio and Hib)'
      'HepB-pediátrica': 'Hepatitis B pediatric'
      'IPV': 'Polio (IPV)'
      'MMR': 'Measles, mumps and rubella'
      'pneumo13': 'Pneumococcus (13)'
      'Tdap': 'Tetanus, reduced diphtheria and reduced acellular pertussis (Tdap)'
      'VPH': 'Human papilomavirus (HPV)'

  vaccines_colors:
    'BCG': '#C9AD4B'
    'DTaP': '#63BA2D'
    'DTP': '#34A893'
    'DTPa-IPV-Hib': '#BBD646'
    'HepB-pediátrica': '#3D91AD'
    'IPV': '#5B8ACB'
    'MMR': '#E2773B'
    'pneumo13': '#BA7DAF'
    'Tdap': '#F49D9D'
    'VPH': '#E25453'

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
    # PIB countries
    if $('#pib-countries-graph').length > 0
      pibData = d3.nest()
        .key (d) -> d.country
        .entries @data
      pibData = pibData.map (d) ->
        return {
          id: d.key
          name: d.values[0].name
          gdp: d.values[0].gdp
        }
      pibData = pibData
        .filter (d) -> d.gdp > 0
        .sort (a,b) -> b.gdp - a.gdp
      graph = new window.BarGraph('pib-countries-graph',
        label:
          format: d3.format('$,d')
        key:
          x: 'name'
          y: 'gdp'
          id: 'id')
      graph.setData pibData
      $(window).resize graph.onResize

  parseData: ->
    vaccines = ['pneumo13','BCG','IPV','MMR','HepB-pediátrica','VPH','DTPa-IPV-Hib','DTaP','Tdap','DTP']
    # filter data to get only selected vaccines
    @data = @data.filter (d) -> vaccines.indexOf(d.vaccine) != -1
    # join data & countries gdp 
    @data.forEach (d) =>
      country = @countries.filter (e) -> e.code == d.country
      d.price = +d.price
      d.vaccine_name = @vaccines_names[@lang][d.vaccine]
      d.vaccine_color = @vaccines_colors[d.vaccine]
      if country[0]
        d.name = d['name_'+@lang]
        d.gdp = country[0].value
      else
        d.name = d['name_'+@lang]
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
    # overdrive color fill method
    graph.getDotFill = (d) -> d.vaccine_color
    # set data
    graph.setData _data
    $(window).resize graph.onResize
