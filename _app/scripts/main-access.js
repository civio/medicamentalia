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
