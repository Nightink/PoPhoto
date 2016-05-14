/**
 * request json handler json数据请求处理
 */

module.exports = function requestJSONHandler(req, res, next) {

  if (req.url.match(/\.json/g)) {
    res.back = {};

  } else {
    res.back = {
      userAgent: req.headers['user-agent'],
    };
  }
  next();
};
