/**
 * project-name | test/main.js
 * file version: 0.00.001
 */
'use strict';

var Assert      = require('assert');
var ProjectName = require('../index.js');
var Path        = require('path');

////////////////////////////////////////////////////////////////////////////////

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

//------------------------------------------------------------------------------
