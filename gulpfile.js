// Based on https://github.com/robwise/robwise.github.io/blob/master/gulpfile.js

// ## Globals
var autoprefixer = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();
var concat        = require('gulp-concat');
var cp            = require('child_process');
var del           = require('del');
var env           = require('gulp-environments');
var ghPages       = require('gulp-gh-pages');
var gulp          = require('gulp');
var gutil         = require('gulp-util');
var htmlmin       = require('gulp-htmlmin');
var jshint        = require('gulp-jshint');
var minifycss     = require('gulp-clean-css');
//var notify        = require('gulp-notify');
var rename        = require('gulp-rename');
//var responsive    = require('gulp-responsive'); // requires sharp and vips (brew)
var run           = require('gulp-run');
var runSequence   = require('run-sequence');
var sass          = require('gulp-sass');
//var size          = require('gulp-size');
var uglify       = require('gulp-uglify');
var uglifyOptions = {
  mangle: true,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  }
};

var paths        = require('./_app/paths');

var development  = env.development;
var production   = env.production;

// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)

gulp.task('build:styles', function () {
  return gulp.src(paths.appSassFiles + '/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.assetsStylesFiles))
    .pipe(production(autoprefixer({browsers: ['last 2 versions', 'ie >= 10']})))
    .pipe(production(minifycss()))
    .pipe(gulp.dest(paths.siteStylesFiles))
    .pipe(browserSync.reload({stream:true, once: true}))
    .on('error', gutil.log);
});


// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).

gulp.task('build:scripts:main', function() {
  return gulp.src(paths.scriptSrc.main)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.assetsScriptFiles))
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest(paths.siteScriptFiles))
    .on('error', gutil.log);
});

gulp.task('build:scripts:infographics', function() {
  return gulp.src(paths.scriptSrc.infographics)
    .pipe(concat('infographics.js'))
    .pipe(gulp.dest(paths.assetsScriptFiles))
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest(paths.siteScriptFiles))
    .on('error', gutil.log);
});

gulp.task('build:scripts', ['build:scripts:main', 'build:scripts:infographics'], function(cb) {
  browserSync.reload();
  cb();
});

// Creates optimized versions of files with different qualities, sizes, and
// formats, then outputs to appropriate location(s)
// gulp.task('build:images', function() {
//   var imageConfigs = [];
//   var addToImageConfigs = function(srcFilename, srcFileExt, widths, formats, quality, scale) {
//     for (var i = widths.length - 1; i >= 0; i--) {
//       for (var j = formats.length - 1; j >= 0; j--) {
//         var imageConfig = {
//           name: srcFilename + '.' + srcFileExt,
//           width: widths[i] * scale,
//           format: formats[j],
//           quality: quality,
//           rename: (srcFilename + '_' + widths[i] + '.' + formats[j]),
//           progressive: true
//         };
//         imageConfigs.push(imageConfig);
//       }
//     }
//   };

//   addToImageConfigs('hero-cropped', 'jpg', [320, 640, 800, 1024, 1440], ['jpg'], '60', 1.1);
//   addToImageConfigs('FrontendMastersScott-closeup', 'jpg', [400, 800], ['jpg', 'webp'], '95', 1);
//   addToImageConfigs('FrontendMastersScott-fullshot', 'jpg', [400, 800, 1600], ['jpg', 'webp'], '95', 1);
//   addToImageConfigs('FrontendMastersClassroom', 'jpg', [400, 800, 1500], ['jpg', 'webp'], '95', 1);
//   addToImageConfigs('AngularComponents', 'png', [250, 490], ['png'], '100', 1);
//   addToImageConfigs('UseSecureWebFonts-JavaScriptConsoleMessage', 'png', [400, 2562], ['png'], '100', 1);
//   addToImageConfigs('UseSecureWebFonts-UnsafeContentShield', 'png', [400, 2400], ['png'], '100', 1);

//   return gulp.src(paths.appImageFilesGlob)
//     .pipe(responsive(imageConfigs, {errorOnUnusedImage: false, progressive: true}))
//     .pipe(gulp.dest(paths.jekyllImageFiles))
//     .pipe(gulp.dest(paths.assetsImageFiles))
//     .pipe(browserSync.stream())
//     .pipe(size({showFiles: true}));
// });

// gulp.task('clean:images', function(cb) {
//   del([paths.jekyllImageFiles, paths.assetsImageFiles], cb);
// });

// // Places all fonts in appropriate location(s)
// gulp.task('build:fonts', ['fontello:fonts']);

// gulp.task('clean:fonts', function(cb) {
//   del([paths.jekyllFontFiles, paths.assetsFontFiles], cb);
// });


// Runs Jekyll build
gulp.task('build:jekyll', function(done) {
  return cp.spawn('jekyll', ['build', '--incremental'], {stdio: 'inherit'})
    .on('error', function(error){
      gutil.log(gutil.colors.red(error.message));
    })
    .on('close', done);
});

gulp.task('build:jekyll:noincremental', ['build:styles', 'build:scripts'], function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('error', function(error){
      gutil.log(gutil.colors.red(error.message));
    })
    .on('close', done);
});

// Special tasks for building and then reloading BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});


// Serve task
gulp.task('serve', function() {

  browserSync.init({
    server: paths.siteDir,
    ghostMode: false, // do not mirror clicks, reloads, etc. (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: false       // do not open the browser
  });
});

// Watch task
gulp.task('watch', function() {
  
  // Watch app .scss files, changes are piped to browserSync
  gulp.watch(paths.appSassFiles+'/**/*.scss', ['build:styles']);

  // Watch app .js files
  gulp.watch(paths.appScriptFiles+'/**/*.js', ['build:scripts']);

  // Watch Jekyll html files
  gulp.watch(['**/*.html', '_articles/**/**', '_pages/**/*.*'], ['build:jekyll:watch']);

  // Watch Jekyll sitemap XML file
  gulp.watch('sitemap.xml', ['build:jekyll:watch']);

  // Watch Jekyll data files
  gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);
});


// Build task
gulp.task('build', ['build:styles', 'build:scripts', 'build:jekyll']);


// Minify HTML Files.
gulp.task('build:html', ['build:jekyll:noincremental'], function() {
  return gulp.src(paths.siteDir+'**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.siteDir));
});

// Publish site folder in gh-pages branch
gulp.task('publish', ['build:html'], function() {
  return gulp.src(paths.siteDir+'**/*')
    .pipe(ghPages());
});

// Start Everything with the default task
gulp.task('default', [ 'build', 'serve', 'watch' ]);


// Static Server + watching files
// WARNING: passing anything besides hard-coded literal paths with globs doesn't
//          seem to work with the gulp.watch()
// gulp.task('serve', ['build'], function() {

//   browserSync.init({
//     server: paths.siteDir,
//     ghostMode: false, // do not mirror clicks, reloads, etc. (performance)
//     logFileChanges: true,
//     logLevel: 'debug',
//     open: false       // do not open the browser
//   });

//   // Watch site settings
//   gulp.watch(['_config.yml'/*, '_app/localhost_config.yml'*/], ['build:jekyll:watch']);

//   // Watch app .scss files, changes are piped to browserSync
//   gulp.watch(paths.appSassFiles+'/**/*.scss', ['build:styles']);

//   // Watch app .js files
//   gulp.watch(paths.appScriptFiles+'/**/*.js', ['build:scripts:watch']);

//   // Watch Jekyll articles
//   gulp.watch('_articles/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

//   // Watch Jekyll html files
//   gulp.watch(['**/*.html', '!_site/**/*.*'], ['build:jekyll:watch']);

//   // Watch Jekyll RSS feed XML file
//   //gulp.watch('feed.xml', ['build:jekyll:watch']);

//   // Watch Jekyll data files
//   gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

//   // Watch Jekyll favicon.ico
//   //gulp.watch('favicon.ico', ['build:jekyll:watch']);
// });

// // Updates Bower packages
// gulp.task('update:bower', function() {
//   return gulp.src('')
//     .pipe(run('bower install'))
//     .pipe(run('bower prune'))
//     .pipe(run('bower update'))
//     .pipe(notify({ message: 'Bower Update Complete' }))
//     .on('error', gutil.log);
// });

// // Updates Ruby gems
// gulp.task('update:bundle', function() {
//   return gulp.src('')
//     .pipe(run('bundle install'))
//     .pipe(run('bundle update'))
//     .pipe(notify({ message: 'Bundle Update Complete' }))
//     .on('error', gutil.log);
// });

// // Copies the normalize.css bower package to proper directory and renames it
// // so that Sass can include it as a partial
// gulp.task('normalize-css', function() {
//   return gulp.src(paths.bowerComponentsDir + 'normalize.css/normalize.css')
//     .pipe(rename('_reset.scss'))
//     .pipe(gulp.dest(paths.appSassFiles + '/base'))
//     .on('error', gutil.log);
// });

// // Places Fontello CSS files in proper location
// gulp.task('fontello:css', function() {
//   return gulp.src(paths.appVendorFiles + '/fontello*/css/fontello.css')
//     .pipe(rename('_fontello.scss')) // so can be imported as a Sass partial
//     .pipe(gulp.dest(paths.appSassFiles + '/base'))
//     .on('error', gutil.log);
// });

// // Places Fontello fonts in proper location
// gulp.task('fontello:fonts', function() {
//   return gulp.src(paths.appVendorFiles + '/fontello*/font/**.*')
//     .pipe(rename(function(path) {path.dirname = '';}))
//     .pipe(gulp.dest(paths.jekyllFontFiles))
//     .pipe(gulp.dest(paths.assetsFontFiles))
//     .pipe(browserSync.stream())
//     .on('error', gutil.log);
// });

// Places files downloaded from Fontello font generator website into proper
// locations
// Note: make sure to delete old Fontello folder before running this so
// that only the newly downloaded folder matches the glob
//gulp.task('fontello', ['fontello:css', 'fontello:fonts']);

// Updates Bower packages and Ruby gems, runs post-update operations, and re-builds
// gulp.task('update', ['update:bower', 'update:bundle'], function(cb) {
//   runSequence('normalize-css', 'build', cb);
// });
