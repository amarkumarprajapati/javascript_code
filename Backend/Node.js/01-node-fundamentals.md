# Node.js Fundamentals

## What is Node.js?
A JavaScript runtime built on Chrome's **V8** engine, using an **event-driven, non-blocking I/O** model. Single-threaded for JS, but uses **libuv** + a thread pool for I/O.

## Why non-blocking?
Instead of waiting for I/O (file, DB, network), Node registers a callback and continues. When I/O finishes, the event loop runs the callback. → handles many concurrent connections with few threads.

## Event loop phases (Node-specific)
1. **timers** — `setTimeout`, `setInterval`
2. **pending callbacks** — some system ops
3. **poll** — retrieve I/O events, run their callbacks
4. **check** — `setImmediate`
5. **close** — close events (e.g., socket close)

Between phases, the **microtask queue** runs: `process.nextTick` first, then Promises.

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
// sync → nextTick → promise → timeout/immediate (order varies) 
```

## CommonJS vs ESM
```js
// CommonJS (default in Node)
const fs = require("fs");
module.exports = myFn;

// ESM (".mjs" or "type":"module")
import fs from "fs";
export default myFn;
```

## Core modules
- `fs` — file system, `http` — server, `path`, `os`, `events`, `stream`, `crypto`, `cluster`, `worker_threads`.

## Streams (handle large data in chunks)
- **Readable**, **Writable**, **Duplex**, **Transform**.
- Memory-efficient (don't load whole file).
```js
const fs = require("fs");
fs.createReadStream("big.txt")
  .pipe(fs.createWriteStream("copy.txt")); // pipe = backpressure-aware
```

## Buffers
Raw binary data (`Buffer.from("abc")`). Used in streams, file/network I/O.

## EventEmitter
Core of Node's event model.
```js
const EventEmitter = require("events");
const e = new EventEmitter();
e.on("ping", (x) => console.log("got", x));
e.emit("ping", 1);
```

## Scaling Node (single-threaded CPU limit)
- **cluster** — fork multiple processes (one per CPU core) sharing a port.
- **worker_threads** — for CPU-heavy tasks (parsing, image processing).
- Offload to queues (BullMQ + Redis) for heavy jobs.

## Blocking vs non-blocking
```js
const data = fs.readFileSync("f.txt");      // blocking (avoid in servers)
fs.readFile("f.txt", (err, data) => {});     // non-blocking
```

---

## Common interview questions
1. **Is Node single-threaded?** → JS is; I/O uses libuv thread pool + OS async.
2. **How does Node handle concurrency?** → event loop + callbacks, non-blocking I/O.
3. **setImmediate vs setTimeout(0)?** → different phases; inside I/O, setImmediate first.
4. **process.nextTick vs Promise?** → nextTick runs before promise microtasks.
5. **How to use multiple cores?** → cluster / worker_threads.
6. **Why streams?** → process large data without loading it all into memory.
