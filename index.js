var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var http = require('http');

var app = express();

// Log requests
if (process.env.NODE_ENV == 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Parse to json requests with application/json
app.use(bodyParser.json())

// Compress all responses
app.use(compression());

// Enable CORS for any origin
app.use(cors())

// Serve public assets
app.use(serveStatic('app', { index: ['index.html', 'index.htm'] }));

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.json({ hello: name });
});

http.createServer(app).listen(3000, () => {
  console.log('Express server started!');
});
