/**
 * User: Nightink
 * 
 * 前端js開發debug模式
 */

var _ = require('underscore');

var fs = require('fs');
var path = require('path');

var seaPath = '../public/sea-modules'

module.exports = function(isDebug) {

  return function(req, res, next) {

    var json = JSON.parse(fs.readFileSync(path.join(__dirname, seaPath, 'config.json')));

    if(isDebug) {

      var alias = json.alias;

      _.each(alias, function(val, k) {

        alias[k] = val + '-debug';
      });
    }

    var string = 'seajs.config(' + JSON.stringify(json) + ');';

    fs.writeFileSync(path.join(__dirname, seaPath, 'sea-config.js'), string);

    res.setHeader('Content-Type', 'application/javascript');
    res.send(200, string);
  }

};
