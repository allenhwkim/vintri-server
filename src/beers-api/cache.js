/**
 * Task 5: Add caching support.
 * Enhance the first REST endpoint for retrieving beers to support result caching.
 * The memory-cache module provided in the resources section can be used 
 * but you are also free to use any caching module of your choice.
 * Cache the results of queries made to the Punk API so when a user searches 
 * for a beer you can interrogate the cache first before deciding to request 
 * the results from Punk.
 * 
 * This file is NOT IN USE because caching requirement is very simple.
 * This can be in use in the future if we want to add more caching support in simpler way.
 */
const memoryCache = require('memory-cache');
const EXPIRY_TIME = 10*60*1000; // 10 minutes cache expiry time

// Using a Proxy to access memory-cache like an Javascript Hash object. e.g., 
// cache.foo = 1
// cache.foo // 1
// cache.foo = undefined // to delete the key
// cache.foo // null
// cache.bar // null
const cache = new Proxy({}, {
  get(obj, prop) {
    const value = memoryCache.get(prop);
    return value;
  },
  set(obj, prop, value)  {
    if (typeof value === 'undefined') {
      memoryCache.del('prop');
      return true;
    } else {
      memoryCache.put(prop, value, EXPIRY_TIME);
      return true;
    }
  },
});

module.exports = cache;