#!/usr/bin/env node

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
var program = require('commander');
var debug = require('debug')('app');

program
  .version(require('./package.json').version)
  .option('-d, --debug', '是否开启前端js debug文件输出', true)
  .option('-p, --port [port]', '设置服务器端口', Number, 3000)
  .option('-s, --static [path]', '设置服务器静态文件路径', String)
  .parse(process.argv);

// 捕获所有未处理异常
process.on('uncaughtException', function(err) {

  console.log(err.message);
  console.log(err.stack);
  process.exit(1);
});

// 捕获node 进程结束事件
process.on('SIGINT', function() {

  process.exit();
});

debug('init')
var app = koa();
var conf = require('./conf/config.json');

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  debug('%s %s - %s', this.method, this.url, ms);
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
  app.listen(program.port);
})

// `exports test app`
module.exports = app;
