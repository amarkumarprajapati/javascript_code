# 17 - Type Conversion Operators

### $toString / $toInt / $toLong / $toDouble / $toDecimal / $toBool / $toDate / $toObjectId

All follow the same pattern:
```js
{ $toString: <expression> }
{ $toInt: <expression> }
{ $toLong: <expression> }
{ $toDouble: <expression> }
{ $toDecimal: <expression> }
{ $toBool: <expression> }
{ $toDate: <expression> }
{ $toObjectId: <expression> }
```

### $convert

Generic type conversion with error handling.
```js
{
  $convert: {
    input: <expression>,
    to: "int",           // "double" | "int" | "long" | "decimal" | "string" | "date" | "bool" | ...
    onError: 0,          // value to return on error (optional)
    onNull: 0            // value to return if input is null (optional)
  }
}
// Alias: $toInt, $toString, etc. are shorthand for $convert
```

### $type

Returns the BSON type name of a value.
```js
{ $type: <expression> }
// Returns: "int", "long", "double", "string", "date", "object", "array", "bool", etc.
```

### $isNumber

Returns `true` if the value is a number (int, long, double, decimal).
```js
{ $isNumber: <expression> }
```
