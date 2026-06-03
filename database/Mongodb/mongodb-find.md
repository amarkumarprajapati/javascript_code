# MongoDB Find

> Querying and retrieving documents from MongoDB collections.

## Basic Find

### find()
Returns a cursor to all matching documents:

```javascript
// Find all documents
db.users.find()

// Find with criteria
db.users.find({ age: 30 })

// Find multiple conditions
db.users.find({ age: 30, city: 'New York' })
```

### findOne()
Returns the first matching document:

```javascript
db.users.findOne({ name: 'John' })
```

## Query Operators

### Comparison Operators
```javascript
// Equal
db.users.find({ age: 30 })

// Not equal
db.users.find({ age: { $ne: 30 } })

// Greater than
db.users.find({ age: { $gt: 25 } })

// Greater than or equal
db.users.find({ age: { $gte: 25 } })

// Less than
db.users.find({ age: { $lt: 40 } })

// Less than or equal
db.users.find({ age: { $lte: 40 } })

// In array
db.users.find({ age: { $in: [25, 30, 35] } })

// Not in array
db.users.find({ age: { $nin: [25, 30, 35] } })
```

### Logical Operators
```javascript
// AND (implicit)
db.users.find({ age: 30, city: 'New York' })

// Explicit AND
db.users.find({
  $and: [
    { age: { $gt: 25 } },
    { city: 'New York' }
  ]
})

// OR
db.users.find({
  $or: [
    { age: 30 },
    { city: 'New York' }
  ]
})

// NOT
db.users.find({
  age: { $not: { $gt: 30 } }
})

// NOR
db.users.find({
  $nor: [
    { age: 30 },
    { city: 'New York' }
  ]
})
```

### Element Operators
```javascript
// Field exists
db.users.find({ email: { $exists: true } })

// Field doesn't exist
db.users.find({ email: { $exists: false } })

// Field type
db.users.find({ age: { $type: 'number' } })
db.users.find({ createdAt: { $type: 'date' } })
```

### Array Operators
```javascript
// Array contains value
db.users.find({ tags: 'javascript' })

// Array contains all values
db.users.find({ tags: { $all: ['javascript', 'mongodb'] } })

// Array size
db.users.find({ tags: { $size: 3 } })

// Match array element
db.users.find({
  scores: { $elemMatch: { $gt: 80, $lt: 90 } }
})
```

## Projection

### Include Fields
```javascript
// Only return name and email
db.users.find({}, { name: 1, email: 1 })

// _id is included by default, exclude it
db.users.find({}, { name: 1, email: 1, _id: 0 })
```

### Exclude Fields
```javascript
// Exclude password field
db.users.find({}, { password: 0 })

// Exclude multiple fields
db.users.find({}, { password: 0, ssn: 0 })
```

### Mixed Projection
```javascript
// Can't mix include and exclude (except _id)
db.users.find({}, { name: 1, email: 1, password: 0 })  // Error!
```

## Nested Field Queries

### Dot Notation
```javascript
// Query nested field
db.users.find({ 'address.city': 'New York' })

// Query array of objects
db.users.find({ 'orders.product': 'Laptop' })
```

### Array Index
```javascript
// Query specific array index
db.users.find({ 'scores.0': 85 })
```

## Regular Expressions

```javascript
// Case-sensitive
db.users.find({ name: /^John/ })

// Case-insensitive
db.users.find({ name: /^John/i })

// Contains
db.users.find({ name: /ohn/ })

// Ends with
db.users.find({ name: /Doe$/ })
```

## Null and Missing

```javascript
// Field is null
db.users.find({ email: null })

// Field is null or missing
db.users.find({ email: { $in: [null, false] } })

// Field exists and is not null
db.users.find({ email: { $exists: true, $ne: null } })
```

## Cursor Methods

### limit()
Limit number of results:

```javascript
db.users.find().limit(10)
```

### skip()
Skip specified number of documents:

```javascript
db.users.find().skip(5)
```

### sort()
Sort results:

```javascript
// Ascending
db.users.find().sort({ age: 1 })

// Descending
db.users.find().sort({ age: -1 })

// Multiple fields
db.users.find().sort({ age: 1, name: 1 })
```

### Pagination
```javascript
const page = 2
const pageSize = 10
const skip = (page - 1) * pageSize

db.users.find().skip(skip).limit(pageSize)
```

### count()
Count matching documents:

```javascript
db.users.find({ age: { $gt: 25 } }).count()
```

### distinct()
Get distinct values:

```javascript
db.users.distinct('city')
```

### toArray()
Convert cursor to array:

```javascript
const users = db.users.find().toArray()
```

## Node.js Examples

### Using MongoDB Driver
```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function findDocuments() {
  try {
    await client.connect();
    const db = client.db('mydatabase');
    const collection = db.collection('users');

    // Find all
    const allUsers = await collection.find().toArray();
    console.log('All users:', allUsers);

    // Find with query
    const users = await collection.find({ age: { $gt: 25 } }).toArray();
    console.log('Users over 25:', users);

    // Find one
    const user = await collection.findOne({ name: 'John' });
    console.log('Found user:', user);

    // With projection
    const projected = await collection
      .find({}, { name: 1, email: 1, _id: 0 })
      .toArray();

    // With pagination
    const page = await collection
      .find()
      .skip(10)
      .limit(10)
      .toArray();

  } finally {
    await client.close();
  }
}

findDocuments().catch(console.error);
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

async function findUsers() {
  await mongoose.connect('mongodb://localhost:27017/mydatabase');

  // Find all
  const users = await User.find();
  console.log(users);

  // Find with query
  const adults = await User.find({ age: { $gte: 18 } });
  console.log(adults);

  // Find one
  const user = await User.findOne({ name: 'John' });
  console.log(user);

  // With projection
  const names = await User.find({}, 'name email -_id');

  // With pagination
  const page = await User.find()
    .skip(10)
    .limit(10)
    .sort({ age: -1 });

  await mongoose.connection.close();
}

findUsers().catch(console.error);
```

## Practical Examples

### Find Active Users
```javascript
db.users.find({
  active: true,
  lastLogin: { $gte: new Date('2024-01-01') }
})
```

### Find Products in Price Range
```javascript
db.products.find({
  price: { $gte: 100, $lte: 500 },
  category: 'Electronics'
})
```

### Find Users with Specific Tags
```javascript
db.users.find({
  tags: { $all: ['javascript', 'nodejs'] }
})
```

### Find Recent Orders
```javascript
db.orders.find({
  createdAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)  // Last 7 days
  }
}).sort({ createdAt: -1 })
```

### Search by Name Pattern
```javascript
db.users.find({
  name: { $regex: 'John', $options: 'i' }
})
```

## Advanced Queries

### Using $expr for Field Comparison
```javascript
db.products.find({
  $expr: { $gt: ['$price', '$discount'] }
})
```

### Using $where for JavaScript Expressions
```javascript
db.users.find({
  $where: function() {
    return this.age > 25 && this.name.length > 5;
  }
})
```

## Aggregation Framework

```javascript
db.users.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$city', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

## Summary

```javascript
// Find all
db.collection.find()

// Find with query
db.collection.find({ field: value })

// Find one
db.collection.findOne({ field: value })

// With operators
db.collection.find({ age: { $gt: 25 } })

// With projection
db.collection.find({}, { name: 1, _id: 0 })

// With sort, limit, skip
db.collection.find().sort({ age: 1 }).limit(10).skip(5)

// Count
db.collection.find().count()

// Distinct
db.collection.distinct('field')
```

## Next Steps

- Advanced querying with aggregation
- Update documents
- Delete documents
