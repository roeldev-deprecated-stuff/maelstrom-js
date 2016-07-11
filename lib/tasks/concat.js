/**
 * maelstrom-js | lib/tasks/concat.js
 */
'use strict';

const _              = require('lodash');
const GulpIf         = require('gulp-if');
const GulpSourceMaps = require('gulp-sourcemaps');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        let $concat           = $maelstrom.config.js.concat;
        let $createSourceMaps = ($maelstrom.config.js.sourcemaps !== false);

        if (!_.isEmpty($concat))
        {
            for (let $destFile in $concat)
            {
                if (!$concat.hasOwnProperty($destFile))
                {
                    continue;
                }

                let $srcFiles = $concat[$destFile];

                $maelstrom.gulp.src($srcFiles)
                    .pipe( $maelstrom.stream('plumber') )

                    .pipe( GulpIf($maelstrom.utils.isDev() && $createSourceMaps,
                                  GulpSourceMaps.init()) )
                    .pipe( $plugin.stream('concat', [$destFile]) )
                    .pipe( GulpIf($maelstrom.utils.isDev() && $createSourceMaps,
                                  GulpSourceMaps.write('./')) )

                    .pipe( $maelstrom.stream('size') )
                    .pipe( $maelstrom.gulp.dest($plugin.dest()) );
            }
        }
    };
};
