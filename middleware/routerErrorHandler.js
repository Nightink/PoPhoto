/**
 * 简单路由错误处理
 */

var debug     = require('debug')('app:router');

module.exports = function requestJSONHandler(req, res, next) {

  debug('Error routes %s --> %s', req.method, req.url);
  next();
};
