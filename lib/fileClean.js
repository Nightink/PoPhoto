/**
 * User: Nightink
 * Date: 13-4-24
 * Time: 上午8:15
 * 文件缓存定期清除
 */

var fs = require('fs')
  , path = require('path')
  , _ = require('underscore');

// 设置缓存文件失效期限 失效时间为： 1H
var INVALID_TIME = 3600000;

function fileClean() {

  var tempPath = path.join(__dirname, '../temp')
    , fileNameList = fs.readdirSync(tempPath);

  // 遍历文件数组
  _.each(fileNameList, function(fileName) {

    var filePath = path.join(tempPath, fileName)
      , now = Date.now();

    fs.stat(filePath, function(err, stat) {
      var timeDiff = now - stat.ctime;

      // 判断缓存文件是否过期
      if(INVALID_TIME < timeDiff) {

        fs.unlink(filePath, function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('Debug: file clean is %s.', filePath);
          }
        });
      }
    });
  });
}

fileClean();
// 定期执行文件清除
setInterval(fileClean, INVALID_TIME);
