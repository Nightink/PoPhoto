# 基于node.js 图片展示web应用 [![Build Status](https://travis-ci.org/Nightink/node-Pophoto.png?branch=master)](https://travis-ci.org/Nightink/node-Pophoto)

## node app
使用 koa.js 和 node@>=4 进行重构，目前 app 下面的具体业务还么重构完成，但项目结构基本稳定。
当然实际生产环境还需做很多事情

### TODO
- [ ] cluster 运用
- [ ] logger 添加

### mac osx
``` shell

brew install node.js
brew install graphicsmagick
brew install mongodb
```

### windows
* [node.js官网](http://www.nodejs.org/)
* [GraphicsMagick官网](http://www.graphicsmagick.org/)
* [mongodb官网](http://www.mongodb.org/)

### 运行
* `$ node app` or `$ npm start`
* 提供启动参数`node app -h`
* -p 设置端口
* -d 前端js文件是否输出 debug版本文件
* `conf/config.js` staticPath 用于配置前端文件路径

## 后期规划
* 前端组件化构建开发[进行中]
* 移动端开发

## LICENSE
MIT
