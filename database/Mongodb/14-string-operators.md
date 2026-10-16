# 14 - String Operators

## Case Conversion

### $toString

**Syntax:** Converts a value to a string.
```js
{ $toString: <expression> }
```
```js
// In $project
{ $project: { idStr: { $toString: "$_id" } } }
```

### $toUpperCase / $toLowerCase

**Syntax:**
```js
{ $toUpperCase: <expression> }
{ $toLowerCase: <expression> }
```

**Example:**
```js
db.users.aggregate([
  { $project: { lower: { $toLowerCase: "$name" }, upper: { $toUpperCase: "$name" } } }
]);
```

---

## Date ↔ String Conversion

### $dateFromString

**Syntax:**
```js
{
  $dateFromString: {
    dateString: <expression>,
    format: <string>,        // optional, e.g. "%Y-%m-%d"
    timezone: <string>,      // optional
    onError: <expression>,   // optional, value on error
    onNull: <expression>     // optional, value on null input
  }
}
```

**Common format specifiers:**
| Specifier | Meaning |
|---|---|
| `%Y` | Year (4 digits) |
| `%m` | Month (2 digits, 01-12) |
| `%d` | Day of month (2 digits, 01-31) |
| `%H` | Hour (00-23) |
| `%M` | Minute (00-59) |
| `%S` | Second (00-59) |

**Example:**
```js
db.orders.aggregate([
  {
    $project: {
      orderDate: {
        $dateFromString: { dateString: "$orderStr", format: "%Y-%m-%d" }
      }
    }
  }
]);
```

### $dateToString

**Syntax:**
```js
{
  $dateToString: {
    format: <string>,         // default: "%Y-%m-%dT%H:%M:%S"
    date: <expression>,
    timezone: <string>,
    onNull: <expression>
  }
}
```

**Example:**
```js
db.orders.aggregate([
  {
    $project: {
      date: {
        $dateToString: { format: "%Y-%m-%d", date: "$orderDate" }
      }
    }
  }
]);
```

---

## String Manipulation

### $replaceOne / $replaceAll

```js
{ $replaceOne: { input: <expr>, from: "old", to: "new" } }
{ $replaceAll: { input: <expr>, from: "old", to: "new" } }
```

**Example:**
```js
db.products.aggregate([
  {
    $project: {
      cleaned: { $replaceOne: { input: "$description", from: " ", to: "_" } }
    }
  }
]);
```

### $trim / $ltrim / $rtrim

```js
{ $trim: <expression> }
{ $ltrim: <expression> }
{ $rtrim: <expression> }
// Or with options (remove specific chars):
{ $trim: { input: <expr>, chars: " \t\n" } }
```

### $indexOfBytes / $indexOfCP

Returns the index of the first occurrence of a substring (`-1` if not found).

```js
{ $indexOfBytes: [ <string>, <substring> ] }
{ $indexOfCP: [ <string>, <substring> ] }
// $indexOfBytes uses byte positions, $indexOfCP uses code point positions
```

### $concat / $split

```js
{ $concat: [ <expr>, " ", <expr> ] }
{ $split: [ <string>, <delimiter> ] }
```

**Example:**
```js
db.users.aggregate([
  { $project: { full: { $concat: ["$firstName", " ", "$lastName"] } } },
  { $project: { tags: { $split: ["$tagStr", ","] } } }
]);
```

### $strLenBytes / $strLenCP

```js
{ $strLenBytes: <expression> }
{ $strLenCP: <expression> }
```

### $strcasecmp

**Case-insensitive comparison:**
```js
{ $strcasecmp: [ <expr1>, <expr2> ] }
// Returns: 0 (equal), -1 (expr1 < expr2), 1 (expr1 > expr2)
```

### $substr / $substrBytes / $substrCP

```js
{ $substr: [ <string>, <start>, <length> ] }
{ $substrBytes: [ <string>, <start>, <length> ] }
{ $substrCP: [ <string>, <start>, <length> ] }
```

---

## Regex Operators

### $regexMatch

**Syntax:**
```js
{
  $regexMatch: {
    input: <expression>,
    regex: <regex>,
    options: <string>   // optional, e.g. "i" for case-insensitive
  }
}
```

**Example:**
```js
db.users.aggregate([
  { $match: { email: { $regex: "@gmail\\.com$" } } },
  {
    $project: {
      isGmail: {
        $regexMatch: { input: "$email", regex: "@gmail.com$", options: "i" }
      }
    }
  }
]);
```

### $regexFind / $regexFindAll

**Syntax (regexFind):**
```js
{
  $regexFind: {
    input: <expression>,
    regex: <regex>,
    options: <string>
  }
}
// Returns: { match: [...], idx: { location: 0 }, string: "..." }
```

**Syntax (regexFindAll):**
```js
{
  $regexFindAll: {
    input: <expression>,
    regex: <regex>,
    options: <string>
  }
}
// Returns array of match objects
```

**Example ($regexFindAll):**
```js
db.products.aggregate([
  {
    $project: {
      matches: {
        $regexFindAll: { input: "$tags", regex: "best|new", options: "i" }
      }
    }
  }
]);
```
