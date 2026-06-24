# PostgreSQL — Operations (Commands)

## Connect & Database

```sql
-- psql connect
psql -U postgres -d mydb -h localhost -p 5432

\c mydb          -- switch database
\l               -- list databases
\dt              -- list tables
\d users         -- describe table
\q               -- quit
```

```sql
CREATE DATABASE mydb;
CREATE DATABASE mydb OWNER admin ENCODING 'UTF8';

DROP DATABASE mydb;

\c mydb          -- connect
SELECT current_database();
```

---

## CREATE TABLE

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  age         INTEGER CHECK (age >= 0),
  role        VARCHAR(20) DEFAULT 'user',
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount      DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT NOW()
);
```

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users RENAME COLUMN name TO full_name;
ALTER TABLE users RENAME TO customers;

ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);
ALTER TABLE users DROP CONSTRAINT uq_email;
```

```sql
DROP TABLE orders;
DROP TABLE IF EXISTS orders CASCADE;
TRUNCATE TABLE orders;              -- delete all rows, keep structure
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
```

---

## INSERT

```sql
INSERT INTO users (name, email, age)
VALUES ('John', 'john@mail.com', 30);

INSERT INTO users (name, email, age) VALUES
  ('Alice', 'alice@mail.com', 25),
  ('Bob',   'bob@mail.com',   35);

INSERT INTO users (name, email)
SELECT name, email FROM temp_users;

-- Upsert (insert or update on conflict)
INSERT INTO users (email, name, age)
VALUES ('john@mail.com', 'John', 31)
ON CONFLICT (email) DO UPDATE
  SET name = EXCLUDED.name, age = EXCLUDED.age;

INSERT INTO users (email, name)
VALUES ('john@mail.com', 'John')
ON CONFLICT (email) DO NOTHING;
```

---

## SELECT (READ)

```sql
SELECT * FROM users;
SELECT name, email FROM users;
SELECT DISTINCT city FROM users;

SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE name LIKE 'J%';
SELECT * FROM users WHERE email ILIKE '%@gmail.com';  -- case insensitive
SELECT * FROM users WHERE age BETWEEN 18 AND 65;
SELECT * FROM users WHERE role IN ('admin', 'user');
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;

SELECT * FROM users
WHERE age >= 18 AND city = 'NYC';

SELECT * FROM users
WHERE age < 18 OR city = 'LA';

SELECT * FROM users
WHERE NOT active;

SELECT * FROM users
WHERE age > 25 AND city IN ('NYC', 'LA')
ORDER BY name ASC, age DESC
LIMIT 10 OFFSET 20;
```

### Comparison operators

| Operator | Meaning |
| --- | --- |
| `=` | equal |
| `<>` or `!=` | not equal |
| `>`, `<`, `>=`, `<=` | comparison |
| `BETWEEN a AND b` | range |
| `IN (...)` | in list |
| `IS NULL` / `IS NOT NULL` | null check |
| `LIKE 'J%'` | pattern (case sensitive) |
| `ILIKE 'j%'` | pattern (case insensitive) |

---

## JOIN

```sql
-- INNER JOIN
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON o.user_id = u.id;

-- LEFT JOIN
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- RIGHT JOIN
SELECT u.name, o.amount
FROM users u
RIGHT JOIN orders o ON o.user_id = u.id;

-- FULL OUTER JOIN
SELECT u.name, o.amount
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;

-- CROSS JOIN
SELECT u.name, p.name FROM users u CROSS JOIN products p;

-- Self join
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

---

## UPDATE

```sql
UPDATE users SET age = 31 WHERE email = 'john@mail.com';

UPDATE users SET age = age + 1 WHERE active = true;

UPDATE users
SET name = 'John Doe', updated_at = NOW()
WHERE id = 1;

UPDATE orders SET status = 'cancelled'
WHERE created_at < NOW() - INTERVAL '30 days';

-- UPDATE with JOIN
UPDATE orders o
SET status = 'archived'
FROM users u
WHERE o.user_id = u.id AND u.active = false;

-- UPDATE from subquery
UPDATE products SET price = price * 0.9
WHERE category_id IN (SELECT id FROM categories WHERE name = 'sale');
```

---

## DELETE

```sql
DELETE FROM users WHERE id = 1;
DELETE FROM users WHERE active = false;
DELETE FROM orders WHERE status = 'cancelled';

-- DELETE with JOIN
DELETE FROM orders o
USING users u
WHERE o.user_id = u.id AND u.email = 'spam@mail.com';

-- DELETE all
DELETE FROM logs;
TRUNCATE logs;   -- faster for all rows
```

---

## Subqueries

```sql
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 500);

SELECT name FROM users
WHERE id = (SELECT user_id FROM orders ORDER BY amount DESC LIMIT 1);

SELECT name, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

---

## Transactions

```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

BEGIN;
  DELETE FROM orders WHERE id = 5;
ROLLBACK;

-- Savepoint
BEGIN;
  INSERT INTO orders (user_id, amount) VALUES (1, 100);
  SAVEPOINT sp1;
  INSERT INTO orders (user_id, amount) VALUES (999, 50);  -- may fail
  ROLLBACK TO sp1;
COMMIT;
```

---

## Useful psql Commands

```sql
\dt              -- list tables
\dt+             -- list tables with size
\d users         -- table structure
\di              -- list indexes
\dv              -- list views
\df              -- list functions
\du              -- list users/roles
\l               -- list databases
\conninfo        -- connection info
\timing on       -- show query time
\x               -- expanded output (vertical)
\copy users TO 'users.csv' CSV HEADER
\copy users FROM 'users.csv' CSV HEADER
```
