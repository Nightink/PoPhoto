
var request = require('supertest');
var app = require('../app');

describe('routers/index.js', function () {

  it('should / 200', function (done) {
    request(app)
    .get('/')
    .end(function (err, res) {
      if(err) {
        return done(err);
      }

      res.status.should.equal(200);
      res.type.should.equal('text/html');
      done();
    });
  });

  it('should /index.html 302', function(done) {

    request(app)
    .get('/index.html')
    .expect(302, done);
  });
});