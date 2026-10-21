# Counting & Distinct

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 23. How many users are active?
db.users.countDocuments({ isActive: true })

// 24. How many products belong to category 1?
db.products.countDocuments({ categoryId: 1 })

// 25. Distinct cities of users
db.users.distinct("address.city")

// 26. Distinct brands of products
db.products.distinct("brand")

// 27. Distinct status values in orders
db.orders.distinct("status")
```

---
