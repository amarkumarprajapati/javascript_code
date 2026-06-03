# MongoDB Drop Collection

> Dropping (deleting) collections from MongoDB databases.

## Drop Collection

### drop() Method
Remove a collection and all its documents:

```javascript
db.users.drop()
```

**Returns:** `true` if successful, `false` if collection doesn't exist

## Basic Usage

### Drop by Name
```javascript
// Switch to database
use mydatabase

// Drop collection
db.users.drop()

// Verify
show collections
```

### Drop with Check
```javascript
// Check if collection exists before dropping
if (db.getCollectionNames().includes('users')) {
  db.users.drop()
  console.log('Collection dropped')
} else {
  console.log('Collection does not exist')
}
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function dropCollection() {
  try {
    await client.connect();
    const db = client.db('mydatabase');

    // Drop collection
    await db.collection('users').drop();
    console.log('Collection dropped successfully');

  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Collection does not exist');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await client.close();
  }
}

dropCollection().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

async function dropCollection() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  try {
    await User.collection.drop();
    console.log('Collection dropped');
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Collection does not exist');
    } else {
      console.error('Error:', error);
    }
  }

  await mongoose.connection.close();
}

dropCollection().catch(console.error);
```

## Drop vs Delete

### drop()
- Removes entire collection
- Removes all indexes
- Faster than deleting all documents
- Collection must be recreated to use again

### deleteMany({})
- Removes all documents
- Keeps collection structure
- Keeps indexes
- Collection remains usable

```javascript
// Drop - removes collection and indexes
db.users.drop()

// Delete all - keeps collection and indexes
db.users.deleteMany({})
```

## Drop Multiple Collections

### Drop All Collections
```javascript
// Get all collections
const collections = db.getCollectionNames()

// Drop each collection (except system collections)
collections.forEach(name => {
  if (!name.startsWith('system.')) {
    db[name].drop()
  }
})
```

### Drop Specific Collections
```javascript
['users', 'products', 'orders'].forEach(name => {
  db[name].drop()
})
```

## Drop with Error Handling

### Check Existence
```javascript
try {
  db.users.drop()
  print('Collection dropped')
} catch (error) {
  if (error.code === 26) {
    print('Collection does not exist')
  } else {
    print('Error:', error)
  }
}
```

### Safe Drop Function
```javascript
function safeDrop(collectionName) {
  const collections = db.getCollectionNames()
  
  if (collections.includes(collectionName)) {
    db[collectionName].drop()
    print(`Dropped: ${collectionName}`)
  } else {
    print(`Collection not found: ${collectionName}`)
  }
}

safeDrop('users')
safeDrop('nonexistent')
```

## Practical Examples

### Drop Test Collections
```javascript
// Drop all collections starting with 'test_'
db.getCollectionNames().forEach(name => {
  if (name.startsWith('test_')) {
    db[name].drop()
  }
})
```

### Drop Old Collections
```javascript
// Drop collections older than 30 days
db.getCollectionNames().forEach(name => {
  const stats = db[name].stats()
  const created = new Date(stats.createTime)
  const age = Date.now() - created.getTime()
  
  if (age > 30 * 24 * 60 * 60 * 1000) {
    db[name].drop()
  }
})
```

### Drop Empty Collections
```javascript
// Drop collections with no documents
db.getCollectionNames().forEach(name => {
  const count = db[name].countDocuments()
  if (count === 0) {
    db[name].drop()
  }
})
```

## Performance Considerations

### Large Collections
Dropping large collections can take time and lock the database:

```javascript
// For very large collections, consider:
// 1. Delete documents in batches first
// 2. Then drop the collection
// 3. Or use drop() during maintenance window
```

### Indexes
Dropping a collection removes all indexes:

```javascript
// Before drop
db.users.getIndexes()  // Shows all indexes

// After drop
db.users.drop()

// Recreate collection and indexes
db.users.createIndex({ email: 1 })
```

## Backup Before Drop

Always backup before dropping important collections:

```bash
# Backup collection
mongodump --db mydatabase --collection users --out backup/

# Drop collection
db.users.drop()

# Restore if needed
mongorestore --db mydatabase --collection users backup/mydatabase/users.bson
```

## Summary

```javascript
// Drop collection
db.collection.drop()

// Check before drop
if (db.getCollectionNames().includes('collection')) {
  db.collection.drop()
}

// Drop all non-system collections
db.getCollectionNames().forEach(name => {
  if (!name.startsWith('system.')) {
    db[name].drop()
  }
})

// Drop vs delete
db.collection.drop()        // Removes collection and indexes
db.collection.deleteMany({}) // Removes documents only
```

## Best Practices

1. **Backup before dropping** important collections
2. **Check existence** before dropping
3. **Use transactions** for related drops
4. **Drop during maintenance** for large collections
5. **Document drops** in change logs
6. **Use deleteMany()** if you want to keep indexes

## Next Steps

- Update documents
- Limit results
- Join collections
