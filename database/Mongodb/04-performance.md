# 04 - Performance

Learn how to write efficient queries and diagnose slow ones.

---

## 4.1 Use explain()

```js
// Always start with explain
db.orders.find({ status: "delivered" }).explain("executionStats")

// Important fields to look at:
// - executionStats.nReturned
// - executionStats.totalDocsExamined
// - executionStats.totalKeysExamined
// - executionStats.executionTimeMillis
// - stage: COLLSCAN vs IXSCAN
```

---

## 4.2 Covering Queries (Best Performance)

A covering query is served entirely from the index (no document fetch).

```js
// 1. Create a compound index that covers the query
db.products.createIndex({ categoryId: 1, price: 1, name: 1 })

// 2. This query can be covered
db.products.find(
  { categoryId: 1 },
  { price: 1, name: 1, _id: 0 }
).explain("executionStats")

// Look for "totalDocsExamined": 0  → perfect covering query
```

---

## 4.3 Avoid COLLSCAN on Large Collections

```js
// Bad (collection scan)
db.orders.find({ "shipping.method": "express" })

// Better: create index first
db.orders.createIndex({ "shipping.method": 1 })
```

---

## 4.4 Projection – Fetch only what you need

```js
// Bad
db.users.find({ "address.city": "Mumbai" })

// Good
db.users.find(
  { "address.city": "Mumbai" },
  { firstName: 1, lastName: 1, email: 1, _id: 0 }
)
```

---

## 4.5 Use $elemMatch properly

```js
// When querying array of objects, prefer $elemMatch for multiple conditions
db.users.find({
  paymentMethods: {
    $elemMatch: { type: "card", isDefault: true }
  }
})
```

---

## 4.6 Limit Early in Aggregation

```js
// Bad order
db.orders.aggregate([
  { $lookup: { ... } },
  { $match: { status: "delivered" } },
  { $limit: 10 }
])

// Good order – filter as early as possible
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $limit: 10 },
  { $lookup: { ... } }
])
```

---

## 4.7 Avoid $where and JavaScript

```js
// Never do this in production
db.products.find({ $where: "this.price > 10000" })

// Always use normal query operators
db.products.find({ price: { $gt: 10000 } })
```

---

## 4.8 Working Set & Indexes in RAM

```js
// Check index size
db.products.stats()
db.products.totalIndexSize()

// Check collection size
db.products.dataSize()
```

---

## 4.9 Common Performance Patterns

### Pattern 1: Range + Equality
```js
// Index should have equality fields first, then range
// Good index: { status: 1, orderDate: -1 }
db.orders.find({ status: "delivered", orderDate: { $gte: ISODate("2025-01-01") } })
```

### Pattern 2: Sort + Filter
```js
// Create index that supports both filter and sort
db.products.createIndex({ categoryId: 1, rating: -1 })
db.products.find({ categoryId: 1 }).sort({ rating: -1 })
```

### Pattern 3: Array Queries
```js
// Multikey index works well
db.products.createIndex({ tags: 1 })
db.products.find({ tags: "bestseller" })
```

---

## 4.10 Practice Performance Checklist

For every important query ask:

1. Does it use an index? (check with explain)
2. Are we fetching only needed fields? (projection)
3. Can we filter earlier in aggregation?
4. Is the index order correct for compound queries?
5. Are we avoiding large `$in` arrays or regex without anchors?

---

## Practice Challenges

1. Take this query and make it use an index:  
   `db.reviews.find({ productId: 1, rating: { $gte: 4 } })`

2. Create a covering index for:  
   `db.users.find({ "address.city": "Mumbai" }, { firstName: 1, email: 1, _id: 0 })`

3. Compare `totalDocsExamined` before and after adding an index on `orders.status`.

4. Rewrite this aggregation so `$match` comes before `$lookup`:  
   ```js
   db.orders.aggregate([
     { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
     { $match: { status: "delivered" } }
   ])
   ```

5. Find any query in your previous practice that still does COLLSCAN and fix it.
