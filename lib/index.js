/**
 * maelstrom-js | lib/index.js
 *
 * Streams:
 * ✓ concat: concat multiple js files + uglify
 * ✓ lint: lint with jshint + code style check with jscs
 * - test: execute js test files with mocha + chai
 * - bundle: bundle js files with browserify + babel
 *
 * Tasks:
 * - js
 * ✓ js:concat
 * ✓ js:lint
 * - js:test
 * - js:clean
 * - js:bundle
 */
'use strict';

const Maelstrom = require('maelstroM');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const $plugin = new Maelstrom.Plugin(__filename, ['js', 'script'],
{
    /**
     * Return the location of the JavaScript source files.
     */
    src: function($src)
    {
        let $defaultSrc = Maelstrom.config.src.js + '/**/*.js';
        return Maelstrom.utils.extendArgs($src, $defaultSrc);
    },

    /**
     * Return the location of the JavaScript output folder.
     */
    dest: function()
    {
        return Maelstrom.config.dest.js;
    },

    /**
     * Add files to concat to config
     */
    concat: function($destFile, $srcFiles)
    {
        Maelstrom.config.js.concat[$destFile] = $srcFiles;
    }
});

// -----------------------------------------------------------------------------

/**
 * Concatenate JavaScript files and further uglify the result when not
 * `--dev`.
 */
$plugin.setStream('./streams/concat.js');

/**
 * Lint JavaScript files with _jshint_ and display the results with
 * _jshint-stylish_.
 */
$plugin.setStream('./streams/lint.js');

// -----------------------------------------------------------------------------

/**
 * Execute the `js:lint` and `js:concat` tasks.
 */
/*$plugin.setTask('default', function()
{
    // read files in /assets/js dir
    // check wich files are not in jsConcat
    // export only those files to /public/js
    // concat all other files according to jsConcat

    // Maelstrom.task('js:lint');
    // Maelstrom.task('js:concat');

    // return RunSequence($plugin.getTaskNames('lint', 'concat'));
    return RunSequence('js:lint', 'js:concat');
});*/

/**
 * Concatenate JavaScript files according to the `jsConcat` config option.
 * The result will be further uglified when not `--dev`.
 */
$plugin.setTask('./tasks/concat.js', [
                    Maelstrom.TASK_WATCH,
                    Maelstrom.TASK_COMPILE]);

/**
 * Lint the JavaScript files located in the `src.js` folder with _jshint_
 * and display the results with _jshint-stylish_.
 */
$plugin.setTask('./tasks/lint.js', [
                    Maelstrom.TASK_WATCH,
                    Maelstrom.TASK_LINT]);

/**
 */
// $plugin.setTask('js:test', function()
// {
//     return Maelstrom.gulp.src( self.src() )
//         .pipe( Maelstrom.stream('plumber') )
//         .pipe( $plugin.stream('test') );
// });

/**
 * Clean the CSS output dir from all excess files.
 */
$plugin.setTask('clean', [Maelstrom.TASK_CLEAN], function()
{
    Maelstrom.stream('clean', $plugin.dest());
});

// -----------------------------------------------------------------------------

module.exports = $plugin;
