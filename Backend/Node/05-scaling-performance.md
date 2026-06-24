# Node.js — Scaling & Performance

---

## Performance Bottleneck Hierarchy

```
1. Blocking synchronous code     ← #1 killer in Node
2. Database queries              ← usually #2
3. No caching
4. Loading large files into memory
5. Not using cluster/workers
6. Memory leaks
7. Node itself                   ← rarely the bottleneck
```

---

## 1. Avoid Blocking the Event Loop

Node is single-threaded — **one blocking operation freezes all requests**.

```js
// ❌ BLOCKS entire server
app.get("/bad", (req, res) => {
  const data = fs.readFileSync("huge-file.json"); // all clients wait
  res.json(JSON.parse(data));
});

// ❌ CPU-intensive on main thread
app.get("/fib/:n", (req, res) => {
  const result = fibonacci(+req.params.n); // blocks for seconds
  res.json({ result });
});

// ✅ Non-blocking I/O
app.get("/good", async (req, res) => {
  const data = await fs.promises.readFile("file.json", "utf8");
  res.json(JSON.parse(data));
});

// ✅ CPU work in worker thread
app.get("/fib/:n", async (req, res) => {
  const result = await runInWorker("fibonacci", +req.params.n);
  res.json({ result });
});
```

**Rule:** Never use `*Sync` methods in request handlers.

---

## 2. Cluster Module — Use All CPU Cores

Node runs on one core by default. **Cluster** forks workers — one per CPU core.

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const cores = os.cpus().length;
  console.log(`Primary ${process.pid} — starting ${cores} workers`);

  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.process.pid} died (code ${code}) — restarting`);
    cluster.fork();
  });
} else {
  require("./app"); // each worker runs the server
  console.log(`Worker ${process.pid} started`);
}
```

**How it works:** OS load-balances incoming connections across workers. Each worker has its own event loop and memory.

---

## 3. PM2 — Production Process Manager

```bash
npm install -g pm2

pm2 start app.js              # start app
pm2 start app.js -i max       # cluster mode — all cores
pm2 start app.js -i 4         # 4 instances
pm2 list                      # running processes
pm2 logs                      # view logs
pm2 restart app               # zero-downtime restart
pm2 stop app
pm2 delete app
pm2 startup                   # auto-start on server reboot
pm2 save
```

`ecosystem.config.js`:
```js
module.exports = {
  apps: [{
    name: "api",
    script: "./app.js",
    instances: "max",
    exec_mode: "cluster",
    env: { NODE_ENV: "production", PORT: 3000 },
    max_memory_restart: "500M",
  }],
};
```

---

## 4. Worker Threads — CPU-Heavy Tasks

For computation that would block the event loop — image processing, PDF generation, encryption, parsing large JSON.

```js
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
  function runWorker(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: data });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
      });
    });
  }

  app.get("/hash", async (req, res) => {
    const result = await runWorker({ password: req.query.pwd });
    res.json({ hash: result });
  });
} else {
  const crypto = require("crypto");
  const hash = crypto.pbkdf2Sync(
    workerData.password, "salt", 100000, 64, "sha512"
  ).toString("hex");
  parentPort.postMessage(hash);
}
```

| cluster | worker_threads |
| --- | --- |
| Separate processes | Threads in same process |
| Scale HTTP server | Offload CPU work |
| Own memory each | Can share memory (SharedArrayBuffer) |
| Crash isolation | Lighter weight |

---

## 5. Caching

### In-memory cache
```js
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

async function getProducts() {
  const cached = cache.get("products");
  if (cached && Date.now() - cached.time < TTL) return cached.data;

  const data = await db.products.find();
  cache.set("products", { data, time: Date.now() });
  return data;
}

// Invalidate on write
async function updateProduct(id, data) {
  const product = await db.products.update(id, data);
  cache.delete("products");
  return product;
}
```

### Redis cache (production — shared across instances)
```js
const redis = require("ioredis");
const client = new redis(process.env.REDIS_URL);

async function getProduct(id) {
  const key = `product:${id}`;
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findById(id);
  await client.set(key, JSON.stringify(product), "EX", 300);
  return product;
}
```

---

## 6. Compression

Reduce response size — gzip/deflate JSON and HTML responses.

```js
const compression = require("compression");
app.use(compression()); // auto-compresses responses > 1KB
```

For static files, serve via Nginx with gzip enabled — faster than Node.

---

## 7. Use Streams for Large Data

```js
// ❌ Loads 500MB into memory
app.get("/export", async (req, res) => {
  const data = await fs.promises.readFile("huge-export.csv");
  res.send(data);
});

// ✅ Streams — constant memory usage
app.get("/export", (req, res) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=export.csv");
  db.createReadStream().pipe(res);
});
```

---

## 8. Database Optimization

```js
// Index frequently queried fields
userSchema.index({ email: 1 });

// Select only needed fields
User.find().select("name email");

// Pagination
User.find().skip((page - 1) * limit).limit(limit);

// Lean queries (Mongoose) — skip hydration
User.find().lean();

// Connection pooling — connect once at startup
mongoose.connect(URI, { maxPoolSize: 10 });
```

---

## 9. Memory Management

### Watch for memory leaks
```js
// ❌ Global array grows forever
const requests = [];
app.use((req, res, next) => {
  requests.push(req); // never cleared — memory leak!
  next();
});

// ❌ Event listeners not removed
emitter.on("data", handler); // add many without .off()

// ✅ Monitor memory
console.log(process.memoryUsage());
// { rss, heapTotal, heapUsed, external }

// ✅ Graceful shutdown
process.on("SIGTERM", async () => {
  server.close();
  await mongoose.connection.close();
  process.exit(0);
});
```

### NODE_OPTIONS for memory limit
```bash
node --max-old-space-size=4096 app.js  # 4GB heap limit
```

---

## 10. Nginx Reverse Proxy

Put Nginx in front of Node for production:

```
Client → Nginx (443, SSL, gzip, static files, load balance)
              → Node.js (3000, API only)
              → Node.js (3001, API instance 2)
```

```nginx
upstream node_app {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
}

server {
  listen 443 ssl;
  gzip on;

  location /static/ {
    root /var/www;
  }

  location / {
    proxy_pass http://node_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
  }
}
```

Benefits: SSL termination, static file serving, load balancing, keep-alive, rate limiting.

---

## 11. Environment & Production Settings

```bash
NODE_ENV=production   # disables verbose Express errors, enables optimizations
```

```js
// Disable x-powered-by header
app.disable("x-powered-by");

// Trust proxy (when behind Nginx)
app.set("trust proxy", 1);

// Body size limit
app.use(express.json({ limit: "10kb" }));

// Keep-alive
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
```

---

## 12. Monitoring & Profiling

```js
// Request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    if (ms > 500) console.warn(`SLOW ${req.method} ${req.url} — ${ms}ms`);
  });
  next();
});
```

Tools:
- **PM2** — process monitoring, auto-restart
- **clinic.js** — `clinic doctor`, `clinic flame` — profiling
- **New Relic / Datadog** — APM in production
- **`node --inspect`** — Chrome DevTools debugging

```bash
npm install -g clinic
clinic doctor -- node app.js
clinic flame -- node app.js
```

---

## 13. Job Queues for Heavy Work

Offload long-running tasks to background workers:

```bash
npm install bullmq ioredis
```

```js
const { Queue, Worker } = require("bullmq");

const emailQueue = new Queue("emails", { connection: { host: "localhost" } });

// API — add job, respond immediately
app.post("/send-email", async (req, res) => {
  await emailQueue.add("send", { to: req.body.email, subject: "Hello" });
  res.json({ msg: "Email queued" });
});

// Worker — process in background
const worker = new Worker("emails", async (job) => {
  await sendEmail(job.data.to, job.data.subject);
}, { connection: { host: "localhost" } });
```

---

## Performance Checklist

| Area | Action |
| --- | --- |
| Event loop | No `*Sync` in request handlers |
| CPU work | `worker_threads` or job queue |
| Multi-core | `cluster` or PM2 `-i max` |
| Large files | Streams, not readFile |
| Caching | Redis for hot data |
| Compression | `compression` middleware |
| Database | Indexes, pagination, lean queries, pooling |
| Memory | Watch leaks, set heap limit |
| Reverse proxy | Nginx for SSL, static, load balance |
| Monitoring | PM2, clinic.js, APM tools |
| Heavy jobs | BullMQ / Redis queue |
| Env | `NODE_ENV=production` |

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How scale Node.js? | cluster/PM2 for multi-core, worker_threads for CPU, Redis cache, Nginx |
| Why Node slow on CPU tasks? | Single JS thread — use worker_threads |
| cluster vs worker_threads? | cluster = processes for HTTP; workers = threads for CPU |
| What blocks event loop? | Sync I/O, CPU computation, infinite loops |
| How handle 10k concurrent connections? | Non-blocking I/O + event loop (Node's strength) |
| How use all CPU cores? | cluster module or PM2 `-i max` |
| Memory leak signs? | RSS grows over time, OOM crashes |
| Why Nginx in front? | SSL, static files, load balance, gzip |
| How profile Node app? | clinic.js, `--inspect`, APM tools |
| When use job queue? | Email, image processing, reports — anything slow |

---

## Quick Revision

```
Blocking code     = freezes all requests
cluster           = fork process per CPU core
PM2 -i max        = production cluster mode
worker_threads    = CPU-heavy in background thread
Streams           = constant memory for large data
Redis cache       = shared cache across instances
compression()     = smaller HTTP responses
Nginx             = reverse proxy + SSL + static
BullMQ            = background job queue
NODE_ENV=production = enable optimizations
clinic.js         = profile performance
max-old-space-size = control heap memory
```
