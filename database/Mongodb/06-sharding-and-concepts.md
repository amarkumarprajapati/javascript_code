# MongoDB — Sharding, Replication & Core Concepts

---

## Core Concepts

### Document
Basic unit of data — BSON (Binary JSON). Flexible schema — documents in same collection can have different fields.

```js
{ _id: ObjectId("..."), name: "John", age: 30, tags: ["dev"] }
{ _id: ObjectId("..."), name: "Jane", email: "jane@mail.com" } // different fields ok
```

### Collection
Group of documents — like a table but **no fixed schema**.

### Database
Container for collections.

### _id
Every document has unique `_id` — auto-generated `ObjectId` if not provided.

```
ObjectId = 4 bytes timestamp + 5 bytes random + 3 bytes counter
         = 12 bytes, sortable by creation time
```

### BSON Types
String, Number, Boolean, Date, ObjectId, Array, Embedded Document, Null, Binary, Regex, Timestamp, Decimal128

---

## CAP Theorem & MongoDB

| Property | MongoDB default |
| --- | --- |
| **Consistency** | Eventual (secondary reads) or strong (primary reads) |
| **Availability** | High — replica set failover |
| **Partition tolerance** | Yes — sharding handles partition |

MongoDB chooses **CP** by default (consistency + partition tolerance), configurable toward availability with read preferences.

---

## Replication — High Availability

A **replica set** = 1 primary + 2+ secondaries. Automatic failover if primary dies.

```
        ┌──────────┐
        │ Primary  │ ← all writes, default reads
        └────┬─────┘
             │ replication
    ┌────────┴────────┐
    ↓                 ↓
┌─────────┐     ┌─────────┐
│Secondary│     │Secondary│ ← read replicas, backup
└─────────┘     └─────────┘
```

### How it works
1. All **writes** go to primary
2. Primary records operations in **oplog** (operation log)
3. Secondaries **tail the oplog** and replicate data
4. Primary dies → **election** — secondary promoted to primary (~10-30 seconds)
5. Minimum **3 nodes** recommended (or 2 nodes + arbiter)

```js
// Replica set connection string
mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=rs0

// Read from secondary (analytics)
db.users.find().readPref("secondaryPreferred");

// Write concern — wait for replication
db.users.insertOne(doc, { writeConcern: { w: "majority" } });
```

### Replica set roles

| Role | Purpose |
| --- | --- |
| **Primary** | Accepts all writes and reads (default) |
| **Secondary** | Replicates primary; can serve reads |
| **Arbiter** | Votes in elections; no data — breaks ties |

### Failover
- Primary unreachable → election triggered
- Majority of nodes must agree on new primary
- App reconnects automatically (with proper connection string)
- **Downtime:** typically 10-30 seconds

---

## Sharding — Horizontal Scaling

When a single server can't hold your data or handle load → **shard** across multiple machines.

```
                    ┌─────────────┐
                    │   mongos    │  ← router (query router)
                    │  (router)   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Shard A   │  │  Shard B   │  │  Shard C   │
    │ (rs0)      │  │ (rs1)      │  │ (rs2)      │
    │ users      │  │ users      │  │ users      │
    │ 0-33M      │  │ 33M-66M    │  │ 66M-100M   │
    └────────────┘  └────────────┘  └────────────┘
           ↑
    ┌─────────────┐
    │Config Server│  ← stores cluster metadata (shard keys, chunk ranges)
    └─────────────┘
```

### Sharding components

| Component | Role |
| --- | --- |
| **Shard** | Replica set holding subset of data |
| **mongos** | Query router — directs queries to correct shard |
| **Config servers** | Store cluster metadata and chunk ranges |

### Shard Key — Most Critical Decision

The field(s) used to distribute data across shards. **Cannot be changed** after sharding.

```js
// Enable sharding
sh.enableSharding("mydb");
sh.shardCollection("mydb.users", { userId: 1 });        // ranged
sh.shardCollection("mydb.events", { _id: "hashed" }); // hashed
```

### Shard key types

| Strategy | How | Good for |
| --- | --- | --- |
| **Ranged** | Divides by value ranges | Range queries, sorting |
| **Hashed** | Hash of key value | Even distribution, equality queries |
| **Compound** | Multiple fields | Specific query patterns |

```js
// ❌ Bad shard key — monotonic (always increasing)
{ _id: ObjectId(...) }  // all writes go to last chunk → hot shard
{ createdAt: 1 }         // same problem — recent data on one shard

// ✅ Good shard key — high cardinality, even distribution
{ userId: 1, orderId: 1 }  // compound — spreads writes
{ email: "hashed" }         // hashed — even distribution
{ region: 1, userId: 1 }   // compound with geographic spread
```

### Chunk
- Data split into **chunks** (default 128MB each)
- mongos routes query to shard owning the chunk
- Balancer migrates chunks between shards automatically

### When to shard
- Single replica set exceeds **RAM/disk** capacity
- Write throughput exceeds single primary capacity
- Generally: **not needed until 100GB+** or high write load
- Start with replica set; shard when you outgrow it

---

## Sharding vs Replication

| | Replication | Sharding |
| --- | --- | --- |
| Purpose | **High availability** + read scaling | **Horizontal data scaling** |
| Data | Same data on all nodes | Data split across shards |
| Writes | Primary only | Distributed across shards |
| When | Always in production | Data/throughput exceeds one server |
| Failover | Yes | Yes (each shard is a replica set) |

**Production setup:** Sharded cluster where **each shard is a replica set**.

---

## Write Concern & Read Concern

### Write Concern — durability of writes

```js
{ w: 0 }          // fire and forget — no acknowledgment
{ w: 1 }          // acknowledged by primary (default)
{ w: "majority" } // acknowledged by majority of nodes — safest
{ w: 2 }          // acknowledged by 2 nodes specifically
{ j: true }       // wait for journal (disk) sync
```

### Read Concern — consistency of reads

```js
"local"         // return latest (may be uncommitted) — fastest
"available"     // return latest for shard (no guarantee)
"majority"      // return data confirmed by majority — consistent
"linearizable"  // strongest — reads always reflect all prior writes
"snapshot"      // consistent snapshot (transactions)
```

---

## ACID Transactions

MongoDB supports **multi-document ACID transactions** on replica sets (4.0+) and sharded clusters (4.2+).

```js
const session = client.startSession();
await session.withTransaction(async () => {
  await accounts.updateOne({ _id: fromId }, { $inc: { balance: -100 } }, { session });
  await accounts.updateOne({ _id: toId }, { $inc: { balance: 100 } }, { session });
  await logs.insertOne({ type: "transfer", amount: 100 }, { session });
});
await session.endSession();
```

**Limits:**
- 16MB transaction size
- 60 second default timeout
- Slower than non-transactional ops
- Use only when atomicity is required (money transfers, inventory)

---

## Oplog (Operation Log)

- Special capped collection on primary: `local.oplog.rs`
- Records all write operations
- Secondaries replicate by reading oplog
- Used for **Change Streams** (real-time notifications)

```js
// Change streams — react to data changes in real-time
const changeStream = db.users.watch();
changeStream.on("change", (change) => {
  console.log(change.operationType, change.fullDocument);
});
```

---

## GridFS — Large File Storage

For files **> 16MB** ( BSON document limit ).

```js
const { GridFSBucket } = require("mongodb");
const bucket = new GridFSBucket(db, { bucketName: "uploads" });

// Upload
fs.createReadStream("video.mp4").pipe(bucket.openUploadStream("video.mp4"));

// Download
bucket.openDownloadStreamByName("video.mp4").pipe(fs.createWriteStream("out.mp4"));
```

Splits file into 255KB chunks stored in `uploads.files` + `uploads.chunks` collections.

---

## MongoDB Atlas

Cloud-managed MongoDB:
- Auto-scaling, backups, monitoring
- Free tier (M0) for development
- Global clusters with multi-region
- Performance Advisor (index suggestions)
- Connection string: `mongodb+srv://user:pass@cluster.mongodb.net/db`

---

## SQL vs MongoDB — When to Use

| Use MongoDB | Use SQL |
| --- | --- |
| Flexible/evolving schema | Fixed, relational schema |
| Hierarchical/nested data | Complex joins across many tables |
| High write throughput | Complex transactions across tables |
| Horizontal scaling needed | Strong ACID across many entities |
| Document-oriented data | Reporting with complex aggregations |
| Real-time, rapid development | Mature relational model |

---

## Deployment Topologies

```
Development:   Standalone (single node)
Staging:       Replica set (3 nodes)
Production:    Replica set (3+ nodes) + backups
High scale:    Sharded cluster (each shard = replica set)
Global:        Multi-region replica set or global cluster (Atlas)
```

---

## Backup & Recovery

```bash
# mongodump — logical backup
mongodump --uri="mongodb://localhost:27017/mydb" --out=/backup/

# mongorestore
mongorestore --uri="mongodb://localhost:27017/mydb" /backup/mydb/

# Atlas — continuous cloud backup with point-in-time recovery
```

---

## Security Concepts

```js
// Authentication
mongosh -u admin -p password --authenticationDatabase admin

// Role-based access control (RBAC)
db.createUser({
  user: "appUser",
  pwd: "secret",
  roles: [{ role: "readWrite", db: "myapp" }],
});

// Enable auth in mongod.conf
// security.authorization: enabled

// Network — bind to specific IP, use firewall
// Encryption in transit — TLS/SSL
// Encryption at rest — WiredTiger encryption
```

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| What is a replica set? | Primary + secondaries; auto failover, data redundancy |
| Minimum replica set nodes? | 3 (or 2 + arbiter) for proper elections |
| What is sharding? | Horizontal scaling — split data across shards by shard key |
| mongos role? | Query router — directs queries to correct shard |
| Good vs bad shard key? | Good: high cardinality, even distribution; Bad: monotonic (_id, timestamp) |
| Sharding vs replication? | Sharding = scale data; Replication = HA + read scaling |
| Write concern majority? | Write confirmed by majority of nodes before returning |
| MongoDB transactions? | Multi-doc ACID on replica set; use session.withTransaction() |
| What is oplog? | Operation log on primary — secondaries replicate from it |
| Change streams? | Real-time notifications of data changes |
| 16MB limit? | Max BSON document size; use GridFS for larger files |
| CAP theorem? | MongoDB = CP by default; configurable read preferences |
| When shard vs replica set? | Replica set for HA; shard when data/throughput exceeds one server |
| SQL vs NoSQL? | MongoDB: flexible schema, embed, scale-out; SQL: relations, complex joins |

---

## Quick Revision

```
Document      = BSON record (flexible schema)
Collection    = group of documents
_id           = unique key (auto ObjectId)
Replica set   = primary + secondaries (HA)
Sharding      = horizontal scale across machines
Shard key     = field that determines data distribution
mongos        = query router in sharded cluster
Chunk         = 128MB data segment per shard
Oplog         = replication log on primary
Write concern = durability level (w: 1, w: majority)
Read concern  = consistency level (local, majority)
Transaction   = multi-doc ACID (replica set required)
GridFS        = store files > 16MB
Change stream = real-time data change events
COLLSCAN      = no index — full scan (bad)
IXSCAN        = index scan (good)
```
