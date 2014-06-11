#!/usr/bin/env node

/**
 * 服务器运行
 */

var fs = require('fs');
var path = require('path');

var koa = require('koa');
var router = require('koa-router');
var bodyParser = require('koa-bodyparser');
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

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  debug('%s %s - %s', this.method, this.url, ms);
});

app.use(bodyParser());
app.use(router(app));

app.get('/', function *index() {

  this.body = 'hello world';
})

app.listen(program.port);

// `exports test app`
module.exports = app;
