/**
 * User: Nightink
 * Date: 13-5-7
 * Time: 下午11:07
 */

define(function (require, exports, module) {

    var Backbone = require('backbone')
        , $ = require('jquery')
        , observer = require('observer')
        , Handlebars = require('handlebars')
        , PoPhotoView = require('./pophoto-view')
        , UserModel = require('../model/user-model')
        , UserView = require('./user-view');

    var userView = new UserView({ el: '#register-user' });

    var TopView = Backbone.View.extend({
        el: '.pull-right',
        template: Handlebars.compile(require('../tpl/top-view.tpl')),   //载入模版文件
        events: {
            'click .uploadBtn': 'uploadFn',
            'click #user-register': 'userRegister',
            'click #user-login': 'userLogin',
            'blur .email': 'valueSet',
            'blur .password': 'valueSet'
        },

        initialize: function() {
            this.poPhotoView = new PoPhotoView();
            this.userModel = new UserModel();
        },

        valueSet: function(e) {
            var $dom = $(e.target)
                , str = $.trim($dom.val())
                , name = $dom.attr('name');

            this[name + 'Set'](str);
        },

        emailSet: function(str) {
            this.userModel.set({ email: str }, {validate: true});
        },

        passwordSet: function(str) {
            this.userModel.set({ password: str }, {validate: true});
        },

        uploadFn: function(e) {
            this.poPhotoView.render();
            //this.$el.modal();
        },

        userRegister: function(e) {
            userView.render();
            userView.$el.modal();
        },

        userLogin: function(e) {
            var self = this;

            self.userModel.save(null, {
                url: '/login',
                success: function(model, str) {     //success事件监听回调函数
                    self.userModel = new UserModel;
                    self.data = { user: str };
                    self.render();
                    observer.trigger('login:success');
                }
            });
        },

        render: function() {
            this.$el.html(this.template(this.data));
        }
    });

    module.exports = TopView;

});