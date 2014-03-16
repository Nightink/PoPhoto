
var app = require('express')();
var fs = require('fs');
var path = require('path');

var tplPath = path.join(__dirname, '../views/test.html');

require('should');

describe('app', function() {
  describe('.engine(\'html\', fn) libs/engineHtml', function() {

    before(function() {

      fs.writeFileSync(tplPath, '{{user.name}}');
    });

    it('should map a hbs template engine test ok', function(done) {

      app.set('view engine', 'html');
      app.set('views', path.join(__dirname, '../views'));
      app.engine('html', require(path.join(__dirname, '../libs/engineHtml')));
      app.locals.user = { name: 'chc' };

      app.render('test.html', function(err, str) {

        if(err) return done(err);

        str.should.equal('chc');
        done();
      });
    });

    after(function() {

      fs.unlink(tplPath);
    });
  })
})
