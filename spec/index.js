var dirname = load('dirname');
var fs = load('fs');
var path = load('path');

fs.readdirSync(dirname).filter(function(dirCandidate) {
  return fs.statSync(path.join(dirname, dirCandidate)).isDirectory();
}).forEach(function(testDir) {
  var index = path.join(testDir, 'index.js');
  load(index);
});

//load('./relativePaths/index.js');
