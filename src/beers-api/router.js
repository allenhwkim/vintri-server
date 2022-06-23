const express = require('express');
const path = require('path');
const axios = require('axios').default;
const cache = require('memory-cache');

const nosql = require('nosql');
const db = nosql.load(path.resolve('db', 'rating.nosql'));

const router = express.Router();

// Task 1: Add a REST endpoint to retrieve a list of beers.
// This endpoint should accept one parameter in the query string of the request.
// The purpose of this parameter is to denote the name of the beer to search for.
// The endpoint will use the publicly available Punk API to find all beers matching the search parameter described above.
// The response should be a JSON object containing the following properties from the Punk API response: id, name, description, first_brewed, food_pairings
router.get('/', async (req, res) => {
  const queries = [];
  req.query.name && queries.push(`beer_name=${req.query.name}`);
  req.query.page && queries.push(`page=${req.query.page}`);
  req.query.per_page && queries.push(`per_page=${req.query.per_page}`);
  req.query.ids && queries.push(`ids=${req.query.ids}`); // separated by pipe (|) 

  const qs = queries.length ? `?${queries.join('&')}` : '';
  try {
    const url = 'https://api.punkapi.com/v2/beers' + qs;
    const cached = cache.get(url);
    if (cached) {
      res.set('x-cached', 'true'); // To indicate that the response is from cache
      res.status(200).json(cached); // Task 5: Get it from cache.
    } else {
      const resp = await axios.get(url);
      if (resp.data.length === 0) {
        res.status(404).send(`<h1>No beer found with name ${req.query.name}</h1>`);
      } else {
        const beers = resp.data.map(beer => {
          const { id, name, description, first_brewed, food_pairings } = beer;
          return { id, name, description, first_brewed, food_pairings };
        });
        res.status(200).json(beers);
        cache.put(url, beers, 60*60*1000); // // Task 5: caching (with 60 minutes cache expiry time)
      }
    }
  } catch(e) {
    res.status(500).send(e);
  }
});

// Task 2: Add a REST endpoint to allow a user to add a rating to a beer.
// The endpoint should accept an id parameter and JSON request body which includes the following properties: rating, comments
// Add validation to ensure the id parameter is a valid beer id and the rating is a valid value in the range of 1 to 5.
// Use the embedded database 'nosql' node module to persist this beer rating to the database.
router.post('/:id(\\d+)/rating', async (req, res) => {
  const {id} = req.params;
  const {rating, comments} = req.body;

  // Ensure the id parameter is a valid beer id and the rating is a valid value in the range of 1 to 5
  if (Number(id) < 1 || Number(id) > 5) {
    res.status(400).send(`Validation failed: Invalid beer id: ${id}`);
  } else {
    try {
      // TODO: Check if we need to validate rating as a valid number and comments as a valid string
      db.insert({ id, rating, comments }).callback( err => {
        res.status(201).json(`The rating for id(${id}) is created with comments "${comments}"`);
      });
    } catch(e) { // this includes 404
      res.status(error.response.status).send(e);
    }
  }
});

module.exports = router;