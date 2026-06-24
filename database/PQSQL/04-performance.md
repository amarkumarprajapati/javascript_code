# PostgreSQL — Performance (Commands)

## EXPLAIN — Analyze Queries

```sql
EXPLAIN SELECT * FROM users WHERE email = 'john@mail.com';

EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@mail.com';

EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON)
SELECT u.name, o.amount
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.active = true;
```

```sql
-- Enable auto EXPLAIN for slow queries (postgresql.conf)
-- log_min_duration_statement = 1000   -- log queries > 1s
-- auto_explain.log_min_duration = 1000
```

---

## VACUUM & ANALYZE

```sql
-- Update statistics for query planner
ANALYZE users;
ANALYZE;   -- all tables

-- Reclaim dead tuple space
VACUUM users;
VACUUM FULL users;   -- rewrites table (locks table)
VACUUM ANALYZE users;

-- Auto vacuum settings (postgresql.conf)
-- autovacuum = on
-- autovacuum_vacuum_threshold = 50
```

```sql
-- Check dead tuples
SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Table bloat
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Query Optimization Commands

```sql
-- Select only needed columns
SELECT name, email FROM users WHERE id = 1;

-- LIMIT results
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20;

-- Cursor pagination (not OFFSET for large pages)
SELECT * FROM orders WHERE id > 1000 ORDER BY id LIMIT 20;

-- EXISTS instead of IN for large subqueries
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- JOIN instead of subquery when possible
SELECT u.name, o.amount
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.amount > 500;
```

---

## Connection Pooling

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE state != 'idle';

-- Kill long-running query
SELECT pg_cancel_backend(pid);   -- cancel query
SELECT pg_terminate_backend(pid); -- kill connection

-- Max connections (postgresql.conf)
-- max_connections = 100
```

Use **PgBouncer** for connection pooling in production.

---

## Configuration (postgresql.conf)

```ini
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
work_mem = 4MB                  # per sort/hash operation
maintenance_work_mem = 64MB     # for VACUUM, CREATE INDEX
wal_buffers = 16MB
random_page_cost = 1.1          # SSD: lower than default 4
effective_io_concurrency = 200  # SSD
max_connections = 100
log_min_duration_statement = 1000
```

```sql
-- Reload config without restart
SELECT pg_reload_conf();

-- Show setting
SHOW shared_buffers;
SHOW max_connections;
```

---

## Monitoring Commands

```sql
-- Slow queries (requires pg_stat_statements extension)
CREATE EXTENSION pg_stat_statements;

SELECT query, calls, mean_time, total_time, rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Reset stats
SELECT pg_stat_statements_reset();

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Unused indexes (idx_scan = 0)
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexrelname NOT LIKE '%pkey%';

-- Cache hit ratio (should be > 99%)
SELECT
  sum(heap_blks_hit) / nullif(sum(heap_blks_hit + heap_blks_read), 0) AS cache_hit_ratio
FROM pg_statio_user_tables;

-- Table sizes
SELECT relname,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS table_size,
  pg_size_pretty(pg_indexes_size(relid)) AS index_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

---

## Materialized View (Cache Expensive Queries)

```sql
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(*) AS orders,
       SUM(amount) AS revenue
FROM orders
GROUP BY 1;

SELECT * FROM monthly_revenue ORDER BY month DESC;

-- Refresh
REFRESH MATERIALIZED VIEW monthly_revenue;
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;

CREATE UNIQUE INDEX ON monthly_revenue (month);  -- required for CONCURRENTLY
```

---

## Partitioning (Large Tables)

```sql
CREATE TABLE orders (
  id         SERIAL,
  user_id    INTEGER,
  amount     DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE orders_2025 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Query auto-routes to correct partition
SELECT * FROM orders WHERE created_at >= '2024-06-01';
```

---

## Bulk Operations

```sql
-- Fast bulk insert
COPY users (name, email) FROM '/path/users.csv' CSV HEADER;

-- Bulk insert from SELECT
INSERT INTO users_archive SELECT * FROM users WHERE active = false;

-- Disable triggers temporarily (careful)
ALTER TABLE users DISABLE TRIGGER ALL;
-- bulk operations...
ALTER TABLE users ENABLE TRIGGER ALL;
```

---

## REINDEX & Maintenance

```sql
REINDEX INDEX idx_users_email;
REINDEX TABLE users;
REINDEX TABLE CONCURRENTLY users;
REINDEX DATABASE mydb;

-- Cluster table by index (physical reorder)
CLUSTER users USING idx_users_email;
```
