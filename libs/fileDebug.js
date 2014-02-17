/**
 * 前端js开发debug模式
 */

var fs      = require('fs');
var path    = require('path');
var format  = require('util').format;

var _       = require('underscore');

var seaPath = require('../conf/config.json').staticPath;

/**
 * 生成sea.js config 配置文件，用于前端是否js debug 文件输出
 * @param  {Boolean} isDebug 是否开启debug
 */
module.exports = function(isDebug) {

  var json = JSON.parse(fs.readFileSync(path.join(seaPath, 'sea-modules/config.json')));

  if(isDebug) {

    var alias = json.alias;

    _.each(alias, function(val, k) {

      alias[k] = val + '-debug';
    });
  }

  // 格式化输出
  var string = format('seajs.config(%s);', JSON.stringify(json, null, 4));

  fs.writeFileSync(path.join(seaPath, 'sea-modules/sea-config.js'), string);

  console.log('Debug: create web front sea.js config javascript file');

};
