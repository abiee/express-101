'use strict';

var MongoClient = require('mongodb').MongoClient;

var isAuthenticatedConnection = (config) => {
  return config.hasOwnProperty('username') && config.hasOwnProperty('password');
};

var getConnectionString = (config) => {
  var connectionString = 'mongodb://';

  if (isAuthenticatedConnection(config)) {
    connectionString += `${config.username}:${config.password}@`;
  }

  connectionString += config.host || 'localhost';

  if (config.hasOwnProperty('port')) {
    connectionString += `:${config.port}`;
  }

  connectionString += '/' + config.database || 'default';

  return connectionString;
};

module.exports = (config, callback) => {
  var connectionString = getConnectionString(config);
  MongoClient.connect(connectionString, callback);
};
