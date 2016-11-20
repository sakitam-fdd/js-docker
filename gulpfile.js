var gulp = require('gulp');
var concat = require('gulp-concat');                   // 合并文件
var rename = require('gulp-rename');                   // 重命名
var minifyCss = require('gulp-minify-css');            // 压缩CSS；
var sass = require('gulp-ruby-sass');			             // 编译scss

var src = {
    scss: 'src/scss/*.scss',
    css: 'src/dist/css/',
    compressCss: 'src/dist/css/*.css',
    minCss: 'src/dist/minCss/',
    html: 'src/app/tpl/*.html'
};

// sass任务
gulp.task('sass', function () {
    return sass(src.scss, {style: 'expanded', noCache: true})
        .pipe(gulp.dest(src.css))
});

//合并压缩css
gulp.task('minifyCss', ['sass'], function () {
    return gulp.src(src.compressCss)		    //监听对象文件
        .pipe(concat('main.css'))			//指定合并后的文件名
        .pipe(gulp.dest(src.minCss))		//指定合并后生成文件的输出目录
        .pipe(minifyCss())					//执行压缩
        .pipe(rename('main.min.css'))		//压缩后的文件名
        .pipe(gulp.dest(src.minCss));		//压缩后生成文件的输出目录
});

gulp.task('default', ['sass', 'minifyCss'], function () {
});
