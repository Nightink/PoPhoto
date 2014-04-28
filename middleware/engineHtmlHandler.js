
// tpl类型解析引擎,使用handlebars模版引擎

var fs         = require('fs');

var handlebars = require('handlebars');

var htmlCache  = {};

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

module.exports = function engineHtmlHandler(path, option, fn) {

  readHtml(path, option, function(str) {

    // handlebars模版解析
    var tplFn = handlebars.compile(str);
    fn(null, tplFn(option));
  });
};
