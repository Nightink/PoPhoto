/**
 * User: Nightink
 * Date: 13-4-7
 * Time: 下午10:12
 * 用户模型
 */

define(function (require, exports, module) {

  var backbone = require('backbone');
  var PhotoModel = require('./photo-model');

  var PhotoCollection = backbone.Collection.extend({
    // 指定控制器的数据模型
    model : PhotoModel,

    initialize : function (models, options) {}
  });

  module.exports = PhotoCollection;
});
