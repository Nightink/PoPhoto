/**
 * User: Nightink
 * Date: 13-4-15
 * Time: 上午11:34
 * User控制器
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , config = require('../config')
  , utils = require('../lib/utils');

//  GET --> /user/:id  个人用户管理界面
exports.userInfo = function(req, res){
  var _id = req.params.id;

  User.findOne({ '_id': _id }, function(err, doc) {
    if(err) {
      console.log(err);
      return utils.sendStatus(req, res, 500, '服务器错误');
    } else {

      delete  doc.password;
      res.render('user', { title: 'PoPhoto', user: doc });
    }
  });
};

// POST --> /add-user  添加用户控制器处理方法
exports.addUser = function(req, res) {

  var reqBody = req.body;   //获取用户提交数据

  _.each(reqBody, function(val, key) {
    if( (val == null) || (val == '') ) delete reqBody[key];
  });

  reqBody.password = utils.encryptHelper(reqBody.password);
  reqBody.updated = new Date();

  var user = new User(reqBody);
  user.save(function(err) {
    if(err) return utils.sendStatus(req, res, 400, '用户注册失败');

    utils.sendStatus(req, res, 200, "添加用户成功");
  });
  
};

//PUT --> /user-update   用户更新数据
exports.updateUser = function(req, res) {
  var userModel = req.body;
  var userId = userModel._id;

  console.log(userModel);

  if(_.isNull(userModel.username)) utils.sendStatus(req, res, 403, '用户昵称不能为空');

  var opt = {
    username: userModel.username,
    password: utils.encryptHelper(userModel.password),
    gender: userModel.gender,
    discipline: userModel.discipline || '',
    update: Date.now
  };
  var update =  { "$set": opt/*, "$addToSet": { update: Date.now }*/ };

  User.update({_id: userId}, update, function(err, num){
    if(err) return utils.sendStatus(req, res, 500, '用户信息更新错误');;
    if(num === 0) return utils.sendStatus(req, res, 403, '用户信息错误');
    return utils.sendStatus(req, res, 200, '用户更新成功');
  });
};

//判断用户是否登录，或者登录有效，进行url过滤中间件
//登录验证
exports.userCorrect = function(req, res, next) {
  var _id = req.cookies._id;

  if(!_id && req.session.user) {      //session还存活cookie被删除的情况
    res.cookie('_id', utils.encryptHelper(result._id), { path:'/', maxAge: config.cookie_maxage });
    res.cookie('username', result.username, { path:'/', maxAge: config.cookie_maxage });
    return next(true, req.session.user);
  }
  if(!_id) return next(false);

  _id = utils.decipherHelper(_id);

  if(!req.session.user) {
    User.findOne({ "_id": _id }, function(err, doc) {
      if(err) console.log(err);
      if(!doc) return next(false);

      req.session.user = doc;
      req.session.save(function(err) {
        if(err) console.log(err);
        next(true, req.session.user);
      });
    });
  } else if(req.session.user._id !== _id) {
    next(false);
  } else if(req.session.user._id === _id) {
    next(true, req.session.user);
  } else {
    next(false);
  }
};

exports.getUserById = function(req, res) {
  var userId = req.cookies._id;

  if(!userId) return utils.sendStatus(req, res, 404, '未登录');

  userId = utils.decipherHelper(userId);

  User.findOne({_id: userId}, function(err, doc) {
    console.log(doc);
    if(err) return utils.sendStatus(req, res, 500, '查询失败');

    doc.password = utils.decipherHelper(doc.password);
    console.log(doc);
    utils.sendJson(req, res, doc);
  });
};