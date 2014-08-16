
var debug     = require('debug')('pophoto:controllers:oauth');

var mongoose = require('mongoose');
var _        = require('underscore');

var User     = mongoose.model('User');

var config   = require('../config.json');
var utils    = require('../libs/utils');

exports.loginOut = function(req, res) {

  var redirect = req.query.redirect ?  req.query.redirect : '/';
  if(req.session && req.session.user) {

    var userId = req.session.user.username;
    debug('用户"%s"登出', userId);
  }

  res.clearCookie('_id', { path:'/' });
  res.clearCookie('username', { path:'/' });
  // 移除session存储信息
  req.session.destroy();
  return res.redirect(redirect);
};

exports.login = function(req, res) {

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
      res.cookie('_id', utils.encryptHelper(result._id), { path:'/', maxAge: config.cookieMaxage, httpOnly: true });
      res.cookie('username', result.username, { path:'/', maxAge: config.cookieMaxage });
      //登陆成功，返回用户信息
      res.json(200, result);
    });

  });
};