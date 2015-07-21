'use strict';

var path = require('path');

var fileLoader = require('./fileLoader.js');

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

    var moduleFunction = fileLoader(resolvedPath)(dirname);

    var innerLoader = createLoader(path.dirname(resolvedPath), cache);
    var moduleResult = moduleFunction(innerLoader);

    cache[resolvedPath] = moduleResult;

    return moduleResult;
  };

  return load;
};

module.exports = createLoader;
