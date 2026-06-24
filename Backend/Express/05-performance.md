# Express Performance Optimization

Express is fast by default, but production apps need deliberate optimization at every layer.

---

## Performance Bottleneck Hierarchy

```
1. Database queries     ← usually the #1 bottleneck
2. External API calls
3. Synchronous/blocking code
4. Missing caching
5. No compression
6. Single process (no clustering)
7. Express itself       ← rarely the problem
```

---

## 1. Database Optimization (biggest impact)

### Index frequently queried fields
```js
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
```

### Select only needed fields
```js
// ❌ fetches everything including password
User.find();

// ✅
User.find().select("name email");
```

### Pagination — never return all records
```js
const page = +req.query.page || 1;
const limit = Math.min(+req.query.limit || 20, 100); // cap max
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### Avoid N+1 queries — use populate/join once
```js
// ❌ N+1 — 1 query for orders + N queries for each user
const orders = await Order.find();
for (const o of orders) o.user = await User.findById(o.userId);

// ✅
const orders = await Order.find().populate("userId", "name email");
```

### Connection pooling
Connect once at startup — ORM/driver pools connections automatically. Never `connect()` per request.

### Use lean queries (Mongoose) — skip hydration overhead
```js
const users = await User.find().lean(); // plain JS objects, faster for read-only
```

---

## 2. Caching

### In-memory cache (node-cache / lru-cache)
```js
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

app.get("/products", async (req, res) => {
  const cached = cache.get("products");
  if (cached) return res.json(cached);

  const products = await Product.find();
  cache.set("products", products);
  res.json(products);
});
```

### Redis cache (production — shared across servers)
```js
const redis = require("ioredis");
const client = new redis(process.env.REDIS_URL);

app.get("/products/:id", async (req, res) => {
  const key = `product:${req.params.id}`;
  const cached = await client.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const product = await Product.findById(req.params.id);
  await client.set(key, JSON.stringify(product), "EX", 300);
  res.json(product);
});
```

**Cache invalidation:** delete cache key on UPDATE/DELETE.
```js
await Product.findByIdAndUpdate(id, data);
await client.del(`product:${id}`);
```

---

## 3. Compression — Reduce Response Size

```bash
npm install compression
```

```js
const compression = require("compression");
app.use(compression()); // gzip/deflate responses automatically
```

Works best for JSON/HTML/text. Images/PDFs are already compressed — skip those.

---

## 4. Clustering — Use All CPU Cores

Node.js is single-threaded. **Cluster** forks workers — one per CPU core.

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const cores = os.cpus().length;
  console.log(`Primary ${process.pid} — forking ${cores} workers`);
  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork(); // auto-restart crashed workers
  });
} else {
  const app = require("./app");
  app.listen(3000, () => console.log(`Worker ${process.pid} on 3000`));
}
```

**Production alternative:** PM2 process manager — `pm2 start app.js -i max` (cluster mode built-in).

---

## 5. Avoid Blocking the Event Loop

```js
// ❌ BLOCKS all requests
const data = fs.readFileSync("./huge.json");
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");

// ✅ Non-blocking
const data = await fs.promises.readFile("./huge.json");
const hash = await util.promisify(crypto.pbkdf2)(password, salt, 100000, 64, "sha512");

// ✅ CPU-heavy work → worker_threads
const { Worker } = require("worker_threads");
```

**Rule:** never use `*Sync` methods in route handlers.

---

## 6. Async & Non-Blocking Route Handlers

```js
// ❌ callback hell + unhandled errors
app.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err);
    res.json(users);
  });
});

// ✅ async/await + error middleware
app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
}));
```

---

## 7. Rate Limiting — Protect from Abuse

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // 100 requests per IP
  message: { msg: "Too many requests" },
});

app.use("/api/", limiter);

// stricter on auth routes
app.use("/auth/login", rateLimit({ windowMs: 60_000, max: 5 }));
```

---

## 8. Body Parser Limits

```js
app.use(express.json({ limit: "10kb" })); // reject huge JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
```

---

## 9. Keep-Alive & HTTP/2

Use a reverse proxy (Nginx, Caddy) in front of Express:
- **Keep-alive** — reuse TCP connections
- **HTTP/2** — multiplexing
- **SSL termination** — proxy handles HTTPS
- **Static file serving** — Nginx serves static assets faster than Express

```
Client → Nginx (443, SSL, gzip, static) → Express (3000, API only)
```

---

## 10. Logging — Don't Log in Production Hot Path

```js
// dev
app.use(morgan("dev"));

// production — log to file/service, not console per request
app.use(morgan("combined", { stream: fs.createWriteStream("./access.log") }));
```

Avoid `console.log` in every request handler in production.

---

## 11. ETag & Conditional Requests

Express enables ETag by default. Clients send `If-None-Match` → server returns 304 Not Modified (no body sent).

```js
app.set("etag", "strong"); // default — keep it on
```

---

## 12. Lazy Loading & Code Splitting

For large apps, don't require everything at startup:
```js
// lazy load heavy modules only when route is hit
app.get("/reports", async (req, res) => {
  const { generateReport } = require("./services/report"); // loaded on first hit
  const pdf = await generateReport();
  res.send(pdf);
});
```

---

## 13. Monitoring & Profiling

```js
// measure slow routes
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    if (ms > 500) console.warn(`SLOW ${req.method} ${req.url} — ${ms}ms`);
  });
  next();
});
```

Tools: **PM2**, **New Relic**, **Datadog**, **clinic.js** (Node profiling).

---

## Performance Checklist

| Area | Action |
| --- | --- |
| Database | Indexes, pagination, lean queries, avoid N+1 |
| Caching | Redis for hot data, invalidate on write |
| Compression | `compression` middleware |
| Clustering | PM2 or cluster module — use all cores |
| Event loop | No sync I/O or CPU-heavy work in routes |
| Rate limiting | Protect auth + API endpoints |
| Body limits | Cap JSON/urlencoded size |
| Reverse proxy | Nginx in front for SSL, static, keep-alive |
| File handling | Streams for large files, not readFile |
| Logging | Structured logging, not console.log per request |
| Env | `NODE_ENV=production` — Express disables verbose errors |

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How improve Express performance? | Cache, compress, index DB, paginate, cluster, avoid blocking code |
| Biggest bottleneck? | Usually database queries, not Express itself |
| Why cluster/PM2? | Node is single-threaded; cluster uses all CPU cores |
| readFile vs stream? | Stream for large files — avoids memory bloat |
| What is caching strategy? | Read-through cache; invalidate on write; TTL for stale data |
| Why compression? | Smaller responses = faster transfer; gzip JSON/HTML |
| Why rate limiting? | Prevent abuse, brute force, DOS |
| Sync vs async in routes? | Always async — sync blocks entire event loop |
| Role of Nginx? | Reverse proxy — SSL, static files, load balance, keep-alive |
| How find slow endpoints? | Request timing middleware + APM tools (New Relic, Datadog) |
| What is lean() in Mongoose? | Returns plain objects — faster, no Mongoose document overhead |
| Connection pooling? | Reuse DB connections — don't open/close per request |

---

## Quick Revision

```
DB indexes + pagination     = biggest win
Redis cache                 = hot data, shared across instances
compression()               = smaller responses
cluster / PM2 -i max        = all CPU cores
no *Sync in routes          = don't block event loop
rate-limit                  = abuse protection
Nginx reverse proxy         = SSL + static + load balance
streams for big files       = memory efficient
lean() queries              = faster read-only Mongoose
```
