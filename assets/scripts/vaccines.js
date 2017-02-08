(function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};window.BaseGraph=function(){function e(e,n){return this.setYAxisPosition=t(this.setYAxisPosition,this),this.setXAxisPosition=t(this.setXAxisPosition,this),this.onResize=t(this.onResize,this),this.setupMarkerLabel=t(this.setupMarkerLabel,this),this.setupMarkerLine=t(this.setupMarkerLine,this),this.id=e,this.options=$.extend(!0,{},i,n),this.$el=$("#"+this.id),this.getDimensions(),this.setSVG(),this.setScales(),this.markers=[],this}var n,i;return i={margin:{top:0,right:0,bottom:20,left:0},aspectRatio:.5625,label:!1,legend:!1,mouseEvents:!0,key:{id:"key",x:"key",y:"value"}},n={value:null,label:"",orientation:"horizontal",align:"right"},e.prototype.setSVG=function(){return this.svg=d3.select("#"+this.id).append("svg").attr("width",this.containerWidth).attr("height",this.containerHeight),this.container=this.svg.append("g").attr("transform","translate("+this.options.margin.left+","+this.options.margin.top+")")},e.prototype.loadData=function(t){return d3.csv(t,function(t){return function(e,n){return t.$el.trigger("data-loaded"),t.setData(n)}}(this)),this},e.prototype.setData=function(t){return this.data=this.dataParser(t),this.drawScales(),this.options.legend&&this.drawLegend(),this.drawMarkers(),this.drawGraph(),this.$el.trigger("draw-complete"),this},e.prototype.dataParser=function(t){return t},e.prototype.setGraph=function(){return this},e.prototype.setScales=function(){return this},e.prototype.drawScales=function(){return this.x.domain(this.getScaleXDomain()),this.y.domain(this.getScaleYDomain()),this.xAxis&&this.container.append("g").attr("class","x axis").call(this.setXAxisPosition).call(this.xAxis),this.yAxis&&this.container.append("g").attr("class","y axis").call(this.setYAxisPosition).call(this.yAxis),this},e.prototype.getScaleXRange=function(){return[0,this.width]},e.prototype.getScaleYRange=function(){return[this.height,0]},e.prototype.getScaleXDomain=function(){return[]},e.prototype.getScaleYDomain=function(){return[]},e.prototype.drawLegend=function(){return this},e.prototype.addMarker=function(t){return this.markers.push($.extend({},n,t)),this},e.prototype.drawMarkers=function(){return this.container.selectAll(".marker").data(this.markers).enter().append("line").attr("class","marker").call(this.setupMarkerLine),this.container.selectAll(".marker-label").data(this.markers).enter().append("text").attr("class","marker-label").attr("text-anchor",function(t){return"vertical"===t.orientation?"middle":"right"===t.align?"end":"start"}).attr("dy",function(t){return"horizontal"===t.orientation?"-0.25em":0}).text(function(t){return t.label}).call(this.setupMarkerLabel)},e.prototype.setupMarkerLine=function(t){return t.attr("x1",function(t){return function(e){return"horizontal"===e.orientation?0:t.x(e.value)}}(this)).attr("y1",function(t){return function(e){return"horizontal"===e.orientation?t.y(e.value):0}}(this)).attr("x2",function(t){return function(e){return"horizontal"===e.orientation?t.width:t.x(e.value)}}(this)).attr("y2",function(t){return function(e){return"horizontal"===e.orientation?t.y(e.value):t.height}}(this))},e.prototype.setupMarkerLabel=function(t){return t.attr("x",function(t){return function(e){return"horizontal"===e.orientation?"right"===e.align?t.width:0:t.x(e.value)}}(this)).attr("y",function(t){return function(e){return"horizontal"===e.orientation?t.y(e.value):t.height}}(this))},e.prototype.onResize=function(){return this.getDimensions(),this.updateGraphDimensions(),this},e.prototype.getDimensions=function(){return this.$el&&(this.containerWidth=this.$el.width(),this.containerHeight=this.containerWidth*this.options.aspectRatio,this.width=this.containerWidth-this.options.margin.left-this.options.margin.right,this.height=this.containerHeight-this.options.margin.top-this.options.margin.bottom),this},e.prototype.updateGraphDimensions=function(){return this.svg.attr("width",this.containerWidth).attr("height",this.containerHeight),this.x&&this.x.range(this.getScaleXRange()),this.y&&this.y.range(this.getScaleYRange()),this.xAxis&&this.container.selectAll(".x.axis").call(this.setXAxisPosition).call(this.xAxis),this.yAxis&&this.container.selectAll(".y.axis").call(this.setYAxisPosition).call(this.yAxis),this.container.select(".marker").call(this.setupMarkerLine),this.container.select(".marker-label").call(this.setupMarkerLabel),this},e.prototype.setXAxisPosition=function(t){return t.attr("transform","translate(0,"+this.height+")")},e.prototype.setYAxisPosition=function(t){return t.attr("transform","translate("+this.width+",0)")},e.prototype.getDataX=function(){return d[this.options.key.x]},e.prototype.getDataY=function(){return d[this.options.key.y]},e}()}).call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n={}.hasOwnProperty;window.BarGraph=function(n){function i(e,n){return this.onMouseOut=t(this.onMouseOut,this),this.onMouseOver=t(this.onMouseOver,this),this.setBarLabelYDimensions=t(this.setBarLabelYDimensions,this),this.setBarLabelXDimensions=t(this.setBarLabelXDimensions,this),this.setBarDimensions=t(this.setBarDimensions,this),this.getScaleYDomain=t(this.getScaleYDomain,this),this.getScaleXDomain=t(this.getScaleXDomain,this),i.__super__.constructor.call(this,e,n),this}return e(i,n),i.prototype.dataParser=function(t){return t.forEach(function(t){return function(e){return e[t.options.key.y]=+e[t.options.key.y]}}(this)),t},i.prototype.setScales=function(){return this.x=d3.scaleBand().range(this.getScaleXRange()).paddingInner(.1).paddingOuter(0),this.y=d3.scaleLinear().range(this.getScaleYRange()),this},i.prototype.getScaleXDomain=function(){return this.data.map(function(t){return function(e){return e[t.options.key.x]}}(this))},i.prototype.getScaleYDomain=function(){return[0,d3.max(this.data,function(t){return function(e){return e[t.options.key.y]}}(this))]},i.prototype.drawGraph=function(){return this.container.selectAll(".bar").data(this.data).enter().append("rect").attr("class",function(t){return t.active?"bar active":"bar"}).attr("id",function(t){return function(e){return e[t.options.key.id]}}(this)).call(this.setBarDimensions),this.options.mouseEvents&&this.container.selectAll(".bar").on("mouseover",this.onMouseOver).on("mouseout",this.onMouseOut),this.options.label&&(this.container.selectAll(".bar-label-x").data(this.data).enter().append("text").attr("class",function(t){return t.active?"bar-label-x active":"bar-label-x"}).attr("id",function(t){return function(e){return"bar-label-x-"+e[t.options.key.id]}}(this)).attr("dy","1.25em").attr("text-anchor","middle").text(function(t){return function(e){return e[t.options.key.x]}}(this)).call(this.setBarLabelXDimensions),this.container.selectAll(".bar-label-y").data(this.data).enter().append("text").attr("class",function(t){return t.active?"bar-label-y active":"bar-label-y"}).attr("id",function(t){return function(e){return"bar-label-y-"+e[t.options.key.id]}}(this)).attr("dy","-0.5em").attr("text-anchor","middle").text(function(t){return function(e){return t.options.label.format?t.options.label.format(e[t.options.key.y]):e[t.options.key.y]}}(this)).call(this.setBarLabelYDimensions)),this},i.prototype.updateGraphDimensions=function(){return i.__super__.updateGraphDimensions.call(this),this.container.selectAll(".bar").call(this.setBarDimensions),this.container.selectAll(".bar-label-x").call(this.setBarLabelXDimensions),this.container.selectAll(".bar-label-y").call(this.setBarLabelYDimensions),this},i.prototype.setBarDimensions=function(t){return t.attr("x",function(t){return function(e){return t.x(e[t.options.key.x])}}(this)).attr("y",function(t){return function(e){return t.y(e[t.options.key.y])}}(this)).attr("height",function(t){return function(e){return t.height-t.y(e[t.options.key.y])}}(this)).attr("width",this.x.bandwidth())},i.prototype.setBarLabelXDimensions=function(t){return t.attr("x",function(t){return function(e){return t.x(e[t.options.key.x])+.5*t.x.bandwidth()}}(this)).attr("y",function(t){return function(e){return t.height}}(this))},i.prototype.setBarLabelYDimensions=function(t){return t.attr("x",function(t){return function(e){return t.x(e[t.options.key.x])+.5*t.x.bandwidth()}}(this)).attr("y",function(t){return function(e){return t.y(e[t.options.key.y])}}(this))},i.prototype.onMouseOver=function(t){return this.container.select("#bar-label-x-"+t[this.options.key.id]).classed("active",!0),this.container.select("#bar-label-y-"+t[this.options.key.id]).classed("active",!0)},i.prototype.onMouseOut=function(t){if(!t.active)return this.container.select("#bar-label-x-"+t[this.options.key.id]).classed("active",!1),this.container.select("#bar-label-y-"+t[this.options.key.id]).classed("active",!1)},i}(window.BaseGraph)}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n={}.hasOwnProperty;window.LineGraph=function(n){function i(e,n){return this.setTickHoverPosition=t(this.setTickHoverPosition,this),this.setLineLabelHoverPosition=t(this.setLineLabelHoverPosition,this),this.onMouseMove=t(this.onMouseMove,this),this.onMouseOut=t(this.onMouseOut,this),this.setOverlayDimensions=t(this.setOverlayDimensions,this),this.setLabelDimensions=t(this.setLabelDimensions,this),this.getScaleXDomain=t(this.getScaleXDomain,this),i.__super__.constructor.call(this,e,n),this}return e(i,n),i.prototype.yFormat=d3.format("d"),i.prototype.setData=function(t){return this.years=this.getYears(t),i.__super__.setData.call(this,t),this},i.prototype.getYears=function(t){var e;return e=[],d3.keys(t[0]).forEach(function(t){if(+t)return e.push(+t)}),e.sort()},i.prototype.dataParser=function(t){return t.forEach(function(t){return function(e){return e.values={},t.years.forEach(function(t){return e[t]&&(e.values[t]=+e[t]),delete e[t]})}}(this)),t},i.prototype.setScales=function(){return this.x=d3.scaleLinear().range(this.getScaleXRange()),this.y=d3.scaleLinear().range(this.getScaleYRange()),this.xAxis=d3.axisBottom(this.x).tickFormat(d3.format("")),this.yAxis=d3.axisLeft(this.y).tickSize(this.width),this.line=d3.line().curve(d3.curveCatmullRom).x(function(t){return function(e){return t.x(+e.key)}}(this)).y(function(t){return function(e){return t.y(e.value)}}(this)),this.options.isArea&&(this.area=d3.area().curve(d3.curveCatmullRom).x(function(t){return function(e){return t.x(+e.key)}}(this)).y0(this.height).y1(function(t){return function(e){return t.y(e.value)}}(this))),this},i.prototype.getScaleXDomain=function(){return[this.years[0],this.years[this.years.length-1]]},i.prototype.getScaleYDomain=function(){return[0,d3.max(this.data,function(t){return d3.max(d3.values(t.values))})]},i.prototype.drawGraph=function(){return this.container.select(".graph").remove(),this.graph=this.container.append("g").attr("class","graph"),this.drawLines(),this.options.isArea&&this.drawAreas(),this.options.label&&this.drawLabels(),this.options.mouseEvents&&(this.drawLineLabelHover(),this.drawRectOverlay()),this},i.prototype.updateGraphDimensions=function(){return i.__super__.updateGraphDimensions.call(this),this.options.isArea&&this.area.y0(this.height),this.yAxis.tickSize(this.width),this.container.selectAll(".line").attr("d",this.line),this.options.isArea&&this.container.selectAll(".area").attr("d",this.area),this.options.label&&this.container.selectAll(".line-label").call(this.setLabelDimensions),this.options.mouseEvents&&(this.container.select(".overlay").call(this.setOverlayDimensions),this.container.select(".tick-hover").call(this.setTickHoverPosition)),this},i.prototype.drawLines=function(){return this.graph.selectAll(".line").data(this.data).enter().append("path").attr("class","line").attr("id",function(t){return function(e){return"line-"+e[t.options.key.id]}}(this)).datum(function(t){return d3.entries(t.values)}).attr("d",this.line)},i.prototype.drawAreas=function(){return this.graph.selectAll(".area").data(this.data).enter().append("path").attr("class","area").attr("id",function(t){return function(e){return"area-"+e[t.options.key.id]}}(this)).datum(function(t){return d3.entries(t.values)}).attr("d",this.area)},i.prototype.drawLabels=function(){return this.graph.selectAll(".line-label").data(this.data).enter().append("text").attr("class","line-label").attr("id",function(t){return function(e){return"line-label-"+e[t.options.key.id]}}(this)).attr("text-anchor","end").attr("dy","-0.125em").text(function(t){return function(e){return e[t.options.key.x]}}(this)).call(this.setLabelDimensions)},i.prototype.drawLineLabelHover=function(){if(this.container.selectAll(".line-label-point").data(this.data).enter().append("circle").attr("id",function(t){return function(e){return"line-label-point-"+e[t.options.key.id]}}(this)).attr("class","line-label-point").attr("r",4).style("display","none"),this.container.append("text").attr("class","tick-hover").attr("dy","0.71em").style("display","none").call(this.setTickHoverPosition),1===this.data.length)return this.container.append("text").attr("class","line-label-hover").attr("text-anchor","middle").attr("dy","-0.5em").style("display","none")},i.prototype.drawRectOverlay=function(){return this.container.append("rect").attr("class","overlay").call(this.setOverlayDimensions).on("mouseover",this.onMouseMove).on("mouseout",this.onMouseOut).on("mousemove",this.onMouseMove)},i.prototype.setLabelDimensions=function(t){return t.attr("x",this.width).attr("y",function(t){return function(e){return t.y(e.values[t.years[t.years.length-1]])}}(this))},i.prototype.setOverlayDimensions=function(t){return t.attr("width",this.width).attr("height",this.height)},i.prototype.onMouseOut=function(t){return this.$el.trigger("mouseout"),this.hideLabel()},i.prototype.onMouseMove=function(t){var e,n;if(e=d3.mouse(d3.event.target),n=Math.round(this.x.invert(e[0])),n!==this.currentYear)return this.$el.trigger("change-year",n),this.setLabel(n)},i.prototype.setLabel=function(t){return this.currentYear=t,this.container.select(".x.axis").selectAll(".tick").style("display","none"),this.container.selectAll(".line-label-point").each(function(t){return function(e){return t.setLineLabelHoverPosition(e)}}(this)),this.container.select(".tick-hover").style("display","block").attr("x",Math.round(this.x(this.currentYear))).text(this.currentYear)},i.prototype.hideLabel=function(){return this.container.selectAll(".line-label-point").style("display","none"),this.container.selectAll(".line-label-hover").style("display","none"),this.container.select(".x.axis").selectAll(".tick").style("display","block"),this.container.select(".tick-hover").style("display","none")},i.prototype.setLineLabelHoverPosition=function(t){var e,n,i;for(i=this.currentYear;this.years.indexOf(i)===-1&&this.currentYear>this.years[0];)i--;return this.currentYear=i,n=d3.select("#line-label-point-"+t[this.options.key.id]),e=this.container.selectAll(".line-label-hover"),t.values[i]?(n.style("display","block"),e.style("display","block"),n.attr("cx",function(t){return function(e){return t.x(i)}}(this)).attr("cy",function(e){return function(n){return t.values[i]?e.y(t.values[i]):0}}(this)),e.attr("x",function(t){return function(e){return t.x(i)}}(this)).attr("y",function(e){return function(n){return t.values[i]?e.y(t.values[i]):0}}(this)).text(function(e){return function(n){return t.values[i]?e.yFormat(t.values[i]):""}}(this))):(n.style("display","none"),void e.style("display","none"))},i.prototype.setTickHoverPosition=function(t){return t.attr("y",Math.round(this.height+this.options.margin.top+9))},i}(window.BaseGraph)}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n={}.hasOwnProperty;window.HeatmapGraph=function(n){function i(e,n){return this.getCountryName=t(this.getCountryName,this),this.onMouseOut=t(this.onMouseOut,this),this.onMouseOver=t(this.onMouseOver,this),this.setMarkerDimensions=t(this.setMarkerDimensions,this),this.setCellDimensions=t(this.setCellDimensions,this),this.getScaleYDomain=t(this.getScaleYDomain,this),this.getScaleXDomain=t(this.getScaleXDomain,this),this.getScaleYRange=t(this.getScaleYRange,this),this.getScaleXRange=t(this.getScaleXRange,this),i.__super__.constructor.call(this,e,n),this.formatFloat=d3.format(",.1f"),this.formatInteger=d3.format(",d"),this}return e(i,n),i.prototype.setSVG=function(){return this.svg=null,this.container=d3.select("#"+this.id+" .heatmap-graph"),this.options.legend&&this.container.classed("has-legend",!0),this.$tooltip=this.$el.find(".tooltip")},i.prototype.setData=function(t){return this.years=this.getYears(t),this.countries=t.map(function(t){return t.code}),this.cellsData=this.getCellsData(t),this.data=this.dataParser(t),this.getDimensions(),this.drawScales(),this.drawMarkers(),this.options.legend&&this.drawLegend(),this.drawGraph(),this},i.prototype.getYears=function(t){var e,n,i;return n=d3.min(t,function(t){return d3.min(d3.keys(t.values))}),e=d3.max(t,function(t){return d3.max(d3.keys(t.values))}),i=d3.range(n,e,1),i.push(+e),i},i.prototype.getCellsData=function(t){var e;return e=[],t.forEach(function(t){var n,i;n=[];for(i in t.values)n.push(e.push({country:t.code,name:t.name,year:i,cases:t.cases[i],value:t.values[i]}));return n}),e},i.prototype.dataParser=function(t){return t.forEach(function(t){return function(e){return e.values={},t.years.forEach(function(t){return e[t]&&(e.values[t]=+e[t]),delete e[t]})}}(this)),t},i.prototype.setScales=function(){return this.x=d3.scaleBand().padding(0).paddingInner(0).paddingOuter(0).round(!0).range(this.getScaleXRange()),this.y=d3.scaleBand().padding(0).paddingInner(0).paddingOuter(0).round(!0).range(this.getScaleYRange()),this.color=d3.scaleSequential(d3.interpolateOranges),this},i.prototype.drawScales=function(){return i.__super__.drawScales.call(this),this.color.domain([0,400]),this},i.prototype.getScaleXRange=function(){return[0,this.width]},i.prototype.getScaleYRange=function(){return[0,this.height]},i.prototype.getScaleXDomain=function(){return this.years},i.prototype.getScaleYDomain=function(){return this.countries},i.prototype.getDimensions=function(){var t;return this.width=this.$el.width()-70,this.years&&this.countries&&(t=Math.floor(this.width/this.years.length),this.height=t<20?t*this.countries.length:20*this.countries.length),this},i.prototype.drawGraph=function(){return this.x.range(this.getScaleXRange()),this.y.range(this.getScaleYRange()),this.container.append("div").attr("class","x-axis axis").selectAll(".axis-item").data(this.years.filter(function(t){return t%5===0})).enter().append("div").attr("class","axis-item").style("left",function(t){return function(e){return t.x(e)+"px"}}(this)).html(function(t){return t}),this.container.append("div").attr("class","y-axis axis").selectAll(".axis-item").data(this.countries).enter().append("div").attr("class","axis-item").style("top",function(t){return function(e){return t.y(e)+"px"}}(this)).html(function(t){return function(e){return t.getCountryName(e)}}(this)),this.container.append("div").attr("class","cell-container").style("height",this.height+"px").selectAll(".cell").data(this.cellsData).enter().append("div").attr("class","cell").style("background",function(t){return function(e){return t.color(e.value)}}(this)).on("mouseover",this.onMouseOver).on("mouseout",this.onMouseOut).call(this.setCellDimensions),this.container.select(".cell-container").selectAll(".marker").data(this.data.map(function(t){return{code:t.code,year:t.year_introduction}}).filter(function(t){return!isNaN(t.year)})).enter().append("div").attr("class","marker").call(this.setMarkerDimensions)},i.prototype.updateGraphDimensions=function(){return this.x.range(this.getScaleXRange()),this.y.range(this.getScaleYRange()),this.container.style("height",this.height+"px"),this.container.select(".cell-container").style("height",this.height+"px"),this.container.selectAll(".cell").call(this.setCellDimensions),this.container.select(".x-axis").selectAll(".axis-item").style("left",function(t){return function(e){return t.x(e)+"px"}}(this)),this.container.select(".y-axis").selectAll(".axis-item").style("top",function(t){return function(e){return t.y(e)+"px"}}(this)),this.container.select(".cell-container").selectAll(".marker").call(this.setMarkerDimensions),this.options.legend&&this.legend.call(this.setLegendPosition),this},i.prototype.setCellDimensions=function(t){return t.style("left",function(t){return function(e){return t.x(e.year)+"px"}}(this)).style("top",function(t){return function(e){return t.y(e.country)+"px"}}(this)).style("width",this.x.bandwidth()+"px").style("height",this.y.bandwidth()+"px")},i.prototype.setMarkerDimensions=function(t){return t.style("top",function(t){return function(e){return t.y(e.code)-1+"px"}}(this)).style("left",function(t){return function(e){return e.year<t.years[0]?t.x(t.years[0])-1+"px":e.year<t.years[t.years.length-1]?t.x(e.year)-1+"px":t.x.bandwidth()+t.x(t.years[t.years.length-1])+"px"}}(this)).style("height",this.y.bandwidth()+1+"px")},i.prototype.onMouseOver=function(t){var e;e=$(d3.event.target).offset(),this.$tooltip.find(".tooltip-inner .country").html(t.name),this.$tooltip.find(".tooltip-inner .year").html(t.year),this.$tooltip.find(".tooltip-inner .value").html(0===t.value?0:this.formatFloat(t.value)),this.$tooltip.find(".tooltip-inner .cases").html(this.formatInteger(t.cases)),this.$tooltip.css({left:e.left+.5*this.x.bandwidth()-.5*this.$tooltip.width(),top:e.top-.5*this.y.bandwidth()-this.$tooltip.height(),opacity:"1"})},i.prototype.onMouseOut=function(t){this.$tooltip.css("opacity","0")},i.prototype.getCountryName=function(t){var e;return e=this.data.filter(function(e){return e.code===t}),e[0]?e[0].name:""},i.prototype.drawLegend=function(){var t;return t=[0,100,200,300,400],this.legend=this.container.append("ul").attr("class","legend").style("margin-left",-(15*t.length)+"px"),this.legend.selectAll("li").data(t).enter().append("li").style("background",function(t){return function(e){return t.color(e)}}(this)).html(function(t,e){return 0!==e?t:"&nbsp"})},i}(BaseGraph)}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n={}.hasOwnProperty;window.MapGraph=function(n){function i(e,n){return this.onMouseOut=t(this.onMouseOut,this),this.onMouseMove=t(this.onMouseMove,this),this.onMouseOver=t(this.onMouseOver,this),this.setLegendPosition=t(this.setLegendPosition,this),this.setCountryColor=t(this.setCountryColor,this),i.__super__.constructor.call(this,e,n),this.formatFloat=d3.format(",.1f"),this.formatInteger=d3.format(",d"),this}return e(i,n),i.prototype.setSVG=function(){return i.__super__.setSVG.call(this),this.$tooltip=this.$el.find(".tooltip")},i.prototype.setScales=function(){return this.color=d3.scaleSequential(d3.interpolateOranges),this},i.prototype.loadData=function(t,e){return d3.queue().defer(d3.csv,t).defer(d3.json,e).await(function(t){return function(e,n,i){return t.$el.trigger("data-loaded"),t.setData(n,i)}}(this)),this},i.prototype.setData=function(t,e){return this.data=this.dataParser(t),this.color.domain([0,d3.max(this.data,function(t){return t.value})]),this.options.legend&&this.drawLegend(),this.drawGraph(e),this},i.prototype.drawLegend=function(){var t,e;return t=30,e=d3.range(0,this.color.domain()[1]),this.legend=this.container.append("g").attr("class","legend").call(this.setLegendPosition),this.legend.selectAll("rect").data(e).enter().append("rect").attr("x",function(n,i){return Math.round(t*(i-1-e.length/2))}).attr("width",t).attr("height",8).attr("fill",function(t){return function(e){return t.color(e)}}(this)),e.shift(),this.legend.selectAll("text").data(e).enter().append("text").attr("x",function(n,i){return Math.round(t*(i-.5-e.length/2))}).attr("y",20).attr("text-anchor","start").text(function(t){return t})},i.prototype.drawGraph=function(t){return this.countries=topojson.feature(t,t.objects.countries),this.countries.features=this.countries.features.filter(function(t){return"010"!==t.id}),this.projection=d3.geoKavrayskiy7(),this.projectionSetSize(),this.path=d3.geoPath().projection(this.projection),this.container.selectAll(".country").data(this.countries.features).enter().append("path").attr("id",function(t){return"country-"+t.id}).attr("class",function(t){return"country"}).attr("fill",this.setCountryColor).attr("stroke-width",1).attr("stroke",this.setCountryColor).attr("d",this.path).on("mouseover",this.onMouseOver).on("mousemove",this.onMouseMove).on("mouseout",this.onMouseOut),this.$el.trigger("draw-complete"),this},i.prototype.updateGraphDimensions=function(){return i.__super__.updateGraphDimensions.call(this),this.projectionSetSize(),this.path.projection(this.projection),this.container.selectAll(".country").attr("d",this.path),this.options.legend&&this.legend.call(this.setLegendPosition),this},i.prototype.projectionSetSize=function(){return this.projection.fitSize([this.width,this.height],this.countries).scale(1.1*this.projection.scale()).translate([.48*this.width,.6*this.height])},i.prototype.setCountryColor=function(t){var e;return e=this.data.filter(function(e){return e.code_num===t.id}),e[0]?this.color(e[0].value):"#eee"},i.prototype.setLegendPosition=function(t){return t.attr("transform","translate("+Math.round(.5*this.width)+","+-this.options.margin.top+")")},i.prototype.onMouseOver=function(t){var e,n,i;if(i=this.data.filter(function(e){return e.code_num===t.id}),i.length>0)return n=d3.mouse(d3.event.target),e=$(d3.event.target).offset(),this.$tooltip.find(".tooltip-inner .title").html(i[0].name),this.$tooltip.find(".tooltip-inner .value").html(this.formatFloat(i[0].value)),this.$tooltip.find(".tooltip-inner .cases").html(this.formatInteger(i[0].cases)),this.$tooltip.css({left:n[0]-.5*this.$tooltip.width(),top:n[1]-.5*this.$tooltip.height(),opacity:"1"})},i.prototype.onMouseMove=function(t){var e;return e=d3.mouse(d3.event.target),this.$tooltip.css({left:e[0]-.5*this.$tooltip.width(),top:e[1]-.5*this.$tooltip.height()})},i.prototype.onMouseOut=function(t){return this.$tooltip.css("opacity","0")},i}(window.BaseGraph)}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}},e=function(t,e){function i(){this.constructor=t}for(var r in e)n.call(e,r)&&(t[r]=e[r]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},n={}.hasOwnProperty;window.ScatterplotGraph=function(n){function i(e,n){return this.setXAxisPosition=t(this.setXAxisPosition,this),this.setDotLabelsDimensions=t(this.setDotLabelsDimensions,this),this.setDotsDimensions=t(this.setDotsDimensions,this),this.getScaleYDomain=t(this.getScaleYDomain,this),this.getScaleXDomain=t(this.getScaleXDomain,this),i.__super__.constructor.call(this,e,n),this}return e(i,n),i.prototype.dataParser=function(t){return t.forEach(function(t){return function(e){return e[t.options.key.x]=+e[t.options.key.x],e[t.options.key.y]=+e[t.options.key.y]}}(this)),t},i.prototype.setScales=function(){return this.x=d3.scalePow().exponent(.5).range(this.getScaleXRange()),this.y=d3.scaleLinear().range(this.getScaleYRange()),this.xAxis=d3.axisBottom(this.x).tickSize(this.height),this.yAxis=d3.axisLeft(this.y).tickSize(this.width),this},i.prototype.getScaleXDomain=function(){return[0,d3.max(this.data,function(t){return function(e){return e[t.options.key.x]}}(this))]},i.prototype.getScaleYDomain=function(){return[0,d3.max(this.data,function(t){return function(e){return e[t.options.key.y]}}(this))]},i.prototype.drawGraph=function(){return this.container.selectAll(".dot").data(this.data).enter().append("circle").attr("class","dot").attr("id",function(t){return function(e){return"dot-"+e[t.options.key.id]}}(this)).attr("r",6).call(this.setDotsDimensions),this.container.selectAll(".dot-label").data(this.data).enter().append("text").attr("class","dot-label").attr("id",function(t){return function(e){return"dot-"+e[t.options.key.id]}}(this)).attr("dx","0.75em").attr("dy","0.375em").text(function(t){return function(e){return e[t.options.key.id]}}(this)).call(this.setDotLabelsDimensions),this},i.prototype.updateGraphDimensions=function(){return i.__super__.updateGraphDimensions.call(this),this.container.selectAll(".dot").call(this.setDotsDimensions),this},i.prototype.setDotsDimensions=function(t){return t.attr("cx",function(t){return function(e){return t.x(e[t.options.key.x])}}(this)).attr("cy",function(t){return function(e){return t.y(e[t.options.key.y])}}(this))},i.prototype.setDotLabelsDimensions=function(t){return t.attr("x",function(t){return function(e){return t.x(e[t.options.key.x])}}(this)).attr("y",function(t){return function(e){return t.y(e[t.options.key.y])}}(this))},i.prototype.setXAxisPosition=function(t){return t.attr("transform","translate(0,0)")},i}(window.BaseGraph)}.call(this),function(){!function(t){var e,n,i,r,o,s,a,c,u,l,h,p,d,f,y;if(o=t("#article-content").data("lang"),e=t("#article-content").data("baseurl"),"es"===o&&d3.formatDefaultLocale({decimal:",",thousands:".",grouping:[3]}),n=d3.format(",.1f"),i=d3.format(",d"),t('[data-toggle="tooltip"]').tooltip(),r=function(t,e,n){var i;return i=t.filter(function(t){return t.code===e}),i?i[0]["name_"+n]:void 0},s=function(){return d3.csv(e+"/data/diseases-polio-cases-total.csv",function(e,n){var r,s,a,c,u,l,h,p;for(r={},s="es"===o?"casos":"cases",n.forEach(function(t){return r[t.year]=t.value}),l=Popcorn.HTMLYouTubeVideoElement("#video-map-polio"),l.src="http://www.youtube.com/embed/o-EzVOjnc6Q?controls=0&showinfo=0&hd=1",u=Popcorn(l),c=37,p=27/(c+1),a=0;a<c;)h=""+(1980+a),u.footnote({start:p*a,end:a<c-1?p*(a+1):p*(a+1)+1,text:h+'<br><span class="value">'+i(r[h])+" "+s+"</span>",target:"video-map-polio-description"}),a++;return l.addEventListener("ended",function(e){return t(".video-map-polio-cover").show(),t("#video-map-polio-description, #video-map-polio iframe").fadeTo(0,0),u.currentTime(0)}),t("#video-map-polio-play-btn").click(function(e){return e.preventDefault(),u.play(),t(".video-map-polio-cover").fadeOut(),t("#video-map-polio-description, #video-map-polio iframe").fadeTo(300,1)})})},h=function(){return d3.queue().defer(d3.csv,e+"/data/measles-cases-who-regions.csv").defer(d3.csv,e+"/data/countries-who-regions.csv").defer(d3.json,e+"/data/map-world-110.json").await(function(e,n,i,r){var s;return i.forEach(function(t){var e;if(e=n.filter(function(e){return e.region===t.region}),e.length>0)return t.value=1e5*e[0].cases,t.cases=e[0].cases_total,t.name=e[0]["name_"+o]}),s=new window.MapGraph("measles-world-map-graph",{aspectRatio:.5625,margin:{top:60,bottom:0},legend:!0}),s.setData(i,r),t(window).resize(s.onResize)})},a=function(e,n,i,r){var o;return n=n.filter(function(t){return i.indexOf(t.code)!==-1&&d3.values(t.values).length>0}).sort(function(t,e){return t.total-e.total}),o=new window.HeatmapGraph(e,{legend:r,margin:{right:0,left:0}}),o.setData(n),t(window).resize(o.onResize)},d=function(){return d3.queue().defer(d3.csv,e+"/data/confidence.csv").defer(d3.json,"http://freegeoip.net/json/").await(function(e,i,r){var s;return i.forEach(function(t){return function(t){if(t.value=+t.value,t.name=t["name_"+o],delete t.name_es,delete t.name_en,r&&t.code2===r.country_code)return t.active=!0}}(this)),s=new window.BarGraph("vaccine-confidence-graph",{aspectRatio:.3,label:{format:function(t){return n(t)+"%"}},margin:{top:0},key:{x:"name",y:"value",id:"code"}}),s.setData(i),t(window).resize(s.onResize)})},p=function(){return d3.queue().defer(d3.csv,e+"/data/tuberculosis-cases.csv").defer(d3.csv,e+"/data/countries.csv").await(function(e,n,s){
var a;return n.forEach(function(t){return function(t){if(t.value=+t.value,t.name=r(s,t.code,o),"ZAF"===t.code)return t.active=!0}}(this)),n.sort(function(t,e){return e.value-t.value}),a=new window.BarGraph("vaccine-bcg-cases-graph",{aspectRatio:.3,label:{format:function(t){return i(t)}},margin:{top:0},key:{x:"name",y:"value",id:"code"}}),a.setData(n),t(window).resize(a.onResize)})},f=function(){return d3.queue().defer(d3.csv,e+"/data/diseases-cases-measles.csv").defer(d3.csv,e+"/data/population.csv").await(function(t,e,n){return delete e.columns,e.forEach(function(t){var e,i,s;if(t.year_introduction&&(t.year_introduction=+t.year_introduction.replace("prior to","")),t.cases={},t.values={},t.name=r(n,t.code,o),i=n.filter(function(e){return e.code===t.code}),i.length>0)for(s=1980;s<2016;)t[s]&&(e=+i[0][s],0!==e&&(t.cases[s]=+t[s],t.values[s]=1e5*+t[s]/e)),delete t[s],s++;return t.total=d3.values(t.values).reduce(function(t,e){return t+e},0)}),a("vaccines-measles-graph-1",e,["FIN","HUN","PRT","URY","MEX","COL"],!0),a("vaccines-measles-graph-2",e,["IRQ","BGR","MNG","ZAF","FRA","GEO"],!1)})},c=function(){var n;return n=new window.LineGraph("immunization-coverage-graph-all",{key:{id:"code",x:"name"},label:!0,margin:{top:20}}),n.getScaleYDomain=function(t){return[0,100]},n.yAxis.tickValues([0,25,50,75,100]),d3.csv(e+"/data/immunization-coverage.csv",function(e,i){return n.setData(i.filter(function(e){return e.vaccine===t("#immunization-coverage-vaccine-selector").val()})),t("#immunization-coverage-vaccine-selector").change(function(e){return n.setData(i.filter(function(e){return e.vaccine===t("#immunization-coverage-vaccine-selector").val()})),t("#immunization-coverage-country-1-selector").trigger("change")}),t("#immunization-coverage-country-1-selector, #immunization-coverage-country-2-selector").change(function(e){return t("#immunization-coverage-graph-all").find(".line-label, .line").removeClass("active"),t("#immunization-coverage-graph-all #line-"+t("#immunization-coverage-country-1-selector").val()).addClass("active"),t("#immunization-coverage-graph-all #line-"+t("#immunization-coverage-country-2-selector").val()).addClass("active"),t("#immunization-coverage-graph-all #line-label-"+t("#immunization-coverage-country-1-selector").val()).addClass("active"),t("#immunization-coverage-graph-all #line-label-"+t("#immunization-coverage-country-2-selector").val()).addClass("active")}),t("#immunization-coverage-country-1-selector").trigger("change")}),t(window).resize(n.onResize)},u=function(){var n,i;return n=["LKA","DZA","DEU","DNK","FRA"],i=[],d3.queue().defer(d3.csv,e+"/data/immunization-coverage-mcv2.csv").defer(d3.csv,e+"/data/countries.csv").defer(d3.json,"http://freegeoip.net/json/").await(function(e,r,s,a){var c,u;return a&&(u=s.filter(function(t){return t.code2===a.country_code}),u&&u.length>0&&u[0].code&&(n[2]=u[0].code,c=t("#immunization-coverage-graph .graph-container").eq(2),c.find("p").html(u[0]["name_"+o]),c.find(".line-graph").attr("id","immunization-coverage-"+u[0].code.toLowerCase()+"-graph"))),n.forEach(function(e,n){var s,a;return s=r.filter(function(t){return t.code===e}).map(function(e){return t.extend({},e)}),s.forEach(function(t){return delete t[2001],delete t[2002]}),a=new window.LineGraph("immunization-coverage-"+e.toLowerCase()+"-graph",{isArea:!0,key:{x:"name",id:"code"}}),i.push(a),a.yFormat=function(t){return t+"%"},a.getScaleYDomain=function(t){return[0,100]},a.yAxis.tickValues([50]),a.xAxis.tickValues([2003,2015]),a.addMarker({value:95,label:n%2!==0?"":"es"===o?"Nivel de rebaño":"Herd immunity",align:"left"}),a.$el.on("draw-complete",function(t){return a.setLabel(2015),a.container.select(".x.axis").selectAll(".tick").style("display","block"),a.container.select(".tick-hover").style("display","none")}),a.setData(s),a.$el.on("change-year",function(t,e){return i.forEach(function(t){if(t!==a)return t.setLabel(e)})}),a.$el.on("mouseout",function(t){return i.forEach(function(t){if(t!==a)return t.hideLabel()})}),t(window).resize(a.onResize)})})},y=function(){var n,i;return n=["diphteria","measles","pertussis","polio","tetanus"],i=[],d3.csv(e+"/data/diseases-cases-world.csv",function(e,r){var o,s;return o=d3.max(r,function(t){return d3.max(d3.values(t),function(t){return+t})}),s=1e5,n.forEach(function(e){var n,a;return n=r.filter(function(t){return t.disease===e}).map(function(e){return t.extend({},e)}),a=new window.LineGraph(e+"-world-graph",{isArea:!0,margin:{left:20},key:{x:"disease",id:"disease"}}),i.push(a),a.xAxis.tickValues([1980,2015]),a.yAxis.ticks(2).tickFormat(d3.format(".0s")),a.yFormat=d3.format(".2s"),a.getScaleYDomain=function(){return[0,"measles"===e||"pertussis"===e?o:s]},a.setData(n),a.$el.on("change-year",function(t,e){return i.forEach(function(t){if(t!==a)return t.setLabel(e)})}),a.$el.on("mouseout",function(t){return i.forEach(function(t){if(t!==a)return t.hideLabel()})}),t(window).resize(a.onResize)})})},l=function(){return d3.queue().defer(d3.csv,e+"/data/immunization-coverage.csv").defer(d3.csv,e+"/data/countries.csv").defer(d3.json,"http://freegeoip.net/json/").await(function(e,n,i,s){var a,c,u,l,h;return s&&(h=i.filter(function(t){return t.code2===s.country_code}),s.code=h[0].code,s.name=h[0]["name_"+o]),u=["NIU","COK","TUV","NRU","PLW","VGB","MAF","SMR","GIB","TCA","LIE","MCO","SXM","FRO","MHL","MNP","ASM","KNA","GRL","CY","BMU","AND","DMA","IMN","ATG","SYC","VIR","ABW","FSM","TON","GRD","VCT","KIR","CUW","CHI","GUM","LCA","STP","WSM","VUT","NCL","PYF","BRB"],l={MCV1:95,Pol3:80,DTP3:80},n=n.filter(function(t){return u.indexOf(t.code)===-1}),a=function(t){var e;return e={key:t.code,name:r(i,t.code,o),value:+t[2015]},s&&t.code===s.code&&(e.active=!0),e},c=function(t,e){return e.value-t.value},t(".immunization-coverage-disease-graph").each(function(){var e,i,r,u,h,p,d;return e=t(this),i=e.data("disease"),d=e.data("vaccine"),u=n.filter(function(t){return t.vaccine===d&&""!==t[2015]}).map(a).sort(c),s&&(h=u.filter(function(t){return t.key===s.code})),r=new window.BarGraph(i+"-immunization-bar-graph",{aspectRatio:.25,label:{format:function(t){return+t+"%"}},key:{x:"name"},margin:{top:20}}),p={value:l[d],label:"es"===o?"Nivel de rebaño":"Herd immunity"},"DTP3"===d&&(p.label="es"===o?"Recomendación OMS":"WHO recommendation"),r.addMarker(p).setData(u),h&&h.length>0&&(e.find(".immunization-country").html(s.name),e.find(".immunization-data").html("<strong>"+h[0].value+"%</strong>"),e.find(".immunization-description").show()),t(window).resize(function(){return r.onResize()})})})},t("#video-map-polio").length>0&&s(),t(".vaccines-disease-graph").length>0&&f(),t("#immunization-coverage-graph-all").length>0&&c(),t("#immunization-coverage-graph").length>0&&u(),t("#world-cases").length>0&&y(),t(".immunization-coverage-disease-graph").length>0&&l(),t("#measles-world-map-graph").length>0&&h(),t("#vaccine-confidence-graph").length>0&&d(),t("#vaccine-bcg-cases-graph").length>0)return p()}(jQuery)}.call(this);