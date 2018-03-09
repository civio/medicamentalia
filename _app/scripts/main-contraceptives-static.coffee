# Main script for contraceptives articles

(($) ->
  
  userCountry = {}

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

  methods_keys = [
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
  ]

  methods_names = 
    'es': [
      "esterilización femenina"
      "esterilización masculina"
      "DIU"
      "implante"
      "inyectable"
      "píldora"
      "condón masculino"
      "condón femenino"
      "métodos de barrera vaginal"
      "método de la amenorrea de la lactancia (MELA)"
      "anticonceptivos de emergencia"
      "otros métodos modernos"
      "métodos tradicionales"
    ]
    'en': [
      "female sterilisation"
      "male sterilisation"
      "IUD"
      "implant"
      "injectable"
      "pill"
      "male condom"
      "female condom"
      "vaginal barrier methods"
      "lactational amenorrhea method (LAM)"
      "emergency contraception"
      "other modern methods"
      "traditional methods"
    ]

  methods_dhs_names = 
    'es': 
      '1': "píldora"
      '2': "DIU"
      '3': "inyectable"
      '5': "condón"
      '6': "esterilización femenina"
      '7': "esterilización masculina"
      '8': "abstinencia periódica"
      '9': "marcha atrás"
      '10': "otros"
      '11': "implante"
      '13': "método de la amenorrea de la lactancia (MELA)"
      '17': "métodos tradicionales"
    'en':
      '1': "pill"
      '2': "IUD"
      '3': "injectable"
      '5': "condom"
      '6': "female sterilisation"
      '7': "male sterilisation"
      '8': "periodic abstinence"
      '9': "withdrawal"
      '10': "other"
      '11': "implant"
      '13': "lactational amenorrhea method (LAM)"
      '17': "traditional methods"


  ###
  methods_icons = 
    "Female sterilization": 'sterilization'
    "Male sterilization": 'sterilization'
    "IUD": 'diu'
    "Implant": null
    "Injectable": 'injectable'
    "Pill": 'pill'
    "Male condom": 'condom'
    "Female condom": null
    "Vaginal barrier methods": null
    "Lactational amenorrhea method (LAM)": null
    "Emergency contraception": null
    "Other modern methods": null
    "Any traditional method": 'traditional'
  ###

  reasons_names = 
    'es':
      "a": "no están casadas"
      "b": "no tienen sexo"
      "c": "tienen sexo infrecuente"
      "d": "menopausia o esterilización"
      "e": "son subfecundas o infecundas"
      "f": "amenorrea postparto"
      "g": "están dando el pecho"
      "h": "fatalista"
      "i": "la mujer se opone"
      "j": "el marido o la pareja se opone"
      "k": "otros se oponen"        
      "l": "prohibición religiosa"  
      "m": "no conoce los métodos"
      "n": "no conoce ninguna fuente donde adquirirlos"
      "o": "preocupaciones de salud"                     
      "p": "miedo a los efectos secundarios/preocupaciones de salud" 
      "q": "falta de acceso/muy lejos"
      "r": "cuestan demasiado"
      "s": "inconvenientes para su uso"
      "t": "interfiere con los procesos del cuerpo"
      "u": "el método elegido no está disponible"
      "v": "no hay métodos disponibles"
      "w": "(no estándar)"
      "x": "otros"
      "z": "no lo sé"
    'en':
      "a": "not married"
      "b": "not having sex"
      "c": "infrequent sex"
      "d": "menopausal/hysterectomy"
      "e": "subfecund/infecund"
      "f": "postpartum amenorrheic"
      "g": "breastfeeding"
      "h": "fatalistic"
      "i": "respondent opposed"
      "j": "husband/partner opposed"
      "k": "others opposed"
      "l": "religious prohibition"
      "m": "knows no method"
      "n": "knows no source"
      "o": "health concerns"
      "p": "fear of side effects/health concerns"
      "q": "lack of access/too far"
      "r": "costs too much"
      "s": "inconvenient to use"
      "t": "interferes with body's processes"
      "u": "preferred method not available"
      "v": "no method available"
      "w": "(no estándar)"
      "x": "other"
      "z": "don't know"

  reasons_dhs_names = 
    'es': 
      'v3a08a': 'no están casadas'
      'v3a08b': 'no tienen sexo'
      'v3a08c': 'tienen sexo infrecuente'
      'v3a08d': 'menopausia o esterilización'
      'v3a08e': 'son subfecundas o infecundas'
      'v3a08f': 'amenorrea postparto'
      'v3a08g': 'están dando el pecho'
      'v3a08h': 'fatalista'
      'v3a08i': 'la mujer se opone'
      'v3a08j': 'el marido o la pareja se opone'
      'v3a08k': 'otros se oponen'        
      'v3a08l': 'prohibición religiosa'
      'v3a08m': 'no conoce los métodos'
      'v3a08n': 'no conoce ninguna fuente donde adquirirlos'
      'v3a08o': 'preocupaciones de salud'
      'v3a08p': 'miedo a los efectos secundarios'
      'v3a08q': 'falta de acceso/muy lejos'
      'v3a08r': 'cuestan demasiado'
      'v3a08s': 'inconvenientes para su uso'
      'v3a08t': "interfiere con los procesos del cuerpo"
    'en': 
      'v3a08a': 'not married'
      'v3a08b': 'not having sex'
      'v3a08c': 'infrequent sex'
      'v3a08d': 'menopausal/hysterectomy'
      'v3a08e': 'subfecund/infecund'
      'v3a08f': 'postpartum amenorrheic'
      'v3a08g': 'breastfeeding'
      'v3a08h': 'fatalistic'
      'v3a08i': 'respondent opposed'
      'v3a08j': 'husband/partner opposed'
      'v3a08k': 'others opposed'
      'v3a08l': 'religious prohibition'
      'v3a08m': 'knows no method'
      'v3a08n': 'knows no source'
      'v3a08o': 'health concerns'
      'v3a08p': 'fear of side effects'
      'v3a08q': 'lack of access/too far'
      'v3a08r': 'costs too much'
      'v3a08s': 'inconvenient to use'
      'v3a08t': "interferes with the body's processes"


  setLocation = (location, countries) ->
    if location
      user_country = countries.filter (d) -> d.code2 == location.country_code
      if user_country[0]
        userCountry.code = user_country[0].code
        userCountry.name = user_country[0]['name_'+lang]
    else
      location = {}

    unless location.code
      userCountry.code = 'ESP'
      userCountry.name = if lang == 'es' then 'España' else 'Spain'


  # Setup
  # ---------------

  pymChild = new pym.Child()

  # Load location
  d3.json 'https://freegeoip.net/json/', (error, location) ->
    # Load csvs & setup maps
    d3.queue()
      .defer d3.csv,  baseurl+'/data/contraceptives-use-countries.csv'
      .defer d3.csv,  baseurl+'/data/unmet-needs.csv'
      .defer d3.csv,  baseurl+'/data/contraceptives-reasons.csv'
      .defer d3.csv,  baseurl+'/data/countries-gni-population-2016.csv'
      .defer d3.json, baseurl+'/data/map-world-110.json'
      .await (error, data_use, data_unmetneeds, data_reasons, countries, map) ->
        setLocation location, countries
        if $('#contraceptives-app').length
          new ContraceptivesApp lang, data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang], pymChild

) jQuery
