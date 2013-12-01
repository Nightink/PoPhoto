define(function(require, exports, modules) {

    var object = exports;
    var stack = {};
    var _events = {};
    var eventCount = {};
    var console = window.console || function() {};

    modules.exports = {

        on: function(eventName, callback, context) {

            var _event = _events[eventName] || (_events[eventName] = []);

            _event.push({
                callback: callback,
                context: context || this,
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

            var _event = _events[eventName] || [];
            var resetEvent = [];

            for (var i = _event.length - 1; i >= 0; i--) {

                if((callback !== _event.callback) || (context !== _event.context)) {

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
            eventCount[eventName] = 1 + (eventCount[eventName] || 0);

            console.log('observer事件触发统计列表: ', eventCount);
            console.log('%s 事件触发于: %s', eventName, debugTriggerObserver());
            for (var i = _event.length - 1; i >= 0; i--) {

                var obj = _event[i];
                var triggerPath = obj.stackPath;
                console.log('%s 事件订阅于: %s', eventName, triggerPath);

                obj.callback.apply(obj.context, args);
            };

            return this;
        },

        // 清除trigger function最后一次状态量
        clear: function () {

            stack = {};
        }
    };

    // 获取函数的堆栈信息
    function debugTriggerObserver() {

        var e = new Error();
        var errorStack = e.stack;
        return errorStack.split('\n')[3];
    }

});
