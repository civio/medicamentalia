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
    d3.xml( $('body').data('url') + '/dist/svg/patentes.svg', 'image/svg+xml', function(xml) {
    
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
        .transition()
          .duration(1800)
          .delay(function(d,i) { return i * 100; })
          .each(slide);

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

  var slide = function () {
    var label = d3.select(this);
    (function repeat() {
      label = label.transition()
          .style('opacity', 0)
          .each('end', function(){ 
            if (c >= countries.length) { c=0; } 
            d3.select(this).text(countries[c++]); 
          })
        .transition()
          .style('opacity', 1)
          .each('end', repeat);
    })();
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
