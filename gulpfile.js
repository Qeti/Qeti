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
    htmlbuild = require('gulp-htmlbuild');

var paths = {
    scripts: 'client/src/js/**/*.*',
    scriptsVendor: 'bower_components/**/*.*',
    styles: 'client/src/css/**/*.*',
    images: 'client/src/img/**/*.*',
    index: 'client/src/index.html',
    views: 'client/src/views/**/*.*',
    bower_fonts: 'client/src/components/**/*.{ttf,woff,eof,svg}'
};

/**
 * Handle bower components from index
 */
gulp.task('usemin', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat']
        }))
        .pipe(gulp.dest('client/build/'));
});

gulp.task('usemin-views', function() {
    return gulp.src(paths.views)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat']
        }))
        .pipe(gulp.dest('client/build/views'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: '/fonts'
        }))
        .pipe(gulp.dest('client/build/fonts'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less']);

gulp.task('custom-images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('client/build/img'));
});

gulp.task('custom-js', function() {
    return gulp.src(paths.scripts)
        .pipe(minifyJs())
        .pipe(concat('qeti.min.js'))
        .pipe(gulp.dest('client/build/js'));
});

gulp.task('vendor-js', function() {
    return gulp.src(paths.scriptsVendor)
        .pipe(minifyJs())
        .pipe(gulp.dest('client/build/vendor/js'));
});

gulp.task('custom-less', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('client/build/css'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom-dev', ['custom-images', 'custom-js-dev', 'custom-less']);

gulp.task('vendor-js-dev', function() {
    return gulp.src(paths.scriptsVendor)
        .pipe(gulp.dest('client/build/vendor/js'));
});

gulp.task('custom-js-dev', function() {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest('client/build/js'));
});

gulp.task('custom-less', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('client/build/css'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function() {
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-less']);
    gulp.watch([paths.scripts], ['custom-js']);
    gulp.watch([paths.index], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
    connect.server({
        root: 'client/build',
        livereload: true,
        port: 8888
    });
});

gulp.task('livereload', function() {
    gulp.src(['client/build/**/*.*'])
        .pipe(watch())
        .pipe(connect.reload());
});


gulp.task('build-index', function () {
  gulp.src([paths.index])
    .pipe(htmlbuild({
      // build js with preprocessor 
      js: htmlbuild.preprocess.js(function (block) {
        
        // read paths from the [block] stream and build them 
        // ... 
        
        // then write the build result path to it 
        block.end('js/qeti.min.js');
      })
    }))
    .pipe(gulp.dest('client/build'));
});

/**
 * Gulp tasks
 */
gulp.task('build-dev', ['vendor-js-dev', 'build-assets', 'build-custom-dev']);
gulp.task('build', ['usemin', 'usemin-views', 'vendor-js', 'build-assets', 'build-custom', 'build-index']);
gulp.task('default', ['build-dev', 'webserver', 'livereload', 'watch']);
