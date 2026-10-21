# 11 - Date Operators

## Date Field Extraction ($month, $year, $dayOfMonth, etc.)

```js
{ $year: <date> }
{ $month: <date> }
{ $week: <date> }        // ISO week number
{ $dayOfMonth: <date> }  // day of month (1-31)
{ $dayOfWeek: <date> }   // 1 (Sunday) to 7 (Saturday)
{ $dayOfYear: <date> }
{ $hour: <date> }
{ $minute: <date> }
{ $second: <date> }
{ $millisecond: <date> }
{ $isoDayOfWeek: <date> }  // ISO day of week (1=Monday to 7=Sunday)
{ $isoWeek: <date> }      // ISO week of year
{ $isoWeekYear: <date> }  // ISO week year
```

**Example:**
```js
db.orders.aggregate([
  {
    $project: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      day: { $dayOfMonth: "$date" }
    }
  }
]);
```

---

## Date Arithmetic

### $dateAdd / $dateSubtract

```js
{
  $dateAdd: {
    startDate: <expression>,
    unit: "day",           // "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year"
    amount: <number>,
    timezone: <string>     // optional
  }
}
{
  $dateSubtract: { startDate: <expression>, unit: <string>, amount: <number> }
}
```

**Example:**
```js
db.orders.aggregate([
  {
    $project: {
      deliveryExpected: {
        $dateAdd: { startDate: "$orderDate", unit: "day", amount: 3 }
      }
    }
  }
]);
```

### $dateDiff

```js
{
  $dateDiff: {
    startDate: <expression>,
    endDate: <expression>,
    unit: "day",
    timezone: <string>
  }
}
```

**Example:**
```js
db.orders.aggregate([
  {
    $project: {
      daysSinceOrder: {
        $dateDiff: { startDate: "$orderDate", endDate: new Date(), unit: "day" }
      }
    }
  }
]);
```

### $dateTrunc

Truncates a date to a specified granularity.

```js
{
  $dateTrunc: {
    date: <expression>,
    unit: "month",       // "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond"
    timezone: <string>,
    binValue: <number>   // optional, offset multiplier
  }
}
```

---

## Date Construction & Conversion

### $dateFromParts

Builds a Date object from individual components.
```js
{
  $dateFromParts: {
    year: 2025,
    month: 1,
    day: 15,
    hour: 10,
    minute: 30,
    second: 0,
    timezone: "UTC"
  }
}
```

### $dateToParts

Splits a Date into components.
```js
{
  $dateToParts: { date: "$date", timezone: "UTC" }
}
// Output: { year, month, day, hour, minute, second, date, timezone, ... }
```

### $toDate / $dateFromString

```js
{ $toDate: <expression> }   // Accepts number (ms), string, or Date

{ $dateFromString: { dateString: <expr> } }   // String to Date
```
