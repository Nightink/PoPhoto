'use strict';

module.exports = {
  mongodb: {
    'dbEnv': 'mongoConnect',
    'dbAdd': 'mongodb://127.0.0.1:27017/pophoto_test',
    authParams: {},
  },
  session: {
    'secret': 'pophoto',
    'key': ['pophoto-strong'],
  },
  'cookieMaxage': 259200000,
  'needFilter': ['/photo-delete', '/po-photo', '/user', '/delete/:id'],
  'fileClearTime': 3600000,
  'thumb': {
    'width': 200,
  },
  'staticPath': 'static',
  'debug': true,
  'port': 3000,
  env: process.env.NODE_ENV,
  userrole: {
    failureHandler(action) {
      this.roleFailureHandler(action);
    },
  },
};