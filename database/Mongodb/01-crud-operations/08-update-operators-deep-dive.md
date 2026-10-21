# 02 - Update Operators Deep Dive

---

## 8.1 Field Update Operators

```js
// 1. $set
db.products.updateOne({ _id: 5 }, { $set: { stock: 250 } })

// 2. $unset (remove a field)
db.products.updateOne({ _id: 5 }, { $unset: { lowStock: "" } })

// 3. $inc
db.products.updateOne({ _id: 11 }, { $inc: { stock: -5 } })
db.products.updateOne({ _id: 11 }, { $inc: { rating: 0.1 } })

// 4. $min / $max
db.products.updateOne({ _id: 3 }, { $min: { price: 8499 } })  // only if current > 8499
db.products.updateOne({ _id: 3 }, { $max: { stock: 150 } })   // only if current < 150

// 5. $mul
db.products.updateOne({ _id: 7 }, { $mul: { price: 0.9 } })   // 10% discount
```

---

## 8.2 Array Update Operators

```js
// 6. $push
db.products.updateOne(
  { _id: 2 },
  { $push: { tags: "flagship" } }
)

// 7. $push with $each
db.products.updateOne(
  { _id: 2 },
  { $push: { tags: { $each: ["5g", "ai"] } } }
)

// 8. $addToSet (no duplicates)
db.products.updateOne(
  { _id: 2 },
  { $addToSet: { tags: "flagship" } }
)

// 9. $pop (remove first or last)
db.products.updateOne({ _id: 2 }, { $pop: { tags: 1 } })   // remove last
db.products.updateOne({ _id: 2 }, { $pop: { tags: -1 } })  // remove first

// 10. $pull (remove by condition)
db.products.updateOne(
  { _id: 2 },
  { $pull: { tags: "ai" } }
)

// 11. $pullAll
db.products.updateOne(
  { _id: 2 },
  { $pullAll: { tags: ["5g", "flagship"] } }
)
```

---

## 8.3 Updating Array of Objects

```js
// 12. Positional $ operator (first matching element)
db.users.updateOne(
  { _id: 1, "paymentMethods.type": "card" },
  { $set: { "paymentMethods.$.last4": "9999" } }
)

// 13. All positional $[ ] with arrayFilters
db.products.updateOne(
  { _id: 1 },
  { $inc: { "variants.$[v].stock": -2 } },
  { arrayFilters: [{ "v.storage": "256GB" }] }
)

// 14. Update nested field inside array of objects
db.orders.updateOne(
  { _id: 1001 },
  { $set: { "items.$[item].quantity": 2 } },
  { arrayFilters: [{ "item.productId": 11 }] }
)
```

---

## 8.4 $push with $sort and $slice

```js
// 15. Keep only latest 5 tags (example)
db.products.updateOne(
  { _id: 1 },
  {
    $push: {
      tags: {
        $each: ["limited-edition"],
        $slice: -5          // keep only last 5
      }
    }
  }
)
```

---

## 8.5 updateMany Examples

```js
// 16. Mark all low stock products
db.products.updateMany(
  { stock: { $lt: 50 } },
  { $set: { lowStock: true } }
)

// 17. Increase price of all products in category 1 by 5%
db.products.updateMany(
  { categoryId: 1 },
  { $mul: { price: 1.05 } }
)

// 18. Deactivate users who have no payment methods
db.users.updateMany(
  { paymentMethods: { $size: 0 } },
  { $set: { isActive: false } }
)
```

---

## Practice Challenges

1. Reduce stock of product `_id: 12` by 3 using `$inc`.
2. Add tag `"eco-friendly"` to product `_id: 7` only if it doesn’t already exist.
3. Change the default payment method of user `_id: 3` to the second payment method.
4. Using `arrayFilters`, set stock = 0 for all variants of product `_id: 1` that have color containing “Titanium”.
5. Remove the tag `"budget"` from all products that have it.
6. Give a 15% discount (`$mul`) to all products with rating ≥ 4.7.
