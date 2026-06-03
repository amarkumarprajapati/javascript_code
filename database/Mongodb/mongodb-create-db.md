# MongoDB Create Database

> Creating and managing databases in MongoDB.

## Creating a Database

In MongoDB, databases are created **implicitly** when you first store data in them. You don't need to explicitly create a database before using it.

### Using MongoDB Shell
```javascript
// Switch to a database (creates if doesn't exist)
use mydatabase

// Verify current database
db

// List all databases
show dbs
```

**Note:** A database won't appear in `show dbs` until it contains at least one collection with data.

## Database Naming Rules

- Must be UTF-8
- Cannot contain: `/\. "*<>:|?`
- Cannot be empty
- Maximum 64 bytes
- Case-sensitive on some systems
- Should not contain reserved names: `admin`, `local`, `config`

## Default Databases

MongoDB creates these databases by default:

| Database | Purpose |
| --- | --- |
| `admin` | Authentication and authorization |
| `local` | Stores data for a single server |
| `config` | Internal MongoDB configuration |
| `test` | Default database for testing |

## Creating Database with Node.js

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function createDatabase() {
  try {
    await client.connect();
    
    // Database is created when you access it
    const db = client.db('mynewdatabase');
    
    // Create a collection to make the database visible
    const collection = db.collection('users');
    
    // Insert a document to persist the database
    await collection.insertOne({ name: 'John', age: 30 });
    
    console.log('Database created successfully');
    
  } finally {
    await client.close();
  }
}

createDatabase().catch(console.error);
```

### Using Mongoose
```javascript
const mongoose = require('mongoose');

// Database is created when you connect and save data
mongoose.connect('mongodb://localhost:27017/mynewdatabase')
  .then(() => {
    console.log('Connected to database');
    
    // Define and save a model to persist the database
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      age: Number
    }));
    
    return User.create({ name: 'John', age: 30 });
  })
  .then(() => console.log('Database and document created'))
  .catch(console.error);
```

## Listing Databases

### MongoDB Shell
```javascript
// Show all databases
show dbs

// Show current database
db

// Show database statistics
db.stats()
```

### Node.js
```javascript
const { MongoClient } = require('mongodb');

async function listDatabases() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    
    // List all databases
    const admin = client.db().admin();
    const result = await admin.listDatabases();
    
    console.log('Databases:');
    result.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
  } finally {
    await client.close();
  }
}

listDatabases().catch(console.error);
```

## Dropping a Database

### MongoDB Shell
```javascript
// Switch to the database
use mydatabase

// Drop the database
db.dropDatabase()

// Confirm deletion
show dbs
```

### Node.js
```javascript
const { MongoClient } = require('mongodb');

async function dropDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('mydatabase');
    
    await db.dropDatabase();
    console.log('Database dropped successfully');
    
  } finally {
    await client.close();
  }
}

dropDatabase().catch(console.error);
```

## Database Statistics

### MongoDB Shell
```javascript
use mydatabase
db.stats()
```

Output includes:
- `db` - Database name
- `collections` - Number of collections
- `objects` - Total documents
- `dataSize` - Total data size
- `storageSize` - Total storage allocated
- `indexes` - Number of indexes
- `indexSize` - Total index size

### Node.js
```javascript
const stats = await db.stats();
console.log('Database statistics:', stats);
```

## Switching Between Databases

### MongoDB Shell
```javascript
// Switch to database1
use database1

// Switch to database2
use database2

// Return to previous database
use database1
```

## Database Administration

### Check Current Database
```javascript
db.getName()
```

### Get Database Version
```javascript
db.version()
```

### Get Server Status
```javascript
db.serverStatus()
```

## Practical Examples

### Create Database with Initial Data
```javascript
use ecommerce

// Create collections with initial data
db.products.insertMany([
  { name: 'Laptop', price: 999, category: 'Electronics' },
  { name: 'Phone', price: 699, category: 'Electronics' }
]);

db.users.insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
});

// Verify
show dbs
```

### Create Database for Different Environments
```javascript
// Development
use myapp_dev

// Staging
use myapp_staging

// Production
use myapp_prod
```

## Best Practices

1. **Use descriptive names** - `ecommerce_prod`, `blog_dev`
2. **Separate environments** - dev, staging, production
3. **Backup before dropping** - Always backup important databases
4. **Monitor database size** - Use `db.stats()` regularly
5. **Use authentication** - Secure production databases
6. **Document your databases** - Keep track of database purposes

## Common Operations

```javascript
// Create and use database
use mydatabase

// Create collection (implicit)
db.mycollection.insertOne({ key: 'value' })

// List databases
show dbs

// Drop database
db.dropDatabase()

// Get database info
db.stats()
```

## Next Steps

- Create collections
- Insert documents
- Query data
- Create indexes
