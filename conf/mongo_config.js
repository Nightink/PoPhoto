/**
 * 数据库配置文件
 */

var mongoose = require('mongoose');

var _        = require('underscore');
var debug    = require('debug')('app:config');

var config   = require('./config');

module.exports = function(app, next) {      //连接数据库操作

  debug('loader db config file');

  var params = _.extend({

    server: {
      auto_reconnect: true
    }

  }, config.authParams || {});

  mongoose.connect(config.dbAdd, params, function(err, data) {

    var status = err ? 'fialuer' : 'success';

    debug('Debug: connect to %s %s', config.dbAdd, status);

    next(err);

  });

};
