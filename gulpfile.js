const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass')); // Import gulp-sass and sass

// Task to include partials in HTML
gulp.task('html', function () {
    return gulp.src(['src/*.html', 'src/admin/*.html']) // Include both root and admin HTML files
        .pipe(fileInclude({
            prefix: '@@', // Syntax for includes
            basepath: '@file' // Relative path for partials
        }))
        .pipe(gulp.dest(function (file) {
            // Place HTML files from admin directory in the 'dist/admin/' folder
            if (file.path.includes('src/admin/')) {
                return 'dist/admin'; // Output to dist/admin folder for admin files
            }
            return 'dist'; // Other files go to the root dist folder
        }))
        .pipe(browserSync.stream()); // Inject changes without a full page reload
});

// Task to compile SCSS to CSS
gulp.task('scss', function () {
    return gulp.src('src/scss/**/*.scss') // Source SCSS files
        .pipe(sass().on('error', sass.logError)) // Compile SCSS to CSS and handle errors
        .pipe(gulp.dest('dist/css')) // Output compiled CSS to dist/css
        .pipe(browserSync.stream()); // Inject changes without a full page reload
});

// Task to copy assets (images, fonts, etc.) to dist folder
gulp.task('assets', function () {
    return gulp.src('src/assets/**/*') // Source assets files (all types inside assets folder)
        .pipe(gulp.dest('dist/assets')); // Output assets files to dist/assets
});

// Watch task for changes in HTML, SCSS, and asset files
gulp.task('watch', function () {
    gulp.watch('src/**/*.html', gulp.series('html')); // Watch HTML files
    gulp.watch('src/scss/**/*.scss', gulp.series('scss')); // Watch SCSS files
    gulp.watch('src/assets/**/*', gulp.series('assets')); // Watch assets files
});

// Task to initialize Browsersync and serve files
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: 'dist' // Serve files from the dist folder
        }
    });

    gulp.watch('src/**/*.html', gulp.series('html')); // Watch for HTML changes and rebuild
    gulp.watch('src/scss/**/*.scss', gulp.series('scss')); // Watch for SCSS changes and rebuild
    gulp.watch('src/assets/**/*', gulp.series('assets')); // Watch for asset changes and rebuild
    gulp.watch('src/**/*.html').on('change', browserSync.reload); // Reload browser on HTML changes
    gulp.watch('src/scss/**/*.scss').on('change', browserSync.reload); // Reload browser on SCSS changes
    gulp.watch('src/assets/**/*').on('change', browserSync.reload); // Reload browser on asset changes
});

// Default task to build, watch, and serve
gulp.task('default', gulp.series('html', 'scss', 'assets', 'serve', 'watch'));
