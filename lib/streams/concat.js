/**
 * maelstrom-js | lib/streams/concat.js
 */
'use strict';

const GulpConcat = require('gulp-concat');
const GulpUglify = require('gulp-uglify');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($destFile)
{
    // make sure the dest filename has a js file extension
    if ($destFile.substr($destFile.length - 3) !== '.js')
    {
        $destFile += '.js';
    }

    let $stream = GulpConcat($destFile);
    if (this.maelstrom.utils.isProd())
    {
        $stream.pipe( GulpUglify(this.maelstrom.config.js.uglify) );
    }

    return $stream;
};
