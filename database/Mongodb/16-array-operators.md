# 16 - Array Operators

### $arrayElemAt

Returns the element at an index (supports negative indices).
```js
{ $arrayElemAt: [ <array>, <index> ] }
```

### $firstN / $lastN / $maxN / $minN

```js
// In $push with $firstN
{ $push: { field: { $firstN: { input: <array>, n: 5 } } } }

// As standalone operators
{ $maxN: { input: <array>, n: 3 } }    // top 3 values
{ $minN: { input: <array>, n: 3 } }    // bottom 3 values
```

### $slice / $reverseArray / $size

```js
{ $slice: [ <array>, 3 ] }           // first 3
{ $slice: [ <array>, -2 ] }          // last 2
{ $reverseArray: <array> }
{ $size: <array> }
```

### $sortArray

Sorts an array.
```js
{
  $sortArray: { input: <array>, sortBy: 1 }  // or -1, { $number: 1 }
}
```

### $in

Checks if a value is in an array.
```js
{ $in: [ <expression>, <array> ] }
// Example: { $in: ["$status", ["active", "pending"] } ]
```

### $indexOfArray

```js
{ $indexOfArray: [ <array>, <value> ] }
// Returns index or -1
```

### $isArray

```js
{ $isArray: <expression> }   // boolean
```

### $map

Transforms each element of an array.
```js
{
  $map: {
    input: <array>,
    as: "item",             // optional alias (default: "$$this")
    in: { $multiply: ["$$item", 2] }
  }
}
```

### $filter

Filters elements of an array.
```js
{
  $filter: {
    input: <array>,
    as: "item",
    cond: { $gte: ["$$item", 10] }
  }
}
```

### $reduce

Reduces an array to a single value.
```js
{
  $reduce: {
    input: <array>,
    initialValue: 0,
    in: { $add: ["$$value", "$$this"] }
  }
}
```

### $range / $concatArrays / $zip

```js
{ $range: [1, 5] }          // [1, 2, 3, 4]
{ $concatArrays: [[1,2], [3,4]] }  // [1,2,3,4]
{ $zip: { inputs: [[1,2], [3,4]] } }  // [[1,3], [2,4]]
```

### $arrayToObject / $objectToArray

```js
{ $arrayToObject: [["a", 1], ["b", 2]] }  // { a: 1, b: 2 }
{ $objectToArray: { a: 1, b: 2 } }        // [["a", 1], ["b", 2]]
```
