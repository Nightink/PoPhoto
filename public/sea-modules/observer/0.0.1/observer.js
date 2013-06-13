define(function(require, exports, modules) {
  var _ = require('underscore')
      , Backbone = require('backbone')
      , object = exports;
  _.extend(object, Backbone.Events);

  var eventSplitter = /\s+/;

  var stack = {};

  //注册所有的事件，保留每个事件的最后状态
  object.on('all', function(event){
    
    var rest = Array.prototype.slice.call(arguments, 1);
    stack[event] = rest;
  
  }, object);

  //订阅事件的最后状态
  object.past = function(eventStr, callback, context) {
      
    if (!callback) return this;
    var event, rest
      , events = eventStr.split(eventSplitter);
    
    while (event = events.shift()) {

    	if (rest = stack[event]) {
        callback.apply(context || this, rest);
    	}

    }

    this.on( eventStr, callback, context );
  }

  //清空每个事件的最后状态
  object.clear = function(){

    stack = {};

  }

});
