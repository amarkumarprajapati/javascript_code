# $match Stage

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 1. Only delivered orders
db.orders.aggregate([
  { $match: { status: "delivered" } }
])

// 2. Products with rating >= 4.5 and price < 10000
db.products.aggregate([
  {
    $match: {
      rating: { $gte: 4.5 },
      price: { $lt: 10000 }
    }
  }
])

// 3. Users from Mumbai or Delhi
db.users.aggregate([
  {
    $match: {
      "address.city": { $in: ["Mumbai", "Delhi"] }
    }
  }
])
```

---
