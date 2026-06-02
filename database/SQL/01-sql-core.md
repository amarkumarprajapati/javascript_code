# SQL Core (Relational Databases)

## Basics
```sql
SELECT name, email FROM users
WHERE age >= 18
ORDER BY name ASC
LIMIT 10 OFFSET 0;
```
Execution order (logical): `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`.

## JOINs (most asked)
| Join | Returns |
| --- | --- |
| `INNER JOIN` | rows matching in both tables |
| `LEFT JOIN` | all left + matched right (NULL if none) |
| `RIGHT JOIN` | all right + matched left |
| `FULL OUTER JOIN` | all rows from both |
| `CROSS JOIN` | cartesian product |

```sql
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.amount > 100;
```

## Aggregation + GROUP BY / HAVING
- Aggregate fns: `COUNT, SUM, AVG, MIN, MAX`.
- `WHERE` filters rows **before** grouping; `HAVING` filters **after**.
```sql
SELECT user_id, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 1000
ORDER BY total DESC;
```

## Subqueries & CTEs
```sql
-- subquery
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 500);

-- CTE (readable)
WITH big_spenders AS (
  SELECT user_id, SUM(amount) total FROM orders GROUP BY user_id HAVING SUM(amount) > 1000
)
SELECT u.name, b.total FROM big_spenders b JOIN users u ON u.id = b.user_id;
```

## Window functions (senior signal)
```sql
SELECT name, dept, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank_in_dept
FROM employees;
```

## Indexes
- Speed up lookups/joins/sorts; B-tree by default.
- Trade-off: slower INSERT/UPDATE, extra storage.
- Index columns used in `WHERE`, `JOIN`, `ORDER BY`.

## Normalization (reduce redundancy)
- **1NF** — atomic values, no repeating groups.
- **2NF** — 1NF + no partial dependency on part of composite key.
- **3NF** — 2NF + no transitive dependency.
- **Denormalize** for read performance when needed.

## ACID (transactions)
- **Atomicity** — all or nothing.
- **Consistency** — valid state transitions.
- **Isolation** — concurrent txns don't interfere.
- **Durability** — committed data survives crashes.
```sql
BEGIN;
UPDATE accounts SET bal = bal - 100 WHERE id = 1;
UPDATE accounts SET bal = bal + 100 WHERE id = 2;
COMMIT; -- or ROLLBACK on error
```

## Common interview SQL problems
- 2nd highest salary, Nth highest.
- Duplicates: `GROUP BY col HAVING COUNT(*) > 1`.
- Employees earning more than their manager (self join).
- Running total (window function).

```sql
-- 2nd highest salary
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

---

## Common interview questions
1. **WHERE vs HAVING?** → before vs after grouping.
2. **INNER vs LEFT JOIN?** → matches only vs all left rows.
3. **What is normalization?** → reduce redundancy via 1NF/2NF/3NF.
4. **ACID?** → atomicity, consistency, isolation, durability.
5. **SQL vs NoSQL?** → structured + relations + transactions vs flexible schema + scale-out.
6. **What is an index trade-off?** → faster reads, slower writes + storage.
