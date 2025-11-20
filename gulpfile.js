const gulp = require("gulp");
const less = require("gulp-less");
const autoprefixerPlugin =
  require("gulp-autoprefixer").default || require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const { deleteAsync } = require("del");
const browserSync = require("browser-sync").create();

// Пути
const paths = {
  src: {
    html: "*.html",
    less: "less/**/*.less",
    js: "js/**/*.js",
    img: "img/**/*",
    fonts: "fonts/**/*",
    css: "css/**/*.css",
  },
  dist: {
    base: "docs",
    html: "docs",
    css: "docs/css",
    js: "docs/js",
    img: "docs/img",
    fonts: "docs/fonts",
  },
};

// Очистка папки docs
function clean() {
  return deleteAsync([paths.dist.base + "/**/*", "!" + paths.dist.base]);
}

// Копирование HTML
function html() {
  return gulp
    .src(paths.src.html)
    .pipe(gulp.dest(paths.dist.html))
    .pipe(browserSync.stream());
}

// Компиляция LESS в CSS
function styles() {
  return gulp
    .src("less/style.less")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      less({
        javascriptEnabled: true,
      })
    )
    .pipe(autoprefixerPlugin())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Копирование JS файлов (без объединения, так как они подключены отдельно в HTML)
function scripts() {
  return gulp
    .src(paths.src.js)
    .pipe(plumber())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}

// Копирование изображений
function images() {
  return gulp
    .src(paths.src.img)
    .pipe(gulp.dest(paths.dist.img))
    .pipe(browserSync.stream());
}

// Копирование шрифтов
function fonts() {
  return gulp
    .src(paths.src.fonts)
    .pipe(gulp.dest(paths.dist.fonts))
    .pipe(browserSync.stream());
}

// Копирование существующих CSS файлов (если есть)
function copyCSS() {
  return gulp
    .src(paths.src.css)
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Задача для разработки
function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist.base,
    },
    port: 3000,
    notify: false,
  });

  gulp.watch(paths.src.html, html);
  gulp.watch(paths.src.less, styles);
  gulp.watch(paths.src.js, scripts);
  gulp.watch(paths.src.img, images);
  gulp.watch(paths.src.fonts, fonts);
  gulp.watch(paths.src.css, copyCSS);
}

// Сборка для продакшена
const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, fonts, copyCSS)
);

// Экспорт задач
exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.copyCSS = copyCSS;
exports.build = build;
exports.serve = gulp.series(build, serve);
exports.default = build;
