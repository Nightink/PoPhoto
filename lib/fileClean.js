/**
 * User: Nightink
 * Date: 13-4-24
 * Time: 上午8:15
 * 文件缓存定期清除
 */

var fs = require('fs')
    , _ = require('underscore');

function fileClean() {
    var path = __dirname + '/../temp'
        , fileNameList = fs.readdirSync(path);      //fileNameList is Array

    //console.log('cleaning........');

    _.each(fileNameList, function(fileName) {         //遍历文件数组
        var filePath = path + '/' + fileName
            , now = Date.now();
        fs.stat(filePath, function(err, stat) {
            var timeDiff = now - stat.ctime;

            if(timeDiff > 3600000) {             //判断缓存文件是否过期        过期时间为： 1H
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

setInterval(function() {
    fileClean();
}, 3600000);           //定期执行文件清除
