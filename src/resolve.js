'use strict';

var path = require('path');

module.exports = function(filename, loadName) {
  if (loadName[0] !== '.' && loadName[0] !== '/') { // TODO: fix platform assumptions
    return loadName;
  }

  var dirname = path.dirname(filename);

  return path.resolve(dirname, loadName);
};
