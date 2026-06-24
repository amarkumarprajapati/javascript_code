# Node.js — Event Loop, Async Patterns & Streams

---

## Event Loop — Complete Picture

Node.js is **single-threaded** for JavaScript but handles concurrency via the **event loop**.

```
┌─────────────────────────────────────────────────┐
│                   Call Stack                     │
│         (synchronous JS execution)               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                  Event Loop                      │
│  ┌─────────┐ ┌─────────┐ ┌──────┐ ┌───────────┐  │
│  │ timers  │→│ pending │→│ poll │→│   check   │  │
│  └─────────┘ └─────────┘ └──────┘ └───────────┘  │
│                              ↓                   │
│                      close callbacks             │
└──────────────────────┬──────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  nextTick Queue (highest)   │
        │  Promise Microtask Queue    │
        └─────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     libuv Thread Pool       │
        │  (file I/O, crypto, DNS)    │
        └─────────────────────────────┘
```

### Phases explained

| Phase | What runs |
| --- | --- |
| **timers** | `setTimeout`, `setInterval` callbacks whose delay expired |
| **pending** | Deferred I/O callbacks (TCP errors, etc.) |
| **idle/prepare** | Internal — ignore |
| **poll** | Fetch new I/O events; execute I/O callbacks; may block here |
| **check** | `setImmediate` callbacks |
| **close** | `socket.on('close', ...)` and similar |

---

## Execution Order Examples

### Example 1 — Basic order
```js
console.log("1 sync");

setTimeout(() => console.log("2 timeout"), 0);
setImmediate(() => console.log("3 immediate"));

process.nextTick(() => console.log("4 nextTick"));
Promise.resolve().then(() => console.log("5 promise"));

console.log("6 sync");

// Output: 1 → 6 → 4 → 5 → 2 → 3
```

### Example 2 — Inside I/O callback
```js
const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("1 readFile callback");

  setTimeout(() => console.log("2 timeout"), 0);
  setImmediate(() => console.log("3 immediate")); // always before timeout here

  process.nextTick(() => console.log("4 nextTick"));
  Promise.resolve().then(() => console.log("5 promise"));
});

// Output: 1 → 4 → 5 → 3 → 2
// setImmediate ALWAYS before setTimeout inside I/O callback
```

### Priority summary
```
1. Synchronous code (call stack)
2. process.nextTick (all queued)
3. Promise microtasks (.then, .catch, await)
4. Event loop phases (timers → pending → poll → check → close)
```

---

## Async Patterns in Node.js

### 1. Callbacks (oldest pattern)
```js
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```
**Problem:** Callback hell with nested async operations.

---

### 2. Promises
```js
const fs = require("fs").promises;

fs.readFile("file.txt", "utf8")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// Chain multiple async operations
fetchUser(id)
  .then((user) => fetchOrders(user.id))
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));
```

---

### 3. async/await (modern — preferred)
```js
async function getUserOrders(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

---

### 4. EventEmitter pattern
```js
const EventEmitter = require("events");
const emitter = new EventEmitter();

// Producer
function fetchData() {
  setTimeout(() => emitter.emit("data", { id: 1, value: 42 }), 1000);
}

// Consumer
emitter.on("data", (result) => console.log("Got:", result));
fetchData();
```

---

### 5. Streams pattern (for large/ch continuous data)
```js
const fs = require("fs");

fs.createReadStream("input.csv")
  .on("data", (row) => processRow(row))
  .on("end", () => console.log("Done"))
  .on("error", (err) => console.error(err));
```

---

## Callback Hell & Solutions

### Callback hell (bad)
```js
getUser(id, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getItems(orders[0].id, (err, items) => {
      getProduct(items[0].id, (err, product) => {
        console.log(product); // deeply nested!
      });
    });
  });
});
```

### Fixed with async/await (good)
```js
async function getProductDetails(id) {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  const items = await getItems(orders[0].id);
  const product = await getProduct(items[0].id);
  return product;
}
```

---

## Streams — Deep Dive

### Why streams?
- Process **large files** without loading into memory
- Handle **real-time data** (video, logs, uploads)
- **Backpressure** — slow consumer doesn't overwhelm memory

### Stream types

```js
const { Readable, Writable, Duplex, Transform } = require("stream");

// Readable — source of data
const readable = new Readable({
  read() {
    this.push("chunk1");
    this.push("chunk2");
    this.push(null); // signal end
  },
});

// Writable — destination
const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log("Writing:", chunk.toString());
    callback();
  },
});

readable.pipe(writable);
```

### Pipe and backpressure
```js
// pipe handles backpressure automatically
// if writable is slow, readable pauses until writable is ready
slowWritableStream.pipe(fastReadableStream); // safe

// Manual backpressure
readable.on("data", (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) readable.pause(); // backpressure — pause reading
});
writable.on("drain", () => readable.resume()); // resume when ready
```

### Practical examples

```js
// Copy large file
fs.createReadStream("video.mp4").pipe(fs.createWriteStream("copy.mp4"));

// Compress while copying
fs.createReadStream("log.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("log.txt.gz"));

// HTTP response streaming
app.get("/download", (req, res) => {
  const stream = fs.createReadStream("large-report.pdf");
  res.setHeader("Content-Type", "application/pdf");
  stream.pipe(res);
});

// Line-by-line CSV processing
const rl = readline.createInterface({
  input: fs.createReadStream("million-rows.csv"),
});
rl.on("line", (row) => processRow(row)); // one row at a time
```

---

## Error Handling in Async Code

```js
// Always handle errors in callbacks
fs.readFile("file.txt", (err, data) => {
  if (err) return handleError(err); // MUST check err first
});

// try/catch with async/await
async function loadConfig() {
  try {
    return await fs.promises.readFile("config.json", "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return defaultConfig();
    throw err;
  }
}

// Promise .catch()
fetchData().catch(console.error);

// Global handlers — prevent silent crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
```

---

## Timers Comparison

| API | Phase | Use |
| --- | --- | --- |
| `process.nextTick(fn)` | nextTick queue | Defer fn until call stack clears |
| `Promise.resolve().then(fn)` | microtask queue | Promise chains |
| `setImmediate(fn)` | check phase | Run after I/O events |
| `setTimeout(fn, 0)` | timers phase | Minimum 1ms delay |
| `setInterval(fn, ms)` | timers phase | Repeat every ms |

```js
// Defer without blocking
function processLargeArray(arr, cb) {
  let i = 0;
  function next() {
    if (i >= arr.length) return cb();
    arr[i++](); // process one item
    setImmediate(next); // yield to event loop
  }
  next();
}
```

---

## Blocking vs Non-Blocking — Rules

```js
// ❌ NEVER in server request handlers
fs.readFileSync("file.txt");
crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
while (true) {} // infinite loop
JSON.parse(hugeString); // very large sync parse

// ✅ ALWAYS in server request handlers
await fs.promises.readFile("file.txt");
await util.promisify(crypto.pbkdf2)(password, salt, 100000, 64, "sha512");
await processInWorker(hugeData); // worker_threads
stream.pipe(transform).pipe(response); // streams
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| Is Node single-threaded? | JS runs on one thread; I/O uses libuv thread pool |
| Event loop phases? | timers → pending → poll → check → close |
| nextTick vs Promise? | nextTick runs before Promise microtasks |
| setImmediate vs setTimeout(0)? | setImmediate in check phase; setTimeout in timers |
| Callback hell fix? | Promises + async/await |
| Why streams? | Process large data without loading all into memory |
| readFile vs createReadStream? | readFile = whole file in memory; stream = chunks |
| What is backpressure? | Mechanism to pause producer when consumer is slow |
| unhandledRejection? | Unhandled Promise rejection — always add .catch() or try/catch |
| Blocking code effect? | Freezes entire server — all requests wait |

---

## Quick Revision

```
Event Loop   = 6 phases, runs callbacks
nextTick     = highest priority (before promises)
Promises     = microtasks after nextTick
setImmediate = check phase (after poll/I/O)
Callbacks    = oldest async pattern
Promises     = .then/.catch chains
async/await  = modern, preferred
Streams      = chunks, backpressure, pipe
Blocking     = freezes server — avoid Sync methods
Backpressure = pause readable when writable is full
```
