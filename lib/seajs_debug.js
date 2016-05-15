/**
 * 前端js开发debug模式
 */

'use strict';

const fs = require('fs');
const path = require('path');
const format = require('util').format;

const debug = require('debug')('po:lib:seajs_debug');

const seaPath = require('../config/config').staticPath;

/**
 * 生成sea.js config 配置文件，用于前端是否js debug 文件输出
 * @param  {Boolean} isDebug 是否开启debug
 */
module.exports = function(isDebug) {

  const baseSeaPath = path.join(seaPath, 'sea-modules/sea-config');
  const json = JSON.parse(fs.readFileSync(baseSeaPath + '.json'));

  if (isDebug) {

    const alias = json.alias;
    for (let k in alias) {
      const val = alias[k];
      alias[k] = val + '-debug';
    }
  }

  // 格式化输出
  const string = format('seajs.config(%s);', JSON.stringify(json, null, 2));
  fs.writeFileSync(`${baseSeaPath}.js`, string);
  debug('create web front sea.js config javascript file');

};
