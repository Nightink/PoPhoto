/**
 * User: Nightink
 * Date: 13-4-11
 * Time: 下午10:19
 * PoPhoto index 路由调度接口
 */

var user = require('./user')
    , photo = require('./photo');

module.exports = function(app) {

    /*app.get('/', function(req, res) {
        res.redirect('/photos');
    });*/

    require('./attachment')(app);
    require('./user')(app);
    require('./photo')(app);
    require('./oauth')(app);

    //return app.router;
}