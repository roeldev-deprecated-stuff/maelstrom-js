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

const _               = require('lodash');
const Confirge        = require('confirge');
const GulpConcat      = require('gulp-concat');
const GulpIf          = require('gulp-if');
const GulpJsCs        = require('gulp-jscs');
const GulpJsCsStylish = require('gulp-jscs-stylish');
const GulpJsHint      = require('gulp-jshint');
const GulpSize        = require('gulp-size');
const GulpSourceMaps  = require('gulp-sourcemaps');
const GulpUglify      = require('gulp-uglify');
const Maelstrom       = require('maelstrom');
const RunSequence     = require('run-sequence').use(Maelstrom.gulp);

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const $plugin = new Maelstrom.Plugin(__filename, 'js',
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
$plugin.setStream('concat', function($destFile)
{
    // make sure the dest filename has a js file extension
    if ($destFile.substr($destFile.length - 3) !== '.js')
    {
        $destFile += '.js';
    }

    let $stream = GulpConcat($destFile);
    if (Maelstrom.utils.isProd())
    {
        $stream.pipe( GulpUglify(Maelstrom.config.js.uglify) );
    }

    return $stream;
});

/**
 * Lint JavaScript files with _jshint_ and display the results with
 * _jshint-stylish_.
 */
$plugin.setStream('lint', function()
{
    let $config = Confirge.read(Maelstrom.config.js.jshintFile);
    $config = Confirge.extend({}, Maelstrom.config.js.jshint, $config);

    let $stream = GulpJsHint($config);
    $stream.pipe( GulpJsCs(Maelstrom.config.js.jscs) )
        .on('error', Maelstrom.utils.noop);

    $stream.pipe( GulpJsCsStylish.combineWithHintResults() );
    $stream.pipe( GulpJsHint.reporter('jshint-stylish') );

    return $stream;
});

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
$plugin.setTask('concat',
                [Maelstrom.TASK_WATCH, Maelstrom.TASK_COMPILE],
                function()
{
    let $concat           = Maelstrom.config.js.concat;
    let $createSourceMaps = (Maelstrom.config.js.sourcemaps !== false);

    if (!_.isEmpty($concat))
    {
        for (let $destFile in $concat)
        {
            if (!$concat.hasOwnProperty($destFile))
            {
                continue;
            }

            let $srcFiles = $concat[$destFile];

            // console.log($destFile, $srcFiles, $plugin.dest());

            Maelstrom.gulp.src($srcFiles)
                .pipe( Maelstrom.stream('plumber') )

                .pipe( GulpIf(Maelstrom.utils.isDev() && $createSourceMaps,
                              GulpSourceMaps.init()) )
                .pipe( $plugin.stream('concat', [$destFile]) )
                .pipe( GulpIf(Maelstrom.utils.isDev() && $createSourceMaps,
                              GulpSourceMaps.write()) )

                .pipe( Maelstrom.stream('size') )
                .pipe( Maelstrom.gulp.dest($plugin.dest()) );
        }
    }
});

/**
 * Lint the JavaScript files located in the `src.js` folder with _jshint_
 * and display the results with _jshint-stylish_.
 */
$plugin.setTask('lint', [Maelstrom.TASK_LINT], function()
{
    return Maelstrom.gulp.src( $plugin.src() )
        .pipe( Maelstrom.stream('plumber') )
        .pipe( GulpIf(Maelstrom.config.js.lint, $plugin.stream('lint')) );
});

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
