'use strict';

var authRequired = require('./auth-middleware');
var usersRouter = require('./users');
var postsRouter = require('./posts');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/posts', authRequired, postsRouter);
};
