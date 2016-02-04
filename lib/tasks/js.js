/**
 * maelstrom-js | lib/tasks/js.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom   = this.maelstrom;
    const Gulp        = Maelstrom.gulp;
    const RunSequence = require('run-sequence').use(Gulp);

    /**
     * Execute the `js:lint` and `js:concat` tasks.
     */
    this.addTask('js', function()
    {
        // read files in /assets/js dir
        // check wich files are not in jsConcat
        // export only those files to /public/js
        // concat all other files according to jsConcat

        // Maelstrom.task('js:lint');
        // Maelstrom.task('js:concat');

        return RunSequence('js:lint', 'js:concat');
    });
};
