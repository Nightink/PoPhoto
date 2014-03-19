
/**
 * tools debug show
 * @param  {tj debug module} debug tj debug 模块
 * @return {[type]}       [description]
 */
module.exports = function(debug) {

  var arr = Array.prototype.slice.call(arguments, 1);

  if(!process.env.DEBUG) {

    console.log.apply(console, arr);
  }

  debug.apply(debug, arr);
}