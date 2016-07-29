'use strict';

var usersRouter = require('./users');

module.exports = (app) => {
  app.use('/users', usersRouter);
};
