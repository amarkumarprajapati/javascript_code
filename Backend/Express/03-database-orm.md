# Database Connection & ORM in Express

Express has **no built-in database layer**. You connect via drivers or ORMs (Object-Relational / Document mappers).

---

## How It Works — Big Picture

```
Express Route Handler
        ↓
   Service / Controller
        ↓
   ORM / ODM (Mongoose, Prisma, Sequelize)
        ↓
   Database Driver (native protocol)
        ↓
   Database (MongoDB, PostgreSQL, MySQL, etc.)
```

**ORM/ODM** = write JavaScript objects instead of raw SQL/queries. It maps:
- **Models/Schemas** → tables/collections
- **Instances** → rows/documents
- **Methods** → CRUD queries

---

## Supported Databases

| Type | Examples | Common ORM/ODM |
| --- | --- | --- |
| **NoSQL** | MongoDB | Mongoose |
| **SQL (RDBMS)** | PostgreSQL, MySQL, SQLite | Sequelize, Prisma, TypeORM |
| **Other** | Redis (cache), Cassandra | ioredis, cassandra-driver |

---

## Connection Patterns

### 1. Connect once at startup (recommended)
```js
// config/db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // fail fast — don't serve without DB
  }
}

module.exports = connectDB;
```

```js
// app.js
const connectDB = require("./config/db");
connectDB(); // before app.listen()
app.listen(3000);
```

### 2. Environment variables (never hardcode)
```env
MONGO_URI=mongodb://localhost:27017/myapp
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

Use `dotenv`: `require("dotenv").config()` at app entry.

### 3. Connection events (MongoDB/Mongoose)
```js
mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.on("disconnected", () => console.log("disconnected"));

// graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

---

## Mongoose (MongoDB ODM) — Most Common with Express

### Define Schema & Model
```js
// models/User.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // hide by default
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true }); // adds createdAt, updatedAt

module.exports = model("User", userSchema);
```

### CRUD in Express routes
```js
const User = require("../models/User");

// CREATE
app.post("/users", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
});

// READ ALL (with pagination)
app.get("/users", async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password");
    res.json(users);
  } catch (err) { next(err); }
});

// READ ONE
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Not found" });
    res.json(user);
  } catch (err) { next(err); }
});

// UPDATE
app.patch("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ msg: "Not found" });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE
app.delete("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Not found" });
    res.status(204).send();
  } catch (err) { next(err); }
});
```

### How Mongoose works internally
1. **Schema** — defines structure, types, validators, defaults
2. **Model** — compiled schema = interface to a MongoDB collection
3. **Document** — one instance (row) with `.save()`, `.remove()`
4. **Query** — chainable: `.find().where().sort().limit()`
5. **Middleware (hooks)** — `pre("save")`, `post("find")` for hashing passwords, logging

```js
// pre-save hook — hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### Populate (join-like for references)
```js
const orderSchema = new Schema({
  userId: { type: ObjectId, ref: "User" },
  items: [String],
});

// get order with user details
const order = await Order.findById(id).populate("userId", "name email");
```

---

## Prisma (SQL + MongoDB) — Modern ORM

Uses a **schema file** + auto-generated type-safe client.

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

```js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json(user);
});
```

**How Prisma works:**
1. Define schema in `schema.prisma`
2. `npx prisma migrate dev` — creates/updates DB tables
3. `npx prisma generate` — generates `@prisma/client`
4. Queries are type-safe, compiled to SQL at runtime

---

## Sequelize (SQL ORM)

```js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
});

await sequelize.sync(); // or use migrations

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});
```

---

## Raw Driver (no ORM) — pg example

```js
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/users", async (req, res) => {
  const { rows } = await pool.query("SELECT id, name, email FROM users LIMIT $1", [10]);
  res.json(rows);
});
```

Use raw SQL when you need full control; ORM when you want productivity + safety.

---

## ORM Comparison (interview table)

| | Mongoose | Prisma | Sequelize |
| --- | --- | --- | --- |
| DB | MongoDB | SQL + MongoDB | SQL only |
| Schema | JS Schema | `.prisma` file | JS define() or migrations |
| Queries | JS methods | Generated client | JS methods |
| Relations | populate | include/connect | include/associations |
| Migrations | manual / migrate-mongo | built-in | built-in |
| Type safety | JSDoc/TS manual | auto-generated | TS support |

---

## Best Practices in Express + DB

### 1. Separate layers
```
routes → controllers → services → models/ORM
```
Routes should NOT contain raw DB queries in large apps.

### 2. Connection pooling
Drivers/ORMs pool connections automatically. One `connect()` at startup — don't connect per request.

### 3. Handle errors
```js
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") return res.status(400).json({ msg: err.message });
  if (err.code === 11000) return res.status(409).json({ msg: "Duplicate key" }); // MongoDB
  res.status(500).json({ msg: "Server error" });
});
```

### 4. Prevent NoSQL injection
```js
// ❌ BAD — user sends { email: { $gt: "" } }
User.findOne(req.body);

// ✅ GOOD — whitelist fields
const { email, password } = req.body;
User.findOne({ email });
```

### 5. Index frequently queried fields
```js
userSchema.index({ email: 1 });
```

### 6. Use `.select("-password")` or `select: false` in schema

### 7. Transactions (when multiple writes must succeed together)
```js
// Mongoose
const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.create([{ name: "A" }], { session });
  await Order.create([{ userId: "..." }], { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How connect MongoDB to Express? | `mongoose.connect(URI)` once at startup |
| What is an ORM/ODM? | Maps JS objects to DB records; abstracts queries |
| Mongoose vs raw driver? | Mongoose = schemas, validation, hooks; raw = full SQL/control |
| When use Prisma? | Type-safe SQL/Mongo, migrations, modern TS projects |
| Where put DB logic? | Service layer or repository — not directly in routes (large apps) |
| Connection per request? | ❌ No — connect once, pool handles concurrent requests |
| Prevent NoSQL injection? | Validate input, never pass raw `req.body` to queries |
| What are Mongoose hooks? | Middleware on save/find — hash password, log changes |
| What is populate? | Mongoose join — fetch referenced documents |
| How handle DB errors in Express? | try/catch → `next(err)` → centralized error middleware |
