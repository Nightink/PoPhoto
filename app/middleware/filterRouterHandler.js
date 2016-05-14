/**
 * 用户权限过滤器中间件
 */

'use strict';

const config = require('../config.json');
const userController = require('../controllers/user');

// app.use中间件 function(req, res, next) {}
module.exports = function filterRouterHandler* (next) {

  // 获取当前url
  const path = this.path;

  userController.userCorrect(req, res, function(result) {
    if (!result) {
      // 遍历needFilter，返回第一个通过真值检测的元素值
      const verify = config.needFilter.find(nf => nf === path);

      // 无用户权限，则跳转到首页
      return verify ?
        res.redirect('/') :
        next();
    }

    return next();
  });

  let _id = this.cookies._id;
  const result = this.session.user;

  // session还存活cookie被删除的情况
  if (!_id && result) {

    const cookieParams = {
      path: '/',
      maxAge: config.cookieMaxage,
    };

    this.cookie.set('_id', utils.encryptHelper(result._id), cookieParams);
    this.cookie.set('username', result.username, cookieParams);

    return yield next(true, result);
  }

  if (!_id) {

    return next(false);
  }

  _id = utils.decipherHelper(_id);

  if (!result) {

    User.findOne({ '_id': _id }, function(err, doc) {

      if (err) {

        console.log(err);
      }
      if (!doc) {

        return next(false);
      }

      req.session.user = doc;

      req.session.save(function(err) {

        if (err) {

          console.log(err);
        }

        next(true, req.session.user);
      });
    });
  } else if (result._id !== _id) {

    next(false);
  } else if (result._id === _id) {

    next(true, result);
  } else {

    next(false);
  }
};
