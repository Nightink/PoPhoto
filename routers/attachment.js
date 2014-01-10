/**
 * 文件上传、下载Routes路由
 */

var attachmentControllers = require('../controllers/attachment');

module.exports = function(app) {

  app.post('/upload', attachmentControllers.upload);
  app.get('/attachment/:id', attachmentControllers.download);
  app.get('/delete/:id', attachmentControllers.delete);

};
