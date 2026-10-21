# 19 - Authorization & User Management

## Roles Overview

| Built-in Role | Scope | Permissions |
|---|---|---|
| `read` | database | Read all collections + `system.indexes` |
| `readWrite` | database | Read + write (no admin/indices) |
| `dbAdmin` | database | Indexing, profiling, validation, `system.profile` |
| `userAdmin` | database | Create/drop users (can escalate) |
| `root` | admin | Full access to everything |

## Create User
```js
use admin
db.createUser({
  user: "appUser",
  pwd: "strongPassword123",
  roles: [
    { role: "readWrite", db: "appDB" },
    { role: "read", db: "reporting" }
  ]
})

// Verify
db.getUser("appUser")
db.getUsers()
```

## Grant / Revoke Roles
```js
db.grantRolesToUser("appUser", [{ role: "dbAdmin", db: "appDB" }])
db.revokeRolesFromUser("appUser", [{ role: "read", db: "reporting" }])
```

## Delete User
```js
db.dropUser("appUser")
db.dropAllUsersFromDatabase()
```

## Authentication (Enabling)
1. Start `mongod` with `--auth`:
   ```bash
   mongod --auth --dbpath=/data/db
   ```
2. Or in `mongod.conf`:
   ```yaml
   security:
     authorization: enabled
   ```

## Connect with Auth
```bash
# Interactive prompt for password
mongo -u "appUser" -p --authenticationDatabase "admin"

# URI connection
mongo "mongodb://appUser:password@localhost:27017/appDB?authSource=admin"
```

## Field-Level Redaction (Enterprise)
```js
db.reporting.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: [{ $switchRedact: { ... } }, true] },
        then: "$$PRUNE",
        else: "$$KEEP"
      }
    }
  }
]);
```

## Best Practices
- Never use `root` for application connections; grant least privilege.
- Store credentials securely (use environment variables or secret managers, not in code).
- Use `--keyFile` for replica set internal authentication.
- Regularly rotate passwords/keys.
- Use TLS/SSL for connections in production.
