/**
 * PoPhoto index 路由调度接口
 */

'use strict';

module.exports = function(app) {
  app.get('/', app.controller.index.index);

  // 用户登出操作
  app.get('/login-out', app.controller.oauth.loginOut);
  // 用户登陆操作
  app.post('/login', app.controller.oauth.login);

  app.post('/upload', app.controller.attachment.upload);
  app.get('/attachment/:id', app.controller.attachment.download);
  app.get('/delete/:id', app.controller.attachment.delete);

  app.get('/photo', app.controller.photo.photo);
  app.get('/photo/:id', app.controller.photo.getPhotoById);
  // 用户添加晒图路由注册
  app.post('/po-photo', app.controller.photo.poPhoto);
  // 用户更新图片信息路由注册
  app.put('/photo-update', app.controller.photo.updatePhoto);
  app.put('/photo', app.controller.photo.addCommentsPhoto);
  // 用户删除图片路由注册
  app.delete('/photo-delete', app.controller.photo.deletePhoto);

  app.get('/user/:id', app.controller.user.userInfo);
  app.get('/user', app.controller.user.getUserById);
  app.post('/add-user', app.controller.user.addUser);
  app.put('/user-update', app.controller.user.updateUser);
};
