
var request = require('supertest');
var app = require('../../app');

var Photo = require('mongoose').model('Photo');

describe('controllers/photo.js', function () {

  var d;

  before(function(done) {
    var photo = new Photo({
      'author': '眸子_-',
      'created': new Date(1379863598544),
      'description': '桌面',
      'height': 1200,
      'keywords': [
        '桌面',
        'mac'
      ],
      'reviews': [],
      'title': '绿树',
      'type': '',
      'updated': new Date(1379863598544),
      'url': '/attachment/523f0c20b09f14c636000002',
      'urlSmall': '/attachment/523f0c20b09f14c636000041',
      'width': 1920
    });

    photo.save(function(err, doc) {
      d = doc;
      done(err);
    });
  });

  after(function(done) {
    Photo.remove({'_id': d._id}, function(err) {
      done(err);
    });
  });

  it('should /photo 200', function (done) {
    request(app)
    .get('/photo')
    .end(function (err, res) {
      if(err) {
        done(err);
      }

      res.status.should.equal(200);
      res.type.should.equal('application/json');
      res.body.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      done();
    });
  });
});