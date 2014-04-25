/**
 * 上传图片工具
 */

define(function (require, exports, modules) {
  var $ = jQuery = require('jquery');
  var _ = require("underscore");
  require('uiwidget')($);
  //require('xdr-transport')($);
  require('transport')($);
  require('fileupload')($);
  var total = 0;
  var addIndex = 0;
  var completeIndex = 0;

  exports.init = function(json){
    var config = {
      dom: null,  //配置上传的父容器
      progressCss: {width: "220", "margin-top": "10"}, //进度条样式
      barCss: {width: "0%", "text-align": "center", "background-color": "#B4F5B4", height:"20", "border-radius": "3", color: "#000000"}, //进度样式
      barProCss: {},  //进度显示百分比样式
      sendContain: $(".sendContain"),   //选中图片后存放已选中图片的容器
      url: "/attachment",    //请求服务端的地址
      sourceUrl: "/attachment/",  //返回数据拼接获取图片的地址
      callback: function(){}     //图片全部上传完毕后的回调函数
    };
    $.extend(config, json || {});
    var html = "<input id='fileupload' type='file' name='file' data-url='" + config.url + "' style='width:180px;' multiple>"
         + "<span class='errmsg' style='color: red'></span>"
         + "<div class='progress progress-success'>"
         + "<div class='bar'></div><span class='barPro'>0%</span>"
         + "</div>";
    $(config.dom).append(html);
    $(".progress").css(config.progressCss);
    $(".bar").css(config.barCss);
    $(".barPro").css(config.barProCss);
    $("#fileupload").fileupload({
      dataType: 'json',
      acceptFileTypes:  /(\.|\/)(gif|jpe?g|png)$/i,
      add: function(e, data){
        $(".errmsg").empty();
        currPro(0);
        var isPhoto = true;
        var allowedFileTypes = ["png", "jpeg", "gif", "jpg", "bmp"];
        for (var i = 0; i < data.originalFiles.length; i++) {
          var fileName = data.originalFiles[i].name;
          var type = fileName.substring(fileName.lastIndexOf(".") + 1);
          if(!_.include(allowedFileTypes, type) && !_.include(allowedFileTypes, type.toLocaleLowerCase())){
            isPhoto = false;
            break;
          }
        }
        if(!isPhoto){
          $(".errmsg").text("只能上传图片");
        } else {
          data.submit();
        }
      }
    });
    $("#fileupload").bind('fileuploaddone', function (e, data) {
      if(config.uploadBack) {
        config.uploadBack(e, data);
      } else {
        if(config.sendContain){
          var result = data.result;
          var url = config.sourceUrl + result.url;
          var url_small = config.sourceUrl + result.url_small;
          var width = result.size.width;
          var height = result.size.height;
          var title = data.files[0].name;
          var html = "<div class='checked_img'>" +
            "<a href='" + url + "' small='" + url_small + "' oriHeight='" + height + "' oriWidth='" + width + "' class='linkImg' target='_blank'>"
            + title + "</a>&nbsp;&nbsp;&nbsp;<a class='del_img' style='cursor: pointer;' title='删除'>x</a></div>";
          config.sendContain.append(html);
        }
      }
      if(completeIndex === total){
        config.callback();
      }
    });
    $("#fileupload").bind('fileuploadprogressall', function (e, data) {
      var progress = Math.round(data.loaded / data.total * 100);
      currPro(progress);
    });
    //图片缓存删除
    $('.del_img').die("click").live("click", function(){
      $(this).parent("div").remove();
    });
    if($.browser.msie && $.browser.version < 8){
      $(".checked_img").css("display", "inline");
    }
    //设置进度条
    function currPro(progress){
      if($(".barPro").text() != progress + "%"){
        $('.bar').css('width', progress + '%');
        $('.barPro').text(progress + '%');
      }
    }
  };
  exports.reset = function(){
    $('.bar').css('width', '0%');
    $('.barPro').text('0%');
  }
});
