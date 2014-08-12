/**
 * User控制器
 */

var mongoose = require('mongoose');
var _        = require('underscore');

var User     = mongoose.model('User');
var config   = require('../conf/config.json');
var utils    = require('../libs/utils');

//  GET --> /user/:id  个人用户管理界面
exports.userInfo = function *userInfo(){

  var params = {
    '_id': this.params.id
  };

  var doc = yield User.findOne(params);
  delete doc.password;
  var renderParams = {
    title: 'PoPhoto',
    user: doc
  };

  this.status = 200;
  this.body = yield this.render('user', renderParams);
};

// POST --> /add-user  添加用户控制器处理方法
exports.addUser = function *addUser() {

  // 获取用户提交数据
  var reqBody = this.request.body;

  _.each(reqBody, function(val, key) {

    if( (val === null) || (val === '') ) {

      delete reqBody[key];
    }
  });

  reqBody.password = utils.encryptHelper(reqBody.password);
  reqBody.updated = new Date();

  var user = new User(reqBody);
  try {
    yield user.save();
    this.status = 200;
    this.body = '添加用户成功';
  } catch(e) {

    this.status = 400;
    this.body = '用户注册失败';
  }
};

//PUT --> /user-update   用户更新数据
exports.updateUser = function *updateUser() {

  var userModel = this.request.body;
  var userId = userModel._id;

  // utils.log(userModel);

  if(_.isNull(userModel.username)) {

    this.status = 400;
    this.body = '用户注册失败';
    return;
  }

  var update =  {
    $set: {
      username   : userModel.username,
      password   : utils.encryptHelper(userModel.password),
      gender     : userModel.gender,
      discipline : userModel.discipline || '',
      update     : Date.now
    }
  };

  var num = yield User.update({_id: userId}, update);

  if(num === 0) {

    this.status = 400;
    this.body = '用户信息错误';
  } else {

    this.status = 200;
    this.body = '用户更新成功';
  }
};

// 判断用户是否登录，或者登录有效，进行url过滤中间件
// 登录验证
exports.userCorrect = function(req, res, next) {

  var _id = req.cookies._id;
  var result = req.session.user;

  // session还存活cookie被删除的情况
  if(!_id && result) {

    var cookieParams = {

      path   : '/',
      maxAge : config.cookieMaxage
    };

    res.cookie('_id', utils.encryptHelper(result._id), cookieParams);
    res.cookie('username', result.username, cookieParams);

    return next(true, result);
  }

  if(!_id) {

    return next(false);
  }

  _id = utils.decipherHelper(_id);

  if(!result) {

    User.findOne({ '_id': _id }, function(err, doc) {

      if(err) {

        console.log(err);
      }
      if(!doc) {

        return next(false);
      }

      req.session.user = doc;

      req.session.save(function(err) {

        if(err) {

          console.log(err);
        }

        next(true, req.session.user);
      });
    });
  } else if(result._id !== _id) {

    next(false);
  } else if(result._id === _id) {

    next(true, result);
  } else {

    next(false);
  }
};

// 根据用户id 获取用户信息
exports.getUserById = function(req, res) {

  var userId = req.cookies._id;

  if(!userId) {

    return res.json(400, '未登录');
  }

  userId = utils.decipherHelper(userId);

  User.findOne({_id: userId}, function(err, doc) {

    if(err) {

      return res.json(400, '查询失败');
    }

    doc.password = utils.decipherHelper(doc.password);

    res.json(doc);
  });
};
