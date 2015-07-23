'use strict';

module.exports = function(loaders) {
  return function(filename, loadName) {
    var result;

    for (var i = 0; i !== loaders.length; i++) {
      result = loaders[i](filename, loadName);

      if (result.success) {
        return result;
      }
    }

    return { success: false };
  };
};
