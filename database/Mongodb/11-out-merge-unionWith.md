# 11 - Aggregation Pipeline Output & Set Operators

## $out, $merge, $unionWith

These operators allow you to write aggregation results back to MongoDB collections or combine results from multiple pipelines.

---

### $out

**Purpose:** Takes the entire aggregation pipeline result and writes it to a collection. The pipeline is terminated after `$out`.

**Syntax:**
```js
{ $out: "collectionName" }
// or with options
{ $out: { db: "dbName", coll: "collectionName" } }
```

**Rules:**
- The target collection **must not be sharded** (in older versions it could not be the `admin` or `local` db).
- `$out` **replaces** the target collection entirely (drops and recreates).
- Cannot be used with `$unionWith` in the same pipeline in some versions.

**Example:**
```js
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $out: "delivered_totals" }
]);
// Creates/overwrites "delivered_totals" collection
```

---

### $merge

**Purpose:** Writes aggregation results to a collection with fine-grained control over **how** documents are written (insert, replace, merge, fail, keep existing).

**Syntax:**
```js
{
  $merge: {
    into: { db: "dbName", coll: "collectionName" }, // or just "collectionName"
    on: "_id",                    // field(s) to match on (default: _id)
    whenMatched: "replace",       // "replace" | "merge" | "insert" | "fail" | "keepExisting" | "fail"
    whenNotMatched: "insert",      // "insert" | "fail" | "discard"
    let: { /* variables */ }       // optional
  }
}
```

**When to use `$merge` vs `$out`:**
- Use `$out` when you want to **replace** an entire collection.
- Use `$merge` when you want to **update existing documents** or **append** to a collection.

**Example (upsert):**
```js
db.report.aggregate([
  { $group: { _id: "$productId", sales: { $sum: "$qty" } } },
  {
    $merge: {
      into: "product_sales",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);
```

**Example (accumulate):**
```js
db.daily.aggregate([
  { $merge: {
      into: "monthly_totals",
      whenMatched: "replace",       // replace existing doc
      whenNotMatched: "insert"      // insert new doc
    }
  }
]);
```

---

### $unionWith

**Purpose:** Combines results from the current aggregation pipeline with the result of a pipeline from **another collection** (possibly in another database).

**Syntax:**
```js
{ $unionWith: { coll: "otherCollection", pipeline: [ /* stages */ ] } }
// or shorthand if using same db
{ $unionWith: "otherCollection" }  // equivalent to: { $unionWith: { coll: "otherCollection", pipeline: [ { $match: {} } ] } }
```

**Example:**
```js
db.sales.aggregate([
  { $unionWith: { coll: "returns", pipeline: [{ $match: { reason: "defective" } }] } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
]);
```

**Example (same pipeline shape):**
```js
db.q1.aggregate([
  { $unionWith: "q2" },
  { $unionWith: "q3" },
  { $unionWith: "q4" },
  { $group: { _id: "$region", total: { $sum: "$sales" } } }
]);
```

---

## Key Differences

| Operator | Writes to Collection | Overwrites | Pipeline Continues | Combines Collections |
|---|---|---|---|---|
| `$out` | Yes | Yes (full replace) | No (terminates) | No |
| `$merge` | Yes | Optional (upsert) | Yes | No |
| `$unionWith` | No (results in pipeline) | No | Yes | Yes (pipelines) |

---

## Summary of Syntax

```js
// $out — replace collection entirely
{ $out: "newCollection" }

// $merge — upsert with control
{
  $merge: {
    into: "targetCollection",
    on: "joinField",
    whenMatched: "replace",   // action if doc exists
    whenNotMatched: "insert"   // action if doc doesn't exist
  }
}

// $unionWith — combine with another pipeline
{ $unionWith: { coll: "otherCollection", pipeline: [/*...*/] } }
```
