/**
 * 负责图片上传、返回显示
 */

var path   = require('path');

var utils  = require('../libs/utils');
var config = require('../conf/config.json');

// POST --> /upload 上传图片
exports.upload = function(req, res) {

  var file = req.files.file;
  var tempImagePath = file.path;

  // 缩略图缓存
  var thumbImagePath = tempImagePath + '_t';
  // 原生图缓存
  var attachmentImagePath = tempImagePath + '_s';

  utils.imageSize(tempImagePath, function(err, size) {

    if(err) {

      res.json(500, 'server error image :' + err);
      return;
    }

    utils.thumb(tempImagePath, attachmentImagePath, size.width, size.height, function() {

      // 图片原尺寸入库
      utils.upload(file.name, file.type, attachmentImagePath, function(err, docFileS) {

        if(err) {
          console.log(err);
        }

        var thumbWidth = config.thumb.width;
        var thumbHeight = size.height * (thumbWidth / size.width);

        utils.thumb(tempImagePath, thumbImagePath, thumbWidth, thumbHeight, function(err) {

          // 图片缩略入库
          utils.upload('s_' + file.name, file.type, thumbImagePath, function(err, docFileT) {

            if(err) {

              console.log(err);
              return res.send(500);
            }

            // 原图url
            var data = {
              url: docFileS._id.toString() || '',
              // 缩略图url
              url_small: docFileT._id.toString() || '',
              size: size
            };

            res.json(200, data);
          });
        });
      });
    });
  });
};

// GET --> attachment/:id
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

exports.delete = function(req, res) {

  var attachmentID = req.params.id;

  utils.delete(attachmentID, function() {

    res.send('删除成功');
  });
};
