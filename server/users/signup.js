'use strict';

var async = require('async');

class AlreadyRgisteredError extends Error {
  constructor(email) {
    var message = `User with email ${email} is already registered`;
    super(message);
    this.name = 'ALREADY_REGISTERED';
    this.email = email;
  }
}

module.exports = (database, userData, callback) => {
  var users = database.collection('users');
  var data = Object.assign({}, userData);
  data.email = data.email.toLowerCase();

  async.waterfall([
    (callback) => isEmailRegistered(users, data.email, callback),
    (email, exists, callback) => ensureNotDuplicatedEmail(email, exists, callback),
    (callback) => registerUser(users, data, callback),
    (user, callback) => sendWelcomeEmail(user, callback)
  ], callback);
};

const isEmailRegistered = (usersCollection, email, callback) => {
  usersCollection
    .find({ email: email.toLowerCase() })
    .toArray((error, docs) => {
      if (error) return callback(err);
      callback(null, email, docs.length > 0);
    });
};

const ensureNotDuplicatedEmail = (email, exists, callback) => {
  if (exists) {
    callback(new AlreadyRgisteredError(email));
  } else {
    callback(null);
  }
};

const registerUser = (usersCollection, userData, callback) => {
  usersCollection.insert(userData, (error, result) => {
    if (error) return callback(error, null);

    let user = result.ops[0];
    callback(null, user);
  });
};

const sendWelcomeEmail = (user, callback) => {
  var message = "This is an email just to say welcome";
  sendEmail(user.email, 'Welcome to express', message, error => {
    callback(error, user);
  });
};

const sendEmail = (email, subject, message, callback) => {
  console.log('To:', email);
  console.log('Subject:', subject);
  console.log('');
  console.log('Message:', message);

  callback(null);
}
