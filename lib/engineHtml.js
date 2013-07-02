/**
 * User: Nightink
 * Date: 13-4-13
 * Time: 下午11:45
 * html模型解析引擎,使用handlebars模版引擎
 */

var hbs = require('hbs')
  , fs = require('fs')
  , htmlCache = {};

//读取模版文件
function readHtml(path, option, fn) {
  var str = htmlCache[path];
  if(option.cache && str) return fn(str);   //判断是否开启模版缓存

  fs.readFile(path, 'utf8', function(err, str) {
    if(err) return fn(err);

    if(option.cache) htmlCache[path] = str;   //写入模版缓存
    fn(str);
  });
}

module.exports = function(path, option, fn) {
  readHtml(path, option, function(str) {
    var tmplFn = hbs.compile(str);      //handlebars模版解析
    fn(null, tmplFn(option));
  });
};