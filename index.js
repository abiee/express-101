var express = require('express')
var http = require('http')

var app = express();

app.get('/hello', (req, res) => {
  res.json({ hello: 'world' });
});

http.createServer(app).listen(3000, () => {
  console.log('Express server started!');
});
