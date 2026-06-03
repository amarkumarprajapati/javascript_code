// What is the Cluster Module?
// The cluster module allows you to create child processes (workers) that share the same server port.
// It enables Node.js to take advantage of multi-core systems by forking processes.

const cluster = require('cluster');
const http = require('http');
const os = require('os');

// 1. Basic Cluster Setup
// Master process forks workers

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker...');
    cluster.fork();
  });

} else {
  // Workers can share the same port
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}

// 2. Cluster Events
// Various events emitted by the cluster

if (cluster.isMaster) {
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} forked`);
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('listening', (worker, address) => {
    console.log(`Worker ${worker.process.pid} is listening on ${address.port}`);
  });

  cluster.on('disconnect', (worker) => {
    console.log(`Worker ${worker.process.pid} disconnected`);
  });
}

// 3. Worker Communication
// Send messages between master and workers

if (cluster.isMaster) {
  const worker = cluster.fork();

  worker.on('message', (msg) => {
    console.log('Master received:', msg);
  });

  setTimeout(() => {
    worker.send({ from: 'master', data: 'Hello worker!' });
  }, 1000);

} else {
  process.on('message', (msg) => {
    console.log('Worker received:', msg);
    process.send({ from: 'worker', data: 'Hello master!' });
  });
}

// 4. Manual Worker Management
// Create and manage workers manually

if (cluster.isMaster) {
  const workers = [];

  function spawnWorker() {
    const worker = cluster.fork();
    workers.push(worker);

    worker.on('exit', () => {
      console.log('Worker exited, removing from list');
      const index = workers.indexOf(worker);
      if (index > -1) workers.splice(index, 1);
    });
  }

  // Spawn 2 workers
  spawnWorker();
  spawnWorker();

  console.log('Active workers:', workers.length);

  // Disconnect all workers after 5 seconds
  setTimeout(() => {
    workers.forEach(worker => worker.disconnect());
  }, 5000);
}

// 5. Worker Disconnect and Reconnect
// Handle worker disconnection

if (cluster.isMaster) {
  const worker = cluster.fork();

  worker.on('disconnect', () => {
    console.log('Worker disconnected');
  });

  // Disconnect worker after 2 seconds
  setTimeout(() => {
    worker.disconnect();
  }, 2000);
}

// 6. Getting Worker Information
// Access worker properties

if (cluster.isMaster) {
  const worker = cluster.fork();

  console.log('Worker ID:', worker.id);
  console.log('Worker process:', worker.process);
  console.log('Worker is connected:', worker.isConnected());
  console.log('Worker is dead:', worker.isDead());

  worker.on('online', () => {
    console.log('Worker is now online');
  });
}

// 7. Setting Worker Environment
// Set environment variables for workers

if (cluster.isMaster) {
  cluster.setupMaster({
    exec: './worker.js',
    args: ['--custom-arg'],
    silent: false
  });

  const worker = cluster.fork();
  worker.process.env.WORKER_ID = 'custom-worker-1';
}

// 8. Scheduling Policy
// Set the scheduling policy (round-robin or share)

// cluster.schedulingPolicy = cluster.SCHED_RR; // Round-robin (default)
// cluster.schedulingPolicy = cluster.SCHED_NONE; // Leave to OS

// 9. Practical Example: Load Balanced Server
// A complete example of a load-balanced HTTP server

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}`);
    console.log('Restarting worker...');
    cluster.fork();
  });

} else {
  const server = http.createServer((req, res) => {
    const startTime = Date.now();

    // Simulate some work
    setTimeout(() => {
      const duration = Date.now() - startTime;
      res.writeHead(200);
      res.end(`Worker ${process.pid} - Request processed in ${duration}ms\n`);
    }, Math.random() * 100);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}

// 10. Graceful Shutdown
// Handle graceful shutdown of all workers

if (cluster.isMaster) {
  const workers = [];

  for (let i = 0; i < 2; i++) {
    workers.push(cluster.fork());
  }

  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down workers...');

    workers.forEach(worker => {
      worker.send('shutdown');
      worker.disconnect();
    });

    setTimeout(() => {
      process.exit(0);
    }, 5000);
  });

} else {
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log(`Worker ${process.pid} shutting down gracefully`);
      // Close connections, cleanup, etc.
    }
  });
}

console.log('Cluster module examples loaded.');
