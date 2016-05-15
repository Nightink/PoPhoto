
'use strict';

const http = require('http');
const debug = require('debug')('po:worker');
const graceful = require('graceful');
const app = require('./app');

app.ready(() => {
  const _app = http.createServer(app.callback());
  // 启动服务器,监听端口
  _app.listen(app.config.port, (err) => {
    if (err) {
      return console.log(err.message);
    }
    debug('po app server start success http://localhost:%s/', app.config.port);
  });

  debug('po app server listening on port %s', app.config.port);

  graceful({
    server: [_app],
    error: function(err, throwErrorCount) {
      if (err.message) {
        err.message += ' (uncaughtException throw ' + throwErrorCount + ' times on pid:' + process.pid + ')';
      }
      console.error('graceful %s', err.stack);
    },
  });
});
