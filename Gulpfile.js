var gulp = require('gulp');
var fs = require('fs');

gulp.task('default', function() {
	var packageFileContents = fs.readFileSync('package.json');
	console.log(packageFileContents);
	console.log('This version is: ' + process.env.GITVERSION_FullSemVer);
})