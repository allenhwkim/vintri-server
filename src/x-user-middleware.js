// Task 3: Create an express middleware module.
// This module should intercept all requests made to your rest API and perform the following:
// Validate that the request has a 'x-user' header parameter containing a valid formatted email address (minimum validation: contains an @ symbol and a period to denote the presence of a domain). 
// If the header is not present or the value is not considered to be a valid email address an error response should be returned by the API.
// Add request logging by persisting the x-user header and request details to the embedded 'no-sql' database.
const path = require('path');
const nosql = require('nosql');
const db = nosql.load(path.resolve('db', 'log.nosql'));

const xUserMiddleware = {
  logRequest: function(req) {
    const time = new Date().toISOString();
    const user = req.headers['x-user'] || '';
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const {method, headers} = req;
    db.insert({ time, method, url, user, headers}).callback( err => {
      console.log(`${time} ${method} ${url} ${headers}`);
    });
  },

  func: (req, res, next) => {
    xUserMiddleware.logRequest(req);
  
    try {
      const user = req.headers['x-user'] || '';
      if (req.method === 'OPTIONS') {
        res.send(200);
      } else if (user.match(/^\S+@\S+.\S+$/)) {
        next();
      } else {
        throw 'Invalid user ID';
      }
    } catch(e) {
      console.error(e);
      console.error(req.headers);
      res.status(400);
      res.send('Unauthorized');
    }
  }
};

module.exports = xUserMiddleware;