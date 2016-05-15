'use strict';

module.exports = function(app) {
  app.role.use('user', function() {
    if (this.session.user) {
      return true;
    } else {
      return false;
    }
  });
};
