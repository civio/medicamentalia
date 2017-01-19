// Other articles site setup (superbugs, ...)

(function($) {

  // Antibiotics bar graph
  if ($('#antibiotics-graph').length > 0) {
    var graph_antibiotics = new BarGraph('antibiotics-graph', $('body').data('baseurl')+'/assets/data/antibiotics.csv');
    graph_antibiotics.txt = {
      'es': 'Media EU28',
      'en': 'EU28 Average'
    };
    graph_antibiotics.markerValue = 36;
    graph_antibiotics.aspectRatio = 0.5;
    graph_antibiotics.init();
    $(window).resize( graph_antibiotics.onResize );
  }
  // Antibiotics bar graph
  if ($('#antibiotics-animals-graph').length > 0) {
    var graph_antibiotics_animals = new BarGraph('antibiotics-animals-graph', $('body').data('baseurl')+'/assets/data/antibiotics-animals.csv');
    graph_antibiotics_animals.txt = {
      'es': 'Media',
      'en': 'Average'
    };
    graph_antibiotics_animals.markerValue = 107.8;
    graph_antibiotics_animals.aspectRatio = 0.5;
    graph_antibiotics_animals.init();
    $(window).resize( graph_antibiotics_animals.onResize );
  }
   
})(jQuery); // Fully reference jQuery after this point.
