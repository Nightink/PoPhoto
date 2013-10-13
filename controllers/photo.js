/**
 * User: Nightink
 * Date: 13-4-15
 * Time: 上午11:34
 * photo 控制器
 */

var utils = require('../lib/utils')
  , config = require('../config')
  , mongoose = require('mongoose')
  , Photo = mongoose.model('Photo')
  , _ = require('underscore');

// GET --> /photos
exports.photos = function(req, res) {
  var user = req.session.user || req.cookies;

  if(_.isNull(user)) return utils.sendJson(req, res, '用户请登陆');

  var _params = { 
    limit: 15, 
    skip: 0, 
    sort: { updated: -1 } 
  };

  Photo.find(null, null, _params, function(err, docs) {

    if(err) {
        utils.log(err);
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
};

// GET --> /photos.json    无关键字模式为：下拉瀑布流 有关键字模式为：搜索功能
exports.photosJson = function(req, res) {

  var query = {};
  var fields = '';
  var q  = req.query.q || null;
  // 用户查询图片关键字
  var keywords = req.query.keywords && req.query.keywords.split(',');
  var time = req.query.time ? req.query.time : Date.now();
  var author = req.query.author;

  if(author) query.author = author;

  query.updated = { '$lte': time };
  if(q) {
    query.$or = [{description: new RegExp(q)}, {author: new RegExp(q)}];
  }
  if (keywords) {
    query.keywords = { '$in': keywords };
  }
  var limit = req.query.limit ? req.query.limit : 15;
  var skip = req.query.skip ? req.query.skip : 0;
  var _params = { 
    limit: limit, 
    skip: skip, 
    sort: { updated: -1 }
  };

  utils.log(req.query);

  Photo.find(query, null, _params, function(err, docs){
    if(err) {
        utils.log(err);
      return res.send(500);
    }
    var backDoc = [];
    _.each(docs, function(doc){
      var reviews = doc.reviews;
      doc._doc.reviews = ((reviews && reviews instanceof Array) ? reviews.length : 0);
      if(doc.type === 'video'){
        doc._doc.isVideo = true;
      }
      backDoc.push(doc._doc);
    });
    // utils.sendJson(req, res, backDoc);
    res.json(backDoc);
  });
};

// GET --> /photos/:id
exports.getPhotoById = function(req, res) {

  var photoId = req.params.id;
  var review = req.query.review;
  Photo.findOne({ '_id': photoId }, function(err, doc) {

    if(err) return utils.sendStatus(req, res, 500, '获取图片信息错误');
    // utils.sendJson(req, res, doc);
    res.json(doc);
  });
};

// PUT --> /photos
exports.addCommentsPhoto = function(req, res) {

  // var photoId = req.params.id;
  var photoId = req.body._id;
  var reviews = req.body.reviews.pop();

  var pushObj = {
    author: req.session.user.username || req.cookies.username,
    content: reviews.content,
    created: new Date()
  };

  var update =  {
    '$push': { reviews: pushObj }, 
    '$set': { update: new Date() }
  };

  Photo.update({ _id: photoId }, update, function(err, num){

    if(err) return utils.sendStatus(req, res, 500, '添加图片评论错误');;
    if(num === 0) return utils.sendStatus(req, res, 403, '图片信息错误');
    // utils.sendStatus(req, res, 200, '添加评论成功');
    return res.json(200, '添加评论成功');
  })
};

// POST --> /po-photo 处理用户提交图片信息入库操作
exports.poPhoto  = function(req, res) {

  var reqPost = req.body
    , author = req.session.user.username || req.cookies.username
    , title = reqPost.title;

  if(!author) return utils.sendJson(req, res, '请重新登陆');
  if(_.isEmpty(reqPost.keywords)) return res.send(400, '关键字不能为空');

  reqPost.author = author;
  // 过滤文件后缀名
  reqPost.title = title.substring(0, title.lastIndexOf('.'));
  reqPost.created = reqPost.updated = Date.now();
  //关键字处理
  reqPost.keywords = reqPost.keywords.split(/;|；|\s|,|，/);

  var photo = new Photo(reqPost);

  photo.save(function(err, doc) {
    if(!err) {
      utils.sendStatus(req, res, 200, '图片保存成功');
    } else {
      // utils.sendJson(req, res, '失败');
      res.sendStatus(req, res, 500, '服务器设置失败');
    }
  });

};

// PUT -> /photo-update 图片更新操作
exports.updatePhoto = function(req, res) {

  var reqBody = req.body;

  Photo.findOne({_id: reqBody._id }, function(err, doc) {
    if(err) return utils.sendStatus(req, res, 500, '服务器查询失败');

    doc.title = reqBody.title;
    doc.description = reqBody.description;

    if(!_.isArray(reqBody.keywords)) {
      // 关键字处理
      doc.keywords = reqBody.keywords.split(/;|；|\s|,|，/);
    }

    doc.save(function(err, doc) {
      if(err) return utils.sendStatus(req, res, 500, '服务器更新失败');

      utils.sendStatus(req, res, 200, '图片信息更新成功');
    });
  });

};

// DELETE -> /photo-delete 图片删除操作
exports.deletePhoto = function(req, res) {

  var _id = req.query._id;

  Photo.remove({ '_id': _id }, function(err) {
    if(err) return utils.sendStatus(req, res, 500, err);

    utils.sendStatus(req, res, 200, '删除成功');
  });
};


// 获取某个用户上传图片信息 默认查询前十五条数据
exports.getPhotosByUser = function(query, opt, next) {

  Photo.find(query, null, opt, function(err, docs) {
    next(err, docs);
  });
}