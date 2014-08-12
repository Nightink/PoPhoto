/**
 * 负责图片上传、返回显示
 */

var path   = require('path');
var async  = require('async');

var utils  = require('../libs/utils');
var config = require('../config.json');

// POST --> /upload 上传图片
exports.upload = function(req, res) {

  var file = req.files.file;
  var tempImagePath = file.path;

  // 缩略图缓存
  var thumbImagePath = tempImagePath + '_t';
  // 原生图缓存
  var attachmentImagePath = tempImagePath + '_s';

  var size, docFileS;

  async.waterfall([
    function getImageSize(cb) {

      utils.imageSize(tempImagePath, cb);
    },
    function genArtImage(s, cb) {

      size = s;
      utils.thumb(tempImagePath, attachmentImagePath, s.width, s.height, cb);
    },
    function uploadArtImage(cb) {

      utils.upload(file.name, file.type, attachmentImagePath, cb);
    },
    function genThumbImage(result, cb) {

      var thumbWidth = config.thumb.width;
      var thumbHeight = size.height * (thumbWidth / size.width);

      docFileS = result;
      utils.thumb(tempImagePath, thumbImagePath, thumbWidth, thumbHeight, cb);
    },
    function uploadThumbImage(cb) {

      utils.upload('s_' + file.name, file.type, thumbImagePath, cb);
    }
  ], function(err, docFileT) {

    utils.throwError(err, 'server error image', res);

    // 原图url
    var data = {
      url: docFileS._id.toString() || '',
      // 缩略图url
      url_small: docFileT._id.toString() || '',
      size: size
    };

    res.json(200, data);
  });
};

// GET --> attachment/:id
// 图片下载操作
exports.download = function(req, res) {

  var attachmentID = req.params.id;

  utils.download(attachmentID, function(err, contentType, file) {

    if(err) {

      return res.json(400, '找不到该文件');
    }

    // 设置响应头 文件格式
    res.set('Content-Type', contentType);
    res.send(file);
  });
};

// GET --> /delete/:id
// 图片删除操作
exports.delete = function(req, res) {

  var attachmentID = req.params.id;

  utils.delete(attachmentID, function() {

    res.send('删除成功');
  });
};
