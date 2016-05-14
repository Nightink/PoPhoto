/**!
 * 数据库配置文件
 */

'use strict';

const debug = require('debug')('pophoto:libs:mongo_connect');
const mongoose = require('mongoose');

const config = require('../config/config');

// 连接数据库操作
module.exports = function(app) {

  const done = app.readyCallback('mongo_connect');

  debug('loader db config file');

  const params = Object.assign({
    server: {
      auto_reconnect: true,
    },
  }, config.authParams);

  mongoose.connect(config.dbAdd, params, (err/* , data */) => {
    const status = err ? 'fialuer' : 'success';
    debug('connect to %s %s', config.dbAdd, status);
    done(err);
  });
};
