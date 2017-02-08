var VaccineMap = function( _id ) {

  var $ = jQuery.noConflict();

  var YEAR_DURATION = 75,  // year animation duration in frames
      MIN_YEAR = 1980,     // first year with data
      MAX_YEAR = 2016;     // last year with data

  var that = this,
      id = _id,
      width, height,
      data,
      currentYear = MIN_YEAR,
      path,
      projection,
      countries,
      svg,
      canvas,
      context,
      timer,
      frame = 0,
      transitionInDuration = 6, // transition in duration in frames,
      transitionOutDuration = 30, // transition out duration in frames,
      $el;


  // Public Methods

  that.init = function( data_file, map_data_file ) {

    $el = $('#'+id);

    getDimensions();

    // Setuop canvas & its context
    canvas = d3.select('#'+id)
      .append('canvas')
        .attr('width', width)
        .attr('height', height);

    context = canvas.node().getContext('2d');

    // Load CSVs
    d3.queue()
      .defer(d3.csv, data_file)
      .defer(d3.csv, map_data_file)
      .defer(d3.json, $('body').data('baseurl')+'/data/map-world-'+(that.getData ? '50' : '110')+'.json')
      .await( onDataReady );

    return that;
  };

  var onDataReady = function(error, _data, _map_data, world) {

    if (error) throw error;

    // set data (parse time value as integer)
    data = _map_data;
    data.forEach(function(d){
      d.t = +d.t;
    });

    // Get countries data
    countries = topojson.feature(world, world.objects.countries);
    countries.features = countries.features.filter(function(d){ return d.id !== '010'; });  // remove antarctica

    // Set projection
    projection = d3.geoKavrayskiy7();
    projectionSetSize();

    // Set path
    path = d3.geoPath()
      .projection(projection);

    // Setup data if getData variable is activated
    if (that.getData) {
      setupData(_data);
      return;
    }

    if (that.getPictureSequence) {
      downloadPictureSequence();
    }

    setupMap();

    // Draw points using a timer
    timer = d3.timer(drawPoints);
  };

  var downloadPictureSequence = function() {
    var maxFrame = transitionInDuration + transitionOutDuration + ((MAX_YEAR - MIN_YEAR) * YEAR_DURATION),
        picture;
    while (frame < maxFrame) {
      drawPoints();
      var frameStr = (frame < 10) ? '000'+frame
        : (frame < 100) ? '00'+frame
        : (frame < 1000)? '0'+frame
        : frame;
      downloadPNG('map-polio-frame-'+frameStr+'.png');
    }
  };

  var setupMap = function() {
    // draw country in canvas
    context.fillStyle = '#d0d0d0';
    context.lineWidth = 0.5;
    context.strokeStyle = '#fff';
    context.clearRect(0, 0, width, height);
    context.beginPath();
    path.context(context)(countries);
    context.fill();
    context.stroke();
    context.closePath();
  };

  var setupData = function(data_csv) {

    data = [];
    var canvasData = { type: "FeatureCollection" },
        polygon,
        centroid,
        bounds,
        boundsWidht,
        boundsHeight,
        year,
        cases,
        code,
        i, p;

    data_csv.forEach(function(d){
      // Get current country polygon
      polygon = countries.features.filter(function(country){ return country.id === d['country-code']; });

      if (polygon[0]) {

        // Use current country polygon as canvas data
        canvasData.features = polygon;

        // pixel data for the whole canvas map. we'll use color for point-in-polygon tests
        context.fillStyle = '#000';
        context.clearRect(0, 0, width, height);
        context.beginPath();
        path.context(context)(canvasData);
        context.fill();
        context.closePath();

        // Get country path centroid & bounds
        centroid = path.centroid(polygon[0]);
        bounds = path.bounds(polygon[0]);
        boundsWidht  = bounds[1][0] - bounds[0][0];
        boundsHeight = bounds[1][1] - bounds[0][1];

        for (year=MIN_YEAR; year<=MAX_YEAR; year++) {
          cases = +d[year];
          if (cases && cases > 0) {
            for (i=0; i < cases; i++) {
              p = (boundsWidht > 2 && boundsHeight > 2) ? getPointOnCountry(centroid, boundsWidht, boundsHeight) : centroid;
              data.push({
                x: +p[0].toFixed(1),
                y: +p[1].toFixed(1),
                t: Math.floor(Math.random() * (year-MIN_YEAR+1) * YEAR_DURATION)
              });
            }
          }
        }
      } else {
        console.log('No existe el país ' + d['country-code'] );
      }
    });

    // Download data as .csv file
    var data_csv_str = 'x,y,t\n';
    data.forEach(function(d){
      data_csv_str += d.x+','+d.y+','+d.t+'\n';
    });
    downloadCSV(data_csv_str, 'map-polio-cases.csv');
  };

  var downloadCSV = function(data, name) {
    var a = document.createElement('a');
    var file = new Blob([data], {type: 'text/csv;charset=utf-8'});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  };

  var downloadPNG = function(name) {
    var a = document.createElement('a');
    a.href = canvas.node().toDataURL('image/png')
    a.download = name;
    a.click();
  };

  var isPointInCanvas = function(point) {
    // Based on https://developer.mozilla.org/es/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    return context.getImageData(point[0], point[1], 1, 1).data[3] !== 0;
  }

  var getPointOnCountry = function(centroid, boundsWidht, boundsHeight) {
    var p = [
          centroid[0] + (Math.random() * 1 * boundsWidht) - (boundsWidht/2),
          centroid[1] + (Math.random() * 1 * boundsHeight) - (boundsHeight/2)
        ],
        c = 0;

    while(!isPointInCanvas(p) && c < 200) {
      p = [
        centroid[0] + (Math.random() * 1 * boundsWidht) - (boundsWidht/2),
        centroid[1] + (Math.random() * 1 * boundsHeight) - (boundsHeight/2)
      ];
      c++;
    }

    // Avoid infinite iterations
    if (c >= 200)
      p = centroid;

    return p;
  };


  var drawPoints = function() {

    frame++;

    if (currentYear > MAX_YEAR) {
      timer.stop();
      return;
    }

    currentYear = MIN_YEAR+Math.floor(frame/YEAR_DURATION);

    setupMap();

    if (!that.getPictureSequence) {
      context.textAlign = 'end';
      context.fillStyle = '#999';
      context.font = '22px Arial';
      context.fillText(currentYear, width, 25);
    }

    var dt, opacity;

    data
      .filter(function(d){ return d.t <= frame && d.t > frame-transitionInDuration-transitionOutDuration; })
      .forEach(function(d,i){
        dt = frame - d.t;
        transition = (dt > transitionInDuration+transitionOutDuration) ? 0 // after transition in & out
          : (dt <= transitionInDuration) ? dt/transitionInDuration  // transition in
          : 1-((dt-transitionInDuration)/transitionOutDuration);        // transition out
        context.fillStyle = 'rgba(233,96,15,'+(0.8*transition)+')';   // #E9600F 
        context.beginPath();
        context.arc(d.x, d.y, (2*dt/(transitionInDuration+transitionOutDuration))+1, 0, 2*Math.PI, true);
        context.fill();
        context.closePath();
      });
  };

  var updateGraph = function() {
    svg
      .attr('width', width)
      .attr('height', height);

    projectionSetSize();

    svg.selectAll('.country')
      .attr('d', path);
  };

  var projectionSetSize = function() {
    projection
      .fitSize([width, height], countries)  // Fit projection size
      .scale( projection.scale() * 1.1 )    // Adjust projection size & translation
      .translate([width*0.48, height*0.6]);
  };

  var getDimensions = function() {
    width    = $el.width();
    height   = $el.height();
  };

  return that;
};