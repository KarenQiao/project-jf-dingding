/**
 * Created by Qiaodan on 2017/6/12.
 */


/**图片压缩
 * 开发*/


var gulp = require('gulp'),

    imagemin = require('gulp-imagemin'),//图片压缩

    pngquant = require('imagemin-pngquant'),//png压缩

    cache = require('gulp-cache');//缓存

function devImg(){
    gulp.src('src/images/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,

            svgoPlugins: [{removeViewBox: false}],

            use: [pngquant()]
        })))
        .pipe(gulp.dest('build/images'));
}

module.exports=devImg;

