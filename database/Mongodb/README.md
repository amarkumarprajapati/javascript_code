# MongoDB Practice Series

This folder contains a complete hands-on practice path using a small but realistic nested dataset.

## Dataset

Database name: **`practice_db`**

Collections:
- `users` (12) – nested address, preferences, paymentMethods
- `products` (12) – nested specs, variants array, tags
- `orders` (15) – nested items array, shipping & payment objects
- `reviews` (12) – nested replies array
- `categories` (5)

---

## Practice Files (in recommended order)

| File | Topic | Focus |
|------|------|------|
| [01-operations.md](01-operations.md) | CRUD Operations | find, insert, update, delete, projection |
| [02-aggregation.md](02-aggregation.md) | Aggregation Pipeline | $match, $group, $unwind, $lookup, $project |
| [03-indexing.md](03-indexing.md) | Indexing | single, compound, text, partial, explain |
| [04-performance.md](04-performance.md) | Performance | explain, covering queries, best practices |
| [05-search-complex.md](05-search-complex.md) | Search & Complex Queries | text search, regex, $elemMatch, logical operators |
| [06-nested-arrays-objects.md](06-nested-arrays-objects.md) | Nested Data | deep queries & updates on arrays/objects |
| [07-lookup-joins.md](07-lookup-joins.md) | Joins with $lookup | single & multiple lookups, pipeline lookups |
| [08-update-operators.md](08-update-operators.md) | Update Operators | $set, $inc, $push, $pull, arrayFilters |
| [09-schema-validation.md](09-schema-validation.md) | Schema Validation | $jsonSchema (optional) |
| [10-practice-questions.md](10-practice-questions.md) | Mixed Questions | 30 progressive challenges |

---

## How to Start

1. Make sure the sample data is loaded (`practice_db`).
2. Open MongoDB Compass or `mongosh`.
3. Start with **01-operations.md**.
4. After finishing a file, try the challenges at the bottom.
5. Move to the next file only when you feel comfortable.

---

## Tips

- Always run `.explain("executionStats")` when learning indexes.
- Prefer `$elemMatch` when querying multiple conditions on the same array element.
- In aggregation, put `$match` as early as possible.
- Use projection to return only the fields you need.

Happy practicing!
