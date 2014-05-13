/**
 * photo数据模型
 */

var mongoose = require('mongoose');

/**
 * author: 上传者
 * keywords : 关键字
 * reviews : 图片评论记录数组
 * description : 图片描述
 * reviews : 图片评论记录数组
 */
var PhotoSchema = new mongoose.Schema({

  keywords    : [String],
  url         : String,
  urlSmall    : String,
  title       : String,
  description : String,
  width       : Number,
  height      : Number,

  author  : { type: String, ref: 'User' },
  created : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now },
  type    : { type: String, default: 'photo' },

  reviews: [{
    author: { type: String, ref: 'User' },
    content: String,
    created: { type: Date, default: Date.now }
  }]

}, { versionKey: false });

// 创建Photo模型
mongoose.model('Photo', PhotoSchema);
