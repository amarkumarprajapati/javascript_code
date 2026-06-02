# System Design Checklist (Mid-Level)

> You already have deep notes: `Microservices.md`, `RESTfulArchitecture.md`, and 2 books. This file is the **interview framework** + core concepts to revise fast.

## The framework (use in every design round)
1. **Clarify requirements** — functional + non-functional (scale, latency, availability).
2. **Estimate scale** — users, QPS, storage, read/write ratio.
3. **Define API** — main endpoints.
4. **High-level design** — boxes: client → LB → app servers → cache → DB.
5. **Data model** — schema + SQL vs NoSQL choice.
6. **Deep dive** — bottleneck component (DB scaling, caching).
7. **Trade-offs** — discuss consistency vs availability, cost.

## Core building blocks
- **Load Balancer** — distributes traffic (round robin, least connections); health checks.
- **Caching** — Redis/Memcached; reduce DB load. Strategies: cache-aside, write-through, write-back. TTL + eviction (LRU).
- **CDN** — cache static assets near users.
- **Database scaling**
  - **Replication** — primary-replica; read scaling, HA.
  - **Sharding** — split data by key; write scaling.
  - **Indexing** — speed reads.
- **Message Queue** — Kafka/RabbitMQ/SQS; async, decoupling, smoothing spikes.
- **Rate limiting** — token bucket / sliding window.

## CAP theorem
In a network partition, choose **Consistency** or **Availability** (can't have both).
- **CP** — banks (correctness first).
- **AP** — social feeds (availability first, eventual consistency).

## Consistency models
- **Strong** — every read sees latest write.
- **Eventual** — replicas converge over time.

## SQL vs NoSQL (design decision)
- **SQL** — relations, transactions, strong consistency.
- **NoSQL** — flexible schema, horizontal scale, high write throughput.

## Scaling approach
- **Vertical** — bigger machine (limited, single point of failure).
- **Horizontal** — more machines (preferred; needs statelessness + LB).
- Keep app servers **stateless** → store sessions in Redis/JWT.

## Reliability
- Redundancy, failover, retries with backoff, circuit breakers, monitoring/alerts.

## Common LLD / HLD questions (practice these)
- [ ] URL shortener (hashing, base62, DB, cache, redirect)
- [ ] Rate limiter (token bucket in Redis)
- [ ] News feed / timeline (fan-out on write vs read)
- [ ] Chat app (WebSockets, message queue, delivery status)
- [ ] E-commerce cart/checkout (inventory, transactions, idempotency)
- [ ] File storage (chunking, metadata, CDN)
- [ ] Notification system (queue + workers + retries)

## LLD / OOP design (you have OOP notes in Theory/)
- SOLID principles.
- Design patterns: Singleton, Factory, Observer, Strategy, Adapter.
- Example: design a parking lot, elevator, BookMyShow.

---

## Common interview questions
1. **How to scale a read-heavy app?** → replicas + caching + CDN.
2. **How to scale writes?** → sharding + queues + denormalization.
3. **CAP theorem?** → partition forces consistency-vs-availability choice.
4. **Cache invalidation strategies?** → TTL, write-through, cache-aside.
5. **How to keep servers stateless?** → externalize session (Redis/JWT).
6. **How to handle traffic spikes?** → queue + autoscaling + rate limiting.
