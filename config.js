/**
 * User: Nightink
 * Date: 13-4-11
 * Time: 下午9:49
 * pophoto配置文件，mongo数据库配置
 */

exports.env = 'default';

// 数据库连接路由
exports.dbAdd = 'mongodb://127.0.0.1:27017/Pophoto';

exports.sys_port = 3001;
exports.session_secret = 'pophoto';
exports.session_key = 'pophoto-strong';

// 指定缩略图比例
exports.thumb = {
  width: 200
};

// cookie最大有效期，3天
exports.cookie_maxage = 60 * 60 * 24 * 3;

// 设置过滤url集合
exports.needFilter = ['/photos.json', '/photo-delete', '/po-photo', '/user'];