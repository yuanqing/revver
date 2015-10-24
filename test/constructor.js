'use strict';

var test = require('tape');
var gutil = require('gulp-util');
var ReadableStream = require('stream').Readable;

var Revver = require('../');

test('revs file paths', function(t) {
  t.plan(1);
  var revver = new Revver();
  var stream = revver.rev();
  stream.on('data', function(file) {
    t.equal(file.path, 'bundle-d41d8cd98f.js');
  });
  stream.write(new gutil.File({
    path: 'bundle.js',
    contents: new Buffer('')
  }));
  stream.end();
});

test('can be called without `new`', function(t) {
  t.plan(1);
  var revver = Revver(); // eslint-disable-line new-cap
  var stream = revver.rev();
  stream.on('data', function(file) {
    t.equal(file.path, 'bundle-d41d8cd98f.js');
  });
  stream.write(new gutil.File({
    path: 'bundle.js',
    contents: new Buffer('')
  }));
  stream.end();
});

test('throws if `contents` is a stream', function(t) {
  t.plan(1);
  var revver = new Revver();
  t.throws(function() {
    var stream = revver.rev();
    stream.write(new gutil.File({
      path: 'bundle.js',
      contents: new ReadableStream()
    }));
    stream.end();
  });
});
