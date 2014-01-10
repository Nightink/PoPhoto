/**
 * 用户路由处理
 */
var userControllers = require('../controllers/user');

module.exports = function(app) {

  app.get('/user/:id', userControllers.userInfo);
  app.get('/user', userControllers.getUserById);
  app.post('/add-user', userControllers.addUser);
  app.put('/user-update', userControllers.updateUser);

}
