function patents_graph( _id ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var $el = $(id);
  var lang = $el.data('lang');
  var txt = {
    'es': 'Se aprueba la licencia obligatoria',
    'en': 'Compulsory license is approved'
  };
  var markerValue = 2007;

  var margin = {top: 20, right: 0, bottom: 20, left: 0},
      widthCont = 1140,
      heightCont = 500,
      width, height;

  var svg,
      x, y,
      xAxis,
      line;


  // Public Methods

  that.init = function() {

    //console.log('init patents graph');

    widthCont = $el.width();
    heightCont = widthCont*0.5625;

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    x = d3.scaleBand()
      .range([0, width])
      .round(true)
      .paddingInner(0.1)
      .paddingOuter(0);

    y = d3.scaleLinear()
      .range([height, 0]);

    xAxis = d3.axisBottom()
      .scale(x);

    line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.patents); });

    svg = d3.select(id).append('svg')
      .attr('id', 'patents-graph-svg')
      .attr('width', widthCont)
      .attr('height', heightCont)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Load CSV
    d3.csv( $('body').data('baseurl')+'/assets/data/patents.csv', function(error, data) {

      data.forEach(function(d) {
        d.patents = +d.patents;
      });

      x.domain(data.map(function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.patents; })]);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      svg.append('line')
        .attr('class', 'marker')
        .attr("x1", function(d) { return x(markerValue); })
        .attr("y1", height)
        .attr("x2", function(d) { return x(markerValue); })
        .attr("y2", height);

      svg.append('g')
        .attr('class', 'marker-label')
        .append('text')
        .attr('x', function(d) { return x(markerValue); })
        .text( txt[lang] );

      svg.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date); })
        .attr('y', height )
        .attr('height', 0)
        .attr('width', x.bandwidth());

      svg.selectAll('.bar-label')
        .data(data)
      .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', function(d) { return x(d.date)+(x.bandwidth()*0.5); })
        .attr('y', function(d) { return y(d.patents); })
        .attr('dy', '1.5em')
        .text( function(d){ return d.patents; });

       d3.selectAll('.bar')
        .transition().duration(800).delay( function(d,i){ return 100*i; })
        .attr('y', function(d) { return y(d.patents); })
        .attr('height', function(d) { return height - y(d.patents); });

       d3.select('.marker')
        .transition().duration(600).delay(1500)
        .attr('y1', 0 );
    });

    return that;
  };

  that.onResize = function() {

    widthCont = $el.width();
    heightCont = widthCont*0.5625;

    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;

    updateData();

    return that;
  };

  var updateData = function(){

    d3.select('#patents-graph-svg')
      .attr('width', widthCont)
      .attr('height', heightCont);

    x.range([0, width]);
    y.range([height, 0]);

    d3.select('g.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    d3.select('.marker-label text').attr('x', function(d) { return x(markerValue); });

    d3.selectAll('.bar')
      .attr('x', function(d) { return x(d.date); })
      .attr('y', function(d) { return y(d.patents); })
      .attr('width', x.bandwidth())
      .attr('height', function(d) { return height - y(d.patents); });

    d3.selectAll('.bar-label')
      .attr('x', function(d) { return x(d.date)+(x.bandwidth()*0.5); })
      .attr('y', function(d) { return y(d.patents); });

    d3.select('.marker')
      .attr("x1", function(d) { return x(markerValue); })
      .attr("x2", function(d) { return x(markerValue); })
      .attr('y2', height );
  };

  return that;
}

var Infographic = function( _id, _type ) {

  var $ = jQuery.noConflict();

  var that = this;

  var id = _id;
  var type = _type;

  var vis,
      scrollTop,
      endPosition,
      currentItem = -1,
      $navItems,
      $el, $fixedEl, $contentList;


  // Private Methods

  var setIframeBtns = function(){
    $contentList.each(function(i){
      $(this).append('<div class="btn-next"><a href="#'+(i+2)+'" class="btn btn-default btn-sm">Siguiente <i class="glyphicon glyphicon-chevron-right"></i></a></div>');
    });
    $contentList.find('.btn-next a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
    $('html, body').animate({ scrollTop: $('.infographic-frame li.frame-1').offset().top + 2}, '200');
  };

  // Get url params
  var urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  };

  // Public Methods

  that.init = function(){

    //console.log('infographic', id, type);

    $el = $( id );
    $contentList = $el.find('.infographic-content li');
    $navItems = $el.find('.infographic-nav li');

    // Setup for prices infographic
    if( type === 'prices'){
      // Add extra frame items for Prices Infographic
      $el.find('.infographic-frame')
        .append('<li class="frame-'+($navItems.length+1)+'"><div class="scroller"></div></li>')
        .append('<li class="frame-'+($navItems.length+2)+'"><div class="scroller"></div></li>');
      // Add extra nav item for Prices Infographic in iframe mode
      if( $el.hasClass('iframe') ){
        $el.find('.infographic-nav').append('<li><a href="#'+($navItems.length+1)+'"></a></li>');
      }
    }

    $fixedEl = $el.find('.infographic-content, .infographic-nav, .infographic-graph');

    // Setup Infographic by Type
    if( type === 'antimalaricos'){
      vis = new Antimalaricos_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'fakes'){
      vis = new Fakes_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'patentes'){
      vis = new Patents_Infographic( id+' .infographic-graph' ).init();
    }
    else if( type === 'prices'){
      vis = new Prices_Infographic( id+' .infographic-graph' );
    }

    that.onResize();

    if( type === 'prices'){
      vis.init( urlParam('skip') === 'true' );  // Setup skip value to prices Infographic
      if( $el.hasClass('iframe') ){
        if( vis.skip ){
          $('#prices-infographic .infographic-frame').hide();
          $('#prices-infographic-menu').addClass('active');
          $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }
        else{
          setIframeBtns();
        }
      }
    }
    
    $contentList.first().addClass('active');    // Setup firs content item as active

    // Nav Buttons Click Interaction
    $navItems.find('a').click(function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $el.find('.infographic-frame li.frame-'+$(this).attr('href').substring(1)).offset().top + 2
      }, '200');
    });
  };


  that.onScroll = function(e) {

    scrollTop = $(window).scrollTop();

    if ( scrollTop >= $el.offset().top && scrollTop < endPosition ) {
      $fixedEl.addClass('fixed');
      if( type === 'prices'){ $('#prices-infographic-tooltip').addClass('fixed'); }
    } else {
      $fixedEl.removeClass('fixed');
      if( type === 'prices'){ $('#prices-infographic-tooltip').removeClass('fixed'); }
    }

    if ( scrollTop >= endPosition ) {
      $fixedEl.addClass('bottom');
    }
    else {
      $fixedEl.removeClass('bottom');
    }

    var lastItem = currentItem,
        temp = Math.floor((scrollTop-$el.offset().top) / $(window).height());

    if (currentItem !== temp) {

      currentItem = temp;

      if (currentItem >= 0) {

        //console.log('state', type, currentItem, $contentList.length );

        // Show/hide prices Infographic Menu
        if (type === 'prices') {
          if (currentItem !== $contentList.length) {
            $('#prices-infographic-menu').removeClass('active');
            $el.find('.infographic-nav, .infographic-content').removeClass('invisible');
          }
          else {
            $('#prices-infographic-menu').addClass('active');
            $el.find('.infographic-nav, .infographic-content').addClass('invisible');
          }
        }

        vis.setState( currentItem );

        if( lastItem < currentItem ){
          $contentList.not('.active').css('top', '40px');
          $contentList.filter('.active').css('top', '-40px').removeClass('active');
        }
        else{
          $contentList.not('.active').css('top', '-40px');
          $contentList.filter('.active').css('top', '40px').removeClass('active');
        }

        $contentList.eq(currentItem).css('top', '0px').addClass('active');

        $navItems.removeClass('active');
        $navItems.eq(currentItem).addClass('active');
      }
    }
  };

  that.onResize = function() {

    $el.find('.infographic-content, .infographic-nav, .infographic-frame li').height( $(window).height() );
    $el.find('.infographic-graph').height( $(window).height() - $('.infographic-graph').position().top - 30 );

    endPosition = $el.offset().top + $el.height() - $(window).height();

    //if ($(window).width() <= 992) {
    if ($(window).width() < 860) {
      $el.find('.infographic-content').css('height','auto');
    }

    if (type === 'prices' && vis.isInitialized()) {
      vis.resize();
    }
  };

  // Init
  that.init();
};
var Antimalaricos_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;


  // Public Methods

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/antimalaricos.svg' ).mimeType('image/svg+xml').get( function(xml) {

      $(id).append( xml.documentElement );  // Append external SVG to Container

      svg = d3.select(id).select('svg');    // Get SVG Element

      // Initial Setup: all grups hidden
      svg.selectAll('#Bubble1, #Bubble2, #Bubble3, #Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia, #Ginebra').style('opacity', 0);
      svg.select('#Markers').selectAll('image').style('opacity', 0);
      svg.select('#MarkersIndia').selectAll('image').style('opacity', 0);
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      bubbleOut('#Bubble2');

      svg.selectAll('#Brasil')
        .transition().duration(1000)
        .style('opacity', 1);

      bubbleIn('#Bubble1');
    }
    else if( stateID === 1 ){

      bubbleOut('#Bubble1');
      markersOut('#Markers');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela')
        .transition().duration(300)
        .style('opacity', 0);

      bubbleIn('#Bubble2');
    }
    else if( stateID === 2 ){

      bubbleOut('#Bubble2');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Brasil, #Bolivia, #Venezuela, #World, #India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);

      markersIn('#Markers', 200, 300);
    }
    else if( stateID === 3 ){

      bubbleOut('#Bubble3');
      markersOut('#Markers');
      markersOut('#MarkersIndia');

      svg.selectAll('#Continent, #Brasil, #Bolivia, #Venezuela, #Ginebra')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#World')
        .transition().duration(1000)
        .style('opacity', 1);

      svg.select('#India')
        .transition().duration(500).delay(2000)
        .style('opacity', 1);

      markersIn('#MarkersIndia', 600, 900);

      svg.select('#PathIndia')
        .style('opacity', 1);

      svg.select('#PathIndia').select('#SVGID_antimalaricos_1_')
        .attr('transform', 'scale(0 1)')
        .transition().duration(1500).delay(800)
        .attr('transform', 'scale(1 1)');
    }
    else if( stateID === 4 ){

      markersOut('#MarkersIndia');

      svg.selectAll('#India, #PathIndia')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Ginebra')
        .transition().duration(400)
        .style('opacity', 1);

      bubbleIn('#Bubble3');
    }

    return that;
  };


  // Private Methods

  var bubbleIn = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(400).delay(300)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var bubbleOut = function( id ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(400)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.8) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  var markersIn = function( id, offset, delay ){

    svg.select(id).selectAll('image')
      //.attr('transform', 'translate(0 -10)')
      .transition().duration(500).delay( function(d,i){ return offset+(delay*i); })
      //.attr('transform', 'translate(0 0)')
      .style('opacity', 1);
  };

  var markersOut = function( id ){
  
    svg.select(id).selectAll('image')
      .transition().duration(300)
      //.attr('transform', 'translate(0 -10)')
      .style('opacity', 0);
  };


  return that;
};

var Fakes_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;
  var lastState = -1;


  // Public Methods

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/fakes.svg' ).mimeType('image/svg+xml').get( function(xml) {

      $(id).append( xml.documentElement );  // Append external SVG to Container

      svg = d3.select(id).select('svg');    // Get SVG Element

      // Initial Setup: all grups hidden
      svg.selectAll('#Continents, #Path, #LomeLabel, #LomeMarker, #MumbaiLabel, #MumbaiMarker, #IndiaMarker, #IndiaLabel').style('opacity', 0);
      svg.select('#AfricanCountries').selectAll('path').style('opacity', 0);
    });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      svg.selectAll('#Path, #MumbaiMarker, #MumbaiLabel, #LomeMarker, #LomeLabel')
        .transition().duration(200)
        .style('opacity', 0);

      if( lastState === 1 ){
        fadeOutPath('#Continents', 400);
        fadeInPath('#India', 600);
      }

      svg.selectAll('#IndiaMarker, #IndiaLabel')
        .transition().duration(300).delay(function(d,i){ return 400+(300*i); })
        .style('opacity', 1);
    }
    else if( stateID === 1 ){

      svg.selectAll('#IndiaMarker, #IndiaLabel')
        .transition().duration(200)
        .style('opacity', 0);

      svg.select('#AfricanCountries').selectAll('path')
        .transition().duration(200)
        .style('opacity', 0);

      fadeOutPath('#India', 400);

      if( lastState === 0 ){
        fadeInPath('#Continents', 600);
      }

      svg.selectAll('#MumbaiMarker, #MumbaiLabel')
        .transition().duration(300).delay(function(d,i){ return 500+(300*i); })
        .style('opacity', 1);

      svg.selectAll('#LomeMarker, #LomeLabel')
        .transition().duration(300).delay(function(d,i){ return 1800+(300*i); })
        .style('opacity', 1);

      svg.select('#Path')
        .style('opacity', 1);

      var w = svg.select('#Path').select('#SVGID_1_').attr('width');

      svg.select('#Path').select('#SVGID_1_')
        .attr('transform', 'translate('+w+' 0)')
        .transition().duration(1500).delay(600)
        .attr('transform', 'translate(0 0)');
    }
    else if( stateID === 2 ){

      svg.selectAll('#Path, #MumbaiMarker, #MumbaiLabel, #LomeMarker, #LomeLabel')
        .transition().duration(200)
        .style('opacity', 0);

      svg.select('#AfricanCountries').selectAll('path')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }

    lastState = stateID;

    return that;
  };


  // Private Methods
  var fadeInPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(duration)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var fadeOutPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(duration)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };


  return that;
};

var Patents_Infographic = function( _id ) {

  var $ = jQuery.noConflict();

  var that = this;
  var id = _id;
  var svg;
  var lastState = -1;
  var c = 41; // Counter for countries;
  var countries = ['Albania', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Barbados', 'Belgium', 'Belize', 'Benin', 'Bolivia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',  'D.R. Congo', 'Denmark', 'Djibouti', 'Dominica',  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kenya', 'Korea', 'Kuwait', 'Kyrgyz Republic', 'Lao P.D.R', 'Latvia', 'Lesotho', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts & Nevis', 'Saint Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovak Republic', 'Slovenia', 'Solomon Islands', 'South Africa', 'Spain', 'Sri Lanka', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Chinese Taipei', 'Tajikistan', 'Tanzania', 'Thailand', 'Macedonia', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Vanuatu', 'Venezuela', 'Viet Nam', 'Yemen', 'Zambia', 'Zimbabwe'];

  that.init = function() {

    // Load external SVG
    d3.xml( $('body').data('baseurl')+'/assets/images/svg/patentes.svg' ).mimeType('image/svg+xml').get( function(xml) {
    
        $(id).append( xml.documentElement );  // Append external SVG to Container

        svg = d3.select(id).select('svg');    // Get SVG Element

        // Initial Setup: all grups hidden
        svg.selectAll('#World, #Doc1, #Doc2').style('opacity', 0);
        svg.selectAll('#Chemistry, #Time').selectAll('g').style('opacity', 0);
        svg.selectAll('#Sign').selectAll('g').style('opacity', function(d,i){ return (i<4) ? 0 : 1; });

        countries = d3.shuffle(countries);

        svg.select('#World').selectAll('text')
          .style('text-anchor', function(d,i){ return (i<21) ? 'end' : 'start'; })
          .text(function(d,i){ return countries[i]; })
          .style('opacity', 0)
          .transition()
            .delay(function(d,i) { return i * 100; })
            .on('start', function repeat() {
              if (c >= countries.length) { c=0; }
              d3.active(this)
                .style('opacity', 0)
                .text(countries[c++])
                .transition().duration(1800)
                .style('opacity', 1)
                .transition().duration(900)
                .style('opacity', 0)
                .transition().on('start', repeat);
            });

        /*
        svg.select('#World').selectAll('.text')
          .data(countries)
        .enter().append('text')
          .attr('class', 'country-label')
          .style('text-anchor', 'middle')
          .text(function(d){ return d3.values(d)[0]; });
        */
      });

    return that;
  };

  that.setState = function(stateID) {

    if( stateID === 0 ){

      fadeOutAll();
      fadeOutPath('#Doc1', 300);

      /*
      svg.select('#Doc1')
        .transition().duration(300)
        .style('opacity', 0);
      */
      
      svg.select('#Sign').selectAll('g')
        .transition().duration(400).delay( function(d,i){ return 300*(4-i); })
        .style('opacity', 1);
    }
    else if( stateID === 1 ){

      /*
      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      svg.select('#Sign').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      fadeOutAll();
      
      fadeInPath('#Doc1', 800);
    }
    else if( stateID === 2 ){

      fadeOutAll();
      fadeOutPath('#Doc1', 300);
      fadeOutPath('#Doc2', 300);

      /*
      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */
   
      svg.select('#Chemistry').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 3 ){

      fadeOutAll();
      fadeOutPath('#Time', 300);

      /*
      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Chemistry').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
        */

      fadeInPath('#Doc2', 800);

      svg.select('#Doc2').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 4 ){

      fadeOutAll();
      fadeOutPath('#Doc2', 300);

      /*
      svg.selectAll('#World')
        .transition().duration(300)
        .style('opacity', 0);

      svg.selectAll('#Doc2').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      fadeInPath('#Time', 800);

      svg.select('#Time').selectAll('g')
        .transition().duration(500).delay( function(d,i){ return 300*i; })
        .style('opacity', 1);
    }
    else if( stateID === 5 ){

      fadeOutAll();
       fadeOutPath('#Time', 300);

      /*
      svg.select('#Time').selectAll('g')
        .transition().duration(300)
        .style('opacity', 0);
      */

      svg.select('#World')
        .transition().duration(800)
        .style('opacity', 1);

      /*
      var w = svg.select('#Map').node().getBBox().width;

      svg.select('#Map')
        .transition().duration(1500)
        .attr('transform', 'translate('+w+' 0)');
      */
    }

    lastState = stateID;

    return that;
  };

  // Private Methods
  var fadeOutAll = function(){

    svg.selectAll('#World, #Doc1, #Doc2')
      .transition().duration(300)
      .style('opacity', 0);

    svg.selectAll('#Chemistry, #Time, #Sign').selectAll('g')
      .transition().duration(300)
      .style('opacity', 0);
  };

  var fadeInPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .transition().duration(duration)
      .attr('transform', 'translate(0 0) scale(1)')
      .style('opacity', 1);
  };

  var fadeOutPath = function( id, duration ){

    var center = svg.select(id).node().getBBox();

    svg.select(id)
      .transition().duration(duration)
      .attr('transform', 'translate('+(center.x+(center.width*0.5))+' '+(center.y+(center.height*0.5))+') scale(0.9) translate(-'+(center.x+(center.width*0.5))+' -'+(center.y+(center.height*0.5))+')')
      .style('opacity', 0);
  };

  return that;
};

function Prices_Infographic( _id ) {

  var $ = jQuery.noConflict();

  var that = this,
      initialized = false,
      DOT_OPACITY = 0.7,
      DOT_RADIUS = 7,
      DOT_GRAY = '#d6d6d6',
      current = {
        data: 'affordability',
        type: 'private',
        order: 'area',
        label: 'Private sector - number of days'
      },
      txt = {
        'es': {
          'gratis': 'gratis',
          'dias': 'Días',
          'horas': 'horas',
          'menoshora': 'menos de una hora',
          'Africa': 'África',
          'America': 'América',
          'Asia': 'Asia',
          'Europe': 'Europa',
          'Oceania': 'Oceanía',
          'Low income': 'Ingreso bajo',
          'Lower middle income': 'Ingreso medio bajo',
          'Upper middle income': 'Ingreso medio alto',
          'High income': 'Ingreso alto',
        },
        'en': {
          'gratis': 'free',
          'dias': 'Days',
          'horas': 'hours',
          'menoshora': 'less than an hour',
          'Africa': 'Africa',
          'America': 'America',
          'Asia': 'Asia',
          'Europe': 'Europe',
          'Oceania': 'Oceania',
          'Low income': 'Low income',
          'Lower middle income': 'Lower middle income',
          'Upper middle income': 'Upper middle income',
          'High income': 'High income',
        }
      },
      overlayCode = null,
      dotClicked = null;

  var margin = {top: 150, right: 50, bottom: 50, left: 50},
      widthCont, heightCont,
      width, height;

  var id = _id,
      $el = $(id),
      $menu = $('#prices-infographic-menu'),
      $tooltip = $('#prices-infographic-tooltip'),
      $regionDropdownInputs = $('#region-dropdown-menu .checkbox input'),
      $drugDropdownInputs = $('#drug-dropdown-menu .checkbox input');

  var lang = $el.parent().data('lang');

  var color = d3.scaleOrdinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      timeout, tooltipItem, drugsFiltered, drugsFilteredAll,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries, dataCountriesAll;

  var $svg, $dots, $lines, $countryMarker, $countryLabel, $overlay, $mprLine, $yAxis, $xAxis, $yLabel, $xArea;

  var tickFormatPrices = function(d){
        if (d === 0) {
          return txt[lang].gratis;
        }
        return d+'x';
      };

  var tickFormatAffordability = function(d){
        if (d === 0) {
          return txt[lang].gratis;
        }
        return d;
      };

  // Setup Visualization

  that.init = function( _skip ) {

    initialized = true;

    // Use /?skip=true to skip infographic tour
    that.skip = _skip;

    setDimensions();

    x = d3.scalePoint()
      .range([0, width]);

    y = d3.scalePow().exponent(0.5)
      .range([height, 0]);

    xAxis = d3.axisBottom(x)
      .tickSize(-height)
      .tickPadding(12);

    yAxis = d3.axisLeft(y)
      .tickSize(-width)
      .tickPadding(8)
      .tickFormat(tickFormatAffordability);

    svg = d3.select(id).append('svg')
        .attr('id', 'prices-infographic-svg')
        .attr('width', widthCont)
        .attr('height', heightCont)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Set drug filtered
    drugsFilteredAll = '';
    $drugDropdownInputs.each(function(){
      drugsFilteredAll += $(this).attr('name')+' ';
    });
    drugsFiltered = drugsFilteredAll;

    // Load CSVs
    d3.queue()
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/prices.csv')
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/affordability.csv')
      .defer(d3.csv, $('body').data('baseurl')+'/assets/data/prices-countries.csv')
      .await( onDataReady );

    return that;
  };

  that.setState = function(stateID) {

    //console.log( stateID );

    if( stateID === 0 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      // Show only Salbutamol dots
      $dots.transition(1000)
        .style('fill', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d.Drug !== 'Salbutamol') ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return (a.Drug === 'Salbutamol') ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-salbutamol.country-kyrgyzstan');

    } else if( stateID === 1 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      // Show all dots
      setDotsColor()

      setTooltipOnTour('.dot.drug-captopril.country-ghana');

    } else if( stateID === 2 ){

      drugsFiltered = 'Simvastatin Omeprazole';
      updateData( 'affordability', 'private' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (drugsFiltered.indexOf(d.Drug) === -1) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return (drugsFiltered.indexOf(a.Drug) > -1) ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-simvastatin.country-são-tomé-and-príncipe');

    } else if( stateID === 3 ){

      drugsFiltered = drugsFilteredAll;
      var countries = 'São Tomé and Príncipe Kuwait Italy Spain Germany';
      updateData( 'affordability', 'private' );

      $dots.transition(1000)
        .style('fill', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (countries.indexOf( d.Country ) === -1 ) ? DOT_OPACITY : 1; });

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-são-tomé-and-príncipe');

    } else if( stateID === 4 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-morocco');
     
    } else if( stateID === 5 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      $dots.transition(1000)
        .style('fill', DOT_GRAY)
        .style('opacity',DOT_OPACITY);

      svg.selectAll('.dot.country-kuwait')
        .transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', 1);

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-kuwait');
      
    } else if( stateID === 6 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'public' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-diclofenac.country-sudan');
     
    } else if( stateID === 7 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'public' );

      setDotsColor();

      setTooltipOnTour('.dot.drug-amoxicillin.country-brazil--rio-grande-do-sul-state');

    } else if( stateID === 8 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'private' );

      // Show only drugsFiltered dots
      $dots.transition(1000)
        .style('fill', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return ('Ciprofloxacin' !== d.Drug) ? DOT_OPACITY : 1; });

      // Set selected dots on top
      $dots.sort(function (a, b) {
        return ('Ciprofloxacin' === a.Drug) ? 1 : -1;
      });

      setTooltipOnTour('.dot.drug-ciprofloxacin.country-ethiopia');

    } else if( stateID === 9 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'affordability', 'private' );

      $tooltip.css('opacity', '0');
      tooltipItem = null;

      setDotsColor();
    }

    return that;
  };

  that.resize = function() {

    setDimensions();  // Update width/height

    //if( widthCont < 992 ){ return that; }   // Skip for mobile sizes
    if( widthCont < 860 || height < 0 ){ return that; }   // Skip for mobile sizes

    $svg.attr('width', widthCont).attr('height', heightCont);   // Update SVG size

    //Update Axis
    x.range([0, width]);
    y.range([height, 0]);

    xAxis.tickSize(-height);
    yAxis.tickSize(-width);

    $xAxis
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    $yAxis.call(yAxis);

    // Country Marker
    $countryMarker.attr('y1', height);
    $countryLabel.attr('y', height+36);

    // MPR Line
    $mprLine.attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.selectAll('line').attr('x2', width);

    // Mouse events overlay
    $overlay
      .attr('width', width)
      .attr('height', height);

    // Set Tooltip position in Tour
    if (tooltipItem) {
      if ($tooltip.hasClass('left') ) {
        $tooltip.css('right', (widthCont-Math.round(tooltipItem.attr('cx'))-margin.left)+'px');
      } else{
        $tooltip.css('left', (Math.round(tooltipItem.attr('cx'))+margin.left)+'px');
      }
      var top = Math.round(tooltipItem.attr('cy'));
      if (top > 60){
        $tooltip.css('top', (top+margin.top-8-($tooltip.height()*0.5))+'px');
      } else {
        $tooltip.css('top', (top+margin.top-18)+'px');
      }
    }

    // Update Dots & Lines
    $lines.selectAll('line')
      .attr('x1', setValueX)
      .attr('y1', height)
      .attr('x2', setValueX)
      .attr('y2', setValueY);

    $dots
      .attr('cx', setValueX)
      .attr('cy', setValueY);

    if (widthCont < 960 && DOT_RADIUS === 7) {
      DOT_RADIUS = 6;
      $dots.attr('r', DOT_RADIUS);
    } else if (widthCont >= 960 && DOT_RADIUS === 6) {
      DOT_RADIUS = 7;
      $dots.attr('r', DOT_RADIUS);
    }

    return that;
  };

  that.isInitialized = function(){
    return initialized;
  };


  // Private Methods

  var onDataReady = function( error, prices, affordability, countries ){

    if (error) throw error;

    prices = prices.filter(function(d){ return d['Unit/MPR'] === 'MPR'; });
    prices.forEach(function(d) {
      d.Price = (d.Price === 'NO DATA') ? null : ((d.Price !== 'free') ? +d.Price : 0);
    });
    
    affordability.forEach(function(d) {
      var affordabilityPublic =  d['Public sector - number of days'];
      var affordabilityPrivate =  d['Private sector - number of days'];
      d['Public sector - number of days']  = (affordabilityPublic !== 'NO DATA' && affordabilityPublic !== '') ? +affordabilityPublic : null;
      d['Private sector - number of days'] = (affordabilityPrivate !== 'NO DATA' && affordabilityPrivate !== '') ? +affordabilityPrivate : null;
    });

    dataCountries = dataCountriesAll = countries;
    dataPricesPublic  = prices.filter(function(d){ return d['Public/Private'] === 'Public'; });
    dataPricesPrivate = prices.filter(function(d){ return d['Public/Private'] === 'Private'; });
    dataAffordability = affordability;

    reorderCountriesByArea();

    /*
    console.dir(dataCountries);
    console.dir(dataPricesPublic);
    console.dir(dataAffordability);
    */

    prices = affordability = countries = null;  // reset temp variables for garbage collector

    setData();
    setupMenuBtns();

    if (that.skip) {
      // if skip setup set last state
      that.setState( 9 );
    }
  };

  var setData = function(){

    var currentData = getCurrentData();

    $svg = d3.select('#prices-infographic-svg');

    // Set title
    $menu.find('.'+current.data+'-'+current.type).show();

    x.domain( dataCountries.map(function(d){ return d.Code; }) );
    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();
    color.domain( d3.extent(currentData, function(d) { return d.Drug; }) );

    xAxis.ticks( dataCountries.length );

    // Setup X Axis
    $xAxis = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Setup Y Axis
    $yAxis = svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    $yLabel = $yAxis.append('text')
        .attr('class', 'y-label')
        .attr('y', -15)
        .style('text-anchor', 'end')
        .text( txt[lang].dias );

    // Country Marker
    $countryMarker = svg.append('line')
      .attr('class', 'country-marker')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', 0)
      .attr('y2', 0)
      .style('opacity', 0);

    $countryLabel = svg.append('text')
      .attr('class', 'country-label')
      .attr('y', height+36)
      .style('opacity', 0);

    // MPR Line
    $mprLine = svg.append('g')
      .attr('class', 'mpr-line')
      .style('opacity', 0)
      .attr('transform', 'translate(0 ' + y(1) + ')');
    $mprLine.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0);
    $mprLine.append('text')
      .attr('x', -8)
      .attr('y', 0)
      .attr('dy', '0.32em')
      .text('MPR');

    // Mouse events overlay
    $overlay = svg.append('rect')
      .attr('class', 'overlay')
      .style('opacity', 0)
      .attr('width', width)
      .attr('height', height);

    // Setup Circles
    svg.append('g')
      .attr('class', 'dots')
    .selectAll('.dot')
      .data( currentData )
    .enter().append('circle')
      .attr('id', setId)
      .attr('class', function(d) { return 'dot'+setClass(d); })
      .attr('r', DOT_RADIUS)
      .attr('cx', setValueX)
      .attr('cy', setValueY)
      .style('visibility', setVisibility)
      .style('opacity', DOT_OPACITY)
      .style('fill', setColor);

    $dots = d3.selectAll('.dot');

    // Setup Lines
    $lines = svg.append('g')
      .attr('class', 'dot-lines');

    // Add X Axis Areas
    setXAxisArea( true );

    // Add Events
    $overlay
      .on('mouseout', onOverlayOut)
      .on('mousemove', onOverlayMove)
      .on('click', resetDotClicked);

    // Add dot events
    $dots
      .on('mouseover', onDotOver )
      .on('mouseout', onDotOut );
  };

  var updateData = function( _data, _type ){

    _data = typeof _data !== 'undefined' ? _data : false;
    _type = typeof _type !== 'undefined' ? _type : false;

    // Setup current data
    if( _data && _type ){
      if (current.data === _data && current.type === _type) {
        return that;
      } else {
        current.data = _data;
        current.type = _type;
      }
    }
    else{
      current.data = $('#mpr-btn').hasClass('active') ? 'prices' : 'affordability';
      current.type = $('#public-btn').hasClass('active') ? 'public' : 'private';
    }

    if( !initialized ){ return that; }

    current.label = (current.data === 'prices') ? 'Price' : ((current.type === 'public') ? 'Public sector - number of days' : 'Private sector - number of days');

    resetDotClicked();

    // Set title
    if( !_data || !_type ){
      $menu.find('h4').hide();
      $menu.find('.'+current.data+'-'+current.type).show();
    }

    var item,
        currentData = getCurrentData();

    if (current.data === 'prices') {
      yAxis.tickFormat(tickFormatPrices);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 0);
    } else {
      yAxis.tickFormat(tickFormatAffordability);
      d3.select('.y-label')
        .transition().duration(1000)
        .style('opacity', 1);
    }

    y.domain( d3.extent(currentData, function(d) { return d[ current.label ]; }) ).nice();

    $yAxis.transition().duration(1000).ease(d3.easeSinInOut).call(yAxis);

    if (current.data === 'prices') {
      $mprLine
        .transition().duration(1000)
        .attr('transform', 'translate(0 ' + y(1) + ')')
        .style('opacity', 1);
    } else {
      $mprLine
        .transition().duration(1000)
        .style('opacity', 0);
    }

    // Reset visibility for all dots & lines
    $dots.style('visibility', 'hidden');

    currentData.forEach(function(d){

      item = svg.select('.dot'+getClass(d));

      // Update item
      if (!item.empty()) {

        item.datum(d)
          .style('visibility', setVisibility)
          .transition().duration(1000)
          .attr('cx', setValueX)
          .attr('cy', setValueY);
      }
      // Create item
      else{

        // Setup Circles
        d3.select('.dots')
          .append('circle')
          .datum(d)
          .attr('id', setId)
          .attr('class', function(d) { return 'dot'+setClass(d); })
          .attr('r', DOT_RADIUS)
          .attr('cx', setValueX)
          .attr('cy', setValueY)
          .style('visibility', setVisibility)
          .style('opacity', DOT_OPACITY)
          .style('fill', setColor)
          .on('mouseover', onDotOver )
          .on('mouseout', onDotOut );
      }
    });

    $dots = d3.selectAll('.dot');

    return that;
  };

  var setupMenuBtns = function(){

    // MPR/Affordability Btns
    $('#mpr-btn, #affordability-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#mpr-btn, #affordability-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Public/Private Btns
    $('#public-btn, #private-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#public-btn, #private-btn').removeClass('active');
      $(this).addClass('active');
      updateData();
    });

    // Order Btns
    $('#area-btn, #pib-btn').click(function(e){
      if( $(this).hasClass('active') ){ return; }
      $('#area-btn, #pib-btn').removeClass('active');
      $(this).addClass('active');
      reorderData();
    });

    $regionDropdownInputs.change(function(e){ filterByRegion(); });

    $drugDropdownInputs.change( filterByDrug );
  };

  var reorderData = function(){

    current.order = $('#area-btn').hasClass('active') ? 'area' : 'pib';

    // Order Countries
    if (current.order === 'area') {
      reorderCountriesByArea();
    } else {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    resetDotClicked();

    // Update X Axis
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    $xArea.fadeOut();
    setTimeout( setXAxisArea, 1200 );

    var transition = svg.transition().duration(1000);
    
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');

    return that;
  };

  var reorderCountriesByArea = function(){
    dataCountries.sort(function(x, y){
      if (x.Area === y.Area){
        return d3.ascending(x['Country_'+lang], y['Country_'+lang]);
      }
      return d3.ascending(x.Area, y.Area);
    });
  };
  
  var filterByRegion = function( _regions ){

    var regions = '';

    if( _regions){

      regions = _regions;

    } else{

      $regionDropdownInputs.each(function(){
        if( $(this).is(':checked') ){
          regions += $(this).attr('name')+' ';
        }
      });

      // Select all regions if there's no one
      if (regions === '') {
        $regionDropdownInputs.each(function(){
          $(this).attr('checked',true);
          regions += $(this).attr('name')+' ';
        });
      }
    }

    // Filter Countries
    dataCountries = dataCountriesAll.filter(function(d){
      return regions.indexOf( d.Area ) > -1;
    });

    // Reorder Countries if order is PIB
    if (current.order === 'pib') {
      dataCountries.sort(function(x, y){
        return d3.ascending(+x.PIB, +y.PIB);
      });
    }

    // Update X Axis
    $xArea.fadeOut();
    setTimeout( setXAxisArea, 1200 );
    
    x.domain( dataCountries.map(function(d){ return d.Code; }) );

    $dots.style('visibility', setVisibility);
   
    resetDotClicked();

    var transition = svg.transition().duration(1000);
  
    transition.selectAll('.dot')
      .attr('cx', setValueX);

    transition.select('.x.axis')
      .call(xAxis)
      .selectAll('g');
  };

  var filterByDrug = function(){

    drugsFiltered = '';

    // Check All
    if ($(this).attr('name') === 'All') {
      if ($(this).attr('checked')) {
        $drugDropdownInputs.each(function(){
          $(this).attr('checked',true);
        });
      } else {
        $drugDropdownInputs.each(function(){
          $(this).attr('checked',false);
        });
        $drugDropdownInputs.filter('[name="Amitriptyline"]').attr('checked',true);
      }
    } else {
      // Set All Checkbox 
      if ($(this).attr('checked') && $drugDropdownInputs.filter(':checked').length === $drugDropdownInputs.length-1) {
        $drugDropdownInputs.filter('[name="All"]').attr('checked', true);
      } else {
        $drugDropdownInputs.filter('[name="All"]').attr('checked', false);
      }
    }

    $drugDropdownInputs.each(function(){
      if( $(this).is(':checked') ){
        drugsFiltered += $(this).attr('name')+' ';
      }
    });

    // Select all regions if there's no one
    if (drugsFiltered === '') {
      drugsFiltered = drugsFilteredAll;
      $drugDropdownInputs.each(function(){ $(this).attr('checked',true); });
    }

    resetDotClicked();

    $dots.style('visibility', setVisibility);
  };

  var onDotOver = function(){

    var item = d3.select(this);

    $dots.on('click', onDotClick );

    // Update dots
    $dots
      .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
      .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });

    svg.selectAll('.dot.drug-'+item.attr('id'))
      .style('fill', function(d) { return color(d.Drug); }).style('opacity', 1);

    var drugData = getCurrentData();
    drugData = drugData.filter(function(e){ return niceName(e.Drug) === item.attr('id'); });

    // Setup lines
    if (dotClicked === null) {
      $lines.selectAll('.line')
        .data( drugData )
      .enter().append('line')
        .attr('id', setId)
        .attr('class', function(d) { return 'line'+setClass(d); })
        .attr('x1', setValueX)
        .attr('y1', height)
        .attr('x2', setValueX)
        .attr('y2', setValueY)
        .style('visibility', setVisibility)
        .style('stroke', setColor);
    }
    
    // Set current tick active
    var xPos = d3.mouse(this)[0],
        w = width / (x.domain().length-1);
    var j = Math.round( xPos/w );
    $xAxis.selectAll('.tick:nth-child('+(j+2)+') text').attr('class', 'active');

    // Show country marker labels
    $countryLabel.style('opacity', 1);

    // Set selected dots on top
    $dots.sort(function (a, b) {
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    setTooltip( item );
  };

  var setTooltip = function( item ){

    item = ( tooltipItem ) ? tooltipItem : item;

    if( !item ) return;

    var data = +item.data()[0][ current.label ];
    var dataIcon = (current.data !== 'prices') ? 'glyphicon-time' : ( (data < 1) ? 'glyphicon-arrow-down' : 'glyphicon-arrow-up' );

    $tooltip.find('.country').html( getCountryData( item.data()[0].Country )[0]['Region_'+lang] );
    $tooltip.find('.year').html( '('+item.data()[0].Year+')' );
    $tooltip.find('.drug, .green .glyphicon, .green .txt').hide();
    $tooltip.find('.drug-'+item.data()[0].Drug.toLowerCase()).show();
    $tooltip.find('.green .'+dataIcon).show();

    if( data !== 0 ){
      $tooltip.find('.price').html( niceData(data) );
      $tooltip.find('.green .'+current.data+'-txt').show();
    } else {
      $tooltip.find('.price').html( 'gratis' );
    }

    if (current.data !== 'prices' && data < 1 && data !== 0) {
      var h = Math.round(data*8);
      if (h > 0) {
        $tooltip.find('.affordability-txt-hour').html( '  ('+h+' '+txt[lang].horas+')' ).show();
      } else {
        $tooltip.find('.affordability-txt-hour').html( '  ('+txt[lang].menoshora+')' ).show();
      }
    }

    var left = item.attr('cx') > width*0.5;
    var top = Math.round(item.attr('cy'));

    if( left ){
      $tooltip.addClass('left').css({'right': (widthCont-Math.round(item.attr('cx'))-margin.left)+'px', 'left': 'auto'});
    } else{
      $tooltip.removeClass('left').css({'right': 'auto', 'left': (Math.round(item.attr('cx'))+margin.left)+'px'});
    }

    if (top > 60){
      $tooltip.removeClass('top').css({'top': (top+margin.top-8-($tooltip.height()*0.5))+'px', 'opacity': '1'});
    } else {
      $tooltip.addClass('top').css({'top': (top+margin.top-18)+'px', 'opacity': '1'});
    }
  };

  var setTooltipOnTour = function(selection) {
    $tooltip.css('opacity', '0');
    tooltipItem = d3.select(selection);
    clearTimeout(timeout);
    timeout = setTimeout(setTooltip, 1200);
  };

  var onDotOut = function(){

    $dots.on('click', null );

    if (dotClicked === null) {
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

      $lines.selectAll('*').remove();
    }
    else {
      $dots
        .style('fill', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_GRAY : color(d.Drug); })
        .style('opacity', function(d){ return (d3.select(this).attr('id') !== dotClicked) ? DOT_OPACITY : 1; });
    }
  
    $tooltip.css({'opacity': '0', 'right': 'auto', 'left': '-1000px'});
  };

  var onDotClick = function(){

    var id = d3.select(this).attr('id');
    dotClicked = ( id !== dotClicked ) ? id : null;
  };

  var onOverlayMove = function(){

    var xPos = d3.mouse(this)[0],
        w = width / (x.domain().length-1);

    var j = Math.round( xPos/w );

    if( overlayCode === j ){ return that; }

    overlayCode = x.domain()[j];

    $countryMarker
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(overlayCode) +' 0)');

    var countryData = dataCountries.filter(function(d){ return d.Code === overlayCode; });

    $xAxis.selectAll('.tick text').attr('class', '');
    $xAxis.selectAll('.tick:nth-child('+(j+2)+') text').attr('class', 'active');

    $countryLabel
      .attr('x', x(overlayCode))  //-6)
      .style('opacity', 1)
      .text( countryData[0]['Country_'+lang] );
  };

  var onOverlayOut = function(){

    overlayCode = null;
    $countryMarker.style('opacity', 0);
    $countryLabel.style('opacity', 0);
    $xAxis.selectAll('.tick text').attr('class', '');
  };

  var resetDotClicked = function(){
    if (dotClicked !== null) {
      dotClicked = null;
      $lines.selectAll('*').remove();
      $dots
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }
  };

  var niceName = function( drug ) {
    return drug.toLowerCase().replace(/[ +,\/]/g,'-');
  };

  var niceData = function( data ) {
    return (lang !== 'es') ? data.toFixed(2) : data.toFixed(2).toString().replace(/\./g,',');
  };

  var setId = function(d) {
    return niceName(d.Drug);
  };

  var getClass = function(d) {
   return '.country-' + niceName(d.Country) + '.drug-' + niceName(d.Drug);
  };

  var setClass = function(d) {
   return ' country-' + niceName(d.Country) + ' drug-' + niceName(d.Drug);
  };

  var setValueX = function(d) {
    var countryData = getCountryData(d.Country);
    return ( countryData.length > 0 ) ? x(countryData[0].Code) : 0;
  };

  var setValueY = function(d) {
    return (d[ current.label ] !== null) ? y(d[ current.label ]) : height;
  };

  var setVisibility = function(d) {
    return (d[ current.label ] !== null && drugsFiltered.indexOf( d.Drug ) > -1 && dataCountries.some(function(e){ return e.Region_en === d.Country; }) ) ? 'visible' : 'hidden';
  };

  var setColor = function(d) {
    return color(d.Drug);
  };

  var getCurrentData = function() {
    return (current.data === 'affordability') ? dataAffordability : ((current.type === 'public') ? dataPricesPublic : dataPricesPrivate);
  };

  var getCountryData = function( region ) {
    return dataCountries.filter(function(e){ return e.Region_en === region; });
  };

  var getCountryDataByCode = function( code ) {
    return dataCountries.filter(function(e){ return e.Code === code; });
  };

  var setXAxisArea = function( init ){
    
    var temp = null, c = null, xpos = 0, label, $item;

    if( init ){
      $xArea = $('<ul class="x-area"></ul>');
      $el.append( $xArea );
    } else {
      $xArea.find('li').remove();
      $xArea.fadeIn();
    }
    
    label = (current.order === 'area') ? 'Area' : 'PIB_Area';
    
    d3.selectAll('.x.axis .tick text').each(function(d){
      c = getCountryDataByCode( d );
      if (c[0] && temp !== c[0][label]) {
        temp = c[0][label];
        $xArea.find('li').last().css('width', (100*(x(c[0].Code)-xpos)/width)+'%' );
        xpos = x(c[0].Code);
        $item = $('<li>'+txt[lang][temp]+'</li>');
        $xArea.append( $item );
      }
    });
    
    $xArea.find('li').last().css('width', (100*(x(c[0].Code)-xpos)/width)+'%' );
  };

  var setDimensions = function() {
    widthCont = $el.width();
    heightCont = $el.height();
    width = widthCont - margin.left - margin.right;
    height = heightCont - margin.top - margin.bottom;
  };

  var setDotsColor = function() {
    if ($dots) {
      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }
  };

  return that;
}

// Main script for access articles

(function($) {

  $('[data-toggle="tooltip"]').tooltip(); // Init Tooltips
  $('.dropdown-toggle').dropdown();       // Init Dropdown
  $('#region-dropdown-menu, #drug-dropdown-menu').click(function(e){ e.stopPropagation(); });

  // Prices graph
  if ($('#prices-infographic').length > 0) {
    var prices_infographic = new Infographic('#prices-infographic', 'prices');
    $(window).scroll( prices_infographic.onScroll );
    $(window).resize( prices_infographic.onResize );
  }
  // Counterfaits infographic
  else if ($('#counterfeits-infographic').length > 0) {
    var fakes_infographic = new Infographic('#counterfeits-infographic', 'fakes');
    $(window).scroll( fakes_infographic.onScroll );
    $(window).resize( fakes_infographic.onResize );
  }
  // Patent graph
  else if ($('#patents-graph').length > 0) {
    var graph_patents = patents_graph('#patents-graph').init();
    $(window).resize( graph_patents.onResize );
  }
  // Patents infographic
  else if ($('#patents-infographic').length > 0) {
    var patentes_infographic = new Infographic('#patents-infographic', 'patentes');
    var antimalaricos_infographic = new Infographic('#antimalaricos-infographic', 'antimalaricos');
    $(window).scroll( function(e){
      patentes_infographic.onScroll();
      antimalaricos_infographic.onScroll();
    });
    $(window).resize( function(){
      patentes_infographic.onResize();
      antimalaricos_infographic.onResize();
    });
  }

})(jQuery); // Fully reference jQuery after this point.

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhdGVudHMtZ3JhcGguanMiLCJpbmZvZ3JhcGhpYy5qcyIsImFudGltYWxhcmljb3MtaW5mb2dyYXBoaWMuanMiLCJmYWtlcy1pbmZvZ3JhcGhpYy5qcyIsInBhdGVudHMtaW5mb2dyYXBoaWMuanMiLCJwcmljZXMtaW5mb2dyYXBoaWMuanMiLCJtYWluLWFjY2Vzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Z0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWNjZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gcGF0ZW50c19ncmFwaCggX2lkICkge1xuXG4gIHZhciAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgdmFyIGlkID0gX2lkO1xuICB2YXIgJGVsID0gJChpZCk7XG4gIHZhciBsYW5nID0gJGVsLmRhdGEoJ2xhbmcnKTtcbiAgdmFyIHR4dCA9IHtcbiAgICAnZXMnOiAnU2UgYXBydWViYSBsYSBsaWNlbmNpYSBvYmxpZ2F0b3JpYScsXG4gICAgJ2VuJzogJ0NvbXB1bHNvcnkgbGljZW5zZSBpcyBhcHByb3ZlZCdcbiAgfTtcbiAgdmFyIG1hcmtlclZhbHVlID0gMjAwNztcblxuICB2YXIgbWFyZ2luID0ge3RvcDogMjAsIHJpZ2h0OiAwLCBib3R0b206IDIwLCBsZWZ0OiAwfSxcbiAgICAgIHdpZHRoQ29udCA9IDExNDAsXG4gICAgICBoZWlnaHRDb250ID0gNTAwLFxuICAgICAgd2lkdGgsIGhlaWdodDtcblxuICB2YXIgc3ZnLFxuICAgICAgeCwgeSxcbiAgICAgIHhBeGlzLFxuICAgICAgbGluZTtcblxuXG4gIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgdGhhdC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKCdpbml0IHBhdGVudHMgZ3JhcGgnKTtcblxuICAgIHdpZHRoQ29udCA9ICRlbC53aWR0aCgpO1xuICAgIGhlaWdodENvbnQgPSB3aWR0aENvbnQqMC41NjI1O1xuXG4gICAgd2lkdGggPSB3aWR0aENvbnQgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgICBoZWlnaHQgPSBoZWlnaHRDb250IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICB4ID0gZDMuc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZShbMCwgd2lkdGhdKVxuICAgICAgLnJvdW5kKHRydWUpXG4gICAgICAucGFkZGluZ0lubmVyKDAuMSlcbiAgICAgIC5wYWRkaW5nT3V0ZXIoMCk7XG5cbiAgICB5ID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgLnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuICAgIHhBeGlzID0gZDMuYXhpc0JvdHRvbSgpXG4gICAgICAuc2NhbGUoeCk7XG5cbiAgICBsaW5lID0gZDMubGluZSgpXG4gICAgICAueChmdW5jdGlvbihkKSB7IHJldHVybiB4KGQuZGF0ZSk7IH0pXG4gICAgICAueShmdW5jdGlvbihkKSB7IHJldHVybiB5KGQucGF0ZW50cyk7IH0pO1xuXG4gICAgc3ZnID0gZDMuc2VsZWN0KGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignaWQnLCAncGF0ZW50cy1ncmFwaC1zdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGhDb250KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodENvbnQpXG4gICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknKTtcblxuICAgIC8vIExvYWQgQ1NWXG4gICAgZDMuY3N2KCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvYXNzZXRzL2RhdGEvcGF0ZW50cy5jc3YnLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICBkLnBhdGVudHMgPSArZC5wYXRlbnRzO1xuICAgICAgfSk7XG5cbiAgICAgIHguZG9tYWluKGRhdGEubWFwKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZGF0ZTsgfSkpO1xuICAgICAgeS5kb21haW4oWzAsIGQzLm1heChkYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnBhdGVudHM7IH0pXSk7XG5cbiAgICAgIHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgaGVpZ2h0ICsgJyknKVxuICAgICAgICAuY2FsbChkMy5heGlzQm90dG9tKHgpKTtcblxuICAgICAgc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXJrZXInKVxuICAgICAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgobWFya2VyVmFsdWUpOyB9KVxuICAgICAgICAuYXR0cihcInkxXCIsIGhlaWdodClcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB4KG1hcmtlclZhbHVlKTsgfSlcbiAgICAgICAgLmF0dHIoXCJ5MlwiLCBoZWlnaHQpO1xuXG4gICAgICBzdmcuYXBwZW5kKCdnJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ21hcmtlci1sYWJlbCcpXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgobWFya2VyVmFsdWUpOyB9KVxuICAgICAgICAudGV4dCggdHh0W2xhbmddICk7XG5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAuZGF0YShkYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCkgeyByZXR1cm4geChkLmRhdGUpOyB9KVxuICAgICAgICAuYXR0cigneScsIGhlaWdodCApXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAwKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB4LmJhbmR3aWR0aCgpKTtcblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnLmJhci1sYWJlbCcpXG4gICAgICAgIC5kYXRhKGRhdGEpXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYmFyLWxhYmVsJylcbiAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7IHJldHVybiB4KGQuZGF0ZSkrKHguYmFuZHdpZHRoKCkqMC41KTsgfSlcbiAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7IHJldHVybiB5KGQucGF0ZW50cyk7IH0pXG4gICAgICAgIC5hdHRyKCdkeScsICcxLjVlbScpXG4gICAgICAgIC50ZXh0KCBmdW5jdGlvbihkKXsgcmV0dXJuIGQucGF0ZW50czsgfSk7XG5cbiAgICAgICBkMy5zZWxlY3RBbGwoJy5iYXInKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDgwMCkuZGVsYXkoIGZ1bmN0aW9uKGQsaSl7IHJldHVybiAxMDAqaTsgfSlcbiAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7IHJldHVybiB5KGQucGF0ZW50cyk7IH0pXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbihkKSB7IHJldHVybiBoZWlnaHQgLSB5KGQucGF0ZW50cyk7IH0pO1xuXG4gICAgICAgZDMuc2VsZWN0KCcubWFya2VyJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig2MDApLmRlbGF5KDE1MDApXG4gICAgICAgIC5hdHRyKCd5MScsIDAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHRoYXQub25SZXNpemUgPSBmdW5jdGlvbigpIHtcblxuICAgIHdpZHRoQ29udCA9ICRlbC53aWR0aCgpO1xuICAgIGhlaWdodENvbnQgPSB3aWR0aENvbnQqMC41NjI1O1xuXG4gICAgd2lkdGggPSB3aWR0aENvbnQgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgICBoZWlnaHQgPSBoZWlnaHRDb250IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICB1cGRhdGVEYXRhKCk7XG5cbiAgICByZXR1cm4gdGhhdDtcbiAgfTtcblxuICB2YXIgdXBkYXRlRGF0YSA9IGZ1bmN0aW9uKCl7XG5cbiAgICBkMy5zZWxlY3QoJyNwYXRlbnRzLWdyYXBoLXN2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCB3aWR0aENvbnQpXG4gICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0Q29udCk7XG5cbiAgICB4LnJhbmdlKFswLCB3aWR0aF0pO1xuICAgIHkucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG4gICAgZDMuc2VsZWN0KCdnLnguYXhpcycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCcgKyBoZWlnaHQgKyAnKScpXG4gICAgICAuY2FsbChkMy5heGlzQm90dG9tKHgpKTtcblxuICAgIGQzLnNlbGVjdCgnLm1hcmtlci1sYWJlbCB0ZXh0JykuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgobWFya2VyVmFsdWUpOyB9KTtcblxuICAgIGQzLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAuYXR0cigneCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHgoZC5kYXRlKTsgfSlcbiAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZCkgeyByZXR1cm4geShkLnBhdGVudHMpOyB9KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgeC5iYW5kd2lkdGgoKSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbihkKSB7IHJldHVybiBoZWlnaHQgLSB5KGQucGF0ZW50cyk7IH0pO1xuXG4gICAgZDMuc2VsZWN0QWxsKCcuYmFyLWxhYmVsJylcbiAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCkgeyByZXR1cm4geChkLmRhdGUpKyh4LmJhbmR3aWR0aCgpKjAuNSk7IH0pXG4gICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHkoZC5wYXRlbnRzKTsgfSk7XG5cbiAgICBkMy5zZWxlY3QoJy5tYXJrZXInKVxuICAgICAgLmF0dHIoXCJ4MVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB4KG1hcmtlclZhbHVlKTsgfSlcbiAgICAgIC5hdHRyKFwieDJcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4geChtYXJrZXJWYWx1ZSk7IH0pXG4gICAgICAuYXR0cigneTInLCBoZWlnaHQgKTtcbiAgfTtcblxuICByZXR1cm4gdGhhdDtcbn1cbiIsInZhciBJbmZvZ3JhcGhpYyA9IGZ1bmN0aW9uKCBfaWQsIF90eXBlICkge1xuXG4gIHZhciAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgdmFyIGlkID0gX2lkO1xuICB2YXIgdHlwZSA9IF90eXBlO1xuXG4gIHZhciB2aXMsXG4gICAgICBzY3JvbGxUb3AsXG4gICAgICBlbmRQb3NpdGlvbixcbiAgICAgIGN1cnJlbnRJdGVtID0gLTEsXG4gICAgICAkbmF2SXRlbXMsXG4gICAgICAkZWwsICRmaXhlZEVsLCAkY29udGVudExpc3Q7XG5cblxuICAvLyBQcml2YXRlIE1ldGhvZHNcblxuICB2YXIgc2V0SWZyYW1lQnRucyA9IGZ1bmN0aW9uKCl7XG4gICAgJGNvbnRlbnRMaXN0LmVhY2goZnVuY3Rpb24oaSl7XG4gICAgICAkKHRoaXMpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImJ0bi1uZXh0XCI+PGEgaHJlZj1cIiMnKyhpKzIpKydcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIj5TaWd1aWVudGUgPGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tcmlnaHRcIj48L2k+PC9hPjwvZGl2PicpO1xuICAgIH0pO1xuICAgICRjb250ZW50TGlzdC5maW5kKCcuYnRuLW5leHQgYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6ICQoJy5pbmZvZ3JhcGhpYy1mcmFtZSBsaS5mcmFtZS0nKyQodGhpcykuYXR0cignaHJlZicpLnN1YnN0cmluZygxKSkub2Zmc2V0KCkudG9wICsgMlxuICAgICAgfSwgJzIwMCcpO1xuICAgIH0pO1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuaW5mb2dyYXBoaWMtZnJhbWUgbGkuZnJhbWUtMScpLm9mZnNldCgpLnRvcCArIDJ9LCAnMjAwJyk7XG4gIH07XG5cbiAgLy8gR2V0IHVybCBwYXJhbXNcbiAgdmFyIHVybFBhcmFtID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgUmVnRXhwKCdbXFw/Jl0nICsgbmFtZSArICc9KFteJiNdKiknKS5leGVjKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICBpZiAocmVzdWx0cz09bnVsbCl7XG4gICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgcmV0dXJuIHJlc3VsdHNbMV0gfHwgMDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUHVibGljIE1ldGhvZHNcblxuICB0aGF0LmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgLy9jb25zb2xlLmxvZygnaW5mb2dyYXBoaWMnLCBpZCwgdHlwZSk7XG5cbiAgICAkZWwgPSAkKCBpZCApO1xuICAgICRjb250ZW50TGlzdCA9ICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtY29udGVudCBsaScpO1xuICAgICRuYXZJdGVtcyA9ICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtbmF2IGxpJyk7XG5cbiAgICAvLyBTZXR1cCBmb3IgcHJpY2VzIGluZm9ncmFwaGljXG4gICAgaWYoIHR5cGUgPT09ICdwcmljZXMnKXtcbiAgICAgIC8vIEFkZCBleHRyYSBmcmFtZSBpdGVtcyBmb3IgUHJpY2VzIEluZm9ncmFwaGljXG4gICAgICAkZWwuZmluZCgnLmluZm9ncmFwaGljLWZyYW1lJylcbiAgICAgICAgLmFwcGVuZCgnPGxpIGNsYXNzPVwiZnJhbWUtJysoJG5hdkl0ZW1zLmxlbmd0aCsxKSsnXCI+PGRpdiBjbGFzcz1cInNjcm9sbGVyXCI+PC9kaXY+PC9saT4nKVxuICAgICAgICAuYXBwZW5kKCc8bGkgY2xhc3M9XCJmcmFtZS0nKygkbmF2SXRlbXMubGVuZ3RoKzIpKydcIj48ZGl2IGNsYXNzPVwic2Nyb2xsZXJcIj48L2Rpdj48L2xpPicpO1xuICAgICAgLy8gQWRkIGV4dHJhIG5hdiBpdGVtIGZvciBQcmljZXMgSW5mb2dyYXBoaWMgaW4gaWZyYW1lIG1vZGVcbiAgICAgIGlmKCAkZWwuaGFzQ2xhc3MoJ2lmcmFtZScpICl7XG4gICAgICAgICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtbmF2JykuYXBwZW5kKCc8bGk+PGEgaHJlZj1cIiMnKygkbmF2SXRlbXMubGVuZ3RoKzEpKydcIj48L2E+PC9saT4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZml4ZWRFbCA9ICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtY29udGVudCwgLmluZm9ncmFwaGljLW5hdiwgLmluZm9ncmFwaGljLWdyYXBoJyk7XG5cbiAgICAvLyBTZXR1cCBJbmZvZ3JhcGhpYyBieSBUeXBlXG4gICAgaWYoIHR5cGUgPT09ICdhbnRpbWFsYXJpY29zJyl7XG4gICAgICB2aXMgPSBuZXcgQW50aW1hbGFyaWNvc19JbmZvZ3JhcGhpYyggaWQrJyAuaW5mb2dyYXBoaWMtZ3JhcGgnICkuaW5pdCgpO1xuICAgIH1cbiAgICBlbHNlIGlmKCB0eXBlID09PSAnZmFrZXMnKXtcbiAgICAgIHZpcyA9IG5ldyBGYWtlc19JbmZvZ3JhcGhpYyggaWQrJyAuaW5mb2dyYXBoaWMtZ3JhcGgnICkuaW5pdCgpO1xuICAgIH1cbiAgICBlbHNlIGlmKCB0eXBlID09PSAncGF0ZW50ZXMnKXtcbiAgICAgIHZpcyA9IG5ldyBQYXRlbnRzX0luZm9ncmFwaGljKCBpZCsnIC5pbmZvZ3JhcGhpYy1ncmFwaCcgKS5pbml0KCk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGUgPT09ICdwcmljZXMnKXtcbiAgICAgIHZpcyA9IG5ldyBQcmljZXNfSW5mb2dyYXBoaWMoIGlkKycgLmluZm9ncmFwaGljLWdyYXBoJyApO1xuICAgIH1cblxuICAgIHRoYXQub25SZXNpemUoKTtcblxuICAgIGlmKCB0eXBlID09PSAncHJpY2VzJyl7XG4gICAgICB2aXMuaW5pdCggdXJsUGFyYW0oJ3NraXAnKSA9PT0gJ3RydWUnICk7ICAvLyBTZXR1cCBza2lwIHZhbHVlIHRvIHByaWNlcyBJbmZvZ3JhcGhpY1xuICAgICAgaWYoICRlbC5oYXNDbGFzcygnaWZyYW1lJykgKXtcbiAgICAgICAgaWYoIHZpcy5za2lwICl7XG4gICAgICAgICAgJCgnI3ByaWNlcy1pbmZvZ3JhcGhpYyAuaW5mb2dyYXBoaWMtZnJhbWUnKS5oaWRlKCk7XG4gICAgICAgICAgJCgnI3ByaWNlcy1pbmZvZ3JhcGhpYy1tZW51JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtbmF2LCAuaW5mb2dyYXBoaWMtY29udGVudCcpLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgICAgICAkY29udGVudExpc3Qubm90KCcuYWN0aXZlJykuY3NzKCd0b3AnLCAnLTQwcHgnKTtcbiAgICAgICAgICAkY29udGVudExpc3QuZmlsdGVyKCcuYWN0aXZlJykuY3NzKCd0b3AnLCAnNDBweCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHNldElmcmFtZUJ0bnMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAkY29udGVudExpc3QuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7ICAgIC8vIFNldHVwIGZpcnMgY29udGVudCBpdGVtIGFzIGFjdGl2ZVxuXG4gICAgLy8gTmF2IEJ1dHRvbnMgQ2xpY2sgSW50ZXJhY3Rpb25cbiAgICAkbmF2SXRlbXMuZmluZCgnYScpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6ICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtZnJhbWUgbGkuZnJhbWUtJyskKHRoaXMpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSkpLm9mZnNldCgpLnRvcCArIDJcbiAgICAgIH0sICcyMDAnKTtcbiAgICB9KTtcbiAgfTtcblxuXG4gIHRoYXQub25TY3JvbGwgPSBmdW5jdGlvbihlKSB7XG5cbiAgICBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoIHNjcm9sbFRvcCA+PSAkZWwub2Zmc2V0KCkudG9wICYmIHNjcm9sbFRvcCA8IGVuZFBvc2l0aW9uICkge1xuICAgICAgJGZpeGVkRWwuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICBpZiggdHlwZSA9PT0gJ3ByaWNlcycpeyAkKCcjcHJpY2VzLWluZm9ncmFwaGljLXRvb2x0aXAnKS5hZGRDbGFzcygnZml4ZWQnKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkZml4ZWRFbC5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgIGlmKCB0eXBlID09PSAncHJpY2VzJyl7ICQoJyNwcmljZXMtaW5mb2dyYXBoaWMtdG9vbHRpcCcpLnJlbW92ZUNsYXNzKCdmaXhlZCcpOyB9XG4gICAgfVxuXG4gICAgaWYgKCBzY3JvbGxUb3AgPj0gZW5kUG9zaXRpb24gKSB7XG4gICAgICAkZml4ZWRFbC5hZGRDbGFzcygnYm90dG9tJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJGZpeGVkRWwucmVtb3ZlQ2xhc3MoJ2JvdHRvbScpO1xuICAgIH1cblxuICAgIHZhciBsYXN0SXRlbSA9IGN1cnJlbnRJdGVtLFxuICAgICAgICB0ZW1wID0gTWF0aC5mbG9vcigoc2Nyb2xsVG9wLSRlbC5vZmZzZXQoKS50b3ApIC8gJCh3aW5kb3cpLmhlaWdodCgpKTtcblxuICAgIGlmIChjdXJyZW50SXRlbSAhPT0gdGVtcCkge1xuXG4gICAgICBjdXJyZW50SXRlbSA9IHRlbXA7XG5cbiAgICAgIGlmIChjdXJyZW50SXRlbSA+PSAwKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygnc3RhdGUnLCB0eXBlLCBjdXJyZW50SXRlbSwgJGNvbnRlbnRMaXN0Lmxlbmd0aCApO1xuXG4gICAgICAgIC8vIFNob3cvaGlkZSBwcmljZXMgSW5mb2dyYXBoaWMgTWVudVxuICAgICAgICBpZiAodHlwZSA9PT0gJ3ByaWNlcycpIHtcbiAgICAgICAgICBpZiAoY3VycmVudEl0ZW0gIT09ICRjb250ZW50TGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICQoJyNwcmljZXMtaW5mb2dyYXBoaWMtbWVudScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICRlbC5maW5kKCcuaW5mb2dyYXBoaWMtbmF2LCAuaW5mb2dyYXBoaWMtY29udGVudCcpLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKCcjcHJpY2VzLWluZm9ncmFwaGljLW1lbnUnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkZWwuZmluZCgnLmluZm9ncmFwaGljLW5hdiwgLmluZm9ncmFwaGljLWNvbnRlbnQnKS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmlzLnNldFN0YXRlKCBjdXJyZW50SXRlbSApO1xuXG4gICAgICAgIGlmKCBsYXN0SXRlbSA8IGN1cnJlbnRJdGVtICl7XG4gICAgICAgICAgJGNvbnRlbnRMaXN0Lm5vdCgnLmFjdGl2ZScpLmNzcygndG9wJywgJzQwcHgnKTtcbiAgICAgICAgICAkY29udGVudExpc3QuZmlsdGVyKCcuYWN0aXZlJykuY3NzKCd0b3AnLCAnLTQwcHgnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAkY29udGVudExpc3Qubm90KCcuYWN0aXZlJykuY3NzKCd0b3AnLCAnLTQwcHgnKTtcbiAgICAgICAgICAkY29udGVudExpc3QuZmlsdGVyKCcuYWN0aXZlJykuY3NzKCd0b3AnLCAnNDBweCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRjb250ZW50TGlzdC5lcShjdXJyZW50SXRlbSkuY3NzKCd0b3AnLCAnMHB4JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICRuYXZJdGVtcy5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICRuYXZJdGVtcy5lcShjdXJyZW50SXRlbSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aGF0Lm9uUmVzaXplID0gZnVuY3Rpb24oKSB7XG5cbiAgICAkZWwuZmluZCgnLmluZm9ncmFwaGljLWNvbnRlbnQsIC5pbmZvZ3JhcGhpYy1uYXYsIC5pbmZvZ3JhcGhpYy1mcmFtZSBsaScpLmhlaWdodCggJCh3aW5kb3cpLmhlaWdodCgpICk7XG4gICAgJGVsLmZpbmQoJy5pbmZvZ3JhcGhpYy1ncmFwaCcpLmhlaWdodCggJCh3aW5kb3cpLmhlaWdodCgpIC0gJCgnLmluZm9ncmFwaGljLWdyYXBoJykucG9zaXRpb24oKS50b3AgLSAzMCApO1xuXG4gICAgZW5kUG9zaXRpb24gPSAkZWwub2Zmc2V0KCkudG9wICsgJGVsLmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXG4gICAgLy9pZiAoJCh3aW5kb3cpLndpZHRoKCkgPD0gOTkyKSB7XG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgODYwKSB7XG4gICAgICAkZWwuZmluZCgnLmluZm9ncmFwaGljLWNvbnRlbnQnKS5jc3MoJ2hlaWdodCcsJ2F1dG8nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ3ByaWNlcycgJiYgdmlzLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdmlzLnJlc2l6ZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBJbml0XG4gIHRoYXQuaW5pdCgpO1xufTsiLCJ2YXIgQW50aW1hbGFyaWNvc19JbmZvZ3JhcGhpYyA9IGZ1bmN0aW9uKCBfaWQgKSB7XG5cbiAgdmFyICQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGlkID0gX2lkO1xuICB2YXIgc3ZnO1xuXG5cbiAgLy8gUHVibGljIE1ldGhvZHNcblxuICB0aGF0LmluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIC8vIExvYWQgZXh0ZXJuYWwgU1ZHXG4gICAgZDMueG1sKCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvYXNzZXRzL2ltYWdlcy9zdmcvYW50aW1hbGFyaWNvcy5zdmcnICkubWltZVR5cGUoJ2ltYWdlL3N2Zyt4bWwnKS5nZXQoIGZ1bmN0aW9uKHhtbCkge1xuXG4gICAgICAkKGlkKS5hcHBlbmQoIHhtbC5kb2N1bWVudEVsZW1lbnQgKTsgIC8vIEFwcGVuZCBleHRlcm5hbCBTVkcgdG8gQ29udGFpbmVyXG5cbiAgICAgIHN2ZyA9IGQzLnNlbGVjdChpZCkuc2VsZWN0KCdzdmcnKTsgICAgLy8gR2V0IFNWRyBFbGVtZW50XG5cbiAgICAgIC8vIEluaXRpYWwgU2V0dXA6IGFsbCBncnVwcyBoaWRkZW5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNCdWJibGUxLCAjQnViYmxlMiwgI0J1YmJsZTMsICNCcmFzaWwsICNCb2xpdmlhLCAjVmVuZXp1ZWxhLCAjV29ybGQsICNJbmRpYSwgI1BhdGhJbmRpYSwgI0dpbmVicmEnKS5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgc3ZnLnNlbGVjdCgnI01hcmtlcnMnKS5zZWxlY3RBbGwoJ2ltYWdlJykuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICAgIHN2Zy5zZWxlY3QoJyNNYXJrZXJzSW5kaWEnKS5zZWxlY3RBbGwoJ2ltYWdlJykuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHRoYXQuc2V0U3RhdGUgPSBmdW5jdGlvbihzdGF0ZUlEKSB7XG5cbiAgICBpZiggc3RhdGVJRCA9PT0gMCApe1xuXG4gICAgICBidWJibGVPdXQoJyNCdWJibGUyJyk7XG5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNCcmFzaWwnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuXG4gICAgICBidWJibGVJbignI0J1YmJsZTEnKTtcbiAgICB9XG4gICAgZWxzZSBpZiggc3RhdGVJRCA9PT0gMSApe1xuXG4gICAgICBidWJibGVPdXQoJyNCdWJibGUxJyk7XG4gICAgICBtYXJrZXJzT3V0KCcjTWFya2VycycpO1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjQnJhc2lsLCAjQm9saXZpYSwgI1ZlbmV6dWVsYScpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcblxuICAgICAgYnViYmxlSW4oJyNCdWJibGUyJyk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHN0YXRlSUQgPT09IDIgKXtcblxuICAgICAgYnViYmxlT3V0KCcjQnViYmxlMicpO1xuICAgICAgbWFya2Vyc091dCgnI01hcmtlcnMnKTtcbiAgICAgIG1hcmtlcnNPdXQoJyNNYXJrZXJzSW5kaWEnKTtcblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnI0JyYXNpbCwgI0JvbGl2aWEsICNWZW5lenVlbGEsICNXb3JsZCwgI0luZGlhLCAjUGF0aEluZGlhJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjQ29udGluZW50LCAjQnJhc2lsLCAjQm9saXZpYSwgI1ZlbmV6dWVsYScpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5kZWxheSggZnVuY3Rpb24oZCxpKXsgcmV0dXJuIDMwMCppOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgICAgbWFya2Vyc0luKCcjTWFya2VycycsIDIwMCwgMzAwKTtcbiAgICB9XG4gICAgZWxzZSBpZiggc3RhdGVJRCA9PT0gMyApe1xuXG4gICAgICBidWJibGVPdXQoJyNCdWJibGUzJyk7XG4gICAgICBtYXJrZXJzT3V0KCcjTWFya2VycycpO1xuICAgICAgbWFya2Vyc091dCgnI01hcmtlcnNJbmRpYScpO1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjQ29udGluZW50LCAjQnJhc2lsLCAjQm9saXZpYSwgI1ZlbmV6dWVsYSwgI0dpbmVicmEnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoJyNXb3JsZCcpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTAwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoJyNJbmRpYScpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5kZWxheSgyMDAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgICAgbWFya2Vyc0luKCcjTWFya2Vyc0luZGlhJywgNjAwLCA5MDApO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjUGF0aEluZGlhJylcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoJyNQYXRoSW5kaWEnKS5zZWxlY3QoJyNTVkdJRF9hbnRpbWFsYXJpY29zXzFfJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICdzY2FsZSgwIDEpJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxNTAwKS5kZWxheSg4MDApXG4gICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAnc2NhbGUoMSAxKScpO1xuICAgIH1cbiAgICBlbHNlIGlmKCBzdGF0ZUlEID09PSA0ICl7XG5cbiAgICAgIG1hcmtlcnNPdXQoJyNNYXJrZXJzSW5kaWEnKTtcblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnI0luZGlhLCAjUGF0aEluZGlhJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjR2luZWJyYScpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgICAgYnViYmxlSW4oJyNCdWJibGUzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoYXQ7XG4gIH07XG5cblxuICAvLyBQcml2YXRlIE1ldGhvZHNcblxuICB2YXIgYnViYmxlSW4gPSBmdW5jdGlvbiggaWQgKXtcblxuICAgIHZhciBjZW50ZXIgPSBzdmcuc2VsZWN0KGlkKS5ub2RlKCkuZ2V0QkJveCgpO1xuXG4gICAgc3ZnLnNlbGVjdChpZClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAnKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKSBzY2FsZSgwLjgpIHRyYW5zbGF0ZSgtJysoY2VudGVyLngrKGNlbnRlci53aWR0aCowLjUpKSsnIC0nKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKScpXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMCkuZGVsYXkoMzAwKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCAwKSBzY2FsZSgxKScpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfTtcblxuICB2YXIgYnViYmxlT3V0ID0gZnVuY3Rpb24oIGlkICl7XG5cbiAgICB2YXIgY2VudGVyID0gc3ZnLnNlbGVjdChpZCkubm9kZSgpLmdldEJCb3goKTtcblxuICAgIHN2Zy5zZWxlY3QoaWQpXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAnKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKSBzY2FsZSgwLjgpIHRyYW5zbGF0ZSgtJysoY2VudGVyLngrKGNlbnRlci53aWR0aCowLjUpKSsnIC0nKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKScpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICB2YXIgbWFya2Vyc0luID0gZnVuY3Rpb24oIGlkLCBvZmZzZXQsIGRlbGF5ICl7XG5cbiAgICBzdmcuc2VsZWN0KGlkKS5zZWxlY3RBbGwoJ2ltYWdlJylcbiAgICAgIC8vLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCAtMTApJylcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5kZWxheSggZnVuY3Rpb24oZCxpKXsgcmV0dXJuIG9mZnNldCsoZGVsYXkqaSk7IH0pXG4gICAgICAvLy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAgMCknKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgdmFyIG1hcmtlcnNPdXQgPSBmdW5jdGlvbiggaWQgKXtcbiAgXG4gICAgc3ZnLnNlbGVjdChpZCkuc2VsZWN0QWxsKCdpbWFnZScpXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgIC8vLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCAtMTApJylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9O1xuXG5cbiAgcmV0dXJuIHRoYXQ7XG59O1xuIiwidmFyIEZha2VzX0luZm9ncmFwaGljID0gZnVuY3Rpb24oIF9pZCApIHtcblxuICB2YXIgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KCk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgaWQgPSBfaWQ7XG4gIHZhciBzdmc7XG4gIHZhciBsYXN0U3RhdGUgPSAtMTtcblxuXG4gIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgdGhhdC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBMb2FkIGV4dGVybmFsIFNWR1xuICAgIGQzLnhtbCggJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSsnL2Fzc2V0cy9pbWFnZXMvc3ZnL2Zha2VzLnN2ZycgKS5taW1lVHlwZSgnaW1hZ2Uvc3ZnK3htbCcpLmdldCggZnVuY3Rpb24oeG1sKSB7XG5cbiAgICAgICQoaWQpLmFwcGVuZCggeG1sLmRvY3VtZW50RWxlbWVudCApOyAgLy8gQXBwZW5kIGV4dGVybmFsIFNWRyB0byBDb250YWluZXJcblxuICAgICAgc3ZnID0gZDMuc2VsZWN0KGlkKS5zZWxlY3QoJ3N2ZycpOyAgICAvLyBHZXQgU1ZHIEVsZW1lbnRcblxuICAgICAgLy8gSW5pdGlhbCBTZXR1cDogYWxsIGdydXBzIGhpZGRlblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnI0NvbnRpbmVudHMsICNQYXRoLCAjTG9tZUxhYmVsLCAjTG9tZU1hcmtlciwgI011bWJhaUxhYmVsLCAjTXVtYmFpTWFya2VyLCAjSW5kaWFNYXJrZXIsICNJbmRpYUxhYmVsJykuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICAgIHN2Zy5zZWxlY3QoJyNBZnJpY2FuQ291bnRyaWVzJykuc2VsZWN0QWxsKCdwYXRoJykuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHRoYXQuc2V0U3RhdGUgPSBmdW5jdGlvbihzdGF0ZUlEKSB7XG5cbiAgICBpZiggc3RhdGVJRCA9PT0gMCApe1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjUGF0aCwgI011bWJhaU1hcmtlciwgI011bWJhaUxhYmVsLCAjTG9tZU1hcmtlciwgI0xvbWVMYWJlbCcpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcblxuICAgICAgaWYoIGxhc3RTdGF0ZSA9PT0gMSApe1xuICAgICAgICBmYWRlT3V0UGF0aCgnI0NvbnRpbmVudHMnLCA0MDApO1xuICAgICAgICBmYWRlSW5QYXRoKCcjSW5kaWEnLCA2MDApO1xuICAgICAgfVxuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjSW5kaWFNYXJrZXIsICNJbmRpYUxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApLmRlbGF5KGZ1bmN0aW9uKGQsaSl7IHJldHVybiA0MDArKDMwMCppKTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHN0YXRlSUQgPT09IDEgKXtcblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnI0luZGlhTWFya2VyLCAjSW5kaWFMYWJlbCcpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMjAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcblxuICAgICAgc3ZnLnNlbGVjdCgnI0FmcmljYW5Db3VudHJpZXMnKS5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDIwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG5cbiAgICAgIGZhZGVPdXRQYXRoKCcjSW5kaWEnLCA0MDApO1xuXG4gICAgICBpZiggbGFzdFN0YXRlID09PSAwICl7XG4gICAgICAgIGZhZGVJblBhdGgoJyNDb250aW5lbnRzJywgNjAwKTtcbiAgICAgIH1cblxuICAgICAgc3ZnLnNlbGVjdEFsbCgnI011bWJhaU1hcmtlciwgI011bWJhaUxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApLmRlbGF5KGZ1bmN0aW9uKGQsaSl7IHJldHVybiA1MDArKDMwMCppKTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNMb21lTWFya2VyLCAjTG9tZUxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApLmRlbGF5KGZ1bmN0aW9uKGQsaSl7IHJldHVybiAxODAwKygzMDAqaSk7IH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjUGF0aCcpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuXG4gICAgICB2YXIgdyA9IHN2Zy5zZWxlY3QoJyNQYXRoJykuc2VsZWN0KCcjU1ZHSURfMV8nKS5hdHRyKCd3aWR0aCcpO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjUGF0aCcpLnNlbGVjdCgnI1NWR0lEXzFfJylcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyt3KycgMCknKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDE1MDApLmRlbGF5KDYwMClcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCAwKScpO1xuICAgIH1cbiAgICBlbHNlIGlmKCBzdGF0ZUlEID09PSAyICl7XG5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNQYXRoLCAjTXVtYmFpTWFya2VyLCAjTXVtYmFpTGFiZWwsICNMb21lTWFya2VyLCAjTG9tZUxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigyMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjQWZyaWNhbkNvdW50cmllcycpLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5kZWxheSggZnVuY3Rpb24oZCxpKXsgcmV0dXJuIDMwMCppOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICB9XG5cbiAgICBsYXN0U3RhdGUgPSBzdGF0ZUlEO1xuXG4gICAgcmV0dXJuIHRoYXQ7XG4gIH07XG5cblxuICAvLyBQcml2YXRlIE1ldGhvZHNcbiAgdmFyIGZhZGVJblBhdGggPSBmdW5jdGlvbiggaWQsIGR1cmF0aW9uICl7XG5cbiAgICB2YXIgY2VudGVyID0gc3ZnLnNlbGVjdChpZCkubm9kZSgpLmdldEJCb3goKTtcblxuICAgIHN2Zy5zZWxlY3QoaWQpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnKyhjZW50ZXIueCsoY2VudGVyLndpZHRoKjAuNSkpKycgJysoY2VudGVyLnkrKGNlbnRlci5oZWlnaHQqMC41KSkrJykgc2NhbGUoMC45KSB0cmFuc2xhdGUoLScrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAtJysoY2VudGVyLnkrKGNlbnRlci5oZWlnaHQqMC41KSkrJyknKVxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAgMCkgc2NhbGUoMSknKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgdmFyIGZhZGVPdXRQYXRoID0gZnVuY3Rpb24oIGlkLCBkdXJhdGlvbiApe1xuXG4gICAgdmFyIGNlbnRlciA9IHN2Zy5zZWxlY3QoaWQpLm5vZGUoKS5nZXRCQm94KCk7XG5cbiAgICBzdmcuc2VsZWN0KGlkKVxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAnKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKSBzY2FsZSgwLjkpIHRyYW5zbGF0ZSgtJysoY2VudGVyLngrKGNlbnRlci53aWR0aCowLjUpKSsnIC0nKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKScpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuXG4gIHJldHVybiB0aGF0O1xufTtcbiIsInZhciBQYXRlbnRzX0luZm9ncmFwaGljID0gZnVuY3Rpb24oIF9pZCApIHtcblxuICB2YXIgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KCk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgaWQgPSBfaWQ7XG4gIHZhciBzdmc7XG4gIHZhciBsYXN0U3RhdGUgPSAtMTtcbiAgdmFyIGMgPSA0MTsgLy8gQ291bnRlciBmb3IgY291bnRyaWVzO1xuICB2YXIgY291bnRyaWVzID0gWydBbGJhbmlhJywgJ0FuZ29sYScsICdBbnRpZ3VhIGFuZCBCYXJidWRhJywgJ0FyZ2VudGluYScsICdBcm1lbmlhJywgJ0F1c3RyYWxpYScsICdBdXN0cmlhJywgJ0JhaHJhaW4nLCAnQmFuZ2xhZGVzaCcsICdCYXJiYWRvcycsICdCZWxnaXVtJywgJ0JlbGl6ZScsICdCZW5pbicsICdCb2xpdmlhJywgJ0JvdHN3YW5hJywgJ0JyYXppbCcsICdCcnVuZWknLCAnQnVsZ2FyaWEnLCAnQnVya2luYSBGYXNvJywgJ0J1cnVuZGknLCAnQ2FibyBWZXJkZScsICdDYW1ib2RpYScsICdDYW1lcm9vbicsICdDYW5hZGEnLCAnQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljJywgJ0NoYWQnLCAnQ2hpbGUnLCAnQ2hpbmEnLCAnQ29sb21iaWEnLCAnQ29uZ28nLCAnQ29zdGEgUmljYScsIFwiQ8O0dGUgZCdJdm9pcmVcIiwgJ0Nyb2F0aWEnLCAnQ3ViYScsICdDeXBydXMnLCAnQ3plY2ggUmVwdWJsaWMnLCAgJ0QuUi4gQ29uZ28nLCAnRGVubWFyaycsICdEamlib3V0aScsICdEb21pbmljYScsICAnRG9taW5pY2FuIFJlcHVibGljJywgJ0VjdWFkb3InLCAnRWd5cHQnLCAnRWwgU2FsdmFkb3InLCAnRXN0b25pYScsICdGaWppJywgJ0ZpbmxhbmQnLCAnRnJhbmNlJywgJ0dhYm9uJywgJ0dhbWJpYScsICdHZW9yZ2lhJywgJ0dlcm1hbnknLCAnR2hhbmEnLCAnR3JlZWNlJywgJ0dyZW5hZGEnLCAnR3VhdGVtYWxhJywgJ0d1aW5lYScsICdHdWluZWEtQmlzc2F1JywgJ0d1eWFuYScsICdIYWl0aScsICdIb25kdXJhcycsICdIb25nIEtvbmcnLCAnSHVuZ2FyeScsICdJY2VsYW5kJywgJ0luZGlhJywgJ0luZG9uZXNpYScsICdJcmVsYW5kJywgJ0lzcmFlbCcsICdJdGFseScsICdKYW1haWNhJywgJ0phcGFuJywgJ0pvcmRhbicsICdLZW55YScsICdLb3JlYScsICdLdXdhaXQnLCAnS3lyZ3l6IFJlcHVibGljJywgJ0xhbyBQLkQuUicsICdMYXR2aWEnLCAnTGVzb3RobycsICdMaWVjaHRlbnN0ZWluJywgJ0xpdGh1YW5pYScsICdMdXhlbWJvdXJnJywgJ01hY2FvJywgJ01hZGFnYXNjYXInLCAnTWFsYXdpJywgJ01hbGF5c2lhJywgJ01hbGRpdmVzJywgJ01hbGknLCAnTWFsdGEnLCAnTWF1cml0YW5pYScsICdNYXVyaXRpdXMnLCAnTWV4aWNvJywgJ01vbGRvdmEnLCAnTW9uZ29saWEnLCAnTW9udGVuZWdybycsICdNb3JvY2NvJywgJ01vemFtYmlxdWUnLCAnTXlhbm1hcicsICdOYW1pYmlhJywgJ05lcGFsJywgJ05ldGhlcmxhbmRzJywgJ05ldyBaZWFsYW5kJywgJ05pY2FyYWd1YScsICdOaWdlcicsICdOaWdlcmlhJywgJ05vcndheScsICdPbWFuJywgJ1Bha2lzdGFuJywgJ1BhbmFtYScsICdQYXB1YSBOZXcgR3VpbmVhJywgJ1BhcmFndWF5JywgJ1BlcnUnLCAnUGhpbGlwcGluZXMnLCAnUG9sYW5kJywgJ1BvcnR1Z2FsJywgJ1FhdGFyJywgJ1JvbWFuaWEnLCAnUnVzc2lhbiBGZWRlcmF0aW9uJywgJ1J3YW5kYScsICdTYWludCBLaXR0cyAmIE5ldmlzJywgJ1NhaW50IEx1Y2lhJywgJ1NhaW50IFZpbmNlbnQgJiB0aGUgR3JlbmFkaW5lcycsICdTYW1vYScsICdTYXVkaSBBcmFiaWEnLCAnU2VuZWdhbCcsICdTZXljaGVsbGVzJywgJ1NpZXJyYSBMZW9uZScsICdTaW5nYXBvcmUnLCAnU2xvdmFrIFJlcHVibGljJywgJ1Nsb3ZlbmlhJywgJ1NvbG9tb24gSXNsYW5kcycsICdTb3V0aCBBZnJpY2EnLCAnU3BhaW4nLCAnU3JpIExhbmthJywgJ1N1cmluYW1lJywgJ1N3YXppbGFuZCcsICdTd2VkZW4nLCAnU3dpdHplcmxhbmQnLCAnQ2hpbmVzZSBUYWlwZWknLCAnVGFqaWtpc3RhbicsICdUYW56YW5pYScsICdUaGFpbGFuZCcsICdNYWNlZG9uaWEnLCAnVG9nbycsICdUb25nYScsICdUcmluaWRhZCAmIFRvYmFnbycsICdUdW5pc2lhJywgJ1R1cmtleScsICdVZ2FuZGEnLCAnVWtyYWluZScsICdVbml0ZWQgQXJhYiBFbWlyYXRlcycsICdVbml0ZWQgS2luZ2RvbScsICdVbml0ZWQgU3RhdGVzIG9mIEFtZXJpY2EnLCAnVXJ1Z3VheScsICdWYW51YXR1JywgJ1ZlbmV6dWVsYScsICdWaWV0IE5hbScsICdZZW1lbicsICdaYW1iaWEnLCAnWmltYmFid2UnXTtcblxuICB0aGF0LmluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIC8vIExvYWQgZXh0ZXJuYWwgU1ZHXG4gICAgZDMueG1sKCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvYXNzZXRzL2ltYWdlcy9zdmcvcGF0ZW50ZXMuc3ZnJyApLm1pbWVUeXBlKCdpbWFnZS9zdmcreG1sJykuZ2V0KCBmdW5jdGlvbih4bWwpIHtcbiAgICBcbiAgICAgICAgJChpZCkuYXBwZW5kKCB4bWwuZG9jdW1lbnRFbGVtZW50ICk7ICAvLyBBcHBlbmQgZXh0ZXJuYWwgU1ZHIHRvIENvbnRhaW5lclxuXG4gICAgICAgIHN2ZyA9IGQzLnNlbGVjdChpZCkuc2VsZWN0KCdzdmcnKTsgICAgLy8gR2V0IFNWRyBFbGVtZW50XG5cbiAgICAgICAgLy8gSW5pdGlhbCBTZXR1cDogYWxsIGdydXBzIGhpZGRlblxuICAgICAgICBzdmcuc2VsZWN0QWxsKCcjV29ybGQsICNEb2MxLCAjRG9jMicpLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gICAgICAgIHN2Zy5zZWxlY3RBbGwoJyNDaGVtaXN0cnksICNUaW1lJykuc2VsZWN0QWxsKCdnJykuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgc3ZnLnNlbGVjdEFsbCgnI1NpZ24nKS5zZWxlY3RBbGwoJ2cnKS5zdHlsZSgnb3BhY2l0eScsIGZ1bmN0aW9uKGQsaSl7IHJldHVybiAoaTw0KSA/IDAgOiAxOyB9KTtcblxuICAgICAgICBjb3VudHJpZXMgPSBkMy5zaHVmZmxlKGNvdW50cmllcyk7XG5cbiAgICAgICAgc3ZnLnNlbGVjdCgnI1dvcmxkJykuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAgICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgZnVuY3Rpb24oZCxpKXsgcmV0dXJuIChpPDIxKSA/ICdlbmQnIDogJ3N0YXJ0JzsgfSlcbiAgICAgICAgICAudGV4dChmdW5jdGlvbihkLGkpeyByZXR1cm4gY291bnRyaWVzW2ldOyB9KVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmRlbGF5KGZ1bmN0aW9uKGQsaSkgeyByZXR1cm4gaSAqIDEwMDsgfSlcbiAgICAgICAgICAgIC5vbignc3RhcnQnLCBmdW5jdGlvbiByZXBlYXQoKSB7XG4gICAgICAgICAgICAgIGlmIChjID49IGNvdW50cmllcy5sZW5ndGgpIHsgYz0wOyB9XG4gICAgICAgICAgICAgIGQzLmFjdGl2ZSh0aGlzKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAgICAgICAgICAgLnRleHQoY291bnRyaWVzW2MrK10pXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxODAwKVxuICAgICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig5MDApXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpLm9uKCdzdGFydCcsIHJlcGVhdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICBzdmcuc2VsZWN0KCcjV29ybGQnKS5zZWxlY3RBbGwoJy50ZXh0JylcbiAgICAgICAgICAuZGF0YShjb3VudHJpZXMpXG4gICAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2NvdW50cnktbGFiZWwnKVxuICAgICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgICAgICAudGV4dChmdW5jdGlvbihkKXsgcmV0dXJuIGQzLnZhbHVlcyhkKVswXTsgfSk7XG4gICAgICAgICovXG4gICAgICB9KTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHRoYXQuc2V0U3RhdGUgPSBmdW5jdGlvbihzdGF0ZUlEKSB7XG5cbiAgICBpZiggc3RhdGVJRCA9PT0gMCApe1xuXG4gICAgICBmYWRlT3V0QWxsKCk7XG4gICAgICBmYWRlT3V0UGF0aCgnI0RvYzEnLCAzMDApO1xuXG4gICAgICAvKlxuICAgICAgc3ZnLnNlbGVjdCgnI0RvYzEnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gICAgICAqL1xuICAgICAgXG4gICAgICBzdmcuc2VsZWN0KCcjU2lnbicpLnNlbGVjdEFsbCgnZycpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKS5kZWxheSggZnVuY3Rpb24oZCxpKXsgcmV0dXJuIDMwMCooNC1pKTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHN0YXRlSUQgPT09IDEgKXtcblxuICAgICAgLypcbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNDaGVtaXN0cnknKS5zZWxlY3RBbGwoJ2cnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoJyNTaWduJykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgKi9cblxuICAgICAgZmFkZU91dEFsbCgpO1xuICAgICAgXG4gICAgICBmYWRlSW5QYXRoKCcjRG9jMScsIDgwMCk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHN0YXRlSUQgPT09IDIgKXtcblxuICAgICAgZmFkZU91dEFsbCgpO1xuICAgICAgZmFkZU91dFBhdGgoJyNEb2MxJywgMzAwKTtcbiAgICAgIGZhZGVPdXRQYXRoKCcjRG9jMicsIDMwMCk7XG5cbiAgICAgIC8qXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjRG9jMicpLnNlbGVjdEFsbCgnZycpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICAgICovXG4gICBcbiAgICAgIHN2Zy5zZWxlY3QoJyNDaGVtaXN0cnknKS5zZWxlY3RBbGwoJ2cnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuZGVsYXkoIGZ1bmN0aW9uKGQsaSl7IHJldHVybiAzMDAqaTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgfVxuICAgIGVsc2UgaWYoIHN0YXRlSUQgPT09IDMgKXtcblxuICAgICAgZmFkZU91dEFsbCgpO1xuICAgICAgZmFkZU91dFBhdGgoJyNUaW1lJywgMzAwKTtcblxuICAgICAgLypcbiAgICAgIHN2Zy5zZWxlY3QoJyNUaW1lJykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjQ2hlbWlzdHJ5Jykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgICAqL1xuXG4gICAgICBmYWRlSW5QYXRoKCcjRG9jMicsIDgwMCk7XG5cbiAgICAgIHN2Zy5zZWxlY3QoJyNEb2MyJykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApLmRlbGF5KCBmdW5jdGlvbihkLGkpeyByZXR1cm4gMzAwKmk7IH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgIH1cbiAgICBlbHNlIGlmKCBzdGF0ZUlEID09PSA0ICl7XG5cbiAgICAgIGZhZGVPdXRBbGwoKTtcbiAgICAgIGZhZGVPdXRQYXRoKCcjRG9jMicsIDMwMCk7XG5cbiAgICAgIC8qXG4gICAgICBzdmcuc2VsZWN0QWxsKCcjV29ybGQnKVxuICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG5cbiAgICAgIHN2Zy5zZWxlY3RBbGwoJyNEb2MyJykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgKi9cblxuICAgICAgZmFkZUluUGF0aCgnI1RpbWUnLCA4MDApO1xuXG4gICAgICBzdmcuc2VsZWN0KCcjVGltZScpLnNlbGVjdEFsbCgnZycpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKS5kZWxheSggZnVuY3Rpb24oZCxpKXsgcmV0dXJuIDMwMCppOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICB9XG4gICAgZWxzZSBpZiggc3RhdGVJRCA9PT0gNSApe1xuXG4gICAgICBmYWRlT3V0QWxsKCk7XG4gICAgICAgZmFkZU91dFBhdGgoJyNUaW1lJywgMzAwKTtcblxuICAgICAgLypcbiAgICAgIHN2Zy5zZWxlY3QoJyNUaW1lJykuc2VsZWN0QWxsKCdnJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigzMDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgKi9cblxuICAgICAgc3ZnLnNlbGVjdCgnI1dvcmxkJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig4MDApXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuXG4gICAgICAvKlxuICAgICAgdmFyIHcgPSBzdmcuc2VsZWN0KCcjTWFwJykubm9kZSgpLmdldEJCb3goKS53aWR0aDtcblxuICAgICAgc3ZnLnNlbGVjdCgnI01hcCcpXG4gICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTUwMClcbiAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyt3KycgMCknKTtcbiAgICAgICovXG4gICAgfVxuXG4gICAgbGFzdFN0YXRlID0gc3RhdGVJRDtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIC8vIFByaXZhdGUgTWV0aG9kc1xuICB2YXIgZmFkZU91dEFsbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICBzdmcuc2VsZWN0QWxsKCcjV29ybGQsICNEb2MxLCAjRG9jMicpXG4gICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDMwMClcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgc3ZnLnNlbGVjdEFsbCgnI0NoZW1pc3RyeSwgI1RpbWUsICNTaWduJykuc2VsZWN0QWxsKCdnJylcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMzAwKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gIH07XG5cbiAgdmFyIGZhZGVJblBhdGggPSBmdW5jdGlvbiggaWQsIGR1cmF0aW9uICl7XG5cbiAgICB2YXIgY2VudGVyID0gc3ZnLnNlbGVjdChpZCkubm9kZSgpLmdldEJCb3goKTtcblxuICAgIHN2Zy5zZWxlY3QoaWQpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnKyhjZW50ZXIueCsoY2VudGVyLndpZHRoKjAuNSkpKycgJysoY2VudGVyLnkrKGNlbnRlci5oZWlnaHQqMC41KSkrJykgc2NhbGUoMC45KSB0cmFuc2xhdGUoLScrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAtJysoY2VudGVyLnkrKGNlbnRlci5oZWlnaHQqMC41KSkrJyknKVxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAgMCkgc2NhbGUoMSknKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH07XG5cbiAgdmFyIGZhZGVPdXRQYXRoID0gZnVuY3Rpb24oIGlkLCBkdXJhdGlvbiApe1xuXG4gICAgdmFyIGNlbnRlciA9IHN2Zy5zZWxlY3QoaWQpLm5vZGUoKS5nZXRCQm94KCk7XG5cbiAgICBzdmcuc2VsZWN0KGlkKVxuICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcrKGNlbnRlci54KyhjZW50ZXIud2lkdGgqMC41KSkrJyAnKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKSBzY2FsZSgwLjkpIHRyYW5zbGF0ZSgtJysoY2VudGVyLngrKGNlbnRlci53aWR0aCowLjUpKSsnIC0nKyhjZW50ZXIueSsoY2VudGVyLmhlaWdodCowLjUpKSsnKScpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfTtcblxuICByZXR1cm4gdGhhdDtcbn07XG4iLCJmdW5jdGlvbiBQcmljZXNfSW5mb2dyYXBoaWMoIF9pZCApIHtcblxuICB2YXIgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KCk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgaW5pdGlhbGl6ZWQgPSBmYWxzZSxcbiAgICAgIERPVF9PUEFDSVRZID0gMC43LFxuICAgICAgRE9UX1JBRElVUyA9IDcsXG4gICAgICBET1RfR1JBWSA9ICcjZDZkNmQ2JyxcbiAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgIGRhdGE6ICdhZmZvcmRhYmlsaXR5JyxcbiAgICAgICAgdHlwZTogJ3ByaXZhdGUnLFxuICAgICAgICBvcmRlcjogJ2FyZWEnLFxuICAgICAgICBsYWJlbDogJ1ByaXZhdGUgc2VjdG9yIC0gbnVtYmVyIG9mIGRheXMnXG4gICAgICB9LFxuICAgICAgdHh0ID0ge1xuICAgICAgICAnZXMnOiB7XG4gICAgICAgICAgJ2dyYXRpcyc6ICdncmF0aXMnLFxuICAgICAgICAgICdkaWFzJzogJ0TDrWFzJyxcbiAgICAgICAgICAnaG9yYXMnOiAnaG9yYXMnLFxuICAgICAgICAgICdtZW5vc2hvcmEnOiAnbWVub3MgZGUgdW5hIGhvcmEnLFxuICAgICAgICAgICdBZnJpY2EnOiAnw4FmcmljYScsXG4gICAgICAgICAgJ0FtZXJpY2EnOiAnQW3DqXJpY2EnLFxuICAgICAgICAgICdBc2lhJzogJ0FzaWEnLFxuICAgICAgICAgICdFdXJvcGUnOiAnRXVyb3BhJyxcbiAgICAgICAgICAnT2NlYW5pYSc6ICdPY2VhbsOtYScsXG4gICAgICAgICAgJ0xvdyBpbmNvbWUnOiAnSW5ncmVzbyBiYWpvJyxcbiAgICAgICAgICAnTG93ZXIgbWlkZGxlIGluY29tZSc6ICdJbmdyZXNvIG1lZGlvIGJham8nLFxuICAgICAgICAgICdVcHBlciBtaWRkbGUgaW5jb21lJzogJ0luZ3Jlc28gbWVkaW8gYWx0bycsXG4gICAgICAgICAgJ0hpZ2ggaW5jb21lJzogJ0luZ3Jlc28gYWx0bycsXG4gICAgICAgIH0sXG4gICAgICAgICdlbic6IHtcbiAgICAgICAgICAnZ3JhdGlzJzogJ2ZyZWUnLFxuICAgICAgICAgICdkaWFzJzogJ0RheXMnLFxuICAgICAgICAgICdob3Jhcyc6ICdob3VycycsXG4gICAgICAgICAgJ21lbm9zaG9yYSc6ICdsZXNzIHRoYW4gYW4gaG91cicsXG4gICAgICAgICAgJ0FmcmljYSc6ICdBZnJpY2EnLFxuICAgICAgICAgICdBbWVyaWNhJzogJ0FtZXJpY2EnLFxuICAgICAgICAgICdBc2lhJzogJ0FzaWEnLFxuICAgICAgICAgICdFdXJvcGUnOiAnRXVyb3BlJyxcbiAgICAgICAgICAnT2NlYW5pYSc6ICdPY2VhbmlhJyxcbiAgICAgICAgICAnTG93IGluY29tZSc6ICdMb3cgaW5jb21lJyxcbiAgICAgICAgICAnTG93ZXIgbWlkZGxlIGluY29tZSc6ICdMb3dlciBtaWRkbGUgaW5jb21lJyxcbiAgICAgICAgICAnVXBwZXIgbWlkZGxlIGluY29tZSc6ICdVcHBlciBtaWRkbGUgaW5jb21lJyxcbiAgICAgICAgICAnSGlnaCBpbmNvbWUnOiAnSGlnaCBpbmNvbWUnLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3ZlcmxheUNvZGUgPSBudWxsLFxuICAgICAgZG90Q2xpY2tlZCA9IG51bGw7XG5cbiAgdmFyIG1hcmdpbiA9IHt0b3A6IDE1MCwgcmlnaHQ6IDUwLCBib3R0b206IDUwLCBsZWZ0OiA1MH0sXG4gICAgICB3aWR0aENvbnQsIGhlaWdodENvbnQsXG4gICAgICB3aWR0aCwgaGVpZ2h0O1xuXG4gIHZhciBpZCA9IF9pZCxcbiAgICAgICRlbCA9ICQoaWQpLFxuICAgICAgJG1lbnUgPSAkKCcjcHJpY2VzLWluZm9ncmFwaGljLW1lbnUnKSxcbiAgICAgICR0b29sdGlwID0gJCgnI3ByaWNlcy1pbmZvZ3JhcGhpYy10b29sdGlwJyksXG4gICAgICAkcmVnaW9uRHJvcGRvd25JbnB1dHMgPSAkKCcjcmVnaW9uLWRyb3Bkb3duLW1lbnUgLmNoZWNrYm94IGlucHV0JyksXG4gICAgICAkZHJ1Z0Ryb3Bkb3duSW5wdXRzID0gJCgnI2RydWctZHJvcGRvd24tbWVudSAuY2hlY2tib3ggaW5wdXQnKTtcblxuICB2YXIgbGFuZyA9ICRlbC5wYXJlbnQoKS5kYXRhKCdsYW5nJyk7XG5cbiAgdmFyIGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKClcbiAgICAgIC5yYW5nZShbJyNDOUFENEInLCAnI0JCRDY0NicsICcjNjNCQTJEJywgJyMzNEE4OTMnLCAnIzNEOTFBRCcsICcjNUI4QUNCJywgJyNCQTdEQUYnLCAnI0JGNkI4MCcsICcjRjQ5RDlEJywgJyNFMjU0NTMnLCAnI0I1NjYzMScsICcjRTI3NzNCJywgJyNGRkE5NTEnLCAnI0Y0Q0EwMCddKTtcblxuICB2YXIgc3ZnLFxuICAgICAgeCwgeSwgeEF4aXMsIHlBeGlzLFxuICAgICAgdGltZW91dCwgdG9vbHRpcEl0ZW0sIGRydWdzRmlsdGVyZWQsIGRydWdzRmlsdGVyZWRBbGwsXG4gICAgICBkYXRhUHJpY2VzUHVibGljLCBkYXRhUHJpY2VzUHJpdmF0ZSwgZGF0YUFmZm9yZGFiaWxpdHksIGRhdGFDb3VudHJpZXMsIGRhdGFDb3VudHJpZXNBbGw7XG5cbiAgdmFyICRzdmcsICRkb3RzLCAkbGluZXMsICRjb3VudHJ5TWFya2VyLCAkY291bnRyeUxhYmVsLCAkb3ZlcmxheSwgJG1wckxpbmUsICR5QXhpcywgJHhBeGlzLCAkeUxhYmVsLCAkeEFyZWE7XG5cbiAgdmFyIHRpY2tGb3JtYXRQcmljZXMgPSBmdW5jdGlvbihkKXtcbiAgICAgICAgaWYgKGQgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gdHh0W2xhbmddLmdyYXRpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZCsneCc7XG4gICAgICB9O1xuXG4gIHZhciB0aWNrRm9ybWF0QWZmb3JkYWJpbGl0eSA9IGZ1bmN0aW9uKGQpe1xuICAgICAgICBpZiAoZCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB0eHRbbGFuZ10uZ3JhdGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkO1xuICAgICAgfTtcblxuICAvLyBTZXR1cCBWaXN1YWxpemF0aW9uXG5cbiAgdGhhdC5pbml0ID0gZnVuY3Rpb24oIF9za2lwICkge1xuXG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgLy8gVXNlIC8/c2tpcD10cnVlIHRvIHNraXAgaW5mb2dyYXBoaWMgdG91clxuICAgIHRoYXQuc2tpcCA9IF9za2lwO1xuXG4gICAgc2V0RGltZW5zaW9ucygpO1xuXG4gICAgeCA9IGQzLnNjYWxlUG9pbnQoKVxuICAgICAgLnJhbmdlKFswLCB3aWR0aF0pO1xuXG4gICAgeSA9IGQzLnNjYWxlUG93KCkuZXhwb25lbnQoMC41KVxuICAgICAgLnJhbmdlKFtoZWlnaHQsIDBdKTtcblxuICAgIHhBeGlzID0gZDMuYXhpc0JvdHRvbSh4KVxuICAgICAgLnRpY2tTaXplKC1oZWlnaHQpXG4gICAgICAudGlja1BhZGRpbmcoMTIpO1xuXG4gICAgeUF4aXMgPSBkMy5heGlzTGVmdCh5KVxuICAgICAgLnRpY2tTaXplKC13aWR0aClcbiAgICAgIC50aWNrUGFkZGluZyg4KVxuICAgICAgLnRpY2tGb3JtYXQodGlja0Zvcm1hdEFmZm9yZGFiaWxpdHkpO1xuXG4gICAgc3ZnID0gZDMuc2VsZWN0KGlkKS5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCdpZCcsICdwcmljZXMtaW5mb2dyYXBoaWMtc3ZnJylcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGhDb250KVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0Q29udClcbiAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknKTtcblxuICAgIC8vIFNldCBkcnVnIGZpbHRlcmVkXG4gICAgZHJ1Z3NGaWx0ZXJlZEFsbCA9ICcnO1xuICAgICRkcnVnRHJvcGRvd25JbnB1dHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgZHJ1Z3NGaWx0ZXJlZEFsbCArPSAkKHRoaXMpLmF0dHIoJ25hbWUnKSsnICc7XG4gICAgfSk7XG4gICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG5cbiAgICAvLyBMb2FkIENTVnNcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvYXNzZXRzL2RhdGEvcHJpY2VzLmNzdicpXG4gICAgICAuZGVmZXIoZDMuY3N2LCAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvYXNzZXRzL2RhdGEvYWZmb3JkYWJpbGl0eS5jc3YnKVxuICAgICAgLmRlZmVyKGQzLmNzdiwgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSsnL2Fzc2V0cy9kYXRhL3ByaWNlcy1jb3VudHJpZXMuY3N2JylcbiAgICAgIC5hd2FpdCggb25EYXRhUmVhZHkgKTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHRoYXQuc2V0U3RhdGUgPSBmdW5jdGlvbihzdGF0ZUlEKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKCBzdGF0ZUlEICk7XG5cbiAgICBpZiggc3RhdGVJRCA9PT0gMCApe1xuXG4gICAgICBkcnVnc0ZpbHRlcmVkID0gZHJ1Z3NGaWx0ZXJlZEFsbDtcbiAgICAgIHVwZGF0ZURhdGEoICdhZmZvcmRhYmlsaXR5JywgJ3ByaXZhdGUnICk7XG5cbiAgICAgIC8vIFNob3cgb25seSBTYWxidXRhbW9sIGRvdHNcbiAgICAgICRkb3RzLnRyYW5zaXRpb24oMTAwMClcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCl7IHJldHVybiAoZC5EcnVnICE9PSAnU2FsYnV0YW1vbCcpID8gRE9UX0dSQVkgOiBjb2xvcihkLkRydWcpOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkLkRydWcgIT09ICdTYWxidXRhbW9sJykgPyBET1RfT1BBQ0lUWSA6IDE7IH0pO1xuXG4gICAgICAvLyBTZXQgc2VsZWN0ZWQgZG90cyBvbiB0b3BcbiAgICAgICRkb3RzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChhLkRydWcgPT09ICdTYWxidXRhbW9sJykgPyAxIDogLTE7XG4gICAgICB9KTtcblxuICAgICAgc2V0VG9vbHRpcE9uVG91cignLmRvdC5kcnVnLXNhbGJ1dGFtb2wuY291bnRyeS1reXJneXpzdGFuJyk7XG5cbiAgICB9IGVsc2UgaWYoIHN0YXRlSUQgPT09IDEgKXtcblxuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICB1cGRhdGVEYXRhKCAnYWZmb3JkYWJpbGl0eScsICdwcml2YXRlJyApO1xuXG4gICAgICAvLyBTaG93IGFsbCBkb3RzXG4gICAgICBzZXREb3RzQ29sb3IoKVxuXG4gICAgICBzZXRUb29sdGlwT25Ub3VyKCcuZG90LmRydWctY2FwdG9wcmlsLmNvdW50cnktZ2hhbmEnKTtcblxuICAgIH0gZWxzZSBpZiggc3RhdGVJRCA9PT0gMiApe1xuXG4gICAgICBkcnVnc0ZpbHRlcmVkID0gJ1NpbXZhc3RhdGluIE9tZXByYXpvbGUnO1xuICAgICAgdXBkYXRlRGF0YSggJ2FmZm9yZGFiaWxpdHknLCAncHJpdmF0ZScgKTtcblxuICAgICAgLy8gU2hvdyBvbmx5IGRydWdzRmlsdGVyZWQgZG90c1xuICAgICAgJGRvdHMudHJhbnNpdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkcnVnc0ZpbHRlcmVkLmluZGV4T2YoZC5EcnVnKSA9PT0gLTEpID8gRE9UX0dSQVkgOiBjb2xvcihkLkRydWcpOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkcnVnc0ZpbHRlcmVkLmluZGV4T2YoZC5EcnVnKSA9PT0gLTEpID8gRE9UX09QQUNJVFkgOiAxOyB9KTtcblxuICAgICAgLy8gU2V0IHNlbGVjdGVkIGRvdHMgb24gdG9wXG4gICAgICAkZG90cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiAoZHJ1Z3NGaWx0ZXJlZC5pbmRleE9mKGEuRHJ1ZykgPiAtMSkgPyAxIDogLTE7XG4gICAgICB9KTtcblxuICAgICAgc2V0VG9vbHRpcE9uVG91cignLmRvdC5kcnVnLXNpbXZhc3RhdGluLmNvdW50cnktc8Ojby10b23DqS1hbmQtcHLDrW5jaXBlJyk7XG5cbiAgICB9IGVsc2UgaWYoIHN0YXRlSUQgPT09IDMgKXtcblxuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICB2YXIgY291bnRyaWVzID0gJ1PDo28gVG9tw6kgYW5kIFByw61uY2lwZSBLdXdhaXQgSXRhbHkgU3BhaW4gR2VybWFueSc7XG4gICAgICB1cGRhdGVEYXRhKCAnYWZmb3JkYWJpbGl0eScsICdwcml2YXRlJyApO1xuXG4gICAgICAkZG90cy50cmFuc2l0aW9uKDEwMDApXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKGNvdW50cmllcy5pbmRleE9mKCBkLkNvdW50cnkgKSA9PT0gLTEgKSA/IERPVF9HUkFZIDogY29sb3IoZC5EcnVnKTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgZnVuY3Rpb24oZCl7IHJldHVybiAoY291bnRyaWVzLmluZGV4T2YoIGQuQ291bnRyeSApID09PSAtMSApID8gRE9UX09QQUNJVFkgOiAxOyB9KTtcblxuICAgICAgc2V0VG9vbHRpcE9uVG91cignLmRvdC5kcnVnLWNpcHJvZmxveGFjaW4uY291bnRyeS1zw6NvLXRvbcOpLWFuZC1wcsOtbmNpcGUnKTtcblxuICAgIH0gZWxzZSBpZiggc3RhdGVJRCA9PT0gNCApe1xuXG4gICAgICBkcnVnc0ZpbHRlcmVkID0gZHJ1Z3NGaWx0ZXJlZEFsbDtcbiAgICAgIHVwZGF0ZURhdGEoICdwcmljZXMnLCAncHJpdmF0ZScgKTtcblxuICAgICAgc2V0RG90c0NvbG9yKCk7XG5cbiAgICAgIHNldFRvb2x0aXBPblRvdXIoJy5kb3QuZHJ1Zy1jaXByb2Zsb3hhY2luLmNvdW50cnktbW9yb2NjbycpO1xuICAgICBcbiAgICB9IGVsc2UgaWYoIHN0YXRlSUQgPT09IDUgKXtcblxuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICB1cGRhdGVEYXRhKCAncHJpY2VzJywgJ3ByaXZhdGUnICk7XG5cbiAgICAgICRkb3RzLnRyYW5zaXRpb24oMTAwMClcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgRE9UX0dSQVkpXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsRE9UX09QQUNJVFkpO1xuXG4gICAgICBzdmcuc2VsZWN0QWxsKCcuZG90LmNvdW50cnkta3V3YWl0JylcbiAgICAgICAgLnRyYW5zaXRpb24oMTAwMClcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCl7IHJldHVybiBjb2xvcihkLkRydWcpOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgICAgc2V0VG9vbHRpcE9uVG91cignLmRvdC5kcnVnLWNpcHJvZmxveGFjaW4uY291bnRyeS1rdXdhaXQnKTtcbiAgICAgIFxuICAgIH0gZWxzZSBpZiggc3RhdGVJRCA9PT0gNiApe1xuXG4gICAgICBkcnVnc0ZpbHRlcmVkID0gZHJ1Z3NGaWx0ZXJlZEFsbDtcbiAgICAgIHVwZGF0ZURhdGEoICdwcmljZXMnLCAncHVibGljJyApO1xuXG4gICAgICBzZXREb3RzQ29sb3IoKTtcblxuICAgICAgc2V0VG9vbHRpcE9uVG91cignLmRvdC5kcnVnLWRpY2xvZmVuYWMuY291bnRyeS1zdWRhbicpO1xuICAgICBcbiAgICB9IGVsc2UgaWYoIHN0YXRlSUQgPT09IDcgKXtcblxuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICB1cGRhdGVEYXRhKCAncHJpY2VzJywgJ3B1YmxpYycgKTtcblxuICAgICAgc2V0RG90c0NvbG9yKCk7XG5cbiAgICAgIHNldFRvb2x0aXBPblRvdXIoJy5kb3QuZHJ1Zy1hbW94aWNpbGxpbi5jb3VudHJ5LWJyYXppbC0tcmlvLWdyYW5kZS1kby1zdWwtc3RhdGUnKTtcblxuICAgIH0gZWxzZSBpZiggc3RhdGVJRCA9PT0gOCApe1xuXG4gICAgICBkcnVnc0ZpbHRlcmVkID0gZHJ1Z3NGaWx0ZXJlZEFsbDtcbiAgICAgIHVwZGF0ZURhdGEoICdwcmljZXMnLCAncHJpdmF0ZScgKTtcblxuICAgICAgLy8gU2hvdyBvbmx5IGRydWdzRmlsdGVyZWQgZG90c1xuICAgICAgJGRvdHMudHJhbnNpdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXsgcmV0dXJuICgnQ2lwcm9mbG94YWNpbicgIT09IGQuRHJ1ZykgPyBET1RfR1JBWSA6IGNvbG9yKGQuRHJ1Zyk7IH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIGZ1bmN0aW9uKGQpeyByZXR1cm4gKCdDaXByb2Zsb3hhY2luJyAhPT0gZC5EcnVnKSA/IERPVF9PUEFDSVRZIDogMTsgfSk7XG5cbiAgICAgIC8vIFNldCBzZWxlY3RlZCBkb3RzIG9uIHRvcFxuICAgICAgJGRvdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gKCdDaXByb2Zsb3hhY2luJyA9PT0gYS5EcnVnKSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuXG4gICAgICBzZXRUb29sdGlwT25Ub3VyKCcuZG90LmRydWctY2lwcm9mbG94YWNpbi5jb3VudHJ5LWV0aGlvcGlhJyk7XG5cbiAgICB9IGVsc2UgaWYoIHN0YXRlSUQgPT09IDkgKXtcblxuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICB1cGRhdGVEYXRhKCAnYWZmb3JkYWJpbGl0eScsICdwcml2YXRlJyApO1xuXG4gICAgICAkdG9vbHRpcC5jc3MoJ29wYWNpdHknLCAnMCcpO1xuICAgICAgdG9vbHRpcEl0ZW0gPSBudWxsO1xuXG4gICAgICBzZXREb3RzQ29sb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhhdDtcbiAgfTtcblxuICB0aGF0LnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0RGltZW5zaW9ucygpOyAgLy8gVXBkYXRlIHdpZHRoL2hlaWdodFxuXG4gICAgLy9pZiggd2lkdGhDb250IDwgOTkyICl7IHJldHVybiB0aGF0OyB9ICAgLy8gU2tpcCBmb3IgbW9iaWxlIHNpemVzXG4gICAgaWYoIHdpZHRoQ29udCA8IDg2MCB8fCBoZWlnaHQgPCAwICl7IHJldHVybiB0aGF0OyB9ICAgLy8gU2tpcCBmb3IgbW9iaWxlIHNpemVzXG5cbiAgICAkc3ZnLmF0dHIoJ3dpZHRoJywgd2lkdGhDb250KS5hdHRyKCdoZWlnaHQnLCBoZWlnaHRDb250KTsgICAvLyBVcGRhdGUgU1ZHIHNpemVcblxuICAgIC8vVXBkYXRlIEF4aXNcbiAgICB4LnJhbmdlKFswLCB3aWR0aF0pO1xuICAgIHkucmFuZ2UoW2hlaWdodCwgMF0pO1xuXG4gICAgeEF4aXMudGlja1NpemUoLWhlaWdodCk7XG4gICAgeUF4aXMudGlja1NpemUoLXdpZHRoKTtcblxuICAgICR4QXhpc1xuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgaGVpZ2h0ICsgJyknKVxuICAgICAgLmNhbGwoeEF4aXMpO1xuXG4gICAgJHlBeGlzLmNhbGwoeUF4aXMpO1xuXG4gICAgLy8gQ291bnRyeSBNYXJrZXJcbiAgICAkY291bnRyeU1hcmtlci5hdHRyKCd5MScsIGhlaWdodCk7XG4gICAgJGNvdW50cnlMYWJlbC5hdHRyKCd5JywgaGVpZ2h0KzM2KTtcblxuICAgIC8vIE1QUiBMaW5lXG4gICAgJG1wckxpbmUuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwICcgKyB5KDEpICsgJyknKTtcbiAgICAkbXByTGluZS5zZWxlY3RBbGwoJ2xpbmUnKS5hdHRyKCd4MicsIHdpZHRoKTtcblxuICAgIC8vIE1vdXNlIGV2ZW50cyBvdmVybGF5XG4gICAgJG92ZXJsYXlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG5cbiAgICAvLyBTZXQgVG9vbHRpcCBwb3NpdGlvbiBpbiBUb3VyXG4gICAgaWYgKHRvb2x0aXBJdGVtKSB7XG4gICAgICBpZiAoJHRvb2x0aXAuaGFzQ2xhc3MoJ2xlZnQnKSApIHtcbiAgICAgICAgJHRvb2x0aXAuY3NzKCdyaWdodCcsICh3aWR0aENvbnQtTWF0aC5yb3VuZCh0b29sdGlwSXRlbS5hdHRyKCdjeCcpKS1tYXJnaW4ubGVmdCkrJ3B4Jyk7XG4gICAgICB9IGVsc2V7XG4gICAgICAgICR0b29sdGlwLmNzcygnbGVmdCcsIChNYXRoLnJvdW5kKHRvb2x0aXBJdGVtLmF0dHIoJ2N4JykpK21hcmdpbi5sZWZ0KSsncHgnKTtcbiAgICAgIH1cbiAgICAgIHZhciB0b3AgPSBNYXRoLnJvdW5kKHRvb2x0aXBJdGVtLmF0dHIoJ2N5JykpO1xuICAgICAgaWYgKHRvcCA+IDYwKXtcbiAgICAgICAgJHRvb2x0aXAuY3NzKCd0b3AnLCAodG9wK21hcmdpbi50b3AtOC0oJHRvb2x0aXAuaGVpZ2h0KCkqMC41KSkrJ3B4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdG9vbHRpcC5jc3MoJ3RvcCcsICh0b3ArbWFyZ2luLnRvcC0xOCkrJ3B4Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIERvdHMgJiBMaW5lc1xuICAgICRsaW5lcy5zZWxlY3RBbGwoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgc2V0VmFsdWVYKVxuICAgICAgLmF0dHIoJ3kxJywgaGVpZ2h0KVxuICAgICAgLmF0dHIoJ3gyJywgc2V0VmFsdWVYKVxuICAgICAgLmF0dHIoJ3kyJywgc2V0VmFsdWVZKTtcblxuICAgICRkb3RzXG4gICAgICAuYXR0cignY3gnLCBzZXRWYWx1ZVgpXG4gICAgICAuYXR0cignY3knLCBzZXRWYWx1ZVkpO1xuXG4gICAgaWYgKHdpZHRoQ29udCA8IDk2MCAmJiBET1RfUkFESVVTID09PSA3KSB7XG4gICAgICBET1RfUkFESVVTID0gNjtcbiAgICAgICRkb3RzLmF0dHIoJ3InLCBET1RfUkFESVVTKTtcbiAgICB9IGVsc2UgaWYgKHdpZHRoQ29udCA+PSA5NjAgJiYgRE9UX1JBRElVUyA9PT0gNikge1xuICAgICAgRE9UX1JBRElVUyA9IDc7XG4gICAgICAkZG90cy5hdHRyKCdyJywgRE9UX1JBRElVUyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoYXQ7XG4gIH07XG5cbiAgdGhhdC5pc0luaXRpYWxpemVkID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gaW5pdGlhbGl6ZWQ7XG4gIH07XG5cblxuICAvLyBQcml2YXRlIE1ldGhvZHNcblxuICB2YXIgb25EYXRhUmVhZHkgPSBmdW5jdGlvbiggZXJyb3IsIHByaWNlcywgYWZmb3JkYWJpbGl0eSwgY291bnRyaWVzICl7XG5cbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yO1xuXG4gICAgcHJpY2VzID0gcHJpY2VzLmZpbHRlcihmdW5jdGlvbihkKXsgcmV0dXJuIGRbJ1VuaXQvTVBSJ10gPT09ICdNUFInOyB9KTtcbiAgICBwcmljZXMuZm9yRWFjaChmdW5jdGlvbihkKSB7XG4gICAgICBkLlByaWNlID0gKGQuUHJpY2UgPT09ICdOTyBEQVRBJykgPyBudWxsIDogKChkLlByaWNlICE9PSAnZnJlZScpID8gK2QuUHJpY2UgOiAwKTtcbiAgICB9KTtcbiAgICBcbiAgICBhZmZvcmRhYmlsaXR5LmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgdmFyIGFmZm9yZGFiaWxpdHlQdWJsaWMgPSAgZFsnUHVibGljIHNlY3RvciAtIG51bWJlciBvZiBkYXlzJ107XG4gICAgICB2YXIgYWZmb3JkYWJpbGl0eVByaXZhdGUgPSAgZFsnUHJpdmF0ZSBzZWN0b3IgLSBudW1iZXIgb2YgZGF5cyddO1xuICAgICAgZFsnUHVibGljIHNlY3RvciAtIG51bWJlciBvZiBkYXlzJ10gID0gKGFmZm9yZGFiaWxpdHlQdWJsaWMgIT09ICdOTyBEQVRBJyAmJiBhZmZvcmRhYmlsaXR5UHVibGljICE9PSAnJykgPyArYWZmb3JkYWJpbGl0eVB1YmxpYyA6IG51bGw7XG4gICAgICBkWydQcml2YXRlIHNlY3RvciAtIG51bWJlciBvZiBkYXlzJ10gPSAoYWZmb3JkYWJpbGl0eVByaXZhdGUgIT09ICdOTyBEQVRBJyAmJiBhZmZvcmRhYmlsaXR5UHJpdmF0ZSAhPT0gJycpID8gK2FmZm9yZGFiaWxpdHlQcml2YXRlIDogbnVsbDtcbiAgICB9KTtcblxuICAgIGRhdGFDb3VudHJpZXMgPSBkYXRhQ291bnRyaWVzQWxsID0gY291bnRyaWVzO1xuICAgIGRhdGFQcmljZXNQdWJsaWMgID0gcHJpY2VzLmZpbHRlcihmdW5jdGlvbihkKXsgcmV0dXJuIGRbJ1B1YmxpYy9Qcml2YXRlJ10gPT09ICdQdWJsaWMnOyB9KTtcbiAgICBkYXRhUHJpY2VzUHJpdmF0ZSA9IHByaWNlcy5maWx0ZXIoZnVuY3Rpb24oZCl7IHJldHVybiBkWydQdWJsaWMvUHJpdmF0ZSddID09PSAnUHJpdmF0ZSc7IH0pO1xuICAgIGRhdGFBZmZvcmRhYmlsaXR5ID0gYWZmb3JkYWJpbGl0eTtcblxuICAgIHJlb3JkZXJDb3VudHJpZXNCeUFyZWEoKTtcblxuICAgIC8qXG4gICAgY29uc29sZS5kaXIoZGF0YUNvdW50cmllcyk7XG4gICAgY29uc29sZS5kaXIoZGF0YVByaWNlc1B1YmxpYyk7XG4gICAgY29uc29sZS5kaXIoZGF0YUFmZm9yZGFiaWxpdHkpO1xuICAgICovXG5cbiAgICBwcmljZXMgPSBhZmZvcmRhYmlsaXR5ID0gY291bnRyaWVzID0gbnVsbDsgIC8vIHJlc2V0IHRlbXAgdmFyaWFibGVzIGZvciBnYXJiYWdlIGNvbGxlY3RvclxuXG4gICAgc2V0RGF0YSgpO1xuICAgIHNldHVwTWVudUJ0bnMoKTtcblxuICAgIGlmICh0aGF0LnNraXApIHtcbiAgICAgIC8vIGlmIHNraXAgc2V0dXAgc2V0IGxhc3Qgc3RhdGVcbiAgICAgIHRoYXQuc2V0U3RhdGUoIDkgKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHNldERhdGEgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGN1cnJlbnREYXRhID0gZ2V0Q3VycmVudERhdGEoKTtcblxuICAgICRzdmcgPSBkMy5zZWxlY3QoJyNwcmljZXMtaW5mb2dyYXBoaWMtc3ZnJyk7XG5cbiAgICAvLyBTZXQgdGl0bGVcbiAgICAkbWVudS5maW5kKCcuJytjdXJyZW50LmRhdGErJy0nK2N1cnJlbnQudHlwZSkuc2hvdygpO1xuXG4gICAgeC5kb21haW4oIGRhdGFDb3VudHJpZXMubWFwKGZ1bmN0aW9uKGQpeyByZXR1cm4gZC5Db2RlOyB9KSApO1xuICAgIHkuZG9tYWluKCBkMy5leHRlbnQoY3VycmVudERhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGRbIGN1cnJlbnQubGFiZWwgXTsgfSkgKS5uaWNlKCk7XG4gICAgY29sb3IuZG9tYWluKCBkMy5leHRlbnQoY3VycmVudERhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuRHJ1ZzsgfSkgKTtcblxuICAgIHhBeGlzLnRpY2tzKCBkYXRhQ291bnRyaWVzLmxlbmd0aCApO1xuXG4gICAgLy8gU2V0dXAgWCBBeGlzXG4gICAgJHhBeGlzID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAneCBheGlzJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsJyArIGhlaWdodCArICcpJylcbiAgICAgIC5jYWxsKHhBeGlzKTtcblxuICAgIC8vIFNldHVwIFkgQXhpc1xuICAgICR5QXhpcyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3kgYXhpcycpXG4gICAgICAuY2FsbCh5QXhpcyk7XG5cbiAgICAkeUxhYmVsID0gJHlBeGlzLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd5LWxhYmVsJylcbiAgICAgICAgLmF0dHIoJ3knLCAtMTUpXG4gICAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAgICAgLnRleHQoIHR4dFtsYW5nXS5kaWFzICk7XG5cbiAgICAvLyBDb3VudHJ5IE1hcmtlclxuICAgICRjb3VudHJ5TWFya2VyID0gc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY291bnRyeS1tYXJrZXInKVxuICAgICAgLmF0dHIoJ3gxJywgMClcbiAgICAgIC5hdHRyKCd5MScsIGhlaWdodClcbiAgICAgIC5hdHRyKCd4MicsIDApXG4gICAgICAuYXR0cigneTInLCAwKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG5cbiAgICAkY291bnRyeUxhYmVsID0gc3ZnLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY291bnRyeS1sYWJlbCcpXG4gICAgICAuYXR0cigneScsIGhlaWdodCszNilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuXG4gICAgLy8gTVBSIExpbmVcbiAgICAkbXByTGluZSA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ21wci1saW5lJylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwICcgKyB5KDEpICsgJyknKTtcbiAgICAkbXByTGluZS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgMClcbiAgICAgIC5hdHRyKCd5MScsIDApXG4gICAgICAuYXR0cigneDInLCB3aWR0aClcbiAgICAgIC5hdHRyKCd5MicsIDApO1xuICAgICRtcHJMaW5lLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigneCcsIC04KVxuICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAudGV4dCgnTVBSJyk7XG5cbiAgICAvLyBNb3VzZSBldmVudHMgb3ZlcmxheVxuICAgICRvdmVybGF5ID0gc3ZnLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KTtcblxuICAgIC8vIFNldHVwIENpcmNsZXNcbiAgICBzdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdkb3RzJylcbiAgICAuc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5kYXRhKCBjdXJyZW50RGF0YSApXG4gICAgLmVudGVyKCkuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgLmF0dHIoJ2lkJywgc2V0SWQpXG4gICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7IHJldHVybiAnZG90JytzZXRDbGFzcyhkKTsgfSlcbiAgICAgIC5hdHRyKCdyJywgRE9UX1JBRElVUylcbiAgICAgIC5hdHRyKCdjeCcsIHNldFZhbHVlWClcbiAgICAgIC5hdHRyKCdjeScsIHNldFZhbHVlWSlcbiAgICAgIC5zdHlsZSgndmlzaWJpbGl0eScsIHNldFZpc2liaWxpdHkpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCBET1RfT1BBQ0lUWSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHNldENvbG9yKTtcblxuICAgICRkb3RzID0gZDMuc2VsZWN0QWxsKCcuZG90Jyk7XG5cbiAgICAvLyBTZXR1cCBMaW5lc1xuICAgICRsaW5lcyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2RvdC1saW5lcycpO1xuXG4gICAgLy8gQWRkIFggQXhpcyBBcmVhc1xuICAgIHNldFhBeGlzQXJlYSggdHJ1ZSApO1xuXG4gICAgLy8gQWRkIEV2ZW50c1xuICAgICRvdmVybGF5XG4gICAgICAub24oJ21vdXNlb3V0Jywgb25PdmVybGF5T3V0KVxuICAgICAgLm9uKCdtb3VzZW1vdmUnLCBvbk92ZXJsYXlNb3ZlKVxuICAgICAgLm9uKCdjbGljaycsIHJlc2V0RG90Q2xpY2tlZCk7XG5cbiAgICAvLyBBZGQgZG90IGV2ZW50c1xuICAgICRkb3RzXG4gICAgICAub24oJ21vdXNlb3ZlcicsIG9uRG90T3ZlciApXG4gICAgICAub24oJ21vdXNlb3V0Jywgb25Eb3RPdXQgKTtcbiAgfTtcblxuICB2YXIgdXBkYXRlRGF0YSA9IGZ1bmN0aW9uKCBfZGF0YSwgX3R5cGUgKXtcblxuICAgIF9kYXRhID0gdHlwZW9mIF9kYXRhICE9PSAndW5kZWZpbmVkJyA/IF9kYXRhIDogZmFsc2U7XG4gICAgX3R5cGUgPSB0eXBlb2YgX3R5cGUgIT09ICd1bmRlZmluZWQnID8gX3R5cGUgOiBmYWxzZTtcblxuICAgIC8vIFNldHVwIGN1cnJlbnQgZGF0YVxuICAgIGlmKCBfZGF0YSAmJiBfdHlwZSApe1xuICAgICAgaWYgKGN1cnJlbnQuZGF0YSA9PT0gX2RhdGEgJiYgY3VycmVudC50eXBlID09PSBfdHlwZSkge1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQuZGF0YSA9IF9kYXRhO1xuICAgICAgICBjdXJyZW50LnR5cGUgPSBfdHlwZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGN1cnJlbnQuZGF0YSA9ICQoJyNtcHItYnRuJykuaGFzQ2xhc3MoJ2FjdGl2ZScpID8gJ3ByaWNlcycgOiAnYWZmb3JkYWJpbGl0eSc7XG4gICAgICBjdXJyZW50LnR5cGUgPSAkKCcjcHVibGljLWJ0bicpLmhhc0NsYXNzKCdhY3RpdmUnKSA/ICdwdWJsaWMnIDogJ3ByaXZhdGUnO1xuICAgIH1cblxuICAgIGlmKCAhaW5pdGlhbGl6ZWQgKXsgcmV0dXJuIHRoYXQ7IH1cblxuICAgIGN1cnJlbnQubGFiZWwgPSAoY3VycmVudC5kYXRhID09PSAncHJpY2VzJykgPyAnUHJpY2UnIDogKChjdXJyZW50LnR5cGUgPT09ICdwdWJsaWMnKSA/ICdQdWJsaWMgc2VjdG9yIC0gbnVtYmVyIG9mIGRheXMnIDogJ1ByaXZhdGUgc2VjdG9yIC0gbnVtYmVyIG9mIGRheXMnKTtcblxuICAgIHJlc2V0RG90Q2xpY2tlZCgpO1xuXG4gICAgLy8gU2V0IHRpdGxlXG4gICAgaWYoICFfZGF0YSB8fCAhX3R5cGUgKXtcbiAgICAgICRtZW51LmZpbmQoJ2g0JykuaGlkZSgpO1xuICAgICAgJG1lbnUuZmluZCgnLicrY3VycmVudC5kYXRhKyctJytjdXJyZW50LnR5cGUpLnNob3coKTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbSxcbiAgICAgICAgY3VycmVudERhdGEgPSBnZXRDdXJyZW50RGF0YSgpO1xuXG4gICAgaWYgKGN1cnJlbnQuZGF0YSA9PT0gJ3ByaWNlcycpIHtcbiAgICAgIHlBeGlzLnRpY2tGb3JtYXQodGlja0Zvcm1hdFByaWNlcyk7XG4gICAgICBkMy5zZWxlY3QoJy55LWxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeUF4aXMudGlja0Zvcm1hdCh0aWNrRm9ybWF0QWZmb3JkYWJpbGl0eSk7XG4gICAgICBkMy5zZWxlY3QoJy55LWxhYmVsJylcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICB9XG5cbiAgICB5LmRvbWFpbiggZDMuZXh0ZW50KGN1cnJlbnREYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkWyBjdXJyZW50LmxhYmVsIF07IH0pICkubmljZSgpO1xuXG4gICAgJHlBeGlzLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKS5lYXNlKGQzLmVhc2VTaW5Jbk91dCkuY2FsbCh5QXhpcyk7XG5cbiAgICBpZiAoY3VycmVudC5kYXRhID09PSAncHJpY2VzJykge1xuICAgICAgJG1wckxpbmVcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwICcgKyB5KDEpICsgJyknKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJG1wckxpbmVcbiAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCB2aXNpYmlsaXR5IGZvciBhbGwgZG90cyAmIGxpbmVzXG4gICAgJGRvdHMuc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG5cbiAgICBjdXJyZW50RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpe1xuXG4gICAgICBpdGVtID0gc3ZnLnNlbGVjdCgnLmRvdCcrZ2V0Q2xhc3MoZCkpO1xuXG4gICAgICAvLyBVcGRhdGUgaXRlbVxuICAgICAgaWYgKCFpdGVtLmVtcHR5KCkpIHtcblxuICAgICAgICBpdGVtLmRhdHVtKGQpXG4gICAgICAgICAgLnN0eWxlKCd2aXNpYmlsaXR5Jywgc2V0VmlzaWJpbGl0eSlcbiAgICAgICAgICAudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgLmF0dHIoJ2N4Jywgc2V0VmFsdWVYKVxuICAgICAgICAgIC5hdHRyKCdjeScsIHNldFZhbHVlWSk7XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgaXRlbVxuICAgICAgZWxzZXtcblxuICAgICAgICAvLyBTZXR1cCBDaXJjbGVzXG4gICAgICAgIGQzLnNlbGVjdCgnLmRvdHMnKVxuICAgICAgICAgIC5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAgICAgLmRhdHVtKGQpXG4gICAgICAgICAgLmF0dHIoJ2lkJywgc2V0SWQpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gJ2RvdCcrc2V0Q2xhc3MoZCk7IH0pXG4gICAgICAgICAgLmF0dHIoJ3InLCBET1RfUkFESVVTKVxuICAgICAgICAgIC5hdHRyKCdjeCcsIHNldFZhbHVlWClcbiAgICAgICAgICAuYXR0cignY3knLCBzZXRWYWx1ZVkpXG4gICAgICAgICAgLnN0eWxlKCd2aXNpYmlsaXR5Jywgc2V0VmlzaWJpbGl0eSlcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBET1RfT1BBQ0lUWSlcbiAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBzZXRDb2xvcilcbiAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIG9uRG90T3ZlciApXG4gICAgICAgICAgLm9uKCdtb3VzZW91dCcsIG9uRG90T3V0ICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkZG90cyA9IGQzLnNlbGVjdEFsbCgnLmRvdCcpO1xuXG4gICAgcmV0dXJuIHRoYXQ7XG4gIH07XG5cbiAgdmFyIHNldHVwTWVudUJ0bnMgPSBmdW5jdGlvbigpe1xuXG4gICAgLy8gTVBSL0FmZm9yZGFiaWxpdHkgQnRuc1xuICAgICQoJyNtcHItYnRuLCAjYWZmb3JkYWJpbGl0eS1idG4nKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgIGlmKCAkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSApeyByZXR1cm47IH1cbiAgICAgICQoJyNtcHItYnRuLCAjYWZmb3JkYWJpbGl0eS1idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIHVwZGF0ZURhdGEoKTtcbiAgICB9KTtcblxuICAgIC8vIFB1YmxpYy9Qcml2YXRlIEJ0bnNcbiAgICAkKCcjcHVibGljLWJ0biwgI3ByaXZhdGUtYnRuJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICBpZiggJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykgKXsgcmV0dXJuOyB9XG4gICAgICAkKCcjcHVibGljLWJ0biwgI3ByaXZhdGUtYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB1cGRhdGVEYXRhKCk7XG4gICAgfSk7XG5cbiAgICAvLyBPcmRlciBCdG5zXG4gICAgJCgnI2FyZWEtYnRuLCAjcGliLWJ0bicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpICl7IHJldHVybjsgfVxuICAgICAgJCgnI2FyZWEtYnRuLCAjcGliLWJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgcmVvcmRlckRhdGEoKTtcbiAgICB9KTtcblxuICAgICRyZWdpb25Ecm9wZG93bklucHV0cy5jaGFuZ2UoZnVuY3Rpb24oZSl7IGZpbHRlckJ5UmVnaW9uKCk7IH0pO1xuXG4gICAgJGRydWdEcm9wZG93bklucHV0cy5jaGFuZ2UoIGZpbHRlckJ5RHJ1ZyApO1xuICB9O1xuXG4gIHZhciByZW9yZGVyRGF0YSA9IGZ1bmN0aW9uKCl7XG5cbiAgICBjdXJyZW50Lm9yZGVyID0gJCgnI2FyZWEtYnRuJykuaGFzQ2xhc3MoJ2FjdGl2ZScpID8gJ2FyZWEnIDogJ3BpYic7XG5cbiAgICAvLyBPcmRlciBDb3VudHJpZXNcbiAgICBpZiAoY3VycmVudC5vcmRlciA9PT0gJ2FyZWEnKSB7XG4gICAgICByZW9yZGVyQ291bnRyaWVzQnlBcmVhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFDb3VudHJpZXMuc29ydChmdW5jdGlvbih4LCB5KXtcbiAgICAgICAgcmV0dXJuIGQzLmFzY2VuZGluZygreC5QSUIsICt5LlBJQik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNldERvdENsaWNrZWQoKTtcblxuICAgIC8vIFVwZGF0ZSBYIEF4aXNcbiAgICB4LmRvbWFpbiggZGF0YUNvdW50cmllcy5tYXAoZnVuY3Rpb24oZCl7IHJldHVybiBkLkNvZGU7IH0pICk7XG5cbiAgICAkeEFyZWEuZmFkZU91dCgpO1xuICAgIHNldFRpbWVvdXQoIHNldFhBeGlzQXJlYSwgMTIwMCApO1xuXG4gICAgdmFyIHRyYW5zaXRpb24gPSBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKDEwMDApO1xuICAgIFxuICAgIHRyYW5zaXRpb24uc2VsZWN0QWxsKCcuZG90JylcbiAgICAgIC5hdHRyKCdjeCcsIHNldFZhbHVlWCk7XG5cbiAgICB0cmFuc2l0aW9uLnNlbGVjdCgnLnguYXhpcycpXG4gICAgICAuY2FsbCh4QXhpcylcbiAgICAgIC5zZWxlY3RBbGwoJ2cnKTtcblxuICAgIHJldHVybiB0aGF0O1xuICB9O1xuXG4gIHZhciByZW9yZGVyQ291bnRyaWVzQnlBcmVhID0gZnVuY3Rpb24oKXtcbiAgICBkYXRhQ291bnRyaWVzLnNvcnQoZnVuY3Rpb24oeCwgeSl7XG4gICAgICBpZiAoeC5BcmVhID09PSB5LkFyZWEpe1xuICAgICAgICByZXR1cm4gZDMuYXNjZW5kaW5nKHhbJ0NvdW50cnlfJytsYW5nXSwgeVsnQ291bnRyeV8nK2xhbmddKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkMy5hc2NlbmRpbmcoeC5BcmVhLCB5LkFyZWEpO1xuICAgIH0pO1xuICB9O1xuICBcbiAgdmFyIGZpbHRlckJ5UmVnaW9uID0gZnVuY3Rpb24oIF9yZWdpb25zICl7XG5cbiAgICB2YXIgcmVnaW9ucyA9ICcnO1xuXG4gICAgaWYoIF9yZWdpb25zKXtcblxuICAgICAgcmVnaW9ucyA9IF9yZWdpb25zO1xuXG4gICAgfSBlbHNle1xuXG4gICAgICAkcmVnaW9uRHJvcGRvd25JbnB1dHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICBpZiggJCh0aGlzKS5pcygnOmNoZWNrZWQnKSApe1xuICAgICAgICAgIHJlZ2lvbnMgKz0gJCh0aGlzKS5hdHRyKCduYW1lJykrJyAnO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gU2VsZWN0IGFsbCByZWdpb25zIGlmIHRoZXJlJ3Mgbm8gb25lXG4gICAgICBpZiAocmVnaW9ucyA9PT0gJycpIHtcbiAgICAgICAgJHJlZ2lvbkRyb3Bkb3duSW5wdXRzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2NoZWNrZWQnLHRydWUpO1xuICAgICAgICAgIHJlZ2lvbnMgKz0gJCh0aGlzKS5hdHRyKCduYW1lJykrJyAnO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGaWx0ZXIgQ291bnRyaWVzXG4gICAgZGF0YUNvdW50cmllcyA9IGRhdGFDb3VudHJpZXNBbGwuZmlsdGVyKGZ1bmN0aW9uKGQpe1xuICAgICAgcmV0dXJuIHJlZ2lvbnMuaW5kZXhPZiggZC5BcmVhICkgPiAtMTtcbiAgICB9KTtcblxuICAgIC8vIFJlb3JkZXIgQ291bnRyaWVzIGlmIG9yZGVyIGlzIFBJQlxuICAgIGlmIChjdXJyZW50Lm9yZGVyID09PSAncGliJykge1xuICAgICAgZGF0YUNvdW50cmllcy5zb3J0KGZ1bmN0aW9uKHgsIHkpe1xuICAgICAgICByZXR1cm4gZDMuYXNjZW5kaW5nKCt4LlBJQiwgK3kuUElCKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBYIEF4aXNcbiAgICAkeEFyZWEuZmFkZU91dCgpO1xuICAgIHNldFRpbWVvdXQoIHNldFhBeGlzQXJlYSwgMTIwMCApO1xuICAgIFxuICAgIHguZG9tYWluKCBkYXRhQ291bnRyaWVzLm1hcChmdW5jdGlvbihkKXsgcmV0dXJuIGQuQ29kZTsgfSkgKTtcblxuICAgICRkb3RzLnN0eWxlKCd2aXNpYmlsaXR5Jywgc2V0VmlzaWJpbGl0eSk7XG4gICBcbiAgICByZXNldERvdENsaWNrZWQoKTtcblxuICAgIHZhciB0cmFuc2l0aW9uID0gc3ZnLnRyYW5zaXRpb24oKS5kdXJhdGlvbigxMDAwKTtcbiAgXG4gICAgdHJhbnNpdGlvbi5zZWxlY3RBbGwoJy5kb3QnKVxuICAgICAgLmF0dHIoJ2N4Jywgc2V0VmFsdWVYKTtcblxuICAgIHRyYW5zaXRpb24uc2VsZWN0KCcueC5heGlzJylcbiAgICAgIC5jYWxsKHhBeGlzKVxuICAgICAgLnNlbGVjdEFsbCgnZycpO1xuICB9O1xuXG4gIHZhciBmaWx0ZXJCeURydWcgPSBmdW5jdGlvbigpe1xuXG4gICAgZHJ1Z3NGaWx0ZXJlZCA9ICcnO1xuXG4gICAgLy8gQ2hlY2sgQWxsXG4gICAgaWYgKCQodGhpcykuYXR0cignbmFtZScpID09PSAnQWxsJykge1xuICAgICAgaWYgKCQodGhpcykuYXR0cignY2hlY2tlZCcpKSB7XG4gICAgICAgICRkcnVnRHJvcGRvd25JbnB1dHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICQodGhpcykuYXR0cignY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGRydWdEcm9wZG93bklucHV0cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJCh0aGlzKS5hdHRyKCdjaGVja2VkJyxmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkZHJ1Z0Ryb3Bkb3duSW5wdXRzLmZpbHRlcignW25hbWU9XCJBbWl0cmlwdHlsaW5lXCJdJykuYXR0cignY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldCBBbGwgQ2hlY2tib3ggXG4gICAgICBpZiAoJCh0aGlzKS5hdHRyKCdjaGVja2VkJykgJiYgJGRydWdEcm9wZG93bklucHV0cy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoID09PSAkZHJ1Z0Ryb3Bkb3duSW5wdXRzLmxlbmd0aC0xKSB7XG4gICAgICAgICRkcnVnRHJvcGRvd25JbnB1dHMuZmlsdGVyKCdbbmFtZT1cIkFsbFwiXScpLmF0dHIoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRkcnVnRHJvcGRvd25JbnB1dHMuZmlsdGVyKCdbbmFtZT1cIkFsbFwiXScpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJGRydWdEcm9wZG93bklucHV0cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICBpZiggJCh0aGlzKS5pcygnOmNoZWNrZWQnKSApe1xuICAgICAgICBkcnVnc0ZpbHRlcmVkICs9ICQodGhpcykuYXR0cignbmFtZScpKycgJztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNlbGVjdCBhbGwgcmVnaW9ucyBpZiB0aGVyZSdzIG5vIG9uZVxuICAgIGlmIChkcnVnc0ZpbHRlcmVkID09PSAnJykge1xuICAgICAgZHJ1Z3NGaWx0ZXJlZCA9IGRydWdzRmlsdGVyZWRBbGw7XG4gICAgICAkZHJ1Z0Ryb3Bkb3duSW5wdXRzLmVhY2goZnVuY3Rpb24oKXsgJCh0aGlzKS5hdHRyKCdjaGVja2VkJyx0cnVlKTsgfSk7XG4gICAgfVxuXG4gICAgcmVzZXREb3RDbGlja2VkKCk7XG5cbiAgICAkZG90cy5zdHlsZSgndmlzaWJpbGl0eScsIHNldFZpc2liaWxpdHkpO1xuICB9O1xuXG4gIHZhciBvbkRvdE92ZXIgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGl0ZW0gPSBkMy5zZWxlY3QodGhpcyk7XG5cbiAgICAkZG90cy5vbignY2xpY2snLCBvbkRvdENsaWNrICk7XG5cbiAgICAvLyBVcGRhdGUgZG90c1xuICAgICRkb3RzXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkMy5zZWxlY3QodGhpcykuYXR0cignaWQnKSAhPT0gZG90Q2xpY2tlZCkgPyBET1RfR1JBWSA6IGNvbG9yKGQuRHJ1Zyk7IH0pXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkMy5zZWxlY3QodGhpcykuYXR0cignaWQnKSAhPT0gZG90Q2xpY2tlZCkgPyBET1RfT1BBQ0lUWSA6IDE7IH0pO1xuXG4gICAgc3ZnLnNlbGVjdEFsbCgnLmRvdC5kcnVnLScraXRlbS5hdHRyKCdpZCcpKVxuICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCkgeyByZXR1cm4gY29sb3IoZC5EcnVnKTsgfSkuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgIHZhciBkcnVnRGF0YSA9IGdldEN1cnJlbnREYXRhKCk7XG4gICAgZHJ1Z0RhdGEgPSBkcnVnRGF0YS5maWx0ZXIoZnVuY3Rpb24oZSl7IHJldHVybiBuaWNlTmFtZShlLkRydWcpID09PSBpdGVtLmF0dHIoJ2lkJyk7IH0pO1xuXG4gICAgLy8gU2V0dXAgbGluZXNcbiAgICBpZiAoZG90Q2xpY2tlZCA9PT0gbnVsbCkge1xuICAgICAgJGxpbmVzLnNlbGVjdEFsbCgnLmxpbmUnKVxuICAgICAgICAuZGF0YSggZHJ1Z0RhdGEgKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgICAgICAgLmF0dHIoJ2lkJywgc2V0SWQpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuICdsaW5lJytzZXRDbGFzcyhkKTsgfSlcbiAgICAgICAgLmF0dHIoJ3gxJywgc2V0VmFsdWVYKVxuICAgICAgICAuYXR0cigneTEnLCBoZWlnaHQpXG4gICAgICAgIC5hdHRyKCd4MicsIHNldFZhbHVlWClcbiAgICAgICAgLmF0dHIoJ3kyJywgc2V0VmFsdWVZKVxuICAgICAgICAuc3R5bGUoJ3Zpc2liaWxpdHknLCBzZXRWaXNpYmlsaXR5KVxuICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHNldENvbG9yKTtcbiAgICB9XG4gICAgXG4gICAgLy8gU2V0IGN1cnJlbnQgdGljayBhY3RpdmVcbiAgICB2YXIgeFBvcyA9IGQzLm1vdXNlKHRoaXMpWzBdLFxuICAgICAgICB3ID0gd2lkdGggLyAoeC5kb21haW4oKS5sZW5ndGgtMSk7XG4gICAgdmFyIGogPSBNYXRoLnJvdW5kKCB4UG9zL3cgKTtcbiAgICAkeEF4aXMuc2VsZWN0QWxsKCcudGljazpudGgtY2hpbGQoJysoaisyKSsnKSB0ZXh0JykuYXR0cignY2xhc3MnLCAnYWN0aXZlJyk7XG5cbiAgICAvLyBTaG93IGNvdW50cnkgbWFya2VyIGxhYmVsc1xuICAgICRjb3VudHJ5TGFiZWwuc3R5bGUoJ29wYWNpdHknLCAxKTtcblxuICAgIC8vIFNldCBzZWxlY3RlZCBkb3RzIG9uIHRvcFxuICAgICRkb3RzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiAoIGl0ZW0uYXR0cignaWQnKSA9PT0gbmljZU5hbWUoYS5EcnVnKSApID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgc2V0VG9vbHRpcCggaXRlbSApO1xuICB9O1xuXG4gIHZhciBzZXRUb29sdGlwID0gZnVuY3Rpb24oIGl0ZW0gKXtcblxuICAgIGl0ZW0gPSAoIHRvb2x0aXBJdGVtICkgPyB0b29sdGlwSXRlbSA6IGl0ZW07XG5cbiAgICBpZiggIWl0ZW0gKSByZXR1cm47XG5cbiAgICB2YXIgZGF0YSA9ICtpdGVtLmRhdGEoKVswXVsgY3VycmVudC5sYWJlbCBdO1xuICAgIHZhciBkYXRhSWNvbiA9IChjdXJyZW50LmRhdGEgIT09ICdwcmljZXMnKSA/ICdnbHlwaGljb24tdGltZScgOiAoIChkYXRhIDwgMSkgPyAnZ2x5cGhpY29uLWFycm93LWRvd24nIDogJ2dseXBoaWNvbi1hcnJvdy11cCcgKTtcblxuICAgICR0b29sdGlwLmZpbmQoJy5jb3VudHJ5JykuaHRtbCggZ2V0Q291bnRyeURhdGEoIGl0ZW0uZGF0YSgpWzBdLkNvdW50cnkgKVswXVsnUmVnaW9uXycrbGFuZ10gKTtcbiAgICAkdG9vbHRpcC5maW5kKCcueWVhcicpLmh0bWwoICcoJytpdGVtLmRhdGEoKVswXS5ZZWFyKycpJyApO1xuICAgICR0b29sdGlwLmZpbmQoJy5kcnVnLCAuZ3JlZW4gLmdseXBoaWNvbiwgLmdyZWVuIC50eHQnKS5oaWRlKCk7XG4gICAgJHRvb2x0aXAuZmluZCgnLmRydWctJytpdGVtLmRhdGEoKVswXS5EcnVnLnRvTG93ZXJDYXNlKCkpLnNob3coKTtcbiAgICAkdG9vbHRpcC5maW5kKCcuZ3JlZW4gLicrZGF0YUljb24pLnNob3coKTtcblxuICAgIGlmKCBkYXRhICE9PSAwICl7XG4gICAgICAkdG9vbHRpcC5maW5kKCcucHJpY2UnKS5odG1sKCBuaWNlRGF0YShkYXRhKSApO1xuICAgICAgJHRvb2x0aXAuZmluZCgnLmdyZWVuIC4nK2N1cnJlbnQuZGF0YSsnLXR4dCcpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRvb2x0aXAuZmluZCgnLnByaWNlJykuaHRtbCggJ2dyYXRpcycgKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudC5kYXRhICE9PSAncHJpY2VzJyAmJiBkYXRhIDwgMSAmJiBkYXRhICE9PSAwKSB7XG4gICAgICB2YXIgaCA9IE1hdGgucm91bmQoZGF0YSo4KTtcbiAgICAgIGlmIChoID4gMCkge1xuICAgICAgICAkdG9vbHRpcC5maW5kKCcuYWZmb3JkYWJpbGl0eS10eHQtaG91cicpLmh0bWwoICcgICgnK2grJyAnK3R4dFtsYW5nXS5ob3JhcysnKScgKS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdG9vbHRpcC5maW5kKCcuYWZmb3JkYWJpbGl0eS10eHQtaG91cicpLmh0bWwoICcgICgnK3R4dFtsYW5nXS5tZW5vc2hvcmErJyknICkuc2hvdygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsZWZ0ID0gaXRlbS5hdHRyKCdjeCcpID4gd2lkdGgqMC41O1xuICAgIHZhciB0b3AgPSBNYXRoLnJvdW5kKGl0ZW0uYXR0cignY3knKSk7XG5cbiAgICBpZiggbGVmdCApe1xuICAgICAgJHRvb2x0aXAuYWRkQ2xhc3MoJ2xlZnQnKS5jc3MoeydyaWdodCc6ICh3aWR0aENvbnQtTWF0aC5yb3VuZChpdGVtLmF0dHIoJ2N4JykpLW1hcmdpbi5sZWZ0KSsncHgnLCAnbGVmdCc6ICdhdXRvJ30pO1xuICAgIH0gZWxzZXtcbiAgICAgICR0b29sdGlwLnJlbW92ZUNsYXNzKCdsZWZ0JykuY3NzKHsncmlnaHQnOiAnYXV0bycsICdsZWZ0JzogKE1hdGgucm91bmQoaXRlbS5hdHRyKCdjeCcpKSttYXJnaW4ubGVmdCkrJ3B4J30pO1xuICAgIH1cblxuICAgIGlmICh0b3AgPiA2MCl7XG4gICAgICAkdG9vbHRpcC5yZW1vdmVDbGFzcygndG9wJykuY3NzKHsndG9wJzogKHRvcCttYXJnaW4udG9wLTgtKCR0b29sdGlwLmhlaWdodCgpKjAuNSkpKydweCcsICdvcGFjaXR5JzogJzEnfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0b29sdGlwLmFkZENsYXNzKCd0b3AnKS5jc3Moeyd0b3AnOiAodG9wK21hcmdpbi50b3AtMTgpKydweCcsICdvcGFjaXR5JzogJzEnfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBzZXRUb29sdGlwT25Ub3VyID0gZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG4gICAgJHRvb2x0aXAuY3NzKCdvcGFjaXR5JywgJzAnKTtcbiAgICB0b29sdGlwSXRlbSA9IGQzLnNlbGVjdChzZWxlY3Rpb24pO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChzZXRUb29sdGlwLCAxMjAwKTtcbiAgfTtcblxuICB2YXIgb25Eb3RPdXQgPSBmdW5jdGlvbigpe1xuXG4gICAgJGRvdHMub24oJ2NsaWNrJywgbnVsbCApO1xuXG4gICAgaWYgKGRvdENsaWNrZWQgPT09IG51bGwpIHtcbiAgICAgICRkb3RzXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIGZ1bmN0aW9uKGQpeyByZXR1cm4gY29sb3IoZC5EcnVnKTsgfSlcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgRE9UX09QQUNJVFkpO1xuXG4gICAgICAkbGluZXMuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJGRvdHNcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgZnVuY3Rpb24oZCl7IHJldHVybiAoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2lkJykgIT09IGRvdENsaWNrZWQpID8gRE9UX0dSQVkgOiBjb2xvcihkLkRydWcpOyB9KVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCBmdW5jdGlvbihkKXsgcmV0dXJuIChkMy5zZWxlY3QodGhpcykuYXR0cignaWQnKSAhPT0gZG90Q2xpY2tlZCkgPyBET1RfT1BBQ0lUWSA6IDE7IH0pO1xuICAgIH1cbiAgXG4gICAgJHRvb2x0aXAuY3NzKHsnb3BhY2l0eSc6ICcwJywgJ3JpZ2h0JzogJ2F1dG8nLCAnbGVmdCc6ICctMTAwMHB4J30pO1xuICB9O1xuXG4gIHZhciBvbkRvdENsaWNrID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpZCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgIGRvdENsaWNrZWQgPSAoIGlkICE9PSBkb3RDbGlja2VkICkgPyBpZCA6IG51bGw7XG4gIH07XG5cbiAgdmFyIG9uT3ZlcmxheU1vdmUgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHhQb3MgPSBkMy5tb3VzZSh0aGlzKVswXSxcbiAgICAgICAgdyA9IHdpZHRoIC8gKHguZG9tYWluKCkubGVuZ3RoLTEpO1xuXG4gICAgdmFyIGogPSBNYXRoLnJvdW5kKCB4UG9zL3cgKTtcblxuICAgIGlmKCBvdmVybGF5Q29kZSA9PT0gaiApeyByZXR1cm4gdGhhdDsgfVxuXG4gICAgb3ZlcmxheUNvZGUgPSB4LmRvbWFpbigpW2pdO1xuXG4gICAgJGNvdW50cnlNYXJrZXJcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnKyB4KG92ZXJsYXlDb2RlKSArJyAwKScpO1xuXG4gICAgdmFyIGNvdW50cnlEYXRhID0gZGF0YUNvdW50cmllcy5maWx0ZXIoZnVuY3Rpb24oZCl7IHJldHVybiBkLkNvZGUgPT09IG92ZXJsYXlDb2RlOyB9KTtcblxuICAgICR4QXhpcy5zZWxlY3RBbGwoJy50aWNrIHRleHQnKS5hdHRyKCdjbGFzcycsICcnKTtcbiAgICAkeEF4aXMuc2VsZWN0QWxsKCcudGljazpudGgtY2hpbGQoJysoaisyKSsnKSB0ZXh0JykuYXR0cignY2xhc3MnLCAnYWN0aXZlJyk7XG5cbiAgICAkY291bnRyeUxhYmVsXG4gICAgICAuYXR0cigneCcsIHgob3ZlcmxheUNvZGUpKSAgLy8tNilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAudGV4dCggY291bnRyeURhdGFbMF1bJ0NvdW50cnlfJytsYW5nXSApO1xuICB9O1xuXG4gIHZhciBvbk92ZXJsYXlPdXQgPSBmdW5jdGlvbigpe1xuXG4gICAgb3ZlcmxheUNvZGUgPSBudWxsO1xuICAgICRjb3VudHJ5TWFya2VyLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gICAgJGNvdW50cnlMYWJlbC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICR4QXhpcy5zZWxlY3RBbGwoJy50aWNrIHRleHQnKS5hdHRyKCdjbGFzcycsICcnKTtcbiAgfTtcblxuICB2YXIgcmVzZXREb3RDbGlja2VkID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoZG90Q2xpY2tlZCAhPT0gbnVsbCkge1xuICAgICAgZG90Q2xpY2tlZCA9IG51bGw7XG4gICAgICAkbGluZXMuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG4gICAgICAkZG90c1xuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXsgcmV0dXJuIGNvbG9yKGQuRHJ1Zyk7IH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIERPVF9PUEFDSVRZKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG5pY2VOYW1lID0gZnVuY3Rpb24oIGRydWcgKSB7XG4gICAgcmV0dXJuIGRydWcudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bICssXFwvXS9nLCctJyk7XG4gIH07XG5cbiAgdmFyIG5pY2VEYXRhID0gZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgcmV0dXJuIChsYW5nICE9PSAnZXMnKSA/IGRhdGEudG9GaXhlZCgyKSA6IGRhdGEudG9GaXhlZCgyKS50b1N0cmluZygpLnJlcGxhY2UoL1xcLi9nLCcsJyk7XG4gIH07XG5cbiAgdmFyIHNldElkID0gZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBuaWNlTmFtZShkLkRydWcpO1xuICB9O1xuXG4gIHZhciBnZXRDbGFzcyA9IGZ1bmN0aW9uKGQpIHtcbiAgIHJldHVybiAnLmNvdW50cnktJyArIG5pY2VOYW1lKGQuQ291bnRyeSkgKyAnLmRydWctJyArIG5pY2VOYW1lKGQuRHJ1Zyk7XG4gIH07XG5cbiAgdmFyIHNldENsYXNzID0gZnVuY3Rpb24oZCkge1xuICAgcmV0dXJuICcgY291bnRyeS0nICsgbmljZU5hbWUoZC5Db3VudHJ5KSArICcgZHJ1Zy0nICsgbmljZU5hbWUoZC5EcnVnKTtcbiAgfTtcblxuICB2YXIgc2V0VmFsdWVYID0gZnVuY3Rpb24oZCkge1xuICAgIHZhciBjb3VudHJ5RGF0YSA9IGdldENvdW50cnlEYXRhKGQuQ291bnRyeSk7XG4gICAgcmV0dXJuICggY291bnRyeURhdGEubGVuZ3RoID4gMCApID8geChjb3VudHJ5RGF0YVswXS5Db2RlKSA6IDA7XG4gIH07XG5cbiAgdmFyIHNldFZhbHVlWSA9IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gKGRbIGN1cnJlbnQubGFiZWwgXSAhPT0gbnVsbCkgPyB5KGRbIGN1cnJlbnQubGFiZWwgXSkgOiBoZWlnaHQ7XG4gIH07XG5cbiAgdmFyIHNldFZpc2liaWxpdHkgPSBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIChkWyBjdXJyZW50LmxhYmVsIF0gIT09IG51bGwgJiYgZHJ1Z3NGaWx0ZXJlZC5pbmRleE9mKCBkLkRydWcgKSA+IC0xICYmIGRhdGFDb3VudHJpZXMuc29tZShmdW5jdGlvbihlKXsgcmV0dXJuIGUuUmVnaW9uX2VuID09PSBkLkNvdW50cnk7IH0pICkgPyAndmlzaWJsZScgOiAnaGlkZGVuJztcbiAgfTtcblxuICB2YXIgc2V0Q29sb3IgPSBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIGNvbG9yKGQuRHJ1Zyk7XG4gIH07XG5cbiAgdmFyIGdldEN1cnJlbnREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChjdXJyZW50LmRhdGEgPT09ICdhZmZvcmRhYmlsaXR5JykgPyBkYXRhQWZmb3JkYWJpbGl0eSA6ICgoY3VycmVudC50eXBlID09PSAncHVibGljJykgPyBkYXRhUHJpY2VzUHVibGljIDogZGF0YVByaWNlc1ByaXZhdGUpO1xuICB9O1xuXG4gIHZhciBnZXRDb3VudHJ5RGF0YSA9IGZ1bmN0aW9uKCByZWdpb24gKSB7XG4gICAgcmV0dXJuIGRhdGFDb3VudHJpZXMuZmlsdGVyKGZ1bmN0aW9uKGUpeyByZXR1cm4gZS5SZWdpb25fZW4gPT09IHJlZ2lvbjsgfSk7XG4gIH07XG5cbiAgdmFyIGdldENvdW50cnlEYXRhQnlDb2RlID0gZnVuY3Rpb24oIGNvZGUgKSB7XG4gICAgcmV0dXJuIGRhdGFDb3VudHJpZXMuZmlsdGVyKGZ1bmN0aW9uKGUpeyByZXR1cm4gZS5Db2RlID09PSBjb2RlOyB9KTtcbiAgfTtcblxuICB2YXIgc2V0WEF4aXNBcmVhID0gZnVuY3Rpb24oIGluaXQgKXtcbiAgICBcbiAgICB2YXIgdGVtcCA9IG51bGwsIGMgPSBudWxsLCB4cG9zID0gMCwgbGFiZWwsICRpdGVtO1xuXG4gICAgaWYoIGluaXQgKXtcbiAgICAgICR4QXJlYSA9ICQoJzx1bCBjbGFzcz1cIngtYXJlYVwiPjwvdWw+Jyk7XG4gICAgICAkZWwuYXBwZW5kKCAkeEFyZWEgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHhBcmVhLmZpbmQoJ2xpJykucmVtb3ZlKCk7XG4gICAgICAkeEFyZWEuZmFkZUluKCk7XG4gICAgfVxuICAgIFxuICAgIGxhYmVsID0gKGN1cnJlbnQub3JkZXIgPT09ICdhcmVhJykgPyAnQXJlYScgOiAnUElCX0FyZWEnO1xuICAgIFxuICAgIGQzLnNlbGVjdEFsbCgnLnguYXhpcyAudGljayB0ZXh0JykuZWFjaChmdW5jdGlvbihkKXtcbiAgICAgIGMgPSBnZXRDb3VudHJ5RGF0YUJ5Q29kZSggZCApO1xuICAgICAgaWYgKGNbMF0gJiYgdGVtcCAhPT0gY1swXVtsYWJlbF0pIHtcbiAgICAgICAgdGVtcCA9IGNbMF1bbGFiZWxdO1xuICAgICAgICAkeEFyZWEuZmluZCgnbGknKS5sYXN0KCkuY3NzKCd3aWR0aCcsICgxMDAqKHgoY1swXS5Db2RlKS14cG9zKS93aWR0aCkrJyUnICk7XG4gICAgICAgIHhwb3MgPSB4KGNbMF0uQ29kZSk7XG4gICAgICAgICRpdGVtID0gJCgnPGxpPicrdHh0W2xhbmddW3RlbXBdKyc8L2xpPicpO1xuICAgICAgICAkeEFyZWEuYXBwZW5kKCAkaXRlbSApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgICR4QXJlYS5maW5kKCdsaScpLmxhc3QoKS5jc3MoJ3dpZHRoJywgKDEwMCooeChjWzBdLkNvZGUpLXhwb3MpL3dpZHRoKSsnJScgKTtcbiAgfTtcblxuICB2YXIgc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHdpZHRoQ29udCA9ICRlbC53aWR0aCgpO1xuICAgIGhlaWdodENvbnQgPSAkZWwuaGVpZ2h0KCk7XG4gICAgd2lkdGggPSB3aWR0aENvbnQgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodDtcbiAgICBoZWlnaHQgPSBoZWlnaHRDb250IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIH07XG5cbiAgdmFyIHNldERvdHNDb2xvciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgkZG90cykge1xuICAgICAgJGRvdHMudHJhbnNpdGlvbigxMDAwKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCBmdW5jdGlvbihkKXsgcmV0dXJuIGNvbG9yKGQuRHJ1Zyk7IH0pXG4gICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIERPVF9PUEFDSVRZKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHRoYXQ7XG59XG4iLCIvLyBNYWluIHNjcmlwdCBmb3IgYWNjZXNzIGFydGljbGVzXG5cbihmdW5jdGlvbigkKSB7XG5cbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTsgLy8gSW5pdCBUb29sdGlwc1xuICAkKCcuZHJvcGRvd24tdG9nZ2xlJykuZHJvcGRvd24oKTsgICAgICAgLy8gSW5pdCBEcm9wZG93blxuICAkKCcjcmVnaW9uLWRyb3Bkb3duLW1lbnUsICNkcnVnLWRyb3Bkb3duLW1lbnUnKS5jbGljayhmdW5jdGlvbihlKXsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XG5cbiAgLy8gUHJpY2VzIGdyYXBoXG4gIGlmICgkKCcjcHJpY2VzLWluZm9ncmFwaGljJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBwcmljZXNfaW5mb2dyYXBoaWMgPSBuZXcgSW5mb2dyYXBoaWMoJyNwcmljZXMtaW5mb2dyYXBoaWMnLCAncHJpY2VzJyk7XG4gICAgJCh3aW5kb3cpLnNjcm9sbCggcHJpY2VzX2luZm9ncmFwaGljLm9uU2Nyb2xsICk7XG4gICAgJCh3aW5kb3cpLnJlc2l6ZSggcHJpY2VzX2luZm9ncmFwaGljLm9uUmVzaXplICk7XG4gIH1cbiAgLy8gQ291bnRlcmZhaXRzIGluZm9ncmFwaGljXG4gIGVsc2UgaWYgKCQoJyNjb3VudGVyZmVpdHMtaW5mb2dyYXBoaWMnKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIGZha2VzX2luZm9ncmFwaGljID0gbmV3IEluZm9ncmFwaGljKCcjY291bnRlcmZlaXRzLWluZm9ncmFwaGljJywgJ2Zha2VzJyk7XG4gICAgJCh3aW5kb3cpLnNjcm9sbCggZmFrZXNfaW5mb2dyYXBoaWMub25TY3JvbGwgKTtcbiAgICAkKHdpbmRvdykucmVzaXplKCBmYWtlc19pbmZvZ3JhcGhpYy5vblJlc2l6ZSApO1xuICB9XG4gIC8vIFBhdGVudCBncmFwaFxuICBlbHNlIGlmICgkKCcjcGF0ZW50cy1ncmFwaCcpLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgZ3JhcGhfcGF0ZW50cyA9IHBhdGVudHNfZ3JhcGgoJyNwYXRlbnRzLWdyYXBoJykuaW5pdCgpO1xuICAgICQod2luZG93KS5yZXNpemUoIGdyYXBoX3BhdGVudHMub25SZXNpemUgKTtcbiAgfVxuICAvLyBQYXRlbnRzIGluZm9ncmFwaGljXG4gIGVsc2UgaWYgKCQoJyNwYXRlbnRzLWluZm9ncmFwaGljJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBwYXRlbnRlc19pbmZvZ3JhcGhpYyA9IG5ldyBJbmZvZ3JhcGhpYygnI3BhdGVudHMtaW5mb2dyYXBoaWMnLCAncGF0ZW50ZXMnKTtcbiAgICB2YXIgYW50aW1hbGFyaWNvc19pbmZvZ3JhcGhpYyA9IG5ldyBJbmZvZ3JhcGhpYygnI2FudGltYWxhcmljb3MtaW5mb2dyYXBoaWMnLCAnYW50aW1hbGFyaWNvcycpO1xuICAgICQod2luZG93KS5zY3JvbGwoIGZ1bmN0aW9uKGUpe1xuICAgICAgcGF0ZW50ZXNfaW5mb2dyYXBoaWMub25TY3JvbGwoKTtcbiAgICAgIGFudGltYWxhcmljb3NfaW5mb2dyYXBoaWMub25TY3JvbGwoKTtcbiAgICB9KTtcbiAgICAkKHdpbmRvdykucmVzaXplKCBmdW5jdGlvbigpe1xuICAgICAgcGF0ZW50ZXNfaW5mb2dyYXBoaWMub25SZXNpemUoKTtcbiAgICAgIGFudGltYWxhcmljb3NfaW5mb2dyYXBoaWMub25SZXNpemUoKTtcbiAgICB9KTtcbiAgfVxuXG59KShqUXVlcnkpOyAvLyBGdWxseSByZWZlcmVuY2UgalF1ZXJ5IGFmdGVyIHRoaXMgcG9pbnQuXG4iXX0=
