/**
 * maelstrom-js | lib/tasks/js_concat.js
 */
'use strict';

const _              = require('underscore');
const GulpIf         = require('gulp-if');
const GulpSize       = require('gulp-size');
const GulpSourceMaps = require('gulp-sourcemaps');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self      = this; // plugin object
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;
    const Gulp      = Maelstrom.gulp;
    const Utils     = Maelstrom.utils;

    /**
     * Concatenate JavaScript files according to the `jsConcat` config option.
     * The result will be further uglified when not `--dev`.
     */
    this.addTask('js:concat', function()
    {
        let $collections      = Config.js.concat;
        let $createSourceMaps = (Config.js.sourcemaps !== false);

        if (!_.isEmpty($collections))
        {
            for (let $destFile in $collections)
            {
                if (!$collections.hasOwnProperty($destFile))
                {
                    continue;
                }

                let $srcFiles = $collections[$destFile];

                Gulp.src($srcFiles)
                    .pipe( Maelstrom.plumber() )
                    .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                                  GulpSourceMaps.init()) )
                    .pipe( self.stream('concat', [$destFile]) )
                    .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                                  GulpSourceMaps.write()) )
                    .pipe( GulpSize(Config.main.size) )
                    .pipe( Gulp.dest(self.dest()) );
            }
        }
    });
};
