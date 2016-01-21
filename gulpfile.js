'use strict';

require('babel-register');

var gulp = require('gulp');
require('./gulp/linting');
require('./gulp/test');
require('./gulp/package');

gulp.task('default', ['lint', 'test', 'package']);
