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

test('modify the interpolated value with an `interpolateCallback` specified in the constructor', function(t) {
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

test('`interpolateCallback` specified on the call to `interpolate` takes precedence', function(t) {
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
  stream.pipe(revver.interpolate({
    interpolateCallback: function(revvedPath) {
      return 'bar/' + revvedPath;
    }
  })).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, 'index.html');
    t.looseEqual(files[0].contents.toString(),
      '<script src="bar/bundle-d41d8cd98f.js"></script>');
  }));
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ bundle.js }}"></script>')
  }));
  stream.push(null);
});

test('interpolate using a custom `interpolateRegex` specified in the constructor', function(t) {
  t.plan(3);
  var revver = new Revver({
    manifest: {
      'bundle.js': 'bundle-d41d8cd98f.js'
    },
    interpolateRegex: /{{\s*asset\s*([^}]+?)\s*}}/g
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

test('`interpolateRegex` specified on the call to `interpolate` takes precedence', function(t) {
  t.plan(3);
  var revver = new Revver({
    manifest: {
      'bundle.js': 'bundle-d41d8cd98f.js'
    },
    interpolateRegex: /{{\s*asset\s*([^}]+?)\s*}}/g
  });
  var stream = new ReadableStream({
    objectMode: true
  });
  stream.pipe(revver.interpolate({
    interpolateRegex: /{{\s*js\s*([^}]+?)\s*}}/g
  })).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, 'index.html');
    t.looseEqual(files[0].contents.toString(),
      '<script src="bundle-d41d8cd98f.js"></script>');
  }));
  stream.push(new gutil.File({
    path: 'index.html',
    contents: new Buffer('<script src="{{ js bundle.js }}"></script>')
  }));
  stream.push(null);
});
