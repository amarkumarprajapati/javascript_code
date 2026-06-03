# MongoDB Insert

> Inserting documents into MongoDB collections.

## Insert Methods

### insertOne()
Insert a single document into a collection:

```javascript
db.users.insertOne({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  createdAt: new Date()
})
```

**Returns:** An object with `acknowledged` and `insertedId`

### insertMany()
Insert multiple documents at once:

```javascript
db.users.insertMany([
  { name: 'Alice', age: 25, email: 'alice@example.com' },
  { name: 'Bob', age: 35, email: 'bob@example.com' },
  { name: 'Charlie', age: 28, email: 'charlie@example.com' }
])
```

**Returns:** Object with `acknowledged` and `insertedIds`

## Document Structure

### Basic Document
```javascript
{
  _id: ObjectId("..."),  // Auto-generated if not provided
  name: 'John',
  age: 30
}
```

### Nested Document
```javascript
{
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA'
  }
}
```

### Array Field
```javascript
{
  name: 'John',
  tags: ['developer', 'javascript', 'mongodb'],
  scores: [85, 90, 78]
}
```

### Mixed Types
```javascript
{
  name: 'John',
  age: 30,
  active: true,
  balance: 100.50,
  metadata: null,
  createdAt: new Date()
}
```

## Custom _id

You can specify your own `_id`:

```javascript
db.users.insertOne({
  _id: 'custom-id-123',
  name: 'John',
  age: 30
})
```

**Note:** `_id` must be unique within the collection.

## Insert Options

### ordered (default: true)
Controls whether inserts stop on error:

```javascript
// Stop on first error (default)
db.users.insertMany([
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Alice' }  // Duplicate _id - will stop here
], { ordered: true })

// Continue on error
db.users.insertMany([
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Alice' }  // Duplicate _id - will skip and continue
], { ordered: false })
```

### writeConcern
Controls write acknowledgment:

```javascript
db.users.insertOne(
  { name: 'John' },
  { writeConcern: { w: 'majority' } }
)
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function insertDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Insert one
    const result1 = await collection.insertOne({
      name: 'John',
      age: 30
    });
    console.log('Inserted with _id:', result1.insertedId);

    // Insert many
    const result2 = await collection.insertMany([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ]);
    console.log('Inserted count:', result2.insertedCount);

  } finally {
    await client.close();
  }
}

insertDocuments().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

const User = mongoose.model('User', userSchema);

async function insertUser() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Create and save
  const user = new User({ name: 'John', age: 30 });
  await user.save();
  console.log('User saved:', user._id);

  // Create many
  await User.create([
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 35 }
  ]);

  await mongoose.connection.close();
}

insertUser().catch(console.error);
```

## Bulk Insert

### Using bulkWrite()
For complex bulk operations:

```javascript
db.users.bulkWrite([
  {
    insertOne: {
      document: { name: 'John', age: 30 }
    }
  },
  {
    updateOne: {
      filter: { name: 'Alice' },
      update: { $set: { age: 26 } }
    }
  },
  {
    deleteOne: {
      filter: { name: 'Bob' }
    }
  }
])
```

## Insert with Validation

If collection has schema validation:

```javascript
// Valid insert
db.users.insertOne({
  name: 'John',
  email: 'john@example.com'  // Matches validation
})

// Invalid insert - will fail
db.users.insertOne({
  name: 'John',
  email: 'invalid-email'  // Doesn't match pattern
})
```

## Insert from Other Source

### From JSON File
```javascript
// Load JSON file in shell
load('data.json')

// Insert
db.users.insertMany(data)
```

### From CSV (using mongoimport)
```bash
mongoimport --db mydatabase --collection users --type csv --headerline --file users.csv
```

### From JSON (using mongoimport)
```bash
mongoimport --db mydatabase --collection users --file users.json --jsonArray
```

## Practical Examples

### Insert User with Address
```javascript
db.users.insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  },
  preferences: {
    newsletter: true,
    notifications: false
  }
})
```

### Insert Product with Tags
```javascript
db.products.insertOne({
  name: 'Laptop',
  price: 999.99,
  category: 'Electronics',
  tags: ['computer', 'portable', 'tech'],
  specifications: {
    cpu: 'Intel i7',
    ram: '16GB',
    storage: '512GB SSD'
  },
  stock: 50,
  available: true
})
```

### Insert Order with Items
```javascript
db.orders.insertOne({
  orderId: 'ORD-001',
  customer: {
    id: ObjectId('...'),
    name: 'John Doe'
  },
  items: [
    { productId: ObjectId('...'), name: 'Laptop', quantity: 1, price: 999.99 },
    { productId: ObjectId('...'), name: 'Mouse', quantity: 2, price: 29.99 }
  ],
  total: 1059.97,
  status: 'pending',
  createdAt: new Date()
})
```

### Insert Log Entry (Capped Collection)
```javascript
db.logs.insertOne({
  timestamp: new Date(),
  level: 'INFO',
  message: 'User logged in',
  userId: ObjectId('...'),
  ip: '192.168.1.1'
})
```

## Error Handling

### Duplicate Key Error
```javascript
try {
  db.users.insertOne({ _id: 1, name: 'John' })
  db.users.insertOne({ _id: 1, name: 'Alice' })  // Error!
} catch (error) {
  if (error.code === 11000) {
    console.log('Duplicate key error');
  }
}
```

### Validation Error
```javascript
try {
  db.users.insertOne({ name: 'John' })  // Missing required field
} catch (error) {
  console.log('Validation error:', error.message);
}
```

## Performance Tips

1. **Use insertMany()** for multiple documents - faster than multiple insertOne()
2. **Batch inserts** - Insert in batches of 100-1000 documents
3. **Disable indexes** during bulk inserts, then rebuild
4. **Use ordered: false** if you want to continue on errors
5. **Consider writeConcern** - Balance between speed and durability

## Common Patterns

### Upsert (Insert or Update)
```javascript
db.users.updateOne(
  { email: 'john@example.com' },
  { $set: { name: 'John', age: 30 } },
  { upsert: true }
)
```

### Insert with Timestamp
```javascript
db.users.insertOne({
  name: 'John',
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Insert with Auto-increment
```javascript
// Get next sequence number
const seq = db.counters.findOneAndUpdate(
  { _id: 'userId' },
  { $inc: { seq: 1 } },
  { returnNewDocument: true }
)

db.users.insertOne({
  _id: seq.seq,
  name: 'John'
})
```

## Summary

```javascript
// Insert one
db.collection.insertOne({ document })

// Insert many
db.collection.insertMany([{ doc1 }, { doc2 }])

// With options
db.collection.insertMany(docs, { ordered: false })

// Bulk operations
db.collection.bulkWrite([
  { insertOne: { document: { ... } } },
  { updateOne: { ... } }
])
```

## Next Steps

- Query documents
- Update documents
- Delete documents
