# PostgreSQL — Replication, Partitioning & Concepts (Commands)

## ACID Transactions

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

ROLLBACK;

-- Isolation levels
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;   -- default
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Check isolation level
SHOW transaction_isolation;
```

| Level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| READ UNCOMMITTED | — | — | — |
| READ COMMITTED | No | Yes | Yes |
| REPEATABLE READ | No | No | No (PG) |
| SERIALIZABLE | No | No | No |

---

## Locking

```sql
-- Row lock
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Share lock (read)
SELECT * FROM products WHERE id = 5 FOR SHARE;

-- Skip locked rows
SELECT * FROM jobs WHERE status = 'pending'
FOR UPDATE SKIP LOCKED LIMIT 1;

-- Table lock
LOCK TABLE users IN ACCESS EXCLUSIVE MODE;

-- Check locks
SELECT pid, relation::regclass, mode, granted
FROM pg_locks
WHERE relation IS NOT NULL;
```

---

## Streaming Replication (Primary → Standby)

```bash
# primary postgresql.conf
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10

# primary pg_hba.conf
host replication replicator 192.168.1.0/24 scram-sha-256
```

```sql
-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'secret';

-- Check replication status (primary)
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn
FROM pg_stat_replication;

-- Check lag (standby)
SELECT pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn(),
       pg_last_wal_receive_lsn() - pg_last_wal_replay_lsn() AS lag;
```

---

## Read Replicas

```sql
-- Connect to standby for reads
-- Application connection string points read queries to replica

-- Hot standby queries on replica
SELECT * FROM pg_stat_database;

-- Promote standby to primary (failover)
pg_ctl promote -D /var/lib/postgresql/data
```

---

## Table Partitioning

### Range partitioning

```sql
CREATE TABLE orders (
  id         SERIAL,
  user_id    INTEGER,
  amount     DECIMAL(10,2),
  created_at DATE NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2023 PARTITION OF orders
  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE orders_2024 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE orders_2025 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Default partition (catch unmatched)
CREATE TABLE orders_default PARTITION OF orders DEFAULT;

-- Add new partition
CREATE TABLE orders_2026 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Drop partition
DROP TABLE orders_2023;

-- Detach partition
ALTER TABLE orders DETACH PARTITION orders_2023;
```

### List partitioning

```sql
CREATE TABLE users (
  id    SERIAL,
  name  VARCHAR(100),
  region VARCHAR(20) NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE users_us PARTITION OF users FOR VALUES IN ('US', 'CA');
CREATE TABLE users_eu PARTITION OF users FOR VALUES IN ('UK', 'DE', 'FR');
CREATE TABLE users_other PARTITION OF users DEFAULT;
```

### Hash partitioning

```sql
CREATE TABLE logs (
  id         SERIAL,
  message    TEXT,
  created_at TIMESTAMPTZ
) PARTITION BY HASH (id);

CREATE TABLE logs_p0 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE logs_p1 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE logs_p2 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE logs_p3 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

---

## Logical Replication

```sql
-- Publisher (source)
CREATE PUBLICATION mypub FOR TABLE users, orders;

-- Subscriber (target)
CREATE SUBSCRIPTION mysub
  CONNECTION 'host=primary_host dbname=mydb user=replicator password=secret'
  PUBLICATION mypub;

-- Check
SELECT * FROM pg_publication;
SELECT * FROM pg_subscription;
```

---

## Backup & Restore

```bash
# Dump database
pg_dump -U postgres -d mydb -F c -f mydb_backup.dump
pg_dump -U postgres -d mydb -F p -f mydb_backup.sql

# Dump single table
pg_dump -U postgres -d mydb -t users -f users.sql

# Dump schema only
pg_dump -U postgres -d mydb --schema-only -f schema.sql

# Restore
pg_restore -U postgres -d mydb -c mydb_backup.dump
psql -U postgres -d mydb -f mydb_backup.sql

# All databases
pg_dumpall -U postgres -f all_databases.sql
```

```sql
-- Point-in-time recovery (PITR) — requires WAL archiving
-- archive_mode = on
-- archive_command = 'cp %p /wal_archive/%f'
```

---

## Extensions

```sql
-- List installed
\dx

-- Common extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- encryption
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- query stats
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";     -- GIN on scalars
CREATE EXTENSION IF NOT EXISTS "postgis";      -- geospatial

-- Fuzzy search
SELECT * FROM users WHERE name % 'Jon';  -- trigram similarity
SELECT similarity('John', 'Jon');

DROP EXTENSION pg_trgm;
```

---

## Roles & Security

```sql
CREATE ROLE app_readonly;
CREATE ROLE app_readwrite LOGIN PASSWORD 'secret';

GRANT CONNECT ON DATABASE mydb TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_readwrite;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_readwrite;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO app_readonly;

DROP ROLE app_readonly;

-- List roles
\du
SELECT rolname FROM pg_roles;
```

---

## Useful System Commands

```sql
-- Version
SELECT version();

-- Database size
SELECT pg_size_pretty(pg_database_size('mydb'));

-- Active queries
SELECT pid, now() - query_start AS duration, state, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Kill query
SELECT pg_cancel_backend(12345);
SELECT pg_terminate_backend(12345);

-- Reset statistics
SELECT pg_stat_reset();

-- Checkpoints
SELECT * FROM pg_stat_bgwriter;
```

---

## PostgreSQL vs MongoDB Terms

| PostgreSQL | MongoDB |
| --- | --- |
| database | database |
| table | collection |
| row | document |
| column | field |
| JOIN | `$lookup` / embed |
| INDEX | index |
| PARTITION | sharding (similar concept) |
| REPLICATION | replica set |
| SERIAL / IDENTITY | ObjectId |

---

## Quick Command Reference

```sql
-- DDL
CREATE TABLE / ALTER TABLE / DROP TABLE / TRUNCATE

-- DML
INSERT / SELECT / UPDATE / DELETE

-- TCL
BEGIN / COMMIT / ROLLBACK / SAVEPOINT

-- Index
CREATE INDEX / DROP INDEX / REINDEX

-- Maintenance
VACUUM / ANALYZE / CLUSTER

-- Monitor
EXPLAIN ANALYZE / pg_stat_activity / pg_stat_statements

-- Backup
pg_dump / pg_restore / pg_dumpall

-- Partition
PARTITION BY RANGE / LIST / HASH

-- Replication
CREATE PUBLICATION / CREATE SUBSCRIPTION
```
