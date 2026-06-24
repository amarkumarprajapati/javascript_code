# PostgreSQL — Aggregation (Commands)

## Execution Order

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## Aggregate Functions

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;
SELECT SUM(amount) FROM orders;
SELECT AVG(salary) FROM employees;
SELECT MIN(price), MAX(price) FROM products;
SELECT ROUND(AVG(amount), 2) FROM orders;
```

| Function | Returns |
| --- | --- |
| `COUNT(*)` | total rows |
| `COUNT(col)` | non-null values |
| `COUNT(DISTINCT col)` | unique non-null values |
| `SUM(col)` | total |
| `AVG(col)` | average |
| `MIN(col)` / `MAX(col)` | min / max |
| `STRING_AGG(col, ',')` | concat strings |

---

## GROUP BY

```sql
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

SELECT user_id, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
GROUP BY user_id;

SELECT city, role, COUNT(*)
FROM users
GROUP BY city, role;

SELECT DATE(created_at) AS day, COUNT(*), SUM(amount)
FROM orders
GROUP BY DATE(created_at)
ORDER BY day DESC;
```

---

## HAVING (filter after GROUP BY)

```sql
SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 1000;

SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city
HAVING COUNT(*) > 10
ORDER BY cnt DESC;
```

| | WHERE | HAVING |
| --- | --- | --- |
| Filters | rows | groups |
| Uses aggregates? | No | Yes |
| Runs | before GROUP BY | after GROUP BY |

---

## CTE (WITH)

```sql
WITH big_orders AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  GROUP BY user_id
  HAVING SUM(amount) > 1000
)
SELECT u.name, b.total
FROM big_orders b
JOIN users u ON u.id = b.user_id;

-- Multiple CTEs
WITH
  active_users AS (SELECT id FROM users WHERE active = true),
  user_orders  AS (SELECT user_id, COUNT(*) AS cnt FROM orders GROUP BY user_id)
SELECT u.name, o.cnt
FROM active_users au
JOIN users u ON u.id = au.id
JOIN user_orders o ON o.user_id = u.id;
```

---

## Window Functions

```sql
-- Rank
SELECT name, dept, salary,
  RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS row_num
FROM employees;

-- Running total
SELECT order_date, amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- Moving average
SELECT order_date, amount,
  AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg_7day
FROM orders;

-- Lag / Lead
SELECT name, salary,
  LAG(salary)  OVER (ORDER BY salary) AS prev_salary,
  LEAD(salary) OVER (ORDER BY salary) AS next_salary
FROM employees;

-- First / Last in partition
SELECT dept, name, salary,
  FIRST_VALUE(salary) OVER (PARTITION BY dept ORDER BY salary DESC) AS top_salary
FROM employees;
```

| Function | Purpose |
| --- | --- |
| `ROW_NUMBER()` | unique sequential number |
| `RANK()` | rank with gaps |
| `DENSE_RANK()` | rank without gaps |
| `NTILE(n)` | divide into n buckets |
| `LAG(col, n)` | previous row value |
| `LEAD(col, n)` | next row value |
| `SUM() OVER` | running total |
| `AVG() OVER` | moving average |

---

## Common Interview Queries

```sql
-- 2nd highest salary
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Nth highest salary
SELECT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;   -- 2nd highest

-- Duplicates
SELECT email, COUNT(*) FROM users
GROUP BY email HAVING COUNT(*) > 1;

-- Employees earning more than manager
SELECT e.name AS employee, m.name AS manager, e.salary, m.salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;

-- Top 3 per department
SELECT * FROM (
  SELECT name, dept, salary,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
) t WHERE rnk <= 3;

-- Monthly revenue
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS orders,
  SUM(amount) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Users with no orders
SELECT u.name FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;
```

---

## UNION / INTERSECT / EXCEPT

```sql
SELECT name FROM users WHERE city = 'NYC'
UNION
SELECT name FROM users WHERE city = 'LA';

SELECT name FROM users WHERE active = true
INTERSECT
SELECT name FROM users WHERE age > 18;

SELECT name FROM users
EXCEPT
SELECT u.name FROM users u JOIN orders o ON o.user_id = u.id;
```

---

## CASE

```sql
SELECT name, age,
  CASE
    WHEN age < 18 THEN 'minor'
    WHEN age < 65 THEN 'adult'
    ELSE 'senior'
  END AS age_group
FROM users;

SELECT name,
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'user'  THEN 2
    ELSE 3
  END AS role_order
FROM users
ORDER BY role_order;
```

---

## Date Functions

```sql
SELECT NOW();
SELECT CURRENT_DATE;
SELECT CURRENT_TIMESTAMP;
SELECT DATE_TRUNC('month', created_at) FROM orders;
SELECT EXTRACT(YEAR FROM created_at) FROM orders;
SELECT AGE(NOW(), created_at) FROM users;
SELECT created_at + INTERVAL '7 days' FROM orders;
SELECT created_at BETWEEN NOW() - INTERVAL '30 days' AND NOW() FROM orders;
```
