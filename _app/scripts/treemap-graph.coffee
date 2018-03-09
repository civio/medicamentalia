class window.TreemapGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    options.minSize = options.minSize || 60
    options.nodesPadding = options.nodesPadding || 8
    options.transitionDuration = options.transitionDuration || 600
    options.mobileBreakpoint = options.mobileBreakpoint || 620
    super id, options
    return @


  # Main methods
  # ------------

  # override draw scales
  drawScales: ->
    return @

  # override setSVG to use a div container (nodes-container) instead of a svg element
  setSVG: ->
    @container = d3.select('#'+@id).append('div')
      .attr 'class', 'nodes-container'
      .style 'height', @height+'px'

  drawGraph: ->
    @treemap = d3.treemap()
      .size [@width, @height]
      .padding 0
      .round true

    if @width <= @options.mobileBreakpoint
      @treemap.tile d3.treemapSlice

    @stratify = d3.stratify().parentId (d) -> d.parent

    @updateGraph()

    return @


  updateGraph: ->

    # update tremap 
    @treemapRoot = @stratify(@data)
      .sum (d) => d[@options.key.value]
      .sort (a, b) -> b.value - a.value
    @treemap @treemapRoot

    # update nodes
    nodes = @container.selectAll('.node')
      .data @treemapRoot.leaves()

    @container.selectAll('.node-label')
      .data @treemapRoot.leaves()
    
    nodes.enter().append('div')
      .attr 'class', 'node'
      .append 'div'
        .attr 'class', 'node-label'
        .append 'div'
          .attr 'class', 'node-label-content'
          .append 'p'

    # setup nodes
    @container.selectAll('.node')
      .call @setNode
      .call @setNodeDimensions

    # add label only in nodes with size greater then options.minSize
    @container.selectAll('.node-label')
      .style 'visibility', 'hidden'  # Hide labels by default (setNodeLabel will show if node is bigger enought)
      .call   @setNodeLabel
      .filter @isNodeLabelVisible    # filter nodes with labels visibles (based on options.minSize)
      .style 'visibility', 'visible'

    nodes.exit().remove()

    return @


  getDimensions: ->
    super()
    if @width <= @options.mobileBreakpoint
      @containerHeight = @containerWidth
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  updateGraphDimensions: ->
    super()

    @container.style 'height', @height+'px'

    # Update tremap size
    if @width <= @options.mobileBreakpoint
      @treemap.tile d3.treemapSlice
    else
      @treemap.tile d3.treemapSquarify
    @treemap.size [@width, @height]
    @treemap @treemapRoot

    # Update nodes data
    @container.selectAll('.node')
      .data @treemapRoot.leaves()
      .call @setNodeDimensions
      
    @container.selectAll('.node-label')
      .style 'visibility', 'hidden'  # Hide labels by default (setNodeLabel will show if node is bigger enought)
      .filter @isNodeLabelVisible    # filter nodes with labels visibles (based on options.minSize)
      .style 'visibility', 'visible'

    return @


  setNode: (selection) =>
    selection
      .attr 'class',       @getNodeClass
      .style 'padding',    (d) => if (d.x1-d.x0 > 2*@options.nodesPadding && d.y1-d.y0 > 2*@options.nodesPadding) then @options.nodesPadding+'px' else 0
      .style 'visibility', (d) -> if (d.x1-d.x0 == 0) || (d.y1-d.y0 == 0) then 'hidden' else ''

  setNodeDimensions: (selection) =>
    selection
      .style 'left',   (d) -> d.x0 + 'px'
      .style 'top',    (d) -> d.y0 + 'px'
      .style 'width',  (d) -> d.x1-d.x0 + 'px'
      .style 'height', (d) -> d.y1-d.y0 + 'px'

  setNodeLabel: (selection) =>
    selection.select('p')
      .attr 'class', (d) -> return if d.value > 25 then 'size-l' else if d.value < 10 then 'size-s' else ''
      .html (d) => d.data[@options.key.id]

  isNodeLabelVisible: (d) =>
    return d.x1-d.x0 > @options.minSize && d.y1-d.y0 > @options.minSize

  getNodeClass: (d) ->
    return 'node'
    