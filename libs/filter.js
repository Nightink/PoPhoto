/**
 * 用户权限过滤器中间件
 */

var _              = require('underscore');

var config         = require('../conf/config');
var userController = require('../controllers/user');

// app.use中间件 function(req, res, next) {}
module.exports = function(req, res, next) {

  // 获取当前url
  var path = req.path;

  userController.userCorrect(req, res, function(result) {

    if(result) {

      return next();
    } else {

      // 遍历needFilter，返回第一个通过真值检测的元素值
      var verify = _.find(config.needFilter, function(nf) {

        return nf == path;
      });

      return verify ? res.redirect('/photos') : next();
    }
  });
};
