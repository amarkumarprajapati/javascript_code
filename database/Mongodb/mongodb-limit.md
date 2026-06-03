# MongoDB Limit

> Limiting the number of documents returned in MongoDB queries.

## limit() Method

Restrict the number of documents returned:

```javascript
// Return only 5 documents
db.users.find().limit(5)

// Return 10 documents
db.products.find().limit(10)
```

## Basic Usage

### Limit Results
```javascript
// Get first 10 users
db.users.find().limit(10)

// Get top 5 products by price
db.products.find().sort({ price: -1 }).limit(5)
```

### Limit with Query
```javascript
// Limit filtered results
db.users.find({ age: { $gte: 18 } }).limit(10)
```

## Pagination

### Basic Pagination
```javascript
const page = 2
const pageSize = 10
const skip = (page - 1) * pageSize

db.users.find().skip(skip).limit(pageSize)
```

### Pagination with Sort
```javascript
const page = 1
const pageSize = 20

db.users
  .find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * pageSize)
  .limit(pageSize)
```

## limit() with Other Operations

### With sort()
```javascript
// Top 10 most expensive
db.products.find().sort({ price: -1 }).limit(10)

// Bottom 10 cheapest
db.products.find().sort({ price: 1 }).limit(10)
```

### With skip()
```javascript
// Skip first 5, get next 10
db.users.find().skip(5).limit(10)
```

### With projection
```javascript
// Limit and project
db.users.find({}, { name: 1, email: 1 }).limit(10)
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function limitDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Simple limit
    const users = await collection.find().limit(10).toArray();
    console.log('First 10 users:', users);

    // Pagination
    const page = 2;
    const pageSize = 10;
    const paginated = await collection
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // With sort
    const topUsers = await collection
      .find()
      .sort({ score: -1 })
      .limit(5)
      .toArray();

  } finally {
    await client.close();
  }
}

limitDocuments().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  score: Number
});

const User = mongoose.model('User', userSchema);

async function limitUsers() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Simple limit
  const users = await User.find().limit(10);

  // Pagination
  const page = await User.find()
    .skip(10)
    .limit(10)
    .sort({ score: -1 });

  await mongoose.connection.close();
}

limitUsers().catch(console.error);
```

## Practical Examples

### Get Top N Results
```javascript
// Top 10 highest scores
db.users.find().sort({ score: -1 }).limit(10)

// Top 5 most recent posts
db.posts.find().sort({ createdAt: -1 }).limit(5)

// Top 3 most expensive products
db.products.find().sort({ price: -1 }).limit(3)
```

### Get Latest N Documents
```javascript
// Last 10 orders
db.orders.find().sort({ createdAt: -1 }).limit(10)

// Recent 20 log entries
db.logs.find().sort({ timestamp: -1 }).limit(20)
```

### Random Sampling
```javascript
// Get random 5 documents
db.users.aggregate([
  { $sample: { size: 5 } }
])
```

### Limit with Aggregation
```javascript
db.users.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $sort: { score: -1 } },
  { $limit: 10 }
])
```

## Performance Considerations

### Large skip() Values
Skip can be slow for large values:

```javascript
// This can be slow for large page numbers
db.users.find().skip(10000).limit(10)

// Better: use range-based pagination
db.users.find({ _id: { $gt: lastId } }).limit(10)
```

### Index Usage
```javascript
// Create index for efficient pagination
db.users.createIndex({ createdAt: -1 })

// Query will use index
db.users.find().sort({ createdAt: -1 }).limit(10)
```

## Pagination Patterns

### Offset-Based Pagination
```javascript
function getPaginatedResults(page, pageSize) {
  const skip = (page - 1) * pageSize;
  return db.users
    .find()
    .skip(skip)
    .limit(pageSize)
    .toArray();
}
```

### Cursor-Based Pagination
```javascript
async function getCursorBasedResults(lastId, pageSize) {
  return db.users
    .find({ _id: { $gt: lastId } })
    .sort({ _id: 1 })
    .limit(pageSize)
    .toArray();
}
```

### Time-Based Pagination
```javascript
async function getTimeBasedResults(lastDate, pageSize) {
  return db.posts
    .find({ createdAt: { $lt: lastDate } })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .toArray();
}
```

## Count with Limit

```javascript
// Count total documents
const total = await db.users.countDocuments();

// Count with limit (use aggregation)
const count = await db.users.aggregate([
  { $limit: 10 },
  { $count: 'count' }
]).toArray();
```

## Summary

```javascript
// Simple limit
db.collection.find().limit(10)

// Pagination
db.collection.find().skip(10).limit(10)

// With sort
db.collection.find().sort({ field: -1 }).limit(5)

// With query
db.collection.find({ query }).limit(10)

// Aggregation limit
db.collection.aggregate([
  { $match: { query } },
  { $limit: 10 }
])

// Random sample
db.collection.aggregate([
  { $sample: { size: 5 } }
])
```

## Best Practices

1. **Use `limit()`** to reduce memory usage
2. **Combine with `sort()`** for consistent results
3. **Avoid large `skip()`** values for performance
4. **Use cursor-based pagination** for large datasets
5. **Create indexes** on sort fields
6. **Use `$sample`** for random sampling

## Next Steps

- Join collections
- Aggregation framework
- Update documents
