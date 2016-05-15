/**!
 * 服务器运行
 */

'use strict';

const debug = require('debug')('po');
const koa = require('koa');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const serveIndex = require('koa-serve-index');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router');
const Roles = require('koa-roles');
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
// 读取环境变量
app.env = app.config.env;

debug('app start run');

const role = app.role = new Roles(app.config.userrole);

app.use(role.middleware());
app.use(bodyParser());

app.keys = app.config.session.key;
app.use(session(app));

app.use(router(app));

// 设置站点图标
app.use(favicon(`${config.staticPath}/favicon.ico`));
app.use(serve(config.staticPath));
// 支持字典列表形式显示静态文件目录
app.use(serveIndex(config.staticPath));

app.viewEngine = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(`${__dirname}/app/view`),
  { noCache: app.env !== 'production' }
);

// 进行`sea-config.js`配置输出
require('./lib/seajs_debug')(config.debug);

require('./lib/mongo_connect')(app);

// 加载实体对象
require('./app/model')(app);
// 加载权限
require('./config/role')(app);

app.ready(() => {
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
});

// `exports test app`
module.exports = app;
