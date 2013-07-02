/**
 * User: Nightink
 * Date: 13-4-13
 * Time: 上午3:23
 * photo数据模型
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  author: { type: String, ref: 'User'},
  keywords: [String],   //图片关键字
  url: String,
  urlSmall: String,
  title: String,
  description: String,  //图片描述
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  reviews: [{        //图片评论记录数组
    author: { type: String, ref: 'User'},
    content: String,
    created: { type: Date, default: Date.now }
  }],
  width: Number,
  height: Number,
  type: { type: String, default: "photo" }
}, { versionKey: false});

mongoose.model('Photo', PhotoSchema);   //创建Photo模型