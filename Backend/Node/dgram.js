// What is the Dgram Module?
// The dgram module provides an implementation of UDP datagram sockets.
// It's used for building applications that use the UDP protocol (connectionless, unreliable).

const dgram = require('dgram');

// 1. Creating a UDP Server
// Create a socket to receive UDP messages

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
  
  // Send response
  server.send('Echo: ' + msg, rinfo.port, rinfo.address);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(41234);

// 2. Creating a UDP Client
// Create a socket to send UDP messages

const client = dgram.createSocket('udp4');

const message = Buffer.from('Hello, UDP Server!');

client.send(message, 41234, '127.0.0.1', (err) => {
  if (err) {
    console.error('Client error:', err);
    client.close();
  } else {
    console.log('Message sent to server');
  }
});

client.on('message', (msg, rinfo) => {
  console.log(`Client received: ${msg} from ${rinfo.address}:${rinfo.port}`);
  client.close();
});

// 3. Socket Events
// Handle various socket events

server.on('error', (err) => {
  console.error('Server error:', err);
  server.close();
});

server.on('close', () => {
  console.log('Server socket closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
  client.close();
});

// 4. Socket Properties
// Access socket information

server.on('listening', () => {
  const address = server.address();
  console.log('Server address:', address.address);
  console.log('Server port:', address.port);
  console.log('Server family:', address.family); // 'IPv4' or 'IPv6'
});

// 5. Binding to Specific Address
// Bind to a specific interface

const specificServer = dgram.createSocket('udp4');

specificServer.bind({
  address: '127.0.0.1',
  port: 41235,
  exclusive: true
});

// 6. IPv6 Support
// Create IPv6 UDP socket

const ipv6Server = dgram.createSocket('udp6');

ipv6Server.on('message', (msg, rinfo) => {
  console.log(`IPv6 received: ${msg}`);
});

ipv6Server.bind(41236, '::1');

// 7. Broadcast
// Send messages to multiple recipients

const broadcastServer = dgram.createSocket('udp4');

broadcastServer.on('message', (msg, rinfo) => {
  console.log(`Broadcast received: ${msg}`);
});

broadcastServer.bind(41237, () => {
  broadcastServer.setBroadcast(true);
});

const broadcastClient = dgram.createSocket('udp4');

broadcastClient.bind(() => {
  broadcastClient.setBroadcast(true);
  const broadcastMsg = Buffer.from('Broadcast message');
  broadcastClient.send(broadcastMsg, 41237, '255.255.255.255');
});

// 8. Multicast
// Send messages to a multicast group

const multicastServer = dgram.createSocket('udp4');

multicastServer.on('message', (msg, rinfo) => {
  console.log(`Multicast received: ${msg}`);
});

multicastServer.bind(41238, () => {
  multicastServer.addMembership('224.0.0.100');
});

const multicastClient = dgram.createSocket('udp4');

const multicastMsg = Buffer.from('Multicast message');
multicastClient.send(multicastMsg, 41238, '224.0.0.100');

// 9. Socket Options
// Configure socket behavior

const optionsServer = dgram.createSocket({
  type: 'udp4',
  reuseAddr: true
});

optionsServer.on('message', (msg) => {
  console.log('Options server received:', msg.toString());
});

optionsServer.bind(41239);

// 10. Practical Example: Discovery Service
// Simple service discovery using UDP

const discoveryServer = dgram.createSocket('udp4');

const services = new Map();

discoveryServer.on('message', (msg, rinfo) => {
  const command = msg.toString();

  if (command === 'DISCOVER') {
    // Send list of services
    const response = JSON.stringify(Array.from(services.entries()));
    discoveryServer.send(response, rinfo.port, rinfo.address);
  } else if (command.startsWith('REGISTER:')) {
    // Register a service
    const serviceName = command.split(':')[1];
    services.set(serviceName, `${rinfo.address}:${rinfo.port}`);
    console.log(`Registered: ${serviceName} at ${rinfo.address}:${rinfo.port}`);
  }
});

discoveryServer.bind(41240, () => {
  console.log('Discovery service on port 41240');
});

// 11. Practical Example: Simple DNS-like Service
// Basic DNS resolution simulation

const dnsServer = dgram.createSocket('udp4');

const dnsRecords = {
  'example.com': '93.184.216.34',
  'google.com': '142.250.185.78',
  'localhost': '127.0.0.1'
};

dnsServer.on('message', (msg, rinfo) => {
  const domain = msg.toString();
  const ip = dnsRecords[domain] || 'NOT_FOUND';
  
  console.log(`DNS query: ${domain} -> ${ip}`);
  dnsServer.send(ip, rinfo.port, rinfo.address);
});

dnsServer.bind(41241, () => {
  console.log('DNS-like service on port 41241');
});

// 12. Practical Example: Heartbeat Monitor
// Monitor services with UDP heartbeats

const heartbeatServer = dgram.createSocket('udp4');

const monitoredServices = new Map();

heartbeatServer.on('message', (msg, rinfo) => {
  const serviceId = msg.toString();
  monitoredServices.set(serviceId, {
    address: rinfo.address,
    port: rinfo.port,
    lastSeen: Date.now()
  });
  console.log(`Heartbeat from ${serviceId} at ${rinfo.address}:${rinfo.port}`);
});

heartbeatServer.bind(41242, () => {
  console.log('Heartbeat monitor on port 41242');
  
  // Check for dead services every 5 seconds
  setInterval(() => {
    const now = Date.now();
    monitoredServices.forEach((service, id) => {
      if (now - service.lastSeen > 10000) {
        console.log(`Service ${id} may be down`);
      }
    });
  }, 5000);
});

// 13. Practical Example: UDP Chat
// Simple chat using UDP

const chatServer = dgram.createSocket('udp4');
const chatClients = new Set();

chatServer.on('message', (msg, rinfo) => {
  const clientKey = `${rinfo.address}:${rinfo.port}`;
  chatClients.add(clientKey);
  
  console.log(`Chat: ${msg.toString()} from ${clientKey}`);
  
  // Broadcast to all other clients
  chatClients.forEach((client) => {
    if (client !== clientKey) {
      const [address, port] = client.split(':');
      chatServer.send(msg, parseInt(port), address);
    }
  });
});

chatServer.bind(41243, () => {
  console.log('UDP chat on port 41243');
});

console.log('Dgram module examples loaded.');
