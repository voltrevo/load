'use strict';

var createCascadeLoader = require('./createCascadeLoader.js');
var path = require('path');

module.exports = function(components) {
  var resolve = components.resolve;
  var fileLoader = components.fileLoader;

  var moduleLoader = function(filename, loadName) {
    if (!path.isAbsolute(filename) && !path.isAbsolute(loadName)) {
      return { success: false };
    }

    return fileLoader(filename, resolve(filename, loadName));
  };

  var coreLoader = components.coreLoader;

  return createCascadeLoader([
    coreLoader,
    moduleLoader
  ]);
};
