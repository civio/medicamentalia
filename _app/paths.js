var paths = {};

// Directory locations
paths.appDir             = '_app/';  // The files Gulp will work on
paths.siteDir            = '_site/';
paths.assetsDir          = 'assets/';

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
    paths.appScriptFiles + '/dist/modernizr.js',
    paths.appScriptFiles + '/dist/jquery.js',
    paths.appScriptFiles + '/dist/selection-sharer.js',
    paths.appScriptFiles + '/main.js'
  ],
  // infograpic.js sources
  infographics: [
    paths.appScriptFiles + '/dist/d3.min.js',
    paths.appScriptFiles + '/queue.js',
    paths.appScriptFiles + '/patents-graph.js',
    paths.appScriptFiles + '/patents-infographic.js',
    paths.appScriptFiles + '/main-infographic.js'
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