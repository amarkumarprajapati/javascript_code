# PostgreSQL — Indexing (Commands)

## Create Index

```sql
-- Single column
CREATE INDEX idx_users_email ON users (email);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- Composite index
CREATE INDEX idx_orders_user_status ON orders (user_id, status);

-- Descending
CREATE INDEX idx_orders_created ON orders (created_at DESC);

-- Partial index (filtered)
CREATE INDEX idx_active_users ON users (email) WHERE active = true;

-- Expression index
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Concurrent (no lock — production)
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);

-- If not exists
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
```

---

## Index Types

```sql
-- B-tree (default) — equality, range, sort
CREATE INDEX idx_users_age ON users USING btree (age);

-- Hash — equality only
CREATE INDEX idx_users_email ON users USING hash (email);

-- GIN — arrays, JSONB, full-text
CREATE INDEX idx_products_tags ON products USING gin (tags);
CREATE INDEX idx_data_json ON data USING gin (payload jsonb_path_ops);

-- GiST — geometric, full-text, range types
CREATE INDEX idx_locations ON places USING gist (location);

-- BRIN — large tables, naturally ordered data
CREATE INDEX idx_logs_created ON logs USING brin (created_at);
```

| Type | Use for |
| --- | --- |
| **B-tree** | `=`, `<`, `>`, `BETWEEN`, `ORDER BY` (default) |
| **Hash** | `=` only |
| **GIN** | arrays, JSONB, full-text search |
| **GiST** | geometry, ranges, full-text |
| **BRIN** | very large tables, correlated physical order |

---

## Full-Text Search Index

```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

UPDATE articles SET search_vector =
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''));

CREATE INDEX idx_articles_search ON articles USING gin (search_vector);

-- Query
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql & indexing');

-- Auto-update with trigger
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', title, body);
```

---

## JSONB Index

```sql
CREATE INDEX idx_data_payload ON data USING gin (payload);

-- Query
SELECT * FROM data WHERE payload @> '{"status": "active"}';
SELECT * FROM data WHERE payload ->> 'city' = 'NYC';

-- Specific path index
CREATE INDEX idx_data_city ON data ((payload ->> 'city'));
```

---

## Manage Indexes

```sql
-- List indexes
\di
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';

-- Drop index
DROP INDEX idx_users_email;
DROP INDEX CONCURRENTLY idx_users_email;

-- Rename
ALTER INDEX idx_users_email RENAME TO idx_users_email_v2;

-- Reindex (rebuild)
REINDEX INDEX idx_users_email;
REINDEX TABLE users;
REINDEX TABLE CONCURRENTLY users;
```

---

## EXPLAIN — Check Index Usage

```sql
EXPLAIN SELECT * FROM users WHERE email = 'john@mail.com';

EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@mail.com';

EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM users WHERE email = 'john@mail.com';
```

| Plan node | Meaning |
| --- | --- |
| `Seq Scan` | full table scan — **no index** |
| `Index Scan` | uses index, fetches rows |
| `Index Only Scan` | all data from index — **best** |
| `Bitmap Index Scan` | index + bitmap heap scan |

---

## Composite Index Order

```sql
-- Query: WHERE user_id = 1 AND status = 'paid' ORDER BY created_at DESC
CREATE INDEX idx_orders ON orders (user_id, status, created_at DESC);

-- Left-prefix: supports queries on (user_id), (user_id, status), (user_id, status, created_at)
-- Does NOT support: (status) alone, (created_at) alone
```

---

## Primary Key & Unique (Auto Index)

```sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,           -- auto creates index
  email VARCHAR(255) UNIQUE NOT NULL  -- auto creates unique index
);

ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);
```

---

## Covering Index (INCLUDE)

```sql
-- PostgreSQL 11+ — index-only scan without visiting table
CREATE INDEX idx_users_email ON users (email) INCLUDE (name, age);

SELECT name, age FROM users WHERE email = 'john@mail.com';
-- Index Only Scan — no heap fetch
```
