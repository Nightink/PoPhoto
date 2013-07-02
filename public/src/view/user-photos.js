/**
 * User: Nightink
 * Date: 13-5-21
 * Time: 下午2:21
 *
 * 用户个人图片管理
 */

define(function (require, exports, module) {

    var $ = require('jquery')
        , Backbone = require('backbone')
        , Handlebars = require('handlebars')
        , Observer = require('observer')
        , PhotoCollection = require('../model/photo-collection')
        , PhotoModel = require('../model/photo-model');

    var PhotoUpdateView = Backbone.View.extend({
        el: 'body',

        template: Handlebars.compile(require('../tpl/photo-update.tpl')),

        initialize: function(option) {
            this.photoModel = option.model;
            var data =  option.model.toJSON();
            data.keywords = data.keywords.join(' ');

            this.$el.html(this.template(data));
        },

        events: {
            'blur #title': 'valueSet',
            'blur #description': 'valueSet',
            'blur #keywords': 'valueSet',
            'click .sure-update': 'sureUpdate',
            'click .close-cancel': 'closeCancel'
        },

        valueSet: function(e) {
            var $dom = $(e.target)
                , str = $.trim($dom.val())
                , name = $dom.attr('name')
                , opt = {};
            opt[name] = str;
            this.photoModel.set(opt);
        },

        sureUpdate: function(e) {
            var self = this;

            self.photoModel.save(null, {
                url: '/photo-update',
                success: function(model, str) {     //success事件监听回调函数
                    alert(str);
                    self.$el.modal('hide');
                    self.photoModel = new PhotoModel;
                    //Observer.trigger('po-photo:success', model);
                },
                error: function(model, str) {
                    console.log(model, str);
                }
            });
        },

        closeCancel: function(e) {
            this.$el.modal('hide');
        },

        render: function() {
            this.$el.modal();
        },

        dispose: function() {
            this.$el.remove();
        }
    });

    var UserPhotosView = Backbone.View.extend({
        el: 'body',

        template: Handlebars.compile(require('../tpl/user-photos.tpl')),

        events: {
            'click .edit': 'editPhoto',
            'click .delete': 'deletePhoto'
        },

        initialize: function(option) {
            this.photoCollection = new PhotoCollection(null, { view: this });
            this.photoCollection.on('sync', this.render, this);
            Observer.on('add', this.render, this);

            this.getPhotos();
        },

        getPhotos: function() {
            var opt = {};
            opt.author = $.cookie('username');

            this.photoCollection.fetch({
                url: '/photos.json',
                data: opt
            });
        },

        render: function() {
            var content = this.template({ 'photos': this.photoCollection.toJSON() });
            this.$el.html(content);
            var timeBatchConversion = require("../util/timeBatchConversion");
            timeBatchConversion.time(this.$el.find('.createdTime'));
        },

        editPhoto: function(e) {
            var index = $(e.target).closest('.module-con').index();
            var model = this.photoCollection.at(index);
            Observer.trigger('model:edit', model);
            var photoUpdateView = new PhotoUpdateView({ el: '#photo-update', model: model });
            photoUpdateView.render();
        },

        deletePhoto: function(e) {
            var index = $(e.target).closest('.module-con').index();
            var model = this.photoCollection.at(index);
            var self = this;
            model.destroy({
                url: '/photo-delete?_id=' + model.get('_id'),
                success: function(model, str) {
                    alert(str);
                    self.photoCollection.remove(model);
                    self.render();
                }
            });
        }
    });

    //注销用户视图
    UserPhotosView.prototype.dispose = function() {
        this.$el.remove();
    };

    module.exports = UserPhotosView;
});