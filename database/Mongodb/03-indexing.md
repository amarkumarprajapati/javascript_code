# 03 - Indexing

Indexes make queries fast. Without indexes MongoDB does collection scans.

---

## 3.1 View Existing Indexes

```js
// 1. See indexes on a collection
db.users.getIndexes()
db.products.getIndexes()
db.orders.getIndexes()
```

---

## 3.2 Create Basic Indexes

```js
// 2. Single field index
db.users.createIndex({ email: 1 })                    // ascending
db.products.createIndex({ price: -1 })                // descending
db.orders.createIndex({ orderDate: -1 })

// 3. Index on nested field
db.users.createIndex({ "address.city": 1 })
db.users.createIndex({ "preferences.language": 1 })

// 4. Index on array field (multikey index)
db.products.createIndex({ tags: 1 })
db.users.createIndex({ "preferences.favoriteCategories": 1 })
db.orders.createIndex({ "items.productId": 1 })
```

---

## 3.3 Compound Indexes

Order of fields matters!

```js
// 5. Compound index
db.products.createIndex({ categoryId: 1, price: -1 })
db.orders.createIndex({ status: 1, orderDate: -1 })
db.users.createIndex({ "address.state": 1, "address.city": 1 })

// 6. Useful compound for common queries
db.orders.createIndex({ userId: 1, status: 1 })
db.reviews.createIndex({ productId: 1, rating: -1 })
```

---

## 3.4 Unique Index

```js
// 7. Make email unique
db.users.createIndex({ email: 1 }, { unique: true })

// Try inserting duplicate email → it will fail
```

---

## 3.5 Text Index (for search)

```js
// 8. Create text index on product name and description (if you add description)
db.products.createIndex({ name: "text", brand: "text" })

// Search
db.products.find({ $text: { $search: "iphone" } })
db.products.find({ $text: { $search: "nike air" } })
```

---

## 3.6 TTL Index (Auto delete documents)

```js
// 9. Example: auto delete old logs after 30 days (not needed in our data)
// db.logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

---

## 3.7 Partial Index

```js
// 10. Index only active users
db.users.createIndex(
  { email: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
)

// 11. Index only delivered orders
db.orders.createIndex(
  { orderDate: -1 },
  { partialFilterExpression: { status: "delivered" } }
)
```

---

## 3.8 Explain – Check if index is used

```js
// 12. Always use explain before/after creating index
db.products.find({ price: { $gt: 10000 } }).explain("executionStats")

// Look for:
// - stage: "COLLSCAN"  → bad (no index)
// - stage: "IXSCAN"    → good (using index)
```

---

## 3.9 Drop Index

```js
// 13. Drop a specific index
db.products.dropIndex({ price: -1 })

// 14. Drop all indexes except _id
// db.products.dropIndexes()
```

---

## 3.10 Recommended Indexes for this Dataset

Run these for better practice:

```js
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ "address.city": 1 })
db.users.createIndex({ "address.state": 1, "address.city": 1 })
db.users.createIndex({ "paymentMethods.type": 1 })

// Products
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ tags: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ categoryId: 1, price: -1 })
db.products.createIndex({ name: "text", brand: "text" })

// Orders
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ orderDate: -1 })
db.orders.createIndex({ status: 1, orderDate: -1 })
db.orders.createIndex({ "items.productId": 1 })
db.orders.createIndex({ userId: 1, status: 1 })

// Reviews
db.reviews.createIndex({ productId: 1 })
db.reviews.createIndex({ userId: 1 })
db.reviews.createIndex({ productId: 1, rating: -1 })
db.reviews.createIndex({ rating: 1 })
```

---

## Practice Challenges

1. Create an index that will make this query fast:  
   `db.orders.find({ status: "delivered", orderDate: { $gte: ISODate("2025-01-01") } })`

2. Create a compound index for:  
   `db.products.find({ categoryId: 1 }).sort({ price: -1 })`

3. Use `.explain("executionStats")` on a query before and after creating an index. Compare `totalDocsExamined`.

4. Create a text index and search for products containing "air" or "max".

5. Create a unique index on `users.email` and try to insert a duplicate.
