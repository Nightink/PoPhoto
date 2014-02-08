/**
 * 文件缓存定期清除
 */

var fs           = require('fs');
var path         = require('path');
var _            = require('underscore');

var config       = require('../conf/config.json');


var INVALID_TIME = config.fileClearTime;

function fileClean() {

  var tempPath     = path.join(__dirname, '../temp');
  var fileNameList = fs.readdirSync(tempPath);

  // 遍历文件数组
  _.each(fileNameList, function(fileName) {

    var filePath = path.join(tempPath, fileName);
    var now      = Date.now();

    fs.stat(filePath, function(err, stat) {

      var timeDiff = now - stat.ctime;

      // 判断缓存文件是否过期
      if(INVALID_TIME < timeDiff) {

        fs.unlink(filePath, function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('Debug: file clean is %s', filePath);
          }
        });
      }

    });

  });

}

fileClean();
// 定期执行文件清除
setInterval(fileClean, INVALID_TIME);
