/**
 * PoPhoto index 路由调度接口
 */

var _         = require('underscore');
var debug     = require('debug')('app:router');
var mongoose  = require('mongoose');
var thunkify = require('thunkify');

var debugging = require('../libs/debugging');

var Photo     = mongoose.model('Photo');

Photo.find = thunkify(Photo.find);

module.exports = function(app) {

  app.get('/index.html', function *() {

    return this.redirect('/');
  });

  app.get('/', function *() {

    var user = this.session.user || this.cookies.get('username');

    if(_.isNull(user)) {

      return this.json('用户请登陆');
    }

    var _params = {
      limit: 15,
      skip: 0,
      sort: {
        updated: -1
      }
    };

    try {
      var docs = yield Photo.find(null, null, _params);

      var backDoc = [];
      _.each(docs, function(doc){

        var reviews = doc.reviews;
        doc._doc.reviews = (Array.isArray(reviews) ? reviews.length : 0);
        backDoc.push(doc._doc);
      });

      var indexRenderObj = {
        title: 'PoPhoto',
        time: Date.now(),
        items: backDoc
      };

      if(user && user.username) {

        indexRenderObj.user = user;
      }

      this.body = yield app.render('index', indexRenderObj);

    } catch(e) {

      console.log(e.stack);
      this.status = 500;
      return this.body = 'server error';
    }

    // this.body = indexRenderObj;

  });

  require('./attachment')(app);
  require('./user')(app);
  require('./photo')(app);
  require('./oauth')(app);

  debugging(debug, 'loaded router files');

  //return app.router;
};
