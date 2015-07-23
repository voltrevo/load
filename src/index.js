'use strict';

var createCoreLoader = require('./createCoreLoader.js');
var createFileLoader = require('./createFileLoader.js');
var createLoader = require('./createLoader.js');
var resolve = require('./resolve.js');

var createLoad = function(filename, loader, cache) {
  loader = loader || createLoader({
    coreLoader: createCoreLoader(),
    fileLoader: createFileLoader(),
    resolve: resolve
  });

  cache = cache || [];

  var load = function(loadName) {
    var result = loader(filename, loadName);

    if (!result.success) {
      throw new Error('In ' + filename + ', failed to load ' + loadName);
    }

    var cached = cache[result.id];

    if (cached) {
      return cached.loadedModule;
    }

    var moduleFn = result.value;

    var nextLoader = createLoad(result.location, loader, cache);
    var loadedModule = moduleFn(nextLoader);

    cache[result.id] = { loadedModule: loadedModule };

    return loadedModule;
  };

  return load;
};

module.exports = createLoad;
