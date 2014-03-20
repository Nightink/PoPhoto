/**
 * 用户验证路由处理、验证业务逻辑处理
 */

var mongoose = require('mongoose');
var _        = require('underscore');

var User     = mongoose.model('User');
var config   = require('../conf/config.json');
var utils    = require('../libs/utils');

module.exports = function(app) {

  //用户登出操作
  app.get('/login-out', function(req, res) {

    var redirect = req.query.redirect ?  req.query.redirect : '/';
    if(req.session && req.session.user) {

      var userId = req.session.user.username;
      console.log('用户"' + userId + '"登出');
    }

    res.clearCookie('_id', { path:'/' });
    res.clearCookie('username', { path:'/' });
    // 移除session存储信息
    req.session.destroy();
    return res.redirect(redirect);
  });

  //用户登陆操作
  app.post('/login', function(req, res) {

    var email = req.body.email;
    var password = req.body.password;

    if(_.isEmpty(email) || _.isEmpty(password)) {
      return res.json(400, '请填写正确信息');
    }

    var params = {
      email: email,
      password: utils.encryptHelper(password)
    };

    User.findOne(params, function(err, doc) {

      if(err) {
        return res.json(500, err);
      }

      if(_.isNull(doc)) {
        return res.json(400, '登陆失败');
      }

      var result = {
        username: doc.username,
        _id: doc._id.toString()
      };

      req.session.user = result;
      req.session.save(function(err){

        res.cookie('_id', utils.encryptHelper(result._id), { path:'/', maxAge: config.cookieMaxage });
        res.cookie('username', result.username, { path:'/', maxAge: config.cookieMaxage });

        res.json(200, result);   //登陆成功，返回用户信息
      });

    });
  });
};
