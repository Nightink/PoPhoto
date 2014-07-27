/**
 * 简单路由错误处理
 */

var debug     = require('debug')('app:middleware:routerErrorHandler');

module.exports = function routerErrorHandler(req, res, next) {

  debug('Error routes %s --> %s', req.method, req.url);
  next();
};
