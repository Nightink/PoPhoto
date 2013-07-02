/**
 * User: Nightink
 * Date: 13-4-23
 * Time: 下午4:29
 *
 * Photo主页面调度入口
 */
define(function(require, exports, module) {

    var $ = require('jquery');
    require('bootstrap');
    require("../util/cookie")($);
    require('wookmark')($);
    require('json');
    require('imagesloaded')($);
    require('fancybox')($);
    require('axzoomer')($);
    require('../../css/style.css');

    var _ = require('underscore')
        , AppView = require('../view/app-view');

    var appView = new AppView();
    appView.initFolw();

});