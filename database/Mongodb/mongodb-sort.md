# MongoDB Sort

> Sorting query results in MongoDB.

## Basic Sorting

### sort() Method
Sort documents by one or more fields:

```javascript
// Ascending order (1)
db.users.find().sort({ age: 1 })

// Descending order (-1)
db.users.find().sort({ age: -1 })

// Sort by string field
db.users.find().sort({ name: 1 })
```

## Multiple Field Sorting

Sort by multiple fields with priority:

```javascript
// Sort by age ascending, then name ascending
db.users.find().sort({ age: 1, name: 1 })

// Sort by city descending, then age ascending
db.users.find().sort({ city: -1, age: 1 })

// Sort by multiple fields with different directions
db.products.find().sort({ category: 1, price: -1, name: 1 })
```

## Sorting with Query

Combine sort with other operations:

```javascript
// Query and sort
db.users.find({ age: { $gte: 25 } }).sort({ name: 1 })

// With projection
db.users.find({}, { name: 1, age: 1 }).sort({ age: -1 })

// With limit
db.users.find().sort({ age: -1 }).limit(10)

// With skip (pagination)
db.users.find().sort({ age: 1 }).skip(10).limit(10)
```

## Sorting by Nested Fields

```javascript
// Sort by nested field
db.users.find().sort({ 'address.city': 1 })

// Sort by array element
db.users.find().sort({ 'scores.0': -1 })

// Sort by multiple nested fields
db.users.find().sort({ 'address.city': 1, 'address.zip': 1 })
```

## Sorting by Date

```javascript
// Sort by date ascending (oldest first)
db.posts.find().sort({ createdAt: 1 })

// Sort by date descending (newest first)
db.posts.find().sort({ createdAt: -1 })

// Sort by date range
db.posts.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  }
}).sort({ createdAt: -1 })
```

## Sorting by Array

```javascript
// Sort by array length (requires aggregation)
db.users.aggregate([
  {
    $addFields: {
      tagCount: { $size: '$tags' }
    }
  },
  { $sort: { tagCount: -1 } }
])

// Sort by array element
db.users.find().sort({ 'tags.0': 1 })
```

## Sorting with Null Values

MongoDB sorts null values before other values:

```javascript
// Documents with null age will appear first
db.users.find().sort({ age: 1 })

// To put nulls last, use aggregation
db.users.aggregate([
  {
    $addFields: {
      sortAge: { $ifNull: ['$age', 999999] }
    }
  },
  { $sort: { sortAge: 1 } }
])
```

## Sorting by Computed Fields

```javascript
// Sort by computed field using aggregation
db.products.aggregate([
  {
    $addFields: {
      profit: { $subtract: ['$price', '$cost'] }
    }
  },
  { $sort: { profit: -1 } }
])

// Sort by field length
db.users.aggregate([
  {
    $addFields: {
      nameLength: { $strLenCP: '$name' }
    }
  },
  { $sort: { nameLength: -1 } }
])
```

## Sorting with Text Search Score

```javascript
// Sort by text search relevance
db.posts.find(
  { $text: { $search: 'mongodb tutorial' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } })
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function sortDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Sort ascending
    const ascUsers = await collection
      .find()
      .sort({ age: 1 })
      .toArray();

    // Sort descending
    const descUsers = await collection
      .find()
      .sort({ age: -1 })
      .toArray();

    // Multiple fields
    const multiSort = await collection
      .find()
      .sort({ city: 1, age: -1 })
      .toArray();

    // With pagination
    const page = await collection
      .find()
      .sort({ createdAt: -1 })
      .skip(10)
      .limit(10)
      .toArray();

  } finally {
    await client.close();
  }
}

sortDocuments().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String
});

const User = mongoose.model('User', userSchema);

async function sortUsers() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Sort ascending
  const ascUsers = await User.find().sort('age');

  // Sort descending
  const descUsers = await User.find().sort('-age');

  // Multiple fields
  const multiSort = await User.find().sort('city -age');

  // With query
  const filtered = await User
    .find({ age: { $gte: 25 } })
    .sort('name');

  await mongoose.connection.close();
}

sortUsers().catch(console.error);
```

## Practical Examples

### Sort Products by Price
```javascript
// Low to high
db.products.find().sort({ price: 1 })

// High to low
db.products.find().sort({ price: -1 })

// By category, then price
db.products.find().sort({ category: 1, price: 1 })
```

### Sort Users by Last Login
```javascript
// Most recent first
db.users.find().sort({ lastLogin: -1 })

// Active users (logged in recently)
db.users.find({
  lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
}).sort({ lastLogin: -1 })
```

### Sort Posts by Popularity
```javascript
// By views
db.posts.find().sort({ views: -1 })

// By likes
db.posts.find().sort({ likes: -1 })

// By engagement (likes + comments)
db.posts.aggregate([
  {
    $addFields: {
      engagement: { $add: ['$likes', '$comments'] }
    }
  },
  { $sort: { engagement: -1 } }
])
```

### Sort Orders by Date and Status
```javascript
db.orders.find().sort({
  createdAt: -1,
  status: 1  // pending, shipped, delivered
})
```

## Sorting Performance

### Index Usage
```javascript
// Create index for efficient sorting
db.users.createIndex({ age: 1 })
db.users.createIndex({ age: 1, name: 1 })

// Sort will use index if available
db.users.find().sort({ age: 1 })
```

### Memory Limit
MongoDB has a 32MB memory limit for sort operations:

```javascript
// This may fail if result set is large
db.users.find().sort({ age: 1 })

// Use allowDiskUse to use temporary files
db.users.find().sort({ age: 1 }).allowDiskUse(true)
```

### Compound Index for Sort
```javascript
// Create compound index matching sort order
db.users.createIndex({ city: 1, age: -1 })

// Query and sort using same index
db.users.find({ city: 'New York' }).sort({ age: -1 })
```

## Sorting with Aggregation

```javascript
// Sort after group
db.orders.aggregate([
  {
    $group: {
      _id: '$customerId',
      totalSpent: { $sum: '$amount' }
    }
  },
  { $sort: { totalSpent: -1 } }
])

// Sort after project
db.users.aggregate([
  {
    $project: {
      name: 1,
      age: 1,
      ageGroup: {
        $cond: {
          if: { $lt: ['$age', 25] },
          then: 'young',
          else: 'adult'
        }
      }
    }
  },
  { $sort: { ageGroup: 1, age: 1 } }
])
```

## Natural Order Sort

```javascript
// Sort by natural order (insertion order)
db.users.find().sort({ $natural: 1 })

// Reverse natural order
db.users.find().sort({ $natural: -1 })
```

## Sorting with Collation

```javascript
// Case-insensitive sort
db.users.find().sort({ name: 1 }).collation({ locale: 'en' })

// Numeric sorting for strings
db.products.find().sort({ price: 1 }).collation({ numericOrdering: true })

// Locale-specific sort
db.users.find().sort({ name: 1 }).collation({ locale: 'fr' })
```

## Common Patterns

### Pagination with Sort
```javascript
function getPaginatedResults(page, pageSize) {
  const skip = (page - 1) * pageSize;
  
  return db.users
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();
}
```

### Top N Results
```javascript
// Top 10 most expensive products
db.products.find().sort({ price: -1 }).limit(10)

// Top 5 most active users
db.users.find().sort({ loginCount: -1 }).limit(5)
```

### Sort with Dynamic Field
```javascript
function sortByField(field, direction = 1) {
  const sortObj = {};
  sortObj[field] = direction;
  return db.users.find().sort(sortObj);
}

// Usage
sortByField('age', 1)
sortByField('name', -1)
```

## Summary

```javascript
// Ascending
db.collection.find().sort({ field: 1 })

// Descending
db.collection.find().sort({ field: -1 })

// Multiple fields
db.collection.find().sort({ field1: 1, field2: -1 })

// With query
db.collection.find({ query }).sort({ field: 1 })

// With pagination
db.collection.find().sort({ field: 1 }).skip(10).limit(10)

// With disk use
db.collection.find().sort({ field: 1 }).allowDiskUse(true)

// With collation
db.collection.find().sort({ field: 1 }).collation({ locale: 'en' })
```

## Best Practices

1. **Use indexes** for frequently sorted fields
2. **Limit results** with `limit()` to avoid memory issues
3. **Use `allowDiskUse(true)`** for large sorts
4. **Sort direction should match index** for optimal performance
5. **Avoid sorting on large datasets** without indexes
6. **Use compound indexes** for multi-field sorts

## Next Steps

- Limit results
- Delete documents
- Update documents
