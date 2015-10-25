# revver [![npm Version](http://img.shields.io/npm/v/revver.svg?style=flat)](https://www.npmjs.org/package/revver) [![Build Status](https://img.shields.io/travis/yuanqing/revver.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/revver) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/revver.svg?style=flat)](https://coveralls.io/r/yuanqing/revver)

> Asset versioning for [Gulp](https://github.com/gulpjs/gulp) by [appending a content hash to the filename](http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/). Similar to [`gulp-rev`](https://github.com/sindresorhus/gulp-rev).

- In-memory manifest that persists across Gulp tasks, with support for writing the manifest to disk if needed.
- Built-in support for interpolating revved paths into file contents. Specify a custom interpolate regex, or specify a callback if you need to modify the revved path (eg. to add a prefix).

## Example

```js
'use strict';

var gulp = require('gulp');
var Revver = require('revver');
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
```

[Run the example](example), or [read the tests](test).

## API

```js
var Revver = require('revver');
```

### var revver = new Revver([opts]);

Initialise the `revver`. `opts` takes the following keys:
- `manifest` &mdash; An object literal that maps the original file paths to the revved file paths. Defaults to `{}`.
- `interpolateRegex` &mdash; The regular expression used by the `interpolate` method. Defaults to `/{{\s*([^}]+?)\s*}}/g`.
- `interpolateCallback` &mdash; A callback with the signature `(revvedPath)` for modifying the interpolated value in the `interpolate` method. Defaults to the identity function.

### revver.rev()

Returns a through stream. Computes a hash of each file&rsquo;s `contents` and appends said hash to the file&rsquo;s basename. For example, an initial `file.path` of `bundle.js` might become `bundle-d41d8cd98f.js`.

### revver.manifest([opts])

Returns a through stream. Discards all files piped into the stream, before pushing the manifest JSON file into the stream. `opts` takes the following keys:
- `filename` &mdash; The name of the manifest file. Defaults to `manifest.json`.
- `clean` &mdash; Set to `false` to pass all files through the stream rather than dropping them. Defaults to `true`.

### revver.interpolate([opts])

Returns a through stream. Interpolate revved paths into the `file.contents` of files piped into the stream. Pass in `opts.interpolateRegex` or `opts.interpolateCallback` to override what had been set in the constructor.

### revver.getHashes([opts])

Returns an object literal that maps the original file paths (without the file extensions) to their hashes. If `opts.prefix` is specified:
- Only original file paths starting with the prefix will be included in the returned result.
- The prefix will be trimmed off the original file paths in the result.

## Installation

Install via [npm](https://npmjs.com/):

```
$ npm i --save-dev revver
```

## License

[MIT](LICENSE.md)
