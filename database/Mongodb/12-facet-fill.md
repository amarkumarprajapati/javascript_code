# 12 - $facet and $fill

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
