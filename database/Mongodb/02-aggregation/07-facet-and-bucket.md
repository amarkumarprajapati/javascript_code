# 08 - $facet and $fill

## $facet

**Purpose:** Processes multiple aggregation pipelines **in parallel** on the same set of documents, then outputs an array of the results from each pipeline.

**Syntax:**
```js
{
  $facet: {
    "outputField1": [ {stage1}, {stage2}, ... ],
    "outputField2": [ {stageA}, {stageB}, ... ],
    ...
  }
}
```

**Rules:**
- Each sub-pipeline receives the **same input** documents.
- The output is a single document with each facet name as a field, containing an array of matched documents.
- Sub-pipelines **cannot contain** `$out`, `$merge`, or `$unionWith`.
- You rarely want both `$facet` and `$out`/`$merge` in the same stage.

**Example:**
```js
db.products.aggregate([
  {
    $facet: {
      cheap: [{ $match: { price: { $lt: 100 } } }, { $sort: { price: 1 } }],
      expensive: [{ $match: { price: { $gte: 100 } } }, { $sort: { price: -1 } }],
      summary: [{ $count: "total" }, { $project: { avgPrice: { $avg: "$price" } } }]
    }
  }
]);
// Output shape:
// {
//   cheap: [...],
//   expensive: [...],
//   summary: [{ total: 100, avgPrice: 250.5 }]
// }
```

**Use cases:**
- Dashboard-style reports (multiple metrics from same query).
- Getting paginated results + metadata (count) in one round trip.

---

## $fill

**Purpose:** Populates `null` or missing field values in documents (useful for time-series data with gaps).

**Syntax:**
```js
{
  $fill: {
    partitionBy: "<expression>",    // optional, partitions the documents
    partitionByFields: ["field1"],  // alternative to partitionBy expression
    sortBy: { "field": 1 },
    output: [
      {
        field: "valueField",
        method: "linear",            // "linear" | "nearest" | "constant" | "locf" | "next"
        value: 0                     // required only for "constant"
      }
    ]
  }
}
```

**Methods:**
| Method | Description |
|---|---|
| `linear` | Linear interpolation between known values |
| `nearest` | Nearest known value |
| `constant` | Constant value (use `value` field) |
| `locf` (last observation carried forward) | Previous known value |
| `next` | Next known value |

**Example:**
```js
db.sales.aggregate([
  { $sort: { date: 1 } },
  {
    $fill: {
      sortBy: { date: 1 },
      output: {
        revenue: { method: "linear" },
        orders: { method: "locf", value: 0 }
      }
    }
  }
]);
```


---

## Bucket Stages ($bucket & $bucketAuto)


`$bucket` groups documents into ranges you define yourself. `$bucketAuto` lets MongoDB
split the data into an equal number of buckets automatically.

```js
// 24. Products grouped into price ranges (boundaries are [lower, upper))
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 1000, 10000, 50000, 100000],
      default: "Above 100000", // catch-all for values outside boundaries
      output: {
        count: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        products: { $push: "$name" }
      }
    }
  },
  { $sort: { _id: 1 } }
])

// 25. Orders grouped by order value with revenue per bucket
db.orders.aggregate([
  {
    $bucket: {
      groupBy: "$totalAmount",
      boundaries: [0, 1000, 10000, 50000, 100000],
      default: "Big orders",
      output: {
        orderCount: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  }
])

// 26. Reviews grouped by rating buckets
db.reviews.aggregate([
  {
    $bucket: {
      groupBy: "$rating",
      boundaries: [1, 2, 3, 4, 5],
      default: "No rating",
      output: { reviewCount: { $sum: 1 } }
    }
  }
])

// 27. Bucket by date (all boundaries must be the same type)
db.orders.aggregate([
  {
    $bucket: {
      groupBy: "$orderDate",
      boundaries: [
        new Date("2025-01-01"),
        new Date("2025-02-01"),
        new Date("2025-03-01"),
        new Date("2025-04-01"),
        new Date("2025-05-01"),
        new Date("2025-06-01")
      ],
      default: "Out of range",
      output: {
        orderCount: { $sum: 1 },
        revenue: { $sum: "$totalAmount" }
      }
    }
  },
  { $sort: { _id: 1 } }
])

// 28. $bucketAuto - split products into 5 price buckets automatically
//     (output of a bucket shows its _id, count, min and max of the groupBy field)
db.products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5
    }
  }
])

// 29. $bucketAuto with extra accumulators
db.orders.aggregate([
  {
    $bucketAuto: {
      groupBy: "$totalAmount",
      buckets: 4,
      output: {
        orderCount: { $sum: 1 },
        avgAmount: { $avg: "$totalAmount" }
      }
    }
  }
])

// 30. $bucketAuto with granularity (nice round boundaries)
//     granularity options: R5, R10, R20, R40, E6, E12, E24, E48, E96, E192, POWERSOF2
db.products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$stock",
      buckets: 4,
      granularity: "R10"
    }
  }
])
```

**$bucket vs $bucketAuto**

| | `$bucket` | `$bucketAuto` |
|---|---|---|
| Boundaries | You set them (`boundaries`) | MongoDB sets them (`buckets` count) |
| `_id` of output | Lower bound of your bucket (or `default`) | Lower bound of the auto bucket |
| Empty buckets | Not returned | Not returned |
| Needs `default` | Only if values can fall outside boundaries | Not allowed |
| `groupBy` | Numbers, dates, strings | Numbers and dates only |
| `granularity` | Not supported | Optional (default `R5`-like rounding) |

---
