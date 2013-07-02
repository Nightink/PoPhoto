/**
 * User: Nightink
 * Date: 13-4-15
 * Time: 上午10:33
 * SeaJS 开发配置文件
 */

seajs.config({
    preload: [
        'jquery',
        'seajs/plugin-text'
    ],

    base: '/sea-modules/',

    alias: {
        'jquery': 'jquery/1.8.2/jquery-debug',
        'bootstrap': 'bootstrap/2.2.2/js/bootstrap',
        'underscore': 'underscore/1.4.4/underscore-debug',
        'backbone' : 'backbone/1.0.0/backbone-debug',
        'handlebars' : 'handlebars/1.1.1/handlebars-debug',
        'json' : 'json2/1.0.2/json2-debug',
        'transport': 'iframe-transport/1.6.1/iframe-transport',
        'fileupload': 'fileupload/5.2.1/fileupload',
        'uiwidget': 'jquery-ui-widget/1.10.0/jquery.ui.widget',
        'observer' : 'observer/0.0.1/observer',
        "wookmark": 'wookmark/0.5.0/jquery.wookmark',
        "imagesloaded": 'imagesloaded/2.0.1/imagesloaded',
        "axzoomer": 'jquery-axzoomer/1.5.0/jquery-axzoomer-debug',
        'json': 'json/2.0/json2',
        "fancybox": 'jquery-fancybox/2.1.4/jquery-fancybox-debug'
    }
});

seajs.use('/src/main/index-main');