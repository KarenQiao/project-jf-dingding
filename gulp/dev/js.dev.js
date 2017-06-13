/**
 * Created by Qiaodan on 2017/6/12.
 */

/**脚本合并
 * 开发*/

var gulp = require('gulp'),

    concatDir = require('gulp-concat-dir'),//按文件夹合并

    connect = require('gulp-connect'),//服务器

    concat = require("gulp-concat"),//文件合并

    rename = require("gulp-rename");//重命名

   uglify=require('gulp-uglify')


function devJs(){

    gulp.src(['src/**/*.js','!src/**/dingding.js'])

        .pipe(gulp.dest('build'))

        .pipe(connect.reload());

    gulp.src('src/**/dingding.js')

        .pipe(gulp.dest('build'))

        .pipe(uglify())

        .pipe(rename({suffix: '.min'}))

        .pipe(gulp.dest('build'))

        .pipe(connect.reload());


    gulp.src('src/**/*.json')

        .pipe(gulp.dest('build'))

        .pipe(connect.reload());


}


module.exports = devJs;
