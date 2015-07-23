var filename = load('filename');
var fs = load('fs');
var path = load('path');

var dirname = path.dirname(filename);

fs.readdirSync(dirname).filter(function(dirCandidate) {
  return fs.statSync(path.join(dirname, dirCandidate)).isDirectory();
}).forEach(function(testDir) {
  var index = path.join(testDir, 'index.js');
  load('./' + index); // TODO: fix platform assumption
});
