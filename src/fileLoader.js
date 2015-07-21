'use strict';

var fs = require('fs');

var globals = Object.keys(global).filter(function(globalVariable) {
  return /^[$A-Z_][0-9A-Z_$]*$/i.test(globalVariable);
});

globals.push('Promise');

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
    '  \'use strict\';\n' +
    '\n' +
    contents +
    '})'
  );
};

module.exports = function(absPath) {
  return function() {
    return loadAbsPath(absPath);
  };
};
