/**
 * User: Nightink
 * Date: 13-4-12
 * Time: 下午10:19
 * 用户路由处理
 */
var userControllers = require('../controllers/user');

module.exports = function(app) {

    app.get('/user/:id', userControllers.userInfo);
    app.get('/user', userControllers.getUserById);
    app.post('/add-user', userControllers.addUser);
    app.put('/user-update', userControllers.updateUser);

}
