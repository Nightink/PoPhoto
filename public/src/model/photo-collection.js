/**
 * User: Nightink
 * Date: 13-4-7
 * Time: 下午10:12
 * 用户模型
 */

define(function (require, exports, module) {
    var $ = require('jquery')
        , _ = require('underscore')
        , Observer = require('observer')
        , Backbone = require('backbone')
        , PhotoModel = require('./photo-model');

    var PhotoCollection = Backbone.Collection.extend({
        model : PhotoModel,   //指定控制器的数据模型

        initialize : function (models, options) {}
    });

    module.exports = PhotoCollection;
});