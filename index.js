var express = require('express');
var http = require('http');

var app = express();

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({ hello: name });
});

http.createServer(app).listen(3000, () => {
  console.log('Express server started!');
});
