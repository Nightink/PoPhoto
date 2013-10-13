/**
 * User: Nightink
 * Date: 13-4-11
 * Time: 下午9:49
 * 服务器运行
 */

var express = require('express')
  , fs = require('fs')
  , path = require('path')
  , hbs = require('hbs')
  , config = require('./config')
  , app = express();

//捕获所有未处理异常
process.on('uncaughtException', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.warn('Debug: Port %d in use', app.get('port'));
    app.set('port', randomPort());
    startServer();
  } else {
    console.log('Sys %s', err.stack);
    //throw e;
  }
});

require('./lib/registerTemplate');        //加载视图注册模版
require('./models');                      //加载实体对象
require('./lib/fileClean');               //缓存文件定期处理

function startServer() {
  app.listen(app.get('port'), function(err) {     //启动服务器,监听端口
    if(err) {
      console.log(err.message);
      return;
    }
    console.log('Debug: Express server start success http://localhost:%s/', app.get('port'));
  });
  console.log("Debug: Express server listening on port %s", app.get('port'));
}

function randomPort() {   //随机端口轮询
  return Math.floor(Math.random() * 1000) + 7000
}

/*
app.on('error', function(e) {
  console.log(e);
  if (e.code === 'EADDRINUSE') {
    console.warn('Port %d in use', app.get('port'));
    app.set('port', randomPort());
    startServer();
  } else {
    throw e;
  }
});
*/

require('./conf/' + config.env + '.js')(app, function(err) {
  if(err) return;

  app.configure(function() {    //全环境下配置
    //配置日志记录
    var stream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
    app.use(express.logger({stream: stream}));    //app.use 内置中间件队列  依次执行队列的中间件

    //配置客户端表单数据提交，必须在app.router之前，否者 res.body 为空
    app.use(express.methodOverride());
    app.use(express.bodyParser({ uploadDir: './temp' })); //设置文件上传缓存路径

    //配置session，必须在cookie之后，依赖cookie
    app.use(express.cookieParser(config.session_secret));
    app.use(express.session());

    app.use(function(req, res, next) {    //url为 *.json 进行响应头处理
      if(req.url.match(/\.json/g)) {
        res.back = {};

      } else {
        res.back = {
          userAgent: req.headers['user-agent']
        }
      }
      next();
    });

    //设置过滤器
    app.use(require('./lib/filter'));

    //配置路由异常处理 (路由配置和异常处理必须结合使用，同时必须在表单配置后设置，否则导致表单无法正常使用)
    //必须配置视图模版路径之前，否则请求index时服务器会直接调用静态路径下index.html
    app.use(app.router);
    //app.use(require('./routes')(app));
    app.use(function(err, req, res, next) { //设置500服务器处理
      console.log(err.stack);
      res.send(500, err.message);
    });

    app.use(express.static(path.join(__dirname, 'public')));  //设置静态文件路径
    app.use(express.favicon('/favicon.ico'));           //设置站点图标

    app.use(function(req, res, next) {      //显示请求错误路由
      console.log('Debug: Error routes %s --> %s', req.method, req.url);
      next();
    });
  });

  app.configure('development', function(){    //开发环境
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
  });

  //配置服务器端口
  app.set('port', config.sys_port || 3000);
  //设置页面渲染类型html
  app.set('view engine', 'html');
  //设置视图模板路径
  app.set('views', path.join(__dirname, 'views'));
  //设置视图渲染引擎
  app.engine('html', require('./lib/engineHtml'));

  //路由调度加载
  require('./routes')(app);
  
  startServer();
});