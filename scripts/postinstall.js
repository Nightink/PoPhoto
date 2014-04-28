
var fs = require('fs');

var copyFile = require('../libs/utils').copyFile;

var basePath = __dirname + '/../conf/';

copyFile(basePath + 'config.json.default', basePath + 'config.json');
