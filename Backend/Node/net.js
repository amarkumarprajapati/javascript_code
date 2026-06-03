// What is the Net Module?
// The net module provides an asynchronous network API for creating stream-based TCP or IPC servers and clients.
// It's used for building network applications and working with TCP sockets.

const net = require('net');

// 1. Creating a TCP Server
// Create a server that listens for TCP connections

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Echo: ' + data);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`TCP server listening on port ${PORT}`);
});

// 2. Creating a TCP Client
// Connect to a TCP server

const client = new net.Socket();

client.connect(PORT, '127.0.0.1', () => {
  console.log('Connected to server');
  client.write('Hello, Server!');
});

client.on('data', (data) => {
  console.log('Received from server:', data.toString());
  client.destroy(); // Close connection after receiving response
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});

// 3. Server Events
// Handle various server events

server.on('connection', (socket) => {
  console.log('New connection established');
  console.log('Remote address:', socket.remoteAddress);
  console.log('Remote port:', socket.remotePort);
});

server.on('close', () => {
  console.log('Server closed');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// 4. Socket Properties
// Access socket information

const infoServer = net.createServer((socket) => {
  console.log('Local address:', socket.localAddress);
  console.log('Local port:', socket.localPort);
  console.log('Remote address:', socket.remoteAddress);
  console.log('Remote port:', socket.remotePort);
  console.log('Bytes read:', socket.bytesRead);
  console.log('Bytes written:', socket.bytesWritten);
});

// 5. Socket Methods
// Control socket behavior

const methodServer = net.createServer((socket) => {
  // Set encoding
  socket.setEncoding('utf8');

  // Set timeout
  socket.setTimeout(30000);

  socket.on('timeout', () => {
    console.log('Socket timed out');
    socket.end();
  });

  // Pause/Resume data
  socket.pause();
  setTimeout(() => socket.resume(), 1000);

  // Write data
  socket.write('Welcome!\n');

  // End connection
  socket.end('Goodbye!\n');
});

// 6. Buffering Data
// Handle buffered data

const bufferServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('Buffer size:', socket.bufferSize);
  });
});

// 7. Allow Half-Open Connections
// Keep socket open for reading/writing separately

const halfOpenServer = net.createServer({ allowHalfOpen: true }, (socket) => {
  socket.on('end', () => {
    console.log('Client sent FIN, but we can still write');
    socket.write('Server still writing...\n');
    socket.end();
  });
});

// 8. IPC Server (Unix Domain Sockets)
// Create server for local IPC (Unix/Linux/Mac)

/*
const ipcServer = net.createServer((socket) => {
  console.log('IPC client connected');
  socket.on('data', (data) => {
    console.log('IPC data:', data.toString());
  });
});

ipcServer.listen('/tmp/mysocket', () => {
  console.log('IPC server listening');
});
*/

// 9. Check if Port is in Use
// Helper function to check if a port is available

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true));
        tester.close();
      })
      .listen(port);
  });
}

isPortAvailable(3000).then((available) => {
  console.log('Port 3000 available:', available);
});

// 10. Find Available Port
// Find an available port in a range

function findAvailablePort(startPort, endPort) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        tester.close();
        if (startPort < endPort) {
          resolve(findAvailablePort(startPort + 1, endPort));
        } else {
          reject(new Error('No available ports'));
        }
      } else {
        reject(err);
      }
    });

    tester.listen(startPort, () => {
      tester.close();
      resolve(startPort);
    });
  });
}

findAvailablePort(3000, 3010)
  .then((port) => console.log('Available port:', port))
  .catch((err) => console.error('Error:', err));

// 11. Practical Example: Echo Server
// A simple echo server

const echoServer = net.createServer((socket) => {
  socket.pipe(socket); // Echo everything back
});

echoServer.listen(3001, () => {
  console.log('Echo server on port 3001');
});

// 12. Practical Example: Chat Server
// Simple multi-client chat server

const chatServer = net.createServer();
const clients = [];

chatServer.on('connection', (socket) => {
  console.log('New chat client');
  clients.push(socket);

  socket.on('data', (data) => {
    const message = data.toString();
    console.log('Broadcasting:', message);

    // Broadcast to all other clients
    clients.forEach((client) => {
      if (client !== socket) {
        client.write(message);
      }
    });
  });

  socket.on('end', () => {
    console.log('Chat client disconnected');
    const index = clients.indexOf(socket);
    if (index > -1) clients.splice(index, 1);
  });
});

chatServer.listen(3002, () => {
  console.log('Chat server on port 3002');
});

// 13. Practical Example: HTTP-like Server
// Simple protocol server

const httpLikeServer = net.createServer((socket) => {
  let request = '';

  socket.on('data', (data) => {
    request += data.toString();

    if (request.includes('\r\n\r\n')) {
      const [header, body] = request.split('\r\n\r\n');
      const [method, path] = header.split(' ');

      console.log(`${method} ${path}`);

      socket.write('HTTP/1.1 200 OK\r\n');
      socket.write('Content-Type: text/plain\r\n');
      socket.write('\r\n');
      socket.write('Hello from custom server!\r\n');
      socket.end();
    }
  });
});

httpLikeServer.listen(3003, () => {
  console.log('HTTP-like server on port 3003');
});

console.log('Net module examples loaded.');
