/**
 * User: Nightink
 * Date: 13-4-11
 * Time: 下午9:49
 * 服务器运行
 */

var express = require('express');
var fs      = require('fs');
var path    = require('path');
var hbs     = require('hbs');

var config  = require('./conf/config');
var app     = express();

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

// 加载视图注册模版
require('./lib/registerTemplate');
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
    require('./lib/fileClean');

  });
  console.log("Debug: Express server listening on port %s", app.get('port'));

}

// 随机端口轮询
function randomPort() {

  return Math.floor(Math.random() * 1000) + 7000
}

require('./conf/' + config.db_env + '.js')(app, function(err) {
  if(err) return;

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
      uploadDir: './temp' 
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
    app.use(require('./lib/filter'));

    // 配置路由异常处理 (路由配置和异常处理必须结合使用，同时必须在表单配置后设置，否则导致表单无法正常使用)
    // 必须配置视图模版路径之前，否则请求index时服务器会直接调用静态路径下index.html
    app.use(app.router);
    // app.use(require('./routes')(app));
    // 设置500服务器处理
    app.use(function(err, req, res, next) {
      console.log(err.stack);
      res.send(500, err.message);
    });

    // 设置静态文件路径
    app.use(express.static(path.join(__dirname, 'public')));

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
  app.set('port', config.sys_port || 3000);
  // 设置页面渲染类型*.html
  app.set('view engine', 'html');
  // 设置视图模板路径
  app.set('views', path.join(__dirname, 'views'));
  // 设置视图渲染引擎
  app.engine('html', require('./lib/engineHtml'));

  // 路由调度加载
  require('./routes')(app);
  
  startServer();
});