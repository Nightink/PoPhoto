#!/usr/bin/env node

/**
 * 服务器运行
 */

// 捕获所有未处理异常
process.on('uncaughtException', function(err) {

  if (err.code === 'EADDRINUSE') {

    console.warn('Port %d in use', app.get('port'));
    app.set('port', randomPort());
    startServer();

  } else {

    console.log('Sys %s', err.stack);
  }
});

var fs      = require('fs');
var path    = require('path');

var hbs     = require('hbs');
var express = require('express');
var program = require('commander');

var app     = express();
var config  = require('./conf/config');

program
  .version(require('./package.json').version)
  .option('-d, --debug', '是否开启前端js debug文件输出', Boolean, false)
  .option('-p, --port [port]', '设置服务器端口', Number, 3001)
  .parse(process.argv);


var tempPath = path.join(__dirname, 'temp');

// 判断是否存在缓存目录，没有则创建缓存目录
if(!fs.existsSync(tempPath)) {

  fs.mkdirSync(tempPath);
  console.log('Debug: create image temp dir %s.', tempPath);
}

// 加载视图注册模版
require('./libs/registerTemplate');
// 加载实体对象
require('./models');

function startServer() {

  // 启动服务器,监听端口
  app.listen(app.get('port'), function(err) {

    if(err) {
      console.log(err.message);
      return;
    }
    console.log('Debug: Express server start success http://localhost:%s/', app.get('port'));

    // 缓存文件定期处理
    require('./libs/fileClean');

  });
  console.log("Debug: Express server listening on port %s", app.get('port'));

}

// 随机端口轮询
function randomPort() {

  return Math.floor(Math.random() * 1000) + 7000
}

require('./conf/' + config.db_env + '.js')(app, function(err) {

  if(err) {

    return;
  }

  // 全环境下配置
  app.configure(function() {
    // 配置日志记录
    var stream = fs.createWriteStream(path.join(__dirname, 'info.log'), {flags: 'a'});
    // app.use 内置中间件队列  依次执行队列的中间件
    app.use(express.logger({stream: stream}));

    // 配置客户端表单数据提交，必须在app.router之前，否者 res.body 为空
    app.use(express.methodOverride());
    // 设置文件上传缓存路径
    app.use(express.bodyParser({
      uploadDir: tempPath
    }));

    // 配置session，必须在cookie之后，依赖cookie
    app.use(express.cookieParser(config.session_secret));
    app.use(express.session());

    // url为 *.json 进行响应头处理
    app.use(function(req, res, next) {

      if(req.url.match(/\.json/g)) {
        res.back = {};

      } else {
        res.back = {
          userAgent: req.headers['user-agent']
        }
      }
      next();
    });

    // 设置过滤器
    app.use(require('./libs/filter'));

    // 配置路由异常处理 (路由配置和异常处理必须结合使用，同时必须在表单配置后设置，否则导致表单无法正常使用)
    // 必须配置视图模版路径之前，否则请求index时服务器会直接调用静态路径下index.html
    app.use(app.router);
    // app.use(require('./routes')(app));
    // 设置500服务器处理
    app.use(function(err, req, res, next) {
      console.log(err.stack);
      res.send(500, err.message);
    });

    // 設置前端開發是否開啟debug模式
    app.use('/sea-modules/sea-config.js', require('./libs/fileDebug')(program.debug));
    // 设置静态文件路径
    app.use(express.static(path.join(__dirname, 'static')));

    // 设置站点图标
    // app.use(express.favicon(path.join(__dirname, 'public/favicon.jpg')));

    // 显示请求错误路由
    app.use(function(req, res, next) {

      console.log('Debug: Error routes %s --> %s', req.method, req.url);
      next();
    });
  });

  // 开发环境
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
  });

  // 配置服务器端口
  app.set('port', program.port);
  // 设置页面渲染类型*.html
  app.set('view engine', 'html');
  // 设置视图模板路径
  app.set('views', path.join(__dirname, 'views'));
  // 设置视图渲染引擎
  app.engine('html', require('./libs/engineHtml'));

  // 路由调度加载
  require('./routers')(app);

  startServer();
});
