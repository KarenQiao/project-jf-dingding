/**
 * Created by Qiaodan on 2017/6/12.
 */


var gulp=require('gulp');

//服务器
var devServer=require('./gulp/dev/server.dev.js');

gulp.task('connect',devServer);


//less文件
var devLess=require('./gulp/dev/less.dev.js');

gulp.task('changeLessDev',devLess);


//Js合并，开发
var devJs=require('./gulp/dev/js.dev.js');
gulp.task('changeJsDev',devJs);

//ejs模板引擎 html 开发
var devEjs = require('./gulp/dev/ejs.dev.js');

gulp.task('fileIncludeDev', devEjs);


//图片压缩 开发
var devImg = require('./gulp/dev/img.dev.js');

gulp.task('imageMinDev',devImg);


//监听文件变化
gulp.task('devWatch',function () {

    //less文件修改 ，注入css
    gulp.watch('src/component/**/*.less', ['changeLessDev']);

    //图片文件修改 ，注入css
    gulp.watch(['src/images/**/*.*'], ['imageMinDev']);

    //html,js文件修改，重新拼接，刷新
    gulp.watch(['src/**/*.ejs', 'src/**/*.html'], ['fileIncludeDev']);

    //html,js文件修改，重新拼接，刷新
    gulp.watch(['src/**/*.js'], ['changeJsDev'])

});

//开发环境
gulp.task('myServer',['devWatch','connect','imageMinDev','changeLessDev','changeJsDev','fileIncludeDev']);


