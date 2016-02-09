/**
 * maelstrom-js | lib/streams/concat.js
 */
'use strict';

const GulpConcat = require('gulp-concat');
const GulpUglify = require('gulp-uglify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;
    const Utils     = Maelstrom.utils;

    /**
     * Concatenate JavaScript files and further uglify the result when not
     * `--dev`.
     */
    this.addStream('concat', function($destFile)
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
};
