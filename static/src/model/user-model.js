/**
 * User: Nightink
 * Date: 13-4-7
 * Time: 下午10:12
 * 用户模型
 */

define(function (require, exports, module) {

    var _ = require('underscore');
    var observer = require('observer');
    var backbone = require('backbone');

    var UserModel = backbone.Model.extend({
        idAttribute: '_id',
        defaults : {
            "_id": null,
            "username": '',
            "gender": null,
            "email": '',
            "password": '',
            "cpassword": '',
            "created": null,
            "updated": null,
            "discipline": null
        },
        initialize : function (model, options) {
            var config = {};
            this.options = _.extend(config, options || {});
        }
    });

    UserModel.prototype.validate = function(attrs, options) {
        if(options.flag) {
            return this.__validate(attrs);
        } else {
            var currentAttr = this.attributes, newAttr = {}; //应该是判断是当前Model属性 而不是上一次Model属性
            for(var name in attrs) {
                if(attrs[name] !== currentAttr[name]) {
                    newAttr[name] = attrs[name];
                }
            }
            return this.__validate(newAttr);
        }

    };

    UserModel.prototype.__validate = function(attrs) {   //统一验证方法
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
                observer.trigger('verify:user-msg', tipData);
            } catch(err) {
                console.log('查无此法');
                tipData.flag = true;
            }

            if(!tipData.flag) flag = true;
        }
        return flag;
    };

    UserModel.prototype.emailVerify = function(str, data) {
        var regx = /^[^\.@]+@[^\.@]+\.[a-z]+$/;
        if(regx.test(str)) {
            data.tipStr = '正确';
            data.flag = true;
        } else {
            data.tipStr = '请输入合法电子邮箱';
            data.flag = false;
        }
        return data;
    };

    UserModel.prototype.passwordVerify = function(str, data) {
        if(str.length >= 6 ) {
            data.tipStr = '正确';
            data.flag = true;
        } else {
            data.tipStr = '密码必须大于六位';
            data.flag = false;
        }
        return data;
    };

    UserModel.prototype.cpasswordVerify = function(str, data) {
        if(str === this.get('password') ) {
            data.tipStr = '正确';
            data.flag = true;
        } else {
            data.tipStr = '两次密码不一致';
            data.flag = false;
        }
        return data;
    };

    module.exports = UserModel;
});
