'use strict';

const debug = require('debug')('pophoto:controllers:oauth');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const utils = require('../../lib/utils');

exports.loginOut = function(req, res) {

  const redirect = req.query.redirect ? req.query.redirect : '/';
  if (req.session && req.session.user) {

    const userId = req.session.user.username;
    debug('用户"%s"登出', userId);
  }

  res.clearCookie('_id', { path:'/' });
  res.clearCookie('username', { path:'/' });
  // 移除session存储信息
  this.session.destroy();
  return this.redirect(redirect);
};

exports.login = function* (req, res) {
  const email = this.request.body.email;
  const password = this.request.body.password;

  if (!email || !password) {
    return this.body = {
      stat: 'fail',
      message: '请填写正确信息',
    };
  }

  const doc = yield this.app.service.user.login(email, password);

  User.findOne(params, function(err, doc) {

    if (err) {
      return res.json(500, err);
    }

    if (!doc) {
      return res.json(400, '登陆失败');
    }

    const result = {
      username: doc.username,
      _id: doc._id.toString(),
    };

    req.session.user = result;
    req.session.save(function(err) {
      res.cookie('_id', utils.encryptHelper(result._id), { path:'/', maxAge: config.cookieMaxage, httpOnly: true });
      res.cookie('username', result.username, { path:'/', maxAge: config.cookieMaxage });
      // 登陆成功，返回用户信息
      res.json(200, result);
    });

  });
};
