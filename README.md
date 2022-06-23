# vintri-server

## Setup this API server and run in http://localhost:5000
```
$ git clone https://github.com/allenhwkim/vintri-server.git
$ cd vintri-server
$ nvm use 16
$ npm i
$ npm start
```
You will see the server is up-and-running.
```
> vintri-interivew@1.0.0 start
> nodemon ./src/index.js

[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./src/index.js`
Server is listening on port 5000
```

## Test this API server in a different terminal tab
There are 3 API urls available 

* `GET /api/beers`
* `GET /api/beers?name=larger`
* `POST /api/beers/:id/rating`   (with body {rating: 5, comments: "This is a comment"})
```
$ curl -I -X GET http://localhost:5000/api/beers # Invalid request
$ curl -I -X GET -H "x-user: invalid" http://localhost:5000/api/beers # Invalid request
$ curl -I -X GET -H "x-user: allen@kim.com" http://localhost:5000/api/beers
$ curl -I -X GET -H "x-user: allen@kim.com" http://localhost:5000/api/beers?name=larger 

$ curl -I -X POST -H "x-user: allen@kim.com" -H 'Content-Type: application/json' -d '{"rating":5, "comments": "Very Good"}' http://localhost:5000/api/beers/5/rating
$ curl -I -X POST -H "x-user: allen@kim.com" -H 'Content-Type: application/json' -d '{"rating":5, "comments": "Very Good"}' http://localhost:5000/api/beers/1000/rating # With an invalid beer id
$ curl -I -X POST -H "x-user: allen@kim.com" -H 'Content-Type: application/json' -d '{"rating":10, "comments": "Excellent"}' http://localhost:5000/api/beers/50/rating # With an invalid beer rating
```

## Check if nosql db is propelly logged
```
$ cd db
$ cat log.nosql
$ cat rating.nosql
```

## To run unit test
```
$ npm test

> vintri-interivew@1.0.0 test
> mocha
  xUserMiddleware()
    ✔ should skip OPTIONS call
    ✔ should continue with a valid x-user header
    ✔ should return 401 with an invalid x-user header
    ✔ should return 401 with an empty x-user header
  4 passing (11ms)
```
## To test caching works
I have added `x-cached` header if the response is from server-side cache
```
vintri-server main $ curl -I -X GET -H "x-user: allen@kim.com" http://localhost:5000/api/beers?name=larger
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 743
ETag: W/"2e7-FYg1IidThlX+tHgek1K6oBJ72EY"
Date: Thu, 23 Jun 2022 21:21:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

vintri-server main $ curl -I -X GET -H "x-user: allen@kim.com" http://localhost:5000/api/beers?name=larger
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
x-cached: true  <---------------------- check this header if response is from cache
Content-Type: application/json; charset=utf-8
Content-Length: 743
ETag: W/"2e7-FYg1IidThlX+tHgek1K6oBJ72EY"
Date: Thu, 23 Jun 2022 21:21:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

