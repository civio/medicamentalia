class window.ContraceptivesReasons

  constructor: (data_reasons, countries, reasons_names) ->

    console.log '--- ContraceptivesReasons'

    reasonHealth = []
    reasonOpposed = []
    reasonOpposedHusband = []
    ###
    reasonNotSex = []
    reasonOpposed = []
    reasonOpposedRespondent = []
    reasonOpposedReligious = []
    ###

    # parse reasons data
    data_reasons.forEach (d) ->
      if d.name
        reasonHealth.push
          name: d.name
          value: d.o+d.p+d.t # health concerns + fear of side effects/health concerns + interferes with bodys processes
        reasonOpposedHusband.push
          name: d.name
          value: d.j # husband/partner opposed
        ###
        reasonNotSex.push
          name: d.name
          value: d.b # not having sex
        reasonOpposedRespondent.push
          name: d.name
          value: d.i # respondent opposed
        reasonOpposedReligious.push
          name: d.name
          value: d.l # religious prohibition
        ###
        reasonOpposed.push
          name:   d.name
          total:  d.i+d.j+d.k+d.l  # respondent opposed + husband/partner opposed + others opposed + religious prohibition
          values: [
            {name: reasons_names.i, value: d.i}
            {name: reasons_names.j, value: d.j}
            {name: reasons_names.l, value: d.l}
            {name: reasons_names.k, value: d.k}
          ]

    reasonHealth.sort         (a,b) -> return b.value-a.value
    reasonOpposedHusband.sort (a,b) -> return b.value-a.value
    reasonOpposed.sort        (a,b) -> return b.total-a.total
    console.log reasonOpposed
    ###
    reasonNotSex.sort sortArray
    reasonOpposed.sort sortArray
    reasonOpposedRespondent.sort sortArray
    reasonOpposedHusband.sort sortArray
    reasonOpposedReligious.sort sortArray
    ###
    new window.BarHorizontalGraph('contraceptives-reasons-health',
      key:
        id: 'name'
        x: 'value').setData reasonHealth.slice(0,5)
   
    new window.BarHorizontalStackedGraph('contraceptives-reasons-opposed',{}).setData reasonOpposed.slice(0,10)
    ###
    new window.BarHorizontalGraph('contraceptives-reasons-not-sex',
      key:
        id: 'name'
        x: 'value').setData reasonNotSex.slice(0,5)
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-respondent',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedRespondent.slice(0,5)
    
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-religious',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedReligious.slice(0,5)
    ###
    new window.BarHorizontalGraph('contraceptives-reasons-opposed-husband',
      key:
        id: 'name'
        x: 'value'
      xAxis: [50, 100]).setData reasonOpposedHusband.slice(0,5)
