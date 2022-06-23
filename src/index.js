const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const xUserMiddleware = require('./x-user-middleware');
const apiRouter = require('./beers-api/router');

// middlewares
const corsAllowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true); // for mobile, or curl
    if(corsAllowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error('CORS error'), false);
  }
}));
app.use(express.json()); // parse json
app.use(express.urlencoded({extended: false})); // previously bodyparser
app.use(xUserMiddleware.func);

// routers
app.use('/api/beers', apiRouter);

// To list all APIs
app.get('/api', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'beers-api/index.txt'));
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>404</h1>');
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});

