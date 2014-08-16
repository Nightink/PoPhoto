
var debug     = require('debug')('pophoto:controllers:index');

var mongoose = require('mongoose');
var _        = require('underscore');

var Photo     = mongoose.model('Photo');

var config   = require('../config.json');
var utils    = require('../libs/utils');

exports.index = function(req, res) {

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

    res.render('index', indexRenderObj);
  });
};