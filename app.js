#!/usr/bin/env node

/**
 * 服务器运行
 */

var fs        = require('fs');
var path      = require('path');

var express   = require('express');
var commander = require('commander');
var methodOverride = require('method-override');
var logger = require('morgan');
var compression = require('compression');
var directory = require('serve-index');
var favicon = require('serve-favicon');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorhandler = require('errorhandler');
var debug = require('debug')('app');

commander
  .version(require('./package.json').version)
  .option('-d, --debug', '是否开启前端js debug文件输出', true)
  .option('-p, --port [port]', '设置服务器端口', Number, 3000)
  .option('-s, --static [path]', '设置服务器静态文件路径', String)
  .parse(process.argv);

// 捕获所有未处理异常
process.on('uncaughtException', function(err) {

  // 捕获启动端口被占用，异常
  if (err.code === 'EADDRINUSE') {

    debug('Port %d in use', app.get('port'));
    app.set('port', randomPort());
    startServer();

  } else {

    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
  }
});

// 捕获node 进程结束事件
process.on('SIGINT', function() {

  process.exit();
});

var app       = express();
// require 会进行缓存
// 针对require 配置，将会导致配置被重写覆盖
var config    = require('./conf/config.json');

debug('app start run');

var tempPath = path.join(__dirname, 'temp');
// 判断文件夹路径是否存在
var isDir    = fs.existsSync || path.existsSync;

// 判断是否存在缓存目录，没有则创建缓存目录
if(!isDir(tempPath)) {

  fs.mkdirSync(tempPath);
  debug('create image temp dir %s.', tempPath);
}

// 调整系统congfig  静态文件夹路径
config.staticPath = commander.static || config.staticPath || '';

// 缓存文件定期处理
require('./libs/fileClean');
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

    debug('Express app server start success http://localhost:%s/', app.get('port'));
  });

  debug('Express app server listening on port %s', app.get('port'));
}

// 随机端口轮询
function randomPort() {

  return Math.floor(Math.random() * 1000) + 7000;
}

require('./libs/' + config.dbEnv)(app, function(err) {

  if(err) {

    return;
  }

  // start 全环境下配置
  // 配置日志记录
  var stream = fs.createWriteStream(path.join(__dirname, 'info.log'), {

    flags: 'a'
  });
  // app.use 内置中间件队列  依次执行队列的中间件
  app.use(logger({stream: stream}));
  // 添加gzip 输出压缩中间件
  app.use(compression());

  // 配置客户端表单数据提交，必须在app.router之前，否者 res.body 为空
  app.use(methodOverride());

  // 设置文件上传缓存路径
  app.use(multer({
    dest: tempPath
  }));
  // 设置post文件解析
  app.use(require('./middleware/bodyParserHandler')());

  // 配置session，必须在cookie之后，依赖cookie
  app.use(cookieParser());
  app.use(session({ secret: config.sessionSecret }));

  // url为 `*.json` 进行响应头处理
  app.use(require('./middleware/requestJSONHandler'));

  // 设置过滤器
  app.use(require('./middleware/filterRouterHandler'));

  // 配置路由异常处理
  // 路由配置和异常处理必须结合使用，同时必须在表单配置后设置，否则导致表单无法正常使用
  // 必须配置视图模版路径之前，否则请求index时服务器会直接调用静态路径下index.html
  debug('load router');
  // 设置500服务器处理
  if (app.get('env') === 'development') {

    // 开发环境
    app.use(errorhandler({
      dumpExceptions: true,
      showStack: true
    }));

    debug('lode development error handler');
  }

  if (app.get('env') === 'release') {

    // 生产环境
    app.use(require('./middleware/serverErrorHandler'));

    debug('lode release error handler');
  }

  // 路由调度加载
  require('./routers')(app);

  // 支持字典列表形式显示静态文件目录
  app.use(directory(config.staticPath, {
    icons: true,
    hidden: true
  }));
  // 设置静态文件路径
  app.use(express.static(path.join(config.staticPath)));

  // 设置站点图标
  app.use(favicon(path.join(config.staticPath, 'favicon.ico')));

  // 显示请求错误路由
  app.use(require('./middleware/routerErrorHandler'));

  // 隐藏响应头`x-powered-by`备注
  app.disable('x-powered-by');
  // 配置服务器端口
  app.set('port', commander.port);
  // 设置页面渲染类型`*.html`
  app.set('view engine', 'tpl');
  // 设置视图模板路径
  app.set('views', path.join(__dirname, 'views'));
  // 设置视图渲染引擎
  app.engine('tpl', require('./middleware/engineHtmlHandler'));

  // 进行`sea-config.js`配置输出
  require('./libs/fileDebug')(commander.debug);
  // 启动服务器
  startServer();
});

// `exports test app`
module.exports = app;
