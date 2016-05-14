'use strict';

exports.index = function* () {
  try {
    const backDoc = yield this.app.service.photo.query(null, null, {
      limit: 15,
      skip: 0,
      sort: { updated: -1 },
    });

    const model = {
      title: 'PoPhoto',
      time: Date.now(),
      items: backDoc,
    };

    const user = this.session.user;
    if (user && user.username) {
      model.user = user;
    }

    yield this.render('index.html', model);
  } catch (err) {
    console.log(err);
    yield this.render('error.html');
  }
};
