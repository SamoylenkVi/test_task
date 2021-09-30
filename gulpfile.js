const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const csso = require("gulp-csso");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const uglify = require("gulp-uglify-es").default;
const del = require("del");

// minStyles

const minStyles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.minStyles = minStyles;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
}

exports.styles = styles;

//normalize

const normalize = () => {
  return gulp.src("source/css/vendor/*.css")
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("normalize.min.css"))
    .pipe(gulp.dest("build/css/vendor"))
}

exports.normalize = normalize;

//Images

const images = () => {
  return gulp.src("source/img/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

//Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

//Webp

const createwebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}

exports.createwebp = createwebp;

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true,
      ignoreCustomFragments: [/(\s\<br\>|\<br\>\s)/gi]
    }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream())
}

exports.html = html;

// script

const script = () => {
  return gulp.src("source/js/script.js")
    .pipe(rename("script.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.script = script;

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/img/*.{jpg,png,svg}"
  ],
    {
      base: "source"
    })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("minStyles"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/*.js", gulp.series("script"));
}

//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    script,
    minStyles,
    styles,
    normalize,
    html,
    copy,
    sprite,
    images,
    createwebp
  )
)

exports.build = build;

exports.default = gulp.series(
  build,
  server,
  watcher
)
