'use strict';

var express = require('express');
var authRequired = require('../auth-middleware');
var httpCode = require('../http-status-codes');
var usersRouter = express.Router();

usersRouter.post('/signup', (req, res) => {
  const signup = require('./signup');
  const userData = req.body;
  const database = req.db;

  signup(database, userData, (error, user) => {
    if (error) {
      if (error.name === 'ALREADY_REGISTERED') {
        res.status(httpCode.HTTP_DUPLICATED)
          .json({ message: error.message });
      } else {
        res.status(httpCode.HTTP_INTERNAL_SERVER_ERROR)
          .json({ message: "Unexpected error" });
      }

      return;
    }

    res.status(httpCode.HTTP_CREATED)
      .json(user);
  });
});

usersRouter.post('/login', (req, res) => {
  const login = require('./login');
  const loginData = req.body;
  const database = req.db;

  login(database, loginData, (error, user, token) => {
    if (error) {
      if (error.name === 'PASSWORD_NOT_MATCH' || error.name == 'DOES_NOT_EXISTS') {
        res.status(httpCode.HTTP_UNAUTHORIZED)
          .json({ message: 'Invalid user and password combination' });
      } else {
        res.status(httpCode.HTTP_INTERNAL_SERVER_ERROR)
          .json({ message: "Unexpected error" });
      }

      return;
    }

    res.status(httpCode.HTTP_OK)
      .json({
        user: user,
        token: token
      });
  });
});

usersRouter.get('/me', authRequired, (req, res) => {
  res.json(req.user);
});

module.exports = usersRouter;
