# MongoDB Get Started

> Getting started with MongoDB - installation, setup, and basic connection.

## What is MongoDB?

MongoDB is a **NoSQL document database** that stores data in flexible, JSON-like documents. Unlike traditional SQL databases, MongoDB doesn't require a predefined schema, making it ideal for rapidly evolving applications.

## Installation

### Windows
1. Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" setup
4. Install MongoDB Compass (GUI tool)

### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Starting MongoDB

### Start MongoDB Server
```bash
# Start MongoDB service
mongod

# Or as a service (Linux/macOS)
sudo systemctl start mongod
brew services start mongodb-community  # macOS
```

### Connect to MongoDB Shell
```bash
# Open MongoDB shell
mongosh

# Connect to specific host and port
mongosh --host localhost --port 27017

# Connect with authentication
mongosh --host localhost --port 27017 -u admin -p password
```

## MongoDB Shell Basics

### Basic Commands
```javascript
// Show all databases
show dbs

// Switch to a database (creates if doesn't exist)
use mydatabase

// Show current database
db

// Show collections in current database
show collections

// Show help
help
```

## MongoDB Compass (GUI)

MongoDB Compass is the official GUI for MongoDB:

1. Download and install Compass
2. Open Compass
3. Connect to: `mongodb://localhost:27017`
4. Explore databases, collections, and documents visually

## Connection String Format

```
mongodb://[username:password@]host1[:port1][,host2[:port2],...]/database[?options]
```

### Examples
```javascript
// Local connection
mongodb://localhost:27017

// With authentication
mongodb://admin:password@localhost:27017/mydb

// Replica set
mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=myReplicaSet

// With SSL
mongodb://localhost:27017/mydb?ssl=true
```

## Node.js Driver Setup

### Install MongoDB Driver
```bash
npm install mongodb
```

### Basic Connection
```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('mydatabase');
    const collection = db.collection('users');
    
    // Perform operations...
    
  } finally {
    await client.close();
  }
}

run().catch(console.error);
```

## Mongoose Setup (ODM)

### Install Mongoose
```bash
npm install mongoose
```

### Basic Connection
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Define a schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// Create a model
const User = mongoose.model('User', userSchema);
```

## Environment Variables

Store connection details in environment variables:

```bash
# .env file
MONGODB_URI=mongodb://localhost:27017/mydatabase
MONGODB_USER=admin
MONGODB_PASSWORD=secret
```

```javascript
const uri = process.env.MONGODB_URI;
```

## Common Issues

### Connection Refused
- Check if MongoDB is running: `sudo systemctl status mongod`
- Check if port 27017 is available
- Check firewall settings

### Authentication Error
- Verify username and password
- Check user permissions in the database

### Permission Denied (Linux)
```bash
# Fix data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-*.sock
```

## Best Practices

1. **Use environment variables** for connection strings
2. **Enable authentication** in production
3. **Use connection pooling** for better performance
4. **Handle connection errors** gracefully
5. **Close connections** when done
6. **Use indexes** for frequently queried fields
7. **Validate data** before insertion

## Next Steps

- Create a database
- Create collections
- Insert documents
- Query data
- Update and delete documents
