# revver [![npm Version](http://img.shields.io/npm/v/revver.svg?style=flat)](https://www.npmjs.org/package/revver) [![Build Status](https://img.shields.io/travis/yuanqing/revver.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/revver) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/revver.svg?style=flat)](https://coveralls.io/r/yuanqing/revver)

> Asset versioning by appending a content hash to the filename. Similar to [`gulp-rev`](https://github.com/sindresorhus/gulp-rev).

- In-memory manifest that persists across Gulp tasks.
- Interpolate revved paths via `revver.interpolate()`, and specify a callback if you want to modify the revved path (eg. add a prefix).

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

Initialise a `revver`. Note that `opts` is an object literal that takes the following keys:
- `manifest` &mdash; An object literal that maps the original file paths to the revved file paths. Defaults to `{}`.
- `interpolateRegex` &mdash; The regular expression used by the `interpolate` method. Defaults to `/{{\s*([^}]+?)\s*}}/g`.
- `interpolateCallback` &mdash; A callback for modifying the interpolated value in the `interpolate` method. Defaults to the identity function.

### revver.rev()

Returns a through stream. Computes a hash of each file&rsquo;s `contents` and appends said hash to the file&rsquo;s basename. For example, an initial `file.path` of `bundle.js` might become `bundle-d41d8cd98f.js`.

### revver.manifest([opts])

Returns a through stream. Discards all files piped into the stream, before pushing the manifest JSON file into the stream.

`opts` is an object literal that takes the following keys:
- `filename` &mdash; The name of the manifest file. Defaults to `manifest.json`.
- `clean` &mdash; Set to `false` to pass all files down the stream (rather than discarding them). Defaults to `true`.

### revver.interpolate()

Returns a through stream. Interpolate revved paths in the manifest into the `file.contents` of each file in the stream. Modify the behavior of this method via `opts.interpolateRegex` and `opts.interpolateCallback` ([specified in the constructor](#var-revver--new-revveropts)).

### revver.getHashes([prefix])

Returns a mapping of the original file paths (but without the file extensions) to their hashes. If a `prefix` is specified:
- Only original file paths with the `prefix` will be included in the result.
- The prefix will be trimmed off the original file paths in the result.

Read the [test](test/get-hashes.js).

## Installation

Install via [npm](https://npmjs.com/):

```
$ npm i --save-dev revver
```

## License

[MIT](LICENSE.md)
