/**
 * 服务器运行
 */

var fs = require('fs');
var path = require('path');

var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var views = require('co-views');
var debug = require('debug')('app:init');

// `exports test app`
module.exports = function(program) {

  var app = koa();
  var conf = require('./conf/config.json');

  app.use(function *(next){

    var start = Date.now();

    try {
      yield next;
    } catch(err) {
      // 用于处理异常处理机制
      console.log(err.stack);
      this.status = 500;
      this.body = 'server error';
    }

    var ms = Date.now() - start;

    debug('%s %s - %sms', this.method, this.url, ms);
  });

  app.render = views('views', {
    ext: 'tpl',
    map: { tpl: 'handlebars' }
  });

  app.keys = [conf.sessionSecret];
  app.use(bodyParser());
  app.use(session());
  app.use(router(app));
  app.use(serve(conf.staticPath));

  require('./libs/mongoConnect')(function(err) {

    if(err) {
      return console.log(err);
    }

    require('./libs/fileDebug')(program.debug);
    require('./libs/registerTemplate');
    require('./models');
    require('./routers')(app);
    app.listen(program.port, function() {

      debug('app url http://127.0.0.1:%s', program.port);
    });
  });

  return app;
};
