/**
 * 图片流视图
 */

define(function (require, exports, module) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var observer = require('observer');
  var handlebars = require('handlebars');
  var moment = require('moment');
  var PhotoCollection = require('../model/photo-collection');
  var PhotoModel = require('../model/photo-model');
  var fileUpload = require('../util/fileUpload');
  var timeFormat = require('../util/time-format');

  require('fancybox');
  require('axzoomer');

  var CommentsView = Backbone.View.extend({
    el: 'body',

    template: handlebars.compile(require('../tpl/comments-view.tpl')),

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
      var model = this.model;
      model.get('reviews').push({ content: content });
      model.save(null, {
        url: '/photo',
        success: function(model, str) {
          alert(str);
        }
      });
    },

    refreshComments: function(e) {
      observer.trigger('refresh:comments');
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

      var currDate = moment().dayOfYear();

      data.created = timeFormat(currDate, data.created);

      _.each(data.reviews, function(review) {

        review.created = timeFormat(currDate, review.created);
      });

      var contents = this.template(data);

      this.$el.append(contents);

      var windowHeight = $(window).height();
      var remarkLayout = windowHeight - 60;
      var $remarkLayout = this.$el.find('#remarkLayout');

      $remarkLayout.css('height', remarkLayout+'px');

      $remarkLayout.css({ 'top': '20px', 'right': '20px' });
    }
  });

  var PhotoFlowView = Backbone.View.extend({

    el: 'body',

    template: handlebars.compile(require('../tpl/photo-flow-view.tpl')),   //载入模版文件

    initialize: function() {

      this.photoCollection = new PhotoCollection();
      this.photoCollection.on('sync', this.render, this);

      observer.on('po-photo:success', this.addPhotoRender, this);
      //observer.on('login:success', this.render, this);
      observer.on('init:work', this.initFancy, this);
      observer.on('refresh:comments', this.requestComments, this);
    },

    events: {

    },

    render: function() {
      var content = this.template({ 'items': this.photoCollection.toJSON() });
      this.$el.append(content);
      this.$el.attr('ontimeupdate', Date.now());
      observer.trigger('photoLoad:end', (this.photoCollection.toJSON()).length);
    },

    addPhotoRender: function(model) {

      var data = model.toJSON();
      var content = this.template({ 'items': data });
      this.$el.prepend(content);
      this.$el.attr('ontimeupdate', Date.now());
      observer.trigger('photoLoad:end', (this.photoCollection.toJSON()).length);
    },

    initFancy: function() {
      var self = this;
      $('.fancybox').fancybox({
        margin     : [20,300,20,20],
        mouseWheel : false,
        swf : {FlashVars:'flv=/videos/2013.flv'},
        type       : 'image',
        helpers : {
          title: {
            type: 'inside'
          }
        },
        preload:1,
        afterShow:function() {
          if($('#remarkLayout').size()>0) {
            $('#remarkLayout').remove();
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
    },

    requestComments: function() {

      var photoModel = new PhotoModel();
      photoModel.fetch({
        'url': '/photo/' + this.imgId,
        success: function(data) {
          var commentsView = new CommentsView({ el: '.fancybox-overlay', model: data });
          commentsView.render();
        }
      });
    },

    dispose: function() {

      this.$el.remove();
    }
  });

  module.exports = PhotoFlowView;
});
