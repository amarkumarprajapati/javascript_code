# Redis & Caching — Comprehensive Guide & Interview Questions

---

## 1. What is Redis?

**Redis** (Remote Dictionary Server) is an open-source, in-memory, key-value data structure store used as a:
1. **Cache** (sub-millisecond data retrieval)
2. **Database** (NoSQL key-value / document store)
3. **Message Broker** (Pub/Sub, Redis Streams)
4. **Session Store** & Distributed Lock Manager (Redlock)

Unlike traditional relational databases (like PostgreSQL, MySQL) or document stores (MongoDB) that persist and read data from disk (HDD/SSD), Redis stores all working data directly in **RAM (Random Access Memory)**.

---

## 2. Why Use Redis? (Core Benefits & Use Cases)

### Key Benefits:
- **Ultra-low Latency (Sub-millisecond response times):** Memory access is orders of magnitude faster than disk I/O (~100ns vs ~1-10ms).
- **Rich Data Structures:** Redis is not just simple string key-value storage; it natively supports:
  - **Strings:** Binary-safe text, serialized JSON, numbers.
  - **Lists:** Ordered sequences (`LPUSH`, `RPOP` — great for queues).
  - **Sets:** Unordered unique collections (`SADD`, `SINTER` — tag systems, mutual friends).
  - **Sorted Sets (ZSets):** Unique elements ordered by a floating-point score (`ZADD`, `ZRANGE` — leaderboards, rate limiters).
  - **Hashes:** Field-value pairs representing objects (`HSET`, `HGETALL` — user profiles).
  - **Bitmaps & HyperLogLogs:** High-efficiency analytics and probabilistic unique count tracking.
  - **Streams & Pub/Sub:** Event sourcing, chat apps, and message distribution.
- **Single-Threaded Event Loop Core:** Redis executes commands using an event-driven single-threaded execution model (I/O multiplexing with `epoll`/`kqueue`). This avoids race conditions, locking overhead, and context switching for command processing.
- **Persistence Options:** Supports both **RDB** (point-in-time snapshots) and **AOF** (Append-Only File logs).
- **Atomic Operations:** All Redis operations (`INCR`, `SETNX`, `HINCRBY`, transactions with `MULTI/EXEC`, and Lua scripts) run atomically.

### Common Real-World Use Cases:
- **Database Query Caching:** Storing hot relational/document query results.
- **Session Management:** Centralized auth sessions across multiple stateless Node/Express backend instances.
- **API Rate Limiting:** Sliding window log or token bucket algorithms using Redis Sorted Sets or `INCR` + `EXPIRE`.
- **Real-Time Leaderboards:** Gaming or live ranking using Redis `Sorted Sets (ZSET)`.
- **Distributed Locks:** Ensuring only one microservice replica executes a critical job (`SET key value NX PX milliseconds`).
- **Background Job Queues:** BullMQ, Celery, or Sidekiq backed by Redis Lists / Streams.

---

## 3. Why Must We Add a TTL (Time-To-Live / Expiration) to Each Key?

In interviews, this is a very common deep-dive question: *"Why is setting TTL critical in Redis, and what happens if you don't?"*

### 1. Memory Exhaustion & Out-Of-Memory (OOM) Crashes
- RAM is finite and significantly more expensive than SSD storage.
- Without a TTL, keys live **forever** in memory unless explicitly removed (`DEL`).
- If data accumulates unchecked, Redis hits `maxmemory`. Depending on the configured eviction policy, Redis will either aggressively evict keys or throw `OOM command not allowed when used memory > 'maxmemory'`.

### 2. Preventing "Stale Data" (Data Freshness & Eventual Consistency)
- If your primary database updates a record (e.g., user changes their email/tier), an unexpired cache key might continue serving old, incorrect data indefinitely if an explicit cache invalidation bug occurs.
- A TTL guarantees a bounded window of stale data (safety net / eventual consistency fallback).

### 3. Preventing Cache Bloat from Ephemeral Data
- Many items are naturally short-lived:
  - OTPs (One-Time Passwords): valid for 5-10 minutes.
  - User login sessions: valid for 1-7 days.
  - Reset password tokens: valid for 15 minutes.
  - Rate limiting counters: valid for 1 minute or 1 hour.
- Leaving these indefinitely without TTL turns your Redis instance into a garbage heap of dead keys.

### 4. Memory Eviction Pressure & Degraded Performance
- When memory is near 100%, Redis spends CPU cycles evaluating eviction policies (`allkeys-lru`, `volatile-lru`, etc.) on write operations, increasing command latency.
- TTL allows Redis's active and passive expiration routines to clean up keys predictably in the background.

```js
// Example in Node.js (ioredis)
// Set key with an expiration of 3600 seconds (1 hour)
await redis.set("user:101:profile", JSON.stringify(userData), "EX", 3600);
```

---

## 4. How Does Redis Expire and Clean Keys Internally?

Redis uses two complementary strategies to reclaim expired keys:

1. **Passive (Lazy) Expiration:**
   - When a client attempts to read a key (`GET key`), Redis checks its TTL.
   - If the key is expired, Redis deletes it immediately and returns `nil`.

2. **Active (Periodic) Expiration:**
   - Redis runs a background cycle 10 times per second (`10 Hz`):
     1. Randomly samples 20 keys with an associated TTL.
     2. Deletes all keys found to be expired.
     3. If more than 25% of the sampled keys were expired, it immediately repeats the process.
   - This prevents expired, unread keys from consuming memory forever.

---

## 5. What Happens When Redis Memory Fills Up? (Eviction Policies)

When Redis hits `maxmemory`, it enforces one of the following `maxmemory-policy` options:

| Eviction Policy | How It Works | Best Use Case |
| :--- | :--- | :--- |
| `noeviction` (Default) | Returns an error on write commands (`SET`, `LPUSH`, etc.) when memory limit is reached. Read commands continue working. | When Redis is used strictly as a non-volatile database. |
| `allkeys-lru` | Evicts the Least Recently Used (LRU) keys among **all** keys. | General-purpose caching where hot data should remain. |
| `volatile-lru` | Evicts the Least Recently Used keys only among keys with an **expired TTL** set. | When some keys are permanent and others are temporary cache. |
| `allkeys-lfu` | Evicts the Least Frequently Used (LFU) keys across all keys. | When access frequency is a better indicator of value than recency. |
| `volatile-lfu` | Evicts Least Frequently Used keys among keys with an expired TTL set. | Hybrid persistent/caching workloads. |
| `allkeys-random` | Evicts random keys among all keys. | Rare; benchmarking or uniform access distributions. |
| `volatile-random` | Evicts random keys among keys with TTL. | Rare workloads. |
| `volatile-ttl` | Evicts keys with the shortest remaining TTL first. | When expiring sooner implies lower priority. |

---

## 6. Complex Redis System Design & Interview Questions

### Q1: Cache Avalanche (Stampede) vs. Cache Breakdown vs. Cache Penetration

This is the **#1 most asked** caching question in Senior Backend and System Design interviews.

#### 1. Cache Breakdown (Hotspot Key Expiration)
- **Problem:** A single, extremely popular key (e.g., a viral tweet, Black Friday product page) expires or gets evicted. Simultaneously, tens of thousands of requests query for that key, miss the cache, and all hammer the primary DB at the exact same millisecond.
- **Solutions:**
  - **Mutex Lock / SingleFlight:** Only the first request acquires a lock to query the DB and update Redis; other concurrent requests wait or retry.
  - **Logical Expiration (Background Refresh):** Store a logical timestamp inside the value: `{ value: ..., expireAt: timestamp }`. If expired, a background worker asynchronously refreshes the key while serving stale data temporarily.
  - **No TTL for ultra-hot keys:** Refresh them proactively via background cron or message queues.

#### 2. Cache Avalanche
- **Problem:** A large batch of cached keys share the exact same expiration time (e.g., midnight batch job set with `EX 3600`). When they all expire simultaneously, the database is crushed by massive concurrent misses. Or, the entire Redis instance crashes.
- **Solutions:**
  - **Add Jitter (Randomized TTL):** Instead of static 1 hour:
    ```js
    const ttl = 3600 + Math.floor(Math.random() * 300); // 1 hr ± 5 mins
    ```
  - **High Availability & Clustering:** Use Redis Sentinel or Redis Cluster with master-replica replication to prevent cluster-wide outages.
  - **Circuit Breakers & Rate Limiters:** Protect the database using libraries like `opossum`.

#### 3. Cache Penetration
- **Problem:** Malicious users or buggy clients repeatedly request data that **does not exist** in either Redis or the database (e.g., `GET /user/-9999999`). Every request bypasses the cache, hitting the database every time.
- **Solutions:**
  - **Cache Empty / Null Values:** Store `SET user:-9999999 "null" EX 60` with a short TTL so subsequent calls hit the cache.
  - **Bloom Filters:** Place a Redis Bloom Filter in front of the cache. Bloom filters probabilistically tell you if a key *definitely does not exist* in \(O(1)\) time with minimal memory.
  - **Strict Request Validation:** Validate IDs at the controller layer before querying (e.g., positive integer, valid UUID).

---

### Q2: How do you maintain Cache-Database Consistency? (Caching Patterns)

When data changes in the database, how do you update Redis?

#### Common Patterns:
1. **Cache-Aside (Lazy Loading) - Most Common:**
   - **Read:** Check Cache. If Hit \(\rightarrow\) Return. If Miss \(\rightarrow\) Query DB, write to Cache with TTL, return.
   - **Write:** Update the DB first, then **delete (invalidate)** the cache key (`DEL key`).
   - *Why delete instead of update?*
     - Prevents race conditions where two concurrent writes finish in reverse order in Redis.
     - Avoids computational overhead of updating items that might never be read again (lazy vs eager).
2. **Read-Through / Write-Through:**
   - Application treats the cache as the main data store. The cache provider handles reading/writing to the DB synchronously.
3. **Write-Behind (Write-Back):**
   - Application writes directly to the cache. The cache asynchronously batches writes to the DB. (Fastest writes, but risk of data loss if Redis crashes before DB sync).

#### Dual-Write Inconsistency Problem:
If DB write succeeds but Redis `DEL` fails (network blip):
- **Solution 1:** Set a short TTL so inconsistency is self-healing.
- **Solution 2 (CDC - Change Data Capture):** Use Debezium / Kafka to listen to PostgreSQL/MySQL binary logs (`binlog`/`WAL`) and asynchronously invalidate Redis keys.

---

### Q3: Why is Redis single-threaded for command execution, yet so fast?

Redis processes commands using a single thread, yet achieves 100,000+ operations/sec per core. Why?
1. **In-Memory Operations:** Operations execute in RAM; no disk I/O bottlenecks.
2. **Non-blocking I/O Multiplexing:** Uses `epoll` (Linux) or `kqueue` (macOS/BSD) to monitor thousands of socket connections simultaneously on a single thread.
3. **No Lock Contention / Thread Synchronization:** No mutexes, semaphores, deadlocks, or CPU context-switching overhead between multiple threads.
4. **Optimized C Data Structures:** SDS (Simple Dynamic Strings), Skiplists, ZipLists, and QuickLists are engineered for minimal memory footprint and fast traversals.

*(Note: Since Redis 6.0, Redis uses multi-threading strictly for network I/O read/write socket parsing, but the core command execution engine remains single-threaded and lock-free).*

---

### Q4: How do you implement a Distributed Lock in Redis?

#### Simple Implementation (Single Instance):
```bash
SET lock:order:1001 "unique_uuid_worker_1" NX PX 30000
```
- `NX`: Only set the key if it does **not** already exist (mutual exclusion).
- `PX 30000`: Expire in 30,000 ms (prevents deadlocks if the worker crashes).
- `unique_uuid`: Every worker generates a random token so only the owner can release the lock.

#### Safe Lock Release (Lua Script):
Releasing the lock must check ownership and delete atomically. If a lock expires before work finishes, you must not delete another worker's new lock!
```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

#### Multi-Node Production Locking (Redlock Algorithm):
For multi-master Redis architectures, acquire locks across \(N/2 + 1\) independent Redis masters with small timeouts to ensure fault tolerance.

---

### Q5: What is the difference between Redis RDB and AOF Persistence?

| Feature | RDB (Redis Database Snapshot) | AOF (Append-Only File) |
| :--- | :--- | :--- |
| **How it works** | Takes point-in-time binary snapshots of all data at intervals (e.g., every 5 mins). | Logs every write operation sequentially to an append log. |
| **Data Safety** | Potential data loss of several minutes between snapshots. | Near-zero data loss (sync options: `always`, `everysec`, `no`). |
| **Performance** | High runtime performance; snapshot is offloaded to a child process via `fork()`. | Slightly slower writes due to continuous file disk flushing. |
| **Recovery Speed** | Very fast recovery (compact binary dump). | Slower recovery (must replay all log commands from start). |
| **Production Recommendation** | Use **both**: RDB for fast backups & disaster recovery, AOF (`appendfsync everysec`) for minimal data loss. | |

---

### Q6: What is the dangerous `KEYS *` command, and what should you use instead?

- **Problem:** `KEYS pattern` scans the **entire** keyspace synchronously. Because Redis is single-threaded, if you have 10 million keys, `KEYS *` will block all client requests for seconds or minutes, bringing your entire backend down.
- **Solution:** Always use **`SCAN`** (or `SSCAN`, `HSCAN`, `ZSCAN`).
  - `SCAN` is cursor-based and iterates through the keyspace in small batches without blocking the main event loop.

```js
// Safe iteration with SCAN
let cursor = '0';
do {
  const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'user:*', 'COUNT', 100);
  cursor = nextCursor;
  // process keys...
} while (cursor !== '0');
```

---

### Q7: Redis Sentinel vs. Redis Cluster

- **Redis Sentinel:**
  - Provides **High Availability (HA)** and automatic failover for single Master-Replica setups.
  - Monitors masters, promotes replicas if a master dies, and notifies clients.
  - *Limitation:* Does not shard data across multiple nodes (total data volume is capped by the single master's RAM).
- **Redis Cluster:**
  - Provides **Horizontal Sharding (Partitioning)** and high availability.
  - Automatically splits data across **16,384 hash slots** (`CRC16(key) % 16384`).
  - Supports multiple master nodes, each with its own replicas, scaling both reads and writes horizontally.

---

## 7. Practical Node.js / Express Redis Caching Example

```javascript
const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Middleware for route-level caching
const cacheMiddleware = (durationInSeconds) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        // Cache Hit
        return res.json(JSON.parse(cachedResponse));
      }

      // Cache Miss — monkey-patch res.json to store result before returning
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Save to Redis with TTL + randomized jitter to prevent Avalanche
        const jitter = Math.floor(Math.random() * 60);
        redis.set(key, JSON.stringify(body), 'EX', durationInSeconds + jitter);
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Redis cache error:', err);
      // Graceful fallback to database query if Redis fails
      next();
    }
  };
};

// Route using Redis Cache
app.get('/api/products/:id', cacheMiddleware(300), async (req, res) => {
  // Simulate slow DB lookup
  const product = await fakeDbLookup(req.params.id);
  res.json(product);
});

async function fakeDbLookup(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'Mechanical Keyboard', price: 99.99 });
    }, 1500); // 1.5s DB query
  });
}

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 8. Summary Cheat Sheet for Interviews

1. **What is Redis?** Fast, in-memory, single-threaded key-value store with rich data types.
2. **Why TTL on every key?** Prevents OOM crashes, purges stale data, clears ephemeral entries, and reduces memory eviction pressure.
3. **Eviction:** LRU, LFU, TTL, Random, or `noeviction` when reaching `maxmemory`.
4. **Cache Breakdown:** 1 hot key expires \(\rightarrow\) use Mutex Lock / SingleFlight.
5. **Cache Avalanche:** Many keys expire at once \(\rightarrow\) add random TTL jitter.
6. **Cache Penetration:** Key does not exist anywhere \(\rightarrow\) cache nulls or use Bloom Filter.
7. **Write Invalidation:** Prefer deleting cache key on update (Cache-Aside pattern).
8. **Keys command:** Never use `KEYS *` in production; use `SCAN`.

