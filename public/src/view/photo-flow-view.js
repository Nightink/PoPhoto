/**
 * User: Nightink
 * Date: 13-5-12
 * Time: 下午4:54
 * 图片流视图
 */

define(function (require, exports, module) {
    var $ = require('jquery')
        , _ = require('underscore')
        , Backbone = require('backbone')
        , Observer = require('observer')
        , Handlebars = require('handlebars')
        , PhotoCollection = require('../model/photo-collection')
        , PhotoModel = require('../model/photo-model')
        , fileUpload = require('../util/fileUpload');

    var CommentsView = Backbone.View.extend({
        el: 'body',

        template: Handlebars.compile(require('../tpl/comments-view.tpl')),

        initialize: function(option) {
            this.model = option.model;
        },

        events: {
            'click .submit': 'submitComment',
            'click .box_beforeRemark': 'showBox',
            'click .refreshComments': 'refreshComments'
        },

        submitComment: function(e) {
            var content = $('.new_remark textarea').val();
            var model = this.model
            model.get('reviews').push({ content: content });
            model.save(null, {
                url: '/photos',
                success: function(model, str) {
                    alert(str);
                }
            });
        },

        refreshComments: function(e) {
            Observer.trigger('refresh:comments');
        },

        showBox: function(e) {
            $('.box_beforeRemark').hide();
            $('.new_remark').show();
            $('.new_remark textarea').focus();
        },

        render: function() {
            this.$el.find('#remarkLayout').remove();

            var data = this.model.toJSON();
            data.number = data.reviews.length;

            var contents = this.template(data);

            this.$el.append(contents);

            var windowHeight = $(window).height()
                , remarkLayout = windowHeight - 60
                , $remarkLayout = this.$el.find('#remarkLayout');

            $remarkLayout.css("height", remarkLayout+"px");

            $remarkLayout.css({ "top": "20px", "right": "20px" });

            var timeBatchConversion = require("../util/timeBatchConversion");
            timeBatchConversion.time($(".addTime, .remarkTime"));
        }
    });

    var PhotoFlowView = Backbone.View.extend({

        el: 'body',

        template: Handlebars.compile(require('../tpl/photo-flow-view.tpl')),   //载入模版文件

        initialize: function() {
            this.photoCollection = new PhotoCollection();
            this.photoCollection.on('sync', this.render, this);
            Observer.on('po-photo:success', this.addPhotoRender, this);
            //Observer.on('login:success', this.render, this);
            Observer.on('init:work', this.initFancy, this);
            Observer.on('refresh:comments', this.requestComments, this);
        },

        events: {

        },

        render: function() {
            var content = this.template({ 'items': this.photoCollection.toJSON() });
            this.$el.append(content);
            this.$el.attr("ontimeupdate", Date.now());
            Observer.trigger('photoLoad:end', (this.photoCollection.toJSON()).length);
        },

        addPhotoRender: function(model) {
            var data = model.toJSON();
            data.keywords = data.keywords.split(/;|；|\s|,|，/);   //关键字处理
            var content = this.template({ 'items': data });
            this.$el.prepend(content);
            this.$el.attr("ontimeupdate", Date.now());
            Observer.trigger('photoLoad:end', (this.photoCollection.toJSON()).length);
        },

        initFancy: function() {
            var self = this;
            $('.fancybox').fancybox({
                margin     : [20,300,20,20],
                mouseWheel : false,
                swf : {FlashVars:"flv=/videos/2013.flv"},
                type       : "image",
                helpers : {
                    title: {
                        type: 'inside'
                    }
                },
                preload:1,
                afterShow:function() {
                    if($("#remarkLayout").size()>0) {
                        $("#remarkLayout").remove();
                    }
                    self.imgId = $(this.element).find('img').attr('imgid');
                    $('.fancybox-image').axzoomer({
                        'maxZoom':4,
                        'zoomIn': false,
                        'zoomOut': false
                    }).css({maxWidth:'1000%'});
                    self.requestComments();
                }
            });
        }
    });

    PhotoFlowView.prototype.requestComments = function() {
        var photoModel = new PhotoModel;
        photoModel.fetch({
            'url': '/photos/' + this.imgId,
            success: function(data) {
                var commentsView = new CommentsView({ el: '.fancybox-overlay', model: data });
                commentsView.render();
            }
        });
    };

    PhotoFlowView.prototype.dispose = function() {
        this.$el.remove();
    };

    module.exports = PhotoFlowView;
});