'use strict';

var tokens = require('./tokens');
var httpCode = require('./http-status-codes');

module.exports = (req, res, next) => {
  var token = req.header('Authorization');
  if (!token) {
    return res.status(httpCode.HTTP_FORBIDDEN)
      .json({ error: 'Forbidden' });
  }

  var user = tokens.getTokenOwner(token);
  if (!user) {
    return res.status(httpCode.HTTP_FORBIDDEN)
      .json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
};
