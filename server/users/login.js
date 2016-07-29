'use strict';

var tokens = require('../tokens');

class PasswordNotMatch extends Error {
  constructor() {
    var message = `Password not match`;
    super(message);
    this.name = 'PASSWORD_NOT_MATCH';
  }
}

class DoesNotExists extends Error {
  constructor(email) {
    var message = `User with email ${email} does not exists`;
    super(message);
    this.name = 'DOES_NOT_EXISTS';
  }
}

module.exports = (database, loginData, callback) => {
  var users = database.collection('users');
  var data = Object.assign({}, loginData);
  data.email = data.email.toLowerCase();

  findUserByEmail(users, data.email, (error, user) => {
    if (error) return callback(error);

    if (!user) {
      return callback(new DoesNotExists(data.email), null);
    }

    if (user.password !== loginData.password) {
      return callback(new PasswordNotMatch(), null);
    }

    var token = tokens.issueToken(user);
    callback(null, user, token);
  });
};

const findUserByEmail = (usersCollection, email, callback) => {
  usersCollection
    .find({ email: email.toLowerCase() })
    .toArray((error, docs) => {
      if (error) return callback(err, null);
      if (docs.length === 0) return callback(null, null);

      let user = docs[0];
      callback(null, user);
    });
};
