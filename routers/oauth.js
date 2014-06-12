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
  app.get('/login-out', function *() {

    var redirect = this.query.redirect ?  this.query.redirect : '/';
    if(this.session && this.session.user) {

      var userId = this.session.user.username;
      console.log('用户"%s"登出', userId);
    }

    this.cookies.set('_id', null);
    this.cookies.set('username', null);
    // 移除session存储信息
    this.session = null;
    this.redirect(redirect);
  });

  //用户登陆操作
  app.post('/login', function *() {

    var email = this.request.body.email;
    var password = this.request.body.password;

    if(_.isEmpty(email) || _.isEmpty(password)) {
      this.status = 400;
      return this.body = '请填写正确信息';
    }

    var params = {
      email: email,
      password: utils.encryptHelper(password)
    };

    try {

      var doc = yield User.findOne(params);
      if(_.isNull(doc)) {

        this.status = 400;
        return this.body = '登陆失败';
      }

      var result = {
        username: doc.username,
        _id: doc._id.toString()
      };

      var cookieParams = {
        path:'/',
        maxage: config.cookieMaxage
      };

      this.session.user = result;
      this.cookies.set('_id', utils.encryptHelper(result._id), cookieParams);
      this.cookies.set('username', result.username, cookieParams);
      this.status = 200;
      this.body = result;
    } catch(err) {

      console.log(err.stack);
      this.status = 500
      this.body = 'server error';
    }
  });
};
