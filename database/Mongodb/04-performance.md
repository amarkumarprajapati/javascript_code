# MongoDB — Performance Improvement

---

## Performance Checklist

| Priority | Action |
| --- | --- |
| 1 | Add indexes on queried/sorted fields |
| 2 | Use `.explain()` to find COLLSCAN queries |
| 3 | Project only needed fields |
| 4 | Paginate — never return all documents |
| 5 | Use aggregation `$match` early |
| 6 | Embed vs reference based on access pattern |
| 7 | Connection pooling |
| 8 | Read from secondary replicas |
| 9 | Proper schema design |
| 10 | Monitor slow queries |

---

## 1. Indexing (Biggest Impact)

```js
// ❌ COLLSCAN — 1M docs examined
db.users.find({ email: "john@mail.com" });

// ✅ IXSCAN — 1 doc examined
db.users.createIndex({ email: 1 }, { unique: true });
db.users.find({ email: "john@mail.com" });

// Always explain slow queries
db.users.find({ city: "NYC", age: { $gte: 18 } })
  .sort({ name: 1 })
  .explain("executionStats");
```

See `03-indexing.md` for full index guide.

---

## 2. Query Optimization

### Project only needed fields
```js
// ❌ Returns all fields
db.users.find({ city: "NYC" });

// ✅ Only needed fields — less data transfer
db.users.find({ city: "NYC" }, { name: 1, email: 1, _id: 0 });
```

### Pagination — never skip large offsets
```js
// ❌ Slow for large skip — scans and discards 10000 docs
db.users.find().skip(10000).limit(10);

// ✅ Cursor-based pagination (fast at any page)
db.users.find({ _id: { $gt: lastSeenId } }).sort({ _id: 1 }).limit(10);

// ✅ Range-based pagination
db.users.find({ createdAt: { $lt: lastDate } }).sort({ createdAt: -1 }).limit(10);
```

### Use covered queries
```js
db.users.createIndex({ email: 1, name: 1, status: 1 });
db.users.find(
  { email: "john@mail.com" },
  { email: 1, name: 1, status: 1, _id: 0 }  // all from index
);
```

### Avoid $where and $regex without anchor
```js
// ❌ Full scan — regex not anchored
db.users.find({ name: { $regex: "john" } });

// ✅ Anchored regex can use index
db.users.find({ name: { $regex: "^john" } });

// ❌ $where runs JS on every doc
db.users.find({ $where: "this.age > 25" });

// ✅ Use operators instead
db.users.find({ age: { $gt: 25 } });
```

### Limit aggregation pipeline early
```js
// ✅ Filter first
db.orders.aggregate([
  { $match: { status: "paid", date: { $gte: startDate } } },  // index here
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

---

## 3. Schema Design for Performance

### Embed when data is read together
```js
// ✅ One query gets user + address
{ name: "John", address: { city: "NYC", zip: "10001" } }
```

### Reference when data is large or shared
```js
// ✅ Avoid duplicating large product data in every order
{ orderId: "ORD-1", items: [{ productId: ObjectId("..."), qty: 2 }] }
```

### Avoid unbounded arrays
```js
// ❌ Array grows forever — doc exceeds 16MB limit, slow updates
{ userId: "...", comments: [/* millions of comments */] }

// ✅ Separate collection with userId reference
db.comments.find({ userId: ObjectId("...") }).limit(20);
```

### Document size limit
- Max document size: **16 MB**
- Keep documents small — large docs slow reads/writes
- Use GridFS for files > 16MB

---

## 4. Write Performance

```js
// Bulk insert — much faster than many insertOne
db.users.insertMany(largeArray, { ordered: false });

// Bulk write for mixed operations
db.users.bulkWrite(operations, { ordered: false });

// Disable index build during mass import
db.users.dropIndexes();
// ... bulk insert ...
db.users.createIndex({ email: 1 });

// Write concern — balance speed vs durability
db.users.insertOne(doc, { writeConcern: { w: 1 } });        // fast
db.users.insertOne(doc, { writeConcern: { w: "majority" } }); // safe
```

---

## 5. Connection Pooling

```js
// ❌ New connection per request
async function getUser(id) {
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("app").collection("users").findOne({ _id: id });
  await client.close();
  return user;
}

// ✅ Connection pool — reuse connections
const client = new MongoClient(uri, {
  maxPoolSize: 50,       // max connections
  minPoolSize: 5,        // keep warm connections
  maxIdleTimeMS: 30000,  // close idle after 30s
});
await client.connect(); // once at startup

// Mongoose — pool by default
await mongoose.connect(uri, { maxPoolSize: 50 });
```

---

## 6. Read Preference — Scale Reads

```js
// Read from secondary replicas — offload primary
const client = new MongoClient(uri, {
  readPreference: "secondaryPreferred", // secondary if available, else primary
});

// Read concern levels
// "local" — fastest, may read uncommitted
// "majority" — read data confirmed by majority (consistent)
// "linearizable" — strongest, slowest
```

| Read Preference | Use |
| --- | --- |
| `primary` | Default — all reads from primary |
| `primaryPreferred` | Primary preferred, secondary fallback |
| `secondary` | Analytics, reports — offload primary |
| `secondaryPreferred` | Scale reads, tolerate stale data |
| `nearest` | Lowest latency node |

---

## 7. Caching

```js
// Application-level cache (Redis)
async function getProduct(id) {
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findOne({ _id: ObjectId(id) });
  await redis.set(`product:${id}`, JSON.stringify(product), "EX", 300);
  return product;
}

// Invalidate on update
await db.products.updateOne({ _id: id }, { $set: data });
await redis.del(`product:${id}`);
```

---

## 8. Mongoose Performance Tips

```js
// lean() — return plain JS objects, skip Mongoose hydration
const users = await User.find({ active: true }).lean();

// select only needed fields
const users = await User.find().select("name email");

// Use indexes defined in schema
userSchema.index({ email: 1 });

// Avoid populate when not needed
// ❌
const orders = await Order.find().populate("userId").populate("products");
// ✅ if you only need user name
const orders = await Order.find().populate("userId", "name");

// Batch operations
await User.insertMany(users);
await User.bulkWrite(operations);

// Cursor for large result sets
const cursor = User.find({ active: true }).cursor();
for await (const user of cursor) {
  processUser(user);
}
```

---

## 9. Monitoring Slow Queries

```js
// Enable profiling — log slow queries
db.setProfilingLevel(1, { slowms: 100 }); // log queries > 100ms

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10);

// Current operations
db.currentOp({ "secs_running": { $gte: 3 } });

// Server status
db.serverStatus().opcounters;
db.serverStatus().wiredTiger.cache; // cache usage
```

**MongoDB Atlas:** Performance Advisor suggests indexes automatically.

---

## 10. Hardware & Deployment

| Factor | Recommendation |
| --- | --- |
| **RAM** | Working set (indexes + hot data) should fit in RAM |
| **SSD** | Use SSD storage — dramatically faster I/O |
| **CPU** | More cores help with concurrent connections |
| **Network** | App server close to MongoDB (same region/AZ) |
| **Replica set** | 3 nodes minimum for production (HA + read scaling) |
| **Sharding** | When single replica set exceeds capacity |

### Working set
```
Working Set = frequently accessed data + indexes
Goal: Working set fits in RAM (WiredTiger cache)
If not → page faults → disk reads → slow queries
```

Check cache:
```js
db.serverStatus().wiredTiger.cache["bytes currently in the cache"];
db.serverStatus().wiredTiger.cache["maximum bytes configured"];
```

---

## 11. WiredTiger Storage Engine (Default)

- Document-level locking (not collection-level)
- Compression: snappy (default), zlib, zstd
- Cache: 50% of RAM minus 1GB (default)

```js
// Check compression
db.serverStatus().wiredTiger.compression;

// Collection stats
db.users.stats();
// avgObjSize, count, size, storageSize, totalIndexSize
```

---

## Common Slow Query Fixes

| Problem | Fix |
| --- | --- |
| COLLSCAN in explain | Add index on query fields |
| Large skip pagination | Cursor-based pagination |
| Returning all fields | Projection — select needed fields |
| N+1 populate calls | `$lookup` in aggregation or embed data |
| Unbounded array growth | Separate collection |
| No connection pool | Configure maxPoolSize |
| Reading from primary only | secondaryPreferred for analytics |
| Large documents | Split or reference |
| Missing compound index | ESR rule compound index |
| $lookup without index | Index foreignField |

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| How improve MongoDB performance? | Indexes, projection, pagination, schema design, pooling |
| What is working set? | Hot data + indexes that should fit in RAM |
| Why lean() in Mongoose? | Skip document hydration — faster reads |
| Cursor vs skip pagination? | Cursor uses index; skip scans and discards |
| Read preference secondary? | Offload reads to replica — eventual consistency |
| How find slow queries? | Profiler, explain(), Atlas Performance Advisor |
| Index vs no index write speed? | Indexes slow writes — only index what you query |
| 16MB document limit? | Split large data into separate collection or GridFS |
| Connection pooling why? | Reuse connections — avoid connect overhead per request |
