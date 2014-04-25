/**
 * time format
 */
define(function(require, exports, module) {

  module.exports = function(currDate, timeString) {

    var timeFormatString = null;
    var timeMoment = moment(timeString);
    var diffDate = currDate - timeMoment.dayOfYear();

    switch(diffDate) {

      case 0:
        timeFormatString = timeMoment.format('今天 HH:mm:ss');
      break;
      case 1:
        timeFormatString = timeMoment.format('昨天 HH:mm:ss');
      break;
      case 2:
        timeFormatString = timeMoment.format('前天 HH:mm:ss');
      break;
      default:
        timeFormatString = timeMoment.format('YYYY-MM-DD HH:mm:ss');
      break;
    }

    return timeFormatString;
  };

});
