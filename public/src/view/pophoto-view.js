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
        , PhotoModel = require('../model/photo-model')
        , Backbone = require('backbone')
        , fileUpload = require('../util/fileUpload');

    var PoPhotoView = Backbone.View.extend({
        el: '#new-pin',
        template: require('../tpl/pophoto-view.tpl'),   //载入模版文件
        initialize: function() {
            this.photoModel = new PhotoModel;

            observer.on('verify:photo-msg', this.tipMsg, this);
            observer.on('upload:success', this.imgInfo, this);
            this.$el.html(this.template);

            var self = this;

            //初始化上传图片功能
            var fileJson = {
                dom: $('.uploadDiv'),
                url: '/upload',
                barProCss: {
                    left: 290,
                    position: "absolute",
                    "z-index": 111111
                },
                callback: function() {
                    observer.trigger('upload:success');
                }
            };
            fileUpload.init(fileJson);
        },
        events: {
            'focus #description': 'descriptionTips',
            'focus #keywords': 'keywordsTips',
            'blur #description': 'valueSet',
            'blur #keywords': 'valueSet',
            'click #photo-submit': 'poPhoto'
        },

        valueSet: function(e) {
            var $dom = $(e.target)
                , str = $.trim($dom.val())
                , name = $dom.attr('name');

            this[name + 'Set'](str);
        },

        imgInfo: function() {
            var $linkImg =  $('.linkImg');
            var data = {
                url: $linkImg.attr('href'),
                urlSmall: $linkImg.attr('small'),
                width: $linkImg.attr('oriWidth'),
                height: $linkImg.attr('oriHeight'),
                title: $linkImg.html()
            };

            console.log(data);
            this.photoModel.set(data);
        },

        descriptionTips: function(e) {
            $('#description-tips').html('說說圖中事。').attr('class', 'tips');
        },

        keywordsTips: function(e) {
            $('#keywords-tips').html('多个标签用分号/逗号/空格隔开').attr('class', 'tips');
        },

        descriptionSet: function(str) {
            this.photoModel.set({ description: str }, {validate: true});
        },

        keywordsSet: function(str) {
            this.photoModel.set({ keywords: str }, {validate: true});
        },

        tipMsg: function(data) {                //验证信息DOM显示
            if(data.flag) {
                this.$('#' + data.tagName + '-tips').html(data.tipStr).addClass('self-ok');
            } else {
                this.$('#' + data.tagName + '-tips').html(data.tipStr).addClass('self-error');
            }
        },

        poPhoto: function(e) {
            console.log(this.photoModel);
            var self = this;
            self.photoModel.save(null, {

                url: '/po-photo',
                success: function(model, doc) {     //success事件监听回调函数

                    self.$el.modal('hide');
                    self.photoModel = new PhotoModel;
                    observer.trigger('po-photo:success', new PhotoModel(doc));
                },
                error: function(model, str) {

                    alert(str);
                }
            });
        },

        render: function() {
            this.$el.modal();
        },

        dispose: function() {
            this.$el.remove();
        }
    });

    module.exports = PoPhotoView;
});