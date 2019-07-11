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
  .src('./src/templates/**', { dot: true })
  .pipe(gulp.dest('./lib/templates/'));
});
