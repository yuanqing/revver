'use strict';

var path = require('path');
var gutil = require('gulp-util');
var reduce = require('lodash.reduce');
var revHash = require('rev-hash');
var revPath = require('rev-path');
var through = require('through2');
var sortKeys = require('sort-keys');
var objectAssign = require('object-assign');
var stripExtension = require('strip-extension');

var identity = function(x) {
  return x;
};

var PLUGIN_NAME = 'revver';
var DEFAULT_FILENAME = 'manifest.json';
var DEFAULT_INTERPOLATE_REGEX = /{{\s*([^}]+?)\s*}}/g;

var Revver = module.exports = function(opts) {
  if (!(this instanceof Revver)) {
    return new Revver(opts);
  }
  opts = opts || {};
  this._manifest = opts.manifest || {};
  this.interpolateRegex = opts.interpolateRegex || DEFAULT_INTERPOLATE_REGEX;
  this.interpolateCallback = opts.interpolateCallback || identity;
};

Revver.prototype = {
  rev: function() {
    var _manifest = this._manifest;
    return through.obj(function(file, encoding, cb) {
      if (file.isStream()) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming is not supported'));
      }
      var hash = revHash(file.contents);
      var initialPath = file.path;
      var revvedPath = file.path = revPath(file.path, hash);
      var temp = {};
      temp[path.relative(file.base, initialPath)] = path.relative(file.base, revvedPath);
      objectAssign(_manifest, temp);
      cb(null, file);
    });
  },
  manifest: function(opts) {
    opts = opts || {};
    var self = this;
    // The default behavior is to drop all existing elements in the pipeline.
    return through.obj(function(file, encoding, cb) {
      cb(null, opts.clean === false ? file : null);
    }, function(cb) {
      this.push(new gutil.File({
        path: path.resolve(process.cwd(), (opts.filename || DEFAULT_FILENAME)),
        contents: new Buffer(JSON.stringify(sortKeys(self._manifest)))
      }));
      cb();
    });
  },
  interpolate: function(opts) {
    opts = opts || {};
    var self = this;
    return through.obj(function(file, encoding, cb) {
      var contents;
      try {
        contents = file.contents.toString().replace(opts.interpolateRegex || self.interpolateRegex, function(match, originalPath) {
          var revvedPath = self._manifest[originalPath];
          if (!revvedPath) {
            throw new gutil.PluginError(PLUGIN_NAME, 'Revved path not found: ' + originalPath);
          }
          return (opts.interpolateCallback || self.interpolateCallback)(revvedPath);
        });
      } catch (err) {
        return cb(err);
      }
      file.contents = new Buffer(contents);
      cb(null, file);
    });
  },
  getHashes: function(prefix) {
    prefix = prefix || '';
    return sortKeys(reduce(this._manifest, function(acc, revvedPath, originalPath) {
      if (originalPath.indexOf(prefix) === 0) {
        var key = stripExtension(originalPath.substring(prefix.length));
        var basename = stripExtension(path.basename(originalPath));
        var value = stripExtension(path.basename(revvedPath).substring(basename.length + 1));
        acc[key] = value;
      }
      return acc;
    }, {}));
  }
};

module.exports = Revver;
