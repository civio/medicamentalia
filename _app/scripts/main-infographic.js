function Main_Infographic( _id ) {

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
      $menu = $('#main-infographic-menu'),
      $tooltip = $('#main-infographic-tooltip'),
      $regionDropdownInputs = $('#region-dropdown-menu .checkbox input'),
      $drugDropdownInputs = $('#drug-dropdown-menu .checkbox input');

  var lang = $el.parent().data('lang');

  var color = d3.scale.ordinal()
      .range(['#C9AD4B', '#BBD646', '#63BA2D', '#34A893', '#3D91AD', '#5B8ACB', '#BA7DAF', '#BF6B80', '#F49D9D', '#E25453', '#B56631', '#E2773B', '#FFA951', '#F4CA00']);

  var svg,
      x, y, xAxis, yAxis,
      timeout, tooltipItem, drugsFiltered, drugsFilteredAll,
      dataPricesPublic, dataPricesPrivate, dataAffordability, dataCountries, dataCountriesAll;

  var $svg, $dots, $lines, $countryMarker, $countryLabel, $countryLabelCode, $overlay, $mprLine, $yAxis, $xAxis, $yLabel, $xArea;

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

    x = d3.scale.ordinal()
      .rangePoints([0, width]);

    y = d3.scale.pow().exponent(0.5)
      .range([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(-height)
      .tickPadding(12)
      .tickSubdivide(true)
      .orient('bottom');

    yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width)
      .tickPadding(8)
      .tickFormat(tickFormatAffordability)
      .orient('left');

    svg = d3.select(id).append('svg')
        .attr('id', 'main-infographic-svg')
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
    queue()
      .defer(d3.csv, $('body').data('url')+'/dist/csv/prices.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/affordability.csv')
      .defer(d3.csv, $('body').data('url')+'/dist/csv/countries.csv')
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
      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY );

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

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

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

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

      setTooltipOnTour('.dot.drug-diclofenac.country-sudan');
     
    } else if( stateID === 7 ){

      drugsFiltered = drugsFilteredAll;
      updateData( 'prices', 'public' );

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);

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

      $dots.transition(1000)
        .style('fill', function(d){ return color(d.Drug); })
        .style('opacity', DOT_OPACITY);
    }

    return that;
  };

  that.resize = function() {

    setDimensions();  // Update width/height

    //if( widthCont < 992 ){ return that; }   // Skip for mobile sizes
    if( widthCont < 860 || height < 0 ){ return that; }   // Skip for mobile sizes

    $svg.attr('width', widthCont).attr('height', heightCont);   // Update SVG size

    //Update Axis
    x.rangePoints([0, width]);
    y.range([height, 0]);

    xAxis.tickSize(-height);
    yAxis.tickSize(-width);

    $xAxis
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    $yAxis.call(yAxis);

    // Country Marker
    $countryMarker.attr('y1', height);
    $countryLabelCode.attr('y', height+21);
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

    $svg = d3.select('#main-infographic-svg');

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

    $countryLabelCode = svg.append('text')
      .attr('class', 'country-label-code')
      .attr('y', height+21)
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

    $yAxis.transition().duration(1000).ease('sin-in-out').call(yAxis);

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
      if ($(this).attr('checked') && $drugDropdownInputs.filter(':checked').size() === $drugDropdownInputs.size()-1) {
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
    if (dotClicked == null) {
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
    
    // Show country marker labels
    $countryLabel.style('opacity', 1);
    $countryLabelCode.style('opacity', 1);

    // Set selected dots on top
    $dots.sort(function (a, b) {  
      return ( item.attr('id') === niceName(a.Drug) ) ? 1 : -1;
    });

    setTooltip( item );
  };

  var setTooltip = function( item ){

    item = ( tooltipItem ) ? tooltipItem : item;

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
        leftEdges = x.range(),
        w = width / (dataCountries.length-1),
        j = 0;   

    while(xPos > (leftEdges[j] + (w*0.5))){ j++; }

    if( overlayCode === j ){ return that; }

    overlayCode = x.domain()[j];

    $countryMarker
      .style('opacity', 1)
      .attr('transform', 'translate('+ x(overlayCode) +' 0)');

    var countryData = dataCountries.filter(function(d){ return d.Code === overlayCode; });

    $countryLabelCode
      .attr('x', x(overlayCode))
      .style('opacity', 1)
      .text( overlayCode );

    $countryLabel
      .attr('x', x(overlayCode))  //-6)
      .style('opacity', 1)
      .text( countryData[0]['Country_'+lang] );
  };

  var onOverlayOut = function(){

    overlayCode = null;
    $countryMarker.style('opacity', 0);
    $countryLabel.style('opacity', 0);
    $countryLabelCode.style('opacity', 0);
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
      if (temp !== c[0][label]) {
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

  return that;
}
