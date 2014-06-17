// NodeJS通用工具集
// 说明：通用工具集方法注释采用doc说明，便于后续项目开发使用

var fs         = require('fs');
var crypto     = require('crypto');

var _          = require('underscore');
var gm         = require('gm');
var debug      = require('debug')('app:utils');
var mongoose   = require('mongoose');

// mongoose.connection.db 必须确保已经连接mongo数据
// 否则 mongooseDb 将为空
var mongooseDb = mongoose.connection.db;
// 使用mongoose gridfs文件流
var GridStore  = mongoose.mongo.GridStore;
var ObjectID   = mongoose.mongo.BSONPure.ObjectID;

// 生成缩略图
exports.thumb = function(readPath, writePath, width, height, next) {

  debug('image gm thumb path %s out path %s', readPath, writePath);

  gm(readPath).resize(width, height).write(writePath, function(err) {

    next(err);
  });
};

// 获取图片的宽高
exports.imageSize = function(readPath, next) {

  debug('image gm size');

  gm(readPath).size(function(err, size) {

    next(err, size);
  });
};

// 下载文件
exports.download = function (fileId, next) {

  var id = new ObjectID(fileId);

  var gs = new GridStore(mongooseDb, id, 'r');

  // 打开当前Mongo数据存储对象
  gs.open(function (err, docFile) {

    if (err) {

      return next(err, null);
    }

    gs.seek(0, function () {

      gs.read(function (err, docChunk) {

        var buffer = new Buffer(docChunk.toString('binary'), 'binary');
        next(err, docFile.contentType, buffer);

      });

    });

  });

};

// 上传文件入库
exports.upload = function (fileName, fileType, filePath, next) {

  var gs = new GridStore(mongooseDb, fileName, 'w', {

    chunk_size: 1024 * 4,
    content_type: fileType,
    metadata: {}
  });

  // open the file
  gs.open(function (err, gridStore) {

    if (err) {

      return next(err);
    }

    gridStore.writeFile(filePath, function (err, docFile) {

      fs.unlink(filePath, function (err) {

        if (err) {

          Log('删除文件(' + filePath + ')出现异常: ' + err);
        }
      });

      next(err, docFile);

    });

  });

};

// 删除入库文件
exports.delete = function(fileId, next) {

  var id = ObjectID(fileId);
  var gs = new GridStore(mongooseDb, id, 'r');

  // open the file
  gs.open(function (err, docFile) {

    if (err) return next(err, null);

    GridStore.unlink(mongooseDb, docFile.filename, function(err) {

      console.log(arguments);
      next();

    });

  });

};

exports.uploadFromBuffer = function(fileName, fileType, data, next) {

  if(data === null) {

    return next('空数据', null);
  }

  var gs = new GridStore(mongooseDb, fileName, 'w', {

    chunk_size: 1024 * 4,
    content_type: fileType,
    metadata: {}
  });

  // open the file
  gs.open(function(err, gridStore) {

    if (err) return next(err);
    // write the file to gridfs
    gridStore.write(new Buffer(data, 'binary'), function(err, gridStore) {

      if (err) return next(err);
      // flush to the gridfs
      gridStore.close(function(err, docFile) {
        next(err, docFile);
      });
    });
  });
};

// 数据加密
exports.encryptHelper = function(data) {

  var cipher = crypto.createCipher('aes-256-cbc', 'photo');
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

// 数据解密
exports.decipherHelper = function(data) {

  var decipher = crypto.createDecipher('aes-256-cbc', 'photo');
  var dec = decipher.update(data, 'hex', 'utf8');

  try {
    dec += decipher.final('utf8');
  } catch (e) {
    return false;
  }

  return dec;
};

// 抛出错误方法
exports.throwError = function(err, errorString, res) {

  if(err) {

    res.json(500, errorString);
    throw err;
  }
};

// 文件复制操作
// basePath 文件原路径
// srcPath 拷贝路径
// fn 可选回调函数
exports.copyFile = function(basePath, srcPath, next) {

  next = next || function(err) {

    if(err) {

      console.error(err);
    } else {

      console.log('copy file success');
    }

  };

  fs.readFile(basePath, function(err, data) {

    if(err) {

      return next('read file: ' + err.toString());
    }

    fs.writeFile(srcPath, data, function(er) {

      if(er) {

        return next('write file: ' + err.toString());
      }

      next();
    });
  });
};

// 格式化日志输出
// getPos 获取文件信息
// 参考cnodejs.org http://cnodejs.org/topic/4f16442ccae1f4aa27001125
var Log = exports.log = function(message) {

  function getPos() {

    var cwd = process.cwd() + '/';
    try {

      throw new Error();
    } catch(e) {

      // 获取调用Log函数文件位置
      var getPosition = e.stack.split('\n')[3];
      var pos = getPosition.split('(')[1].split(')')[0].split(':');
      return pos[0].replace(cwd, '') + ':' + pos[1];
    }
  }

  if(!_.isObject(message)) {

    console.log('Debug: [info]\n  filename: %s\n  message: %s',
      getPos(), message);
  } else {

    console.log('Debug: [info]\n  filename: %s\n  message:', getPos());
    console.log('    ', message);
  }
};
