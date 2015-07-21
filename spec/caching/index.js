var assert = load('assert');

assert(load('./foo.js') === load('./fooProxy.js'));
