/**
 * User数据模型
 */

var mongoose = require('mongoose');
var thunkify = require('thunkify');

/**
 * username: 登陆名称
 * created : 创建时间
 * updated : 更新时间
 * discipline : 专业
 */
var UserSchema = new mongoose.Schema({

  username : { type: String, unique: true },
  gender   : { type: String, enum: ['男', '女'], default: '男' },
  created  : { type: Date, default: Date.now },
  updated  : { type: Date, default: Date.now },

  email      : String,
  password   : String,
  discipline : String

}, { versionKey: false });

// 创建User用户文档模型
mongoose.model('User', UserSchema);

// co wrap
var User  = mongoose.model('User');
User.findOne = thunkify(User.findOne);
User.update = thunkify(User.update);
User.prototype.save = thunkify(User.prototype.save);
