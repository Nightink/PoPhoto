/**
 * User: Nightink
 * Date: 13-4-23
 * Time: 下午4:29
 *
 * Photo主页面调度入口
 */

seajs.use(['jquery', './src/view/app-view', 'json', 'imagesloaded'], 
  function($, AppView) {

    var appView = new AppView();
    appView.initFolw();

    (function() {       //“返回顶部”标签函数
      var $backToTopEle = $('.backToTop');

      $backToTopEle.click(function(e) {
        $('html,body').animate({ scrollTop: 0 }, 120);
      });

      $(window).bind("scroll", function() {
        var st = $(document).scrollTop()
          , winh = $(window).height();

        (st > 0) ? $backToTopEle.show(): $backToTopEle.hide();
        //IE6下的定位
        if (!window.XMLHttpRequest) {
          $backToTopEle.css("top", st + winh - 166);
        }
      });
    })();

  });