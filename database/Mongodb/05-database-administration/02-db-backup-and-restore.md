# 18 - DB Backup and Restore

## `mongodump` / `mongorestore`

### Backup (Binary)
```bash
# Backup entire mongod instance
mongodump --uri="mongodb://localhost:27017"

# Backup specific database
mongodump --db=mydb --out=/backups/mydb

# Backup specific collection
mongodump --db=mydb --collection=users --out=/backups/users

# Backup with authentication
mongodump --username=user --password=pass --authenticationDatabase=admin
```

### Restore
```bash
# Restore entire backup
mongorestore /backups/dump

# Restore specific database (renamed)
mongorestore --db=newdb /backups/mydb

# Restore specific collection
mongorestore --db=mydb --collection=users /backups/users.bson

# Drop target before restore
mongorestore --drop /backups/dump
```

## `bsondump`
Converts BSON dump files to JSON for inspection:
```bash
bsondump /backups/users.bson
```

## Filesystem Snapshots (for replica sets / clusters)
Use tools like:
- **LVM snapshots** (Linux)
- **Volume Shadow Copy** (Windows)
- **Cloud snapshots** (AWS EBS, Azure Disk, GCP Persistent Disk)

## MongoDB Atlas Backup
Use **Automated Snapshots** or **Continuous Backups** in Atlas UI or:
```bash
# Create snapshot via API (Atlas)
curl -X POST "https://cloud.mongodb.com/api/atlas/v2/groups/{GROUP-ID}/backup/snapshots" \
  -H "Accept: application/json" \
  -u "API_KEY:API_SECRET"
```
