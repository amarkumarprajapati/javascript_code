// What is the TLS Module?
// The TLS module provides a secure transport layer on top of TCP using SSL/TLS protocols.
// It's used for creating secure servers and clients for encrypted communication.

const tls = require('tls');
const fs = require('fs');

// Note: This module requires SSL/TLS certificates to work properly
// The examples below show the API usage but won't run without valid certificates

// 1. Creating a TLS Server
// Create a secure server (requires certificate and key)

/*
const tlsOptions = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  ca: fs.readFileSync('ca-cert.pem'), // Optional: for client authentication
  requestCert: true, // Request client certificate
  rejectUnauthorized: true // Reject unauthorized clients
};

const tlsServer = tls.createServer(tlsOptions, (socket) => {
  console.log('Client connected');
  console.log('Authorized:', socket.authorized);
  console.log('Authorization error:', socket.authorizationError);

  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Echo: ' + data);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

tlsServer.listen(443, () => {
  console.log('TLS server listening on port 443');
});
*/

// 2. Creating a TLS Client
// Connect to a TLS server

/*
const tlsClient = tls.connect({
  host: 'example.com',
  port: 443,
  ca: fs.readFileSync('ca-cert.pem'), // Optional: to verify server
  rejectUnauthorized: true
}, () => {
  console.log('Connected to TLS server');
  console.log('Authorized:', tlsClient.authorized);
  tlsClient.write('Hello, secure server!');
});

tlsClient.on('data', (data) => {
  console.log('Received:', data.toString());
  tlsClient.end();
});

tlsClient.on('error', (err) => {
  console.error('TLS client error:', err);
});
*/

// 3. TLS Socket Events
// Handle various TLS socket events

/*
tlsServer.on('secureConnection', (socket) => {
  console.log('Secure connection established');
  console.log('Cipher:', socket.getCipher());
  console.log('Protocol:', socket.getProtocol());
  console.log('Peer certificate:', socket.getPeerCertificate());
});

tlsServer.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.destroy();
});

tlsServer.on('newSession', (sessionId, sessionData) => {
  console.log('New session established');
});

tlsServer.on('resumeSession', (sessionId, callback) => {
  console.log('Session resumed');
  callback(null, sessionData);
});
*/

// 4. Getting Certificate Information
// Access certificate details

/*
tlsServer.on('secureConnection', (socket) => {
  const cert = socket.getPeerCertificate();
  console.log('Subject:', cert.subject);
  console.log('Issuer:', cert.issuer);
  console.log('Valid from:', cert.valid_from);
  console.log('Valid to:', cert.valid_to);
  console.log('Fingerprint:', cert.fingerprint);
});
*/

// 5. Cipher Information
// Get encryption details

/*
tlsServer.on('secureConnection', (socket) => {
  const cipher = socket.getCipher();
  console.log('Cipher name:', cipher.name);
  console.log('Cipher version:', cipher.version);
  console.log('Standard name:', cipher.standardName);
});
*/

// 6. Session Resumption
// Enable session resumption for faster connections

/*
const sessionStore = {};

const tlsServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  sessionTimeout: 300 // 5 minutes
}, (socket) => {
  // ...
});

tlsServer.on('newSession', (sessionId, sessionData) => {
  sessionStore[sessionId.toString('hex')] = sessionData;
});

tlsServer.on('resumeSession', (sessionId, callback) => {
  const sessionData = sessionStore[sessionId.toString('hex')];
  callback(null, sessionData);
});
*/

// 7. ALPN (Application-Layer Protocol Negotiation)
// Negotiate application protocols

/*
const tlsServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  ALPNProtocols: ['http/1.1', 'h2']
}, (socket) => {
  console.log('Negotiated protocol:', socket.alpnProtocol);
});

const tlsClient = tls.connect({
  host: 'example.com',
  port: 443,
  ALPNProtocols: ['h2', 'http/1.1']
}, () => {
  console.log('Client negotiated protocol:', tlsClient.alpnProtocol);
});
*/

// 8. SNI (Server Name Indication)
// Handle multiple certificates based on server name

/*
const certs = {
  'example.com': {
    key: fs.readFileSync('example-key.pem'),
    cert: fs.readFileSync('example-cert.pem')
  },
  'test.com': {
    key: fs.readFileSync('test-key.pem'),
    cert: fs.readFileSync('test-cert.pem')
  }
};

const sniServer = tls.createServer({
  SNICallback: (servername, callback) => {
    const cert = certs[servername];
    if (cert) {
      callback(null, tls.createSecureContext(cert));
    } else {
      callback(new Error('No certificate for servername'));
    }
  }
}, (socket) => {
  // Handle connection
});
*/

// 9. TLS with Net Socket
// Wrap an existing TCP socket with TLS

/*
const net = require('net');

const tcpSocket = net.connect(443, 'example.com', () => {
  const tlsSocket = new tls.TLSSocket(tcpSocket, {
    rejectUnauthorized: true
  });

  tlsSocket.on('secureConnect', () => {
    console.log('TLS connection established');
    tlsSocket.write('GET / HTTP/1.1\r\nHost: example.com\r\n\r\n');
  });

  tlsSocket.on('data', (data) => {
    console.log(data.toString());
  });
});
*/

// 10. Practical Example: Secure Echo Server
// Echo server with TLS encryption

/*
const secureEchoServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
}, (socket) => {
  socket.on('data', (data) => {
    console.log('Secure echo:', data.toString());
    socket.write('Secure echo: ' + data);
  });
});

secureEchoServer.listen(8443, () => {
  console.log('Secure echo server on port 8443');
});
*/

// 11. Practical Example: Secure Chat Server
// Chat server with TLS

/*
const secureChatServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  requestCert: true,
  rejectUnauthorized: false
}, (socket) => {
  const clientId = socket.getPeerCertificate().subject.CN || 'anonymous';
  console.log(`${clientId} connected`);

  socket.on('data', (data) => {
    const message = `${clientId}: ${data}`;
    // Broadcast to all connected clients
    secureChatServer.clients.forEach((client) => {
      if (client !== socket) {
        client.write(message);
      }
    });
  });
});

secureChatServer.clients = [];
secureChatServer.on('secureConnection', (socket) => {
  secureChatServer.clients.push(socket);
});

secureChatServer.on('close', (socket) => {
  const index = secureChatServer.clients.indexOf(socket);
  if (index > -1) secureChatServer.clients.splice(index, 1);
});
*/

// 12. Creating Self-Signed Certificate
// Generate a self-signed certificate for testing (using child_process)

/*
const { execSync } = require('child_process');

function generateSelfSignedCert() {
  execSync('openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"');
  console.log('Self-signed certificate generated');
}

// generateSelfSignedCert();
*/

// 13. TLS Version Configuration
// Specify minimum TLS version

/*
const tlsServer = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  minVersion: 'TLSv1.2', // Minimum TLS version
  maxVersion: 'TLSv1.3'  // Maximum TLS version
}, (socket) => {
  console.log('TLS version:', socket.getProtocol());
});
*/

console.log('TLS module examples loaded (requires SSL certificates to run).');
