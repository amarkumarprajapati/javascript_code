# 09 - Arithmetic Operators

These operators perform mathematical operations in aggregation expressions.

## Numeric Operators

### $add / $subtract / $multiply / $divide

**Syntax:**
```js
{ $add: [ <expression1>, <expression2>, ... ] }
{ $subtract: [ <expression1>, <expression2> ] }
{ $multiply: [ <expression1>, <expression2>, ... ] }
{ $divide: [ <expression1>, <expression2> ] }
```

**Examples:**
```js
db.sales.aggregate([
  {
    $addFields: {
      totalRevenue: { $multiply: ["$price", "$quantity"] },
      profit: { $subtract: ["$totalRevenue", "$cost"] },
      discount10: { $divide: ["$totalRevenue", 10] }
    }
  }
]);
```

### $mod

**Syntax:**
```js
{ $mod: [ <expression>, <divisor> ] }
```

**Example:**
```js
db.orders.aggregate([
  { $project: { orderID: 1, evenOdd: { $mod: ["$_id", 2] } } }
]);
```

### $pow

**Syntax:**
```js
{ $pow: [ <base>, <exponent> ] }
```

**Example:**
```js
db.products.aggregate([
  { $project: { name: 1, area: { $pow: ["$side", 2] } } }
]);
```

### $round

**Syntax:**
```js
{ $round: [ <expression>, <place> ] }
// place defaults to 0 (round to integer)
```

**Examples:**
```js
// Round to 2 decimal places
{ $round: ["$price", 2] }
// Round to nearest 10
{ $round: ["$price", -1] }
// Round to integer (default)
{ $round: ["$price"] }
```

### $sqrt

**Syntax:**
```js
{ $sqrt: <expression> }
```

**Example:**
```js
db.triangles.aggregate([
  { $project: { hypotenuse: { $sqrt: { $add: [{ $pow: ["$a", 2] }, { $pow: ["$b", 2] }] } } } }
]);
```

### $abs, $ceil, $floor, $trunc

**Syntax:**
```js
{ $abs: <expression> }
{ $ceil: <expression> }
{ $floor: <expression> }
{ $trunc: [ <expression>, <place> ] }
```

| Operator | Description | Example |
|---|---|---|
| `$abs` | Absolute value | `{ $abs: -5 }` → `5` |
| `$ceil` | Round up | `{ $ceil: 4.2 }` → `5` |
| `$floor` | Round down | `{ $floor: 4.8 }` → `4` |
| `$trunc` | Truncate (optionally to decimal place) | `{ $trunc: [4.8, 0] }` → `4` |
