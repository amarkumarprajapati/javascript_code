# File Handling in Express — Read, Write, Upload & Download

Express doesn't handle files natively. You use **Node.js `fs` module**, **`multer`** for uploads, and **`express.static`** for serving.

---

## 1. Serving Static Files (read from disk → client)

Files in a folder are served directly — no route handler needed per file.

```js
app.use(express.static("public"));
// public/style.css  →  GET /style.css
// public/images/logo.png  →  GET /images/logo.png
```

```js
// serve from multiple folders
app.use("/static", express.static("public"));
app.use("/uploads", express.static("uploads"));
// GET /uploads/photo.jpg → uploads/photo.jpg
```

### Send a specific file
```js
const path = require("path");

app.get("/report", (req, res) => {
  res.sendFile(path.join(__dirname, "files", "report.pdf"));
});

app.get("/download", (req, res) => {
  res.download(path.join(__dirname, "files", "report.pdf"), "my-report.pdf");
  // sets Content-Disposition: attachment → browser downloads
});
```

---

## 2. Reading Files with `fs` (Node.js)

### Read entire file (small files)
```js
const fs = require("fs").promises; // promise-based (preferred)

app.get("/read-config", async (req, res, next) => {
  try {
    const data = await fs.readFile("./config/settings.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    if (err.code === "ENOENT") return res.status(404).json({ msg: "File not found" });
    next(err);
  }
});
```

### Sync vs Async — never block the event loop in Express
```js
// ❌ BAD in route handler — blocks all requests
const data = fs.readFileSync("./big-file.txt", "utf8");

// ✅ GOOD — non-blocking
const data = await fs.readFile("./big-file.txt", "utf8");
```

### Check if file exists
```js
const fs = require("fs").promises;

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
```

### Get file info (size, modified date)
```js
const stats = await fs.stat("./uploads/photo.jpg");
// stats.size, stats.mtime, stats.isFile(), stats.isDirectory()
```

---

## 3. Streams — Large Files (memory efficient)

**Don't load huge files into memory.** Use streams — data flows in chunks.

```js
const fs = require("fs");
const path = require("path");

// Read large file as stream → pipe to response
app.get("/video", (req, res) => {
  const filePath = path.join(__dirname, "videos", "demo.mp4");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // partial content — video seeking
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": fileSize, "Content-Type": "video/mp4" });
    fs.createReadStream(filePath).pipe(res);
  }
});
```

### readFile vs createReadStream

| | `fs.readFile` | `fs.createReadStream` |
| --- | --- | --- |
| Memory | Loads entire file | Reads in chunks |
| Best for | Small files (< few MB) | Large files, videos, CSV exports |
| Backpressure | N/A | Handles automatically with `.pipe()` |

### Write with streams
```js
const readStream = fs.createReadStream("./input.csv");
const writeStream = fs.createWriteStream("./output.csv");
readStream.pipe(writeStream);
```

---

## 4. File Upload with Multer

`express.json()` only parses JSON — **not multipart/form-data** (file uploads). Use **multer**.

```bash
npm install multer
```

### Single file upload
```js
const multer = require("multer");
const path = require("path");

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error("Only images and PDF allowed"), ext && mime);
  },
});

app.post("/upload", upload.single("avatar"), (req, res) => {
  // req.file  → { fieldname, originalname, filename, path, size, mimetype }
  if (!req.file) return res.status(400).json({ msg: "No file" });
  res.json({ filename: req.file.filename, path: req.file.path });
});
```

**Client form:** `<input type="file" name="avatar">` with `enctype="multipart/form-data"`

### Multiple files
```js
app.post("/upload-many", upload.array("photos", 5), (req, res) => {
  // req.files → array of file objects (max 5)
  res.json({ count: req.files.length, files: req.files.map(f => f.filename) });
});
```

### Mixed fields (text + file)
```js
app.post("/profile", upload.single("avatar"), (req, res) => {
  // req.body.name  → text field
  // req.file       → uploaded file
  res.json({ name: req.body.name, avatar: req.file?.filename });
});
```

### Memory storage (for cloud upload — S3, Cloudinary)
```js
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  // req.file.buffer → file contents in memory (don't use for large files)
  await uploadToS3(req.file.buffer, req.file.originalname);
  res.json({ msg: "Uploaded to cloud" });
});
```

---

## 5. Writing Files from Express

```js
const fs = require("fs").promises;

// write JSON log
app.post("/logs", async (req, res, next) => {
  try {
    const log = JSON.stringify({ ...req.body, time: new Date() }) + "\n";
    await fs.appendFile("./logs/app.log", log); // append — don't overwrite
    res.status(201).json({ msg: "Logged" });
  } catch (err) { next(err); }
});

// generate and send CSV on the fly
app.get("/export/users", async (req, res) => {
  const users = await User.find();
  const csv = users.map(u => `${u.id},${u.name},${u.email}`).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.send(csv);
});
```

---

## 6. Delete Files

```js
const fs = require("fs").promises;

app.delete("/files/:filename", async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.params.filename);
    await fs.unlink(filePath);
    res.status(204).send();
  } catch (err) {
    if (err.code === "ENOENT") return res.status(404).json({ msg: "Not found" });
    next(err);
  }
});
```

---

## 7. Common Flow — Upload → Store path in DB → Serve

```js
// 1. Upload file
app.post("/products", upload.single("image"), async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    imageUrl: `/uploads/${req.file.filename}`, // store path, not file itself
  });
  res.status(201).json(product);
});

// 2. Serve uploaded files
app.use("/uploads", express.static("uploads"));

// 3. Client accesses: GET /uploads/1699123456-photo.jpg
```

For production: upload to **S3 / Cloudinary / Azure Blob** — don't store on server disk.

---

## 8. Security — File Handling

| Risk | Prevention |
| --- | --- |
| Huge file DOS | `limits: { fileSize: 5 * 1024 * 1024 }` |
| Wrong file types | `fileFilter` — check extension + mimetype |
| Path traversal | Never use raw user input in paths; use `path.basename()` |
| Executable upload | Block `.exe`, `.sh`, `.php`; store outside web root |
| Malware | Scan with ClamAV in production |

```js
// ❌ BAD — path traversal: GET /files/../../etc/passwd
app.get("/files/:name", (req, res) => {
  res.sendFile("./uploads/" + req.params.name);
});

// ✅ GOOD
app.get("/files/:name", (req, res) => {
  const safe = path.basename(req.params.name); // strips ../
  res.sendFile(path.join(__dirname, "uploads", safe));
});
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How serve static files? | `app.use(express.static("public"))` |
| How send a specific file? | `res.sendFile()` or `res.download()` |
| How upload files? | `multer` middleware — parses `multipart/form-data` |
| `readFile` vs `createReadStream`? | readFile = whole file in memory; stream = chunks, for large files |
| Why streams for large files? | Avoid loading GB into RAM; backpressure handled by pipe |
| Where store uploaded files? | Disk (dev) or cloud S3/Cloudinary (production) |
| What is `req.file`? | Multer adds this — metadata about uploaded file |
| Sync vs async fs? | Always async/await in Express — sync blocks event loop |
| How prevent path traversal? | `path.basename()` + join with known directory |
| Memory vs disk storage in multer? | Memory = buffer for cloud upload; disk = save to filesystem |
