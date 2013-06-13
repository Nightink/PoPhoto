/**
 * Created with JetBrains WebStorm.
 * User: ysj
 * Date: 12-9-12
 * Time: 下午3:22
 */
define(function (require, exports, modules) {
    var $ = jQuery = require('jquery'),
        _ = require('underscore'),
        timeFormat = require('./timeFormat');
    require("./iso8601TimeTransfor");
    exports.time = function(jquery, format){
        _.each(jquery, function(obj){
            if($(obj).text() == ""){
                return;
            } else {
                if(timeFormat == null)
                {
                    timeFormat = require('./timeFormat');
                }
                var timeText = $(obj).text();
                var timeTextLast = timeText.slice(-1);
                if($.browser.msie && $.browser.version <9){
                    if (timeTextLast === 'Z') {
                        var timeTranform = new Date();
                        timeTranform.setISO8601(timeText);
                        timeText = timeTranform;
                    }
                }
                var correctTime = timeFormat.timeConfirm(timeText, format);
                if(correctTime){
                    $(obj).text(correctTime);
                }
            }
        });
        jquery.css("display","inline");
    }
});
