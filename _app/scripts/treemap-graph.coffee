class window.TreemapGraph extends window.BaseGraph


  # Constructor
  # -----------

  constructor: (id, options) ->
    options.minSize = options.minSize || 80
    options.nodesPadding = options.nodesPadding || 8
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

    stratify = d3.stratify().parentId (d) -> d.parent

    @treemapRoot = stratify(@data)
      .sum (d) => d[@options.key.value]
      .sort (a, b) -> b.value - a.value
    @treemap @treemapRoot

    # draw nodes
    @nodes = @container.selectAll('.node')
      .data @treemapRoot.leaves()
      .enter().append('div')
        .attr 'class', 'node'
    #    .on 'mouseover', onNodeOver
    #    .on 'mousemove', onNodeMove
    #    .on 'mouseout',  onNodeOut
    #    .on 'click',     onNodeClick
        .call @setNode
        .call @setNodeDimension

    # add label only in nodes with size greater then options.minSize
    @nodes.append('div')
      .attr 'class', 'node-label'
      .style 'visibility', 'hidden'  # Hide labels by default (setNodeLabel will show if node is bigger enought)
      .call @setNodeLabel

    # filter nodes with labels visibles (based on options.minSize)
    @nodes.filter @isNodeLabelVisible
      .selectAll '.node-label'
        .style 'visibility', 'visible'

    return @

  getDimensions: ->
    console.log 'getDimensions', @width, @options.mobileBreakpoint
    super()
    if @width <= @options.mobileBreakpoint
      @containerHeight = @containerWidth
      @height          = @containerHeight - @options.margin.top - @options.margin.bottom
    return @

  updateGraphDimensions: ->
    super()

    @container.style 'height', @height+'px'

    # TODO!!! Change aspect ratio based on mobileBreakpoint

    # Update tremap size
    if @width <= @options.mobileBreakpoint
      @treemap.tile d3.treemapSlice
    else
      @treemap.tile d3.treemapSquarify
    @treemap.size [@width, @height]
    @treemap @treemapRoot

    # Update nodes data
    @nodes.data @treemapRoot.leaves()

    # Update nodes attributes & its labels
    @nodes
      .call @setNode
      .call @setNodeDimension
      .filter @isNodeLabelVisible
      .selectAll '.node-label'
        .style 'visibility', 'visible'

    return @


  setNode: (selection) =>
    selection
      .style 'padding',    (d) => if (d.x1-d.x0 > 2*@options.nodesPadding && d.y1-d.y0 > 2*@options.nodesPadding) then @options.nodesPadding+'px' else 0
      #.style 'background', (d) -> while (d.depth > 1) d = d.parent; return colorScale(getParentId(d)); })
      .style 'visibility', (d) -> if (d.x1-d.x0 == 0) || (d.y1-d.y0 == 0) then 'hidden' else ''
      .select '.node-label'
        .style 'visibility', 'hidden'

  setNodeLabel: (selection) =>
    label = selection.append 'div'
      .attr 'class', 'node-label-content'
    ###
    label.append 'svg'
      .attr 'viewBox', '0 0 24 24'
      .attr 'width', 24
      .attr 'height', 24
      .append 'use'
        .attr 'xlink:href', (d) -> '#icon-'+d.data.icon
    ###
    label.append 'p'
      .attr 'class', (d) -> return if d.value > 25 then 'size-l' else if d.value < 10 then 'size-s' else ''
      .html (d) => d.data[@options.key.id]

  setNodeDimension: (selection) ->
    selection
      .style 'left',   (d) -> d.x0 + 'px'
      .style 'top',    (d) -> d.y0 + 'px'
      .style 'width',  (d) -> d.x1-d.x0 + 'px'
      .style 'height', (d) -> d.y1-d.y0 + 'px'


  isNodeLabelVisible: (d) =>
    return d.x1-d.x0 > @options.minSize && d.y1-d.y0 > @options.minSize

    