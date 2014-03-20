/**
 * 简单路由错误处理
 */

var debug     = require('debug')('app:router');
var debugging = require('../libs/debugging');

module.exports = function(req, res, next) {

  debugging(debug, 'Error routes %s --> %s', req.method, req.url);
  next();
};
