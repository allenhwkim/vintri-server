Refs. 
  . https://docs.totaljs.com/latest/en.html#api~DatabaseBuilder
  . https://nosql.totaljs.com/

CONNECT
-------
var db = require('nosql').load(path.resolve('db', 'rating.nosql'));

CREATE
------
db.insert({ id: 1, rating:0, comments: 'Very Bad' }).callback(function(err) {
  console.log('Rating is created.');
});

READ
------
db.find().make(function(builder) {
  builder.between('id', 1, 2);
  builder.callback(function(err, response) {
    console.log('Ratings with id between 1 and 2 years:', response);
  });
});

UPDATE
-------
db.modify({ rating: 5, comments: 'Very Good' }).make(function(builder) {
  builder.first(); // modifies only the one document
  builder.where('id', 1);
  builder.callback(function(err, count) {
    console.log('Rating of id 1 is modified with rating 5 and comments "Very Good".', count);
  });
});

DELETE
-------
db.remove().make(function(builder) {
  builder.first(); // removes only the one document
  builder.where('id', '=', 1);
  builder.callback(function(err, count) {
    console.log('Rating of id 1 is removed.', count);
  });
});