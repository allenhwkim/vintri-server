const express = require('express');
const path = require('path');
const app = express();

const xUserMiddleware = require('./x-user-middleware');
const apiRouter = require('./beers-api/router');

// middlewares
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

