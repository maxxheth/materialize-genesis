var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    vinylpaths = require('vinyl-paths'),
    cleancss = require('gulp-clean-css'),
    cmq = require('gulp-combine-media-queries'),
    concatcss = require('gulp-concat-css'),
    del = require('del');

// CSS
gulp.task('source:css', function(){
    return gulp.src([
            'stylesheet/source/*.scss',
            'sass/app.scss'
        ])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('temp/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss())
        .pipe(gulp.dest('stylesheet'))
        .pipe(notify({ message: 'Source styles task complete' }));
} );

gulp.task('vendor:css', function(){
    return gulp.src([
        'bower_components/normalize-css/normalize.css',
        'stylesheet/vendor/*.css'
    ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concatcss('vendor.css'))
        .pipe(gulp.dest('temp/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss())
        .pipe(gulp.dest('stylesheet'))
        .pipe(notify({ message: 'Vendor styles task complete' }));
} );

// JSHint
gulp.task('lint', function(){
    return gulp.src('js/source/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
});

// Theme JS
gulp.task('source:js', function() {
    return gulp.src([
        'js/source/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('temp/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(notify({ message: 'Source scripts task complete' }));
});

// Vendor JS
gulp.task('vendor:js', function(){
    return gulp.src([
        'bower_components/Materialize/dist/js/materialize.js',
        'js/vendor/*.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('temp/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(notify({ message: 'Vendor scripts task complete' }));
});

// Clean temp folder
gulp.task('clean:temp', function(){
    return gulp.src('temp/*')
    .pipe(vinylpaths(del))
});

// Default task
gulp.task('default', ['clean:temp'], function() {
    gulp.start('source:css', 'vendor:css', 'lint', 'source:js', 'vendor:js', 'watch');
});

// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(['sass/*.scss', 'sass/**/*.scss'], ['source:css']);

    // Watch .js files
    gulp.watch(['js/vendor/*.js'], ['vendor:js']);
    gulp.watch(['js/source/*.js'], ['source:js']);
});
