# MongoDB Query

> Advanced querying techniques and operators in MongoDB.

## Query Operators Reference

### Comparison Operators

| Operator | Description | Example |
| --- | --- | --- |
| `$eq` | Equal to | `{ age: { $eq: 30 } }` |
| `$ne` | Not equal to | `{ age: { $ne: 30 } }` |
| `$gt` | Greater than | `{ age: { $gt: 25 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 25 } }` |
| `$lt` | Less than | `{ age: { $lt: 40 } }` |
| `$lte` | Less than or equal | `{ age: { $lte: 40 } }` |
| `$in` | In array | `{ age: { $in: [25, 30, 35] } }` |
| `$nin` | Not in array | `{ age: { $nin: [25, 30, 35] } }` |

### Logical Operators

| Operator | Description | Example |
| --- | --- | --- |
| `$and` | AND condition | `{ $and: [{ age: 25 }, { city: 'NYC' }] }` |
| `$or` | OR condition | `{ $or: [{ age: 25 }, { city: 'NYC' }] }` |
| `$not` | NOT condition | `{ age: { $not: { $gt: 30 } } }` |
| `$nor` | Neither condition | `{ $nor: [{ age: 25 }, { city: 'NYC' }] }` |

### Element Operators

| Operator | Description | Example |
| --- | --- | --- |
| `$exists` | Field exists | `{ email: { $exists: true } }` |
| `$type` | Field type | `{ age: { $type: 'number' } }` |

### Array Operators

| Operator | Description | Example |
| --- | --- | --- |
| `$all` | Contains all values | `{ tags: { $all: ['js', 'mongo'] } }` |
| `$elemMatch` | Match array element | `{ scores: { $elemMatch: { $gt: 80 } } }` |
| `$size` | Array size | `{ tags: { $size: 3 } }` |

### Evaluation Operators

| Operator | Description | Example |
| --- | --- | --- |
| `$regex` | Regular expression | `{ name: { $regex: '^John' } }` |
| `$text` | Text search | `{ $text: { $search: 'keyword' } }` |
| `$where` | JavaScript expression | `{ $where: 'this.age > 25' }` |
| `$expr` | Aggregation expression | `{ $expr: { $gt: ['$a', '$b'] } }` |

## Complex Query Examples

### Multiple Conditions
```javascript
// Implicit AND
db.users.find({ age: 30, city: 'New York' })

// Explicit AND
db.users.find({
  $and: [
    { age: { $gte: 25 } },
    { age: { $lte: 35 } },
    { city: 'New York' }
  ]
})

// OR with AND
db.users.find({
  $or: [
    { age: { $lt: 25 }, city: 'New York' },
    { age: { $gt: 35 }, city: 'Los Angeles' }
  ]
})
```

### Nested Queries
```javascript
// Query nested object
db.users.find({ 'address.city': 'New York' })

// Query nested array
db.users.find({ 'orders.items.product': 'Laptop' })

// Multiple nested levels
db.users.find({ 'address.zip.code': '10001' })
```

### Array Queries
```javascript
// Array contains value
db.users.find({ tags: 'javascript' })

// Array contains multiple values (order doesn't matter)
db.users.find({ tags: { $all: ['javascript', 'mongodb'] } })

// Exact array match
db.users.find({ tags: ['javascript', 'mongodb'] })

// Array at specific index
db.users.find({ 'scores.0': 85 })

// Array length
db.users.find({ tags: { $size: 3 } })

// Match array element with conditions
db.users.find({
  scores: { $elemMatch: { $gte: 80, $lte: 90 } }
})
```

### Date Queries
```javascript
// Specific date
db.users.find({ createdAt: new Date('2024-01-01') })

// Date range
db.users.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  }
})

// Before/after date
db.users.find({ createdAt: { $lt: new Date() } })

// Relative date (last 30 days)
db.users.find({
  createdAt: {
    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
})
```

### Null and Missing Fields
```javascript
// Field is null
db.users.find({ email: null })

// Field is null or missing
db.users.find({ email: { $in: [null, false] } })

// Field exists and is not null
db.users.find({ email: { $exists: true, $ne: null } })

// Field is missing
db.users.find({ email: { $exists: false } })
```

### Type Queries
```javascript
// String type
db.users.find({ name: { $type: 'string' } })

// Number type
db.users.find({ age: { $type: 'number' } })

// Array type
db.users.find({ tags: { $type: 'array' } })

// Date type
db.users.find({ createdAt: { $type: 'date' } })

// Multiple types
db.users.find({ age: { $type: ['int', 'long'] } })
```

## Regular Expression Queries

```javascript
// Starts with
db.users.find({ name: /^John/ })

// Ends with
db.users.find({ name: /Doe$/ })

// Contains
db.users.find({ name: /ohn/ })

// Case-insensitive
db.users.find({ name: /^John/i })

// Multiple patterns
db.users.find({ name: { $in: [/^John/, /^Jane/] } })

// Using $regex operator
db.users.find({ name: { $regex: '^John', $options: 'i' } })
```

## Text Search

### Create Text Index
```javascript
db.posts.createIndex({ content: 'text' })
```

### Text Search
```javascript
// Simple search
db.posts.find({ $text: { $search: 'mongodb tutorial' } })

// Phrase search
db.posts.find({ $text: { $search: '"mongodb tutorial"' } })

// Exclude terms
db.posts.find({ $text: { $search: 'mongodb -tutorial' } })

// With score
db.posts.find(
  { $text: { $search: 'mongodb' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } })
```

## Geospatial Queries

### 2D Index (Legacy)
```javascript
db.places.createIndex({ location: '2d' })

// Near point
db.places.find({
  location: {
    $near: [40, -73],
    $maxDistance: 10
  }
})
```

### 2DSphere Index (Recommended)
```javascript
db.places.createIndex({ location: '2dsphere' })

// Near point
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-73.9667, 40.78]
      },
      $maxDistance: 1000
    }
  }
})

// Within polygon
db.places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.9, 40.7],
          [-73.9, 40.8],
          [-74.0, 40.8],
          [-74.0, 40.7],
          [-73.9, 40.7]
        ]]
      }
    }
  }
})
```

## Field Comparison

### Using $expr
```javascript
// Compare two fields
db.products.find({
  $expr: { $gt: ['$price', '$cost'] }
})

// Complex comparison
db.users.find({
  $expr: {
    $and: [
      { $gt: ['$age', 18] },
      { $lt: ['$age', '$retirementAge'] }
    ]
  }
})
```

## Conditional Queries

### Using $cond
```javascript
db.users.aggregate([
  {
    $project: {
      name: 1,
      status: {
        $cond: {
          if: { $gte: ['$age', 18] },
          then: 'adult',
          else: 'minor'
        }
      }
    }
  }
])
```

## Query Performance

### Use Indexes
```javascript
// Create index on frequently queried fields
db.users.createIndex({ age: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ name: 1, age: 1 })  // Compound index
```

### Explain Query
```javascript
// Check query execution plan
db.users.find({ age: 30 }).explain()

// Check if index is used
db.users.find({ age: 30 }).explain('executionStats')
```

### Covered Query
```javascript
// All fields in query are in index
db.users.find({ age: 30 }, { _id: 0, age: 1, name: 1 })
```

## Node.js Query Examples

### Dynamic Query Building
```javascript
function buildQuery(filters) {
  const query = {};

  if (filters.minAge) {
    query.age = { ...query.age, $gte: filters.minAge };
  }

  if (filters.maxAge) {
    query.age = { ...query.age, $lte: filters.maxAge };
  }

  if (filters.city) {
    query.city = filters.city;
  }

  if (filters.tags) {
    query.tags = { $in: filters.tags };
  }

  return query;
}

const query = buildQuery({ minAge: 25, maxAge: 35, tags: ['js'] });
const users = await db.users.find(query).toArray();
```

### Query with Pagination
```javascript
async function getPaginatedResults(page, pageSize, filters) {
  const skip = (page - 1) * pageSize;
  const query = buildQuery(filters);

  const [results, total] = await Promise.all([
    db.users.find(query).skip(skip).limit(pageSize).toArray(),
    db.users.countDocuments(query)
  ]);

  return {
    results,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}
```

## Practical Query Patterns

### Search with Multiple Filters
```javascript
db.products.find({
  $and: [
    { price: { $gte: 100, $lte: 500 } },
    { category: 'Electronics' },
    { inStock: true },
    { rating: { $gte: 4 } }
  ]
})
```

### Find by Date Range and Status
```javascript
db.orders.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  },
  status: { $in: ['completed', 'shipped'] }
})
```

### Find Users with Specific Interests
```javascript
db.users.find({
  interests: {
    $all: ['programming', 'javascript'],
    $size: { $gte: 3 }
  }
})
```

### Find Documents with Array Operations
```javascript
db.posts.find({
  comments: {
    $elemMatch: {
      author: 'John',
      likes: { $gt: 10 }
    }
  }
})
```

## Query Optimization Tips

1. **Use indexes** on frequently queried fields
2. **Use covered queries** when possible
3. **Limit results** with `limit()` for large datasets
4. **Use projection** to return only needed fields
5. **Avoid `$where`** - it's slow and has security risks
6. **Use `$regex` carefully** - leading wildcards prevent index use
7. **Use `$in` instead of multiple `$or`** for same field
8. **Check execution plan** with `explain()`

## Summary

```javascript
// Comparison
db.collection.find({ field: { $gt: 25 } })

// Logical
db.collection.find({ $or: [{ a: 1 }, { b: 2 }] })

// Array
db.collection.find({ tags: { $all: ['a', 'b'] } })

// Nested
db.collection.find({ 'address.city': 'NYC' })

// Regex
db.collection.find({ name: /^John/i })

// Date range
db.collection.find({ date: { $gte: start, $lte: end } })

// Text search
db.collection.find({ $text: { $search: 'keyword' } })

// Field comparison
db.collection.find({ $expr: { $gt: ['$a', '$b'] } })
```

## Next Steps

- Aggregation framework
- Update operations
- Delete operations
