'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

function _mocha() {
    return gulp.src('src/**/*.js')
        .pipe(istanbul({ includeUntested: true }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(['test/unit/**/*.js'], { read: false })
                .pipe(mocha())
                .pipe(istanbul.writeReports());
        });
}

gulp.task('test', _mocha);
