/**
 * User: Nightink
 * Date: 13-4-11
 * Time: 下午10:19
 * PoPhoto index 路由调度接口
 */

var mongoose = require('mongoose');
var _ = require('underscore');

var Photo = mongoose.model('Photo'); 

module.exports = function(app) {

  app.get('/', function(req, res) {

    var user = req.session.user || req.cookies;
    console.log('welcome')

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

  //return app.router;
}