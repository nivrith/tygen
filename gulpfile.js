// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'lib/'
  }
;

gulp.task('copy:templates', () => {
  return gulp
  .src('./src/templates/**')
  .pipe(gulp.dest('./lib/templates/'));
});
