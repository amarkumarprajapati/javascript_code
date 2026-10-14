# 05 - Search & Complex Queries

---

## 5.1 Text Search

```js
// 1. Create text index (run only once)
db.products.createIndex({ name: "text", brand: "text", tags: "text" })

// 2. Simple text search
db.products.find({ $text: { $search: "iphone" } })

// 3. Search multiple words (OR)
db.products.find({ $text: { $search: "nike air" } })

// 4. Search exact phrase
db.products.find({ $text: { $search: "\"air max\"" } })

// 5. Exclude a word
db.products.find({ $text: { $search: "apple -macbook" } })

// 6. Text search with score
db.products.find(
  { $text: { $search: "premium" } },
  { score: { $meta: "textScore" }, name: 1, brand: 1 }
).sort({ score: { $meta: "textScore" } })
```

---

## 5.2 Regex Search

```js
// 7. Case-insensitive search
db.products.find({ name: { $regex: /air/i } })

// 8. Starts with
db.products.find({ name: { $regex: /^The/ } })

// 9. Ends with
db.products.find({ brand: { $regex: /on$/i } })   // Sony, etc.

// 10. Contains
db.users.find({ email: { $regex: /email\.com$/ } })
```

> Note: Leading wildcard regex (`/.*abc/`) cannot use index efficiently.

---

## 5.3 Array Query Operators

```js
// 11. Array contains value
db.products.find({ tags: "bestseller" })

// 12. Array contains all values
db.products.find({ tags: { $all: ["bestseller", "premium"] } })

// 13. Array size
db.products.find({ variants: { $size: 3 } })
db.orders.find({ items: { $size: 2 } })

// 14. Array element matches condition
db.products.find({ "variants.price": { $lt: 10000 } })

// 15. $elemMatch – multiple conditions on same array element
db.products.find({
  variants: {
    $elemMatch: { color: "Black", stock: { $gt: 20 } }
  }
})

db.users.find({
  paymentMethods: {
    $elemMatch: { type: "card", isDefault: true }
  }
})
```

---

## 5.4 Nested Object Queries

```js
// 16. Exact nested match
db.users.find({ "address.city": "Mumbai" })

// 17. Multiple nested fields
db.users.find({
  "address.state": "Maharashtra",
  "address.city": "Pune"
})

// 18. Nested + comparison
db.products.find({ "specs.dimensions.length": { $gt: 20 } })

// 19. Exists
db.products.find({ "specs.battery": { $exists: true } })
db.orders.find({ "payment.paidAt": { $ne: null } })
```

---

## 5.5 Logical Operators

```js
// 20. $and (implicit and explicit)
db.products.find({
  $and: [
    { price: { $gte: 1000 } },
    { price: { $lte: 10000 } },
    { rating: { $gte: 4.5 } }
  ]
})

// 21. $or
db.orders.find({
  $or: [
    { status: "delivered" },
    { status: "shipped" }
  ]
})

// 22. $nor
db.products.find({
  $nor: [
    { tags: "budget" },
    { price: { $lt: 1000 } }
  ]
})

// 23. $not
db.products.find({ price: { $not: { $gt: 50000 } } })
```

---

## 5.6 Complex Combined Queries

```js
// 24. Users who prefer Electronics (category 1) and live in Maharashtra
db.users.find({
  "preferences.favoriteCategories": 1,
  "address.state": "Maharashtra"
})

// 25. Orders that contain a specific product AND total > 5000
db.orders.find({
  "items.productId": 1,
  totalAmount: { $gt: 5000 }
})

// 26. Products that are either premium tagged OR price > 50000
db.products.find({
  $or: [
    { tags: "premium" },
    { price: { $gt: 50000 } }
  ]
})

// 27. Reviews with rating 5 that have at least one seller reply
db.reviews.find({
  rating: 5,
  replies: {
    $elemMatch: { isSeller: true }
  }
})
```

---

## 5.7 Array Filtering in Aggregation ($filter)

```js
// 28. Show only variants that are in stock
db.products.aggregate([
  {
    $project: {
      name: 1,
      inStockVariants: {
        $filter: {
          input: "$variants",
          as: "v",
          cond: { $gt: ["$$v.stock", 0] }
        }
      }
    }
  }
])

// 29. Show only default payment method of users
db.users.aggregate([
  {
    $project: {
      firstName: 1,
      lastName: 1,
      defaultPayment: {
        $filter: {
          input: "$paymentMethods",
          as: "pm",
          cond: { $eq: ["$$pm.isDefault", true] }
        }
      }
    }
  }
])
```

---

## Practice Challenges

1. Find all products that have tag `"trending"` **or** brand `"Apple"`.
2. Find users who have both `"card"` and `"upi"` as payment methods.
3. Find orders where any item has `quantity >= 2`.
4. Search products with text search for `"pro"` and sort by text score.
5. Find reviews that have **more than 1 reply**.
6. Find products whose `specs.color` is `"Black"` and stock > 50.
7. Using `$filter`, show only the variants with price < 10000 for every product.
