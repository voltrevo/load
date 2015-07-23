'use strict';

var coreModules = {};
var idGen = require('./idGen.js');

var globals = {
  console: console,
  Promise: Promise
};

Object.keys(globals).forEach(function(globalName) {
  coreModules[globalName] = function() {
    return {
      success: true,
      value: function(/* load */) { return globals[globalName]; },
      location: globalName,
      id: idGen()
    };
  };
});

var requirableArray = [
  'assert',
  'fs',
  'path'
];

requirableArray.forEach(function(requirable) {
  coreModules[requirable] = function() {
    return {
      success: true,
      value: function(/* load */) { return require(requirable); },
      location: requirable,
      id: idGen()
    };
  };
});

var filenameIds = {};

coreModules.filename = function(filename) {
  var id = filenameIds[filename];

  if (id === undefined) {
    id = idGen();
    filenameIds[filename] = id;
  }

  return {
    success: true,
    value: function(/* load */) { return filename; },
    location: 'filename',
    id: id
  };
};

module.exports = function() {
  var cache = {};

  return function(filename, loadName) {
    var coreName = loadName;
    var coreModuleGetter = coreModules[coreName];

    if (!coreModuleGetter) {
      return { success: false };
    }

    var cachedModule = cache[coreName];

    if (!cachedModule) {
      cachedModule = coreModuleGetter(filename);
      cache[coreName] = cachedModule;
    }

    return cachedModule;
  };
};
