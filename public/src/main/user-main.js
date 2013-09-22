/**
 * User: Nightink
 * Date: 13-4-23
 * Time: 下午4:29
 *
 * User用户管理页面主控
 */
define(function(require, exports, module) {

    var $ = require('jquery')
        , _ = require('underscore')
      , backbone = require('backbone');

    require('bootstrap');
    require("../util/cookie");
    require('../../css/style.css');

    var UserPhotoView = require('../view/user-photos')
        , TopView = require('../view/top-view')
        , UserInfoView = require('../view/user-info-view');

    var userPhotoView = new UserPhotoView({ el: '#photo-list' });
    var topView = new TopView;

    var $lis = $('#nav-con-list li');
    $lis.die('click').on('click', function(e) {
        _.each($lis, function(dom) {
            $(dom).removeClass('active');
        });
        $(this).addClass('active');

    });

    var UserRouter = backbone.Router.extend({
      routes: {
        'user': 'userHash',
        'photos': 'photosHash'
      },
      
      userHash: function() {
        $.get('/user', function(data) {
          var userInfoView = new UserInfoView({ el: '#photo-list', model: data });
          userInfoView.render();
        }, 'json');
      },

      photosHash: function() {
        var userPhotoView = new UserPhotoView({ el: '#photo-list' });
      }
    });

    var router = new UserRouter();
    backbone.history.start();
});