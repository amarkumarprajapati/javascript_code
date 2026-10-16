# 18 - Conditional Operators

### $cond

If-then-else.
```js
{
  $cond: {
    if: <expression>,                     // condition
    then: <expression>,                   // result if true
    else: <expression>                    // result if false
  }
}
// Shorthand:
{ $cond: [<condition>, <then>, <else>] }
```

**Example:**
```js
db.products.aggregate([
  {
    $project: {
      category: {
        $cond: { if: { $gte: ["$price", 100] }, then: "premium", else: "standard" }
      }
    }
  }
]);
```

### $ifNull

Returns the first non-null value.
```js
{
  $ifNull: [ <expression>, <replacement> ]
}
// If <expression> is null or missing, returns <replacement>
```

**Example:**
```js
db.users.aggregate([
  { $project: { name: { $ifNull: ["$name", "Anonymous"] } } }
]);
```

### $switch

Multi-branch conditional.
```js
{
  $switch: {
    branches: [
      { case: <expression>, then: <expression> },
      { case: <expression>, then: <expression> }
    ],
    default: <expression>   // optional, value if no case matches
  }
}
```

**Example:**
```js
db.grades.aggregate([
  {
    $project: {
      grade: {
        $switch: {
          branches: [
            { case: { $gte: ["$score", 90] }, then: "A" },
            { case: { $gte: ["$score", 80] }, then: "B" },
            { case: { $gte: ["$score", 70] }, then: "C" }
          ],
          default: "F"
        }
      }
    }
  }
]);
```
