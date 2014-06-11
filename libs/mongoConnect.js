
// 数据库配置文件

var _         = require('underscore');
var debug     = require('debug')('app:config');
var mongoose  = require('mongoose');

var config    = require('../conf/config.json');
var debugging = require('./debugging');

module.exports = function(next) {      //连接数据库操作

  debugging(debug, 'loader db config file');

  var params = _.extend({

    server: {
      auto_reconnect: true
    }

  }, config.authParams || {});

  mongoose.connect(config.dbAdd, params, function(err, data) {

    var status = err ? 'fialuer' : 'success';

    debugging(debug, 'connect to %s %s', config.dbAdd, status);

    next(err);

  });

};
