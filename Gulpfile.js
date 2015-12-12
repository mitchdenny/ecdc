var gulp = require('gulp');
var fs = require('fs');

gulp.task('default', function() {
	var originalContents = fs.readFileSync('package.json', 'utf8');
	var pkg = JSON.parse(originalContents);
	
	var version = process.env.GITVERSION_SemVer;
	
	if (version != null) {
		pkg.version = process.env.GITVERSION_SemVer;		
	} else {
		pkg.version = '0.0.0';
	}

	var updatedContents = JSON.stringify(pkg, null, '\t');
	fs.writeFileSync('package.json', updatedContents);
});