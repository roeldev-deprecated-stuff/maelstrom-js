/**
 * maelstrom-js | lib/tasks/lint.js
 */
'use strict';

const GulpIf = require('gulp-if');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        return $maelstrom.gulp.src( $plugin.src() )
            .pipe( $maelstrom.stream('plumber') )
            .pipe( GulpIf($maelstrom.config.js.lint, $plugin.stream('lint')) );
    };
};
