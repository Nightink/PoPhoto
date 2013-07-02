/**
 * User: Nightink
 * Date: 13-4-13
 * Time: 上午3:23
 * User数据模型
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  //_id: String,                         //登陆ID
  username: { type: String, unique: true },           //登陆名称唯一性
  gender: { type: String, enum: ['男', '女'], default: '男' }, //性别
  email: String,                        //邮箱
  password: String,     //密码
  created: { type: Date, default: Date.now },         //创建时间
  updated: { type: Date, default: Date.now },    //更新于
  discipline: String    //专业
}, { versionKey: false});

mongoose.model('User', UserSchema);     //创建User用户文档模型
