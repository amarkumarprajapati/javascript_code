# Read Operations (Find)

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


### Easy
```js
// 1. Find all users
db.users.find()

// 2. Find one user by _id
db.users.findOne({ _id: 1 })

// 3. Find all products with rating greater than 4.5
db.products.find({ rating: { $gt: 4.5 } })

// 4. Find users who live in Mumbai
db.users.find({ "address.city": "Mumbai" })

// 5. Find products that have the tag "bestseller"
db.products.find({ tags: "bestseller" })
```

### Medium
```js
// 6. Find users who have at least one payment method of type "upi"
db.users.find({ "paymentMethods.type": "upi" })

// 7. Find products that have variants (variants array is not empty)
db.products.find({ variants: { $ne: [] } })
// or
db.products.find({ "variants.0": { $exists: true } })

// 8. Find orders with status "delivered" and totalAmount > 10000
db.orders.find({
  status: "delivered",
  totalAmount: { $gt: 10000 }
})

// 9. Find users whose favoriteCategories includes category 1
db.users.find({ "preferences.favoriteCategories": 1 })

// 10. Find products where stock is less than 50
db.products.find({ stock: { $lt: 50 } })
```

### Hard
```js
// 11. Find users who have a default payment method of type "card"
db.users.find({
  paymentMethods: {
    $elemMatch: { type: "card", isDefault: true }
  }
})

// 12. Find products that have a variant with storage "512GB"
db.products.find({ "variants.storage": "512GB" })

// 13. Find orders that contain productId 1 inside items array
db.orders.find({ "items.productId": 1 })

// 14. Find reviews that have at least one reply
db.reviews.find({ "replies.0": { $exists: true } })

// 15. Find users who have notifications.email = true AND notifications.push = true
db.users.find({
  "preferences.notifications.email": true,
  "preferences.notifications.push": true
})
```

---
