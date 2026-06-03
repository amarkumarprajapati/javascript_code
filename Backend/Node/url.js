// What is the URL Module?
// The URL module provides utilities for URL resolution and parsing.
// It offers both the legacy API and the modern WHATWG URL API.

const url = require('url');

// 1. Legacy API - url.parse()
// Parse a URL string into its components

const urlString = 'https://user:pass@example.com:8080/path/to/resource?query=value#hash';

const parsedUrl = url.parse(urlString);
console.log('Parsed URL (legacy):', parsedUrl);
// Output: {
//   protocol: 'https:',
//   slashes: true,
//   auth: 'user:pass',
//   host: 'example.com:8080',
//   port: '8080',
//   hostname: 'example.com',
//   hash: '#hash',
//   search: '?query=value',
//   query: 'query=value',
//   pathname: '/path/to/resource',
//   path: '/path/to/resource?query=value',
//   href: 'https://user:pass@example.com:8080/path/to/resource?query=value#hash'
// }

// 2. Legacy API - url.format()
// Format a URL object into a string

const urlObject = {
  protocol: 'https:',
  hostname: 'example.com',
  port: '8080',
  pathname: '/api/users',
  query: { page: 1, limit: 10 }
};

const formattedUrl = url.format(urlObject);
console.log('Formatted URL (legacy):', formattedUrl);

// 3. Legacy API - url.resolve()
// Resolve a relative URL against a base URL

const baseUrl = 'https://example.com/path/';
const relativeUrl = '../other/page.html';
const resolvedUrl = url.resolve(baseUrl, relativeUrl);
console.log('Resolved URL:', resolvedUrl);
// Output: https://example.com/other/page.html

// 4. Modern WHATWG URL API
// Using the global URL class (preferred in modern Node.js)

const myUrl = new URL('https://user:pass@example.com:8080/path/to/resource?query=value#hash');

console.log('Protocol:', myUrl.protocol);
console.log('Username:', myUrl.username);
console.log('Password:', myUrl.password);
console.log('Hostname:', myUrl.hostname);
console.log('Port:', myUrl.port);
console.log('Pathname:', myUrl.pathname);
console.log('Search params:', myUrl.searchParams);
console.log('Hash:', myUrl.hash);
console.log('Href:', myUrl.href);

// 5. URLSearchParams
// Working with query string parameters

const searchParams = new URLSearchParams('page=1&limit=10&sort=desc');

console.log('Get page:', searchParams.get('page'));
console.log('Has limit:', searchParams.has('limit'));
console.log('All params:', searchParams.toString());

// Add parameters
searchParams.append('filter', 'active');
console.log('After append:', searchParams.toString());

// Delete parameter
searchParams.delete('sort');
console.log('After delete:', searchParams.toString());

// Set parameter (overwrites if exists)
searchParams.set('page', '2');
console.log('After set:', searchParams.toString());

// Iterate through parameters
searchParams.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 6. Creating URL from Object
// Build URL from components

const urlComponents = new URL('https://example.com');
urlComponents.pathname = '/api/products';
urlComponents.searchParams.set('category', 'electronics');
urlComponents.searchParams.set('price', 'under-100');

console.log('Built URL:', urlComponents.href);

// 7. URL Domain Parsing
// Extract domain information

const testUrl = new URL('https://sub.domain.example.co.uk/path');
console.log('Origin:', testUrl.origin);
console.log('Host:', testUrl.host);
console.log('Hostname:', testUrl.hostname);

// 8. File URLs
// Working with file:// protocol

const fileUrl = new URL('file:///C:/Users/john/documents/file.txt');
console.log('File URL pathname:', fileUrl.pathname);

// 9. URL Validation
// Check if a string is a valid URL

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

console.log('Is valid URL:', isValidUrl('https://example.com'));
console.log('Is valid URL:', isValidUrl('not-a-url'));

// 10. Practical Example: Building API URLs
// Helper function to build API URLs with parameters

function buildApiUrl(baseUrl, endpoint, params = {}) {
  const url = new URL(endpoint, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

const apiUrl = buildApiUrl(
  'https://api.example.com',
  '/v1/users',
  { page: 2, limit: 20, sort: 'name' }
);
console.log('API URL:', apiUrl);

// 11. Practical Example: Parsing Query Parameters
// Extract and parse query parameters from a URL

function parseQueryParams(urlString) {
  const url = new URL(urlString);
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

const queryUrl = 'https://example.com/search?q=nodejs&category=programming&lang=en';
const queryParams = parseQueryParams(queryUrl);
console.log('Query params:', queryParams);

// 12. Practical Example: URL Comparison
// Compare two URLs ignoring certain parts

function urlsEqual(url1, url2, ignoreHash = true) {
  const u1 = new URL(url1);
  const u2 = new URL(url2);

  if (ignoreHash) {
    u1.hash = '';
    u2.hash = '';
  }

  return u1.href === u2.href;
}

console.log('URLs equal:', urlsEqual(
  'https://example.com/path#section1',
  'https://example.com/path#section2'
));

// 13. Practical Example: URL Normalization
// Normalize URLs by removing default ports, trailing slashes, etc.

function normalizeUrl(urlString) {
  const url = new URL(urlString);

  // Remove default ports
  if ((url.protocol === 'https:' && url.port === '443') ||
      (url.protocol === 'http:' && url.port === '80')) {
    url.port = '';
  }

  // Remove trailing slash from pathname
  url.pathname = url.pathname.replace(/\/$/, '');

  return url.href;
}

console.log('Normalized URL:', normalizeUrl('https://example.com:443/path/'));

console.log('URL module examples loaded.');
