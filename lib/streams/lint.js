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
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;
    const Utils     = Maelstrom.utils;

    /**
     * Lint JavaScript files with _jshint_ and display the results with
     * _jshint-stylish_.
     */
    this.addStream('lint', function()
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
};
