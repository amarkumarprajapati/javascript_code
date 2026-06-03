// What is the Query String Module?
// The querystring module provides utilities for parsing and formatting URL query strings.
// Note: In modern Node.js, the URLSearchParams API is preferred for new code.

const querystring = require('querystring');

// 1. querystring.parse()
// Parse a query string into an object

const queryString = 'name=John&age=30&city=New+York';
const parsed = querystring.parse(queryString);
console.log('Parsed query string:', parsed);
// Output: { name: 'John', age: '30', city: 'New York' }

// 2. querystring.stringify()
// Convert an object to a query string

const obj = { name: 'Alice', age: 25, city: 'Boston' };
const stringified = querystring.stringify(obj);
console.log('Stringified:', stringified);
// Output: name=Alice&age=25&city=Boston

// 3. Custom Separators
// Use custom separators for parsing and stringifying

const customString = 'name:John|age:30|city:New+York';
const customParsed = querystring.parse(customString, ':', '|');
console.log('Custom parsed:', customParsed);

const customStringified = querystring.stringify(obj, ':', '|');
console.log('Custom stringified:', customStringified);

// 4. Handling Arrays
// Parse query strings with duplicate keys into arrays

const arrayString = 'colors=red&colors=blue&colors=green';
const arrayParsed = querystring.parse(arrayString);
console.log('Array parsed:', arrayParsed);
// Output: { colors: ['red', 'blue', 'green'] }

// 5. Max Keys
// Limit the number of keys parsed (default: 1000)

const longString = 'a=1&b=2&c=3&d=4&e=5';
const limitedParsed = querystring.parse(longString, null, null, { maxKeys: 3 });
console.log('Limited parsed:', limitedParsed);
// Output: { a: '1', b: '2', c: '3' }

// 6. decodeURIComponent Options
// Control how values are decoded

const encodedString = 'name=John%20Doe&age=30';
const decoded = querystring.parse(encodedString, null, null, {
  decodeURIComponent: (str) => decodeURIComponent(str)
});
console.log('Decoded:', decoded);

// 7. encodeURIComponent Options
// Control how values are encoded

const objWithSpecial = { name: 'John Doe', email: 'john@example.com' };
const encoded = querystring.stringify(objWithSpecial, null, null, {
  encodeURIComponent: (str) => encodeURIComponent(str)
});
console.log('Encoded:', encoded);

// 8. Escaping and Unescaping
// Legacy escaping functions (use encodeURIComponent/decodeURIComponent instead)

const escaped = querystring.escape('hello world');
console.log('Escaped:', escaped);
// Output: hello%20world

const unescaped = querystring.unescape('hello%20world');
console.log('Unescaped:', unescaped);
// Output: hello world

// 9. Practical Example: Building Query Strings
// Build query strings from user input

function buildQueryString(params) {
  return querystring.stringify(params);
}

const userParams = {
  search: 'nodejs tutorial',
  page: 1,
  limit: 10,
  sort: 'relevance'
};

console.log('Built query string:', buildQueryString(userParams));

// 10. Practical Example: Parsing URL Query
// Extract and parse query string from a full URL

function parseUrlQuery(urlString) {
  const queryStart = urlString.indexOf('?');
  if (queryStart === -1) return {};

  const queryString = urlString.slice(queryStart + 1);
  return querystring.parse(queryString);
}

const fullUrl = 'https://example.com/search?q=nodejs&page=1&limit=10';
const urlQuery = parseUrlQuery(fullUrl);
console.log('URL query parsed:', urlQuery);

// 11. Practical Example: Handling Complex Objects
// Flatten nested objects for query strings

function flattenObject(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}[${key}]` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
}

const nestedObj = {
  user: {
    name: 'John',
    age: 30
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
};

const flattened = flattenObject(nestedObj);
console.log('Flattened:', flattened);
console.log('Flattened query string:', querystring.stringify(flattened));

// 12. Comparison with URLSearchParams
// Modern alternative to querystring module

const urlSearchParams = new URLSearchParams('name=John&age=30');
console.log('URLSearchParams get name:', urlSearchParams.get('name'));
console.log('URLSearchParams has age:', urlSearchParams.has('age'));

// URLSearchParams is generally preferred for new code
// querystring is maintained for legacy compatibility

console.log('Query string module examples loaded.');
