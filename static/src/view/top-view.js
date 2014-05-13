/**
 * 主页头部模块
 */

define(function (require, exports, module) {

  var backbone    = require('backbone');
  var $           = require('jquery');
  var observer    = require('observer');
  var handlebars  = require('handlebars');

  var PoPhotoView = require('./pophoto-view');
  var UserModel   = require('../model/user-model');
  var UserView    = require('./user-view');

  var TopView = backbone.View.extend({

    el: '.pull-right',

    // 载入模版文件
    template: handlebars.compile(require('../tpl/top-view.tpl')),

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
      this.userView = new UserView({
        el: '#register-user'
      });
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

    uploadFn: function(e) {
      this.poPhotoView.render();
    },

    userRegister: function(e) {
      this.userView.render();
      this.userView.$el.modal();
    },

    userLogin: function(e) {
      var self = this;

      self.userModel.save(null, {
        url: '/login',
        // success事件监听回调函数
        success: function(model, str) {
          self.userModel = new UserModel();
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
