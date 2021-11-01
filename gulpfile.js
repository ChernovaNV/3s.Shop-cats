const {src, dest, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const fileInclude = require('gulp-file-include');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-image');
const { readFileSync } = require('fs');
const concat = require('gulp-concat');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

let isProd = false; // dev by default

const clean = () => {
	return del(['./dist/*'])
}


const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg" 
        }
      },
    }))
    .pipe(dest('./dist/img'));
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest('./dist/css/'))
    .pipe(browserSync.reload({stream: true}));
};

const stylesBackend = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass().on("error", notify.onError()))
    .pipe(autoprefixer({
      cascade: false,
		}))
		.pipe(dest('./dist/css/'))
};

const scripts = () => {
	// src('./src/js/vendor/**.js')
	// 	// .pipe(concat('vendor.js'))
	// 	.pipe(gulpif(isProd, uglify().on("error", notify.onError())))
	// 	.pipe(dest('./dist/js/'))
  return src(
    ['./src/js/global.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(gulpif(!isProd, sourcemaps.init()))
		.pipe(babel({
			presets: ['@babel/env']
		}))
    .pipe(concat('main.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
    .pipe(gulpif(!isProd, sourcemaps.write('.')))
    .pipe(dest('./dist/js'))
    .pipe(browserSync.reload({stream: true}));
}

const scriptsBackend = () => {
	src('./src/js/vendor/**.js')
    .pipe(concat('vendor.js'))
    .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
		.pipe(dest('./dist/js/'))
	return src(['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
    .pipe(dest('./dist/js'))
};

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./dist'))
}

const images = () => {
  return src([
		'./src/img/**.jpg',
		'./src/img/**.png',
		'./src/img/**.jpeg',
		'./src/img/*.svg',
		'./src/img/**/*.jpg',
		'./src/img/**/*.png',
		'./src/img/**/*.jpeg'
		])
    .pipe(gulpif(isProd, image()))
    .pipe(dest('./dist/img'))
};

const fonts = (cb) => {
	src('./src/fonts/**/*.{eot,woff,woff2,ttf,svg}')
		.pipe(ttf2woff())
		.pipe(dest('dist/fonts/'))
		.pipe(browserSync.reload({ stream: true }))
	return src('./src/fonts/**/*.{eot,woff,woff2,ttf,svg}')
		.pipe(ttf2woff2())
		.pipe(dest('dist/fonts/'))
		.pipe(browserSync.reload({stream: true}));

	cb();
}

//const htmlInclude = () => {
//  return src(['./src/*.html'])
//    .pipe(fileInclude({
//      prefix: '@',
//      basepath: '@file'
//    }))
//    .pipe(dest('./dist'))
//    .pipe(browserSync.reload({stream: true}));
//}

const pugs = () => {
  return src('./src/pug/*.pug')
    .pipe(gulpif(isProd, pug()))
    .pipe(gulpif(!isProd, pug({pretty: true})))
    .pipe(dest('./dist'))
    .pipe(browserSync.reload({stream: true}));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  //watch('./src/partials/*.html', htmlInclude);
  //watch('./src/*.html', htmlInclude);
  watch('./src/pug/**/*.pug', pugs);
  watch('./src/resources/**', resources);
  watch('./src/img/*.{jpg,jpeg,png,svg}', images);
	watch('./src/img/**/*.{jpg,jpeg,png}', images);
  watch('./src/img/svg/**.svg', svgSprites);
  watch('./src/fonts/**/*.{eot,woff,woff2,ttf,svg}', fonts);
}

const cache = () => {
  return src('dist/**/*.{css,js,svg,png,jpg,jpeg,woff2}', {
    base: 'dist'})
    .pipe(rev())
    .pipe(revDel())
		.pipe(dest('dist'))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest('dist'));
};

const rewrite = () => {
  const manifest = readFileSync('dist/rev.json');
	src('dist/css/*.css')
		.pipe(revRewrite({
      manifest
    }))
		.pipe(dest('dist/css'));
  return src('dist/**/*.html')
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest('dist'));
}

const htmlMinify = () => {
	return src('dist/**/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist'));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, pugs, scripts, styles, resources, images, svgSprites, fonts, watchFiles);

exports.build = series(toProd, clean, pugs, scripts, styles, resources, images, svgSprites, fonts, htmlMinify);

exports.cache = series(cache, rewrite);

exports.backend = series(toProd, clean, pugs, scriptsBackend, stylesBackend, resources, images, fonts, svgSprites);
