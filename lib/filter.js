/**
 * User: Eyes
 * Date: 13-5-4
 * Time: 下午10:53
 * 用户权限过滤器中间件
 */

var config = require('../config')
  , userController = require('../controllers/user')
  , _ = require('underscore');

var needFilter = ['/photos.json', '/photo-delete', '/po-photo', '/user'];   //设置过滤url集合

module.exports = function(req, res, next) {   //app.use中间件 function(req, res, next) {}
  //获取当前url
  var path = req.path;
  userController.userCorrect(req, res, function(result) {
    if(result) {
      return next();
    } else {
      //遍历needFilter，返回第一个通过真值检测的元素值
      var verify = _.find(needFilter, function(nf) {
        return nf == path;
      });

      if(verify) {
        return res.redirect('/photos');
      } else {
        return next();
      }
    }
  });
};