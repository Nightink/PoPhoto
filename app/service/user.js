/**!
 * 个人信息处理
 */

'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const utils = require('../../lib/utils');

exports.login = function* (username, password) {
  const params = {
    email: username,
    password: utils.encryptHelper(password),
  };

  return yield this.findOne(params);
};

exports.findOne = function(params) {
  return new Promise((resolve, reject) => {
    User.findOne(params, (err, doc) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(doc);
      }
    });
  });
};

exports.saveOne = function(info) {
  const user = new User(info);
  return new Promise((resolve, reject) => {
    user.save(err => {
      if (err) return reject(err);
      return resolve(user);
    });
  });
};
