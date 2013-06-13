/**
 * User: Nightink
 * Date: 13-4-24
 * Time: 下午3:11
 * 负责图片上传、返回显示
 */

var utils = require('../lib/utils')
    , config = require('../config');

//POST /upload 上传图片
exports.upload = function(req, res) {
    var file = req.files.file
        , tempPath = file.path;

    var tempImagePath = __dirname + '/../' + tempPath;
    var thumbImagePath = tempImagePath + '_t';          //缩略图缓存
    var attachmentImagePath = tempImagePath + '_s';     //原生图缓存

    utils.imageSize(tempPath, function(err, size) {
        utils.thumb(tempImagePath, attachmentImagePath, size.width, size.height, function() {
            //图片原尺寸入库
            utils.upload(file.name, file.type, attachmentImagePath, function(err, docFileS) {
                if(err) console.log(err);

                var thumbWidth = config.thumb.width
                    , thumbHeight = size.height * (thumbWidth / size.width);

                utils.thumb(tempImagePath, thumbImagePath, thumbWidth, thumbHeight, function(err) {
                    //图片缩略入库
                    utils.upload('s_' + file.name, file.type, thumbImagePath, function(err, docFileT) {
                        if(err) {
                            console.log(err);
                            return res.send(500);
                        }

                        var data = {
                            url: docFileS._id.toString() || '',             //原图url
                            url_small: docFileT._id.toString() || '',       //缩略图url
                            size: size
                        };
                        utils.sendJson(req, res, data);
                    });
                });
            });
        });
    });
};

// GET attachment/:id
exports.download = function(req, res) {
    var attachmentID = req.params.id;

    utils.download(attachmentID, function(err, contentType, file) {
        if(err) {
            console.log('Debug: 获取文件失败,Error:%s', err);
            return res.send(400, '找不到该文件');
        }

        res.set('Content-Type', contentType);   //设置响应头 文件格式
        res.send(file);
    });
};

exports.delete = function(req, res) {
    var attachmentID = req.params.id;

    utils.delete(attachmentID, function() {
        res.send('删除成功');
    });
}