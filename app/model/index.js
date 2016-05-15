/**
 * 数据模型统一调度接口
 */
'use strict';

const debug = require('debug')('pophoto:models');

module.exports = function(app) {
  app.ready(() => {
    require('./photo');
    require('./user');
    debug('loaded model files');
  });
};
