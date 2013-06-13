/**
 * User: Nightink
 * Date: 13-4-12
 * Time: 下午10:19
 *
 * 用户验证路由处理、验证业务逻辑处理
 */
var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , config = require('../config')
    , utils = require('../lib/utils')
    , _ = require('underscore');

module.exports = function(app) {

    //用户登出操作
    app.get('/login-out', function(req, res) {
        var redirect = req.query.redirect ?  req.query.redirect : "/photos";
        if(req.session && req.session.user){
            var userId = req.session.user.username;
            console.log("用户" + userId + "登出");
        }

        res.clearCookie('_id', { path:'/' });
        res.clearCookie('username', { path:'/' });
        req.session.destroy();
        res.redirect(redirect);
    });

    //用户登陆操作
    app.post('/login', function(req, res) {
        var reqBody = req.body
            , email = reqBody.email
            , password = reqBody.password;

        if(_.isEmpty(email) || _.isEmpty(password)) return utils.sendStatus(req, res, 400, '请填写正确信息');

        password = utils.encryptHelper(password);

        User.findOne({ "email": email, "password": password }, function(err, doc) {
            if(err) return res.sendStatus(req, res, 500, err);

            if(_.isNull(doc)) return utils.sendStatus(req, res, 400, '登陆失败');

            var result = {
                username: doc.username,
                _id: doc._id.toString()
            };

            req.session.user = result;
            req.session.save(function(err){
                res.cookie('_id', utils.encryptHelper(result._id), { path:'/', maxAge: config.cookie_maxage });
                res.cookie('username', result.username, { path:'/', maxAge: config.cookie_maxage });

                utils.sendJson(req, res, result);   //登陆成功，返回用户信息
            });

        });
    });

};
