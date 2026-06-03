// What is the HTTPS Module?
// The HTTPS module in Node.js is similar to HTTP but provides secure communication over SSL/TLS.
// It's used for making secure HTTP requests and creating secure web servers.

const https = require('https');

// 1. Making a Secure GET Request
// Fetching data from a secure endpoint

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts/1',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();

// 2. Making a Secure POST Request
// Sending data securely

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

const postReq = https.request(postOptions, (res) => {
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

// 3. Creating an HTTPS Server (requires SSL certificates)
// Note: This requires valid SSL certificate files

/*
const fs = require('fs');
const httpsServerOptions = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Secure Hello, World!');
});

httpsServer.listen(443, () => {
  console.log('HTTPS server running on port 443');
});
*/

// 4. Using https.get() - Convenience method for GET requests

https.get('https://jsonplaceholder.typicode.com/posts/1', (res) => {
  console.log(`GET Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log('GET Response:', data); });
}).on('error', (error) => {
  console.error('GET error:', error);
});

console.log('HTTPS module examples loaded.');
