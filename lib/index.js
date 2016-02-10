/**
 * maelstrom-js | lib/index.js
 *
 * Streams:
 * ✓ concat
 * ✓ lint
 * - test
 *
 * Tasks:
 * - js
 * ✓ js:concat
 * ✓ js:lint
 * - js:test
 * - js:clean
 */
'use strict';

const _               = require('underscore');
const Confirge        = require('confirge');
const GulpConcat      = require('gulp-concat');
const GulpIf          = require('gulp-if');
const GulpJsCs        = require('gulp-jscs');
const GulpJsCsStylish = require('gulp-jscs-stylish');
const GulpJsHint      = require('gulp-jshint');
const GulpSize        = require('gulp-size');
const GulpSourceMaps  = require('gulp-sourcemaps');
const GulpUglify      = require('gulp-uglify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom = this;
    const Config    = Maelstrom.config;
    const Gulp      = Maelstrom.gulp;
    const Utils     = Maelstrom.utils;

    // -------------------------------------------------------------------------

    let $plugin = new Maelstrom.Plugin(__filename, 'js',
    {
        /**
         * Return the location of the JavaScript source files.
         */
        src: function($src)
        {
            let $defaultSrc = Config.src.js + '/**/*.js';
            return Utils.extendArgs($src, $defaultSrc);
        },

        /**
         * Return the location of the JavaScript output folder.
         */
        dest: function()
        {
            return Config.dest.js;
        },

        /**
         * Add files to concat to config
         */
        concat: function($destFile, $srcFiles)
        {
            Config.js.concat[$destFile] = $srcFiles;
        }
    });

    // -------------------------------------------------------------------------

    /**
     * Concatenate JavaScript files and further uglify the result when not
     * `--dev`.
     */
    $plugin.addStream('concat', function($destFile)
    {
        // make sure the dest filename has a js file extension
        if ($destFile.substr($destFile.length - 3) !== '.js')
        {
            $destFile += '.js';
        }

        let $stream = GulpConcat($destFile);
        if (Utils.isProd())
        {
            $stream.pipe( GulpUglify(Config.js.uglify) );
        }

        return $stream;
    });

    /**
     * Lint JavaScript files with _jshint_ and display the results with
     * _jshint-stylish_.
     */
    $plugin.addStream('lint', function()
    {
        let $config = Confirge.read(Config.js.jshintFile);
        $config = Confirge.extend({}, Config.js.jshint, $config);

        let $stream = GulpJsHint($config);
        $stream.pipe( GulpJsCs(Config.js.jscs) )
            .on('error', Utils.noop);

        $stream.pipe( GulpJsCsStylish.combineWithHintResults() );
        $stream.pipe( GulpJsHint.reporter('jshint-stylish') );

        return $stream;
    });

    // -------------------------------------------------------------------------

    /**
     * Execute the `js:lint` and `js:concat` tasks.
     */
    $plugin.addTask('js', function()
    {
        // read files in /assets/js dir
        // check wich files are not in jsConcat
        // export only those files to /public/js
        // concat all other files according to jsConcat

        // Maelstrom.task('js:lint');
        // Maelstrom.task('js:concat');

        const RunSequence = require('run-sequence').use(Gulp);

        return RunSequence('js:lint', 'js:concat');
    });

    /**
     * Concatenate JavaScript files according to the `jsConcat` config option.
     * The result will be further uglified when not `--dev`.
     */
    $plugin.addTask('js:concat', function()
    {
        let $concat           = Config.js.concat;
        let $createSourceMaps = (Config.js.sourcemaps !== false);

        if (!_.isEmpty($concat))
        {
            for (let $destFile in $concat)
            {
                if (!$concat.hasOwnProperty($destFile))
                {
                    continue;
                }

                let $srcFiles = $concat[$destFile];

                Gulp.src($srcFiles)
                    .pipe( Maelstrom.stream('plumber') )

                    .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                                  GulpSourceMaps.init()) )
                    .pipe( $plugin.stream('concat', [$destFile]) )
                    .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                                  GulpSourceMaps.write()) )

                    // .pipe( GulpSize(Config.main.size) )
                    .pipe( Maelstrom.stream('size') )
                    .pipe( Gulp.dest($plugin.dest()) );
            }
        }
    });

    /**
     * Lint the JavaScript files located in the `src.js` folder with _jshint_
     * and display the results with _jshint-stylish_.
     */
    $plugin.addTask('js:lint', function()
    {
        return Gulp.src( $plugin.src() )
            .pipe( Maelstrom.stream('plumber') )
            .pipe( $plugin.stream('lint') );
    });

    /**
     */
    // this.addTask('js:test', function()
    // {
    //     return Gulp.src( self.src() )
    //         .pipe( Maelstrom.stream('plumber') )
    //         .pipe( self.stream('test') );
    // });


    return $plugin;
};
