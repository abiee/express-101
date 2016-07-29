'use strict';

var crispy = require('crispy-string');

const TOKEN_LENGHT = 40;

class TokenManager extends Object {
  constructor() {
    super();
    this.tokens = {};
  }

  issueToken(user) {
    var token = this._generateToken();
    this.tokens[token] = user;
    return token;
  }

  _generateToken() {
    return crispy.base64String(TOKEN_LENGHT);
  }

  dropToken(token) {
    delete this.tokens[token];
  }

  getTokenOwner(token) {
    return this.tokens[token] || null;
  }
}

module.exports = new TokenManager();
