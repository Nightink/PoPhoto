/**
 * 简单路由错误处理
 */

module.exports = function(req, res, next) {

  console.log('Debug: Error routes %s --> %s', req.method, req.url);
  next();
};
