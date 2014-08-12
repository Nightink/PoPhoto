
var request = require('supertest');
var app = require('../../app');

describe('controllers/photo.js', function () {

  it('should /photo 200', function (done) {
    request(app)
    .get('/photo')
    .end(function (err, res) {
      if(err) {
        done(err);
      }

      res.status.should.equal(200);
      res.type.should.equal('application/json');
      done();
    });
  });
});