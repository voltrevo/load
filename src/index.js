'use strict';

var fs = require('fs');
var path = require('path');

var builtins = {
  'console': console
};

module.exports = function() {
  var cache = {};
  var cwd = process.cwd();

  var load = function(filePath, customLoad) {
    if (builtins[filePath]) {
      return builtins[filePath];
    }

    var resolvedPath = path.resolve(cwd, filePath);

    if (cache[resolvedPath]) {
      return cache[resolvedPath];
    }

    var contents = fs.readFileSync(resolvedPath).toString()
      .split('\n')
      .map(function(line) { return line === '' ? '' : '  ' + line; })
      .join('\n');

    var globals = Object.keys(global).filter(function(globalVariable) {
      return /^[$A-Z_][0-9A-Z_$]*$/i.test(globalVariable);
    });

    var theEvilEval;

    /* jshint ignore:start */
    theEvilEval = eval;
    /* jshint ignore:end */

    var moduleOutput = theEvilEval(
      '(function(load, ' + globals.join(', ') + ') {\n' +
      '  \'use strict\';\n' +
      '\n' +
      contents +
      '})'
    )(customLoad || load);

    cache[resolvedPath] = moduleOutput;

    return moduleOutput;
  };

  return load;
};
