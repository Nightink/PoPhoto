'use strict';

const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');

exports.query = (a, b, param) => {
  return new Promise((resolve, reject) => {
    Photo.find(a, b, param, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  }).then(docs => {
    return docs.map(doc => {
      const reviews = doc.reviews;
      doc._doc.reviews = Array.isArray(reviews) ? reviews.length : 0;
      return doc._doc;
    });
  });
};
