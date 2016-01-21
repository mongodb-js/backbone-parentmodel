'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');

function lint(files) {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jscs())
        .pipe(jscs.reporter());
}

function fix(files, dest) {
    return gulp.src(files)
        .pipe(jscs({ fix: true }))
        .pipe(gulp.dest(dest));
}

gulp.task('lint-src', () => {
    return lint(['src/**/*.js']);
});

gulp.task('lint-test', () => {
    return lint(['test/**/*.js']);
});

gulp.task('fix-src', () => {
    return fix(['src/**/*.js'], 'src');
});

gulp.task('fix-test', () => {
    return fix(['test/**/*.js'], 'test');
});

gulp.task('lint', ['lint-src', 'lint-test']);

gulp.task('fix', ['fix-src', 'fix-test']);
