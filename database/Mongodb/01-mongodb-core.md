# MongoDB Core

NoSQL **document** database. Stores BSON (binary JSON) documents in **collections**.

## Terminology vs SQL
| SQL | MongoDB |
| --- | --- |
| database | database |
| table | collection |
| row | document |
| column | field |
| JOIN | `$lookup` / embedding |

## CRUD
```js
db.users.insertOne({ name: "Amar", age: 28, roles: ["dev"] });
db.users.insertMany([{...}, {...}]);

db.users.find({ age: { $gt: 25 } });            // query
db.users.findOne({ _id: ObjectId("...") });

db.users.updateOne({ name: "Amar" }, { $set: { age: 29 } });
db.users.updateMany({ active: false }, { $set: { active: true } });

db.users.deleteOne({ name: "Amar" });
```

## Query operators
- Comparison: `$eq $ne $gt $gte $lt $lte $in $nin`
- Logical: `$and $or $not $nor`
- Element: `$exists $type`
- Array: `$all $elemMatch $size`
- Update: `$set $unset $inc $push $pull $addToSet`

```js
db.products.find({ price: { $gte: 100, $lte: 500 }, tags: { $in: ["sale"] } });
db.users.updateOne({ _id }, { $inc: { loginCount: 1 }, $push: { logins: new Date() } });
```

## Aggregation pipeline (very common question)
Process documents through stages.
```js
db.orders.aggregate([
  { $match: { status: "paid" } },                         // filter
  { $group: { _id: "$customerId", total: { $sum: "$amount" }, count: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
  { $lookup: {                                            // join
      from: "customers", localField: "_id",
      foreignField: "_id", as: "customer" } },
  { $project: { total: 1, count: 1, "customer.name": 1 } } // shape output
]);
```
Key stages: `$match $group $sort $limit $skip $project $lookup $unwind $count`.

## Indexing
Speeds up reads; without index → full collection scan (`COLLSCAN`).
```js
db.users.createIndex({ email: 1 }, { unique: true }); // 1=asc, -1=desc
db.users.createIndex({ name: 1, age: -1 });           // compound
db.users.find({ email: "x" }).explain("executionStats"); // analyze
```
- Compound index order matters (ESR rule: Equality, Sort, Range).
- Too many indexes slow writes & use memory.

## Schema design: embedding vs referencing
- **Embed** when data is accessed together and bounded (e.g., address in user). Fewer queries.
- **Reference** when data is large, shared, or unbounded (e.g., user → many orders). Avoids duplication.

## Transactions (multi-document, ACID)
```js
const session = client.startSession();
await session.withTransaction(async () => {
  await accounts.updateOne({ _id: a }, { $inc: { bal: -100 } }, { session });
  await accounts.updateOne({ _id: b }, { $inc: { bal: 100 } }, { session });
});
```
> Requires replica set. Use for operations that must all succeed (e.g., money transfer).

## Mongoose (ODM) quick reference
```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
await User.find({ age: { $gte: 18 } }).select("email").limit(10).lean();
```

---

## Common interview questions
1. **SQL vs NoSQL — when?** → NoSQL: flexible schema, scale-out, hierarchical data; SQL: relations, transactions, complex joins.
2. **Embedding vs referencing?** → access pattern & data size decide.
3. **Aggregation pipeline?** → staged data transformation (`$match → $group → ...`).
4. **How do indexes work / downside?** → B-tree lookup; slow writes, memory cost.
5. **Does MongoDB support transactions?** → yes, multi-doc ACID on replica sets.
6. **What is `$lookup`?** → left outer join across collections.
