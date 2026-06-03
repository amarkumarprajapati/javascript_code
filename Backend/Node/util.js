// What is the Util Module?
// The util module provides utility functions for internal Node.js APIs.
// It includes functions for type checking, formatting, deprecation warnings, and more.

const util = require('util');

// 1. util.inspect()
// Returns a string representation of an object (useful for debugging)

const obj = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
};

console.log('Inspect:', util.inspect(obj, { colors: true, depth: null }));

// 2. util.format()
// Returns a formatted string using the first argument as a printf-like format string

const formatted = util.format('Hello, %s! You are %d years old.', 'Alice', 25);
console.log('Formatted:', formatted);

// Multiple arguments
const formatted2 = util.format('%s %d %j %o', 'string', 42, { key: 'value' }, [1, 2, 3]);
console.log('Formatted 2:', formatted2);

// 3. util.isDeepStrictEqual()
// Tests for deep equality between two values

const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const obj3 = { a: 1, b: 3 };

console.log('Deep equal (obj1, obj2):', util.isDeepStrictEqual(obj1, obj2));
console.log('Deep equal (obj1, obj3):', util.isDeepStrictEqual(obj1, obj3));

// 4. util.types
// Provides type checking functions

const types = util.types;

console.log('Is Array:', types.isArray([1, 2, 3]));
console.log('Is ArrayBuffer:', types.isArrayBuffer(new ArrayBuffer(10)));
console.log('Is Date:', types.isDate(new Date()));
console.log('Is Map:', types.isMap(new Map()));
console.log('Is Set:', types.isSet(new Set()));
console.log('Is Promise:', types.isPromise(Promise.resolve()));
console.log('Is RegExp:', types.isRegExp(/test/));
console.log('Is Error:', types.isError(new Error()));

// 5. util.promisify()
// Converts a callback-based function to a Promise-based function

const fs = require('fs');

// Traditional callback-based function
fs.readFile('./renamed.txt', 'utf8', (err, data) => {
  if (err) console.error('Callback error:', err);
  else console.log('Callback read:', data);
});

// Promisified version
const readFilePromise = util.promisify(fs.readFile);

readFilePromise('./renamed.txt', 'utf8')
  .then(data => console.log('Promise read:', data))
  .catch(err => console.error('Promise error:', err));

// Using async/await
async function readFileAsync() {
  try {
    const data = await readFilePromise('./renamed.txt', 'utf8');
    console.log('Async/await read:', data);
  } catch (err) {
    console.error('Async/await error:', err);
  }
}

readFileAsync();

// 6. util.callbackify()
// Converts an async function to a callback-based function

async function asyncFunction(value) {
  return value * 2;
}

const callbackFunction = util.callbackify(asyncFunction);

callbackFunction(5, (err, result) => {
  if (err) console.error('Callbackify error:', err);
  else console.log('Callbackify result:', result);
});

// 7. util.deprecate()
// Wraps a function to mark it as deprecated

const oldFunction = util.deprecate(
  () => console.log('This function is deprecated!'),
  'oldFunction() is deprecated. Use newFunction() instead.'
);

oldFunction();

// 8. util.debuglog()
// Returns a function that logs debug messages

const debug = util.debuglog('myapp');

debug('This is a debug message');
// Run with NODE_DEBUG=myapp node util.js to see debug messages

// 9. util.toUSVString()
// Converts a string to a valid Unicode string

const invalidString = 'a\uD800b';
const validString = util.toUSVString(invalidString);
console.log('Valid Unicode string:', validString);

// 10. util.stripVTControlCharacters()
// Removes ANSI escape codes from a string

const stringWithColors = '\u001b[31mRed text\u001b[0m';
const strippedString = util.stripVTControlCharacters(stringWithColors);
console.log('Stripped string:', strippedString);

// 11. Practical Example: Custom Error with util.inspect
// Creating a custom error with better inspection

class CustomError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'CustomError';
    this.details = details;
  }

  [util.inspect.custom](depth, options) {
    return `CustomError: ${this.message}\nDetails: ${util.inspect(this.details, options)}`;
  }
}

const customError = new CustomError('Something went wrong', { code: 500, field: 'email' });
console.log('Custom error:', customError);

// 12. Practical Example: Deep Clone with util.inspect
// Create a deep clone using inspect and eval (not recommended for production)

function deepClone(obj) {
  return eval(`(${util.inspect(obj, { depth: null })})`);
}

const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;

console.log('Original:', original);
console.log('Cloned:', cloned);
console.log('Are they different:', original.b.c !== cloned.b.c);

// 13. Practical Example: Logging Utility
// Create a logging utility using util.format

const logger = {
  log: (...args) => console.log(util.format('[LOG]', ...args)),
  error: (...args) => console.error(util.format('[ERROR]', ...args)),
  warn: (...args) => console.warn(util.format('[WARN]', ...args)),
  info: (...args) => console.info(util.format('[INFO]', ...args))
};

logger.log('Application started');
logger.error('Database connection failed');
logger.warn('Memory usage high');
logger.info('User logged in');

console.log('Util module examples loaded.');
