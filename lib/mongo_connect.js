/**!
 * 数据库配置文件
 */

'use strict';

const debug = require('debug')('po:lib:mongo_connect');
const mongoose = require('mongoose');

// 连接数据库操作
module.exports = function(app) {
  const done = app.readyCallback('mongo_connect');
  const config = app.config;

  debug('loader db config file');

  const params = Object.assign({
    server: {
      auto_reconnect: true,
    },
  }, config.mongodb.authParams);

  mongoose.connect(config.mongodb.dbAdd, params, (err/* , data */) => {
    const status = err ? 'fialuer' : 'success';
    debug('connect to %s %s', config.mongodb.dbAdd, status);
    done(err);
  });
};
