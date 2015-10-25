'use strict';

var test = require('tape');

var Revver = require('../');

test('gets all revved hashes', function(t) {
  t.plan(1);
  var revver = new Revver({
    manifest: {
      'js/views/foo.js': 'js/views/foo-acbd18db4c.js',
      'js/views/bar.js': 'js/views/bar-37b51d194a.js',
      'css/baz.css': 'css/baz-73feffa4b7.css',
    }
  });
  t.looseEqual(JSON.stringify(revver.getHashes()), JSON.stringify({
    'css/baz': '73feffa4b7',
    'js/views/bar': '37b51d194a',
    'js/views/foo': 'acbd18db4c'
  }));
});

test('gets revved hashes with original paths starting with a `prefix`', function(t) {
  t.plan(2);
  var revver = new Revver({
    manifest: {
      'js/views/foo.js': 'js/views/foo-acbd18db4c.js',
      'js/views/bar.js': 'js/views/bar-37b51d194a.js',
      'css/baz.css': 'css/baz-73feffa4b7.css',
    }
  });
  t.looseEqual(JSON.stringify(revver.getHashes({ prefix: 'js/' })), JSON.stringify({
    'views/bar': '37b51d194a',
    'views/foo': 'acbd18db4c'
  }));
  t.looseEqual(JSON.stringify(revver.getHashes({ prefix: 'css/' })), JSON.stringify({
    'baz': '73feffa4b7',
  }));
});
