var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-minify-css'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html');

var paths = {
  scripts: 'client/src/js/**/*.*',
  scripts_vendor: 'bower_components/**/*.min.js',
  styles: 'client/src/css/**/*.*',
  styles_vendor: 'bower_components/**/*.min.css',
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
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less']);

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

gulp.task('vendor-js', function () {
  return gulp.src(paths.scripts_vendor)
      .pipe(gulp.dest('client/build/vendor'));
});

gulp.task('custom-less', function () {
  return gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('client/build/css'));
});

gulp.task('vendor-css', function () {
  return gulp.src(paths.styles_vendor)
      .pipe(gulp.dest('client/build/vendor'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom-dev', ['custom-images', 'custom-js-dev', 'custom-less']);

gulp.task('custom-js-dev', function () {
  return gulp.src(paths.scripts)
      .pipe(gulp.dest('client/build/js'));
});

gulp.task('custom-less', function () {
  return gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('client/build/css'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function () {
  gulp.watch([paths.images], ['custom-images']);
  gulp.watch([paths.styles], ['custom-less']);
  gulp.watch([paths.scripts], ['custom-js']);
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

gulp.task('livereload', function () {
  gulp.src(['client/build/**/*.*'])
      .pipe(watch())
      .pipe(connect.reload());
});

gulp.task('common', ['vendor-js', 'vendor-css', 'build-assets']);

/**
 * Gulp tasks
 */
gulp.task('build-dev', ['common', 'build-custom-dev']);
gulp.task('build', ['usemin', 'common', 'build-custom']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
