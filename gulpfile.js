// Based on https://github.com/shakyShane/jekyll-gulp-sass-browser-sync

var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssmin        = require('gulp-clean-css'),
    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    env           = require('gulp-environments'),
    development   = env.development,
    production    = env.production,
    ghPages       = require('gulp-gh-pages'),
    htmlmin       = require('gulp-htmlmin'),
    jshint        = require('gulp-jshint'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    uglify        = require('gulp-uglify'),
    gutil         = require('gulp-util'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    cp            = require('child_process'),
    version       = require('gulp-version-append');

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
    'node_modules/topojson-client/dist/topojson-client.js',
    '_app/scripts/vendor/selection-sharer.js',
    '_app/scripts/vendor/d3-bundle.js',
    '_app/scripts/vendor/d3-ring-note.js',
    //'_app/scripts/vaccine-map.js',
    '_app/scripts/main.js'
  ],
  // access.js sources
  access: [
    '_app/scripts/bar-graph.js',
    '_app/scripts/patents-graph.js',
    '_app/scripts/infographic.js',
    '_app/scripts/antimalaricos-infographic.js',
    '_app/scripts/fakes-infographic.js',
    '_app/scripts/patents-infographic.js',
    '_app/scripts/prices-infographic.js',
    '_app/scripts/main-access.js'
  ],
  // vaccines.js sources
  vaccines: [
    '_app/scripts/base-graph.coffee',
    '_app/scripts/bar-graph.coffee',
    '_app/scripts/line-graph.coffee',
    '_app/scripts/heatmap-graph.coffee',
    '_app/scripts/map-graph.coffee',
    '_app/scripts/scatterplot-graph.coffee',
    '_app/scripts/scatterplot-discrete-graph.coffee',
    '_app/scripts/scatterplot-vph-graph.coffee',
    '_app/scripts/main-vaccines-prices.coffee',
    '_app/scripts/main-vaccines.coffee'
  ],
  // other.js sources
  superbugs: [
    '_app/scripts/base-graph.coffee',
    '_app/scripts/bar-graph.coffee',
    '_app/scripts/main-superbugs.coffee'
  ],
  // other.js sources
  pharma_payments: [
    '_app/scripts/base-graph.coffee',
    '_app/scripts/bar-graph.coffee',
    '_app/scripts/bar-horizontal-pharma-graph.coffee',
    '_app/scripts/iceberg-graph.coffee',
    '_app/scripts/beeswarm-graph.coffee',
    '_app/scripts/main-pharma-payments.coffee'
  ]
};

// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)
gulp.task('css', function() {
  var s = sass();
  s.on('error',function(e){
    gutil.log(e);
    s.end();
  });
  return gulp.src('_app/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(s)
    .pipe(sourcemaps.write())
    .pipe(production(autoprefixer({browsers: ['last 2 versions', 'ie >= 10']})))
    .pipe(production(cssmin()))
    .pipe(gulp.dest('_site/assets/styles'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/styles'))
    .on('error', gutil.log);
});

/*
// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).

// Get js paths object keys (main, acces, vaccines, ...)
var js_tasks = Object.keys(js_paths);

// Create a task for each js paths key
// Based on http://stackoverflow.com/questions/22968516/creating-tasks-using-a-loop-gulp
js_tasks.forEach(function(name) {
  gulp.task('js-'+name, function() {
    return gulp.src(js_paths[name])
      .pipe(sourcemaps.init())
      .pipe(concat(name+'.js'))
      .pipe(sourcemaps.write())
      .pipe(production(uglify(uglifyOptions)))
      .pipe(gulp.dest('_site/assets/scripts'))
      .pipe(reload({stream:true}))
      .pipe(gulp.dest('assets/scripts'))
      .on('error', gutil.log);
  });
});

js_tasks = js_tasks.map(function(d){ return 'js-'+d; });  // Setup js tasks as 'js-'+name
//js_tasks.unshift('coffee'); // Prepend coffee task to js tasks array
*/

gulp.task('popcorn', function() {
  return gulp.src('_app/scripts/vendor/popcorn.js')
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-main', function() {
  return gulp.src(js_paths.main)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-access', function() {
  return gulp.src(js_paths.access)
    .pipe(sourcemaps.init())
    .pipe(concat('access.js'))
    .pipe(sourcemaps.write())
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-vaccines', function() {
  var c = coffee();
  c.on('error',function(e){
    gutil.log(e);
    c.end();
  });
  return gulp.src(js_paths.vaccines)
    .pipe(sourcemaps.init())
    .pipe(c)
    .pipe(concat('vaccines.js'))
    .pipe(sourcemaps.write())
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-superbugs', function() {
  var c = coffee();
  c.on('error',function(e){
    gutil.log(e);
    c.end();
  });
  return gulp.src(js_paths.superbugs)
    .pipe(sourcemaps.init())
    .pipe(c)
    .pipe(concat('superbugs.js'))
    .pipe(sourcemaps.write())
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

gulp.task('js-pharma-payments', function() {
  var c = coffee();
  c.on('error',function(e){
    gutil.log(e);
    c.end();
  });
  return gulp.src(js_paths.pharma_payments)
    .pipe(sourcemaps.init())
    .pipe(c)
    .pipe(concat('pharma-payments.js'))
    .pipe(sourcemaps.write())
    .pipe(production(uglify(uglifyOptions)))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(reload({stream:true}))
    .pipe(gulp.dest('assets/scripts'))
    .on('error', gutil.log);
});

// Create a js task wich call all js task dynamically defined
gulp.task('js', ['popcorn', 'js-main', 'js-access', 'js-vaccines', 'js-superbugs', 'js-pharma-payments']);

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

gulp.task('jekyll-build-elmundo', function(done) {
  return cp.spawn('jekyll', ['build', '--config', '_config.yml,_config-elmundo.yml'], {stdio: 'inherit'})
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
  // Watch app .js files
  gulp.watch('_app/scripts/**/*.coffee', ['js']);
  // Watch Jekyll html files
  gulp.watch(['**/*.html', '_articles/**/**', '_pages/**/*.*', 'assets/data/**/**', 'assets/images/**/**'], ['jekyll-rebuild']);
  // Watch Jekyll sitemap XML file
  //gulp.watch('sitemap.xml', ['jekyll-rebuild']);
  // Watch Jekyll data files
  gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['jekyll-rebuild']);
});

// Minify HTML Files
gulp.task('html', ['css', 'js', 'jekyll-build-production'], function() {
  return gulp.src('_site/**/*.html')
    .pipe(version(['html','js','css']))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('_site'));
});

// Minify HTML Files
gulp.task('publish-elmundo', ['css', 'js', 'jekyll-build-elmundo'], function() {
  return gulp.src('_site/**/*.html')
    .pipe(version(['html','js','css']))
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
