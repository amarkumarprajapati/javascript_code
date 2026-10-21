# Update Operations (Basic)

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 30. Update one field
db.users.updateOne(
  { _id: 1 },
  { $set: { "address.city": "Thane" } }
)

// 31. Increase stock of a product by 10
db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: 10 } }
)

// 32. Add a new tag to a product
db.products.updateOne(
  { _id: 3 },
  { $addToSet: { tags: "comfortable" } }
)

// 33. Update nested field inside array (change default payment)
db.users.updateOne(
  { _id: 1, "paymentMethods.isDefault": true },
  { $set: { "paymentMethods.$.isDefault": false } }
)

// 34. Add a new payment method to a user
db.users.updateOne(
  { _id: 4 },
  {
    $push: {
      paymentMethods: {
        type: "card",
        last4: "8888",
        provider: "Visa",
        isDefault: true
      }
    }
  }
)

// 35. Update many documents
db.products.updateMany(
  { stock: { $lt: 50 } },
  { $set: { lowStock: true } }
)
```

---
