/**
 * User: Nightink
 * Date: 13-4-13
 * Time: 上午3:09
 * 数据库配置文件
 */
var mongoose = require('mongoose')
  , config = require('../config');

module.exports = function(app, next) {      //连接数据库操作
  console.log('Debug: loader db config');

  mongoose.connect(config.dbAdd, {server: {auto_reconnect: true}}, function(err) {
    var status = err ? 'fialuer' : 'success';
    console.log('Debug: connect to %s %s', config.dbAdd, status);
    next(err);
  });
};