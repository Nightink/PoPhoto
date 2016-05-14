/**!
 * koa/view
 */
'use strict';

const nunjucks = require('nunjucks');

class NunjucksView {
  constructor(app) {
    app.viewEngine = new nunjucks.Environment(new nunjucks.FileSystemLoader(`${__dirname}/../app/view`));
    this.app = app;
  }

  render(name, locals) {
    return new Promise((resolve, reject) => {
      this.app.viewEngine.render(name, locals, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = NunjucksView;
