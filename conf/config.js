/**
 * pophoto配置文件，mongo数据库配置
 */

exports.db_env          = 'mongo_config';

// 数据库连接路由

exports.dbAdd           = 'mongodb://node:node@127.0.0.1:27017/Pophoto';

// exports.sys_port        = 3001;
exports.session_secret  = 'pophoto';
exports.session_key     = 'pophoto-strong';

// cookie最大有效期，3天
exports.cookie_maxage   = 60 * 60 * 24 * 3;

// 设置过滤url集合
exports.needFilter      = ['/photos.json', '/photo-delete', '/po-photo', '/user'];

// 设置缓存文件失效期限 失效时间为： 1H
exports.file_clear_time = 3600000;

// 指定缩略图比例
exports.thumb = {

  width: 200
};

// 静态文件路径与nginx静态文件路径一致
exports.static_path = '/Users/Nightink/code/github/web-static';
