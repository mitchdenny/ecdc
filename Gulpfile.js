var gulp = require('gulp');

gulp.task('default', function() {
	console.log('This version is: ' + process.env.GITVERSION_FullSemVer);
})