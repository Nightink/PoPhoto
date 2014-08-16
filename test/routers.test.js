
var request = require('supertest');
var app = require('../app');

describe('routers/index.js', function () {

  it('should 200 when use page /', function (done) {
    request(app)
    .get('/')
    .expect(200, function (err, res) {
      if(err) {
        return done(err);
      }

      res.type.should.equal('text/html');
      res.text.should.containEql('返回顶部');
      done();
    });
  });

  it('should 200 when use page /index.html', function(done) {

    request(app)
    .get('/index.html')
    .expect(200, done);
  });
});
