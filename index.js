#!/usr/bin/env node

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

var program = require('commander');
var debug = require('debug')('app:start');

program
  .version(require('./package.json').version)
  .option('-d, --debug', '是否开启前端js debug文件输出', true)
  .option('-p, --port [port]', '设置服务器端口', Number, 3000)
  .option('-s, --static [path]', '设置服务器静态文件路径', String)
  .parse(process.argv);

var app = require('./app')(program);