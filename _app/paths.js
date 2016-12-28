var paths = {};

// Directory locations
paths.appDir             = '_app/';  // The files Gulp will work on
paths.siteDir            = '_site/';
paths.assetsDir          = 'assets/';
paths.npmDir             = 'node_modules/';

// Folder naming conventions
paths.scriptFolderName = 'scripts';
paths.stylesFolderName = 'styles';

// App files locations
paths.appSassFiles   = paths.appDir + paths.stylesFolderName;
paths.appScriptFiles = paths.appDir + paths.scriptFolderName;

// Assets files locations
paths.assetsScriptFiles  = paths.assetsDir + paths.scriptFolderName;
paths.assetsStylesFiles  = paths.assetsDir + paths.stylesFolderName;

// Site files locations
paths.siteScriptFiles  = paths.siteDir + paths.assetsDir + paths.scriptFolderName;
paths.siteStylesFiles  = paths.siteDir + paths.assetsDir + paths.stylesFolderName;

// Script src files
paths.scriptSrc = {
  // main.js sources
  main: [
    paths.appScriptFiles + '/vendor/modernizr.js',
    paths.npmDir + '/jquery/dist/jquery.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/popovers.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    paths.npmDir + '/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    paths.appScriptFiles + '/vendor/selection-sharer.js',
    paths.appScriptFiles + '/main.js'
  ],
  // infograpic.js sources
  infographics: [
    paths.appScriptFiles + '/vendor/d3-bundle.js',
    paths.appScriptFiles + '/bar-graph.js',
    paths.appScriptFiles + '/patents-graph.js',
    paths.appScriptFiles + '/vaccine-graph.js',
    paths.appScriptFiles + '/infographic.js',
    paths.appScriptFiles + '/antimalaricos-infographic.js',
    paths.appScriptFiles + '/fakes-infographic.js',
    paths.appScriptFiles + '/patents-infographic.js',
    paths.appScriptFiles + '/prices-infographic.js'
  ]
};

// Glob patterns by file type
// paths.sassPattern        = '/**/*.scss';
// paths.jsPattern          = '/**/*.js';
// paths.imagePattern       = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
// paths.markdownPattern    = '/**/*.+(md|MD|markdown|MARKDOWN)';
// paths.htmlPattern        = '/**/*.html';
// paths.xmlPattern         = '/**/*.xml';

// App files globs
// paths.appSassFilesGlob     = paths.appSassFiles     + paths.sassPattern;
// paths.appScriptFilesGlob   = paths.appScriptFiles   + paths.jsPattern;
// paths.appImageFilesGlob    = paths.appImageFiles    + paths.imagePattern;

// Jekyll files globs
// paths.jekyllHtmlFilesGlob    = paths.jekyllDir        + paths.htmlPattern;
// paths.jekyllXmlFilesGlob     = paths.jekyllDir        + paths.xmlPattern;
// paths.jekyllImageFilesGlob   = paths.jekyllImageFiles + paths.imagePattern;

// Site files globs
//paths.siteHtmlFilesGlob    = paths.siteDir + paths.htmlPattern;

// One-offs
// paths.tota11y              = paths.vendorFilesApp  + '/tota11y.min.js';

module.exports = paths;