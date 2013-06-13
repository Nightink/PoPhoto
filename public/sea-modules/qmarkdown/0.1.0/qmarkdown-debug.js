define("#qmarkdown/0.1.0/qmarkdown-debug", [ "#/marked/0.2.6/marked-debug", "#/prettify/1.0.0/prettify-debug" ], function(require, exports, module) {
    module.exports = function($) {
        var marked = require("#/marked/0.2.6/marked-debug");
        var prettify = require("#/prettify/1.0.0/prettify-debug");
        marked.setOptions({
            gfm: true,
            pedantic: false,
            sanitize: true,
            highlight: null
        });
        $.fn.markdown = function() {
            this.each(function() {
                var $el = $(this);
                $el.html(marked($el.html()));
                $el.find("code").addClass("prettyprint");
            });
            prettify.prettyPrint();
        };
    };
});