'use strict';

if (process.argv.length !== 3) {
  console.error('Usage: node cli.js entryPoint.js');
  process.exit(1);
}

var createLoad = require('./index.js');
var path = require('path');

var load = createLoad('/');

var entryPointAbsolutePath = path.resolve(process.cwd(), process.argv[2]);

load(entryPointAbsolutePath);
