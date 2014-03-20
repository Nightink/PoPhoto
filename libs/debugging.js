
// tools debug show
// *tj debug module* `debug` tj debug 模块
module.exports = function(debug, str) {

  var arr = Array.prototype.slice.call(arguments, 1);

  // console.log((new Error).stack.split('\n')[2]);

  if(!process.env.DEBUG) {

    console.log.apply(console, arr);
  }

  debug.apply(debug, arr);
}