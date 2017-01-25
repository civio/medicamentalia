class window.BaseGraph

  optionsDefault = 
    margin:
      top: 0
      right: 0
      bottom: 20
      left: 0
    aspectRatio: 0.5625

  constructor: (id, options) ->
    @id      = id
    @options = merge options, optionsDefault
    console.log 'Base Graph!', @options


  merge = (xs...) ->
    tap = (o, fn) -> fn(o);o
    if xs?.length > 0
      tap {}, (m) -> m[k] = v for k,v of x for x in xs