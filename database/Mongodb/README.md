# MongoDB Practice Series & Learning Roadmap

This folder contains a complete, organized hands-on practice path divided by topic into subfolders with individual topic markdown files.

## Dataset

Database name: **`practice_db`**

Collections:
- `users` (12) – nested address, preferences, paymentMethods
- `products` (12) – nested specs, variants array, tags
- `orders` (15) – nested items array, shipping & payment objects
- `reviews` (12) – nested replies array
- `categories` (5)

To generate/regenerate data:
```bash
node generate.js
```

---

## 🗂️ Folder Structure & Learning Order

### 1. [01-crud-operations/](01-crud-operations/)
Covers foundational query operations, mutations, arrays, and complex filters.
- [01-find-read.md](01-crud-operations/01-find-read.md) — Basic and intermediate `find()`, `findOne()` queries
- [02-projection.md](01-crud-operations/02-projection.md) — Returning only specific fields
- [03-sort-limit-skip.md](01-crud-operations/03-sort-limit-skip.md) — Pagination and ordering
- [04-count-distinct.md](01-crud-operations/04-count-distinct.md) — `countDocuments()` and `distinct()`
- [05-insert-create.md](01-crud-operations/05-insert-create.md) — `insertOne()`, `insertMany()`
- [06-basic-update.md](01-crud-operations/06-basic-update.md) — `updateOne()`, `updateMany()` basics
- [07-delete.md](01-crud-operations/07-delete.md) — `deleteOne()`, `deleteMany()`
- [08-update-operators-deep-dive.md](01-crud-operations/08-update-operators-deep-dive.md) — `$set`, `$inc`, `$push`, `$pull`, `arrayFilters`
- [09-nested-arrays-objects.md](01-crud-operations/09-nested-arrays-objects.md) — Queries and updates on embedded arrays & subdocuments
- [10-search-complex.md](01-crud-operations/10-search-complex.md) — `$elemMatch`, `$regex`, `$and`, `$or`, text search
- [11-crud-challenges.md](01-crud-operations/11-crud-challenges.md) — Practice challenges for CRUD

---

### 2. [02-aggregation/](02-aggregation/)
Covers aggregation pipeline stages and joins.
- [01-match.md](02-aggregation/01-match.md) — `$match` filter stage
- [02-project-addFields.md](02-aggregation/02-project-addFields.md) — `$project`, `$addFields`, and `$set`
- [03-group.md](02-aggregation/03-group.md) — `$group` with accumulators (`$sum`, `$avg`, `$push`)
- [04-unwind.md](02-aggregation/04-unwind.md) — `$unwind` array deconstruction
- [05-sort-limit.md](02-aggregation/05-sort-limit.md) — `$sort`, `$limit`, and `$skip` stages
- [06-lookup.md](02-aggregation/06-lookup.md) — `$lookup` joins (basic and pipeline-based)
- [07-facet-and-bucket.md](02-aggregation/07-facet-and-bucket.md) — `$facet`, `$fill`, `$bucket`, `$bucketAuto`
- [08-out-merge-unionWith.md](02-aggregation/08-out-merge-unionWith.md) — `$out`, `$merge`, and `$unionWith`
- [09-pipeline-challenges.md](02-aggregation/09-pipeline-challenges.md) — Multi-stage complex pipeline challenges

---

### 3. [03-operators/](03-operators/)
Expression operators used inside aggregation expressions (`$project`, `$addFields`, `$match`).
- [01-arithmetic-operators.md](03-operators/01-arithmetic-operators.md) — `$add`, `$multiply`, `$round`, `$subtract`, etc.
- [02-string-operators.md](03-operators/02-string-operators.md) — `$concat`, `$toUpper`, `$toLower`, `$regexFind`
- [03-date-operators.md](03-operators/03-date-operators.md) — `$dateToString`, `$dateDiff`, `$year`, `$month`
- [04-array-operators.md](03-operators/04-array-operators.md) — `$filter`, `$map`, `$reduce`, `$slice`, `$size`
- [05-type-conversion-operators.md](03-operators/05-type-conversion-operators.md) — `$toInt`, `$toDouble`, `$convert`, `$toBool`
- [06-conditional-operators.md](03-operators/06-conditional-operators.md) — `$cond`, `$switch`, `$ifNull`

---

### 4. [04-indexing-and-schema/](04-indexing-and-schema/)
Performance optimization and data governance.
- [01-indexing.md](04-indexing-and-schema/01-indexing.md) — Index types (Single, Compound, Multikey, Partial, TTL) & `.explain("executionStats")`
- [02-schema-validation.md](04-indexing-and-schema/02-schema-validation.md) — Schema validation using `$jsonSchema`

---

### 5. [05-database-administration/](05-database-administration/)
Administration, migration, and security tooling.
- [01-import-export-json.md](05-database-administration/01-import-export-json.md) — `mongoimport` & `mongoexport` CLI utilities
- [02-db-backup-and-restore.md](05-database-administration/02-db-backup-and-restore.md) — `mongodump` & `mongorestore` tools
- [03-authorization-user-management.md](05-database-administration/03-authorization-user-management.md) — Users, roles, and authentication

---

### 6. [06-practice/](06-practice/)
Comprehensive challenge sets.
- [01-mixed-practice-challenges.md](06-practice/01-mixed-practice-challenges.md) — 30 progressive, real-world scenario challenges
