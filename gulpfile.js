var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    coffeeSources = ['components/coffee/tagline.coffee'];

//gulp.task('log', function(){
//    gutil.log('Workflows are awesome');
//});

gulp.task('coffee', function(){
    gulp.src(coffeeSources[0]).pipe(coffee({ bare: true})
        .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});
