var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
  scripts: 'client/src/js/**/*.*',
  scripts_vendor: 'bower_components/**/*.min.js',
  styles: 'client/src/css/**/*.*',
  styles_app: 'client/src/app/**/*.css',
  styles_vendor: 'bower_components/**/*.min.css',
  maps_vendor: 'bower_components/**/*.map',
  images: 'client/src/img/**/*.*',
  views: 'client/src/**/*.html',
  bower_fonts: 'bower_components/**/*.{ttf,woff,eof,svg}'
};

/**
 * Handle bower components from index
 */
gulp.task('usemin', function () {
  return gulp.src(paths.views)
      .pipe(usemin({
        js: [minifyJs(), 'concat'],
        css: [minifyCss({keepSpecialComments: 0}), 'concat']
      }))
      .pipe(gulp.dest('client/build/'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function () {
  return gulp.src(paths.bower_fonts)
      .pipe(gulp.dest('client/build/vendor'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-app-less']);

gulp.task('custom-images', function () {
  return gulp.src(paths.images)
      .pipe(gulp.dest('client/build/img'));
});

gulp.task('custom-js', function () {
  return gulp.src(paths.scripts)
      .pipe(minifyJs())
      .pipe(concat('qeti.min.js'))
      .pipe(gulp.dest('client/build/js'));
});

gulp.task('custom-less', function () {
  return gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('client/build/css'));
});

gulp.task('custom-app-less', function () {
  return gulp.src(paths.styles_app)
      .pipe(less())
      .pipe(gulp.dest('client/build/app'));
});

/**
 * Handle vendor files
 */
gulp.task('vendor-js', function () {
  return gulp.src(paths.scripts_vendor)
      .pipe(gulp.dest('client/build/vendor'));
});

gulp.task('vendor-css', function () {
  return gulp.src(paths.styles_vendor)
      .pipe(gulp.dest('client/build/vendor'));
});

gulp.task('vendor-maps', function () {
  return gulp.src(paths.maps_vendor)
      .pipe(gulp.dest('client/build/vendor'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom-dev', ['custom-images', 'custom-js-dev', 'custom-less-dev', 'custom-app-less-dev']);

gulp.task('custom-js-dev', function () {
  return gulp.src(paths.scripts)
      .pipe(sourcemaps.init())
        .pipe(minifyJs())
        .pipe(concat('qeti.min.js'))
      .pipe(sourcemaps.write('../js'))
      .pipe(gulp.dest('client/build/js'));
});

gulp.task('custom-less-dev', function () {
  return gulp.src(paths.styles)
      .pipe(sourcemaps.init())
        .pipe(less())
      .pipe(sourcemaps.write('../css'))
      .pipe(gulp.dest('client/build/css'));
});

gulp.task('custom-app-less-dev', function () {
  return gulp.src(paths.styles_app)
      .pipe(sourcemaps.init())
        .pipe(less())
      .pipe(sourcemaps.write('../app'))
      .pipe(gulp.dest('client/build/app'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function () {
  gulp.watch([paths.images], ['custom-images']);
  gulp.watch([paths.styles], ['custom-less-dev']);
  gulp.watch([paths.styles_app], ['custom-app-less-dev']);
  gulp.watch([paths.scripts], ['custom-js-dev']);
  gulp.watch([paths.views], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function () {
  connect.server({
    root: 'client/build',
    livereload: true,
    port: 8888
  });
});

gulp.task('common', ['usemin', 'vendor-js', 'vendor-css', 'build-assets']);

/**
 * Gulp tasks
 */
gulp.task('build-dev', ['common', 'vendor-maps', 'build-custom-dev']);
gulp.task('build', ['common', 'build-custom']);
gulp.task('default', ['build-dev', 'webserver', 'watch']);
