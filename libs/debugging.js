
// tools debug show
// *tj debug module* `debug` tj debug 模块
module.exports = function(debug, str) {

  var arr = Array.prototype.slice.call(arguments, 1);

  if(!process.env.DEBUG && process.env.NODE_ENV !== 'test') {

    console.log.apply(console, arr);
  }

  debug.apply(debug, arr);
}
