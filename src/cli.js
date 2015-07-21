'use strict';

if (process.argv.length !== 3) {
  console.error('Usage: node cli.js entryPoint.js');
  process.exit(1);
}

var createLoader = require('./index.js');
var path = require('path');

var load = createLoader('/');

var entryPointAbsolutePath = path.resolve(process.cwd(), process.argv[2]);

load(entryPointAbsolutePath);
