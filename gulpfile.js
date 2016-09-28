var gulp = require('gulp'),
  connect = require('gulp-connect'),
  opn = require('opn'),
  less = require('gulp-less'),
  path = require('path'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix(
      { 
        browsers: ['last 4 versions'] 
      }
    );
 

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8888
  });
  opn('http://localhost:8888');
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
gulp.task('css', function () {
  gulp.src('./app/css/*.css')
    .pipe(connect.reload());
});
gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'app/bower/'),
               path.join(__dirname, 'less/') ],
      plugins: [autoprefix],
      //env: "production",
      //dumpLineNumbers: "comments",
      //compress: true
    }))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
  gulp.watch(['./less/*.less'], ['less']);
});

gulp.task('default', ['connect', 'watch']);