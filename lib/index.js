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
 */
'use strict';

module.exports = function()
{
    const self = this; // maelstrom object

    this.plugin('js',
    {
        'file': __filename,

        /**
         * Return the location of the JavaScript source files.
         */
        src: function($src)
        {
            return self.utils.extendArgs($src, self.config.src.js + '/**/*.js');
        },

        /**
         * Return the location of the JavaScript output folder.
         */
        dest: function()
        {
            return self.config.dest.js;
        },

        /**
         * Add files to concat to config
         */
        concat: function($destFile, $srcFiles)
        {
            self.config.js.concat[$destFile] = $srcFiles;
        }
    });
};
