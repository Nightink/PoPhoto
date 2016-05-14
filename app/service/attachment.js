'use strict';

const utils = require('../../lib/utils');
const gm = require('gm');

const mongoose = require('mongoose');
// 使用mongoose gridfs文件流
const GridStore = mongoose.mongo.GridStore;
const ObjectID = mongoose.Types.ObjectId;

module.exports = {
  * upload(stream) {
    const file = this.req.files.file;
    const tempImagePath = file.path;

    // 缩略图缓存
    const thumbImagePath = tempImagePath + '_t';
    // 原生图缓存
    const attachmentImagePath = tempImagePath + '_s';

    const size = yield utils.imageSize(stream);
    yield utils.thumb(tempImagePath, attachmentImagePath, size.width, size.height);
    const docFileS = yield utils.upload(file.name, file.type, attachmentImagePath);
    const thumbWidth = config.thumb.width;
    const thumbHeight = size.height * (thumbWidth / size.width);
    yield utils.thumb(tempImagePath, thumbImagePath, thumbWidth, thumbHeight);
    const docFileT = yield utils.upload('s_' + file.name, file.type, thumbImagePath);
  },
};


// 生成缩略图
exports.thumb = function(stream, writePath, width, height) {
  return new Promise((resolve, reject) => {
    gm(stream).resize(width, height).write(writePath, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

// 获取图片的宽高
exports.imageSize = function(stream) {
  return new Promise((resolve, reject) => {
    gm(stream).size((err, size) => {
      if (err) {
        return reject(err);
      }

      return resolve(size);
    });
  });
};

// 下载文件
exports.download = function(fileId, next) {
  const id = new ObjectID(fileId);
  const mongooseDb = mongoose.connection.db;
  const gs = new GridStore(mongooseDb, id, 'r');

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
