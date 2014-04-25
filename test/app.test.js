
var fs = require('fs');
var path = require('path');

var app = require('express')();

describe('app', function() {
  describe('.engine(\'html\', fn) middleware/engineHtmlHandler', function() {

    var tplPath = path.join(__dirname, '../views/test.html');

    before(function() {

      fs.writeFileSync(tplPath,
        '<p>repo name is {{repo.name}}</p> <p>repo url is {{repo.url}}</p>');
    });

    after(function() {

      fs.unlink(tplPath);
    });

    it('should map a hbs template engine test ok', function(done) {

      app.set('view engine', 'html');
      app.set('views', path.join(__dirname, '../views'));
      app.engine('html',
        require(path.join(__dirname, '../middleware/engineHtmlHandler')));

      app.locals.repo = {
        name: 'node-Pophoto',
        url: 'https://github.com/Nightink/node-Pophoto'
      };

      var _str = '<p>repo name is node-Pophoto</p> '
        + '<p>repo url is https://github.com/Nightink/node-Pophoto</p>';

      app.render('test.html', function(err, str) {

        if(err) {
          return done(err);
        }

        str.should.equal(_str);
        done();
      });

    });

  });
});
