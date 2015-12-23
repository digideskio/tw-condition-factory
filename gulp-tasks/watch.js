var gulp = require('gulp');


gulp.task('watch', function() {
    gulp.watch(['src/*.js'], ['browserify', 'karma']);
    gulp.watch(['test/*.spec.js'], ['karma']);
});
