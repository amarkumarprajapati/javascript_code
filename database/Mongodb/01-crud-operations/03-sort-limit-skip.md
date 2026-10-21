# Sorting, Limit, Skip

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 19. Top 5 highest rated products
db.products.find().sort({ rating: -1 }).limit(5)

// 20. Cheapest 3 products
db.products.find().sort({ price: 1 }).limit(3)

// 21. Latest 5 orders
db.orders.find().sort({ orderDate: -1 }).limit(5)

// 22. Skip first 5 users and show next 5
db.users.find().skip(5).limit(5)
```

---
