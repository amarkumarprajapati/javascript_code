# $sort and $limit Stages

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 15. Top 3 most expensive products
db.products.aggregate([
  { $sort: { price: -1 } },
  { $limit: 3 },
  { $project: { name: 1, price: 1, brand: 1 } }
])

// 16. Top 5 orders by totalAmount
db.orders.aggregate([
  { $sort: { totalAmount: -1 } },
  { $limit: 5 }
])
```

---
