/**
 * maelstrom-js | lib/streams/lint.js
 */
'use strict';

const Confirge        = require('confirge');
const GulpJsCs        = require('gulp-jscs');
const GulpJsCsStylish = require('gulp-jscs-stylish');
const GulpJsHint      = require('gulp-jshint');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let $config = Confirge.read(this.maelstrom.config.js.jshintFile);
    $config = Confirge.extend({}, this.maelstrom.config.js.jshint, $config);

    let $stream = GulpJsHint($config);
    $stream.pipe( GulpJsCs(this.maelstrom.config.js.jscs) )
        .on('error', this.maelstrom.utils.noop);

    $stream.pipe( GulpJsCsStylish.combineWithHintResults() );
    $stream.pipe( GulpJsHint.reporter('jshint-stylish') );

    return $stream;
};
