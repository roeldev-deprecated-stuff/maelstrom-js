/**
 * maelstrom-js | lib/tasks/js_test.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self      = this; // plugin object
    const Maelstrom = this.maelstrom;
    const Gulp      = Maelstrom.gulp;

    /**
     */
    this.addTask('js:test', function()
    {
        return Gulp.src( self.src() )
            .pipe( Maelstrom.stream('plumber') )
            .pipe( self.stream('test') );
    });
};
