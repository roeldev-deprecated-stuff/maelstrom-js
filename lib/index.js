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

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let $plugin = new this.Plugin(__filename, 'js',
    {
        /**
         * Return the location of the JavaScript source files.
         */
        src: function($src)
        {
            let $defaultSrc = this.maelstrom.config.src.js + '/**/*.js';
            return this.maelstrom.utils.extendArgs($src, $defaultSrc);
        },

        /**
         * Return the location of the JavaScript output folder.
         */
        dest: function()
        {
            return this.maelstrom.config.dest.js;
        },

        /**
         * Add files to concat to config
         */
        concat: function($destFile, $srcFiles)
        {
            this.maelstrom.config.js.concat[$destFile] = $srcFiles;
        }
    });

    $plugin.readStreams();
    $plugin.readTasks();

    return $plugin;
};
