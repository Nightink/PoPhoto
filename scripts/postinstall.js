
var fs = require('fs');

var utils = require('../libs/utils');

var basePath = __dirname + '/../conf/';
var confPath = basePath + 'config.json';

if(!fs.existsSync(confPath)) {

  utils.copyFile(basePath + 'config.json.default', confPath);
}
