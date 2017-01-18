// Based on https://github.com/shakyShane/jekyll-gulp-sass-browser-sync

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssmin        = require('gulp-clean-css'),
    concat        = require('gulp-concat'),
    env           = require('gulp-environments'),
    development   = env.development,
    production    = env.production,
    ghPages       = require('gulp-gh-pages'),
    htmlmin       = require('gulp-htmlmin'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    gutil         = require('gulp-util'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    cp            = require('child_process');

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

// Script src files
var js_paths = {
  // main.js sources
  main: [
    '_app/scripts/vendor/modernizr.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/popovers.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    '_app/scripts/vendor/selection-sharer.js',
    '_app/scripts/main.js'
  ],
  // infograpic.js sources
  infographics: [
    '_app/scripts/vendor/d3-bundle.js',
    '_app/scripts/vendor/popcorn.js',
    //'node_modules/topojson-client/dist/topojson-client.js',
    '_app/scripts/bar-graph.js',
    '_app/scripts/line-graph.js',
    '_app/scripts/patents-graph.js',
    '_app/scripts/vaccine-disease-graph.js',
    //'_app/scripts/vaccine-map.js',
    '_app/scripts/infographic.js',
    '_app/scripts/antimalaricos-infographic.js',
    '_app/scripts/fakes-infographic.js',
    '_app/scripts/patents-infographic.js',
    '_app/scripts/prices-infographic.js'
  ]
};


// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)
gulp.task('css', function() {
  return gulp.src('_app/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(production(autoprefixer({browsers: ['last 2 versions', 'ie >= 10']})))
    .pipe(production(cssmin()))
    .pipe(gulp.dest('_site/assets/styles'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/styles'))
    .on('error', gutil.log);
});

// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).
gulp.task('js-main', function() {
  return gulp.src(js_paths.main)
    .pipe(concat('main.js'))
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-infographics', function() {
  return gulp.src(js_paths.infographics)
    .pipe(concat('infographics.js'))
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js', ['js-main', 'js-infographics']);

// Jekyll build
gulp.task('jekyll-build', function(done) {
  browserSync.notify('Running jekyll build');
  return cp.spawn('jekyll', ['build', '--incremental', '--config', '_config.yml,_config-dev.yml'], {stdio: 'inherit'})
    .on('error', function(error){
      gutil.log(gutil.colors.red(error.message));
    })
    .on('close', done);
});

gulp.task('jekyll-build-production', function(done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('error', function(error){
      gutil.log(gutil.colors.red(error.message));
    })
    .on('close', done);
});

// Special tasks for building and then reloading BrowserSync
gulp.task('jekyll-rebuild', ['jekyll-build'], function(cb) {
  reload();
});

// Serve task
gulp.task('browser-sync', ['css', 'js', 'jekyll-build'], function() {
  browserSync({
    server: {
      port: 3000,
      baseDir: '_site'
    }
  });
});

// Watch task
gulp.task('watch', function() {
  // Watch app .scss files, changes are piped to browserSync
  gulp.watch('_app/styles/**/*.scss', ['css']);
  // Watch app .js files
  gulp.watch('_app/scripts/**/*.js', ['js']);
  // Watch Jekyll html files
  gulp.watch(['**/*.html', '_articles/**/**', '_pages/**/*.*', 'assets/data/**/**'], ['jekyll-rebuild']);
  // Watch Jekyll sitemap XML file
  //gulp.watch('sitemap.xml', ['jekyll-rebuild']);
  // Watch Jekyll data files
  gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['jekyll-rebuild']);
});

// Minify HTML Files
gulp.task('html', ['css', 'js', 'jekyll-build-production'], function() {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('_site'));
});

// Publish site folder in gh-pages branch
gulp.task('publish', ['html'], function() {
  return gulp.src('_site/**/*')
    .pipe(ghPages());
});

// Start Everything with the default task
gulp.task('default', ['browser-sync', 'watch']);
