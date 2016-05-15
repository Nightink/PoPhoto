// NodeJS通用工具集
// 说明：通用工具集方法注释采用doc说明，便于后续项目开发使用

'use strict';

const crypto = require('crypto');
const config = require('../config/config.js');

// 数据加密
exports.encryptHelper = function(data) {

  const cipher = crypto.createCipher('aes-256-cbc', config.session.secret);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

// 数据解密
exports.decipherHelper = function(data) {
  const decipher = crypto.createDecipher('aes-256-cbc', config.session.secret);
  let dec = decipher.update(data, 'hex', 'utf8');

  try {
    dec += decipher.final('utf8');
    return dec;
  } catch (e) {
    return false;
  }
};
