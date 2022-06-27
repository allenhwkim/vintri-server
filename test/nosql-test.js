const nosql = require('nosql');
const { resolve } = require('path');
const path = require('path');
const db = nosql.load(path.resolve(__dirname, '..', 'db', 'log.nosql'));
// const util = require('util')
// const dbInsert = util.promisify(db.insert)

function insert(data) {
  return new Promise(resolve => {
    db.insert(data).callback((err, resp) => resolve(resp) )
  });
}

const ID = 13;
Promise.all([
  insert({id: ID, rating: 5, comments: 'Excellent'}),
  insert({id: ID, rating: 1, comments: 'Urrrgh'}),
]).then(values => {
  // console.log(values);
  db.find().make(function(builder) {
    builder.between('id', ID, ID+1);
    builder.callback(function(err, response) {
      const avg = response.reduce((acc, cur) => acc + cur.rating, 0) / response.length;
      console.log('Ratings with id', ID, response, 'avg', avg);

      db.modify({ rating: 5, comments: 'Very Good'}).make(function(builder) {
        // builder.first(); // modifies only the one document
        builder.where('id', ID);
        builder.callback(function(err, count) {
          console.log('Rating of id', ID, 'is modified with rating 5 and comments "Very Good".', count);

          db.remove().make(function(builder) {
            builder.first(); // removes only the one document
            builder.where('id', '=', ID);
            builder.callback(function(err, count) {
              console.log('Rating of id', ID, 'is removed.', count);
            });
          });

        });
      });
    });
  });
});


// UPDATE
// -------
// ```
// db.modify({ rating: 5, comments: 'Very Good' }).make(function(builder) {
//   builder.first(); // modifies only the one document
//   builder.where('id', 1);
//   builder.callback(function(err, count) {
//     console.log('Rating of id 1 is modified with rating 5 and comments "Very Good".', count);
//   });
// });
// ```

// DELETE
// -------
// ```
// db.remove().make(function(builder) {
  // builder.first(); // removes only the one document
  // builder.where('id', '=', 1);
  // builder.callback(function(err, count) {
    // console.log('Rating of id 1 is removed.', count);
  // });
// });
// ```
