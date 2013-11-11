define(function(require, exports, modules) {

    var object = exports;
    var stack = {};
    var _events = {};
    var console = window.console || function() {};

    modules.exports = {
        on: function(eventName, callback, context) {

            var _event = _events[eventName] || (_events[eventName] = []);

            _event.push({
                callback: callback,
                context: context,
                ctx: context || this,
                stackPath: debugTriggerObserver()
            });
            return this;
        },

        off: function(eventName, callback, context) {

            if (!eventName) {
                return this;
            };

            if (!callback && !context) {

                try {
                    delete _events[eventName];
                } catch(e) {}
            };

            var _event = _events[eventName] || [], resetEvent = [];

            for (var i = _event.length - 1; i >= 0; i--) {

                if(callback !== _event.callback) {

                    resetEvent.push[_event];
                }
            };

            _event = resetEvent;
            return this;
        },

        // 先执行事件上次触发
        past: function(eventName, callback, context) {

            var args = stack[eventName];
            if (callback) {
                callback.apply(context, args);
            }

            return this.on(eventName, callback, context);
        },

        trigger: function(eventName) {

            var _event = _events[eventName] || [];
            var args = Array.prototype.slice.call(arguments, 1);
            stack[eventName] = args;

            console.log('%s 事件触发于: %s', eventName, debugTriggerObserver());
            for (var i = _event.length - 1; i >= 0; i--) {

                var obj = _event[i];
                var triggerPath = obj.stackPath;
                console.log('%s 事件订阅于: %s', eventName, triggerPath);

                obj.callback.apply(obj.context || obj.ctx, args);
            };

            return this;
        },

        clear: function () {

        }
    };

    // 获取函数的堆栈信息
    function debugTriggerObserver() {

        var e = new Error();
        var errorStack = e.stack;
        return errorStack.split('\n')[3];
    }

});
