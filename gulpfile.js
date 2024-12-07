
const gulp = require("gulp");
const less = require("gulp-less");

function css(cb) {
    return gulp.src("less/myriadsong.less")
        .pipe(less())
        .pipe(gulp.dest("./styles"));
        cb();

}

css.description = "Generates CSS file from component less files.";
gulp.task("css", css);

function watchUpdates () {
    gulp.watch(["less/*.less"], css);
}

