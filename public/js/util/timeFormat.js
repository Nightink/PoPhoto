/*
 *  该模块用于判断时间与当前时间的相差值
 */
define(function (require, exports, modules) {
    exports.timeConfirm = function(time, format){
        var date = new Date(time);
        if(isNaN(date)){
            return false;
        }
        var currentTime = new Date();
        var year = date.getFullYear() ;
        var cMonth = parseInt(date.getMonth()) + 1;
        var month = cMonth >= 10 ? cMonth : "0" + cMonth;
        var dates = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        var hours = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
        var minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();

        var currentYear = currentTime.getFullYear();
        var cCurrentMonth = parseInt(currentTime.getMonth()) + 1;
        var currentMonth = cCurrentMonth >= 10 ? cCurrentMonth : "0" + cCurrentMonth;
        var currentDates = currentTime.getDate() >= 10 ? currentTime.getDate() : "0" + currentTime.getDate();
//        var currentHours = currentTime.getHours() >= 10 ? currentTime.getHours() : "0" + currentTime.getHours();
//        var currentMinutes = currentTime.getMinutes() >= 10 ? currentTime.getMinutes() : "0" + currentTime.getMinutes();
        if(format){
            return timeFormat(date);
        }
        if(currentYear != year){
            return timeFormat(date);
        } else {
            //当前月不等于数据月的情况
            if(currentMonth != month) {
                //当前月比数据月大超过1个月则直接返回数据
                if(currentMonth - month > 1){
                    return timeFormat(date);
                }
                //当前月比数据月大一个月则判断当前月的日期是否在月初
                else if (currentMonth - month == 1){
                    //若大于3号，则说明超过3天，直接返回数据
                    if(currentDates > 3){
                        return timeFormat(date);
                    } else {
                        if(month == "01" || month == "03" || month == "05" ||  month == "07" || month == "08" || month == "10" || month == "12"){
                            return calculateDates(dates, currentDates, 28, date);
                        }
                        else if (month == "02"){
                            //如果为闰年则2月以29天计算
                            if((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400== 0)){
                                return calculateDates(dates, currentDates, 26, date);
                            } else {
                                return calculateDates(dates, currentDates, 25, date);
                            }
                        }
                        //为1个月30天的情况
                        else {
                            return calculateDates(dates, currentDates, 27, date);
                        }
                    }
                }
            } else { //同一个月的情况
                //不同日的情况
                if(dates != currentDates){
                    return calculateDates(dates, currentDates, -3,date);
                } else {
//                    //不同小时的情况
//                    if(hours != currentHours && currentHours > hours){
//                        return currentHours - hours + "小时前";
//                    } else {
//                        if(currentMinutes > minutes){
//                            return currentMinutes - minutes + "分钟前";
//                        }
//                        else if (currentMinutes == minutes){
//                            return "刚刚";
//                        }
//                    }
                    return "今天 " + hours + ":" + minutes;
                }
            }
            return timeFormat(date);
        }
        //天数判断
        function calculateDates(dates, currentDates, index, Date){
            if((dates -  currentDates) < index){
                return timeFormat(date);
            }
            else if(dates -  currentDates == index){
                return "3天前 " + hours + ":" + minutes;
            }
            else if(dates -  currentDates == index + 1){
                return "前天 " + hours + ":" + minutes;
            }
            else if(dates -  currentDates == index + 2){
                return "昨天 " + hours + ":" + minutes;
            }
            return timeFormat(Date);
        }
    };
    //规范时间格式
    function timeFormat(time){
        var year = time.getFullYear();
        var currentMonth = parseInt(time.getMonth()) + 1;
        var month = currentMonth >= 10 ? currentMonth : "0" + currentMonth;
        var dates = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
        var hours = time.getHours() >= 10 ? time.getHours() : "0" + time.getHours();
        var minutes = time.getMinutes() >= 10 ? time.getMinutes() : "0" + time.getMinutes();
        return year + "-" + month + "-" + dates + " " + hours + ":" + minutes;
    }
    exports.timeFormat = function(time){
        return timeFormat(time);
    };
});