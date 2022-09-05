const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

function defaultTask(cb){
    // 任務
    console.log('start');
    cb();
}

exports.task = defaultTask;

// 任務A
function taskA(cb){
    console.log('a task');
    cb();
};

// 任務B
function taskB(cb){
    console.log('b task');
    cb();
};

// 同時執行 A B 任務
exports.sync = parallel(taskA, taskB);

// 先執行A 再執行B
exports.async = series(taskA, taskB);

// src dest
function move(){
    return src('*.html').pipe(dest('dist'));
}

exports.m = move


// js rename
const rename = require('gulp-rename');
// js ugilfy
const uglify = require('gulp-uglify');

function Jsminify(){
    return src('js/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest('dist/js'))
}

exports.uglify = Jsminify; 



const cleanCSS = require('gulp-clean-css');   // css minify (壓縮)

function cssminify(){
    return src('sass/*.css')
    // return src('dist/css/*.css')
    // return src(['dist/css/*.css', '!dist/css/style.min.css'])
    .pipe(cleanCSS())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(dest('dist/css'));
    // .pipe(dest('dist/css/mini'));
}

exports.css = cssminify


// sass
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

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


// html 壓縮
const fileinclude = require('gulp-file-include');

function includeHTML() {
    return src('*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./dist'));
}

exports.html = includeHTML;


// 即時同步
function w(){
    watch(['*.html','layout/*.html'] , includeHTML)
    watch(['sass/*.scss','sass/**/*.scss'] , sassstyle)
}

exports.watchall = w

// 圖片
function img_move(){
    return src(['images/*.*' , 'images/**/*.*']).pipe(dest('dist/images'))
}

// 瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;

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

// exports.default = browser;
exports.default = series(parallel(includeHTML,sassstyle,img_move, Jsminify) ,browser);






