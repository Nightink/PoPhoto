/**!
 * 服务器运行
 */

'use strict';

const debug = require('debug')('pophoto');
const koa = require('koa');
const serve = require('koa-static');
const serveIndex = require('koa-serve-index');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router');
const loading = require('loading');
const nunjucks = require('nunjucks');
const ready = require('ready-callback')();

const app = koa();
ready.mixin(app);
// require 会进行缓存
// 针对require 配置，将会导致配置被重写覆盖
const config = app.config = require('./config/config.js');
// 调整系统congfig  静态文件夹路径
config.staticPath = config.staticPath || '';

debug('app start run');

app.use(bodyParser());

app.keys = app.config.sessionKey;
app.use(session(app));

app.use(router(app));

app.use(serve(config.staticPath));
// 支持字典列表形式显示静态文件目录
app.use(serveIndex(config.staticPath));

app.viewEngine = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(`${__dirname}/app/view`),
  {
    noCache: app.env !== 'production',
  }
);

// 进行`sea-config.js`配置输出
require('./lib/seajs_debug')(config.debug);

require('./lib/mongo_connect')(app);

app.ready(() => {
  // 加载实体对象
  require('./app/model');
  // 载入项目目录结构
  loading(`${__dirname}/app/controller`).into(app, 'controller');
  loading(`${__dirname}/app/service`).into(app, 'service');
  loading(`${__dirname}/app/extend/context`).into(app, 'extContext');
  const extContext = require('./app/extend/context');

  const names = Object.getOwnPropertyNames(extContext);
  for (let name of names) {
    const descriptor = Object.getOwnPropertyDescriptor(extContext, name);
    Object.defineProperty(app.context, name, descriptor);
  }

  // 路由调度加载
  require('./app/router')(app);

  // 设置过滤器
  // app.use(require('./middleware/filterRouterHandler'));

  // 设置站点图标
  // app.use(express.favicon(path.join(config.staticPath, 'favicon.ico')));

  // 启动服务器,监听端口
  app.listen(app.config.port, (err) => {
    if (err) {
      return console.log(err.message);
    }
    debug('po app server start success http://localhost:%s/', app.config.port);
  });

  debug('po app server listening on port %s', app.config.port);
});

// `exports test app`
module.exports = app;
