# MongoDB Join

> Joining collections in MongoDB using $lookup and embedding.

## MongoDB Join Methods

### $lookup (Aggregation)
Join collections similar to SQL LEFT JOIN:

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  }
])
```

### Embedding (Denormalization)
Store related data within documents:

```javascript
{
  _id: ObjectId('...'),
  name: 'John',
  orders: [
    { orderId: '...', total: 100 },
    { orderId: '...', total: 200 }
  ]
}
```

## $lookup Syntax

### Basic $lookup
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',           // Collection to join
      localField: 'userId',    // Field in current collection
      foreignField: '_id',     // Field in joined collection
      as: 'userDetails'        // Output array field
    }
  }
])
```

### Result Structure
```javascript
{
  _id: ObjectId('...'),
  userId: ObjectId('...'),
  total: 100,
  userDetails: [
    {
      _id: ObjectId('...'),
      name: 'John',
      email: 'john@example.com'
    }
  ]
}
```

## $lookup Variations

### Unwind After $lookup
Convert array to single object:

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $unwind: '$user'
  }
])
```

### $lookup with Pipeline
Join with additional filtering:

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      let: { userId: '$userId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$userId'] },
            status: 'active'
          }
        },
        { $project: { name: 1, email: 1 } }
      ],
      as: 'user'
    }
  }
])
```

### Multiple $lookup
Join multiple collections:

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $lookup: {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product'
    }
  }
])
```

## Practical Examples

### Join Orders with Users
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },
  {
    $project: {
      orderId: '$_id',
      total: 1,
      userName: '$user.name',
      userEmail: '$user.email'
    }
  }
])
```

### Join Products with Categories
```javascript
db.products.aggregate([
  {
    $lookup: {
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
  {
    $project: {
      name: 1,
      price: 1,
      categoryName: '$category.name'
    }
  }
])
```

### Join with Filtering
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      let: { userId: '$userId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$userId'] },
            age: { $gte: 18 }
          }
        }
      ],
      as: 'user'
    }
  },
  { $match: { user: { $ne: [] } } }
])
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function joinCollections() {
  try {
    await client.connect();
    const db = client.db('mydatabase');

    // Simple join
    const result1 = await db.collection('orders').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]).toArray();

    // Join with unwind
    const result2 = await db.collection('orders').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]).toArray();

  } finally {
    await client.close();
  }
}

joinCollections().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total: Number
});

const Order = mongoose.model('Order', orderSchema);

async function joinWithPopulate() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Using populate
  const orders = await Order.find()
    .populate('userId', 'name email')
    .exec();

  console.log(orders);

  await mongoose.connection.close();
}

joinWithPopulate().catch(console.error);
```

## Embedding vs $lookup

### Embedding (Denormalization)
```javascript
// Store related data in document
{
  _id: ObjectId('...'),
  name: 'John',
  orders: [
    { orderId: '...', total: 100, date: '...' },
    { orderId: '...', total: 200, date: '...' }
  ]
}

// Pros: Fast reads, single query
// Cons: Data duplication, larger documents
```

### $lookup (Normalization)
```javascript
// Store references, join when needed
// users collection
{ _id: ObjectId('...'), name: 'John' }

// orders collection
{ _id: ObjectId('...'), userId: ObjectId('...'), total: 100 }

// Pros: Data consistency, smaller documents
// Cons: Slower reads, complex queries
```

## Performance Considerations

### Indexes for $lookup
```javascript
// Create index on foreign field
db.users.createIndex({ _id: 1 })

// Create index on local field
db.orders.createIndex({ userId: 1 })
```

### Limit Results
```javascript
db.orders.aggregate([
  { $match: { status: 'completed' } },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $limit: 100 }
])
```

## $lookup with $unwind Pattern

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' },
  {
    $project: {
      orderId: '$_id',
      total: 1,
      userName: '$user.name',
      userEmail: '$user.email'
    }
  }
])
```

## Multiple Joins

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $lookup: {
      from: 'products',
      localField: 'items.productId',
      foreignField: '_id',
      as: 'products'
    }
  },
  { $unwind: '$user' }
])
```

## Summary

```javascript
// Basic lookup
db.collection.aggregate([
  {
    $lookup: {
      from: 'otherCollection',
      localField: 'field',
      foreignField: '_id',
      as: 'joined'
    }
  }
])

// Lookup with unwind
db.collection.aggregate([
  { $lookup: { ... } },
  { $unwind: '$joined' }
])

// Lookup with pipeline
db.collection.aggregate([
  {
    $lookup: {
      from: 'collection',
      let: { var: '$field' },
      pipeline: [ ... ],
      as: 'joined'
    }
  }
])

// Mongoose populate
Model.find().populate('refField')
```

## Best Practices

1. **Use embedding** for 1-to-few relationships
2. **Use $lookup** for 1-to-many or many-to-many
3. **Create indexes** on join fields
4. **Limit results** before joining
5. **Use $unwind** to flatten arrays
6. **Consider data consistency** with embedding

## Next Steps

- Aggregation framework
- Update documents
- Delete documents
