'use strict';

var path = require('path');
var test = require('tape');
var gutil = require('gulp-util');
var concat = require('concat-stream');

var Revver = require('../');

test('discards all files in the stream, before pushing a manifest file into the stream', function(t) {
  t.plan(3);
  var revver = new Revver();
  var stream = revver.rev();
  stream.pipe(revver.manifest()).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, path.resolve(process.cwd(), 'manifest.json'));
    t.looseEqual(JSON.parse(files[0].contents.toString()), {
      'bundle.js': 'bundle-d41d8cd98f.js'
    });
  }));
  stream.end(new gutil.File({
    path: 'bundle.js',
    contents: new Buffer('')
  }));
});

test('specify a custom name via `opts.filename`', function(t) {
  t.plan(3);
  var revver = new Revver();
  var stream = revver.rev();
  stream.pipe(revver.manifest({
    filename: '../files.json'
  })).pipe(concat(function(files) {
    t.equal(files.length, 1);
    t.equal(files[0].path, path.resolve(process.cwd(), '../files.json'));
    t.looseEqual(JSON.parse(files[0].contents.toString()), {
      'bundle.js': 'bundle-d41d8cd98f.js'
    });
  }));
  stream.end(new gutil.File({
    path: 'bundle.js',
    contents: new Buffer('')
  }));
});

test('keep all files in the stream by setting `opts.clean` to `false`', function(t) {
  t.plan(4);
  var revver = new Revver();
  var stream = revver.rev();
  stream.pipe(revver.manifest({
    clean: false
  })).pipe(concat(function(files) {
    t.equal(files.length, 2);
    t.equal(path.basename(files[0].path), 'bundle-d41d8cd98f.js');
    t.equal(files[1].path, path.resolve(process.cwd(), 'manifest.json'));
    t.looseEqual(JSON.parse(files[1].contents.toString()), {
      'bundle.js': 'bundle-d41d8cd98f.js'
    });
  }));
  stream.end(new gutil.File({
    path: 'bundle.js',
    contents: new Buffer('')
  }));
});
