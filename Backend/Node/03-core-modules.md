# Node.js — Core Modules

Built-in modules — no `npm install` needed. Import with `require()` or `import`.

---

## fs — File System

Read, write, delete files and directories.

```js
const fs = require("fs").promises; // promise-based (preferred)

// Read
const data = await fs.readFile("file.txt", "utf8");

// Write
await fs.writeFile("output.txt", "Hello Node.js");

// Append
await fs.appendFile("log.txt", "new line\n");

// Check exists
try {
  await fs.access("file.txt");
} catch { console.log("Not found"); }

// File info
const stats = await fs.stat("file.txt");
console.log(stats.size, stats.isFile(), stats.mtime);

// Directory
await fs.mkdir("newfolder", { recursive: true });
const files = await fs.readdir(".");

// Delete
await fs.unlink("file.txt");           // delete file
await fs.rm("folder", { recursive: true }); // delete folder

// Rename / move
await fs.rename("old.txt", "new.txt");
```

### Sync vs Async vs Stream

```js
// ❌ Sync — blocks event loop
const data = fs.readFileSync("file.txt");

// ✅ Async Promise
const data = await fs.promises.readFile("file.txt", "utf8");

// ✅ Stream — large files
fs.createReadStream("big.mp4").pipe(fs.createWriteStream("copy.mp4"));
```

---

## http / https — Web Server & Client

```js
const http = require("http");

// Create server
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello" }));
});
server.listen(3000);

// Make HTTP request
const req = http.get("http://api.example.com/users", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => console.log(JSON.parse(data)));
});
```

```js
// HTTPS — needs SSL certificates
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("private-key.pem"),
  cert: fs.readFileSync("certificate.pem"),
};
https.createServer(options, handler).listen(443);
```

> In practice use **Express/Nest** on top of http — don't write raw http servers.

---

## path — File Path Utilities

Cross-platform path handling (Windows `\` vs Linux `/`).

```js
const path = require("path");

path.join("users", "john", "file.txt");   // users/john/file.txt
path.resolve("./config", "app.json");      // absolute path
path.basename("/users/file.txt");          // file.txt
path.dirname("/users/file.txt");           // /users
path.extname("photo.jpg");                 // .jpg
path.parse("/users/file.txt");
// { root: '/', dir: '/users', base: 'file.txt', ext: '.txt', name: 'file' }

// Safe join — prevents path traversal
path.join(__dirname, "uploads", path.basename(userInput));
```

---

## os — Operating System Info

```js
const os = require("os");

os.platform();     // 'win32', 'linux', 'darwin'
os.arch();         // 'x64', 'arm64'
os.cpus();         // CPU info array
os.cpus().length;  // number of cores
os.totalmem();     // total RAM bytes
os.freemem();      // free RAM bytes
os.homedir();      // /home/user
os.hostname();     // machine name
os.uptime();       // seconds since boot
os.EOL;            // end of line character
```

---

## events — EventEmitter

Core of Node's event-driven architecture.

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {
  placeOrder(order) {
    this.emit("orderPlaced", order);
    this.emit("notifyAdmin", order);
  }
}

const orders = new OrderService();

orders.on("orderPlaced", (order) => console.log("Order:", order.id));
orders.once("notifyAdmin", (order) => console.log("Admin notified")); // runs once
orders.on("error", (err) => console.error(err)); // always handle error events

orders.placeOrder({ id: 1, item: "Laptop" });
```

Most Node objects inherit from EventEmitter: `http.Server`, `fs.ReadStream`, `net.Socket`.

---

## stream — Handle Data in Chunks

```js
const { Readable, Writable, Transform, pipeline } = require("stream");
const fs = require("fs");

// Pipe — connect readable → writable
fs.createReadStream("input.txt")
  .pipe(fs.createWriteStream("output.txt"));

// Transform stream — modify data while flowing
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
fs.createReadStream("input.txt")
  .pipe(upperCase)
  .pipe(fs.createWriteStream("uppercase.txt"));

// pipeline — with error handling
const { pipeline } = require("stream/promises");
await pipeline(
  fs.createReadStream("input.txt"),
  upperCase,
  fs.createWriteStream("output.txt"),
);
```

| Stream Type | Example |
| --- | --- |
| Readable | `fs.createReadStream`, HTTP request body |
| Writable | `fs.createWriteStream`, HTTP response |
| Duplex | TCP socket (read + write) |
| Transform | zlib compression, encryption |

---

## crypto — Hashing & Encryption

```js
const crypto = require("crypto");

// Hash (one-way)
crypto.createHash("sha256").update("password").digest("hex");

// HMAC (keyed hash)
crypto.createHmac("sha256", "secret-key").update("data").digest("hex");

// Random token
crypto.randomBytes(32).toString("hex");

// Encrypt / Decrypt (symmetric)
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update("secret message", "utf8", "hex");
encrypted += cipher.final("hex");

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
```

> For passwords use **bcrypt** — not plain SHA256.

---

## buffer — Binary Data

```js
const buf1 = Buffer.from("Hello");           // from string
const buf2 = Buffer.from([72, 101, 108]);   // from array
const buf3 = Buffer.alloc(10);               // 10 zero bytes
const buf4 = Buffer.allocUnsafe(10);           // faster, not zeroed

buf1.toString("utf8");    // "Hello"
buf1.toString("hex");     // "48656c6c6f"
buf1.length;              // 5 bytes

// Concatenate
Buffer.concat([buf1, buf2]);

// Compare
buf1.equals(buf2);        // false
```

---

## url — URL Parsing

```js
const url = require("url");

const parsed = new URL("https://api.example.com/users?page=1&limit=10#section");
parsed.protocol;  // 'https:'
parsed.hostname;  // 'api.example.com'
parsed.pathname;  // '/users'
parsed.search;    // '?page=1&limit=10'
parsed.hash;      // '#section'
parsed.searchParams.get("page");  // '1'

// Build URL
const myUrl = new URL("/users", "https://api.example.com");
myUrl.searchParams.set("page", "2");
myUrl.href; // https://api.example.com/users?page=2
```

---

## querystring — Parse Query Strings

```js
const qs = require("querystring");

qs.parse("name=John&age=30");       // { name: 'John', age: '30' }
qs.stringify({ name: "John", age: 30 }); // 'name=John&age=30'
```

> Prefer `URLSearchParams` (built into URL) in modern code.

---

## util — Utility Functions

```js
const util = require("util");
const fs = require("fs");

// Promisify callback functions
const readFile = util.promisify(fs.readFile);
const data = await readFile("file.txt", "utf8");

// Inspect objects (debugging)
util.inspect({ a: 1, b: [2, 3] }, { depth: null, colors: true });

// Type checking
util.types.isDate(new Date());     // true
util.types.isPromise(Promise.resolve()); // true

// Format strings
util.format("Hello %s, age %d", "John", 30); // 'Hello John, age 30'

// Deprecation warnings
util.deprecate(oldFn, "oldFn is deprecated, use newFn instead");
```

---

## net — TCP Server & Client

```js
const net = require("net");

// TCP Server
const server = net.createServer((socket) => {
  socket.write("Hello client\n");
  socket.on("data", (data) => socket.write(data)); // echo
  socket.on("end", () => socket.end());
});
server.listen(8000);

// TCP Client
const client = net.createConnection({ port: 8000 }, () => {
  client.write("Hello server");
});
client.on("data", (data) => console.log(data.toString()));
```

---

## dns — Domain Name Lookup

```js
const dns = require("dns").promises;

const addresses = await dns.lookup("google.com");     // { address, family }
const records = await dns.resolve("google.com", "A"); // IP addresses
const mx = await dns.resolve("gmail.com", "MX");      // mail servers
```

---

## readline — Read Input Line by Line

```js
const readline = require("readline");

// Interactive CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("What is your name? ", (answer) => {
  console.log(`Hello, ${answer}`);
  rl.close();
});

// Read file line by line (memory efficient)
const rl2 = readline.createInterface({
  input: fs.createReadStream("large-file.txt"),
});
rl2.on("line", (line) => console.log(line));
```

---

## zlib — Compression

```js
const zlib = require("zlib");
const fs = require("fs");

// Compress file
fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream("input.txt.gz"));

// Decompress
fs.createReadStream("input.txt.gz")
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream("output.txt"));

// Compress string
const compressed = zlib.gzipSync("Hello World");
const decompressed = zlib.gunzipSync(compressed).toString();
```

---

## child_process — Run External Commands

```js
const { exec, spawn, fork } = require("child_process");

// exec — run shell command, buffer output
exec("ls -la", (err, stdout, stderr) => {
  console.log(stdout);
});

// spawn — stream output (better for large output)
const ls = spawn("ls", ["-la"]);
ls.stdout.on("data", (data) => console.log(data.toString()));

// fork — spawn Node.js process with IPC
const child = fork("worker.js");
child.send({ task: "process-data" });
child.on("message", (result) => console.log(result));
```

---

## cluster — Multi-Process Scaling

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} — forking ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died — restarting`);
    cluster.fork();
  });
} else {
  require("./server.js"); // each worker runs the server
}
```

---

## worker_threads — Multi-Threading

For CPU-intensive tasks without blocking the main thread.

```js
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { num: 40 } });
  worker.on("message", (result) => console.log("Fibonacci:", result));
  worker.on("error", (err) => console.error(err));
} else {
  // CPU-heavy work in worker thread
  const fib = (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2);
  parentPort.postMessage(fib(workerData.num));
}
```

---

## process — Current Process

```js
process.env.NODE_ENV          // environment variables
process.env.PORT || 3000
process.argv                  // command line arguments
process.cwd()                 // current working directory
process.pid                   // process ID
process.exit(0)               // exit (0 = success, 1 = error)
process.on("SIGTERM", () => { // graceful shutdown
  server.close(() => process.exit(0));
});
process.memoryUsage()         // RAM usage
process.uptime()              // seconds running
```

---

## Module Quick Reference

| Module | Import | Purpose |
| --- | --- | --- |
| `fs` | `require("fs")` | File system |
| `http` | `require("http")` | HTTP server/client |
| `https` | `require("https")` | HTTPS server |
| `path` | `require("path")` | Path utilities |
| `os` | `require("os")` | OS information |
| `events` | `require("events")` | EventEmitter |
| `stream` | `require("stream")` | Streams |
| `crypto` | `require("crypto")` | Hashing/encryption |
| `buffer` | global | Binary data |
| `url` | `require("url")` | URL parsing |
| `util` | `require("util")` | Utilities |
| `net` | `require("net")` | TCP |
| `dns` | `require("dns")` | DNS lookup |
| `zlib` | `require("zlib")` | Compression |
| `cluster` | `require("cluster")` | Multi-process |
| `worker_threads` | `require("worker_threads")` | Multi-thread |
| `child_process` | `require("child_process")` | Spawn processes |
| `readline` | `require("readline")` | Line input |
| `process` | global | Current process |
