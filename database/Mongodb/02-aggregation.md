# MongoDB — Aggregation Pipeline

Aggregation processes documents through a **pipeline of stages** — like a conveyor belt. Each stage transforms documents and passes results to the next stage.

```js
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

> **Rule:** Put `$match` and `$sort` (with index) **early** to reduce documents processed.

---

## All Pipeline Stages

| Stage | Purpose |
| --- | --- |
| `$match` | Filter documents (like find) |
| `$group` | Group by field, aggregate |
| `$sort` | Sort documents |
| `$project` | Shape output fields |
| `$limit` | Limit result count |
| `$skip` | Skip documents (pagination) |
| `$lookup` | Join another collection |
| `$unwind` | Deconstruct array field |
| `$count` | Count documents |
| `$addFields` | Add computed fields |
| `$replaceRoot` | Replace root document |
| `$facet` | Multiple pipelines in parallel |
| `$bucket` | Group into numeric ranges |
| `$merge` | Write results to collection |
| `$out` | Write results to new collection |

---

## $match — Filter (do first)

```js
db.orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: new Date("2024-01-01") } } },
]);
// Same operators as find: $gt, $in, $or, etc.
```

---

## $group — Aggregate

```js
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",                    // group by field (null = all docs)
      totalSales: { $sum: "$amount" },
      avgOrder: { $avg: "$amount" },
      orderCount: { $sum: 1 },
      maxOrder: { $max: "$amount" },
      minOrder: { $min: "$amount" },
      firstOrder: { $first: "$createdAt" },
      lastOrder: { $last: "$createdAt" },
      allProducts: { $push: "$productName" },
      uniqueProducts: { $addToSet: "$productName" },
    },
  },
]);

// Group by multiple fields
{ $group: { _id: { year: { $year: "$date" }, category: "$category" }, total: { $sum: "$amount" } } }

// Group all documents
{ $group: { _id: null, totalUsers: { $sum: 1 }, avgAge: { $avg: "$age" } } }
```

### Accumulator operators

| Operator | Does |
| --- | --- |
| `$sum` | Sum values |
| `$avg` | Average |
| `$min` / `$max` | Min / max |
| `$count` | Count (in $group: `{ $sum: 1 }`) |
| `$push` | Array of all values |
| `$addToSet` | Array of unique values |
| `$first` / `$last` | First / last value in group |
| `$stdDevPop` / `$stdDevSamp` | Standard deviation |

---

## $project — Shape Output

```js
db.users.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      ageGroup: {
        $cond: { if: { $gte: ["$age", 18] }, then: "adult", else: "minor" },
      },
      _id: 0,
    },
  },
]);
```

### Expression operators in $project

```js
// String
{ $concat: ["$first", " ", "$last"] }
{ $toUpper: "$name" }
{ $substr: ["$phone", 0, 3] }

// Math
{ $add: ["$price", "$tax"] }
{ $multiply: ["$price", 0.9] }
{ $round: ["$price", 2] }

// Date
{ $year: "$createdAt" }
{ $month: "$createdAt" }
{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }

// Conditional
{ $cond: { if: { $gt: ["$age", 18] }, then: "adult", else: "minor" } }
{ $ifNull: ["$nickname", "$name"] }
```

---

## $lookup — Join Collections (SQL LEFT JOIN)

```js
// Basic join
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // collection to join
      localField: "customerId", // field in orders
      foreignField: "_id",      // field in users
      as: "customer",           // output array field
    },
  },
]);

// Unwind to flatten array → single object
db.orders.aggregate([
  { $lookup: { from: "users", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { orderId: 1, amount: 1, "customer.name": 1, "customer.email": 1 } },
]);
```

### $lookup with pipeline (filtered join)

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { productIds: "$items.productId" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", "$$productIds"] } } },
        { $project: { name: 1, price: 1 } },
      ],
      as: "productDetails",
    },
  },
]);
```

### Many-to-many join

```js
db.students.aggregate([
  { $lookup: { from: "courses", localField: "courseIds", foreignField: "_id", as: "courses" } },
]);
```

---

## $unwind — Expand Arrays

```js
// One doc per array element
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQty: { $sum: "$items.quantity" } } },
]);

// Preserve docs with empty/missing arrays
{ $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }
```

---

## $sort, $skip, $limit — Ordering & Pagination

```js
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $sort: { price: -1, name: 1 } },
  { $skip: 20 },
  { $limit: 10 },
]);
```

---

## $facet — Multiple Pipelines in One Query

```js
db.products.aggregate([
  { $match: { category: "electronics" } },
  {
    $facet: {
      byPrice: [
        { $bucket: { groupBy: "$price", boundaries: [0, 100, 500, 1000], default: "1000+" } },
      ],
      topRated: [
        { $sort: { rating: -1 } },
        { $limit: 5 },
        { $project: { name: 1, rating: 1 } },
      ],
      stats: [
        { $group: { _id: null, avgPrice: { $avg: "$price" }, count: { $sum: 1 } } },
      ],
    },
  },
]);
// Returns: { byPrice: [...], topRated: [...], stats: [...] }
```

---

## $bucket — Group into Ranges

```js
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50, 100],
      default: "100+",
      output: { count: { $sum: 1 }, names: { $push: "$name" } },
    },
  },
]);
// { _id: 0, count: 5, names: [...] }
// { _id: 18, count: 12, names: [...] }
```

---

## Real-World Examples

### Total sales per customer (top 10)

```js
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" }, orders: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
  { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { total: 1, orders: 1, name: "$customer.name", email: "$customer.email" } },
]);
```

### Monthly revenue report

```js
db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $group: {
      _id: { year: { $year: "$date" }, month: { $month: "$date" } },
      revenue: { $sum: "$amount" },
      count: { $sum: 1 },
    },
  },
  { $sort: { "_id.year": -1, "_id.month": -1 } },
]);
```

### Products never ordered

```js
db.products.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "items.productId",
      as: "orders",
    },
  },
  { $match: { orders: { $size: 0 } } },
  { $project: { name: 1, price: 1 } },
]);
```

### Average rating per category

```js
db.products.aggregate([
  { $unwind: "$reviews" },
  {
    $group: {
      _id: "$category",
      avgRating: { $avg: "$reviews.rating" },
      reviewCount: { $sum: 1 },
    },
  },
  { $sort: { avgRating: -1 } },
]);
```

---

## $merge / $out — Write Results

```js
// Write to new collection (overwrites)
db.orders.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $out: "customer_totals" },
]);

// Merge into existing collection
db.orders.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $merge: { into: "customer_totals", whenMatched: "replace" } },
]);
```

---

## Aggregation vs find()

| Use find() | Use aggregate() |
| --- | --- |
| Simple queries | Complex transformations |
| Single collection | Joins ($lookup) |
| Basic filter/sort | Grouping, statistics |
| Fast for indexed queries | Pipeline optimization needed |

---

## Performance Tips

1. `$match` first — filter early, use indexes
2. `$project` early — reduce document size
3. `$sort` before `$group` if sorting helps index
4. Avoid `$lookup` on large collections without indexes
5. Use `.explain("executionStats")` on aggregation
6. `$limit` before `$lookup` when possible

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| What is aggregation pipeline? | Staged data processing: $match → $group → $sort → ... |
| What is $lookup? | Left outer join across collections |
| $group _id: null? | Groups all documents into one |
| $unwind purpose? | One document per array element |
| $facet? | Run multiple sub-pipelines in one query |
| $match vs find? | $match in pipeline; same query syntax |
| When use aggregate over find? | Joins, grouping, computed fields, reports |
