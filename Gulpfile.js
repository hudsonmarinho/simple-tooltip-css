var gulp          = require('gulp'),
    sass          = require('gulp-ruby-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    minifycss     = require('gulp-minify-css'),
    rename        = require('gulp-rename'),
    scss_src      = 'src/scss/*.scss',
    scss_dist     = 'dist/css',
    tinylr;

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('express', function() {
  var express  = require('express'),
      app      = express();

  app.use(require('connect-livereload')({ port: 4002 }));
  app.use(express.static(__dirname));

  app.listen(4000);
});

gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

gulp.task('styles', function() {
  return gulp.src(scss_src)
         .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
         .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
         .pipe(gulp.dest(scss_dist))
         .pipe(rename({suffix: '.min'}))
         .pipe(minifycss())
         .pipe(gulp.dest(scss_dist));
});

gulp.task('watch', function() {
  gulp.watch(scss_src, ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch((scss_dist + '/*.css'), notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {});
