/**
 * 
 * User: Nightink
 * Date: 13-4-13
 * Time: 下午11:45
 * html模型解析引擎,使用handlebars模版引擎
 * 
 */

var fs        = require('fs');
var hbs       = require('hbs');

var htmlCache = {};

// 读取模版文件
function readHtml(path, option, fn) {

  var str = htmlCache[path];

  // 判断是否开启模版缓存
  if(option.cache && str) {

    return fn(str);
  }

  fs.readFile(path, 'utf8', function(err, str) {

    if(err) {
 
      return fn(err);
    }

    // 写入模版缓存
    if(option.cache) {

      htmlCache[path] = str;
    }

    fn(str);

  });
}

module.exports = function(path, option, fn) {

  readHtml(path, option, function(str) {

    // handlebars模版解析
    var tmplFn = hbs.compile(str);
    fn(null, tmplFn(option));
  });
};