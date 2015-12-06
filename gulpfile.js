var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    coffeeSources = ['components/coffee/tagline.coffee'],
    jsSources = [
        'components/scripts/rclick.js',
        'components/scripts/pixgrid.js',
        'components/scripts/tagline.js',
        'components/scripts/template.js'
    ],
    sassSources = ['components/sass/style.scss'];

//gulp.task('log', function(){
//    gutil.log('Workflows are awesome');
//});

gulp.task('coffee', function(){
    gulp.src(coffeeSources[0]).pipe(coffee({ bare: true})
        .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function(){
    gulp.src(jsSources).pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload());
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass : 'components/sass',
            image : 'builds/development/images',
            style : 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload());
});

gulp.task('connect',function(){
    connect.server({
        root : 'builds/development',
        livereload : true
    });
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect','watch']);

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});