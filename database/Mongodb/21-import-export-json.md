# 21 - JSON Import / Export

## Import JSON: `mongoimport`

```bash
mongoimport --uri="mongodb://localhost:27017/dbname" --collection=users --json --file=users.json --stopOnError

# Drop collection before import
mongoimport --drop --uri="mongodb://localhost:27017/test" --collection=users --json --file=users.json

# Import from array
mongoimport --jsonArray users.json
```

## Export JSON: `mongoexport`

```bash
# Export all documents
mongoexport --db=test --collection=users --out=users.json

# Export with query filter
mongoexport --db=test --collection=users --query='{ "status": "active" }' --out=active.json

# Export in JSON array format
mongoexport --db=test --collection=users --jsonArray --out=users_array.json

# Export specific fields
mongoexport --db=test --collection=users --fields=name,email --out=subset.json
```
