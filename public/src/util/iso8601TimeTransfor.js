/*
 * Created by JetBrains WebStorm.
 * User: syh
 * Date: 12-10-23
 * Time: 下午4:24
 * 时间格式转换文件：将iso8601格式的时间转化为UTC时间
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, modules) {
    var $ = jQuery = require('jquery');
    //用户头像自适应
    //dom为img的容器，img为图片的容器
     Date.prototype.setISO8601 = function (string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
            "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
            "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        if (string) {
            var d = string.match(new RegExp(regexp));
            var offset = 0;
            var date = new Date(d[1], 0, 1);

            if (d[3]) {
                date.setMonth(d[3] - 1);
            }
            if (d[5]) {
                date.setDate(d[5]);
            }
            if (d[7]) {
                date.setHours(d[7]);
            }
            if (d[8]) {
                date.setMinutes(d[8]);
            }
            if (d[10]) {
                date.setSeconds(d[10]);
            }
            if (d[12]) {
                date.setMilliseconds(Number("0." + d[12]) * 1000);
            }
            if (d[14]) {
                offset = (Number(d[16]) * 60) + Number(d[17]);
                offset *= ((d[15] == '-') ? 1 : -1);
            }
            offset -= date.getTimezoneOffset();
            time = (Number(date) + (offset * 60 * 1000));
            this.setTime(Number(time));
        }
        else {
            return;
        }
    };
    return Date.prototype;
});