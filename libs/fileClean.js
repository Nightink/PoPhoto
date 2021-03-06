/**
 * 文件缓存定期清除
 */

var fs           = require('fs');
var path         = require('path');

var _            = require('underscore');
var debug        = require('debug')('pophoto:libs:fileClean');

var config       = require('../config.json');
var INVALID_TIME = config.fileClearTime;

function fileClean() {

  var tempPath     = path.join(__dirname, '../temp');
  var fileNameList = fs.readdirSync(tempPath);

  // 遍历文件数组
  _.each(fileNameList, function(fileName) {

    var now      = Date.now();
    var filePath = path.join(tempPath, fileName);

    fs.stat(filePath, function(err, stat) {

      var timeDiff = now - stat.ctime;

      // 判断缓存文件是否过期
      if(INVALID_TIME < timeDiff) {

        fs.unlink(filePath, function(err) {
          if(err) {
            console.log(err);
          } else {
            debug('Debug: file clean is %s', filePath);
          }
        });
      }

    });

  });

}

fileClean();
// 定期执行文件清除
global.setInterval(fileClean, INVALID_TIME);
