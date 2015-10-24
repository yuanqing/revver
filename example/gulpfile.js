'use strict';

var gulp = require('gulp');
var Revver = require('../');
var revver = new Revver();

gulp.task('default', ['js'], function() {
  return gulp.src('index.html')
    .pipe(revver.interpolate())
    .pipe(revver.manifest({ clean: false }))
    .pipe(gulp.dest('build'));
});

gulp.task('js', function() {
  return gulp.src('script.js')
    .pipe(revver.rev())
    .pipe(gulp.dest('build'));
});
