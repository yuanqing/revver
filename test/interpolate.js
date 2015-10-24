'use strict';

var test = require('tape');
var gutil = require('gulp-util');
var concat = require('concat-stream');
var ReadableStream = require('stream').Readable;

var Revver = require('../');

test('interpolate revved paths into files in the stream', function(t) {
  t.plan(3);
  var revver = new Revver({
    manifest: {
      'bundle.js': 'bundle-d41d8cd98f.js'
    }
  });
  var stream = new ReadableStream({
    objectMode: true
  });
  stream.pipe(revver.interpolate()).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, 'index.html');
    t.looseEqual(files[0].contents.toString(),
      '<script src="bundle-d41d8cd98f.js"></script>');
  }));
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ bundle.js }}"></script>')
  }));
  stream.push(null);
});

test('throws if revved path not found', function(t) {
  t.plan(1);
  var revver = new Revver();
  var stream = new ReadableStream({
    objectMode: true
  });
  stream.pipe(revver.interpolate()).on('error', function(err) {
    t.equal(err.message, 'Revved path not found: bundle.js');
  });
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ bundle.js }}"></script>')
  }));
  stream.push(null);
});

test('modify the interpolated value using an `interpolateCallback`', function(t) {
  t.plan(3);
  var revver = new Revver({
    manifest: {
      'bundle.js': 'bundle-d41d8cd98f.js'
    },
    interpolateCallback: function(revvedPath) {
      return 'foo/' + revvedPath;
    }
  });
  var stream = new ReadableStream({
    objectMode: true
  });
  stream.pipe(revver.interpolate()).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, 'index.html');
    t.looseEqual(files[0].contents.toString(),
      '<script src="foo/bundle-d41d8cd98f.js"></script>');
  }));
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ bundle.js }}"></script>')
  }));
  stream.push(null);
});

test('with a custom `interpolateRegex`', function(t) {
  t.plan(3);
  var revver = new Revver({
    interpolateRegex: /{{\s*asset\s*([^}]+?)\s*}}/g,
    manifest: {
      'bundle.js': 'bundle-d41d8cd98f.js'
    }
  });
  var stream = new ReadableStream({
    objectMode: true
  });
  stream.pipe(revver.interpolate()).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, 'index.html');
    t.looseEqual(files[0].contents.toString(),
      '<script src="bundle-d41d8cd98f.js"></script>');
  }));
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ asset bundle.js }}"></script>')
  }));
  stream.push(null);
});
