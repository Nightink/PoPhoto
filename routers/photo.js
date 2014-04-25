/**
 * photo 路由处理
 */

 /**
  * Restful接口化开发 路由定制 get post put delete
  */

var photoControllers = require('../controllers/photo');

module.exports = function(app) {

  app.get('/photo', photoControllers.photo);
  app.get('/photo/:id', photoControllers.getPhotoById);
  // 用户添加晒图路由注册
  app.post('/po-photo', photoControllers.poPhoto);
  // 用户更新图片信息路由注册
  app.put('/photo-update', photoControllers.updatePhoto);
  app.put('/photo', photoControllers.addCommentsPhoto);
  // 用户删除图片路由注册
  app.del('/photo-delete', photoControllers.deletePhoto);

};
