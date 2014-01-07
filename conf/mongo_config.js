/**
 * 数据库配置文件
 */

var mongoose = require('mongoose');

var _        = require('underscore');

var config   = require('./config');

module.exports = function(app, next) {      //连接数据库操作

  console.log('Debug: loader db config');

  var params = _.extend({

    server: {
      auto_reconnect: true
    }

  }, config.authParams || {});

  mongoose.connect(config.dbAdd, params, function(err, data) {

    var status = err ? 'fialuer' : 'success';

    console.log('Debug: connect to %s %s', config.dbAdd, status);

    next(err);

  });

};
