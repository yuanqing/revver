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
  t.looseEqual(revver.getHashes(), {
    'js/views/foo': 'acbd18db4c',
    'js/views/bar': '37b51d194a',
    'css/baz': '73feffa4b7',
  });
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
  t.looseEqual(revver.getHashes('js/'), {
    'views/foo': 'acbd18db4c',
    'views/bar': '37b51d194a'
  });
  t.looseEqual(revver.getHashes('css/'), {
    'baz': '73feffa4b7',
  });
});
