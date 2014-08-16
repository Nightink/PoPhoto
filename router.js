/**
 * PoPhoto index 路由调度接口
 */

var debug     = require('debug')('pophoto:router');

var indexControllers = require('./controllers/index');
var oauthControllers = require('./controllers/oauth');
var attachmentControllers = require('./controllers/attachment');
var photoControllers = require('./controllers/photo');
var userControllers = require('./controllers/user');

module.exports = function(app) {

  app.get('/index.html', indexControllers.index);
  app.get('/', indexControllers.index);

  //用户登出操作
  app.get('/login-out', oauthControllers.loginOut);
  //用户登陆操作
  app.post('/login', oauthControllers.login);

  app.post('/upload', attachmentControllers.upload);
  app.get('/attachment/:id', attachmentControllers.download);
  app.get('/delete/:id', attachmentControllers.delete);

  app.get('/photo', photoControllers.photo);
  app.get('/photo/:id', photoControllers.getPhotoById);
  // 用户添加晒图路由注册
  app.post('/po-photo', photoControllers.poPhoto);
  // 用户更新图片信息路由注册
  app.put('/photo-update', photoControllers.updatePhoto);
  app.put('/photo', photoControllers.addCommentsPhoto);
  // 用户删除图片路由注册
  app.delete('/photo-delete', photoControllers.deletePhoto);

  app.get('/user/:id', userControllers.userInfo);
  app.get('/user', userControllers.getUserById);
  app.post('/add-user', userControllers.addUser);
  app.put('/user-update', userControllers.updateUser);

  debug('loaded router files');
};
