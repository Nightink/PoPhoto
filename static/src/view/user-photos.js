/**
 * 用户个人图片管理
 */

define(function (require, exports, module) {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var handlebars = require('handlebars');
    var _ = require('underscore');
    var moment = require('moment');
    var observer = require('observer');
    var PhotoCollection = require('../model/photo-collection');
    var PhotoModel = require('../model/photo-model');

    require("../util/cookie");

    var console = window.console || function() {};

    var PhotoUpdateView = Backbone.View.extend({
        el: 'body',

        events: {
            'blur #title': 'valueSet',
            'blur #description': 'valueSet',
            'blur #keywords': 'valueSet',
            'click .sure-update': 'sureUpdate',
            'click .close-cancel': 'closeCancel'
        },

        template: handlebars.compile(require('../tpl/photo-update.tpl')),

        initialize: function(option) {
            this.photoModel = option.model;
            var data =  option.model.toJSON();
            data.keywords = data.keywords.join(' ');

            this.$el.html(this.template(data));
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
                // success事件监听回调函数
                success: function(model, str) {

                    self.$el.modal('hide');
                    self.photoModel = new PhotoModel;
                    // observer.trigger('po-photo:success', model);
                },
                error: function(model, str) {

                    alert(str);
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

        template: handlebars.compile(require('../tpl/user-photos.tpl')),

        events: {
            'click .edit': 'editPhoto',
            'click .delete': 'deletePhoto'
        },

        initialize: function(option) {
            this.photoCollection = new PhotoCollection(null, { view: this });
            this.photoCollection.on('sync', this.render, this);
            observer.on('add', this.render, this);

            this.getPhotos();
        },

        getPhotos: function() {
            var opt = {};
            opt.author = $.cookie('username');

            this.photoCollection.fetch({
                url: '/photo',
                data: opt
            });
        },

        render: function() {

            var photos = this.photoCollection.toJSON();

            _.each(photos, function(photo) {

                photo.created = moment(photo.created).format('YYYY-MM-DD HH:mm:ss');
            });

            var content = this.template({
                photos: photos
            });

            this.$el.html(content);
        },

        editPhoto: function(e) {
            var index = $(e.target).closest('.module-con').index();
            var model = this.photoCollection.at(index);
            observer.trigger('model:edit', model);
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
