/**
 * PoPhoto index 路由调度接口
 */

var _        = require('underscore');
var debug    = require('debug')('app:router');
var mongoose = require('mongoose');

var Photo = mongoose.model('Photo');

module.exports = function(app) {

  app.get('/index.html', function(req, res) {

    return res.redirect('/');
  });

  app.get('/', function(req, res) {

    var user = req.session.user || req.cookies;

    if(_.isNull(user)) {

      return res.json('用户请登陆');
    }

    var _params = {
      limit: 15,
      skip: 0,
      sort: { updated: -1 }
    };

    Photo.find(null, null, _params, function(err, docs) {

      if(err) {

        return res.send(500);
      }
      var backDoc = [];
      _.each(docs, function(doc){

        var reviews = doc.reviews;
        doc._doc.reviews = ((reviews && reviews instanceof Array) ? reviews.length : 0);
        backDoc.push(doc._doc);
      });

      if(user && user.username) {
        res.render('index', { title: 'PoPhoto', time: Date.now(), user: user, items: backDoc });
      } else {
        res.render('index', { title: 'PoPhoto', time: Date.now(), items: backDoc });
      }
    });
  });

  require('./attachment')(app);
  require('./user')(app);
  require('./photo')(app);
  require('./oauth')(app);

  debug('loaded router files');

  //return app.router;
}
