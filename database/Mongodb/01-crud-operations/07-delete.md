# Delete Operations

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 36. Delete one document
db.users.deleteOne({ _id: 13 })

// 37. Delete many documents
db.products.deleteMany({ brand: "TestBrand" })

// 38. Delete all reviews with rating 1 (be careful!)
// db.reviews.deleteMany({ rating: 1 })
```

---
