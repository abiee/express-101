'use strict';

var async = require('async');

module.exports = (database, postData, userId, callback) => {
  var data = Object.assign({}, postData);

  async.waterfall([
    (callback) => findUserById(database, userId, callback),
    (user, callback) => createPost(database, postData, user, callback),
  ], callback);
};

const findUserById = (database, userId, callback) => {
  database.collection('users')
    .find({ _id: userId })
    .toArray((error, docs) => {
      if (error) return callback(err, null);
      if (docs.length === 0) return callback(null, null);

      let user = docs[0];
      callback(null, user);
    });
};

const createPost = (database, postData, user, callback) => {
  postData.author = _getAuthor(user);

  database.collection('posts')
    .insert(postData, (error, result) => {
      if (error) return callback(error, null);

      let post = result.ops[0];
      callback(null, post);
    });
};

const _getAuthor = (user) => {
  return {
    _id: user._id,
    name: user.name
  }
};
