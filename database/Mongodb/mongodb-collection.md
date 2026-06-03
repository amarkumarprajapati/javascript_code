# MongoDB Collection

> Creating and managing collections in MongoDB.

## What is a Collection?

A **collection** is a grouping of MongoDB documents. It's equivalent to a table in relational databases, but without a fixed schema. Collections store documents that can have different structures.

## Creating Collections

### Implicit Creation
Collections are created automatically when you first insert a document:

```javascript
use mydatabase

// Collection is created automatically
db.users.insertOne({ name: 'John', age: 30 })

// Verify
show collections
```

### Explicit Creation
Create a collection with specific options:

```javascript
// Create collection
db.createCollection('users')

// Create with options
db.createCollection('logs', {
  capped: true,      // Fixed size collection
  size: 100000,      // Maximum size in bytes
  max: 1000          // Maximum number of documents
})

// Create with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price'],
      properties: {
        name: { bsonType: 'string' },
        price: { bsonType: 'number' }
      }
    }
  }
})
```

## Collection Naming Rules

- Must be UTF-8
- Cannot contain: `$` (except for system collections)
- Cannot be empty
- Maximum 128 bytes
- Cannot start with `system.` (reserved)
- Should not contain: `\0` (null character)

**Good names:** `users`, `products`, `user_orders`
**Avoid:** `user$data`, `system.users`, empty names

## Listing Collections

### MongoDB Shell
```javascript
// Show all collections in current database
show collections

// Or
db.getCollectionNames()

// Show collection info
db.users.getStats()
```

### Node.js
```javascript
const { MongoClient } = require('mongodb');

async function listCollections() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('mydatabase');
    
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
    
  } finally {
    await client.close();
  }
}

listCollections().catch(console.error);
```

## Dropping Collections

### MongoDB Shell
```javascript
// Drop a collection
db.users.drop()

// Verify
show collections
```

### Node.js
```javascript
await db.collection('users').drop();
```

## Collection Types

### Standard Collection
Default collection type, unlimited size:

```javascript
db.createCollection('users')
```

### Capped Collection
Fixed-size collection that automatically removes old documents:

```javascript
db.createCollection('logs', {
  capped: true,
  size: 100000,    // 100KB max
  max: 1000        // Max 1000 documents
})

// Insert into capped collection
db.logs.insertOne({ message: 'Log entry', timestamp: new Date() })
```

**Use cases:** Logs, cache, rolling data

### Time Series Collection (MongoDB 5.0+)
Optimized for time-series data:

```javascript
db.createCollection('weather', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'location',
    granularity: 'seconds'
  }
})

db.weather.insertOne({
  timestamp: new Date(),
  location: 'NYC',
  temperature: 25
})
```

## Collection Options

### Size Limit
```javascript
db.createCollection('data', { size: 5000000 })  // 5MB
```

### Maximum Documents
```javascript
db.createCollection('data', { max: 5000 })
```

### Auto Index ID
```javascript
db.createCollection('data', { autoIndexId: false })  // Disable _id index
```

### Storage Engine
```javascript
db.createCollection('data', { storageEngine: { wiredTiger: {} } })
```

## Collection Validation

### Schema Validation
```javascript
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        },
        age: {
          bsonType: 'number',
          minimum: 0,
          maximum: 120
        }
      }
    }
  },
  validationLevel: 'moderate',  // 'strict' or 'moderate'
  validationAction: 'error'     // 'error' or 'warn'
})
```

### Add Validation to Existing Collection
```javascript
db.runCommand({
  collMod: 'users',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name']
    }
  },
  validationAction: 'warn'
})
```

## Collection Statistics

### MongoDB Shell
```javascript
// Get collection stats
db.users.stats()

// Get collection size
db.users.dataSize()

// Get storage size
db.users.storageSize()

// Get index size
db.users.totalIndexSize()
```

### Node.js
```javascript
const stats = await db.collection('users').stats();
console.log('Collection stats:', stats);
```

## Renaming Collections

### MongoDB Shell
```javascript
db.users.renameCollection('customers')
```

### Node.js
```javascript
await db.collection('users').rename('customers');
```

## Practical Examples

### Create E-commerce Collections
```javascript
use ecommerce

// Products collection
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price'],
      properties: {
        name: { bsonType: 'string' },
        price: { bsonType: 'number' },
        category: { bsonType: 'string' }
      }
    }
  }
})

// Orders collection
db.createCollection('orders')

// Users collection
db.createCollection('users')

// Logs (capped)
db.createCollection('logs', {
  capped: true,
  size: 1000000,
  max: 10000
})
```

### Create Time Series Collection
```javascript
db.createCollection('sensor_data', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'sensor_id',
    granularity: 'minutes'
  }
})
```

## Collection Operations Summary

```javascript
// Create collection
db.createCollection('name')

// Create with options
db.createCollection('name', { capped: true, size: 100000 })

// List collections
show collections

// Drop collection
db.collection.drop()

// Rename collection
db.collection.renameCollection('newname')

// Get stats
db.collection.stats()

// Add validation
db.runCommand({
  collMod: 'collection',
  validator: { ... }
})
```

## Best Practices

1. **Use descriptive names** - `users`, `products`, `orders`
2. **Use schema validation** - Ensure data integrity
3. **Use capped collections** for logs and cache
4. **Index frequently queried fields**
5. **Monitor collection size** - Use `stats()` regularly
6. **Use time series** for time-based data (MongoDB 5.0+)
7. **Document collection purposes** - Keep track of what each collection stores

## Next Steps

- Insert documents into collections
- Query collections
- Update documents
- Create indexes
