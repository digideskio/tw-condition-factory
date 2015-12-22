var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('browserify', ['bower'], function() {
    var b = browserify();
    var path = './src/twConditionFactoryModule.js';
    b.add(path);
    return b.bundle()
        .pipe(source(path))
        .pipe(buffer())
        .pipe(rename('tw-condition-factory.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(rename('tw-condition-factory.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
