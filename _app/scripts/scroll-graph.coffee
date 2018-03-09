class window.ScrollGraph


  # Constructor
  # -----------

  constructor: (_id, _stepCallback) ->
    @id = _id
    @stepCallback = _stepCallback
    @container = d3.select('#'+@id)
    @graphic   = @container.select('.scroll-graphic')
    @steps     = @container.selectAll('.scroll-text .step')
    @chart     = @graphic.select('.graph-container')
    # initialize scrollama
    @scroller = scrollama()
    # start it up
    # 1. call a resize on load to update width/height/position of elements
    @onResize()
    # 2. setup the scrollama instance
    # 3. bind scrollama event handlers (this can be chained like below)
    @scroller
      .setup
        container:  '#'+@id               # our outermost scrollytelling element
        graphic:    '#'+@id+' .scroll-graphic'     # the graphic
        step:       '#'+@id+' .scroll-text .step'  # the step elements
        offset:     0.05                  # set the trigger to be 1/2 way down screen
        debug:      false                 # display the trigger offset for testing
      .onContainerEnter @onContainerEnter 
      .onContainerExit  @onContainerExit
      .onStepEnter      @onStepEnter
    # setup resize event
    window.addEventListener 'resize', @onResize
    return @


  # Main methods
  # ------------

  # resize function to set dimensions on load and on page resize
  onResize: =>
    width = @graphic.node().getBoundingClientRect().width #Math.floor window.innerWidth
    height = Math.floor window.innerHeight
    # 1. update height of step elements for breathing room between steps
    @steps.style 'height', height + 'px'
    # 2. update height of graphic element
    @graphic.style 'height', height + 'px'
    # 3. update width of chart
    @chart
      .style 'width', width+'px'
      .style 'height', height+'px'
    # 4. tell scrollama to update new element dimensions
    @scroller.resize()

  # sticky the graphic
  onContainerEnter: (e) =>
    @graphic
      .classed 'is-fixed', true
      .classed 'is-bottom', false

  # un-sticky the graphic, and pin to top/bottom of container
  onContainerExit: (e) =>
    @graphic
      .classed 'is-fixed', false
      .classed 'is-bottom', e.direction == 'down'

  # call stepCallback on enter step
  onStepEnter: (e) =>
    @stepCallback(e)
