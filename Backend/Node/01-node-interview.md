# Node.js — Interview Questions & Answers

---

## Basic Questions

### 1. What is Node.js?

**Answer:** Node.js is an open-source **JavaScript runtime** built on Chrome's **V8 engine**. It lets you run JavaScript on the server (outside the browser). Uses an **event-driven, non-blocking I/O** model — ideal for I/O-heavy apps like APIs, real-time apps, and microservices.

```js
console.log("Node.js running JavaScript on the server");
```

---

### 2. What is the difference between Node.js and JavaScript?

**Answer:**

| | JavaScript | Node.js |
| --- | --- | --- |
| What | Programming language | Runtime environment |
| Runs in | Browser (mainly) | Server (V8 + libuv) |
| APIs | DOM, window, fetch | fs, http, path, crypto |
| Engine | V8, SpiderMonkey, etc. | V8 only |
| Purpose | Client-side interactivity | Server-side, CLI, tools |

JavaScript is the language. Node.js is the environment that executes it on the server.

---

### 3. What is the difference between Node.js and Express?

**Answer:**

| Node.js | Express |
| --- | --- |
| **Runtime** — executes JS | **Framework** — built on Node |
| Provides core modules (http, fs) | Provides routing, middleware |
| Low-level | High-level |
| Can build servers with `http` module | Simplifies web development |

Express sits **on top of** Node.js.

---

### 4. What is the difference between Node.js and Angular?

**Answer:**

| Node.js | Angular |
| --- | --- |
| Server-side runtime | Frontend framework |
| Runs on server | Runs in browser |
| JavaScript/C++ (V8) | TypeScript |
| APIs, file I/O, databases | UI components, templates |
| Used with Express/Nest | Used for SPAs |

---

### 5. Briefly explain how Node.js works.

**Answer:**

1. JavaScript code runs on the **V8 engine** (compiles JS to machine code)
2. **libuv** handles async I/O (file, network, DNS) using a thread pool + OS async APIs
3. **Event loop** picks up completed I/O callbacks and runs them
4. Single JS thread — never blocks on I/O; registers callback and moves on
5. When I/O completes, callback runs on the main thread

```
Your Code → V8 → libuv (async I/O) → Event Loop → Callback executed
```

---

### 6. Where is Node.js used?

**Answer:**
- REST APIs and backend services
- Real-time apps (chat, gaming, live updates)
- Microservices
- CLI tools (npm, webpack, eslint)
- Serverless functions (AWS Lambda)
- Streaming applications
- IoT backends
- DevOps tooling

---

### 7. Why is Node.js single-threaded?

**Answer:** Node uses a **single JavaScript thread** for simplicity and to avoid complexity of multi-threaded programming (locks, race conditions). Instead of creating a thread per request, it uses **non-blocking I/O + event loop** — one thread handles thousands of concurrent connections efficiently.

**Important:** JS is single-threaded, but I/O runs on **libuv's thread pool** (default 4 threads) and OS async mechanisms. CPU-heavy work blocks the thread — use `worker_threads` or `cluster` for that.

---

### 8. Why is Node.js so popular?

**Answer:**
- **One language** — JavaScript on frontend and backend
- **Non-blocking I/O** — handles many concurrent connections
- **Fast** — V8 engine, event-driven model
- **npm** — largest package ecosystem
- **JSON native** — perfect for REST APIs
- **Real-time** — WebSockets, event-driven architecture
- **Active community** — huge tooling support

---

### 9. What are synchronous vs asynchronous functions in Node.js?

**Answer:**

| Synchronous | Asynchronous |
| --- | --- |
| Blocks until complete | Returns immediately, callback/Promise later |
| `readFileSync()` | `readFile()` / `fs.promises.readFile()` |
| Simple but blocks event loop | Non-blocking — preferred in servers |
| Use in scripts/startup only | Use in all server request handlers |

```js
// Sync — BLOCKS (avoid in servers)
const data = fs.readFileSync("file.txt", "utf8");

// Async callback
fs.readFile("file.txt", "utf8", (err, data) => { ... });

// Async Promise (preferred)
const data = await fs.promises.readFile("file.txt", "utf8");
```

---

### 10. What are the disadvantages of Node.js?

**Answer:**
- **CPU-intensive tasks** block the single thread (image processing, heavy computation)
- **Callback hell** (mitigated by Promises/async-await)
- **Not ideal for heavy relational DB** workloads (though workable)
- **Unstable APIs** — some core APIs still change
- **No strong typing** without TypeScript
- Single-threaded model requires cluster/workers for multi-core CPU usage

---

## Event Loop Questions

### 11. What is the event loop in Node.js?

**Answer:** The event loop is the mechanism that lets Node perform **non-blocking I/O** despite JavaScript being single-threaded. It continuously checks for completed async operations and runs their callbacks.

**Phases (in order):**
1. **timers** — `setTimeout`, `setInterval` callbacks
2. **pending callbacks** — deferred I/O callbacks
3. **idle, prepare** — internal use
4. **poll** — fetch new I/O events, execute I/O callbacks
5. **check** — `setImmediate` callbacks
6. **close callbacks** — e.g. `socket.on('close')`

**Between each phase:** microtask queue runs — `process.nextTick` first, then Promise callbacks.

```js
console.log("1 sync");
setTimeout(() => console.log("2 timeout"), 0);
setImmediate(() => console.log("3 immediate"));
process.nextTick(() => console.log("4 nextTick"));
Promise.resolve().then(() => console.log("5 promise"));
// 1 → 4 → 5 → 2 → 3 (timeout vs immediate order can vary)
```

---

### 12. What is the difference between `process.nextTick()` and `setImmediate()`?

**Answer:**

| | `process.nextTick()` | `setImmediate()` |
| --- | --- | --- |
| Queue | nextTick queue (highest priority) | check phase of event loop |
| Runs | Before event loop continues | After poll phase |
| Use | defer execution, error handling | defer to next event loop iteration |

```js
process.nextTick(() => console.log("nextTick"));  // runs first
setImmediate(() => console.log("immediate"));      // runs after I/O
```

**vs Promises:** `nextTick` runs before Promise microtasks.

---

### 13. What is the difference between `setImmediate()` and `setTimeout(0)`?

**Answer:**
- `setTimeout(fn, 0)` — timers phase (minimum 1ms delay in Node)
- `setImmediate(fn)` — check phase, runs after poll

Inside an I/O callback, `setImmediate` runs **before** `setTimeout(0)`.
From the main module, order is **non-deterministic** (depends on event loop state).

---

### 14. What is event-driven programming in Node.js?

**Answer:** Program flow is determined by **events** — when something happens (file read complete, HTTP request received), a callback/listener runs. Node's core is built on this pattern via **EventEmitter**.

```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("data", (chunk) => console.log("Received:", chunk));
emitter.emit("data", "hello");
```

Most Node core modules (http, fs, stream) extend EventEmitter.

---

## Modules & Package Questions

### 15. What is the difference between CommonJS and ES Modules?

**Answer:**

```js
// CommonJS (default in Node)
const fs = require("fs");
module.exports = { myFn };
exports.myFn = myFn;

// ES Modules ("type": "module" in package.json or .mjs file)
import fs from "fs";
export default myFn;
export { myFn };
```

| CommonJS | ESM |
| --- | --- |
| `require()` / `module.exports` | `import` / `export` |
| Synchronous loading | Asynchronous loading |
| Default in Node | `"type": "module"` in package.json |

---

### 16. What is `module.exports`?

**Answer:** Used in CommonJS to **export** functions, objects, or classes from a file so other files can `require()` them.

```js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require("./math");
console.log(add(2, 3)); // 5
```

---

### 17. What is `package.json`?

**Answer:** Manifest file for a Node.js project containing:
- Project metadata (name, version, description)
- **Dependencies** (`dependencies`, `devDependencies`)
- Scripts (`"start": "node app.js"`, `"dev": "nodemon app.js"`)
- Entry point (`"main": "index.js"`)
- Module type (`"type": "module"` for ESM)

```bash
npm init -y          # create package.json
npm install express  # adds to dependencies
npm run start        # runs script
```

---

### 18. What is npm?

**Answer:** **Node Package Manager** — default package manager for Node.js. Installs, manages, and publishes JavaScript packages from the npm registry (largest software registry in the world).

```bash
npm install lodash        # install package
npm install -g nodemon  # global install
npm uninstall lodash
npm list                  # list installed packages
npx create-react-app app  # run without installing globally
```

---

### 19. What is the difference between `dependencies` and `devDependencies`?

**Answer:**

| dependencies | devDependencies |
| --- | --- |
| Needed at **runtime** in production | Needed only during **development** |
| express, mongoose, bcrypt | jest, nodemon, eslint, typescript |
| `npm install express` | `npm install -D jest` |

---

### 20. What is `node_modules`?

**Answer:** Folder where npm installs all packages (and their dependencies). Auto-generated — never commit to git. Recreated with `npm install` from `package.json`.

---

## Streams & Buffers

### 21. What are streams in Node.js?

**Answer:** Streams handle **data in chunks** instead of loading everything into memory. Essential for large files, video, real-time data.

**Types:**
| Type | Direction | Example |
| --- | --- | --- |
| **Readable** | Read | `fs.createReadStream()` |
| **Writable** | Write | `fs.createWriteStream()` |
| **Duplex** | Both | TCP socket |
| **Transform** | Read + modify + write | zlib compression |

```js
fs.createReadStream("large-video.mp4")
  .pipe(fs.createWriteStream("copy.mp4"));
// processes chunk by chunk — low memory usage
```

---

### 22. What is the difference between `readFile` and `createReadStream`?

**Answer:**

| | `fs.readFile` | `fs.createReadStream` |
| --- | --- | --- |
| Memory | Loads **entire file** into memory | Reads in **chunks** (default 64KB) |
| Best for | Small files (< few MB) | Large files, videos, CSV exports |
| Blocking risk | High for big files | Low — memory efficient |
| Backpressure | No | Yes — via `.pipe()` |

```js
// Small file — ok
const data = await fs.promises.readFile("config.json", "utf8");

// Large file — use stream
const stream = fs.createReadStream("big-data.csv");
stream.on("data", (chunk) => processChunk(chunk));
```

---

### 23. What is a Buffer in Node.js?

**Answer:** A **Buffer** is a fixed-size chunk of raw memory outside the V8 heap — used to handle binary data (files, network packets, images).

```js
const buf = Buffer.from("Hello");
console.log(buf);           // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString()); // "Hello"

const buf2 = Buffer.alloc(10); // 10 bytes, zero-filled
```

Used internally by streams, crypto, and file I/O. Global class — no need to import.

---

## Core Modules Questions

### 24. What are the core modules in Node.js?

**Answer:** Built-in modules — no `npm install` needed:

| Module | Purpose |
| --- | --- |
| `fs` | File system read/write |
| `http` / `https` | HTTP server and client |
| `path` | File path utilities |
| `os` | Operating system info |
| `events` | EventEmitter |
| `stream` | Stream base classes |
| `crypto` | Hashing, encryption |
| `buffer` | Binary data |
| `url` | URL parsing |
| `querystring` | Query string parsing |
| `util` | Utility functions |
| `cluster` | Multi-process scaling |
| `worker_threads` | Multi-threading |
| `child_process` | Spawn child processes |
| `zlib` | Compression |
| `net` | TCP server/client |
| `dns` | DNS lookup |
| `readline` | Read input line by line |

```js
const fs = require("fs");
const http = require("http");
const path = require("path");
```

---

### 25. What is the `crypto` module used for?

**Answer:** Cryptographic functionality — hashing, encryption, decryption, signing.

```js
const crypto = require("crypto");

// Hash password
const hash = crypto.createHash("sha256").update("password").digest("hex");

// Random bytes (tokens, secrets)
const token = crypto.randomBytes(32).toString("hex");

// HMAC
const hmac = crypto.createHmac("sha256", "secret").update("data").digest("hex");
```

For passwords in apps, use **bcrypt** or **argon2** (not plain SHA).

---

### 26. What is the `path` module used for?

**Answer:** Utilities for file and directory paths — cross-platform (handles `/` vs `\`).

```js
const path = require("path");

path.join("folder", "sub", "file.txt");  // folder/sub/file.txt
path.resolve("file.txt");                 // absolute path
path.extname("photo.jpg");               // .jpg
path.basename("/users/file.txt");        // file.txt
path.dirname("/users/file.txt");         // /users
```

---

### 27. What is REPL in Node.js?

**Answer:** **Read-Eval-Print-Loop** — interactive shell to test JavaScript code directly.

```bash
node          # start REPL
> 2 + 2
4
> const fs = require("fs")
> .help        # show commands
> .exit        # quit
```

---

## Process & Scaling Questions

### 28. What is libuv?

**Answer:** **libuv** is the C library that Node.js uses for async I/O. It provides:
- Event loop implementation
- Thread pool for file I/O, DNS, crypto
- Async TCP/UDP sockets
- File system events
- Child process management

Node.js = V8 (runs JS) + libuv (handles async I/O).

---

### 29. How does Node.js handle concurrency?

**Answer:** Through the **event loop + non-blocking I/O** — not multi-threading for JS.

- One JS thread handles all callbacks
- Thousands of concurrent connections via async I/O
- libuv thread pool (4 threads default) for blocking OS calls
- For CPU work: `cluster` module or `worker_threads`

```
1000 clients → 1 JS thread → event loop schedules I/O → callbacks when ready
```

---

### 30. What is the `cluster` module?

**Answer:** Creates **child processes** (workers) that share the same server port — uses all CPU cores.

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
  cluster.on("exit", (worker) => cluster.fork()); // restart crashed workers
} else {
  require("./app.js"); // each worker runs the server
}
```

**Production alternative:** PM2 — `pm2 start app.js -i max`

---

### 31. What is the difference between `cluster` and `worker_threads`?

**Answer:**

| cluster | worker_threads |
| --- | --- |
| Separate **processes** | Separate **threads** within same process |
| Full isolation | Shared memory possible |
| Best for scaling HTTP servers | Best for CPU-heavy tasks |
| Own V8 instance each | Lighter weight |
| Crash of one doesn't affect others easily | Shared memory risks |

```js
// worker_threads — CPU-heavy task
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  new Worker(__filename);
} else {
  // heavy computation here
  parentPort.postMessage(result);
}
```

---

### 32. What is the difference between `spawn` and `fork` in child_process?

**Answer:**

| spawn | fork |
| --- | --- |
| Spawns any system command | Spawns a Node.js process |
| No IPC channel by default | Built-in IPC message channel |
| `spawn('ls', ['-la'])` | `fork('child.js')` |
| General purpose | Node-to-Node communication |

```js
const { spawn, fork } = require("child_process");

spawn("ls", ["-la"]);           // system command
const child = fork("worker.js"); // node process with messaging
child.send({ task: "process" });
child.on("message", (result) => console.log(result));
```

---

## Error Handling & Security

### 33. How do you handle errors in Node.js?

**Answer:**

```js
// Callback style — always check err first
fs.readFile("file.txt", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise/async-await
try {
  const data = await fs.promises.readFile("file.txt", "utf8");
} catch (err) {
  console.error(err.message);
}

// Unhandled rejection — always handle
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Uncaught exception
process.on("uncaughtException", (err) => {
  console.error("Uncaught:", err);
  process.exit(1);
});
```

---

### 34. What are global objects in Node.js?

**Answer:** Objects available **everywhere** without importing:

| Global | Purpose |
| --- | --- |
| `global` | Global namespace (like `window` in browser) |
| `process` | Current process info, env vars, exit |
| `console` | Logging |
| `Buffer` | Binary data |
| `__dirname` | Current directory path (CommonJS) |
| `__filename` | Current file path (CommonJS) |
| `setTimeout/setInterval` | Timers |
| `setImmediate` | Defer to next event loop |
| `module`, `require`, `exports` | CommonJS module system |

```js
process.env.NODE_ENV
process.exit(0)
console.log(__dirname)
```

---

### 35. How do you secure a Node.js application?

**Answer:**
- Validate all input (Joi, Zod)
- Use **helmet** for HTTP headers
- Hash passwords with **bcrypt/argon2**
- Never commit secrets — use `.env`
- Keep dependencies updated (`npm audit`)
- Rate limiting on APIs
- HTTPS in production
- Sanitize DB queries (prevent injection)
- Use `crypto.randomBytes()` for tokens

---

## Quick Revision

```
Node.js      = JS runtime on V8 + libuv
Event Loop   = non-blocking I/O mechanism
Single-thread = JS thread; I/O on libuv thread pool
nextTick     = highest priority microtask
setImmediate = check phase (after poll)
CommonJS     = require / module.exports
ESM          = import / export
Stream       = process data in chunks
Buffer       = raw binary data
cluster      = multi-process (scale HTTP)
worker_threads = multi-thread (CPU tasks)
readFile     = load entire file (small files)
createReadStream = chunks (large files)
npm          = package manager
package.json = project manifest
libuv        = async I/O library
EventEmitter = event-driven pattern
```
