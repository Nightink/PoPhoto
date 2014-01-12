/**
 * 主控视图
 */

define(function (require, exports, module) {

  var $ = require('jquery')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , observer = require('observer')
    , PhotoFlowView = require('../view/photo-flow-view')
    , TopView = require('../view/top-view');

  require('../../css/style.css');
  require('wookmark');

  var AppView = Backbone.View.extend({
    el: 'body',

    initialize: function() {
      observer.on('photoLoad:end', this.initFolw, this);
      this.loadFlow();
      this.topView = new TopView;
      this.photoFlowView = new PhotoFlowView({ el: '#photo-flow' });
      this.currentPhoto = this.limit = 15;
      this.isLoading = true;
    },

    render: function() {
      //this.topView.render();
      this.photoFlowView.render();
    },

    initFolw: function(len) {    //初始化瀑布流
      _.each($(".imageDom"), function(dom, k){
        var oriHeight = $(dom).attr("oriHeight");
        var oriWidth = $(dom).attr("oriWidth");
        var currHeight = oriHeight / oriWidth * 200;
        $(dom).height(currHeight);
        $(dom).attr("src", $(dom).attr("srcTemp"));
        var playerDom = $(dom).parent("a").next(".video_img");
        if(playerDom.size() !== 0){
          var playerHeight = (currHeight + 32) / 2;
          playerDom.css({"top": -playerHeight, "display": "block"});
          $(dom).parents(".imgContain").height(currHeight);
        }
      });
      var windowWidth = $(window).width();
      var itemWidth = 242;
      if(windowWidth <= 530) {
        itemWidth = 200;
      }

      var options = {
        autoResize: true,
        offset: 10,
        itemWidth: itemWidth,
        container: $(".photo-main")
      };

      this.photoFlowView.$el.find('.pin').wookmark(options);

      if((len == 0) && (len < this.limit) ) {
        this.isLoading = false;
      }

      $("#loader").hide();
      this.loadFlow();
      observer.trigger('init:work');
    },

    loadFlow: function() {
      var self = this;
      $(window).bind('scroll.flow', function(){
        var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 300);
        if(self.isLoading && closeToBottom) {
          //self.isLoading = true;
          var $loader = $('#loader'), isScrollSearch = false; //需要进一步修改
          if($(".pin").size() !== 0){   //loader显示判断
            var lastImage = $(".pin").last();
            var lastTop = lastImage.offset().top;
            var lastHeight = lastImage.height();
            $loader.css("top", lastTop + lastHeight);
          } else {
            $loader.css("top", 70);
          }
          $loader.show();
          var formData = {/*keywords: keywords, */skip: self.currentPhoto, limit: self.limit, time: $("#photo-flow").attr("ontimeupdate")};
          if(isScrollSearch){
            formData.q = $(".search-query").val();
          }
          self.currentPhoto += self.limit;

          self.photoFlowView.photoCollection.fetch({
            url: '/photo',
            data: formData
          });
        }
      });
    },

    dispose: function() {
      this.$el.remove();
    }
  });

  module.exports = AppView;
});
