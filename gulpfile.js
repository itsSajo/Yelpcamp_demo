var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync').create(),
    useref         = require("gulp-useref"),
    uglify         = require('gulp-uglify'),
    gulpIf         = require('gulp-if'),
    cssnano        = require('gulp-cssnano'),
    imagemin       = require('gulp-imagemin'),
    cache          = require('gulp-cache'),
    runSequence    = require('run-sequence')
;

gulp.task('sass-to-css', function() {
  return gulp.src('src/public/stylesheets/scss/*.scss') // get source files with gulp.source
  .pipe(sass()) // sends it thru a gulp plugin
  .pipe(gulp.dest('src/public/stylesheets')) // output the file in the dest folder
  .pipe(browserSync.reload({  // injecting updated css file into the browser
    stream : true
  }))
})

gulp.task('useref', function(){
  return gulp.src('src/views/*.html')
  .pipe(useref())
  // Minifies only if it's a JavaScript file
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
})

gulp.task('images', function(){
  return gulp.src('src/public/images/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
})

// array of taks to complete before watch
// second task gonna update no mater what to latest files
gulp.task('watch', ['browserSync', 'sass-to-css'], function() {
  // gulp watch syntax (in array u can define more than one task)
  gulp.watch('src/public/stylesheets/scss/*.scss', ['sass-to-css']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('src/views/*.html', browserSync.reload);
  gulp.watch('src/**/*.js', browserSync.reload);
})

// root of the server
gulp.task('browserSync', function() {
  browserSync.init({
    server : {
      baseDir: 'src'
    }
  })
})

// cleaning globs
gulp.task('clean:dist', function() {
  return del.sync('dist')
})

// clean cached images
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})

// run tasks simultaneously when second arg in array
gulp.task('build', function() {
  runSequence('clean:dist', ['sass-to-css', 'useref', 'images'])
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],)
})
