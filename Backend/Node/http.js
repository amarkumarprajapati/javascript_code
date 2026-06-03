// What is the HTTP Module?
// The HTTP module in Node.js allows you to create web servers and make HTTP requests.
// It provides the functionality to transfer data over the HTTP protocol.

const http = require('http');

// 1. Creating a Simple HTTP Server
// Creates a server that listens for incoming requests

const server = http.createServer((req, res) => {
  // req: IncomingMessage - represents the request
  // res: ServerResponse - represents the response

  console.log(`Request received: ${req.method} ${req.url}`);

  // Set response header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send response body
  res.end('Hello, World!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// 2. Making an HTTP Request (GET)
// Making a request to another server

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts/1',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);

  let data = '';

  // Receive data chunks
  res.on('data', (chunk) => {
    data += chunk;
  });

  // Response complete
  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();

// 3. Making an HTTP POST Request
// Sending data to a server

const postData = JSON.stringify({
  title: 'foo',
  body: 'bar',
  userId: 1
});

const postOptions = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const postReq = http.request(postOptions, (res) => {
  console.log(`POST Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log('POST Response:', data); });
});

postReq.on('error', (error) => {
  console.error('POST error:', error);
});

postReq.write(postData);
postReq.end();

// 4. Handling Different Routes
// Routing based on URL

const router = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (req.url === '/api' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'API endpoint' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// router.listen(3001, () => console.log('Router server on port 3001'));

console.log('HTTP module examples loaded. Uncomment router.listen() to test routing.');
