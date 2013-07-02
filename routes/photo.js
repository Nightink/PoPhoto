/**
 * User: Nightink
 * Date: 13-4-13
 * Time: 上午00:14
 * photo 路由处理
 */

 /**
  * Restful接口化开发 路由定制 get post put delete
  */

var photoControllers = require('../controllers/photo');

module.exports = function(app) {

  app.get('/photos', photoControllers.photos);
  app.get('/photos.json', photoControllers.photosJson);
  app.get('/photos/:id', photoControllers.getPhotoById);
  app.post('/po-photo', photoControllers.poPhoto);            //用户添加晒图路由注册
  app.put('/photo-update', photoControllers.updatePhoto);     //用户更新图片信息路由注册
  app.put('/photos', photoControllers.addCommentsPhoto);
  app.delete('/photo-delete', photoControllers.deletePhoto);  //用户删除图片路由注册

};