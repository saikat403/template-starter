const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

// Task to include partials in HTML
gulp.task('html', function () {
    return gulp.src(['src/*.html']) // Source HTML files
        .pipe(fileInclude({
            prefix: '@@', // Syntax for includes
            basepath: '@file' // Relative path for partials
        }))
        .pipe(gulp.dest('dist')) // Output to dist folder
        .pipe(browserSync.stream()); // Inject changes without a full page reload
});

// Task to copy CSS files to dist folder
gulp.task('css', function () {
    console.log("Copying CSS files...");  // Debugging statement
    return gulp.src('src/css/**/*.css') // Source CSS files
        .pipe(gulp.dest('dist/css')) // Output CSS files to dist/css
        .pipe(browserSync.stream()); // Inject changes without a full page reload
});

// Task to copy assets (images, fonts, etc.) to dist folder
gulp.task('assets', function () {
    return gulp.src('src/assets/**/*') // Source assets files (all types inside assets folder)
        .pipe(gulp.dest('dist/assets')); // Output assets files to dist/assets
});

// Watch task for changes in HTML, CSS, and asset files
gulp.task('watch', function () {
    gulp.watch('src/**/*.html', gulp.series('html')); // Watch HTML files
    gulp.watch('src/css/**/*.css', gulp.series('css')); // Watch CSS files
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
    gulp.watch('src/css/**/*.css', gulp.series('css')); // Watch for CSS changes and rebuild
    gulp.watch('src/assets/**/*', gulp.series('assets')); // Watch for asset changes and rebuild
    gulp.watch('src/**/*.html').on('change', browserSync.reload); // Reload browser on HTML changes
    gulp.watch('src/css/**/*.css').on('change', browserSync.reload); // Reload browser on CSS changes
    gulp.watch('src/assets/**/*').on('change', browserSync.reload); // Reload browser on asset changes
});

// Default task to build, watch, and serve
gulp.task('default', gulp.series('html', 'css', 'assets', 'serve', 'watch'));
