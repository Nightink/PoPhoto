
var http = require('http');

var curl = http.get;

describe('app', function() {
  // 测试api接口是否正常运行
  describe('.api statusCode test', function() {

    before(function(done) {

      require('..');
      setTimeout(function() {

        done();
      }, 500);
    })

    // 运行测试用例 统一接口方法
    function runTest(summyString, contentType, url) {

      it(summyString, function(done) {

        curl(url, function(res) {

          res.should.have.status(200);
          res.should.have.header('content-type', contentType);

          // var data = '';
          // res.on('data', function(chuck) {
          //
          //   data += chuck.toString();
          // });
          //
          // res.on('end', function() {
          //
          //   data.should.include('keywords');
          //   done();
          // });
          done();
        });
      });
    }

    runTest('\'/photo\' url api should statusCode is 200',
      'application/json; charset=utf-8', 'http://127.0.0.1:3000/photo');

    runTest('\'/\' index html render should statusCode is 200',
      'text/html; charset=utf-8', 'http://127.0.0.1:3000');

  });
});
