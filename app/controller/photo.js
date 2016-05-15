/**
 * photo 控制器
 */

'use strict';

// 第三方依赖组件
const moment = require('moment');
const mongoose = require('mongoose');

// 应用模块
const utils = require('../../lib/utils');
const Photo = mongoose.model('Photo');

// GET --> /photo
exports.photo = function* () {
  const query = {};
  const q = this.query.q || null;
  // 用户查询图片关键字
  const keywords = this.query.keywords && this.query.keywords.split(',');
  const time = this.query.time ? this.query.time : Date.now();
  const author = this.query.author;

  if (author) {
    query.author = author;
  }

  query.updated = {
    '$lte': time,
  };

  if (q) {
    query.$or = [{
      description: new RegExp(q),
    }, {
      author: new RegExp(q),
    }];
  }
  if (keywords) {
    query.keywords = {
      '$in': keywords,
    };
  }

  const _params = {
    limit: this.query.limit ? this.query.limit : 15,
    skip: this.query.skip ? this.query.skip : 0,
    sort: {
      updated: -1,
    },
  };

  try {
    const docs = yield this.app.service.photo.query(query, null, _params);
    const backDoc = docs.map(doc => {
      const reviews = doc.reviews;

      doc._doc.reviews = Array.isArray(reviews) ? reviews.length : 0;
      doc._doc.created = moment(doc.created).format('YYYY-MM-DDTHH:mm:ss');
      doc._doc.updated = moment(doc.updated).format('YYYY-MM-DDTHH:mm:ss');

      if (doc.type === 'video') {

        doc._doc.isVideo = true;
      }

      return doc._doc;
    });

    return this.body = backDoc;
  } catch(err) {
    console.log(err);
    return this.body = {
      stat: 'fail',
      message: 'system error',
    };
  }
};

// GET --> /photo/:id
exports.getPhotoById = function(req, res) {

  // const review = req.query.review;
  const params = {
    '_id': req.params.id,
  };

  Photo.findOne(params, function(err, doc) {

    if (err) {

      return res.json(500, '获取图片信息错误');
    }

    res.json(doc);

  });

};

// PUT --> /photo
exports.addCommentsPhoto = function(req, res) {

  const reviews = req.body.reviews.pop();

  const update = {
    '$push': {
      reviews: {
        author: req.session.user.username || req.cookies.username,
        content: reviews.content,
        created: new Date(),
      },
    },
    '$set': {
      update: new Date(),
    },
  };

  const params = {
    '_id': req.body._id,
  };

  Photo.update(params, update, function(err, num) {

    if (err) {
      return res.json(500, '添加图片评论错误');
    }

    if (num === 0) {
      return res.json(400, '图片信息错误');
    }

    return res.json(200, '添加评论成功');
  });
};

// POST --> /po-photo 处理用户提交图片信息入库操作
exports.poPhoto = function(req, res) {

  const reqPost = req.body;
  const author = req.session.user.username || req.cookies.username;
  const title = reqPost.title;

  if (!author) {

    return res.json(200, '请重新登陆');
  }

  if (!reqPost.keywords) {

    return res.send(400, '关键字不能为空');
  }

  // 需要进行xss攻击屏蔽 start
  reqPost.author = author;
  // 过滤文件后缀名
  reqPost.title = title.substring(0, title.lastIndexOf('.'));
  reqPost.created = reqPost.updated = Date.now();
  // 关键字处理
  reqPost.keywords = reqPost.keywords.split(/;|；|\s|,|，/);
  // end

  const photo = new Photo(reqPost);

  photo.save(function(err, doc) {
    if (!err) {

      res.json(200, doc);
    } else {

      res.json(500, '服务器设置失败');
    }
  });

};

// PUT -> /photo-update 图片更新操作
exports.updatePhoto = function(req, res) {

  const reqBody = req.body;

  Photo.findOne({_id: reqBody._id }, function(err, doc) {

    if (err) {
      return res.json(500, '服务器查询失败');
    }

    doc.title = reqBody.title;
    doc.description = reqBody.description;

    if (!Array.isArray(reqBody.keywords)) {

      // 关键字处理
      doc.keywords = reqBody.keywords.split(/;|；|\s|,|，/);
    }

    doc.save(function(err/* , doc */) {

      if (err) {
        return res.json(500, '服务器更新失败');
      }

      res.json(200, '图片信息更新成功');
    });

  });

};

// DELETE -> /photo-delete 图片删除操作
exports.deletePhoto = function(req, res) {

  const userId = utils.decipherHelper(req.cookies._id);

  if (userId !== req.session.user._id) {

    return res.json(403, '无权限删除此照片');
  }

  const params = {
    '_id': req.query._id,
  };

  Photo.remove(params, function(err) {

    if (err) {
      return res.json(500, err);
    }

    res.json(200, '删除成功');
  });
};


// 获取某个用户上传图片信息 默认查询前十五条数据
exports.getPhotosByUser = function(query, opt, next) {

  Photo.find(query, null, opt, function(err, docs) {
    next(err, docs);
  });
};
