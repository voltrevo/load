var assert = load('assert');

var foo = load('./subdir/foo.js');

assert(foo === 'loaded bar');
