var gulp = require('gulp');
var runSequence = require('run-sequence');

//require gulp tasks
require('require-dir')('gulp-tasks');

//used for releasing
require('gulp-release-tasks')(gulp);

gulp.task('dist', ['bower', 'browserify']);

gulp.task('default', function(callback) {
    runSequence(
        ['lint', 'bower'],
        'karma',
        'dist',
        callback);
});
