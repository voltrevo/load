'use strict';

var fs = require('fs');
var idGen = require('./idGen.js');
var path = require('path');

var thingsThatMaybeShouldBeKeywords = [
  'Infinity',
  'NaN',
  'Object',
  'Array',
  'Boolean',
  'Number',
  'Function',
  'String',
  'undefined'
];

var globals = Object.getOwnPropertyNames(global).filter(function(globalVariable) {
  return (
    thingsThatMaybeShouldBeKeywords.indexOf(globalVariable) === -1 &&
    /^[$A-Z_][0-9A-Z_$]*$/i.test(globalVariable)
  );
});

var loadAbsPath = function(absPath) {
  var contents = fs.readFileSync(absPath).toString()
    .split('\n')
    .map(function(line) { return line === '' ? '' : '  ' + line; })
    .join('\n');

  var theEvilEval;

  /* jshint ignore:start */
  theEvilEval = eval;
  /* jshint ignore:end */

  return theEvilEval(
    '(function(load, ' + globals.join(', ') + ') {\n' +
    'return (function(load) { \n' +
    '  \'use strict\';\n' +
    '\n' +
    contents +
    '})(load);\n' +
    '});'
  );
};

module.exports = function() {
  var cache = {};

  return function(filename, loadName) {
    var absPath = loadName;

    if (!path.isAbsolute(absPath)) {
      return { success: false };
    }

    var loaded = cache[absPath];

    if (!loaded) {
      loaded = {
        success: true,
        value: loadAbsPath(absPath),
        location: absPath,
        id: idGen()
      };

      cache[absPath] = loaded;
    }

    return loaded;
  };
};
