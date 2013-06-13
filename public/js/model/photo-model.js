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
        , Backbone = require('backbone');

    var PhotoModel = Backbone.Model.extend({
        idAttribute: '_id',
        defaults : {
            "_id": null,
            "keywords": null,
            "url": null,
            "urlSmall": '',
            "title": '',
            "description": null,
            "created": null,
            "updated": null,
            "width": null,
            "height": null,
            "reviews": [],
            "type": ''
        },
        initialize : function (model, options) {
            var config = {};
            this.options = _.extend(config, options || {});
        },
        validate : function(attrs, options) {
            if(options.flag) {
                return this.__validate(attrs);
            } else {
                var currentAttr = this.attributes, newAttr = {}; //应该是判断是当前Model属性 而不是上一次Model属性
                for(var name in attrs) {
                    if(attrs[name] !== currentAttr[name]) {
                        newAttr[name] = attrs[name];
                    }
                }
                return this.__validate(newAttr);    //返回不为空，验证错误
            }

        },
        __validate: function(attrs) {   //统一验证方法
            var tipData = {              //验证信息结果包
                tagName: 'email',      //验证的字段
                tipStr: '正确',       //提醒消息
                flag: false           // true 验证成功 false 验证失败
            }
                , flag = false;
            for(var name in attrs) {
                if(name === 'id') continue;

                tipData.tagName = name;

                var val = attrs[name];

                try {
                    tipData = this[name + 'Verify'](val, tipData);
                    Observer.trigger('verify:photo-msg', tipData);
                } catch(err) {
                    console.log('查无此法');
                }

                if(!tipData.flag) flag = true;
            }
            return flag;
        },
        descriptionVerify: function(str, data) {
            if(!_.isEmpty(str)) {
                data.tipStr = '正确';
                data.flag = true;
            } else {
                data.tipStr = '描述一下这张图片吧!';
                data.flag = false;
            }
            return data;
        },
        keywordsVerify: function(str, data) {
            if( !_.isEmpty(str) ) {
                data.tipStr = '正确';
                data.flag = true;
            } else {
                data.tipStr = '请输入标签';
                data.flag = false;
            }
            return data;
        }
    });

    module.exports = PhotoModel;
});