'use strict';

var fs = require('fs');
var path = require('path');

var wrapFn = function(value) {
  return function() {
    return value;
  };
};

var wrapRequire = function(moduleName) {
  var cache;

  return function() {
    if (cache === undefined) {
      cache = require(moduleName);
    }

    return cache;
  };
};

var builtins = {
  console: wrapFn(console),
  assert: wrapRequire('assert'),
  fs: wrapRequire('fs'),
  path: wrapRequire('path'),
  dirname: function(dirname) { return dirname; }
};

var createLoader = function(dirname, cache) {
  cache = cache || {};

  var load = function(filePath) {
    if (builtins[filePath]) {
      return builtins[filePath](dirname);
    }

    var resolvedPath = path.resolve(dirname, filePath);

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

    var moduleFunction = theEvilEval(
      '(function(load, ' + globals.join(', ') + ') {\n' +
      '  \'use strict\';\n' +
      '\n' +
      contents +
      '})'
    );

    var innerLoader = createLoader(path.dirname(resolvedPath), cache);
    var moduleResult = moduleFunction(innerLoader);

    cache[resolvedPath] = moduleResult;

    return moduleResult;
  };

  return load;
};

module.exports = createLoader;
