/**
 * User: Nightink
 * Date: 13-4-24
 * Time: 上午9:18
 *
 * NodeJS通用工具集
 * 说明：通用工具集方法注释采用doc说明，便于后续项目开发使用
 */

var gm = require('gm')
  , fs = require('fs')
  , _ = require('underscore')
  , mongoose = require('mongoose')
  , mongodb = require('mongoose/node_modules/mongodb')
  , crypto = require("crypto")
  , mongooseDb = mongoose.connection.db;

/**
 * 生成缩略图
 * @param readPath           图片读取路径
 * @param writePath          图片写入路径
 * @param width              图片生成宽度
 * @param height             图片生成高度
 */
exports.thumb = function(readPath, writePath, width, height, next) {

  gm(readPath).resize(width, height).write(writePath, function(err) {
    next(err);
  });
};

/**
 * 获取图片的宽高
 * @param readPath  图片读取文件路径
 * @param next    回调函数
 */
exports.imageSize = function(readPath, next) {

  gm(readPath).size(function(err, size) {
    if(err) return next(err);
    next(err, size);
  });
};

/**
 * 提供统一的 '发送浏览器给JSON数据' 接口
 * @param req        请求对象
 * @param res        返回对象
 * @param data       返回数据
 */
exports.sendJson = function(req, res, jsonData) {
  // var jsonData = JSON.stringify(jsonData);

  if(req.headers['user-agent']){
    var isIE = req.headers['user-agent'].indexOf('MSIE') != -1 ? true : false;
    if (isIE) {
      res.set('Content-Type', 'text/html; charset=utf-8');
      // res.set('Content-Type', 'application/json; charset=utf-8');
      // var jsonData = JSON.stringify(jsonData);
    } else {
      res.set('Content-Type', 'application/json; charset=utf-8');
    }
    res.send(jsonData);
  } else {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(jsonData);
  }
};

// 针对backbone，restful接口风格的json
exports.sendStatus = function(req, res, statusCode, data) {

  res.set('Content-Type', 'application/json; charset=utf-8');
  var jsonData = JSON.stringify(data);
  res.send(statusCode, jsonData);
};

/**
 * 下载文件
 * @param fileId
 * @param next
 */
exports.download = function (fileId, next) {

  var id = mongodb.ObjectID(fileId);
  var gs = new mongodb.GridStore(mongooseDb, id, "r");

  // 打开当前Mongo数据存储对象
  gs.open(function (err, docFile) {

    if (err) return next(err, null);
    // set the opinter of the read head to the start of the gridstored file
    gs.seek(0, function () {

      // read the entire file
      gs.read(function (err, docChunk) {

        if (err) return next(err, null);
        next(err, docFile.contentType, new Buffer(docChunk.toString("binary"), 'binary'));
      });
    });
  });
};

/**
 * 上传文件入库
 * @param file
 * @param next
 */
exports.upload = function (fileName, fileType, filePath, next) {
  var gs = new mongodb.GridStore(mongooseDb, fileName, "w", {
    'chunk_size': 1024 * 4,
    'content_type': fileType,
    metadata: { }
  });
  // open the file
  gs.open(function (err, gridStore) {

    if (err) return next(err);
    // write the file to gridfs
    gridStore.writeFile(filePath, function (err, docFile) {

      fs.unlink(filePath, function (err) {
        if (err) Log('删除文件(' + filePath + ')出现异常: ' + err);
      });
      next(err, docFile);
    });
  });
};

/**
 * 删除入库文件
 * @param fileId
 * @param next
 */
exports.delete = function(fileId, next) {

  var id = mongodb.ObjectID(fileId);
  var gs = new mongodb.GridStore(mongooseDb, id, 'r');
  // open the file
  gs.open(function (err, docFile) {

    if (err) return next(err, null);

    mongodb.GridStore.unlink(mongooseDb, docFile.filename, function(err) {
      console.log(arguments);
      next();
    });
  });
}

exports.uploadFromBuffer = function(fileName, fileType, data, next) {

  if(data === null)
    next(err, null);
  var gs = new mongodb.GridStore(mongooseDb, fileName, 'w', {
    'chunk_size': 1024 * 4,
    'content_type': fileType,
    'metadata': {}
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

/**
 * 数据加密
 * @param data
 */
exports.encryptHelper = function(data) {

  var cipher = crypto.createCipher('aes-256-cbc', 'photo');
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

/**
 * 数据解密
 * @param data
 */
exports.decipherHelper = function(data) {

  var decipher = crypto.createDecipher('aes-256-cbc', 'photo');
  var dec = decipher.update(data,'hex', 'utf8');

  try {
    dec += decipher.final('utf8');
  } catch (e) {
    return false;
  }

  return dec;
};

/**
 * 格式化日志输出
 *
 * getPos 获取文件信息参考cnodejs.org http://cnodejs.org/topic/4f16442ccae1f4aa27001125
 * @param message
 */
var Log = exports.log = function(message) {

  function getPos() {

    var cwd = process.cwd() + '/';
    try {
        throw new Error();
    } catch(e) {
        var pos = e.stack.split('\n')[3].split('(')[1].split(')')[0].split(':');
        return pos[0].replace(cwd, '') + ':' + pos[1];
    }
  }

  if(!_.isObject(message)) {

    console.log('Debug: [info]\n  filename: %s\n  message: %s', getPos(), message);
  } else {

    console.log('Debug: [info]\n  filename: %s\n  message:', getPos());
    console.log('    ', message);
  }
  
};