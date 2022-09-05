const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');


// js rename
const rename = require('gulp-rename');
// js ugilfy
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');   // css minify (壓縮)
// sass
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
// html
const fileinclude = require('gulp-file-include');
// 瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;
// 圖片
const imagemin = require('gulp-imagemin');
// 降轉 babel es6 - > es5
const babel = require('gulp-babel');
// 清除舊檔案
const clean = require('gulp-clean');


// js
function Jsminify(){
    return src('js/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest('dist/js'))
}

exports.uglify = Jsminify; 


// 降轉 babel es6 - > es5
function babel5() {
    return src('js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'));
}

exports.js_update = babel5;


// sass
function sassstyle(){
    return src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    //.pipe(cleanCSS())   // sass minify (壓縮)
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
}

exports.style = sassstyle
// exports.style = series(sassstyle, cssminify)


// html 
function includeHTML() {
    return src('*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist'));
}

exports.html = includeHTML;


// 圖片
function img_move(){
    return src(['images/*.*' , 'images/**/*.*']).pipe(dest('dist/images'))
}

// mini images
function min_images(){
    return src('images/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 70, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('dist/images'))
}

exports.images_online = min_images; 


// 清除舊檔案
function clear() {
    return src('dist' ,{ read: false ,allowEmpty: true })//不去讀檔案結構，增加刪除效率  / allowEmpty : 允許刪除空的檔案
    .pipe(clean({force: true})); //強制刪除檔案 
}

exports.cls = clear;


// 瀏覽器同步
function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['*.html','layout/*.html'] , includeHTML).on('change' ,reload)
    watch(['sass/*.scss','sass/**/*.scss'] , sassstyle).on('change' ,reload)
    watch(['images/*.*' , 'images/**/*.*'], img_move).on('change' ,reload)
    watch('js/*.js', Jsminify).on('change' ,reload)
    done();
}

// 執行
// exports.default = browser;
exports.default = series(parallel(includeHTML,sassstyle,img_move, Jsminify) ,browser);


exports.online = series(clear, parallel(includeHTML, sassstyle, min_images, babel5));



