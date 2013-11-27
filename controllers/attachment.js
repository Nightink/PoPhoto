/**
 * User: Nightink
 * Date: 13-4-24
 * Time: 下午3:11
 * 负责图片上传、返回显示
 */

var path   = require('path');

var utils  = require('../lib/utils');
var config = require('../conf/config');

// POST --> /upload 上传图片
exports.upload = function(req, res) {

  var file = req.files.file;
  var tempPath = file.path;

  // var tempImagePath = __dirname + '/../' + tempPath;
  var tempImagePath = path.join(__dirname, '..', tempPath);
  // 缩略图缓存
  var thumbImagePath = tempImagePath + '_t';
  // 原生图缓存
  var attachmentImagePath = tempImagePath + '_s';

  utils.imageSize(tempPath, function(err, size) {
    utils.thumb(tempImagePath, attachmentImagePath, size.width, size.height, function() {
      // 图片原尺寸入库
      utils.upload(file.name, file.type, attachmentImagePath, function(err, docFileS) {
        if(err) utils.log(err);

        var thumbWidth = config.thumb.width;
        var thumbHeight = size.height * (thumbWidth / size.width);

        utils.thumb(tempImagePath, thumbImagePath, thumbWidth, thumbHeight, function(err) {
          // 图片缩略入库
          utils.upload('s_' + file.name, file.type, thumbImagePath, function(err, docFileT) {
            if(err) {
              
              utils.log(err);
              return res.send(500);
            }

            // 原图url
            var data = {
              url: docFileS._id.toString() || '',
              // 缩略图url
              url_small: docFileT._id.toString() || '',
              size: size
            };

            utils.sendJson(req, res, data);
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

      utils.log(err);
      return res.json(400, '找不到该文件');
    }

    // 设置响应头 文件格式
    res.set('Content-Type', contentType);
    res.send(file);
    // res.sendfile(file);
  });
};

exports.delete = function(req, res) {

  var attachmentID = req.params.id;

  utils.delete(attachmentID, function() {

    res.send('删除成功');
  });
};