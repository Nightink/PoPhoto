/**
 * 负责图片上传、返回显示
 */

'use strict';

const utils = require('../../lib/utils');

// POST --> /upload 上传图片
exports.upload = function* () {
  const stream = yield this.getFileStream();
  try {
    const result = yield this.app.service.attachment.upload(stream);
    this.body = {
      url: result.docFileS._id.toString() || '',
      // 缩略图url
      url_small: result.docFileT._id.toString() || '',
      size: result.size,
    };
  } catch (err) {
    utils.throwError(err, 'server error image', this.respone);
  }
};

// GET --> attachment/:id
// 图片下载操作
exports.download = function(req, res) {
  const attachmentID = req.params.id;
  utils.download(attachmentID, function(err, contentType, file) {

    if (err) {

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

  const attachmentID = req.params.id;

  utils.delete(attachmentID, function() {

    res.send('删除成功');
  });
};
