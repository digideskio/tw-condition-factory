var gulp = require('gulp');
var KarmaServer = require('karma').Server;

gulp.task('karma', [], function(done) {
    testKarma('/../test/config/karma.conf.js', done);
});

gulp.task('testWithReport', [], function(done) {
    testKarma('/../test/config/karma.report.conf.js', done);
});

gulp.task('test', ['karma']);

function testKarma(configFile, done) {
    var karmaServer = new KarmaServer({
        configFile: __dirname + configFile,
        singleRun: true
    }, done);
    karmaServer.start();
}
