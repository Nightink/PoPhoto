/**
 * 服务器5**错误消息处理
 */

module.exports = function serverErrorHandler(err, req, res, next) {

  console.log(err.stack);
  res.end(500, err.message);
};
