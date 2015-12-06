var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonMinify = require('gulp-jsonminify'),
    env = process.env.NODE_ENV || 'development',
    outputDir,
    sassStyle;

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

var coffeeSources = ['components/coffee/tagline.coffee'],
    jsSources = [
        'components/scripts/rclick.js',
        'components/scripts/pixgrid.js',
        'components/scripts/tagline.js',
        'components/scripts/template.js'
    ],
    sassSources = ['components/sass/style.scss'],
    htmlSources = 'builds/development/*.html',
    jsonSources = 'builds/development/js/*.json';

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
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass : 'components/sass',
            image : outputDir + 'images',
            style : sassStyle
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload());
});

gulp.task('connect',function(){
    connect.server({
        root : outputDir,
        livereload : true
    });
});

gulp.task('html', function(){
    gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload());
});

gulp.task('json', function(){
    gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonMinify()))
        .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
        .pipe(connect.reload());
});

gulp.task('default', ['json', 'html', 'coffee', 'js', 'compass', 'connect','watch']);

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
    gutil.log(env);
});