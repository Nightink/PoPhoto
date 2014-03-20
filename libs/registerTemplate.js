/**
 * handlebars模版注册
 */

var handlebars = require('handlebars');
var readString = require('fs').readFileSync;

// 注册top模版
handlebars.registerPartial('top',
  readString(__dirname + '/../views/partial/top.html', 'utf8'));
handlebars.registerPartial('photo-flow',
  readString(__dirname + '/../views/partial/photo-flow.html', 'utf8'));
handlebars.registerPartial('photoList',
  readString(__dirname + '/../views/partial/photo-list.html', 'utf8'));
