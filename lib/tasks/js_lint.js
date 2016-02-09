/**
 * maelstrom-js | lib/tasks/js_lint.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self      = this; // plugin object
    const Maelstrom = this.maelstrom;
    const Gulp      = Maelstrom.gulp;

    /**
     * Lint the JavaScript files located in the `src.js` folder with _jshint_
     * and display the results with _jshint-stylish_.
     */
    this.addTask('js:lint', function()
    {
        return Gulp.src( self.src() )
            .pipe( Maelstrom.stream('plumber') )
            .pipe( self.stream('lint') );
    });
};
