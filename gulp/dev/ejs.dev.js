/**
 * Created by Qiaodan on 2017/6/12.
 */


var gulp = require('gulp'),

    ejs = require('gulp-ejs'),//ejs模板

    cheerio = require('gulp-cheerio'),//批量更换html中的引用

    connect = require('gulp-connect'),//服务器

    rename = require("gulp-rename");//重命名

var bom = require('gulp-bom');//解决UTF-8文件是采用无BOM


function devEjs(){

    gulp.src('src/view/**/*.{ejs,html}')

        .pipe(ejs())

       /* //增加样式文件
        .pipe(cheerio(function($){

            var addCss="\n<link rel='stylesheet'  href='../../css/dingding.min.css'/>\n";

            $('head').append(addCss)

        }))*/

        .pipe(cheerio({
            run:function($){

                var addCss="\n<link rel='stylesheet'  href='../../css/dingding.min.css'/>\n";

                $('head').append(addCss)
            },

            parserOptions: {
                // Options here
                decodeEntities: false
            }
        }))
        //顺序增加脚本文件
        .pipe(cheerio(function($){
            var addJsMain = '\n<script src="../../js/jquery-3.0.0.min.js"></script>\n<script src="../../js/fastclick.js"></script>\n<script src="../../js/dingding.min.js"></script>\n';//主要的脚本文件

            var addJsHtml="";//保存用的业务脚本

            var addJsRun="<script>\n";//运行的脚本

            var addJsHtmlHead="<script src='";

            var addJSHtmlBottom = "'></script>\n";

            $('script').each(function(index,ele){

                if($(this).attr('src')){

                    addJsHtml+=addJsHtmlHead+$(this).attr('src')+addJSHtmlBottom;

                }else {
                    addJsRun += $(this).html() + '\n';
                }

            })

            addJsRun += "\n</script>\n";

            $('script').remove();

            $('body').append(addJsMain);

            $('body').append(addJsHtml);

            $('body').append(addJsRun);




        }))

        .pipe(rename({
            extname:".html"
        }))
        .pipe(gulp.dest('build/html'))//输出到bulid文件夹

        .pipe(bom())//不乱码

        .pipe(connect.reload())

}



module.exports=devEjs;
