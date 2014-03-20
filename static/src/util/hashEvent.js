/**
 * 哈希事件抽取
 */

//统一哈希执行函数
define(function (require, exports, modules) {
    var $ = jQuery = require('jquery');
    exports.init = function(callback){
        //监听哈希事件
        $(window).on('hashchange', function(){
            hashResolve(callback)
        });
    };
    var hashResolve = exports.hashResolve = function(callback){
        var hash = location.hash;
        var params = hash.replace('#!', '');
        var args = [];
        while(true){
            var index = params.indexOf('&');
            var arg;
            if(index === -1){
                var equalPos =  params.indexOf('=');
                if(equalPos === -1) break;
                arg = params.substring(0);
                args.push(arg);
                break;
            } else {
                arg = params.substring(0, index);
                if(arg == '') break;
                args.push(arg);
                params = params.substring(index + 1);
            }
        }
        callback(args);
    }
});
