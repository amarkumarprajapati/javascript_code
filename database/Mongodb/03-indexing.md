# MongoDB — Indexing

Indexes speed up queries — without them MongoDB scans **every document** (COLLSCAN). With index → IXSCAN (fast lookup).

```js
// Without index — scans all 1M docs
db.users.find({ email: "john@mail.com" }).explain("executionStats");
// totalDocsExamined: 1000000 ← bad

// With index — finds instantly
db.users.createIndex({ email: 1 });
// totalDocsExamined: 1 ← good
```

---

## Create Indexes

```js
// Single field — ascending (1) or descending (-1)
db.users.createIndex({ email: 1 });
db.orders.createIndex({ createdAt: -1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index — order matters!
db.users.createIndex({ city: 1, age: -1 });
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 });

// Partial index — only index matching docs
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { active: true } }
);

// TTL index — auto-delete expired docs
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Text index — full-text search
db.articles.createIndex({ title: "text", body: "text" });

// Sparse index — skip docs missing the field
db.users.createIndex({ phone: 1 }, { sparse: true });

// Hashed index — for sharding
db.users.createIndex({ _id: "hashed" });
```

**Mongoose:**
```js
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ city: 1, age: -1 });
// or in schema:
@Prop({ index: true }) email: string;
```

---

## Index Types

| Type | Use case | Example |
| --- | --- | --- |
| **Single field** | Query on one field | `{ email: 1 }` |
| **Compound** | Query on multiple fields | `{ city: 1, age: -1 }` |
| **Multikey** | Index on array fields (auto) | `{ tags: 1 }` |
| **Text** | Full-text search | `{ title: "text" }` |
| **Hashed** | Sharding equality | `{ _id: "hashed" }` |
| **TTL** | Auto-expire documents | `{ expireAt: 1 }, { expireAfterSeconds: 0 }` |
| **Partial** | Index subset of docs | `{ partialFilterExpression: {...} }` |
| **Wildcard** | Index all subfields | `{ "attributes.$**": 1 }` |

---

## ESR Rule — Compound Index Order

When building compound indexes, order fields as:

**E**quality → **S**ort → **R**ange

```js
// Query: find({ city: "NYC", age: { $gte: 18 } }).sort({ name: 1 })
// Best index:
db.users.createIndex({ city: 1, name: 1, age: 1 });
//  E              S          R
```

### Examples

```js
// Query: { status: "active", createdAt: { $gte: date } }.sort({ name: 1 })
db.users.createIndex({ status: 1, name: 1, createdAt: 1 });

// Query: { category: "electronics", price: { $lt: 500 } }
db.products.createIndex({ category: 1, price: 1 });

// Query: { userId: ObjectId("..."), status: "pending" }
db.orders.createIndex({ userId: 1, status: 1 });
```

### Left-prefix rule

Compound index `{ a: 1, b: 1, c: 1 }` supports queries on:
- `{ a }` ✅
- `{ a, b }` ✅
- `{ a, b, c }` ✅
- `{ b }` ❌ (can't use index efficiently)
- `{ b, c }` ❌

---

## Analyze Queries — explain()

```js
db.users.find({ email: "john@mail.com" }).explain("executionStats");
```

Key fields in output:

| Field | Meaning |
| --- | --- |
| `stage: "COLLSCAN"` | Full collection scan — **no index used** ❌ |
| `stage: "IXSCAN"` | Index scan — **index used** ✅ |
| `totalDocsExamined` | Docs scanned (lower = better) |
| `totalKeysExamined` | Index keys scanned |
| `nReturned` | Docs returned |
| `executionTimeMillis` | Query time in ms |

**Ideal:** `totalDocsExamined === nReturned` (index covers query exactly)

```js
// Index only used for scan — still fetches docs
"stage": "FETCH"  // after IXSCAN

// Index covers entire query — no doc fetch needed
"stage": "PROJECTION_COVERED"  // covered query ✅ best
```

---

## Covered Queries

Index contains **all fields** the query needs — MongoDB never reads documents.

```js
db.users.createIndex({ email: 1, name: 1, age: 1 });

// Covered — all fields in index, _id excluded
db.users.find({ email: "john@mail.com" }, { email: 1, name: 1, age: 1, _id: 0 });
```

---

## Manage Indexes

```js
// List all indexes
db.users.getIndexes();

// Drop index
db.users.dropIndex({ email: 1 });
db.users.dropIndex("email_1");  // by name
db.users.dropIndexes();          // drop all except _id

// Index stats — usage info
db.users.aggregate([{ $indexStats: {} }]);

// Hide index (test before dropping)
db.users.hideIndex({ email: 1 });
db.users.unhideIndex({ email: 1 });
```

---

## Index Intersection

MongoDB can use **multiple indexes** for one query (automatic):

```js
db.users.createIndex({ city: 1 });
db.users.createIndex({ age: 1 });
// Query { city: "NYC", age: { $gt: 25 } } may use both indexes
// But compound index { city: 1, age: 1 } is usually better
```

---

## Text Index

```js
db.articles.createIndex({ title: "text", body: "text" });

db.articles.find({ $text: { $search: "mongodb indexing" } });
db.articles.find({ $text: { $search: "mongodb -sql" } }); // exclude "sql"

// Text score sort
db.articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

Only **one text index** per collection.

---

## TTL Index — Auto-Expire Documents

```js
// Delete sessions 1 hour after createdAt
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Delete at exact expireAt datetime
db.tokens.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
```

MongoDB background thread deletes expired docs every ~60 seconds.

---

## Index Build Options

```js
// Background build — doesn't block writes (slower build)
db.users.createIndex({ email: 1 }, { background: true });

// In production with replica set — zero downtime
db.users.createIndex({ email: 1 }, { background: true });
// On secondary first, then primary (automatic in MongoDB 4.2+)
```

---

## Index Downsides

| Downside | Impact |
| --- | --- |
| **Slower writes** | Every insert/update/delete must update indexes |
| **Memory usage** | Indexes stored in RAM (working set) |
| **Disk space** | Indexes consume disk |
| **Too many indexes** | Write amplification, memory pressure |

**Rule:** Index fields you **query, sort, and join** on. Don't index everything.

---

## Best Practices

1. Index fields in **WHERE**, **SORT**, and **JOIN** clauses
2. Follow **ESR rule** for compound indexes
3. Use **unique index** for fields that must be unique
4. Use **TTL** for sessions, logs, temp data
5. Run **explain()** on slow queries
6. Monitor with **$indexStats** — drop unused indexes
7. Keep indexes in **RAM** (working set fits memory)
8. One compound index > multiple single indexes for same query
9. Exclude `_id` in projection for covered queries
10. **Don't index** high-cardinality fields you never query

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| Why indexes? | Speed up reads; B-tree lookup vs full scan |
| COLLSCAN vs IXSCAN? | Full scan vs index scan |
| Compound index order? | ESR: Equality, Sort, Range |
| Left-prefix rule? | {a,b,c} index supports {a}, {a,b}, {a,b,c} queries |
| Index downside? | Slower writes, RAM, disk space |
| Covered query? | All queried fields in index — no doc fetch |
| TTL index? | Auto-delete docs after expireAfterSeconds |
| Unique index? | Enforces uniqueness; fails on duplicate insert |
| How check index usage? | explain("executionStats") or $indexStats |
| Text index limit? | One text index per collection |
