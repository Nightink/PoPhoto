/**
 * User控制器
 */

'use strict';

const utils = require('../../lib/utils');

//  GET --> /user/:id  个人用户管理界面
exports.userInfo = function* () {
  const id = this.params.id;

  try {
    const doc = yield this.app.service.user.findOne(id);
    delete doc.password;
    return yield this.render('user.tpl', {
      title: 'PoPhoto',
      user: doc,
    });
  } catch (err) {
    this.logger.warn('[controller,user] find user:%s err %s', id, err);
    return yield this.render('error.tpl', {
      errorMsg: 'system errro',
    });
  }
};

// POST --> /add-user  添加用户控制器处理方法
exports.addUser = function* () {

  // 获取用户提交数据
  const reqBody = this.request.body;
  for (let key in reqBody) {
    const val = reqBody[key];
    if (val === null || val === '') {
      delete reqBody[key];
    }
  }

  reqBody.password = utils.encryptHelper(reqBody.password);
  reqBody.updated = new Date();

  try {
    yield this.app.service.user.saveOne(reqBody);

    return this.body = {
      stat: 'ok',
      message: '添加用户成功',
    };
  } catch (err) {
    this.logger.warn('[controller,user] save %s err %s', reqBody, err);
    return this.body = {
      stat: 'fail',
      message: '用户注册失败',
    };
  }
};

// PUT --> /user-update   用户更新数据
exports.updateUser = function(req, res) {

  const userModel = req.body;
  const userId = userModel._id;

  if (!userModel.username) {
    res.json(400, '用户昵称不能为空');
  }

  const opt = {
    username: userModel.username,
    password: utils.encryptHelper(userModel.password),
    gender: userModel.gender,
    discipline: userModel.discipline || '',
    update: Date.now,
  };

  const update = {
    $set: opt,
    // $addToSet: {
    //  update: Date.now
    // }
  };

  User.update({_id: userId}, update, function(err, num) {

    if (err) {

      return res.json(500, '用户信息更新错误');
    }

    if (num === 0) {

      return res.json(400, '用户信息错误');
    }

    return res.json(200, '用户更新成功');
  });
};

// 判断用户是否登录，或者登录有效，进行url过滤中间件
// 登录验证
exports.userCorrect = function(req, res, next) {

};

// 根据用户id 获取用户信息
exports.getUserById = function(req, res) {

  let userId = req.cookies._id;

  if (!userId) {

    return res.json(400, '未登录');
  }

  userId = utils.decipherHelper(userId);

  User.findOne({_id: userId}, function(err, doc) {

    if (err) {

      return res.json(400, '查询失败');
    }

    doc.password = utils.decipherHelper(doc.password);

    res.json(doc);
  });
};
