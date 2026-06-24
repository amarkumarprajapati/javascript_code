# MongoDB — Schema Design

MongoDB is **schema-flexible** — no fixed columns. But good schema design is critical for performance and maintainability. Design based on **how you query**, not how you store.

---

## Golden Rule

> Design schema around your application's **read/write patterns**.

Ask before designing:
1. What queries will run most often?
2. Do we read data together or separately?
3. How often does data change?
4. How big can arrays grow?
5. Is data shared across many documents?

---

## Embedding vs Referencing

| | **Embedding (Denormalize)** | **Referencing (Normalize)** |
| --- | --- | --- |
| Structure | Store related data inside document | Store ObjectId reference |
| Queries | **1 query** gets everything | **2+ queries** or `$lookup` |
| Updates | Update in **one place** or many docs | Update in **one place** |
| Data size | Document grows | Stays small |
| Best for | Data accessed together, bounded size | Large/shared/unbounded data |

---

## When to Embed

Data is:
- Accessed **together** always
- **Bounded** in size (won't grow forever)
- **One-to-few** relationship
- Doesn't change independently

```js
// ✅ Embed address in user — always read together
{
  _id: ObjectId("..."),
  name: "John",
  email: "john@mail.com",
  address: {
    street: "123 Main St",
    city: "NYC",
    zip: "10001",
  },
}

// ✅ Embed author in blog post — few authors, read together
{
  title: "MongoDB Guide",
  body: "...",
  author: { id: ObjectId("..."), name: "Jane", avatar: "url" },
}

// ✅ Embed items in order — bounded, always read with order
{
  orderId: "ORD-001",
  customerId: ObjectId("..."),
  items: [
    { productId: ObjectId("..."), name: "Laptop", qty: 1, price: 999 },
    { productId: ObjectId("..."), name: "Mouse", qty: 2, price: 29 },
  ],
  total: 1057,
  status: "paid",
}
```

---

## When to Reference

Data is:
- **Large** or unbounded
- **Shared** across many documents
- **One-to-many** or **many-to-many**
- Updated **independently**

```js
// ✅ Reference — user has many orders (unbounded)
// users collection
{ _id: ObjectId("u1"), name: "John", email: "john@mail.com" }

// orders collection
{ _id: ObjectId("o1"), userId: ObjectId("u1"), total: 999, status: "paid" }
{ _id: ObjectId("o2"), userId: ObjectId("u1"), total: 49, status: "pending" }

// Query with populate (Mongoose) or $lookup
db.orders.aggregate([
  { $match: { userId: ObjectId("u1") } },
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
]);
```

```js
// ✅ Reference products in orders — product data shared, changes independently
{
  orderId: "ORD-001",
  items: [
    { productId: ObjectId("p1"), qty: 1, priceAtPurchase: 999 }, // snapshot price
    { productId: ObjectId("p2"), qty: 2, priceAtPurchase: 29 },
  ],
}
// Product name/price changes don't affect past orders
```

---

## Relationship Patterns

### One-to-One — Prefer Embed

```js
// User + profile (always fetched together)
{
  _id: ObjectId("..."),
  name: "John",
  profile: {
    bio: "Developer",
    avatar: "url",
    socialLinks: { twitter: "@john" },
  },
}
```

### One-to-Few — Embed

```js
// Blog post + comments (few comments, read together)
{
  title: "MongoDB Tips",
  body: "...",
  comments: [
    { author: "Alice", text: "Great post!", date: ISODate("...") },
    { author: "Bob", text: "Thanks!", date: ISODate("...") },
  ],
}
```

### One-to-Many — Reference

```js
// User → many orders
{ _id: ObjectId("u1"), name: "John" }
{ userId: ObjectId("u1"), orderId: "ORD-001", total: 999 }
```

### One-to-Squillions — Reference + Pagination

```js
// Host → billions of log entries — never embed
{ hostId: ObjectId("h1"), timestamp: ISODate("..."), message: "..." }
// Query with index + pagination
db.logs.find({ hostId: ObjectId("h1") }).sort({ timestamp: -1 }).limit(100);
```

### Many-to-Many — Reference Array or Junction Collection

```js
// Students ↔ Courses — array of IDs
{ name: "Alice", courseIds: [ObjectId("c1"), ObjectId("c2")] }

// Or junction collection for complex relationships
{ studentId: ObjectId("s1"), courseId: ObjectId("c1"), enrolledAt: ISODate("...") }
```

---

## Schema Design Patterns

### 1. Subset Pattern — Store Preview Data

Store frequently accessed subset, full data elsewhere.

```js
// Product list page — only need name, price, thumbnail
{
  _id: ObjectId("p1"),
  name: "Laptop",
  price: 999,
  thumbnail: "url",
  // full description, specs in separate collection or same doc below fold
  description: "...",
  specifications: { cpu: "i7", ram: "16GB" },
}
```

### 2. Extended Reference Pattern — Cache Key Fields

Store ID + frequently needed fields to avoid join.

```js
// Order stores customer snapshot — avoid join for display
{
  orderId: "ORD-001",
  customer: {
    id: ObjectId("u1"),
    name: "John Doe",    // cached — may be stale if user renames
    email: "john@mail.com",
  },
  items: [...],
}
```

### 3. Document Versioning — Keep History

```js
// Current version
{ _id: ObjectId("p1"), name: "Laptop", price: 999, version: 3 }

// History collection
{ productId: ObjectId("p1"), version: 2, name: "Laptop", price: 1099, changedAt: ISODate("...") }
```

### 4. Bucket Pattern — Time-Series Data

Group time-series data into buckets (e.g., hourly).

```js
// Instead of 1 doc per sensor reading (millions of docs)
// Bucket: 1 doc per sensor per hour
{
  sensorId: ObjectId("s1"),
  hour: ISODate("2024-01-01T10:00:00Z"),
  readings: [
    { time: ISODate("..."), temp: 22.1 },
    { time: ISODate("..."), temp: 22.3 },
    // up to ~1000 readings per bucket
  ],
  count: 3600,
  avgTemp: 22.2,
}
```

### 5. Outlier Pattern — Handle Variable Size

Most docs small, few docs huge.

```js
// Most movies have few reviews — embed
{ title: "Movie A", reviews: [{ user: "Alice", rating: 5 }] }

// Famous movie with millions of reviews — reference
{ title: "Blockbuster", reviewCount: 5000000, hasExternalReviews: true }
// reviews in separate collection
```

### 6. Schema Versioning — Handle Schema Changes

```js
{
  _id: ObjectId("..."),
  schemaVersion: 2,
  name: "John",
  email: "john@mail.com",
  // v1 had "phone", v2 replaced with "phones" array
  phones: ["+1234567890"],
}
// App code handles different versions during migration
```

---

## Anti-Patterns to Avoid

### ❌ Massive arrays
```js
// Comments array grows forever — hits 16MB doc limit
{ postId: "...", comments: [/* 100k comments */] }
// ✅ Separate comments collection
```

### ❌ Massive documents
```js
// 16MB document limit — split data
// ✅ Use GridFS for files > 16MB
// ✅ Reference large sub-documents
```

### ❌ Same data in many places without reason
```js
// Product name copied in every order item AND review AND cart
// ✅ Reference productId; cache only display fields if needed
```

### ❌ Indexing every field
```js
// Indexes on rarely queried fields slow writes
// ✅ Index only query/sort/join fields
```

---

## Schema Validation

Enforce structure at database level:

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string", minLength: 2 },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age: { bsonType: "int", minimum: 0, maximum: 150 },
        role: { enum: ["user", "admin"] },
      },
    },
  },
  validationLevel: "strict",    // reject invalid docs
  validationAction: "error",
});
```

**Mongoose validation:**
```js
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, match: /.+@.+/ },
  age: { type: Number, min: 0, max: 150 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
```

---

## Example Schemas

### E-commerce

```js
// products
{ _id, name, price, category, stock, tags: [], specs: {}, createdAt }

// users
{ _id, name, email, password, address: { embed }, role, createdAt }

// orders — reference user, embed items snapshot
{
  _id, userId: ObjectId, userName: "John",
  items: [{ productId, name, price, qty }],
  total, status, shippingAddress: { embed }, createdAt
}

// reviews — reference product + user
{ productId: ObjectId, userId: ObjectId, rating, text, createdAt }
```

### Social Media

```js
// users
{ _id, username, email, profile: { bio, avatar, embed } }

// posts
{ _id, authorId: ObjectId, authorName: "John", content, likes: 42, createdAt }

// followers — junction
{ followerId: ObjectId, followingId: ObjectId, createdAt }

// feed — pre-computed (write-heavy, read-optimized)
{ userId: ObjectId, postIds: [ObjectId, ...], updatedAt }
```

---

## Decision Flowchart

```
Is data always read together?
  YES → Is it bounded in size?
    YES → EMBED
    NO  → REFERENCE (or bucket pattern)
  NO  → REFERENCE

Does data change independently?
  YES → REFERENCE

Is it shared across many documents?
  YES → REFERENCE (store snapshot if needed for display)

Array could exceed 100s of items?
  YES → REFERENCE separate collection
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| Embed vs reference? | Embed = together/bounded; Reference = large/shared/unbounded |
| When embed? | One-to-few, always read together, bounded size |
| When reference? | One-to-many, shared data, independent updates |
| 16MB limit? | Max document size — split or use GridFS |
| Bucket pattern? | Group time-series readings into hourly/daily buckets |
| Extended reference? | Store ID + cached fields to avoid join |
| Schema validation? | $jsonSchema in collection validator or Mongoose schema |
| Anti-pattern? | Unbounded arrays, massive docs, over-denormalization |
