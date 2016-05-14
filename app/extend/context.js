/**!
 * 扩展 koa/context 对象
 */
'use strict';

/**
 * Module dependencies.
 */

const fileParse = require('co-busboy');

module.exports = {
  multipart() {
    if (!this.is('multipart')) {
      this.throw(400, 'Content-Type must be multipart/*');
    }

    return fileParse(this, this.app.config.multipart);
  },

  * getFileStream() {
    const parts = this.multipart({ autoFields: true });
    const stream = yield parts;
    // 文件不存在，当做错误请求处理
    if (!stream || !stream.filename) {
      this.throw(400, 'Can\'t found upload file');
    }
    stream.fields = parts.field;
    return stream;
  },

  * render(name, locals) {
    this.body = yield this.renderString(name, locals);
  },

  renderString(name, locals) {
    return new Promise((resolve, reject) => {
      this.app.viewEngine.render(name, locals, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  },
};
