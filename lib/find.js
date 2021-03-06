var fs     = require('fs')
var wrench = require('wrench')
var _      = require('underscore')
var util   = require('./util')
var home   = util.getHome()

function getFontsDirs() {
  var fontDirs = [];

  switch (process.platform) {
    case 'darwin':
      fontDirs.push(home + '/Library/Fonts');
      fontDirs.push('/Library/Fonts');
    break;
    case 'freebsd':
      fontDirs.push('/usr/local/lib/X11/fonts');
      fontDirs.push(home + '/.fonts');
    break;
    case 'linux':
      fontDirs.push('/usr/share/fonts');
      fontDirs.push('/usr/local/share/fonts');
      fontDirs.push(home + '/.fonts');
    break;
    case 'sunos':
      fontDirs.push('/usr/local/lib/X11/fonts');
      fontDirs.push(home + '/.fonts');
    break;
    case 'win32':
      fontDirs.push('C:\\Windows\\Fonts');
    break;
  }

  return _.reject(fontDirs, function (directory) {
    return ! fs.existsSync(directory);
  });
}

function getValidTypes(files) {
  return _.reject(files, function (filename) {
    return filename.toLowerCase().indexOf('.otf') === -1
      && filename.toLowerCase().indexOf('.afm') === -1
      && filename.toLowerCase().indexOf('.ttf') === -1
  })
}

function getFileList() {
  var fileList = [];

  _.each(getFontsDirs(), function (directory) {
    var files = wrench.readdirSyncRecursive(directory);
    files = getValidTypes(files);
    files = _.map(files, function (file) {
      return directory + '/' + file;
    });
    fileList = _.union(fileList, files);
  });

  return fileList;
}

module.exports = {
  getFileList: getFileList
};
