# MongoDB Update

> Updating documents in MongoDB collections.

## Update Methods

### updateOne()
Update a single document:

```javascript
db.users.updateOne(
  { name: 'John' },
  { $set: { age: 31 } }
)
```

**Returns:** Object with `acknowledged`, `matchedCount`, and `modifiedCount`

### updateMany()
Update multiple documents:

```javascript
db.users.updateMany(
  { status: 'inactive' },
  { $set: { status: 'active' } }
)
```

### replaceOne()
Replace entire document:

```javascript
db.users.replaceOne(
  { _id: ObjectId('...') },
  { name: 'John Doe', age: 31, email: 'john@example.com' }
)
```

## Update Operators

### $set
Set or update a field:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $set: { age: 31, city: 'New York' } }
)
```

### $unset
Remove a field:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $unset: { temporaryField: '' } }
)
```

### $inc
Increment a field value:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $inc: { loginCount: 1, score: 5 } }
)
```

### $mul
Multiply a field value:

```javascript
db.products.updateOne(
  { _id: ObjectId('...') },
  { $mul: { price: 0.9 } }  // 10% discount
)
```

### $rename
Rename a field:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $rename: { 'oldName': 'newName' } }
)
```

### $min / $max
Update only if value is less/greater than current:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $min: { age: 18 } }  // Set to 18 if current is higher
)

db.users.updateOne(
  { _id: ObjectId('...') },
  { $max: { score: 100 } }  // Set to 100 if current is lower
)
```

## Array Update Operators

### $push
Add element to array:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $push: { tags: 'javascript' } }
)
```

### $push with $each
Add multiple elements:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $push: { tags: { $each: ['js', 'mongo', 'node'] } } }
)
```

### $push with $slice
Limit array size:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $push: { 
    tags: { 
      $each: ['new'],
      $slice: -10  // Keep last 10 elements
    } 
  } }
)
```

### $addToSet
Add element if not already present:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $addToSet: { tags: 'javascript' } }
)
```

### $pull
Remove element from array:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $pull: { tags: 'deprecated' } }
)
```

### $pullAll
Remove multiple elements:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $pullAll: { tags: ['spam', 'bot'] } }
)
```

### $pop
Remove first or last element:

```javascript
// Remove last element
db.users.updateOne(
  { _id: ObjectId('...') },
  { $pop: { tags: 1 } }
)

// Remove first element
db.users.updateOne(
  { _id: ObjectId('...') },
  { $pop: { tags: -1 } }
)
```

## Update Options

### upsert
Create document if not found:

```javascript
db.users.updateOne(
  { email: 'john@example.com' },
  { $set: { name: 'John', age: 30 } },
  { upsert: true }
)
```

### multi (deprecated, use updateMany)
```javascript
// Old way
db.users.update(
  { status: 'inactive' },
  { $set: { status: 'active' } },
  { multi: true }
)

// New way
db.users.updateMany(
  { status: 'inactive' },
  { $set: { status: 'active' } }
)
```

### arrayFilters
Update specific array elements:

```javascript
db.users.updateOne(
  { _id: ObjectId('...') },
  { $set: { 'grades.$[elem].score': 95 } },
  { 
    arrayFilters: [
      { 'elem.subject': 'Math' }
    ]
  }
)
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function updateDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Update one
    const result1 = await collection.updateOne(
      { name: 'John' },
      { $set: { age: 31 } }
    );
    console.log('Matched:', result1.matchedCount, 'Modified:', result1.modifiedCount);

    // Update many
    const result2 = await collection.updateMany(
      { status: 'inactive' },
      { $set: { status: 'active' } }
    );
    console.log('Modified:', result2.modifiedCount);

    // Upsert
    const result3 = await collection.updateOne(
      { email: 'new@example.com' },
      { $set: { name: 'New User' } },
      { upsert: true }
    );
    console.log('Upserted ID:', result3.upsertedId);

  } finally {
    await client.close();
  }
}

updateDocuments().catch(console.error);
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

async function updateUsers() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Update one
  await User.updateOne(
    { name: 'John' },
    { age: 31 }
  );

  // Update many
  await User.updateMany(
    { status: 'inactive' },
    { status: 'active' }
  );

  // Find and update
  const updated = await User.findOneAndUpdate(
    { name: 'Alice' },
    { age: 26 },
    { new: true }  // Return updated document
  );
  console.log('Updated:', updated);

  await mongoose.connection.close();
}

updateUsers().catch(console.error);
```

## Practical Examples

### Increment Counter
```javascript
db.users.updateOne(
  { _id: userId },
  { $inc: { loginCount: 1 } }
)
```

### Update Timestamp
```javascript
db.users.updateOne(
  { _id: userId },
  { $set: { updatedAt: new Date() } }
)
```

### Add to Array if Not Exists
```javascript
db.users.updateOne(
  { _id: userId },
  { $addToSet: { tags: 'javascript' } }
)
```

### Remove from Array
```javascript
db.users.updateOne(
  { _id: userId },
  { $pull: { tags: 'deprecated' } }
)
```

### Conditional Update
```javascript
db.users.updateOne(
  { _id: userId },
  {
    $set: {
      status: {
        $cond: {
          if: { $gte: ['$age', 18] },
          then: 'adult',
          else: 'minor'
        }
      }
    }
  }
)
```

## findOneAndUpdate()

Update and return the document:

```javascript
const updated = db.users.findOneAndUpdate(
  { name: 'John' },
  { $set: { age: 31 } },
  {
    returnDocument: 'after',  // or 'before'
    projection: { name: 1, age: 1 },
    sort: { age: -1 }
  }
)
```

## Bulk Update

### Using bulkWrite()
```javascript
db.users.bulkWrite([
  {
    updateOne: {
      filter: { _id: ObjectId('...') },
      update: { $set: { age: 31 } }
    }
  },
  {
    updateMany: {
      filter: { status: 'inactive' },
      update: { $set: { status: 'active' } }
    }
  }
])
```

## Update with Transactions

```javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const db = client.db('mydatabase');
    
    await db.collection('orders').updateOne(
      { _id: orderId },
      { $set: { status: 'shipped' } },
      { session }
    );
    
    await db.collection('inventory').updateOne(
      { productId: productId },
      { $inc: { quantity: -1 } },
      { session }
    );
  });
} finally {
  await session.endSession();
}
```

## Summary

```javascript
// Update one
db.collection.updateOne({ query }, { $set: { field: value } })

// Update many
db.collection.updateMany({ query }, { $set: { field: value } })

// Replace document
db.collection.replaceOne({ query }, { newDocument })

// Upsert
db.collection.updateOne({ query }, { $set: {...} }, { upsert: true })

// Array operations
db.collection.updateOne({ query }, { $push: { field: value } })
db.collection.updateOne({ query }, { $pull: { field: value } })

// Increment
db.collection.updateOne({ query }, { $inc: { field: 1 } })

// Find and update
db.collection.findOneAndUpdate({ query }, { $set: {...} })
```

## Best Practices

1. **Use indexes** on filter fields for faster updates
2. **Use `$inc`** for counters instead of read-modify-write
3. **Use `$addToSet`** to avoid duplicates in arrays
4. **Use transactions** for related updates
5. **Check `modifiedCount`** to verify updates
6. **Use `upsert`** when you want to create if not exists

## Next Steps

- Delete documents
- Limit results
- Join collections
