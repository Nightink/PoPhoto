/**
 * User: Nightink
 * Date: 13-5-5
 * Time: 下午11:11
 * 用户注册视图
 */

define(function (require, exports, module) {
    var $ = require('jquery')
        , _ = require('underscore')
        , observer = require('observer')
        , UserModel = require('../model/user-model')
        , Backbone = require('backbone');

    var UserView = Backbone.View.extend({
        el: '#register-user',
        // 载入模版文件
        template: require('../tpl/user-view.tpl'),
        initialize: function() {
            this.userModel = new UserModel;

            observer.on('verify:user-msg', this.tipMsg, this);
        },
        events: {
            'blur #user-email': 'valueSet',
            'blur #password': 'valueSet',
            'blur #confirm-password': 'valueSet',
            'blur #user-name': 'valueSet',
            'click .register-confirm': 'registerUser',
            'click .register-cancel': 'registerCancel'
        },
        valueSet: function(e) {
            var $dom = $(e.target);
            var str = $.trim($dom.val());
            var name = $dom.attr('name');

            this[name + 'Set'](str);
        },
        emailSet: function(str) {
            this.userModel.set({ email: str }, {validate: true});
        },
        passwordSet: function(str) {
            this.userModel.set({ password: str }, {validate: true});
        },
        cpasswordSet: function(str) {
            this.userModel.set({ cpassword: str }, {validate: true});
        },
        usernameSet: function(str) {
            this.userModel.set({ username: str }, {validate: true});
        },
        //验证信息DOM显示
        tipMsg: function(data) {
            if(data.flag) {
                this.$('#' + data.tagName + '-tips').html(data.tipStr).attr('class', 'self-ok');
            } else {
                this.$('#' + data.tagName + '-tips').html(data.tipStr).attr('class', 'self-error');
            }
        },
        //sync success 事件监听回调函数
        success: function(model, str) {
            //observer.trigger('add');
            alert(str);
            this.userModel = new UserModel;
            this.userModel.on('sync', this.success, this);
            this.render();
            this.$el.modal('hide');
        },
        registerUser: function(e) {
            // success回调 所以必须使用self来缓存当前视图对象
            var self = this;

            self.userModel.save(null, {
                url: '/add-user',
                // success事件监听回调函数
                success: function(model, str) {
                    alert(str);
                    self.$el.modal('hide');
                    self.userModel = new UserModel;
                },
                error: function(model, str) {
                    alert(str);
                    self.$el.model('hide');
                    self.userModel = new UserModel;
                }
            });
        },
        registerCancel: function(e) {
            this.$el.modal('hide');
        },
        render: function() {
            this.$el.html(this.template);
        },
        dispose: function() {
            this.$el.remove();
        }
    });

    module.exports = UserView;
});