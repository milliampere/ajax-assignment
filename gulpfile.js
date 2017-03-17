const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babel = require('gulp-babel');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');


/* Browser Sync and gulp.watch() */
gulp.task('default', ['sass', 'babel'], () => {
    browserSync.init({																				// Init server
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./*.html").on('change', browserSync.reload);	// Watch for changes, reload browser

    gulp.watch('./src/scss/**/*.scss', ['sass']);							// Watch for changes, run sass-task
    gulp.watch('./src/js/*.js', ['babel']);										// Watch for changes, run babel-task
});


/* Sass-task */
gulp.task('sass', () => {
  const postcssPlugins = [                                    // Postcss plugins: 
    autoprefixer({browsers: ['last 2 versions']}),            // Autoprefix
    cssnano()                                                 // CSS minifier (remove extraneous whitespace)
  ];
	return gulp.src('./src/scss/**/*.scss')											// Get files with gulp.src()
		.pipe(sass().on('error', sass.logError)) 									// Convert Sass to CSS with sass()	
    .pipe(postcss(postcssPlugins))
		.pipe(rename({suffix: '.min'}))														// Add suffix .min with rename()
		.pipe(gulp.dest('./dist/css'))														// Save files in dist/css with gulp.dest()
		.pipe(browserSync.stream());															// Tell browser-sync, our localhost, to update the browser
});


/* Babel-task (Browserify) */
gulp.task('babel', () => {
  browserify({
      entries: './src/js/main.js',								// The input file
      debug: true
  })
  .transform(babelify, { presets: ['latest'] })		// Babelify = babel but for browserify
  .on('error',gutil.log)
  .bundle()																				// Pack files together with bundle()
	.on('error',gutil.log)
	.pipe(source('bundle.js'))											// Convert to bundle.js
	.pipe(gulp.dest('dist/js'));										// Save file
});