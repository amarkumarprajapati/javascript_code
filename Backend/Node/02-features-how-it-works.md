# Node.js — Features & How It Works

---

## What is Node.js?

Node.js is a **JavaScript runtime** — not a framework, not a language. It executes JavaScript outside the browser using:
- **V8** — Google's JS engine (same as Chrome)
- **libuv** — C library for async I/O and event loop
- **Core modules** — fs, http, path, crypto, etc.

```js
// This runs on the server, not in a browser
const http = require("http");
http.createServer((req, res) => {
  res.end("Hello from Node.js");
}).listen(3000);
```

---

## Key Features

### 1. Non-Blocking I/O (Most Important Feature)

Node never waits for I/O to complete. It registers a callback and continues processing other work.

```js
// Non-blocking — server handles other requests while file reads
fs.readFile("data.txt", (err, data) => {
  console.log("File done");
});
console.log("Continuing immediately"); // prints first

// Blocking — AVOID in servers
const data = fs.readFileSync("data.txt"); // entire server frozen
```

**Why it matters:** One thread can handle **thousands of concurrent connections** — perfect for APIs, chat apps, streaming.

---

### 2. Event-Driven Architecture

Everything in Node is built around **events**. Objects emit events; you attach listeners.

```js
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("order", (order) => console.log("New order:", order.id));
emitter.emit("order", { id: 1, item: "Pizza" });
```

Core modules using EventEmitter: `http`, `fs`, `stream`, `net`, `process`.

---

### 3. Single-Threaded JavaScript

JavaScript runs on **one thread**. No race conditions, no locks in your JS code.

```
Main Thread (JavaScript)
  ├── Your code
  ├── Event loop
  └── Callbacks

libuv Thread Pool (4 threads default)
  ├── File I/O
  ├── DNS lookup
  └── Crypto operations
```

**Limitation:** CPU-heavy work (video encoding, ML) blocks the thread → use `worker_threads` or `cluster`.

---

### 4. Cross-Platform

Runs on Windows, macOS, Linux, Docker, cloud servers — same JavaScript code everywhere.

---

### 5. npm — Largest Package Ecosystem

1.5+ million packages. Install anything with one command.

```bash
npm install express mongoose dotenv bcrypt jsonwebtoken
```

---

### 6. JSON Native

JavaScript objects ↔ JSON naturally. Perfect for REST APIs.

```js
const user = { name: "John", age: 30 };
res.end(JSON.stringify(user)); // {"name":"John","age":30}
```

---

### 7. Real-Time Capabilities

Event-driven + WebSockets = real-time apps (chat, live dashboards, gaming).

```js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  ws.on("message", (msg) => wss.clients.forEach(c => c.send(msg)));
});
```

---

### 8. Microservices Friendly

Lightweight, fast startup, easy to containerize with Docker.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
```

---

### 9. Active Open Source Community

Maintained by OpenJS Foundation. Used by Netflix, LinkedIn, Uber, PayPal, NASA.

---

### 10. TypeScript Support

Full TypeScript support — type-safe Node.js development.

```bash
npm install -D typescript @types/node
npx tsc --init
```

---

## How Node.js Works — Architecture

```
┌─────────────────────────────────────────────┐
│                  Your JS Code                │
├─────────────────────────────────────────────┤
│              Node.js Bindings                │
├──────────────┬──────────────────────────────┤
│   V8 Engine  │           libuv               │
│  (run JS)    │  (event loop, async I/O,     │
│              │   thread pool, timers)        │
├──────────────┴──────────────────────────────┤
│         Operating System (Windows/Linux/Mac) │
└─────────────────────────────────────────────┘
```

### Step-by-step: HTTP Request

```
1. Client sends HTTP request to port 3000
2. OS notifies libuv (network I/O ready)
3. libuv adds callback to event loop poll queue
4. Event loop picks up callback
5. V8 runs your route handler function
6. Handler calls DB (async) → registers another callback
7. Event loop continues — handles other requests
8. DB responds → callback runs → response sent to client
```

---

## Event Loop — Deep Dive

```
   ┌───────────────────────────┐
   │        timers phase        │  setTimeout, setInterval
   ├───────────────────────────┤
   │    pending callbacks       │  deferred I/O callbacks
   ├───────────────────────────┤
   │    idle, prepare           │  internal
   ├───────────────────────────┤
   │         poll               │  fetch new I/O events ← most time spent here
   ├───────────────────────────┤
   │         check              │  setImmediate
   ├───────────────────────────┤
   │    close callbacks         │  socket.on('close')
   └───────────────────────────┘

   Between each phase:
   → process.nextTick queue (runs ALL nextTicks)
   → Promise microtask queue
```

```js
console.log("1 - sync");

setTimeout(() => console.log("2 - timeout"), 0);
setImmediate(() => console.log("3 - immediate"));

process.nextTick(() => console.log("4 - nextTick"));
Promise.resolve().then(() => console.log("5 - promise"));

console.log("6 - sync end");

// Output: 1 → 6 → 4 → 5 → 2 → 3
// (2 and 3 order can swap from main module)
```

### Priority order
```
Synchronous code
  ↓
process.nextTick (all of them)
  ↓
Promise microtasks (.then, await)
  ↓
Event loop phases (timers → poll → check → ...)
```

---

## Node.js vs Other Runtimes

| | Node.js | Deno | Bun |
| --- | --- | --- | --- |
| Engine | V8 | V8 | JavaScriptCore |
| Created by | Ryan Dahl (2009) | Ryan Dahl (2018) | Oven (2022) |
| Package manager | npm | URL imports | Built-in |
| TypeScript | Via setup | Native | Native |
| Security | Open | Secure by default | Open |
| Maturity | Most mature | Growing | New, fast |

---

## When to Use Node.js

| ✅ Good for | ❌ Not ideal for |
| --- | --- |
| REST/GraphQL APIs | CPU-intensive computation |
| Real-time apps (chat, gaming) | Heavy ML/data science |
| Microservices | Complex relational DB transactions |
| Streaming (video, logs) | Multi-threaded CPU parallelism |
| CLI tools | Desktop GUI apps |
| Serverless functions | |
| IoT backends | |

---

## Node.js + Frameworks Ecosystem

```
Node.js (runtime)
  ├── Express.js    — minimal web framework
  ├── NestJS        — structured TypeScript framework
  ├── Fastify       — high-performance web framework
  ├── Koa           — modern middleware framework
  ├── Hapi          — enterprise framework
  ├── Socket.io     — WebSockets
  ├── Electron      — desktop apps
  └── Next.js       — React SSR (uses Node server)
```

---

## Quick Revision

```
V8          = runs JavaScript
libuv       = async I/O + event loop
Event Loop  = 6 phases, non-blocking
nextTick    = highest priority async
Promises    = microtasks after nextTick
Single thread = JS only; I/O on thread pool
Non-blocking = register callback, move on
npm         = package ecosystem
JSON native = perfect for APIs
Real-time   = event-driven + WebSockets
cluster     = use all CPU cores
```
