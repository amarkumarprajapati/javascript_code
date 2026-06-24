# MongoDB — Operations (CRUD & Queries)

NoSQL **document** database. Stores BSON (binary JSON) documents in **collections**.

## Terminology vs SQL

| SQL | MongoDB |
| --- | --- |
| database | database |
| table | collection |
| row | document |
| column | field |
| JOIN | `$lookup` / embedding |
| primary key | `_id` (auto ObjectId) |

---

## Setup & Connection

```bash
mongosh                          # open shell
show dbs                         # list databases
use myapp                        # switch/create database
show collections                 # list collections
```

```js
// Node.js driver
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myapp");
const users = db.collection("users");

// Mongoose
await mongoose.connect("mongodb://localhost:27017/myapp");
const User = mongoose.model("User", userSchema);
```

Connection string: `mongodb://user:pass@host:27017/dbname?options`

---

## CREATE — Insert

```js
// Insert one
db.users.insertOne({
  name: "John",
  age: 30,
  email: "john@mail.com",
  tags: ["dev", "nodejs"],
  address: { city: "NYC", zip: "10001" },
  createdAt: new Date(),
});

// Insert many
db.users.insertMany([
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
], { ordered: false }); // continue on duplicate error

// Upsert — insert if not exists
db.users.updateOne(
  { email: "john@mail.com" },
  { $set: { name: "John", age: 30 } },
  { upsert: true }
);

// Bulk write
db.users.bulkWrite([
  { insertOne: { document: { name: "Sam" } } },
  { updateOne: { filter: { name: "Alice" }, update: { $set: { age: 26 } } } },
  { deleteOne: { filter: { name: "Bob" } } },
]);
```

**Mongoose:**
```js
await User.create({ name: "John", age: 30 });
await User.insertMany([{ name: "Alice" }, { name: "Bob" }]);
```

---

## READ — Find & Query

```js
// Find all
db.users.find();

// Find one
db.users.findOne({ email: "john@mail.com" });

// Find by _id
db.users.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") });

// Projection — select fields
db.users.find({}, { name: 1, email: 1, _id: 0 });

// Sort, skip, limit (pagination)
db.users.find()
  .sort({ age: -1 })
  .skip((page - 1) * 10)
  .limit(10);

// Count
db.users.countDocuments({ age: { $gt: 25 } });
```

### Comparison operators

| Operator | Meaning | Example |
| --- | --- | --- |
| `$eq` | equal | `{ age: { $eq: 30 } }` |
| `$ne` | not equal | `{ age: { $ne: 30 } }` |
| `$gt` / `$gte` | greater (than/equal) | `{ age: { $gte: 18 } }` |
| `$lt` / `$lte` | less (than/equal) | `{ price: { $lte: 100 } }` |
| `$in` | in array | `{ status: { $in: ["active", "pending"] } }` |
| `$nin` | not in array | `{ role: { $nin: ["banned"] } }` |

### Logical operators

```js
// AND (implicit)
db.users.find({ age: { $gte: 18 }, city: "NYC" });

// OR
db.users.find({ $or: [{ age: { $lt: 18 } }, { city: "LA" }] });

// NOT
db.users.find({ age: { $not: { $gt: 65 } } });

// NOR
db.users.find({ $nor: [{ status: "banned" }, { active: false }] });
```

### Element operators

```js
db.users.find({ email: { $exists: true } });
db.users.find({ phone: { $exists: false } });
db.users.find({ age: { $type: "number" } });
```

### Array operators

```js
db.users.find({ tags: "nodejs" });                          // contains value
db.users.find({ tags: { $all: ["js", "mongo"] } });         // contains all
db.users.find({ tags: { $size: 3 } });                      // exact size
db.users.find({ scores: { $elemMatch: { $gte: 80, $lt: 90 } } }); // match element
```

### Nested & dot notation

```js
db.users.find({ "address.city": "NYC" });
db.users.find({ "orders.items.product": "Laptop" });
db.users.find({ "scores.0": 85 }); // first array element
```

### Regex & text search

```js
db.users.find({ name: { $regex: "^John", $options: "i" } }); // case-insensitive
db.users.find({ $text: { $search: "nodejs mongodb" } });     // requires text index
```

### Date queries

```js
db.users.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-12-31"),
  },
});

// Last 30 days
db.users.find({
  createdAt: { $gte: new Date(Date.now() - 30 * 86400000) },
});
```

### Null & missing fields

```js
db.users.find({ email: null });                              // null or missing
db.users.find({ email: { $exists: true, $ne: null } });      // exists and not null
db.users.find({ email: { $exists: false } });                // field missing
```

---

## UPDATE

```js
// Update one
db.users.updateOne(
  { email: "john@mail.com" },
  { $set: { age: 31, city: "LA" } }
);

// Update many
db.users.updateMany(
  { status: "inactive" },
  { $set: { status: "active" } }
);

// Replace entire document
db.users.replaceOne({ _id: ObjectId("...") }, { name: "John", age: 31 });

// Find and return updated doc
db.users.findOneAndUpdate(
  { email: "john@mail.com" },
  { $inc: { loginCount: 1 } },
  { returnDocument: "after" }
);
```

### Update operators

| Operator | Purpose | Example |
| --- | --- | --- |
| `$set` | Set field value | `{ $set: { age: 31 } }` |
| `$unset` | Remove field | `{ $unset: { tempField: "" } }` |
| `$inc` | Increment number | `{ $inc: { loginCount: 1 } }` |
| `$mul` | Multiply number | `{ $mul: { price: 0.9 } }` |
| `$rename` | Rename field | `{ $rename: { "old": "new" } }` |
| `$min` / `$max` | Set if less/greater | `{ $max: { score: 100 } }` |
| `$push` | Add to array | `{ $push: { tags: "new" } }` |
| `$push` + `$each` | Add multiple | `{ $push: { tags: { $each: ["a","b"] } } }` |
| `$pull` | Remove from array | `{ $pull: { tags: "old" } }` |
| `$addToSet` | Add if not exists | `{ $addToSet: { tags: "unique" } }` |
| `$pop` | Remove first/last | `{ $pop: { tags: 1 } }` |
| `$pullAll` | Remove all matches | `{ $pullAll: { tags: ["a","b"] } }` |

```js
// Array positional update
db.users.updateOne(
  { _id: ObjectId("..."), "scores.subject": "math" },
  { $set: { "scores.$.grade": "A" } }
);

// Update all array elements
db.users.updateMany(
  { _id: ObjectId("...") },
  { $inc: { "scores.$[].points": 10 } }
);
```

**Mongoose:**
```js
await User.findByIdAndUpdate(id, { age: 31 }, { new: true, runValidators: true });
await User.updateMany({ status: "inactive" }, { $set: { status: "active" } });
```

---

## DELETE

```js
// Delete one
db.users.deleteOne({ email: "john@mail.com" });

// Delete many
db.users.deleteMany({ status: "banned" });

// Delete all in collection
db.users.deleteMany({});

// Find and delete
db.users.findOneAndDelete({ email: "john@mail.com" });
```

**Mongoose:**
```js
await User.findByIdAndDelete(id);
await User.deleteMany({ status: "banned" });
```

---

## Collections & Database Admin

```js
// Create collection explicitly
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: "number", minimum: 0 },
      },
    },
  },
});

// Capped collection (fixed size, FIFO)
db.createCollection("logs", { capped: true, size: 100000, max: 1000 });

show collections
db.users.stats()
db.dropDatabase()
db.users.drop()
```

---

## Transactions (Multi-Document ACID)

Requires **replica set**. All operations succeed or all roll back.

```js
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne({ _id: fromId }, { $inc: { balance: -100 } }, { session });
    await accounts.updateOne({ _id: toId }, { $inc: { balance: 100 } }, { session });
  });
} finally {
  await session.endSession();
}
```

---

## Mongoose Quick Reference

```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

await User.find({ age: { $gte: 18 } }).select("email").limit(10).lean();
await User.findById(id).populate("orders");
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| SQL vs MongoDB terms? | table→collection, row→document, column→field |
| insertOne vs insertMany? | one doc vs array; use insertMany for bulk |
| find vs findOne? | cursor (all matches) vs single document |
| $set vs replaceOne? | partial update vs replace entire doc |
| What is upsert? | update if exists, insert if not |
| What is _id? | unique primary key; auto ObjectId if omitted |
| Transactions in Mongo? | Yes — multi-doc ACID on replica set |
| How paginate? | `.skip((page-1)*limit).limit(limit).sort()` |
