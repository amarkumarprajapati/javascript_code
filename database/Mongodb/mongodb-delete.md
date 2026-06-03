# MongoDB Delete

> Deleting documents from MongoDB collections.

## Delete Methods

### deleteOne()
Delete a single document:

```javascript
db.users.deleteOne({ name: 'John' })
```

**Returns:** Object with `acknowledged` and `deletedCount`

### deleteMany()
Delete multiple documents:

```javascript
db.users.deleteMany({ age: { $lt: 18 } })
```

**Returns:** Object with `acknowledged` and `deletedCount`

## Basic Deletion

### Delete by _id
```javascript
db.users.deleteOne({ _id: ObjectId('...') })
```

### Delete by Field
```javascript
db.users.deleteOne({ email: 'john@example.com' })
```

### Delete Multiple
```javascript
db.users.deleteMany({ status: 'inactive' })
```

## Delete with Query Operators

### Comparison Operators
```javascript
// Delete users older than 65
db.users.deleteMany({ age: { $gt: 65 } })

// Delete users in age range
db.users.deleteMany({ age: { $gte: 18, $lte: 25 } })

// Delete users with specific values
db.users.deleteMany({ city: { $in: ['Old City', 'Abandoned'] } })
```

### Logical Operators
```javascript
// Delete with OR
db.users.deleteMany({
  $or: [
    { status: 'deleted' },
    { lastLogin: { $lt: new Date('2020-01-01') } }
  ]
})

// Delete with AND
db.users.deleteMany({
  $and: [
    { status: 'inactive' },
    { lastLogin: { $lt: new Date('2023-01-01') } }
  ]
})
```

### Array Operators
```javascript
// Delete documents with specific array value
db.users.deleteMany({ tags: 'deprecated' })

// Delete documents where array contains all values
db.users.deleteMany({ tags: { $all: ['spam', 'bot'] } })
```

## Delete Options

### writeConcern
```javascript
db.users.deleteOne(
  { name: 'John' },
  { writeConcern: { w: 'majority' } }
)
```

## Delete All Documents

### Delete All in Collection
```javascript
db.users.deleteMany({})
```

**Warning:** This deletes all documents but keeps the collection.

### Drop Collection (faster)
```javascript
db.users.drop()
```

**Warning:** This deletes the collection and all its indexes.

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function deleteDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Delete one
    const result1 = await collection.deleteOne({ name: 'John' });
    console.log('Deleted count:', result1.deletedCount);

    // Delete many
    const result2 = await collection.deleteMany({ age: { $lt: 18 } });
    console.log('Deleted count:', result2.deletedCount);

  } finally {
    await client.close();
  }
}

deleteDocuments().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  status: String
});

const User = mongoose.model('User', userSchema);

async function deleteUsers() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Delete one
  await User.deleteOne({ name: 'John' });

  // Delete many
  await User.deleteMany({ status: 'inactive' });

  // Find and delete
  const deleted = await User.findOneAndDelete({ name: 'Alice' });
  console.log('Deleted document:', deleted);

  await mongoose.connection.close();
}

deleteUsers().catch(console.error);
```

## Practical Examples

### Delete Expired Sessions
```javascript
db.sessions.deleteMany({
  expiresAt: { $lt: new Date() }
})
```

### Delete Soft-Deleted Records
```javascript
// After 30 days of soft deletion
db.users.deleteMany({
  deletedAt: {
    $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
})
```

### Delete by Date Range
```javascript
db.logs.deleteMany({
  createdAt: {
    $gte: new Date('2020-01-01'),
    $lte: new Date('2020-12-31')
  }
})
```

## findOneAndDelete()

Delete and return the deleted document:

```javascript
const deleted = db.users.findOneAndDelete({ name: 'John' })
console.log('Deleted:', deleted)
```

## Performance Considerations

### Use Indexes
```javascript
// Create index for faster deletion
db.users.createIndex({ status: 1 })

// Delete will use index
db.users.deleteMany({ status: 'inactive' })
```

### Delete in Batches
```javascript
// For large deletions, delete in batches
async function deleteInBatches() {
  let deletedCount = 0;
  let batchDeleted = 1;

  while (batchDeleted > 0) {
    const result = await db.users.deleteMany(
      { status: 'inactive' },
      { limit: 1000 }
    );
    batchDeleted = result.deletedCount;
    deletedCount += batchDeleted;
  }

  console.log('Total deleted:', deletedCount);
}
```

## Summary

```javascript
// Delete one
db.collection.deleteOne({ query })

// Delete many
db.collection.deleteMany({ query })

// Delete all
db.collection.deleteMany({})

// Find and delete
db.collection.findOneAndDelete({ query })

// Drop collection
db.collection.drop()
```

## Best Practices

1. **Use indexes** on filter fields for faster deletion
2. **Delete in batches** for large datasets
3. **Use transactions** for related deletions
4. **Backup before bulk deletion**
5. **Test delete queries** with `find()` first
6. **Use `deleteMany()`** instead of `remove()`

## Next Steps

- Update documents
- Limit results
- Join collections
